import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Compass, Layers, Moon } from "lucide-react";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, userlogout } = useContext(UserContext);
  const navigate = useNavigate();
  const brand = "#0A66C2";
  const ink = "#1D2226";
  const haze = "#F3F6F8";
  const line = "#E6E9EC";
  const activeLink = location.pathname;
  const primary = "#0A66C2";
  const text = "#1D2226";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#fff",
        borderBottom: "1px solid " + line,
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        height: 60,
        fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        color: ink,
        position: "relative",
        zIndex: 50
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: primary, color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 4px 10px rgba(10,102,194,0.25)" }}>
          <Compass size={18} />
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.2px" }}>NextStep Navigator</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#6B7280",
            fontWeight: 500,
            cursor: "default"
          }}
        >

          <span>Welcome, {user?.name || "Alex"}</span>
        </div>

        <div
          onClick={() => setMenuOpen((s) => !s)}
          style={{
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid " + line,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          />
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: 50,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid " + line,
                borderRadius: 10,
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                padding: 8,
                minWidth: 140,
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}
            >
              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  color: ink,
                  padding: "8px 10px",
                  borderRadius: 8,
                  transition: "background .15s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = haze)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Profile
              </Link>
              <Link
                onClick={() => {
                  userlogout();
                  navigate("/admin");
                }}
                style={{
                  textDecoration: "none",
                  color: "#B00020",
                  padding: "8px 10px",
                  borderRadius: 8,
                  transition: "background .15s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF1F2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
