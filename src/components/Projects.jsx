import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ProjectVisual from "./ProjectVisual";
import { PROJECTS } from "../data/content";

const ease = [0.16, 1, 0.3, 1];

function Card({ p, showVisual }) {
  return (
    <article
      className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md"
      style={{
        background: p.feat
          ? "linear-gradient(135deg, rgba(214,188,130,0.08), rgba(127,216,208,0.05))"
          : "linear-gradient(160deg, rgba(255,255,255,0.035), rgba(255,255,255,0.006))",
      }}
    >
      <span aria-hidden className="absolute left-0 top-0 z-10 h-0.5 w-full bg-gradient-to-r from-amber to-teal opacity-90" />

      {/* animated mini visual */}
      <div
        className="relative h-40 w-full shrink-0 overflow-hidden border-b border-white/10 sm:h-52"
        style={{ background: "radial-gradient(ellipse at center, rgba(127,216,208,0.05), transparent 70%)" }}
      >
        {showVisual && <ProjectVisual render={p.render} />}
      </div>

      {/* body */}
      <div className="flex flex-col p-6 sm:p-8 lg:p-9">
        <div className="flex items-start justify-between gap-4">
          <span className={`font-mono text-[11px] uppercase tracking-widest2 ${p.feat ? "text-amber" : "text-teal/85"}`}>
            {p.tag}
          </span>
          <span className="shrink-0 text-right font-display text-xl font-bold leading-tight tracking-tight text-gradient-amber sm:text-2xl">
            {p.metric}
          </span>
        </div>

        <h3 className={`mt-4 font-display font-bold leading-[1.1] tracking-tight text-bone ${p.feat ? "text-2xl sm:text-3xl lg:text-[2.1rem]" : "text-xl sm:text-2xl lg:text-3xl"}`}>
          {p.name}
        </h3>

        <p className="mt-3 text-[0.92rem] font-light leading-relaxed text-muted [text-wrap:pretty]">
          {p.desc}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-bone/55">
              {s}
            </span>
          ))}
        </div>

        {p.link && (
          <div className="mt-6">
            <a
              href={p.link.href}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor
              data-cursor-label="Open"
              className={
                p.link.hot
                  ? "group/l inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-ink-900 transition-all duration-300 hover:bg-amber-soft"
                  : "group/l inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-bone transition-colors duration-300 hover:text-amber"
              }
            >
              {p.link.label}
              <ArrowUpRight
                size={14}
                strokeWidth={2.5}
                className={`transition-transform duration-300 group-hover/l:translate-x-0.5 group-hover/l:-translate-y-0.5 ${p.link.hot ? "text-ink-900" : "text-amber"}`}
              />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

// where each card sits relative to the active one (signed offset)
const posFor = (off) => {
  if (off === 0) return { x: "0%", scale: 1, opacity: 1 };
  if (off === 1) return { x: "90%", scale: 0.84, opacity: 0.4 };
  if (off === -1) return { x: "-90%", scale: 0.84, opacity: 0.4 };
  return { x: off > 0 ? "175%" : "-175%", scale: 0.8, opacity: 0 };
};

/**
 * Projects as an infinite COVERFLOW: the active project sits centred and sharp,
 * the previous and next peek in faded on either side. Navigate with the ‹ › arrows,
 * by clicking a side preview, swiping/dragging, scrolling sideways, or ← →. The
 * viewport height tracks the active card so nothing is ever clipped.
 */
export default function Projects() {
  const n = PROJECTS.length;
  const [index, setIndex] = useState(0);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const cooldown = useRef(false);
  const start = useRef(null);
  const [h, setH] = useState(560);

  const go = (delta) => setIndex((i) => (i + delta + n) % n);

  // keep the viewport exactly as tall as the active card (no clipping)
  const measure = () => {
    const el = cardRefs.current[index];
    if (el) setH(el.offsetHeight);
  };
  useLayoutEffect(measure, [index]);
  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // horizontal trackpad / wheel → step (debounced); vertical passes through
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 18) return;
      e.preventDefault();
      if (cooldown.current) return;
      cooldown.current = true;
      go(e.deltaX > 0 ? 1 : -1);
      setTimeout(() => (cooldown.current = false), 480);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [n]);

  // ← / → keys while Projects is centred in view and not typing
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target;
      if (t && (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable)) return;
      const sec = document.getElementById("projects");
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (r.bottom < vh * 0.35 || r.top > vh * 0.65) return;
      e.preventDefault();
      go(e.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  // swipe / drag — vertical gestures stay as page scroll
  const onPointerDown = (e) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  return (
    <section id="projects" className="relative z-10 py-16 sm:py-24">
      <div className="mx-auto mb-8 max-w-6xl px-5 sm:px-8">
        <SectionHeading
          kicker="Projects"
          index="03"
          title="Projects that actually worked"
          titleClassName="text-4xl sm:text-5xl lg:text-6xl max-w-2xl"
        />
        <p className="mt-5 max-w-md text-sm text-muted">
          The active build sits centre; the rest peek in alongside. Arrows, swipe, or scroll
          sideways — it loops forever.
        </p>
      </div>

      {/* opaque backing — the figure hides behind the carousel and re-appears after */}
      <div id="proj-cards" className="relative">
        <div aria-hidden className="absolute inset-0 bg-ink-900" />

        {/* counter + dots */}
        <div className="relative mx-auto mb-5 flex max-w-4xl items-center justify-center gap-4 px-5">
          <span className="font-mono text-[11px] tracking-widest2 text-muted">
            <span className="text-amber">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1">/</span>
            {String(n).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to project ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-amber" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* stage */}
        <div
          ref={stageRef}
          data-no-drag
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ touchAction: "pan-y" }}
          className="relative mx-auto w-[94vw] max-w-[760px] select-none"
        >
          {/* viewport — height tracks the active card */}
          <div
            className="relative overflow-hidden transition-[height] duration-500 ease-out"
            style={{ height: h }}
          >
            {PROJECTS.map((p, i) => {
              let off = ((i - index) % n + n) % n;
              if (off > n / 2) off -= n;
              const near = Math.abs(off) <= 1;
              return (
                <motion.div
                  key={p.name}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="absolute inset-x-0 top-0 mx-auto w-[min(600px,82vw)]"
                  style={{ transformOrigin: "top", zIndex: off === 0 ? 30 : near ? 20 : 10, pointerEvents: near ? "auto" : "none" }}
                  initial={false}
                  animate={posFor(off)}
                  transition={{ duration: 0.5, ease }}
                  onClick={() => {
                    if (off === 1) go(1);
                    else if (off === -1) go(-1);
                  }}
                >
                  <Card p={p} showVisual={near} />
                </motion.div>
              );
            })}

            {/* soften the peeking edges into the dark */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-[25] w-12 bg-gradient-to-r from-ink-900 to-transparent sm:w-16" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-[25] w-12 bg-gradient-to-l from-ink-900 to-transparent sm:w-16" />
          </div>

          {/* arrows — vertically centred on the active card */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous project"
            data-cursor
            className="absolute left-1 top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-ink-800/75 text-bone backdrop-blur transition-colors hover:border-amber/50 hover:text-amber sm:left-2"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next project"
            data-cursor
            className="absolute right-1 top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-ink-800/75 text-bone backdrop-blur transition-colors hover:border-amber/50 hover:text-amber sm:right-2"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
