import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { apiurl } from "../../api";
import { useBookmark } from "../../hooks/useBookmark";
import { Bookmark, BookmarkCheck, ArrowLeft, FileText, CalendarDays, Download as DownloadIcon, ExternalLink, RefreshCcw } from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";

const CACHE_KEY = "resources_cache_v1";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed.items;
  } catch {
    return null;
  }
}

function writeCache(items) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ items, savedAt: Date.now() }));
  } catch { }
}

function upsertCache(item) {
  const items = readCache() || [];
  const idx = items.findIndex(
    (x) =>
      String(x.resource_id) === String(item.resource_id) ||
      String(x._id) === String(item._id)
  );
  if (idx >= 0) items[idx] = item;
  else items.push(item);
  writeCache(items);
}

function findInCacheById(items, id) {
  if (!Array.isArray(items)) return null;
  return (
    items.find((x) => String(x.resource_id) === String(id)) ||
    items.find((x) => String(x._id) === String(id)) ||
    null
  );
}

export default function ResourceDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate()
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("preview");
  const { isBookmarked, loading: bookmarkLoading, toggleBookmark } = useBookmark("resource", id);

  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const chipBg = "#E9F3FF";
  const line = "#E6E9EC";

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError("");

        const stateResource = location.state;
        if (stateResource) {
          setResource(stateResource);
          upsertCache(stateResource);
          setLoading(false);
          return;
        }

        const cached = readCache();
        if (cached && cached.length) {
          const found = findInCacheById(cached, id);
          if (found) {
            setResource(found);
            setLoading(false);
            return;
          }
        }

        const res = await axios.get(`${apiurl}/api/resources/${id}`);
        setResource(res.data);
        upsertCache(res.data);
      } catch {
        setError("Failed to fetch resource. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, location.state]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getFileType = (filename) => {
    if (!filename) return "File";
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "PDF Document";
    if (["doc", "docx"].includes(ext)) return "Word Document";
    if (["xls", "xlsx"].includes(ext)) return "Excel Spreadsheet";
    if (["ppt", "pptx"].includes(ext)) return "PowerPoint Presentation";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "Image";
    return "File";
  };

  const handleDownload = () => {
    let fileUrl = resource.file_url;
    if (!fileUrl) return;
    if (fileUrl.includes("drive.google.com")) {
      const fileId = fileUrl.match(/\/d\/(.*?)\//)?.[1] || fileUrl.match(/[?&]id=([^&]+)/)?.[1];
      if (fileId) fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", resource.title || "resource");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          color: brandInk
        }}
      >
        <div style={{ width: 20, height: 20, border: "3px solid #E6E9EC", borderTopColor: brandBlue, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <span>Loading resource details…</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid " + line,
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            textAlign: "center",
            maxWidth: 480
          }}
        >
          <h3 style={{ margin: 0, marginBottom: 8, color: brandInk, fontSize: 18, fontWeight: 800 }}>{error}</h3>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              backgroundColor: "#EEF3F8",
              color: brandInk,
              border: "1px solid " + line,
              borderRadius: 10,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <RefreshCcw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          color: brandMute
        }}
      >
        Not found
      </div>
    );
  }

  return (
    <>
    {/* <Breadcrumbs /> */}
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F3F2EF",
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        color: brandInk
      }}
      >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
          style={{
            marginBottom: 20,
            padding: "8px 14px",
            backgroundColor: "#EEF3F8",
            color: brandBlue,
            border: "1px solid #E6E9EC",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />

        </button>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            border: "1px solid " + line,
            overflow: "hidden"
          }}
        >
          <div style={{ padding: 20, borderBottom: "1px solid " + line }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: brandInk, lineHeight: 1.25 }}>{resource.title}</h1>
              <button
                onClick={toggleBookmark}
                disabled={bookmarkLoading}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid " + line,
                  cursor: bookmarkLoading ? "not-allowed" : "pointer",
                  padding: 10,
                  borderRadius: 12,
                  color: isBookmarked ? "#FFC107" : "#7A8A99",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 800
                }}
                title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
              >
                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                <span style={{ fontSize: 14 }}>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {resource.category && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: chipBg,
                    color: brandBlue,
                    border: "1px solid #D7E9FF",
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800
                  }}
                >
                  <FileText size={14} />
                  {resource.category}
                </span>
              )}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: "#EEF3F8",
                  color: brandMute,
                  border: "1px solid " + line,
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800
                }}
              >
                <CalendarDays size={14} />
                {formatDate(resource.createdAt)}
              </span>
              {typeof resource.views_count === "number" && (
                <span style={{ color: brandMute, fontSize: 12, fontWeight: 700 }}>{resource.views_count} views</span>
              )}
            </div>

            <p style={{ marginTop: 12, color: brandMute, lineHeight: 1.6 }}>{resource.description}</p>
          </div>

          <div style={{ padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                background: "#FAFBFC",
                border: "1px solid " + line,
                borderRadius: 12,
                padding: 6,
                width: "fit-content"
              }}
            >
              <button
                onClick={() => setViewMode("preview")}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  color: viewMode === "preview" ? "#FFFFFF" : brandInk,
                  background: viewMode === "preview" ? brandBlue : "transparent"
                }}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode("download")}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  color: viewMode === "download" ? "#FFFFFF" : brandInk,
                  background: viewMode === "download" ? brandBlue : "transparent"
                }}
              >
                Download
              </button>
            </div>

            {viewMode === "preview" ? (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10, color: brandInk }}>Document preview</h3>
                <div
                  style={{
                    background: "#000",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid " + line,
                    minHeight: 480
                  }}
                >
                  {resource.file_url ? (
                    <iframe
                      src={
                        resource.file_url.includes("drive.google.com")
                        ? `https://drive.google.com/file/d/${resource.file_url.match(/\/d\/([^/]+)/)?.[1] ||
                          resource.file_url.match(/[?&]id=([^&]+)/)?.[1]
                        }/preview`
                        : resource.file_url
                      }
                      title="Document Preview"
                      style={{ width: "100%", height: 600, border: "none", background: "#fff" }}
                      />
                  ) : (
                    <div style={{ color: "#FFFFFF", padding: 24 }}>No file available.</div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10, color: brandInk }}>Download resource</h3>
                <div
                  style={{
                    border: "1px solid " + line,
                    background: "#FAFBFC",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12
                  }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: chipBg, color: brandBlue, border: "1px solid #D7E9FF", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>
                    <FileText size={14} />
                    {getFileType(resource.file_url)}
                  </div>
                  <p style={{ marginTop: 10, color: brandMute }}>Click a button below to save or open the file.</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <button
                    onClick={handleDownload}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: brandBlue,
                      color: "#FFFFFF",
                      border: "1px solid " + brandBlue,
                      borderRadius: 12,
                      padding: "10px 16px",
                      cursor: "pointer",
                      fontWeight: 800
                    }}
                  >
                    <DownloadIcon size={18} />
                    Download now
                  </button>
                  {resource.file_url && (
                    <Link
                    to={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        backgroundColor: "#FFFFFF",
                        color: brandBlue,
                        border: "1px solid " + brandBlue,
                        borderRadius: 12,
                        padding: "10px 16px",
                        textDecoration: "none",
                        fontWeight: 800
                      }}
                    >
                      <ExternalLink size={18} />
                      Open in new tab
                    </Link>
                  )}
                </div>
              </div>
            )}

            {resource.tag && resource.tag.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10, color: brandInk }}>Tags</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {resource.tag.map((t, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: "#EEF3F8",
                        color: brandMute,
                        border: "1px solid " + line,
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10, color: brandInk }}>Details</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12
                }}
              >
                <div
                  style={{
                    border: "1px solid " + line,
                    borderRadius: 12,
                    padding: 12,
                    background: "#FFFFFF"
                  }}
                >
                  <label style={{ display: "block", fontSize: 12, color: brandMute, marginBottom: 4 }}>Created by</label>
                  <span style={{ fontWeight: 700, color: brandInk }}>{resource.created_by || "Not specified"}</span>
                </div>
                <div
                  style={{
                    border: "1px solid " + line,
                    borderRadius: 12,
                    padding: 12,
                    background: "#FFFFFF"
                  }}
                >
                  <label style={{ display: "block", fontSize: 12, color: brandMute, marginBottom: 4 }}>Created</label>
                  <span style={{ fontWeight: 700, color: brandInk }}>{formatDate(resource.createdAt)}</span>
                </div>
                <div
                  style={{
                    border: "1px solid " + line,
                    borderRadius: 12,
                    padding: 12,
                    background: "#FFFFFF"
                  }}
                >
                  <label style={{ display: "block", fontSize: 12, color: brandMute, marginBottom: 4 }}>Updated</label>
                  <span style={{ fontWeight: 700, color: brandInk }}>{formatDate(resource.updatedAt)}</span>
                </div>
                <div
                  style={{
                    border: "1px solid " + line,
                    borderRadius: 12,
                    padding: 12,
                    background: "#FFFFFF"
                  }}
                >
                  <label style={{ display: "block", fontSize: 12, color: brandMute, marginBottom: 4 }}>File type</label>
                  <span style={{ fontWeight: 700, color: brandInk }}>{getFileType(resource.file_url)}</span>
                </div>
                <div
                  style={{
                    gridColumn: "1 / -1",
                    border: "1px solid " + line,
                    borderRadius: 12,
                    padding: 12,
                    background: "#FFFFFF"
                  }}
                >
                  <label style={{ display: "block", fontSize: 12, color: brandMute, marginBottom: 4 }}>Resource ID</label>
                  <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace", color: brandInk }}>{resource._id}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 16,
              borderTop: "1px solid " + line,
              background: "#FAFBFC",
              color: brandMute,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8
            }}
          >
            <span>Resource ID: {resource._id} • Version: {resource.__v}</span>
            <Link
              to="/resources"
              style={{
                color: brandBlue,
                textDecoration: "none",
                fontWeight: 800
              }}
              >
              Browse more
            </Link>
          </div>
        </div>
      </div>
    </div>
              </>
  );
}
