import sys
import os
import json

# Add backend directory to path
backend_root = r"g:\Truthlens\backend"
sys.path.append(backend_root)

from services.bias_engine import analyze_bias

article = {
    "headline": "Prime Minister visits Tech Corp HQ",
    "text": "The Prime Minister met with the CEO of Tech Corp today. some emotionally loaded staggering words.",
    "source": "Manual Entry"
}

try:
    result = analyze_bias(article)
    with open('json_output.json', 'w') as f:
        json.dump(result, f, indent=2)
except Exception as e:
    with open('json_error.txt', 'w') as f:
        f.write(str(e))
