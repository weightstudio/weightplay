(function () {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(false), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const COPY = window.GUST_GARDEN_LOCALES || {};
  const LOCALE_NAMES = window.GUST_GARDEN_LOCALE_NAMES || {};
  const DIRECTIONS = { up: { x: 0, y: -1 }, right: { x: 1, y: 0 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 } };
  // Game-owned guidance; the platform continues to own the scene frame.
  const COACH_KEYS = ['goal', 'pick', 'aim', 'send', 'preview', 'bloomPreview', 'undo', 'hint', 'moves', 'bed', 'order', 'noHint', 'undone', 'intro'];
  const COACH_COPY = {
    en: ['Fill all 3 flower beds', 'Choose a numbered seed', 'Choose an arrow. See where the seed will land.', 'Check the glowing landing square, then send the gust.', 'Landing: row {row}, column {col}', 'This gust will bloom a flower!', 'Undo', 'Hint', '{count} gusts', 'Empty flower bed', 'Bloom seeds in this order: {order}', 'Try undoing a move or resetting this plot.', 'Last gust undone. Try a different route.', 'Choose a seed, preview a wind arrow, then send it into any empty flower bed. Bloom all three to win.'],
    'zh-Hant': ['讓 3 個花圃全部開花', '點選有編號的種子', '選一個箭頭，先看看種子會落在哪裡。', '確認發光的落點，再按「送出微風」。', '落點：第 {row} 列、第 {col} 格', '這陣風會讓花圃開花！', '撤回', '提示', '已吹 {count} 陣風', '空花圃', '依這個種子順序開花：{order}', '試試撤回一步，或重新開始這關。', '已撤回上一陣風，換條路試試。', '點選種子、選箭頭預覽落點，再吹進任一空花圃。讓三個花圃開花就過關。'],
    'zh-Hans': ['让 3 个花圃全部开花', '点选有编号的种子', '选一个箭头，先看看种子会落在哪里。', '确认发光的落点，再按“送出微风”。', '落点：第 {row} 行、第 {col} 格', '这阵风会让花圃开花！', '撤回', '提示', '已吹 {count} 阵风', '空花圃', '依这个种子顺序开花：{order}', '试试撤回一步，或重新开始这关。', '已撤回上一阵风，换条路试试。', '点选种子、选箭头预览落点，再吹进任一空花圃。让三个花圃开花就过关。'],
    ja: ['3つの花壇を咲かせよう', '番号のある種を選ぶ', '矢印を選び、移動先を確認しよう。', '光る移動先を確認して風を送ろう。', '移動先：{row}行、{col}列', 'この風で花が咲く！', '戻す', 'ヒント', '風 {count} 回', '空の花壇', 'この種の順に咲かせる：{order}', '一手戻すか、この区画をやり直そう。', '一手戻しました。別の道を試そう。', '種を選び、矢印で移動先を確認して空の花壇へ。3つ咲かせるとクリア。'],
    ko: ['화단 3개를 모두 피우세요', '번호가 있는 씨앗 선택', '화살표를 골라 도착 지점을 확인하세요.', '빛나는 도착 지점을 확인하고 바람을 보내세요.', '도착: {row}행 {col}열', '이번 바람으로 꽃이 피어요!', '되돌리기', '힌트', '바람 {count}회', '빈 화단', '이 씨앗 순서로 꽃 피우기: {order}', '한 수 되돌리거나 이 구역을 다시 시작하세요.', '이전 바람을 되돌렸어요. 다른 길을 시도하세요.', '씨앗과 화살표를 골라 이동을 미리 보고 빈 화단으로 보내세요. 세 곳을 피우면 성공!'],
    es: ['Haz florecer los 3 parterres', 'Elige una semilla numerada', 'Elige una flecha y mira dónde caerá.', 'Revisa la casilla iluminada y envía la ráfaga.', 'Destino: fila {row}, columna {col}', '¡Esta ráfaga hará florecer una flor!', 'Deshacer', 'Pista', '{count} ráfagas', 'Parterre vacío', 'Florece las semillas en este orden: {order}', 'Deshaz un movimiento o reinicia esta parcela.', 'Última ráfaga deshecha. Prueba otra ruta.', 'Elige una semilla, previsualiza una flecha y envíala a cualquier parterre vacío. Haz florecer los tres.'],
    'pt-BR': ['Faça os 3 canteiros florescerem', 'Escolha uma semente numerada', 'Escolha uma seta e veja o destino.', 'Confira a casa iluminada e envie a rajada.', 'Destino: linha {row}, coluna {col}', 'Esta rajada fará uma flor desabrochar!', 'Desfazer', 'Dica', '{count} rajadas', 'Canteiro vazio', 'Faça as sementes florescerem nesta ordem: {order}', 'Desfaça um movimento ou reinicie este canteiro.', 'Última rajada desfeita. Tente outra rota.', 'Escolha uma semente, veja o destino de uma seta e envie-a a um canteiro vazio. Faça os três florescerem.'],
    fr: ['Fais fleurir les 3 parterres', 'Choisis une graine numérotée', 'Choisis une flèche et observe la destination.', 'Vérifie la case lumineuse puis envoie la rafale.', 'Arrivée : ligne {row}, colonne {col}', 'Cette rafale fera éclore une fleur !', 'Annuler', 'Indice', '{count} rafales', 'Parterre vide', 'Fais fleurir les graines dans cet ordre : {order}', 'Annule un déplacement ou recommence cette parcelle.', 'Dernière rafale annulée. Essaie un autre chemin.', 'Choisis une graine, prévisualise une flèche puis envoie-la vers un parterre vide. Fais fleurir les trois.'],
    de: ['Bringe alle 3 Beete zum Blühen', 'Wähle einen nummerierten Samen', 'Wähle einen Pfeil und prüfe das Ziel.', 'Prüfe das leuchtende Feld und sende die Böe.', 'Ziel: Reihe {row}, Spalte {col}', 'Diese Böe lässt eine Blume blühen!', 'Zurück', 'Tipp', '{count} Böen', 'Leeres Blumenbeet', 'Lass die Samen in dieser Reihenfolge blühen: {order}', 'Nimm einen Zug zurück oder starte das Beet neu.', 'Letzte Böe zurückgenommen. Versuche einen anderen Weg.', 'Wähle einen Samen und einen Pfeil. Prüfe das Ziel und sende ihn in ein leeres Beet. Lass alle drei blühen.'],
    it: ['Fai fiorire tutte e 3 le aiuole', 'Scegli un seme numerato', 'Scegli una freccia e guarda la destinazione.', 'Controlla la casella luminosa e invia la folata.', 'Arrivo: riga {row}, colonna {col}', 'Questa folata farà sbocciare un fiore!', 'Annulla', 'Indizio', '{count} folate', 'Aiuola vuota', 'Fai fiorire i semi in questo ordine: {order}', 'Annulla una mossa o ricomincia questa aiuola.', 'Ultima folata annullata. Prova un altro percorso.', 'Scegli un seme, controlla la freccia e invialo in un’aiuola vuota. Falle fiorire tutte e tre.'],
    ru: ['Пусть расцветут все 3 клумбы', 'Выбери семечко с номером', 'Выбери стрелку и проверь место посадки.', 'Проверь светящуюся клетку и отправь порыв.', 'Посадка: ряд {row}, столбец {col}', 'Этот порыв заставит цветок расцвести!', 'Отмена', 'Подсказка', 'Порывов: {count}', 'Пустая клумба', 'Порядок цветения семян: {order}', 'Отмени ход или начни эту клумбу заново.', 'Последний порыв отменён. Попробуй другой путь.', 'Выбери семечко и стрелку, проверь путь и отправь его на пустую клумбу. Заполни все три.'],
    hi: ['तीनों क्यारियों में फूल खिलाएँ', 'नंबर वाला बीज चुनें', 'तीर चुनें और देखें कि बीज कहाँ पहुँचेगा।', 'चमकता स्थान जाँचें, फिर हवा भेजें।', 'मंज़िल: पंक्ति {row}, स्तंभ {col}', 'इस हवा से फूल खिलेगा!', 'वापस', 'संकेत', '{count} झोंके', 'खाली क्यारी', 'इस क्रम में बीज खिलाएँ: {order}', 'एक चाल वापस लें या क्यारी फिर शुरू करें।', 'पिछला झोंका वापस लिया। दूसरा रास्ता आज़माएँ।', 'बीज और तीर चुनकर मंज़िल देखें, फिर किसी खाली क्यारी तक पहुँचाएँ। तीनों में फूल खिलाएँ।'],
    ar: ['اجعل الأحواض الثلاثة تزهر', 'اختر بذرة مرقمة', 'اختر سهماً وشاهد موضع الوصول.', 'تحقق من المربع المضيء ثم أرسل النسمة.', 'الوصول: الصف {row}، العمود {col}', 'هذه النسمة ستجعل زهرة تتفتح!', 'تراجع', 'تلميح', '{count} نسمات', 'حوض زهور فارغ', 'أنبت البذور بهذا الترتيب: {order}', 'تراجع عن خطوة أو أعد بدء هذا الحوض.', 'تم التراجع عن النسمة. جرّب مساراً آخر.', 'اختر بذرة وسهماً لمعاينة الوصول ثم أرسلها إلى أي حوض فارغ. اجعل الأحواض الثلاثة تزهر.'],
  };
  const coachCopy = (key, vars = {}) => {
    let value = (COACH_COPY[locale] || COACH_COPY.en)[COACH_KEYS.indexOf(key)] || key;
    for (const [name, replacement] of Object.entries(vars)) value = value.replaceAll(`{${name}}`, String(replacement));
    return value;
  };
  const plot = (number, arc, seeds, flowers, thorns, rules = {}) => ({
    name: `stage${number}`, number, arc, width: 5, height: 4,
    seeds, flowers, thorns, ...rules,
  });
  // Six authored arcs of five plots.  The layouts stay deterministic, while
  // drafts, one-way gates, paired portals, and ordered checkpoints change the
  // player's route decisions instead of merely increasing a number.
  const STAGES = [
    plot(1, "Meadow Wake", [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 3 }], [{ x: 0, y: 2 }, { x: 4, y: 0 }, { x: 2, y: 3 }], [{ x: 1, y: 1 }, { x: 3, y: 2 }]),
    plot(2, "Meadow Wake", [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 1, y: 2 }], [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 1, y: 0 }], [{ x: 1, y: 3 }, { x: 3, y: 1 }, { x: 2, y: 2 }]),
    plot(3, "Meadow Wake", [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 3 }], [{ x: 3, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }, { x: 1, y: 0 }]),
    plot(4, "Meadow Wake", [{ x: 1, y: 0 }, { x: 3, y: 3 }, { x: 4, y: 1 }], [{ x: 1, y: 1 }, { x: 3, y: 2 }, { x: 4, y: 2 }], [{ x: 0, y: 2 }, { x: 2, y: 1 }]),
    plot(5, "Meadow Wake", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 0 }], [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }], { checkpoint: "First Bloom Check", bloomOrder: [1, 2, 0] }),

    plot(6, "Crosswind Crossing", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 1, y: 3 }], [{ x: 2, y: 0 }, { x: 4, y: 2 }, { x: 1, y: 2 }], [{ x: 2, y: 2 }], { drafts: [{ x: 1, y: 0, direction: "right" }] }),
    plot(7, "Crosswind Crossing", [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 3, y: 3 }], [{ x: 0, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 1 }], [{ x: 1, y: 2 }], { drafts: [{ x: 0, y: 2, direction: "up" }] }),
    plot(8, "Crosswind Crossing", [{ x: 1, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 2 }], [{ x: 3, y: 0 }, { x: 4, y: 1 }, { x: 0, y: 1 }], [{ x: 2, y: 2 }, { x: 1, y: 2 }], { drafts: [{ x: 2, y: 0, direction: "right" }] }),
    plot(9, "Crosswind Crossing", [{ x: 0, y: 0 }, { x: 3, y: 3 }, { x: 4, y: 1 }], [{ x: 0, y: 3 }, { x: 3, y: 1 }, { x: 4, y: 3 }], [{ x: 1, y: 1 }, { x: 2, y: 2 }], { drafts: [{ x: 3, y: 2, direction: "up" }, { x: 4, y: 2, direction: "down" }] }),
    plot(10, "Crosswind Crossing", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 3 }], [{ x: 0, y: 2 }, { x: 4, y: 1 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }], { checkpoint: "Gale Gate Check", bloomOrder: [2, 0, 1], gates: [{ x: 0, y: 1, direction: "down" }, { x: 4, y: 2, direction: "up" }] }),

    plot(11, "Lantern Portals", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 1, y: 3 }], [{ x: 3, y: 3 }, { x: 4, y: 2 }, { x: 1, y: 2 }], [{ x: 2, y: 1 }], { portals: [{ x: 1, y: 0, toX: 3, toY: 3 }] }),
    plot(12, "Lantern Portals", [{ x: 4, y: 0 }, { x: 0, y: 3 }, { x: 2, y: 0 }], [{ x: 1, y: 3 }, { x: 0, y: 2 }, { x: 2, y: 1 }], [{ x: 3, y: 1 }], { portals: [{ x: 3, y: 0, toX: 1, toY: 3 }] }),
    plot(13, "Lantern Portals", [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 3 }], [{ x: 2, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }], { portals: [{ x: 1, y: 1, toX: 2, toY: 1 }] }),
    plot(14, "Lantern Portals", [{ x: 1, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 2 }], [{ x: 1, y: 0 }, { x: 3, y: 3 }, { x: 0, y: 1 }], [{ x: 2, y: 2 }], { portals: [{ x: 1, y: 2, toX: 3, toY: 3 }] }),
    plot(15, "Lantern Portals", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 0 }], [{ x: 2, y: 3 }, { x: 4, y: 2 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }], { checkpoint: "Portal Parade Check", bloomOrder: [1, 0, 2], portals: [{ x: 1, y: 0, toX: 2, toY: 3 }] }),

    plot(16, "Thornwork Tangle", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }], [{ x: 0, y: 2 }, { x: 4, y: 1 }, { x: 2, y: 3 }], [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 1 }], { gates: [{ x: 0, y: 1, direction: "down" }] }),
    plot(17, "Thornwork Tangle", [{ x: 4, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 3 }], [{ x: 4, y: 2 }, { x: 0, y: 1 }, { x: 3, y: 1 }], [{ x: 2, y: 1 }, { x: 1, y: 2 }, { x: 3, y: 2 }], { gates: [{ x: 4, y: 1, direction: "down" }] }),
    plot(18, "Thornwork Tangle", [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 0 }], [{ x: 2, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 2 }], [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 3 }], { drafts: [{ x: 1, y: 0, direction: "right" }], gates: [{ x: 3, y: 0, direction: "left" }] }),
    plot(19, "Thornwork Tangle", [{ x: 1, y: 0 }, { x: 3, y: 3 }, { x: 0, y: 2 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }, { x: 0, y: 1 }], [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 1 }], { portals: [{ x: 0, y: 3, toX: 3, toY: 1 }] }),
    plot(20, "Thornwork Tangle", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 3 }], [{ x: 2, y: 0 }, { x: 4, y: 1 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }], { checkpoint: "Thornwork Trial", bloomOrder: [2, 1, 0], drafts: [{ x: 1, y: 0, direction: "right" }], gates: [{ x: 4, y: 2, direction: "up" }] }),

    plot(21, "Moonseed Routes", [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 1, y: 1 }], [{ x: 2, y: 3 }, { x: 4, y: 2 }, { x: 1, y: 3 }], [{ x: 2, y: 1 }], { drafts: [{ x: 1, y: 3, direction: "right" }] }),
    plot(22, "Moonseed Routes", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 3, y: 1 }], [{ x: 0, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }], [{ x: 1, y: 1 }], { portals: [{ x: 4, y: 1, toX: 2, toY: 3 }] }),
    plot(23, "Moonseed Routes", [{ x: 1, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 1 }], [{ x: 1, y: 0 }, { x: 3, y: 2 }, { x: 0, y: 3 }], [{ x: 2, y: 1 }, { x: 2, y: 2 }], { gates: [{ x: 3, y: 1, direction: "down" }] }),
    plot(24, "Moonseed Routes", [{ x: 0, y: 2 }, { x: 4, y: 1 }, { x: 2, y: 3 }], [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }], { drafts: [{ x: 0, y: 1, direction: "up" }], portals: [{ x: 3, y: 1, toX: 2, toY: 1 }] }),
    plot(25, "Moonseed Routes", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 0 }], [{ x: 2, y: 0 }, { x: 4, y: 2 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }], { checkpoint: "Moonlit Mastery Check", bloomOrder: [0, 2, 1], gates: [{ x: 4, y: 2, direction: "up" }], portals: [{ x: 1, y: 0, toX: 2, toY: 0 }] }),

    plot(26, "Full Canopy", [{ x: 0, y: 3 }, { x: 4, y: 0 }, { x: 1, y: 1 }], [{ x: 2, y: 3 }, { x: 4, y: 2 }, { x: 1, y: 3 }], [{ x: 2, y: 1 }, { x: 3, y: 1 }], { drafts: [{ x: 1, y: 3, direction: "right" }], gates: [{ x: 4, y: 1, direction: "down" }] }),
    plot(27, "Full Canopy", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 3, y: 0 }], [{ x: 2, y: 0 }, { x: 4, y: 1 }, { x: 3, y: 3 }], [{ x: 1, y: 2 }, { x: 2, y: 2 }], { drafts: [{ x: 1, y: 0, direction: "right" }], portals: [{ x: 3, y: 1, toX: 3, toY: 3 }] }),
    plot(28, "Full Canopy", [{ x: 1, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 2 }], [{ x: 1, y: 0 }, { x: 3, y: 2 }, { x: 0, y: 0 }], [{ x: 2, y: 1 }, { x: 1, y: 2 }], { gates: [{ x: 3, y: 1, direction: "down" }], portals: [{ x: 0, y: 3, toX: 3, toY: 2 }] }),
    plot(29, "Full Canopy", [{ x: 0, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 3 }], [{ x: 2, y: 1 }, { x: 4, y: 0 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }, { x: 3, y: 2 }], { drafts: [{ x: 1, y: 1, direction: "right" }], portals: [{ x: 3, y: 1, toX: 4, toY: 0 }] }),
    plot(30, "Full Canopy", [{ x: 0, y: 0 }, { x: 4, y: 3 }, { x: 2, y: 0 }], [{ x: 2, y: 0 }, { x: 4, y: 2 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }, { x: 3, y: 1 }], { checkpoint: "The Great Garden Finale", bloomOrder: [1, 2, 0], drafts: [{ x: 1, y: 0, direction: "right" }], gates: [{ x: 4, y: 2, direction: "up" }], portals: [{ x: 1, y: 1, toX: 2, toY: 2 }] }),
  ];
  const $ = (id) => document.getElementById(id);
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocaleMap[routeSegment] || (COPY[document.documentElement.lang] ? document.documentElement.lang : "");
  const savedLocale = localStorage.getItem("weightplay-animal-gust-garden-locale");
  let locale = COPY[routeLocale] ? routeLocale : (COPY[savedLocale] ? savedLocale : "en");
  const PROGRESS_KEY = "weightplay-animal-gust-garden-progress-v2";
  const loadSolved = () => {
    try {
      const value = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
      return new Set((Array.isArray(value) ? value : value.cleared || []).map(Number).filter((index) => Number.isInteger(index) && index >= 0 && index < STAGES.length));
    } catch { return new Set(); }
  };
  const persistSolved = () => localStorage.setItem(PROGRESS_KEY, JSON.stringify([...solved].sort((a, b) => a - b)));
  const highestUnlocked = () => {
    let index = 0;
    while (index < STAGES.length - 1 && solved.has(index)) index += 1;
    return index;
  };
  let stageIndex = 0; let stageState = null; let selectedSeed = null; let selectedDirection = null; let solved = loadSolved(); let lastChecks = 0;
  let history = []; let feedback = ''; let effects = []; let frame = null; let stageRailController = null; let currentScreen = 'main';
  function stopEffects() { effects.forEach((effect) => effect.cancel()); effects = []; }
  function emphasize(node, kind = 'arrive') {
    if (!node?.animate) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frames = reduced ? [{ opacity: .6 }, { opacity: 1 }] : kind === 'reject'
      ? [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }]
      : [{ opacity: .5, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }];
    const animation = node.animate(frames, { duration: reduced ? 80 : 220, easing: 'ease-out' });
    effects.push(animation); animation.finished.then(() => { effects = effects.filter((effect) => effect !== animation); }, () => {});
  }
  const copy = (key, vars = {}) => {
    const dictionary = COPY[locale] || COPY.en;
    let value = dictionary[key] || COPY.en[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const directionCopy = (direction) => ((COPY[locale] || COPY.en).directions || COPY.en.directions)[direction];
  function announce(name, data = {}) { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `gust_garden_${name}`, game_id: "animal-gust-garden", game_version: "v16", interface_version: 9, stage: stageIndex + 1, ...data }); }
  function best() { const value = Number(localStorage.getItem("weightplay-animal-gust-garden-best-v1") || 0); return value > 0 ? value : null; }
  function show(screen) {
    stopEffects();
    currentScreen = screen;
    const scene = screen === 'result' ? 'battle' : screen;
    const isResult = screen === 'result';
    document.querySelectorAll('#app > [data-screen]').forEach((node) => {
      const active = node.dataset.screen === scene;
      node.hidden = !active;
      node.inert = !active;
    });
    const result = $('resultScreen');
    if (result) { result.hidden = !isResult; result.inert = !isResult; }
    const live = $('gardenBattleLive');
    if (live) { live.hidden = isResult; live.inert = isResult || scene !== 'battle'; }
    const headerInfo = $('battleHeaderInfo');
    if (headerInfo) headerInfo.hidden = isResult;
    const guide = document.querySelector('[data-wp-game-guide], .game-page-info.game-page-info-static');
    if (guide) guide.hidden = screen !== 'main';
    document.body.dataset.screen = scene;
    document.body.dataset.wpGameState = screen;
    document.body.dataset.wpActiveScreen = scene;
    if (isResult) document.body.dataset.wpBattleSubstate = 'result';
    else delete document.body.dataset.wpBattleSubstate;
    document.body.dir = locale === 'ar' ? 'rtl' : 'ltr';
    frame?.activate(scene, { covered: isResult });
    window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));
    window.scrollTo(0, 0);
    emphasize(document.querySelector('#app > [data-screen="' + scene + '"]'));
    const nextScreen = isResult ? null : scene;
    if (isResult && __wpMeasurement.started && !__wpMeasurement.ended) {
      __wpMeasurement.ended = true;
      __wpMeasurement.outcome = 'complete';
    } else if ((nextScreen === 'main' || nextScreen === 'stage') && __wpMeasurement.screen === 'battle' && __wpMeasurement.started && !__wpMeasurement.ended) {
      __wpMeasurement.ended = true;
      __wpMeasurement.outcome = 'abandon';
    }
    __wpMeasurement.screen = nextScreen;
    __wpNotifyMeasurement();
  }
  function mountInterface9() {
    if (!window.WeightPlayScreenFrame?.mount || !window.WeightPlayPlayUI?.mountStage) throw Error('Interface 9 shared play UI unavailable');
    const root = $('app');
    const mainRoot = $('mainScreen');
    const mainHeader = mainRoot.querySelector('header');
    const mainTitle = mainHeader.querySelector('[data-wp-game-title]');
    mainTitle.dataset.wpFrameTitle = '';
    mainRoot.querySelector('.main-cover').dataset.wpFramePoster = '';
    mainRoot.querySelector('.main-summary').dataset.wpFrameSummary = '';
    $('mainProgress').dataset.wpFrameProgress = '';
    $('startButton').dataset.wpFrameAction = 'primary';
    const localeSelect = $('localeSelect');
    const retained = document.createElement('div');
    retained.hidden = true;
    retained.setAttribute('aria-hidden', 'true');
    retained.append(localeSelect);
    root.append(retained);
    const stageRoot = $('stageScreen');
    const stageHeader = stageRoot.querySelector('header');
    const stageTitle = stageHeader.querySelector('[data-wp-frame-title]');
    if (stageTitle) stageTitle.textContent = copy('title');
    const stageWorkspace = $('stageWorkspace');
    const stageNav = stageRoot.querySelector('.stage-tabs');
    stageNav.dataset.wpFrameStageNav = '';
    const stageTab = $('stagesTab');
    stageTab.dataset.wpFrameAction = 'tab';
    stageTab.dataset.wpFrameStageSlot = 'stages';
    const battleRoot = $('battleScreen');
    const battleHeader = battleRoot.querySelector('header');
    const battleTitle = battleHeader.querySelector('[data-wp-frame-title]');
    if (battleTitle) battleTitle.textContent = copy('title');
    const result = $('resultScreen');
    result.dataset.wpBattleSubstate = 'result';
    result.hidden = true;
    result.inert = true;
    frame = window.WeightPlayScreenFrame.mount({
      root,
      playUI: true,
      scenes: {
        main: { root: mainRoot, header: mainHeader, content: mainRoot.querySelector('.main-copy') },
        stage: { root: stageRoot, header: stageHeader, content: stageWorkspace },
        battle: { root: battleRoot, header: battleHeader, content: $('gardenBattleLive'), headerInfo: $('battleHeaderInfo') },
      },
      localeSelect,
    });
    return localeSelect;
  }
  function stageName(index) { return copy('stage', { number: index + 1 }); }

  function applyCopy() {
    document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.body.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.i18nAria)); });
    document.querySelectorAll("[data-i18n-alt]").forEach((node) => { node.alt = copy(node.dataset.i18nAlt); });
    $("localeSelect").value = locale; [...$("localeSelect").options].forEach((option) => { option.textContent = LOCALE_NAMES[option.value] || option.value; });
    renderMain(); renderStages(); renderBattle(); renderResult(); frame?.refresh();
  }
  function renderMain() { document.querySelector('.main-summary').textContent = coachCopy('intro'); $("mainProgress").textContent = copy("progress", { done: solved.size, total: STAGES.length }); const value = best(); $("bestText").textContent = value ? copy("best", { count: value }) : copy("noBest"); }
  function renderStages() {
    const page = $('stageWorkspace');
    const rail = $('stageList');
    if (!page || !rail) return;
    const unlocked = highestUnlocked();
    const config = {
      gameId: 'animal-gust-garden',
      poster: '/games/animal-gust-garden/assets/animal-gust-garden-cover-art.webp',
      background: '/games/animal-gust-garden/assets/animal-gust-garden-background.webp',
      count: STAGES.length,
      stage: (index) => {
        const locked = index > highestUnlocked();
        const cleared = solved.has(index);
        const status = locked ? copy('locked') : cleared ? copy('finished') : copy('progress', { done: solved.size, total: STAGES.length });
        return {
          id: 'plot-' + String(index + 1).padStart(2, '0'),
          kicker: copy('chapter'),
          title: stageName(index),
          subtitle: cleared ? copy('finished') : copy('stageHint'),
          status,
          summary: copy('stageHint'),
          details: [copy('round'), copy('stageHint')],
          locked,
          cleared,
        };
      },
    };
    if (!stageRailController) {
      stageRailController = window.WeightPlayPlayUI.mountStage({
        page,
        rail,
        config,
        selected: unlocked,
        onStart: (index) => startStage(index),
        isActive: () => frame?.active === 'stage',
      });
      if (!stageRailController) throw Error('Interface 9 shared Stage selector could not initialize');
    } else stageRailController.refresh(unlocked);
  }
  function cloneStage(index) { const source = STAGES[index]; return { ...source, seeds: source.seeds.map((seed) => ({ ...seed, locked: false })), drafts: (source.drafts || []).map((item) => ({ ...item })), gates: (source.gates || []).map((item) => ({ ...item })), portals: (source.portals || []).map((item) => ({ ...item })) }; }
  function startStage(index) { if (index < 0 || index >= STAGES.length || index > highestUnlocked()) { announce("locked", { requestedStage: index + 1 }); return; } stageIndex = index; stageState = cloneStage(index); selectedSeed = 0; selectedDirection = null; lastChecks = 0; history = []; feedback = ''; show("battle"); window.dispatchEvent(new Event('weightplay:gust-stage-started')); window.WeightPlayAudio?.play("game.start"); announce("start"); renderBattle();
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function cellKey(x, y) { return `${x}:${y}`; }
  function findAt(list, x, y) { return list.find((item) => item.x === x && item.y === y); }
  // Preview, execution and hints share exactly the same atomic move rules.
  // Neither a blocked draft nor an occupied portal exit can partially move a seed.
  function forecastGust(state, index, direction) {
    const seed = state?.seeds[index]; const delta = DIRECTIONS[direction];
    if (!seed || seed.locked) return { ok: false, reason: 'noSeed' };
    if (!delta) return { ok: false, reason: 'noDirection' };
    const entry = { x: seed.x + delta.x, y: seed.y + delta.y };
    const draft = findAt(state.drafts || [], entry.x, entry.y);
    const steps = draft?.direction === direction ? 2 : 1;
    const path = []; let target = { x: seed.x, y: seed.y };
    const blocked = (point) => {
      if (point.x < 0 || point.x >= state.width || point.y < 0 || point.y >= state.height) return 'outside';
      if (findAt(state.thorns, point.x, point.y)) return 'blocked';
      if (state.seeds.some((other, otherIndex) => otherIndex !== index && other.x === point.x && other.y === point.y)) return 'occupied';
      return null;
    };
    for (let step = 0; step < steps; step += 1) {
      target = { x: target.x + delta.x, y: target.y + delta.y }; path.push(target);
      const reason = blocked(target);
      if (reason) return { ok: false, reason, path, target };
      const gate = findAt(state.gates || [], target.x, target.y);
      if (gate && gate.direction !== direction) return { ok: false, reason: 'gateBlocked', path, target };
    }
    const portal = findAt(state.portals || [], target.x, target.y);
    if (portal) {
      target = { x: portal.toX, y: portal.toY }; path.push(target);
      const reason = blocked(target);
      if (reason) return { ok: false, reason, path, target };
    }
    const bloom = Boolean(findAt(state.flowers, target.x, target.y));
    const order = state.bloomOrder || [];
    if (bloom && order.length && order[state.seeds.filter((item) => item.locked).length] !== index) return { ok: false, reason: 'order', path, target };
    return { ok: true, target, path, steps, bloom, portal: Boolean(portal) };
  }
  function installGardenUI() {
    const canvas = document.querySelector('#battleScreen .battle-canvas');
    canvas.dataset.gardenLayout = 'clarity';
    const workspace = document.createElement('div'); workspace.className = 'garden-workspace';
    const board = document.createElement('div'); board.className = 'garden-board';
    const controls = document.createElement('div'); controls.className = 'garden-controls';
    const coach = document.createElement('div'); coach.id = 'gardenCoach'; coach.className = 'garden-coach';
    coach.innerHTML = '<div class="garden-objective"><strong id="gardenGoal"></strong><span id="gardenMoves"></span></div><div class="bloom-meter" aria-hidden="true"><i></i><i></i><i></i></div><p id="gardenOrder"></p>';
    board.append(coach, $('grid'), document.querySelector('#battleScreen .legend'));
    const seedPicker = document.createElement('div'); seedPicker.id = 'gardenSeeds'; seedPicker.className = 'garden-seeds'; seedPicker.setAttribute('role', 'group');
    for (let i = 0; i < 3; i += 1) {
      const button = document.createElement('button'); button.type = 'button'; button.className = `garden-seed-choice asset-seed-${i + 1}`; button.dataset.seedChoice = i;
      button.addEventListener('click', () => chooseSeed(i)); seedPicker.append(button);
    }
    const forecast = document.createElement('p'); forecast.id = 'gustForecast'; forecast.className = 'gust-forecast'; forecast.setAttribute('aria-live', 'polite');
    const utilities = document.createElement('div'); utilities.className = 'garden-utilities';
    for (const [id, handler] of [['undoButton', undoGust], ['hintButton', showHint]]) {
      const button = document.createElement('button'); button.id = id; button.type = 'button'; button.className = 'secondary'; button.addEventListener('click', handler); utilities.append(button);
    }
    controls.append($('prompt'), seedPicker, document.querySelector('.direction-panel'), forecast, document.querySelector('.battle-actions'), utilities, $('status'));
    workspace.append(board, controls); canvas.append(workspace);
    $('grid').setAttribute('aria-label', coachCopy('goal'));
    $('grid').addEventListener('click', (event) => {
      const cell = event.target.closest('.grid-cell'); if (!cell) return;
      if (cell.dataset.seedIndex !== undefined) chooseSeed(Number(cell.dataset.seedIndex));
    });
    const directionRoot = $('directionButtons');
    for (const direction of Object.keys(DIRECTIONS)) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'direction-button'; button.dataset.direction = direction;
      button.innerHTML = `<b aria-hidden="true">${{ up: '↑', right: '→', down: '↓', left: '←' }[direction]}</b><span></span>`;
      button.addEventListener('click', () => { selectedDirection = direction; feedback = ''; renderBattle(); emphasize($('gustForecast')); });
      directionRoot.append(button);
    }
    document.addEventListener('keydown', (event) => {
      if (document.body.dataset.wpActiveScreen !== 'battle' || document.body.dataset.wpBattleSubstate === 'result' || document.querySelector('[role="dialog"]:not([hidden])') || event.target.closest('select,input,textarea')) return;
      const direction = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left' }[event.key];
      if (direction) { event.preventDefault(); selectedDirection = direction; feedback = ''; renderBattle(); }
      if (['1', '2', '3'].includes(event.key)) { event.preventDefault(); chooseSeed(Number(event.key) - 1); }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopEffects(); });
  }
  function chooseSeed(index) {
    if (!stageState || stageState.seeds[index]?.locked) return;
    selectedSeed = index; selectedDirection = null; feedback = ''; announce('select', { seed: index + 1 }); renderBattle(); emphasize($('gardenSeeds'));
  }
  function renderCoach() {
    const locked = stageState.seeds.filter((seed) => seed.locked).length;
    $('gardenGoal').textContent = `${coachCopy('goal')} · ${locked}/3`;
    $('gardenMoves').textContent = coachCopy('moves', { count: lastChecks });
    [...document.querySelectorAll('.bloom-meter i')].forEach((node, index) => node.classList.toggle('is-bloomed', index < locked));
    $('gardenOrder').textContent = stageState.bloomOrder ? coachCopy('order', { order: stageState.bloomOrder.map((index) => `${index + 1}${stageState.seeds[index].locked ? '✓' : ''}`).join(' → ') }) : coachCopy('bed');
    $('prompt').textContent = selectedDirection ? coachCopy('send') : coachCopy('aim');
    [...$('gardenSeeds').children].forEach((button, index) => {
      const seed = stageState.seeds[index]; button.textContent = `${index + 1} ${seed.locked ? '✓' : ''}`;
      button.disabled = seed.locked; button.setAttribute('aria-pressed', String(selectedSeed === index));
      button.setAttribute('aria-label', `${copy('seed')} ${index + 1}${seed.locked ? `, ${copy('flower')}` : ''}`);
    });
    $('gardenSeeds').setAttribute('aria-label', coachCopy('pick'));
    $('undoButton').textContent = `↶ ${coachCopy('undo')}`; $('undoButton').disabled = !history.length;
    $('hintButton').textContent = `✧ ${coachCopy('hint')}`;
    const prediction = selectedDirection ? forecastGust(stageState, selectedSeed, selectedDirection) : null;
    const forecast = $('gustForecast'); forecast.classList.toggle('is-blocked', prediction?.ok === false);
    forecast.textContent = !prediction ? coachCopy('aim') : !prediction.ok ? copy(prediction.reason) : prediction.bloom ? coachCopy('bloomPreview') : coachCopy('preview', { row: prediction.target.y + 1, col: prediction.target.x + 1 });
    for (const cell of $('grid').children) {
      const x = Number(cell.dataset.x), y = Number(cell.dataset.y);
      const onPath = prediction?.path?.some((point) => point.x === x && point.y === y);
      cell.classList.toggle('forecast-path', Boolean(onPath && prediction.ok));
      cell.classList.toggle('forecast-landing', Boolean(prediction?.ok && prediction.target.x === x && prediction.target.y === y));
      cell.classList.toggle('forecast-blocked', Boolean(prediction && !prediction.ok && prediction.target?.x === x && prediction.target?.y === y));
    }
  }
  function renderBattle() {
    if (!stageState) return; $("stageTitle").textContent = stageName(stageIndex); const progressPill = $("progressPill"); if (progressPill) progressPill.textContent = `${stageIndex + 1} / ${STAGES.length}`; $('status').className = 'status'; $("status").textContent = feedback || copy("status", { locked: stageState.seeds.filter((seed) => seed.locked).length, total: stageState.seeds.length });
    const root = $("grid"); root.style.setProperty("--grid-columns", stageState.width); let primaryActionMarked = false;
    if (root.children.length !== stageState.width * stageState.height) {
      root.replaceChildren();
      for (let i = 0; i < stageState.width * stageState.height; i += 1) { const cell = document.createElement('button'); cell.type = 'button'; cell.setAttribute('role', 'gridcell'); root.append(cell); }
    }
    const thornSet = new Set(stageState.thorns.map((thorn) => cellKey(thorn.x, thorn.y)));
    for (let y = 0; y < stageState.height; y += 1) for (let x = 0; x < stageState.width; x += 1) {
      const cell = root.children[y * stageState.width + x]; cell.className = 'grid-cell'; cell.dataset.x = x; cell.dataset.y = y; delete cell.dataset.seedIndex; delete cell.dataset.wpPrimaryAction; delete cell.dataset.badge; cell.removeAttribute('aria-pressed'); cell.removeAttribute('title'); cell.disabled = false; const seedIndex = stageState.seeds.findIndex((seed) => seed.x === x && seed.y === y); const flower = findAt(stageState.flowers, x, y); const thorn = thornSet.has(cellKey(x, y)); const draft = findAt(stageState.drafts || [], x, y); const gate = findAt(stageState.gates || [], x, y); const portal = findAt(stageState.portals || [], x, y);
      if (thorn) { cell.classList.add("thorn", "asset", "asset-thorn"); cell.textContent = ""; cell.setAttribute("aria-label", copy("thorn")); }
      else if (seedIndex >= 0) { const seed = stageState.seeds[seedIndex]; const flowerIndex = stageState.flowers.findIndex((item) => item.x === x && item.y === y); cell.classList.add("seed", seed.locked ? "locked" : "selectable", "asset", seed.locked ? `asset-flower-${Math.max(0, flowerIndex) % 2 + 1}` : `asset-seed-${(seedIndex % 3) + 1}`); if (flower) cell.classList.add("flower-target"); cell.dataset.seedIndex = String(seedIndex); cell.dataset.badge = seed.locked ? '✓' : String(seedIndex + 1); if (!seed.locked && !primaryActionMarked) { cell.dataset.wpPrimaryAction = "true"; primaryActionMarked = true; } cell.textContent = ""; cell.setAttribute("aria-label", `${copy("seed")} ${seedIndex + 1}${seed.locked ? `, ${copy("flower")}` : ""}`); cell.setAttribute("aria-pressed", String(selectedSeed === seedIndex)); }
      else if (flower) { cell.classList.add('flower', 'empty-bed'); cell.textContent = '✿'; cell.setAttribute('aria-label', coachCopy('bed')); }
      else if (portal) { cell.classList.add("portal"); cell.textContent = "◎"; cell.setAttribute("aria-label", copy("portal")); cell.title = `${copy('portal')} → ${portal.toY + 1}, ${portal.toX + 1}`; }
      else if (gate) { cell.classList.add("gate"); cell.textContent = {up:'↑',right:'→',down:'↓',left:'←'}[gate.direction]; cell.setAttribute("aria-label", `${copy("gate")} ${directionCopy(gate.direction)}`); }
      else if (draft) { cell.classList.add("draft"); cell.textContent = {up:'⇈',right:'⇉',down:'⇊',left:'⇇'}[draft.direction]; cell.setAttribute("aria-label", `${copy("draft")} ${directionCopy(draft.direction)}`); }
      else { cell.classList.add("open"); cell.textContent = "·"; cell.setAttribute("aria-label", copy("empty")); }
      cell.setAttribute('aria-rowindex', String(y + 1)); cell.setAttribute('aria-colindex', String(x + 1));
    }
    for (const button of $('directionButtons').children) { const direction = button.dataset.direction; button.setAttribute('aria-label', directionCopy(direction)); button.setAttribute('aria-pressed', String(selectedDirection === direction)); button.querySelector('span').textContent = directionCopy(direction); button.classList.toggle('is-unavailable', !forecastGust(stageState, selectedSeed, direction).ok); }
    $("gustButton").disabled = selectedSeed === null || selectedDirection === null || stageState.seeds[selectedSeed].locked;
    renderCoach();
  }
  function fail(message, eventName = "blocked") { feedback = message; $("status").textContent = message; $("status").className = "status warn"; emphasize($('grid'), 'reject'); window.WeightPlayAudio?.play('feedback.error'); announce(eventName); }
  function sendGust() {
    if (!stageState || document.body.dataset.wpBattleSubstate === 'result') return;
    const prediction = forecastGust(stageState, selectedSeed, selectedDirection);
    if (!prediction.ok) { fail(copy(prediction.reason), prediction.reason); return; }
    stopEffects(); const movedIndex = selectedSeed; const before = $('grid').querySelector(`[data-seed-index="${movedIndex}"]`)?.getBoundingClientRect();
    history.push({ seeds: stageState.seeds.map((seed) => ({...seed})), lastChecks, selectedSeed }); if (history.length > 200) history.shift();
    const seed = stageState.seeds[selectedSeed]; Object.assign(seed, prediction.target, { locked: prediction.bloom });
    lastChecks += prediction.steps; selectedDirection = null;
    feedback = copy(prediction.bloom ? 'bloomed' : 'moved');
    window.WeightPlayAudio?.play(prediction.bloom ? 'puzzle.match' : 'movement.step');
    announce(prediction.bloom ? 'bloom' : 'move', { seed: movedIndex + 1, checks: lastChecks });
    if (stageState.seeds.every((item) => item.locked)) { solved.add(stageIndex); persistSolved(); renderStages(); renderMain(); const oldBest = best(); if (!oldBest || lastChecks < oldBest) localStorage.setItem("weightplay-animal-gust-garden-best-v1", String(lastChecks)); show("result"); renderResult(); window.WeightPlayAudio?.play('result.win'); announce("complete", { checks: lastChecks, checkpoint: stageState.checkpoint || null }); } else {
      selectedSeed = seed.locked ? stageState.seeds.findIndex((item) => !item.locked) : selectedSeed; renderBattle();
      const destination = $('grid').querySelector(`[data-seed-index="${movedIndex}"]`);
      if (destination && before && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const after = destination.getBoundingClientRect(); const scale = after.width / destination.offsetWidth;
        const animation = destination.animate([{ transform: `translate(${(before.x - after.x) / scale}px, ${(before.y - after.y) / scale}px)`, opacity: .65 }, { transform: 'translate(0,0)', opacity: 1 }], {duration: prediction.portal ? 320 : 220, easing:'ease-out'}); effects.push(animation);
      } else emphasize(destination);
      if (prediction.bloom) emphasize(document.querySelector('.bloom-meter'));
    }
  }
  function undoGust() {
    const previous = history.pop(); if (!previous) return;
    stopEffects(); stageState.seeds = previous.seeds; lastChecks = previous.lastChecks; selectedSeed = previous.selectedSeed; selectedDirection = null;
    feedback = coachCopy('undone'); renderBattle(); emphasize($('grid')); window.WeightPlayAudio?.play('board.undo'); announce('undo');
  }
  function findHint(state) {
    const key = (seeds) => seeds.map((seed) => `${seed.x},${seed.y},${+seed.locked}`).join('|');
    const queue = [{seeds: state.seeds.map((seed) => ({...seed})), first: null}]; const visited = new Set([key(state.seeds)]);
    for (let cursor = 0; cursor < queue.length && cursor < 24000; cursor += 1) {
      const node = queue[cursor];
      if (node.seeds.every((seed) => seed.locked)) return node.first;
      for (let index = 0; index < node.seeds.length; index += 1) for (const direction of Object.keys(DIRECTIONS)) {
        const prediction = forecastGust({...state, seeds: node.seeds}, index, direction); if (!prediction.ok) continue;
        const seeds = node.seeds.map((seed, other) => other === index ? {...seed, ...prediction.target, locked: prediction.bloom} : seed);
        const id = key(seeds); if (visited.has(id)) continue;
        visited.add(id); queue.push({seeds, first: node.first || {index, direction}});
      }
    }
    return null;
  }
  function showHint() {
    if (!stageState) return;
    const hint = findHint(stageState);
    if (!hint) { fail(coachCopy('noHint'), 'hint_unavailable'); return; }
    selectedSeed = hint.index; selectedDirection = hint.direction; feedback = ''; renderBattle(); emphasize($('gustForecast')); announce('hint');
  }
  function renderResult() {
    const resultText = $('resultText');
    if (resultText) resultText.textContent = copy('resultText', { name: stageName(stageIndex), checks: lastChecks });
    const nextButton = $('nextButton');
    if (nextButton) {
      nextButton.disabled = stageIndex >= highestUnlocked();
      nextButton.hidden = false;
    }
    const replayButton = $('replayButton');
    if (replayButton) replayButton.hidden = false;
  }
  function openStage() { show("stage"); renderStages(); }
  function bind() {
    $('startButton').addEventListener('click', openStage);
    $('mapButton').addEventListener('click', openStage);
    $('nextButton').addEventListener('click', () => startStage(stageIndex + 1));
    $('replayButton').addEventListener('click', () => startStage(stageIndex));
    $('gustButton').addEventListener('click', sendGust);
    $('resetButton').addEventListener('click', () => {
      stopEffects();
      stageState = cloneStage(stageIndex);
      selectedSeed = 0;
      selectedDirection = null;
      lastChecks = 0;
      history = [];
      feedback = '';
      announce('reset');
      renderBattle();
      emphasize($('grid'));
      __wpMeasurement.roundKey = {};
      __wpMeasurement.started = true;
      __wpMeasurement.ended = false;
      __wpMeasurement.restart = true;
      __wpMeasurement.outcome = 'complete';
      __wpMeasurement.screen = 'battle';
      __wpNotifyMeasurement();
    });
    $('stageBackButton').addEventListener('click', () => { show('main'); renderMain(); });
    $('battleBackButton').addEventListener('click', openStage);
    $('localeSelect').addEventListener('change', (event) => {
      locale = COPY[event.target.value] ? event.target.value : 'en';
      localStorage.setItem('weightplay-animal-gust-garden-locale', locale);
      applyCopy();
    });
    window.addEventListener('weightplay:gust-stage-activate', (event) => {
      const index = Number(event.detail?.index);
      if (Number.isInteger(index)) startStage(index);
    });
  }
  function boot() {
    installGardenUI();
    mountInterface9();
    bind();
    $('app').hidden = false;
    show('main');
    applyCopy();
    announce('loaded');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
}());
