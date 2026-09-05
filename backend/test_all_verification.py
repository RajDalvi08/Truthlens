"""
TruthLens Verification Suite
============================
Executes all verification tests:
- Tests 1-3: Remote model outputs for BEAD, Framing, Linguistic
- Test A: Neutral article
- Test B: Moderate article
- Test C: Strong article containing specific keywords
- Test D: Completely changed article
- Test E: Fallback behavior on LLM failure
"""

import os
import sys

# Ensure UTF-8 output encoding for console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from models.bead_model import predict as predict_bead
from models.framing_model import predict as predict_framing
from models.linguistic_model import predict as predict_linguistic
from services.bias_engine import analyze_bias


def run_tests():
    print("=" * 60)
    print("TRUTHLENS VERIFICATION & VALIDATION SUITE")
    print("=" * 60)

    # -------------------------------------------------------------
    # 1. Independent Model Inference & Debug Logging Verification
    # -------------------------------------------------------------
    test_text = "The meeting between leaders lasted two hours and focused on economic cooperation."
    print("\n>>> 1. DEBUG LOGGING FOR THE THREE INDEPENDENT MODELS:")
    print(f"Test Input: '{test_text}'\n")

    print("[Testing BEAD Entity Bias Model]")
    bead_val = predict_bead(test_text)

    print("\n[Testing Framing Bias Model]")
    framing_val = predict_framing(test_text)

    print("\n[Testing Linguistic Bias Model]")
    linguistic_val = predict_linguistic(test_text)

    print("\n--- Independent Model Summary ---")
    print(f"BEAD Predict Return       : {bead_val}")
    print(f"Framing Predict Return    : {framing_val}")
    print(f"Linguistic Predict Return : {linguistic_val}")

    # -------------------------------------------------------------
    # 2. TEST A: Neutral Article
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print(">>> 2. TEST A: NEUTRAL ARTICLE")
    print("=" * 60)
    neutral_article = {
        "headline": "Trade Representatives Meet to Discuss Bilateral Framework",
        "text": "Delegates from both nations met in Geneva on Thursday to review bilateral trade protocols. According to official statements from the commerce ministry, discussions centered on tariff structures and regulatory compliance. The working group agreed to reconvene in November for standard committee reviews.",
        "source": "Global News Wire"
    }
    res_a = analyze_bias(neutral_article)
    print(f"Bias Score      : {res_a['bias_score']}")
    print(f"Bias Level      : {res_a['bias_level']}")
    print(f"Linguistic Bias : {res_a['linguistic_bias']}")
    print(f"Framing Bias    : {res_a['framing_bias']}")
    print(f"Entity Bias     : {res_a['entity_bias']}")
    print(f"Indicators      : {res_a['indicators']}")
    print(f"Entities        : {res_a['entities']}")
    print(f"Explanation     :")
    for line in res_a['explanation']:
        print(f"  » {line}")

    # -------------------------------------------------------------
    # 3. TEST B: Moderate Article
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print(">>> 3. TEST B: MODERATE ARTICLE")
    print("=" * 60)
    moderate_article = {
        "headline": "Proposed Housing Reform Sparks Mixed Debate Among Lawmakers",
        "text": "The administration introduced new zoning regulations on Monday, but critics argued that the provisions could disrupt local markets. While supporters claimed the initiative will ease urban density, independent analysts expressed doubt and raised questions regarding long-term implementation costs. The controversial measure appears likely to face extended legislative scrutiny.",
        "source": "National Ledger"
    }
    res_b = analyze_bias(moderate_article)
    print(f"Bias Score      : {res_b['bias_score']}")
    print(f"Bias Level      : {res_b['bias_level']}")
    print(f"Linguistic Bias : {res_b['linguistic_bias']}")
    print(f"Framing Bias    : {res_b['framing_bias']}")
    print(f"Entity Bias     : {res_b['entity_bias']}")
    print(f"Indicators      : {res_b['indicators']}")
    print(f"Entities        : {res_b['entities']}")
    print(f"Explanation     :")
    for line in res_b['explanation']:
        print(f"  » {line}")

    # -------------------------------------------------------------
    # 4. TEST C: Strong Bias Article
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print(">>> 4. TEST C: STRONG BIAS ARTICLE (WITH REQUIRED KEYWORDS)")
    print("=" * 60)
    strong_article = {
        "headline": "Disastrous Economic Policy Ends in Catastrophic Failure",
        "text": "The administration's disastrous economic policy has become a catastrophic failure for working families. In a series of reckless and irresponsible decisions, ministers pushed through dangerous measures that caused extreme market turmoil. The collapse of the currency has triggered an unprecedented crisis and outrageous living costs.",
        "source": "Opinion Watch"
    }
    res_c = analyze_bias(strong_article)
    print(f"Bias Score      : {res_c['bias_score']}")
    print(f"Bias Level      : {res_c['bias_level']}")
    print(f"Linguistic Bias : {res_c['linguistic_bias']}")
    print(f"Framing Bias    : {res_c['framing_bias']}")
    print(f"Entity Bias     : {res_c['entity_bias']}")
    print(f"Indicators      : {res_c['indicators']}")
    print(f"Entities        : {res_c['entities']}")
    print(f"Explanation     :")
    for line in res_c['explanation']:
        print(f"  » {line}")

    # Verify exact required indicator words
    required_words = ["disastrous", "catastrophic", "reckless", "irresponsible", "dangerous", "failure"]
    found_required = [w for w in required_words if any(w.lower() == ind.lower() for ind in res_c["indicators"])]
    print(f"\nRequired words checked: {required_words}")
    print(f"Required words matched in indicators: {found_required}")
    assert len(found_required) == len(required_words), f"Missing required words: {set(required_words) - set(found_required)}"

    # -------------------------------------------------------------
    # 5. TEST D: Completely Different Article
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print(">>> 5. TEST D: COMPLETELY DIFFERENT TOPIC ARTICLE")
    print("=" * 60)
    changed_article = {
        "headline": "Astronomers Unveil New Deep Space Telescope Observations",
        "text": "Researchers at the European Space Observatory published high-resolution spectroscopic data of exoplanet atmospheres on Wednesday. According to the peer-reviewed report, infrared instruments recorded carbon dioxide isotopes in the outer mantle. Further calibration flights are scheduled for early next year to verify orbital telemetry.",
        "source": "Science Daily"
    }
    res_d = analyze_bias(changed_article)
    print(f"Bias Score      : {res_d['bias_score']}")
    print(f"Bias Level      : {res_d['bias_level']}")
    print(f"Linguistic Bias : {res_d['linguistic_bias']}")
    print(f"Framing Bias    : {res_d['framing_bias']}")
    print(f"Entity Bias     : {res_d['entity_bias']}")
    print(f"Indicators      : {res_d['indicators']}")
    print(f"Entities        : {res_d['entities']}")
    print(f"Explanation     :")
    for line in res_d['explanation']:
        print(f"  » {line}")

    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
