"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookHeart,
  Send,
  Cpu,
  Unplug,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { AppShell, useProfile } from "@/components/AppShell";
import { getAllCheckIns, getAllJournal, saveJournal, deleteJournal } from "@/lib/db";
import {
  isOllamaRunning,
  listOllamaModels,
  journalConversation,
} from "@/lib/ollama";
import type { JournalEntry, SymptomCheckIn } from "@/lib/types";
import { uid, relativeTime, formatDate } from "@/lib/utils";

export default function JournalPage() {
  const { profile } = useProfile();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [ollamaUp, setOllamaUp] = useState<boolean | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState<string>("");
  const [recentCheckins, setRecentCheckins] = useState<SymptomCheckIn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isOllamaRunning().then(setOllamaUp);
    listOllamaModels().then((m) => {
      setModels(m);
      if (m.length && !model) setModel(m[0]);
    });
  }, []);

  useEffect(() => {
    if (profile === undefined) return;
    if (!profile) return;
    Promise.all([getAllJournal(), getAllCheckIns()]).then(([j, c]) => {
      setEntries(j);
      setRecentCheckins(c.slice(-5));
    });
  }, [profile]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, streaming]);

  async function send() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setError(null);
    setStreaming("");
    const userText = text.trim();
    setText("");

    const context = recentCheckins.length
      ? recentCheckins
          .map(
            (c) =>
              `${formatDate(c.date)}: symptom score ${c.symptomScore}/132, ${c.symptomCount} symptoms present${c.notes ? ` — notes: ${c.notes}` : ""}`,
          )
          .join("\n")
      : "";

    let aiResponse = "";
    try {
      if (ollamaUp && model) {
        aiResponse = await journalConversation(userText, context, model, (chunk) => {
          setStreaming((s) => s + chunk);
        });
      } else {
        aiResponse =
          "I'm not connected to a local AI right now. To enable AI journaling, install Ollama (ollama.com) and run a model like `ollama run qwen2.5:7b`. Your entry is still saved privately on your device.";
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI conversation failed");
      aiResponse = "Sorry — I couldn't reach the local AI. Your entry is still saved.";
    } finally {
      setStreaming("");
    }

    const entry: JournalEntry = {
      id: uid(),
      createdAt: Date.now(),
      userText,
      aiResponse,
    };
    await saveJournal(entry);
    setEntries((e) => [entry, ...e]);
    setBusy(false);
  }

  async function removeEntry(id: string) {
    await deleteJournal(id);
    setEntries((e) => e.filter((x) => x.id !== id));
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
      <div className="flex h-[calc(100vh-180px)] min-h-[500px] flex-col">
        <div className="mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight">
            <BookHeart size={22} className="text-[var(--color-brand)]" /> Journal
          </h1>
        </div>

        {/* AI status */}
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-2.5 text-sm">
          {ollamaUp ? (
            <span className="inline-flex items-center gap-1.5 text-[var(--color-brand-dark)]">
              <Cpu size={14} /> Local AI connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[var(--color-muted)]">
              <Unplug size={14} /> No local AI — entries saved without AI reply
            </span>
          )}
          {models.length > 0 && (
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="ml-auto rounded border border-[var(--color-line)] bg-[var(--color-surface)] px-2 py-1 text-xs outline-none focus:border-[var(--color-brand)]"
              aria-label="Choose local AI model"
            >
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
          {entries.length === 0 && !streaming && (
            <div className="rounded-xl border border-dashed border-[var(--color-line)] p-6 text-center text-sm text-[var(--color-muted)]">
              Write about your day — how you're feeling, what's hard, what helped. ReCo will respond
              with empathy and gentle guidance. Everything stays on your device.
            </div>
          )}
          {entries
            .slice()
            .reverse()
            .map((e) => (
              <div key={e.id} className="space-y-2">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--color-brand)] px-4 py-2.5 text-white">
                  <p className="whitespace-pre-wrap text-sm">{e.userText}</p>
                  <p className="mt-1 text-right text-[10px] opacity-70">{relativeTime(e.createdAt)}</p>
                </div>
                {e.aiResponse && (
                  <div className="group mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5">
                    <p className="whitespace-pre-wrap text-sm">{e.aiResponse}</p>
                    <button
                      onClick={() => removeEntry(e.id)}
                      className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[var(--color-muted)] opacity-0 transition-opacity hover:text-[var(--color-danger)] group-hover:opacity-100"
                      aria-label="Delete entry"
                    >
                      <Trash2 size={10} /> delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          {streaming && (
            <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5">
              <p className="whitespace-pre-wrap text-sm">
                {streaming}
                <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[var(--color-brand)] align-middle" />
              </p>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="mt-3">
          {error && (
            <p className="mb-2 flex items-center gap-1.5 text-xs text-[var(--color-danger)]">
              <AlertCircle size={12} /> {error}
            </p>
          )}
          <div className="flex items-end gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="How are you feeling today?"
              rows={2}
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
              aria-label="Journal entry"
            />
            <button
              onClick={send}
              disabled={busy || !text.trim()}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)] text-white transition-colors hover:bg-[var(--color-brand-dark)] disabled:opacity-50"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-[var(--color-muted)]">
            ⌘/Ctrl + Enter to send · AI runs locally via Ollama · data never leaves your device
          </p>
        </div>
      </div>
    </AppShell>
  );
}
