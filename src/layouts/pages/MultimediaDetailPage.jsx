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
  FileText
} from "lucide-react";
import getThumbnail from "../../hooks/useThumbnail";

export default function MultimediaDetailPage() {
  const { state } = useLocation();
  const [multimedia, setMultimedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [audioErrored, setAudioErrored] = useState(false);
  const { id } = useParams();
  

  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const chipBg = "#E9F3FF";
  const surface = "#FFFFFF";
  const line = "#E6E9EC";

  const getMediaUrl = (url) => (url && url.startsWith("uploads/") ? `${apiurl}/${url}` : url);

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

  const getDriveDownloadUrl = (urlOrId = "") => {
    const fileId = extractDriveId(urlOrId);
    if (!fileId) return urlOrId;
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  const looksLikePdf = (url = "") => /\.pdf(\?|$)/i.test(url);

  const getPdfEmbedUrl = (url = "") => {
    if (!url) return "";
    if (url.startsWith("uploads/")) return getMediaUrl(url);
    if (isDriveUrl(url)) return getDrivePreviewUrl(url);
    if (looksLikePdf(url)) return url;
    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
  };

  const getMimeFromUrl = (url = "") => {
    const lower = url.toLowerCase();
    if (lower.endsWith(".mp3")) return "audio/mpeg";
    if (lower.endsWith(".wav")) return "audio/wav";
    if (lower.endsWith(".m4a")) return "audio/mp4";
    if (lower.endsWith(".ogg")) return "audio/ogg";
    return "";
  };

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
          axios.get(`${apiurl}/api/multimedia`)
        ]);
        setMultimedia(state ? state : multimediaRes.data);
        const allItems = allItemsRes.data;
        setRelatedContent(generateRandomContent(allItems, 4, id));
        setPopularContent(generateRandomContent(allItems, 4, id));
        setLoading(false);
      } catch {
        setError("Failed to load multimedia");
        setLoading(false);
        toast.error("Error loading multimedia");
      }
    };
    fetchMultimedia();
  }, [id, state]);

  const getMediaIcon = (type) => {
    const s = 18;
    const m = { marginRight: 8 };
    if (type === "video") return <VideoIcon size={s} style={m} />;
    if (type === "audio") return <AudioIcon size={s} style={m} />;
    if (type === "pdf") return <PdfIcon size={s} style={m} />;
    if (type === "image") return <ImageIcon size={s} style={m} />;
    return null;
  };

  const handleRate = async (value) => {
    try {
      await axios.post(`${apiurl}/api/multimedia/${id}/rate`, { rating: value });
      toast.success("Thanks for the rating!");
      const response = await axios.get(`${apiurl}/api/multimedia/${id}`);
      setMultimedia(response.data);
    } catch {
      toast.error("Error submitting rating");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", color: brandInk }}>
        Loading…
      </div>
    );
  }

  if (error || !multimedia) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", color: brandInk }}>
        {error || "Not found"}
      </div>
    );
  }

  const audioSrc = (() => {
    if (multimedia.type !== "audio") return "";
    const url = multimedia.url || "";
    if (!url) return "";
    if (url.startsWith("uploads/")) return getMediaUrl(url);
    if (isDriveUrl(url)) return getDriveDownloadUrl(url);
    return url;
  })();

  const audioType = getMimeFromUrl(audioSrc);
  const pdfSrc = multimedia.type === "pdf" ? getPdfEmbedUrl(multimedia.url || "") : "";
  const getDriveViewUrl = (urlOrId = "") => {
    const d = extractDriveId(urlOrId);
    return d ? `https://drive.google.com/file/d/${d}/view` : urlOrId;
  };
  const looksLikeDirectAudio = (url = "") => /\.(mp3|m4a|aac|wav|ogg|opus)(\?|$)/i.test(url);

  return (
    <div style={{ backgroundColor: "#F3F2EF", minHeight: "100vh", padding: "24px", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", color: brandInk }}>
      <Link to="/multimedia" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", color: brandBlue, marginBottom: 16, fontWeight: 700, gap: 8 }}>
        <ArrowLeft size={16} />
        Back to Library
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "70% 28%", gap: "2%", maxWidth: 1200, margin: "0 auto" }}>
        {/* Left Side - Main Content (70%) */}
        <div style={{ width: "100%" }}>
          <div style={{ background: surface, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", padding: 24, marginBottom: 20 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: ["audio", "pdf"].includes(multimedia.type) ? 0 : "56.25%",
                backgroundColor: "#000",
                borderRadius: 10,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                minHeight: multimedia.type === "audio" ? 96 : multimedia.type === "pdf" ? 720 : undefined
              }}
            >
              {multimedia.type === "video" &&
                (multimedia.url.startsWith("uploads/") ? (
                  <video controls style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                    <source src={getMediaUrl(multimedia.url)} />
                  </video>
                ) : isDriveUrl(multimedia.url) ? (
                  <iframe
                    src={getDrivePreviewUrl(multimedia.url)}
                    title={multimedia.title || "Drive Video"}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    src={multimedia.url}
                    title={multimedia.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ))}

              {multimedia.type === "audio" && (
                <div style={{ width: "100%", padding: 16 }}>
                  {isDriveUrl(multimedia.url) || audioErrored || !looksLikeDirectAudio(audioSrc) ? (
                    <iframe
                      src={getDrivePreviewUrl(multimedia.url)}
                      title={multimedia.title || "Drive Audio"}
                      style={{ width: "100%", height: 160, border: "none", background: "#000" }}
                      allow="autoplay"
                    />
                  ) : (
                    <audio
                      controls
                      controlsList="nodownload noplaybackrate"
                      preload="metadata"
                      style={{ width: "100%" }}
                      src={audioSrc}
                      crossOrigin="anonymous"
                      onError={() => setAudioErrored(true)}
                    >
                      {audioType && <source src={audioSrc} type={audioType} />}
                    </audio>
                  )}
                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a
                      href={isDriveUrl(multimedia.url) ? getDriveDownloadUrl(multimedia.url) : audioSrc}
                      download
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: brandBlue, color: "#FFFFFF", borderRadius: 999, padding: "10px 14px", textDecoration: "none", fontWeight: 700 }}
                    >
                      <Download size={16} />
                      Download
                    </a>
                    {isDriveUrl(multimedia.url) && (
                      <a
                        href={getDriveViewUrl(multimedia.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EEF3F8", color: brandInk, borderRadius: 999, padding: "10px 14px", textDecoration: "none", fontWeight: 700 }}
                      >
                        Open in Drive
                      </a>
                    )}
                  </div>
                </div>
              )}

              {multimedia.type === "image" && <img src={getMediaUrl(multimedia.url)} alt={multimedia.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}

              {multimedia.type === "pdf" && (
                <iframe
                  src={pdfSrc}
                  title={multimedia.title || "PDF Preview"}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", background: "#fff" }}
                  allow="clipboard-write"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}

              <span
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  color: "#FFFFFF",
                  backgroundColor: "rgba(0,0,0,0.55)",
                  padding: "4px 10px",
                  borderRadius: 8,
                  textTransform: "uppercase",
                  fontSize: 12,
                  letterSpacing: 0.3,
                  fontWeight: 700
                }}
              >
                {multimedia.type}
              </span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, color: brandInk, marginBottom: 12, lineHeight: 1.3 }}>{multimedia.title}</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 20, color: brandMute, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {getMediaIcon(multimedia.type)}
                {multimedia.type}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <StarIcon size={16} style={{ color: "#FFB800" }} />
                {multimedia.rating_avg ? multimedia.rating_avg.toFixed(1) : "0.0"}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <FileText size={16} style={{ color: brandMute }} />
                {new Date(multimedia.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
              {multimedia.tags?.map((tag, idx) => (
                <span key={idx} style={{ backgroundColor: chipBg, color: brandBlue, padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
                  #{tag}
                </span>
              ))}
            </div>

            {multimedia.description && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: brandInk, marginBottom: 8 }}>Description</h3>
                <p style={{ color: brandMute, lineHeight: 1.6, fontSize: 15 }}>{multimedia.description}</p>
              </div>
            )}

            {multimedia.transcript && (
              <div style={{ marginBottom: 24 }}>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  style={{ background: "#EEF3F8", color: brandInk, padding: "10px 16px", borderRadius: 10, border: "1px solid " + line, fontWeight: 700, cursor: "pointer" }}
                >
                  {showTranscript ? "Hide transcript" : "Show transcript"}
                </button>
                {showTranscript && <div style={{ background: "#FAFBFC", padding: 16, borderRadius: 10, fontSize: 15, color: brandInk, lineHeight: 1.6, marginTop: 12 }}>{multimedia.transcript}</div>}
              </div>
            )}

            <div style={{ background: "#FAFBFC", padding: 16, borderRadius: 12, display: "flex", flexDirection: "column", gap: 10, border: "1px solid " + line }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: brandInk, margin: 0 }}>Rate this content</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((val) => {
                  const active = val <= Math.round(multimedia.rating_avg || 0);
                  return (
                    <StarIcon
                      key={val}
                      onClick={() => handleRate(val)}
                      size={28}
                      style={{ cursor: "pointer", transition: "transform 100ms ease", color: active ? "#FFB800" : "#C5CED6" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  );
                })}
              </div>
              <div style={{ color: brandMute, fontSize: 14 }}>
                Average {multimedia.rating_avg ? multimedia.rating_avg.toFixed(1) : "0.0"} • {multimedia.rating_count || 0} ratings
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Related Content (30%) */}
        <div style={{ width: "100%" }}>
          <div style={{ background: surface, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: brandInk, marginBottom: 16 }}>Related</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {relatedContent.map((item) => (
                <Link key={item.media_id} to={`/multimedia/${item.media_id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: brandInk }}>
                  <div style={{ width: 56, height: 56, backgroundColor: chipBg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src={getThumbnail(item)} alt={item.title} style={{width:"100%"}}/>
                    {/* {getMediaIcon(item.type)} */}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3, color: brandInk, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: brandMute, marginTop: 4 }}>
                      <StarIcon size={14} style={{ color: "#FFB800" }} />
                      {item.rating_avg ? item.rating_avg.toFixed(1) : "N/A"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ background: surface, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", padding: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: brandInk, marginBottom: 16 }}>Popular this week</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {popularContent.map((item) => (
                <Link key={item.media_id} to={`/multimedia/${item.media_id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: brandInk }}>
                  <div style={{ width: 56, height: 56, backgroundColor: chipBg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                   <img src={getThumbnail(item)} alt={item.title} style={{width:"100%"}}/>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3, color: brandInk, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: brandMute, marginTop: 4 }}>
                      <StarIcon size={14} style={{ color: "#FFB800" }} />
                      {item.rating_avg ? item.rating_avg.toFixed(1) : "N/A"}
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