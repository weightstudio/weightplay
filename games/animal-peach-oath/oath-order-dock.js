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
const PANEL_COPY = Object.freeze({
 en:['Close orders','Battle paused while orders are open'], 'zh-Hant':['關閉指令','指令開啟期間戰鬥暫停'], 'zh-Hans':['关闭指令','指令开启期间战斗暂停'], ja:['指令を閉じる','指令表示中は戦闘を一時停止'], ko:['명령 닫기','명령을 여는 동안 전투 일시 정지'], es:['Cerrar órdenes','La batalla se pausa mientras las órdenes están abiertas'], 'pt-BR':['Fechar ordens','A batalha fica pausada enquanto as ordens estão abertas'], fr:['Fermer les ordres','Le combat est en pause pendant les ordres'], de:['Befehle schließen','Der Kampf pausiert, solange Befehle geöffnet sind'], it:['Chiudi ordini','La battaglia è in pausa mentre gli ordini sono aperti'], ru:['Закрыть приказы','Бой приостановлен, пока открыты приказы'], hi:['आदेश बंद करें','आदेश खुले रहने पर युद्ध रुका रहेगा'], ar:['إغلاق الأوامر','تتوقف المعركة مؤقتًا أثناء فتح الأوامر']
});

// State and language are passed afresh on every sync. The two selects and
// buttons are created once, so ordinary timer updates do not steal focus.
function createOrderDock(document, mount, id, getState, order, onFault=()=>{}, onOpen=()=>{}, onClose=()=>{}, modalMount=mount) {
  if (!/^[a-z][a-z0-9-]*$/.test(id)) throw Error('INVALID_ID');
  const node=(tag,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;return x};
  const root=node('section','oath-orders'),launcher=node('button'),panel=node('section','oath-orders-panel'),title=node('h3'),remaining=node('p'),paused=node('p'),status=node('p'),signals=node('p'),allSignals=node('p'),close=node('button');
  const interruptLabel=node('label'),protectLabel=node('label'),interrupt=node('select'),protect=node('select'),breakButton=node('button'),guardButton=node('button');
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby',`${id}-title`);panel.id=`${id}-panel`;panel.hidden=true;title.id=`${id}-title`;interrupt.id=`${id}-enemy`;protect.id=`${id}-ally`;
  launcher.type=close.type='button';launcher.setAttribute('aria-controls',panel.id);launcher.setAttribute('aria-expanded','false');
  interruptLabel.htmlFor=interrupt.id;protectLabel.htmlFor=protect.id;breakButton.type=guardButton.type='button';
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  signals.setAttribute('role','status');signals.setAttribute('aria-live','polite');
  panel.append(title,paused,remaining,interruptLabel,interrupt,breakButton,protectLabel,protect,guardButton,status,allSignals,close);root.append(launcher,signals);mount.append(root);modalMount.append(panel);
  let current=null;
  function choices(select,units,placeholder){
    const rows=[['',placeholder],...units.filter(u=>u.hp>0).map(u=>[u.key,u.name])];
    const next=JSON.stringify(rows);if(select.dataset.options===next)return;
    const old=select.value;select.replaceChildren(...rows.map(([value,label])=>{const option=node('option');option.value=value;option.textContent=label;return option}));
    select.dataset.options=next;select.value=rows.some(([value])=>value===old)?old:'';
  }
  function sync(){
    const s=getState(),t=COPY[s.locale]||COPY.en;current={s,t};root.hidden=!s.visible;if(!s.visible){panel.hidden=true;launcher.setAttribute('aria-expanded','false');}
    const p=PANEL_COPY[s.locale]||PANEL_COPY.en;title.textContent=t[0];launcher.textContent=`${t[0]} · ${s.seals}`;paused.textContent=p[1];close.textContent=p[0];remaining.textContent=`${t[1]}: ${s.seals}`;interruptLabel.textContent=t[2];protectLabel.textContent=t[3];
    breakButton.textContent=t[5];guardButton.textContent=t[6];choices(interrupt,s.enemies,t[4]);choices(protect,s.heroes,t[4]);
    const names=new Map([...s.enemies,...s.heroes].map(unit=>[unit.key,unit.name])),words=SIGNAL_COPY[s.locale]||SIGNAL_COPY.en;
    const name=key=>names.get(key)||key, lines=[];
    for(const link of s.signals?.wardLinks||[])if(link.active&&link.target)lines.push(`${name(link.key)}: ${words[0]} ${name(link.target)}`);
    const role=new Map(s.enemies.map(unit=>[unit.key,unit.role]));
    for(const channel of s.signals?.channels||[])if(channel.target){const kind=role.get(channel.key),index=kind==='medic'?1:kind==='drummer'?2:3;lines.push(`${name(channel.key)}: ${words[index]} ${name(channel.target)}`)}
    if(s.signals?.bossChannel?.target){const c=s.signals.bossChannel,index=c.kind==='drummer'?2:3;lines.push(`${name(c.key)}: ${words[index]} ${name(c.target)}`)}
    const allCue=s.visible?lines.join(' · '):'',cue=s.visible&&lines.length?`${lines[0]}${lines.length>1?` (+${lines.length-1})`:''}`:'';
    if(signals.textContent!==cue)signals.textContent=cue;if(allSignals.textContent!==allCue)allSignals.textContent=allCue;
    launcher.disabled=!s.visible||!s.active;
    breakButton.disabled=guardButton.disabled=!s.visible||!s.active||s.seals<=0;
    interrupt.disabled=protect.disabled=!s.visible||!s.active||s.seals<=0;
    if(!s.visible)status.textContent='';
  }
  launcher.addEventListener('click',()=>{try{const s=getState();if(!s.visible||!s.active)return;panel.hidden=false;launcher.setAttribute('aria-expanded','true');onOpen();sync();(interrupt.disabled?close:interrupt).focus({preventScroll:true})}catch{onFault()}});
  close.addEventListener('click',()=>{try{if(panel.hidden)return;panel.hidden=true;launcher.setAttribute('aria-expanded','false');onClose();sync();launcher.focus({preventScroll:true})}catch{onFault()}});
  panel.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const items=[interrupt,breakButton,protect,guardButton,close].filter(x=>!x.disabled);if(!items.length)return;const i=items.indexOf(document.activeElement),next=event.shiftKey?(i<=0?items.length-1:i-1):(i<0||i===items.length-1?0:i+1);event.preventDefault();items[next].focus({preventScroll:true});});
  function perform(kind,select){
    try {
      const s=getState(),t=COPY[s.locale]||COPY.en;if(!s.visible)return;
      const result=order(kind,select.value);sync();
      status.textContent=result.ok?t[7]:({ 'invalid-target':t[8],'not-ready':t[9],'no-seals':t[10],paused:t[11] }[result.reason]||t[8]);
    } catch { onFault(); }
  }
  breakButton.addEventListener('click',()=>perform('break',interrupt));guardButton.addEventListener('click',()=>perform('guard',protect));
  sync();return Object.freeze({root,panel,sync});
}

window.PEACH_OATH_ORDER_DOCK = Object.freeze({ createOrderDock });
})();
