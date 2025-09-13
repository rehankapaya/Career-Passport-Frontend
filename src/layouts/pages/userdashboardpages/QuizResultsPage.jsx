import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiurl } from "../../../api";
import { UserContext } from "../../../context/UserContext";
import { ListChecks, CheckCircle2, XCircle } from "lucide-react";

export default function QuizResultsPage() {
  const { user } = useContext(UserContext);
  const userId = user?._id;
  const [results, setResults] = useState([]);
  const [err, setErr] = useState("");
  const primary = "#0A66C2";
  const primarySoft = "#E9F3FF";
  const text = "#1D2226";
  const subtext = "#6B7280";
  const border = "#E6E9EC";

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const r = await axios.get(`${apiurl}/api/attempt/history/${userId}`);
        setResults(r.data);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [userId]);

  if (err)
    return (
      <div style={{ color: "#B42318", textAlign: "center", marginTop: 20, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        {err}
      </div>
    );

  if (!results.length)
    return (
      <div style={{ textAlign: "center", marginTop: 20, color: subtext, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        No quiz results found.
      </div>
    );

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ background: primarySoft, borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ListChecks size={18} style={{ color: primary }} />
        </div>
        <h1 style={{ color: primary, margin: 0, fontSize: 22, fontWeight: 800 }}>Quiz Results</h1>
      </div>

      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          border: `1px solid ${border}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB", textAlign: "left" }}>
              <th style={{ padding: 12, borderBottom: `1px solid ${border}`, color: subtext, fontWeight: 600, fontSize: 13 }}>Quiz ID</th>
              <th style={{ padding: 12, borderBottom: `1px solid ${border}`, color: subtext, fontWeight: 600, fontSize: 13 }}>Status</th>
              <th style={{ padding: 12, borderBottom: `1px solid ${border}`, color: subtext, fontWeight: 600, fontSize: 13 }}>Total Score</th>
              <th style={{ padding: 12, borderBottom: `1px solid ${border}`, color: subtext, fontWeight: 600, fontSize: 13 }}>Created At</th>
              <th style={{ padding: 12, borderBottom: `1px solid ${border}`, color: subtext, fontWeight: 600, fontSize: 13 }}>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((attempt, i) => (
              <tr key={attempt._id} style={{ background: i % 2 ? "#FFFFFF" : "#FCFEFF" }}>
                <td style={{ padding: 12, borderBottom: `1px solid ${border}`, color: text, fontWeight: 600 }}>{attempt.quizId}</td>
                <td style={{ padding: 12, borderBottom: `1px solid ${border}` }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      backgroundColor: attempt.status === "completed" ? "#E8FAF0" : "#FEECEC",
                      color: attempt.status === "completed" ? "#0B7A45" : "#B42318",
                      border: `1px solid ${attempt.status === "completed" ? "#C9F1DA" : "#F8D0CE"}`,
                    }}
                  >
                    {attempt.status === "completed" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {attempt.status}
                  </span>
                </td>
                <td style={{ padding: 12, borderBottom: `1px solid ${border}`, color: text, fontWeight: 700 }}>{attempt.totalScore}</td>
                <td style={{ padding: 12, borderBottom: `1px solid ${border}`, color: subtext }}>
                  {new Date(attempt.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: 12, borderBottom: `1px solid ${border}`, color: subtext }}>
                  {new Date(attempt.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
