import React, { useState, useEffect } from "react";
import { uploadFile, getFiles, deleteFile } from "../API";
import "./Files.css";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Lecture Notes");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await getFiles();
      setFiles(response.files);
    } catch (err) {
      setError("Failed to fetch files");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", selectedCategory);

      await uploadFile(formData);
      await fetchFiles();
      setSelectedFile(null);
      e.target.reset();
    } catch (err) {
      setError("Failed to upload file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      setLoading(true);
      await deleteFile(fileId);
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (err) {
      setError("Failed to delete file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="files-container">
      <h2>📂 File Upload & Categorization</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="upload-section">
        <form onSubmit={handleFileUpload}>
          <input 
            type="file" 
            onChange={(e) => setSelectedFile(e.target.files[0])}
            disabled={loading}
          />
          
          {/* Category Dropdown */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={loading}
          >
            <option value="">Select Category</option>
            <option value="Lecture Notes">Lecture Notes</option>
            <option value="Assignments">Assignments</option>
            <option value="Reference Materials">Reference Materials</option>
            <option value="Other Documents">Other Documents</option>
          </select>

          <button 
            type="submit" 
            disabled={!selectedFile || loading}
            className={loading ? 'button-disabled' : ''}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      <h3>Uploaded Files</h3>
      {loading && <p className="loading">Loading...</p>}
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.id}>
            <span>{file.filename} - {file.category}</span>
            <button 
              onClick={() => handleDelete(file.id)}
              disabled={loading}
              className="delete-btn"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
