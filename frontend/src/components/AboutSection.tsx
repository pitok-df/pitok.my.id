"use client";

import { Camera, ListTodo } from "lucide-react";
import { useEffect, useState } from "react";
import { playSound } from "@/data/audioManager";
import ParticlesBackground from "./ParticlesBackground";
import ScrollReveal from "./ScrollReveal";

interface Fact {
  value: string;
  label: string;
}

interface AboutData {
  bio: string;
  facts: Fact[];
}

function StatCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const isInfinity = value === "∞" || value.includes("∞");

  const target = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (isInfinity) {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        if (current > 50) {
          setCount(999);
          clearInterval(interval);
        } else {
          setCount(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }

    if (target === 0) return;
    let start = 0;
    const duration = 1200; // ms
    const increment = target / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, isInfinity]);

  if (isInfinity && count === 999) {
    return <span>∞</span>;
  }

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function TaskManager() {
  const [tasks, setTasks] = useState<
    { id: number; text: string; done: boolean }[]
  >([]);
  const [input, setInput] = useState("");

  const playBleep = (
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
  ) => {
    playSound(freq, duration, type);
  };

  useEffect(() => {
    const saved = localStorage.getItem("telemetryTasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        setTasks(getDefaultTasks());
      }
    } else {
      setTasks(getDefaultTasks());
    }
  }, []);

  const getDefaultTasks = () => [
    { id: 1, text: "Hire Pito Desri Pauzi", done: false },
    { id: 2, text: "Review BOSS Kasir App", done: true },
    { id: 3, text: "Check out branch theme switcher", done: false },
    { id: 4, text: "Find console snake game", done: true },
  ];

  const saveTasks = (newTasks: typeof tasks) => {
    setTasks(newTasks);
    localStorage.setItem("telemetryTasks", JSON.stringify(newTasks));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      done: false,
    };
    saveTasks([...tasks, newTask]);
    setInput("");
    playBleep(600, 0.05, "sine");
  };

  const toggleTask = (id: number) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t,
    );
    saveTasks(updated);
    const task = tasks.find((t) => t.id === id);
    playBleep(task?.done ? 500 : 880, 0.08, "sine");
  };

  const deleteTask = (id: number) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
    playBleep(330, 0.08, "sine");
  };

  return (
    <div
      className="card task-manager-card"
      style={{
        padding: "16px",
        background: "var(--bg-secondary)",
        border: "1px dashed var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          paddingBottom: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <ListTodo size={12} />
          <span>task_planner.sh</span>
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--text-muted)",
          }}
        >
          LOCAL STORAGE
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxHeight: "110px",
          overflowY: "auto",
          paddingRight: 4,
        }}
        className="task-list-scrollbar"
      >
        {tasks.length === 0 ? (
          <div
            style={{
              fontSize: 11,
              fontStyle: "italic",
              color: "var(--text-muted)",
              padding: "10px 0",
              textAlign: "center",
            }}
          >
            No tasks found. Add one below!
          </div>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  userSelect: "none",
                  flex: 1,
                  textDecoration: t.done ? "line-through" : "none",
                  color: t.done ? "var(--text-muted)" : "var(--text-primary)",
                }}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  style={{ accentColor: "var(--accent)", cursor: "pointer" }}
                />
                <span style={{ wordBreak: "break-all" }}>{t.text}</span>
              </label>
              <button
                onClick={() => deleteTask(t.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                }}
                className="task-del-btn"
              >
                [x]
              </button>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={addTask}
        style={{
          display: "flex",
          gap: 8,
          marginTop: 10,
          borderTop: "1px solid var(--border)",
          paddingTop: 10,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task..."
          maxLength={30}
          required
          style={{
            flex: 1,
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "4px 8px",
            fontSize: 11,
            color: "var(--text-primary)",
            outline: "none",
            fontFamily: "var(--font-mono)",
          }}
        />
        <button
          type="submit"
          className="btn-secondary"
          style={{
            padding: "4px 10px",
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          ADD
        </button>
      </form>
    </div>
  );
}

export default function AboutSection({ data }: { data: AboutData }) {
  return (
    <section
      id="about"
      className="section-padding"
      style={{ position: "relative" }}
    >
      <ParticlesBackground />
      <div className="section-container">
        <div className="about-grid">
          {/* Left Column: Bio */}
          <div>
            <ScrollReveal direction="left">
              <div className="section-label">About Me</div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={100}>
              <h2 className="heading-lg" style={{ marginBottom: 20 }}>
                Bio & Background
              </h2>
            </ScrollReveal>

            {data.bio.split("\n\n").map((paragraph, i) => (
              <ScrollReveal key={i} direction="left" delay={150 + i * 50}>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  {paragraph}
                </p>
              </ScrollReveal>
            ))}

            <ScrollReveal direction="left" delay={300}>
              <div style={{ marginTop: 24 }}>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  className="btn-secondary"
                  style={{ fontSize: 13, padding: "8px 16px" }}
                  rel="noopener"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      marginRight: 6,
                      display: "inline",
                      verticalAlign: "middle",
                    }}
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download CV
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Avatar, Stats & Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Retro Cyberpunk Avatar Frame */}
            <ScrollReveal delay={100}>
              <div
                className="card profile-card"
                style={{ padding: 0, overflow: "hidden", position: "relative" }}
              >
                <div className="profile-top-bar">
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <Camera size={12} style={{ color: "var(--accent)" }} />
                    <span>avatar_viewer.sys</span>
                  </span>
                  <span className="window-dots">
                    <span className="dot dot-r" />
                    <span className="dot dot-y" />
                    <span className="dot dot-g" />
                  </span>
                </div>
                <div className="profile-img-container">
                  <img
                    src="/pito-desri-pauzi.webp"
                    alt="Pito Desri Pauzi"
                    className="profile-img"
                  />
                  <div className="profile-scanlines" />
                  <div className="profile-scanner" />
                </div>
              </div>
            </ScrollReveal>

            {/* Fact Stats */}
            <div className="stats-grid">
              {data.facts.map((fact, i) => (
                <ScrollReveal key={fact.label} delay={i * 50}>
                  <div
                    className="card stat-card"
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 4,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      <StatCounter value={fact.value} />
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {fact.label}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Interactive Task Planner Card */}
            <ScrollReveal delay={250}>
              <TaskManager />
            </ScrollReveal>
          </div>
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        /* Profile Avatar Card Styling */
        .profile-card {
          border: 1px solid var(--border);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .profile-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 15px var(--accent-subtle);
        }
        .profile-top-bar {
          background: var(--bg-secondary);
          padding: 6px 12px;
          font-family: var(--font-mono);
          fontSize: 11px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
        }
        .window-dots {
          display: flex;
          gap: 4px;
        }
        .window-dots .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-r { background: #ef4444; }
        .dot-y { background: #eab308; }
        .dot-g { background: #22c55e; }
        
        .profile-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(40%) contrast(105%);
          transition: filter 0.3s ease, transform 0.5s ease;
        }
        .profile-card:hover .profile-img {
          filter: grayscale(0%) contrast(100%);
          transform: scale(1.02);
        }
        .profile-scanlines {
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 2;
        }
        .profile-scanner {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          animation: scan 4s linear infinite;
          pointer-events: none;
          z-index: 3;
          opacity: 0.7;
        }
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }

        .stat-card {
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: var(--text-secondary);
          transform: translateY(-2px);
        }

        /* Task Manager Styles */
        .task-manager-card {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .task-manager-card:hover {
          border-color: var(--accent) !important;
          border-style: solid !important;
        }
        .task-del-btn {
          transition: color 0.15s ease;
        }
        .task-del-btn:hover {
          color: var(--accent) !important;
        }
        .task-list-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .task-list-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--border);
          border-radius: 1.5px;
        }

        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .profile-img-container {
            aspect-ratio: 16/11;
          }
        }
      `}</style>
    </section>
  );
}
