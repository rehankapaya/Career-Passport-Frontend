import React, { useEffect, useState } from "react";

export default function AdminQuizHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attempt/history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          color: "#5f5f5f",
          fontSize: "16px",
        }}
      >
        Loading quiz history...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "32px",
        fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        backgroundColor: "#f3f2ef", // LinkedIn background
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#1d2226",
          marginBottom: "20px",
        }}
      >
        📊 Quiz Attempts History
      </h2>

      {/* Table Container */}
      <div
        style={{
          overflowX: "auto",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          borderRadius: "8px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          {/* Table Head */}
          <thead
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <tr>
              {["User", "Quiz ID", "Step Index", "Status", "Total Score", "Created At"].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#434649",
                    }}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {history.length > 0 ? (
              history.map((attempt, idx) => (
                <tr
                  key={attempt._id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#eef3f8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      idx % 2 === 0 ? "#ffffff" : "#f9fafb")
                  }
                >
                  {/* User */}
                  <td
                    style={{
                      padding: "14px 20px",
                      fontSize: "14px",
                      color: "#1d2226",
                    }}
                  >
                    {attempt.userId?.email || "N/A"}
                  </td>

                  {/* Quiz ID */}
                  <td
                    style={{
                      padding: "14px 20px",
                      fontSize: "14px",
                      color: "#5f5f5f",
                    }}
                  >
                    {attempt.quizId}
                  </td>

                  {/* Step Index */}
                  <td
                    style={{
                      padding: "14px 20px",
                      fontSize: "14px",
                      color: "#5f5f5f",
                    }}
                  >
                    {attempt.stepIndex}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "20px",
                        backgroundColor:
                          attempt.status === "completed"
                            ? "rgba(112, 181, 72, 0.15)" // LinkedIn green
                            : "rgba(255, 191, 0, 0.15)", // Yellow
                        color:
                          attempt.status === "completed"
                            ? "#007d44"
                            : "#915907",
                      }}
                    >
                      {attempt.status}
                    </span>
                  </td>

                  {/* Total Score */}
                  <td
                    style={{
                      padding: "14px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1d2226",
                    }}
                  >
                    {attempt.totalScore ?? "-"}
                  </td>

                  {/* Created At */}
                  <td
                    style={{
                      padding: "14px 20px",
                      fontSize: "14px",
                      color: "#5f5f5f",
                    }}
                  >
                    {new Date(attempt.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#5f5f5f",
                  }}
                >
                  No quiz attempts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
