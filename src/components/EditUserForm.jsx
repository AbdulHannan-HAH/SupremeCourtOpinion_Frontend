import { useState } from "react";
import API from "../api/axios";

function EditUserForm({ user, onClose, onUpdate }) {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        `/users/${user._id}`,
        { username, password: password || undefined, role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("User updated successfully!");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="border w-full p-2 mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password (leave blank to keep old)"
            className="border w-full p-2 mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="border w-full p-2 mb-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserForm;
