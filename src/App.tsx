import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { OpeningSplash } from "./components/OpeningSplash";
import { initReadings } from "./data/readings";
import { preloadLibraryCacheInBackground } from "./lib/cardArt/libraryRasterCache";
import { Home } from "./pages/Home";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [readingsReady, setReadingsReady] = useState(false);

  useEffect(() => {
    preloadLibraryCacheInBackground();
    void initReadings().then(() => setReadingsReady(true));
  }, []);

  const showSplash = !splashDone || !readingsReady;

  return (
    <>
      {showSplash && (
        <OpeningSplash onComplete={() => setSplashDone(true)} />
      )}
      <div
        className={`transition-opacity ease-out ${
          !showSplash ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ transitionDuration: !showSplash ? "700ms" : "0ms" }}
      >
        <Layout>
          <Home />
        </Layout>
      </div>
    </>
  );
}
