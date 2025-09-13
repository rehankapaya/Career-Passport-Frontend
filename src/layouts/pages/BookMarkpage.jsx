import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useBookmark } from "../../hooks/useBookmark";
import { apiurl } from "../../api";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  FileText,
  Video,
  Briefcase,
  Book,
  Pin,
} from "lucide-react";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { getBookmarks } = useBookmark();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const raw = await getBookmarks(filter === "all" ? null : filter);
        const enriched = await Promise.all(
          (Array.isArray(raw) ? raw : []).map(async (b) => {
            try {
              let endpoint = "";
              if (b.itemType === "resource") endpoint = `${apiurl}/api/resources/${b.itemId}`;
              else if (b.itemType === "multimedia") endpoint = `${apiurl}/api/multimedia/${b.itemId}`;
              else if (b.itemType === "career") endpoint = `${apiurl}/api/careers/${b.itemId}`;
              else if (b.itemType === "story") endpoint = `${apiurl}/api/success-stories/${b.itemId}`;
              else return null;
              const res = await axios.get(endpoint, { validateStatus: () => true });
              if (!res || res.status >= 400 || !res.data) return null;
              const d = res.data;
              const displayTitle =
                b.itemType === "story" ? d.rname || d.title || null : d.title || null;
              if (!displayTitle) return null;
              return { ...b, displayTitle };
            } catch {
              return null;
            }
          })
        );
        if (active) setBookmarks(enriched.filter(Boolean));
      } catch {
        if (active) setBookmarks([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [filter, getBookmarks]);

  const getItemTypeIcon = (type) => {
    const common = { size: 18, style: { color: "#0A66C2" } };
    if (type === "resource") return <FileText {...common} />;
    if (type === "multimedia") return <Video {...common} />;
    if (type === "career") return <Briefcase {...common} />;
    if (type === "story") return <Book {...common} />;
    return <Pin {...common} />;
  };

  const chipStyles = (type) => ({
    backgroundColor:
      type === "resource"
        ? "rgba(10,102,194,0.10)"
        : type === "multimedia"
        ? "rgba(85,62,223,0.10)"
        : type === "career"
        ? "rgba(16,185,129,0.10)"
        : type === "story"
        ? "rgba(245,158,11,0.10)"
        : "rgba(107,114,128,0.10)",
    color:
      type === "resource"
        ? "#0A66C2"
        : type === "multimedia"
        ? "#553EDF"
        : type === "career"
        ? "#10B981"
        : type === "story"
        ? "#F59E0B"
        : "#6B7280",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getItemLink = (b) => {
    if (b.itemType === "resource") return `/resources/${b.itemId}`;
    if (b.itemType === "multimedia") return `/multimedia/${b.itemId}`;
    if (b.itemType === "career") return `/careers/${b.itemId}`;
    if (b.itemType === "story") return `/success-stories/${b.itemId}`;
    return "#";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F3F6F8",
          fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
          padding: "32px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ fontSize: 24, marginBottom: 12, color: "#0A66C2" }}>
              <Bookmark size={28} />
            </div>
            <p style={{ color: "#6B7280", margin: 0 }}>Loading your bookmarks…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F3F6F8",
        fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              backgroundColor: "#0A66C2",
              borderRadius: 12,
              padding: 10,
              display: "inline-block",
              marginBottom: 12,
              boxShadow: "0 8px 24px rgba(10,102,194,0.25)",
            }}
          >
            <BookmarkCheck size={28} color="#ffffff" />
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#1D2226",
              margin: 0,
              letterSpacing: 0.2,
            }}
          >
            My Bookmarks
          </h1>
          <p
            style={{
              color: "#6B7280",
              maxWidth: 680,
              margin: "8px auto 0",
              lineHeight: 1.6,
            }}
          >
            All your saved resources, multimedia, careers, and stories—tidy and easy to jump back into.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          {[
            { key: "all", label: "All", count: bookmarks.length },
            { key: "resource", label: "Resources", count: bookmarks.filter((b) => b.itemType === "resource").length },
            { key: "multimedia", label: "Multimedia", count: bookmarks.filter((b) => b.itemType === "multimedia").length },
            { key: "career", label: "Careers", count: bookmarks.filter((b) => b.itemType === "career").length },
            { key: "story", label: "Stories", count: bookmarks.filter((b) => b.itemType === "story").length },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              style={{
                backgroundColor: filter === opt.key ? "#0A66C2" : "#FFFFFF",
                color: filter === opt.key ? "#FFFFFF" : "#1D2226",
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid #E6E9EC",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {opt.label}
              <span
                style={{
                  backgroundColor: filter === opt.key ? "rgba(255,255,255,0.25)" : "#EEF3F8",
                  color: filter === opt.key ? "#FFFFFF" : "#6B7280",
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>

        {bookmarks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 0",
              background: "#FFFFFF",
              borderRadius: 12,
              border: "1px solid #E6E9EC",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12, color: "#0A66C2" }}>
              <Bookmark size={36} />
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#1D2226",
                margin: "0 0 8px 0",
              }}
            >
              No bookmarks yet
            </h3>
            <p style={{ color: "#6B7280", marginBottom: 20 }}>
              Save items you want to revisit, and they’ll show up here.
            </p>
            <Link
              to="/resources"
              style={{
                backgroundColor: "#0A66C2",
                color: "#FFFFFF",
                padding: "10px 16px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-block",
                fontWeight: 700,
              }}
            >
              Browse Resources
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {bookmarks.map((b) => (
              <div
                key={b._id || `${b.itemType}-${b.itemId}`}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  border: "1px solid #E6E9EC",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {getItemTypeIcon(b.itemType)}
                    <span style={chipStyles(b.itemType)}>{b.itemType}</span>
                  </div>
                  <ExternalLink size={16} color="#6B7280" />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#1D2226",
                      margin: "0 0 4px 0",
                      lineHeight: 1.35,
                    }}
                  >
                    {b.displayTitle}
                  </h3>
                  <p style={{ color: "#6B7280", fontSize: 12, margin: 0, letterSpacing: 0.2 }}>
                    ID: {b.itemId}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#6B7280",
                    fontSize: 14,
                    marginBottom: 8,
                  }}
                >
                  <Calendar size={14} />
                  <span>Saved {formatDate(b.createdAt)}</span>
                </div>

                <Link
                  to={getItemLink(b)}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#0A66C2",
                    color: "#FFFFFF",
                    padding: "8px 12px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  View Item
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
