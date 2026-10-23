# sunucu: the game's score server

The root `CLAUDE.md` applies here too. Spec §10 of `docs/specs/2026-10-08-oyun-design.md`. The
simulation it replays is `lib/oyun/` (see `lib/oyun/CLAUDE.md`).

- Node 24, `node:http`, one dependency (`mariadb`) in its own `package.json`, wired in as an npm
  workspace so the root `npm install`, `npm run typecheck` and `npm test` cover it. The site
  never imports it.
- It imports `lib/oyun/` directly and replays every round with `simule`; it never reads a
  claimed score.
- Storage is behind `depo.ts`: `bellekDepo` for tests and local runs, `mariaDepo` for production
  (`sema.sql`). The MariaDB contract test is opt-in (`BOZO_TEST_DB_URL`), so bare `npm test`
  stays hermetic.
- Table plate scans (`lib/masa.ts`, `/m/N`) are counted here too and shown on the staff screen.
- Run locally with `GIZLI_TUZ=x KOKEN=http://localhost:3000 node sunucu/ana.ts`. The site reads
  the API base from `NEXT_PUBLIC_OYUN_API` at build time (default `https://api.cigercibozo.com`).
- **Live since 10 October 2026** at `api.cigercibozo.com`: systemd `bozo-oyun` on arc, Node 24,
  MariaDB `bozo_oyun`, nginx proxy. Runbook and secrets locations:
  `docs/surec/SUNUCU-CANLIYA-ALMA.md`.
- The privacy page describes the game data; the owner declined a lawyer review and took the
  decision himself (10 October 2026).
