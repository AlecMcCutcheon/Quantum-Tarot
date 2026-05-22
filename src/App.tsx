import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { OpeningSplash } from "./components/OpeningSplash";
import { preloadLibraryCacheInBackground } from "./lib/cardArt/libraryRasterCache";
import { Home } from "./pages/Home";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    preloadLibraryCacheInBackground();
  }, []);

  return (
    <>
      {!splashDone && <OpeningSplash onComplete={() => setSplashDone(true)} />}
      <div
        className={`transition-opacity ease-out ${
          splashDone ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ transitionDuration: splashDone ? "700ms" : "0ms" }}
      >
        <Layout>
          <Home />
        </Layout>
      </div>
    </>
  );
}
