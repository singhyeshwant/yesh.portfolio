import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import { NAV } from "../data/content";
import { CONTACT, ASSISTANT_URL } from "../lib/config";
import { useLenis } from "./SmoothScroll";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Floating glass navbar. Mounts after the intro portal completes (`show`).
 * Uses Lenis for smooth anchor scrolling and an IntersectionObserver-based
 * scroll-spy to highlight the active section. Collapses to a sheet on mobile.
 */
export default function Navbar({ show }) {
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // scroll-spy
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [show]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis && !reduced) {
      lenis.scrollTo(el, { offset: 0, duration: 1.25 });
    } else {
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.header
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-0 z-40"
        >
          <nav
            className={`mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500 sm:mt-4 sm:px-5 ${
              scrolled ? "glass-strong shadow-xl shadow-black/30" : "border border-transparent"
            }`}
            style={{ marginInline: "max(0.75rem, env(safe-area-inset-left))" }}
          >
            {/* brand */}
            <button
              onClick={() => go("hero")}
              className="group flex items-center gap-2.5"
              aria-label="Back to top"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 font-display text-sm font-bold text-bone">
                YS
              </span>
              <span className="hidden font-mono text-[11px] uppercase tracking-widest2 text-muted transition-colors group-hover:text-bone sm:block">
                Yeshwant&nbsp;Singh
              </span>
            </button>

            {/* desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => go(n.id)}
                    data-cursor
                    className={`relative rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                      active === n.id ? "text-bone" : "text-muted hover:text-bone"
                    }`}
                  >
                    {active === n.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/8 ring-1 ring-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href={ASSISTANT_URL}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor
                className="hidden items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-amber transition-colors duration-300 hover:bg-amber hover:text-ink-900 sm:inline-flex"
              >
                <Sparkles size={13} strokeWidth={2.5} />
                Ask my AI
              </a>

              {/* mobile toggle */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-bone lg:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </nav>

          {/* mobile sheet */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mx-3 mt-2 overflow-hidden rounded-2xl glass-strong p-2 lg:hidden"
              >
                <ul className="flex flex-col">
                  {NAV.map((n) => (
                    <li key={n.id}>
                      <button
                        onClick={() => go(n.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-display text-lg ${
                          active === n.id ? "text-bone" : "text-muted"
                        }`}
                      >
                        {n.label}
                        <span className="font-mono text-[10px] text-amber">
                          {String(NAV.indexOf(n) + 1).padStart(2, "0")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <a
                  href={ASSISTANT_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-amber"
                >
                  <Sparkles size={13} strokeWidth={2.5} /> Ask my AI
                </a>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-ink-900"
                >
                  LinkedIn <ArrowUpRight size={13} strokeWidth={2.5} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
