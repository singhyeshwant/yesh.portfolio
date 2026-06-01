import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, ArrowUpRight, Sparkles } from "lucide-react";
import { ASSISTANT_URL } from "../lib/config";

/**
 * Floating "Ask my AI" launcher (bottom-right). Clicking it slides in a
 * FULL-HEIGHT chat drawer docked to the right edge (fixed width, not full
 * width) that embeds the live assistant in an <iframe>. The header has an
 * "open in a new tab" link as a fallback in case the host blocks framing.
 */
export default function ChatAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* full-height right drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* click-away backdrop */}
            <motion.div
              key="assistant-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-[2px]"
              aria-hidden
            />
            <motion.div
              key="assistant-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-label="Chat with Yeshwant's AI assistant"
              className="fixed inset-y-0 right-0 z-[70] flex h-screen w-[min(440px,100vw)] flex-col overflow-hidden border-l border-white/12 glass-strong shadow-2xl shadow-black/60"
            >
              {/* header */}
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber text-ink-900">
                  <Sparkles size={17} />
                </span>
                <div className="mr-auto flex flex-col leading-tight">
                  <span className="font-display text-sm font-bold text-bone">Ask my AI</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest2 text-muted">
                    Trained on my work
                  </span>
                </div>
                <a
                  href={ASSISTANT_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Open the assistant in a new tab"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-muted transition-colors hover:border-amber/40 hover:text-bone"
                >
                  <ArrowUpRight size={16} />
                </a>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-muted transition-colors hover:border-white/25 hover:text-bone"
                >
                  <X size={16} />
                </button>
              </div>

              {/* the assistant, embedded full height */}
              <iframe
                src={ASSISTANT_URL}
                title="Yeshwant's AI assistant"
                loading="lazy"
                className="h-full w-full flex-1 border-0 bg-ink-900"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* floating launcher (bottom-right) */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Chat with my AI assistant"
        aria-expanded={open}
        data-cursor
        className="group fixed bottom-5 right-4 z-[60] inline-flex items-center gap-2.5 rounded-full bg-amber py-3 pl-4 pr-5 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-ink-900 shadow-xl shadow-amber/25 transition-transform duration-300 hover:scale-[1.04] sm:right-6"
      >
        <MessageSquare size={16} />
        Ask my AI
      </motion.button>
    </>
  );
}
