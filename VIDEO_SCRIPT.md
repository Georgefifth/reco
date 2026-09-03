# ReCo — 4-Minute Demo Video Script

**Total target: 3:45–4:00**

---

## Segment 1: The Problem (0:00 – 0:40)

**[Screen: Black, then fade in text]**

> "Concussion is a hidden epidemic. Millions go untracked every year."

**[Screen: Stock footage or simple animation of a sports impact / fall]**

**Voiceover:**
Concussion recovery is lonely, slow, and non-linear. Patients struggle to know whether they're improving, when it's safe to return to sport, and how to make sense of cognitive and emotional symptoms that linger for weeks. And the tools available to them? Most ship your most sensitive health data to a cloud the moment you open them.

**[Screen: Title card]**

> ReCo — A Privacy-First Concussion Recovery Companion
> Built for Hack for Humanity Summer 2026

---

## Segment 2: The Solution Overview (0:40 – 1:10)

**[Screen: ReCo home page, empty state]**

**Voiceover:**
Meet ReCo. It's a concussion recovery companion that does three things: it tracks your symptoms daily using the SCAT-5 standard, it guides you through a Berlin-consensus return-to-play protocol, and it gives you a private AI journal companion — all while keeping every byte of your data on your own device.

**[Screen: Click "Get started" → onboarding wizard, step 1]**

**Voiceover:**
Onboarding takes thirty seconds. You tell ReCo when you were injured, how it happened, and a bit about what you're experiencing.

**[Screen: Step through onboarding quickly — nickname, injury date, sport, notes, "Start recovery"]**

---

## Segment 3: Symptom Check-in (1:10 – 1:55)

**[Screen: Home dashboard after onboarding — "Day 1 of recovery"]**

**Voiceover:**
Now you're on your dashboard. Day one of recovery, starting at Stage 0 — rest. The first thing you'll do each day is a symptom check-in.

**[Screen: Click "Daily check-in" → scroll through the 22-item SCAT-5 list]**

**Voiceover:**
This is the SCAT-5 symptom evaluation — the same 22-item checklist clinicians use. You rate each symptom from zero to six. Headache, dizziness, brain fog, light sensitivity, emotional lability — all of it.

**[Screen: Drag a few sliders — set headache to 4, foggy to 3, fatigue to 2. Show the score updating in the sticky bar]**

**Voiceover:**
As you rate, your total symptom score updates live. Everything saves to your browser's IndexedDB — no server, no account, no upload.

**[Screen: Click "Save check-in" → show the "Saved locally" confirmation]**

---

## Segment 4: Return-to-Play Protocol (1:55 – 2:30)

**[Screen: Navigate to Protocol page]**

**Voiceover:**
The return-to-play protocol is grounded in the Berlin consensus statement and CDC HEADS UP guidance. Six stages, from complete rest to full return to competition.

**[Screen: Show the current stage card — Stage 0: Rest & Recovery. Scroll through all 6 stages]**

**Voiceover:**
Each stage requires roughly 24 hours symptom-free before you can advance. If symptoms return, you regress — safely, without judgment. Stage 5, full-contact practice, explicitly requires clinician clearance.

**[Screen: Show the "symptom-free days" tracker and the advance/regress buttons]**

**Voiceover:**
ReCo tracks how many symptom-free days you've had at each stage and tells you when you're eligible to advance. It's recovery grounded in evidence, not guesswork.

---

## Segment 5: AI Journal Companion (2:30 – 3:15)

**[Screen: Navigate to Journal page. Show "Local AI connected" status with qwen2.5:7b]**

**Voiceover:**
This is where ReCo's AI companion comes in. Recovery is emotionally exhausting — the frustration, the fear, the isolation. ReCo gives you a private space to process it.

**[Screen: Type a journal entry: "I'm so frustrated. It's been a week and I still can't look at screens without a headache. I feel like I'm falling behind in school."]**

**Voiceover:**
The AI runs locally through Ollama on your own machine. Your words never leave your device. It's instructed to respond with empathy, use CBT-style reframing for catastrophic thinking, and direct you to emergency services if red-flag symptoms appear.

**[Screen: Hit send. Show the streaming AI response appearing in real-time]**

**Voiceover:**
Responses stream in real-time. The AI also sees your recent symptom context — so it knows where you are in recovery and can respond accordingly.

---

## Segment 6: Privacy Center (3:15 – 3:45)

**[Screen: Navigate to Privacy page]**

**Voiceover:**
And here's the privacy center — the heart of our Responsible AI entry. Your data lives in your browser. AI inference runs on your machine. No accounts, no tracking, no third-party scripts.

**[Screen: Show the data inventory — "3 check-ins, 2 journal entries". Click "Export my data" → show the JSON download. Then hover over "Delete all data"]**

**Voiceover:**
You can export everything as JSON at any time. You can delete it all with one click. No remnants. This is what responsible AI looks like in health tech — not a privacy policy buried in a footer, but a product designed so there's nothing to leak.

**[Screen: Fade to title card]**

> ReCo — Privacy-First Concussion Recovery
> Hack for Humanity Summer 2026

**Voiceover:**
ReCo. Because recovery should be private, evidence-based, and a little less lonely.

---

## Recording tips

- Record in 1080p, landscape, at 30fps minimum
- Use OBS or Loom — screen capture + microphone
- Speak clearly and at a steady pace; don't rush
- Do a dry run first to make sure Ollama is running and the AI responds well
- If the AI response is slow on camera, you can pre-generate a good response and show it
- Keep the demo data realistic but not distressing — moderate symptoms, a hopeful journal entry
- Total time budget: ~40s problem, ~30s overview, ~45s check-in, ~35s protocol, ~45s journal, ~30s privacy = ~3:45
