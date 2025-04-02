import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.email !== user.email || storedUser.password !== user.password) {
      setError("Invalid email or password.");
      return;
    }

    // Save session and redirect to home
    localStorage.setItem("isAuthenticated", "true");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-200 to-yellow-400">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg bg-slate-900 text-indigo-300 shadow-xl">
        <h1 className="text-3xl font-semibold text-white text-center">Login</h1>
        <p className="text-center text-md">Login to your account</p>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-3 rounded-full bg-[#333A5c] px-6 py-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-transparent border-none outline-none text-white w-full"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 flex gap-3 rounded-full bg-[#333A5c] px-6 py-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-transparent border-none outline-none text-white w-full"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="w-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 py-3 font-medium tracking-wide text-white">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Don't have an account? <Link to="/signup" className="hover:underline text-blue-400">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
