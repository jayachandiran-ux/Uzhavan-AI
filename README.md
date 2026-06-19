# Uzhavan AI — Paddy Disease Detection

AI-powered web app that detects paddy leaf diseases from uploaded images and provides fertilizer, pesticide, and organic treatment recommendations.

---

## Project Structure

```
uzhavan-ai/
├── app.py                  # Flask backend
├── train_model.py          # Model training script
├── templates/
│   └── index.html          # Frontend UI
├── static/
│   ├── style.css
│   └── script.js
├── model/                  # Saved model (created after training)
│   └── paddy_disease_model.h5
├── dataset/
│   ├── train/
│   │   ├── bacterial_leaf_blight/
│   │   ├── brown_spot/
│   │   ├── leaf_smut/
│   │   └── healthy/
│   ├── validation/
│   │   └── (same structure)
│   └── test/
│       └── (same structure)
└── README.md
```

---

## Installation

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate        # Linux/Mac
   venv\Scripts\activate           # Windows
   ```

2. Install dependencies:
   ```bash
   pip install flask tensorflow pillow numpy
   ```

---

## Dataset Placement

Place your paddy leaf images inside the `dataset/` folder following this structure:

```
dataset/train/bacterial_leaf_blight/   ← training images for this class
dataset/train/brown_spot/
dataset/train/leaf_smut/
dataset/train/healthy/

dataset/validation/bacterial_leaf_blight/
...

dataset/test/bacterial_leaf_blight/
...
```

Each subfolder name is the class label. Images should be JPG or PNG format.

---

## Train the Model

Once the dataset is in place, run:

```bash
python train_model.py
```

This will:
- Load and augment training images
- Train a MobileNetV2-based transfer learning model
- Save the best model to `model/paddy_disease_model.h5`

Training takes a few minutes depending on your hardware. GPU is recommended but not required.

---

## Run the App

```bash
python app.py
```

Open your browser and go to: `http://127.0.0.1:5000`

---

## Disease Classes

| Class | Type |
|---|---|
| bacterial_leaf_blight | Bacterial |
| brown_spot | Fungal |
| leaf_smut | Fungal |
| healthy | — |

---

## Notes

- Train the model before running the app, otherwise predictions will fail.
- The model expects 224×224 RGB images.
- For best results, use clear, well-lit photos of individual paddy leaves.
