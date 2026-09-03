"use client";

import { AppWindow, Cpu, Layout } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface Service {
  id: number;
  title: string;
  description: string;
}

export default function ServicesSection({ data }: { data: Service[] }) {
  const icons = [
    <AppWindow size={24} className="service-icon" />,
    <Cpu size={24} className="service-icon" />,
    <Layout size={24} className="service-icon" />,
  ];

  return (
    <section
      id="services"
      className="section-padding"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="section-container">
        <ScrollReveal>
          <div className="section-label">Services</div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="heading-lg" style={{ marginBottom: 32 }}>
            What I Do
          </h2>
        </ScrollReveal>

        <div className="services-grid">
          {data.map((srv, idx) => (
            <ScrollReveal key={srv.id} delay={idx * 100}>
              <div className="service-card">
                <div className="service-icon-wrapper">
                  {icons[idx] || <Cpu size={24} className="service-icon" />}
                </div>
                <h3 className="service-title">{srv.title}</h3>
                <p className="service-desc">{srv.description}</p>
                <div className="service-card-decor">
                  <span>CMD_SYS.v1 // OK</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .service-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .service-card:hover {
          border-color: var(--accent);
          transform: translateY(-4px);
          box-shadow: 0 4px 20px var(--accent-subtle);
        }

        .service-icon-wrapper {
          color: var(--accent);
          background: var(--accent-subtle);
          width: 48px;
          height: 48px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(var(--accent-rgb), 0.2);
        }

        .service-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .service-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
          flex-grow: 1;
        }

        .service-card-decor {
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--text-muted);
          text-align: right;
          border-top: 1px dashed var(--border);
          padding-top: 10px;
          opacity: 0.6;
        }
      `}</style>
    </section>
  );
}
