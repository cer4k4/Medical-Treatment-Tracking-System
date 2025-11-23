import React, { useState } from "react";
import api from "../api/axios";
import Wrapper from "../components/Wrapper";
//import { useNavigate } from "react-router-dom";

type CreateTaskForm = {
    title?: string;
    description?: string;
    status?: string;
};

export default function CreateTask() {
  //const navigate = useNavigate();
  const [form, setForm] = useState<CreateTaskForm>();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      setLoading(true);
      const { data } = await api.post<{ message: string }>("/task/create", form);
      alert(data.message || "Create Task successful");
      //navigate("/login");
    } catch (err) {
      alert("Create Task failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper title="Create Task">
      <input className="input" name="title" placeholder="Title" onChange={handleChange} />
      <input className="input" name="description" placeholder="Description" onChange={handleChange} />
      <input className="input" name="status" placeholder="status" onChange={handleChange} />
      <button className="btn" onClick={submit} disabled={loading}>
        {loading ? "Loading..." : "Create"}
      </button>
    </Wrapper>
  );
}
