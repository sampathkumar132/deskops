// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth Components
import Login from "./features/auth/Login";
import ProtectedRoute from "./features/auth/ProtectedRoute";

// Layout & Pages
import RootLayout from "./layout/RootLayout";
import Dashboard from "./pages/AdminDashboard";
import Users from "./pages/ManageUsers";
import UserDashboard from "./pages/UserDashboard";
import MyTasks from "./pages/MyTasks";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* ADMIN AREA */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<RootLayout role="admin" />}>
          {/* default: /admin → /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* /admin/dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* /admin/users */}
          <Route path="users" element={<Users />} />

          {/* /admin/teams */}
          <Route path="teams" element={<div>Teams Page</div>} />

          {/* /admin/settings */}
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Route>

      {/* USER AREA */}
      <Route element={<ProtectedRoute requiredRole="user" />}>
        <Route path="/user" element={<RootLayout role="user" />}>
          {/* default: /user → /user/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* /user/dashboard */}
          <Route path="dashboard" element={<UserDashboard />} />

          {/* /user/mytasks */}
          <Route path="mytasks" element={<MyTasks />} />

          {/* /user/projects */}
          <Route path="projects" element={<div>Projects Page</div>} />

          {/* /user/settings */}
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
