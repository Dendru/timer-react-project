import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import NeonGrid from "./components/NeonGrid";
import ParallaxTypography from "./components/ParallaxTypography";
import ParticleFlash from "./components/ParticleFlash";
import TimerCard from "./components/TimerCard";
import { useAppSound } from "./hooks/useAppSound";
import { useTimer } from "./hooks/useTimer";

const HINTS = [
  {
    title: "Создай",
    copy: "Выставь часы, минуты и секунды, дай пресету имя и сохрани. Он останется в браузере.",
  },
  {
    title: "Выбери",
    copy: "Готовые пресеты всегда под рукой: нажал — и таймер уже с нужным временем.",
  },
  {
    title: "Держи ритм",
    copy: "Старт, пауза, сброс. В конце — спокойный колокольный сигнал на несколько секунд.",
  },
];

export default function App() {
  const timer = useTimer(10 * 60 * 1000);
  const { play, playComplete, stopAlarm } = useAppSound();
  const [flash, setFlash] = useState(false);
  const completeFired = useRef(false);

  useEffect(() => {
    if (timer.status !== "complete") {
      completeFired.current = false;
      return;
    }
    if (completeFired.current) return;
    completeFired.current = true;
    playComplete();
    setFlash(true);
    const id = window.setTimeout(() => setFlash(false), 1100);
    return () => window.clearTimeout(id);
  }, [timer.status, playComplete]);

  return (
    <motion.div
      className="relative min-h-[150vh] bg-[#3c4a63]"
      animate={
        timer.status === "complete"
          ? { x: [0, -14, 12, -10, 8, -4, 0], y: [0, 8, -8, 6, -4, 0] }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <NeonGrid status={timer.status} />
      <ParallaxTypography />
      <div className="noise-overlay" />
      <ParticleFlash active={flash} />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-4 pb-24 pt-10 md:px-8 md:pt-16">
        <header className="mb-10 flex items-center justify-between">
          <p className="font-display text-sm tracking-[0.28em] text-amber-200">
            DENDRU's
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-200">
            Timer
          </p>
        </header>

        <TimerCard
          remainingMs={timer.remainingMs}
          durationMs={timer.durationMs}
          progress={timer.progress}
          status={timer.status}
          onStart={() => {
            play("start");
            timer.start();
          }}
          onPause={() => {
            play("pause");
            timer.pause();
          }}
          onReset={() => {
            play("reset");
            timer.reset();
          }}
          onSetDuration={(ms) => {
            stopAlarm();
            timer.setDuration(ms);
          }}
          onPreset={() => play("preset")}
        />

        <section className="mt-20 grid gap-4 md:grid-cols-3">
          {HINTS.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/25 bg-white/20 p-6 backdrop-blur-md"
            >
              <h3 className="font-display text-lg tracking-widest text-emerald-800">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {item.copy}
              </p>
            </article>
          ))}
        </section>
      </div>
    </motion.div>
  );
}
