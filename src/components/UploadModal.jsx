// UploadModal.jsx
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { nanoid } from "nanoid";
import LoadingScreen from "./LoadingScreen";
import icons from '../assets/react.svg';


const PREVIEW_ICON = {icons}; 

function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function fileCategory(type, name) {
  if (!type) {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return "Image";
    if (["pdf"].includes(ext)) return "PDF";
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ext)) return "Doc";
    return "Other";
  }
  if (type.startsWith("image/")) return "Image";
  if (type === "application/pdf") return "PDF";
  if (
    type === "application/msword" ||
    type.includes("officedocument") ||
    type.startsWith("text/")
  )
    return "Doc";
  return "Other";
}

export default function UploadModal({ open, onClose, uploadedBy = "You" }) {
  // Full list of uploaded items
  const [files, setFiles] = useState([]); // each: {id,name,size,lastModified,uploadedBy,type,category,selected}
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // 0..100 or null
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All/Image/PDF/Doc/Other
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // fixed page size for modal to avoid scroll
  const [selectAllOnPage, setSelectAllOnPage] = useState(false);

  // dropzone setup: supports folders via webkitdirectory attribute on input
  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    // Start uploading state
    setIsUploading(true);
    setUploadProgress(0);

    // Prepare metadata quickly
    const incoming = acceptedFiles.map((f) => ({
      id: nanoid(),
      name: f.name,
      size: f.size,
      lastModified: f.lastModified ? new Date(f.lastModified) : new Date(),
      uploadedBy,
      type: f.type,
      category: fileCategory(f.type, f.name),
      selected: false,
    }));

    // Simulate upload progress across files
    // We'll simulate progress increasing to 100 over ~1000-1600ms per file
    const totalSteps = Math.min(120, 40 + incoming.length * 10);
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((r) => setTimeout(r, 8)); // small delay
      setUploadProgress(Math.round((i / totalSteps) * 100));
    }

    // After simulated upload, append to list and reset loading
    setFiles((prev) => {
      // avoid duplicates by id
      return [...prev, ...incoming];
    });

    setIsUploading(false);
    setUploadProgress(null);

    // jump to last page so user sees newly added files
    setPage(1); // show newest on page 1 (you can change to show newest on last page)
  }, [uploadedBy]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    noClick: false,
    noKeyboard: false,
    // Note: `directory` param is not an official prop; we use webkitdirectory on input below
  });

  // Derived filtered list
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return files.filter((f) => {
      if (filter !== "All" && f.category !== filter) return false;
      if (!s) return true;
      return f.name.toLowerCase().includes(s);
    });
  }, [files, search, filter]);

  // Pagination calculations (Option A)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  useEffect(() => {
    // reset selection when page changes
    setSelectAllOnPage(false);
  }, [currentPage, filtered]);

  // Select all visible on current page
  const toggleSelectAllOnPage = () => {
    const visibleIds = pageItems.map((p) => p.id);
    const anyUnselected = pageItems.some((p) => !p.selected);
    setFiles((prev) =>
      prev.map((f) => (visibleIds.includes(f.id) ? { ...f, selected: anyUnselected } : f))
    );
    setSelectAllOnPage(anyUnselected);
  };

  const toggleSelectOne = (id) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f)));
  };

  const anySelected = files.some((f) => f.selected);
  const bulkDelete = () => {
    if (!anySelected) return;
    const confirmed = window.confirm(`Delete ${files.filter((f) => f.selected).length} items?`);
    if (!confirmed) return;
    setFiles((prev) => prev.filter((f) => !f.selected));
  };

  const deleteOne = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // pagination helpers for rendering page numbers with ... when many pages
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 7;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    // always show first, last, current +-1
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);
    if (left > 2) pages.push("left-ellipsis"); // will render "..."
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("right-ellipsis");
    pages.push(totalPages);
    return pages;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[920px] max-w-[95vw] rounded-xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload Files & Folders</h2>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 rounded-md border hover:bg-red-50 text-red-600"
              onClick={() => {
                // reset everything and close
                onClose?.();
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Top area: dropzone + controls */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Left: dropzone (spans 2 cols) */}
          <div
            {...getRootProps()}
            className="col-span-2 border-2 border-dashed border-sky-300 rounded-lg h-36 flex flex-col items-center justify-center cursor-pointer"
          >
            {/* use a native input so that folder upload works */}
            <input {...getInputProps()} webkitdirectory="true" directory="" type="file" />
            <img src={PREVIEW_ICON} alt="upload icon" className="h-8 mb-2 opacity-80" />
            <div className="text-sm text-sky-700 font-medium">Click or drag & drop files / folders here</div>
            <div className="text-xs text-gray-500">Supports folders (Chrome/Edge). Max single file size depends on your backend.</div>
          </div>

          {/* Right: search/filter/actions */}
          <div className="col-span-1 flex flex-col gap-3">
            <input
              placeholder="Search files..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="All">All types</option>
              <option value="Image">Images</option>
              <option value="PDF">PDFs</option>
              <option value="Doc">Docs</option>
              <option value="Other">Others</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={bulkDelete}
                disabled={!anySelected}
                className={`flex-1 px-3 py-2 rounded-md text-white ${anySelected ? "bg-red-500 hover:bg-red-600" : "bg-gray-300 cursor-not-allowed"}`}
              >
                Delete Selected
              </button>

              <div className="flex items-center gap-2 px-2">
                <div className="text-xs text-gray-500">Per page</div>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm">
                  <option value={5}>5</option>
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main content: loading or list */}
        {isUploading ? (
          <LoadingScreen progress={uploadProgress} message={`Uploading (${uploadProgress ?? 0}%)`} />
        ) : (
          <>
            {/* Summary row */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">
                Showing <strong>{filtered.length}</strong> file(s)
              </div>
              <div className="text-sm text-gray-500">Page {currentPage} of {totalPages}</div>
            </div>

            {/* Table header */}
            <div className="w-full border rounded-lg overflow-hidden">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 w-10 text-left">
                      <input type="checkbox" checked={pageItems.every(p => p.selected) && pageItems.length > 0} onChange={toggleSelectAllOnPage} />
                    </th>
                    <th className="p-3 text-left">File Name</th>
                    <th className="p-3 text-left w-36">Size</th>
                    <th className="p-3 text-left w-40">Last Modified</th>
                    <th className="p-3 text-left w-36">Uploaded By</th>
                    <th className="p-3 text-left w-28">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">No files to show</td>
                    </tr>
                  ) : pageItems.map((f) => (
                    <tr key={f.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <input type="checkbox" checked={!!f.selected} onChange={() => toggleSelectOne(f.id)} />
                      </td>
                      <td className="p-3 flex items-center gap-3">
                        <img src={PREVIEW_ICON} alt="" className="h-7 w-7 rounded-sm object-cover" />
                        <div>
                          <div className="text-sm font-medium">{f.name}</div>
                          <div className="text-xs text-gray-400">{f.category}</div>
                        </div>
                      </td>
                      <td className="p-3">{formatSize(f.size)}</td>
                      <td className="p-3">{new Date(f.lastModified).toLocaleString()}</td>
                      <td className="p-3">{f.uploadedBy}</td>
                      <td className="p-3">
                        <button onClick={() => deleteOne(f.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border mr-2 disabled:opacity-50"
                >
                  Prev
                </button>
                {getPageNumbers().map((p, idx) => {
                  if (p === "left-ellipsis" || p === "right-ellipsis") {
                    return <span key={idx} className="px-2">...</span>;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded-md mr-1 ${p === currentPage ? "bg-sky-600 text-white" : "border"}`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border ml-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-500">
                {startIdx + 1} - {Math.min(startIdx + pageSize, filtered.length)} of {filtered.length}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
