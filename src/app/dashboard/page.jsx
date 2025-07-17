"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Confetti from "react-confetti";

const ParticleBackground = dynamic(() => import("./animation"), {
  ssr: false,
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const router = useRouter();

  const fetchGoals = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    }
  };

  const handleAddGoal = async () => {
    if (!title || !deadline) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/goals`,
        { title, deadline, progress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals([res.data, ...goals]);
      setTitle("");
      setDeadline("");
      setProgress(0);
    } catch (err) {
      console.error("Failed to add goal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  const handleUpdateProgress = async (id, newProgress) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/goals/${id}`,
        { progress: newProgress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(goals.map((g) => (g._id === id ? res.data : g)));
      if (newProgress === 100) setConfetti(true);
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white px-6 py-10 font-sans overflow-hidden">
      <ParticleBackground />
      {confetti && <Confetti recycle={false} numberOfPieces={400} />}

      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent"
        >
          🚀 Your  Learning Goals
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/groups")}
          className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          🌐 View Groups
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl mx-auto mb-10 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
        <form className="grid gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal Title"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/50 focus:outline-none"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none"
          />
          <input
            type="number"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            min="0"
            max="100"
            placeholder="Progress %"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddGoal}
            disabled={loading}
            type="button"
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Adding..." : "Add Goal"}
          </motion.button>
        </form>
      </motion.div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <p className="text-gray-300 col-span-full text-center">
            No goals yet. Start by adding one!
          </p>
        ) : (
          goals.map((goal) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`relative bg-white/10 backdrop-blur-lg p-5 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl transition group ${
                goal.progress === 100 ? "ring-2 ring-green-400" : ""
              }`}
            >
              <h3 className="text-xl font-semibold mb-1 flex justify-between">
                {goal.title}
                <button
                  onClick={() => handleDeleteGoal(goal._id)}
                  className="text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              </h3>
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) =>
                  handleUpdateProgress(goal._id, Number(e.target.value))
                }
                className="w-full mt-2 accent-pink-500"
              />
              <p className="text-sm text-gray-300">
                Progress: {goal.progress}%
              </p>
              <p
                className={`text-sm ${
                  new Date(goal.deadline) < new Date()
                    ? "text-red-400 animate-pulse"
                    : "text-gray-400"
                }`}
              >
                Deadline: {goal.deadline?.split("T")[0]}
              </p>
              {goal.progress === 100 && (
                <div className="text-green-400 text-sm mt-2 animate-bounce">
                  ✅ Completed!
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}