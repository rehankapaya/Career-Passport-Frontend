import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Clock,
  ListChecks,
  Bookmark,
  Briefcase,
  FileText,
  Video,
  TrendingUp,
  Star,
} from "lucide-react";

export default function UserSidebar() {
  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const ink = "#1D2226";
  const mute = "#56687A";
  const line = "#E6E9EC";
  const items = [
    { icon: <Home size={18} />, label: "Dashboard", to: "/user-dashboard" },
    { icon: <Clock size={18} />, label: "Recent Activity", to: "/user-dashboard/recent-activity" },
    { icon: <ListChecks size={18} />, label: "Quiz Results", to: "/user-dashboard/quiz-result" },
    { icon: <Bookmark size={18} />, label: "Bookmarked Items", to: "/user-dashboard/book-mark" },
    { icon: <Briefcase size={18} />, label: "Recommended Careers", to: "/user-dashboard/recommended-career" },
    { icon: <FileText size={18} />, label: "Recommended Content", to: "/user-dashboard/recommended-content" },
    { icon: <Video size={18} />, label: "Recommended Videos", to: "/user-dashboard/recommended-videos" },
    { icon: <TrendingUp size={18} />, label: "Trending Careers", to: "/user-dashboard/trending-career" },
    { icon: <Star size={18} />, label: "Top Picks for You", to: "/user-dashboard/top-pick" },
  ];

  return (
    <div
      style={{
        width: 260,
        minHeight: "100vh",
        background: "#FFFFFF",
        border: "1px solid " + line,
        borderRadius: 12,
        padding: "12px 8px",
        position: "sticky",
        top: 16,
        alignSelf: "start",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid " + line,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 18,
            color: ink,
            letterSpacing: 0.2,
          }}
        >
          Your Space
        </div>
        <div style={{ color: mute, fontSize: 12, marginTop: 2 }}>
          quick links for your stuff
        </div>
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        {items.map((m) => (
          <NavLink
            key={m.label}
            to={m.to}
            end
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              textDecoration: "none",
              borderRadius: 10,
              border: "1px solid " + (isActive ? "#D0E6FB" : "transparent"),
              background: isActive ? "#E9F1FF" : "transparent",
              color: isActive ? brandBlue : ink,
              fontWeight: isActive ? 800 : 500,
              transition: "background .15s ease,border-color .15s ease,color .15s ease",
            })}
            onMouseEnter={(e) => {
              const a = e.currentTarget;
              if (a.getAttribute("data-active") !== "true") {
                a.style.background = "#F7F9FB";
                a.style.borderColor = line;
              }
            }}
            onMouseLeave={(e) => {
              const a = e.currentTarget;
              if (a.getAttribute("data-active") !== "true") {
                a.style.background = "transparent";
                a.style.borderColor = "transparent";
              }
            }}
            data-active={undefined}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F3F6F8",
                color: brandDeep,
              }}
            >
              {m.icon}
            </span>
            <span style={{ fontSize: 14 }}>{m.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
