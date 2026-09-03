"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowLeft, Check, Clock, GraduationCap, Printer, RotateCcw, Trophy } from "lucide-react";
import { AppShell, useProfile } from "@/components/AppShell";
import { getAllCheckIns, getAllProtocolLogs, saveProfile, saveProtocolLog } from "@/lib/db";
import { RTL_STAGES, RTP_STAGES, suggestedAccommodations } from "@/lib/symptoms";
import type { ProtocolStageLog, SymptomCheckIn } from "@/lib/types";
import { relativeTime, uid } from "@/lib/utils";

export default function ProtocolPage() {
  const { profile, setProfile } = useProfile();
  const [mode, setMode] = useState<"play" | "learn">("play");
  const [logs, setLogs] = useState<ProtocolStageLog[]>([]);
  const [checkins, setCheckins] = useState<SymptomCheckIn[]>([]);

  useEffect(() => {
    if (profile) Promise.all([getAllProtocolLogs(), getAllCheckIns()]).then(([nextLogs, nextCheckins]) => {
      setLogs(nextLogs);
      setCheckins(nextCheckins);
    });
  }, [profile]);

  const daysSymptomFreeAtStage = useMemo(() => {
    if (!profile) return 0;
    const relevant = checkins.filter((item) => new Date(`${item.date}T23:59:59`).getTime() >= profile.stageStartedAt);
    let count = 0;
    for (let index = relevant.length - 1; index >= 0 && relevant[index].symptomScore === 0; index--) count++;
    return count;
  }, [checkins, profile]);

  const accommodations = useMemo(() => {
    const latest = checkins.at(-1);
    return latest ? suggestedAccommodations(latest.symptoms) : [];
  }, [checkins]);

  async function changePlayStage(direction: 1 | -1) {
    if (!profile) return;
    const stage = Math.max(0, Math.min(6, profile.currentStage + direction));
    const now = Date.now();
    const updated = { ...profile, currentStage: stage, stageStartedAt: now };
    const log: ProtocolStageLog = { id: uid(), stage, action: direction === 1 ? "advanced" : "regressed", createdAt: now, note: direction === 1 ? `Advanced to stage ${stage}` : `Returned to stage ${stage} after symptom flare` };
    await Promise.all([saveProfile(updated), saveProtocolLog(log)]);
    setProfile(updated);
    setLogs((items) => [...items, log]);
  }

  async function changeLearnStage(stage: number) {
    if (!profile) return;
    const updated = { ...profile, currentRTLStage: stage, rtlStageStartedAt: Date.now() };
    await saveProfile(updated);
    setProfile(updated);
  }

  if (profile === undefined) return <AppShell><p className="py-12 text-center text-[var(--color-muted)]">Loading…</p></AppShell>;
  if (!profile) return <AppShell><div className="py-12 text-center"><p className="text-[var(--color-muted)]">Set up your profile first.</p><Link href="/onboarding" className="mt-3 inline-block text-[var(--color-brand-dark)] underline">Get started →</Link></div></AppShell>;

  const currentPlay = RTP_STAGES[profile.currentStage];
  const currentLearnIndex = profile.currentRTLStage ?? 0;
  const currentLearn = RTL_STAGES[currentLearnIndex];
  const canAdvancePlay = profile.currentStage < 6 && daysSymptomFreeAtStage >= 1;

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)]"><ArrowLeft size={14} /> Home</Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Stepwise recovery</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Choose the path that matches today. School and sport progress separately, and neither replaces clinician guidance.</p>
        </header>

        <div className="grid grid-cols-2 rounded-xl bg-[var(--color-line)]/60 p-1" role="tablist" aria-label="Recovery protocol">
          <button type="button" role="tab" aria-selected={mode === "play"} onClick={() => setMode("play")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${mode === "play" ? "bg-[var(--color-surface)] shadow-sm" : "text-[var(--color-muted)]"}`}><Trophy size={16} /> Return to play</button>
          <button type="button" role="tab" aria-selected={mode === "learn"} onClick={() => setMode("learn")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${mode === "learn" ? "bg-[var(--color-surface)] shadow-sm" : "text-[var(--color-muted)]"}`}><GraduationCap size={16} /> Return to learn</button>
        </div>

        {mode === "play" ? (
          <>
            <section className="rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-dark)]"><span>Current stage</span><span className="inline-flex items-center gap-1"><Clock size={12} /> {relativeTime(profile.stageStartedAt)}</span></div>
              <h2 className="mt-1 text-xl font-bold text-[var(--color-brand-dark)]">Stage {currentPlay.stage}: {currentPlay.name}</h2>
              <p className="mt-1 text-sm">{currentPlay.description}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2"><Info label="Activities" body={currentPlay.activities} /><Info label="Goal" body={currentPlay.goal} /></div>
              <div className="mt-4 rounded-lg bg-[var(--color-surface)]/70 p-3"><div className="flex justify-between"><span className="text-sm font-medium">Consecutive symptom-free check-ins</span><strong>{daysSymptomFreeAtStage}</strong></div><p className="mt-1 text-xs text-[var(--color-muted)]">{canAdvancePlay ? "Eligible to advance when you and your care team are ready." : "Complete a symptom-free check-in before advancing."}</p></div>
              <div className="mt-4 flex flex-wrap gap-2">{profile.currentStage < 6 && <button type="button" onClick={() => changePlayStage(1)} disabled={!canAdvancePlay} className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 font-semibold text-white disabled:opacity-40"><Check size={16} /> Advance</button>}{profile.currentStage > 0 && <button type="button" onClick={() => changePlayStage(-1)} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 font-medium text-[var(--color-warn)]"><RotateCcw size={16} /> Symptoms returned</button>}</div>
              {profile.currentStage === 4 && <p className="mt-3 flex gap-2 rounded-lg bg-[var(--color-warn-soft)] p-2 text-xs text-[var(--color-warn)]"><AlertTriangle size={14} /> Full-contact practice requires clinician clearance.</p>}
            </section>
            <StageList stages={RTP_STAGES} current={profile.currentStage} />
            {logs.length > 0 && <section><h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]"><Activity size={14} /> Protocol history</h2><ul className="space-y-2">{logs.slice().reverse().map((log) => <li key={log.id} className="flex justify-between rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm"><span>{log.action} · Stage {log.stage}</span><span className="text-[var(--color-muted)]">{relativeTime(log.createdAt)}</span></li>)}</ul></section>}
          </>
        ) : (
          <>
            <section className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">Current learning load · {currentLearn.setting}</p>
              <h2 className="mt-1 text-xl font-bold">Stage {currentLearn.stage + 1}: {currentLearn.name}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{currentLearn.description}</p>
              <div className="mt-4 rounded-lg bg-[var(--color-brand-soft)] p-3 text-sm"><strong>Ready to consider the next stage when:</strong><p className="mt-1">{currentLearn.readyWhen}</p></div>
              <div className="mt-4 flex gap-2"><button type="button" disabled={currentLearnIndex === 0} onClick={() => changeLearnStage(currentLearnIndex - 1)} className="rounded-lg border border-[var(--color-line)] px-4 py-2 font-medium disabled:opacity-40">Step back</button><button type="button" disabled={currentLearnIndex === 3} onClick={() => changeLearnStage(currentLearnIndex + 1)} className="rounded-lg bg-[var(--color-accent)] px-4 py-2 font-semibold text-white disabled:opacity-40">Increase learning load</button></div>
            </section>
            <StageList stages={RTL_STAGES.map((stage) => ({ ...stage, activities: stage.setting, goal: stage.readyWhen, minDays: 0 }))} current={currentLearnIndex} offset={1} />
            <section className="print-letter rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Suggested temporary supports</p><h2 className="mt-1 text-lg font-bold">For {profile.nickname}’s school team</h2></div><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm font-medium"><Printer size={15} /> Print</button></div>
              <p className="mt-3 text-sm">These suggestions reflect the latest self-reported symptoms and should be reviewed with a clinician and school accessibility staff.</p>
              {accommodations.length > 0 ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{accommodations.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-3 rounded-lg bg-[var(--color-bg)] p-3 text-sm text-[var(--color-muted)]">Complete a symptom check-in to generate symptom-matched suggestions.</p>}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

function Info({ label, body }: { label: string; body: string }) { return <div className="rounded-lg bg-[var(--color-surface)]/70 p-3"><p className="text-xs font-semibold uppercase text-[var(--color-muted)]">{label}</p><p className="mt-1 text-sm">{body}</p></div>; }

function StageList({ stages, current, offset = 0 }: { stages: Array<{ stage: number; name: string; description: string }>; current: number; offset?: number }) { return <section><h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">Full pathway</h2><ol className="space-y-2">{stages.map((stage) => <li key={stage.stage} className={`flex gap-3 rounded-xl border p-3 ${stage.stage === current ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]" : "border-[var(--color-line)] bg-[var(--color-surface)]"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${stage.stage < current ? "bg-[var(--color-brand)] text-white" : "bg-[var(--color-line)] text-[var(--color-muted)]"}`}>{stage.stage < current ? <Check size={14} /> : stage.stage + offset}</span><div><p className="font-medium">{stage.name}</p><p className="text-sm text-[var(--color-muted)]">{stage.description}</p></div></li>)}</ol></section>; }
