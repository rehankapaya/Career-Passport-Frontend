import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../components/dashboardComponents/UserSidebar";

export default function DashboardLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F6F8",
        fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        color: "#1D2226",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: 1200,
          margin: "0 auto",
          gap: 16,
          padding: 16,
        }}
      >
        <UserSidebar />
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            border: "1px solid #E6E9EC",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
