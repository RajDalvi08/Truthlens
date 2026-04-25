import math

def normalize(score):
    return min(max(score, 0.05), 0.90)

def compute_score(linguistic, framing, entity, use_compression=True):
    # normalize
    linguistic = normalize(linguistic)
    framing = normalize(framing)
    entity = normalize(entity)
    
    # Step 1
    base_score = (
        linguistic * 0.45 +
        framing * 0.40 +
        entity * 0.15
    )
    
    # Step 2
    sqrt_component = math.sqrt(base_score)
    
    # Step 3
    adjusted_score = (sqrt_component * 0.85) + (base_score * 0.15)
    
    # Step 4
    final_score = adjusted_score * 100 * 0.90
    
    # Step 5
    final_score = round(final_score, 2)
    
    # Optional Step 3
    if use_compression and base_score < 0.6:
        final_score *= 0.95
        final_score = round(final_score, 2)
        
    return base_score, final_score

results = []
results.append(f"Case A (L=0.3, F=0.4, E=0.2): {compute_score(0.3, 0.4, 0.2)}")
results.append(f"Case B (L=0.75, F=0.75, E=0.4): {compute_score(0.75, 0.75, 0.4)}")
results.append(f"Case C (L=0.85, F=0.9, E=0.7): {compute_score(0.85, 0.9, 0.7)}")

with open('clean_test_output.txt', 'w') as f:
    for r in results:
        f.write(r + '\n')
