import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { apiurl } from "../../../api";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, ArrowRight } from "lucide-react";

export default function RecommendedCareersPage() {
  const { user } = useContext(UserContext);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const primary = "#0A66C2";
  const primarySoft = "#E9F3FF";
  const text = "#1D2226";
  const subtext = "#6B7280";
  const border = "#E6E9EC";

  useEffect(() => {
    if (!user?._id) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/history/${user._id}`);
        const careerOnly = res.data.data.filter((item) => item.categoryType === "careers");
        setCareers(careerOnly);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <p style={{ color: subtext, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>Loading recommended careers...</p>;

  return (
    <div style={{ padding: 20, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ background: primarySoft, borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BriefcaseBusiness size={18} style={{ color: primary }} />
        </div>
        <h1 style={{ color: primary, margin: 0, fontSize: 22, fontWeight: 800 }}>Recommended Careers</h1>
      </div>

      {careers.length === 0 ? (
        <p style={{ color: subtext }}>No career recommendations yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {careers.map((career) => (
            <div
              key={career._id}
              style={{
                padding: 18,
                border: `1px solid ${border}`,
                borderRadius: 12,
                backgroundColor: "#fff",
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                transition: "transform .2s ease, box-shadow .2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ background: primarySoft, borderRadius: 8, padding: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BriefcaseBusiness size={16} style={{ color: primary }} />
                </div>
                <h2 style={{ margin: 0, color: text, fontSize: 18, fontWeight: 700 }}>{career.title}</h2>
              </div>

              {career.meta?.description && (
                <p style={{ margin: "6px 0 14px 0", color: "#374151", fontSize: 14, lineHeight: 1.55 }}>{career.meta.description}</p>
              )}

              <button
                onClick={() => navigate(`/career-bank/${career.itemId}`)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  backgroundColor: primary,
                  color: "#fff",
                  borderRadius: 8,
                  border: `1px solid ${primary}`,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(10,102,194,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#004182";
                  e.currentTarget.style.borderColor = "#004182";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = primary;
                  e.currentTarget.style.borderColor = primary;
                }}
              >
                Explore
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
