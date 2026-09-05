"""Export the exact TruthLens classifiers to CPU-friendly dynamic INT8 ONNX.

Generated artefacts are written to Models/onnx/, which is already ignored by
Git. This script never alters the source model repositories or model weights.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path

from huggingface_hub import get_token
from optimum.onnxruntime import ORTModelForSequenceClassification, ORTQuantizer
from optimum.onnxruntime.configuration import AutoQuantizationConfig
from transformers import AutoConfig, AutoTokenizer


MODELS = {
    "linguistic": "vins01-07/truthlens-linguistic-bias",
    "framing": "vins01-07/truthlens-framing-bias",
    "entity": "vins01-07/truthlens-BEAD-entity-bias",
}
EXPECTED_ARCHITECTURE = "DistilBertForSequenceClassification"
EXPECTED_LABELS = {"0": "LABEL_0", "1": "LABEL_1"}


def token() -> str | None:
    return os.getenv("HF_TOKEN") or get_token()


def inspect_model(model_id: str, access_token: str | None) -> dict:
    config = AutoConfig.from_pretrained(model_id, token=access_token)
    metadata = {
        "model_id": model_id,
        "architectures": config.architectures,
        "model_type": config.model_type,
        "id2label": {str(key): value for key, value in config.id2label.items()},
        "label2id": config.label2id,
        "problem_type": config.problem_type,
        "max_position_embeddings": config.max_position_embeddings,
    }
    if config.model_type != "distilbert" or EXPECTED_ARCHITECTURE not in (config.architectures or []):
        raise RuntimeError(f"Unexpected architecture for {model_id}: {metadata}")
    if metadata["id2label"] != EXPECTED_LABELS:
        raise RuntimeError(f"Unexpected labels for {model_id}: {metadata['id2label']}")
    return metadata


def convert_one(name: str, model_id: str, output_root: Path, force: bool, per_channel: bool) -> None:
    target = output_root / name
    if target.exists() and not force:
        raise FileExistsError(f"{target} exists; use --force to rebuild it.")
    if target.exists():
        shutil.rmtree(target)
    target.mkdir(parents=True)

    access_token = token()
    metadata = inspect_model(model_id, access_token)
    print(f"Exporting {name}: {model_id}")
    model = ORTModelForSequenceClassification.from_pretrained(
        model_id,
        export=True,
        token=access_token,
    )
    tokenizer = AutoTokenizer.from_pretrained(model_id, token=access_token)
    model.save_pretrained(target)
    tokenizer.save_pretrained(target)

    # AVX2 dynamic INT8 is CPU-only and broadly compatible with x86 hosts.
    quantizer = ORTQuantizer.from_pretrained(model)
    quantizer.quantize(
        save_dir=target,
        quantization_config=AutoQuantizationConfig.avx2(is_static=False, per_channel=per_channel),
    )
    (target / "truthlens_onnx_metadata.json").write_text(
        json.dumps(
            {
                **metadata,
                "quantization": f"dynamic-int8-avx2-per-channel={per_channel}",
                "onnx_file": "model_quantized.onnx",
            },
            indent=2,
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    if not (target / "model_quantized.onnx").exists():
        raise RuntimeError(f"Quantization did not produce {target / 'model_quantized.onnx'}")
    print(f"Wrote {target}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("Models/onnx"))
    parser.add_argument("--model", choices=(*MODELS, "all"), default="all")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--per-channel", action="store_true", help="Use higher-fidelity per-channel INT8 weights.")
    args = parser.parse_args()
    names = MODELS if args.model == "all" else {args.model: MODELS[args.model]}
    for name, model_id in names.items():
        convert_one(name, model_id, args.output, args.force, args.per_channel)


if __name__ == "__main__":
    main()
