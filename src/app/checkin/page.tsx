"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronLeft, Save, Sparkles } from "lucide-react";
import { AppShell, useProfile } from "@/components/AppShell";
import { getAllCheckIns, getCheckInByDate, saveCheckIn, saveRedFlag } from "@/lib/db";
import { SYMPTOM_HELP, SYMPTOM_LABELS, detectRedFlagsFromCheckIn } from "@/lib/symptoms";
import { SYMPTOM_KEYS, type SymptomCheckIn, type SymptomKey } from "@/lib/types";
import { formatDate, todayISO, uid } from "@/lib/utils";

const GROUPS: Array<{ name: string; prompt: string; keys: SymptomKey[] }> = [
  { name: "Head & senses", prompt: "Notice pain, balance, vision, light, and sound.", keys: ["headache", "pressure", "neckPain", "balance", "dizziness", "vision", "photosensitivity", "noiseSensitivity"] },
  { name: "Thinking", prompt: "Notice how clear, quick, and familiar your thinking feels.", keys: ["sluggish", "foggy", "dontFeelRight", "difficultyConcentrating", "difficultyRemembering", "confusion"] },
  { name: "Energy & sleep", prompt: "Notice energy, alertness, and sleep changes.", keys: ["fatigue", "drowsy", "troubleFallingAsleep"] },
  { name: "Mood & body", prompt: "Notice emotional changes and unusual sensations.", keys: ["emotional", "irritable", "sad", "nervous", "numbTingling"] },
];

const STEPS = ["Context", ...GROUPS.map((group) => group.name), "Review"];

export default function CheckInPage() {
  const { profile } = useProfile();
  const [date, setDate] = useState(todayISO());
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Partial<Record<SymptomKey, number>>>({});
  const [notes, setNotes] = useState("");
  const [sleepHours, setSleepHours] = useState<number | undefined>();
  const [screenHours, setScreenHours] = useState<number | undefined>();
  const [activityMinutes, setActivityMinutes] = useState<number | undefined>();
  const [hydrationCups, setHydrationCups] = useState<number | undefined>();
  const [percentNormal, setPercentNormal] = useState(70);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [allCheckIns, setAllCheckIns] = useState<SymptomCheckIn[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) getAllCheckIns().then(setAllCheckIns);
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    getCheckInByDate(date).then((checkin) => {
      setValues(checkin?.symptoms ?? {});
      setNotes(checkin?.notes ?? "");
      setSleepHours(checkin?.sleepHours);
      setScreenHours(checkin?.screenHours);
      setActivityMinutes(checkin?.activityMinutes);
      setHydrationCups(checkin?.hydrationCups);
      setPercentNormal(checkin?.percentNormal ?? 70);
      setExistingId(checkin?.id ?? null);
      setSaved(false);
      setStep(0);
    });
  }, [date, profile]);

  const score = useMemo(() => SYMPTOM_KEYS.reduce((sum, key) => sum + (values[key] ?? 0), 0), [values]);
  const count = useMemo(() => SYMPTOM_KEYS.filter((key) => (values[key] ?? 0) > 0).length, [values]);
  const completedGroups = useMemo(() => GROUPS.filter((group) => group.keys.some((key) => values[key] !== undefined)).length, [values]);
  const chartData = useMemo(() => allCheckIns.map((checkin) => ({ label: formatDate(checkin.date).replace(/, \d{4}$/, ""), score: checkin.symptomScore })), [allCheckIns]);

  async function save() {
    if (!profile) return;
    const checkin: SymptomCheckIn = {
      id: existingId ?? uid(), date, createdAt: Date.now(), symptoms: Object.fromEntries(SYMPTOM_KEYS.map((key) => [key, values[key] ?? 0])),
      notes: notes.trim() || undefined, sleepHours, screenHours, activityMinutes, hydrationCups, percentNormal,
      symptomScore: score, symptomCount: count,
    };
    await saveCheckIn(checkin);
    const flags = detectRedFlagsFromCheckIn(checkin.symptoms);
    if (flags.length) await saveRedFlag({ id: uid(), createdAt: Date.now(), flags, acknowledged: false });
    setExistingId(checkin.id);
    setAllCheckIns(await getAllCheckIns());
    setSaved(true);
  }

  if (profile === undefined) return <AppShell><p className="py-12 text-center text-[var(--color-muted)]">Loading…</p></AppShell>;
  if (!profile) return <AppShell><div className="py-12 text-center"><p className="text-[var(--color-muted)]">Set up your profile first.</p><Link href="/onboarding" className="mt-3 inline-block text-[var(--color-brand-dark)] underline">Get started →</Link></div></AppShell>;

  const group = step > 0 && step <= GROUPS.length ? GROUPS[step - 1] : null;

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)]"><ArrowLeft size={14} /> Home</Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-brand-dark)]">Daily recovery snapshot</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-balance">How does today feel?</h1><p className="mt-1 text-sm text-[var(--color-muted)]">About 2 minutes. Pause if this becomes tiring.</p></div>
          {/* Date picker */}
            <label className="text-sm font-medium">Date<input name="checkin-date" type="date" value={date} max={todayISO()} onChange={(event) => setDate(event.target.value)} className="ml-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2" /></label>
          </div>
        </header>

        <nav aria-label="Check-in progress">
          <div className="flex gap-0.5">{STEPS.map((label, index) => <button key={label} type="button" onClick={() => setStep(index)} aria-label={`Go to ${label}`} aria-current={step === index ? "step" : undefined} className="flex-1 px-0.5 py-3"><span className={`block h-2 rounded-full transition-colors ${index <= step ? "bg-[var(--color-brand)]" : "bg-[var(--color-line)]"}`} /></button>)}</div>
          <div className="mt-2 flex justify-between text-xs text-[var(--color-muted)]"><span>{STEPS[step]}</span><span>{step + 1} of {STEPS.length}</span></div>
        </nav>

        {step === 0 && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"><h2 className="text-lg font-bold">A little context helps</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Optional estimates help ReCo spot patterns. Leave anything blank you do not know.</p><div className="mt-5 grid grid-cols-2 gap-4"><NumberField label="Sleep" unit="hours" value={sleepHours} onChange={setSleepHours} max={24} step={0.5} /><NumberField label="Screen time" unit="hours" value={screenHours} onChange={setScreenHours} max={24} step={0.5} /><NumberField label="Light activity" unit="minutes" value={activityMinutes} onChange={setActivityMinutes} max={600} /><NumberField label="Water" unit="cups" value={hydrationCups} onChange={setHydrationCups} max={30} /></div></div>
            <label className="block rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"><span className="flex justify-between gap-3 font-medium"><span>How close do you feel to your usual self?</span><strong className="tabular-nums text-[var(--color-brand-dark)]">{percentNormal}%</strong></span><input name="percent-normal" type="range" min={0} max={100} step={5} value={percentNormal} onChange={(event) => setPercentNormal(Number(event.target.value))} className="severity mt-5 w-full" /></label>
          </section>
        )}

        {/* Symptom list */}
        {group && (
          <section>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{group.name}</h2><p className="text-sm text-[var(--color-muted)]">{group.prompt}</p></div><button type="button" onClick={() => setValues((current) => ({ ...current, ...Object.fromEntries(group.keys.map((key) => [key, 0])) }))} className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium hover:border-[var(--color-brand)]">None in this group</button></div>
            <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]">{group.keys.map((key, index) => <SymptomRow key={key} symptomKey={key} value={values[key]} onChange={(value) => setValues((current) => ({ ...current, [key]: value }))} divided={index > 0} />)}</div>
          </section>
        )}

        {step === STEPS.length - 1 && (
          <section className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3"><SummaryStat value={score} label="Severity total · 132 max" /><SummaryStat value={count} label="Symptoms present · 22 max" /><SummaryStat value={`${percentNormal}%`} label="Feeling like usual" /></div>
            {completedGroups < GROUPS.length && <div role="alert" className="flex gap-2 rounded-xl bg-[var(--color-warn-soft)] p-4 text-sm text-[var(--color-warn)]"><AlertTriangle size={17} className="shrink-0" /> Some groups were not opened. Unanswered symptoms will be saved as “none.”</div>}
          {/* Notes */}
            <label className="block rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"><span className="font-medium">Anything worth remembering?</span><span className="mt-1 block text-sm text-[var(--color-muted)]">Triggers, rest breaks, school, activity, or what helped.</span><textarea name="checkin-notes" autoComplete="off" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Example: Headache increased after a video call…" rows={4} className="mt-3 w-full resize-y rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 focus:border-[var(--color-brand)]" /></label>
          {/* Summary + save */}
            <button type="button" onClick={save} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-3 font-semibold text-white hover:bg-[var(--color-brand-dark)]"><Save size={17} /> {existingId ? "Update Today’s Snapshot" : "Save Today’s Snapshot"}</button>
            <p aria-live="polite" className="min-h-5 text-center text-sm text-[var(--color-brand-dark)]">{saved ? <span className="inline-flex items-center gap-1"><Check size={15} /> Saved only on this device</span> : null}</p>
          </section>
        )}

        {/* Trend chart */}
        {step === 0 && chartData.length >= 2 && <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"><h2 className="font-semibold">Recent symptom direction</h2><div className="mt-4 h-44"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" /><XAxis dataKey="label" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="score" stroke="var(--color-brand)" fill="var(--color-brand-soft)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></section>}

        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3"><div className="mx-auto flex items-center justify-between gap-3"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 font-medium disabled:opacity-0"><ChevronLeft size={17} /> Back</button><span className="hidden text-xs text-[var(--color-muted)] sm:block">{score > 0 ? `${count} symptoms marked` : "No symptoms marked yet"}</span>{step < STEPS.length - 1 ? <button type="button" onClick={() => setStep((current) => current + 1)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 font-semibold text-white">{step === 0 ? "Start symptoms" : "Next group"} <ArrowRight size={16} /></button> : <button type="button" onClick={() => setStep(0)} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line)] px-4 py-2 font-medium"><Sparkles size={16} /> Review context</button>}</div></div>
      </div>
    </AppShell>
  );
}

function NumberField({ label, unit, value, onChange, max, step = 1 }: { label: string; unit: string; value: number | undefined; onChange: (value: number | undefined) => void; max: number; step?: number }) { return <label className="block"><span className="text-sm font-medium">{label}</span><span className="mt-1 flex items-center rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] focus-within:border-[var(--color-brand)]"><input name={label.toLowerCase().replace(" ", "-")} type="number" inputMode="decimal" min={0} max={max} step={step} value={value ?? ""} onChange={(event) => onChange(event.target.value === "" ? undefined : Number(event.target.value))} placeholder="—" className="min-w-0 flex-1 bg-transparent px-3 py-2 tabular-nums" /><span className="pr-3 text-xs text-[var(--color-muted)]">{unit}</span></span></label>; }

function SymptomRow({ symptomKey, value, onChange, divided }: { symptomKey: SymptomKey; value: number | undefined; onChange: (value: number) => void; divided: boolean }) { const labelId = `symptom-${symptomKey}`; return <div role="group" aria-labelledby={labelId} className={`scroll-mb-24 p-4 sm:grid sm:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.25fr)] sm:items-center sm:gap-5 ${divided ? "border-t border-[var(--color-line)]" : ""}`}><div className="flex items-start justify-between gap-3"><div><p id={labelId} className="font-medium">{SYMPTOM_LABELS[symptomKey]}</p>{SYMPTOM_HELP[symptomKey] && <p className="mt-0.5 text-xs text-[var(--color-muted)]">{SYMPTOM_HELP[symptomKey]}</p>}</div><span className="shrink-0 font-mono text-xs text-[var(--color-muted)] sm:hidden">{value === undefined ? "Not marked" : value === 0 ? "None" : value <= 2 ? "Mild" : value <= 4 ? "Moderate" : "Severe"}</span></div><div className="mt-3 sm:mt-0"><div className="grid grid-cols-7 gap-1.5">{[0, 1, 2, 3, 4, 5, 6].map((severity) => <button key={severity} type="button" onClick={() => onChange(severity)} aria-label={`${SYMPTOM_LABELS[symptomKey]}: ${severity} of 6`} aria-pressed={value === severity} className={`min-h-11 rounded-lg text-sm font-semibold tabular-nums ${value === severity ? "bg-[var(--color-brand)] text-white" : "bg-[var(--color-bg)] text-[var(--color-muted)] hover:bg-[var(--color-brand-soft)]"}`}>{severity}</button>)}</div><div className="mt-1 flex justify-between text-[10px] text-[var(--color-muted)]"><span>None</span><span className="font-mono">{value === undefined ? "Not marked" : value === 0 ? "None" : value <= 2 ? "Mild" : value <= 4 ? "Moderate" : "Severe"}</span><span>Severe</span></div></div></div>; }

function SummaryStat({ value, label }: { value: number | string; label: string }) { return <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4"><p className="text-3xl font-bold tabular-nums">{value}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{label}</p></div>; }
