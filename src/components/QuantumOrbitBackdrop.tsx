import { motion } from "framer-motion";

export type OrbitBackdropVariant = "draw" | "ambient";

interface QuantumOrbitBackdropProps {
  /** 0 = hidden, 1 = full draw intensity */
  intensity: number;
  variant?: OrbitBackdropVariant;
}

interface CircularOrbitProps {
  radius: number;
  duration: number;
  delay?: number;
  electronColor: string;
  ringStroke: string;
  intensity: number;
  electronCount: number;
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
}: CircularOrbitProps) {
  const ringOpacity = 0.2 + intensity * 0.38;
  const size = radius * 2;
  const cx = radius;
  const cy = radius;
  /** Center of the 2px stroke sits on this radius. */
  const trackR = radius - STROKE_W / 2;

  const electrons = Array.from({ length: electronCount }, (_, i) => {
    const angle = (i / electronCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + trackR * Math.cos(angle),
      y: cy + trackR * Math.sin(angle),
    };
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: size,
        height: size,
        marginLeft: -radius,
        marginTop: -radius,
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      aria-hidden
    >
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
    </motion.div>
  );
}

const SIZE_CLASS: Record<OrbitBackdropVariant, string> = {
  draw: "h-[min(720px,140vw)] w-[min(720px,140vw)]",
  ambient: "h-[min(640px,120vw)] w-[min(640px,120vw)]",
};

/** Circular atomic orbits with multiple electrons per ring. */
export function QuantumOrbitBackdrop({
  intensity,
  variant = "draw",
}: QuantumOrbitBackdropProps) {
  if (intensity <= 0.03) return null;

  const shellOpacity =
    variant === "ambient"
      ? 0.08 + intensity * 0.14
      : 0.2 + intensity * 0.3;
  const orbitOpacity =
    variant === "ambient" ? 0.45 + intensity * 0.35 : 0.7 + intensity * 0.3;

  return (
    <div
      className={`pointer-events-none relative flex items-center justify-center ${SIZE_CLASS[variant]}`}
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

      <div
        className="absolute h-3 w-3 rounded-full bg-star/40 blur-[1px]"
        style={{ opacity: 0.1 + intensity * 0.15 }}
      />

      <div className="absolute inset-0" style={{ opacity: orbitOpacity }}>
        <CircularOrbit
          radius={variant === "ambient" ? 280 : 310}
          duration={22}
          electronCount={4}
          electronColor="rgba(167, 139, 250, 0.9)"
          ringStroke="rgba(167, 139, 250, 0.35)"
          intensity={intensity}
        />
        <CircularOrbit
          radius={variant === "ambient" ? 230 : 260}
          duration={14}
          delay={2}
          electronCount={3}
          electronColor="rgba(34, 211, 238, 0.85)"
          ringStroke="rgba(34, 211, 238, 0.3)"
          intensity={intensity}
        />
      </div>
    </div>
  );
}
