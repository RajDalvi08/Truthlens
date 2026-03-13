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
