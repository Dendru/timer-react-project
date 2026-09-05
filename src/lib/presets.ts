export type UserPreset = {
  id: string;
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
};

const STORAGE_KEY = "dendru-timer-presets";

export function loadPresets(): UserPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPreset);
  } catch {
    return [];
  }
}

export function savePresets(presets: UserPreset[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

function isPreset(value: unknown): value is UserPreset {
  if (!value || typeof value !== "object") return false;
  const item = value as UserPreset;
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.hours === "number" &&
    typeof item.minutes === "number" &&
    typeof item.seconds === "number"
  );
}
