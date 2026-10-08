/**
 * 404 copy. The static export produces a single 404.html, so the SERVER cannot
 * branch by language and the first paint is Turkish; `HataSayfasi` switches the
 * text, `lang` and title to English once mounted under `/en/`.
 */
export const hata = {
  kicker: '404',
  // "grill" ocak kilidini ihlal ediyordu; sitenin EN karşılığı "the fire".
  baslik: 'This page is not on the fire.',
  metin:
    'We could not find the page you were looking for. The fire is still lit; carry on from the links below.',
  anaSayfa: 'Home',
  menu: 'See the Menu',
}
