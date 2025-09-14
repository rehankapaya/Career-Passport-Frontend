import React from "react";
import { Brain, Clock, ListChecks } from "lucide-react";

export default function QuizAdminPage() {
  const quiz = {
    title: "Career Orientation Quiz",
    steps: [
      [
        {
          type: "mcq",
          text: "Which task sounds fun?",
          options: ["Analyze data", "Design UI", "Fix servers", "Write content"],
          category: "Aptitude",
          timeLimitSec: 25
        },
        {
          type: "slider",
          text: "Rate your math comfort",
          min: 0,
          max: 10,
          category: "Data",
          timeLimitSec: 20
        }
      ],
      [
        {
          type: "likert",
          text: "I enjoy collaborating with teams",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree"
          ],
          likertScale: 5,
          category: "Soft",
          timeLimitSec: 20
        },
        {
          type: "mcq",
          text: "Pick a hobby",
          options: ["Photography", "Robotics", "Blogging", "App design"],
          category: "Interest",
          timeLimitSec: 25
        }
      ]
    ]
  };

  const scoringLogic = (q) => {
    if (q.type === "mcq") return "1 point per correct answer (if defined)";
    if (q.type === "slider") return `Score = slider value between ${q.min}-${q.max}`;
    if (q.type === "likert") return `Score = scale value 1–${q.likertScale}`;
    return "N/A";
  };

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        background: "#f3f2ef",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 12,
          padding: "20px 30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0a66c2", marginBottom: 20, display:"flex", alignItems:"center", gap:8 }}>
          <Brain size={26} style={{ color: "#0a66c2" }} /> {quiz.title}
        </h1>
        {quiz.steps.map((step, stepIndex) => (
          <div key={stepIndex} style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: "#434649" }}>
              Step {stepIndex + 1}
            </h2>
            {step.map((q, qIndex) => (
              <div
                key={qIndex}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 10,
                  padding: "15px 20px",
                  marginBottom: 15,
                  background: "#fafafa"
                }}
              >
                <div style={{ fontWeight: 600, color: "#1d2226", marginBottom: 8 }}>
                  {q.text}
                </div>
                {q.type === "mcq" && (
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#434649" }}>
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                )}
                {q.type === "slider" && (
                  <div style={{ color: "#434649" }}>
                    Range: {q.min} – {q.max}
                  </div>
                )}
                {q.type === "likert" && (
                  <div style={{ color: "#434649" }}>
                    Likert scale ({q.likertScale}): {q.options.join(" | ")}
                  </div>
                )}
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#666"
                  }}
                >
                  <Clock size={14} /> Time Limit: {q.timeLimitSec}s
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#666"
                  }}
                >
                  <ListChecks size={14} /> Scoring: {scoringLogic(q)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
