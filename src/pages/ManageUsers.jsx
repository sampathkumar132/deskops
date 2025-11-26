import React, {useState, useEffect} from "react";
import Users from "../components/Users.jsx";

const API_BASE = "http://localhost:3000";

function ManageUsers() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE}/employees`);
        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="text-center py-12"><p className="text-slate-400">Loading employees...</p></div>;
  }

  return <Users usersData={usersData} />;
}

export default ManageUsers;