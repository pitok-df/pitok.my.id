"use client";

import { Award, Briefcase, GraduationCap } from "lucide-react";
import { useState } from "react";
import ParticlesBackground from "./ParticlesBackground";
import ScrollReveal from "./ScrollReveal";

interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  current: boolean;
}

interface Education {
  id: number;
  degree: string;
  school: string;
  period: string;
  description: string;
}

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
}

export default function ExperienceSection({
  experience,
  education,
  certifications,
}: {
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}) {
  const [activeTab, setActiveTab] = useState<"work" | "education">("work");

  return (
    <section
      id="experience"
      className="section-padding"
      style={{
        position: "relative",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <ParticlesBackground />
      <div className="section-container">
        <div className="experience-layout">
          {/* Left Column: Heading */}
          <div
            style={{
              position: "sticky",
              top: "calc(var(--nav-height) + 24px)",
            }}
            className="experience-sticky-header"
          >
            <ScrollReveal direction="left">
              <div className="section-label">Timeline</div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={100}>
              <h2 className="heading-lg" style={{ marginBottom: 16 }}>
                History & Credentials
              </h2>
            </ScrollReveal>

            {/* Retro Tabs Switch */}
            <ScrollReveal direction="left" delay={150}>
              <div className="history-tabs-container">
                <button
                  className={`history-tab-btn ${activeTab === "work" ? "active" : ""}`}
                  onClick={() => setActiveTab("work")}
                >
                  <Briefcase size={12} />
                  <span>[ WORK_EXPERIENCE ]</span>
                </button>
                <button
                  className={`history-tab-btn ${activeTab === "education" ? "active" : ""}`}
                  onClick={() => setActiveTab("education")}
                >
                  <GraduationCap size={12} />
                  <span>[ EDUCATION_&_CERTS ]</span>
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Timeline Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              position: "relative",
            }}
            className="timeline-container"
          >
            {activeTab === "work" ? (
              <>
                <div className="timeline-line" />
                {experience.map((exp, i) => (
                  <ScrollReveal key={exp.id} delay={i * 50}>
                    <div className="experience-row">
                      <div className="experience-date-col">
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: exp.current
                              ? "var(--text-primary)"
                              : "var(--text-muted)",
                          }}
                        >
                          {exp.period}
                        </span>
                      </div>

                      <div className="timeline-dot-wrapper">
                        <div
                          className={`timeline-dot ${exp.current ? "current" : ""}`}
                        />
                      </div>

                      <div className="experience-details-col">
                        <h3
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {exp.role}
                        </h3>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginTop: 2,
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          @{exp.company}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                            lineHeight: 1.6,
                            marginTop: 8,
                          }}
                        >
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 40 }}
              >
                {/* Education Section */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  <h3 className="section-sub-heading">Academic Path</h3>
                  {education.map((edu) => (
                    <ScrollReveal key={edu.id}>
                      <div className="education-card">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 8,
                            marginBottom: 6,
                          }}
                        >
                          <h4
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "var(--text-primary)",
                            }}
                          >
                            {edu.degree}
                          </h4>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 11,
                              color: "var(--accent)",
                            }}
                          >
                            {edu.period}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-secondary)",
                            marginBottom: 8,
                          }}
                        >
                          {edu.school}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            lineHeight: 1.5,
                          }}
                        >
                          {edu.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Certifications Section */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <h3 className="section-sub-heading">Certifications</h3>
                  <div className="certs-list">
                    {certifications.map((cert, i) => (
                      <ScrollReveal key={cert.id} delay={i * 50}>
                        <div className="cert-item">
                          <Award
                            size={14}
                            style={{ color: "var(--accent)", flexShrink: 0 }}
                          />
                          <div className="cert-info">
                            <span className="cert-title">{cert.title}</span>
                            <span className="cert-issuer">
                              {cert.issuer} ({cert.date})
                            </span>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .experience-layout {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 64px;
        }

        .history-tabs-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 24px;
          max-width: 260px;
        }

        .history-tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px dashed var(--border);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: var(--radius-sm);
          text-align: left;
          transition: all var(--transition-fast);
        }

        .history-tab-btn:hover {
          background: var(--accent-subtle);
          border-color: var(--accent);
          color: var(--accent);
        }

        .history-tab-btn.active {
          background: var(--accent-subtle);
          border-style: solid;
          border-color: var(--accent);
          color: var(--accent);
          font-weight: 700;
          box-shadow: 0 0 10px var(--accent-subtle);
        }
        
        .timeline-container {
          position: relative;
        }
        
        .timeline-line {
          position: absolute;
          top: 6px;
          bottom: 24px;
          left: 155px;
          width: 1px;
          border-left: 1px dashed var(--border);
          pointer-events: none;
          z-index: 1;
        }
        
        .experience-row {
          display: grid;
          grid-template-columns: 140px 30px 1fr;
          gap: 0;
          border-bottom: 1px dashed var(--border);
          padding-bottom: 24px;
        }
        
        .experience-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .experience-date-col {
          text-align: right;
          padding-right: 16px;
          padding-top: 2px;
        }
        
        .timeline-dot-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 6px;
        }
        
        .timeline-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
          z-index: 2;
        }
        
        .timeline-dot.current {
          background: #10b981;
          border-color: #10b981;
          box-shadow: 0 0 8px #10b981;
        }
        
        .experience-row:hover .timeline-dot:not(.current) {
          border-color: var(--accent);
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
        }

        .experience-details-col {
          padding-left: 16px;
        }

        .section-sub-heading {
          font-size: 13px;
          font-family: var(--font-mono);
          text-transform: uppercase;
          color: var(--accent);
          letter-spacing: 0.05em;
          border-left: 3px solid var(--accent);
          padding-left: 8px;
        }

        .education-card {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 18px;
          transition: all var(--transition-fast);
        }

        .education-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 8px var(--accent-subtle);
        }

        .certs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cert-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--bg-primary);
          border: 1px dashed var(--border);
          padding: 12px;
          border-radius: var(--radius-sm);
        }

        .cert-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cert-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cert-issuer {
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        @media (max-width: 768px) {
          .experience-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .experience-sticky-header {
            position: relative !important;
            top: 0 !important;
          }
          .history-tabs-container {
            flex-direction: row;
            flex-wrap: wrap;
            max-width: 100%;
          }
          .timeline-line {
            display: none;
          }
          .experience-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding-bottom: 20px;
          }
          .timeline-dot-wrapper {
            display: none;
          }
          .experience-date-col {
            text-align: left;
            padding-right: 0;
            margin-bottom: 4px;
          }
          .experience-details-col {
            padding-left: 0;
          }
        }
      `}</style>
    </section>
  );
}
