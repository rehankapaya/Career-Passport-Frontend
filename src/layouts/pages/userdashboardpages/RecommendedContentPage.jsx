import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { apiurl } from "../../../api";
import { useNavigate } from "react-router-dom";
import { Rocket, ArrowRight, FileText } from "lucide-react";

export default function RecommendedCareersPage() {
  const { user } = useContext(UserContext);
  const [resources, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const primary = "#0A66C2";
  const primarySoft = "#E9F3FF";
  const bg = "#FFFFFF";
  const pageBg = "#F3F6F8";
  const text = "#1D2226";
  const subtext = "#6B7280";
  const border = "#E6E9EC";

  useEffect(() => {
    if (!user?._id) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/history/${user._id}`);
        const items = res.data.data.filter((item) => item.categoryType === "resources");
        setCareers(items);
      } catch (err) {
        console.error("Error fetching recommended resources", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading)
    return (
      <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center", color: subtext, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        Loading recommended resources…
      </div>
    );

  return (
    <div style={{ padding: 20, background: pageBg, borderRadius: 12, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ background: primarySoft, padding: 8, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Rocket size={18} style={{ color: primary }} />
        </div>
        <h1 style={{ margin: 0, color: primary, fontSize: 22, fontWeight: 800 }}>Recommended Resources</h1>
      </div>

      {resources.length === 0 ? (
        <p style={{ color: subtext, marginTop: 8 }}>No career recommendations yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {resources.map((career) => (
            <div
              key={career._id}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: 18,
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
              onClick={() => navigate(`/resources/${career.itemId}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: primarySoft, borderRadius: 8, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={16} style={{ color: primary }} />
                </div>
                <h2 style={{ margin: 0, color: text, fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{career.title}</h2>
              </div>

              {career.meta?.description && (
                <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.5 }}>{career.meta.description}</p>
              )}

              {career.meta?.demand && (
                <div style={{ marginTop: 4 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background:
                        career.meta.demand === "Very High" ? "#E8FAF0" : career.meta.demand === "High" ? "#E9F3FF" : "#FEF3C7",
                      color:
                        career.meta.demand === "Very High" ? "#0B7A45" : career.meta.demand === "High" ? primary : "#B45309",
                      border: `1px solid ${
                        career.meta.demand === "Very High" ? "#C9F1DA" : career.meta.demand === "High" ? "#D5E7FF" : "#FDE68A"
                      }`,
                    }}
                  >
                    {career.meta.demand}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 8, color: primary, fontWeight: 700, marginTop: 2 }}>
                <span style={{ fontSize: 14 }}>Open</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
