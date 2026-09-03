"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAudio, playSound } from "@/data/audioManager";
import {
  type ConversationStep,
  MASCOT_CONVERSATIONS,
  MASCOT_DIALOGUES,
  MOOD_EMOJI,
  type Mood,
} from "@/data/mascotDialogues";
import { useTypingEffect } from "@/hooks/useTypingEffect";

const neko_idle = [
  ". . . . . . . . . . . . . . . . . . . . . . . .",
  ". . . . . B B B . . . . . . . . B B B . . . . .",
  ". . . . B C C C B . . . . . . B C C C B . . . .",
  ". . . B C C P C C B . . . . B C C P C C B . . .",
  ". . . B C P P C C B B B B B B C C P P C B . . .",
  ". . B C C P C C B C C C C C C B C C P C C B . .",
  ". . B C C C C B C C C C C C C C B C C C C B . .",
  ". B C C C C B C C C C C C C C C C B C C C C B .",
  ". B C C C B C C C C C C C C C C C C B C C C B .",
  ". B C C B C E E C C C C C C E E C C B B C C B .",
  ". B C C B C E E C C N N C C E E C C B B C C B .",
  ". . B B B C C C C N C C N C C C C C B B B B . .",
  ". . . . B C C C C C C C C C C C C C B . . . . .",
  ". . . . B C C C W W W W W W C C C C B . . . . .",
  ". . . . . B C R R R R R R R R C C B . . . . . .",
  ". . . . . B C C R G G G G R C C C B . . . . . .",
  ". . . . B C C C C G G G G C C C C C B . . . . .",
  ". . . B C C W W W W W W W W W C C C C B . . . .",
  ". . . B C W W W W W W W W W W W C C C B . . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C C W W W W W W W W W C C C C C B . . .",
  ". . . B C C C C C C C C C C C C C C C B . . . .",
  ". . . . B B B B B B B B B B B B B B B . . . . .",
];

const neko_talking = [
  ". . . . . . . . . . . . . . . . . . . . . . . .",
  ". . . . . B B B . . . . . . . . B B B . . . . .",
  ". . . . B C C C B . . . . . . B C C C B . . . .",
  ". . . B C C P C C B . . . . B C C P C C B . . .",
  ". . . B C P P C C B B B B B B C C P P C B . . .",
  ". . B C C P C C B C C C C C C B C C P C C B . .",
  ". . B C C C C B C C C C C C C C B C C C C B . .",
  ". B C C C C B C C C C C C C C C C B C C C C B .",
  ". B C C C B C C C C C C C C C C C C B C C C B .",
  ". B C C B C E E C C C C C C E E C C B B C C B .",
  ". B C C B C E E C N N N N C E E C C B B C C B .",
  ". . B B B C C C N N P P N N C C C C B B B B . .",
  ". . . . B C C C C N N N N C C C C C B . . . . .",
  ". . . . B C C C W W W W W W C C C C B . . . . .",
  ". . . . . B C R R R R R R R R C C B . . . . . .",
  ". . . . . B C C R G G G G R C C C B . . . . . .",
  ". . . . B C C C C G G G G C C C C C B . . . . .",
  ". . . B C C W W W W W W W W W C C C C B . . . .",
  ". . . B C W W W W W W W W W W W C C C B . . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C C W W W W W W W W W C C C C C B . . .",
  ". . . B C C C C C C C C C C C C C C C B . . . .",
  ". . . . B B B B B B B B B B B B B B B . . . . .",
];

const neko_sleeping = [
  ". . . . . . . . . . . . . . . . . . . . . . . .",
  ". . . . . B B B . . . . . . . . B B B . . . . .",
  ". . . . B C C C B . . . . . . B C C C B . . . .",
  ". . . B C C P C C B . . . . B C C P C C B . . .",
  ". . . B C P P C C B B B B B B C C P P C B . . .",
  ". . B C C P C C B C C C C C C B C C P C C B . .",
  ". . B C C C C B C C C C C C C C B C C C C B . .",
  ". B C C C C B C C C C C C C C C C B C C C C B .",
  ". B C C C B C C C C C C C C C C C C B C C C B .",
  ". B C C B C B B C C C C C C B B C C B B C C B .",
  ". B C C B B C C B C N N C B C C B C B B C C B .",
  ". . B B B C C C C N C C N C C C C C B B B B . .",
  ". . . . B C C C C C C C C C C C C C B . . . . .",
  ". . . . B C C C W W W W W W C C C C B . . . . .",
  ". . . . . B C R R R R R R R R C C B . . . . . .",
  ". . . . . B C C R G G G G R C C C B . . . . . .",
  ". . . . B C C C C G G G G C C C C C B . . . . .",
  ". . . B C C W W W W W W W W W C C C C B . . . .",
  ". . . B C W W W W W W W W W W W C C C B . . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C C W W W W W W W W W C C C C C B . . .",
  ". . . B C C C C C C C C C C C C C C C B . . . .",
  ". . . . B B B B B B B B B B B B B B B . . . . .",
];

const robo_idle = [
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . B B B B B . . . . . . . . . .",
  ". . . . . . . . B M M M M M B . . . . . . . . .",
  ". . . . B B B B B B B B B B B B B B B . . . . .",
  ". . . B M M M M M M M M M M M M M M M B . . . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". B M M M M M M M M M M M M M M M M M M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S E E S S S S S S E E S S S M M B . .",
  ". B M M S S E E S S S S S S E E S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". . . B B B B B B B B B B B B B B B B B . . . .",
  ". . . . . . . B M M M M M M B . . . . . . . . .",
  ". . . . . . B M M M M M M M M B . . . . . . . .",
  ". . . . . B M M D D D D D D M M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . . B B M M B B M M B B . . . . . . . .",
  ". . . . . . . . B B . . B B . . . . . . . . . .",
];

const robo_talking = [
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . B B B B B . . . . . . . . . .",
  ". . . . . . . . B M M M M M B . . . . . . . . .",
  ". . . . B B B B B B B B B B B B B B B . . . . .",
  ". . . B M M M M M M M M M M M M M M M B . . . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". B M M M M M M M M M M M M M M M M M M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S E E S S S S S S S S S S S M M B . .",
  ". B M M S S E E S S E E E E E S S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S S S S E E E E E S S S S S M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". . . B B B B B B B B B B B B B B B B B . . . .",
  ". . . . . . . B M M M M M M B . . . . . . . . .",
  ". . . . . . B M M M M M M M M B . . . . . . . .",
  ". . . . . B M M D D D D D D M M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . . B B M M B B M M B B . . . . . . . .",
  ". . . . . . . . B B . . B B . . . . . . . . . .",
];

const robo_sleeping = [
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . B B B B B . . . . . . . . . .",
  ". . . . . . . . B M M M M M B . . . . . . . . .",
  ". . . . B B B B B B B B B B B B B B B . . . . .",
  ". . . B M M M M M M M M M M M M M M M B . . . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". B M M M M M M M M M M M M M M M M M M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S B B B S S S S S B B B S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". . . B B B B B B B B B B B B B B B B B . . . .",
  ". . . . . . . B M M M M M M B . . . . . . . . .",
  ". . . . . . B M M M M M M M M B . . . . . . . .",
  ". . . . . B M M D D D D D D M M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . . B B M M B B M M B B . . . . . . . .",
  ". . . . . . . . B B . . B B . . . . . . . . . .",
];

// ─── Walk Frames ─────────────────────────────────────────────────────────────
// Neko walk frame 1 – left foot forward
const neko_walk_1 = [
  ". . . . . . . . . . . . . . . . . . . . . . . .",
  ". . . . . B B B . . . . . . . . B B B . . . . .",
  ". . . . B C C C B . . . . . . B C C C B . . . .",
  ". . . B C C P C C B . . . . B C C P C C B . . .",
  ". . . B C P P C C B B B B B B C C P P C B . . .",
  ". . B C C P C C B C C C C C C B C C P C C B . .",
  ". . B C C C C B C C C C C C C C B C C C C B . .",
  ". B C C C C B C C C C C C C C C C B C C C C B .",
  ". B C C C B C C C C C C C C C C C C B C C C B .",
  ". B C C B C E E C C C C C C E E C C B B C C B .",
  ". B C C B C E E C C N N C C E E C C B B C C B .",
  ". . B B B C C C C N C C N C C C C C B B B B . .",
  ". . . . B C C C C C C C C C C C C C B . . . . .",
  ". . . . B C C C W W W W W W C C C C B . . . . .",
  ". . . . . B C R R R R R R R R C C B . . . . . .",
  ". . . . . B C C R G G G G R C C C B . . . . . .",
  ". . . . B C C C C G G G G C C C C C B . . . . .",
  ". . . B C C W W W W W W W W W C C C C B . . . .",
  ". . . B C W W W W W W W W W W W C C C B . . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C C W W W W W W W W W C C C C C B . . .",
  ". . B B C C C C C C C C C C C C C C C B B . . .",
  ". B B B B B B . . . . . . . . B B B B B . . . .",
];

// Neko walk frame 2 – right foot forward
const neko_walk_2 = [
  ". . . . . . . . . . . . . . . . . . . . . . . .",
  ". . . . . B B B . . . . . . . . B B B . . . . .",
  ". . . . B C C C B . . . . . . B C C C B . . . .",
  ". . . B C C P C C B . . . . B C C P C C B . . .",
  ". . . B C P P C C B B B B B B C C P P C B . . .",
  ". . B C C P C C B C C C C C C B C C P C C B . .",
  ". . B C C C C B C C C C C C C C B C C C C B . .",
  ". B C C C C B C C C C C C C C C C B C C C C B .",
  ". B C C C B C C C C C C C C C C C C B C C C B .",
  ". B C C B C E E C C C C C C E E C C B B C C B .",
  ". B C C B C E E C C N N C C E E C C B B C C B .",
  ". . B B B C C C C N C C N C C C C C B B B B . .",
  ". . . . B C C C C C C C C C C C C C B . . . . .",
  ". . . . B C C C W W W W W W C C C C B . . . . .",
  ". . . . . B C R R R R R R R R C C B . . . . . .",
  ". . . . . B C C R G G G G R C C C B . . . . . .",
  ". . . . B C C C C G G G G C C C C C B . . . . .",
  ". . . B C C W W W W W W W W W C C C C B . . . .",
  ". . . B C W W W W W W W W W W W C C C B . . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C W W W W W W W W W W W C C C C B . . .",
  ". . B C C C W W W W W W W W W C C C C C B . . .",
  ". . B B C C C C C C C C C C C C C C C B B . . .",
  ". . . . B B B B B B . . . . . . B B B B B B . .",
];

// Robo walk frame 1 – left foot steps forward
const robo_walk_1 = [
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . B B B B B . . . . . . . . . .",
  ". . . . . . . . B M M M M M B . . . . . . . . .",
  ". . . . B B B B B B B B B B B B B B B . . . . .",
  ". . . B M M M M M M M M M M M M M M M B . . . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". B M M M M M M M M M M M M M M M M M M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S E E S S S S S S E E S S S M M B . .",
  ". B M M S S E E S S S S S S E E S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". . . B B B B B B B B B B B B B B B B B . . . .",
  ". . . . . . . B M M M M M M B . . . . . . . . .",
  ". . . . . . B M M M M M M M M B . . . . . . . .",
  ". . . . . B M M D D D D D D M M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . . B B M M B B M M B B . . . . . . . .",
  ". . . . . B B B B . . . . B B . . . . . . . . .",
];

// Robo walk frame 2 – right foot steps forward
const robo_walk_2 = [
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . . . A . . . . . . . . . . . .",
  ". . . . . . . . . B B B B B . . . . . . . . . .",
  ". . . . . . . . B M M M M M B . . . . . . . . .",
  ". . . . B B B B B B B B B B B B B B B . . . . .",
  ". . . B M M M M M M M M M M M M M M M B . . . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". B M M M M M M M M M M M M M M M M M M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S E E S S S S S S E E S S S M M B . .",
  ". B M M S S E E S S S S S S E E S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M S S S S S S S S S S S S S S S M M B . .",
  ". B M M M S S S S S S S S S S S S S M M M B . .",
  ". . B M M M M M M M M M M M M M M M M M B . . .",
  ". . . B B B B B B B B B B B B B B B B B . . . .",
  ". . . . . . . B M M M M M M B . . . . . . . . .",
  ". . . . . . B M M M M M M M M B . . . . . . . .",
  ". . . . . B M M D D D D D D M M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . B M D D D D D D D D M B . . . . . . .",
  ". . . . . . B B M M B B M M B B . . . . . . . .",
  ". . . . . . . . B B . . B B B B . . . . . . . .",
];

const nekoColors: Record<string, string> = {
  B: "var(--border-strong)",
  C: "var(--text-secondary)",
  P: "#fda4af",
  E: "var(--accent)",
  N: "#f43f5e",
  R: "#e11d48",
  G: "#fbbf24",
  W: "var(--bg-primary)",
};

const roboColors: Record<string, string> = {
  B: "var(--border-strong)",
  M: "var(--text-secondary)",
  D: "var(--border)",
  S: "#0f0f13",
  E: "var(--accent)",
  A: "var(--accent)",
};

function PixelArt({
  grid,
  colorMap,
}: {
  grid: string[];
  colorMap: Record<string, string>;
}) {
  const height = grid.length;
  const width = grid[0] ? grid[0].split(" ").length : 0;
  const rects = grid.flatMap((row, y) =>
    row.split(" ").map((char, x) => {
      const fill = colorMap[char];
      if (!fill || char === ".") return null;
      return (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
      );
    }),
  );
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "100%", shapeRendering: "crispEdges" }}
    >
      {rects}
    </svg>
  );
}

interface Vec2 {
  x: number;
  y: number;
}

interface MascotPhysics {
  pos: Vec2;
  vel: Vec2;
  target: Vec2;
  // Per-character tuning
  springK: number;
  damping: number;
  maxSpeed: number;
}

const MASCOT_SIZE = 72;
const PADDING = 24;
const BUBBLE_WIDTH = 230;

function MascotCharacter({
  id,
  label,
  isTalking,
  isRebooting,
  isHovered,
  isSleeping,
  isWalking,
  facingRight,
  grid,
  colorMap,
  bubble,
  bubbleTyping,
  isTyping,
  moodEmoji,
  pos,
  onHoverEnter,
  onHoverLeave,
  onClick,
  onDragEnd,
}: {
  id: string;
  label: string;
  isTalking: boolean;
  isRebooting?: boolean;
  isHovered: boolean;
  isSleeping: boolean;
  isWalking: boolean;
  facingRight: boolean;
  grid: string[];
  colorMap: Record<string, string>;
  bubble: string;
  bubbleTyping: string;
  isTyping: boolean;
  moodEmoji: string;
  pos: Vec2;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onClick: () => void;
  onDragEnd: (pos: Vec2) => void;
}) {
  const dragRef = useRef<{
    startMouse: Vec2;
    startPos: Vec2;
    dragging: boolean;
  } | null>(null);
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const bubbleLeft = pos.x + MASCOT_SIZE / 2 - BUBBLE_WIDTH / 2;
  const safeBubbleLeft = Math.max(
    8,
    Math.min(bubbleLeft, vw - BUBBLE_WIDTH - 8),
  );
  const bubbleBottom = vh - pos.y + 8;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startMouse: { x: e.clientX, y: e.clientY },
      startPos: { ...pos },
      dragging: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startMouse.x;
    const dy = e.clientY - dragRef.current.startMouse.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragRef.current.dragging = true;
    if (dragRef.current.dragging) {
      const newX = Math.max(
        PADDING,
        Math.min(
          window.innerWidth - MASCOT_SIZE - PADDING,
          dragRef.current.startPos.x + dx,
        ),
      );
      const newY = Math.max(
        PADDING,
        Math.min(
          window.innerHeight - MASCOT_SIZE - PADDING,
          dragRef.current.startPos.y + dy,
        ),
      );
      onDragEnd({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => {
    if (dragRef.current && !dragRef.current.dragging) onClick();
    dragRef.current = null;
  };

  return (
    <>
      {bubble && (
        <div
          className="mascot-bubble-float"
          style={{
            position: "fixed",
            left: safeBubbleLeft,
            bottom: bubbleBottom,
            zIndex: 9999,
            maxWidth: BUBBLE_WIDTH,
          }}
        >
          <span className="bubble-mood">{moodEmoji}</span>
          <span className="bubble-text">
            {bubbleTyping || bubble}
            {isTyping && <span className="typing-cursor">▌</span>}
          </span>
          <div
            className="bubble-tail"
            style={{ left: pos.x + MASCOT_SIZE / 2 - safeBubbleLeft - 5 }}
          />
        </div>
      )}
      <div
        data-mascot-id={id}
        className={[
          "mascot-char",
          isTalking ? "talking" : "",
          isHovered ? "hovered" : "",
          isSleeping ? "sleeping" : "",
          isWalking ? "walking" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: MASCOT_SIZE,
          height: MASCOT_SIZE,
          zIndex: 9998,
          cursor: "grab",
          touchAction: "none",
          // Flip sprite to face movement direction
          transform: facingRight ? "scaleX(1)" : "scaleX(-1)",
          transition: "transform 0.15s ease",
        }}
        title={label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
      >
        <PixelArt grid={grid} colorMap={colorMap} />
        {/* Sleep particles — flip back so text reads correctly */}
        {isSleeping && !isTalking && (
          <div
            className="zzz-float"
            style={{ transform: facingRight ? "scaleX(1)" : "scaleX(-1)" }}
          >
            zZZ
          </div>
        )}
        {isRebooting && (
          <div className="reboot-overlay">
            <span>REBOOT...</span>
          </div>
        )}
      </div>
    </>
  );
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const playBinaryVoice = (char: string, speaker: "neko" | "robo") => {
  if (
    typeof window === "undefined" ||
    localStorage.getItem("soundEnabled") !== "true"
  )
    return;

  const { context, analyser } = getAudio();
  if (!context || !analyser) return;

  try {
    const charCode = char.charCodeAt(0);
    const binary = charCode.toString(2).padStart(8, "0");

    // Calculate dynamic parameters based on the binary string of the character
    let activeBits = 0;
    let weightedSum = 0;
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === "1") {
        activeBits++;
        weightedSum += (i + 1) * 15;
      }
    }

    const osc = context.createOscillator();
    const gainNode = context.createGain();

    const storedVol = localStorage.getItem("audioVolume");
    const baseVolume = storedVol !== null ? parseFloat(storedVol) : 0.7;
    // Set output volume to at least 70% (0.7) as requested
    const volume = Math.max(0.7, baseVolume);

    if (speaker === "neko") {
      osc.type = "sine";
      // Neko: high-pitched cute sine wave sweep modulated by the binary value
      const startFreq = 700 + weightedSum; // unique base freq per character
      const endFreq = startFreq + activeBits * 25; // sweep range based on number of active bits

      osc.frequency.setValueAtTime(startFreq, context.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        endFreq,
        context.currentTime + 0.05,
      );

      gainNode.gain.setValueAtTime(volume, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.05,
      );

      osc.connect(gainNode);
      gainNode.connect(analyser);

      osc.start();
      osc.stop(context.currentTime + 0.05);
    } else {
      osc.type = "square";
      // Robo: lower-pitched metallic square sweep modulated by the binary value
      const startFreq = 100 + (weightedSum % 90); // unique base freq per character
      const endFreq = startFreq - activeBits * 10; // sweep down

      osc.frequency.setValueAtTime(startFreq, context.currentTime);
      osc.frequency.linearRampToValueAtTime(
        endFreq,
        context.currentTime + 0.06,
      );

      // Square wave is naturally loud, but user requested at least 70% output.
      // We'll set it to volume * 0.8 to keep it clear and well-balanced but still meeting the 70% constraint!
      gainNode.gain.setValueAtTime(volume * 0.8, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.06,
      );

      osc.connect(gainNode);
      gainNode.connect(analyser);

      osc.start();
      osc.stop(context.currentTime + 0.06);
    }
  } catch (err) {
    console.error("Binary voice playback error:", err);
  }
};

export default function CompanionMascot() {
  const [isVisible, setIsVisible] = useState(false);
  const [nekoBubble, setNekoBubble] = useState("");
  const [roboBubble, setRoboBubble] = useState("");
  const [nekoTalking, setNekoTalking] = useState(false);
  const [roboTalking, setRoboTalking] = useState(false);

  const [nekoWalkFrame, setNekoWalkFrame] = useState(0);
  const [roboWalkFrame, setRoboWalkFrame] = useState(0);
  const [nekoFacingRight, setNekoFacingRight] = useState(true);
  const [roboFacingRight, setRoboFacingRight] = useState(true);

  const [nekoHovered, setNekoHovered] = useState(false);
  const [roboHovered, setRoboHovered] = useState(false);
  const [roboRebooting, setRoboRebooting] = useState(false);

  const [nekoMood, setNekoMood] = useState<Mood>("neutral");
  const [roboMood, setRoboMood] = useState<Mood>("neutral");
  const [nekoEnergy, setNekoEnergy] = useState(80);
  const [roboEnergy, setRoboEnergy] = useState(100);

  const [nekoText, setNekoText] = useState("");
  const [roboText, setRoboText] = useState("");

  const [particles, setParticles] = useState<
    { id: number; type: string; x: number; y: number; createdAt: number }[]
  >([]);

  const cursorPos = useRef({ x: 0, y: 0 });
  const particleIdCounter = useRef(0);

  const nekoCombo = useRef(0);
  const roboCombo = useRef(0);
  const isConversing = useRef(false);
  const nekoBubbleTimer = useRef<NodeJS.Timeout | null>(null);
  const roboBubbleTimer = useRef<NodeJS.Timeout | null>(null);

  const nekoPhysics = useRef<MascotPhysics>({
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    springK: 0.012,
    damping: 0.88,
    maxSpeed: 0.9,
  });
  const roboPhysics = useRef<MascotPhysics>({
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    springK: 0.022,
    damping: 0.91,
    maxSpeed: 1.4,
  });

  const [nekoPos, setNekoPos] = useState<Vec2>({ x: 0, y: 0 });
  const [roboPos, setRoboPos] = useState<Vec2>({ x: 0, y: 0 });

  const nekoDragPause = useRef(0);
  const roboDragPause = useRef(0);

  const socialMode = useRef(false);
  const wakeUpRef = useRef<() => void>(() => {});

  const nekoMoodRef = useRef<Mood>("neutral");
  const roboMoodRef = useRef<Mood>("neutral");
  const nekoEnergyRef = useRef(80);
  const roboEnergyRef = useRef(100);

  nekoMoodRef.current = nekoMood;
  roboMoodRef.current = roboMood;
  nekoEnergyRef.current = nekoEnergy;
  roboEnergyRef.current = roboEnergy;

  const pickWanderTarget = useCallback((id: "neko" | "robo"): Vec2 => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const bottomY = h - MASCOT_SIZE - PADDING;

    if (socialMode.current) {
      const meetX =
        w * 0.45 + (id === "neko" ? -MASCOT_SIZE - 8 : MASCOT_SIZE + 8);
      return { x: meetX, y: bottomY - Math.random() * 8 };
    }

    const baseKey = id === "neko" ? "nekoBasePos" : "roboBasePos";
    let basePos: Vec2 | null = null;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(baseKey);
      if (stored) {
        try {
          basePos = JSON.parse(stored);
        } catch (e) {}
      }
    }

    if (basePos) {
      // Wander locally around user-dragged base position
      const rangeX = 120;
      const rangeY = 40;
      const targetX = Math.max(
        PADDING,
        Math.min(
          w - MASCOT_SIZE - PADDING,
          basePos.x + (Math.random() * 2 - 1) * rangeX,
        ),
      );
      const targetY = Math.max(
        PADDING,
        Math.min(
          h - MASCOT_SIZE - PADDING,
          basePos.y + (Math.random() * 2 - 1) * rangeY,
        ),
      );
      return { x: targetX, y: targetY };
    }

    if (id === "neko") {
      const zones = [
        {
          x: PADDING + Math.random() * w * 0.2,
          y: bottomY - Math.random() * 12,
        },
        {
          x: w * 0.15 + Math.random() * w * 0.2,
          y: bottomY - Math.random() * 20,
        },
        {
          x: w * 0.35 + Math.random() * w * 0.2,
          y: bottomY - Math.random() * 12,
        },
        {
          x: w * 0.55 + Math.random() * w * 0.25,
          y: bottomY - Math.random() * 16,
        },
        {
          x: PADDING + Math.random() * w * 0.4,
          y: bottomY - 30 - Math.random() * 40,
        },
      ];
      return pickRandom(zones);
    } else {
      const zones = [
        {
          x: PADDING + Math.random() * w * 0.15,
          y: bottomY - Math.random() * 8,
        },
        {
          x: w * 0.25 + Math.random() * w * 0.2,
          y: bottomY - Math.random() * 10,
        },
        {
          x: w * 0.45 + Math.random() * w * 0.2,
          y: bottomY - Math.random() * 8,
        },
        {
          x: w * 0.65 + Math.random() * w * 0.2,
          y: bottomY - Math.random() * 10,
        },
      ];
      return pickRandom(zones);
    }
  }, []);

  const speakNeko = useCallback(
    (text: string, duration = 4000, force = false) => {
      if (isConversing.current && !force) return;
      if (nekoBubbleTimer.current) clearTimeout(nekoBubbleTimer.current);
      setNekoBubble(text);
      setNekoText(text);
      setNekoTalking(true);
      nekoBubbleTimer.current = setTimeout(
        () => {
          setNekoBubble("");
          setNekoText("");
          setNekoTalking(false);
        },
        Math.max(duration, text.length * 40 + 400),
      );
    },
    [],
  );

  const speakRobo = useCallback(
    (text: string, duration = 4000, force = false) => {
      if (isConversing.current && !force) return;
      if (roboBubbleTimer.current) clearTimeout(roboBubbleTimer.current);
      setRoboBubble(text);
      setRoboText(text);
      setRoboTalking(true);
      roboBubbleTimer.current = setTimeout(
        () => {
          setRoboBubble("");
          setRoboText("");
          setRoboTalking(false);
        },
        Math.max(duration, text.length * 40 + 400),
      );
    },
    [],
  );

  const speak = useCallback(
    (
      speaker: "neko" | "robo",
      text: string,
      duration = 4000,
      force = false,
    ) => {
      if (speaker === "neko") speakNeko(text, duration, force);
      else speakRobo(text, duration, force);
    },
    [speakNeko, speakRobo],
  );

  const runDuet = useCallback(
    (steps: ConversationStep[]) => {
      if (isConversing.current) return;
      isConversing.current = true;
      socialMode.current = true;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const meetY = h - MASCOT_SIZE - PADDING - Math.random() * 8;
      nekoPhysics.current.target = { x: w * 0.38, y: meetY };
      roboPhysics.current.target = { x: w * 0.5, y: meetY };
      wakeUpRef.current();

      let i = 0;
      const totalDuration = steps.reduce(
        (acc, s) => acc + (s.duration ?? 4000) + 600,
        0,
      );

      const runStep = () => {
        if (i >= steps.length) {
          isConversing.current = false;
          setTimeout(() => {
            socialMode.current = false;
          }, 3000);
          return;
        }
        const { speaker, text, duration = 4000 } = steps[i];
        speak(speaker, text, duration, true);
        i++;
        setTimeout(runStep, duration + 600);
      };
      runStep();

      setTimeout(() => {
        isConversing.current = false;
        socialMode.current = false;
      }, totalDuration + 2000);
    },
    [speak],
  );

  const spawnParticles = useCallback(
    (x: number, y: number, type: string, count = 3) => {
      for (let i = 0; i < count; i++) {
        const id = particleIdCounter.current++;
        setParticles((prev) => [
          ...prev,
          {
            id,
            type,
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 10,
            createdAt: Date.now(),
          },
        ]);
      }
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => Date.now() - p.createdAt < 2000),
        );
      }, 2000);
    },
    [],
  );

  const handleNekoClick = useCallback(() => {
    if (isConversing.current) return;
    nekoCombo.current += 1;
    spawnParticles(nekoPos.x + MASCOT_SIZE / 2, nekoPos.y, "star", 5);

    // Apply sudden physical jump force
    const physics = nekoPhysics.current;
    physics.vel = { x: (Math.random() - 0.5) * 12, y: -18 };
    nekoDragPause.current = Date.now() + 2000;
    if (wakeUpRef.current) wakeUpRef.current();

    if (nekoCombo.current >= 5) {
      nekoCombo.current = 0;
      setNekoMood("grumpy");
      speakNeko(pickRandom(MASCOT_DIALOGUES.neko.clickCombos), 4000, true);
      return;
    }
    setNekoMood(Math.random() < 0.3 ? "excited" : "happy");
    setNekoEnergy((e) => Math.min(100, e + 5));
    if (Math.random() < 0.2) {
      runDuet(pickRandom(MASCOT_CONVERSATIONS));
      return;
    }
    const useMoodDialogue = Math.random() < 0.3;
    if (useMoodDialogue) {
      const pool = (MASCOT_DIALOGUES.neko.moods as any)[nekoMood];
      if (pool) {
        speakNeko(pickRandom(pool), 3500);
        return;
      }
    }
    speakNeko(pickRandom(MASCOT_DIALOGUES.neko.click), 3500);
  }, [speakNeko, runDuet, nekoPos, spawnParticles, nekoMood]);

  const handleRoboClick = useCallback(() => {
    if (isConversing.current || roboRebooting) return;
    roboCombo.current += 1;
    spawnParticles(roboPos.x + MASCOT_SIZE / 2, roboPos.y, "spark", 5);

    // Apply sudden physical jump force (Robo is slightly heavier than Neko)
    const physics = roboPhysics.current;
    physics.vel = { x: (Math.random() - 0.5) * 8, y: -14 };
    roboDragPause.current = Date.now() + 2000;
    if (wakeUpRef.current) wakeUpRef.current();

    if (roboCombo.current >= 5) {
      roboCombo.current = 0;
      setRoboMood("grumpy");
      speakRobo(pickRandom(MASCOT_DIALOGUES.robo.clickCombos), 4000, true);
      setRoboRebooting(true);
      setTimeout(() => setRoboRebooting(false), 3500);
      return;
    }
    setRoboMood(Math.random() < 0.3 ? "excited" : "happy");
    setRoboEnergy((e) => Math.min(100, e + 3));
    if (Math.random() < 0.2) {
      runDuet(pickRandom(MASCOT_CONVERSATIONS));
      return;
    }
    const useMoodDialogue = Math.random() < 0.3;
    if (useMoodDialogue) {
      const pool = (MASCOT_DIALOGUES.robo.moods as any)[roboMood];
      if (pool) {
        speakRobo(pickRandom(pool), 3500);
        return;
      }
    }
    speakRobo(pickRandom(MASCOT_DIALOGUES.robo.click), 3500);
  }, [speakRobo, runDuet, roboPos, spawnParticles, roboMood, roboRebooting]);

  const handleNekoDrag = useCallback((pos: Vec2) => {
    nekoPhysics.current.pos = pos;
    nekoPhysics.current.vel = { x: 0, y: 0 };
    nekoPhysics.current.target = pos;
    nekoDragPause.current = Date.now() + 5000;
    setNekoPos({ ...pos });
    localStorage.setItem("nekoBasePos", JSON.stringify(pos));
    wakeUpRef.current();
  }, []);

  const handleRoboDrag = useCallback((pos: Vec2) => {
    roboPhysics.current.pos = pos;
    roboPhysics.current.vel = { x: 0, y: 0 };
    roboPhysics.current.target = pos;
    roboDragPause.current = Date.now() + 5000;
    setRoboPos({ ...pos });
    localStorage.setItem("roboBasePos", JSON.stringify(pos));
    wakeUpRef.current();
  }, []);

  useEffect(() => {
    const handleMascotAction = (e: Event) => {
      const { action, target } = (e as CustomEvent).detail;
      const soundOn = localStorage.getItem("soundEnabled") === "true";

      if (action === "reset") {
        localStorage.removeItem("nekoBasePos");
        localStorage.removeItem("roboBasePos");
        const wVal = window.innerWidth;
        const hVal = window.innerHeight;
        const startY = hVal - MASCOT_SIZE - PADDING;
        const initialNeko = { x: PADDING, y: startY };
        const initialRobo = { x: PADDING + MASCOT_SIZE + 16, y: startY };

        nekoPhysics.current.pos = initialNeko;
        nekoPhysics.current.target = initialNeko;
        nekoPhysics.current.vel = { x: 0, y: 0 };

        roboPhysics.current.pos = initialRobo;
        roboPhysics.current.target = initialRobo;
        roboPhysics.current.vel = { x: 0, y: 0 };

        setNekoPos(initialNeko);
        setRoboPos(initialRobo);

        speakNeko("Meow~ Kembali ke posisi semula!", 3000, true);
        speakRobo("BEEP BOOP! Koordinat di-reset ke default.", 3000, true);

        spawnParticles(
          initialNeko.x + MASCOT_SIZE / 2,
          initialNeko.y,
          "star",
          5,
        );
        spawnParticles(
          initialRobo.x + MASCOT_SIZE / 2,
          initialRobo.y,
          "spark",
          5,
        );
        wakeUpRef.current();
        return;
      }

      if (target === "neko") {
        if (action === "pet") {
          setNekoMood("happy");
          setNekoEnergy((e) => Math.min(100, e + 15));
          spawnParticles(nekoPos.x + MASCOT_SIZE / 2, nekoPos.y, "heart", 6);
          speakNeko(
            "Purrr... Nyaaa~ Elusanmu sangat nyaman di pikselku!",
            4000,
            true,
          );
          if (soundOn) {
            try {
              const AudioCtx =
                window.AudioContext || (window as any).webkitAudioContext;
              const ctx = new AudioCtx();
              const playTone = (f: number, d: number, delay: number) => {
                setTimeout(() => {
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.type = "sine";
                  osc.frequency.value = f;
                  gain.gain.setValueAtTime(0.3, ctx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    ctx.currentTime + d,
                  );
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.start();
                  osc.stop(ctx.currentTime + d);
                }, delay);
              };
              playTone(400, 0.15, 0);
              playTone(450, 0.15, 120);
              playTone(500, 0.2, 240);
            } catch {}
          }
        } else if (action === "feed") {
          setNekoMood("happy");
          setNekoEnergy((e) => Math.min(100, e + 20));
          spawnParticles(nekoPos.x + MASCOT_SIZE / 2, nekoPos.y, "star", 8);
          speakNeko(
            "Nyam nyam... Ikan digital ini sangat lezat! Nyaaa~",
            4000,
            true,
          );
          if (soundOn) {
            try {
              const AudioCtx =
                window.AudioContext || (window as any).webkitAudioContext;
              const ctx = new AudioCtx();
              const playTone = (f: number, d: number, delay: number) => {
                setTimeout(() => {
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.type = "triangle";
                  osc.frequency.value = f;
                  gain.gain.setValueAtTime(0.4, ctx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    ctx.currentTime + d,
                  );
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.start();
                  osc.stop(ctx.currentTime + d);
                }, delay);
              };
              playTone(180, 0.08, 0);
              playTone(150, 0.08, 100);
              playTone(120, 0.08, 200);
            } catch {}
          }
        }
      } else if (target === "robo") {
        if (action === "pet") {
          setRoboMood("happy");
          setRoboEnergy((e) => Math.min(100, e + 10));
          spawnParticles(roboPos.x + MASCOT_SIZE / 2, roboPos.y, "spark", 6);
          speakRobo(
            "BEEP! Sensor haptic mendeteksi sentuhan bersahabat. Nilai afeksi +10.",
            4000,
            true,
          );
          if (soundOn) {
            try {
              const AudioCtx =
                window.AudioContext || (window as any).webkitAudioContext;
              const ctx = new AudioCtx();
              const playTone = (f: number, d: number, delay: number) => {
                setTimeout(() => {
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.type = "square";
                  osc.frequency.value = f;
                  gain.gain.setValueAtTime(0.4, ctx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    ctx.currentTime + d,
                  );
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.start();
                  osc.stop(ctx.currentTime + d);
                }, delay);
              };
              playTone(700, 0.08, 0);
              playTone(900, 0.08, 60);
            } catch {}
          }
        } else if (action === "charge") {
          setRoboMood("excited");
          setRoboEnergy((e) => Math.min(100, e + 50));
          spawnParticles(roboPos.x + MASCOT_SIZE / 2, roboPos.y, "spark", 12);
          speakRobo(
            "BEEP BOOP! Voltase input 5V masuk. Kapasitas baterai: 100%.",
            4000,
            true,
          );
          if (soundOn) {
            try {
              const AudioCtx =
                window.AudioContext || (window as any).webkitAudioContext;
              const ctx = new AudioCtx();
              const playTone = (f: number, d: number, delay: number) => {
                setTimeout(() => {
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.type = "sine";
                  osc.frequency.value = f;
                  gain.gain.setValueAtTime(0.5, ctx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    ctx.currentTime + d,
                  );
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.start();
                  osc.stop(ctx.currentTime + d);
                }, delay);
              };
              playTone(400, 0.1, 0);
              playTone(500, 0.1, 80);
              playTone(600, 0.1, 160);
              playTone(700, 0.2, 240);
            } catch {}
          }
        }
      }
    };

    window.addEventListener("mascot-action", handleMascotAction);
    return () =>
      window.removeEventListener("mascot-action", handleMascotAction);
  }, [speakNeko, speakRobo, spawnParticles, nekoPos, roboPos]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;
    setIsVisible(true);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const startY = h - MASCOT_SIZE - PADDING;

    let initialNeko = { x: PADDING, y: startY };
    let initialRobo = { x: PADDING + MASCOT_SIZE + 16, y: startY };

    try {
      const storedNeko = localStorage.getItem("nekoBasePos");
      if (storedNeko) {
        const parsed = JSON.parse(storedNeko);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          initialNeko = {
            x: Math.max(PADDING, Math.min(w - MASCOT_SIZE - PADDING, parsed.x)),
            y: Math.max(PADDING, Math.min(h - MASCOT_SIZE - PADDING, parsed.y)),
          };
        }
      }
      const storedRobo = localStorage.getItem("roboBasePos");
      if (storedRobo) {
        const parsed = JSON.parse(storedRobo);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          initialRobo = {
            x: Math.max(PADDING, Math.min(w - MASCOT_SIZE - PADDING, parsed.x)),
            y: Math.max(PADDING, Math.min(h - MASCOT_SIZE - PADDING, parsed.y)),
          };
        }
      }
    } catch (e) {}

    nekoPhysics.current.pos = initialNeko;
    nekoPhysics.current.target = initialNeko;
    roboPhysics.current.pos = initialRobo;
    roboPhysics.current.target = initialRobo;
    setNekoPos({ ...initialNeko });
    setRoboPos({ ...initialRobo });

    let isPhysicsActive = false;
    let frameId = 0;
    let lastUIUpdate = 0;

    const tick = () => {
      const now = Date.now();

      const step = (p: React.MutableRefObject<MascotPhysics>) => {
        const wVal = window.innerWidth;
        const hVal = window.innerHeight;
        const { pos, vel, target, springK, damping, maxSpeed } = p.current;
        const ax = (target.x - pos.x) * springK;
        const ay = (target.y - pos.y) * springK;
        let nvx = (vel.x + ax) * damping;
        let nvy = (vel.y + ay) * damping;
        const spd = Math.sqrt(nvx * nvx + nvy * nvy);
        if (spd > maxSpeed) {
          nvx = (nvx / spd) * maxSpeed;
          nvy = (nvy / spd) * maxSpeed;
        }
        const nx = Math.max(
          PADDING,
          Math.min(wVal - MASCOT_SIZE - PADDING, pos.x + nvx),
        );
        const ny = Math.max(
          PADDING,
          Math.min(hVal - MASCOT_SIZE - PADDING, pos.y + nvy),
        );
        p.current.vel = { x: nvx, y: nvy };
        p.current.pos = { x: nx, y: ny };
      };

      step(nekoPhysics);
      step(roboPhysics);

      if (now - lastUIUpdate > 33) {
        lastUIUpdate = now;
        setNekoPos({ ...nekoPhysics.current.pos });
        setRoboPos({ ...roboPhysics.current.pos });
      }

      // Physics sleeping check
      const nekoTargetDist = Math.hypot(
        nekoPhysics.current.target.x - nekoPhysics.current.pos.x,
        nekoPhysics.current.target.y - nekoPhysics.current.pos.y,
      );
      const roboTargetDist = Math.hypot(
        roboPhysics.current.target.x - roboPhysics.current.pos.x,
        roboPhysics.current.target.y - roboPhysics.current.pos.y,
      );
      const nekoVel = Math.hypot(
        nekoPhysics.current.vel.x,
        nekoPhysics.current.vel.y,
      );
      const roboVel = Math.hypot(
        roboPhysics.current.vel.x,
        roboPhysics.current.vel.y,
      );

      if (
        nekoTargetDist < 0.5 &&
        roboTargetDist < 0.5 &&
        nekoVel < 0.05 &&
        roboVel < 0.05
      ) {
        nekoPhysics.current.pos = { ...nekoPhysics.current.target };
        nekoPhysics.current.vel = { x: 0, y: 0 };
        roboPhysics.current.pos = { ...roboPhysics.current.target };
        roboPhysics.current.vel = { x: 0, y: 0 };

        setNekoPos({ ...nekoPhysics.current.pos });
        setRoboPos({ ...roboPhysics.current.pos });

        isPhysicsActive = false;
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    const wakeUp = () => {
      if (isPhysicsActive) return;
      isPhysicsActive = true;
      frameId = requestAnimationFrame(tick);
    };

    wakeUpRef.current = wakeUp;

    let nekoWanderTimer: ReturnType<typeof setTimeout>;
    let roboWanderTimer: ReturnType<typeof setTimeout>;

    const scheduleWander = (id: "neko" | "robo") => {
      const isNeko = id === "neko";
      const minDelay = isNeko ? 18000 : 12000;
      const variance = isNeko ? 12000 : 10000;
      const delay = minDelay + Math.random() * variance;

      const timer = setTimeout(() => {
        const physics = isNeko ? nekoPhysics : roboPhysics;
        const pause = isNeko ? nekoDragPause : roboDragPause;
        if (Date.now() > pause.current && !socialMode.current) {
          physics.current.target = pickWanderTarget(id);
          wakeUp();
        }
        if (isNeko) nekoWanderTimer = scheduleWander("neko");
        else roboWanderTimer = scheduleWander("robo");
      }, delay);
      return timer;
    };

    nekoWanderTimer = scheduleWander("neko");
    roboWanderTimer = scheduleWander("robo");

    const WALK_THRESHOLD = 0.25;
    const walkInterval = setInterval(() => {
      const ns = Math.hypot(
        nekoPhysics.current.vel.x,
        nekoPhysics.current.vel.y,
      );
      const rs = Math.hypot(
        roboPhysics.current.vel.x,
        roboPhysics.current.vel.y,
      );
      if (ns > WALK_THRESHOLD) setNekoWalkFrame((f) => (f === 0 ? 1 : 0));
      if (rs > WALK_THRESHOLD) setRoboWalkFrame((f) => (f === 0 ? 1 : 0));
      if (Math.abs(nekoPhysics.current.vel.x) > 0.1)
        setNekoFacingRight(nekoPhysics.current.vel.x > 0);
      if (Math.abs(roboPhysics.current.vel.x) > 0.1)
        setRoboFacingRight(roboPhysics.current.vel.x > 0);
    }, 220);

    // Initial wake up
    wakeUp();

    const greetTimer = setTimeout(() => {
      speakRobo(pickRandom(MASCOT_DIALOGUES.robo.greetings));
      setTimeout(
        () => speakNeko(pickRandom(MASCOT_DIALOGUES.neko.greetings), 3500),
        4800,
      );
    }, 1800);

    let lastActivity = Date.now();
    let lastActivityUpdate = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastActivityUpdate > 1000) {
        lastActivityUpdate = now;
        lastActivity = now;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      onActivity();
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keypress", onActivity);
    window.addEventListener("scroll", onActivity);

    const idleInterval = setInterval(() => {
      if (Date.now() - lastActivity > 18000 && !isConversing.current) {
        if (Math.random() < 0.4) runDuet(pickRandom(MASCOT_CONVERSATIONS));
        else {
          const sp = Math.random() < 0.5 ? "neko" : "robo";
          const pool =
            sp === "neko"
              ? MASCOT_DIALOGUES.neko.idle
              : MASCOT_DIALOGUES.robo.idle;
          const mood =
            sp === "neko"
              ? (MASCOT_DIALOGUES.neko.moods as any)[nekoMoodRef.current]
              : (MASCOT_DIALOGUES.robo.moods as any)[roboMoodRef.current];
          const combined = mood ? [...pool, ...mood] : pool;
          speak(sp, pickRandom(combined));
        }
        lastActivity = Date.now();
      }
    }, 3000);

    const cursorProximityInterval = setInterval(() => {
      if (isConversing.current) return;
      const cursor = cursorPos.current;
      const nekoDist = Math.hypot(
        cursor.x - nekoPhysics.current.pos.x,
        cursor.y - nekoPhysics.current.pos.y,
      );
      const roboDist = Math.hypot(
        cursor.x - roboPhysics.current.pos.x,
        cursor.y - roboPhysics.current.pos.y,
      );

      // Face the cursor if within 350px and not moving fast
      const nekoToCursorX = cursor.x - nekoPhysics.current.pos.x;
      if (
        Math.abs(nekoToCursorX) < 350 &&
        Math.abs(nekoPhysics.current.vel.x) < 0.2
      ) {
        setNekoFacingRight(nekoToCursorX > 0);
      }
      const roboToCursorX = cursor.x - roboPhysics.current.pos.x;
      if (
        Math.abs(roboToCursorX) < 350 &&
        Math.abs(roboPhysics.current.vel.x) < 0.2
      ) {
        setRoboFacingRight(roboToCursorX > 0);
      }

      // Neko pounces on cursor if very close
      if (
        nekoDist < 80 &&
        nekoDist > 20 &&
        Math.random() < 0.25 &&
        Date.now() > nekoDragPause.current
      ) {
        const dx = cursor.x - nekoPhysics.current.pos.x;
        const dy = cursor.y - nekoPhysics.current.pos.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          nekoPhysics.current.vel.x += (dx / dist) * 9;
          nekoPhysics.current.vel.y += (dy / dist) * 9 - 6; // jump up slightly
          nekoDragPause.current = Date.now() + 2000;
          setNekoMood("excited");
          wakeUp();
          if (Math.random() < 0.35) {
            speak(
              "neko",
              pickRandom([
                "Dapet! Eh, lolos lagi...",
                "Jangan kabur kamu, mouse!",
                "Nangkep kursor dulu ah!",
                "Ada mainan lewat! Nyaaa~",
              ]),
              2500,
            );
          }
        }
      }

      // Robo scans or dodges cursor if very close
      if (
        roboDist < 75 &&
        Math.random() < 0.25 &&
        Date.now() > roboDragPause.current
      ) {
        spawnParticles(
          roboPhysics.current.pos.x + MASCOT_SIZE / 2,
          roboPhysics.current.pos.y,
          "spark",
          3,
        );
        setRoboMood("excited");

        // Play metallic scan sound
        playSound(880, 0.05, "sine");
        setTimeout(() => playSound(1320, 0.05, "sine"), 40);

        if (Math.random() < 0.35) {
          speak(
            "robo",
            pickRandom([
              "Memindai kursor... Objek organik terdeteksi.",
              "Analisis kursor: Latensi optimal.",
              "BEEP! Jangan halangi sensor optik saya.",
              "Objek asing terdeteksi di koordinat Robo!",
            ]),
            2500,
          );
        }

        // Jump back slightly to avoid the cursor
        const dx = roboPhysics.current.pos.x - cursor.x;
        const dy = roboPhysics.current.pos.y - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          roboPhysics.current.vel.x += (dx / dist) * 7;
          roboPhysics.current.vel.y += (dy / dist) * 7 - 4;
          roboDragPause.current = Date.now() + 2000;
          wakeUp();
        }
      }

      // Periodic proximity warnings (original behavior)
      if (Math.random() < 0.05) {
        if (nekoDist < 120) {
          const pool = (MASCOT_DIALOGUES.neko.moods as any)[
            nekoMoodRef.current
          ];
          if (pool) speak("neko", pickRandom(pool), 3000);
        }
        if (roboDist < 120) {
          const pool = (MASCOT_DIALOGUES.robo.moods as any)[
            roboMoodRef.current
          ];
          if (pool) speak("robo", pickRandom(pool), 3000);
        }
      }
    }, 500);

    const idleFidgetInterval = setInterval(() => {
      if (socialMode.current) return;
      const now = Date.now();
      const nekoPhysicsRef = nekoPhysics.current;
      const roboPhysicsRef = roboPhysics.current;
      const nekoAtTarget =
        Math.hypot(
          nekoPhysicsRef.target.x - nekoPhysicsRef.pos.x,
          nekoPhysicsRef.target.y - nekoPhysicsRef.pos.y,
        ) < 2;
      const roboAtTarget =
        Math.hypot(
          roboPhysicsRef.target.x - roboPhysicsRef.pos.x,
          roboPhysicsRef.target.y - roboPhysicsRef.pos.y,
        ) < 2;
      if (nekoAtTarget && Date.now() > nekoDragPause.current) {
        nekoPhysicsRef.target = {
          x: nekoPhysicsRef.pos.x + (Math.random() - 0.5) * 6,
          y: nekoPhysicsRef.pos.y + (Math.random() - 0.5) * 3,
        };
        wakeUp();
      }
      if (roboAtTarget && Date.now() > roboDragPause.current) {
        roboPhysicsRef.target = {
          x: roboPhysicsRef.pos.x + (Math.random() - 0.5) * 6,
          y: roboPhysicsRef.pos.y + (Math.random() - 0.5) * 3,
        };
        wakeUp();
      }
    }, 4000);

    const moodDecayInterval = setInterval(() => {
      setNekoEnergy((e) => {
        const next = Math.max(0, e - 1);
        setNekoMood((m: Mood) => {
          if (next < 20) return "sleepy";
          if (next > 70) return "happy";
          return m === "excited" ? "happy" : m;
        });
        return next;
      });
      setRoboEnergy((e) => {
        const next = Math.max(0, e - 0.5);
        setRoboMood((m: Mood) => {
          if (next < 20) return "sleepy";
          if (next > 80) return "happy";
          return m === "excited" ? "happy" : m;
        });
        return next;
      });
    }, 30000);

    let scrollThrottleTimer: ReturnType<typeof setTimeout> | null = null;
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const currentScroll = window.scrollY;
      const scrollDiff = currentScroll - lastScroll;
      lastScroll = currentScroll;

      // Apply physical inertia from scroll to the mascots!
      // When page scrolls down (positive scrollDiff), they float/lag upward (-y velocity)
      // When page scrolls up (negative scrollDiff), they float/lag downward (+y velocity)
      if (Math.abs(scrollDiff) > 2) {
        nekoPhysics.current.vel.y -= scrollDiff * 0.08;
        roboPhysics.current.vel.y -= scrollDiff * 0.06;
        wakeUp();
      }

      if (scrollThrottleTimer) return;
      scrollThrottleTimer = setTimeout(() => {
        scrollThrottleTimer = null;
        const delta = Math.abs(window.scrollY - lastScroll);
        if (delta > 50 && Math.random() < 0.06 && !isConversing.current) {
          const sp = Math.random() < 0.5 ? "neko" : "robo";
          speak(sp, pickRandom(MASCOT_DIALOGUES[sp].scroll), 3000);
        }
      }, 150);
    };
    window.addEventListener("scroll", onScroll);

    // Event delegation on mouseover for hover quotes
    const onMouseEnterGlobal = (e: MouseEvent) => {
      if (isConversing.current) return;
      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest(
        ".card, button, a, input, textarea, select, .project-card, [role='button']",
      );
      if (interactive) {
        const lastHoverTime = (window as any).__lastMascotHoverTime || 0;
        const now = Date.now();
        if (now - lastHoverTime > 8000 && Math.random() < 0.18) {
          (window as any).__lastMascotHoverTime = now;
          const sp = Math.random() < 0.5 ? "neko" : "robo";
          speak(sp, pickRandom(MASCOT_DIALOGUES[sp].hover), 3000);
        }
      }
    };
    window.addEventListener("mouseover", onMouseEnterGlobal);

    const themeObserver = new MutationObserver(() => {
      if (!isConversing.current) {
        const dark = document.documentElement.classList.contains("dark");
        const sp = Math.random() < 0.5 ? "neko" : "robo";
        const pool = dark
          ? MASCOT_DIALOGUES[sp].theme.dark
          : MASCOT_DIALOGUES[sp].theme.light;
        speak(sp, pickRandom(pool), 4000);
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    const sectionMap: Record<string, string> = {
      projects: "projects",
      guestbook: "guestbook",
      contact: "contact",
    };
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isConversing.current) {
            const key = sectionMap[entry.target.id];
            if (!key || Math.random() >= 0.35) return;
            const sp = Math.random() < 0.5 ? "neko" : "robo";
            const pool =
              MASCOT_DIALOGUES[sp].sections[
                key as keyof typeof MASCOT_DIALOGUES.robo.sections
              ];
            if (pool?.length) speak(sp, pickRandom(pool), 4000);
          }
        });
      },
      { rootMargin: "-20% 0px -50% 0px" },
    );
    ["projects", "guestbook", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // Event delegation on focusin for input focus quotes
    const onFocusInGlobal = (e: FocusEvent) => {
      if (isConversing.current) return;
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (!target) return;
      const placeholder = target.placeholder || "";
      if (placeholder.includes("Search")) {
        if (Math.random() < 0.6) {
          const sp = Math.random() < 0.5 ? "neko" : "robo";
          speak(sp, pickRandom(MASCOT_DIALOGUES[sp].inputs.search), 3500);
        }
      } else if (
        target.tagName === "TEXTAREA" ||
        placeholder.includes("Nama") ||
        target.name === "name" ||
        target.name === "message"
      ) {
        if (Math.random() < 0.5) {
          const sp = Math.random() < 0.5 ? "neko" : "robo";
          speak(sp, pickRandom(MASCOT_DIALOGUES[sp].inputs.reply), 3500);
        }
      }
    };
    window.addEventListener("focusin", onFocusInGlobal);

    const ambientInterval = setInterval(() => {
      if (Math.random() < 0.3 && !isConversing.current) {
        const sp = Math.random() < 0.5 ? "neko" : "robo";
        const hr = new Date().getHours();
        const pool = [...MASCOT_DIALOGUES[sp].ambient];
        if (hr >= 5 && hr < 12) pool.push(...MASCOT_DIALOGUES[sp].time.morning);
        else if (hr >= 12 && hr < 17)
          pool.push(...MASCOT_DIALOGUES[sp].time.afternoon);
        else if (hr >= 17 && hr < 22)
          pool.push(...MASCOT_DIALOGUES[sp].time.evening);
        else pool.push(...MASCOT_DIALOGUES[sp].time.midnight);
        speak(sp, pickRandom(pool), 4000);
      }
    }, 45000);

    const comboReset = setInterval(() => {
      nekoCombo.current = 0;
      roboCombo.current = 0;
    }, 6000);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(walkInterval);
      clearTimeout(nekoWanderTimer);
      clearTimeout(roboWanderTimer);
      clearTimeout(greetTimer);
      clearInterval(idleInterval);
      clearInterval(cursorProximityInterval);
      clearInterval(idleFidgetInterval);
      clearInterval(moodDecayInterval);
      clearInterval(ambientInterval);
      clearInterval(comboReset);
      if (scrollThrottleTimer) clearTimeout(scrollThrottleTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keypress", onActivity);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mouseover", onMouseEnterGlobal);
      window.removeEventListener("focusin", onFocusInGlobal);
      themeObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [speak, speakNeko, speakRobo, runDuet, pickWanderTarget]);

  const handleNekoCharTyped = useCallback((char: string, index: number) => {
    if (/[a-zA-Z0-9]/.test(char) && index % 3 === 0) {
      playBinaryVoice(char, "neko");
    }
  }, []);

  const handleRoboCharTyped = useCallback((char: string, index: number) => {
    if (/[a-zA-Z0-9]/.test(char) && index % 3 === 0) {
      playBinaryVoice(char, "robo");
    }
  }, []);

  const { displayedText: nekoTypedText, isTyping: nekoIsTyping } =
    useTypingEffect(nekoText, 35, handleNekoCharTyped);

  const { displayedText: roboTypedText, isTyping: roboIsTyping } =
    useTypingEffect(roboText, 35, handleRoboCharTyped);

  if (!isVisible) return null;

  const WALK_THRESHOLD = 0.25;
  const nekoSpeed = Math.hypot(
    nekoPhysics.current.vel.x,
    nekoPhysics.current.vel.y,
  );
  const roboSpeed = Math.hypot(
    roboPhysics.current.vel.x,
    roboPhysics.current.vel.y,
  );
  const nekoIsMoving = nekoSpeed > WALK_THRESHOLD;
  const roboIsMoving = roboSpeed > WALK_THRESHOLD;

  const nekoMoodEmoji = nekoBubble ? MOOD_EMOJI[nekoMood] : "";
  const roboMoodEmoji = roboBubble ? MOOD_EMOJI[roboMood] : "";

  const activeParticles = particles.filter(
    (p) => Date.now() - p.createdAt < 2000,
  );

  return (
    <>
      <MascotCharacter
        id="neko"
        label="Neko - Si Kucing Sarcastic (Klik/Geser aku!)"
        isTalking={nekoTalking}
        isHovered={nekoHovered}
        isSleeping={!nekoHovered && !nekoTalking && !nekoIsMoving}
        isWalking={nekoIsMoving && !nekoTalking}
        facingRight={nekoFacingRight}
        grid={
          nekoTalking
            ? neko_talking
            : nekoIsMoving
              ? nekoWalkFrame === 0
                ? neko_walk_1
                : neko_walk_2
              : nekoHovered
                ? neko_idle
                : neko_sleeping
        }
        colorMap={nekoColors}
        bubble={nekoBubble}
        bubbleTyping={nekoIsTyping ? nekoTypedText : nekoBubble}
        isTyping={nekoIsTyping}
        moodEmoji={nekoMoodEmoji}
        pos={nekoPos}
        onHoverEnter={() => setNekoHovered(true)}
        onHoverLeave={() => setNekoHovered(false)}
        onClick={handleNekoClick}
        onDragEnd={handleNekoDrag}
      />
      <MascotCharacter
        id="robo"
        label="Robo - Si Bot Sistem (Klik/Geser aku!)"
        isTalking={roboTalking}
        isRebooting={roboRebooting}
        isHovered={roboHovered}
        isSleeping={false}
        isWalking={roboIsMoving && !roboTalking}
        facingRight={roboFacingRight}
        grid={
          roboRebooting
            ? robo_sleeping
            : roboTalking
              ? robo_talking
              : roboIsMoving
                ? roboWalkFrame === 0
                  ? robo_walk_1
                  : robo_walk_2
                : robo_idle
        }
        colorMap={roboColors}
        bubble={roboBubble}
        bubbleTyping={roboIsTyping ? roboTypedText : roboBubble}
        isTyping={roboIsTyping}
        moodEmoji={roboMoodEmoji}
        pos={roboPos}
        onHoverEnter={() => setRoboHovered(true)}
        onHoverLeave={() => setRoboHovered(false)}
        onClick={handleRoboClick}
        onDragEnd={handleRoboDrag}
      />

      {activeParticles.map((p) => (
        <div
          key={p.id}
          className={`mascot-particle particle-${p.type}`}
          style={{
            position: "fixed",
            left: p.x,
            top: p.y,
          }}
        />
      ))}

      <style>{`
        .mascot-char {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          padding: 0;
          user-select: none;
          touch-action: none;
          will-change: left, top;
        }
        .mascot-char.sleeping {
          animation: mascot-bob 3.5s ease-in-out infinite;
        }
        .mascot-char.talking {
          filter: drop-shadow(0 0 6px var(--accent));
          animation: mascot-wiggle 0.22s ease infinite;
        }
        .mascot-char.hovered {
          transform: scale(1.1);
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
          animation: none;
        }
        .mascot-bubble-float {
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          line-height: 1.5;
          color: var(--text-primary);
          box-shadow: var(--shadow-md);
          animation: bubble-in 0.15s ease-out forwards;
          pointer-events: none;
          white-space: normal;
          word-break: break-word;
          display: flex;
          align-items: flex-start;
          gap: 2px;
        }
        .bubble-tail {
          position: absolute;
          bottom: -5px;
          width: 8px;
          height: 8px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-strong);
          border-bottom: 1px solid var(--border-strong);
          transform: rotate(45deg);
        }
        .zzz-float {
          position: absolute;
          top: -8px;
          right: -6px;
          font-family: var(--font-mono);
          font-size: 8px;
          font-weight: 700;
          color: var(--text-muted);
          pointer-events: none;
          animation: zzz-up 2.5s linear infinite;
        }
        .reboot-overlay {
          position: absolute;
          inset: 0;
          background: #000;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: reboot-pulse 0.6s ease infinite;
        }
        .reboot-overlay span {
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--accent);
          letter-spacing: 0.05em;
        }
        /* Idle float — gentle breathing bob */
        @keyframes mascot-bob {
          0%, 100% { transform: translateY(0px) scaleX(var(--face-dir, 1)); }
          50%       { transform: translateY(-3px) scaleX(var(--face-dir, 1)); }
        }
        /* Walking — subtle vertical bounce in sync with step */
        .mascot-char.walking {
          animation: walk-bob 0.44s ease-in-out infinite !important;
        }
        @keyframes walk-bob {
          0%, 100% { transform: translateY(0px)   scaleX(var(--face-dir, 1)); }
          25%       { transform: translateY(-2px)  scaleX(var(--face-dir, 1)); }
          50%       { transform: translateY(0px)   scaleX(var(--face-dir, 1)); }
          75%       { transform: translateY(-1px)  scaleX(var(--face-dir, 1)); }
        }
        @keyframes mascot-wiggle {
          0%, 100% { transform: translateY(0)    rotate(0deg); }
          25%       { transform: translateY(-2px) rotate(-1deg); }
          75%       { transform: translateY(-1px) rotate(1deg); }
        }
        @keyframes bubble-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes zzz-up {
          0%   { opacity: 0; transform: translate(0,0) scale(0.7); }
          25%  { opacity: 1; }
          75%  { opacity: 0.7; }
          100% { opacity: 0; transform: translate(14px,-20px) scale(1.4); }
        }
        @keyframes reboot-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .typing-cursor {
          animation: blink-cursor 0.6s step-end infinite;
          color: var(--accent);
          font-size: 10px;
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .bubble-mood {
          flex-shrink: 0;
          font-size: 12px;
          line-height: 1.4;
        }
        .bubble-text {
          display: inline;
        }
        .mascot-particle {
          position: fixed;
          pointer-events: none;
          z-index: 9997;
          animation: particle-fly 1.8s ease-out forwards;
        }
        .particle-heart::before { content: '♥'; font-size: 12px; color: #f43f5e; }
        .particle-star::before { content: '✦'; font-size: 11px; color: #fbbf24; }
        .particle-spark::before { content: '⚡'; font-size: 10px; color: #60a5fa; }
        @keyframes particle-fly {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-70px) scale(0.3); }
        }
      `}</style>
    </>
  );
}
