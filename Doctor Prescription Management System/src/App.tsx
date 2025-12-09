import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { PatientDashboard } from "./components/PatientDashboard";
import { RegisterPage } from "./components/RegisterPage";

export type UserRole = "admin" | "doctor" | "patient" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  doctorId?: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Mock login logic
    if (email === "admin@clinic.com") {
      setCurrentUser({
        id: "1",
        name: "مدیر سیستم",
        email: "admin@clinic.com",
        role: "admin",
      });
    } else if (email === "doctor@clinic.com") {
      setCurrentUser({
        id: "2",
        name: "دکتر احمدی",
        email: "doctor@clinic.com",
        role: "doctor",
      });
    } else if (email === "patient@clinic.com") {
      setCurrentUser({
        id: "3",
        name: "علی محمدی",
        email: "patient@clinic.com",
        role: "patient",
        doctorId: "2",
      });
    }
  };

  const handleRegister = (data: any) => {
    setCurrentUser({
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: "patient",
      doctorId: data.doctorId,
    });
    setShowRegister(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
      {currentUser?.role === "patient" && (
        <PatientDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;