import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * استفاده:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/profile" element={<ProfilePage />} />
 * </Route>
 */
const ProtectedRoute: React.FC = () => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
