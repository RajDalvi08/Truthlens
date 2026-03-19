import sys
import os
import json

# Add backend directory to path
backend_dir = r"g:\Truthlens"
sys.path.append(backend_dir)

from backend.services.bias_engine import analyze_bias

article = {
    "headline": "Prime Minister visits Tech Corp HQ",
    "text": "The Prime Minister met with the CEO of Tech Corp today. some emotionally loaded staggering words.",
    "source": "Manual Entry"
}

result = analyze_bias(article)
print(json.dumps(result, indent=2))
