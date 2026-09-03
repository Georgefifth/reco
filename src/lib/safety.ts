import type { SafetyLog } from "./types";
import { uid } from "./utils";

const CRISIS_PATTERNS = [
  /\b(kill myself|end my life|suicid(?:e|al)|self[- ]?harm|don'?t want to live)\b/i,
  /\b(hurt myself|better off dead|no reason to live)\b/i,
];

const MEDICAL_EMERGENCY_PATTERNS = [
  /\b(repeated(?:ly)? vomit|vomiting again|can'?t wake|cannot be awakened|seizure|convulsion)\b/i,
  /\b(slurred speech|one pupil|unequal pupils|lost consciousness|passed out)\b/i,
  /\b(weakness on one side|worsening headache|headache.*getting worse)\b/i,
];

const UNSAFE_RESPONSE_PATTERNS = [
  /\b(stop|skip|discontinue) (your )?(medication|medicine|prescription)\b/i,
  /\b(no need to|don'?t) (see|call|contact) (a |your )?(doctor|clinician)\b/i,
  /\byou (definitely|certainly) have\b/i,
  /\byou are cleared to (play|return|compete)\b/i,
];

export interface SafetyResult {
  blocked: boolean;
  response?: string;
  categories: string[];
  sanitizedText: string;
  personalDataRedacted: boolean;
}

export function inspectUserText(text: string): SafetyResult {
  const crisis = CRISIS_PATTERNS.some((pattern) => pattern.test(text));
  const medical = MEDICAL_EMERGENCY_PATTERNS.some((pattern) => pattern.test(text));
  const { text: sanitizedText, redacted } = redactPersonalData(text);
  const categories = [...(crisis ? ["mental_health_crisis"] : []), ...(medical ? ["concussion_red_flag"] : [])];
  if (crisis) return {
    blocked: true,
    categories,
    sanitizedText,
    personalDataRedacted: redacted,
    response: "What you wrote may describe an immediate safety crisis. ReCo will not send it to the AI. If you may act on these thoughts, call emergency services now. In the U.S. or Canada, call or text 988; elsewhere, contact your local crisis line. Stay with another person and move away from anything you could use to hurt yourself.",
  };
  if (medical) return {
    blocked: true,
    categories,
    sanitizedText,
    personalDataRedacted: redacted,
    response: "What you described can be a concussion danger sign. ReCo will not send it to the AI. Seek emergency medical care now or call your local emergency number. Do not drive yourself, and stay with another person while help is arranged.",
  };
  return { blocked: false, categories, sanitizedText, personalDataRedacted: redacted };
}

export function inspectAIResponse(text: string) {
  const unsafe = UNSAFE_RESPONSE_PATTERNS.some((pattern) => pattern.test(text));
  return unsafe
    ? { filtered: true, response: "The local model produced advice that ReCo could not safely show. Please discuss this question with a qualified clinician. If symptoms are severe or rapidly worsening, seek emergency care." }
    : { filtered: false, response: text };
}

export function createSafetyLog(result: SafetyResult, filtered = false): SafetyLog {
  return {
    id: uid(),
    createdAt: Date.now(),
    outcome: result.blocked ? "emergency_blocked" : filtered ? "response_filtered" : "passed",
    categories: result.categories,
    personalDataRedacted: result.personalDataRedacted,
  };
}

function redactPersonalData(text: string) {
  let redacted = false;
  const replace = (pattern: RegExp, replacement: string) => {
    const next = text.replace(pattern, () => {
      redacted = true;
      return replacement;
    });
    text = next;
  };
  replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email removed]");
  replace(/(?:\+?\d[\d .()-]{7,}\d)/g, "[phone removed]");
  return { text, redacted };
}
