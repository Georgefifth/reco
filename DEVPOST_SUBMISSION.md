# Devpost Submission Copy

> Copy-paste-ready text for the Hack for Humanity | Summer 2026 submission form.
> Replace anything in `[brackets]` before submitting.

---

## Project name

ReCo — A privacy-first concussion recovery companion

## Short description / tagline

Track symptoms, observe cognition, pace return-to-learn and return-to-play, and journal with a local AI — all without sending health data to a cloud.

## Built with

Next.js, React, TypeScript, Tailwind CSS, IndexedDB, Ollama, Recharts, Render

## Select tracks

- Best Tech for Concussion Recovery
- Responsible AI
- Best Use of AI/ML
- Best Mental Health Tool
- Best Physical Health Tool
- Best Design
- Best Innovation & Creativity
- Best Use of Render

---

## Inspiration

Concussion is a hidden epidemic. Millions go untracked every year. Recovery is lonely, slow, and non-linear — patients struggle to know whether they're improving, when it's safe to return to sport or school, and how to make sense of cognitive and emotional symptoms that linger for weeks.

I built ReCo because the tools available to most patients are either paper symptom diaries or cloud-based apps that ship sensitive health data to servers they've never audited. Neither option respects the reality of concussion recovery: you're already overwhelmed, light-sensitive, and foggy. The last thing you need is a 22-item form dumped on one screen or a privacy policy you don't have the energy to read.

ReCo is a companion, not a clipboard. It groups symptoms into manageable sections, runs AI journaling locally on your own machine, and maps every feature back to published clinical guidance — while being honest about what it cannot do.

## What it does

ReCo is a browser-based concussion recovery companion that keeps every byte of health data on the user's device. No account, no backend database, no analytics, no third-party scripts.

**One-click sample recovery.** First-time visitors — including hackathon judges — can load a realistic 9-day recovery journey with one click and explore every feature without setup. The sample data is clearly labeled and can be deleted instantly.

**Daily recovery snapshot.** Instead of presenting 22 symptoms in one overwhelming page, ReCo groups them into four short sections: head & senses, thinking, energy & sleep, mood & body. Each symptom uses one clear 0–6 scale. Users can also record sleep, screen time, light activity, hydration, and how close they feel to their usual self.

**Cognitive pulse.** Three short browser-based tasks — reaction time, digits backward, and 1-Back working memory — help users observe personal changes over time. These are wellness observations, not diagnostic tests, and the app says so explicitly.

**Return-to-Play and Return-to-Learn.** Sport and learning recover on separate timelines. ReCo follows an international-consensus 6-stage return-to-sport progression and adds a 4-stage return-to-learn path with symptom-matched temporary school accommodations and a printable support summary.

**Local AI journal.** A local LLM (Ollama, default qwen2.5:7b) responds with empathy and recovery-aware guidance. Before inference, deterministic rules intercept emergency language and remove basic personal identifiers. After inference, ReCo checks the response for unsafe medical claims. The audit log stores outcomes, never journal text.

**Local pattern insights.** Transparent calculations look for relationships among symptoms, sleep, screen time, and light activity. ReCo labels them as discussion points — not medical conclusions.

**Printable recovery report.** A clinician-friendly summary of symptom direction, protocol position, cognitive observations, and safety events, generated locally and printable with one click.

**Evidence ledger.** Every major feature maps to a primary public source — the Amsterdam 2022 consensus statement, CDC HEADS UP, Living Concussion Guidelines, PedsConcussion, and peer-reviewed return-to-learn research — alongside a plain-language statement of the app's limitations.

**Privacy center.** Data inventory, one-click JSON export, one-click full wipe, the AI safety path diagram, and a plain-language privacy policy.

## How we built it

**Architecture.** ReCo is a Next.js 16 App Router application written in TypeScript. Every page is a client component because the app is fully browser-side: all health data lives in IndexedDB, and the Next.js server only serves static HTML, JS, and CSS. There is no backend database and no API route that receives user data.

**Data layer.** IndexedDB (via the `idb` library) stores the user profile, symptom check-ins, journal entries, protocol logs, red-flag events, cognitive assessments, and anonymous AI safety logs. The schema is versioned (v2) and handles upgrades gracefully. Export and wipe operations cover all stores.

**AI integration.** Journal inference runs through Ollama on `localhost:11434`. The system prompt grounds the model in the Amsterdam 2022 consensus and CDC HEADS UP guidance. A four-step safety path — emergency screening, personal-data redaction, local inference, response safety check — runs before and after every model call. Emergency content is blocked before inference and replaced with crisis resources. Safety logs store only the outcome and categories, never the journal text.

**Cognitive tasks.** Reaction time uses `performance.now()` for sub-millisecond timing across five trials. Digits backward generates random sequences of increasing length. 1-Back presents 20 letter trials with match/no-match responses. All results are stored locally with timestamps for trend comparison.

**Design.** The interface uses a calming, accessible palette with light and dark mode support, reduced-motion respect, visible keyboard focus, ARIA labels, a skip-to-content link, and tabular numerals for data. The daily check-in was redesigned after researching PRO questionnaire UX: progressive disclosure, grouped symptoms, one scale per item, and a clear progress indicator replace the original overwhelming single-page form.

**Deployment.** ReCo runs on Render as a Node web service. The `render.yaml` blueprint specifies a free plan, Node runtime, `npm ci --include=dev && npm run build` build command, and `npm start` start command. Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) are served by the Next.js application itself, since Render Blueprint headers are only supported for static sites.

## Challenges we ran into

**SCAT licensing.** The official SCAT6 digital reformatting requires written authorization from BMJ and CISG. I removed all claims of reproducing or validating SCAT and reframed the symptom checklist as "22 common concussion symptom domains" for self-observation, with explicit non-diagnostic language.

**Render build dependencies.** The first deploy failed because `NODE_ENV=production` caused `npm ci` to skip Tailwind and PostCSS, which are build-time dependencies. The fix was `npm ci --include=dev` in the build command while keeping `NODE_ENV=production` for the runtime.

**Render Blueprint headers.** The `headers` field in `render.yaml` is only supported for static sites, not Node web services. I moved the security headers into Next.js's `headers()` configuration so they're served by the application itself.

**Cognitive load in symptom tracking.** The original check-in presented all 22 symptoms on one page with both a slider and seven number buttons per item — redundant and exhausting for someone with a concussion. After researching PRO questionnaire usability and progressive disclosure patterns, I rebuilt it as a four-group, single-scale-per-item flow with a progress indicator and "none in this group" shortcut.

**AI safety without a backend.** Most AI safety pipelines run server-side. ReCo has no server, so the entire safety path — emergency detection, personal-data redaction, response filtering, and audit logging — runs deterministically in the browser before and after the local model call.

## Accomplishments that we're proud of

- A real, deployed product that a judge can explore in under 30 seconds with one click — no setup, no account, no fake data wizard.
- A four-step AI safety path that runs entirely client-side and logs outcomes without storing journal text.
- A return-to-learn pathway with symptom-matched school accommodations and a printable support summary — a feature most concussion apps don't include.
- An evidence ledger that maps every feature to a primary public source and states the app's limitations in plain language.
- A daily check-in redesigned around concussion-specific cognitive constraints rather than copied from a paper form.

## What we learned

- Progressive disclosure isn't just a UX pattern — for someone with a brain injury, it's an accessibility requirement. Grouping 22 symptoms into four sections with one scale each is the difference between a tool that's usable during recovery and one that isn't.
- Local AI is practical for health companions. Ollama on a consumer laptop can run a 7B model that produces empathetic, recovery-aware responses in real time — without sending a single word to a cloud.
- Responsible AI isn't just about data location. It's also about what you do before inference (emergency screening, redaction), what you do after (response safety checks), and what you log (outcomes, not content).
- Clinical guidance is more nuanced than it appears. The Amsterdam 2022 consensus moved away from "complete rest" toward "relative rest followed by gradual activity." Getting this right in the product mattered more than any visual polish.

## What's next for ReCo

- **PWA offline support** so the app works without internet, reinforcing the privacy story.
- **Data encryption** using the Web Crypto API with a user-chosen PIN.
- **Vestibular and oculomotor rehabilitation exercises** (smooth pursuit, saccades, VOR) with symptom-driven adaptive difficulty.
- **Caregiver mode** with a shared local export for parents, coaches, and clinicians.
- **Active recovery guidance** based on the Leddy 2019 research on sub-threshold aerobic exercise.
- **Multi-language emergency numbers** that adapt to the user's location.
- **Formal accessibility audit** against WCAG 2.2 AA.

---

## Links

| Item | URL |
|---|---|
| GitHub repository | https://github.com/Georgefifth/reco |
| Live demo on Render | https://reco-concussion.onrender.com |
| Demo video | `[Add YouTube or Vimeo URL after uploading]` |

---

## Submission checklist

- [ ] GitHub repository is public
- [ ] README has setup instructions and live demo link
- [ ] Render app is live and all routes return 200
- [ ] Demo video is uploaded to YouTube or Vimeo
- [ ] Video is public or unlisted (not private)
- [ ] Video is under 4 minutes
- [ ] Video has English narration or English subtitles
- [ ] All target tracks are selected
- [ ] "Built with" field lists the tech stack
- [ ] No claims of diagnosis, treatment, or medical clearance
- [ ] Evidence ledger and limitations are visible in the app
- [ ] Privacy policy is accessible from the app
