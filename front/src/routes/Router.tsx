import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProfilePage from "../pages/ProfilePage";
import UpdatePage from "../pages/UpdatePage";
import CreateTask from "../pages/CreateTask";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import GetAllMyTasks from "../pages/GetMyTasksPage";
import GetMyTask from "../pages/GetTaskById";
import GetUsers from "../pages/UsersList";
import ChangeUserPage from "../pages/CreateDr";
import Dashboard from "../pages/Dashboard";

const AppRouter: React.FC = () => {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
        {/* Users routes */}
          <Route path="/getusers" element={<GetUsers />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/create/doctor/:userId" element={< ChangeUserPage/>} />
        {/* Task routes */}
          <Route path="/createtask" element={<CreateTask />} />
          <Route path="/getalltask" element={<GetAllMyTasks />} />
          <Route path="/gettask" element={<GetMyTask />} />
        </Route>

        {/* redirects */}
        <Route path="/" element={<Navigate to={token ? "/profile" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={token ? "/profile" : "/login"} replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
