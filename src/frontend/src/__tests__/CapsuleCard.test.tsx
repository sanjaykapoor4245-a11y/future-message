import "@testing-library/jest-dom/vitest";
import { CapsuleCard } from "@/components/CapsuleCard";
import type { Capsule } from "@/lib/capsules";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function makeCapsule(overrides: Partial<Capsule> = {}): Capsule {
  return {
    id: "1",
    title: "Graduation",
    message: "You made it!",
    unlockAt: new Date("2030-01-01T00:00:00Z"),
    ...overrides,
  };
}

describe("CapsuleCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the title and unlock date for a locked capsule", () => {
    render(<CapsuleCard capsule={makeCapsule()} />);
    expect(screen.getByText("Graduation")).toBeInTheDocument();
    expect(screen.getByText(/Unlocks:/)).toBeInTheDocument();
    expect(screen.getByText("Locked")).toBeInTheDocument();
  });

  it("hides the message and shows the locked placeholder for a locked capsule", () => {
    render(<CapsuleCard capsule={makeCapsule()} />);
    expect(screen.queryByText("You made it!")).not.toBeInTheDocument();
    expect(
      screen.getByText("Locked — your future self will see this later."),
    ).toBeInTheDocument();
  });

  it("reveals the full message for an unlocked capsule", () => {
    render(
      <CapsuleCard
        capsule={makeCapsule({ unlockAt: new Date("2020-01-01T00:00:00Z") })}
      />,
    );
    expect(screen.getByText("You made it!")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(
      screen.queryByText("Locked — your future self will see this later."),
    ).not.toBeInTheDocument();
  });

  it("shows a live countdown that ticks down over time", () => {
    const unlockAt = new Date("2026-01-01T00:01:00Z");
    render(<CapsuleCard capsule={makeCapsule({ unlockAt })} />);
    // 60 seconds remaining at t=0
    expect(screen.getByText("0y 0m 0d | 0h 1m 0s")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("0y 0m 0d | 0h 0m 59s")).toBeInTheDocument();
  });

  it("transitions a capsule to unlocked when the countdown reaches zero", () => {
    const unlockAt = new Date("2026-01-01T00:00:01Z");
    render(<CapsuleCard capsule={makeCapsule({ unlockAt })} />);
    expect(screen.getByText("Locked")).toBeInTheDocument();
    expect(screen.queryByText("You made it!")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("You made it!")).toBeInTheDocument();
  });
});
