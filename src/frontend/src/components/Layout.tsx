import { CreateCapsuleButton } from "@/components/CreateCapsuleButton";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="starfield relative min-h-dvh bg-background">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link
              to="/"
              data-ocid="home.link"
              className="flex items-center gap-2.5"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary glow-primary">
                <Lock className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Future<span className="text-gradient-primary">Message</span>
              </span>
            </Link>
            <CreateCapsuleButton />
          </div>
        </header>

        <main className="flex-1 py-6 sm:py-8">{children}</main>

        <footer className="border-t border-border py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
