import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Linkedin, ArrowUpRight, Send, Check, Loader2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import MagneticButton from "./MagneticButton";
import MapPanel from "./MapPanel";
import { CONTACT, FORMSPREE_ENDPOINT, WEB3FORMS_ACCESS_KEY } from "../lib/config";
import { PROFILE } from "../data/content";

const LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    cursor: "Mail",
  },
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phone}`,
    cursor: "Call",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "www.linkedin.com/in/singhyeshwant/",
    href: CONTACT.linkedin,
    cursor: "Open",
    external: true,
  },
];

function Field({ id, label, type = "text", value, onChange, error, textarea }) {
  const common =
    "peer w-full rounded-xl border bg-ink-900/60 px-4 pb-2 pt-6 text-bone outline-none transition-colors placeholder-transparent focus:border-amber/60";
  const border = error ? "border-red-400/60" : "border-white/12";
  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          placeholder={label}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className={`${common} ${border} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={label}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className={`${common} ${border}`}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 font-mono text-[11px] uppercase tracking-widest2 text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-widest2 peer-focus:text-amber peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest2"
      >
        {label}
      </label>
      {error && <p className="mt-1 pl-1 text-xs text-red-400/90">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Your name, please.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "A valid email helps me reply.";
    if (!form.message.trim()) er.message = "Add a short message.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const mailtoFallback = () => {
    const subject = form.subject || `Portfolio enquiry from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    // 1) Web3Forms — delivers straight to the inbox tied to the access key.
    if (WEB3FORMS_ACCESS_KEY) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            from_name: form.name,
            name: form.name,
            email: form.email,
            subject: form.subject || `Portfolio enquiry from ${form.name}`,
            message: form.message,
            botcheck: "", // honeypot — bots fill it, humans don't
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          setStatus("success");
          setForm({ name: "", email: "", subject: "", message: "" });
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
      return;
    }

    // 2) Formspree — if an endpoint is configured instead.
    if (FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setStatus("success");
          setForm({ name: "", email: "", subject: "", message: "" });
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
      return;
    }

    // 3) No backend configured → open the user's mail client.
    setTimeout(() => {
      mailtoFallback();
      setStatus("success");
    }, 600);
  };

  return (
    <section id="contact" className="relative z-10 min-h-screen w-full py-16 sm:py-24">
      {/* readability scrim: protects the form on the left, clears toward the
          right so the 3D figure shows there, facing you */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #060608 0%, #060608 36%, rgba(6,6,8,0.72) 48%, rgba(6,6,8,0.22) 56%, rgba(6,6,8,0) 64%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          kicker="Contact"
          index="06"
          title="Let’s build the next thing"
          titleClassName="text-4xl sm:text-5xl lg:text-6xl"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-md text-lg text-muted"
        >
          Got a project, a role, or a messy AI workflow that needs order? Send a
          note — I read every one.
        </motion.p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-teal/90">
          <span className="h-1.5 w-1.5 rounded-full bg-teal motion-safe:animate-pulse" />
          {PROFILE.workRights}
        </p>

        {/* left-weighted content; the right stays clear for the 3D figure */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* quick links */}
            <div className="mb-10 space-y-2">
              {LINKS.map((l) => (
                <MagneticButton
                  key={l.label}
                  as="a"
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer noopener" : undefined}
                  data-cursor
                  data-cursor-label={l.cursor}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4 transition-colors hover:border-amber/40 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-amber transition-colors group-hover:bg-amber group-hover:text-ink-900">
                      <l.icon size={17} />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-mono text-[10px] uppercase tracking-widest2 text-muted">
                        {l.label}
                      </span>
                      <span className="text-bone">{l.value}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber"
                  />
                </MagneticButton>
              ))}
            </div>

            {/* form */}
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-3xl glass-strong p-6 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Name" value={form.name} onChange={set("name")} error={errors.name} />
                <Field id="email" label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
              </div>
              <div className="mt-4">
                <Field id="subject" label="Subject" value={form.subject} onChange={set("subject")} />
              </div>
              <div className="mt-4">
                <Field id="message" label="Message" textarea value={form.message} onChange={set("message")} error={errors.message} />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <MagneticButton
                  as="button"
                  type="submit"
                  disabled={status === "sending" || status === "success"}
                  data-cursor
                  className="inline-flex items-center gap-2.5 rounded-full bg-amber px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-ink-900 transition-all duration-300 hover:bg-amber-soft disabled:opacity-80"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {status === "sending" ? (
                      <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                        <Loader2 size={15} className="animate-spin" /> Sending
                      </motion.span>
                    ) : status === "success" ? (
                      <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                        <Check size={15} strokeWidth={3} /> Done
                      </motion.span>
                    ) : (
                      <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                        Send message <Send size={14} strokeWidth={2.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MagneticButton>

                <AnimatePresence>
                  {status === "success" && (
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-teal"
                    >
                      {WEB3FORMS_ACCESS_KEY || FORMSPREE_ENDPOINT
                        ? "✓ Message sent. Thanks Yeshwant, I'll get back to you soon."
                        : "Your email app just opened — hit send there."}
                    </motion.p>
                  )}
                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-red-400"
                    >
                      Something went wrong — email me directly instead.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* map */}
            <div className="mt-8 h-72">
              <MapPanel />
            </div>
          </div>

          {/* right column intentionally clear — the 3D figure stands here facing you */}
          <div className="hidden lg:col-span-5 lg:block" aria-hidden />
        </div>

        {/* footer */}
        <footer className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-muted">
            © {new Date().getFullYear()} {PROFILE.name}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-muted">
            Designed & built in Melbourne
          </p>
        </footer>
      </div>
    </section>
  );
}
