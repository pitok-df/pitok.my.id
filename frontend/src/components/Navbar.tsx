"use client";

import { GitBranch, Monitor, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getAudio, playSound } from "@/data/audioManager";

function AudioOscilloscope({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { analyser } = getAudio();
    if (!analyser) return;

    let animId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.5;

      const accentColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim() || "#ff2d55";

      ctx.strokeStyle = accentColor;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={40}
      height={18}
      style={{
        width: 40,
        height: 18,
        display: active ? "block" : "none",
        opacity: 0.85,
        pointerEvents: "none",
      }}
    />
  );
}

export default function Navbar({ features }: { features?: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [activeBranch, setActiveBranch] = useState("main");
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [unlockedBranches, setUnlockedBranches] = useState<string[]>([
    "main",
    "hacker",
    "cyberpunk",
    "mono",
  ]);

  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "gallery", label: "Gallery" },
    { id: "experience", label: "Experience" },
    { id: "guestbook", label: "Guestbook" },
    { id: "contact", label: "Contact" },
  ];

  const playBleep = (
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
  ) => {
    playSound(freq, duration, type);
  };

  const toggleCrt = () => {
    const nextState = !crtEnabled;
    setCrtEnabled(nextState);
    localStorage.setItem("crtEnabled", String(nextState));
    if (nextState) {
      document.body.classList.add("crt-active");
      playBleep(800, 0.05, "sine");
      setTimeout(() => playBleep(1200, 0.05, "sine"), 50);
    } else {
      document.body.classList.remove("crt-active");
      playBleep(1200, 0.05, "sine");
      setTimeout(() => playBleep(800, 0.05, "sine"), 50);
    }
  };

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    // Load sound settings from localStorage safely
    const storedSound = localStorage.getItem("soundEnabled");
    if (storedSound === "true") {
      setSoundEnabled(true);
    }

    // Load CRT settings from localStorage or fallback to admin configured default
    const storedCrt = localStorage.getItem("crtEnabled");
    const defaultCrt = features?.crtEnabled !== false;
    const shouldEnableCrt =
      storedCrt !== null ? storedCrt === "true" : defaultCrt;

    if (shouldEnableCrt) {
      setCrtEnabled(true);
      document.body.classList.add("crt-active");
    } else {
      setCrtEnabled(false);
      document.body.classList.remove("crt-active");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Track active section
      const sectionIds = links.map((l) => l.id);
      const scrollY = window.scrollY + 80;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollY) {
          setActive(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Konami Code sequence tracker
  useEffect(() => {
    const konamiSequence = [
      "arrowup",
      "arrowup",
      "arrowdown",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "arrowleft",
      "arrowright",
      "b",
      "a",
    ];
    let userSequence: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      userSequence.push(key);
      userSequence = userSequence.slice(-konamiSequence.length);

      if (JSON.stringify(userSequence) === JSON.stringify(konamiSequence)) {
        // Trigger glitch sound
        try {
          const { context } = getAudio();
          if (context) {
            const duration = 1.2;
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(800, context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(
              100,
              context.currentTime + duration,
            );
            gain.gain.setValueAtTime(0.7, context.currentTime);
            gain.gain.linearRampToValueAtTime(
              0.0001,
              context.currentTime + duration,
            );
            osc.connect(gain);
            gain.connect(context.destination);
            osc.start();
            osc.stop(context.currentTime + duration);
          }
        } catch {}

        // Glitch screen visual overlay
        document.body.classList.add("screen-glitch");

        setTimeout(() => {
          document.body.classList.remove("screen-glitch");

          // Unlock and switch theme to "arcade"
          setUnlockedBranches((prev) => {
            const next = prev.includes("arcade") ? prev : [...prev, "arcade"];
            localStorage.setItem("unlockedBranches", JSON.stringify(next));
            return next;
          });
          handleBranchChange("arcade");
        }, 1500);
      }
    };

    // Load unlocked branches from localStorage on mount
    const stored = localStorage.getItem("unlockedBranches");
    if (stored) {
      try {
        setUnlockedBranches(JSON.parse(stored));
      } catch {}
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [soundEnabled]);

  // Synchronize context menu events (sound toggle & theme reset)
  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const { enabled } = (e as CustomEvent).detail;
      setSoundEnabled(enabled);
    };
    const handleResetTheme = () => {
      handleBranchChange("main");
    };

    window.addEventListener("sound-state-changed", handleSoundChange);
    window.addEventListener("reset-branch-theme", handleResetTheme);

    return () => {
      window.removeEventListener("sound-state-changed", handleSoundChange);
      window.removeEventListener("reset-branch-theme", handleResetTheme);
    };
  }, []);

  // Global sound hover/click handler
  useEffect(() => {
    if (!soundEnabled) return;

    const playHoverSound = () => {
      // Tiny soft high pitch click
      playBleep(1400, 0.015, "triangle");
    };

    const playClickSound = () => {
      // Snappy square wave pop
      playBleep(580, 0.06, "square");
    };

    const elements = document.querySelectorAll(
      "button, a, .card, .skill-tag, .project-card",
    );
    elements.forEach((el) => {
      el.addEventListener("mouseenter", playHoverSound);
      el.addEventListener("click", playClickSound);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", playHoverSound);
        el.removeEventListener("click", playClickSound);
      });
    };
  }, [soundEnabled]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newDark = !html.classList.contains("dark");
    html.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    setIsDark(newDark);
    playBleep(newDark ? 400 : 700, 0.15, "sine");
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const handleBranchChange = (branch: string) => {
    setActiveBranch(branch);
    setBranchDropdownOpen(false);

    // Play branch transition chime
    if (soundEnabled) {
      playSound(600, 0.1, "triangle");
      setTimeout(() => playSound(800, 0.12, "triangle"), 60);
      setTimeout(() => playSound(1000, 0.15, "triangle"), 120);
    }
  };

  const triggerSoundStartup = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem("soundEnabled", String(newState));

    if (newState) {
      playSound(523.25, 0.12, "sine");
      setTimeout(() => playSound(659.25, 0.15, "sine"), 80);
      setTimeout(() => playSound(783.99, 0.22, "sine"), 160);
    }
  };

  return (
    <>
      {/* Branch CSS overrides injected dynamically */}
      {activeBranch !== "main" && (
        <style>{`
          :root {
            ${
              activeBranch === "hacker"
                ? `
              --bg-primary: #000000 !important;
              --bg-secondary: #050805 !important;
              --bg-card: #000000 !important;
              --bg-card-hover: #050805 !important;
              --text-primary: #00ff66 !important;
              --text-secondary: #00cc55 !important;
              --text-muted: #005511 !important;
              --accent: #00ff66 !important;
              --accent-hover: #33ff88 !important;
              --accent-glow: rgba(0, 255, 102, 0.4) !important;
              --accent-subtle: rgba(0, 255, 102, 0.08) !important;
              --border: #003311 !important;
              font-family: var(--font-mono) !important;
            `
                : ""
            }
            ${
              activeBranch === "cyberpunk"
                ? `
              --bg-primary: #0b071a !important;
              --bg-secondary: #140d2b !important;
              --bg-card: #0c081d !important;
              --bg-card-hover: #1c143d !important;
              --text-primary: #00f0ff !important;
              --text-secondary: #ff7aff !important;
              --text-muted: #6e509c !important;
              --accent: #ff007f !important;
              --accent-hover: #ff3399 !important;
              --accent-glow: rgba(255, 0, 127, 0.4) !important;
              --accent-subtle: rgba(255, 0, 127, 0.08) !important;
              --border: #3b1e5d !important;
            `
                : ""
            }
            ${
              activeBranch === "mono"
                ? `
              --bg-primary: #0d0800 !important;
              --bg-secondary: #150f00 !important;
              --bg-card: #0d0800 !important;
              --bg-card-hover: #150f00 !important;
              --text-primary: #ffb300 !important;
              --text-secondary: #cc8f00 !important;
              --text-muted: #664700 !important;
              --accent: #ffb300 !important;
              --accent-hover: #ffc433 !important;
              --accent-glow: rgba(255, 179, 0, 0.4) !important;
              --accent-subtle: rgba(255, 179, 0, 0.08) !important;
              --border: #4d3500 !important;
              font-family: var(--font-mono) !important;
            `
                : ""
            }
            ${
              activeBranch === "arcade"
                ? `
              --bg-primary: #150d02 !important;
              --bg-secondary: #221403 !important;
              --bg-card: #150d02 !important;
              --bg-card-hover: #221403 !important;
              --text-primary: #ff9d00 !important;
              --text-secondary: #d48200 !important;
              --text-muted: #804e00 !important;
              --accent: #ff9d00 !important;
              --accent-hover: #ffb84d !important;
              --accent-glow: rgba(255, 157, 0, 0.4) !important;
              --accent-subtle: rgba(255, 157, 0, 0.08) !important;
              --border: #4d2f00 !important;
              font-family: var(--font-mono) !important;
            `
                : ""
            }
          }
        `}</style>
      )}

      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div
          className="section-container backdrop-blur-md"
          style={{
            height: "var(--nav-height)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo & Git Branch Group */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Logo */}
            <button
              onClick={() => scrollTo("home")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                pitok
                <span style={{ color: "var(--text-secondary)" }}>.my.id</span>
              </span>
            </button>

            {/* Branch Switcher Selector */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="branch-selector-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 8px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
              >
                <GitBranch size={10} style={{ color: "var(--accent)" }} />
                <span>{activeBranch}</span>
              </button>

              {branchDropdownOpen && (
                <div
                  className="card branch-dropdown-menu"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: 6,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 110,
                    zIndex: 1000,
                    padding: 2,
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  {unlockedBranches.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => handleBranchChange(branch)}
                      style={{
                        padding: "6px 8px",
                        background:
                          activeBranch === branch
                            ? "var(--bg-secondary)"
                            : "transparent",
                        border: "none",
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        fontWeight: activeBranch === branch ? 700 : 500,
                        color:
                          activeBranch === branch
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                        textAlign: "left",
                        cursor: "pointer",
                        borderRadius: "2px",
                        transition: "all var(--transition-fast)",
                      }}
                      className="branch-option"
                    >
                      {branch === activeBranch ? `* ${branch}` : `  ${branch}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            className="desktop-nav"
          >
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px 8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: active === link.id ? 700 : 500,
                  cursor: "pointer",
                  color:
                    active === link.id
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  transition: "all var(--transition-fast)",
                }}
              >
                {active === link.id ? `[${link.label}]` : link.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Audio Oscilloscope Visualizer */}
            <AudioOscilloscope active={soundEnabled} />

            {/* Sound Toggle */}
            {/* CRT Monitor Toggle */}
            <button
              onClick={toggleCrt}
              aria-label="Toggle CRT screen filter"
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: crtEnabled ? "var(--accent)" : "var(--text-secondary)",
                borderColor: crtEnabled ? "var(--accent)" : "var(--border)",
                transition: "all var(--transition-fast)",
              }}
            >
              <Monitor size={14} strokeWidth={1.5} />
            </button>

            <button
              onClick={triggerSoundStartup}
              aria-label="Toggle retro sounds"
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: soundEnabled ? "var(--accent)" : "var(--text-secondary)",
                borderColor: soundEnabled ? "var(--accent)" : "var(--border)",
                transition: "all var(--transition-fast)",
              }}
            >
              {soundEnabled ? (
                <Volume2 size={14} strokeWidth={1.5} />
              ) : (
                <VolumeX size={14} strokeWidth={1.5} />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "all var(--transition-fast)",
              }}
            >
              {isDark ? (
                <Sun size={14} strokeWidth={1.5} />
              ) : (
                <Moon size={14} strokeWidth={1.5} />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="mobile-menu-btn"
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                border: "1px solid var(--border)",
                cursor: "pointer",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                display: "none",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 14,
                  height: 1.5,
                  background: "var(--text-primary)",
                  transition: "all 0.2s ease",
                  transform: menuOpen
                    ? "translateY(5.5px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 14,
                  height: 1.5,
                  background: "var(--text-primary)",
                  transition: "all 0.2s ease",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 14,
                  height: 1.5,
                  background: "var(--text-primary)",
                  transition: "all 0.2s ease",
                  transform: menuOpen
                    ? "translateY(-5.5px) rotate(-45deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="glass backdrop-blur-md"
            style={{
              position: "absolute",
              top: "var(--nav-height)",
              left: 0,
              right: 0,
              padding: "12px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px 12px",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: active === link.id ? 700 : 500,
                  cursor: "pointer",
                  color:
                    active === link.id
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {active === link.id ? `> ${link.label}` : link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        .branch-selector-btn:hover {
          border-color: var(--accent) !important;
          color: var(--text-primary) !important;
        }
        
        .branch-option:hover {
          background: var(--bg-secondary) !important;
          color: var(--text-primary) !important;
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
