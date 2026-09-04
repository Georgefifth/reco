"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Brain, Play } from "lucide-react";
import { AppShell, useProfile } from "@/components/AppShell";
import { saveProfile, saveProtocolLog } from "@/lib/db";
import { seedDemoData } from "@/lib/demo";
import type { UserProfile, InjuryContext, ProtocolStageLog } from "@/lib/types";
import { uid, todayISO } from "@/lib/utils";

const CONTEXTS: { value: InjuryContext; label: string }[] = [
  { value: "sport", label: "Sport / athletic activity" },
  { value: "accident", label: "Vehicle or bike accident" },
  { value: "fall", label: "Fall" },
  { value: "work", label: "Workplace injury" },
  { value: "other", label: "Other" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [injuryDate, setInjuryDate] = useState(todayISO());
  const [injuryContext, setInjuryContext] = useState<InjuryContext>("sport");
  const [sport, setSport] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function loadDemo() {
    setDemoLoading(true);
    const demoProfile = await seedDemoData();
    setProfile(demoProfile);
    router.push("/");
  }

  async function finish() {
    setSaving(true);
    const now = Date.now();
    const profile: UserProfile = {
      id: "profile",
      createdAt: now,
      nickname: nickname.trim() || "friend",
      injuryDate,
      injuryContext,
      injuryDescription: description.trim() || undefined,
      currentStage: 0,
      stageStartedAt: now,
      sport: sport.trim() || undefined,
    };
    await saveProfile(profile);
    const log: ProtocolStageLog = {
      id: uid(),
      stage: 0,
      action: "started",
      createdAt: now,
      note: "Recovery started",
    };
    await saveProtocolLog(log);
    router.push("/");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md py-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-brand)] text-white">
            <Brain size={18} />
          </span>
          <span className="text-lg font-semibold">ReCo setup</span>
        </div>

        <div className="mb-6 flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-[var(--color-brand)]" : "bg-[var(--color-line)]"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <section className="space-y-4">
            <div>
              <h1 className="text-xl font-bold">Let’s get you set up</h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                ReCo is a private companion for your concussion recovery. Everything stays on your
                device — no account, no servers, no tracking.
              </p>
            </div>
            <label className="block">
              <span className="text-sm font-medium">What should I call you?</span>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="A nickname (optional)"
                className="mt-1.5 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)]"
                maxLength={40}
              />
            </label>
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 font-semibold text-white hover:bg-[var(--color-brand-dark)]"
            >
              Continue <ArrowRight size={16} />
            </button>
            <div className="pt-2">
              <div className="rounded-lg border border-dashed border-[var(--color-accent)]/40 bg-[var(--color-surface)] p-3">
                <p className="text-xs text-[var(--color-muted)]">
                  Just looking around? Load a sample recovery to explore ReCo without entering anything.
                </p>
                <button
                  type="button"
                  onClick={loadDemo}
                  disabled={demoLoading}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold transition-colors hover:border-[var(--color-accent)] disabled:opacity-50"
                >
                  <Play size={14} /> {demoLoading ? "Loading Maya…" : "Explore Maya's demo"}
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-4">
            <div>
              <h1 className="text-xl font-bold">About your injury</h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                This helps ReCo personalize your recovery timeline.
              </p>
            </div>
            <label className="block">
              <span className="text-sm font-medium">When did the injury happen?</span>
              <input
                type="date"
                value={injuryDate}
                max={todayISO()}
                onChange={(e) => setInjuryDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)]"
              />
            </label>
            <fieldset className="block">
              <legend className="text-sm font-medium">How did it happen?</legend>
              <div className="mt-2 grid gap-2">
                {CONTEXTS.map((c) => (
                  <label
                    key={c.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      injuryContext === c.value
                        ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                        : "border-[var(--color-line)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="context"
                      value={c.value}
                      checked={injuryContext === c.value}
                      onChange={() => setInjuryContext(c.value)}
                      className="accent-[var(--color-brand)]"
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </fieldset>
            {injuryContext === "sport" && (
              <label className="block">
                <span className="text-sm font-medium">Which sport?</span>
                <input
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  placeholder="e.g. soccer, hockey, basketball"
                  className="mt-1.5 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
                />
              </label>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="rounded-lg border border-[var(--color-line)] px-4 py-2 font-medium hover:bg-[var(--color-brand-soft)]/50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 font-semibold text-white hover:bg-[var(--color-brand-dark)]"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <div>
              <h1 className="text-xl font-bold">Anything else?</h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Optional — describe what happened and how you’re feeling. This stays on your device.
              </p>
            </div>
            <label className="block">
              <span className="text-sm font-medium">Notes (optional)</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Hit my head during practice, felt dizzy afterwards…"
                rows={4}
                className="mt-1.5 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
              />
            </label>
            <div className="rounded-lg bg-[var(--color-brand-soft)] p-3 text-sm text-[var(--color-brand-dark)]">
              <strong>What happens next:</strong> ReCo starts you at Stage 0 (Rest & Recovery) of
              the international-consensus return-to-sport protocol. You’ll log daily symptoms and advance
              when you’ve been symptom-free at the current stage.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg border border-[var(--color-line)] px-4 py-2 font-medium hover:bg-[var(--color-brand-soft)]/50"
              >
                Back
              </button>
              <button
                disabled={saving}
                onClick={finish}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 font-semibold text-white hover:bg-[var(--color-brand-dark)] disabled:opacity-60"
              >
                {saving ? "Setting up…" : "Start recovery"} <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
