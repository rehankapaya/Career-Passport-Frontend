import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiurl } from "../../../api";

export default function TopPicksForYouPage() {
  const [multimedia, setMultimedia] = useState([]);
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const [multimediaRes, resourcesRes] = await Promise.all([
          axios.get(`${apiurl}/api/multimedia`),
          axios.get(`${apiurl}/api/resources`),
        ]);

        // Multimedia ke top 3
        const multimediaTop = multimediaRes.data.slice(0, 3).map((item) => ({
          id: item.media_id,
          title: item.title,
          thumbnail: item.thumbnail || "https://via.placeholder.com/300x200",
          description: item.description || "No description available",
          link: `/multimedia/${item.media_id}`,
        }));

        // Resources ke top 3
        const resourcesTop = resourcesRes.data.slice(0, 3).map((item) => ({
          id: item.resource_id,
          title: item.title,
          description: item.description || "No description available",
          link: `/resources/${item.resource_id}`,
        }));

        setMultimedia(multimediaTop);
        setResources(resourcesTop);
      } catch (err) {
        console.error("Error fetching top picks:", err);
      }
    };

    fetchTopPicks();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          backgroundColor: "#e5e7eb",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        ← Back to Previous
      </button>

      <h1 style={{ color: "#2563eb", marginBottom: "20px" }}>
        Top Picks For You
      </h1>

      {/* Multimedia Section */}
      <h2 style={{ marginBottom: "15px", color: "#111827" }}>
        🎥 Top Multimedia Videos
      </h2>
      {multimedia.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            marginBottom: "40px",
          }}
        >
          {multimedia.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: "0 0 10px", color: "#2563eb" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#374151" }}>
                  {item.description}
                </p>
                <button
                  onClick={() => navigate(item.link)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Watch Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#6b7280" }}>No multimedia available.</p>
      )}

      {/* Resources Section */}
      <h2 style={{ marginBottom: "15px", color: "#111827" }}>
        📚 Top Resources
      </h2>
      {resources.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {resources.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ margin: "0 0 10px", color: "#2563eb" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#374151" }}>
                {item.description}
              </p>
              <button
                onClick={() => navigate(item.link)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                View Resource →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#6b7280" }}>No resources available.</p>
      )}
    </div>
  );
}
