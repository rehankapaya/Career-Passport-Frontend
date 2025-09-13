import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { BarChart3, Megaphone } from "lucide-react";
import { apiurl } from "../../api";

const PRIMARY = "#0A66C2";
const ACCENT = "#084C8D";
const MUTED = "#6B7280";
const CARD_BG = "#ffffff";
const BG = "#f3f6f8";
const CHART_COLORS = ["#0A66C2", "#00A6A6", "#FF7A59", "#FFD166", "#8B5CF6", "#4ADE80"];

function formatDateShort(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState([]);
  const [resources, setResources] = useState([]);
  const [multimedia, setMultimedia] = useState([]);
  const [stories, setStories] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [domainDistribution, setDomainDistribution] = useState([]);
  const [resourcesByCategory, setResourcesByCategory] = useState([]);
  const [mediaTypeCounts, setMediaTypeCounts] = useState([]);
  const [feedbackStatusCounts, setFeedbackStatusCounts] = useState([]);
  const [attemptsOverTime, setAttemptsOverTime] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [
          careersRes,
          resourcesRes,
          multimediaRes,
          storiesRes,
          feedbackRes,
          attemptsRes
        ] = await Promise.all([
          axios.get(`${apiurl}/api/careers`),
          axios.get(`${apiurl}/api/resources`),
          axios.get(`${apiurl}/api/multimedia`),
          axios.get(`${apiurl}/api/success-stories`),
          axios.get(`${apiurl}/api/feedback`),
          axios.get(`${apiurl}/api/attempt/history`)
        ]);

        const careersData = careersRes.data || careersRes.data?.data || [];
        const resourcesData = resourcesRes.data || resourcesRes.data?.data || [];
        const multimediaData = multimediaRes.data || multimediaRes.data?.data || [];
        const storiesData = storiesRes.data || storiesRes.data?.data || [];
        const feedbackData = feedbackRes.data?.data ? feedbackRes.data.data : (feedbackRes.data || []);
        const attemptsData = attemptsRes.data || attemptsRes.data?.data || [];

        setCareers(careersData);
        setResources(resourcesData);
        setMultimedia(multimediaData);
        setStories(storiesData);
        setFeedback(feedbackData);
        setAttempts(attemptsData);

        const domainMap = {};
        careersData.forEach(c => {
          const d = c.domain || "Other";
          domainMap[d] = (domainMap[d] || 0) + 1;
        });
        const domainArr = Object.keys(domainMap).map((k, i) => ({ name: k, value: domainMap[k], color: CHART_COLORS[i % CHART_COLORS.length] }));
        setDomainDistribution(domainArr);

        const catMap = {};
        resourcesData.forEach(r => {
          const cats = (r.category || "Uncategorized").split(",").map(s => s.trim());
          cats.forEach(c => { catMap[c] = (catMap[c] || 0) + 1; });
        });
        const catArr = Object.keys(catMap).map((k) => ({ category: k, count: catMap[k] })).sort((a, b) => b.count - a.count);
        setResourcesByCategory(catArr.slice(0, 8));

        const mediaMap = {};
        multimediaData.forEach(m => {
          const t = (m.type || "other").toLowerCase();
          mediaMap[t] = (mediaMap[t] || 0) + 1;
        });
        const mediaArr = Object.keys(mediaMap).map((k, i) => ({ name: k, value: mediaMap[k], color: CHART_COLORS[i % CHART_COLORS.length] }));
        setMediaTypeCounts(mediaArr);

        const fbMap = {};
        feedbackData.forEach(fb => {
          const s = (fb.status || "unknown").toLowerCase();
          fbMap[s] = (fbMap[s] || 0) + 1;
        });
        const fbArr = Object.keys(fbMap).map((k, i) => ({ name: k, value: fbMap[k], color: CHART_COLORS[i % CHART_COLORS.length] }));
        setFeedbackStatusCounts(fbArr);

        const dayMap = {};
        const today = new Date();
        for (let i = 13; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          dayMap[key] = 0;
        }
        attemptsData.forEach(a => {
          const created = a.createdAt || a.created_at || a.updatedAt;
          if (!created) return;
          const key = new Date(created).toISOString().slice(0, 10);
          if (key in dayMap) dayMap[key] += 1;
        });
        const attemptsArr = Object.keys(dayMap).map(k => ({ date: k, count: dayMap[k], label: formatDateShort(k) }));
        setAttemptsOverTime(attemptsArr);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalCareers = careers.length;
  const totalResources = resources.length;
  const totalMedia = multimedia.length;
  const totalStories = stories.length;
  const totalFeedback = feedback.length;
  const totalAttempts = attempts.length;

  const handleExportCSV = () => {
    const lines = [];
    const addSection = (title, headers, rows) => {
      lines.push(csvEscape(title));
      lines.push(headers.map(csvEscape).join(","));
      rows.forEach(r => lines.push(headers.map(h => csvEscape(r[h])).join(",")));
      lines.push("");
    };

    addSection(
      "Overview",
      ["metric", "value"],
      [
        { metric: "Careers", value: totalCareers },
        { metric: "Resources", value: totalResources },
        { metric: "Multimedia", value: totalMedia },
        { metric: "Success Stories", value: totalStories },
        { metric: "Feedback", value: totalFeedback },
        { metric: "Attempts", value: totalAttempts }
      ]
    );

    addSection(
      "Careers by Domain",
      ["domain", "count"],
      domainDistribution.map(d => ({ domain: d.name, count: d.value }))
    );

    addSection(
      "Top Resource Categories",
      ["category", "count"],
      resourcesByCategory
    );

    addSection(
      "Multimedia Types",
      ["type", "count"],
      mediaTypeCounts.map(m => ({ type: m.name, count: m.value }))
    );

    addSection(
      "Feedback Status",
      ["status", "count"],
      feedbackStatusCounts.map(f => ({ status: f.name, count: f.value }))
    );

    addSection(
      "Attempts Last 14 Days",
      ["date", "count"],
      attemptsOverTime.map(a => ({ date: a.date, count: a.count }))
    );

    const csv = "\ufeff" + lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const styles = {
    page: { minHeight: "100vh", background: BG, fontFamily: `"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`, padding: 24, color: "#111827" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    titleWrap: { display: "flex", alignItems: "center", gap: 12 },
    titleIcon: { background: "#e6f0fb", color: PRIMARY, borderRadius: 8, padding: 8, display: "grid", placeItems: "center" },
    title: { fontSize: 22, fontWeight: 700, color: ACCENT },
    subtitle: { color: MUTED, marginTop: 4 },
    grid: { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 18, alignItems: "start" },
    card: { background: CARD_BG, borderRadius: 8, padding: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.06)" },
    statCard: { background: CARD_BG, borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 6px rgba(12,23,44,0.06)", display: "flex", flexDirection: "column", justifyContent: "center" },
    sectionTitle: { fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 12 },
    smallMuted: { color: MUTED, fontSize: 13 },
    resourcesTable: { width: "100%", borderCollapse: "collapse", marginTop: 8 },
    tr: { borderBottom: "1px solid #eef2f7" },
    th: { textAlign: "left", padding: "10px 8px", fontSize: 13, color: MUTED, fontWeight: 600 },
    td: { padding: "12px 8px", fontSize: 14, color: "#0f172a" },
    blueBtn: { background: PRIMARY, color: "#fff", padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600 }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.titleWrap}>
          <div style={styles.titleIcon}><BarChart3 size={18} /></div>
          <div>
            <div style={styles.title}>Analytics</div>
            <div style={styles.subtitle}>Overview of careers, resources, feedback & learner attempts</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={handleExportCSV} style={{ ...styles.blueBtn, padding: "8px 14px" }}>Export CSV</button>
          <div style={{ color: MUTED, fontSize: 13 }}>{new Date().toLocaleString()}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: MUTED }}>Loading analytics…</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginBottom: 18 }}>
            <div style={{ gridColumn: "span 1", ...styles.statCard }}>
              <div style={{ color: MUTED, fontSize: 12 }}>Careers</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{careers.length}</div>
              <div style={styles.smallMuted}>Distinct career paths</div>
            </div>
            <div style={{ gridColumn: "span 1", ...styles.statCard }}>
              <div style={{ color: MUTED, fontSize: 12 }}>Resources</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{resources.length}</div>
              <div style={styles.smallMuted}>Articles & guides</div>
            </div>
            <div style={{ gridColumn: "span 1", ...styles.statCard }}>
              <div style={{ color: MUTED, fontSize: 12 }}>Multimedia</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{multimedia.length}</div>
              <div style={styles.smallMuted}>Videos & PDFs</div>
            </div>
            <div style={{ gridColumn: "span 1", ...styles.statCard }}>
              <div style={{ color: MUTED, fontSize: 12 }}>Success Stories</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{stories.length}</div>
              <div style={styles.smallMuted}>Featured stories</div>
            </div>
            <div style={{ gridColumn: "span 1", ...styles.statCard }}>
              <div style={{ color: MUTED, fontSize: 12 }}>Feedback</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{feedback.length}</div>
              <div style={styles.smallMuted}>User feedback items</div>
            </div>
            <div style={{ gridColumn: "span 1", ...styles.statCard }}>
              <div style={{ color: MUTED, fontSize: 12 }}>Attempts</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{attempts.length}</div>
              <div style={styles.smallMuted}>Quiz attempts</div>
            </div>
          </div>

          <div style={styles.grid}>
            <div style={{ gridColumn: "span 7" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div style={styles.card}>
                  <div style={styles.sectionTitle}>Careers by Domain</div>
                  {domainDistribution.length === 0 ? (
                    <div style={styles.smallMuted}>No data</div>
                  ) : (
                    <div style={{ height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={domainDistribution} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40} label>
                            {domainDistribution.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color || CHART_COLORS[idx % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div style={styles.card}>
                  <div style={styles.sectionTitle}>Multimedia Types</div>
                  {mediaTypeCounts.length === 0 ? (
                    <div style={styles.smallMuted}>No data</div>
                  ) : (
                    <div style={{ height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={mediaTypeCounts} dataKey="value" nameKey="name" outerRadius={70} innerRadius={30}>
                            {mediaTypeCounts.map((entry, idx) => (
                              <Cell key={`cellm-${idx}`} fill={entry.color || CHART_COLORS[idx % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {mediaTypeCounts.map((m, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", color: MUTED }}>
                            <div style={{ width: 12, height: 12, background: m.color, borderRadius: 3 }} />
                            <div style={{ fontSize: 13 }}>{m.name} ({m.value})</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ ...styles.card, marginBottom: 16 }}>
                <div style={styles.sectionTitle}>Top Resource Categories</div>
                {resourcesByCategory.length === 0 ? (
                  <div style={styles.smallMuted}>No data</div>
                ) : (
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resourcesByCategory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill={PRIMARY} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div style={{ ...styles.card, marginBottom: 16 }}>
                <div style={styles.sectionTitle}>Attempts (last 14 days)</div>
                {attemptsOverTime.length === 0 ? (
                  <div style={styles.smallMuted}>No data</div>
                ) : (
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attemptsOverTime} margin={{ left: 0, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Feedback Status</div>
                {feedbackStatusCounts.length === 0 ? (
                  <div style={styles.smallMuted}>No data</div>
                ) : (
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={feedbackStatusCounts} dataKey="value" nameKey="name" outerRadius={70} label>
                          {feedbackStatusCounts.map((entry, idx) => (
                            <Cell key={`cellfb-${idx}`} fill={entry.color || CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {feedbackStatusCounts.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", color: MUTED }}>
                      <div style={{ width: 10, height: 10, background: f.color, borderRadius: 2 }} />
                      <div style={{ fontSize: 13 }}>{f.name} ({f.value})</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.sectionTitle}>Top Resources</div>
                <table style={styles.resourcesTable}>
                  <thead>
                    <tr style={styles.tr}>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.slice(0, 6).map((r) => (
                      <tr key={r._id} style={styles.tr}>
                        <td style={styles.td}>{r.title}</td>
                        <td style={styles.td}>{r.category}</td>
                        <td style={styles.td}>{formatDateShort(r.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={styles.card}>
                <div style={styles.sectionTitle}>Latest Success Stories</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {stories.slice(0, 4).map((s) => (
                    <div key={s._id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 44, height: 44, background: "#f1f5f9", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: PRIMARY }}>
                        <Megaphone size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.rname}</div>
                        <div style={{ color: MUTED, fontSize: 13 }}>{s.domain}</div>
                        <div style={{ color: MUTED, fontSize: 13 }}>{formatDateShort(s.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
