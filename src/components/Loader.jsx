import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }) {
  const { active, progress, loaded, total } = useProgress();
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const finished = useRef(false);

  // Smoothly ease the displayed % toward the real %
  useEffect(() => {
    let raf;
    const loop = () => {
      setDisplay((d) => {
        const target = Math.max(d, Math.round(progress));
        const next = d + (target - d) * 0.18;
        return Math.abs(target - next) < 0.5 ? target : next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  // Track whether loading actually began
  useEffect(() => {
    if (active || total > 0 || loaded > 0) started.current = true;
  }, [active, total, loaded]);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setDone(true);
    setTimeout(() => onComplete?.(), 950);
  };

  // Complete when the (started) load is finished
  useEffect(() => {
    if (started.current && !active && progress >= 100) {
      const t = setTimeout(finish, 500);
      return () => clearTimeout(t);
    }
  }, [active, progress]);

  // Fallbacks: nothing to load, or stuck for too long
  useEffect(() => {
    const noLoad = setTimeout(() => {
      if (!started.current) finish();
    }, 900);
    const hard = setTimeout(finish, 22000);
    return () => {
      clearTimeout(noLoad);
      clearTimeout(hard);
    };
  }, []);

  const pct = Math.min(100, Math.round(display));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink-900 grain"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid-faint absolute inset-0 opacity-40 animate-gridDrift" />
          <div className="relative z-10 flex w-[min(560px,86vw)] flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-mono text-[11px] uppercase tracking-widest2 text-amber"
            >
              Loading the bigger picture
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7 }}
              className="mt-5 text-center font-display text-4xl font-extrabold leading-none text-bone sm:text-6xl"
            >
              YESHWANT
              <span className="block text-gradient-amber">SINGH</span>
            </motion.h1>

            <div className="mt-10 flex w-full items-end justify-between">
              <span className="font-mono text-xs text-muted">AI Project Coordinator</span>
              <span className="font-display text-3xl font-bold tabular-nums text-bone sm:text-4xl">
                {pct}
                <span className="text-amber">%</span>
              </span>
            </div>

            <div className="mt-3 h-px w-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-deep via-amber to-amber-soft"
                style={{ width: `${pct}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
