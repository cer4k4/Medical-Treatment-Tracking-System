import React, { useEffect, useState } from 'react';
import API from '../api';
import ReactMarkdown from 'react-markdown';

export default function Guides(){
  const [guides, setGuides] = useState<any[]>([]);
  useEffect(()=>{ (async ()=> {
    const { data } = await API.get('/guides');
    setGuides(data.guides || []);
  })() }, []);
  return (
    <div>
      <h2 className="text-xl mb-3">Disease Guides</h2>
      <div className="space-y-3">
        {guides.map(g => (
          <div key={g.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">{g.disease}</h3>
            <ReactMarkdown>{g.content}</ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}
