import DragDropFile from "../components/DragDropFile";

export default function MyUploadPage() {
  const handleFiles = (files) => {
    console.log("Files received:", files);

    // Example:
    // Save to localStorage, IndexedDB, or state
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Upload Files</h1>
      <DragDropFile onFilesSelected={handleFiles} />
    </div>
  );
}
