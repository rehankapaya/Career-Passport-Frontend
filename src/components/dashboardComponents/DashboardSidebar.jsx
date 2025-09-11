import React, { useState } from "react";
import {
  Home,
  Briefcase,
  FileText,
  Video,
  Trophy,
  Bookmark,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? "60px" : "250px",
        backgroundColor: "#fff",
        height: "100vh",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Toggle Button */}
      <div
        style={{
          padding: "0 20px 10px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            display: "flex",
            alignItems: "center",
            color: "#555",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav
        style={{
          flexGrow: "1",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Link
          to="dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#007bff",
            textDecoration: "none",
            backgroundColor: "#e6f0ff",
            borderLeft: "4px solid #007bff",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <Home size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Dashboard
          </span>
        </Link>
        <Link
          to="careers"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <Briefcase size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Career Bank
          </span>
        </Link>
        <Link
          to="quiz"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <FileText size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Interest Quiz
          </span>
        </Link>
        <Link
          to="adminmultimedia"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <Video size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Multimedia
          </span>
        </Link>
        <Link
          to="adminsuccessstories"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <Trophy size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Success Stories
          </span>
        </Link>
        <Link
          to="add-resource"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <FileText size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Resources
          </span>
        </Link>
        <Link
          to="bookmarks"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <Bookmark size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Bookmarks
          </span>
        </Link>
        <Link
          to="feedback"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <MessageSquare size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Feedback
          </span>
        </Link>

        {/* Admin Only */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            margin: "10px 20px",
          }}
        ></div>
        <Link
          to="admin"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.3s ease",
            gap: "10px",
          }}
        >
          <Settings size={20} />
          <span
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Admin Panel
          </span>
        </Link>
      </nav>
    </aside>
  );
}
