import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiurl } from "../../api";

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list or grid

  // Fetch feedbacks on mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Filter on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = feedbacks.filter(
        (f) =>
          f.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.status.toLowerCase().includes(searchTerm.toLowerCase())
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
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
    } catch (err) {
      setMessage("Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <p>Loading feedbacks...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Feedback Management</h1>
        <div style={styles.viewControls}>
          <button
            onClick={() => setViewMode("list")}
            style={{
              ...styles.viewButton,
              ...(viewMode === "list" ? styles.activeViewButton : {}),
            }}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              ...styles.viewButton,
              ...(viewMode === "grid" ? styles.activeViewButton : {}),
            }}
          >
            Grid View
          </button>
        </div>
      </div>

      {message && (
        <div
          style={{
            ...styles.message,
            ...(message.includes("success")
              ? styles.successMessage
              : styles.errorMessage),
          }}
        >
          {message}
          <button onClick={() => setMessage("")} style={styles.messageClose}>
            ×
          </button>
        </div>
      )}

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search feedbacks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.resourceCount}>
          {filteredFeedbacks.length} feedback(s) found
        </span>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No feedbacks found</h3>
        </div>
      ) : viewMode === "list" ? (
        <div style={styles.listContainer}>
          <div style={styles.tableHeader}>
            <div style={styles.tableCell}>User</div>
            <div style={styles.tableCell}>Category</div>
            <div style={styles.tableCell}>Message</div>
            <div style={styles.tableCell}>Status</div>
            <div style={styles.tableCell}>Submitted</div>
            <div style={styles.tableCell}>Actions</div>
          </div>
          {filteredFeedbacks.map((f) => (
            <div key={f._id} style={styles.tableRow}>
              <div style={styles.tableCell}>{f.user_id?.email}</div>
              <div style={styles.tableCell}>{f.category}</div>
              <div style={styles.tableCell}>{f.message}</div>
              <div style={styles.tableCell}>
                <select
                  value={f.status}
                  onChange={(e) => handleStatusUpdate(f._id, e.target.value)}
                  style={styles.input}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div style={styles.tableCell}>{formatDate(f.submitted_at)}</div>
              <div style={styles.tableCell}>
                <button
                  onClick={() => handleDelete(f._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.gridContainer}>
          {filteredFeedbacks.map((f) => (
            <div key={f._id} style={styles.gridCard}>
              <h3>{f.user_id?.email}</h3>
              <p>
                <strong>Category:</strong> {f.category}
              </p>
              <p>{f.message}</p>
              <p>
                <strong>Status:</strong>{" "}
                <select
                  value={f.status}
                  onChange={(e) => handleStatusUpdate(f._id, e.target.value)}
                  style={styles.input}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </p>
              <p>
                <strong>Submitted:</strong> {formatDate(f.submitted_at)}
              </p>
              <button
                onClick={() => handleDelete(f._id)}
                style={styles.cardDeleteButton}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  pageTitle: {
    color: '#2c3e50',
    margin: '0'
  },
  viewControls: {
    display: 'flex',
    gap: '8px'
  },
  viewButton: {
    padding: '8px 16px',
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  activeViewButton: {
    backgroundColor: '#4b6cb7',
    color: 'white',
    borderColor: '#4b6cb7'
  },
  message: {
    padding: '12px 20px',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '500'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  messageClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'inherit'
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  searchInput: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    minWidth: '300px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  resourceCount: {
    color: '#6c757d',
    fontSize: '14px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 2fr 1fr 1fr 1fr',
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#495057',
    borderBottom: '1px solid #e9ecef'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 2fr 1fr 1fr 1fr',
    padding: '15px 20px',
    borderBottom: '1px solid #e9ecef',
    alignItems: 'center',
    transition: 'background-color 0.2s ease'
  },
  tableCell: {
    padding: '0 10px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  gridCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  cardDeleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease'
  }
};

export default AdminFeedbackPage;
