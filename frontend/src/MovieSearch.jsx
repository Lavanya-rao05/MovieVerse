import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const MovieSearch = () => {
  const [query, setQuery] = useState(localStorage.getItem("searchQuery") || "");
  const [movies, setMovies] = useState(
    JSON.parse(localStorage.getItem("searchResults")) || []
  );
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [showFavorites, setShowFavorites] = useState(false); // Toggle favorites
  const [filters, setFilters] = useState({
    year: localStorage.getItem("filterYear") || "",
    rating: localStorage.getItem("filterRating") || "",
    genre: localStorage.getItem("filterGenre") || "",
    language: localStorage.getItem("filterLanguage") || "",
  });

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) handleSearch();
  }, []); // Run only when the page reloads

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a search query.");
      return;
    }

    try {
      const res = await axios.get(`http://127.0.0.1:5000/search`, {
        params: {
          query: query,
          genre: filters.genre || null,
          year: filters.year || null,
          rating: filters.rating || null,
          language: filters.language || null,
        },
      });

      let filteredMovies = res.data;
      filteredMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));

      setMovies(filteredMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  const handleLogout = () => {
    console.log("Logging out..."); // Debug log

    // ✅ Clear localStorage and sessionStorage properly
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("favorites"); // Optional: Clear favorites
    sessionStorage.clear();

    console.log("After Clearing:", localStorage.getItem("token")); // Debug log

    // ✅ Update authentication state
    setIsAuthenticated(false);

    // ✅ Ensure rerender by using a delay
    setTimeout(() => {
      navigate("/signup", { replace: true });
    }, 100);
  };

  // ✅ Add to Favorites
  const addToFavorites = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // ✅ Remove from Favorites
  const removeFromFavorites = (movieID) => {
    const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movieID);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      {/* Header with User and Favorites Icon */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">🎬 Movie Search</h1>

        {/* Icons Container - Wrapped in one div */}
        <div className="flex items-center space-x-3 relative">
          {/* Favorites (Heart) Icon */}
          <FaHeart
            className="text-red-500 text-2xl cursor-pointer hover:text-red-700"
            onClick={() => setShowFavorites(!showFavorites)}
          />

          {/* User Icon with Dropdown */}
          <div
            className="relative"
            tabIndex={0}
            onBlur={() => setShowDropdown(false)}
          >
            {isAuthenticated ? (
              <>
                <FaUserCircle
                  className="text-gray-300 text-2xl cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                  onFocus={() => setShowDropdown(true)}
                />

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-gray-800 text-white rounded-lg shadow-md z-10">
                    <button
                      onMouseDown={() => handleLogout()} // ✅ Use onMouseDown to avoid dropdown closing first
                      className="block w-full text-left px-4 py-2 hover:bg-red-500 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/signup">
                <FaUserCircle className="text-gray-300 text-2xl cursor-pointer" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="flex-grow px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Genre"
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Min IMDb Rating"
          step="0.1"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Language"
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Show Favorites Section */}
      {showFavorites ? (
        <div>
          <h2 className="text-2xl font-bold mb-3">❤️ Favorite Movies</h2>
          {favorites.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favorites.map((movie) => (
                <li
                  key={movie.imdbID}
                  className="bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {movie.Title} ({movie.Year})
                  </h3>
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-auto rounded-md"
                  />
                  <br />
                  <button
                    onClick={() => removeFromFavorites(movie.imdbID)}
                    className="text-red-400 hover:text-red-600 mt-2"
                  >
                    Remove ❤️
                  </button>
                  <br />
                  <Link
                    to={`/details/${movie.imdbID}`}
                    className="text-blue-400 hover:underline mt-2 inline-block"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">No favorites yet.</p>
          )}
        </div>
      ) : (
        // Search Results
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <li
              key={movie.imdbID}
              className="bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105"
            >
              {/* Wrap everything inside the Link except the favorite button */}
              <Link
                to={`/details/${movie.imdbID}`}
                className="block cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {movie.Title} ({movie.Year})
                </h3>
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-auto rounded-md"
                />
              </Link>

              {/* Keep the Add to Favorites button outside the Link to prevent accidental navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents navigation when clicking the button
                  addToFavorites(movie);
                }}
                className="text-yellow-400 hover:text-yellow-600 mt-2"
              >
                Add to Favorites ⭐
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieSearch;
