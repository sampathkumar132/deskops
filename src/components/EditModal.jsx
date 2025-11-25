import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Generic EditModal
 * Props:
 * - open: boolean
 * - employee: object | null    <-- kept this prop name for backwards compatibility
 * - onClose: () => void
 * - onSave: (updatedObject) => void
 *
 * Behavior:
 * - If you prefer a different prop name (like `initialData`), change callers accordingly.
 * - This modal auto-renders simple inputs for string/number/boolean fields.
 * - For richer controls (selects, datepickers), convert specific fields manually.
 */
export default function EditModal({ open, employee, onClose, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (employee) {
      // clone so we can edit locally
      setForm({ ...employee });
    } else {
      setForm({});
    }
  }, [employee]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation: require `name` if present in object
    if ("name" in form && !String(form.name).trim()) {
      alert("Name is required");
      return;
    }
    // coerce number-like fields back to numbers (best-effort)
    const normalized = { ...form };
    Object.keys(normalized).forEach((k) => {
      const v = normalized[k];
      if (typeof employee?.[k] === "number") {
        const n = Number(v);
        normalized[k] = Number.isNaN(n) ? 0 : n;
      }
      // booleans are already handled
    });

    onSave(normalized);
  };

  // order fields: keep id/name first if present
  const keys = Object.keys(form).sort((a, b) => {
    if (a === "id") return -1;
    if (b === "id") return 1;
    if (a === "name") return -1;
    if (b === "name") return 1;
    return 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-xl shadow-lg z-10">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-slate-900">Edit</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100" aria-label="Close">
            <XMarkIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[70vh] overflow-auto">
          {keys.length === 0 && <div className="text-sm text-slate-500">No editable fields</div>}

          {keys.map((key) => {
            const value = form[key];
            // render checkbox for booleans
            if (typeof value === "boolean") {
              return (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    id={key}
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={key} className="text-sm text-slate-700 capitalize">{key}</label>
                </div>
              );
            }

            // number input for numeric original fields
            if (typeof employee?.[key] === "number") {
              return (
                <div key={key}>
                  <label className="block text-xs text-slate-500 capitalize">{key}</label>
                  <input
                    type="number"
                    value={value ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded px-3 py-2 text-sm"
                  />
                </div>
              );
            }

            // default: text input
            return (
              <div key={key}>
                <label className="block text-xs text-slate-500 capitalize">{key}</label>
                <input
                  type="text"
                  value={value ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded px-3 py-2 text-sm"
                />
              </div>
            );
          })}

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border bg-white text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
