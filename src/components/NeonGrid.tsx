import { motion, useScroll, useTransform } from "framer-motion";
import type { TimerStatus } from "../hooks/useTimer";

type Props = {
  status: TimerStatus;
};

const HEXES = [
  { x: "8%", y: "18%", size: 86, delay: 0 },
  { x: "78%", y: "12%", size: 120, delay: 0.4 },
  { x: "18%", y: "62%", size: 64, delay: 1.1 },
  { x: "86%", y: "58%", size: 96, delay: 0.7 },
  { x: "48%", y: "78%", size: 72, delay: 1.6 },
];

export default function NeonGrid({ status }: Props) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 180]);
  const running = status === "running";

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ y }}
    >
      <motion.div
        className="absolute -left-24 top-10 h-[28rem] w-[28rem] rounded-full bg-emerald-300/45 blur-[120px]"
        animate={{
          opacity: running ? [0.45, 0.95, 0.45] : 0.55,
          scale: running ? [1, 1.12, 1] : 1,
        }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 top-40 h-[32rem] w-[32rem] rounded-full bg-amber-300/40 blur-[130px]"
        animate={{
          opacity: running ? [0.4, 0.9, 0.4] : 0.5,
          scale: running ? [1.05, 0.92, 1.05] : 1,
        }}
        transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-sky-300/30 blur-[110px]"
        animate={{
          opacity: running ? [0.35, 0.8, 0.35] : 0.4,
        }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(rgba(167,243,208,0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(253,230,138,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 80%)",
        }}
      />

      {HEXES.map((hex) => (
        <motion.div
          key={`${hex.x}-${hex.y}`}
          className="absolute"
          style={{ left: hex.x, top: hex.y, width: hex.size, height: hex.size }}
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{
            duration: 7 + hex.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: hex.delay,
          }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <polygon
              points="50,4 93,27 93,73 50,96 7,73 7,27"
              fill="none"
              stroke="rgba(167,243,208,0.45)"
              strokeWidth="1.5"
            />
            <polygon
              points="50,18 80,35 80,65 50,82 20,65 20,35"
              fill="rgba(251,191,36,0.08)"
              stroke="rgba(251,191,36,0.35)"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}
