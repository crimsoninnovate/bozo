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
