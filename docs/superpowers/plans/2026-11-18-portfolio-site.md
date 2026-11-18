# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Harshit Arora's portfolio site (Direction A, Night palette) and deploy it on Vercel. The site serves recruiters for both the full-stack and the AI/ML track.

**Architecture:**
- **Pages:** Next.js App Router with server components by default. Client components only where there is interaction: track filter, loader, canvases, cursor, smooth scroll, copy button, Spotify card.
- **Content:** MDX files plus typed TypeScript data. Content is validated with zod at build time.
- **Track filter:** one shared track state, held in the URL (`?track=`) and a React context.
- **Motion:** CSS-first, with small hooks only where CSS can't do the job.
- **Server:** one serverless route, `/api/spotify`, which never fails loudly.

**Tech Stack:**
- Next.js 16 (App Router, React 19), TypeScript (strict), Tailwind CSS 4
- `next-mdx-remote` 6 (RSC), `gray-matter`, zod 4, `lenis` 1.3
- Vitest 4 + Testing Library + jsdom for unit and component tests
- Playwright 1.65 + `@axe-core/playwright` for end-to-end and accessibility tests
- Vercel for hosting

**Spec:** `docs/superpowers/specs/2026-11-18-portfolio-design.md` (approved 2026-11-18). The visual reference is `docs/design/direction-a-mock.html`, plus the canvas at https://claude.ai/artifact/Pq1uY2UHPbvbvs1hmnR2Xx. Read the spec section each task cites before starting it.

## How this plan is worked (learning split, spec §11)

**Harshit writes each task by default.** Before each task, Claude:
1. explains the concepts listed in its **Learn** line,
2. points at the interfaces and tests,
3. reviews the finished code and gives hints, not answers.

Harshit may hand any task to Claude. Claude then writes the code with comments that teach the why, and Harshit reviews it.

**Tests come first in every task.** They are the acceptance check. Harshit runs them, and Claude reviews the diff.

The site launches **once, at the end** (Task 16). Before that, Vercel shows only preview deployments.

## Global Constraints

- **Only theme:** Night. Tokens are exactly as in spec §6:

  | Token | Value |
  |---|---|
  | `--bg` | `#0E0E0E` + `radial-gradient(1000px 700px at 85% -10%, #161C26 0%, rgba(22,28,38,0) 62%)` |
  | `--solid` | `#0E0E0E` |
  | `--ink` | `#ECEAE6` |
  | `--muted` | `#A6A6A8` |
  | `--rule` | `rgba(236,234,230,0.12)` |
  | `--rule-strong` | `rgba(236,234,230,0.28)` |
  | `--surface` | `#141516` |
  | `--surface2` | `#1B1C1E` |
  | `--accent` | `#9CC2FF` |
  | `--on-accent` | `#08111F` |
  | `--live` | `#2F7D4F` |

- **Fonts, via `next/font/google` only:**
  - Newsreader: 400, 500, and italic 400
  - Inter: 400, 500, 600
  - JetBrains Mono: 400, 500
- **Easing:** `cubic-bezier(0.16,1,0.3,1)` everywhere. The loader curtain alone uses `cubic-bezier(0.76,0,0.24,1)`.
- **Banned:**
  - eyebrow labels above headings
  - numbered sections
  - hero-metric rows
  - gradient text
  - orange or neon accents
  - unicode-glyph icons (use inline SVG)
- **No invented facts:** every claim comes from the spec or the résumé. Unknown content stays as a visible `[bracketed placeholder]`.
- **Reduced motion:** every animation has a `prefers-reduced-motion: reduce` path. In it, the loader, cursor, smooth scroll and glitch are all off, and the flow-field draws one static frame.
- **Accessibility:** WCAG 2.2 AA contrast, visible `:focus-visible` outline in the accent, and touch targets ≥ 44 px.
- **Performance:**
  - LCP < 2.5 s, CLS < 0.05, INP < 200 ms on a mid-range phone
  - home page JS ≲ 150 KB gzipped
  - rAF loops run only while something moves, and pause when offscreen or the tab is hidden
- **Phone layout:** no horizontal scroll at 360 px, with a 16 px side gutter.
- **Dependencies:** npm project dependencies only. No global installs. Downloading Playwright's Chromium needs Harshit's OK first.
- **Secrets:** Vercel env vars only (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, `NEXT_PUBLIC_SITE_URL`). Never committed.
- **Commits:** small, one per task step group, ending with the attribution line.

## Review Focus

Most likely to bite first. Each line's test lives in the named task.

1. **Bad or missing `?track=` value** (`?track=foo`, `?track=`, or repeated params): treat it as `all`, never crash, and keep the URL clean. Tested in Task 3.
2. **Spotify down, rate-limited, returning 204, or env vars missing:** `/api/spotify` still returns 200 with `{ mode: "fallback" }`, and the card shows only the playlist link. Tested in Task 14.
3. **Long words in narrow boxes** ("Selected" and "Finalist" tiles, long skill notes, the email address at 360 px): no horizontal overflow at 360, 768, 1280 or 1440 px. Tested in Task 5 and Task 15.
4. **JavaScript disabled or slow:** hero text and all section content are in the server HTML, and the loader never hides content without JS. Tested in Task 10.
5. **Project with no public link** (EagleEye, job-hunt, or a null `live`): the button is not rendered at all. There is no dead `#` link. Tested in Task 2 and Task 5.

---

## File Structure

```
app/
  layout.tsx            fonts, <html>, providers, grain, cursor, progress bar
  page.tsx              home: composes sections in spec §7 order
  globals.css           tokens (@theme), base, motion keyframes, reduced-motion overrides
  work/[slug]/page.tsx  case study
  writing/page.tsx      poems
  not-found.tsx
  api/spotify/route.ts
  sitemap.ts  robots.ts  opengraph-image.tsx
components/
  sections/  Header Hero Marquee Experience SelectedWork InTheWorks Recognition Toolkit OffTheClock Resume Contact
  track/     TrackProvider.tsx  TrackFilter.tsx
  ui/        LinkButton.tsx  Chip.tsx  Steps.tsx  CopyButton.tsx  EagleEyeDiagram.tsx
  motion/    Intro.tsx  FlowField.tsx  Grain.tsx  Cursor.tsx  SmoothScroll.tsx  Glitch.tsx  Reveal.tsx  Magnetic.tsx
  SpotifyCard.tsx
lib/
  track.ts      pure track helpers
  content.ts    load and validate MDX and data
  schemas.ts    zod schemas and inferred types
  spotify.ts    Spotify API client
  field.ts      flow-field maths (pure)
  intro.ts      loader and glitch timing (pure)
data/  site.ts  experience.ts  awards.ts  skills.ts  wip.ts
content/  projects/*.mdx  poems/*.mdx
public/resume/  general.pdf  web-dev.pdf  ai-ml.pdf
tests/  unit/*.test.ts(x)   e2e/*.spec.ts
docs/  spotify-setup.md
```

---

### Task 1: Scaffold, tokens, fonts, test harness, Vercel preview

**Learn:** what App Router, server components and client components are; Tailwind 4 `@theme` tokens; how `next/font` avoids layout shift; Vitest versus Playwright.

**Files:**
- Create: the project via `npx create-next-app@latest . --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*"`, run inside `~/Desktop/portfolio`. Keep the existing `docs/`.
- Create: `app/globals.css` with the tokens, `app/layout.tsx`, `vitest.config.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/home.spec.ts`
- Modify: `package.json` scripts: `test` → `vitest run`, `e2e` → `playwright test`

**Interfaces:**
- Produces:
  - CSS variables for every token in Global Constraints, exposed as Tailwind colours: `bg-surface`, `text-muted`, `border-rule`, `text-accent`, …
  - Font variables `--font-serif`, `--font-sans`, `--font-mono`
  - Playwright `baseURL` `http://localhost:3000`, with a `webServer` that runs `npm run dev`

- [ ] **Step 1:** Scaffold. Install the dev dependencies: `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test @axe-core/playwright`. Ask Harshit before running `npx playwright install chromium`.
- [ ] **Step 2: Write the failing e2e test** `home has title and dark ground`:

  ```ts
  await page.goto('/');
  await expect(page).toHaveTitle(/Harshit Arora/);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(14, 14, 14)');
  ```

- [ ] **Step 3:** Run `npm run e2e`. Expected: FAIL. The title is "Create Next App".
- [ ] **Step 4:** Implement the tokens, fonts and metadata (`title: "Harshit Arora — Full-stack & AI/ML engineer"`). Give `body` the bg gradient and `--ink` text. Add the `:focus-visible` outline and `::selection` in the accent.
- [ ] **Step 5:** Run `npm run e2e && npm test`. Expected: PASS.
- [ ] **Step 6:** Set up GitHub and Vercel. Harshit creates the GitHub repo `Harshit24401/portfolio` (private until launch) and connects it to Vercel. Production stays unannounced until Task 16.
- [ ] **Step 7:** Commit with `chore: scaffold Next.js app with Night tokens and test harness`.

---

### Task 2: Content model and loaders

**Learn:** frontmatter, zod as a runtime type check, why invalid content should fail the build.

**Files:**
- Create: `lib/schemas.ts`, `lib/content.ts`
- Create: `data/site.ts`, `data/experience.ts`, `data/awards.ts`, `data/skills.ts`, `data/wip.ts`
- Create: `content/projects/{eagleeye,face-sort,peercall}.mdx`, `content/poems/placeholder.mdx`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces, from `lib/schemas.ts`:

  ```ts
  type Track = 'fs' | 'ml';
  type TrackFilterValue = 'all' | Track;
  type Links = { live: string | null; github: string | null };
  type Project = { slug: string; title: string; org: string; year: string;
    tracks: Track[]; summary: string; stack: string[]; links: Links;
    featured: boolean; privateNote: string | null };
  type Milestone = { label: string; state: 'done' | 'now' | 'todo' };
  type Wip = { id: string; title: string; tracks: Track[]; status: 'building' | 'next';
    summary: string; stack: string[]; milestones: Milestone[]; link: string | null; size: 'lg' | 'sm' };
  type Poem = { slug: string; title: string; excerpt: [string, string]; order: number };
  type Skill = { name: string; tracks: Track[]; where: string };
  type SkillGroup = { title: string; skills: Skill[] };
  type Award = { rank: string; title: string; detail: string; lead?: boolean };
  type Job = { org: string; role: string; dates: string; place: string; bullets: string[]; tags: string[] };
  ```

  `tracks: []` means "core to both tracks".

- Produces, from `lib/content.ts`:
  - `getProjects(): Promise<Project[]>`, sorted with featured first
  - `getProject(slug: string): Promise<{ meta: Project; body: string } | null>`
  - `getPoems(): Promise<Poem[]>`, sorted by `order`
  - `getPoem(slug): Promise<{ meta: Poem; body: string } | null>`
- Produces, from `data/site.ts`: `site = { name, email: 'harshit24401@gmail.com', availability: 'Open to 6-month internships, Jan–Jun 2027', marquee: string[], socials: { github, linkedin }, spotifyPlaylist: string | null, resumeUpdated: 'Nov 2026', url }`
- **Content values:** copy them verbatim from spec §7.4–7.11 and §8:
  - EagleEye: `links { live: null, github: null }`, `privateNote: "Internal to Optum, so the code is private."`
  - PeerCall: `live: "https://video-chat-ruddy-kappa.vercel.app"`. Repo URL left `null` until Harshit confirms it.

- [ ] **Step 1: Write failing tests**:

  ```ts
  test('every project validates and slugs are unique', async () => {
    const ps = await getProjects();
    expect(ps.map(p => p.slug).sort()).toEqual(['eagleeye', 'face-sort', 'peercall']);
  });
  test('featured project comes first', async () => {
    expect((await getProjects())[0].slug).toBe('eagleeye');
  });
  test('unknown slug returns null', async () => {
    expect(await getProject('nope')).toBeNull();
  });
  test('invalid frontmatter throws with the file name', () => {
    expect(() => parseProject('bad.mdx', '---\ntitle: 1\n---')).toThrow(/bad\.mdx/);
  });
  test('private project has no links and a note', async () => {
    const e = (await getProjects()).find(p => p.slug === 'eagleeye')!;
    expect(e.links).toEqual({ live: null, github: null });
    expect(e.privateNote).toMatch(/private/);
  });
  ```

- [ ] **Step 2:** Run `npx vitest run tests/unit/content.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3:** Implement the schemas, data files and loaders. Also export `parseProject(file: string, raw: string): { meta: Project; body: string }`. Use `gray-matter` and `ProjectSchema.parse`, and wrap errors with the file name.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: typed content model with validated MDX loaders`.

---

### Task 3: Shared track state and filter control

**Learn:** URL as state, `useSearchParams`, React context, `aria-pressed` segmented controls, transform-based sliding indicators.

**Files:**
- Create: `lib/track.ts`, `components/track/TrackProvider.tsx`, `components/track/TrackFilter.tsx`
- Test: `tests/unit/track.test.ts`, `tests/unit/TrackFilter.test.tsx`, `tests/e2e/track.spec.ts`

**Interfaces:**
- Produces, from `lib/track.ts`:
  - `parseTrack(v: string | string[] | null | undefined): TrackFilterValue`
  - `matchesTrack(tracks: Track[], t: TrackFilterValue): boolean`. True if `t === 'all'`, or `tracks` is empty, or `tracks` includes `t`.
  - `resumeFor(t: TrackFilterValue): { file: string; label: string }`:

    | Track | file | label |
    |---|---|---|
    | `all` | `/resume/general.pdf` | `general` |
    | `fs` | `/resume/web-dev.pdf` | `full-stack` |
    | `ml` | `/resume/ai-ml.pdf` | `AI/ML` |

  - `TRACK_OPTIONS = [{ id: 'all', label: 'All' }, { id: 'fs', label: 'Full-stack' }, { id: 'ml', label: 'AI / ML' }] as const`
- Produces:
  - `<TrackProvider>`, which wraps the home page
  - `useTrack(): { track: TrackFilterValue; setTrack(t: TrackFilterValue): void }`. `setTrack` uses `router.replace` with `scroll: false`. It removes the param for `all` and sets `?track=fs|ml` otherwise.
  - `<TrackFilter label: string />`, where `label` is the group's `aria-label`. It renders 3 buttons. The indicator is `translateX(index * 100%)`, and the pill width fits 360 px screens.

- [ ] **Step 1: Write failing unit tests:**
  - `parseTrack('foo')` → `'all'`
  - `parseTrack('')` → `'all'`
  - `parseTrack(['ml', 'fs'])` → `'ml'` (first wins)
  - `parseTrack('ML')` → `'all'` (case-sensitive)
  - `matchesTrack([], 'ml')` → `true`
  - `matchesTrack(['fs'], 'ml')` → `false`
  - `resumeFor('fs').file` → `'/resume/web-dev.pdf'`
- [ ] **Step 2: Write a failing component test:** clicking "AI / ML" sets `aria-pressed="true"` on that button only.
- [ ] **Step 3: Write a failing e2e test** `?track=foo renders All selected and no error`. Also: clicking "Full-stack" in one filter updates the URL to `?track=fs` and every other `TrackFilter` on the page shows it as pressed.
- [ ] **Step 4:** Run the tests. Expected: FAIL.
- [ ] **Step 5:** Implement. Wrap the provider in `<Suspense>` as Next requires when using `useSearchParams`.
- [ ] **Step 6:** Run the tests. Expected: PASS.
- [ ] **Step 7:** Commit with `feat: URL-backed shared track filter`.

---

### Task 4: Header, Hero, Marquee, Experience (static)

**Learn:** semantic sections and landmarks, `clamp()` for fluid type, flex-wrap layouts, why hero text must be server-rendered.

**Files:**
- Create: `components/sections/{Header,Hero,Marquee,Experience}.tsx`, `components/ui/{LinkButton,Chip}.tsx`
- Modify: `app/page.tsx`
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `site` and `experience` from Task 2.
- Produces:
  - `<LinkButton href variant: 'main' | 'line' external?: boolean>`. External links open in a new tab with `rel="noopener"` and show the ↗ SVG.
  - `<Chip track: Track />`. Its dot is accent for `ml` and ink for `fs`.
- **Copy:** use the hero copy exactly as in the mock (`docs/design/direction-a-mock.html`):
  - Headline spans in this order: "I build products" / "end to end —" / "from the model" / "to the button."
  - Wrap each glitchable word (build, products, end, end, model, button.) in a `<span data-w>`, ready for Task 12.
  - Nav: Experience, Work, Writing, Résumé, Contact.

- [ ] **Step 1: Write failing e2e tests:**
  - `h1` has text "I build products end to end — from the model to the button."
  - every nav link's `href` target id exists on the page
  - the Experience section lists "Optum" and "CoE-DSAI, Thapar" with their dates
  - the marquee track contains each `site.marquee` item, and the duplicate copy is `aria-hidden`
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement the sections from the mock with no motion. The marquee track is duplicated twice for the later loop.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: header, hero, marquee and experience sections`.

---

### Task 5: Selected work, In the works, Recognition

**Learn:** mapping data to components, conditional rendering, CSS grid `auto-fit` with `minmax(min(Xpx,100%),1fr)`, `overflow-wrap`.

**Files:**
- Create: `components/sections/{SelectedWork,InTheWorks,Recognition}.tsx`, `components/ui/{Steps,EagleEyeDiagram}.tsx`
- Test: `tests/e2e/work.spec.ts`, `tests/unit/Steps.test.tsx`

**Interfaces:**
- Consumes:
  - `getProjects()` and `wip` from Task 2
  - `useTrack()`, `matchesTrack()` and `<TrackFilter>` from Task 3
  - `<LinkButton>` and `<Chip>` from Task 4
- Produces:
  - `<Steps milestones: Milestone[] />`, rendered as an `<ol>` with `li[data-state]`
  - The dim state is the class `is-dim`: `opacity: .28; filter: grayscale(1) blur(1.5px); pointer-events: none`. Do not add `aria-hidden`; dimmed cards stay readable to screen readers.

- [ ] **Step 1: Write failing tests:**
  - With `?track=fs`, the EagleEye card has class `is-dim`, while the face-sort and PeerCall cards do not.
  - EagleEye renders no `a` with the text "GitHub" or "Live demo", and shows its `privateNote`.
  - Projects with `links.live === null` render no "Live demo" link.
  - The "Everything else is on GitHub" link points to `site.socials.github`.
  - `<Steps>` renders one `li[data-state="now"]` for the job-hunt card, and that card has no GitHub link while `link` is `null`.
  - **Overflow test:** at viewport widths 360, 768, 1280 and 1440, every `.award` tile satisfies `scrollWidth <= clientWidth`. Same for `document.documentElement`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. Award rank size `clamp(34px, 2.9vw, 42px)` and lead rank `clamp(88px, 12vw, 168px)`, per spec §7.8. The EagleEye diagram is static markup for now; it gets its loop in Task 9.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: selected work, in-the-works and recognition`.

---

### Task 6: Toolkit, Off the clock, Résumé, Contact

**Learn:** the Clipboard API and its failure modes, `aria-live`, `mailto:`, `download` attributes.

**Files:**
- Create: `components/sections/{Toolkit,OffTheClock,Resume,Contact}.tsx`, `components/ui/CopyButton.tsx`
- Create: `public/resume/{general,web-dev,ai-ml}.pdf`, copied from `~/Desktop/job-search-automation/resume/`. Harshit confirms they're current.
- Test: `tests/unit/CopyButton.test.tsx`, `tests/e2e/resume-contact.spec.ts`

**Interfaces:**
- Consumes: `skills`, `getPoems()`, `site`, `resumeFor()`, `<TrackFilter>`.
- Produces: `<CopyButton text: string />`.
  - Label: "Copy address".
  - It changes to "Copied" for 1800 ms on success.
  - On failure it stays unchanged and the visible mailto link is still the fallback.
  - The label lives in an `aria-live="polite"` region.
- The Spotify slot in Off the clock renders `<SpotifyCard />` from Task 14. Until then, it is a static placeholder card.

- [ ] **Step 1: Write failing tests:**
  - **CopyButton:** with `navigator.clipboard.writeText` mocked to resolve, the label becomes "Copied" and reverts after 1800 ms (fake timers). With it mocked to reject, the label stays "Copy address".
  - **e2e:** with `?track=ml`, the download link `href` is `/resume/ai-ml.pdf` and its text contains "AI/ML".
  - **e2e:** the "View in browser" link has the same `href`, with `target="_blank"`.
  - **e2e:** the hero shows the availability line `site.availability` next to its live dot.
  - **e2e:** the Toolkit row "Express" has class `is-off` under `?track=ml`.
  - **e2e:** the contact email link is `mailto:harshit24401@gmail.com` and its computed font-size is ≤ 23 px at 1440.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: toolkit, off-the-clock, résumé picker and contact`.

---

### Task 7: Case study, writing and 404 pages

**Learn:** dynamic routes, `generateStaticParams`, `notFound()`, rendering MDX on the server.

**Files:**
- Create: `app/work/[slug]/page.tsx`, `app/writing/page.tsx`, `app/not-found.tsx`
- Modify: `content/projects/*.mdx`. Give each body the spec §7.15 headings with bracketed prompts:
  - Problem / context
  - What I built
  - How it works
  - Results or aim
  - What I'd do next
  - Links
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `getProject`, `getProjects`, `getPoems`, `getPoem`, `<LinkButton>`, `<Chip>`.
- Produces:
  - static routes for 3 case studies
  - `/writing`, where each poem has `id={slug}` so it can be linked as `/writing#slug`

- [ ] **Step 1: Write failing tests:**
  - `/work/face-sort` shows an `h1` "face-sort" and the six section headings
  - `/work/nope` returns status 404 and shows the styled not-found page
  - `/writing` lists every poem title
  - the home page "Read … and three more" link resolves to `/writing`
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. Use `generateStaticParams` and `dynamicParams = false`.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: case study, writing and 404 pages`.

---

### Task 8: SEO and sharing

**Learn:** the Metadata API, Open Graph, JSON-LD, sitemaps.

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/work/[slug]/opengraph-image.tsx`
- Modify: `app/layout.tsx` (metadataBase from `NEXT_PUBLIC_SITE_URL`, JSON-LD)
- Test: `tests/e2e/seo.spec.ts`

- [ ] **Step 1: Write failing tests:**
  - `/sitemap.xml` contains `/`, `/writing` and the 3 `/work/*` URLs
  - the home page has `og:image`
  - the home page's JSON-LD `Person` has `sameAs` containing the GitHub and LinkedIn URLs from `site.socials`
  - each case study has its own `<title>` containing the project title
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. The OG images are generated with `next/og` in Night colours and the Newsreader title.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: metadata, OG images, sitemap and JSON-LD`.

---

### Task 9: CSS motion layer

**Learn:**
- keyframes versus transitions
- `clip-path` reveals
- scroll-driven animations (`animation-timeline: view()` / `scroll()`) with `@supports`
- an IntersectionObserver fallback
- reduced-motion overrides

**Files:**
- Modify: `app/globals.css`, adding these keyframes:
  - `rise`, `focusin`, `draw`, `revealup`, `marquee`, `rankin`, `inkline`
  - the EagleEye loop: `lit1`, `lit2`, `sig1`, `sig2`, `verdict`
  - `pulse`, `nowring`, and progress `grow`
- Create: `components/motion/Reveal.tsx`, `app/ScrollProgress.tsx`
- Test: `tests/e2e/motion.spec.ts`

**Interfaces:**
- Produces:
  - `<Reveal as? className?>`. It adds `.reveal`. Where `CSS.supports('animation-timeline: view()')` is false, it toggles `.is-in` through an IntersectionObserver (threshold 0.15) instead.
  - Hero elements get their delays from CSS variables: `--d: 0ms` and up, offset by `--intro-offset`. The offset is `1300ms` when the loader plays and `0ms` otherwise. Task 10 sets it on `<html>`.
- **Values:** copy the timings from the mock:
  - rise 1000 ms
  - line delays 80, 170, 260 and 350 ms, plus the offset
  - ink underline 900 ms at 1150 ms, plus the offset
  - marquee 52 s linear, paused on hover
  - EagleEye loop 6 s

- [ ] **Step 1: Write failing tests:**
  - With `page.emulateMedia({ reducedMotion: 'reduce' })`, `.rise > span`, `.marquee-track` and `.reveal` have computed `animation-name: none`. All text is visible: opacity 1.
  - Without reduced motion, `.marquee-track` animation-name is `marquee`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: CSS motion layer with reduced-motion paths`.

---

### Task 10: Landing loader

**Learn:** sessionStorage, hydration-safe client effects, and why the loader must sit *over* server-rendered content instead of replacing it.

**Files:**
- Create: `lib/intro.ts`, `components/motion/Intro.tsx`
- Test: `tests/unit/intro.test.ts`, `tests/e2e/intro.spec.ts`

**Interfaces:**
- Produces:
  - `shouldPlayIntro(storage: Pick<Storage,'getItem'> | null, reduced: boolean): boolean`. Returns false if `reduced`, if storage is null, or if storage throws. Otherwise it returns true only when `getItem('intro-seen') !== '1'`.
  - `INTRO = { countMs: 1100, curtainMs: 950, heroOffsetMs: 1300 }`
  - `<Intro>` renders inside the hero wrapper as `position: absolute`:
    - "Harshit Arora" rises in
    - a hairline fills while a counter runs `000`–`100` with ease-out-cubic
    - then the curtain lifts: `clip-path: inset(0 0 100% 0)`
    - it sets `sessionStorage['intro-seen']='1'` and the `--intro-offset` on `<html>`
- **No-JS rule:** the overlay is not in the server HTML. It mounts only on the client. A tiny inline script in `<head>` sets `data-intro="1"` on `<html>` before paint when the intro will play, which keeps the hero from flashing. With JS off, nothing covers content.

- [ ] **Step 1: Write failing unit tests:**
  - `shouldPlayIntro({getItem: () => null}, false)` → `true`
  - `shouldPlayIntro({getItem: () => '1'}, false)` → `false`
  - `shouldPlayIntro(storage, true)` → `false`
  - a storage whose `getItem` throws → `false`
- [ ] **Step 2: Write failing e2e tests:**
  - The first visit shows `.intro`, which is gone within 3 s. After a reload in the same context, `.intro` never appears.
  - With reduced motion, `.intro` never appears.
  - With `javaScriptEnabled: false`, the `h1` text is visible and `.intro` is absent.
- [ ] **Step 3:** Run them. Expected: FAIL.
- [ ] **Step 4:** Implement.
- [ ] **Step 5:** Run them. Expected: PASS.
- [ ] **Step 6:** Commit with `feat: once-per-session landing loader`.

---

### Task 11: Grain and flow-field canvases

**Learn:**
- the Canvas 2D API
- devicePixelRatio
- requestAnimationFrame loops and pausing them
- compositing (`destination-out`)
- vector fields from sin/cos: the maths Harshit likes

**Files:**
- Create: `lib/field.ts`, `components/motion/{Grain,FlowField}.tsx`
- Test: `tests/unit/field.test.ts`, `tests/e2e/canvas.spec.ts`

**Interfaces:**
- Produces, from `lib/field.ts` (all pure functions):
  - `fieldAngle(x: number, y: number, t: number): number`, using the mock's formula exactly:

    ```ts
    Math.sin(x*0.0019+t)*Math.cos(y*0.0023-t*1.3)*Math.PI*2 + Math.sin((x+y)*0.0008+t*0.7)
    ```

  - `swirl(dx: number, dy: number, radius = 200): { vx: number; vy: number; stir: number }`. Returns zeros outside the radius. Inside, `f = (1-d/r)*2.6`, the tangential plus 0.3 × radial push from the mock.
  - `particleCount(w: number, h: number, phone: boolean): number`, which is `min(1100, w*h/1000)`, × 0.4 on phones, rounded.
  - `strandAlpha(x, w, age, life, stir): number`, per the mock.
- Produces: `<FlowField />`, placed in the hero wrapper, and `<Grain />`, fixed and full-viewport, built from a 128 px noise tile with alpha 14 in soft-light blend.

- [ ] **Step 1: Write failing unit tests:**
  - `particleCount(1440, 900, false)` → `1100`
  - `particleCount(375, 812, true)` → `122`
  - `swirl(300, 0)` → `{ vx: 0, vy: 0, stir: 0 }`
  - `swirl(100, 0).stir` → `0.5`
  - `fieldAngle(0, 0, 0)` → `0`
- [ ] **Step 2: Write a failing e2e test:** under reduced motion, the canvas exists, has non-zero size, and no rAF keeps running. Count the frames drawn via an `window.__fieldFrames` counter exposed only when `process.env.NODE_ENV !== 'production'`: it stays ≤ 1 after 500 ms.
- [ ] **Step 3:** Run them. Expected: FAIL.
- [ ] **Step 4:** Implement. Pause on `IntersectionObserver` not intersecting and on `document.hidden`. Resize with the dpr capped at 2.
- [ ] **Step 5:** Run them. Expected: PASS.
- [ ] **Step 6:** Commit with `feat: grain and ink flow-field canvases`.

---

### Task 12: Cursor, magnetic button, headline glitch

**Learn:** pointer media queries, lerp smoothing, event delegation, writing transforms directly to the DOM instead of through React state.

**Files:**
- Create: `components/motion/{Cursor,Magnetic,Glitch}.tsx`; add `glitchSchedule` to `lib/intro.ts`
- Test: `tests/unit/glitch.test.ts`, `tests/e2e/cursor.spec.ts`

**Interfaces:**
- **Cursor:** a 6 px dot, plus a 34 px ring that lerps toward the pointer at 0.18.
  - The ring gets `is-big` (64 px, accent tint) over `a, button, .card, .award, .panel`, and `is-down` (22 px) while pressed.
  - The spark trail on a fixed canvas: at most 48 points, each losing 0.035 life per frame.
  - `<html class="has-cursor">` hides the native cursor, and is set only when `(pointer: fine)` matches and reduced motion is off.
- **Magnetic:** `<Magnetic strength={{x: 0.22, y: 0.32}}>` wraps the hero résumé button. It is off on touch and under reduced motion.
- **Glitch:**
  - `glitchSchedule(rand: () => number): number[]` returns 2 or 3 delays in ms. The first is ≥ 1800 ms (after the curtain), and later ones are 2500–4500 ms apart.
  - `<Glitch>` applies `.glitch` for 420 ms to a random `[data-w]` word at each delay, then stops.
  - Hover glitch is CSS only.

- [ ] **Step 1: Write failing unit tests:**
  - `glitchSchedule(() => 0)` has length 2, its first value ≥ 1800, and its gaps lie within [2500, 4500]
  - `glitchSchedule(() => 0.99)` has length 3
- [ ] **Step 2: Write failing e2e tests:**
  - On the default desktop context, `<html>` has `has-cursor`.
  - In a context with `hasTouch: true` and `isMobile: true`, it does not.
  - Under reduced motion, it does not.
  - After 15 s, no `[data-w].glitch` appears once the schedule has finished.
- [ ] **Step 3:** Run them. Expected: FAIL.
- [ ] **Step 4:** Implement. Run one rAF loop only while the ring is still settling or sparks are alive.
- [ ] **Step 5:** Run them. Expected: PASS.
- [ ] **Step 6:** Commit with `feat: custom cursor, magnetic button, bounded headline glitch`.

---

### Task 13: Smooth scroll

**Learn:** what Lenis does, why a library beats hand-rolled wheel hijacking, and anchor-link integration.

**Files:**
- Create: `components/motion/SmoothScroll.tsx`
- Test: `tests/e2e/scroll.spec.ts`

**Interfaces:**
- Produces: `<SmoothScroll>`, mounted in the layout.
  - It creates a `Lenis` instance (`lerp: 0.1`, `anchors: { offset: -12 }`) only when `(pointer: fine)` matches and reduced motion is off.
  - It destroys the instance on unmount.
  - Touch keeps native scrolling.

- [ ] **Step 1: Write failing e2e tests:**
  - Clicking the nav "Experience" link ends with `#experience` within 40 px of the viewport top after 1.5 s.
  - Under reduced motion, `<html>` lacks the `lenis` class.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: Lenis smooth scroll`.

---

### Task 14: Spotify route and card

**Learn:** the OAuth refresh-token flow, server-only secrets, `fetch` caching (`next: { revalidate: 60 }`), and designing for failure.

**Files:**
- Create: `lib/spotify.ts`, `app/api/spotify/route.ts`, `components/SpotifyCard.tsx`, `docs/spotify-setup.md`
- Test: `tests/unit/spotify.test.ts`

**Interfaces:**
- Produces, from `lib/spotify.ts`:
  - `getAccessToken(): Promise<string>`
  - `getNowPlaying(token)`
  - `getRecentlyPlayed(token)`
  - `getTopTracks(token, limit = 3)`
  - `type SpotifyTrack = { title: string; artist: string; cover: string | null; url: string }`
- Produces: `GET /api/spotify`, which **always returns 200** with:

  ```ts
  type SpotifyPayload =
    | { mode: 'playing' | 'last'; track: SpotifyTrack; top: SpotifyTrack[]; playlist: string | null }
    | { mode: 'fallback'; playlist: string | null };
  ```

  Set `Cache-Control: s-maxage=60, stale-while-revalidate=300`.
- Produces: `<SpotifyCard>`, a client fetch on mount.
  - It shows "Now playing" with the equaliser for `playing`, and "Last played" without it for `last`.
  - For `fallback`, only the playlist link renders. If `playlist` is also null, the card is not rendered at all.
- **Scopes:** `user-read-currently-playing user-read-recently-played user-top-read`. `docs/spotify-setup.md` walks Harshit through creating the app and getting the refresh token.

- [ ] **Step 1: Write failing unit tests**, with `fetch` mocked, against the route handler:
  - env vars missing → `{ mode: 'fallback' }`, status 200
  - token endpoint returns 400 → fallback, 200
  - currently-playing returns 204 → `mode: 'last'` from recently-played
  - currently-playing returns 200 with `is_playing: true` → `mode: 'playing'` with the mapped title, artist and cover
  - top-tracks returns 429 → still `playing` or `last`, with `top: []`
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. Map external JSON defensively; any thrown error becomes fallback.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Harshit does the setup steps in `docs/spotify-setup.md` and adds the env vars to Vercel.
- [ ] **Step 6:** Commit with `feat: resilient Spotify now-playing route and card`.

---

### Task 15: Phone layout and quality gate

**Learn:** responsive auditing, axe accessibility checks, Lighthouse, and keyboard testing.

**Files:**
- Modify: section components and `globals.css` as needed
- Test: `tests/e2e/quality.spec.ts`

- [ ] **Step 1: Write failing or new tests:**
  - For `/`, `/work/eagleeye` and `/writing`, at widths 360, 768, 1280 and 1440: `document.documentElement.scrollWidth <= innerWidth`.
  - `@axe-core/playwright` reports no serious or critical violations on each page.
  - Tabbing from the top of `/` reaches, in order: the nav links, then "Download résumé", then "Email me", then the first TrackFilter button.
  - The TrackFilter group is ≤ 360 − 32 px wide at 360.
- [ ] **Step 2:** Run them. Fix the failures: the phone nav, pill widths, gutters, and the flow-field particle count already set in Task 11.
- [ ] **Step 3:** Harshit runs Lighthouse (mobile) in Chrome DevTools on the Vercel preview and records the scores in the PR. Target: performance ≥ 90, and accessibility, best practices and SEO ≥ 95. Fix anything below target.
- [ ] **Step 4:** Do the manual checks:
  - turn on reduced motion and scroll the whole site
  - turn off JS and confirm the content is readable
- [ ] **Step 5:** Commit with `fix: phone layout and quality gate`.

---

### Task 16: Real content and launch

**Files:**
- Modify: `data/site.ts`, `content/**`, `data/wip.ts`

- [ ] **Step 1:** Replace the bracketed placeholders with Harshit's content:
  - the poems and their titles
  - the Spotify playlist
  - the "Up next" project
  - the confirmed live and GitHub links
  - the case study text
  - the domain
- [ ] **Step 2:** Add a guard test that fails the build if any placeholder remains in content or data: `rg '\[[A-Z][^\]]*\]' content data` must find nothing. Wire it as `npm run check:placeholders` in CI.
- [ ] **Step 3:** Run `npm test && npm run e2e && npm run check:placeholders`. Expected: all PASS.
- [ ] **Step 4:** Make the repo public if Harshit wants. Point the domain at Vercel and promote to production.
- [ ] **Step 5:** Commit with `chore: launch content` and tag `v1.0.0`.
