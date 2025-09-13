import React, { useState } from "react";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

export default function InterestQuizPage() {
  const [selectedInterest, setSelectedInterest] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const interestAreas = [
    "Science & Technology",
    "Arts & Humanities",
    "Business & Finance",
    "Healthcare & Wellness",
    "Trades & Skilled Labor",
  ];

  const quizQuestions = {
    "Science & Technology": [
      { question: "Which of these subjects interests you the most?", options: ["Physics", "Computer Science", "Biology", "Chemistry"] },
      { question: "What kind of work environment do you prefer?", options: ["Lab/Research Setting", "Office with a team", "Outdoors", "Data center"] },
    ],
    "Arts & Humanities": [
      { question: "Which activity do you enjoy most?", options: ["Reading novels", "Painting or drawing", "Debating ideas", "Visiting museums"] },
      { question: "What kind of projects do you find most fulfilling?", options: ["Creative projects with a team", "Solo projects", "Historical research", "Community-based work"] },
    ],
    "Business & Finance": [
      { question: "What skills are you most confident in?", options: ["Problem-solving", "Negotiation", "Data analysis", "Public speaking"] },
      { question: "What kind of work best fits your personality?", options: ["Leading a team", "Analyzing market trends", "Managing budgets", "Developing new products"] },
    ],
    "Healthcare & Wellness": [
      { question: "What motivates you in a career?", options: ["Helping others directly", "Scientific discovery", "Promoting public health", "Working with medical technology"] },
      { question: "What kind of patient interaction do you prefer?", options: ["One-on-one care", "Working with a community", "Researching diseases", "Emergency situations"] },
    ],
    "Trades & Skilled Labor": [
      { question: "What do you enjoy doing in your free time?", options: ["Fixing things", "Building with your hands", "Working outdoors", "Following a blueprint"] },
      { question: "What kind of work environment do you prefer?", options: ["Working with tools", "In a workshop", "On a construction site", "Client-facing work"] },
    ],
  };

  const handleInterestSelect = (e) => setSelectedInterest(e.target.value);
  const handleStartQuiz = () => {
    if (selectedInterest) {
      setQuizStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
    }
  };
  const handleAnswerSelect = (option) => setAnswers({ ...answers, [currentQuestion]: option });
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions[selectedInterest].length - 1) setCurrentQuestion(currentQuestion + 1);
  };
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const currentQuizData = quizQuestions[selectedInterest]?.[currentQuestion];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F3F6F8", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif", padding: "32px", color: "#1D2226" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 14, backgroundColor: "#EAF3FF", marginBottom: 12, boxShadow: "0 8px 24px rgba(10,102,194,0.15)" }}>
            <Lightbulb size={28} color="#0A66C2" />
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, margin: 0, letterSpacing: 0.2 }}>Discover Your Perfect Path</h1>
          <p style={{ color: "#6B7280", maxWidth: 680, margin: "10px auto 0", lineHeight: 1.6 }}>
            Take a quick quiz to spot streams and roles that match your interests. No pressure—just explore what feels right.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, border: "1px solid #E6E9EC", boxShadow: "0 12px 28px rgba(0,0,0,0.08)" }}>
            {!quizStarted ? (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "#1D2226" }}>Choose your primary interest area</h3>
                <select value={selectedInterest} onChange={handleInterestSelect} style={{ width: "100%", marginTop: 12, padding: "12px 14px", borderRadius: 10, border: "1px solid #E6E9EC", backgroundColor: "#FFFFFF", cursor: "pointer", fontSize: 15 }}>
                  <option value="">Select an interest…</option>
                  {interestAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: 20, textAlign: "center" }}>
                  <button
                    onClick={handleStartQuiz}
                    disabled={!selectedInterest}
                    style={{
                      padding: "12px 22px",
                      borderRadius: 10,
                      border: "none",
                      backgroundColor: selectedInterest ? "#0A66C2" : "#AEB3B7",
                      color: "#FFFFFF",
                      fontWeight: 800,
                      cursor: selectedInterest ? "pointer" : "not-allowed",
                      boxShadow: selectedInterest ? "0 8px 20px rgba(10,102,194,0.35)" : "none",
                      letterSpacing: 0.3,
                    }}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#6B7280" }}>
                  Question {currentQuestion + 1} of {quizQuestions[selectedInterest].length}
                </h3>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#1D2226", marginTop: 10, marginBottom: 18, lineHeight: 1.35 }}>{currentQuizData.question}</p>
                <div style={{ display: "grid", gap: 10 }}>
                  {currentQuizData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 12,
                        border: answers[currentQuestion] === option ? "2px solid #0A66C2" : "1px solid #E6E9EC",
                        backgroundColor: answers[currentQuestion] === option ? "#EEF3F8" : "#FFFFFF",
                        color: "#1D2226",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "1px solid #E6E9EC",
                      backgroundColor: currentQuestion === 0 ? "#F3F6F8" : "#FFFFFF",
                      color: "#1D2226",
                      cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
                      fontWeight: 700,
                    }}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!Object.prototype.hasOwnProperty.call(answers, currentQuestion) || currentQuestion === quizQuestions[selectedInterest].length - 1}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      backgroundColor: Object.prototype.hasOwnProperty.call(answers, currentQuestion) ? "#0A66C2" : "#AEB3B7",
                      color: "#FFFFFF",
                      cursor: Object.prototype.hasOwnProperty.call(answers, currentQuestion) ? "pointer" : "not-allowed",
                      fontWeight: 800,
                      boxShadow: Object.prototype.hasOwnProperty.call(answers, currentQuestion) ? "0 8px 20px rgba(10,102,194,0.35)" : "none",
                    }}
                  >
                    {currentQuestion === quizQuestions[selectedInterest].length - 1 ? "Finish Quiz" : "Next"}
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
