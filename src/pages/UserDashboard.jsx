import React from "react";
import projects from "../sampleData/projects.json"; 

function UserDashboard() {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "In Progress"
  ).length;
  const pendingProjects = projects.filter(
    (p) => p.status !== "Done"
  ).length;

  const getStatusBadgeClass = (status) => {
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

  const activeProjectList = projects.filter(
    (p) => p.status === "In Progress" || p.status === "Paused"
  );

  return (
    // tighten vertical spacing a bit
    <div className="space-y-4">
      {/* Header (no Create button) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            My Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Snapshot of your current projects.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
            Total
          </p>
          <p className="text-xs text-slate-500 mb-1">Projects</p>
          <p className="text-xl font-semibold text-slate-900">
            {totalProjects}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
            Active
          </p>
          <p className="text-xs text-slate-500 mb-1">In Progress</p>
          <p className="text-xl font-semibold text-slate-900">
            {activeProjects}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
            Pending
          </p>
          <p className="text-xs text-slate-500 mb-1">Not Completed</p>
          <p className="text-xl font-semibold text-slate-900">
            {pendingProjects}
          </p>
        </div>
      </div>

      {/* Active projects section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900">
            Active Projects
          </h2>
          <span className="text-[11px] text-slate-500">
            {activeProjectList.length} active / paused
          </span>
        </div>

        {activeProjectList.length === 0 ? (
          <p className="text-sm text-slate-500">
            No active projects right now.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {activeProjectList.map((project) => (
              <div
                key={project.id}
                className="border border-slate-200 rounded-md p-3 flex flex-col justify-between"
              >
                {/* Top: name + badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {project.url}
                    </p>
                  </div>
                  <span
                    className={
                      "text-[10px] px-2 py-0.5 rounded-full font-medium " +
                      getStatusBadgeClass(project.status)
                    }
                  >
                    {project.status}
                  </span>
                </div>

                {/* About */}
                <p className="mt-2 text-xs text-slate-600">
                  {project.about}
                </p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-500">
                      Progress
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Members / team line */}
                <div className="mt-2 text-[11px] text-slate-500">
                  Team: {project.members} member
                  {project.members !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
