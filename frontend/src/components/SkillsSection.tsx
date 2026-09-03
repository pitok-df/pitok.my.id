"use client";

import {
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  type LucideIcon,
  Palette,
  Rocket,
  Server,
  Shield,
  Terminal,
} from "lucide-react";
import ParticlesBackground from "./ParticlesBackground";
import ScrollReveal from "./ScrollReveal";

interface SkillCategory {
  name: string;
  icon: string;
  items: string[];
}

interface SkillsData {
  categories: SkillCategory[];
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  frontend: Palette,
  backend: Server,
  database: Database,
  "devops & tools": Rocket,
  devops: Rocket,
  tools: Terminal,
  styling: Palette,
  framework: Layers,
  language: Globe,
  orm: GitBranch,
  security: Shield,
  mobile: Cpu,
};

function GetSkillIcon({
  category,
  size = 12,
}: {
  category: string;
  size?: number;
}) {
  const key = category.toLowerCase();
  const Icon = CATEGORY_ICONS[key] ?? Layers;
  return (
    <Icon size={size} strokeWidth={2} style={{ color: "var(--accent)" }} />
  );
}

export default function SkillsSection({ data }: { data: SkillsData }) {
  // Pre-process categories to construct two distinct rows for the marquee tracks
  // Row 1: Frontend (0) & Database (2)
  const row1Items = [
    ...(data.categories[0]?.items.map((item) => ({
      name: item,
      category: data.categories[0].name,
    })) || []),
    ...(data.categories[2]?.items.map((item) => ({
      name: item,
      category: data.categories[2].name,
    })) || []),
  ];

  // Row 2: Backend (1) & DevOps/Tools (3)
  const row2Items = [
    ...(data.categories[1]?.items.map((item) => ({
      name: item,
      category: data.categories[1].name,
    })) || []),
    ...(data.categories[3]?.items.map((item) => ({
      name: item,
      category: data.categories[3].name,
    })) || []),
  ];

  // Duplicate arrays for seamless infinite looping
  const track1 = [...row1Items, ...row1Items, ...row1Items];
  const track2 = [...row2Items, ...row2Items, ...row2Items];

  return (
    <section
      id="skills"
      className="section-padding"
      style={{
        position: "relative",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <ParticlesBackground />
      <div className="section-container">
        <div className="skills-layout">
          {/* Left Column: Heading */}
          <div
            style={{
              position: "sticky",
              top: "calc(var(--nav-height) + 24px)",
            }}
            className="skills-sticky-header"
          >
            <ScrollReveal direction="left">
              <div className="section-label">Skills & Stack</div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={100}>
              <h2 className="heading-lg" style={{ marginBottom: 12 }}>
                Technologies & Tools
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={150}>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: 320,
                }}
              >
                A modern stack focused on performance, clean structure, and
                scalable architectures. Hover over marquee streams to freeze
                motion.
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Moving Marquees */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              justifyContent: "center",
            }}
            className="skills-marquee-container"
          >
            {/* Track 1: Scroll Left */}
            <ScrollReveal direction="right">
              <div className="skills-marquee-wrapper scroll-left">
                <div className="skills-marquee-track stream-forward">
                  {track1.map((item, idx) => (
                    <div
                      key={`t1-${item.name}-${idx}`}
                      className="skills-marquee-item"
                    >
                      <GetSkillIcon category={item.category} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Track 2: Scroll Right (Reverse) */}
            <ScrollReveal direction="right" delay={100}>
              <div className="skills-marquee-wrapper scroll-right">
                <div className="skills-marquee-track stream-reverse">
                  {track2.map((item, idx) => (
                    <div
                      key={`t2-${item.name}-${idx}`}
                      className="skills-marquee-item"
                    >
                      <GetSkillIcon category={item.category} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <style>{`
        .skills-layout {
          display: grid;
          grid-template-columns: 1.1fr 1.6fr;
          gap: 64px;
          align-items: center;
        }
        
        .skills-marquee-container {
          overflow: hidden;
          width: 100%;
        }

        /* Marquee Wrapper with soft edge fading masks */
        .skills-marquee-wrapper {
          overflow: hidden;
          width: 100%;
          white-space: nowrap;
          padding: 8px 0;
          display: flex;
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          /* Soft gradient overlay on edges */
          mask-image: linear-gradient(to right, transparent, white 12%, white 88%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 12%, white 88%, transparent);
        }

        .skills-marquee-track {
          display: inline-flex;
          gap: 12px;
          padding: 0 6px;
        }

        /* Forward Stream (Left scrolling) */
        .stream-forward {
          animation: marquee-left 35s linear infinite;
        }

        /* Reverse Stream (Right scrolling) */
        .stream-reverse {
          animation: marquee-right 35s linear infinite;
        }

        /* Pause marquee movement on hover */
        .skills-marquee-wrapper:hover .skills-marquee-track {
          animation-play-state: paused;
        }

        /* Individual Marquee Tech Tags */
        .skills-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          cursor: default;
        }

        .skills-marquee-item:hover {
          border-color: var(--accent);
          color: var(--text-primary);
          background: var(--accent-subtle);
          transform: translateY(-1.5px);
          box-shadow: 0 2px 8px var(--accent-subtle);
        }

        /* Keyframes */
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        @keyframes marquee-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }

        @media (max-width: 768px) {
          .skills-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .skills-sticky-header {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
