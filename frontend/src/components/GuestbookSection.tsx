"use client";

import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  PlusCircle,
  Search,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import ParticlesBackground from "./ParticlesBackground";
import ScrollReveal from "./ScrollReveal";

interface Reply {
  id: number;
  name: string;
  replyTo: string | null;
  message: string;
  timestamp: string;
}

interface Topic {
  id: number;
  title: string;
  description: string;
  creator: string;
  timestamp: string;
  replies: Reply[];
}

export default function GuestbookSection() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(3);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Collapsible Form State
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New Topic Form States
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCreator, setNewCreator] = useState("");
  const [topicSubmitting, setTopicSubmitting] = useState(false);
  const [topicStatus, setTopicStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Reply Forms States (mapped by topicId)
  const [replyNames, setReplyNames] = useState<Record<number, string>>({});
  const [replyMessages, setReplyMessages] = useState<Record<number, string>>(
    {},
  );
  const [replySubmitting, setReplySubmitting] = useState<
    Record<number, boolean>
  >({});

  // Active Reply Target States (mapped by topicId, stores user name)
  const [activeReplyTargets, setActiveReplyTargets] = useState<
    Record<number, string | null>
  >({});

  // Fetch topics and nested replies
  const fetchTopics = async () => {
    try {
      const res = await fetch("/api/topics");
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
      }
    } catch (err) {
      console.error("Error loading discussion topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Create new topic
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newCreator.trim()) return;

    setTopicSubmitting(true);
    setTopicStatus(null);

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          title: newTitle,
          description: newDesc,
          creator: newCreator,
        }),
      });

      if (res.ok) {
        const newTopic = await res.json();
        setTopics((prev) => [newTopic, ...prev]);
        setNewTitle("");
        setNewDesc("");
        setTopicStatus({
          type: "success",
          text: "Topic created successfully!",
        });
        setShowCreateForm(false); // Close form on success
        setTimeout(() => setTopicStatus(null), 3000);
      } else {
        const errorData = await res.json();
        setTopicStatus({
          type: "error",
          text: errorData.error || "Failed to create topic",
        });
      }
    } catch (err) {
      setTopicStatus({
        type: "error",
        text: "Connection error. Please try again.",
      });
    } finally {
      setTopicSubmitting(false);
    }
  };

  // Reply to specific topic / user
  const handlePostReply = async (e: React.FormEvent, topicId: number) => {
    e.preventDefault();
    const name = replyNames[topicId] || "";
    const msg = replyMessages[topicId] || "";
    const targetUser = activeReplyTargets[topicId] || null;

    if (!name.trim() || !msg.trim()) return;

    setReplySubmitting((prev) => ({ ...prev, [topicId]: true }));

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          topicId,
          name,
          message: msg,
          replyTo: targetUser,
        }),
      });

      if (res.ok) {
        const newReply = await res.json();

        // Update local state to inject new reply
        setTopics((prev) =>
          prev.map((t) => {
            if (t.id === topicId) {
              return { ...t, replies: [...t.replies, newReply] };
            }
            return t;
          }),
        );

        // Clear input message & target reply
        setReplyMessages((prev) => ({ ...prev, [topicId]: "" }));
        setActiveReplyTargets((prev) => ({ ...prev, [topicId]: null }));
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setReplySubmitting((prev) => ({ ...prev, [topicId]: false }));
    }
  };

  const selectReplyTarget = (topicId: number, targetName: string) => {
    setActiveReplyTargets((prev) => ({
      ...prev,
      [topicId]: targetName,
    }));
  };

  const clearReplyTarget = (topicId: number) => {
    setActiveReplyTargets((prev) => ({
      ...prev,
      [topicId]: null,
    }));
  };

  // Relevance scoring algorithm
  const getSearchScore = (topic: Topic, query: string): number => {
    const q = query.toLowerCase().trim();
    if (!q) return 1;

    let score = 0;

    if (topic.title.toLowerCase().includes(q)) {
      score += 15;
      if (topic.title.toLowerCase() === q) score += 10;
    } else {
      const words = q.split(/\s+/);
      words.forEach((word) => {
        if (topic.title.toLowerCase().includes(word)) score += 4;
      });
    }

    if (topic.description.toLowerCase().includes(q)) {
      score += 8;
    } else {
      const words = q.split(/\s+/);
      words.forEach((word) => {
        if (topic.description.toLowerCase().includes(word)) score += 2;
      });
    }

    if (topic.creator.toLowerCase().includes(q)) {
      score += 5;
    }

    topic.replies.forEach((reply) => {
      if (reply.name.toLowerCase().includes(q)) {
        score += 3;
      }
      if (reply.message.toLowerCase().includes(q)) {
        score += 3;
      }
    });

    return score;
  };

  const getFilteredTopics = () => {
    const query = searchQuery.trim();
    if (!query) return topics;

    return topics
      .map((t) => ({ ...t, _score: getSearchScore(t, query) }))
      .filter((t) => t._score > 0)
      .sort((a, b) => b._score - a._score);
  };

  const filteredTopics = getFilteredTopics();

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <section
      id="guestbook"
      className="section-padding min-h-dvh"
      style={{ position: "relative", borderBottom: "1px solid var(--border)" }}
    >
      <ParticlesBackground />
      <div className="section-container">
        {/* Header Block */}
        <div style={{ marginBottom: 32 }}>
          <ScrollReveal>
            <div className="section-label">Discussion</div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <h2 className="heading-lg" style={{ margin: 0 }}>
                Live Discussion Board
              </h2>

              {/* Action Buttons Panel */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {/* Search Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: 240,
                  }}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discussions..."
                    style={{
                      width: "100%",
                      padding: "6px 12px 6px 28px",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "2px",
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                  />
                  <Search
                    size={12}
                    style={{
                      position: "absolute",
                      left: 8,
                      color: "var(--text-muted)",
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: 8,
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>

                {/* Create Topic Toggle Button */}
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="btn-secondary"
                  style={{
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                  }}
                >
                  {showCreateForm ? <X size={12} /> : <PlusCircle size={12} />}
                  {showCreateForm ? "CLOSE FORM" : "NEW DISCUSSION"}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Collapsible New Topic Form */}
        {showCreateForm && (
          <ScrollReveal>
            <div
              className="card"
              style={{
                padding: "24px",
                background: "var(--bg-secondary)",
                marginBottom: 32,
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <form
                onSubmit={handleCreateTopic}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: 8,
                    marginBottom: 4,
                  }}
                >
                  Create New Thread
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.2fr",
                    gap: 16,
                  }}
                  className="create-topic-row"
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="topic-creator">
                      Username / Nama
                    </label>
                    <input
                      id="topic-creator"
                      type="text"
                      maxLength={30}
                      className="form-input"
                      placeholder="Nama Anda"
                      value={newCreator}
                      onChange={(e) => setNewCreator(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="topic-title">
                      Judul Diskusi
                    </label>
                    <input
                      id="topic-title"
                      type="text"
                      maxLength={80}
                      className="form-input"
                      placeholder="Contoh: Desain Web Portfolio"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="topic-desc">
                    Deskripsi Diskusi
                  </label>
                  <textarea
                    id="topic-desc"
                    maxLength={300}
                    className="form-input"
                    rows={3}
                    placeholder="Tuliskan apa yang ingin Anda diskusikan..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={topicSubmitting}
                  style={{
                    justifyContent: "center",
                    marginTop: 4,
                    alignSelf: "flex-end",
                    padding: "8px 16px",
                  }}
                >
                  {topicSubmitting ? (
                    <>
                      <Loader2
                        size={12}
                        style={{
                          animation: "spin 0.8s linear infinite",
                          marginRight: 6,
                        }}
                      />
                      Posting...
                    </>
                  ) : (
                    "Buat Topik"
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        )}

        {/* Global form feedback status message */}
        {topicStatus && (
          <div
            style={{
              maxWidth: "600px",
              margin: "-16px auto 24px",
              padding: "8px 12px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: topicStatus.type === "success" ? "#10b981" : "#ef4444",
            }}
          >
            {topicStatus.type === "error" && <AlertCircle size={12} />}
            <span>{topicStatus.text}</span>
          </div>
        )}

        {/* Full-width feed */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
          className="discussion-feed-container"
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px 0",
              }}
            >
              <Loader2
                size={28}
                style={{
                  animation: "spin 0.8s linear infinite",
                  color: "var(--text-muted)",
                }}
              />
            </div>
          ) : filteredTopics.length === 0 ? (
            <div
              className="card"
              style={{ padding: "40px", textAlign: "center" }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                {searchQuery
                  ? "Tidak ditemukan hasil pencarian yang cocok."
                  : "Belum ada topik diskusi aktif. Mulai topik pertama Anda dengan mengeklik tombol 'NEW DISCUSSION'!"}
              </p>
            </div>
          ) : (
            filteredTopics.slice(0, visibleCount).map((topic, tIdx) => (
              <ScrollReveal key={topic.id} delay={tIdx * 30}>
                <div
                  className="card"
                  style={{
                    padding: "20px 24px",
                    background: "var(--bg-card)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {/* Topic Meta */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: 8,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <User size={12} style={{ color: "var(--accent)" }} />
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {topic.creator}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          selectReplyTarget(topic.id, topic.creator)
                        }
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--accent)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--text-muted)")
                        }
                      >
                        reply
                      </button>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {formatDate(topic.timestamp)}
                    </span>
                  </div>

                  {/* Topic Header & Desc */}
                  <div>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 6,
                      }}
                    >
                      {topic.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {topic.description}
                    </p>
                  </div>

                  {/* Threaded Nested Replies */}
                  {topic.replies.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        borderLeft: "2px solid var(--border)",
                        paddingLeft: 16,
                        marginLeft: 6,
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                    >
                      {topic.replies.map((reply) => (
                        <div key={reply.id} style={{ fontSize: 12 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 4,
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: "var(--text-primary)",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 11,
                                }}
                              >
                                {reply.name}
                              </span>
                              {reply.replyTo && (
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 10,
                                    color: "var(--accent)",
                                    fontWeight: 600,
                                    padding: "1px 4px",
                                    background: "var(--accent-subtle)",
                                    borderRadius: "2px",
                                  }}
                                >
                                  ➜ @{reply.replyTo}
                                </span>
                              )}

                              <button
                                onClick={() =>
                                  selectReplyTarget(topic.id, reply.name)
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 10,
                                  color: "var(--text-muted)",
                                  cursor: "pointer",
                                  marginLeft: 4,
                                  textDecoration: "underline",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color =
                                    "var(--accent)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color =
                                    "var(--text-muted)")
                                }
                              >
                                reply
                              </button>
                            </div>
                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontSize: 10,
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              {formatDate(reply.timestamp)}
                            </span>
                          </div>
                          <p
                            style={{
                              color: "var(--text-secondary)",
                              lineHeight: 1.5,
                            }}
                          >
                            {reply.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Active Reply Target Badge Indicator */}
                  {activeReplyTargets[topic.id] && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        background: "var(--accent-subtle)",
                        color: "var(--accent)",
                        padding: "4px 8px",
                        borderRadius: "2px",
                        alignSelf: "flex-start",
                        marginTop: 4,
                      }}
                    >
                      <span>Replying to @{activeReplyTargets[topic.id]}</span>
                      <button
                        type="button"
                        onClick={() => clearReplyTarget(topic.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* Wide Quick Reply Form */}
                  <form
                    onSubmit={(e) => handlePostReply(e, topic.id)}
                    style={{
                      display: "flex",
                      gap: 12,
                      borderTop: "1px dashed var(--border)",
                      paddingTop: 14,
                      alignItems: "center",
                      width: "100%",
                    }}
                    className="quick-reply-form"
                  >
                    <input
                      type="text"
                      maxLength={30}
                      className="form-input"
                      style={{
                        width: "160px",
                        padding: "8px 12px",
                        fontSize: 12,
                      }}
                      placeholder="Nama Anda"
                      value={replyNames[topic.id] || ""}
                      onChange={(e) =>
                        setReplyNames({
                          ...replyNames,
                          [topic.id]: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      maxLength={200}
                      className="form-input"
                      style={{ flex: 1, padding: "8px 12px", fontSize: 12 }}
                      placeholder={
                        activeReplyTargets[topic.id]
                          ? `Tulis balasan untuk @${activeReplyTargets[topic.id]}...`
                          : "Tulis balasan untuk diskusi..."
                      }
                      value={replyMessages[topic.id] || ""}
                      onChange={(e) =>
                        setReplyMessages({
                          ...replyMessages,
                          [topic.id]: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="submit"
                      disabled={replySubmitting[topic.id]}
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        padding: "8px 16px",
                      }}
                      className="btn-primary"
                    >
                      {replySubmitting[topic.id] ? "..." : "REPLY"}
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            ))
          )}

          {/* Load More Button */}
          {filteredTopics.length > visibleCount && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="btn-secondary"
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  padding: "8px 16px",
                  borderRadius: "2px",
                }}
              >
                [LOAD MORE TOPICS (+{filteredTopics.length - visibleCount})]
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .discussion-feed-container {
          width: 100%;
        }
        @media (max-width: 768px) {
          .create-topic-row {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }
          .quick-reply-form {
            flex-direction: column;
            align-items: stretch !important;
            gap: 8px;
          }
          .quick-reply-form input {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
