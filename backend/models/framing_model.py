"""
Framing Bias Model
==================
Loads the fine-tuned DistilBERT model for framing bias detection
from the private Hugging Face repository.
"""

import os
import torch
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
)


# -------------------------
# Hugging Face model
# -------------------------
HF_REPO_ID = "vins01-07/truthlens-framing-bias"
HF_TOKEN = os.getenv("HF_TOKEN")


# -------------------------
# Device
# -------------------------
_DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# -------------------------
# Load tokenizer + model
# -------------------------
tokenizer = DistilBertTokenizerFast.from_pretrained(
    "distilbert-base-uncased"
)

model = DistilBertForSequenceClassification.from_pretrained(
    HF_REPO_ID,
    token=HF_TOKEN,
)

model.to(_DEVICE)
model.eval()


def predict(text: str) -> float:
    """
    Return the probability that the given text is biased
    according to the Framing Bias model.

    Args:
        text: Preprocessed article text.

    Returns:
        float in [0, 1] — probability of framing bias.
    """

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128,
    )

    inputs = {
        k: v.to(_DEVICE)
        for k, v in inputs.items()
    }

    with torch.no_grad():
        logits = model(**inputs).logits

    # Temperature scaling (T=2.0)
    temperature = 2.0
    probs = torch.softmax(
        logits / temperature,
        dim=1
    )

    biased_prob = probs[0][1].item()  # class 1 = biased

    # Probability clamping [0.05, 0.95]
    clamped_prob = max(
        0.05,
        min(0.95, biased_prob)
    )

    return round(clamped_prob, 4)