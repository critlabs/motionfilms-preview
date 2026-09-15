# Motion Films L.L.C — Website Build Brief

## Goal
Build a cinematic, animation-heavy marketing site for **Motion Films L.L.C** (`motionfilms.me`),
a film production company. Visual/interaction language is modelled on `dnastudio.sa`
(a Riyadh film studio site) but rebranded to Motion Films.

Client-facing: must feel **clean, premium, confident**. It is for a movie client.

---

## Brand

- **Logo:** `assets/logo.png` (567×283, transparent PNG).
  Red filmstrip block with sprocket perforations top & bottom, white "otio" lettering
  (the middle of the M-OTIO-N wordmark). Use as-is; do not redraw.
- **Primary red:** `#D42027`
- **Ink black:** `#000000`
- **Paper white:** `#FFFFFF`
- Greys: derive (`#0A0A0A` surface, `#141414` elevated, `#8A8A8A` muted, `#242424` border)

Palette is **black background, white text, red as the single accent**. Red is used
sparingly — REC dot, active states, underline sweeps, the loader, hover fills.

## Typography

- **Display:** `Archivo` variable (Google Fonts) — weight 700–900, tight tracking (-0.03em),
  uppercase for hero, sentence case for section headers. This substitutes DNA's "Degular".
- **Technical / HUD / labels:** `IBM Plex Mono` (Google Fonts) — 400/500, uppercase,
  letter-spacing 0.12em, small sizes (10–13px). DNA uses this exact font.
- Body copy: `Archivo` 300/400, 16–18px, line-height 1.6, muted grey.

---

## Reference — what to copy from dnastudio.sa

Copy the **animation vocabulary and layout system**, NOT the content or the DNA logo.

### Must replicate
1. **Custom smooth scroll** — Lenis (or equivalent inertia scrolling), lerp ~0.08.
2. **Persistent HUD overlay** (fixed, above everything, mono type, tiny):
   - Top-left: `● REC — <CITY> — EST. <YEAR>` with a **pulsing red dot**
   - Top-right: `24.000 FPS / EN / <live clock>` and a **scroll-progress bar + %**
   - Bottom-left: `REC SINCE <date>`, elapsed `00Y 00M 00D · HH:MM:SS` live counter,
     `FRAMES ~ <incrementing number>` (ticks up every frame/interval)
   - Bottom-right: `[ ♪ SOUND ON ]` toggle and a `LIVE 00:00 — <rotating status message>` ticker
   - Left edge: **vertically rotated** section caption text (writing-mode: vertical-rl)
   - Bottom-left corner: `[ STORYBOARD ]` label
3. **Hero** — full-bleed background media (video or image), dark gradient scrim,
   giant multi-line headline that reveals **line by line with a mask-up** (clip-path
   inset or overflow-hidden + translateY 110% → 0), staggered ~0.12s, cubic-bezier
   (0.16, 1, 0.3, 1), duration ~1.1s. `SCROLL` cue bottom-right with a subtle bob.
4. **Infinite marquee strip** — seamless horizontal loop of phrases separated by `·`,
   reverses direction on scroll direction change (bonus), pauses on hover.
5. **Scroll-triggered reveals** — every section heading splits to **words or lines** and
   masks up on enter. Body paragraphs fade+rise 24px. Stagger children.
6. **Manifesto grid** — 2×2 bordered cells, roman numerals `I II III IV` in mono,
   borders **draw in** (scaleX/scaleY from 0) on scroll enter.
7. **Selected work** — horizontal **drag-or-scroll** carousel of project cards.
   Each card: 16:9 media placeholder, index `01 / 06`, category, duration, title,
   client line, `READ THE STORY` link. Card media **parallax/scale** slightly on scroll.
   Progress indicator `01 / 06` + a thin progress line.
8. **Pinned / sticky section** — at least one section that pins while inner content advances.
9. **Image/media parallax** — background media moves slower than scroll (translateY on
   scroll progress), and scale 1.1 → 1.0 on enter.
10. **Link hover** — underline sweeps left→right; arrow `→` translates on hover.
11. **Menu overlay** — hamburger opens full-screen black overlay, nav items stagger in
    with mask-up, each item has an index number and a subtitle (e.g. `HOME / MAIN PAGE`).
12. **Counter animations** — numbers count up when scrolled into view.
13. **Section slates** — before major sections, a mono metadata row like
    `SCN 03 — SELECTED WORK   2.39 : 1   DEPT — DIRECTION   TC 00:00:00:00`

### Explicitly DO NOT copy
- ❌ **Custom cursor** — DNA replaces the cursor. We keep the **native cursor**. No cursor JS at all.
- ❌ DNA's loading screen (see below — ours must be different)
- ❌ DNA's logo, copy, project names, Arabic/Vision-2030 content

---

## Loading screen — MUST be different from DNA

DNA's loader is a minimal `INTERMISSION 00%` counter. **Ours is a film countdown leader.**

Design:
- Full-screen black.
- Centre: an **Academy countdown leader** — a circle with crosshair lines
  (vertical + horizontal through centre), an outer ring, and a **sweeping wedge**
  that rotates 360° per count (like a real film leader).
- Big numeral in the centre counting **5 → 4 → 3 → 2 → 1**, each held ~380ms,
  numeral swaps with a hard cut (no fade) + slight scale punch.
- Faint **film grain** overlay + occasional 1-frame white flash between counts.
- Mono readout under the circle: `MOTION FILMS L.L.C · LOADING <NN>%` where NN
  tracks real asset progress (or a simulated ramp).
- On reaching 1 → the ring collapses, then the **Motion Films logo** (`assets/logo.png`)
  scales in from 0.9 with a red flash, holds ~400ms.
- Exit: the whole loader **splits horizontally like a film gate opening** — two halves
  slide up/down out of frame revealing the hero, ~900ms, cubic-bezier(0.85,0,0.15,1).
- Respect `prefers-reduced-motion`: skip to logo + fade.
- Only show on first visit per session (`sessionStorage`).

---

## Content structure (placeholders — real media comes later)

All media are **placeholders** that must still be animated. Use labelled
`<div class="media-placeholder">` blocks with an aspect ratio, a subtle animated
gradient/scanline shimmer, a centre mono label like `[ HERO PLATE — 2.39:1 ]`,
and a corner `+` crop mark at each corner. They should look intentional, not broken.

Sections:
1. **Loader** (above)
2. **Hero** — placeholder for background video plate. Headline:
   `WE MAKE FILMS THAT MOVE PEOPLE.` (3 lines, mask reveal). Sub-line + SCROLL cue.
3. **Showreel** — big 2.39:1 placeholder, mono overlay `REEL.2026 · 02:14`, play button
   that scales on hover, timecode bar.
4. **Marquee** — `MOTION FILMS · CINEMATIC STORYTELLING · COMMERCIALS · DOCUMENTARY · EST. 2019 ·`
5. **Manifesto** — intro paragraph + 2×2 grid (I–IV) with short principles.
6. **Selected Work** — horizontal carousel, 6 placeholder projects.
7. **Services** — big headline `From script to screen.` + 4 disciplines list with
   hover expand (row expands, thumbnail placeholder slides in).
8. **Stats / counters** — e.g. `120+ PROJECTS`, `18 AWARDS`, `07 YEARS`, count-up.
9. **Contact / CTA** — huge `LET'S WORK` headline, email link, footer with mono meta.

Copy should be generic-but-premium film-house language. Keep it short.

---

## Technical requirements

- **Single-page static site.** Plain HTML + CSS + JS. No build step, no framework.
  Deliver `index.html`, `styles.css`, `main.js`, `assets/`.
- **GSAP 3 + ScrollTrigger** via CDN, plus **Lenis** via CDN. That's it — no other deps.
- Fonts from Google Fonts CDN (`Archivo`, `IBM Plex Mono`).
- **Fully responsive** — desktop, tablet, mobile. Headline clamps. Carousel becomes
  swipeable on touch. HUD reduces to essentials on mobile.
- **Accessibility:** honour `prefers-reduced-motion` (disable Lenis + all transforms,
  show content immediately). Semantic landmarks. Focus states visible. Alt text.
- **Performance:** no layout thrash, use transforms/opacity only, `will-change`
  sparingly, lazy-init ScrollTriggers. Target smooth 60fps.
- Clean, commented, well-organised code. Group JS into clear modules
  (`initLoader`, `initScroll`, `initHero`, `initHUD`, `initMarquee`, `initWork`, …).
- Add a `README.md` explaining how to swap placeholders for real video/images later,
  where to change brand text, and how to disable the loader.

## Deliverable
Working site in `~/.openclaw/workspace/motionfilms/`, served locally for review.
