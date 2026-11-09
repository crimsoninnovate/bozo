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
- Menu versions (`menu.ts`, table `menu_surum`): `GET /menu` is public, with a single-flight 15 s
  cache and its own per-IP bucket (6000/hour, separate from the general 600; the restaurant wifi
  is one IP). `PUT /yonetim/menu` validates with `lib/menu/dogrulama.ts`, stores the normalized
  document and answers 409 `surumEskidi` when `taban` is not the latest version id;
  `GET /yonetim/menu/N` returns one stored version (the panel's rollback diff), 404 `surumYok`.
  A PUT body missing `saatler`/`fotograflar` (the older panel) gets them from the current version, else the seed.
- Body limits: the shared `GOVDE_SINIRI` is 64 KB, too small for a menu document (the largest valid one, Turkish
  letters at every maximum and 6 sizes per drink, measures 180,067 bytes), so `PUT /yonetim/menu` alone reads
  up to `MENU_GOVDE_SINIRI` (256 KB, `menu.ts`). A document of 3-byte characters everywhere could still exceed
  it; the panel then shows "Menü çok büyük, kaydedilemedi." `menu.test.ts` holds the measurement.
- Photo upload (`foto.ts`): `POST /yonetim/foto` takes raw WebP or JPEG bytes (`Content-Type` must match the magic
  bytes, else 415 `bicimDesteklenmiyor`; up to `FOTO_GOVDE_SINIRI` 3 MB, long edge up to 2000 px, read from the
  VP8/VP8L/VP8X header or the first JPEG SOF marker; Safari and iOS cannot encode WebP, so the panel falls back to
  JPEG) and writes `<sha256[0..16]>.webp` or `.jpg` atomically into `FOTO_DIZINI`; existing files are never
  rewritten or deleted. Without `FOTO_DIZINI` it answers 503 `fotoKapali`. Serving the directory is nginx's job, not the server's.
- Site rebuild (`derleme.ts`): `POST /yonetim/derleme` writes `DERLEME_DIZINI/istek` (ISO time; a second POST while it
  exists keeps the one file) and answers 202; `GET` reads `durum.json` (written by the build unit; invalid shape ->
  `bos` plus one `console.warn`, `gunluk` capped at 200 lines) and reports `sirada` when `istek` exists and the build is
  not `derleniyor`. The web process never builds. Without `DERLEME_DIZINI` it answers 503 `derlemeKapali`. The panel
  polls the GET every 5 s, so it has its own per-IP bucket (1200/hour, `DERLEME_SAATLIK`) and skips the 60/hour
  `/yonetim/*` bucket for valid staff credentials only (a wrong password counts against the 60/hour bucket like on any
  other route), and once that 60/hour bucket or the general 600/hour one is spent the GET answers 429 for every credential (no oracle); the POST
  stays in that bucket.
- The build and upload that the rebuild request triggers live outside the Node process, in `sunucu/derleme/`:
  `derle.sh` (user `bozo-derleme`, no root, inside the `Dockerfile` image that `kap.sh` runs: arc's glibc 2.28
  is too old for Next's native SWC), `yukle.sh` (root, fixed paths, no input), `ortak.sh`, and the
  `bozo-derleme.path`, `bozo-derleme.service`, `bozo-yukle.service` units, tested by `derleme.test.ts`. The scripts
  are installed to `/opt/bozo-derleme/`, not run from the repo. Env: `FOTO_DIZINI` and `DERLEME_DIZINI` are optional
  (unset means the matching endpoint answers 503). Setup: `docs/surec/SUNUCU-CANLIYA-ALMA.md` > Panelden site yayını.
- Staff auth: Basic, or `Authorization: Bearer <bitisMs>.<hmac>` minted by `POST /yonetim/oturum` (Basic only,
  30 days, stateless, `oturum.ts`); change `YONETIM_SIFRE` to revoke every token. Do not rotate
  `GIZLI_TUZ` for this: it also breaks every unredeemed reward code (`kodOzeti` hashes with the same salt).
- Table plate scans (`lib/masa.ts`, `/m/N`) are counted here too and shown on the staff screen.
- Run locally with `GIZLI_TUZ=x KOKEN=http://localhost:3000 node sunucu/ana.ts`. The site reads
  the API base from `NEXT_PUBLIC_OYUN_API` at build time (default `https://api.cigercibozo.com`).
- **Live since 10 October 2026** at `api.cigercibozo.com`: systemd `bozo-oyun` on arc, Node 24,
  MariaDB `bozo_site`, nginx proxy. Runbook and secrets locations:
  `docs/surec/SUNUCU-CANLIYA-ALMA.md`.
- The privacy page describes the game data; the owner declined a lawyer review and took the
  decision himself (10 October 2026).
