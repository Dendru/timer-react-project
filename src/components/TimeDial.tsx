import { pad2 } from "../lib/formatTime";

type Props = {
  hours: number;
  minutes: number;
  seconds: number;
  disabled?: boolean;
  onChange: (part: "hours" | "minutes" | "seconds", value: number) => void;
};

const DIALS = [
  { key: "hours" as const, label: "Часы", max: 12 },
  { key: "minutes" as const, label: "Минуты", max: 59 },
  { key: "seconds" as const, label: "Секунды", max: 59 },
];

export default function TimeDial({
  hours,
  minutes,
  seconds,
  disabled,
  onChange,
}: Props) {
  const values = { hours, minutes, seconds };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {DIALS.map((dial) => (
        <label
          key={dial.key}
          className="rounded-2xl border border-white/25 bg-white/25 px-4 py-3"
        >
          <span className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              {dial.label}
            </span>
            <span className="font-display text-xl text-emerald-800">
              {pad2(values[dial.key])}
            </span>
          </span>
          <input
            className="neon-slider mt-3"
            type="range"
            min={0}
            max={dial.max}
            value={values[dial.key]}
            disabled={disabled}
            onChange={(e) => onChange(dial.key, Number(e.target.value))}
          />
        </label>
      ))}
    </div>
  );
}
