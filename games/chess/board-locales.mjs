// Complete board interaction vocabulary; no English fallback in other locales.
const keys=['w','b','p','n','bPiece','r','q','k','empty','selected','invalid','keys','language'];
const rows={
 en:['White','Black','Pawn','Knight','Bishop','Rook','Queen','King','Empty','Selected','Choose a marked legal square.','Arrow keys: move focus. Enter: select or move. Escape: cancel selection.','Language'],
 'zh-Hant':['白方','黑方','兵','騎士','主教','城堡','后','國王','空格','已選擇','請選擇標示的合法落點。','方向鍵移動焦點，Enter 選棋或落子，Escape 取消選取。','語言'],
 'zh-Hans':['白方','黑方','兵','马','象','车','后','王','空格','已选择','请选择标示的合法落点。','方向键移动焦点，Enter 选棋或落子，Escape 取消选择。','语言'],
 ja:['白','黒','ポーン','ナイト','ビショップ','ルーク','クイーン','キング','空きマス','選択中','印のある合法なマスを選んでください。','矢印キーで移動、Enterで選択・着手、Escapeで選択解除。','言語'],
 ko:['백','흑','폰','나이트','비숍','룩','퀸','킹','빈칸','선택됨','표시된 이동 가능한 칸을 선택하세요.','방향키로 이동, Enter로 선택 또는 이동, Escape로 선택 취소.','언어'],
 es:['Blancas','Negras','Peón','Caballo','Alfil','Torre','Dama','Rey','Vacía','Seleccionada','Elige una casilla legal marcada.','Flechas: mover foco. Enter: elegir o mover. Escape: cancelar selección.','Idioma'],
 'pt-BR':['Brancas','Pretas','Peão','Cavalo','Bispo','Torre','Dama','Rei','Vazia','Selecionada','Escolha uma casa legal marcada.','Setas: mover foco. Enter: selecionar ou mover. Escape: cancelar seleção.','Idioma'],
 fr:['Blancs','Noirs','Pion','Cavalier','Fou','Tour','Dame','Roi','Vide','Sélection','Choisissez une case légale indiquée.','Flèches : déplacer le focus. Entrée : sélectionner ou jouer. Échap : annuler la sélection.','Langue'],
 de:['Weiß','Schwarz','Bauer','Springer','Läufer','Turm','Dame','König','Leer','Ausgewählt','Wähle ein markiertes legales Feld.','Pfeile: Fokus bewegen. Enter: auswählen oder ziehen. Escape: Auswahl aufheben.','Sprache'],
 it:['Bianco','Nero','Pedone','Cavallo','Alfiere','Torre','Donna','Re','Vuota','Selezionato','Scegli una casa legale indicata.','Frecce: sposta il focus. Invio: seleziona o muovi. Escape: annulla la selezione.','Lingua'],
 ru:['Белые','Чёрные','Пешка','Конь','Слон','Ладья','Ферзь','Король','Пусто','Выбрано','Выберите отмеченную допустимую клетку.','Стрелки: фокус. Enter: выбрать или ходить. Escape: отменить выбор.','Язык'],
 hi:['सफ़ेद','काला','प्यादा','घोड़ा','ऊँट','हाथी','वज़ीर','राजा','खाली','चुना गया','चिह्नित वैध खाना चुनें।','तीर कुंजियाँ: फ़ोकस बदलें। Enter: चुनें या चलें। Escape: चयन हटाएँ।','भाषा'],
 ar:['الأبيض','الأسود','بيدق','حصان','فيل','قلعة','وزير','ملك','فارغ','محدد','اختر مربعاً قانونياً محدداً.','الأسهم: نقل التركيز. Enter: اختيار أو تحريك. Escape: إلغاء الاختيار.','اللغة']
};
export const boardLocales=Object.fromEntries(Object.entries(rows).map(([locale,row])=>{if(row.length!==keys.length)throw Error(`Incomplete board locale ${locale}`);return [locale,Object.fromEntries(keys.map((key,i)=>[key,row[i]]))];}));
export function squareDescription(game,square,locale){const p=game.get(square),t=boardLocales[locale];return `${square} · ${p?`${t[p.color]} · ${t[p.type==='b'?'bPiece':p.type]}`:t.empty}`;}
