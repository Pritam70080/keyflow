import type { Metadata } from "next";
import Link from "next/link";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Keyflow is a calm, no-login typing trainer with live WPM, accuracy, haptic feedback, and local progress charts.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Keyflow",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "A focused typing practice app with live stats, a visual keyboard, and local progress tracking.",
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main" className="min-h-screen">
        <div className="mx-auto max-w-5xl px-5 py-4 md:px-8">
          <AppHeader />

          <section className="mx-auto max-w-2xl py-20">
            <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
              Typing, quietly
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Practice speed and accuracy without signing in.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Keyflow opens on the test itself. Choose easy, medium, or hard
              passages, hear a click or a mechanical tap, and watch a caret
              glide across the line. Progress stays on this device.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/" className={cn(buttonVariants())}>
                Start typing
              </Link>
              <Link
                href="/progress"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                View progress
              </Link>
            </div>
          </section>

          <section className="grid gap-4 pb-24 md:grid-cols-3">
            {[
              {
                title: "Immediate",
                body: "No account wall. The first keystroke starts the clock.",
              },
              {
                title: "Honest metrics",
                body: "WPM from correct characters, accuracy from every attempt, raw speed alongside net.",
              },
              {
                title: "Local memory",
                body: "Preferences and recent tests live in localStorage. Nothing is sent to a server.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h2 className="text-lg font-medium">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            ))}
          </section>

          <section className="grid gap-10 border-t border-border py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                The practice loop
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Small sessions. Clear feedback.
              </h2>
            </div>
            <div className="space-y-8">
              {[
                {
                  number: "01",
                  title: "Pick a pace",
                  body: "Choose a difficulty and a time window that fits the moment. There is no setup ceremony before the first key.",
                },
                {
                  number: "02",
                  title: "Stay with the line",
                  body: "The caret, live accuracy, and WPM keep attention on the next character instead of a crowded dashboard.",
                },
                {
                  number: "03",
                  title: "Come back tomorrow",
                  body: "Recent sessions make small improvements visible, so practice has a direction without becoming a chore.",
                },
              ].map((item) => (
                <div key={item.number} className="grid gap-3 sm:grid-cols-[3rem_1fr]">
                  <span className="font-mono text-sm text-muted-foreground">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 border-t border-border py-20 md:grid-cols-2 md:gap-16">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Made for your desk
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Quiet by default, useful when it matters.
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Sound and haptics are there when they help. Turn them off when
                you need a silent room, or keep a familiar key feel while you
                build rhythm.
              </p>
              <p>
                Your preferences and results stay in this browser. Keyflow
                does not need an account, a server, or a reason to follow you
                around.
              </p>
            </div>
          </section>

          <AppFooter />
        </div>
      </main>
    </>
  );
}
