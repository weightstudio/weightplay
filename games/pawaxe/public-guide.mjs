import { GUIDE_COPY } from './guide-data.mjs?v=1';
import { localeText } from './locale-text.mjs';
export { GUIDE_COPY };
export const LOCALE_ROUTES = Object.freeze({en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'});
export const RUNTIME_COPY = Object.fromEntries(Object.entries(GUIDE_COPY).map(([locale,c])=>[locale,Object.freeze({...localeText[locale],summary:c.summary,maxRank:c.maxRank})]));
export function routeLocale(pathname){return LOCALE_ROUTES[/^\/([^/]+)\/games\/pawaxe(?:\/(?:index\.html)?)?$/.exec(pathname)?.[1]]||null;}
export function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function decodeHtml(value){return String(value).replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi,(all,entity)=>entity[0]==='#'?String.fromCodePoint(entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):parseInt(entity.slice(1),10)):({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[entity.toLowerCase()]||all));}
export function faqPairs(locale){const c=GUIDE_COPY[locale];if(!c)throw new Error(`Unsupported pawaxe locale: ${locale}`);return c.questions.map((q,i)=>[q,[c.finish,c.gear,c.companion,c.save][i]]);}
export function faqSchema(locale){return {'@context':'https://schema.org','@type':'FAQPage',inLanguage:locale,mainEntity:faqPairs(locale).map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))};}
export function guideInner(locale,title){
  const c=GUIDE_COPY[locale];if(!c)throw new Error(`Unsupported pawaxe locale: ${locale}`);
  const blocks=[[c.controls,c.companion],[c.progress,c.finish],[c.gear],[c.save]];
  return `<h2 id="pawaxe-guide-title">${escapeHtml(title)}</h2><p>${escapeHtml(c.summary)}</p><div class="game-info-sections">${blocks.map((paragraphs,i)=>`<div class="game-info-section"><h3>${escapeHtml(c.headings[i])}</h3>${paragraphs.map(p=>`<p>${escapeHtml(p)}</p>`).join('')}</div>`).join('')}<div class="game-info-section"><h3>${escapeHtml(c.headings[4])}</h3><dl>${faqPairs(locale).map(([q,a])=>`<div><dt>${escapeHtml(q)}</dt><dd>${escapeHtml(a)}</dd></div>`).join('')}</dl></div></div>`;
}
export function replaceGuide(html,locale,title){
  const start=/<section\b[^>]*class=["'][^"']*\bgame-page-info\b[^"']*["'][^>]*>/i.exec(html);
  if(!start)throw new Error(`Pawaxe ${locale}: guide section missing`);
  const tokens=/<section\b[^>]*>|<\/section\s*>/gi;tokens.lastIndex=start.index;
  let depth=0,token,end=-1;
  while((token=tokens.exec(html))){depth+=/^<section\b/i.test(token[0])?1:-1;if(depth===0){end=tokens.lastIndex;break;}}
  if(end<0)throw new Error(`Pawaxe ${locale}: unclosed guide`);
  let opening=start[0].replace(/\saria-label=["'][^"']*["']/i,'').replace(/\saria-labelledby=["'][^"']*["']/i,'');
  opening=opening.replace(/>$/,' aria-labelledby="pawaxe-guide-title">');
  return html.slice(0,start.index)+opening+guideInner(locale,title)+'</section>'+html.slice(end);
}
function encodedJson(value){return JSON.stringify(value).replace(/</g,'\\u003c');}
function updateSchema(value,locale){
  if(Array.isArray(value))return value.map(v=>updateSchema(v,locale)).filter(Boolean);
  if(!value||typeof value!=='object')return value;
  const types=[value['@type']].flat();
  if(types.includes('FAQPage'))return null;
  if(types.includes('VideoGame'))value={...value,description:GUIDE_COPY[locale].summary,inLanguage:locale};
  if(Array.isArray(value['@graph']))value={...value,'@graph':value['@graph'].map(v=>updateSchema(v,locale)).filter(Boolean)};
  return value;
}
export function applyPawaxePage(html,locale,dictionary){
  if(!GUIDE_COPY[locale])throw new Error(`Unsupported pawaxe locale: ${locale}`);
  const titleMatch=/<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  if(!titleMatch)throw new Error('Pawaxe H1 missing');
  const title=decodeHtml(titleMatch[1].replace(/<[^>]+>/g,'')).trim();
  const d={...dictionary,...RUNTIME_COPY[locale]};
  html=replaceGuide(html,locale,title);
  html=html.replace(/(<([a-z][\w-]*)\b[^>]*\bdata-i18n=["']([^"']+)["'][^>]*>)([^<]*)(<\/\2>)/gi,(all,open,tag,key,text,close)=>{
    if(key==='title')return all;
    if(typeof d[key]!=='string'||!d[key].trim())throw new Error(`Pawaxe ${locale}: missing ${key}`);
    return open+escapeHtml(d[key])+close;
  });
  html=html.replace(/<[a-z][^>]*>/gi,tag=>{
    for(const [marker,attr] of [['aria','aria-label'],['title','title'],['alt','alt']]){
      const match=new RegExp(`\\bdata-i18n-${marker}=["']([^"']+)["']`,'i').exec(tag);
      if(!match)continue;
      const text=d[match[1]];
      if(typeof text!=='string'||!text.trim())throw new Error(`Pawaxe ${locale}: missing ${match[1]}`);
      const value=`${attr}="${escapeHtml(text)}"`,pattern=new RegExp(`\\s${attr}=["'][^"']*["']`,'i');
      tag=pattern.test(tag)?tag.replace(pattern,` ${value}`):tag.replace(/\/?\s*>$/,` ${value}>`);
    }
    return tag;
  });
  html=html.replace(/<html\b[^>]*>/i,tag=>tag.replace(/\sdir=["'][^"']*["']/i,'').replace(/>$/,` dir="${locale==='ar'?'rtl':'ltr'}">`));
  for(const key of ['description','og:description','twitter:description']){
    const attr=key.startsWith('og:')?'property':'name';
    const re=new RegExp(`<meta\\b(?=[^>]*\\b${attr}=["']${key}["'])[^>]*>`,'i');
    const tag=`<meta ${attr}="${key}" content="${escapeHtml(GUIDE_COPY[locale].summary)}" />`;
    html=re.test(html)?html.replace(re,tag):html.replace(/<\/head>/i,tag+'\n</head>');
  }
  html=html.replace(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>[ \t]*(?:\r?\n)?/gi,(all,text)=>{
    const updated=updateSchema(JSON.parse(text),locale);
    return updated?`<script type="application/ld+json">${encodedJson(updated)}</script>\n`:'';
  });
  return html.replace(/<\/head>/i,`<script id="pawaxe-guide-faq" type="application/ld+json">${encodedJson(faqSchema(locale))}</script>\n</head>`);
}
// Called only by the browser runtime. Static routes use the same renderer above.
export function syncPawaxeGuide(locale){
  const guide=document.querySelector('.game-page-info');if(!guide)return;
  const title=document.querySelector('h1')?.textContent?.trim();if(!title)return;
  guide.innerHTML=guideInner(locale,title);
  guide.setAttribute('aria-labelledby','pawaxe-guide-title');
  let faq=document.getElementById('pawaxe-guide-faq');
  if(!faq){faq=document.createElement('script');faq.id='pawaxe-guide-faq';faq.type='application/ld+json';document.head.append(faq);}
  faq.textContent=encodedJson(faqSchema(locale));
  for(const script of document.querySelectorAll('script[type="application/ld+json"]')){
    if(script===faq)continue;
    try{const data=updateSchema(JSON.parse(script.textContent),locale);if(data)script.textContent=encodedJson(data);}catch(error){console.warn('Pawaxe structured data:',error.message);}
  }
  for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])document.querySelector(selector)?.setAttribute('content',GUIDE_COPY[locale].summary);
}
