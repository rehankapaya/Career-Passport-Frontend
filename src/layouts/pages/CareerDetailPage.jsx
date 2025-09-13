import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useBookmark } from "../../hooks/useBookmark";
import { Bookmark, BookmarkCheck, ArrowLeft, Briefcase, GraduationCap, CircleDollarSign, Tag } from "lucide-react";

export default function CareerDetailPage() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isBookmarked, loading: bookmarkLoading, toggleBookmark } = useBookmark("career", id);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`http://localhost:5000/api/careers/${id}`);
        setCareer(response.data);
      } catch {
        setError("Failed to fetch career. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const line = "#E6E9EC";

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif", color: brandInk }}>
        <p>Loading career details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: brandInk, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        <h3 style={{ margin: 0, marginBottom: 12 }}>{error}</h3>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 16px",
            background: brandBlue,
            color: "white",
            border: "1px solid " + brandBlue,
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 800
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!career) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif", color: brandInk }}>
        <h3 style={{ margin: 0, marginBottom: 6 }}>Career not found</h3>
        <p style={{ color: brandMute, margin: 0 }}>The requested career could not be found.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif", color: brandInk }}>
      <button
        onClick={() => window.history.back()}
        style={{
          background: brandBlue,
          color: "white",
          border: "1px solid " + brandBlue,
          padding: "10px 14px",
          borderRadius: 12,
          cursor: "pointer",
          marginBottom: "1rem",
          fontWeight: 800,
          display: "inline-flex",
          alignItems: "center",
          gap: 8
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
      >
        <ArrowLeft size={18} />
        Back to Careers
      </button>

      <div
        style={{
          border: "1px solid " + line,
          borderRadius: 16,
          padding: "2rem",
          boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
          background: "white"
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "#E9F3FF", border: "1px solid #D7E9FF", color: brandBlue }}>
                <Briefcase size={20} />
              </div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, lineHeight: 1.2 }}>{career.title}</h1>
            </div>
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              style={{
                background: "none",
                border: "1px solid " + line,
                cursor: bookmarkLoading ? "not-allowed" : "pointer",
                padding: "10px 12px",
                borderRadius: 12,
                color: isBookmarked ? "#F59E0B" : brandMute,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 800
              }}
              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              <span style={{ fontSize: 14 }}>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
          </div>
          <p style={{ marginTop: 10, color: brandMute, lineHeight: 1.7 }}>{career.description}</p>
        </div>

        <div style={{ lineHeight: 1.7, color: brandInk }}>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontWeight: 800 }}>
              <Tag size={16} style={{ color: brandBlue }} />
              <h3 style={{ fontSize: 16, margin: 0 }}>Domain</h3>
            </div>
            <p style={{ margin: 0, color: brandMute }}>{career.domain}</p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontWeight: 800 }}>
              <Tag size={16} style={{ color: brandBlue }} />
              <h3 style={{ fontSize: 16, margin: 0 }}>Required Skills</h3>
            </div>
            {career.required_skills && career.required_skills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {career.required_skills.map((skill, idx) => (
                  <span key={idx} style={{ backgroundColor: "#E9F3FF", color: brandBlue, padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, border: "1px solid #D7E9FF" }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: brandMute }}>No skills listed</p>
            )}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontWeight: 800 }}>
              <GraduationCap size={16} style={{ color: brandBlue }} />
              <h3 style={{ fontSize: 16, margin: 0 }}>Education Path</h3>
            </div>
            <p style={{ margin: 0, color: brandMute }}>{career.education_path}</p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontWeight: 800 }}>
              <CircleDollarSign size={16} style={{ color: brandBlue }} />
              <h3 style={{ fontSize: 16, margin: 0 }}>Expected Salary</h3>
            </div>
            <p style={{ margin: 0, color: brandInk }}>${Number(career.expected_salary || 0).toLocaleString()}</p>
          </div>
        </div>

        <div style={{ marginTop: "2rem", borderTop: "1px solid " + line, paddingTop: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, marginBottom: 8 }}>Details</h3>
          <p style={{ margin: 0, color: brandMute }}>
            <span style={{ fontWeight: 800, color: brandInk }}>Career ID:</span> {career.career_id}
          </p>
          <p style={{ margin: 0, color: brandMute }}>
            <span style={{ fontWeight: 800, color: brandInk }}>Database ID:</span> {career._id}
          </p>
        </div>
      </div>
    </div>
  );
}
