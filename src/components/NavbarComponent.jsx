import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  Compass,
  Home,
  Info,
  Phone,
  MessageSquare,
  LayoutDashboard,
  BookOpen,
  Briefcase,
  BrainCircuit,
  Film,
  Trophy,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Menu,
  X
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";

export default function NavbarComponent() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 960 : false);
  const wrapRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userlogout } = useContext(UserContext);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const measure = () => setHeaderH(wrapRef.current ? wrapRef.current.offsetHeight : 0);
    const onResize = () => {
      setIsMobile(window.innerWidth < 960);
      measure();
    };
    measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, mobileOpen]);

  const mainNavItems = [
    { name: "Home", to: "/", icon: <Home size={16} /> },
    { name: "About", to: "/about", icon: <Info size={16} /> },
    { name: "Contact", to: "/contact", icon: <Phone size={16} /> },
    { name: "Feedback", to: "/feedback", icon: <MessageSquare size={16} /> },
    { name: "Dashboard", to: "/user-dashboard", icon: <LayoutDashboard size={16} /> }
  ];

  const resourceNavItems = [
    { name: "Resources", to: "/resources", icon: <BookOpen size={16} /> },
    { name: "Career Bank", to: "/career-bank", icon: <Briefcase size={16} /> },
    { name: "Interest Quiz", to: "/quiz", icon: <BrainCircuit size={16} /> },
    { name: "Multimedia Hub", to: "/multimedia", icon: <Film size={16} /> },
    { name: "Success Stories", to: "/success-stories", icon: <Trophy size={16} /> }
  ];

  const primary = "#0A66C2";
  const text = "#1D2226";
  const activeLink = location.pathname;
  const filteredMain = user ? mainNavItems : mainNavItems.filter(i => i.name !== "Feedback" && i.name !== "Dashboard");

  const linkStyle = (isActive) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: isActive ? primary : "#4B5563",
    fontWeight: isActive ? 600 : 500,
    textDecoration: "none",
    padding: "6px 0"
  });

  return (
    <>
      <div
        ref={wrapRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "#FFFFFF",
          borderBottom: "1px solid #E6E9EC",
          backdropFilter: "saturate(180%) blur(6px)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            maxWidth: 1200,
            margin: "0 auto",
            fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
            color: text
          }}
        >
          {/* Logo + Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: primary, color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 4px 10px rgba(10,102,194,0.25)" }}>
              <Compass size={18} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.2px" }}>NextStep Navigator</span>
          </div>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
              {filteredMain.map((item) => {
                const isActive = item.to === activeLink;
                return (
                  <Link key={item.name} to={item.to} style={linkStyle(isActive)}>
                    {item.icon}
                    <span>{item.name}</span>
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: -6,
                        width: "100%",
                        height: 2,
                        backgroundColor: primary,
                        transform: `scaleX(${isActive ? 1 : 0})`,
                        transformOrigin: "left",
                        transition: "transform 140ms ease"
                      }}
                    />
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User / Auth Buttons */}
          {!isMobile && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#6B7280", fontSize: 14 }}>
                  Welcome{user.name ? `, ${user.name}` : user.email ? `, ${user.email}` : ""}
                </span>
                <div ref={menuRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setOpen(v => !v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "transparent",
                      border: "1px solid #E6E9EC",
                      padding: "6px 10px",
                      borderRadius: 20,
                      cursor: "pointer",
                      color: "#6B7280"
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F3F6F8", display: "grid", placeItems: "center", color: "#4B5563" }}>
                      <UserIcon size={16} />
                    </div>
                    <ChevronDown size={16} />
                  </button>

                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      marginTop: 8,
                      width: 200,
                      background: "#fff",
                      border: "1px solid #E6E9EC",
                      borderRadius: 10,
                      boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                      zIndex: 9999,
                      overflow: "hidden",
                      opacity: open ? 1 : 0,
                      pointerEvents: open ? "auto" : "none",
                      transition: "opacity 180ms ease"
                    }}
                  >
                    <Link
                      to="/profile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        color: "#4B5563",
                        textDecoration: "none",
                        fontSize: 14
                      }}
                    >
                      <UserIcon size={16} />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        userlogout();
                        navigate("/login");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "none",
                        color: "#4B5563",
                        cursor: "pointer",
                        fontSize: 14
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12 }}>
                <Link
                  to="/login"
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #E6E9EC",
                    borderRadius: 8,
                    color: "#374151",
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    backgroundColor: primary,
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 700,
                    boxShadow: "0 4px 10px rgba(10,102,194,0.25)"
                  }}
                >
                  Sign up
                </Link>
              </div>
            )
          )}

          {/* Mobile Toggle */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "1px solid #E6E9EC",
                background: "#FFFFFF",
                color: "#4B5563",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {/* Desktop Secondary Nav */}
        {!isMobile && (
          <div style={{ borderTop: "1px solid #E6E9EC", padding: "10px 24px", background: "#FFFFFF" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center", maxWidth: 1200, margin: "0 auto" }}>
              {resourceNavItems.map((item) => {
                const isActive = item.to === activeLink;
                return (
                  <Link key={item.name} to={item.to} style={linkStyle(isActive)}>
                    {item.icon}
                    <span>{item.name}</span>
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: -6,
                        width: "100%",
                        height: 2,
                        backgroundColor: primary,
                        transform: `scaleX(${isActive ? 1 : 0})`,
                        transformOrigin: "left",
                        transition: "transform 140ms ease"
                      }}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Mobile Drawer */}
        {isMobile && mobileOpen && (
          <div
            style={{
              borderTop: "1px solid #E6E9EC",
              background: "#FFFFFF",
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              padding: 12
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredMain.map((item) => {
                const isActive = item.to === activeLink;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      textDecoration: "none",
                      fontWeight: 600,
                      color: isActive ? primary : "#1D2226",
                      background: isActive ? "#E9F1FF" : "transparent",
                      border: "1px solid " + (isActive ? "#D0E6FB" : "transparent")
                    }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div style={{ height: 1, background: "#E6E9EC", margin: "8px 0" }} />

              {resourceNavItems.map((item) => {
                const isActive = item.to === activeLink;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      textDecoration: "none",
                      fontWeight: 600,
                      color: isActive ? primary : "#1D2226",
                      background: isActive ? "#E9F1FF" : "transparent",
                      border: "1px solid " + (isActive ? "#D0E6FB" : "transparent")
                    }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {!user ? (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "10px 12px",
                      border: "1px solid #E6E9EC",
                      borderRadius: 10,
                      color: "#374151",
                      textDecoration: "none",
                      fontWeight: 700
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "10px 12px",
                      borderRadius: 10,
                      backgroundColor: primary,
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 800,
                      boxShadow: "0 4px 10px rgba(10,102,194,0.25)"
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      textDecoration: "none",
                      color: "#1D2226",
                      border: "1px solid #E6E9EC"
                    }}
                  >
                    <UserIcon size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      userlogout();
                      navigate("/login");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #E6E9EC",
                      background: "#FFFFFF",
                      color: "#1D2226",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
      <div style={{ height: headerH }} />
<Breadcrumbs/>
    </>
  );
}
