import React, { useState } from "react";
import api from "../api/axios";
import Wrapper from "../components/Wrapper";
import { useNavigate } from "react-router-dom";

type UpdateForm = {
  username?: string;
  fullName?: string;
  phoneNumber?: string;
};

export default function UpdatePage() {
  const [form, setForm] = useState<UpdateForm>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      setLoading(true);
      const { data } = await api.patch<{ message: string }>("/users/update", form);
      alert(data.message || "Updated");
      navigate("/profile");
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper title="Update Profile">
      <input className="input" name="username" placeholder="New Username" onChange={handleChange} />
      <input className="input" name="fullName" placeholder="New Full Name" onChange={handleChange} />
      <input className="input" type="phoneNumber" name="phoneNumber" placeholder="New Phone Number" onChange={handleChange} />
      <button className="btn" onClick={submit} disabled={loading}>{loading ? "Ok..." : "Update"}</button>
    </Wrapper>
  );
}
