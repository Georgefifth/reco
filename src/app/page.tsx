"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  BookHeart,
  ListChecks,
  TrendingDown,
  TrendingUp,
  Minus,
  BrainCircuit,
  Library,
  Sparkles,
  Play,
  ShieldCheck,
  LineChart,
} from "lucide-react";
import { AppShell, useProfile } from "@/components/AppShell";
import { getAllCheckIns, getAllRedFlags } from "@/lib/db";
import type { SymptomCheckIn, RedFlagEvent } from "@/lib/types";
import { RTP_STAGES, detectRedFlagsFromCheckIn } from "@/lib/symptoms";
import { findPatterns } from "@/lib/patterns";
import { seedDemoData } from "@/lib/demo";
import { daysSince, formatDate, todayISO, relativeTime } from "@/lib/utils";

export default function HomePage() {
  const { profile, setProfile } = useProfile();
  const [checkins, setCheckins] = useState<SymptomCheckIn[]>([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const [redflags, setRedflags] = useState<RedFlagEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (profile === undefined) return;
    if (!profile) return;
    Promise.all([getAllCheckIns(), getAllRedFlags()]).then(([c, r]) => {
      setCheckins(c);
      setRedflags(r);
      setLoaded(true);
    });
  }, [profile]);

  const today = todayISO();
  const checkedInToday = checkins.some((c) => c.date === today);

  const trend = useMemo(() => {
    if (checkins.length < 2) return null;
    const last = checkins[checkins.length - 1];
    const prev = checkins[checkins.length - 2];
    const diff = last.symptomScore - prev.symptomScore;
    return { diff, last, prev };
  }, [checkins]);

  const activeRedFlags = useMemo(() => {
    if (!checkins.length) return [] as string[];
    const last = checkins[checkins.length - 1];
    return detectRedFlagsFromCheckIn(last.symptoms);
  }, [checkins]);
  const patterns = useMemo(() => findPatterns(checkins), [checkins]);

  async function startDemo() {
    setDemoLoading(true);
    const demoProfile = await seedDemoData();
    setProfile(demoProfile);
  }

  if (profile === undefined) {
    return (
      <AppShell>
        <div className="py-12 text-center text-[var(--color-muted)]">Loading…</div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell>
        <EmptyState onDemo={startDemo} loading={demoLoading} />
      </AppShell>
    );
  }

  const stage = RTP_STAGES[profile.currentStage] ?? RTP_STAGES[0];
  const dayCount = daysSince(profile.injuryDate) + 1;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Greeting */}
        <section>
          <p className="text-sm text-[var(--color-muted)]">Day {dayCount} of recovery</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Hi {profile.nickname || "there"}
          </h1>
          <p className="mt-1 text-[var(--color-muted)]">
            Injured {formatDate(profile.injuryDate)} · Currently in{" "}
            <span className="font-medium text-[var(--color-ink)]">
              Stage {stage.stage}: {stage.name}
            </span>
          </p>
        </section>

        {profile.isDemo && (
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-surface)] p-4">
            <div><p className="font-semibold">You’re exploring a local demo</p><p className="text-sm text-[var(--color-muted)]">Maya’s sample recovery data exists only in this browser. Remove it anytime in Privacy.</p></div>
            <Link href="/privacy" className="text-sm font-semibold text-[var(--color-accent)] hover:underline">Manage Demo Data</Link>
          </section>
        )}

        {/* Red flag banner */}
        {activeRedFlags.length > 0 && (
          <section
            role="alert"
            className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 shrink-0 text-[var(--color-danger)]" size={20} />
              <div>
                <h2 className="font-semibold text-[var(--color-danger)]">
                  Heads up — monitor these symptoms
                </h2>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {activeRedFlags.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  If symptoms worsen, vomit repeatedly, slur speech, weaken one side, or you lose
                  consciousness — <strong>call 911 immediately.</strong>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Quick actions */}
        <section className="grid gap-3 sm:grid-cols-2">
          <ActionCard
            href="/checkin"
            icon={ClipboardList}
            title={checkedInToday ? "Edit today's check-in" : "Daily check-in"}
            subtitle={
              checkedInToday ? "You've checked in today — update anytime" : "2 minutes · 22 symptoms"
            }
            accent={checkedInToday ? "brand" : "warn"}
          />
          <ActionCard
            href="/journal"
            icon={BookHeart}
            title="Journal with ReCo AI"
            subtitle="Local & private · process the day"
            accent="accent"
          />
          <ActionCard
            href="/assess"
            icon={BrainCircuit}
            title="Cognitive pulse"
            subtitle="Reaction · memory · attention"
            accent="brand"
          />
          <ActionCard
            href="/protocol"
            icon={ListChecks}
            title="Recovery pathways"
            subtitle={`Play stage ${stage.stage} · learning support`}
            accent="brand"
          />
          <ActionCard
            href="/evidence"
            icon={Library}
            title="Evidence ledger"
            subtitle="Sources, rationale, and limitations"
            accent="brand"
          />
          <ActionCard
            href="/privacy"
            icon={CalendarDays}
            title="Your data"
            subtitle="Export or delete · 100% local"
            accent="brand"
          />
        </section>

        {patterns.length > 0 && (
          <section className="rounded-xl border border-[var(--color-accent)]/25 bg-[var(--color-surface)] p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]"><Sparkles size={15} /> Patterns worth noticing</h2>
            <div className="mt-3 space-y-3">{patterns.map((pattern) => <div key={pattern.title}><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-semibold">{pattern.title}</h3><span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">{pattern.confidence}</span></div><p className="mt-1 text-sm text-[var(--color-muted)]">{pattern.detail}</p></div>)}</div>
          </section>
        )}

        {/* Trend */}
        {trend && (
          <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Symptom trend
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <TrendIcon diff={trend.diff} />
              <div>
                <p className="text-2xl font-bold">{trend.last.symptomScore}</p>
                <p className="text-sm text-[var(--color-muted)]">
                  {trend.diff === 0
                    ? "Stable vs. last check-in"
                    : trend.diff > 0
                      ? `${trend.diff} points higher than ${formatDate(trend.prev.date)}`
                      : `${Math.abs(trend.diff)} points lower than ${formatDate(trend.prev.date)}`}
                </p>
              </div>
            </div>
            <Link
              href="/checkin"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-dark)] hover:underline"
            >
              See full history <ArrowRight size={14} />
            </Link>
          </section>
        )}

        {/* Recent red flag events */}
        {redflags.length > 0 && (
          <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Recent safety events
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {redflags.slice(0, 3).map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <span>{r.flags.join(", ")}</span>
                  <span className="text-[var(--color-muted)]">{relativeTime(r.createdAt)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!loaded && (
          <p className="text-center text-sm text-[var(--color-muted)]">Loading your data…</p>
        )}
      </div>
    </AppShell>
  );
}

function TrendIcon({ diff }: { diff: number }) {
  if (diff > 0)
    return (
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-warn-soft)] text-[var(--color-warn)]">
        <TrendingUp size={22} />
      </span>
    );
  if (diff < 0)
    return (
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
        <TrendingDown size={22} />
      </span>
    );
  return (
    <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-muted)]">
      <Minus size={22} />
    </span>
  );
}

function ActionCard({
  href,
  icon: Icon,
  title,
  subtitle,
  accent,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subtitle: string;
  accent: "brand" | "warn" | "accent";
}) {
  const accentMap = {
    brand: "bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]",
    warn: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
    accent: "bg-[var(--color-brand-soft)] text-[var(--color-accent)]",
  };
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-[border-color,box-shadow] hover:border-[var(--color-brand)]/40 hover:shadow-sm"
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${accentMap[accent]}`}>
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block truncate text-sm text-[var(--color-muted)]">{subtitle}</span>
      </span>
      <ArrowRight
        size={16}
        className="text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function EmptyState({ onDemo, loading }: { onDemo: () => void; loading: boolean }) {
  return (
    <div className="py-8 sm:py-14">
      <section className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-brand-dark)]">Concussion recovery, held locally</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">Recovery is not a straight line. Make it visible.</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--color-muted)]">ReCo connects daily symptoms, cognitive observations, return-to-learn, and return-to-play—without creating a cloud copy of your health data.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/onboarding" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--color-brand-dark)]">Start My Recovery <ArrowRight size={16} /></Link>
            <button type="button" onClick={onDemo} disabled={loading} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-2.5 font-semibold transition-colors hover:border-[var(--color-brand)] disabled:opacity-50"><Play size={16} /> {loading ? "Preparing Demo…" : "Explore Sample Recovery"}</button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-[var(--color-muted)]"><ShieldCheck size={16} className="text-[var(--color-brand)]" /> No account · no analytics · one-click export & deletion</p>
        </div>

        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-[0_18px_60px_rgba(31,41,55,0.08)]">
          <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">One recovery · 3 signals</p><p className="mt-1 font-semibold">A picture to bring to care</p></div><LineChart size={21} className="text-[var(--color-brand)]" /></div>
          <div className="space-y-5 py-5">
            <Signal label="Symptoms" value="33 → 6" note="9 daily snapshots" bars={[100, 82, 68, 48, 31, 18]} />
            <Signal label="Cognitive pulse" value="+15%" note="Personal baseline only" bars={[35, 42, 49, 58, 67, 78]} />
            <Signal label="Recovery paths" value="2 / 6" note="Sport · supported school return" bars={[100, 100, 45, 0, 0, 0]} />
          </div>
          <div className="rounded-xl bg-[var(--color-brand-soft)] p-3 text-sm text-[var(--color-brand-dark)]"><strong>Local by design.</strong> The browser stores the record; Ollama keeps journal inference on the same device.</div>
        </div>
      </section>

      <section className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-3">
        <ValuePoint icon={ClipboardList} title="Observe" body="A low-load, grouped daily snapshot instead of one overwhelming form." />
        <ValuePoint icon={ListChecks} title="Pace" body="Separate evidence-informed paths for returning to learning and sport." />
        <ValuePoint icon={BookHeart} title="Reflect" body="A locally run AI journal with emergency screening and response safeguards." />
      </section>
    </div>
  );
}

function Signal({ label, value, note, bars }: { label: string; value: string; note: string; bars: number[] }) {
  return <div><div className="flex items-end justify-between gap-3"><div><p className="text-sm font-semibold">{label}</p><p className="text-xs text-[var(--color-muted)]">{note}</p></div><strong className="font-mono text-sm tabular-nums">{value}</strong></div><div className="mt-2 flex h-7 items-end gap-1" aria-hidden="true">{bars.map((height, index) => <span key={index} className="flex-1 rounded-sm bg-[var(--color-brand)]/70" style={{ height: `${Math.max(12, height)}%` }} />)}</div></div>;
}

function ValuePoint({ icon: Icon, title, body }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; body: string }) {
  return <article className="bg-[var(--color-surface)] p-5"><Icon size={18} className="text-[var(--color-brand)]" /><h2 className="mt-4 font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{body}</p></article>;
}
