"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function GroupDetailsPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: "", deadline: "", progress: 0 });
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGroupDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/groups/${groupId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroup(res.data.group);
      setGoals(res.data.goals);
    } catch (err) {
      console.error("Failed to fetch group details:", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(res.data.id);
    } catch (err) {
      console.error("Failed to fetch current user info:", err);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.deadline) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/goals",
        newGoal,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals((prev) => [res.data, ...prev]);
      setNewGoal({ title: "", deadline: "", progress: 0 });
    } catch (err) {
      console.error("Failed to add goal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  const handleUpdateProgress = async (id, newProgress) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/goals/${id}`,
        { progress: newProgress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(goals.map((g) => (g._id === id ? res.data : g)));
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
      fetchCurrentUser();
    }
  }, [groupId]);

  if (!group) return <div className="text-white p-6">Loading group...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6 py-10 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📁 {group.name}</h1>
      </div>

      <div className="max-w-2xl mx-auto mb-10 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
        <input
          type="text"
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          placeholder="Goal Title"
          className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          value={newGoal.progress}
          onChange={(e) => setNewGoal({ ...newGoal, progress: Number(e.target.value) })}
          min="0"
          max="100"
          placeholder="Progress %"
          className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddGoal}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
        >
          {loading ? "Adding..." : "Add Goal"}
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <p className="text-gray-300 col-span-full text-center">No goals yet. Start by adding one!</p>
        ) : (
          goals.map((goal) => (
            <div
              key={goal._id}
              className={`relative bg-white/10 backdrop-blur-lg p-5 rounded-xl shadow border border-white/20 hover:shadow-xl transition group ${goal.progress === 100 ? 'ring-2 ring-green-400' : ''}`}
            >
              <h3 className="text-xl font-semibold mb-1 flex justify-between">
                {goal.title}
                {goal.userId === currentUserId && (
                  <button
                    onClick={() => handleDeleteGoal(goal._id)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                )}
              </h3>
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) => handleUpdateProgress(goal._id, Number(e.target.value))}
                className="w-full mt-2"
                disabled={goal.userId !== currentUserId}
              />
              <p className="text-sm text-gray-300">Progress: {goal.progress}%</p>
              <p className={`text-sm ${new Date(goal.deadline) < new Date() ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                Deadline: {goal.deadline?.split("T")[0]}
              </p>
              {goal.progress === 100 && (
                <div className="text-green-400 text-sm mt-2 animate-bounce">✅ Completed!</div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}