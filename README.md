# Newborn Health Monitor — Clinical Decision Support System

[![Project Banner](model/Screenshot 2026-01-05 222950.png)](model/Screenshot 2026-01-05 222950.png)

Authors: Project Team  
License: MIT

Abstract
--------
Newborn Health Monitor is a research‑grade clinical decision support system (CDSS) that combines structured clinical inputs with a modular sequence‑modeling pipeline to produce actionable neonatal risk assessments and clinician‑ready prescriptions. This README is written in a concise, paper‑style format (abstract, methods, experiments, results, conclusions) and is intended to serve both as documentation for developers and as a readable summary for researchers and stakeholders.

If you place the screenshot image you provided into `model/figures/hero.png` this README will display it above. The image shows the system landing page; we highlight the UI hero region and the backend model fusion/attention code that powers the "AI-Assisted" predictions later in the README.

Table of contents
- Abstract
- Introduction & motivation
- System overview (architecture)
- Model design (parallel-box + attention) — highlighted code
- Attention / explanation visualization (how to highlight "attracting" regions)
- Quickstart (developer)
- Reproducibility, security & data governance
- Evaluation & suggested experiments
- Deployment & MLOps recommendations
- Acknowledgements & references

Introduction & motivation
-------------------------
Early identification of newborn health risks improves outcomes through timely intervention. This project combines:
- clinician-captured features (demographics, vitals, labs, sensor signals),
- a modular, interpretable neural architecture that processes distinct feature groups in parallel,
- attention-based fusion to produce clinically meaningful risk scores,
- a lightweight prescription generation module for clinician use.

Our design goals:
- Interpretability (attention + visualization)
- Reproducibility (pinned environments, Docker)
- Modularity (separate streams; independent retraining)
- Security & privacy (no PHI in repo; secrets must be managed externally)

System overview (concise)
-------------------------
High-level components:
- Frontend: clinician UI (login, assessment forms, history, download prescription). Screenshot shown above.
- Backend API: Node/Express service that authenticates clinicians, records assessments, requests model inference, generates PDF prescriptions.
- Model service: a containerized inference endpoint (FastAPI/uvicorn or TensorFlow Serving) exposing `/predict` and `/health`.
- Storage: MongoDB for structured records (use managed, RBAC-enabled instance).

Architecture diagram (conceptual)
- Input -> Parallel encoders (per feature group) -> Attention fusion -> Pool -> Classifier head -> Risk score & explanation
- Frontend <---> Backend API <---> Model Server

Model design (parallel-box + attention)
--------------------------------------
We recommend a modular, parallel encoder design. Each encoder handles a semantically related group of features (for example: vitals, labs, demographics, or sensor channels). Encoders are small bidirectional RNNs (or GRUs) with LayerNorm and dropout. Outputs are fused via attention and pooled into a compact classifier head.

Below is a clean, ready-to-commit code snippet. The highlighted lines (commented with >>> HIGHLIGHT <<<) show precisely where the FUSION & ATTENTION occurs — this is the portion you asked to have highlighted and tied to the UI hero image.

Place this file as `model/src/parallel_attention_model.py` (or adapt to your existing codebase).

```python
# model/src/parallel_attention_model.py
import tensorflow as tf
from tensorflow.keras import layers, models, regularizers

def build_parallel_attention_model(timesteps, features, n_classes=2):
    """
    Parallel encoders -> attention fusion -> classifier head.

    Highlighted fusion/attention portion is marked with >>> HIGHLIGHT <<<
    """
    inputs = layers.Input(shape=(timesteps, features), name="input_sequence")

    # -------------------------
    # Shared projection (optional)
    # -------------------------
    proj = layers.Dense(128, activation="relu", name="feature_projection")(inputs)
    proj = layers.LayerNormalization(name="proj_ln")(proj)

    # -------------------------
    # Parallel encoder streams
    # -------------------------
    # Stream A (e.g., vitals)
    encA = layers.Bidirectional(
        layers.LSTM(128, return_sequences=True, recurrent_dropout=0.1),
        name="bidir_lstm_A"
    )(proj)
    encA = layers.LayerNormalization(name="ln_A")(encA)
    encA = layers.Dropout(0.2, name="drop_A")(encA)

    # Stream B (e.g., labs)
    encB = layers.Bidirectional(
        layers.LSTM(64, return_sequences=True, recurrent_dropout=0.1),
        name="bidir_lstm_B"
    )(proj)
    encB = layers.LayerNormalization(name="ln_B")(encB)
    encB = layers.Dropout(0.2, name="drop_B")(encB)

    # Stream C (e.g., sensor channels)
    encC = layers.Bidirectional(
        layers.LSTM(32, return_sequences=True, recurrent_dropout=0.1),
        name="bidir_lstm_C"
    )(proj)
    encC = layers.LayerNormalization(name="ln_C")(encC)
    encC = layers.Dropout(0.2, name="drop_C")(encC)

    # -------------------------
    # CONCATENATE encoder outputs
    # -------------------------
    concat = layers.Concatenate(axis=-1, name="concat_encoders")([encA, encB, encC])

    # >>> HIGHLIGHT: FUSION & ATTENTION BLOCK <<<
    # The attention layer below fuses temporal & cross-stream information.
    # Extract attention scores during inference by calling with return_attention_scores=True.
    mha = layers.MultiHeadAttention(num_heads=4, key_dim=64, name="multihead_attention")
    # Attention output: attn_out (batch, timesteps, dim)
    # If you need attention weights: call mha(..., return_attention_scores=True)
    attn_out = mha(query=concat, value=concat)   # <<< FUSION - attention applied here >>>

    attn_out = layers.LayerNormalization(name="attn_ln")(attn_out)
    pooled = layers.GlobalAveragePooling1D(name="global_avg_pool")(attn_out)
    # <<< END HIGHLIGHT >>>

    # -------------------------
    # Classification head
    # -------------------------
    h = layers.Dense(64, activation="gelu", name="head_dense1")(pooled)
    h = layers.Dropout(0.2, name="head_drop1")(h)
    h = layers.Dense(32, activation="gelu", name="head_dense2")(h)
    outputs = layers.Dense(n_classes, activation="softmax" if n_classes>1 else "sigmoid",
                           name="output_layer")(h)

    model = models.Model(inputs=inputs, outputs=outputs, name="parallel_attention_model")
    return model

# Example usage:
# model = build_parallel_attention_model(timesteps=120, features=16, n_classes=2)
# model.summary()
```

Attention extraction (highlighted code)
- To visualize or export attention weights at inference time, call the `MultiHeadAttention` with `return_attention_scores=True`. Example:

```python
# During inference (example)
mha_layer = model.get_layer("multihead_attention")
# Create a functional call to obtain scores; ensure you use the same query/value inputs
attn_out, attn_scores = mha_layer(query=concat, value=concat, return_attention_scores=True)
# attn_scores shape: (batch, num_heads, Tq, Tv)
# Save attn_scores for visualization (heatmaps, bbox highlights).
```

Attention visualization & "attracting" regions
-----------------------------------------------
We recommend the following visualization pipeline:
1. Average attention scores across heads (or inspect individual heads).
2. Produce a heatmap (query timesteps x value timesteps).
3. Detect contiguous high-attention blocks (simple threshold + connected components).
4. Overlay bounding boxes on the heatmap to highlight "attracting" regions.
5. Aggregate attention mass per stream (use index ranges from the concat stage) for a compact bar view.

Minimal plotting snippet:

```python
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# attn_scores: (batch, num_heads, Tq, Tv)
attn_avg = attn_scores[0].mean(axis=0)  # average heads -> (Tq, Tv)
sns.heatmap(attn_avg, cmap="viridis")
plt.title("Attention heatmap (avg heads)")
plt.xlabel("Value timesteps")
plt.ylabel("Query timesteps")
plt.show()
```

How the UI screenshot maps to code (linking image & code)
--------------------------------------------------------
- The hero UI (screenshot stored at `model/figures/hero.png`) invites clinicians to "Login to Start" and to "View System Capabilities".
- When a clinician submits an assessment, the Backend:
  1. Records inputs in MongoDB,
  2. Calls the Model Server `/predict` endpoint,
  3. Receives risk score + explanation (attention snapshots),
  4. Returns result to the frontend and optionally generates a prescription PDF.

We highlight the FUSION & ATTENTION block in the model code above because it is the component that produces the explainability artifacts shown in the UI (e.g., the "why" panels, highlighted timesteps, or contributing features).

Developer Quickstart
--------------------
1. Clone
```bash
git clone https://github.com/your-org/neonatal_risk_system.git
cd neonatal_risk_system
```

2. Backend
```bash
cd backend
npm ci
cp .env.example .env   # fill credentials; do not commit
npm run dev
```

3. Model (Python)
```bash
cd model
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python model/src/train.py --config config/train.yaml    # example
uvicorn model.src.serve:app --host 0.0.0.0 --port 9000
```

4. Frontend
- Follow `frontend/README.md` to run the UI. Place the provided hero screenshot at `model/figures/hero.png` to make README visuals match your application.

Reproducibility, security & governance
--------------------------------------
- Do NOT commit secrets. Use `.env.example` with placeholders and add `.env` to `.gitignore`.
- Rotate any compromised credentials immediately.
- For clinical data: keep all raw PHI outside the repository and use managed, encrypted storage.
- Pin package versions (backend `package-lock.json`; model `requirements.txt` / `environment.yml`).
- Use Docker for reproducible runtime: see `docker/` or `docker-compose.yml` (recommended).

Evaluation & suggested experiments
----------------------------------
- Baselines: replicate original stacked-LSTM and compare with the parallel-attention model on the same splits.
- Metrics: AUC-ROC, sensitivity @ fixed specificity, precision, calibration (Brier score), decision curve analysis.
- Ablation: test (a) without attention, (b) with BatchNorm vs LayerNorm, (c) uni- vs bi-directional RNNs.
- Explainability: correlate attention regions with clinical events; validate with domain experts.

Deployment & MLOps
------------------
- Containerize backend and model server; run in an orchestrator (Kubernetes) behind an ingress controller with TLS.
- Use a secrets manager (Vault, AWS Secrets Manager, GitHub Secrets).
- CI: run linting, unit tests, model smoke tests, and artifact build on PRs.
- Model registry: store model artifacts (MLflow, S3) and track versions used in production.

Writing style & citation (MIT paper-like)
-----------------------------------------
This README intentionally mirrors research-paper clarity: concise abstract, structured methods, and reproducible instructions. When drafting an accompanying manuscript, use this README sections as the "Methods" and "Supplementary Materials" skeleton.

Acknowledgements & references
-----------------------------
- This project follows best practices from modern sequence modeling and MLOps: LayerNorm for RNNs, attention-based fusion, and multi-headed interpretability.
- Suggested reading:
  - Vaswani et al., "Attention is All You Need" (for multihead attention)
  - Ba et al., "Layer Normalization"
  - Recent clinical ML guidelines for model evaluation & reporting

Contributing
------------
- Use issues and pull requests.
- Add tests for model preprocessing and API endpoints.
- For security issues, create a private report and follow responsible disclosure.

Contact
-------
For collaboration or questions, open an issue on GitHub.

----

Notes about the screenshot (Image 2)
- To include the screenshot shown at the top of this README, add the image file you provided to:
  `model/figures/hero.png`
- The README displays the image at the top and, in the "How the UI screenshot maps to code" section, links the UI actions to the highlighted fusion & attention code block above.

If you want, I can:
- produce the Mermaid diagram (parallel-box) as an SVG and add it to `model/figures/architecture.svg`,
- generate `model/visualization/attention_viz.py` that produces example heatmaps + bbox highlights on synthetic data,
- create a short example notebook `model/notebooks/attention_demo.ipynb` that runs end-to-end on a tiny synthetic dataset and visualizes attention.

Which of these should I create next?
