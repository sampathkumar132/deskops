import React, { useState, useEffect, useMemo } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DragDropFile from "../components/DragDropFile";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getAuth } from "../features/auth/auth";

const API_BASE = "http://localhost:3000";

function statusChipClass(status) {
  switch (status) {
    case "WAITING FOR SUPPORT":
    case "WAITING FOR RESPONSE":
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    case "AWAITING APPROVAL":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "APPROVED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "CLOSED":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

function priorityClass(priority) {
  switch (priority) {
    case "High": return "text-rose-400";
    case "Medium": return "text-amber-400";
    case "Low": return "text-slate-400";
    default: return "text-slate-400";
  }
}

function MyTasks() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "key", direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("details");
  
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUser = auth?.username ?? "Guest";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/subTasks`)
        ]);
        
        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();
        
        setProjects(projectsData);
        setProjectTasks(tasksData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const projectById = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [projects]);

  const myTasks = useMemo(
    () => projectTasks.filter((t) => String(t.assignee) === String(currentUser)),
    [projectTasks, currentUser]
  );

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

  const processedTasks = useMemo(() => {
    let results = [...myTasks];

    results = results.filter((t) => {
      const project = projectById.get(t.projectId);
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesProject = projectFilter === "All" || (project && project.name === projectFilter);
      const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
      return matchesStatus && matchesProject && matchesPriority;
    });

    results.sort((a, b) => {
      const { key, direction } = sortConfig;
      const getValue = (task) => {
        switch (key) {
          case "key": return task.key ?? "";
          case "title": return task.title ?? "";
          case "project": return projectById.get(task.projectId)?.name ?? "";
          case "status": return task.status ?? "";
          case "firstResponse": return task.firstResponse ?? "";
          default: return "";
        }
      };

      const valA = getValue(a);
      const valB = getValue(b);

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return results;
  }, [myTasks, projectById, statusFilter, projectFilter, priorityFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Loading tasks...</p>
      </div>
    );
  }

  if (!selectedTask) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          <p className="text-slate-400 text-sm">Tasks assigned to you across all projects</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <select
              className="bg-dark-surface border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Project:</span>
            <select
              className="bg-dark-surface border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-500"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              {projectOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Priority:</span>
            <select
              className="bg-dark-surface border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {priorityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <button
            className="ml-auto text-xs text-primary-400 hover:text-primary-300 underline"
            onClick={() => {
              setStatusFilter("All");
              setProjectFilter("All");
              setPriorityFilter("All");
            }}
          >
            Clear filters
          </button>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-slate-400 uppercase text-xs font-medium">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort("key")}>Key {sortIndicator("key")}</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort("title")}>Title {sortIndicator("title")}</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort("project")}>Project {sortIndicator("project")}</th>
                  <th className="px-6 py-4">Reporter</th>
                  <th className="px-6 py-4">Assignee</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort("status")}>Status {sortIndicator("status")}</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort("firstResponse")}>First Response {sortIndicator("firstResponse")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {processedTasks.map((task) => {
                  const project = projectById.get(task.projectId);
                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedTask(task);
                        setActiveTab("details");
                      }}
                    >
                      <td className="px-6 py-4 text-slate-400">{task.key}</td>
                      <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{project ? project.name : "—"}</td>
                      <td className="px-6 py-4 text-slate-400">{task.reporter}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                            {String(task.assignee)[0]}
                          </div>
                          <span className="text-slate-300">{task.assignee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${statusChipClass(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{task.firstResponse}</td>
                    </tr>
                  );
                })}
                {processedTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No tasks match the current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  const task = selectedTask;
  const project = projectById.get(task.projectId);

  return (
    <div className="grid md:grid-cols-[2fr,1fr] gap-6">
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)} className="pl-0 hover:bg-transparent text-slate-400 hover:text-white">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to list
        </Button>

        <Card>
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2">
              {task.key} · {project ? project.name : "Unknown project"}
            </p>
            <h1 className="text-2xl font-bold text-white">{task.title}</h1>
          </div>

          <div className="flex border-b border-white/10 mb-6">
            {["details", "comments", "history", "worklog"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary-500 text-primary-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab === "worklog" ? "Work log" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-white mb-2">Description</h2>
                  <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                    {task.description}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white mb-2">Environment</h2>
                  <p className="text-sm text-slate-300 bg-dark-surface p-3 rounded-lg border border-white/5">
                    {task.environment || "None"}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-4">
                <textarea
                  className="w-full bg-dark-surface border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  rows="3"
                  placeholder="Add a comment..."
                ></textarea>
                
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-2">Attach files</h3>
                  <DragDropFile onFilesSelected={(files) => console.log("Files attached:", files)} />
                </div>

                <div className="flex justify-end">
                  <Button size="sm">Post Comment</Button>
                </div>
              </div>
            )}

            {(activeTab === "history" || activeTab === "worklog") && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No entries found.
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="h-10 md:block hidden" /> {/* Spacer for alignment */}
        <Card className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Status</h3>
            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${statusChipClass(task.status)}`}>
              {task.status}
            </span>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Assignee</h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm text-white">
                {task.assignee[0]}
              </div>
              <span className="text-sm text-slate-200">{task.assignee}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Reporter</h3>
            <p className="text-sm text-slate-200">{task.reporter}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Priority</h3>
            <p className={`text-sm font-medium ${priorityClass(task.priority)}`}>
              {task.priority}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">First Response</h3>
            <p className="text-sm text-slate-200">{task.firstResponse}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MyTasks;
