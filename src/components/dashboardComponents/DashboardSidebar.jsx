import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  Video,
  Trophy,
  MessageSquare,
  Settings,
  Bookmark,
  Menu
} from "lucide-react";

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const brand = "#0A66C2";
  const deep = "#004182";
  const ink = "#1D2226";
  const haze = "#F3F6F8";
  const line = "#E6E9EC";

  const items = [
    { to: "", label: "Dashboard", icon: <Home size={18} />, exact: true },
    { to: "admincareerbank", label: "Career Bank", icon: <Briefcase size={18} /> },
    { to: "quiz", label: "Quiz History", icon: <FileText size={18} /> },
    { to: "adminmultimedia", label: "Multimedia", icon: <Video size={18} /> },
    { to: "adminsuccessstories", label: "Success Stories", icon: <Trophy size={18} /> },
    { to: "addresource", label: "Resources", icon: <Bookmark size={18} /> },
    { to: "adminfeedback", label: "Feedback", icon: <MessageSquare size={18} /> },
  ];

  const baseItem = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    textDecoration: "none",
    color: ink,
    borderRadius: 10,
    transition: "background .15s ease,border-color .15s ease,color .15s ease",
  };
  
  const activeItem = {
    border: "1px solid transparent",
    background: "#E9F1FF",
    borderColor: "#D0E6FB",
    color: brand,
    fontWeight: 800
  };

  const labelStyle = {
    opacity: collapsed ? 0 : 1,
    transition: "opacity .2s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontWeight: 600,
    fontSize: 14
  };

  const iconWrap = {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: haze,
    color: deep,
    boxShadow: "inset 0 0 0 1px " + line
  };

  return (
    <aside
      style={{
        width: collapsed ? 64 : 260,
        background: "linear-gradient(180deg,#F3F6F8 0%,#FFFFFF 55%)",
        height: "100vh",
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: 12,
        transition: "width .25s ease",
        overflow: "hidden",
        fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        color: ink,
        borderRight: "1px solid " + line,
        position: "sticky",
        top: 0
      }}
    >
      <div
        style={{
          padding: "6px 8px 10px",
          marginBottom: 8,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <button
          onClick={() => setCollapsed((s) => !s)}
          style={{
            background: haze,
            border: "1px solid " + line,
            cursor: "pointer",
            padding: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: brand,
            borderRadius: 10
          }}
        >
          <Menu size={18} />
        </button>
      </div>

      <nav style={{ display: "grid", gap: 6, flexGrow: 1 }}>
        {items.map((it, i) =>
          it.divider ? (
            <div key={"d"+i} style={{ height: 1, background: line, margin: "8px 6px" }} />
          ) : (
            <NavLink
              key={it.to || i}
              to={it.to}
              end={it.exact || false}
              style={({ isActive }) => ({ ...baseItem, ...(isActive ? activeItem : {}) })}
            >
              <span style={iconWrap}>{it.icon}</span>
              <span style={labelStyle}>{it.label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div
        style={{
          marginTop: "auto",
          padding: 8,
          color: "#56687A",
          fontSize: 12,
          textAlign: collapsed ? "center" : "left"
        }}
      >
        <span style={{ opacity: 0.9 }}>made for you</span>
      </div>
    </aside>
  );
}
