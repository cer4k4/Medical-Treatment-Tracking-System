import React, { useEffect, useState } from "react";
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

type Task = {
  _id?: string;
  status?: string;
  title?: string;
  description?: string;
};

type GetMyAllTask = Task[];

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // -------------------------
  // Profile state
  // -------------------------
  const [user, setUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // -------------------------
  // Tasks state
  // -------------------------
  const [tasks, setTasks] = useState<GetMyAllTask | null>(null);
  const [taskLoading, setTaskLoading] = useState(false);

  // Pagination defaults
  const defaultPage = 1;
  const defaultLimit = 10;

  // -------------------------
  // Load Profile
  // -------------------------
  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const { data } = await api.get<{ data: User }>("/users/byId");
      setUser(data.data);
    } catch (err) {
      alert("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // -------------------------
  // Load Tasks
  // -------------------------
  const loadTasks = async (page: number, limit: number) => {
    try {
      setTaskLoading(true);
      const { data } = await api.get<{ data: GetMyAllTask }>(
        `/task/my/${page}/${limit}`
      );
      setTasks(data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load tasks");
    } finally {
      setTaskLoading(false);
    }
  };

  // Auto load profile + tasks on mount
  useEffect(() => {
    loadProfile();
    loadTasks(defaultPage, defaultLimit);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Wrapper title="Profile">
      {/* Profile Section */}
      <div className="p-4 border rounded-xl mt-3">
        {profileLoading ? (
          <p>Loading profile...</p>
        ) : user ? (
          <>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Full Name:</b> {user.fullName}</p>
            <p><b>Phone:</b> {user.phoneNumber}</p>

            <Link
              to="/update"
              className="btn mt-3"
              style={{ textDecoration: "none" }}
            >
              Update Info
            </Link>
          </>
        ) : (
          <p>No profile data</p>
        )}
      </div>

      {/* Divider */}
      <hr className="my-4" />

      {/* Tasks Section */}
      <h2 className="text-lg font-bold mb-2">My Tasks</h2>

      {taskLoading && <p>Loading tasks...</p>}

      {tasks && (
        <div className="mt-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-3 border rounded-xl mb-3 flex justify-between"
            >
              <div>
                <p><b>Title:</b> {task.title}</p>
                <p><b>Status:</b> {task.status}</p>
              </div>

              <div className="flex items-center gap-2">
                <label>Done</label>
                <input
                  type="checkbox"
                  checked={task.status === "done"}
                  onChange={async () => {
                    try {
                      await api.patch(`/task/status/${task._id}`);

                      setTasks((prev) =>
                        prev
                          ? prev.map((t) =>
                              t._id === task._id
                                ? {
                                    ...t,
                                    status: t.status === "open" ? "done" : "open",
                                  }
                                : t
                            )
                          : prev
                      );
                    } catch {
                      alert("Failed to update task");
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn mt-4 bg-red-600" onClick={handleLogout}>
        Logout
      </button>
    </Wrapper>
  );
}
