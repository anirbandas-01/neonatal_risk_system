from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import os

app = Flask(__name__)



# Load model
model = tf.keras.models.load_model(
    r"../training/core_model/newborn_health_lstm.h5",
      compile=False
      )

# Mappings
GENDER_MAP = {"male": 0, "female": 1}
FEEDING_MAP = {"breast": 0, "formula": 1, "mixed": 2}
YES_NO_MAP = {"no": 0, "yes": 1}
RISK_CLASSES = ["Low", "Medium", "High"]

def prepare_features(data):
    """Convert all inputs to float for LSTM"""
    features = [
        float(GENDER_MAP[data["gender"].lower().strip()]),
        float(data["gestational_age_weeks"]),
        float(data["birth_weight_kg"]),
        float(data["birth_length_cm"]),
        float(data["birth_head_circumference_cm"]),
        float(data["age_days"]),
        float(data["weight_kg"]),
        float(data["length_cm"]),
        float(data["head_circumference_cm"]),
        float(data["temperature_c"]),
        float(data["heart_rate_bpm"]),
        float(data["respiratory_rate_bpm"]),
        float(data["oxygen_saturation"]),
        float(FEEDING_MAP[data["feeding_type"].lower().strip()]),
        float(data["feeding_frequency_per_day"]),
        float(data["urine_output_count"]),
        float(data["stool_count"]),
        float(data["jaundice_level_mg_dl"]),
        float(data["apgar_score"]),
        float(YES_NO_MAP[data["immunizations_done"].lower().strip()]),
        float(YES_NO_MAP[data["reflexes_normal"].lower().strip()])
    ]
    return np.array(features).reshape(1, 21, 1)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = prepare_features(data)
        
        pred = model.predict(features, verbose=0)
        idx = np.argmax(pred[0])
        
        # ----- NEW CODE: Map to Healthy / At Risk -----
        if idx == 0:  # Low risk
            binary_status = "Healthy"
        else:  # Medium or High risk
            binary_status = "At Risk"
        
        return jsonify({
            "status": binary_status,           # NEW: Healthy/At Risk
            "risk_level": RISK_CLASSES[idx],
            "confidence": float(np.max(pred[0]))
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/')
def home():
    return jsonify({"status": "Newborn Health API"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9000)