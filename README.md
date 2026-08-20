# Ciğerci Bozo web sitesi

Static Next.js 16 site for Ciğerci Bozo (Girne, KKTC), in Turkish and English. See `CLAUDE.md`
for architecture, design source of truth and binding copy rules.

## Requirements

- Node.js `>=22.18` (developed on v25.6.0). Next itself allows 20.9, but `npm run test` runs
  `node --test` straight over `.ts` files and needs Node's built-in type stripping, on by
  default only from 22.18.
- npm (developed on 11.11.1)

## Layout

Six routes per language: `/`, `/menu`, `/hikaye`, `/konum`, `/galeri`, `/gizlilik`, with the
English set under `/en/`. `app/` holds the two root layouts and thin page files, `components/`
the bodies, `content/` every string and price, `lib/` the shared logic, `styles/` the tokens.

## Project docs

Nothing here is decided twice. Each question has one home:

| Question | File |
|---|---|
| Where do I pick up after a break? | `docs/surec/DEVAM.md` (short by design) |
| Architecture, design source of truth, binding copy rules | `CLAUDE.md` |
| Why does this deviate from the handoff? | `docs/surec/IYILESTIRMELER.md` (every round, with its measurement) |
| What must never be changed? | `docs/surec/KISITLAR.md` |
| What is waiting on the owner? | `docs/surec/KARAR-FORMU.md` |
| Is it ready to publish? | `docs/surec/YAYIN-KONTROL-LISTESI.md`, `docs/PARITE.md` |
| What happened on which day? | `docs/surec/DEVAM-ARSIV.md` |

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

The build output in `out/` is a plain static site with no server runtime. It is served from the
Plesk subscription for `cigercibozo.com` on **arc** (`arc.megaonline.net`, `185.210.92.206`),
document root `/var/www/vhosts/cigercibozo.com/httpdocs`. `trailingSlash: true` in
`next.config.ts` is required for this: it makes `/menu` resolve to `menu/index.html` instead of
a bare file the server cannot find.

Production domain: `https://cigercibozo.com`, still a test publication. DNS is at Cloudflare,
unproxied; apex and `www` both point at the arc IP. The certificate is Let's Encrypt.

### Deploy

```bash
npm run build
rsync -az --delete out/ plesk-206:/var/www/vhosts/cigercibozo.com/httpdocs/
ssh plesk-206 'chown -R engincaglar:psacln /var/www/vhosts/cigercibozo.com/httpdocs'
```

The `chown` is not optional. `rsync -a` copies the numeric owner and the connection is `root`,
so without it every file lands owned by the local uid and Plesk's `repair fs` flags the
subscription. Deploying as the subscription's own user is not an option either: `engincaglar`
has `/bin/false` for a shell.

### Server behaviour lives in `public/.htaccess`

Next copies `public/.htaccess` to `out/.htaccess` on every build, so the two things the server
has to do are versioned with the site instead of living only on the box:

- `ErrorDocument 404 /404.html`, so the designed 404 page (`app/global-not-found.tsx`) reaches a
  visitor. Without it Plesk answers with its own `error_docs/not_found.html`.
- `X-Robots-Tag: noindex, nofollow` while this is a test publication. `robots.txt` deliberately
  still allows crawling, so a crawler can reach the page and read the header.

**Opening day is one line:** delete the `Header always set X-Robots-Tag` line from
`public/.htaccess`, then build and deploy.

### Two settings that live in Plesk, not in the repo

Both were made with Plesk's own commands, which is what the panel does. Plesk regenerates
`nginx.conf` and `httpd.conf` on its own schedule and both files say so at the top: editing them
by hand does not survive.

- **Node.js is off for this domain.** Plesk creates a Node.js subscription with
  `PassengerEnabled on` and `PassengerAppRoot .../httpdocs` in the Apache vhost. An
  `output: 'export'` build has no server to start, so Passenger was sitting in front of static
  files for nothing. Turned off with `plesk ext nodejs --disable -domain cigercibozo.com`.
  Do not re-enable it.
- **`www` redirects to the apex** through Plesk's preferred-domain setting,
  `plesk bin site --update cigercibozo.com -seo-redirect non-www`, which shows up in the panel as
  Hosting Settings > Preferred domain.

After changing either, apply with `plesk sbin httpdmng --reconfigure-domain cigercibozo.com`,
then check `nginx -t` and `plesk repair web -n` (the `-n` is a dry run).

### Measured live on arc, 20 August 2026

Seventeen URLs answer `200`: six pages in two languages, plus `robots.txt`, `sitemap.xml`,
`icon.svg`, `apple-icon.png` and `sosyal-kart.png`. Beyond that:

- `/menu` without a trailing slash returns `301` to `/menu/`. `trailingSlash: true` holds.
  (Caddy used to answer `308` here; both are permanent, Apache's `mod_dir` just picks `301`.)
- `www` and plain `http` both return `301` onto `https://cigercibozo.com`.
- An unknown path returns `404` **and** the designed page body, not Plesk's default.
- RSC payload files whose names contain `!`, for example `__next.!KHRyKQ.__PAGE__.txt`, are
  served with `200`. A rule filtering unusual filenames would break in-page navigation while
  leaving every page individually reachable, a failure mode that hides well; it is not present.
- `/.htaccess` returns `403`.
- Responses are Brotli-compressed.

Two things are not set and are worth knowing. `_next/static` assets carry no `Cache-Control`
header even though their filenames are content-hashed, so every asset costs a revalidation round
trip. And the certificate is a wildcard obtained through DNS-01, which needs an `_acme-challenge`
TXT record written at renewal time; the zone is on Cloudflare, where Plesk cannot write unless
the Cloudflare DNS extension is given an API token.

### Previous host

Until 20 August 2026 the site was served by Caddy `file_server` on researchos-server from
`/var/www/enliq/bozo/out`, configured in `/opt/docker/caddy/Caddyfile` inside a `caddy:2-alpine`
container. That box still serves the demo at `https://bozo.crimsoninnovate.com` from the same
directory, which no longer receives deploys and will drift. The Caddy-era traps are recorded in
`docs/surec/DEVAM-ARSIV.md`.
