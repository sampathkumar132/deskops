// src/features/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import users from "../../sampleData/users.json";
import { setAuth } from "./auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const auth = JSON.parse(sessionStorage.getItem("auth") || "null");

    if (auth && auth.role) {
      if (auth.role === "admin") navigate("/admin");
      else navigate("/user");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please provide username and password");
      return;
    }

    const foundUser = users.find(
      (u) =>
        u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );

    if (!foundUser) {
      setError("Invalid username or password");
      return;
    }

    const authData = {
      username: foundUser.username,
      role: (foundUser.role || "user").toLowerCase().trim(),
      ts: Date.now(), // optional: when logged in
    };

    // store via helper; wrap in try/catch just in case
    try {
      setAuth(authData);
      console.log("Auth stored:", authData);
    } catch (err) {
      console.error("Failed to save auth:", err);
      setError("Could not persist session. Check browser settings.");
      return;
    }

    // navigate after storing
    if (authData.role === "admin") navigate("/admin");
    else navigate("/user");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
