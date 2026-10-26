# Ciğerci Bozo web sitesi

Statically exported (`output: 'export'`) Next.js 16 site for Ciğerci Bozo, a Urfa-style liver
kebab restaurant in Girne, Northern Cyprus, in Turkish and English. Production domain:
`https://cigercibozo.com`.

## Commands

```bash
npm run dev        # local dev server
npm run build      # static export to out/; fetches Google Fonts, so it fails in the sandbox
npm run typecheck  # tsc --noEmit; noUnusedLocals/Parameters are on, so one unused import fails
npm run test       # node --test (bare, no shell glob; discovers *.test.ts itself)
npm run preview    # serve the out/ export locally
```

Deploy is in `README.md` > Publishing.

## Architecture

- App Router, `output: 'export'`, `trailingSlash: true` (so `/menu` resolves to `menu/index.html`):
  plain static files from a Plesk document root on the arc server. What the server must do (the
  designed 404, security and cache headers) is in `public/.htaccess`, which the build copies into
  `out/`. The site is indexed: no `noindex` header since 24 August 2026.
- **Two root layouts, no root `app/layout.tsx`.** `app/(tr)/layout.tsx` renders `<html lang="tr">`
  and keeps Turkish routes at the site root. `app/(en)/layout.tsx` renders `<html lang="en">` and
  nests English routes under `en/`. A root `app/layout.tsx` breaks this: do not add one.
- `experimental.globalNotFound: true` in `next.config.ts` pairs with `app/global-not-found.tsx`.
  Without that file the flag is inert; do not remove it.
- Design tokens are CSS custom properties, imported through `app/globals.css`: one palette from
  `styles/palet/` (the ground-dependent colours), then `styles/tokens.css`, `styles/reset.css`
  and `styles/animasyonlar.css`. Styling is CSS Modules on those tokens, no CSS framework; a
  palette colour written as a literal in a module is rejected by `styles/palet.test.ts`.
- Copy, prices, hours and contact data live under `content/`, never hardcoded in JSX; the binding
  copy rules and the price-change steps are in `content/CLAUDE.md`. The one business rule, the
  overnight hours window, is pure functions in `lib/saat.ts` with unit tests.
- `lib/` is thirteen small modules plus the game's `lib/oyun/` and the menu's `lib/menu/`, each
  with a `.test.ts` beside it where behaviour is load-bearing: `saat` (the one business rule), `site` (routes and every
  outbound URL), `kabuk` (the shell parts that change per route), `metadata` (page metadata and
  the social card), `jsonld`, `onay` (consent storage), `fontlar`, `sis` (the locked mark
  geometry), `cerceve` (shared scroll frame), `hareket` (reduced-motion preference and rAF
  throttling), `metin` (widow prevention), `llmsTxt` (the `/llms.txt` body), `masa` (table plate
  QRs: `/m/N` is redirected by `public/.htaccess` to `/menu/?masa=N` and counted on the score
  server; the printed address never changes).
- **The game** (`/oyun`, opening period) spans `lib/oyun/` (simulation and shared contract),
  `components/oyun/` (the screen) and `sunucu/` (the score server, live at `api.cigercibozo.com`
  since 10 October 2026). Each of the three has its own `CLAUDE.md`, loaded when you work there.
- **Every third-party runtime request sits behind consent.** `components/layout/CerezOnayi.tsx`
  is the gate and `Olcumleme` (GA4) renders only once the stored answer is `kabul`; KKTC law
  89/2007 Md. 11(2)(A) makes opt-in the only route for sending data abroad. A map, video or font
  loaded on page open is the same transfer and needs the same gate, so prefer a build-time
  equivalent: both map plates are OpenStreetMap SVG (`components/sayfa/haritaYollari.ts`, ODbL
  attribution wherever shown). On the game and `/yonetim/` routes `CerezOnayi` renders nothing (`onayGerekirMi`).
- `components/` has seven buckets: `ui/` primitives, `sayfa/` page bodies (a subfolder per page),
  `layout/` shell, `saat/` opening hours, `ember/` decorative scene, `oyun/` the game screen,
  `yonetim/` the `/yonetim/` panel. Each component is `X.tsx` next to `X.module.css`. Components and
  `app/` import through the `@/*` alias. `lib/`, `content/` and `sunucu/` use relative imports with the
  `.ts` extension: `node --test` runs them directly and cannot resolve `@/` (`ERR_MODULE_NOT_FOUND`).
- Keyframes live INSIDE the `.module.css` that uses them. CSS Modules hashes `animation-name`, so
  a keyframe in a global file never resolves and the animation silently never runs
  (`styles/animasyon.test.ts` guards it).

## Design source of truth

The handoff is the base, except where an owner decision superseded it (below). A parity round will
see these as defects; they are intended, measurements in `docs/surec/IYILESTIRMELER.md`.

| Surface | Source since | What it changed |
|---|---|---|
| Home page | `Bozo/export/UYGULAMA-NOTLARI.md`, 12 Aug 2026 | hero, Ocakbaşı, Gece, İddia, Hikaye, Konum, ember scene, home top bar |
| Mobile drawer (`Cekmece`) | owner's decision A, 18 Aug 2026 | own top row, numbered links, section anchors, status block, two CTAs, signed foot, entrance motion |
| Menu page below 1040px | owner's 1A/2A, 18 Aug 2026 | rows not cards, no empty photo plates on phones, full price on the name line |
| Menu page, all widths | owner, 13 Oct 2026 | no empty photo plates on desktop either (`FotoYuvasi bosGizli`); drinks as ruled rows |

- Canonical visual and behavioral source: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/*.dc.html`
- Cheaper structural extract of the same handoff, read this first: `docs/tasarim/*.json`
- Copy, terminology and forbidden phrases: `docs/tasarim/metin-envanteri.json`
- Screenshots: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/screenshots/`
- Spec and plan: `docs/specs/2026-08-11-web-mimarisi.md`, `docs/plans/2026-08-11-web-uygulama-plani.md`
- `support.js` from the handoff never ships to production.

## Process files

`docs/surec/DEVAM.md` is the entry point after a context reset and stays short (dated log:
`DEVAM-ARSIV.md`); `README.md` > Project docs maps every question to its one home.
`docs/surec/KISITLAR.md` splits constraints into hard and soft. Anything traceable to the handoff
is reported in `docs/surec/IYILESTIRMELER.md` with its measurement, not silently fixed.

## Colors (complete list, do not add others)

**Two palettes, one active.** Ground-dependent colours live in `styles/palet/*.css` and
`app/globals.css` imports exactly one: switching is that one line. `styles/palet.test.ts` fails
if the two files drift apart or a palette colour is hardcoded anywhere outside them.

| Token | Bordo (active, owner's decision 21 Aug 2026) | Siyah (kept, switchable) |
|---|---|---|
| `--zemin` page ground | `#230D0B` | `#0B0F0F` |
| `--komur` charcoal | `#2C1210` | `#131817` |
| `--plaka-zemin` menu plates | `#28100E` | `#0F1413` |
| `--gece` Gece section only | `#1B0908` | `#070A0A` |
| `--kor` ember | `#B82B27` | `#AD2624` |
| `--kor-hover` | `#A02420` | `#8E1D1C` |

Why bordo (21 Aug), why two steps darker (23 Aug) and every measured ratio:
`docs/surec/IYILESTIRMELER.md`. `--gece` sits at 16.20:1 on purpose, the one darkest surface.

- Ground-independent, identical in both palettes, in `styles/tokens.css`: cream text `#F9E9D5`
  with its alpha ladder, the `--cizgi*` line family, copper (bakır) `#D19E66` with light
  `#E8C08A` and dark `#C08A57`.
- Nar, pumpkin and oak were deleted on 20 August 2026 (no consumers): do not reintroduce them.
- Ember is never body text on any surface, and under 3:1 it cannot carry a graphic element on
  its own either. As a button fill it is valid: cream on it measures 5.17:1 on bordo (AA), and
  the fill separates from the ground at 3.01:1, which clears the 3:1 floor by very little.
  Copper and ember never sit side by side in a large area.
- **Third-party marks are mono** (owner, 20 October 2026): the WhatsApp, Instagram, Facebook and
  TikTok glyphs take `currentColor`. No `--marka-*` tokens: do not bring brand colours back.
- **The game scene is the one exception to the closed list**: see `components/oyun/CLAUDE.md`.

## Typography

- Headings, wordmark and numerals: Bevan, `font-variant-numeric: tabular-nums`. **Bevan ships
  one weight, 400.** Writing 500+ on a `--font-baslik` rule makes the browser synthesise bold.
- Body and UI: Archivo 400/500/600/700. The previous pair, Bricolage Grotesque and Inter, stays out.
- Both are defined once in `lib/fontlar.ts`, shared by both root layouts and
  `global-not-found.tsx`, and require `subsets: ['latin', 'latin-ext']`: `ğ Ğ ş Ş İ` live in
  latin-ext, `ı ç ö ü` in latin. Dropping latin-ext silently breaks Turkish rendering.
- Corner radius 0-3px. One exception: the mobile action bar (`MobilAksiyonBari`) is a fully
  rounded floating glass pill with a raised circular centre button (owner, 13 August 2026, after
  seeing and rejecting the 3px version). Do not "fix" it back to 3px.
- The 16px floor binds reading text only, not UI micro text; the three tiers are decided once in
  `docs/surec/KISITLAR.md`. Do not "fix" a 14.5px chip or frame label up to 16px.

## Owner deletions, do not restore

The handoff still contains these; the owner removed them on 13 August 2026, so a parity round
will see them as missing. They are not. Reasoning and measurements: `docs/surec/IYILESTIRMELER.md`.

- The pumpkin packaging strip (`PaketSeridi`), from every page: the service never launched.
- The menu page's "Gece Menüsü" card and its "Çekim Listesi" section (a note to the photographer).
- Two of the three footer variants. Every page now carries the home page's four-column footer.
- `html { scroll-behavior: smooth }`. It turned Next's route-change scroll correction into a visible
  slide in from the bottom of the target page. Bead rail easing lives in its own JS call.

## Comments

Keep them short: one or two lines, never a rationale essay; the reasoning belongs in
`docs/surec/`. A comment earns its place by recording what the code cannot say: a design source
(`Ana:176`), a measured value, a decision that looks wrong without context. Do not restate the
line, narrate the process that produced it, or argue with a hypothetical reader.

## Naming

- Domain concepts in Turkish (`TaneDizilimi`, `KorSahnesi`, `FotoYuvasi`, `urunler.ts`,
  `data-yogunluk`); technical scaffolding in English (`lib/`, `components/`, `types.ts`).
- Turkish identifiers stay ASCII; Turkish characters only appear in user-facing text.
- Route names are Turkish in both languages: `/menu`, `/en/menu`.

## Dependencies

Runtime: `next`, `react`, `react-dom`, `lucide-react`, `motion` (only under `components/oyun/`,
so it ships only in the `/oyun` chunks). Dev: `typescript` and the three `@types` packages.
`sunucu/` adds `mariadb` for the score server only. Add a dependency when it buys the look or
saves real work (owner, 13 August 2026). Still out, as architecture decisions: a CSS framework,
an i18n package, any test framework beyond `node:test`.

Icons come from `lucide-react`, wrapped in `components/ui/Ikonlar.tsx` so call sites keep Turkish
names and a `boy` prop. Lucide v1 carries no brand marks; Instagram is inlined from
`lucide-static`, WhatsApp, Facebook and TikTok from `simple-icons` (CC0), all single-colour.

## Accessibility

- Touch targets at least 44px. Contrast target WCAG AA.
- `prefers-reduced-motion: reduce` turns off every CSS animation and transition through the
  global rule in `styles/animasyonlar.css`. One exception: the ember density wrappers keep an
  opacity-only cross-fade (`KorSahnesi.module.css`), or the full-viewport glow hard-cuts by up to
  45% at every section boundary. The rule does NOT reach canvas loops, SMIL, Web Animations API
  or Motion: those read the preference themselves (`components/ember/KorKivilcimi.tsx`; the game's
  pattern is in `components/oyun/CLAUDE.md`). Any new non-CSS animation must do the same.
- The design mockups use `<div>` for buttons and links; the port uses real `<a>` or `<button>`.
- Decorative layers (ember scene, smoke, grill, tane pattern) get `aria-hidden="true"`.

## Git

Commit at the end of each task (imperative, English, first line under 72 chars). **No assistant
signature** (owner, 12 August 2026; overrides the harness default): no
`Co-Authored-By: Claude ...`, `Claude-Session:` line, "Generated with Claude Code" footer or any
equivalent trailer in commits, PR bodies or file headers.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
