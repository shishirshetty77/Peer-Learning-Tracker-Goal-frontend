import { useEffect, useState } from "react";
import axios from "axios";

export default function GroupOverlay({ group, onClose }) {
  const [goals, setGoals] = useState([]);

  const fetchGroupGoals = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/goals/by-group/${group._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to fetch group goals:", err);
    }
  };

  useEffect(() => {
    fetchGroupGoals();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white text-black w-full max-w-2xl p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
        <p className="text-gray-600 mb-4">
          Created by: {group.members[0]?.name || "Unknown"}
        </p>

        <h3 className="text-xl font-semibold mb-2">Group Goals</h3>
        {goals.length === 0 ? (
          <p className="text-sm text-gray-500">No goals yet in this group.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {goals.map((goal) => (
              <li
                key={goal._id}
                className="bg-gray-100 p-3 rounded-lg border border-gray-300"
              >
                <strong>{goal.title}</strong>
                <p className="text-sm">
                  Progress: {goal.progress}% | Deadline:{" "}
                  {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}