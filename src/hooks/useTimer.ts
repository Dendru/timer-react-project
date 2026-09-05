import { useCallback, useEffect, useRef, useState } from "react";

export type TimerStatus = "idle" | "running" | "paused" | "complete";

type TimerState = {
  durationMs: number;
  remainingMs: number;
  status: TimerStatus;
};

export function useTimer(initialMs = 4 * 60 * 1000) {
  const [state, setState] = useState<TimerState>({
    durationMs: initialMs,
    remainingMs: initialMs,
    status: "idle",
  });

  const endAtRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (endAtRef.current == null) return;
    const left = Math.max(0, endAtRef.current - Date.now());
    if (left <= 0) {
      setState((prev) => ({
        ...prev,
        remainingMs: 0,
        status: "complete",
      }));
      endAtRef.current = null;
      return;
    }
    setState((prev) => ({ ...prev, remainingMs: left }));
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.remainingMs <= 0) return prev;
      endAtRef.current = Date.now() + prev.remainingMs;
      frameRef.current = requestAnimationFrame(tick);
      return { ...prev, status: "running" };
    });
  }, [tick]);

  const pause = useCallback(() => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    if (endAtRef.current != null) {
      const left = Math.max(0, endAtRef.current - Date.now());
      endAtRef.current = null;
      setState((prev) => ({
        ...prev,
        remainingMs: left,
        status: left <= 0 ? "complete" : "paused",
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      status: prev.remainingMs <= 0 ? "complete" : "paused",
    }));
  }, []);

  const reset = useCallback(() => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    endAtRef.current = null;
    setState((prev) => ({
      ...prev,
      remainingMs: prev.durationMs,
      status: "idle",
    }));
  }, []);

  const setDuration = useCallback((ms: number) => {
    const next = Math.max(0, ms);
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    endAtRef.current = null;
    setState({
      durationMs: next,
      remainingMs: next,
      status: "idle",
    });
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const progress =
    state.durationMs === 0 ? 0 : state.remainingMs / state.durationMs;

  return {
    ...state,
    progress,
    isRunning: state.status === "running",
    start,
    pause,
    reset,
    setDuration,
  };
}
