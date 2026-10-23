# content: copy, prices, hours and contact data

The root `CLAUDE.md` applies here too. Everything a guest reads lives in this folder, never
hardcoded in JSX.

## Prices

A price change is `content/urunler.ts` plus the expectation table in `content/icerik.test.ts`;
skewer counts are `porsiyonNotu` / `durumNotu` in `content/{tr,en}/menu.ts`. Menu rows and
JSON-LD follow on their own.

## Copy rules (binding, a violation is a bug)

- No em dash (U+2014) as punctuation; use a colon, comma, or period. No circumflex accents. No
  all-caps sentences. Exclamation marks are rare.
- Hours are written `10:00 - 05:00`.
- **Case, owner's decision 12 August 2026.** Title case on three things only: product names
  (`Terbiyesiz Tavuk Şiş`), section and menu labels (`Ocakbaşı`, `From the Fire`), CTA and nav
  labels (`Yol Tarifi Al`, `See the Menu`). Page headings and body copy stay sentence case:
  `Girne uyurken ocak yanıyor` is a sentence, not a label. English keeps its own title case, so
  short words stay lowercase (`On the House`). Screen-reader-only labels are untouched.
- **The owner's name, owner's decision 23 August 2026.** The site says `Bozo Çağlar` and
  nothing else (`isletme.sahip`, the überlines, his signature). The handoff and
  `metin-envanteri.json` still say `Engin Çağlar`, so a parity round will see the difference;
  `content/icerik.test.ts` fails if it returns.
- Locked terminology: misafir (never müşteri), ikram (never bedava), ocak/kor (never mangal),
  usta (never şef), tane (never parça), şiş/porsiyon (never adet), sofra (never masa), "gece
  açığız" (never 7/24).
- **Never invent new marketing copy.** Text comes verbatim from `docs/tasarim/metin-envanteri.json`
  or the `.dc.html` files. One exception: copy the owner writes himself (`hikaye.lakap`, 19 August
  2026). Such a block needs the record `IYILESTIRMELER.md` > "lakap bölümü" has: source, what was
  edited, what was deliberately left out.
