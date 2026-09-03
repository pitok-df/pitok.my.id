"use client";

let sharedAudioCtx: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;

export const getAudio = () => {
  if (typeof window === "undefined") return { context: null, analyser: null };

  if (!sharedAudioCtx) {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      sharedAudioCtx = new AudioContextClass();
      sharedAnalyser = sharedAudioCtx.createAnalyser();
      sharedAnalyser.fftSize = 64; // Small size for fast, responsive oscilloscope updates
      sharedAnalyser.connect(sharedAudioCtx.destination);
    } catch (err) {
      console.error("Failed to initialize Web Audio context:", err);
    }
  }

  // Resume context if it was suspended (browser auto-play restrictions)
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }

  return { context: sharedAudioCtx, analyser: sharedAnalyser };
};

export const playSound = (
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
) => {
  if (
    typeof window === "undefined" ||
    localStorage.getItem("soundEnabled") !== "true"
  )
    return;

  const { context, analyser } = getAudio();
  if (!context || !analyser) return;

  try {
    const osc = context.createOscillator();
    const gainNode = context.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    // Dynamically read volume from localStorage set by admin features config
    const storedVol =
      typeof window !== "undefined"
        ? localStorage.getItem("audioVolume")
        : null;
    const volume = storedVol !== null ? parseFloat(storedVol) : 0.7;
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + duration,
    );

    osc.connect(gainNode);
    gainNode.connect(analyser); // Connected to the analyser for real-time visualization

    osc.start();
    osc.stop(context.currentTime + duration);
  } catch (err) {
    console.error("Audio playback error:", err);
  }
};
