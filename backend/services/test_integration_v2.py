import sys
import os
import json

# Add backend directory to path
backend_root = r"g:\Truthlens\backend"
sys.path.append(backend_root)

from services.bias_engine import analyze_bias

article = {
    "headline": "Elon Musk visits Microsoft HQ",
    "text": "The visionary CEO of Tesla met with the board of Microsoft today. This shocking news will change the world.",
    "source": "Manual Entry"
}

try:
    result = analyze_bias(article)
    # Filter only relevant fields for brevity if needed
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
