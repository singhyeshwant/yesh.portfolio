import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { ABOUT } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

function Stat({ value, label, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2 py-6 sm:py-0"
    >
      <span className="font-display text-5xl font-bold leading-none tracking-tightest text-gradient-amber sm:text-6xl">
        {value}
      </span>
      <span className="max-w-[12rem] text-sm leading-snug text-muted">{label}</span>
    </motion.div>
  );
}

export default function About() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // faint oversized watermark drifts as you pass
  const wmY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative z-10 overflow-hidden py-28 sm:py-36"
    >
      {/* opaque background that hugs the CONTENT (padding stays transparent) so
          the figure is hidden only behind the text, not the whole black card */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-28 bottom-28 -z-10 bg-ink-900 sm:top-36 sm:bottom-36"
      />
      <div className="grain absolute inset-0" />
      {/* drifting watermark word */}
      {!reduced && (
        <motion.span
          aria-hidden
          style={{ y: wmY }}
          className="pointer-events-none absolute -right-6 top-10 select-none font-display text-[26vw] font-bold leading-none tracking-tightest text-white/[0.02] sm:text-[20vw]"
        >
          AI
        </motion.span>
      )}

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* left: heading + lead */}
          <div className="lg:col-span-5">
            <SectionHeading
              kicker="About"
              index="01"
              title={ABOUT.title}
              titleClassName="text-4xl sm:text-5xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 max-w-md font-display text-2xl leading-snug text-bone/90 sm:text-3xl"
            >
              {ABOUT.lead}
            </motion.p>
          </div>

          {/* right: flowing paragraphs */}
          <div className="lg:col-span-7 lg:pt-2">
            <div className="space-y-6 border-l border-white/10 pl-6 sm:pl-8">
              {ABOUT.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg leading-relaxed text-muted [text-wrap:pretty] sm:text-xl"
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        {/* stats — hairline-separated, not boxes */}
        <div className="mt-20 grid grid-cols-2 gap-x-8 divide-white/10 border-t border-white/10 pt-10 sm:mt-24 sm:grid-cols-4 sm:divide-x sm:[&>*:not(:first-child)]:pl-8">
          {ABOUT.stats.map((s, i) => (
            <Stat key={s.label} value={s.value} label={s.label} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
