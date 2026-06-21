import os
import numpy as np
from flask import Flask, request, jsonify, render_template
from PIL import Image
import io
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "paddy_disease_model.h5")
IMG_SIZE = (224, 224)

CLASS_NAMES = [
    "bacterial_leaf_blight",
    "blast",
    "brown_spot",
    "healthy",
    "leaf_smut",
    "tungro"
]

DISEASE_INFO = {
    "bacterial_leaf_blight": {
        "description": "A bacterial disease causing yellow to brown streaks on paddy leaves.",
        "fertilizer": "Use balanced NPK fertilizer and avoid excess nitrogen.",
        "pesticide": "Apply Streptocycline and Copper Oxychloride based on agricultural guidance.",
        "organic_solution": "Neem oil spray or Pseudomonas bio-control.",
        "prevention": "Avoid excess standing water, remove infected leaves, and use resistant varieties."
    },
    "blast": {
        "description": "Blast is a fungal disease that causes spindle-shaped lesions on leaves.",
        "fertilizer": "Use balanced fertilizer and avoid excess nitrogen.",
        "pesticide": "Apply suitable fungicide such as Tricyclazole based on local agricultural guidance.",
        "organic_solution": "Neem-based spray may help as supportive care.",
        "prevention": "Use resistant varieties, avoid excess nitrogen, and maintain proper spacing."
    },
    "brown_spot": {
        "description": "A fungal disease causing brown circular or oval spots on leaves.",
        "fertilizer": "Apply balanced fertilizer with enough potassium.",
        "pesticide": "Use fungicide such as Mancozeb based on local guidance.",
        "organic_solution": "Neem extract spray.",
        "prevention": "Maintain field hygiene and reduce nutrient deficiency."
    },
    "healthy": {
        "description": "The paddy leaf appears healthy with no major visible disease symptoms.",
        "fertilizer": "Continue balanced fertilizer based on crop stage.",
        "pesticide": "No pesticide needed.",
        "organic_solution": "Maintain preventive care with neem-based support if needed.",
        "prevention": "Keep monitoring the crop regularly and maintain proper field hygiene."
    },
    "leaf_smut": {
        "description": "A fungal disease causing narrow black lesions and smut-like symptoms on leaves.",
        "fertilizer": "Apply balanced nutrients and improve crop health.",
        "pesticide": "Use a suitable fungicide such as Carbendazim if recommended locally.",
        "organic_solution": "Neem-based organic treatment.",
        "prevention": "Remove infected leaves and reduce excess humidity."
    },
    "tungro": {
        "description": "Tungro is a viral disease that causes yellow-orange discoloration and stunted growth.",
        "fertilizer": "Use balanced nutrients to support plant health.",
        "pesticide": "Control insect vectors such as leafhoppers based on agricultural guidance.",
        "organic_solution": "Neem-based insect control can help reduce vector insects.",
        "prevention": "Use healthy seedlings, control leafhoppers, and remove infected plants early."
    }
}

model = None

def load_trained_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
    else:
        print(f"Warning: Model not found at {MODEL_PATH}. Train the model first.")

# Load model at startup (works with both gunicorn and direct python run)
load_trained_model()

def preprocess_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = image.img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/debug")
def debug():
    import sys
    return jsonify({
        "cwd": os.getcwd(),
        "base_dir": BASE_DIR,
        "model_path": MODEL_PATH,
        "model_exists": os.path.exists(MODEL_PATH),
        "model_loaded": model is not None,
        "files_in_base": os.listdir(BASE_DIR)
    })

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Please train the model first."}), 503

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    try:
        img_bytes = file.read()
        img_tensor = preprocess_image(img_bytes)
        predictions = model.predict(img_tensor)[0]

        predicted_index = int(np.argmax(predictions))
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(predictions[predicted_index]) * 100

        if predicted_class != "healthy" and confidence < 90:
            return jsonify({
                "error": "Please upload a clear paddy leaf image only."
            }), 400

        info = DISEASE_INFO.get(predicted_class, {})

        return jsonify({
            "disease": predicted_class.replace("_", " ").title(),
            "confidence": round(confidence, 2),
            **info
        })

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
