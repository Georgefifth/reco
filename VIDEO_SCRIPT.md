# ReCo — 4-Minute Demo Video Script

> For the recommended Google Flow + real screencast production plan and ready-to-use prompts, see `FLOW_VIDEO_PLAN.md`.
> Voiceover lines below are timed to cover each screen-recording segment at a natural speaking pace (~2.5 words/second).

**Total target: ~3:00–3:20**

---

## Segment 1: Flow Opening (0:00 – 0:15)

**[Flow clip: student athlete in dim room, lowers laptop, writes in paper journal]**

**Voiceover:**

> A concussion can make ordinary life feel unpredictable.

**[Flow clip: three abstract threads settle into one recovery path]**

**Voiceover:**

> Recovery is not a straight line. ReCo makes the pattern visible — without sending health data to the cloud.

---

## Segment 2: Real App Landing + Demo Entry (0:15 – 0:25)

**[Screen recording: open deployed ReCo URL, pause on landing statement, click "Explore Sample Recovery", show Maya dashboard]**

**Voiceover:**

> This is ReCo, live on Render. One click loads Maya's nine-day sample recovery — no account, no setup.

---

## Segment 3: Daily Recovery Snapshot (0:25 – 0:50)

**[Screen recording: open Check-in, show context fields, start symptoms, rate one symptom, use "None in this group", save]**

**Voiceover:**

> The daily check-in groups 22 symptoms into four short sections — head, thinking, energy, and mood — each with one simple zero-to-six scale. Optional context like sleep and screen time helps spot relationships. One tap clears a whole section. Everything saves locally.

---

## Segment 4: Local Pattern Insight (0:50 – 1:08)

**[Screen recording: return home, show decreasing symptom direction, show "Patterns worth noticing"]**

**Voiceover:**

> The dashboard shows symptom direction at a glance. ReCo flags local patterns — like screen time and headache — as discussion points, not medical conclusions.

---

## Segment 5: Cognitive Pulse (1:08 – 1:30)

**[Screen recording: open Assess, demonstrate Reaction Time, show sample history]**

**Voiceover:**

> Three short browser tasks track reaction time, working memory, and attention. Maya's reaction time improved from 372 to 296 milliseconds. These are wellness observations — not diagnostic tests.

---

## Segment 6: Return to Learn + Return to Play (1:30 – 1:55)

**[Screen recording: open Protocol, show Return to Play, switch to Return to Learn, show accommodations, show printable summary]**

**Voiceover:**

> ReCo tracks both timelines. Return-to-Play follows the Amsterdam 2022 consensus — six stages, symptom-free before advancing. Return-to-Learn adds four stages with symptom-matched school accommodations and a printable support summary.

---

## Segment 7: Responsible Local AI (1:55 – 2:20)

**[Screen recording: open Journal, show "Local AI connected", submit a safe reflection, show response, cut to safety-path diagram]**

**Voiceover:**

> The journal runs through Ollama on your own machine — your words never leave the device. Before inference, emergency language is intercepted and personal identifiers are redacted. After inference, responses are checked for unsafe medical claims. The audit log stores outcomes, never journal text.

---

## Segment 8: Privacy + Report + Evidence (2:20 – 2:40)

**[Screen recording: show Privacy data inventory, open Recovery Report, show print preview, open Evidence Ledger]**

**Voiceover:**

> One click exports everything. One click deletes it all. A printable recovery summary supports clinician conversations. The Evidence Ledger maps every feature to public sources — and states what ReCo cannot do.

---

## Segment 9: Architecture Proof (2:40 – 2:50)

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

> Render serves the app. The health record stays in your browser. Even AI inference stays on localhost.

---

## Segment 10: Flow Closing (2:50 – 2:58)

**[Flow clip: same student closes journal, walks toward doorway]**

**Voiceover:**

> ReCo. Recovery, held locally.

---

## Recording tips

- Record screen first, voiceover second — don't do both at once
- Use OBS for screen capture, DaVinci Resolve / CapCut / 剪映 for editing
- Cut all loading states and dead air in editing
- Add English subtitles
- Keep Flow clips under 20 seconds total
- Total time budget: ~15s Flow, ~10s landing, ~25s check-in, ~18s patterns, ~22s cognitive, ~25s protocol, ~25s journal, ~20s privacy, ~10s architecture, ~8s closing = ~2:58
