# Ciğerci Bozo web sitesi

Static Next.js 16 site for Ciğerci Bozo (Girne, KKTC), in Turkish and English. See `CLAUDE.md`
for architecture, design source of truth and binding copy rules.

## Requirements

- Node.js `>=20.9.0` (developed on v25.6.0)
- npm (developed on 11.11.1)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Serves the app at `http://localhost:3000`.

## Type checking

```bash
npm run typecheck
```

## Tests

```bash
npm run test
```

Runs `node --test` directly so Node discovers `*.test.ts` files itself and skips `node_modules`.

## Build

```bash
npm run build
```

Produces a static export in `out/`. To check the export locally:

```bash
npm run preview
```

## Publishing

The build output in `out/` is a plain static site with no server runtime, served by Caddy
`file_server` on researchos-server, the same pattern as the Regulus and oykualemdar sites.
`trailingSlash: true` in `next.config.ts` is required for this: it makes `/menu` resolve to
`menu/index.html` instead of a bare file the server cannot find.

Production domain: `https://cigercibozo.com` (not live yet). A demo of the current build runs at
`https://bozo.crimsoninnovate.com`, deployed 12 August 2026.

### Where the server actually keeps things

Two traps cost time the first time round, so they are written down rather than rediscovered:

- **Caddy runs in Docker, not systemd.** `systemctl is-active caddy` reports `inactive` and
  `/etc/caddy/Caddyfile` on the host is a stale decoy that nothing reads. The live config is
  `/opt/docker/caddy/Caddyfile`, mounted into the `caddy:2-alpine` container. Reload with
  `docker exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile`, and
  validate with the same path before reloading: one Caddyfile fronts every site on the box.
- **The container's `/srv/enliq` is the host's `/var/www/enliq`.** Files uploaded to the host's
  own `/srv/enliq` are invisible to Caddy. Deploy target is `/var/www/enliq/bozo/out` on the
  host, written as `root * /srv/enliq/bozo/out` in the Caddyfile.

Deploy is an rsync: `rsync -az --delete out/ researchos-server:/var/www/enliq/bozo/out/`.

### The 404 page needs server config

`file_server` answers a missing path with its own empty 404, not with `out/404.html`. The site
ships a designed 404 page (`app/global-not-found.tsx`), so without a `handle_errors` block that
page never reaches a visitor:

```caddyfile
cigercibozo.com {
    root * /srv/enliq/bozo/out
    encode zstd gzip
    file_server

    handle_errors {
        @notfound expression {err.status_code} == 404
        handle @notfound {
            rewrite * /404.html
            file_server
        }
    }
}
```

Two things that used to be listed here as unverified assumptions are now **measured against the
live demo** (12 August 2026, full probe list in `docs/surec/YAYIN-KONTROL-LISTESI.md`):

- `/menu` without a trailing slash returns `308` to `/menu/`. `trailingSlash: true` holds.
- RSC payload files whose names contain `!`, for example `menu/__next.!KHRyKQ.menu.__PAGE__.txt`,
  are served with `200`. A rule filtering unusual filenames would break in-page navigation while
  leaving every page individually reachable, a failure mode that hides well; it is not present.

The `handle_errors` block itself is also verified live: an unknown path returns `404` **and** the
designed page body, not Caddy's empty default.
