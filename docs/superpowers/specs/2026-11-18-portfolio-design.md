# Portfolio site: design

Date: 2026-11-18
Owner: Harshit Arora
Status: draft, awaiting approval

## 1. Intent and why

Harshit is a final-year Computer Engineering student at Thapar Institute, graduating in May 2027. He is job hunting for:

- six-month internships from January to June 2027, or
- permanent roles at 20 LPA take-home or more,

in two tracks: **full-stack** and **AI/ML**.

The site exists to get a recruiter from "who is this?" to "download the résumé / send an email" quickly. It should be convincing on both tracks without looking like two different people.

The quality bar is www.armansaini.me: dark, alive, animated and personal, without being noisy. Borrow its patterns (custom cursor, smooth scroll, marquee, film grain, strong typography), not its look or content.

Harshit also wants to learn web development by building this (see section 11). The site is a learning project as much as a deliverable.

## 2. Audience and success

- **Primary audience:** recruiters and hiring engineers, mostly on desktop, often arriving from a résumé link or a cold email. Phone visits are common enough that the phone layout must be good.
- **Success:** a visitor can do each of these within one scroll:
  - tell which tracks he fits
  - see real shipped work with links
  - download the version of the résumé that matches the role
  - copy his email
- **Secondary:** the site itself is evidence of front-end craft (motion, performance, accessibility).

## 3. Goals, non-goals, anti-goals

### Goals

- One site serving both tracks, with a track filter (All / Full-stack / AI/ML). The filter dims irrelevant work and skills and picks the résumé version.
- Projects as short case studies, each with its own page and links (live demo, GitHub).
- An "In the works" section that shows current projects and how far along they are.
- A small personal side: the Literary Society, 3–4 mostly-English poems (an excerpt on the home page, the full poems on /writing), and Spotify.
- Rich but disciplined motion. Every effect has a reduced-motion version.

### Non-goals (v1)

- No CMS and no database. Content lives in files in the repo.
- No blog.
- No light theme. The Night palette is the only theme. The other palettes on the canvas were exploration only.
- No LeetCode or GitHub stats. Both were tried on the canvas and removed at Harshit's request.
- No portrait photo in the hero. Harshit asked for it to be removed.
- No photography gallery.

### Anti-goals

These make the site a failure even if it works.

- **Tacky:**
  - neon or orange accents
  - busy backgrounds that fight the text
  - gradient text
  - glitch effects that never stop
- **Generic template look:**
  - eyebrow labels above headings
  - numbered sections ("05 — …")
  - a big row of hero metrics
- **Invented claims:** every fact must trace to the résumé or to Harshit. Placeholders stay visibly bracketed until he supplies real content.
- **Slow or janky:** animation that drops frames, blocks reading, or ignores `prefers-reduced-motion`.

## 4. Constraints

- **Hosting:** Vercel free tier. The repo is on GitHub under `Harshit24401`.
- **Runtime:** static pages, plus at most one small serverless route (Spotify, section 7.12).
- **Secrets:** environment variables on Vercel. Never committed.
- **Accessibility:** WCAG 2.2 AA contrast, full keyboard use, visible focus, and reduced-motion paths for every animation.
- **Performance budget, on a mid-range phone over 4G:**
  - LCP under 2.5 s
  - CLS under 0.05
  - INP under 200 ms
  - home page JavaScript ideally under ~150 KB gzipped
- **Tooling:** no new global tools beyond Node 24 and npm, which are already installed. Project dependencies via npm are fine.

## 5. Approaches considered

| Approach | Trade-offs |
|---|---|
| **A. Next.js (App Router) + TypeScript + Tailwind + MDX, on Vercel** (chosen) | The most common stack in job listings, so learning it also helps the job hunt. File-based routes suit case-study pages. MDX keeps content in files. One serverless route covers Spotify. Heavier than a static generator. React adds JavaScript to the home page. |
| B. Astro + MDX, with React islands for interactive bits | The least JavaScript, so it's the fastest. Content-first and great for MDX. Less useful on a résumé than Next.js, and a second mental model on top of React. |
| C. Vite + React SPA | Simplest to understand. Weak for SEO and link previews without extra work, and no file routes for case studies. |

**Picked: A.** Harshit chose it. It fits the job market he is targeting, and its performance cost is manageable with server components and keeping client components small.

## 6. Visual system

The reference is the Design canvas, "Portfolio Directions", board A ("Editorial"), Night palette: https://claude.ai/artifact/Pq1uY2UHPbvbvs1hmnR2Xx. A copy of the mock's source is in `docs/design/direction-a-mock.html`. It is a design mock in a custom runtime, not code to port line by line.

### Colour tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0E0E0E`, plus a radial glow `#161C26` at the top right | page ground |
| `--solid` | `#0E0E0E` | text on ink buttons; loader background |
| `--ink` | `#ECEAE6` | primary text, solid buttons |
| `--muted` | `#A6A6A8` | secondary text |
| `--rule` | `rgba(236,234,230,0.12)` | hairlines |
| `--rule-strong` | `rgba(236,234,230,0.28)` | stronger borders |
| `--surface` | `#141516` | cards |
| `--surface2` | `#1B1C1E` | placeholders, nested surfaces |
| `--accent` | `#9CC2FF` (light sky blue) | italic emphasis, links, active states, flow-field near the cursor |
| `--on-accent` | `#08111F` | text on accent fills |
| Live dot | `#2F7D4F` | "available" and "building now" pulses |

Check every text pairing for AA contrast. In particular, check `--muted` on `--surface`.

### Type

Load all three with `next/font/google`:

| Family | Use | Weights |
|---|---|---|
| Newsreader | display and headings | 400 and 500, plus italic 400 |
| Inter | body text and UI | 400, 500 and 600 |
| JetBrains Mono | dates, tags, counters | 400 and 500 |

Headings are large and set tight (`-0.015em` to `-0.03em`). Italic accent-coloured phrases carry the emphasis, as in "from the model / to the button."

### Texture and motion language

- **Grain:** a film-grain overlay from a 128 px noise tile drawn on a canvas. It is fixed, ignores pointer events, and uses soft-light blending at low opacity.
- **Easing:** one curve everywhere, `cubic-bezier(0.16, 1, 0.3, 1)`. The loader curtain uses `cubic-bezier(0.76, 0, 0.24, 1)`.
- **Reveals:** lines rise out of a mask, blocks fade up about 30 px, and accent rules draw in from the left.

## 7. Page structure and behaviour

### Routes

| Route | Content |
|---|---|
| `/` | home, with every section below |
| `/work/[slug]` | case studies: `eagleeye`, `face-sort`, `peercall` |
| `/writing` | all poems; each poem also gets an anchor or its own page (builder's call) |
| `/resume/[variant].pdf` | static PDFs in `public/` |
| `404` | a styled not-found page |

### Home, in order

#### 7.1 Landing loader

- Covers the hero only, not the whole page.
- "Harshit Arora" rises in. A hairline fills with the accent colour while a mono counter runs from 000 to 100 over about 1.1 s.
- The curtain then lifts upward (clip-path, about 950 ms).
- The hero entrances are timed to start under the lifting curtain.
- **Plays once per browser session** (my call): use a sessionStorage flag. Later visits in the same session skip it.
- With reduced motion it never shows.
- It must not hurt LCP. The hero text is in the HTML from the start, and the loader is a decorative layer over it.

#### 7.2 Header

- Contents: the name on the left; nav links to Experience, Work, Writing, Résumé and Contact.
- It is not sticky.

#### 7.3 Hero

- **Headline**, as four lines:
  - "I build products"
  - "end to end —"
  - "*from the model*"
  - "*to the button.*"
  - The last two lines are italic and accent-coloured. An accent underline draws under "the button."
- **Intro paragraph:**
  - Full-stack and AI/ML engineer, final year at Thapar.
  - Optum EagleEye.
  - First in India and Ireland at the interns' Shark Tank.
- **Buttons:**
  - "Download résumé", a magnetic button that pulls toward the cursor. It scrolls to the Résumé block.
  - "Email me".
- **Availability:** a pulsing green dot with "Open to 6-month internships, Jan–Jun 2027".
- **Background:** the ink **flow-field** canvas behind the hero.
  - Strands follow a sin/cos angle field.
  - Within 200 px of the cursor they swirl and turn accent-coloured.
  - Old strokes fade with a destination-out composite.
  - The canvas is transparent and masked to fade out at the bottom.
  - The animation pauses when the hero is offscreen or the tab is hidden.
  - With reduced motion it draws one static frame.
  - On phones, use fewer particles.
- **Headline glitch:** these words have a two-colour slice glitch on hover:
  - build, products, end (both times), model, button.
  - After the loader lifts, 2–3 random words glitch on their own, a few seconds apart. After that, words glitch only on hover. This is Harshit's choice; it avoids a glitch that never ends.
  - The effect lasts 420 ms.
  - Off with reduced motion.

#### 7.4 Marquee

- Sits under the hero, full width, between hairlines.
- Text is italic serif in the muted colour, with accent dots as separators.
- Pauses on hover. Static with reduced motion.
- Items:
  - Open to 6-month internships, Jan–Jun 2027
  - Full-stack
  - AI / ML
  - 1st in India & Ireland, Optum Shark Tank
  - Computer Engineering, Thapar '27
  - LangGraph · FastAPI · WebRTC · ONNX
  - Patiala, Punjab

#### 7.5 Experience

One row per internship. Each row has dates and place in mono, then the company and role, then 2 bullets and tags. On hover an accent rule draws across the top of the row and the company name turns accent.

**Optum: Technology Development Program Intern (UnitedHealth Group)**
- Jun–Aug 2026, Hyderabad.
- Built EagleEye.
- Built monitoring pipelines that compare live metrics with baseline data.

**CoE-DSAI, Thapar: AI/ML Engineering Intern**
- Jul–Nov 2025, remote.
- Served FastAPI microservices with sub-100 ms inference.
- Automated deployments on Linux and Azure.

#### 7.6 Selected work

- **Track filter:** a segmented control (All / Full-stack / AI/ML) with a sliding indicator.
  - The filter state is **shared** across Selected work, In the works, Toolkit and the Résumé picker. Changing it in one place changes all of them.
  - Keep it in the URL (`?track=ml`) so recruiters can share a filtered view (my call).
  - Cards that don't match dim, grey out and blur slightly.
- **EagleEye** feature card (AI/ML):
  - Text: what it is, Built, Aim.
  - An animated diagram on a 6 s loop: change request → match user stories + read GitHub checks → verdict box fills with the accent.
  - Links: "Read the case study", plus the note "Internal to Optum, so the code is private."
- **face-sort** (AI/ML + Full-stack) and **PeerCall** (Full-stack) cards. Each has three links: Case study (primary), Live demo ↗ and GitHub ↗.
- A full-width row, "Everything else is on GitHub →", links to github.com/Harshit24401.

#### 7.7 In the works

Project cards with a status line and a milestone track. Milestones are dots: done = ink, current = accent with a pulsing ring, to-do = hollow.

**Job-hunt autopilot** (large card; AI/ML + Full-stack; "Building now")
- Collects listings and ranks them with BM25, embeddings and rank fusion.
- A local LLM judges the fit.
- It drafts recruiter emails and sends them only after approval.
- Stack: Python, Supabase + pgvector, Ollama, FastAPI.
- Milestones: Collect ✓, Rank ✓, Assess ✓, Draft & send ✓, Read replies (current), Follow-ups, Daily schedule.
- Link: Follow on GitHub.

**This site** (Full-stack; "Building now")
- Milestones: Design ✓, Build (current), Ship.
- Link: Source.

**"Up next"**
- A dashed placeholder card until Harshit names the project.

Milestone state lives in content files, so updating progress is a one-line edit.

#### 7.8 Recognition

- **Lead banner:** a huge accent "1st" with "and 2nd globally". Optum TDP Shark Tank, 2026.
- **Five tiles:**

  | Rank | Award | Detail |
  |---|---|---|
  | Selected | Smart India Hackathon | from 300+ teams, 2024 |
  | 2nd | OWASP TIET | 2024 |
  | Finalist | Makeathon 6.0 | 100+ teams, 2024 |
  | 1st | Literary Feud | 2024 |
  | 2× | Merit Scholarship | 2023–25 |

- The rank words reveal with a clip as they scroll in.
- The rank word size is clamped (34–42 px) so "Selected" and "Finalist" never overflow a tile. This was a bug in the mock.

#### 7.9 Toolkit

- Four columns, each listing skill names with "where I used it" in mono, e.g. "LangGraph — EagleEye":
  - Languages
  - Backend & web
  - ML & AI
  - DevOps & tools
- The section has its own copy of the shared track filter. Skills outside the chosen track fade to 30%.
- Rows slide right slightly on hover.
- The skill list and "where used" notes are in section 8. Only the résumé's skills are listed.

#### 7.10 Off the clock

- **Poem excerpt:** two lines in large italic serif. Each line inks in left to right as you scroll (scroll-driven animation; static where unsupported).
- A link: "Read [title] and three more" goes to /writing.
- **Side column:**
  - Joint Secretary of the Literary Society (runs the budget for every event).
  - GDSC core member (5 campus tech events, 1,000+ attendance).
  - **Spotify card** (section 7.12).

#### 7.11 Résumé block

- Headline: "One page, / *the whole story.*"
- A copy of the track filter labelled "Pick the version written for the role".
- **Download button:** its label follows the track, e.g. "Download AI/ML PDF".

  | Track | PDF |
  |---|---|
  | All | `general.pdf` |
  | Full-stack | `web-dev.pdf` |
  | AI/ML | `ai-ml.pdf` |

- Also: "View in browser" opens the PDF in a new tab, and an "Updated <month year>" line.
- The PDFs are built from `~/Desktop/job-search-automation/resume/*.tex`. Harshit compiles them himself.

#### 7.12 Spotify card

- Shows the **currently playing** track (cover, title, artist, animated equaliser bars) and 3 "on repeat" tracks.
- Ends with a link to Harshit's playlist.
- **Data comes from a serverless route, `/api/spotify`:**
  - It uses a Spotify developer app and a long-lived refresh token, stored in Vercel environment variables.
  - It calls the "currently playing" and "top tracks" endpoints.
  - Responses are cached for about 60 s.
- **Fallbacks:**
  - When nothing is playing, show "Last played".
  - If the API fails, show only the playlist link. The page must never break or look empty because of Spotify.
- Harshit creates the Spotify app and gets the token; the builder supplies the steps.

#### 7.13 Contact footer

- Heading: "Hiring for full-stack or *AI/ML?*"
- The email as a modest link (`mailto:`, about 20–23 px, underline and arrow). It must not be giant.
- A "Copy address" button that changes to "Copied" for ~1.8 s. Announce it with `aria-live`.
- Footer row: © year, GitHub, LinkedIn, Résumé.

### 7.14 Site-wide interactions

| Feature | Behaviour | Off when |
|---|---|---|
| Custom cursor | A 6 px ink dot, a 34 px ring that lags behind (lerp 0.18), and an accent spark trail on a fixed canvas. The ring grows to 64 px with an accent tint over links, buttons and cards, and shrinks on press. | touch / coarse pointer, reduced motion |
| Smooth scroll | Lenis library. Anchor links glide too. | reduced motion. Leave touch native. |
| Scroll progress | A 2 px accent bar at the top, using a scroll-driven CSS animation. | unsupported browsers, reduced motion |
| Scroll reveals | Blocks fade up as they enter, using `animation-timeline: view()` where supported, with an IntersectionObserver fallback. | reduced motion |
| Magnetic button | The hero résumé button follows the cursor slightly. | reduced motion, touch |

Run all requestAnimationFrame loops only while something is moving. Pause canvases when offscreen or the tab is hidden.

### 7.15 Case study pages (`/work/[slug]`)

These pages were not mocked. The builder designs them in the same system.

- **Sections:**
  - Problem / context
  - What I built
  - How it works (one diagram)
  - Results or aim
  - What I'd do next
  - Links
- Header: title, year, track chips, stack, links.
- Pages are written in MDX.
- **Text is a placeholder until Harshit writes it.** The builder supplies a skeleton with bracketed prompts, never invented results.

### 7.16 Writing page (`/writing`)

These pages were not mocked either. Same type system.

- Each poem has a title, the full text in large serif with generous line height, and an optional note.
- Poems come from MDX files.

### 7.17 Phone layout

The mock was desktop only. Rules for phone widths:

- Single column throughout, with a 16 px side gutter and no horizontal scroll.
- The nav may wrap or become a simple menu (builder's call).
- The cursor is off and smooth scroll is native.
- The flow-field uses ~40% of the desktop particles.
- The marquee stays.
- The filter control fits within 360 px. Shrink the pill widths if needed.

## 8. Content and data

### Content as files

All content is in the repo:

- `content/projects/*.mdx`: frontmatter for title, slug, year, tracks, summary, stack, links { live, github }, featured, plus the case study body.
- `content/wip/*.ts` or `.mdx`: title, tracks, summary, stack, milestones [{ label, state: done | now | todo }], link.
- `content/poems/*.mdx`
- `data/experience.ts`, `data/awards.ts`, `data/skills.ts` (name, tracks[], where), `data/site.ts` (email, socials, availability line, marquee items).

### Skills (from the résumé)

| Group | Skills |
|---|---|
| Languages | Python, TypeScript, JavaScript, SQL, C++, C, Bash, R |
| Backend & web | FastAPI, React, Node.js, Express, REST APIs, WebSockets, WebRTC, PostgreSQL |
| ML & AI | LangGraph, ONNX Runtime, PyTorch, TensorFlow, Keras, Transformers, scikit-learn |
| DevOps & tools | Docker, Docker Compose, Azure, Linux, Git |

The "where used" notes are on the canvas mock. Leave a note blank where it isn't known.

### Links

Candidates found on GitHub. Harshit will confirm or replace them.

| Item | Candidate |
|---|---|
| GitHub profile | https://github.com/Harshit24401 |
| LinkedIn | linkedin.com/in/harshit-arora-here (from the résumé) |
| PeerCall live | https://video-chat-ruddy-kappa.vercel.app (repo `video-chat`) |
| face-sort repo | `face-sort-fde` |
| face-sort demo | unknown |
| Job-hunt repo | not on GitHub yet; may stay private |

### Still needed from Harshit

- 3–4 poems and their titles
- the Spotify playlist link
- the "Up next" project
- confirmed links
- case study text
- the résumé PDFs
- the domain name

## 9. SEO and sharing

- Per-page `<title>` and description.
- A static Open Graph image for the home page and one per case study. Generated with `next/og` or made by hand (builder's call).
- `sitemap.xml`, `robots.txt`, a canonical URL, and JSON-LD `Person` markup with sameAs links to GitHub and LinkedIn.

## 10. Quality checks before launch

- Lighthouse on mobile: performance ≥ 90, and accessibility, best practices and SEO all ≥ 95.
- Keyboard-only walkthrough of every interactive element.
- Turn on reduced motion and check the site is still complete and usable.
- Check at 360, 768, 1280 and 1440 px widths with no overflow. The award-tile overflow seen in the mock is a known case.
- Turn off JavaScript and check the content is still readable. The loader must not hide content.

## 11. How it gets built

Harshit wants to **learn while building**, not have the code written for him.

The working agreement, per milestone:

- By default, Harshit writes the code.
- Claude explains the concept and the "why", gives the interfaces and acceptance checks, then reviews his code and gives hints rather than answers.
- Harshit may hand any milestone to Claude. Claude then writes it with comments that teach the why, and Harshit reviews it.

**Launch timing:** Harshit chose to launch once, at the end, with every feature in. There is no early plain version. Deployment can still be set up early as a private preview, but the public launch waits for the finished site.

The plan should therefore be a sequence of small milestones, each one shippable and reviewable. It should run from the simplest pieces (the static layout and tokens) to the hardest (the canvases, the cursor, and the Spotify route).

## 12. Calls made while writing this up

These were settled by Claude, not discussed with Harshit. He can overturn any of them.

- **Experience ignores the track filter.** Both internships span both tracks.
- **Hidden links:** a project link stays hidden while its target is private or unknown. For example, the job-hunt card shows no GitHub link until the repo is public.
- **Domain and missing links:** set through `data/site.ts` and an environment variable for the site URL. Bracketed placeholders stay visible until they are replaced.
- **Résumé "Updated" date:** set by hand in `data/site.ts`.
- **Spotify:** endpoints and permissions are the builder's choice.

## 13. Left to the builder

- Folder structure, component boundaries, and naming.
- Whether to use Framer Motion or Motion for any React-side animation, or CSS plus small hooks only. Prefer CSS where it can do the job.
- How the shared track state is implemented (URL search params plus a small context is suggested).
- Case study and /writing page layouts, within the visual system.
- Testing approach: at minimum, unit tests for data helpers and the Spotify route, plus a Playwright smoke test of the home page.
- Exact responsive breakpoints.
