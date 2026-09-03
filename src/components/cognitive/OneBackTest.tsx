"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface OneBackResult {
  score: number;
  correct: number;
  total: number;
  averageReaction: number;
}

const TOTAL = 20;
const LETTERS = ["A", "C", "F", "H", "K", "M", "R", "T"];

function makeSequence() {
  const values: string[] = [];
  for (let index = 0; index < TOTAL; index++) {
    if (index > 0 && Math.random() < 0.35) values.push(values[index - 1]);
    else values.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  }
  return values;
}

export function OneBackTest({ onComplete }: { onComplete: (result: OneBackResult) => void }) {
  const sequence = useMemo(() => makeSequence(), []);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const reactions = useRef<number[]>([]);
  const shownAt = useRef(0);

  useEffect(() => {
    if (started) shownAt.current = performance.now();
  }, [index, started]);

  function answer(matches: boolean) {
    const expected = index > 0 && sequence[index] === sequence[index - 1];
    const nextCorrect = correct + Number(matches === expected);
    reactions.current.push(Math.round(performance.now() - shownAt.current));
    if (index === TOTAL - 1) {
      const averageReaction = Math.round(reactions.current.reduce((sum, value) => sum + value, 0) / reactions.current.length);
      setCorrect(nextCorrect);
      onComplete({ score: Math.round((nextCorrect / TOTAL) * 100), correct: nextCorrect, total: TOTAL, averageReaction });
      return;
    }
    setCorrect(nextCorrect);
    setIndex((value) => value + 1);
  }

  if (!started) {
    return (
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center">
        <p className="text-lg font-semibold">Does this letter match the one immediately before it?</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">The first answer is always “Different.” Work steadily rather than rushing.</p>
        <button type="button" onClick={() => setStarted(true)} className="mt-6 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 font-semibold text-white">Start 20 trials</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid min-h-52 place-items-center rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]">
        <span className="text-7xl font-bold" aria-live="polite">{sequence[index]}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => answer(false)} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 font-semibold hover:border-[var(--color-brand)]">Different</button>
        <button type="button" onClick={() => answer(true)} className="rounded-xl bg-[var(--color-brand)] px-4 py-4 font-semibold text-white">Same</button>
      </div>
      <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
        <span>{index + 1} of {TOTAL}</span>
        <span>{correct} correct</span>
      </div>
    </div>
  );
}
