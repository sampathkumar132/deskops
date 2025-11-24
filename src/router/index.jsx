import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import ProtectedRoute from "../features/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // Login ALWAYS loads first
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute requiredRole="user">
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
]);
