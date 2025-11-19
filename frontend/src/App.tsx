import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Guides from './pages/Guides';

const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export default function App(){
  const user = getUser();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-4xl mx-auto mb-6 flex justify-between">
        <div className="text-xl font-bold">HealthTrack+</div>
        <div>
          {user ? <span>Hello, {user.name}</span> : <></>}
        </div>
      </header>
      <main className="max-w-4xl mx-auto">
        <Routes>
          <Route path="/" element={user ? (user.role==='DOCTOR' ? <DoctorDashboard/> : user.role==='ADMIN' ? <AdminDashboard/> : <UserDashboard/>) : <Navigate to="/login" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/guides" element={<Guides/>} />
        </Routes>
      </main>
    </div>
  );
}
