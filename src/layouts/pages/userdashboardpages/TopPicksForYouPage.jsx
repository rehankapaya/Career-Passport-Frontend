import { FileText, Video, Image as ImageIcon, Music } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiurl } from "../../../api";

// 🔹 Thumbnail with file type icons + badge
function Thumbnail({ item }) {
  const url = item.url?.toLowerCase() || "";
  const type = item.file_type?.toLowerCase();

  const isPDF = type === "pdf" || url.endsWith(".pdf");
  const isVideo =
    type === "video" || url.endsWith(".mp4") || url.endsWith(".mov");
  const isAudio =
    type === "audio" || url.endsWith(".mp3") || url.endsWith(".wav");
  const isImage =
    type === "image" ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".png") ||
    url.endsWith(".gif");

  let icon = null;
  let label = null;
  let bgColor = "#f3f4f6"; // default gray

  if (isPDF) {
    icon = <FileText size={50} color="#ef4444" />;
    label = "PDF";
    bgColor = "#fef2f2";
  } else if (isVideo) {
    icon = <Video size={50} color="#2563eb" />;
    label = "Video";
    bgColor = "#eff6ff";
  } else if (isAudio) {
    icon = <Music size={50} color="#22c55e" />;
    label = "Audio";
    bgColor = "#f0fdf4";
  } else if (isImage) {
    icon = <ImageIcon size={50} color="#0ea5e9" />;
    label = "Image";
    bgColor = "#f0f9ff";
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "180px" }}>
      {item.thumbnail && !isPDF && !isVideo && !isAudio ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : icon ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor,
          }}
        >
          {icon}
        </div>
      ) : (
        <img
          src="https://via.placeholder.com/300x200?text=No+Thumbnail"
          alt="No Thumbnail"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* 🔹 Badge Label */}
      {label && (
        <span
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            fontSize: "12px",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

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

        // Multimedia top 3
        const multimediaTop = multimediaRes.data.slice(0, 3).map((item) => ({
          id: item.media_id,
          title: item.title,
          thumbnail: item.thumbnail || item.image || item.cover_image || null,
          description: item.description || "No description available",
          link: `/multimedia/${item.media_id}`,
          url: item.url,
          file_type: item.file_type,
        }));

        // Resources top 3
        const resourcesTop = resourcesRes.data.slice(0, 3).map((item) => ({
          id: item.resource_id,
          title: item.title,
          thumbnail: item.thumbnail || item.image || item.cover_image || null,
          description: item.description || "No description available",
          link: `/resources/${item.resource_id}`,
          url: item.url,
          file_type: item.file_type,
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
      {/* Back Button */}
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
              <Thumbnail item={item} />
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
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "180px" }}>
       
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fef2f2",
                    }}
                  >
                    <FileText size={50} color="#ef4444"/>
                  </div>
             

             
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    PDF
                  </span>
              </div>
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
                  View Resource →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#6b7280" }}>No resources available.</p>
      )}
    </div>
  );
}
