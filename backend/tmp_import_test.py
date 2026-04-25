import traceback
import sys

try:
    from services.bias_engine import analyze_bias
    print("Import successful!")
    print(analyze_bias({'headline':'Test', 'text':'The cat sat on the mat.'}))
except Exception as e:
    print("ERROR:")
    print(traceback.format_exc())
    sys.exit(1)
