import React, { useState } from "react";
import api from "../api/axios";
import Wrapper from "../components/Wrapper";
import { useNavigate,useParams } from "react-router-dom";

type UpdateUserForm = {
  role?: string;
  username?: string;
  fullName?: string;
  newPassword?: string;  
};

export default function ChangeUserPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<UpdateUserForm>();
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      setLoading(true);
      const { data } = await api.put<{ message: string }>(`/admin/update/${userId}`, form);
      alert(data.message || "Chnage User successful");
      navigate("/getusers");
    } catch (err) {
      alert("Chnage User failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper title="Change User">
      <input className="input" name="username" placeholder="Username" onChange={handleChange} />
      <input className="input" name="fullName" placeholder="Full Name" onChange={handleChange} />
      <input className="input" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
      <input className="input" name="role" placeholder="Role Name" onChange={handleChange} />
      <input className="input" type="newPassword" name="newPassword" placeholder="Password" onChange={handleChange} />
      <button className="btn" onClick={submit} disabled={loading}>
        {loading ? "Loading..." : "Change User"}
      </button>
    </Wrapper>
  );
}
