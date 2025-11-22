// src/components/Users.jsx
import React, { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

function Users({ usersData }) {
  const [employees, setEmployees] = useState(usersData);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(employees.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const visibleEmployees = employees.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleRefresh = () => {
    setEmployees(usersData);
    setPage(1);
  };

  const handleCreate = () => {
    const name = window.prompt("Name:");
    if (!name) return;

    const age = window.prompt("Age:");
    const joinDate = window.prompt("Join date (dd/mm/yyyy):");
    const department = window.prompt("Department:");
    const fullTimeAnswer = window.prompt("Full-time? (yes/no):");

    const newEmployee = {
      id: employees.length ? employees[employees.length - 1].id + 1 : 1,
      name,
      age: Number(age) || 0,
      joinDate: joinDate || "",
      department: department || "",
      fullTime: fullTimeAnswer?.toLowerCase() === "yes",
    };

    setEmployees([...employees, newEmployee]);
    setPage(totalPages);
  };

  const handleEdit = (employee) => {
    const name = window.prompt("Name:", employee.name);
    if (!name) return;

    const age = window.prompt("Age:", employee.age);
    const joinDate = window.prompt("Join date (dd/mm/yyyy):", employee.joinDate);
    const department = window.prompt("Department:", employee.department);
    const fullTimeAnswer = window.prompt(
      "Full-time? (yes/no):",
      employee.fullTime ? "yes" : "no"
    );

    const updated = {
      ...employee,
      name,
      age: Number(age) || 0,
      joinDate: joinDate || "",
      department: department || "",
      fullTime: fullTimeAnswer?.toLowerCase() === "yes",
    };

    setEmployees(
      employees.map((e) => (e.id === employee.id ? updated : e))
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this employee?")) return;
    setEmployees(employees.filter((e) => e.id !== id));
    setPage(1);
  };

  const handlePrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500">Employees</p>
          <h1 className="text-xl font-semibold text-slate-900">
            Employees
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
          >
            <ArrowPathIcon className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Join date</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Full-time</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {visibleEmployees.map((employee) => (
              <tr key={employee.id} className="bg-white hover:bg-slate-50">
                <td className="px-4 py-3">{employee.id}</td>
                <td className="px-4 py-3 text-slate-900">{employee.name}</td>
                <td className="px-4 py-3">{employee.age}</td>
                <td className="px-4 py-3 text-slate-700">
                  {employee.joinDate}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {employee.department}
                </td>
                <td className="px-4 py-3">
                  {employee.fullTime ? (
                    <CheckIcon className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XMarkIcon className="w-5 h-5 text-slate-400" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
                    >
                      <PencilSquareIcon className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-rose-50"
                    >
                      <TrashIcon className="w-4 h-4 text-rose-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {visibleEmployees.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No employees
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <span className="border border-slate-200 rounded px-2 py-1 bg-white">
            {rowsPerPage}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span>
            {employees.length === 0
              ? "0–0 of 0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + rowsPerPage,
                  employees.length
                )} of ${employees.length}`}
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
            >
              <ChevronLeftIcon className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
            >
              <ChevronRightIcon className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
