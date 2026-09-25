import { GitFork, Keyboard } from "lucide-react";
import Link from "next/link";

const description =
    "A minimal typing trainer with live WPM, accuracy, a visual keyboard, and local progress tracking. No account required.";

export function AppFooter() {
    return (
        <footer className="flex flex-col gap-6 border-t border-border py-8 text-sm md:flex-row md:items-end md:justify-between">
            <div className="max-w-md space-y-3">
                <div className="flex items-center gap-2 font-semibold tracking-tight">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                        <Keyboard className="size-4" aria-hidden="true" />
                    </span>
                    <span>Keyflow</span>
                </div>
                <p className="leading-relaxed text-muted-foreground">{description}</p>
                <Link
                    href="https://github.com/Pritam70080/keyflow"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Keyflow on GitHub"
                    className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                      <GitFork className="size-4" aria-hidden="true" />
                    <span>GitHub</span>
                </Link>
            </div>
            <p className="text-muted-foreground md:pb-1">
                &copy; {new Date().getFullYear()} Keyflow. All rights reserved.
            </p>
        </footer>
    );
}