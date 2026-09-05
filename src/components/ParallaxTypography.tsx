import { motion, useScroll, useTransform } from "framer-motion";

const WORDS = [
  { text: "СТАРТУЙ", top: "8%", left: "-4%", size: "text-[16vw]" },
  { text: "ЖГИ", top: "38%", left: "10%", size: "text-[18vw]" },
  { text: "ДОБИВАЙСЯ", top: "68%", left: "-6%", size: "text-[12vw]" },
];

export default function ParallaxTypography() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, -220]);
  const opacity = useTransform(scrollY, [0, 700], [0.22, 0.08]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      style={{ y, opacity }}
    >
      {WORDS.map((word) => (
        <div
          key={word.text}
          className={`font-display absolute font-extrabold tracking-tighter text-white/50 ${word.size} whitespace-nowrap`}
          style={{ top: word.top, left: word.left }}
        >
          {word.text}
        </div>
      ))}
    </motion.div>
  );
}
