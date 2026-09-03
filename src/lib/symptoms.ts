import type { SymptomKey } from "./types";

// SCAT-5 22-item symptom checklist labels
export const SYMPTOM_LABELS: Record<SymptomKey, string> = {
  headache: "Headache",
  pressure: "“Pressure in head”",
  neckPain: "Neck pain",
  balance: "Balance problems",
  dizziness: "Dizziness",
  vision: "Vision problems (blurry, double)",
  photosensitivity: "Sensitivity to light",
  noiseSensitivity: "Sensitivity to noise",
  sluggish: "Feeling slowed down",
  foggy: "Feeling “in a fog”",
  dontFeelRight: "“Don’t feel right”",
  difficultyConcentrating: "Difficulty concentrating",
  difficultyRemembering: "Difficulty remembering",
  fatigue: "Fatigue / low energy",
  confusion: "Confusion",
  drowsy: "Drowsiness",
  troubleFallingAsleep: "Trouble falling asleep",
  emotional: "More emotional",
  irritable: "Irritability",
  sad: "Sadness",
  nervous: "Nervousness / anxiety",
  numbTingling: "Numbness or tingling",
};

export const SYMPTOM_HELP: Partial<Record<SymptomKey, string>> = {
  headache: "Rate 0 (none) to 6 (severe). Worsening headaches are a key recovery signal.",
  foggy: "Cognitive fog is common post-concussion; track daily to see recovery curve.",
  photosensitivity: "Light sensitivity often improves with gradual, controlled exposure.",
};

// Return-to-Play / Return-to-Learn protocol (Berlin 2016 consensus + CDC HEADS UP)
// Each stage requires ~24h symptom-free before advancing.
export interface RTPStage {
  stage: number;
  name: string;
  description: string;
  activities: string;
  goal: string;
  minDays: number;
}

export const RTP_STAGES: RTPStage[] = [
  {
    stage: 0,
    name: "Rest & Recovery",
    description:
      "Complete physical and cognitive rest. Limit screen time, reading, and bright environments.",
    activities:
      "Sleep, gentle walks around the house, limited cognitive load. No school/work if possible (1–2 days).",
    goal: "Recovery to baseline symptoms at rest",
    minDays: 1,
  },
  {
    stage: 1,
    name: "Symptom-Limited Activity",
    description:
      "Very light activities of daily living. Stop any activity that worsens symptoms.",
    activities:
      "Short walks (5–15 min), light stretching. No resistance training. Limited screen time.",
    goal: "Tolerate light daily activity without symptom flare",
    minDays: 1,
  },
  {
    stage: 2,
    name: "Light Aerobic Exercise",
    description:
      "Light cardio at <55% max heart rate. Walking or stationary bike, 10–15 min.",
    activities:
      "Walking, stationary bike. No head impact. No resistance training. Stop if symptoms worsen.",
    goal: "Increased heart rate without symptom return",
    minDays: 1,
  },
  {
    stage: 3,
    name: "Sport-Specific Exercise",
    description: "Sport-specific movement at moderate intensity. No head-impact activities.",
    activities:
      "Running drills, skating, swimming (no dives). HR < 80% max. No contact or scrimmages.",
    goal: "Add movement without head-impact risk",
    minDays: 1,
  },
  {
    stage: 4,
    name: "Non-Contact Training Drills",
    description:
      "More complex training drills. Resistance training may begin. No contact.",
    activities:
      "Passing drills, non-contact plays, weight training. Full practice minus contact.",
    goal: "Exercise tolerance, cognitive load, no contact",
    minDays: 1,
  },
  {
    stage: 5,
    name: "Full-Contact Practice",
    description:
      "Full practice with contact. Only after medical clearance. Monitor closely.",
    activities:
      "Normal practice activities. Requires clinician clearance before this stage.",
    goal: "Restore confidence, assess functional skills",
    minDays: 1,
  },
  {
    stage: 6,
    name: "Return to Play",
    description: "Full return to competition. Continue monitoring symptoms for 7–10 days.",
    activities: "Normal game play. Track any symptom recurrence.",
    goal: "Full recovery",
    minDays: 0,
  },
];

// Red flag symptoms requiring emergency care (CDC HEADS UP)
export const RED_FLAGS: { key: string; label: string; detail: string }[] = [
  {
    key: "worsening_headache",
    label: "One pupil larger than the other",
    detail: "Asymmetric pupils can indicate rising intracranial pressure.",
  },
  {
    key: "drowsy_unarousable",
    label: "Drowsy or cannot be awakened",
    detail: "Cannot be roused — seek emergency care immediately.",
  },
  {
    key: "worsening_headache2",
    label: "A headache that gets worse and does not go away",
    detail: "Progressive headache is a warning sign of intracranial bleeding.",
  },
  {
    key: "weakness_numbness",
    label: "Weakness, numbness, or decreased coordination",
    detail: "Focal neurological deficits require emergency evaluation.",
  },
  {
    key: "repeated_vomiting",
    label: "Repeated vomiting or nausea",
    detail: "Persistent vomiting suggests raised intracranial pressure.",
  },
  {
    key: "slurred_speech",
    label: "Slurred speech",
    detail: "Speech changes can indicate serious brain injury.",
  },
  {
    key: "seizure",
    label: "Seizures or convulsions",
    detail: "Post-traumatic seizure requires emergency care.",
  },
  {
    key: "unusual_behavior",
    label: "Unusual behavior, confusion, or restlessness",
    detail: "Worsening cognition or behavior change is a red flag.",
  },
  {
    key: "loss_consciousness",
    label: "Loss of consciousness (even brief)",
    detail: "Any LOC after head injury warrants emergency evaluation.",
  },
];

// Triggers a red-flag warning if any of these symptom patterns appear in a check-in
export function detectRedFlagsFromCheckIn(symptoms: Partial<Record<SymptomKey, number>>): string[] {
  const flags: string[] = [];
  // Severe headache (6) plus confusion or vomiting-like symptoms
  if ((symptoms.headache ?? 0) >= 6) flags.push("Severe headache (6/6) — monitor for worsening");
  if ((symptoms.confusion ?? 0) >= 5)
    flags.push("High confusion score — consider emergency evaluation");
  return flags;
}
