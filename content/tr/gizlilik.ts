/**
 * Bilgilendirme metni. KKTC Kişisel Verilerin Korunması Yasası (89/2007) Madde 13
 * ve onun altında yapılan "Bilgilendirme Yükümlülüğünün Yerine Getirilmesinde
 * Uyulacak Usul ve Esaslar Tüzüğü" uyarınca yazıldı.
 *
 * Tüzük Madde 4(2) zorunlu içeriği sayıyor: (A) kontrolörün kimliği, (B) işleme
 * amacı, (C) alıcılar veya alıcı kategorileri, (Ç) erişim ve düzeltme hakkı,
 * (D) veri vermenin zorunlu olup olmadığı, (E) Yasa'nın 14 ve 15'inci
 * maddelerindeki diğer haklar. Bölümler o listeyi karşılar.
 *
 * Tüzük Madde 5 ayrıca: (8) amaç belirli ve açık olmalı, muğlak ifade yok;
 * (10) aktarımın amacı ve alıcıları belirtilmeli; (11) HANGİ işleme şartına
 * dayanıldığı açıkça yazılmalı; (12) verinin otomatik yolla mı elde edildiği
 * belirtilmeli; (9) sade dil; (13) eksik veya yanıltıcı bilgi olmamalı.
 *
 * 24 Ağustos 2026 (2. tur): Kurul'a başvuru yolu (Madde 34) ve saklama ilkesi
 * (Madde 5(1)(Ç)) Yasa'nın kvkk.gov.ct.tr'deki resmi metninden eklendi, bkz.
 * IYILESTIRMELER.md. Madde 8 bildirimi ve Madde 11 Transfer Ruhsatı ayrı, kodla
 * çözülemeyen iki madde: sahibine bildirildi, aynı dosyada.
 *
 * 10 Ekim 2026: oyun sıralaması eklendi (amaç, yöntem, dayanak, alıcı, aktarım, saklama, haklar).
 * Sahibi hukukçu incelemesi istemedi, kararı kendisi üstlendi. METİN HUKUKÇU ONAYINDAN GEÇMEDİ.
 */
export const gizlilik = {
  baslik: 'Gizlilik',
  girisMetni:
    'Bu sayfa, Ciğerci Bozo web sitesinde hangi verinin, neden ve hangi hukuki ' +
    'dayanakla işlendiğini anlatır. Sitede kimlik, adres veya ödeme bilgisi ' +
    'istenmez. Açılış oyununda isteğe bağlı bir takma ad girilebilir.',

  sorumluBaslik: 'Kim işliyor',
  sorumluMetni:
    'Kontrolör Ciğerci Bozo, Naci Talat Caddesi No:4, Girne, KKTC. Bu metindeki ' +
    'her talep doğrudan işletmeye, aşağıdaki adrese gider.',

  amacBaslik: 'Ne işleniyor, ne için',
  amacMetni:
    'İki ayrı amaç var. Birincisi ziyaret ölçümü: hangi sayfanın açıldığı, ' +
    'ziyaretin süresi, yönlendiren adres, cihaz türü ve ülke düzeyinde konum; ' +
    'amaç sitenin hangi sayfalarının işe yaradığını görmek. İkincisi oyun ' +
    'sıralaması: oyuna katılırsanız takma adınız, puanlarınız ve oyun kaydınız ' +
    'haftalık sıralamayı ve ödülü yönetmek için işlenir. Reklam yapılmaz, profil ' +
    'çıkarılmaz, veri satılmaz.',

  yontemBaslik: 'Nasıl toplanıyor',
  yontemMetni:
    'Tamamen otomatik yolla, tarayıcınızda çalışan Google Analytics 4 koduyla. ' +
    'Kod tarayıcınıza çerez yazar. Sıralamaya katılırsanız takma adı siz ' +
    'yazarsınız; oyun kaydı ve tarayıcı anahtarınızın özeti oyun sırasında ' +
    'otomatik oluşur. Gerçek ad, telefon ve e-posta istenmez.',

  dayanakBaslik: 'Hukuki dayanak',
  dayanakMetni:
    'Ölçüm, Yasa\'nın 6\'ncı maddesindeki onaya dayanır: ziyaretinizde çıkan ' +
    'bantta "Kabul Et" düğmesine basmadığınız sürece ölçüm hiç başlamaz. Onay ' +
    'vermezseniz site aynen çalışır. Sıralamaya katılım da açık onaya dayanır: ' +
    '"Kaydet ve Katıl" düğmesine basmadıkça sunucuya hiçbir kişisel veri ' +
    'gitmez. Oyunu katılmadan oynayabilirsiniz.',

  aliciBaslik: 'Kime gidiyor',
  aliciMetni:
    'Tek alıcı Google Ireland Limited ve Google LLC\'dir; ölçüm hizmetini onlar ' +
    'yürütür. Oyun verisi, işletmenin barındırma sağlayıcısı DH Bulut Bilişim\'in ' +
    'İstanbul\'daki sunucusunda tutulur; takma adınız ve puanınız herkese açık ' +
    'sıralamada görünür. Başka hiçbir üçüncü tarafa veri iletilmez.',

  aktarimBaslik: 'Yurt dışına aktarım',
  aktarimMetni:
    'Ölçüm verisi KKTC dışındaki Google sunucularında işlenir. Bu aktarım, ' +
    'Yasa\'nın 11\'inci maddesinin (2)\'nci fıkrasının (A) bendi uyarınca sizin ' +
    'onayınıza dayanır; onay vermezseniz hiçbir veri yurt dışına gitmez. Oyun ' +
    'verisi de KKTC dışında, Türkiye\'deki sunucuda tutulur ve aynı fıkra ' +
    'uyarınca "Kaydet ve Katıl" düğmesiyle verdiğiniz açık onaya dayanır.',

  saklamaBaslik: 'Ne kadar kalıyor',
  saklamaMetni:
    'Yasa\'nın 5\'inci maddesinin (1)\'inci fıkrasının (Ç) bendi, verinin işlenme ' +
    'amacının gerektirdiğinden uzun tutulmamasını ister. Ölçüm verisi Google ' +
    'Analytics hesabında tutulur ve süresi o hesabın ayarından belirlenir. Oyun ' +
    'sunucusunda şunlar tutulur: takma ad, tarayıcı anahtarının özeti, ' +
    'onayınızın zamanı, turlarınız. Haftanın ilk yirmisi dışındaki turların ' +
    'dokunuş kaydı puan hesaplanınca silinir; ilk yirminin kaydı dönem ' +
    'bitiminden 30 gün sonra; hesabınız son turdan 90 gün sonra silinir. ' +
    '"Hesabımı Sil" düğmesi kaydı anında siler.',

  haklarBaslik: 'Haklarınız',
  haklarMetni:
    'Yasa\'nın 14\'üncü maddesi hakkınızdaki verinin işlenip işlenmediğini ' +
    'öğrenme ve ona erişme, 15\'inci maddesi ise işlemeye itiraz etme ve verinin ' +
    'düzeltilmesini, silinmesini veya durdurulmasını isteme hakkı verir. Veri ' +
    'vermek zorunda değilsiniz: onay vermemenin siteyi kullanmanıza hiçbir etkisi ' +
    'yoktur. Oyun hesabınızı sıralama sayfasındaki "Hesabımı Sil" düğmesiyle ' +
    'kendiniz silebilirsiniz. Bu haklara ilişkin talebinize otuz gün içinde yanıt gelmez veya yanıt ' +
    'tatmin edici bulunmazsa, Yasa\'nın 34\'üncü maddesi uyarınca doğrudan Kişisel ' +
    'Verileri Koruma Kurulu\'na başvurabilirsiniz.',

  geriAlmaBaslik: 'Onayı geri almak',
  geriAlmaMetni:
    'Onayınızı istediğiniz an geri alabilirsiniz: tarayıcınızın bu site için ' +
    'sakladığı verileri ve çerezleri silin, bant yeniden çıkar ve bu kez ' +
    '"Reddet" düğmesine basabilirsiniz.',

  soruBaslik: 'Başvuru',
  soruMetni: 'Bu haklara ilişkin taleplerinizi bu adrese yazabilirsiniz:',
  guncellemeMetni:
    'Son güncelleme: 10 Ekim 2026. Dayanak: KKTC Kişisel Verilerin Korunması ' +
    'Yasası (89/2007) ve Bilgilendirme Yükümlülüğü Tüzüğü.',
}
