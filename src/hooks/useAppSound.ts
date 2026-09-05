import { useCallback, useEffect, useRef } from "react";

export type ClickKind = "start" | "pause" | "reset" | "preset";

type OscHandle = {
  osc: OscillatorNode;
  gain: GainNode;
};

function getAudioContext(): AudioContext | null {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  return new AudioCtx();
}

function playTone(
  ctx: AudioContext,
  options: {
    freq: number;
    start: number;
    duration: number;
    type?: OscillatorType;
    peak?: number;
    freqEnd?: number;
  },
): OscHandle {
  const {
    freq,
    start,
    duration,
    type = "sine",
    peak = 0.07,
    freqEnd,
  } = options;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = type;
  filter.type = "lowpass";
  filter.frequency.value = 2200;

  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), start + duration);
  }

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.04);

  return { osc, gain };
}

function playBell(ctx: AudioContext, start: number): OscHandle[] {
  const notes = [
    { freq: 392.0, peak: 0.07, duration: 1.8 },
    { freq: 523.25, peak: 0.09, duration: 2.0 },
    { freq: 783.99, peak: 0.045, duration: 1.6 },
  ];
  return notes.map((note) =>
    playTone(ctx, {
      freq: note.freq,
      start,
      duration: note.duration,
      peak: note.peak,
    }),
  );
}

export function useAppSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const alarmRef = useRef<OscHandle[]>([]);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = getAudioContext();
    }
    return ctxRef.current;
  }, []);

  const stopAlarm = useCallback(() => {
    const now = ctxRef.current?.currentTime ?? 0;
    for (const node of alarmRef.current) {
      try {
        node.gain.gain.cancelScheduledValues(now);
        node.gain.gain.setValueAtTime(Math.max(node.gain.gain.value, 0.0001), now);
        node.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        node.osc.stop(now + 0.1);
      } catch {
        /* already stopped */
      }
    }
    alarmRef.current = [];
  }, []);

  const play = useCallback(
    (kind: ClickKind) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      void ctx.resume();
      stopAlarm();

      const t = ctx.currentTime;
      if (kind === "start") {
        playTone(ctx, { freq: 261.63, start: t, duration: 0.16, peak: 0.06 });
        playTone(ctx, { freq: 392.0, start: t + 0.08, duration: 0.22, peak: 0.07 });
        return;
      }
      if (kind === "pause") {
        playTone(ctx, { freq: 329.63, start: t, duration: 0.18, peak: 0.05, freqEnd: 196 });
        return;
      }
      if (kind === "reset") {
        playTone(ctx, {
          freq: 164.81,
          start: t,
          duration: 0.2,
          type: "triangle",
          peak: 0.05,
        });
        return;
      }
      playTone(ctx, { freq: 440, start: t, duration: 0.14, peak: 0.045 });
    },
    [ensureCtx, stopAlarm],
  );

  const playComplete = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    void ctx.resume();
    stopAlarm();

    const t = ctx.currentTime;
    const nodes: OscHandle[] = [];

    nodes.push(
      playTone(ctx, {
        freq: 110,
        start: t,
        duration: 8.4,
        type: "sine",
        peak: 0.028,
      }),
    );

    for (const offset of [0, 1.7, 3.4, 5.1, 6.8]) {
      nodes.push(...playBell(ctx, t + offset));
    }

    alarmRef.current = nodes;
  }, [ensureCtx, stopAlarm]);

  useEffect(() => () => stopAlarm(), [stopAlarm]);

  return { play, playComplete, stopAlarm };
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
