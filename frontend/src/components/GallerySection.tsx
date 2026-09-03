"use client";

import { useState } from "react";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2, Monitor } from "lucide-react";
import ParticlesBackground from "./ParticlesBackground";
import ScrollReveal from "./ScrollReveal";
import type { GalleryItem } from "@/data/db";

export default function GallerySection({ data }: { data: GalleryItem[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const activePhotoIndex = selectedPhoto !== null 
    ? data.findIndex(p => p.id === selectedPhoto) 
    : -1;

  const handleNext = () => {
    if (activePhotoIndex !== -1) {
      const nextIndex = (activePhotoIndex + 1) % data.length;
      setSelectedPhoto(data[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (activePhotoIndex !== -1) {
      const prevIndex = (activePhotoIndex - 1 + data.length) % data.length;
      setSelectedPhoto(data[prevIndex].id);
    }
  };

  return (
    <section id="gallery" className="section-padding" style={{ position: "relative" }}>
      <ParticlesBackground />
      <div className="section-container">
        
        {/* Section Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
          <ScrollReveal direction="up">
            <div className="section-label">Archive</div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={100}>
            <h2 className="heading-lg">Image Gallery</h2>
          </ScrollReveal>
        </div>

        {/* Retro File Explorer Window */}
        <ScrollReveal direction="up" delay={200}>
          <div 
            className="admin-hud-panel" 
            style={{ 
              padding: 0, 
              overflow: "hidden", 
              border: "1px solid var(--accent)", 
              background: "var(--bg-secondary)",
              boxShadow: "var(--shadow-md)"
            }}
          >
            
            {/* Title Bar */}
            <div 
              className="admin-hud-header" 
              style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "8px 16px", 
                background: "var(--accent)", 
                color: "var(--bg-primary)", 
                fontWeight: 700, 
                fontFamily: "var(--font-mono)" 
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Monitor size={16} />
                <span>file_explorer - /home/pitok/gallery</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <div style={{ width: 12, height: 12, border: "2px solid var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, cursor: "not-allowed" }}>_</div>
                <div style={{ width: 12, height: 12, border: "2px solid var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, cursor: "not-allowed" }}>◽</div>
                <div style={{ width: 12, height: 12, border: "2px solid var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, cursor: "not-allowed" }}>X</div>
              </div>
            </div>

            {/* Menu Bar */}
            <div style={{ display: "flex", gap: 16, padding: "6px 16px", background: "var(--bg-primary)", opacity: 0.85, borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              <span style={{ cursor: "pointer" }}>[ File ]</span>
              <span style={{ cursor: "pointer" }}>[ View ]</span>
              <span style={{ cursor: "pointer" }}>[ Options ]</span>
              <span style={{ cursor: "pointer" }}>[ Help ]</span>
            </div>

            {/* Folder / Grid Content */}
            <div 
              className="gallery-grid" 
              style={{ 
                padding: 24, 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                gap: 24, 
                background: "var(--bg-secondary)" 
              }}
            >
              {data.map((photo, index) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: simple mouse interactivity is intended
                // biome-ignore lint/a11y/noStaticElementInteractions: card behaves as explorer folder item
                <div 
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.id)}
                  className="gallery-item-card"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    padding: 8,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    position: "relative"
                  }}
                >
                  {/* Photo Frame Container */}
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", border: "1px solid var(--border)" }}>
                    {/* biome-ignore lint/performance/noImgElement: dynamic URLs are managed by user admin dashboard */}
                    <img 
                      src={photo.url} 
                      alt={photo.caption}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      className="gallery-thumbnail-img"
                    />
                    {/* Scanline CRT overlay */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))", backgroundSize: "100% 4px, 6px 100%", pointerEvents: "none" }} />
                    
                    {/* Hover Zoom Overlay */}
                    <div className="gallery-hover-overlay" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "var(--accent-subtle)", opacity: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.3s ease" }}>
                      <Maximize2 size={24} style={{ color: "var(--accent)" }} />
                    </div>
                  </div>

                  {/* Photo metadata */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-mono)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", borderBottom: "1px dashed var(--border)", paddingBottom: 4 }}>
                      <span>img_00{index + 1}.png</span>
                      <span>{photo.date}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, marginTop: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Window Footer Status */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 16px", background: "var(--bg-primary)", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              <span>{data.length} object(s) found</span>
              <span>Memory: 1.44MB</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Retro Photo Viewer Modal */}
        {selectedPhoto !== null && activePhotoIndex !== -1 && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
            <div 
              className="admin-hud-panel modal-anim" 
              style={{
                width: "90%",
                maxWidth: 800,
                border: "2px solid var(--accent)",
                boxShadow: "0 0 30px var(--accent-glow)",
                padding: 0,
                overflow: "hidden",
                background: "var(--bg-card)"
              }}
            >
              {/* Modal Header */}
              <div 
                className="admin-hud-header" 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  padding: "8px 16px", 
                  background: "var(--accent)", 
                  color: "var(--bg-primary)", 
                  fontWeight: 700, 
                  fontFamily: "var(--font-mono)" 
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ImageIcon size={16} />
                  <span>photo_viewer - img_00{activePhotoIndex + 1}.png</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedPhoto(null)} 
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--bg-primary)", fontWeight: 900 }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal View Area */}
              <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", background: "var(--bg-secondary)" }}>
                
                {/* Image Display */}
                <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", background: "var(--bg-secondary)", minHeight: 280, maxHeight: "60vh" }}>
                  {/* biome-ignore lint/performance/noImgElement: dynamic URLs are managed by user admin dashboard */}
                  <img 
                    src={data[activePhotoIndex].url} 
                    alt={data[activePhotoIndex].caption}
                    style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain" }}
                  />
                  {/* CRT Screen scanline reflection */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.12) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))", backgroundSize: "100% 4px, 6px 100%", pointerEvents: "none" }} />
                </div>

                {/* Navigation Controls overlay */}
                <button 
                  type="button"
                  onClick={handlePrev} 
                  style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "var(--bg-card)", border: "1px solid var(--accent)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--accent)" }}
                  className="gallery-nav-btn"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  type="button"
                  onClick={handleNext} 
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "var(--bg-card)", border: "1px solid var(--accent)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--accent)" }}
                  className="gallery-nav-btn"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Photo Description area */}
              <div style={{ padding: 20, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8, background: "var(--bg-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  <span>Path: /home/pitok/gallery/img_00{activePhotoIndex + 1}.png</span>
                  <span>Date: {data[activePhotoIndex].date}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 4 }}>
                  {data[activePhotoIndex].caption}
                </p>
              </div>

              {/* Modal footer control bar */}
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 20px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
                <button 
                  type="button"
                  onClick={() => setSelectedPhoto(null)} 
                  className="admin-hud-button" 
                  style={{ padding: "6px 20px", fontSize: 12, cursor: "pointer" }}
                >
                  Close Viewer
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
