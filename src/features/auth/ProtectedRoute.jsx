import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ requiredRole }) {
  const storedRole = sessionStorage.getItem("role"); // "admin" or "user"

  if (!storedRole) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && storedRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
