import React from "react";

export default function BookmarkedItemsPage() {
  const bookmarks = [
    {
      id: 1,
      title: "ReactJS Tutorial for Beginners",
      type: "Article",
      date: "2025-09-03",
      link: "#",
    },
    {
      id: 2,
      title: "Top 10 Career Paths in Tech",
      type: "Career Guide",
      date: "2025-09-07",
      link: "#",
    },
    {
      id: 3,
      title: "JavaScript ES6 Features",
      type: "Video",
      date: "2025-09-10",
      link: "#",
    },
  ];

  return (
    <div>
      <h1 style={{ color: "#2563eb", marginBottom: "15px" }}>Bookmarked Items</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {bookmarks.map((item) => (
          <li
            key={item.id}
            style={{
              padding: "15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              marginBottom: "12px",
              backgroundColor: "#f9fafb",
            }}
          >
            <h3 style={{ margin: "0 0 5px 0", color: "#111827" }}>
              {item.title}
            </h3>
            <p style={{ margin: "0 0 5px 0", color: "#6b7280", fontSize: "14px" }}>
              Type: {item.type} | Saved on: {item.date}
            </p>
            <a
              href={item.link}
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              View Item →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
