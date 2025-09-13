import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../../api";
import { useBookmark } from "../../hooks/useBookmark";
import { Bookmark, BookmarkCheck, Send, Filter, User2, Image as ImageIcon, CheckCircle2, Loader2, BadgeCheck } from "lucide-react";
import { useContext as useCtx } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ rname: "", domain: "", story_text: "", image_url: null });
  const [loading, setLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("all");

  useEffect(() => {
    axios.get(`${apiurl}/api/success-stories`).then((res) => setStories(res.data)).catch(() => setStories([]));
  }, []);

  const domains = useMemo(() => {
    const d = Array.from(new Set(stories.map((s) => (s.domain || "").trim()).filter(Boolean))).sort();
    return ["all", ...d];
  }, [stories]);

  const handleChange = (e) => {
    if (e.target.name === "image_url") {
      const file = e.target.files[0];
      if (file && !file.type.startsWith("image/")) {
        toast.error("Only image files are allowed!");
        return;
      }
      setForm({ ...form, image_url: file });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      toast.error("Please login to submit a story");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("rname", form.rname);
    data.append("domain", form.domain);
    data.append("story_text", form.story_text);
    if (form.image_url) data.append("image_url", form.image_url);
    try {
      await axios.post(`${apiurl}/api/success-stories`, data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      toast.success("Story submitted!");
      setForm({ rname: "", domain: "", story_text: "", image_url: null });
      const refreshed = await axios.get(`${apiurl}/api/success-stories`);
      setStories(refreshed.data);
    } catch {
      toast.error("Error submitting story");
    }
    setLoading(false);
  };

  const StoryBookmarkButton = ({ storyId }) => {
    const { isBookmarked, loading, toggleBookmark } = useBookmark("story", storyId);
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark();
        }}
        disabled={loading}
        style={{
          background: "none",
          border: "1px solid #E6E9EC",
          borderRadius: 12,
          padding: 8,
          cursor: loading ? "not-allowed" : "pointer",
          color: isBookmarked ? "#F59E0B" : "#6B7280",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
    );
  };

  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const line = "#E6E9EC";

  const filteredStories = useMemo(() => {
    if (selectedDomain === "all") return stories;
    return stories.filter((s) => (s.domain || "").toLowerCase() === selectedDomain.toLowerCase());
  }, [stories, selectedDomain]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", color: brandInk }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#E9F3FF", border: "1px solid #D7E9FF", color: brandBlue, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BadgeCheck size={22} />
        </div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>Submit Your Success Story</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#FFFFFF",
          padding: 20,
          borderRadius: 16,
          boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
          marginBottom: 32,
          border: "1px solid " + line
        }}
      >
        <div style={{  marginBottom: 12 }}>
          <div>
            <label style={{ display: "block", fontWeight: 800, fontSize: 13, marginBottom: 6 }}>Your Name</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                name="rname"
                value={form.rname}
                onChange={handleChange}
                placeholder="e.g. Ayesha Khan"
                style={{ width: "auto", padding: "10px 12px 10px 38px", borderRadius: 12, border: "1px solid " + line, background: "#FAFBFC", outline: "none" }}
                required
              />
              <User2 size={16} style={{ position: "absolute", top: 10, left: 12, color: brandMute }} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 800, fontSize: 13, marginBottom: 6 }}>Domain</label>
            <input
              type="text"
              name="domain"
              value={form.domain}
              onChange={handleChange}
              placeholder="e.g. Engineering, Medicine"
              style={{ width: "auto", padding: "10px 12px", borderRadius: 12, border: "1px solid " + line, background: "#FAFBFC", outline: "none" }}
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 800, fontSize: 13, marginBottom: 6 }}>Your Story</label>
          <textarea
            name="story_text"
            value={form.story_text}
            onChange={handleChange}
            placeholder="Share the path you took, the bumps you hit, and what finally clicked."
            rows={4}
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid " + line, background: "#FFFFFF", outline: "none", resize: "vertical" }}
            required
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 800, fontSize: 13, marginBottom: 6 }}>Photo (optional)</label>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <input type="file" name="image_url" accept="image/*" onChange={handleChange} style={{ padding: 8, border: "1px solid " + line, borderRadius: 12 }} />
            <ImageIcon size={16} style={{ marginLeft: 8, color: brandMute }} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: brandBlue,
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid " + brandBlue,
            fontWeight: 900,
            cursor: loading ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
        >
          {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={18} />}
          {loading ? "Submitting..." : "Submit Story"}
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </form>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Success Stories</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 10px", border: "1px solid " + line, borderRadius: 12, background: "#FFFFFF" }}>
            <Filter size={16} style={{ color: brandBlue }} />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", fontWeight: 700, color: brandInk, cursor: "pointer" }}
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All domains" : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        {filteredStories.length === 0 && <p style={{ color: brandMute }}>No stories yet.</p>}
        {filteredStories.map((story) => (
          <div
            key={story.story_id}
            style={{
              background: "#FFFFFF",
              padding: 20,
              borderRadius: 16,
              marginBottom: 16,
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              border: "1px solid " + line
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {story.image_url ? (
                  <img
                    src={`http://localhost:5000/${story.image_url.replace(/\\/g, "/")}`}
                    alt={story.rname}
                    style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", border: "1px solid " + line }}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: 12, background: "#E9F3FF", border: "1px solid #D7E9FF", display: "flex", alignItems: "center", justifyContent: "center", color: brandBlue }}>
                    <User2 size={28} />
                  </div>
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>{story.rname}</h3>
                    <span
                      style={{
                        background: "#E9F3FF",
                        color: brandBlue,
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        border: "1px solid #D7E9FF"
                      }}
                    >
                      {story.domain}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, color: story.approved_at ? "#1A7F37" : brandMute, fontWeight: 800, fontSize: 12 }}>
                    {story.approved_at ? <CheckCircle2 size={14} /> : <CheckCircle2 size={14} style={{ opacity: 0.3 }} />}
                    <span>{story.approved_at ? "Approved" : "Pending review"}</span>
                  </div>
                </div>
              </div>
              <StoryBookmarkButton storyId={story.story_id} />
            </div>
            <p style={{ marginTop: 14, color: brandMute, lineHeight: 1.6 }}>{story.story_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
