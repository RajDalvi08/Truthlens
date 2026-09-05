"""Measure sequential ONNX model latency and process RSS for TruthLens."""

from __future__ import annotations

import os
import sys
import time

import psutil

ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, os.path.join(ROOT, "backend"))
os.environ.setdefault("TRUTHLENS_INFERENCE_BACKEND", "onnx")
os.environ.setdefault("TRUTHLENS_ONNX_DIR", os.path.join(ROOT, "Models", "onnx"))

from models.bead_model import predict as entity  # noqa: E402
from models.framing_model import predict as framing  # noqa: E402
from models.linguistic_model import predict as linguistic  # noqa: E402

TEXT = "The reckless administration's catastrophic failure has devastated innocent families."


def main() -> None:
    process = psutil.Process()
    baseline = process.memory_info().rss
    print(f"rss_before_mb={baseline / 1024 / 1024:.1f}")
    peak = baseline
    for name, predictor in (("linguistic", linguistic), ("framing", framing), ("entity", entity)):
        started = time.perf_counter()
        score = predictor(TEXT)
        rss = process.memory_info().rss
        peak = max(peak, rss)
        print(f"{name}: score={score:.4f} seconds={time.perf_counter() - started:.3f} rss_mb={rss / 1024 / 1024:.1f}")
    print(f"rss_peak_mb={peak / 1024 / 1024:.1f}")


if __name__ == "__main__":
    main()
