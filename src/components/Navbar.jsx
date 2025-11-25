// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo-rmbg.png";
import { BellIcon, UserCircleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../features/auth/auth";

function Navbar({ onMenuClick }) {
  const [auth, setAuth] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // load auth once on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setAuth(getAuth());
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    clearAuth();
    setAuth(null);
    setIsOpen(false);
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const CURRENT_USER = auth?.username ?? "Guest";

  return (
    <nav className="w-full h-16 px-4 md:px-6 bg-slate-800 text-white flex items-center shadow-sm relative">
      {/* Left: Menu Icon + Logo */}
      <div className="flex items-center space-x-3">
        <Bars3Icon className="h-6 w-6 cursor-pointer hover:text-sky-400" onClick={onMenuClick} />
        <img src={logo} alt="Logo" className="h-20 w-auto" />
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border border-slate-300 bg-white text-slate-800 placeholder-slate-400 rounded-full px-4 py-2 w-52 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 ml-4 relative" ref={dropdownRef}>
        <BellIcon className="h-6 w-6 cursor-pointer hover:text-sky-400" />

        {/* Profile icon (Dropdown Toggle) */}
        <div className="relative">
          <UserCircleIcon
            className="h-8 w-8 cursor-pointer hover:text-sky-400"
            onClick={() => setIsOpen((s) => !s)}
          />

          {isOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white text-slate-800 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b text-sm font-semibold">Hi, {CURRENT_USER}</div>

              {auth ? (
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
