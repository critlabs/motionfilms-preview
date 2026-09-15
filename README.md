# Motion Films L.L.C — website

A single-page cinematic site for **motionfilms.me**. Static HTML/CSS/JS, no build step,
no framework, no npm install. Open `index.html` on any static host and it works.

```
index.html      markup + all copy
styles.css      design system, layout, responsive rules
main.js         loader, HUD, scroll animations, carousel, menu
assets/logo.png brand mark
.shots/         dev-only: headless verification scripts + screenshots (safe to delete)
```

## Run locally

```bash
cd motionfilms
python3 -m http.server 8899
# open http://localhost:8899
```

Useful URL flags:

| Flag | Effect |
|---|---|
| `?noloader=1` | Skips the countdown intro — handy when reviewing design |

The intro also auto-skips on repeat visits in the same tab (`sessionStorage`) and for
visitors with **reduce motion** enabled.

---

## Dependencies (all via CDN, pinned)

- **GSAP 3.12.5** + **ScrollTrigger** — all animation
- **Lenis 1.1.14** — inertia smooth scroll
- **Google Fonts** — `Archivo` (display), `IBM Plex Mono` (HUD/technical)

To self-host, download those four files into `assets/vendor/` and swap the `<script>`
and `<link>` tags at the bottom of `index.html`.

---

## Brand

| Token | Value |
|---|---|
| Red | `#D42027` |
| Black | `#000000` |
| White | `#FFFFFF` |
| Muted text | `#8A8A8A` |
| Borders | `#242424` |

All defined as CSS custom properties at the top of `styles.css`. Change them there once.

Two spacing tokens matter:

- `--pad` — the screen-edge lane reserved for the HUD rails
- `--gutter` — where real content starts (wider on desktop so the vertical side rail
  and corner labels never sit on top of copy)

---

## Swapping placeholders for real footage

Every placeholder is the same block. Find them by searching `class="ph`.

```html
<div class="ph ph--16x9" data-label="[ PROJECT 01 — 16:9 ]">
  <div class="ph__grid"></div><div class="ph__shimmer"></div>
  <span class="ph__label mono">[ PROJECT 01 — 16:9 ]</span>
  <i class="ph__mark ph__mark--tl"></i> …corner crop marks…
</div>
```

Replace the whole `<div class="ph …">…</div>` with your media. Keep the wrapper's
aspect-ratio class so the layout does not jump.

**Image:**
```html
<img class="ph--img" src="assets/work/northern-light.jpg" alt="Northern Light — campaign film" />
```

**Video (hero plate):**
```html
<video class="ph--img" src="assets/hero.mp4"
       autoplay muted loop playsinline
       poster="assets/hero-poster.jpg"></video>
```

Add this once to `styles.css`:
```css
.ph--img{ width:100%; height:100%; object-fit:cover; display:block; }
```

### Where the placeholders live

| # | Location in `index.html` | Ratio | Suggested asset |
|---|---|---|---|
| 1 | `.hero__media` | fills viewport | Looping hero plate, muted, ~8–15s, H.264 |
| 2 | `.showreel__frame` | 2.39:1 | Showreel poster frame or embedded player |
| 3–8 | six `.card__media` in `#workTrack` | 16:9 | One still per project |
| 9 | `.contact__media` | 1:1 | Studio/crew still |

The hero and card media already have scroll parallax attached — real media inherits it
automatically, no JS changes needed.

**Video tips:** keep the hero under ~4 MB, always `muted playsinline` (iOS refuses to
autoplay otherwise), and supply a `poster` so the first paint is never empty.

---

## Editing content

| What | Where |
|---|---|
| Hero headline | `.hero__title` — one `<span class="line"><span>…</span></span>` per line; each line reveals separately |
| Nav items | `.menu__list` in `index.html` |
| Manifesto principles | `.grid4` cells (I–IV) |
| Projects | `.card` articles inside `#workTrack` — add or remove freely, the counter adapts |
| Services | `.disciplines` list |
| Stats | `data-count` / `data-suffix` / `data-pad` attributes on `.stat__num` |
| Email + footer | `#contact` and `.site-footer` |
| HUD city / est. year | `.hud__tl`, and `START` date in `main.js` (`initHUD`) |
| HUD status ticker lines | `lines` array in `initHUD()` in `main.js` |

Animations are driven by data attributes, so new markup animates with no JS edits:

- `data-reveal` — fade + rise
- `data-reveal-words` — heading splits into words, each masks up
- `data-reveal-lines` — you supply `.line > span`, each line masks up
- `data-reveal-scale` — media scales in

---

## Notes / decisions

- **No custom cursor.** Deliberate — the native cursor is left untouched everywhere.
- **The loader cannot trap the site.** A 7s fail-safe force-dismisses it if the
  timeline ever stalls (throttled rAF, backgrounded tab, a CDN hiccup).
- **`prefers-reduced-motion` is fully honoured** — Lenis is not initialised, the intro
  is skipped, and all content renders immediately in its final position.
- **The sound toggle is currently cosmetic.** Wire it to the real player when the
  showreel video is added (`initHUD()` → `soundBtn` handler).
- The `LIVE` ticker, frame counter and elapsed timer are decorative telemetry, matching
  the production-house aesthetic. The clock and elapsed counter are genuinely live.

## Verified

Checked in headless Chrome via CDP at 1440×900 and 390×844:
zero console errors, no horizontal overflow, loader completes and exits, hero reveals,
all sections animate in, carousel drags, counters count, mobile HUD reduces cleanly.
Re-run any time with `.shots/verify.mjs` (see the top of that file for usage).
