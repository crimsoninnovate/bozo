# content: copy, prices, hours and contact data

The root `CLAUDE.md` applies here too. Everything a guest reads lives in this folder, never
hardcoded in JSX.

## Prices

Prices, names, descriptions and skewer counts live in the menu document and change through the
staff panel (`/yonetim/`, Menü tab; the menu API has been live since 26 October 2026).
The build bakes the live version in
(`scripts/menuCek.ts` writes the gitignored `content/menu.canli.json`); the menu page also
refreshes prices in the browser, but JSON-LD, `llms.txt` and meta only change on a manual build
and deploy. A stale but valid `menu.canli.json` from an earlier build wins over a newer seed:
delete it to force the seed. The code path is only the seed `content/menu.varsayilan.json`, which
the site falls back to, plus its expectation table in `content/icerik.test.ts` and
`lib/menu/varsayilan.test.ts`: change all three together. Ikram items and chip texts stay in the
`content/{tr,en}` dictionary and `content/urunler.ts`, outside the panel. The panel pins Ciğer as
the first item (the signature slot): it cannot be deleted or moved.

Skewer counts (`porsiyonNotu` / `durumNotu`) are the owner's: portions 19 October 2026, wraps
24 October 2026 (a wrap carries the same count as the portion). Menu rows and JSON-LD follow
the document on their own.

The count "Yedi porsiyon" / "Seven portions" is hardcoded copy in `content/{tr,en}/menu.ts` (menu
spot) and `content/{tr,en}/ortak.ts` (menu meta description). Adding or deleting items in the
panel makes it wrong; only `menu_porsiyonSayisi_metindekiSayiylaAyni` in `content/icerik.test.ts`
guards it, and only against the seed. Owner decision pending: do not change that copy.

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
