# Ciğerci Bozo web sitesi

Statically exported (`output: 'export'`) Next.js 16 site for Ciğerci Bozo, a Urfa-style liver
kebab restaurant in Girne, Northern Cyprus, in Turkish and English. Production domain:
`https://cigercibozo.com`.

## Commands

```bash
npm run dev        # local dev server
npm run build      # static export to out/
npm run typecheck  # tsc --noEmit
npm run test       # node --test (bare, no shell glob; discovers *.test.ts itself)
npm run preview    # serve the out/ export locally
```

`tsconfig.json` sets `noUnusedLocals` and `noUnusedParameters`: one unused import fails
`npm run typecheck`. Deploy is in `README.md` > Publishing.

## Architecture

- App Router, `output: 'export'`. No server runtime after build; the site is plain static files
  served by Caddy `file_server`.
- **Two root layouts, no root `app/layout.tsx`.** `app/(tr)/layout.tsx` renders `<html lang="tr">`
  and keeps Turkish routes at the site root. `app/(en)/layout.tsx` renders `<html lang="en">` and
  nests English routes under `en/`. A root `app/layout.tsx` breaks this: do not add one.
- `experimental.globalNotFound: true` in `next.config.ts` pairs with `app/global-not-found.tsx`.
  Without that file the flag is inert; do not remove it.
- Fonts are defined once in `lib/fontlar.ts` and shared by both root layouts and
  `global-not-found.tsx` so every `<html>` tag gets the same font classes.
- Design tokens live in `styles/tokens.css` as CSS custom properties, imported through
  `app/globals.css` alongside `styles/reset.css` and `styles/animasyonlar.css`. Component styling
  uses CSS Modules on top of these tokens, no CSS framework.
- Copy, prices, hours and contact data live under `content/`, not hardcoded in JSX. The only
  business rule, the overnight opening hours window, is pure functions in `lib/saat.ts` with
  unit tests.
- `trailingSlash: true` so `/menu` resolves to `menu/index.html` under a plain static file server.
- `components/` has five buckets: `ui/` primitives, `sayfa/` page bodies with a subfolder per
  page, `layout/` shell, `saat/` opening hours, `ember/` decorative scene. Each component is
  `X.tsx` next to `X.module.css`.
- Imports go through the `@/*` alias from `tsconfig.json`, not relative paths.
- Keyframes live INSIDE the `.module.css` that uses them. CSS Modules hashes `animation-name`, so a
  keyframe sitting in a global file never resolves and the animation silently never runs. Measured
  once at 42 declarations and 0 running; `styles/animasyon.test.ts` guards it now.

## Design source of truth

- **Home page only, from 12 August 2026:** `/Users/mk/Desktop/Bozo/export/UYGULAMA-NOTLARI.md`
  supersedes the handoff. It is a section-by-section audit of the live page and it
  changes the hero, Ocaktan, Gece, İddia, Hikaye, Konum, the ember scene and the
  home variant of the top bar. Inner pages still follow the handoff.
- Canonical visual and behavioral source: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/*.dc.html`
- Cheaper structural extract of the same handoff, read this first: `docs/tasarim/*.json`
- Copy, terminology and forbidden phrases: `docs/tasarim/metin-envanteri.json`
- Screenshots: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/screenshots/`
- Architecture spec: `docs/specs/2026-08-11-web-mimarisi.md`
- Implementation plan: `docs/plans/2026-08-11-web-uygulama-plani.md`
- `support.js` from the handoff never ships to production.

## Process files

- `docs/surec/DEVAM.md` is the entry point after a context reset. Read it before branching out.
- `docs/surec/KISITLAR.md` splits constraints into hard (never deviate) and soft. Anything
  traceable to the handoff gets reported in `docs/surec/IYILESTIRMELER.md` with its measurement,
  not silently fixed.
- Pre-release checks: `docs/PARITE.md`, `docs/surec/YAYIN-KONTROL-LISTESI.md`.

## Colors (complete list, do not add others)

- Page ground `#0A0807`, charcoal surface `#1A1614`
- Cream text `#F2E9DC`, opacity scale `.5 .58 .62 .66 .7 .74 .78 .86`
- Ember (kor) `#B7351C`, hover `#C93E22`. Tangerine `#FAAA1F`. Pumpkin `#E96112` (no consumer
  since the packaging strip was removed; the token stays for when it returns). Oak (meşe) `#6B4A2F`.
- Ember is never body text on any surface. Tangerine and ember never sit side by side in a large
  area.

## Typography

- Headings, wordmark and numerals: Bricolage Grotesque 600-800, `font-variant-numeric: tabular-nums`.
- Body and UI: Inter 400/500/600.
- Corner radius 0-3px, with one recorded exception: the mobile action bar
  (`MobilAksiyonBari`) is a fully rounded floating glass pill with a raised circular
  centre button. Owner's decision 13 August 2026, taken after seeing the 3px version
  and rejecting it. Do not "fix" it back to 3px.
- The 16px floor binds reading text only, not UI micro text;
  the three tiers are decided once in `docs/surec/KISITLAR.md`. Do not "fix" a
  14.5px chip or frame label up to 16px.
- Both fonts require `subsets: ['latin', 'latin-ext']`: `ğ Ğ ş Ş İ` live in latin-ext, `ı ç ö ü`
  live in latin. Dropping latin-ext silently breaks Turkish rendering.

## Copy rules (binding, a violation is a bug)

- No em dash (U+2014) as punctuation; use a colon, comma, or period. No circumflex accents. No
  all-caps sentences. Exclamation marks are rare.
- Hours are written `10:00 - 05:00`.
- **Case, owner's decision 12 August 2026.** Title case (word-initial capitals) on three
  things only: product names (`Terbiyesiz Tavuk Şiş`), section and menu labels
  (`Gece Menüsü`, `From the Fire`), and CTA/nav labels (`Yol Tarifi Al`, `See the Menu`).
  Page headings and body copy stay sentence case: `Girne uyurken ocak yanıyor` is a
  sentence, not a label. English follows English title case, so short articles and
  prepositions stay lowercase (`On the House`). Screen-reader-only labels are untouched.
- Locked terminology: misafir (never müşteri), ikram (never bedava), ocak/kor (never mangal),
  usta (never şef), tane (never parça), şiş/porsiyon (never adet), sofra (never masa), "gece
  açığız" (never 7/24).
- **Never invent new marketing copy.** All text comes verbatim from `docs/tasarim/metin-envanteri.json`
  or the `.dc.html` handoff files.

## Owner deletions, do not restore

The design still contains these; the owner removed them on 13 August 2026. A parity round reading
the handoff will see them as missing. They are not. Measurements and reasoning are in
`docs/surec/IYILESTIRMELER.md`.

- The pumpkin packaging strip (`PaketSeridi`), from every page. The service never launched, so the
  band promised a "coming soon" for something that did not exist.
- The menu page's "Gece Menüsü" card and its "Çekim Listesi" section. The first announced that its
  own contents were undecided; the second was a note addressed to the photographer, not a guest.
- Two of the three footer variants. Every page now carries the home page's four-column footer.
- The mobile hero's two CTA buttons, below 800px. The mobile prototype has none either: actions
  belong to the floating bar, and the hero was repeating it.
- `html { scroll-behavior: smooth }`. It turned Next's route-change scroll correction into a visible
  slide in from the bottom of the target page. Measured: 82 scroll events from y=3356 down to 0,
  against one event at 0 without it. Bead rail easing is unaffected, it lives in its own JS call.

## Comments

Comment density here has drifted into essays. Keep them short.

- A comment earns its place by recording something the code cannot say: a design
  source (`Ana:176`), a measured value, a decision that looks wrong without context.
- One or two lines. Not a paragraph, and never a rationale essay.
- Do not restate what the line does, do not narrate the process that produced it,
  do not argue with a hypothetical reader.
- The reasoning belongs in `docs/surec/`, not in the file.

## Naming

- Domain concepts in Turkish: `TaneDizilimi`, `KorSahnesi`, `FotoYuvasi`, `urunler.ts`,
  `data-yogunluk`.
- Technical scaffolding in English: `lib/`, `components/`, `content/`, `types.ts`, `layout.tsx`.
- Turkish identifiers stay ASCII; Turkish characters only appear in user-facing text.
- Route names are Turkish in both languages: `/menu`, `/en/menu`.

## Dependencies

Runtime: `next`, `react`, `react-dom`, `lucide-react`. Dev: `typescript` and the three
`@types` packages.

**Owner's decision, 13 August 2026.** The old "those three packages only" rule is lifted: this
is a small restaurant brand with a launch to make, not a bundle-budget project. Add a dependency
when it buys the look or saves real work. Still out: CSS framework, i18n package, and any test
framework beyond `node:test`. Those three were architecture decisions, not budget ones.

Icons come from `lucide-react`, wrapped in `components/ui/Ikonlar.tsx` so call sites keep Turkish
names and a `boy` prop. Lucide v1 carries no brand marks; Instagram is inlined from
`lucide-static` to keep one drawing language.

## Accessibility

- Touch targets at least 44px. Contrast target WCAG AA.
- `prefers-reduced-motion: reduce` turns off every CSS animation and transition through the
  global rule in `styles/animasyonlar.css`. It does NOT reach canvas loops or SMIL: those read the
  preference themselves (see `components/ember/KorKivilcimi.tsx`). Any new non-CSS animation must
  do the same, or the guarantee is silently broken.
- The design mockups use `<div>` for buttons and links; the port uses real `<a>` or `<button>`.
- Decorative layers (ember scene, smoke, grill, tane pattern) get `aria-hidden="true"`.

## Git

Commit at the end of each task. Message: imperative mood, English, first line under 72 chars.

**No assistant signature.** Do not add `Co-Authored-By: Claude ...`, a `Claude-Session:`
line, a "Generated with Claude Code" footer, or any equivalent trailer to commits, PR
bodies or file headers. Owner's decision, 12 August 2026. This overrides the default
harness convention.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
