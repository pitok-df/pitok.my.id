"use client";

import { useEffect, useState } from "react";
import { playSound } from "@/data/audioManager";

export default function BiosBoot({ features }: { features?: any }) {
  const [show, setShow] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const biosEnabled = features?.biosBootEnabled !== false;
  const biosTitle =
    features?.biosTitle || "AMIBIOS (C) 1985 American Megatrends, Inc.";
  const bootLines = features?.biosLines || [
    "COMPANION OS v1.02 (C) 1985-2026 GE-MINI CORP",
    "CPU: AGENT CORE 8x CLK @ 3.40GHz",
    "MATH CO-PROCESSOR: INTEGRATED",
    "RAM TEST: 640KB BASE OK / 16384KB EXTENDED OK",
    "DETECTING SYSTEM MASCOTS...",
    "  NEKO UNIT: PRIMARY DEVICE AT ADDR 0x3F8 ... OK",
    "  ROBO UNIT: SECONDARY DEVICE AT ADDR 0x278 ... OK",
    "MOUNTING SHELL MODULES...",
    "  system_console.sh ... MOUNTED",
    "  libaudio_synth_core.so ... ACTIVE",
    "  crt_phosphor_grid.ko ... INSTALLED",
    "  FLOPPY_DRIVE_CONTROLLER ... VERIFIED",
    "ESTABLISHING SECURE PROTOCOLS ... LEVEL 1 SAFE",
    "BOOTING OS...",
  ];

  useEffect(() => {
    // Only boot if enabled and only once per browser session
    if (!biosEnabled || sessionStorage.getItem("biosBooted") === "true") {
      document.documentElement.classList.remove("bios-booting");
      return;
    }

    setShow(true);
    document.body.style.overflow = "hidden";

    // Play startup click beep
    playSound(400, 0.05, "triangle");

    // Dynamically calculate speed based on target duration (defaults to 4.5 seconds)
    const totalDurationMs = (features?.biosBootDuration || 4.5) * 1000;
    // Split duration: 70% for scrolling lines, 30% for progress bar
    const scrollDurationMs = totalDurationMs * 0.7;
    const printInterval = Math.max(
      40,
      Math.min(250, Math.floor(scrollDurationMs / (bootLines.length || 1))),
    );

    const progressDurationMs = totalDurationMs * 0.3;
    const progressIntervalMs = Math.max(
      30,
      Math.min(150, Math.floor(progressDurationMs / 12)),
    );

    let currentLineIdx = 0;
    let progressInterval: NodeJS.Timeout | null = null;

    const lineInterval = setInterval(() => {
      if (currentLineIdx < bootLines.length) {
        setLines((prev) => [...prev, bootLines[currentLineIdx]]);

        // Play disk read noise
        const freq = 100 + Math.random() * 200;
        playSound(freq, 0.03, "sawtooth");

        currentLineIdx++;
      } else {
        clearInterval(lineInterval);

        // Start loading bar progress
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev < 100) {
              const next = prev + 5 + Math.floor(Math.random() * 10);
              return Math.min(next, 100);
            } else {
              if (progressInterval) clearInterval(progressInterval);

              // End boot-up sequence
              setTimeout(() => {
                setShow(false);
                document.body.style.overflow = "";
                sessionStorage.setItem("biosBooted", "true");
                sessionStorage.setItem(
                  "biosBootFinishedTime",
                  String(Date.now()),
                );
                document.documentElement.classList.remove("bios-booting");

                // Play final cheerful 8-bit startup chime
                playSound(523.25, 0.1, "sine");
                setTimeout(() => playSound(659.25, 0.1, "sine"), 80);
                setTimeout(() => playSound(783.99, 0.1, "sine"), 160);
                setTimeout(() => playSound(1046.5, 0.2, "sine"), 240);
              }, 400);
              return 100;
            }
          });
        }, progressIntervalMs);
      }
    }, printInterval);

    return () => {
      clearInterval(lineInterval);
      if (progressInterval) clearInterval(progressInterval);
      document.body.style.overflow = "";
      document.documentElement.classList.remove("bios-booting");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show) return null;

  return (
    <div className="bios-boot-overlay">
      <div className="bios-boot-content">
        <div className="bios-header-info">
          <span>{biosTitle}</span>
          <span>COMPANION OS V1.02</span>
        </div>
        <div className="bios-log-lines">
          {lines.map((line, idx) => (
            <div key={idx} className="bios-line">
              {line}
            </div>
          ))}
        </div>
        {lines.length >= bootLines.length && (
          <div className="bios-progress-section">
            <span className="bios-progress-label">
              INITIALIZING SYSTEM SHELL:
            </span>
            <div className="bios-progress-bar-container">
              <div
                className="bios-progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="bios-progress-percent">{progress}%</span>
          </div>
        )}
      </div>
      <style>{`
        .bios-boot-overlay {
          position: fixed;
          inset: 0;
          background: #000000;
          color: #00ff00;
          font-family: var(--font-mono);
          font-size: 13px;
          z-index: 999999999;
          padding: 30px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .bios-boot-content {
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }
        .bios-header-info {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed #00ff00;
          padding-bottom: 8px;
          font-weight: bold;
          font-size: 11px;
        }
        .bios-log-lines {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }
        .bios-line {
          white-space: pre-wrap;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }
        .bios-progress-section {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: bold;
        }
        .bios-progress-label {
          font-size: 11px;
        }
        .bios-progress-bar-container {
          flex-grow: 1;
          height: 14px;
          border: 1px solid #00ff00;
          padding: 2px;
          max-width: 300px;
        }
        .bios-progress-bar-fill {
          height: 100%;
          background: #00ff00;
          transition: width 0.05s linear;
        }
        .bios-progress-percent {
          min-width: 40px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
