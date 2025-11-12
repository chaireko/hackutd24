from flask import Flask, request, jsonify
from flask_cors import CORS
#import json
from dotenv import load_dotenv
import os
import requests
import numpy as np
from deepface import DeepFace
import base64
from io import BytesIO
from PIL import Image
import cv2
load_dotenv()
import random

progress = {
    "total_emotions_practiced": 0,
    "correct_emotions": 0,
    "incorrect_emotions": 0,
    "emotion_stats": {}
}

#HOW DO I MAKE THIS API CALL. IDK
pinata_api_key = os.getenv('PINATA_API_KEY')
pinata_api_secret = os.getenv('PINATA_API_SECRET')
# client = Pinata(api_key=pinata_api_key, api_secret=pinata_api_secret)

app = Flask(__name__)
CORS(app)
user_data = {}

EMOTIONS = [
    "Happy", "Sad", "Angry", "Surprised", "Neutral",
    "Disgusted", "Scared", "Excited", "Confused"
]

progress = {
    "total_emotions_practiced": 0
}

#CD: c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD
#---------------------API CALL TO FETCH FILES-------------------
@app.route('/api/get_pinata_files', methods=['GET'])
def get_pinata_files():
    try:
        # Load API keys from environment variables
        pinata_api_key = os.getenv('PINATA_API_KEY')
        pinata_api_secret = os.getenv('PINATA_API_SECRET')
        pinata_jwt = os.getenv('PINATA_JWT')
        # API endpoint to list pinned items

        url = "https://api.pinata.cloud/v3/files"

        print("Bearer " + str(pinata_jwt))
        headers = {"Authorization": "Bearer " + str(pinata_jwt)}

        response = requests.request("GET", url, headers=headers)

        print(response.data.files)
        files = response.data.files
        if files:
            random_num = random.randint(0, 8)
            random_file = files[random_num]
            return random_file
        

        # Make the API call to Pinata
        response = requests.get(url, headers=headers)
        print(response.text)

        if response.status_code == 200:
            files_data = response.json()

            print(files_data)

            # Extract and format file information
            rows = []
            for file in files_data.get('rows', []):
                ipfs_hash = file.get('ipfs_pin_hash')
                file_name = file.get('metadata', {}).get('name', 'Unknown')
                # Skip directories or entries without a valid hash
                if ipfs_hash and not file.get('isDirectory', False):
                    # Infer the answer based on the file name (e.g., "happy_1.png" -> "Happy")
                    if "happy" in file_name.lower():
                        answer = "Happy"
                    elif "sad" in file_name.lower():
                        answer = "Sad"
                    elif "angry" in file_name.lower():
                        answer = "Angry"
                    else:
                        answer = "Unknown"

                    rows.append({
                        "ipfs_hash": ipfs_hash,
                        "file_name": file_name,
                        "answer": answer,  # Include the answer in the response
                    })

            return jsonify({"rows": rows}), 200
        else:
            return jsonify({"error": f"Failed to retrieve files: {response.text}"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#---------------------INITIAL TEST ROUTES-------------------
#Sample route that gets request from frontend button and returns a message
@app.route('/api/hello_world', methods=['GET'])
def hello_world():
    print("WE ARE HERE")
    return jsonify({"message": "Hello World"}) 

#start collection
@app.route('/start_emotion', methods=['POST'])
def start_emotion():
    #check if the (toouch ripple) hand signal was made 
    return jsonify({"status": "Collection started"})

#end collection 
@app.route('/end_emotion', methods=['POST'])
def end_emotion():
    #check if the (toouch ripple) hand signal was made again (end)
    emotion = "Happy" #replace
    return jsonify({"emotion": emotion})

#Route for request from frontend button     
@app.route('/api/return_emotion', methods=['GET'])
def analyze_emotion(data):
    return jsonify({"emotion": "Neutral"})

# ----------------- PROGRESS TRACKING ROUTES -----------------

@app.route('/api/progress', methods=['POST'])
def save_progress():
    data = request.get_json()
    if not data or "emotion" not in data or "correct" not in data:
        return jsonify({"error": "Invalid data"}), 400

    emotion = data["emotion"]
    correct = data["correct"]

    # Update total emotions practiced
    progress["total_emotions_practiced"] += 1
    if correct:
        progress["correct_emotions"] += 1
    else:
        progress["incorrect_emotions"] += 1

    # Update stats for the specific emotion
    if emotion not in progress["emotion_stats"]:
        progress["emotion_stats"][emotion] = {"practiced": 0, "correct": 0}
    progress["emotion_stats"][emotion]["practiced"] += 1
    if correct:
        progress["emotion_stats"][emotion]["correct"] += 1

    return jsonify({"message": "Progress saved successfully!"})


@app.route('/api/progress', methods=['GET'])
def get_progress():
    return jsonify({
        "total_emotions_practiced": progress["total_emotions_practiced"]
    })

@app.route('/api/insights', methods=['GET'])
def get_insights():
    most_practiced_emotion = max(progress["emotion_stats"], key=lambda e: progress["emotion_stats"][e]["practiced"])
    least_practiced_emotion = min(progress["emotion_stats"], key=lambda e: progress["emotion_stats"][e]["practiced"])
    accuracy = (progress["correct_emotions"] / progress["total_emotions_practiced"]) * 100 if progress["total_emotions_practiced"] > 0 else 0

    insights = {
        "mostPracticedEmotion": most_practiced_emotion,
        "leastPracticedEmotion": least_practiced_emotion,
        "accuracy": f"{accuracy:.2f}%",
        "totalEmotionsPracticed": progress["total_emotions_practiced"]
    }
    return jsonify(insights)
@app.route('/classify_emotion', methods=['POST'])
def classify_emotion():
    try:
        data = request.get_json()
        app.logger.debug(f"Received data: {data}")
        if not data or 'image' not in data:
            app.logger.error("No image provided in the request")
            return jsonify({'error': 'No image provided'}), 400

        img_data = data['image']

        # Handle base64 data URL
        if ',' in img_data:
            header, encoded = img_data.split(',', 1)
        else:
            encoded = img_data

        # Decode the base64 image
        img_bytes = base64.b64decode(encoded)
        image = Image.open(BytesIO(img_bytes)).convert('RGB')
        img_array = np.array(image)

        # Verify img_array dtype
        app.logger.debug(f"img_array dtype: {img_array.dtype}")
        if img_array.dtype != np.uint8:
            img_array = img_array.astype(np.uint8)
            app.logger.debug("Converted img_array to uint8")

        # Convert RGB to BGR for OpenCV
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

        # Verify img_bgr dtype
        app.logger.debug(f"img_bgr dtype: {img_bgr.dtype}")
        if img_bgr.dtype != np.uint8:
            img_bgr = img_bgr.astype(np.uint8)
            app.logger.debug("Converted img_bgr to uint8")

        # Analyze emotion using DeepFace
        analysis = DeepFace.analyze(img_bgr, actions=['emotion'], enforce_detection=True)

        # Process the analysis result
        emotions_detected = []

        if isinstance(analysis, list):
            # Multiple faces detected
            for idx, face_analysis in enumerate(analysis):
                emotion = face_analysis.get('dominant_emotion', 'Unknown')
                confidence = face_analysis.get('emotion', {}).get(emotion, 0)
                emotions_detected.append({
                    'face': idx + 1,
                    'emotion': emotion,
                    'confidence': confidence
                })
        elif isinstance(analysis, dict):
            # Single face detected
            emotion = analysis.get('dominant_emotion', 'Unknown')
            confidence = analysis.get('emotion', {}).get(emotion, 0)
            emotions_detected.append({
                'face': 1,
                'emotion': emotion,
                'confidence': confidence
            })
        else:
            # Unexpected type
            app.logger.error(f"Unexpected analysis type: {type(analysis)}")
            return jsonify({'error': 'Unexpected response from emotion analysis'}), 500

        app.logger.debug(f"Detected emotions: {emotions_detected}")

        return jsonify({
            'emotions': emotions_detected
        }), 200

    except Exception as e:
        app.logger.exception(f"Error processing image: {e}")
        return jsonify({'error': 'Failed to process the image'}), 500

# -------------- RUN THE SERVER --------------
if __name__ == "__main__":
    app.run(debug=True)








