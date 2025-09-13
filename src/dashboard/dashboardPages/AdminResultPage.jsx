import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiurl } from "../../api";
import axios from "axios";
import { Sparkles, AlertCircle, Loader2, Trophy, History } from "lucide-react";

export default function ResultPage() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${apiurl}/api/recommend/${attemptId}`);
        setData(r.data.recommendations);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [attemptId]);

  if (err)
    return (
      <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, color: "#B91C1C", textAlign: "center", fontSize: 16, display: "flex", alignItems: "center", gap: 10, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        <AlertCircle size={18} /> {err}
      </div>
    );

  if (!data)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontSize: 16, color: "#5F5F5F", fontWeight: 500, gap: 10, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading recommendations…
      </div>
    );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "#E8F3FF", border: "1px solid #BBD7FF" }}>
          <Sparkles size={20} color="#0A66C2" />
        </div>
        <h2 style={{ color: "#1D2226", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: ".2px" }}>Recommended Streams & Roles</h2>
      </div>

      <div style={{ display: "grid", gap: 20, marginBottom: 24 }}>
        {data.streams.map((s) => (
          <div key={s.stream} style={{ backgroundColor: "#FFFFFF", borderRadius: 14, padding: 20, boxShadow: "0 10px 24px rgba(0,0,0,.06)", border: "1px solid #E6E9EC" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid #E6E9EC", marginBottom: 16 }}>
              <h3 style={{ color: "#0A66C2", fontSize: 20, fontWeight: 700, margin: 0 }}>{s.stream}</h3>
              <Trophy size={18} color="#0A66C2" />
            </div>
            <ol style={{ listStyle: "none", padding: 0, display: "grid", gap: 12, margin: 0 }}>
              {s.topRoles.map((r, index) => (
                <li
                  key={r.role}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 14,
                    backgroundColor: index < 3 ? "#EEF3F8" : "#F9FAFB",
                    borderRadius: 10,
                    border: index < 3 ? "1px solid #C7DDF6" : "1px solid #E6E9EC",
                    transition: "transform .15s ease, box-shadow .15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#1D2226" }}>{r.role}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#007D44", backgroundColor: "rgba(112,181,72,.15)", padding: "6px 10px", borderRadius: 999, border: "1px solid rgba(112,181,72,.35)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Score {Math.round(r.blended)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <Link
          to="/history"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#0A66C2",
            color: "#FFFFFF",
            padding: "12px 18px",
            borderRadius: 10,
            border: "1px solid #004182",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(10,102,194,.2)",
            transition: "transform .15s ease, box-shadow .15s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 10px 28px rgba(10,102,194,.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(10,102,194,.2)";
          }}
        >
          <History size={16} /> View History
        </Link>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
