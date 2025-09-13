import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiurl } from "../../api";
import MultimediaPageeXTRA from "./MultimediaPageeXTRA";
import { Video as VideoIcon, Mic as AudioIcon, FileText as PdfIcon, Image as ImageIcon, Star as StarIcon, Search as SearchIcon, PlayCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmark } from "../../hooks/useBookmark";
import { UserContext } from "../../context/UserContext";
import getThumbnail from "../../hooks/useThumbnail";

export default function MultimediaPage() {
  const [items, setItems] = useState([]);
  const { user } = useContext(UserContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  async function saveHistory(resource) {
    try {
      const payload = {
        userId: user._id,
        categoryType: "multimedia",
        itemId: resource._id || resource.resource_id || resource.media_id,
        title: resource.title,
        subCategory: resource.type || null,
        meta: resource
      };
      await axios.post(`${apiurl}/api/history`, payload);
    } catch { }
  }

  const allCategories = ["all", "video", "audio", "pdf", "image"];

  const generateRandomSuggestions = (sourceItems, count) => {
    if (sourceItems.length <= count) return [...sourceItems];
    const shuffled = [...sourceItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const isDriveUrl = (url) => url && (url.includes("drive.google.com") || url.includes("docs.google.com"));

  const getDriveFileId = (url) => {
    if (!url) return null;
    const match = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/) || url.match(/folders\/([^/]+)/);
    return match ? match[1] : null;
  };

  const getDriveThumbnailUrl = (url) => {
    const fileId = getDriveFileId(url);
    if (!fileId) return "https://via.placeholder.com/320x180/000000/FFFFFF?text=Drive+Video";
    return `https://lh3.googleusercontent.com/d/${fileId}=s220?authuser=0`;
  };

  const getDriveEmbedUrl = (url, options = {}) => {
    const fileId = getDriveFileId(url);
    if (!fileId) return url;
    const params = new URLSearchParams();
    if (options.autoplay) params.append("autoplay", "1");
    if (options.muted) params.append("mute", "1");
    if (options.loop) params.append("loop", "1");
    return `https://drive.google.com/file/d/${fileId}/preview${params.toString() ? "?" + params.toString() : ""}`;
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiurl}/api/multimedia`)
      .then((res) => {
        const sortedItems = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sortedItems);
        setFilteredItems(sortedItems);
        setSuggestedItems(generateRandomSuggestions(sortedItems, 4));
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setFilteredItems([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = items;
    if (selectedCategory !== "all") result = result.filter((item) => item.type === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
          (item.transcript && item.transcript.toLowerCase().includes(q))
      );
    }
    setFilteredItems(result);
  }, [selectedCategory, searchQuery, items]);

  const handleViewDetails = (item) => {
    saveHistory(item);
    navigate(`/multimedia/${item.media_id}`, { state: item });
  };


 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const PillButton = ({ active, label, onClick }) => (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: 999,
        border: active ? "1px solid #0A66C2" : "1px solid #E0E0E0",
        backgroundColor: active ? "#0A66C2" : "#FFFFFF",
        color: active ? "#FFFFFF" : "#56687A",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: 0.2
      }}
    >
      {label}
    </button>
  );

  const BookmarkButton = ({ mediaId, size = 20, inline = false }) => {
    const { isBookmarked, loading, toggleBookmark } = useBookmark("multimedia", mediaId);
    const baseStyle = inline
      ? { background: "none", border: "1px solid #E6E9EC", borderRadius: 10, padding: 6 }
      : { position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.95)", border: "1px solid #E6E9EC", borderRadius: 10, padding: 6 };
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark();
        }}
        disabled={loading}
        style={{
          ...baseStyle,
          cursor: loading ? "not-allowed" : "pointer",
          color: isBookmarked ? "#FFC107" : "#7A8A99",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        {isBookmarked ? <BookmarkCheck size={size} /> : <Bookmark size={size} />}
      </button>
    );
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#F3F2EF",
          minHeight: "100vh",
          padding: "0 20px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          color: "#1D2226"
        }}
      >
        <div
          style={{
            padding: "16px 0",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid #E6E9EC"
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg,#0A66C2,#004182)",
              color: "#FFFFFF",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 16
            }}
          >
            Media
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#283E4A", margin: 0 }}>Multimedia Library</h1>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 640 }}>
            <input
              type="text"
              placeholder="Search videos, podcasts, PDFs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 44px 12px 16px",
                borderRadius: 24,
                border: "1px solid #E0E0E0",
                backgroundColor: "#FFFFFF",
                outline: "none",
                fontSize: 15,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                color: "#1D2226"
              }}
            />
            <SearchIcon size={20} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.6 }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {allCategories.map((c) => (
            <PillButton key={c} active={selectedCategory === c} label={c === "all" ? "All" : c[0].toUpperCase() + c.slice(1)} onClick={() => setSelectedCategory(c)} />
          ))}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#283E4A", marginBottom: 20, textAlign: "center" }}>Latest Content</h2>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", overflow: "hidden", height: 300 }}>
                <div style={{ backgroundColor: "#E6E9EC", height: 180, width: "100%" }} />
                <div style={{ padding: 16 }}>
                  <div style={{ backgroundColor: "#E6E9EC", height: 16, width: "80%", marginBottom: 8, borderRadius: 6 }} />
                  <div style={{ backgroundColor: "#E6E9EC", height: 14, width: "60%", borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 300px)", gap: 20, justifyContent: "center" }}>
            {filteredItems.map((item) => (
              <div
                key={item.media_id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  transition: "transform 120ms ease"
                }}
                onClick={() => handleViewDetails(item)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ position: "relative", height: 180, overflow: "hidden", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={getThumbnail(item)} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                      {item.type === "video" && (
                        <PlayCircle size={56} style={{ position: "absolute", zIndex: 1, pointerEvents: "none", opacity: 0.9 }} />
                      )}
                
                  {item.type === "video" && isDriveUrl(item.url) && (
                    <div style={{ position: "absolute", top: 10, left: 10, backgroundColor: "#0A66C2", color: "#FFFFFF", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, zIndex: 2 }}>
                      Drive
                    </div>
                  )}
                </div>

                <div style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1D2226", margin: 0, lineHeight: 1.35 }}>{item.title}</h3>
                    <BookmarkButton mediaId={item.media_id} inline size={18} />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "10px 0" }}>
                    {item.tags && item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={{ backgroundColor: "#F3F2EF", color: "#56687A", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: "1px solid #E6E9EC" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 13, color: "#56687A", margin: 0 }}>{formatDate(item.createdAt)}</p>
                    <div style={{ display: "flex", alignItems: "center", color: "#FFB800" }}>
                      <StarIcon style={{ marginRight: 4, width: 16, height: 16 }} />
                      <span style={{ fontSize: 13, color: "#56687A" }}>4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#56687A", fontSize: 16 }}>No content found. Try a different search or filter.</div>
        )}
      </div>

      <div style={{
        backgroundColor: "#F3F2EF",
        padding: "24px 20px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
      }}>
        <h2 style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#283E4A",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          Suggested Videos
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          justifyContent: "center"
        }}>
          {suggestedItems.map((item) => (
            item.type !== "pdf" ? null : (


              <div
                key={item.media_id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  transition: "transform 120ms ease, box-shadow 120ms ease"
                }}
                onClick={() => handleViewDetails(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{
                  position: "relative",
                  height: "180px",
                  backgroundColor: "#E6E9EC"
                }}>
                  <img
                    src={getThumbnail(item)}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "#283E4A",
                    color: "#FFFFFF",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "capitalize"
                  }}>
                    Video
                  </span>

                  {item.video_length && (
                    <span style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: "rgba(40, 62, 74, 0.9)",
                      color: "#FFFFFF",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 500
                    }}>
                      {item.video_length}
                    </span>
                  )}

                  {isDriveUrl(item.url) && (
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#0A66C2",
                      color: "#FFFFFF",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      zIndex: 2
                    }}>
                      Drive
                    </div>
                  )}
                </div>

                <div style={{ padding: "16px" }}>
                  <h3 style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1D2226",
                    marginBottom: "8px",
                    lineHeight: "1.3",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: "14px",
                    color: "#56687A",
                    margin: 0,
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    marginBottom: "12px"
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "12px"
                  }}>
                    {item.tags && item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={{
                        backgroundColor: "#F3F2EF",
                        color: "#56687A",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "1px solid #E6E9EC"
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )))}
        </div>
      </div>
    </>
  );
}
