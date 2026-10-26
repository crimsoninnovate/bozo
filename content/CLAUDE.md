# content: copy, prices, hours and contact data

The root `CLAUDE.md` applies here too. Everything a guest reads lives in this folder, never
hardcoded in JSX.

## Prices and panel data

Prices, names, descriptions, skewer counts, sold-out flags, the announcement, the treats and the
contact details all live in the menu document and change through the staff panel (`/yonetim/`;
the menu API has been live since 26 October 2026). What shows at once and what needs a deploy is
the table in `README.md` > Publishing > Deploy.

The build bakes the live version in (`scripts/menuCek.ts` writes the gitignored
`content/menu.canli.json`). A stale but valid `menu.canli.json` from an earlier build wins over a
newer seed: delete it to force the seed. The seed `content/menu.varsayilan.json` is the fallback,
plus its expectation table in `content/icerik.test.ts` and `lib/menu/varsayilan.test.ts`: change
all three together. The panel pins Ciğer as the first item (the signature slot): it cannot be
deleted or moved. Chip texts stay in the `content/{tr,en}` dictionaries, outside the panel.

Skewer counts (`porsiyonNotu` / `durumNotu`) are the owner's: portions 19 October 2026, wraps
24 October 2026 (a wrap carries the same count as the portion). Menu rows and JSON-LD follow
the document on their own.

Two places hold copy that the document can outdate:

- The menu opening sentence, meta description and the home page note `ana.ocakbasi.altNot` take
  their counts from the document (`{kalem}`, `{ikram}`, `acilisSpotu` in `lib/menu/sayilar.ts`),
  so adding items is safe. The note's "Beş ürün" / "Five dishes" is still hand-written.
- `kalemAdlari` in `content/tr/oyun.ts` (the game's item names, now including domates and sogan)
  is a copy of the document's names. The game runs in the browser and cannot read the document,
  so it can drift; `content/icerik.test.ts` compares it with the seed only.

`llms.txt` (`lib/llmsTxt.ts`) has a `## Menü` section: item names only, Turkish only, no prices.
It changes on a deploy. The sold-out flag is same-day, so static outputs ignore it: `llms.txt`
lists a sold-out item like any other, the JSON-LD keeps `InStock`, and the menu page's baked HTML
has every item in stock (`tukendisiz`). Only the menu page's live fetch shows it.

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
