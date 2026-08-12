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

The build output in `out/` is a plain static site with no server runtime. It is meant to be
served by a static file server (Caddy `file_server`) on researchos-server, the same pattern used
for the Regulus and oykualemdar sites. `trailingSlash: true` in `next.config.ts` is required for
this: it makes `/menu` resolve to `menu/index.html` instead of a bare file the server cannot find.

Production domain: `https://cigercibozo.com`.

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

Two things to check on the server rather than assume, both unverified from this repo:

- A request to `/menu` (no trailing slash) must land on `/menu/`. `file_server` redirects
  directory requests, so this should hold, but it is what `trailingSlash: true` depends on.
- Client-side navigation fetches RSC payload files whose names contain `!`, for example
  `menu/__next.!KHRyKQ.menu.__PAGE__.txt`. Any rule that filters unusual filenames would break
  in-page navigation while leaving every page individually reachable, which is a failure mode
  that hides well.
