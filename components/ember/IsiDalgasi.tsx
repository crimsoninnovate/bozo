import stil from './IsiDalgasi.module.css'

/**
 * Kor yatağının üstündeki ısı titreşimi. Ocağın üstünde kırılan hava; efekt
 * değil, sahnenin zaten anlattığı şeyin devamı.
 *
 * İki bant üst üste: aynı türbülans, farklı tohum ve asal periyot. Tek bant
 * kayan bir doku gibi okunuyordu, ikisinin üst üste binmesi kaynayan havayı
 * veriyor (kor sahnesinin 8/13/17 gerekçesiyle aynı).
 *
 * SMIL (`<animate>`) bilerek kullanılmadı: `animasyonlar.css`'in
 * `prefers-reduced-motion` kuralı CSS animasyonunu kapatır, SMIL'i kapatmaz.
 * Filtre sabit, hareketin tamamı CSS'te.
 */
export function IsiDalgasi() {
  return (
    <span className={stil.kap}>
      {/* Filtre tanımları. Id'ler global: `filter: url(#...)` CSS Modules
          hash'ine girmez ve bu sahne sayfada bir kez var. */}
      <svg className={stil.tanim} aria-hidden="true" focusable="false">
        <defs>
          <filter id="isiDalgasiA" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.011 0.042"
              numOctaves="2"
              seed="7"
              result="gurultu"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="gurultu"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="isiDalgasiB" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.017 0.058"
              numOctaves="2"
              seed="19"
              result="gurultu"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="gurultu"
              scale="16"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <span className={`${stil.bant} ${stil.bantA}`} />
      <span className={`${stil.bant} ${stil.bantB}`} />
    </span>
  )
}
