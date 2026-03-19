"""
Article Fetcher Service
========================
Scrapes article text and headline from a given URL using requests + BeautifulSoup.

The web is hostile to scrapers; many sites block non-browser traffic. This module
tries to be resilient by using realistic headers, retries, and a public proxy
fallback when a site returns 403/429.
"""

import urllib.parse
import logging

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.exceptions import InsecureRequestWarning
from urllib3.util.retry import Retry


# Public proxy used as a last resort when a site blocks direct scraping.
# NOTE: Dependent on the service availability; it should be treated as a fallback.
ALL_ORIGINS_PROXY = "https://api.allorigins.win/raw?url="

# Suppress warnings caused by verify=False (we want the service to work in captive/limited environments).
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


def _create_session() -> requests.Session:
    """Create a requests session with minimal retry behavior."""
    session = requests.Session()
    # Use no retries to avoid long hanging requests; we handle retries explicitly
    retry = Retry(
        total=0,
        connect=0,
        read=0,
        redirect=0,
        status=0,
        raise_on_status=False,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


def _build_headers(url: str) -> dict:
    """Return realistic browser-like headers for scraping."""
    parsed = urllib.parse.urlparse(url)
    referer = f"{parsed.scheme}://{parsed.netloc}/"

    return {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": referer,
        "Connection": "keep-alive",
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1",
    }


from newspaper import Article


def _get_page(session: requests.Session, url: str) -> requests.Response:
    """Fetch the page HTML, with a fallback to proxy for blocked sources."""
    headers = _build_headers(url)

    # Use a shorter timeout so the UI doesn't hang for too long on blocked URLs.
    timeout = (5, 10)  # (connect, read)

    try:
        response = session.get(url, headers=headers, timeout=timeout, verify=False)
        response.raise_for_status()
        return response
    except requests.HTTPError as exc:
        status = getattr(exc.response, "status_code", None)
        
        # If blocked (403) or rate-limited (429) or server error, try the proxy fallback
        if status in (403, 429, 500, 502, 503, 504):
            logging.debug("Received %s from %s; retrying via proxy", status, url)
            try:
                proxy_url = ALL_ORIGINS_PROXY + urllib.parse.quote(url, safe="")
                response = session.get(proxy_url, headers=headers, timeout=timeout, verify=False)
                response.raise_for_status()
                return response
            except Exception as proxy_exc:
                if status == 403:
                    raise requests.HTTPError(
                        f"Remote site returned 403 Forbidden and proxy fallback failed. "
                        f"The site is actively blocking scrapers. Error: {proxy_exc}"
                    )
                raise proxy_exc

        raise
    except requests.RequestException as exc:
        # Connection errors and timeouts should try the proxy, but fail quickly.
        logging.debug("RequestException %s for %s; attempting proxy fallback", exc, url)
        proxy_url = ALL_ORIGINS_PROXY + urllib.parse.quote(url, safe="")
        response = session.get(proxy_url, headers=headers, timeout=timeout, verify=False)
        response.raise_for_status()
        return response


def fetch_article(url: str) -> dict:
    """Download a webpage and extract the headline and article text using newspaper3k."""
    session = _create_session()

    response = _get_page(session, url)
    html_content = response.text
    
    # Use newspaper3k for robust extraction
    try:
        newspaper_article = Article(url)
        newspaper_article.download(input_html=html_content)
        newspaper_article.parse()
        
        headline = newspaper_article.title
        article_text = newspaper_article.text
    except Exception as exc:
        logging.error("newspaper3k extraction failed: %s. Falling back to BeautifulSoup.", exc)
        headline = ""
        article_text = ""

    # Fallback to BeautifulSoup if newspaper3k fails or returns very short text
    if not article_text.strip() or len(article_text) < 500:
        soup = BeautifulSoup(html_content, "html.parser")

        # 1. Extract headline
        if not headline:
            h1 = soup.find("h1")
            headline = h1.get_text(strip=True) if h1 else ""

        # 2. Broad paragraph extraction
        paragraphs = soup.find_all("p")
        if paragraphs:
            text_blocks = [p.get_text(strip=True) for p in paragraphs]
            # Join with double newline to maintain structure, filtering out micro-snippets
            article_text = "\n\n".join(t for t in text_blocks if len(t) > 25)

    if not article_text.strip():
        raise ValueError(f"No article text could be extracted from {url}. The page might be empty or content is loaded via JavaScript.")

    print("FETCHED TEXT LENGTH:", len(article_text))
    print("FETCH SAMPLE:", article_text[:300])

    # Extract source domain for tracking purposes
    parsed_url = urllib.parse.urlparse(url)
    source = parsed_url.netloc

    return {
        "headline": headline,
        "text": article_text,
        "source": source
    }
