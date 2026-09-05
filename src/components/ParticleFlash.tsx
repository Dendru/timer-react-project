import { AnimatePresence, motion } from "framer-motion";

type Props = {
  active: boolean;
};

const PARTICLES = Array.from({ length: 42 }, (_, i) => i);

export default function ParticleFlash({ active }: Props) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-amber-200/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.15, 0] }}
            transition={{ duration: 0.7, times: [0, 0.12, 0.4, 1] }}
          />
          {PARTICLES.map((i) => {
            const angle = (i / PARTICLES.length) * Math.PI * 2;
            const dist = 180 + (i % 7) * 70;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            const mint = i % 2 === 0;
            return (
              <motion.span
                key={i}
                className={`absolute left-1/2 top-1/2 h-2 w-2 rounded-full ${
                  mint ? "bg-emerald-300" : "bg-amber-300"
                }`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x, y, opacity: 0, scale: 0.2 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: (i % 5) * 0.02 }}
                style={{
                  boxShadow: mint
                    ? "0 0 16px #34d399"
                    : "0 0 16px #fbbf24",
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
