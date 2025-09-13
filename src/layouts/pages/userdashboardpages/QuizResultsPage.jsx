import React from "react";

export default function QuizResultsPage() {
  const results = [
    {
      id: 1,
      title: "Web Development Basics",
      score: "85%",
      status: "Passed",
      date: "2025-09-05",
    },
    {
      id: 2,
      title: "ReactJS Fundamentals",
      score: "72%",
      status: "Passed",
      date: "2025-09-08",
    },
    {
      id: 3,
      title: "Data Structures Quiz",
      score: "48%",
      status: "Failed",
      date: "2025-09-10",
    },
  ];

  return (
    <div>
      <h1 style={{ color: "#2563eb", marginBottom: "15px" }}>Quiz Results</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f9fafb", textAlign: "left" }}>
            <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              Quiz Title
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              Score
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              Status
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((quiz) => (
            <tr key={quiz.id}>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                {quiz.title}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                {quiz.score}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #e5e7eb",
                  color: quiz.status === "Passed" ? "#16a34a" : "#dc2626",
                  fontWeight: "bold",
                }}
              >
                {quiz.status}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                {quiz.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
