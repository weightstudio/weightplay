// Locale-owned Text Growth 1.4.0 search copy and gameplay labels. Claims are
// limited to the shipped 30-route campaign, wave schedule, combat loop, and
// permanent room upgrades.
export const COPY = Object.freeze({
  en: {
    description: "Plan ricochet shots through 30 fortress routes, protect the crystal core across 3–10 waves, counter distinct enemies, and improve four rooms with saved Star Stones.",
    tags: ["Ricochet Aiming", "Wave Defense", "Roguelite Upgrades"],
    faq: [
      ["What is the goal of a route?", "Protect the crystal core through the displayed waves. Clearing the final wave saves the route, awards Star Stones, and unlocks the next route."],
      ["How many waves are in a route?", "Routes 1–4 have three waves, ordinary routes after the first checkpoint have five, and Boss routes have 4–10 waves."],
      ["How do ricochets work?", "Aim from the keeper and release one orb. Wall and obstacle contacts use its rebound allowance; enemy hits do not. The orb disappears after its last allowed contact."],
      ["Do I need Diamonds to finish the campaign?", "No. Diamonds only reroll a wave's three blessing choices, with a confirmation step. They are optional."],
      ["What progress is saved?", "This browser stores the best unlocked route, Star Stones, play count, and levels for Orb Forge, Core Shield, Companion Den, and Scout Tower."],
    ],
  },
  "zh-Hant": {
    description: "規劃反彈射擊，挑戰 30 條要塞路線；在 3 至 10 波攻勢中守護水晶核心，應對不同敵人，並用星石強化四間要塞房間。",
    tags: ["反彈瞄準", "波次防守", "Roguelite 強化"],
    faq: [
      ["每條路線的目標是什麼？", "守住水晶核心，撐過畫面顯示的所有波次。完成最後一波後會記錄路線、獲得星石並解鎖下一條路線。"],
      ["每條路線有幾波？", "路線 1–4 各有三波；首個檢查點後的普通路線有五波；首領路線則有 4 至 10 波。"],
      ["反彈如何運作？", "從守衛處瞄準並放出一顆星珠。牆面和障礙物碰撞會消耗反彈次數；命中敵人不會。用完次數後星珠會消失。"],
      ["完成戰役一定要用鑽石嗎？", "不用。鑽石只用來重抽一波的三個祝福選項，並需確認；這是可選功能。"],
      ["哪些進度會儲存？", "此瀏覽器會儲存最高解鎖路線、星石、遊玩次數，以及星珠熔爐、核心護盾、夥伴巢穴和偵察塔的等級。"],
    ],
  },
  "zh-Hans": {
    description: "规划反弹射击，挑战 30 条要塞路线；在 3 至 10 波攻势中守护水晶核心，应对不同敌人，并用星石强化四间要塞房间。",
    tags: ["反弹瞄准", "波次防守", "Roguelite 强化"],
    faq: [
      ["每条路线的目标是什么？", "守住水晶核心，撑过画面显示的所有波次。完成最后一波后会记录路线、获得星石并解锁下一条路线。"],
      ["每条路线有几波？", "路线 1–4 各有三波；首个检查点后的普通路线有五波；首领路线则有 4 至 10 波。"],
      ["反弹如何运作？", "从守卫处瞄准并发射一颗星珠。墙面和障碍物碰撞会消耗反弹次数；命中敌人不会。用完次数后星珠会消失。"],
      ["完成战役一定要用钻石吗？", "不用。钻石只用于重抽一波的三个祝福选项，并需要确认；这是可选功能。"],
      ["哪些进度会保存？", "此浏览器会保存最高解锁路线、星石、游玩次数，以及星珠熔炉、核心护盾、伙伴巢穴和侦察塔的等级。"],
    ],
  },
  ja: {
    description: "反射ショットを計画して要塞の30ルートに挑戦。3～10ウェーブから水晶コアを守り、多彩な敵に対処しながら星石で4つの部屋を強化します。",
    tags: ["反射ショット", "ウェーブ防衛", "ローグライト強化"],
    faq: [
      ["ルートの目的は何ですか？", "表示されたウェーブをすべて乗り切り、水晶コアを守ります。最終ウェーブをクリアするとルートが記録され、星石を獲得して次のルートが解放されます。"],
      ["各ルートは何ウェーブですか？", "ルート1～4は3ウェーブ、最初の節目以降の通常ルートは5ウェーブ、ボスルートは4～10ウェーブです。"],
      ["反射はどう機能しますか？", "キーパーから狙いを定めてオーブを1つ発射します。壁や障害物への接触で反射回数を使い、敵への命中では消費しません。回数を使い切るとオーブは消えます。"],
      ["キャンペーンのクリアにダイヤは必要ですか？", "いいえ。ダイヤはウェーブ中の3つの祝福候補を再抽選するためだけに使い、確認操作が必要です。使用は任意です。"],
      ["どの進行状況が保存されますか？", "このブラウザーには最高解放ルート、星石、プレイ回数、オーブ鍛冶場・コアシールド・仲間の巣・偵察塔のレベルが保存されます。"],
    ],
  },
  ko: {
    description: "반사 사격을 계획해 요새 30개 경로에 도전하세요. 3~10개 웨이브에서 수정 코어를 지키고, 다양한 적에 대응하며 별석으로 방 네 곳을 강화합니다.",
    tags: ["반사 조준", "웨이브 방어", "로그라이트 강화"],
    faq: [
      ["경로의 목표는 무엇인가요?", "표시된 웨이브를 모두 버티며 수정 코어를 지키세요. 마지막 웨이브를 클리어하면 경로가 저장되고 별석을 얻으며 다음 경로가 열립니다."],
      ["경로마다 웨이브가 몇 개인가요?", "1~4번 경로는 3개, 첫 체크포인트 이후 일반 경로는 5개, 보스 경로는 4~10개입니다."],
      ["반사는 어떻게 작동하나요?", "수호자에게서 조준해 오브 하나를 발사하세요. 벽이나 장애물에 닿으면 반사 횟수를 쓰지만 적중은 횟수를 쓰지 않습니다. 허용 횟수를 다 쓰면 오브가 사라집니다."],
      ["캠페인을 끝내는 데 다이아가 필요한가요?", "아니요. 다이아는 웨이브 중 축복 선택지 세 개를 다시 뽑을 때만 쓰이며 확인이 필요합니다. 선택 사항입니다."],
      ["어떤 진행 상황이 저장되나요?", "이 브라우저에는 최고 해금 경로, 별석, 플레이 횟수와 오브 대장간·코어 방패·동료의 둥지·정찰탑 레벨이 저장됩니다."],
    ],
  },
  es: {
    description: "Planifica disparos con rebotes en 30 rutas, protege el núcleo de cristal durante 3–10 oleadas, responde a distintos enemigos y mejora cuatro salas con Piedras Estelares.",
    tags: ["Apuntado con rebotes", "Defensa por oleadas", "Mejoras roguelite"],
    faq: [
      ["¿Cuál es el objetivo de una ruta?", "Protege el núcleo de cristal durante todas las oleadas indicadas. Al superar la última, se registra la ruta, recibes Piedras Estelares y se desbloquea la siguiente."],
      ["¿Cuántas oleadas tiene una ruta?", "Las rutas 1–4 tienen tres; las rutas normales después del primer punto de control tienen cinco; las rutas de Jefe tienen de 4 a 10."],
      ["¿Cómo funcionan los rebotes?", "Apunta desde el guardián y lanza un orbe. Los contactos con paredes y obstáculos consumen sus rebotes; los impactos contra enemigos no. El orbe desaparece al agotar los rebotes."],
      ["¿Necesito Diamantes para terminar la campaña?", "No. Los Diamantes solo permiten volver a elegir entre las tres bendiciones de una oleada, tras confirmar. Son opcionales."],
      ["¿Qué progreso se guarda?", "Este navegador guarda la ruta más alta desbloqueada, las Piedras Estelares, las partidas y los niveles de Forja de Orbes, Escudo del Núcleo, Guarida y Torre de Exploración."],
    ],
  },
  "pt-BR": {
    description: "Planeje disparos com ricochetes em 30 rotas, proteja o núcleo de cristal por 3 a 10 ondas, enfrente inimigos distintos e aprimore quatro salas com Pedras Estelares.",
    tags: ["Mira com ricochetes", "Defesa por ondas", "Melhorias roguelite"],
    faq: [
      ["Qual é o objetivo de uma rota?", "Proteja o núcleo de cristal por todas as ondas exibidas. Ao vencer a última, a rota é salva, você recebe Pedras Estelares e a próxima rota é liberada."],
      ["Quantas ondas há em uma rota?", "As rotas 1–4 têm três; rotas comuns após o primeiro marco têm cinco; rotas de Chefe têm de 4 a 10 ondas."],
      ["Como funcionam os ricochetes?", "Mire a partir do guardião e lance um orbe. Contatos com paredes e obstáculos consomem ricochetes; acertar inimigos não. O orbe desaparece ao gastar todos os ricochetes permitidos."],
      ["Preciso de Diamantes para concluir a campanha?", "Não. Diamantes servem apenas para sortear novamente as três bênçãos de uma onda, com confirmação. O uso é opcional."],
      ["Qual progresso fica salvo?", "Este navegador salva a rota mais alta liberada, Pedras Estelares, partidas e níveis da Forja de Orbes, Escudo do Núcleo, Toca dos Companheiros e Torre de Batedores."],
    ],
  },
  fr: {
    description: "Planifiez des tirs par ricochet sur 30 parcours, protégez le cœur de cristal pendant 3 à 10 vagues, contrez des ennemis variés et améliorez quatre salles avec des pierres stellaires.",
    tags: ["Visée par ricochet", "Défense par vagues", "Améliorations roguelite"],
    faq: [
      ["Quel est l’objectif d’un parcours ?", "Protégez le cœur de cristal pendant toutes les vagues affichées. La dernière vague terminée enregistre le parcours, rapporte des pierres stellaires et débloque le suivant."],
      ["Combien de vagues compte un parcours ?", "Les parcours 1 à 4 en comptent trois, les parcours ordinaires après le premier palier cinq, et les parcours de Boss de 4 à 10."],
      ["Comment fonctionnent les ricochets ?", "Visez depuis le gardien puis lancez un orbe. Les contacts avec les murs et obstacles consomment les rebonds; toucher un ennemi n’en consomme pas. L’orbe disparaît au dernier contact autorisé."],
      ["Les Diamants sont-ils nécessaires pour terminer la campagne ?", "Non. Ils servent uniquement à relancer les trois choix de bénédiction d’une vague, après confirmation. C’est facultatif."],
      ["Quelle progression est sauvegardée ?", "Ce navigateur conserve le parcours débloqué le plus avancé, les pierres stellaires, le nombre de parties et les niveaux des quatre salles."],
    ],
  },
  de: {
    description: "Plane Abprallschüsse auf 30 Festungsrouten, schütze den Kristallkern über 3 bis 10 Wellen, kontere verschiedene Gegner und verbessere vier Räume mit Sternsteinen.",
    tags: ["Zielen mit Abprallern", "Wellenverteidigung", "Roguelite-Verbesserungen"],
    faq: [
      ["Was ist das Ziel einer Route?", "Schütze den Kristallkern vor allen angezeigten Wellen. Nach der letzten Welle wird die Route gespeichert, du erhältst Sternsteine und die nächste Route wird freigeschaltet."],
      ["Wie viele Wellen hat eine Route?", "Routen 1–4 haben drei Wellen, normale Routen nach dem ersten Kontrollpunkt fünf und Bossrouten 4 bis 10."],
      ["Wie funktionieren Abpraller?", "Ziele vom Hüter aus und feuere eine Kugel ab. Kontakte mit Wänden und Hindernissen verbrauchen Abpraller; Treffer auf Gegner nicht. Nach dem letzten erlaubten Kontakt verschwindet die Kugel."],
      ["Brauche ich Diamanten für den Abschluss?", "Nein. Diamanten würfeln nur die drei Segen einer Welle neu und erfordern eine Bestätigung. Das ist optional."],
      ["Welche Fortschritte werden gespeichert?", "Dieser Browser speichert die höchste freigeschaltete Route, Sternsteine, Spielanzahl und die Stufen von Orb-Schmiede, Kernschutz, Gefährtenbau und Spähturm."],
    ],
  },
  it: {
    description: "Pianifica tiri di rimbalzo in 30 percorsi, proteggi il nucleo di cristallo per 3–10 ondate, affronta nemici diversi e potenzia quattro stanze con le Pietre Stellari.",
    tags: ["Mira con rimbalzi", "Difesa a ondate", "Potenziamenti roguelite"],
    faq: [
      ["Qual è l’obiettivo di un percorso?", "Proteggi il nucleo di cristallo da tutte le ondate indicate. Dopo l’ultima, il percorso viene salvato, ricevi Pietre Stellari e si sblocca quello successivo."],
      ["Quante ondate ci sono in un percorso?", "I percorsi 1–4 hanno tre ondate, quelli normali dopo il primo checkpoint ne hanno cinque e i percorsi Boss da 4 a 10."],
      ["Come funzionano i rimbalzi?", "Mira dal custode e lancia una sfera. I contatti con pareti e ostacoli consumano i rimbalzi; colpire i nemici no. La sfera scompare all’ultimo contatto consentito."],
      ["Servono Diamanti per finire la campagna?", "No. I Diamanti servono solo a ripetere la scelta tra le tre benedizioni di un’ondata, dopo una conferma. Sono facoltativi."],
      ["Quali progressi vengono salvati?", "Questo browser salva il percorso sbloccato più avanzato, le Pietre Stellari, le partite e i livelli delle quattro stanze."],
    ],
  },
  ru: {
    description: "Планируйте рикошетные выстрелы на 30 маршрутах, защищайте кристальное ядро в 3–10 волнах, противодействуйте разным врагам и улучшайте четыре комнаты за звёздные камни.",
    tags: ["Прицеливание с рикошетом", "Защита от волн", "Улучшения roguelite"],
    faq: [
      ["Какова цель маршрута?", "Защитите кристальное ядро от всех указанных волн. После последней волны маршрут сохранится, вы получите звёздные камни и откроете следующий маршрут."],
      ["Сколько волн в маршруте?", "На маршрутах 1–4 по три волны, на обычных после первой контрольной точки — по пять, а на маршрутах с Боссом — от 4 до 10."],
      ["Как работают рикошеты?", "Прицельтесь от хранителя и выпустите один шар. Контакты со стенами и препятствиями расходуют отскоки, попадания по врагам — нет. После последнего разрешённого контакта шар исчезает."],
      ["Нужны ли алмазы для прохождения кампании?", "Нет. Алмазы нужны только для повторного выбора одного из трёх благословений волны, после подтверждения. Это необязательно."],
      ["Какой прогресс сохраняется?", "Браузер хранит самый дальний открытый маршрут, звёздные камни, число игр и уровни четырёх комнат."],
    ],
  },
  hi: {
    description: "30 किले के मार्गों में उछाल वाले शॉट की योजना बनाएँ, 3–10 लहरों तक क्रिस्टल कोर बचाएँ, अलग-अलग दुश्मनों का सामना करें और स्टार स्टोन से चार कमरे बेहतर करें।",
    tags: ["उछाल से निशाना", "लहरों से रक्षा", "रॉगुलाइट उन्नयन"],
    faq: [
      ["मार्ग का लक्ष्य क्या है?", "दिखाई गई सभी लहरों तक क्रिस्टल कोर की रक्षा करें। आखिरी लहर जीतने पर मार्ग सेव होता है, स्टार स्टोन मिलते हैं और अगला मार्ग खुलता है।"],
      ["एक मार्ग में कितनी लहरें होती हैं?", "मार्ग 1–4 में तीन लहरें, पहले चेकपॉइंट के बाद सामान्य मार्गों में पाँच, और बॉस मार्गों में 4 से 10 लहरें होती हैं।"],
      ["उछाल कैसे काम करता है?", "रक्षक के पास से निशाना लगाकर एक ऑर्ब छोड़ें। दीवार और बाधा से टकराने पर उछाल की गिनती घटती है; दुश्मन से टकराने पर नहीं। आखिरी तय टक्कर के बाद ऑर्ब गायब हो जाता है।"],
      ["क्या अभियान पूरा करने के लिए डायमंड चाहिए?", "नहीं। डायमंड केवल लहर के तीन आशीर्वाद विकल्प फिर से चुनने के लिए हैं और पुष्टि माँगते हैं। यह वैकल्पिक है।"],
      ["कौन-सी प्रगति सेव होती है?", "यह ब्राउज़र सबसे आगे खुला मार्ग, स्टार स्टोन, खेलों की संख्या और चार कमरों के स्तर सेव करता है।"],
    ],
  },
  ar: {
    description: "خطط لطلقات مرتدة عبر 30 مسارًا في الحصن، واحمِ القلب البلوري خلال 3 إلى 10 موجات، وواجه أعداء متنوعين، وطوّر أربع غرف بأحجار النجوم.",
    tags: ["التصويب بالارتداد", "دفاع الموجات", "ترقيات روغلايك"],
    faq: [
      ["ما هدف المسار؟", "احمِ القلب البلوري طوال الموجات المعروضة. عند إكمال الموجة الأخيرة يُحفظ المسار وتكسب أحجار النجوم ويُفتح المسار التالي."],
      ["كم موجة في كل مسار؟", "تضم المسارات 1–4 ثلاث موجات، وتضم المسارات العادية بعد أول نقطة تحقق خمسًا، أما مسارات الزعماء فتضم من 4 إلى 10 موجات."],
      ["كيف يعمل الارتداد؟", "صوّب من الحارس وأطلق كرة واحدة. تستهلك ملامسة الجدران والعوائق عدد الارتدادات، أما إصابة الأعداء فلا تستهلكه. تختفي الكرة بعد آخر ملامسة مسموحة."],
      ["هل أحتاج إلى الألماس لإكمال الحملة؟", "لا. يُستخدم الألماس فقط لإعادة اختيار إحدى البركات الثلاث للموجة بعد التأكيد؛ وهذا اختياري."],
      ["ما التقدم الذي يُحفظ؟", "يحفظ هذا المتصفح أبعد مسار مفتوح، وأحجار النجوم، وعدد مرات اللعب، ومستويات الغرف الأربع."],
    ],
  },
});
