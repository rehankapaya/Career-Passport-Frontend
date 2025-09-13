import React, { useEffect, useMemo, useState } from "react";
import QuizRunner from "../../components/quiz/QuizRunner";
import useQuizFlow from "../../hooks/useQuizFlow";
import { Play, RefreshCw, Clock, ListOrdered, RotateCcw } from "lucide-react";

export default function QuizPage() {
  const { loading, error, quiz, attempt, saveStep, finish, refetch } = useQuizFlow();
  const [started, setStarted] = useState(false);

  const hasInProgressAttempt = useMemo(() => {
    if (!attempt) return false;
    return (
      attempt.status === "in_progress" ||
      attempt.state === "in_progress" ||
      attempt.inProgress === true ||
      (attempt.completed === false && attempt.submitted !== true)
    );
  }, [attempt]);

  useEffect(() => {}, [hasInProgressAttempt]);

  const brandBlue = "#0A66C2";
  const brandDeep = "#004182";
  const brandInk = "#1D2226";
  const brandMute = "#56687A";
  const shell = "#F3F6F8";
  const line = "#E6E9EC";

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontSize: 18, color: brandMute, fontWeight: 600, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        Loading quiz…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 520, margin: "40px auto", padding: 24, backgroundColor: "#FEF3F2", border: "1px solid #FEE4E2", borderRadius: 12, textAlign: "center", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        <p style={{ color: "#B42318", fontSize: 16, marginBottom: 16, lineHeight: 1.5 }}>{error}</p>
        <button
          onClick={refetch}
          style={{ backgroundColor: brandBlue, color: "white", padding: "10px 16px", borderRadius: 12, border: "1px solid " + brandBlue, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
        >
          <RotateCcw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
        <h2 style={{ textAlign: "center", color: brandInk, fontSize: 28, fontWeight: 900, marginBottom: 28, paddingBottom: 14, borderBottom: "2px solid " + line }}>{quiz?.title || "Quiz"}</h2>

        <div style={{ background: "white", border: "1px solid " + line, borderRadius: 16, boxShadow: "0 10px 24px rgba(0,0,0,0.06)", padding: 24 }}>
          {quiz?.description && <p style={{ color: brandMute, lineHeight: 1.7, marginBottom: 18 }}>{quiz.description}</p>}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            {Array.isArray(quiz?.questions) && <Badge label={`${quiz.questions.length} questions`} icon={<ListOrdered size={14} />} />}
            {quiz?.timeLimit && <Badge label={`Time limit: ${quiz.timeLimit} min`} icon={<Clock size={14} />} />}
            {typeof quiz?.maxAttempts === "number" && <Badge label={`Attempts: ${quiz.maxAttempts}`} icon={<RefreshCw size={14} />} />}
          </div>

          <div style={{ background: shell, border: "1px dashed " + line, borderRadius: 12, padding: 16, color: brandMute, marginBottom: 20 }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Read each question first.</li>
              <li>Your progress saves as you move.</li>
              {quiz?.timeLimit && <li>A timer will be visible.</li>}
              <li>Click Finish to submit.</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setStarted(true)}
              style={{ backgroundColor: brandBlue, color: "white", padding: "10px 16px", borderRadius: 12, border: "1px solid " + brandBlue, fontSize: 15, fontWeight: 900, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandDeep)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandBlue)}
              title={hasInProgressAttempt ? "Resume your attempt" : "Start a new attempt"}
            >
              <Play size={16} />
              {hasInProgressAttempt ? "Resume Quiz" : "Start Quiz"}
            </button>

            <button
              onClick={refetch}
              style={{ backgroundColor: "white", color: brandInk, padding: "10px 16px", borderRadius: 12, border: "1px solid " + line, fontSize: 15, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
              title="Reload quiz data"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <h2 style={{ textAlign: "center", color: brandInk, fontSize: 28, fontWeight: 900, marginBottom: 28, paddingBottom: 14, borderBottom: "2px solid " + line }}>{quiz.title}</h2>
      <QuizRunner quiz={quiz} attempt={attempt} onSaveStep={saveStep} onFinish={finish} />
    </div>
  );
}

function Badge({ label, icon }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, background: "#E9F3FF", color: "#0A66C2", fontSize: 13, fontWeight: 800, border: "1px solid #D7E9FF" }}>
      {icon}
      {label}
    </span>
  );
}
