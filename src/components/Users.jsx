import React, { useState, useEffect } from "react";
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

import EditModal from "./EditModal";
import ConfirmModal from "./ConfirmModal";

function Users({ usersData }) {
  const [employees, setEmployees] = useState(usersData);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageInput, setPageInput] = useState("1");

  // modal state
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const totalPages = Math.max(1, Math.ceil(employees.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const visibleEmployees = employees.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setPage(clamped);
    setPageInput(String(clamped));
  }, [employees.length, rowsPerPage, totalPages]);

  const handleRefresh = () => {
    setEmployees(usersData);
    setPage(1);
    setPageInput("1");
  };

  const handleCreate = () => {
    const name = window.prompt("Name:");
    if (!name) return;

    const age = window.prompt("Age:");
    const joinDate = window.prompt("Join date:");
    const department = window.prompt("Department:");
    const fullTime = window.prompt("Full-time? yes/no") === "yes";

    const newEmployee = {
      id: employees.length ? employees[employees.length - 1].id + 1 : 1,
      name,
      age: Number(age) || 0,
      joinDate,
      department,
      fullTime,
    };

    const next = [...employees, newEmployee];
    setEmployees(next);

    const newTotal = Math.ceil(next.length / rowsPerPage);
    setPage(newTotal);
    setPageInput(String(newTotal));
  };

  const openEdit = (emp) => {
    setSelectedEmployee(emp);
    setEditOpen(true);
  };

  const openDelete = (emp) => {
    setSelectedEmployee(emp);
    setDeleteOpen(true);
  };

  // called by EditModal on save
  const handleSave = (updated) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditOpen(false);
    setSelectedEmployee(null);
  };

  // called by ConfirmModal on confirm
  const handleConfirmDelete = () => {
    if (!selectedEmployee) return;
    setEmployees((prev) => {
      const next = prev.filter((e) => e.id !== selectedEmployee.id);
      // clamp page
      const newTotal = Math.max(1, Math.ceil(next.length / rowsPerPage));
      setPage((p) => Math.min(p, newTotal));
      setPageInput((cur) => String(Math.min(Number(cur) || 1, newTotal)));
      return next;
    });
    setDeleteOpen(false);
    setSelectedEmployee(null);
  };

  const handlePrev = () => {
    const p = Math.max(1, page - 1);
    setPage(p);
    setPageInput(String(p));
  };

  const handleNext = () => {
    const p = Math.min(totalPages, page + 1);
    setPage(p);
    setPageInput(String(p));
  };

  const handleJump = () => {
    const n = parseInt(pageInput, 10);
    if (Number.isNaN(n)) {
      setPageInput(String(page));
      return;
    }
    const clamped = Math.min(Math.max(1, n), totalPages);
    setPage(clamped);
    setPageInput(String(clamped));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500">Employees</p>
          <h1 className="text-xl font-semibold text-slate-900">Employees</h1>
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
                <td className="px-4 py-3 text-slate-700">{employee.joinDate}</td>
                <td className="px-4 py-3 text-slate-700">{employee.department}</td>
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
                      onClick={() => openEdit(employee)}
                      className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
                    >
                      <PencilSquareIcon className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => openDelete(employee)}
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
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
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
          <input
            type="number"
            min={1}
            value={rowsPerPage}
            onChange={(e) => {
              const n = Math.max(1, parseInt(e.target.value, 10) || 1);
              setRowsPerPage(n);
            }}
            className="w-20 text-sm border border-slate-200 rounded px-2 py-1 bg-white"
          />
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

            <div className="flex items-center space-x-1">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJump()}
                className="w-16 text-sm border border-slate-200 rounded px-2 py-1 bg-white text-center"
                aria-label="Page number"
              />
              <span className="text-xs">/ {totalPages}</span>
              <button
                onClick={handleJump}
                className="px-2 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-sm"
              >
                Go
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
            >
              <ChevronRightIcon className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditModal
        open={editOpen}
        employee={selectedEmployee}
        onClose={() => {
          setEditOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSave}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete employee"
        message={
          selectedEmployee
            ? `Are you sure you want to delete "${selectedEmployee.name}" (ID: ${selectedEmployee.id})? This action cannot be undone.`
            : "Are you sure?"
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => {
          setDeleteOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Users;
