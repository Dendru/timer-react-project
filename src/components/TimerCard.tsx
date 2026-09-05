import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import CircularTimer from "./CircularTimer";
import TimeDial from "./TimeDial";
import PresetPanel from "./PresetPanel";
import TimerControls from "./TimerControls";
import { hmsToMs, msToHms } from "../lib/formatTime";
import { usePresets } from "../hooks/usePresets";
import type { UserPreset } from "../lib/presets";
import type { TimerStatus } from "../hooks/useTimer";

type Props = {
  remainingMs: number;
  durationMs: number;
  progress: number;
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetDuration: (ms: number) => void;
  onPreset: () => void;
};

export default function TimerCard({
  remainingMs,
  durationMs,
  progress,
  status,
  onStart,
  onPause,
  onReset,
  onSetDuration,
  onPreset,
}: Props) {
  const hms = msToHms(durationMs);
  const locked = status === "running";
  const { presets, addPreset, removePreset } = usePresets();
  const [presetId, setPresetId] = useState<string | null>(null);

  const activePreset = useMemo(
    () => presets.find((preset) => preset.id === presetId),
    [presets, presetId],
  );

  const applyHms = (next: { h: number; m: number; s: number }) => {
    onSetDuration(hmsToMs(next.h, next.m, next.s));
    const match = presets.find(
      (p) => p.hours === next.h && p.minutes === next.m && p.seconds === next.s,
    );
    setPresetId(match?.id ?? null);
  };

  const handleDial = (part: "hours" | "minutes" | "seconds", value: number) => {
    const current = msToHms(durationMs);
    const map = { hours: "h", minutes: "m", seconds: "s" } as const;
    applyHms({
      h: current.h,
      m: current.m,
      s: current.s,
      [map[part]]: value,
    });
  };

  const handlePreset = (preset: UserPreset) => {
    setPresetId(preset.id);
    onSetDuration(hmsToMs(preset.hours, preset.minutes, preset.seconds));
    onPreset();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2rem] border border-white/25 bg-white/20 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.18)] backdrop-blur-md md:p-10"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800/80">
            Управляй временем - управляй жизнью.
          </p>
          <h2 className="font-display mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
            Dendru's Timer
          </h2>
        </div>
        <span className="rounded-full border border-white/30 bg-white/40 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-700">
          {activePreset?.label ?? "Базовый"}
        </span>
      </div>

      <CircularTimer remainingMs={remainingMs} progress={progress} status={status} />

      <div className="mt-8 space-y-6">
        <TimeDial
          hours={hms.h}
          minutes={hms.m}
          seconds={hms.s}
          disabled={locked}
          onChange={handleDial}
        />
        <PresetPanel
          presets={presets}
          activeId={presetId ?? undefined}
          disabled={locked}
          hours={hms.h}
          minutes={hms.m}
          seconds={hms.s}
          onSelect={handlePreset}
          onCreate={(label) => {
            const created = addPreset({
              label,
              hours: hms.h,
              minutes: hms.m,
              seconds: hms.s,
            });
            setPresetId(created.id);
            onPreset();
          }}
          onDelete={(id) => {
            removePreset(id);
            if (presetId === id) setPresetId(null);
          }}
        />
        <TimerControls
          status={status}
          canStart={durationMs > 0 && remainingMs > 0}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
        />
      </div>
    </motion.section>
  );
}
