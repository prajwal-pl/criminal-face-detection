import urllib.request
import os

def download_file(url, filename):
    try:
        urllib.request.urlretrieve(url, filename)
        print(f"Downloaded {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

# Create models directory if it doesn't exist
if not os.path.exists('models'):
    os.makedirs('models')

# Base URL for the models
base_url = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# List of models to download
models = [
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_recognition_model-shard2'
]

# Download each model
for model in models:
    url = f"{base_url}/{model}"
    filename = f"models/{model}"
    download_file(url, filename)
