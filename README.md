# Yeshwant Singh — Cinematic 3D Portfolio

A premium, cinematic personal portfolio built around an interactive scroll-driven 3D
figure, an editorial layout that deliberately avoids the usual card-grid look, and a
floating AI assistant that answers questions about the work in real time.

**Stack:** React 18 · Vite · Three.js / React Three Fiber · Drei · GSAP ScrollTrigger ·
Framer Motion · Lenis (smooth scroll) · Tailwind CSS.

---

## 1. Quick start

> **Prerequisites:** [Node.js](https://nodejs.org) **18 or newer** (Node 20 LTS recommended)
> and npm. Check with `node -v`.

```bash
# 1. install dependencies
npm install

# 2. start the dev server (hot reload) → http://localhost:5173
npm run dev

# 3. build an optimized production bundle into /dist
npm run build

# 4. preview the production build locally → http://localhost:4173
npm run preview
```

That's it — the site runs **with zero configuration**. The contact form falls back to
opening the visitor's email app via `mailto:`, and the map uses Google's keyless embed.
Everything below is optional polish.

---

## 2. Project structure

```
yeshwant-portfolio/
├── index.html                 # SEO meta, Open Graph/Twitter, Google Fonts, JSON-LD
├── package.json
├── vite.config.js             # build config + GitHub Pages "base" note
├── tailwind.config.js         # colors, fonts, keyframes
├── postcss.config.js
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── model/torso.glb        # ← the 3D figure (see §5 — it's large!)
│       ├── images/profile.jpg     # headshot
│       ├── images/linkedin.png    # reference only
│       └── og/og-image.jpg        # social share preview (1200×630)
└── src/
    ├── main.jsx               # React entry
    ├── App.jsx                # composes the page + 3D scene + assistant, lazy sections
    ├── lib/
    │   ├── config.js          # ★ THE ONE FILE you edit for keys/endpoints/tuning
    │   └── asset.js           # base-URL-aware asset path helper
    ├── data/
    │   └── content.js         # ★ all written content (bio, jobs, projects, skills…)
    ├── styles/index.css       # Tailwind layers + utilities + reduced-motion rules
    ├── hooks/                 # useMediaQuery, usePrefersReducedMotion
    └── components/
        ├── ChatAssistant.jsx  # bottom-right "Ask my AI" launcher + full-height chat drawer
        ├── Scene3D.jsx        # fixed R3F canvas (sits BEHIND the page) + lighting
        ├── TorsoModel.jsx     # fixed-position, back-facing, drag-to-rotate 3D figure
        ├── SmoothScroll.jsx   # Lenis + GSAP ScrollTrigger provider
        ├── Navbar.jsx, MagneticButton.jsx, SectionHeading.jsx
        ├── Hero.jsx, About.jsx, Experience.jsx, Projects.jsx,
        ├── ProjectVisual.jsx  # per-project animated SVG mini-visuals (by `render`)
        ├── Skills.jsx, Education.jsx
        ├── Contact.jsx, MapPanel.jsx
        └── Loader.jsx, Cursor.jsx   # ⚠︎ no longer wired in — safe to delete
```

The two files you'll actually touch are **`src/lib/config.js`** (keys, contact details,
3D tuning) and **`src/data/content.js`** (all the words).

---

## 3. Configuration — `src/lib/config.js`

Everything optional lives in one file.

### Contact form

Submissions are wired to **Web3Forms**, so a message lands directly in your inbox.
Order of preference is **Web3Forms → Formspree → `mailto:` fallback**.

**Web3Forms (configured):** the access key is set in `config.js`:
```js
export const WEB3FORMS_ACCESS_KEY = "ff53a6ab-753f-4bd7-9f20-dad781362dd0";
```
When present, the form POSTs to `https://api.web3forms.com/submit` and the message is
delivered to the email tied to that key (set/confirm it at <https://web3forms.com>). The form
shows an in-place success state; nothing else to wire up. To send somewhere else, paste a new
key — or blank it to fall back to the options below.

> Tip: Web3Forms emails can first land in spam — mark the first one "not spam". You can also
> add an auto-reply / custom subject from the Web3Forms dashboard. A hidden `botcheck` honeypot
> is already sent with each submission for basic spam protection.

**Formspree (alternative):** blank the Web3Forms key and set an endpoint instead:
```js
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xxxxxxx";
```

**`mailto:` fallback:** leave both blank and the form opens the visitor's mail app pre-filled.

### Map

By default the map uses Google's **keyless** embed — no key, no billing. For the official
Embed API (custom styling, higher quotas), get a key in Google Cloud → *Maps Embed API* and set:
```js
export const GOOGLE_MAPS_EMBED_KEY = "AIzaSy…";
```
`MapPanel` switches automatically. The location is also here:
```js
export const LOCATION = { label: "639 Lonsdale Street, Melbourne VIC 3000", … lat, lng };
```

### Personal details
```js
export const CONTACT = {
  email: "2singhyeshwant@gmail.com",
  phone: "+61481329663",
  phoneDisplay: "+61 481 329 663",
  linkedin: "https://www.linkedin.com/in/singhyeshwant",
};
```

---

## 4. Editing your content — `src/data/content.js`

All copy is data-driven, so you never dig through JSX to change wording. Exports:
`PROFILE`, `HERO`, `ABOUT`, `EXPERIENCE`, `PROJECTS`, `SKILLS`, `EDUCATION`, `NAV`.
Add a job by appending to the `EXPERIENCE` array; add a project to `PROJECTS` — each card takes
`name`, `tag`, `metric`, `desc`, `stack[]`, an optional `link: { href, label, hot? }`, a `feat`
flag (wider, accent card), and a `render` key that picks its animated mini-visual (see
`ProjectVisual.jsx`: `assistant`, `conveyor`, `gauge`, `triage`, `classify`, `cloud`, `aus`,
`er`, `climate`). The timeline, project cards, and skill clusters all rebuild from these arrays.

---

## 5. The 3D model (important)

### ⚠️ Compress the `.glb` before going live
`public/assets/model/torso.glb` is **~48 MB**, which is very heavy for the web and will
make first load slow on mobile/poor connections. Strongly recommended to shrink it — this
typically cuts it by **80–95%** with no visible quality loss:

```bash
# one-off, no install needed
npx @gltf-transform/cli optimize \
  public/assets/model/torso.glb \
  public/assets/model/torso.glb \
  --texture-compress webp --simplify

# or apply Draco mesh compression specifically
npx @gltf-transform/cli draco public/assets/model/torso.glb public/assets/model/torso.glb
```

If you apply **Draco** compression, enable the decoder when loading. In
`src/components/TorsoModel.jsx`, change the load call to:
```js
useGLTF(url, true); // 2nd arg = use Draco decoder (served from a CDN by drei)
// and update the matching preload: useGLTF.preload(url, true);
```
(With `@gltf-transform optimize` + WebP, no code change is needed — keep `useGLTF(url)`.)

Alternatives: [gltf.report](https://gltf.report) or [glb.babylonpress.org](https://glb.babylonpress.org) for drag-and-drop compression.

### The figure's scroll choreography — `MODEL` in `config.js`
The figure is **scroll-driven** and never crossfades. It traces a **left-then-right arc**:

| Where you are | What it does |
| --- | --- |
| Hero (top) | Centred, **back to you**, sitting **in front of the quote**. Drag to play. |
| Quote dissolves | Quote lifts away; the figure is left alone in the dark (still draggable). |
| About rises | Slides to the **right** and turns to **face right**, sinking **under About's text**. |
| Experience | Rides on the **right, facing right** (transparent section). |
| Projects rises | Turns its **back** to you (the long way round), then the **project carousel** rises and covers it. |
| After Projects | **Re-appears**, then **glides to the left** and settles into a clean **dead-left profile**. |
| Skills / Education | Rides on the **left, facing strictly left** (both transparent, content on the right). |
| Contact | **Sweeps back to the right** and turns to **face you** — a touch toward the left, looking slightly down (into your eyes). |

As it scrolls it also **tilts a little in 3D** (a small nod + lean), not just turning on one axis.

**How it hides — keyed to content, not the card.** It only disappears behind **two** opaque things now: **About's text box** and the **Projects cards**. About carries its black background on an inset, content-hugging layer (its `py-28 sm:py-36` padding stays transparent), so the figure vanishes right as it meets About's first line and returns after the last. In Projects, the opaque backing lives on the **`#proj-cards` wrapper** (the looping coverflow — active card centred, neighbours peeking faded on each side) — so the figure hides behind the carousel and re-appears right after it. Everything after that (Skills, Education, Contact) is **transparent**, so the figure rides the left in full view. As a cover crosses it, the figure also eases **back in depth** (`RECEDE_Z`) so it "sinks inside" rather than being sliced.

- **Front/back reversed?** Starts on the back via `BASE_ROTATION_Y: Math.PI` — set `0` (or
  ±`Math.PI`) if your mesh loads the wrong way. The turn targets are `FACE_RIGHT_YAW` and
  `FACE_LEFT_YAW`. The second half deliberately turns **the long way (via the back)**: the yaw
  values keep climbing past π (Projects = back, `FACE_LEFT_YAW` = 3π/2) instead of dropping below
  0 — that's what makes it rotate the other way and show its back over Projects. Reuse
  `BASE_ROTATION_Y` as the Projects "back" target.
- **The contact pose:** `CONTACT_X` (back on the **right**, like the rest of the ride),
  `CONTACT_YAW` (faces you, a touch toward the left — it's `2π − 0.22` so the turn from the
  left profile stays continuous), and `CONTACT_PITCH` (**positive = looks down** into your eyes).
- **Turn timing:** the second-half turns finish a little **early** (in `TorsoModel.jsx` the
  `enterOf(...)` values are divided by `0.6`–`0.7`) so the figure is fully settled — e.g. a clean
  dead-left profile — by the time you're reading that section, not still mid-turn.
- **3D tilt while scrolling:** `TILT_PITCH` / `TILT_ROLL` and their `*_FRONT` settle values
  (kept at `0` so the left profile stays straight). Small; `0` makes the turn flat.
- **Where it sits:** `RIGHT_X` (its spot on the right), `LEFT_X` (its spot on the left), and
  `CONTACT_X` (final — **right**, matching the rest of the ride). `POS_Y` / `SCALE` size and
  height it. All have `*_MOBILE` variants. If it clips an edge on a narrow window, ease
  `RIGHT_X` / `LEFT_X` / `CONTACT_X` toward `0`.
- **"Sink inside" depth:** `RECEDE_Z` (how far it eases back while covered; `0` = no recede).
- **Disappear / re-appear timing:** About's inset `-z-10 bg-ink-900` div (its `top-28/36` /
  `bottom-28/36` insets match its padding) and the **Projects `#proj-cards` backing**
  (`absolute inset-0 bg-ink-900`). Change About's insets with its padding so the text keeps
  lining up; the Projects backing auto-fits the cards, so no offsets to maintain there.
- **Drag feel:** `DRAG_YAW` / `DRAG_PITCH` (radians per pixel), `PITCH_MIN`/`PITCH_MAX`,
  `DRAG_DECAY` (how fast a nudge returns to the script). Drag works wherever the figure shows
  (Hero, Experience, Skills, Education, Contact).
- **Snappiness:** `FOLLOW` (higher = tracks faster). `SWAY` is faint idle breathing (`0` = still).
- **Camera:** `CAMERA.position` / `CAMERA.fov`.
- **Readability scrims:** Experience **and Contact** use a **left-heavy** gradient (figure on the
  right); Skills and Education use the mirrored **right-heavy** gradient (figure on the left) so
  the content stays legible. Adjust the gradient stops (in each section's JSX) or the `*_X`
  values if the figure and text don't sit where you want on your screen.
- **Section spacing:** Experience, Projects, Skills, Education and Contact use `py-16 sm:py-24`
  (tighter than About's `py-28 sm:py-36`) to close the gaps between them — change there.
- **Scroll speed:** smoothing is snappy by default (`lerp: 0.35` in `SmoothScroll.jsx`). Raise it
  toward `1` for near-native response, or lower toward `0.1` for more glide. If scrolling still
  feels heavy, the bottleneck is usually the 3D render — the canvas `dpr` is capped in
  `Scene3D.jsx` (`[1, 1.5]` desktop) to keep the frame rate up; lower it further if needed.

To swap in a different model, drop a new `.glb` in `public/assets/model/` and update
`MODEL.url`. A single, origin-centered mesh (~2 units tall, Y-up) behaves best.

---

## 6. Replacing images
Drop-in replacements in `public/assets/`:
- **`images/profile.jpg`** — the headshot (square/portrait works best).
- **`og/og-image.jpg`** — 1200×630 social-share card (referenced in `index.html`).
- **`favicon.svg`** — browser tab icon.

If you rename files, update the references in `index.html` (OG/favicon) and the relevant
component (`asset("assets/…")`).

---

## 7. Deploying

The build output is a static `/dist` folder — host it anywhere.

### Vercel (recommended)
Push to GitHub and "Import Project" in Vercel, **or**:
```bash
npm i -g vercel && vercel
```
Framework preset: **Vite**. Build `npm run build`, output `dist`. Keep `base: "/"`.

### Netlify
Drag-and-drop the `dist` folder at <https://app.netlify.com/drop>, or connect the repo with
build command `npm run build` and publish directory `dist`. Keep `base: "/"`.

### GitHub Pages
1. **Project page** (`username.github.io/REPO`): set the base in `vite.config.js`:
   ```js
   base: "/yeshwant-portfolio/",   // ← your repo name, with leading + trailing slash
   ```
   A **user page** (`username.github.io`) keeps `base: "/"`. All assets use
   `import.meta.env.BASE_URL`, so they follow whatever you set.
2. Build and publish `dist` (e.g. via the `gh-pages` package or a GitHub Actions workflow):
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

> **Tip:** because of the large `.glb`, compress it (§5) before deploying to GitHub Pages —
> it keeps repos lean and loads far faster.

---

## 8. Accessibility, motion & SEO
- **Reduced motion:** everything respects `prefers-reduced-motion`. Heavy motion becomes
  a quick fade, the figure's idle sway stops (drag-to-rotate still works — it's user-driven),
  magnetic hovers ease off, and CSS animations are neutralized.
- **Keyboard / a11y:** the floating assistant opens a focusable dialog with an "open in new tab" fallback;
  the nav is keyboard-navigable; form fields have labels, `aria-invalid`, and inline errors.
- **Cursor:** the native system cursor is used throughout (no custom cursor). The projects
  strip shows a standard `grab` / `grabbing` cursor to signal it's draggable.
- **SEO:** `index.html` includes title/description, Open Graph + Twitter cards, and a
  JSON-LD `Person` block. Update these to match your domain and the OG image URL.

---

## 9. Performance notes
- Below-the-fold sections are **lazy-loaded** (`React.lazy` + `Suspense`); the hero is eager.
- Vendor code is split into `three`, `r3f`, and `motion` chunks (see `vite.config.js`).
- The single biggest win for load time is **compressing the `.glb`** (§5). Do that first.
- The 3D canvas is `pointer-events: none`. The **hero sits below it** (so the figure covers
  the quote); every other section sits **above** it, and the solid ones scroll over the figure
  to hide it. Drag-to-rotate uses window-level pointer listeners, so it never blocks clicks.

---

## 10. Troubleshooting
- **Blank page after deploy on a subpath** → you forgot the `base` in `vite.config.js` (§7).
- **Model faces the wrong way** → set `MODEL.BASE_ROTATION_Y` to `0` (or ±`Math.PI`) (§5).
- **Figure sits over the section text** (not beside it) → nudge `RIGHT_X` / `CONTACT_X` or the
  scrim gradient stops in `Experience.jsx` / `Contact.jsx` (§5).
- **Can't rotate the figure** → drag works only where it shows (hero / Experience / Contact)
  and only with a mouse/trackpad; on touch it stays put so vertical swipes still scroll.
- **Scrolling feels heavy** → raise the Lenis `lerp` (already `0.35`) and/or lower the canvas `dpr` in `Scene3D.jsx` (§5).
- **Slow first load** → compress the `.glb` (§5).
- **Form submissions go nowhere** → that's the default `mailto:` behaviour; add a Formspree
  endpoint (§3) to capture them server-side.
- **Map looks too bright/dark** → tweak the CSS filter on the iframe in
  `src/components/MapPanel.jsx`.

---

Built with React, Three.js and a lot of attention to detail. Enjoy. 🖤
