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

## Architecture

- App Router, `output: 'export'`. No server runtime after build; the site is plain static files
  served by Caddy `file_server`.
- **Two root layouts, no root `app/layout.tsx`.** `app/(tr)/layout.tsx` renders `<html lang="tr">`
  and keeps Turkish routes at the site root. `app/(en)/layout.tsx` renders `<html lang="en">` and
  nests English routes under `en/`. A root `app/layout.tsx` breaks this: do not add one.
- `experimental.globalNotFound: true` in `next.config.ts` pairs with `app/global-not-found.tsx`
  (added in a later task). Without that file the flag is inert; do not remove it.
- Fonts are defined once in `lib/fontlar.ts` and shared by both root layouts (and later by
  `global-not-found.tsx`) so every `<html>` tag gets the same font classes.
- Design tokens live in `styles/tokens.css` as CSS custom properties, imported through
  `app/globals.css` alongside `styles/reset.css` and `styles/animasyonlar.css`. Component styling
  uses CSS Modules on top of these tokens, no CSS framework.
- Copy, prices, hours and contact data live under `content/`, not hardcoded in JSX (from Task 3
  onward). The only business rule, the overnight opening hours window, is pure functions in
  `lib/saat.ts` with unit tests.
- `trailingSlash: true` so `/menu` resolves to `menu/index.html` under a plain static file server.

## Design source of truth

- Canonical visual and behavioral source: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/*.dc.html`
- Cheaper structural extract of the same handoff, read this first: `docs/tasarim/*.json`
- Copy, terminology and forbidden phrases: `docs/tasarim/metin-envanteri.json`
- Screenshots: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/screenshots/`
- Architecture spec: `docs/specs/2026-08-11-web-mimarisi.md`
- Implementation plan: `docs/plans/2026-08-11-web-uygulama-plani.md`
- `support.js` from the handoff never ships to production.

## Colors (complete list, do not add others)

- Page ground `#0A0807`, charcoal surface `#1A1614`
- Cream text `#F2E9DC`, opacity scale `.5 .58 .62 .66 .7 .74 .78 .86`
- Ember (kor) `#B7351C`, hover `#C93E22`. Tangerine `#FAAA1F`. Pumpkin `#E96112` (packaging line
  only). Oak (meşe) `#6B4A2F`.
- Ember is never body text on any surface. Tangerine and ember never sit side by side in a large
  area.

## Typography

- Headings, wordmark and numerals: Bricolage Grotesque 600-800, `font-variant-numeric: tabular-nums`.
- Body and UI: Inter 400/500/600.
- Body text never drops below 16px. Corner radius 0-3px.
- Both fonts require `subsets: ['latin', 'latin-ext']`: `ğ Ğ ş Ş İ` live in latin-ext, `ı ç ö ü`
  live in latin. Dropping latin-ext silently breaks Turkish rendering.

## Copy rules (binding, a violation is a bug)

- No em dash (U+2014) as punctuation; use a colon, comma, or period. No circumflex accents. No
  all-caps sentences. Exclamation marks are rare.
- Headings use sentence case. Hours are written `10:00 - 05:00`.
- Locked terminology: misafir (never müşteri), ikram (never bedava), ocak/kor (never mangal),
  usta (never şef), tane (never parça), şiş/porsiyon (never adet), sofra (never masa), "gece
  açığız" (never 7/24).
- **Never invent new marketing copy.** All text comes verbatim from `docs/tasarim/metin-envanteri.json`
  or the `.dc.html` handoff files.

## Naming

- Domain concepts in Turkish: `TaneDizilimi`, `KorSahnesi`, `FotoYuvasi`, `urunler.ts`,
  `data-yogunluk`.
- Technical scaffolding in English: `lib/`, `components/`, `content/`, `types.ts`, `layout.tsx`.
- Turkish identifiers stay ASCII; Turkish characters only appear in user-facing text.
- Route names are Turkish in both languages: `/menu`, `/en/menu`.

## Dependencies

Runtime: `next`, `react`, `react-dom` only. Dev: `typescript`, `@types/node`, `@types/react`,
`@types/react-dom` only. No CSS framework, no i18n package, no animation library, no test
framework beyond `node:test`.

## Accessibility

- Touch targets at least 44px. Contrast target WCAG AA.
- `prefers-reduced-motion: reduce` turns off every animation and transition.
- The design mockups use `<div>` for buttons and links; the port uses real `<a>` or `<button>`.
- Decorative layers (ember scene, smoke, grill, tane pattern) get `aria-hidden="true"`.

## Git

Commit at the end of each task. Message: imperative mood, English, first line under 72 chars,
body ends with `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
