"use client";

import { Code, HardDrive, Laptop, Terminal } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface Setup {
  os: string;
  editor: string;
  terminal: string;
  hardware: string;
}

export default function SetupSection({ data }: { data: Setup }) {
  return (
    <section
      id="setup"
      className="section-padding"
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="section-container">
        <ScrollReveal>
          <div className="section-label">Workspace</div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="heading-lg" style={{ marginBottom: 32 }}>
            My Setup & Tools
          </h2>
        </ScrollReveal>

        <div className="setup-specs-grid">
          {/* OS */}
          <ScrollReveal delay={100}>
            <div className="setup-spec-card">
              <HardDrive size={18} className="setup-icon" />
              <div className="setup-info">
                <span className="setup-label-text">Operating System</span>
                <span className="setup-value-text">{data.os}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Editor */}
          <ScrollReveal delay={150}>
            <div className="setup-spec-card">
              <Code size={18} className="setup-icon" />
              <div className="setup-info">
                <span className="setup-label-text">Code Editor</span>
                <span className="setup-value-text">{data.editor}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Terminal */}
          <ScrollReveal delay={200}>
            <div className="setup-spec-card">
              <Terminal size={18} className="setup-icon" />
              <div className="setup-info">
                <span className="setup-label-text">Shell & Terminal</span>
                <span className="setup-value-text">{data.terminal}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Hardware */}
          <ScrollReveal delay={250}>
            <div className="setup-spec-card">
              <Laptop size={18} className="setup-icon" />
              <div className="setup-info">
                <span className="setup-label-text">Hardware Specs</span>
                <span className="setup-value-text">{data.hardware}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        .setup-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .setup-spec-card {
          background: var(--bg-primary);
          border: 1px dashed var(--border);
          border-radius: var(--radius-sm);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all var(--transition-fast);
        }

        .setup-spec-card:hover {
          border-style: solid;
          border-color: var(--accent);
          box-shadow: 0 0 10px var(--accent-subtle);
        }

        .setup-icon {
          color: var(--accent);
          flex-shrink: 0;
        }

        .setup-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .setup-label-text {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .setup-value-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
    </section>
  );
}
