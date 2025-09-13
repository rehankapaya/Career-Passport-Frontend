import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { MessageSquare, CheckCircle2, XCircle, Pencil, Trash2, Send, Loader2, Inbox } from "lucide-react";

export default function FeedbackForm() {
  const apiurl = "http://localhost:5000";
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(UserContext);
  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const line = "#E6E9EC";

  useEffect(() => {
    if (user?._id) fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/feedback/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      if (res.data.success) setFeedbacks(res.data.feedbacks);
    } catch { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      if (editingId) {
        const res = await axios.put(`${apiurl}/api/feedback/${editingId}`, { category, message }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
        if (res.data.success) {
          setStatus("success");
          setEditingId(null);
          setMessage("");
          fetchFeedbacks();
        }
      } else {
        const res = await axios.post(`${apiurl}/api/feedback`, { user_id: user._id, category, message }, { withCredentials: true });
        if (res.data.success) {
          setStatus("success");
          setMessage("");
          fetchFeedbacks();
        }
      }
    } catch {
      setStatus("error");
    }
  };

  const handleEdit = (fb) => {
    setEditingId(fb._id);
    setCategory(fb.category);
    setMessage(fb.message);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${apiurl}/api/feedback/${id}`, { withCredentials: true });
      if (res.data.success) fetchFeedbacks();
    } catch { }
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "32px auto",
        padding: 24,
        backgroundColor: "#FFFFFF",
        border: "1px solid " + line,
        borderRadius: 16,
        boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        color: brandInk
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "#E9F3FF", border: "1px solid #D7E9FF", color: brandBlue }}>
          <MessageSquare size={22} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>{editingId ? "Edit Feedback" : "Submit Feedback"}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: brandInk, fontSize: 14 }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid " + line,
              borderRadius: 12,
              outline: "none",
              fontSize: 14,
              background: "#FAFBFC"
            }}
          >
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="general">General</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: brandInk, fontSize: 14 }}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share what's working, what's confusing, or what you'd love to see next."
            required
            style={{
              width: "100%",
              minHeight: 130,
              padding: 12,
              border: "1px solid " + line,
              borderRadius: 12,
              resize: "vertical",
              outline: "none",
              fontSize: 14,
              background: "#FFFFFF"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "12px 14px",
            backgroundColor: brandBlue,
            color: "#FFFFFF",
            fontWeight: 900,
            borderRadius: 12,
            border: "1px solid " + brandBlue,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            letterSpacing: 0.2,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background-color 120ms ease"
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
        >
          {status === "loading" ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={18} />}
          {status === "loading" ? "Submitting..." : editingId ? "Update Feedback" : "Submit Feedback"}
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </form>

      {status === "success" && (
        <div style={{ marginTop: 12, color: "#1A7F37", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 700 }}>
          <CheckCircle2 size={18} />
          <span>Feedback saved successfully</span>
        </div>
      )}
      {status === "error" && (
        <div style={{ marginTop: 12, color: "#B42318", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 700 }}>
          <XCircle size={18} />
          <span>Something went wrong. Please try again.</span>
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, color: brandInk }}>My Feedback</h3>
        {feedbacks.length === 0 ? (
          <div style={{ color: brandMute, display: "flex", alignItems: "center", gap: 8 }}>
            <Inbox size={18} />
            <span>No feedback submitted yet.</span>
          </div>
        ) : (
          feedbacks.map((fb) => (
            <div
              key={fb._id}
              style={{
                border: "1px solid " + line,
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 6px 18px rgba(0,0,0,0.04)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: "#E9F3FF",
                      color: brandBlue,
                      border: "1px solid #D7E9FF",
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800
                    }}
                  >
                    {fb.category}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleEdit(fb)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#FFFFFF",
                      color: brandInk,
                      border: "1px solid " + line,
                      borderRadius: 10,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 800
                    }}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fb._id)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#FFECEF",
                      color: "#B42318",
                      border: "1px solid #F7C2C7",
                      borderRadius: 10,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 800
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
              <p style={{ margin: "10px 0 0", color: brandMute, lineHeight: 1.55 }}>{fb.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
