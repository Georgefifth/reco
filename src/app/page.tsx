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
} from "lucide-react";
import { AppShell, useProfile } from "@/components/AppShell";
import { getAllCheckIns, getAllRedFlags } from "@/lib/db";
import type { SymptomCheckIn, RedFlagEvent } from "@/lib/types";
import { RTP_STAGES, detectRedFlagsFromCheckIn } from "@/lib/symptoms";
import { daysSince, formatDate, todayISO, relativeTime } from "@/lib/utils";

export default function HomePage() {
  const { profile } = useProfile();
  const [checkins, setCheckins] = useState<SymptomCheckIn[]>([]);
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
        <EmptyState />
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
            Hi {profile.nickname || "there"} 🌿
          </h1>
          <p className="mt-1 text-[var(--color-muted)]">
            Injured {formatDate(profile.injuryDate)} · Currently in{" "}
            <span className="font-medium text-[var(--color-ink)]">
              Stage {stage.stage}: {stage.name}
            </span>
          </p>
        </section>

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
            href="/protocol"
            icon={ListChecks}
            title="Return-to-Play protocol"
            subtitle={`Stage ${stage.stage} of 6`}
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
      className="group flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-brand)]/40 hover:shadow-sm"
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

function EmptyState() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
        <BookHeart size={28} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome to ReCo</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        A private concussion recovery companion. Track symptoms, follow an evidence-based
        return-to-play protocol, and journal with a local AI — all on your device.
      </p>
      <Link
        href="/onboarding"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--color-brand-dark)]"
      >
        Get started <ArrowRight size={16} />
      </Link>
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        No account needed. Your data stays in your browser.
      </p>
    </div>
  );
}
