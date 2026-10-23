import {t, supportedLocales} from './locales.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Build-time hydration uses the same authored copy as gameplay. The shared
// generator supplies the approved title from the central title registry.
export function localizeBlockmartEntry(html, locale, title) {
  if (!supportedLocales.includes(locale) || !title) throw new Error(`Missing Blockmart entry locale: ${locale}`);
  const copy = key => {
    const value = key === 'title' ? title : t(key, locale);
    if (!value || value === key) throw new Error(`Missing Blockmart copy: ${locale}/${key}`);
    return escapeHtml(value);
  };
  html = html.replace(/(<([a-z][\w-]*)\b[^>]*\bdata-l10n=["']([^"']+)["'][^>]*>)([^<]*)(<\/\2>)/gi,
    (_whole, open, _tag, key, _text, close) => open + copy(key) + close);
  for (const [marker, attribute] of [['alt','alt'], ['content','content'], ['aria','aria-label']]) {
    html = html.replace(new RegExp(`<[^>]+\\bdata-l10n-${marker}=["']([^"']+)["'][^>]*>`, 'gi'), (tag, key) =>
      tag.replace(new RegExp(`(\\b${attribute}=["'])[^"']*(["'])`, 'i'), (_whole, open, close) => open + copy(key) + close));
  }
  html = html.replace(/<html\b[^>]*>/i, `<html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}">`);
  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-runtime-localize="off">${escapeHtml(title)} | WeightPlay</title>`);
  // The generic catalog's Animal Games tag is not authored Blockmart copy.
  // Keep the catalog's translated genres and the matching factual description.
  html = html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (_whole, open, source, close) => {
    const schema = JSON.parse(source);
    if (schema['@type'] === 'VideoGame') {
      schema.name = title;
      schema.description = t('guideSummary', locale);
      schema.genre = (schema.genre || []).filter(genre => genre !== 'Animal Games');
    }
    return open + JSON.stringify(schema, null, 2) + close;
  });
  return html;
}
