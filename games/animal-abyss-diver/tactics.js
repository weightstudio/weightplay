/* Abyss Diver v24: deterministic combat and one authored 13-locale copy source. */
(function(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AbyssDiverTactics = api;
})(typeof window === "undefined" ? globalThis : window, function() {
  "use strict";
  const COPY = {
  "en": {
    "guardAction": "Shield strike",
    "guardDetails": "Shield strike: 1 power, {damage} damage; surviving enemy retaliates for {retaliation}.",
    "guardEmpty": "Shield strike needs 1 power.",
    "counterPreview": "Retaliation: {n}",
    "powerGuide": "Sonar, the lane Shield and Shield strike share four battery points. Route rules can change Sonar and lane Shield costs or restore power from specific finds. Shield strike always costs one point.",
    "combatGuide": "Fish combat offers three decisions. Attack deals your full Attack stat without spending power. Shield strike spends one power, deals two thirds of Attack rounded up, and reduces that turn’s retaliation to one third rounded up. A defeated enemy cannot retaliate. Escape spends the displayed oxygen instead, granting no loot or experience; it can exhaust your oxygen. Winning grants salvage, experience and one power.",
    "combatHow": "In fish combat, compare the displayed damage, retaliation and escape cost. Choose Attack, Shield strike or Escape.",
    "combatTip": "Use a full Attack for a finishing blow. Save Shield strikes for enemies that would survive and hit hard; scanning every lane can leave no power for protection.",
    "designNote": "Thirty authored routes combine lane clues, oxygen budgets, shared battery power and turn-based fish combat. Finishing every zone and meeting the salvage target clears one route, not several. Stage, Battle and Result retain the shared responsive frame with a 920-pixel desktop cap. Decorative motion pauses with the dive and respects reduced-motion preferences; it does not change rewards or hit targets. No account is required; progression stays in this browser.",
    "description": "Plan 30 deep-sea routes, manage oxygen and shared battery power, recover relics, and choose how to confront fish before surfacing safely.",
    "coverAlt": "Nori explores a coral abyss and ancient relics.",
    "loading": "Preparing the dive…",
    "language": "Language"
  },
  "zh-Hant": {
    "guardAction": "護盾突擊",
    "guardDetails": "護盾突擊：消耗 1 電力，造成 {damage} 傷害；敵人存活時反擊 {retaliation} 傷害。",
    "guardEmpty": "護盾突擊需要 1 電力。",
    "counterPreview": "預計反擊：{n}",
    "powerGuide": "聲納、航線護盾與護盾突擊共用四格電力。路線規則可能改變聲納、航線護盾的費用，或讓特定發現回復電力；護盾突擊固定消耗一格。",
    "combatGuide": "魚類戰鬥有三種選擇。普通攻擊不耗電，造成完整攻擊力的傷害。護盾突擊消耗一格電力，造成攻擊力的三分之二傷害，並把本回合反擊降為三分之一，兩者均向上取整。敵人被擊敗就不會反擊。逃離會扣除畫面標示的氧氣，不給打撈品或經驗，也可能耗盡氧氣。獲勝可取得打撈品、經驗並回復一格電力。",
    "combatHow": "遭遇魚類時，比較傷害、反擊與逃離耗氧，再選普通攻擊、護盾突擊或逃離。",
    "combatTip": "能一擊擊敗時用普通攻擊；敵人仍會存活且反擊很痛時才考慮護盾突擊。每條航線都掃描，可能使你沒有電力防護。",
    "designNote": "30 條手工設計路線結合航線線索、氧氣預算、共用電力與回合制魚戰。完成全部海域並達到打撈目標，只推進一條路線。Stage、Battle 與 Result 保留共用響應式框架，桌面寬度上限為 920px。裝飾動畫隨潛航暫停，並尊重減少動態效果設定，不影響獎勵或操作區域。不需帳號，進度保存在此瀏覽器。",
    "description": "探索 30 條深海路線，管理氧氣與共用電力、回收遺物，並在安全上浮前選擇如何應對魚類。",
    "coverAlt": "諾里探索珊瑚深淵與古代遺物。",
    "loading": "正在準備潛航……",
    "language": "語言"
  },
  "zh-Hans": {
    "guardAction": "护盾突击",
    "guardDetails": "护盾突击：消耗 1 电力，造成 {damage} 伤害；敌人存活时反击 {retaliation} 伤害。",
    "guardEmpty": "护盾突击需要 1 电力。",
    "counterPreview": "预计反击：{n}",
    "powerGuide": "声纳、航线护盾与护盾突击共用四格电力。路线规则可能改变声纳、航线护盾的费用，或让特定发现恢复电力；护盾突击固定消耗一格。",
    "combatGuide": "鱼类战斗有三种选择。普通攻击不耗电，造成完整攻击力的伤害。护盾突击消耗一格电力，造成攻击力三分之二的伤害，并把本回合反击降为三分之一，两者均向上取整。敌人被击败就不会反击。逃离会扣除画面标示的氧气，不给打捞品或经验，也可能耗尽氧气。获胜可取得打捞品、经验并恢复一格电力。",
    "combatHow": "遭遇鱼类时，比较伤害、反击与逃离耗氧，再选普通攻击、护盾突击或逃离。",
    "combatTip": "能一击击败时用普通攻击；敌人仍会存活且反击很痛时才考虑护盾突击。每条航线都扫描，可能使你没有电力防护。",
    "designNote": "30 条手工设计路线结合航线线索、氧气预算、共用电力与回合制鱼战。完成全部海域并达到打捞目标，只推进一条路线。Stage、Battle 与 Result 保留共用响应式框架，桌面宽度上限为 920px。装饰动画随潜航暂停，并尊重减少动态效果设置，不影响奖励或操作区域。不需账号，进度保存在此浏览器。",
    "description": "探索 30 条深海路线，管理氧气与共用电力、回收遗物，并在安全上浮前选择如何应对鱼类。",
    "coverAlt": "诺里探索珊瑚深渊与古代遗物。",
    "loading": "正在准备潜航……",
    "language": "语言"
  },
  "ja": {
    "guardAction": "シールド攻撃",
    "guardDetails": "シールド攻撃：電力1を消費し、{damage}ダメージ。生き残った敵の反撃は{retaliation}。",
    "guardEmpty": "シールド攻撃には電力1が必要です。",
    "counterPreview": "反撃予測：{n}",
    "powerGuide": "ソナー、航路のシールド、シールド攻撃は4ポイントの電力を共有します。航路のルールによってソナーや航路シールドの消費量、発見物による回復が変わります。シールド攻撃の消費は常に1です。",
    "combatGuide": "魚との戦闘では3つの行動を選べます。通常攻撃は電力を使わず、攻撃力と同じダメージを与えます。シールド攻撃は電力1を使い、攻撃力の3分の2のダメージを与え、このターンの反撃を3分の1に減らします。どちらも端数は切り上げです。倒した敵は反撃しません。逃走は表示された酸素を消費し、戦利品や経験値は得られず、酸素が尽きる場合もあります。勝利すると戦利品と経験値を獲得し、電力が1回復します。",
    "combatHow": "魚との戦闘ではダメージ、反撃、逃走の酸素消費を比べ、攻撃・シールド攻撃・逃走を選びましょう。",
    "combatTip": "倒し切れるときは通常攻撃。敵が生き残り、強い反撃が来るときにシールド攻撃を使いましょう。毎回のスキャンは防御用の電力を減らします。",
    "designNote": "30の手作り航路で、手掛かり、酸素配分、共用電力、ターン制の魚との戦闘を組み合わせます。全海域を進み回収目標を達成しても、進む航路は1つだけです。航路選択・戦闘・結果は共通のレスポンシブ枠を使い、デスクトップの幅は最大920ピクセルです。装飾アニメーションは潜航の中断時に停止し、動きを減らす設定にも対応します。報酬や操作範囲は変わりません。アカウントは不要で、進行状況はこのブラウザーに保存されます。",
    "description": "30の深海航路で酸素と共用電力を管理し、遺物を回収。魚への対処を選び、安全な浮上を目指しましょう。",
    "coverAlt": "ノリがサンゴの深淵と古代の遺物を探索しています。",
    "loading": "潜航の準備中…",
    "language": "言語"
  },
  "ko": {
    "guardAction": "방패 공격",
    "guardDetails": "방패 공격: 전력 1을 써서 피해 {damage}. 살아남은 적의 반격 피해는 {retaliation}.",
    "guardEmpty": "방패 공격에는 전력 1이 필요합니다.",
    "counterPreview": "예상 반격: {n}",
    "powerGuide": "소나, 항로 방패, 방패 공격은 전력 4칸을 공유합니다. 항로 규칙에 따라 소나와 항로 방패 비용, 특정 발견물의 전력 회복이 달라집니다. 방패 공격 비용은 항상 1입니다.",
    "combatGuide": "물고기 전투에는 세 가지 선택이 있습니다. 일반 공격은 전력을 쓰지 않고 공격력만큼 피해를 줍니다. 방패 공격은 전력 1을 사용해 공격력의 3분의 2만큼 피해를 주고, 이번 턴 반격을 3분의 1로 줄입니다. 두 값 모두 올림합니다. 쓰러진 적은 반격하지 않습니다. 도주는 표시된 산소를 소비하며 전리품이나 경험치를 주지 않고, 산소가 소진될 수도 있습니다. 승리하면 전리품과 경험치를 얻고 전력이 1 회복됩니다.",
    "combatHow": "물고기를 만나면 피해, 반격, 도주 산소 비용을 비교하고 일반 공격, 방패 공격, 도주 중 하나를 고르세요.",
    "combatTip": "한 번에 쓰러뜨릴 수 있다면 일반 공격을 쓰세요. 적이 살아남아 강하게 반격할 때 방패 공격이 유용합니다. 매번 소나를 쓰면 방어용 전력이 부족해질 수 있습니다.",
    "designNote": "직접 설계한 항로 30개에서 단서, 산소 예산, 공유 전력과 턴제 물고기 전투를 조합합니다. 모든 해역을 지나 회수 목표를 달성해야 항로 하나를 완료합니다. 항로 선택, 전투, 결과는 최대 데스크톱 너비 920픽셀의 공통 반응형 화면을 사용합니다. 장식 효과는 잠수 일시정지와 함께 멈추며 동작 줄이기 설정을 따릅니다. 보상과 조작 영역은 바뀌지 않습니다. 계정이 필요 없고 진행은 이 브라우저에 저장됩니다.",
    "description": "30개 심해 항로에서 산소와 공유 전력을 관리하고 유물을 회수하세요. 물고기에 대응할 방법을 골라 안전하게 수면으로 돌아오세요.",
    "coverAlt": "노리가 산호 심연과 고대 유물을 탐험합니다.",
    "loading": "잠수 준비 중…",
    "language": "언어"
  },
  "es": {
    "guardAction": "Golpe con escudo",
    "guardDetails": "Golpe con escudo: 1 de energía, {damage} de daño; si el enemigo sobrevive, contraataca por {retaliation}.",
    "guardEmpty": "El golpe con escudo requiere 1 de energía.",
    "counterPreview": "Contraataque: {n}",
    "powerGuide": "Sonar, Escudo de ruta y Golpe con escudo comparten cuatro puntos de batería. Las reglas de la ruta pueden cambiar los costes de Sonar y Escudo o recuperar energía con ciertos hallazgos. Golpe con escudo siempre cuesta un punto.",
    "combatGuide": "El combate ofrece tres decisiones. Atacar inflige todo tu Ataque sin gastar energía. Golpe con escudo gasta un punto, inflige dos tercios del Ataque y reduce el contraataque de ese turno a un tercio; ambos valores se redondean hacia arriba. Un enemigo derrotado no contraataca. Escapar gasta el oxígeno indicado, no concede botín ni experiencia y puede agotar el oxígeno. Vencer concede botín, experiencia y un punto de energía.",
    "combatHow": "Compara el daño, el contraataque y el oxígeno para escapar. Elige Atacar, Golpe con escudo o Escapar.",
    "combatTip": "Usa un ataque completo para rematar. Reserva los golpes con escudo para enemigos que sobrevivirían y golpearían fuerte; escanear siempre puede dejarte sin energía defensiva.",
    "designNote": "Treinta rutas diseñadas combinan pistas, presupuesto de oxígeno, batería compartida y combate por turnos. Completar todas las zonas y alcanzar la meta cuenta como una sola ruta. Selección, combate y resultados conservan el marco adaptable compartido, con un máximo de 920 píxeles en escritorio. Las animaciones se detienen al pausar y respetan la reducción de movimiento; no alteran recompensas ni zonas de interacción. No se necesita cuenta y el progreso se guarda en este navegador.",
    "description": "Explora 30 rutas submarinas, administra oxígeno y batería compartida, recupera reliquias y decide cómo enfrentarte a los peces antes de subir a salvo.",
    "coverAlt": "Nori explora un abismo de coral y reliquias antiguas.",
    "loading": "Preparando la inmersión…",
    "language": "Idioma"
  },
  "pt-BR": {
    "guardAction": "Golpe com escudo",
    "guardDetails": "Golpe com escudo: 1 de energia, {damage} de dano; se sobreviver, o inimigo contra-ataca com {retaliation}.",
    "guardEmpty": "O golpe com escudo precisa de 1 de energia.",
    "counterPreview": "Contra-ataque: {n}",
    "powerGuide": "Sonar, Escudo de rota e Golpe com escudo compartilham quatro pontos de bateria. As regras da rota podem mudar os custos do Sonar e do Escudo ou recuperar energia com certos achados. Golpe com escudo sempre custa um ponto.",
    "combatGuide": "O combate oferece três decisões. Atacar causa seu Ataque completo sem gastar energia. Golpe com escudo gasta um ponto, causa dois terços do Ataque e reduz o contra-ataque daquele turno a um terço; ambos os valores são arredondados para cima. Um inimigo derrotado não contra-ataca. Fugir gasta o oxigênio indicado, não concede saque nem experiência e pode esgotar o oxigênio. Vencer concede saque, experiência e um ponto de energia.",
    "combatHow": "Compare o dano, o contra-ataque e o custo de oxigênio para fugir. Escolha Atacar, Golpe com escudo ou Fugir.",
    "combatTip": "Use um ataque completo para finalizar. Guarde golpes com escudo para inimigos que sobreviveriam e bateriam forte; escanear sempre pode deixar você sem energia defensiva.",
    "designNote": "Trinta rotas feitas à mão combinam pistas, orçamento de oxigênio, bateria compartilhada e combate por turnos. Completar todas as zonas e atingir a meta conta como uma única rota. Seleção, combate e resultado mantêm o quadro responsivo compartilhado, limitado a 920 pixels no computador. As animações param junto com o mergulho e respeitam a preferência por menos movimento; não alteram recompensas nem áreas de interação. Não é preciso ter conta, e o progresso fica neste navegador.",
    "description": "Explore 30 rotas submarinas, gerencie oxigênio e bateria compartilhada, recupere relíquias e escolha como enfrentar peixes antes de subir em segurança.",
    "coverAlt": "Nori explora um abismo de corais e relíquias antigas.",
    "loading": "Preparando o mergulho…",
    "language": "Idioma"
  },
  "fr": {
    "guardAction": "Frappe protégée",
    "guardDetails": "Frappe protégée : 1 énergie, {damage} dégâts ; si l’ennemi survit, sa riposte inflige {retaliation}.",
    "guardEmpty": "La frappe protégée nécessite 1 énergie.",
    "counterPreview": "Riposte : {n}",
    "powerGuide": "Le sonar, le bouclier de trajet et la frappe protégée partagent quatre points de batterie. Les règles du trajet peuvent modifier les coûts du sonar et du bouclier ou rendre de l’énergie lors de certaines découvertes. La frappe protégée coûte toujours un point.",
    "combatGuide": "Le combat propose trois décisions. Attaquer inflige toute votre Attaque sans consommer d’énergie. La frappe protégée dépense un point, inflige deux tiers de l’Attaque et réduit la riposte du tour à un tiers ; les deux valeurs sont arrondies au supérieur. Un ennemi vaincu ne riposte pas. Fuir consomme l’oxygène indiqué, ne rapporte ni butin ni expérience et peut épuiser l’oxygène. Une victoire rapporte du butin, de l’expérience et un point d’énergie.",
    "combatHow": "Comparez les dégâts, la riposte et le coût en oxygène de la fuite. Choisissez Attaquer, Frappe protégée ou Fuir.",
    "combatTip": "Préférez une attaque complète pour achever un ennemi. Gardez les frappes protégées pour les ennemis qui survivraient et riposteraient fort ; scanner partout peut épuiser votre énergie défensive.",
    "designNote": "Trente trajets conçus à la main mêlent indices, réserve d’oxygène, batterie commune et combat au tour par tour. Terminer toutes les zones et atteindre la cible valide un seul trajet. La sélection, le combat et le résultat conservent le cadre adaptatif commun, limité à 920 pixels sur ordinateur. Les animations s’arrêtent avec la pause et respectent la réduction des mouvements ; elles ne changent ni récompenses ni zones interactives. Aucun compte n’est requis et la progression reste dans ce navigateur.",
    "description": "Explorez 30 trajets sous-marins, gérez oxygène et batterie commune, récupérez des reliques et choisissez comment affronter les poissons avant de remonter.",
    "coverAlt": "Nori explore un abîme de corail et des reliques anciennes.",
    "loading": "Préparation de la plongée…",
    "language": "Langue"
  },
  "de": {
    "guardAction": "Schildangriff",
    "guardDetails": "Schildangriff: 1 Energie, {damage} Schaden; überlebt der Gegner, verursacht sein Gegenschlag {retaliation}.",
    "guardEmpty": "Der Schildangriff benötigt 1 Energie.",
    "counterPreview": "Gegenschlag: {n}",
    "powerGuide": "Sonar, Streckenschild und Schildangriff teilen vier Batteriepunkte. Streckenregeln können Sonar- und Schildkosten ändern oder bei bestimmten Funden Energie zurückgeben. Ein Schildangriff kostet immer einen Punkt.",
    "combatGuide": "Im Fischkampf gibt es drei Möglichkeiten. Angreifen verursacht deinen vollen Angriffswert und kostet keine Energie. Ein Schildangriff kostet einen Punkt, verursacht zwei Drittel des Angriffswerts und senkt den Gegenschlag dieser Runde auf ein Drittel; beide Werte werden aufgerundet. Besiegte Gegner schlagen nicht zurück. Fliehen verbraucht den angezeigten Sauerstoff, gibt weder Beute noch Erfahrung und kann den Sauerstoff aufbrauchen. Ein Sieg bringt Beute, Erfahrung und einen Energiepunkt.",
    "combatHow": "Vergleiche Schaden, Gegenschlag und Sauerstoffkosten der Flucht. Wähle Angreifen, Schildangriff oder Fliehen.",
    "combatTip": "Nutze einen vollen Angriff für den letzten Treffer. Spare Schildangriffe für Gegner, die überleben und hart zurückschlagen würden; ständiges Scannen kann deine Schutzenergie aufbrauchen.",
    "designNote": "Dreißig handgefertigte Strecken verbinden Hinweise, Sauerstoffplanung, gemeinsame Batterie und rundenbasierte Fischkämpfe. Erst alle Zonen und das Bergungsziel zusammen schließen eine einzelne Strecke ab. Auswahl, Kampf und Ergebnis behalten den gemeinsamen responsiven Rahmen mit maximal 920 Pixeln am Desktop. Dekorative Bewegung pausiert mit dem Tauchgang und berücksichtigt reduzierte Bewegung; Belohnungen und Bedienflächen bleiben unverändert. Kein Konto ist nötig, der Fortschritt bleibt in diesem Browser.",
    "description": "Erkunde 30 Tiefseestrecken, verwalte Sauerstoff und Batterie, berge Relikte und entscheide vor dem sicheren Auftauchen, wie du Fischen begegnest.",
    "coverAlt": "Nori erkundet einen Korallenabgrund und alte Relikte.",
    "loading": "Tauchgang wird vorbereitet…",
    "language": "Sprache"
  },
  "it": {
    "guardAction": "Colpo protetto",
    "guardDetails": "Colpo protetto: 1 energia, {damage} danni; se sopravvive, il nemico contrattacca per {retaliation}.",
    "guardEmpty": "Il colpo protetto richiede 1 energia.",
    "counterPreview": "Contrattacco: {n}",
    "powerGuide": "Sonar, scudo di percorso e colpo protetto condividono quattro punti di batteria. Le regole possono cambiare i costi di sonar e scudo o recuperare energia con alcuni ritrovamenti. Il colpo protetto costa sempre un punto.",
    "combatGuide": "Il combattimento offre tre scelte. Attaccare infligge il tuo intero Attacco senza consumare energia. Il colpo protetto costa un punto, infligge due terzi dell’Attacco e riduce il contrattacco del turno a un terzo; entrambi i valori sono arrotondati per eccesso. Un nemico sconfitto non contrattacca. Fuggire consuma l’ossigeno indicato, non dà bottino né esperienza e può esaurire l’ossigeno. Vincere dà bottino, esperienza e un punto di energia.",
    "combatHow": "Confronta danni, contrattacco e costo in ossigeno della fuga. Scegli Attaccare, Colpo protetto o Fuggire.",
    "combatTip": "Usa un attacco completo per il colpo finale. Conserva i colpi protetti per nemici che sopravvivrebbero e colpirebbero forte; usare sempre il sonar può esaurire l’energia difensiva.",
    "designNote": "Trenta percorsi progettati combinano indizi, gestione dell’ossigeno, batteria condivisa e combattimenti a turni. Completare tutte le zone e raggiungere l’obiettivo vale un solo percorso. Selezione, battaglia e risultato mantengono il riquadro adattivo comune, largo al massimo 920 pixel su computer. Le animazioni si fermano durante la pausa e rispettano la preferenza di movimento ridotto; non cambiano ricompense né aree interattive. Non serve un account e i progressi rimangono in questo browser.",
    "description": "Esplora 30 percorsi sottomarini, gestisci ossigeno e batteria condivisa, recupera reliquie e scegli come affrontare i pesci prima di risalire al sicuro.",
    "coverAlt": "Nori esplora un abisso corallino e antiche reliquie.",
    "loading": "Preparazione dell’immersione…",
    "language": "Lingua"
  },
  "ru": {
    "guardAction": "Удар со щитом",
    "guardDetails": "Удар со щитом: 1 энергия, {damage} урона; выживший враг ответит на {retaliation}.",
    "guardEmpty": "Для удара со щитом нужна 1 энергия.",
    "counterPreview": "Ответный урон: {n}",
    "powerGuide": "Сонар, щит на маршруте и удар со щитом расходуют общий запас из четырёх единиц энергии. Правила маршрута могут менять стоимость сонара и щита или восстанавливать энергию за находки. Удар со щитом всегда стоит одну единицу.",
    "combatGuide": "В бою с рыбами есть три решения. Обычная атака наносит полный урон Атаки без затрат энергии. Удар со щитом тратит одну энергию, наносит две трети Атаки и уменьшает ответный удар в этом ходу до одной трети; оба значения округляются вверх. Побеждённый враг не отвечает. Побег тратит указанное количество кислорода, не даёт добычи или опыта и может исчерпать кислород. Победа приносит добычу, опыт и одну энергию.",
    "combatHow": "Сравните урон, ответный удар и кислород для побега. Выберите обычную атаку, удар со щитом или побег.",
    "combatTip": "Для добивания используйте полную атаку. Берегите удары со щитом для врагов, которые выживут и больно ответят; постоянное сканирование может лишить вас энергии для защиты.",
    "designNote": "Тридцать созданных вручную маршрутов сочетают подсказки, запас кислорода, общую батарею и пошаговые бои. Прохождение всех зон и выполнение цели завершают один маршрут. Выбор, бой и результат используют общую адаптивную рамку шириной до 920 пикселей на компьютере. Декоративное движение останавливается на паузе и учитывает настройку уменьшения анимации; награды и области управления не меняются. Аккаунт не нужен, прогресс хранится в этом браузере.",
    "description": "Исследуйте 30 глубоководных маршрутов, управляйте кислородом и энергией, собирайте реликвии и выбирайте тактику против рыб перед безопасным всплытием.",
    "coverAlt": "Нори исследует коралловую бездну и древние реликвии.",
    "loading": "Подготовка к погружению…",
    "language": "Язык"
  },
  "hi": {
    "guardAction": "ढाल प्रहार",
    "guardDetails": "ढाल प्रहार: 1 ऊर्जा, {damage} क्षति; जीवित बचा शत्रु {retaliation} क्षति का पलटवार करेगा।",
    "guardEmpty": "ढाल प्रहार के लिए 1 ऊर्जा चाहिए।",
    "counterPreview": "पलटवार: {n}",
    "powerGuide": "सोनार, मार्ग की ढाल और ढाल प्रहार चार बैटरी अंकों को साझा करते हैं। मार्ग के नियम सोनार और ढाल की लागत बदल सकते हैं या खास खोजों से ऊर्जा लौटा सकते हैं। ढाल प्रहार की लागत हमेशा एक अंक है।",
    "combatGuide": "मछली से लड़ाई में तीन विकल्प हैं। साधारण हमला बिना ऊर्जा खर्च किए आपकी पूरी आक्रमण शक्ति जितनी क्षति देता है। ढाल प्रहार एक ऊर्जा खर्च करके आक्रमण शक्ति की दो तिहाई क्षति देता है और उस बारी के पलटवार को एक तिहाई कर देता है; दोनों मान ऊपर की पूर्ण संख्या तक गोल किए जाते हैं। पराजित शत्रु पलटवार नहीं करता। भागने में दिखाया गया ऑक्सीजन खर्च होता है, लूट या अनुभव नहीं मिलता और ऑक्सीजन खत्म भी हो सकता है। जीतने पर लूट, अनुभव और एक ऊर्जा मिलती है।",
    "combatHow": "क्षति, पलटवार और भागने की ऑक्सीजन लागत की तुलना करें। हमला, ढाल प्रहार या भागना चुनें।",
    "combatTip": "अंतिम वार के लिए पूरा हमला करें। ढाल प्रहार उन शत्रुओं के लिए बचाएँ जो जीवित रहकर जोरदार पलटवार करेंगे; हर जगह सोनार चलाने से रक्षा की ऊर्जा खत्म हो सकती है।",
    "designNote": "हाथ से बनाए गए तीस मार्ग संकेतों, ऑक्सीजन बजट, साझा बैटरी और बारी आधारित मछली युद्ध को जोड़ते हैं। सभी क्षेत्रों को पूरा करके बचाव लक्ष्य पाने पर केवल एक मार्ग पूरा होता है। चयन, लड़ाई और परिणाम साझा अनुकूलनीय फ्रेम रखते हैं, जिसकी डेस्कटॉप चौड़ाई अधिकतम 920 पिक्सेल है। सजावटी गति विराम के साथ रुकती है और कम गति की सेटिंग मानती है; इनाम और नियंत्रण क्षेत्र नहीं बदलते। खाता नहीं चाहिए और प्रगति इसी ब्राउज़र में रहती है।",
    "description": "30 गहरे समुद्री मार्ग खोजें, ऑक्सीजन और साझा बैटरी सँभालें, अवशेष बचाएँ और सुरक्षित ऊपर लौटने से पहले मछलियों का सामना करने की रणनीति चुनें।",
    "coverAlt": "नोरी प्रवाल की गहराइयों और प्राचीन अवशेषों को खोजता है।",
    "loading": "गोताखोरी की तैयारी…",
    "language": "भाषा"
  },
  "ar": {
    "guardAction": "ضربة محمية",
    "guardDetails": "ضربة محمية: طاقة واحدة وضرر {damage}؛ إذا نجا العدو فسيرد بضرر {retaliation}.",
    "guardEmpty": "تحتاج الضربة المحمية إلى نقطة طاقة واحدة.",
    "counterPreview": "ضرر الرد: {n}",
    "powerGuide": "يشترك السونار ودرع المسار والضربة المحمية في أربع نقاط بطارية. قد تغيّر قواعد المسار تكلفة السونار والدرع أو تعيد الطاقة عند اكتشاف أشياء محددة. تكلفة الضربة المحمية دائماً نقطة واحدة.",
    "combatGuide": "يتيح قتال الأسماك ثلاثة خيارات. يسبب الهجوم العادي كامل قوة الهجوم دون استهلاك طاقة. تستهلك الضربة المحمية نقطة طاقة، وتسبب ثلثي قوة الهجوم وتخفض الرد في ذلك الدور إلى الثلث؛ تُقرّب القيمتان إلى العدد الصحيح الأعلى. لا يرد العدو المهزوم. يستهلك الهرب الأكسجين المعروض ولا يمنح غنائم أو خبرة، وقد يستنفد الأكسجين. يمنح الفوز غنائم وخبرة ونقطة طاقة واحدة.",
    "combatHow": "قارن الضرر ورد العدو وتكلفة الأكسجين للهرب. اختر الهجوم أو الضربة المحمية أو الهرب.",
    "combatTip": "استخدم الهجوم الكامل للضربة الأخيرة. احتفظ بالضربات المحمية للأعداء الذين سينجون ويردون بقوة؛ قد يتركك المسح المتكرر دون طاقة للحماية.",
    "designNote": "تجمع ثلاثون رحلة مصممة يدوياً بين الأدلة وميزانية الأكسجين والبطارية المشتركة وقتال الأسماك القائم على الأدوار. إكمال كل المناطق وتحقيق هدف الإنقاذ يُنهي مساراً واحداً فقط. تحتفظ شاشات الاختيار والقتال والنتيجة بالإطار المتجاوب المشترك، بعرض أقصى 920 بكسلاً على الحاسوب. تتوقف الحركة الزخرفية مع الإيقاف وتراعي تفضيل تقليل الحركة؛ ولا تغير المكافآت أو مناطق التحكم. لا تحتاج إلى حساب، ويُحفظ التقدم في هذا المتصفح.",
    "description": "استكشف 30 مساراً في الأعماق، وأدر الأكسجين والبطارية المشتركة، واستعد الآثار واختر كيف تواجه الأسماك قبل الصعود بأمان.",
    "coverAlt": "يستكشف نوري هاوية مرجانية وآثاراً قديمة.",
    "loading": "جارٍ تجهيز الغوص…",
    "language": "اللغة"
  }
};
  const completionFaq={"en":"No. Surfacing early banks partial salvage. You must finish every zone and meet the salvage target to clear a route; the next route unlocks only if one remains.","zh-Hant":"不會。提前上浮只會保存部分打撈品；必須完成全部海域並達到打撈目標才算通關，且仍有後續路線時才會解鎖下一條。","zh-Hans":"不会。提前上浮只会保存部分打捞品；必须完成全部海域并达到打捞目标才算通关，且仍有后续路线时才会解锁下一条。","ja":"いいえ。早めに浮上すると、それまでの回収品だけを持ち帰ります。全海域を進み、回収目標を達成するとクリアです。次の航路が残っている場合にだけ解放されます。","ko":"아니요. 일찍 떠오르면 지금까지의 전리품만 보관합니다. 모든 해역을 지나 회수 목표를 달성해야 항로를 완료하며, 다음 항로가 남아 있을 때만 해금됩니다.","es":"No. Emerger antes guarda el botín parcial. Debes completar todas las zonas y alcanzar la meta para superar una ruta; la siguiente solo se desbloquea si todavía queda alguna.","pt-BR":"Não. Subir antes guarda apenas o saque parcial. Você precisa concluir todas as zonas e atingir a meta para completar a rota; a próxima só é liberada se ainda houver outra.","fr":"Non. Remonter tôt conserve seulement le butin partiel. Il faut terminer toutes les zones et atteindre la cible pour valider le trajet ; le suivant se débloque uniquement s’il en reste un.","de":"Nein. Frühes Auftauchen sichert nur die bisherige Beute. Du musst alle Zonen abschließen und das Beuteziel erreichen. Eine nächste Strecke wird nur freigeschaltet, wenn noch eine vorhanden ist.","it":"No. Risalire prima conserva soltanto il bottino parziale. Per completare un percorso devi superare tutte le zone e raggiungere l’obiettivo; il successivo si sblocca solo se ne rimane uno.","ru":"Нет. Раннее всплытие сохраняет только собранную добычу. Для завершения маршрута нужно пройти все зоны и достичь цели по добыче. Следующий маршрут открывается, только если он ещё есть.","hi":"नहीं। जल्दी ऊपर आने से केवल अब तक की लूट बचती है। मार्ग पूरा करने के लिए हर क्षेत्र पार करना और लूट का लक्ष्य पाना ज़रूरी है। अगला मार्ग तभी खुलता है जब कोई बाकी हो।","ar":"لا. يحفظ الصعود المبكر الغنائم التي جمعتها فقط. يجب إكمال كل المناطق وتحقيق هدف الغنائم لإنهاء المسار، ولا يُفتح المسار التالي إلا إذا كان هناك مسار آخر."};
  for(const [locale,text] of Object.entries(COPY))text.completionFaq=completionFaq[locale];
  function plan({mode="attack", attack, enemyAttack, battery}) {
    if (![attack,enemyAttack,battery].every(Number.isSafeInteger) || attack<1 || enemyAttack<0 || battery<0 || battery>4) throw new RangeError("Invalid combat input");
    if (mode!=="attack" && mode!=="guard") throw new TypeError("Unknown combat action");
    if (mode==="guard" && battery<1) return null;
    return Object.freeze({mode,cost:mode==="guard"?1:0,damage:mode==="guard"?attack-Math.floor(attack/3):attack,retaliation:mode==="guard"?Math.ceil(enemyAttack/3):enemyAttack});
  }
  function applyGuide(game, locale) {
    const text=COPY[locale];
    if (!text || !game) throw new Error("Missing Abyss guide locale: "+locale);
    const systems=[...(game.systems||[])],how=[...(game.how||[])],tips=[...(game.strategyTips||game.tips||[])];
    if(systems.length<3||how.length<5||tips.length<2) throw new Error("Abyss guide structure changed");
    systems[1]=text.powerGuide;systems[2]=text.combatGuide;how[4]=text.combatHow;tips[1]=text.combatTip;
    const faq=game.faq?.map(pair=>[...pair]);
    if(faq){const index=(locale==="ja"||locale==="es")?3:4;if(!faq[index])throw new Error("Missing Abyss early-surface FAQ");faq[index][1]=text.completionFaq;}
    return {...game,systems,how,strategyTips:tips,designNote:text.designNote,...(faq?{faq}:{})};
  }
  for(const text of Object.values(COPY)) Object.freeze(text);
  return Object.freeze({COPY:Object.freeze(COPY),plan,applyGuide});
});
