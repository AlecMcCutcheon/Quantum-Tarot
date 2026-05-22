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
}

export function CardStageWithOrbits({
  children,
  intensity,
  variant = "draw",
  tall = false,
}: CardStageWithOrbitsProps) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-visible ${
        tall ? "min-h-[720px] py-4" : "min-h-[420px] py-2"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <QuantumOrbitBackdrop intensity={intensity} variant={variant} />
      </div>
      <div className="relative isolate z-20 flex w-full flex-col items-center">
        {children}
      </div>
    </div>
  );
}
