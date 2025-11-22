// src/components/Sidebar.jsx
import React from "react";
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

function Sidebar({ isCollapsed }) {
  return (
    <aside
      style={{ color: "#ffffff" }} // ← force all text inside to white
      className={`
        h-full p-3 md:p-4 flex flex-col space-y-3
        bg-slate-900 border-r border-slate-800
        transition-all duration-300
        ${isCollapsed ? "w-16" : "w-56"}
      `}
    >
      {/* Dashboard */}
      <div className="flex items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-800">
        <HomeIcon className="h-6 w-6" color="#ffffff" /> {/* ← icon white */}
        {!isCollapsed && (
          <span className="ml-3 text-sm font-medium">Dashboard</span>
        )}
      </div>

      {/* Manage Users */}
      <div className="flex items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-800">
        <UsersIcon className="h-6 w-6" color="#ffffff" />
        {!isCollapsed && (
          <span className="ml-3 text-sm font-medium">Manage Users</span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-800">
        <UserGroupIcon className="h-6 w-6" color="#ffffff" />
        {!isCollapsed && (
          <span className="ml-3 text-sm font-medium">Teams</span>
        )}
      </div>

      {/* Settings */}
      <div className="flex items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-800">
        <Cog6ToothIcon className="h-6 w-6" color="#ffffff" />
        {!isCollapsed && (
          <span className="ml-3 text-sm font-medium">Settings</span>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
