import {
  formatCountdown,
  getCountdown,
  isUnlocked,
  timestampToDate,
} from "@/lib/capsules";
import { describe, expect, it } from "vitest";

describe("capsules lib", () => {
  it("timestampToDate converts nanoseconds to a Date", () => {
    const ms = 1_700_000_000_000;
    const date = timestampToDate(BigInt(ms) * 1_000_000n);
    expect(date?.getTime()).toBe(ms);
  });

  it("isUnlocked is true once now passes unlockAt", () => {
    const unlockAt = new Date("2030-01-01T00:00:00Z");
    expect(
      isUnlocked(
        { id: "1", title: "t", message: "m", unlockAt },
        new Date("2029-12-31T00:00:00Z"),
      ),
    ).toBe(false);
    expect(
      isUnlocked(
        { id: "1", title: "t", message: "m", unlockAt },
        new Date("2030-01-01T00:00:00Z"),
      ),
    ).toBe(true);
    expect(
      isUnlocked(
        { id: "1", title: "t", message: "m", unlockAt },
        new Date("2030-01-02T00:00:00Z"),
      ),
    ).toBe(true);
  });

  it("getCountdown computes days/hours/minutes/seconds remaining", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const unlockAt = new Date("2026-01-02T01:02:03Z");
    const c = getCountdown(unlockAt, now);
    expect(c.days).toBe(1);
    expect(c.hours).toBe(1);
    expect(c.minutes).toBe(2);
    expect(c.seconds).toBe(3);
  });

  it("getCountdown clamps to zero once the time has passed", () => {
    const now = new Date("2026-01-02T00:00:00Z");
    const unlockAt = new Date("2026-01-01T00:00:00Z");
    const c = getCountdown(unlockAt, now);
    expect(c.days).toBe(0);
    expect(c.hours).toBe(0);
    expect(c.minutes).toBe(0);
    expect(c.seconds).toBe(0);
  });

  it("formatCountdown renders a compact days/hours/minutes/seconds string", () => {
    expect(
      formatCountdown({
        years: 0,
        months: 0,
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
      }),
    ).toBe("0y 0m 1d | 2h 3m 4s");
  });
});
