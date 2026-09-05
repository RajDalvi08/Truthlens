"""
Linguistic Bias Model
=====================
Loads the fine-tuned DistilBERT model for linguistic bias detection
from the private Hugging Face repository.
"""

import os
import torch
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
)

HF_REPO_ID = "vins01-07/truthlens-linguistic-bias"
HF_TOKEN = os.getenv("HF_TOKEN")

_DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

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

    temperature = 2.0

    probs = torch.softmax(
        logits / temperature,
        dim=1
    )

    biased_prob = probs[0][1].item()

    clamped_prob = max(
        0.05,
        min(0.95, biased_prob)
    )

    return round(clamped_prob, 4)