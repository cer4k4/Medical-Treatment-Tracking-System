import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { PatientDashboard } from "./components/PatientDashboard";
import { RegisterPage } from "./components/RegisterPage";

export type UserRole = "admin" | "doctor" | "user" | null;

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  doctorId?: string;
}

function App() {
const [currentUser, setCurrentUser] = useState<User | null>(() => {
  const savedUser = localStorage.getItem("currentUser");
  return savedUser ? JSON.parse(savedUser) : null;
});
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (username: string,fullname: string, password: string,role: string) => {
    
    // Mock login logic
    if (role === "admin") {
      setCurrentUser({
        id: "1",
        name: fullname,
        role: role,
      });
    } else if (role === "doctor") {
      setCurrentUser({
        id: "2",
        name: fullname,
        role: role,
      });
    } else if (role === "user") {
      setCurrentUser({
        id: "3",
        name: fullname,
        role: role,
      });
    }
  };
  localStorage.setItem('currentUser',JSON.stringify(currentUser));
  const handleRegister = (data: any) => {
    setCurrentUser({
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      doctorId: data.doctorId,
    });
    setShowRegister(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.setItem('currentUser',"")
    setShowRegister(false);
  };
  

  if (!currentUser && !showRegister) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  if (showRegister) {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {currentUser?.role === "admin" && (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
      {currentUser?.role === "doctor" && (
        <DoctorDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
      {currentUser?.role === "user" && (
        <PatientDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;