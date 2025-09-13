import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { apiurl } from "../../api";
import { Link } from "react-router-dom";
import { useBookmark } from "../../hooks/useBookmark";
import { Bookmark, BookmarkCheck, FileText, CalendarDays, Wrench, Lightbulb, BookOpen } from "lucide-react";
import { UserContext } from "../../context/UserContext";

const ResourceCard = ({ resource }) => {
  const { isBookmarked, loading, toggleBookmark } = useBookmark("resource", resource.resource_id);
  const { user } = useContext(UserContext);
  const brandBlue = "#0A66C2";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const chipBg = "#E9F3FF";

  const formattedDate = resource?.createdAt
    ? new Date(resource.createdAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "N/A";

  async function saveHistory() {
    try {
      const payload = {
        userId: user._id,
        categoryType: "resources",
        itemId: resource._id || resource.resource_id || resource.career_id,
        title: resource.title,
        subCategory: resource.category || null,
        meta: resource
      };
      await axios.post(`${apiurl}/api/history`, payload);
    } catch {}
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        transition: "transform 120ms ease",
        minHeight: 320
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <button
        onClick={toggleBookmark}
        disabled={loading}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "rgba(255,255,255,0.95)",
          border: "1px solid #E6E9EC",
          cursor: loading ? "not-allowed" : "pointer",
          padding: 8,
          borderRadius: 10,
          color: isBookmarked ? "#FFC107" : "#7A8A99",
          transition: "all 120ms ease",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>

      <div style={{ flexGrow: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: brandMute, fontSize: 13, marginBottom: 10 }}>
          <CalendarDays size={16} />
          <span>{formattedDate}</span>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ backgroundColor: chipBg, color: brandBlue, border: "1px solid #D7E9FF", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
            <FileText size={14} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
            Resource
          </div>
          {resource.category && (
            <div style={{ backgroundColor: "#EEF3F8", color: brandMute, border: "1px solid #E6E9EC", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
              {resource.category}
            </div>
          )}
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 800, color: brandInk, marginBottom: 6, lineHeight: 1.35 }}>{resource.title}</h3>

        <p style={{ color: brandMute, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{resource.description}</p>
      </div>

      <div style={{ marginTop: "auto" }}>
        <Link
          onClick={saveHistory}
          to={`/resources/${resource.resource_id}`}
          style={{
            backgroundColor: brandBlue,
            color: "#FFFFFF",
            padding: "12px 14px",
            borderRadius: 10,
            cursor: "pointer",
            border: "1px solid #0A66C2",
            textDecoration: "none",
            display: "block",
            textAlign: "center",
            fontWeight: 800,
            letterSpacing: 0.2,
            transition: "transform 120ms ease, background-color 120ms ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#004182")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
        >
          Read article
        </Link>
      </div>
    </div>
  );
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const brandBlue = "#0A66C2";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";

  const featuredResources = [
    { title: "Career Planning Toolkit", description: "Guides and worksheets to map your path with clarity." },
    { title: "Industry Insights Hub", description: "Trends, skills demand, and opportunities in one glance." },
    { title: "Skill Development Center", description: "Curated learning paths to build in-demand skills." }
  ];

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${apiurl}/api/resources`);
      setResources(response.data);
    } catch {}
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F3F2EF", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", padding: 24, color: brandInk }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 14, background: "linear-gradient(90deg,#0A66C2,#004182)", color: "#FFFFFF", marginBottom: 12, boxShadow: "0 8px 24px rgba(10,102,194,0.25)" }}>
            <BookOpen size={26} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: brandInk, marginBottom: 8 }}>Your Career Resources</h1>
          <p style={{ color: brandMute, maxWidth: 680, margin: "0 auto" }}>
            Handpicked articles and tools to keep you moving forward—clear, practical, and made for busy schedules.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
          {resources.map((r, i) => (
            <ResourceCard key={i} resource={r} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button
            style={{
              backgroundColor: "#EEF3F8",
              color: brandInk,
              padding: "12px 24px",
              borderRadius: 12,
              border: "1px solid #E6E9EC",
              cursor: "pointer",
              fontWeight: 800,
              letterSpacing: 0.2,
              transition: "transform 120ms ease, background-color 120ms ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E6EEF5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EEF3F8")}
          >
            Load more
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: brandInk, marginBottom: 6 }}>Featured Resources</h2>
          <p style={{ color: brandMute }}>Short, useful picks to jump right in</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {featuredResources.map((r, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                textAlign: "center",
                transition: "transform 120ms ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 14, background: "#E9F3FF", color: brandBlue, border: "1px solid #D7E9FF", marginBottom: 12 }}>
                {i === 0 && <Wrench size={24} />}
                {i === 1 && <Lightbulb size={24} />}
                {i === 2 && <BookOpen size={24} />}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: brandInk, marginBottom: 6 }}>{r.title}</h3>
              <p style={{ color: brandMute, fontSize: 14, marginBottom: 16 }}>{r.description}</p>
              <button
                style={{
                  backgroundColor: "#FFFFFF",
                  color: brandBlue,
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid " + brandBlue,
                  cursor: "pointer",
                  fontWeight: 800,
                  transition: "all 120ms ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = brandBlue;
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = brandBlue;
                }}
              >
                {i === 0 && "Explore toolkit"}
                {i === 1 && "View insights"}
                {i === 2 && "Start learning"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
