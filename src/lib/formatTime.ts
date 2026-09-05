export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function msToHms(ms: number): { h: number; m: number; s: number } {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h, m, s };
}

export function formatClock(ms: number): string {
  const { h, m, s } = msToHms(ms);
  if (h > 0) return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  return `${pad2(m)}:${pad2(s)}`;
}

export function hmsToMs(h: number, m: number, s: number): number {
  return (h * 3600 + m * 60 + s) * 1000;
}
