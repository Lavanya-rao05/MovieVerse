const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      fetchRecommendedMovies();
    }
  }, [favorites]);

  const fetchRecommendedMovies = async () => {
    let recommended = [];

    for (let movie of favorites) {
      if (movie.Genre) {
        try {
          const res = await axios.get(
            `http://127.0.0.1:5000/search?query=${movie.Genre.split(",")[0]}`
          );
          recommended.push(...res.data.slice(0, 3)); // Take top 3 recommendations per favorite movie
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }
    }

    setRecommendations(recommended);
  };

  const removeFromFavorites = (imdbID) => {
    const updatedFavorites = favorites.filter(movie => movie.imdbID !== imdbID);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg mb-4 hover:bg-gray-600 transition"
      >
        ⬅ Back
      </button>
      <h1 className="text-3xl font-bold mb-4">⭐ Favorite Movies</h1>
      {favorites.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((movie) => (
            <li key={movie.imdbID} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                {movie.Title} ({movie.Year})
              </h3>
              <img src={movie.Poster} alt={movie.Title} className="w-full h-auto rounded-md" />
              <br />
              <Link to={`/details/${movie.imdbID}`} className="text-blue-400 hover:underline">View Details</Link>
              <button 
                onClick={() => removeFromFavorites(movie.imdbID)} 
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No favorites yet.</p>
      )}

      <h2 className="text-2xl font-bold mt-6">🎥 Recommended Movies</h2>
      {recommendations.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {recommendations.map((movie) => (
            <li key={movie.imdbID} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                {movie.Title} ({movie.Year})
              </h3>
              <img src={movie.Poster} alt={movie.Title} className="w-full h-auto rounded-md" />
              <br />
              <Link to={`/details/${movie.imdbID}`} className="text-blue-400 hover:underline">View Details</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 mt-2">No recommendations yet.</p>
      )}
    </div>
  );
};

export default Favorites;