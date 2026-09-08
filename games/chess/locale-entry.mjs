// Locale URLs own their initial language. Storage is only a preference for
// the unlocalized development/canonical entry, never a route override.
export const localeSegments = Object.freeze({
 en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es',
 'pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar',
});
const supported = value => Object.hasOwn(localeSegments, value || '');
export function entryLocale(href, savedLocale, documentLocale) {
 const url = new URL(href);
 const segment = url.pathname.split('/')[1];
 const routeLocale = Object.keys(localeSegments).find(key => localeSegments[key] === segment);
 if (routeLocale) return routeLocale;
 const requested = url.searchParams.get('lang');
 return [requested,savedLocale,documentLocale,'en'].find(supported);
}
export function lobbyHref(locale, href) {
 const url = new URL(href);
 return `/${localeSegments[supported(locale) ? locale : 'en']}/` +
  (url.searchParams.get('preview') === '1' ? '?preview=1' : '');
}
