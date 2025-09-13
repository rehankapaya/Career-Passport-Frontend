import React from "react";
import { Bookmark as BookmarkIcon, ExternalLink, Video as VideoIcon, FileText, BookOpen, CalendarDays } from "lucide-react";

export default function BookmarkedItemsPage() {
  const bookmarks = [
    { id: 1, title: "ReactJS Tutorial for Beginners", type: "Article", date: "2025-09-03", link: "#" },
    { id: 2, title: "Top 10 Career Paths in Tech", type: "Career Guide", date: "2025-09-07", link: "#" },
    { id: 3, title: "JavaScript ES6 Features", type: "Video", date: "2025-09-10", link: "#" },
  ];

  const primary = "#0A66C2";
  const primarySoft = "#E9F3FF";
  const text = "#1D2226";
  const subtext = "#6B7280";
  const border = "#E6E9EC";
  const cardBg = "#FFFFFF";
  const pageBg = "#F3F6F8";

  const getIcon = (type) => {
    if (/video/i.test(type)) return <VideoIcon size={18} style={{ color: primary }} />;
    if (/career|guide/i.test(type)) return <FileText size={18} style={{ color: primary }} />;
    return <BookOpen size={18} style={{ color: primary }} />;
  };

  return (
    <div style={{ background: pageBg, border: `1px solid ${border}`, borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ background: primarySoft, borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BookmarkIcon size={18} style={{ color: primary }} />
        </div>
        <h1 style={{ color: primary, margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>Bookmarked Items</h1>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
        {bookmarks.map((item) => (
          <li
            key={item.id}
            style={{
              padding: 16,
              border: `1px solid ${border}`,
              borderRadius: 12,
              backgroundColor: cardBg,
              display: "grid",
              gap: 10,
              transition: "transform .15s ease, box-shadow .15s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)")}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: primarySoft, borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 34 }}>
                  {getIcon(item.type)}
                </div>
                <h3 style={{ margin: 0, color: text, fontSize: 16, fontWeight: 700, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>{item.title}</h3>
              </div>
              <a
                href={item.link}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: primary,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${primary}`,
                  background: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = primary;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = primary;
                }}
              >
                View Item
                <ExternalLink size={16} />
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: primarySoft,
                  color: primary,
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {getIcon(item.type)}
                {item.type}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: subtext, fontSize: 13, fontWeight: 500 }}>
                <CalendarDays size={16} style={{ color: "#667085" }} />
                Saved on {item.date}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
