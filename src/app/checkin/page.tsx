"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Check, AlertTriangle, ArrowLeft, Save } from "lucide-react";
import { AppShell, useProfile } from "@/components/AppShell";
import {
  getAllCheckIns,
  getCheckInByDate,
  saveCheckIn,
  saveRedFlag,
} from "@/lib/db";
import { SYMPTOM_LABELS, SYMPTOM_HELP, detectRedFlagsFromCheckIn } from "@/lib/symptoms";
import { SYMPTOM_KEYS, type SymptomCheckIn, type SymptomKey } from "@/lib/types";
import { uid, todayISO, formatDate } from "@/lib/utils";

export default function CheckInPage() {
  const { profile } = useProfile();
  const [date, setDate] = useState(todayISO());
  const [values, setValues] = useState<Partial<Record<SymptomKey, number>>>({});
  const [notes, setNotes] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [allCheckIns, setAllCheckIns] = useState<SymptomCheckIn[]>([]);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (profile === undefined) return;
    if (!profile) return;
    getAllCheckIns().then((c) => {
      setAllCheckIns(c);
      setLoaded(true);
    });
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    getCheckInByDate(date).then((c) => {
      if (c) {
        setValues(c.symptoms);
        setNotes(c.notes ?? "");
        setExistingId(c.id);
      } else {
        setValues({});
        setNotes("");
        setExistingId(null);
      }
      setSaved(false);
    });
  }, [date, profile]);

  const score = useMemo(
    () => Object.values(values).reduce((a, b) => a + (b ?? 0), 0),
    [values],
  );
  const count = useMemo(
    () => Object.values(values).filter((v) => (v ?? 0) > 0).length,
    [values],
  );

  const chartData = useMemo(
    () =>
      allCheckIns.map((c) => ({
        date: c.date,
        score: c.symptomScore,
        count: c.symptomCount,
        label: formatDate(c.date).replace(/, \d{4}$/, ""),
      })),
    [allCheckIns],
  );

  async function save() {
    if (!profile) return;
    const id = existingId ?? uid();
    const checkin: SymptomCheckIn = {
      id,
      date,
      createdAt: Date.now(),
      symptoms: values,
      notes: notes.trim() || undefined,
      symptomScore: score,
      symptomCount: count,
    };
    await saveCheckIn(checkin);
    setExistingId(id);
    setSaved(true);
    // Detect red flags and persist an event
    const flags = detectRedFlagsFromCheckIn(values);
    if (flags.length > 0) {
      await saveRedFlag({
        id: uid(),
        createdAt: Date.now(),
        flags,
        acknowledged: false,
      });
    }
    // refresh list
    const refreshed = await getAllCheckIns();
    setAllCheckIns(refreshed);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Daily symptom check-in</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Based on the SCAT-5 22-item symptom evaluation. Rate each from 0 (none) to 6 (severe).
          </p>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium" htmlFor="checkin-date">
            Date:
          </label>
          <input
            id="checkin-date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-brand)]"
          />
        </div>

        {/* Trend chart */}
        {chartData.length >= 2 && (
          <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Your symptom score over time
            </h2>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "var(--color-muted)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-muted)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-brand)"
                    strokeWidth={2}
                    fill="url(#scoreGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Symptom list */}
        <section className="space-y-3">
          {SYMPTOM_KEYS.map((key) => {
            const v = values[key] ?? 0;
            return (
              <div
                key={key}
                className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor={`s-${key}`} className="font-medium">
                    {SYMPTOM_LABELS[key]}
                  </label>
                  <span
                    className={`text-sm font-bold ${
                      v >= 4
                        ? "text-[var(--color-warn)]"
                        : v > 0
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-muted)]"
                    }`}
                  >
                    {v}/6
                  </span>
                </div>
                {SYMPTOM_HELP[key] && (
                  <p className="mt-0.5 text-xs text-[var(--color-muted)]">{SYMPTOM_HELP[key]}</p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <input
                    id={`s-${key}`}
                    type="range"
                    min={0}
                    max={6}
                    step={1}
                    value={v}
                    onChange={(e) =>
                      setValues((s) => ({ ...s, [key]: Number(e.target.value) }))
                    }
                    className="severity flex-1"
                    aria-label={`${SYMPTOM_LABELS[key]} severity`}
                  />
                  <div className="flex gap-0.5" aria-hidden>
                    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setValues((s) => ({ ...s, [key]: n }))}
                        className={`h-6 w-6 rounded text-xs font-medium ${
                          v === n
                            ? "bg-[var(--color-brand)] text-white"
                            : "bg-[var(--color-line)]/60 text-[var(--color-muted)] hover:bg-[var(--color-line)]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Notes */}
        <label className="block">
          <span className="text-sm font-medium">Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything you want to remember about today — triggers, sleep, activities…"
            rows={3}
            className="mt-1.5 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
          />
        </label>

        {/* Summary + save */}
        <section className="sticky bottom-3 z-30 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Today's score</p>
              <p className="text-2xl font-bold">
                {score} <span className="text-sm font-normal text-[var(--color-muted)]">/ 132</span>
              </p>
              <p className="text-xs text-[var(--color-muted)]">{count} symptom(s) present</p>
            </div>
            <button
              onClick={save}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--color-brand-dark)]"
            >
              <Save size={16} /> {saved ? "Saved!" : existingId ? "Update check-in" : "Save check-in"}
            </button>
          </div>
          {score >= 60 && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-warn)]">
              <AlertTriangle size={14} /> High symptom load — consider extra rest today.
            </p>
          )}
          {saved && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-brand-dark)]">
              <Check size={14} /> Saved locally. Your data never left this device.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
