// src/features/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuth } from "./auth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

const API_BASE = "http://localhost:3000";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const authStr = sessionStorage.getItem("auth");
    if (authStr) {
      try {
        const auth = JSON.parse(authStr);
        if (auth && auth.role) {
          navigate(auth.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
        }
      } catch (err) {
        console.error("Failed to parse auth", err);
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch users from API
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users. Make sure json-server is running on port 3000.");
      }
      
      const users = await response.json();
      
      const foundUser = users.find(
        (u) =>
          u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
          u.password === password
      );

      if (!foundUser) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }

      // Save auth
      setAuth(foundUser);

      // Navigate based on role
      if (foundUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (foundUser.role === "user") {
        navigate("/user/dashboard");
      } else {
        setError("Unknown user role");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark-bg relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-600/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-violet-400 mb-2">
            DESKOPS
          </h1>
          <p className="text-slate-400">Enterprise Resource Management</p>
        </div>

        <Card className="backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">
                Contact Admin
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
