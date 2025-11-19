import React, { useEffect, useState } from 'react';
import API from '../api';

export default function DoctorDashboard(){
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ (async ()=> {
    const { data } = await API.get('/tasks/not-checked-today');
    setRows(data.rows || []);
  })() }, []);
  return (
    <div>
      <h2 className="text-xl mb-3">Patients not checked today</h2>
      <div className="bg-white p-3 rounded shadow">
        {rows.length===0 ? <div>All good — everyone checked</div> : rows.map(r => (
          <div key={r.task_id} className="flex justify-between border-b py-2">
            <div>
              <div className="font-semibold">{r.userName ?? r.user_name}</div>
              <div className="text-sm">{r.title}</div>
            </div>
            <div>{r.isChecked ? '✅' : '❌'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
