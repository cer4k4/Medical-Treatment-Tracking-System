import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Wrapper from "../components/Wrapper";
import { useNavigate, Link } from "react-router-dom";

type Task = {
  _id?: string,
  status?: string,
  creator?: string,
  title?: string;
  description?: string;
  taskId?: string;
  __v?: number
  createdAt?: number,
  updatedAt?: number,
};


export default function GetMyTask() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  // 👇 state برای inputs
  const [id, setID] = useState<string>("");

  const load = async (id:string) => {
    try {
      setLoading(true);
      const { data } = await api.get<{ data: Task }>(`/task/byid/${id}`);
      setTask(data.data);
      console.log(data)
    } catch (err) {
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    //logout();
    // navigate("/login");
  };

  return (
    <Wrapper title="My Task">
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" name="id" placeholder="task_id" onChange={(e) => setID(e.target.value)} />
        <button className="btn" onClick={() => load(id)} disabled={loading}>{loading ? "Loading..." : "Loading My Task"}</button>
        {/* <Link to="/update" className="btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          Update
        </Link> */}
      </div>


      {task && (
        <div className="mt-4">
            <div key={task._id} className="p-3 border rounded-xl mb-3">
              <p><b>Title:</b> {task.title}</p>
              <p><b>Description:</b> {task.description}</p>
              <p><b>Status:</b> {task.status}</p>
              <p><b>Task ID:</b> {task._id}</p>
            </div>
        </div>
      )}

      {/* {tasks && ( */}
        {/* <div className="p-4 border rounded-xl mt-3"> */}
          {/* <p><b>Username:</b> {tasks}</p> */}
          {/* <p><b>Full Name:</b> {task.fullName}</p>
          <p><b>Full Name:</b> {task.fullName}</p>
          <p><b>Phone:</b> {task.phoneNumber}</p> */}
        {/* </div> */}
      {/* )} */}
      {/* <button className="btn mt-4 bg-red-600" onClick={handleLogout}>Logout</button> */}
    </Wrapper>
  );
}
