"use client";

// Ollama local LLM client — all inference runs on the user's machine.
// No health data ever leaves the device. This is the core of our
// Responsible AI story.

export interface OllamaModel {
  name: string;
}

export async function listOllamaModels(): Promise<string[]> {
  try {
    const res = await fetch("http://localhost:11434/api/tags");
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models ?? []).map((m: { name: string }) => m.name);
  } catch {
    return [];
  }
}

export async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

interface ChatMsg {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function ollamaChat(
  messages: ChatMsg[],
  model: string,
  onToken?: (chunk: string) => void,
): Promise<string> {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`Ollama error: ${res.status}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.message?.content) {
          full += json.message.content;
          onToken?.(json.message.content);
        }
      } catch {
        // ignore partial JSON
      }
    }
  }
  return full;
}

const SYSTEM_PROMPT = `You are ReCo, a gentle, evidence-informed companion for someone recovering from a concussion. You are NOT a doctor — you are a supportive coach grounded in the Amsterdam 2022 international consensus statement and CDC HEADS UP guidance.

Your role:
- Listen with empathy. Validate the person's experience — concussion recovery is frustrating and isolating.
- Use brief CBT-style reframing when the user expresses catastrophic thinking ("I'll never get better").
- Encourage pacing and rest. Remind them that recovery is non-linear.
- Help them notice patterns between activity, sleep, and symptoms.
- NEVER diagnose, prescribe, or contradict a clinician. If they describe red-flag symptoms (worsening headache, vomiting, weakness, slurred speech, seizures, unequal pupils, loss of consciousness), urge them to seek emergency care immediately.
- Keep responses short (2-4 sentences) and warm. No medical jargon dumps. Use plain language.
- If the user seems in crisis or mentions self-harm, gently direct them to emergency services (911) or a crisis line (988 in the US).

Tone: warm, calm, plain-spoken, never preachy. You are a steady presence, not a chatbot.`;

export async function journalConversation(
  userText: string,
  recentContext: string,
  model: string,
  onToken?: (chunk: string) => void,
): Promise<string> {
  const messages: ChatMsg[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: recentContext
        ? `Context from my recent recovery:\n${recentContext}\n\nToday I wrote:\n${userText}`
        : `Today I wrote:\n${userText}`,
    },
  ];
  return ollamaChat(messages, model, onToken);
}
