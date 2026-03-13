# TruthLens AI Backend

TruthLens is a state-of-the-art news bias detection system that uses multiple transformer-based models to analyze and compare media bias at both the article and event levels.

## 🚀 Overview

The TruthLens backend is built with **FastAPI** and orchestrates three specialized deep learning models to provide a holistic view of journalistic bias. It moves beyond simple classification by offering **event-level comparison**, allowing users to see how different media outlets report on the same story.

---

## 🏗️ Architecture & Structure

The system follows a modular service-oriented architecture:

```text
backend/
├── main.py                 # FastAPI Entry point
├── models/                 # Model loading and inference logic
│   ├── linguistic_model.py # Detects biased language/adjectives
│   ├── framing_model.py    # Detects ideological framing
│   └── bead_model.py       # Entity-level bias (BEAD dataset)
├── routers/                # API Endpoints
│   ├── analyze.py          # Single article analysis (/analyze)
│   ├── compare.py          # Side-by-side comparison (/compare)
│   └── event.py            # Automated event comparison (/compare_event)
├── services/               # Core business logic
│   ├── article_fetcher.py  # Robust web scraping (BS4)
│   ├── bias_engine.py      # Inference orchestration & chunking
│   ├── bias_score.py       # Statistical aggregation & weighting
│   ├── event_search.py     # Google News RSS integration
│   ├── nlp_utils.py        # spaCy NER and text splitting
│   └── bias_visualizer.py  # ASCII spectrum generation
└── requirements.txt        # System dependencies
```

---

## 🧠 The AI Pipeline

### 1. Linguistic Bias Model
Detects the use of loaded language, inflammatory adjectives, and subjective intensifiers. It is the most reliable signal in our pipeline, weighted at **40%**.

### 2. Framing Bias Model
Analyzes how a story is "packaged." It identifies the ideological angle or narrative structure used by the outlet. Weighted at **35%**.

### 3. BEAD Entity Bias Model
Focuses on how specific actors (People, Organizations, Countries) are portrayed. It uses a **Soft NER Filter**; if no major named entities are found, the score is reduced by 50% to prevent false positives. Weighted at **25%**.

---

## 🔬 Challenges & Key Fixes

During development, we encountered several statistical and structural hurdles. Here is how we solved them:

### **Problem: The "Bias Inflation" Bug**
Initially, the framing model consistently predicted `~1.0` bias for almost every input.
*   **Root Cause:** The model was originally trained on *sentence pairs* (pairwise classification) but was being used for *single-sequence* inference in the backend.
*   **Fix:** We **rebuilt the dataset** from scratch (using Left/Right headlines as biased and Center as neutral) and **retrained the Framing Model** as a native single-sequence classifier.

### **Problem: Statistical Sensitivity**
Models were often "overconfident," producing extreme 0.0 or 1.0 outputs.
*   **Fix:** Implementation of **Temperature Scaling ($T=2.0$)** to soften logits and provide more nuanced, calibrated probabilities. We also removed artificial "clamping" to let the model's true calibrated confidence show.

### **Problem: The "Long Article" Truncation**
Standard BERT models are limited to 512 tokens, meaning long investigative pieces were only being analyzed at the beginning.
*   **Fix:** Implemented a **Hybrid Chunking System**. Long articles are split into ~1500 character chunks. The final score is a hybrid: $70\%$ Average + $30\%$ Peak (Max). This ensures that a single biased paragraph buried in a report isn't lost in the average.

---

## 📡 Key API Endpoints

### `POST /analyze`
Analyzes a single URL for bias. Returns scores, levels, and a visual bar.

### `POST /compare_event`
The flagship feature. Provide **one** article URL, and TruthLens will:
1. Search Google News for related outlets reporting the same event.
2. Analyze all related articles.
3. Sort them from **Most Biased** to **Least Biased**.
4. Return a side-by-side bias spectrum.

---

## 🛠️ Setup & Installation

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Download spaCy Model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```
3. **Run the Server:**
   ```bash
   uvicorn main:app --reload
   ```

---

## 📊 Visual Interpretation
TruthLens provides an ASCII bias spectrum in its responses:
*   `███░░░░░░░` (Low Bias: 20-35)
*   `█████░░░░░` (Moderate Bias: 40-60)
*   `████████░░` (High Bias: 70+)
