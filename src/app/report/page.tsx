"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { AppShell, useProfile } from "@/components/AppShell";
import { getAllAssessments, getAllCheckIns, getAllRedFlags } from "@/lib/db";
import { RTP_STAGES } from "@/lib/symptoms";
import type { CognitiveAssessment, RedFlagEvent, SymptomCheckIn } from "@/lib/types";
import { daysSince, formatDate } from "@/lib/utils";

const ASSESSMENT_NAMES = { reaction: "Reaction time", digits: "Digits backward", oneBack: "1-Back attention" };

export default function ReportPage() {
  const { profile } = useProfile();
  const [checkins, setCheckins] = useState<SymptomCheckIn[]>([]);
  const [assessments, setAssessments] = useState<CognitiveAssessment[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlagEvent[]>([]);

  useEffect(() => {
    if (profile) Promise.all([getAllCheckIns(), getAllAssessments(), getAllRedFlags()]).then(([c, a, r]) => {
      setCheckins(c); setAssessments(a); setRedFlags(r);
    });
  }, [profile]);

  const chartData = useMemo(() => checkins.map((item) => ({ date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${item.date}T00:00:00`)), score: item.symptomScore })), [checkins]);
  const latest = checkins.at(-1);
  const first = checkins.at(0);

  if (profile === undefined) return <AppShell><p className="py-12 text-center text-[var(--color-muted)]">Loading…</p></AppShell>;
  if (!profile) return <AppShell><div className="py-12 text-center"><p>Set up your profile first.</p><Link href="/onboarding" className="underline">Get started →</Link></div></AppShell>;

  return (
    <AppShell>
      <article className="print-report space-y-7 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-8">
        <header className="report-controls flex items-start justify-between gap-4">
          <div><Link href="/privacy" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)]"><ArrowLeft size={14} /> Privacy center</Link><p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-brand-dark)]">Recovery summary</p><h1 className="mt-1 text-3xl font-bold">{profile.nickname}</h1><p className="mt-1 text-sm text-[var(--color-muted)]">Injury reported {formatDate(profile.injuryDate)} · Recovery day {daysSince(profile.injuryDate) + 1}</p></div>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 font-semibold text-white"><Printer size={16} /> Print Report</button>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat value={latest?.symptomScore ?? "—"} label="Latest symptom total" /><Stat value={latest?.symptomCount ?? "—"} label="Symptoms present" /><Stat value={profile.currentStage} label="Return-to-play stage" /><Stat value={(profile.currentRTLStage ?? 0) + 1} label="Return-to-learn stage" /></section>

        <section><h2 className="text-lg font-bold">Current Recovery Position</h2><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[var(--color-brand-soft)] p-4"><p className="text-xs font-semibold uppercase text-[var(--color-brand-dark)]">Return to play</p><p className="mt-1 font-semibold">Stage {profile.currentStage}: {RTP_STAGES[profile.currentStage].name}</p></div><div className="rounded-xl bg-[var(--color-brand-soft)] p-4"><p className="text-xs font-semibold uppercase text-[var(--color-brand-dark)]">Change since first snapshot</p><p className="mt-1 font-semibold">{first && latest ? `${latest.symptomScore - first.symptomScore > 0 ? "+" : ""}${latest.symptomScore - first.symptomScore} severity points` : "Not enough snapshots"}</p></div></div></section>

        <section><h2 className="text-lg font-bold">Symptom Direction</h2>{chartData.length > 1 ? <div className="mt-3 h-52"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Area type="monotone" dataKey="score" stroke="var(--color-brand)" fill="var(--color-brand-soft)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div> : <Empty>At least 2 symptom snapshots are needed for a trend.</Empty>}</section>

        <section><h2 className="text-lg font-bold">Recent Cognitive Observations</h2>{assessments.length ? <div className="mt-3 overflow-hidden rounded-xl border border-[var(--color-line)]">{assessments.slice(-6).reverse().map((item) => <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--color-line)] px-4 py-3 text-sm last:border-0"><span>{ASSESSMENT_NAMES[item.type]}</span><strong className="tabular-nums">{item.type === "reaction" ? `${item.reactionTime} ms` : `${item.accuracy}%`}</strong></div>)}</div> : <Empty>No cognitive observations recorded.</Empty>}</section>

        <section><h2 className="text-lg font-bold">Safety Events</h2>{redFlags.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{redFlags.map((event) => event.flags.map((flag) => <li key={`${event.id}-${flag}`}>{flag}</li>))}</ul> : <Empty>No automated safety events recorded.</Empty>}</section>

        <footer className="border-t border-[var(--color-line)] pt-4 text-xs leading-5 text-[var(--color-muted)]">Generated locally by ReCo on {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date())}. This prototype summarizes self-reported wellness data. It is not a medical record, diagnostic assessment, or clearance decision. Review concerning symptoms with a qualified clinician.</footer>
      </article>
    </AppShell>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) { return <div className="rounded-xl border border-[var(--color-line)] p-4"><p className="text-2xl font-bold tabular-nums">{value}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{label}</p></div>; }
function Empty({ children }: { children: React.ReactNode }) { return <p className="mt-3 rounded-xl bg-[var(--color-bg)] p-4 text-sm text-[var(--color-muted)]">{children}</p>; }
