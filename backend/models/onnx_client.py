"""
ONNX Runtime Inference Client for TruthLens
===========================================
High-performance, low-memory inference client for fine-tuned DistilBERT models.
Designed specifically for resource-constrained environments (e.g., Render free tier 512MB RAM)
by using ONNX Runtime CPU dynamic INT8 quantization, zero PyTorch runtime overhead,
and controlled session/tokenizer caching.

Exported contract:
    infer_onnx_classification(model_id: str, text: str) -> tuple[str, float]
"""

from __future__ import annotations

import gc
import json
import logging
import os
import sys
import threading
from collections import OrderedDict
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import numpy as np

logger = logging.getLogger("truthlens.onnx_client")

# Model canonical registry and aliases
MODEL_REGISTRY: dict[str, str] = {
    "vins01-07/truthlens-linguistic-bias": "linguistic",
    "vins01-07/truthlens-framing-bias": "framing",
    "vins01-07/truthlens-bead-entity-bias": "entity",
    "vins01-07/truthlens-entity-bias": "entity",
    "truthlens-linguistic-bias": "linguistic",
    "truthlens-framing-bias": "framing",
    "truthlens-bead-entity-bias": "entity",
    "linguistic": "linguistic",
    "framing": "framing",
    "entity": "entity",
    "bead": "entity",
}

HF_REPO_MAP: dict[str, str] = {
    "linguistic": "vins01-07/truthlens-linguistic-bias",
    "framing": "vins01-07/truthlens-framing-bias",
    "entity": "vins01-07/truthlens-BEAD-entity-bias",
}

DEFAULT_ID2LABEL: dict[str, str] = {
    "0": "LABEL_0",
    "1": "LABEL_1",
}


def canonicalize_model_id(model_id: str) -> str:
    """Normalize model IDs, HF repos, or aliases into a canonical model key."""
    clean = model_id.strip().lower()
    if clean in MODEL_REGISTRY:
        return MODEL_REGISTRY[clean]

    # Fuzzy matching for known architectures
    if "linguistic" in clean:
        return "linguistic"
    if "framing" in clean:
        return "framing"
    if "bead" in clean or "entity" in clean:
        return "entity"

    # Fallback to the trailing path component
    return clean.split("/")[-1]


def resolve_model_path(model_id: str) -> tuple[Path, str, dict[str, str]]:
    """
    Locate the ONNX model artefact, tokenizer source, and id2label mapping.
    
    Search hierarchy:
      1. TRUTHLENS_ONNX_DIR environment variable
      2. <repo_root>/Models/onnx/<model_key>
      3. <backend_dir>/models/onnx/<model_key>
      4. <repo_root>/backend/models/onnx/<model_key>
      5. Hugging Face Hub download fallback
    
    Artefact priority:
      1. model_quantized.onnx (dynamic INT8, ~65MB, optimal for Render free tier)
      2. model.onnx (standard FP32 ONNX, ~260MB)

    Returns:
      (onnx_file_path, tokenizer_source, id2label_dict)
    """
    key = canonicalize_model_id(model_id)
    backend_dir = Path(__file__).resolve().parent.parent
    repo_root = backend_dir.parent

    candidate_dirs: list[Path] = []

    # 1. Environment variable override
    env_dir = os.getenv("TRUTHLENS_ONNX_DIR")
    if env_dir:
        p = Path(env_dir)
        candidate_dirs.append(p / key)
        candidate_dirs.append(p)

    # 2. Standard repository locations
    candidate_dirs.extend([
        repo_root / "Models" / "onnx" / key,
        repo_root / "models" / "onnx" / key,
        backend_dir / "models" / "onnx" / key,
        backend_dir / "Models" / "onnx" / key,
        repo_root / "Models" / key,
    ])

    for c_dir in candidate_dirs:
        if not c_dir.is_dir():
            continue

        quantized_file = c_dir / "model_quantized.onnx"
        standard_file = c_dir / "model.onnx"

        onnx_file = None
        if quantized_file.is_file():
            onnx_file = quantized_file
        elif standard_file.is_file():
            onnx_file = standard_file

        if onnx_file:
            tokenizer_source = str(c_dir) if (c_dir / "tokenizer.json").is_file() or (c_dir / "vocab.txt").is_file() else HF_REPO_MAP.get(key, model_id)
            id2label = _load_id2label(c_dir)
            logger.info("Found ONNX model for '%s' at %s", key, onnx_file)
            return onnx_file, tokenizer_source, id2label

    # 3. Fallback: Check if ONNX model is stored in Hugging Face Hub
    try:
        from huggingface_hub import hf_hub_download
        hf_repo = HF_REPO_MAP.get(key, model_id)
        token = os.getenv("HF_TOKEN")
        logger.info("Attempting HF hub download for ONNX weights: %s", hf_repo)
        try:
            downloaded = hf_hub_download(repo_id=hf_repo, filename="model_quantized.onnx", token=token)
            return Path(downloaded), hf_repo, DEFAULT_ID2LABEL
        except Exception:
            downloaded = hf_hub_download(repo_id=hf_repo, filename="model.onnx", token=token)
            return Path(downloaded), hf_repo, DEFAULT_ID2LABEL
    except Exception as hub_exc:
        logger.debug("Hub download not available: %s", hub_exc)

    searched_str = "\n  - " + "\n  - ".join(str(d) for d in candidate_dirs)
    raise FileNotFoundError(
        f"Could not find ONNX model for '{model_id}' (resolved key: '{key}').\n"
        f"Searched candidate locations:{searched_str}\n"
        f"Expected 'model_quantized.onnx' or 'model.onnx'.\n"
        f"To generate ONNX models, run:\n"
        f"    python scripts/convert_models_to_onnx.py --model {key}\n"
        f"or set TRUTHLENS_ONNX_DIR to your model directory."
    )


def _load_id2label(model_dir: Path) -> dict[str, str]:
    """Extract id2label from metadata or config json if present."""
    metadata_file = model_dir / "truthlens_onnx_metadata.json"
    if metadata_file.is_file():
        try:
            data = json.loads(metadata_file.read_text(encoding="utf-8"))
            if "id2label" in data and isinstance(data["id2label"], dict):
                return {str(k): str(v) for k, v in data["id2label"].items()}
        except Exception as e:
            logger.debug("Failed reading %s: %s", metadata_file, e)

    config_file = model_dir / "config.json"
    if config_file.is_file():
        try:
            data = json.loads(config_file.read_text(encoding="utf-8"))
            if "id2label" in data and isinstance(data["id2label"], dict):
                return {str(k): str(v) for k, v in data["id2label"].items()}
        except Exception as e:
            logger.debug("Failed reading %s: %s", config_file, e)

    return DEFAULT_ID2LABEL.copy()


class ONNXClient:
    """
    Thread-safe ONNX Runtime inference manager with LRU session caching,
    zero-PyTorch tokenization, and strict single-thread memory limits.
    """

    def __init__(self, max_cached_sessions: int = 3) -> None:
        self.max_cached_sessions = max_cached_sessions
        self._sessions: OrderedDict[str, Any] = OrderedDict()
        self._tokenizers: dict[str, Any] = {}
        self._id2labels: dict[str, dict[str, str]] = {}
        self._lock = threading.Lock()
        self._evict_after_inference = (
            os.getenv("TRUTHLENS_ONNX_EVICT_AFTER_INFERENCE", "false").strip().lower() in ("true", "1", "yes")
        )

    def _get_session_options(self) -> Any:
        import onnxruntime as ort

        opts = ort.SessionOptions()
        # Restrict threads to keep CPU thread pool allocation small (<30MB)
        opts.intra_op_num_threads = 1
        opts.inter_op_num_threads = 1
        opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        return opts

    def _get_session(self, onnx_path: Path) -> Any:
        import onnxruntime as ort

        path_str = str(onnx_path.resolve())
        with self._lock:
            if path_str in self._sessions:
                # Move to end (most recently used)
                self._sessions.move_to_end(path_str)
                return self._sessions[path_str]

            # Evict oldest session if at capacity
            while len(self._sessions) >= self.max_cached_sessions:
                _, evicted_session = self._sessions.popitem(last=False)
                del evicted_session
                gc.collect()

            session = ort.InferenceSession(
                path_str,
                sess_options=self._get_session_options(),
                providers=["CPUExecutionProvider"],
            )
            self._sessions[path_str] = session
            return session

    def _get_tokenizer(self, tokenizer_source: str) -> Any:
        with self._lock:
            if tokenizer_source in self._tokenizers:
                return self._tokenizers[tokenizer_source]

            from transformers import AutoTokenizer

            token = os.getenv("HF_TOKEN")
            tokenizer = AutoTokenizer.from_pretrained(
                tokenizer_source,
                token=token,
                use_fast=True,
            )
            self._tokenizers[tokenizer_source] = tokenizer
            return tokenizer

    def infer(self, model_id: str, text: str) -> tuple[str, float]:
        """
        Execute ONNX classification on input text.

        Returns:
            (raw_label: str, raw_score: float)
            where raw_label is 'LABEL_1' or 'LABEL_0' (or class label from id2label),
            and raw_score is the float probability [0.0, 1.0] of that top predicted class.
        """
        if not text or not text.strip():
            return "LABEL_0", 0.0

        onnx_path, tokenizer_source, id2label = resolve_model_path(model_id)
        session = self._get_session(onnx_path)
        tokenizer = self._get_tokenizer(tokenizer_source)

        # Pure NumPy tokenization (zero-torch)
        encoded = tokenizer(
            text,
            truncation=True,
            max_length=512,
            return_tensors="np",
        )

        # Match feed inputs precisely with session expectations
        session_inputs = [inp.name for inp in session.get_inputs()]
        feed: dict[str, np.ndarray] = {}
        for inp_name in session_inputs:
            if inp_name in encoded:
                val = encoded[inp_name]
                # Ensure int64 numpy array
                if val.dtype != np.int64:
                    val = val.astype(np.int64)
                feed[inp_name] = np.ascontiguousarray(val)

        # Execute ONNX Runtime inference
        outputs = session.run(None, feed)
        logits = outputs[0]  # shape (batch_size, num_classes)
        if logits.ndim == 1:
            logits = np.expand_dims(logits, axis=0)

        # Numerically stable softmax
        shifted = logits - np.max(logits, axis=-1, keepdims=True)
        exp_scores = np.exp(shifted)
        probs = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)

        pred_idx = int(np.argmax(probs[0]))
        pred_score = float(probs[0][pred_idx])
        pred_label = id2label.get(str(pred_idx), f"LABEL_{pred_idx}")

        # Immediate memory eviction if configured for hyper-constrained environments
        if self._evict_after_inference:
            with self._lock:
                path_str = str(onnx_path.resolve())
                if path_str in self._sessions:
                    del self._sessions[path_str]
            gc.collect()

        return pred_label, pred_score


# Global client singleton
_CLIENT_INSTANCE: Optional[ONNXClient] = None
_INIT_LOCK = threading.Lock()


def get_onnx_client() -> ONNXClient:
    """Return the global thread-safe ONNXClient singleton."""
    global _CLIENT_INSTANCE
    if _CLIENT_INSTANCE is None:
        with _INIT_LOCK:
            if _CLIENT_INSTANCE is None:
                _CLIENT_INSTANCE = ONNXClient()
    return _CLIENT_INSTANCE


def infer_onnx_classification(model_id: str, text: str) -> tuple[str, float]:
    """
    Main entry point for ONNX classification called by hf_client.py.

    Args:
        model_id: Hugging Face repo ID, local path, or canonical key (e.g. 'linguistic', 'framing', 'entity').
        text: Preprocessed text snippet to classify.

    Returns:
        tuple of (raw_label: str, raw_score: float) where raw_score is in [0.0, 1.0].
    """
    client = get_onnx_client()
    return client.infer(model_id, text)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="TruthLens ONNX inference verification CLI.")
    parser.add_argument("--model", default="linguistic", help="Model key or repo ID")
    parser.add_argument("--text", default="The government official allegedly misled investors.", help="Text to classify")
    args = parser.parse_args()

    print(f"Testing ONNX classification for model '{args.model}'...")
    try:
        label, score = infer_onnx_classification(args.model, args.text)
        print(f"Success -> Label: {label}, Score: {score:.4f}")
    except Exception as exc:
        print(f"Inference failed: {exc}", file=sys.stderr)
        sys.exit(1)
