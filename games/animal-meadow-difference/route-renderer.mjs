import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('./',import.meta.url),context={window:{}};
for(const file of ['locales.js','garden-copy.js'])vm.runInNewContext(fs.readFileSync(new URL(file,root),'utf8'),context);
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const segments={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
export function renderMeadowRoute(locale){
  const c=context.window.MEADOW_FIND_LOCALES[locale];if(!c)throw new Error('MEADOW_ROUTE_LOCALE');
  return fs.readFileSync(new URL('index.html',root),'utf8')
    .replace(/<script data-wp-locale-route>[\s\S]*?<\/script>/,'')
    .replace('<html lang="en" dir="ltr">',`<html lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}">`)
    .replace(/<title>.*?<\/title>/,`<title>${escape(c.title)} | WeightPlay</title>`)
    .replace(/(<meta name="description" content=")[^"]*(">)/,`$1${escape(c.subtitle)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*("\s*\/>)/,`$1https://weightplay.com/${segments[locale]}/games/animal-meadow-difference/$2`)
    .replace(/(<([\w-]+)\b[^>]*data-copy="([^"]+)"[^>]*>)[^<]*(<\/\2>)/g,(all,open,tag,key,close)=>typeof c[key]==='string'?`${open}${escape(c[key].replace(/\{total\}/g,'3'))}${close}`:all)
    .replace('aria-label="Back to WeightPlay"',`aria-label="${escape(c.backToLobby)}"`)
    .replace('aria-label="Meadow Find game information"',`aria-label="${escape(c.title)}"`);
}
