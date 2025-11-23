import React, { useState } from "react";
import api from "../api/axios";

type User = {
  _id: string;
  username: string;
  fullName: string;
  role:string;
  phoneNumber?:string;
  password?: string;
  createdAt:number;
  updatedAt:number;
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

        <input
          className="input"
          placeholder="Search Field (e.g. username)"
          value={feild}
          onChange={(e) => setField(e.target.value)}
        />

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
          <div>
            {users.map((u) => (
              <div key={u._id} className="p-3 border mb-2">
                <p><b>id:</b> {u._id}</p>
                <p><b>Username:</b> {u.username}</p>
                <p><b>Full Name:</b> {u.fullName}</p>
                <p><b>Phone Number:</b> {u.phoneNumber}</p>
                <p><b>Role:</b> {u.role}</p>
                <br></br>
                <br></br>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
