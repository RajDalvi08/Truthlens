# TruthLens

**TruthLens** is a full-stack application for analyzing bias and framing in textual content. It includes a Python-based backend engine for text processing and machine learning models, and a React + Vite frontend for interacting with the analysis results.

---

## ✅ What is included

- **Backend (FastAPI)** – Serves endpoints for submitting text, running bias/stance analysis, and returning structured results.
- **Frontend (React + Vite)** – UI for submitting articles/text, viewing bias scores, and comparing outputs.
- **Pre-trained models** – Bias detection models are stored under `Models/` and loaded by the backend at runtime.
- **Integration** – Frontend calls backend APIs to fetch analysis results and render visualizations.

---

## 🗂️ Repository structure

### Root
- `README.md` – This file.
- `tmp_debug_import.py` – Helper script used during development.

### Backend (`backend/`)
- `main.py` – FastAPI app entrypoint.
- `routers/` – API routes for analysis, comparison, and event extraction.
- `services/` – Core business logic (bias scoring, comparison, event extraction, NLP utilities).
- `models/` – Python code for model wrappers and pipelines.
- `requirements.txt` – Python dependencies.

### Frontend (`frontend/`)
- `src/` – React source code (components, pages, services).
- `public/` – Static assets and build config.
- `package.json` – Frontend dependencies and scripts.

### Models (`Models/`)
- Contains pre-trained models for bias, framing, and linguistic analysis.
- Each model folder includes weights/configuration (e.g., `model.safetensors`).

---

## ▶️ Running the Project Locally

### 1) Backend (Python)

1. Create & activate a virtual environment (recommended):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r backend/requirements.txt
```

3. Run the backend API:

```powershell
python backend/main.py
```

The backend should start on `http://127.0.0.1:8000` by default.

> ✅ **Note:** The backend loads pre-trained models from `Models/` at startup. Ensure the model folders are present.


### 2) Frontend (React + Vite)

1. Install dependencies:

```powershell
cd frontend
npm install
```

2. Start the development server:

```powershell
npm run dev
```

3. Open your browser to the printed URL (typically `http://localhost:5173`).

The frontend calls the backend at `http://127.0.0.1:8000` by default. If you need to change that, edit `frontend/src/services/api.js`.

---

## 🔌 Backend API Overview

### Primary endpoints

- `POST /analyze` – Analyze text for bias, framing, and linguistic signals.
- `POST /compare` – Compare two pieces of text and compute differences (used by the UI compare view).
- `POST /event` – Extract and score events from text.

> Use `backend/routers/` to inspect or extend endpoints.

---

## 🧠 Models & How They Work

Models are loaded and used via the services in `backend/services/`:

- `bias_engine.py` – Loads the BEAD model and outputs bias scores.
- `framing_model.py` – Loads framing detection models.
- `linguistic_model.py` – Processes linguistic features.

Each model uses the weights stored under `Models/` (e.g., `Models/BEAD Entity Bias Model/`, `Models/Framing Bias Model/`, `Models/Linguistic Bias Model/`).

---

## 🧪 Evaluation & Scoring System (How Bias is Measured)

### 1) Per-model Bias Probabilities
- **Linguistic bias model** (`backend/models/linguistic_model.py`) predicts bias probability based on wording, tone, and linguistic cues.
- **Framing bias model** (`backend/models/framing_model.py`) evaluates narrative framing signals.
- **Entity bias model (BEAD)** (`backend/models/bead_model.py`) focuses on entity-centric bias using the BEAD dataset.

Each model returns a probability in **[0, 1]** for the “biased” class. A temperature scaling factor (T=2.0) is applied to logits before softmax to calibrate the output distribution.

### 2) Chunking + Hybrid Scoring (Long Articles)
- Articles longer than ~1500 characters are split into chunks (approx. 512 tokens) using `backend/services/nlp_utils.py`.
- Each chunk is scored independently by all three models.
- The engine then computes a **hybrid score** per model using:
  - **70% average score across chunks**
  - **30% peak (max) score across chunks**

This helps capture both general bias level and local “hot spots” of bias.

### 3) Entity Awareness (Soft Filtering)
- The engine checks if the text contains named entities using `backend/services/nlp_utils.py`.
- If no entities are found, the **entity bias score is halved** (soft reduction) to avoid spurious entity-bias positives.

### 4) Combined Bias Score & Bias Level
- Scores are combined using weighted averaging in `backend/services/bias_score.py`:
  - **Linguistic:** 40%
  - **Framing:** 35%
  - **Entity (BEAD):** 25%
- The combined score is scaled to **0–100** and rounded to two decimals.

#### Bias Level Bands
- **Low Bias:** score < 40
- **Moderate Bias:** 40 ≤ score < 70
- **High Bias:** score ≥ 70

### 5) Evaluation & Demo Scripts
The repository includes quick scripts to exercise the evaluation system:
- `backend/sanity_test.py` — Runs each model on a few example sentences.
- `backend/test_engine.py` — Runs full analysis (chunking + hybrid scoring + combined score) on example articles.
- `backend/test_models.py` — Demonstrates how the three model outputs are combined via `combine_scores()`.

---

## ✅ Testing

The backend includes unit tests under `backend/`:

- `test_engine.py`
- `test_event.py`
- `test_models.py`

Run tests with:

```powershell
python -m pytest backend
```

---

## 🛠 Troubleshooting

- **Backend fails to start / model load errors**: Ensure model directories exist and required files (e.g., `model.safetensors`) are present.
- **Frontend can’t reach backend**: Confirm backend is running and check the base URL in `frontend/src/services/api.js`.
- **Linting / formatting**: Frontend uses ESLint config under `frontend/public/lint-*` (legacy) and standard Vite tooling.

---

## 📌 Notes

- This repository is designed to showcase end-to-end bias analysis and comparison workflows.
- The frontend and backend are decoupled; they communicate via REST API.
- The backend uses FastAPI, so you can explore API docs at `http://127.0.0.1:8000/docs`.

---

If you want a guided walkthrough of how to extend one of the models or add a new analysis endpoint, just ask!
