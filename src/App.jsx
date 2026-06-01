import { Suspense, lazy, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SmoothScroll from "./components/SmoothScroll";
import Scene3D from "./components/Scene3D";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ChatAssistant from "./components/ChatAssistant";

import { useIsMobile } from "./hooks/useMediaQuery";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

// ---- lazy-loaded, below-the-fold sections (code-split) ----
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Projects = lazy(() => import("./components/Projects"));
const Skills = lazy(() => import("./components/Skills"));
const Education = lazy(() => import("./components/Education"));
const Contact = lazy(() => import("./components/Contact"));

const SectionFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-ink-900" aria-hidden>
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-amber" />
  </div>
);

export default function App() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Recalculate scroll-driven layouts once everything (including the lazy
  // sections and the 3D model) has had a chance to mount.
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 500);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <>
      {/* fixed dark vignette base — sits behind everything */}
      <div id="bg-base" />

      <SmoothScroll>
        {/* fixed 3D canvas — sits UNDERNEATH the page (behind content) so the
            solid sections scroll over the figure and reveal it in hero/contact.
            The figure scales in on load. */}
        <Scene3D entered reduced={reduced} isMobile={isMobile} />

        {/* floating nav */}
        <Navbar show />

        {/* main is intentionally NOT a stacking context (no z-index): the hero
            sits at z-[3] (below the canvas) so the figure covers the quote, while
            the other sections sit at z-10 (above the canvas) and scroll over it. */}
        <main className="relative">
          <Hero />
          <Suspense fallback={<SectionFallback />}>
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Education />
            <Contact />
          </Suspense>
        </main>
      </SmoothScroll>

      {/* floating "ask my AI" assistant — opens a mini in-page chat window */}
      <ChatAssistant />
    </>
  );
}
