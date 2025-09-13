import { FileText, Video, Image as ImageIcon, Music } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiurl } from "../../../api";

function Thumbnail({ item }) {
  const url = (item.url || "").toLowerCase();
  const type = (item.file_type || "").toLowerCase();
  const isPDF = type === "pdf" || url.endsWith(".pdf");
  const isVideo = type === "video" || url.endsWith(".mp4") || url.endsWith(".mov");
  const isAudio = type === "audio" || url.endsWith(".mp3") || url.endsWith(".wav");
  const isImage = type === "image" || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png") || url.endsWith(".gif");
  let icon = null;
  let label = null;
  let bgColor = "#EEF3F8";
  if (isPDF) {
    icon = <FileText size={50} style={{ color: "#D64541" }} />;
    label = "PDF";
    bgColor = "#FFF1F0";
  } else if (isVideo) {
    icon = <Video size={50} style={{ color: "#0A66C2" }} />;
    label = "Video";
    bgColor = "#E9F3FF";
  } else if (isAudio) {
    icon = <Music size={50} style={{ color: "#2E7D32" }} />;
    label = "Audio";
    bgColor = "#ECFDF3";
  } else if (isImage) {
    icon = <ImageIcon size={50} style={{ color: "#0284C7" }} />;
    label = "Image";
    bgColor = "#E6F4FF";
  }
  return (
    <div style={{ position: "relative", width: "100%", height: 180, background: "#000", overflow: "hidden" }}>
      {item.thumbnail && !isPDF && !isVideo && !isAudio ? (
        <img src={item.thumbnail} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : icon ? (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: bgColor }}>{icon}</div>
      ) : (
        <div style={{ width: "100%", height: "100%", background: "#EEF3F8" }} />
      )}
      {label && (
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "#0A66C2",
            color: "#FFFFFF",
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 6,
            fontWeight: 700,
            letterSpacing: 0.2,
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
        const [multimediaRes, resourcesRes] = await Promise.all([axios.get(`${apiurl}/api/multimedia`), axios.get(`${apiurl}/api/resources`)]);
        const multimediaTop = (multimediaRes.data || []).slice(0, 3).map((item) => ({
          id: item.media_id,
          title: item.title,
          thumbnail: item.thumbnail || item.image || item.cover_image || null,
          description: item.description || "No description available",
          link: `/multimedia/${item.media_id}`,
          url: item.url,
          file_type: item.file_type,
        }));
        const resourcesTop = (resourcesRes.data || []).slice(0, 3).map((item) => ({
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
      } catch (err) {}
    };
    fetchTopPicks();
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        background: "#F3F6F8",
        borderRadius: 12,
        fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        color: "#1D2226",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 20,
          padding: "8px 14px",
          backgroundColor: "#EEF3F8",
          color: "#1D2226",
          border: "1px solid #E6E9EC",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Back
      </button>

      <h1 style={{ color: "#0A66C2", marginBottom: 20, fontSize: 24, fontWeight: 800 }}>Top Picks For You</h1>

      <h2 style={{ marginBottom: 12, color: "#1D2226", fontSize: 18, fontWeight: 700 }}>Top Multimedia</h2>
      {multimedia.length > 0 ? (
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", marginBottom: 40 }}>
          {multimedia.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E6E9EC",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
              }}
            >
              <Thumbnail item={item} />
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: "0 0 8px", color: "#0A66C2", fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#434649", lineHeight: 1.5, margin: 0 }}>{item.description}</p>
                <button
                  onClick={() => navigate(item.link)}
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    backgroundColor: "#0A66C2",
                    color: "#FFFFFF",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Watch
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#6B7280" }}>No multimedia available.</p>
      )}

      <h2 style={{ marginBottom: 12, color: "#1D2226", fontSize: 18, fontWeight: 700 }}>Top Resources</h2>
      {resources.length > 0 ? (
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {resources.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E6E9EC",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ position: "relative", width: "100%", height: 180 }}>
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF1F0" }}>
                  <FileText size={50} style={{ color: "#D64541" }} />
                </div>
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    backgroundColor: "#0A66C2",
                    color: "#FFFFFF",
                    fontSize: 12,
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontWeight: 700,
                    letterSpacing: 0.2,
                  }}
                >
                  PDF
                </span>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: "0 0 8px", color: "#0A66C2", fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#434649", lineHeight: 1.5, margin: 0 }}>{item.description}</p>
                <button
                  onClick={() => navigate(item.link)}
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    backgroundColor: "#0A66C2",
                    color: "#FFFFFF",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#6B7280" }}>No resources available.</p>
      )}
    </div>
  );
}
