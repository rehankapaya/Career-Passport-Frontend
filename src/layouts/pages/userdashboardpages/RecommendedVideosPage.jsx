import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { apiurl } from "../../../api";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Video, Clock } from "lucide-react";

const isDriveUrl = (url) => url && (url.includes("drive.google.com") || url.includes("docs.google.com"));
const getDriveFileId = (url) => {
  if (!url) return null;
  const m = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/) || url.match(/folders\/([^/]+)/);
  return m ? m[1] : null;
};
const getDriveThumbnailUrl = (url) => {
  const id = getDriveFileId(url);
  if (!id) return "https://via.placeholder.com/320x180/000000/FFFFFF?text=Drive+Video";
  return `https://lh3.googleusercontent.com/d/${id}=s220?authuser=0`;
};
const getYoutubeThumb = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
};
const getThumbnailFromHistory = (item) => {
  const type = (item.subCategory || item?.meta?.type || "").toLowerCase();
  const url = item?.meta?.url || item?.url || item?.meta?.sourceUrl || item?.meta?.embed_url;
  if (type === "video") {
    const yt = getYoutubeThumb(url);
    if (yt) return yt;
    if (isDriveUrl(url)) return getDriveThumbnailUrl(url);
    if (url && url.startsWith("uploads/")) return "https://via.placeholder.com/320x180/000000/FFFFFF?text=Video";
    return "https://via.placeholder.com/320x180/000000/FFFFFF?text=Video";
  }
  if (type === "image") {
    if (url && url.startsWith("uploads/")) return `${apiurl}/${url}`;
    return url || "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=IMAGE";
  }
  if (type === "audio") return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=AUDIO";
  if (type === "pdf") return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=PDF";
  return "https://via.placeholder.com/320x180/6a5acd/FFFFFF?text=MEDIA";
};
const formatDateTime = (d) => new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export default function RecommendedContentPage() {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const primary = "#0A66C2";
  const primarySoft = "#E9F3FF";
  const pageBg = "#F3F6F8";
  const text = "#1D2226";
  const subtext = "#6B7280";
  const border = "#E6E9EC";

  useEffect(() => {
    if (!user?._id) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/history/${user._id}`);
        const multimediaOnly = res.data.data.filter((item) => item.categoryType === "multimedia");
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

  if (loading)
    return (
      <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center", color: subtext, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        Loading recommended content…
      </div>
    );

  return (
    <div style={{ padding: 20, background: pageBg, borderRadius: 12, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ background: primarySoft, padding: 8, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Video size={18} style={{ color: primary }} />
        </div>
        <h1 style={{ margin: 0, color: primary, fontSize: 22, fontWeight: 800 }}>Recommended Content for You</h1>
      </div>

      {content.length === 0 ? (
        <p style={{ color: subtext, marginTop: 8 }}>No multimedia recommendations yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {content.map((item) => {
            const type = (item.subCategory || item?.meta?.type || "").toLowerCase();
            const url = item?.meta?.url || item?.url || item?.meta?.sourceUrl || item?.meta?.embed_url;
            return (
              <div
                key={item._id}
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 12,
                  background: "#FFFFFF",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column"
                }}
                onClick={() => navigate(`/multimedia/${item.itemId}`, { state: item.meta })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: 180,
                    backgroundColor: "#000",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img
                    src={getThumbnailFromHistory(item)}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
                  />
                  {type === "video" && (
                    <PlayCircle size={64} color="#FFFFFF" style={{ position: "absolute", zIndex: 1, opacity: 0.9 }} />
                  )}
                  {type === "video" && isDriveUrl(url) && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: primary,
                        color: "#FFFFFF",
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: 0.2
                      }}
                    >
                      Google Drive
                    </div>
                  )}
                  {(!isDriveUrl(url) || type !== "video") && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "#2D2F31",
                        color: "#FFFFFF",
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        textTransform: "capitalize",
                        fontWeight: 700
                      }}
                    >
                      {type || "media"}
                    </span>
                  )}
                </div>

                <div style={{ padding: 14 }}>
                  <h2 style={{ margin: "0 0 8px 0", fontSize: 16, color: text, lineHeight: 1.35, fontWeight: 700 }}>{item.title}</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: subtext, fontSize: 13, marginBottom: 6, textTransform: "capitalize" }}>
                    <span style={{ fontWeight: 600 }}>{type || "media"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9CA3AF", fontSize: 12 }}>
                    <Clock size={14} style={{ color: "#9CA3AF" }} />
                    <span>Viewed at: {formatDateTime(item.viewedAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
