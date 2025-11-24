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
// Mock data
import projects from "./sampleData/projects.json";
import usersData from "./sampleData/users.json";

function App() {
  return (
    <Routes>
      {/* LOGIN FIRST */}
      <Route path="/" element={<Login />} />

      {/* ADMIN LAYOUT (Navbar + Sidebar stays fixed) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <RootLayout />
          </ProtectedRoute>
        }
      >
        {/* DEFAULT PAGE → /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard" element={<Dashboard projects={projects} />} />
        <Route path="users" element={<Users usersData={usersData} />} />
        <Route path="teams" element={<div>Teams Page</div>} />
        <Route path="settings" element={<div>Settings Page</div>} />
      </Route>

      {/* USER PAGE */}
      <Route
        path="/user"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
