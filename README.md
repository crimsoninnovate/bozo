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

## Score server

`sunucu/` is the game's score server (spec `docs/specs/2026-10-08-oyun-design.md` §10), an npm
workspace: the root `npm install` installs its one dependency (`mariadb`), and the root
`npm run typecheck` and `npm test` cover its files. Run it locally against the in-memory store:

```bash
GIZLI_TUZ=yerel KOKEN=http://localhost:3000 PORT=8402 node sunucu/ana.ts
NEXT_PUBLIC_OYUN_API=http://127.0.0.1:8402 npm run dev   # the site reads the API base at build time
```

Environment (all read in `sunucu/ana.ts`): `PORT` (8402), `KOKEN` (CORS origins, comma-separated,
default `https://cigercibozo.com`), `GIZLI_TUZ` (prize-code HMAC secret, required), `DB_URL`
(`mariadb://user:pass@host:3306/db`; without it the in-memory store is used and nothing survives a
restart), `YONETIM_KULLANICI` and `YONETIM_SIFRE` (basic auth for `/yonetim/*`; without both the
admin endpoints answer 503), `GUVENILIR_VEKIL` (the local reverse proxy in front of Node, default
`127.0.0.1,::1`), `KAMPANYA_BITIS` (ISO date; champion records are purged 90 days after it).

Schema: `sunucu/sema.sql` (MariaDB 10.11). Production build: `npm run build -w sunucu` emits
`sunucu/dist/` (`tsc` with `rewriteRelativeImportExtensions`), started with `npm start -w sunucu`.
The MariaDB adapter test runs only when `BOZO_TEST_DB_URL` points at a throwaway database:

```bash
docker run -d --name bozo-maria -e MARIADB_ROOT_PASSWORD=sifre -e MARIADB_DATABASE=bozo_test \
  -p 127.0.0.1:3399:3306 mariadb:10.11
BOZO_TEST_DB_URL=mariadb://root:sifre@127.0.0.1:3399/bozo_test node --test sunucu/mariaDepo.test.ts
```

Not deployed yet: subdomain, DNS, Plesk Node.js app and database are plan 4, each step with its
own approval, after the privacy text changes and the lawyer's review.

`GUVENILIR_VEKIL` must cover every local hop in front of Node (Plesk: nginx, then Apache); the
first untrusted `X-Forwarded-For` hop from the right is the peer. After deploy, check that a forged
`CF-Connecting-IP` sent straight to the origin is ignored, or every visitor shares one rate limit.

## Publishing

The build output in `out/` is a plain static site with no server runtime. It is served from the
Plesk subscription for `cigercibozo.com` on **arc** (`arc.megaonline.net`, `185.210.92.206`),
document root `/var/www/vhosts/cigercibozo.com/httpdocs`. `trailingSlash: true` in
`next.config.ts` is required for this: it makes `/menu` resolve to `menu/index.html` instead of
a bare file the server cannot find.

Production domain: `https://cigercibozo.com`, **live and open to search engines since
24 August 2026**. DNS is at Cloudflare and
the apex is **proxied** (measured 20 August 2026: `server: cloudflare`, `cf-ray`,
`cf-cache-status`). `www` and apex both resolve onto the arc IP. The certificate is Let's Encrypt.

**What the proxy means for a deploy.** HTML is not cached (`cf-cache-status: DYNAMIC`), so pages
go live the moment rsync finishes. Static assets are: `cache-control: max-age=14400`, four hours
at the edge. Two consequences:

- Changing an asset **in place** (same filename) can serve the old bytes for up to four hours.
  Verify with `curl -sI ... | grep cf-cache-status` and compare byte sizes against `out/`; purge
  from the Cloudflare dashboard if it matters.
- Deleting an asset does not delete it from the edge. `sosyal-kart.png` kept answering `200`
  after `rsync --delete` removed it; `?x=1` on the same URL returned `404` from the origin.
  Harmless when nothing references the file any more, otherwise purge.
- Cloudflare's Email Address Obfuscation rewrites the two privacy pages on the way out: the
  `mailto:` link becomes `/cdn-cgi/l/email-protection#...` plus an injected decoder script
  (measured 8 October 2026, +245 bytes). Their live HTML never hashes equal to `out/`; compare
  the file on the server instead. With JS the link decodes to the right address.

### Deploy

```bash
npm run build
rsync -az --delete out/ plesk-206:/var/www/vhosts/cigercibozo.com/httpdocs/
ssh plesk-206 'D=/var/www/vhosts/cigercibozo.com/httpdocs;
  chown -R engincaglar:psacln "$D" && chown engincaglar:psaserv "$D" && chmod 750 "$D"'
```

The `chown` is not optional. `rsync -a` copies the numeric owner and the connection is `root`,
so without it every file lands owned by the local uid and Plesk's `repair fs` flags the
subscription. Deploying as the subscription's own user is not an option either: `engincaglar`
has `/bin/false` for a shell.

**The second `chown` is not optional either.** `httpdocs` itself is not one of its own
contents: Plesk wants the directory `engincaglar:psaserv 750` and everything inside it
`engincaglar:psacln`. A plain `chown -R` sweeps the directory in too and `plesk repair fs`
then reports `Incorrect group of .../httpdocs/.: expected is psaserv (1002), actual is
psacln (1003)`. Measured on the 20 August 2026 deploy; `rsync -a` also carried `out/`'s
own `755` onto it, hence the `chmod`.

Verify after every deploy:

```bash
ssh plesk-206 'plesk repair fs cigercibozo.com -n'          # expect: [OK], 0 errors
curl -sI https://cigercibozo.com/ | grep -ci x-robots-tag   # expect: 0, the site is indexed
rsync -az --delete --checksum --dry-run --itemize-changes \
  out/ plesk-206:/var/www/vhosts/cigercibozo.com/httpdocs/  # expect: no file lines
```

That last line is the only honest "is the deploy complete" check. A plain dry-run is not:
`rsync` compares mtime by default, and a clean rebuild resets every timestamp, so it reports
changes that are not there. `--checksum` compares content. Note also that a clean rebuild
mints a new Next build ID, which every HTML file embeds in its asset paths: after a
`rm -rf out && npm run build` all twelve routes genuinely differ even when nothing changed.

### Server behaviour lives in `public/.htaccess`

Next copies `public/.htaccess` to `out/.htaccess` on every build, so the two things the server
has to do are versioned with the site instead of living only on the box:

- `ErrorDocument 404 /404.html`, so the designed 404 page (`app/global-not-found.tsx`) reaches a
  visitor. Without it Plesk answers with its own `error_docs/not_found.html`.
- Content types Apache does not know: `charset=utf-8` on `.txt` (llms.txt), and
  `application/manifest+json` on `.webmanifest`.
- Security headers (since 8 October 2026): HSTS (one year, no `includeSubDomains`),
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`. `_next/static` gets a one-year
  `immutable` cache: those filenames change whenever their content does.
- `X-Powered-By: PleskLin` cannot be removed here: `Header unset` in this file left it in place
  (tested 8 October 2026), so it is added outside Apache's reach. Removing it is a Plesk setting.
The `X-Robots-Tag: noindex, nofollow` line that used to sit here was deleted on 24 August 2026
(commit `290052f`), which is what opened the site to search engines. `robots.txt` already said
`Allow: /`, so removing the header was the whole of it. Do not add it back without a reason.

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

Twelve routes answer `200` (six pages in two languages), plus `robots.txt`, `sitemap.xml`,
the favicon set (`favicon.svg`, `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`,
`web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`, `site.webmanifest`), the badge
`marka/rozet.svg`, the two social cards `sosyal-kart.jpg` / `sosyal-kart-en.jpg` and the photos
under `foto/`. `app/icon.svg` and `app/apple-icon.png` were removed on 20 August 2026: the
favicon set replaced them and two icon systems side by side let the browser pick. Beyond that:

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
container. The `cigercibozo.com` and `www.cigercibozo.com` blocks were removed from that
Caddyfile the same day; the backup is `Caddyfile.bak-20260820-arc` next to it. The box still
serves the demo at `https://bozo.crimsoninnovate.com` from the same directory, which no longer
receives deploys and will drift.

**A third Caddy trap, found while removing those blocks.** The Caddyfile is bind-mounted into
the container as a *single file*, and Docker binds the inode, not the path. `sed -i` does not
edit in place: it writes a new file and renames it over the old one, so the inode changes, the
host sees the edit and the container does not. `caddy reload` then reports success while reading
the old config. Confirmed by counting the same string on both sides: 0 on the host, 2 inside the
container. The fix without downtime is to write through the container,
`docker exec -i caddy sh -c 'cat > /etc/caddy/Caddyfile' < /opt/docker/caddy/Caddyfile`, and
reload again. The two files stay separate inodes until the container is restarted, so verify
inside the container after any edit, never on the host alone.

### Measured against the old host, 20 August 2026

Both boxes sit in the same `185.210.92.0/24`, so the network leg is identical (~235 ms TLS and
transit from the measuring machine either way). Twenty-five interleaved rounds against the same
build, alternating hosts to cancel connection drift, time to first byte with TLS excluded:

| Host | Stack | TTFB | Same request measured on the box itself |
|---|---|---|---|
| researchos | Caddy `file_server` | 116 ms | 2 ms |
| arc | Plesk, nginx | 173 ms | 12 ms |

arc is the bigger machine (8 cores against 4, 11 GB RAM against 7, 30 GB free disk against 11)
and both sit near idle, so this is the software stack, not the hardware. Plesk's nginx serves
static files itself; going through Apache instead costs 66 ms on the same box, which is what the
`X-Accel-Internal` line in the generated vhost avoids.

The gap matters less than it looks: Cloudflare now proxies the domain and caches `_next/static`
at the edge (`cf-cache-status: HIT`), so only the HTML document reaches the origin at all.
