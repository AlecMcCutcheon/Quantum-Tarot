import { motion } from "framer-motion";

export function DrawAnimation() {
  return (
    <div className="flex flex-col items-center gap-6 py-8" aria-live="polite" aria-busy="true">
      <motion.div
        className="relative h-32 w-32"
        initial={{ opacity: 0.6, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent/50"
          animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-gold/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="font-display text-xs tracking-widest text-accent/80 uppercase">
            QRNG
          </span>
        </motion.div>
      </motion.div>
      <p className="max-w-xs text-center text-sm text-star/60">
        Measuring true quantum randomness from ETH Zurich…
      </p>
      <div className="flex gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="h-1 w-1 rounded-full bg-accent"
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}
