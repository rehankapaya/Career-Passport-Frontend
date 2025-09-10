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
import { Link } from "react-router-dom";

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
        <Link to="dashboard" className="menu-item">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="careers" className="menu-item">
          <Briefcase size={20} />
          <span>Career Bank</span>
        </Link>
        <Link to="quiz" className="menu-item">
          <FileText size={20} />
          <span>Interest Quiz</span>
        </Link>
        <Link to="adminmultimedia" className="menu-item">
          <Video size={20} />
          <span>Multimedia</span>
        </Link>
        <Link to="adminsuccessstories" className="menu-item">
          <BookOpen size={20} />
          <span>Success Stories</span>
        </Link>
        <Link to="resources" className="menu-item">
          <FileText size={20} />
          <span>Resources</span>
        </Link>
        <Link to="bookmarks" className="menu-item">
          <Bookmark size={20} />
          <span>Bookmarks</span>
        </Link>
        <Link to="feedback" className="menu-item">
          <MessageSquare size={20} />
          <span>Feedback</span>
        </Link>

        {/* Admin Only */}
        <div className="menu-divider"></div>
        <Link to="admin" className="menu-item admin">
          <Settings size={20} />
          <span>Admin Panel</span>
        </Link>
      </nav>
    </aside>
  );
}
