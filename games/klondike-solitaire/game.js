(function () {
  "use strict";

  const {
    Card,
    Deck,
    Tableau,
    Foundation,
    Stock,
    Waste,
    RuleEngine,
    SoundEngine,
  } = window.WPCardEngine;

  const SUITS = ["spades", "hearts", "clubs", "diamonds"];
  const SUIT_SYMBOLS = {
    spades: "\u2660",
    hearts: "\u2665",
    clubs: "\u2663",
    diamonds: "\u2666",
  };
  const RANK_LABELS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const DRAW_MODES = [1, 3];
  const DRAW_MODE_LABEL_KEYS = ["ui.draw_mode.option_1", "ui.draw_mode.option_3"];
  const STORAGE_STATS = "klondike_solitaire_stats_v2";
  const STORAGE_SOUND = "card_games_sound_v1";
  const STORAGE_LAYOUT = "klondike_solitaire_layout_v1";
const LOCALE_DEFAULT = "en";
  const HINT_MS = 2300;
  const AUTO_FINISH_STEP_MS = 56;
  const DEAL_STEP_MS = 42;
  const DEAL_SOUND_INTERVAL = 2;
  const DEAL_INITIAL_DELAY_MS = 140;
  const CARD_DEAL_MAX_DELAY = 22;
  const VICTORY_STEP_MS = 90;
  const CLICK_MOVED_THRESHOLD = 8;
  const TABLEAU_SELECTION_GUTTER = 8;
  const MIN_TABLEAU_REVEAL_STEP = 18;
  const NO_MOVES_MESSAGE = "ui.hint.no_moves";
  const DEFAULT_META_KEYWORDS = "Solitaire,Klondike,Classic Solitaire,Free Solitaire,Play Solitaire Online,Card Game,Patience";
const SUPPORTED_LOCALES = [
    "en",
    "zh-Hant",
    "zh-Hans",
    "ja",
    "ko",
    "es",
    "pt-BR",
    "fr",
    "de",
    "it",
  "ru",
  "hi",
  "ar",
];
const LOCALE_CANONICAL_MAP = Object.freeze({
  "en": "en",
  "zh-hant": "zh-Hant",
  "zh-hans": "zh-Hans",
  "zh-tw": "zh-Hant",
  "zh-cn": "zh-Hans",
  "ja": "ja",
  "ko": "ko",
  "es": "es",
  "pt-br": "pt-BR",
  "fr": "fr",
  "de": "de",
  "it": "it",
  "ru": "ru",
  "hi": "hi",
  "ar": "ar",
});
const KL_I18N = {
    "en": {
      "ui.loading.preparing": "Preparing...",
      "ui.loading.shuffling": "Shuffling...",
      "ui.loading.dealing": "Dealing cards...",
      "ui.loading.preparing_cards": "Preparing cards...",
      "ui.loading.ready": "Ready",
      "ui.sound.on": "Sound: On",
      "ui.sound.off": "Sound: Off",
      "ui.sound.aria_on": "Sound on",
      "ui.sound.aria_off": "Sound off",
      "ui.stats.wins": "Wins: {wins}",
      "ui.stats.losses": "Losses: {losses}",
      "ui.stats.win_rate": "Win rate: {ratio}%",
      "ui.stats.fastest_time": "Fastest time: {time}",
      "ui.stats.least_moves": "Least moves: {moves}",
      "ui.board.empty_stock": "Stock",
      "ui.board.empty_waste": "Waste",
      "ui.aria.stock": "Stock pile, {count} cards remaining",
      "ui.aria.waste": "Waste pile, {count} visible cards",
      "ui.aria.foundation": "{suit} foundation",
      "ui.card.face_down": "Face-down card",
      "ui.draw_mode.label": "Draw Mode",
      "ui.draw_mode.value": "{label}",
      "ui.draw_mode.toggle": "Draw Mode: {label}",
      "ui.draw_mode.option_1": "Draw 1",
      "ui.draw_mode.option_3": "Draw 3",
      "ui.hint.no_moves": "No moves available.",
      "ui.hint.draw_stock": "Draw from Stock to continue.",
      "ui.hint.recycle_waste": "Recycle Waste to continue.",
      "ui.hint.multi_destinations": "Multiple destinations available. Drag to choose.",
      "ui.hint.move_waste_destination": "Hint: move the waste card to a highlighted destination.",
      "ui.hint.move_tableau_foundation": "Hint: move this tableau card to a foundation.",
      "ui.hint.move_tableau_stack": "Hint: move this tableau stack to a highlighted tableau.",
      "ui.hint.auto_finish_blocked": "Auto Finish is available when only foundation moves remain.",
      "ui.hint.no_foundation_moves": "No foundation-only moves now.",
      "ui.feedback.undo_applied": "Undo applied.",
      "ui.result.fastest": "Fastest: {time}",
      "ui.result.least": "Least moves: {moves}",
      "ui.result.records": "Wins: {wins} · Losses: {losses} · Win rate: {ratio}%",
    "ui.result.record_time": "New best time!",
    "ui.result.record_moves": "New least-moves record!",
    "ui.result.victory_prefix": "Victory in {time} with {moves} moves.",
    "ui.result.victory_body": "{fastest} · {least}",
    "ui.title": "Klondike Solitaire",
    "ui.hero.title": "Klondike Solitaire",
    "ui.hero.kicker": "Classic Card Game",
    "ui.hero.copy": "A refined Klondike run with smoother motion, cleaner controls, and long-session performance. Play from phone or desktop with drag-and-drop, one-click moves, auto finish, Undo history, and live hints.",
    "ui.feature.target_title": "Target",
    "ui.feature.target_text": "Build all four foundations from A to K.",
    "ui.feature.features_title": "Features",
    "ui.feature.features_text": "Single/Multi-card drag, one-click auto-move, Draw 1/3, hint, and auto finish.",
    "ui.feature.performance_title": "Performance",
    "ui.feature.performance_text": "Transform-only card movement, reduced re-render churn, and continuous animation tuning.",
    "ui.nav.back_to_lobby": "Back to lobby",
    "ui.nav.back_to_main": "Back to main screen",
    "ui.header.moves": "Moves",
    "ui.header.time": "Time",
    "ui.battle.controls_label": "Controls",
    "ui.action.new_game": "New Game",
    "ui.action.restart": "Restart Current Game",
    "ui.action.start": "Start Game",
    "ui.action.undo": "Undo",
    "ui.action.hint": "Hint",
    "ui.action.auto_finish": "Auto Finish",
    "ui.board.foundations": "Foundations",
    "ui.board.tableau": "Tableau",
    "ui.result.title": "Game Complete",
    "ui.result.new_game": "New Game",
    "ui.result.restart": "Restart",
    "ui.result.return": "Return",
    "ui.meta.title": "Klondike Solitaire Online - Play Free Classic Solitaire",
    "ui.meta.description": "Play the classic Klondike Solitaire online for free. Enjoy smooth gameplay on mobile and desktop with no download required.",
    "ui.meta.keywords": "Solitaire,Klondike,Classic Solitaire,Free Solitaire,Play Solitaire Online,Card Game,Patience",
  },
    "zh-Hant": {
      "ui.loading.preparing": "準備中...",
      "ui.loading.shuffling": "洗牌中...",
      "ui.loading.dealing": "發牌中...",
      "ui.loading.preparing_cards": "準備翻牌...",
      "ui.loading.ready": "開始",
      "ui.sound.on": "音效：開",
      "ui.sound.off": "音效：關",
      "ui.sound.aria_on": "開啟音效",
      "ui.sound.aria_off": "關閉音效",
      "ui.stats.wins": "勝局：{wins}",
      "ui.stats.losses": "敗局：{losses}",
      "ui.stats.win_rate": "勝率：{ratio}%",
      "ui.stats.fastest_time": "最佳時間：{time}",
      "ui.stats.least_moves": "最少步數：{moves}",
      "ui.board.empty_stock": "牌庫",
      "ui.board.empty_waste": "棄牌堆",
      "ui.aria.stock": "牌庫，尚有 {count} 張牌",
      "ui.aria.waste": "棄牌堆，目前可見 {count} 張牌",
      "ui.aria.foundation": "{suit} 的基底",
      "ui.card.face_down": "背面牌",
      "ui.draw_mode.label": "發牌模式",
      "ui.draw_mode.value": "{label}",
      "ui.draw_mode.toggle": "發牌模式：{label}",
      "ui.draw_mode.option_1": "抽 1 張",
      "ui.draw_mode.option_3": "抽 3 張",
      "ui.hint.no_moves": "目前無可行動。",
      "ui.hint.draw_stock": "請從牌庫抽牌。",
      "ui.hint.recycle_waste": "請回收棄牌堆再繼續。",
      "ui.hint.multi_destinations": "有多個目的地可放，請拖曳選擇。",
      "ui.hint.move_waste_destination": "提示：將棄牌堆頂牌移動至高亮目的地。",
      "ui.hint.move_tableau_foundation": "提示：將此牌移到對應基底。",
      "ui.hint.move_tableau_stack": "提示：將此牌序列拖曳到高亮牌柱。",
      "ui.hint.auto_finish_blocked": "僅當剩餘可動作為基底收牌時，才可使用自動完成。",
      "ui.hint.no_foundation_moves": "目前沒有只可收基底的移動。",
      "ui.feedback.undo_applied": "已回退上一步。",
      "ui.result.fastest": "最快完成：{time}",
      "ui.result.least": "最少步數：{moves}",
      "ui.result.records": "勝局：{wins} · 敗局：{losses} · 勝率：{ratio}%",
    "ui.result.record_time": "刷新最佳時間！",
    "ui.result.record_moves": "刷新最少步數紀錄！",
    "ui.result.victory_prefix": "你以 {time} 完成並用了 {moves} 手。",
    "ui.result.victory_body": "{fastest} · {least}",
      "ui.title": "Klondike 接龍",
      "ui.hero.title": "Klondike 接龍",
    "ui.hero.kicker": "經典紙牌遊戲",
    "ui.hero.copy": "一副經典撲克牌，搭配現代動畫與長時間對局效能。支援手機與桌機，享受順暢拖拽、單點移動、自動完成、步數回退與即時提示。",
    "ui.feature.target_title": "目標",
    "ui.feature.target_text": "將 A 至 K 全部收齊到四個基座。",
    "ui.feature.features_title": "特色",
    "ui.feature.features_text": "支援單/多張同時拖曳、單點自動移牌、抽牌模式 1/3、提示與自動完成。",
    "ui.feature.performance_title": "效能",
    "ui.feature.performance_text": "僅使用 transform 移動卡片，降低重繪負擔，並持續微調動畫效能。",
    "ui.nav.back_to_lobby": "返回主選單",
    "ui.nav.back_to_main": "返回主畫面",
    "ui.header.moves": "步數",
    "ui.header.time": "時間",
    "ui.battle.controls_label": "操作控制",
    "ui.action.new_game": "開始新局",
    "ui.action.restart": "重新開始此局",
    "ui.action.start": "開始",
    "ui.action.undo": "回退",
    "ui.action.hint": "提示",
    "ui.action.auto_finish": "自動完成",
    "ui.board.foundations": "基底堆",
    "ui.board.tableau": "牌列",
    "ui.result.title": "遊戲完成",
    "ui.result.new_game": "新局開始",
    "ui.result.restart": "重玩",
    "ui.result.return": "返回",
      "ui.meta.title": "Klondike 接龍 - 免費經典紙牌遊戲",
      "ui.meta.description": "免費玩經典 Klondike 接龍。在手機與桌機上享受順暢遊戲體驗，不需下載。",
    "ui.meta.keywords": "紙牌, Klondike, 經典紙牌, 免費紙牌, 線上紙牌, 卡牌遊戲, 益智遊戲",
  },
    "zh-Hans": {
      "ui.loading.preparing": "准备中...",
      "ui.loading.shuffling": "洗牌中...",
      "ui.loading.dealing": "发牌中...",
      "ui.loading.preparing_cards": "准备翻牌...",
      "ui.loading.ready": "开始",
      "ui.sound.on": "音效：开",
      "ui.sound.off": "音效：关",
      "ui.sound.aria_on": "开启音效",
      "ui.sound.aria_off": "关闭音效",
      "ui.stats.wins": "胜局：{wins}",
      "ui.stats.losses": "败局：{losses}",
      "ui.stats.win_rate": "胜率：{ratio}%",
      "ui.stats.fastest_time": "最快时间：{time}",
      "ui.stats.least_moves": "最少步数：{moves}",
      "ui.board.empty_stock": "牌库",
      "ui.board.empty_waste": "弃牌堆",
      "ui.aria.stock": "牌库，剩余 {count} 张牌",
      "ui.aria.waste": "弃牌堆，当前可见 {count} 张牌",
      "ui.aria.foundation": "{suit} 基础区",
      "ui.card.face_down": "背面牌",
      "ui.draw_mode.label": "发牌模式",
      "ui.draw_mode.value": "{label}",
      "ui.draw_mode.toggle": "发牌模式：{label}",
      "ui.draw_mode.option_1": "抽 1 张",
      "ui.draw_mode.option_3": "抽 3 张",
      "ui.hint.no_moves": "当前无可用动作。",
      "ui.hint.draw_stock": "请从牌库抽牌继续。",
      "ui.hint.recycle_waste": "请回收弃牌堆继续。",
      "ui.hint.multi_destinations": "可放置目标不止一个，请拖拽选择。",
      "ui.hint.move_waste_destination": "提示：将弃牌堆顶牌移到高亮目标。",
      "ui.hint.move_tableau_foundation": "提示：将此牌移到对应基底。",
      "ui.hint.move_tableau_stack": "提示：将此牌序列移到高亮牌列。",
      "ui.hint.auto_finish_blocked": "只在仅剩基底收牌动作时可启用自动完成。",
      "ui.hint.no_foundation_moves": "目前没有只可基底移牌。",
      "ui.feedback.undo_applied": "已回退。",
      "ui.result.fastest": "最快：{time}",
      "ui.result.least": "最少步数：{moves}",
      "ui.result.records": "胜局：{wins} · 败局：{losses} · 胜率：{ratio}%",
    "ui.result.record_time": "刷新最佳时间！",
    "ui.result.record_moves": "刷新最少步数纪录！",
    "ui.result.victory_prefix": "你在 {time} 取胜，共用了 {moves} 步。",
    "ui.result.victory_body": "{fastest} · {least}",
      "ui.title": "Klondike 接龙",
      "ui.hero.title": "Klondike 接龙",
    "ui.hero.kicker": "经典纸牌游戏",
    "ui.hero.copy": "一副经典纸牌游戏，结合现代动画与长局表现。支持手机与桌面端，享受流畅拖拽、单击移动、自动收牌、悔棋与实时提示。",
    "ui.feature.target_title": "目标",
    "ui.feature.target_text": "把四个基座都从A堆到K堆满。",
    "ui.feature.features_title": "特性",
    "ui.feature.features_text": "支持单张/多张拖拽、单击自动移动、抽牌模式1/3、提示与自动完成。",
    "ui.feature.performance_title": "性能",
    "ui.feature.performance_text": "仅使用 transform 移动卡片，减少重绘压力，并持续优化动画。",
    "ui.nav.back_to_lobby": "返回主界面",
    "ui.nav.back_to_main": "返回主界面",
    "ui.header.moves": "步数",
    "ui.header.time": "时间",
    "ui.battle.controls_label": "控制项",
    "ui.action.new_game": "新游戏",
    "ui.action.restart": "重新开始",
    "ui.action.start": "开始",
    "ui.action.undo": "撤销",
    "ui.action.hint": "提示",
    "ui.action.auto_finish": "自动完成",
    "ui.board.foundations": "基础区",
    "ui.board.tableau": "牌列",
    "ui.result.title": "游戏完成",
    "ui.result.new_game": "再玩一局",
    "ui.result.restart": "重玩",
    "ui.result.return": "返回",
      "ui.meta.title": "Klondike 接龙 - 免费经典纸牌游戏",
      "ui.meta.description": "免费在线玩经典 Klondike 接龙。支持手机与桌面端，不用下载，体验流畅。",
    "ui.meta.keywords": "纸牌,克朗代克,经典接龙,免费接龙,在线接龙,卡牌游戏,耐心游戏",
  },
  };
  const LOCALE_I18N_OVERRIDES = {
    "ja": {
      "ui.title": "クロンダイク・ソリティア",
      "ui.hero.title": "クロンダイク・ソリティア",
      "ui.hero.kicker": "クラシックカードゲーム",
      "ui.hero.copy": "クラシックなトランプを使ったクラシックソリティア。モバイルとデスクトップで快適なドラッグ操作、ワンタップ移動、自動完了、取り消し、ヒントをお楽しみください。",
      "ui.nav.back_to_lobby": "ロビーに戻る",
      "ui.nav.back_to_main": "メイン画面へ戻る",
      "ui.feature.target_title": "目標",
      "ui.feature.target_text": "4つの組札をエースからキングへそろえます。",
      "ui.feature.features_title": "機能",
      "ui.feature.features_text": "1枚/複数枚ドラッグ、ワンタップ自動移動、1/3ドロー、ヒント、自動完了。",
      "ui.feature.performance_title": "パフォーマンス",
      "ui.feature.performance_text": "トランスフォーム移動中心で、再描画を抑えて長時間プレイも滑らかに。",
      "ui.board.empty_stock": "山札",
      "ui.board.empty_waste": "捨て札",
      "ui.aria.stock": "山札、残り{count}枚",
      "ui.aria.waste": "捨て札、表向き{count}枚",
      "ui.draw_mode.label": "引きモード",
      "ui.draw_mode.toggle": "引きモード: {label}",
      "ui.draw_mode.option_1": "1枚",
      "ui.draw_mode.option_3": "3枚",
      "ui.action.new_game": "新規ゲーム",
      "ui.action.restart": "同じ盤面へ再開",
      "ui.action.start": "開始",
      "ui.action.undo": "元に戻す",
      "ui.action.hint": "ヒント",
      "ui.action.auto_finish": "自動完了",
      "ui.result.title": "ゲームクリア",
      "ui.result.new_game": "新しいゲーム",
      "ui.result.restart": "リスタート",
      "ui.result.return": "戻る",
      "ui.meta.title": "Klondike ソリティア - 無料でクラシックソリティアを楽しむ",
      "ui.meta.description": "クラシックなクロンダイクソリティアを無料でモバイルとデスクトップでプレイ。インストール不要。",
    },
    "ko": {
      "ui.title": "클론다이크 소리테어",
      "ui.hero.title": "클론다이크 소리테어",
      "ui.hero.kicker": "클래식 카드 게임",
      "ui.hero.copy": "고전 카드 한 벌로 이루어진 클래식 소리테어. 모바일과 데스크톱에서 부드러운 드래그, 탭 이동, 자동 완성, 되돌리기, 힌트를 즐기세요.",
      "ui.nav.back_to_lobby": "로비로 돌아가기",
      "ui.nav.back_to_main": "메인으로 돌아가기",
      "ui.board.empty_stock": "덱",
      "ui.board.empty_waste": "버리는 더미",
      "ui.aria.stock": "덱, 남은 {count}장",
      "ui.aria.waste": "버린 카드, 보이는 카드 {count}장",
      "ui.feature.target_title": "목표",
      "ui.feature.target_text": "네 곳의 기초 더미를 A부터 K까지 채우세요.",
      "ui.draw_mode.label": "드로우 모드",
      "ui.draw_mode.toggle": "드로우 모드: {label}",
      "ui.draw_mode.option_1": "1장",
      "ui.draw_mode.option_3": "3장",
      "ui.action.new_game": "새 게임",
      "ui.action.restart": "현재 게임 재시작",
      "ui.action.start": "시작",
      "ui.action.undo": "실행 취소",
      "ui.action.hint": "힌트",
      "ui.action.auto_finish": "자동 완료",
      "ui.result.title": "게임 완료",
      "ui.result.new_game": "새 게임",
      "ui.result.restart": "재시작",
      "ui.result.return": "돌아가기",
      "ui.meta.title": "클론다이크 소리테어 무료 온라인 플레이",
      "ui.meta.description": "무료로 클래식 클론다이크 소리테어를 플레이하세요. 다운로드 없이 모바일과 데스크톱에서 부드럽게.",
    },
    "es": {
      "ui.title": "Solitario Klondike",
      "ui.hero.title": "Solitario Klondike",
      "ui.hero.kicker": "Juego de cartas clásico",
      "ui.hero.copy": "Solitaire clásico con animación moderna. Compatible con móvil y escritorio, arrastra cartas con fluidez, mueve con un toque, usa deshacer y sugerencias.",
      "ui.nav.back_to_lobby": "Volver al lobby",
      "ui.nav.back_to_main": "Volver a la pantalla principal",
      "ui.board.empty_stock": "Mazo",
      "ui.board.empty_waste": "Descarte",
      "ui.aria.stock": "Mazo, quedan {count} cartas",
      "ui.aria.waste": "Descarte, visibles {count} cartas",
      "ui.draw_mode.label": "Modo de robo",
      "ui.draw_mode.toggle": "Modo de robo: {label}",
      "ui.draw_mode.option_1": "Robar 1",
      "ui.draw_mode.option_3": "Robar 3",
      "ui.action.new_game": "Nuevo juego",
      "ui.action.restart": "Reiniciar partida actual",
      "ui.action.start": "Empezar",
      "ui.action.undo": "Deshacer",
      "ui.action.hint": "Pista",
      "ui.action.auto_finish": "Finalización automática",
      "ui.result.title": "Juego completado",
      "ui.result.new_game": "Nuevo juego",
      "ui.result.restart": "Reintentar",
      "ui.result.return": "Volver",
      "ui.meta.title": "Solitaire Klondike en línea gratis",
      "ui.meta.description": "Juega Klondike Solitaire gratis en línea. Disfruta de ritmo fluido en móvil y escritorio sin descargar.",
    },
    "pt-BR": {
      "ui.title": "Solitário Klondike",
      "ui.hero.title": "Solitário Klondike",
      "ui.hero.kicker": "Jogo de cartas clássico",
      "ui.hero.copy": "Solitaire clássico com animação moderna. Jogue no celular ou desktop com arrastar e soltar fluido, desfazer, dicas e finalização automática.",
      "ui.nav.back_to_lobby": "Voltar ao lobby",
      "ui.nav.back_to_main": "Voltar à tela principal",
      "ui.board.empty_stock": "Compra",
      "ui.board.empty_waste": "Descarte",
      "ui.aria.stock": "Compra, {count} cartas restantes",
      "ui.aria.waste": "Descarte, {count} cartas visíveis",
      "ui.draw_mode.label": "Modo de compra",
      "ui.draw_mode.toggle": "Modo de compra: {label}",
      "ui.draw_mode.option_1": "Puxar 1",
      "ui.draw_mode.option_3": "Puxar 3",
      "ui.action.new_game": "Novo jogo",
      "ui.action.restart": "Reiniciar partida",
      "ui.action.start": "Começar",
      "ui.action.undo": "Desfazer",
      "ui.action.hint": "Dica",
      "ui.action.auto_finish": "Conclusão automática",
      "ui.result.title": "Jogo concluído",
      "ui.result.new_game": "Novo jogo",
      "ui.result.restart": "Repetir",
      "ui.result.return": "Voltar",
      "ui.meta.title": "Solitário Klondike Online - Jogue grátis",
      "ui.meta.description": "Jogue Klondike Solitaire clássico de graça, no celular ou no computador, sem baixar nada.",
    },
    "fr": {
      "ui.title": "Klondike Solitaire",
      "ui.hero.title": "Klondike Solitaire",
      "ui.hero.kicker": "Jeu de cartes classique",
      "ui.hero.copy": "Un solitaire classique avec animations modernes : glisser-déposer fluide sur mobile et ordinateur, annulation, indice et auto-fin de partie.",
      "ui.nav.back_to_lobby": "Retour au lobby",
      "ui.nav.back_to_main": "Retour à l'écran principal",
      "ui.board.empty_stock": "Talon",
      "ui.board.empty_waste": "Défausse",
      "ui.aria.stock": "Talon, {count} cartes restantes",
      "ui.aria.waste": "Défausse, {count} cartes visibles",
      "ui.draw_mode.label": "Mode de tirage",
      "ui.draw_mode.toggle": "Mode de tirage : {label}",
      "ui.draw_mode.option_1": "Tirer 1",
      "ui.draw_mode.option_3": "Tirer 3",
      "ui.action.new_game": "Nouveau jeu",
      "ui.action.restart": "Redémarrer",
      "ui.action.start": "Commencer",
      "ui.action.undo": "Annuler",
      "ui.action.hint": "Indice",
      "ui.action.auto_finish": "Auto-finir",
      "ui.result.title": "Partie terminée",
      "ui.result.new_game": "Nouveau jeu",
      "ui.result.restart": "Rejouer",
      "ui.result.return": "Retour",
      "ui.meta.title": "Klondike Solitaire en ligne gratuit",
      "ui.meta.description": "Jouez au solitaire Klondike classique gratuitement sur mobile et ordinateur, sans téléchargement.",
    },
    "de": {
      "ui.title": "Klondike-Solitär",
      "ui.hero.title": "Klondike-Solitär",
      "ui.hero.kicker": "Klassisches Kartenspiel",
      "ui.hero.copy": "Klassischer Solitär mit moderner Animation, flüssig auf Handy und Desktop. Ziehen, einmal tippen, Rückgängig, Hinweise und automatischer Abschluss sind enthalten.",
      "ui.nav.back_to_lobby": "Zurück zum Lobby",
      "ui.nav.back_to_main": "Zurück zum Hauptbildschirm",
      "ui.board.empty_stock": "Nachziehstapel",
      "ui.board.empty_waste": "Ablagestapel",
      "ui.aria.stock": "Nachziehstapel, {count} Karten übrig",
      "ui.aria.waste": "Ablagestapel, {count} sichtbare Karten",
      "ui.draw_mode.label": "Ziehmodus",
      "ui.draw_mode.toggle": "Ziehmodus: {label}",
      "ui.draw_mode.option_1": "1 ziehen",
      "ui.draw_mode.option_3": "3 ziehen",
      "ui.action.new_game": "Neues Spiel",
      "ui.action.restart": "Aktuelles Spiel neu starten",
      "ui.action.start": "Starten",
      "ui.action.undo": "Rückgängig",
      "ui.action.hint": "Hinweis",
      "ui.action.auto_finish": "Automatisch beenden",
      "ui.result.title": "Spiel beendet",
      "ui.result.new_game": "Neues Spiel",
      "ui.result.restart": "Neu starten",
      "ui.result.return": "Zurück",
      "ui.meta.title": "Kostenlos Klondike Solitaire online",
      "ui.meta.description": "Spiele den klassischen Klondike-Solitär online kostenlos auf Handy und Desktop ohne Download.",
    },
    "it": {
      "ui.title": "Solitaire Klondike",
      "ui.hero.title": "Solitaire Klondike",
      "ui.hero.kicker": "Gioco di carte classico",
      "ui.hero.copy": "Solitaire classico con animazioni moderne, fluido su mobile e desktop. Trascina le carte, muovi con un tocco, annulla, suggerimenti e auto-fine.",
      "ui.nav.back_to_lobby": "Torna al lobby",
      "ui.nav.back_to_main": "Torna alla schermata principale",
      "ui.board.empty_stock": "Mazzo",
      "ui.board.empty_waste": "Scarto",
      "ui.aria.stock": "Mazzo, {count} carte rimanenti",
      "ui.aria.waste": "Scarto, {count} carte visibili",
      "ui.draw_mode.label": "Modalità pesca",
      "ui.draw_mode.toggle": "Modalità pesca: {label}",
      "ui.draw_mode.option_1": "Pesca 1",
      "ui.draw_mode.option_3": "Pesca 3",
      "ui.action.new_game": "Nuova partita",
      "ui.action.restart": "Ricomincia partita",
      "ui.action.start": "Inizia",
      "ui.action.undo": "Annulla",
      "ui.action.hint": "Suggerimento",
      "ui.action.auto_finish": "Fine automatica",
      "ui.result.title": "Partita completata",
      "ui.result.new_game": "Nuova partita",
      "ui.result.restart": "Ricomincia",
      "ui.result.return": "Torna indietro",
      "ui.meta.title": "Klondike Solitaire online gratis",
      "ui.meta.description": "Gioca al klondike solitario classico gratuitamente su mobile e desktop senza download.",
    },
    "ru": {
      "ui.title": "Классический пасьянс Клонддайк",
      "ui.hero.title": "Классический пасьянс Клонддайк",
      "ui.hero.kicker": "Классическая карточная игра",
      "ui.hero.copy": "Классический пасьянс с плавной анимацией. Работает на мобильных и настольных устройствах: перетаскивание, подсказки, отмена и автозавершение.",
      "ui.nav.back_to_lobby": "Вернуться в лобби",
      "ui.nav.back_to_main": "Вернуться на главный экран",
      "ui.board.empty_stock": "Колода",
      "ui.board.empty_waste": "Сброс",
      "ui.aria.stock": "Колода, осталось {count} карт",
      "ui.aria.waste": "Сброс, видно {count} карт",
      "ui.draw_mode.label": "Режим добора",
      "ui.draw_mode.toggle": "Режим добора: {label}",
      "ui.draw_mode.option_1": "Взять 1",
      "ui.draw_mode.option_3": "Взять 3",
      "ui.action.new_game": "Новая игра",
      "ui.action.restart": "Перезапустить",
      "ui.action.start": "Старт",
      "ui.action.undo": "Отменить",
      "ui.action.hint": "Подсказка",
      "ui.action.auto_finish": "Автозавершение",
      "ui.result.title": "Игра завершена",
      "ui.result.new_game": "Новая игра",
      "ui.result.restart": "Повторить",
      "ui.result.return": "Вернуться",
      "ui.meta.title": "Классический Пасьянс Клонддайк онлайн бесплатно",
      "ui.meta.description": "Играйте в классический солитер Клонддайк бесплатно на телефоне и ПК без загрузки.",
    },
    "hi": {
      "ui.title": "क्लोंडाइक सॉलिटेयर",
      "ui.hero.title": "क्लोंडाइक सॉलिटेयर",
      "ui.hero.kicker": "क्लासिक कार्ड गेम",
      "ui.nav.back_to_lobby": "लॉबी पर वापस जाएँ",
      "ui.nav.back_to_main": "मुख्य स्क्रीन पर वापस जाएँ",
      "ui.draw_mode.option_1": "1 कार्ड",
      "ui.draw_mode.option_3": "3 कार्ड",
      "ui.draw_mode.label": "ड्रॉ मोड",
      "ui.draw_mode.toggle": "ड्रॉ मोड: {label}",
      "ui.action.new_game": "नया खेल",
      "ui.action.restart": "पुनः शुरू करें",
      "ui.action.start": "शुरू करें",
      "ui.action.undo": "पूर्ववत करें",
      "ui.action.hint": "सुझाव",
      "ui.action.auto_finish": "ऑटो-फिनिश",
      "ui.result.new_game": "नया खेल",
      "ui.result.restart": "फिर से शुरू करें",
      "ui.result.return": "वापस जाएँ",
      "ui.meta.title": "क्लोंडाइक सॉलिटेयर — निःशुल्क ऑनलाइन",
      "ui.meta.description": "मोबाइल और डेस्कटॉप पर शास्त्रीय क्लोंडाइक सॉलिटेयर खेलें, बिना डाउनलोड के।",
    },
    "ar": {
      "ui.title": "لعبة كلوندايك سوليتير",
      "ui.hero.title": "لعبة كلوندايك سوليتير",
      "ui.hero.kicker": "لعبة أوراق كلاسيكية",
      "ui.hero.copy": "نسخة كلاسيكية من سوليتير كوندايك برسوم متحركة حديثة، تعمل بسلاسة على الهاتف والكمبيوتر.",
      "ui.nav.back_to_lobby": "العودة إلى الردهة",
      "ui.nav.back_to_main": "العودة إلى الشاشة الرئيسية",
      "ui.board.empty_stock": "الرّزمة",
      "ui.board.empty_waste": "كومة الهدر",
      "ui.aria.stock": "الرّزمة، {count} أوراق متبقية",
      "ui.aria.waste": "كومة الهدر، {count} أوراق مرئية",
      "ui.draw_mode.label": "وضع السحب",
      "ui.draw_mode.toggle": "وضع السحب: {label}",
      "ui.draw_mode.option_1": "سحب 1",
      "ui.draw_mode.option_3": "سحب 3",
      "ui.action.new_game": "لعبة جديدة",
      "ui.action.restart": "إعادة التشغيل",
      "ui.action.start": "ابدأ",
      "ui.action.undo": "تراجع",
      "ui.action.hint": "تلميح",
      "ui.action.auto_finish": "إنهاء تلقائي",
      "ui.result.title": "اكتملت اللعبة",
      "ui.result.new_game": "لعبة جديدة",
      "ui.result.restart": "إعادة المحاولة",
      "ui.result.return": "رجوع",
      "ui.meta.title": "كلوندايك سوليتير أونلاين - لعب مجاني",
      "ui.meta.description": "العب سوليتير كلوندايك الكلاسيكي مجانًا على الجوال أو الكمبيوتر بدون تنزيل.",
    },
  };
  const KL_RUNTIME_HEADER_OVERRIDES = {
    en: { "ui.header.moves": "Moves", "ui.header.time": "Time", "ui.battle.controls_label": "Controls" },
    "zh-Hant": { "ui.header.moves": "步數", "ui.header.time": "時間", "ui.battle.controls_label": "操作控制" },
    "zh-Hans": { "ui.header.moves": "步数", "ui.header.time": "时间", "ui.battle.controls_label": "控制项" },
    ja: { "ui.header.moves": "手数", "ui.header.time": "時間", "ui.battle.controls_label": "操作" },
    ko: { "ui.header.moves": "이동 횟수", "ui.header.time": "시간", "ui.battle.controls_label": "조작" },
    es: { "ui.header.moves": "Movimientos", "ui.header.time": "Tiempo", "ui.battle.controls_label": "Controles" },
    "pt-BR": { "ui.header.moves": "Movimentos", "ui.header.time": "Tempo", "ui.battle.controls_label": "Controles" },
    fr: { "ui.header.moves": "Mouvements", "ui.header.time": "Temps", "ui.battle.controls_label": "Commandes" },
    de: { "ui.header.moves": "Züge", "ui.header.time": "Zeit", "ui.battle.controls_label": "Steuerung" },
    it: { "ui.header.moves": "Mosse", "ui.header.time": "Tempo", "ui.battle.controls_label": "Controlli" },
    ru: { "ui.header.moves": "Ходы", "ui.header.time": "Время", "ui.battle.controls_label": "Управление" },
    hi: { "ui.header.moves": "चालें", "ui.header.time": "समय", "ui.battle.controls_label": "नियंत्रण" },
    ar: { "ui.header.moves": "عدد الحركات", "ui.header.time": "الوقت", "ui.battle.controls_label": "عناصر التحكم" },
  };
  SUPPORTED_LOCALES.forEach((locale) => {
    const baseLocale = KL_I18N.en;
    const localeOverrides = LOCALE_I18N_OVERRIDES[locale] || {};
    const existingLocale = KL_I18N[locale];
    KL_I18N[locale] = Object.assign({}, baseLocale, existingLocale, localeOverrides, KL_RUNTIME_HEADER_OVERRIDES[locale] || {});
    if (!KL_I18N[locale]["ui.meta.keywords"]) {
      KL_I18N[locale]["ui.meta.keywords"] = DEFAULT_META_KEYWORDS;
    }
    Object.keys(baseLocale).forEach((key) => {
      if (!KL_I18N[locale][key]) {
        KL_I18N[locale][key] = KL_I18N.en[key];
      }
    });
  });

  const KL_REVIEW_EXPERIENCE_COPY = {
    en: {
      "ui.hint.reason.waste_foundation": "Why this move: it advances a suit toward the Foundation.",
      "ui.hint.reason.waste_tableau": "Why this move: it opens the Waste and builds a useful Tableau sequence.",
      "ui.hint.reason.tableau_foundation": "Why this move: it advances a face-up card toward the Foundation.",
      "ui.hint.reason.tableau_stack": "Why this move: it exposes a hidden card or opens a new sequence.",
      "ui.result.deal_identity": "Deal {id} · Replay this deal to beat your best.",
    },
    "zh-Hant": {
      "ui.hint.reason.waste_foundation": "為什麼是這步：把同一花色往收牌區推進。",
      "ui.hint.reason.waste_tableau": "為什麼是這步：清出棄牌並建立有用的牌列。",
      "ui.hint.reason.tableau_foundation": "為什麼是這步：把明牌往收牌區推進。",
      "ui.hint.reason.tableau_stack": "為什麼是這步：翻出暗牌，或開啟新的牌列。",
      "ui.result.deal_identity": "牌局 {id}・重玩這局，挑戰你的最佳紀錄。",
    },
    "zh-Hans": {
      "ui.hint.reason.waste_foundation": "为什么是这步：将同一花色推进到收牌区。",
      "ui.hint.reason.waste_tableau": "为什么是这步：清出弃牌并建立有用的牌列。",
      "ui.hint.reason.tableau_foundation": "为什么是这步：将明牌推进到收牌区。",
      "ui.hint.reason.tableau_stack": "为什么是这步：翻出暗牌，或开启新的牌列。",
      "ui.result.deal_identity": "牌局 {id}・重玩这局，挑战你的最佳纪录。",
    },
    ja: {
      "ui.hint.reason.waste_foundation": "この手を選んだ理由：同じスートを組み札へ進めます。",
      "ui.hint.reason.waste_tableau": "この手を選んだ理由：場札を空け、次の列を組みやすくします。",
      "ui.hint.reason.tableau_foundation": "この手を選んだ理由：表向きのカードを組み札へ進めます。",
      "ui.hint.reason.tableau_stack": "この手を選んだ理由：裏向きのカードをめくるか、新しい列を開きます。",
      "ui.result.deal_identity": "ディール {id}・このディールを再挑戦してベスト記録を更新しましょう。",
    },
    ko: {
      "ui.hint.reason.waste_foundation": "이 수를 고른 이유: 같은 무늬를 파운데이션으로 전진시킵니다.",
      "ui.hint.reason.waste_tableau": "이 수를 고른 이유: 버린 카드 더미를 비우고 유용한 열을 만듭니다.",
      "ui.hint.reason.tableau_foundation": "이 수를 고른 이유: 앞면 카드를 파운데이션으로 전진시킵니다.",
      "ui.hint.reason.tableau_stack": "이 수를 고른 이유: 뒷면 카드를 열거나 새 열을 만듭니다.",
      "ui.result.deal_identity": "딜 {id} · 이 딜을 다시 플레이해 최고 기록에 도전하세요.",
    },
    es: {
      "ui.hint.reason.waste_foundation": "Por qué esta jugada: avanza un palo hacia la Fundación.",
      "ui.hint.reason.waste_tableau": "Por qué esta jugada: libera el Descarte y crea una secuencia útil del Tableau.",
      "ui.hint.reason.tableau_foundation": "Por qué esta jugada: avanza una carta descubierta hacia la Fundación.",
      "ui.hint.reason.tableau_stack": "Por qué esta jugada: descubre una carta oculta o abre una nueva secuencia.",
      "ui.result.deal_identity": "Reparto {id} · Repite este reparto para superar tu mejor marca.",
    },
    "pt-BR": {
      "ui.hint.reason.waste_foundation": "Por que esta jogada: avança um naipe para a Fundação.",
      "ui.hint.reason.waste_tableau": "Por que esta jogada: libera o descarte e cria uma sequência útil no Tableau.",
      "ui.hint.reason.tableau_foundation": "Por que esta jogada: avança uma carta virada para cima até a Fundação.",
      "ui.hint.reason.tableau_stack": "Por que esta jogada: revela uma carta virada para baixo ou abre uma nova sequência.",
      "ui.result.deal_identity": "Distribuição {id} · Jogue esta distribuição de novo para superar seu melhor resultado.",
    },
    fr: {
      "ui.hint.reason.waste_foundation": "Pourquoi ce coup : il avance une couleur vers la Fondation.",
      "ui.hint.reason.waste_tableau": "Pourquoi ce coup : il libère la défausse et construit une suite utile au Tableau.",
      "ui.hint.reason.tableau_foundation": "Pourquoi ce coup : il avance une carte visible vers la Fondation.",
      "ui.hint.reason.tableau_stack": "Pourquoi ce coup : il révèle une carte cachée ou ouvre une nouvelle suite.",
      "ui.result.deal_identity": "Donne {id} · Rejouez cette donne pour battre votre meilleur score.",
    },
    de: {
      "ui.hint.reason.waste_foundation": "Warum dieser Zug: Er bringt eine Farbe zum Fundament voran.",
      "ui.hint.reason.waste_tableau": "Warum dieser Zug: Er leert den Ablagestapel und bildet eine nützliche Tableau-Reihe.",
      "ui.hint.reason.tableau_foundation": "Warum dieser Zug: Er bringt eine offene Karte zum Fundament voran.",
      "ui.hint.reason.tableau_stack": "Warum dieser Zug: Er deckt eine verdeckte Karte auf oder öffnet eine neue Reihe.",
      "ui.result.deal_identity": "Ausgabe {id} · Spiele diese Ausgabe erneut und übertriff deinen Bestwert.",
    },
    it: {
      "ui.hint.reason.waste_foundation": "Perché questa mossa: porta un seme verso la Fondazione.",
      "ui.hint.reason.waste_tableau": "Perché questa mossa: libera gli scarti e crea una sequenza utile nel Tableau.",
      "ui.hint.reason.tableau_foundation": "Perché questa mossa: porta una carta scoperta verso la Fondazione.",
      "ui.hint.reason.tableau_stack": "Perché questa mossa: scopre una carta coperta o apre una nuova sequenza.",
      "ui.result.deal_identity": "Distribuzione {id} · Ripeti questa distribuzione per battere il tuo record.",
    },
    ru: {
      "ui.hint.reason.waste_foundation": "Почему этот ход: он продвигает масть в основание.",
      "ui.hint.reason.waste_tableau": "Почему этот ход: он освобождает сброс и строит полезную последовательность.",
      "ui.hint.reason.tableau_foundation": "Почему этот ход: он продвигает открытую карту в основание.",
      "ui.hint.reason.tableau_stack": "Почему этот ход: он открывает скрытую карту или новую последовательность.",
      "ui.result.deal_identity": "Раздача {id} · Повторите её, чтобы побить свой лучший результат.",
    },
    hi: {
      "ui.hint.reason.waste_foundation": "यह चाल क्यों: यह एक सूट को फाउंडेशन की ओर आगे बढ़ाती है।",
      "ui.hint.reason.waste_tableau": "यह चाल क्यों: यह वेस्ट को खोलती है और उपयोगी टैब्लो क्रम बनाती है।",
      "ui.hint.reason.tableau_foundation": "यह चाल क्यों: यह खुले कार्ड को फाउंडेशन की ओर आगे बढ़ाती है।",
      "ui.hint.reason.tableau_stack": "यह चाल क्यों: यह छिपा कार्ड खोलती है या नया क्रम शुरू करती है।",
      "ui.result.deal_identity": "डील {id} · अपने सर्वश्रेष्ठ रिकॉर्ड को बेहतर करने के लिए यह डील फिर खेलें।",
    },
    ar: {
      "ui.hint.reason.waste_foundation": "سبب هذه الحركة: إنها تقدّم نوعًا نحو الأساس.",
      "ui.hint.reason.waste_tableau": "سبب هذه الحركة: إنها تفتح كومة المهملات وتبني تسلسلًا مفيدًا.",
      "ui.hint.reason.tableau_foundation": "سبب هذه الحركة: إنها تقدّم بطاقة مكشوفة نحو الأساس.",
      "ui.hint.reason.tableau_stack": "سبب هذه الحركة: إنها تكشف بطاقة مخفية أو تفتح تسلسلًا جديدًا.",
      "ui.result.deal_identity": "التوزيع {id} · أعد هذا التوزيع لتحطّم أفضل نتيجة لك.",
    },
  };
  Object.entries(KL_REVIEW_EXPERIENCE_COPY).forEach(([locale, copy]) => {
    Object.assign(KL_I18N[locale], copy);
  });

  const KL_QUICK_RULE_COPY = Object.freeze({
    en: "Tap a legal card to move it automatically. Drag a card when you want to choose the destination.",
    "zh-Hant": "點選合法牌會自動移動；需要選擇目的地時，請拖曳牌。",
    "zh-Hans": "点击合法牌会自动移动；需要选择目的地时，请拖动牌。",
    ja: "合法なカードをタップすると自動で移動します。移動先を選ぶときはドラッグしてください。",
    ko: "가능한 카드를 누르면 자동으로 이동합니다. 목적지를 직접 고르려면 카드를 드래그하세요.",
    es: "Toca una carta válida para moverla automáticamente. Arrástrala si quieres elegir el destino.",
    "pt-BR": "Toque em uma carta válida para movê-la automaticamente. Arraste-a para escolher o destino.",
    fr: "Touchez une carte valide pour la déplacer automatiquement. Faites-la glisser pour choisir la destination.",
    de: "Tippe auf eine gültige Karte, um sie automatisch zu bewegen. Ziehe sie, um das Ziel selbst zu wählen.",
    it: "Tocca una carta valida per spostarla automaticamente. Trascinala per scegliere la destinazione.",
    ru: "Нажмите на допустимую карту для автоматического хода. Перетащите её, чтобы выбрать место.",
    hi: "कानूनी कार्ड पर टैप करने से वह अपने आप चलेगा। जगह चुनने के लिए कार्ड को खींचें।",
    ar: "اضغط على بطاقة قانونية لتحريكها تلقائياً. اسحبها لاختيار الوجهة بنفسك.",
  });

  const KL_SELECTION_RULE_COPY = Object.freeze({
    en: "Tap a card to select it. Drag it, or tap a highlighted destination, to move it.",
    "zh-Hant": "點一下牌先選取。拖曳牌，或點選高亮目的地，才會移動。",
    "zh-Hans": "点一下牌先选中。拖动牌，或点击高亮目标，才会移动。",
    ja: "カードをタップして選択します。ドラッグするか、光った移動先をタップすると移動します。",
    ko: "카드를 눌러 선택하세요. 드래그하거나 강조된 목적지를 누르면 이동합니다.",
    es: "Toca una carta para seleccionarla. Arrástrala o toca un destino resaltado para moverla.",
    "pt-BR": "Toque em uma carta para selecioná-la. Arraste-a ou toque em um destino destacado para movê-la.",
    fr: "Touchez une carte pour la sélectionner. Faites-la glisser ou touchez une destination mise en évidence pour la déplacer.",
    de: "Tippe auf eine Karte, um sie auszuwählen. Ziehe sie oder tippe auf ein hervorgehobenes Ziel, um sie zu bewegen.",
    it: "Tocca una carta per selezionarla. Trascinala o tocca una destinazione evidenziata per spostarla.",
    ru: "Нажмите на карту, чтобы выбрать её. Перетащите её или нажмите на подсвеченную цель, чтобы переместить.",
    hi: "कार्ड चुनने के लिए उसे टैप करें। उसे खींचें या हाइलाइट किए गए लक्ष्य को टैप करके चलाएँ।",
    ar: "اضغط على بطاقة لتحديدها. اسحبها أو اضغط على الوجهة المميزة لنقلها.",
  });

  const KL_UI_COPY_OVERRIDES = Object.freeze({
    en: {
      "ui.hero.copy": "Play with drag-and-drop and clear card selection. Draw 1/3, Hint, Auto Finish, and Undo keep the table readable.",
      "ui.feature.features_text": "Single/multi-card drag, tap-to-select, Draw 1/3, hint, and auto finish.",
    },
    "zh-Hant": {
      "ui.hero.copy": "使用拖曳與清楚的選牌操作。抽 1/3 張、提示、自動完成與回退讓牌局更容易理解。",
      "ui.feature.features_text": "單/多張牌拖曳、點擊選牌、抽 1/3 張、提示與自動完成。",
    },
    "zh-Hans": {
      "ui.hero.copy": "使用拖动与清晰的选牌操作。抽 1/3 张、提示、自动完成与撤销让牌局更容易理解。",
      "ui.feature.features_text": "单/多张牌拖动、点击选牌、抽 1/3 张、提示与自动完成。",
    },
    ja: {
      "ui.hero.copy": "ドラッグ操作と分かりやすいカード選択で遊べます。1枚/3枚ドロー、ヒント、自動完了、元に戻すを使えます。",
      "ui.feature.features_text": "単数/複数カードのドラッグ、タップ選択、1/3枚ドロー、ヒント、自動完了。",
    },
    ko: {
      "ui.hero.copy": "드래그와 명확한 카드 선택으로 플레이하세요. 1장/3장 뽑기, 힌트, 자동 완료, 실행 취소를 사용할 수 있습니다.",
      "ui.feature.features_text": "한 장/여러 장 드래그, 탭으로 선택, 1장/3장 뽑기, 힌트, 자동 완료.",
    },
    es: {
      "ui.hero.copy": "Juega arrastrando y seleccionando cartas con claridad. Usa Robar 1/3, Pista, Autocompletar y Deshacer.",
      "ui.feature.features_text": "Arrastre de una o varias cartas, selección al tocar, Robar 1/3, pista y autocompletar.",
    },
    "pt-BR": {
      "ui.hero.copy": "Jogue arrastando e selecionando cartas com clareza. Use Comprar 1/3, Dica, Autocompletar e Desfazer.",
      "ui.feature.features_text": "Arraste uma ou várias cartas, selecione com um toque, compre 1/3, use dica e autocompletar.",
    },
    fr: {
      "ui.hero.copy": "Jouez avec le glisser-déposer et une sélection claire des cartes. Utilisez Pioche 1/3, Indice, Fin automatique et Annuler.",
      "ui.feature.features_text": "Glisser une ou plusieurs cartes, sélection au toucher, Pioche 1/3, indice et fin automatique.",
    },
    de: {
      "ui.hero.copy": "Spiele mit Drag-and-drop und klarer Kartenauswahl. Nutze 1/3 ziehen, Tipp, Auto-Fertigstellen und Rückgängig.",
      "ui.feature.features_text": "Eine oder mehrere Karten ziehen, per Tippen auswählen, 1/3 ziehen, Tipp und Auto-Fertigstellen.",
    },
    it: {
      "ui.hero.copy": "Gioca trascinando e selezionando le carte in modo chiaro. Usa Pesca 1/3, Suggerimento, Completamento automatico e Annulla.",
      "ui.feature.features_text": "Trascinamento di una o più carte, selezione al tocco, Pesca 1/3, suggerimento e completamento automatico.",
    },
    ru: {
      "ui.hero.copy": "Играйте перетаскиванием и понятным выбором карт. Используйте добор 1/3, подсказку, автозавершение и отмену.",
      "ui.feature.features_text": "Перетаскивание одной или нескольких карт, выбор нажатием, добор 1/3, подсказка и автозавершение.",
    },
    hi: {
      "ui.hero.copy": "कार्ड को खींचकर और स्पष्ट चयन के साथ खेलें। 1/3 कार्ड लें, संकेत, ऑटो-फिनिश और वापस करें का उपयोग करें।",
      "ui.feature.features_text": "एक या कई कार्ड खींचें, टैप से चुनें, 1/3 कार्ड लें, संकेत और ऑटो-फिनिश।",
    },
    ar: {
      "ui.hero.copy": "العب بالسحب والإفلات مع اختيار واضح للبطاقات. استخدم سحب 1/3 والتلميح والإكمال التلقائي والتراجع.",
      "ui.feature.features_text": "سحب بطاقة واحدة أو عدة بطاقات، الاختيار بالضغط، سحب 1/3، التلميح والإكمال التلقائي.",
    },
  });

  function mapLocalePathPrefix(locale) {
    const normalized = String(locale || LOCALE_DEFAULT);
    const normalizedLower = normalized.toLowerCase();
    if (normalizedLower === "zh-hant") return "zh-tw";
    if (normalizedLower === "zh-hans") return "zh-cn";
    if (normalizedLower === "pt-br") return "pt-br";
    return normalizedLower;
  }

  function resolveKlLocale(rawLocale) {
    const normalized = String(rawLocale || LOCALE_DEFAULT);
    const normalizedLower = normalized.toLowerCase();
    return LOCALE_CANONICAL_MAP[normalizedLower] || normalized;
  }

  function getKlLocale() {
    const rawLocale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || LOCALE_DEFAULT;
    return resolveKlLocale(rawLocale);
  }

  function resolveI18nValue(value, params = {}) {
    return Object.entries(params).reduce((output, [key, replacement]) => output.replaceAll(`{${key}}`, String(replacement)), value);
  }

  function t(key, params = {}) {
    const locale = getKlLocale();
    const table = KL_I18N[locale] || KL_I18N.en;
    const fallback = KL_I18N.en[key];
    const value = KL_UI_COPY_OVERRIDES[locale]?.[key] || table[key] || fallback || key;
    return resolveI18nValue(value, params);
  }

  function syncMetaTag(selector, value) {
    const node = document.querySelector(selector);
    if (!node) return;
    node.setAttribute("content", String(value));
  }

  function syncLocalizedTextNodes() {
    document.querySelectorAll("[data-klocale]").forEach((node) => {
      const key = node.dataset.klocale;
      if (!key) return;
      node.textContent = t(key);
    });
    document.querySelectorAll("[data-klocale-aria]").forEach((node) => {
      const key = node.dataset.klocaleAria;
      if (!key) return;
      node.setAttribute("aria-label", t(key));
    });
  }

  function syncQuickRule() {
    const locale = getKlLocale();
    if (ui.battleTip) ui.battleTip.textContent = KL_SELECTION_RULE_COPY[locale] || KL_SELECTION_RULE_COPY.en;
  }

  function syncLocalizedMeta() {
    const locale = getKlLocale();
    const localeCode = String(locale || LOCALE_DEFAULT);
    const localeSegment = mapLocalePathPrefix(localeCode);
    const canonical = `https://weightplay.com/${localeSegment}/games/klondike-solitaire/`;
    const title = t("ui.meta.title");
    const description = t("ui.meta.description");
    const keywords = t("ui.meta.keywords");

    document.title = title;
    document.documentElement.lang = localeCode;
    document.documentElement.dir = localeCode === "ar" ? "rtl" : "ltr";

    syncMetaTag("meta[name='description']", description);
    syncMetaTag("meta[name='keywords']", keywords);
    syncMetaTag("meta[property='og:title']", title);
    syncMetaTag("meta[property='og:description']", description);
    syncMetaTag("meta[name='twitter:title']", title);
    syncMetaTag("meta[name='twitter:description']", description);
    syncMetaTag("meta[name='twitter:card']", "summary_large_image");
    syncMetaTag("meta[property='og:url']", canonical);
    syncMetaTag("meta[property='og:image']", "https://weightplay.com/assets/weightplay-logo.png");
    syncMetaTag("meta[name='twitter:image']", "https://weightplay.com/assets/weightplay-logo.png");

    const canonicalNode = document.getElementById("metaCanonical");
    if (canonicalNode) canonicalNode.href = canonical;
    const alternateEn = document.getElementById("metaAlternateEn");
    if (alternateEn) alternateEn.href = "https://weightplay.com/en/games/klondike-solitaire/";
    const alternateDefault = document.getElementById("metaAlternateDefault");
    if (alternateDefault) alternateDefault.href = "https://weightplay.com/en/games/klondike-solitaire/";
    const ogUrl = document.getElementById("metaOgUrl");
    if (ogUrl) ogUrl.setAttribute("content", canonical);
    const mainReturn = document.querySelector('[data-wp-return="main"]');
    if (mainReturn) mainReturn.href = `/${localeSegment}/`;

    const structuredData = document.getElementById("klStructuredData");
    if (structuredData) {
      try {
        const data = JSON.parse(structuredData.textContent || "{}");
        data.name = title;
        data.description = description;
        data.url = canonical;
        data.inLanguage = localeCode;
        structuredData.textContent = JSON.stringify(data);
      } catch (_error) {
        // Keep fallback source json when parsing fails.
      }
    }
  }

  function refreshLocalization() {
    syncLocalizedTextNodes();
    syncLocalizedMeta();
    syncQuickRule();
    renderStatistics();
    syncDrawLabel();
    setSoundButtons(audio.enabled);
    renderHeader();
    if (!ui.battleScreen?.hidden) renderBoard();
  }

  const el = (id) => document.getElementById(id);
  const now = () => performance.now();

  const ui = {
    loadingPanel: el("loadingPanel"),
    loadingFill: el("loadingFill"),
    loadingText: el("loadingText"),
    mainScreen: el("mainScreen"),
    battleScreen: el("battleScreen"),
    battleBackBtn: el("battleBackBtn"),
    enterBtn: el("enterBtn"),
    startBtn: el("startBtn"),
    newGameBtn: el("newGameBtn"),
    restartBtn: el("restartBtn"),
    soundToggle: el("soundToggle"),
    soundToggleBattle: el("soundToggleBattle"),
    statistics: el("statistics"),
    moveCount: el("moveCount"),
    timeValue: el("timeValue"),
    drawModeBtn: el("drawModeBtn"),
    drawModeValue: el("drawModeValue"),
    stockPile: el("stockPile"),
    wastePile: el("wastePile"),
    battleTip: el("battleTip"),
    foundationRow: el("foundationRow"),
    tableauRow: el("tableauRow"),
    undoBtn: el("undoBtn"),
    hintBtn: el("hintBtn"),
    autoFinishBtn: el("autoFinishBtn"),
    resultOverlay: el("resultOverlay"),
    resultText: el("resultText"),
    resultNewGame: el("resultNewGame"),
    resultRestart: el("resultRestart"),
    resultClose: el("resultClose"),
    hintOverlay: el("hintOverlay"),
    dragLayer: el("dragLayer"),
  };

  // The shared responsive shell may scale the logical battle canvas. Keep
  // drag previews in viewport coordinates so they follow the pointer even
  // when the canvas has a transform applied.
  if (ui.dragLayer && ui.dragLayer.parentElement !== document.body) {
    document.body.append(ui.dragLayer);
  }

  ui.mainScreen?.setAttribute("data-screen", "main");
  ui.battleScreen?.setAttribute("data-screen", "battle");
  document.body?.removeAttribute("data-screen");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const formatTime = (secondsTotal) => {
    const total = Math.max(0, Math.floor(secondsTotal));
    const min = String(Math.floor(total / 60)).padStart(2, "0");
    const sec = String(total % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };
  const formatDealId = (value) => `#${(Number(value) >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;

  const KL_RULESET = Object.freeze(new RuleEngine());
  const KLO_RULE_CONFIG = {
    suits: [...SUITS],
    tableauPiles: 7,
    drawModes: [...DRAW_MODES],
    ruleEngine: KL_RULESET,
  };

  class KlondikeEngine {
    constructor(config = {}) {
      this.config = Object.assign({}, KLO_RULE_CONFIG, config);
      this.drawModeIndex = 0;
      this.moveCount = 0;
      this.moveHistory = [];
      this.completed = false;
      this.initialSnapshot = null;
      this.rules = this.config.ruleEngine || KL_RULESET;

      const suits = this.config.suits || SUITS;
      this.tableau = new Tableau(this.config.tableauPiles || 7);
      this.foundations = suits.map((suit) => new Foundation(suit));
      this.stock = new Stock();
      this.waste = new Waste();

      this.newGame();
    }

    newGame(seed = now()) {
      this.dealId = seed >>> 0;
      const deck = Deck.buildShuffled(seed >>> 0, this.config.suits || SUITS);
      const suits = this.config.suits || SUITS;
      const tableauPiles = this.config.tableauPiles || 7;
      this.tableau = new Tableau(tableauPiles);
      this.foundations = suits.map((suit) => new Foundation(suit));
      this.foundations.forEach((foundation) => foundation.clear());
      this.stock.clear();
      this.waste.clear();
      this.moveHistory = [];
      this.completed = false;
      this.moveCount = 0;

      const cards = deck.cards;
      let pointer = 0;
      for (let column = 0; column < tableauPiles; column += 1) {
        for (let row = 0; row <= column; row += 1) {
          const card = cards[pointer];
          card.faceUp = row === column;
          this.tableau.columns[column].push(card);
          pointer += 1;
        }
      }
      for (let i = pointer; i < cards.length; i += 1) {
        cards[i].faceUp = false;
      }
      this.stock.cards = cards.slice(pointer);
      this.initialSnapshot = this.snapshot();
      return this.initialSnapshot;
    }

    snapshot() {
      return {
        dealId: this.dealId,
        drawModeIndex: this.drawModeIndex,
        moveCount: this.moveCount,
        tableau: this.tableau.toJSON(),
        foundations: this.foundations.map((foundation) => foundation.toJSON()),
        stock: this.stock.toJSON(),
        waste: this.waste.toJSON(),
        completed: this.completed,
      };
    }

    restore(raw) {
      if (!raw) return;
      const dealId = Number(raw.dealId);
      if (Number.isFinite(dealId)) this.dealId = dealId >>> 0;
      this.drawModeIndex = Number(raw.drawModeIndex) || 0;
      this.moveCount = Number(raw.moveCount) || 0;
      this.tableau = Tableau.fromJSON(raw.tableau || []);
      const suits = this.config.suits || SUITS;
      this.foundations = suits.map((suit, index) => Foundation.fromJSON(suit, raw.foundations?.[index] || []));
      this.stock = Stock.fromJSON(raw.stock || []);
      this.waste = Waste.fromJSON(raw.waste || []);
      this.completed = Boolean(raw.completed);
      return true;
    }

    pushHistory() {
      this.moveHistory.push(this.snapshot());
      return true;
    }

    canUndo() {
      return this.moveHistory.length > 0;
    }

    undo() {
      const previous = this.moveHistory.pop();
      if (!previous) return false;
      this.restore(previous);
      return true;
    }

    hasWon() {
      return this.foundations.every((foundation) => foundation.cards.length === 13);
    }

    allMovableCardsFromTableau(columnIndex, row) {
      return this.tableau.canTakeFrom(columnIndex, row);
    }

    foundationMoveTargets(card, fromColumn = null, row = null, groupSize = 1) {
      const moves = [];
      const target = this.foundationBySuit(card.suit);
      if (groupSize === 1 && this.rules.canPlaceOnFoundation(card, target)) {
        moves.push({
          type: "tableauToFoundation",
          from: "tableau",
          fromColumn,
          startRow: row,
          foundationIndex: (this.config.suits || SUITS).indexOf(card.suit),
        });
      }
      return moves;
    }

    foundationBySuit(suit) {
      const index = (this.config.suits || SUITS).indexOf(suit);
      return this.foundations[index];
    }

    legalMovesForWaste() {
      const moves = [];
      const top = this.waste.top();
      if (!top) return moves;

      const foundation = this.foundationBySuit(top.suit);
      if (this.rules.canPlaceOnFoundation(top, foundation)) {
        moves.push({
          type: "wasteToFoundation",
          from: "waste",
          foundationIndex: (this.config.suits || SUITS).indexOf(top.suit),
        });
      }

      for (let i = 0; i < this.tableau.columns.length; i += 1) {
        const target = this.tableau.top(i);
        if (this.rules.canPlaceOnTableau(top, target)) {
          moves.push({
            type: "wasteToTableau",
            from: "waste",
            toColumn: i,
          });
        }
      }
      return moves;
    }

    legalMovesForTableau(columnIndex, row = null) {
      const cardGroup = this.allMovableCardsFromTableau(columnIndex, row);
      if (!cardGroup) return [];
      const { cards } = cardGroup;
      const firstCard = cards[0];
      const moves = [];

      if (cards.length === 1) {
        const foundation = this.foundationBySuit(firstCard.suit);
        if (this.rules.canPlaceOnFoundation(firstCard, foundation)) {
          moves.push({
            type: "tableauToFoundation",
            from: "tableau",
            fromColumn: columnIndex,
            startRow: row,
            foundationIndex: (this.config.suits || SUITS).indexOf(firstCard.suit),
          });
        }
      }

      for (let i = 0; i < this.tableau.columns.length; i += 1) {
        if (i === columnIndex) continue;
        const target = this.tableau.top(i);
        if (this.rules.canPlaceOnTableau(firstCard, target)) {
          moves.push({
            type: "tableauToTableau",
            from: "tableau",
            fromColumn: columnIndex,
            startRow: row,
            toColumn: i,
          });
        }
      }
      return moves;
    }

    allLegalMoves() {
      const moves = [];
      const wasteMoves = this.legalMovesForWaste();
      moves.push(...wasteMoves.map((move) => ({ ...move, kind: "waste" })));
      for (let column = 0; column < this.tableau.columns.length; column += 1) {
        const columnCards = this.tableau.columns[column];
        if (!columnCards.length) continue;
        for (let row = 0; row < columnCards.length; row += 1) {
          const card = columnCards[row];
          if (!card.faceUp) continue;
          const cardMoves = this.legalMovesForTableau(column, row);
          if (cardMoves.length > 0) {
            moves.push(...cardMoves.map((move) => ({ ...move, fromRow: row, kind: "tableau" })));
          }
        }
      }
      return moves;
    }

    foundationMoveableMoves() {
      const foundationMoves = [];
      for (let column = 0; column < this.tableau.columns.length; column += 1) {
        const top = this.tableau.top(column);
        if (!top) continue;
        const moves = this.legalMovesForTableau(column, this.tableau.columns[column].length - 1);
        const onlyFoundation = moves.filter((move) => move.type === "tableauToFoundation");
        foundationMoves.push(...onlyFoundation);
      }
      const wasteToFoundation = this.legalMovesForWaste().filter((move) => move.type === "wasteToFoundation");
      foundationMoves.push(...wasteToFoundation);
      return foundationMoves;
    }

    draw() {
      if (this.stock.isEmpty()) {
        if (!this.waste.cards.length) return false;
        this.pushHistory();
        this.stock.cards = this.stock.recycle(this.waste.cards);
        this.waste.clear();
        this.moveCount += 1;
        return { type: "recycle", from: "waste", to: "stock" };
      }
      const drawModes = this.config.drawModes || DRAW_MODES;
      const drawCount = drawModes[this.drawModeIndex] || DRAW_MODES[this.drawModeIndex];
      const previous = this.snapshot();
      const drawn = this.stock.draw(drawCount);
      if (!drawn.length) return false;
      this.moveHistory.push(previous);
      this.waste.cards.push(...drawn);
      this.moveCount += 1;
      return { type: "draw", drawCount: drawn.length };
    }

    applyMove(move, animateContext = {}) {
      if (!move) return false;
      if (move.type === "wasteToFoundation") {
        const card = this.waste.top();
        const foundation = this.foundations[move.foundationIndex];
        if (!card || !this.rules.canPlaceOnFoundation(card, foundation)) return false;
        this.waste.pop();
        foundation.cards.push(card);
        this.moveCount += 1;
        if (this.hasWon()) this.completed = true;
        return true;
      }
      if (move.type === "wasteToTableau") {
        const card = this.waste.top();
        const destination = this.tableau.columns[move.toColumn];
        if (!card || !destination || !this.rules.canPlaceOnTableau(card, destination.at(-1))) return false;
        this.waste.pop();
        destination.push(card);
        this.moveCount += 1;
        return true;
      }
      if (move.type === "tableauToFoundation") {
        const source = this.tableau.columns[move.fromColumn];
        if (!source || !Number.isInteger(move.startRow)) return false;
        const moveGroup = this.tableau.canTakeFrom(move.fromColumn, move.startRow);
        if (!moveGroup || moveGroup.cards.length !== 1) return false;
        const card = moveGroup.cards[0];
        const foundation = this.foundations[move.foundationIndex];
        if (!this.rules.canPlaceOnFoundation(card, foundation)) return false;
        source.splice(move.startRow);
        foundation.cards.push(card);
        const top = source.at(-1);
        if (top) top.faceUp = true;
        this.moveCount += 1;
        if (this.hasWon()) this.completed = true;
        return true;
      }
      if (move.type === "tableauToTableau") {
        const source = this.tableau.columns[move.fromColumn];
        const destination = this.tableau.columns[move.toColumn];
        if (!source || !destination || !Number.isInteger(move.startRow)) return false;
        const moveGroup = this.tableau.canTakeFrom(move.fromColumn, move.startRow);
        if (!moveGroup) return false;
        const group = moveGroup.cards;
        if (!this.rules.canPlaceOnTableau(group[0], destination.at(-1))) return false;
        const moving = source.splice(move.startRow);
        destination.push(...moving);
        const top = source.at(-1);
        if (top) top.faceUp = true;
        this.moveCount += 1;
        return true;
      }
      if (move.type === "reveal") {
        const column = this.tableau.columns[move.fromColumn];
        const top = column.at(-1);
        if (!top || top.faceUp) return false;
        top.faceUp = true;
        return true;
      }
      if (move.type === "recycle") {
        return false;
      }
      return false;
    }
  }

  const game = new KlondikeEngine();
  const audio = new SoundEngine(STORAGE_SOUND);
  const stats = {
    wins: 0,
    losses: 0,
    bestTime: null,
    bestMoves: null,
  };
  const state = {
    active: false,
    dragging: null,
    selectedSource: null,
    renderGeneration: 0,
    dragLayerActive: false,
    autoFinishing: false,
    hintTimer: 0,
    deadlockHintShown: false,
    dealSequence: null,
    timer: null,
    gameStartedAt: 0,
    elapsed: 0,
    boardAnimationInProgress: false,
    dealProgressTimer: null,
    dealEndTimer: null,
    lastFrameCards: new Map(),
    lossRecordedForCurrentBoard: false,
    resultShown: false,
  };

  const cardNodePool = new Map();
  const cardRevealCache = new Map();
  const victoryAnimationState = {
    timer: null,
    cards: [],
  };

  const statsStorage = {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_STATS);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Number.isFinite(parsed.wins)) stats.wins = parsed.wins;
        if (Number.isFinite(parsed.losses)) stats.losses = parsed.losses;
        if (Number.isFinite(parsed.bestTime)) stats.bestTime = parsed.bestTime;
        if (Number.isFinite(parsed.bestMoves)) stats.bestMoves = parsed.bestMoves;
      } catch (_error) {
      }
    },

    save() {
      try {
        localStorage.setItem(STORAGE_STATS, JSON.stringify(stats));
      } catch (_error) {
      }
    },
  };

  function setSoundButtons(enabled) {
    const label = enabled ? t("ui.sound.on") : t("ui.sound.off");
    if (ui.soundToggle) {
      ui.soundToggle.textContent = label;
      ui.soundToggle.setAttribute("aria-label", enabled ? t("ui.sound.aria_on") : t("ui.sound.aria_off"));
      ui.soundToggle.setAttribute("aria-pressed", String(enabled));
    }
    if (ui.soundToggleBattle) {
      ui.soundToggleBattle.textContent = label;
      ui.soundToggleBattle.setAttribute("aria-label", enabled ? t("ui.sound.aria_on") : t("ui.sound.aria_off"));
      ui.soundToggleBattle.setAttribute("aria-pressed", String(enabled));
    }
  }

  function setLoadingProgress(percent, text) {
    if (ui.loadingFill) ui.loadingFill.style.width = `${clamp(percent, 0, 100)}%`;
    if (ui.loadingText && text) ui.loadingText.textContent = text;
  }

  function getLayoutStep() {
    const canvas = ui.battleScreen?.querySelector(".battle-canvas");
    if (!canvas) return 24;
    const raw = window.getComputedStyle(canvas).getPropertyValue("--card-step").trim();
    if (/^-?(?:\d+\.?\d*|\.\d+)px$/u.test(raw)) return Number.parseFloat(raw);
    const probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;width:var(--card-step);height:0;";
    canvas.append(probe);
    const step = probe.getBoundingClientRect().width;
    probe.remove();
    return Number.isFinite(step) && step > 0 ? step : 24;
  }

  function getCardVisualWidth() {
    const canvas = ui.battleScreen?.querySelector(".battle-canvas");
    if (!canvas) return 56;
    const width = Number.parseFloat(window.getComputedStyle(canvas).getPropertyValue("--card-width"));
    return Number.isFinite(width) && width > 0 ? width : 56;
  }

  function getCanvasScale() {
    const canvas = ui.battleScreen?.querySelector(".battle-canvas");
    if (!canvas) return 1;
    const logicalWidth = Number.parseFloat(window.getComputedStyle(canvas).width);
    const physicalWidth = canvas.getBoundingClientRect().width;
    if (!Number.isFinite(logicalWidth) || logicalWidth <= 0 || !Number.isFinite(physicalWidth) || physicalWidth <= 0) return 1;
    return physicalWidth / logicalWidth;
  }

  function getBaseLayoutStep() {
    const canvas = ui.battleScreen?.querySelector(".battle-canvas");
    if (!canvas) return getLayoutStep();
    const override = canvas.style.getPropertyValue("--card-step");
    canvas.style.removeProperty("--card-step");
    const baseStep = getLayoutStep();
    if (override) canvas.style.setProperty("--card-step", override);
    return baseStep;
  }

  function getCardLayoutHeight(cardNode) {
    const computedHeight = Number.parseFloat(window.getComputedStyle(cardNode).height);
    if (Number.isFinite(computedHeight) && computedHeight > 0) return computedHeight;
    const scale = getCanvasScale();
    const physicalHeight = cardNode.getBoundingClientRect().height;
    return physicalHeight > 0 ? physicalHeight / Math.max(scale, 0.01) : getCardVisualWidth() * 1.42;
  }

  function setTableauPileHeight(pileNode, cardCount, stackStep) {
    if (!cardCount) {
      pileNode.style.height = "";
      pileNode.style.minHeight = "";
      return;
    }
    const firstCard = pileNode.querySelector(".card");
    if (!firstCard) return;
    const cardHeight = getCardLayoutHeight(firstCard);
    const height = cardHeight + Math.max(0, cardCount - 1) * stackStep + TABLEAU_SELECTION_GUTTER;
    pileNode.style.height = `${height}px`;
    pileNode.style.minHeight = `${height}px`;
  }

  function updateTableauCardPositions(stackStep) {
    ui.tableauRow?.querySelectorAll(".tableau-pile").forEach((pileNode) => {
      const cards = [...pileNode.querySelectorAll(".card")];
      cards.forEach((cardNode, row) => {
        cardNode.style.top = `${row * stackStep}px`;
      });
      setTableauPileHeight(pileNode, cards.length, stackStep);
    });
  }

  function fitTableauStack() {
    const canvas = ui.battleScreen?.querySelector(".battle-canvas");
    const tableauRow = ui.tableauRow;
    const boardShell = ui.battleScreen?.querySelector(".board-shell");
    const piles = tableauRow ? [...tableauRow.querySelectorAll(".tableau-pile")] : [];
    if (!canvas || !boardShell || !tableauRow || !piles.length) return;

    const maxCardCount = Math.max(...piles.map((pile) => pile.querySelectorAll(".card").length));
    const firstCard = tableauRow.querySelector(".tableau-pile .card");
    const firstPile = piles.find((pile) => pile.querySelector(".card")) || piles[0];
    if (!firstCard || !firstPile || maxCardCount <= 1) {
      canvas.style.removeProperty("--card-step");
      updateTableauCardPositions(getLayoutStep());
      return;
    }

    const scale = getCanvasScale();
    const cardHeight = firstCard.getBoundingClientRect().height;
    const availableHeight = boardShell.getBoundingClientRect().bottom
      - firstPile.getBoundingClientRect().top
      - TABLEAU_SELECTION_GUTTER * scale;
    const baseStep = getBaseLayoutStep();
    const basePhysicalStep = baseStep * scale;
    const maxPhysicalStep = (availableHeight - cardHeight - TABLEAU_SELECTION_GUTTER * scale)
      / Math.max(1, maxCardCount - 1);
    const minimumPhysicalStep = MIN_TABLEAU_REVEAL_STEP;
    const targetPhysicalStep = Math.min(basePhysicalStep, maxPhysicalStep);

    if (targetPhysicalStep >= basePhysicalStep - 0.5) {
      canvas.style.removeProperty("--card-step");
    } else {
      const fittedPhysicalStep = Math.max(minimumPhysicalStep, targetPhysicalStep);
      canvas.style.setProperty("--card-step", `${fittedPhysicalStep / Math.max(scale, 0.01)}px`);
    }
    updateTableauCardPositions(getLayoutStep());
  }

  function getCardOffsetStep() {
    return getLayoutStep();
  }

  function clearDealAnimationTimers() {
    if (state.dealProgressTimer) {
      clearInterval(state.dealProgressTimer);
      state.dealProgressTimer = null;
    }
    if (state.dealEndTimer) {
      clearTimeout(state.dealEndTimer);
      state.dealEndTimer = null;
    }
  }

  function buildDealSequence() {
    const sequence = new Map();
    let index = 0;
    for (const columnCards of game.tableau.columns) {
      for (const card of columnCards) {
        sequence.set(card.id, index);
        index += 1;
      }
    }
    for (const card of game.stock.cards) {
      sequence.set(card.id, index);
      index += 1;
    }
    return sequence;
  }

  function getDealDelay(card, fallback = 0) {
    if (!state.dealSequence) return fallback;
    const value = state.dealSequence.get(card.id);
    return Number.isFinite(value) ? value : fallback;
  }

  function renderStatistics() {
    const total = Math.max(1, stats.wins + stats.losses);
    const ratio = Math.round((stats.wins / total) * 100);
    const rows = [
      t("ui.stats.wins", { wins: stats.wins }),
      t("ui.stats.losses", { losses: stats.losses }),
      t("ui.stats.win_rate", { ratio }),
      t("ui.stats.fastest_time", { time: stats.bestTime === null ? "--" : formatTime(Math.round(stats.bestTime / 1000)) }),
      t("ui.stats.least_moves", { moves: stats.bestMoves === null ? "--" : stats.bestMoves }),
    ];
    if (ui.statistics) ui.statistics.innerHTML = `<div>${rows.join("</div><div>")}</div>`;
  }

  function renderHeader() {
    if (ui.drawModeValue) {
      const label = t(DRAW_MODE_LABEL_KEYS[game.drawModeIndex] || "ui.draw_mode.option_1");
      ui.drawModeValue.textContent = t("ui.draw_mode.value", { label });
    }
    if (ui.moveCount) ui.moveCount.textContent = String(game.moveCount);
    if (ui.timeValue) ui.timeValue.textContent = formatTime(state.elapsed);
  }

  function clearHints() {
    state.selectedSource = null;
    if (state.hintTimer) {
      clearTimeout(state.hintTimer);
      state.hintTimer = 0;
    }
    if (ui.hintOverlay) {
      ui.hintOverlay.hidden = true;
      ui.hintOverlay.textContent = "";
    }
    ui.foundationRow?.querySelectorAll("[data-hint]").forEach((node) => node.classList.remove("hint-source", "hint-target"));
    ui.tableauRow?.querySelectorAll("[data-hint]").forEach((node) => node.classList.remove("hint-source", "hint-target"));
    ui.stockPile?.classList.remove("hint-source");
    ui.wastePile?.classList.remove("hint-source");
    clearDragHover();
  }

  function clearDragHover() {
    ui.foundationRow?.querySelectorAll(".drag-hover").forEach((node) => node.classList.remove("drag-hover"));
    ui.tableauRow?.querySelectorAll(".drag-hover").forEach((node) => node.classList.remove("drag-hover"));
  }

  function getDragMetrics() {
    const sourceNode = state.dragging?.sourceNode
      || cardNodePool.get(state.dragging?.ids?.[0]);
    const sourceRect = sourceNode?.getBoundingClientRect?.();
    const cardWidth = sourceRect?.width > 0 ? sourceRect.width : getCardVisualWidth();
    const cardHeight = sourceRect?.height > 0 ? sourceRect.height : cardWidth * 1.42;
    const canvas = ui.battleScreen?.querySelector(".battle-canvas");
    const canvasRect = canvas?.getBoundingClientRect?.();
    const logicalWidth = Number.parseFloat(window.getComputedStyle(canvas || document.body).width);
    const canvasScale = canvasRect?.width > 0 && logicalWidth > 0
      ? canvasRect.width / logicalWidth
      : 1;
    return {
      cardWidth,
      cardHeight,
      ghostRowOffset: (state.dragging?.stackStep || getCardOffsetStep()) * canvasScale * 0.82,
    };
  }

  function isLegalDropTarget(target, legalMoves) {
    if (!target || !Array.isArray(legalMoves)) return false;
    return legalMoves.some((move) => {
      if (target.type === "tableau") {
        return (move.type === "tableauToTableau" && move.toColumn === target.index)
          || (move.type === "wasteToTableau" && move.toColumn === target.index);
      }
      if (target.type === "foundation") {
        return (move.type === "tableauToFoundation" && move.foundationIndex === target.index)
          || (move.type === "wasteToFoundation" && move.foundationIndex === target.index);
      }
      return false;
    });
  }

  function updateDragTargetHighlight(target) {
    const dragging = state.dragging;
    if (!dragging) return;
    if (!target || !isLegalDropTarget(target, dragging.legalMoves || [])) {
      clearDragHover();
      dragging.hoverTarget = null;
      return;
    }
    if (dragging.hoverTarget && dragging.hoverTarget.type === target.type && dragging.hoverTarget.index === target.index) {
      return;
    }
    clearDragHover();
    const node = target.type === "tableau"
      ? ui.tableauRow?.querySelector(`[data-type='tableau'][data-index='${target.index}']`)
      : ui.foundationRow?.querySelector(`[data-type='foundation'][data-index='${target.index}']`);
    if (node) {
      node.classList.add("drag-hover");
      dragging.hoverTarget = target;
    }
  }

  function highlightMoveHint(move) {
    if (!move) return;
    if (move.type === "wasteToFoundation") {
      ui.wastePile?.classList.add("hint-source");
      ui.foundationRow?.querySelector(`[data-index='${move.foundationIndex}']`)?.classList.add("hint-target");
      return;
    }
    if (move.type === "wasteToTableau") {
      ui.wastePile?.classList.add("hint-source");
      ui.tableauRow?.querySelector(`[data-index='${move.toColumn}']`)?.classList.add("hint-target");
      return;
    }
    if (move.type === "tableauToFoundation") {
      ui.tableauRow?.querySelector(`[data-index='${move.fromColumn}']`)?.classList.add("hint-source");
      ui.foundationRow?.querySelector(`[data-index='${move.foundationIndex}']`)?.classList.add("hint-target");
      return;
    }
    if (move.type === "tableauToTableau") {
      ui.tableauRow?.querySelector(`[data-index='${move.fromColumn}']`)?.classList.add("hint-source");
      ui.tableauRow?.querySelector(`[data-index='${move.toColumn}']`)?.classList.add("hint-target");
    }
  }

  function hasAnyDrawAction() {
    return game.stock.cards.length > 0 || game.waste.cards.length > 0;
  }

  function focusHintSource(node) {
    if (!node || typeof node.focus !== "function") return;
    window.requestAnimationFrame(() => {
      if (!state.active || !node.isConnected || node.closest("[hidden]")) return;
      node.focus({ preventScroll: true });
    });
  }

  function showNoMoveHint() {
    if (hasAnyLegalMoves()) return;
    if (game.stock.cards.length > 0) {
      ui.stockPile?.classList.add("hint-source");
      showHint(t("ui.hint.draw_stock"));
      focusHintSource(ui.stockPile);
      return;
    }
    if (game.waste.cards.length > 0) {
      ui.wastePile?.classList.add("hint-source");
      showHint(t("ui.hint.recycle_waste"));
      focusHintSource(ui.wastePile);
      return;
    }
    showHint(t(NO_MOVES_MESSAGE));
  }

  function showHint(msg, highlightOnly = false) {
    if (!highlightOnly && !msg) return;
    if (ui.hintOverlay) {
      ui.hintOverlay.innerHTML = `<p>${msg}</p>`;
      ui.hintOverlay.hidden = false;
      if (state.hintTimer) clearTimeout(state.hintTimer);
      state.hintTimer = window.setTimeout(() => {
        ui.hintOverlay.hidden = true;
      }, HINT_MS);
    }
  }

  function isTerminalNoMoves() {
    if (game.completed) return false;
    if (game.allLegalMoves().length > 0) return false;
    return game.stock.cards.length === 0 && game.waste.cards.length === 0;
  }

  function clearVictoryClasses() {
    if (victoryAnimationState.timer) {
      clearTimeout(victoryAnimationState.timer);
      victoryAnimationState.timer = null;
    }
    if (victoryAnimationState.cards.length) {
      for (const card of victoryAnimationState.cards) {
        card.classList.remove("victory-card");
        card.style.animationDelay = "0ms";
      }
    }
    victoryAnimationState.cards = [];
  }

  function forceCloseResultOverlay() {
    if (ui.resultOverlay) ui.resultOverlay.hidden = true;
  }

  function createCardElement(card, isNew, withDelay = 0, animateFace = false, row = 0) {
    let node = cardNodePool.get(card.id);
    if (!node) {
      node = document.createElement("div");
      node.className = "card";
      node.dataset.cardId = card.id;
      cardNodePool.set(card.id, node);
    }

    node.className = `card ${card.faceUp ? "front" : "back"} ${card.colorClass}`;
    node.dataset.face = card.faceUp ? "up" : "down";
    node.dataset.row = String(row);
    node.dataset.cardRank = card.rank;
    node.dataset.cardSuit = card.suit;
    node.setAttribute("aria-label", card.faceUp ? `${card.rankLabel} of ${card.suit}` : t("ui.card.face_down"));
    node.setAttribute("role", "img");

    if (card.faceUp) {
      node.innerHTML = `
        <span class=\"rank-top\" aria-hidden=\"true\">${card.rankLabel}</span>
        <span class=\"suit\" aria-hidden=\"true\">${SUIT_SYMBOLS[card.suit]}</span>
        <span class=\"rank-bottom\" aria-hidden=\"true\">${card.rankLabel}</span>
      `;
    } else {
      node.innerHTML = `<span class=\"card-back-pattern\" aria-hidden=\"true\"></span>`;
    }

    if (isNew) {
      node.classList.add("card-deal");
      const delay = getDealDelay(card, withDelay);
      const cappedDelay = clamp(delay, 0, CARD_DEAL_MAX_DELAY);
      node.style.animationDelay = `${cappedDelay * DEAL_STEP_MS}ms`;
    } else {
      node.classList.remove("card-deal");
      node.style.animationDelay = "0ms";
    }

    const previousFace = cardRevealCache.get(card.id);
    if (animateFace && !previousFace && card.faceUp) {
      node.classList.add("card-flip");
    }
    if (card.faceUp) node.classList.add("front");
    cardRevealCache.set(card.id, card.faceUp);
    return node;
  }

  function positionCardsOnPile(pileNode, cards, pileType, pileIndex, maxVisible = 3) {
    const existing = [...pileNode.children];
    for (const child of existing) {
      if (!cards.some((card) => card.id === child.dataset.cardId)) {
        child.remove();
      }
    }

    const nodes = cards.map((card, row) => {
      const previous = state.lastFrameCards.get(card.id);
      const delay = getDealDelay(card, state.renderGeneration + row);
      const node = createCardElement(card, !previous, delay, previous?.face !== card.faceUp, row);
      const stackStep = getCardOffsetStep();
      node.style.left = "0px";
      if (pileType === "tableau") node.style.top = `${row * stackStep}px`;
      if (pileType === "foundation") node.style.top = "0px";
      if (pileType === "stock") {
        node.style.top = "0px";
        node.style.left = "0px";
      }
      if (pileType === "waste") {
        node.style.top = "0px";
        node.style.left = "0px";
      }
      node.classList.remove("selected", "drag-hover");
      return node;
    });

    pileNode.textContent = "";
    if (!nodes.length) {
      if (pileType === "stock") {
        const empty = document.createElement("span");
        empty.className = "card-stack-note";
        empty.textContent = t("ui.board.empty_stock");
        pileNode.append(empty);
      }
      if (pileType === "waste") {
        const empty = document.createElement("span");
        empty.className = "card-stack-note";
        empty.textContent = t("ui.board.empty_waste");
        pileNode.append(empty);
      }
      return;
    }

    if (pileType === "tableau") {
      const shouldAttachInteraction = (card, row) => card.faceUp;
      for (let row = 0; row < nodes.length; row += 1) {
        const card = cards[row];
        const node = nodes[row];
        if (shouldAttachInteraction(card, row) && pileType === "tableau") {
          if (card.faceUp) {
            node.onpointerdown = beginDrag;
            node.onkeydown = onCardKeydown;
          } else {
            node.onpointerdown = null;
            node.onkeydown = null;
          }
          node.tabIndex = 0;
        } else {
          node.onpointerdown = null;
          node.onkeydown = null;
          node.tabIndex = -1;
        }
        pileNode.append(node);
      }
      setTableauPileHeight(pileNode, nodes.length, getCardOffsetStep());
      return;
    }

    if (pileType === "waste") {
      const visible = nodes.slice(-Math.min(maxVisible, nodes.length));
      const wasteStep = Math.max(14, Math.round(getCardOffsetStep() * 0.62));
      for (let row = 0; row < visible.length; row += 1) {
        const node = visible[row];
        const card = cards[cards.length - visible.length + row];
        node.style.left = `${row * wasteStep}px`;
        if (row === visible.length - 1) {
          node.onpointerdown = beginDrag;
          node.onkeydown = onCardKeydown;
        } else {
          node.onpointerdown = null;
          node.onkeydown = null;
          node.tabIndex = 0;
        }
        node.tabIndex = row === visible.length - 1 ? 0 : -1;
        pileNode.append(node);
      }
      return;
    }

    if (pileType === "foundation") {
      for (const node of nodes) pileNode.append(node);
      return;
    }

    for (const node of nodes) pileNode.append(node);
  }

  function renderBoard() {
    if (!ui.battleScreen) return;
    state.renderGeneration += 1;
    ui.foundationRow.innerHTML = "";
    ui.tableauRow.innerHTML = "";

    game.foundations.forEach((foundation, index) => {
      const node = document.createElement("button");
      node.className = "pile foundation-slot";
      node.dataset.type = "foundation";
      node.dataset.index = index;
      node.dataset.hint = "true";
      node.type = "button";
      node.setAttribute("aria-label", t("ui.aria.foundation", { suit: SUITS[index] }));
      if (!foundation.cards.length) {
        const note = document.createElement("span");
        note.className = "card-stack-note";
        note.textContent = SUIT_SYMBOLS[foundation.suit];
        node.append(note);
      } else {
        positionCardsOnPile(node, [foundation.top()], "foundation", index, 1);
      }
      ui.foundationRow.append(node);
    });

    const stockRoot = ui.stockPile;
    stockRoot.className = "pile stock";
    stockRoot.dataset.type = "stock";
    stockRoot.innerHTML = "";
    stockRoot.dataset.count = String(game.stock.cards.length);
    stockRoot.setAttribute("aria-label", t("ui.aria.stock", { count: game.stock.cards.length }));
    const stockLabel = document.createElement("span");
    stockLabel.className = "card-stack-note";
    stockLabel.textContent = String(game.stock.cards.length);
    stockRoot.append(stockLabel);

    const wasteRoot = ui.wastePile;
    wasteRoot.className = "pile waste";
    wasteRoot.dataset.type = "waste";
    wasteRoot.innerHTML = "";
    positionCardsOnPile(wasteRoot, game.waste.cards, "waste", 0, DRAW_MODES[game.drawModeIndex]);
    wasteRoot.dataset.count = String(game.waste.cards.length);
    wasteRoot.setAttribute("aria-label", t("ui.aria.waste", { count: game.waste.cards.length }));

    game.tableau.columns.forEach((columnCards, index) => {
      const node = document.createElement("section");
      node.className = "pile tableau-pile";
      node.dataset.type = "tableau";
      node.dataset.index = index;
      node.dataset.hint = "true";
      positionCardsOnPile(node, columnCards, "tableau", index, 1);
      ui.tableauRow.append(node);
    });

    fitTableauStack();

    renderHeader();
    if (!state.lastFrameCards) state.lastFrameCards = new Map();
    for (const card of [...game.waste.cards, ...game.stock.cards, ...game.foundations.flatMap((f) => f.cards), ...game.tableau.columns.flat()]) {
      const record = state.lastFrameCards.get(card.id);
      if (record) {
        record.face = card.faceUp;
      } else {
        state.lastFrameCards.set(card.id, { id: card.id, face: card.faceUp });
      }
    }
  }

  function startClock() {
    pauseClock();
    const startAt = now() - state.elapsed * 1000;
    state.timer = window.setInterval(() => {
      state.elapsed = Math.round((now() - startAt) / 1000);
      if (ui.timeValue) ui.timeValue.textContent = formatTime(state.elapsed);
    }, 500);
  }

  function pauseClock() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function restartClock() {
    state.elapsed = 0;
    state.gameStartedAt = now();
    startClock();
  }

  function markLossIfAbandoned() {
    if (!state.active) return;
    if (game.completed) return;
    if (game.moveCount <= 0) return;
    if (state.lossRecordedForCurrentBoard) return;
    stats.losses += 1;
    state.lossRecordedForCurrentBoard = true;
    statsStorage.save();
    renderStatistics();
  }

  function markLossFromNoMoves() {
    if (!state.active) return;
    if (game.completed) return;
    if (!isTerminalNoMoves()) return;
    if (game.moveCount <= 0) return;
    if (state.lossRecordedForCurrentBoard) return;
    state.lossRecordedForCurrentBoard = true;
    stats.losses += 1;
    statsStorage.save();
    renderStatistics();
  }

  function hasAnyLegalMoves() {
    return game.allLegalMoves().length > 0;
  }

  function selectedMoveForTarget(target) {
    if (!state.selectedSource || !target) return null;
    return state.selectedSource.legalMoves.find((move) => {
      if (target.type === "tableau") {
        return (move.type === "tableauToTableau" || move.type === "wasteToTableau")
          && move.toColumn === target.index;
      }
      if (target.type === "foundation") {
        return (move.type === "tableauToFoundation" || move.type === "wasteToFoundation")
          && move.foundationIndex === target.index;
      }
      return false;
    }) || null;
  }

  function selectMoveSource(source, legalMoves) {
    clearHints();
    state.selectedSource = { ...source, legalMoves };
    legalMoves.forEach((move) => highlightMoveHint(move));
    showHint(KL_SELECTION_RULE_COPY[getKlLocale()] || KL_SELECTION_RULE_COPY.en);
  }

  function handleTableauTap(sourceColumn, row) {
    if (!Number.isFinite(sourceColumn) || sourceColumn < 0 || !Number.isFinite(row) || row < 0) return false;
    const moveList = game.legalMovesForTableau(sourceColumn, row);
    if (state.selectedSource?.from === "tableau"
      && state.selectedSource.fromColumn === sourceColumn
      && state.selectedSource.startRow === row) {
      clearHints();
      return true;
    }
    if (!moveList.length) {
      clearHints();
      if (!hasAnyLegalMoves()) showNoMoveHint();
      return true;
    }
    selectMoveSource({ from: "tableau", fromColumn: sourceColumn, startRow: row }, moveList);
    return true;
  }

  function handleWasteTap() {
    const moveList = game.legalMovesForWaste();
    if (state.selectedSource?.from === "waste") {
      clearHints();
      return true;
    }
    if (!moveList.length) {
      clearHints();
      if (!hasAnyLegalMoves()) showNoMoveHint();
      return true;
    }
    selectMoveSource({ from: "waste" }, moveList);
    return true;
  }

  function onDestinationClick(event) {
    const pile = event.target?.closest?.("[data-type='tableau'], [data-type='foundation']");
    if (!pile) return;
    const target = {
      type: pile?.dataset.type,
      index: Number(pile?.dataset.index),
    };
    const move = selectedMoveForTarget(target);
    if (!move) return;
    const moved = tryPerformMove(move);
    if (!moved) audio.reject();
  }

  function onDestinationPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    const pile = event.target?.closest?.("[data-type='tableau'], [data-type='foundation']");
    if (!pile) return;
    const move = selectedMoveForTarget({
      type: pile.dataset.type,
      index: Number(pile.dataset.index),
    });
    if (!move) return;
    event.preventDefault();
    event.stopPropagation();
    const moved = tryPerformMove(move);
    if (!moved) audio.reject();
  }

  function onCardKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    const cardNode = event.currentTarget;
    const pile = cardNode.closest("[data-type]");
    const sourceType = pile?.dataset.type;
    const targetMove = selectedMoveForTarget({
      type: sourceType,
      index: Number(pile?.dataset.index),
    });
    if (targetMove) {
      const moved = tryPerformMove(targetMove);
      if (!moved) audio.reject();
      return;
    }
    const moved = sourceType === "tableau"
      ? handleTableauTap(Number(pile.dataset.index), Number(cardNode.dataset.row))
      : sourceType === "waste" ? handleWasteTap() : false;
    if (!moved) audio.reject();
  }

  function syncDrawLabel() {
    const label = t(DRAW_MODE_LABEL_KEYS[game.drawModeIndex] || "ui.draw_mode.option_1");
    if (ui.drawModeBtn) {
      const resolved = t("ui.draw_mode.toggle", { label });
      ui.drawModeBtn.textContent = label;
      ui.drawModeBtn.setAttribute("aria-label", resolved);
    }
    if (ui.drawModeValue) ui.drawModeValue.textContent = t("ui.draw_mode.value", { label });
  }

  function toggleSound() {
    audio.setEnabled(!audio.enabled);
    setSoundButtons(audio.enabled);
  }

  function switchDrawMode() {
    if (state.boardAnimationInProgress) return;
    clearHints();
    game.drawModeIndex = (game.drawModeIndex + 1) % DRAW_MODES.length;
    syncDrawLabel();
    localStorage.setItem(STORAGE_LAYOUT, String(game.drawModeIndex));
    renderBoard();
  }

  function beginDrag(event) {
    if (state.boardAnimationInProgress) return;
    const cardNode = event.currentTarget;
    const sourceType = cardNode.closest("[data-type]")?.dataset.type;
    const pileNode = cardNode.closest("[data-type]");
    if (!sourceType || !pileNode) return;
    const target = selectedMoveForTarget({
      type: sourceType,
      index: Number(pileNode.dataset.index),
    });
    if (target) {
      // A legal destination can itself be covered by a face-up card. On touch
      // browsers that card receives pointerdown before the pile click; commit
      // here so J♥ -> Q♠ is not mistaken for a new source selection.
      event.preventDefault();
      event.stopPropagation();
      const moved = tryPerformMove(target);
      if (!moved) audio.reject();
      return;
    }
    if (sourceType === "tableau") {
      const col = Number(pileNode.dataset.index);
      const row = cardNode.dataset.row !== undefined
        ? Number(cardNode.dataset.row)
        : Array.from(pileNode.children).findIndex((node) => node === cardNode);
      const moveGroup = game.allMovableCardsFromTableau(col, row);
      if (!moveGroup) return;
      state.dragging = {
        from: "tableau",
        fromColumn: col,
        startRow: row,
        ids: moveGroup.cards.map((card) => card.id),
        x: event.clientX,
        y: event.clientY,
        stackStep: getCardOffsetStep(),
        sourceNode: cardNode,
      };
      state.dragging.legalMoves = game.legalMovesForTableau(col, row);
    } else if (sourceType === "waste") {
      const top = game.waste.top();
      if (!top || top.id !== cardNode.dataset.cardId) return;
      state.dragging = {
        from: "waste",
        ids: [top.id],
        x: event.clientX,
        y: event.clientY,
        stackStep: getCardOffsetStep(),
        sourceNode: cardNode,
      };
      state.dragging.legalMoves = game.legalMovesForWaste();
    } else {
      return;
    }
    state.dragging.hoverTarget = null;
    const sourceRect = cardNode.getBoundingClientRect();
    state.dragging.pointerOffsetX = clamp(event.clientX - sourceRect.left, 0, sourceRect.width);
    state.dragging.pointerOffsetY = clamp(event.clientY - sourceRect.top, 0, sourceRect.height);
    state.dragging.metrics = getDragMetrics();
    state.dragging.pendingAnimationFrame = 0;
    state.dragging.pendingPointer = null;
    clearDragHover();

    const ghosts = [];
    const cards = state.dragging.ids.map((cardId) => findCardById(cardId)).filter(Boolean);
    const startX = event.clientX - state.dragging.pointerOffsetX;
    const startY = event.clientY - state.dragging.pointerOffsetY;
    const ghostRowOffset = state.dragging.metrics.ghostRowOffset;
    cards.forEach((card, idx) => {
      // The drag preview must be a clone. Reusing the pooled source node moves
      // the real card into dragLayer, so a simple tap would make it disappear.
      const sourceNode = cardNodePool.get(card.id);
      const ghost = sourceNode?.cloneNode(true);
      if (!ghost) return;
      ghost.classList.add("ghost-card");
      ghost.style.width = `${state.dragging.metrics.cardWidth}px`;
      ghost.style.height = `${state.dragging.metrics.cardHeight}px`;
      ghost.style.left = `${startX}px`;
      ghost.style.top = `${startY + idx * ghostRowOffset}px`;
      ghost.style.opacity = "0.95";
      ui.dragLayer.append(ghost);
      ui.dragLayer.style.pointerEvents = "none";
      ghosts.push(ghost);
    });
    ui.dragLayer.hidden = false;
    state.dragging.ghosts = ghosts;
    state.dragging.dragging = false;
    const moveHandler = (ev) => onDragMove(ev);
    const endHandler = (ev) => onDragEnd(ev);
    const cancelHandler = () => onDragEnd({ clientX: state.dragging.x, clientY: state.dragging.y });
    state.dragging.moveHandler = moveHandler;
    state.dragging.endHandler = endHandler;
    state.dragging.cancelHandler = cancelHandler;
    state.dragging.sourceNode = cardNode;
    state.dragging.pointerId = event.pointerId;
    document.addEventListener("pointermove", moveHandler, true);
    document.addEventListener("pointerup", endHandler, true);
    document.addEventListener("pointercancel", cancelHandler, true);
    if (state.dragging.pointerId) {
      cardNode.setPointerCapture?.(state.dragging.pointerId);
    }
    event.preventDefault();
  }

  function onDragMove(event) {
    if (!state.dragging) return;
    const distance = Math.hypot(event.clientX - state.dragging.x, event.clientY - state.dragging.y);
    if (distance > CLICK_MOVED_THRESHOLD) state.dragging.dragging = true;
    if (!state.dragging.dragging) return;
    if (!state.dragging.ghosts) return;
    const pointerSnapshot = { x: event.clientX, y: event.clientY };
    if (state.dragging.pendingAnimationFrame) {
      state.dragging.pendingPointer = pointerSnapshot;
      return;
    }
    state.dragging.pendingPointer = pointerSnapshot;
    state.dragging.pendingAnimationFrame = window.requestAnimationFrame(() => {
      const dragging = state.dragging;
      if (!dragging || !dragging.ghosts) return;
      const metrics = dragging.metrics || getDragMetrics();
      const currentPointer = dragging.pendingPointer || pointerSnapshot;
      dragging.pendingAnimationFrame = 0;
      dragging.pendingPointer = null;
      const startX = currentPointer.x - dragging.pointerOffsetX;
      const startY = currentPointer.y - dragging.pointerOffsetY;
      dragging.ghosts.forEach((node, index) => {
        node.style.left = `${startX}px`;
        node.style.top = `${startY + index * metrics.ghostRowOffset}px`;
      });
      const target = locateDropTarget(currentPointer.x, currentPointer.y);
      updateDragTargetHighlight(target);
    });
  }

  function onDragEnd(event) {
    if (state.dragging) {
      const {
        sourceNode,
        pointerId,
        moveHandler,
        endHandler,
        cancelHandler,
      } = state.dragging;
      sourceNode?.releasePointerCapture?.(pointerId);
      document.removeEventListener("pointermove", moveHandler, true);
      document.removeEventListener("pointerup", endHandler, true);
      document.removeEventListener("pointercancel", cancelHandler, true);
      state.dragging.moveHandler = null;
      state.dragging.endHandler = null;
      state.dragging.cancelHandler = null;
      state.dragging.sourceNode = null;
      state.dragging.pointerId = null;
    }

    if (!state.dragging) return cleanupDrag();
    if (!state.dragging.dragging) {
      const handledByTap = (() => {
        if (state.dragging.from === "tableau") {
          return handleTableauTap(state.dragging.fromColumn, state.dragging.startRow);
        }
        if (state.dragging.from === "waste") {
          return handleWasteTap();
        }
        return false;
      })();
      cleanupDrag();
      if (!handledByTap) audio.reject();
      return;
    }
    const target = locateDropTarget(event.clientX, event.clientY);
    if (state.dragging.dragging && target) {
      let moved = false;
      if (state.dragging.from === "tableau") {
        const payload = { column: state.dragging.fromColumn, row: state.dragging.startRow, ids: state.dragging.ids };
        const firstCard = findCardById(state.dragging.ids[0]);
        if (target.type === "tableau") {
          const move = {
            type: "tableauToTableau",
            from: "tableau",
            fromColumn: payload.column,
            startRow: payload.row,
            toColumn: target.index,
          };
          moved = tryPerformMove(move);
        }
        if (target.type === "foundation" && target.index >= 0 && firstCard && payload.ids.length === 1) {
          const move = {
            type: "tableauToFoundation",
            from: "tableau",
            fromColumn: payload.column,
            startRow: payload.row,
            foundationIndex: target.index,
          };
          moved = tryPerformMove(move);
        }
      } else if (state.dragging.from === "waste") {
        const top = game.waste.top();
        if (top && target.type === "tableau") {
          moved = tryPerformMove({
            type: "wasteToTableau",
            from: "waste",
            toColumn: target.index,
          });
        } else if (top && target.type === "foundation") {
          moved = tryPerformMove({
            type: "wasteToFoundation",
            from: "waste",
            foundationIndex: target.index,
          });
        }
      }
      if (!moved) audio.reject();
    } else {
      audio.reject();
    }
    cleanupDrag();
  }

  function cleanupDrag() {
    clearDragHover();
    if (state.dragging?.pendingAnimationFrame) {
      cancelAnimationFrame(state.dragging.pendingAnimationFrame);
    }
    if (!state.dragging) return;
    if (state.dragging.ghosts) {
      for (const ghost of state.dragging.ghosts) ghost.remove();
    }
    if (state.dragging.moveHandler || state.dragging.endHandler || state.dragging.cancelHandler || state.dragging.sourceNode || state.dragging.pointerId) {
      const {
        sourceNode,
        pointerId,
        moveHandler,
        endHandler,
        cancelHandler,
      } = state.dragging;
      sourceNode?.releasePointerCapture?.(pointerId);
      document.removeEventListener("pointermove", moveHandler, true);
      document.removeEventListener("pointerup", endHandler, true);
      document.removeEventListener("pointercancel", cancelHandler, true);
    }
    state.dragging.pendingAnimationFrame = null;
    state.dragging.pendingPointer = null;
    state.dragging.metrics = null;
    state.dragging.hoverTarget = null;
    state.dragging.legalMoves = null;
    ui.dragLayer.innerHTML = "";
    ui.dragLayer.hidden = true;
    state.dragging = null;
  }

  function locateDropTarget(x, y) {
    const hit = document.elementsFromPoint(x, y);
    for (const item of hit) {
      if (!(item instanceof Element)) continue;
      const tableau = item.closest("[data-type='tableau']");
      if (tableau) return { type: "tableau", index: Number(tableau.dataset.index) };
      const foundation = item.closest("[data-type='foundation']");
      if (foundation) return { type: "foundation", index: Number(foundation.dataset.index) };
    }
    return null;
  }

  function findCardById(cardId) {
    for (const column of game.tableau.columns) {
      const card = column.find((candidate) => candidate.id === cardId);
      if (card) return card;
    }
    return game.waste.cards.find((card) => card.id === cardId)
      || game.stock.cards.find((card) => card.id === cardId)
      || game.foundations.flatMap((f) => f.cards).find((card) => card.id === cardId);
  }

  function moveCardIds(move) {
    if (move.type === "wasteToFoundation" || move.type === "wasteToTableau") {
      const card = game.waste.top();
      return card ? [card.id] : [];
    }
    if (move.type === "tableauToFoundation" || move.type === "tableauToTableau") {
      return game.tableau.columns[move.fromColumn]?.slice(move.startRow).map((card) => card.id) || [];
    }
    return [];
  }

  function captureMoveRects(cardIds) {
    const rects = new Map();
    cardIds.forEach((cardId) => {
      const node = cardNodePool.get(cardId);
      if (!node?.isConnected) return;
      const rect = node.getBoundingClientRect();
      rects.set(cardId, { x: rect.left, y: rect.top });
    });
    return rects;
  }

  function animateMoveCards(cardIds, beforeRects) {
    if (state.autoFinishing || !beforeRects?.size) return;
    const moving = [];
    cardIds.forEach((cardId) => {
      const node = cardNodePool.get(cardId);
      const before = beforeRects.get(cardId);
      if (!node?.isConnected || !before || node.classList.contains("card-flip")) return;
      const after = node.getBoundingClientRect();
      const dx = before.x - after.left;
      const dy = before.y - after.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      moving.push({ node, dx, dy });
    });
    if (!moving.length) return;
    moving.forEach(({ node, dx, dy }) => {
      node.style.transition = "none";
      node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });
    requestAnimationFrame(() => {
      moving.forEach(({ node }) => {
        node.style.transition = "transform 220ms cubic-bezier(.2,.8,.2,1)";
        node.style.transform = "";
      });
      window.setTimeout(() => moving.forEach(({ node }) => {
        node.style.removeProperty("transition");
        node.style.removeProperty("transform");
      }), 240);
    });
  }

  function tryPerformMove(move) {
    if (!move) return false;
    if (move.type === "wasteToFoundation" || move.type === "tableauToFoundation" || move.type === "tableauToTableau" || move.type === "wasteToTableau") {
      const cardIds = moveCardIds(move);
      const beforeRects = captureMoveRects(cardIds);
      game.pushHistory();
      const result = game.applyMove(move);
      if (!result) {
        game.moveHistory.pop();
        return false;
      }
      if (result) {
        state.deadlockHintShown = false;
        audio.place();
        state.boardAnimationInProgress = true;
        renderBoard();
        animateMoveCards(cardIds, beforeRects);
        const settleDelay = state.autoFinishing ? 0 : 240;
        window.setTimeout(() => {
          state.boardAnimationInProgress = false;
          postMoveChecks();
        }, settleDelay);
      }
      return result;
    }
    if (move.type === "recycle") {
      game.pushHistory();
      game.stock.recycle(game.waste.cards);
      game.waste.clear();
      game.moveCount += 1;
      renderBoard();
      audio.flip();
      return true;
    }
    return false;
  }

  function postMoveChecks() {
    if (game.completed && state.active) {
      onWin();
      return;
    }
    const flipped = revealTopCards();
    if (flipped) {
      audio.flip();
    }
    clearHints();
    maybeShowNoMoves();
  }

  function revealTopCards() {
    let flipped = false;
    game.tableau.columns.forEach((column, index) => {
      const top = column.at(-1);
      if (!top) return;
      if (!top.faceUp) {
        const moveResult = game.applyMove({
          type: "reveal",
          fromColumn: index,
        });
        if (moveResult) {
          flipped = true;
        }
      }
    });
    return flipped;
  }

  function onWin() {
    if (state.resultShown) return;
    state.resultShown = true;
    clearHints();
    pauseClock();
    clearVictoryClasses();
    audio.win();
    const foundationCards = [...ui.foundationRow?.querySelectorAll(".card") || []];
    if (foundationCards.length) {
      state.boardAnimationInProgress = true;
      foundationCards.forEach((cardNode, index) => {
        cardNode.classList.add("victory-card");
        cardNode.style.animationDelay = `${index * VICTORY_STEP_MS}ms`;
        victoryAnimationState.cards.push(cardNode);
      });
      victoryAnimationState.timer = window.setTimeout(() => {
        state.boardAnimationInProgress = false;
        clearVictoryClasses();
      }, foundationCards.length * VICTORY_STEP_MS + 360);
    }
    let timeRecord = false;
    let moveRecord = false;
    const elapsedMs = state.elapsed * 1000;
    if (stats.bestTime === null || elapsedMs < stats.bestTime) {
      stats.bestTime = elapsedMs;
      timeRecord = true;
    }
    if (stats.bestMoves === null || game.moveCount < stats.bestMoves) {
      stats.bestMoves = game.moveCount;
      moveRecord = true;
    }
    stats.wins += 1;
    statsStorage.save();
    renderStatistics();
    if (ui.resultText) {
      const recordLines = [];
      const fastest = t("ui.result.fastest", { time: formatTime(Math.round(stats.bestTime / 1000)) });
      const least = t("ui.result.least", { moves: stats.bestMoves });
      const total = stats.wins + stats.losses;
      const winRate = total > 0 ? Math.round((stats.wins / total) * 100) : 0;
      const records = t("ui.result.records", {
        wins: stats.wins,
        losses: stats.losses,
        ratio: winRate,
      });
      if (timeRecord) recordLines.push(t("ui.result.record_time"));
      if (moveRecord) recordLines.push(t("ui.result.record_moves"));
      const recordText = recordLines.length > 0 ? ` ${recordLines.join(" ")}` : "";
      const dealId = formatDealId(game.dealId);
      ui.resultText.dataset.dealId = dealId;
      ui.resultText.innerHTML = `${t("ui.result.victory_prefix", {
        time: formatTime(state.elapsed),
        moves: game.moveCount,
      })}${recordText}<br>${t("ui.result.victory_body", {
        fastest,
        least,
      })}<br>${records}<br><span class="result-deal-id">${t("ui.result.deal_identity", { id: dealId })}</span>`;
    }
    if (ui.resultOverlay) {
      ui.resultOverlay.classList.remove("result-enter");
      ui.resultOverlay.classList.add("result-enter");
      ui.resultOverlay.hidden = false;
    }
  }

  function maybeShowNoMoves() {
    if (!state.active) return;
    if (game.completed) return;
    if (!isTerminalNoMoves()) return;
    if (state.deadlockHintShown) return;
    state.deadlockHintShown = true;
    showHint(t(NO_MOVES_MESSAGE));
    markLossFromNoMoves();
  }

  function resetRenderCaches() {
    if (!state.lastFrameCards) state.lastFrameCards = new Map();
    state.lastFrameCards.clear();
    cardRevealCache.clear();
    cardNodePool.clear();
  }

  function onTableauCardClick(event) {
    event.preventDefault();
    const cardNode = event.currentTarget;
    const sourceColumn = Number(cardNode.closest("[data-type='tableau']")?.dataset.index);
    const row = cardNode.dataset.row !== undefined
      ? Number(cardNode.dataset.row)
      : getVisualRowFromNode(cardNode);
    const moved = handleTableauTap(sourceColumn, row);
    if (!moved) audio.reject();
  }

  function getVisualRowFromNode(node) {
    const pile = node.closest("[data-type='tableau']");
    if (!pile) return null;
    const cards = pile.querySelectorAll("[data-face='up'],[data-face='down']");
    return [...cards].indexOf(node);
  }

  function onWasteClick(event) {
    event.preventDefault();
    const moved = handleWasteTap();
    if (!moved) audio.reject();
  }

  function onHint() {
    if (state.boardAnimationInProgress) return;
    clearHints();
    const foundationMoves = game.foundationMoveableMoves();
    const all = game.allLegalMoves();
    const hint = foundationMoves[0] || all[0];
    if (!hint) {
      showNoMoveHint();
      return;
    }
    highlightMoveHint(hint);
    if (hint.type === "wasteToFoundation" || hint.type === "wasteToTableau") {
      const reasonKey = hint.type === "wasteToFoundation"
        ? "ui.hint.reason.waste_foundation"
        : "ui.hint.reason.waste_tableau";
      showHint(`<span>${t("ui.hint.move_waste_destination")}</span><br><small class="hint-reason">${t(reasonKey)}</small>`);
      return;
    }
    if (hint.type === "tableauToFoundation") {
      showHint(`<span>${t("ui.hint.move_tableau_foundation")}</span><br><small class="hint-reason">${t("ui.hint.reason.tableau_foundation")}</small>`);
      return;
    }
    showHint(`<span>${t("ui.hint.move_tableau_stack")}</span><br><small class="hint-reason">${t("ui.hint.reason.tableau_stack")}</small>`);
  }

  async function onAutoFinish() {
    if (state.boardAnimationInProgress) return;
    if (state.autoFinishing || !state.active) return;
    if (game.completed) return;

    clearHints();

    const strategicMoves = game.allLegalMoves().filter((move) => move.type === "wasteToTableau" || move.type === "tableauToTableau");
    if (strategicMoves.length > 0) {
      audio.reject();
      showHint(t("ui.hint.auto_finish_blocked"));
      return;
    }

    const foundationMovesAvailable = game.foundationMoveableMoves();
    if (foundationMovesAvailable.length === 0) {
      if (isTerminalNoMoves()) {
        showHint(t(NO_MOVES_MESSAGE));
        return;
      }
      if (hasAnyDrawAction()) {
        showNoMoveHint();
        return;
      }
      showHint(t("ui.hint.no_foundation_moves"));
      return;
    }

    state.autoFinishing = true;
    state.boardAnimationInProgress = true;
    clearHints();
    try {
      while (true) {
        if (!state.active || game.completed) break;
        const move = game.foundationMoveableMoves()[0];
        if (!move) break;
        if (!tryPerformMove(move)) break;
        await sleep(AUTO_FINISH_STEP_MS);
      }
    } finally {
      state.autoFinishing = false;
      state.boardAnimationInProgress = false;
    }
  }

  function onUndo() {
    if (state.boardAnimationInProgress) return;
    if (!game.canUndo()) {
      audio.reject();
      return;
    }
    const ok = game.undo();
    if (ok) {
      state.deadlockHintShown = false;
      state.lossRecordedForCurrentBoard = false;
      renderBoard();
      renderHeader();
      clearHints();
      showHint(t("ui.feedback.undo_applied"));
    } else {
      audio.reject();
    }
  }

  function onDraw() {
    if (state.boardAnimationInProgress) return;
    clearHints();
    state.deadlockHintShown = false;
    const result = game.draw();
    if (!result) {
      audio.reject();
      return;
    }
    renderBoard();
    audio.draw();
    renderHeader();
    maybeShowNoMoves();
  }

  function performResultNewGame() {
    markLossIfAbandoned();
    createNewGame();
    openBattle();
    if (ui.resultOverlay) ui.resultOverlay.hidden = true;
  }

  function performResultRestart() {
    markLossIfAbandoned();
    state.deadlockHintShown = false;
    state.lossRecordedForCurrentBoard = false;
    state.resultShown = false;
    const drawMode = game.drawModeIndex;
    game.restore(game.initialSnapshot);
    game.drawModeIndex = drawMode;
    game.moveCount = 0;
    game.completed = false;
    game.moveHistory = [];
    resetRenderCaches();
    state.elapsed = 0;
    syncDrawLabel();
    renderBoard();
    renderHeader();
    pauseClock();
    if (state.active) restartClock();
    if (ui.resultOverlay) ui.resultOverlay.hidden = true;
  }

  function createNewGame() {
    markLossIfAbandoned();
    state.deadlockHintShown = false;
    state.lossRecordedForCurrentBoard = false;
    state.resultShown = false;
    clearDealAnimationTimers();
    resetRenderCaches();
    game.newGame(now());
    state.dealSequence = buildDealSequence();
    renderBoard();
  }

  function setDrawModeFromStorage() {
    const rawMode = localStorage.getItem(STORAGE_LAYOUT);
    if (rawMode === "0" || rawMode === "1") {
      game.drawModeIndex = Number(rawMode);
    }
  }

  function maybeAnimateDeal({ showLoading = false, lockInput = true } = {}) {
    clearDealAnimationTimers();
    if (!state.dealSequence) {
      state.dealSequence = buildDealSequence();
    }
    const totalCards = state.dealSequence.size;
    const maxProgress = Math.max(1, totalCards);
    const hasLoadingPanel = Boolean(ui.loadingPanel);
    let progressed = 0;

    if (showLoading && hasLoadingPanel) {
      ui.loadingPanel.hidden = false;
      setLoadingProgress(5, t("ui.loading.shuffling"));
    } else {
      setLoadingProgress(0, t("ui.loading.dealing"));
    }

    // The initial deal is prepared while Main is visible. It may still be
    // animating when a player enters Battle, but it must not make the first
    // legal tap disappear or get ignored.
    state.boardAnimationInProgress = lockInput;
    state.dealProgressTimer = window.setInterval(() => {
      progressed += 1;
      if (showLoading && hasLoadingPanel) {
        const progress = clamp((progressed / maxProgress) * 60, 0, 60);
        setLoadingProgress(5 + progress, t("ui.loading.preparing_cards"));
      }
      if (progressed === 1 || progressed === maxProgress || progressed % DEAL_SOUND_INTERVAL === 0) {
        audio.draw();
      }
      if (progressed >= maxProgress) {
        clearInterval(state.dealProgressTimer);
        state.dealProgressTimer = null;
        if (showLoading && hasLoadingPanel) {
          setLoadingProgress(65, t("ui.loading.dealing"));
        }
      }
    }, DEAL_STEP_MS);

    if (showLoading && hasLoadingPanel) {
      state.dealEndTimer = window.setTimeout(() => {
        setLoadingProgress(100, t("ui.loading.ready"));
        ui.loadingPanel.hidden = true;
        state.boardAnimationInProgress = false;
        state.dealSequence = null;
        state.dealEndTimer = null;
        if (state.dealProgressTimer) {
          clearInterval(state.dealProgressTimer);
          state.dealProgressTimer = null;
        }
      }, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS);
      return;
    }

    state.dealEndTimer = window.setTimeout(() => {
      state.boardAnimationInProgress = false;
      state.dealSequence = null;
      state.dealEndTimer = null;
      if (state.dealProgressTimer) {
        clearInterval(state.dealProgressTimer);
        state.dealProgressTimer = null;
      }
    }, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS);
  }

  function openBattle() {
    if (state.active) return;
    state.active = true;
    state.deadlockHintShown = false;
    ui.mainScreen.hidden = true;
    ui.battleScreen.hidden = false;
    document.body.dataset.screen = "battle";
    if (game.completed) {
      createNewGame();
    }
    forceCloseResultOverlay();
    clearVictoryClasses();
    restartClock();
    renderBoard();
    syncDrawLabel();
    renderHeader();
    window.dispatchEvent(new CustomEvent("weightplay:battle-open"));
    window.dispatchEvent(new CustomEvent("weightplay:battle-sync"));
  }

  function closeBattle() {
    markLossIfAbandoned();
    state.active = false;
    state.deadlockHintShown = false;
    if (state.dragging) {
      cleanupDrag();
    }
    ui.mainScreen.hidden = false;
    ui.battleScreen.hidden = true;
    document.body.dataset.screen = "main";
    pauseClock();
    forceCloseResultOverlay();
    clearVictoryClasses();
    clearHints();
    window.dispatchEvent(new CustomEvent("weightplay:battle-open"));
    window.dispatchEvent(new CustomEvent("weightplay:battle-sync"));
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
  }

  function bindEvents() {
    ui.enterBtn?.addEventListener("click", () => {
      openBattle();
    });
    ui.startBtn?.addEventListener("click", () => {
      openBattle();
    });
    ui.newGameBtn?.addEventListener("click", () => {
      createNewGame();
      openBattle();
    });
    ui.restartBtn?.addEventListener("click", () => {
      performResultRestart();
      openBattle();
    });
    ui.battleBackBtn?.addEventListener("click", closeBattle);
    ui.soundToggle?.addEventListener("click", toggleSound);
    ui.soundToggleBattle?.addEventListener("click", toggleSound);
    ui.stockPile?.addEventListener("click", onDraw);
    ui.drawModeBtn?.addEventListener("click", switchDrawMode);
    ui.undoBtn?.addEventListener("click", onUndo);
    ui.hintBtn?.addEventListener("click", onHint);
    ui.autoFinishBtn?.addEventListener("click", () => {
      onAutoFinish();
    });
    ui.foundationRow?.addEventListener("pointerdown", onDestinationPointerDown, true);
    ui.tableauRow?.addEventListener("pointerdown", onDestinationPointerDown, true);
    ui.foundationRow?.addEventListener("click", onDestinationClick);
    ui.tableauRow?.addEventListener("click", onDestinationClick);
    ui.resultNewGame?.addEventListener("click", performResultNewGame);
    ui.resultRestart?.addEventListener("click", performResultRestart);
    ui.resultClose?.addEventListener("click", closeBattle);
    ui.hintOverlay?.addEventListener("click", () => {
      ui.hintOverlay.hidden = true;
      clearHints();
    });
  }

  function bindAudioUnlock() {
    const unlock = () => {
      audio.ensureContext();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true });
  }

  function isQaFixtureEnabled(name) {
    const host = String(window.location.hostname || "");
    const params = new URLSearchParams(window.location.search);
    return ["localhost", "127.0.0.1", "::1"].includes(host)
      && params.get("trial") === "1"
      && params.get("qa") === name;
  }

  function isQaWinFixtureEnabled() {
    return isQaFixtureEnabled("win");
  }

  function isQaAutoFinishFixtureEnabled() {
    return isQaFixtureEnabled("autofinish");
  }

  function isQaMoveFixtureEnabled() {
    return isQaFixtureEnabled("move");
  }

  function isQaTableauFixtureEnabled() {
    return isQaFixtureEnabled("tableau");
  }

  function isQaWasteTableauFixtureEnabled() {
    return isQaFixtureEnabled("waste-tableau");
  }

  function isQaDrawFixtureEnabled() {
    return isQaFixtureEnabled("draw");
  }

  function isQaDenseTableauFixtureEnabled() {
    return isQaFixtureEnabled("dense-tableau");
  }

  function applyQaWinFixture() {
    if (!isQaWinFixtureEnabled() || game.completed) return;
    if (!state.active) openBattle();
    if (!state.active) return;
    clearDealAnimationTimers();
    const cards = [
      ...game.tableau.columns.flat(),
      ...game.stock.cards,
      ...game.waste.cards,
      ...game.foundations.flatMap((foundation) => foundation.cards),
    ];
    game.tableau.columns.forEach((column) => {
      column.length = 0;
    });
    game.stock.clear();
    game.waste.clear();
    game.foundations.forEach((foundation) => foundation.clear());
    game.foundations.forEach((foundation) => {
      cards
        .filter((card) => card.suit === foundation.suit)
        .sort((left, right) => Number(left.rank) - Number(right.rank))
        .forEach((card) => {
          card.faceUp = true;
          foundation.cards.push(card);
        });
    });
    game.moveCount = 52;
    game.moveHistory = [];
    state.dealSequence = null;
    state.elapsed = 7;
    state.boardAnimationInProgress = false;
    renderBoard();
    game.completed = true;
    postMoveChecks();
  }

  function applyQaMoveFixture() {
    if (!isQaMoveFixtureEnabled() || game.completed) return;
    if (!state.active) openBattle();
    if (!state.active) return;
    clearDealAnimationTimers();
    const cards = [
      ...game.tableau.columns.flat(),
      ...game.stock.cards,
      ...game.waste.cards,
      ...game.foundations.flatMap((foundation) => foundation.cards),
    ];
    const targetFoundation = game.foundations[0];
    const ace = cards.find((card) => card.suit === targetFoundation.suit && Number(card.rank) === 1);
    const moveCard = cards.find((card) => card.suit === targetFoundation.suit && Number(card.rank) === 2);
    if (!ace || !moveCard) return;
    game.tableau.columns.forEach((column) => {
      column.length = 0;
    });
    game.stock.clear();
    game.waste.clear();
    game.foundations.forEach((foundation) => foundation.clear());
    ace.faceUp = true;
    targetFoundation.cards.push(ace);
    cards
      .filter((card) => card !== ace && card !== moveCard)
      .forEach((card, index) => {
        card.faceUp = false;
        game.tableau.columns[index % game.tableau.columns.length].push(card);
      });
    moveCard.faceUp = true;
    game.tableau.columns[6].push(moveCard);
    game.moveCount = 0;
    game.moveHistory = [];
    game.completed = false;
    state.dealSequence = null;
    state.elapsed = 0;
    state.boardAnimationInProgress = false;
    state.autoFinishing = false;
    state.resultShown = false;
    state.lossRecordedForCurrentBoard = false;
    renderBoard();
  }

  function applyQaTableauFixture() {
    if (!isQaTableauFixtureEnabled() || game.completed) return;
    if (!state.active) openBattle();
    if (!state.active) return;
    clearDealAnimationTimers();
    const cards = [
      ...game.tableau.columns.flat(),
      ...game.stock.cards,
      ...game.waste.cards,
      ...game.foundations.flatMap((foundation) => foundation.cards),
    ];
    const sourceCard = cards.find((card) => Number(card.rank) === 7 && !card.isRed);
    const targetCard = cards.find((card) => Number(card.rank) === 8 && card.isRed && card !== sourceCard);
    if (!sourceCard || !targetCard) return;
    game.tableau.columns.forEach((column) => {
      column.length = 0;
    });
    game.stock.clear();
    game.waste.clear();
    game.foundations.forEach((foundation) => foundation.clear());
    sourceCard.faceUp = true;
    targetCard.faceUp = true;
    game.tableau.columns[0].push(sourceCard);
    game.tableau.columns[6].push(targetCard);
    cards
      .filter((card) => card !== sourceCard && card !== targetCard)
      .forEach((card) => {
        card.faceUp = false;
        game.stock.cards.push(card);
      });
    game.moveCount = 0;
    game.moveHistory = [];
    game.completed = false;
    state.dealSequence = null;
    state.elapsed = 0;
    state.boardAnimationInProgress = false;
    state.autoFinishing = false;
    state.resultShown = false;
    state.lossRecordedForCurrentBoard = false;
    renderBoard();
  }

  function applyQaWasteTableauFixture() {
    if (!isQaWasteTableauFixtureEnabled() || game.completed) return;
    if (!state.active) openBattle();
    if (!state.active) return;
    clearDealAnimationTimers();
    const cards = [
      ...game.tableau.columns.flat(),
      ...game.stock.cards,
      ...game.waste.cards,
      ...game.foundations.flatMap((foundation) => foundation.cards),
    ];
    const sourceCard = cards.find((card) => card.suit === "hearts" && Number(card.rank) === 11);
    const targetCard = cards.find((card) => card.suit === "spades" && Number(card.rank) === 12);
    if (!sourceCard || !targetCard) return;
    game.tableau.columns.forEach((column) => {
      column.length = 0;
    });
    game.stock.clear();
    game.waste.clear();
    game.foundations.forEach((foundation) => foundation.clear());
    targetCard.faceUp = true;
    sourceCard.faceUp = true;
    game.tableau.columns[0].push(targetCard);
    game.waste.cards.push(sourceCard);
    cards
      .filter((card) => card !== sourceCard && card !== targetCard)
      .forEach((card) => {
        card.faceUp = false;
        game.stock.cards.push(card);
      });
    game.drawModeIndex = 0;
    game.moveCount = 0;
    game.moveHistory = [];
    game.completed = false;
    state.dealSequence = null;
    state.elapsed = 0;
    state.boardAnimationInProgress = false;
    state.autoFinishing = false;
    state.resultShown = false;
    state.lossRecordedForCurrentBoard = false;
    renderBoard();
  }

  function applyQaDrawFixture() {
    if (!isQaDrawFixtureEnabled() || game.completed) return;
    if (!state.active) openBattle();
    if (!state.active) return;
    clearDealAnimationTimers();
    const cards = [
      ...game.tableau.columns.flat(),
      ...game.stock.cards,
      ...game.waste.cards,
      ...game.foundations.flatMap((foundation) => foundation.cards),
    ];
    const firstCard = cards.find((card) => card.suit === "spades" && Number(card.rank) === 1);
    const secondCard = cards.find((card) => card.suit === "hearts" && Number(card.rank) === 2);
    const thirdCard = cards.find((card) => card.suit === "clubs" && Number(card.rank) === 3);
    const drawCards = [firstCard, secondCard, thirdCard].filter(Boolean);
    if (drawCards.length !== 3) return;
    game.tableau.columns.forEach((column) => {
      column.length = 0;
    });
    game.stock.clear();
    game.waste.clear();
    game.foundations.forEach((foundation) => foundation.clear());
    cards
      .filter((card) => !drawCards.includes(card))
      .forEach((card, index) => {
        card.faceUp = false;
        game.tableau.columns[index % game.tableau.columns.length].push(card);
      });
    [thirdCard, secondCard, firstCard].forEach((card) => {
      card.faceUp = false;
      game.stock.cards.push(card);
    });
    game.moveCount = 0;
    game.moveHistory = [];
    game.completed = false;
    state.dealSequence = null;
    state.elapsed = 0;
    state.boardAnimationInProgress = false;
    state.autoFinishing = false;
    state.resultShown = false;
    state.lossRecordedForCurrentBoard = false;
    renderBoard();
  }

  function applyQaDenseTableauFixture() {
    if (!isQaDenseTableauFixtureEnabled() || game.completed) return;
    if (!state.active) openBattle();
    if (!state.active) return;
    clearDealAnimationTimers();
    const cards = [
      ...game.tableau.columns.flat(),
      ...game.stock.cards,
      ...game.waste.cards,
      ...game.foundations.flatMap((foundation) => foundation.cards),
    ];
    game.tableau.columns.forEach((column) => {
      column.length = 0;
    });
    game.stock.clear();
    game.waste.clear();
    game.foundations.forEach((foundation) => foundation.clear());
    cards.slice(0, 13).forEach((card, index) => {
      card.faceUp = index >= 4;
      game.tableau.columns[0].push(card);
    });
    cards.slice(13).forEach((card) => {
      card.faceUp = false;
      game.stock.cards.push(card);
    });
    game.moveCount = 0;
    game.moveHistory = [];
    game.completed = false;
    state.dealSequence = null;
    state.elapsed = 0;
    state.boardAnimationInProgress = false;
    state.autoFinishing = false;
    state.resultShown = false;
    state.lossRecordedForCurrentBoard = false;
    renderBoard();
  }

  function applyQaAutoFinishFixture() {
    if (!isQaAutoFinishFixtureEnabled() || game.completed) return;
    if (!state.active) openBattle();
    if (!state.active) return;
    clearDealAnimationTimers();
    const cards = [
      ...game.tableau.columns.flat(),
      ...game.stock.cards,
      ...game.waste.cards,
      ...game.foundations.flatMap((foundation) => foundation.cards),
    ];
    game.tableau.columns.forEach((column) => {
      column.length = 0;
    });
    game.stock.clear();
    game.waste.clear();
    game.foundations.forEach((foundation) => foundation.clear());
    const finalFoundation = game.foundations[3];
    cards
      .filter((card) => card.suit === finalFoundation.suit && Number(card.rank) <= 12)
      .sort((left, right) => Number(left.rank) - Number(right.rank))
      .forEach((card) => {
        card.faceUp = true;
        finalFoundation.cards.push(card);
      });
    const aceCards = game.foundations.slice(0, 3).map((foundation) => cards.find((card) => card.suit === foundation.suit && Number(card.rank) === 1)).filter(Boolean);
    const kingCards = cards.filter((card) => Number(card.rank) === 13);
    const finalKing = kingCards.find((card) => card.suit === finalFoundation.suit);
    const tableauCards = [...aceCards, ...kingCards.filter((card) => card !== finalKing), finalKing].filter(Boolean);
    tableauCards.forEach((card, index) => {
      card.faceUp = true;
      game.tableau.columns[index].push(card);
    });
    cards
      .filter((card) => !tableauCards.includes(card) && !finalFoundation.cards.includes(card))
      .forEach((card) => {
        card.faceUp = false;
        game.stock.cards.push(card);
      });
    game.moveCount = 0;
    game.moveHistory = [];
    game.completed = false;
    state.dealSequence = null;
    state.elapsed = 0;
    state.boardAnimationInProgress = false;
    state.autoFinishing = false;
    state.resultShown = false;
    state.lossRecordedForCurrentBoard = false;
    renderBoard();
  }

  function bootstrap() {
    statsStorage.load();
    setSoundButtons(audio.enabled);
    setDrawModeFromStorage();
    window.addEventListener("wonder:locale-change", () => {
      refreshLocalization();
    });
    window.addEventListener("weightplay:locale-change", () => {
      refreshLocalization();
    });
    bindEvents();
    bindAudioUnlock();
    refreshLocalization();
    setLoadingProgress(15, t("ui.loading.preparing"));
    game.newGame(Math.floor(now()));
    state.lastFrameCards = new Map();
    cardRevealCache.clear();
    state.dealSequence = buildDealSequence();
    renderStatistics();
    syncDrawLabel();
    pauseClock();
    state.elapsed = 0;
    renderBoard();
    // Main is available immediately; the seeded deal is prepared behind the
    // scenes instead of blocking the first screen with a full deal timer.
    if (ui.loadingPanel) ui.loadingPanel.hidden = true;
    maybeAnimateDeal({ showLoading: false, lockInput: false });
    if (isQaWinFixtureEnabled()) {
      const totalCards = state.dealSequence?.size || 28;
      window.setTimeout(applyQaWinFixture, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS + 80);
    }
    if (isQaAutoFinishFixtureEnabled()) {
      const totalCards = state.dealSequence?.size || 28;
      window.setTimeout(applyQaAutoFinishFixture, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS + 80);
    }
    if (isQaMoveFixtureEnabled()) {
      const totalCards = state.dealSequence?.size || 28;
      window.setTimeout(applyQaMoveFixture, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS + 80);
    }
    if (isQaTableauFixtureEnabled()) {
      const totalCards = state.dealSequence?.size || 28;
      window.setTimeout(applyQaTableauFixture, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS + 80);
    }
    if (isQaWasteTableauFixtureEnabled()) {
      const totalCards = state.dealSequence?.size || 28;
      window.setTimeout(applyQaWasteTableauFixture, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS + 80);
    }
    if (isQaDrawFixtureEnabled()) {
      const totalCards = state.dealSequence?.size || 28;
      window.setTimeout(applyQaDrawFixture, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS + 80);
    }
    if (isQaDenseTableauFixtureEnabled()) {
      const totalCards = state.dealSequence?.size || 28;
      window.setTimeout(applyQaDenseTableauFixture, DEAL_INITIAL_DELAY_MS + totalCards * DEAL_STEP_MS + 80);
    }
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
    }, 80);
    renderHeader();
  }

  bootstrap();
})();


