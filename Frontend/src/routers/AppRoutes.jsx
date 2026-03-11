import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import CompanyDashboard from "../pages/CompanyDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company-dashboard"
        element={
          <ProtectedRoute>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
