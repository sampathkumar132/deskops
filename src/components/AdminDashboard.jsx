import React, { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Card from "./ui/Card";
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  EllipsisVerticalIcon 
} from "@heroicons/react/24/outline";
import EditModal from "./EditModal";
import ConfirmModal from "./ConfirmModal";

function AdminDashboard({ projects: initialProjects = [] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // modal state
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const openEdit = (project) => {
    setSelectedProject(project);
    setEditOpen(true);
    setOpenMenuId(null);
  };

  const openDelete = (project) => {
    setSelectedProject(project);
    setDeleteOpen(true);
    setOpenMenuId(null);
  };

  const handleSave = (updatedProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    setEditOpen(false);
    setSelectedProject(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedProject) return;
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    setDeleteOpen(false);
    setSelectedProject(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Done": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In Progress": return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Paused": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Backlog": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects Overview</h1>
          <p className="text-slate-400 text-sm">Manage and track all ongoing projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10 pr-4 py-2 bg-dark-surface border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: projects.length, color: "text-white" },
          { label: "In Progress", value: projects.filter(p => p.status === "In Progress").length, color: "text-sky-400" },
          { label: "Completed", value: projects.filter(p => p.status === "Done").length, color: "text-emerald-400" },
          { label: "Delayed", value: projects.filter(p => p.status === "Backlog").length, color: "text-rose-400" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex flex-col">
            <span className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</span>
            <span className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</span>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-slate-400 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{project.name}</div>
                    <div className="text-xs text-slate-500">{project.url}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{project.about}</td>
                  <td className="px-6 py-4 text-slate-300">
                    <div className="flex items-center -space-x-2">
                      {[...Array(Math.min(3, project.members || 1))].map((_, i) => (
                        <div key={i} className="h-8 w-8 rounded-full bg-slate-700 border-2 border-dark-surface flex items-center justify-center text-xs text-white">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                      {(project.members > 3) && (
                        <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-dark-surface flex items-center justify-center text-xs text-slate-400">
                          +{project.members - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden w-24">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => toggleMenu(project.id)}
                    >
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>

                    {openMenuId === project.id && (
                      <div className="absolute right-8 top-8 w-32 bg-dark-surface border border-white/10 rounded-lg shadow-xl z-50 py-1 backdrop-blur-xl">
                        <button
                          className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white"
                          onClick={() => openEdit(project)}
                        >
                          Edit Project
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                          onClick={() => openDelete(project)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <EditModal
        open={editOpen}
        employee={selectedProject}
        onClose={() => {
          setEditOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSave}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete Project"
        message={selectedProject ? `Are you sure you want to delete "${selectedProject.name}"?` : "Are you sure?"}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => {
          setDeleteOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default AdminDashboard;
