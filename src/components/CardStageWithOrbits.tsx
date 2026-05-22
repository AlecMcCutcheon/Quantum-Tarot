import type { ReactNode } from "react";
import {
  QuantumOrbitBackdrop,
  type OrbitBackdropVariant,
} from "./QuantumOrbitBackdrop";

interface CardStageWithOrbitsProps {
  children: ReactNode;
  /** 0–1 orbit visibility */
  intensity: number;
  variant?: OrbitBackdropVariant;
  /** Taller stage during draw theatre */
  tall?: boolean;
  /** Lighter orbits for mobile shuffle */
  reducedOrbits?: boolean;
}

export function CardStageWithOrbits({
  children,
  intensity,
  variant = "draw",
  tall = false,
  reducedOrbits = false,
}: CardStageWithOrbitsProps) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-visible ${
        tall
          ? "min-h-[min(520px,88vh)] py-2 max-sm:min-h-[min(460px,82vh)] sm:min-h-[720px] sm:py-4"
          : "min-h-[320px] py-2 max-sm:min-h-[280px] sm:min-h-[420px]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <QuantumOrbitBackdrop
          intensity={intensity}
          variant={variant}
          reduced={reducedOrbits}
        />
      </div>
      <div className="relative isolate z-20 flex w-full flex-col items-center">
        {children}
      </div>
    </div>
  );
}
