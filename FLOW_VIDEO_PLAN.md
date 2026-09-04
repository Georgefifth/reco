# Google Flow + Real Demo Video Plan

## Recommendation

Use Google Flow for cinematic framing, not for pretending the product works. Devpost explicitly recommends a screencast because judges need to evaluate the real app. The strongest 4-minute submission is approximately 20 seconds of Flow footage, 2 minutes 45 seconds of real screen recording, and 35–45 seconds of diagrams, titles, and closing proof.

Flow currently supports text-to-video, visual ingredients, start/end frames, clip extension, video-to-video editing on supported models, native audio on Veo, and SceneBuilder sequencing. Model features, clip lengths, credits, watermarks, and regional availability vary. Generated media includes SynthID.

## Final Timeline

### 0:00–0:08 — Flow Opening

Visual: a student athlete sits in a dim room after practice. A laptop screen is lowered because bright light is uncomfortable. The room feels calm, not tragic.

Voiceover:

> A concussion can make ordinary life—class, screens, exercise, even conversation—feel unpredictable.

Flow prompt:

```text
8-second cinematic documentary shot, 16:9. A 19-year-old college soccer player sits at a quiet desk after practice in early evening, gently lowers a laptop screen because the light feels uncomfortable, then writes one short note in a paper journal. Calm and respectful healthcare storytelling, soft natural side light, muted sage and warm neutral color palette, realistic human motion, subtle slow push-in, shallow depth of field, no logos, no readable screen text, no hospital drama, no injury reenactment, no dialogue.
```

### 0:08–0:15 — Flow Transition: Invisible Signals Become Visible

Visual: three subtle lines—symptoms, cognition, and daily load—appear as abstract threads and settle into one calm recovery path. Do not generate fake product UI.

Voiceover:

> Recovery is not a straight line. ReCo makes the pattern visible without sending health data to the cloud.

Flow prompt:

```text
7-second refined motion-design sequence, 16:9. On a clean warm off-white background, three thin data threads emerge: deep teal for daily symptoms, muted violet for cognitive observations, and soft amber for school and activity load. The threads fluctuate independently, then align into one calm forward-moving recovery pathway. Minimal editorial healthcare design, precise spacing, subtle paper texture, no dashboard, no fake app interface, no readable text, no glowing sci-fi effects, no gradients, slow confident movement.
```

### 0:15–0:28 — Real App Landing + Demo Entry

Screen recording:

1. Open the deployed ReCo URL.
2. Pause on the landing statement: “Recovery is not a straight line. Make it visible.”
3. Click **Explore Sample Recovery**.
4. Show the populated Maya dashboard.

Voiceover:

> This is ReCo, live on Render. It connects daily symptoms, cognitive observations, return-to-learn, and return-to-play in one private companion. No account, no backend database, no tracking. A judge can explore a realistic nine-day recovery locally with one click — here's Maya, a college soccer player on day ten of her recovery.

### 0:28–1:02 — Daily Recovery Snapshot

Screen recording:

1. Open Check-in.
2. Show optional sleep, screen time, activity, hydration, and “feeling like usual.”
3. Click **Start symptoms**.
4. Demonstrate one mild headache rating.
5. Use **None in this group** for another section.
6. Move to Review and save.

Voiceover:

> Every day starts with a two-minute check-in. Instead of presenting 22 symptoms in one overwhelming page — which is exhausting for someone with a brain injury — ReCo groups them into four short sections: head and senses, thinking, energy and sleep, mood and body. Each symptom uses one clear zero-to-six scale, not a slider and seven buttons. Before rating symptoms, you can optionally log sleep, screen time, light activity, hydration, and how close you feel to your usual self. This daily context helps you notice possible relationships — like screen time and headache — without claiming cause or diagnosis. If a whole section is clear, one tap on "None in this group" moves you forward. A progress bar shows where you are, and you can go back to edit any section before saving.

### 1:02–1:28 — Local Pattern Insight

Screen recording:

1. Return home.
2. Show decreasing symptom direction.
3. Show “Patterns worth noticing.”
4. Emphasize “pattern, not proof of cause.”

Voiceover:

> Back on the dashboard, Maya can see her symptom direction at a glance — the total score has dropped from 33 to 6 over nine days. Below that, ReCo highlights patterns worth noticing. These are transparent local calculations that look for relationships among symptoms, sleep, screen time, and light activity. For example, it might flag that headaches tend to follow high screen-time days. ReCo labels every pattern as a discussion point — not a medical conclusion. It's the kind of observation you might bring to a clinician appointment, not a substitute for one. The banner also reminds Maya that worsening symptoms, repeated vomiting, or slurred speech mean calling 911 immediately.

### 1:28–1:58 — Cognitive Pulse

Screen recording:

1. Open Assess.
2. Briefly demonstrate Reaction Time.
3. Show existing sample history for reaction time and 1-Back.
4. Pause on “Notice change, not diagnosis.”

Voiceover:

> The Cognitive Pulse page offers three short browser-based tasks. Reaction time measures how quickly you respond to a color change across five trials, using sub-millisecond timing. Digits backward shows a sequence and asks you to enter it in reverse. One-Back tests working memory by asking whether the current letter matches the previous one. None of these are diagnostic tests — they're wellness observations that help you notice personal changes over time. Maya's sample history shows her reaction time improving from 372 to 296 milliseconds, and her 1-Back accuracy rising from 70 to 85 percent. That's the kind of personal trend that can anchor a conversation with a clinician — but ReCo never claims to provide medical clearance.

### 1:58–2:30 — Return to Learn + Return to Play

Screen recording:

1. Open Protocol.
2. Show Return to Play current stage.
3. Switch to Return to Learn.
4. Show symptom-matched school accommodations.
5. Show printable support summary.

Voiceover:

> Sport and learning recover on separate timelines, so ReCo tracks both. The Return-to-Play path follows the Amsterdam 2022 international consensus statement — six stages from relative rest to full return to competition, with each stage requiring roughly 24 hours symptom-free before advancing. Stage 5, full-contact practice, explicitly requires clinician clearance. The Return-to-Learn path is just as important and often missing from concussion apps. It has four stages — daily activity at home, school activity at home, half-day attendance, and full-day attendance. ReCo generates symptom-matched temporary accommodations: if Maya has headaches, it suggests reduced screen time and extended exam time. If she has light sensitivity, it recommends adjusted seating and brightness. Parents and clinicians can print a one-page support summary to bring to school — no account, no portal, just a local printable document.

### 2:30–3:05 — Responsible Local AI

Screen recording:

1. Open Journal.
2. Show “Local AI connected.”
3. Submit a safe recovery reflection and show the response.
4. Cut to the Privacy safety-path diagram.
5. Do not demonstrate self-harm text in the public video; describe the deterministic screen instead.

Voiceover:

> The journal is where ReCo's responsible AI comes in. Recovery is emotionally exhausting — the frustration, the fear of falling behind, the isolation. ReCo gives you a private space to process it. The model runs locally through Ollama on your own machine — here it's qwen2.5:7b connected on localhost. Your words never leave your device. Before inference, deterministic rules intercept emergency and self-harm language and return crisis resources instead of sending that text to the model. Basic personal identifiers like emails and phone numbers are redacted before inference. After inference, ReCo checks the response for unsafe medical claims — like telling someone they're cleared to play. The system prompt grounds the model in Amsterdam 2022 consensus and CDC HEADS UP guidance, so it responds with empathy and recovery-aware suggestions. The safety audit log stores only outcomes and categories — never the journal text itself. This is what responsible AI looks like in health tech: safety before, during, and after inference, with no cloud copy of your most personal thoughts.

### 3:05–3:30 — Privacy + Report + Evidence

Screen recording:

1. Show Privacy data inventory.
2. Open Recovery Report.
3. Show print preview briefly.
4. Open Evidence Ledger.
5. Show primary sources and known limitations.

Voiceover:

> The Privacy Center is the heart of our Responsible AI entry. A plain-language data inventory shows exactly what's stored: check-ins, journal entries, protocol logs, cognitive assessments, and anonymous safety logs. One click exports everything as JSON. One click wipes it all — no remnants, no server copies. The Recovery Report generates a clinician-friendly summary of symptom direction, protocol position, cognitive observations, and safety events — printable directly from the browser. And the Evidence Ledger maps every major feature to a primary public source: the Amsterdam 2022 consensus statement, CDC HEADS UP, Living Concussion Guidelines, and peer-reviewed return-to-learn research. It also states the app's limitations in plain language — ReCo does not diagnose, treat, or medically clear anyone.

### 3:30–3:42 — Architecture Proof

On-screen diagram:

```text
Browser
├── IndexedDB: symptoms, cognition, pathways, journal
├── Deterministic safety checks
├── Transparent pattern analysis
└── localhost:11434 → Ollama

Render
└── Serves application files only; receives no health record
```

Voiceover:

> Here's the architecture. Render serves the application files — HTML, JavaScript, CSS. That's it. The health record lives in IndexedDB inside the browser. Pattern analysis runs client-side. The AI safety pipeline runs client-side. And inference itself stays on localhost through Ollama. No health data ever reaches the Render server.

### 3:42–3:50 — Flow Closing

Visual: return to the same student from the opening. They close the paper journal and step outside for a gentle walk. No triumphant running or implied cure.

Voiceover:

> ReCo does not promise a perfect line. It offers a safer way to see the next step.

Use the opening shot as a visual ingredient or first frame for character consistency.

Flow prompt:

```text
8-second cinematic documentary closing shot, 16:9, same 19-year-old college soccer player, same muted sage clothing and quiet room as the reference image. They calmly close a paper journal, stand without urgency, and walk toward an open doorway with soft morning daylight beyond it. Recovery feels gradual and grounded, not triumphant. Gentle static camera with a subtle pan, realistic motion, no sports comeback, no running, no medical claims, no dialogue, no logos, no readable text.
```

## Production Rules

- Record the real app at 1920×1080 in a Chromium browser.
- Use sample data, not real health data.
- Keep cursor motion slow and deliberate.
- Cut every loading state and setup delay.
- Add English subtitles even if narration is English.
- Keep generated UI out of Flow clips; generative video often distorts text and controls.
- Keep Flow clips under 20–25 seconds total so the submission remains a product demo rather than a marketing film.
- Use one narrator throughout. Generate ambient audio in Flow only if it remains subtle; record the voiceover separately for consistency.
- Upload to YouTube, Vimeo, or Youku early and verify public visibility before submitting to Devpost.

## Suggested Flow Workflow

1. Create the opening character image in Flow/Nano Banana.
2. Save it as an ingredient.
3. Generate the opening with Veo 3.1 in 16:9.
4. Reuse the ingredient for the closing.
5. Generate the abstract thread transition separately.
6. Assemble only the Flow clips in SceneBuilder and download them.
7. Record the actual app with OBS or another screen recorder.
8. Combine Flow clips, screencast, narration, subtitles, and architecture diagram in a conventional editor.
9. Do not rely on Flow alone for the final 4-minute edit or functional proof.

## Official References

- Google Flow: https://labs.google/fx/tools/flow
- Create videos in Flow: https://support.google.com/flow/answer/16353334?hl=en
- Edit videos and build scenes: https://support.google.com/flow/answer/16935718
- Devpost video guidance: https://help.devpost.com/article/84-video-making-best-practices
