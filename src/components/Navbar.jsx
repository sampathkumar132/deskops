// src/components/Navbar.jsx
import React from "react";
import logo from "../assets/logo-rmbg.png";
import {
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };
  return (
    <nav className="w-full h-16 px-4 md:px-6 bg-sky-900 text-white flex items-center shadow-sm">
      {/* Left: Menu Icon + Logo */}
      <div className="flex items-center space-x-3">
        <Bars3Icon
          className="h-6 w-6 cursor-pointer hover:text-sky-400"
          onClick={onMenuClick}
        />
        <img src={logo} alt="Logo" className="h-20 w-auto" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border border-slate-300 bg-white text-slate-800 placeholder-slate-400 rounded-full px-4 py-2 w-52 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
        />
      </div>
      {/* Right icons */}
      <div className="flex items-center space-x-4 ml-4">
        <BellIcon className="h-6 w-6 cursor-pointer hover:text-sky-400" />
        <UserCircleIcon className="h-8 w-8 cursor-pointer hover:text-sky-400" />
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
