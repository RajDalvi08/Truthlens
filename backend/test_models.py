import os
import sys

# Add backend directory to path so we can import models
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from models.linguistic_model import predict as predict_linguistic
from models.framing_model import predict as predict_framing
from models.bead_model import predict as predict_entity
from services.bias_score import combine_scores

def test_models():
    texts = {
        "Neutral text": "The meeting between leaders lasted two hours and focused on economic cooperation.",
        "Strongly biased text": "The corrupt and incompetent government once again failed the citizens miserably.",
        "Random sentence": "The cat sat on the mat while the sun was shining."
    }

    for label, text in texts.items():
        print(f"\n{'='*50}")
        print(f"Testing {label}:")
        print(f"Text: '{text}'")
        print(f"{'='*50}")
        
        lin = predict_linguistic(text)
        fra = predict_framing(text)
        bed = predict_entity(text)
        
        score = combine_scores(lin, fra, bed)
        
        print("\n--- Final Results ---")
        print(f"Linguistic Bias : {lin:.4f}")
        print(f"Framing Bias    : {fra:.4f}")
        print(f"Entity Bias     : {bed:.4f}")
        print(f"Overall Score   : {score}")

if __name__ == "__main__":
    test_models()
