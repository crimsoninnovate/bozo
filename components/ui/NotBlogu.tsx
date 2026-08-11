import stil from './NotBlogu.module.css'

/**
 * Tangerine dikey çizgiyle işaretlenmiş not. Tek kullanım: Hikaye portre
 * kartının son satırı (Hikaye Sayfasi.dc.html:86).
 *
 * Alıntı DEĞİL, o yüzden `<blockquote>` değil `<p>`. Metin kimsenin sözünü
 * aktarmıyor; ileride yazılacak hikayeyi haber veren bir yer tutucu
 * (`content/tr/hikaye.ts` portre.kartNotu). `<blockquote>` yardımcı teknolojiye
 * "burada birinin sözü var" der ve yanlış olurdu.
 */
export function NotBlogu({ children }: { children: React.ReactNode }) {
  return <p className={stil.not}>{children}</p>
}
