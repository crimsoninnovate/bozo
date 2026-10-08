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
  served from a Plesk document root on the arc server. Server behaviour that the site needs
  (the designed 404, security and cache headers) is in `public/.htaccess`, which the build
  copies into `out/`. The
  `noindex` header that used to live there was deleted on 24 August 2026; the site is indexed.
- **Two root layouts, no root `app/layout.tsx`.** `app/(tr)/layout.tsx` renders `<html lang="tr">`
  and keeps Turkish routes at the site root. `app/(en)/layout.tsx` renders `<html lang="en">` and
  nests English routes under `en/`. A root `app/layout.tsx` breaks this: do not add one.
- `experimental.globalNotFound: true` in `next.config.ts` pairs with `app/global-not-found.tsx`.
  Without that file the flag is inert; do not remove it.
- Fonts are defined once in `lib/fontlar.ts`, shared by both root layouts and
  `global-not-found.tsx`, so every `<html>` gets the same font classes.
- Design tokens are CSS custom properties, imported through `app/globals.css`: one palette from
  `styles/palet/` (the ground-dependent colours), then `styles/tokens.css` (everything else),
  `styles/reset.css` and `styles/animasyonlar.css`. Styling is CSS Modules on top of those
  tokens, no CSS framework. A palette colour written as a literal in a module does not follow
  the palette, so `styles/palet.test.ts` rejects it.
- Copy, prices, hours and contact data live under `content/`, never hardcoded in JSX. The one
  business rule, the overnight hours window, is pure functions in `lib/saat.ts` with unit tests.
- `lib/` is eleven small modules, each with a `.test.ts` beside it where behaviour is
  load-bearing: `saat` (the one business rule), `site` (routes and every outbound URL),
  `kabuk` (the shell parts that change per route: top-bar variant, anchors, drawer links),
  `metadata` (page metadata and the social card), `jsonld`, `onay` (consent storage),
  `fontlar`, `sis` (the locked mark geometry), `cerceve` (shared scroll frame), `hareket`
  (reduced-motion preference and rAF throttling), `metin` (widow prevention).
- **Every third-party runtime request sits behind consent.** `components/layout/CerezOnayi.tsx`
  is the gate and `Olcumleme` (GA4) is only rendered once the stored answer is `kabul`; KKTC law
  89/2007 Md. 11(2)(A) makes opt-in the only route for sending data abroad. A map, video or font
  that loads when the page opens is the same cross-border transfer, so it needs the same gate,
  and behind a gate most visitors never see it. Prefer a build-time equivalent: both map plates
  are OpenStreetMap geometry baked into SVG (`components/sayfa/haritaYollari.ts`, ODbL
  attribution required on every surface that shows it) for exactly this reason.
- `trailingSlash: true` so `/menu` resolves to `menu/index.html` under a plain static file server.
- `components/` has five buckets: `ui/` primitives, `sayfa/` page bodies (a subfolder per page),
  `layout/` shell, `saat/` opening hours, `ember/` decorative scene. Each component is `X.tsx`
  next to `X.module.css`. Imports go through the `@/*` alias, not relative paths.
- Keyframes live INSIDE the `.module.css` that uses them. CSS Modules hashes `animation-name`, so a
  keyframe sitting in a global file never resolves and the animation silently never runs. Measured
  once at 42 declarations and 0 running; `styles/animasyon.test.ts` guards it now.

## Design source of truth

The handoff is the base. Three surfaces have been superseded by owner decisions, so a parity
round reading the `.dc.html` files will see the difference as a defect. It is intended; each
one's measurements are in `docs/surec/IYILESTIRMELER.md`.

| Surface | Source since | What it changed |
|---|---|---|
| Home page | `Bozo/export/UYGULAMA-NOTLARI.md`, 12 Aug 2026 | hero, Ocakbaşı, Gece, İddia, Hikaye, Konum, ember scene, home top bar |
| Mobile drawer (`Cekmece`) | owner's decision A, 18 Aug 2026 | own top row, numbered links, section anchors, status block, two CTAs, signed foot, entrance motion |
| Menu page below 1040px | owner's 1A/2A, 18 Aug 2026 | rows not cards, no empty photo plates on phones, full price on the name line |

- Canonical visual and behavioral source: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/*.dc.html`
- Cheaper structural extract of the same handoff, read this first: `docs/tasarim/*.json`
- Copy, terminology and forbidden phrases: `docs/tasarim/metin-envanteri.json`
- Screenshots: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/screenshots/`
- Architecture spec: `docs/specs/2026-08-11-web-mimarisi.md`
- Implementation plan: `docs/plans/2026-08-11-web-uygulama-plani.md`
- `support.js` from the handoff never ships to production.

## Process files

- `docs/surec/DEVAM.md` is the entry point after a context reset: current state and pointers
  only, kept short. The dated log lives in `DEVAM-ARSIV.md`. `README.md` > Project docs maps
  every question to its one home.
- `docs/surec/KISITLAR.md` splits constraints into hard (never deviate) and soft. Anything
  traceable to the handoff gets reported in `docs/surec/IYILESTIRMELER.md` with its measurement,
  not silently fixed.

## Colors (complete list, do not add others)

**Two palettes, one active.** Every colour whose correct value depends on the ground lives in
`styles/palet/*.css`; `app/globals.css` imports exactly one. Switching is that one line and
nothing else. `styles/palet.test.ts` fails if the two files drift apart, or if a palette colour
is hardcoded anywhere outside them.

| Token | Bordo (active, owner's decision 21 Aug 2026) | Siyah (kept, switchable) |
|---|---|---|
| `--zemin` page ground | `#230D0B` | `#0B0F0F` |
| `--komur` charcoal | `#2C1210` | `#131817` |
| `--plaka-zemin` menu plates | `#28100E` | `#0F1413` |
| `--gece` Gece section only | `#1B0908` | `#070A0A` |
| `--kor` ember | `#B82B27` | `#AD2624` |
| `--kor-hover` | `#A02420` | `#8E1D1C` |

The bordo ground replaced the black one because the black measured cold (R−B −4, the wrong
direction for a fire brand) and its contrast was 16.20:1, over twice AAA and past the halation
threshold. Ember was brightened one step with it: `#AD2624` measured 2.56:1 on the first bordo,
so the button stopped separating from the page.

**The whole ground family went two steps darker on 23 August 2026** (owner: "a bit too light").
One multiplier, inner ratios kept, ember untouched: darkening the ground raises the button's
separation on its own, measured 2.84:1 to 3.01:1. Cream text now measures 15.56:1 on `--zemin`,
14.69:1 on `--komur`, 15.07:1 on `--plaka-zemin`, and exactly 16.20:1 on `--gece`, which is the
halation level the black ground was rejected at: one section, deliberately the darkest surface.

- Ground-independent, identical in both palettes, in `styles/tokens.css`: cream text `#F9E9D5`
  with its alpha ladder, the `--cizgi*` line family, copper (bakır) `#D19E66` with light
  `#E8C08A` and dark `#C08A57`.
- Nar, pumpkin and oak were deleted on 20 August 2026: no consumers, and the palette no longer
  goes outside the logo. Do not reintroduce them.
- Ember is never body text on any surface, and under 3:1 it cannot carry a graphic element on
  its own either. As a button fill it is valid: cream on it measures 5.17:1 on bordo (AA), and
  the fill separates from the ground at 3.01:1, which clears the 3:1 floor by very little.
  Copper and ember never sit side by side in a large area.
- **Third-party marks are the one exception to the closed list** (owner's decision, 18 August
  2026, for recognition): the WhatsApp glyph is WhatsApp green and the Instagram glyph carries
  Instagram's gradient, tokens `--marka-*` in `styles/tokens.css`, applied only inside
  `components/ui/Ikonlar.tsx`. Nothing else on the site uses those colours.

## Typography

- Headings, wordmark and numerals: Bevan, `font-variant-numeric: tabular-nums`. **Bevan ships
  one weight, 400.** Writing 500+ on a `--font-baslik` rule makes the browser synthesise bold;
  23 such escapes were found and removed on 20 August 2026.
- Body and UI: Archivo 400/500/600/700.
- Bricolage Grotesque and Inter were the previous pair, dropped 20 August 2026 with the header
  and hero v2. Do not reintroduce them; see `lib/fontlar.ts`.
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
- **Case, owner's decision 12 August 2026.** Title case on three things only: product names
  (`Terbiyesiz Tavuk Şiş`), section and menu labels (`Ocakbaşı`, `From the Fire`), CTA and nav
  labels (`Yol Tarifi Al`, `See the Menu`). Page headings and body copy stay sentence case:
  `Girne uyurken ocak yanıyor` is a sentence, not a label. English keeps its own title case, so
  short words stay lowercase (`On the House`). Screen-reader-only labels are untouched.
- **The owner's name, owner's decision 23 August 2026.** The site says `Bozo Çağlar` and
  nothing else (`isletme.sahip`, the überlines, his signature). `Engin Çağlar` was removed from
  the last two sentences that carried it; the handoff and `metin-envanteri.json` still contain
  it, so a parity round will see the difference. `content/icerik.test.ts` fails if it returns.
- Locked terminology: misafir (never müşteri), ikram (never bedava), ocak/kor (never mangal),
  usta (never şef), tane (never parça), şiş/porsiyon (never adet), sofra (never masa), "gece
  açığız" (never 7/24).
- **Never invent new marketing copy.** Text comes verbatim from `docs/tasarim/metin-envanteri.json`
  or the `.dc.html` files. One exception: copy the owner writes himself (`hikaye.lakap`, 19 August
  2026). Such a block needs the record `IYILESTIRMELER.md` > "lakap bölümü" has: source, what was
  edited, what was deliberately left out.

## Owner deletions, do not restore

The design still contains these; the owner removed them on 13 August 2026. A parity round reading
the handoff will see them as missing. They are not. Measurements and reasoning are in
`docs/surec/IYILESTIRMELER.md`.

- The pumpkin packaging strip (`PaketSeridi`), from every page. The service never launched, so the
  band promised a "coming soon" for something that did not exist.
- The menu page's "Gece Menüsü" card and its "Çekim Listesi" section. The first announced that its
  own contents were undecided; the second was a note addressed to the photographer, not a guest.
- Two of the three footer variants. Every page now carries the home page's four-column footer.
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
`lucide-static` and WhatsApp from `simple-icons` (CC0), both in their own brand colours (see
Colors).

## Accessibility

- Touch targets at least 44px. Contrast target WCAG AA.
- `prefers-reduced-motion: reduce` turns off every CSS animation and transition through the
  global rule in `styles/animasyonlar.css`, with ONE recorded exception: the ember density
  wrappers keep an opacity-only cross-fade (`KorSahnesi.module.css`), because without it the
  full-viewport glow hard-cuts by up to 45% at every section boundary; measured 18 August 2026.
  The rule does NOT reach canvas loops or SMIL: those read the preference themselves (see
  `components/ember/KorKivilcimi.tsx`). Any new non-CSS animation must do the same, or the
  guarantee is silently broken.
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
