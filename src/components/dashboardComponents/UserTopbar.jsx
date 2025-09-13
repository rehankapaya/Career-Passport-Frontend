import React from "react";
import { Compass } from "lucide-react";

export default function UserTopbar() {
  const brand = "#0A66C2";
  const ink = "#1D2226";
  const line = "#E6E9EC";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        background: "#FFFFFF",
        borderBottom: `1px solid ${line}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        color: ink
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: brand,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 6px 16px rgba(10,102,194,0.35)"
          }}
        >
          <Compass size={18} />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: brand,
            letterSpacing: 0.2
          }}
        >
          NextStep Navigator
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#4B5563", fontSize: ".95rem" }}>
          Welcome, <strong style={{ color: ink }}>Admin</strong>
        </span>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Admin"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1px solid ${line}`,
            outline: `2px solid rgba(10,102,194,0.12)`,
            outlineOffset: 2,
            objectFit: "cover"
          }}
        />
      </div>
    </div>
  );
}
