import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Wrapper from "../components/Wrapper";

type Task = {
  _id?: string;
  status?: string;
  creator?: string;
  createdAt?: number;
  updatedAt?: number;
  title?: string;
  description?: string;
  taskId?: string;
  __v?: number;
};

type GetMyAllTask = Task[];

export default function GetAllMyTasks() {
  const [tasks, setTasks] = useState<GetMyAllTask | null>(null);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const defaultPage = Number(searchParams.get("page")) || 1;
  const defaultLimit = Number(searchParams.get("limit")) || 10;

  const [page, setPage] = useState<string>(String(defaultPage));
  const [limit, setLimit] = useState<string>(String(defaultLimit));

  const load = async (p: number, l: number) => {
    try {
      setLoading(true);
      const { data } = await api.get<{ data: GetMyAllTask }>(`/task/my/${p}/${l}`);
      setTasks(data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // AUTO load on mount (and when query params change)
  useEffect(() => {
    load(defaultPage, defaultLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultPage, defaultLimit]);

  return (
    <Wrapper title="List Of My Tasks">
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" name="page" placeholder="page" onChange={(e) => setPage(e.target.value)} defaultValue={String(defaultPage)} />
        <input className="input" name="limit" placeholder="limit" onChange={(e) => setLimit(e.target.value)} defaultValue={String(defaultLimit)} />
        <button className="btn" onClick={() => load(Number(page), Number(limit))} disabled={loading}>
          {loading ? "Loading..." : "Load Tasks"}
        </button>
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
                  onChange={async () => {
                    try {
                      await api.patch(`/task/status/${task._id}`);
                      setTasks((prev) =>
                        prev ? prev.map((t) => (t._id === task._id ? { ...t, status: t.status === "open" ? "done" : "open" } : t)) : prev
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
    </Wrapper>
  );
}
