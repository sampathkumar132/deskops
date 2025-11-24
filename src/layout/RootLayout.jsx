import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function RootLayout({ role }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarCollapsed((prev) => !prev)} />
      <div className="flex flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} role={role} />
        <main className="flex-1 p-4 md:p-6 bg-slate-50 app-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
