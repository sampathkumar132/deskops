// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { 
  BellIcon, 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../features/auth/auth";
import Button from "./ui/Button";
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";

function Navbar({ onMenuClick }) {
  const [auth, setAuth] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    setAuth(getAuth());
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    clearAuth();
    setAuth(null);
    navigate("/");
  };

  return (
    <nav className="h-16 px-4 md:px-6 border-b border-default bg-surface/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-lg text-muted hover:text-default hover:bg-white/5 transition-colors"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-muted absolute left-3" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface border border-border rounded-full pl-10 pr-4 py-1.5 w-64 text-sm text-default focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all placeholder-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted hover:text-default hover:bg-white/5 transition-colors"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-muted hover:text-default hover:bg-white/5 transition-colors"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-64 bg-surface border border-border rounded-lg shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
              <p className="text-sm text-muted text-center">No new notifications</p>
            </div>
          )}
        </div>

        {auth ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="hidden md:flex gap-2 text-muted hover:text-red-400"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate("/")}
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

