import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import { useSearch } from "../context/SearchContext";

const API_BASE = "http://localhost:3000";

function UserDashboard() {
  const { searchQuery } = useSearch();
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

  // Filter projects based on global search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProjects = filteredProjects.length;
  const activeProjectsCount = filteredProjects.filter(p => p.status === "In Progress").length;
  const pendingProjectsCount = filteredProjects.filter(p => p.status !== "Done").length;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Done": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In Progress": return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Paused": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Backlog": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const activeProjectList = filteredProjects.filter(
    (p) => p.status === "In Progress" || p.status === "Paused"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back, here's what's happening today.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Loading projects...</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-white">{totalProjects}</p>
        </Card>

        <Card className="p-5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-sky-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Active Now</p>
          <p className="text-3xl font-bold text-sky-400">{activeProjectsCount}</p>
        </Card>

        <Card className="p-5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Pending</p>
          <p className="text-3xl font-bold text-rose-400">{pendingProjectsCount}</p>
        </Card>
      </div>

      {/* Active Projects */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
        
        {activeProjectList.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <p className="text-slate-500">No active projects found matching "{searchQuery}".</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeProjectList.map((project) => (
              <Card key={project.id} className="p-5 hover:border-primary-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">{project.name}</h3>
                    <p className="text-xs text-slate-500">{project.url}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.about}</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  
                  <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, project.members || 1))].map((_, i) => (
                        <div key={i} className="h-6 w-6 rounded-full bg-slate-700 border border-dark-surface flex items-center justify-center text-[10px] text-white">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">{project.members} members</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

export default UserDashboard;
