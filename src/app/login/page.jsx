"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactHowler from "react-howler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [musicTrack, setMusicTrack] = useState("main"); // "main" or "fail"
  const [musicKey, setMusicKey] = useState(0); // To force restart music

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
      ? `${API_BASE_URL}/api/auth/login`
      : `${API_BASE_URL}/api/auth/register`;

    try {
      const res = await axios.post(url, { email, password });
      if (res.data.token && isLogin) {
        localStorage.setItem("token", res.data.token);
        setShowSuccess(true);
        setMusicTrack("main");
        setMusicKey((prev) => prev + 1);
        setTimeout(() => router.push("/dashboard"), 3000);
      } else if (!isLogin) {
        setShowSuccess(true);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Authentication failed.");
      setMusicTrack("fail"); // switch to dark mode soundtrack
      setMusicKey((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const getMusicSrc = () => {
    return musicTrack === "fail"
      ? "/login-fail-theme.mp3"
      : "/epic-login-theme.mp3";
  };

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center overflow-hidden">
      {/* Epic Background Music */}
      <ReactHowler
        key={musicKey}
        src={getMusicSrc()}
        playing
        loop
        volume={0.8}
      />

      {/* Cosmic Particle Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-[spin_60s_linear_infinite] bg-[radial-gradient(ellipse_at_center,_#0ff,_transparent)] blur-3xl opacity-10"></div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="relative z-10 bg-gradient-to-br from-[#1a1a2e]/80 via-[#0f3460]/80 to-[#16213e]/80 backdrop-blur-3xl text-white rounded-3xl p-8 max-w-sm w-full shadow-[0_0_80px_rgba(0,255,255,0.3)] border border-white/20"
      >
        <h1 className="text-4xl font-extrabold text-center tracking-widest glow-text">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <div className="space-y-5 mt-8">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
          {!isLogin && (
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          )}

          {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#ff0080] via-[#7928ca] to-[#2afadf] text-white rounded-xl font-bold shadow-lg hover:shadow-pink-500/50 transition-all"
          >
            {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
          </motion.button>

          <p className="text-center text-white/70">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="ml-2 text-cyan-300 hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-green-300 text-center mt-4 text-sm animate-pulse"
              >
                ✅ {isLogin ? "Welcome back! Redirecting..." : "Account created. Please log in to continue."}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}