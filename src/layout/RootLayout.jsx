// src/layout/RootLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function RootLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarCollapsed(prev => !prev)} />

      <div className="flex flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Render child pages */}
        <main className="flex-1 p-6 bg-slate-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
