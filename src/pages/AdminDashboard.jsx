// src/pages/DashboardPage.jsx
import React from "react";
import Dashboard from "../components/AdminDashboard";
import projects from "../sampleData/projects.json";

function DashboardPage() {
  return <Dashboard projects={projects} />;
}

export default DashboardPage;
