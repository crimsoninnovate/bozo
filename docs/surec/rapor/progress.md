# SDD ledger — plan: docs/plans/2026-08-11-web-uygulama-plani.md

Branch: feat/site-kurulumu
Kararlar: SITE_URL = https://cigercibozo.com (kullanıcı onayı, 11 Ağustos 2026)
Ön-uçuş: `npm test` betiği çıplak `node --test` yapıldı (kabuk globu Task 2'de patlıyordu).

Task 1: implemented (commit 939ca0d), review: spec issues found (1 Important)
Task 1: minor (deferred): package.json has no engines field pinning Node >=20.9.0
Task 1: minor (deferred): no corner-radius token in styles/tokens.css despite the 0-3px project rule
Task 1: warn resolved: tabular-nums is applied per component (Task 4, 8), not in tokens. Not a gap.
Task 1: warn resolved: keyframe durations are wired to elements in Task 5. Not a gap.
Task 1: warn resolved: panel/shadow alpha values come verbatim from the design; the cream opacity scale binds text only. Constraint wording was too absolute, tightened for later reviewers.
Task 1: fix round 1/5 (1 addressed, 0 open; commits 939ca0d..de2d32d)
Task 1: complete (commits a5c1991..de2d32d, review clean)

Task 2: implemented (commit d13eaa3), review: 2 Important, both plan-inherited
Task 2: adjudicated: GECE_BASLANGICI stays exported (business constant like ACILIS_SAATI); the plan's interface list was incomplete and was corrected instead
Task 2: minor (deferred): girneParcalari has no direct test, only transitive coverage through its two callers
Task 2: minor (deferred): the % 24 midnight guard is unreachable on this Node build, kept as portability insurance
Task 2: watch (cross-task): downstream UI must read gosterimGunIndeksi for the "Bugun" row, not Durum.gunIndeksi. Verify in Task 8 (SaatTablosu) and Task 13.
Task 2: fix round 1/5 (2 addressed, 0 open; commits d13eaa3..6e4aafe)
Task 2: complete (commits 800aa9a..6e4aafe, review clean, 13/13 tests)

Task 3: implemented (commit aa399b2), DONE_WITH_CONCERNS, 21/21 suite
Task 3: adjudicated: binaNo is verified after all ('Sht. Ozdemir Apt No:4', present in the .dc.html files and the handoff README). The inventory extraction only read the brief and project info file. Plan corrected.
Task 3: adjudicated: ICECEK_YER_TUTUCU_ADEDI is 1, counted from the design (one dashed slot after three named drinks). Plan said 3, that was a misreading of the brief ellipsis. Plan corrected.
Task 3: adjudicated: menu horizontal liver plate reuses FotoId 'tane-yakin-cekim'. The manifest keys shots, not croppings.
Task 3: carry to Task 6: ortak.footer.isimNotu (EN-only "lifelong nickname" line) has no design slot and must be rendered in the footer.
Task 3: carry to Tasks 10/11: product arrays are keyed by literal id; consumers need a typed lookup under noUncheckedIndexedAccess.
Task 3: carry to Task 14: gizlilik copy is authored placeholder, Task 14 owns final wording.
Task 3: fix round 1/5 pre-review (2 corrections applied; commits aa399b2..245b30b, 24/24 suite)
Task 3: probe: Next 16.3 + Turbopack resolves the .ts extension specifiers used by content/. Verified by a temporary page importing sozluk('tr'): build compiled, static page generated, out/index.html carries "Ciğerci Bozo" with correct Turkish characters. Probe reverted, tree clean.
Task 3: known non-issue: the editor LSP reports "Cannot find module './tr/index.ts'" across content/. tsc 5.9.3 with allowImportingTsExtensions passes clean and the build works. Editor tooling artefact, not a code defect.
Task 3: review APPROVED. Copy audit structural: 102/102 TR-EN pairs match the design data-en byte for byte; 21 unsourced TR leaves equal the disclosed set exactly. No fabricated copy.
Task 3: ruling: "Masadaki QR menu" stands. The sofra-not-masa lock is scoped "(yemek baglaminda)"; a QR stand sits on furniture, not on the laid meal.
Task 3: minor (deferred): report under-counted EN leaves without data-en (said 45, actual 53); implementer correcting the disclosure list, no code change
Task 3: minor (deferred): icecekler_tekYerTutucuSlotuVardir asserts a constant equals its literal; kept deliberately as a spec lock
Task 3: open question to owner: design writes "Usul Urfa'dan" with u-umlaut; TDK standard is "usul"
Task 3: open question to owner: "Girne Macro Market, 80 m" is a distance claim with no entry in isletmeGercekleri
Task 3: fix round 2/5 (1 addressed: price-null guard, proven by mutation with tsc clean on the mutated tree; commit 8535fe1)
Task 3: owner decisions applied as fix round 3: "Usul" spelling corrected, "80 m" distance claim removed from the neighbour chip. Recorded in iyilestirmeler.md as approved departures from the handoff, so parity checks must not read them as regressions.

Task 4: implemented (commit 4d48b95), DONE_WITH_CONCERNS, verified in a real browser via Playwright (hover measured, touch targets measured)
Task 4: ruling: Cip radius 0 (three design files beat one line of plan prose); InstagramIkon stroke-based (verified source governs). Both in the implementer's favour.
Task 4: defect found by the implementer and confirmed: .koyu:hover used the invented colour #241e1b, which appears zero times in the handoff and is a ninth hue outside the approved palette. Corrected to the design's real behaviour. Plan corrected too.
Task 4: carry to page-assembly tasks (9-13): real chips vary 11.5px to 17px per usage; the shared Cip carries a default and callers pass their own sizing.
Task 3: fix round 3/5 (4 items addressed, 0 open; commits 245b30b..93013c0)
Task 3: minor (deferred): the new distance regex would not catch a future English plural "80 metres" (word boundary fails between e and s). Not a defect today, the only value in scope was "80 m".
Task 3: complete (commits 6e4aafe..93013c0, review clean, 26/26 tests, no fabricated copy)
Task 4: review NEEDS FIXES. Two Important, both further errors in my brief.
Task 4: confirmed myself against Menu Sayfasi.dc.html: the karo tile has no border, no corner marks, no inset shadow; ground #0C0A09, ember stain radial, caption inside at left:12px bottom:11px. The brief was wrong on all four.
Task 4: confirmed myself: the ikram badge is plain text, font 600 15px/1 Inter, color #FAAA1F, no border, no ground. The brief made it a bordered cream chip.
Task 4: new token --plaka-zemin: #0C0A09. Appears 15 times in Menu Sayfasi.dc.html and zero times in the other four files. It is the menu page's plate ground, missing from the brand book's palette list.
Task 4: ruling: the icons keep a single square `boy` prop; .koyuOutline:hover IS traceable (style-hover in both Ana Sayfa and Konum raw files), the reviewer only checked konum.json.
Task 4: carry to Task 11: the menu signature plate is a fourth FotoYuvasi variant. flex:1 1 520px; min-height:clamp(340px,46vh,480px); background #0C0A09; 26px diagonal corner marks inset 20px in rgba(250,170,31,.55); emberSoft 9s stain rgba(183,53,28,.5); inset 0 0 120px rgba(0,0,0,.7); hover inset 0 0 120px rgba(183,53,28,.4).
Task 4: fix round 2/5 (2 addressed: karo tile rebuilt, ikram chip corrected; commit 66bf5df). New token --plaka-zemin added.
Task 4: implementer found a dead .kor layer with no CSS anywhere and scoped it to .karo as the ember stain. Correct.
Task 4: implementer found and I confirmed: portre and genis plates carry NO background in the design, only border + inset shadow. The plate is a window onto the ember scene; a ground would mute the glow. Fix round 3 dispatched. Plan corrected with the reasoning so it is not re-added later.
Task 4: DEPENDENCY for Task 5: the ember scene must sit behind content at a z-index that lets it show through transparent photo plates. Verify when Task 5 lands.

Task 5: implemented (commit b5b68c0), DONE_WITH_CONCERNS, measured in browser
Task 5: confirmed from the design's cerceve(): the ember core DOES track intensity, min(1, 0.24 + y*0.6). My brief omitted it.
Task 5: confirmed: the reveal is continuous and reversible, not a one-shot observer. opacity 0.86 + o*0.14, translateY (1-o)*14px, o from visible ratio over min(height, screen*0.62).
Task 5: ARCHITECTURE CORRECTION: the design runs one rAF frame doing four jobs. My plan split it across three components with three listeners and three rect passes, risking visual desync between the ember and the bead rail. Consolidating into lib/cerceve.ts, a subscriber-based loop. KorSahnesi, Bolum and BeadRay all subscribe. Task 6 notified.
Task 5: ORCHESTRATION FEEDBACK from the agent, accepted: concurrent agents shared a browser tab and dev server, making measurements flaky. From here on, browser-verifying tasks run one at a time.
Task 4: fix round 3/5 (3 items + token addressed, 0 open; commits 82dd0f8..7278a4f)
Task 4: complete (commits a5c1991..7278a4f, review clean, every value verified byte-for-byte against the design)
Task 8: fix round 1/5 (2 addressed, 0 open; commits ab754dd..698190b). Nine cream tokens added, .55 through .82.
Task 8: verified premise: the small hero size really is used on two pages (Konum and Menu), byte-identical, so the named-variant decision rests on a true premise. A real 0.01em letter-spacing conflict between the two pages was resolved toward Konum and documented in-code.
Task 8: minor (deferred): FotoYuvasi.module.css:58,72 use raw rgba cream literals that could now use --krem-72 and --krem-68; TaneDizilimi.module.css:5 uses a raw rgba border at the text/structural boundary.
Task 8: complete (commits 800aa9a..698190b, review clean)

Task 16 added (owner decision, 11 Aug 2026): design/motion/UX audit runs AFTER the whole structure is built, not during. Skills to use: frontend-design, ui-ux-pro-max, design-taste-frontend, awwwards-animations, high-end-visual-design.
Task 16 framing: audit EXECUTION QUALITY, not aesthetics. The client's design is approved and its brand locks are hard; no skill may impose its own taste. Transferable rules from awwwards-animations: animate only transform and opacity, will-change sparingly, 60fps on scroll, no leaks on unmount, no layout shift, reduced-motion fully honoured.
Task 5: fix round 1/5 (frame loop consolidated, cekirdek intensity added, continuous reveal proven reversible 0.910 -> 0.985 -> 0.910; commit 01b0e66). Measured exactly 1 scroll + 1 resize listener with 4 subscribers.
Task 5: RULING on reduced motion (fix round 2): the design guards only the erit forEach, leaving the ember scale to snap on every scroll frame once transitions are killed. That is not a deliberate accessibility decision. New rule, now in kisitlar.md: opacity tracking stays, scroll-driven transforms are pinned, the bead indicates by colour not scale, reveal translations off.

PRE-DISPATCH AUDIT of the five page briefs (workflow, 5 agents, 568k tokens): 65 deviations + 73 omissions = 138 findings, 64 of them structural. My page briefs were substantially wrong.
Pattern: 41 of the 64 structural findings name a shared component that cannot express the design. The primitives were built from my brief's ASSUMED usages, not the real ones.
Known breaks: TaneDizilimi always renders 6 squares (the menu row needs 3) and derives the small square as boy*0.625, wrong in 3 of 4 usages (20->13 vs design 12; 22->14 vs 13; 9->6 vs 5), no per-square colour or opacity control. FotoYuvasi accepts no children but the design nests the bead rail inside the plate, so my brief's code would not even compile. Cip's home-page ikram chip is a boxed two-line card (name + detail), not the plain-text variant. AnimasyonluSayac renders 0 into the static HTML while the design carries the target value in the markup and only overwrites it, so without JS or before hydration the number reads 0. CamPanel cannot express the Ocaktan padding or its max-width. MenuSatiri hover is padding-left, not translateX, which would shift the row's own background and underline.
DECISION 1: new Task 17 hardens the shared primitives against every real usage, BEFORE tasks 9-13.
DECISION 2: for tasks 9-13 the design file becomes the spec, not my brief. The briefs get rewritten to point at the .dc.html plus denetim-task-N.json, because a paraphrase of a fully specified design added negative value.

CONTROLLER ERROR, recorded: I ran `git add -A` while two agents were mid-implementation and swept their in-flight work into my documentation commit 615383b: all of components/layout/ (1382 lines), lib/site.ts and its test, Task 5's edits to KorSahnesi/ImlecKoru/Bolum, and Task 6's temporary route app/(tr)/gecici-kabuk/. No code was lost, but a "docs:" commit now carries two tasks' code and a scratch route entered git history.
Not rewriting history: Task 6 is still working in this tree and a reset would destroy its state. Task 6 has been told its work is committed and must delete the temporary route in its own commit.
RULE for the rest of this project: never `git add -A` in a shared tree. Always path-scope the stage to files I actually authored.
CLEANUP GATE for Task 15: verify no `gecici-` route exists in the build's route table and none remains in the tree.
Task 5: fix round 2/5 (reduced-motion ruling implemented; commit f12cd53 plus edits captured in 615383b). Measured: kor transform identical scale(1.06) at three intensities while opacity differed 0.51/0.79/1.
Task 5: open inconsistency reported by the agent, deferred: KorSahnesi re-reads the reduced-motion preference every frame while Bolum and ImlecKoru read once at mount. No matchMedia change listener was added, per instruction. Decide in Task 16.
Task 5: re-review verified all four items. One new finding introduced by the fix itself: adding the per-frame cekirdek opacity write made a missing CSS transition load-bearing. The design gives cekirdek `transition:opacity .9s ease-out; will-change:opacity`; the port kept both on kor and dropped both on cekirdek, so the core would pop at every section boundary beside a glow that eases. Fix round 3 dispatched, plus a sweep for the same omission on the other scene layers.
Task 6: implemented (commits in 615383b + 6d96458), DONE_WITH_CONCERNS, verified in an isolated headless browser the agent started itself to escape the shared-tab contention I caused. Review dispatched.
Task 3 addendum: complete (commit 013bf79, 14/14). Three key groups added. The short directions label turned out to be transcribable after all: Mobil Prototip.dc.html already uses the short form on both bottom bars and the long form in the top bar, so only the English was authored. Screen-reader names went into a separate ortak.erisim group so they cannot be rendered as visible text by mistake.
Task 3 addendum: authored-string disclosure now 59 EN leaves and 13 TR leaves, each with reasoning.
Task 5: fix round 3/5 (cekirdek transition restored; commit eecd7d5). Sweep verified all seven scene layers against the design; only deliberate non-match is the wrapper's will-change:transform, omitted because the port replaced the scroll-lock transform with position:fixed.
Task 5: complete (commits 6e4aafe..eecd7d5, review clean). Scratch route deleted, route table clean.
Task 6: review NEEDS FIXES. Three Important: (1) stale hardcoded strings where the content addendum has since added the exact keys, a side effect of my parallel dispatch: the gap was closed in content/ after the shell was written and never wired up; (2) the focus trap depends on `kapat`, a fresh closure per render, so once the shell mounts on real routes any parent re-render while the drawer is open snaps focus back to the first link; (3) footer, nav and language-switch targets are under 44px while the codebase's own Buton bakes in min-height 44px.
Task 6: minors folded into the fix: --krem-62 used where the design says .6 and --krem-60 exists (exactly the rounding the rule forbids); the address test never asserts binaNo appears, so a regression dropping it would pass.
Task 6: minors deferred: mobile night-strip alpha, brand mark's mobile size variant, multiple independent 1s clock intervals (pre-existing hook pattern from Task 8).
Task 6: nav landmark labels have no dictionary key. Requested from the content owner as three named regions, since a page with three unnamed nav landmarks is unnavigable by screen reader.
Task 3 addendum 2: complete (commit 247e405, 15/15). Two landmark names, not three. The agent declined the third with proof: AltBilgi.tsx contains zero <nav> elements, so the key would have been dead. It also reframed the defect correctly: both components carried the IDENTICAL string, so the real fault was sameness rather than hardcoding, and a test now holds them apart. It avoided "Menü" in the landmark names because on this site "Menü" is the food menu and a route, so "Ana menü" would collide precisely for users who cannot see the layout.
COORDINATION FIX: Task 17 removed TaneDizilimi's `boy` prop and broke UstBar.tsx and AltBilgi.tsx. I had told Task 17 not to touch components/layout/, which was right about ownership and wrong about completeness. Scope corrected: whoever changes a shared API owns migrating every call site, with a migration table in the report. Task 6 told to leave those three call expressions alone.
OPEN: the privacy page is still unreachable. ortak.nav.gizlilik renders only as the page's own h1; AltBilgi has no page-links column, which is also why ortak.footer.sayfalarBaslik renders nowhere. Assigned to Task 6, with a note that creating a column would revive the third landmark decision.
Task 7: implemented (commit be51a74, 24 files, 50/50 tests with 11 new for metadata and structured data). Ten routes, correct html lang, hreflang tr/en/x-default, sitemap and robots. Structured data verified by hand: one unsplit overnight spec, no telephone/geo/email/sameAs/priceRange, servesAlcohol false, street address with the building number.
Task 7: the implementer dropped the brief's priceRange '$$' on its own initiative, reasoning that every menu price is null so a price range would be an invented fact. Correct, and applied without being told.
Task 7: OWNER DECISION 11 Aug 2026: addressCountry stays "CY". KKTC has no ISO 3166-1 code, schema.org recommends the two-letter ISO form, and Google Maps places Girne under Cyprus. The visible address text stays "KKTC" and does not change.
Task 7: carry to Task 14: GizlilikSayfasi.tsx now already exists as a stub; that task modifies rather than creates it.
Task 7: to judge in review: the shell lives in components/sayfa/Kabuk.tsx composed per page, because App Router layouts cannot see per-page props like the active route.
Task 7: review APPROVED, no Critical or Important findings. Reviewer singled out the structured-data tests for covering both directions: that null fields are absent, and that they appear once real data exists, so the no-fabrication constraint cannot silently regress when a phone number is finally filled in.
Task 7: minor (deferred): lib/metadata.test.ts asserts against the literal domain string rather than importing SITE_URL, so it would not catch a regression that hardcoded the domain. Also lib/jsonld.ts conditions email and sameAs beyond the brief's example, harmless and well-tested but unrequested scope.
Task 7: complete (commit be51a74, review clean, 50/50 tests). Ten routes, correct lang and hreflang, sitemap, robots, clean structured data.
Task 17: implemented (commit 7b04cec, 17 files). Usage matrix of 45 cells measured against the design; all match. It caught a defect unreadable from CSS: every chip variant's `font` shorthand was resetting font-variant-numeric, silently disabling tabular-nums on all six.
Task 17: the "hue outside the brand book" it flagged is Nar #7A1F2B, documented at brief line 100 as a limited accent for the bostana and pomegranate connection. The design uses it exactly twice, on the ikram plates, where bostana lives. My palette list was built from the brand book's six tokens rather than the brief's seven. Nar added to kisitlar.md; token renamed from --kor-visne to --nar.

=== DURUM OZETI, baglam basincina karsi ===
Kapanan: 1, 2, 3 (+3 ek tur), 4, 5, 7, 8
Aciik: 6 (duzeltme turu 2 calisiyor), 17 (inceleme calisiyor)
Bekleyen: 9, 10, 11, 12, 13 (sayfalar, teker teker, tarayici olcumu gerekiyor), 14, 15, 16
Sayfa gorevleri icin ortak cerceve hazir: sayfa-gorevi-cercevesi.md. Gonderirken oraya yonlendir.
Sayfa gorevlerinin spec'i benim brief'im DEGIL: .dc.html dosyasi + denetim-task-N.json.
Task 17 raporu bir karar tablosu ve bir ilke tasiyor; sayfa gorevleri onu okumali.
Task 3 addendum: complete (commit fac8f05, 16/16). Ikinci FotoId eklendi (tane-yakin-cekim-yatay). Gerekce: ayni ozne UC yuvada, ikisinin en-boy orani uyusmuyor (1.67:1 ve ~kare), tek dosya ikisini de cerceveleyemez. Onceki "kadraj degil cekim" kuralini mekanik uygulamamis, yeniden okuyup ikinci kompozisyon oldugunu gormus. Foto brief'i 15 -> 16 kare.
Task 3 addendum: flagged, not changed: ocaktanUrunler[0].fotoId hala tane-yakin-cekim'i isaret ediyor; menu spread'ini kuran gorev orada yatay id'yi acikca vermeli.
Task 17: fix round 2, kod degismedi. On iki tutarsizlik 7b04cec'teki haliyle kapandi. Ilke: aciklanamayan cesitlilikte cogunluga normalize et; cesitlilik kasitli bir adim olabilirse ikisini de koru ve adlandir. Ayirt edici test: farkin gerekcesini soyleyebiliyor musun.
Task 17: iki turev, ajanin cikarimi: asimetrik maliyet (iki varyanti sonra birlestirmek ucuz, silineni geri getirmek degil) ve yaygin durum prop, nadir durum slot.
Task 17: Menu:289 golgesiz buton normalize edildi ve tabloda isaretlendi; menu sayfasini kuran gorev tasarimin cizmedigi bir golge gorecek, surprizle degil bilerek karsilasacak.
Task 6: ACIK: landmark anahtarlari (erisim.anaGezinme, mobilGezinme) hala tuketilmiyor; ikisi de ayni hardcoded etiketi basiyor. Bu benim hatam, anahtar geldiginde takip mesajini gondermedim.
Task 6: ACIK: AltBilgi'de min-height 44px gercek layout kaymasi yapiyor, olculdu: satirlar 14.5 / 43.5 / 72.5px asagi, kolon ~87px uzuyor. Overlay teknigi orada da uygulanmali.
Task 6: fix round 2 re-review passed items 1 and 3 but got item 2's geometry wrong. It measured the overlay overlap as ~1.5px and dismissed it because the pseudo-element "has no visual content". Both wrong: row ~15px + gap 13px = 28px pitch, two 44px overlays centred 28px apart overlap by 16px, and a content:'' absolutely positioned pseudo-element with default pointer-events DOES receive taps, which is the mechanism enlarging the target in the first place. Fix round 3 dispatched.
Task 6: PRINCIPLE recorded: an overlapping touch target is worse than a short one. A short target fails visibly and the user retries; a wrong target succeeds at the wrong thing. Correctness before the 44px number.
Task 6: RESIDUAL for the owner: the footer contact rows cannot reach 44px without raising .kolon's gap from 13px to about 29px, which is a visible design change. Agent instructed to cap overlays at the 28px pitch now and report the residual, not to make that change.
Task 17: review APPROVED. Reviewer re-derived all ten TaneDizilimi rails from the raw .dc.html rather than trusting the matrix; every cell matched. Cip/IkramCipi split, token discipline and the tabular-nums fix all verified, and the font-shorthand defect confirmed absent elsewhere.
Task 17: one Important gap, fix round 3 dispatched: FotoYuvasi hard-codes one ember-glow timing per bicim, but the design staggers six plates individually (kart: 10s/.6s, 11s/1.2s, 9.5s/1.8s, 12s/2.4s; ikram: 11s, 12s/1.5s). Deliberate: unison reads mechanical, stagger reads as independent embers.
Task 17: LESSON for the page tasks: the 45-cell matrix samples one cell per bicim, not per instance, so it cannot prove per-instance fidelity. Good instrument, sampling unit one level too coarse.
Task 6: fix round 3/5 clean (commit 5f659de). Overlay capped 44 -> 28px, the exact pitch; measured pairs [167.9,195.9] and [195.9,223.9], 0.00px gap, touching not crossing. .yolTarifi deliberately left at 44px: its only neighbour is the non-interactive address block, so no second target exists to steal from.
Task 6: RESIDUAL FOR THE OWNER, open: 44px on the footer contact rows needs .kolon's gap raised from 13px to about 29px, a visible footer redesign. Not made unilaterally. Decide in Task 16 or at launch.
Task 6: complete (commits 698190b..5f659de, review clean, 51/51 tests)
Task 17: fix round 3/5 clean (commit 71dcdbe). Per-instance ember timing as one optional data prop, not an index: card delays are index*0.6s but durations follow nothing (9, 9.5, 10, 11, 11, 12, 12, 13) and ikram delays break the stagger, so an index would encode a false claim that the numbers are generated when they are authored. Nine timings verified against the design, three more than the six given. Reduced-motion override still wins because inline style is not !important and animation-name stays in CSS.
Task 17: complete (commits be51a74..71dcdbe, review clean)

=== Baglam sifirlamasi sonrasi, 11 Agustos 23:44 ===
Agac temiz dogrulandi: typecheck temiz, 51/51 test, calisma agacinda yarim is yok.
Task 9 brief v2 yazildi (task-9-brief-v2.md) ve uygulayici gonderildi.
Task 10 brief v2 yazildi (task-10-brief-v2.md), Task 9 kapaninca gonderilecek.

DERS, sayfa gorevlerinin denetimi icin: DENETIM DOSYALARI DA BAYATLIYOR.
denetim-task-9 ve -10, Task 8 ve 17'den ONCE yazildi. Aradan gecen iki gorev
bulgularin bir kismini zaten kapatti. Olculdu:
  - denetim-10 "footer hic render edilmiyor" -> Kabuk.tsx AltBilgi'yi on rotada basiyor
  - denetim-10 "'ocak 05:00'te soner' ayri satir" -> VardiyaSeridi:43-46 seridin
    yedinci ogesi olarak zaten basiyor
  - denetim-10 "TaneDizilimi'nde ton yok, kucuk kare turetiliyor" -> Task 17 imzayi
    adet/buyuk/kucuk/bosluk/ton/cizgi yapti
  - denetim-10 "CamPanel 44px dolguyu ifade edemiyor" -> dolgu="orta"
  - denetim-10 "komsuluk cipinin karsiligi yok" -> Cip tur="komsuluk"
  - denetim-10 "hayalet saat opacity ile" -> CanliSaat.module.css:55 renk alfasi
  - denetim-9 "FotoYuvasi children kabul etmiyor" -> artik ediyor
  - denetim-9 "ikram cipi icin varyant yok" -> IkramCipi ayri bilesen
Yani denetim -> primitif turu -> sayfa gorevi zinciri calisti: denetim, Task 17'yi
besledi. Ama brief'e "denetimi oku" demek artik yetmiyor; brief'in ayrica
"denetimde acik gorunup kapanmis olanlar" tablosunu tasimasi lazim, yoksa uygulayici
bitmis isi ikinci kez yapar. Task 10 brief'ine o tablo konuldu.

Task 9 brief'inde alinan kararlar:
  - Sayfa ici kaydirma (#ocaktan, #iddia) icin JS yardimcisi YAZILMAYACAK. reset.css
    zaten html{scroll-behavior:smooth} veriyor, animasyonlar.css onu reduced-motion'da
    auto!important ile kapatiyor. Eksik olan tek sey Bolum'a scroll-margin-top:70px.
    Tasarimin JS'i ile ayni sonuc, sifir kod.
  - Bolum'a eritClassName eklenecek: dort bolumun de data-erit katmani kendi
    yerlesimini tasiyor. Bolum'un bugun HIC cagri yeri yok (Task 9 ilki), yani
    imza eklemenin bedava oldugu tek an.
  - AnimasyonluSayac useState(hedef) ile baslar, 0 ile degil. Statik export'ta 0
    basmak, JS calismadan veya kullanici o bolume hic inmezse rakami 0 birakir.
  - Ocaktan satirlari interaktif YAPILMAYACAK: tasarim cursor:pointer veriyor ama
    hicbir hedef vermiyor ve menu sayfasinda bu satir hic yok. Hover korunur,
    cursor:pointer yazilmaz, sahibine acik soru olarak raporlanir.
  - Token/ham deger kurali netlestirildi: krem rgba'lari HER ZAMAN token; clamp ve
    letter-spacing birden cok yerde geciyorsa token, tek kullanimlik ise kaynak
    yorumuyla ham (mevcut pratik: CanliSaat:14, IkramCipi:13, AltBilgi:38).

Task 10 brief'inde onceden isaretlenen iki olcum sorusu:
  - Birincil buton golgesi boya bagli bir rampa gibi duruyor: sm 0 8px 26px .34,
    lg 0 10px 30px .34, xl 0 12px 34px .4. Buton.module.css bugun yalniz sm ve
    varsayilani tasiyor. Uygulayici bes dosyadaki butun birincil butonlari sayip
    rampa mi gurultu mu karar verecek.
  - Ikonlu koyuOutline butonun yatay dolgusu 26px, ikonsuzun 29px. Ikon 15px + gap 9px
    eklendigi icin kisalmis olabilir. Ayni olcum sorusu.
