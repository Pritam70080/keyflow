import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            keyflow
          </h1>

          <ThemeToggle/>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-4xl">
            <p className="font-typing text-2xl leading-relaxed text-muted-foreground">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
