import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo-rmbg.png";

const API_BASE = "http://localhost:3000";

const iconMap = {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
};

function Sidebar({ isCollapsed, role }) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const endpoint = role === "admin" ? "adminSidebar" : "userSidebar";
        const response = await fetch(`${API_BASE}/${endpoint}`);
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Failed to fetch sidebar:", error);
      }
    };

    fetchSidebar();
  }, [role]);

  return (
    <aside
      className={`
        relative z-20 h-full flex flex-col border-r border-default bg-surface/50 backdrop-blur-xl transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="flex h-16 items-center justify-center border-b border-default">
        <div className={`font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200 ${isCollapsed ? "hidden" : "block"}`}>
          DESKOPS
        </div>
        {isCollapsed && (
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        )}
      </div>


      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menu.map((item) => {
          const Icon = iconMap[item.icon] || HomeIcon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? "bg-primary-600/10 text-primary-400 shadow-[0_0_20px_rgba(56,189,248,0.1)] border border-primary-500/20" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`
              }
            >
              <Icon className={`h-6 w-6 transition-colors ${isCollapsed ? "mx-auto" : "mr-3"}`} />
              
              {!isCollapsed && (
                <span className="font-medium text-sm tracking-wide">
                  {item.label}
                </span>
              )}
              
              {!isCollapsed && (
                <div className="absolute right-2 w-1 h-1 rounded-full bg-primary-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary-500/20">
            JD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-slate-400 truncate">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
