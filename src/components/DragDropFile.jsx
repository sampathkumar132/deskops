import React, { useState } from "react";
import UploadModal from "./UploadModal";

export default function DragDropFile() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Upload button opens modal */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-sky-700"
      >
        Upload Files
      </button>

      {/* Modal (only visible when open=true) */}
      <UploadModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
