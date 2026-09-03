"use client";

import { ExternalLink, GitBranch, Play, Star } from "lucide-react";
import { useState } from "react";
import ParticlesBackground from "./ParticlesBackground";
import ScrollReveal from "./ScrollReveal";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  gradient: string;
}

const getGradientStyle = (gradientStr: string) => {
  const g = gradientStr.toLowerCase();
  if (g.includes("red") || g.includes("orange")) {
    return {
      grad: "linear-gradient(135deg, #ef4444, #f97316)",
      accent: "#f97316",
      subtle: "rgba(249, 115, 22, 0.12)",
    };
  }
  if (g.includes("purple") || g.includes("pink")) {
    return {
      grad: "linear-gradient(135deg, #a855f7, #ec4899)",
      accent: "#ec4899",
      subtle: "rgba(236, 72, 153, 0.12)",
    };
  }
  if (g.includes("blue") || g.includes("cyan")) {
    return {
      grad: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      accent: "#06b6d4",
      subtle: "rgba(6, 182, 212, 0.12)",
    };
  }
  if (g.includes("green") || g.includes("teal")) {
    return {
      grad: "linear-gradient(135deg, #22c55e, #14b8a6)",
      accent: "#14b8a6",
      subtle: "rgba(20, 184, 166, 0.12)",
    };
  }
  return {
    grad: "linear-gradient(135deg, var(--accent), var(--accent))",
    accent: "var(--accent)",
    subtle: "var(--accent-subtle)",
  };
};

export default function ProjectsSection({ data }: { data: Project[] }) {
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const filtered = filter === "all" ? data : data.filter((p) => p.featured);

  return (
    <section
      id="projects"
      className="section-padding min-h-dvh"
      style={{ position: "relative" }}
    >
      <ParticlesBackground />
      <div className="section-container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <ScrollReveal direction="left">
              <div className="section-label">Projects</div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={100}>
              <h2 className="heading-lg" style={{ marginTop: 8 }}>
                Selected Work
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right">
            {/* Filter Tabs */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-secondary)",
                padding: "2px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
              }}
            >
              {(["all", "featured"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    background:
                      filter === f ? "var(--text-primary)" : "transparent",
                    color:
                      filter === f
                        ? "var(--bg-primary)"
                        : "var(--text-secondary)",
                    transition: "all var(--transition-fast)",
                    textTransform: "uppercase",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
          className="projects-grid"
        >
          {filtered.map((project, i) => {
            const gradData = getGradientStyle(project.gradient);
            return (
              <ScrollReveal key={project.id} delay={i * 50}>
                <div
                  className="card project-card"
                  style={
                    {
                      padding: "24px 20px 20px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 16,
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                      "--hover-accent": gradData.accent,
                      "--hover-shadow": gradData.subtle,
                    } as React.CSSProperties
                  }
                >
                  {/* Glowing Top Gradient Strip */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: gradData.grad,
                      opacity: 0.8,
                      transition: "height 0.2s ease",
                    }}
                    className="project-accent-bar"
                  />

                  <div>
                    {/* Title & Featured Badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 8,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {project.title}
                      </h3>

                      {project.featured && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 9,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          <Star size={9} fill="currentColor" />
                          FEATURED
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        marginBottom: 16,
                      }}
                    >
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                        marginBottom: 16,
                      }}
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 10,
                            fontWeight: 500,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-secondary)",
                            fontFamily: "var(--font-mono)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Minimalist links */}
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        borderTop: "1px solid var(--border)",
                        paddingTop: 12,
                        fontSize: 12,
                      }}
                    >
                      <button
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("run-project-demo", {
                              detail: {
                                projectId: project.id,
                                title: project.title,
                              },
                            }),
                          );
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          color: "var(--accent)",
                          textDecoration: "none",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          cursor: "pointer",
                          padding: 0,
                        }}
                        className="project-link"
                      >
                        <Play size={12} fill="currentColor" />
                        RUN
                      </button>
                      {project.liveUrl && project.liveUrl !== "#" && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            color: "var(--text-primary)",
                            textDecoration: "none",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                          }}
                          className="project-link"
                        >
                          <ExternalLink size={12} />
                          DEMO
                        </a>
                      )}
                      {project.githubUrl && project.githubUrl !== "#" && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            color: "var(--text-secondary)",
                            textDecoration: "none",
                            fontFamily: "var(--font-mono)",
                          }}
                          className="project-link"
                        >
                          <GitBranch size={12} />
                          CODE
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      <style>{`
        .project-card:hover {
          transform: translateY(-4px);
          border-color: var(--hover-accent) !important;
          box-shadow: 0 10px 25px var(--hover-shadow);
        }
        .project-card:hover .project-accent-bar {
          height: 6px;
        }
        
        .project-link {
          transition: color var(--transition-fast), transform 0.2s ease;
        }
        .project-link:hover {
          color: var(--text-primary) !important;
          transform: translateX(1.5px);
        }
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
