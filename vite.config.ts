import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { qrngServerPlugin } from "./vite-plugin-qrng";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");

  const githubPages = process.env.GITHUB_PAGES === "true";

  return {
    base: githubPages ? "/Quantum-Tarot/" : "/",
    plugins: [react(), tailwindcss(), qrngServerPlugin()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("/data/readings/")) return "readings";
            if (id.includes("/lib/cardArt/")) return "card-art";
            if (id.includes("node_modules/framer-motion")) return "motion";
          },
        },
      },
    },
  };
});
