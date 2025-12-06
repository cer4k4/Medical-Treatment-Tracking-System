import React, { useState } from "react";
import api from "../api/axios";
import Wrapper from "../components/Wrapper";
import { useNavigate } from "react-router-dom";

type SignupForm = {
  username: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  patient: string;
  doctor: string;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>({ username: "", fullName: "", phoneNumber: "", password: "" ,patient: "",doctor:""});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      setLoading(true);
      const { data } = await api.post<{ message: string }>("/users/create", form);
      alert(data.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper title="Signup">
      <input className="input" name="username" placeholder="Username" onChange={handleChange} />
      <input className="input" name="fullName" placeholder="Full Name" onChange={handleChange} />
      <input className="input" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
      <input className="input" type="password" name="password" placeholder="Password" onChange={handleChange} />
      <input className="input" type="patient" name="patient" placeholder="Patient" onChange={handleChange} />
      <input className="input" type="doctor" name="doctor" placeholder="Doctor" onChange={handleChange} />
      <button className="btn" onClick={submit} disabled={loading}>
        {loading ? "Loading..." : "Signup"}
      </button>
    </Wrapper>
  );
}
