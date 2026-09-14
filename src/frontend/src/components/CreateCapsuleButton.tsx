import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export function CreateCapsuleButton() {
  return (
    <Button
      asChild
      size="sm"
      className="rounded-full bg-primary text-primary-foreground glow-primary hover:bg-primary/90"
      data-ocid="create_capsule_button"
    >
      <Link to="/create">
        <Plus className="size-4" aria-hidden="true" />
        Create Capsule
      </Link>
    </Button>
  );
}
