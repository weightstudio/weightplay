// Static, game-owned Guide copy. This module does not boot or alter the game.
import {showText} from './spotlight-remix.js?v=20261027-showtime-act-polish1';
const titles = {en:'Robot Dog Showtime','zh-Hant':'機器狗才藝秀','zh-Hans':'机器狗才艺秀',ja:'ロボット犬のショータイム',ko:'로봇 강아지 쇼타임',es:'El espectáculo del perro robot','pt-BR':'Show do Cão Robô',fr:'Le Spectacle du Chien Robot',de:'Die Robot-Hundeshow',it:'Lo Show del Cane Robot',ru:'Шоу робопса',hi:'रोबोट कुत्ते का शो',ar:'عرض الكلب الآلي'};
const copy = {
  en: [
    'Plan 30 original choreography stages for a block-built robot pup and fox partner.', 'WeightPlay Original Game Guide', 'Gameplay', 'Spatial Planning Puzzle', 'Genre', 'Puzzle · Planning · Family', 'How to play',
    'Choose a performer and beat, then place a move or cue.', 'Plan both routes together and rehearse the formation.', 'Edit the first invalid beat and try again; your plan remains available.',
    'Rules', 'Stay on the stage, avoid blocked marks, and never place both performers on the same mark. Some finales need both performers to Bow on the last beat.',
    'Progress and replay', 'Clear a stage to save it and open the next one. Revisit any unlocked stage. After clearing Stages 2, 3, or 6, try the optional Spotlight Mix with swapped goals.',
    'Privacy and settings', 'Progress stays in this browser. No account is required. Use the shared Settings control for language and sound choices.', 'FAQ',
    'Is this a memory game?', 'No. You plan routes and cues for two performers on a visible beat board.', 'Does a rehearsal error lose progress?', 'No. The first invalid beat is shown and the cue plan remains editable.', 'Does progress move between browsers?', 'No. Current progress is stored locally in this browser.'
  ],
  'zh-Hant': [
    '為積木機器狗與狐狸搭檔規劃 30 個原創編舞關卡。', 'WeightPlay 原創遊戲說明', '玩法', '空間規劃解謎', '類型', '解謎 · 規劃 · 家庭', '如何遊玩',
    '選擇表演者與拍點，再安排移動或動作。', '一起規劃兩條路線，並排練隊形。', '修改第一個無效拍點後重試；原有計畫會保留。',
    '遊戲規則', '留在舞台上、避開封鎖位置，且兩位表演者不能占用同一位置。部分結尾要求兩位表演者在最後一拍同時鞠躬。',
    '進度與重玩', '過關後會儲存紀錄並解鎖下一關，也能重玩任何已解鎖關卡。完成第 2、3 或 6 關後，可挑戰交換目標的選玩聚光混搭。',
    '隱私與設定', '進度保存在目前瀏覽器，無須帳號。語言與音效可透過共用設定控制項調整。', '常見問題',
    '這是記憶遊戲嗎？', '不是。你會在可見的節拍板上為兩位表演者規劃路線與動作。', '排練失誤會失去進度嗎？', '不會。系統會指出第一個無效拍點，動作計畫仍可編輯。', '進度會在不同瀏覽器間同步嗎？', '不會。目前進度僅儲存在這個瀏覽器中。'
  ],
  'zh-Hans': [
    '为积木机器狗与狐狸搭档规划 30 个原创编舞关卡。', 'WeightPlay 原创游戏说明', '玩法', '空间规划解谜', '类型', '解谜 · 规划 · 家庭', '如何游玩',
    '选择表演者与拍点，再安排移动或动作。', '一起规划两条路线，并排练队形。', '修改第一个无效拍点后重试；原有计划会保留。',
    '游戏规则', '留在舞台上、避开封锁位置，且两位表演者不能占用同一位置。部分结尾要求两位表演者在最后一拍同时鞠躬。',
    '进度与重玩', '过关后会保存记录并解锁下一关，也能重玩任何已解锁关卡。完成第 2、3 或 6 关后，可挑战交换目标的选玩聚光混搭。',
    '隐私与设置', '进度保存在当前浏览器，无须账号。语言与音效可通过共用设置控件调整。', '常见问题',
    '这是记忆游戏吗？', '不是。你会在可见的节拍板上为两位表演者规划路线与动作。', '排练失误会丢失进度吗？', '不会。系统会指出第一个无效拍点，动作计划仍可编辑。', '进度会在不同浏览器间同步吗？', '不会。当前进度仅保存在这个浏览器中。'
  ],
  ja: [
    'ブロック製のロボット犬とキツネの相棒のために、30 のオリジナル振付ステージを計画します。', 'WeightPlay オリジナルゲームガイド', '遊び方の種類', '空間計画パズル', 'ジャンル', 'パズル · 計画 · ファミリー', '遊び方',
    '演者と拍を選び、移動や動作を配置します。', '二人の経路を一緒に考え、フォーメーションをリハーサルします。', '最初の無効な拍を直して再挑戦します。計画はそのまま残ります。',
    'ルール', '舞台から出ず、通行できないマスを避け、二人を同じマスに置かないでください。一部のフィナーレでは、最後の拍に二人がお辞儀する必要があります。',
    '進行と再プレイ', 'クリアすると進行が保存され、次のステージが開きます。解放済みのステージは再挑戦できます。ステージ 2、3、6 のクリア後は、目標を交換する任意のスポットライトミックスも楽しめます。',
    'プライバシーと設定', '進行はこのブラウザー内に保存され、アカウントは不要です。言語と音は共通の設定から変更できます。', 'よくある質問',
    '記憶ゲームですか？', 'いいえ。見えている拍のボードで、二人の経路と動作を計画するゲームです。', 'リハーサルのミスで進行は失われますか？', 'いいえ。最初の無効な拍が表示され、動作の計画は編集できます。', '別のブラウザーに進行を移せますか？', 'いいえ。現在の進行はこのブラウザーだけに保存されます。'
  ],
  ko: [
    '블록 로봇 강아지와 여우 파트너를 위해 30개의 독창적인 안무 스테이지를 계획하세요.', 'WeightPlay 오리지널 게임 안내', '게임 방식', '공간 계획 퍼즐', '장르', '퍼즐 · 계획 · 가족', '플레이 방법',
    '공연자와 박자를 선택한 뒤 이동이나 동작을 배치하세요.', '두 경로를 함께 계획하고 대형을 리허설하세요.', '첫 번째 잘못된 박자를 수정하고 다시 시도하세요. 기존 계획은 유지됩니다.',
    '규칙', '무대 안에 머물고 막힌 칸을 피하세요. 두 공연자를 같은 칸에 둘 수 없습니다. 일부 피날레에서는 마지막 박자에 두 공연자가 모두 인사해야 합니다.',
    '진행과 다시 하기', '스테이지를 완료하면 저장되고 다음 스테이지가 열립니다. 열린 스테이지는 다시 할 수 있습니다. 2, 3, 6스테이지 완료 후에는 목표가 바뀌는 선택 도전인 스포트라이트 믹스를 즐길 수 있습니다.',
    '개인정보와 설정', '진행 상황은 이 브라우저에 저장되며 계정이 필요하지 않습니다. 공용 설정에서 언어와 소리를 선택하세요.', '자주 묻는 질문',
    '기억력 게임인가요?', '아니요. 보이는 박자 보드에서 두 공연자의 경로와 동작을 계획합니다.', '리허설에서 실수하면 진행 상황을 잃나요?', '아니요. 첫 번째 잘못된 박자가 표시되며 동작 계획을 계속 수정할 수 있습니다.', '다른 브라우저와 진행 상황이 공유되나요?', '아니요. 현재 진행 상황은 이 브라우저에만 저장됩니다.'
  ],
  es: [
    'Planifica 30 escenarios de coreografía originales para un cachorro robot de bloques y su compañero zorro.', 'Guía del juego original de WeightPlay', 'Mecánica', 'Puzle de planificación espacial', 'Género', 'Puzles · Planificación · Familiar', 'Cómo jugar',
    'Elige un artista y un tiempo, y coloca un movimiento o una acción.', 'Planifica ambas rutas a la vez y ensaya la formación.', 'Corrige el primer tiempo inválido y vuelve a intentarlo; el plan se conserva.',
    'Reglas', 'Permanece en el escenario, evita las casillas bloqueadas y nunca sitúes a ambos artistas en la misma casilla. Algunos finales requieren que ambos hagan una reverencia en el último tiempo.',
    'Progreso y repetición', 'Supera un escenario para guardar el progreso y abrir el siguiente. Puedes repetir cualquiera que esté desbloqueado. Tras superar los escenarios 2, 3 o 6, prueba la Mezcla de focos opcional con objetivos intercambiados.',
    'Privacidad y ajustes', 'El progreso queda en este navegador. No hace falta una cuenta. Usa los ajustes compartidos para elegir idioma y sonido.', 'Preguntas frecuentes',
    '¿Es un juego de memoria?', 'No. Planificas rutas y acciones para dos artistas en un tablero de tiempos visible.', '¿Un error de ensayo borra el progreso?', 'No. Se muestra el primer tiempo inválido y puedes seguir editando el plan.', '¿Se transfiere el progreso entre navegadores?', 'No. El progreso actual se guarda localmente en este navegador.'
  ],
  'pt-BR': [
    'Planeje 30 fases de coreografia originais para um cão robô de blocos e sua parceira raposa.', 'Guia do jogo original da WeightPlay', 'Jogabilidade', 'Quebra-cabeça de planejamento espacial', 'Gênero', 'Quebra-cabeça · Planejamento · Família', 'Como jogar',
    'Escolha um artista e uma batida, depois coloque um movimento ou uma ação.', 'Planeje as duas rotas juntas e ensaie a formação.', 'Corrija a primeira batida inválida e tente novamente; o plano fica disponível.',
    'Regras', 'Fique no palco, evite casas bloqueadas e nunca coloque os dois artistas na mesma casa. Alguns finais exigem que ambos façam uma reverência na última batida.',
    'Progresso e repetição', 'Conclua uma fase para salvar e abrir a próxima. Repita qualquer fase desbloqueada. Após concluir as fases 2, 3 ou 6, experimente a Mistura de Holofotes opcional, com objetivos trocados.',
    'Privacidade e configurações', 'O progresso fica neste navegador. Não é preciso ter conta. Use as configurações compartilhadas para escolher idioma e som.', 'Perguntas frequentes',
    'É um jogo de memória?', 'Não. Você planeja rotas e ações para dois artistas em um quadro de batidas visível.', 'Um erro no ensaio apaga o progresso?', 'Não. A primeira batida inválida é mostrada e o plano continua editável.', 'O progresso passa de um navegador para outro?', 'Não. O progresso atual é armazenado localmente neste navegador.'
  ],
  fr: [
    'Planifiez 30 scènes chorégraphiques originales pour un chiot robot en blocs et son partenaire renard.', 'Guide du jeu original WeightPlay', 'Mécanique', 'Puzzle de planification spatiale', 'Genre', 'Puzzle · Planification · Famille', 'Comment jouer',
    'Choisissez un artiste et un temps, puis placez un déplacement ou une action.', 'Planifiez les deux parcours ensemble et répétez la formation.', 'Corrigez le premier temps invalide et réessayez ; votre plan reste disponible.',
    'Règles', 'Restez sur scène, évitez les cases bloquées et ne placez jamais les deux artistes sur la même case. Certains finales exigent que les deux artistes saluent au dernier temps.',
    'Progression et rejouabilité', 'Terminez une scène pour sauvegarder et ouvrir la suivante. Rejouez toute scène débloquée. Après les scènes 2, 3 ou 6, essayez le Mélange sous les projecteurs facultatif, avec des objectifs échangés.',
    'Confidentialité et paramètres', 'La progression reste dans ce navigateur. Aucun compte n’est nécessaire. Les paramètres communs permettent de choisir la langue et le son.', 'Questions fréquentes',
    'Est-ce un jeu de mémoire ?', 'Non. Vous planifiez les parcours et les actions de deux artistes sur un tableau de temps visible.', 'Une erreur de répétition efface-t-elle la progression ?', 'Non. Le premier temps invalide est indiqué et le plan reste modifiable.', 'La progression passe-t-elle entre navigateurs ?', 'Non. La progression actuelle est enregistrée localement dans ce navigateur.'
  ],
  de: [
    'Plane 30 eigene Choreografie-Bühnen für einen Roboterwelpen aus Blöcken und seinen Fuchspartner.', 'Anleitung zum WeightPlay-Originalspiel', 'Spielweise', 'Rätsel zur räumlichen Planung', 'Genre', 'Rätsel · Planung · Familie', 'So wird gespielt',
    'Wähle einen Darsteller und einen Takt und setze dann eine Bewegung oder Aktion.', 'Plane beide Wege gemeinsam und probe die Formation.', 'Bearbeite den ersten ungültigen Takt und versuche es erneut. Dein Plan bleibt erhalten.',
    'Regeln', 'Bleibe auf der Bühne, meide gesperrte Felder und stelle die beiden Darsteller nie auf dasselbe Feld. Manche Finalen verlangen, dass sich beide im letzten Takt verbeugen.',
    'Fortschritt und Wiederholung', 'Schließe eine Bühne ab, um zu speichern und die nächste zu öffnen. Freigeschaltete Bühnen sind erneut spielbar. Nach Bühne 2, 3 oder 6 kannst du den optionalen Rampenlicht-Mix mit vertauschten Zielen versuchen.',
    'Datenschutz und Einstellungen', 'Der Fortschritt bleibt in diesem Browser. Ein Konto ist nicht nötig. Sprache und Ton wählst du in den gemeinsamen Einstellungen.', 'Häufige Fragen',
    'Ist das ein Gedächtnisspiel?', 'Nein. Du planst Wege und Aktionen für zwei Darsteller auf einer sichtbaren Taktleiste.', 'Geht bei einem Probenfehler Fortschritt verloren?', 'Nein. Der erste ungültige Takt wird angezeigt und der Aktionsplan bleibt bearbeitbar.', 'Wird der Fortschritt zwischen Browsern übertragen?', 'Nein. Der aktuelle Fortschritt wird lokal in diesem Browser gespeichert.'
  ],
  it: [
    'Pianifica 30 scenari coreografici originali per un cucciolo robot a blocchi e il suo compagno volpe.', 'Guida al gioco originale WeightPlay', 'Meccanica', 'Rompicapo di pianificazione spaziale', 'Genere', 'Rompicapo · Pianificazione · Famiglia', 'Come giocare',
    'Scegli un artista e una battuta, poi inserisci un movimento o un’azione.', 'Pianifica insieme i due percorsi e prova la formazione.', 'Correggi la prima battuta non valida e riprova; il piano rimane disponibile.',
    'Regole', 'Resta sul palco, evita le caselle bloccate e non mettere mai entrambi gli artisti sulla stessa casella. Alcuni finali richiedono che entrambi si inchinino all’ultima battuta.',
    'Progressi e rigioco', 'Completa uno scenario per salvare e aprire il successivo. Puoi ripetere qualsiasi scenario sbloccato. Dopo gli scenari 2, 3 o 6, prova il Mix dei riflettori facoltativo con obiettivi scambiati.',
    'Privacy e impostazioni', 'I progressi restano in questo browser. Non serve un account. Usa le impostazioni condivise per scegliere lingua e audio.', 'Domande frequenti',
    'È un gioco di memoria?', 'No. Pianifichi percorsi e azioni per due artisti su una griglia di battute visibile.', 'Un errore nella prova cancella i progressi?', 'No. Viene mostrata la prima battuta non valida e il piano resta modificabile.', 'I progressi si trasferiscono tra browser?', 'No. I progressi attuali vengono salvati localmente in questo browser.'
  ],
  ru: [
    'Спланируйте 30 оригинальных танцевальных сцен для блочного робощенка и его напарника-лиса.', 'Руководство к оригинальной игре WeightPlay', 'Механика', 'Пространственная головоломка', 'Жанр', 'Головоломка · Планирование · Семейная', 'Как играть',
    'Выберите исполнителя и такт, затем задайте перемещение или действие.', 'Планируйте оба маршрута вместе и репетируйте построение.', 'Исправьте первый недопустимый такт и повторите попытку: план сохранится.',
    'Правила', 'Оставайтесь на сцене, обходите закрытые клетки и никогда не ставьте обоих исполнителей на одну клетку. В некоторых финалах оба должны поклониться на последнем такте.',
    'Прогресс и повторная игра', 'Пройдите сцену, чтобы сохранить результат и открыть следующую. Любую открытую сцену можно повторить. После сцен 2, 3 или 6 доступен необязательный «Микс софитов» с обменом целями.',
    'Конфиденциальность и настройки', 'Прогресс остается в этом браузере. Учетная запись не нужна. Язык и звук выбираются в общих настройках.', 'Частые вопросы',
    'Это игра на память?', 'Нет. Вы планируете маршруты и действия двух исполнителей на видимой сетке тактов.', 'Ошибка на репетиции стирает прогресс?', 'Нет. Игра показывает первый недопустимый такт, а план остается доступным для правки.', 'Переносится ли прогресс между браузерами?', 'Нет. Текущий прогресс хранится локально в этом браузере.'
  ],
  hi: [
    'ब्लॉक से बने रोबोट पिल्ले और उसके लोमड़ी साथी के लिए 30 मौलिक नृत्य मंचों की योजना बनाएं।', 'WeightPlay मौलिक गेम गाइड', 'खेल का तरीका', 'स्थानिक योजना पहेली', 'श्रेणी', 'पहेली · योजना · परिवार', 'कैसे खेलें',
    'कलाकार और ताल चुनें, फिर चाल या क्रिया रखें।', 'दोनों रास्तों की साथ में योजना बनाएं और गठन का अभ्यास करें।', 'पहली अमान्य ताल सुधारकर फिर कोशिश करें; आपकी योजना बनी रहती है।',
    'नियम', 'मंच के भीतर रहें, बंद खानों से बचें और दोनों कलाकारों को कभी एक ही खाने में न रखें। कुछ समापनों में आखिरी ताल पर दोनों कलाकारों का झुककर अभिवादन करना जरूरी है।',
    'प्रगति और दोबारा खेलना', 'मंच पूरा करने पर प्रगति सहेजी जाती है और अगला मंच खुलता है। किसी भी खुले मंच को फिर खेलें। मंच 2, 3 या 6 पूरा करने के बाद बदले हुए लक्ष्यों वाला वैकल्पिक स्पॉटलाइट मिक्स आजमाएं।',
    'गोपनीयता और सेटिंग', 'प्रगति इसी ब्राउज़र में रहती है। खाते की जरूरत नहीं है। भाषा और ध्वनि चुनने के लिए साझा सेटिंग नियंत्रण का उपयोग करें।', 'अक्सर पूछे जाने वाले प्रश्न',
    'क्या यह याददाश्त का खेल है?', 'नहीं। आप दिखाई देने वाले ताल बोर्ड पर दो कलाकारों के रास्ते और क्रियाएं तय करते हैं।', 'क्या अभ्यास की गलती से प्रगति मिटती है?', 'नहीं। पहली अमान्य ताल दिखाई जाती है और क्रिया योजना संपादित की जा सकती है।', 'क्या प्रगति दूसरे ब्राउज़र में जाती है?', 'नहीं। मौजूदा प्रगति इसी ब्राउज़र में स्थानीय रूप से सहेजी जाती है।'
  ],
  ar: [
    'خطط لثلاثين مسرحًا أصليًا لتصميم الرقص لجرو آلي من المكعبات وشريكه الثعلب.', 'دليل لعبة WeightPlay الأصلية', 'طريقة اللعب', 'لغز تخطيط مكاني', 'النوع', 'ألغاز · تخطيط · عائلي', 'كيفية اللعب',
    'اختر المؤدي والإيقاع، ثم ضع حركة أو فعلًا.', 'خطط للمسارين معًا وتدرّب على التشكيل.', 'عدّل أول إيقاع غير صالح وحاول مجددًا؛ تبقى خطتك متاحة.',
    'القواعد', 'ابق على المسرح وتجنب الخانات المحجوبة، ولا تضع المؤديين في الخانة نفسها أبدًا. تتطلب بعض النهايات أن ينحني المؤديان في الإيقاع الأخير.',
    'التقدم وإعادة اللعب', 'أكمل المسرح لحفظ التقدم وفتح التالي. يمكنك إعادة أي مسرح مفتوح. بعد إكمال المسرح 2 أو 3 أو 6، جرّب مزيج الأضواء الاختياري مع تبادل الأهداف.',
    'الخصوصية والإعدادات', 'يبقى التقدم في هذا المتصفح ولا يلزم حساب. استخدم الإعدادات المشتركة لاختيار اللغة والصوت.', 'الأسئلة الشائعة',
    'هل هذه لعبة ذاكرة؟', 'لا. تخطط لمسارات وأفعال مؤديين على لوحة إيقاع ظاهرة.', 'هل يضيع التقدم بسبب خطأ في التدريب؟', 'لا. يظهر أول إيقاع غير صالح وتبقى خطة الأفعال قابلة للتعديل.', 'هل ينتقل التقدم بين المتصفحات؟', 'لا. يُحفظ التقدم الحالي محليًا في هذا المتصفح.'
  ]
};
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export function guideCopy(locale){return copy[locale]||copy.en}
export function renderGuide(locale) {
  const rows = copy[locale], title = titles[locale];
  if (!rows || rows.length !== 23 || !title) throw new Error(`ROBOT_GUIDE_LOCALE_MISSING: ${locale}`);
  const c = rows.map(escape), name = escape(title), t=showText(locale);
  return `<section id="gameGuide" data-runtime-localize="off" class="game-page-info game-page-info-static" data-screen="main" data-wp-game-guide data-wp-guide-renderer="guide.mjs#renderGuide" data-wp-guide-locale="${escape(locale)}" aria-label="${name} — ${c[1]}">
    <div class="game-info-hero"><div class="game-info-title"><span class="game-info-kicker">${c[1]}</span><h2>${name}</h2><p>${c[0]}</p></div><div class="game-info-facts"><div class="game-info-fact"><span>${c[2]}</span><strong>${c[3]}</strong></div><div class="game-info-fact"><span>${c[4]}</span><strong>${c[5]}</strong></div></div></div>
    <div class="game-info-sections">
      <article class="game-info-section"><h3>${c[6]}</h3><ol><li>${c[7]}</li><li>${c[8]}</li><li>${c[9]}</li></ol></article>
      <article class="game-info-section"><h3>${c[10]}</h3><p>${c[11]}</p></article>
      <article class="game-info-section"><h3>${c[12]}</h3><p>${c[13]}</p></article>
      <article class="game-info-section"><h3>${escape(t('formationCue'))}</h3><p>${escape(t('formationRule'))}</p><ol>${Array.from({length:6},(_,i)=>`<li>${escape(t('act'+(i+1)))} · ${escape(t('lesson'+(i+1)))}</li>`).join('')}</ol></article>
      <article class="game-info-section"><h3>${escape(t('perfect'))}</h3><p>${escape(t('masteryRule'))}</p><p>${escape(t('hintAction'))}</p><p>${escape(t('defaultWaitRule'))}</p></article>
      <article class="game-info-section"><h3>${escape(t('wardrobe'))}</h3><p>${escape(t('costumeRule'))} ${escape(t('permanent'))} · 12 ${escape(t('balance'))}.</p><p>${escape(t('diamondSource'))}</p></article>
      <article class="game-info-section"><h3>${c[14]}</h3><p>${c[15]}</p></article>
      <article class="game-info-section"><h3>${c[16]}</h3><dl><div><dt>${c[17]}</dt><dd>${c[18]}</dd></div><div><dt>${c[19]}</dt><dd>${c[20]}</dd></div><div><dt>${c[21]}</dt><dd>${c[22]}</dd></div></dl></article>
    </div>
  </section>`;
}
