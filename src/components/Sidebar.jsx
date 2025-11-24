// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

function Sidebar({ isCollapsed }) {
  const baseItem =
    "flex items-center px-2 py-2 rounded-lg cursor-pointer transition-colors";
  const activeStyle = "bg-slate-800 text-white";
  const inactiveStyle = "text-slate-200 hover:bg-slate-800";

  return (
    <aside
      className={`
        h-full p-4 flex flex-col space-y-3
        bg-slate-900 text-white
        ${isCollapsed ? "w-16" : "w-56"}
        transition-all duration-300
      `}
    >
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          `${baseItem} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <HomeIcon className="h-6 w-6" />
        {!isCollapsed && <span className="ml-3">Dashboard</span>}
      </NavLink>

      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `${baseItem} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <UsersIcon className="h-6 w-6" />
        {!isCollapsed && <span className="ml-3">Manage Users</span>}
      </NavLink>

      <NavLink
        to="/admin/teams"
        className={({ isActive }) =>
          `${baseItem} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <UserGroupIcon className="h-6 w-6" />
        {!isCollapsed && <span className="ml-3">Teams</span>}
      </NavLink>

      <NavLink
        to="/admin/settings"
        className={({ isActive }) =>
          `${baseItem} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        <Cog6ToothIcon className="h-6 w-6" />
        {!isCollapsed && <span className="ml-3">Settings</span>}
      </NavLink>
    </aside>
  );
}

export default Sidebar;
