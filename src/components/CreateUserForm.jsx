import { useState } from "react";
import API from "../api/axios";

function CreateUserForm({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in as admin");
        return;
      }

      await API.post(
        "/auth/register",
        { username, password, role },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("✅ User created successfully!");
      setUsername("");
      setPassword("");
      setRole("user");
    } catch (error) {
      setMessage("❌ Failed to create user: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded w-96">
      <h2 className="text-xl font-bold mb-4">Create New User</h2>

      {message && <p className="mb-3">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full border p-2 mb-3 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;
