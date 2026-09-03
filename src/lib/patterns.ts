import type { SymptomCheckIn } from "./types";

export interface PatternInsight {
  title: string;
  detail: string;
  confidence: string;
}

const FACTORS = [
  { key: "sleepHours", label: "sleep", unit: "hours", direction: "lower" },
  { key: "activityMinutes", label: "light activity", unit: "minutes", direction: "higher" },
  { key: "screenHours", label: "screen time", unit: "hours", direction: "higher" },
] as const;

export function findPatterns(checkins: SymptomCheckIn[]): PatternInsight[] {
  if (checkins.length < 3) return [];
  return FACTORS.flatMap((factor) => {
    const points = checkins
      .filter((item) => typeof item[factor.key] === "number")
      .map((item) => ({ factor: item[factor.key] as number, symptoms: item.symptomScore }));
    if (points.length < 3) return [];
    const correlation = pearson(points.map((point) => point.factor), points.map((point) => point.symptoms));
    if (Math.abs(correlation) < 0.45) return [];
    const relationship = correlation > 0 ? "rose" : "fell";
    return [{
      title: `${factor.label[0].toUpperCase()}${factor.label.slice(1)} may track with symptoms`,
      detail: `Across ${points.length} snapshots, symptom scores generally ${relationship} as ${factor.label} increased. This is a pattern to discuss, not proof of cause.`,
      confidence: Math.abs(correlation) >= 0.75 ? "strong local pattern" : "possible local pattern",
    }];
  }).slice(0, 2);
}

function pearson(xs: number[], ys: number[]) {
  const xMean = xs.reduce((sum, value) => sum + value, 0) / xs.length;
  const yMean = ys.reduce((sum, value) => sum + value, 0) / ys.length;
  const numerator = xs.reduce((sum, value, index) => sum + (value - xMean) * (ys[index] - yMean), 0);
  const xVariance = xs.reduce((sum, value) => sum + (value - xMean) ** 2, 0);
  const yVariance = ys.reduce((sum, value) => sum + (value - yMean) ** 2, 0);
  const denominator = Math.sqrt(xVariance * yVariance);
  return denominator ? numerator / denominator : 0;
}
