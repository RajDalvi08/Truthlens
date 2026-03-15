"""
Event Search Service
=====================
Searches Google News RSS for articles related to a given headline.
"""

import requests
import feedparser
import urllib.parse
from typing import List, Dict

def search_related_articles(headline: str, limit: int = 5) -> List[Dict[str, str]]:
    """
    Search related articles on Google News using RSS.
    
    Args:
        headline: Title of the article to find related news for.
        limit: Max number of articles to return.
        
    Returns:
        List of dicts with 'title' and 'url'.
    """
    if not headline:
        return []

    # Build RSS search query
    query = urllib.parse.quote(headline)
    rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"

    try:
        feed = feedparser.parse(rss_url)
        results = []
        
        for entry in feed.entries[:limit]:
            results.append({
                "title": entry.title,
                "url": entry.link
            })
            
        return results
    except Exception as e:
        print(f"Error searching related articles: {e}")
        return []
