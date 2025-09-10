import React, { useState } from "react";
import "./DashboardNavbar.css";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, userlogout } = useContext(UserContext)
  const navigate = useNavigate()

  return (
    <header className="topbar">
      {/* Logo / Brand */}
      <div className="topbar-logo">
        <span className="logo-text">PathSeeker</span>
      </div>

      {/* Search */}
      <div className="topbar-search">
        <input type="text" placeholder="Search careers, resources..." />
      </div>

      {/* Profile + Hamburger */}
      <div className="topbar-actions">
        <div className="profile" onClick={() => setMenuOpen(!menuOpen)}>
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="avatar"
          />
          <span className="username">John Doe</span>
        </div>

        {/* Hamburger (mobile) */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="dropdown-menu">
          <a href="/dashboard/profile">Profile</a>
          <a href="/dashboard/settings">Settings</a>
          <Link onClick={() => { userlogout(); navigate('/admin') }} className="login-btn">
            Logout
          </Link>
        </div>
      )}
    </header>
  );
}
