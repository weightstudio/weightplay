// Inactive chapter candidate. The game must keep its readiness gate false
// until art, localization, persistence, reward and rendered checks are complete.
(() => { 'use strict';
// Disable the shared collector before DOMContentLoaded on a local practice
// request, even when the shared authorization subsequently fails.
if(globalThis.location?.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(globalThis.location.hostname)&&new URLSearchParams(globalThis.location.search).get('practice')==='1'){
 const analytics=globalThis.WONDER_SITE?.analytics;if(analytics){analytics.enabled=false;if(analytics.gaMeasurementId)globalThis[`ga-disable-${analytics.gaMeasurementId}`]=true;}
}
// Each tray contains the existing six uniquely valued stones [1,2,3,4,5,6].
// A chosen counterweight adds to the left target; it is not a tray stone.
const rows = [
// id, base, counterweights, exact count, required, avoided, odd count, linked pair
[31,4,[1],2,0,0,null,null],
[32,6,[1],2,1,0,null,null],
[33,8,[1],2,0,2,null,null],
[34,9,[1],2,4,0,null,null],
[35,11,[1],3,0,0,2,null],
[36,7,[1,2],2,0,0,null,null],
[37,8,[1,2],2,3,0,null,null],
[38,9,[1,2],2,0,4,null,null],
[39,8,[1,2],3,1,0,null,null],
[40,8,[1,2],3,0,0,null,[1,2]],
[41,10,[1,2],3,4,0,null,null],
[42,9,[1,3],3,0,5,null,null],
[43,9,[1,3],3,2,0,2,null],
[44,8,[1,2],3,0,3,null,[1,2]],
[45,12,[1,2],3,6,0,2,null],
[46,8,[1,2],2,0,5,0,null],
[47,8,[1,3],3,0,4,1,null],
[48,10,[1,2],3,1,4,null,null],
[49,11,[1,2,3],3,0,2,2,null],
[50,9,[1,2],3,0,4,null,[2,3]],
[51,10,[1,2,3],3,1,0,1,null],
[52,8,[1,3],3,0,6,null,[2,3]],
[53,12,[1,2,3],3,5,2,2,null],
[54,12,[1,2,3],4,0,0,2,[1,2]],
[55,6,[1,2,3],3,0,0,1,[2,3]],
[56,11,[1,2,3],3,4,2,1,null],
[57,8,[1,3],3,0,4,1,[1,5]],
[58,14,[1,2],4,5,0,2,null],
[59,12,[1,2,3],3,6,0,null,[1,2]],
[60,7,[1,2,3],3,5,6,2,[1,5]]
];
const CHAPTER2=Object.freeze(rows.map(([id,base,counterweights,count,anchor,avoid,oddCount,pair])=>Object.freeze({id,base,counterweights:Object.freeze(counterweights),count,anchor,avoid,oddCount,pair:pair&&Object.freeze(pair),pairMode:id===50?'both':id===55?'one':'together',anchorFirst:id===45,lockAfterCheck:id===60,pieces:Object.freeze([1,2,3,4,5,6])})));
function evaluate(stage,selected,counterweight){
 const validInput=stage&&Array.isArray(selected)&&new Set(selected).size===selected.length&&selected.every(n=>stage.pieces.includes(n))&&stage.counterweights.includes(counterweight);
 if(!validInput)return {valid:false,reason:'invalid-input'};
 const total=selected.reduce((a,b)=>a+b,0),target=stage.base+counterweight;
 const first=stage.pair&&selected.includes(stage.pair[0]),second=stage.pair&&selected.includes(stage.pair[1]);
 const countOK=selected.length===stage.count,anchorOK=!stage.anchor||selected.includes(stage.anchor),orderOK=!stage.anchorFirst||selected[0]===stage.anchor,avoidOK=!stage.avoid||!selected.includes(stage.avoid),oddOK=stage.oddCount===null||selected.filter(n=>n%2===1).length===stage.oddCount,pairOK=!stage.pair||(stage.pairMode==='both'?first&&second:stage.pairMode==='one'?first!==second:first===second);
 return {valid:total===target&&countOK&&anchorOK&&orderOK&&avoidOK&&oddOK&&pairOK,total,target,countOK,anchorOK,orderOK,avoidOK,oddOK,pairOK};
}
// Finale check locks the selected counterweight. Clearing the entire board is
// the explicit way to unlock and choose a different one; no result is saved.
function createBoard(stage){
 let selected=[],weight=null,locked=false;
 return Object.freeze({snapshot:()=>({selected:[...selected],weight,locked}),
  choose(n){if(locked||!stage.counterweights.includes(n))return false;weight=n;return true;},
  toggle(n){if(!stage.pieces.includes(n))return false;selected=selected.includes(n)?selected.filter(x=>x!==n):[...selected,n];return true;},
  check(){if(weight===null||selected.length===0)return {valid:false,reason:'incomplete'};if(stage.lockAfterCheck)locked=true;return evaluate(stage,selected,weight);},
  clear(){selected=[];weight=null;locked=false;}
 });
}
function solutions(stage){const found=[];for(const weight of stage.counterweights)for(let mask=1;mask<64;mask++){let selected=stage.pieces.filter((_,i)=>mask&(1<<i));if(stage.anchorFirst&&selected.includes(stage.anchor))selected=[stage.anchor,...selected.filter(n=>n!==stage.anchor)];if(evaluate(stage,selected,weight).valid)found.push({weight,selected});}return found;}
// A hint is advisory and does not alter tool, stones, save, or stars itself.
// Prefer a solution using the current legal counterweight when one exists;
// otherwise the first hint asks for a usable counterweight before a stone.
function hint(stage,selected,counterweight,locked=false){
 if(!stage||!Array.isArray(selected)||new Set(selected).size!==selected.length||!selected.every(n=>stage.pieces.includes(n)))return {kind:'invalid-input'};
 const all=solutions(stage),same=all.filter(s=>s.weight===counterweight),pool=same.length?same:all;
 const distance=s=>s.selected.filter(n=>!selected.includes(n)).length+selected.filter(n=>!s.selected.includes(n)).length;
 const best=[...pool].sort((a,b)=>distance(a)-distance(b)||a.weight-b.weight)[0];
 if(!best)return {kind:'no-solution'};
 if(counterweight!==best.weight)return locked?{kind:'clear'}:{kind:'counterweight',value:best.weight};
 if(stage.anchorFirst&&selected.length&&selected[0]!==stage.anchor)return {kind:'remove',value:selected[0]};
 const remove=selected.find(n=>!best.selected.includes(n));if(remove!==undefined)return {kind:'remove',value:remove};
 const add=best.selected.find(n=>!selected.includes(n));return add===undefined?{kind:'ready'}:{kind:'add',value:add};
}
const COPY={
 en:['Counterweight Canopy','Choose one counterweight','Exactly {n} odd stones','Use both {a} and {b}, or neither','Use both {a} and {b}','Use exactly one of {a} and {b}','Choose {n} first','Counterweight locked; clear to change','Hint: choose counterweight {n}','Hint: clear to change the locked counterweight'],
 'zh-Hant':['配重樹冠','選擇一個配重','剛好 {n} 顆奇數石','{a} 與 {b} 同時選或都不選','必須同時選 {a} 和 {b}','{a} 和 {b} 剛好選一顆','先選 {n}','配重已鎖定；清除後可更換','提示：選擇配重 {n}','提示：先清除，再更換配重'],
 'zh-Hans':['配重树冠','选择一个配重','恰好 {n} 颗奇数石','{a} 与 {b} 同时选或都不选','必须同时选 {a} 和 {b}','{a} 和 {b} 恰好选一颗','先选 {n}','配重已锁定；清除后可更换','提示：选择配重 {n}','提示：先清除，再更换配重'],
 ja:['おもりの樹冠','おもりを一つ選ぶ','奇数の石をちょうど {n} 個','{a} と {b} は両方選ぶか両方選ばない','{a} と {b} を両方選ぶ','{a} と {b} の一方だけ選ぶ','最初に {n} を選ぶ','おもりは固定中。クリアして変更','ヒント：おもり {n} を選ぶ','ヒント：クリアしておもりを変更'],
 ko:['추의 나무 꼭대기','추 하나를 선택하세요','홀수 돌을 정확히 {n}개','{a}와 {b}를 둘 다 선택하거나 둘 다 제외','{a}와 {b}를 둘 다 선택','{a}와 {b} 중 하나만 선택','{n}을 먼저 선택','추가 잠겼습니다. 지우고 변경하세요','힌트: 추 {n} 선택','힌트: 지운 뒤 추 변경'],
 es:['Doseles de contrapeso','Elige un contrapeso','Exactamente {n} piedras impares','Elige {a} y {b} juntos o ninguno','Elige {a} y {b}','Elige solo uno entre {a} y {b}','Elige primero {n}','Contrapeso bloqueado; limpia para cambiar','Pista: elige el contrapeso {n}','Pista: limpia para cambiar el contrapeso'],
 'pt-BR':['Copa dos contrapesos','Escolha um contrapeso','Exatamente {n} pedras ímpares','Escolha {a} e {b} juntos ou nenhum','Escolha {a} e {b}','Escolha apenas um entre {a} e {b}','Escolha {n} primeiro','Contrapeso bloqueado; limpe para trocar','Dica: escolha o contrapeso {n}','Dica: limpe para trocar o contrapeso'],
 fr:['Canopée des contrepoids','Choisissez un contrepoids','Exactement {n} pierres impaires','Choisissez {a} et {b} ensemble ou aucun','Choisissez {a} et {b}','Choisissez exactement un de {a} et {b}','Choisissez {n} en premier','Contrepoids verrouillé ; effacez pour changer','Indice : choisissez le contrepoids {n}','Indice : effacez pour changer le contrepoids'],
 de:['Gegengewichtskronen','Wähle ein Gegengewicht','Genau {n} ungerade Steine','Wähle {a} und {b} zusammen oder keines','Wähle sowohl {a} als auch {b}','Wähle genau eines von {a} und {b}','Wähle zuerst {n}','Gegengewicht gesperrt; zum Wechseln leeren','Hinweis: Wähle Gegengewicht {n}','Hinweis: Leere das Feld zum Wechseln'],
 it:['Chioma dei contrappesi','Scegli un contrappeso','Esattamente {n} pietre dispari','Scegli {a} e {b} insieme oppure nessuno','Scegli sia {a} sia {b}','Scegli uno solo tra {a} e {b}','Scegli prima {n}','Contrappeso bloccato; svuota per cambiare','Suggerimento: scegli il contrappeso {n}','Suggerimento: svuota per cambiare'],
 ru:['Кроны противовесов','Выберите один противовес','Ровно {n} камней с нечётным числом','Выберите {a} и {b} вместе или ни один','Выберите и {a}, и {b}','Выберите ровно один из {a} и {b}','Сначала выберите {n}','Противовес заблокирован; очистите поле','Подсказка: выберите противовес {n}','Подсказка: очистите поле для смены'],
 hi:['प्रतिभार की छतरी','एक प्रतिभार चुनें','ठीक {n} विषम पत्थर','{a} और {b} दोनों चुनें या कोई नहीं','{a} और {b} दोनों चुनें','{a} और {b} में से ठीक एक चुनें','पहले {n} चुनें','प्रतिभार लॉक है; बदलने के लिए साफ़ करें','संकेत: प्रतिभार {n} चुनें','संकेत: प्रतिभार बदलने के लिए साफ़ करें'],
 ar:['مظلة الأثقال','اختر ثقلاً موازناً واحداً','اختر {n} أحجار بأعداد فردية بالضبط','اختر {a} و{b} معاً أو لا تختر أياً منهما','اختر {a} و{b} معاً','اختر واحداً فقط من {a} و{b}','اختر {n} أولاً','الثقل مقفل؛ امسح الاختيارات لتغييره','تلميح: اختر الثقل {n}','تلميح: امسح الاختيارات لتغيير الثقل']
};
const LOCK_RULE={en:'After the first check, clear to change the counterweight.','zh-Hant':'第一次檢查後，須清除才能更換配重。','zh-Hans':'第一次检查后，须清除才能更换配重。',ja:'最初の確認後、おもりを変えるにはクリアします。',ko:'첫 확인 후에는 지워야 추를 바꿀 수 있습니다.',es:'Tras comprobar, limpia para cambiar el contrapeso.','pt-BR':'Após conferir, limpe para trocar o contrapeso.',fr:'Après vérification, effacez pour changer le contrepoids.',de:'Nach der Prüfung zum Wechseln das Feld leeren.',it:'Dopo la verifica, svuota per cambiare contrappeso.',ru:'После проверки очистите поле, чтобы сменить противовес.',hi:'पहली जाँच के बाद प्रतिभार बदलने के लिए साफ़ करें।',ar:'بعد أول فحص، امسح الاختيارات لتغيير الثقل.'};
for(const [locale,row] of Object.entries(COPY)){if(row.length!==10||!LOCK_RULE[locale])throw Error('INCOMPLETE_BALANCE_CHAPTER2_COPY');row.push(LOCK_RULE[locale]);}
globalThis.BalanceGroveChapter2=Object.freeze({CHAPTER2,evaluate,solutions,hint,createBoard,COPY});
})();
