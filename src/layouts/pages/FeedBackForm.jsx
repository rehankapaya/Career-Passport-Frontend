import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { apiurl } from "../../api";

export default function FeedbackForm() { // 🔹 apna backend ka base URL dalna
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(UserContext);

  // Load user feedbacks on mount
  useEffect(() => {
    if (user?._id) {
      fetchFeedbacks();
    }
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/feedback/${user._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      if (editingId) {
        // 🔹 Update feedback
        const res = await axios.put(
          `${apiurl}/api/feedback/${editingId}`,
          { category, message },
          { withCredentials: true }
        );
        if (res.data.success) {
          setStatus("success");
          setEditingId(null);
          setMessage("");
          fetchFeedbacks();
        }
      } else {
        // 🔹 Create feedback
        const res = await axios.post(
          `${apiurl}/api/feedback`,
          {
            user_id: user._id,
            category,
            message,
          },
          { withCredentials: true }
        );

        if (res.data.success) {
          setStatus("success");
          setMessage("");
          fetchFeedbacks();
        }
      }
    } catch (err) {
      console.error(err);
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
      const res = await axios.delete(`${apiurl}/api/feedback/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        fetchFeedbacks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        boxShadow:
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#1f2937",
        }}
      >
        {editingId ? "Edit Feedback" : "Submit Feedback"}
      </h2>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              outline: "none",
              fontSize: "0.95rem",
            }}
          >
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="general">General</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            required
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              resize: "vertical",
              outline: "none",
              fontSize: "0.95rem",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            fontWeight: "500",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          {status === "loading"
            ? "Submitting..."
            : editingId
            ? "Update Feedback"
            : "Submit Feedback"}
        </button>
      </form>

      {/* Status messages */}
      {status === "success" && (
        <p style={{ marginTop: "1rem", color: "green", textAlign: "center" }}>
          ✅ Feedback saved successfully!
        </p>
      )}
      {status === "error" && (
        <p style={{ marginTop: "1rem", color: "red", textAlign: "center" }}>
          ❌ Something went wrong. Please try again.
        </p>
      )}

      {/* Feedback List */}
      <div style={{ marginTop: "2rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#111827",
          }}
        >
          My Feedback
        </h3>
        {feedbacks.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No feedback submitted yet.</p>
        ) : (
          feedbacks.map((fb) => (
            <div
              key={fb._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#f9fafb",
              }}
            >
              <p style={{ margin: 0, fontWeight: "500" }}>
                Category: <span style={{ color: "#2563eb" }}>{fb.category}</span>
              </p>
              <p style={{ margin: "0.5rem 0" }}>{fb.message}</p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => handleEdit(fb)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    backgroundColor: "#f59e0b",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(fb._id)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    backgroundColor: "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
