(() => {
  const keys = ['aimSkill','planHint','markHint','skillLionDesc','skillOwlDesc','skillTurtleDesc','guardHelp','disrupted','evaded','detonated','guardValue','skillSquadResult'];
  const rows = {
    en: ['Choose target','Red cells: locked attacks. Move away or push the attacker to interrupt.','Rune mark: another hero’s next hit gains +2 damage and 1 Energy.','Choose a foe within 3 cells. Splash 2, push 1 cell and interrupt; blocked push deals 2 more.','Choose a foe within 3 cells. Chain 2 damage to two nearby foes and mark every target.','Heal the squad by 1 and shield each hero’s next hit for 2. Acting keeps the shield.','Block 2 on the next hit and gain 1 Energy.','Interrupted','Dodged','Rune burst +2','Guard −2','{skill}: heal each hero by 1 and block 2 on their next hit.'],
    'zh-Hant': ['選擇目標','紅框是敵人鎖定的攻擊格；移開躲避，擊退敵人可中斷。','符文刻印：另一位英雄命中時引爆，傷害 +2、能量 +1。','指定 3 格內敵人，周圍波及 2 傷害；擊退 1 格並中斷行動，撞牆再加 2。','指定 3 格內敵人，連鎖附近兩名敵人各 2 傷害，並為所有目標刻印。','全隊恢復 1 生命，下一次受擊減傷 2；出手不會取消護盾。','下一次受擊減傷 2，並獲得 1 能量。','行動中斷','閃避成功','符文引爆 +2','防守 −2','{skill}：全隊恢復 1 生命，下一次受擊減傷 2。'],
    'zh-Hans': ['选择目标','红框是敌人锁定的攻击格；移开躲避，击退敌人可中断。','符文刻印：另一位英雄命中时引爆，伤害 +2、能量 +1。','指定 3 格内敌人，周围波及 2 伤害；击退 1 格并中断行动，撞墙再加 2。','指定 3 格内敌人，连锁附近两名敌人各 2 伤害，并为所有目标刻印。','全队恢复 1 生命，下一次受击减伤 2；出手不会取消护盾。','下一次受击减伤 2，并获得 1 能量。','行动中断','闪避成功','符文引爆 +2','防守 −2','{skill}：全队恢复 1 生命，下一次受击减伤 2。'],
    ja: ['標的を選択','赤いマスは攻撃予告。移動で回避、敵の押し出しで中断。','刻印：別の仲間の次の命中でダメージ+2、エネルギー+1。','3マス以内を選択。周囲に2ダメージ、1マス押して中断。押せないと追加2。','3マス以内を選択。近くの敵2体に2ダメージを連鎖し、全標的に刻印。','全員を1回復し、次の被弾を2軽減。行動しても盾は残る。','次の被弾を2軽減し、エネルギー+1。','中断','回避','刻印爆発 +2','防御 −2','{skill}：全員を1回復し、次の被弾を2軽減。'],
    ko: ['대상 선택','빨간 칸은 확정 공격 위치입니다. 이동해 피하거나 적을 밀어 중단하세요.','룬 표식: 다른 영웅의 다음 적중에 피해 +2, 에너지 +1.','3칸 내 적 선택. 주변 피해 2, 1칸 밀기와 행동 중단. 밀 수 없으면 추가 피해 2.','3칸 내 적 선택. 가까운 적 둘에게 피해 2를 연쇄하고 모두 표식 부여.','전원 체력 1 회복, 다음 피격 피해 2 감소. 행동해도 방패 유지.','다음 피격 피해 2 감소, 에너지 1 획득.','중단','회피','룬 폭발 +2','방어 −2','{skill}: 전원 체력 1 회복, 다음 피격 피해 2 감소.'],
    es: ['Elegir objetivo','Rojo: ataque fijado. Muévete para esquivarlo o empuja al atacante.','Marca: el próximo golpe de otro héroe añade 2 de daño y 1 de energía.','Elige a 3 casillas. Daño de área 2, empuja 1 e interrumpe. Si no puede empujar, daño +2.','Elige a 3 casillas. Encadena 2 de daño a dos enemigos cercanos y marca a todos.','Cura 1 a todos y reduce su próximo golpe recibido en 2. Actuar conserva el escudo.','Reduce el próximo golpe en 2 y gana 1 de energía.','Interrumpido','Esquivado','Explosión rúnica +2','Defensa −2','{skill}: cura 1 a todos y reduce el próximo golpe en 2.'],
    'pt-BR': ['Escolher alvo','Vermelho: ataque fixo. Saia da casa ou empurre o atacante.','Marca: o próximo acerto de outro herói dá +2 de dano e +1 de energia.','Escolha em 3 casas. Dano em área 2, empurra 1 e interrompe. Sem espaço: dano +2.','Escolha em 3 casas. Encadeia 2 de dano a dois inimigos próximos e marca todos.','Cura 1 em todos e reduz o próximo golpe em 2. Agir mantém o escudo.','Reduz o próximo golpe em 2 e ganha 1 de energia.','Interrompido','Esquivado','Explosão rúnica +2','Defesa −2','{skill}: cura 1 em todos e reduz o próximo golpe em 2.'],
    fr: ['Choisir la cible','Cases rouges : attaques fixées. Esquivez ou repoussez l’attaquant.','Marque : le prochain coup d’un autre héros gagne 2 dégâts et 1 énergie.','Choisissez à 3 cases. Zone : 2 dégâts, repousse de 1 et interrompt. Obstacle : +2 dégâts.','Choisissez à 3 cases. Chaîne de 2 dégâts sur deux ennemis proches et marque toutes les cibles.','Soigne chaque héros de 1 et réduit le prochain coup de 2. Agir conserve le bouclier.','Réduit le prochain coup de 2 et donne 1 énergie.','Interrompu','Esquivé','Explosion runique +2','Garde −2','{skill} : soigne chacun de 1 et réduit son prochain coup de 2.'],
    de: ['Ziel wählen','Rote Felder: feste Angriffe. Weiche aus oder stoße den Angreifer zurück.','Runenmal: Der nächste Treffer eines anderen Helden gibt +2 Schaden und +1 Energie.','Ziel in 3 Feldern wählen. Flächenschaden 2, 1 Feld Rückstoß und Unterbrechung. Blockiert: +2 Schaden.','Ziel in 3 Feldern wählen. Je 2 Kettenschaden an zwei nahen Gegnern; alle Ziele markieren.','Heilt alle um 1 und mindert den nächsten Treffer um 2. Aktionen erhalten den Schild.','Mindert den nächsten Treffer um 2 und gibt 1 Energie.','Unterbrochen','Ausgewichen','Runenausbruch +2','Schutz −2','{skill}: heilt alle um 1 und mindert ihren nächsten Treffer um 2.'],
    it: ['Scegli bersaglio','Rosso: attacchi fissati. Spostati o respingi chi attacca.','Marchio: il prossimo colpo di un altro eroe ottiene +2 danni e +1 energia.','Scegli entro 3 caselle. Area: 2 danni, spinta di 1 e interruzione. Ostacolo: +2 danni.','Scegli entro 3 caselle. Catena di 2 danni a due nemici vicini e marchio su tutti.','Cura tutti di 1 e riduce il prossimo colpo di 2. Agire mantiene lo scudo.','Riduce il prossimo colpo di 2 e dà 1 energia.','Interrotto','Schivato','Esplosione runica +2','Difesa −2','{skill}: cura tutti di 1 e riduce il prossimo colpo di 2.'],
    ru: ['Выбрать цель','Красные клетки: намеченные удары. Уйдите с клетки или оттолкните врага.','Метка: следующее попадание другого героя даёт +2 урона и +1 энергии.','Цель в 3 клетках. Урон рядом: 2, толчок на 1 и срыв хода. Преграда: ещё 2 урона.','Цель в 3 клетках. Цепь наносит 2 урона двум близким врагам и ставит всем метки.','Лечит всех на 1 и снижает следующий удар на 2. Действие не снимает щит.','Снижает следующий удар на 2 и даёт 1 энергию.','Прервано','Уклонение','Взрыв руны +2','Защита −2','{skill}: лечит всех на 1 и снижает следующий удар на 2.'],
    hi: ['लक्ष्य चुनें','लाल खाने तय हमले हैं। हटकर बचें या हमलावर को धकेलें।','रून चिह्न: दूसरे नायक की अगली चोट पर +2 क्षति और +1 ऊर्जा।','3 खानों में लक्ष्य चुनें। आसपास 2 क्षति, 1 खाना धक्का और चाल रद्द। जगह न हो तो 2 और क्षति।','3 खानों में लक्ष्य चुनें। दो पास के शत्रुओं पर 2 क्षति की कड़ी और सभी पर चिह्न।','सबका 1 स्वास्थ्य लौटाए और अगली चोट 2 घटाए। कार्रवाई से ढाल नहीं हटती।','अगली चोट 2 घटाए और 1 ऊर्जा दे।','चाल रद्द','बच गए','रून विस्फोट +2','रक्षा −2','{skill}: सबका 1 स्वास्थ्य लौटाए और अगली चोट 2 घटाए।'],
    ar: ['اختر هدفًا','الخانات الحمراء لهجمات محددة. ابتعد عنها أو ادفع المهاجم لإيقافه.','علامة الرون: إصابة بطل آخر التالية تضيف ضررين وطاقة واحدة.','اختر عدوًا ضمن 3 خانات. ضرران حوله ودفع خانة وإيقاف فعله. عند انسداد الدفع: ضرران إضافيان.','اختر ضمن 3 خانات. سلسلة بضررين لعدوين قريبين وعلامة على جميع الأهداف.','يعالج الجميع بمقدار 1 ويخفض الضربة التالية بمقدار 2. الفعل لا يزيل الدرع.','يخفض الضربة التالية بمقدار 2 ويمنح طاقة واحدة.','تم الإيقاف','تم التفادي','انفجار الرون +2','دفاع −2','{skill}: يعالج كل بطل بمقدار 1 ويخفض ضربته التالية بمقدار 2.']
  };
  window.WeightPlayRuneTacticsCombatCopy = Object.fromEntries(Object.entries(rows).map(([locale, row]) => [locale, Object.fromEntries(keys.map((key, i) => [key, row[i]]))]));
})();

(() => {
  const keys=['counterHelp','counterPreview','counterHit','waveNotice','waveArrived','deploymentHelp','firstClearHelp'];
  const rows={
    en:['A surviving foe counters once per round within its range. Lion interrupts; shields absorb counters.','Counter damage: {n}.','{hero} takes a counterattack.','Reserves: {n}, round {turn} or when the field is cleared.','{n} reinforcements arrived.','Chapter deployment caps: level {level}, bonus attack {atk}, HP {hp}, Energy {energy}. Stored upgrades remain.','Permanent rune choices are awarded only on the first victory in each mission.'],
    'zh-Hant':['存活敵人在射程內每回合反擊一次；獅子打斷、護盾可擋反擊。','預計反擊傷害：{n}。','{hero} 遭到反擊。','增援 {n} 名：第 {turn} 回合或清場後到達。','{n} 名增援已到達。','本章出戰上限：等級 {level}、額外攻擊 {atk}、生命 {hp}、能量 {energy}；升級存檔保留。','每關首次勝利才能選擇永久符文；重玩不會重複疊加。'],
    'zh-Hans':['存活敌人在射程内每回合反击一次；狮子打断、护盾可挡反击。','预计反击伤害：{n}。','{hero} 遭到反击。','增援 {n} 名：第 {turn} 回合或清场后到达。','{n} 名增援已到达。','本章出战上限：等级 {level}、额外攻击 {atk}、生命 {hp}、能量 {energy}；升级存档保留。','每关首次胜利才能选择永久符文；重玩不会重复叠加。'],
    ja:['生き残った敵は射程内で毎ターン1回反撃。ライオンの中断や盾で防ごう。','反撃ダメージ：{n}。','{hero} が反撃を受けた。','増援 {n} 体：{turn} ターン目、または敵一掃後。','増援 {n} 体が到着。','章の出撃上限：レベル {level}、追加攻撃 {atk}、HP {hp}、エネルギー {energy}。保存済み強化は維持。','永久ルーンを選べるのは各任務の初勝利時だけです。'],
    ko:['생존한 적은 사거리 안에서 턴당 한 번 반격합니다. 사자의 방해나 방패로 막으세요.','반격 피해: {n}.','{hero}이(가) 반격을 받았습니다.','지원군 {n}명: {turn}턴 또는 적 전멸 후 도착.','지원군 {n}명 도착.','장별 출전 한도: 레벨 {level}, 추가 공격 {atk}, 체력 {hp}, 에너지 {energy}. 저장된 강화는 유지됩니다.','영구 룬 선택은 각 임무의 첫 승리에서만 받습니다.'],
    es:['Un enemigo superviviente contraataca una vez por ronda dentro de su alcance. Interrúmpelo con León o usa escudos.','Daño de contraataque: {n}.','{hero} recibe un contraataque.','Refuerzos: {n}, en la ronda {turn} o al despejar el campo.','Llegan {n} refuerzos.','Límites del capítulo: nivel {level}, ataque extra {atk}, PV {hp}, Energía {energy}. Se conservan las mejoras guardadas.','Las runas permanentes se eligen solo en la primera victoria de cada misión.'],
    'pt-BR':['O inimigo sobrevivente contra-ataca uma vez por rodada dentro do alcance. Interrompa com Leão ou use escudos.','Dano do contra-ataque: {n}.','{hero} recebe um contra-ataque.','Reforços: {n}, na rodada {turn} ou ao limpar o campo.','Chegaram {n} reforços.','Limites do capítulo: nível {level}, ataque extra {atk}, PV {hp}, Energia {energy}. Melhorias salvas são mantidas.','Runas permanentes são escolhidas apenas na primeira vitória de cada missão.'],
    fr:['Un ennemi survivant riposte une fois par tour à portée. Le Lion interrompt et les boucliers absorbent la riposte.','Dégâts de riposte : {n}.','{hero} subit une riposte.','Renforts : {n}, au tour {turn} ou après avoir vidé le terrain.','{n} renforts arrivent.','Plafonds du chapitre : niveau {level}, attaque bonus {atk}, PV {hp}, énergie {energy}. Les améliorations sauvegardées restent.','Les runes permanentes ne sont proposées que lors de la première victoire de chaque mission.'],
    de:['Überlebende Gegner kontern einmal pro Runde in Reichweite. Löwe unterbricht; Schilde fangen Konter ab.','Konterschaden: {n}.','{hero} wird gekontert.','Verstärkung: {n}, in Runde {turn} oder nach Räumung des Feldes.','{n} Verstärkungen treffen ein.','Kapitelgrenzen: Stufe {level}, Bonusangriff {atk}, LP {hp}, Energie {energy}. Gespeicherte Verbesserungen bleiben.','Dauerhafte Runen gibt es nur beim ersten Sieg jeder Mission.'],
    it:['Un nemico superstite contrattacca una volta per turno entro gittata. Il Leone interrompe; gli scudi assorbono il colpo.','Danno del contrattacco: {n}.','{hero} subisce un contrattacco.','Rinforzi: {n}, al turno {turn} o quando il campo è libero.','Arrivano {n} rinforzi.','Limiti del capitolo: livello {level}, attacco extra {atk}, PV {hp}, Energia {energy}. I potenziamenti salvati restano.','Le rune permanenti si scelgono solo alla prima vittoria di ogni missione.'],
    ru:['Выживший враг контратакует раз за раунд в пределах дальности. Лев прерывает, щиты поглощают ответ.','Урон контратаки: {n}.','{hero} получает контратаку.','Подкрепление: {n}, раунд {turn} или после зачистки поля.','Прибыло подкрепление: {n}.','Пределы главы: уровень {level}, бонус атаки {atk}, ОЗ {hp}, энергия {energy}. Сохранённые улучшения остаются.','Постоянные руны выдаются только за первую победу в каждой миссии.'],
    hi:['बचा हुआ शत्रु अपनी सीमा में हर दौर एक पलटवार करता है। सिंह रोकता है और ढाल नुकसान सोखती है।','पलटवार की क्षति: {n}।','{hero} पर पलटवार हुआ।','सहायता: {n}, दौर {turn} पर या मैदान साफ होने पर।','{n} नए शत्रु आ गए।','अध्याय की सीमा: स्तर {level}, अतिरिक्त हमला {atk}, स्वास्थ्य {hp}, ऊर्जा {energy}। सहेजे उन्नयन बने रहेंगे।','स्थायी रून हर मिशन की पहली जीत पर ही चुने जाते हैं।'],
    ar:['يرد العدو الناجي مرة في الجولة ضمن مداه. يوقفه الأسد وتمتص الدروع الرد.','ضرر الرد: {n}.','يتلقى {hero} هجومًا مضادًا.','تعزيزات: {n} في الجولة {turn} أو بعد إخلاء الميدان.','وصلت تعزيزات: {n}.','حدود الفصل: مستوى {level}، هجوم إضافي {atk}، صحة {hp}، طاقة {energy}. تبقى الترقيات المحفوظة.','تُختار الرون الدائمة عند أول انتصار فقط في كل مهمة.']
  };
  for(const [locale,row] of Object.entries(rows))Object.assign(window.WeightPlayRuneTacticsCombatCopy[locale],Object.fromEntries(keys.map((key,i)=>[key,row[i]])));
  const tracking={
    en:'◎ Ranged aim tracks the hero. Leave the shooter’s range, interrupt it, or absorb the hit with a shield.',
    'zh-Hant':'◎ 遠程瞄準會追蹤英雄；必須離開射程、打斷射手，或用護盾承受。',
    'zh-Hans':'◎ 远程瞄准会追踪英雄；必须离开射程、打断射手，或用护盾承受。',
    ja:'◎ 遠距離照準は英雄を追跡。射程外へ逃げるか、敵を中断するか、盾で受けよう。',
    ko:'◎ 원거리 조준은 영웅을 추적합니다. 사거리 밖으로 이동하거나 적을 방해하거나 방패로 막으세요.',
    es:'◎ La mira sigue al héroe. Sal del alcance, interrumpe al tirador o absorbe el impacto con un escudo.',
    'pt-BR':'◎ A mira acompanha o herói. Saia do alcance, interrompa o atirador ou absorva o golpe com um escudo.',
    fr:'◎ La visée suit le héros. Sortez de portée, interrompez le tireur ou absorbez le tir avec un bouclier.',
    de:'◎ Fernkampfvisiere verfolgen den Helden. Verlasse die Reichweite, unterbrich den Schützen oder nutze einen Schild.',
    it:'◎ La mira segue l’eroe. Esci dalla gittata, interrompi il tiratore o assorbi il colpo con uno scudo.',
    ru:'◎ Дальний прицел следует за героем. Выйдите из радиуса, прервите стрелка или примите удар щитом.',
    hi:'◎ दूर का निशाना नायक का पीछा करता है। सीमा से बाहर जाएँ, शत्रु को रोकें या ढाल से वार सहें।',
    ar:'◎ يتتبع التصويب البطل. اخرج من المدى أو أوقف الرامي أو امتص الإصابة بدرع.'
  };
  for(const [locale,trackingHelp] of Object.entries(tracking))window.WeightPlayRuneTacticsCombatCopy[locale].trackingHelp=trackingHelp;
})();

// v29: source-owned map-weapon copy.
(() => {
 const keys=["mapIntro","mapRecharge","mapAim","mapFire","mapCharge","waveHud","sweepStats","mapResult","skillLion","skillLionDesc","skillOwl","skillOwlDesc","skillTurtle","skillTurtleDesc"];
 const rows={
  "zh-Hant": [
    "移動 → 地圖炮預覽 → 調整範圍 → 發射，一次掃蕩整群敵人！",
    "地圖炮耗 3 能量；擊殺回充 1（每次最多 1），普攻／防守／每回合各回充 1。",
    "預計命中 {n} 名。點棋盤調整範圍，再按發射；換英雄或 Esc 取消。",
    "發射 · {n} 名",
    "地圖炮 ⚡{n}",
    "波次 {wave}/{total} · {n} 敵",
    "擊破 {kills} · 最多一次掃蕩 {best} 名",
    "{skill}！命中 {n} 名、擊破 {kills} 名，回充 +{charge}。",
    "獅王貫穿炮",
    "朝指定方向轟出 3 格寬的貫穿炮，打斷存活敵人；不傷隊友。",
    "星雨轟炸",
    "指定任意格，轟炸周圍 3×3 區域；為存活敵人刻印，不傷隊友。",
    "大地震波",
    "震擊自身 2 格內所有敵人；全隊恢復 2 生命並獲得減傷 2 護盾。"
  ],
  "zh-Hans": [
    "移动 → 地图炮预览 → 调整范围 → 发射，一次扫荡整群敌人！",
    "地图炮耗 3 能量；击杀回充 1（每次最多 1），普攻／防守／每回合各回充 1。",
    "预计命中 {n} 名。点棋盘调整范围，再按发射；换英雄或 Esc 取消。",
    "发射 · {n} 名",
    "地图炮 ⚡{n}",
    "波次 {wave}/{total} · {n} 敌",
    "击破 {kills} · 最多一次扫荡 {best} 名",
    "{skill}！命中 {n} 名、击破 {kills} 名，回充 +{charge}。",
    "狮王贯穿炮",
    "朝指定方向轰出 3 格宽的贯穿炮，打断存活敌人；不伤队友。",
    "星雨轰炸",
    "指定任意格，轰炸周围 3×3 区域；为存活敌人刻印，不伤队友。",
    "大地震波",
    "震击自身 2 格内所有敌人；全队恢复 2 生命并获得减伤 2 护盾。"
  ],
  "en": [
    "Move, preview a MAP attack, aim and fire. Sweep whole groups!",
    "MAP costs 3 Energy. Each kill refunds 1 (max 1 per action); attack, Guard and each round restore 1.",
    "{n} targets. Tap the board to aim, then Fire. Change hero or Esc to cancel.",
    "Fire · {n}",
    "MAP ⚡{n}",
    "Wave {wave}/{total} · {n} foes",
    "Defeated {kills} · Best sweep {best}",
    "{skill}: hit {n}, defeated {kills}, Energy +{charge}.",
    "Lion Lance",
    "Fire a three-cell-wide corridor in the chosen direction. Interrupt survivors; no friendly fire.",
    "Starfall",
    "Bombard a 3×3 area around any cell. Mark survivors; no friendly fire.",
    "Earthpulse",
    "Hit every foe within 2 cells of Turtle. Heal all allies by 2 and shield their next hit for 2."
  ],
  "ja": [
    "移動→MAP攻撃の範囲確認→照準→発射。敵の群れを一掃！",
    "MAPはエネルギー3。撃破で1回復（1行動で最大1）、通常攻撃・防御・各ターンで1回復。",
    "対象{n}体。盤面で照準を変更し発射。仲間選択かEscで取消。",
    "発射 · {n}体",
    "MAP ⚡{n}",
    "第{wave}/{total}波 · 敵{n}体",
    "撃破{kills} · 最大同時撃破{best}",
    "{skill}！命中{n}、撃破{kills}、回復+{charge}。",
    "獅子貫通砲",
    "指定方向に幅3マスの砲撃。生存した敵の行動を中断。味方には無効。",
    "星雨爆撃",
    "任意のマスの周囲3×3を爆撃。生存した敵に刻印。味方には無効。",
    "大地の波動",
    "亀から2マス以内の敵を攻撃。味方全員を2回復し、次の被弾を2軽減。"
  ],
  "ko": [
    "이동→MAP 범위 확인→조준→발사! 적 무리를 쓸어버리세요.",
    "MAP은 에너지 3 소모. 처치당 1 회복(행동당 최대 1), 일반 공격·방어·매 턴 1 회복.",
    "대상 {n}명. 보드로 조준 후 발사. 영웅 변경이나 Esc로 취소.",
    "발사 · {n}명",
    "MAP ⚡{n}",
    "공세 {wave}/{total} · 적 {n}",
    "처치 {kills} · 최대 동시 처치 {best}",
    "{skill}: 명중 {n}, 처치 {kills}, 회복 +{charge}.",
    "사자 관통포",
    "선택 방향으로 폭 3칸 포격. 생존한 적의 행동을 방해하며 아군은 안전합니다.",
    "별비 폭격",
    "아무 칸을 골라 주변 3×3을 폭격. 생존 적에게 표식을 남기며 아군은 안전합니다.",
    "대지 충격파",
    "거북이의 2칸 내 모든 적 공격. 아군 전원 체력 2 회복, 다음 피해 2 감소."
  ],
  "es": [
    "Muévete, apunta el ataque MAP y dispara. ¡Barre grupos enteros!",
    "MAP cuesta 3 de Energía. Cada baja devuelve 1 (máx. 1 por acción); atacar, defender y cada ronda dan 1.",
    "{n} objetivos. Toca el tablero y dispara. Cambia de héroe o Esc para cancelar.",
    "Disparar · {n}",
    "MAP ⚡{n}",
    "Oleada {wave}/{total} · {n} enemigos",
    "Bajas {kills} · Mejor barrido {best}",
    "{skill}: {n} impactos, {kills} bajas, Energía +{charge}.",
    "Lanza del León",
    "Dispara una franja de 3 casillas de ancho en la dirección elegida. Interrumpe a los supervivientes; no daña aliados.",
    "Lluvia estelar",
    "Bombardea un área de 3×3 alrededor de cualquier casilla. Marca supervivientes; no daña aliados.",
    "Pulso terrestre",
    "Golpea a todos los enemigos a 2 casillas de Tortuga. Cura 2 a cada aliado y bloquea 2 del siguiente golpe."
  ],
  "pt-BR": [
    "Mova, mire o ataque MAP e dispare. Varra grupos inteiros!",
    "MAP custa 3 de Energia. Cada baixa devolve 1 (máx. 1 por ação); atacar, defender e cada rodada dão 1.",
    "{n} alvos. Toque no tabuleiro e dispare. Troque de herói ou Esc para cancelar.",
    "Disparar · {n}",
    "MAP ⚡{n}",
    "Onda {wave}/{total} · {n} inimigos",
    "Baixas {kills} · Melhor varredura {best}",
    "{skill}: {n} atingidos, {kills} baixas, Energia +{charge}.",
    "Lança do Leão",
    "Dispara uma faixa de 3 casas na direção escolhida. Interrompe sobreviventes; não atinge aliados.",
    "Chuva estelar",
    "Bombardeia 3×3 casas ao redor de qualquer casa. Marca sobreviventes; não atinge aliados.",
    "Pulso terrestre",
    "Atinge todo inimigo a 2 casas da Tartaruga. Cura 2 de cada aliado e bloqueia 2 do próximo golpe."
  ],
  "fr": [
    "Déplacez-vous, visez avec MAP et tirez. Balayez des groupes entiers !",
    "MAP coûte 3 Énergie. Chaque élimination rend 1 (max. 1 par action) ; attaque, garde et chaque tour rendent 1.",
    "{n} cibles. Touchez le plateau puis tirez. Changez de héros ou Échap pour annuler.",
    "Tirer · {n}",
    "MAP ⚡{n}",
    "Vague {wave}/{total} · {n} ennemis",
    "Éliminés {kills} · Meilleur tir {best}",
    "{skill} : {n} touchés, {kills} éliminés, Énergie +{charge}.",
    "Lance du Lion",
    "Tire un couloir large de 3 cases dans la direction choisie. Interrompt les survivants ; alliés épargnés.",
    "Pluie stellaire",
    "Bombarde une zone de 3×3 autour de toute case. Marque les survivants ; alliés épargnés.",
    "Onde terrestre",
    "Frappe tous les ennemis à 2 cases de Tortue. Soigne chaque allié de 2 et bloque 2 du prochain coup."
  ],
  "de": [
    "Bewegen, MAP-Zielbereich prüfen und feuern. Ganze Gruppen besiegen!",
    "MAP kostet 3 Energie. Pro Abschuss +1 (max. 1 je Aktion); Angriff, Abwehr und jede Runde geben +1.",
    "{n} Ziele. Auf dem Brett zielen, dann feuern. Held wechseln oder Esc zum Abbrechen.",
    "Feuern · {n}",
    "MAP ⚡{n}",
    "Welle {wave}/{total} · {n} Gegner",
    "Besiegt {kills} · Bester Schlag {best}",
    "{skill}: {n} Treffer, {kills} besiegt, Energie +{charge}.",
    "Löwenlanze",
    "Feuert einen 3 Felder breiten Streifen in die gewählte Richtung. Unterbricht Überlebende; keine Verbündetentreffer.",
    "Sternenregen",
    "Bombardiert 3×3 Felder um ein beliebiges Feld. Markiert Überlebende; keine Verbündetentreffer.",
    "Erdenwelle",
    "Trifft alle Gegner im Abstand 2 von Schildkröte. Heilt alle Verbündeten um 2 und blockt 2 des nächsten Treffers."
  ],
  "it": [
    "Muovi, mira con MAP e spara. Spazza via interi gruppi!",
    "MAP costa 3 Energia. Ogni sconfitta restituisce 1 (max 1 per azione); attacco, guardia e ogni turno danno 1.",
    "{n} bersagli. Tocca il tabellone e spara. Cambia eroe o premi Esc per annullare.",
    "Fuoco · {n}",
    "MAP ⚡{n}",
    "Ondata {wave}/{total} · {n} nemici",
    "Sconfitti {kills} · Miglior colpo {best}",
    "{skill}: {n} colpiti, {kills} sconfitti, Energia +{charge}.",
    "Lancia del Leone",
    "Spara una fascia larga 3 caselle nella direzione scelta. Interrompe i superstiti; nessun danno agli alleati.",
    "Pioggia stellare",
    "Bombarda 3×3 caselle attorno a qualsiasi casella. Marca i superstiti; nessun danno agli alleati.",
    "Onda terrestre",
    "Colpisce tutti i nemici entro 2 caselle da Tartaruga. Cura 2 a ogni alleato e blocca 2 del prossimo colpo."
  ],
  "ru": [
    "Переместитесь, наведите MAP-атаку и стреляйте. Сметайте целые группы!",
    "MAP стоит 3 энергии. За убийство +1 (макс. 1 за действие); атака, защита и каждый раунд дают 1.",
    "Целей: {n}. Выберите область и стреляйте. Другой герой или Esc отменяет прицел.",
    "Огонь · {n}",
    "MAP ⚡{n}",
    "Волна {wave}/{total} · врагов {n}",
    "Побеждено {kills} · Лучший залп {best}",
    "{skill}: попаданий {n}, побеждено {kills}, энергия +{charge}.",
    "Копьё Льва",
    "Залп полосой шириной 3 клетки в выбранную сторону. Прерывает выживших; союзники не страдают.",
    "Звездопад",
    "Обстрел области 3×3 вокруг любой клетки. Помечает выживших; союзники не страдают.",
    "Волна земли",
    "Бьёт всех врагов в 2 клетках от Черепахи. Лечит союзников на 2 и снижает следующий урон на 2."
  ],
  "hi": [
    "चलें, MAP का क्षेत्र देखें, निशाना लगाएँ और चलाएँ। पूरे झुंड हराएँ!",
    "MAP में 3 ऊर्जा लगती है। हर हार पर 1 वापस (प्रति चाल अधिकतम 1); हमला, बचाव और हर दौर पर 1 वापस।",
    "{n} लक्ष्य। बोर्ड पर निशाना चुनें, फिर चलाएँ। नायक बदलें या Esc से रद्द करें।",
    "चलाएँ · {n}",
    "MAP ⚡{n}",
    "लहर {wave}/{total} · {n} शत्रु",
    "पराजित {kills} · सबसे बड़ा प्रहार {best}",
    "{skill}: {n} को लगा, {kills} पराजित, ऊर्जा +{charge}।",
    "सिंह भेदन",
    "चुनी दिशा में 3 खाने चौड़ी पट्टी पर वार। बचे शत्रुओं को रोकता है; साथियों को चोट नहीं।",
    "तारों की वर्षा",
    "किसी भी खाने के आसपास 3×3 क्षेत्र पर वार। बचे शत्रुओं पर निशान; साथी सुरक्षित।",
    "धरती की लहर",
    "कछुए से 2 खाने तक के सभी शत्रुओं पर वार। हर साथी को 2 स्वास्थ्य और अगले वार में 2 की सुरक्षा।"
  ],
  "ar": [
    "تحرك وحدد نطاق MAP ثم أطلق. اقضِ على مجموعات كاملة!",
    "يكلف MAP ثلاث طاقات. كل هزيمة تعيد 1 (بحد أقصى 1 للفعل)، والهجوم والحراسة وكل جولة تعيد 1.",
    "الأهداف: {n}. اضغط اللوحة للتصويب ثم أطلق. غيّر البطل أو Esc للإلغاء.",
    "إطلاق · {n}",
    "MAP ⚡{n}",
    "الموجة {wave}/{total} · أعداء {n}",
    "المهزومون {kills} · أفضل ضربة {best}",
    "{skill}: أصاب {n}، هزم {kills}، طاقة +{charge}.",
    "رمح الأسد",
    "يقصف ممراً بعرض 3 خانات في الاتجاه المختار. يوقف الناجين ولا يصيب الحلفاء.",
    "مطر النجوم",
    "يقصف مساحة 3×3 حول أي خانة. يضع علامة على الناجين ولا يصيب الحلفاء.",
    "موجة الأرض",
    "يضرب كل عدو ضمن خانتين من السلحفاة. يشفي الحلفاء بمقدار 2 ويحجب 2 من الضربة التالية."
  ]
};
 for(const [locale,row] of Object.entries(rows))Object.assign(window.WeightPlayRuneTacticsCombatCopy[locale],Object.fromEntries(keys.map((key,i)=>[key,row[i]])));
})();
