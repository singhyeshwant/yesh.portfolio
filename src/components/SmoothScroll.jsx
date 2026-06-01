import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState(null);
  const rafId = useRef(null);

  useEffect(() => {
    // Reduced motion → skip smoothing, use native scroll, but still let
    // ScrollTrigger run for reveals.
    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      lerp: 0.35, // higher = snappier, far less "floaty" latency (Lenis default 0.1)
      wheelMultiplier: 1.35, // a touch more travel per wheel notch
      touchMultiplier: 1.9,
      smoothWheel: true,
    });

    setLenis(instance);

    // Keep ScrollTrigger in sync with Lenis
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // refresh once everything is mounted
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(tick);
      instance.off("scroll", ScrollTrigger.update);
      instance.destroy();
      setLenis(null);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
