import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, MapPin, X, Navigation } from "lucide-react";
import { GOOGLE_MAPS_EMBED_KEY, LOCATION } from "../lib/config";
import { useLenis } from "./SmoothScroll";

// Build the embed URL. Uses Google's keyless embed by default; switches to the
// official Embed API automatically if you set GOOGLE_MAPS_EMBED_KEY in config.
function embedSrc(zoom = 15) {
  const q = encodeURIComponent(LOCATION.query);
  if (GOOGLE_MAPS_EMBED_KEY) {
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_KEY}&q=${q}&zoom=${zoom}`;
  }
  return `https://www.google.com/maps?q=${q}&z=${zoom}&output=embed`;
}

// Dark "night-mode" look applied to the Google embed via CSS filters.
const DARK_MAP_FILTER =
  "invert(0.92) hue-rotate(180deg) brightness(0.9) contrast(0.92) saturate(0.65)";

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  LOCATION.query
)}`;

export default function MapPanel() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    // lock scroll
    lenis?.stop?.();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start?.();
      document.body.style.overflow = prev;
    };
  }, [open, lenis]);

  return (
    <>
      {/* ---- preview ---- */}
      <button
        onClick={() => setOpen(true)}
        data-cursor
        data-cursor-label="Expand"
        aria-label="Expand map to full screen"
        className="group relative block h-full min-h-[18rem] w-full overflow-hidden rounded-3xl border border-white/10 text-left"
      >
        <iframe
          title="Map showing 639 Lonsdale Street, Melbourne"
          src={embedSrc(15)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ filter: DARK_MAP_FILTER, border: 0 }}
        />
        {/* tint + glass framing */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-ink-900/30" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

        {/* center pin */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          <span className="absolute h-12 w-12 rounded-full bg-amber/20 motion-safe:animate-pulseRing" />
          <span className="grid h-9 w-9 place-items-center rounded-full bg-amber text-ink-900 shadow-lg shadow-amber/30">
            <MapPin size={16} strokeWidth={2.5} />
          </span>
        </span>

        {/* labels */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest2 text-amber">
              Based in
            </p>
            <p className="mt-1 max-w-[14rem] font-display text-lg font-semibold leading-tight text-bone">
              {LOCATION.label}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full glass-strong px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-bone transition-colors group-hover:text-amber">
            <Expand size={12} />
            Expand
          </span>
        </div>

        <div className="absolute left-5 top-5 font-mono text-[10px] tracking-widest2 text-bone/50">
          {LOCATION.lat.toFixed(3)}, {LOCATION.lng.toFixed(3)}
        </div>
      </button>

      {/* ---- modal ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Full screen map"
          >
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-ink-900/80 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[82vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/12 glass-strong"
            >
              <iframe
                title="Full screen map showing 639 Lonsdale Street, Melbourne"
                src={embedSrc(16)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{ filter: DARK_MAP_FILTER, border: 0 }}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

              {/* top bar */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
                <div className="pointer-events-auto rounded-2xl glass-strong px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest2 text-amber">
                    Location
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold text-bone">
                    {LOCATION.label}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  autoFocus
                  aria-label="Close map"
                  className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full glass-strong text-bone transition-colors hover:bg-amber hover:text-ink-900"
                >
                  <X size={18} />
                </button>
              </div>

              {/* directions */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-amber px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-ink-900 transition-transform hover:scale-[1.04] sm:bottom-5 sm:right-5"
              >
                <Navigation size={14} strokeWidth={2.5} />
                Directions
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
