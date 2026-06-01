import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Custom dual-element cursor (a precise dot + a lagging ring). Desktop pointers
 * only. It grows and changes label when hovering interactive elements that opt
 * in via [data-cursor] or native links/buttons. Disabled entirely on touch
 * devices and when the user prefers reduced motion (native cursor is kept).
 */
export default function Cursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);

  // Only enable on fine pointers (mouse/trackpad), never touch.
  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    if (fine) setEnabled(true);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let visible = false;

    const render = () => {
      // ring eases toward the pointer; dot is exact
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        if (dot) dot.style.opacity = "1";
        if (ring) ring.style.opacity = "1";
      }

      const el = e.target.closest?.(
        "a, button, [role='button'], input, textarea, [data-cursor]"
      );
      if (el) {
        setHovering(true);
        setLabel(el.getAttribute?.("data-cursor-label") || "");
      } else {
        setHovering(false);
        setLabel("");
      }
    };

    const onLeave = () => {
      visible = false;
      if (dot) dot.style.opacity = "0";
      if (ring) ring.style.opacity = "0";
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = hovering ? 64 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-200 ease-out"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: 0,
          borderColor: hovering ? "rgba(214,188,130,0.9)" : "rgba(244,244,246,0.35)",
          backgroundColor: hovering ? "rgba(214,188,130,0.08)" : "transparent",
          transform: "translate(-50%,-50%)",
          mixBlendMode: hovering ? "normal" : "difference",
        }}
      >
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-widest2 text-amber">
            {label}
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 rounded-full bg-amber transition-opacity duration-200"
        style={{
          width: down ? 6 : 7,
          height: down ? 6 : 7,
          opacity: 0,
          transform: "translate(-50%,-50%)",
        }}
      />
    </div>
  );
}
