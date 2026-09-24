/* Rune Tactics native UI source. Column order is validated; placeholders remain game-owned. */
(() => {
  'use strict';
  const locales = ['ja', 'ko', 'fr', 'de', 'it', 'ru', 'hi'];
  const data = Object.fromEntries(locales.map(code => [code, {}]));
  const rows = `
language|言語|언어|Langue|Sprache|Lingua|Язык|भाषा
backToLobby|ロビーへ戻る|로비로 돌아가기|Retour à l’accueil|Zur Spielauswahl|Torna alla raccolta|К списку игр|खेल सूची पर लौटें
backToMenu|ミッションへ戻る|임무로 돌아가기|Retour aux missions|Zu den Missionen|Torna alle missioni|К заданиям|मिशन पर लौटें
backToMain|メインメニューへ戻る|메인 메뉴로 돌아가기|Retour au menu principal|Zum Hauptmenü|Torna al menu principale|В главное меню|मुख्य मेनू पर लौटें
startGame|ゲーム開始|게임 시작|Jouer|Spiel starten|Gioca|Начать игру|खेल शुरू करें
profileLevel|レベル|레벨|Niveau|Stufe|Livello|Уровень|स्तर
profileXp|経験値|경험치|Expérience|Erfahrung|Esperienza|Опыт|अनुभव
profileBest|最高到達ミッション|최고 도달 임무|Meilleure mission|Beste Mission|Migliore missione|Лучшее задание|सर्वश्रेष्ठ मिशन
profileRunes|ルーン|룬|Runes|Runen|Rune|Руны|रूण
heroTrainingTitle|英雄の強化|영웅 강화|Amélioration des héros|Heldenverbesserungen|Potenziamento eroi|Улучшения героев|नायकों के सुधार
heroTrainingHint|ルーンで各英雄を恒久的に強化します。|룬으로 영웅을 영구 강화하세요.|Dépensez des Runes pour améliorer durablement les héros.|Verbessere deine Helden dauerhaft mit Runen.|Spendi Rune per potenziare gli eroi in modo permanente.|Тратьте руны на постоянные улучшения героев.|रूण खर्च करके नायकों को स्थायी रूप से सुधारें।
heroLevel|レベル{level}|레벨 {level}|Niv. {level}|Stufe {level}|Liv. {level}|Ур. {level}|स्तर {level}
heroUpgradeCost|強化 {cost}|강화 {cost}|Améliorer {cost}|Verbessern {cost}|Potenzia {cost}|Улучшить: {cost}|सुधार {cost}
heroUpgradeMax|最大レベル|최대 레벨|Niveau maximal|Höchststufe|Livello massimo|Максимальный уровень|अधिकतम स्तर
lionRole|前衛の攻撃役|전방 공격수|Attaquant de première ligne|Frontkämpfer|Attaccante in prima linea|Передовой боец|अग्रिम हमलावर
owlRole|遠距離攻撃役|원거리 공격수|Attaquant à distance|Fernkämpfer|Attaccante a distanza|Дальний бой|दूर से हमला
 turtleRole|部隊の守り役|분대 수호자|Protecteur de l’escouade|Truppbeschützer|Protettore della squadra|Защитник отряда|दस्ते का रक्षक
missionSelect|ミッション選択|임무 선택|Choisir une mission|Mission wählen|Scegli missione|Выбрать задание|मिशन चुनें
missionHint|解放済みミッションはこのブラウザーに保存されます。|해금한 임무는 이 브라우저에 저장됩니다.|Les missions débloquées sont conservées dans ce navigateur.|Freigeschaltete Missionen bleiben in diesem Browser gespeichert.|Le missioni sbloccate sono salvate in questo browser.|Открытые задания сохраняются в этом браузере.|खुले मिशन इस ब्राउज़र में सहेजे जाते हैं।
missionCard|ミッション{n}|임무 {n}|Mission {n}|Mission {n}|Missione {n}|Задание {n}|मिशन {n}
missionGoal|目標：{enemies}を倒す|목표: {enemies} 처치|Objectif : vaincre {enemies}|Ziel: {enemies} besiegen|Obiettivo: sconfiggi {enemies}|Цель: победить {enemies}|लक्ष्य: {enemies} को हराएँ
missionReward|経験値{xp}／ルーン{runes}|경험치 {xp} / 룬 {runes}|{xp} expérience / {runes} Runes|{xp} Erfahrung / {runes} Runen|{xp} esperienza / {runes} Rune|Опыт: {xp} / Руны: {runes}|{xp} अनुभव / {runes} रूण
missionEnemyLine|敵：{enemies}|적: {enemies}|Ennemis : {enemies}|Gegner: {enemies}|Nemici: {enemies}|Враги: {enemies}|दुश्मन: {enemies}
locked|未解放|잠김|Verrouillée|Gesperrt|Bloccata|Закрыто|बंद
trainingTitle|訓練枠|훈련 슬롯|Emplacement d’entraînement|Trainingsplatz|Slot allenamento|Место тренировки|प्रशिक्षण स्थान
trainingText|恒久効果：各ミッション開始時のエネルギー+1。|영구 효과: 임무 시작 에너지 +1.|Permanent : énergie initiale +1 à chaque mission.|Dauerhaft: +1 Startenergie in jeder Mission.|Permanente: energia iniziale +1 in ogni missione.|Постоянно: +1 энергии в начале каждого задания.|स्थायी: हर मिशन की शुरुआती ऊर्जा +1।
trainingOwned|取得済み：開始時エネルギー+1。|보유: 시작 에너지 +1.|Acquis : énergie initiale +1.|Erworben: +1 Startenergie.|Acquistato: energia iniziale +1.|Получено: +1 начальной энергии.|प्राप्त: शुरुआती ऊर्जा +1।
trainingNeed|ダイヤが{cost}個必要です。|다이아몬드 {cost}개가 필요합니다.|Il faut {cost} Diamants.|Du benötigst {cost} Diamanten.|Servono {cost} Diamanti.|Нужно алмазов: {cost}.|{cost} डायमंड चाहिए।
trainingBuy|{cost}で解放|{cost}에 해금|Débloquer : {cost}|Freischalten: {cost}|Sblocca: {cost}|Открыть за {cost}|{cost} में खोलें
trainingConfirm|もう一度押して恒久的な開始時エネルギー+1を解放。ダイヤ：{before}→{after}。|다시 눌러 영구 시작 에너지 +1을 해금하세요. 다이아몬드 {before} → {after}.|Appuyez encore pour l’énergie initiale permanente +1. Diamants : {before} → {after}.|Erneut drücken für dauerhaft +1 Startenergie. Diamanten: {before} → {after}.|Premi ancora per energia iniziale permanente +1. Diamanti: {before} → {after}.|Нажмите снова для постоянной +1 начальной энергии. Алмазы: {before} → {after}.|स्थायी शुरुआती ऊर्जा +1 के लिए फिर दबाएँ। डायमंड {before} → {after}।
trainingConfirmAction|恒久訓練枠を確定。ダイヤ：{before}から{after}。|영구 훈련 슬롯 확인. 다이아몬드 {before}에서 {after}.|Confirmer l’entraînement permanent. Diamants : {before} à {after}.|Dauerhaften Trainingsplatz bestätigen. Diamanten: {before} auf {after}.|Conferma allenamento permanente. Diamanti: da {before} a {after}.|Подтвердить постоянную тренировку. Алмазы: с {before} до {after}.|स्थायी प्रशिक्षण की पुष्टि करें। डायमंड {before} से {after}।
trainingPurchased|解放：開始時エネルギー+1。ダイヤ：{before}→{after}。|해금: 시작 에너지 +1. 다이아몬드 {before} → {after}.|Débloqué : énergie initiale +1. Diamants : {before} → {after}.|Freigeschaltet: +1 Startenergie. Diamanten: {before} → {after}.|Sbloccato: energia iniziale +1. Diamanti: {before} → {after}.|Открыто: +1 начальной энергии. Алмазы: {before} → {after}.|खुल गया: शुरुआती ऊर्जा +1। डायमंड {before} → {after}।
startMission|ミッション開始|임무 시작|Lancer la mission|Mission starten|Avvia missione|Начать задание|मिशन शुरू करें
mission|ミッション|임무|Mission|Mission|Missione|Задание|मिशन
turn|ターン|턴|Tour|Zug|Turno|Ход|बारी
wallet|ダイヤ|다이아몬드|Diamants|Diamanten|Diamanti|Алмазы|डायमंड
enemiesLeft|敵|적|Ennemis|Gegner|Nemici|Враги|दुश्मन
attack|攻撃|공격|Attaque|Angriff|Attacco|Атака|हमला
guard|ガード|방어|Garde|Schutz|Difesa|Защита|रक्षा
skill|スキル|스킬|Compétence|Fähigkeit|Abilità|Умение|कौशल
endTurn|ターン終了|턴 종료|Fin du tour|Zug beenden|Fine turno|Завершить ход|बारी समाप्त
chooseHero|英雄を選択。1回移動してから1回行動できます。|영웅을 선택하세요. 한 번 이동한 뒤 한 번 행동할 수 있습니다.|Choisissez un héros : un déplacement puis une action.|Wähle einen Helden: einmal bewegen, dann eine Aktion.|Scegli un eroe: un movimento, poi un’azione.|Выберите героя: одно перемещение, затем одно действие.|नायक चुनें। एक बार चलें, फिर एक कार्रवाई करें।
chooseTarget|{hero}：体力{hp}/{maxHp}、エネルギー{energy}。|{hero}: 체력 {hp}/{maxHp}, 에너지 {energy}.|{hero} : santé {hp}/{maxHp}, énergie {energy}.|{hero}: Leben {hp}/{maxHp}, Energie {energy}.|{hero}: salute {hp}/{maxHp}, energia {energy}.|{hero}: здоровье {hp}/{maxHp}, энергия {energy}.|{hero}: स्वास्थ्य {hp}/{maxHp}, ऊर्जा {energy}।
ready|行動可能|준비|Prêt|Bereit|Pronto|Готов|तैयार
acted|行動終了|완료|Terminé|Fertig|Terminato|Завершено|पूर्ण
fallen|戦闘不能|쓰러짐|À terre|Gefallen|Caduto|Пал|पराजित
turnRosterTitle|部隊の行動|분대 행동|Actions de l’escouade|Truppaktionen|Azioni della squadra|Действия отряда|दस्ते की कार्रवाई
skillInfo|スキル：{skill} — {desc}|스킬: {skill} — {desc}|Compétence : {skill} — {desc}|Fähigkeit: {skill} — {desc}|Abilità: {skill} — {desc}|Умение: {skill} — {desc}|कौशल: {skill} — {desc}
skillInfoLabel|スキル|스킬|Compétence|Fähigkeit|Abilità|Умение|कौशल
skillLion|ライオンの跳躍|사자 도약|Bond du lion|Löwensprung|Balzo del leone|Прыжок льва|शेर की छलाँग
skillOwl|ルーン弾|룬 화살|Éclair runique|Runenblitz|Dardo runico|Рунический разряд|रूणी प्रहार
skillTurtle|甲羅の守護|등껍질 수호|Protection de carapace|Panzerschutz|Protezione del guscio|Защита панциря|कवच की रक्षा
skillTurtleDesc|部隊全員を守り、体力を1回復。|분대 전체를 보호하고 체력을 1 회복합니다.|Protège toute l’escouade et rend 1 point de santé.|Schützt den Trupp und heilt 1 Lebenspunkt.|Protegge la squadra e cura 1 punto salute.|Защищает отряд и восстанавливает 1 здоровья.|पूरे दस्ते की रक्षा और 1 स्वास्थ्य की बहाली।
attackValue|攻撃 {value}|공격 {value}|Attaque {value}|Angriff {value}|Attacco {value}|Атака {value}|हमला {value}
guardValue|ガード -1|방어 -1|Garde -1|Schutz -1|Difesa -1|Защита -1|रक्षा -1
guardHelp|次の敵の一撃を1ダメージ軽減。|다음 적의 공격 피해를 1 줄입니다.|Réduit de 1 le prochain coup ennemi.|Verringert den nächsten Gegnertreffer um 1 Schaden.|Riduce di 1 il prossimo colpo nemico.|Снижает урон следующего удара врага на 1.|अगले दुश्मन प्रहार का नुकसान 1 कम।
skillValue|スキル {value}|스킬 {value}|Compétence {value}|Fähigkeit {value}|Abilità {value}|Умение {value}|कौशल {value}
actionTarget|{action}：{target}に{value}ダメージ。|{action}: {target}에게 피해 {value}.|{action} : {value} dégâts à {target}.|{action}: {value} Schaden an {target}.|{action}: {value} danni a {target}.|{action}: {value} урона цели {target}.|{action}: {target} को {value} नुकसान।
skillSquadResult|{skill}：全員を守り、それぞれ体力を最大1回復。|{skill}: 모든 영웅을 보호하고 각각 체력을 최대 1 회복합니다.|{skill} : protège tous les héros et rend jusqu’à 1 santé chacun.|{skill}: schützt alle Helden und heilt jeweils bis zu 1 Leben.|{skill}: protegge tutti e cura fino a 1 salute ciascuno.|{skill}: защита всех героев и лечение до 1 здоровья каждому.|{skill}: सबकी रक्षा और हर नायक का अधिकतम 1 स्वास्थ्य बहाल।
skillEnergyChange|エネルギーを1消費。{energy}から{remaining}。|에너지 1 소비. {energy}에서 {remaining}.|Coûte 1 énergie. {energy} à {remaining}.|Kostet 1 Energie. {energy} auf {remaining}.|Costa 1 energia. Da {energy} a {remaining}.|Расход 1 энергии. С {energy} до {remaining}.|1 ऊर्जा खर्च। {energy} से {remaining}।
skillEnergyNeed|エネルギーが1必要。現在{energy}。|에너지 1 필요. 현재 {energy}.|Nécessite 1 énergie ; actuellement {energy}.|Benötigt 1 Energie; aktuell {energy}.|Serve 1 energia; attuale {energy}.|Нужна 1 энергия; сейчас {energy}.|1 ऊर्जा चाहिए; अभी {energy}।
skillSilenced|沈黙中は使えません。|침묵 중에는 사용할 수 없습니다.|Indisponible sous silence.|Bei Schweigen nicht verfügbar.|Non disponibile sotto silenzio.|Недоступно при безмолвии.|मौन के दौरान उपलब्ध नहीं।
heroTileLabel|{hero}、体力{hp}/{maxHp}、{status}、{row}行{column}列。|{hero}, 체력 {hp}/{maxHp}, {status}, {row}행 {column}열.|{hero}, santé {hp}/{maxHp}, {status}, ligne {row}, colonne {column}.|{hero}, Leben {hp}/{maxHp}, {status}, Zeile {row}, Spalte {column}.|{hero}, salute {hp}/{maxHp}, {status}, riga {row}, colonna {column}.|{hero}, здоровье {hp}/{maxHp}, {status}, ряд {row}, столбец {column}.|{hero}, स्वास्थ्य {hp}/{maxHp}, {status}, पंक्ति {row}, स्तंभ {column}।
enemyTileLabel|{enemy}、体力{hp}/{maxHp}、{row}行{column}列。|{enemy}, 체력 {hp}/{maxHp}, {row}행 {column}열.|{enemy}, santé {hp}/{maxHp}, ligne {row}, colonne {column}.|{enemy}, Leben {hp}/{maxHp}, Zeile {row}, Spalte {column}.|{enemy}, salute {hp}/{maxHp}, riga {row}, colonna {column}.|{enemy}, здоровье {hp}/{maxHp}, ряд {row}, столбец {column}.|{enemy}, स्वास्थ्य {hp}/{maxHp}, पंक्ति {row}, स्तंभ {column}।
moveTileLabel|{row}行{column}列へ移動。|{row}행 {column}열로 이동.|Aller ligne {row}, colonne {column}.|Zu Zeile {row}, Spalte {column} bewegen.|Muovi a riga {row}, colonna {column}.|Перейти: ряд {row}, столбец {column}.|पंक्ति {row}, स्तंभ {column} पर चलें।
emptyTileLabel|{row}行{column}列。|{row}행 {column}열.|Ligne {row}, colonne {column}.|Zeile {row}, Spalte {column}.|Riga {row}, colonna {column}.|Ряд {row}, столбец {column}.|पंक्ति {row}, स्तंभ {column}।
moved|{hero}が移動しました。|{hero} 이동 완료.|{hero} s’est déplacé.|{hero} hat sich bewegt.|{hero} si è mosso.|{hero}: перемещение завершено.|{hero} चला।
attacked|{hero}が{enemy}を攻撃。|{hero}: {enemy} 공격.|{hero} attaque {enemy}.|{hero} greift {enemy} an.|{hero} attacca {enemy}.|{hero} атакует {enemy}.|{hero} ने {enemy} पर हमला किया।
guarded|{hero}がガード。|{hero} 방어.|{hero} se protège.|{hero} schützt sich.|{hero} si difende.|{hero} защищается.|{hero} ने रक्षा की।
skillUsed|{hero}がルーンスキルを使用。|{hero} 룬 스킬 사용.|{hero} utilise une compétence runique.|{hero} nutzt eine Runenfähigkeit.|{hero} usa un’abilità runica.|{hero} применяет руническое умение.|{hero} ने रूणी कौशल इस्तेमाल किया।
enemyTurn|敵が行動中。|적 행동 중.|Les ennemis agissent.|Die Gegner handeln.|I nemici agiscono.|Враги действуют.|दुश्मन कार्रवाई कर रहे हैं।
chooseReward|ルーン報酬を選択|룬 보상 선택|Choisir une récompense runique|Runenbelohnung wählen|Scegli ricompensa runica|Выберите руническую награду|रूण पुरस्कार चुनें
reroll|引き直し 3|다시 뽑기 3|Relancer 3|Neu ziehen 3|Ripesca 3|Перебросить 3|फिर चुनें 3
rerollNeed|引き直しにはダイヤ3個が必要です。|다시 뽑으려면 다이아몬드 3개가 필요합니다.|Il faut 3 Diamants pour relancer.|Zum Neuziehen brauchst du 3 Diamanten.|Servono 3 Diamanti per ripescare.|Для переброса нужны 3 алмаза.|फिर चुनने के लिए 3 डायमंड चाहिए।
missionClear|ミッションクリア|임무 성공|Mission réussie|Mission geschafft|Missione completata|Задание выполнено|मिशन पूरा
missionFailed|ミッション失敗|임무 실패|Mission échouée|Mission gescheitert|Missione fallita|Задание провалено|मिशन असफल
resultWin|ミッション{mission}をクリア。経験値{xp}とルーン{runes}を獲得。|임무 {mission} 성공. 경험치 {xp}, 룬 {runes} 획득.|Mission {mission} réussie : {xp} expérience et {runes} Runes.|Mission {mission} geschafft: {xp} Erfahrung und {runes} Runen.|Missione {mission} completata: {xp} esperienza e {runes} Rune.|Задание {mission} выполнено: {xp} опыта и {runes} рун.|मिशन {mission} पूरा। {xp} अनुभव और {runes} रूण मिले।
resultLose|ミッション{mission}で部隊が倒れました。カメを前衛の近くに置きましょう。|임무 {mission}에서 분대가 쓰러졌습니다. 거북이를 전방 가까이 두세요.|L’escouade est tombée en mission {mission}. Gardez la tortue près du front.|Der Trupp fiel in Mission {mission}. Halte die Schildkröte nahe der Front.|Squadra sconfitta nella missione {mission}. Tieni la tartaruga vicina al fronte.|Отряд пал в задании {mission}. Держите черепаху ближе к передовой.|मिशन {mission} में दस्ता हार गया। कछुए को अग्रिम पंक्ति के पास रखें।
resultPlan|次のミッション計画|다음 임무 계획|Plan de la prochaine mission|Plan für die nächste Mission|Piano per la prossima missione|План следующего задания|अगले मिशन की योजना
planWin|安全な列を選び、1体を集中攻撃し、次の敵に合う報酬を選びましょう。|안전한 위치를 지키고 한 적에 집중하며 다음 적에 맞는 보상을 고르세요.|Restez en sécurité, concentrez les attaques et adaptez la récompense au prochain ennemi.|Bleibe in sicheren Bahnen, konzentriere Angriffe und wähle die passende Belohnung.|Resta al sicuro, concentra gli attacchi e scegli un premio adatto al prossimo nemico.|Займите безопасные позиции, сосредоточьте атаки и выберите награду против следующего врага.|सुरक्षित स्थान रखें, एक दुश्मन पर ध्यान दें और अगले खतरे के अनुसार पुरस्कार चुनें।
planLose|敵ターン前にガードし、カメを前に置き、1体ずつ倒しましょう。|적 턴 전에 방어하고 거북이를 앞에 두며 한 적씩 처치하세요.|Gardez avant le tour ennemi, placez la tortue devant et éliminez une cible à la fois.|Schütze dich vor dem Gegnerzug, stelle die Schildkröte nach vorn und besiege ein Ziel nach dem anderen.|Difendi prima del turno nemico, metti la tartaruga davanti ed elimina un bersaglio alla volta.|Защищайтесь перед ходом врага, держите черепаху впереди и добивайте одну цель за раз.|दुश्मन की बारी से पहले रक्षा करें, कछुए को आगे रखें और एक-एक लक्ष्य हराएँ।
nextMission|次のミッション|다음 임무|Mission suivante|Nächste Mission|Missione successiva|Следующее задание|अगला मिशन
retry|再挑戦|다시 시도|Réessayer|Wiederholen|Riprova|Повторить|फिर कोशिश करें
menu|ミッションへ戻る|임무로 돌아가기|Retour aux missions|Zu den Missionen|Torna alle missioni|К заданиям|मिशन पर लौटें
lion|ライオンの守護者|사자 수호자|Lion gardien|Löwenwächter|Leone guardiano|Лев-страж|शेर रक्षक
owl|フクロウの魔術師|부엉이 마법사|Chouette mage|Eulenmagier|Gufo mago|Сова-маг|उल्लू जादूगर
turtle|カメの盾兵|거북이 방패병|Tortue bouclier|Schildkrötenschild|Tartaruga scudo|Черепаха-щит|कछुआ ढाल
wolf|影のオオカミ|그림자 늑대|Loup d’ombre|Schattenwolf|Lupo d’ombra|Теневой волк|छाया भेड़िया
raven|水晶のカラス|수정 큰까마귀|Corbeau de cristal|Kristallrabe|Corvo di cristallo|Кристальный ворон|स्फटिक कौआ
stag|石のシカ|돌 사슴|Cerf de pierre|Steinhirsch|Cervo di pietra|Каменный олень|पत्थरीला हिरण
rewardPower|力のルーン|힘의 룬|Rune de puissance|Kraftrune|Runa del potere|Руна силы|शक्ति रूण
rewardPowerDesc|英雄の攻撃力+1。|영웅 공격력 +1.|Attaque des héros +1.|Heldenangriff +1.|Attacco degli eroi +1.|Атака героев +1.|नायकों का हमला +1।
rewardGuard|守護のメダル|수호 메달|Médaille de protection|Wächtermünze|Medaglia del guardiano|Медаль стража|रक्षक पदक
rewardGuardDesc|全英雄の最大体力+1。|모든 영웅 최대 체력 +1.|Santé maximale de tous les héros +1.|Maximales Leben aller Helden +1.|Salute massima di tutti gli eroi +1.|Максимальное здоровье всех героев +1.|सभी नायकों का अधिकतम स्वास्थ्य +1।
rewardShard|ルーンのかけら|룬 조각|Éclat runique|Runensplitter|Frammento runico|Осколок руны|रूण अंश
rewardShardDesc|ミッション後に経験値+35。|임무 후 경험치 +35.|Expérience +35 après la mission.|Nach der Mission +35 Erfahrung.|Esperienza +35 dopo la missione.|После задания +35 опыта.|मिशन के बाद +35 अनुभव।
rewardRevive|復活トークン|부활 토큰|Jeton de résurrection|Wiederbelebungsmarke|Gettone di rinascita|Жетон возрождения|पुनर्जीवन टोकन
rewardReviveDesc|復活トークンを1個保存。今後の戦闘で倒れた英雄が自動復活します。|부활 토큰 1개 저장. 이후 전투에서 쓰러진 영웅이 자동 부활합니다.|Conserve un jeton : un héros tombé revivra automatiquement lors d’un futur combat.|Speichert eine Marke: Ein gefallener Held wird in einem späteren Kampf automatisch belebt.|Conserva un gettone: un eroe caduto rinasce automaticamente in un combattimento futuro.|Сохраняет жетон: павший герой автоматически воскреснет в будущем бою.|एक टोकन सहेजें। भविष्य की लड़ाई में गिरा नायक अपने-आप लौटेगा।
rewardFocus|集中のルーン|집중 룬|Rune de concentration|Fokusrune|Runa della concentrazione|Руна сосредоточения|एकाग्रता रूण
rewardFocusDesc|次のミッションの開始時エネルギー+1。|다음 임무 시작 에너지 +1.|Énergie initiale +1 à la prochaine mission.|Nächste Mission: +1 Startenergie.|Energia iniziale +1 alla prossima missione.|В следующем задании +1 начальной энергии.|अगले मिशन की शुरुआती ऊर्जा +1।
missionPlan|作戦：{plan}|계획: {plan}|Plan : {plan}|Plan: {plan}|Piano: {plan}|План: {plan}|योजना: {plan}
missionTactic1|2体のオオカミで基本配置を学びます。|늑대 둘을 상대로 기본 위치 선정을 익히세요.|Apprenez le placement contre deux loups.|Lerne Positionierung gegen zwei Wölfe.|Impara il posizionamento contro due lupi.|Изучите расстановку против двух волков.|दो भेड़ियों के विरुद्ध स्थिति सीखें।
missionTactic2|遠距離攻撃のカラスからフクロウを守ります。|원거리 까마귀로부터 부엉이를 보호하세요.|Protégez la chouette du corbeau à distance.|Schütze die Eule vor dem Fernkampfraben.|Proteggi il gufo dal corvo a distanza.|Защитите сову от дальних атак ворона.|दूर से मारने वाले कौए से उल्लू को बचाएँ।
missionTactic3|護衛を倒してからシカのボスを集中攻撃。|호위병을 처치한 뒤 사슴 보스를 집중 공격하세요.|Éliminez les gardes puis concentrez les attaques sur le cerf.|Besiege die Wachen, dann konzentriere dich auf den Hirschboss.|Elimina le guardie, poi concentra gli attacchi sul cervo.|Уберите охрану, затем атакуйте босса-оленя.|रक्षकों को हटाकर हिरण बॉस पर ध्यान दें।
missionTactic4|2体のカラスが撃つ前にカメのガードを使用。|까마귀 둘이 공격하기 전에 거북이 방어를 쓰세요.|Utilisez la garde de la tortue avant les tirs des deux corbeaux.|Nutze den Schildkrötenschutz vor den Schüssen der zwei Raben.|Usa la difesa della tartaruga prima dei due corvi.|Используйте защиту черепахи до залпа двух воронов.|दो कौओं के हमले से पहले कछुए की रक्षा करें।
missionTactic5|長期戦：エネルギーを管理して集中攻撃。|장기전: 에너지를 관리하고 공격을 집중하세요.|Combat long : gérez l’énergie et concentrez les attaques.|Langer Kampf: Energie verwalten und Angriffe bündeln.|Battaglia lunga: gestisci energia e concentra gli attacchi.|Долгий бой: берегите энергию и сосредоточьте атаки.|लंबी लड़ाई: ऊर्जा सँभालें और लक्ष्य पर ध्यान दें।
missionTactic6|ボスの圧力：シカ2体とカラスの攻撃に耐えます。|보스 압박: 사슴 둘과 까마귀 공격을 버티세요.|Résistez aux deux cerfs et aux tirs du corbeau.|Überstehe zwei Hirsche und Rabenfeuer.|Resisti a due cervi e al fuoco del corvo.|Переживите двух оленей и обстрел ворона.|दो हिरणों और कौए के हमलों से बचें।
missionStatusCurrent|選択中|선택됨|Sélectionnée|Ausgewählt|Selezionata|Выбрано|चयनित
missionStatusUnlocked|押して選択|눌러 선택|Appuyer pour choisir|Zum Wählen tippen|Tocca per scegliere|Нажмите для выбора|चुनने के लिए दबाएँ
missionRewardLabel|クリア報酬|성공 보상|Récompense de victoire|Siegesbelohnung|Ricompensa vittoria|Награда за победу|जीत का पुरस्कार
startSelectedMission|ミッション{n}開始|임무 {n} 시작|Lancer la mission {n}|Mission {n} starten|Avvia missione {n}|Начать задание {n}|मिशन {n} शुरू करें
progressionTitle|恒久成長|영구 성장|Progression permanente|Dauerhafter Fortschritt|Crescita permanente|Постоянный рост|स्थायी प्रगति
progressionLevelLine|部隊レベル{level}／次のレベルまで経験値{xp}|분대 레벨 {level} / 다음 레벨까지 경험치 {xp}|Escouade niv. {level} / {xp} expérience avant le niveau suivant|Truppstufe {level} / {xp} Erfahrung bis zur nächsten Stufe|Squadra liv. {level} / {xp} esperienza al prossimo livello|Уровень отряда {level} / до следующего уровня {xp} опыта|दस्ता स्तर {level} / अगले स्तर तक {xp} अनुभव
progressionHeroLine|強化：ライオン{lion}、フクロウ{owl}、カメ{turtle}|강화: 사자 {lion}, 부엉이 {owl}, 거북이 {turtle}|Héros : lion niv. {lion}, chouette niv. {owl}, tortue niv. {turtle}|Helden: Löwe Stufe {lion}, Eule {owl}, Schildkröte {turtle}|Eroi: leone liv. {lion}, gufo {owl}, tartaruga {turtle}|Герои: лев ур. {lion}, сова {owl}, черепаха {turtle}|नायक: शेर स्तर {lion}, उल्लू {owl}, कछुआ {turtle}
progressionBonusLine|保存効果：攻撃+{atk}、体力+{hp}、エネルギー+{energy}、復活{revives}|저장 효과: 공격 +{atk}, 체력 +{hp}, 에너지 +{energy}, 부활 {revives}|Bonus : attaque +{atk}, santé +{hp}, énergie +{energy}, résurrections {revives}|Boni: Angriff +{atk}, Leben +{hp}, Energie +{energy}, Wiederbelebungen {revives}|Bonus: attacco +{atk}, salute +{hp}, energia +{energy}, rinascite {revives}|Бонусы: атака +{atk}, здоровье +{hp}, энергия +{energy}, возрождения {revives}|लाभ: हमला +{atk}, स्वास्थ्य +{hp}, ऊर्जा +{energy}, पुनर्जीवन {revives}
progressionNextUpgrade|次の強化：{hero}はあとルーン{cost}個が必要。|다음 강화: {hero}에게 룬 {cost}개가 더 필요합니다.|Prochaine amélioration : il manque {cost} Runes à {hero}.|Nächste Verbesserung: {hero} braucht noch {cost} Runen.|Prossimo potenziamento: a {hero} mancano {cost} Rune.|Для улучшения {hero} нужно ещё {cost} рун.|अगला सुधार: {hero} को {cost} और रूण चाहिए।
heroGrowthStats|恒久：体力+{hp}／攻撃+{atk}|영구: 체력 +{hp} / 공격 +{atk}|Permanent : santé +{hp} / attaque +{atk}|Dauerhaft: Leben +{hp} / Angriff +{atk}|Permanente: salute +{hp} / attacco +{atk}|Постоянно: здоровье +{hp} / атака +{atk}|स्थायी: स्वास्थ्य +{hp} / हमला +{atk}
heroNextStats|次のレベル{level}：体力+{hp}／攻撃+{atk}|다음 레벨 {level}: 체력 +{hp} / 공격 +{atk}|Niv. {level} suivant : santé +{hp} / attaque +{atk}|Nächste Stufe {level}: Leben +{hp} / Angriff +{atk}|Prossimo liv. {level}: salute +{hp} / attacco +{atk}|Следующий ур. {level}: здоровье +{hp} / атака +{atk}|अगला स्तर {level}: स्वास्थ्य +{hp} / हमला +{atk}
heroUpgradeNeed|あとルーン{need}個が必要|룬 {need}개 더 필요|Il manque {need} Runes|Noch {need} Runen nötig|Mancano {need} Rune|Нужно ещё {need} рун|{need} और रूण चाहिए
heroUpgradeReady|強化可能|강화 가능|Amélioration disponible|Verbesserung bereit|Potenziamento disponibile|Можно улучшить|सुधार उपलब्ध
rewardPermanent|恒久成長|영구 성장|Croissance permanente|Dauerhaftes Wachstum|Crescita permanente|Постоянный рост|स्थायी वृद्धि
reviveTriggered|{hero}が復活トークンで戦闘に復帰。|{hero}이 부활 토큰으로 전투에 복귀했습니다.|{hero} revient au combat grâce à un jeton de résurrection.|{hero} kehrt mit einer Wiederbelebungsmarke zurück.|{hero} torna in battaglia con un gettone di rinascita.|{hero} вернулся в бой с жетоном возрождения.|{hero} पुनर्जीवन टोकन से लड़ाई में लौटा।
resultProgressTitle|保存された進行|저장된 진행|Progression sauvegardée|Gespeicherter Fortschritt|Progressi salvati|Сохранённый прогресс|सहेजी प्रगति
resultRewardChosen|報酬保存：{reward} — {effect}|보상 저장: {reward} — {effect}|Récompense sauvegardée : {reward} — {effect}|Belohnung gespeichert: {reward} — {effect}|Premio salvato: {reward} — {effect}|Награда сохранена: {reward} — {effect}|पुरस्कार सहेजा: {reward} — {effect}
resultRewardNone|今回はルーン報酬を保存していません。|이번 시도에는 룬 보상이 저장되지 않았습니다.|Aucune récompense runique sauvegardée cet essai.|In diesem Versuch wurde keine Runenbelohnung gespeichert.|Nessun premio runico salvato in questo tentativo.|В этой попытке руническая награда не сохранена.|इस कोशिश में रूण पुरस्कार नहीं सहेजा गया।
resultProgressLine|部隊レベル{level}・経験値{xp}/100・ルーン{runes}・最高ミッション{best}|분대 레벨 {level} · 경험치 {xp}/100 · 룬 {runes} · 최고 임무 {best}|Escouade niv. {level} · expérience {xp}/100 · {runes} Runes · meilleure mission {best}|Truppstufe {level} · Erfahrung {xp}/100 · {runes} Runen · beste Mission {best}|Squadra liv. {level} · esperienza {xp}/100 · {runes} Rune · migliore missione {best}|Отряд ур. {level} · опыт {xp}/100 · руны {runes} · лучшее задание {best}|दस्ता स्तर {level} · अनुभव {xp}/100 · {runes} रूण · सर्वश्रेष्ठ मिशन {best}
resultMissionUnlocked|ミッション{mission}を解放。|임무 {mission} 해금.|Mission {mission} débloquée.|Mission {mission} freigeschaltet.|Missione {mission} sbloccata.|Задание {mission} открыто.|मिशन {mission} खुल गया।
resultMissionReady|ミッション{mission}は引き続き選択可能。|임무 {mission}은 계속 선택할 수 있습니다.|La mission {mission} reste disponible.|Mission {mission} bleibt verfügbar.|La missione {mission} resta disponibile.|Задание {mission} остаётся доступным.|मिशन {mission} उपलब्ध है।
resultCampaignComplete|全30ミッションをクリア。すべて再挑戦できます。|임무 30개 모두 완료. 모든 임무를 다시 할 수 있습니다.|Les 30 missions sont terminées et restent rejouables.|Alle 30 Missionen sind geschafft und wiederholbar.|Tutte le 30 missioni sono completate e rigiocabili.|Все 30 заданий пройдены и доступны для повтора.|सभी 30 मिशन पूरे। हर मिशन फिर खेल सकते हैं।
resultUpgradeReady|{hero}は英雄画面で強化できます。|영웅 화면에서 {hero} 강화 가능.|{hero} peut être amélioré dans Héros.|{hero} kann unter Helden verbessert werden.|Puoi potenziare {hero} nella sezione Eroi.|{hero} можно улучшить в разделе героев.|नायक अनुभाग में {hero} का सुधार उपलब्ध है।
resultUpgradeNeed|{hero}の強化にはあとルーン{need}個。|{hero} 강화에 룬 {need}개 더 필요.|Il manque {need} Runes pour améliorer {hero}.|{hero} braucht noch {need} Runen zur Verbesserung.|A {hero} mancano {need} Rune per il potenziamento.|Для улучшения {hero} нужно ещё {need} рун.|{hero} को सुधारने के लिए {need} और रूण चाहिए।
enemyTraits|特性：{traits}|특성: {traits}|Traits : {traits}|Eigenschaften: {traits}|Tratti: {traits}|Свойства: {traits}|विशेषताएँ: {traits}
traitWolf|群れの牙|무리의 송곳니|Croc de meute|Rudelzahn|Zanna del branco|Клык стаи|झुंड का दाँत
traitWolfShort|群れ|무리|Meute|Rudel|Branco|Стая|झुंड
traitWolfDesc|別のオオカミに隣接するとダメージ+1。|다른 늑대 옆에 있으면 피해 +1.|Dégâts +1 à côté d’un autre loup.|Neben einem anderen Wolf +1 Schaden.|Danni +1 accanto a un altro lupo.|Рядом с другим волком урон +1.|दूसरे भेड़िए के पास होने पर नुकसान +1।
traitRaven|弱点の視線|약점 감지|Vue des faiblesses|Schwachstellenblick|Vista delle debolezze|Взор слабости|कमजोरी की दृष्टि
traitRavenShort|狩り|사냥|Chasse|Jagd|Caccia|Охота|शिकार
traitRavenDesc|最も体力が低い英雄を狙います。|체력이 가장 낮은 영웅을 노립니다.|Vise le héros ayant le moins de santé.|Zielt auf den Helden mit dem wenigsten Leben.|Mira all’eroe con meno salute.|Выбирает героя с наименьшим здоровьем.|सबसे कम स्वास्थ्य वाले नायक को निशाना बनाता है।
traitStag|石の皮|돌가죽|Peau de pierre|Steinhaut|Pelle di pietra|Каменная шкура|पत्थरीली त्वचा
traitStagShort|装甲|장갑|Armure|Rüstung|Armatura|Броня|कवच
traitStagDesc|各プレイヤーターンの最初の一撃を1軽減。|각 플레이어 턴의 첫 피해를 1 줄입니다.|Réduit de 1 le premier coup de chaque tour du joueur.|Verringert den ersten Treffer jedes Spielerzugs um 1.|Riduce di 1 il primo colpo di ogni turno del giocatore.|Снижает первый удар каждого хода игрока на 1.|खिलाड़ी की हर बारी का पहला प्रहार 1 कम।
wolfPackHit|群れの牙：{enemy}のダメージ+1。|무리의 송곳니: {enemy} 피해 +1.|Croc de meute : {enemy} inflige +1 dégât.|Rudelzahn: {enemy} verursacht +1 Schaden.|Zanna del branco: {enemy} infligge +1 danno.|Клык стаи: {enemy} наносит +1 урона.|झुंड का दाँत: {enemy} ने +1 नुकसान किया।
ravenWeakHit|弱点の視線：{enemy}が最も弱った英雄を攻撃。|약점 감지: {enemy}이 가장 약한 영웅을 공격.|Vue des faiblesses : {enemy} vise le héros le plus faible.|Schwachstellenblick: {enemy} jagt den schwächsten Helden.|Vista delle debolezze: {enemy} colpisce l’eroe più debole.|Взор слабости: {enemy} атакует слабейшего героя.|कमजोरी की दृष्टि: {enemy} ने सबसे कमजोर नायक को निशाना बनाया।
stagArmorHit|石の皮が{hero}のダメージを1軽減。|돌가죽이 {hero}의 피해를 1 감소.|Peau de pierre réduit les dégâts de {hero} de 1.|Steinhaut verringert den Schaden von {hero} um 1.|Pelle di pietra riduce di 1 i danni di {hero}.|Каменная шкура снижает урон от {hero} на 1.|पत्थरीली त्वचा ने {hero} का नुकसान 1 कम किया।
stageTabMissions|ミッション|임무|Missions|Missionen|Missioni|Задания|मिशन
stageTabHeroes|英雄|영웅|Héros|Helden|Eroi|Герои|नायक
stageTabTraining|訓練|훈련|Entraînement|Training|Allenamento|Тренировка|प्रशिक्षण
pause|一時停止|일시정지|Pause|Pause|Pausa|Пауза|विराम
pauseTitle|戦闘を一時停止中|전투 일시정지|Combat en pause|Kampf pausiert|Combattimento in pausa|Бой приостановлен|युद्ध रुका है
pauseHint|再開するまで敵ターンと待機中の行動を停止します。|계속할 때까지 적 턴과 대기 중인 행동이 멈춥니다.|Le tour ennemi et les actions en attente restent figés jusqu’à la reprise.|Gegnerzug und wartende Aktionen bleiben bis zum Fortsetzen eingefroren.|Il turno nemico e le azioni in attesa restano fermi fino alla ripresa.|Ход врага и ожидающие действия заморожены до продолжения.|जारी रखने तक दुश्मन की बारी और लंबित कार्रवाइयाँ रुकी रहेंगी।
resume|再開|계속|Reprendre|Fortsetzen|Riprendi|Продолжить|जारी रखें
pauseMenu|ミッションへ戻る|임무로 돌아가기|Retour aux missions|Zu den Missionen|Torna alle missioni|К заданиям|मिशन पर लौटें
battleDetails|戦闘の詳細|전투 정보|Détails du combat|Kampfdetails|Dettagli del combattimento|Сведения о бое|युद्ध विवरण
endTurnDecision|ターン終了。{count}人が行動可能：{heroes}。次は敵が行動します。|턴 종료. 아직 {count}명 행동 가능: {heroes}. 다음은 적 턴입니다.|Fin du tour. {count} héros prêts : {heroes}. Les ennemis agiront ensuite.|Zug beenden. Noch {count} Helden bereit: {heroes}. Danach handeln die Gegner.|Fine turno. {count} eroi pronti: {heroes}. Poi agiranno i nemici.|Завершить ход. Готовы ещё {count} героев: {heroes}. Далее действуют враги.|बारी समाप्त। {count} नायक अभी तैयार: {heroes}। अब दुश्मन कार्रवाई करेंगे।
endTurnDecisionNone|ターン終了。生存英雄は全員行動済み。次は敵が行動します。|턴 종료. 살아 있는 모든 영웅이 행동했습니다. 다음은 적 턴입니다.|Fin du tour. Tous les héros vivants ont agi. Les ennemis agiront ensuite.|Zug beenden. Alle lebenden Helden haben gehandelt. Danach sind die Gegner dran.|Fine turno. Tutti gli eroi vivi hanno agito. Poi agiranno i nemici.|Завершить ход. Все живые герои действовали. Далее действуют враги.|बारी समाप्त। सभी जीवित नायक कार्रवाई कर चुके हैं। अब दुश्मन चलेंगे।
boar|イバラのイノシシ|가시 멧돼지|Sanglier épineux|Dorneneber|Cinghiale spinoso|Шипастый кабан|काँटेदार सूअर
runeFox|ルーンのキツネ|룬 여우|Renard runique|Runenfuchs|Volpe runica|Руническая лиса|रूणी लोमड़ी
tideTurtle|潮のカメ|밀물 거북이|Tortue des marées|Gezeitenschildkröte|Tartaruga delle maree|Приливная черепаха|ज्वारीय कछुआ
heron|遺跡のサギ|유적 왜가리|Héron des reliques|Reliktreiher|Airone delle reliquie|Цапля реликвий|अवशेष बगुला
salamander|残り火のサラマンダー|불씨 도롱뇽|Salamandre de braise|Glutsalamander|Salamandra ardente|Угольная саламандра|अंगारा सैलामैंडर
ram|火種のヒツジ|잿불 숫양|Bélier de cendre|Aschewidder|Ariete di cenere|Пепельный баран|राख मेढ़ा
moth|月のガ|달 나방|Phalène lunaire|Mondmotte|Falena lunare|Лунный мотылёк|चंद्र पतंगा
archiveOwl|書庫のフクロウ|서고 부엉이|Chouette des archives|Archiveule|Gufo degli archivi|Архивная сова|अभिलेख उल्लू
mirrorWolf|鏡のオオカミ|거울 늑대|Loup miroir|Spiegelwolf|Lupo specchio|Зеркальный волк|दर्पण भेड़िया
sealRaven|封印のカラス|봉인 까마귀|Corbeau des sceaux|Siegelrabe|Corvo dei sigilli|Ворон печатей|मुहर कौआ
rhinoBoss|鉄根のサイ|철뿌리 코뿔소|Rhinocéros aux racines de fer|Eisenwurzelnashorn|Rinoceronte delle radici di ferro|Носорог железных корней|लोहे की जड़ों वाला गैंडा
serpentBoss|沼の大蛇|늪 코일 뱀|Serpent des marécages|Sumpfschlinge|Serpente delle paludi|Болотный змей|दलदली सर्प
emberLionBoss|炎のたてがみのライオン|불꽃 갈기 사자|Lion à crinière de braise|Glutmähnenlöwe|Leone dalla criniera ardente|Лев с огненной гривой|अग्नि-अयाल शेर
griffinBoss|日食のグリフォン|일식 그리핀|Griffon de l’éclipse|Finsternisgreif|Grifone dell’eclissi|Грифон затмения|ग्रहण ग्रिफिन
chimeraBoss|ルーン王冠のキマイラ|룬 왕관 키메라|Chimère à couronne runique|Runenkronenchimäre|Chimera della corona runica|Химера рунической короны|रूणी मुकुट काइमेरा
traitBoar|イバラの反撃|가시 반격|Riposte épineuse|Dornenkonter|Contrattacco spinoso|Шипастый ответ|काँटों का पलटवार
traitBoarShort|反撃|반격|Riposte|Konter|Contrattacco|Ответ|पलटवार
traitBoarDesc|隣接する英雄の攻撃後、1ダメージを返します。|인접한 영웅에게 맞으면 피해 1을 되돌려 줍니다.|Renvoie 1 dégât après un coup d’un héros adjacent.|Gibt nach einem Treffer eines benachbarten Helden 1 Schaden zurück.|Restituisce 1 danno dopo un colpo di un eroe adiacente.|Возвращает 1 урона после удара соседнего героя.|पास के नायक के प्रहार के बाद 1 नुकसान लौटाता है।
traitRuneFox|キツネの瞬歩|여우 순간걸음|Pas du renard|Fuchsschritt|Passo della volpe|Лисий шаг|लोमड़ी की छलाँग
traitRuneFoxShort|転移|순간이동|Téléportation|Teleport|Teletrasporto|Перенос|स्थानांतरण
traitRuneFoxDesc|行動後、最も弱った英雄の背後へ転移。|행동 후 가장 약한 영웅 뒤로 순간이동합니다.|Se téléporte derrière le héros le plus faible après son action.|Teleportiert sich nach der Aktion hinter den schwächsten Helden.|Si teletrasporta dietro l’eroe più debole dopo l’azione.|После действия переносится за слабейшего героя.|कार्रवाई के बाद सबसे कमजोर नायक के पीछे पहुँचती है।
traitTideTurtle|甲羅の護送|등껍질 호위|Convoi de carapaces|Panzergeleit|Scorta del guscio|Панцирный конвой|कवच का अनुरक्षण
traitTideTurtleShort|守護|보호|Protection|Schutz|Protezione|Охрана|सुरक्षा
traitTideTurtleDesc|最も近い味方を一撃だけ守ります。|가장 가까운 아군을 한 번의 공격으로부터 보호합니다.|Protège l’allié le plus proche contre un coup.|Schützt den nächsten Verbündeten für einen Treffer.|Protegge l’alleato più vicino da un colpo.|Защищает ближайшего союзника от одного удара.|सबसे पास के साथी को एक प्रहार से बचाता है।
traitHeron|流れの翼|해류 날개|Aile du courant|Strömungsflügel|Ala della corrente|Крыло течения|धारा के पंख
traitHeronShort|押す|밀치기|Poussée|Schieben|Spinta|Толчок|धक्का
traitHeronDesc|攻撃した英雄を移動可能な隣の1マスへ押します。|공격한 영웅을 이동 가능한 한 칸으로 밀칩니다.|Pousse le héros touché d’une case autorisée.|Schiebt den getroffenen Helden um ein erlaubtes Feld.|Spinge l’eroe colpito di una casella valida.|Отталкивает героя на одну допустимую клетку.|जिस नायक को मारे उसे एक वैध खाना धकेलता है।
traitSalamander|残り火の道|불씨 흔적|Trace de braise|Glutspur|Scia ardente|Огненный след|अंगारों का निशान
traitSalamanderShort|炎|화염|Feu|Brand|Fuoco|Ожог|आग
traitSalamanderDesc|移動後にダメージを与える炎のマスを残します。|이동 후 피해를 주는 화염 칸을 남깁니다.|Laisse une case brûlante après son déplacement.|Hinterlässt nach Bewegung ein schädliches Brandfeld.|Lascia una casella ardente dopo il movimento.|После движения оставляет опасную горящую клетку.|चलने के बाद नुकसान देने वाला जलता खाना छोड़ता है।
traitRam|直線突進|직선 돌진|Charge en ligne|Gerader Ansturm|Carica in linea|Прямой таран|सीधा धावा
traitRamShort|突進|돌진|Charge|Ansturm|Carica|Таран|धावा
traitRamDesc|英雄が見えると直線上を突進。|영웅이 보이면 일직선으로 돌진합니다.|Charge en ligne droite lorsqu’il voit un héros.|Stürmt geradeaus, sobald ein Held sichtbar ist.|Carica in linea retta quando vede un eroe.|Увидев героя, атакует по прямой.|नायक दिखने पर सीधी रेखा में धावा बोलता है।
traitMoth|月の粉|달 가루|Poussière lunaire|Mondstaub|Polvere lunare|Лунная пыль|चंद्र धूल
traitMothShort|沈黙|침묵|Silence|Schweigen|Silenzio|Безмолвие|मौन
traitMothDesc|攻撃を受けた英雄は次のスキルを使えません。|맞은 영웅의 다음 스킬을 막습니다.|Son coup bloque la prochaine compétence du héros.|Der Treffer sperrt die nächste Fähigkeit des Helden.|Il colpo blocca la prossima abilità dell’eroe.|Удар блокирует следующее умение героя.|प्रहार नायक का अगला कौशल रोकता है।
traitArchiveOwl|見張りの印|감시자 표식|Marque du veilleur|Wächtermarke|Marchio del custode|Метка наблюдателя|प्रहरी का निशान
traitArchiveOwlShort|印|표식|Marque|Marke|Marchio|Метка|निशान
traitArchiveOwlDesc|英雄に印を付け、次の遠距離ダメージを+1。|영웅을 표시해 다음 원거리 피해를 1 늘립니다.|Marque un héros : le prochain coup à distance inflige +1 dégât.|Markiert einen Helden: nächster Fernkampftreffer +1 Schaden.|Marchia un eroe: il prossimo colpo a distanza infligge +1 danno.|Помечает героя: следующий дальний удар наносит +1 урона.|नायक को चिह्नित कर अगले दूर के प्रहार में +1 नुकसान जोड़ता है।
traitMirrorWolf|鏡の分身|거울 분신|Division miroir|Spiegelteilung|Divisione speculare|Зеркальное раздвоение|दर्पण विभाजन
traitMirrorWolfShort|分身|분신|Clone|Klon|Clone|Клон|प्रतिरूप
traitMirrorWolfDesc|隣のマスに体力1の分身を1体作ります。|인접한 칸에 체력 1의 분신 하나를 만듭니다.|Crée un clone adjacent avec 1 point de santé.|Erzeugt einen benachbarten Klon mit 1 Leben.|Crea un clone adiacente con 1 salute.|Создаёт рядом одного клона с 1 здоровьем.|पास में 1 स्वास्थ्य वाला एक प्रतिरूप बनाता है।
traitSealRaven|封印の吸収|봉인 흡수|Drain du sceau|Siegelentzug|Assorbimento del sigillo|Поглощение печати|मुहर का अवशोषण
traitSealRavenShort|吸収|흡수|Drain|Entzug|Assorbimento|Поглощение|अवशोषण
traitSealRavenDesc|攻撃した英雄からエネルギーを1奪います。|공격한 영웅의 에너지를 1 빼앗습니다.|Retire 1 énergie au héros touché.|Entzieht dem getroffenen Helden 1 Energie.|Sottrae 1 energia all’eroe colpito.|Отнимает 1 энергию у поражённого героя.|जिस नायक को मारे उससे 1 ऊर्जा छीनता है।
traitRhinoBoss|鉄根の突撃|철뿌리 돌격|Ruée des racines de fer|Eisenwurzelansturm|Assalto delle radici di ferro|Натиск железных корней|लोहे की जड़ों का धावा
traitRhinoBossShort|ボス|보스|Boss|Boss|Boss|Босс|बॉस
traitRhinoBossDesc|身構えて横列を突進し、道を塞ぐ瓦礫を残します。|방어 자세 후 가로줄로 돌진하고 길을 막는 잔해를 남깁니다.|Se prépare, charge une rangée et laisse des débris bloquants.|Stützt sich ab, stürmt eine Reihe entlang und hinterlässt Trümmer.|Si prepara, carica una fila e lascia macerie che bloccano il percorso.|Готовится, таранит ряд и оставляет непроходимые обломки.|तैयार होकर पंक्ति में धावा बोलता और रास्ता रोकने वाला मलबा छोड़ता है।
traitSerpentBoss|沼のうず|늪 소용돌이|Enroulement des marais|Sumpfwindung|Spira della palude|Болотный виток|दलदली कुंडली
traitSerpentBossShort|ボス|보스|Boss|Boss|Boss|Босс|बॉस
traitSerpentBossDesc|縦列を浸水させて引き寄せます。同じターンに2人から攻撃されないと再生します。|세로줄에 물을 채워 끌어당깁니다. 한 턴에 두 영웅에게 맞지 않으면 재생합니다.|Inonde et attire une colonne ; se régénère sans deux attaquants dans le même tour.|Flutet und zieht eine Spalte; regeneriert ohne zwei Angreifer im selben Zug.|Allaga e attira una colonna; si rigenera senza due attaccanti nello stesso turno.|Затопляет и стягивает столбец; лечится без двух атакующих за один ход.|स्तंभ में पानी भरकर खींचता है; एक बारी में दो हमलावर न लगें तो स्वास्थ्य लौटाता है।
traitEmberLionBoss|炎の循環|불꽃 순환|Cycle de braise|Glutzyklus|Ciclo ardente|Огненный цикл|अंगारा चक्र
traitEmberLionBossShort|ボス|보스|Boss|Boss|Boss|Босс|बॉस
traitEmberLionBossDesc|咆哮と跳躍を交互に行い、負傷すると追加行動。|포효와 도약을 번갈아 쓰며 다치면 추가 행동합니다.|Alterne rugissement, bond et actions supplémentaires lorsqu’il est blessé.|Wechselt zwischen Brüllen, Sprung und verwundeten Zusatzaktionen.|Alterna ruggito, balzo e azioni extra quando è ferito.|Чередует рёв, прыжок и дополнительные действия при ранении.|दहाड़ और छलाँग बदलता है; घायल होने पर अतिरिक्त कार्रवाई करता है।
traitGriffinBoss|日食の飛行|일식 비행|Vol de l’éclipse|Finsternisflug|Volo dell’eclissi|Полёт затмения|ग्रहण की उड़ान
traitGriffinBossShort|ボス|보스|Boss|Boss|Boss|Босс|बॉस
traitGriffinBossDesc|飛行中の遠距離無効と、着地後の薙ぎ払いを切り替えます。|비행 중 원거리 면역과 착지 후 휩쓸기를 번갈아 사용합니다.|Alterne immunité aux tirs en vol et balayages au sol.|Wechselt zwischen Fernkampfimmunität im Flug und Bodenschwüngen.|Alterna immunità a distanza in volo e spazzate a terra.|Чередует защиту от дальних атак в полёте и наземные взмахи.|उड़ते समय दूर के हमलों की प्रतिरक्षा और जमीन पर व्यापक प्रहार बदलता है।
traitChimeraBoss|六重の王冠|여섯 겹 왕관|Couronne sextuple|Sechsfache Krone|Corona sestupla|Шестикратная корона|छह गुना मुकुट
traitChimeraBossShort|最終|최종|Final|Finale|Finale|Финал|अंतिम
traitChimeraBossDesc|表示された段階で突進、洪水、炎、飛行、分身召喚を切り替えます。|표시된 단계에 따라 돌진, 홍수, 화염, 비행, 분신 소환을 바꿉니다.|Change de phase : charge, inondation, feu, vol et invocation de clones.|Wechselt sichtbar zwischen Ansturm, Flut, Brand, Flug und Klonbeschwörung.|Alterna carica, alluvione, fuoco, volo e cloni nelle fasi mostrate.|В указанных фазах чередует таран, потоп, огонь, полёт и клонов.|दिखाए चरणों में धावा, बाढ़, आग, उड़ान और प्रतिरूप बुलाना बदलता है।
terrainRubble|瓦礫|잔해|Débris|Trümmer|Macerie|Обломки|मलबा
terrainSnare|根の罠|뿌리 덫|Racines entravantes|Wurzelfalle|Radici bloccanti|Корневая ловушка|जड़ों का जाल
terrainTide|潮流|밀물|Marée|Gezeiten|Marea|Прилив|ज्वार
terrainBurn|炎|화염|Feu|Brand|Fuoco|Огонь|आग
terrainCooling|冷却ルーン|냉각 룬|Rune de refroidissement|Kühlrune|Runa del freddo|Руна охлаждения|शीतल रूण
terrainOrbit|軌道ルーン|궤도 룬|Rune orbitale|Orbitrune|Runa orbitale|Орбитальная руна|कक्षीय रूण
terrainSeal|ルーン封印|룬 봉인|Sceau runique|Runensiegel|Sigillo runico|Руническая печать|रूणी मुहर
tileTerrainLabel|{terrain}。{tile}|{terrain}. {tile}|{terrain}. {tile}|{terrain}. {tile}|{terrain}. {tile}|{terrain}. {tile}|{terrain}। {tile}
silenceBlocked|月の粉が{hero}のスキルを封じました。|달 가루가 {hero}의 스킬을 막았습니다.|La poussière lunaire bloque la compétence de {hero}.|Mondstaub hat die Fähigkeit von {hero} gesperrt.|La polvere lunare blocca l’abilità di {hero}.|Лунная пыль заблокировала умение {hero}.|चंद्र धूल ने {hero} का कौशल रोक दिया।
terrainBurnHit|炎が{hero}に1ダメージ。|화염이 {hero}에게 피해 1.|Le feu inflige 1 dégât à {hero}.|Brand fügt {hero} 1 Schaden zu.|Il fuoco infligge 1 danno a {hero}.|Огонь наносит {hero} 1 урона.|आग ने {hero} को 1 नुकसान दिया।
terrainCoolingUsed|{hero}が冷却ルーンでエネルギーを1回復。|{hero}이 냉각 룬에서 에너지 1 회복.|{hero} récupère 1 énergie sur une rune de refroidissement.|{hero} stellt auf einer Kühlrune 1 Energie wieder her.|{hero} recupera 1 energia su una runa del freddo.|{hero} восстановил 1 энергию на руне охлаждения.|{hero} ने शीतल रूण पर 1 ऊर्जा लौटाई।
boarCounterHit|イバラの反撃が{hero}に1ダメージを返しました。|가시 반격이 {hero}에게 피해 1을 되돌렸습니다.|La riposte épineuse renvoie 1 dégât à {hero}.|Dornenkonter gibt {hero} 1 Schaden zurück.|Il contrattacco spinoso restituisce 1 danno a {hero}.|Шипастый ответ вернул {hero} 1 урона.|काँटों के पलटवार ने {hero} को 1 नुकसान लौटाया।
turtleGuarded|甲羅の護送が{enemy}を守りました。|등껍질 호위가 {enemy}을 보호했습니다.|Le convoi de carapaces protège {enemy}.|Panzergeleit schützt {enemy}.|La scorta del guscio protegge {enemy}.|Панцирный конвой защитил {enemy}.|कवच अनुरक्षण ने {enemy} की रक्षा की।
heronPushed|流れの翼が{hero}を押しました。|해류 날개가 {hero}을 밀었습니다.|L’aile du courant pousse {hero}.|Strömungsflügel schiebt {hero}.|L’ala della corrente spinge {hero}.|Крыло течения оттолкнуло {hero}.|धारा के पंखों ने {hero} को धकेला।
foxTeleported|キツネの瞬歩が{hero}の背後へ移動。|여우 순간걸음이 {hero} 뒤로 이동.|Le pas du renard se place derrière {hero}.|Fuchsschritt bewegt sich hinter {hero}.|Il passo della volpe si porta dietro {hero}.|Лисий шаг переместился за {hero}.|लोमड़ी {hero} के पीछे पहुँची।
ramCharged|直線突進が{hero}を攻撃。|직선 돌진이 {hero}을 공격.|La charge en ligne frappe {hero}.|Gerader Ansturm trifft {hero}.|La carica in linea colpisce {hero}.|Прямой таран ударил {hero}.|सीधे धावे ने {hero} को मारा।
mothSilenced|月の粉が{hero}を沈黙にしました。|달 가루가 {hero}을 침묵시켰습니다.|La poussière lunaire réduit {hero} au silence.|Mondstaub bringt {hero} zum Schweigen.|La polvere lunare silenzia {hero}.|Лунная пыль наложила безмолвие на {hero}.|चंद्र धूल ने {hero} को मौन किया।
owlMarked|見張りの印が{hero}を狙いました。|감시자 표식이 {hero}을 지정.|La marque du veilleur cible {hero}.|Wächtermarke zielt auf {hero}.|Il marchio del custode prende di mira {hero}.|Метка наблюдателя выбрала {hero}.|प्रहरी के निशान ने {hero} को चुना।
ravenDrained|封印の吸収が{hero}からエネルギーを1奪いました。|봉인 흡수가 {hero}의 에너지를 1 빼앗았습니다.|Le drain du sceau retire 1 énergie à {hero}.|Siegelentzug nimmt {hero} 1 Energie.|L’assorbimento del sigillo toglie 1 energia a {hero}.|Поглощение печати забрало у {hero} 1 энергию.|मुहर ने {hero} की 1 ऊर्जा सोखी।
mirrorCloned|鏡の分身が体力1の分身を作成。|거울 분신이 체력 1인 분신 생성.|La division miroir crée un clone avec 1 santé.|Spiegelteilung erzeugt einen Klon mit 1 Leben.|La divisione speculare crea un clone con 1 salute.|Зеркальное раздвоение создало клона с 1 здоровьем.|दर्पण विभाजन ने 1 स्वास्थ्य का प्रतिरूप बनाया।
bossPhase|{boss}が段階{phase}へ移行。|{boss}이 {phase}단계 진입.|{boss} passe à la phase {phase}.|{boss} beginnt Phase {phase}.|{boss} entra nella fase {phase}.|{boss} переходит в фазу {phase}.|{boss} चरण {phase} में पहुँचा।
boardLabel|ルーン戦術の盤面|룬 전술 보드|Plateau de tactique runique|Runentaktik-Brett|Tabellone di tattica runica|Поле рунической тактики|रूण रणनीति का बोर्ड
positioned|移動済み|이동 완료|Positionné|Positioniert|Posizionato|На позиции|स्थिति में
moveReady|{hero}は移動後も行動できます。|{hero}은 이동 후에도 행동할 수 있습니다.|{hero} s’est déplacé et peut encore agir.|{hero} hat sich bewegt und kann noch handeln.|{hero} si è mosso e può ancora agire.|{hero} переместился и ещё может действовать.|{hero} चल चुका है और अभी कार्रवाई कर सकता है।
moveThenActHint|1回移動してから攻撃・ガード・スキル。|한 번 이동한 뒤 공격, 방어 또는 스킬.|Déplacez-vous une fois, puis attaquez, gardez ou utilisez une compétence.|Einmal bewegen, dann angreifen, schützen oder Fähigkeit nutzen.|Muoviti una volta, poi attacca, difendi o usa un’abilità.|Одно перемещение, затем атака, защита или умение.|एक बार चलें, फिर हमला, रक्षा या कौशल करें।
runeChain|ルーン連鎖×{count}：ダメージ+{bonus}！|룬 연계 ×{count}: 피해 +{bonus}!|Chaîne runique ×{count} : dégâts +{bonus} !|Runenkette ×{count}: +{bonus} Schaden!|Catena runica ×{count}: danni +{bonus}!|Цепь рун ×{count}: урон +{bonus}!|रूण शृंखला ×{count}: +{bonus} नुकसान!
runeChainHint|{enemy}を集中攻撃：次の味方の一撃はダメージ+{bonus}。|{enemy} 집중: 다음 분대 공격 피해 +{bonus}.|Concentrez sur {enemy} : prochain coup allié +{bonus} dégâts.|Fokus auf {enemy}: nächster Trupptreffer +{bonus} Schaden.|Concentrati su {enemy}: prossimo colpo della squadra +{bonus} danni.|Сосредоточьтесь на {enemy}: следующий удар отряда +{bonus} урона.|{enemy} पर ध्यान दें: दस्ते के अगले प्रहार में +{bonus} नुकसान।
runeChainReady|1体を集中攻撃してルーン連鎖を開始。|한 적에 집중해 룬 연계를 시작하세요.|Concentrez les attaques pour lancer une chaîne runique.|Starte eine Runenkette durch konzentrierte Angriffe.|Concentra gli attacchi per avviare una catena runica.|Начните цепь рун, сосредоточившись на одном враге.|एक दुश्मन पर ध्यान देकर रूण शृंखला शुरू करें।
battlePreview|ミッション説明|임무 브리핑|Briefing de mission|Missionsbesprechung|Briefing della missione|Описание задания|मिशन विवरण
squadRule|部隊のルール|분대 규칙|Règle de l’escouade|Truppregel|Regola della squadra|Правило отряда|दस्ते का नियम
`.trim();
  const seen = new Set();
  for (const line of rows.split('\n')) {
    const [rawKey, ...values] = line.split('|');
    const key = rawKey.trim();
    if (!key || seen.has(key) || values.length !== locales.length || values.some(v => !v.trim())) throw new Error(`Invalid Rune locale row: ${key}`);
    seen.add(key);
    locales.forEach((code, i) => { data[code][key] = values[i]; });
  }
  Object.assign(data, {"es": {"battleDetails": "Detalles de la batalla"}, "pt-BR": {"resultWin": "Missão {mission} concluída. Você ganhou {xp} de experiência e {runes} Runas.", "resultLose": "A equipe caiu na missão {mission}. Mantenha a tartaruga perto da linha de frente.", "planWin": "Mantenha posições seguras, concentre os ataques e escolha uma recompensa adequada ao próximo inimigo.", "planLose": "Defenda antes do turno inimigo, mantenha a tartaruga na frente e concentre os ataques em um alvo.", "rewardReviveDesc": "Guarde um token de reviver. Um herói caído revive automaticamente em um combate futuro.", "rewardFocusDesc": "+1 de energia inicial na próxima missão.", "missionTactic1": "Aprenda o posicionamento básico contra dois lobos.", "missionTactic2": "Proteja a coruja de um corvo que ataca à distância.", "missionTactic3": "Elimine os guardas antes de concentrar os ataques no cervo chefe.", "missionTactic4": "Use a defesa da tartaruga antes que dois corvos ataquem.", "missionTactic5": "Combate longo: administre a energia e concentre os ataques.", "missionTactic6": "Pressão dos chefes: sobreviva a dois cervos e aos ataques do corvo.", "wolfPackHit": "Presa da matilha: {enemy} causou +1 de dano.", "ravenWeakHit": "Visão da fraqueza: {enemy} atacou o herói mais fraco.", "stagArmorHit": "Pele de pedra reduziu em 1 o dano de {hero}."}});
  window.WeightPlayRuneTacticsNativeCopy = Object.freeze(Object.fromEntries(Object.entries(data).map(([code, copy]) => [code, Object.freeze(copy)])));
})();
