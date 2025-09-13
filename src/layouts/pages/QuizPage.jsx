import QuizRunner from "../../components/quiz/QuizRunner";
import useQuizFlow from "../../hooks/useQuizFlow";

export default function QuizPage() {
  const { loading, error, quiz, attempt, saveStep, finish, refetch } = useQuizFlow();

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      fontSize: '18px',
      color: '#64748b',
      fontWeight: '500'
    }}>
      Loading quiz…
    </div>
  );

  if (error) return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '24px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <p style={{
        color: '#dc2626',
        fontSize: '16px',
        marginBottom: '20px',
        lineHeight: '1.5'
      }}>
        {error}
      </p>
      <button style={{
        backgroundColor: '#dc2626',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#b91c1c'
        }
      }} onClick={refetch}>
        Retry
      </button>
    </div>
  );

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#1e293b',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e2e8f0'
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