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
  const menuItems = [
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
        width: "250px",
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: "1rem 0",
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          fontWeight: "600",
          fontSize: "1.2rem",
          padding: "0 1rem 1rem 1rem",
          borderBottom: "1px solid #f3f4f6",
          marginBottom: "1rem",
        }}
      >
        User Menu
      </div>

      {/* Menu Items */}
      <div style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <SidebarItem key={item.label} icon={item.icon} label={item.label} to={item.to} />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        cursor: "pointer",
        background: isActive ? "#f0f9ff" : "transparent",
        color: isActive ? "#2563eb" : "#374151",
        borderLeft: isActive ? "3px solid #2563eb" : "3px solid transparent",
        fontWeight: isActive ? "600" : "400",
        textDecoration: "none",
      })}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
