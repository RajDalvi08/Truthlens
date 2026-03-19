import math

def normalize(score):
    return min(max(score, 0.10), 0.90)

def calculate_final(l, f, e, text=""):
    # Step 5: Quote-Aware Linguistic Dampening
    if '"' in text or "'" in text:
        l = l * 0.80
    
    # Step 1: Normalize
    l = normalize(l)
    f = normalize(f)
    e = normalize(e)
    
    # Step 2: Weighted Aggregation
    base_score = (l * 0.45) + (f * 0.40) + (e * 0.15)
    
    # Step 3: Non-Linear Dampening
    adjusted_score = math.sqrt(base_score)
    final_score = adjusted_score * 100 * 0.90
    return round(final_score, 2)

def get_level(score):
    if score < 30: return "Low Bias"
    if score < 60: return "Moderate Bias"
    if score < 80: return "Moderate-High Bias"
    return "Strong Bias"

cases = [
    (0.75, 0.75, 0.40, "No quotes"),
    (0.30, 0.40, 0.20, "No quotes"),
    (0.85, 0.90, 0.70, "No quotes"),
    (0.75, 0.75, 0.40, 'Contains "quotes"'),
]

for l, f, e, txt in cases:
    res = calculate_final(l, f, e, txt)
    level = get_level(res)
    print(f"L={l}, F={f}, E={e}, Text='{txt}' -> Score: {res} ({level})")
