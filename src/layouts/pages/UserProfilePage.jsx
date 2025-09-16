import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiurl } from "../../api";
import {
  Camera,
  User2,
  FileText,
  GraduationCap,
  Heart,
  RefreshCcw,
  Calendar,
  CheckCircle2,
  Eye,
  Download,
  FolderOpen,
  X,
  PenLine
} from "lucide-react";

const PROFILE_CACHE_KEY = "user_profile_cache_v1";
const WORK_EXP_KEY = "user_work_experience";

// ---------- Local storage helpers ----------
function readWorkExp() {
  try {
    return localStorage.getItem(WORK_EXP_KEY) || "";
  } catch {
    return "";
  }
}
function writeWorkExp(exp) {
  try {
    localStorage.setItem(WORK_EXP_KEY, exp);
  } catch { }
}
function readProfileCache() {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.item) return null;
    return parsed.item;
  } catch {
    return null;
  }
}
function writeProfileCache(profile) {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ item: profile, savedAt: Date.now() }));
  } catch { }
}

// ---------- Resume helpers ----------
const getFileExt = (url = "", fallback = "") => {
  try {
    const u = new URL(url);
    const base = (u.pathname.split("/").pop() || "").split("?")[0];
    const ext = (base.split(".").pop() || "").toLowerCase();
    return ext || (fallback || "").toLowerCase();
  } catch {
    const clean = (url || "").split("?")[0].toLowerCase();
    const ext = (clean.split(".").pop() || "").toLowerCase();
    return ext || (fallback || "").toLowerCase();
  }
};

const isPDF = (url, fallbackExt = "") => getFileExt(url, fallbackExt) === "pdf";

// Google Docs Viewer for doc/docx (PDF can load directly)
const buildPreviewUrl = (cloudUrl) => {
  if (!cloudUrl) return "";
  // If already ends in .pdf, just return it
  if (cloudUrl.toLowerCase().endsWith(".pdf")) return cloudUrl;
  // Force PDF delivery: replace /upload/ with /upload/f_pdf/
  return cloudUrl.replace("/upload/", "/upload/f_pdf/") + ".pdf";
};

// Prefer DB name+ext; fallback to URL basename
const fileNameFromProfile = (profile) => {
  if (!profile) return "resume";
  const fromDb = `${profile.resume_name || ""}${profile.resume_ext ? "." + profile.resume_ext : ""}`.trim();
  if (fromDb && fromDb !== ".") return fromDb;
  try {
    const u = new URL(profile.resume);
    const base = (u.pathname.split("/").pop() || "").split("?")[0];
    return base || "resume";
  } catch {
    return "resume";
  }
};

// Build a Cloudinary "attachment" URL to suggest a download filename
// Insert /fl_attachment[:<filename>] immediately after /upload
const buildAttachmentUrl = (cloudinaryUrl, suggestedFilename) => {
  try {
    const u = new URL(cloudinaryUrl);
    const parts = u.pathname.split("/");
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx > -1) {
      const attach = suggestedFilename ? `fl_attachment:${encodeURIComponent(suggestedFilename)}` : "fl_attachment";
      parts.splice(uploadIdx + 1, 0, attach);
      u.pathname = parts.join("/");
      return u.toString();
    }
    return cloudinaryUrl;
  } catch {
    return cloudinaryUrl;
  }
};

export default function UserProfilePage() {
  const [formData, setFormData] = useState({
    education_level: "",
    interests: "",
    work_experience: "",
  });

  const [user, setUser] = useState(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const c = {
    bg: "#F3F2EF",
    card: "#FFFFFF",
    ink: "#1D2226",
    sub: "#6B7280",
    primary: "#0A66C2",
    primaryDeep: "#084482",
    ring: "#DCE6F1",
    soft: "#F5F8FC",
    border: "#E6E6E6",
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    if (!storedUser) return;

    const cached = readProfileCache();
    const localWorkExp = readWorkExp();

    if (cached) {
      setUserProfile(cached);
      setFormData({
        education_level: cached.education_level || "",
        interests: Array.isArray(cached.interests) ? cached.interests.join(", ") : cached.interests || "",
        work_experience: localWorkExp || "",
      });
      // If cache has no resume (first load), fetch fresh
      if (!cached.resume) {
        fetchUserProfile();
      }
    } else {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiurl}/api/user-profiles/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      if (res.data) {
        setUserProfile(res.data);
        writeProfileCache(res.data);
        const localWorkExp = readWorkExp();
        setFormData({
          education_level: res.data.education_level || "",
          interests: Array.isArray(res.data.interests) ? res.data.interests.join(", ") : res.data.interests || "",
          work_experience: localWorkExp || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const f = new FormData();
      f.append("education_level", formData.education_level || "");
      const interestsArray = formData.interests
        ? formData.interests.split(",").map((x) => x.trim()).filter(Boolean)
        : [];
      f.append("interests", JSON.stringify(interestsArray));

      // Save work experience locally only
      if (formData.work_experience) {
        writeWorkExp(formData.work_experience);
      }

      if (formData.profile_image) f.append("profile_image", formData.profile_image);

      const res = await axios.post(`${apiurl}/api/user-profiles/`, f, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      if (res.data) {
        toast.success("Profile updated");
        setUserProfile(res.data);
        writeProfileCache(res.data);
        setShowEdit(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please select a file");
      return;
    }
    try {
      setIsLoading(true);
      const fd = new FormData();
      fd.append("resume", resumeFile);
      await axios.post(`${apiurl}/api/user-profiles/resume`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      toast.success("Resume uploaded");
      setResumeFile(null);
      await fetchUserProfile(); // refresh to pick secure_url, ext, name
    } catch (err) {
      console.error("Error uploading resume:", err);
      toast.error("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

 const handleDownloadResume = () => {
  if (!userProfile?.resume) {
    toast.error("No resume found");
    return;
  }
  const link = document.createElement("a");
  link.href = userProfile.resume;        // original secure_url
  link.setAttribute("download", fileNameFromUrl(userProfile.resume));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  if (!user) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          background: c.bg,
          fontFamily:
            'Segoe UI, Helvetica, Arial, system-ui, -apple-system, "Noto Sans", sans-serif',
          color: c.sub,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <RefreshCcw size={20} />
          <span>Loading profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        background: `linear-gradient(135deg, ${c.soft} 0%, #c9d7ea 100%)`,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily:
          'Segoe UI, Helvetica, Arial, system-ui, -apple-system, "Noto Sans", sans-serif',
      }}
    >
      <div
        style={{
          background: c.card,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 880,
          overflow: "hidden",
          margin: 20,
          border: `1px solid ${c.border}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: 26,
            background: `linear-gradient(120deg, ${c.primary} 0%, ${c.primaryDeep} 100%)`,
            color: "white",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", width: 112, height: 112 }}>
            <img
              src={
                userProfile?.profile_image
                  ? `${userProfile?.profile_image}`
                  : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
              }
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid rgba(255,255,255,0.35)",
              }}
            />
            <label
              htmlFor="avatar-upload"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                cursor: "pointer",
                transition: "opacity 160ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <Camera size={26} color="#fff" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && !file.type.startsWith("image/")) {
                  toast.error("Only image files allowed");
                  return;
                }
                setFormData({ ...formData, profile_image: file });
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: "1.75rem", margin: "0 0 6px 0", fontWeight: 700 }}>
              {user.username}
            </h2>
            <p style={{ margin: "0 0 10px 0", opacity: 0.95 }}>{user.email}</p>
            <span
              style={{
                background: "rgba(255,255,255,0.25)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: "0.85rem",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
              }}
            >
              {user.role || "User"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${c.border}`, background: "#FAFAFA" }}>
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              flex: 1,
              padding: 14,
              background: activeTab === "profile" ? "#fff" : "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
              color: activeTab === "profile" ? c.primary : c.sub,
              borderBottom: activeTab === "profile" ? `3px solid ${c.primary}` : "3px solid transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 120ms ease",
            }}
          >
            <User2 size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            style={{
              flex: 1,
              padding: 14,
              background: activeTab === "resume" ? "#fff" : "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
              color: activeTab === "resume" ? c.primary : c.sub,
              borderBottom: activeTab === "resume" ? `3px solid ${c.primary}` : "3px solid transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 120ms ease",
            }}
          >
            <FileText size={18} />
            Resume
          </button>
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div style={{ padding: 26 }}>
            <h3
              style={{
                fontSize: "1.35rem",
                color: "#2c3e50",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: `2px solid ${c.border}`,
              }}
            >
              Profile Details
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 14,
                  background: "#F8F9FA",
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    display: "grid",
                    placeItems: "center",
                    background: c.primary,
                    color: "#fff",
                    borderRadius: "50%",
                  }}
                >
                  <GraduationCap size={22} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.85rem", color: c.sub, marginBottom: 4 }}>Education Level</span>
                  <span style={{ fontSize: "1rem", color: "#2c3e50", fontWeight: 600 }}>
                    {userProfile?.education_level || "Not specified"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 14,
                  background: "#F8F9FA",
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    display: "grid",
                    placeItems: "center",
                    background: c.primary,
                    color: "#fff",
                    borderRadius: "50%",
                  }}
                >
                  <Heart size={22} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.85rem", color: c.sub, marginBottom: 4 }}>Interests</span>
                  <span style={{ fontSize: "1rem", color: "#2c3e50", fontWeight: 600 }}>
                    {userProfile?.interests && Array.isArray(userProfile.interests)
                      ? userProfile.interests.join(", ")
                      : userProfile?.interests || "Not specified"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 14,
                  background: "#F8F9FA",
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    display: "grid",
                    placeItems: "center",
                    background: c.primary,
                    color: "#fff",
                    borderRadius: "50%",
                  }}
                >
                  <RefreshCcw size={22} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.85rem", color: c.sub, marginBottom: 4 }}>Last Updated</span>
                  <span style={{ fontSize: "1rem", color: "#2c3e50", fontWeight: 600 }}>
                    {userProfile?.updated_at ? new Date(userProfile.updated_at).toLocaleDateString() : "Never"}
                  </span>
                </div>
              </div>

              {(formData.work_experience || userProfile?.work_experience) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: 14,
                    background: "#F8F9FA",
                    borderRadius: 10,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      display: "grid",
                      placeItems: "center",
                      background: c.primary,
                      color: "#fff",
                      borderRadius: "50%",
                    }}
                  >
                    <FileText size={22} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.85rem", color: c.sub, marginBottom: 4 }}>Work Experience</span>
                    <span style={{ fontSize: "1rem", color: "#2c3e50", fontWeight: 600 }}>
                      {userProfile?.work_experience || formData.work_experience}
                    </span>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 14,
                  background: "#F8F9FA",
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    display: "grid",
                    placeItems: "center",
                    background: c.primary,
                    color: "#fff",
                    borderRadius: "50%",
                  }}
                >
                  <Calendar size={22} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.85rem", color: c.sub, marginBottom: 4 }}>Member Since</span>
                  <span style={{ fontSize: "1rem", color: "#2c3e50", fontWeight: 600 }}>
                    {new Date(userProfile?.created_at || user.date_joined).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {user?.user_id && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => setShowEdit(true)}
                  disabled={isLoading}
                  style={{
                    padding: "12px 20px",
                    background: c.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 10px 18px rgba(10,102,194,0.2)",
                  }}
                >
                  <PenLine size={18} />
                  {isLoading ? "Saving..." : userProfile ? "Edit Profile" : "Add Profile"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Resume tab */}
        {activeTab === "resume" && (
          <div style={{ padding: 26 }}>
            <h3
              style={{
                fontSize: "1.35rem",
                color: "#2c3e50",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: `2px solid ${c.border}`,
              }}
            >
              Resume Management
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 18,
                background: "#E8F4FF",
                borderRadius: 10,
                marginBottom: 20,
                border: `1px solid ${c.ring}`,
              }}
            >
              <div style={{ display: "grid", placeItems: "center" }}>
                {userProfile?.resume ? (
                  <CheckCircle2 size={28} color={c.primaryDeep} />
                ) : (
                  <FileText size={28} color={c.primaryDeep} />
                )}
              </div>
              <div>
                <h4 style={{ margin: "0 0 6px 0", color: "#2c3e50" }}>Current Resume Status</h4>
                <p style={{ margin: 0, color: c.sub }}>
                  {userProfile?.resume
                    ? "Your resume is uploaded and ready to view."
                    : "No resume uploaded yet. Add one to increase opportunities."}
                </p>
                {userProfile?.resume && (
                  <p style={{ margin: "8px 0 0 0", color: c.sub, fontSize: ".9rem" }}>
                    File: <strong>{fileNameFromProfile(userProfile)}</strong>
                  </p>
                )}
              </div>
            </div>

            {userProfile?.resume && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ marginBottom: 10, color: "#2c3e50" }}>Resume Actions</h4>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setShowResumePreview(!showResumePreview)}
                    style={{
                      padding: "10px 16px",
                      background: "#fff",
                      color: c.primary,
                      border: `1px solid ${c.primary}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Eye size={18} />
                    {showResumePreview ? "Hide Preview" : "Preview Resume"}
                  </button>
                  <button
                    onClick={handleDownloadResume}
                    style={{
                      padding: "10px 16px",
                      background: "#fff",
                      color: c.primary,
                      border: `1px solid ${c.primary}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Download size={18} />
                    Download Resume
                  </button>
                </div>

                {showResumePreview && (
                  <div
                    style={{
                      marginTop: 16,
                      border: `1px solid ${c.border}`,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    {/* Debug header with raw URL (handy if preview fails) */}
                    <div style={{ padding: 10, background: "#fff", borderBottom: `1px solid ${c.border}`, fontSize: 12, color: c.sub }}>
                      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                        <strong>URL:</strong>{" "}
                        <a href={userProfile.resume} target="_blank" rel="noreferrer">
                          {userProfile.resume}
                        </a>
                        {userProfile?.resume_ext ? <> &nbsp;|&nbsp; <strong>ext:</strong> {userProfile.resume_ext}</> : null}
                      </div>
                    </div>

                    {/* Primary preview via iframe (PDF directly, DOC/DOCX via Google Viewer) */}
                    <iframe
                      src={buildPreviewUrl(userProfile?.resume)}
                      title="Resume Preview"
                      style={{ width: "100%", height: 520, border: "none" }}
                    />
                  </div>
                )}
              </div>
            )}

            {user?.user_id && (
              <div
                style={{
                  padding: 18,
                  background: "#F8F9FA",
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", color: "#2c3e50" }}>
                  {userProfile?.resume ? "Update Your Resume" : "Add Resume"}
                </h4>
                <p style={{ margin: "0 0 14px 0", color: c.sub, fontSize: "0.92rem" }}>
                  PDF, DOC, or DOCX
                </p>
                <form onSubmit={handleResumeUpload} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ position: "relative" }}>
                    <label
                      htmlFor="resume-upload"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 16px",
                        background: "#fff",
                        border: `1px dashed ${c.border}`,
                        borderRadius: 10,
                        cursor: "pointer",
                      }}
                    >
                      <FolderOpen size={18} />
                      {resumeFile ? resumeFile.name : "Choose file"}
                    </label>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!resumeFile || isLoading}
                    style={{
                      padding: "12px 18px",
                      background: c.primary,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      cursor: !resumeFile || isLoading ? "not-allowed" : "pointer",
                      fontWeight: 800,
                      letterSpacing: ".02em",
                      boxShadow: "0 10px 18px rgba(10,102,194,0.2)",
                    }}
                  >
                    {isLoading ? "Uploading..." : userProfile?.resume ? "Update Resume" : "Add Resume"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {showEdit && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              width: "100%",
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 22px",
                borderBottom: `1px solid ${c.border}`,
              }}
            >
              <h3 style={{ margin: 0, color: "#2c3e50" }}>
                {userProfile ? "Edit Profile" : "Add Profile"}
              </h3>
              <button
                onClick={() => setShowEdit(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: c.sub }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 22 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>
                  Education Level
                </label>
                <select
                  value={formData.education_level}
                  onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    border: `1px solid ${c.border}`,
                    borderRadius: 10,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>
                  Interests
                </label>
                <textarea
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Separate with commas (e.g., Programming, Design, Marketing)"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    border: `1px solid ${c.border}`,
                    borderRadius: 10,
                    fontSize: "1rem",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                    color: "#2c3e50",
                  }}
                >
                  Work Experience
                </label>
                <textarea
                  value={formData.work_experience}
                  onChange={(e) => setFormData({ ...formData, work_experience: e.target.value })}
                  placeholder="e.g., 2 years as Software Engineer at XYZ"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    border: `1px solid ${c.border}`,
                    borderRadius: 10,
                    fontSize: "1rem",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: 6 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>
                  Profile Image
                </label>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <label
                    htmlFor="profile-image-upload"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 16px",
                      background: "#fff",
                      border: `1px dashed ${c.border}`,
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                  >
                    <Camera size={18} />
                    {formData.profile_image ? formData.profile_image.name : "Choose image"}
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && !file.type.startsWith("image/")) {
                        toast.error("Only image files allowed");
                        return;
                      }
                      setFormData({ ...formData, profile_image: file });
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                padding: "16px 22px",
                borderTop: `1px solid ${c.border}`,
              }}
            >
              <button
                onClick={() => setShowEdit(false)}
                style={{
                  padding: "10px 16px",
                  background: "#fff",
                  color: c.primary,
                  border: `1px solid ${c.primary}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                style={{
                  padding: "10px 16px",
                  background: c.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 800,
                }}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Busy overlay */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: c.primaryDeep }}>
            <RefreshCcw size={20} />
            <span>Working…</span>
          </div>
        </div>
      )}
    </div>
  );
}
