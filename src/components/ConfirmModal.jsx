import React, { useEffect } from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * ConfirmModal
 * Props:
 * - open: boolean
 * - title: string
 * - message: string
 * - confirmLabel?: string (default "Confirm")
 * - cancelLabel?: string (default "Cancel")
 * - onClose: () => void
 * - onConfirm: () => void
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg z-10 p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-100 rounded">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{message}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border bg-white text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
