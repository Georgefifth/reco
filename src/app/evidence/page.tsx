import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Brain, ClipboardCheck, GraduationCap, HeartPulse, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RESEARCH_SOURCES } from "@/lib/research";

const EXPLANATIONS = [
  { icon: Brain, title: "An energy mismatch", body: "A concussion temporarily disrupts how brain cells use and restore energy. Symptoms can rise when physical, visual, or cognitive demand exceeds current capacity, which is why pacing matters." },
  { icon: HeartPulse, title: "Relative rest, then movement", body: "Current guidance has moved away from prolonged complete rest. After the first 24–48 hours, gradual symptom-limited activity can support recovery when guided by a clinician." },
  { icon: GraduationCap, title: "Learning returns before contact", body: "Students should usually make progress toward full learning before unrestricted sport. Temporary academic supports reduce load while preserving connection and routine." },
];

const FEATURE_MAP = [
  ["22-symptom check-in", "Common symptom domains organized for self-observation; this does not reproduce or replace a licensed clinical assessment."],
  ["Return to play", "A staged progression with at least 24 hours per step and clinician clearance before contact."],
  ["Return to learn", "Early, gradual academic exposure paired with individualized temporary accommodations."],
  ["Cognitive pulse", "Repeatable wellness observations for reaction, working memory, and attention; not a validated diagnostic battery."],
  ["AI journal", "Local inference, deterministic emergency screening, personal-data redaction, and response filtering."],
];

export default function EvidencePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)]"><ArrowLeft size={14} /> Home</Link>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-brand-dark)]">Evidence ledger</p>
          <h1 className="mt-1 max-w-2xl text-3xl font-bold tracking-tight">Every recovery feature should show its work.</h1>
          <p className="mt-2 max-w-2xl text-[var(--color-muted)]">ReCo translates public clinical guidance into a supportive prototype. It does not diagnose concussion, prescribe treatment, or provide medical clearance.</p>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          {EXPLANATIONS.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"><Icon size={20} className="text-[var(--color-brand)]" /><h2 className="mt-5 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{body}</p></article>)}
        </section>

        <section>
          <div className="flex items-center gap-2"><ClipboardCheck size={18} className="text-[var(--color-brand)]" /><h2 className="text-xl font-bold">Feature-to-evidence map</h2></div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]">{FEATURE_MAP.map(([feature, basis], index) => <div key={feature} className={`grid gap-1 px-4 py-4 sm:grid-cols-[11rem_1fr] ${index ? "border-t border-[var(--color-line)]" : ""}`}><strong className="text-sm">{feature}</strong><p className="text-sm text-[var(--color-muted)]">{basis}</p></div>)}</div>
        </section>

        <section>
          <h2 className="text-xl font-bold">Primary guidance</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Open the original sources rather than relying on ReCo’s summary.</p>
          <div className="mt-3 space-y-2">{RESEARCH_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-brand)]"><span><span className="block font-semibold">{source.title}</span><span className="mt-1 block text-sm text-[var(--color-muted)]">{source.organization} · {source.supports}</span></span><ArrowUpRight size={17} className="shrink-0 text-[var(--color-muted)] group-hover:text-[var(--color-brand)]" /></a>)}</div>
        </section>

        <section className="rounded-2xl border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] p-5">
          <h2 className="flex items-center gap-2 font-semibold text-[var(--color-warn)]"><ShieldCheck size={18} /> Known limitations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm"><li>Self-reported symptoms and browser tasks can be affected by sleep, device latency, distraction, medication, and practice effects.</li><li>ReCo has not undergone clinical validation or regulatory review.</li><li>AI responses may be incomplete or wrong despite safety filters.</li><li>Danger signs require urgent professional evaluation; a reassuring screen never rules out serious injury.</li></ul>
        </section>
      </div>
    </AppShell>
  );
}
