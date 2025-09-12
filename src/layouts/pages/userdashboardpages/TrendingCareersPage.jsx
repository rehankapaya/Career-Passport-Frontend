import React from "react";

export default function TrendingCareersPage() {
  const trending = [
    {
      id: 1,
      title: "AI Engineer",
      description:
        "Work on machine learning models, neural networks, and artificial intelligence solutions.",
      growth: "35% (Very High)",
      link: "#",
    },
    {
      id: 2,
      title: "Cybersecurity Specialist",
      description:
        "Protect systems and networks from cyber threats and ensure data privacy.",
      growth: "28% (High)",
      link: "#",
    },
    {
      id: 3,
      title: "Cloud Architect",
      description:
        "Design and manage scalable cloud infrastructure on AWS, Azure, or Google Cloud.",
      growth: "22% (High)",
      link: "#",
    },
  ];

  return (
    <div>
      <h1 style={{ color: "#2563eb", marginBottom: "15px" }}>
        Trending Careers
      </h1>

      <div style={{ display: "grid", gap: "15px" }}>
        {trending.map((career) => (
          <div
            key={career.id}
            style={{
              padding: "15px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              backgroundColor: "#f9fafb",
            }}
          >
            <h2 style={{ margin: "0 0 8px 0", color: "#111827" }}>
              {career.title}
            </h2>
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              {career.description}
            </p>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Growth Rate:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: career.growth.includes("Very High")
                    ? "#16a34a"
                    : "#2563eb",
                }}
              >
                {career.growth}
              </span>
            </p>
            <a
              href={career.link}
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
              View Details →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
