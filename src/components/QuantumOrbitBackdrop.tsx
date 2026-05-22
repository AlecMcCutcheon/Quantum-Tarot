import { motion } from "framer-motion";

export type OrbitBackdropVariant = "draw" | "ambient";

interface QuantumOrbitBackdropProps {
  /** 0 = hidden, 1 = full draw intensity */
  intensity: number;
  variant?: OrbitBackdropVariant;
  /** Mobile / low-GPU: one ring, CSS spin, smaller footprint */
  reduced?: boolean;
}

interface CircularOrbitProps {
  radius: number;
  duration: number;
  delay?: number;
  electronColor: string;
  ringStroke: string;
  intensity: number;
  electronCount: number;
  useCssSpin?: boolean;
}

const ELECTRON_R = 6;
const STROKE_W = 2;

function CircularOrbit({
  radius,
  duration,
  delay = 0,
  electronColor,
  ringStroke,
  intensity,
  electronCount,
  useCssSpin = false,
}: CircularOrbitProps) {
  const ringOpacity = 0.2 + intensity * 0.38;
  const size = radius * 2;
  const cx = radius;
  const cy = radius;
  const trackR = radius - STROKE_W / 2;

  const electrons = Array.from({ length: electronCount }, (_, i) => {
    const angle = (i / electronCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + trackR * Math.cos(angle),
      y: cy + trackR * Math.sin(angle),
    };
  });

  const ringSvg = (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
    >
      <circle
        cx={cx}
        cy={cy}
        r={trackR}
        fill="none"
        stroke={ringStroke}
        strokeWidth={STROKE_W}
        opacity={ringOpacity}
      />
      {electrons.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={ELECTRON_R}
          fill={electronColor}
          opacity={0.55 + intensity * 0.4}
        />
      ))}
    </svg>
  );

  const positionStyle = {
    width: size,
    height: size,
    marginLeft: -radius,
    marginTop: -radius,
  };

  if (useCssSpin) {
    return (
      <div
        className="orbit-spin absolute left-1/2 top-1/2"
        style={{
          ...positionStyle,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
        aria-hidden
      >
        {ringSvg}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={positionStyle}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      aria-hidden
    >
      {ringSvg}
    </motion.div>
  );
}

const SIZE_CLASS: Record<OrbitBackdropVariant, string> = {
  draw: "h-[min(720px,140vw)] w-[min(720px,140vw)] max-sm:h-[min(380px,95vw)] max-sm:w-[min(380px,95vw)]",
  ambient:
    "h-[min(640px,120vw)] w-[min(640px,120vw)] max-sm:h-[min(320px,88vw)] max-sm:w-[min(320px,88vw)]",
};

const SIZE_CLASS_REDUCED: Record<OrbitBackdropVariant, string> = {
  draw: "h-[min(340px,92vw)] w-[min(340px,92vw)]",
  ambient: "h-[min(280px,85vw)] w-[min(280px,85vw)]",
};

/** Circular atomic orbits with multiple electrons per ring. */
export function QuantumOrbitBackdrop({
  intensity,
  variant = "draw",
  reduced = false,
}: QuantumOrbitBackdropProps) {
  if (intensity <= 0.03) return null;

  const shellOpacity = reduced
    ? 0.12 + intensity * 0.12
    : variant === "ambient"
      ? 0.08 + intensity * 0.14
      : 0.2 + intensity * 0.3;
  const orbitOpacity = reduced
    ? 0.35 + intensity * 0.25
    : variant === "ambient"
      ? 0.45 + intensity * 0.35
      : 0.7 + intensity * 0.3;

  return (
    <div
      className={`pointer-events-none relative flex items-center justify-center ${
        reduced ? SIZE_CLASS_REDUCED[variant] : SIZE_CLASS[variant]
      }`}
      aria-hidden
    >
      <div
        className="absolute rounded-full border-2 border-accent/20 bg-accent/[0.02]"
        style={{
          width: "100%",
          height: "100%",
          opacity: shellOpacity,
        }}
      />

      {!reduced && (
        <div
          className="absolute h-3 w-3 rounded-full bg-star/40 blur-[1px]"
          style={{ opacity: 0.1 + intensity * 0.15 }}
        />
      )}

      <div className="absolute inset-0" style={{ opacity: orbitOpacity }}>
        <CircularOrbit
          radius={reduced ? 150 : variant === "ambient" ? 280 : 310}
          duration={reduced ? 24 : 22}
          electronCount={reduced ? 2 : 4}
          electronColor="rgba(167, 139, 250, 0.9)"
          ringStroke="rgba(167, 139, 250, 0.35)"
          intensity={intensity}
          useCssSpin={reduced}
        />
        {!reduced && (
          <CircularOrbit
            radius={variant === "ambient" ? 230 : 260}
            duration={14}
            delay={2}
            electronCount={3}
            electronColor="rgba(34, 211, 238, 0.85)"
            ringStroke="rgba(34, 211, 238, 0.3)"
            intensity={intensity}
          />
        )}
      </div>
    </div>
  );
}
