(() => {
  // v33 terrain inspection: effects match the actual round/entry rules.
  const commandKeys=['relayHelp','relayCutHelp','relayClaimed','supplyCut','objectiveCut','objectiveSweep','resonanceHelp','resonanceReady','resonanceMeter','commandForecast','commandRules','worldFallback'];
  const commandRows={
    en:['Enter a gold relay once to refill that hero’s Energy.','Seize both gold relays to stop future waves; defeat the remaining enemies. Each relay refills Energy once. Cutting supply calls in the final guard wave.','Relay secured · Energy full','Supply cut · final guards','Cut supply · {n}/2 relays','Sweep all waves · {n}/2 relays','Different heroes acting in succession charge Resonance. At 3, the next MAP gains +2 damage and spends the charge.','Resonance ready · MAP +2','Resonance {n}/3','{hits} targets · {kills} predicted defeats','Tactical details','Standard board · 3D unavailable'],
    'zh-Hant':['踏上金色節點，即可一次補滿該英雄的能量。','占領兩個金色節點可切斷後續援軍，再清除場上敵人。每個節點可補滿一次能量。切斷時會引出最後一波守軍。','節點占領 · 能量補滿','補給切斷 · 最後守軍','切斷援軍 · 節點 {n}/2','掃蕩全波次 · 節點 {n}/2','不同英雄接力出手可累積共鳴；滿 3 格後，下一發地圖炮傷害 +2 並消耗共鳴。','共鳴就緒 · 地圖炮 +2','小隊共鳴 {n}/3','命中 {hits} 體 · 預計擊破 {kills} 體','戰術詳情','標準棋盤 · 3D 暫不可用'],
    'zh-Hans':['踏上金色节点，即可一次补满该英雄的能量。','占领两个金色节点可切断后续援军，再清除场上敌人。每个节点可补满一次能量。切断时会引出最后一波守军。','节点占领 · 能量补满','补给切断 · 最后守军','切断援军 · 节点 {n}/2','扫荡全波次 · 节点 {n}/2','不同英雄接力出手可累积共鸣；满 3 格后，下一发地图炮伤害 +2 并消耗共鸣。','共鸣就绪 · 地图炮 +2','小队共鸣 {n}/3','命中 {hits} 体 · 预计击破 {kills} 体','战术详情','标准棋盘 · 3D 暂不可用'],
    ja:['金色の中継点に入ると、その仲間のエネルギーを一度だけ全回復。','金色の中継点を2つ確保すると増援停止。残る敵を倒そう。各地点でエネルギーを一度だけ全回復。遮断すると最後の守備隊が出現。','中継点確保 · エネルギー全回復','補給遮断 · 最後の守備隊','増援を止める · {n}/2','全波を撃破 · 中継点 {n}/2','異なる仲間が続けて行動すると共鳴が増加。3で次のMAPがダメージ+2になり、共鳴を消費。','共鳴完了 · MAP +2','部隊共鳴 {n}/3','命中 {hits} · 撃破予測 {kills}','戦術の詳細','標準盤面 · 3D利用不可'],
    ko:['황금 거점에 들어가면 해당 영웅의 에너지가 한 번 완충됩니다.','황금 거점 두 곳을 확보해 증원을 막고 남은 적을 처치하세요. 각 거점은 에너지를 한 번 완충합니다.차단하면 마지막 수비대가 등장합니다.','거점 확보 · 에너지 완충','보급 차단 · 마지막 수비대','증원 차단 · 거점 {n}/2','모든 웨이브 격파 · {n}/2','서로 다른 영웅이 연속 행동하면 공명이 쌓입니다. 3이면 다음 MAP 피해 +2 후 공명을 소모합니다.','공명 준비 · MAP +2','분대 공명 {n}/3','명중 {hits} · 예상 처치 {kills}','전술 상세','기본 보드 · 3D 사용 불가'],
    es:['Entra en un nodo dorado para recargar una vez la energía del héroe.','Captura ambos nodos para detener los refuerzos y vence a los enemigos restantes. Cada nodo recarga energía una vez. Al cortar, llega una última oleada de guardias.','Nodo capturado · energía llena','Suministro cortado · guardia final','Corta refuerzos · nodos {n}/2','Vence todas las oleadas · {n}/2','Alternar héroes al actuar carga Resonancia. Con 3, el siguiente MAP gana +2 de daño y consume la carga.','Resonancia lista · MAP +2','Resonancia {n}/3','{hits} objetivos · {kills} bajas previstas','Detalles tácticos','Tablero estándar · 3D no disponible'],
    'pt-BR':['Entre num núcleo dourado para recarregar a energia do herói uma vez.','Capture os dois núcleos para cortar reforços e derrote os inimigos restantes. Cada núcleo recarrega energia uma vez. O corte traz uma última onda de guardas.','Núcleo capturado · energia cheia','Suprimento cortado · guarda final','Corte reforços · núcleos {n}/2','Vença todas as ondas · {n}/2','Alternar heróis nas ações carrega Ressonância. Com 3, o próximo MAP ganha +2 de dano e consome a carga.','Ressonância pronta · MAP +2','Ressonância {n}/3','{hits} alvos · {kills} derrotas previstas','Detalhes táticos','Tabuleiro padrão · 3D indisponível'],
    fr:['Entrez sur un relais doré pour recharger une fois l’énergie du héros.','Capturez les deux relais pour arrêter les renforts, puis battez les ennemis restants. Chaque relais recharge une fois l’énergie. La coupure déclenche une dernière vague de gardes.','Relais capturé · énergie pleine','Ravitaillement coupé · derniers gardes','Coupez les renforts · {n}/2','Éliminez toutes les vagues · {n}/2','Alterner les héros en action charge la Résonance. À 3, le prochain MAP gagne +2 dégâts et consomme la charge.','Résonance prête · MAP +2','Résonance {n}/3','{hits} cibles · {kills} éliminations prévues','Détails tactiques','Plateau standard · 3D indisponible'],
    de:['Betritt einen goldenen Knoten, um die Energie des Helden einmal aufzufüllen.','Besetze beide Knoten, um Verstärkung zu stoppen, und besiege die übrigen Feinde. Jeder Knoten füllt Energie einmal auf. Das Abschneiden ruft eine letzte Welle Wachen.','Knoten gesichert · Energie voll','Nachschub gestoppt · letzte Wachen','Verstärkung stoppen · {n}/2','Alle Wellen besiegen · {n}/2','Wechselnde Heldenaktionen laden Resonanz. Bei 3 erhält der nächste MAP +2 Schaden und verbraucht die Ladung.','Resonanz bereit · MAP +2','Resonanz {n}/3','{hits} Ziele · {kills} erwartete Siege','Taktikdetails','Standardbrett · 3D nicht verfügbar'],
    it:['Entra in un nodo dorato per ricaricare una volta l’energia dell’eroe.','Conquista entrambi i nodi per fermare i rinforzi e sconfiggi i nemici rimasti. Ogni nodo ricarica energia una volta. Il blocco richiama un’ultima ondata di guardie.','Nodo conquistato · energia piena','Rifornimenti bloccati · ultime guardie','Ferma i rinforzi · nodi {n}/2','Sconfiggi tutte le ondate · {n}/2','Alternare gli eroi nelle azioni carica Risonanza. A 3, il prossimo MAP ottiene +2 danni e consuma la carica.','Risonanza pronta · MAP +2','Risonanza {n}/3','{hits} bersagli · {kills} sconfitte previste','Dettagli tattici','Scacchiera standard · 3D non disponibile'],
    ru:['Встаньте на золотой узел, чтобы один раз полностью зарядить энергию героя.','Займите оба узла, чтобы остановить подкрепления, затем победите оставшихся врагов. Каждый узел заряжает энергию один раз. Прерывание вызывает последнюю волну стражей.','Узел захвачен · энергия полная','Снабжение прервано · последние стражи','Остановите подкрепления · {n}/2','Победите все волны · {n}/2','Действия разных героев подряд заряжают Резонанс. При 3 следующий MAP получает +2 урона и тратит заряд.','Резонанс готов · MAP +2','Резонанс {n}/3','Целей: {hits} · прогноз побед: {kills}','Тактические сведения','Обычное поле · 3D недоступно'],
    hi:['सुनहरे केंद्र पर पहुँचने से उस नायक की ऊर्जा एक बार पूरी भरती है।','दोनों केंद्र लेकर नई लहरें रोकें, फिर बचे शत्रुओं को हराएँ। हर केंद्र ऊर्जा एक बार भरता है। आपूर्ति कटते ही अंतिम रक्षक लहर आती है।','केंद्र लिया · ऊर्जा पूरी','आपूर्ति बंद · अंतिम रक्षक','आपूर्ति रोकें · केंद्र {n}/2','सभी लहरें हराएँ · केंद्र {n}/2','अलग नायकों की लगातार चालों से अनुनाद बढ़ता है। 3 पर अगला MAP +2 क्षति करता है और चार्ज खर्च होता है।','अनुनाद तैयार · MAP +2','अनुनाद {n}/3','{hits} लक्ष्य · अनुमानित हार {kills}','रणनीति विवरण','सामान्य बोर्ड · 3D अनुपलब्ध'],
    ar:['ادخل عقدة ذهبية لملء طاقة البطل مرة واحدة.','استولِ على العقدتين لإيقاف التعزيزات ثم اهزم الأعداء الباقين. كل عقدة تملأ الطاقة مرة واحدة. قطع الإمداد يستدعي موجة الحرس الأخيرة.','تم تأمين العقدة · الطاقة كاملة','قُطعت الإمدادات · الحرس الأخير','اقطع التعزيزات · {n}/2','اهزم كل الموجات · {n}/2','تناوب الأبطال في الأفعال يشحن الرنين. عند 3 يضيف هجوم MAP التالي ضررين ويستهلك الشحنة.','الرنين جاهز · MAP +2','رنين الفريق {n}/3','{hits} أهداف · {kills} هزائم متوقعة','تفاصيل تكتيكية','لوحة عادية · العرض ثلاثي الأبعاد غير متاح']
  };
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
  for(const [code,row] of Object.entries(commandRows))Object.assign(window.WeightPlayRuneTacticsCombatCopy[code],Object.fromEntries(commandKeys.map((key,i)=>[key,row[i]])));
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

// v30: concise, localized cinematic labels.
(()=>{const keys=["specialCharge","specialLaunch","specialSweep","specialHits","specialBlocked","specialWard"];const rows={
  "zh-Hant": [
    "符文蓄力",
    "{skill}，解放！",
    "一擊掃蕩 {n} 名",
    "命中 {n} 名",
    "攻擊受阻",
    "全隊護盾展開"
  ],
  "zh-Hans": [
    "符文蓄力",
    "{skill}，解放！",
    "一击扫荡 {n} 名",
    "命中 {n} 名",
    "攻击受阻",
    "全队护盾展开"
  ],
  "en": [
    "Rune charge",
    "{skill} unleashed!",
    "{n} foes swept",
    "{n} targets hit",
    "Attack blocked",
    "Squad shielded"
  ],
  "ja": [
    "ルーン充填",
    "{skill}、解放！",
    "一撃で{n}体撃破",
    "{n}体に命中",
    "攻撃を防がれた",
    "全員にシールド"
  ],
  "ko": [
    "룬 충전",
    "{skill} 발동!",
    "한 번에 {n}명 격파",
    "{n}명 명중",
    "공격 차단",
    "전원 보호막"
  ],
  "es": [
    "Carga rúnica",
    "¡{skill} desatado!",
    "{n} enemigos barridos",
    "{n} objetivos alcanzados",
    "Ataque bloqueado",
    "Escudos de equipo"
  ],
  "pt-BR": [
    "Carga rúnica",
    "{skill} liberado!",
    "{n} inimigos varridos",
    "{n} alvos atingidos",
    "Ataque bloqueado",
    "Equipe protegida"
  ],
  "fr": [
    "Charge runique",
    "{skill} déchaîné !",
    "{n} ennemis balayés",
    "{n} cibles touchées",
    "Attaque bloquée",
    "Équipe protégée"
  ],
  "de": [
    "Runenladung",
    "{skill} entfesselt!",
    "{n} Gegner besiegt",
    "{n} Ziele getroffen",
    "Angriff geblockt",
    "Team geschützt"
  ],
  "it": [
    "Carica runica",
    "{skill} scatenato!",
    "{n} nemici spazzati via",
    "{n} bersagli colpiti",
    "Attacco bloccato",
    "Squadra protetta"
  ],
  "ru": [
    "Заряд рун",
    "{skill}: разряд!",
    "Врагов сметено: {n}",
    "Попаданий: {n}",
    "Атака отражена",
    "Отряд под щитом"
  ],
  "hi": [
    "रून चार्ज",
    "{skill} जारी!",
    "एक वार में {n} पराजित",
    "{n} को निशाना लगा",
    "हमला रोका गया",
    "दल को ढाल मिली"
  ],
  "ar": [
    "شحن الرون",
    "إطلاق {skill}!",
    "اكتساح {n} أعداء",
    "إصابة {n} أهداف",
    "صُد الهجوم",
    "دروع للفريق"
  ]
};for(const [code,row] of Object.entries(rows))Object.assign(window.WeightPlayRuneTacticsCombatCopy[code],Object.fromEntries(keys.map((key,i)=>[key,row[i]])));})();
(() => {
  const opening={en:'Seize gold relays. Alternate heroes to charge Resonance.','zh-Hant':'搶占金色節點補能，接力出手蓄滿共鳴。','zh-Hans':'抢占金色节点补能，接力出手蓄满共鸣。',ja:'金色の中継点で補充。仲間を交代して共鳴をためよう。',ko:'황금 거점에서 충전! 영웅을 번갈아 써 공명을 모으세요.',es:'Toma nodos dorados. Alterna héroes para cargar Resonancia.','pt-BR':'Tome núcleos dourados. Alterne heróis para Ressonância.',fr:'Prenez les relais dorés. Alternez pour la Résonance.',de:'Goldene Knoten besetzen. Helden für Resonanz abwechseln.',it:'Prendi i nodi dorati. Alterna eroi per la Risonanza.',ru:'Займите золотые узлы. Чередуйте героев для Резонанса.',hi:'सुनहरे केंद्र लें। नायक बदलकर अनुनाद भरें।',ar:'خذ العقد الذهبية. ناوب الأبطال لشحن الرنين.'};
  for(const [code,value] of Object.entries(opening))window.WeightPlayRuneTacticsCombatCopy[code].commandOpening=value;
})();

(() => {
 const rows={en:['Aim on the board, then fire.','Move a hero, then choose an action.'],
 'zh-Hant':['點棋盤瞄準，再按發射。','先移動英雄，再選擇出招。'],
 'zh-Hans':['点棋盘瞄准，再按发射。','先移动英雄，再选择出招。'],
 ja:['盤面で狙い、発射。','仲間を動かして行動を選ぼう。'],
 ko:['보드에서 조준 후 발사!','영웅을 이동한 뒤 행동을 고르세요.'],
 es:['Apunta en el tablero y dispara.','Mueve un héroe y elige una acción.'],
 'pt-BR':['Mire no tabuleiro e dispare.','Mova um herói e escolha uma ação.'],
 fr:['Visez sur le plateau, puis tirez.','Déplacez un héros, puis agissez.'],
 de:['Auf dem Brett zielen, dann feuern.','Held bewegen, dann Aktion wählen.'],
 it:['Mira sul campo, poi spara.','Muovi un eroe, poi scegli un’azione.'],
 ru:['Прицельтесь на поле и стреляйте.','Переместите героя и выберите действие.'],
 hi:['बोर्ड पर निशाना चुनें, फिर चलाएँ।','नायक चलाएँ, फिर कार्रवाई चुनें।'],
 ar:['صوّب على اللوحة ثم أطلق.','حرّك البطل ثم اختر فعلًا.']};
 for(const [code,[mapAim,planHint]] of Object.entries(rows))Object.assign(window.WeightPlayRuneTacticsCombatCopy[code],{mapAim,planHint});
})();

(() => {
 const rows={en:['Wave {wave}/{total} · {n}','+{xp} XP · +{runes} Runes','Mission {mission} failed.','No new rune','Move, mark, then sweep.','Guard the weak. Focus one target.'],
 'zh-Hant':['波次 {wave}/{total} · {n}','+{xp} 經驗 · +{runes} 符文','任務 {mission} 挑戰失敗。','未獲得新符文','先刻印，再接力掃蕩。','保護弱點，集中擊破。'],
 'zh-Hans':['波次 {wave}/{total} · {n}','+{xp} 经验 · +{runes} 符文','任务 {mission} 挑战失败。','未获得新符文','先刻印，再接力扫荡。','保护弱点，集中击破。'],
 ja:['第{wave}/{total}波 · {n}','経験 +{xp} · ルーン +{runes}','任務{mission}で敗北。','新ルーンなし','刻印して、仲間と一掃。','弱い仲間を守り、集中攻撃。'],
 ko:['웨이브 {wave}/{total} · {n}','경험치 +{xp} · 룬 +{runes}','임무 {mission} 실패.','새 룬 없음','표식 후 연계 포격!','약한 아군을 지키고 집중 공격하세요.'],
 es:['Oleada {wave}/{total} · {n}','+{xp} EXP · +{runes} runas','Misión {mission} fallida.','Sin runa nueva','Marca y combina ataques.','Protege al débil. Concentra ataques.'],
 'pt-BR':['Onda {wave}/{total} · {n}','+{xp} EXP · +{runes} runas','Missão {mission} falhou.','Sem nova runa','Marque e combine ataques.','Proteja os fracos. Foque um alvo.'],
 fr:['Vague {wave}/{total} · {n}','+{xp} EXP · +{runes} runes','Mission {mission} échouée.','Aucune nouvelle rune','Marquez, puis balayez en équipe.','Protégez les faibles. Visez une cible.'],
 de:['Welle {wave}/{total} · {n}','+{xp} EP · +{runes} Runen','Mission {mission} verloren.','Keine neue Rune','Markieren, dann gemeinsam angreifen.','Schwache schützen. Ein Ziel angreifen.'],
 it:['Ondata {wave}/{total} · {n}','+{xp} ESP · +{runes} rune','Missione {mission} fallita.','Nessuna nuova runa','Marchia e combina gli attacchi.','Proteggi i deboli. Concentrati su un bersaglio.'],
 ru:['Волна {wave}/{total} · {n}','+{xp} опыта · +{runes} рун','Поражение в задании {mission}.','Нет новой руны','Поставьте метку и атакуйте вместе.','Защитите слабых. Бейте одну цель.'],
 hi:['लहर {wave}/{total} · {n}','+{xp} अनुभव · +{runes} रूण','मिशन {mission} असफल।','नया रूण नहीं','चिह्न लगाएँ, फिर मिलकर वार करें।','कमज़ोर को बचाएँ। एक लक्ष्य पर वार करें।'],
 ar:['موجة {wave}/{total} · {n}','+{xp} خبرة · +{runes} رون','فشلت المهمة {mission}.','لا رون جديد','ضع علامة ثم هاجم بالفريق.','احمِ الضعيف وركّز على هدف واحد.']};
 const keys=['waveHud','resultWin','resultLose','resultRewardNone','planWin','planLose'];
 for(const [code,row] of Object.entries(rows))Object.assign(window.WeightPlayRuneTacticsCombatCopy[code],Object.fromEntries(keys.map((key,i)=>[key,row[i]])));
})();

// Compact surface copy. Full skill/rule descriptions stay in the disclosure.
(() => {
 const keys=['menuHint','lionShort','owlShort','turtleShort','lionBrief','owlBrief','turtleBrief','objectiveCut','objectiveSweep','resonanceReady','resonanceMeter','commandForecast','missionForces','missionStars','pauseHint'];
 const rows={
  en:['Move smart. Chain heroes. Sweep enemy waves.','Lion','Owl','Turtle','3-wide beam · interrupts survivors','3×3 blast · marks survivors','Radius 2 · team heal +2, shield 2','Cut supply · {n}/2','Clear waves · {n}/2','MAP +2 ready','Resonance {n}/3','Hit {hits} · defeat {kills}','{n} enemies · {waves} waves','★ Win · ★ All survive · ★ ≤{turns} turns','Battle frozen. Resume when ready.'],
  'zh-Hant':['走位、接力、地圖炮，一次掃蕩整群敵人。','獅子','貓頭鷹','烏龜','3 格寬貫穿炮 · 打斷敵人','3×3 轟炸 · 刻印敵人','周圍 2 格震擊 · 全隊回血 2、護盾 2','切斷援軍 · {n}/2','掃蕩全波次 · {n}/2','共鳴就緒 · 炮擊 +2','共鳴 {n}/3','命中 {hits} · 擊破 {kills}','{n} 名敵人 · {waves} 波','★ 勝利 · ★ 全員存活 · ★ {turns} 回合內','戰鬥已暫停，繼續即可出戰。'],
  'zh-Hans':['走位、接力、地图炮，一次扫荡整群敌人。','狮子','猫头鹰','乌龟','3 格宽贯穿炮 · 打断敌人','3×3 轰炸 · 刻印敌人','周围 2 格震击 · 全队回血 2、护盾 2','切断援军 · {n}/2','扫荡全波次 · {n}/2','共鸣就绪 · 炮击 +2','共鸣 {n}/3','命中 {hits} · 击破 {kills}','{n} 名敌人 · {waves} 波','★ 胜利 · ★ 全员存活 · ★ {turns} 回合内','战斗已暂停，继续即可出战。'],
  ja:['移動、連携、範囲攻撃。敵の大群を一掃！','ライオン','フクロウ','カメ','幅3マスの砲撃 · 敵を中断','3×3爆撃 · 敵に刻印','周囲2マス · 全員回復2・盾2','増援停止 · {n}/2','全波撃破 · {n}/2','共鳴砲撃 +2','共鳴 {n}/3','命中 {hits} · 撃破 {kills}','敵{n}体 · {waves}波','★ 勝利 · ★ 全員生存 · ★ {turns}ターン以内','戦闘停止中。再開で続行。'],
  ko:['이동과 연계, 광역 포격으로 적을 쓸어버리세요.','사자','부엉이','거북','폭 3칸 포격 · 적 행동 방해','3×3 폭격 · 적에게 표식','반경 2칸 · 전원 회복 2, 방패 2','증원 차단 · {n}/2','모든 웨이브 · {n}/2','공명 포격 +2','공명 {n}/3','명중 {hits} · 처치 {kills}','적 {n}명 · {waves}웨이브','★ 승리 · ★ 전원 생존 · ★ {turns}턴 이내','전투가 멈췄습니다. 준비되면 계속하세요.'],
  es:['Muévete, combina héroes y arrasa oleadas.','León','Búho','Tortuga','Rayo de 3 casillas · interrumpe','Explosión 3×3 · marca enemigos','Radio 2 · cura +2, escudo 2 al equipo','Corta apoyo · {n}/2','Limpia oleadas · {n}/2','MAP +2 listo','Resonancia {n}/3','{hits} impactos · {kills} bajas','{n} enemigos · {waves} oleadas','★ Victoria · ★ Todos vivos · ★ ≤{turns} turnos','Batalla pausada. Continúa cuando quieras.'],
  'pt-BR':['Mova, combine heróis e varra as ondas.','Leão','Coruja','Tartaruga','Raio de 3 casas · interrompe','Explosão 3×3 · marca inimigos','Raio 2 · cura +2, escudo 2 na equipe','Corte apoio · {n}/2','Limpe ondas · {n}/2','MAP +2 pronto','Ressonância {n}/3','{hits} acertos · {kills} baixas','{n} inimigos · {waves} ondas','★ Vitória · ★ Todos vivos · ★ ≤{turns} turnos','Batalha pausada. Continue quando quiser.'],
  fr:['Déplacez, combinez, balayez les vagues ennemies.','Lion','Hibou','Tortue','Rayon large de 3 cases · interrompt','Explosion 3×3 · marque les ennemis','Rayon 2 · soin +2, bouclier 2 à tous','Coupez l’aide · {n}/2','Balayez les vagues · {n}/2','MAP +2 prêt','Résonance {n}/3','{hits} touchés · {kills} éliminés','{n} ennemis · {waves} vagues','★ Victoire · ★ Tous vivants · ★ ≤{turns} tours','Combat en pause. Reprenez à votre rythme.'],
  de:['Klug ziehen, Helden verbinden, Wellen besiegen.','Löwe','Eule','Schildkröte','3 Felder breiter Strahl · unterbricht','3×3 Explosion · markiert Gegner','Radius 2 · Team: Heilung +2, Schild 2','Nachschub aus · {n}/2','Wellen besiegen · {n}/2','MAP +2 bereit','Resonanz {n}/3','{hits} Treffer · {kills} besiegt','{n} Gegner · {waves} Wellen','★ Sieg · ★ Alle leben · ★ ≤{turns} Runden','Kampf pausiert. Fortsetzen, sobald du bereit bist.'],
  it:['Muovi, combina gli eroi e spazza via le ondate.','Leone','Gufo','Tartaruga','Raggio largo 3 caselle · interrompe','Esplosione 3×3 · marchia i nemici','Raggio 2 · squadra: cura +2, scudo 2','Taglia aiuti · {n}/2','Elimina ondate · {n}/2','MAP +2 pronto','Risonanza {n}/3','{hits} colpiti · {kills} eliminati','{n} nemici · {waves} ondate','★ Vittoria · ★ Tutti vivi · ★ ≤{turns} turni','Battaglia in pausa. Riprendi quando vuoi.'],
  ru:['Маневрируйте, чередуйте героев, сметайте волны.','Лев','Сова','Черепаха','Луч шириной 3 клетки · прерывает','Взрыв 3×3 · ставит метки','Радиус 2 · всем: лечение +2, щит 2','Стоп подкреплениям · {n}/2','Разбейте волны · {n}/2','MAP +2 готов','Резонанс {n}/3','Попаданий {hits} · побед {kills}','Врагов: {n} · волн: {waves}','★ Победа · ★ Все живы · ★ ≤{turns} ходов','Бой на паузе. Продолжите, когда будете готовы.'],
  hi:['चाल चलें, नायक बदलें और शत्रु लहरें मिटाएँ।','शेर','उल्लू','कछुआ','3 खाने चौड़ी किरण · शत्रु रोकें','3×3 विस्फोट · शत्रु चिह्नित','दायरा 2 · दल को उपचार +2, ढाल 2','आपूर्ति रोकें · {n}/2','लहरें हराएँ · {n}/2','MAP +2 तैयार','अनुनाद {n}/3','वार {hits} · परास्त {kills}','{n} शत्रु · {waves} लहरें','★ जीत · ★ सब जीवित · ★ ≤{turns} चालें','युद्ध रुका है। तैयार हों तो जारी रखें।'],
  ar:['تحرّك، ناوب أبطالك، واسحق موجات الأعداء.','أسد','بومة','سلحفاة','شعاع بعرض 3 خانات · يوقف العدو','انفجار 3×3 · يضع علامات','مدى 2 · للفريق: شفاء +2 ودرع 2','اقطع الدعم · {n}/2','اهزم الموجات · {n}/2','MAP +2 جاهز','الرنين {n}/3','إصابة {hits} · هزيمة {kills}','{n} أعداء · {waves} موجات','★ فوز · ★ الجميع أحياء · ★ ≤{turns} جولات','المعركة متوقفة. تابع عندما تكون مستعدًا.']
 };
 for(const [code,row] of Object.entries(rows))Object.assign(window.WeightPlayRuneTacticsCombatCopy[code],Object.fromEntries(keys.map((key,i)=>[key,row[i]])));
})();

(()=>{const rows={"en":"★ Guard captain: +12 HP, +1 attack. Mark it, then finish with another hero.","zh-Hant":"★ 守軍隊長：生命 +12、攻擊 +1；先刻印，再由隊友接力擊破。","zh-Hans":"★ 守军队长：生命 +12、攻击 +1；先刻印，再由队友接力击破。","ja":"★ 守備隊長：HP+12、攻撃+1。刻印して仲間で追撃。","ko":"★ 수비대장: 체력 +12, 공격 +1. 표식 후 다른 영웅으로 마무리하세요.","es":"★ Capitán: +12 PV, +1 ataque. Márcalo y remata con otro héroe.","pt-BR":"★ Capitão: +12 PV, +1 ataque. Marque e finalize com outro herói.","fr":"★ Capitaine : +12 PV, +1 attaque. Marquez-le puis frappez avec un allié.","de":"★ Hauptmann: +12 LP, +1 Angriff. Markieren, dann mit anderem Helden treffen.","it":"★ Capitano: +12 PV, +1 attacco. Marchialo e finiscilo con un altro eroe.","ru":"★ Капитан: +12 здоровья, +1 атака. Поставьте метку и добейте другим героем.","hi":"★ कप्तान: +12 जीवन, +1 हमला। चिह्न लगाएँ, फिर दूसरे नायक से मारें।","ar":"★ قائد الحرس: +12 صحة و+1 هجوم. ضع علامة ثم أتبعه ببطل آخر."};for(const [code,value] of Object.entries(rows))window.WeightPlayRuneTacticsCombatCopy[code].guardCaptain=value;})();

(()=>{const keys=["groundTitle","groundClose","groundMove","relayName","groundUsed","rubbleHelp","snareHelp","tideHelp","burnHelp","coolingHelp","orbitHelp","sealHelp"];const rows={"en":["Ground effects","Close","Move here","Energy relay","Used this battle. No further Energy.","Blocks movement. Attacks can cross it.","Stops movement until this hero attacks, guards or uses MAP.","After enemies act, pushes the unit 1 tile {direction} if clear.","Hero loses 1 HP on entry and after enemies act.","On entry: +1 Energy, once per tile. Clears all fire.","After enemies act, all units on the outer edge shift 1 tile clockwise if clear.","Station all 3 heroes on seals to remove the enemy’s −1 damage ward."],"zh-Hant":["地形效果","關閉","移動至此","能量節點","本場已使用，不再補能。","無法通行；攻擊可穿越。","停止移動；攻擊、防禦或地圖砲後解除。","敵方行動後，朝 {direction} 推動 1 格；前方須空置。","英雄踏入時、敵方行動後，各扣 1 點生命。","踏入補 1 能量，每格限一次；清除全場火焰。","敵方行動後，外圈所有單位順時針移 1 格；受阻則停。","3 位英雄同時站上封印，解除敵方減傷 1 點的護罩。"],"zh-Hans":["地形效果","关闭","移动至此","能量节点","本场已使用，不再补能。","无法通行；攻击可穿越。","停止移动；攻击、防御或地图炮后解除。","敌方行动后，朝 {direction} 推动 1 格；前方须空置。","英雄踏入时、敌方行动后，各扣 1 点生命。","踏入补 1 能量，每格限一次；清除全场火焰。","敌方行动后，外圈所有单位顺时针移 1 格；受阻则停。","3 位英雄同时站上封印，解除敌方减伤 1 点的护罩。"],"ja":["地形の効果","閉じる","ここへ移動","エネルギー拠点","使用済み。再充填はできません。","移動不可。攻撃は通過します。","攻撃・防御・MAPを使うまで移動不可。","敵行動後、空いていれば {direction} へ1マス押します。","進入時と敵行動後、英雄のHP−1。","進入でエネルギー+1。各マス1回。全ての炎を消します。","敵行動後、外周の全ユニットが時計回りに1マス移動。障害物で停止。","英雄3人を同時に封印へ置くと、敵の被ダメージ−1の結界を解除。"],"ko":["지형 효과","닫기","여기로 이동","에너지 거점","이미 사용했습니다. 추가 충전 없음.","이동 불가. 공격은 통과합니다.","공격, 방어 또는 MAP 사용 전까지 이동 불가.","적 행동 후 빈칸이면 {direction} 방향으로 1칸 밀립니다.","영웅 진입 시와 적 행동 후 각각 체력 −1.","진입 시 에너지 +1. 칸마다 1회. 모든 불을 끕니다.","적 행동 후 바깥쪽 모든 유닛이 시계 방향으로 1칸 이동. 막히면 정지.","영웅 3명을 동시에 봉인에 놓으면 적의 피해 −1 보호막이 해제됩니다."],"es":["Efectos del terreno","Cerrar","Mover aquí","Nodo de energía","Ya usado. No recarga más.","Bloquea el paso. Los ataques lo atraviesan.","Impide moverse hasta atacar, defender o usar MAP.","Tras actuar los enemigos, empuja 1 casilla {direction} si está libre.","El héroe pierde 1 PV al entrar y tras actuar los enemigos.","Al entrar: +1 energía una vez por casilla. Apaga todo el fuego.","Tras actuar los enemigos, las unidades del borde avanzan 1 casilla en sentido horario si hay paso.","Coloca a los 3 héroes sobre sellos para anular la protección enemiga de −1 daño."],"pt-BR":["Efeitos do terreno","Fechar","Mover aqui","Núcleo de energia","Já usado. Sem nova recarga.","Bloqueia movimento. Ataques atravessam.","Impede movimento até atacar, defender ou usar MAP.","Após os inimigos agirem, empurra 1 casa {direction} se estiver livre.","O herói perde 1 PV ao entrar e após os inimigos agirem.","Ao entrar: +1 energia uma vez por casa. Apaga todo o fogo.","Após os inimigos agirem, unidades da borda avançam 1 casa em sentido horário se houver passagem.","Coloque os 3 heróis sobre selos para remover a proteção inimiga de −1 dano."],"fr":["Effets du terrain","Fermer","Aller ici","Relais d’énergie","Déjà utilisé. Ne recharge plus.","Bloque le passage. Les attaques traversent.","Immobilise jusqu’à une attaque, une garde ou un MAP.","Après les ennemis, pousse de 1 case {direction} si elle est libre.","Le héros perd 1 PV à l’entrée et après les ennemis.","À l’entrée : +1 énergie, une fois par case. Éteint tous les feux.","Après les ennemis, les unités du bord avancent de 1 case dans le sens horaire si le passage est libre.","Placez les 3 héros sur les sceaux pour annuler la protection ennemie de −1 dégât."],"de":["Geländeeffekte","Schließen","Hierher ziehen","Energieknoten","Verbraucht. Keine weitere Energie.","Blockiert Bewegung. Angriffe passieren.","Bewegung gesperrt bis Angriff, Abwehr oder MAP.","Nach dem Gegnerzug: 1 Feld {direction}, sofern frei.","Held verliert beim Betreten und nach dem Gegnerzug je 1 LP.","Beim Betreten: +1 Energie, einmal je Feld. Löscht alle Feuer.","Nach dem Gegnerzug rücken alle Einheiten am Rand 1 Feld im Uhrzeigersinn, sofern frei.","Stelle alle 3 Helden auf Siegel, um den gegnerischen Schutz von −1 Schaden aufzuheben."],"it":["Effetti del terreno","Chiudi","Sposta qui","Nodo energia","Già usato. Non ricarica più.","Blocca il movimento. Gli attacchi passano.","Blocca il movimento fino ad attacco, difesa o MAP.","Dopo i nemici, spinge di 1 casella {direction} se libera.","L’eroe perde 1 PV entrando e dopo il turno nemico.","Entrando: +1 energia, una volta per casella. Spegne tutti i fuochi.","Dopo i nemici, le unità sul bordo avanzano di 1 casella in senso orario se possibile.","Posiziona tutti e 3 gli eroi sui sigilli per annullare la protezione nemica di −1 danno."],"ru":["Эффекты клетки","Закрыть","Идти сюда","Узел энергии","Уже использован. Больше не заряжает.","Блокирует путь. Атаки проходят.","Движение недоступно до атаки, защиты или MAP.","После хода врагов сдвигает на 1 клетку {direction}, если путь свободен.","Герой теряет 1 ОЗ при входе и после хода врагов.","При входе: +1 энергия, один раз на клетку. Гасит весь огонь.","После хода врагов все бойцы на краю сдвигаются на 1 клетку по часовой стрелке, если путь свободен.","Поставьте всех 3 героев на печати, чтобы снять защиту врагов, снижающую урон на 1."],"hi":["ज़मीन का असर","बंद करें","यहाँ जाएँ","ऊर्जा केंद्र","इस्तेमाल हो चुका। फिर ऊर्जा नहीं मिलेगी।","रास्ता बंद है। हमले पार जा सकते हैं।","हमला, रक्षा या MAP करने तक चलना बंद।","दुश्मनों की चाल के बाद खाली हो तो 1 खाना {direction} धकेलता है।","नायक के प्रवेश पर और दुश्मनों की चाल के बाद 1 जीवन घटता है।","प्रवेश पर +1 ऊर्जा, हर खाने में एक बार। सारी आग बुझती है।","दुश्मनों की चाल के बाद किनारे के सभी पात्र घड़ी की दिशा में 1 खाना बढ़ते हैं, यदि रास्ता खुला हो।","तीनों नायकों को मुहरों पर रखें। इससे दुश्मनों का 1 नुकसान घटाने वाला कवच हटता है।"],"ar":["تأثيرات الأرض","إغلاق","تحرك هنا","عقدة طاقة","استُخدمت بالفعل. لا شحن إضافي.","تمنع الحركة. الهجمات تعبرها.","تمنع الحركة حتى الهجوم أو الدفاع أو استخدام MAP.","بعد دور الأعداء، تدفع وحدة خانة واحدة {direction} إن كانت خالية.","يفقد البطل صحة واحدة عند الدخول وبعد دور الأعداء.","عند الدخول: +1 طاقة، مرة لكل خانة. تطفئ كل النار.","بعد دور الأعداء، تتحرك كل وحدات الحافة خانة مع عقارب الساعة إذا كان الطريق متاحًا.","ضع الأبطال الثلاثة على الأختام لإزالة حماية الأعداء التي تقلل الضرر بمقدار 1."]};for(const [code,row] of Object.entries(rows))Object.assign(window.WeightPlayRuneTacticsCombatCopy[code],Object.fromEntries(keys.map((key,i)=>[key,row[i]])));})();
