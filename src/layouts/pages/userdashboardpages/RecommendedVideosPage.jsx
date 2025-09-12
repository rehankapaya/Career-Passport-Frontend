import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { apiurl } from "../../../api";
import { useNavigate } from "react-router-dom";

export default function RecommendedContentPage() {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?._id) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/history/${user._id}`);
        // sirf multimedia filter
        const multimediaOnly = res.data.data.filter(
          (item) => item.categoryType === "multimedia"
        );
        setContent(multimediaOnly);
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
          {content.map((item) => (
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
              onClick={() => navigate(`/multimedia/${item.itemId}`)}

              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              {/* Thumbnail or placeholder */}
              <div style={{ height: "160px", backgroundColor: "#f3f4f6" }}>
                {item.subCategory === "video" ? (
                  <img
                    src={`https://img.icons8.com/ios-filled/100/2563eb/play-button-circled.png`}
                    alt="video"
                    style={{
                      display: "block",
                      margin: "auto",
                      paddingTop: "40px",
                      opacity: 0.7,
                    }}
                  />
                ) : item.subCategory === "pdf" ? (
                  <img
                    src="https://img.icons8.com/ios-filled/100/ff5722/pdf.png"
                    alt="pdf"
                    style={{
                      display: "block",
                      margin: "auto",
                      paddingTop: "30px",
                      opacity: 0.8,
                    }}
                  />
                ) : item.subCategory === "audio" ? (
                  <img
                    src="https://img.icons8.com/ios-filled/100/10b981/musical-notes.png"
                    alt="audio"
                    style={{
                      display: "block",
                      margin: "auto",
                      paddingTop: "30px",
                      opacity: 0.8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      paddingTop: "60px",
                      color: "#9ca3af",
                    }}
                  >
                    📁
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div style={{ padding: "14px" }}>
                <h2
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    color: "#111827",
                  }}
                >
                  {item.title}
                </h2>
                <p
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  Type: {item.subCategory}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                  }}
                >
                  Viewed at:{" "}
                  {new Date(item.viewedAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
