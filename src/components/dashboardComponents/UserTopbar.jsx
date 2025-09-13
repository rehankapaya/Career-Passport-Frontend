import React from "react";

export default function UserTopbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left Section - Logo + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" // replace with your logo
          alt="Logo"
          style={{ width: "24px", height: "24px" }}
        />
        <span
          style={{
            fontWeight: "600",
            fontSize: "1rem",
            color: "#6D28D9", // purple like your screenshot
          }}
        >
          NextStep Navigator
        </span>
      </div>

      {/* Right Section - Welcome + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: "#374151", fontSize: "0.95rem" }}>
          Welcome, <strong>Admin</strong>
        </span>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg" // replace with profile avatar
          alt="Admin Avatar"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid #e5e7eb",
          }}
        />
      </div>
    </div>
  );
}
