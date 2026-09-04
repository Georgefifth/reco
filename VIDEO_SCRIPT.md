# ReCo — 4-Minute Demo Video Script

> For the recommended Google Flow + real screencast production plan and ready-to-use prompts, see `FLOW_VIDEO_PLAN.md`.
> Voiceover lines below are timed to cover each screen-recording segment at a natural speaking pace (~2.5 words/second).

**Total target: 3:45–4:00**

---

## Segment 1: Flow Opening (0:00 – 0:15)

**[Flow clip: student athlete in dim room, lowers laptop, writes in paper journal]**

**Voiceover:**

> A concussion can make ordinary life — class, screens, exercise, even conversation — feel unpredictable.

**[Flow clip: three abstract threads settle into one recovery path]**

**Voiceover:**

> Recovery is not a straight line. ReCo makes the pattern visible without sending health data to the cloud.

---

## Segment 2: Real App Landing + Demo Entry (0:15 – 0:28)

**[Screen recording: open deployed ReCo URL, pause on landing statement, click "Explore Sample Recovery", show Maya dashboard]**

**Voiceover:**

> This is ReCo, live on Render. It connects daily symptoms, cognitive observations, return-to-learn, and return-to-play in one private companion. No account, no backend database, no tracking. A judge can explore a realistic nine-day recovery locally with one click — here's Maya, a college soccer player on day ten of her recovery.

---

## Segment 3: Daily Recovery Snapshot (0:28 – 1:02)

**[Screen recording: open Check-in, show context fields, start symptoms, rate one symptom, use "None in this group", move to Review and save]**

**Voiceover:**

> Every day starts with a two-minute check-in. Instead of presenting 22 symptoms in one overwhelming page — which is exhausting for someone with a brain injury — ReCo groups them into four short sections: head and senses, thinking, energy and sleep, mood and body. Each symptom uses one clear zero-to-six scale, not a slider and seven buttons. Before rating symptoms, you can optionally log sleep, screen time, light activity, hydration, and how close you feel to your usual self. This daily context helps you notice possible relationships — like screen time and headache — without claiming cause or diagnosis. If a whole section is clear, one tap on "None in this group" moves you forward. A progress bar shows where you are, and you can go back to edit any section before saving.

---

## Segment 4: Local Pattern Insight (1:02 – 1:28)

**[Screen recording: return home, show decreasing symptom direction, show "Patterns worth noticing", emphasize "pattern, not proof of cause"]**

**Voiceover:**

> Back on the dashboard, Maya can see her symptom direction at a glance — the total score has dropped from 33 to 6 over nine days. Below that, ReCo highlights patterns worth noticing. These are transparent local calculations that look for relationships among symptoms, sleep, screen time, and light activity. For example, it might flag that headaches tend to follow high screen-time days. ReCo labels every pattern as a discussion point — not a medical conclusion. It's the kind of observation you might bring to a clinician appointment, not a substitute for one. The banner also reminds Maya that worsening symptoms, repeated vomiting, or slurred speech mean calling 911 immediately.

---

## Segment 5: Cognitive Pulse (1:28 – 1:58)

**[Screen recording: open Assess, demonstrate Reaction Time, show sample history for reaction time and 1-Back, pause on "Notice change, not diagnosis"]**

**Voiceover:**

> The Cognitive Pulse page offers three short browser-based tasks. Reaction time measures how quickly you respond to a color change across five trials, using sub-millisecond timing. Digits backward shows a sequence and asks you to enter it in reverse. One-Back tests working memory by asking whether the current letter matches the previous one. None of these are diagnostic tests — they're wellness observations that help you notice personal changes over time. Maya's sample history shows her reaction time improving from 372 to 296 milliseconds, and her 1-Back accuracy rising from 70 to 85 percent. That's the kind of personal trend that can anchor a conversation with a clinician — but ReCo never claims to provide medical clearance.

---

## Segment 6: Return to Learn + Return to Play (1:58 – 2:30)

**[Screen recording: open Protocol, show Return to Play current stage, switch to Return to Learn, show symptom-matched accommodations, show printable support summary]**

**Voiceover:**

> Sport and learning recover on separate timelines, so ReCo tracks both. The Return-to-Play path follows the Amsterdam 2022 international consensus statement — six stages from relative rest to full return to competition, with each stage requiring roughly 24 hours symptom-free before advancing. Stage 5, full-contact practice, explicitly requires clinician clearance. The Return-to-Learn path is just as important and often missing from concussion apps. It has four stages — daily activity at home, school activity at home, half-day attendance, and full-day attendance. ReCo generates symptom-matched temporary accommodations: if Maya has headaches, it suggests reduced screen time and extended exam time. If she has light sensitivity, it recommends adjusted seating and brightness. Parents and clinicians can print a one-page support summary to bring to school — no account, no portal, just a local printable document.

---

## Segment 7: Responsible Local AI (2:30 – 3:05)

**[Screen recording: open Journal, show "Local AI connected", submit a safe recovery reflection, show response, cut to Privacy safety-path diagram. Do NOT demonstrate self-harm text — describe the deterministic screen instead.]**

**Voiceover:**

> The journal is where ReCo's responsible AI comes in. Recovery is emotionally exhausting — the frustration, the fear of falling behind, the isolation. ReCo gives you a private space to process it. The model runs locally through Ollama on your own machine — here it's qwen2.5:7b connected on localhost. Your words never leave your device. Before inference, deterministic rules intercept emergency and self-harm language and return crisis resources instead of sending that text to the model. Basic personal identifiers like emails and phone numbers are redacted before inference. After inference, ReCo checks the response for unsafe medical claims — like telling someone they're cleared to play. The system prompt grounds the model in Amsterdam 2022 consensus and CDC HEADS UP guidance, so it responds with empathy and recovery-aware suggestions. The safety audit log stores only outcomes and categories — never the journal text itself. This is what responsible AI looks like in health tech: safety before, during, and after inference, with no cloud copy of your most personal thoughts.

---

## Segment 8: Privacy + Report + Evidence (3:05 – 3:30)

**[Screen recording: show Privacy data inventory, open Recovery Report, show print preview, open Evidence Ledger, show primary sources and limitations]**

**Voiceover:**

> The Privacy Center is the heart of our Responsible AI entry. A plain-language data inventory shows exactly what's stored: check-ins, journal entries, protocol logs, cognitive assessments, and anonymous safety logs. One click exports everything as JSON. One click wipes it all — no remnants, no server copies. The Recovery Report generates a clinician-friendly summary of symptom direction, protocol position, cognitive observations, and safety events — printable directly from the browser. And the Evidence Ledger maps every major feature to a primary public source: the Amsterdam 2022 consensus statement, CDC HEADS UP, Living Concussion Guidelines, and peer-reviewed return-to-learn research. It also states the app's limitations in plain language — ReCo does not diagnose, treat, or medically clear anyone.

---

## Segment 9: Architecture Proof (3:30 – 3:42)

**[On-screen diagram]**

```text
Browser
├── IndexedDB: symptoms, cognition, pathways, journal
├── Deterministic safety checks
├── Transparent pattern analysis
└── localhost:11434 → Ollama

Render
└── Serves application files only; receives no health record
```

**Voiceover:**

> Here's the architecture. Render serves the application files — HTML, JavaScript, CSS. That's it. The health record lives in IndexedDB inside the browser. Pattern analysis runs client-side. The AI safety pipeline runs client-side. And inference itself stays on localhost through Ollama. No health data ever reaches the Render server.

---

## Segment 10: Flow Closing (3:42 – 3:50)

**[Flow clip: same student closes journal, walks toward doorway with soft daylight]**

**Voiceover:**

> ReCo does not promise a perfect line. It offers a safer way to see the next step.

---

## Recording tips

- Record in 1080p, landscape, at 30fps minimum
- Use OBS or Loom — screen capture + microphone
- Speak clearly and at a steady pace; don't rush
- Do a dry run first to make sure Ollama is running and the AI responds well
- If the AI response is slow on camera, you can pre-generate a good response and show it
- Keep the demo data realistic but not distressing — moderate symptoms, a hopeful journal entry
- Cut every loading state and setup delay in editing
- Add English subtitles even if narration is English
- Keep Flow clips under 20–25 seconds total so the submission remains a product demo
- Total time budget: ~15s Flow opening, ~13s landing, ~34s check-in, ~26s patterns, ~30s cognitive, ~32s protocol, ~35s journal, ~25s privacy/report/evidence, ~12s architecture, ~8s Flow closing = ~3:50
