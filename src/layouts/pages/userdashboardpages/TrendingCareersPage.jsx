import React, { useContext, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { CareerContext } from "../../../context/CareerContext";

export default function TrendingCareersPage() {
  const { careerData, loading } = useContext(CareerContext);

  if (loading)
    return (
      <p
        style={{
          color: "#6B7280",
          textAlign: "center",
          marginTop: 40,
          fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        }}
      >
        Loading career suggestions...
      </p>
    );

  const careers = useMemo(() => {
    if (!careerData) return [];
    return careerData
      .split(/\*\*\d+\.\s/)
      .slice(1)
      .map((block) => block.trim());
  }, [careerData]);

  return (
    <div
      style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
        color: "#1D2226",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          marginBottom: 32,
        }}
      >
        <TrendingUp size={24} style={{ color: "#0A66C2" }} />
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#0A66C2",
            margin: 0,
            letterSpacing: 0.2,
          }}
        >
          Trending Career Suggestions
        </h2>
      </div>

      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(238,243,248,1) 0%, rgba(233,243,255,1) 100%)",
          color: "#434649",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 32,
          border: "1px solid #E6E9EC",
        }}
      >
        <p style={{ lineHeight: 1.6, margin: 0 }}>
          {careerData.split("**1.")[0]}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {careers.map((career, index) => {
          const lines = career.split("\n").filter((l) => l.trim());
          const [titleLine, ...details] = lines;
          return (
            <div
              key={index}
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid #E6E9EC",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                padding: 20,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0A66C2",
                  margin: "0 0 12px 0",
                  lineHeight: 1.35,
                }}
              >
                {titleLine.replace(/\*\*/g, "").replace(":", "")}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {details.map((line, i) => (
                  <li
                    key={i}
                    style={{
                      color: "#434649",
                      fontSize: 14,
                      lineHeight: 1.6,
                      paddingLeft: 10,
                      borderLeft: "4px solid #0A66C2",
                      marginBottom: 8,
                      background: "#F7FAFC",
                      borderRadius: 8,
                      paddingTop: 8,
                      paddingBottom: 8,
                    }}
                  >
                    {line.replace(/\*/g, "").trim()}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
