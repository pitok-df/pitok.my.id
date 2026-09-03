"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useTypingEffect(
  text: string,
  speed = 40,
  onCharTyped?: (char: string, index: number) => void,
) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCharTypedRef = useRef(onCharTyped);

  useEffect(() => {
    onCharTypedRef.current = onCharTyped;
  }, [onCharTyped]);

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    indexRef.current = 0;
    setIsTyping(true);

    const type = () => {
      if (indexRef.current < text.length) {
        const char = text[indexRef.current];
        setDisplayedText(text.slice(0, indexRef.current + 1));
        if (onCharTypedRef.current) {
          onCharTypedRef.current(char, indexRef.current);
        }
        indexRef.current++;
        timerRef.current = setTimeout(type, speed);
      } else {
        setIsTyping(false);
      }
    };

    type();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed]);

  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayedText(text);
    setIsTyping(false);
  }, [text]);

  return { displayedText, isTyping, skip };
}
