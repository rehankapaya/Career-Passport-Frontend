import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiurl } from "../../api";
import { List, Grid2X2, Search, X, Trash2, Mail, Tag, Clock } from "lucide-react";

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      const filtered = feedbacks.filter(
        (f) =>
          f.message?.toLowerCase().includes(t) ||
          f.category?.toLowerCase().includes(t) ||
          f.user_id?.email?.toLowerCase().includes(t) ||
          f.status?.toLowerCase().includes(t)
      );
      setFilteredFeedbacks(filtered);
    } else {
      setFilteredFeedbacks(feedbacks);
    }
  }, [searchTerm, feedbacks]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiurl}/api/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setFeedbacks(res.data.data || []);
      setFilteredFeedbacks(res.data.data || []);
    } catch {
      setMessage("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiurl}/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Feedback deleted successfully!");
      fetchFeedbacks();
    } catch {
      setMessage("Failed to delete feedback");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiurl}/api/feedback/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Status updated successfully!");
      fetchFeedbacks();
    } catch {
      setMessage("Failed to update status");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div style={{ minHeight: "50vh", display: "flex", flexDirection: "column", gap: 12, alignItems: "center", justifyContent: "center", color: "#6B7280", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        <div style={{ width: 44, height: 44, border: "4px solid #E6E9EC", borderTop: "4px solid #0A66C2", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div>Loading feedbacks…</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, color: "#1D2226" }}>Feedback Management</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setViewMode("list")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", background: viewMode === "list" ? "#0A66C2" : "#F3F6F8", color: viewMode === "list" ? "#fff" : "#1D2226", border: "1px solid", borderColor: viewMode === "list" ? "#0A66C2" : "#E6E9EC", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>
            <List size={16} />
            List
          </button>
          <button onClick={() => setViewMode("grid")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", background: viewMode === "grid" ? "#0A66C2" : "#F3F6F8", color: viewMode === "grid" ? "#fff" : "#1D2226", border: "1px solid", borderColor: viewMode === "grid" ? "#0A66C2" : "#E6E9EC", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>
            <Grid2X2 size={16} />
            Grid
          </button>
        </div>
      </div>

      {message && (
        <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 600, background: message.toLowerCase().includes("success") ? "#E8F3FF" : "#FDE7E9", color: message.toLowerCase().includes("success") ? "#0A66C2" : "#B42318", border: `1px solid ${message.toLowerCase().includes("success") ? "#BBD7FF" : "#F2C2C0"}` }}>
          <span>{message}</span>
          <button onClick={() => setMessage("")} style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", display: "inline-flex" }}>
            <X size={18} />
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center", marginBottom: 18 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color="#6B7280" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search by message, category, email, or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 14px 12px 36px", border: "1px solid #E6E9EC", borderRadius: 10, outline: "none", fontSize: 15 }}
          />
        </div>
        <span style={{ color: "#6B7280", fontSize: 14 }}>{filteredFeedbacks.length} feedback(s) found</span>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, background: "#F3F6F8", borderRadius: 12, color: "#6B7280" }}>
          <h3 style={{ margin: 0, color: "#1D2226" }}>No feedbacks found</h3>
          <p style={{ marginTop: 6 }}>Try a different search</p>
        </div>
      ) : viewMode === "list" ? (
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 2fr 1fr 1fr 0.8fr", padding: "14px 18px", background: "#F3F6F8", color: "#1D2226", fontWeight: 700, borderBottom: "1px solid #E6E9EC" }}>
            <div>User</div>
            <div>Category</div>
            <div>Message</div>
            <div>Status</div>
            <div>Submitted</div>
            <div>Actions</div>
          </div>
          {filteredFeedbacks.map((f) => (
            <div key={f._id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 2fr 1fr 1fr 0.8fr", padding: "14px 18px", borderBottom: "1px solid #E6E9EC", alignItems: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#1D2226" }}>
                <Mail size={16} color="#6B7280" />
                <span>{f.user_id?.email}</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Tag size={16} color="#6B7280" />
                <span style={{ padding: "4px 10px", background: "#E8F3FF", color: "#0A66C2", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{f.category}</span>
              </div>
              <div style={{ color: "#374151" }}>{f.message}</div>
              <div>
                <select
                  value={f.status}
                  onChange={(e) => handleStatusUpdate(f._id, e.target.value)}
                  style={{ padding: 10, border: "1px solid #E6E9EC", borderRadius: 10, outline: "none", background: "#fff" }}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#6B7280" }}>
                <Clock size={16} />
                <span>{formatDate(f.submitted_at)}</span>
              </div>
              <div>
                <button
                  onClick={() => handleDelete(f._id)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#DC2626", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {filteredFeedbacks.map((f) => (
            <div key={f._id} style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 10px 24px rgba(0,0,0,0.06)", transition: "transform .2s ease, box-shadow .2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#1D2226", fontWeight: 700 }}>
                  <Mail size={16} color="#6B7280" />
                  <span>{f.user_id?.email}</span>
                </div>
                <span style={{ padding: "4px 8px", background: "#E8F3FF", color: "#0A66C2", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{f.category}</span>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.55, margin: "6px 0 12px" }}>{f.message}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#6B7280", fontSize: 14 }}>
                  <Clock size={16} />
                  <span>{formatDate(f.submitted_at)}</span>
                </div>
                <select
                  value={f.status}
                  onChange={(e) => handleStatusUpdate(f._id, e.target.value)}
                  style={{ padding: 10, border: "1px solid #E6E9EC", borderRadius: 10, outline: "none", background: "#fff" }}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <button
                onClick={() => handleDelete(f._id)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#DC2626", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

try {
  const sheet = document.styleSheets?.[0];
  if (sheet) {
    sheet.insertRule(`@keyframes spin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }`, sheet.cssRules.length);
  }
} catch {}

export default AdminFeedbackPage;
