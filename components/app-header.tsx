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
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        Keyflow
      </Link>

      <nav aria-label="Primary" className="flex items-center gap-1">
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
                "rounded-full px-3 py-1.5 text-sm transition-colors",
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
