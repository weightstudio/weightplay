// Game-owned geometry, matching and copy. No network, storage or shared arcade state.
const rows = {
 en: ['Match identical free tiles to clear the board.','Tap a bright tile, then a matching bright tile. Try the outlined pair.','Free: nothing above, and the left OR right side is clear.','Both sides are blocked. Remove an edge pair first.','Covered: remove the upper pair first.','Choose an identical free tile.','Pair removed! Look for newly freed tiles.','Tap the two outlined tiles to remove this legal pair.','Different tiles. Find a free match for the second tile.','Free','Blocked','Tile','Dots','Bamboo','Wind','How to play'],
 'zh-Hant': ['配對相同的可用牌，清空整個牌盤。','先點一張亮牌，再點相同的亮牌。可先試試描邊的這一對。','上方沒有牌覆蓋，而且左邊或右邊至少一側沒有牌，才能選。','左右兩邊都有牌擋住。先消除邊緣的配對。','這張牌被壓住了。先消除上面的配對。','接著選一張相同、且可以取出的牌。','配對消除了！看看哪些牌因此解鎖。','描邊的兩張牌可以配對。依序點它們即可消除。','這兩張不同。保留第二張，找一張相同的可用牌。','可用','被擋住','牌','筒','索','風牌','怎麼玩'],
 'zh-Hans': ['配对相同的可用牌，清空整个牌盘。','先点一张亮牌，再点相同的亮牌。可以先试试描边的这一对。','上方没有牌覆盖，而且左边或右边至少一侧没有牌，才能选。','左右两边都有牌挡住。先消除边缘的配对。','这张牌被压住了。先消除上面的配对。','接着选一张相同、且可以取出的牌。','配对消除了！看看哪些牌因此解锁。','描边的两张牌可以配对。依次点它们即可消除。','这两张不同。保留第二张，找一张相同的可用牌。','可用','被挡住','牌','筒','索','风牌','怎么玩'],
 ja: ['同じ絵柄の取れる牌を組にして、盤面を空にします。','明るい牌を押し、同じ絵柄の明るい牌を押します。枠の付いた組を試しましょう。','上に牌がなく、左右どちらか一方に牌がなければ取れます。','左右が塞がれています。端の組を先に取りましょう。','上に牌があります。上の組を先に取りましょう。','同じ絵柄の取れる牌を選びましょう。','組を取りました。新しく取れる牌を探しましょう。','枠の付いた2枚を順に押しましょう。','絵柄が違います。2枚目と同じ取れる牌を探しましょう。','取れる','取れない','牌','筒子','索子','風牌','遊び方'],
 ko: ['같은 그림의 열린 패를 짝지어 판을 비우세요.','밝은 패를 누른 뒤 같은 밝은 패를 누르세요. 테두리 쌍부터 해 보세요.','위에 패가 없고 왼쪽 또는 오른쪽이 비어 있어야 선택할 수 있어요.','양옆이 막혔어요. 가장자리 쌍을 먼저 없애세요.','위에 패가 있어요. 위쪽 쌍을 먼저 없애세요.','같은 그림의 열린 패를 고르세요.','짝을 없앴어요. 새로 열린 패를 살펴보세요.','테두리의 두 패를 차례로 누르세요.','서로 다른 패예요. 두 번째 패와 같은 열린 패를 찾으세요.','열림','막힘','패','통','삭','풍패','게임 방법'],
 es: ['Empareja fichas libres iguales para vaciar el tablero.','Toca una ficha clara y luego otra igual. Prueba la pareja marcada.','Libre: sin otra encima y con el lado izquierdo O derecho libre.','Ambos lados están bloqueados. Retira una pareja del borde.','Está cubierta. Retira primero la pareja superior.','Elige otra ficha libre con el mismo dibujo.','Pareja retirada. Busca las fichas que se han liberado.','Toca las dos fichas marcadas para retirar la pareja.','Son distintas. Busca una pareja libre para la segunda.','Libre','Bloqueada','Ficha','Círculos','Bambú','Viento','Cómo jugar'],
 'pt-BR': ['Combine peças livres iguais para esvaziar o tabuleiro.','Toque numa peça clara e depois numa igual. Experimente o par destacado.','Livre: sem outra por cima e com o lado esquerdo OU direito livre.','Os dois lados estão bloqueados. Remova um par da borda.','Está coberta. Remova primeiro o par superior.','Escolha uma peça livre com o mesmo desenho.','Par removido. Procure as peças que ficaram livres.','Toque nas duas peças destacadas para remover o par.','São diferentes. Procure um par livre para a segunda.','Livre','Bloqueada','Peça','Círculos','Bambu','Vento','Como jogar'],
 fr: ['Associez les tuiles libres identiques pour vider le plateau.','Touchez une tuile claire puis une identique. Essayez la paire encadrée.','Libre : rien au-dessus et le côté gauche OU droit libre.','Les deux côtés sont bloqués. Retirez une paire du bord.','Elle est couverte. Retirez d’abord la paire du dessus.','Choisissez une tuile libre portant le même motif.','Paire retirée. Repérez les tuiles maintenant libres.','Touchez les deux tuiles encadrées pour retirer la paire.','Elles diffèrent. Cherchez une paire libre pour la seconde.','Libre','Bloquée','Tuile','Cercles','Bambous','Vent','Comment jouer'],
 de: ['Entferne gleiche freie Steine, bis das Brett leer ist.','Tippe auf einen hellen Stein, dann auf einen gleichen. Beginne mit dem markierten Paar.','Frei: kein Stein darüber und links ODER rechts Platz.','Beide Seiten sind blockiert. Entferne zuerst ein Randpaar.','Ein Stein liegt darauf. Entferne zuerst das obere Paar.','Wähle einen freien Stein mit demselben Bild.','Paar entfernt. Suche nach neu freigewordenen Steinen.','Tippe beide markierten Steine an, um das Paar zu entfernen.','Die Bilder sind verschieden. Finde einen freien Partner für den zweiten Stein.','Frei','Blockiert','Stein','Kreise','Bambus','Wind','Spielanleitung'],
 it: ['Abbina tessere libere uguali per svuotare il tavolo.','Tocca una tessera chiara e poi una uguale. Prova la coppia evidenziata.','Libera: non coperta e con il lato sinistro O destro libero.','Entrambi i lati sono bloccati. Rimuovi una coppia sul bordo.','È coperta. Rimuovi prima la coppia superiore.','Scegli una tessera libera con lo stesso simbolo.','Coppia rimossa. Cerca le tessere appena liberate.','Tocca le due tessere evidenziate per rimuoverle.','Sono diverse. Cerca una coppia libera per la seconda.','Libera','Bloccata','Tessera','Cerchi','Bambù','Vento','Come giocare'],
 ru: ['Убирайте одинаковые свободные плитки, пока поле не опустеет.','Нажмите светлую плитку, затем такую же. Начните с выделенной пары.','Свободна: сверху ничего нет, слева ИЛИ справа есть место.','Обе стороны закрыты. Сначала уберите пару с края.','Сверху лежит плитка. Сначала уберите верхнюю пару.','Выберите свободную плитку с таким же рисунком.','Пара убрана. Найдите освободившиеся плитки.','Нажмите две выделенные плитки, чтобы убрать пару.','Рисунки разные. Найдите свободную пару для второй плитки.','Свободна','Закрыта','Плитка','Круги','Бамбук','Ветер','Как играть'],
 hi: ['एक जैसी खुली टाइलों की जोड़ी हटाकर बोर्ड खाली करें।','एक चमकीली टाइल और फिर वैसी ही दूसरी टाइल दबाएँ। घेरे वाली जोड़ी से शुरू करें।','ऊपर कोई टाइल न हो और बायाँ या दायाँ किनारा खाली हो।','दोनों किनारे बंद हैं। पहले किनारे की जोड़ी हटाएँ।','ऊपर दूसरी टाइल है। पहले ऊपर की जोड़ी हटाएँ।','इसी चित्र वाली खुली टाइल चुनें।','जोड़ी हट गई। अब खुली टाइलें देखें।','घेरे वाली दो टाइलें बारी-बारी दबाएँ।','चित्र अलग हैं। दूसरी टाइल की खुली जोड़ी खोजें।','खुली','बंद','टाइल','गोले','बाँस','हवा','कैसे खेलें'],
 ar: ['طابق القطع الحرة المتشابهة حتى تفرغ اللوحة.','اضغط قطعة مضيئة ثم قطعة مماثلة. ابدأ بالزوج المحدد بإطار.','حرة: لا شيء فوقها وجانبها الأيسر أو الأيمن خالٍ.','الجانبان محجوبان. أزل زوجاً من الحافة أولاً.','تغطيها قطعة أخرى. أزل الزوج العلوي أولاً.','اختر قطعة حرة تحمل الرمز نفسه.','أزيل الزوج. ابحث عن القطع التي أصبحت حرة.','اضغط القطعتين المحددتين بالتتابع لإزالة الزوج.','الرمزان مختلفان. ابحث عن نظيرة حرة للقطعة الثانية.','حرة','محجوبة','قطعة','دوائر','خيزران','ريح','طريقة اللعب'],
};
export const locales = Object.keys(rows);
export function copy(locale) {
 const [goal,step,rule,sides,covered,selected,matched,hint,mismatch,open,blocked,tile,dots,bamboo,wind,how] = rows[locale] || rows.en;
 return {goal,step,rule,sides,covered,selected,matched,hint,mismatch,open,blocked,tile,dots,bamboo,wind,how};
}
export function blockedReason(state,i) {
 if (!state.tiles[i]) return 'removed';
 const a=state.positions[i], live=state.positions.filter((_,j)=>j!==i && state.tiles[j]);
 if (live.some(b=>b.z>a.z && Math.abs(b.x-a.x)<.99 && Math.abs(b.y-a.y)<.99)) return 'covered';
 const side=dx=>live.some(b=>b.z===a.z && Math.abs(b.y-a.y)<.01 && Math.abs(b.x-a.x-dx)<.01);
 return side(-1)&&side(1) ? 'sides' : '';
}
export const isOpen=(s,i)=>blockedReason(s,i)==='';
export function pairs(s) {
 const out=[];
 s.tiles.forEach((symbol,i)=>{if(isOpen(s,i))for(let j=i+1;j<s.tiles.length;j++)if(symbol===s.tiles[j]&&isOpen(s,j))out.push([i,j]);});
 return out;
}
export function create(layoutKey='crosswind',depth='standard') {
 const seed=[...layoutKey].reduce((s,c)=>s+c.charCodeAt(0),0), width=depth==='mastery'?6:5, height=depth==='mastery'?3:2, positions=[];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)positions.push({x,y,z:0});
 const left=depth==='mastery'?1:.5+seed%3;
 for(let x=0;x<(depth==='mastery'?4:2);x++)positions.push({x:left+x,y:.5,z:1});
 if(depth==='mastery')positions.push({x:2,y:.5,z:2},{x:3,y:.5,z:2});
 const temp={positions,tiles:positions.map(()=>'live')}, tiles=[];
 // Unique pairs assigned along a legal removal path; removing any pair cannot
 // close another tile, so every legal choice preserves solvability.
 let n=0;
 while(temp.tiles.some(Boolean)) {
  const open=positions.map((p,i)=>({...p,i})).filter(p=>isOpen(temp,p.i)).sort((a,b)=>b.z-a.z||((a.i+seed)%positions.length)-((b.i+seed)%positions.length));
  if(open.length<2)throw new Error('UNSOLVABLE_MAHJONG_LAYOUT');
  for(const {i} of open.slice(0,2)){tiles[i]=String(1+(n+seed)%(positions.length/2));temp.tiles[i]='';}n++;
 }
 return {tiles,positions,layoutKey,depth,width,height,targetPairs:tiles.length/2,selected:-1,matched:0,score:0,moves:0,focusTile:-1,hintPair:[]};
}
export function select(s,i,locale) {
 const t=copy(locale), reason=blockedReason(s,i); s.hintPair=[];
 if(reason){s.moves--;return {text:t[reason]||t.rule,tone:'warn',key:'mj:'+reason};}
 if(s.selected===i){s.moves--;s.selected=-1;return {text:t.step,key:'mj:step'};}
 if(s.selected<0){s.selected=i;s.focusTile=i;return {text:t.selected,key:'mj:selected'};}
 if(s.tiles[s.selected]!==s.tiles[i]){s.moves--;s.selected=i;s.focusTile=i;return {text:t.mismatch,tone:'warn',key:'mahjongMismatch'};}
 s.tiles[s.selected]='';s.tiles[i]='';s.selected=-1;s.matched++;s.score+=30;
 s.focusTile=s.tiles.findIndex((_,j)=>isOpen(s,j));return {text:t.matched,tone:'good',key:'mj:matched'};
}
export function symbolSvg(value) {
 const n=Number(value)-1,rank=n%4+1;let content='';
 if(n<4)for(let i=0;i<rank;i++){const x=rank===1?24:15+i%2*18,y=rank<3?26:16+Math.floor(i/2)*20;content+=`<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#b84734" stroke-width="3"/><circle cx="${x}" cy="${y}" r="2" fill="#b84734"/>`;}
 else if(n<8)for(let i=0;i<rank;i++)content+=`<path d="M${12+i*8} 12v30m-3-21h6m-6 12h6" stroke="#17735f" stroke-width="4" stroke-linecap="round"/>`;
 else content=`<text x="24" y="37" text-anchor="middle" font-size="34" font-weight="700" fill="#24508a">${['東','南','西','北'][n-8]}</text>`;
 return `<svg viewBox="0 0 48 54" aria-hidden="true"><path d="M4 10V5h5M39 5h5v5M44 44v5h-5M9 49H4v-5" fill="none" stroke="#ad9259" stroke-opacity=".5" stroke-width=".7"/>${content}</svg>`;
}
function tileName(symbol,t){const n=Number(symbol)-1;return `${t.tile} ${n<4?`${n+1} ${t.dots}`:n<8?`${n-3} ${t.bamboo}`:`${t.wind} ${['東','南','西','北'][n-8]}`}`;}
export function render(s,locale) {
 const t=copy(locale), hint=s.hintPair.length?s.hintPair:s.moves===0?pairs(s)[0]||[]:[];
 return `<div class="tile-board mj-layered" data-layout-key="${s.layoutKey}" data-depth="${s.depth}" style="--cols:${s.width};--rows:${s.height}">${s.tiles.map((symbol,i)=>{
  if(!symbol)return '';const p=s.positions[i],open=isOpen(s,i),selected=s.selected===i;
  return `<button type="button" class="tile ${selected?'selected':''} ${hint.includes(i)?'mj-hint':''}" data-action="tile" data-value="${i}" data-symbol="${symbol}" data-open="${open}" data-layer="${p.z}" aria-disabled="${!open}" aria-pressed="${selected}" aria-label="${tileName(symbol,t)} · ${open?t.open:t.blocked}${selected?` · ${t.selected}`:''}" style="--x:${p.x};--y:${p.y};--z:${p.z}">${symbolSvg(symbol)}${open?'':'<span class="mj-lock" aria-hidden="true">×</span>'}</button>`;
 }).join('')}</div>`;
}
export function guideHtml(locale){const t=copy(locale);return `<div class="game-info-sections"><div class="game-info-section"><h3>${t.how}</h3><p>${t.goal}</p><ol>${[t.step,t.rule,t.covered,t.sides,t.matched,t.mismatch,t.hint].map(x=>`<li>${x}</li>`).join('')}</ol></div></div>`;}
export function decorate(els,locale){
 const t=copy(locale);els.objective.textContent=t.goal;
 const progress=document.querySelector('[data-wp-main-progress]');
 if(progress)progress.innerHTML=`<strong>${t.how}</strong><span>${t.step}</span><span class="mj-example" aria-hidden="true">${symbolSvg('1')} + ${symbolSvg('1')} → ✓</span><span>${t.rule}</span>`;
 const guide=document.querySelector('[data-wp-game-guide]');if(guide)guide.innerHTML=guideHtml(locale);
 for(const node of [els.objective,progress,guide])if(node)node.dataset.runtimeLocalize='off';
}
export const gameVersion='v13';
export default {gameVersion,create,isOpen,pairs,select,render,copy,decorate,guideHtml};
