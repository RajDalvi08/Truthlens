"""
Test Event Comparison Logic
"""
import os
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.event_compare import compare_event

def test_event():
    # Using a generally stable news URL for testing
    test_url = "https://www.bbc.com/news/world-europe-68514414"
    print(f"Testing event comparison for: {test_url}")
    
    result = compare_event(test_url)
    
    if "error" in result:
        print(f"Error: {result['error']}")
        return

    print(f"\nEvent: {result['event']}")
    print("-" * 50)
    for i, art in enumerate(result['articles'], 1):
        print(f"{i}. [{art['source']}] {art['headline'][:60]}...")
        print(f"   Bias Score: {art['bias_score']} ({art['bias_level']})")
        print(f"   Linguistic: {art['linguistic_bias']}, Framing: {art['framing_bias']}, Entity: {art['entity_bias']}")
        print("-" * 30)

if __name__ == "__main__":
    test_event()
