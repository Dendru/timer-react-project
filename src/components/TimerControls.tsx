import { motion } from "framer-motion";
import type { TimerStatus } from "../hooks/useTimer";

type Props = {
  status: TimerStatus;
  canStart: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export default function TimerControls({
  status,
  canStart,
  onStart,
  onPause,
  onReset,
}: Props) {
  const running = status === "running";

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={running ? onPause : onStart}
        disabled={!running && !canStart}
        className="relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-sky-300 px-8 py-3 font-display text-sm font-bold tracking-[0.12em] text-slate-900 disabled:opacity-40"
      >
        <motion.span
          className="absolute inset-0 bg-white/30"
          animate={running ? { x: ["-120%", "120%"] } : { x: "-120%" }}
          transition={{ duration: 1.4, repeat: running ? Infinity : 0 }}
        />
        <span className="relative">{running ? "ПАУЗА" : "СТАРТ"}</span>
      </motion.button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={onReset}
        className="rounded-full border border-white/30 bg-white/30 px-7 py-3 font-display text-sm font-semibold tracking-[0.12em] text-slate-800 hover:border-amber-300/70"
      >
        СБРОС
      </motion.button>
    </div>
  );
}
