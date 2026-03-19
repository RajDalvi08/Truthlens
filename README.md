# TruthLens — AI-Powered News Bias Analysis Platform

**TruthLens** is a sophisticated intelligence platform designed to detect and quantify ideological bias in news media. By leveraging a multi-model neural architecture, it dissects articles to reveal linguistic slant, narrative framing, and entity-centric emphasis, providing a transparent look at how information is structured and presented.

---

## Overview

The TruthLens platform serves as a high-fidelity lens for media consumption, offering deep insights into the hidden layers of news reporting.

- **Automated Bias Detection**: Scans news articles in real-time to identify political and narrative slant.
- **Multidimensional Evaluation**: Employs three specialized NLP models to evaluate linguistic, framing, and entity-level bias signals.
- **Signal Aggregation**: Consolidates complex model outputs into an interpretable 0–100 bias score.
- **Intelligence Dashboard**: Provides interactive visualizations for tracking bias trends, regional drift, and sentiment correlations across global media.

---

## System Architecture

TruthLens is built on a modular, scalable architecture designed for high-performance NLP tasks:

- **Frontend (React Dashboard)**: A premium, interactive interface featuring glassmorphism aesthetics and real-time data visualizations using Recharts and Framer Motion.
- **Backend (FastAPI)**: A robust Python API layer that manages the analysis pipeline, model inference, and data orchestration.
- **Bias Evaluation Engine**: The core processing unit where articles are cleaned, chunked, and evaluated by the neural model stack.
- **Database Storage (SQLite)**: A persistence layer that stores analyzed articles, metadata, and aggregated metrics for historical tracking.
- **Analytics Pipeline**: Background processes that transform raw analysis results into longitudinal trends for dashboard components.

---

## Bias Evaluation Pipeline

TruthLens transforms raw text into narrative intelligence through a systematic five-step process:

1.  **Article Input**: Users submit content via a live URL or by providing a manual headline and article text.
2.  **Text Processing**: The system cleans HTML artifacts, normalizes the text, and applies semantic chunking for long-form content to ensure granular accuracy.
3.  **Model Evaluation**: The text chunks are processed in parallel by the Triple-Model Stack, each focusing on a distinct dimension of bias.
4.  **Signal Aggregation**: Individual model probabilities are consolidated using a hybrid ratio (Mean/Peak integration) to capture both consistent slant and isolated rhetorical spikes.
5.  **Output Generation**: The engine generates a comprehensive analysis report including the final bias score, classification level (Low/Moderate/High), and a detailed component breakdown.

---

## Bias Detection Models

At the heart of TruthLens are three specialized transformer-based models:

### 1. Linguistic Bias Model
Detects emotionally loaded or ideological wording that signals a departure from neutral reporting. It identifies "loaded" language intended to trigger specific emotional responses.
- **Examples**: "crisis," "reckless decision," "corrupt elites," "radical agenda."
- **Focus**: Measures how strongly the article's choice of words pushes a specific viewpoint.

### 2. Framing Bias Model
Analyzes the narrative structure and the "angle" of the story. It looks beyond words to see how the entire argument is constructed.
- **Prioritization**: It identifies which perspectives are given center stage and which are marginalized.
- **Descriptors**: Analyzes how events are characterized (e.g., "protest" vs. "riot").
- **Dominance**: Detects which overarching narrative dominates the story's logic.

### 3. Entity Salience Model
Evaluates which actors or entities receive the most prominence and how they are positioned within the text.
- **Targets**: Focuses on politicians, organizations, and advocacy groups.
- **Mechanism**: Calculates saliency by measuring frequency, positioning, and sentiment markers associated with specific actors.
- **Bias Indicators**: Occurs when certain groups are consistently emphasized in a positive or negative light while opposing voices are minimized.

---

## Bias Score Calculation

The final **TruthLens Score** is a weighted aggregation of the three primary model outputs, providing a balanced and reliable metric for ideological leaning.

**Calculation Formula:**
`Base Score = (Linguistic Bias * 0.45) + (Framing Bias * 0.40) + (Entity Bias * 0.15)`
`TruthLens Score = SQRT(Base Score) * 90`

### Interpretive Scale:
- **0.0 - 29.9: Low Bias** (Objective, neutral reporting patterns)
- **30.0 - 59.9: Moderate Bias** (Presence of framing and subjective language)
- **60.0 - 79.9: Moderate-High Bias** (Stronger narrative prioritization)
- **80.0 - 100+: Strong Bias** (Highly partisan or polarized rhetoric)

---

## Dashboard Analytics

The TruthLens UI provides a suite of advanced tools for exploring media trends at scale:

- **Temporal Bias Drift**: A longitudinal chart showing how bias levels from specific sources or topics fluctuate over time.
- **Narrative Balance Analysis**: A categorical breakdown (Neutral vs. Left vs. Right) across the current ingested article corpus.
- **Regional Bias Distribution**: An interactive 3D Globe mapping bias vectors to geographic nodes.
- **Sentiment Correlation Spectrum**: A scatter plot visualizing the relationship between emotional intensity and ideological bias.
- **Dataset Management**: High-level overview of the neural archive and ingested corpus fragments.

---

## Example Output

When an article is processed, the system returns a structured intelligence packet:

```json
{
  "bias_score": 75.16,
  "bias_level": "Moderate-High Bias",
  "linguistic_bias": 0.75,
  "framing_bias": 0.75,
  "entity_bias": 0.40,
  "entities": {
    "persons": ["Elon Musk"],
    "organizations": ["Tesla", "SEC"]
  },
  "explanation": [
    "The article uses emotionally loaded or subjective language.",
    "The article presents a strong narrative or perspective.",
    "Overall, the article shows moderate to high bias."
  ]
}
```

---

## Technology Stack

- **Frontend**: React, Vite, Framer Motion, Recharts, Three.js (for 3D visualizations).
- **Backend**: FastAPI (Python), Uvicorn.
- **Machine Learning**: Transformer-based NLP models (HuggingFace/PyTorch).
- **Data Processing**: Python NLP pipeline using Spacy and NLTK for normalization.
- **Database**: SQLite (SQLAlchemy) for persistence and statistical aggregation.

---

## Key Features

- **Explainable AI (XAI)**: Provides human-readable justifications for every bias score.
- **Neural Entity Extraction**: Automatically identifies key persons and organizations using advanced spaCy NER.
- **Quote-Aware Calibration**: Intelligently dampens linguistic bias scores when detecting reported speech (quotes) to improve realism.
- **Non-Linear Dampening**: Uses custom square-root scaling to reduce "Strong Bias" false positives and increase scoring accuracy.
- **Real-Time Analysis**: Ingests live URLs and returns results in seconds.
- **Inter-Source Comparison**: Tools to compare how different media outlets cover the same event.
- **3D Geospatial Visualization**: Maps media bias across the globe in an interactive 3D environment.
- **Neural Archive**: Automatically builds a searchable database of analyzed media for historical research.

---
*TruthLens Research Group // 0xEspresso Neural Core*
