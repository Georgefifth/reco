"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Download,
  Trash2,
  Cpu,
  Database,
  Lock,
  Eye,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { exportAllData, wipeAllData, getAllCheckIns, getAllJournal } from "@/lib/db";
import { isOllamaRunning } from "@/lib/ollama";

export default function PrivacyPage() {
  const [checkinCount, setCheckinCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [ollamaUp, setOllamaUp] = useState<boolean | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [wiped, setWiped] = useState(false);

  useEffect(() => {
    Promise.all([getAllCheckIns(), getAllJournal(), isOllamaRunning()]).then(
      ([c, j, up]) => {
        setCheckinCount(c.length);
        setJournalCount(j.length);
        setOllamaUp(up);
      },
    );
  }, []);

  async function handleExport() {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reco-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleWipe() {
    await wipeAllData();
    setWiped(true);
    setConfirmWipe(false);
    setCheckinCount(0);
    setJournalCount(0);
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
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Shield size={22} className="text-[var(--color-brand)]" /> Privacy center
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            ReCo was built privacy-first. Here's exactly what happens to your data.
          </p>
        </div>

        {/* Privacy principles */}
        <section className="rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-5">
          <h2 className="flex items-center gap-2 font-semibold text-[var(--color-brand-dark)]">
            <ShieldCheck size={18} /> Our privacy commitments
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            <Principle
              icon={Database}
              title="Your data lives in your browser"
              body="All check-ins, journal entries, and protocol logs are stored in IndexedDB on this device. There is no backend database. Nothing is uploaded to any server."
            />
            <Principle
              icon={Cpu}
              title="AI inference runs locally"
              body="When you journal, ReCo calls Ollama running on your machine (localhost:11434). Your journal text never travels over the network. If Ollama isn't running, your entries are still saved locally without an AI reply."
            />
            <Principle
              icon={Lock}
              title="No accounts, no tracking"
              body="ReCo has no login, no analytics, no cookies, no third-party scripts. We don't know who you are or that you exist."
            />
            <Principle
              icon={Eye}
              title="Full transparency"
              body="You can export everything ReCo knows about you as a JSON file at any time. You can delete it all with one click. No remnants remain."
            />
          </ul>
        </section>

        {/* Data inventory */}
        <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            What's stored on this device
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <DataStat label="Symptom check-ins" value={checkinCount} />
            <DataStat label="Journal entries" value={journalCount} />
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--color-brand-soft)] p-3 text-sm">
            <Cpu size={16} className="text-[var(--color-brand)]" />
            <span>
              Local AI status:{" "}
              {ollamaUp === null
                ? "checking…"
                : ollamaUp
                  ? <strong className="text-[var(--color-brand-dark)]">Connected (Ollama running)</strong>
                  : <strong className="text-[var(--color-muted)]">Not running — entries saved without AI reply</strong>}
            </span>
          </div>
        </section>

        {/* Actions */}
        <section className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-left transition-all hover:border-[var(--color-brand)]/40 hover:shadow-sm"
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
              <Download size={18} />
            </span>
            <span>
              <span className="block font-semibold">Export my data</span>
              <span className="block text-sm text-[var(--color-muted)]">
                Download a JSON file with everything
              </span>
            </span>
          </button>

          {!confirmWipe ? (
            <button
              onClick={() => setConfirmWipe(true)}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-left transition-all hover:border-[var(--color-danger)]/40"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-danger-soft)] text-[var(--color-danger)]">
                <Trash2 size={18} />
              </span>
              <span>
                <span className="block font-semibold text-[var(--color-danger)]">Delete all data</span>
                <span className="block text-sm text-[var(--color-muted)]">
                  Permanently erase everything on this device
                </span>
              </span>
            </button>
          ) : (
            <div className="rounded-xl border border-[var(--color-danger)]/40 bg-[var(--color-danger-soft)] p-4">
              <p className="flex items-center gap-2 font-semibold text-[var(--color-danger)]">
                <AlertTriangle size={16} /> Are you sure?
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink)]">
                This permanently deletes all check-ins, journal entries, and protocol history. This
                cannot be undone.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleWipe}
                  className="rounded-lg bg-[var(--color-danger)] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Yes, delete everything
                </button>
                <button
                  onClick={() => setConfirmWipe(false)}
                  className="rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {wiped && (
          <p className="rounded-lg bg-[var(--color-brand-soft)] p-3 text-sm text-[var(--color-brand-dark)]">
            ✓ All data deleted. <Link href="/onboarding" className="underline">Set up again →</Link>
          </p>
        )}

        {/* Privacy policy */}
        <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            <FileText size={14} /> Plain-language privacy policy
          </h2>
          <div className="mt-3 space-y-3 text-sm text-[var(--color-ink)]">
            <p>
              <strong>What we collect:</strong> Nothing. ReCo has no server. The only data is what
              you enter, stored locally in your browser's IndexedDB.
            </p>
            <p>
              <strong>What we send anywhere:</strong> Nothing, with one exception — when you journal
              and a local Ollama instance is running, your journal text is sent to{" "}
              <code className="rounded bg-[var(--color-line)] px-1">localhost:11434</code> on your own
              machine. It does not leave your device.
            </p>
            <p>
              <strong>Third parties:</strong> None. No analytics, no ads, no telemetry, no CDN-tracked
              fonts (Geist is self-hosted by Next.js).
            </p>
            <p>
              <strong>Your rights:</strong> Export your data anytime. Delete it anytime. No account to
              close because there is no account.
            </p>
            <p>
              <strong>Responsible AI note:</strong> ReCo's AI is a supportive companion, not a
              diagnostic tool. It will not diagnose, prescribe, or replace a clinician. It is
              instructed to direct users to emergency services (911) when red-flag symptoms appear.
              All AI inference runs on hardware you control.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Principle({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--color-surface)] text-[var(--color-brand-dark)]">
        <Icon size={14} />
      </span>
      <div>
        <p className="font-semibold text-[var(--color-brand-dark)]">{title}</p>
        <p className="text-[var(--color-ink)]">{body}</p>
      </div>
    </li>
  );
}

function DataStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--color-line)] p-3">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
