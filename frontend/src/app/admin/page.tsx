"use client";

import {
  Activity,
  AlertTriangle,
  Award,
  Briefcase,
  Check,
  Clock,
  Cpu,
  GraduationCap,
  HardDrive,
  Home,
  Image as ImageIcon,
  Loader2,
  type LucideIcon,
  Mail,
  Menu,
  MessageSquare,
  Monitor,
  Radio,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Settings,
  Shield,
  Sliders,
  Terminal,
  Trash2,
  User,
  Volume2,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import { playSound } from "@/data/audioManager";

// ===== TYPES =====
interface ContentData {
  hero: {
    greeting: string;
    name: string;
    titles: string[];
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    availableForWork: boolean;
  };
  about: {
    bio: string;
    facts: { value: string; label: string }[];
  };
  skills: {
    categories: { name: string; icon: string; items: string[] }[];
  };
  projects: {
    id: number;
    title: string;
    description: string;
    tags: string[];
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    gradient: string;
  }[];
  experience: {
    id: number;
    role: string;
    company: string;
    period: string;
    description: string;
    current: boolean;
  }[];
  education: {
    id: number;
    degree: string;
    school: string;
    period: string;
    description: string;
  }[];
  certifications: {
    id: number;
    title: string;
    issuer: string;
    date: string;
  }[];
  services: {
    id: number;
    title: string;
    description: string;
  }[];
  setup: {
    os: string;
    editor: string;
    terminal: string;
    hardware: string;
  };
  contact: {
    heading: string;
    subheading: string;
    email: string;
    social: { github: string; linkedin: string; instagram: string };
  };
  meta: {
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;
  };
  features?: {
    crtEnabled: boolean;
    biosBootEnabled: boolean;
    biosBootDuration: number;
    biosTitle: string;
    biosLines: string[];
    contextMenuEnabled: boolean;
    glitchEffectEnabled: boolean;
    devConsoleWarningEnabled: boolean;
    devConsoleWarningTitle: string;
    devConsoleWarningText: string;
    synthSoundboardEnabled: boolean;
    floppyDiskDefaultTheme: string;
    audioVolume: number;
  };
  gallery?: GalleryItem[];
}

interface GalleryItem {
  id: number;
  url: string;
  caption: string;
  date: string;
}

const SECTIONS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  category: "command" | "core" | "content";
}[] = [
  // COMMANDS
  {
    id: "dashboard",
    label: "System Monitor",
    Icon: Radio,
    category: "command",
  },

  // CORE SYSTEMS
  { id: "features", label: "Control Deck", Icon: Sliders, category: "core" },
  {
    id: "guestbook",
    label: "Guestbook Log",
    Icon: MessageSquare,
    category: "core",
  },

  // PORTFOLIO SCHEMA
  { id: "hero", label: "Hero Profile", Icon: Home, category: "content" },
  { id: "about", label: "About Bio", Icon: User, category: "content" },
  { id: "skills", label: "Skills Matrix", Icon: Zap, category: "content" },
  {
    id: "services",
    label: "Services Offered",
    Icon: Wrench,
    category: "content",
  },
  { id: "projects", label: "Project Board", Icon: Rocket, category: "content" },
  {
    id: "experience",
    label: "Work History",
    Icon: Briefcase,
    category: "content",
  },
  {
    id: "education",
    label: "Education Log",
    Icon: GraduationCap,
    category: "content",
  },
  {
    id: "certifications",
    label: "Credentials",
    Icon: Award,
    category: "content",
  },
  { id: "setup", label: "Workspace Setup", Icon: Monitor, category: "content" },
  {
    id: "gallery",
    label: "Image Gallery",
    Icon: ImageIcon,
    category: "content",
  },
  { id: "contact", label: "Contact Channels", Icon: Mail, category: "content" },
  { id: "meta", label: "SEO Registry", Icon: Search, category: "content" },
];

// ===== LOGIN SCREEN =====
function LoginScreen({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onLogin(password);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: 24,
      }}
    >
      <CustomCursor />

      <div
        style={{
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "var(--accent)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontWeight: 800,
              fontSize: 20,
              color: "white",
              margin: "0 auto 16px",
            }}
          >
            PD
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Admin Panel
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>
            pitok.my.id
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  color: "#ef4444",
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {loading ? "Authenticating..." : "Login to Admin"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          <a
            href="/"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            ← Back to Portfolio
          </a>
        </p>
      </div>
    </div>
  );
}

// ===== FIELD COMPONENT =====
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-muted)",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontFamily: "var(--font-mono)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ cursor: "text" }}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      style={{ cursor: "text" }}
    />
  );
}

// ===== MAIN ADMIN COMPONENT =====
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<ContentData | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(14);
  const [cpuLoad, setCpuLoad] = useState(21);
  const [ramLoad, setRamLoad] = useState(64);
  const [adminCrt, setAdminCrt] = useState(false);
  const [timeString, setTimeString] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("soundEnabled") === "true"
    ) {
      playSound(880, 0.05, "sine");
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString("id-ID"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Add admin class to body to restore default cursor
    document.body.classList.add("admin-body");

    return () => {
      clearInterval(interval);
      document.body.classList.remove("admin-body");
    };
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      setLatency((prev) => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + change;
        return Math.max(6, Math.min(35, next));
      });
      setCpuLoad(() => Math.floor(Math.random() * 15) + 12); // Fluctuate CPU: 12% - 27%
      setRamLoad((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
        const next = prev + change;
        return Math.max(55, Math.min(75, next));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [authenticated]);

  const handleLogin = async (pwd: string) => {
    setPassword(pwd);
    setLoading(true);
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      setContent(data);
      setAuthenticated(true);
    } catch {
      console.error("Failed to load content");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...content, password }),
      });

      if (res.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }

    setSaving(false);
  };

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (loading || !content) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid var(--accent)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Loading content...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={`${adminCrt ? "crt-active" : ""} admin-layout-container`}>
      {/* Mobile Header Bar */}
      <header className="admin-mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 24,
              height: 24,
              background: "var(--accent)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontWeight: 800,
              fontSize: 10,
              color: "white",
            }}
          >
            PD
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Admin Panel
          </span>
        </div>
        <button
          className="admin-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{ width: "auto" }}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Backdrop overlay for mobile menu */}
      <div
        className={`admin-sidebar-backdrop ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div style={{ padding: "24px 20px" }}>
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "var(--accent)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontWeight: 800,
                fontSize: 13,
                color: "white",
              }}
            >
              PD
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Admin Panel
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                pitok.my.id
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  paddingLeft: 8,
                  fontFamily: "var(--font-mono)",
                }}
              >
                // Console Control
              </div>
              {SECTIONS.filter((s) => s.category === "command").map(
                (section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`admin-nav-item ${activeSection === section.id ? "active" : ""}`}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      marginBottom: 2,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <section.Icon size={14} strokeWidth={2} />
                    {section.label}
                  </button>
                ),
              )}
            </div>

            <div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  paddingLeft: 8,
                  fontFamily: "var(--font-mono)",
                }}
              >
                // Interactive Core
              </div>
              {SECTIONS.filter((s) => s.category === "core").map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`admin-nav-item ${activeSection === section.id ? "active" : ""}`}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    marginBottom: 2,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <section.Icon size={14} strokeWidth={2} />
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {section.label}
                    {section.id === "guestbook" && (
                      <span className="admin-hud-badge" style={{ fontSize: 8 }}>
                        LIVE
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  paddingLeft: 8,
                  fontFamily: "var(--font-mono)",
                }}
              >
                // Data Registry
              </div>
              <div
                style={{
                  maxHeight: "30vh",
                  overflowY: "auto",
                  paddingRight: 2,
                }}
              >
                {SECTIONS.filter((s) => s.category === "content").map(
                  (section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`admin-nav-item ${activeSection === section.id ? "active" : ""}`}
                      style={{
                        width: "100%",
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        marginBottom: 2,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      <section.Icon size={14} strokeWidth={2} />
                      {section.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          </nav>

          {/* Telemetry Dashboard Stats */}
          <div
            className="admin-telemetry-box"
            style={{
              marginTop: 18,
              padding: "10px 12px",
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-secondary)",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px dashed var(--border)",
                paddingBottom: 4,
                marginBottom: 2,
              }}
            >
              <span style={{ color: "var(--accent)", fontWeight: "bold" }}>
                SYS_TELEMETRY.v4
              </span>
              <span className="admin-telemetry-led blink"></span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>CPU LOAD:</span>
              <span style={{ color: "var(--text-primary)" }}>{cpuLoad}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 3,
                background: "rgba(255,255,255,0.05)",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${cpuLoad}%`,
                  height: "100%",
                  background: "var(--accent)",
                  transition: "width 0.4s ease",
                }}
              ></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>RAM LOAD:</span>
              <span style={{ color: "var(--text-primary)" }}>{ramLoad}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 3,
                background: "rgba(255,255,255,0.05)",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${ramLoad}%`,
                  height: "100%",
                  background: "#10b981",
                  transition: "width 0.4s ease",
                }}
              ></div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <span>LATENCY:</span>
              <span style={{ color: "#3b82f6" }}>{latency}ms</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>DB_SERVER:</span>
              <span style={{ color: "#10b981" }}>CONNECTED</span>
            </div>
          </div>

          {/* Bottom actions */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
            }}
          >
            <a
              href="/"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "var(--text-muted)",
                textDecoration: "none",
                padding: "8px 0",
              }}
              rel="noopener"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View Live Site
            </a>
            <button
              onClick={() => {
                setAuthenticated(false);
                setContent(null);
                setPassword("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 0",
                width: "100%",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {/* Header HUD / Status Bar */}
        <div className="admin-header-hud">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                className="admin-telemetry-led blink"
                style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }}
              ></span>
              <span
                style={{ fontWeight: "bold", color: "var(--text-primary)" }}
              >
                CORE_STATUS: OK
              </span>
            </div>
            <span>|</span>
            <span>
              OPERATOR:{" "}
              <span style={{ color: "var(--accent)" }}>root@pitok.my.id</span>
            </span>
            <span>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={12} /> SESSION_TIME:{" "}
              <span style={{ color: "var(--text-primary)" }}>{timeString}</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => {
                setAdminCrt(!adminCrt);
                if (
                  typeof window !== "undefined" &&
                  localStorage.getItem("soundEnabled") === "true"
                ) {
                  playSound(600, 0.05, "triangle");
                }
              }}
              className="admin-hud-button"
              style={{
                padding: "6px 12px",
                fontSize: 11,
                background: adminCrt ? "rgba(225,29,72,0.1)" : "none",
                borderColor: adminCrt ? "var(--accent)" : "var(--border)",
              }}
            >
              <Monitor size={12} />{" "}
              {adminCrt ? "CRT Filter: ON" : "CRT Filter: OFF"}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{
                cursor: "pointer",
                height: 32,
                padding: "0 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {saving ? (
                <>
                  <Loader2
                    size={13}
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Check size={13} strokeWidth={2.5} />
                  Saved!
                </>
              ) : saveStatus === "error" ? (
                <>
                  <RefreshCw size={13} />
                  Error!
                </>
              ) : (
                <>
                  <Save size={13} strokeWidth={2} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Section Header */}
        <div style={{ marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
            }}
          >
            {(() => {
              const s = SECTIONS.find((s) => s.id === activeSection);
              if (!s) return null;
              return <s.Icon size={18} strokeWidth={2} />;
            })()}
            {SECTIONS.find((s) => s.id === activeSection)?.label}
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 2,
              fontFamily: "var(--font-mono)",
            }}
          >
            {activeSection === "dashboard" &&
              "Central mainframe logs and visual telemetry feedback."}
            {activeSection === "features" &&
              "Configure overlays, BIOS boot scripts, chiptune synth, and dev shields."}
            {activeSection === "guestbook" &&
              "Read and moderate live guestbook comment transmissions."}
            {activeSection !== "dashboard" &&
              activeSection !== "features" &&
              activeSection !== "guestbook" &&
              "Modify content database registry values."}
          </p>
        </div>

        {/* Main Work Area Card */}
        <div
          className="admin-hud-card"
          style={{
            flex: 1,
            padding: 32,
            background: "rgba(10, 10, 12, 0.2)",
            borderColor: "var(--border)",
          }}
        >
          {activeSection === "dashboard" && (
            <DashboardOverview
              content={content}
              onSectionSelect={setActiveSection}
              latency={latency}
              cpuLoad={cpuLoad}
              ramLoad={ramLoad}
              password={password}
            />
          )}
          {activeSection === "features" && (
            <FeaturesEditor content={content} setContent={setContent} />
          )}
          {activeSection === "guestbook" && (
            <GuestbookModerator password={password} />
          )}
          {activeSection === "hero" && (
            <HeroEditor content={content} setContent={setContent} />
          )}
          {activeSection === "about" && (
            <AboutEditor content={content} setContent={setContent} />
          )}
          {activeSection === "skills" && (
            <SkillsEditor content={content} setContent={setContent} />
          )}
          {activeSection === "services" && (
            <ServicesEditor content={content} setContent={setContent} />
          )}
          {activeSection === "projects" && (
            <ProjectsEditor content={content} setContent={setContent} />
          )}
          {activeSection === "experience" && (
            <ExperienceEditor content={content} setContent={setContent} />
          )}
          {activeSection === "education" && (
            <EducationEditor content={content} setContent={setContent} />
          )}
          {activeSection === "certifications" && (
            <CertificationsEditor content={content} setContent={setContent} />
          )}
          {activeSection === "setup" && (
            <SetupEditor content={content} setContent={setContent} />
          )}
          {activeSection === "gallery" && (
            <GalleryEditor content={content} setContent={setContent} />
          )}
          {activeSection === "contact" && (
            <ContactEditor content={content} setContent={setContent} />
          )}
          {activeSection === "meta" && (
            <MetaEditor content={content} setContent={setContent} />
          )}
        </div>
      </main>
    </div>
  );
}

// ===== EDITORS =====

function HeroEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const hero = content.hero;
  const update = (key: string, value: unknown) => {
    setContent((prev) =>
      prev ? { ...prev, hero: { ...prev.hero, [key]: value } } : prev,
    );
  };

  return (
    <div>
      <Field label="Greeting Text">
        <Input
          value={hero.greeting}
          onChange={(v) => update("greeting", v)}
          placeholder="Hello, I'm"
        />
      </Field>

      <Field label="Full Name">
        <Input
          value={hero.name}
          onChange={(v) => update("name", v)}
          placeholder="Pito Desri Pauzi"
        />
      </Field>

      <Field label="Rotating Titles (one per line)">
        <Textarea
          value={hero.titles.join("\n")}
          onChange={(v) => update("titles", v.split("\n").filter(Boolean))}
          rows={4}
        />
      </Field>

      <Field label="Subtitle">
        <Textarea
          value={hero.subtitle}
          onChange={(v) => update("subtitle", v)}
          rows={3}
        />
      </Field>

      <div className="admin-grid-2col">
        <Field label="CTA Primary Label">
          <Input
            value={hero.ctaPrimary.label}
            onChange={(v) =>
              update("ctaPrimary", { ...hero.ctaPrimary, label: v })
            }
          />
        </Field>
        <Field label="CTA Primary Link (#section)">
          <Input
            value={hero.ctaPrimary.href}
            onChange={(v) =>
              update("ctaPrimary", { ...hero.ctaPrimary, href: v })
            }
          />
        </Field>
        <Field label="CTA Secondary Label">
          <Input
            value={hero.ctaSecondary.label}
            onChange={(v) =>
              update("ctaSecondary", { ...hero.ctaSecondary, label: v })
            }
          />
        </Field>
        <Field label="CTA Secondary Link">
          <Input
            value={hero.ctaSecondary.href}
            onChange={(v) =>
              update("ctaSecondary", { ...hero.ctaSecondary, href: v })
            }
          />
        </Field>
      </div>

      <Field label="Available for Work">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="checkbox"
            id="available"
            checked={hero.availableForWork}
            onChange={(e) => update("availableForWork", e.target.checked)}
            style={{
              width: 18,
              height: 18,
              accentColor: "var(--accent)",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor="available"
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            Show "Available for work" badge on hero
          </label>
        </div>
      </Field>
    </div>
  );
}

function AboutEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const about = content.about;
  const update = (key: string, value: unknown) => {
    setContent((prev) =>
      prev ? { ...prev, about: { ...prev.about, [key]: value } } : prev,
    );
  };

  const updateFact = (i: number, key: string, value: string) => {
    const facts = [...about.facts];
    facts[i] = { ...facts[i], [key]: value };
    update("facts", facts);
  };

  return (
    <div>
      <Field label="Bio (use blank line for paragraph break)">
        <Textarea
          value={about.bio}
          onChange={(v) => update("bio", v)}
          rows={8}
        />
      </Field>

      <div style={{ marginTop: 24 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-mono)",
          }}
        >
          Stats / Facts
        </div>
        <div className="admin-grid-2col">
          {about.facts.map((fact, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="admin-grid-1to2">
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginBottom: 6,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    VALUE
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={fact.value}
                    onChange={(e) => updateFact(i, "value", e.target.value)}
                    style={{
                      cursor: "text",
                      padding: "8px 12px",
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginBottom: 6,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    LABEL
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={fact.label}
                    onChange={(e) => updateFact(i, "label", e.target.value)}
                    style={{
                      cursor: "text",
                      padding: "8px 12px",
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const categories = content.skills.categories;

  const updateCategory = (i: number, key: string, value: unknown) => {
    const cats = [...categories];
    cats[i] = { ...cats[i], [key]: value };
    setContent((prev) =>
      prev ? { ...prev, skills: { categories: cats } } : prev,
    );
  };

  const addCategory = () => {
    const cats = [
      ...categories,
      { name: "New Category", icon: "wrench", items: [] },
    ];
    setContent((prev) =>
      prev ? { ...prev, skills: { categories: cats } } : prev,
    );
  };

  const removeCategory = (i: number) => {
    const cats = categories.filter((_, idx) => idx !== i);
    setContent((prev) =>
      prev ? { ...prev, skills: { categories: cats } } : prev,
    );
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {categories.map((cat, i) => (
          <div
            key={i}
            style={{
              padding: 24,
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: "0 0 80px" }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ICON (emoji)
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={cat.icon}
                  onChange={(e) => updateCategory(i, "icon", e.target.value)}
                  style={{
                    cursor: "text",
                    padding: "8px 12px",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  CATEGORY NAME
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={cat.name}
                  onChange={(e) => updateCategory(i, "name", e.target.value)}
                  style={{ cursor: "text", padding: "8px 12px" }}
                />
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <button
                  onClick={() => removeCategory(i)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 6,
                  fontFamily: "var(--font-mono)",
                }}
              >
                SKILLS (one per line)
              </div>
              <textarea
                className="form-input"
                rows={4}
                value={cat.items.join("\n")}
                onChange={(e) =>
                  updateCategory(
                    i,
                    "items",
                    e.target.value.split("\n").filter(Boolean),
                  )
                }
                style={{ cursor: "text" }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCategory}
        className="btn-secondary"
        style={{ marginTop: 16, cursor: "pointer" }}
      >
        + Add Category
      </button>
    </div>
  );
}

const GRADIENTS = [
  "from-red-500 to-orange-500",
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-teal-500",
  "from-yellow-500 to-orange-500",
  "from-indigo-500 to-purple-500",
];

function ProjectsEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const projects = content.projects;

  const updateProject = (i: number, key: string, value: unknown) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [key]: value };
    setContent((prev) => (prev ? { ...prev, projects: updated } : prev));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      description: "Project description",
      tags: ["React", "Node.js"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      gradient: "from-red-500 to-orange-500",
    };
    setContent((prev) =>
      prev ? { ...prev, projects: [...prev.projects, newProject] } : prev,
    );
  };

  const removeProject = (i: number) => {
    setContent((prev) =>
      prev
        ? { ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }
        : prev,
    );
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {projects.map((project, i) => (
          <div
            key={project.id}
            style={{
              padding: 24,
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Project #{i + 1}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={project.featured}
                    onChange={(e) =>
                      updateProject(i, "featured", e.target.checked)
                    }
                    style={{ accentColor: "var(--accent)" }}
                  />
                  Featured
                </label>
                <button
                  onClick={() => removeProject(i)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="admin-grid-2col">
              <Field label="Title">
                <Input
                  value={project.title}
                  onChange={(v) => updateProject(i, "title", v)}
                />
              </Field>
              <Field label="Gradient Color">
                <select
                  className="form-input"
                  value={project.gradient}
                  onChange={(e) => updateProject(i, "gradient", e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  {GRADIENTS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={project.description}
                onChange={(v) => updateProject(i, "description", v)}
                rows={3}
              />
            </Field>

            <Field label="Tags (comma separated)">
              <Input
                value={project.tags.join(", ")}
                onChange={(v) =>
                  updateProject(
                    i,
                    "tags",
                    v
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Field>

            <div className="admin-grid-2col">
              <Field label="Live URL">
                <Input
                  value={project.liveUrl}
                  onChange={(v) => updateProject(i, "liveUrl", v)}
                />
              </Field>
              <Field label="GitHub URL">
                <Input
                  value={project.githubUrl}
                  onChange={(v) => updateProject(i, "githubUrl", v)}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addProject}
        className="btn-secondary"
        style={{ marginTop: 16, cursor: "pointer" }}
      >
        + Add Project
      </button>
    </div>
  );
}

function ExperienceEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const experience = content.experience;

  const updateExp = (i: number, key: string, value: unknown) => {
    const updated = [...experience];
    updated[i] = { ...updated[i], [key]: value };
    setContent((prev) => (prev ? { ...prev, experience: updated } : prev));
  };

  const addExp = () => {
    const newExp = {
      id: Date.now(),
      role: "New Role",
      company: "Company Name",
      period: "2024 — Present",
      description: "Description of your role and responsibilities.",
      current: false,
    };
    setContent((prev) =>
      prev ? { ...prev, experience: [...prev.experience, newExp] } : prev,
    );
  };

  const removeExp = (i: number) => {
    setContent((prev) =>
      prev
        ? { ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }
        : prev,
    );
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {experience.map((exp, i) => (
          <div
            key={exp.id}
            style={{
              padding: 24,
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: exp.current
                ? "1px solid rgba(225, 29, 72, 0.3)"
                : "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExp(i, "current", e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                Current Position
              </label>
              <button
                onClick={() => removeExp(i)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Remove
              </button>
            </div>

            <div className="admin-grid-3col">
              <Field label="Role">
                <Input
                  value={exp.role}
                  onChange={(v) => updateExp(i, "role", v)}
                />
              </Field>
              <Field label="Company">
                <Input
                  value={exp.company}
                  onChange={(v) => updateExp(i, "company", v)}
                />
              </Field>
              <Field label="Period">
                <Input
                  value={exp.period}
                  onChange={(v) => updateExp(i, "period", v)}
                  placeholder="2023 — Present"
                />
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={exp.description}
                onChange={(v) => updateExp(i, "description", v)}
                rows={3}
              />
            </Field>
          </div>
        ))}
      </div>

      <button
        onClick={addExp}
        className="btn-secondary"
        style={{ marginTop: 16, cursor: "pointer" }}
      >
        + Add Experience
      </button>
    </div>
  );
}

function ContactEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const contact = content.contact;
  const update = (key: string, value: unknown) => {
    setContent((prev) =>
      prev ? { ...prev, contact: { ...prev.contact, [key]: value } } : prev,
    );
  };

  return (
    <div>
      <Field label="Section Heading">
        <Input value={contact.heading} onChange={(v) => update("heading", v)} />
      </Field>

      <Field label="Subheading">
        <Textarea
          value={contact.subheading}
          onChange={(v) => update("subheading", v)}
          rows={3}
        />
      </Field>

      <Field label="Contact Email">
        <Input
          type="email"
          value={contact.email}
          onChange={(v) => update("email", v)}
        />
      </Field>

      <div
        style={{
          marginTop: 24,
          padding: 20,
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-mono)",
          }}
        >
          Social Links
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(["github", "linkedin", "instagram"] as const).map((platform) => (
            <div
              key={platform}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <span
                style={{
                  width: 80,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "capitalize",
                }}
              >
                {platform}
              </span>
              <input
                type="url"
                className="form-input"
                value={contact.social[platform]}
                onChange={(e) =>
                  update("social", {
                    ...contact.social,
                    [platform]: e.target.value,
                  })
                }
                placeholder={`https://${platform}.com/username`}
                style={{ cursor: "text" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetaEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const meta = content.meta;
  const update = (key: string, value: string) => {
    setContent((prev) =>
      prev ? { ...prev, meta: { ...prev.meta, [key]: value } } : prev,
    );
  };

  return (
    <div>
      <Field label="Site Title">
        <Input
          value={meta.siteTitle}
          onChange={(v) => update("siteTitle", v)}
        />
      </Field>

      <Field label="Site Description (SEO)">
        <Textarea
          value={meta.siteDescription}
          onChange={(v) => update("siteDescription", v)}
          rows={3}
        />
      </Field>

      <Field label="Site URL">
        <Input
          type="url"
          value={meta.siteUrl}
          onChange={(v) => update("siteUrl", v)}
        />
      </Field>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: "var(--accent-subtle)",
          border: "1px solid rgba(225, 29, 72, 0.2)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "var(--accent)",
            fontWeight: 600,
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <AlertTriangle size={14} strokeWidth={2} />
          Change Admin Password
        </p>
        <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          To change your admin password, edit the{" "}
          <code
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--bg-secondary)",
              padding: "1px 6px",
              borderRadius: 4,
            }}
          >
            data/content.json
          </code>{" "}
          file and update the{" "}
          <code
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--bg-secondary)",
              padding: "1px 6px",
              borderRadius: 4,
            }}
          >
            admin.passwordHash
          </code>{" "}
          field.
        </p>
      </div>
    </div>
  );
}

function EducationEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const education = content.education || [];

  const updateEdu = (i: number, key: string, value: unknown) => {
    const updated = [...education];
    updated[i] = { ...updated[i], [key]: value };
    setContent((prev) => (prev ? { ...prev, education: updated } : prev));
  };

  const addEdu = () => {
    const newEdu = {
      id: Date.now(),
      degree: "Degree / Program",
      school: "School / University",
      period: "2024 — Present",
      description: "Academic description or achievements.",
    };
    setContent((prev) =>
      prev ? { ...prev, education: [...(prev.education || []), newEdu] } : prev,
    );
  };

  const removeEdu = (i: number) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            education: (prev.education || []).filter((_, idx) => idx !== i),
          }
        : prev,
    );
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {education.map((edu, i) => (
          <div
            key={edu.id}
            style={{
              padding: 24,
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--text-secondary)",
                }}
              >
                Education #{i + 1}
              </span>
              <button
                onClick={() => removeEdu(i)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Remove
              </button>
            </div>

            <div className="admin-grid-3col">
              <Field label="Degree / Program">
                <Input
                  value={edu.degree}
                  onChange={(v) => updateEdu(i, "degree", v)}
                />
              </Field>
              <Field label="School / University">
                <Input
                  value={edu.school}
                  onChange={(v) => updateEdu(i, "school", v)}
                />
              </Field>
              <Field label="Period">
                <Input
                  value={edu.period}
                  onChange={(v) => updateEdu(i, "period", v)}
                  placeholder="2023 — Present"
                />
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={edu.description}
                onChange={(v) => updateEdu(i, "description", v)}
                rows={3}
              />
            </Field>
          </div>
        ))}
      </div>

      <button
        onClick={addEdu}
        className="btn-secondary"
        style={{ marginTop: 16, cursor: "pointer" }}
      >
        + Add Education
      </button>
    </div>
  );
}

function CertificationsEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const certifications = content.certifications || [];

  const updateCert = (i: number, key: string, value: unknown) => {
    const updated = [...certifications];
    updated[i] = { ...updated[i], [key]: value };
    setContent((prev) => (prev ? { ...prev, certifications: updated } : prev));
  };

  const addCert = () => {
    const newCert = {
      id: Date.now(),
      title: "Certification Name",
      issuer: "Credential Issuer",
      date: "2024",
    };
    setContent((prev) =>
      prev
        ? { ...prev, certifications: [...(prev.certifications || []), newCert] }
        : prev,
    );
  };

  const removeCert = (i: number) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            certifications: (prev.certifications || []).filter(
              (_, idx) => idx !== i,
            ),
          }
        : prev,
    );
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {certifications.map((cert, i) => (
          <div
            key={cert.id}
            style={{
              padding: 24,
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--text-secondary)",
                }}
              >
                Certification #{i + 1}
              </span>
              <button
                onClick={() => removeCert(i)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Remove
              </button>
            </div>

            <div className="admin-grid-3col">
              <Field label="Certification Title">
                <Input
                  value={cert.title}
                  onChange={(v) => updateCert(i, "title", v)}
                />
              </Field>
              <Field label="Issuer">
                <Input
                  value={cert.issuer}
                  onChange={(v) => updateCert(i, "issuer", v)}
                />
              </Field>
              <Field label="Year">
                <Input
                  value={cert.date}
                  onChange={(v) => updateCert(i, "date", v)}
                  placeholder="2024"
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCert}
        className="btn-secondary"
        style={{ marginTop: 16, cursor: "pointer" }}
      >
        + Add Certification
      </button>
    </div>
  );
}

function ServicesEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const services = content.services || [];

  const updateSrv = (i: number, key: string, value: unknown) => {
    const updated = [...services];
    updated[i] = { ...updated[i], [key]: value };
    setContent((prev) => (prev ? { ...prev, services: updated } : prev));
  };

  const addSrv = () => {
    const newSrv = {
      id: Date.now(),
      title: "Service Name",
      description: "Service description detailing what you offer.",
    };
    setContent((prev) =>
      prev ? { ...prev, services: [...(prev.services || []), newSrv] } : prev,
    );
  };

  const removeSrv = (i: number) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            services: (prev.services || []).filter((_, idx) => idx !== i),
          }
        : prev,
    );
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {services.map((srv, i) => (
          <div
            key={srv.id}
            style={{
              padding: 24,
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--text-secondary)",
                }}
              >
                Service #{i + 1}
              </span>
              <button
                onClick={() => removeSrv(i)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Remove
              </button>
            </div>

            <Field label="Service Title">
              <Input
                value={srv.title}
                onChange={(v) => updateSrv(i, "title", v)}
              />
            </Field>

            <Field label="Description">
              <Textarea
                value={srv.description}
                onChange={(v) => updateSrv(i, "description", v)}
                rows={3}
              />
            </Field>
          </div>
        ))}
      </div>

      <button
        onClick={addSrv}
        className="btn-secondary"
        style={{ marginTop: 16, cursor: "pointer" }}
      >
        + Add Service
      </button>
    </div>
  );
}

function SetupEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const setup = content.setup || {
    os: "",
    editor: "",
    terminal: "",
    hardware: "",
  };

  const update = (key: string, value: unknown) => {
    setContent((prev) =>
      prev ? { ...prev, setup: { ...prev.setup, [key]: value } } : prev,
    );
  };

  return (
    <div>
      <Field label="Operating System">
        <Input
          value={setup.os}
          onChange={(v) => update("os", v)}
          placeholder="e.g. Linux WSL2 / Windows 11"
        />
      </Field>

      <Field label="Code Editor">
        <Input
          value={setup.editor}
          onChange={(v) => update("editor", v)}
          placeholder="e.g. VS Code Tokyo Night Theme"
        />
      </Field>

      <Field label="Terminal Shell">
        <Input
          value={setup.terminal}
          onChange={(v) => update("terminal", v)}
          placeholder="e.g. Zsh + Oh My Zsh"
        />
      </Field>

      <Field label="Hardware Specs">
        <Input
          value={setup.hardware}
          onChange={(v) => update("hardware", v)}
          placeholder="e.g. Ryzen 7 Laptop, 16GB RAM"
        />
      </Field>
    </div>
  );
}

function GalleryEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const gallery = content.gallery || [];

  const updateItem = (i: number, key: string, value: unknown) => {
    const updated = [...gallery];
    updated[i] = { ...updated[i], [key]: value };
    setContent((prev) => (prev ? { ...prev, gallery: updated } : prev));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      url: "/images/gallery/workspace_setup.png",
      caption: "New gallery image caption",
      date: new Date().toISOString().split("T")[0],
    };
    setContent((prev) =>
      prev ? { ...prev, gallery: [...(prev.gallery || []), newItem] } : prev,
    );
  };

  const removeItem = (i: number) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            gallery: (prev.gallery || []).filter((_, idx) => idx !== i),
          }
        : prev,
    );
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {gallery.map((item, i) => (
          <div
            key={item.id}
            style={{
              padding: 24,
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                IMAGE #{i + 1}
              </h3>
              <button
                onClick={() => removeItem(i)}
                className="admin-hud-button"
                style={{
                  padding: "6px 12px",
                  borderColor: "rgba(239, 68, 68, 0.4)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>

            <div className="admin-grid-2col">
              <Field label="Image URL">
                <Input
                  value={item.url}
                  onChange={(v) => updateItem(i, "url", v)}
                  placeholder="/images/gallery/setup.png"
                />
              </Field>

              <Field label="Date (YYYY-MM-DD)">
                <Input
                  value={item.date}
                  onChange={(v) => updateItem(i, "date", v)}
                  placeholder="2026-06-05"
                />
              </Field>
            </div>

            <Field label="Caption / Description">
              <Textarea
                value={item.caption}
                onChange={(v) => updateItem(i, "caption", v)}
                rows={3}
              />
            </Field>
          </div>
        ))}

        <button
          onClick={addItem}
          className="admin-hud-button"
          style={{
            padding: "12px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          Add New Image
        </button>
      </div>
    </div>
  );
}

// ===== SYSTEM MONITOR & CONTROL DECK COMPONENTS =====

function DashboardOverview({
  content,
  onSectionSelect,
  latency,
  cpuLoad,
  ramLoad,
  password,
}: {
  content: ContentData;
  onSectionSelect: (section: string) => void;
  latency: number;
  cpuLoad: number;
  ramLoad: number;
  password?: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data.slice(0, 4)))
      .catch(() => {});
  }, []);

  const totalProjects = content.projects?.length || 0;
  const featuredProjects =
    content.projects?.filter((p) => p.featured).length || 0;
  const totalServices = content.services?.length || 0;

  // Retro modules count
  let activeRetroCount = 0;
  if (content.features?.crtEnabled) activeRetroCount++;
  if (content.features?.biosBootEnabled) activeRetroCount++;
  if (content.features?.contextMenuEnabled) activeRetroCount++;
  if (content.features?.devConsoleWarningEnabled) activeRetroCount++;
  if (content.features?.synthSoundboardEnabled) activeRetroCount++;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ASCII Art & Operator Info Banner */}
      <div
        className="admin-hud-card"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,10,12,0.8) 0%, rgba(20,20,30,0.5) 100%)",
          borderColor: "rgba(225,29,72,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                lineHeight: 1.1,
                color: "var(--accent)",
                margin: 0,
                textShadow: "0 0 8px rgba(225,29,72,0.3)",
              }}
            >{`
██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ 
            `}</pre>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                marginTop: 12,
                color: "var(--text-primary)",
              }}
            >
              PORTFOLIO CORE MAINFRAME v4.01
            </h2>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                marginTop: 4,
              }}
            >
              Operator Terminal active. Security protocols secure. System
              listening...
            </p>
          </div>
          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "12px 16px",
              border: "1px dashed var(--border)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              minWidth: 220,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>SESSION STAT:</span>
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                AUTHORIZED
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>ACCESS_LEVEL:</span>
              <span style={{ color: "var(--accent)" }}>ROOT_ADMIN</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>SERVER HOST:</span>
              <span style={{ color: "var(--text-primary)" }}>
                NextJS Runtime
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="admin-hud-grid">
        <div className="admin-hud-card">
          <div className="admin-hud-title">
            <Cpu size={14} style={{ color: "var(--accent)" }} /> System
            Telemetry
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                PROCESSOR LOAD:
              </span>
              <span>{cpuLoad}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                MEMORY UTILITY:
              </span>
              <span>{ramLoad}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>NODE_ENV MODE:</span>
              <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                production
              </span>
            </div>
          </div>
        </div>

        <div className="admin-hud-card">
          <div className="admin-hud-title">
            <Sliders size={14} style={{ color: "var(--accent)" }} /> Interactive
            Core
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                SYSTEM FEATURES:
              </span>
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                {activeRetroCount} / 5 ONLINE
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                CRT PHOSPHOR DRV:
              </span>
              <span>
                {content.features?.crtEnabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                8-BIT SYNTH CORE:
              </span>
              <span>
                {content.features?.synthSoundboardEnabled
                  ? "ONLINE"
                  : "OFFLINE"}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-hud-card">
          <div className="admin-hud-title">
            <MessageSquare size={14} style={{ color: "var(--accent)" }} />{" "}
            Message Stats
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                RECENT POSTS LOGGED:
              </span>
              <span style={{ color: "#3b82f6", fontWeight: "bold" }}>
                ONLINE
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                DATABASE STATUS:
              </span>
              <span style={{ color: "#10b981" }}>SYNCHRONIZED</span>
            </div>
            <button
              onClick={() => onSectionSelect("guestbook")}
              className="admin-hud-button"
              style={{
                width: "100%",
                padding: "5px 0",
                fontSize: 10,
                marginTop: 4,
              }}
            >
              Open Message Manager →
            </button>
          </div>
        </div>

        <div className="admin-hud-card">
          <div className="admin-hud-title">
            <HardDrive size={14} style={{ color: "var(--accent)" }} /> Portfolio
            Schema
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                COMPLETED PROJECTS:
              </span>
              <span>
                {totalProjects} ({featuredProjects} Featured)
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                SERVICES REGISTERED:
              </span>
              <span>{totalServices} Active</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                HARDWARE REGISTRY:
              </span>
              <span style={{ color: "#10b981" }}>CONFIGURED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: Transmission log & actions */}
      <div className="admin-grid-sidebar" style={{ contentVisibility: "auto" }}>
        {/* Left Col: Live Transmission Feeds */}
        <div className="admin-hud-card">
          <div className="admin-hud-title">
            <Terminal size={14} style={{ color: "var(--accent)" }} /> Recent
            Guestbook Transmissions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 ? (
              <div
                style={{
                  padding: 12,
                  border: "1px dashed var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-muted)",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                No visitor entries registered in guestbook.
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: "10px 14px",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: "bold",
                        color: "var(--text-primary)",
                      }}
                    >
                      {m.name}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--text-muted)" }}>
                      {new Date(m.timestamp).toLocaleTimeString("id-ID")}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      fontStyle: "italic",
                    }}
                  >
                    "{m.message}"
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Console Beeps / Tests */}
        <div className="admin-hud-card">
          <div className="admin-hud-title">
            <Activity size={14} style={{ color: "var(--accent)" }} /> Mainframe
            Diagnostics
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  const state = localStorage.getItem("soundEnabled") === "true";
                  localStorage.setItem(
                    "soundEnabled",
                    state ? "false" : "true",
                  );
                  playSound(state ? 220 : 660, 0.15, "triangle");
                  window.dispatchEvent(new Event("storage"));
                }
              }}
              className="admin-hud-button"
              style={{
                justifyContent: "flex-start",
                width: "100%",
                fontSize: 11,
              }}
            >
              🔊 Toggle Core Beeps
            </button>

            <button
              onClick={() => {
                playSound(987.77, 0.05, "sawtooth");
                setTimeout(() => playSound(1318.51, 0.1, "sine"), 60);
              }}
              className="admin-hud-button"
              style={{
                justifyContent: "flex-start",
                width: "100%",
                fontSize: 11,
              }}
            >
              📣 Ping Speaker
            </button>

            <button
              onClick={() => {
                console.warn(
                  "%c⚠️ RETRO TELEMETRY SECURITY WARNING ⚠️",
                  "color: #ef4444; font-size: 16px; font-family: monospace; font-weight: bold;",
                );
                playSound(100, 0.5, "sawtooth");
                alert(
                  "Security warning triggered in inspect tools console (Press F12 to check).",
                );
              }}
              className="admin-hud-button"
              style={{
                justifyContent: "flex-start",
                width: "100%",
                fontSize: 11,
              }}
            >
              🚨 Test console alarm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesEditor({
  content,
  setContent,
}: {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
}) {
  const features = content.features || {
    crtEnabled: true,
    biosBootEnabled: true,
    biosBootDuration: 4.5,
    biosTitle: "AMIBIOS (C) 1985 American Megatrends, Inc.",
    biosLines: [
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
    ],
    contextMenuEnabled: true,
    glitchEffectEnabled: true,
    devConsoleWarningEnabled: true,
    devConsoleWarningTitle: "⚠️ ATTENTION / PERINGATAN ⚠️",
    devConsoleWarningText:
      "Security alarm! Inspecting developer elements is forbidden.",
    synthSoundboardEnabled: true,
    floppyDiskDefaultTheme: "cyan",
    audioVolume: 0.2,
  };

  const update = (key: string, value: unknown) => {
    setContent((prev) =>
      prev ? { ...prev, features: { ...features, [key]: value } } : prev,
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* CRT Display Panel */}
      <div className="admin-hud-card" style={{ padding: 20 }}>
        <div
          className="admin-hud-title"
          style={{ fontSize: 13, marginBottom: 12 }}
        >
          <Monitor size={14} style={{ color: "var(--accent)" }} /> Phosphor CRT
          Simulation Panel
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="checkbox"
              id="crtEnabled"
              checked={features.crtEnabled}
              onChange={(e) => {
                update("crtEnabled", e.target.checked);
                if (
                  typeof window !== "undefined" &&
                  localStorage.getItem("soundEnabled") === "true"
                ) {
                  playSound(880, 0.05, "sine");
                }
              }}
              style={{
                width: 18,
                height: 18,
                accentColor: "var(--accent)",
                cursor: "pointer",
              }}
            />
            <div>
              <label
                htmlFor="crtEnabled"
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                Enable Scanline Curvature & Flickering overlay by default
              </label>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Injects custom scanline overlay grid and dynamic flickering
                behaviors to recreate an authentic retro computer screen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BIOS Loading Panel */}
      <div className="admin-hud-card" style={{ padding: 20 }}>
        <div
          className="admin-hud-title"
          style={{ fontSize: 13, marginBottom: 12 }}
        >
          <Terminal size={14} style={{ color: "var(--accent)" }} /> Retro
          AMIBIOS Loading Sequence
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="checkbox"
              id="biosBootEnabled"
              checked={features.biosBootEnabled}
              onChange={(e) => {
                update("biosBootEnabled", e.target.checked);
                if (
                  typeof window !== "undefined" &&
                  localStorage.getItem("soundEnabled") === "true"
                ) {
                  playSound(880, 0.05, "sine");
                }
              }}
              style={{
                width: 18,
                height: 18,
                accentColor: "var(--accent)",
                cursor: "pointer",
              }}
            />
            <div>
              <label
                htmlFor="biosBootEnabled"
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                Show BIOS loading screen on initial visit (Once per session)
              </label>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Prints diagnostic hardware tests with 8-bit disk read clicking
                noises on first loading page.
              </p>
            </div>
          </div>

          <div className="admin-grid-sidebar" style={{ marginTop: 4 }}>
            <Field label="BIOS Firmware Header">
              <input
                type="text"
                className="admin-hud-input"
                value={features.biosTitle}
                onChange={(e) => update("biosTitle", e.target.value)}
              />
            </Field>
            <Field label="Simulation Duration (Seconds)">
              <input
                type="number"
                step="0.5"
                min="1"
                max="12"
                className="admin-hud-input"
                value={features.biosBootDuration}
                onChange={(e) =>
                  update("biosBootDuration", parseFloat(e.target.value) || 4.5)
                }
              />
            </Field>
          </div>

          <Field label="Boot Logs (One message per line)">
            <textarea
              className="admin-hud-input"
              rows={6}
              value={features.biosLines.join("\n")}
              onChange={(e) =>
                update("biosLines", e.target.value.split("\n").filter(Boolean))
              }
            />
          </Field>
        </div>
      </div>

      {/* Context Menu Warning Shield */}
      <div className="admin-hud-card" style={{ padding: 20 }}>
        <div
          className="admin-hud-title"
          style={{ fontSize: 13, marginBottom: 12 }}
        >
          <Shield size={14} style={{ color: "var(--accent)" }} /> Custom Context
          Menu & security warning shields
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="admin-grid-2col">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                id="contextMenuEnabled"
                checked={features.contextMenuEnabled}
                onChange={(e) => update("contextMenuEnabled", e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--accent)" }}
              />
              <label
                htmlFor="contextMenuEnabled"
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                Enable Custom Context Menu
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                id="glitchEffectEnabled"
                checked={features.glitchEffectEnabled}
                onChange={(e) =>
                  update("glitchEffectEnabled", e.target.checked)
                }
                style={{ width: 16, height: 16, accentColor: "var(--accent)" }}
              />
              <label
                htmlFor="glitchEffectEnabled"
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                Enable context right click screen-glitch
              </label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderTop: "1px dashed var(--border)",
              paddingTop: 14,
              marginTop: 4,
            }}
          >
            <input
              type="checkbox"
              id="devConsoleWarningEnabled"
              checked={features.devConsoleWarningEnabled}
              onChange={(e) =>
                update("devConsoleWarningEnabled", e.target.checked)
              }
              style={{
                width: 18,
                height: 18,
                accentColor: "var(--accent)",
                cursor: "pointer",
              }}
            />
            <div>
              <label
                htmlFor="devConsoleWarningEnabled"
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                Show attention overlay modal when inspector console opens
              </label>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Detects DevTools activation and sounds retro alarms while
                prompting warning details.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <Field label="Dev Warning Title Header">
              <input
                type="text"
                className="admin-hud-input"
                value={features.devConsoleWarningTitle}
                onChange={(e) =>
                  update("devConsoleWarningTitle", e.target.value)
                }
              />
            </Field>

            <Field label="Dev Warning Message Box text">
              <textarea
                className="admin-hud-input"
                rows={3}
                value={features.devConsoleWarningText}
                onChange={(e) =>
                  update("devConsoleWarningText", e.target.value)
                }
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Synthesizer & Floppy Theme config */}
      <div className="admin-hud-card" style={{ padding: 20 }}>
        <div
          className="admin-hud-title"
          style={{ fontSize: 13, marginBottom: 12 }}
        >
          <Volume2 size={14} style={{ color: "var(--accent)" }} /> Soundboard
          synth & terminal system theme
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="checkbox"
              id="synthSoundboardEnabled"
              checked={features.synthSoundboardEnabled}
              onChange={(e) =>
                update("synthSoundboardEnabled", e.target.checked)
              }
              style={{
                width: 18,
                height: 18,
                accentColor: "var(--accent)",
                cursor: "pointer",
              }}
            />
            <div>
              <label
                htmlFor="synthSoundboardEnabled"
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                Activate 8-bit Synth soundboard drawer inside terminal
              </label>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Permits typing letters on the keyboard inside the console tray
                to generate retro square/saw notes.
              </p>
            </div>
          </div>

          <div className="admin-grid-2col" style={{ marginTop: 4 }}>
            <Field label="Default Floppy Theme disk">
              <select
                className="admin-hud-input"
                value={features.floppyDiskDefaultTheme}
                onChange={(e) =>
                  update("floppyDiskDefaultTheme", e.target.value)
                }
                style={{ cursor: "pointer", background: "rgba(0,0,0,0.5)" }}
              >
                <option value="green">Emerald Matrix (Green Terminal)</option>
                <option value="cyan">Cyberpunk (Cyan Phosphor)</option>
                <option value="amber">VT100 (Amber Phosphor)</option>
                <option value="blue">IBM Vintage (Classic Blue)</option>
                <option value="red">Radical Rose (Cyber Rose)</option>
              </select>
            </Field>

            <Field label="Default sound volume (0.0 to 1.0)">
              <input
                type="number"
                min="0.0"
                max="1.0"
                step="0.05"
                className="admin-hud-input"
                value={features.audioVolume}
                onChange={(e) =>
                  update("audioVolume", parseFloat(e.target.value) || 0.2)
                }
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestbookModerator({ password }: { password?: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch {
      console.error("Failed to load messages");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this guestbook message?"))
      return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        playSound(220, 0.1, "triangle");
      } else {
        alert("Failed to delete message. Unauthorized.");
      }
    } catch {
      alert("Network error. Failed to delete message.");
    }
    setDeletingId(null);
  };

  return (
    <div>
      <p
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          marginBottom: 20,
          fontFamily: "var(--font-mono)",
        }}
      >
        Moderate guestbook transmissions submitted by viewers. Updates are
        instantly updated on database files.
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Loader2
            size={24}
            className="spin"
            style={{ margin: "0 auto 12px", color: "var(--accent)" }}
          />
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Reading comments...
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            border: "1px dashed var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            fontSize: 12,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
          }}
        >
          No guestbook logs present in database storage.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              className="admin-comment-card"
              style={{
                padding: "16px",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                fontFamily: "var(--font-mono)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "baseline",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      color: "var(--text-primary)",
                    }}
                  >
                    {m.name}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {new Date(m.timestamp).toLocaleString("id-ID")}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "var(--text-muted)",
                      background: "rgba(255,255,255,0.03)",
                      padding: "1px 5px",
                      borderRadius: 4,
                    }}
                  >
                    ID: {m.id}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    marginTop: 2,
                  }}
                >
                  "{m.message}"
                </div>
              </div>
              <button
                onClick={() => handleDelete(m.id)}
                disabled={deletingId === m.id}
                className="admin-hud-button"
                style={{
                  padding: "6px 12px",
                  background: "rgba(239, 68, 68, 0.1)",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  fontSize: 11,
                }}
              >
                {deletingId === m.id ? (
                  <Loader2 size={12} className="spin" />
                ) : (
                  <>
                    <Trash2 size={12} /> Delete
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .admin-comment-card {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .admin-comment-card button {
            align-self: flex-end;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}
