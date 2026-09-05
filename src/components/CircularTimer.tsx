import { motion } from "framer-motion";
import { formatClock } from "../lib/formatTime";
import type { TimerStatus } from "../hooks/useTimer";

type Props = {
  remainingMs: number;
  progress: number;
  status: TimerStatus;
};

const SIZE = 320;
const STROKE = 10;
const RADIUS = (SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularTimer({ remainingMs, progress, status }: Props) {
  const offset = CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, progress)));
  const complete = status === "complete";
  const running = status === "running";

  return (
    <div className="relative mx-auto aspect-square w-[min(78vw,20rem)]">
      <motion.div
        className="absolute inset-6 rounded-full"
        animate={{
          boxShadow: complete
            ? [
                "0 0 0px rgba(251,191,36,0.15)",
                "0 0 80px rgba(251,191,36,0.7)",
                "0 0 20px rgba(52,211,153,0.45)",
              ]
            : running
              ? [
                  "0 0 24px rgba(52,211,153,0.35)",
                  "0 0 48px rgba(251,191,36,0.4)",
                  "0 0 24px rgba(52,211,153,0.35)",
                ]
              : "0 0 28px rgba(52,211,153,0.22)",
        }}
        transition={{ duration: running ? 2.4 : 0.8, repeat: running ? Infinity : 0 }}
      />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="relative h-full w-full -rotate-90"
      >
        <defs>
          <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i / 60) * Math.PI * 2;
          const inner = i % 5 === 0 ? RADIUS - 14 : RADIUS - 8;
          const cx = SIZE / 2;
          const cy = SIZE / 2;
          return (
            <line
              key={i}
              x1={cx + Math.cos(angle) * inner}
              y1={cy + Math.sin(angle) * inner}
              x2={cx + Math.cos(angle) * (RADIUS - 2)}
              y2={cy + Math.sin(angle) * (RADIUS - 2)}
              stroke={i % 5 === 0 ? "rgba(15,23,42,0.35)" : "rgba(15,23,42,0.16)"}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          );
        })}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(15,23,42,0.12)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#ring)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-150 ease-linear"
          style={{ filter: "drop-shadow(0 0 8px rgba(52,211,153,0.7))" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-800/80">
          {complete ? "готово" : running ? "тренировка" : status === "paused" ? "пауза" : "ожидание"}
        </p>
        <motion.p
          className="font-clock text-[clamp(2.2rem,8vw,3.4rem)] font-bold tabular-nums tracking-wider text-slate-900"
          animate={complete ? { scale: [1, 1.08, 1], color: ["#0f172a", "#d97706", "#047857"] } : { scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {formatClock(remainingMs)}
        </motion.p>
      </div>
    </div>
  );
}
