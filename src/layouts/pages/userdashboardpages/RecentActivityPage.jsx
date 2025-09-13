import React, { useEffect, useState, useContext } from "react";
import { apiurl } from "../../../api";
import { UserContext } from "../../../context/UserContext";
import { Clock, Briefcase, FileText, Video } from "lucide-react";

export default function RecentActivityPage() {
  const [activities, setActivities] = useState([]);
  const { user } = useContext(UserContext);
  const userId = user.user_id;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`${apiurl}/api/history/${userId}`);
        const data = await res.json();
        if (data.success) setActivities(data.data);
      } catch {}
    };
    fetchActivities();
  }, [userId]);

  const formatDate = (dateString) => {
    const now = new Date();
    const viewed = new Date(dateString);
    const diffMs = now - viewed;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const brand = { ink: "#1D2226", blue: "#0A66C2", line: "#E6E9EC", soft: "#F3F6F8", mute: "#56687A" };

  const iconFor = (t) => {
    if (!t) return <Clock size={16} />;
    const k = String(t).toLowerCase();
    if (k.includes("career")) return <Briefcase size={16} />;
    if (k.includes("resource")) return <FileText size={16} />;
    if (k.includes("multimedia") || k.includes("video")) return <Video size={16} />;
    return <Clock size={16} />;
  };

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 20, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif", color: brand.ink }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: brand.soft, display: "grid", placeItems: "center", border: `1px solid ${brand.line}`, color: brand.blue }}>
            <Clock size={18} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Recent Activity</h1>
            <div style={{ fontSize: 12, color: brand.mute }}>a quick peek at what you’ve opened lately</div>
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div style={{ background: "#FFFFFF", border: `1px dashed ${brand.line}`, color: brand.mute, borderRadius: 12, padding: 24, textAlign: "center" }}>
          nothing here yet — go explore and I’ll keep track
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {activities.map((a) => (
            <li
              key={a._id}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: "#FFFFFF",
                border: `1px solid ${brand.line}`,
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                transition: "transform .15s ease, box-shadow .15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.09)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: brand.soft, display: "grid", placeItems: "center", border: `1px solid ${brand.line}`, color: brand.blue }}>
                {iconFor(a.categoryType)}
              </div>

              <div style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: brand.blue, textTransform: "uppercase", background: "#E9F1FF", border: "1px solid #D0E6FB", padding: "2px 8px", borderRadius: 999 }}>
                    {String(a.categoryType || "").trim() || "ITEM"}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: brand.ink, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                    {a.title}
                  </span>
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: brand.mute, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {a.subCategory ? `• ${a.subCategory}` : null}
                </div>
              </div>

              <div style={{ fontSize: 12, color: brand.mute, textAlign: "right", minWidth: 90 }}>{formatDate(a.viewedAt)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
