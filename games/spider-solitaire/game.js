(function () {
  "use strict";

  const {
    SUITS,
    SUIT_SYMBOLS,
    Deck,
    Tableau,
    Stock,
    RuleEngine,
    UndoStack,
    SoundEngine,
  } = window.WPCardEngine;

  const DIFFICULTIES = Object.freeze({
    1: { label: "1 Suit", suits: ["spades"], copies: 8, key: "one_suit" },
    2: { label: "2 Suits", suits: ["spades", "hearts"], copies: 4, key: "two_suits" },
    4: { label: "4 Suits", suits: [...SUITS], copies: 2, key: "four_suits" },
  });
  const LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const STORAGE = Object.freeze({
    difficulty: "spider_solitaire_difficulty_v1",
    stats: "spider_solitaire_stats_v1",
    sound: "card_games_sound_v1",
    tutorial: "spider_solitaire_tutorial_seen_v1",
  });
  const HINT_MS = 2500;
  const CARD_DEAL_MAX_DELAY = 22;
  const DEAL_STEP_MS = 42;

  const I18N = {
    en: {
      title: "Spider Solitaire", loading: "Preparing your table", back: "Back", settings: "Settings", sound: "Sound Effects", language: "Language", kicker: "Classic Card Game",
      hero: "Build same-suit K to A runs across ten columns. Choose a suit count, then clear all eight sets.", start: "Start Game", restart: "Restart Current Game", new_game: "New Game", target_label: "Target", target: "Complete eight same-suit K → A sequences.", controls_label: "Controls", controls: "Drag a card or same-suit run. Tap when one destination is clear.", mobile_label: "Mobile First", mobile: "Ten columns stay visible while long stacks compress their overlap.", one_suit: "1 Suit", two_suits: "2 Suits", four_suits: "4 Suits", easy: "Easy", medium: "Medium", hard: "Hard",
      moves: "Moves", time: "Time", score: "Score", completed: "Completed Sets", foundations: "Completed sets", stock: "Stock pile", tableau: "Tableau", deal: "Deal 10", deals_left: "{count} deals left", undo: "Undo", hint: "Hint", help: "How to Play", fill_empty: "Fill all empty spaces before dealing.", no_moves: "No moves available. Deal from Stock if every column is filled.", multiple: "Multiple destinations available. Drag to choose.", invalid: "That move is not legal.", move_hint: "Move the highlighted run to the highlighted column.", deal_hint: "Deal one card to every filled column.", sequence_complete: "Complete sequence!", card_face_down: "Face-down card", card_face: "{rank} of {suit}", learn_kicker: "Quick Start", learn_title: "Spider in five moves", tip_1: "Build cards downward from K to A.", tip_2: "Only same-suit runs move together.", tip_3: "Finish a same-suit K → A run to clear it.", tip_4: "Deal one card to every column from Stock.", tip_5: "Fill every empty column before dealing.", skip: "Skip", got_it: "Got it", confirm_title: "Start a new game?", confirm_copy: "Your current run will stay available through Undo only until you leave it.", cancel: "Cancel", confirm: "New Game", victory: "Spider Complete!", return: "Return", result_summary: "{sets} sets cleared · {moves} moves · {time} · Score {score}", stats_games: "Games Played: {count}", stats_wins: "Games Won: {count}", stats_rate: "Win Rate: {rate}%", stats_best_time: "Best Time: {time}", stats_fewest: "Fewest Moves: {moves}", sound_on: "Sound Effects On", sound_off: "Sound Effects Off", aria_sound_on: "Turn sound effects off", aria_sound_off: "Turn sound effects on", meta_title: "Spider Solitaire Online - Play Free", meta_description: "Play classic Spider Solitaire with 1 Suit, 2 Suits, or 4 Suits on mobile and desktop.", meta_keywords: "Spider Solitaire,Spider,Card Game,Solitaire,1 Suit,2 Suits,4 Suits",
    },
    "zh-Hant": { title: "蜘蛛接龍", loading: "正在準備牌桌", back: "返回", settings: "設定", sound: "音效", language: "語言", kicker: "經典紙牌遊戲", hero: "在十欄中建立同花色 K 到 A 的牌組。選擇花色難度，收走全部八組。", start: "開始遊戲", restart: "重新開始本局", new_game: "新遊戲", target_label: "目標", target: "完成八組同花色 K → A。", controls_label: "操作", controls: "拖曳單牌或同花色牌組；只有一個目的地時可直接點擊。", mobile_label: "手機優先", mobile: "十欄固定可見，長牌堆會自動壓縮重疊。", one_suit: "1 花色", two_suits: "2 花色", four_suits: "4 花色", easy: "簡單", medium: "中等", hard: "困難", moves: "步數", time: "時間", score: "分數", completed: "完成牌組", foundations: "已完成牌組", stock: "牌庫", tableau: "牌桌", deal: "發 10 張", deals_left: "剩餘 {count} 次發牌", undo: "回退", hint: "提示", help: "玩法說明", fill_empty: "請先填滿所有空欄，再發牌。", no_moves: "目前沒有可行動作；所有欄有牌後可從牌庫發牌。", multiple: "有多個目的地，請拖曳選擇。", invalid: "這個移動不合法。", move_hint: "把高亮牌組移到高亮欄位。", deal_hint: "向每個非空欄各發一張牌。", sequence_complete: "完成一組！", card_face_down: "背面朝上的牌", card_face: "{suit}{rank}", learn_kicker: "快速開始", learn_title: "五步學會蜘蛛接龍", tip_1: "從 K 到 A 依序遞減排列。", tip_2: "只有同花色連續牌可以整組移動。", tip_3: "完成同花色 K → A 就會收走。", tip_4: "點擊牌庫向每欄發一張。", tip_5: "有空欄時必須先填滿才能發牌。", skip: "跳過", got_it: "知道了", confirm_title: "開始新遊戲？", confirm_copy: "離開目前牌局後，只能用回退找回剛才的動作。", cancel: "取消", confirm: "新遊戲", victory: "蜘蛛接龍完成！", return: "返回", result_summary: "完成 {sets} 組 · {moves} 步 · {time} · 分數 {score}", stats_games: "遊戲場次：{count}", stats_wins: "勝利場次：{count}", stats_rate: "勝率：{rate}%", stats_best_time: "最佳時間：{time}", stats_fewest: "最少步數：{moves}", sound_on: "音效開啟", sound_off: "音效關閉", aria_sound_on: "關閉音效", aria_sound_off: "開啟音效", meta_title: "蜘蛛接龍 - 免費線上遊戲", meta_description: "在手機或桌機免費遊玩 1、2、4 花色蜘蛛接龍。", meta_keywords: "蜘蛛接龍,紙牌遊戲,接龍,1花色,2花色,4花色" },
    "zh-Hans": { title: "蜘蛛接龙", loading: "正在准备牌桌", back: "返回", settings: "设置", sound: "音效", language: "语言", kicker: "经典纸牌游戏", hero: "在十列中建立同花色 K 到 A 的牌组。选择花色难度，收走全部八组。", start: "开始游戏", restart: "重新开始本局", new_game: "新游戏", target_label: "目标", target: "完成八组同花色 K → A。", controls_label: "操作", controls: "拖拽单牌或同花色牌组；只有一个目标时可直接点击。", mobile_label: "手机优先", mobile: "十列保持可见，长牌堆会自动压缩重叠。", one_suit: "1 花色", two_suits: "2 花色", four_suits: "4 花色", easy: "简单", medium: "中等", hard: "困难", moves: "步数", time: "时间", score: "分数", completed: "完成牌组", foundations: "已完成牌组", stock: "牌库", tableau: "牌桌", deal: "发 10 张", deals_left: "剩余 {count} 次发牌", undo: "撤销", hint: "提示", help: "玩法说明", fill_empty: "请先填满所有空列，再发牌。", no_moves: "当前没有可行动作；所有列有牌后可从牌库发牌。", multiple: "有多个目标，请拖拽选择。", invalid: "这个移动不合法。", move_hint: "将高亮牌组移动到高亮列。", deal_hint: "向每个非空列各发一张牌。", sequence_complete: "完成一组！", card_face_down: "背面朝上的牌", card_face: "{suit}{rank}", learn_kicker: "快速开始", learn_title: "五步学会蜘蛛接龙", tip_1: "从 K 到 A 按递减顺序排列。", tip_2: "只有同花色连续牌可以整组移动。", tip_3: "完成同花色 K → A 就会收走。", tip_4: "点击牌库向每列发一张。", tip_5: "有空列时必须先填满才能发牌。", skip: "跳过", got_it: "知道了", confirm_title: "开始新游戏？", confirm_copy: "离开当前牌局后，只能用撤销找回刚才的动作。", cancel: "取消", confirm: "新游戏", victory: "蜘蛛接龙完成！", return: "返回", result_summary: "完成 {sets} 组 · {moves} 步 · {time} · 分数 {score}", stats_games: "游戏场次：{count}", stats_wins: "胜利场次：{count}", stats_rate: "胜率：{rate}%", stats_best_time: "最佳时间：{time}", stats_fewest: "最少步数：{moves}", sound_on: "音效开启", sound_off: "音效关闭", aria_sound_on: "关闭音效", aria_sound_off: "开启音效", meta_title: "蜘蛛接龙 - 免费在线游戏", meta_description: "在手机或桌面免费游玩 1、2、4 花色蜘蛛接龙。", meta_keywords: "蜘蛛接龙,纸牌游戏,接龙,1花色,2花色,4花色" },
    ja: { title: "スパイダーソリティア", loading: "テーブルを準備中", back: "戻る", settings: "設定", sound: "効果音", language: "言語", kicker: "クラシックカードゲーム", hero: "10列で同じスートのKからAを作ります。スート数を選び、8組を完成させましょう。", start: "ゲーム開始", restart: "このゲームをリスタート", new_game: "新しいゲーム", target_label: "目標", target: "同じスートのK → Aを8組完成させる。", controls_label: "操作", controls: "カードまたは同じスートの列をドラッグ。移動先が1つならタップできます。", mobile_label: "モバイル優先", mobile: "10列を見渡せ、長い列は重なりを自動調整します。", one_suit: "1スート", two_suits: "2スート", four_suits: "4スート", easy: "かんたん", medium: "ふつう", hard: "むずかしい", moves: "手数", time: "時間", score: "スコア", completed: "完成セット", foundations: "完成セット", stock: "山札", tableau: "場札", deal: "10枚配る", deals_left: "残り{count}回", undo: "元に戻す", hint: "ヒント", help: "遊び方", fill_empty: "空いた列をすべて埋めてから配ってください。", no_moves: "移動できません。全列にカードがあれば山札から配れます。", multiple: "移動先が複数あります。ドラッグで選んでください。", invalid: "その移動はできません。", move_hint: "光っている列へカードを移動してください。", deal_hint: "各列に1枚ずつ配ります。", sequence_complete: "1組完成！", card_face_down: "裏向きのカード", card_face: "{suit}{rank}", learn_kicker: "クイックスタート", learn_title: "5ステップでスパイダー", tip_1: "KからAへ降順に並べます。", tip_2: "同じスートの連続カードだけ一緒に動かせます。", tip_3: "同じスートのK → Aで自動回収されます。", tip_4: "山札をタップすると各列に1枚配ります。", tip_5: "空き列があると配れません。", skip: "スキップ", got_it: "わかりました", confirm_title: "新しいゲームを始めますか？", confirm_copy: "現在のゲームを離れると、直前の操作は元に戻すでのみ復元できます。", cancel: "キャンセル", confirm: "新しいゲーム", victory: "スパイダー完成！", return: "戻る", result_summary: "{sets}組完成 · {moves}手 · {time} · スコア {score}", stats_games: "プレイ数: {count}", stats_wins: "勝利数: {count}", stats_rate: "勝率: {rate}%", stats_best_time: "最短時間: {time}", stats_fewest: "最少手数: {moves}", sound_on: "効果音オン", sound_off: "効果音オフ", aria_sound_on: "効果音をオフ", aria_sound_off: "効果音をオン", meta_title: "スパイダーソリティア - 無料オンライン", meta_description: "1・2・4スートで遊べる無料スパイダーソリティア。", meta_keywords: "スパイダーソリティア,カードゲーム" },
    ko: { title: "스파이더 솔리테어", loading: "테이블을 준비하는 중", back: "돌아가기", settings: "설정", sound: "효과음", language: "언어", kicker: "클래식 카드 게임", hero: "10개 열에서 같은 무늬의 K부터 A까지를 만드세요. 무늬 수를 선택하고 8세트를 완성합니다.", start: "게임 시작", restart: "현재 게임 다시 시작", new_game: "새 게임", target_label: "목표", target: "같은 무늬 K → A 8세트 완성", controls_label: "조작", controls: "카드 또는 같은 무늬 연속 묶음을 드래그하세요. 목적지가 하나면 탭할 수 있습니다.", mobile_label: "모바일 우선", mobile: "10개 열을 한눈에 보고 긴 열은 겹침 간격을 자동 조절합니다.", one_suit: "1 무늬", two_suits: "2 무늬", four_suits: "4 무늬", easy: "쉬움", medium: "보통", hard: "어려움", moves: "이동", time: "시간", score: "점수", completed: "완료 세트", foundations: "완료 세트", stock: "덱", tableau: "테이블", deal: "10장 배분", deals_left: "남은 {count}회", undo: "실행 취소", hint: "힌트", help: "게임 방법", fill_empty: "빈 열을 모두 채운 뒤 배분하세요.", no_moves: "가능한 이동이 없습니다. 모든 열에 카드가 있으면 덱에서 배분할 수 있습니다.", multiple: "목적지가 여러 개입니다. 드래그해서 선택하세요.", invalid: "허용되지 않는 이동입니다.", move_hint: "강조된 묶음을 강조된 열로 옮기세요.", deal_hint: "각 열에 한 장씩 배분합니다.", sequence_complete: "한 세트 완성!", card_face_down: "뒷면 카드", card_face: "{suit} {rank}", learn_kicker: "빠른 시작", learn_title: "5단계로 배우는 스파이더", tip_1: "K부터 A까지 내림차순으로 놓습니다.", tip_2: "같은 무늬의 연속 카드만 함께 이동합니다.", tip_3: "같은 무늬 K → A를 완성하면 수거됩니다.", tip_4: "덱을 누르면 각 열에 한 장씩 배분합니다.", tip_5: "빈 열이 있으면 배분할 수 없습니다.", skip: "건너뛰기", got_it: "알겠습니다", confirm_title: "새 게임을 시작할까요?", confirm_copy: "현재 게임을 떠나면 직전 이동은 실행 취소로만 복원할 수 있습니다.", cancel: "취소", confirm: "새 게임", victory: "스파이더 완료!", return: "돌아가기", result_summary: "{sets}세트 완료 · {moves}회 · {time} · 점수 {score}", stats_games: "플레이: {count}", stats_wins: "승리: {count}", stats_rate: "승률: {rate}%", stats_best_time: "최고 시간: {time}", stats_fewest: "최소 이동: {moves}", sound_on: "효과음 켜짐", sound_off: "효과음 꺼짐", aria_sound_on: "효과음 끄기", aria_sound_off: "효과음 켜기", meta_title: "스파이더 솔리테어 - 무료 온라인", meta_description: "1·2·4 무늬로 즐기는 무료 스파이더 솔리테어.", meta_keywords: "스파이더 솔리테어,카드 게임" },
    es: { title: "Solitario Spider", loading: "Preparando la mesa", back: "Volver", settings: "Ajustes", sound: "Efectos de sonido", language: "Idioma", kicker: "Juego de cartas clásico", hero: "Forma secuencias K a A del mismo palo en diez columnas. Elige la dificultad y completa los ocho grupos.", start: "Empezar", restart: "Reiniciar partida", new_game: "Nueva partida", target_label: "Objetivo", target: "Completa ocho secuencias K → A del mismo palo.", controls_label: "Controles", controls: "Arrastra una carta o una secuencia del mismo palo. Toca si solo hay un destino.", mobile_label: "Primero móvil", mobile: "Las diez columnas siguen visibles y las pilas largas reducen su solapamiento.", one_suit: "1 palo", two_suits: "2 palos", four_suits: "4 palos", easy: "Fácil", medium: "Medio", hard: "Difícil", moves: "Movimientos", time: "Tiempo", score: "Puntuación", completed: "Grupos completos", foundations: "Grupos completos", stock: "Mazo", tableau: "Tablero", deal: "Repartir 10", deals_left: "Quedan {count} repartos", undo: "Deshacer", hint: "Pista", help: "Cómo jugar", fill_empty: "Completa todas las columnas vacías antes de repartir.", no_moves: "No hay movimientos. Reparte si todas las columnas tienen cartas.", multiple: "Hay varios destinos. Arrastra para elegir.", invalid: "Ese movimiento no es válido.", move_hint: "Mueve la secuencia resaltada a la columna resaltada.", deal_hint: "Reparte una carta en cada columna.", sequence_complete: "¡Grupo completo!", card_face_down: "Carta boca abajo", card_face: "{rank} de {suit}", learn_kicker: "Inicio rápido", learn_title: "Spider en cinco pasos", tip_1: "Ordena de K a A hacia abajo.", tip_2: "Solo las secuencias del mismo palo se mueven juntas.", tip_3: "Completa K → A del mismo palo para retirarla.", tip_4: "Pulsa el mazo para repartir una carta a cada columna.", tip_5: "No puedes repartir si hay una columna vacía.", skip: "Saltar", got_it: "Entendido", confirm_title: "¿Empezar una nueva partida?", confirm_copy: "Al salir de esta partida, solo podrás volver atrás con Deshacer.", cancel: "Cancelar", confirm: "Nueva partida", victory: "¡Spider completado!", return: "Volver", result_summary: "{sets} grupos · {moves} movimientos · {time} · Puntuación {score}", stats_games: "Partidas: {count}", stats_wins: "Victorias: {count}", stats_rate: "Tasa de victoria: {rate}%", stats_best_time: "Mejor tiempo: {time}", stats_fewest: "Menos movimientos: {moves}", sound_on: "Sonido activado", sound_off: "Sonido desactivado", aria_sound_on: "Desactivar sonido", aria_sound_off: "Activar sonido", meta_title: "Solitario Spider online gratis", meta_description: "Juega al Solitario Spider de 1, 2 o 4 palos en móvil y ordenador.", meta_keywords: "Solitario Spider,cartas,solitario" },
    "pt-BR": { title: "Spider Solitaire", loading: "Preparando a mesa", back: "Voltar", settings: "Configurações", sound: "Efeitos sonoros", language: "Idioma", kicker: "Jogo de cartas clássico", hero: "Monte sequências K a A do mesmo naipe em dez colunas. Escolha a dificuldade e complete os oito grupos.", start: "Começar", restart: "Reiniciar partida", new_game: "Novo jogo", target_label: "Objetivo", target: "Complete oito sequências K → A do mesmo naipe.", controls_label: "Controles", controls: "Arraste uma carta ou sequência do mesmo naipe. Toque quando houver um único destino.", mobile_label: "Mobile First", mobile: "As dez colunas permanecem visíveis e pilhas longas reduzem a sobreposição.", one_suit: "1 naipe", two_suits: "2 naipes", four_suits: "4 naipes", easy: "Fácil", medium: "Médio", hard: "Difícil", moves: "Movimentos", time: "Tempo", score: "Pontuação", completed: "Grupos completos", foundations: "Grupos completos", stock: "Monte", tableau: "Mesa", deal: "Distribuir 10", deals_left: "{count} distribuições restantes", undo: "Desfazer", hint: "Dica", help: "Como jogar", fill_empty: "Preencha todas as colunas vazias antes de distribuir.", no_moves: "Não há movimentos. Distribua se todas as colunas tiverem cartas.", multiple: "Há vários destinos. Arraste para escolher.", invalid: "Esse movimento não é válido.", move_hint: "Mova a sequência destacada para a coluna destacada.", deal_hint: "Distribua uma carta em cada coluna.", sequence_complete: "Grupo completo!", card_face_down: "Carta virada para baixo", card_face: "{rank} de {suit}", learn_kicker: "Início rápido", learn_title: "Spider em cinco passos", tip_1: "Organize de K a A em ordem decrescente.", tip_2: "Somente sequências do mesmo naipe movem juntas.", tip_3: "Complete K → A do mesmo naipe para remover.", tip_4: "Toque no monte para distribuir uma carta em cada coluna.", tip_5: "Não distribua enquanto houver uma coluna vazia.", skip: "Pular", got_it: "Entendi", confirm_title: "Começar um novo jogo?", confirm_copy: "Ao sair desta partida, você só poderá voltar usando Desfazer.", cancel: "Cancelar", confirm: "Novo jogo", victory: "Spider concluído!", return: "Voltar", result_summary: "{sets} grupos · {moves} movimentos · {time} · Pontuação {score}", stats_games: "Partidas: {count}", stats_wins: "Vitórias: {count}", stats_rate: "Taxa de vitória: {rate}%", stats_best_time: "Melhor tempo: {time}", stats_fewest: "Menos movimentos: {moves}", sound_on: "Som ativado", sound_off: "Som desativado", aria_sound_on: "Desativar som", aria_sound_off: "Ativar som", meta_title: "Spider Solitaire online grátis", meta_description: "Jogue Spider Solitaire de 1, 2 ou 4 naipes no celular e no computador.", meta_keywords: "Spider Solitaire,cartas,solitaire" },
    fr: { title: "Spider Solitaire", loading: "Préparation de la table", back: "Retour", settings: "Réglages", sound: "Effets sonores", language: "Langue", kicker: "Jeu de cartes classique", hero: "Formez des suites K à A de même couleur dans dix colonnes. Choisissez la difficulté et complétez les huit groupes.", start: "Commencer", restart: "Recommencer la partie", new_game: "Nouvelle partie", target_label: "Objectif", target: "Complétez huit suites K → A de même couleur.", controls_label: "Commandes", controls: "Faites glisser une carte ou une suite de même couleur. Touchez s'il n'y a qu'une destination.", mobile_label: "Mobile d'abord", mobile: "Les dix colonnes restent visibles et les longues piles réduisent leur chevauchement.", one_suit: "1 couleur", two_suits: "2 couleurs", four_suits: "4 couleurs", easy: "Facile", medium: "Moyen", hard: "Difficile", moves: "Coups", time: "Temps", score: "Score", completed: "Séries terminées", foundations: "Séries terminées", stock: "Talon", tableau: "Tableau", deal: "Distribuer 10", deals_left: "{count} distributions restantes", undo: "Annuler", hint: "Indice", help: "Comment jouer", fill_empty: "Remplissez toutes les colonnes vides avant de distribuer.", no_moves: "Aucun coup. Distribuez si toutes les colonnes contiennent une carte.", multiple: "Plusieurs destinations sont possibles. Faites glisser pour choisir.", invalid: "Ce déplacement est interdit.", move_hint: "Déplacez la suite en surbrillance vers la colonne en surbrillance.", deal_hint: "Distribuez une carte dans chaque colonne.", sequence_complete: "Série terminée !", card_face_down: "Carte face cachée", card_face: "{rank} de {suit}", learn_kicker: "Démarrage rapide", learn_title: "Spider en cinq étapes", tip_1: "Placez les cartes de K à A en ordre décroissant.", tip_2: "Seules les suites de même couleur se déplacent ensemble.", tip_3: "Terminez K → A de même couleur pour la retirer.", tip_4: "Touchez le talon pour distribuer une carte par colonne.", tip_5: "Une colonne vide bloque la distribution.", skip: "Passer", got_it: "Compris", confirm_title: "Commencer une nouvelle partie ?", confirm_copy: "Après avoir quitté cette partie, seule la fonction Annuler peut revenir en arrière.", cancel: "Annuler", confirm: "Nouvelle partie", victory: "Spider terminé !", return: "Retour", result_summary: "{sets} séries · {moves} coups · {time} · Score {score}", stats_games: "Parties : {count}", stats_wins: "Victoires : {count}", stats_rate: "Taux de victoire : {rate}%", stats_best_time: "Meilleur temps : {time}", stats_fewest: "Moins de coups : {moves}", sound_on: "Son activé", sound_off: "Son désactivé", aria_sound_on: "Désactiver le son", aria_sound_off: "Activer le son", meta_title: "Spider Solitaire en ligne gratuit", meta_description: "Jouez à Spider Solitaire en 1, 2 ou 4 couleurs sur mobile et ordinateur.", meta_keywords: "Spider Solitaire,cartes,solitaire" },
    de: { title: "Spider-Solitär", loading: "Tisch wird vorbereitet", back: "Zurück", settings: "Einstellungen", sound: "Soundeffekte", language: "Sprache", kicker: "Klassisches Kartenspiel", hero: "Bilde gleichfarbige Folgen von K bis A in zehn Spalten. Wähle eine Schwierigkeit und räume alle acht Sets ab.", start: "Spiel starten", restart: "Aktuelles Spiel neu starten", new_game: "Neues Spiel", target_label: "Ziel", target: "Acht gleichfarbige K-zu-A-Folgen abschließen.", controls_label: "Steuerung", controls: "Ziehe eine Karte oder gleichfarbige Folge. Tippe bei nur einem Ziel.", mobile_label: "Mobile zuerst", mobile: "Alle zehn Spalten bleiben sichtbar; lange Stapel passen ihre Überlappung an.", one_suit: "1 Farbe", two_suits: "2 Farben", four_suits: "4 Farben", easy: "Leicht", medium: "Mittel", hard: "Schwer", moves: "Züge", time: "Zeit", score: "Punkte", completed: "Fertige Sets", foundations: "Fertige Sets", stock: "Stapel", tableau: "Spielfeld", deal: "10 austeilen", deals_left: "{count} Austeilungen übrig", undo: "Rückgängig", hint: "Hinweis", help: "Spielanleitung", fill_empty: "Fülle alle leeren Spalten vor dem Austeilen.", no_moves: "Keine Züge. Teile aus, wenn jede Spalte eine Karte enthält.", multiple: "Mehrere Ziele möglich. Ziehe zur Auswahl.", invalid: "Dieser Zug ist nicht erlaubt.", move_hint: "Ziehe die markierte Folge in die markierte Spalte.", deal_hint: "Eine Karte auf jede Spalte austeilen.", sequence_complete: "Set abgeschlossen!", card_face_down: "Verdeckte Karte", card_face: "{rank} von {suit}", learn_kicker: "Schnellstart", learn_title: "Spider in fünf Schritten", tip_1: "Lege Karten von K bis A absteigend.", tip_2: "Nur Folgen derselben Farbe bewegen sich zusammen.", tip_3: "Eine gleichfarbige K-bis-A-Folge wird entfernt.", tip_4: "Klicke den Stapel für eine Karte pro Spalte.", tip_5: "Bei einer leeren Spalte darfst du nicht austeilen.", skip: "Überspringen", got_it: "Verstanden", confirm_title: "Neues Spiel starten?", confirm_copy: "Nach dem Verlassen kannst du nur mit Rückgängig zurückgehen.", cancel: "Abbrechen", confirm: "Neues Spiel", victory: "Spider geschafft!", return: "Zurück", result_summary: "{sets} Sets · {moves} Züge · {time} · Punkte {score}", stats_games: "Spiele: {count}", stats_wins: "Siege: {count}", stats_rate: "Siegquote: {rate}%", stats_best_time: "Beste Zeit: {time}", stats_fewest: "Wenigste Züge: {moves}", sound_on: "Sound an", sound_off: "Sound aus", aria_sound_on: "Sound ausschalten", aria_sound_off: "Sound einschalten", meta_title: "Spider-Solitär online kostenlos", meta_description: "Spiele Spider-Solitär mit 1, 2 oder 4 Farben auf Handy und Desktop.", meta_keywords: "Spider-Solitär,Kartenspiel" },
    it: { title: "Spider Solitaire", loading: "Preparazione del tavolo", back: "Indietro", settings: "Impostazioni", sound: "Effetti sonori", language: "Lingua", kicker: "Gioco di carte classico", hero: "Crea sequenze K-A dello stesso seme in dieci colonne. Scegli la difficoltà e completa gli otto gruppi.", start: "Inizia", restart: "Riavvia partita", new_game: "Nuova partita", target_label: "Obiettivo", target: "Completa otto sequenze K → A dello stesso seme.", controls_label: "Comandi", controls: "Trascina una carta o una sequenza dello stesso seme. Tocca se c'è una sola destinazione.", mobile_label: "Prima il mobile", mobile: "Le dieci colonne restano visibili e le pile lunghe riducono la sovrapposizione.", one_suit: "1 seme", two_suits: "2 semi", four_suits: "4 semi", easy: "Facile", medium: "Medio", hard: "Difficile", moves: "Mosse", time: "Tempo", score: "Punteggio", completed: "Gruppi completati", foundations: "Gruppi completati", stock: "Mazzo", tableau: "Tavolo", deal: "Distribuisci 10", deals_left: "{count} distribuzioni rimaste", undo: "Annulla", hint: "Suggerimento", help: "Come si gioca", fill_empty: "Riempi tutte le colonne vuote prima di distribuire.", no_moves: "Nessuna mossa. Distribuisci se ogni colonna contiene una carta.", multiple: "Più destinazioni disponibili. Trascina per scegliere.", invalid: "Mossa non valida.", move_hint: "Sposta la sequenza evidenziata nella colonna evidenziata.", deal_hint: "Distribuisci una carta in ogni colonna.", sequence_complete: "Gruppo completato!", card_face_down: "Carta coperta", card_face: "{rank} di {suit}", learn_kicker: "Avvio rapido", learn_title: "Spider in cinque mosse", tip_1: "Ordina da K ad A in modo decrescente.", tip_2: "Solo le sequenze dello stesso seme si muovono insieme.", tip_3: "Completa K → A dello stesso seme per rimuoverla.", tip_4: "Tocca il mazzo per distribuire una carta per colonna.", tip_5: "Non puoi distribuire se c'è una colonna vuota.", skip: "Salta", got_it: "Capito", confirm_title: "Iniziare una nuova partita?", confirm_copy: "Dopo aver lasciato questa partita, puoi tornare indietro solo con Annulla.", cancel: "Annulla", confirm: "Nuova partita", victory: "Spider completato!", return: "Indietro", result_summary: "{sets} gruppi · {moves} mosse · {time} · Punteggio {score}", stats_games: "Partite: {count}", stats_wins: "Vittorie: {count}", stats_rate: "Percentuale vittorie: {rate}%", stats_best_time: "Miglior tempo: {time}", stats_fewest: "Meno mosse: {moves}", sound_on: "Audio attivo", sound_off: "Audio disattivo", aria_sound_on: "Disattiva audio", aria_sound_off: "Attiva audio", meta_title: "Spider Solitaire online gratis", meta_description: "Gioca a Spider Solitaire con 1, 2 o 4 semi su mobile e desktop.", meta_keywords: "Spider Solitaire,carte,solitario" },
    ru: { title: "Пасьянс Паук", loading: "Подготавливаем стол", back: "Назад", settings: "Настройки", sound: "Звуки", language: "Язык", kicker: "Классическая карточная игра", hero: "Собирайте одномастные ряды от K до A в десяти колонках. Выберите сложность и уберите все восемь наборов.", start: "Начать игру", restart: "Начать эту игру заново", new_game: "Новая игра", target_label: "Цель", target: "Собрать восемь одномастных рядов K → A.", controls_label: "Управление", controls: "Перетаскивайте карту или одномастный ряд. Нажмите, если есть только одна цель.", mobile_label: "Сначала мобильные", mobile: "Все десять колонок видны, а длинные стопки уменьшают перекрытие.", one_suit: "1 масть", two_suits: "2 масти", four_suits: "4 масти", easy: "Легко", medium: "Средне", hard: "Сложно", moves: "Ходы", time: "Время", score: "Счёт", completed: "Готовые наборы", foundations: "Готовые наборы", stock: "Колода", tableau: "Стол", deal: "Раздать 10", deals_left: "Осталось раздач: {count}", undo: "Отменить", hint: "Подсказка", help: "Как играть", fill_empty: "Сначала заполните все пустые колонки.", no_moves: "Ходов нет. Раздайте карты, если в каждой колонке есть карта.", multiple: "Возможны разные цели. Перетащите для выбора.", invalid: "Такой ход невозможен.", move_hint: "Переместите подсвеченный ряд в подсвеченную колонку.", deal_hint: "Раздайте по одной карте в каждую колонку.", sequence_complete: "Набор готов!", card_face_down: "Закрытая карта", card_face: "{rank} масть {suit}", learn_kicker: "Быстрый старт", learn_title: "Паук за пять шагов", tip_1: "Складывайте карты по убыванию от K до A.", tip_2: "Вместе перемещаются только ряды одной масти.", tip_3: "Готовый ряд K → A одной масти убирается.", tip_4: "Нажмите на колоду, чтобы раздать по карте в колонку.", tip_5: "При пустой колонке раздача запрещена.", skip: "Пропустить", got_it: "Понятно", confirm_title: "Начать новую игру?", confirm_copy: "После выхода вернуться можно только через отмену хода.", cancel: "Отмена", confirm: "Новая игра", victory: "Паук завершён!", return: "Назад", result_summary: "{sets} наборов · {moves} ходов · {time} · Счёт {score}", stats_games: "Игр: {count}", stats_wins: "Побед: {count}", stats_rate: "Процент побед: {rate}%", stats_best_time: "Лучшее время: {time}", stats_fewest: "Меньше всего ходов: {moves}", sound_on: "Звук включён", sound_off: "Звук выключен", aria_sound_on: "Выключить звук", aria_sound_off: "Включить звук", meta_title: "Пасьянс Паук онлайн бесплатно", meta_description: "Играйте в Пасьянс Паук на 1, 2 или 4 масти на телефоне и компьютере.", meta_keywords: "Пасьянс Паук,карточная игра" },
    hi: { title: "स्पाइडर सॉलिटेयर", loading: "टेबल तैयार हो रही है", back: "वापस", settings: "सेटिंग्स", sound: "ध्वनि प्रभाव", language: "भाषा", kicker: "क्लासिक कार्ड गेम", hero: "दस कॉलम में एक ही सूट की K से A तक की श्रृंखला बनाएं। कठिनाई चुनें और सभी आठ सेट पूरे करें।", start: "गेम शुरू करें", restart: "वर्तमान गेम फिर शुरू करें", new_game: "नया गेम", target_label: "लक्ष्य", target: "एक ही सूट की आठ K → A श्रृंखलाएं पूरी करें।", controls_label: "नियंत्रण", controls: "कार्ड या एक ही सूट की श्रृंखला खींचें। केवल एक जगह हो तो टैप करें।", mobile_label: "मोबाइल पहले", mobile: "दसों कॉलम दिखते रहते हैं और लंबी स्टैक का ओवरलैप घटता है।", one_suit: "1 सूट", two_suits: "2 सूट", four_suits: "4 सूट", easy: "आसान", medium: "मध्यम", hard: "कठिन", moves: "चालें", time: "समय", score: "स्कोर", completed: "पूरे सेट", foundations: "पूरे सेट", stock: "स्टॉक", tableau: "टेबल", deal: "10 बांटें", deals_left: "{count} डील बाकी", undo: "वापस लें", hint: "संकेत", help: "कैसे खेलें", fill_empty: "डील से पहले सभी खाली कॉलम भरें।", no_moves: "कोई चाल नहीं। हर कॉलम में कार्ड होने पर डील करें।", multiple: "कई जगह संभव हैं। चुनने के लिए खींचें।", invalid: "यह चाल मान्य नहीं है।", move_hint: "हाइलाइट की गई श्रृंखला को हाइलाइट किए कॉलम में ले जाएं।", deal_hint: "हर कॉलम में एक कार्ड बांटें।", sequence_complete: "सेट पूरा!", card_face_down: "उल्टा कार्ड", card_face: "{suit} का {rank}", learn_kicker: "त्वरित शुरुआत", learn_title: "पांच चरणों में स्पाइडर", tip_1: "K से A तक घटते क्रम में रखें।", tip_2: "सिर्फ एक ही सूट की लगातार श्रृंखला साथ चलती है।", tip_3: "एक ही सूट की K → A पूरी होने पर हटती है।", tip_4: "स्टॉक दबाकर हर कॉलम में एक कार्ड बांटें।", tip_5: "खाली कॉलम होने पर डील नहीं कर सकते।", skip: "छोड़ें", got_it: "समझ गया", confirm_title: "नया गेम शुरू करें?", confirm_copy: "बाहर निकलने के बाद पिछली चाल केवल वापस लेकर ही लौटेगी।", cancel: "रद्द करें", confirm: "नया गेम", victory: "स्पाइडर पूरा!", return: "वापस", result_summary: "{sets} सेट · {moves} चालें · {time} · स्कोर {score}", stats_games: "गेम: {count}", stats_wins: "जीत: {count}", stats_rate: "जीत दर: {rate}%", stats_best_time: "सर्वश्रेष्ठ समय: {time}", stats_fewest: "सबसे कम चालें: {moves}", sound_on: "ध्वनि चालू", sound_off: "ध्वनि बंद", aria_sound_on: "ध्वनि बंद करें", aria_sound_off: "ध्वनि चालू करें", meta_title: "स्पाइडर सॉलिटेयर ऑनलाइन", meta_description: "मोबाइल और डेस्कटॉप पर 1, 2 या 4 सूट स्पाइडर सॉलिटेयर खेलें।", meta_keywords: "स्पाइडर सॉलिटेयर,कार्ड गेम" },
    ar: { title: "سوليتير العنكبوت", loading: "جارٍ تجهيز الطاولة", back: "رجوع", settings: "الإعدادات", sound: "المؤثرات الصوتية", language: "اللغة", kicker: "لعبة ورق كلاسيكية", hero: "كوّن سلاسل من K إلى A من النوع نفسه في عشرة أعمدة. اختر الصعوبة وأكمل المجموعات الثماني.", start: "بدء اللعبة", restart: "إعادة بدء اللعبة الحالية", new_game: "لعبة جديدة", target_label: "الهدف", target: "أكمل ثماني سلاسل K → A من النوع نفسه.", controls_label: "التحكم", controls: "اسحب بطاقة أو سلسلة من النوع نفسه. اضغط عندما تكون الوجهة واحدة.", mobile_label: "الهاتف أولاً", mobile: "تبقى الأعمدة العشرة واضحة وتضغط الأكوام الطويلة تداخلها تلقائياً.", one_suit: "نوع واحد", two_suits: "نوعان", four_suits: "أربعة أنواع", easy: "سهل", medium: "متوسط", hard: "صعب", moves: "الحركات", time: "الوقت", score: "النتيجة", completed: "المجموعات المكتملة", foundations: "المجموعات المكتملة", stock: "الرزمة", tableau: "الطاولة", deal: "توزيع 10", deals_left: "تبقى {count} توزيعات", undo: "تراجع", hint: "تلميح", help: "طريقة اللعب", fill_empty: "املأ كل الأعمدة الفارغة قبل التوزيع.", no_moves: "لا توجد حركات. وزّع عندما يحتوي كل عمود على بطاقة.", multiple: "هناك وجهات متعددة. اسحب للاختيار.", invalid: "هذه الحركة غير مسموحة.", move_hint: "انقل السلسلة المضيئة إلى العمود المضيء.", deal_hint: "وزّع بطاقة واحدة على كل عمود.", sequence_complete: "اكتملت مجموعة!", card_face_down: "بطاقة مقلوبة", card_face: "{rank} من {suit}", learn_kicker: "بداية سريعة", learn_title: "العنكبوت في خمس خطوات", tip_1: "رتّب البطاقات تنازلياً من K إلى A.", tip_2: "تتحرك السلاسل من النوع نفسه معاً فقط.", tip_3: "تُزال سلسلة K → A المكتملة من النوع نفسه.", tip_4: "اضغط الرزمة لتوزيع بطاقة على كل عمود.", tip_5: "لا يمكن التوزيع عند وجود عمود فارغ.", skip: "تخطٍ", got_it: "فهمت", confirm_title: "بدء لعبة جديدة؟", confirm_copy: "بعد مغادرة هذه اللعبة لن تعود إلا باستخدام التراجع.", cancel: "إلغاء", confirm: "لعبة جديدة", victory: "اكتملت لعبة العنكبوت!", return: "رجوع", result_summary: "{sets} مجموعات · {moves} حركات · {time} · النتيجة {score}", stats_games: "الألعاب: {count}", stats_wins: "الانتصارات: {count}", stats_rate: "نسبة الفوز: {rate}%", stats_best_time: "أفضل وقت: {time}", stats_fewest: "أقل حركات: {moves}", sound_on: "الصوت مفعّل", sound_off: "الصوت متوقف", aria_sound_on: "إيقاف الصوت", aria_sound_off: "تشغيل الصوت", meta_title: "سوليتير العنكبوت مجاناً عبر الإنترنت", meta_description: "العب سوليتير العنكبوت بنوع واحد أو نوعين أو أربعة أنواع على الهاتف والكمبيوتر.", meta_keywords: "سوليتير العنكبوت,لعبة ورق" },
  };

  const ui = {};
  const get = (id) => document.getElementById(id);
  ["loadingPanel", "loadingText", "loadingFill", "mainScreen", "battleScreen", "audioMenuBtn", "audioPopover", "soundBtn", "soundStateText", "localeSelect", "statistics", "startBtn", "restartBtn", "newGameBtn", "battleBackBtn", "moveCount", "timeValue", "scoreValue", "completedValue", "foundationRow", "stockPile", "dealLabel", "dealsLeft", "undoBtn", "hintBtn", "helpBtn", "boardShell", "tableauRow", "sequenceFx", "tutorialOverlay", "tutorialSkip", "tutorialDone", "confirmOverlay", "confirmNo", "confirmYes", "resultOverlay", "resultText", "resultNewGame", "resultRestart", "resultClose", "hintOverlay", "dragLayer"].forEach((id) => { ui[id] = get(id); });

  const safeGet = (key, fallback = null) => { try { return localStorage.getItem(key) ?? fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) { } };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const formatTime = (seconds) => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(Math.max(0, seconds) % 60).padStart(2, "0")}`;
  const seedNow = () => ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);

  function locale() {
    const raw = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
    return I18N[raw] ? raw : "en";
  }

  function t(key, params = {}) {
    const value = I18N[locale()]?.[key] || I18N.en[key] || key;
    return String(value).replace(/\{(\w+)\}/g, (_match, name) => params[name] == null ? "" : String(params[name]));
  }

  function syncLocale() {
    const current = locale();
    document.documentElement.lang = current;
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-sl]").forEach((node) => { node.textContent = t(node.dataset.sl); });
    document.querySelectorAll("[data-sl-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.slAria)); });
    if (ui.localeSelect) ui.localeSelect.value = current;
    document.title = t("meta_title");
    const description = document.getElementById("metaDescription");
    const ogTitle = document.getElementById("ogTitle");
    const ogDescription = document.getElementById("ogDescription");
    const twitterTitle = document.getElementById("twitterTitle");
    const twitterDescription = document.getElementById("twitterDescription");
    if (description) description.content = t("meta_description");
    if (ogTitle) ogTitle.content = t("meta_title");
    if (ogDescription) ogDescription.content = t("meta_description");
    if (twitterTitle) twitterTitle.content = t("meta_title");
    if (twitterDescription) twitterDescription.content = t("meta_description");
    const routeLocale = current === "zh-Hant" ? "zh-tw" : current === "zh-Hans" ? "zh-cn" : current.toLowerCase() === "pt-br" ? "pt-br" : current;
    const canonical = `https://weightplay.com/${routeLocale}/games/spider-solitaire/`;
    const canonicalNode = document.getElementById("metaCanonical");
    const ogUrl = document.getElementById("ogUrl");
    if (canonicalNode) canonicalNode.href = canonical;
    if (ogUrl) ogUrl.content = canonical;
    renderStatistics();
    renderHeader();
    updateDifficultyButtons();
  }

  class SequenceValidator {
    static isDescendingSameSuit(cards) {
      if (!cards?.length || cards.some((card) => !card.faceUp)) return false;
      return cards.every((card, index) => index === 0 || (card.suit === cards[index - 1].suit && cards[index - 1].rank === card.rank + 1));
    }

    static isComplete(cards) {
      return cards?.length === 13 && cards[0]?.rank === 13 && cards.at(-1)?.rank === 1 && this.isDescendingSameSuit(cards);
    }
  }

  class SpiderRules extends RuleEngine {
    canPlaceOnTableau(card, targetCard) {
      return Boolean(card) && (!targetCard || card.rank + 1 === targetCard.rank);
    }

    canMoveGroup(cards) {
      return Boolean(cards?.length) && (cards.length === 1 || SequenceValidator.isDescendingSameSuit(cards));
    }
  }

  class CompletedSequenceManager {
    constructor() {
      this.counts = Object.fromEntries(SUITS.map((suit) => [suit, 0]));
      this.total = 0;
    }

    complete(suit) {
      if (this.counts[suit] == null) this.counts[suit] = 0;
      this.counts[suit] += 1;
      this.total += 1;
    }

    snapshot() {
      return { counts: { ...this.counts }, total: this.total };
    }

    restore(raw = {}) {
      this.counts = { ...Object.fromEntries(SUITS.map((suit) => [suit, 0])), ...(raw.counts || {}) };
      this.total = Number(raw.total) || 0;
    }
  }

  class SpiderStock extends Stock {
    static fromJSON(raw = []) {
      return new SpiderStock(raw.map((card) => window.WPCardEngine.Card.from(card)));
    }

    canDeal(tableau) {
      return this.cards.length >= 10 && tableau.every((column) => column.length > 0);
    }

    dealRow(tableau) {
      if (!this.canDeal(tableau)) return null;
      const cards = this.draw(10);
      cards.forEach((card, index) => tableau[index].push(card));
      return cards;
    }
  }

  class SpiderBoard {
    constructor(difficulty = 1) {
      this.rules = new SpiderRules();
      this.setDifficulty(difficulty);
      this.newGame(seedNow());
    }

    setDifficulty(difficulty) {
      this.difficulty = DIFFICULTIES[difficulty] ? Number(difficulty) : 1;
      this.config = DIFFICULTIES[this.difficulty];
    }

    newGame(seed = seedNow()) {
      this.seed = seed >>> 0;
      this.tableau = new Tableau(10);
      this.stock = new SpiderStock();
      this.completed = new CompletedSequenceManager();
      this.history = new UndoStack();
      this.moveCount = 0;
      this.score = 500;
      this.dealCount = 0;
      this.lastMove = null;
      this.recentMoves = [];
      const deck = Deck.buildShuffled(this.seed, this.config.suits, this.config.copies);
      let pointer = 0;
      for (let column = 0; column < 10; column += 1) {
        const count = column < 4 ? 6 : 5;
        for (let row = 0; row < count; row += 1) {
          const card = deck.cards[pointer];
          card.faceUp = row === count - 1;
          this.tableau.columns[column].push(card);
          pointer += 1;
        }
      }
      deck.cards.slice(pointer).forEach((card) => { card.faceUp = false; });
      this.stock = new SpiderStock(deck.cards.slice(pointer));
      this.visitedStates = new Set();
      this.rememberState();
      this.initialSnapshot = this.snapshot();
      return this.initialSnapshot;
    }

    restart() {
      return this.newGame(this.seed);
    }

    snapshot() {
      return { difficulty: this.difficulty, seed: this.seed, moveCount: this.moveCount, score: this.score, dealCount: this.dealCount, lastMove: this.lastMove ? { ...this.lastMove, cardIds: [...(this.lastMove.cardIds || [])] } : null, recentMoves: this.recentMoves.map((entry) => ({ ...entry, cardIds: [...entry.cardIds] })), completed: this.completed.snapshot(), tableau: this.tableau.toJSON(), stock: this.stock.toJSON() };
    }

    stateKey() {
      return JSON.stringify({ tableau: this.tableau.toJSON(), stock: this.stock.toJSON(), completed: this.completed.snapshot() });
    }

    rememberState() {
      this.visitedStates.add(this.stateKey());
      while (this.visitedStates.size > 128) this.visitedStates.delete(this.visitedStates.values().next().value);
    }

    restore(raw) {
      if (!raw) return false;
      this.setDifficulty(raw.difficulty);
      this.seed = Number(raw.seed) >>> 0;
      this.moveCount = Number(raw.moveCount) || 0;
      this.score = Number(raw.score) || 0;
      this.dealCount = Number(raw.dealCount) || 0;
      this.lastMove = raw.lastMove ? { ...raw.lastMove, cardIds: [...(raw.lastMove.cardIds || [])] } : null;
      this.recentMoves = Array.isArray(raw.recentMoves) ? raw.recentMoves.map((entry) => ({ ...entry, cardIds: [...(entry.cardIds || [])] })).slice(-8) : [];
      this.tableau = Tableau.fromJSON(raw.tableau || []);
      this.stock = SpiderStock.fromJSON(raw.stock || []);
      this.completed = new CompletedSequenceManager();
      this.completed.restore(raw.completed || {});
      this.visitedStates = new Set();
      this.rememberState();
      return true;
    }

    pushHistory() {
      this.history.push(this.snapshot());
    }

    undo() {
      const previous = this.history.pop();
      if (!previous) return false;
      return this.restore(previous);
    }

    canTakeFrom(column, row) {
      const take = this.tableau.canTakeFrom(column, row, (current, next) => current.rank === next.rank + 1 && current.suit === next.suit);
      if (!take || !this.rules.canMoveGroup(take.cards)) return null;
      return take;
    }

    canDeal() {
      if (this.stock.cards.length < 10) return { ok: false, reason: "empty" };
      if (this.tableau.columns.some((column) => column.length === 0)) return { ok: false, reason: "empty-column" };
      return { ok: true };
    }

    resolveColumn(columnIndex) {
      const column = this.tableau.columns[columnIndex];
      const revealed = [];
      const completed = [];
      if (column.at(-1) && !column.at(-1).faceUp) {
        column.at(-1).faceUp = true;
        revealed.push(column.at(-1).id);
      }
      while (column.length >= 13) {
        const candidate = column.slice(-13);
        if (!SequenceValidator.isComplete(candidate)) break;
        column.splice(-13);
        this.completed.complete(candidate[0].suit);
        completed.push({ suit: candidate[0].suit, cards: candidate });
        if (column.at(-1) && !column.at(-1).faceUp) {
          column.at(-1).faceUp = true;
          revealed.push(column.at(-1).id);
        }
      }
      return { revealed, completed };
    }

    applyMove(move) {
      if (!move || move.type !== "tableauToTableau") return false;
      const take = this.canTakeFrom(move.fromColumn, move.startRow);
      const destination = this.tableau.columns[move.toColumn];
      if (!take || move.fromColumn === move.toColumn || !destination || !this.rules.canPlaceOnTableau(take.cards[0], destination.at(-1))) return false;
      this.pushHistory();
      const moving = this.tableau.columns[move.fromColumn].splice(move.startRow);
      destination.push(...moving);
      const first = this.resolveColumn(move.fromColumn);
      const second = this.resolveColumn(move.toColumn);
      this.moveCount += 1;
      this.score = Math.max(0, this.score + 5 + (first.revealed.length + second.revealed.length) * 10 + (first.completed.length + second.completed.length) * 100);
      this.lastMove = { type: "move", fromColumn: move.fromColumn, toColumn: move.toColumn, cardIds: moving.map((card) => card.id) };
      this.recentMoves = [...this.recentMoves, { fromColumn: move.fromColumn, toColumn: move.toColumn, cardIds: moving.map((card) => card.id) }].slice(-8);
      this.rememberState();
      return { type: "move", revealed: [...first.revealed, ...second.revealed], completed: [...first.completed, ...second.completed] };
    }

    dealStock() {
      const canDeal = this.canDeal();
      if (!canDeal.ok) return false;
      this.pushHistory();
      const cards = this.stock.dealRow(this.tableau.columns);
      if (!cards) return false;
      this.moveCount += 1;
      this.dealCount += 1;
      this.score = Math.max(0, this.score - 10);
      this.lastMove = { type: "deal", cardIds: cards.map((card) => card.id) };
      this.recentMoves = [];
      this.rememberState();
      return { type: "deal", cards };
    }

    legalMovesForTableau(fromColumn, startRow) {
      const take = this.canTakeFrom(fromColumn, startRow);
      if (!take) return [];
      const moves = [];
      for (let toColumn = 0; toColumn < this.tableau.columns.length; toColumn += 1) {
        if (toColumn === fromColumn) continue;
        const target = this.tableau.columns[toColumn].at(-1) || null;
        if (this.rules.canPlaceOnTableau(take.cards[0], target)) moves.push({ type: "tableauToTableau", fromColumn, startRow, toColumn, cards: take.cards });
      }
      return moves;
    }

    allLegalMoves() {
      const moves = [];
      for (let column = 0; column < this.tableau.columns.length; column += 1) {
        for (let row = 0; row < this.tableau.columns[column].length; row += 1) {
          moves.push(...this.legalMovesForTableau(column, row));
        }
      }
      return moves;
    }

    hasWon() {
      return this.completed.total >= 8;
    }
  }

  class SpiderHintSystem {
    static resultingStateKey(board, move) {
      const columns = board.tableau.columns.map((column) => column.map((card) => ({ suit: card.suit, rank: card.rank, id: card.id, faceUp: card.faceUp })));
      const completed = board.completed.snapshot();
      const resolve = (columnIndex) => {
        const column = columns[columnIndex];
        if (column.at(-1) && !column.at(-1).faceUp) column.at(-1).faceUp = true;
        while (column.length >= 13) {
          const candidate = column.slice(-13);
          if (!SequenceValidator.isComplete(candidate)) break;
          column.splice(-13);
          completed.counts[candidate[0].suit] = (completed.counts[candidate[0].suit] || 0) + 1;
          completed.total += 1;
          if (column.at(-1) && !column.at(-1).faceUp) column.at(-1).faceUp = true;
        }
      };
      const moving = columns[move.fromColumn].splice(move.startRow);
      columns[move.toColumn].push(...moving);
      resolve(move.fromColumn);
      resolve(move.toColumn);
      return JSON.stringify({ tableau: columns, stock: board.stock.toJSON(), completed });
    }

    static find(board) {
      const moves = board.allLegalMoves();
      const scored = moves.map((move) => {
        const source = board.tableau.columns[move.fromColumn];
        const destination = board.tableau.columns[move.toColumn];
        const cards = source.slice(move.startRow);
        const remaining = source.slice(0, move.startRow);
        const combined = destination.concat(cards);
        const completes = SequenceValidator.isComplete(combined.slice(-13));
        const reveals = remaining.at(-1) && !remaining.at(-1).faceUp;
        const createsEmpty = remaining.length === 0;
        const extendsSameSuit = destination.at(-1)?.suit === cards[0].suit;
        const nextStateKey = this.resultingStateKey(board, move);
        const wouldRepeat = Boolean(nextStateKey && board.visitedStates?.has(nextStateKey));
        return { move, wouldRepeat, score: (reveals ? 120 : 0) + (completes ? 100 : 0) + (extendsSameSuit ? 35 : 0) + (createsEmpty ? 25 : 0) + Math.min(cards.length, 8) };
      }).sort((a, b) => b.score - a.score);
      const meaningful = scored.find((candidate) => {
        const source = board.tableau.columns[candidate.move.fromColumn];
        const cards = source.slice(candidate.move.startRow);
        if (candidate.wouldRepeat) return false;
        return !board.recentMoves.some((previous) => {
          const sameCards = cards.length === previous.cardIds.length && cards.every((card, index) => card.id === previous.cardIds[index]);
          const sameDirection = candidate.move.fromColumn === previous.fromColumn && candidate.move.toColumn === previous.toColumn;
          const reverseDirection = candidate.move.fromColumn === previous.toColumn && candidate.move.toColumn === previous.fromColumn;
          return sameCards && (sameDirection || reverseDirection);
        });
      });
      return meaningful?.move || (board.canDeal().ok ? { type: "deal" } : null);
    }
  }

  const stats = loadStats();
  const state = { difficulty: Number(safeGet(STORAGE.difficulty, "1")) || 1, active: false, hasStarted: false, elapsed: 0, timer: null, hintTimer: null, pendingAction: null, dragging: null, renderGeneration: 0, winRecorded: false, lastFrameCards: new Map(), cardPool: new Map(), pendingDealDelays: null, completionFlyouts: new Set() };
  state.difficulty = DIFFICULTIES[state.difficulty] ? state.difficulty : 1;
  let game = new SpiderBoard(state.difficulty);
  const audio = new SoundEngine(STORAGE.sound);

  function loadStats() {
    const defaults = () => ({ gamesPlayed: 0, wins: 0, bestTime: null, fewestMoves: null });
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE.stats) || "{}");
      return { 1: { ...defaults(), ...(raw[1] || {}) }, 2: { ...defaults(), ...(raw[2] || {}) }, 4: { ...defaults(), ...(raw[4] || {}) } };
    } catch (_error) {
      return { 1: defaults(), 2: defaults(), 4: defaults() };
    }
  }

  function saveStats() { safeSet(STORAGE.stats, JSON.stringify(stats)); }

  function renderStatistics() {
    const current = stats[state.difficulty];
    const total = Math.max(1, current.gamesPlayed);
    const rows = [t("stats_games", { count: current.gamesPlayed }), t("stats_wins", { count: current.wins }), t("stats_rate", { rate: Math.round((current.wins / total) * 100) }), t("stats_best_time", { time: current.bestTime == null ? "--" : formatTime(Math.round(current.bestTime / 1000)) }), t("stats_fewest", { moves: current.fewestMoves == null ? "--" : current.fewestMoves })];
    if (ui.statistics) ui.statistics.innerHTML = rows.map((row) => `<div>${row}</div>`).join("");
  }

  function renderHeader() {
    if (!game) return;
    if (ui.moveCount) ui.moveCount.textContent = String(game.moveCount);
    if (ui.timeValue) ui.timeValue.textContent = formatTime(state.elapsed);
    if (ui.scoreValue) ui.scoreValue.textContent = String(game.score);
    if (ui.completedValue) ui.completedValue.textContent = `${game.completed.total} / 8`;
    if (ui.dealsLeft) ui.dealsLeft.textContent = t("deals_left", { count: Math.floor(game.stock.cards.length / 10) });
    if (ui.stockPile) ui.stockPile.setAttribute("aria-label", `${t("stock")} · ${game.stock.cards.length}`);
  }

  function updateDifficultyButtons() {
    document.querySelectorAll("[data-difficulty]").forEach((button) => button.classList.toggle("is-selected", Number(button.dataset.difficulty) === state.difficulty));
  }

  function fitTableau() {
    const canvas = ui.battleScreen?.querySelector(".battle-canvas");
    if (!canvas || !ui.boardShell) return;
    const cardWidth = Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--card-width")) || 36;
    const cardHeight = cardWidth * 1.397;
    const maxRows = Math.max(1, ...game.tableau.columns.map((column) => column.length));
    const available = Math.max(170, ui.boardShell.clientHeight - 132);
    const step = clamp((available - cardHeight - 12) / Math.max(1, maxRows - 1), 11, 28);
    canvas.style.setProperty("--spider-step", `${step}px`);
    canvas.style.setProperty("--spider-pile-height", `${Math.ceil(cardHeight + (maxRows - 1) * step + 10)}px`);
  }

  function clearHints() {
    ui.tableauRow?.querySelectorAll(".hint-source,.hint-target,.drag-hover").forEach((node) => node.classList.remove("hint-source", "hint-target", "drag-hover"));
    ui.stockPile?.classList.remove("hint-source");
    if (state.hintTimer) window.clearTimeout(state.hintTimer);
  }

  function clearCompletionFlyouts() {
    state.completionFlyouts.forEach((node) => node.remove());
    state.completionFlyouts.clear();
  }

  function showHint(message) {
    if (!ui.hintOverlay) return;
    ui.hintOverlay.textContent = message;
    ui.hintOverlay.hidden = false;
    if (state.hintTimer) window.clearTimeout(state.hintTimer);
    state.hintTimer = window.setTimeout(() => { ui.hintOverlay.hidden = true; }, HINT_MS);
  }

  function highlightMove(move) {
    clearHints();
    if (!move) return;
    if (move.type === "deal") {
      ui.stockPile?.classList.add("hint-source");
      showHint(t("deal_hint"));
      return;
    }
    ui.tableauRow?.querySelector(`[data-index="${move.fromColumn}"]`)?.classList.add("hint-source");
    ui.tableauRow?.querySelector(`[data-index="${move.toColumn}"]`)?.classList.add("hint-target");
    showHint(t("move_hint"));
  }

  function createCardNode(card, row, isNew = false, previousFace = false, animationDelay = null) {
    let node = state.cardPool.get(card.id);
    if (!node) {
      node = document.createElement("div");
      node.className = "card";
      node.dataset.cardId = card.id;
      state.cardPool.set(card.id, node);
    }
    node.className = `card ${card.faceUp ? "front" : "back"} ${card.colorClass}`;
    node.dataset.row = String(row);
    node.dataset.face = card.faceUp ? "up" : "down";
    node.dataset.cardRank = String(card.rank);
    node.dataset.cardSuit = card.suit;
    node.setAttribute("role", "img");
    node.setAttribute("aria-label", card.faceUp ? t("card_face", { rank: card.rankLabel, suit: card.suit }) : t("card_face_down"));
    node.innerHTML = card.faceUp ? `<span class="rank-top" aria-hidden="true">${card.rankLabel}</span><span class="suit" aria-hidden="true">${SUIT_SYMBOLS[card.suit]}</span><span class="rank-bottom" aria-hidden="true">${card.rankLabel}</span>` : `<span class="card-back-pattern" aria-hidden="true"></span>`;
    node.style.top = `calc(${row} * var(--spider-step))`;
    node.style.zIndex = String(row + 1);
    node.onpointerdown = card.faceUp ? beginDrag : null;
    if (isNew) {
      node.classList.add("card-deal");
      const delay = animationDelay == null ? clamp(row, 0, CARD_DEAL_MAX_DELAY) * DEAL_STEP_MS : Math.max(0, animationDelay);
      node.style.animationDelay = `${delay}ms`;
    } else if (!previousFace && card.faceUp) {
      node.classList.add("card-flip");
      node.style.animationDelay = "0ms";
    } else {
      node.style.animationDelay = "0ms";
    }
    return node;
  }

  function renderBoard() {
    if (!ui.tableauRow || !game) return;
    state.renderGeneration += 1;
    fitTableau();
    ui.foundationRow.textContent = "";
    for (let index = 0; index < 8; index += 1) {
      const slot = document.createElement("div");
      slot.className = `foundation-slot ${index < game.completed.total ? "is-complete" : ""}`;
      slot.setAttribute("aria-label", `${t("foundations")} ${index + 1}`);
      slot.textContent = index < game.completed.total ? "K → A" : "";
      ui.foundationRow.append(slot);
    }
    ui.stockPile.innerHTML = `<span class="stock-count">${game.stock.cards.length}</span>`;
    ui.stockPile.disabled = game.stock.cards.length < 10;
    ui.stockPile.classList.toggle("is-empty", game.stock.cards.length < 10);
    const pileNodes = Array.from({ length: 10 }, (_, columnIndex) => {
      let pile = ui.tableauRow.querySelector(`.tableau-pile[data-index="${columnIndex}"]`);
      if (pile) return pile;
      pile = document.createElement("section");
      pile.className = "pile tableau-pile";
      pile.dataset.type = "tableau";
      pile.dataset.index = String(columnIndex);
      pile.addEventListener("pointerenter", () => { if (state.dragging) updateDragHover(pile); });
      pile.addEventListener("pointerleave", () => { if (state.dragging) pile.classList.remove("drag-hover"); });
      ui.tableauRow.append(pile);
      return pile;
    });
    const currentCards = new Map();
    game.tableau.columns.forEach((cards, columnIndex) => {
      const pile = pileNodes[columnIndex];
      pile.className = `pile tableau-pile ${cards.length ? "" : "empty"}`;
      pile.dataset.index = String(columnIndex);
      pile.setAttribute("aria-label", `${t("tableau")} ${columnIndex + 1}`);
      const wantedIds = new Set(cards.map((card) => card.id));
      pile.querySelectorAll(":scope > .card").forEach((node) => {
        if (!wantedIds.has(node.dataset.cardId)) node.remove();
      });
      cards.forEach((card, row) => {
        const previous = state.lastFrameCards.get(card.id);
        const node = createCardNode(card, row, !previous, previous ? previous.faceUp : false, state.pendingDealDelays?.get(card.id));
        if (pile.children[row] !== node) pile.insertBefore(node, pile.children[row] || null);
        currentCards.set(card.id, { faceUp: card.faceUp });
      });
      if (ui.tableauRow.children[columnIndex] !== pile) ui.tableauRow.insertBefore(pile, ui.tableauRow.children[columnIndex] || null);
    });
    state.lastFrameCards = currentCards;
    state.pendingDealDelays = null;
    renderHeader();
    requestAnimationFrame(fitTableau);
  }

  function updateDragHover(pile) {
    if (!state.dragging) return;
    const target = Number(pile.dataset.index);
    const legal = state.dragging.legalMoves.some((move) => move.toColumn === target);
    ui.tableauRow.querySelectorAll(".drag-hover").forEach((node) => node.classList.remove("drag-hover"));
    if (legal) {
      pile.classList.add("drag-hover");
      state.dragging.hoverTarget = target;
    } else {
      state.dragging.hoverTarget = null;
    }
  }

  function buildGhost(event) {
    const dragging = state.dragging;
    if (!dragging || dragging.ghost) return;
    const origin = dragging.originNode.getBoundingClientRect();
    const stack = document.createElement("div");
    stack.className = "ghost-stack";
    stack.style.width = `${origin.width}px`;
    stack.style.left = `${event.clientX - dragging.offsetX}px`;
    stack.style.top = `${event.clientY - dragging.offsetY}px`;
    dragging.cards.forEach((card, index) => {
      const ghost = createCardNode(card, index, false, true).cloneNode(true);
      ghost.classList.add("ghost-card");
      ghost.style.position = "absolute";
      ghost.style.width = "100%";
      ghost.style.top = `calc(${index} * var(--spider-step))`;
      ghost.style.pointerEvents = "none";
      stack.append(ghost);
    });
    ui.dragLayer.append(stack);
    dragging.ghost = stack;
    dragging.originNode.classList.add("is-selected");
  }

  function moveGhost(event) {
    if (!state.dragging?.ghost) return;
    state.dragging.ghost.style.left = `${event.clientX - state.dragging.offsetX}px`;
    state.dragging.ghost.style.top = `${event.clientY - state.dragging.offsetY}px`;
    const targetNode = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".tableau-pile");
    if (targetNode) updateDragHover(targetNode);
  }

  function beginDrag(event) {
    if (!state.active || state.dragging || ui.tutorialOverlay?.hidden === false) return;
    const node = event.currentTarget;
    const pile = node.closest(".tableau-pile");
    const fromColumn = Number(pile?.dataset.index);
    const row = Number(node.dataset.row);
    const take = game.canTakeFrom(fromColumn, row);
    if (!take) return;
    event.preventDefault();
    const rect = node.getBoundingClientRect();
    state.dragging = { pointerId: event.pointerId, fromColumn, row, cards: take.cards, legalMoves: game.legalMovesForTableau(fromColumn, row), originNode: node, startX: event.clientX, startY: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false, hoverTarget: null, ghost: null };
  }

  function finishDrag(event) {
    const dragging = state.dragging;
    if (!dragging || dragging.pointerId !== event.pointerId) return;
    const wasMoved = dragging.moved;
    const hoverTarget = dragging.hoverTarget;
    dragging.originNode.classList.remove("is-selected");
    ui.tableauRow.querySelectorAll(".drag-hover").forEach((node) => node.classList.remove("drag-hover"));
    state.dragging = null;
    if (!wasMoved) {
      handleCardTap(dragging.fromColumn, dragging.row);
      return;
    }
    const move = dragging.legalMoves.find((candidate) => candidate.toColumn === hoverTarget);
    if (!move) {
      if (dragging.ghost) {
        const originRect = dragging.originNode.getBoundingClientRect();
        const ghostRect = dragging.ghost.getBoundingClientRect();
        dragging.originNode.classList.add("returning-origin");
        dragging.ghost.classList.add("ghost-return");
        dragging.ghost.style.setProperty("--return-x", `${originRect.left - ghostRect.left}px`);
        dragging.ghost.style.setProperty("--return-y", `${originRect.top - ghostRect.top}px`);
        window.setTimeout(() => {
          dragging.ghost?.remove();
          dragging.originNode.classList.remove("returning-origin");
        }, 230);
      } else {
        dragging.originNode.classList.add("invalid-return");
        window.setTimeout(() => dragging.originNode.classList.remove("invalid-return"), 230);
      }
      audio.reject();
      showHint(t("invalid"));
      return;
    }
    dragging.ghost?.remove();
    performMove(move);
  }

  function handleCardTap(fromColumn, row) {
    const moves = game.legalMovesForTableau(fromColumn, row);
    if (moves.length === 1) {
      performMove(moves[0]);
      return;
    }
    if (moves.length > 1) {
      highlightMove(moves[0]);
      showHint(t("multiple"));
      return;
    }
    showHint(t("invalid"));
  }

  function performMove(move) {
    clearHints();
    const action = move.type === "deal" ? game.dealStock() : game.applyMove(move);
    if (!action) {
      audio.reject();
      showHint(t("invalid"));
      return false;
    }
    if (action.type === "deal") {
      audio.deal();
      state.pendingDealDelays = new Map(action.cards.map((card, columnIndex) => [card.id, columnIndex * DEAL_STEP_MS]));
    }
    else audio.place();
    if (action.revealed?.length) audio.flip();
    const completedFlyouts = action.completed?.length ? captureCompletedFlyouts(action.completed, game.completed.total - action.completed.length) : [];
    renderBoard();
    if (action.completed?.length) {
      audio.complete();
      animateCompletedFlyouts(completedFlyouts);
      showSequenceFeedback(action.completed.length);
      if (game.hasWon()) {
        window.setTimeout(showVictory, 620);
      }
    }
    return true;
  }

  function captureCompletedFlyouts(completed, firstSlot) {
    return completed.map((group, groupIndex) => ({
      slotIndex: firstSlot + groupIndex,
      cards: group.cards.map((card) => {
        const node = state.cardPool.get(card.id);
        return node ? { node: node.cloneNode(true), rect: node.getBoundingClientRect() } : null;
      }).filter(Boolean),
    }));
  }

  function animateCompletedFlyouts(flyouts) {
    const slots = [...(ui.foundationRow?.children || [])];
    flyouts.forEach((flyout, groupIndex) => {
      const target = slots[flyout.slotIndex]?.getBoundingClientRect();
      if (!target) return;
      flyout.cards.forEach(({ node, rect }, cardIndex) => {
        const clone = node;
        clone.classList.remove("card-deal", "card-flip", "is-selected", "returning-origin");
        clone.classList.add("sequence-fly-card");
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.setProperty("--sequence-x", `${target.left + target.width / 2 - (rect.left + rect.width / 2)}px`);
        clone.style.setProperty("--sequence-y", `${target.top + target.height / 2 - (rect.top + rect.height / 2)}px`);
        clone.style.animationDelay = `${groupIndex * 70 + cardIndex * 12}ms`;
        state.completionFlyouts.add(clone);
        clone.addEventListener("animationend", () => {
          state.completionFlyouts.delete(clone);
          clone.remove();
        }, { once: true });
        ui.dragLayer?.append(clone);
        window.setTimeout(() => {
          state.completionFlyouts.delete(clone);
          clone.remove();
        }, 1100 + groupIndex * 70 + cardIndex * 12);
      });
    });
  }

  function showSequenceFeedback(count) {
    if (!ui.sequenceFx) return;
    const toast = document.createElement("div");
    toast.className = "sequence-toast";
    toast.textContent = `${t("sequence_complete")} ×${count}`;
    ui.sequenceFx.append(toast);
    window.setTimeout(() => toast.remove(), 760);
  }

  function clickStock() {
    clearHints();
    const status = game.canDeal();
    if (!status.ok) {
      audio.reject();
      if (status.reason === "empty-column") {
        ui.tableauRow.querySelectorAll(".empty").forEach((node) => node.classList.add("hint-target"));
        showHint(t("fill_empty"));
      } else {
        showHint(t("no_moves"));
      }
      return;
    }
    performMove({ type: "deal" });
  }

  function requestHint() {
    const move = SpiderHintSystem.find(game);
    if (!move) {
      clearHints();
      showHint(t("no_moves"));
      return;
    }
    highlightMove(move);
  }

  function requestUndo() {
    clearHints();
    clearCompletionFlyouts();
    if (!game.undo()) {
      showHint(t("no_moves"));
      return;
    }
    audio.place();
    renderBoard();
  }

  function startClock() {
    stopClock();
    const started = performance.now() - state.elapsed * 1000;
    state.timer = window.setInterval(() => {
      state.elapsed = Math.floor((performance.now() - started) / 1000);
      renderHeader();
    }, 500);
  }

  function stopClock() {
    if (state.timer) window.clearInterval(state.timer);
    state.timer = null;
  }

  function resetClock() { state.elapsed = 0; startClock(); }

  function showBattle() {
    ui.mainScreen.hidden = true;
    ui.battleScreen.hidden = false;
    document.body.dataset.screen = "battle";
    window.dispatchEvent(new Event("resize"));
  }

  function showMain() {
    stopClock();
    clearCompletionFlyouts();
    ui.battleScreen.hidden = true;
    ui.mainScreen.hidden = false;
    document.body.dataset.screen = "main";
    ui.resultOverlay.hidden = true;
    ui.tutorialOverlay.hidden = true;
    ui.confirmOverlay.hidden = true;
    state.active = false;
    state.pendingAction = null;
    renderStatistics();
    window.dispatchEvent(new Event("resize"));
  }

  function beginNewGame() {
    clearCompletionFlyouts();
    game = new SpiderBoard(state.difficulty);
    game.newGame(seedNow());
    state.hasStarted = true;
    stats[state.difficulty].gamesPlayed += 1;
    saveStats();
    state.active = true;
    state.elapsed = 0;
    state.winRecorded = false;
    state.lastFrameCards = new Map();
    state.pendingDealDelays = new Map();
    game.tableau.columns.forEach((cards, columnIndex) => cards.forEach((card, row) => {
      state.pendingDealDelays.set(card.id, Math.min(CARD_DEAL_MAX_DELAY, row * 10 + columnIndex) * DEAL_STEP_MS);
    }));
    ui.resultOverlay.hidden = true;
    showBattle();
    renderBoard();
    startClock();
    if (safeGet(STORAGE.tutorial, "0") !== "1") window.setTimeout(() => { ui.tutorialOverlay.hidden = false; }, 420);
  }

  function requestNewGame() {
    if (state.active && game.moveCount > 0 && !game.hasWon()) {
      state.pendingAction = beginNewGame;
      ui.confirmOverlay.hidden = false;
      return;
    }
    beginNewGame();
  }

  function restartGame() {
    if (!state.hasStarted) {
      beginNewGame();
      return;
    }
    clearCompletionFlyouts();
    game.restart();
    state.active = true;
    state.elapsed = 0;
    state.winRecorded = false;
    state.lastFrameCards = new Map();
    state.pendingDealDelays = new Map();
    game.tableau.columns.forEach((cards, columnIndex) => cards.forEach((card, row) => {
      state.pendingDealDelays.set(card.id, Math.min(CARD_DEAL_MAX_DELAY, row * 10 + columnIndex) * DEAL_STEP_MS);
    }));
    ui.resultOverlay.hidden = true;
    showBattle();
    renderBoard();
    startClock();
  }

  function showVictory() {
    if (!state.active || !game.hasWon()) return;
    stopClock();
    if (!state.winRecorded) {
      state.winRecorded = true;
      const current = stats[state.difficulty];
      current.wins += 1;
      current.bestTime = current.bestTime == null ? state.elapsed * 1000 : Math.min(current.bestTime, state.elapsed * 1000);
      current.fewestMoves = current.fewestMoves == null ? game.moveCount : Math.min(current.fewestMoves, game.moveCount);
      saveStats();
    }
    audio.win();
    ui.resultText.textContent = t("result_summary", { sets: game.completed.total, moves: game.moveCount, time: formatTime(state.elapsed), score: game.score });
    ui.resultOverlay.hidden = false;
  }

  function requestBack() {
    if (!state.active || game.hasWon() || game.moveCount === 0) {
      showMain();
      return;
    }
    state.pendingAction = showMain;
    ui.confirmOverlay.hidden = false;
  }

  function closeConfirm() { ui.confirmOverlay.hidden = true; state.pendingAction = null; }

  function finishTutorial() {
    safeSet(STORAGE.tutorial, "1");
    ui.tutorialOverlay.hidden = true;
  }

  function installSmokeHook() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("trial") !== "1" || params.get("smoke") !== "1") return;
    window.__spiderSolitaireSmoke = {
      loadVictoryFixture() {
        const Card = window.WPCardEngine.Card;
        const makeRun = (prefix) => Array.from({ length: 13 }, (_, index) => new Card("spades", 13 - index, `${prefix}-${index}`, true));
        stopClock();
        game = new SpiderBoard(1);
        game.tableau.columns = Array.from({ length: 10 }, () => []);
        game.tableau.columns[0] = makeRun("smoke-run-a");
        game.tableau.columns[1] = makeRun("smoke-run-b");
        game.stock = new SpiderStock([]);
        game.completed = new CompletedSequenceManager();
        for (let index = 0; index < 6; index += 1) game.completed.complete("spades");
        game.history = new UndoStack();
        game.moveCount = 0;
        game.score = 500;
        game.dealCount = 0;
        game.lastMove = null;
        game.recentMoves = [];
        game.visitedStates = new Set();
        game.rememberState();
        game.initialSnapshot = game.snapshot();
        state.difficulty = 1;
        state.active = true;
        state.hasStarted = true;
        state.elapsed = 0;
        state.winRecorded = false;
        state.lastFrameCards = new Map();
        state.cardPool = new Map();
        state.pendingDealDelays = null;
        clearCompletionFlyouts();
        ui.resultOverlay.hidden = true;
        ui.tutorialOverlay.hidden = true;
        ui.confirmOverlay.hidden = true;
        showBattle();
        renderBoard();
        startClock();
      },
      loadEmptyColumnFixture() {
        stopClock();
        game = new SpiderBoard(1);
        game.newGame(13579);
        game.tableau.columns[0] = [];
        game.history = new UndoStack();
        game.moveCount = 0;
        game.score = 500;
        game.dealCount = 0;
        game.lastMove = null;
        game.recentMoves = [];
        game.visitedStates = new Set();
        game.rememberState();
        game.initialSnapshot = game.snapshot();
        state.difficulty = 1;
        state.active = true;
        state.hasStarted = true;
        state.elapsed = 0;
        state.winRecorded = false;
        state.lastFrameCards = new Map();
        state.cardPool = new Map();
        state.pendingDealDelays = null;
        clearCompletionFlyouts();
        ui.resultOverlay.hidden = true;
        ui.tutorialOverlay.hidden = true;
        ui.confirmOverlay.hidden = true;
        showBattle();
        renderBoard();
        startClock();
      },
      loadFullHandFixture() {
        const Card = window.WPCardEngine.Card;
        const makeSegment = (runIndex, ranks) => ranks.map((rank, index) => new Card("spades", rank, `full-hand-${runIndex}-${index}`, true));
        const longRuns = Array.from({ length: 4 }, (_, index) => makeSegment(index, Array.from({ length: 11 }, (_value, rankIndex) => 13 - rankIndex)));
        const shortRuns = Array.from({ length: 4 }, (_, index) => makeSegment(index + 4, Array.from({ length: 10 }, (_value, rankIndex) => 13 - rankIndex)));
        const smallRuns = [
          makeSegment(0, [2, 1]), makeSegment(1, [2, 1]), makeSegment(2, [2, 1]), makeSegment(3, [2, 1]),
          makeSegment(4, [3, 2, 1]), makeSegment(5, [3, 2, 1]), makeSegment(6, [3, 2, 1]), makeSegment(7, [3, 2, 1]),
        ];
        const finalColumns = [...longRuns, ...shortRuns, [...smallRuns[0], ...smallRuns[1], ...smallRuns[4], ...smallRuns[5]], [...smallRuns[2], ...smallRuns[3], ...smallRuns[6], ...smallRuns[7]]];
        const initialCounts = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];
        const tableau = finalColumns.map((column, columnIndex) => column.slice(0, initialCounts[columnIndex]));
        const stockCards = [];
        for (let dealIndex = 4; dealIndex >= 0; dealIndex -= 1) {
          for (let columnIndex = 0; columnIndex < finalColumns.length; columnIndex += 1) {
            const card = finalColumns[columnIndex][initialCounts[columnIndex] + dealIndex];
            card.faceUp = false;
            stockCards.push(card);
          }
        }
        stopClock();
        game = new SpiderBoard(1);
        game.seed = 24681357;
        game.tableau.columns = tableau;
        game.stock = new SpiderStock(stockCards);
        game.completed = new CompletedSequenceManager();
        game.history = new UndoStack();
        game.moveCount = 0;
        game.score = 500;
        game.dealCount = 0;
        game.lastMove = null;
        game.recentMoves = [];
        game.visitedStates = new Set();
        game.rememberState();
        game.initialSnapshot = game.snapshot();
        state.difficulty = 1;
        state.active = true;
        state.hasStarted = true;
        state.elapsed = 0;
        state.winRecorded = false;
        state.lastFrameCards = new Map();
        state.cardPool = new Map();
        state.pendingDealDelays = null;
        clearCompletionFlyouts();
        ui.resultOverlay.hidden = true;
        ui.tutorialOverlay.hidden = true;
        ui.confirmOverlay.hidden = true;
        showBattle();
        renderBoard();
        startClock();
      },
      snapshot() {
        return {
          completed: game.completed.total,
          moveCount: game.moveCount,
          stock: game.stock.cards.length,
          tableau: game.tableau.columns.map((column) => column.map((card) => ({ id: card.id, rank: card.rank, faceUp: card.faceUp }))),
          resultVisible: !ui.resultOverlay.hidden,
          winRecorded: state.winRecorded,
          stats: { ...stats[1] },
          completionToastVisible: Boolean(document.querySelector(".sequence-toast")),
          completionFlyoutCount: document.querySelectorAll(".sequence-fly-card").length,
        };
      },
    };
  }

  function setSoundButton() {
    const enabled = Boolean(audio.enabled);
    ui.soundBtn.setAttribute("aria-pressed", String(enabled));
    ui.soundStateText.textContent = enabled ? t("sound_on") : t("sound_off");
    ui.soundBtn.setAttribute("aria-label", enabled ? t("aria_sound_on") : t("aria_sound_off"));
  }

  function init() {
    syncLocale();
    setSoundButton();
    updateDifficultyButtons();
    renderStatistics();
    ui.loadingFill.style.width = "100%";
    window.setTimeout(() => { ui.loadingPanel.hidden = true; }, 260);

    document.querySelectorAll("[data-difficulty]").forEach((button) => button.addEventListener("click", () => {
      if (state.active) return;
      state.difficulty = Number(button.dataset.difficulty);
      safeSet(STORAGE.difficulty, String(state.difficulty));
      game = new SpiderBoard(state.difficulty);
      updateDifficultyButtons();
      renderStatistics();
    }));
    ui.startBtn.addEventListener("click", beginNewGame);
    ui.restartBtn.addEventListener("click", restartGame);
    ui.newGameBtn.addEventListener("click", requestNewGame);
    ui.battleBackBtn.addEventListener("click", requestBack);
    ui.stockPile.addEventListener("click", clickStock);
    ui.undoBtn.addEventListener("click", requestUndo);
    ui.hintBtn.addEventListener("click", requestHint);
    ui.helpBtn.addEventListener("click", () => { ui.tutorialOverlay.hidden = false; });
    ui.audioMenuBtn.addEventListener("click", () => { ui.audioPopover.classList.toggle("is-hidden"); ui.audioMenuBtn.setAttribute("aria-expanded", String(!ui.audioPopover.classList.contains("is-hidden"))); });
    ui.soundBtn.addEventListener("click", () => { audio.setEnabled(!audio.enabled); setSoundButton(); });
    ui.localeSelect.addEventListener("change", () => window.WonderI18n?.setLocale?.(ui.localeSelect.value));
    ui.tutorialSkip.addEventListener("click", finishTutorial);
    ui.tutorialDone.addEventListener("click", finishTutorial);
    ui.confirmNo.addEventListener("click", closeConfirm);
    ui.confirmYes.addEventListener("click", () => { const action = state.pendingAction; closeConfirm(); action?.(); });
    ui.resultNewGame.addEventListener("click", beginNewGame);
    ui.resultRestart.addEventListener("click", restartGame);
    ui.resultClose.addEventListener("click", showMain);
    window.addEventListener("pointermove", (event) => { if (!state.dragging) return; const dx = event.clientX - state.dragging.startX; const dy = event.clientY - state.dragging.startY; if (!state.dragging.moved && Math.hypot(dx, dy) > 8) { state.dragging.moved = true; buildGhost(event); } if (state.dragging.moved) { event.preventDefault(); moveGhost(event); } }, { passive: false });
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    window.addEventListener("resize", () => { if (!ui.battleScreen.hidden) { fitTableau(); } });
    window.addEventListener("wonder:locale-change", () => { syncLocale(); setSoundButton(); if (!ui.battleScreen.hidden) renderBoard(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") { if (!ui.confirmOverlay.hidden) closeConfirm(); else if (!ui.tutorialOverlay.hidden) finishTutorial(); else if (!ui.audioPopover.classList.contains("is-hidden")) ui.audioPopover.classList.add("is-hidden"); } });
  }

  init();
  installSmokeHook();
})();
