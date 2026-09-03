"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Gauge, ListRestart, MemoryStick, X } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell, useProfile } from "@/components/AppShell";
import { DigitsBackwardTest, type DigitsResult } from "@/components/cognitive/DigitsBackwardTest";
import { OneBackTest, type OneBackResult } from "@/components/cognitive/OneBackTest";
import { ReactionTimeTest, type ReactionResult } from "@/components/cognitive/ReactionTimeTest";
import { getAllAssessments, saveAssessment } from "@/lib/db";
import type { AssessmentType, CognitiveAssessment } from "@/lib/types";
import { relativeTime, uid } from "@/lib/utils";

const TESTS = {
  reaction: { name: "Reaction time", detail: "Five visual-response trials", icon: Gauge, unit: "ms" },
  digits: { name: "Digits backward", detail: "Working memory · 8 trials", icon: ListRestart, unit: "%" },
  oneBack: { name: "1-Back", detail: "Attention · 20 trials", icon: MemoryStick, unit: "%" },
} satisfies Record<AssessmentType, { name: string; detail: string; icon: typeof Gauge; unit: string }>;

export default function AssessPage() {
  const { profile } = useProfile();
  const [active, setActive] = useState<AssessmentType | null>(null);
  const [history, setHistory] = useState<CognitiveAssessment[]>([]);
  const [result, setResult] = useState<CognitiveAssessment | null>(null);

  useEffect(() => {
    if (profile) getAllAssessments().then(setHistory);
  }, [profile]);

  async function complete(type: AssessmentType, score: number, accuracy: number, reactionTime: number | undefined, details: Record<string, number>) {
    const assessment: CognitiveAssessment = { id: uid(), type, createdAt: Date.now(), score, accuracy, reactionTime, details };
    await saveAssessment(assessment);
    setHistory((items) => [...items, assessment]);
    setResult(assessment);
  }

  const chartData = useMemo(() => history.slice(-12).map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.type === "reaction" ? item.reactionTime : item.accuracy,
    name: TESTS[item.type].name,
  })), [history]);

  if (profile === undefined) return <AppShell><p className="py-12 text-center text-[var(--color-muted)]">Loading…</p></AppShell>;
  if (!profile) return <AppShell><div className="py-12 text-center"><p className="text-[var(--color-muted)]">Set up your profile before taking a baseline.</p><Link href="/onboarding" className="mt-3 inline-block text-[var(--color-brand-dark)] underline">Get started →</Link></div></AppShell>;

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)]"><ArrowLeft size={14} /> Home</Link>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-brand-dark)]">Cognitive pulse</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Notice change, not diagnosis.</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted)]">These short tasks help you observe your own attention, memory, and response patterns over time. They are not clinical tests and cannot clear you for school, work, or sport.</p>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(TESTS) as AssessmentType[]).map((type) => {
            const test = TESTS[type];
            const Icon = test.icon;
            const latest = history.filter((item) => item.type === type).at(-1);
            return (
              <button key={type} type="button" onClick={() => { setActive(type); setResult(null); }} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-left transition-colors hover:border-[var(--color-brand)]">
                <Icon size={20} className="text-[var(--color-brand)]" />
                <span className="mt-6 block font-semibold">{test.name}</span>
                <span className="block text-sm text-[var(--color-muted)]">{test.detail}</span>
                <span className="mt-3 block font-mono text-xs text-[var(--color-muted)]">{latest ? `Last: ${type === "reaction" ? latest.reactionTime : latest.accuracy}${test.unit}` : "No baseline yet"}</span>
              </button>
            );
          })}
        </section>

        {active && (
          <section className="rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-4 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-dark)]">Now testing</p><h2 className="text-xl font-bold">{TESTS[active].name}</h2></div>
              <button type="button" onClick={() => setActive(null)} className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface)]" aria-label="Close assessment"><X size={18} /></button>
            </div>
            {result ? (
              <ResultCard result={result} onAgain={() => { setResult(null); setActive(null); requestAnimationFrame(() => setActive(result.type)); }} />
            ) : active === "reaction" ? (
              <ReactionTimeTest onComplete={(value: ReactionResult) => complete("reaction", Math.max(0, Math.round(100 - (value.average - 180) / 5)), 100, value.average, { trials: value.attempts.length, fastest: Math.min(...value.attempts) })} />
            ) : active === "digits" ? (
              <DigitsBackwardTest onComplete={(value: DigitsResult) => complete("digits", value.score, value.score, undefined, { correct: value.correct, total: value.total })} />
            ) : (
              <OneBackTest onComplete={(value: OneBackResult) => complete("oneBack", value.score, value.score, value.averageReaction, { correct: value.correct, total: value.total })} />
            )}
          </section>
        )}

        {chartData.length > 1 && (
          <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h2 className="font-semibold">Your recent cognitive pulse</h2>
            <p className="text-sm text-[var(--color-muted)]">Compare repeated runs of the same task; scores across different tasks use different scales.</p>
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="value" stroke="var(--color-brand)" fill="var(--color-brand-soft)" strokeWidth={2} /></AreaChart></ResponsiveContainer>
            </div>
          </section>
        )}

        {history.length > 0 && (
          <section><h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">Local history</h2><ul className="space-y-2">{history.slice().reverse().slice(0, 6).map((item) => <li key={item.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm"><span><strong>{TESTS[item.type].name}</strong> · {item.type === "reaction" ? `${item.reactionTime} ms` : `${item.accuracy}% accuracy`}</span><span className="text-[var(--color-muted)]">{relativeTime(item.createdAt)}</span></li>)}</ul></section>
        )}
      </div>
    </AppShell>
  );
}

function ResultCard({ result, onAgain }: { result: CognitiveAssessment; onAgain: () => void }) {
  const value = result.type === "reaction" ? `${result.reactionTime} ms` : `${result.accuracy}%`;
  return <div className="rounded-2xl bg-[var(--color-surface)] p-8 text-center"><BrainCircuit className="mx-auto text-[var(--color-brand)]" /><p className="mt-4 text-sm text-[var(--color-muted)]">Saved privately as today’s observation</p><p className="mt-1 text-4xl font-bold">{value}</p><p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-muted)]">One result is not meaningful on its own. Repeat under similar conditions and discuss concerning changes with a clinician.</p><button type="button" onClick={onAgain} className="mt-5 rounded-lg border border-[var(--color-line)] px-4 py-2 font-medium">Run again</button></div>;
}
