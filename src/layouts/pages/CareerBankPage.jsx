import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { apiurl } from "../../api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function CareerBankPage() {
  const [careerPaths, setCareerPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [sortBy, setSortBy] = useState("Alphabetical");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Save history function
  async function saveHistory(resource) {
    try {
      const payload = {
        userId: user._id,
        categoryType: "careers", // 👈 yahan "career"
        itemId: resource._id || resource.career_id,
        title: resource.title,
        subCategory: resource.domain || null,
        meta: resource,
      };

      await axios.post(`${apiurl}/api/history`, payload);
      console.log("History saved:", payload);
    } catch (err) {
      console.error("Error saving history", err);
    }
  }

  // Fetch data from API
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios(`${apiurl}/api/careers`);
        if (!response.data.length > 0) {
          throw new Error("Failed to fetch career data");
        }
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

  // Apply filters and sorting
  useEffect(() => {
    let result = [...careerPaths];

    // Industry filter
    if (industryFilter !== "All Industries") {
      result = result.filter((career) => career.domain === industryFilter);
    }

    // Sorting
    if (sortBy === "Alphabetical") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Salary: High to Low") {
      result.sort((a, b) => b.expected_salary - a.expected_salary);
    } else if (sortBy === "Salary: Low to High") {
      result.sort((a, b) => a.expected_salary - b.expected_salary);
    }

    setFilteredCareers(result);
  }, [careerPaths, industryFilter, sortBy]);

  // Domains for filter dropdown
  const domains = [
    "All Industries",
    ...new Set(careerPaths.map((career) => career.domain)),
  ];

  // Icons by title
  const getCareerIcon = (title) => {
    if (title.toLowerCase().includes("software")) return "👨‍💻";
    if (title.toLowerCase().includes("data")) return "📊";
    if (title.toLowerCase().includes("nurse")) return "⚕️";
    if (title.toLowerCase().includes("financial")) return "📈";
    if (title.toLowerCase().includes("teacher")) return "👩‍🏫";
    if (title.toLowerCase().includes("marketing")) return "📢";
    if (title.toLowerCase().includes("engineer")) return "👷";
    if (title.toLowerCase().includes("designer")) return "🎨";
    if (title.toLowerCase().includes("lawyer")) return "⚖️";
    return "💼";
  };

  const formatSalary = (salary) => `$${salary.toLocaleString()}`;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div>Loading career data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        fontFamily: "sans-serif",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              backgroundColor: "#e5e7eb",
              borderRadius: "0.75rem",
              padding: "0.75rem",
              display: "inline-block",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "2rem" }}>🏦</span>
          </div>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Career Bank
          </h1>
          <p style={{ color: "#6b7280", maxWidth: "42rem", margin: "auto" }}>
            Explore hundreds of career paths with detailed insights, requirements,
            and growth opportunities
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#6b7280" }}>Filter by Industry:</span>
            <select
              style={{
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
              }}
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              {domains.map((domain, index) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
            <span style={{ color: "#6b7280" }}>Sort by:</span>
            <select
              style={{
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
              }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Alphabetical</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>
          <div style={{ color: "#4b5563" }}>
            Showing {filteredCareers.length} of {careerPaths.length} careers
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {filteredCareers.map((career) => (
            <div
              key={career._id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    display: "inline-block",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>
                    {getCareerIcon(career.title)}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  {career.title}
                </h3>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    marginBottom: "1rem",
                  }}
                >
                  {career.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {career.required_skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      style={{
                        backgroundColor: "#e5e7eb",
                        color: "#6b7280",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div
                  style={{ fontSize: "0.875rem", marginBottom: "1rem" }}
                >
                  <span style={{ fontWeight: "500" }}>Education Path:</span>{" "}
                  <br />
                  {career.education_path}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  {formatSalary(career.expected_salary)}
                </div>
                <button
                  onClick={async () => {
                    await saveHistory(career);
                    navigate(`/career-bank/${career.career_id}`);
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "#1f2937",
                    color: "#ffffff",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    border: "none",
                  }}
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
