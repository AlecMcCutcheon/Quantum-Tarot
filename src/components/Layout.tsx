import { lazy, Suspense, useState, type ReactNode } from "react";
import { CardLibraryTrigger } from "./CardLibrary";
import { QrngSettings } from "./QrngSettings";
import { Starfield } from "./Starfield";

const CardLibrary = lazy(() =>
  import("./CardLibrary").then((m) => ({ default: m.CardLibrary })),
);

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <Starfield className="fixed inset-0" seed={0x71a9_0f0c} />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="border-b border-white/5 px-4 py-5 text-center sm:px-6">
          <h1 className="font-display text-xl font-semibold tracking-[0.2em] text-accent uppercase sm:text-2xl">
            Quantum Tarot
          </h1>
          <p className="mt-1 text-sm text-star/60">
            Readings seeded by live quantum entropy
          </p>
        </header>
        <main className="flex flex-1 flex-col items-center overflow-x-hidden px-3 py-6 max-sm:py-5 sm:px-6 sm:py-12">
          {children}
        </main>
      </div>
      <CardLibraryTrigger onClick={() => setLibraryOpen(true)} />
      <Suspense fallback={null}>
        {libraryOpen && (
          <CardLibrary open={libraryOpen} onClose={() => setLibraryOpen(false)} />
        )}
      </Suspense>
      <QrngSettings />
    </div>
  );
}
