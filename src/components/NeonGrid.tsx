import { motion, useScroll, useTransform } from "framer-motion";

const HEXES = [
  { x: "8%", y: "18%", size: 86, delay: 0 },
  { x: "78%", y: "12%", size: 120, delay: 0.4 },
  { x: "18%", y: "62%", size: 64, delay: 1.1 },
  { x: "86%", y: "58%", size: 96, delay: 0.7 },
  { x: "48%", y: "78%", size: 72, delay: 1.6 },
];

export default function NeonGrid() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 180]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ y }}
    >
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
