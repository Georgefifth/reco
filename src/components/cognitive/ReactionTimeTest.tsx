"use client";

import { useEffect, useRef, useState } from "react";

export interface ReactionResult {
  average: number;
  attempts: number[];
}

export function ReactionTimeTest({ onComplete }: { onComplete: (result: ReactionResult) => void }) {
  const [phase, setPhase] = useState<"intro" | "waiting" | "ready" | "result">("intro");
  const [attempts, setAttempts] = useState<number[]>([]);
  const [message, setMessage] = useState("Tap start, then wait for the field to turn green.");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef(0);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function begin() {
    setPhase("waiting");
    setMessage("Wait…");
    timer.current = setTimeout(() => {
      startedAt.current = performance.now();
      setPhase("ready");
      setMessage("Tap now");
    }, 1200 + Math.random() * 2200);
  }

  function tap() {
    if (phase === "intro" || phase === "result") {
      setAttempts([]);
      begin();
      return;
    }
    if (phase === "waiting") {
      if (timer.current) clearTimeout(timer.current);
      setMessage("Too soon. Breathe, then try again.");
      setPhase("intro");
      return;
    }
    const elapsed = Math.round(performance.now() - startedAt.current);
    const next = [...attempts, elapsed];
    setAttempts(next);
    if (next.length === 5) {
      const average = Math.round(next.reduce((sum, value) => sum + value, 0) / next.length);
      setPhase("result");
      setMessage(`Average: ${average} ms`);
      onComplete({ average, attempts: next });
    } else {
      setPhase("intro");
      setMessage(`${elapsed} ms · ${5 - next.length} trial${5 - next.length === 1 ? "" : "s"} left`);
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={tap}
        className={`grid min-h-64 w-full place-items-center rounded-2xl border-2 px-6 text-center transition-colors ${
          phase === "ready"
            ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
            : "border-[var(--color-line)] bg-[var(--color-surface)]"
        }`}
      >
        <span>
          <span className="block text-2xl font-bold">{message}</span>
          <span className="mt-2 block text-sm opacity-70">
            {phase === "intro" || phase === "result" ? "Tap to begin" : "Five trials total"}
          </span>
        </span>
      </button>
      <div className="flex justify-center gap-2" aria-label={`${attempts.length} of 5 trials complete`}>
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={`h-2 w-10 rounded-full ${index < attempts.length ? "bg-[var(--color-brand)]" : "bg-[var(--color-line)]"}`}
          />
        ))}
      </div>
    </div>
  );
}
