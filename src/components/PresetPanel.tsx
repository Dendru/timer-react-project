import { useState } from "react";
import { motion } from "framer-motion";
import { formatClock, hmsToMs } from "../lib/formatTime";
import type { UserPreset } from "../lib/presets";

type Props = {
  presets: UserPreset[];
  activeId?: string;
  disabled?: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  onSelect: (preset: UserPreset) => void;
  onCreate: (label: string) => void;
  onDelete: (id: string) => void;
};

export default function PresetPanel({
  presets,
  activeId,
  disabled,
  hours,
  minutes,
  seconds,
  onSelect,
  onCreate,
  onDelete,
}: Props) {
  const [name, setName] = useState("");
  const durationMs = hmsToMs(hours, minutes, seconds);
  const canSave = !disabled && name.trim().length > 0 && durationMs > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          disabled={disabled}
          maxLength={32}
          placeholder="Название пресета, например «Растяжка»"
          onChange={(e) => setName(e.target.value)}
          className="min-w-0 flex-1 rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-amber-300/80"
        />
        <motion.button
          type="button"
          whileTap={canSave ? { scale: 0.97 } : undefined}
          disabled={!canSave}
          onClick={() => {
            onCreate(name.trim());
            setName("");
          }}
          className="rounded-2xl bg-slate-900 px-5 py-3 font-display text-sm font-semibold tracking-wide text-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Сохранить
        </motion.button>
      </div>

      {presets.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/25 bg-white/10 px-4 py-5 text-sm text-slate-600">
          Пресетов пока нет. Выставь время ползунками, дай имя и нажми «Сохранить» —
          потом его можно будет выбрать одним нажатием.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {presets.map((preset) => {
            const active = activeId === preset.id;
            return (
              <div
                key={preset.id}
                className={`flex items-stretch overflow-hidden rounded-2xl border ${
                  active
                    ? "border-amber-300/80 bg-amber-200/30 shadow-[0_0_24px_rgba(251,191,36,0.25)]"
                    : "border-white/20 bg-white/15"
                }`}
              >
                <motion.button
                  type="button"
                  disabled={disabled}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(preset)}
                  className="min-w-0 flex-1 px-4 py-3 text-left disabled:opacity-50"
                >
                  <span className="block truncate font-display text-sm font-semibold text-slate-900">
                    {preset.label}
                  </span>
                  <span className="mt-1 block font-clock text-xs tracking-wider text-slate-600">
                    {formatClock(
                      hmsToMs(preset.hours, preset.minutes, preset.seconds),
                    )}
                  </span>
                </motion.button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onDelete(preset.id)}
                  className="border-l border-white/20 px-3 text-sm text-slate-500 hover:bg-white/20 hover:text-rose-600 disabled:opacity-40"
                  aria-label={`Удалить пресет ${preset.label}`}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
