(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const KEYS = ["title","language","sound","genre","pitch","start","guideKicker","guideTitle","howTitle","how1","how2","how3","mechanicsTitle","mechanics","chooseStage","stageHint","enter","movesLabel","leftLabel","objective","hint","restart","helpText","continue","leaveTitle","leaveText","stageMap","clear","next","retry","blocked","locked","frozen","rotated","hinted","deadlock","keyFound","thawed","result","basics","interlock","walls","rotation","locksIce","mixed"];
  const PACKS = {
    en:["Arrow Escape","Language","Sound","ORDER PUZZLE","Clear every arrow block in the only safe order.","Start Game","OWNER PREVIEW · RULE-CHECK BUILD","Follow the arrow, but plan the order.","How to play","Tap a block to test its complete arrow path.","A clear block slides out; a blocked block shakes and reveals the blocker.","Remove every block. A hint marks exactly one safe move.","Thirty stages","Walls, rotating arrows, keys, ice, portals and one-way gates arrive in six teaching bands.","Choose a Stage","Swipe or scroll. Select an unlocked stage, then enter.","Enter Stage","Moves","Left","Clear every arrow block.","Hint","Restart","Only a completely clear arrow path can escape. Special tiles never choose a random outcome.","Continue","Leave this attempt?","Continue keeps the exact board. Stage Map restarts this attempt later.","Stage Map","Stage Cleared!","Next Stage","Play Again","Path blocked. Remove the outlined blocker first.","This block is locked. Find its key.","This block is frozen. Remove an adjacent block.","Arrow rotated. Test its new path.","One safe action is highlighted.","No safe action remains. Restart this stage.","Key collected. Matching locks opened.","Adjacent ice thawed.","Cleared in {n} moves.","BASICS","INTERLOCK","WALLS","ROTATION","LOCKS + ICE","MIXED"],
    "zh-Hant":["箭頭大逃亡","語言","聲音","順序益智","依照唯一安全順序清空所有箭頭方塊。","開始遊戲","擁有者預覽 · 規則檢查版本","看清箭頭，更要安排順序。","玩法說明","點擊方塊，檢查箭頭方向的完整路徑。","路徑暢通就滑出；受阻則震動並標出阻擋物。","移除全部方塊；提示只標示一個安全動作。","三十個關卡","六個教學階段依序加入牆壁、旋轉箭頭、鑰匙、冰凍、傳送門與單向門。","選擇關卡","滑動或捲動，選擇已解鎖關卡後進入。","進入關卡","步數","剩餘","清空所有箭頭方塊。","提示","重新開始","只有整條箭頭路徑暢通才能逃出，特殊機制不會隨機決定。","繼續","要離開這次挑戰嗎？","繼續會保留目前棋盤；回關卡地圖後下次會重新開始。","關卡地圖","關卡完成！","下一關","再玩一次","路徑受阻，請先移除外框標示的阻擋物。","方塊已上鎖，請先找到鑰匙。","方塊被冰凍，請移除相鄰方塊。","箭頭已旋轉，請檢查新路徑。","已標示一個安全動作。","目前沒有安全動作，請重新開始。","取得鑰匙，對應的鎖已開啟。","相鄰冰塊已解凍。","使用 {n} 步完成。","基礎","互相阻擋","牆壁","旋轉","鎖與冰凍","混合機制"],
    "zh-Hans":["箭头大逃亡","语言","声音","顺序益智","按照唯一安全顺序清空所有箭头方块。","开始游戏","所有者预览 · 规则检查版本","看清箭头，更要安排顺序。","玩法说明","点击方块，检查箭头方向的完整路径。","路径畅通就滑出；受阻则震动并标出阻挡物。","移除全部方块；提示只标示一个安全动作。","三十个关卡","六个教学阶段依次加入墙壁、旋转箭头、钥匙、冰冻、传送门和单向门。","选择关卡","滑动或滚动，选择已解锁关卡后进入。","进入关卡","步数","剩余","清空所有箭头方块。","提示","重新开始","只有整条箭头路径畅通才能逃出，特殊机制不会随机决定。","继续","要离开这次挑战吗？","继续会保留当前棋盘；返回关卡地图后下次会重新开始。","关卡地图","关卡完成！","下一关","再玩一次","路径受阻，请先移除外框标示的阻挡物。","方块已上锁，请先找到钥匙。","方块被冻结，请移除相邻方块。","箭头已旋转，请检查新路径。","已标示一个安全动作。","当前没有安全动作，请重新开始。","取得钥匙，对应的锁已开启。","相邻冰块已解冻。","使用 {n} 步完成。","基础","互相阻挡","墙壁","旋转","锁与冰冻","混合机制"],
    ja:["アローエスケープ","言語","サウンド","順序パズル","唯一の安全な順番ですべての矢印ブロックを消そう。","ゲーム開始","オーナープレビュー · ルール確認版","矢印を見て、順番を考えよう。","遊び方","ブロックをタップして矢印の全経路を確認します。","通路が空なら脱出し、塞がると揺れて障害物を示します。","全ブロックを消去。ヒントは安全な一手だけを示します。","30ステージ","壁、回転、鍵、氷、ポータル、一方通行ゲートを6段階で学びます。","ステージ選択","スワイプして解放済みステージを選びます。","入る","手数","残り","すべての矢印ブロックを消す。","ヒント","やり直す","矢印の全経路が空の時だけ脱出できます。特殊効果はランダムではありません。","続ける","この挑戦を離れますか？","続けると盤面を維持します。マップへ戻ると次回は最初からです。","ステージマップ","ステージクリア！","次のステージ","もう一度","経路が塞がっています。枠の障害物を先に消してください。","ロック中です。鍵を探してください。","凍っています。隣接ブロックを消してください。","矢印が回転しました。新しい経路を確認してください。","安全な一手を表示しました。","安全な手がありません。やり直してください。","鍵を獲得し、対応するロックが開きました。","隣接する氷が溶けました。","{n}手でクリア。","基本","相互ブロック","壁","回転","鍵と氷","ミックス"],
    ko:["애로우 이스케이프","언어","소리","순서 퍼즐","유일하게 안전한 순서로 모든 화살표 블록을 제거하세요.","게임 시작","소유자 미리보기 · 규칙 점검 빌드","화살표를 보고 순서를 계획하세요.","플레이 방법","블록을 눌러 화살표의 전체 경로를 확인하세요.","경로가 비면 탈출하고, 막히면 흔들리며 방해물을 표시합니다.","모든 블록을 제거하세요. 힌트는 안전한 행동 하나만 표시합니다.","30 스테이지","벽, 회전, 열쇠, 얼음, 포털, 일방통행 문을 여섯 단계로 배웁니다.","스테이지 선택","밀거나 스크롤해 열린 스테이지를 선택하세요.","입장","이동","남음","모든 화살표 블록을 제거하세요.","힌트","다시 시작","화살표의 전체 경로가 비어야 탈출합니다. 특수 효과는 무작위가 아닙니다.","계속","이번 도전을 나갈까요?","계속하면 현재 판을 유지합니다. 맵으로 가면 다음에는 다시 시작합니다.","스테이지 맵","스테이지 완료!","다음 스테이지","다시 플레이","경로가 막혔습니다. 테두리로 표시된 방해물을 먼저 제거하세요.","잠겨 있습니다. 열쇠를 찾으세요.","얼어 있습니다. 인접 블록을 제거하세요.","화살표가 회전했습니다. 새 경로를 확인하세요.","안전한 행동 하나를 표시했습니다.","안전한 행동이 없습니다. 다시 시작하세요.","열쇠를 얻어 해당 잠금을 열었습니다.","인접 얼음이 녹았습니다.","{n}번 만에 완료.","기초","상호 차단","벽","회전","자물쇠와 얼음","혼합"],
    es:["Escape de Flechas","Idioma","Sonido","PUZLE DE ORDEN","Elimina todos los bloques en el único orden seguro.","Jugar","VISTA DEL PROPIETARIO · REGLAS","Sigue la flecha y planea el orden.","Cómo jugar","Toca un bloque para comprobar toda su ruta.","Si está libre, sale; si no, vibra y marca el obstáculo.","Elimina todos. La pista marca una sola acción segura.","Treinta niveles","Muros, giros, llaves, hielo, portales y puertas de un sentido llegan en seis bloques.","Elegir nivel","Desliza y elige un nivel desbloqueado.","Entrar","Movimientos","Restantes","Elimina todos los bloques.","Pista","Reiniciar","Solo escapa con toda la ruta libre. Nada se decide al azar.","Continuar","¿Salir del intento?","Continuar conserva el tablero; volver al mapa reinicia el intento después.","Mapa","¡Nivel superado!","Siguiente","Jugar de nuevo","Ruta bloqueada. Elimina primero el obstáculo marcado.","Está bloqueado. Busca la llave.","Está congelado. Elimina un bloque adyacente.","La flecha giró. Comprueba la nueva ruta.","Se marcó una acción segura.","No quedan acciones seguras. Reinicia.","Llave recogida. Se abrieron los candados.","El hielo adyacente se derritió.","Completado en {n} movimientos.","BÁSICO","BLOQUEO","MUROS","GIRO","LLAVES + HIELO","MIXTO"],
    "pt-BR":["Fuga das Setas","Idioma","Som","QUEBRA-CABEÇA DE ORDEM","Remova todos os blocos na única ordem segura.","Jogar","PRÉVIA DO PROPRIETÁRIO · REGRAS","Siga a seta e planeje a ordem.","Como jogar","Toque num bloco para verificar todo o caminho.","Se estiver livre, ele sai; se não, treme e marca o obstáculo.","Remova todos. A dica marca apenas uma ação segura.","Trinta fases","Paredes, giros, chaves, gelo, portais e portas de mão única chegam em seis blocos.","Escolher fase","Deslize e escolha uma fase liberada.","Entrar","Jogadas","Restam","Remova todos os blocos.","Dica","Reiniciar","Só escapa com o caminho inteiro livre. Nada é aleatório.","Continuar","Sair desta tentativa?","Continuar mantém o tabuleiro; voltar ao mapa reinicia depois.","Mapa de fases","Fase concluída!","Próxima fase","Jogar novamente","Caminho bloqueado. Remova primeiro o obstáculo contornado.","Está trancado. Encontre a chave.","Está congelado. Remova um bloco vizinho.","A seta girou. Verifique o novo caminho.","Uma ação segura foi destacada.","Não há ação segura. Reinicie.","Chave coletada. As travas abriram.","O gelo vizinho derreteu.","Concluído em {n} jogadas.","BÁSICO","BLOQUEIO","PAREDES","GIRO","CHAVES + GELO","MISTO"],
    fr:["Évasion des flèches","Langue","Son","PUZZLE D’ORDRE","Retirez tous les blocs dans le seul ordre sûr.","Jouer","APERÇU PROPRIÉTAIRE · RÈGLES","Suivez la flèche et planifiez l’ordre.","Comment jouer","Touchez un bloc pour vérifier tout son trajet.","Libre, il sort ; bloqué, il tremble et indique l’obstacle.","Retirez tout. L’indice ne montre qu’une action sûre.","Trente niveaux","Murs, rotations, clés, glace, portails et portes à sens unique arrivent en six séries.","Choisir un niveau","Faites défiler et choisissez un niveau débloqué.","Entrer","Coups","Restants","Retirez tous les blocs.","Indice","Recommencer","Le trajet entier doit être libre. Aucun effet n’est aléatoire.","Continuer","Quitter cette tentative ?","Continuer garde le plateau ; la carte relancera l’essai plus tard.","Carte","Niveau réussi !","Niveau suivant","Rejouer","Trajet bloqué. Retirez d’abord l’obstacle encadré.","Ce bloc est verrouillé. Trouvez la clé.","Ce bloc est gelé. Retirez un voisin.","La flèche a tourné. Vérifiez le nouveau trajet.","Une action sûre est indiquée.","Aucune action sûre. Recommencez.","Clé récupérée. Les verrous sont ouverts.","La glace voisine a fondu.","Terminé en {n} coups.","BASE","BLOCAGE","MURS","ROTATION","CLÉS + GLACE","MIXTE"],
    de:["Pfeilflucht","Sprache","Ton","REIHENFOLGE-PUZZLE","Entferne alle Blöcke in der einzigen sicheren Reihenfolge.","Spiel starten","BESITZER-VORSCHAU · REGELTEST","Folge dem Pfeil und plane die Reihenfolge.","Spielanleitung","Tippe einen Block an, um den ganzen Weg zu prüfen.","Ist er frei, gleitet er hinaus; sonst wackelt er und markiert das Hindernis.","Entferne alle. Der Tipp markiert genau eine sichere Aktion.","Dreißig Stufen","Wände, Drehpfeile, Schlüssel, Eis, Portale und Einwegtore kommen in sechs Abschnitten.","Stufe wählen","Wischen oder scrollen und eine offene Stufe wählen.","Betreten","Züge","Übrig","Entferne alle Pfeilblöcke.","Tipp","Neustart","Nur ein vollständig freier Weg führt hinaus. Nichts wird zufällig entschieden.","Fortsetzen","Versuch verlassen?","Fortsetzen bewahrt das Brett; die Karte startet den Versuch später neu.","Stufenkarte","Stufe geschafft!","Nächste Stufe","Noch einmal","Weg blockiert. Entferne zuerst das umrandete Hindernis.","Dieser Block ist gesperrt. Finde den Schlüssel.","Dieser Block ist gefroren. Entferne einen Nachbarn.","Pfeil gedreht. Prüfe den neuen Weg.","Eine sichere Aktion ist markiert.","Keine sichere Aktion. Starte neu.","Schlüssel erhalten. Passende Schlösser sind offen.","Benachbartes Eis ist geschmolzen.","In {n} Zügen geschafft.","BASIS","SPERREN","WÄNDE","DREHUNG","SCHLÜSSEL + EIS","GEMISCHT"],
    it:["Fuga delle frecce","Lingua","Audio","PUZZLE D’ORDINE","Rimuovi tutti i blocchi nell’unico ordine sicuro.","Gioca","ANTEPRIMA PROPRIETARIO · REGOLE","Segui la freccia e pianifica l’ordine.","Come giocare","Tocca un blocco per controllare l’intero percorso.","Se è libero esce; se è bloccato vibra e indica l’ostacolo.","Rimuovi tutto. Il suggerimento mostra una sola azione sicura.","Trenta livelli","Muri, rotazioni, chiavi, ghiaccio, portali e porte a senso unico arrivano in sei gruppi.","Scegli livello","Scorri e scegli un livello sbloccato.","Entra","Mosse","Rimasti","Rimuovi tutti i blocchi.","Suggerimento","Ricomincia","Esce solo con il percorso interamente libero. Nulla è casuale.","Continua","Lasciare il tentativo?","Continua conserva la griglia; la mappa riavvia il tentativo più tardi.","Mappa","Livello completato!","Livello successivo","Gioca ancora","Percorso bloccato. Rimuovi prima l’ostacolo evidenziato.","È bloccato. Trova la chiave.","È congelato. Rimuovi un blocco vicino.","La freccia ha ruotato. Controlla il nuovo percorso.","È evidenziata un’azione sicura.","Nessuna azione sicura. Ricomincia.","Chiave raccolta. I lucchetti si sono aperti.","Il ghiaccio vicino si è sciolto.","Completato in {n} mosse.","BASE","BLOCCHI","MURI","ROTAZIONE","CHIAVI + GHIACCIO","MISTO"],
    ru:["Побег стрелок","Язык","Звук","ГОЛОВОЛОМКА НА ПОРЯДОК","Уберите все блоки в единственно безопасном порядке.","Начать игру","ПРЕДПРОСМОТР ВЛАДЕЛЬЦА · ПРОВЕРКА ПРАВИЛ","Следуйте стрелке и планируйте порядок.","Как играть","Нажмите блок, чтобы проверить весь путь стрелки.","Если путь свободен, блок уйдёт; иначе он дрожит и показывает препятствие.","Уберите всё. Подсказка отмечает только одно безопасное действие.","Тридцать этапов","Стены, повороты, ключи, лёд, порталы и односторонние двери вводятся в шести частях.","Выбор этапа","Листайте и выберите открытый этап.","Войти","Ходы","Осталось","Уберите все блоки.","Подсказка","Заново","Весь путь должен быть свободен. Случайных решений нет.","Продолжить","Покинуть попытку?","Продолжение сохранит доску; карта перезапустит попытку позже.","Карта этапов","Этап пройден!","Следующий этап","Ещё раз","Путь заблокирован. Сначала уберите отмеченное препятствие.","Блок заперт. Найдите ключ.","Блок заморожен. Уберите соседний блок.","Стрелка повернулась. Проверьте новый путь.","Отмечено одно безопасное действие.","Безопасных действий нет. Начните заново.","Ключ получен. Замки открыты.","Соседний лёд растаял.","Пройдено за {n} ходов.","ОСНОВЫ","БЛОКИРОВКА","СТЕНЫ","ПОВОРОТ","КЛЮЧИ + ЛЁД","СМЕШАННО"],
    hi:["एरो एस्केप","भाषा","ध्वनि","क्रम पहेली","सभी तीर ब्लॉक केवल सुरक्षित क्रम में हटाएँ।","खेल शुरू करें","मालिक पूर्वावलोकन · नियम जाँच","तीर देखें और क्रम की योजना बनाएँ।","कैसे खेलें","पूरे तीर मार्ग को जाँचने के लिए ब्लॉक दबाएँ।","रास्ता साफ हो तो ब्लॉक निकलता है; रुकने पर काँपकर बाधा दिखाता है।","सभी ब्लॉक हटाएँ। संकेत केवल एक सुरक्षित चाल दिखाता है।","तीस चरण","दीवार, घूमते तीर, चाबी, बर्फ, पोर्टल और एकतरफा द्वार छह भागों में आते हैं।","चरण चुनें","स्क्रॉल करके खुला चरण चुनें।","प्रवेश","चालें","शेष","सभी तीर ब्लॉक हटाएँ।","संकेत","फिर शुरू","पूरा रास्ता साफ होने पर ही निकास है। कोई परिणाम यादृच्छिक नहीं है।","जारी रखें","यह प्रयास छोड़ें?","जारी रखने पर बोर्ड बचा रहेगा; नक्शे पर लौटने से अगली बार प्रयास फिर शुरू होगा।","चरण नक्शा","चरण पूरा!","अगला चरण","फिर खेलें","रास्ता रुका है। पहले घिरी हुई बाधा हटाएँ।","ब्लॉक बंद है। चाबी खोजें।","ब्लॉक जमा है। पास का ब्लॉक हटाएँ।","तीर घूम गया। नया रास्ता जाँचें।","एक सुरक्षित चाल दिखाई गई।","कोई सुरक्षित चाल नहीं। फिर शुरू करें।","चाबी मिली। संबंधित ताले खुल गए।","पास की बर्फ पिघल गई।","{n} चालों में पूरा।","मूल","आपसी रोक","दीवारें","घुमाव","चाबी + बर्फ","मिश्रित"],
    ar:["هروب الأسهم","اللغة","الصوت","لغز الترتيب","أزل كل كتل الأسهم بالترتيب الآمن الوحيد.","ابدأ اللعب","معاينة المالك · فحص القواعد","اتبع السهم وخطط للترتيب.","طريقة اللعب","اضغط كتلة لفحص مسار السهم كاملاً.","إذا كان خالياً تنزلق للخارج، وإن كان مسدوداً تهتز وتحدد العائق.","أزل الجميع. يحدد التلميح حركة آمنة واحدة فقط.","ثلاثون مرحلة","تظهر الجدران والدوران والمفاتيح والجليد والبوابات في ست مجموعات تعليمية.","اختر مرحلة","مرر واختر مرحلة مفتوحة.","دخول","الحركات","المتبقي","أزل كل كتل الأسهم.","تلميح","إعادة","لا تخرج الكتلة إلا إذا كان المسار كاملاً خالياً. لا توجد نتائج عشوائية.","متابعة","مغادرة المحاولة؟","المتابعة تحفظ اللوحة؛ خريطة المراحل تعيد المحاولة لاحقاً.","خريطة المراحل","اكتملت المرحلة!","المرحلة التالية","العب مجدداً","المسار مسدود. أزل أولاً العائق المحدد.","الكتلة مقفلة. ابحث عن المفتاح.","الكتلة مجمدة. أزل كتلة مجاورة.","دار السهم. افحص المسار الجديد.","تم تحديد حركة آمنة واحدة.","لا توجد حركة آمنة. أعد المرحلة.","جُمِع المفتاح وفُتحت الأقفال المطابقة.","ذاب الجليد المجاور.","اكتملت في {n} حركة.","الأساسيات","التعطيل","الجدران","الدوران","المفاتيح والجليد","مختلط"]
  };
  const NAMES={en:"English","zh-Hant":"繁體中文","zh-Hans":"简体中文",ja:"日本語",ko:"한국어",es:"Español","pt-BR":"Português",fr:"Français",de:"Deutsch",it:"Italiano",ru:"Русский",hi:"हिन्दी",ar:"العربية"};
  const I18N=Object.fromEntries(Object.entries(PACKS).map(([locale,values])=>[locale,Object.fromEntries(KEYS.map((key,index)=>[key,values[index]]))]));
  const DIRS={U:[-1,0],R:[0,1],D:[1,0],L:[0,-1]},GLYPH={U:"↑",R:"→",D:"↓",L:"←"},TURN={U:"R",R:"D",D:"L",L:"U"};
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

  let locale=localStorage.getItem("wpLang")||"en",sound=localStorage.getItem("wpSound")!=="off",unlocked=Math.max(1,Math.min(30,Number(localStorage.getItem("arrowEscapeUnlocked"))||1));
  let selectedStage=unlocked,currentStage=1,state=null,moves=0,busy=false,lastFocus=null;
  const t=(key,vars={})=>String((I18N[locale]||I18N.en)[key]||key).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??"");
  function setScreen(screen){document.body.dataset.screen=screen;$("mainGroup").hidden=screen!=="main";$("stageScreen").hidden=screen!=="stage";$("battleScreen").hidden=screen!=="battle";document.body.classList.toggle("is-game-playing",screen==="battle");if(screen==="stage")$("stageScreen").querySelector(".wp-stage-physical-reserve")?.setAttribute("data-wp-stage-reserve-active","");window.dispatchEvent(new Event("weightplay:stage-sync"));window.dispatchEvent(new Event("weightplay:shell-sync"));}
  function applyLocale(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=t(node.dataset.i18n));document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.i18nAria)));$("localeSelect").value=locale;$("localeSelect").setAttribute("aria-label",t("language"));$("stageBack").setAttribute("aria-label",t("chooseStage"));$("battleBack").setAttribute("aria-label",t("stageMap"));$("battleHelp").setAttribute("aria-label",t("howTitle"));$("stageRail").setAttribute("aria-label",t("chooseStage"));$("board").setAttribute("aria-label",t("title"));$("guide").setAttribute("aria-label",t("howTitle"));document.querySelectorAll(".poster,.result-layout img").forEach(node=>node.setAttribute("alt",t("title")));$("mainProgress").textContent=`${unlocked} / 30`;renderStageRail();if(state)renderBattle();window.dispatchEvent(new Event("wonder:locale-change"));}
  function syncSound(){for(const id of["soundToggle","stageSound"]){const button=$(id);button.textContent=sound?"🔊":"🔇";button.setAttribute("aria-pressed",String(sound));button.setAttribute("aria-label",t("sound"));}}
  function renderStageRail(){if(!$("stageRail"))return;$("stageSummary").textContent=`${unlocked} / 30`;$("stageRail").innerHTML=STAGES.map(stage=>`<button class="stage-card" type="button" data-stage="${stage.number}" data-stage-index="${stage.number-1}" ${stage.number>unlocked?"disabled":""} aria-current="${stage.number===selectedStage}"><span class="stage-number">${String(stage.number).padStart(2,"0")}</span><small>${t(["basics","interlock","walls","rotation","locksIce","mixed"][stage.band-1])}</small><strong class="stage-mechanics">${stage.blocks.length} ◈</strong></button>`).join("");$("enterStage").disabled=selectedStage>unlocked;requestAnimationFrame(()=>$("stageRail").querySelector('[aria-current="true"]')?.scrollIntoView({behavior:"instant",inline:"center",block:"nearest"}));}
  function showStage(){setScreen("stage");selectedStage=Math.min(unlocked,currentStage||unlocked);renderStageRail();$("stageBack").focus();}
  function renderBattle(highlight=null){if(!state)return;const blocksByCell=new Map(state.blocks.map(block=>[keyOf(block.r,block.c),block]));const wallSet=new Set(state.walls.map(cell=>keyOf(...cell)));const portalSet=new Set(state.portals.flatMap(pair=>[keyOf(...pair.a),keyOf(...pair.b)]));const gateMap=new Map(state.gates.map(g=>[keyOf(g.r,g.c),g]));let html="";for(let r=0;r<state.size;r++)for(let c=0;c<state.size;c++){const key=keyOf(r,c),block=blocksByCell.get(key),hit=highlight&&highlight.r===r&&highlight.c===c;if(block){const classes=["arrow-block",block.lock&&"locked",block.frozen&&"frozen",block.key&&"key",block.rotator&&"rotator",hit&&"blocked-hit"].filter(Boolean).join(" ");html+=`<div class="board-cell"><button type="button" class="${classes}" data-block="${block.id}" aria-label="${GLYPH[block.d]}">${GLYPH[block.d]}${block.lock?"<span aria-hidden='true'>🔒</span>":block.key?"<span aria-hidden='true'>🔑</span>":""}</button></div>`;}else if(wallSet.has(key))html+=`<div class="board-cell"><span class="obstacle wall ${hit?"blocked-hit":""}" data-cell="${key}" aria-label="wall">▦</span></div>`;else if(portalSet.has(key))html+=`<div class="board-cell"><span class="obstacle portal" aria-label="portal">◎</span></div>`;else if(gateMap.has(key))html+=`<div class="board-cell"><span class="obstacle gate ${hit?"blocked-hit":""}" data-cell="${key}" aria-label="one-way gate">${GLYPH[gateMap.get(key).d]}</span></div>`;else html+="<div class='board-cell'></div>";}$("board").innerHTML=html;$("movesValue").textContent=moves;$("leftValue").textContent=state.blocks.length;$("stageLabel").textContent=`STAGE ${currentStage}`;$("mechanicLabel").textContent=t(["basics","interlock","walls","rotation","locksIce","mixed"][state.band-1]);}
  function startStage(number){currentStage=number;selectedStage=number;state=cloneStage(STAGES[number-1]);moves=0;busy=false;$("feedback").textContent="";hideModal("resultModal");hideModal("leaveModal");setScreen("battle");renderBattle();requestAnimationFrame(()=>$("battleBack").focus());}
  function showModal(id,focusId){lastFocus=document.activeElement;$(id).hidden=false;$(focusId).focus();}
  function hideModal(id){$(id).hidden=true;lastFocus?.focus?.();}
  function finish(){unlocked=Math.max(unlocked,Math.min(30,currentStage+1));localStorage.setItem("arrowEscapeUnlocked",String(unlocked));$("resultStage").textContent=`STAGE ${currentStage}`;$("resultText").textContent=t("result",{n:moves});$("nextBtn").disabled=currentStage===30;showModal("resultModal","nextBtn");}
  function activateBlock(id){if(busy||!state)return;const block=state.blocks.find(item=>item.id===id);if(!block)return;const element=$("board").querySelector(`[data-block="${CSS.escape(id)}"]`);if(block.rotator){block.d=TURN[block.d];delete block.rotator;moves++;$("feedback").textContent=t("rotated");renderBattle();return;}if(block.lock){$("feedback").textContent=t("locked");element?.classList.add("shake");return;}if(block.frozen){$("feedback").textContent=t("frozen");element?.classList.add("shake");return;}const hit=blocker(state,block);if(hit){$("feedback").textContent=t("blocked");renderBattle(hit);$("board").querySelector(`[data-block="${CSS.escape(id)}"]`)?.classList.add("shake");return;}busy=true;moves++;const beforeFrozen=new Set(state.blocks.filter(item=>item.frozen).map(item=>item.id));const beforeLocked=new Set(state.blocks.filter(item=>item.lock).map(item=>item.id));const direction=block.d;element?.classList.add(`escape-${{U:"up",R:"right",D:"down",L:"left"}[direction]}`);state=applyAction(state,{type:"remove",id});setTimeout(()=>{busy=false;renderBattle();if(block.key&&[...beforeLocked].some(lockId=>!state.blocks.find(item=>item.id===lockId)?.lock))$("feedback").textContent=t("keyFound");else if([...beforeFrozen].some(frozenId=>!state.blocks.find(item=>item.id===frozenId)?.frozen))$("feedback").textContent=t("thawed");else $("feedback").textContent="";if(!state.blocks.length)finish();else if(!actions(state).length)$("feedback").textContent=t("deadlock");},330);}
  $("localeSelect").innerHTML=Object.entries(NAMES).map(([code,name])=>`<option value="${code}">${name}</option>`).join("");
  $("localeSelect").addEventListener("change",event=>{locale=event.target.value;localStorage.setItem("wpLang",locale);applyLocale();syncSound();});
  for(const id of["soundToggle","stageSound"])$(id).addEventListener("click",()=>{sound=!sound;localStorage.setItem("wpSound",sound?"on":"off");syncSound();});
  $("startBtn").addEventListener("click",showStage);$("stageBack").addEventListener("click",()=>{setScreen("main");$("startBtn").focus();});
  $("stageRail").addEventListener("click",event=>{const card=event.target.closest(".stage-card:not(:disabled)");if(!card)return;selectedStage=Number(card.dataset.stage);renderStageRail();});
  $("stageRail").addEventListener("wonder:stage-snap",event=>{const number=Number(event.detail?.index)+1;if(number>=1&&number<=30){selectedStage=number;renderStageRail();}});
  $("enterStage").addEventListener("click",()=>{if(selectedStage<=unlocked)startStage(selectedStage);});$("board").addEventListener("click",event=>{const block=event.target.closest("[data-block]");if(block)activateBlock(block.dataset.block);});
  $("hintBtn").addEventListener("click",()=>{const solution=solveStage(state);if(!solution?.length){$("feedback").textContent=t("deadlock");return;}renderBattle();const target=$("board").querySelector(`[data-block="${CSS.escape(solution[0].id)}"]`);target?.classList.add("hinted");$("feedback").textContent=t("hinted");});
  $("restartBtn").addEventListener("click",()=>startStage(currentStage));$("battleBack").addEventListener("click",()=>showModal("leaveModal","leaveContinue"));$("battleHelp").addEventListener("click",()=>showModal("helpModal","helpClose"));
  $("helpClose").addEventListener("click",()=>hideModal("helpModal"));$("leaveContinue").addEventListener("click",()=>hideModal("leaveModal"));$("leaveStage").addEventListener("click",()=>{hideModal("leaveModal");showStage();});
  $("resultStageBtn").addEventListener("click",()=>{hideModal("resultModal");showStage();});$("retryBtn").addEventListener("click",()=>startStage(currentStage));$("nextBtn").addEventListener("click",()=>startStage(Math.min(30,currentStage+1)));
  document.addEventListener("keydown",event=>{if(event.key!=="Escape")return;if(!$("helpModal").hidden)hideModal("helpModal");else if(!$("leaveModal").hidden)hideModal("leaveModal");else if(!$("resultModal").hidden)return;else if(document.body.dataset.screen==="battle")showModal("leaveModal","leaveContinue");});
  window.__ARROW_ESCAPE__={stages:STAGES,solutions:SOLUTIONS.map(solution=>solution.map(action=>({...action}))),solveStage,cloneStage,blocker,actions,applyAction,startStage,getState:()=>({currentStage,moves,unlocked,state:state&&cloneStage(state)})};
  applyLocale();syncSound();setScreen("main");setTimeout(()=>document.documentElement.dataset.gameReady="true",0);
})();
