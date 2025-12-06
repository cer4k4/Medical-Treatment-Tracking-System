import  { useState } from "react";
import api from "../api/axios";
//import { useAuth } from "../context/AuthContext";
import Wrapper from "../components/Wrapper";
//import { useNavigate,  } from "react-router-dom";

type Task = {
  _id?: string,
  status?: string,
  creator?: string,
  createdAt?: number,
  updatedAt?: number,
  title?: string;
  description?: string;
  taskId?: string;
  __v?: number
};

type GetMyAllTask = Task[];

export default function GetAllMyTasks() {
  // const { logout } = useAuth();
  // const navigate = useNavigate();
  const [tasks, setUser] = useState<GetMyAllTask | null>(null);
  const [loading, setLoading] = useState(false);

  // 👇 state برای inputs
  const [page, setPage] = useState<string>("");
  const [limit, setLimit] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("");

  const load = async (page: number, limit: number,doctor: string) => {
    try {
      setLoading(true);
      const { data } = await api.get<{ data: GetMyAllTask }>(
        `/task/my/${page}/${limit}/${doctor}`
      );
      setUser(data.data);
    } catch (err) {
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };


  //const handleLogout = () => {
    //logout();
    // navigate("/login");
  //};


  const toggleStatus = async (id: string) => {
  try {
    await api.patch(`/task/status/${id}`);

    // UI را آپدیت کن
    setUser((prev) =>
      prev
        ? prev.map((t) =>
            t._id === id
              ? { ...t, status: t.status === "open" ? "done" : "open" }
              : t
          )
        : prev
    );
  } catch (err) {
    alert("Failed to update task");
  }
};


  return (
    <Wrapper title="List Of My Tasks">
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" name="page" placeholder="page" onChange={(e) => setPage(e.target.value)} />
        <input className="input" name="limit" placeholder="limit" onChange={(e) => setLimit(e.target.value)} />
        <input className="input" name="doctor" placeholder="doctorID" onChange={(e) => setDoctor(e.target.value)} />
        <button className="btn" onClick={() => load(Number(page), Number(limit),String(doctor))} disabled={loading}>{loading ? "Loading..." : "Load Tasks"}</button>
        {/* <Link to="/update" className="btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          Update
        </Link> */}
      </div>
        {tasks && (
          <div className="mt-4">
            {tasks.map((task) => (
              <div key={task._id} className="p-3 border rounded-xl mb-3 flex justify-between">

                <div>
                  <p><b>Title:</b> {task.title}</p>
                  <p><b>Status:</b> {task.status}</p>
                </div>
            
                <div className="flex items-center gap-2">
                  <label>Done</label>
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={() => toggleStatus(task._id!)}
                  />
                </div>
            
              </div>
            ))}
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
