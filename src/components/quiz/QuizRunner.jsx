import { useMemo, useState } from "react";
import Timer from "./Timer";
import MCQQuestion from "./MCQQuestion";
import SliderQuestion from "./SliderQuestion";
import LikertQuestion from "./LikertQuestion";
import { useNavigate } from "react-router-dom";

export default function QuizRunner({ quiz, attempt, onSaveStep, onFinish }) {
  const [stepIndex, setStepIndex] = useState(attempt.stepIndex || 0);
  const [answers, setAnswers] = useState({});
  const nav = useNavigate();

  const step = quiz.steps[stepIndex] || [];
  const timeLimit = useMemo(
    () => Math.max(...step.map((q) => q.timeLimitSec || 20), 10),
    [step]
  );

  const setAnswer = (qId, value) => setAnswers((a) => ({ ...a, [qId]: { value } }));

  const componentFor = (q) => {
    if (q.type === "mcq") return <MCQQuestion q={q} onChange={(v) => setAnswer(q._id, v)} />;
    if (q.type === "slider") return <SliderQuestion q={q} onChange={(v) => setAnswer(q._id, v)} />;
    if (q.type === "likert") return <LikertQuestion q={q} onChange={(v) => setAnswer(q._id, v)} />;
    return null;
  };

  const submitStep = async () => {
    const payload = {
      stepIndex,
      responses: step.map((q) => ({
        questionId: q._id,
        value: answers[q._id]?.value ?? null,
        timeTakenSec: q.timeLimitSec || timeLimit,
      })),
    };
    await onSaveStep(payload);

    if (stepIndex + 1 >= quiz.steps.length) {
      const finished = await onFinish();
      nav(`/result/${finished._id}`);
    } else {
      setAnswers({});
      setStepIndex((i) => i + 1);
    }
  };

  const handleExpire = () => submitStep();

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px 20px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#475569'
        }}>
          Step {stepIndex + 1}/{quiz.steps.length}
        </div>
        <Timer seconds={timeLimit} onExpire={handleExpire} />
      </div>
      
      <div style={{
        display: 'grid',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {step.map((q) => (
          <div key={q._id}>{componentFor(q)}</div>
        ))}
      </div>
      
      <button style={{
        backgroundColor: '#4299e1',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#3182ce'
        }
      }} onClick={submitStep}>
        {stepIndex + 1 >= quiz.steps.length ? 'Finish Quiz' : 'Next Step'}
      </button>
    </div>
  );
}