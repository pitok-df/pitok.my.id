"use client";

import {
  AlertTriangle,
  Bug,
  RefreshCw,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAudio, playSound } from "@/data/audioManager";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const Github = ({ size, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function CustomContextMenu({ features }: { features?: any }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const triggerWarning = useCallback(() => {
    if (typeof window === "undefined") return;

    // Prevent showing warning during BIOS boot and enforce a 1-second post-boot cooldown
    const isBiosBooting =
      document.documentElement.classList.contains("bios-booting") ||
      sessionStorage.getItem("biosBooted") !== "true";
    if (isBiosBooting) return;

    const bootTime = sessionStorage.getItem("biosBootFinishedTime");
    if (bootTime) {
      const elapsed = Date.now() - parseInt(bootTime, 10);
      if (elapsed < 1000) return; // 1-second cooldown
    }

    const warningEnabled = features?.devConsoleWarningEnabled !== false;
    if (!warningEnabled) return;

    if (sessionStorage.getItem("inspectWarningShown")) return;
    sessionStorage.setItem("inspectWarningShown", "true");
    setShowWarning(true);

    // Play retro warning alarm sound
    playSound(600, 0.15, "sawtooth");
    setTimeout(() => playSound(300, 0.15, "sawtooth"), 150);
    setTimeout(() => playSound(600, 0.15, "sawtooth"), 300);
    setTimeout(() => playSound(300, 0.15, "sawtooth"), 450);

    // Trigger screen glitch class if enabled in admin panel features
    const glitchEnabled = features?.glitchEffectEnabled !== false;
    if (glitchEnabled) {
      document.body.classList.add("screen-glitch");
      setTimeout(() => {
        document.body.classList.remove("screen-glitch");
      }, 1500);
    }

    // Print developer warning to browser console again to grab attention
    const wTitle =
      features?.devConsoleWarningTitle || "⚠️ ATTENTION / PERINGATAN ⚠️";
    const wText =
      features?.devConsoleWarningText ||
      "Developer tools and console inspection has been detected.";
    console.log(
      `%c%c  ${wTitle}  %c`,
      "background: #e11d48; padding: 5px 0;",
      "color: #ffffff; background: #be123c; font-weight: 800; font-size: 20px; padding: 5px 20px; font-family: monospace; border-radius: 4px; border: 2px solid #ffffff; text-shadow: 0 0 10px #ff0000;",
      "background: #e11d48; padding: 5px 0;",
    );
    console.log(
      `%cWARNING: ${wText}`,
      "color: #ff3333; font-weight: 900; font-size: 14px; font-family: monospace; text-transform: uppercase;",
    );
  }, [features]);

  useEffect(() => {
    // Print initial developer warning to browser console
    console.log(
      "%c%c  WARNING! / PERINGATAN!  %c",
      "background: #e11d48; padding: 5px 0;",
      "color: #ffffff; background: #be123c; font-weight: 800; font-size: 22px; padding: 5px 15px; font-family: monospace; border-radius: 4px; border: 1px solid #ffffff;",
      "background: #e11d48; padding: 5px 0;",
    );
    console.log(
      "%cMembuka Developer Tools? Hati-hati terhadap serangan penipuan Self-XSS! Jangan menempelkan kode apa pun di sini jika diminta oleh orang lain.",
      "color: #ef4444; font-weight: bold; font-size: 14px; font-family: sans-serif; margin-top: 10px; display: block;",
    );
    console.log(
      "%cLooking for secrets or hiring? %cCheck out the interactive console widget in the bottom-left of the webpage (type 'help' there), or inspect the project source code on GitHub: %chttps://github.com/PitokDf",
      "color: #10b981; font-weight: bold; font-size: 12px; font-family: sans-serif;",
      "color: #888888; font-size: 12px; font-family: sans-serif;",
      "color: #3b82f6; text-decoration: underline; font-size: 12px; font-family: sans-serif;",
    );

    // Sync sound setting on load
    setSoundEnabled(localStorage.getItem("soundEnabled") === "true");

    const handleContextMenu = (e: MouseEvent) => {
      const contextMenuEnabled = features?.contextMenuEnabled !== false;
      if (!contextMenuEnabled) return;

      // Disable custom right-click on mobile devices for better native UX
      if (window.innerWidth <= 768) return;

      e.preventDefault();
      setVisible(true);

      const menuWidth = 200;
      const menuHeight = 220;
      let x = e.clientX;
      let y = e.clientY;

      // Avoid overflowing screen boundaries
      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 8;
      }
      if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 8;
      }

      setPosition({ x, y });

      // Play a short synth chime on right-click if glitch sounds/effects enabled
      const glitchEnabled = features?.glitchEffectEnabled !== false;
      if (glitchEnabled) {
        playSound(700, 0.05, "triangle");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
      }

      // Ignore warning check if user is typing in form fields or editable areas
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.hasAttribute("contenteditable"))
      ) {
        return;
      }

      if (!e.isTrusted) return;

      // Key shortcut detection for Developer Tools / inspect elements
      const isF12 = e.key === "F12";
      const isInspectShortcut =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "I" ||
          e.key === "i" ||
          e.key === "J" ||
          e.key === "j" ||
          e.key === "C" ||
          e.key === "c");
      const isViewSource =
        (e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u");

      if (isF12 || isInspectShortcut || isViewSource) {
        console.warn("[Security] DevTools shortcut detected:", {
          key: e.key,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
        });
        triggerWarning();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [triggerWarning]);

  const triggerAction = (action: () => void) => {
    playSound(900, 0.04, "sine");
    action();
    setVisible(false);
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    localStorage.setItem("soundEnabled", String(nextState));

    // Dispatch a storage event or customize window event to notify Navbar
    window.dispatchEvent(new Event("storage"));

    // Hard refresh state on Navbar through window notification
    window.dispatchEvent(
      new CustomEvent("sound-state-changed", {
        detail: { enabled: nextState },
      }),
    );

    if (nextState) {
      // Play ascending startup chime
      playSound(523.25, 0.1, "sine");
      setTimeout(() => playSound(659.25, 0.12, "sine"), 80);
      setTimeout(() => playSound(783.99, 0.18, "sine"), 160);
    }
  };

  const handleOpenTerminal = () => {
    // Dispatch event to open console
    window.dispatchEvent(
      new CustomEvent("run-project-demo", {
        detail: { projectId: 0, title: "Diagnostic Suite" },
      }),
    );
  };

  const handlePetMascot = () => {
    const targets = ["neko", "robo"];
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    window.dispatchEvent(
      new CustomEvent("mascot-action", {
        detail: { action: "pet", target: randomTarget },
      }),
    );
  };

  const handleGlitchTest = () => {
    // Play the old sweeping sound using the unified context (routes through oscilloscope!)
    try {
      const { context, analyser } = getAudio();
      if (context && analyser) {
        const duration = 1.0;
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(600, context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          80,
          context.currentTime + duration,
        );

        // Respect the sound settings volume (0.7) and enable status
        const isEnabled = localStorage.getItem("soundEnabled") === "true";
        gain.gain.setValueAtTime(isEnabled ? 0.7 : 0, context.currentTime);
        gain.gain.linearRampToValueAtTime(
          0.0001,
          context.currentTime + duration,
        );

        osc.connect(gain);
        gain.connect(analyser); // Connected to the analyser for real-time visualization

        osc.start();
        osc.stop(context.currentTime + duration);
      }
    } catch (err) {
      console.error("Glitch sound error:", err);
    }

    // Add screen glitch classes
    document.body.classList.add("screen-glitch");
    setTimeout(() => {
      document.body.classList.remove("screen-glitch");
    }, 1500);
  };

  const handleResetTheme = () => {
    // Reset to main branch theme
    window.dispatchEvent(new CustomEvent("reset-branch-theme"));
  };

  return (
    <>
      {visible && (
        <div
          ref={menuRef}
          className="custom-context-menu"
          style={{
            top: position.y,
            left: position.x,
          }}
        >
          <div className="context-menu-header">
            <span>UTILITIES_SHELL.v1</span>
          </div>

          <button
            className="context-menu-item"
            onClick={() => triggerAction(handleOpenTerminal)}
          >
            <Terminal size={11} className="menu-icon" />
            <span>Run Diagnostic</span>
          </button>

          <button
            className="context-menu-item"
            onClick={() => triggerAction(handleToggleSound)}
          >
            {soundEnabled ? (
              <Volume2 size={11} className="menu-icon" />
            ) : (
              <VolumeX size={11} className="menu-icon" />
            )}
            <span>{soundEnabled ? "Disable Sounds" : "Enable Sounds"}</span>
          </button>

          <button
            className="context-menu-item"
            onClick={() => triggerAction(handlePetMascot)}
          >
            <Sparkles size={11} className="menu-icon" />
            <span>Pet Random Mascot</span>
          </button>

          <button
            className="context-menu-item"
            onClick={() => triggerAction(handleGlitchTest)}
          >
            <Bug size={11} className="menu-icon animate-pulse" />
            <span>Glitch Screen Test</span>
          </button>

          <button
            className="context-menu-item"
            onClick={() => triggerAction(handleResetTheme)}
          >
            <RefreshCw size={11} className="menu-icon" />
            <span>Reset Branch Theme</span>
          </button>

          <div className="context-menu-divider" />

          <a
            href="https://github.com/PitokDf"
            target="_blank"
            rel="noopener noreferrer"
            className="context-menu-item select-none"
            onClick={() => setVisible(false)}
            style={{ textDecoration: "none" }}
          >
            <Github size={11} className="menu-icon" />
            <span>Github Profile</span>
          </a>
        </div>
      )}

      {showWarning && (
        <div className="warning-modal-overlay">
          <div className="warning-modal">
            <div className="warning-header">
              <AlertTriangle size={14} className="warning-icon" />
              <span>[ SECURITY WARNING: CONSOLE ACCESS ]</span>
            </div>
            <div className="warning-body">
              <p className="warning-title">
                {features?.devConsoleWarningTitle ||
                  "⚠️ ATTENTION / PERINGATAN ⚠️"}
              </p>
              <p className="warning-text">
                {features?.devConsoleWarningText ||
                  "Developer tools and console inspection has been detected. Be careful with Self-XSS attacks! Do not copy-paste any command or script here."}
              </p>
              <div className="warning-code-box">
                <code>SYSTEM_STATUS: INSPECTOR_DETECTION_TRUE</code>
                <code>PROTECTION_MODULE: ARMED_AND_ACTIVE</code>
              </div>
            </div>
            <div className="warning-footer">
              <button
                className="warning-btn"
                onClick={() => setShowWarning(false)}
              >
                [ PROCEED WITH CAUTION ]
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-context-menu {
          position: fixed;
          z-index: 99999999;
          width: 190px;
          background: var(--bg-card);
          border: 1px solid var(--accent);
          box-shadow: 0 0 15px var(--accent-subtle);
          border-radius: var(--radius-sm);
          padding: 6px 4px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-primary);
          overflow: hidden;
          backdrop-filter: blur(8px);
          animation: context-reveal 0.12s ease-out;
        }

        .context-menu-header {
          font-size: 9px;
          color: var(--text-muted);
          padding: 4px 8px 6px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .context-menu-divider {
          height: 1px;
          background: var(--border);
          margin: 4px 0;
        }

        .context-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 6px 10px;
          background: transparent;
          border: none;
          color: var(--text-secondary) !important;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 11px;
          transition: all var(--transition-fast);
          border-radius: 2px;
          outline: none;
        }

        .context-menu-item:hover {
          background: var(--accent-subtle) !important;
          color: var(--accent) !important;
          padding-left: 12px;
        }

        .menu-icon {
          flex-shrink: 0;
          color: var(--accent);
        }

        @keyframes context-reveal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        /* ===== WARNING MODAL STYLES ===== */
        .warning-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          z-index: 9999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: warning-fade-in 0.25s ease-out;
        }

        .warning-modal {
          width: 100%;
          max-width: 500px;
          background: var(--bg-card);
          border: 2px solid #ef4444;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          color: var(--text-primary);
          overflow: hidden;
          animation: warning-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .warning-header {
          background: #ef4444;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .warning-icon {
          animation: warning-pulse 1s infinite alternate;
        }

        .warning-body {
          padding: 20px;
          font-size: 12px;
          line-height: 1.6;
        }

        .warning-title {
          font-size: 14px;
          font-weight: 700;
          color: #ef4444;
          margin-bottom: 12px;
          text-align: center;
          letter-spacing: 0.05em;
        }

        .warning-text {
          margin-bottom: 12px;
        }

        .warning-text-id {
          margin-bottom: 16px;
          font-style: italic;
          color: var(--text-secondary);
          opacity: 0.85;
          border-left: 2px solid #ef4444;
          padding-left: 8px;
        }

        .warning-code-box {
          background: var(--bg-secondary);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 10px;
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 8px;
        }

        .warning-code-box code {
          font-size: 10px;
          color: #ef4444;
        }

        .warning-footer {
          display: flex;
          justify-content: flex-end;
          padding: 12px 20px 20px;
          background: rgba(0, 0, 0, 0.05);
          border-top: 1px solid rgba(239, 68, 68, 0.1);
        }

        .warning-btn {
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 6px 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          cursor: pointer;
          transition: all var(--transition-fast);
          outline: none;
        }

        .warning-btn:hover {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }

        @keyframes warning-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes warning-slide-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes warning-pulse {
          from { opacity: 0.6; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}
