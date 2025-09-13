import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiurl } from "../../api";
import axios from "axios";
import { Sparkles, RefreshCw, AlertCircle, History, ChevronRight, Medal, Trophy } from "lucide-react";

export default function ResultPage() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const line = "#E6E9EC";
  const shell = "#F3F6F8";

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${apiurl}/api/recommend/${attemptId}`);
        setData(r.data.recommendations);
      } catch (e) {
        setErr(e.message || "Something went wrong");
      }
    })();
  }, [attemptId]);

  if (err)
    return (
      <div
        style={{
          maxWidth: 640,
          margin: "48px auto",
          padding: 20,
          backgroundColor: "#FEF3F2",
          border: "1px solid #FEE4E2",
          borderRadius: 12,
          color: "#B42318",
          textAlign: "center",
          fontSize: 16,
          fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <AlertCircle size={18} />
          <span>{err}</span>
        </div>
        <div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 12,
              backgroundColor: brandBlue,
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid " + brandBlue,
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
          >
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </div>
    );

  if (!data)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          fontSize: 18,
          color: brandMute,
          fontWeight: 600,
          fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <RefreshCw size={18} style={{ animation: "spin 1.2s linear infinite" }} />
          Loading recommendations…
        </span>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: 20,
        fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
      }}
    >
      <div
        style={{
          color: brandInk,
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 28,
          textAlign: "center",
          paddingBottom: 14,
          borderBottom: "2px solid " + line,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Sparkles size={22} color={brandBlue} />
        Recommended Streams & Roles
      </div>

      <div style={{ display: "grid", gap: 20, marginBottom: 32 }}>
        {data.streams.map((s) => (
          <div
            key={s.stream}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              border: "1px solid " + line,
            }}
          >
            <div
              style={{
                color: brandBlue,
                fontSize: 20,
                fontWeight: 800,
                marginBottom: 16,
                paddingBottom: 10,
                borderBottom: "2px solid #D7E9FF",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <History size={18} />
              {s.stream}
            </div>

            <ol style={{ listStyle: "none", padding: 0, display: "grid", gap: 12, margin: 0 }}>
              {s.topRoles.map((r, index) => {
                const top = index === 0;
                const second = index === 1;
                const third = index === 2;
                const bg = top ? "#F0FDF4" : second ? "#F0F9FF" : third ? "#FFF7ED" : shell;
                const bd = top ? "#BBF7D0" : second ? "#BAE6FD" : third ? "#FED7AA" : line;
                const scoreChipBg = top ? "#DCFCE7" : "#E5F2FF";
                const scoreChipText = top ? "#047857" : brandBlue;
                const icon =
                  top ? <Trophy size={16} /> : second ? <Medal size={16} /> : <ChevronRight size={16} />;
                return (
                  <li
                    key={r.role}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 14,
                      backgroundColor: bg,
                      borderRadius: 12,
                      border: "1px solid " + bd,
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 600, color: brandInk }}>
                      {icon}
                      {r.role}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: scoreChipText,
                        backgroundColor: scoreChipBg,
                        padding: "6px 12px",
                        borderRadius: 999,
                        border: "1px solid " + (top ? "#BBF7D0" : "#D7E9FF"),
                      }}
                    >
                      Score: {Math.round(r.blended)}
                    </span>
                  </li>
                );
              })}
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
            gap: 10,
            backgroundColor: brandBlue,
            color: "white",
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid " + brandBlue,
            fontSize: 15,
            fontWeight: 900,
            cursor: "pointer",
            textDecoration: "none",
            transition: "transform .12s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
        >
          <History size={18} />
          View History
        </Link>
      </div>
    </div>
  );
}
