import React, { useState } from 'react'

export default function InterestQuizPage() {
  const [selectedInterest, setSelectedInterest] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const interestAreas = ['Science & Technology', 'Arts & Humanities', 'Business & Finance', 'Healthcare & Wellness', 'Trades & Skilled Labor'];
  const quizQuestions = {
    'Science & Technology': [
      {
        question: 'Which of these subjects interests you the most?',
        options: ['Physics', 'Computer Science', 'Biology', 'Chemistry']
      },
      {
        question: 'What kind of work environment do you prefer?',
        options: ['Lab/Research Setting', 'Office with a team', 'Outdoors', 'Data center']
      }
    ],
    'Arts & Humanities': [
      {
        question: 'Which activity do you enjoy most?',
        options: ['Reading novels', 'Painting or drawing', 'Debating ideas', 'Visiting museums']
      },
      {
        question: 'What kind of projects do you find most fulfilling?',
        options: ['Creative projects with a team', 'Solo projects', 'Historical research', 'Community-based work']
      }
    ],
    'Business & Finance': [
      {
        question: 'What skills are you most confident in?',
        options: ['Problem-solving', 'Negotiation', 'Data analysis', 'Public speaking']
      },
      {
        question: 'What kind of work best fits your personality?',
        options: ['Leading a team', 'Analyzing market trends', 'Managing budgets', 'Developing new products']
      }
    ],
    'Healthcare & Wellness': [
      {
        question: 'What motivates you in a career?',
        options: ['Helping others directly', 'Scientific discovery', 'Promoting public health', 'Working with medical technology']
      },
      {
        question: 'What kind of patient interaction do you prefer?',
        options: ['One-on-one care', 'Working with a community', 'Researching diseases', 'Emergency situations']
      }
    ],
    'Trades & Skilled Labor': [
      {
        question: 'What do you enjoy doing in your free time?',
        options: ['Fixing things', 'Building with your hands', 'Working outdoors', 'Following a blueprint']
      },
      {
        question: 'What kind of work environment do you prefer?',
        options: ['Working with tools', 'In a workshop', 'On a construction site', 'Client-facing work']
      }
    ]
  };

  const handleInterestSelect = (e) => {
    setSelectedInterest(e.target.value);
  };

  const handleStartQuiz = () => {
    if (selectedInterest) {
      setQuizStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const handleAnswerSelect = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions[selectedInterest].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQuizData = quizQuestions[selectedInterest]?.[currentQuestion];

  return (
    <div>
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.75rem', padding: '0.75rem', display: 'inline-block', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>💡</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Discover Your Perfect Path</h1>
          <p style={{ color: '#6b7280', maxWidth: '42rem', margin: 'auto' }}>
            Take our interactive quiz to discover education streams and career paths that align with your interests and strengths
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', width: '100%', maxWidth: '30rem' }}>
            {!quizStarted ? (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937', marginBottom: '1rem' }}>Choose your primary interest area:</h3>
                <select
                  value={selectedInterest}
                  onChange={handleInterestSelect}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer' }}
                >
                  <option value="">Select an interest...</option>
                  {interestAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <button
                    onClick={handleStartQuiz}
                    disabled={!selectedInterest}
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      backgroundColor: selectedInterest ? '#2563eb' : '#9ca3af',
                      color: '#ffffff',
                      cursor: selectedInterest ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937', marginBottom: '1rem' }}>
                  Question {currentQuestion + 1} of {quizQuestions[selectedInterest].length}:
                </h3>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>{currentQuizData.question}</p>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {currentQuizData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      style={{
                        padding: '1rem',
                        borderRadius: '0.375rem',
                        border: answers[currentQuestion] === option ? '2px solid #2563eb' : '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                        color: '#1f2937',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: currentQuestion === 0 ? '#f3f4f6' : '#ffffff',
                      color: '#1f2937',
                      cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!answers.hasOwnProperty(currentQuestion) || currentQuestion === quizQuestions[selectedInterest].length - 1}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      backgroundColor: answers.hasOwnProperty(currentQuestion) ? '#2563eb' : '#9ca3af',
                      color: '#ffffff',
                      cursor: answers.hasOwnProperty(currentQuestion) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {currentQuestion === quizQuestions[selectedInterest].length - 1 ? 'Finish Quiz' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      
    </div>
  )
}
