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
import { useSearch } from "../context/SearchContext";

import EditModal from "./EditModal";
import ConfirmModal from "./ConfirmModal";
import Card from "./ui/Card";
import Button from "./ui/Button";

function Users({ usersData = [] }) {
  const { searchQuery } = useSearch();
  const [employees, setEmployees] = useState(usersData);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageInput, setPageInput] = useState("1");

  // modal state
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(employee.id).includes(searchQuery)
  );

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const visibleEmployees = filteredEmployees.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setPage(clamped);
    setPageInput(String(clamped));
  }, [filteredEmployees.length, rowsPerPage, totalPages]);

  const handleRefresh = () => {
    setEmployees(usersData);
    setPage(1);
    setPageInput("1");
  };

  const handleCreate = () => {
    // Create new employee template
    const newEmployee = {
      id: employees.length ? employees[employees.length - 1].id + 1 : 1,
      name: "",
      age: 0,
      joinDate: new Date().toISOString().split('T')[0],
      department: "",
      fullTime: true,
    };
    setSelectedEmployee(newEmployee);
    setCreateOpen(true);
  };

  const handleCreateSave = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
    setCreateOpen(false);
    setSelectedEmployee(null);
  };

  const openEdit = (emp) => {
    setSelectedEmployee(emp);
    setEditOpen(true);
  };

  const openDelete = (emp) => {
    setSelectedEmployee(emp);
    setDeleteOpen(true);
  };

  const handleSave = (updated) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditOpen(false);
    setSelectedEmployee(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedEmployee) return;
    setEmployees((prev) => prev.filter((e) => e.id !== selectedEmployee.id));
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-slate-400 text-sm">Manage your team members</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleRefresh}>
            <ArrowPathIcon className="w-5 h-5" />
          </Button>
          <Button onClick={handleCreate}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-slate-400 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Full-time</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visibleEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-slate-400">#{employee.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{employee.name}</td>
                  <td className="px-6 py-4 text-slate-300">{employee.age}</td>
                  <td className="px-6 py-4 text-slate-300">{employee.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {employee.fullTime ? (
                      <CheckIcon className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XMarkIcon className="w-5 h-5 text-slate-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(employee)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDelete(employee)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No employees found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-white/10 p-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="bg-dark-surface border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-primary-500"
            >
              {[5, 10, 20, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {filteredEmployees.length === 0
                ? "0–0 of 0"
                : `${startIndex + 1}–${Math.min(startIndex + rowsPerPage, filteredEmployees.length)} of ${filteredEmployees.length}`}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                disabled={page <= 1}
                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJump()}
                  className="w-12 text-center bg-dark-surface border border-white/10 rounded py-1 focus:outline-none focus:border-primary-500"
                />
                <span>/ {totalPages}</span>
              </div>

              <button
                onClick={handleNext}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <EditModal
        open={editOpen}
        employee={selectedEmployee}
        onClose={() => {
          setEditOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSave}
      />

      <EditModal
        open={createOpen}
        employee={selectedEmployee}
        onClose={() => {
          setCreateOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleCreateSave}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete Employee"
        message={selectedEmployee ? `Are you sure you want to delete "${selectedEmployee.name}"?` : "Are you sure?"}
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
