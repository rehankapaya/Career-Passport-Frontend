import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../../api";

/* =========================
   LocalStorage Cache Utils
   ========================= */
const CACHE_KEY = "pending_success_stories_v1";

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

const idOf = (s) => String(s?.story_id || s?._id || "");

const removeFromList = (list, id) =>
  (Array.isArray(list) ? list : []).filter((x) => idOf(x) !== String(id));
/* ========================= */

export default function AdminSuccessStoriesPage() {
  const [pendingStories, setPendingStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'
  const [selectedStory, setSelectedStory] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Cache-first: load cached stories if present; otherwise call API
  useEffect(() => {
    const cached = readCache();
    if (cached && cached.length) {
      setPendingStories(cached);
    } else {
      fetchPendingStories();
    }
  }, []);

  const fetchPendingStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiurl}/api/success-stories/pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      const data = res.data || [];
      setPendingStories(data);
      writeCache(data); // sync cache
    } catch (err) {
      toast.error("Error fetching pending stories");
    }
    setLoading(false);
  };

  // Approve story (also update cache/state immediately)
  const handleApprove = async (story_id) => {
    try {
      await axios.put(
        `${apiurl}/api/success-stories/${story_id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      toast.success("Story approved!");
      // remove from current list + cache (no longer pending)
      const next = removeFromList(pendingStories, story_id);
      setPendingStories(next);
      writeCache(next);
      setIsDetailModalOpen(false);
      setSelectedStory(null);
    } catch (err) {
      toast.error("Error approving story");
    }
  };

  // Reject story (also update cache/state immediately)
  const handleReject = async (story_id) => {
    try {
      await axios.delete(`${apiurl}/api/success-stories/${story_id}/reject`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      toast.success("Story rejected!");
      // remove from current list + cache (no longer pending)
      const next = removeFromList(pendingStories, story_id);
      setPendingStories(next);
      writeCache(next);
      setIsDetailModalOpen(false);
      setSelectedStory(null);
    } catch (err) {
      toast.error("Error rejecting story");
    }
  };

  // View story details
  const handleViewDetails = (story) => {
    setSelectedStory(story);
    setIsDetailModalOpen(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Pending Success Stories</h1>
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
      </div>

      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading pending stories...</p>
        </div>
      )}

      {!loading && pendingStories.length === 0 && (
        <div style={styles.emptyState}>
          <h3>No pending stories</h3>
          <p>New submissions will appear here for review.</p>
        </div>
      )}

      {!loading && pendingStories.length > 0 && (viewMode === "grid" ? (
        <div style={styles.gridContainer}>
          {pendingStories.map((story) => (
            <div key={idOf(story)} style={styles.gridCard}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                {story.image_url && (
                  <img
                    src={`${apiurl}/${String(story.image_url).replace(/\\/g, "/")}`}
                    alt="Story"
                    style={{ width: 80, height: 80, borderRadius: "10px", objectFit: "cover" }}
                  />
                )}
                <div>
                  <h3 style={{ margin: 0, color: "#2c3e50" }}>{story.rname}</h3>
                  {story.domain && <span style={styles.categoryBadge}>{story.domain}</span>}
                </div>
              </div>

              {story.story_text && <p style={styles.cardDescription}>{story.story_text}</p>}

              <div style={styles.cardActions}>
                <button onClick={() => handleApprove(idOf(story))} style={styles.cardEditButton}>
                  Approve
                </button>
                <button onClick={() => handleReject(idOf(story))} style={styles.cardDeleteButton}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.listContainer}>
          <div style={styles.tableHeader}>
            <div style={styles.tableCell}>Image</div>
            <div style={styles.tableCell}>User</div>
            <div style={styles.tableCell}>Domain</div>
            <div style={styles.tableCell}>Story</div>
            <div style={styles.tableCell}>Actions</div>
          </div>
          {pendingStories.map((story) => (
            <div key={idOf(story)} style={styles.tableRow}>
              <div style={styles.tableCell}>
                {story.image_url ? (
                  <img
                    src={`${apiurl}/${String(story.image_url).replace(/\\/g, "/")}`}
                    alt="Story"
                    style={styles.thumbnailImage}
                  />
                ) : (
                  <div style={styles.noImagePlaceholder}>No Image</div>
                )}
              </div>
              <div style={styles.tableCell}>{story.rname}</div>
              <div style={styles.tableCell}>
                {story.domain && <span style={styles.categoryBadge}>{story.domain}</span>}
              </div>
              <div style={styles.tableCell}>
                <div style={{ color: "#6c757d" }}>
                  {story.story_text && story.story_text.length > 140
                    ? `${story.story_text.substring(0, 140)}...`
                    : story.story_text || ""}
                </div>
              </div>
              <div style={styles.tableCell}>
                <div style={styles.actionButtons}>
                  <button onClick={() => handleViewDetails(story)} style={styles.viewActionButton}>
                    View
                  </button>
                  <button onClick={() => handleApprove(idOf(story))} style={styles.cardEditButton}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(idOf(story))} style={styles.cardDeleteButton}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedStory && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Story Details</h3>
              <button onClick={() => setIsDetailModalOpen(false)} style={styles.modalCloseButton}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              {selectedStory.image_url && (
                <div style={styles.modalImageContainer}>
                  <img
                    src={`${apiurl}/${String(selectedStory.image_url).replace(/\\/g, "/")}`}
                    alt="Story"
                    style={styles.modalImage}
                  />
                </div>
              )}
              <div style={styles.modalInfo}>
                <h4 style={styles.modalTitle}>{selectedStory.rname}</h4>
                {selectedStory.domain && <span style={styles.categoryBadge}>{selectedStory.domain}</span>}
                <p style={styles.modalStoryText}>{selectedStory.story_text}</p>
              </div>
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => handleApprove(idOf(selectedStory))} style={styles.cardEditButton}>
                Approve
              </button>
              <button onClick={() => handleReject(idOf(selectedStory))} style={styles.cardDeleteButton}>
                Reject
              </button>
              <button onClick={() => setIsDetailModalOpen(false)} style={styles.cancelButton}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" },
  viewControls: { display: "flex", gap: "8px" },
  viewButton: { padding: "8px 16px", backgroundColor: "#f8f9fa", color: "#6c757d", border: "1px solid #e9ecef", borderRadius: "6px", cursor: "pointer", fontWeight: "500", transition: "all 0.3s ease" },
  activeViewButton: { backgroundColor: "#4b6cb7", color: "white", borderColor: "#4b6cb7" },
  pageTitle: { color: "#2c3e50", margin: "0" },
  loadingContainer: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "30vh", color: "#666", marginBottom: "20px" },
  spinner: { width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #4b6cb7", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "15px" },
  emptyState: { textAlign: "center", padding: "40px", color: "#6c757d", backgroundColor: "#f8f9fa", borderRadius: "8px" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" },
  gridCard: { backgroundColor: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", transition: "transform 0.2s ease, box-shadow 0.2s ease" },
  cardDescription: { color: "#6c757d", marginBottom: "15px", lineHeight: "1.5" },
  categoryBadge: { padding: "4px 10px", backgroundColor: "#e7f3ff", color: "#007bff", borderRadius: "12px", fontSize: "12px", fontWeight: "500", display: "inline-block", marginTop: "6px" },
  cardActions: { display: "flex", gap: "10px" },
  cardEditButton: { padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", flex: "1", transition: "background-color 0.3s ease" },
  cardDeleteButton: { padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", flex: "1", transition: "background-color 0.3s ease" },
  listContainer: { backgroundColor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
  tableHeader: { display: "grid", gridTemplateColumns: "80px 1fr 1fr 2fr 1fr", padding: "15px 20px", backgroundColor: "#f8f9fa", fontWeight: "600", color: "#495057", borderBottom: "1px solid #e9ecef" },
  tableRow: { display: "grid", gridTemplateColumns: "80px 1fr 1fr 2fr 1fr", padding: "15px 20px", borderBottom: "1px solid #e9ecef", alignItems: "center", transition: "background-color 0.2s ease" },
  tableCell: { padding: "0 10px" },
  actionButtons: { display: "flex", gap: "10px" },
  viewActionButton: { padding: "6px 12px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", transition: "background-color 0.3s ease" },
  thumbnailImage: { width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e9ecef" },
  noImagePlaceholder: { width: "60px", height: "60px", borderRadius: "8px", backgroundColor: "#f8f9fa", border: "1px solid #e9ecef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#6c757d" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modalContent: { backgroundColor: "white", borderRadius: "12px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e9ecef" },
  modalCloseButton: { background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6c757d", padding: "0", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" },
  modalBody: { padding: "24px" },
  modalImageContainer: { marginBottom: "20px", textAlign: "center" },
  modalImage: { maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", objectFit: "cover", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" },
  modalInfo: { marginBottom: "20px" },
  modalTitle: { margin: "0 0 12px 0", color: "#2c3e50", fontSize: "20px" },
  modalStoryText: { color: "#6c757d", lineHeight: "1.6", margin: "16px 0 0 0" },
  modalActions: { display: "flex", gap: "12px", padding: "20px 24px", borderTop: "1px solid #e9ecef", justifyContent: "flex-end" },
  cancelButton: { padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", transition: "background-color 0.3s ease" },
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
