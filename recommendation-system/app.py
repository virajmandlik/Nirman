from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Free API URLs
YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search"
BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

# Video Recommendations Route
@app.route("/videos", methods=["GET", "OPTIONS"])
def videos():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight request successful"}), 200

    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    api_key = "AIzaSyB6PV_P2Fw9EklQE7FvBV8A1BycmcHebVw" 
    params = {
        "q": query,
        "key": api_key,
        "part": "snippet",
        "type": "video",
        "maxResults": 5
    }
    try:
        response = requests.get(YOUTUBE_API_URL, params=params)
        response.raise_for_status()
        data = response.json()
    
        # Return data directly as expected by the frontend
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch videos", "details": str(e)}), 500

# Documentation/Books Route
@app.route("/books", methods=["GET", "OPTIONS"])
def books():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight request successful"}), 200

    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    params = {
        "q": query,
        "maxResults": 5
    }
    try:
        response = requests.get(BOOKS_API_URL, params=params)
        response.raise_for_status()
        data = response.json()

        books = [
            {
                "title": item["volumeInfo"].get("title", "No title available"),
                "description": item["volumeInfo"].get("description", "No description available"),
                "url": item["volumeInfo"].get("previewLink", "#")
            }
            for item in data.get("items", [])
        ]
        return jsonify(books)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch books", "details": str(e)}), 500

# Health Check Route
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "API is working properly"}), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001) 