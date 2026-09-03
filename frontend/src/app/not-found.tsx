"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const BOOT_LINES = [
  "> kernel: process[404] terminated unexpectedly",
  "> fs: inode lookup failed — path not mounted",
  "> net: route 0.0.0.0/0 — destination unreachable",
  "> sys: dumping core... done (0 bytes)",
  "> ERR: page not found in virtual filesystem",
  "> HINT: run `cd /` to return to base directory",
];

export default function NotFound() {
  const [lines, setLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);
  const [doneTyping, setDoneTyping] = useState(false);

  // Print terminal lines one-by-one
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const currentLine = BOOT_LINES[i]; // capture before increment
        i++;
        setLines((prev) => [...prev, currentLine]);
      } else {
        clearInterval(interval);
        setDoneTyping(true);
      }
    }, 380);
    return () => clearInterval(interval);
  }, []);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="nf-root">
        {/* Grid background — reused from globals */}
        <div className="nf-grid-bg" aria-hidden />

        <div className="nf-container">
          {/* Glitch 404 */}
          <div className="nf-code" aria-label="404" data-text="404">
            404
          </div>

          {/* ASCII divider */}
          <div className="nf-divider" aria-hidden>
            {"─".repeat(36)}
          </div>

          {/* Terminal log */}
          <div className="nf-terminal" role="log" aria-live="polite">
            {lines.map((line, i) => (
              <div key={i} className="nf-line">
                <span className="nf-prompt">$</span>
                {line.replace(/^>/, "")}
              </div>
            ))}
            {/* Blinking cursor on last line */}
            <div className="nf-line nf-line--input">
              <span className="nf-prompt">$</span>
              <span className="nf-input-text">_</span>
              {cursor && <span className="nf-cursor">█</span>}
            </div>
          </div>

          {/* Status badge */}
          <div className="nf-status">
            <span className="nf-badge nf-badge--err">EXIT 1</span>
            <span className="nf-badge nf-badge--warn">HTTP 404</span>
            <span className="nf-badge nf-badge--ok">pitok.my.id</span>
          </div>

          {/* Actions */}
          {doneTyping && (
            <div className="nf-actions">
              <Link
                href="/"
                className="nf-btn nf-btn--primary"
                id="nf-home-btn"
              >
                <span className="nf-btn-arrow">←</span> cd /home
              </Link>
              <button
                className="nf-btn nf-btn--secondary"
                id="nf-back-btn"
                onClick={() => window.history.back()}
                type="button"
              >
                git stash pop
              </button>
            </div>
          )}

          {/* Tagline */}
          <p className="nf-tagline">
            Halaman yang kamu cari tidak ada di filesystem ini.
          </p>
        </div>
      </div>

      <style>{`
        /* ── Root layout ───────────────────────────────── */
        .nf-root {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-mono);
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        /* ── Subtle grid ───────────────────────────────── */
        .nf-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.35;
          pointer-events: none;
        }

        /* ── Container ─────────────────────────────────── */
        .nf-container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          max-width: 560px;
          width: 100%;
        }

        /* ── Giant glitch 404 ──────────────────────────── */
        .nf-code {
          font-size: clamp(88px, 18vw, 160px);
          font-weight: 900;
          line-height: 1;
          color: var(--accent);
          letter-spacing: -4px;
          position: relative;
          user-select: none;
          animation: nf-glitch 3.5s infinite;
        }
        .nf-code::before,
        .nf-code::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: var(--accent);
        }
        .nf-code::before {
          animation: nf-glitch-top 3.5s infinite;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
          transform: translate(-3px, 0);
          opacity: 0.7;
          color: #ff6b6b;
        }
        .nf-code::after {
          animation: nf-glitch-bottom 3.5s infinite;
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          transform: translate(3px, 0);
          opacity: 0.7;
          color: #6bfff2;
        }

        /* ── Divider ───────────────────────────────────── */
        .nf-divider {
          color: var(--border-strong);
          font-size: 12px;
          letter-spacing: 0;
          line-height: 1;
        }

        /* ── Terminal output ───────────────────────────── */
        .nf-terminal {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-left: 3px solid var(--accent);
          padding: 14px 16px;
          border-radius: var(--radius-sm);
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nf-line {
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.6;
          display: flex;
          gap: 8px;
          animation: nf-fadein 0.2s ease-out;
        }
        .nf-line--input {
          color: var(--text-primary);
          margin-top: 4px;
        }
        .nf-prompt {
          color: var(--accent);
          flex-shrink: 0;
          font-weight: 700;
        }
        .nf-input-text {
          opacity: 0;
        }
        .nf-cursor {
          color: var(--text-primary);
          animation: nf-blink 1s step-end infinite;
          margin-left: -2px;
        }

        /* ── Status badges ─────────────────────────────── */
        .nf-status {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .nf-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 2px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .nf-badge--err  { background: rgba(225,29,72,0.15); color: var(--accent); border: 1px solid var(--accent); }
        .nf-badge--warn { background: rgba(251,191,36,0.1);  color: #fbbf24;      border: 1px solid #fbbf24; }
        .nf-badge--ok   { background: rgba(34,197,94,0.1);   color: #22c55e;      border: 1px solid #22c55e; }

        /* ── Action buttons ────────────────────────────── */
        .nf-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          animation: nf-fadein 0.4s ease-out;
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }
        .nf-btn--primary {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .nf-btn--primary:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-accent);
        }
        .nf-btn--secondary {
          background: transparent;
          color: var(--text-secondary);
          border-color: var(--border-strong);
        }
        .nf-btn--secondary:hover {
          border-color: var(--accent);
          color: var(--text-primary);
          transform: translateY(-1px);
        }
        .nf-btn-arrow { font-size: 14px; }

        /* ── Tagline ───────────────────────────────────── */
        .nf-tagline {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.6;
          font-family: var(--font-mono);
          margin-top: -4px;
        }

        /* ── Keyframes ─────────────────────────────────── */
        @keyframes nf-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nf-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes nf-glitch {
          0%, 90%, 100% { transform: none; }
          91%  { transform: skewX(-1deg) translateX(2px); }
          93%  { transform: skewX(1deg)  translateX(-2px); }
          95%  { transform: skewX(-0.5deg); }
        }
        @keyframes nf-glitch-top {
          0%, 90%, 100% { transform: translate(-3px, 0); opacity: 0.7; }
          91%  { transform: translate(4px, -1px);  opacity: 1; }
          93%  { transform: translate(-4px, 1px);  opacity: 0.5; }
          95%  { transform: translate(2px, 0);     opacity: 0.9; }
        }
        @keyframes nf-glitch-bottom {
          0%, 90%, 100% { transform: translate(3px, 0);  opacity: 0.7; }
          91%  { transform: translate(-4px, 1px); opacity: 1; }
          93%  { transform: translate(4px, -1px); opacity: 0.5; }
          95%  { transform: translate(-2px, 0);   opacity: 0.9; }
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 480px) {
          .nf-container { gap: 16px; }
          .nf-terminal  { padding: 10px 12px; }
        }
      `}</style>
    </>
  );
}
