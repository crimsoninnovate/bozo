/* Personel hesapları ve işlem kaydı: sunucu ve panel aynı türleri ve kuralları kullanır. */

export type IslemTuru =
  | 'giris' | 'menuYayin' | 'menuGeriAl' | 'foto' | 'derleme' | 'kod' | 'gizle'
  | 'personelEkle' | 'personelKapat' | 'personelAc' | 'sifreSifirla' | 'sifreDegistir'
