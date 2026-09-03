"use client";

import { Cpu, Star } from "lucide-react";
import { useEffect, useState } from "react";
import ParticlesBackground from "./ParticlesBackground";

interface HeroData {
  greeting: string;
  name: string;
  titles: string[];
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  availableForWork: boolean;
}

interface Social {
  github: string;
  linkedin: string;
  instagram: string;
}

export default function HeroSection({
  data,
  social,
}: {
  data: HeroData;
  social: Social;
}) {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [uptime, setUptime] = useState({
    days: 184,
    hours: 12,
    mins: 35,
    secs: 0,
  });
  const [cpuUsage, setCpuUsage] = useState(21);
  const [memUsage, setMemUsage] = useState(48);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Typewriter effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const title = data.titles[currentTitleIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && currentText === title) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentTitleIndex((prev) => (prev + 1) % data.titles.length);
    } else {
      timer = setTimeout(() => {
        setCurrentText(
          isDeleting
            ? title.substring(0, currentText.length - 1)
            : title.substring(0, currentText.length + 1),
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentTitleIndex, data.titles]);

  // Live Stats effect
  useEffect(() => {
    const uptimeTimer = setInterval(() => {
      setUptime((prev) => {
        let s = prev.secs + 1;
        let m = prev.mins;
        let h = prev.hours;
        let d = prev.days;
        if (s >= 60) {
          s = 0;
          m += 1;
        }
        if (m >= 60) {
          m = 0;
          h += 1;
        }
        if (h >= 24) {
          h = 0;
          d += 1;
        }
        return { days: d, hours: h, mins: m, secs: s };
      });
    }, 1000);

    const metricsTimer = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(12, Math.min(42, prev + delta));
      });
      setMemUsage((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(46, Math.min(54, prev + delta));
      });
    }, 1800);

    return () => {
      clearInterval(uptimeTimer);
      clearInterval(metricsTimer);
    };
  }, []);

  return (
    <section
      id="home"
      className="hero-section grid-bg min-h-dvh!"
      style={{
        paddingTop: "calc(var(--nav-height) + 40px)",
        paddingBottom: "40px",
        borderBottom: "1px solid var(--border)",
        position: "relative",
      }}
    >
      <ParticlesBackground />
      <div className="section-container" style={{ width: "100%" }}>
        <div className="hero-grid">
          {/* Main Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="status-badge" style={{ marginBottom: 0 }}>
                {data.availableForWork && <span className="status-dot" />}
                <span>
                  {data.availableForWork
                    ? "Available for projects"
                    : "Unavailable"}
                </span>
              </div>
            </div>

            <h1
              className="heading-xl"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.04em",
                fontWeight: 800,
              }}
            >
              {data.name}
            </h1>

            {/* Typewriter Prompt */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                color: "var(--accent)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 24,
              }}
            >
              <span style={{ color: "var(--text-muted)", userSelect: "none" }}>
                $
              </span>
              <span>{currentText}</span>
              <span className="typewriter-cursor">█</span>
            </div>

            <p
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                maxWidth: 600,
                marginTop: 8,
              }}
            >
              {data.subtitle}
            </p>

            {/* Actions & Links */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <button
                className="btn-primary"
                onClick={() => scrollTo(data.ctaPrimary.href)}
              >
                {data.ctaPrimary.label}
              </button>

              <button
                className="btn-secondary"
                onClick={() => scrollTo(data.ctaSecondary.href)}
              >
                {data.ctaSecondary.label}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 24,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                connect:
              </span>
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                >
                  GitHub
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                >
                  LinkedIn
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>

          {/* Quick Technical Stats Board */}
          <div className="hero-stats-panel">
            <div
              className="card retro-crt-card"
              style={{ padding: 20, position: "relative", overflow: "hidden" }}
            >
              <div className="crt-scanlines" />
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 10,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 2,
                  position: "relative",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Cpu size={12} />
                  <span>SYSTEM STATUS & MONITOR</span>
                </span>
                <span className="live-pill">LIVE</span>
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                  zIndex: 2,
                  position: "relative",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "6px 0",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      HOST
                    </td>
                    <td
                      style={{
                        padding: "6px 0",
                        textAlign: "right",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      pitok.my.id
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "6px 0",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      LOCATION
                    </td>
                    <td
                      style={{
                        padding: "6px 0",
                        textAlign: "right",
                        fontWeight: 500,
                      }}
                    >
                      Padang, ID
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "6px 0",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      UPTIME
                    </td>
                    <td
                      style={{
                        padding: "6px 0",
                        textAlign: "right",
                        fontWeight: 500,
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {uptime.days}d {uptime.hours}h {uptime.mins}m{" "}
                      {uptime.secs}s
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "6px 0",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      CPU LOAD
                    </td>
                    <td
                      style={{
                        padding: "6px 0",
                        textAlign: "right",
                        fontWeight: 500,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 6,
                            background: "var(--border)",
                            borderRadius: 3,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              width: `${cpuUsage}%`,
                              height: "100%",
                              background: "var(--accent)",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            minWidth: 28,
                            display: "inline-block",
                            textAlign: "right",
                          }}
                        >
                          {cpuUsage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "6px 0",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      MEMORY
                    </td>
                    <td
                      style={{
                        padding: "6px 0",
                        textAlign: "right",
                        fontWeight: 500,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 6,
                            background: "var(--border)",
                            borderRadius: 3,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              width: `${memUsage}%`,
                              height: "100%",
                              background: "#3b82f6",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            minWidth: 28,
                            display: "inline-block",
                            textAlign: "right",
                          }}
                        >
                          {memUsage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "6px 0",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      STATUS
                    </td>
                    <td
                      style={{
                        padding: "6px 0",
                        textAlign: "right",
                        color: "#10b981",
                        fontWeight: 600,
                      }}
                    >
                      Active (bun)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .hero-social-link {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-secondary);
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1px;
          transition: all var(--transition-fast);
        }
        .hero-social-link:hover {
          color: var(--text-primary);
          border-color: var(--text-primary);
        }
        
        .typewriter-cursor {
          animation: blink 1s step-start infinite;
          color: var(--accent);
        }
        
        @keyframes blink {
          50% { opacity: 0; }
        }
        
        .retro-crt-card {
          border: 1px solid var(--border);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .retro-crt-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 15px var(--accent-subtle);
        }
        
        .crt-scanlines {
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .live-pill {
          font-size: 9px;
          background: var(--accent-subtle);
          color: var(--accent);
          padding: 2px 6px;
          border-radius: 2px;
          font-weight: 700;
          animation: pulse-glow 1.5s ease-in-out infinite alternate;
        }
        
        @keyframes pulse-glow {
          from { opacity: 0.6; box-shadow: 0 0 2px var(--accent); }
          to { opacity: 1; box-shadow: 0 0 8px var(--accent); }
        }

        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .hero-stats-panel {
            margin-top: 16px;
          }
        }
      `}</style>
    </section>
  );
}
