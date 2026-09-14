import { CapsuleCard } from "@/components/CapsuleCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCapsules } from "@/hooks/use-capsules";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export function HomePage() {
  const { data: capsules, isLoading } = useCapsules();

  return (
    <div className="space-y-8">
      <section className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          Seal a message to your{" "}
          <span className="text-gradient-primary">future</span>{" "}
          <span className="text-accent">self</span>
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          Write a note today, lock it away, and rediscover it when the time is
          right. Your words, delivered to the you of tomorrow.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Your capsules
          </h2>
          <span className="text-sm text-muted-foreground">
            {capsules?.length ?? 0} sealed
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
              <Skeleton key={id} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : capsules && capsules.length > 0 ? (
          <div className="space-y-4">
            {capsules.map((capsule) => (
              <CapsuleCard key={capsule.id} capsule={capsule} />
            ))}
          </div>
        ) : (
          <div
            data-ocid="capsules.empty_state"
            className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center"
          >
            <p className="font-display text-lg font-semibold text-foreground">
              No capsules yet
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Seal your first message to your future self and it will appear
              here, waiting to be unlocked.
            </p>
            <Button
              asChild
              className="mt-5 rounded-full bg-primary text-primary-foreground glow-primary hover:bg-primary/90"
              data-ocid="capsules.empty_create_button"
            >
              <Link to="/create">
                <Plus className="size-4" aria-hidden="true" />
                Create your first capsule
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
