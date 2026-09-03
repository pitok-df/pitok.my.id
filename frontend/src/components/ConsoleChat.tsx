"use client";

import { GraduationCap, Mail, Send, Terminal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Local brand icon components since brand icons are not in this Lucide version
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

const Linkedin = ({ size, ...props }: IconProps) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ size, ...props }: IconProps) => (
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
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function ConsoleChat({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages([
      {
        sender: "bot",
        text: "Koneksi berhasil.\nHai, saya asisten virtual Pito. Mau tahu apa tentang Pito? Silakan ketik pertanyaan Anda atau klik menu cepat di bawah ini.",
        timestamp: time,
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setIsTyping(true);

    // Simulate typing delay based on reply length
    setTimeout(() => {
      let reply = "";

      if (
        cleanCmd === "/help" ||
        cleanCmd === "help" ||
        cleanCmd === "bantuan"
      ) {
        reply =
          "Berikut beberapa menu pintas yang bisa Anda ketik atau klik langsung:\n\n• /about - Tentang profil diri Pito\n• /skills - Keahlian & teknologi stack\n• /projects - Portofolio proyek pilihan\n• /contact - Email dan sosial media\n• /pet neko | robo - Berinteraksi dengan maskot\n• /feed neko - Memberi makan maskot Neko\n• /charge robo - Mengisi daya baterai maskot Robo\n• /clear - Membersihkan riwayat layar";
      } else if (cleanCmd === "/pet neko" || cleanCmd.includes("pet neko")) {
        window.dispatchEvent(
          new CustomEvent("mascot-action", {
            detail: { action: "pet", target: "neko" },
          }),
        );
        reply =
          "Menerima instruksi petting.\n\n🐾 Neko merespons: Nyaaa~ Elusanmu terasa hangat di pikselku.";
      } else if (
        cleanCmd === "/feed neko" ||
        cleanCmd.includes("feed neko") ||
        cleanCmd.includes("makan neko")
      ) {
        window.dispatchEvent(
          new CustomEvent("mascot-action", {
            detail: { action: "feed", target: "neko" },
          }),
        );
        reply =
          "Menerima instruksi makan.\n\n🐟 Neko merespons: Nyam nyam... Ikan digital ini sangat lezat!";
      } else if (cleanCmd === "/pet robo" || cleanCmd.includes("pet robo")) {
        window.dispatchEvent(
          new CustomEvent("mascot-action", {
            detail: { action: "pet", target: "robo" },
          }),
        );
        reply =
          "Menerima instruksi petting.\n\n🤖 Robo merespons: BEEP! Sensor haptic mendeteksi sentuhan bersahabat.";
      } else if (
        cleanCmd === "/charge robo" ||
        cleanCmd.includes("charge robo") ||
        cleanCmd.includes("cas robo")
      ) {
        window.dispatchEvent(
          new CustomEvent("mascot-action", {
            detail: { action: "charge", target: "robo" },
          }),
        );
        reply =
          "Menerima instruksi pengisian daya.\n\n⚡ Robo merespons: BEEP BOOP! Voltase input 5V masuk. Kapasitas baterai: 100%.";
      } else if (
        cleanCmd === "/about" ||
        cleanCmd.includes("about") ||
        cleanCmd.includes("siapa") ||
        cleanCmd.includes("pito") ||
        cleanCmd.includes("bio") ||
        cleanCmd.includes("profil")
      ) {
        reply = `Tentang Pito:\n\n${data.about.bio}\n\n[icon:GraduationCap] Saat ini kuliah di Politeknik Negeri Padang (Semester 6).`;
      } else if (
        cleanCmd === "/skills" ||
        cleanCmd.includes("skill") ||
        cleanCmd.includes("stack") ||
        cleanCmd.includes("teknologi") ||
        cleanCmd.includes("bahasa") ||
        cleanCmd.includes("bisa apa")
      ) {
        const cats = data.skills.categories
          .map((c: any) => `  [${c.name}]: ${c.items.join(", ")}`)
          .join("\n");
        reply = `Teknologi yang biasa Pito gunakan:\n\n${cats}`;
      } else if (
        cleanCmd === "/projects" ||
        cleanCmd.includes("project") ||
        cleanCmd.includes("proyek") ||
        cleanCmd.includes("karya") ||
        cleanCmd.includes("portofolio")
      ) {
        const projs = data.projects
          .map((p: any) => `• ${p.title}\n  ${p.description}`)
          .join("\n\n");
        reply = `Proyek Pilihan:\n\n${projs}`;
      } else if (
        cleanCmd === "/contact" ||
        cleanCmd.includes("contact") ||
        cleanCmd.includes("kontak") ||
        cleanCmd.includes("email") ||
        cleanCmd.includes("sosmed") ||
        cleanCmd.includes("instagram") ||
        cleanCmd.includes("linkedin")
      ) {
        reply = `Yuk terhubung langsung dengan Pito:\n\n[icon:Mail] Email: ${data.contact.email}\n[icon:Github] GitHub: github.com/PitokDf\n[icon:Linkedin] LinkedIn: linkedin.com/in/pito-desri-pauzi-181052314\n[icon:Instagram] Instagram: @pitokdesmul`;
      } else if (
        cleanCmd === "/clear" ||
        cleanCmd === "clear" ||
        cleanCmd === "bersih"
      ) {
        setMessages([]);
        setIsTyping(false);
        return;
      } else {
        reply =
          "Hmm, saya kurang paham maksudnya. Coba ketik '/help' untuk melihat daftar perintah, atau langsung hubungi Pito via email di " +
          data.contact.email;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, timestamp: time },
      ]);
      setIsTyping(false);
    }, 800); // 800ms natural delay
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, timestamp: time },
    ]);
    setInput("");
    handleCommand(userMsg);
  };

  const triggerQuickAction = (cmd: string) => {
    if (isTyping) return;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: cmd, timestamp: time },
    ]);
    handleCommand(cmd);
  };

  const quickActions = [
    { label: "/about", value: "/about" },
    { label: "/skills", value: "/skills" },
    { label: "/projects", value: "/projects" },
    { label: "/contact", value: "/contact" },
  ];

  const renderMessageText = (text: string) => {
    const parts = text.split(/(\[icon:\w+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/^\[icon:(\w+)\]$/);
      if (match) {
        const iconName = match[1];
        const iconStyle = {
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: 4,
          color: "var(--accent)",
        };
        switch (iconName) {
          case "GraduationCap":
            return <GraduationCap key={index} size={14} style={iconStyle} />;
          case "Mail":
            return <Mail key={index} size={14} style={iconStyle} />;
          case "Github":
            return <Github key={index} size={14} style={iconStyle} />;
          case "Linkedin":
            return <Linkedin key={index} size={14} style={iconStyle} />;
          case "Instagram":
            return <Instagram key={index} size={14} style={iconStyle} />;
          default:
            return null;
        }
      }
      return part;
    });
  };

  return (
    <div className="console-chat-wrapper">
      {/* Minimized Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="console-chat-bubble card"
          aria-label="Open Console"
        >
          <Terminal size={14} style={{ color: "var(--accent)" }} />
          <span className="pulse-indicator" />
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            ASK ME
          </span>
        </button>
      )}

      {/* Expanded Console Window */}
      {isOpen && (
        <div className="console-chat-window card">
          {/* Header */}
          <div className="console-chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Terminal size={14} style={{ color: "var(--accent)" }} />
              <span className="console-header-title">pitok_console.sh</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="console-close-btn"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages Logs Area */}
          <div className="console-chat-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`console-message-row ${msg.sender} reveal-msg`}
              >
                <span className="console-msg-prefix">
                  {msg.sender === "user" ? "$ " : "> "}
                </span>
                <span className="console-msg-text">
                  {renderMessageText(msg.text)}
                </span>
                <span className="console-msg-time">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="console-message-row bot is-typing">
                <span className="console-msg-prefix">&gt; </span>
                <span className="typing-dots">sedang mengetik...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Click Menu Chips */}
          <div className="console-quick-chips">
            {quickActions.map((act) => (
              <button
                key={act.label}
                onClick={() => triggerQuickAction(act.value)}
                disabled={isTyping}
                className="console-chip"
              >
                {act.label}
              </button>
            ))}
          </div>

          {/* Command input prompt */}
          <form onSubmit={handleSend} className="console-chat-input-area">
            <span className="console-input-prefix">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan / '/help'..."
              className="console-input-field"
              disabled={isTyping}
              autoFocus
            />
            <button
              type="submit"
              className="console-send-btn"
              disabled={isTyping}
              aria-label="Send"
            >
              <Terminal size={12} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .console-chat-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 99999;
        }
        .console-chat-bubble {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-card);
          color: var(--text-primary);
          border-color: var(--border-strong);
          border-radius: var(--radius-sm);
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }
        .console-chat-bubble:hover {
          border-color: var(--accent);
        }
        .pulse-indicator {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4);
          animation: pulse-ring 2s infinite;
        }
        .console-chat-window {
          width: 330px;
          height: 400px;
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border-color: var(--border-strong);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .console-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
        }
        .console-header-title {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .console-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .console-close-btn:hover {
          color: var(--text-primary);
        }
        .console-chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          line-height: 1.5;
          background: var(--bg-primary);
        }
        .console-message-row {
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .reveal-msg {
          animation: slide-msg 0.2s ease-out forwards;
        }
        @keyframes slide-msg {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .console-message-row.user {
          color: var(--text-primary);
        }
        .console-message-row.bot {
          color: var(--text-secondary);
          white-space: pre-line;
        }
        .console-msg-prefix {
          font-weight: 700;
          color: var(--accent);
          display: inline-block;
          margin-bottom: 2px;
        }
        .console-msg-text {
          word-break: break-word;
        }
        .console-msg-time {
          font-size: 8px;
          color: var(--text-muted);
          margin-top: 4px;
          align-self: flex-end;
        }
        .console-quick-chips {
          display: flex;
          gap: 6px;
          padding: 8px 12px;
          background: var(--bg-primary);
          border-top: 1px dashed var(--border);
          overflow-x: auto;
          white-space: nowrap;
        }
        /* Hide scrollbar for quick action chips */
        .console-quick-chips::-webkit-scrollbar {
          display: none;
        }
        .console-chip {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 3px 8px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .console-chip:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--text-primary);
        }
        .console-chat-input-area {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
          gap: 8px;
        }
        .console-input-prefix {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          color: var(--accent);
        }
        .console-input-field {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .console-send-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .console-send-btn:hover:not(:disabled) {
          color: var(--text-primary);
        }
        .typing-dots {
          color: var(--text-muted);
          font-style: italic;
          animation: blink-typing 1.4s infinite;
        }
        @keyframes blink-typing {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(225, 29, 72, 0); }
          100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
      `}</style>
    </div>
  );
}
