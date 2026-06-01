import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Magnetic hover wrapper. The element drifts toward the cursor and the inner
 * content drifts a touch further for a layered, tactile feel. Renders as an
 * <a>, <button>, or <div> via the `as` prop. Fully disabled under
 * prefers-reduced-motion (renders a plain element).
 */
export default function MagneticButton({
  as = "button",
  children,
  className = "",
  strength = 0.4,
  radius = 120,
  innerClassName = "",
  ...rest
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  // inner content moves slightly more than the shell
  const ix = useTransform(sx, (v) => v * 0.35);
  const iy = useTransform(sy, (v) => v * 0.35);

  const MotionTag = motion[as] || motion.button;

  if (reduced) {
    const Tag = as;
    return (
      <Tag ref={ref} className={className} {...rest}>
        <span className={innerClassName}>{children}</span>
      </Tag>
    );
  }

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const max = Math.max(r.width, r.height) / 2 + radius;
    const falloff = Math.max(0, 1 - dist / max);
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionTag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
      {...rest}
    >
      <motion.span style={{ x: ix, y: iy, display: "inline-flex" }} className={innerClassName}>
        {children}
      </motion.span>
    </MotionTag>
  );
}
