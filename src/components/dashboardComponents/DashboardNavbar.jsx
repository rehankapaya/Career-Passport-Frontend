import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, userlogout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        height: "60px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#2c3e50",
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
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
          style={{ color: "#4B0082" }}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span
          style={{
            fontWeight: 600,
            fontSize: "18px",
            color: "#4B0082",
          }}
        >
          NextStep Navigator
        </span>
      </div>

      {/* Profile + Hamburger */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#6c757d",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {/* Moon Icon */}
          <div
            style={{
              padding: "5px",
              backgroundColor: "#f8f9fa",
              borderRadius: "50%",
              border: "1px solid #e9ecef",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
          <span>Welcome, {user?.name || "Alex"}</span>
        </div>

        <div
          className="profile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid #e9ecef",
            }}
          />
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            right: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: "8px",
            padding: "10px",
            zIndex: "100",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            border: "1px solid #e9ecef",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <a
            href="/dashboard/profile"
            style={{
              textDecoration: "none",
              color: "#333",
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            Profile
          </a>
          <a
            href="/dashboard/settings"
            style={{
              textDecoration: "none",
              color: "#333",
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            Settings
          </a>
          <Link
            onClick={() => {
              userlogout();
              navigate("/admin");
            }}
            style={{
              textDecoration: "none",
              color: "#333",
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            Logout
          </Link>
        </div>
      )}
    </header>
  );
}
