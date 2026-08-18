(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const KEYS = ["title","language","sound","genre","pitch","start","guideKicker","guideTitle","howTitle","how1","how2","how3","mechanicsTitle","mechanics","chooseStage","stageHint","enter","movesLabel","leftLabel","objective","hint","restart","helpText","continue","leaveTitle","leaveText","stageMap","clear","next","retry","blocked","locked","frozen","rotated","hinted","deadlock","keyFound","thawed","result","basics","interlock","walls","rotation","locksIce","mixed"];
  const PACKS = {
    en:["Arrow Escape","Language","Sound","ORDER PUZZLE","Clear every arrow block in the only safe order.","Start Game","OWNER PREVIEW · RULE-CHECK BUILD","Follow the arrow, but plan the order.","How to play","Tap a block to test its complete arrow path.","A clear block slides out; a blocked block shakes and reveals the blocker.","Remove every block. A hint marks exactly one safe move.","Thirty stages","Walls, rotating arrows, keys, ice, portals and one-way gates arrive in six teaching bands.","Choose a Stage","Swipe or scroll. Select an unlocked stage, then enter.","Enter Stage","Moves","Left","Clear every arrow block.","Hint","Restart","Only a completely clear arrow path can escape. Special tiles never choose a random outcome.","Continue","Leave this attempt?","Continue keeps the exact board. Stage Map restarts this attempt later.","Stage Map","Stage Cleared!","Next Stage","Play Again","Blocked by {target}. Remove it first.","This block is locked. Find its key.","This block is frozen. Remove an adjacent block.","Arrow rotated. Test its new path.","One safe action is highlighted.","No safe action remains. Restart this stage.","Key collected. Matching locks opened.","Adjacent ice thawed.","Cleared in {n} moves.","BASICS","INTERLOCK","WALLS","ROTATION","LOCKS + ICE","MIXED"],
    "zh-Hant":["箭頭大逃亡","語言","聲音","順序益智","依照唯一安全順序清空所有箭頭方塊。","開始遊戲","擁有者預覽 · 規則檢查版本","看清箭頭，更要安排順序。","玩法說明","點擊方塊，檢查箭頭方向的完整路徑。","路徑暢通就滑出；受阻則震動並標出阻擋物。","移除全部方塊；提示只標示一個安全動作。","三十個關卡","六個教學階段依序加入牆壁、旋轉箭頭、鑰匙、冰凍、傳送門與單向門。","選擇關卡","滑動或捲動，選擇已解鎖關卡後進入。","進入關卡","步數","剩餘","清空所有箭頭方塊。","提示","重新開始","只有整條箭頭路徑暢通才能逃出，特殊機制不會隨機決定。","繼續","要離開這次挑戰嗎？","繼續會保留目前棋盤；回關卡地圖後下次會重新開始。","關卡地圖","關卡完成！","下一關","再玩一次","路徑受阻：{target}擋住了路，請先移除它。","方塊已上鎖，請先找到鑰匙。","方塊被冰凍，請移除相鄰方塊。","箭頭已旋轉，請檢查新路徑。","已標示一個安全動作。","目前沒有安全動作，請重新開始。","取得鑰匙，對應的鎖已開啟。","相鄰冰塊已解凍。","使用 {n} 步完成。","基礎","互相阻擋","牆壁","旋轉","鎖與冰凍","混合機制"],
    "zh-Hans":["箭头大逃亡","语言","声音","顺序益智","按照唯一安全顺序清空所有箭头方块。","开始游戏","所有者预览 · 规则检查版本","看清箭头，更要安排顺序。","玩法说明","点击方块，检查箭头方向的完整路径。","路径畅通就滑出；受阻则震动并标出阻挡物。","移除全部方块；提示只标示一个安全动作。","三十个关卡","六个教学阶段依次加入墙壁、旋转箭头、钥匙、冰冻、传送门和单向门。","选择关卡","滑动或滚动，选择已解锁关卡后进入。","进入关卡","步数","剩余","清空所有箭头方块。","提示","重新开始","只有整条箭头路径畅通才能逃出，特殊机制不会随机决定。","继续","要离开这次挑战吗？","继续会保留当前棋盘；返回关卡地图后下次会重新开始。","关卡地图","关卡完成！","下一关","再玩一次","路径受阻：{target}挡住了路，请先移除它。","方块已上锁，请先找到钥匙。","方块被冻结，请移除相邻方块。","箭头已旋转，请检查新路径。","已标示一个安全动作。","当前没有安全动作，请重新开始。","取得钥匙，对应的锁已开启。","相邻冰块已解冻。","使用 {n} 步完成。","基础","互相阻挡","墙壁","旋转","锁与冰冻","混合机制"],
    ja:["アローエスケープ","言語","サウンド","順序パズル","唯一の安全な順番ですべての矢印ブロックを消そう。","ゲーム開始","オーナープレビュー · ルール確認版","矢印を見て、順番を考えよう。","遊び方","ブロックをタップして矢印の全経路を確認します。","通路が空なら脱出し、塞がると揺れて障害物を示します。","全ブロックを消去。ヒントは安全な一手だけを示します。","30ステージ","壁、回転、鍵、氷、ポータル、一方通行ゲートを6段階で学びます。","ステージ選択","スワイプして解放済みステージを選びます。","入る","手数","残り","すべての矢印ブロックを消す。","ヒント","やり直す","矢印の全経路が空の時だけ脱出できます。特殊効果はランダムではありません。","続ける","この挑戦を離れますか？","続けると盤面を維持します。マップへ戻ると次回は最初からです。","ステージマップ","ステージクリア！","次のステージ","もう一度","経路が塞がっています。{target}が先にあります。先に消してください。","ロック中です。鍵を探してください。","凍っています。隣接ブロックを消してください。","矢印が回転しました。新しい経路を確認してください。","安全な一手を表示しました。","安全な手がありません。やり直してください。","鍵を獲得し、対応するロックが開きました。","隣接する氷が溶けました。","{n}手でクリア。","基本","相互ブロック","壁","回転","鍵と氷","ミックス"],
    ko:["애로우 이스케이프","언어","소리","순서 퍼즐","유일하게 안전한 순서로 모든 화살표 블록을 제거하세요.","게임 시작","소유자 미리보기 · 규칙 점검 빌드","화살표를 보고 순서를 계획하세요.","플레이 방법","블록을 눌러 화살표의 전체 경로를 확인하세요.","경로가 비면 탈출하고, 막히면 흔들리며 방해물을 표시합니다.","모든 블록을 제거하세요. 힌트는 안전한 행동 하나만 표시합니다.","30 스테이지","벽, 회전, 열쇠, 얼음, 포털, 일방통행 문을 여섯 단계로 배웁니다.","스테이지 선택","밀거나 스크롤해 열린 스테이지를 선택하세요.","입장","이동","남음","모든 화살표 블록을 제거하세요.","힌트","다시 시작","화살표의 전체 경로가 비어야 탈출합니다. 특수 효과는 무작위가 아닙니다.","계속","이번 도전을 나갈까요?","계속하면 현재 판을 유지합니다. 맵으로 가면 다음에는 다시 시작합니다.","스테이지 맵","스테이지 완료!","다음 스테이지","다시 플레이","경로가 {target}에 막혔습니다. 먼저 제거하세요.","잠겨 있습니다. 열쇠를 찾으세요.","얼어 있습니다. 인접 블록을 제거하세요.","화살표가 회전했습니다. 새 경로를 확인하세요.","안전한 행동 하나를 표시했습니다.","안전한 행동이 없습니다. 다시 시작하세요.","열쇠를 얻어 해당 잠금을 열었습니다.","인접 얼음이 녹았습니다.","{n}번 만에 완료.","기초","상호 차단","벽","회전","자물쇠와 얼음","혼합"],
    es:["Escape de Flechas","Idioma","Sonido","PUZLE DE ORDEN","Elimina todos los bloques en el único orden seguro.","Jugar","VISTA DEL PROPIETARIO · REGLAS","Sigue la flecha y planea el orden.","Cómo jugar","Toca un bloque para comprobar toda su ruta.","Si está libre, sale; si no, vibra y marca el obstáculo.","Elimina todos. La pista marca una sola acción segura.","Treinta niveles","Muros, giros, llaves, hielo, portales y puertas de un sentido llegan en seis bloques.","Elegir nivel","Desliza y elige un nivel desbloqueado.","Entrar","Movimientos","Restantes","Elimina todos los bloques.","Pista","Reiniciar","Solo escapa con toda la ruta libre. Nada se decide al azar.","Continuar","¿Salir del intento?","Continuar conserva el tablero; volver al mapa reinicia el intento después.","Mapa","¡Nivel superado!","Siguiente","Jugar de nuevo","Ruta bloqueada por {target}. Elimínalo primero.","Está bloqueado. Busca la llave.","Está congelado. Elimina un bloque adyacente.","La flecha giró. Comprueba la nueva ruta.","Se marcó una acción segura.","No quedan acciones seguras. Reinicia.","Llave recogida. Se abrieron los candados.","El hielo adyacente se derritió.","Completado en {n} movimientos.","BÁSICO","BLOQUEO","MUROS","GIRO","LLAVES + HIELO","MIXTO"],
    "pt-BR":["Fuga das Setas","Idioma","Som","QUEBRA-CABEÇA DE ORDEM","Remova todos os blocos na única ordem segura.","Jogar","PRÉVIA DO PROPRIETÁRIO · REGRAS","Siga a seta e planeje a ordem.","Como jogar","Toque num bloco para verificar todo o caminho.","Se estiver livre, ele sai; se não, treme e marca o obstáculo.","Remova todos. A dica marca apenas uma ação segura.","Trinta fases","Paredes, giros, chaves, gelo, portais e portas de mão única chegam em seis blocos.","Escolher fase","Deslize e escolha uma fase liberada.","Entrar","Jogadas","Restam","Remova todos os blocos.","Dica","Reiniciar","Só escapa com o caminho inteiro livre. Nada é aleatório.","Continuar","Sair desta tentativa?","Continuar mantém o tabuleiro; voltar ao mapa reinicia depois.","Mapa de fases","Fase concluída!","Próxima fase","Jogar novamente","Caminho bloqueado por {target}. Remova-o primeiro.","Está trancado. Encontre a chave.","Está congelado. Remova um bloco vizinho.","A seta girou. Verifique o novo caminho.","Uma ação segura foi destacada.","Não há ação segura. Reinicie.","Chave coletada. As travas abriram.","O gelo vizinho derreteu.","Concluído em {n} jogadas.","BÁSICO","BLOQUEIO","PAREDES","GIRO","CHAVES + GELO","MISTO"],
    fr:["Évasion des flèches","Langue","Son","PUZZLE D’ORDRE","Retirez tous les blocs dans le seul ordre sûr.","Jouer","APERÇU PROPRIÉTAIRE · RÈGLES","Suivez la flèche et planifiez l’ordre.","Comment jouer","Touchez un bloc pour vérifier tout son trajet.","Libre, il sort ; bloqué, il tremble et indique l’obstacle.","Retirez tout. L’indice ne montre qu’une action sûre.","Trente niveaux","Murs, rotations, clés, glace, portails et portes à sens unique arrivent en six séries.","Choisir un niveau","Faites défiler et choisissez un niveau débloqué.","Entrer","Coups","Restants","Retirez tous les blocs.","Indice","Recommencer","Le trajet entier doit être libre. Aucun effet n’est aléatoire.","Continuer","Quitter cette tentative ?","Continuer garde le plateau ; la carte relancera l’essai plus tard.","Carte","Niveau réussi !","Niveau suivant","Rejouer","Trajet bloqué par {target}. Retirez-le d’abord.","Ce bloc est verrouillé. Trouvez la clé.","Ce bloc est gelé. Retirez un voisin.","La flèche a tourné. Vérifiez le nouveau trajet.","Une action sûre est indiquée.","Aucune action sûre. Recommencez.","Clé récupérée. Les verrous sont ouverts.","La glace voisine a fondu.","Terminé en {n} coups.","BASE","BLOCAGE","MURS","ROTATION","CLÉS + GLACE","MIXTE"],
    de:["Pfeilflucht","Sprache","Ton","REIHENFOLGE-PUZZLE","Entferne alle Blöcke in der einzigen sicheren Reihenfolge.","Spiel starten","BESITZER-VORSCHAU · REGELTEST","Folge dem Pfeil und plane die Reihenfolge.","Spielanleitung","Tippe einen Block an, um den ganzen Weg zu prüfen.","Ist er frei, gleitet er hinaus; sonst wackelt er und markiert das Hindernis.","Entferne alle. Der Tipp markiert genau eine sichere Aktion.","Dreißig Stufen","Wände, Drehpfeile, Schlüssel, Eis, Portale und Einwegtore kommen in sechs Abschnitten.","Stufe wählen","Wischen oder scrollen und eine offene Stufe wählen.","Betreten","Züge","Übrig","Entferne alle Pfeilblöcke.","Tipp","Neustart","Nur ein vollständig freier Weg führt hinaus. Nichts wird zufällig entschieden.","Fortsetzen","Versuch verlassen?","Fortsetzen bewahrt das Brett; die Karte startet den Versuch später neu.","Stufenkarte","Stufe geschafft!","Nächste Stufe","Noch einmal","Weg durch {target} blockiert. Entferne es zuerst.","Dieser Block ist gesperrt. Finde den Schlüssel.","Dieser Block ist gefroren. Entferne einen Nachbarn.","Pfeil gedreht. Prüfe den neuen Weg.","Eine sichere Aktion ist markiert.","Keine sichere Aktion. Starte neu.","Schlüssel erhalten. Passende Schlösser sind offen.","Benachbartes Eis ist geschmolzen.","In {n} Zügen geschafft.","BASIS","SPERREN","WÄNDE","DREHUNG","SCHLÜSSEL + EIS","GEMISCHT"],
    it:["Fuga delle frecce","Lingua","Audio","PUZZLE D’ORDINE","Rimuovi tutti i blocchi nell’unico ordine sicuro.","Gioca","ANTEPRIMA PROPRIETARIO · REGOLE","Segui la freccia e pianifica l’ordine.","Come giocare","Tocca un blocco per controllare l’intero percorso.","Se è libero esce; se è bloccato vibra e indica l’ostacolo.","Rimuovi tutto. Il suggerimento mostra una sola azione sicura.","Trenta livelli","Muri, rotazioni, chiavi, ghiaccio, portali e porte a senso unico arrivano in sei gruppi.","Scegli livello","Scorri e scegli un livello sbloccato.","Entra","Mosse","Rimasti","Rimuovi tutti i blocchi.","Suggerimento","Ricomincia","Esce solo con il percorso interamente libero. Nulla è casuale.","Continua","Lasciare il tentativo?","Continua conserva la griglia; la mappa riavvia il tentativo più tardi.","Mappa","Livello completato!","Livello successivo","Gioca ancora","Percorso bloccato da {target}. Rimuovilo prima.","È bloccato. Trova la chiave.","È congelato. Rimuovi un blocco vicino.","La freccia ha ruotato. Controlla il nuovo percorso.","È evidenziata un’azione sicura.","Nessuna azione sicura. Ricomincia.","Chiave raccolta. I lucchetti si sono aperti.","Il ghiaccio vicino si è sciolto.","Completato in {n} mosse.","BASE","BLOCCHI","MURI","ROTAZIONE","CHIAVI + GHIACCIO","MISTO"],
    ru:["Побег стрелок","Язык","Звук","ГОЛОВОЛОМКА НА ПОРЯДОК","Уберите все блоки в единственно безопасном порядке.","Начать игру","ПРЕДПРОСМОТР ВЛАДЕЛЬЦА · ПРОВЕРКА ПРАВИЛ","Следуйте стрелке и планируйте порядок.","Как играть","Нажмите блок, чтобы проверить весь путь стрелки.","Если путь свободен, блок уйдёт; иначе он дрожит и показывает препятствие.","Уберите всё. Подсказка отмечает только одно безопасное действие.","Тридцать этапов","Стены, повороты, ключи, лёд, порталы и односторонние двери вводятся в шести частях.","Выбор этапа","Листайте и выберите открытый этап.","Войти","Ходы","Осталось","Уберите все блоки.","Подсказка","Заново","Весь путь должен быть свободен. Случайных решений нет.","Продолжить","Покинуть попытку?","Продолжение сохранит доску; карта перезапустит попытку позже.","Карта этапов","Этап пройден!","Следующий этап","Ещё раз","Путь заблокирован: {target}. Сначала уберите его.","Блок заперт. Найдите ключ.","Блок заморожен. Уберите соседний блок.","Стрелка повернулась. Проверьте новый путь.","Отмечено одно безопасное действие.","Безопасных действий нет. Начните заново.","Ключ получен. Замки открыты.","Соседний лёд растаял.","Пройдено за {n} ходов.","ОСНОВЫ","БЛОКИРОВКА","СТЕНЫ","ПОВОРОТ","КЛЮЧИ + ЛЁД","СМЕШАННО"],
    hi:["एरो एस्केप","भाषा","ध्वनि","क्रम पहेली","सभी तीर ब्लॉक केवल सुरक्षित क्रम में हटाएँ।","खेल शुरू करें","मालिक पूर्वावलोकन · नियम जाँच","तीर देखें और क्रम की योजना बनाएँ।","कैसे खेलें","पूरे तीर मार्ग को जाँचने के लिए ब्लॉक दबाएँ।","रास्ता साफ हो तो ब्लॉक निकलता है; रुकने पर काँपकर बाधा दिखाता है।","सभी ब्लॉक हटाएँ। संकेत केवल एक सुरक्षित चाल दिखाता है।","तीस चरण","दीवार, घूमते तीर, चाबी, बर्फ, पोर्टल और एकतरफा द्वार छह भागों में आते हैं।","चरण चुनें","स्क्रॉल करके खुला चरण चुनें।","प्रवेश","चालें","शेष","सभी तीर ब्लॉक हटाएँ।","संकेत","फिर शुरू","पूरा रास्ता साफ होने पर ही निकास है। कोई परिणाम यादृच्छिक नहीं है।","जारी रखें","यह प्रयास छोड़ें?","जारी रखने पर बोर्ड बचा रहेगा; नक्शे पर लौटने से अगली बार प्रयास फिर शुरू होगा।","चरण नक्शा","चरण पूरा!","अगला चरण","फिर खेलें","रास्ता {target} से रुका है। पहले उसे हटाएँ।","ब्लॉक बंद है। चाबी खोजें।","ब्लॉक जमा है। पास का ब्लॉक हटाएँ।","तीर घूम गया। नया रास्ता जाँचें।","एक सुरक्षित चाल दिखाई गई।","कोई सुरक्षित चाल नहीं। फिर शुरू करें।","चाबी मिली। संबंधित ताले खुल गए।","पास की बर्फ पिघल गई।","{n} चालों में पूरा।","मूल","आपसी रोक","दीवारें","घुमाव","चाबी + बर्फ","मिश्रित"],
    ar:["هروب الأسهم","اللغة","الصوت","لغز الترتيب","أزل كل كتل الأسهم بالترتيب الآمن الوحيد.","ابدأ اللعب","معاينة المالك · فحص القواعد","اتبع السهم وخطط للترتيب.","طريقة اللعب","اضغط كتلة لفحص مسار السهم كاملاً.","إذا كان خالياً تنزلق للخارج، وإن كان مسدوداً تهتز وتحدد العائق.","أزل الجميع. يحدد التلميح حركة آمنة واحدة فقط.","ثلاثون مرحلة","تظهر الجدران والدوران والمفاتيح والجليد والبوابات في ست مجموعات تعليمية.","اختر مرحلة","مرر واختر مرحلة مفتوحة.","دخول","الحركات","المتبقي","أزل كل كتل الأسهم.","تلميح","إعادة","لا تخرج الكتلة إلا إذا كان المسار كاملاً خالياً. لا توجد نتائج عشوائية.","متابعة","مغادرة المحاولة؟","المتابعة تحفظ اللوحة؛ خريطة المراحل تعيد المحاولة لاحقاً.","خريطة المراحل","اكتملت المرحلة!","المرحلة التالية","العب مجدداً","المسار مسدود بسبب {target}. أزله أولاً.","الكتلة مقفلة. ابحث عن المفتاح.","الكتلة مجمدة. أزل كتلة مجاورة.","دار السهم. افحص المسار الجديد.","تم تحديد حركة آمنة واحدة.","لا توجد حركة آمنة. أعد المرحلة.","جُمِع المفتاح وفُتحت الأقفال المطابقة.","ذاب الجليد المجاور.","اكتملت في {n} حركة.","الأساسيات","التعطيل","الجدران","الدوران","المفاتيح والجليد","مختلط"]
  };
  const NAMES={en:"English","zh-Hant":"繁體中文","zh-Hans":"简体中文",ja:"日本語",ko:"한국어",es:"Español","pt-BR":"Português",fr:"Français",de:"Deutsch",it:"Italiano",ru:"Русский",hi:"हिन्दी",ar:"العربية"};
  const PATH_LOCALES={en:"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  function routeLocale(){const match=location.pathname.match(/^\/([^/]+)\/games\/arrow-escape\//);return PATH_LOCALES[match?.[1]?.toLowerCase()]||localStorage.getItem("wpLang")||"en";}
  const I18N=Object.fromEntries(Object.entries(PACKS).map(([locale,values])=>[locale,Object.fromEntries(KEYS.map((key,index)=>[key,values[index]]))]));
  const resultPlural=(locale,n)=>{try{return new Intl.PluralRules(locale).select(n);}catch{return n===1?"one":"other";}};
  const resultForm=(locale,n,forms)=>forms[resultPlural(locale,n)]||forms.other||forms.one;
  const resultRussianMoves=n=>resultForm("ru",n,{one:`${n} ход`,few:`${n} хода`,many:`${n} ходов`,other:`${n} хода`});
  const resultRussianBlocked=n=>resultForm("ru",n,{one:`${n} заблокированное нажатие`,few:`${n} заблокированных нажатия`,many:`${n} заблокированных нажатий`,other:`${n} заблокированных нажатия`});
  const resultArabicMoves=n=>resultForm("ar",n,{zero:"لا حركات",one:"حركة واحدة",two:"حركتان",few:`${n} حركات`,many:`${n} حركة`,other:`${n} حركة`});
  const resultArabicBlocked=n=>resultForm("ar",n,{zero:"من دون ضغطات معطلة",one:"ضغطة معطلة واحدة",two:"ضغطتان معطلتان",few:`${n} ضغطات معطلة`,many:`${n} ضغطة معطلة`,other:`${n} ضغطة معطلة`});
  const RESULT_SUMMARY_COPY={
    en:n=>`Cleared in ${n} ${resultForm("en",n,{one:"move",other:"moves"})}.`,
    "zh-Hant":n=>`${n} 步完成。`,
    "zh-Hans":n=>`${n} 步完成。`,
    ja:n=>`${n}手でクリア。`,
    ko:n=>`${n}번 만에 완료.`,
    es:n=>`Completado en ${n} ${resultForm("es",n,{one:"movimiento",other:"movimientos"})}.`,
    "pt-BR":n=>`Concluído em ${n} ${resultForm("pt-BR",n,{one:"jogada",other:"jogadas"})}.`,
    fr:n=>`Terminé en ${n} ${resultForm("fr",n,{one:"mouvement",other:"mouvements"})}.`,
    de:n=>`In ${n} ${resultForm("de",n,{one:"Zug",other:"Zügen"})} geschafft.`,
    it:n=>`Completato in ${n} ${resultForm("it",n,{one:"mossa",other:"mosse"})}.`,
    ru:n=>`Пройдено за ${resultRussianMoves(n)}.`,
    hi:n=>`${n} ${resultForm("hi",n,{one:"चाल",other:"चालों"})} में पूरा।`,
    ar:n=>`اكتملت المرحلة في ${resultArabicMoves(n)}.`
  };
  const RESULT_CLEAN_COPY={
    en:{clean:n=>`Clean order: ${n} ${resultForm("en",n,{one:"move",other:"moves"})} with no blocked taps.`,messy:(n,b)=>`${n} ${resultForm("en",n,{one:"move",other:"moves"})}, ${b} ${resultForm("en",b,{one:"blocked tap",other:"blocked taps"})}. Replay for a cleaner order.`},
    "zh-Hant":{clean:n=>`俐落順序：${n} 步完成，沒有受阻點擊。`,messy:(n,b)=>`${n} 步完成，受阻點擊 ${b} 次。再玩一次，挑戰更俐落的順序。`},
    "zh-Hans":{clean:n=>`利落顺序：${n} 步完成，没有受阻点击。`,messy:(n,b)=>`${n} 步完成，受阻点击 ${b} 次。再玩一次，挑战更利落的顺序。`},
    ja:{clean:n=>`きれいな順序：${n}手、ブロックされたタップなし。`,messy:(n,b)=>`${n}手、ブロックされたタップ ${b} 回。もう一度、よりきれいな順序を試そう。`},
    ko:{clean:n=>`깔끔한 순서: 막힌 탭 없이 ${n}번 만에 완료.`,messy:(n,b)=>`${n}번 만에 완료, 막힌 탭 ${b}회. 다시 플레이해 더 깔끔한 순서를 찾아보세요.`},
    es:{clean:n=>`Orden limpio: ${n} ${resultForm("es",n,{one:"movimiento",other:"movimientos"})} sin toques bloqueados.`,messy:(n,b)=>`${n} ${resultForm("es",n,{one:"movimiento",other:"movimientos"})} y ${b} ${resultForm("es",b,{one:"toque bloqueado",other:"toques bloqueados"})}. Repite para encontrar un orden más limpio.`},
    "pt-BR":{clean:n=>`Ordem limpa: ${n} ${resultForm("pt-BR",n,{one:"jogada",other:"jogadas"})} sem toques bloqueados.`,messy:(n,b)=>`${n} ${resultForm("pt-BR",n,{one:"jogada",other:"jogadas"})} e ${b} ${resultForm("pt-BR",b,{one:"toque bloqueado",other:"toques bloqueados"})}. Jogue novamente para buscar uma ordem mais limpa.`},
    fr:{clean:n=>`Ordre nette : ${n} ${resultForm("fr",n,{one:"mouvement",other:"mouvements"})} sans touche bloquée.`,messy:(n,b)=>`${n} ${resultForm("fr",n,{one:"mouvement",other:"mouvements"})} et ${b} ${resultForm("fr",b,{one:"touche bloquée",other:"touches bloquées"})}. Rejouez pour trouver un ordre plus net.`},
    de:{clean:n=>`Saubere Reihenfolge: ${n} ${resultForm("de",n,{one:"Zug",other:"Züge"})} ohne blockierte Versuche.`,messy:(n,b)=>`${n} ${resultForm("de",n,{one:"Zug",other:"Züge"})}, ${b} ${resultForm("de",b,{one:"blockierter Versuch",other:"blockierte Versuche"})}. Spiele erneut für eine sauberere Reihenfolge.`},
    it:{clean:n=>`Ordine pulito: ${n} ${resultForm("it",n,{one:"mossa",other:"mosse"})} senza tocchi bloccati.`,messy:(n,b)=>`${n} ${resultForm("it",n,{one:"mossa",other:"mosse"})} e ${b} ${resultForm("it",b,{one:"tocco bloccato",other:"tocchi bloccati"})}. Rigioca per trovare un ordine più pulito.`},
    ru:{clean:n=>`Чистый порядок: ${resultRussianMoves(n)} без заблокированных нажатий.`,messy:(n,b)=>`${resultRussianMoves(n)}, ${resultRussianBlocked(b)}. Сыграйте ещё раз ради более чистого порядка.`},
    hi:{clean:n=>`साफ़ क्रम: ${n} ${resultForm("hi",n,{one:"चाल",other:"चालों"})} में पूरा, बिना बाधित टैप के.`,messy:(n,b)=>`${n} ${resultForm("hi",n,{one:"चाल",other:"चालें"})}, ${b} बाधित टैप। फिर खेलकर और साफ़ क्रम आज़माएँ।`},
    ar:{clean:n=>`ترتيب نظيف: اكتملت بـ${resultArabicMoves(n)}، من دون ضغطات معطلة.`,messy:(n,b)=>`اكتملت بـ${resultArabicMoves(n)}، مع ${resultArabicBlocked(b)}. أعد اللعب لتجربة ترتيب أنظف.`}
  };
  const PREVIEW_PACKS={
    en:["New mechanic preview","Got it","Basics: a block escapes only when its full arrow path is clear. Plan the order before you move.","Interlock: one arrow can hide behind another. Follow the full ray and remove the first blocker.","Walls: fixed cells stop a ray even when no arrow is there. Read beyond the nearest block.","Rotation: this arrow turns once clockwise when tapped. Check its new direction before the next move.","Locks + ice: keys open matching locks; removing a neighbor thaws frozen blocks.","Mixed: portals continue a ray and one-way gates allow only their shown direction. Read both before moving."],
    "zh-Hant":["新機制預覽","知道了","基礎：方塊只有在完整箭頭路徑暢通時才能逃出。移動前先規劃順序。","互相阻擋：一支箭頭可能藏在另一支後面。沿完整路徑檢查，先移除第一個阻擋物。","牆壁：固定格子即使沒有箭頭也會擋住路徑。不要只看最近的方塊。","旋轉：點擊後這支箭頭會順時針旋轉一次。選下一步前先檢查新方向。","鎖與冰凍：鑰匙會打開相同標記的鎖；移除相鄰方塊會解凍冰塊。","混合機制：傳送門會延續路徑，單向門只允許顯示的方向。移動前兩者都要確認。"],
    "zh-Hans":["新机制预览","知道了","基础：方块只有在完整箭头路径畅通时才能逃出。移动前先规划顺序。","互相阻挡：一支箭头可能藏在另一支后面。沿完整路径检查，先移除第一个阻挡物。","墙壁：固定格子即使没有箭头也会挡住路径。不要只看最近的方块。","旋转：点击后这支箭头会顺时针旋转一次。选择下一步前先检查新方向。","锁与冰冻：钥匙会打开相同标记的锁；移除相邻方块会解冻冰块。","混合机制：传送门会延续路径，单向门只允许显示的方向。移动前两者都要确认。"],
    ja:["新しいギミック","了解","基本：矢印の全経路が空いている時だけブロックは脱出します。動く前に順番を考えましょう。","相互ブロック：矢印の後ろに別の矢印が隠れることがあります。全経路を見て最初の障害を消しましょう。","壁：矢印がなくても固定マスは経路を止めます。手前のブロックだけで判断しないでください。","回転：この矢印はタップすると一度だけ時計回りに回ります。次の手の前に新しい向きを確認しましょう。","鍵と氷：鍵は同じ印のロックを開き、隣のブロックを消すと凍ったブロックが解けます。","ミックス：ポータルは経路を続け、一方通行ゲートは示された向きだけを通します。両方を確認して動きましょう。"],
    ko:["새 규칙 미리보기","알겠어요","기초: 화살표의 전체 경로가 비어 있어야 블록이 탈출합니다. 움직이기 전에 순서를 계획하세요.","상호 차단: 화살표 뒤에 다른 화살표가 숨을 수 있습니다. 전체 경로를 따라 첫 방해물을 제거하세요.","벽: 화살표가 없어도 고정 칸은 경로를 막습니다. 가장 가까운 블록 너머를 확인하세요.","회전: 이 화살표는 누르면 시계 방향으로 한 번만 돕니다. 다음 행동 전에 새 방향을 확인하세요.","자물쇠와 얼음: 열쇠는 같은 표시의 잠금을 열고, 이웃 블록을 제거하면 얼어붙은 블록이 녹습니다.","혼합: 포털은 경로를 이어 주고 일방통행 문은 표시된 방향만 허용합니다. 둘 다 확인하고 움직이세요."],
    es:["Vista previa de la nueva regla","Entendido","Básico: un bloque escapa solo cuando toda su ruta está libre. Planea el orden antes de moverlo.","Bloqueo: una flecha puede ocultarse detrás de otra. Sigue toda la ruta y quita el primer obstáculo.","Muros: una casilla fija detiene la ruta aunque no tenga una flecha. Mira más allá del bloque cercano.","Giro: esta flecha gira una vez en sentido horario al tocarla. Comprueba su nueva dirección antes del siguiente movimiento.","Llaves y hielo: las llaves abren cerraduras iguales; quitar un vecino descongela los bloques de hielo.","Mixto: los portales continúan la ruta y las puertas de un sentido solo dejan pasar en la dirección indicada. Comprueba ambos antes de mover."],
    "pt-BR":["Prévia da nova regra","Entendi","Básico: um bloco só escapa quando todo o caminho está livre. Planeje a ordem antes de mover.","Bloqueio: uma seta pode ficar escondida atrás de outra. Siga todo o caminho e remova o primeiro obstáculo.","Paredes: uma casa fixa interrompe o caminho mesmo sem uma seta. Olhe além do bloco mais próximo.","Giro: esta seta gira uma vez no sentido horário ao ser tocada. Confira a nova direção antes da próxima jogada.","Chaves e gelo: chaves abrem travas iguais; remover um vizinho descongela os blocos de gelo.","Misto: portais continuam o caminho e portas de mão única permitem apenas a direção mostrada. Confira os dois antes de mover."],
    fr:["Aperçu de la nouvelle règle","Compris","Base : un bloc ne sort que si tout son trajet est libre. Planifiez l’ordre avant de bouger.","Blocage : une flèche peut être cachée derrière une autre. Suivez tout le trajet et retirez le premier obstacle.","Murs : une case fixe arrête le trajet même sans flèche. Regardez au-delà du bloc proche.","Rotation : cette flèche tourne une fois dans le sens horaire quand vous la touchez. Vérifiez sa nouvelle direction avant le prochain coup.","Clés et glace : les clés ouvrent les verrous correspondants ; retirer un voisin dégèle les blocs de glace.","Mixte : les portails prolongent le trajet et les portes à sens unique n’acceptent que leur direction. Vérifiez les deux avant de bouger."],
    de:["Vorschau auf die neue Regel","Verstanden","Basis: Ein Block entkommt nur, wenn sein kompletter Pfeilweg frei ist. Plane die Reihenfolge vor dem Zug.","Sperren: Hinter einem Pfeil kann ein weiterer verborgen sein. Folge dem ganzen Weg und entferne das erste Hindernis.","Wände: Ein festes Feld stoppt den Weg auch ohne Pfeil. Sieh über den nächsten Block hinaus.","Drehung: Dieser Pfeil dreht sich beim Antippen einmal im Uhrzeigersinn. Prüfe die neue Richtung vor dem nächsten Zug.","Schlüssel und Eis: Schlüssel öffnen passende Schlösser; ein Nachbarzug taut gefrorene Blöcke auf.","Gemischt: Portale setzen den Weg fort, Einwegtore erlauben nur ihre angezeigte Richtung. Prüfe beides vor dem Zug."],
    it:["Anteprima della nuova regola","Capito","Base: un blocco esce solo quando tutto il suo percorso è libero. Pianifica l’ordine prima di muovere.","Blocco: una freccia può nascondersi dietro un’altra. Segui tutto il percorso e rimuovi il primo ostacolo.","Muri: una casella fissa ferma il percorso anche senza una freccia. Guarda oltre il blocco vicino.","Rotazione: questa freccia gira una volta in senso orario quando la tocchi. Controlla la nuova direzione prima della prossima mossa.","Chiavi e ghiaccio: le chiavi aprono i lucchetti corrispondenti; rimuovere un vicino scioglie i blocchi di ghiaccio.","Misto: i portali continuano il percorso e le porte a senso unico consentono solo la direzione mostrata. Controlla entrambi prima di muovere."],
    ru:["Предпросмотр нового правила","Понятно","Основы: блок выходит только при полностью свободном пути стрелки. Планируйте порядок до хода.","Блокировка: за одной стрелкой может скрываться другая. Проверьте весь путь и уберите первый блокирующий элемент.","Стены: неподвижная клетка останавливает путь даже без стрелки. Смотрите дальше ближайшего блока.","Поворот: при нажатии эта стрелка один раз повернётся по часовой стрелке. Проверьте новое направление перед следующим ходом.","Ключи и лёд: ключи открывают подходящие замки; удаление соседнего блока растапливает лёд.","Смешанное: порталы продолжают путь, а односторонние двери пропускают только в указанном направлении. Проверьте оба правила."],
    hi:["नए नियम का पूर्वावलोकन","समझ गया","मूल: ब्लॉक तभी निकलता है जब उसका पूरा तीर मार्ग साफ हो। चाल से पहले क्रम की योजना बनाएँ।","आपसी रोक: एक तीर दूसरे के पीछे छिप सकता है। पूरे मार्ग को देखें और पहली बाधा हटाएँ।","दीवारें: स्थिर खाना तीर के बिना भी मार्ग रोकता है। निकटतम ब्लॉक के आगे भी देखें।","घुमाव: दबाने पर यह तीर घड़ी की दिशा में केवल एक बार घूमता है। अगली चाल से पहले नई दिशा जाँचें।","चाबी और बर्फ: चाबी मिलते ताले खोलती है; पड़ोसी ब्लॉक हटाने से जमे ब्लॉक पिघलते हैं।","मिश्रित: पोर्टल मार्ग को आगे बढ़ाते हैं और एकतरफा द्वार केवल दिखी दिशा की अनुमति देते हैं। दोनों नियम देखकर चलें।"],
    ar:["معاينة القاعدة الجديدة","فهمت","الأساسيات: لا تخرج الكتلة إلا إذا كان مسار سهمها كاملاً خالياً. خطط للترتيب قبل الحركة.","التعطيل: قد يختبئ سهم خلف سهم آخر. اتبع المسار كاملاً وأزل أول عائق.","الجدران: الخلية الثابتة توقف المسار حتى من دون سهم. انظر إلى ما بعد الكتلة الأقرب.","الدوران: يدور هذا السهم مرة واحدة مع عقارب الساعة عند الضغط عليه. افحص اتجاهه الجديد قبل الحركة التالية.","المفاتيح والجليد: تفتح المفاتيح الأقفال المطابقة؛ إزالة كتلة مجاورة تذيب الكتل المجمدة.","مختلط: تواصل البوابات مسار السهم، ولا تسمح البوابات ذات الاتجاه الواحد إلا بالاتجاه الظاهر. افحص القاعدتين قبل الحركة."]
  };
  const DIRS={U:[-1,0],R:[0,1],D:[1,0],L:[0,-1]},GLYPH={U:"↑",R:"→",D:"↓",L:"←"},TURN={U:"R",R:"D",D:"L",L:"U"};
  const BLOCKER_TARGETS={en:{block:"arrow",wall:"wall",gate:"one-way gate"},"zh-Hant":{block:"箭頭",wall:"牆",gate:"單向門"},"zh-Hans":{block:"箭头",wall:"墙",gate:"单向门"},ja:{block:"矢印",wall:"壁",gate:"一方通行ゲート"},ko:{block:"화살표",wall:"벽",gate:"일방통행 문"},es:{block:"flecha",wall:"muro",gate:"puerta de un sentido"},"pt-BR":{block:"seta",wall:"parede",gate:"porta de mão única"},fr:{block:"flèche",wall:"mur",gate:"porte à sens unique"},de:{block:"Pfeil",wall:"Wand",gate:"Einwegtor"},it:{block:"freccia",wall:"muro",gate:"porta a senso unico"},ru:{block:"стрелка",wall:"стена",gate:"односторонняя дверь"},hi:{block:"तीर",wall:"दीवार",gate:"एकतरफा द्वार"},ar:{block:"سهم",wall:"جدار",gate:"بوابة باتجاه واحد"}};
  // Explicit, reviewable stage catalog. Every layout is solver-validated below.
  const STAGES=[
    {
      "number": 1,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R"
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 2,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D"
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 3,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 4,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U"
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-3",
          "r": 4,
          "c": 1,
          "d": "L"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 5,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-mirror-0",
          "r": 1,
          "c": 4,
          "d": "U"
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 6,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R"
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-0",
          "r": 1,
          "c": 1,
          "d": "U"
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 7,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D"
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-1",
          "r": 1,
          "c": 4,
          "d": "R"
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 8,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-2",
          "r": 4,
          "c": 4,
          "d": "D"
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 9,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U"
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-3",
          "r": 4,
          "c": 1,
          "d": "L"
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 10,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-mirror-0",
          "r": 1,
          "c": 4,
          "d": "U"
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 11,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R"
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-0",
          "r": 1,
          "c": 1,
          "d": "U"
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        }
      ],
      "walls": [
        [
          0,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 12,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D"
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-1",
          "r": 1,
          "c": 4,
          "d": "R"
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        }
      ],
      "walls": [
        [
          0,
          5
        ],
        [
          5,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 13,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-2",
          "r": 4,
          "c": 4,
          "d": "D"
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          5,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 14,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U"
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-3",
          "r": 4,
          "c": 1,
          "d": "L"
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        }
      ],
      "walls": [
        [
          5,
          0
        ],
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 15,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-mirror-0",
          "r": 1,
          "c": 4,
          "d": "U"
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 16,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R"
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-rot-0",
          "r": 1,
          "c": 1,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        }
      ],
      "walls": [
        [
          0,
          0
        ],
        [
          5,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 17,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D"
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-rot-1",
          "r": 1,
          "c": 4,
          "d": "U",
          "rotator": true
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        }
      ],
      "walls": [
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 18,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-2",
          "r": 4,
          "c": 4,
          "d": "R",
          "rotator": true
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          5,
          5
        ],
        [
          0,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 19,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U"
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-rot-3",
          "r": 4,
          "c": 1,
          "d": "D",
          "rotator": true
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        }
      ],
      "walls": [
        [
          5,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 20,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-mirror-0",
          "r": 1,
          "c": 4,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          0,
          5
        ],
        [
          5,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 21,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R",
          "key": "amber"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R",
          "frozen": true
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R",
          "lock": "amber"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-rot-0",
          "r": 1,
          "c": 1,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        }
      ],
      "walls": [
        [
          0,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 22,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D",
          "key": "amber"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D",
          "frozen": true
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D",
          "lock": "amber"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-rot-1",
          "r": 1,
          "c": 4,
          "d": "U",
          "rotator": true
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        }
      ],
      "walls": [
        [
          0,
          5
        ],
        [
          5,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 23,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L",
          "key": "amber"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L",
          "frozen": true
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L",
          "lock": "amber"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-2",
          "r": 4,
          "c": 4,
          "d": "R",
          "rotator": true
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          5,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 24,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U",
          "key": "amber"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U",
          "frozen": true
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U",
          "lock": "amber"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-rot-3",
          "r": 4,
          "c": 1,
          "d": "D",
          "rotator": true
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        }
      ],
      "walls": [
        [
          5,
          0
        ],
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 25,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L",
          "key": "amber"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L",
          "frozen": true
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L",
          "lock": "amber"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-mirror-0",
          "r": 1,
          "c": 4,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 26,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R",
          "key": "amber"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R",
          "frozen": true
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R",
          "lock": "amber"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-rot-0",
          "r": 1,
          "c": 1,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "portal-26-0",
          "r": 1,
          "c": 5,
          "d": "L"
        }
      ],
      "walls": [
        [
          0,
          0
        ],
        [
          5,
          5
        ]
      ],
      "portals": [
        {
          "a": [
            1,
            4
          ],
          "b": [
            1,
            2
          ]
        }
      ],
      "gates": [
        {
          "r": 4,
          "c": 3,
          "d": "D"
        }
      ]
    },
    {
      "number": 27,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D",
          "key": "amber"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D",
          "frozen": true
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D",
          "lock": "amber"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-rot-1",
          "r": 1,
          "c": 4,
          "d": "U",
          "rotator": true
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "portal-27-1",
          "r": 5,
          "c": 4,
          "d": "U"
        }
      ],
      "walls": [
        [
          0,
          5
        ]
      ],
      "portals": [
        {
          "a": [
            4,
            4
          ],
          "b": [
            2,
            4
          ]
        }
      ],
      "gates": [
        {
          "r": 3,
          "c": 1,
          "d": "L"
        }
      ]
    },
    {
      "number": 28,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L",
          "key": "amber"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L",
          "frozen": true
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L",
          "lock": "amber"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-2",
          "r": 4,
          "c": 4,
          "d": "R",
          "rotator": true
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        },
        {
          "id": "portal-28-2",
          "r": 4,
          "c": 0,
          "d": "R"
        }
      ],
      "walls": [
        [
          5,
          5
        ],
        [
          0,
          0
        ]
      ],
      "portals": [
        {
          "a": [
            4,
            1
          ],
          "b": [
            4,
            3
          ]
        }
      ],
      "gates": [
        {
          "r": 1,
          "c": 2,
          "d": "U"
        }
      ]
    },
    {
      "number": 29,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U",
          "key": "amber"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U",
          "frozen": true
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U",
          "lock": "amber"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-rot-3",
          "r": 4,
          "c": 1,
          "d": "D",
          "rotator": true
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "portal-29-3",
          "r": 0,
          "c": 1,
          "d": "D"
        }
      ],
      "walls": [
        [
          5,
          0
        ]
      ],
      "portals": [
        {
          "a": [
            1,
            1
          ],
          "b": [
            3,
            1
          ]
        }
      ],
      "gates": [
        {
          "r": 2,
          "c": 4,
          "d": "R"
        }
      ]
    },
    {
      "number": 30,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L",
          "key": "amber"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L",
          "frozen": true
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L",
          "lock": "amber"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-mirror-0",
          "r": 1,
          "c": 4,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        },
        {
          "id": "portal-30-mirror-0",
          "r": 1,
          "c": 0,
          "d": "R"
        }
      ],
      "walls": [
        [
          0,
          5
        ],
        [
          5,
          0
        ]
      ],
      "portals": [
        {
          "a": [
            1,
            1
          ],
          "b": [
            1,
            3
          ]
        }
      ],
      "gates": [
        {
          "r": 4,
          "c": 2,
          "d": "D"
        }
      ]
    }
  ];
  const keyOf=(r,c)=>`${r},${c}`;
  function cloneStage(stage){return{...stage,blocks:stage.blocks.map(block=>({...block})),walls:stage.walls.map(cell=>[...cell]),portals:stage.portals.map(pair=>({a:[...pair.a],b:[...pair.b]})),gates:stage.gates.map(g=>({...g}))};}
  function portalMap(stage){const map=new Map();for(const pair of stage.portals){map.set(keyOf(...pair.a),pair.b);map.set(keyOf(...pair.b),pair.a);}return map;}
  function ray(state,block){const cells=[],portals=portalMap(state),visited=new Set();let [dr,dc]=DIRS[block.d],r=block.r+dr,c=block.c+dc;while(r>=0&&r<state.size&&c>=0&&c<state.size){const key=keyOf(r,c);if(portals.has(key)&&!visited.has(key)){visited.add(key);[r,c]=portals.get(key);r+=dr;c+=dc;continue;}cells.push([r,c]);r+=dr;c+=dc;}return cells;}
  function blocker(state,block){for(const [r,c] of ray(state,block)){if(state.walls.some(cell=>cell[0]===r&&cell[1]===c))return{r,c,type:"wall"};const other=state.blocks.find(item=>item.id!==block.id&&item.r===r&&item.c===c);if(other)return{...other,type:"block"};const gate=state.gates.find(item=>item.r===r&&item.c===c);if(gate&&gate.d!==block.d)return{...gate,type:"gate"};}return null;}
  const movable=(state,block)=>!block.lock&&!block.frozen&&!blocker(state,block);
  function actions(state){const list=[];for(const block of state.blocks){if(block.rotator)list.push({type:"rotate",id:block.id});else if(movable(state,block))list.push({type:"remove",id:block.id});}return list;}
  function applyAction(state,action){const next=cloneStage(state),block=next.blocks.find(item=>item.id===action.id);if(!block)return next;if(action.type==="rotate"){block.d=TURN[block.d];block.rotator=false;return next;}next.blocks=next.blocks.filter(item=>item.id!==block.id);if(block.key)next.blocks.forEach(item=>{if(item.lock===block.key)delete item.lock;});next.blocks.forEach(item=>{if(item.frozen&&Math.abs(item.r-block.r)+Math.abs(item.c-block.c)===1)delete item.frozen;});return next;}
  function solveStage(stage){const seen=new Set();function search(state,path){if(!state.blocks.length)return path;const signature=state.blocks.map(b=>`${b.id}:${b.d}:${!!b.rotator}:${!!b.lock}:${!!b.frozen}`).sort().join("|");if(seen.has(signature))return null;seen.add(signature);for(const action of actions(state)){const result=search(applyAction(state,action),[...path,action]);if(result)return result;}return null;}return search(cloneStage(stage),[]);}
  const SOLUTIONS=STAGES.map(solveStage);
  if(SOLUTIONS.some(solution=>!solution))throw new Error(`Arrow Escape stage validation failed: ${SOLUTIONS.map((solution,index)=>solution?null:index+1).filter(Boolean).join(",")}`);

  let locale=routeLocale(),sound=localStorage.getItem("wpSound")!=="off",unlocked=Math.max(1,Math.min(30,Number(localStorage.getItem("arrowEscapeUnlocked"))||1));
  const STAGE_CARD_POOL_SIZE=9;
  let selectedStage=unlocked,currentStage=unlocked,state=null,moves=0,blockedAttempts=0,busy=false,lastFocus=null,battleGeneration=0,pendingFeedback="",activeEscapes=new Set(),activePreviewBand=null;
  let stageWindowStart=1,stageCardPool=[],stageBrowseLogical=unlocked,stageSettleFrame=0,cancelStagePointer=()=>{};
  const PREVIEW_STORAGE_KEY="arrowEscapeMechanicPreviews-v1";
  const seenPreviewBands=new Set((localStorage.getItem(PREVIEW_STORAGE_KEY)||"").split(",").filter(Boolean));
  const DIRECT_STAGE_HINT={en:"Swipe or scroll. Tap an unlocked stage to play.","zh-Hant":"滑動選擇，點擊已解鎖關卡即可開始。","zh-Hans":"滑动选择，点击已解锁关卡即可开始。",ja:"スワイプして、解放済みのステージをタップすると開始します。",ko:"밀어서 선택한 뒤, 잠금 해제된 스테이지를 탭해 시작하세요.",es:"Desliza y toca un nivel desbloqueado para jugar.","pt-BR":"Deslize e toque em uma fase liberada para jogar.",fr:"Faites défiler puis touchez un niveau débloqué pour jouer.",de:"Wische und tippe auf eine offene Stufe, um zu spielen.",it:"Scorri e tocca un livello sbloccato per giocare.",ru:"Листайте и нажмите открытый этап, чтобы начать.",hi:"स्वाइप करें और खेलने के लिए अनलॉक चरण पर टैप करें।",ar:"اسحب ثم اضغط مرحلة مفتوحة لبدء اللعب."};
  const t=(key,vars={})=>String(key==="stageHint"?(DIRECT_STAGE_HINT[locale]||DIRECT_STAGE_HINT.en):((I18N[locale]||I18N.en)[key]||key)).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??"");
  const blockerTargetLabel=hit=>{const labels=BLOCKER_TARGETS[locale]||BLOCKER_TARGETS.en;if(hit.type==="block")return `${labels.block} ${GLYPH[hit.d]||""}`.trim();if(hit.type==="gate")return `${labels.gate} ${GLYPH[hit.d]||""}`.trim();return labels.wall;};
  function setScreen(screen){if(screen!=="stage")cancelStageMotion();document.body.dataset.screen=screen;$("mainGroup").hidden=screen!=="main";$("stageScreen").hidden=screen!=="stage";$("battleScreen").hidden=screen!=="battle";document.body.classList.toggle("is-game-playing",screen==="battle");if(screen==="stage")$("stageScreen").querySelector(".wp-stage-physical-reserve")?.setAttribute("data-wp-stage-reserve-active","");window.dispatchEvent(new Event("weightplay:stage-sync"));window.dispatchEvent(new Event("weightplay:shell-sync"));}
  function applyHelpCopy(){const copy=PREVIEW_PACKS[locale]||PREVIEW_PACKS.en;if(activePreviewBand){$("helpTitle").textContent=copy[0];$("helpText").textContent=copy[activePreviewBand+1]||copy[2];$("helpClose").textContent=copy[1];}else{$("helpTitle").textContent=t("howTitle");$("helpText").textContent=t("helpText");$("helpClose").textContent=t("continue");}}
  function applyLocale(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=t(node.dataset.i18n));document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.i18nAria)));$("localeSelect").value=locale;$("localeSelect").setAttribute("aria-label",t("language"));$("stageBack").setAttribute("aria-label",t("chooseStage"));$("battleBack").setAttribute("aria-label",t("stageMap"));$("battleHelp").setAttribute("aria-label",t("howTitle"));$("stageRail").setAttribute("aria-label",t("chooseStage"));$("board").setAttribute("aria-label",t("title"));$("guide")?.setAttribute("aria-label",t("howTitle"));document.querySelectorAll(".poster,.result-layout img").forEach(node=>node.setAttribute("alt",t("title")));applyHelpCopy();$("mainProgress").textContent=`${unlocked} / 30`;renderStageRail();if(state)renderBattle();window.dispatchEvent(new Event("wonder:locale-change"));}
  function showMechanicPreview(band){const key=String(band);if(!PREVIEW_PACKS[locale]||seenPreviewBands.has(key))return;seenPreviewBands.add(key);try{localStorage.setItem(PREVIEW_STORAGE_KEY,[...seenPreviewBands].join(","));}catch{}activePreviewBand=band;applyHelpCopy();showModal("helpModal","helpClose");}
  function restoreHelpCopy(){activePreviewBand=null;applyHelpCopy();}
  function syncSound(){for(const id of["soundToggle","stageSound"]){const button=$(id);button.textContent=sound?"🔊":"🔇";button.setAttribute("aria-pressed",String(sound));button.setAttribute("aria-label",t("sound"));}}
  const stageWindowLimit=()=>Math.max(1,STAGES.length-STAGE_CARD_POOL_SIZE+1);
  const desiredStageWindow=number=>Math.max(1,Math.min(stageWindowLimit(),Math.round(number)-Math.floor(STAGE_CARD_POOL_SIZE/2)));
  function createStageCard(poolIndex){const card=document.createElement("button");card.type="button";card.dataset.wpStagePoolNode=String(poolIndex+1);return card;}
  function bindStageCard(card,number){const stage=STAGES[number-1],locked=number>unlocked;if(!stage)return;card.className=`stage-card${locked?" is-locked":""}`;card.style.opacity=locked?".45":"";card.dataset.stage=String(number);card.dataset.stageIndex=String(number-1);card.dataset.index=String(number-1);card.setAttribute("aria-disabled",String(locked));card.setAttribute("aria-posinset",String(number));card.setAttribute("aria-setsize",String(STAGES.length));card.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End Enter Space");card.innerHTML=`<span class="stage-number">${String(number).padStart(2,"0")}</span><small>${t(["basics","interlock","walls","rotation","locksIce","mixed"][stage.band-1])}</small><strong class="stage-mechanics">${stage.blocks.length} ◈</strong>`;}
  function setCenteredStage(number){selectedStage=number;stageBrowseLogical=number;$("stageRail").querySelectorAll(".stage-card").forEach(card=>{const current=Number(card.dataset.stage)===number;card.tabIndex=current?0:-1;card.setAttribute("aria-current",String(current));});}
  function buildStagePool(){const rail=$("stageRail");stageWindowStart=desiredStageWindow(selectedStage);stageCardPool=Array.from({length:Math.min(STAGE_CARD_POOL_SIZE,STAGES.length)},(_,index)=>createStageCard(index));rail.replaceChildren(...stageCardPool);stageCardPool.forEach((card,index)=>bindStageCard(card,stageWindowStart+index));Object.assign(rail.dataset,{wpStageVirtualized:"bounded-recycle",wpStagePoolSize:String(stageCardPool.length),wpStageTotal:String(STAGES.length),wpStageWindowStart:String(stageWindowStart),wpStageWindowEnd:String(stageWindowStart+stageCardPool.length-1),wpStageRecycleCount:"0",wpStageCenterObserver:"manual",wpStageVirtualDrag:"true"});}
  function moveStageWindow(targetStart){const rail=$("stageRail"),target=Math.max(1,Math.min(stageWindowLimit(),targetStart));let recycled=0;while(stageWindowStart<target){const card=rail.firstElementChild;stageWindowStart+=1;rail.append(card);bindStageCard(card,stageWindowStart+stageCardPool.length-1);recycled+=1;}while(stageWindowStart>target){const card=rail.lastElementChild;stageWindowStart-=1;rail.prepend(card);bindStageCard(card,stageWindowStart);recycled+=1;}stageCardPool=[...rail.children];rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+stageCardPool.length-1);if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);}
  function ensureStageWindow(number){if(!stageCardPool.length||stageCardPool.some(card=>!card.isConnected))buildStagePool();moveStageWindow(desiredStageWindow(number));stageCardPool.forEach(card=>bindStageCard(card,Number(card.dataset.stage)));setCenteredStage(Math.round(stageBrowseLogical));}
  function stageRailPitch(){const cards=[...$("stageRail").children],first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect();return first&&second?Math.abs((second.left+second.width/2)-(first.left+first.width/2)):166;}
  function positionStageRail(logical){const rail=$("stageRail"),value=Math.max(1,Math.min(STAGES.length,logical)),anchor=Math.round(value);moveStageWindow(desiredStageWindow(anchor));const card=rail.querySelector(`[data-stage="${anchor}"]`);card?.scrollIntoView({behavior:"auto",inline:"center",block:"nearest"});rail.scrollLeft+=(value-anchor)*stageRailPitch();rail.dataset.wpStageDragLogical=value.toFixed(4);return value;}
  function centerStage(number){ensureStageWindow(number);const rail=$("stageRail"),card=rail.querySelector(`[data-stage="${number}"]`);card?.scrollIntoView({behavior:"instant",inline:"center",block:"nearest"});setCenteredStage(number);}
  function cancelStageMotion(){if(stageSettleFrame)cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;cancelStagePointer();const rail=$("stageRail");rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type");rail.classList.remove("wp-stage-dragging");delete rail.dataset.wpStageSettling;}
  function renderStageRail(){if(!$("stageRail"))return;$("stageSummary").textContent=`${unlocked} / 30`;stageBrowseLogical=selectedStage;if(!stageCardPool.length||stageCardPool.some(card=>!card.isConnected))buildStagePool();ensureStageWindow(selectedStage);centerStage(selectedStage);requestAnimationFrame(()=>centerStage(selectedStage));}
  function moveStageFocus(event){const current=event.target.closest(".stage-card");if(!current||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;const rtl=getComputedStyle($("stageRail")).direction==="rtl",number=Number(current.dataset.stage);let next=number;if(event.key==="Home")next=1;else if(event.key==="End")next=STAGES.length;else if(event.key==="ArrowLeft")next=Math.max(1,Math.min(STAGES.length,number+(rtl?1:-1)));else next=Math.max(1,Math.min(STAGES.length,number+(rtl?-1:1)));event.preventDefault();stageBrowseLogical=next;ensureStageWindow(next);const target=$("stageRail").querySelector(`[data-stage="${next}"]`);setCenteredStage(next);target?.focus({preventScroll:true});target?.scrollIntoView({behavior:"auto",inline:"center",block:"nearest"});}
  function showStage(){if(document.body.dataset.screen==="battle"){battleGeneration++;activeEscapes.clear();busy=false;pendingFeedback="";}setScreen("stage");selectedStage=unlocked;stageBrowseLogical=unlocked;renderStageRail();$("stageBack").focus();}
  function renderBattle(highlight=null){if(!state)return;const blocksByCell=new Map(state.blocks.map(block=>[keyOf(block.r,block.c),block]));const wallSet=new Set(state.walls.map(cell=>keyOf(...cell)));const portalSet=new Set(state.portals.flatMap(pair=>[keyOf(...pair.a),keyOf(...pair.b)]));const gateMap=new Map(state.gates.map(g=>[keyOf(g.r,g.c),g]));let html="";for(let r=0;r<state.size;r++)for(let c=0;c<state.size;c++){const key=keyOf(r,c),block=blocksByCell.get(key),hit=highlight&&highlight.r===r&&highlight.c===c;if(block){const tone=(r*7+c*3+String(block.id).length)%4,classes=["arrow-block",`tone-${tone}`,block.lock&&"locked",block.frozen&&"frozen",block.key&&"key",block.rotator&&"rotator",hit&&"blocked-hit"].filter(Boolean).join(" ");html+=`<div class="board-cell"><button type="button" class="${classes}" data-block="${block.id}" aria-label="${GLYPH[block.d]}"><span class="arrow-glyph" aria-hidden="true">${GLYPH[block.d]}</span>${block.lock?"<span class='block-badge' aria-hidden='true'>🔒</span>":block.key?"<span class='block-badge' aria-hidden='true'>🔑</span>":""}</button></div>`;}else if(wallSet.has(key))html+=`<div class="board-cell"><span class="obstacle wall ${hit?"blocked-hit":""}" data-cell="${key}" aria-label="wall">▦</span></div>`;else if(portalSet.has(key))html+=`<div class="board-cell"><span class="obstacle portal" aria-label="portal">◎</span></div>`;else if(gateMap.has(key))html+=`<div class="board-cell"><span class="obstacle gate ${hit?"blocked-hit":""}" data-cell="${key}" aria-label="one-way gate">${GLYPH[gateMap.get(key).d]}</span></div>`;else html+="<div class='board-cell'></div>";}$("board").innerHTML=html;$("movesValue").textContent=moves;$("leftValue").textContent=state.blocks.length;$("stageLabel").textContent=`STAGE ${currentStage}`;$("mechanicLabel").textContent=t(["basics","interlock","walls","rotation","locksIce","mixed"][state.band-1]);}
  function startStage(number){battleGeneration++;currentStage=number;selectedStage=number;state=cloneStage(STAGES[number-1]);moves=0;blockedAttempts=0;busy=false;pendingFeedback="";activeEscapes.clear();$("feedback").textContent="";hideModal("resultModal");hideModal("leaveModal");setScreen("battle");renderBattle();requestAnimationFrame(()=>{$("battleBack").focus();showMechanicPreview(state.band);});}
  function showModal(id,focusId){lastFocus=document.activeElement;$(id).hidden=false;$(focusId).focus();}
  function hideModal(id){$(id).hidden=true;lastFocus?.focus?.();}
  function finish(){unlocked=Math.max(unlocked,Math.min(30,currentStage+1));localStorage.setItem("arrowEscapeUnlocked",String(unlocked));const summary=RESULT_SUMMARY_COPY[locale]||RESULT_SUMMARY_COPY.en,copy=RESULT_CLEAN_COPY[locale]||RESULT_CLEAN_COPY.en;$("resultStage").textContent=`STAGE ${currentStage}`;$("resultText").textContent=summary(moves);$("resultPayoff").textContent=blockedAttempts?copy.messy(moves,blockedAttempts):copy.clean(moves);$("nextBtn").disabled=currentStage===30;showModal("resultModal","nextBtn");}
  function markBlocker(hit){const hitBlock=state.blocks.find(item=>item.r===hit.r&&item.c===hit.c),target=hitBlock?$("board").querySelector(`[data-block="${CSS.escape(hitBlock.id)}"]`):$("board").querySelector(`[data-cell="${CSS.escape(keyOf(hit.r,hit.c))}"]`);target?.classList.add("blocked-hit");}
  function settleEscapes(generation,id){if(generation!==battleGeneration)return;activeEscapes.delete(id);busy=activeEscapes.size>0;if(busy)return;renderBattle();$("feedback").textContent=pendingFeedback;pendingFeedback="";if(!state.blocks.length)finish();else if(!actions(state).length)$("feedback").textContent=t("deadlock");}
  function activateBlock(id){if(!state)return;const block=state.blocks.find(item=>item.id===id);if(!block)return;const element=$("board").querySelector(`[data-block="${CSS.escape(id)}"]`);if(block.rotator){block.d=TURN[block.d];delete block.rotator;moves++;$("feedback").textContent=t("rotated");if(activeEscapes.size){element?.classList.remove("rotator");element?.setAttribute("aria-label",GLYPH[block.d]);const glyph=element?.querySelector(".arrow-glyph");if(glyph)glyph.textContent=GLYPH[block.d];$("movesValue").textContent=moves;}else renderBattle();return;}if(block.lock){blockedAttempts++;$("feedback").textContent=t("locked");element?.classList.add("shake");return;}if(block.frozen){blockedAttempts++;$("feedback").textContent=t("frozen");element?.classList.add("shake");return;}const hit=blocker(state,block);if(hit){blockedAttempts++;$("feedback").textContent=t("blocked",{target:blockerTargetLabel(hit)});markBlocker(hit);element?.classList.add("shake");return;}moves++;const beforeFrozen=new Set(state.blocks.filter(item=>item.frozen).map(item=>item.id)),beforeLocked=new Set(state.blocks.filter(item=>item.lock).map(item=>item.id)),generation=battleGeneration,direction=block.d;element?.classList.add(`escape-${{U:"up",R:"right",D:"down",L:"left"}[direction]}`);if(element)element.style.pointerEvents="none";state=applyAction(state,{type:"remove",id});activeEscapes.add(id);busy=true;$("movesValue").textContent=moves;$("leftValue").textContent=state.blocks.length;if(block.key&&[...beforeLocked].some(lockId=>!state.blocks.find(item=>item.id===lockId)?.lock))pendingFeedback=t("keyFound");else if([...beforeFrozen].some(frozenId=>!state.blocks.find(item=>item.id===frozenId)?.frozen))pendingFeedback=t("thawed");setTimeout(()=>settleEscapes(generation,id),330);}
  function installVirtualStageDrag(){const rail=$("stageRail");let pointerId=null,startX=0,lastX=0,logical=1,moved=false,suppressClick=false;const restore=()=>{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type");rail.classList.remove("wp-stage-dragging");delete rail.dataset.wpStageSettling;};cancelStagePointer=()=>{pointerId=null;moved=false;restore();};rail.addEventListener("pointerdown",event=>{if(document.body.dataset.screen!=="stage"||event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;if(stageSettleFrame)cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;pointerId=event.pointerId;startX=lastX=event.clientX;logical=stageBrowseLogical;moved=false;rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");event.stopImmediatePropagation();},true);document.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4){moved=true;rail.classList.add("wp-stage-dragging");}if(moved){if(event.cancelable)event.preventDefault();logical=positionStageRail(logical-delta/stageRailPitch());stageBrowseLogical=logical;stageCardPool.forEach(card=>bindStageCard(card,Number(card.dataset.stage)));setCenteredStage(Math.round(logical));}event.stopImmediatePropagation();},true);const finish=event=>{if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;pointerId=null;if(!moved){restore();return;}if(event.cancelable)event.preventDefault();suppressClick=true;setTimeout(()=>{suppressClick=false;},0);const from=logical,target=Math.max(1,Math.min(STAGES.length,Math.round(from))),started=performance.now();rail.dataset.wpStageSettling="true";const settle=now=>{const progress=Math.min(1,(now-started)/340),eased=progress*progress*(3-2*progress);stageBrowseLogical=positionStageRail(from+(target-from)*eased);if(progress<1)stageSettleFrame=requestAnimationFrame(settle);else{stageSettleFrame=0;ensureStageWindow(target);centerStage(target);restore();}};stageSettleFrame=requestAnimationFrame(settle);moved=false;event.stopImmediatePropagation();};document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);rail.addEventListener("click",event=>{if(!suppressClick)return;suppressClick=false;event.preventDefault();event.stopImmediatePropagation();},true);}
  installVirtualStageDrag();
  $("localeSelect").innerHTML=Object.entries(NAMES).map(([code,name])=>`<option value="${code}">${name}</option>`).join("");
  $("localeSelect").addEventListener("change",event=>{locale=event.target.value;localStorage.setItem("wpLang",locale);applyLocale();syncSound();});
  for(const id of["soundToggle","stageSound"])$(id).addEventListener("click",()=>{sound=!sound;localStorage.setItem("wpSound",sound?"on":"off");syncSound();});
  $("startBtn").addEventListener("click",showStage);$("stageBack").addEventListener("click",()=>{setScreen("main");$("startBtn").focus();});
  $("stageRail").addEventListener("click",event=>{const card=event.target.closest(".stage-card");if(!card)return;const stageNumber=Number(card.dataset.stage);if(stageNumber>=1&&stageNumber<=unlocked)startStage(stageNumber);});
  $("stageRail").addEventListener("keydown",moveStageFocus);
  $("stageRail").addEventListener("focusin",event=>{const card=event.target.closest(".stage-card");if(card)setCenteredStage(Number(card.dataset.stage));});
  $("stageRail").addEventListener("wonder:stage-snap",event=>{const number=Number(event.detail?.index)+1;if(number>=1&&number<=30)centerStage(number);});
  // Resolve physical input on press so fast touch/mouse sequences do not wait
  // for the browser's synthesized click. Keyboard and assistive activation
  // still arrive as detail-zero clicks. State changes remain synchronous, so
  // a repeated press on the same escaping block is naturally ignored.
  $("board").addEventListener("pointerdown",event=>{if(event.button!==0||event.isPrimary===false)return;const block=event.target.closest("[data-block]");if(!block)return;event.preventDefault();activateBlock(block.dataset.block);});
  $("board").addEventListener("click",event=>{if(event.detail!==0)return;const block=event.target.closest("[data-block]");if(block)activateBlock(block.dataset.block);});
  $("hintBtn").addEventListener("click",()=>{const solution=solveStage(state);if(!solution?.length){$("feedback").textContent=t("deadlock");return;}renderBattle();const target=$("board").querySelector(`[data-block="${CSS.escape(solution[0].id)}"]`);target?.classList.add("hinted");$("feedback").textContent=t("hinted");target?.focus({preventScroll:true});});
  $("restartBtn").addEventListener("click",()=>startStage(currentStage));$("battleBack").addEventListener("click",()=>showModal("leaveModal","leaveContinue"));$("battleHelp").addEventListener("click",()=>{restoreHelpCopy();showModal("helpModal","helpClose")});
  $("helpClose").addEventListener("click",()=>{restoreHelpCopy();hideModal("helpModal")});$("leaveContinue").addEventListener("click",()=>hideModal("leaveModal"));$("leaveStage").addEventListener("click",()=>{hideModal("leaveModal");showStage();});
  $("resultStageBtn").addEventListener("click",()=>{hideModal("resultModal");showStage();});$("retryBtn").addEventListener("click",()=>startStage(currentStage));$("nextBtn").addEventListener("click",()=>startStage(Math.min(30,currentStage+1)));
  document.addEventListener("keydown",event=>{if(event.key!=="Escape")return;if(!$("helpModal").hidden)hideModal("helpModal");else if(!$("leaveModal").hidden)hideModal("leaveModal");else if(!$("resultModal").hidden)return;else if(document.body.dataset.screen==="battle")showModal("leaveModal","leaveContinue");});
  window.__ARROW_ESCAPE__={stages:STAGES,solutions:SOLUTIONS.map(solution=>solution.map(action=>({...action}))),solveStage,cloneStage,blocker,actions,applyAction,startStage,getState:()=>({currentStage,moves,unlocked,busy,activeEscapes:[...activeEscapes],state:state&&cloneStage(state)})};
  applyLocale();syncSound();setScreen("main");setTimeout(()=>document.documentElement.dataset.gameReady="true",0);
})();
