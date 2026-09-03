// Core data types for ReCo

export type InjuryContext =
  | "sport"
  | "accident"
  | "fall"
  | "work"
  | "other";

export interface UserProfile {
  id: "profile"; // singleton
  createdAt: number;
  nickname: string;
  injuryDate: string; // ISO date
  injuryContext: InjuryContext;
  injuryDescription?: string;
  currentStage: number; // RTP stage 0-6
  stageStartedAt: number;
  currentRTLStage?: number;
  rtlStageStartedAt?: number;
  // optional
  age?: number;
  sport?: string;
  isDemo?: boolean;
}

// SCAT-5 style 22-item symptom checklist
export const SYMPTOM_KEYS = [
  "headache",
  "pressure",
  "neckPain",
  "balance",
  "dizziness",
  "vision",
  "photosensitivity",
  "noiseSensitivity",
  "sluggish",
  "foggy",
  "dontFeelRight",
  "difficultyConcentrating",
  "difficultyRemembering",
  "fatigue",
  "confusion",
  "drowsy",
  "troubleFallingAsleep",
  "emotional",
  "irritable",
  "sad",
  "nervous",
  "numbTingling",
] as const;

export type SymptomKey = (typeof SYMPTOM_KEYS)[number];

export interface SymptomCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
  symptoms: Partial<Record<SymptomKey, number>>; // 0-6 severity
  notes?: string;
  sleepHours?: number;
  screenHours?: number;
  activityMinutes?: number;
  hydrationCups?: number;
  percentNormal?: number;
  symptomScore: number; // sum
  symptomCount: number; // count of >0
}

export interface JournalEntry {
  id: string;
  createdAt: number;
  userText: string;
  aiResponse?: string;
  mood?: number; // 1-5
}

export interface ProtocolStageLog {
  id: string;
  stage: number;
  action: "started" | "advanced" | "regressed" | "completed";
  createdAt: number;
  note?: string;
}

export interface RedFlagEvent {
  id: string;
  createdAt: number;
  flags: string[];
  acknowledged: boolean;
}

export type AssessmentType = "reaction" | "digits" | "oneBack";

export interface CognitiveAssessment {
  id: string;
  type: AssessmentType;
  createdAt: number;
  score: number;
  accuracy: number;
  reactionTime?: number;
  details: Record<string, number>;
}

export interface SafetyLog {
  id: string;
  createdAt: number;
  outcome: "passed" | "emergency_blocked" | "response_filtered";
  categories: string[];
  personalDataRedacted: boolean;
}
