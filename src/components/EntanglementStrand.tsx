import { motion } from "framer-motion";

interface EntanglementStrandProps {
  /** Pulse and wave the connection */
  active?: boolean;
  /** Brighter during entanglement / partner draw */
  intense?: boolean;
  className?: string;
}

export function EntanglementStrand({
  active = true,
  intense = false,
  className = "",
}: EntanglementStrandProps) {
  const strokeSoft = intense
    ? "rgba(167,139,250,0.45)"
    : "rgba(167,139,250,0.25)";

  return (
    <div
      className={`pointer-events-none flex w-10 items-center justify-center max-sm:h-14 max-sm:w-28 sm:w-16 ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 56 100"
        className="h-20 w-full max-sm:h-14 max-sm:w-28 sm:h-28"
        fill="none"
      >
        <defs>
          <linearGradient id="strandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <motion.path
          stroke={strokeSoft}
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M4,50 C18,20 38,80 52,50"
          animate={
            active
              ? {
                  d: [
                    "M4,50 C18,20 38,80 52,50",
                    "M4,50 C18,80 38,20 52,50",
                    "M4,50 C18,20 38,80 52,50",
                  ],
                }
              : undefined
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          stroke="url(#strandGrad)"
          strokeWidth={intense ? 2.5 : 2}
          strokeLinecap="round"
          d="M4,50 C18,35 38,65 52,50"
          animate={
            active
              ? {
                  d: [
                    "M4,50 C18,35 38,65 52,50",
                    "M4,50 C18,65 38,35 52,50",
                    "M4,50 C18,35 38,65 52,50",
                  ],
                  opacity: intense ? [0.6, 1, 0.6] : [0.4, 0.85, 0.4],
                }
              : undefined
          }
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {active && (
          <motion.circle
            r="3"
            fill="#fbbf24"
            animate={{
              cx: [4, 28, 52, 28, 4],
              cy: [50, 35, 50, 65, 50],
              opacity: [0.3, 1, 0.3, 1, 0.3],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </svg>
    </div>
  );
}
