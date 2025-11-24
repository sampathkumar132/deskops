import React, { useState } from "react";

export default function DragDropFile({ onFilesSelected }) {
  const [files, setFiles] = useState([]);

  // Handle files from drag or input
  const processFiles = (fileList) => {
    const uploadedFiles = Array.from(fileList);
    setFiles(uploadedFiles);

    // Send files to parent
    if (onFilesSelected) {
      onFilesSelected(uploadedFiles);
    }
  };

  // Drag drop events
  const handleDrop = (e) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    processFiles(e.target.files);
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center cursor-pointer"
      >
        <p className="text-gray-600 mb-3">Drag & Drop files here</p>
        <p className="text-gray-500">OR</p>

        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="mt-3"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 text-left">
          <h3 className="font-semibold mb-2">Uploaded Files:</h3>
          <ul className="list-disc ml-6">
            {files.map((file, index) => (
              <li key={index} className="text-gray-700">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
