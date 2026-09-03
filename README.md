# ReCo — Concussion Recovery Companion

> A privacy-first recovery companion for people healing from a concussion.
> Built for **Hack for Humanity | Summer 2026**.

ReCo helps people recovering from a concussion track symptoms, follow an evidence-based return-to-play protocol, and process the emotional weight of recovery with a local AI companion — all while keeping every byte of health data on their own device.

## Why this matters

Concussion is a hidden epidemic. The [Concussion Alliance](https://www.concussionalliance.org/) estimates millions of concussions go untracked every year. Recovery is lonely, slow, and non-linear — patients struggle to know whether they're improving, when it's safe to return to sport, and how to make sense of cognitive and emotional symptoms that linger for weeks.

ReCo addresses three gaps:

1. **Visibility** — daily SCAT-5-style symptom tracking turns an invisible injury into a trend you can see.
2. **Protocol adherence** — a Berlin-consensus return-to-play tracker keeps recovery grounded in evidence, not guesswork.
3. **Emotional support** — a local AI companion helps process the frustration, fear, and isolation of recovery, with CBT-style reframing and red-flag safety prompts.

## Privacy is the feature, not a footnote

Most health apps ship your data to a cloud the moment you open them. ReCo doesn't.

- **No backend.** All data lives in your browser's IndexedDB. There is no server, no database, no account.
- **Local AI.** Journal conversations run through [Ollama](https://ollama.com) on `localhost:11434` — your words never leave your machine. If Ollama isn't running, entries still save locally without an AI reply.
- **No tracking.** No analytics, no cookies, no third-party scripts, no CDN-tracked fonts.
- **Full data rights.** Export everything as JSON. Delete everything with one click. No remnants.

This is our entry for the **Responsible AI** track ($8,676 prize): a health AI you can trust precisely because it never sees the inside of someone else's server.

## Features

- **Onboarding** — capture injury date, context (sport / fall / accident / work), and a free-form description. Starts you at Stage 0 of the return-to-play protocol.
- **Daily symptom check-in** — the 22-item SCAT-5 symptom evaluation (headache, dizziness, fog, light sensitivity, emotional lability, and more), each rated 0–6, with a notes field and a trend chart of your total symptom score over time.
- **Return-to-Play protocol tracker** — all 6 stages of the Berlin-consensus / CDC HEADS UP protocol, with activities, goals, and a symptom-free-day gate before advancing. Regress safely when symptoms return. Stage 5 explicitly requires clinician clearance.
- **AI journal companion** — write about your day; a local LLM (default `qwen2.5:7b`) responds with empathy, gentle CBT-style reframing, and recovery-aware guidance. Streaming responses. Red-flag language triggers emergency-care prompts.
- **Red-flag detection** — severe headache (6/6) or high confusion scores trigger an emergency-care banner on the home screen, with CDC red-flag education.
- **Privacy center** — data inventory, one-click JSON export, one-click full wipe, and a plain-language privacy policy.

## Evidence base

ReCo is grounded in published consensus and public health guidance:

- **Berlin consensus statement on concussion in sport (2016, updated 2022)** — the 6-stage return-to-play progression ReCo implements.
- **CDC HEADS UP** — red-flag symptoms and return-to-play guidance.
- **SCAT-5 (Sport Concussion Assessment Tool, 5th edition)** — the 22-item symptom checklist ReCo's daily check-in is based on.

ReCo is **not** a medical device. It does not diagnose, prescribe, or replace a clinician. It is a companion that helps patients follow a clinician-endorsed protocol and notice patterns in their recovery.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a calming, accessible design system (light + dark, reduced-motion respect, focus rings, ARIA labels)
- **IndexedDB** via `idb` for local storage
- **Recharts** for symptom trend visualization
- **Ollama** for local LLM inference (any model works; defaults to `qwen2.5:7b`)
- **lucide-react** for icons

## Getting started

### Prerequisites

- Node.js 20+
- (Optional, for AI journaling) [Ollama](https://ollama.com) installed and a model pulled, e.g.:
  ```bash
  ollama pull qwen2.5:7b
  ollama serve
  ```

### Install & run

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

## Deployment (Render)

ReCo deploys to [Render](https://render.com) as a Node.js Web Service:

1. Push this repo to GitHub.
2. In Render, create a new **Web Service** connected to the repo (or use the `render.yaml` blueprint).
3. Build command: `npm ci && npm run build`
4. Start command: `npm start`

The Next.js server only serves static HTML/JS/CSS — it never receives or stores user health data (all data lives in the browser's IndexedDB). See `render.yaml` for the infrastructure-as-config blueprint with security headers.

## Project structure

```
src/
  app/
    layout.tsx          # Root layout, metadata, fonts
    page.tsx            # Dashboard / home
    onboarding/page.tsx # 3-step setup wizard
    checkin/page.tsx    # SCAT-5 daily symptom check-in + trend chart
    journal/page.tsx    # AI journal companion (Ollama streaming)
    protocol/page.tsx   # Return-to-Play 6-stage tracker
    privacy/page.tsx    # Privacy center: export, delete, policy
  components/
    Nav.tsx             # Top navigation
    AppShell.tsx        # Layout shell + useProfile hook
  lib/
    types.ts            # Data types + SCAT-5 symptom keys
    db.ts               # IndexedDB wrapper (profile, checkins, journal, protocol, redflags)
    symptoms.ts         # SCAT-5 labels, RTP stages, red flags, detection logic
    ollama.ts           # Local LLM client + system prompt
    utils.ts            # cn(), uid(), date helpers
```

## Tracks targeted

| Track | How ReCo competes |
|---|---|
| Best Tech for Concussion Recovery | SCAT-5 tracking, Berlin RTP protocol, red-flag detection, concussion-aware AI |
| Responsible AI ($8,676) | 100% local data, local LLM, no backend, full export/delete, plain-language policy |
| Best Use of AI/ML | Local LLM with streaming, recovery-aware system prompt, symptom-context injection |
| Best Mental Health Tool | AI journal companion with CBT-style reframing for the emotional toll of concussion |
| Best Design | Calming palette, accessible focus rings, reduced-motion, responsive, ARIA labels |
| Best Innovation & Creativity | Privacy-first health AI — the responsible-AI story IS the product |
| Best Use of Render | Deploys as a Node.js Web Service on Render with security headers (see `render.yaml`) |

## License

MIT — built for Hack for Humanity Summer 2026.
