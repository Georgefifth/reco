"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Activity,
  Clock,
} from "lucide-react";
import { AppShell, useProfile } from "@/components/AppShell";
import {
  getAllCheckIns,
  getAllProtocolLogs,
  saveProtocolLog,
  saveProfile,
} from "@/lib/db";
import { RTP_STAGES } from "@/lib/symptoms";
import type { ProtocolStageLog, SymptomCheckIn } from "@/lib/types";
import { uid, formatDate, relativeTime } from "@/lib/utils";

export default function ProtocolPage() {
  const { profile, setProfile } = useProfile();
  const [logs, setLogs] = useState<ProtocolStageLog[]>([]);
  const [checkins, setCheckins] = useState<SymptomCheckIn[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (profile === undefined) return;
    if (!profile) return;
    Promise.all([getAllProtocolLogs(), getAllCheckIns()]).then(([l, c]) => {
      setLogs(l);
      setCheckins(c);
      setLoaded(true);
    });
  }, [profile]);

  // Days symptom-free at current stage (look at check-ins since stageStartedAt)
  const daysSymptomFreeAtStage = (() => {
    if (!profile) return 0;
    const since = profile.stageStartedAt;
    const relevant = checkins.filter((c) => new Date(c.date + "T00:00:00").getTime() >= since);
    if (relevant.length === 0) return 0;
    const allFree = relevant.every((c) => c.symptomScore === 0);
    if (!allFree) {
      // count consecutive symptom-free days from the most recent
      let count = 0;
      for (let i = relevant.length - 1; i >= 0; i--) {
        if (relevant[i].symptomScore === 0) count++;
        else break;
      }
      return count;
    }
    return relevant.length;
  })();

  const canAdvance =
    profile && profile.currentStage < 6 && daysSymptomFreeAtStage >= 1;

  async function advance() {
    if (!profile || profile.currentStage >= 6) return;
    const next = profile.currentStage + 1;
    const now = Date.now();
    const updated = { ...profile, currentStage: next, stageStartedAt: now };
    await saveProfile(updated);
    await saveProtocolLog({
      id: uid(),
      stage: next,
      action: "advanced",
      createdAt: now,
      note: `Advanced to stage ${next}`,
    });
    setProfile(updated);
    setLogs((l) => [...l, { id: uid(), stage: next, action: "advanced", createdAt: now, note: `Advanced to stage ${next}` }]);
  }

  async function regress() {
    if (!profile || profile.currentStage <= 0) return;
    const prev = profile.currentStage - 1;
    const now = Date.now();
    const updated = { ...profile, currentStage: prev, stageStartedAt: now };
    await saveProfile(updated);
    await saveProtocolLog({
      id: uid(),
      stage: prev,
      action: "regressed",
      createdAt: now,
      note: `Returned to stage ${prev} after symptom flare`,
    });
    setProfile(updated);
    setLogs((l) => [...l, { id: uid(), stage: prev, action: "regressed", createdAt: now, note: `Returned to stage ${prev}` }]);
  }

  if (profile === undefined) {
    return (
      <AppShell>
        <p className="py-12 text-center text-[var(--color-muted)]">Loading…</p>
      </AppShell>
    );
  }
  if (!profile) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <p className="text-[var(--color-muted)]">Set up your profile first.</p>
          <Link href="/onboarding" className="mt-3 inline-block text-[var(--color-brand-dark)] underline">
            Get started →
          </Link>
        </div>
      </AppShell>
    );
  }

  const current = RTP_STAGES[profile.currentStage];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Return-to-Play protocol</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Based on the Berlin consensus statement (2016/2022) and CDC HEADS UP. Each stage requires
            ~24 hours symptom-free before advancing. Stop and rest if symptoms return.
          </p>
        </div>

        {/* Current stage card */}
        <section className="rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-dark)]">
              Current stage
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[var(--color-brand-dark)]">
              <Clock size={12} /> {relativeTime(profile.stageStartedAt)}
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-[var(--color-brand-dark)]">
            Stage {current.stage}: {current.name}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink)]">{current.description}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--color-surface)]/70 p-3">
              <p className="text-xs font-semibold uppercase text-[var(--color-muted)]">Activities</p>
              <p className="mt-1 text-sm">{current.activities}</p>
            </div>
            <div className="rounded-lg bg-[var(--color-surface)]/70 p-3">
              <p className="text-xs font-semibold uppercase text-[var(--color-muted)]">Goal</p>
              <p className="mt-1 text-sm">{current.goal}</p>
            </div>
          </div>

          {/* Symptom-free tracker */}
          <div className="mt-4 rounded-lg bg-[var(--color-surface)]/70 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Symptom-free days at this stage</p>
              <p className="text-lg font-bold text-[var(--color-brand-dark)]">
                {daysSymptomFreeAtStage}
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-line)]">
              <div
                className="h-full rounded-full bg-[var(--color-brand)] transition-all"
                style={{ width: `${Math.min(100, (daysSymptomFreeAtStage / 1) * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-muted)]">
              {canAdvance
                ? "✓ You're clear to advance when ready."
                : profile.currentStage === 6
                  ? "You've completed the protocol — keep monitoring."
                  : "Log a symptom-free check-in to become eligible to advance."}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.currentStage < 6 && (
              <button
                onClick={advance}
                disabled={!canAdvance}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 font-semibold text-white hover:bg-[var(--color-brand-dark)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} /> Advance to Stage {profile.currentStage + 1}
              </button>
            )}
            {profile.currentStage > 0 && (
              <button
                onClick={regress}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 font-medium text-[var(--color-warn)] hover:bg-[var(--color-warn-soft)]"
              >
                <RotateCcw size={16} /> Symptoms returned — go back
              </button>
            )}
          </div>
          {profile.currentStage === 4 && (
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-[var(--color-warn-soft)] p-2 text-xs text-[var(--color-warn)]">
              <AlertTriangle size={12} /> Stage 5 (full-contact practice) requires clinician
              clearance. Don't advance without it.
            </p>
          )}
        </section>

        {/* All stages overview */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            All stages
          </h2>
          <ol className="space-y-2">
            {RTP_STAGES.map((s) => {
              const done = s.stage < profile.currentStage;
              const active = s.stage === profile.currentStage;
              return (
                <li
                  key={s.stage}
                  className={`flex items-start gap-3 rounded-xl border p-3 ${
                    active
                      ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                      : done
                        ? "border-[var(--color-line)] bg-[var(--color-surface)] opacity-70"
                        : "border-[var(--color-line)] bg-[var(--color-surface)]"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      done
                        ? "bg-[var(--color-brand)] text-white"
                        : active
                          ? "border-2 border-[var(--color-brand)] text-[var(--color-brand-dark)]"
                          : "bg-[var(--color-line)] text-[var(--color-muted)]"
                    }`}
                  >
                    {done ? <Check size={14} /> : s.stage}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {s.name}
                      {active && (
                        <span className="ml-2 rounded-full bg-[var(--color-brand)] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">{s.description}</p>
                  </div>
                  <ChevronRight size={16} className="mt-1 text-[var(--color-muted)]" />
                </li>
              );
            })}
          </ol>
        </section>

        {/* History */}
        {logs.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              <Activity size={14} /> Protocol history
            </h2>
            <ul className="space-y-1 text-sm">
              {logs
                .slice()
                .reverse()
                .map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2"
                  >
                    <span>
                      <span
                        className={`mr-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                          l.action === "advanced"
                            ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]"
                            : l.action === "regressed"
                              ? "bg-[var(--color-warn-soft)] text-[var(--color-warn)]"
                              : "bg-[var(--color-line)] text-[var(--color-muted)]"
                        }`}
                      >
                        {l.action}
                      </span>
                      Stage {l.stage}
                      {l.note && <span className="text-[var(--color-muted)]"> — {l.note}</span>}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {relativeTime(l.createdAt)}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {!loaded && (
          <p className="text-center text-sm text-[var(--color-muted)]">Loading…</p>
        )}
      </div>
    </AppShell>
  );
}
