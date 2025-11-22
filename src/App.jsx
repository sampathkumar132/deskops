import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import projects from './sampleData/projects.json';
import Users from "./components/Users.jsx";
import usersData from "./sampleData/users.json";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="h-screen flex flex-col">
      <Navbar
        onMenuClick={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <main className="flex-1 p-4 md:p-6 bg-slate-50 overflow-y-auto">
          <Dashboard projects={projects} />
          <Users usersData={usersData} />
        </main>
      </div>
    </div>
  );
}

export default App;
