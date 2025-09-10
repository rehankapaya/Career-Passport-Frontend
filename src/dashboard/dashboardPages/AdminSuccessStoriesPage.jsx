import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../../api";
; // Adjust if needed

export default function AdminSuccessStoriesPage() {
  const [pendingStories, setPendingStories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending stories (not approved)
  useEffect(() => {
    fetchPendingStories();
  }, []);

  const fetchPendingStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiurl}/api/success-stories/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setPendingStories(res.data);
    } catch (err) {
      toast.error("Error fetching pending stories");
    }
    setLoading(false);
  };

  // Approve story
  const handleApprove = async (story_id) => {
    try {
      await axios.put(`${apiurl}/api/success-stories/${story_id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      toast.success("Story approved!");
      fetchPendingStories();
    } catch (err) {
      toast.error("Error approving story");
    }
  };

  // Reject story
  const handleReject = async (story_id) => {
    try {
      await axios.delete(`${apiurl}/api/success-stories/${story_id}/reject`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      toast.success("Story rejected!");
      fetchPendingStories();
    } catch (err) {
      toast.error("Error rejecting story");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Pending Success Stories</h2>
      {loading && <p>Loading...</p>}
      {pendingStories.length === 0 && !loading && <p>No pending stories.</p>}
      {pendingStories.map(story => (
        <div key={story.story_id} style={{
          background: "#fff", padding: 24, borderRadius: 12, marginBottom: 32, boxShadow: "0 2px 8px #dfe6e9"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {story.image_url &&
              <img
                src={`http://localhost:5000/${story.image_url.replace(/\\/g, "/")}`}
                alt="Story"
                style={{ width: 80, height: 80, borderRadius: "10px", objectFit: "cover" }}
              />
            }
            <div>
              <h3 style={{ margin: 0 }}>{story.rname}</h3>
              <span style={{
                background: "#dff9fb", color: "#0984e3", padding: "2px 12px", borderRadius: "999px",
                fontSize: "0.95rem", marginBottom: 8, display: "inline-block"
              }}>{story.domain}</span>
            </div>
          </div>
          <p style={{ marginTop: 16 }}>{story.story_text}</p>
          <div style={{ marginTop: 18, display: "flex", gap: 16 }}>
            <button
              onClick={() => handleApprove(story.story_id)}
              style={{
                background: "#00b894", color: "#fff", padding: "8px 24px", borderRadius: "8px",
                border: "none", fontWeight: "bold", cursor: "pointer"
              }}
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(story.story_id)}
              style={{
                background: "#d63031", color: "#fff", padding: "8px 24px", borderRadius: "8px",
                border: "none", fontWeight: "bold", cursor: "pointer"
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}