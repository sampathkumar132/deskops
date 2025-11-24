// src/pages/MyTasks.jsx
import React, { useState, useMemo } from "react";
import projects from "../sampleData/projects.json";
import projectTasks from "../sampleData/subTasks.json";

const json = localStorage.getItem("auth");
const authData = json ? JSON.parse(json) : null;
const CURRENT_USER = authData ? authData.username : null; // or take from auth/localStorage

function statusChipClass(status) {
  switch (status) {
    case "WAITING FOR SUPPORT":
    case "WAITING FOR RESPONSE":
      return "bg-slate-100 text-slate-800";
    case "AWAITING APPROVAL":
      return "bg-sky-100 text-sky-700";
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700";
    case "CLOSED":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function priorityClass(priority) {
  switch (priority) {
    case "High":
      return "text-rose-600";
    case "Medium":
      return "text-amber-500";
    case "Low":
      return "text-slate-500";
    default:
      return "text-slate-500";
  }
}

function MyTasks() {
  const [selectedTask, setSelectedTask] = useState(null);

  // list view state
  const [sortConfig, setSortConfig] = useState({
    key: "key",
    direction: "asc",
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // details view tab
  const [activeTab, setActiveTab] = useState("details");

  const currentUser = useMemo(
    () => localStorage.getItem("username") || CURRENT_USER,
    []
  );

  const projectById = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // tasks for current user
  const myTasks = useMemo(
    () => projectTasks.filter((t) => t.assignee === currentUser),
    [currentUser]
  );

  // options for filters (from data)
  const statusOptions = useMemo(
    () => ["All", ...Array.from(new Set(myTasks.map((t) => t.status)))],
    [myTasks]
  );
  const projectOptions = useMemo(() => {
    const projectIds = Array.from(new Set(myTasks.map((t) => t.projectId)));
    const names = projectIds
      .map((id) => projectById.get(id))
      .filter(Boolean)
      .map((p) => p.name);
    return ["All", ...names];
  }, [myTasks, projectById]);
  const priorityOptions = useMemo(
    () => ["All", ...Array.from(new Set(myTasks.map((t) => t.priority)))],
    [myTasks]
  );

  // apply filters + sorting
  const processedTasks = useMemo(() => {
    let results = [...myTasks];

    // filter
    results = results.filter((t) => {
      const project = projectById.get(t.projectId);
      const matchesStatus =
        statusFilter === "All" || t.status === statusFilter;
      const matchesProject =
        projectFilter === "All" ||
        (project && project.name === projectFilter);
      const matchesPriority =
        priorityFilter === "All" || t.priority === priorityFilter;
      return matchesStatus && matchesProject && matchesPriority;
    });

    // sort
    results.sort((a, b) => {
      const { key, direction } = sortConfig;

      const projectA = projectById.get(a.projectId);
      const projectB = projectById.get(b.projectId);

      const getValue = (task) => {
        switch (key) {
          case "key":
            return task.key;
          case "title":
            return task.title;
          case "project":
            return projectById.get(task.projectId)?.name || "";
          case "status":
            return task.status;
          case "firstResponse":
            return task.firstResponse;
          default:
            return "";
        }
      };

      const valA = getValue(a);
      const valB = getValue(b);

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return results;
  }, [
    myTasks,
    projectById,
    statusFilter,
    projectFilter,
    priorityFilter,
    sortConfig,
  ]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  // ========= LIST VIEW =========
  if (!selectedTask) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              My Tasks
            </h1>
            <p className="text-xs text-slate-500">
              Tasks assigned to you across all projects.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Logged in as{" "}
            <span className="font-medium text-slate-700">
              {currentUser}
            </span>
          </span>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Status:</span>
            <select
              className="border border-slate-200 rounded-md px-2 py-1 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Project:</span>
            <select
              className="border border-slate-200 rounded-md px-2 py-1 bg-white"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              {projectOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Priority:</span>
            <select
              className="border border-slate-200 rounded-md px-2 py-1 bg-white"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            className="ml-auto text-[11px] text-slate-500 underline"
            onClick={() => {
              setStatusFilter("All");
              setProjectFilter("All");
              setPriorityFilter("All");
            }}
          >
            Clear filters
          </button>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 text-xs">
              <tr>
                <th
                  className="px-3 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("key")}
                >
                  Key {sortIndicator("key")}
                </th>
                <th
                  className="px-3 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("title")}
                >
                  Title {sortIndicator("title")}
                </th>
                <th
                  className="px-3 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("project")}
                >
                  Project {sortIndicator("project")}
                </th>
                <th className="px-3 py-2">Reporter</th>
                <th className="px-3 py-2">Assignee</th>
                <th
                  className="px-3 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  Status {sortIndicator("status")}
                </th>
                <th
                  className="px-3 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("firstResponse")}
                >
                  First response {sortIndicator("firstResponse")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedTasks.map((task) => {
                const project = projectById.get(task.projectId);
                return (
                  <tr
                    key={task.id}
                    className="bg-white hover:bg-slate-50 cursor-pointer"
                    onClick={() => {
                      setSelectedTask(task);
                      setActiveTab("details");
                    }}
                  >
                    <td className="px-3 py-2 text-slate-500">
                      {task.key}
                    </td>
                    <td className="px-3 py-2 text-slate-900">
                      {task.title}
                    </td>
                    <td className="px-3 py-2 text-slate-700 text-xs">
                      {project ? project.name : "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-700 text-sm">
                      {task.reporter}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-700">
                          {task.assignee[0]}
                        </div>
                        <span className="text-sm text-slate-700">
                          {task.assignee}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          "inline-flex px-2 py-0.5 rounded text-[11px] font-medium " +
                          statusChipClass(task.status)
                        }
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {task.firstResponse}
                    </td>
                  </tr>
                );
              })}

              {processedTasks.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-slate-500 text-sm"
                  >
                    No tasks match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ========= DETAILS VIEW =========
  const task = selectedTask;
  const project = projectById.get(task.projectId);

  return (
    <div className="grid md:grid-cols-[2fr,1fr] gap-4">
      {/* LEFT: description + tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-1 flex flex-col">
        <button
          onClick={() => setSelectedTask(null)}
          className="text-xs text-slate-500 hover:text-slate-700 mb-3"
        >
          ← Back to list
        </button>

        {/* Title + meta */}
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-1">
            {task.key} · {project ? project.name : "Unknown project"}
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            {task.title}
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-2">
          {["details", "comments", "history", "worklog"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-3 py-2 border-b-2 -mb-px capitalize ${
                activeTab === tab
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "worklog" ? "Work log" : tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1">
          {activeTab === "details" && (
            <>
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-800 mb-1">
                  Description
                </h2>
                <p className="text-sm text-slate-700 whitespace-pre-line">
                  {task.description}
                </p>
              </div>

              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-800 mb-1">
                  Environment
                </h2>
                <p className="text-sm text-slate-700">
                  {task.environment || "None"}
                </p>
              </div>
            </>
          )}

          {activeTab === "comments" && (
            <p className="text-sm text-slate-500">
              Comments UI can go here.
            </p>
          )}

          {activeTab === "history" && (
            <p className="text-sm text-slate-500">
              History / status changes can go here.
            </p>
          )}

          {activeTab === "worklog" && (
            <p className="text-sm text-slate-500">
              Work log entries can go here.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: side details panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
            Status
          </h3>
          <span
            className={
              "inline-flex px-2 py-1 rounded text-[11px] font-medium " +
              statusChipClass(task.status)
            }
          >
            {task.status}
          </span>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
            Assignee
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm text-slate-700">
              {task.assignee[0]}
            </div>
            <span className="text-sm text-slate-800">{task.assignee}</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
            Reporter
          </h3>
          <p className="text-sm text-slate-800">{task.reporter}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
            Priority
          </h3>
          <p className={"text-sm font-medium " + priorityClass(task.priority)}>
            {task.priority}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
            First response
          </h3>
          <p className="text-sm text-slate-800">{task.firstResponse}</p>
        </div>
      </div>
    </div>
  );
}

export default MyTasks;
