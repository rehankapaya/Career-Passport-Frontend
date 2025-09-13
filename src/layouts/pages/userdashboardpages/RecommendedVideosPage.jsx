import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { apiurl } from "../../../api";
import { useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";

/* ---------- Helpers copied from MultimediaPage (adapted) ---------- */

// Is it a Google Drive link?
const isDriveUrl = (url) =>
  url && (url.includes("drive.google.com") || url.includes("docs.google.com"));

// Extract Drive fileId
const getDriveFileId = (url) => {
  if (!url) return null;
  const match =
    url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/) || url.match(/folders\/([^/]+)/);
  return match ? match[1] : null;
};

// Drive thumbnail URL
const getDriveThumbnailUrl = (url) => {
  const fileId = getDriveFileId(url);
  if (!fileId)
    return "https://via.placeholder.com/320x180/000000/FFFFFF?text=Drive+Video";
  // This lh3 endpoint serves a downsized preview
  return `https://lh3.googleusercontent.com/d/${fileId}=s220?authuser=0`;
};

// Get Youtube videoId (11 chars) and make thumbnail
const getYoutubeThumb = (url) => {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
};

// Generic thumbnail logic using history item (prefers item.meta)
const getThumbnailFromHistory = (item) => {
  const type = (item.subCategory || item?.meta?.type || "").toLowerCase();
  const url =
    item?.meta?.url || item?.url || item?.meta?.sourceUrl || item?.meta?.embed_url;

  // VIDEO
  if (type === "video") {
    // YouTube
    const yt = getYoutubeThumb(url);
    if (yt) return yt;
    // Google Drive
    if (isDriveUrl(url)) return getDriveThumbnailUrl(url);
    // Local uploads
    if (url && url.startsWith("uploads/"))
      return "https://via.placeholder.com/320x180/000000/FFFFFF?text=Video";
    // Fallback
    return "https://via.placeholder.com/320x180/000000/FFFFFF?text=Video";
  }

  // IMAGE
  if (type === "image") {
    if (url && url.startsWith("uploads/")) return `${apiurl}/${url}`;
    return url || "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=IMAGE";
  }

  // AUDIO
  if (type === "audio") {
    return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=AUDIO";
  }

  // PDF
  if (type === "pdf") {
    return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=PDF";
  }

  // Default
  return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=MEDIA";
};

const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export default function RecommendedContentPage() {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  if (!user?._id) return;

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/history/${user._id}`);

      // 1) multimedia only
      const multimediaOnly = res.data.data.filter(
        (item) => item.categoryType === "multimedia"
      );

      // 2) videos only (match both subCategory and meta.type just in case)
      const videosOnly = multimediaOnly.filter((item) => {
        const t1 = (item.subCategory || "").toLowerCase();
        const t2 = (item?.meta?.type || "").toLowerCase();
        return t1 === "video" || t2 === "video";
      });

      setContent(videosOnly);
    } catch (err) {
      console.error("Error fetching recommended content", err);
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [user]);

  if (loading) return <p>Loading recommended content...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          color: "#2563eb",
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        🎯 Recommended Content for You
      </h1>

      {content.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No multimedia recommendations yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "18px",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {content.map((item) => {
            const type = (item.subCategory || item?.meta?.type || "").toLowerCase();
            const url =
              item?.meta?.url ||
              item?.url ||
              item?.meta?.sourceUrl ||
              item?.meta?.embed_url;

            return (
              <div
                key={item._id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  background: "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
                onClick={() => navigate(`/multimedia/${item.itemId}`, { state: item.meta })}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                {/* Thumbnail (same behavior as MultimediaPage) */}
                <div
                  style={{
                    position: "relative",
                    height: "180px",
                    backgroundColor: "#000",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={getThumbnailFromHistory(item)}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />

                  {/* Play overlay for videos */}
                  {type === "video" && (
                    <PlayCircle
                      size={64}
                      color="white"
                      fill="rgba(0,0,0,0.7)"
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Drive badge if link is Google Drive */}
                  {type === "video" && isDriveUrl(url) && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "#4688F1",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      Google Drive
                    </div>
                  )}

                  {/* Type chip (top-left if not Drive) */}
                  {(!isDriveUrl(url) || type !== "video") && (
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {type || "media"}
                    </span>
                  )}
                </div>

                {/* Content Info */}
                <div style={{ padding: "14px" }}>
                  <h2
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                      color: "#111827",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.title}
                  </h2>

                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "13px",
                      color: "#6b7280",
                      textTransform: "capitalize",
                    }}
                  >
                    Type: {type || "media"}
                  </p>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                    }}
                  >
                    Viewed at: {formatDateTime(item.viewedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
