import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const navigate = useNavigate(); // Initialize navigation
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [streaming, setStreaming] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/details/${movieId}`);
        setMovie(res.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchStreamingInfo = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/streaming/${movieId}`
        );
        setStreaming(res.data);
      } catch (error) {
        console.error("Error fetching streaming info:", error);
      }
    };

    fetchMovieDetails();
    fetchStreamingInfo();
  }, [movieId]);

  const addToFavorites = (movie) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${movie.Title} added to favorites!`);
    } else {
      alert("Already in favorites!");
    }
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg mb-4 hover:bg-gray-600 transition"
      >
        ⬅ Back
      </button>
      <h1 className="text-3xl font-bold">
        {movie.Title} ({movie.Year})
      </h1>
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="w-full h-auto rounded-md mt-4"
      />
      <p className="mt-4">
        <strong>IMDb Rating:</strong>
        <span className="text-white"> {movie.imdbRating || "N/A"}⭐</span>
      </p>
      <p>
        <strong>Director:</strong>
        <span className="text-white"> {movie.Director}</span>
      </p>
      <p>
        <strong>Plot:</strong>
        <span className="text-gray-300"> {movie.Plot}</span>
      </p>

      <button
        onClick={() => addToFavorites(movie)}
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
      >
        ⭐ Add to Favorites
      </button>

      {streaming && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">📺 Available On:</h2>
          {streaming.result ? (
            <ul className="mt-2">
              {Object.entries(streaming.result).map(([platform, details]) => (
                <li key={platform}>
                  <strong>{platform.toUpperCase()}:</strong>{" "}
                  {details.link ? (
                    <a
                      href={details.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Watch Now
                    </a>
                  ) : (
                    "Not Available"
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No streaming info available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
