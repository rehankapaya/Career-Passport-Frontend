import React from "react";

export default function TopPicksForYouPage() {
  const picks = [
    {
      id: 1,
      title: "Become a Fullstack Developer",
      type: "Career Path",
      description:
        "Learn frontend + backend to become a highly in-demand fullstack developer.",
      link: "#",
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      type: "Article",
      description:
        "Master advanced concepts like render props, higher-order components, and custom hooks.",
      link: "#",
    },
    {
      id: 3,
      title: "Introduction to Cloud Computing",
      type: "Video",
      description:
        "A beginner-friendly video guide to cloud platforms like AWS, Azure, and GCP.",
      link: "#",
    },
  ];

  return (
    <div>
      <h1 style={{ color: "#2563eb", marginBottom: "15px" }}>
        Top Picks For You
      </h1>

      <div style={{ display: "grid", gap: "15px" }}>
        {picks.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "15px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              backgroundColor: "#f9fafb",
            }}
          >
            <h2 style={{ margin: "0 0 6px 0", color: "#111827" }}>
              {item.title}
            </h2>
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              {item.type}
            </p>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              {item.description}
            </p>
            <a
              href={item.link}
              style={{
                display: "inline-block",
                padding: "8px 12px",
                backgroundColor: "#2563eb",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Explore →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
