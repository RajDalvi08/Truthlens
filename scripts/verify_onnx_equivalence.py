"""Compare each exact PyTorch TruthLens model against its INT8 ONNX artefact."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import numpy as np
import onnxruntime as ort
import torch
from huggingface_hub import get_token
from transformers import AutoModelForSequenceClassification, AutoTokenizer

MODELS = {
    "linguistic": "vins01-07/truthlens-linguistic-bias",
    "framing": "vins01-07/truthlens-framing-bias",
    "entity": "vins01-07/truthlens-BEAD-entity-bias",
}
TEXTS = [
    "Officials released verified figures and said the report contains no new policy announcements.",
    "Critics called the proposal misguided while supporters described it as a necessary reform.",
    "The reckless administration's catastrophic failure has devastated innocent families.",
    "The minister said the agency will publish its evidence after the independent review concludes.",
]


def probabilities(logits: np.ndarray) -> list[float]:
    shifted = logits - np.max(logits, axis=-1, keepdims=True)
    values = np.exp(shifted) / np.exp(shifted).sum(axis=-1, keepdims=True)
    return [float(value) for value in values[0]]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--onnx-root", type=Path, default=Path("Models/onnx"))
    parser.add_argument("--report", type=Path, default=Path("Models/onnx/equivalence_report.json"))
    parser.add_argument("--max-probability-delta", type=float, default=0.05)
    args = parser.parse_args()
    token = os.getenv("HF_TOKEN") or get_token()
    report: dict[str, object] = {}
    failed = False

    for name, model_id in MODELS.items():
        onnx_path = args.onnx_root / name / "model_quantized.onnx"
        if not onnx_path.exists():
            raise FileNotFoundError(f"Missing converted model: {onnx_path}")
        tokenizer = AutoTokenizer.from_pretrained(model_id, token=token)
        model = AutoModelForSequenceClassification.from_pretrained(model_id, token=token).eval()
        session = ort.InferenceSession(str(onnx_path), providers=["CPUExecutionProvider"])
        id2label = {str(key): value for key, value in model.config.id2label.items()}
        rows = []

        for text in TEXTS:
            encoded = tokenizer(text, truncation=True, max_length=512, return_tensors="pt")
            with torch.no_grad():
                torch_logits = model(**encoded).logits.detach().cpu().numpy()
            feeds = {key: value.detach().cpu().numpy() for key, value in encoded.items() if key in {item.name for item in session.get_inputs()}}
            onnx_logits = session.run(None, feeds)[0]
            torch_probs, onnx_probs = probabilities(torch_logits), probabilities(onnx_logits)
            torch_index, onnx_index = int(np.argmax(torch_probs)), int(np.argmax(onnx_probs))
            delta = max(abs(left - right) for left, right in zip(torch_probs, onnx_probs))
            stable = torch_index == onnx_index and delta <= args.max_probability_delta
            failed |= not stable
            rows.append({
                "text": text,
                "label_order": [id2label[str(index)] for index in range(len(torch_probs))],
                "pytorch_label": id2label[str(torch_index)],
                "onnx_label": id2label[str(onnx_index)],
                "pytorch_probabilities": torch_probs,
                "onnx_probabilities": onnx_probs,
                "max_probability_delta": delta,
                "stable": stable,
            })
        report[name] = {"model_id": model_id, "rows": rows}

    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2), encoding="utf-8")
    if failed:
        raise SystemExit(f"Equivalence check failed; see {args.report}")
    print(f"Equivalence check passed: {args.report}")


if __name__ == "__main__":
    main()
