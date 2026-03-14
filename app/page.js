"use client";

import { useMemo, useState } from "react";
import { questions } from "../data/questions";

export default function Home() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [showAnswers, setShowAnswers] = useState({});
  const [randomMode, setRandomMode] = useState(false);
  const [examMode, setExamMode] = useState(false);

  const modules = useMemo(() => {
    return ["All", ...new Set(questions.map((q) => q.module))];
  }, []);

  const filteredQuestions = useMemo(() => {
    let list = [...questions];

    if (moduleFilter !== "All") {
      list = list.filter((q) => q.module === moduleFilter);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (q) =>
          q.question.toLowerCase().includes(term) ||
          q.answer.toLowerCase().includes(term) ||
          q.module.toLowerCase().includes(term)
      );
    }

    if (randomMode) {
      list = [...list].sort(() => Math.random() - 0.5);
    }

    if (examMode) {
      list = list.slice(0, 70);
    }

    return list;
  }, [search, moduleFilter, randomMode, examMode]);

  function toggleAnswer(id) {
    setShowAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function revealAll() {
    const all = {};
    filteredQuestions.forEach((q) => {
      all[q.id] = true;
    });
    setShowAnswers(all);
  }

  function hideAll() {
    setShowAnswers({});
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>HUM 301 Exam Practice</h1>
          <p style={styles.subtitle}>
            Science, Technology and Human Existence and Society
          </p>
          <p style={styles.small}>
            Total questions: <strong>{questions.length}</strong>
          </p>
        </div>

        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search questions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            style={styles.select}
          >
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>

          <button
            onClick={() => setRandomMode((prev) => !prev)}
            style={styles.button}
          >
            {randomMode ? "Stop Random" : "Random Practice"}
          </button>

          <button
            onClick={() => setExamMode((prev) => !prev)}
            style={styles.button}
          >
            {examMode ? "Show Full Bank" : "70 Question Exam Mode"}
          </button>

          <button onClick={revealAll} style={styles.button}>
            Reveal All
          </button>

          <button onClick={hideAll} style={styles.buttonDark}>
            Hide All
          </button>
        </div>

        <p style={styles.count}>
          Showing <strong>{filteredQuestions.length}</strong> question(s)
        </p>

        <div style={styles.list}>
          {filteredQuestions.map((item, index) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.meta}>
                <span>#{index + 1}</span>
                <span>{item.module}</span>
                <span>{item.type.toUpperCase()}</span>
              </div>

              <h3 style={styles.question}>{item.question}</h3>

              {item.type === "mcq" && item.options && (
                <div style={styles.options}>
                  {item.options.map((option, i) => (
                    <div key={i} style={styles.option}>
                      {String.fromCharCode(65 + i)}. {option}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => toggleAnswer(item.id)}
                style={styles.answerButton}
              >
                {showAnswers[item.id] ? "Hide Answer" : "Show Answer"}
              </button>

              {showAnswers[item.id] && (
                <div style={styles.answer}>
                  <strong>Answer:</strong> {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    background: "#f4f7fb",
    minHeight: "100vh",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    background: "#0f172a",
    color: "white",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: "8px",
    fontSize: "16px",
  },
  small: {
    margin: 0,
    opacity: 0.9,
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "18px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonDark: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#1e293b",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  count: {
    fontSize: "15px",
    marginBottom: "16px",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  card: {
    background: "white",
    borderRadius: "14px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    fontSize: "12px",
    color: "#475569",
    marginBottom: "10px",
  },
  question: {
    marginTop: 0,
    fontSize: "18px",
    color: "#0f172a",
  },
  options: {
    display: "grid",
    gap: "8px",
    marginBottom: "12px",
  },
  option: {
    background: "#f8fafc",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  answerButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#0ea5e9",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "8px",
  },
  answer: {
    marginTop: "12px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "12px",
    borderRadius: "10px",
    lineHeight: 1.6,
  },
};
