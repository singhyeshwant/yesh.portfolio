import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { EXPERIENCE } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * EXPERIENCE — an editorial vertical timeline (not cards). A rail runs down the
 * left; a GSAP-scrubbed progress line fills it as you scroll. Each role reveals
 * on enter. Translated's coordinator role surfaces client exposure (Uber /
 * NVIDIA) as plain text chips — no third-party logos.
 */
export default function Experience() {
  const reduced = usePrefersReducedMotion();
  const root = useRef(null);
  const rail = useRef(null);
  const progress = useRef(null);

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // progress line fills with scroll
      gsap.fromTo(
        progress.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rail.current,
            start: "top 70%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        }
      );

      // each role reveals
      gsap.utils.toArray(".xp-item").forEach((el) => {
        const dot = el.querySelector(".xp-dot");
        gsap.from(el.querySelectorAll(".xp-reveal"), {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 78%" },
        });
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: { trigger: el, start: "top 78%" },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="experience"
      ref={root}
      className="relative z-10 py-16 sm:py-24"
    >
      {/* readability scrim: solid on the left where the timeline sits, fading to
          clear on the right so the 3D figure shows through there */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #060608 0%, #060608 34%, rgba(6,6,8,0.7) 48%, rgba(6,6,8,0.25) 56%, rgba(6,6,8,0) 64%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          kicker="Experience"
          index="02"
          title="Built between AI and operations"
          className="mb-16 sm:mb-24"
          titleClassName="text-4xl sm:text-5xl lg:text-[3.4rem] max-w-3xl"
        />

        <div ref={rail} className="relative pl-10 sm:pl-16">
          {/* rail track */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 sm:left-[15px]" />
          {/* rail progress */}
          <div
            ref={progress}
            style={{ transformOrigin: "top", transform: reduced ? "scaleY(1)" : "scaleY(0)" }}
            className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber via-amber/80 to-transparent sm:left-[15px]"
          />

          <ol className="space-y-16 sm:space-y-24">
            {EXPERIENCE.map((xp, i) => (
              <li key={`${xp.company}-${i}`} className="xp-item relative">
                {/* node */}
                <span
                  className={`xp-dot absolute -left-[34px] top-2 grid h-4 w-4 place-items-center rounded-full sm:-left-[54px] ${
                    xp.current ? "bg-amber" : "bg-ink-500 ring-1 ring-white/20"
                  }`}
                >
                  {xp.current && (
                    <span className="absolute inset-0 rounded-full bg-amber/60 motion-safe:animate-pulseRing" />
                  )}
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
                </span>

                <div className="flex flex-col gap-1.5">
                  <div className="xp-reveal flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest2">
                    <span className="text-amber">{xp.date}</span>
                    {xp.current && (
                      <span className="rounded-full bg-amber/15 px-2 py-0.5 text-amber">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="xp-reveal font-display text-2xl font-bold leading-tight tracking-tight text-bone sm:text-3xl">
                    {xp.role}
                  </h3>

                  <div className="xp-reveal flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <span className="font-medium text-bone/80">{xp.company}</span>
                    <span className="text-white/20">·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-muted" />
                      {xp.location}
                    </span>
                  </div>

                  {xp.clients && (
                    <div className="xp-reveal mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest2 text-muted">
                        Client exposure
                      </span>
                      {xp.clients.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-white/12 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-wide text-bone/85"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="xp-reveal mt-4 max-w-2xl space-y-2.5">
                    {xp.points.map((pt, j) => (
                      <li
                        key={j}
                        className="relative pl-5 text-[15px] leading-relaxed text-muted [text-wrap:pretty]"
                      >
                        <span className="absolute left-0 top-[0.6em] h-1 w-1 rounded-full bg-amber/70" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
