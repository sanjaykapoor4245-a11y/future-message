import {
  type Capsule,
  formatCountdown,
  formatUnlockDate,
  formatUnlockTime,
  getCountdown,
  isUnlocked,
} from "@/lib/capsules";
import { Lock, Unlock } from "lucide-react";
import { useEffect, useState } from "react";

export function CapsuleCard({ capsule }: { capsule: Capsule }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const unlocked = isUnlocked(capsule, now);
  const countdown = getCountdown(capsule.unlockAt, now);

  return (
    <article
      data-ocid="capsule.card"
      className={`animate-card-in rounded-2xl border bg-card p-5 transition-smooth ${
        unlocked ? "glow-accent" : "glow-primary"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
            {capsule.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {unlocked ? "Unlocked" : "Unlocks"}:{" "}
            {formatUnlockDate(capsule.unlockAt)},{" "}
            {formatUnlockTime(capsule.unlockAt)}
          </p>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            unlocked ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
          }`}
        >
          {unlocked ? (
            <Unlock className="size-3.5" aria-hidden="true" />
          ) : (
            <Lock className="size-3.5" aria-hidden="true" />
          )}
          {unlocked ? "Open" : "Locked"}
        </span>
      </div>

      {unlocked ? (
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
          {capsule.message}
        </p>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-background/60 px-4 py-4">
          <p className="font-mono text-2xl font-medium tracking-tight text-primary">
            {formatCountdown(countdown)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Locked — your future self will see this later.
          </p>
        </div>
      )}
    </article>
  );
}
