# Google Flow — Complete Prompts for ReCo Video

> Copy-paste each prompt directly into Google Flow.
> Generate in order: Clip 1 → Clip 2 → Clip 3.
> Use Clip 1's output as a visual ingredient for Clip 3 to keep character consistency.
> Total generated footage: ~23 seconds. The rest is real screen recording.

---

## Clip 1 — Opening (8 seconds)

**Purpose:** Set the tone. A concussion patient in a calm, relatable moment.

**Prompt:**

```
8-second cinematic documentary shot, 16:9. A 19-year-old college soccer player sits at a quiet desk after practice in early evening, gently lowers a laptop screen because the light feels uncomfortable, then writes one short note in a paper journal. Calm and respectful healthcare storytelling, soft natural side light, muted sage and warm neutral color palette, realistic human motion, subtle slow push-in, shallow depth of field, no logos, no readable screen text, no hospital drama, no injury reenactment, no dialogue.
```

**Settings:**
- Aspect ratio: 16:9
- Duration: 8s
- Model: Veo 3.1 (or latest available)
- Audio: Off (narration recorded separately)

---

## Clip 2 — Transition (7 seconds)

**Purpose:** Abstract visual metaphor. Three recovery signals become one path. No fake UI.

**Prompt:**

```
7-second refined motion-design sequence, 16:9. On a clean warm off-white background, three thin data threads emerge: deep teal for daily symptoms, muted violet for cognitive observations, and soft amber for school and activity load. The threads fluctuate independently, then align into one calm forward-moving recovery pathway. Minimal editorial healthcare design, precise spacing, subtle paper texture, no dashboard, no fake app interface, no readable text, no glowing sci-fi effects, no gradients, slow confident movement.
```

**Settings:**
- Aspect ratio: 16:9
- Duration: 7s
- Model: Veo 3.1 (or latest available)
- Audio: Off

---

## Clip 3 — Closing (8 seconds)

**Purpose:** Return to the same character. Recovery is gradual, not triumphant.

**Prompt:**

```
8-second cinematic documentary closing shot, 16:9, same 19-year-old college soccer player, same muted sage clothing and quiet room as the reference image. They calmly close a paper journal, stand without urgency, and walk toward an open doorway with soft morning daylight beyond it. Recovery feels gradual and grounded, not triumphant. Gentle static camera with a subtle pan, realistic motion, no sports comeback, no running, no medical claims, no dialogue, no logos, no readable text.
```

**Settings:**
- Aspect ratio: 16:9
- Duration: 8s
- Model: Veo 3.1 (or latest available)
- Audio: Off
- **Visual ingredient:** Use Clip 1's first frame or output as reference for character consistency

---

## Workflow

1. Open <https://labs.google/fx/tools/flow>
2. Generate **Clip 1** with the prompt above
3. Save Clip 1's first frame as an image ingredient
4. Generate **Clip 2** (independent, no reference needed)
5. Generate **Clip 3** using Clip 1's frame as a visual ingredient
6. Download all three clips
7. Assemble in your video editor:
   - Clip 1 (0:00–0:08) → Clip 2 (0:08–0:15) → screen recording (0:15–2:40) → architecture.html screenshot (2:40–2:50) → Clip 3 (2:50–2:58)
8. Add voiceover from `VIDEO_SCRIPT.md`
9. Add English subtitles
10. Export at 1080p, 30fps minimum

---

## Tips

- If Flow adds unwanted text or UI, regenerate — it sometimes hallucinates screens
- Keep all three clips under 25 seconds total so judges see a product demo, not a marketing film
- If character consistency breaks in Clip 3, use Clip 1 as a video-to-video reference instead of just a frame
- Do not add Flow's native audio — record narration separately for consistency
- All generated media includes SynthID watermark; this is fine for Devpost
