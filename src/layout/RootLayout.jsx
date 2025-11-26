import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function RootLayout({ role }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-dark-bg text-slate-200 overflow-hidden font-sans selection:bg-primary-500/30">
      <Sidebar isCollapsed={isSidebarCollapsed} role={role} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarCollapsed((prev) => !prev)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Background decorative elements */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
