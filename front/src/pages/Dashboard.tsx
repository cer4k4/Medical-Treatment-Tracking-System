import React, { useState, useEffect } from "react";
import api from "../api/axios";

type User = {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  createdAt: number;
  patient: string;
  doctor: string;
};

export default function Dashboard() {
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
      `/admin/list/${Number(page)}/${Number(limit)}`,
      {
        params: { feild, word }, // make sure 'field' matches your backend
      }
    );

    setUsers(data.data);
  } catch (err) {
    console.error(err);
    alert("Failed to load users");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      <div className="flex gap-3 mb-4">
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
          <option value="">Field</option>
          <option value="fullName">Full Name</option>
          <option value="username">Username</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="role">Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
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

      {users.length > 0 ? (
        <div className="rounded-xl shadow-md border bg-white overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Username</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Full Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Phone Number</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Patient</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Doctor</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u._id}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 border-b">{u._id}</td>
                  <td className="px-4 py-3 border-b">{u.username}</td>
                  <td className="px-4 py-3 border-b">{u.fullName}</td>
                  <td className="px-4 py-3 border-b">{u.phoneNumber || "-"}</td>
                  <td className="px-4 py-3 border-b">{u.role}</td>
                  <td className="px-4 py-3 border-b">{u.patient}</td>
                  <td className="px-4 py-3 border-b">{u.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
