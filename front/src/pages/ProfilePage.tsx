import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Wrapper from "../components/Wrapper";
import { useNavigate, Link } from "react-router-dom";

type User = {
  id?: string;
  username: string;
  fullName?: string;
  phoneNumber?: string;
};

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<{ data: User }>("/users/byId");
      setUser(data.data);
    } catch (err) {
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Wrapper title="Profile">
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={load} disabled={loading}>{loading ? "Loading..." : "Load Profile"}</button>
        <Link to="/update" className="btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          Update
        </Link>
      </div>

      {user && (
        <div className="p-4 border rounded-xl mt-3">
          <p><b>Username:</b> {user.username}</p>
          <p><b>Full Name:</b> {user.fullName}</p>
          <p><b>Phone:</b> {user.phoneNumber}</p>
        </div>
      )}

      <button className="btn mt-4 bg-red-600" onClick={handleLogout}>Logout</button>
    </Wrapper>
  );
}
