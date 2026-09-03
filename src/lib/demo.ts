"use client";

import { saveAssessment, saveCheckIn, saveJournal, saveProfile, saveProtocolLog } from "./db";
import { SYMPTOM_KEYS, type SymptomCheckIn, type SymptomKey, type UserProfile } from "./types";
import { uid } from "./utils";

const DAY = 86400000;

export async function seedDemoData(): Promise<UserProfile> {
  const now = Date.now();
  const injuryDate = dateISO(now - 9 * DAY);
  const profile: UserProfile = {
    id: "profile",
    createdAt: now - 9 * DAY,
    nickname: "Maya",
    injuryDate,
    injuryContext: "sport",
    injuryDescription: "Head impact during a soccer match; evaluated by a clinician the same day.",
    currentStage: 2,
    stageStartedAt: now - 2 * DAY,
    currentRTLStage: 2,
    rtlStageStartedAt: now - 3 * DAY,
    age: 19,
    sport: "Soccer",
    isDemo: true,
  };

  const snapshots = [
    [8, { headache: 5, dizziness: 4, photosensitivity: 4, foggy: 5, difficultyConcentrating: 4, fatigue: 5, nervous: 3 }, 5.5, 0.5, 5, 42],
    [7, { headache: 5, dizziness: 3, photosensitivity: 4, foggy: 4, difficultyConcentrating: 4, fatigue: 5, nervous: 2 }, 6, 1, 8, 48],
    [6, { headache: 4, dizziness: 3, photosensitivity: 3, foggy: 4, difficultyConcentrating: 3, fatigue: 4, nervous: 2 }, 7, 1.5, 10, 55],
    [5, { headache: 4, dizziness: 2, photosensitivity: 3, foggy: 3, difficultyConcentrating: 3, fatigue: 4, nervous: 2 }, 7.5, 2, 12, 60],
    [4, { headache: 3, dizziness: 2, photosensitivity: 2, foggy: 3, difficultyConcentrating: 2, fatigue: 3, nervous: 1 }, 8, 2.5, 15, 66],
    [3, { headache: 3, dizziness: 1, photosensitivity: 2, foggy: 2, difficultyConcentrating: 2, fatigue: 3, nervous: 1 }, 8, 3, 20, 72],
    [2, { headache: 2, dizziness: 1, photosensitivity: 1, foggy: 2, difficultyConcentrating: 1, fatigue: 2, nervous: 1 }, 8.5, 3.5, 25, 78],
    [1, { headache: 2, dizziness: 0, photosensitivity: 1, foggy: 1, difficultyConcentrating: 1, fatigue: 2, nervous: 0 }, 8, 4, 30, 82],
    [0, { headache: 1, dizziness: 0, photosensitivity: 1, foggy: 1, difficultyConcentrating: 1, fatigue: 1, nervous: 0 }, 8.5, 4.5, 35, 88],
  ] as const;

  const checkins = snapshots.map(([daysAgo, symptoms, sleepHours, screenHours, activityMinutes, percentNormal]) => makeCheckIn(now, daysAgo, symptoms, sleepHours, screenHours, activityMinutes, percentNormal));

  await saveProfile(profile);
  await Promise.all([
    ...checkins.map(saveCheckIn),
    saveProtocolLog({ id: uid(), stage: 0, action: "started", createdAt: now - 9 * DAY, note: "Recovery started" }),
    saveProtocolLog({ id: uid(), stage: 1, action: "advanced", createdAt: now - 5 * DAY, note: "Advanced after clinician follow-up" }),
    saveProtocolLog({ id: uid(), stage: 2, action: "advanced", createdAt: now - 2 * DAY, note: "Light aerobic activity started" }),
    saveAssessment({ id: uid(), type: "reaction", createdAt: now - 6 * DAY, score: 62, accuracy: 100, reactionTime: 372, details: { trials: 5, fastest: 331 } }),
    saveAssessment({ id: uid(), type: "reaction", createdAt: now - DAY, score: 77, accuracy: 100, reactionTime: 296, details: { trials: 5, fastest: 271 } }),
    saveAssessment({ id: uid(), type: "oneBack", createdAt: now - 5 * DAY, score: 70, accuracy: 70, reactionTime: 811, details: { correct: 14, total: 20 } }),
    saveAssessment({ id: uid(), type: "oneBack", createdAt: now - DAY, score: 85, accuracy: 85, reactionTime: 694, details: { correct: 17, total: 20 } }),
    saveJournal({ id: uid(), createdAt: now - 3 * DAY, userText: "I managed a short class today, but the projector made my headache worse.", aiResponse: "That sounds like useful information, not a setback. A shorter exposure and lower brightness may help you stay connected to class without pushing through a lasting symptom flare." }),
  ]);
  return profile;
}

function makeCheckIn(now: number, daysAgo: number, overrides: Partial<Record<SymptomKey, number>>, sleepHours: number, screenHours: number, activityMinutes: number, percentNormal: number): SymptomCheckIn {
  const symptoms = Object.fromEntries(SYMPTOM_KEYS.map((key) => [key, overrides[key] ?? 0]));
  const values = Object.values(symptoms);
  return {
    id: `demo-${daysAgo}`,
    date: dateISO(now - daysAgo * DAY),
    createdAt: now - daysAgo * DAY,
    symptoms,
    sleepHours,
    screenHours,
    activityMinutes,
    hydrationCups: 7,
    percentNormal,
    symptomScore: values.reduce((sum, value) => sum + value, 0),
    symptomCount: values.filter((value) => value > 0).length,
  };
}

function dateISO(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}
