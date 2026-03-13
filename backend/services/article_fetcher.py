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


def _get_page(session: requests.Session, url: str) -> requests.Response:
    """Fetch the page HTML, with a fast fail for blocked sources."""
    headers = _build_headers(url)

    # Use a shorter timeout so the UI doesn't hang for too long on blocked URLs.
    timeout = (3, 6)  # (connect, read)

    try:
        response = session.get(url, headers=headers, timeout=timeout, verify=False)
        response.raise_for_status()
        return response
    except requests.HTTPError as exc:
        status = getattr(exc.response, "status_code", None)
        if status == 403:
            # Many sites block scraping; prompt user to provide raw text instead.
            raise requests.HTTPError(
                "Remote site returned 403 Forbidden (likely blocking scrapers). "
                "Please paste the article text instead of a URL."
            )

        if status in (429, 500, 502, 503, 504):
            logging.debug("Received %s from %s; retrying via proxy", status, url)
            proxy_url = ALL_ORIGINS_PROXY + urllib.parse.quote(url, safe="")
            response = session.get(proxy_url, headers=headers, timeout=timeout, verify=False)
            response.raise_for_status()
            return response

        raise
    except requests.RequestException as exc:
        # Connection errors and timeouts should try the proxy, but fail quickly.
        logging.debug("RequestException %s for %s; attempting proxy fallback", exc, url)
        proxy_url = ALL_ORIGINS_PROXY + urllib.parse.quote(url, safe="")
        response = session.get(proxy_url, headers=headers, timeout=timeout, verify=False)
        response.raise_for_status()
        return response


def fetch_article(url: str) -> dict:
    """Download a webpage and extract the headline and article text."""
    session = _create_session()

    response = _get_page(session, url)
    soup = BeautifulSoup(response.text, "html.parser")

    # 1. Extract headline
    h1 = soup.find("h1")
    headline = h1.get_text(strip=True) if h1 else ""

    # 2. Extract article text using fallback selectors
    article_text = ""
    selectors = [
        "p",
        "article",
        "div.article-body",
        "div[data-component='text-block']"
    ]
    
    for selector in selectors:
        elements = soup.select(selector)
        if elements:
            # Combine text from all elements found by this selector
            text_blocks = [el.get_text(strip=True) for el in elements]
            text = " ".join(t for t in text_blocks if t)
            if text.strip():
                article_text = text
                break

    if not article_text.strip():
        raise ValueError(f"No article text could be extracted from {url}")

    # Extract source domain for tracking purposes
    parsed_url = urllib.parse.urlparse(url)
    source = parsed_url.netloc

    return {
        "headline": headline,
        "text": article_text,
        "source": source
    }
