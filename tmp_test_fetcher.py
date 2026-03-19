import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.article_fetcher import fetch_article

# A BBC URL to test
url = "https://www.bbc.com/news/world-us-canada-68582772"

try:
    print(f"Testing URL: {url}")
    result = fetch_article(url)
    print("SUCCESS")
    print(f"HEADLINE: {result['headline']}")
    print(f"TEXT LENGTH: {len(result['text'])}")
    print(f"SAMPLE: {result['text'][:300]}...")
except Exception as e:
    print(f"FAILED: {e}")
