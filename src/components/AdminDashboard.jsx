// src/components/AdminDashboard.jsx
import React, { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import EditModal from "./EditModal";
import ConfirmModal from "./ConfirmModal";

function AdminDashboard({ projects: initialProjects = [] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [openMenuId, setOpenMenuId] = useState(null);

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
    // update in state (match by id)
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
      case "Done":
        return "bg-emerald-50 text-emerald-700";
      case "In Progress":
        return "bg-sky-50 text-sky-700";
      case "Paused":
        return "bg-amber-50 text-amber-700";
      case "Backlog":
        return "bg-rose-50 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 md:p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">All Projects</h2>
      <p className="text-xs text-slate-500 mb-4">Overview of your current projects</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-left text-slate-500 text-xs">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">About</th>
              <th className="py-2 pr-4">Members</th>
              <th className="py-2 pr-4">Progress</th>
              <th className="py-2 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b last:border-b-0 border-slate-100 hover:bg-slate-50"
              >
                <td className="py-3 pr-4">
                  <div className="font-medium text-slate-900">{project.name}</div>
                  <div className="text-xs text-slate-500">{project.url}</div>
                </td>

                <td className="py-3 pr-4">
                  <span
                    className={
                      "inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium " +
                      getStatusClass(project.status)
                    }
                  >
                    {project.status}
                  </span>
                </td>

                <td className="py-3 pr-4 text-slate-700">{project.about}</td>

                <td className="py-3 pr-4 text-slate-700">{project.members} members</td>

                <td className="py-3 pr-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-600">{project.progress}%</span>
                  </div>
                </td>

                <td className="py-3 text-right relative">
                  <button
                    className="p-1 rounded-lg hover:bg-slate-100"
                    onClick={() => toggleMenu(project.id)}
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
                  </button>

                  {openMenuId === project.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border border-slate-200 rounded-lg shadow-md text-xs z-10">
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700"
                        onClick={() => openEdit(project)}
                      >
                        Update
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-rose-600"
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

      {/* Modals */}
      <EditModal
        open={editOpen}
        employee={selectedProject}   // NOTE: EditModal expects a prop name 'employee' if you haven't changed it
        onClose={() => {
          setEditOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSave}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete project"
        message={
          selectedProject
            ? `Are you sure you want to delete "${selectedProject.name}" (ID: ${selectedProject.id})? This cannot be undone.`
            : "Are you sure?"
        }
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
