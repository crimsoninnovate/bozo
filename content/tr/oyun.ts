/**
 * Oyun metinleri. TASLAK: sahibinin onayını bekliyor (spec §19, karar 4). Ürün adları
 * menüden, gece cümleleri ana sayfadan okunur; burada tekrar yazılmaz.
 */
export const oyun = {
  baslik: 'Sofra Yetiştir',
  oyna: 'Oyna',
  tekrar: 'Tekrar Oyna',
  duraklat: 'Duraklat',
  devam: 'Devam Et',
  ses: 'Ses',
  saat: 'Saat',
  puan: 'Puan',
  kombo: 'Kombo',
  kapida: 'Kapıda',
  ocak: 'Ocak',
  tezgah: 'Tezgah',
  raf: 'Raf',
  sofra: 'Sofra',
  bosSofra: 'Boş sofra',
  kurulu: 'kurulu',
  ucSofraKalkti: 'üç sofra kalktı',
  /** Canlı bölge (spec §15): önemli anlar, saniyede en çok bir. `{puan}` ödemeyle değişir. */
  duyuru: {
    sonSaat: 'Son saat',
    porsiyon: 'Bir porsiyon',
    sofraKalkti: 'Sofra kalktı',
    fisTamam: 'Fiş tamam, +{puan}',
    sisYandi: 'Şiş yandı',
    sogudu: 'Şiş soğudu',
  },
  ozet: { sofra: 'sofra', sis: 'şiş', tamKivam: 'tam kıvam', enUzunKombo: 'en uzun kombo' },
  enIyi: 'En iyin',
  yeniEnIyi: 'Yeni en iyi',
  kaldi: 'kaldı',
}
