import React, { useState } from "react";
import { useParams } from "react-router-dom"
import api from "../api/axios";

type User = {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  password?: string;
  createdAt: number;
  updatedAt: number;
  __v?: number;
};

export default function GetUsers() {
  const [page, setPage] = useState("1");
  const [limit, setLimit] = useState("10");
  const [feild, setField] = useState("");
  const [word, setWord] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get<{ data: User[] }>(
        `/admin/list/${page}/${limit}`,
        {
          params: {
            feild,
            word,
          },
        }
      );

      setUsers(data.data);
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 className="text-xl mb-3">Get All Users</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          className="input"
          placeholder="Page"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />

        <input
          className="input"
          placeholder="Limit"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />

        <select
          className="input"
          value={feild}
          onChange={(e) => setField(e.target.value)}
        >
          <option value="">Select Field</option>
          <option value="fullName">Full Name</option>
          <option value="username">Username</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="role">Role</option>
        </select>

        <input
          className="input"
          placeholder="Search Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />

        <button className="btn" onClick={loadUsers} disabled={loading}>
          {loading ? "Loading..." : "Load"}
        </button>
      </div>
      {users.length > 0 && (
        <div className="mt-6 rounded-xl shadow-md border bg-white overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Username</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Full Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Phone Number</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
              </tr>
            </thead>
      
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u._id}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3 border-b text-gray-700">{u._id}</td>
                  <td className="px-4 py-3 border-b text-gray-700">{u.username}</td>
                  <td className="px-4 py-3 border-b text-gray-700">{u.fullName}</td>
                  <td className="px-4 py-3 border-b text-gray-700">
                    {u.phoneNumber || "-"}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-700">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
