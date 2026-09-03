"use client";

import { useEffect, useMemo, useState } from "react";

export interface DigitsResult {
  score: number;
  correct: number;
  total: number;
}

const LENGTHS = [3, 3, 4, 4, 5, 5, 6, 6];

function sequence(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function DigitsBackwardTest({ onComplete }: { onComplete: (result: DigitsResult) => void }) {
  const trials = useMemo(() => LENGTHS.map(sequence), []);
  const [trial, setTrial] = useState(0);
  const [visible, setVisible] = useState(true);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, [trial]);

  function submit() {
    const isCorrect = answer === trials[trial].split("").reverse().join("");
    const nextCorrect = correct + Number(isCorrect);
    if (trial === trials.length - 1) {
      setCorrect(nextCorrect);
      onComplete({ score: Math.round((nextCorrect / trials.length) * 100), correct: nextCorrect, total: trials.length });
      return;
    }
    setCorrect(nextCorrect);
    setVisible(true);
    setAnswer("");
    setTrial((value) => value + 1);
  }

  return (
    <div className="space-y-5">
      <div className="grid min-h-48 place-items-center rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-center">
        {visible ? (
          <p className="font-mono text-5xl font-bold tracking-[0.3em]" aria-live="polite">{trials[trial]}</p>
        ) : (
          <div className="w-full max-w-xs">
            <label htmlFor="digits-answer" className="block text-sm font-medium">Enter the digits in reverse order</label>
            <input
              id="digits-answer"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={LENGTHS[trial]}
              value={answer}
              onChange={(event) => setAnswer(event.target.value.replace(/\D/g, ""))}
              onKeyDown={(event) => event.key === "Enter" && answer.length === LENGTHS[trial] && submit()}
              className="mt-3 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-4 py-3 text-center font-mono text-2xl tracking-[0.25em] outline-none focus:border-[var(--color-brand)]"
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
        <span>Trial {trial + 1} of {trials.length}</span>
        <span>{correct} correct so far</span>
      </div>
      {!visible && (
        <button
          type="button"
          onClick={submit}
          disabled={answer.length !== LENGTHS[trial]}
          className="w-full rounded-lg bg-[var(--color-brand)] px-4 py-2.5 font-semibold text-white disabled:opacity-40"
        >
          Check answer
        </button>
      )}
    </div>
  );
}
