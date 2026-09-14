import "@testing-library/jest-dom/vitest";
import { CreateCapsulePage } from "@/pages/CreateCapsulePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockActor = {
  listCapsules: vi.fn(),
  createCapsule: vi.fn(),
  getCapsule: vi.fn(),
};

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: mockActor, isFetching: false }),
}));

vi.mock("@/backend", () => ({
  createActor: vi.fn(),
}));

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

function renderCreate() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <CreateCapsulePage />
    </QueryClientProvider>,
  );
}

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  opts: { title?: string; message?: string; unlock?: string },
) {
  if (opts.title !== undefined) {
    await user.clear(screen.getByLabelText("Title"));
    if (opts.title.length > 0) {
      await user.type(screen.getByLabelText("Title"), opts.title);
    }
  }
  if (opts.message !== undefined) {
    await user.clear(screen.getByLabelText("Your message"));
    if (opts.message.length > 0) {
      await user.type(screen.getByLabelText("Your message"), opts.message);
    }
  }
  if (opts.unlock !== undefined) {
    await user.clear(screen.getByLabelText("Unlock date & time"));
    if (opts.unlock.length > 0) {
      await user.type(screen.getByLabelText("Unlock date & time"), opts.unlock);
    }
  }
}

describe("CreateCapsulePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("disables submit until a title, message, and future unlock time are provided", async () => {
    const user = userEvent.setup();
    renderCreate();
    const submit = screen.getByRole("button", { name: /seal capsule/i });
    expect(submit).toBeDisabled();

    await fillForm(user, { title: "Graduation", message: "You made it!" });
    // default unlock is +30 days, so it should now be submittable
    expect(submit).toBeEnabled();
  });

  it("blocks saving with an empty message", async () => {
    const user = userEvent.setup();
    renderCreate();
    await fillForm(user, { title: "Graduation", message: "" });
    const submit = screen.getByRole("button", { name: /seal capsule/i });
    expect(submit).toBeDisabled();
    expect(mockActor.createCapsule).not.toHaveBeenCalled();
  });

  it("blocks saving with a past unlock time", async () => {
    const user = userEvent.setup();
    renderCreate();
    await fillForm(user, {
      title: "Graduation",
      message: "You made it!",
      unlock: "2020-01-01T00:00",
    });
    const submit = screen.getByRole("button", { name: /seal capsule/i });
    expect(submit).toBeDisabled();
    expect(
      screen.getByText(/your capsule can't unlock in the past/i),
    ).toBeInTheDocument();
    expect(mockActor.createCapsule).not.toHaveBeenCalled();
  });

  it("creates a capsule with a future unlock time and navigates home", async () => {
    const user = userEvent.setup();
    mockActor.createCapsule.mockResolvedValue({
      id: 1n,
      title: "Graduation",
      message: "You made it!",
      unlockAt: 1893456000000000000n,
    });
    renderCreate();
    await fillForm(user, {
      title: "Graduation",
      message: "You made it!",
      unlock: "2030-01-01T00:00",
    });
    await user.click(screen.getByRole("button", { name: /seal capsule/i }));

    expect(mockActor.createCapsule).toHaveBeenCalledWith(
      "Graduation",
      "You made it!",
      expect.any(BigInt),
    );
    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
  });
});
