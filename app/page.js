"use client";

import { useMemo, useState } from "react";
import { questions } from "../data/questions";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [randomMode, setRandomMode] = useState(true);
  const [limit70, setLimit70] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const quizQuestions = useMemo(() => {
    let list = [...questions];
    if (randomMode) list = shuffleArray(list);
    if (limit70) list = list.slice(0, 70);
    return list;
  }, [randomMode, limit70, started]);

  const currentQuestion = quizQuestions[currentIndex];

  function startQuiz() {
    setStarted(true);
    setCurrentIndex(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  }

  function selectOption(option) {
    if (showFeedback) return;
    setSelected(option);
    setShowFeedback(true);
    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  }

  function nextQuestion() {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  }

  function restartQuiz() {
    setStarted(false);
    setCurrentIndex(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  }

  if (!started) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.hero}>
            <h1 style={styles.title}>HUM 301 MCQ Practice</h1>
            <p style={styles.subtitle}>
              Science, Technology and Human Existence and Society
            </p>
            <p style={styles.text}>
              Total bank: <strong>{questions.length}</strong> questions
            </p>

            <div style={styles.settings}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={randomMode}
                  onChange={() => setRandomMode((prev) => !prev)}
                />
                <span style={styles.labelText}> Randomize questions</span>
              </label>

              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={limit70}
                  onChange={() => setLimit70((prev) => !prev)}
                />
                <span style={styles.labelText}> Use 70 question exam mode</span>
              </label>
            </div>

            <button style={styles.startButton} onClick={startQuiz}>
              Start Practice
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (finished) {
    const percentage = Math.round((score / quizQuestions.length) * 100);

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.resultCard}>
            <h1 style={styles.title}>Quiz Completed</h1>
            <p style={styles.resultText}>
              Score: <strong>{score}</strong> / <strong>{quizQuestions.length}</strong>
            </p>
            <p style={styles.resultText}>
              Percentage: <strong>{percentage}%</strong>
            </p>
            <button style={styles.startButton} onClick={restartQuiz}>
              Restart
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.smallTitle}>HUM 301 MCQ Practice</h1>
            <p style={styles.progressText}>
              Question {currentIndex + 1} of {quizQuestions.length}
            </p>
          </div>
          <div style={styles.scoreBox}>Score: {score}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.metaRow}>
            <span style={styles.badge}>{currentQuestion.module}</span>
          </div>

          <h2 style={styles.question}>{currentQuestion.question}</h2>

          <div style={styles.optionsWrap}>
            {currentQuestion.options.map((option, index) => {
              let buttonStyle = { ...styles.optionButton };

              if (showFeedback) {
                if (option === currentQuestion.answer) {
                  buttonStyle = { ...buttonStyle, ...styles.correctOption };
                } else if (option === selected && option !== currentQuestion.answer) {
                  buttonStyle = { ...buttonStyle, ...styles.wrongOption };
                }
              }

              return (
                <button
                  key={index}
                  style={buttonStyle}
                  onClick={() => selectOption(option)}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div style={styles.feedbackBox}>
              {selected === currentQuestion.answer ? (
                <p style={styles.correctText}>Correct</p>
              ) : (
                <>
                  <p style={styles.wrongText}>Wrong</p>
                  <p style={styles.answerText}>
                    Correct answer: <strong>{currentQuestion.answer}</strong>
                  </p>
                </>
              )}

              <button style={styles.nextButton} onClick={nextQuestion}>
                {currentIndex + 1 === quizQuestions.length ? "Finish Quiz" : "Next Question"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  hero: {
    background: "#111827",
    color: "white",
    borderRadius: "20px",
    padding: "28px",
    marginTop: "30px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
  },
  subtitle: {
    marginTop: "10px",
    fontSize: "16px",
    opacity: 0.95,
  },
  text: {
    marginTop: "16px",
    fontSize: "16px",
  },
  settings: {
    marginTop: "20px",
    display: "grid",
    gap: "12px",
  },
  label: {
    fontSize: "16px",
  },
  labelText: {
    marginLeft: "8px",
  },
  startButton: {
    marginTop: "24px",
    padding: "14px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
  resultCard: {
    background: "white",
    borderRadius: "20px",
    padding: "28px",
    marginTop: "30px",
    textAlign: "center",
  },
  resultText: {
    fontSize: "20px",
    marginTop: "12px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  smallTitle: {
    margin: 0,
    fontSize: "24px",
  },
  progressText: {
    margin: "8px 0 0 0",
    color: "#4b5563",
  },
  scoreBox: {
    background: "#111827",
    color: "white",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "bold",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
  },
  metaRow: {
    marginBottom: "12px",
  },
  badge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  question: {
    fontSize: "24px",
    lineHeight: 1.4,
    marginBottom: "20px",
  },
  optionsWrap: {
    display: "grid",
    gap: "12px",
  },
  optionButton: {
    textAlign: "left",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    cursor: "pointer",
    fontSize: "16px",
  },
  correctOption: {
    background: "#dcfce7",
    border: "1px solid #22c55e",
  },
  wrongOption: {
    background: "#fee2e2",
    border: "1px solid #ef4444",
  },
  feedbackBox: {
    marginTop: "22px",
    padding: "18px",
    borderRadius: "14px",
    background: "#f8fafc",
  },
  correctText: {
    color: "#15803d",
    fontWeight: "bold",
    fontSize: "18px",
    margin: 0,
  },
  wrongText: {
    color: "#b91c1c",
    fontWeight: "bold",
    fontSize: "18px",
    margin: 0,
  },
  answerText: {
    marginTop: "10px",
    fontSize: "16px",
  },
  nextButton: {
    marginTop: "16px",
    padding: "12px 16px",
    border: "none",
    borderRadius: "12px",
    background: "#0f172a",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
};
