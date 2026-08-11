# Binding constraints: Ciğerci Bozo web site

These bind every task in this plan. They come from the design handoff and the brand
book, not from developer preference.

## How binding they are

The design handoff is a **draft under active refinement**, confirmed by the project
owner on 11 August 2026. Two tiers therefore apply.

**Hard, never deviate:** brand rules (the colour list, locked terminology, banned
phrases, the em dash ban), factual accuracy (no invented prices, phone numbers,
coordinates, statistics or claims), accessibility minimums, and the architecture
decisions recorded in the spec.

**Default, deviate only with a recorded reason:** exact pixel values, spacing,
ordering and wording taken from the handoff. Reproduce them faithfully unless
implementing reveals a genuinely better result. When you deviate, say so in your
report with the reasoning, and it gets recorded in `iyilestirmeler.md`. An
undocumented deviation is still a defect; a documented one is a proposal.

If you notice something in the design that looks like an oversight rather than a
decision, do not silently fix it and do not silently copy it. Report it.

## Source authority

- Look and behaviour: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/*.dc.html`
- Extracted structural inventory (read this first, it is far cheaper): `docs/tasarim/*.json`
- Copy, terminology, bans, verified business facts: `docs/tasarim/metin-envanteri.json`
- Screenshots: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/screenshots/`
- `support.js` never ships to production.

## Dependencies

Runtime: only `next`, `react`, `react-dom`. Dev: only `typescript`, `@types/node`,
`@types/react`, `@types/react-dom`. No CSS framework, no i18n package, no animation
library, no test framework. Tests use Node's built-in `node:test`.

Next 16.3.0, React 19.2.8, Node >=20.9.0 (v25.6.0 installed).

## Colour

Only these hues may appear:

| Token | Value | Rule |
|---|---|---|
| Page ground | `#0A0807` | |
| Charcoal | `#1A1614` | |
| Cream | `#F2E9DC` | Text. See the opacity rule below |
| Ember | `#B7351C`, hover `#C93E22` | Never body text on any ground |
| Tangerine | `#FAAA1F` | Never adjacent to ember over a large area |
| Pumpkin | `#E96112` | Takeaway strip only, charcoal text on top |
| Oak | `#6B4A2F` | Support tone |
| Nar (pomegranate) | `#7A1F2B` | Limited accent, tied to bostana and pomegranate molasses. Brief line 100. Used exactly twice in the design, on the ikram plates. Do not spread it |

### The cream opacity rule

The eight values `.5 .58 .62 .66 .7 .74 .78 .86` are the most common cream **text**
opacities, not an exhaustive palette. The design actually uses forty distinct cream
alphas across its five files: structural ones from `.014` to `.4` for grids, hairlines
and borders, and text ones from `.5` to `.86`.

The rule is therefore:

- Use a token, never a raw `rgba(242,233,220,...)` literal.
- **If the design uses a value with no token, add the token. Do not round to the
  nearest existing one.** Rounding is a silent fidelity loss, and it compounds:
  `.8` and `.76` alone appear twenty-three times.
- Structural alphas below `.5` belong to the `--cizgi*` family, not the text ladder.

Panel grounds, shadows and border alphas carry their own values taken verbatim from
the design (for example `rgba(10,8,7,.72)` panels, `0 12px 34px rgba(183,53,28,.4)`
shadows). Those are not violations.

The same principle applies to hue, and it has now happened twice. `#0C0A09` was missing
from the brand book's colour list and turned out to be a real design value used fifteen
times. `#7A1F2B` was missing because this file's palette was built from the brand book's
Cilt 2 (six tokens) rather than the brief (seven); it is the documented Nar accent and its
two uses in the design are the most semantically precise colour choice in the whole file. A value present in
the design and absent from this file means this file is incomplete, not that the
design is wrong. Report it.

## Typography

- Headings, wordmark and numerals: Bricolage Grotesque 600-800
- Body and UI: Inter 400/500/600
- Numerals carry `font-variant-numeric: tabular-nums` wherever they render
- Corner radius 0-3px. Body text has a 16px floor, but it binds only one of three
  tiers; see below.
- Both fonts declare `subsets: ['latin', 'latin-ext']`. Turkish `ğ Ğ ş Ş İ` live in
  latin-ext; `ı ç ö ü` live in latin. Omitting latin-ext silently breaks Turkish text.

### The 16px floor, and what it binds

This replaces the flat "body text never below 16px" line, which the design
contradicts on all three inner pages. Three tiers, decided once:

**1. Reading text: the floor binds.** The lead paragraph and the primary body copy
of a section, that is anything set with `--ol-govde`, `--ol-spot` or
`--ol-govde-buyuk`. Never below 16px.

**2. UI micro text: the design's size wins.** Chips, plate and frame labels, meta
rows, table notes, section-heading notes, nav and footer links, button labels.
Rounding these up to 16px would break the design's rhythm and its information
hierarchy, which is a larger fidelity loss than the size itself.

**3. Secondary reading copy at a fixed 13px to 15.5px: the design's size wins, and
each page records it once.** This is real prose below the floor, so it is a
deviation, not an exemption: state it once per page and do not round it up. Do not
re-litigate it. The full membership, counted once against the design so nobody has
to guess whether a given text qualifies:

| Text | Size | Design source |
|---|---|---|
| Menu product-card descriptions | 14.5px/1.55 | `Menu:135, 153, 171, 189` |
| Menu night-menu note body | 13px/1.6 | `Menu:81` |
| Menu photo-list "no AI imagery" note | 13px/1.6 | `Menu:279` |
| Hikaye usul row bodies | 15.5px/1.65 | `Hikaye:101, 115` |
| Hikaye note block | 14.5px/1.65 | `Hikaye:86` |
| Konum contact sub-lines | 14px/1.4 | `Konum:138, 145` |

The two 13px entries were added on 12 August 2026: the earlier "14.5px to 15.5px"
band named neither, and it did not even cover the 14px Konum sub-lines it listed.
The rule was incomplete, not the design. `--ol-govde-kucuk`
(`clamp(15px, 1.3vw, 17px)`) is the same case in clamp form and needs no separate
record. Everything else below 16px is tier 2: it is a label, chip, meta row, nav or
button, not prose.

Accessibility for tiers 2 and 3 is carried by contrast (WCAG AA) and by the 44px
touch target, not by the type size.

## Copy rules (binding, a violation is a defect)

- The em dash character U+2014 must not appear as punctuation. Use a colon, comma,
  semicolon or period. A file may name the character by its code point when
  documenting the rule, but must not embed the glyph.
- No circumflex accents. No all-caps sentences. Exclamation marks are rare.
- Headings use sentence case. Times are written `10:00 - 05:00`.
- Locked terminology: misafir (not müşteri), ikram (not bedava or ücretsiz), ocak and
  kor (not mangal or ızgara), usta (not şef or aşçı), tane (not parça or lokma), şiş
  and porsiyon (not adet or tabak), sofra (not masa), "gece açığız" (not 7/24 or non-stop).
- No new marketing copy is invented. All text comes verbatim from the `.dc.html`
  files or from the ready blocks in `docs/tasarim/metin-envanteri.json`.
- English is not a translation of the Turkish, it is the same voice in English.
  Dish names are not translated, they are explained: `Urfa liver kebab (ciğer)`.
  `Alcohol-free` is visible on English pages. English copy states plainly that Bozo
  is a person's lifelong nickname.

## Architecture

- Two root layouts: `app/(tr)/layout.tsx` renders `<html lang="tr">`, `app/(en)/layout.tsx`
  renders `<html lang="en">`. There is no root `app/layout.tsx`; adding one breaks the
  multiple-root-layout setup.
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`,
  `experimental: { globalNotFound: true }`. `trailingSlash` is load-bearing for static
  hosting under Caddy `file_server`.
- No middleware, no Server Actions, no server-side data fetching. Static export forbids them.
- Route names are Turkish in both languages: `/menu`, `/en/menu`.
- All copy, prices, hours and contact details live in `content/`. No hardcoded strings in JSX.
- Unknown business data is `null` in `content/isletme.ts`. The UI renders a placeholder
  and emits no `href` for a `null` value.

## Motion and accessibility

- `prefers-reduced-motion: reduce` disables every animation, transition and smooth scroll.
- Reduced motion is not "no visual change". It targets movement that can cause vestibular
  discomfort: sliding, scaling, parallax, flying. A cross-fade is not that. So under reduced
  motion: opacity tracking stays, every scroll-driven `transform` is pinned, state indicators
  keep indicating through colour rather than scale, and reveal translations are off entirely.
  The design's own handling is imprecise here; this rule governs, and each site carries a
  comment saying what is suppressed and why.
- Touch targets at least 44px. Contrast WCAG AA.
- The design writes buttons and links as `<div>`. The port uses real `<a>` and `<button>`.
- Decorative layers (ember scene, smoke, grid, bead rows) are `aria-hidden="true"`.
- Live-clock components render a placeholder on the server and the real value after mount,
  so no hydration mismatch occurs.

## Naming

Domain concepts in Turkish (`TaneDizilimi`, `KorSahnesi`, `FotoYuvasi`, `urunler.ts`,
`data-yogunluk`). Technical scaffolding in English (`lib/`, `components/`, `content/`,
`types.ts`, `layout.tsx`). Turkish identifiers use ASCII; Turkish characters appear only
in user-visible text.

## Code size

Max file length ~700 lines. Max function length 50 lines. Max line width 120 characters.
No dead code.

## Git

Commit messages in English, imperative mood, first line max 72 characters.

**No assistant signature.** Commits, PR bodies and file headers carry no
`Co-Authored-By: Claude ...` trailer, no `Claude-Session:` line, no "Generated with
Claude Code" footer and no equivalent. Owner's decision, 12 August 2026; it overrides
the harness default. The commit body explains the change and nothing else.
