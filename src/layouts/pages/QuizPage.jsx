import React, { useEffect, useMemo, useState } from "react";
import QuizRunner from "../../components/quiz/QuizRunner";
import useQuizFlow from "../../hooks/useQuizFlow";

export default function QuizPage() {
  const { loading, error, quiz, attempt, saveStep, finish, refetch } = useQuizFlow();

  // gate rendering of the runner until user clicks Start/Resume
  const [started, setStarted] = useState(false);

  // decide if there is an existing attempt in progress
  const hasInProgressAttempt = useMemo(() => {
    if (!attempt) return false;
    // cover common shapes: status flags or booleans
    return (
      attempt.status === "in_progress" ||
      attempt.state === "in_progress" ||
      attempt.inProgress === true ||
      (attempt.completed === false && attempt.submitted !== true)
    );
  }, [attempt]);

  // if hook loads an in-progress attempt, auto-offer Resume (but don't auto-start)
  useEffect(() => {
    // do nothing here — we’ll show the pre-start screen with a Resume button
  }, [hasInProgressAttempt]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        fontSize: "18px",
        color: "#64748b",
        fontWeight: 500
      }}>
        Loading quiz…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: 8,
        textAlign: "center"
      }}>
        <p style={{ color: "#dc2626", fontSize: 16, marginBottom: 20, lineHeight: 1.5 }}>
          {error}
        </p>
        <button
          onClick={refetch}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Pre-start screen (shown until user chooses Start/Resume)
  if (!started) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <h2 style={{
          textAlign: "center",
          color: "#1e293b",
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: "2px solid #e2e8f0"
        }}>
          {quiz?.title || "Quiz"}
        </h2>

        <div style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          padding: 24
        }}>
          {quiz?.description && (
            <p style={{ color: "#334155", lineHeight: 1.6, marginBottom: 20 }}>
              {quiz.description}
            </p>
          )}

          {/* Meta row */}
          <div style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 20
          }}>
            {Array.isArray(quiz?.questions) && (
              <Badge label={`${quiz.questions.length} questions`} />
            )}
            {quiz?.timeLimit && (
              <Badge label={`Time limit: ${quiz.timeLimit} min`} />
            )}
            {typeof quiz?.maxAttempts === "number" && (
              <Badge label={`Attempts allowed: ${quiz.maxAttempts}`} />
            )}
          </div>

          {/* Instructions */}
          <div style={{
            background: "#f8fafc",
            border: "1px dashed #e2e8f0",
            borderRadius: 10,
            padding: 16,
            color: "#475569",
            marginBottom: 20
          }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Read each question carefully before answering.</li>
              <li>Your progress is saved as you move between questions.</li>
              {quiz?.timeLimit && <li>You’ll see a timer during the quiz.</li>}
              <li>Click <strong>Finish</strong> at the end to submit.</li>
            </ul>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setStarted(true)}
              style={primaryButton}
            >
              { "Start Quiz"}
            </button>

            <button
              onClick={refetch}
              style={secondaryButton}
              title="Reload quiz data"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Actual quiz runner (after clicking Start/Resume)
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2 style={{
        textAlign: "center",
        color: "#1e293b",
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 32,
        paddingBottom: 16,
        borderBottom: "2px solid #e2e8f0"
      }}>
        {quiz.title}
      </h2>

      <QuizRunner
        quiz={quiz}
        attempt={attempt}
        onSaveStep={saveStep}
        onFinish={finish}
      />
    </div>
  );
}

/* ---------- tiny UI helpers ---------- */

function Badge({ label }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: 999,
      background: "#e9f1ff",
      color: "#1a73e8",
      fontSize: 13,
      fontWeight: 600,
      border: "1px solid #dbeafe"
    }}>
      {label}
    </span>
  );
}

const primaryButton = {
  backgroundColor: "#1a73e8",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer"
};

const secondaryButton = {
  backgroundColor: "#f1f5f9",
  color: "#0f172a",
  padding: "10px 16px",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer"
};
