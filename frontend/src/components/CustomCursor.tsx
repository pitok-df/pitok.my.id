"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    setIsVisible(true);

    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const addHover = () => {
      const interactables = document.querySelectorAll(
        "a, button, [role='button'], .project-link, input, textarea, select",
      );
      interactables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    document.addEventListener("mousemove", move);
    addHover();

    // Re-apply event listeners when DOM structure changes
    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`terminal-cursor ${isHovering ? "hovering" : ""}`}
    />
  );
}
