import React, { useState, useEffect } from "react";
import Dashboard from "../components/AdminDashboard";

const API_BASE = "http://localhost:3000";

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE}/projects`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-12"><p className="text-slate-400">Loading projects...</p></div>;
  }

  return <Dashboard projects={projects} />;
}

export default DashboardPage;
