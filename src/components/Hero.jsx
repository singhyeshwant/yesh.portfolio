import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO, PROFILE } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * HERO — intentionally transparent so the fixed 3D canvas (which now sits
 * UNDERNEATH the page) shows the figure through it. The quote is sticky-centred
 * and dissolves as you scroll; the solid sections below then slide up and cover
 * the figure. The figure itself stays put — you rotate it by dragging.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const qOpacity = useTransform(scrollYProgress, [0, 0.24, 0.42], [1, 1, 0]);
  const qY = useTransform(scrollYProgress, [0, 0.42], ["0%", "-24%"]);
  const qBlur = useTransform(scrollYProgress, [0.22, 0.42], [0, 8]);
  const filter = useTransform(qBlur, (b) => `blur(${b}px)`);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const style = reduced ? {} : { opacity: qOpacity, y: qY, filter };

  return (
    <section id="hero" ref={ref} className="relative z-[3] h-[210vh] w-full">
      {/* sticky stage – holds everything for the first viewport */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-5">
        {/* kicker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={reduced ? {} : { opacity: qOpacity }}
          className="z-10 mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest2 text-amber sm:mb-10"
        >
          <span className="h-px w-10 bg-amber/50" />
          {HERO.kicker}
          <span className="h-px w-10 bg-amber/50" />
        </motion.div>

        {/* the quote — large, editorial, split across the centre axis */}
        <motion.blockquote
          style={style}
          className="relative z-10 mx-auto max-w-[1100px] text-center"
        >
          <p
            className="font-display font-bold leading-[0.94] tracking-tightest text-bone [text-wrap:balance]"
            style={{ textShadow: "0 2px 28px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)" }}
          >
            <span className="block text-[clamp(2.4rem,8.5vw,7rem)]">
              You can’t see the
            </span>
            <span className="block text-[clamp(2.4rem,8.5vw,7rem)] text-gradient-amber">
              whole picture
            </span>
            <span className="block text-[clamp(2.4rem,8.5vw,7rem)]">
              until you step outside&nbsp;it.
            </span>
          </p>
        </motion.blockquote>

        {/* name / role line, lower third, frames the figure */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          style={reduced ? {} : { opacity: qOpacity }}
          className="absolute bottom-[12vh] z-10 flex w-full max-w-5xl items-end justify-between px-6 text-muted sm:bottom-[10vh]"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest2 sm:text-[11px]">
            {PROFILE.name}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest2 sm:block">
            AI Project Coordinator
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest2 sm:text-[11px]">
            Melbourne · AUS
          </span>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          style={reduced ? {} : { opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted">
            <span className="hidden font-mono text-[9px] uppercase tracking-widest2 text-amber/70 sm:block">
              Drag to look around
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest2">Scroll</span>
            <ChevronDown
              size={16}
              className={reduced ? "" : "animate-floaty"}
              strokeWidth={1.5}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
