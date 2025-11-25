// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import adminSidebar from "../sampleData/adminSidebar.json";
import userSidebar from "../sampleData/userSidebar.json";

const iconMap = {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
};

function Sidebar({ isCollapsed }) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    let role = sessionStorage.getItem("role");

    // Fix: wait until login writes role
    if (!role) {
      const timer = setTimeout(() => {
        role = sessionStorage.getItem("role");

        if (role === "admin") {
          setMenu(adminSidebar);
        } else {
          setMenu(userSidebar);
        }
      }, 10);

      return () => clearTimeout(timer);
    }

    // Normal execution
    role = role.toLowerCase().trim();

    if (role === "admin") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setMenu(adminSidebar);
    } else {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setMenu(userSidebar);
    }
  }, []);

  const baseItem =
    "flex items-center px-2 py-2 rounded-lg cursor-pointer transition-colors";
  const activeStyle = "bg-slate-800 text-white";
  const inactiveStyle = "text-slate-200 hover:bg-slate-800";

  return (
    <aside
      className={`
        h-full p-4 flex flex-col space-y-3
        bg-slate-900 text-white
        ${isCollapsed ? "w-16" : "w-56"}`}
    >
      {menu.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            <Icon className="h-6 w-6" />
            {!isCollapsed && <span className="ml-3 text-sm">{item.label}</span>}
          </NavLink>
        );
      })}
    </aside>
  );
}

export default Sidebar;
