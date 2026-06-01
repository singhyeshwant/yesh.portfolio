import { motion } from "framer-motion";

/**
 * Editorial section heading: a small mono kicker with an index, plus a large
 * display title that reveals on scroll. Used across sections for consistency.
 */
export default function SectionHeading({
  kicker,
  index,
  title,
  align = "left",
  className = "",
  titleClassName = "",
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignCls} ${className}`}>
      {(kicker || index) && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest2 text-amber"
        >
          {index && <span className="text-muted">{index}</span>}
          {index && kicker && <span className="h-px w-8 bg-amber/40" />}
          {kicker && <span>{kicker}</span>}
        </motion.div>
      )}

      <div className="overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: "60%" }}
          whileInView={{ opacity: 1, y: "0%" }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className={`font-display font-bold leading-[0.95] tracking-tightest text-bone ${
            titleClassName || "text-4xl sm:text-5xl lg:text-6xl"
          }`}
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
}
