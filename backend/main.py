from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Load API keys from .env file
OMDB_API_KEY = os.getenv("OMDB_API_KEY")
MOVIES_DB_API_KEY = os.getenv("MOVIES_DB_API_KEY")
STREAMING_API_KEY = os.getenv("STREAMING_API_KEY")

# OMDb API base URL
OMDB_URL = "http://www.omdbapi.com/"
MOVIES_DB_URL = "https://moviesdatabase.p.rapidapi.com"
STREAMING_URL = "https://streaming-availability.p.rapidapi.com"

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to MovieVerse API!"})

# Search for movies
@app.route("/search", methods=["GET"])
def search_movies():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    params = {"apikey": OMDB_API_KEY, "s": query, "type": "movie"}
    response = requests.get(OMDB_URL, params=params)
    data = response.json()
    
    if "Search" in data:
        return jsonify(data["Search"])
    return jsonify({"error": "No movies found"}), 404

# Get movie details
@app.route("/details/<movie_id>", methods=["GET"])
def get_movie_details(movie_id):
    params = {"apikey": OMDB_API_KEY, "i": movie_id, "plot": "full"}
    response = requests.get(OMDB_URL, params=params)
    data = response.json()
    return jsonify(data)

@app.route("/streaming/<movie_id>", methods=["GET"])
def get_streaming_info(movie_id):
    headers = {
        "X-RapidAPI-Key": STREAMING_API_KEY,
        "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com"
    }
    
    url = f"https://streaming-availability.p.rapidapi.com/shows/{movie_id}?series_granularity=episode&output_language=en"
    
    response = requests.get(url, headers=headers)
    
    try:
        data = response.json()
        return jsonify(data)
    except requests.exceptions.JSONDecodeError:
        return jsonify({"error": "Invalid response from API"}), 500

if __name__ == "__main__":
    app.run(debug=True)
