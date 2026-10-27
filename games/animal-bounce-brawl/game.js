/* Bounce Brawl: authoritative fixed-step combat, shared UI, owned 3D scene. */
const $ = id => document.getElementById(id);
const GAME_ID = 'animal-bounce-brawl';
const POSTER = '/assets/interface7-redrawn/animal-bounce-brawl.webp';
let THREE, importFailure;
const engineReady = import('/games/animal-skyspire-drop/vendor/three/three.module.min.js').then(module => { THREE = module; }).catch(error => { importFailure = error; });
// Chapter 2 remains closed until its data, localization, save/reward contract,
// visual acceptance and real play have all been integrated and reviewed.
const RELAY_CHAPTER_READY = false;
let relayGateContact = null, relayGateHint = null, relayChapter = null, relayCandidatePromise = null;
function prepareRelayCandidate(){
  if(!RELAY_CHAPTER_READY)return Promise.resolve(false);
  if(!relayCandidatePromise)relayCandidatePromise=import('./relay-chapter-candidate.mjs?v=20261027-bounce-relay-candidate3').then(module=>{relayGateContact=module.relayGateContact;relayGateHint=module.relayGateHint;relayChapter=module.RELAY_CHAPTER;return Array.isArray(relayChapter)&&relayChapter.length===30;}).catch(()=>false);
  return relayCandidatePromise;
}
  const COPY = {
    en: { hint: "Hold ◀/▶ to move closer, HOP to jump, then BOUNCE to strike.", help: "Battle help", tooFar: "Too far — move closer before the next bump.", approach: "Distance: {distance}px · {state}", ready: "BOUNCE ready", close: "Hold ◀/▶ to close", bestWins: "Best wins: {best}", selected: "Selected tool:", BUMP: "BUMP", SPRING: "SPRING", PAD: "PAD", HOP: "HOP", BOUNCE: "BOUNCE" },
    "zh-Hant": { hint: "按住 ◀/▶ 靠近對手，按「跳躍」起跳，再按「彈跳」撞擊。", help: "鬥場說明", tooFar: "距離太遠——請先靠近，再進行下一次撞擊。", approach: "距離：{distance}px・{state}", ready: "可以彈跳", close: "按住 ◀/▶ 靠近", bestWins: "最佳勝場：{best}", selected: "目前工具：", BUMP: "撞擊", SPRING: "彈簧", PAD: "泡棉墊", HOP: "跳躍", BOUNCE: "彈跳" },
    "zh-Hans": { hint: "按住 ◀/▶ 靠近对手，按「跳跃」起跳，再按「弹跳」撞击。", help: "竞技场说明", tooFar: "距离太远——请先靠近，再进行下一次撞击。", approach: "距离：{distance}px・{state}", ready: "可以弹跳", close: "按住 ◀/▶ 靠近", bestWins: "最佳胜场：{best}", selected: "当前工具：", BUMP: "撞击", SPRING: "弹簧", PAD: "泡棉垫", HOP: "跳跃", BOUNCE: "弹跳" },
    ja: { hint: "◀/▶を長押しして近づき、「ジャンプ」で跳び、「バウンス」で攻撃します。", help: "バトルヘルプ", tooFar: "遠すぎます。次のバンプの前に近づいてください。", approach: "距離：{distance}px・{state}", ready: "バウンス可能", close: "◀/▶を長押しして接近", bestWins: "最高勝利数：{best}", selected: "選択中のツール：", BUMP: "バンプ", SPRING: "スプリング", PAD: "パッド", HOP: "ジャンプ", BOUNCE: "バウンス" },
    ko: { hint: "◀/▶를 길게 눌러 가까이 간 뒤 점프하고 BOUNCE로 공격하세요.", help: "배틀 도움말", tooFar: "너무 멉니다. 다음 범프 전에 가까이 가세요.", approach: "거리: {distance}px · {state}", ready: "바운스 가능", close: "◀/▶를 길게 눌러 가까이 가세요", bestWins: "최고 승리: {best}", selected: "선택한 도구:", BUMP: "범프", SPRING: "스프링", PAD: "패드", HOP: "점프", BOUNCE: "바운스" },
    es: { hint: "Mantén ◀/▶ para acercarte, SALTA y pulsa REBOTE para golpear.", help: "Ayuda de batalla", tooFar: "Demasiado lejos: acércate antes del próximo empujón.", approach: "Distancia: {distance}px · {state}", ready: "REBOTE listo", close: "Mantén ◀/▶ para acercarte", bestWins: "Mejor marca de victorias: {best}", selected: "Herramienta seleccionada:", BUMP: "EMPUJÓN", SPRING: "MUELLE", PAD: "ALMOHADILLA", HOP: "SALTAR", BOUNCE: "REBOTE" },
    "pt-BR": { hint: "Segure ◀/▶ para se aproximar, use PULAR e toque em SALTO para atacar.", help: "Ajuda da batalha", tooFar: "Muito longe: aproxime-se antes do próximo impacto.", approach: "Distância: {distance}px · {state}", ready: "SALTO pronto", close: "Segure ◀/▶ para se aproximar", bestWins: "Melhor marca de vitórias: {best}", selected: "Ferramenta selecionada:", BUMP: "IMPACTO", SPRING: "MOLA", PAD: "ALMOFADA", HOP: "PULAR", BOUNCE: "SALTO" },
    fr: { hint: "Maintenez ◀/▶ pour approcher, SAUTEZ, puis utilisez REBOND pour frapper.", help: "Aide du combat", tooFar: "Trop loin : rapprochez-vous avant la prochaine bousculade.", approach: "Distance : {distance}px · {state}", ready: "REBOND prêt", close: "Maintenez ◀/▶ pour vous rapprocher", bestWins: "Meilleur total de victoires : {best}", selected: "Outil sélectionné :", BUMP: "BOUSCULADE", SPRING: "RESSORT", PAD: "COUSSIN", HOP: "SAUTER", BOUNCE: "REBOND" },
    de: { hint: "Halte ◀/▶, um näher zu kommen, HÜPFE und drücke dann SPRUNG zum Stoß.", help: "Kampfhilfe", tooFar: "Zu weit weg – komme vor dem nächsten Stoß näher.", approach: "Abstand: {distance}px · {state}", ready: "SPRUNG bereit", close: "Halte ◀/▶, um näher zu kommen", bestWins: "Beste Siege: {best}", selected: "Ausgewähltes Werkzeug:", BUMP: "STOSS", SPRING: "FEDER", PAD: "POLSTER", HOP: "HÜPFEN", BOUNCE: "SPRUNG" },
    it: { hint: "Tieni premuto ◀/▶ per avvicinarti, SALTA e poi usa RIMBALZO per colpire.", help: "Aiuto battaglia", tooFar: "Troppo lontano: avvicinati prima del prossimo urto.", approach: "Distanza: {distance}px · {state}", ready: "RIMBALZO pronto", close: "Tieni premuto ◀/▶ per avvicinarti", bestWins: "Miglior numero di vittorie: {best}", selected: "Strumento selezionato:", BUMP: "URTO", SPRING: "MOLLA", PAD: "CUSCINO", HOP: "SALTA", BOUNCE: "RIMBALZO" },
    ru: { hint: "Удерживайте ◀/▶, чтобы приблизиться, ПРЫГНИТЕ и нажмите УДАР.", help: "Помощь в бою", tooFar: "Слишком далеко — приблизьтесь перед следующим ударом.", approach: "Дистанция: {distance}px · {state}", ready: "УДАР готов", close: "Удерживайте ◀/▶, чтобы приблизиться", bestWins: "Лучший результат побед: {best}", selected: "Выбранный инструмент:", BUMP: "УДАР", SPRING: "ПРУЖИНА", PAD: "ПОДУШКА", HOP: "ПРЫЖОК", BOUNCE: "ОТСКОК" },
    hi: { hint: "पास आने के लिए ◀/▶ दबाए रखें, कूदें और फिर उछाल से प्रहार करें।", help: "अखाड़ा सहायता", tooFar: "बहुत दूर हैं—अगली टक्कर से पहले पास आएँ।", approach: "दूरी: {distance}px · {state}", ready: "उछाल तैयार", close: "पास आने के लिए ◀/▶ दबाए रखें", bestWins: "सर्वश्रेष्ठ जीत: {best}", selected: "चुना गया उपकरण:", BUMP: "टक्कर", SPRING: "स्प्रिंग", PAD: "पैड", HOP: "कूदें", BOUNCE: "उछाल" },
    ar: { hint: "اضغط مطولًا على ◀/▶ للاقتراب، اقفز ثم اضغط ارتداد للضرب.", help: "مساعدة المعركة", tooFar: "المسافة بعيدة — اقترب قبل الدفع التالي.", approach: "المسافة: {distance}px · {state}", ready: "الارتداد جاهز", close: "اضغط مطولًا على ◀/▶ للاقتراب", bestWins: "أفضل عدد انتصارات: {best}", selected: "الأداة المحددة:", BUMP: "دفع", SPRING: "نابض", PAD: "وسادة", HOP: "قفز", BOUNCE: "ارتداد" }
  };
  const STAGE_COPY = {
    en: { title: "Foam Arenas", status: "Choose one of six foam arenas.", tab: "Stages", nav: "Stage sections", stageBack: "Back to Main", battleBack: "Back to Arenas", cards: [["Arena 1", "warm-up"], ["Arena 2", "spring lanes"], ["Arena 3", "moving pads"], ["Arena 4", "tight corners"], ["Arena 5", "fast rival"], ["Arena 6", "final rhythm"]] },
    "zh-Hant": { title: "泡棉競技場", status: "選擇六座泡棉競技場之一。", tab: "關卡", nav: "關卡區段", stageBack: "返回主選單", battleBack: "返回競技場", cards: [["競技場 1", "熱身"], ["競技場 2", "彈簧通道"], ["競技場 3", "移動泡棉墊"], ["競技場 4", "狹窄轉角"], ["競技場 5", "高速對手"], ["競技場 6", "最終節奏"]] },
    "zh-Hans": { title: "泡棉竞技场", status: "选择六座泡棉竞技场之一。", tab: "关卡", nav: "关卡区段", stageBack: "返回主菜单", battleBack: "返回竞技场", cards: [["竞技场 1", "热身"], ["竞技场 2", "弹簧通道"], ["竞技场 3", "移动泡棉垫"], ["竞技场 4", "狭窄转角"], ["竞技场 5", "高速对手"], ["竞技场 6", "最终节奏"]] },
    ja: { title: "フォームアリーナ", status: "6つのフォームアリーナから1つ選びます。", tab: "ステージ", nav: "ステージセクション", stageBack: "メインへ戻る", battleBack: "アリーナへ戻る", cards: [["アリーナ 1", "ウォームアップ"], ["アリーナ 2", "スプリングレーン"], ["アリーナ 3", "動くパッド"], ["アリーナ 4", "狭いコーナー"], ["アリーナ 5", "素早いライバル"], ["アリーナ 6", "最終リズム"]] },
    ko: { title: "폼 아레나", status: "6개의 폼 아레나 중 하나를 선택하세요.", tab: "스테이지", nav: "스테이지 섹션", stageBack: "메인으로 돌아가기", battleBack: "아레나로 돌아가기", cards: [["아레나 1", "워밍업"], ["아레나 2", "스프링 레인"], ["아레나 3", "움직이는 패드"], ["아레나 4", "좁은 코너"], ["아레나 5", "빠른 라이벌"], ["아레나 6", "최종 리듬"]] },
    es: { title: "Arenas de espuma", status: "Elige una de las seis arenas de espuma.", tab: "Arenas", nav: "Secciones de arena", stageBack: "Volver al inicio", battleBack: "Volver a las arenas", cards: [["Arena 1", "calentamiento"], ["Arena 2", "carriles con muelles"], ["Arena 3", "plataformas móviles"], ["Arena 4", "esquinas estrechas"], ["Arena 5", "rival veloz"], ["Arena 6", "ritmo final"]] },
    "pt-BR": { title: "Arenas de espuma", status: "Escolha uma das seis arenas de espuma.", tab: "Arenas", nav: "Seções de arena", stageBack: "Voltar ao início", battleBack: "Voltar às arenas", cards: [["Arena 1", "aquecimento"], ["Arena 2", "pistas de molas"], ["Arena 3", "almofadas móveis"], ["Arena 4", "cantos apertados"], ["Arena 5", "rival veloz"], ["Arena 6", "ritmo final"]] },
    fr: { title: "Arènes en mousse", status: "Choisissez l’une des six arènes en mousse.", tab: "Arènes", nav: "Sections d’arène", stageBack: "Retour à l’accueil", battleBack: "Retour aux arènes", cards: [["Arène 1", "échauffement"], ["Arène 2", "couloirs à ressorts"], ["Arène 3", "plateformes mobiles"], ["Arène 4", "virages serrés"], ["Arène 5", "rival rapide"], ["Arène 6", "rythme final"]] },
    de: { title: "Schaumstoff-Arenen", status: "Wähle eine von sechs Schaumstoff-Arenen.", tab: "Arenen", nav: "Arenenbereiche", stageBack: "Zurück zum Hauptmenü", battleBack: "Zurück zu den Arenen", cards: [["Arena 1", "Aufwärmen"], ["Arena 2", "Federbahnen"], ["Arena 3", "bewegliche Polster"], ["Arena 4", "enge Ecken"], ["Arena 5", "schneller Rivale"], ["Arena 6", "finaler Rhythmus"]] },
    it: { title: "Arene di gommapiuma", status: "Scegli una delle sei arene di gommapiuma.", tab: "Arene", nav: "Sezioni arena", stageBack: "Torna al menu", battleBack: "Torna alle arene", cards: [["Arena 1", "riscaldamento"], ["Arena 2", "corsie a molla"], ["Arena 3", "pedane mobili"], ["Arena 4", "angoli stretti"], ["Arena 5", "rivale veloce"], ["Arena 6", "ritmo finale"]] },
    ru: { title: "Поролоновые арены", status: "Выберите одну из шести поролоновых арен.", tab: "Арены", nav: "Разделы арен", stageBack: "Вернуться в меню", battleBack: "Вернуться к аренам", cards: [["Арена 1", "разминка"], ["Арена 2", "пружинные дорожки"], ["Арена 3", "подвижные платформы"], ["Арена 4", "тесные углы"], ["Арена 5", "быстрый соперник"], ["Арена 6", "финальный ритм"]] },
    hi: { title: "फोम अखाड़े", status: "छह फोम अखाड़ों में से एक चुनें।", tab: "अखाड़े", nav: "अखाड़ा अनुभाग", stageBack: "मुख्य मेन्यू पर लौटें", battleBack: "अखाड़ों पर लौटें", cards: [["अखाड़ा 1", "वार्म-अप"], ["अखाड़ा 2", "स्प्रिंग गलियारे"], ["अखाड़ा 3", "चलते पैड"], ["अखाड़ा 4", "तंग कोने"], ["अखाड़ा 5", "तेज़ प्रतिद्वंद्वी"], ["अखाड़ा 6", "अंतिम लय"]] },
    ar: { title: "ساحات الرغوة", status: "اختر ساحة رغوة واحدة من أصل ست ساحات.", tab: "الساحات", nav: "أقسام الساحات", stageBack: "العودة إلى القائمة الرئيسية", battleBack: "العودة إلى الساحات", cards: [["الساحة 1", "إحماء"], ["الساحة 2", "ممرات نابضة"], ["الساحة 3", "وسائد متحركة"], ["الساحة 4", "زوايا ضيقة"], ["الساحة 5", "منافس سريع"], ["الساحة 6", "الإيقاع النهائي"]] }
  };
  const RESULT_COPY = {
    en: { winTitle: "Arena clear", loseTitle: "Bounced out", winCopy: "Arena {arena} won with {energy} energy remaining.", loseCopy: "Arena {arena} lost. Read the rival's approach and try again.", next: "Next Arena", replay: "Replay Arena", retry: "Retry Arena", arenas: "Arenas" },
    "zh-Hant": { winTitle: "競技場完成", loseTitle: "被彈出場", winCopy: "競技場 {arena} 勝利，還剩 {energy} 點能量。", loseCopy: "競技場 {arena} 失敗。讀懂對手的動向，再試一次。", next: "下一座競技場", replay: "重玩競技場", retry: "重試競技場", arenas: "鬥場" },
    "zh-Hans": { winTitle: "竞技场完成", loseTitle: "被弹出场", winCopy: "竞技场 {arena} 获胜，还剩 {energy} 点能量。", loseCopy: "竞技场 {arena} 失败。读懂对手的行动，再试一次。", next: "下一座竞技场", replay: "重玩竞技场", retry: "重试竞技场", arenas: "斗场" },
    ja: { winTitle: "アリーナクリア", loseTitle: "場外に出ました", winCopy: "アリーナ{arena}をクリア。残りエネルギーは{energy}です。", loseCopy: "アリーナ{arena}に敗北。ライバルの動きを読んで、もう一度試しましょう。", next: "次のアリーナ", replay: "アリーナを再プレイ", retry: "アリーナをリトライ", arenas: "アリーナ" },
    ko: { winTitle: "아레나 클리어", loseTitle: "튕겨 나갔습니다", winCopy: "아레나 {arena} 승리. 에너지 {energy}가 남았습니다.", loseCopy: "아레나 {arena} 패배. 상대의 움직임을 읽고 다시 도전하세요.", next: "다음 아레나", replay: "아레나 다시 하기", retry: "아레나 다시 도전", arenas: "아레나" },
    es: { winTitle: "Arena superada", loseTitle: "Has salido despedido", winCopy: "Arena {arena} ganada con {energy} de energía restante.", loseCopy: "Arena {arena} perdida. Lee el movimiento del rival e inténtalo de nuevo.", next: "Siguiente arena", replay: "Repetir arena", retry: "Reintentar arena", arenas: "Arenas" },
    "pt-BR": { winTitle: "Arena concluída", loseTitle: "Você foi lançado para fora", winCopy: "Arena {arena} vencida com {energy} de energia restante.", loseCopy: "Arena {arena} perdida. Leia o movimento do rival e tente novamente.", next: "Próxima arena", replay: "Repetir arena", retry: "Tentar arena novamente", arenas: "Arenas" },
    fr: { winTitle: "Arène terminée", loseTitle: "Éjecté de l’arène", winCopy: "Arène {arena} gagnée avec {energy} d’énergie restante.", loseCopy: "Arène {arena} perdue. Observez le mouvement du rival et réessayez.", next: "Arène suivante", replay: "Rejouer l’arène", retry: "Réessayer l’arène", arenas: "Arènes" },
    de: { winTitle: "Arena geschafft", loseTitle: "Hinauskatapultiert", winCopy: "Arena {arena} gewonnen, noch {energy} Energie übrig.", loseCopy: "Arena {arena} verloren. Lies die Bewegung des Gegners und versuche es erneut.", next: "Nächste Arena", replay: "Arena wiederholen", retry: "Arena erneut versuchen", arenas: "Arenen" },
    it: { winTitle: "Arena completata", loseTitle: "Sei rimbalzato fuori", winCopy: "Arena {arena} vinta con {energy} energia rimasta.", loseCopy: "Arena {arena} persa. Leggi il movimento del rivale e riprova.", next: "Arena successiva", replay: "Rigioca l’arena", retry: "Riprova l’arena", arenas: "Arene" },
    ru: { winTitle: "Арена пройдена", loseTitle: "Вас выбило с арены", winCopy: "Арена {arena} пройдена, осталось энергии: {energy}.", loseCopy: "Арена {arena} проиграна. Изучите манёвры соперника и попробуйте снова.", next: "Следующая арена", replay: "Повторить арену", retry: "Сыграть арену снова", arenas: "Арены" },
    hi: { winTitle: "अखाड़ा पूरा", loseTitle: "आप बाहर उछल गए", winCopy: "अखाड़ा {arena} जीत लिया; {energy} ऊर्जा शेष है।", loseCopy: "अखाड़ा {arena} हार गए। प्रतिद्वंद्वी की चाल समझें और फिर कोशिश करें।", next: "अगला अखाड़ा", replay: "अखाड़ा फिर खेलें", retry: "अखाड़ा दोबारा खेलें", arenas: "अखाड़े" },
    ar: { winTitle: "اكتملت الساحة", loseTitle: "قُذفت خارج الساحة", winCopy: "فزت في الساحة {arena} وبقيت {energy} من الطاقة.", loseCopy: "خسرت الساحة {arena}. اقرأ أسلوب الخصم وحاول مجدداً.", next: "الساحة التالية", replay: "إعادة لعب الساحة", retry: "إعادة محاولة الساحة", arenas: "الساحات" }
  };
  const BATTLE_LEAVE_COPY = {
    en: { title: "Leave this arena?", body: "Leaving will discard this round. Current state:", continueLabel: "Continue battle", leaveLabel: "Leave arena" },
    "zh-Hant": { title: "要離開這座競技場嗎？", body: "離開後將捨棄本回合進度。目前狀態：", continueLabel: "繼續戰鬥", leaveLabel: "離開競技場" },
    "zh-Hans": { title: "要离开这座竞技场吗？", body: "离开后将丢弃本回合进度。当前状态：", continueLabel: "继续战斗", leaveLabel: "离开竞技场" },
    ja: { title: "アリーナを離れますか？", body: "このラウンドの進行状況は失われます。現在の状態：", continueLabel: "バトルを続ける", leaveLabel: "アリーナを離れる" },
    ko: { title: "아레나를 떠날까요?", body: "현재 라운드 진행 상황이 사라집니다. 현재 상태:", continueLabel: "배틀 계속하기", leaveLabel: "아레나 나가기" },
    es: { title: "¿Salir de esta arena?", body: "Perderás el progreso de esta ronda. Estado actual:", continueLabel: "Continuar combate", leaveLabel: "Salir de la arena" },
    "pt-BR": { title: "Sair desta arena?", body: "Seu progresso nesta rodada será perdido. Estado atual:", continueLabel: "Continuar batalha", leaveLabel: "Sair da arena" },
    fr: { title: "Quitter cette arène ?", body: "La progression de cette manche sera perdue. État actuel :", continueLabel: "Continuer le combat", leaveLabel: "Quitter l’arène" },
    de: { title: "Diese Arena verlassen?", body: "Der Fortschritt dieser Runde geht verloren. Aktueller Stand:", continueLabel: "Kampf fortsetzen", leaveLabel: "Arena verlassen" },
    it: { title: "Uscire da questa arena?", body: "I progressi del round andranno persi. Stato attuale:", continueLabel: "Continua la battaglia", leaveLabel: "Esci dall’arena" },
    ru: { title: "Покинуть арену?", body: "Прогресс этого раунда будет потерян. Текущее состояние:", continueLabel: "Продолжить бой", leaveLabel: "Покинуть арену" },
    hi: { title: "इस अखाड़े से बाहर जाएँ?", body: "इस राउंड की प्रगति मिट जाएगी। मौजूदा स्थिति:", continueLabel: "लड़ाई जारी रखें", leaveLabel: "अखाड़ा छोड़ें" },
    ar: { title: "مغادرة هذه الساحة؟", body: "ستُفقد تقدّم هذه الجولة. الحالة الحالية:", continueLabel: "متابعة القتال", leaveLabel: "مغادرة الساحة" },
  };
  const locale = document.documentElement.lang || "en";
  const copy = COPY[locale] || COPY.en;
  const stageCopy = STAGE_COPY[locale] || STAGE_COPY.en;
  const battleLeaveCopy = BATTLE_LEAVE_COPY[locale] || BATTLE_LEAVE_COPY.en;
  const healthCopy = {
    en: { you: "You", rival: "Rival" }, "zh-Hant": { you: "我方", rival: "對手" }, "zh-Hans": { you: "我方", rival: "对手" },
    ja: { you: "自分", rival: "相手" }, ko: { you: "나", rival: "상대" }, es: { you: "Tú", rival: "Rival" },
    "pt-BR": { you: "Você", rival: "Rival" }, fr: { you: "Vous", rival: "Rival" }, de: { you: "Du", rival: "Gegner" },
    it: { you: "Tu", rival: "Rivale" }, ru: { you: "Вы", rival: "Соперник" }, hi: { you: "आप", rival: "प्रतिद्वंद्वी" }, ar: { you: "أنت", rival: "الخصم" },
  }[locale] || { you: "You", rival: "Rival" };
  const arenaCopy = {
    en: { title: "FOAM ZONE", subtitle: "A toy physics test arena" },
    "zh-Hant": { title: "泡棉競技場", subtitle: "玩具物理練習場" },
    "zh-Hans": { title: "泡棉竞技场", subtitle: "玩具物理练习场" },
    ja: { title: "フォームアリーナ", subtitle: "おもちゃ物理テスト場" },
    ko: { title: "폼 아레나", subtitle: "장난감 물리 연습장" },
    es: { title: "ARENA DE ESPUMA", subtitle: "Arena de prueba física" },
    "pt-BR": { title: "ARENA DE ESPUMA", subtitle: "Arena de teste de física" },
    fr: { title: "ARÈNE EN MOUSSE", subtitle: "Arène de test physique" },
    de: { title: "SCHAUMSTOFF-ARENA", subtitle: "Physik-Testarena" },
    it: { title: "ARENA DI GOMMAPIUMA", subtitle: "Arena test di fisica" },
    ru: { title: "ПОРОЛОНОВАЯ АРЕНА", subtitle: "Тестовая физическая арена" },
    hi: { title: "फोम अखाड़ा", subtitle: "खिलौना भौतिकी अभ्यास अखाड़ा" },
    ar: { title: "ساحة الرغوة", subtitle: "ساحة اختبار فيزياء الألعاب" },
  }[locale] || { title: "FOAM ZONE", subtitle: "A toy physics test arena" };


// All dynamic gameplay copy is locale-owned. Existing route metadata stays localized.
const WORD_KEYS = ['goal','move','attack','dodge','danger','opening','armored','hit','combo','wait','time','cleared','progress','start','practice','practiceDone','saved','storage','error','retry','stages','next','replay','coachMove','coachHit','coachDodge','ready','miss','controls','mastery'];
const WORDS = {
  en:['Dodge the red charge. Move close and bump the rival’s energy to zero.','Move','BUMP','DODGE','Red lane! Dodge sideways.','Opening! Move in and bump.','Armored — attack after the charge.','Hit','Combo','Recovering…','Time','Cleared','Arenas cleared','Start Game','Guided Practice','Practice complete','Progress saved in this browser.','Saving unavailable; you can keep playing.','The 3D arena could not start. Retry or return to arenas.','Try again','Arenas','Next arena','Replay','1 · Move with arrows / WASD, or drag the arena.','2 · Move near the orange rival; tap BUMP / Space.','3 · Red means danger. DODGE / Shift avoids a charge.','In range · BUMP','Missed — move closer.','Arrows / WASD: move · Space: bump · Shift: dodge · 1–3: tools','Mastery'],
  'zh-Hant':['閃開紅色衝撞，靠近反擊，把對手能量撞到 0。','移動','撞擊','閃避','紅色危險區！往側邊閃開。','反擊空檔！靠近再撞擊。','裝甲防守中，等衝撞結束再反擊。','命中','連擊','回復中…','倒數','通關','競技場進度','開始遊戲','引導練習','練習完成','進度已儲存在此瀏覽器。','目前無法儲存，仍可繼續遊玩。','無法啟動 3D 競技場，請重試或返回關卡。','重新嘗試','競技場','下一關','重玩','1 · 用方向鍵／WASD 移動，或在場內拖曳搖桿。','2 · 靠近橘色對手，按「撞擊」或空白鍵。','3 · 紅色是衝撞預告，按「閃避」或 Shift 躲開。','已進入射程 · 撞擊！','沒有打中，先靠近對手。','方向鍵／WASD 移動 · 空白鍵撞擊 · Shift 閃避 · 1–3 換工具','精通'],
  'zh-Hans':['躲开红色冲撞，靠近反击，把对手能量撞到 0。','移动','撞击','闪避','红色危险区！向侧边闪开。','反击空档！靠近再撞击。','装甲防守中，等冲撞结束再反击。','命中','连击','恢复中…','倒计时','通关','竞技场进度','开始游戏','引导练习','练习完成','进度已保存在此浏览器。','目前无法保存，仍可继续游玩。','无法启动 3D 竞技场，请重试或返回关卡。','重新尝试','竞技场','下一关','重玩','1 · 用方向键／WASD 移动，或在场内拖动摇杆。','2 · 靠近橙色对手，按“撞击”或空格键。','3 · 红色是冲撞预告，按“闪避”或 Shift 躲开。','已进入范围 · 撞击！','没有打中，先靠近对手。','方向键／WASD 移动 · 空格撞击 · Shift 闪避 · 1–3 换工具','精通'],
  ja:['赤い突進をかわし、近づいて相手のエネルギーを0にしよう。','移動','バンプ','回避','赤いレーン！横に回避。','反撃の隙！近づいてバンプ。','装甲中。突進の後に反撃。','命中','コンボ','回復中…','残り','クリア','アリーナ進行','ゲーム開始','ガイド練習','練習完了','このブラウザに保存しました。','保存できません。プレイは続けられます。','3Dアリーナを開始できません。再試行するか戻ってください。','再試行','アリーナ','次へ','再プレイ','1 · 矢印／WASD、または画面をドラッグして移動。','2 · オレンジの相手に近づき、バンプ／Space。','3 · 赤は突進の予告。回避／Shiftで避けよう。','射程内 · バンプ！','届きません。近づいてください。','矢印／WASD：移動 · Space：バンプ · Shift：回避 · 1–3：道具','達成'],
  ko:['빨간 돌진을 피하고 가까이서 밀쳐 상대 에너지를 0으로 만드세요.','이동','밀치기','회피','빨간 구역! 옆으로 피하세요.','반격 기회! 가까이서 밀치세요.','장갑 방어 중. 돌진 후 반격하세요.','명중','콤보','회복 중…','남은 시간','완료','아레나 진행','게임 시작','안내 연습','연습 완료','이 브라우저에 저장했어요.','저장할 수 없지만 계속 플레이할 수 있어요.','3D 아레나를 시작할 수 없어요. 다시 시도하거나 돌아가세요.','다시 시도','아레나','다음 아레나','다시 하기','1 · 방향키/WASD 또는 화면을 드래그해 이동하세요.','2 · 주황색 상대에게 다가가 밀치기/Space를 누르세요.','3 · 빨간색은 돌진 예고! 회피/Shift로 피하세요.','사거리 안 · 밀치기!','빗나갔어요. 더 가까이 가세요.','방향키/WASD 이동 · Space 밀치기 · Shift 회피 · 1–3 도구','숙련'],
  es:['Esquiva la carga roja. Acércate y reduce la energía del rival a cero.','Mover','EMPUJAR','ESQUIVAR','¡Zona roja! Esquiva a un lado.','¡Una apertura! Acércate y golpea.','Con armadura: ataca tras la carga.','Acierto','Combo','Recuperando…','Tiempo','Superada','Arenas superadas','Jugar','Práctica guiada','Práctica completada','Progreso guardado en este navegador.','No se puede guardar; puedes seguir jugando.','No se pudo iniciar la arena 3D. Reintenta o vuelve.','Reintentar','Arenas','Siguiente','Repetir','1 · Muévete con flechas/WASD o arrastra la arena.','2 · Acércate al rival naranja y pulsa EMPUJAR/Espacio.','3 · El rojo avisa de una carga. ESQUIVAR/Mayús para evitarla.','A tu alcance · ¡EMPUJAR!','Fallaste: acércate más.','Flechas/WASD: mover · Espacio: empujar · Mayús: esquivar · 1–3: herramientas','Dominio'],
  'pt-BR':['Desvie da investida vermelha. Aproxime-se e zere a energia do rival.','Mover','EMPURRAR','DESVIAR','Área vermelha! Desvie para o lado.','Uma abertura! Aproxime-se e ataque.','Com armadura: ataque após a investida.','Acerto','Combo','Recuperando…','Tempo','Concluída','Arenas concluídas','Jogar','Prática guiada','Prática concluída','Progresso salvo neste navegador.','Não foi possível salvar; você pode continuar.','A arena 3D não iniciou. Tente novamente ou volte.','Tentar novamente','Arenas','Próxima','Rejogar','1 · Mova com setas/WASD ou arraste a arena.','2 · Aproxime-se do rival laranja e pressione EMPURRAR/Espaço.','3 · Vermelho indica investida. DESVIAR/Shift para evitar.','No alcance · EMPURRE!','Errou: aproxime-se mais.','Setas/WASD: mover · Espaço: empurrar · Shift: desviar · 1–3: ferramentas','Domínio'],
  fr:['Évitez la charge rouge. Approchez et réduisez l’énergie du rival à zéro.','Bouger','POUSSER','ESQUIVER','Zone rouge ! Esquivez sur le côté.','Une ouverture ! Approchez et frappez.','Armure active : frappez après la charge.','Touché','Combo','Récupération…','Temps','Terminée','Arènes terminées','Jouer','Entraînement guidé','Entraînement terminé','Progression enregistrée dans ce navigateur.','Enregistrement indisponible ; vous pouvez jouer.','Impossible de lancer l’arène 3D. Réessayez ou revenez.','Réessayer','Arènes','Suivante','Rejouer','1 · Flèches/WASD ou glissez sur l’arène pour bouger.','2 · Approchez du rival orange puis POUSSER/Espace.','3 · Rouge annonce une charge. ESQUIVER/Maj pour l’éviter.','À portée · POUSSEZ !','Raté : rapprochez-vous.','Flèches/WASD : bouger · Espace : pousser · Maj : esquiver · 1–3 : outils','Maîtrise'],
  de:['Weiche dem roten Ansturm aus. Stoße die Energie des Gegners auf null.','Bewegen','STOSS','AUSWEICHEN','Rote Bahn! Seitlich ausweichen.','Eine Lücke! Näher kommen und stoßen.','Gepanzert: nach dem Ansturm angreifen.','Treffer','Kombo','Erholung…','Zeit','Geschafft','Geschaffte Arenen','Spielen','Geführte Übung','Übung geschafft','Fortschritt in diesem Browser gespeichert.','Speichern nicht möglich; du kannst weiterspielen.','Die 3D-Arena konnte nicht starten. Erneut versuchen oder zurück.','Erneut versuchen','Arenen','Nächste','Wiederholen','1 · Pfeile/WASD oder über die Arena ziehen zum Bewegen.','2 · Zum orangefarbenen Gegner gehen, STOSS/Leertaste drücken.','3 · Rot kündigt den Ansturm an. AUSWEICHEN/Umschalt nutzen.','In Reichweite · STOSS!','Verfehlt: näher kommen.','Pfeile/WASD: bewegen · Leertaste: stoßen · Umschalt: ausweichen · 1–3: Werkzeuge','Meisterschaft'],
  it:['Schiva la carica rossa. Avvicinati e azzera l’energia del rivale.','Muovi','SPINTA','SCHIVA','Zona rossa! Schiva di lato.','Un’apertura! Avvicinati e colpisci.','Corazzato: attacca dopo la carica.','Colpito','Combo','Recupero…','Tempo','Superata','Arene superate','Gioca','Pratica guidata','Pratica completata','Progressi salvati in questo browser.','Salvataggio non disponibile; puoi continuare.','Impossibile avviare l’arena 3D. Riprova o torna indietro.','Riprova','Arene','Prossima','Rigioca','1 · Frecce/WASD o trascina l’arena per muoverti.','2 · Avvicinati al rivale arancione e premi SPINTA/Spazio.','3 · Il rosso anticipa una carica. SCHIVA/Maiusc per evitarla.','A portata · SPINTA!','Mancato: avvicinati.','Frecce/WASD: muovi · Spazio: spinta · Maiusc: schiva · 1–3: strumenti','Maestria'],
  ru:['Уклоняйтесь от красного рывка. Подойдите и сбейте энергию соперника до нуля.','Движение','ТОЛЧОК','УКЛОН','Красная полоса! Уклоняйтесь в сторону.','Есть окно! Подойдите и ударьте.','Броня: атакуйте после рывка.','Попадание','Комбо','Восстановление…','Время','Пройдено','Арены пройдены','Играть','Обучение','Обучение завершено','Прогресс сохранён в этом браузере.','Сохранение недоступно; можно продолжать.','Не удалось запустить 3D-арену. Повторите или вернитесь.','Повторить','Арены','Следующая','Заново','1 · Стрелки/WASD или ведите пальцем по арене.','2 · Подойдите к оранжевому сопернику и нажмите ТОЛЧОК/Пробел.','3 · Красный цвет — предупреждение. УКЛОН/Shift поможет избежать рывка.','В радиусе · ТОЛЧОК!','Промах: подойдите ближе.','Стрелки/WASD: движение · Пробел: толчок · Shift: уклон · 1–3: инструменты','Мастерство'],
  hi:['लाल दौड़ से बचें। पास जाकर धक्का दें और प्रतिद्वंद्वी की ऊर्जा शून्य करें।','चलें','धक्का','बचें','लाल रास्ता! बगल में बचें।','मौका है! पास जाकर धक्का दें।','कवच सक्रिय है। दौड़ के बाद वार करें।','वार लगा','कॉम्बो','तैयार हो रहा…','समय','पूर्ण','पूर्ण अखाड़े','खेलें','निर्देशित अभ्यास','अभ्यास पूर्ण','प्रगति इस ब्राउज़र में सहेजी गई।','सहेजना उपलब्ध नहीं; आप खेल सकते हैं।','3D अखाड़ा शुरू नहीं हुआ। फिर कोशिश करें या वापस जाएँ।','फिर कोशिश','अखाड़े','अगला','फिर खेलें','1 · तीर/WASD से चलें या अखाड़े पर खींचें।','2 · नारंगी प्रतिद्वंद्वी के पास जाकर धक्का/Space दबाएँ।','3 · लाल रंग दौड़ की चेतावनी है। बचें/Shift से बचें।','सीमा में · धक्का दें!','चूक गए, और पास जाएँ।','तीर/WASD: चलें · Space: धक्का · Shift: बचें · 1–3: उपकरण','निपुणता'],
  ar:['تفادَ الاندفاع الأحمر. اقترب وادفع الخصم حتى تصبح طاقته صفرًا.','تحرّك','ادفع','تفادَ','منطقة حمراء! تفادَ إلى الجانب.','فرصة للرد! اقترب وادفع.','الدرع نشط. هاجم بعد الاندفاع.','إصابة','سلسلة','استعادة…','الوقت','مكتملة','الساحات المكتملة','ابدأ اللعب','تدريب موجّه','اكتمل التدريب','حُفظ التقدم في هذا المتصفح.','الحفظ غير متاح؛ يمكنك متابعة اللعب.','تعذّر بدء الساحة ثلاثية الأبعاد. أعد المحاولة أو ارجع.','أعد المحاولة','الساحات','التالية','إعادة','1 · تحرّك بالأسهم/WASD أو اسحب داخل الساحة.','2 · اقترب من الخصم البرتقالي واضغط ادفع/مسافة.','3 · الأحمر يحذّر من اندفاع. تفادَ/Shift لتجنّبه.','ضمن المدى · ادفع!','لم تصب؛ اقترب أكثر.','الأسهم/WASD: تحرّك · مسافة: ادفع · Shift: تفادَ · 1–3: الأدوات','الإتقان']
};
const t = key => WORDS[locale]?.[WORD_KEYS.indexOf(key)] || WORDS.en[WORD_KEYS.indexOf(key)] || key;
const LESSONS = {
  en:['Read the red lane, then counter the missed charge.','Cyan spring tiles boost the next bump.','Moving foam bumpers change your route.','Use cover; rebound the rival off the walls.','Two charges, then a longer opening.','The champion’s armor opens after its charge.'],
  'zh-Hant':['看懂紅色預告，閃開後抓空檔反擊。','踩上青色彈簧格，強化下一次撞擊。','移動泡棉柱會改變路線，繞開再反擊。','利用掩體走位，把對手撞向牆面反彈。','連續兩次衝撞後，才是長反擊空檔。','冠軍衝撞後會解除裝甲，趁空檔出手。'],
  'zh-Hans':['看懂红色预告，躲开后抓空档反击。','踩上青色弹簧格，强化下一次撞击。','移动泡棉柱会改变路线，绕开再反击。','利用掩体走位，把对手撞向墙面反弹。','连续两次冲撞后，才是长反击空档。','冠军冲撞后会解除装甲，趁空档出手。'],
  ja:['赤い予告を読み、突進を避けて反撃。','水色のバネ床で次のバンプを強化。','動くクッションを回り込もう。','遮蔽物を使い、相手を壁に弾こう。','2回の突進の後が反撃のチャンス。','王者の装甲は突進後に開く。'],
  ko:['빨간 예고를 보고 돌진을 피해 반격하세요.','청록색 발판으로 다음 밀치기를 강화하세요.','움직이는 기둥을 돌아 이동하세요.','엄폐물을 이용해 상대를 벽에 튕기세요.','두 번의 돌진 후 반격 기회가 와요.','챔피언은 돌진 후 장갑이 열려요.'],
  es:['Lee la zona roja y contraataca.','Las baldosas cian potencian tu empujón.','Rodea los obstáculos móviles.','Usa cobertura y rebotes contra la pared.','Dos cargas antes de una gran apertura.','La armadura se abre tras la carga.'],
  'pt-BR':['Leia o vermelho e contra-ataque.','Pisos cianos fortalecem seu próximo empurrão.','Contorne os obstáculos móveis.','Use cobertura e rebotes nas paredes.','Duas investidas antes de uma abertura maior.','A armadura abre após a investida.'],
  fr:['Lisez le rouge, esquivez et ripostez.','Les dalles cyan renforcent la prochaine poussée.','Contournez les obstacles mobiles.','Utilisez les abris et les rebonds sur les murs.','Deux charges avant une longue ouverture.','L’armure s’ouvre après la charge.'],
  de:['Rot lesen, ausweichen und kontern.','Cyanfarbene Felder stärken den nächsten Stoß.','Umgehe die beweglichen Hindernisse.','Nutze Deckung und Wandabpraller.','Zwei Anstürme, dann eine längere Lücke.','Die Rüstung öffnet sich nach dem Ansturm.'],
  it:['Leggi il rosso, schiva e contrattacca.','Le piastrelle ciano potenziano la spinta.','Aggira gli ostacoli mobili.','Usa ripari e rimbalzi sulle pareti.','Due cariche prima di un’apertura lunga.','La corazza si apre dopo la carica.'],
  ru:['Следите за красным и контратакуйте.','Бирюзовые плитки усиливают следующий толчок.','Обходите движущиеся препятствия.','Используйте укрытия и отскоки от стен.','Два рывка, затем длинное окно для атаки.','Броня раскрывается после рывка.'],
  hi:['लाल चेतावनी पढ़ें, बचें और पलटवार करें।','फ़िरोज़ी टाइल अगला धक्का मजबूत करती है।','चलती बाधाओं के चारों ओर जाएँ।','आड़ और दीवार से उछाल का उपयोग करें।','दो दौड़ों के बाद पलटवार का लंबा मौका है।','दौड़ के बाद चैंपियन का कवच खुलता है।'],
  ar:['راقب الأحمر وتفادَ ثم ردّ الهجوم.','البلاطات السماوية تقوّي الدفعة التالية.','التفّ حول العوائق المتحركة.','استخدم الحواجز والارتداد عن الجدران.','اندفاعان ثم فرصة أطول للهجوم.','ينفتح الدرع بعد اندفاع البطل.']
};
const LESSON = LESSONS[locale] || LESSONS.en;
const TOOL_GUIDE = {
 en:['Quick balanced bumps.','More knockback; push rivals into walls.','A slower, stronger hit.'],
 'zh-Hant':['出手快，傷害與擊退均衡。','擊退最強，適合把對手撞向牆面。','傷害最高，出招回復較慢。'],
 'zh-Hans':['出手快，伤害与击退均衡。','击退最强，适合把对手撞向墙面。','伤害最高，出招恢复较慢。'],
 ja:['素早いバランス型。','強い吹き飛ばしで壁へ。','高威力だが回復が遅い。'],ko:['빠르고 균형 잡힌 밀치기.','강한 밀치기로 벽에 튕기세요.','피해가 높지만 회복이 느려요.'],
 es:['Empujón rápido y equilibrado.','Más retroceso para los rebotes de pared.','Golpe más fuerte, pero más lento.'],
 'pt-BR':['Empurrão rápido e equilibrado.','Mais recuo para rebater nas paredes.','Golpe mais forte, porém mais lento.'],
 fr:['Poussée rapide et équilibrée.','Plus de recul pour les rebonds muraux.','Coup plus puissant, mais plus lent.'],
 de:['Schneller, ausgeglichener Stoß.','Mehr Rückstoß für Wandabpraller.','Stärkerer, aber langsamerer Treffer.'],
 it:['Spinta rapida ed equilibrata.','Più spinta per i rimbalzi sulle pareti.','Colpo più forte ma più lento.'],
 ru:['Быстрый сбалансированный толчок.','Сильнее отбрасывает к стенам.','Более сильный, но медленный удар.'],
 hi:['तेज और संतुलित धक्का।','दीवार तक धकेलने के लिए अधिक बल।','अधिक नुकसान, लेकिन धीमा वार।'],
 ar:['دفعة سريعة ومتوازنة.','دفع أقوى للارتداد عن الجدران.','ضربة أقوى لكن أبطأ.']
};
const MASTERY_COPY={
 en:'★ Clear · +★ energy ≥65 · +★ finish within 35s.',
 'zh-Hant':'★ 通關 · ＋★ 能量至少 65 · ＋★ 35 秒內完成。',
 'zh-Hans':'★ 通关 · ＋★ 能量至少 65 · ＋★ 35 秒内完成。',
 ja:'★ クリア · ＋★ エネルギー65以上 · ＋★ 35秒以内。',ko:'★ 완료 · ＋★ 에너지 65 이상 · ＋★ 35초 이내.',
 es:'★ Superar · +★ energía ≥65 · +★ en 35 s.',
 'pt-BR':'★ Concluir · +★ energia ≥65 · +★ em 35 s.',
 fr:'★ Terminer · +★ énergie ≥65 · +★ en 35 s.',de:'★ Schaffen · +★ Energie ≥65 · +★ in 35 s.',
 it:'★ Completare · +★ energia ≥65 · +★ entro 35 s.',ru:'★ Пройти · +★ энергия ≥65 · +★ за 35 с.',
 hi:'★ पूर्ण करें · +★ ऊर्जा ≥65 · +★ 35 सेकंड में।',ar:'★ الإكمال · +★ طاقة ≥65 · +★ خلال 35 ثانية.'
};
const kits = [
  {name:'BUMP',damage:18,force:5.5,cooldown:.46,range:2.35,symbol:'▰',color:0x9ccf67},
  {name:'SPRING',damage:13,force:9,cooldown:.64,range:2.6,symbol:'↟',color:0x71cfe5},
  {name:'PAD',damage:28,force:4,cooldown:.92,range:2.15,symbol:'▣',color:0xeab3cf}
];
const CHAPTER_SIZE = RELAY_CHAPTER_READY ? 60 : 30;
const CHAPTER_KEYS=['pulse','magnet','predict','shield','armor','phase','boss','charged','pulseHint','magnetHint','predictHint','shieldHint','phaseHint','boss5','boss10','boss15','boss20','boss25','boss30','chapter','complete'];
const CHAPTER_COPY={
 en:['Pulse','Magnet','Forecast','Core shield','First armor','Phase','Boss','Core charged','A ring is coming. Dodge through it or move outside.','Magnetic pull! Dodge outward before the charge.','The lane predicts your movement. Change direction after it locks.','Take a cyan spring core, then hit to open the blue shield.','Phase 2: pulse, pull and shield. Watch each warning.','Twinwind','Bellwarden','Lodestar','Mirror Marshal','Coilgate','Clockwork Crown','Workshop Circuit','Chapter complete'],
 'zh-Hant':['脈衝','磁力','預判','核心護盾','初遇裝甲','階段','首領','核心蓄能','環波將至！閃過波環，或移到外側。','磁力牽引！往外閃避，準備躲開衝撞。','紅線會預判移動，鎖定後換方向躲開。','先踩青色彈簧格蓄能，再命中打開藍色護盾。','第二階段：脈衝、牽引與護盾，依序讀懂預告。','雙簧隊長','鈴波守衛','引星統領','鏡面元帥','簧核門將','時律王冠','躍動工坊盃','章節完成'],
 'zh-Hans':['脉冲','磁力','预判','核心护盾','初遇装甲','阶段','首领','核心蓄能','环波将至！闪过波环，或移到外侧。','磁力牵引！向外闪避，准备躲开冲撞。','红线会预判移动，锁定后换方向躲开。','先踩青色弹簧格蓄能，再命中打开蓝色护盾。','第二阶段：脉冲、牵引与护盾，依次读懂预告。','双簧队长','铃波守卫','引星统领','镜面元帅','簧核门将','时律王冠','跃动工坊杯','章节完成'],
 ja:['波動','磁力','予測','コアシールド','最初の装甲','段階','ボス','コア充電','波が来る！回避ですり抜けるか外へ。','磁力で引かれる！外へ回避して突進に備えよう。','移動先を予測する赤い線。固定後に方向を変えよう。','水色の床で充電し、攻撃で青い盾を開こう。','第2段階：波動、磁力、盾。予告を順に読もう。','双バネ隊長','鈴波の守衛','導き星','鏡の元帥','コア門番','時律の王冠','工房サーキット','章クリア'],
 ko:['파동','자력','예측','코어 방패','첫 장갑','단계','보스','코어 충전','파동이 와요! 회피로 통과하거나 바깥으로 이동하세요.','자력이 당겨요! 바깥으로 피하고 돌진에 대비하세요.','이동을 예측하는 빨간 선! 고정되면 방향을 바꾸세요.','청록색 발판에서 충전한 뒤 파란 방패를 치세요.','2단계: 파동, 자력, 방패. 예고를 차례로 읽으세요.','쌍스프링 대장','방울파 수호자','길잡이별','거울 원수','코어 문지기','시간 왕관','공방 서킷','챕터 완료'],
 es:['Pulso','Imán','Predicción','Escudo de núcleo','Primera armadura','Fase','Jefe','Núcleo cargado','¡Viene una onda! Esquiva a través o sal de su alcance.','¡Atracción magnética! Esquiva hacia fuera antes de la carga.','La línea predice tu movimiento. Cambia de dirección cuando se fije.','Carga un núcleo en la baldosa cian y golpea el escudo azul.','Fase 2: ondas, atracción y escudo. Lee cada aviso.','Viento Doble','Guardián Campana','Estrella Guía','Mariscal Espejo','Puerta de Bobina','Corona del Reloj','Circuito del Taller','Capítulo completado'],
 'pt-BR':['Pulso','Ímã','Previsão','Escudo de núcleo','Primeira armadura','Fase','Chefe','Núcleo carregado','Uma onda vem aí! Desvie através dela ou saia do alcance.','Atração magnética! Desvie para fora antes da investida.','A linha prevê seu movimento. Mude de direção quando travar.','Carregue o núcleo no piso ciano e acerte o escudo azul.','Fase 2: ondas, atração e escudo. Leia cada aviso.','Vento Duplo','Guardião do Sino','Estrela Guia','Marechal Espelho','Portão da Mola','Coroa do Relógio','Circuito da Oficina','Capítulo concluído'],
 fr:['Onde','Aimant','Prévision','Bouclier de noyau','Première armure','Phase','Boss','Noyau chargé','Une onde arrive ! Traversez-la en esquivant ou éloignez-vous.','Attraction magnétique ! Esquivez vers l’extérieur avant la charge.','La ligne prédit vos mouvements. Changez de direction après son verrouillage.','Chargez un noyau sur la dalle cyan puis frappez le bouclier bleu.','Phase 2 : ondes, attraction et bouclier. Lisez chaque signal.','Double Ressort','Gardien des Cloches','Étoile Guide','Maréchal Miroir','Porte du Noyau','Couronne Horloge','Circuit de l’Atelier','Chapitre terminé'],
 de:['Puls','Magnet','Vorhersage','Kernschild','Erste Rüstung','Phase','Boss','Kern geladen','Eine Welle kommt! Durchweichen oder außer Reichweite gehen.','Magnetzug! Vor dem Ansturm nach außen ausweichen.','Die Linie sagt deine Bewegung voraus. Nach dem Einrasten Richtung ändern.','Auf dem cyanfarbenen Feld laden, dann den blauen Schild treffen.','Phase 2: Wellen, Zug und Schild. Warnungen nacheinander lesen.','Doppelfeder','Glockenwächter','Leitstern','Spiegelmarschall','Spulentor','Uhrwerkkrone','Werkstatt-Rundkurs','Kapitel geschafft'],
 it:['Impulso','Magnete','Previsione','Scudo del nucleo','Prima corazza','Fase','Boss','Nucleo carico','Arriva un’onda! Schivala attraversandola o esci dal raggio.','Attrazione magnetica! Schiva verso fuori prima della carica.','La linea prevede il movimento. Cambia direzione dopo il blocco.','Carica il nucleo sulla piastrella ciano e colpisci lo scudo blu.','Fase 2: onde, attrazione e scudo. Leggi ogni avviso.','Doppia Molla','Guardiano Campana','Stella Guida','Maresciallo Specchio','Porta del Nucleo','Corona Orologio','Circuito dell’Officina','Capitolo completato'],
 ru:['Импульс','Магнит','Прогноз','Щит ядра','Первая броня','Фаза','Босс','Ядро заряжено','Идёт волна! Уклонитесь сквозь неё или выйдите из радиуса.','Магнит тянет! Уклонитесь наружу перед рывком.','Линия предсказывает движение. Смените направление после фиксации.','Зарядите ядро на бирюзовой плитке и ударьте синий щит.','Фаза 2: волны, притяжение и щит. Следите за каждым сигналом.','Двойная Пружина','Страж Колокола','Путеводная Звезда','Зеркальный Маршал','Врата Ядра','Заводная Корона','Мастерская Арена','Глава пройдена'],
 hi:['तरंग','चुंबक','पूर्वानुमान','कोर ढाल','पहला कवच','चरण','बॉस','कोर चार्ज','लहर आ रही है! बचकर पार करें या दायरे से बाहर जाएँ।','चुंबकीय खिंचाव! दौड़ से पहले बाहर की ओर बचें।','लाल रेखा गति का अनुमान लगाती है। लॉक होने के बाद दिशा बदलें।','फ़िरोज़ी टाइल से कोर चार्ज करें, फिर नीली ढाल पर वार करें।','चरण 2: लहर, खिंचाव और ढाल। हर चेतावनी पढ़ें।','दोहरा स्प्रिंग','घंटी प्रहरी','मार्गतारा','दर्पण सेनापति','कोर द्वारपाल','घड़ी का ताज','कार्यशाला सर्किट','अध्याय पूर्ण'],
 ar:['نبضة','مغناطيس','توقّع','درع النواة','أول درع','مرحلة','زعيم','النواة مشحونة','موجة قادمة! تفادَ عبرها أو ابتعد عن مداها.','جذب مغناطيسي! تفادَ إلى الخارج قبل الاندفاع.','الخط يتوقّع حركتك. غيّر الاتجاه بعد ثباته.','اشحن النواة على البلاطة السماوية ثم اضرب الدرع الأزرق.','المرحلة 2: موجات وجذب ودرع. اقرأ كل تحذير.','النابض المزدوج','حارس الجرس','النجم الهادي','قائد المرآة','بوابة النواة','تاج الساعة','دورة الورشة','اكتمل الفصل']
};
const chapterText=key=>(CHAPTER_COPY[locale]||CHAPTER_COPY.en)[CHAPTER_KEYS.indexOf(key)];
const NAMES_EN=['Warm-up','Spring lanes','Moving bumpers','Tight corners','Twinwind','First armor','Pulse lesson','Bumper waves','Charged ripples','Bellwarden','Magnetic drift','Corner magnet','Moving attraction','Wave and pull','Lodestar','Lead pursuit','Crossing forecast','Predicted ripple','Covered reversal','Mirror Marshal','Core shield','Shield ripples','Charged escape','Moving shield lanes','Coilgate','Field workshop','Guarded forecast','Charged field','Last rehearsal','Clockwork Crown'];
const NAMES_ZH=['熱身','彈簧通道','移動泡棉柱','狹窄轉角','雙簧隊長','初遇裝甲','脈衝初響','泡棉波道','蓄能漣漪','鈴波守衛','磁流試煉','轉角磁場','流動牽引','波流交錯','引星統領','預判追獵','交叉預判','預判波紋','掩體折返','鏡面元帥','核心護盾','護盾波流','蓄能脫離','流動盾道','簧核門將','場域工坊','裝甲預判','蓄能場域','終局前奏','時律王冠'];
function stageName(index){const e=ENCOUNTERS[index];if(index>=30){const row=relayChapter?.[index-30];return locale==='en'&&row?.nameEn?row.nameEn:locale==='zh-Hant'&&row?.nameZh?row.nameZh:stageLabel(index);}if(e.boss)return chapterText(`boss${index+1}`);if(locale==='en')return NAMES_EN[index];if(locale==='zh-Hant')return NAMES_ZH[index];if(locale==='zh-Hans')return index<4?stageCopy.cards[index][1]:`${chapterText(e.type||'armor')} ${index+1}`;if(index<4)return stageCopy.cards[index][1];return `${chapterText(e.type||'armor')} ${index+1}`;}
function stageLabel(index){return stageCopy.cards[0][0].replace(/1/,String(index+1));}
function stageLesson(index){const e=ENCOUNTERS[index];if(index>=30)return relayGateHint?.(locale)||t('goal');return e.chargedShield?chapterText('shieldHint'):e.magnet?chapterText('magnetHint'):e.predict?chapterText('predictHint'):e.pulse?chapterText('pulseHint'):LESSON[Math.min(index,5)];}
// Thirty authored records. Data drives the same fixed simulation at every viewport.
const ENCOUNTERS = [
  {hp:80,speed:1.25,windup:1.15,recover:1.35,damage:9,color:0x60bca5},
  {hp:105,speed:1.55,windup:1.0,recover:1.2,damage:11,pads:[[-2,-1.6],[2,1.6]],color:0x60b9d2},
  {hp:120,speed:1.6,windup:.95,recover:1.2,damage:12,bumpers:[[-1.8,0],[1.8,0]],color:0xbc91d6},
  {hp:130,speed:1.7,windup:.95,recover:1.25,damage:13,cover:[[0,-2.4],[0,2.4]],bounds:3.35,color:0xf2b06d},
  {hp:140,speed:2.2,windup:.8,recover:1.75,damage:12,double:true,boss:5,color:0xe78eab},
  {hp:150,speed:1.7,windup:1.05,recover:1.7,damage:13,armored:true,type:'armor',pads:[[-2.8,-1.6],[2.8,1.6]],color:0xe5c579},
  {hp:105,speed:1.2,windup:1.1,recover:1.5,damage:10,pulse:true,type:'pulse',color:0x9fc6e8},
  {hp:120,speed:1.3,windup:1.05,recover:1.6,damage:10,pulse:true,type:'pulse',bumpers:[[-1.7,-1],[1.7,1]],color:0xa2bad9},
  {hp:130,speed:1.35,windup:1,recover:1.65,damage:11,pulse:true,type:'pulse',pads:[[-2.8,1.5],[2.8,-1.5]],color:0x75cdd1},
  {hp:180,speed:1.2,windup:1.15,recover:1.8,damage:11,pulse:true,pulseWaves:2,boss:10,type:'pulse',cover:[[-2.6,-2.4],[2.6,2.4]],color:0xd8b0e8},
  {hp:115,speed:1.5,windup:1,recover:1.5,damage:11,magnet:true,type:'magnet',color:0xd79ec9},
  {hp:125,speed:1.6,windup:1.05,recover:1.5,damage:12,magnet:true,type:'magnet',cover:[[-1.4,-2],[1.8,2.1]],color:0xc99bbc},
  {hp:140,speed:1.55,windup:1,recover:1.6,damage:12,magnet:true,type:'magnet',bumpers:[[0,0]],color:0xc5a2d5},
  {hp:145,speed:1.5,windup:1.1,recover:1.7,damage:12,magnet:true,pulse:true,type:'magnet',pads:[[-2.6,-2],[2.6,2]],color:0x9caddd},
  {hp:190,speed:1.6,windup:1.15,recover:1.9,damage:13,magnet:true,double:true,boss:15,type:'magnet',pads:[[-2.6,2],[2.6,-2]],color:0xd8a1b1},
  {hp:130,speed:1.6,windup:1.1,recover:1.5,damage:12,predict:true,type:'predict',color:0xedc781},
  {hp:140,speed:1.7,windup:1.1,recover:1.6,damage:12,predict:true,type:'predict',bumpers:[[-1.8,1],[1.8,-1]],color:0xd6b382},
  {hp:150,speed:1.6,windup:1.1,recover:1.7,damage:12,predict:true,pulse:true,type:'predict',color:0xd7b5e5},
  {hp:155,speed:1.7,windup:1.05,recover:1.7,damage:13,predict:true,type:'predict',cover:[[0,-2.2],[0,2.2]],pads:[[-2.8,0],[2.8,0]],color:0xd2bf95},
  {hp:205,speed:1.7,windup:1.1,recover:1.9,damage:13,predict:true,armored:true,double:true,counter:true,boss:20,type:'predict',color:0x9ebedb},
  {hp:130,speed:1.35,windup:1.2,recover:1.7,damage:11,chargedShield:true,type:'shield',pads:[[-1.8,0],[1.8,0]],color:0x81caca},
  {hp:145,speed:1.3,windup:1.1,recover:1.8,damage:11,chargedShield:true,pulse:true,type:'shield',pads:[[-2.5,-1.5],[2.5,1.5]],color:0x91bbdf},
  {hp:150,speed:1.45,windup:1.15,recover:1.8,damage:12,chargedShield:true,magnet:true,type:'shield',pads:[[-2.5,1.5],[2.5,-1.5]],color:0x9abbd1},
  {hp:155,speed:1.4,windup:1.1,recover:1.8,damage:12,chargedShield:true,type:'shield',pads:[[-2.8,0],[2.8,0]],bumpers:[[-1.4,-1.8],[1.4,1.8]],color:0x9cbdd9},
  {hp:220,speed:1.3,windup:1.2,recover:2,damage:12,chargedShield:true,pulse:true,pulseWaves:2,boss:25,type:'shield',pads:[[-2.4,-2.3],[2.4,2.3]],color:0x8acdc6},
  {hp:165,speed:1.5,windup:1.1,recover:1.85,damage:12,pulse:true,magnet:true,type:'magnet',pads:[[-2.4,1.8],[2.4,-1.8]],color:0xb1a7d4},
  {hp:175,speed:1.7,windup:1.1,recover:1.85,damage:13,predict:true,armored:true,type:'predict',bumpers:[[0,1.2]],color:0xb0bfcc},
  {hp:180,speed:1.5,windup:1.2,recover:1.9,damage:12,chargedShield:true,pulse:true,magnet:true,type:'shield',pads:[[-2.6,-1.6],[2.6,1.6]],bumpers:[[0,0]],color:0x99c1d2},
  {hp:185,speed:1.8,windup:1.1,recover:2,damage:13,predict:true,double:true,armored:true,type:'predict',pads:[[-2.6,0],[2.6,0]],cover:[[0,-2.4],[0,2.4]],color:0xcbb890},
  {hp:280,speed:1.6,windup:1.2,recover:2,damage:13,predict:true,armored:true,final:true,boss:30,type:'armor',pads:[[-2.6,-1.8],[2.6,1.8]],bumpers:[[0,0]],color:0xf1cd82}
];
// This loader remains unreachable until all readiness gates are complete. It
// consumes the authored records rather than manufacturing stage numbers.
if(RELAY_CHAPTER_READY){if(!await prepareRelayCandidate())throw Error('RELAY_CHAPTER_UNAVAILABLE');ENCOUNTERS.push(...relayChapter.map(row=>row.encounter));}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const safeRead=(key,fallback)=>{try{return localStorage.getItem(key)??fallback;}catch{return fallback;}};
let storageOK=true;
function readProgress(){
  let prior;try{prior=JSON.parse(safeRead('wp-brawl-progress-v2','{}'));}catch{prior={};}
  const integer=value=>Number.isFinite(Number(value))?Math.floor(Number(value)):0;
  const legacy=clamp(integer(safeRead('wp-brawl-best','0')),0,CHAPTER_SIZE);
  const stars=Array.from({length:CHAPTER_SIZE},(_,i)=>clamp(integer(prior?.stars?.[i])|| (i===legacy-1?1:0),0,3));
  return {stars,legacy,unlocked:clamp(Math.max(1,legacy+1,integer(prior?.unlocked)||1),1,CHAPTER_SIZE)};
}
const progress=readProgress();
const state={screen:'main',mode:'idle',arena:1,tool:0,keys:new Set(),held:false,last:0,accumulator:0,raf:0,elapsed:0,player:null,rival:null,combo:0,comboTimer:0,hits:0,attempts:0,damageTaken:0,practice:false,coachStep:0,freeze:0,settle:0,pendingResult:null,paused:false,generation:0,notice:'',noticeTime:0};
let world=null,stageController=null,selected=progress.unlocked-1,joystick=null;
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const audio=window.WeightPlayAudio?.createScope();
const sound=id=>audio?.play(id);
window.WeightPlayAudio?.preload(['movement.dash','movement.jump','combat.strike','combat.critical','impact.soft','player.hurt','enemy.defeat','result.win','result.lose','ui.click']);

const frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect:$('localeSelect'),playUI:true,scenes:{
  main:{root:$('main-screen'),header:$('main-screen').querySelector('header'),content:$('main-content')},
  stage:{root:$('stage-screen'),header:$('stage-screen').querySelector('header'),content:$('stage-content')},
  battle:{root:$('battle-screen'),header:$('battle-screen').querySelector('header'),content:$('battle-content'),headerInfo:$('battle-info')}
}});
const entryLoaderScript=document.querySelector('script[data-wp-game-entry-loader-bootstrap]');
const entryLoaderPromise=(()=>{
  const loader=window.WeightPlayGameEntryLoader;
  if(typeof loader?.begin==='function'){loader.begin();return Promise.resolve(loader);}
  if(!entryLoaderScript)return Promise.resolve(null);
  return new Promise(resolve=>{
    const ready=()=>{const api=window.WeightPlayGameEntryLoader;api?.begin?.();resolve(api||null);};
    entryLoaderScript.addEventListener('load',ready,{once:true});
    entryLoaderScript.addEventListener('error',()=>resolve(null),{once:true});
  });
})();
void engineReady.then(async()=>{
  const loader=await entryLoaderPromise;
  if(!loader)return;
  if(importFailure)loader.fail();
  else loader.ready();
});
const stageSummary=document.createElement('span');
const stageGroup=window.WeightPlayScreenFrame.createGroup();stageGroup.add(stageSummary);frame.stageTopUI.add(stageGroup);
const battleGroup=window.WeightPlayScreenFrame.createGroup();battleGroup.add($('arena-label')).add($('round-time'));frame.battleTopUI.add(battleGroup);
const stageNavigation=frame.commonDownButton.element;stageNavigation.dataset.wpFrameStageNav='';stageNavigation.setAttribute('aria-label',stageCopy.nav);
const practiceButton=document.createElement('button');practiceButton.type='button';practiceButton.id='practice-start';practiceButton.textContent=t('practice');practiceButton.addEventListener('click',()=>startArena(1,true));frame.commonDownButton.add(practiceButton);
const stagesTab=document.createElement('button');stagesTab.type='button';stagesTab.dataset.wpFrameAction='tab';stagesTab.dataset.wpFrameStageSlot='stages';stagesTab.textContent=stageCopy.tab;stagesTab.setAttribute('aria-current','page');stagesTab.setAttribute('aria-pressed','true');frame.commonDownButton.add(stagesTab);
const stageConfig={gameId:GAME_ID,count:CHAPTER_SIZE,poster:POSTER,background:POSTER,stage(i){let rewardState='unknown';try{const saved=window.WeightPlayCastle?.read();if(saved)rewardState=saved.completions?.[`${GAME_ID}:stage-${i+1}`]?'collected':'not-collected';}catch{}return {id:i+1,kicker:`${stageLabel(i)} / ${CHAPTER_SIZE}${ENCOUNTERS[i].boss?' · '+chapterText('boss'):''}`,title:stageName(i),subtitle:stageLesson(i),status:progress.stars[i]?'★'.repeat(progress.stars[i]):`${i+1} / ${CHAPTER_SIZE}`,summary:stageLesson(i),details:[t('goal'),t('controls')],locked:i>=progress.unlocked,cleared:progress.stars[i]>0,poster:POSTER,rewardState};}};
window.addEventListener('weightplay:castle-ready',()=>{if(state.screen==='stage')stageController?.refresh(selected);});

// Shared analytics sees lifecycle only. No game-owned network, counters or timers.
let roundKey=null,ended=false,outcome='complete',restarted=false;
function observe(){try{window.WonderAnalytics?.game?.observeState(()=>({screen:state.practice&&state.screen==='battle'?null:state.screen==='result'?null:state.screen,roundKey:state.practice?null:roundKey,stageId:state.arena,started:!state.practice&&['playing','settling'].includes(state.mode),ended:!state.practice&&ended,outcome,restart:restarted,paused:state.paused,node:document.body,keyboardKeys:['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s',' ','Shift'],activityMode:'input',idleSeconds:300}));}catch{}}
window.addEventListener('weightplay:analytics-ready',observe);
window.addEventListener('weightplay:castle-reward',event=>{const detail=event.detail;if(detail?.gameId===GAME_ID&&detail.completionId===`stage-${state.arena}`&&state.screen==='result'&&!state.practice)window.ShowResultGet?.(GAME_ID,true);});
function clearInput(){state.keys.clear();state.held=false;joystick?.reset();document.querySelectorAll('.pressed').forEach(b=>b.classList.remove('pressed'));}
function stopLoop(){cancelAnimationFrame(state.raf);state.raf=0;state.accumulator=0;clearInput();audio?.stop();}
function updateProgress(){const n=progress.stars.filter(Boolean).length;$('main-progress').textContent=`${stageCopy.tab} ${progress.unlocked} / ${CHAPTER_SIZE} · ★ ${progress.stars.reduce((a,b)=>a+b,0)} / ${CHAPTER_SIZE*3}`;stageSummary.textContent=`${t('progress')} ${n} / ${CHAPTER_SIZE}`;}
function show(screen){
  stopLoop();state.screen=screen;state.paused=false;
  document.body.dataset.screen=screen==='result'?'battle':screen;
  for(const id of ['main','stage','battle'])$(`${id}-screen`).hidden=id!==(screen==='result'?'battle':screen);
  document.querySelector('.game-page-info').hidden=screen!=='main';
  $('result-screen').hidden=screen!=='result';$('battle-leave-dialog').hidden=true;
  $('battle-content').inert=screen==='result';
  if(screen==='result')joystick?.setEnabled(false);
  frame.activate(screen==='result'?'battle':screen,{covered:screen==='result'});
  if(screen!=='battle'&&screen!=='result'){state.generation++;joystick?.destroy();joystick=null;world?.dispose();world=null;$('hit-numbers').replaceChildren();}
  if(screen==='stage'){
    updateProgress();
    if(!stageController)stageController=window.WeightPlayPlayUI.mountStage({page:$('stage-content'),rail:$('stage-list'),config:stageConfig,selected,onSelect:i=>{selected=i;},onStart:i=>startArena(i+1),isActive:()=>state.screen==='stage'});
    else stageController.refresh(selected);
  }else stageController?.cancel();
  if(screen==='main')updateProgress();
  window.scrollTo(0,0);observe();
}
function notice(message,seconds=1.4){state.notice=message;state.noticeTime=seconds;}
function actorState(x,z,hp){return {x,z,hp,max:hp,vx:0,vz:0,faceX:1,faceZ:0,cooldown:0,dodge:0,dodgeCD:0,swing:0,hitDone:false,hit:0,wallCD:0,wallCredit:0,padCD:0,boost:0,shieldBreak:0,sequence:0,finalPhase:false,pulseHits:[false,false],phase:'approach',phaseTime:2,chargeHit:false,chain:0};}
async function startArena(arena=1,practice=false){
  if(state.mode==='loading')return;
  if(arena>30&&(!RELAY_CHAPTER_READY||!await prepareRelayCandidate()||!ENCOUNTERS[arena-1]?.relayGates))return;
  show('battle');state.mode='loading';state.arena=arena;state.practice=practice;state.tool=0;state.elapsed=0;state.hits=0;state.attempts=0;state.damageTaken=0;state.combo=0;state.comboTimer=0;state.freeze=0;state.settle=0;state.pendingResult=null;state.coachStep=arena===1||practice?0:3;state.noticeTime=0;window.ShowResultGet?.(GAME_ID,false);
  $('render-error').hidden=true;$('battle-content').inert=false;
  $('hit-numbers').replaceChildren();$('tutorialPanel').getAnimations().forEach(animation=>animation.cancel());
  $('arena-label').textContent=`${stageLabel(arena-1)} / ${CHAPTER_SIZE}`;
  $('battle-status-copy').textContent=t('goal');$('tutorialPanel').textContent=t('coachMove');$('tutorialPanel').hidden=false;
  $('hero-tag').textContent=healthCopy.you;$('rival-tag').textContent=ENCOUNTERS[arena-1].boss?stageName(arena-1):healthCopy.rival;
  const generation=++state.generation;
  let engineDeadline;
  try{await Promise.race([engineReady,new Promise((_,reject)=>{engineDeadline=setTimeout(()=>reject(new Error('ENGINE_LOAD_TIMEOUT')),15000);})]);}catch{if(generation===state.generation)renderError();return;}finally{clearTimeout(engineDeadline);}
  if(generation!==state.generation)return;
  if(importFailure||!THREE){renderError();return;}
  try{
    joystick?.destroy();joystick=null;world?.dispose();world=null;
    // Retire the exact old WebGL context before binding a new scene generation.
    const previous=$('arena'),fresh=previous.cloneNode(false);previous.replaceWith(fresh);
    world=new ArenaWorld(fresh,ENCOUNTERS[arena-1]);
    state.player=actorState(-2.6,.8,100);state.rival=actorState(2.5,-.3,ENCOUNTERS[arena-1].hp);
    joystick?.destroy();joystick=window.WeightPlayJoystick.create({surface:$('arena'),container:$('arena-frame'),mode:'floating',anchor:{left:76,bottom:76},enabled:true,isEnabled:()=>state.mode==='playing'&&!state.paused});
    selectTool(0);state.mode='playing';roundKey={};ended=false;outcome='complete';observe();syncHUD();world.resize();world.render(0);resumeLoop();
  }catch(error){console.error('Bounce Brawl renderer failed',error);world?.dispose();world=null;renderError();}
}
function renderError(){state.mode='error';$('render-error').hidden=false;$('render-error-copy').textContent=t('error');$('render-retry').textContent=t('retry');$('render-back').textContent=t('stages');}
function resumeLoop(){if(!['playing','settling'].includes(state.mode)||state.paused||state.raf)return;state.last=performance.now();state.accumulator=0;state.raf=requestAnimationFrame(tick);}
function selectTool(index){
  const next=clamp(Number(index)||0,0,2);if(state.mode==='playing'&&state.player?.swing>0)return;
  state.tool=next;document.querySelectorAll('[data-tool]').forEach(b=>{const active=Number(b.dataset.tool)===next;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  if(world)world.setTool(kits[next].color);
  if(state.mode==='playing')notice((TOOL_GUIDE[locale]||TOOL_GUIDE.en)[next]);
}
function direction(){let x=0,z=0;const keys=state.keys;if(keys.has('ArrowLeft')||keys.has('KeyA'))x--;if(keys.has('ArrowRight')||keys.has('KeyD'))x++;if(keys.has('ArrowUp')||keys.has('KeyW'))z--;if(keys.has('ArrowDown')||keys.has('KeyS'))z++;const stick=joystick?.getVector();if(!x&&!z&&stick?.active){x=stick.x;z=stick.y;}const length=Math.max(1,Math.hypot(x,z));x/=length;z/=length;const yaw=.28;return {x:x*Math.cos(yaw)+z*Math.sin(yaw),z:-x*Math.sin(yaw)+z*Math.cos(yaw)};}
function attack(){
  if(state.mode!=='playing'||state.paused)return;
  const p=state.player;if(p.cooldown>0||p.dodge>0)return;
  const kit=kits[state.tool],r=state.rival,d=Math.hypot(r.x-p.x,r.z-p.z)||1;
  p.faceX=(r.x-p.x)/d;p.faceZ=(r.z-p.z)/d;p.swing=.28;p.hitDone=false;p.cooldown=kit.cooldown;state.attempts++;
  // The target sees the wind-up before authoritative contact, never on button-down.
}
function dodge(){
  if(state.mode!=='playing'||state.paused)return;
  const p=state.player;if(p.dodgeCD>0)return;
  let d=direction();if(Math.hypot(d.x,d.z)<.1){const r=state.rival,dist=Math.hypot(r.x-p.x,r.z-p.z)||1;d={x:-(r.z-p.z)/dist,z:(r.x-p.x)/dist};}
  p.vx=d.x*12;p.vz=d.z*12;p.dodge=.27;p.dodgeCD=1.4;p.swing=0;state.coachStep=Math.max(3,state.coachStep);sound('movement.dash');
}
function encounterRules(){const e=ENCOUNTERS[state.arena-1];return (e.final||e.relayFinal)&&state.rival.finalPhase?{...e,pulse:true,magnet:true,double:true,chargedShield:true,armored:false}:e;}
function beginCharge(r,e,duration=e.windup){const p=state.player,lead=e.predict?.38:0,dx=p.x+p.vx*lead-r.x,dz=p.z+p.vz*lead-r.z,d=Math.hypot(dx,dz)||1;r.phase='windup';r.phaseTime=duration;r.aimX=dx/d;r.aimZ=dz/d;r.startX=r.x;r.startZ=r.z;r.vx=0;r.vz=0;}
function contact(){
  const p=state.player,r=state.rival,kit=kits[state.tool],distance=Math.hypot(r.x-p.x,r.z-p.z);
  if(distance>kit.range){notice(t('miss'));state.combo=0;return;}
  const e=encounterRules(),boosted=p.boost>0;if(boosted&&e.chargedShield)r.shieldBreak=2.5;
  const shielded=e.chargedShield&&r.shieldBreak<=0,armored=e.armored&&r.phase!=='recover';
  state.combo=state.comboTimer>0?state.combo+1:1;state.comboTimer=2.2;
  const critical=state.combo%3===0||boosted;const damage=Math.round((kit.damage+(critical?8:0))*(shielded?.12:armored?.35:boosted?1.5:1));
  r.hp=Math.max(0,r.hp-damage);r.vx+=p.faceX*kit.force*(p.boost>0?1.6:1);r.vz+=p.faceZ*kit.force*(p.boost>0?1.6:1);r.wallCredit=.9;r.hit=.22;p.boost=0;state.hits++;state.freeze=motionQuery.matches?0:.045;state.coachStep=Math.max(2,state.coachStep);
  world.impact(r.x,.95,r.z,critical?0xf7e5a0:0xb0edb6,critical?20:10);damageNumber(r,damage,critical?'critical':'');
  if(e.counter&&armored&&r.phase==='approach')beginCharge(r,e,.65);
  sound(critical?'combat.critical':'combat.strike');notice(shielded?chapterText('shieldHint'):armored?t('armored'):`${t('hit')} · −${damage}`,.8);
  window.dispatchEvent(new CustomEvent('weightplay:bounce-impact',{detail:{tool:state.tool}}));
}
function hurt(damage,dx,dz){
  const p=state.player;if(p.dodge>0||p.hit>0)return;
  if(state.practice)damage=Math.min(damage,Math.max(0,p.hp-1));
  p.hp=Math.max(0,p.hp-damage);state.damageTaken+=damage;p.hit=.6;p.vx+=dx*7;p.vz+=dz*7;p.wallCredit=.9;state.combo=0;
  world.impact(p.x,1,p.z,0xfbc197,12);damageNumber(p,damage,'hurt');sound('player.hurt');
}
function step(dt){
  if(state.mode==='settling'){state.settle=Math.max(0,state.settle-dt);world.update(dt);if(state.settle<=0)finish(...state.pendingResult);return;}
  const p=state.player,r=state.rival,e=encounterRules();
  if((e.final||e.relayFinal)&&!r.finalPhase&&r.hp<=r.max/2){r.finalPhase=true;r.phase='phaseShift';r.phaseTime=1.2;r.vx=0;r.vz=0;notice(chapterText('phaseHint'),2.5);world.impact(r.x,1,r.z,0xa7edee,30);}
  state.elapsed+=dt;state.comboTimer=Math.max(0,state.comboTimer-dt);state.noticeTime=Math.max(0,state.noticeTime-dt);
  if(state.held)attack();
  const d=direction();if(Math.hypot(d.x,d.z)>.2)state.coachStep=Math.max(1,state.coachStep);
  if(p.dodge<=0){p.vx+=d.x*27*dt;p.vz+=d.z*27*dt;p.vx*=Math.exp(-8*dt);p.vz*=Math.exp(-8*dt);}
  else{p.vx*=Math.exp(-2*dt);p.vz*=Math.exp(-2*dt);}
  if(p.swing>0){p.swing=Math.max(0,p.swing-dt);if(!p.hitDone&&p.swing<.17){p.hitDone=true;contact();}}
  const distance=Math.hypot(p.x-r.x,p.z-r.z)||1;
  r.phaseTime-=dt;
  if(r.phase==='approach'){
    const dx=(p.x-r.x)/distance,dz=(p.z-r.z)/distance;r.faceX=dx;r.faceZ=dz;
    if(distance>2.5){r.vx+=dx*e.speed*7*dt;r.vz+=dz*e.speed*7*dt;}
    if(r.phaseTime<=0&&distance<4.7){r.sequence++;if(e.pulse&&((!e.magnet&&!e.predict)||r.sequence%2)){r.phase='pulseWindup';r.phaseTime=.95;r.vx=0;r.vz=0;}else if(e.magnet){r.phase='magnet';r.phaseTime=1.05;}else beginCharge(r,e);}
  }else if(r.phase==='phaseShift'&&r.phaseTime<=0){r.phase='approach';r.phaseTime=.3;}
  else if(r.phase==='magnet'){if(distance<4.8){p.vx+=(r.x-p.x)/distance*10*dt;p.vz+=(r.z-p.z)/distance*10*dt;}if(r.phaseTime<=0)beginCharge(r,e,.85);}
  else if(r.phase==='pulseWindup'&&r.phaseTime<=0){r.phase='pulse';r.phaseTime=1.6;r.pulseX=r.x;r.pulseZ=r.z;r.pulseHits=[false,false];}
  else if(r.phase==='pulse'){for(let wave=0;wave<(e.pulseWaves||1);wave++){const age=1.6-r.phaseTime-wave*.35,radius=.5+age*5.8,dist=Math.hypot(p.x-r.pulseX,p.z-r.pulseZ);if(age>=0&&Math.abs(dist-radius)<.32&&!r.pulseHits[wave]){r.pulseHits[wave]=true;hurt(e.damage,(p.x-r.pulseX)/(dist||1),(p.z-r.pulseZ)/(dist||1));}}if(r.phaseTime<=0){r.phase='recover';r.phaseTime=e.recover;}}
  else if(r.phase==='windup'&&r.phaseTime<=0){r.phase='charge';r.phaseTime=.43;r.chargeHit=false;r.startX=r.x;r.startZ=r.z;r.vx=r.aimX*11;r.vz=r.aimZ*11;}
  else if(r.phase==='charge'){
    if(distance<1.45&&!r.chargeHit){r.chargeHit=true;hurt(e.damage,r.aimX,r.aimZ);}
    if(r.phaseTime<=0){if(e.double&&r.chain===0){r.chain=1;beginCharge(r,e,.65);}else{r.chain=0;r.phase='recover';r.phaseTime=e.recover;}}
  }else if(r.phase==='recover'&&r.phaseTime<=0){r.phase='approach';r.phaseTime=.65;}
  if(r.phase!=='charge'){r.vx*=Math.exp(-5*dt);r.vz*=Math.exp(-5*dt);}
  // Fast charge motion is substepped at 120Hz; colliders and visible floor agree.
  for(const a of [p,r]){
    const oldX=a.x,oldZ=a.z;
    a.x+=a.vx*dt;a.z+=a.vz*dt;a.shieldBreak=Math.max(0,a.shieldBreak-dt);
    a.cooldown=Math.max(0,a.cooldown-dt);a.dodge=Math.max(0,a.dodge-dt);a.dodgeCD=Math.max(0,a.dodgeCD-dt);a.hit=Math.max(0,a.hit-dt);a.wallCD=Math.max(0,a.wallCD-dt);a.wallCredit=Math.max(0,a.wallCredit-dt);a.padCD=Math.max(0,a.padCD-dt);a.boost=Math.max(0,a.boost-dt);
    const limit=e.bounds||3.9;let rebound=0;
    const relayHit=RELAY_CHAPTER_READY&&a===r&&e.relayGates&&relayGateContact?relayGateContact({gates:e.relayGates,phase:r.phase,oldX,oldZ,newX:a.x,newZ:a.z,wall:limit}):null;
    if(Math.abs(a.x)>limit){a.x=clamp(a.x,-limit,limit);rebound=Math.abs(a.vx);a.vx*=-.6;}
    if(Math.abs(a.z)>4.45){a.z=clamp(a.z,-4.45,4.45);rebound=Math.max(rebound,Math.abs(a.vz));a.vz*=-.6;}
    if(relayHit){a.x=(relayHit.side==='L'?-1:1)*limit;a.z=relayHit.z;a.vx=0;a.vz=0;a.phase='recover';a.phaseTime=relayHit.recovery;a.chain=0;a.wallCredit=0;a.wallCD=.65;a.hp=Math.max(0,a.hp-relayHit.damage);if(e.chargedShield)a.shieldBreak=Math.max(a.shieldBreak,relayHit.shieldBreak);damageNumber(a,relayHit.damage,'');world.impact(a.x,.5,a.z,0x9ce9f3,8);sound('impact.soft');notice(t('opening'));}
    else if(rebound>4&&a.wallCD<=0&&a.wallCredit>0){a.wallCD=.65;a.wallCredit=0;if(a===r){a.hp=Math.max(0,a.hp-7);damageNumber(a,7,'');world.impact(a.x,.5,a.z,0xf5dc97,8);sound('impact.soft');}else hurt(4,0,0);}
    if(a===p)(e.pads||[]).forEach(([x,z])=>{if(Math.hypot(a.x-x,a.z-z)<.85&&a.padCD<=0){a.padCD=1.5;a.boost=2;world.impact(x,.2,z,0x9ce9f3,8);sound('movement.jump');}});
    for(const obstacle of world.obstacles){const ox=a.x-obstacle.position.x,oz=a.z-obstacle.position.z,dist=Math.hypot(ox,oz)||.01,min=obstacle.userData.radius+.6;if(dist<min){const nx=ox/dist,nz=oz/dist;a.x=obstacle.position.x+nx*min;a.z=obstacle.position.z+nz*min;a.vx+=nx*4*dt;a.vz+=nz*4*dt;}}
  }
  // Soft body separation has no damage. Only actual charge or bump contact hurts.
  const dx=r.x-p.x,dz=r.z-p.z,dist=Math.hypot(dx,dz)||.01;
  if(dist<1.15){const amount=(1.15-dist)*.5;p.x-=dx/dist*amount;p.z-=dz/dist*amount;r.x+=dx/dist*amount;r.z+=dz/dist*amount;}
  if(!state.practice&&state.elapsed>=75){settle(false,true);return;}
  if(r.hp<=0){settle(true);return;}if(p.hp<=0){settle(false);return;}
  world.update(dt);
}
function syncHUD(){
  const p=state.player,r=state.rival;if(!p||!r)return;
  const hp=Math.ceil(p.hp),rh=Math.ceil(r.hp);$('player-hp').textContent=hp;$('rival-hp').textContent=rh;
  $('player-bar').style.setProperty('--hp',p.hp/p.max);$('rival-bar').style.setProperty('--hp',r.hp/r.max);
  $('health-label').textContent=`${healthCopy.you} ${hp} · ${healthCopy.rival} ${rh}`;
  $('round-time').textContent=state.practice?t('practice'):`${t('time')} ${Math.max(0,Math.ceil(75-state.elapsed))}s`;
  const ready=Math.hypot(p.x-r.x,p.z-r.z)<=kits[state.tool].range;
  const e=encounterRules(),nearWave=r.phase==='pulse'&&Array.from({length:e.pulseWaves||1},(_,i)=>{const age=1.6-r.phaseTime-i*.35;return age>=0&&Math.abs(Math.hypot(p.x-r.pulseX,p.z-r.pulseZ)-(.5+age*5.8))<1.4;}).some(Boolean);
  const cue=nearWave?t('dodge'):p.cooldown>0?t('wait'):ready?t('ready'):t('coachHit');if($('approach-cue').textContent!==cue)$('approach-cue').textContent=cue;
  $('strike-cooldown').style.setProperty('--cooldown',clamp(p.cooldown/kits[state.tool].cooldown,0,1));$('dodge-cooldown').style.setProperty('--cooldown',p.dodgeCD/1.4);
  $('strike-button').setAttribute('aria-label',`${t('attack')} · ${p.cooldown>0?t('wait'):ready?t('ready'):t('move')}`);
  $('combo-cue').textContent=p.boost>0?`⚡ ${chapterText('charged')}`:state.combo>=2&&state.comboTimer>0?`${state.combo} × ${t('combo')}`:'';
  const danger=['windup','charge','pulseWindup','pulse','magnet','phaseShift'].includes(r.phase);let coach=r.phase==='phaseShift'?chapterText('phaseHint'):r.phase.startsWith('pulse')?chapterText('pulseHint'):r.phase==='magnet'?chapterText('magnetHint'):danger?t('danger'):state.noticeTime>0?state.notice:r.phase==='recover'?t('opening'):state.coachStep===0?t('coachMove'):state.coachStep===1?t('coachHit'):state.coachStep<3?t('coachDodge'):stageLesson(state.arena-1);
  if(RELAY_CHAPTER_READY&&e.relayGates&&relayGateHint&&r.phase==='approach'&&state.noticeTime<=0)coach=relayGateHint(locale);
  if($('tutorialPanel').textContent!==coach){$('tutorialPanel').textContent=coach;$('tutorialPanel').getAnimations().forEach(animation=>animation.cancel());$('tutorialPanel').animate([{opacity:.5},{opacity:1}],{duration:motionQuery.matches?80:140});}$('tutorialPanel').dataset.danger=String(danger);
}
function tick(now){
  state.raf=0;if(!['playing','settling'].includes(state.mode)||state.paused)return;
  const delta=Math.min(.05,Math.max(0,(now-state.last)/1000));state.last=now;
  if(state.freeze>0)state.freeze=Math.max(0,state.freeze-delta);
  else{state.accumulator=Math.min(.06,state.accumulator+delta);while(state.accumulator>=1/120&&['playing','settling'].includes(state.mode)){step(1/120);state.accumulator-=1/120;}}
  syncHUD();world?.render(delta);if(['playing','settling'].includes(state.mode))state.raf=requestAnimationFrame(tick);
}
function settle(win,timedOut=false){state.mode='settling';state.pendingResult=[win,timedOut];state.settle=motionQuery.matches?.18:.5;clearInput();joystick?.setEnabled(false);if(win)sound('enemy.defeat');}
function save(){try{localStorage.setItem('wp-brawl-progress-v2',JSON.stringify({stars:progress.stars,unlocked:progress.unlocked}));localStorage.setItem('wp-brawl-best',String(Math.max(progress.legacy,...progress.stars.map((n,i)=>n?i+1:0))));}catch{storageOK=false;}}
function finish(win,timedOut=false){
  if(!['playing','settling'].includes(state.mode))return;state.mode='result';ended=true;outcome=win?'win':'lose';
  let stars=0;if(win&&!state.practice){stars=1+(state.player.hp>=65?1:0)+(state.elapsed<=35?1:0);progress.stars[state.arena-1]=Math.max(progress.stars[state.arena-1],stars);progress.unlocked=Math.max(progress.unlocked,Math.min(CHAPTER_SIZE,state.arena+1));save();}
  const result=RESULT_COPY[locale]||RESULT_COPY.en;
  $('result-title').textContent=state.practice?t('practiceDone'):win&&state.arena===CHAPTER_SIZE?chapterText('complete'):win?result.winTitle:result.loseTitle;
  $('result-emblem').textContent=win?'★'.repeat(stars||1):'↻';
  $('result-copy').textContent=(win?result.winCopy:result.loseCopy).replace('{arena}',state.arena).replace('{energy}',Math.ceil(state.player.hp));
  $('result-stats').textContent=`${t('hit')} ${state.hits} · ${Math.ceil(state.elapsed)}s · ${healthCopy.you} ${Math.ceil(state.player.hp)}`;
  $('result-tip').textContent=state.practice?t('practiceDone'):timedOut?`${t('time')} 0s · ${t('coachHit')}`:win?`${MASTERY_COPY[locale]||MASTERY_COPY.en} ${storageOK?t('saved'):t('storage')}`:stageLesson(state.arena-1);
  $('to-stages').textContent=t('stages');$('next').textContent=t('next');$('retry').textContent=t('replay');$('next').disabled=!win||state.arena===CHAPTER_SIZE||state.practice;
  $('result-screen').dataset.outcome=win?'success':'failure';$('result-screen').dataset.arena=state.arena;
  show('result');window.ShowResultGet?.(GAME_ID,false);world?.render(0);sound(win?'result.win':'result.lose');$('to-stages').focus();
}
function pause(){if(!['playing','settling'].includes(state.mode)||state.paused)return;state.paused=true;stopLoop();joystick?.setEnabled(false);$('battle-content').inert=true;$('battle-leave-title').textContent=battleLeaveCopy.title;$('battle-leave-description').textContent=battleLeaveCopy.body;$('battle-leave-progress').textContent=`${$('arena-label').textContent} · ${$('health-label').textContent} · ${$('round-time').textContent}`;$('battle-leave-continue').textContent=battleLeaveCopy.continueLabel;$('battle-leave-confirm').textContent=battleLeaveCopy.leaveLabel;$('battle-leave-dialog').hidden=false;$('battle-leave-continue').focus();observe();}
function continueBattle(){if(!state.paused||!['playing','settling'].includes(state.mode))return;$('battle-leave-dialog').hidden=true;$('battle-content').inert=false;state.paused=false;clearInput();joystick?.setEnabled(state.mode==='playing');resumeLoop();$('battle-back').focus();observe();}
function damageNumber(actor,value,kind){if(!world)return;const element=document.createElement('span');element.className=`hit-number ${kind}`;element.textContent=`−${value}`;const p=world.project(actor.x,2.6,actor.z);element.style.left=`${p.x}px`;element.style.top=`${p.y}px`;const host=$('hit-numbers');if(host.children.length>=8)host.firstElementChild.remove();host.append(element);element.addEventListener('animationend',()=>element.remove(),{once:true});}

/* REALTIME_3D — one scene owns every GPU object, observer and effect. */
class ArenaWorld{
  constructor(canvas,encounter){
    this.resources=new Set();this.materials=new Map();this.encounter=encounter;this.obstacles=[];this.pads=[];this.effects=[];this.relayIndicators=[];this.time=0;this.disposed=false;
    try{
      this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;
      this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x18334d);this.scene.fog=new THREE.Fog(0x18334d,28,65);
      this.camera=new THREE.OrthographicCamera(-8,8,8,-8,.1,100);this.camera.position.set(5.5,19,19.1);this.camera.lookAt(0,.15,0);
      this.box=this.own(new THREE.BoxGeometry(1,1,1));this.ring=this.own(new THREE.RingGeometry(.66,.72,48));
      this.scene.add(new THREE.HemisphereLight(0xc5eaff,0x303452,2.4));
      const sun=new THREE.DirectionalLight(0xffe4b4,3.6);sun.position.set(-7,13,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-9,right:9,top:8,bottom:-8,near:1,far:35});sun.shadow.normalBias=.035;this.scene.add(sun);
      const rim=new THREE.DirectionalLight(0x8de4e5,1.8);rim.position.set(5,6,-8);this.scene.add(rim);
      this.buildArena();this.hero=this.turtle();this.rival=this.clock();this.scene.add(this.hero.root,this.rival.root);
      const hitMat=this.own(new THREE.MeshBasicMaterial({color:0xffefaf,transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false}));
      for(const model of [this.hero,this.rival]){model.hitRing=new THREE.Mesh(this.ring,hitMat);model.hitRing.rotation.x=-Math.PI/2;model.hitRing.scale.setScalar(1.8);model.hitRing.position.y=.12;model.hitRing.visible=false;model.root.add(model.hitRing);}
      this.dangerMat=this.own(new THREE.MeshBasicMaterial({color:0xff735f,transparent:true,opacity:.38,depthWrite:false}));
      this.danger=new THREE.Mesh(this.box,this.dangerMat);this.danger.scale.set(1.7,.035,5.2);this.danger.visible=false;this.scene.add(this.danger);
      this.rangeMat=this.own(new THREE.MeshBasicMaterial({color:0xafe5a0,transparent:true,opacity:.52,side:THREE.DoubleSide,depthWrite:false}));this.range=new THREE.Mesh(this.ring,this.rangeMat);this.range.rotation.x=-Math.PI/2;this.range.scale.setScalar(3.1);this.range.position.y=.1;this.scene.add(this.range);
      this.pulseRings=[0,1].map(()=>{const mesh=new THREE.Mesh(this.ring,this.own(new THREE.MeshBasicMaterial({color:0xff836c,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false})));mesh.rotation.x=-Math.PI/2;mesh.visible=false;this.scene.add(mesh);return mesh;});
      this.magnetRing=new THREE.Mesh(this.ring,this.own(new THREE.MeshBasicMaterial({color:0x78e0ff,transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false})));this.magnetRing.rotation.x=-Math.PI/2;this.magnetRing.scale.setScalar(7);this.magnetRing.visible=false;this.scene.add(this.magnetRing);
      this.shield=new THREE.Mesh(this.box,this.own(new THREE.MeshBasicMaterial({color:0x6ddfff,transparent:true,opacity:.72,wireframe:true,depthWrite:false})));this.shield.scale.set(1.9,2.4,1.5);this.shield.visible=false;this.scene.add(this.shield);
      document.querySelectorAll('.pad-tag').forEach(node=>node.remove());this.padTags=this.pads.map(()=>{const node=document.createElement('span');node.className='actor-tag pad-tag';node.textContent='⚡';node.title=chapterText('charged');$('hero-tag').parentElement.append(node);return node;});
      // A bounded shared-geometry pool; no new GPU resources per impact or retry.
      for(let i=0;i<40;i++){const mesh=new THREE.Mesh(this.box,this.mat(i%2?0xffd99b:0x9eedd2));mesh.visible=false;this.scene.add(mesh);this.effects.push({mesh,life:0,vx:0,vy:0,vz:0});}
      this.resizeObserver=new ResizeObserver(()=>{this.resize();if(state.paused||state.mode!=='playing')this.render(0);});this.resizeObserver.observe($('arena-frame'));
      this.lost=event=>{event.preventDefault();stopLoop();state.paused=false;joystick?.setEnabled(false);$('battle-content').inert=false;$('battle-leave-dialog').hidden=true;renderError();};canvas.addEventListener('webglcontextlost',this.lost);
      this.restored=()=>{if(this.disposed)return;stopLoop();state.mode='error';$('battle-leave-dialog').hidden=true;renderError();};canvas.addEventListener('webglcontextrestored',this.restored);
    }catch(error){this.dispose();throw error;}
  }
  own(resource){this.resources.add(resource);return resource;}
  mat(color){if(!this.materials.has(color))this.materials.set(color,this.own(new THREE.MeshStandardMaterial({color,roughness:.74,metalness:.03})));return this.materials.get(color);}
  block(parent,color,x,y,z,w,h,d){const mesh=new THREE.Mesh(this.box,this.mat(color));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  batch(color,records){const mesh=this.own(new THREE.InstancedMesh(this.box,this.mat(color),records.length));const dummy=new THREE.Object3D();records.forEach(([x,y,z,w,h,d],i)=>{dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.castShadow=true;mesh.receiveShadow=true;this.scene.add(mesh);return mesh;}
  buildArena(){
    const scene=this.scene,e=this.encounter;
    this.block(scene,0x162238,0,-.72,0,9.5,1.2,10.5);this.block(scene,e.color,0,-.21,0,9.7,.18,10.7);
    for(let c=0;c<4;c++){const tiles=[];for(let x=0;x<9;x++)for(let z=0;z<10;z++)if((x+z)%4===c)tiles.push([x-4,-.09,z-4.5,.975,.18,.975]);this.batch([0x426879,0x486e7a,0x416572,0x4c7380][c],tiles);}
    this.block(scene,0x9acdb6,0,-.02,0,.035,.025,9.9);
    for(const x of [-4.65,4.65]){this.block(scene,0x243952,x,.22,0,.3,.6,10.5);this.block(scene,e.color,x,.55,0,.34,.09,10.6);}
    for(const z of [-5.25,5.25]){this.block(scene,0x243952,0,.2,z,9.6,.5,.3);this.block(scene,e.color,0,.5,z,9.7,.1,.34);}
    // Purpose-built toy stadium: stepped seating, block banners and lantern towers.
    for(let row=0;row<3;row++){const seats=[];for(let i=0;i<13;i++)seats.push([(i-6)*1.3,row*.65+.15,-6.2-row*.9,1.18,.52,.75]);this.batch([0x486184,0x4c7299,0x5985a6][row],seats);}
    for(let i=-3;i<=3;i++){this.block(scene,[0xe9ac76,0x79c7c4,0xbd9bc8][(i+3)%3],i*2.4,3.3,-8.8,1.5,1.1,.18);this.block(scene,0x263b52,i*2.4,2.2,-8.9,.12,4.4,.12);}
    for(const x of [-7.7,7.7]){this.block(scene,0x223a56,x,1.2,-3,1.3,2.8,1.2);this.block(scene,e.color,x,2.7,-3,1.55,.22,1.45);this.block(scene,0xffe6ae,x,3,-3,.8,.35,.8);this.block(scene,0x1f354b,x,-1.9,2,1.8,.6,7);}
    (e.pads||[]).forEach(([x,z])=>{const group=new THREE.Group();group.position.set(x,.05,z);this.block(group,0x27798a,0,0,0,1.35,.12,1.35);this.block(group,0x9be7e5,0,.08,0,.9,.07,.9);this.block(group,0x285f75,0,.13,0,.14,.04,.7);this.block(group,0x285f75,0,.13,0,.7,.04,.14);scene.add(group);this.pads.push(group);});
    if(RELAY_CHAPTER_READY&&Array.isArray(e.relayGates))for(const gate of e.relayGates){const side=gate.side==='L'?-1:1,x=side*(e.bounds||3.9);for(const z of [gate.z-.9,gate.z+.9])this.block(scene,0x21cac6,x,1,z,.3,1.8,.25);this.block(scene,0xffb83b,x,1.88,gate.z,.34,.22,2);this.block(scene,0x16c8ca,x-side*.55,.04,gate.z,1.1,.04,.24);this.block(scene,0x18566d,x-side*.05,.95,gate.z,.12,1.1,1.35);this.relayIndicators.push(this.block(scene,0xffb83b,x-side*.14,.95,gate.z,.14,.24,1.2));}
    [...(e.bumpers||[]),...(e.cover||[])].forEach(([x,z],i)=>{const group=new THREE.Group();group.position.set(x,0,z);group.userData={radius:e.cover?.length ? .8 : .65,baseX:x,baseZ:z,moving:!!e.bumpers,index:i};this.block(group,0x35485f,0,.15,0,1.5,.3,1.5);this.block(group,e.color,0,.8,0,1.2,1.2,1.2);this.block(group,0xe5dac8,0,1.43,0,1.3,.12,1.3);scene.add(group);this.obstacles.push(group);});
    if(e.bounds){for(const x of [-4.2,4.2])this.block(scene,0xe8ba80,x,.6,0,.4,1.2,9.5);}
  }
  turtle(){
    const root=new THREE.Group(),body=new THREE.Group();root.add(body);const b=(c,x,y,z,w,h,d)=>this.block(body,c,x,y,z,w,h,d);
    b(0x75ad3e,0,.7,0,1,.8,1.15);b(0xd0b477,0,.65,.5,.78,.62,.24);b(0x418841,0,1.15,-.17,1.2,.8,1.25);b(0x99c547,0,1.64,-.18,.85,.25,.94);
    for(const x of [-.48,.48])for(const z of [-.3,.3]){b(0x73ad3e,x,.24,z,.35,.48,.38);b(0xe6dcb3,x,.09,z+.12,.38,.14,.16);}
    for(const x of [-.45,0,.45]){b(0xd9d1ac,x,1.48,-.72,.32,.2,.18);b(0x86b545,x,1.64,-.65,.24,.14,.2);}
    b(0x9dcc4c,0,1.18,.65,.79,.7,.66);b(0xc5dd70,0,.98,1,.54,.3,.24);b(0x466932,-.16,1.05,1.128,.055,.07,.02);b(0x466932,.16,1.05,1.128,.055,.07,.02);
    for(const x of [-.23,.23]){b(0xfff7da,x,1.38,.987,.2,.25,.04);b(0x333a2c,x+.025,1.36,1.015,.09,.16,.03);b(0xffffff,x+.008,1.41,1.033,.035,.045,.01);}
    b(0x356439,0,.88,1.03,.25,.06,.02);b(0x775b38,-.29,1.95,-.3,.06,.7,.06);b(0x85c450,-.05,2.12,-.3,.45,.26,.035);b(0xd8de7b,-.06,2.12,-.275,.08,.15,.02);
    const left=new THREE.Group(),right=new THREE.Group();left.position.set(-.7,.9,.35);right.position.set(.7,.9,.35);body.add(left,right);
    this.block(left,0x70a23d,0,0,0,.35,.35,.42);const glove=this.block(right,0x9ccf67,0,0,0,.54,.48,.62);this.block(right,0xd9d2a6,0,0,-.32,.55,.48,.08);
    return {root,body,left,right,glove};
  }
  clock(){
    const root=new THREE.Group(),body=new THREE.Group();root.add(body);const b=(c,x,y,z,w,h,d)=>this.block(body,c,x,y,z,w,h,d);
    b(0xc98f42,0,1,0,1.1,1.25,.68);b(0xf3ca72,0,1.04,.1,1.17,1.1,.65);b(0xffedc8,0,1.08,.46,.91,.92,.08);
    for(const x of [-.23,.23]){b(0x3a4652,x,1.25,.515,.15,.2,.025);b(0xffffff,x-.02,1.3,.532,.045,.06,.01);}
    b(0x427ca1,0,.8,.515,.28,.055,.025);b(0x427ca1,-.34,1.45,.515,.1,.08,.025);b(0x427ca1,.34,.74,.515,.1,.08,.025);
    b(0xc88c3a,0,1.91,0,.12,.5,.12);b(0xe8b45a,-.22,2.06,0,.38,.12,.12);b(0xe8b45a,.22,2.06,0,.38,.12,.12);b(0xe8b45a,-.38,2.2,0,.12,.32,.12);b(0xe8b45a,.38,2.2,0,.12,.32,.12);
    const left=new THREE.Group(),right=new THREE.Group();left.position.set(-.8,1,.1);right.position.set(.8,1,.1);body.add(left,right);for(const arm of [left,right]){this.block(arm,0x428fae,0,0,0,.4,.3,.32);this.block(arm,0xe5b260,0,0,.28,.47,.46,.4);}
    for(const x of [-.33,.33]){b(0x3e8aa8,x,.33,0,.3,.52,.33);b(0xe9b45f,x,.1,.17,.4,.2,.55);}
    if(this.encounter.armored){b(0xacc4d1,0,1.73,0,1.3,.22,.85);b(0xeac766,0,1.94,0,.5,.22,.4);}
    const boss=this.encounter.boss;
    if(boss===5)for(const x of [-1,1])b(0xf49870,x,1,.4,.55,.65,.6);
    if(boss===10){b(0x77d9ee,0,2.55,0,.12,.85,.12);b(0x77d9ee,0,2.9,0,.7,.12,.15);}
    if(boss===15)for(const x of [-.65,.65]){b(0x73dbed,x,2.05,0,.22,.8,.3);b(0xe8b45a,x,2.5,0,.24,.2,.3);}
    if(boss===20)b(0x32485e,0,1.35,.57,1.35,.25,.16);
    if(boss===25)for(const x of [-.8,.8])b(0x87e6dc,x,1.1,0,.15,2.3,.9);
    if(boss===30){this.crown=b(0xecb75d,0,2.12,0,1.4,.25,.7);this.phaseMat=this.mat(0xff9b88);for(const x of [-.55,0,.55])b(0xa7e8ec,x,2.43,0,.24,x===0?.7:.45,.35);}
    return {root,body,left,right};
  }
  setTool(color){if(this.hero)this.hero.glove.material=this.mat(color);}
  resize(){if(this.disposed)return;const box=$('arena-frame').getBoundingClientRect();if(!box.width||!box.height)return;this.width=box.width;this.height=box.height;this.renderer.setSize(box.width,box.height,false);const aspect=box.width/box.height;const vertical=Math.max(12.5,13.8/aspect);this.camera.left=-vertical*aspect/2;this.camera.right=vertical*aspect/2;this.camera.top=vertical/2;this.camera.bottom=-vertical/2;this.camera.updateProjectionMatrix();joystick?.refresh();}
  project(x,y,z){const p=new THREE.Vector3(x,y,z).project(this.camera);return {x:(p.x*.5+.5)*this.width,y:(-.5*p.y+.5)*this.height};}
  impact(x,y,z,color,count){if(motionQuery.matches)return;let used=0;for(const fx of this.effects){if(fx.life>0)continue;const angle=used*2.4;fx.life=.45+(used%3)*.08;fx.max=fx.life;fx.mesh.visible=true;fx.mesh.position.set(x,y,z);fx.mesh.scale.setScalar(.09+(used%3)*.025);fx.vx=Math.cos(angle)*(2+used%3);fx.vz=Math.sin(angle)*(2+used%3);fx.vy=2+(used%4)*.7;if(++used>=count)break;}}
  update(dt){this.time+=dt;for(const o of this.obstacles)if(o.userData.moving){o.position.x=o.userData.baseX+Math.sin(this.time*.9+o.userData.index*Math.PI)*1.35;}
    for(const fx of this.effects)if(fx.life>0){fx.life-=dt;fx.vy-=9*dt;fx.mesh.position.x+=fx.vx*dt;fx.mesh.position.z+=fx.vz*dt;fx.mesh.position.y+=fx.vy*dt;fx.mesh.rotation.x+=dt*5;fx.mesh.rotation.z+=dt*3;fx.mesh.visible=fx.life>0;}
  }
  pose(model,a,isHero){
    const entrance=motionQuery.matches?1:clamp(this.time/.3,0,1);model.root.scale.setScalar(1-.18*Math.pow(1-entrance,3));
    model.root.position.set(a.x,(a.dodge>0?Math.sin((.27-a.dodge)/.27*Math.PI)*.35:0)+(1-entrance)*.25,a.z);model.root.rotation.y=Math.atan2(a.faceX,a.faceZ);
    const walking=Math.hypot(a.vx,a.vz)>.5;const bob=walking&&!motionQuery.matches?Math.sin(this.time*14)*.035:0;
    model.body.position.y=bob;model.body.rotation.z=a.hit>0&&!motionQuery.matches?Math.sin(a.hit*30)*.08:0;
    model.hitRing.visible=a.hit>0;model.body.rotation.x=a.hp<=0&&!motionQuery.matches?-Math.min(1,(.5-state.settle)/.5)*1.25:0;
    const wind=!isHero&&a.phase==='windup';const recovery=!isHero&&a.phase==='recover';model.body.scale.set(1,wind?.88:recovery?.94:1,1);
    model.left.rotation.x=walking?Math.sin(this.time*10)*.16:0;
    model.right.position.z=.35+(isHero&&a.swing>0?Math.sin((.28-a.swing)/.28*Math.PI)*.75:0);model.right.rotation.x=isHero&&a.swing>0?-.3:0;
    if(isHero){this.range.position.x=a.x;this.range.position.z=a.z;this.range.visible=state.mode==='playing'&&a.cooldown<=0;}
  }
  render(){if(this.disposed||!state.player)return;this.pose(this.hero,state.player,true);this.pose(this.rival,state.rival,false);const r=state.rival;
    for(const signal of this.relayIndicators)signal.material=this.mat(r.phase==='windup'||r.phase==='charge'?0xffec78:0xffb83b);
    this.danger.visible=state.mode==='playing'&&(r.phase==='windup'||r.phase==='charge');if(this.danger.visible){const bx=this.encounter.bounds||3.9,sx=r.phase==='windup'?r.x:r.startX,sz=r.phase==='windup'?r.z:r.startZ;const edgeX=Math.abs(r.aimX)>.001?((r.aimX>0?bx:-bx)-sx)/r.aimX:99;const edgeZ=Math.abs(r.aimZ)>.001?((r.aimZ>0?4.45:-4.45)-sz)/r.aimZ:99;const length=Math.max(.2,Math.min(5.2,edgeX,edgeZ));this.danger.scale.z=length;this.danger.position.set(sx+r.aimX*length/2,.06,sz+r.aimZ*length/2);this.danger.rotation.y=Math.atan2(r.aimX,r.aimZ);this.dangerMat.opacity=r.phase==='charge'?.6:motionQuery.matches?.4:.28+(Math.sin(this.time*12)+1)*.08;}
    const e=encounterRules();if(this.crown)this.crown.material=r.finalPhase?this.phaseMat:this.mat(0xecb75d);this.shield.visible=state.mode==='playing'&&!!e.chargedShield&&r.shieldBreak<=0;this.shield.position.set(r.x,1.2,r.z);this.shield.rotation.y=this.time*.35;
    this.magnetRing.visible=r.phase==='magnet';this.magnetRing.position.set(r.x,.11,r.z);
    this.pulseRings.forEach((mesh,i)=>{const warning=r.phase==='pulseWindup',age=1.6-r.phaseTime-i*.35;mesh.visible=state.mode==='playing'&&i<(e.pulseWaves||1)&&(warning||r.phase==='pulse'&&age>=0);const radius=warning?5:.5+Math.max(0,age)*5.8;mesh.scale.setScalar(radius/.69);mesh.position.set(warning?r.x:r.pulseX,.1,warning?r.z:r.pulseZ);mesh.material.opacity=warning?.24:.9;});
    this.pads.forEach((pad,i)=>{const point=this.project(pad.position.x,.35,pad.position.z),tag=this.padTags[i];tag.style.left=`${point.x}px`;tag.style.top=`${point.y}px`;});
    this.renderer.render(this.scene,this.camera);
    const tags=[[state.player,'hero-tag'],[state.rival,'rival-tag']].map(([actor,id])=>({id,...this.project(actor.x,2.45,actor.z)}));
    // Close contact must never turn the two actor names into one unreadable tag.
    if(Math.abs(tags[0].x-tags[1].x)<68&&Math.abs(tags[0].y-tags[1].y)<27)tags[1].y=Math.min(tags[1].y,tags[0].y-28);
    for(const tag of tags){$(tag.id).style.left=`${clamp(tag.x,25,this.width-25)}px`;$(tag.id).style.top=`${clamp(tag.y,24,this.height-12)}px`;}
    // Read-only engineering resource observation, never an input to simulation.
    const info=this.renderer.info;Object.assign($('arena').dataset,{renderer:'REALTIME_3D',threeRevision:THREE.REVISION,drawCalls:String(info.render.calls),triangles:String(info.render.triangles),geometries:String(info.memory.geometries),textures:String(info.memory.textures)});
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.resizeObserver?.disconnect();const canvas=this.renderer?.domElement;canvas?.removeEventListener('webglcontextlost',this.lost);canvas?.removeEventListener('webglcontextrestored',this.restored);for(const resource of this.resources)resource.dispose?.();this.resources.clear();this.materials.clear();this.renderer?.dispose();this.renderer?.forceContextLoss();this.padTags?.forEach(node=>node.remove());this.effects.length=0;this.obstacles.length=0;this.scene?.clear();}
}

// Keyboard ownership is limited to live Battle and excludes settings/dialog controls.
const movementKeys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS'];
function canInput(){return state.mode==='playing'&&!state.paused&&!document.querySelector('#battle-screen .wp-frame-popover:not([hidden])');}
window.addEventListener('keydown',event=>{
  if(!canInput()||event.target.closest?.('select,input,textarea,[contenteditable="true"]'))return;
  const key=event.code;if(movementKeys.includes(key)){event.preventDefault();state.keys.add(key);}
  if(key==='Space'){event.preventDefault();state.held=true;if(!event.repeat)attack();}
  if(['ShiftLeft','ShiftRight'].includes(key)){event.preventDefault();if(!event.repeat)dodge();}
  if(/^Digit[1-3]$/.test(key)){event.preventDefault();selectTool(Number(key.slice(-1))-1);}
});
window.addEventListener('keyup',event=>{state.keys.delete(event.code);if(event.code==='Space')state.held=false;});
document.querySelectorAll('[data-key]').forEach(button=>{
  const key=button.dataset.key;const release=()=>{state.keys.delete(key);if(key==='Space')state.held=false;button.classList.remove('pressed');};
  button.addEventListener('pointerdown',event=>{if(!canInput())return;event.preventDefault();button.setPointerCapture(event.pointerId);button.classList.add('pressed');if(key==='Space'){state.held=true;attack();}else if(key==='ShiftLeft')dodge();else state.keys.add(key);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,release);
  // Native keyboard/switch activation does not generate pointerdown.
  button.addEventListener('click',event=>{if(event.detail!==0||!canInput())return;if(key==='Space')attack();else if(key==='ShiftLeft')dodge();else{state.keys.add(key);requestAnimationFrame(()=>state.keys.delete(key));}});
});
$('tool-controls').innerHTML=kits.map((kit,i)=>`<button type="button" data-tool="${i}" aria-pressed="${i===0}"><span class="tool-symbol" aria-hidden="true">${kit.symbol}</span><span><b>${copy[kit.name]}</b><small>−${kit.damage} · ↔${kit.force}</small></span></button>`).join('');
document.querySelectorAll('[data-tool]').forEach(button=>{button.title=(TOOL_GUIDE[locale]||TOOL_GUIDE.en)[Number(button.dataset.tool)];button.addEventListener('click',()=>{selectTool(button.dataset.tool);sound('ui.click');});});
$('start-game').textContent=t('start');$('main-summary').textContent=t('goal');$('strike-copy').textContent=t('attack');$('dodge-copy').textContent=t('dodge');$('player-name').textContent=healthCopy.you;$('rival-name').textContent=healthCopy.rival;$('arena').setAttribute('aria-label',t('controls'));$('stage-back').setAttribute('aria-label',stageCopy.stageBack);$('battle-back').setAttribute('aria-label',stageCopy.battleBack);$('dodge-button').setAttribute('aria-label',t('dodge'));document.querySelector('.direction-controls').setAttribute('aria-label',t('move'));
document.querySelectorAll('[data-key^="Arrow"]').forEach(button=>button.setAttribute('aria-label',`${t('move')} ${button.textContent}`));
$('start-game').addEventListener('click',()=>show('stage'));$('stage-back').addEventListener('click',()=>show('main'));$('battle-back').addEventListener('click',()=>{if(['result','loading','error'].includes(state.mode)){state.mode='idle';show('stage');}else pause();});
$('battle-leave-continue').addEventListener('click',continueBattle);$('battle-leave-confirm').addEventListener('click',()=>{state.mode='idle';show('stage');});
$('to-stages').addEventListener('click',()=>{state.mode='idle';show('stage');});$('next').addEventListener('click',()=>{if(!$('next').disabled)startArena(state.arena+1);});$('retry').addEventListener('click',()=>{restarted=true;startArena(state.arena,state.practice);});
$('render-retry').addEventListener('click',()=>{if(importFailure){location.reload();return;}state.mode='idle';startArena(state.arena,state.practice);});$('render-back').addEventListener('click',()=>{state.mode='idle';show('stage');});
document.addEventListener('keydown',event=>{const dialog=!$('battle-leave-dialog').hidden?$('battle-leave-dialog'):!$('result-screen').hidden?$('result-screen'):null;if(!dialog)return;if(event.key==='Escape'&&state.paused){event.preventDefault();continueBattle();return;}if(event.key!=='Tab')return;const buttons=[...dialog.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}else if(!dialog.contains(document.activeElement)){event.preventDefault();first.focus();}});
document.addEventListener('visibilitychange',()=>{clearInput();if(document.hidden)pause();});window.addEventListener('blur',clearInput);
// Shared settings remain the one settings owner; freeze simulation while open.
window.addEventListener('weightplay:interaction-state',()=>{clearInput();const open=!!document.querySelector('#battle-screen .wp-frame-popover:not([hidden])');if(open&&['playing','settling'].includes(state.mode)&&!state.paused){state.paused=true;stopLoop();joystick?.setEnabled(false);}else if(!open&&state.paused&&$('battle-leave-dialog').hidden){state.paused=false;joystick?.setEnabled(state.mode==='playing');resumeLoop();}observe();});
$('localeSelect').value=locale;$('localeSelect').addEventListener('change',()=>{const segments={'zh-Hant':'zh-tw','zh-Hans':'zh-cn','pt-BR':'pt-br'};const value=$('localeSelect').value;try{localStorage.setItem('weightPlayLocale',value);}catch{}location.href=`/${segments[value]||value}/games/${GAME_ID}/`;});
window.addEventListener('pagehide',()=>{state.generation++;stopLoop();joystick?.destroy();joystick=null;world?.dispose();world=null;});
window.addEventListener('pageshow',event=>{if(event.persisted){state.mode='idle';show('main');}});
updateProgress();show('main');
