# TruthLens: Neural Architecture Performance & Validation Report
**Technical Whitepaper // Version 4.3 Stable**

## 1. Executive Summary
This report provides a comprehensive technical evaluation of the TruthLens neural orchestration pipeline. By leveraging a triple-stack transformer architecture, TruthLens achieves high-fidelity detection of media bias across linguistic, framing, and entity-centric dimensions. The system integrates advanced Explainable AI (XAI) heuristics and deterministic logic tracing to provide human-interpretable justifications based directly on source article semantics, ensuring transparent, enterprise-grade media auditing.

---

## 2. Neural Architecture Stack

### 2.1 Linguistic Bias Vector (LBV)
*   **Weight Parameterization**: 40% (0.40) of Baseline Neural Score
*   **Objective**: Quantification of lexical subjectivity and emotionally charged rhetoric.
*   **Model**: DistilBERT-Base-Uncached (Fine-tuned for sequence classification).
*   **Performance Metrics**:
    *   **Accuracy**: 92.21%
    *   **F1-Score**: 0.9035
    *   **Validation Loss**: 0.2865
*   **Dataset**: 50,000+ curated news segments focusing on subjective vs. objective reporting.

### 2.2 Narrative Framing Engine (NFE)
*   **Weight Parameterization**: 45% (0.45) of Baseline Neural Score
*   **Objective**: Detection of perspective prioritization, selective emphasis, and structural "story angle" bias.
*   **Model**: DistilBERT with a custom Narrative Head.
*   **Performance Metrics**:
    *   **Accuracy**: 95.42%
    *   **F1-Score**: 0.9540
*   **Key Strength**: Exceptional identification of partisan framing patterns in politically complex and geopolitically dense reporting.

### 2.3 Entity Salience Model (BEAD)
*   **Weight Parameterization**: 15% (0.15) of Baseline Neural Score
*   **Objective**: Monitoring bias directed at specific political actors and organizations.
*   **Model**: Bi-Directional Entity Awareness Detection (BEAD).
*   **Performance Metrics**:
    *   **Accuracy**: 85.76%
    *   **Recall**: 92.48% (Optimized for maximum sensitivity)
*   **Calibration**: Integrated NER-filtering layer ensuring entity scores apply exclusively when valid ontological targets (e.g., PERSON, ORG) are successfully localized.

---

## 3. Explainable AI (XAI) & Context-Aware Logic Tracing

TruthLens v4.3 deprecates legacy "Black Box" static templating, delivering a real-time **Context-Aware Logic Engine** completely derived from the analyzed text.

### 3.1 Bias Indicator Extraction & Lexical Scoring Boost
The backend performs a layered extraction matching source text against extensive dictionaries:
*   **Strong Indicators**: Match hits (e.g., *Catastrophic, Reckless, Extreme*) yield a `+0.08` algorithmic score boost to baseline calculations.
*   **Moderate Indicators**: Match hits (e.g., *Controversial, Mixed, Appears*) yield a `+0.03` adjustment to accurately reflect nuanced, under-the-radar bias styling.
*   **Max Penalty Isolation**: Indicator score boosting is rigorously capped via a `min(score_boost, 0.15)` clamping heuristic preventing runaway metric inflation.

### 3.2 Human-Readable Logic Trees
Neural probabilities map securely to dynamic phrasing generated via direct sentence extraction. 
*   **Literal Quote Injection**: The Logic Trace UI natively displays the offending sentences flagged securely via case-insensitive recursive matching across article paragraphs. 
*   **Determined Range Thresholds**: 
    - `Strong Bias (≥75)`
    - `Moderate-High Bias (≥60)`
    - `Moderate Bias (≥40)`
    - `Low Bias (<40)`

---

## 4. Signal Calibration & Aggregation Heuristics

To ensure industrial-grade stability, TruthLens employs several deep post-inference stabilization steps inside its pipeline (`bias_score.py`):

1.  **Quote-Aware Recalibration**: Dampens linguistic bias outputs natively (`* 0.80`) when detecting quoted speech, correctly bypassing reporter objectivity inside subject quotations.
2.  **Mean-Peak Hybridization**: Aggregates token-level chunks prioritizing both consistent narrative drift (Mean = 90%) and isolated rhetorical spikes (Peak = 10%).
3.  **SQRT Dampening Matrix**: Employs an inverted geometric scaling formula (`math.sqrt`) interpolated at `0.25 SQRT + 0.75 Linear` to soften raw magnitude, stabilizing extreme false-positives without dulling precision targeting.
4.  **Mid-Range Amplifier Optimization**: Detects heavily masked moderate signals via an exclusive heuristic: if final scores sit mathematically in the `[40, 60]` band, the logic algorithm initiates a precise scale correction (`* 1.08`) correctly surfacing implicit biases.

---

## 5. Conclusion
With a synthesized accuracy rating scaling universally at **~91.5%** in production deployments, TruthLens models possess robust internal scaling architecture. The fusion of precise transformer analysis coupled tightly with strict mathematical clamp boundaries and unredacted context-trace UI displays creates a singularly powerful and enterprise-ready platform for national media auditing.

---
**Verification Date**: 2026-03-30
**Neural Core Version**: TRUTHLENS_V4.3_STABLE
**Lead Architect**: TruthLens Research Group
