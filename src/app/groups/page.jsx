"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinedGroupId, setJoinedGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  };

  const handleJoin = async (groupId) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/groups/join/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinedGroupId(groupId);
      router.push(`/groups/${groupId}`);
    } catch (err) {
      console.error("Failed to join group:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Group name cannot be empty");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/groups/create`,
        { name: newGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGroupName("");
      fetchGroups();
      alert("Group created successfully!");
    } catch (err) {
      console.error("Failed to create group:", err);
      alert("Failed to create group. Check console for details.");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGroups();
    } catch (err) {
      console.error("Failed to delete group:", err);
      alert("Only the group creator can delete this group.");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-black">
      <Particles
        className="absolute inset-0 -z-10"
        init={particlesInit}
        options={{
          background: { color: { value: "#000000" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 120, enable: true, opacity: 0.2, width: 0.5 },
            move: { enable: true, speed: 0.5 },
            number: { value: 60 },
            size: { value: { min: 0.5, max: 2 } },
          },
          detectRetina: true,
        }}
      />

      <main className="relative px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center tracking-wide mb-12 leading-tight" style={{ fontOpticalSizing: 'auto', letterSpacing: '0.05em' }}>
          🌐 Peer Learning Groups
        </h1>

        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-xl p-6 mb-12 shadow-lg">
          <h2 className="text-2xl mb-4 font-semibold">Create New Group</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name"
              className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
            <button
              onClick={handleCreateGroup}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-md font-medium shadow hover:scale-105 transition-transform duration-200"
            >
              Create
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              className="transform transition-transform duration-300 hover:scale-[1.02] hover:rotate-[0.5deg] backdrop-blur-xl border border-white/10 bg-white/5 p-6 rounded-xl shadow-xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <h3 className="text-xl font-bold mb-2">{group.name}</h3>
              <p className="text-sm text-white/60 mb-4">Members: {group.members.length}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleJoin(group._id)}
                  disabled={loading || joinedGroupId === group._id}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 ${
                    joinedGroupId === group._id
                      ? "bg-green-600 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {joinedGroupId === group._id ? "✅ Joined" : loading ? "Joining..." : "Join Group"}
                </button>
                <button
                  onClick={() => handleDeleteGroup(group._id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-xs shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}