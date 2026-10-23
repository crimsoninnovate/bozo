# lib/oyun: the game's simulation and shared contract

The root `CLAUDE.md` applies here too. Spec `docs/specs/2026-10-08-oyun-design.md`. The screen is
`components/oyun/` (see its `CLAUDE.md`), the score server `sunucu/` (see `sunucu/CLAUDE.md`).

- The core is an integer-only deterministic simulation, pinned by golden records in
  `motor.test.ts`. `sunucu/` replays every round with `simule` and never reads a claimed score.
- Display-only modules never feed values back into it: `gosterim`, `gorsel`, `zamanlayici`,
  `defter`, `klavye`, `duyuru`, `ses`, `tarih`, `surukle` (gesture machine), `rehber` (guided
  round).
- Server-facing modules are shared with `sunucu/`: `aktarim` (the wire contract), `api` (browser
  client), `tavan` (per-seed score ceiling), `tohum` (uint32 seed bounds), `takmaAd` (nickname
  format and folding), `yonetim` (staff screen `/oyun/yonetim/`: prior period, replay check).
