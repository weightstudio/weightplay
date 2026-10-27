(() => {
// Isolated native-control candidate; not loaded by any game entry.
// Caller supplies current live units, translated names and the real order method.
const COPY = Object.freeze({
  en:['Oath orders','Seals remaining','Enemy to interrupt','Ally to protect','Choose a target','Break','Guard','Order used','Select a living target','Nothing to interrupt','No seals remain','Battle is paused'],
  'zh-Hant':['誓印指令','剩餘誓印','要中斷的敵人','要保護的夥伴','選擇目標','破陣','守護','已使用指令','請選擇存活目標','目前沒有可中斷的行動','誓印已用完','戰鬥已暫停'],
  'zh-Hans':['誓印指令','剩余誓印','要中断的敌人','要保护的伙伴','选择目标','破阵','守护','已使用指令','请选择存活目标','目前没有可中断的行动','誓印已用完','战斗已暂停'],
  ja:['誓印の指令','残りの誓印','妨害する敵','守る味方','対象を選択','妨害','守護','指令を使用しました','生存中の対象を選択','妨害できる行動がありません','誓印がありません','戦闘は一時停止中です'],
  ko:['맹세 인장 명령','남은 인장','방해할 적','보호할 아군','대상 선택','방해','보호','명령을 사용했습니다','살아 있는 대상을 선택하세요','방해할 행동이 없습니다','인장이 없습니다','전투가 일시 정지되었습니다'],
  es:['Órdenes del juramento','Sellos restantes','Enemigo a interrumpir','Aliado a proteger','Elige un objetivo','Interrumpir','Proteger','Orden utilizada','Elige un objetivo con vida','No hay ninguna acción que interrumpir','No quedan sellos','La batalla está en pausa'],
  'pt-BR':['Ordens do juramento','Selos restantes','Inimigo a interromper','Aliado a proteger','Escolha um alvo','Interromper','Proteger','Ordem usada','Escolha um alvo vivo','Não há ação para interromper','Não restam selos','A batalha está pausada'],
  fr:['Ordres du serment','Sceaux restants','Ennemi à interrompre','Allié à protéger','Choisir une cible','Interrompre','Protéger','Ordre utilisé','Choisissez une cible vivante','Aucune action à interrompre','Plus de sceaux','Combat en pause'],
  de:['Schwur-Befehle','Verbleibende Siegel','Zu unterbrechender Gegner','Zu schützender Verbündeter','Ziel wählen','Unterbrechen','Schützen','Befehl eingesetzt','Lebendes Ziel wählen','Keine Aktion zum Unterbrechen','Keine Siegel übrig','Kampf pausiert'],
  it:['Ordini del giuramento','Sigilli rimasti','Nemico da interrompere','Alleato da proteggere','Scegli un bersaglio','Interrompi','Proteggi','Ordine usato','Scegli un bersaglio vivo','Nessuna azione da interrompere','Nessun sigillo rimasto','Battaglia in pausa'],
  ru:['Приказы клятвы','Осталось печатей','Враг для прерывания','Союзник для защиты','Выберите цель','Прервать','Защитить','Приказ использован','Выберите живую цель','Нечего прерывать','Печатей не осталось','Бой приостановлен'],
  hi:['शपथ आदेश','शेष मुहरें','रोकने के लिए शत्रु','बचाने के लिए साथी','लक्ष्य चुनें','रोकें','रक्षा करें','आदेश इस्तेमाल हुआ','जीवित लक्ष्य चुनें','रोकने योग्य कार्रवाई नहीं','कोई मुहर शेष नहीं','युद्ध रुका हुआ है'],
  ar:['أوامر القسم','الأختام المتبقية','العدو المراد مقاطعته','الحليف المراد حمايته','اختر هدفًا','مقاطعة','حماية','استُخدم الأمر','اختر هدفًا حيًا','لا يوجد إجراء للمقاطعة','لا أختام متبقية','المعركة متوقفة مؤقتًا']
});
// Continuous cues describe the actual current relationship, not a replay of
// every tick. Names are provided by the caller; no DOM markup is interpolated.
const SIGNAL_COPY = Object.freeze({
 en:['Protecting','Preparing to heal','Preparing a boost for','Preparing to strike'], 'zh-Hant':['保護中','準備治療','準備強化','準備攻擊'], 'zh-Hans':['保护中','准备治疗','准备强化','准备攻击'], ja:['守護中','回復準備','強化準備','攻撃準備'], ko:['보호 중','치유 준비','강화 준비','공격 준비'],
 es:['Protege a','Prepara curación para','Prepara mejora para','Prepara ataque contra'], 'pt-BR':['Protege','Prepara cura para','Prepara reforço para','Prepara ataque contra'], fr:['Protège','Prépare des soins pour','Prépare un renfort pour','Prépare une attaque contre'], de:['Schützt','Bereitet Heilung vor für','Bereitet Verstärkung vor für','Bereitet Angriff vor gegen'], it:['Protegge','Prepara cure per','Prepara un potenziamento per','Prepara un attacco contro'], ru:['Защищает','Готовит лечение для','Готовит усиление для','Готовит удар по'], hi:['रक्षा कर रहा है','उपचार की तैयारी','मजबूत करने की तैयारी','हमले की तैयारी'], ar:['يحمي','يستعد لعلاج','يستعد لتعزيز','يستعد لمهاجمة']
});

// State and language are passed afresh on every sync. The two selects and
// buttons are created once, so ordinary timer updates do not steal focus.
function createOrderDock(document, mount, id, getState, order) {
  if (!/^[a-z][a-z0-9-]*$/.test(id)) throw Error('INVALID_ID');
  const node=(tag,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;return x};
  const root=node('section','oath-orders'),title=node('h3'),remaining=node('p'),status=node('p'),signals=node('p');
  const interruptLabel=node('label'),protectLabel=node('label'),interrupt=node('select'),protect=node('select'),breakButton=node('button'),guardButton=node('button');
  root.setAttribute('aria-labelledby',`${id}-title`);title.id=`${id}-title`;interrupt.id=`${id}-enemy`;protect.id=`${id}-ally`;
  interruptLabel.htmlFor=interrupt.id;protectLabel.htmlFor=protect.id;breakButton.type=guardButton.type='button';
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  signals.setAttribute('role','status');signals.setAttribute('aria-live','polite');
  root.append(title,remaining,interruptLabel,interrupt,breakButton,protectLabel,protect,guardButton,status,signals);mount.append(root);
  let current=null;
  function choices(select,units,placeholder){
    const rows=[['',placeholder],...units.filter(u=>u.hp>0).map(u=>[u.key,u.name])];
    const next=JSON.stringify(rows);if(select.dataset.options===next)return;
    const old=select.value;select.replaceChildren(...rows.map(([value,label])=>{const option=node('option');option.value=value;option.textContent=label;return option}));
    select.dataset.options=next;select.value=rows.some(([value])=>value===old)?old:'';
  }
  function sync(){
    const s=getState(),t=COPY[s.locale]||COPY.en;current={s,t};root.hidden=!s.visible;
    title.textContent=t[0];remaining.textContent=`${t[1]}: ${s.seals}`;interruptLabel.textContent=t[2];protectLabel.textContent=t[3];
    breakButton.textContent=t[5];guardButton.textContent=t[6];choices(interrupt,s.enemies,t[4]);choices(protect,s.heroes,t[4]);
    const names=new Map([...s.enemies,...s.heroes].map(unit=>[unit.key,unit.name])),words=SIGNAL_COPY[s.locale]||SIGNAL_COPY.en;
    const name=key=>names.get(key)||key, lines=[];
    for(const link of s.signals?.wardLinks||[])if(link.active&&link.target)lines.push(`${name(link.key)}: ${words[0]} ${name(link.target)}`);
    const role=new Map(s.enemies.map(unit=>[unit.key,unit.role]));
    for(const channel of s.signals?.channels||[])if(channel.target){const kind=role.get(channel.key),index=kind==='medic'?1:kind==='drummer'?2:3;lines.push(`${name(channel.key)}: ${words[index]} ${name(channel.target)}`)}
    if(s.signals?.bossChannel?.target){const c=s.signals.bossChannel,index=c.kind==='drummer'?2:3;lines.push(`${name(c.key)}: ${words[index]} ${name(c.target)}`)}
    const cue=s.visible?lines.join(' · '):'';if(signals.textContent!==cue)signals.textContent=cue;
    breakButton.disabled=guardButton.disabled=!s.visible||!s.active||s.seals<=0;
    interrupt.disabled=protect.disabled=!s.visible||!s.active||s.seals<=0;
    if(!s.visible)status.textContent='';
  }
  function perform(kind,select){
    const s=getState(),t=COPY[s.locale]||COPY.en;if(!s.visible)return;
    const result=order(kind,select.value);sync();
    status.textContent=result.ok?t[7]:({ 'invalid-target':t[8],'not-ready':t[9],'no-seals':t[10],paused:t[11] }[result.reason]||t[8]);
  }
  breakButton.addEventListener('click',()=>perform('break',interrupt));guardButton.addEventListener('click',()=>perform('guard',protect));
  sync();return Object.freeze({root,sync});
}

window.PEACH_OATH_ORDER_DOCK = Object.freeze({ createOrderDock });
})();
