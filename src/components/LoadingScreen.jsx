// LoadingScreen.jsx
import React from "react";

export default function LoadingScreen({ progress = null, message = "Uploading..." }) {
  // progress is optional (0..100). If null, show indefinite spinner.
  return (
    <div className="w-full h-56 flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
        <div className="text-lg font-medium text-sky-600">{message}</div>
      </div>

      {progress !== null ? (
        <div className="w-64 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }}
          />
        </div>
      ) : (
        <div className="text-sm text-gray-500">Please wait...</div>
      )}
    </div>
  );
}
