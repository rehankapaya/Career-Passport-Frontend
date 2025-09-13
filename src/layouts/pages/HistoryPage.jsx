import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { apiurl } from "../../api";
import axios from "axios";
import { History as HistoryIcon, AlertCircle, RefreshCw, CheckCircle2, Clock3, CircleHelp, BarChart3, CalendarClock } from "lucide-react";

export default function HistoryPage() {
  const { user } = useContext(UserContext);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const USER_ID = user?._id;
  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const line = "#E6E9EC";
  const shell = "#F3F6F8";

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${apiurl}/api/attempt/history/${USER_ID}`);
        setRows(r.data || []);
      } catch (e) {
        setErr(e.message || "Something went wrong");
      }
    })();
  }, []);

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
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
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
        <HistoryIcon size={22} color={brandBlue} />
        Your Quiz History
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: brandMute,
            fontSize: 18,
            backgroundColor: shell,
            borderRadius: 12,
            border: "1px dashed " + line,
          }}
        >
          No attempts yet.
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            margin: 0,
          }}
        >
          {rows.map((a) => {
            const isCompleted = a.status === "completed";
            const isInProgress = a.status === "in-progress";
            const pillBg = isCompleted ? "#DCFCE7" : isInProgress ? "#FFEDD5" : "#E0E7FF";
            const pillBd = isCompleted ? "#BBF7D0" : isInProgress ? "#FED7AA" : "#C7D2FE";
            const pillFg = isCompleted ? "#166534" : isInProgress ? "#9A3412" : "#3730A3";
            const StatusIcon = isCompleted ? CheckCircle2 : isInProgress ? Clock3 : CircleHelp;
            return (
              <li
                key={a._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: 16,
                  alignItems: "center",
                  padding: 18,
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  border: "1px solid " + line,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "transform .15s ease, box-shadow .15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                }}
              >
                <span
                  style={{
                    color: brandInk,
                    fontSize: 14,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <CalendarClock size={16} color={brandMute} />
                  {new Date(a.createdAt).toLocaleString()}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    backgroundColor: pillBg,
                    color: pillFg,
                    border: "1px solid " + pillBd,
                    justifySelf: "end",
                  }}
                >
                  <StatusIcon size={14} />
                  {a.status}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: brandInk,
                    fontSize: 15,
                    fontWeight: 800,
                    justifySelf: "end",
                  }}
                >
                  <BarChart3 size={16} color={brandBlue} />
                  Score: {a.totalScore ?? 0}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
