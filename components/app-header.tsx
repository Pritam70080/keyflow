"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Type" },
  { href: "/about", label: "About" },
  { href: "/progress", label: "Progress" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        Keyflow
      </Link>

      <nav
        aria-label="Primary"
        className="flex flex-wrap items-center justify-end gap-1"
      >
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-2.5 py-1.5 text-xs transition-colors sm:text-sm",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <ThemeToggle />
      </nav>
    </header>
  );
}
