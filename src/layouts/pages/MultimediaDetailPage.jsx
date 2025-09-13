import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, Link, useLocation } from "react-router-dom";
import { apiurl } from "../../api";
import {
  ArrowLeft,
  Video as VideoIcon,
  Mic as AudioIcon,
  FileText as PdfIcon,
  Image as ImageIcon,
  Star as StarIcon,
  Download,
  FileText,
} from "lucide-react";

export default function MultimediaDetailPage() {
  const { state } = useLocation();
  const [multimedia, setMultimedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const { id } = useParams();

  // -------- Brand (removed purple) --------
  const brandBlue = "#1a73e8";
  const brandBlueLight = "#e9f1ff";
  const mediaBg = "#111";
  // ---------------------------------------

  // --------- helper: media URLs ---------
  const getMediaUrl = (url) => {
    if (url && url.startsWith("uploads/")) return `${apiurl}/${url}`;
    return url;
  };

  // Drive helpers
  const isDriveUrl = (url = "") =>
    typeof url === "string" &&
    (url.includes("drive.google.com") ||
      url.includes("docs.google.com/uc?") ||
      /[?&]id=/.test(url) ||
      /\/file\/d\//.test(url));

  const extractDriveId = (urlOrId = "") => {
    if (!urlOrId) return "";
    if (!urlOrId.includes("/") && !urlOrId.includes("?")) return urlOrId.trim();
    const m1 = urlOrId.match(/\/file\/d\/([^/]+)\//);
    if (m1?.[1]) return m1[1];
    const m2 = urlOrId.match(/[?&]id=([^&]+)/);
    if (m2?.[1]) return m2[1];
    return urlOrId.trim();
  };

  const getDrivePreviewUrl = (urlOrId = "", { autoplay = false, muted = false, loop = false } = {}) => {
    const fileId = extractDriveId(urlOrId);
    if (!fileId) return urlOrId;
    const base = `https://drive.google.com/file/d/${fileId}/preview`;
    const params = new URLSearchParams();
    if (autoplay) params.set("autoplay", "1");
    if (muted) params.set("mute", "1");
    if (loop) params.set("loop", "1");
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  // NEW: direct download URL for audio from Drive (works for publicly shared files)
  const getDriveDownloadUrl = (urlOrId = "") => {
    const fileId = extractDriveId(urlOrId);
    if (!fileId) return urlOrId;
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  const getMimeFromUrl = (url = "") => {
    const lower = url.toLowerCase();
    if (lower.endsWith(".mp3")) return "audio/mpeg";
    if (lower.endsWith(".wav")) return "audio/wav";
    if (lower.endsWith(".m4a")) return "audio/mp4";
    if (lower.endsWith(".ogg")) return "audio/ogg";
    return "";
  };
  // --------------------------------------

  const generateRandomContent = (sourceItems, count, excludeId = null) => {
    if (!sourceItems || sourceItems.length === 0) return [];
    const filteredItems = sourceItems.filter((item) => item.media_id !== excludeId);
    if (filteredItems.length <= count) return [...filteredItems];
    const shuffled = [...filteredItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchMultimedia = async () => {
      try {
        setLoading(true);
        const [multimediaRes, allItemsRes] = await Promise.all([
          axios.get(`${apiurl}/api/multimedia/${id}`),
          axios.get(`${apiurl}/api/multimedia`),
        ]);
        setMultimedia(state ? state : multimediaRes.data);

        const allItems = allItemsRes.data;
        setRelatedContent(generateRandomContent(allItems, 4, id));
        setPopularContent(generateRandomContent(allItems, 4, id));

        setLoading(false);
      } catch (err) {
        setError("Failed to load multimedia");
        setLoading(false);
        toast.error("Error loading multimedia");
        console.error(err);
      }
    };

    fetchMultimedia();
  }, [id, state]);

  const getMediaIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoIcon size={20} style={{ marginRight: "8px" }} />;
      case "audio":
        return <AudioIcon size={20} style={{ marginRight: "8px" }} />;
      case "pdf":
        return <PdfIcon size={20} style={{ marginRight: "8px" }} />;
      case "image":
        return <ImageIcon size={20} style={{ marginRight: "8px" }} />;
      default:
        return null;
    }
  };

  const renderStarRating = (avgRating, ratingCount) => {
    const filledStars = Math.round(avgRating);
    const starColor = "#f5c518";
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            size={18}
            style={{
              color: i < filledStars ? starColor : "#e0e0e0",
              fill: i < filledStars ? starColor : "none",
              marginRight: "2px",
            }}
          />
        ))}
        <span style={{ fontSize: "1rem", color: "#333", marginLeft: "8px", fontWeight: "bold" }}>
          {avgRating ? avgRating.toFixed(1) : "0.0"}
        </span>
        <span style={{ fontSize: "0.9rem", color: "#888", marginLeft: "4px" }}>
          ({ratingCount || 0} ratings)
        </span>
      </div>
    );
  };

  const handleRate = async (value) => {
    try {
      await axios.post(`${apiurl}/api/multimedia/${id}/rate`, { rating: value });
      toast.success("Thank you for your feedback!");
      const response = await axios.get(`${apiurl}/api/multimedia/${id}`);
      setMultimedia(response.data);
    } catch (err) {
      toast.error("Error submitting rating");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <p>Loading multimedia content...</p>
      </div>
    );
  }

  if (error || !multimedia) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <p>{error || "Multimedia not found"}</p>
      </div>
    );
  }

  // --------- AUDIO: build a reliable src (local, direct URL, or Google Drive) ---------
  const audioSrc = (() => {
    if (multimedia.type !== "audio") return "";
    const url = multimedia.url || "";
    if (!url) return "";
    if (url.startsWith("uploads/")) return getMediaUrl(url); // local upload
    if (isDriveUrl(url)) return getDriveDownloadUrl(url);     // public GDrive file
    return url;                                               // plain external URL
  })();
  const audioType = getMimeFromUrl(audioSrc);
  // -----------------------------------------------------------------------------------

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <Link
        to="/multimedia"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: brandBlue,
          marginBottom: "1.5rem",
          fontWeight: "bold",
        }}
      >
        <ArrowLeft size={16} style={{ marginRight: "8px" }} />
        Back to Media Library
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) 1fr",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Main Content Column */}
        <div>
          {/* Media Player Container */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Conditional Media Display */}
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: multimedia.type === "audio" ? "0" : "56.25%",
                backgroundColor: mediaBg, // was purple; now neutral dark
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                minHeight: multimedia.type === "audio" ? 96 : undefined,
              }}
            >
              {multimedia.type === "video" && (
                multimedia.url.startsWith("uploads/") ? (
                  <video
                    controls
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  >
                    <source src={getMediaUrl(multimedia.url)} />
                    Your browser does not support the video tag.
                  </video>
                ) : isDriveUrl(multimedia.url) ? (
                  <iframe
                    src={getDrivePreviewUrl(multimedia.url, { autoplay: false, muted: false, loop: false })}
                    title={multimedia.title || "Drive Video"}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    src={multimedia.url}
                    title={multimedia.title}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              )}

              {multimedia.type === "audio" && (
                <div style={{ width: "100%", padding: "1rem" }}>
                  <audio
                    controls
                    controlsList="play nodownload noplaybackrate"
                    preload="metadata"
                    style={{ width: "100%" }}
                    src={audioSrc}
                  >
                    {audioType && <source src={audioSrc} type={audioType} />}
                    Your browser does not support the audio element.
                  </audio>

                  {/* Download button (explicit), in case controlsList hides browser download */}
                  <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                    <a
                      href={audioSrc}
                      download
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: brandBlue,
                        color: "#fff",
                        borderRadius: "999px",
                        padding: "0.5rem 1rem",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      <Download size={16} /> Download audio
                    </a>
                    {isDriveUrl(multimedia.url) && (
                      <a
                        href={getDriveDownloadUrl(multimedia.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "#e8e8e8",
                          color: "#333",
                          borderRadius: "999px",
                          padding: "0.5rem 1rem",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        Open in Drive
                      </a>
                    )}
                  </div>
                </div>
              )}

              {multimedia.type === "image" && (
                <img
                  src={getMediaUrl(multimedia.url)}
                  alt={multimedia.title}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              )}

              {multimedia.type === "pdf" && (
                <div style={{ textAlign: "center", color: "white" }}>
                  <a
                    href={getMediaUrl(multimedia.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "white", textDecoration: "underline" }}
                  >
                    Open PDF Document
                  </a>
                </div>
              )}

              <span
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                }}
              >
                {multimedia.type}
              </span>
            </div>

            {/* Media Controls / Transcript button */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {multimedia.transcript && (
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "2rem",
                    background: "#e8e8e8",
                    color: "#333",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FileText size={18} /> Transcript
                </button>
              )}
            </div>

            {/* Title and Metadata */}
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333", marginBottom: "0.5rem" }}>
              {multimedia.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", color: "#666", marginBottom: "1.5rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {getMediaIcon(multimedia.type)} {multimedia.type}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <StarIcon size={16} color="#f5c518" /> {multimedia.rating_avg ? multimedia.rating_avg.toFixed(1) : "0.0"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <FileText size={16} color="#666" /> {new Date(multimedia.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {multimedia.tags &&
                multimedia.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: brandBlueLight,
                      color: brandBlue,
                      padding: "6px 16px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            {/* Transcript */}
            {multimedia.transcript && (
              <div style={{ marginBottom: 24 }}>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  style={{
                    background: "#dfe6e9",
                    color: "#2d3436",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: 12,
                  }}
                >
                  {showTranscript ? "Hide Transcript" : "Show Transcript"}
                </button>
                {showTranscript && (
                  <div
                    style={{
                      background: "#f5f6fa",
                      padding: 16,
                      borderRadius: 8,
                      fontSize: "1rem",
                      color: "#2d3436",
                      lineHeight: 1.5,
                    }}
                  >
                    {multimedia.transcript}
                  </div>
                )}
              </div>
            )}

            {/* Rating Section */}
            <div
              style={{
                background: "#f8f8f8",
                padding: "1.5rem",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#333" }}>Rate this content</h3>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <span
                    key={val}
                    onClick={() => handleRate(val)}
                    style={{
                      cursor: "pointer",
                      color: val <= Math.round(multimedia.rating_avg || 0) ? "#fdcb6e" : "#b2bec3",
                      fontSize: "1.8rem",
                      marginRight: 8,
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div style={{ color: "#636e72", fontSize: "0.95rem" }}>
                Average: {multimedia.rating_avg ? multimedia.rating_avg.toFixed(1) : "0.0"} (
                {multimedia.rating_count || 0} ratings)
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div>
          {/* Related Content Section */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
              Related Content
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {relatedContent.map((item, index) => (
                <Link
                  key={index}
                  to={`/multimedia/${item.media_id}`}
                  style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "#333" }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: brandBlueLight, // was purple
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getMediaIcon(item.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "bold", margin: 0, lineHeight: 1.2 }}>{item.title}</h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.9rem",
                        color: "#666",
                        marginTop: "0.25rem",
                      }}
                    >
                      <StarIcon size={14} color="#f5c518" /> {item.rating_avg ? item.rating_avg.toFixed(1) : "N/A"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular This Week Section */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
              Popular This Week
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {popularContent.map((item, index) => (
                <Link
                  key={index}
                  to={`/multimedia/${item.media_id}`}
                  style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "#333" }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: brandBlueLight, // was purple
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getMediaIcon(item.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "bold", margin: 0, lineHeight: 1.2 }}>{item.title}</h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.9rem",
                        color: "#666",
                        marginTop: "0.25rem",
                      }}
                    >
                      <StarIcon size={14} color="#f5c518" /> {item.rating_avg ? item.rating_avg.toFixed(1) : "N/A"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
