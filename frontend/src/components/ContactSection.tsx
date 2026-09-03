"use client";

import { AlertCircle, Check, ExternalLink, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import ParticlesBackground from "./ParticlesBackground";
import ScrollReveal from "./ScrollReveal";

interface ContactData {
  heading: string;
  subheading: string;
  email: string;
  social: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

export default function ContactSection({ data }: { data: ContactData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate sending (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
    );
    window.open(`mailto:${data.email}?subject=${subject}&body=${body}`);

    setStatus("sent");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus("idle"), 4000);
  };

  const socialLinks = [
    {
      label: "GitHub",
      url: data.social.github,
    },
    {
      label: "LinkedIn",
      url: data.social.linkedin,
    },
    {
      label: "Instagram",
      url: data.social.instagram,
    },
  ].filter((s) => s.url);

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ position: "relative" }}
    >
      <ParticlesBackground />
      <div className="section-container">
        <div className="contact-layout">
          {/* Left Column: Heading & Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ScrollReveal direction="left">
              <div className="section-label">Contact</div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={100}>
              <h2 className="heading-lg">Get In Touch</h2>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={150}>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: 320,
                  marginBottom: 16,
                }}
              >
                {data.subheading}
              </p>
            </ScrollReveal>

            {/* Email & Social Link Lists */}
            <ScrollReveal direction="left" delay={200}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  borderTop: "1px solid var(--border)",
                  paddingTop: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Mail size={14} style={{ color: "var(--text-secondary)" }} />
                  <a
                    href={`mailto:${data.email}`}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                    }}
                    className="contact-link-hover"
                  >
                    {data.email}
                  </a>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Follow:
                  </span>
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: 1,
                      }}
                      className="contact-link-hover"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Form */}
          <ScrollReveal direction="right">
            <div className="card" style={{ padding: "24px" }}>
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="contact-name">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className="form-input"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="contact-email">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className="form-input"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    className="form-input"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    className="form-input"
                    rows={4}
                    placeholder="Message Details..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === "sending" || status === "sent"}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    opacity:
                      status === "sending" || status === "sent" ? 0.8 : 1,
                  }}
                >
                  {status === "idle" && <>Send Message</>}
                  {status === "sending" && (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: "spin 0.8s linear infinite" }}
                      />
                      Sending...
                    </>
                  )}
                  {status === "sent" && (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      Message Sent
                    </>
                  )}
                  {status === "error" && (
                    <>
                      <AlertCircle size={14} strokeWidth={2} />
                      Failed
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 64px;
          align-items: start;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .contact-link-hover {
          transition: all var(--transition-fast);
        }
        .contact-link-hover:hover {
          color: var(--text-primary) !important;
          border-color: var(--text-primary) !important;
        }
        @media (max-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
