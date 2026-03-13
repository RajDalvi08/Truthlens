import os
import sys

# Add backend directory to path so we can import models
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from models.linguistic_model import predict as predict_linguistic
from models.framing_model import predict as predict_framing
from models.bead_model import predict as predict_entity

sentences = {
    "Neutral": "The meeting between leaders lasted two hours and focused on economic cooperation.",
    "Highly Biased": "The corrupt and incompetent government once again failed the citizens miserably.",
    "Random": "The cat sat on the mat while the weather was sunny."
}

for label, text in sentences.items():
    print(f"\n--- Testing {label} Text ---")
    print(f"Text: {text}")
    print(f"Linguistic: {predict_linguistic(text)}")
    print(f"Framing: {predict_framing(text)}")
    print(f"Entity: {predict_entity(text)}")
