import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useBookmark } from "../../hooks/useBookmark";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function CareerDetailPage() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Bookmark functionality
  const { isBookmarked, loading: bookmarkLoading, toggleBookmark } =
    useBookmark("career", id);

  useEffect(() => {
    fetchCareer();
  }, [id]);

  const fetchCareer = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `http://localhost:5000/api/careers/${id}`
      );
      setCareer(response.data);
    } catch (error) {
      setError("Failed to fetch career. Please try again.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Loading career details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
        <h3>{error}</h3>
        <button
          onClick={fetchCareer}
          style={{
            padding: "0.5rem 1rem",
            background: "#3B82F6", // light blue
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!career) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h3>Career not found</h3>
        <p>The requested career could not be found.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{
          background: "#3B82F6", // light blue
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "1rem",
          fontWeight: "500",
        }}
      >
        ← Back to Careers
      </button>

      {/* Main Card */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
          background: "white",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700" }}>
              {career.title}
            </h1>
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              style={{
                background: "none",
                border: "none",
                cursor: bookmarkLoading ? "not-allowed" : "pointer",
                padding: "0.5rem",
                borderRadius: "6px",
                color: isBookmarked ? "#f59e0b" : "#6b7280",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {isBookmarked ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
              <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </span>
            </button>
          </div>
          <p style={{ marginTop: "0.5rem", color: "#4B5563", lineHeight: "1.6" }}>
            {career.description}
          </p>
        </div>

        {/* Content */}
        <div style={{ lineHeight: "1.7", color: "#374151" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Domain</h3>
            <p>{career.domain}</p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
              Required Skills
            </h3>
            {career.required_skills && career.required_skills.length > 0 ? (
              <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
                {career.required_skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No skills listed</p>
            )}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
              Education Path
            </h3>
            <p>{career.education_path}</p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
              Expected Salary
            </h3>
            <p>${career.expected_salary.toLocaleString()}</p>
          </div>
        </div>

        {/* Metadata */}
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Details</h3>
          <p>
            <strong>Career ID:</strong> {career.career_id}
          </p>
          <p>
            <strong>Database ID:</strong> {career._id}
          </p>
        </div>
      </div>
    </div>
  );
}
