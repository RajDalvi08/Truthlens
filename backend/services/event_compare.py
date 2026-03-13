"""
Event Comparison Service
=========================
Orchestrates bias analysis for multiple related articles.
"""

from services.article_fetcher import fetch_article
from services.preprocessing import clean_article
from services.bias_engine import analyze_bias
from services.event_search import search_related_articles
from services.bias_visualizer import generate_bias_bar
from typing import Dict, List

def compare_event(main_url: str) -> Dict:
    """
    Main workflow for event-level bias analysis.
    
    1. Fetch main article.
    2. Search related articles.
    3. Analyze all articles.
    4. Return structured comparison.
    """
    # 1. Fetch main article
    try:
        raw_main = fetch_article(main_url)
    except Exception as e:
        return {"error": f"Failed to fetch main article: {str(e)}"}

    cleaned_main = clean_article(raw_main)
    headline = cleaned_main["headline"]
    
    if not headline:
        # Fallback if headline is empty
        headline = main_url

    # 2. Search related articles
    related_items = search_related_articles(headline)
    
    # 3. Analyze main article
    main_result = analyze_bias(cleaned_main)
    main_result["source"] = raw_main.get("source", "Unknown")
    
    all_results = [main_result]
    
    # 4. Analyze related articles
    for item in related_items:
        related_url = item["url"]
        if related_url == main_url:
            continue
            
        try:
            raw_article = fetch_article(related_url)
            cleaned_article = clean_article(raw_article)
            if cleaned_article["text"]:
                result = analyze_bias(cleaned_article)
                result["source"] = raw_article.get("source", "Unknown")
                all_results.append(result)
        except Exception:
            # Skip articles that fail to fetch
            continue

    # 5. Sort by bias_score descending
    all_results.sort(key=lambda x: x["bias_score"], reverse=True)

    # 6. Generate visualizations for sorted results
    for article in all_results:
        article["bias_visual"] = generate_bias_bar(article["bias_score"])

    return {
        "event": headline,
        "articles": all_results
    }
