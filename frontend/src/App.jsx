import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MovieSearch from "./MovieSearch";
import MovieDetails from "./MovieDetails";
import Favorites from "./Favorite";
import Signup from "./Signup";
import Login from "./Login";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen p-4 ">
          <Routes>
            <Route path="/" element={<MovieSearch />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/details/:movieId" element={<MovieDetails />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
