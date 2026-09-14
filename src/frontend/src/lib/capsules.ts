export interface Capsule {
  id: string;
  title: string;
  message: string;
  unlockAt: Date;
}

export interface Countdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isUnlocked(capsule: Capsule, now: Date): boolean {
  return now.getTime() >= capsule.unlockAt.getTime();
}

export function getCountdown(unlockAt: Date, now: Date): Countdown {
  let diff = Math.max(0, unlockAt.getTime() - now.getTime());
  const seconds = Math.floor(diff / 1000);
  diff -= seconds * 1000;
  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  const months = Math.floor(days / 30);
  const remDays = days % 30;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return {
    years,
    months: remMonths,
    days: remDays,
    hours: remHours,
    minutes: remMinutes,
    seconds: remSeconds,
  };
}

export function formatCountdown(c: Countdown): string {
  const y = `${c.years}y`;
  const m = `${c.months}m`;
  const d = `${c.days}d`;
  const h = `${c.hours}h`;
  const min = `${c.minutes}m`;
  const s = `${c.seconds}s`;
  return `${y} ${m} ${d} | ${h} ${min} ${s}`;
}

export function formatUnlockDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatUnlockTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
