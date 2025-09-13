import axios from "axios";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { apiurl } from "../../api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import {
  Briefcase,
  Laptop,
  BarChart3,
  Stethoscope,
  LineChart,
  Megaphone,
  Hammer,
  Palette,
  Scale,
  Filter,
  CircleDollarSign
} from "lucide-react";

export default function CareerBankPage() {
  const [careerPaths, setCareerPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [sortBy, setSortBy] = useState("Alphabetical");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  async function saveHistory(resource) {
    try {
      const payload = {
        userId: user._id,
        categoryType: "careers",
        itemId: resource._id || resource.career_id,
        title: resource.title,
        subCategory: resource.domain || null,
        meta: resource
      };
      await axios.post(`${apiurl}/api/history`, payload);
    } catch {}
  }

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios(`${apiurl}/api/careers`);
        if (!response.data.length > 0) throw new Error("Failed to fetch career data");
        const data = response.data;
        setCareerPaths(data);
        setFilteredCareers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  useEffect(() => {
    let result = [...careerPaths];
    if (industryFilter !== "All Industries") result = result.filter((career) => career.domain === industryFilter);
    if (sortBy === "Alphabetical") result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "Salary: High to Low") result.sort((a, b) => (b.expected_salary || 0) - (a.expected_salary || 0));
    else if (sortBy === "Salary: Low to High") result.sort((a, b) => (a.expected_salary || 0) - (b.expected_salary || 0));
    setFilteredCareers(result);
  }, [careerPaths, industryFilter, sortBy]);

  const domains = useMemo(() => ["All Industries", ...Array.from(new Set(careerPaths.map((c) => c.domain))).filter(Boolean)], [careerPaths]);

  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const line = "#E6E9EC";

  const getCareerIcon = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("software") || t.includes("developer") || t.includes("engineer")) return <Laptop size={18} />;
    if (t.includes("data") || t.includes("analytics")) return <BarChart3 size={18} />;
    if (t.includes("nurse") || t.includes("medical") || t.includes("health")) return <Stethoscope size={18} />;
    if (t.includes("financial") || t.includes("finance") || t.includes("analyst")) return <LineChart size={18} />;
    if (t.includes("teacher") || t.includes("education")) return <Megaphone size={18} />;
    if (t.includes("marketing") || t.includes("growth")) return <Megaphone size={18} />;
    if (t.includes("designer") || t.includes("design") || t.includes("ui")) return <Palette size={18} />;
    if (t.includes("lawyer") || t.includes("legal")) return <Scale size={18} />;
    if (t.includes("civil") || t.includes("mechanical") || t.includes("construction")) return <Hammer size={18} />;
    return <Briefcase size={18} />;
  };

  const formatSalary = (salary) => (salary || salary === 0 ? `$${Number(salary).toLocaleString()}` : "—");

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#F3F2EF", color: brandInk, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        <div>Loading career data…</div>
      </div>
    );

  if (error)
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#F3F2EF", color: brandInk, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        <div>Error: {error}</div>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F3F2EF", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: "#E9F3FF", border: "1px solid #D7E9FF", color: brandBlue, marginBottom: 12 }}>
            <Briefcase size={22} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: brandInk, margin: 0, marginBottom: 6 }}>Career Bank</h1>
          <p style={{ color: brandMute, maxWidth: 720, margin: "0 auto" }}>Explore hundreds of career paths with detailed insights, requirements, and growth opportunities</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid " + line, background: "#FFFFFF", borderRadius: 12, padding: "8px 10px" }}>
              <Filter size={16} style={{ color: brandBlue }} />
              <span style={{ color: brandMute, fontWeight: 700, fontSize: 12 }}>Industry</span>
              <select
                style={{ border: "none", outline: "none", background: "transparent", color: brandInk, fontWeight: 700, cursor: "pointer" }}
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                {domains.map((domain, i) => (
                  <option key={i} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid " + line, background: "#FFFFFF", borderRadius: 12, padding: "8px 10px" }}>
              <CircleDollarSign size={16} style={{ color: brandBlue }} />
              <span style={{ color: brandMute, fontWeight: 700, fontSize: 12 }}>Sort</span>
              <select
                style={{ border: "none", outline: "none", background: "transparent", color: brandInk, fontWeight: 700, cursor: "pointer" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Alphabetical</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </div>
          </div>
          <div style={{ color: brandMute, fontWeight: 700 }}>Showing {filteredCareers.length} of {careerPaths.length} careers</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
          {filteredCareers.map((career) => (
            <div
              key={career._id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
                boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                border: "1px solid " + line,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 120ms ease, box-shadow 120ms ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.06)";
              }}
            >
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EEF3F8", border: "1px solid " + line, borderRadius: 12, padding: "6px 10px", marginBottom: 12, color: brandBlue, fontWeight: 800, fontSize: 12 }}>
                  {getCareerIcon(career.title)}
                  {career.domain || "General"}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: brandInk, margin: 0, marginBottom: 6 }}>{career.title}</h3>
                <p style={{ color: brandMute, fontSize: 14, margin: 0, marginBottom: 12, lineHeight: 1.6 }}>{career.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {(career.required_skills || []).map((skill, idx) => (
                    <span key={idx} style={{ backgroundColor: "#E9F3FF", color: brandBlue, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, border: "1px solid #D7E9FF" }}>
                      {skill}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 14, marginBottom: 12, color: brandInk }}>
                  <span style={{ fontWeight: 700 }}>Education Path:</span>
                  <div style={{ marginTop: 4, color: brandMute }}>{career.education_path}</div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 900, color: brandInk, marginBottom: 10 }}>
                  <CircleDollarSign size={18} style={{ color: brandBlue }} />
                  {formatSalary(career.expected_salary)}
                </div>
                <button
                  onClick={async () => {
                    await saveHistory(career);
                    navigate(`/career-bank/${career.career_id}`);
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: brandBlue,
                    color: "#FFFFFF",
                    padding: "12px 14px",
                    borderRadius: 12,
                    cursor: "pointer",
                    border: "1px solid " + brandBlue,
                    fontWeight: 900
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
                >
                  View Career
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
