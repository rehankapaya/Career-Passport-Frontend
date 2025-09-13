import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export default function SiteMapPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  const publicRoutes = useMemo(() => ([
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/services", label: "Services" },
    { to: "/success-stories", label: "Success Stories" },
    { to: "/multimedia", label: "Multimedia" },
    { to: "/resources", label: "Resources" },
    { to: "/career-bank", label: "Career Bank" },
    { to: "/feedback", label: "Feedback" },
    { to: "/sitemap", label: "Site Map (you’re here)" },
  ]), []);

  const authRoutes = useMemo(() => ([
    { to: "/login", label: "Login", show: !isLoggedIn },
    { to: "/signup", label: "Sign Up", show: !isLoggedIn },
    { to: "/password-reset", label: "Forgot / Reset Password", show: true },
    { to: "/my-bookmarks", label: "My Bookmarks", show: true, needsAuth: true },
    { to: "/quiz", label: "Take Quiz", show: true, needsAuth: true },
    { to: "/history", label: "Quiz History", show: true, needsAuth: true },
    { to: "/user-dashboard", label: "User Dashboard (layout)", show: true, needsAuth: true },
    // Dashboard nested routes
    { to: "/user-dashboard/recent-activity", label: "Recent Activity", show: true, needsAuth: true },
    { to: "/user-dashboard/quiz-result", label: "Quiz Results", show: true, needsAuth: true },
    { to: "/user-dashboard/book-mark", label: "Bookmarked Items (Dashboard)", show: true, needsAuth: true },
    { to: "/user-dashboard/recommended-career", label: "Recommended Careers", show: true, needsAuth: true },
    { to: "/user-dashboard/recommended-content", label: "Recommended Content", show: true, needsAuth: true },
    { to: "/user-dashboard/recommended-videos", label: "Recommended Videos", show: true, needsAuth: true },
    { to: "/user-dashboard/trending-career", label: "Trending Careers", show: true, needsAuth: true },
    { to: "/user-dashboard/top-pick", label: "Top Picks For You", show: true, needsAuth: true },
    { to: "/user-dashboard/analytics", label: "User Analytics", show: true, needsAuth: true },
    { to: "/user-dashboard/settings", label: "User Settings", show: true, needsAuth: true },
  ]), [isLoggedIn]);

  const adminRoutes = useMemo(() => ([
    { to: "/admin", label: "Admin Login", show: !isAdmin },
    { to: "/admin/dashboard", label: "Admin Dashboard (layout)", show: isAdmin },
    // Admin dashboard nested
    { to: "/admin/dashboard/admincareerbank", label: "Admin Career Bank", show: isAdmin },
    { to: "/admin/dashboard/addresource", label: "Admin Add Resource", show: isAdmin },
    { to: "/admin/dashboard/adminmultimedia", label: "Admin Multimedia", show: isAdmin },
    { to: "/admin/dashboard/adminsuccessstories", label: "Admin Success Stories", show: isAdmin },
    { to: "/admin/dashboard/adminfeedback", label: "Admin Feedback", show: isAdmin },
    { to: "/admin/dashboard/analytics", label: "Admin Analytics", show: isAdmin },
    { to: "/admin/dashboard/settings", label: "Admin Settings", show: isAdmin },
  ]), [isAdmin]);

  // quick-go handlers for dynamic routes
  const goResource = (e) => {
    e.preventDefault();
    const id = e.target.elements.resId.value.trim();
    if (id) navigate(`/resources/${id}`);
  };
  const goCareer = (e) => {
    e.preventDefault();
    const id = e.target.elements.careerId.value.trim();
    if (id) navigate(`/career-bank/${id}`);
  };
  const goMultimedia = (e) => {
    e.preventDefault();
    const id = e.target.elements.mediaId.value.trim();
    if (id) navigate(`/multimedia/${id}`);
  };
  const goResult = (e) => {
    e.preventDefault();
    const id = e.target.elements.attemptId.value.trim();
    if (id) navigate(`/result/${id}`);
  };

  const Card = ({ title, children }) => (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: 12, color: "#111827" }}>{title}</h3>
      {children}
    </div>
  );

  const LinkItem = ({ to, label, note }) => (
    <li style={{ marginBottom: 8 }}>
      <Link to={to} style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 600 }}>
        {label}
      </Link>
      {note && <span style={{ marginLeft: 8, color: "#6b7280", fontSize: 13 }}>— {note}</span>}
    </li>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
      <h1 style={{ margin: 0, marginBottom: 8, fontSize: 32, color: "#0f172a" }}>Site Map</h1>
      <p style={{ marginTop: 0, color: "#475569" }}>
        Quick links to every major page. Some links require you to be signed in or have admin access; clicking them will route you appropriately.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 16
      }}>
        <Card title="Public">
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {publicRoutes.map((r) => (
              <LinkItem key={r.to} to={r.to} label={r.label} />
            ))}
          </ul>
        </Card>

        <Card title="Auth & User">
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {authRoutes.filter(r => r.show).map((r) => (
              <LinkItem
                key={r.to}
                to={r.to}
                label={r.label}
                note={r.needsAuth ? "requires login" : undefined}
              />
            ))}
          </ul>
        </Card>

        <Card title="Admin">
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {adminRoutes.filter(r => r.show).map((r) => (
              <LinkItem key={r.to} to={r.to} label={r.label} />
            ))}
          </ul>
        </Card>

        <Card title="Dynamic Pages (jump with an ID)">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <form onSubmit={goResource} style={formStyle}>
              <label style={labelStyle}>Resource Detail</label>
              <div style={rowStyle}>
                <input name="resId" placeholder="resource id" style={inputStyle} />
                <button type="submit" style={btnStyle}>Go</button>
              </div>
              <small style={hintStyle}>Navigates to <code>/resources/:id</code></small>
            </form>

            <form onSubmit={goCareer} style={formStyle}>
              <label style={labelStyle}>Career Detail</label>
              <div style={rowStyle}>
                <input name="careerId" placeholder="career id" style={inputStyle} />
                <button type="submit" style={btnStyle}>Go</button>
              </div>
              <small style={hintStyle}>Navigates to <code>/career-bank/:id</code></small>
            </form>

            <form onSubmit={goMultimedia} style={formStyle}>
              <label style={labelStyle}>Multimedia Detail</label>
              <div style={rowStyle}>
                <input name="mediaId" placeholder="media id" style={inputStyle} />
                <button type="submit" style={btnStyle}>Go</button>
              </div>
              <small style={hintStyle}>Navigates to <code>/multimedia/:id</code></small>
            </form>

            <form onSubmit={goResult} style={formStyle}>
              <label style={labelStyle}>Quiz Result</label>
              <div style={rowStyle}>
                <input name="attemptId" placeholder="attempt id" style={inputStyle} />
                <button type="submit" style={btnStyle}>Go</button>
              </div>
              <small style={hintStyle}>Navigates to <code>/result/:attemptId</code> (login required)</small>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

const formStyle = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12
};
const labelStyle = { display: "block", fontWeight: 700, color: "#0f172a", marginBottom: 8 };
const rowStyle = { display: "flex", gap: 8 };
const inputStyle = {
  flex: 1,
  padding: "8px 10px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  outline: "none"
};
const btnStyle = {
  padding: "8px 14px",
  border: "1px solid #1d4ed8",
  background: "#1d4ed8",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600
};
const hintStyle = { color: "#64748b" };
