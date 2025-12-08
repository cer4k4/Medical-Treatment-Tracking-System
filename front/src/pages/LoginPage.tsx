import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Wrapper from "../components/Wrapper";

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      setLoading(true);

      const res = await api.post<{ data: { token: string; role: string } }>(
        "/users/login",
        form
      );

      // Save JWT token
      login(res.data.data.token);

      const role = res.data.data.role;

      // Redirect based on role
      if (role === "admin" || role === "doctor") {
        navigate("/dashboard");
      } else if (role === "user") {
        navigate("/profile");
      }

    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper title="Login">
      <input
        className="input"
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />

      <input
        className="input"
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button className="btn" onClick={submit} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>

      <p style={{ marginTop: 10, textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "blue" }}>
          Signup
        </Link>
      </p>
    </Wrapper>
  );
}
