import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../../api";

export default function AdminMultimediaPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type: "video",
    url: "",
    tags: "",
    transcript: "",
    file: null
  });
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    type: "video",
    url: "",
    tags: "",
    transcript: "",
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [uploadOption, setUploadOption] = useState("url");
  const [editUploadOption, setEditUploadOption] = useState("url");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Fetch all multimedia
  useEffect(() => {
    fetchMultimedia();
  }, []);

  const fetchMultimedia = () => {
    axios.get(`${apiurl}/api/multimedia`)
      .then(res => setItems(res.data))
      .catch(() => setItems([]));
  };

  // Handle form change
  const handleChange = e => {
    if (e.target.name === "file") {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Handle edit form change
  const handleEditChange = e => {
    if (e.target.name === "file") {
      setEditForm({ ...editForm, file: e.target.files[0] });
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
  };

  // Submit new multimedia
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("tags", form.tags);
      formData.append("transcript", form.transcript);

      if (uploadOption === "url") {
        formData.append("url", form.url);
      } else if (form.file) {
        formData.append("file", form.file);
      }

      const res = await axios.post(`${apiurl}/api/multimedia`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          withCredentials: true
        }
      });

      toast.success("Multimedia created!");
      setItems([res.data, ...items]);
      setForm({ title: "", type: "video", url: "", tags: "", transcript: "", file: null });
    } catch (err) {
      toast.error("Error creating multimedia");
      console.error(err);
    }
    setLoading(false);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditForm({
      id: item.media_id,
      title: item.title,
      type: item.type,
      url: item.url,
      tags: item.tags ? item.tags.join(", ") : "",
      transcript: item.transcript || "",
      file: null
    });
    setEditUploadOption(item.url.startsWith('uploads/') ? "file" : "url");
    setIsEditModalOpen(true);
  };

  // Submit edit multimedia
  const handleEditSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("type", editForm.type);
      formData.append("tags", editForm.tags);
      formData.append("transcript", editForm.transcript);

      if (editUploadOption === "url") {
        formData.append("url", editForm.url);
      } else if (editForm.file) {
        formData.append("file", editForm.file);
      }

      await axios.put(`${apiurl}/api/multimedia/${editForm.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          withCredentials: true
        }
      });

      toast.success("Multimedia updated!");
      setIsEditModalOpen(false);
      fetchMultimedia(); // Refresh the list
    } catch (err) {
      toast.error("Error updating multimedia");
      console.error(err);
    }
    setLoading(false);
  };

  // Delete multimedia
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media item?")) {
      return;
    }

    setDeletingId(id);
    try {
      await axios.delete(`${apiurl}/api/multimedia/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          withCredentials: true
        }
      });

      toast.success("Multimedia deleted!");
      setItems(items.filter(item => item.media_id !== id));
    } catch (err) {
      toast.error("Error deleting multimedia");
      console.error(err);
    }
    setDeletingId(null);
  };

  // Function to get the correct URL for display
  const getMediaUrl = (url) => {
    if (url && url.startsWith('uploads/')) {
      return `${apiurl}/${url}`;
    }
    return url;
  };

  // Function to get thumbnail for media
  const getThumbnail = (item) => {
    if (item.type === "video") {
      if (item.url.startsWith('uploads/')) {
        return "https://via.placeholder.com/300x180/ff6b6b/ffffff?text=Video";
      } else if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        const videoId = item.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (videoId && videoId[1]) {
          return `https://img.youtube.com/vi/${videoId[1]}/mqdefault.jpg`;
        }
      }
    } else if (item.type === "image") {
      return getMediaUrl(item.url);
    } else if (item.type === "audio") {
      return "https://via.placeholder.com/300x180/4ecdc4/ffffff?text=Audio";
    } else if (item.type === "pdf") {
      return "https://via.placeholder.com/300x180/45b7d1/ffffff?text=PDF";
    }
    
    return "https://via.placeholder.com/300x180/96aab5/ffffff?text=Media";
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Admin Multimedia Management</h2>
        
        {/* View Mode Toggle */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              background: viewMode === "grid" ? "#0984e3" : "#f0f0f0",
              color: viewMode === "grid" ? "white" : "#333",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              background: viewMode === "list" ? "#0984e3" : "#f0f0f0",
              color: viewMode === "list" ? "white" : "#333",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            List
          </button>
        </div>
      </div>

      {/* Create Form */}
      <details style={{ marginBottom: 32 }}>
        <summary style={{ 
          cursor: "pointer", 
          fontSize: "1.1rem", 
          fontWeight: "bold",
          padding: "12px 16px",
          background: "#f8f9fa",
          borderRadius: "8px"
        }}>
          Add New Media
        </summary>
        <form onSubmit={handleSubmit} style={{
          background: "#fff", 
          padding: 24, 
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginTop: 8
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "500" }}>Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Media title"
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "500" }}>Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
              >
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Source</label>
              <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                <label>
                  <input
                    type="radio"
                    value="url"
                    checked={uploadOption === "url"}
                    onChange={() => setUploadOption("url")}
                    style={{ marginRight: 6 }}
                  />
                  URL
                </label>
                <label>
                  <input
                    type="radio"
                    value="file"
                    checked={uploadOption === "file"}
                    onChange={() => setUploadOption("file")}
                    style={{ marginRight: 6 }}
                  />
                  Upload File
                </label>
              </div>

              {uploadOption === "url" ? (
                <input
                  type="text"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="Media URL"
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                />
              ) : (
                <input
                  type="file"
                  name="file"
                  accept={form.type === "image" ? "image/*" : form.type === "audio" ? "audio/*" : form.type === "pdf" ? "application/pdf" : form.type === "video" ? "video/*" : "*"}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                  required={uploadOption === "file"}
                />
              )}
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "500" }}>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "500" }}>Transcript (optional)</label>
              <textarea
                name="transcript"
                value={form.transcript}
                onChange={handleChange}
                placeholder="Transcript text"
                rows={3}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#28a745", 
              color: "#fff", 
              padding: "10px 20px", 
              borderRadius: "6px",
              border: "none", 
              fontWeight: "bold", 
              cursor: "pointer",
              marginTop: 16
            }}
          >
            {loading ? "Creating..." : "Create Multimedia"}
          </button>
        </form>
      </details>

      {/* Media List Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>All Media ({items.length})</h3>
        <div style={{ fontSize: "0.9rem", color: "#666" }}>
          {viewMode === "grid" ? "Grid view" : "List view"}
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{
          background: "#f8f9fa", 
          padding: 40, 
          borderRadius: 12, 
          textAlign: "center",
          color: "#606060"
        }}>
          <p>No multimedia content found</p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: 20 
        }}>
          {items.map(item => (
            <div key={item.media_id} style={{
              background: "#fff", 
              borderRadius: 12, 
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}>
              {/* Thumbnail */}
              <div style={{ 
                position: "relative", 
                paddingBottom: "56.25%", // 16:9 aspect ratio
                backgroundColor: "#000",
                overflow: "hidden"
              }}>
                <img 
                  src={getThumbnail(item)} 
                  alt={item.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                
                {/* Media type indicator */}
                <div style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  textTransform: "uppercase"
                }}>
                  {item.type}
                </div>
              </div>
              
              {/* Content details */}
              <div style={{ padding: 16 }}>
                <h4 style={{ 
                  margin: "0 0 8px", 
                  fontSize: "16px",
                  fontWeight: "500",
                  lineHeight: "1.4",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  color: "#0f0f0f",
                  height: 44
                }}>
                  {item.title}
                </h4>
                
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap",
                  gap: "4px",
                  marginBottom: 12,
                  minHeight: 28
                }}>
                  {item.tags && item.tags.slice(0, 2).map(tag => (
                    <span key={tag} style={{
                      background: "#e8f4fd", 
                      color: "#0984e3", 
                      padding: "2px 6px",
                      borderRadius: "4px", 
                      fontSize: "11px", 
                      display: "inline-block"
                    }}>
                      #{tag.length > 12 ? tag.substring(0, 12) + '...' : tag}
                    </span>
                  ))}
                  {item.tags && item.tags.length > 2 && (
                    <span style={{
                      background: "#f0f0f0", 
                      color: "#666", 
                      padding: "2px 6px",
                      borderRadius: "4px", 
                      fontSize: "11px", 
                      display: "inline-block"
                    }}>
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div style={{ 
                  display: "flex", 
                  gap: "8px",
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: 12,
                  marginTop: 8
                }}>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      background: "#ffc107",
                      color: "#000",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      flex: 1
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.media_id)}
                    disabled={deletingId === item.media_id}
                    style={{
                      background: deletingId === item.media_id ? "#ccc" : "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: deletingId === item.media_id ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      flex: 1
                    }}
                  >
                    {deletingId === item.media_id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map(item => (
            <div key={item.media_id} style={{
              background: "#fff", 
              padding: 16, 
              borderRadius: 12, 
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              gap: 16
            }}>
              {/* Thumbnail */}
              <div style={{ 
                width: 160, 
                height: 90, 
                backgroundColor: "#000",
                borderRadius: 8,
                overflow: "hidden",
                flexShrink: 0
              }}>
                <img 
                  src={getThumbnail(item)} 
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
              
              {/* Content details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ 
                  margin: "0 0 8px", 
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#0f0f0f"
                }}>
                  {item.title}
                </h4>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8
                }}>
                  <span style={{
                    background: "#e8f4fd",
                    color: "#0984e3",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}>
                    {item.type.toUpperCase()}
                  </span>
                  
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap",
                  gap: "4px",
                  marginBottom: 12
                }}>
                  {item.tags && item.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      background: "#f0f0f0", 
                      color: "#666", 
                      padding: "2px 6px",
                      borderRadius: "4px", 
                      fontSize: "11px", 
                      display: "inline-block"
                    }}>
                      #{tag.length > 15 ? tag.substring(0, 15) + '...' : tag}
                    </span>
                  ))}
                  {item.tags && item.tags.length > 3 && (
                    <span style={{
                      background: "#f0f0f0", 
                      color: "#666", 
                      padding: "2px 6px",
                      borderRadius: "4px", 
                      fontSize: "11px", 
                      display: "inline-block"
                    }}>
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                gap: "8px",
                justifyContent: "center"
              }}>
                <button
                  onClick={() => openEditModal(item)}
                  style={{
                    background: "#ffc107",
                    color: "#000",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.media_id)}
                  disabled={deletingId === item.media_id}
                  style={{
                    background: deletingId === item.media_id ? "#ccc" : "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: deletingId === item.media_id ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}
                >
                  {deletingId === item.media_id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            width: "100%",
            maxWidth: 600,
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20
            }}>
              <h3>Edit Media</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#757575"
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "500" }}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    placeholder="Media title"
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "500" }}>Type</label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                  >
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: "500" }}>Source</label>
                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                  <label>
                    <input
                      type="radio"
                      value="url"
                      checked={editUploadOption === "url"}
                      onChange={() => setEditUploadOption("url")}
                      style={{ marginRight: 6 }}
                    />
                    URL
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="file"
                      checked={editUploadOption === "file"}
                      onChange={() => setEditUploadOption("file")}
                      style={{ marginRight: 6 }}
                    />
                    Upload File
                  </label>
                </div>

                {editUploadOption === "url" ? (
                  <input
                    type="text"
                    name="url"
                    value={editForm.url}
                    onChange={handleEditChange}
                    placeholder="Media URL"
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      name="file"
                      accept={editForm.type === "image" ? "image/*" : editForm.type === "audio" ? "audio/*" : editForm.type === "pdf" ? "application/pdf" : editForm.type === "video" ? "video/*" : "*"}
                      onChange={handleEditChange}
                      style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginBottom: 8 }}
                    />
                    <div style={{ fontSize: "0.8rem", color: "#757575" }}>
                      Current: {editForm.url}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 4, fontWeight: "500" }}>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={editForm.tags}
                  onChange={handleEditChange}
                  placeholder="tag1, tag2, tag3"
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 4, fontWeight: "500" }}>Transcript (optional)</label>
                <textarea
                  name="transcript"
                  value={editForm.transcript}
                  onChange={handleEditChange}
                  placeholder="Transcript text"
                  rows={3}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#28a745", color: "#fff", padding: "10px 20px", borderRadius: "6px",
                    border: "none", fontWeight: "bold", cursor: "pointer", flex: 1
                  }}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    background: "#6c757d", color: "#fff", padding: "10px 20px", borderRadius: "6px",
                    border: "none", fontWeight: "bold", cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}