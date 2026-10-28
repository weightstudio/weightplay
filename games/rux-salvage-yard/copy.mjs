import {BASE,CUSTOM,QUESTIONS} from "./locales.mjs";
export const TITLES={
  "rux-salvage-yard": {
    "__localizedExact": true,
    "en": "Rux Salvage Yard",
    "zh-Hant": "Rux 回收工坊",
    "zh-Hans": "Rux 回收工坊",
    "ja": "ルックスのリサイクル工房",
    "ko": "럭스의 재활용 작업장",
    "es": "Taller de reciclaje de Rux",
    "pt-BR": "Oficina de Reciclagem de Rux",
    "fr": "L'atelier de recyclage de Rux",
    "de": "Rux' Recyclingwerkstatt",
    "it": "L'officina di riciclo di Rux",
    "ru": "Мастерская переработки Рукса",
    "hi": "रक्स की रीसाइक्लिंग कार्यशाला",
    "ar": "ورشة روكس لإعادة التدوير"
  },
  "nori-bankshot": {
    "__localizedExact": true,
    "en": "Nori Bankshot",
    "zh-Hant": "諾里撞球館",
    "zh-Hans": "诺里台球馆",
    "ja": "ノリのビリヤード",
    "ko": "노리의 당구장",
    "es": "Billar con Nori",
    "pt-BR": "Bilhar com Nori",
    "fr": "Le billard de Nori",
    "de": "Noris Billardhalle",
    "it": "Il biliardo di Nori",
    "ru": "Бильярд с Нори",
    "hi": "नोरी का बिलियर्ड्स",
    "ar": "بلياردو نوري"
  },
  "animal-orb-fortress": {
    "__localizedExact": true,
    "en": "Orb Fortress",
    "zh-Hant": "星珠要塞",
    "zh-Hans": "星珠要塞",
    "ja": "星珠要塞",
    "ko": "구슬 요새",
    "es": "Fortaleza del Orbe",
    "pt-BR": "Fortaleza dos Orbes",
    "fr": "Forteresse des Orbes",
    "de": "Orbfestung",
    "it": "Fortezza delle Sfere",
    "ru": "Крепость животных сфер",
    "hi": "ऑर्ब किला",
    "ar": "حصن الكرات الحيوانية"
  }
};
export const LOCALES=['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
export const ROUTES=['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar'];
export const LABELS=['English','繁體中文','简体中文','日本語','한국어','Español','Português','Français','Deutsch','Italiano','Русский','हिन्दी','العربية'];
export function text(locale,key,vars={}){
  const value=CUSTOM[locale]?.[key]??BASE[locale]?.[key];
  if(typeof value!=='string')throw Error(`RUX_MISSING_COPY:${locale}:${key}`);
  return value.replace(/\{(\w+)\}/g,(_,name)=>String(vars[name]??''));
}
export function title(locale,id='rux-salvage-yard'){
  const value=globalThis.window?.WEIGHTPLAY_GAME_TITLES?.[id]?.[locale]??TITLES[id]?.[locale];
  if(!value)throw Error(`RUX_MISSING_TITLE:${locale}:${id}`);return value;
}
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RELATED_HEADINGS=['More related games','更多相關遊戲','更多相关游戏','関連するゲーム','관련 게임 더 보기','Más juegos relacionados','Mais jogos relacionados','Jeux similaires','Weitere ähnliche Spiele','Altri giochi simili','Похожие игры','और संबंधित खेल','ألعاب مشابهة أخرى'];
export function renderStaticGuide(locale){
  const t=key=>esc(text(locale,key)),route=ROUTES[LOCALES.indexOf(locale)],qs=QUESTIONS[locale];
  if(!route||!qs)throw Error(`RUX_MISSING_GUIDE:${locale}`);
  const answers=[['first','last','linked','clampRule'].map(key=>text(locale,key)).join(' '),text(locale,'samePhysics'),text(locale,'finish')];
  const related=[['nori-bankshot','/games/nori-bankshot/art/poster.webp'],['animal-orb-fortress','/assets/animal-orb-fortress-cover-block-v1.webp']];
  const sectionText=key=>key==='rules'?`${t(key)} ${t('fineAim')} ${t('clampTime')} ${t('clampAdvice')} ${t('trajectory')} ${t('zoomHint')} ${t('speedHint')}`:key==='finish'?`${t(key)} ${t('medalHint')}`:t(key);
  return `<section id="guide" class="game-page-info game-page-info-static" data-wp-main-guide data-wp-game-guide data-wp-guide-renderer="copy.mjs#renderStaticGuide" data-runtime-localize="off"><div class="game-info-title"><h2 data-runtime-localize="off">${esc(title(locale))}</h2></div><div class="game-info-tags"><span>${t('ball')}</span><span>${t('part')}</span><span>${t('stages')}</span></div><div class="game-info-facts"><div class="game-info-fact"><strong>${t('stages')}</strong><span>60</span></div><div class="game-info-fact"><strong>${t('collection')}</strong><span>${t('permanent')}</span></div></div><div class="game-info-sections">${[['goalHeading','goal'],['howHeading','how'],['rulesHeading','rules'],['finishHeading','finish']].map(([heading,body])=>`<section class="game-info-section"><h3>${t(heading)}</h3><p>${sectionText(body)}</p></section>`).join('')}</div><section class="game-info-faq"><h3>${t('faqHeading')}</h3>${qs.map((q,i)=>`<details><summary>${esc(q)}</summary><p>${esc(answers[i])}</p></details>`).join('')}</section><div class="game-info-section game-info-related-section" data-wp-guide-related-interface="9"><h3>${esc(RELATED_HEADINGS[LOCALES.indexOf(locale)])}</h3><div class="game-info-related">${related.map(([id,poster])=>`<a class="game-info-related-card" data-game-id="${id}" href="/${route}/games/${id}/"><img src="${poster}" alt="" width="100" height="100" loading="lazy"><strong data-runtime-localize="off">${esc(title(locale,id))}</strong></a>`).join('')}</div></div></section>`;
}
// Apply locale-owned first-response copy to the scoped generator's shell.
export function localizeShell(source,locale){
  const i=LOCALES.indexOf(locale);if(i<0)throw Error(`RUX_LOCALE_INVALID:${locale}`);
  const render=key=>key==='title'?title(locale):text(locale,key),route=ROUTES[i],url=`https://weightplay.com/${route}/games/rux-salvage-yard/`;
  let html=source.replace(/<html\b[^>]*>/i,`<html lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}" data-wp-official-name>`);
  html=html.replace(/(<([a-z][\w-]*)\b[^>]*\bdata-copy="([^"]+)"[^>]*>)[^<]*(<\/\2>)/gi,(_all,open,_tag,key,close)=>open+esc(render(key))+close);
  html=html.replace(/<[^>]*\bdata-copy-(aria|alt)="([^"]+)"[^>]*>/gi,(tag,kind,key)=>{const attr=kind==='aria'?'aria-label':'alt',value=esc(render(key)),pattern=new RegExp(`(\\s${attr}=")[^"]*(")`,'i');return pattern.test(tag)?tag.replace(pattern,(_match,before,after)=>before+value+after):tag.replace(/>$/,` ${attr}="${value}">`);});
  html=html.replace(/<a\b[^>]*\bdata-lobby-link\b[^>]*>/gi,tag=>tag.replace(/href="[^"]*"/i,`href="/${route}/"`));
  html=html.replace(/(<p\b[^>]*id="mainProgress"[^>]*>)[^<]*(<\/p>)/i,`$1${esc(text(locale,'stage'))} 1 / 60$2`);
  html=html.replace(/<option\b[^>]*value="([^"]+)"[^>]*>/gi,(tag,value)=>{let out=tag.replace(/\sselected(?:="[^"]*")?/i,'');return value===locale?out.replace(/>$/,' selected>'):out;});
  html=html.replace(/<title>[^<]*<\/title>/i,`<title>${esc(title(locale))} | WeightPlay</title>`);
  for(const field of ['description','og:description','twitter:description']){const pattern=new RegExp(`(<meta\\b[^>]*(?:name|property)="${field}"[^>]*content=")[^"]*(")`,'i');html=html.replace(pattern,`$1${esc(text(locale,'summary'))}$2`);}
  html=html.replace(/(<script\s+type="application\/ld\+json">)([\s\S]*?)(<\/script>)/i,(_all,open,json,close)=>{const data=JSON.parse(json);data.name=title(locale);data.description=text(locale,'summary');data.inLanguage=locale;data.url=url;return open+JSON.stringify(data).replaceAll('<','\\u003c')+close;});
  if(!html.includes('/src/game-official-name.js'))html=html.replace('<script src="/src/game-title-registry.js"></script>','<script src="/src/game-title-registry.js"></script><script src="/src/game-official-name.js"></script>');
  return html;
}
const ZH_TW_NAMES=['首次回收','近處支架','遠處支架','兩座支架','重件優先','易碎底座','近處高塔','遠處高塔','高低支架','高塔先行','金屬底座','木材與金屬','遠端重底','上層弱點','連結回收','繞過遮板','受掩護的支架','遮板後的重件','高處通道','遠側優先','反彈板','鏡向反彈','金屬與反彈','遠側弱點','雙路回收','近處重塔','遮板與弱點','中央重塔','遮板後的重塔','工坊總整理','認識夾具','固定與釋放','固定重底','兩種選擇','夾住遠件','移動平台','等待平台','移動與易碎','移動與重件','平台優先','平台與弱點','重塔時機','兩個夾具','反彈與平台','雙岸連結','夾住金屬','反彈與釋放','雙夾與金屬','鏡向時機','固定中央','唯一夾具','遮板平台','重塔與平台','遠端弱點與平台','遠件最後','打開通道','遠側重底','鏡向平台','分配夾具','最終回收'];
const ZH_CN_NAMES=['首次回收','近处支架','远处支架','两座支架','重件优先','易碎底座','近处高塔','远处高塔','高低支架','高塔先行','金属底座','木材与金属','远端重底','上层弱点','连接回收','绕过挡板','受遮挡的支架','挡板后的重件','高处通道','远侧优先','反弹板','镜向反弹','金属与反弹','远侧弱点','双路回收','近处重塔','挡板与弱点','中央重塔','挡板后的重塔','工坊总整理','认识夹具','固定与释放','固定重底','两种选择','夹住远件','移动平台','等待平台','移动与易碎','移动与重件','平台优先','平台与弱点','重塔时机','两个夹具','反弹与平台','双岸连接','夹住金属','反弹与释放','双夹与金属','镜向时机','固定中央','唯一夹具','挡板平台','重塔与平台','远端弱点与平台','远件最后','打开通道','远侧重底','镜向平台','分配夹具','最终回收'];
// Concise, localized descriptions reflect the mechanics of each authored
// board; the shared stage card displays the stage number separately.
const STAGE_FEATURES={
  ja:['連結回収','先に回収','最後に回収','指定クランプ','移動台','反射板','遮へい','クランプ','金属の支え','壊れる支え','高い塔','支えを崩す'],
  ko:['연결 회수','먼저 회수','마지막 회수','지정 클램프','이동 발판','반사판','가림막','클램프','금속 지지대','부서지는 지지대','높은 탑','지지대 무너뜨리기'],
  es:['Piezas unidas','Primero','Recuperar al final','Pinza obligatoria','Plataforma móvil','Rebote','Protección','Pinza','Soporte metálico','Soporte frágil','Torre alta','Derriba soporte'],
  'pt-BR':['Peças ligadas','Primeiro','Por último','Pinça obrigatória','Plataforma móvel','Rebote','Proteção','Pinça','Suporte metálico','Suporte frágil','Torre alta','Derrube o suporte'],
  fr:['Récupération liée','En premier','En dernier','Pince obligatoire','Plateforme mobile','Rebond','Protection','Pince','Support en métal','Support fragile','Tour haute','Renverser support'],
  de:['Verbundene Teile','Zuerst bergen','Zuletzt bergen','Pflichtklammer','Mobile Plattform','Abpraller','Deckung','Klammer','Metallstütze','Brüchige Stütze','Hoher Turm','Stütze umwerfen'],
  it:['Pezzi collegati','Per primo','Per ultimo','Pinza obbligatoria','Piattaforma','Rimbalzo','Riparo','Pinza','Base metallica','Supporto fragile','Torre alta','Abbatti supporto'],
  ru:['Связка деталей','Сначала забрать','Забрать в конце','Нужен зажим','Подвижный стол','Отражение','Преграда','Зажим','Опора: металл','Хрупкая опора','Высокая башня','Сбить опору'],
  hi:['जुड़े पुर्ज़ों की वसूली','पहले वसूलें','अंत में वसूलें','ज़रूरी क्लैंप','चलता मंच','प्रतिक्षेप','आड़','क्लैंप','धातु का सहारा','नाज़ुक सहारा','ऊँचा टावर','सहारा गिराएँ'],
  ar:['استعادة مترابطة','استعد أولاً','استعد أخيراً','مشبك إلزامي','منصة متحركة','ارتداد','حاجز','مشبك','دعامة معدنية','دعامة هشة','برج مرتفع','أسقط الدعامة']
};
const BRIDGE_NAMES={en:'Bridge supports','zh-Hant':'橋上零件','zh-Hans':'桥上零件',ja:'橋の支え',ko:'다리 지지대',es:'Puente y soportes','pt-BR':'Ponte de apoios',fr:'Pont et supports',de:'Brückenstützen',it:'Ponte e supporti',ru:'Мост на опорах',hi:'पुल के सहारे',ar:'دعامات الجسر'};
const SLOPE_NAMES={en:'Sloped beam','zh-Hant':'斜樑支點','zh-Hans':'斜梁支点',ja:'斜めの横木',ko:'기울어진 가로대',es:'Viga inclinada','pt-BR':'Viga inclinada',fr:'Poutre inclinée',de:'Schräger Balken',it:'Trave inclinata',ru:'Наклонная балка',hi:'झुकी हुई बीम',ar:'عارضة مائلة'};
export function stageTitle(locale,stage){if(stage.bridge==='slope')return SLOPE_NAMES[locale]||stage.title;if(stage.bridge)return BRIDGE_NAMES[locale]||stage.title;if(locale==='en')return stage.title;if(locale==='zh-Hant')return ZH_TW_NAMES[stage.id-1];if(locale==='zh-Hans')return ZH_CN_NAMES[stage.id-1];const labels=STAGE_FEATURES[locale];if(!labels)return stage.title;const index=stage.sameShot?0:stage.firstColumn!==undefined?1:stage.lastColumn!==undefined?2:stage.clampColumn!==undefined?3:stage.platform?4:stage.reflector?5:stage.guard?6:stage.clamps?7:stage.metalColumn!==undefined?8:stage.fragile?9:Math.max(...stage.columns)>=2?10:11;return labels[index];}
export function stageChapter(locale,id){if(locale==='ru')return id<=30?'Дерево':'Механика';if(locale==='it'&&id>30)return 'Officina';return text(locale,id<=30?'chapter1':'chapter2');}
