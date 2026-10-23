# components/oyun: the game screen

The root `CLAUDE.md` applies here too. This is the opening-period game at `/oyun` and `/en/oyun`;
spec `docs/specs/2026-10-08-oyun-design.md`, scene merge
`docs/specs/2026-10-08-oyun-sahne-birlestirme-design.md`. The simulation and the server contract
are in `lib/oyun/` (see `lib/oyun/CLAUDE.md`), the score server in `sunucu/`.

## Rendering

DOM plus painted inline SVG from the handoff: `Sahne*` modules and one `SahneDefs`. Per-frame
values are written by a rAF loop as CSS variables the SVG layers read, instant reactions run in
WAAPI, and `motion` is only for screen transitions. `motion` is imported nowhere outside this
folder, so it ships only in the `/oyun` chunks. Pointer drags are reduced to grab/drop inputs by
`lib/oyun/surukle.ts`.

## Colours: the one exception to the closed list

Owner's decision, 8 October 2026 (scene spec K1). The painted board under `Sahne*` (walnut,
brass, steel, marble, raw and cooked meat, coal, ember `#FF7A1A`) carries the handoff's own warm
palette as literals, with every stop that IS a palette colour bound to its token
(`stop-color: var(--kor)`, `fill: var(--kor)`). The UI layer on top of it (HUD, section labels,
buttons, pause curtain, ticket strike line, ×2 and combo text) stays on tokens, and no palette
rgb is written as a literal anywhere (`styles/palet.test.ts`). All gradients and filters live in
one `SahneDefs` bound once; `SahneDefs.test.ts` fails on a second `<defs>` or an undefined
`url(#…)`.

## Reduced motion

The global CSS rule does not reach WAAPI or Motion. `tepkiler.ts` keeps opacity-only keyframes
when `useHareketAzaltilmisMi()` is true, and `OyunSayfasi` wraps Motion in
`MotionConfig reducedMotion="user"`. Any new animation here must read the preference the same way.

## Consent

The game routes talk only to the first-party score API and make no third-party request, so
`CerezOnayi` renders nothing there (`onayGerekirMi` in `lib/onay.ts`): no banner, no GA.
