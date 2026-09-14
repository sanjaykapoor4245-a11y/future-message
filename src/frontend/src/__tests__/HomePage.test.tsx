import "@testing-library/jest-dom/vitest";
import { HomePage } from "@/pages/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: mockActor, isFetching: false }),
}));

vi.mock("@/backend", () => ({
  createActor: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: { children: React.ReactNode; to: string }) => (
    <a href={props.to} {...props}>
      {children}
    </a>
  ),
}));

const mockActor = {
  listCapsules: vi.fn(),
  createCapsule: vi.fn(),
  getCapsule: vi.fn(),
};

function renderHome() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the empty state with a Create Capsule call-to-action when there are no capsules", async () => {
    mockActor.listCapsules.mockResolvedValue([]);
    renderHome();
    expect(await screen.findByText("No capsules yet")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create your first capsule/i }),
    ).toBeInTheDocument();
  });

  it("lists saved capsules as cards", async () => {
    mockActor.listCapsules.mockResolvedValue([
      {
        id: 1n,
        title: "Graduation",
        message: "You made it!",
        unlockAt: 1893456000000000000n,
      },
      {
        id: 2n,
        title: "Retirement",
        message: "Enjoy!",
        unlockAt: 1893456000000000000n,
      },
    ]);
    renderHome();
    expect(await screen.findByText("Graduation")).toBeInTheDocument();
    expect(screen.getByText("Retirement")).toBeInTheDocument();
    expect(screen.getByText("2 sealed")).toBeInTheDocument();
  });

  it("shows a locked capsule's placeholder message", async () => {
    mockActor.listCapsules.mockResolvedValue([
      {
        id: 1n,
        title: "Graduation",
        message: "You made it!",
        unlockAt: 1893456000000000000n,
      },
    ]);
    renderHome();
    expect(await screen.findByText("Graduation")).toBeInTheDocument();
    expect(
      screen.getByText("Locked — your future self will see this later."),
    ).toBeInTheDocument();
    expect(screen.queryByText("You made it!")).not.toBeInTheDocument();
  });

  it("reveals the message for an unlocked capsule", async () => {
    mockActor.listCapsules.mockResolvedValue([
      {
        id: 1n,
        title: "Graduation",
        message: "You made it!",
        unlockAt: 1577836800000000000n,
      },
    ]);
    renderHome();
    expect(await screen.findByText("You made it!")).toBeInTheDocument();
  });
});
