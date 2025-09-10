import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../../api";

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({
    rname: "",
    domain: "",
    story_text: "",
    image_url: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch all stories
  useEffect(() => {
    axios.get(`${apiurl}/api/success-stories`)
      .then(res => setStories(res.data))
      .catch(() => setStories([]));
  }, []);

  // Handle form change
  const handleChange = e => {
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

  // Submit new story
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("rname", form.rname);
    data.append("domain", form.domain);
    data.append("story_text", form.story_text);
    if (form.image_url) data.append("image_url", form.image_url);

    console.log('success storie',data)
    try {
      const res = await axios.post(`${apiurl}/api/success-stories`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        withCredentials: true
      });
      toast.success("Story submitted!");
      setStories([res.data, ...stories]);
      setForm({ rname: "", domain: "", story_text: "", image_url: null });
    } catch (err) {
      toast.error("Error submitting story");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Submit Your Success Story</h2>
      <form onSubmit={handleSubmit} style={{
        background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px #dfe6e9", marginBottom: 40
      }}>
        <input
          type="text"
          name="rname"
          value={form.rname}
          onChange={handleChange}
          placeholder="Your Name"
          style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #dfe6e9" }}
          required
        />
        <input
          type="text"
          name="domain"
          value={form.domain}
          onChange={handleChange}
          placeholder="Domain (e.g. Engineering, Medicine)"
          style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #dfe6e9" }}
          required
        />
        <textarea
          name="story_text"
          value={form.story_text}
          onChange={handleChange}
          placeholder="Your Story"
          rows={4}
          style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #dfe6e9" }}
          required
        />
        <input
          type="file"
          name="image_url"
          accept="image/*"
          onChange={handleChange}
          style={{ marginBottom: 12 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#0984e3", color: "#fff", padding: "10px 28px", borderRadius: "8px",
            border: "none", fontWeight: "bold", cursor: "pointer"
          }}
        >
          {loading ? "Submitting..." : "Submit Story"}
        </button>
      </form>

      <h2 style={{ marginBottom: 24 }}>Success Stories</h2>
      <div>
        {stories.length === 0 && <p>No stories yet.</p>}
        {stories.map(story => (
          <div key={story.story_id} style={{
            background: "#f5f6fa", padding: 20, borderRadius: 10, marginBottom: 24, boxShadow: "0 1px 4px #dfe6e9"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {story.image_url &&
                <img
                  src={`http://localhost:5000/${story.image_url.replace(/\\/g, "/")}`}
                  alt="Story"
                  style={{ width: 80, height: 80, borderRadius: "10px", objectFit: "cover" }}
                />
              }
              <div>
                <h3 style={{ margin: 0 }}>{story.rname}</h3>
                <span style={{
                  background: "#dff9fb", color: "#0984e3", padding: "2px 12px", borderRadius: "999px",
                  fontSize: "0.95rem", marginBottom: 8, display: "inline-block"
                }}>{story.domain}</span>
              </div>
            </div>
            <p style={{ marginTop: 16 }}>{story.story_text}</p>
            {story.approved_at &&
              <span style={{
                color: "#00b894", fontWeight: "bold", fontSize: "0.95rem"
              }}>Approved</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}