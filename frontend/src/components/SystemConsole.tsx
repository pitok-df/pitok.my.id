"use client";

import {
  Activity,
  ArrowLeft,
  ChevronDown,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { playSound as playSharedSound } from "@/data/audioManager";

interface LogEntry {
  time: string;
  text: string;
}

const ACCENT_PRESETS = {
  red: {
    accent: "#ff2d55",
    hover: "#ff375f",
    glow: "rgba(255, 45, 85, 0.3)",
    subtle: "rgba(255, 45, 85, 0.1)",
  },
  green: {
    accent: "#10b981",
    hover: "#059669",
    glow: "rgba(16, 185, 129, 0.3)",
    subtle: "rgba(16, 185, 129, 0.1)",
  },
  blue: {
    accent: "#3b82f6",
    hover: "#2563eb",
    glow: "rgba(59, 130, 246, 0.3)",
    subtle: "rgba(59, 130, 246, 0.1)",
  },
  amber: {
    accent: "#f59e0b",
    hover: "#d97706",
    glow: "rgba(245, 158, 11, 0.3)",
    subtle: "rgba(245, 158, 11, 0.1)",
  },
  cyan: {
    accent: "#06b6d4",
    hover: "#0891b2",
    glow: "rgba(6, 182, 212, 0.3)",
    subtle: "rgba(6, 182, 212, 0.1)",
  },
};

const COLS = 16;
const ROWS = 10;

export default function SystemConsole({ features }: { features?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [latency, setLatency] = useState(14);
  const [mode, setMode] = useState<"logs" | "snake" | "synth" | "floppy">(
    "logs",
  );
  const [synthType, setSynthType] = useState<OscillatorType>("sine");
  const [isDropping, setIsDropping] = useState(false);
  const [isReadingDisk, setIsReadingDisk] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Snake Game State
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 8, y: 5 },
    { x: 7, y: 5 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 3, y: 3 });
  const [direction, setDirection] = useState<{ x: number; y: number }>({
    x: 1,
    y: 0,
  });
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const directionRef = useRef(direction);

  // Sound play utility
  const playSound = (
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
  ) => {
    playSharedSound(freq, duration, type);
  };

  const runDemoScript = (projectId: number, title: string) => {
    const steps = [
      `[sys] initiating compilation preview for ${title}...`,
      `[sys] downloading packages from remote node registry...`,
      `[git] unpacking repository source files...`,
      `[sys] running biome code linter & formatter...`,
      `[sys] compiling TypeScript assets (target ESNext)...`,
      `[sys] linking PostgreSQL database schemas...`,
      `[sys] building assets & optimizing production chunk bundles...`,
      `[sys] compile finished in 1.25s. Initializing server...`,
      `[ok] server listening at: http://localhost:3000`,
      `[sys] telemetry dashboard diagnostics: ALL PASS`,
    ];

    let currentStep = 0;
    const executeStep = () => {
      if (currentStep >= steps.length) return;
      const line = steps[currentStep];
      addLog(line);
      playSharedSound(
        currentStep === steps.length - 1 ? 880 : 600,
        0.05,
        "sine",
      );
      currentStep++;
      setTimeout(executeStep, 450 + Math.random() * 300);
    };

    executeStep();
  };

  useEffect(() => {
    const handleRunDemo = (e: Event) => {
      const { projectId, title } = (e as CustomEvent).detail;
      setIsOpen(true);
      setMode("logs");
      setLogs([]);
      // Small delay to let the console open animation finish
      setTimeout(() => {
        runDemoScript(projectId, title);
      }, 300);
    };

    window.addEventListener("run-project-demo", handleRunDemo);
    return () => {
      window.removeEventListener("run-project-demo", handleRunDemo);
    };
  }, []);

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev.slice(-48), { time, text }]);
    if (!isOpen) {
      setUnreadCount((c) => c + 1);
    }
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  // Initial setup & latency simulator
  useEffect(() => {
    // Save volume
    if (features?.audioVolume !== undefined) {
      localStorage.setItem("audioVolume", String(features.audioVolume));
    }

    // Load default floppy theme if not manually overridden by visitor
    if (localStorage.getItem("themeApplied") !== "true") {
      const defaultColor = features?.floppyDiskDefaultTheme || "cyan";
      if (ACCENT_PRESETS[defaultColor as keyof typeof ACCENT_PRESETS]) {
        const preset =
          ACCENT_PRESETS[defaultColor as keyof typeof ACCENT_PRESETS];
        const root = document.documentElement;
        root.style.setProperty("--accent", preset.accent);
        root.style.setProperty("--accent-hover", preset.hover);
        root.style.setProperty("--accent-glow", preset.glow);
        root.style.setProperty("--accent-subtle", preset.subtle);
      }
    }

    addLog("[sys] initializing telemetry module...");
    addLog("[sys] connected to server terminal.");
    addLog("[sys] typing 'help' lists commands.");

    const storedHighScore = localStorage.getItem("snakeHighScore");
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore) || 0);
    }

    const bgSimulatedEvents = [
      "[git] fetched updates for branch 'main' (0 changes)",
      "[sys] running component check: all nodes PASS",
      "[sys] memory cleanup executed: freed 8.4MB cached assets",
      "[net] socket ping ticked successfully",
      "[git] local repository synced with github origin",
      "[sys] telemetry load: CPU 8%, MEM 34%",
      "[sys] database query cached successfully",
    ];

    const interval = setInterval(() => {
      const randomLog =
        bgSimulatedEvents[Math.floor(Math.random() * bgSimulatedEvents.length)];
      addLog(randomLog);
    }, 15000);

    const pingInterval = setInterval(() => {
      setLatency(Math.max(8, Math.min(32, Math.floor(Math.random() * 8) + 12)));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  // Tracking page interactions
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      let identifier =
        target.innerText?.substring(0, 18).trim() || target.className || "";
      if (identifier.length > 18)
        identifier = identifier.substring(0, 15) + "...";
      addLog(`[user] click: <${tag}> "${identifier}"`);
    };

    let lastScrollLog = 0;
    const handleGlobalScroll = () => {
      const now = Date.now();
      if (now - lastScrollLog > 6000) {
        lastScrollLog = now;
        addLog(`[sys] scroll_offset: ${window.scrollY}px`);
      }
    };

    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("scroll", handleGlobalScroll);

    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("scroll", handleGlobalScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Keep ref up to date to prevent closure issues in game loop
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Keyboard navigation for Snake Game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== "snake") return;
      const key = e.key;
      const curDir = directionRef.current;

      if ((key === "ArrowUp" || key.toLowerCase() === "w") && curDir.y === 0) {
        setDirection({ x: 0, y: -1 });
        e.preventDefault();
      } else if (
        (key === "ArrowDown" || key.toLowerCase() === "s") &&
        curDir.y === 0
      ) {
        setDirection({ x: 0, y: 1 });
        e.preventDefault();
      } else if (
        (key === "ArrowLeft" || key.toLowerCase() === "a") &&
        curDir.x === 0
      ) {
        setDirection({ x: -1, y: 0 });
        e.preventDefault();
      } else if (
        (key === "ArrowRight" || key.toLowerCase() === "d") &&
        curDir.x === 0
      ) {
        setDirection({ x: 1, y: 0 });
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode]);

  // Snake Game Loop
  useEffect(() => {
    if (mode !== "snake" || !gameRunning || gameOver) return;

    const generateFood = (currentSnake: { x: number; y: number }[]) => {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * COLS),
          y: Math.floor(Math.random() * ROWS),
        };
        const conflicts = currentSnake.some(
          (cell) => cell.x === newFood!.x && cell.y === newFood!.y,
        );
        if (!conflicts) break;
      }
      return newFood;
    };

    const runGameTick = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const dir = directionRef.current;
        const newHead = {
          x: head.x + dir.x,
          y: head.y + dir.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= COLS ||
          newHead.y < 0 ||
          newHead.y >= ROWS
        ) {
          setGameOver(true);
          setGameRunning(false);
          playSound(220, 0.4, "sawtooth");
          return prevSnake;
        }

        // Self collision
        const biteSelf = prevSnake.some(
          (cell) => cell.x === newHead.x && cell.y === newHead.y,
        );
        if (biteSelf) {
          setGameOver(true);
          setGameRunning(false);
          playSound(220, 0.4, "sawtooth");
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food eating collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem("snakeHighScore", String(nextScore));
            }
            return nextScore;
          });
          playSound(880, 0.08, "triangle");
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(runGameTick, 130);
    return () => clearInterval(interval);
  }, [mode, gameRunning, gameOver, food, highScore]);

  const resetSnakeGame = () => {
    setSnake([
      { x: 8, y: 5 },
      { x: 7, y: 5 },
    ]);
    setFood({ x: 3, y: 3 });
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameRunning(true);
    playSound(440, 0.06, "sine");
  };

  const triggerPresetSound = (
    type: "laser" | "coin" | "powerup" | "explosion",
  ) => {
    if (type === "laser") {
      playSharedSound(800, 0.15, "sawtooth");
      setTimeout(() => playSharedSound(400, 0.15, "sawtooth"), 50);
      setTimeout(() => playSharedSound(200, 0.2, "sawtooth"), 100);
    } else if (type === "coin") {
      playSharedSound(987.77, 0.08, "sine");
      setTimeout(() => playSharedSound(1318.51, 0.25, "sine"), 80);
    } else if (type === "powerup") {
      playSharedSound(330, 0.1, "triangle");
      setTimeout(() => playSharedSound(392, 0.1, "triangle"), 70);
      setTimeout(() => playSharedSound(659, 0.1, "triangle"), 140);
      setTimeout(() => playSharedSound(523, 0.1, "triangle"), 210);
      setTimeout(() => playSharedSound(587, 0.1, "triangle"), 280);
      setTimeout(() => playSharedSound(784, 0.2, "triangle"), 350);
    } else if (type === "explosion") {
      playSharedSound(100, 0.4, "sawtooth");
      playSharedSound(80, 0.4, "triangle");
    }
  };

  const handleInsertDisk = (color: string) => {
    if (isReadingDisk) return;
    setIsReadingDisk(true);

    playSharedSound(180, 0.08, "triangle");
    setTimeout(() => playSharedSound(140, 0.08, "triangle"), 90);
    setTimeout(() => playSharedSound(160, 0.08, "triangle"), 180);
    setTimeout(() => playSharedSound(110, 0.15, "triangle"), 270);

    setTimeout(() => {
      setIsReadingDisk(false);

      if (ACCENT_PRESETS[color as keyof typeof ACCENT_PRESETS]) {
        const preset = ACCENT_PRESETS[color as keyof typeof ACCENT_PRESETS];
        const root = document.documentElement;
        root.style.setProperty("--accent", preset.accent);
        root.style.setProperty("--accent-hover", preset.hover);
        root.style.setProperty("--accent-glow", preset.glow);
        root.style.setProperty("--accent-subtle", preset.subtle);

        localStorage.setItem("themeApplied", "true");
        addLog(`[sys] Disk inserted. Accent set to: ${color.toUpperCase()}`);

        document.body.classList.add("screen-glitch");
        setTimeout(() => {
          document.body.classList.remove("screen-glitch");
        }, 300);

        playSharedSound(880, 0.08, "sine");
        setTimeout(() => playSharedSound(1320, 0.15, "sine"), 80);
      }
    }, 800);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim().toLowerCase();
    if (!cmd) return;

    addLog(`$ ${inputValue}`);
    setInputValue("");

    const parts = cmd.split(" ");
    const primaryCmd = parts[0];

    switch (primaryCmd) {
      case "help":
        addLog(
          "[help] commands: clear, reset, git, system, theme [color], snake, synth, floppy, pet [target], feed, charge, exit",
        );
        addLog(
          "[help] type 'snake' (game), 'synth' (soundboard), or 'floppy' (theme disks)",
        );
        break;
      case "reset": {
        const resetTarget = parts[1];
        if (resetTarget === "mascots" || resetTarget === "mascot") {
          window.dispatchEvent(
            new CustomEvent("mascot-action", {
              detail: { action: "reset" },
            }),
          );
          addLog("[sys] resetting mascot positions to default...");
        } else {
          addLog("[error] Usage: reset mascots");
        }
        break;
      }
      case "pet": {
        const petTarget = parts[1];
        if (petTarget === "neko" || petTarget === "robo") {
          window.dispatchEvent(
            new CustomEvent("mascot-action", {
              detail: { action: "pet", target: petTarget },
            }),
          );
          addLog(`[sys] petting ${petTarget}...`);
        } else {
          addLog("[error] Usage: pet neko | robo");
        }
        break;
      }
      case "feed": {
        const feedTarget = parts[1];
        if (feedTarget === "neko") {
          window.dispatchEvent(
            new CustomEvent("mascot-action", {
              detail: { action: "feed", target: "neko" },
            }),
          );
          addLog("[sys] feeding neko...");
        } else {
          addLog("[error] Usage: feed neko");
        }
        break;
      }
      case "charge": {
        const chargeTarget = parts[1];
        if (chargeTarget === "robo") {
          window.dispatchEvent(
            new CustomEvent("mascot-action", {
              detail: { action: "charge", target: "robo" },
            }),
          );
          addLog("[sys] charging robo...");
        } else {
          addLog("[error] Usage: charge robo");
        }
        break;
      }
      case "clear":
        setLogs([]);
        break;
      case "exit":
        setIsOpen(false);
        break;
      case "snake":
        setMode("snake");
        setSnake([
          { x: 8, y: 5 },
          { x: 7, y: 5 },
        ]);
        setFood({ x: 3, y: 3 });
        setDirection({ x: 1, y: 0 });
        setScore(0);
        setGameOver(false);
        setGameRunning(false);
        addLog("[sys] game sub-view initialized.");
        break;
      case "synth": {
        const synthEnabled = features?.synthSoundboardEnabled !== false;
        if (!synthEnabled) {
          addLog("[err] command 'synth' disabled by administrator.");
        } else {
          setMode("synth");
          addLog("[sys] retro synth sub-view initialized.");
        }
        break;
      }
      case "floppy":
        setMode("floppy");
        addLog("[sys] floppy disk manager sub-view initialized.");
        break;
      case "git":
        addLog("[git] status: branch 'main' synced with origin/main");
        addLog(
          "[git] recent commit: 5fa32b [Pito Desri Pauzi] 'feat: upgrade sections with dynamic interactions'",
        );
        break;
      case "system":
        addLog(
          `[sys] OS: Client Browser | screen: ${window.innerWidth}x${window.innerHeight}`,
        );
        addLog(
          `[sys] Telemetry: Latency ${latency}ms | Language: ${navigator.language}`,
        );
        break;
      case "theme": {
        const color = parts[1];
        if (!color || !ACCENT_PRESETS[color as keyof typeof ACCENT_PRESETS]) {
          addLog(
            "[error] Please specify theme: theme red | green | blue | amber | cyan",
          );
        } else {
          const preset = ACCENT_PRESETS[color as keyof typeof ACCENT_PRESETS];
          const root = document.documentElement;
          root.style.setProperty("--accent", preset.accent);
          root.style.setProperty("--accent-hover", preset.hover);
          root.style.setProperty("--accent-glow", preset.glow);
          root.style.setProperty("--accent-subtle", preset.subtle);
          addLog(`[ok] System accent updated to: ${color.toUpperCase()}`);
        }
        break;
      }
      default:
        addLog(
          `[error] Command not found: '${primaryCmd}'. Type 'help' for instructions.`,
        );
    }
  };

  // Rendering the Snake Grid
  const renderGameBoard = () => {
    const board: string[][] = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill("."));

    // Render food
    if (food.x >= 0 && food.x < COLS && food.y >= 0 && food.y < ROWS) {
      board[food.y][food.x] = "@";
    }

    // Render snake
    snake.forEach((cell, idx) => {
      if (cell.x >= 0 && cell.x < COLS && cell.y >= 0 && cell.y < ROWS) {
        board[cell.y][cell.x] = idx === 0 ? "O" : "#";
      }
    });

    return board.map((row, idx) => (
      <div key={idx} style={{ letterSpacing: "0.2em", height: 13 }}>
        |{row.join("")}|
      </div>
    ));
  };

  return (
    <div className="system-console-wrapper">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="console-trigger"
          title="Open Telemetry Console"
        >
          <Terminal size={16} />
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            console.sh
          </span>
          {unreadCount > 0 && <span className="unread-dot">{unreadCount}</span>}
          <span className="live-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="console-window">
          <div className="console-crt-scanline" />

          {/* Window Header */}
          <div
            className="console-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Activity size={12} className="console-pulse-icon" />
                <span style={{ fontSize: 9, fontWeight: "bold", opacity: 0.8 }}>
                  SYS_CONSOLE
                </span>
              </div>

              {/* Mode switching tabs */}
              <div className="console-tabs" style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => setMode("logs")}
                  className={`console-tab-btn ${mode === "logs" ? "active" : ""}`}
                >
                  LOGS
                </button>
                <button
                  onClick={() => {
                    setMode("snake");
                    resetSnakeGame();
                  }}
                  className={`console-tab-btn ${mode === "snake" ? "active" : ""}`}
                >
                  SNAKE
                </button>
                {features?.synthSoundboardEnabled !== false && (
                  <button
                    onClick={() => setMode("synth")}
                    className={`console-tab-btn ${mode === "synth" ? "active" : ""}`}
                  >
                    SYNTH
                  </button>
                )}
                <button
                  onClick={() => setMode("floppy")}
                  className={`console-tab-btn ${mode === "floppy" ? "active" : ""}`}
                >
                  FLOPPY
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="status-ping" style={{ fontSize: 9 }}>
                {latency}ms
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="console-close-btn"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Views Selector */}
          {mode === "logs" && (
            <>
              <div className="console-output">
                {logs.map((log, idx) => (
                  <div key={idx} className="console-log-row">
                    <span className="log-time">[{log.time}]</span>
                    <span className="log-text">{log.text}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>

              {/* Prompt CLI Form */}
              <form onSubmit={handleCommand} className="console-input-form">
                <span className="console-prompt-char">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  className="console-prompt-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type command ('help', 'snake')..."
                  maxLength={40}
                />
                <button type="submit" style={{ display: "none" }} />
              </form>
            </>
          )}

          {mode === "snake" && (
            <div className="snake-arcade-container">
              <div className="snake-stats-header">
                <div>SCORE: {score}</div>
                <div>HI-SCORE: {highScore}</div>
              </div>

              {/*Monospace ASCII Board */}
              <div className="snake-ascii-board">
                <div style={{ letterSpacing: "0.2em" }}>+----------------+</div>
                {renderGameBoard()}
                <div style={{ letterSpacing: "0.2em" }}>+----------------+</div>
              </div>

              {/* Game Over alert */}
              {gameOver && <div className="game-over-banner">GAME OVER</div>}

              {/* Arcade Controller actions */}
              <div className="snake-control-panel">
                <button
                  onClick={() => setMode("logs")}
                  className="btn-console-arcade"
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <ArrowLeft size={10} />
                  EXIT
                </button>

                <div style={{ display: "flex", gap: 6 }}>
                  {gameOver ? (
                    <button
                      onClick={resetSnakeGame}
                      className="btn-console-arcade"
                    >
                      <RotateCcw size={10} style={{ marginRight: 3 }} />
                      RESTART
                    </button>
                  ) : (
                    <button
                      onClick={() => setGameRunning(!gameRunning)}
                      className="btn-console-arcade"
                    >
                      <Play size={10} style={{ marginRight: 3 }} />
                      {gameRunning ? "PAUSE" : "START"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {mode === "synth" && (
            <div className="console-synth-container">
              <div className="synth-title">retro_synthesizer</div>

              <div className="synth-keys-grid">
                {[
                  { note: "C4", freq: 261.63 },
                  { note: "D4", freq: 293.66 },
                  { note: "E4", freq: 329.63 },
                  { note: "F4", freq: 349.23 },
                  { note: "G4", freq: 392.0 },
                  { note: "A4", freq: 440.0 },
                  { note: "B4", freq: 493.88 },
                  { note: "C5", freq: 523.25 },
                ].map((k) => (
                  <button
                    key={k.note}
                    className="synth-key"
                    onClick={() => {
                      playSharedSound(k.freq, 0.25, synthType);
                    }}
                  >
                    <span>{k.note}</span>
                  </button>
                ))}
              </div>

              <div className="synth-controls">
                <span style={{ fontSize: 9, opacity: 0.8 }}>WAVE:</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {(
                    [
                      "sine",
                      "square",
                      "sawtooth",
                      "triangle",
                    ] as OscillatorType[]
                  ).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSynthType(t)}
                      className={`synth-control-btn ${synthType === t ? "active" : ""}`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="synth-presets">
                <span style={{ fontSize: 9, opacity: 0.8 }}>PRESET SFX:</span>
                <div className="synth-presets-grid">
                  <button
                    className="synth-preset-btn"
                    onClick={() => triggerPresetSound("laser")}
                  >
                    LASER
                  </button>
                  <button
                    className="synth-preset-btn"
                    onClick={() => triggerPresetSound("coin")}
                  >
                    COIN
                  </button>
                  <button
                    className="synth-preset-btn"
                    onClick={() => triggerPresetSound("powerup")}
                  >
                    1-UP
                  </button>
                  <button
                    className="synth-preset-btn"
                    onClick={() => triggerPresetSound("explosion")}
                  >
                    BOOM
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "floppy" && (
            <div className="console-floppy-container">
              <div className="floppy-title">floppy_drive</div>
              <p className="floppy-desc">
                Drag a system disk to slot or click to load:
              </p>

              <div
                className={`floppy-drive-slot ${isDropping ? "hover" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDropping(true);
                }}
                onDragLeave={() => setIsDropping(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDropping(false);
                  const color = e.dataTransfer.getData("themeColor");
                  if (color) handleInsertDisk(color);
                }}
              >
                <div className="drive-opening">
                  <div className="drive-slider" />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "4px 8px",
                  }}
                >
                  <span style={{ fontSize: 8, opacity: 0.6 }}>
                    DRIVE A: 3.5"
                  </span>
                  <div
                    className={`drive-led ${isReadingDisk ? "active" : ""}`}
                  />
                </div>
              </div>

              <div className="floppy-disks-rack">
                {[
                  { color: "green", label: "GREEN" },
                  { color: "cyan", label: "CYAN" },
                  { color: "amber", label: "AMBER" },
                  { color: "blue", label: "BLUE" },
                  { color: "red", label: "RED" },
                ].map((disk) => (
                  <div
                    key={disk.color}
                    className="floppy-disk"
                    style={{
                      borderTop: `4px solid ${ACCENT_PRESETS[disk.color as keyof typeof ACCENT_PRESETS]?.accent}`,
                    }}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("themeColor", disk.color);
                    }}
                    onClick={() => handleInsertDisk(disk.color)}
                  >
                    <div className="floppy-shutter" />
                    <div className="floppy-write-protect" />
                    <div className="floppy-label">
                      <span className="floppy-label-text">{disk.label}</span>
                      <div className="floppy-label-lines" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .system-console-wrapper {
          position: fixed;
          bottom: 16px;
          left: 16px;
          z-index: 1000;
          font-family: var(--font-mono);
        }

        .console-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 12px;
          box-shadow: var(--shadow-md);
          position: relative;
          transition: border-color 0.2s, transform 0.2s;
        }

        .console-trigger:hover {
          border-color: var(--accent);
          transform: scale(1.02);
        }

        .unread-dot {
          background: var(--accent);
          color: var(--bg-primary);
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: var(--radius-full);
          display: inline-block;
        }

        .live-pulse {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 6px #10b981;
          animation: pulse-ring 1.8s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        /* Console Window container */
        .console-window {
          width: 360px;
          height: 330px;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--accent);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          position: relative;
        }

        .console-crt-scanline {
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.08) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 10;
        }

        .console-header {
          background: var(--bg-secondary);
          padding: 8px 12px;
          font-size: 11px;
          color: var(--accent);
          border-bottom: 1px solid var(--accent);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
        }

        .console-close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }
        
        .console-close-btn:hover {
          color: var(--accent);
        }

        .console-pulse-icon {
          animation: pulse-ring 1s linear infinite;
        }

        .console-output {
          flex: 1;
          padding: 10px 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 11px;
          line-height: 1.4;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        .console-output::-webkit-scrollbar {
          width: 4px;
        }
        .console-output::-webkit-scrollbar-thumb {
          background-color: var(--border);
          border-radius: 2px;
        }

        .console-log-row {
          display: flex;
          gap: 8px;
        }

        .log-time {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .log-text {
          color: var(--text-primary);
          word-break: break-all;
        }

        .console-input-form {
          border-top: 1px solid var(--border);
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-primary);
          opacity: 0.95;
        }

        .console-prompt-char {
          color: var(--accent);
          font-weight: 700;
          font-size: 12px;
        }

        .console-prompt-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .console-prompt-input::placeholder {
          color: var(--text-muted);
          opacity: 0.6;
        }

        /* Snake Arcade Layout */
        .snake-arcade-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 8px 12px;
          justify-content: space-between;
          color: var(--accent);
        }

        .snake-stats-header {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          font-weight: 700;
          border-bottom: 1px dashed var(--accent);
          padding-bottom: 4px;
        }

        .snake-ascii-board {
          align-self: center;
          font-size: 10px;
          line-height: 12px;
          font-weight: 700;
          color: #10b981; /* Green board */
          margin: 4px 0;
        }

        .game-over-banner {
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
          border: 1px solid #ef4444;
          color: #ef4444;
          font-weight: 800;
          padding: 4px 12px;
          font-size: 12px;
          letter-spacing: 0.1em;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
          z-index: 20;
        }

        .snake-control-panel {
          border-top: 1px dashed var(--accent);
          padding-top: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-console-arcade {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--accent);
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 9px;
          padding: 3px 8px;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.15s, color 0.15s;
        }

        .btn-console-arcade:hover {
          background: var(--accent);
          color: var(--bg-primary);
        }

        .console-tab-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 8px;
          padding: 1px 5px;
          cursor: pointer;
          border-radius: 2px;
          transition: all var(--transition-fast);
        }
        .console-tab-btn:hover {
          background: var(--accent-subtle);
          color: var(--accent);
          border-color: var(--accent);
        }
        .console-tab-btn.active {
          background: var(--accent);
          color: var(--bg-primary) !important;
          border-color: var(--accent);
          font-weight: bold;
        }

        /* Synth Soundboard styles */
        .console-synth-container {
          display: flex;
          flex-direction: column;
          height: 250px;
          padding: 8px;
          gap: 12px;
        }
        .synth-title {
          font-size: 10px;
          font-weight: bold;
          color: var(--accent);
          border-bottom: 1px dashed var(--accent-subtle);
          padding-bottom: 4px;
          text-transform: uppercase;
        }
        .synth-keys-grid {
          display: flex;
          background: #000;
          border: 1px solid var(--accent-subtle);
          border-radius: 4px;
          padding: 6px;
          gap: 3px;
        }
        .synth-key {
          flex: 1;
          height: 80px;
          background: #fff;
          border: 1px solid #ddd;
          border-bottom: 8px solid #ddd;
          color: #000;
          border-radius: 2px;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: bold;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 8px;
          cursor: pointer;
          transition: all 0.05s ease;
          outline: none;
        }
        .synth-key:active {
          height: 78px;
          border-bottom-width: 2px;
          margin-top: 2px;
          background: #eaeaea;
        }
        .synth-controls, .synth-presets {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          gap: 8px;
        }
        .synth-control-btn, .synth-preset-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 8px;
          padding: 3px 6px;
          cursor: pointer;
          border-radius: 2px;
          transition: all var(--transition-fast);
        }
        .synth-control-btn:hover, .synth-preset-btn:hover {
          background: var(--accent-subtle);
          color: var(--accent);
          border-color: var(--accent);
        }
        .synth-control-btn.active {
          background: var(--accent);
          color: var(--bg-primary) !important;
          border-color: var(--accent);
          font-weight: bold;
        }
        .synth-presets-grid {
          display: flex;
          gap: 4px;
        }

        /* Floppy Disk Drag & Drop styles */
        .console-floppy-container {
          display: flex;
          flex-direction: column;
          height: 250px;
          padding: 8px;
          position: relative;
        }
        .floppy-title {
          font-size: 10px;
          font-weight: bold;
          color: var(--accent);
          border-bottom: 1px dashed var(--accent-subtle);
          padding-bottom: 4px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .floppy-desc {
          font-size: 10px;
          text-align: center;
          margin-bottom: 8px;
          opacity: 0.8;
        }
        .floppy-drive-slot {
          background: #0d0c0f;
          border: 2px solid var(--border);
          border-radius: 4px;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .floppy-drive-slot.hover {
          border-color: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
          background: rgba(255, 255, 255, 0.02);
        }
        .drive-opening {
          width: 80%;
          height: 10px;
          background: #000;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .drive-slider {
          position: absolute;
          left: 10%;
          width: 80%;
          height: 100%;
          background: #18181b;
          border-right: 2px solid #27272a;
          transition: transform 0.3s ease;
        }
        .floppy-drive-slot.hover .drive-slider {
          transform: translateX(100%);
        }
        .drive-led {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3f3f46;
          transition: background 0.15s ease;
        }
        .drive-led.active {
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: led-blink 0.1s infinite alternate;
        }
        @keyframes led-blink {
          from { opacity: 0.4; }
          to { opacity: 1; }
        }
        .floppy-disks-rack {
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: auto;
        }
        .floppy-disk {
          width: 46px;
          height: 46px;
          background: #1c1917;
          border: 1px solid #44403c;
          border-radius: 3px;
          position: relative;
          cursor: grab;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2px;
          transition: transform 0.2s var(--transition);
        }
        .floppy-disk:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
        .floppy-disk:active {
          cursor: grabbing;
        }
        .floppy-label {
          background: #f4f4f5;
          color: #09090b;
          border-radius: 1px;
          padding: 1px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          height: 55%;
        }
        .floppy-label-text {
          font-size: 5px;
          font-weight: bold;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .floppy-label-lines {
          flex-grow: 1;
          background: repeating-linear-gradient(#f4f4f5, #f4f4f5 1px, #a1a1aa 1px, #a1a1aa 2px);
        }
        .floppy-shutter {
          position: absolute;
          top: 0;
          left: 10px;
          width: 14px;
          height: 10px;
          background: #71717a;
          border-bottom-left-radius: 1px;
          border-bottom-right-radius: 1px;
        }
        .floppy-write-protect {
          position: absolute;
          top: 2px;
          right: 3px;
          width: 3px;
          height: 3px;
          background: #000;
          border-radius: 1px;
        }

        @media (max-width: 480px) {
          .console-window {
            width: calc(100vw - 32px);
            height: 320px;
          }
          .snake-ascii-board {
            font-size: 8px;
            line-height: 10px;
          }
          .synth-key {
            height: 60px;
          }
          .synth-key:active {
            height: 58px;
          }
          .floppy-disk {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
