-- Skor sunucusu şeması, MariaDB 10.11 (spec §10). Zamanlar epoch milisaniye (BIGINT): sunucu ile
-- veritabanının saat dilimi ayarı birbirinden bağımsız kalır. Girne yorumu yalnız sunucuda.

CREATE TABLE IF NOT EXISTS oyuncu (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  anahtar_ozeti CHAR(64) NOT NULL,
  takma_ad VARCHAR(12) NOT NULL,
  ad_katlanmis VARCHAR(12) NOT NULL,
  onay_zamani_ms BIGINT NOT NULL,
  onay_surumu VARCHAR(32) NOT NULL,
  gizli TINYINT(1) NOT NULL DEFAULT 0,
  olusturma_ms BIGINT NOT NULL,
  son_tur_ms BIGINT NULL,
  UNIQUE KEY oyuncu_anahtar (anahtar_ozeti),
  UNIQUE KEY oyuncu_ad (ad_katlanmis),
  KEY oyuncu_son_tur (son_tur_ms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS tur_jetonu (
  id CHAR(32) NOT NULL PRIMARY KEY,
  tohum INT UNSIGNED NOT NULL,
  kanal ENUM('sofra', 'ig', 'site', 'yok') NOT NULL,
  olusturma_ms BIGINT NOT NULL,
  sona_erme_ms BIGINT NOT NULL,
  kullanildi TINYINT(1) NOT NULL DEFAULT 0,
  KEY jeton_sona_erme (sona_erme_ms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS donem (
  anahtar CHAR(10) NOT NULL PRIMARY KEY,
  baslangic_ms BIGINT NOT NULL,
  bitis_ms BIGINT NOT NULL,
  kapanis_ms BIGINT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tur (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  jeton_id CHAR(32) NOT NULL,
  oyuncu_id INT UNSIGNED NOT NULL,
  donem CHAR(10) NOT NULL,
  tohum INT UNSIGNED NOT NULL,
  puan INT NOT NULL,
  misafir SMALLINT UNSIGNED NOT NULL,
  sis SMALLINT UNSIGNED NOT NULL,
  tam_kivam SMALLINT UNSIGNED NOT NULL,
  en_uzun_kombo SMALLINT UNSIGNED NOT NULL,
  kalkan TINYINT UNSIGNED NOT NULL,
  bahsis INT UNSIGNED NOT NULL,
  bitti ENUM('gece', 'ucMisafir') NOT NULL,
  tik SMALLINT UNSIGNED NOT NULL,
  kanal ENUM('sofra', 'ig', 'site', 'yok') NOT NULL,
  supheli TINYINT(1) NOT NULL DEFAULT 0,
  girdiler MEDIUMTEXT NULL,
  olusturma_ms BIGINT NOT NULL,
  UNIQUE KEY tur_jeton (jeton_id),
  KEY tur_donem_sira (donem, puan, tam_kivam, kalkan, olusturma_ms),
  KEY tur_oyuncu (oyuncu_id, donem),
  CONSTRAINT tur_oyuncu_fk FOREIGN KEY (oyuncu_id) REFERENCES oyuncu (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS kazanan (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  donem CHAR(10) NOT NULL,
  sira TINYINT UNSIGNED NOT NULL,
  oyuncu_id INT UNSIGNED NULL,
  takma_ad VARCHAR(12) NOT NULL,
  puan INT NOT NULL,
  kod_ozeti CHAR(64) NOT NULL,
  deneme TINYINT UNSIGNED NOT NULL DEFAULT 0,
  gecerlilik_ms BIGINT NOT NULL,
  kullanildi_ms BIGINT NULL,
  UNIQUE KEY kazanan_donem_sira (donem, sira),
  UNIQUE KEY kazanan_kod (kod_ozeti),
  KEY kazanan_oyuncu (oyuncu_id),
  CONSTRAINT kazanan_oyuncu_fk FOREIGN KEY (oyuncu_id) REFERENCES oyuncu (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS gunluk_sayac (
  gun CHAR(10) NOT NULL,
  kanal ENUM('sofra', 'ig', 'site', 'yok') NOT NULL,
  tur INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (gun, kanal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
