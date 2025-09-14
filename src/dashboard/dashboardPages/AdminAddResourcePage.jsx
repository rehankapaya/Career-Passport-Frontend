import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiurl } from "../../api";
import { Plus, List, Grid2X2, Search, Edit3, Trash2, X, Layers } from "lucide-react";

const CACHE_KEY = "resources_cache_v1";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed.items;
  } catch {
    return null;
  }
}

function writeCache(items) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ items, savedAt: Date.now() }));
  } catch {}
}

function upsertList(list, item) {
  const next = Array.isArray(list) ? [...list] : [];
  const idx = next.findIndex((x) => String(x._id) === String(item._id));
  if (idx >= 0) next[idx] = item;
  else next.unshift(item);
  return next;
}

function removeFromList(list, id) {
  return (Array.isArray(list) ? list : []).filter((x) => String(x._id) !== String(id));
}

const AdminAddResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    file_url: "",
    tag: "",
  });

  useEffect(() => {
    const cached = readCache();
    if (cached && cached.length) {
      setResources(cached);
      setFilteredResources(cached);
      setLoading(false);
    } else {
      fetchResources();
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const filtered = resources.filter(
        (r) =>
          (r.title || "").toLowerCase().includes(q) ||
          (r.category || "").toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (Array.isArray(r.tag) && r.tag.some((t) => (t || "").toLowerCase().includes(q)))
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources);
    }
  }, [searchTerm, resources]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiurl}/api/resources`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setResources(response.data);
      setFilteredResources(response.data);
      writeCache(response.data);
    } catch {
      setMessage("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || "",
      category: resource.category || "",
      description: resource.description || "",
      file_url: resource.file_url || "",
      tag: Array.isArray(resource.tag) ? resource.tag.join(", ") : resource.tag || "",
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const tagArray = formData.tag ? formData.tag.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const requestData = { ...formData, tag: tagArray };

      if (editingResource) {
        const { data: updated } = await axios.put(
          `${apiurl}/api/resources/${editingResource._id}`,
          requestData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, withCredentials: true }
        );
        const next = upsertList(resources, updated || { ...editingResource, ...requestData, _id: editingResource._id });
        setResources(next);
        setFilteredResources(next);
        writeCache(next);
        setMessage("Resource updated successfully!");
      } else {
        const { data: created } = await axios.post(
          `${apiurl}/api/resources`,
          requestData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, withCredentials: true }
        );
        const next = upsertList(resources, created || requestData);
        setResources(next);
        setFilteredResources(next);
        writeCache(next);
        setMessage("Resource added successfully!");
      }

      resetForm();
    } catch (error) {
      if (error.response?.status === 400) setMessage("All required fields must be provided.");
      else if (error.response?.status === 401) setMessage("Unauthorized. Please log in as admin.");
      else setMessage("Server error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiurl}/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const next = removeFromList(resources, id);
      setResources(next);
      setFilteredResources(next);
      writeCache(next);
      setMessage("Resource deleted successfully!");
    } catch {
      setMessage("Failed to delete resource");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", description: "", file_url: "", tag: "" });
    setEditingResource(null);
    setShowAddForm(false);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "50vh", color: "#666" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #f3f3f3", borderTop: "4px solid #0A66C2", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 15 }} />
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 15 }}>
        <h1 style={{ color: "#1D2226", margin: 0 }}>Resource Management</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              backgroundColor: "#0A66C2",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: "0 6px 18px rgba(10,102,194,0.25)",
            }}
          >
            {showAddForm ? <List size={18} /> : <Plus size={18} />}
            {showAddForm ? "View Resources" : "Add New Resource"}
          </button>
          {!showAddForm && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  backgroundColor: viewMode === "list" ? "#0A66C2" : "#F3F6F8",
                  color: viewMode === "list" ? "#fff" : "#1D2226",
                  border: "1px solid",
                  borderColor: viewMode === "list" ? "#0A66C2" : "#E6E9EC",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <List size={16} />
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  backgroundColor: viewMode === "grid" ? "#0A66C2" : "#F3F6F8",
                  color: viewMode === "grid" ? "#fff" : "#1D2226",
                  border: "1px solid",
                  borderColor: viewMode === "grid" ? "#0A66C2" : "#E6E9EC",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <Grid2X2 size={16} />
                Grid
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
            backgroundColor: message.toLowerCase().includes("success") ? "#E8F3FF" : "#FDE7E9",
            color: message.toLowerCase().includes("success") ? "#0A66C2" : "#B42318",
            border: `1px solid ${message.toLowerCase().includes("success") ? "#BBD7FF" : "#F2C2C0"}`,
          }}
        >
          <span>{message}</span>
          <button onClick={() => setMessage("")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "inherit", display: "inline-flex" }}>
            <X size={18} />
          </button>
        </div>
      )}

      {showAddForm ? (
        <div style={{ backgroundColor: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.08)", marginBottom: 20 }}>
          <h2 style={{ textAlign: "center", color: "#1D2226", marginBottom: 20, fontSize: 22, fontWeight: 700 }}>{editingResource ? "Edit Resource" : "Add New Resource"}</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter resource title"
                  style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="Enter category"
                  style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter description"
                rows={4}
                style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none", resize: "vertical", minHeight: 100 }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>File URL *</label>
              <input
                type="url"
                name="file_url"
                value={formData.file_url}
                onChange={handleChange}
                required
                placeholder="https://example.com/file.pdf"
                style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Layers size={16} /> Tags
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Comma-separated tags (e.g., Beginner, Scholarship)"
                style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 6 }}>
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: "10px 16px", backgroundColor: "#F3F6F8", color: "#1D2226", border: "1px solid #E6E9EC", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  padding: "10px 16px",
                  backgroundColor: formLoading ? "#7AA9D8" : "#0A66C2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  cursor: formLoading ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  boxShadow: "0 6px 18px rgba(10,102,194,0.25)",
                }}
              >
                {formLoading ? (editingResource ? "Updating..." : "Adding...") : editingResource ? "Update Resource" : "Add Resource"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div style={{ position: "relative", minWidth: 300 }}>
              <Search size={16} color="#6B7280" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "12px 14px 12px 36px", border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none", width: "100%" }}
              />
            </div>
            <span style={{ color: "#6B7280", fontSize: 14 }}>{filteredResources.length} resource(s) found</span>
          </div>

          {filteredResources.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#6B7280", backgroundColor: "#F3F6F8", borderRadius: 12 }}>
              <h3 style={{ margin: 0, color: "#1D2226" }}>No resources found</h3>
              <p style={{ marginTop: 8 }}>{searchTerm ? "Try a different search term" : "Add your first resource to get started"}</p>
            </div>
          ) : viewMode === "list" ? (
            <div style={{ backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.6fr 1fr 1fr", padding: "14px 18px", backgroundColor: "#F3F6F8", fontWeight: 700, color: "#1D2226", borderBottom: "1px solid #E6E9EC" }}>
                <div>Title</div>
                <div>Category</div>
                <div>Views</div>
                <div>Created</div>
                <div>Actions</div>
              </div>
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 0.6fr 1fr 1fr",
                    padding: "14px 18px",
                    borderBottom: "1px solid #E6E9EC",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#1D2226", marginBottom: 4 }}>{resource.title}</div>
                    <div style={{ color: "#6B7280", fontSize: 14 }}>
                      {(resource.description || "").length > 110 ? `${resource.description.substring(0, 110)}...` : resource.description}
                    </div>
                  </div>
                  <div>
                    <span style={{ padding: "4px 10px", backgroundColor: "#E8F3FF", color: "#0A66C2", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                      {resource.category}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: "#1D2226" }}>{resource.views_count}</span>
                  </div>
                  <div>{formatDate(resource.createdAt)}</div>
                  <div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleEditClick(resource)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          backgroundColor: "#16A34A",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource._id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          backgroundColor: "#DC2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 18,
                    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                    transition: "transform .2s ease, box-shadow .2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3 style={{ margin: 0, color: "#1D2226", fontSize: 18, fontWeight: 700, flex: 1 }}>{resource.title}</h3>
                    <span style={{ padding: "4px 8px", backgroundColor: "#E8F3FF", color: "#0A66C2", borderRadius: 999, fontSize: 12, fontWeight: 700, marginLeft: 10 }}>
                      {resource.category}
                    </span>
                  </div>
                  <p style={{ color: "#6B7280", marginBottom: 12, lineHeight: 1.55 }}>
                    {(resource.description || "").length > 140 ? `${resource.description.substring(0, 140)}...` : resource.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: "#6B7280" }}>
                    <span>{resource.views_count} views</span>
                    <span>{formatDate(resource.createdAt)}</span>
                  </div>
                  {resource.tag && resource.tag.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                      {resource.tag.map((t, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px", backgroundColor: "#F3F6F8", color: "#1D2226", borderRadius: 999, fontSize: 12, border: "1px solid #E6E9EC" }}>
                          <Layers size={12} /> {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => handleEditClick(resource)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", backgroundColor: "#16A34A", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, flex: 1 }}
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, flex: 1 }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes spin {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }
`,
  styleSheet.cssRules.length
);

export default AdminAddResourcePage;
