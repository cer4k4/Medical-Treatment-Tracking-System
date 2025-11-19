import React, { useEffect, useState } from 'react';
import API from '../api';

type Task = { id:number; title:string; description?:string; isChecked:boolean };

export default function UserDashboard(){
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = async () => {
    const { data } = await API.get('/tasks/me');
    setTasks(data.tasks);
  };

  useEffect(()=>{ load(); }, []);

  const toggle = async (id:number) => {
    try {
      await API.post(`/tasks/check/${id}`);
      setTasks(tasks.map(t => t.id===id ? { ...t, isChecked: true } : t));
    } catch { alert('Failed to check'); }
  };

  return (
    <div>
      <h2 className="text-xl mb-3">Your Tasks</h2>
      <div className="space-y-3">
        {tasks.map(t => (
          <div key={t.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-gray-500">{t.description}</div>
            </div>
            <input type="checkbox" checked={!!t.isChecked} onChange={()=>toggle(t.id)} />
          </div>
        ))}
      </div>
      <div className="mt-6"><a href="/guides" className="text-blue-600">Disease Guides</a></div>
    </div>
  );
}
