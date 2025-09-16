import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../../api";
import getThumbnail, { thumbOnError } from "./../../hooks/useThumbnail";
import {
  Video as VideoIcon,
  Mic as AudioIcon,
  FileText as PdfIcon,
  Image as ImageIcon,
  PlayCircle,
} from "lucide-react";



/* =========================
   LocalStorage Cache Utils
   ========================= */
const CACHE_KEY = "multimedia_cache_v1";

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed.items;
  } catch {
    return null;
  }
};

const writeCache = (items) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ items, savedAt: Date.now() })
    );
  } catch {}
};

const idOf = (x) => String(x?._id || x?.media_id || "");

const upsertList = (list, item) => {
  const next = Array.isArray(list) ? [...list] : [];
  const idx = next.findIndex((x) => idOf(x) === idOf(item));
  if (idx >= 0) next[idx] = item;
  else next.unshift(item);
  return next;
};

const removeFromList = (list, id) =>
  (Array.isArray(list) ? list : []).filter((x) => idOf(x) !== String(id));

/* ========================= */

const getMediaIcon = (type) => {
  const s = 18;
  if (type === "video")
    return (
      <VideoIcon
        size={56}
        style={{ position: "absolute", zIndex: 1, pointerEvents: "none", opacity: 0.9 }}
      />
    );
  if (type === "audio")
    return (
      <AudioIcon
        size={s}
        style={{ position: "absolute", zIndex: 1, pointerEvents: "none", opacity: 0.9 }}
      />
    );
  if (type === "pdf")
    return (
      <PdfIcon
        size={56}
        style={{ position: "absolute", zIndex: 1, pointerEvents: "none", opacity: 0.9 }}
      />
    );
  if (type === "image")
    return (
      <ImageIcon
        size={56}
        style={{ position: "absolute", zIndex: 1, pointerEvents: "none", opacity: 0.9 }}
      />
    );
  return null;
};

export default function AdminMultimediaPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    title: "",
    type: "video",
    url: "",
    tags: "",
    transcript: "",
    file: null,
  });
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    type: "video",
    url: "",
    tags: "",
    transcript: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [uploadOption, setUploadOption] = useState("url");
  const [editUploadOption, setEditUploadOption] = useState("url");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [showAddForm, setShowAddForm] = useState(false);

  // ===== Helpers for URLs / IDs =====
  const isDriveUrl = (url = "") =>
    typeof url === "string" &&
    (url.includes("drive.google.com") ||
      url.includes("docs.google.com/uc?") ||
      /[?&]id=/.test(url) ||
      /\/file\/d\//.test(url));

  const extractDriveId = (urlOrId = "") => {
    if (!urlOrId) return "";
    if (!urlOrId.includes("/") && !urlOrId.includes("?")) return urlOrId.trim();
    const m1 = urlOrId.match(/\/file\/d\/([^/]+)/);
    if (m1?.[1]) return m1[1];
    const m2 = urlOrId.match(/[?&]id=([^&]+)/);
    if (m2?.[1]) return m2[1];
    return "";
  };

  // Fetch all multimedia - with cache-first strategy
  useEffect(() => {
    const cached = readCache();
    if (cached && cached.length) {
      setItems(cached);
      setFilteredItems(cached);
    } else {
      fetchMultimedia();
    }
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const filtered = items.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.type || "").toLowerCase().includes(q) ||
          (item.tags &&
            Array.isArray(item.tags) &&
            item.tags.some((tag) => (tag || "").toLowerCase().includes(q))) ||
          (item.transcript || "").toLowerCase().includes(q)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  const fetchMultimedia = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/multimedia`);
      const data = res.data || [];
      setItems(data);
      setFilteredItems(data);
      writeCache(data);
    } catch {
      setItems([]);
      setFilteredItems([]);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    if (e.target.name === "file") {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    if (e.target.name === "file") {
      setEditForm({ ...editForm, file: e.target.files[0] });
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
  };

  // Submit new multimedia
  const handleSubmit = async (e) => {
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

      const { data: created } = await axios.post(`${apiurl}/api/multimedia`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      toast.success("Multimedia created!");
      const next = upsertList(items, created || { ...form, _id: Date.now().toString() });
      setItems(next);
      setFilteredItems(next);
      writeCache(next);

      setForm({ title: "", type: "video", url: "", tags: "", transcript: "", file: null });
      setUploadOption("url");
      setShowAddForm(false);
    } catch (err) {
      toast.error("Error creating multimedia");
      console.error(err);
    }
    setLoading(false);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditForm({
      id: idOf(item),
      title: item.title,
      type: item.type,
      url: item.url,
      tags: item.tags ? (Array.isArray(item.tags) ? item.tags.join(", ") : item.tags) : "",
      transcript: item.transcript || "",
      file: null,
    });
    setEditUploadOption(item.url && item.url.startsWith("uploads/") ? "file" : "url");
    setIsEditModalOpen(true);
  };

  // Submit edit multimedia
  const handleEditSubmit = async (e) => {
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

      const { data: updated } = await axios.put(`${apiurl}/api/multimedia/${editForm.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      toast.success("Multimedia updated!");
      const safeUpdated =
        updated ||
        {
          ...items.find((x) => idOf(x) === editForm.id),
          title: editForm.title,
          type: editForm.type,
          url: editUploadOption === "url" ? editForm.url : undefined, // server might return new uploads URL
          tags: editForm.tags,
          transcript: editForm.transcript,
          _id: editForm.id,
        };

      const next = upsertList(items, safeUpdated);
      setItems(next);
      setFilteredItems(next);
      writeCache(next);

      setIsEditModalOpen(false);
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
        },
        withCredentials: true,
      });

      toast.success("Multimedia deleted!");
      const next = removeFromList(items, id);
      setItems(next);
      setFilteredItems(next);
      writeCache(next);
    } catch (err) {
      toast.error("Error deleting multimedia");
      console.error(err);
    }
    setDeletingId(null);
  };

  // Function to get the correct URL for display
  const getMediaUrl = (url) => {
    if (url && url.startsWith("uploads/")) {
      return `${apiurl}/${url}`;
    }
    return url;
  };

  // Format date for display
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Multimedia Management</h1>
        <div style={styles.controls}>
          <button onClick={() => setShowAddForm(!showAddForm)} style={styles.toggleButton}>
            {showAddForm ? "View Multimedia" : "Add New Media"}
          </button>
          {!showAddForm && (
            <div style={styles.viewControls}>
              <button
                onClick={() => setViewMode("list")}
                style={{ ...styles.viewButton, ...(viewMode === "list" ? styles.activeViewButton : {}) }}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode("grid")}
                style={{ ...styles.viewButton, ...(viewMode === "grid" ? styles.activeViewButton : {}) }}
              >
                Grid View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Form */}
      {showAddForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Add New Media</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Media title"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Type *</label>
                <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="pdf">PDF</option>
                  <option value="image">Image</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Source *</label>
              <div style={{ display: "flex", gap: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input type="radio" value="url" checked={uploadOption === "url"} onChange={() => setUploadOption("url")} />
                  URL
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input type="radio" value="file" checked={uploadOption === "file"} onChange={() => setUploadOption("file")} />
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
                  style={styles.input}
                  required
                />
              ) : (
                <input
                  type="file"
                  name="file"
                  accept={
                    form.type === "image"
                      ? "image/*"
                      : form.type === "audio"
                      ? "audio/*"
                      : form.type === "pdf"
                      ? "application/pdf"
                      : form.type === "video"
                      ? "video/*"
                      : "*"
                  }
                  onChange={handleChange}
                  style={styles.input}
                  required={uploadOption === "file"}
                />
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Transcript (optional)</label>
              <textarea
                name="transcript"
                value={form.transcript}
                onChange={handleChange}
                placeholder="Transcript text"
                rows={3}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setForm({ title: "", type: "video", url: "", tags: "", transcript: "", file: null });
                  setUploadOption("url");
                  setShowAddForm(false);
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{ ...styles.submitButton, ...(loading && styles.buttonDisabled) }}>
                {loading ? "Creating..." : "Create Multimedia"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showAddForm && (
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search multimedia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.resourceCount}>{filteredItems.length} item(s) found</span>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div style={{ background: "#f8f9fa", padding: 40, borderRadius: 12, textAlign: "center", color: "#606060" }}>
          <p>{searchTerm ? "No multimedia found matching your search" : "No multimedia content found"}</p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "16px",
              }}
            >
              Add Your First Media
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div style={styles.gridContainer}>
          {filteredItems.map((item) => (
            <div key={idOf(item)} style={styles.gridCard}>
              {/* Thumbnail */}
              <div
                style={{
                  position: "relative",
                  height: 180,
                  overflow: "hidden",
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <>
                  <img
                    src={getThumbnail(item)}
                    onError={thumbOnError(item)}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                  />
                  {item.type === "video" && (
                    <PlayCircle size={56} style={{ position: "absolute", zIndex: 1, pointerEvents: "none", opacity: 0.9 }} />
                  )}
                </>
                {item.type === "video" && isDriveUrl(item.url) && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      backgroundColor: "#0A66C2",
                      color: "#FFFFFF",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      zIndex: 2,
                    }}
                  >
                    Drive
                  </div>
                )}
              </div>

              {/* Content details */}
              <div style={{ padding: 16 }}>
                <h4
                  style={{
                    margin: "0 0 8px",
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    color: "#0f0f0f",
                    height: 44,
                  }}
                >
                  {item.title}
                </h4>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: 12, minHeight: 28 }}>
                  {item.tags &&
                    Array.isArray(item.tags) &&
                    item.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          background: "#e8f4fd",
                          color: "#0984e3",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          display: "inline-block",
                        }}
                      >
                        #{typeof tag === "string" && tag.length > 12 ? tag.substring(0, 12) + "..." : tag}
                      </span>
                    ))}
                  {item.tags && Array.isArray(item.tags) && item.tags.length > 2 && (
                    <span
                      style={{
                        background: "#f0f0f0",
                        color: "#666",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        display: "inline-block",
                      }}
                    >
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "12px",
                  }}
                >
                  <span>{formatDate(item.createdAt)}</span>
                  <span>{item.views_count || 0} views</span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #f0f0f0", paddingTop: 12, marginTop: 8 }}>
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
                      flex: 1,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idOf(item))}
                    disabled={deletingId === idOf(item)}
                    style={{
                      background: deletingId === idOf(item) ? "#ccc" : "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: deletingId === idOf(item) ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      flex: 1,
                    }}
                  >
                    {deletingId === idOf(item) ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View - table style */
        <div style={styles.listContainer}>
          <div style={styles.tableHeader}>
            <div style={styles.tableCell}>Title</div>
            <div style={styles.tableCell}>Type</div>
            <div style={styles.tableCell}>Views</div>
            <div style={styles.tableCell}>Created</div>
            <div style={styles.tableCell}>Actions</div>
          </div>
          {filteredItems.map((item) => (
            <div key={idOf(item)} style={styles.tableRow}>
              <div style={{ ...styles.tableCell, display: "flex", alignItems: "center", gap: 10 }}>
                <>
                  <img
                    src={getThumbnail(item)}
                    alt={item.title}
                    style={{ width: 64, height: 40, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
                    loading="lazy"
                  />
                </>
                <div>
                  <div style={styles.resourceTitle}>{item.title}</div>
                  <div style={styles.resourceDescription}>
                    {item.transcript ? (item.transcript.length > 100 ? `${item.transcript.substring(0, 100)}...` : item.transcript) : ""}
                  </div>
                </div>
              </div>
              <div style={styles.tableCell}>
                <span style={styles.categoryBadge}>{(item.type || "").toUpperCase()}</span>
              </div>
              <div style={styles.tableCell}>
                <span style={styles.viewsCount}>{item.views_count || 0}</span>
              </div>
              <div style={styles.tableCell}>{formatDate(item.createdAt)}</div>
              <div style={styles.tableCell}>
                <div style={styles.actionButtons}>
                  <button onClick={() => openEditModal(item)} style={styles.editButton}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idOf(item))}
                    disabled={deletingId === idOf(item)}
                    style={{ ...styles.deleteButton, ...(deletingId === idOf(item) ? styles.buttonDisabled : {}) }}
                  >
                    {deletingId === idOf(item) ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          style={{
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
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              width: "100%",
              maxWidth: 600,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3>Edit Media</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#757575" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    placeholder="Media title"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Type *</label>
                  <select name="type" value={editForm.type} onChange={handleEditChange} style={styles.input}>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Source *</label>
                <div style={{ display: "flex", gap: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="radio" value="url" checked={editUploadOption === "url"} onChange={() => setEditUploadOption("url")} />
                    URL
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="radio" value="file" checked={editUploadOption === "file"} onChange={() => setEditUploadOption("file")} />
                    Upload File
                  </label>
                </div>

                {editUploadOption === "url" ? (
                  <input type="text" name="url" value={editForm.url} onChange={handleEditChange} placeholder="Media URL" style={styles.input} />
                ) : (
                  <div>
                    <input
                      type="file"
                      name="file"
                      accept={
                        editForm.type === "image"
                          ? "image/*"
                          : editForm.type === "audio"
                          ? "audio/*"
                          : editForm.type === "pdf"
                          ? "application/pdf"
                          : editForm.type === "video"
                          ? "video/*"
                          : "*"
                      }
                      onChange={handleEditChange}
                      style={styles.input}
                    />
                    <div style={{ fontSize: "0.8rem", color: "#757575", marginTop: "8px" }}>Current: {editForm.url}</div>
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={editForm.tags}
                  onChange={handleEditChange}
                  placeholder="tag1, tag2, tag3"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Transcript (optional)</label>
                <textarea
                  name="transcript"
                  value={editForm.transcript}
                  onChange={handleEditChange}
                  placeholder="Transcript text"
                  rows={3}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formActions}>
                <button type="submit" disabled={loading} style={{ ...styles.submitButton, ...(loading && styles.buttonDisabled), flex: 1 }}>
                  {loading ? "Updating..." : "Update"}
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={styles.cancelButton}>
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

const styles = {
  container: { padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" },
  pageTitle: { color: "#2c3e50", margin: "0" },
  controls: { display: "flex", gap: "15px", alignItems: "center" },
  toggleButton: { padding: "10px 20px", backgroundColor: "#4b6cb7", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500", transition: "background-color 0.3s ease" },
  viewControls: { display: "flex", gap: "8px" },
  viewButton: { padding: "8px 16px", backgroundColor: "#f8f9fa", color: "#6c757d", border: "1px solid #e9ecef", borderRadius: "6px", cursor: "pointer", fontWeight: "500", transition: "all 0.3s ease" },
  activeViewButton: { backgroundColor: "#4b6cb7", color: "white", borderColor: "#4b6cb7" },
  loadingContainer: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "50vh", color: "#666" },
  spinner: { width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #4b6cb7", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "15px" },
  message: { padding: "12px 20px", borderRadius: "6px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "500" },
  successMessage: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
  errorMessage: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
  messageClose: { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "inherit" },
  formContainer: { backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", marginBottom: "20px" },
  formTitle: { textAlign: "center", color: "#333", marginBottom: "30px", fontSize: "24px", fontWeight: "600" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontWeight: "600", color: "#333", fontSize: "14px" },
  input: { padding: "12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "16px", outline: "none", transition: "border-color 0.3s ease" },
  textarea: { padding: "12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "16px", outline: "none", resize: "vertical", minHeight: "100px", transition: "border-color 0.3s ease" },
  formActions: { display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "10px" },
  cancelButton: { padding: "12px 24px", backgroundColor: "#f8f9fa", color: "#6c757d", border: "1px solid #e9ecef", borderRadius: "4px", cursor: "pointer", fontWeight: "500", transition: "all 0.3s ease" },
  submitButton: { padding: "12px 24px", backgroundColor: "#4b6cb7", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500", transition: "background-color 0.3s ease" },
  buttonDisabled: { backgroundColor: "#6c757d", cursor: "not-allowed" },
  searchContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" },
  searchInput: { padding: "12px 16px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "16px", minWidth: "300px", outline: "none", transition: "border-color 0.3s ease" },
  resourceCount: { color: "#6c757d", fontSize: "14px" },
  emptyState: { textAlign: "center", padding: "40px", color: "#6c757d", backgroundColor: "#f8f9fa", borderRadius: "8px" },
  listContainer: { backgroundColor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
  tableHeader: { display: "grid", gridTemplateColumns: "2fr 1fr 0.5fr 1fr 1fr", padding: "15px 20px", backgroundColor: "#f8f9fa", fontWeight: "600", color: "#495057", borderBottom: "1px solid #e9ecef" },
  tableRow: { display: "grid", gridTemplateColumns: "2fr 1fr 0.5fr 1fr 1fr", padding: "15px 20px", borderBottom: "1px solid #e9ecef", alignItems: "center", transition: "background-color 0.2s ease" },
  tableRowHover: { backgroundColor: "#f8f9fa" },
  tableCell: { padding: "0 10px" },
  resourceTitle: { fontWeight: "600", color: "#2c3e50", marginBottom: "5px" },
  resourceDescription: { color: "#6c757d", fontSize: "14px" },
  categoryBadge: { padding: "4px 10px", backgroundColor: "#e7f3ff", color: "#007bff", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
  viewsCount: { fontWeight: "600", color: "#495057" },
  actionButtons: { display: "flex", gap: "10px" },
  editButton: { padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", transition: "background-color 0.3s ease" },
  deleteButton: { padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", transition: "background-color 0.3s ease" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  gridCard: { backgroundColor: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", transition: "transform 0.2s ease, box-shadow 0.2s ease" },
  gridCardHover: { transform: "translateY(-5px)", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" },
  cardTitle: { margin: "0", color: "#2c3e50", fontSize: "18px", fontWeight: "600", flex: "1" },
  cardCategory: { padding: "4px 8px", backgroundColor: "#e7f3ff", color: "#007bff", borderRadius: "12px", fontSize: "12px", fontWeight: "500", marginLeft: "10px" },
  cardDescription: { color: "#6c757d", marginBottom: "15px", lineHeight: "1.5" },
  cardMeta: { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "14px", color: "#6c757d" },
  cardTags: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" },
  tag: { padding: "4px 8px", backgroundColor: "#f8f9fa", color: "#495057", borderRadius: "4px", fontSize: "12px", border: "1px solid #e9ecef" },
  cardActions: { display: "flex", gap: "10px" },
  cardEditButton: { padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", flex: "1", transition: "background-color 0.3s ease" },
  cardDeleteButton: { padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", flex: "1", transition: "background-color 0.3s ease" },
};

// Add CSS animation for spinner
try {
  const styleSheet = document.styleSheets?.[0];
  if (styleSheet) {
    styleSheet.insertRule(
      `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`,
      styleSheet.cssRules.length
    );
  }
} catch {}
