import React, { useEffect, useState } from "react";
import { BarChart3, Mail } from "lucide-react";
import { apiurl } from "../../api";

export default function AdminQuizHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${apiurl}/api/attempt/history`);
        const data = await res.json();
        setHistory(data);
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", padding: 40, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif", color: "#5F5F5F", fontSize: 16 }}>
        <BarChart3 size={18} color="#0A66C2" />
        Loading quiz history…
      </div>
    );
  }

  return (
    <div style={{ padding: 32, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif", backgroundColor: "#F3F6F8", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "#E8F3FF", border: "1px solid #BBD7FF" }}>
          <BarChart3 size={18} color="#0A66C2" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1D2226", margin: 0 }}>Quiz Attempts History</h2>
      </div>

      <div style={{ overflowX: "auto", backgroundColor: "#FFFFFF", boxShadow: "0 10px 24px rgba(0,0,0,0.06)", borderRadius: 12, border: "1px solid #E6E9EC" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E6E9EC" }}>
            <tr>
              {["User", "Quiz ID", "Step Index", "Status", "Total Score", "Created At"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "14px 20px", fontSize: 13, letterSpacing: ".2px", fontWeight: 700, color: "#434649" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((attempt, idx) => (
                <tr
                  key={attempt._id}
                  style={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB", transition: "background .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EEF3F8")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB")}
                >
                  <td style={{ padding: "14px 20px", fontSize: 14, color: "#1D2226", display: "flex", alignItems: "center", gap: 8 }}>
                    <Mail size={16} color="#6B7280" />
                    <span>{attempt.userId?.email || "N/A"}</span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 14, color: "#5F5F5F" }}>{attempt.quizId}</td>
                  <td style={{ padding: "14px 20px", fontSize: 14, color: "#5F5F5F" }}>{attempt.stepIndex}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 999,
                        backgroundColor: attempt.status === "completed" ? "rgba(112,181,72,.15)" : "rgba(255,191,0,.15)",
                        color: attempt.status === "completed" ? "#007D44" : "#915907",
                        border: `1px solid ${attempt.status === "completed" ? "rgba(112,181,72,.35)" : "rgba(255,191,0,.35)"}`
                      }}
                    >
                      {attempt.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1D2226" }}>{attempt.totalScore ?? "-"}</td>
                  <td style={{ padding: "14px 20px", fontSize: 14, color: "#5F5F5F" }}>{new Date(attempt.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: 20, textAlign: "center", fontSize: 14, color: "#5F5F5F" }}>No quiz attempts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
