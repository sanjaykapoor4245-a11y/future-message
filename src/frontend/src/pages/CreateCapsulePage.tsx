import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCapsule } from "@/hooks/use-capsules";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function CreateCapsulePage() {
  const navigate = useNavigate();
  const createCapsule = useCreateCapsule();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockAt, setUnlockAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return toLocalInputValue(d);
  });
  const [error, setError] = useState<string | null>(null);

  const unlockDate = new Date(unlockAt);
  const hasValidUnlock =
    !Number.isNaN(unlockDate.getTime()) && unlockDate.getTime() > Date.now();
  const canSubmit =
    title.trim().length > 0 && message.trim().length > 0 && hasValidUnlock;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || createCapsule.isPending) return;

    if (Number.isNaN(unlockDate.getTime())) {
      setError("Please choose a valid unlock date.");
      return;
    }
    if (unlockDate.getTime() <= Date.now()) {
      setError("Your capsule must unlock in the future.");
      return;
    }

    const capturedTitle = title.trim();
    const capturedMessage = message.trim();
    const capturedUnlock = unlockDate;

    setTitle("");
    setMessage("");
    setError(null);

    createCapsule.mutate(
      {
        title: capturedTitle,
        message: capturedMessage,
        unlockAt: capturedUnlock,
      },
      {
        onError: () => {
          setTitle((current) => (current === "" ? capturedTitle : current));
          setMessage((current) => (current === "" ? capturedMessage : current));
          setError(
            "Something went wrong sealing your capsule. Please try again.",
          );
        },
        onSuccess: () => {
          void navigate({ to: "/" });
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          onClick={() => void navigate({ to: "/" })}
          data-ocid="create.back_button"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
          Seal a new capsule
        </h1>
        <p className="mt-1 text-muted-foreground">
          Write a message to your future self and choose when it unlocks.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-card-in space-y-5 rounded-2xl border border-border bg-card p-5 glow-primary"
      >
        <div className="space-y-2">
          <Label htmlFor="capsule-title">Title</Label>
          <Input
            id="capsule-title"
            data-ocid="create.title_input"
            placeholder="e.g. Message to my graduated self"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capsule-message">Your message</Label>
          <Textarea
            id="capsule-message"
            data-ocid="create.message_textarea"
            placeholder="What do you want to tell your future self?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            maxLength={2000}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capsule-unlock">Unlock date &amp; time</Label>
          <Input
            id="capsule-unlock"
            data-ocid="create.unlock_input"
            type="datetime-local"
            value={unlockAt}
            onChange={(e) => setUnlockAt(e.target.value)}
            aria-invalid={!hasValidUnlock}
          />
          {!hasValidUnlock ? (
            <p
              data-ocid="create.unlock_error"
              className="text-xs text-destructive"
            >
              Choose a date and time in the future — your capsule can't unlock
              in the past.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Your capsule stays locked until this moment.
            </p>
          )}
        </div>

        {error && (
          <p
            data-ocid="create.error_state"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full bg-primary text-primary-foreground glow-primary hover:bg-primary/90"
          disabled={!canSubmit || createCapsule.isPending}
          data-ocid="create.submit_button"
        >
          <Lock className="size-4" aria-hidden="true" />
          {createCapsule.isPending ? "Sealing…" : "Seal capsule"}
        </Button>
      </form>
    </div>
  );
}
