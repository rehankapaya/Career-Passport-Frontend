import React, { useState } from "react";
import './DashboardSidebar.css';
import {
  Home,
  Briefcase,
  FileText,
  Video,
  BookOpen,
  Bookmark,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Toggle Button */}
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Sidebar Menu */}
      <nav className="sidebar-menu">
        <a href="/dashboard" className="menu-item">
          <Home size={20} />
          <span>Dashboard</span>
        </a>
        <a href="/careers" className="menu-item">
          <Briefcase size={20} />
          <span>Career Bank</span>
        </a>
        <a href="/quiz" className="menu-item">
          <FileText size={20} />
          <span>Interest Quiz</span>
        </a>
        <a href="/multimedia" className="menu-item">
          <Video size={20} />
          <span>Multimedia</span>
        </a>
        <a href="/stories" className="menu-item">
          <BookOpen size={20} />
          <span>Success Stories</span>
        </a>
        <a href="/resources" className="menu-item">
          <FileText size={20} />
          <span>Resources</span>
        </a>
        <a href="/bookmarks" className="menu-item">
          <Bookmark size={20} />
          <span>Bookmarks</span>
        </a>
        <a href="/feedback" className="menu-item">
          <MessageSquare size={20} />
          <span>Feedback</span>
        </a>

        {/* Admin Only */}
        <div className="menu-divider"></div>
        <a href="/admin" className="menu-item admin">
          <Settings size={20} />
          <span>Admin Panel</span>
        </a>
      </nav>
    </aside>
  );
}
