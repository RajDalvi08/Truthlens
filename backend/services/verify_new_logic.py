import sys
import os
import math

# Add backend directory to path
backend_dir = r"g:\Truthlens"
sys.path.append(backend_dir)

from backend.services.bias_score import combine_scores

def test_case(name, l, f, e):
    result = combine_scores(l, f, e)
    print(f"{name}: Input L={l}, F={f}, E={e}")
    print(f"Result: {result['score']} ({result['level']})")
    print("-" * 20)

print("AFTER CALIBRATION TEST CASES:")
test_case("Case A", 0.30, 0.40, 0.20)
test_case("Case B", 0.75, 0.75, 0.40)
test_case("Case C", 0.85, 0.90, 0.70)
