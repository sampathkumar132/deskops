import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const auth = JSON.parse(localStorage.getItem("auth"));

  // Not logged in → go to Login
  if (!auth) return <Navigate to="/" />;

  // Logged in but role doesn't match
  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}
