import { motion } from "framer-motion";
import { Code2, Cpu, Brain, Sparkles, BarChart3, Cloud, Wrench } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { SKILLS } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// an icon per skill group (lucide)
const ICONS = {
  Programming: Code2,
  "Machine Learning": Cpu,
  "Deep Learning": Brain,
  "Generative AI": Sparkles,
  "Data Analysis": BarChart3,
  Cloud: Cloud,
  Tools: Wrench,
};

function GroupCard({ group, i, reduced }) {
  const Icon = ICONS[group.group] || Code2;
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group/card relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-amber/35 hover:bg-white/[0.05]"
    >
      <div className="mb-4 flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-amber transition-colors duration-300 group-hover/card:border-amber/40 group-hover/card:bg-amber group-hover/card:text-ink-900">
          <Icon size={19} strokeWidth={1.9} />
        </span>
        <div className="flex flex-col">
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-bone">
            {group.group}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-muted">
            {String(group.items.length).padStart(2, "0")} tools
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.items.map((it) => (
          <span
            key={it}
            className="select-none rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[13px] text-bone/80 transition-colors duration-200 group-hover/card:border-white/15"
          >
            {it}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * SKILLS — a clean grid of categories, each with its own icon and tool chips.
 * The section is transparent with a RIGHT-weighted readability scrim, so the 3D
 * figure rides on the LEFT (facing left) while the content sits on the right.
 */
export default function Skills() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="skills" className="relative z-10 overflow-hidden py-16 sm:py-24">
      <div className="grid-faint absolute inset-0 opacity-[0.35] motion-safe:animate-gridDrift" />
      {/* readability scrim: clear on the LEFT (figure shows there), solid on the
          RIGHT where the content sits */}
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
            kicker="Tech Stack"
            index="04"
            title={<>Systems, models,<br className="hidden sm:block" /> and messy data</>}
            className="mb-10 sm:mb-14"
            titleClassName="text-4xl sm:text-5xl lg:text-[3.4rem]"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {SKILLS.map((g, i) => (
              <GroupCard key={g.group} group={g} i={i} reduced={reduced} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
