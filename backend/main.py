from flask import Flask, request, jsonify
import json

#GIT COMMANDS (uwu)
#git add . 
#git status
#git commit -m "name"
#git push
#git status
#git log
#git pull
#git checkout -b "name" (create branch)
#git push origin Niki-dev
#git pull origin main
#

app = Flask(__name__)
user_data = {}

EMOTIONS = [
    "Happy", "Sad", "Angry", "Surprised", "Neutral",
    "Disgusted", "Scared", "Excited", "Confused"
]

progress = {
    "total_emotions_practiced": 0
}

#---------------------INITIAL TEST ROUTES-------------------
def fakeData():
    return "Happy"

#Sample route that gets request from frontend button and returns a message
@app.route('/api/hello_world', methods=['GET'])
def hello_world():
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

# -------------- RUN THE SERVER --------------
if __name__ == "__main__":
    app.run(debug=True)








