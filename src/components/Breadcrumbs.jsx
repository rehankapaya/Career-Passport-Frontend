import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const primary = "#0A66C2";
  const text = "#1D2226";
  const muted = "#6B7280";

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        fontSize: 14,
        gap: 6,
        padding: "12px 24px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Link
        to="/"
        style={{
          color: primary,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Home
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={14} color={muted} />
            {isLast ? (
              <span style={{ color: text, fontWeight: 600 }}>
                {decodeURIComponent(name).replace(/-/g, " ")}
              </span>
            ) : (
              <Link
                to={routeTo}
                style={{
                  color: primary,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {decodeURIComponent(name).replace(/-/g, " ")}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
