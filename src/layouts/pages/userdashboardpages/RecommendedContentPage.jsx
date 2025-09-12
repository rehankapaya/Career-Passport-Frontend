import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { apiurl } from "../../../api";
import { useNavigate } from "react-router-dom";

export default function RecommendedCareersPage() {
  const { user } = useContext(UserContext);
  const [resources, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/history/${user._id}`);
        // Sirf career filter
        const resources = res.data.data.filter(
          (item) => item.categoryType === "resources"
        );
        setCareers(resources);
      } catch (err) {
        console.error("Error fetching recommended resources", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) return <p>Loading recommended resources...</p>;

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
        🚀 Recommended resources
      </h1>

      {resources.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No career recommendations yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "18px",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {resources.map((career) => (
            <div
              key={career._id}
              style={{
                padding: "18px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/resources/${career.itemId}`)} // 👈 navigate with dynamic id
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <h2
                style={{
                  margin: "0 0 8px 0",
                  color: "#111827",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {career.title}
              </h2>

              {career.meta?.description && (
                <p
                  style={{
                    margin: "0 0 12px 0",
                    color: "#374151",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {career.meta.description}
                </p>
              )}

              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Demand Level:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    backgroundColor:
                      career.meta?.demand === "Very High"
                        ? "#dcfce7"
                        : career.meta?.demand === "High"
                        ? "#dbeafe"
                        : "#fef3c7",
                    color:
                      career.meta?.demand === "Very High"
                        ? "#16a34a"
                        : career.meta?.demand === "High"
                        ? "#2563eb"
                        : "#d97706",
                  }}
                >
                  {career.meta?.demand || "N/A"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
