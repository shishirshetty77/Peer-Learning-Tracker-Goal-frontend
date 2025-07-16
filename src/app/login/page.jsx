"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const validatePassword = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    if (!validatePassword()) {
      setLoading(false);
      return;
    }

    const url = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/register";

    try {
      const res = await axios.post(url, { email, password });
      if (res.data.token && isLogin) {
        localStorage.setItem("token", res.data.token);
        setShowSuccess(true);
        router.push("/dashboard");
      } else if (!isLogin) {
        setShowSuccess(true);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center px-4 relative overflow-hidden text-white font-sans">
      {/* Animated Background */}
      <div className="absolute w-full h-full z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500 opacity-20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 opacity-20 blur-3xl rounded-full animate-ping" />
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-sm z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-4 tracking-widest">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          )}

          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="text-sm text-center text-white/70 mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-cyan-300 hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="mt-4 text-green-300 text-sm text-center animate-pulse">
            ✅ {isLogin ? "Welcome back! Redirecting..." : "Account created. Please log in to continue."}
          </div>
        )}
      </div>
    </main>
  );
}