// src/pages/UsersPage.jsx
import React from "react";
import Users from "../components/Users.jsx";
import usersData from "../sampleData/employees.json";

function ManageUsers() {
  return <Users usersData={usersData} />;
}

export default ManageUsers;