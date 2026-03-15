import os
import sys

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from services.bias_engine import analyze_bias

def test_engine():
    articles = [
        {
            "headline": "Neutral Report",
            "text": "The meeting between leaders lasted two hours and focused on economic cooperation."
        },
        {
            "headline": "Politically Charged",
            "text": "The corrupt and incompetent government once again failed the citizens miserably."
        },
        {
            "headline": "Random Nonsense",
            "text": "The cat sat on the mat while the sun was shining."
        },
        {
            "headline": "Long Article Test",
            "text": ("This is a long article about economic policy. " * 50) + " The government maintains that the strategy is working, while critics argue it is a total failure."
        }
    ]

    for article in articles:
        print(f"\n{'='*60}")
        print(f"Testing Headline: {article['headline']}")
        print(f"{'='*60}")
        
        result = analyze_bias(article)
        
        print(f"Bias Level      : {result['bias_level']}")
        print(f"Overall Score   : {result['bias_score']}")
        print(f"Linguistic Bias : {result['linguistic_bias']}")
        print(f"Framing Bias    : {result['framing_bias']}")
        print(f"Entity Bias     : {result['entity_bias']}")

if __name__ == "__main__":
    test_engine()
