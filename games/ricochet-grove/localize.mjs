import fs from 'node:fs';
import vm from 'node:vm';
import { BASE, ROUTES, word } from './locales.mjs?wp-media=2f0d4cb4d54499ee';
const GAME = 'ricochet-grove';
const ROOT = new URL('../../', import.meta.url);
const COVER = '/games/ricochet-grove/assets/cover.webp?wp-media=2f0d4cb4d54499ee';
const HOST = 'https://weightplay.com';
const RULES = {"en":["Choose a launcher and check the predicted bed. Turn a peg for one water, then drop the seed. A fresh dew peg gives one water. Gold vanes move a seed two spaces; blue hinges flip after contact.","Can I finish without diamonds?","Yes. Clear stages to unlock tools. Diamonds buy permanent appearances. Progress is saved in this browser.","Related games"],"zh-Hant":["選發射槽，先看預測的落點。改撥一支釘要一滴水，再投放種籽。碰到未採的晶泉會回一滴水。金色風標偏移兩格，藍色潮鉸在被撞後翻面。","不用鑽石也能通關嗎？","可以。通關就能解鎖工具；鑽石只用來買永久外觀。進度保存在這個瀏覽器。","相關遊戲"],"zh-Hans":["选发射槽，先看预测的落点。改拨一支钉要一滴水，再投放种籽。碰到未采的晶泉会回一滴水。金色风标偏移两格，蓝色潮铰在被撞后翻面。","不用钻石也能通关吗？","可以。通关就能解锁工具；钻石只用来买永久外观。进度保存在这个浏览器。","相关游戏"],"ja":["発射口を選び、予測の花壇を確認しよう。ピンを返すにはしずくを1つ使う。未使用の泉に当たると1つ戻る。金色の風板は2マス進み、青い蝶番は当たった後に反転する。","ダイヤなしでクリアできますか？","できます。道具はクリアで解放されます。ダイヤは永続スキン用で、進み具合はこのブラウザに保存されます。","関連ゲーム"],"ko":["발사구를 고르고 예상 화단을 확인하세요. 핀 하나를 뒤집는 데 물방울 하나가 듭니다. 새 이슬에 닿으면 물방울 하나를 얻습니다. 금색 날개는 두 칸 움직이고 파란 경첩은 충돌 뒤 뒤집힙니다.","다이아몬드 없이 끝낼 수 있나요?","네. 스테이지를 깨면 도구가 열립니다. 다이아몬드는 영구 외형에만 쓰고, 진행은 이 브라우저에 저장됩니다.","관련 게임"],"es":["Elige un lanzador y comprueba el cantero previsto. Girar una clavija cuesta una gota. Una fuente fresca devuelve una gota. Las aspas doradas desplazan dos casillas y las bisagras azules se giran al tocarse.","¿Puedo terminar sin diamantes?","Sí. Supera niveles para desbloquear herramientas. Los diamantes compran aspectos permanentes. El progreso se guarda en este navegador.","Juegos relacionados"],"pt-BR":["Escolha um lançador e confira o canteiro previsto. Girar um pino custa uma gota. Uma fonte nova devolve uma gota. As aletas douradas avançam duas casas e as dobradiças azuis viram depois do contato.","Dá para terminar sem diamantes?","Sim. Complete fases para liberar ferramentas. Diamantes compram aparências permanentes. O progresso fica salvo neste navegador.","Jogos relacionados"],"fr":["Choisissez un lanceur et vérifiez le parterre prévu. Tourner une cheville coûte une goutte. Une source intacte rend une goutte. Les ailettes dorées déplacent de deux cases et les charnières bleues basculent au contact.","Puis-je finir sans diamants ?","Oui. Terminez les niveaux pour débloquer des outils. Les diamants achètent des apparences permanentes. La progression reste dans ce navigateur.","Jeux similaires"],"de":["Wähle einen Startschacht und prüfe das vorausgesagte Beet. Einen Stift zu drehen kostet einen Tropfen. Eine frische Quelle gibt einen Tropfen zurück. Goldene Flügel lenken zwei Felder weiter und blaue Scharniere kippen bei Kontakt.","Geht es ohne Diamanten?","Ja. Abgeschlossene Level schalten Werkzeuge frei. Diamanten kaufen dauerhafte Designs. Dieser Browser speichert deinen Fortschritt.","Ähnliche Spiele"],"it":["Scegli un lanciatore e controlla l’aiuola prevista. Girare un perno costa una goccia. Una sorgente fresca restituisce una goccia. Le alette dorate spostano di due caselle e le cerniere blu si ribaltano al contatto.","Si può finire senza diamanti?","Sì. Completa i livelli per sbloccare gli attrezzi. I diamanti comprano aspetti permanenti. I progressi si salvano in questo browser.","Giochi simili"],"ru":["Выберите желоб и проверьте прогноз. Поворот штифта стоит одну каплю. Свежий источник возвращает каплю. Золотая направляющая сдвигает семя на две клетки, синий шарнир переворачивается после касания.","Можно пройти без алмазов?","Да. Инструменты открываются за прохождение. Алмазы нужны для постоянного оформления. Прогресс хранится в этом браузере.","Похожие игры"],"hi":["खाँचा चुनें और अनुमानित क्यारी देखें। एक खूँटी घुमाने में एक बूँद लगती है। ताज़ा सोते से एक बूँद मिलती है। सुनहरे पंख बीज को दो खाने बढ़ाते हैं और नीले कब्ज़े टकराने के बाद पलटते हैं।","क्या हीरों के बिना पूरा कर सकते हैं?","हाँ। स्तर पूरे करके औज़ार खोलें। हीरों से स्थायी रूप मिलते हैं। प्रगति इसी ब्राउज़र में सहेजी जाती है।","मिलते-जुलते खेल"],"ar":["اختر فتحة الإطلاق وتحقق من الحوض المتوقع. تدوير وتد يكلف قطرة ماء. النبع الجديد يعيد قطرة. الريش الذهبي يوجّه البذرة خطوتين، والمفصلة الزرقاء تنقلب بعد اللمس.","هل يمكن الإكمال بلا ألماس؟","نعم. أكمل المراحل لفتح الأدوات. الألماس للمظاهر الدائمة، ويُحفظ تقدمك في هذا المتصفح.","ألعاب مشابهة"]};
const escape = v => String(v).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<','&lt;').replaceAll('>', '&gt;');
function catalogs() {
 const context = { window: {} };
 for (const f of ['lobby-data.js?wp-media=2f0d4cb4d54499ee','game-title-registry.js?wp-media=2f0d4cb4d54499ee','interface7-poster-registry.js?wp-media=2f0d4cb4d54499ee']) {
   vm.runInNewContext(fs.readFileSync(new URL('src/'+f, ROOT), 'utf8'), context, {timeout:3000});
 }
 return context.window;
}
function section(html, key, text) {
 const start = '<!-- grove-' + key + ':start -->', end = '<!-- grove-' + key + ':end -->';
 const i = html.indexOf(start), j = html.indexOf(end);
 if (i < 0 || j < i) throw Error('Missing section ' + key);
 return html.slice(0, i+start.length) + '\n' + text + '\n' + html.slice(j);
}
export function renderEntry(locale) {
 const route = ROUTES[locale];
 if (!route) throw Error('Unsupported locale ' + locale);
 const [,type,desc] = BASE[locale], [rules,q,a,relatedTitle] = RULES[locale];
 const t = key => escape(word(locale,key));
 const data = catalogs(), game = data.WONDER_LOBBY.games.find(g=>g.id===GAME);
 const name = data.WEIGHTPLAY_GAME_TITLES?.[GAME]?.[locale];
 if (!game || typeof name !== 'string' || !name.trim()) throw Error('Missing approved game name');
 const publicGame = game.status === 'playable' && !game.internalOnly && !game.internalTrial;
 const slug = '/games/' + GAME + '/';
 const url = HOST + '/' + route + slug, title = name+' – '+type+' | WeightPlay';
 const schema = {'@context':'https://schema.org','@graph':[
 {'@type':'VideoGame',name,description:desc,url,image:HOST+COVER,inLanguage:locale,genre:type,gamePlatform:'Web browser',isAccessibleForFree:true,publisher:{'@type':'Organization',name:'WeightStudio'}},
 {'@type':'FAQPage',mainEntity:[{'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}]}
 ]};
 const meta = [
 '<title data-runtime-localize="off">'+escape(title)+'</title>',
 '<meta name="description" content="'+escape(desc)+'">',
 '<meta name="robots" content="'+(publicGame?'index,follow':'noindex,nofollow,noarchive')+'">',
 '<link rel="canonical" href="'+url+'">',
 ...[...Object.entries(ROUTES),['x-default','en']].map(([l,r])=>'<link rel="alternate" hreflang="'+l+'" href="'+HOST+'/'+r+slug+'">'),
 ...Object.entries({type:'website',site_name:'WeightPlay',url,title:name,description:desc,image:HOST+COVER}).map(([k,v])=>'<meta property="og:'+k+'" content="'+escape(v)+'">'),
 '<meta name="twitter:card" content="summary_large_image">',
 '<script type="application/ld+json">'+JSON.stringify(schema).replaceAll('<','\\u003c')+'</script>',
 ].join('\n');
 const related = ['animal-orb-fortress','breakout'].flatMap(id=>{
   const entry=data.WONDER_LOBBY.games.find(g=>g.id===id), title=data.WEIGHTPLAY_GAME_TITLES?.[id]?.[locale];
   const poster=data.WEIGHTPLAY_INTERFACE7_POSTERS?.[id];
   if(entry?.status!=='playable'||!title||!poster?.startsWith('/')||!fs.existsSync(new URL(route+'/games/'+id+'/index.html',ROOT)))return [];
   return ['<a class="game-info-related-card" data-game-id="'+id+'" data-wp-related-id="'+id+'" href="/'+route+'/games/'+id+'/"><span class="game-info-related-poster"><img loading="lazy" src="'+escape(poster)+'" width="320" height="320" alt=""></span><span class="game-info-related-copy"><strong>'+escape(title)+'</strong></span></a>'];
 });
 const guide = '<article class="game-info-section"><h3>'+escape(type)+'</h3><p data-wp-intro-faq-source>'+escape(desc)+'</p><p data-grove-rules>'+escape(rules)+'</p></article><details><summary>'+escape(q)+'</summary><p>'+escape(a)+'</p></details>' +
 (related.length?'<div class="game-info-section game-info-related-section" data-wp-guide-related-interface="9"><h3>'+escape(relatedTitle)+'</h3><div class="game-info-related-cards">'+related.join('')+'</div></div>':'');
 let html = fs.readFileSync(new URL('index.html',import.meta.url),'utf8')
  .replace(/<html lang="[^"]+" dir="[^"]+"/,'<html lang="'+locale+'" dir="'+(locale==='ar'?'rtl':'ltr')+'"')
  .replace(/<script\b[^>]*\bdata-wp-locale-route(?=[\s=>])[^>]*>[\s\S]*?<\/script>/gi,'')
  .replace(/<body /,publicGame?'<body ':'<body data-internal-only="true" ')
  .replace(/(id="mainReturn" href=")[^"]*"/,(_,p)=>p+'/'+route+'/'+(publicGame?'':'?preview=1')+'"')
  .replace(/(id="cover"[^>]* alt=")[^"]*"/,(_,p)=>p+escape(name)+'"');
 for(const [id,copy] of Object.entries({
  gameTitle:escape(name),description:escape(desc),guideTitle:t('guide'),startBtn:t('start'),stagesTab:t('stages'),gearTab:t('workshop'),
  runBtn:t('release'),toolBtn:t('tool'),helpBtn:t('help'),resultMap:t('stages'),resultNext:t('next'),resultRetry:t('retry'),
  waterLabel:t('water'),seedsLabel:t('seeds'),bedsLabel:t('beds'),
 })) html=html.replace(new RegExp('(<[a-z0-9]+[^>]* id="'+id+'"[^>]*>)[^<]*(</[a-z0-9]+>)','i'),(_,open,close)=>open+copy+close);
 html = html.replace(/(id="(?:stageBack|battleBack)"[^>]*aria-label=")[^"]*"/g,(_,p)=>p+t('back')+'"');
 html = html.replace(/<link\b(?=[^>]*\brel=["'](?:canonical|alternate)["'])[^>]*>/gi, '')
  .replace(/<meta\b(?=[^>]*\b(?:name|property)=["'](?:robots|description|og:[^"']+|twitter:[^"']+)["'])[^>]*>/gi, '')
  .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
  .replace(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, '');
 return section(section(html,'meta',meta),'guide',guide);
}
export function renderGuide(locale) {
 const match = renderEntry(locale).match(/<section id="guideContent"[^>]*>[\s\S]*?<\/section>/);
 if (!match) throw Error('Missing guide');
 // The shared route generator regenerates this supplement from the localized
 // introduction; retaining the canonical English copy creates a fallback.
 return match[0].replace(/<article\b(?=[^>]*\bdata-wp-intro-faq(?:\s|>|=))[^>]*>[\s\S]*?<\/article>/i, '');
}

