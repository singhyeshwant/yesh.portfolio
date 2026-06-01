import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, Award } from "lucide-react";
import SectionHeading from "./SectionHeading";
import MagneticButton from "./MagneticButton";
import { EDUCATION } from "../data/content";

export default function Education() {
  return (
    <section id="education" className="relative z-10 py-16 sm:py-24">
      {/* readability scrim: clear on the LEFT (the figure rides there facing left),
          solid on the RIGHT where the content sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,6,8,0) 0%, rgba(6,6,8,0) 34%, rgba(6,6,8,0.32) 44%, rgba(6,6,8,0.78) 54%, #060608 66%, #060608 100%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* right-weighted column — left stays clear for the figure */}
        <div className="ml-auto w-full max-w-3xl lg:max-w-4xl">
          <SectionHeading
            kicker="Education"
            index="05"
            title="Where the foundations were laid"
            className="mb-12 sm:mb-16"
            titleClassName="text-4xl sm:text-5xl max-w-2xl"
          />

          <div className="divide-y divide-white/10 border-y border-white/10">
            {EDUCATION.map((ed, i) => (
              <motion.div
                key={ed.school}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.75, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 py-9 sm:py-12 lg:grid-cols-12 lg:gap-10"
              >
                {/* meta */}
                <div className="lg:col-span-3">
                  <span className="font-mono text-[11px] uppercase tracking-widest2 text-amber">
                    {ed.date}
                  </span>
                  <p className="mt-2 text-sm text-muted">{ed.location}</p>
                  {ed.gpa && (
                    <p className="mt-3 font-display text-xl font-bold text-bone/80">{ed.gpa}</p>
                  )}
                </div>

                {/* main */}
                <div className="lg:col-span-9">
                  <div className="flex items-start gap-3">
                    <GraduationCap size={22} className="mt-1 shrink-0 text-amber" />
                    <div>
                      <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-bone sm:text-3xl">
                        {ed.school}
                      </h3>
                      <p className="mt-1 text-lg text-muted">{ed.degree}</p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {ed.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="relative flex items-start gap-2.5 text-[15px] leading-relaxed text-muted [text-wrap:pretty]"
                      >
                        <Award size={15} className="mt-1 shrink-0 text-teal/70" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {ed.transcript && (
                    <MagneticButton
                      as="a"
                      href={ed.transcript}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor
                      data-cursor-label="View"
                      className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-bone transition-colors hover:border-amber/50 hover:bg-amber/10"
                    >
                      Verified transcript
                      <ArrowUpRight size={14} strokeWidth={2.5} />
                    </MagneticButton>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
