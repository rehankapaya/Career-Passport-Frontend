import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiurl } from "../../../api";
import { UserContext } from "../../../context/UserContext";

export default function QuizResultsPage() {
  const {user} = useContext(UserContext)
  const userId = user._id; // 👈 dynamically UserContext se bhi le sakte ho
  const [results, setResults] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(
          `${apiurl}/api/attempt/history/${userId}`
        );
        setResults(r.data);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [userId]);

  if (err)
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        {err}
      </div>
    );

  if (!results.length)
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No quiz results found.
      </div>
    );

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
              Quiz ID
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              Status
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              Total Score
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              Created At
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              Updated At
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((attempt) => (
            <tr key={attempt._id}>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}
              >
                {attempt.quizId}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #e5e7eb",
                  color: attempt.status === "completed" ? "#16a34a" : "#dc2626",
                  fontWeight: "bold",
                }}
              >
                {attempt.status}
              </td>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}
              >
                {attempt.totalScore}
              </td>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}
              >
                {new Date(attempt.createdAt).toLocaleString()}
              </td>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}
              >
                {new Date(attempt.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
