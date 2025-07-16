"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import GroupOverlay from "./GroupOverlay";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinedGroupId, setJoinedGroupId] = useState(null);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/groups", {
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
        `http://localhost:8080/api/groups/join/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinedGroupId(groupId);
      router.push(`/groups/${groupId}`); // 🔁 Redirect to group detail page
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
      const res = await axios.post(
        "http://localhost:8080/api/groups/create",
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
      await axios.delete(`http://localhost:8080/api/groups/${groupId}`, {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">🌐 Peer Learning Groups</h1>

      <div className="max-w-xl mx-auto mb-10 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name"
            className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleCreateGroup}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-white"
          >
            Create
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group._id}
            className="relative bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition group"
          >
            <h2 className="text-xl font-bold mb-2">{group.name}</h2>
            <p className="text-sm text-white/70 mb-4">Members: {group.members.length}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleJoin(group._id)}
                disabled={loading || joinedGroupId === group._id}
                className={`flex-1 py-2 rounded-lg font-semibold transition duration-300 ${
                  joinedGroupId === group._id
                    ? "bg-green-600 text-white cursor-default"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {joinedGroupId === group._id ? "✅ Joined" : loading ? "Joining..." : "Join Group"}
              </button>
              <button
                onClick={() => handleDeleteGroup(group._id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedGroupDetails && (
        <GroupOverlay
          group={selectedGroupDetails.group}
          goals={selectedGroupDetails.goals}
          onClose={() => setSelectedGroupDetails(null)}
        />
      )}
    </main>
  );
}