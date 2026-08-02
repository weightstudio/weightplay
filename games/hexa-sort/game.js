(()=>{"use strict";const $=id=>document.getElementById(id),K=["title","language","genre","pitch","start","preview","guideTitle","howTitle","how1","how2","how3","priorityTitle","priority","chooseStage","stageHint","enter","moves","cleared","helpText","continue","leaveTitle","leaveText","stageMap","clear","next","retry","selectStack","invalid","blocked","frozen","merged","clearedMsg","gameOver","limitFail","result","colorGoal","scoreGoal","clearGoal","frozenGoal","gemGoal","mixedGoal"];
const P={
en:["Hexa Sort","Language","HEX STACK PUZZLE","Place stacks, gather matching top colors, and trigger chain clears.","Start Game","OWNER PREVIEW · RULE-CHECK BUILD","Only matching top layers can travel.","How to play","Choose one of three stacks, then an empty hex.","Adjacent matching top runs gather into the strongest stack.","Ten matching chips clear and reveal the next chain.","Deterministic priority","Largest matching run wins; ties prefer the new placement, then fixed board order.","Choose a Stage","Select an unlocked sorting mission.","Enter Stage","Moves","Cleared","Operations lock during merging. Only contiguous matching chips on top may move.","Continue","Leave this sort?","Continue keeps the exact stacks.","Stage Map","Mission Complete!","Next Stage","Play Again","Choose a stack first.","Choose an empty open hex.","That hex is blocked.","The frozen stack must be thawed from an adjacent placement.","Matching top layers gathered.","{n} matching chips cleared!","No empty hex remains.","The move limit was reached.","{score} points · {cleared} chips · {moves} moves","COLOR","SCORE","CLEARS","FROZEN","GEMS","MIXED"],
"zh-Hant":["六角堆疊","語言","六角堆疊益智","放置堆疊、集中相同頂層顏色並觸發連鎖消除。","開始遊戲","擁有者預覽 · 規則檢查版本","只有相同的頂層能移動。","玩法說明","先選擇三組堆疊之一，再選擇空六角格。","相鄰的同色頂層會集中到最強的堆疊。","十片同色籌碼消除並揭露下一層連鎖。","固定合併優先順序","同色數量最多者優先；平手時選新放位置，再依固定棋盤順序。","選擇關卡","選擇已解鎖的整理任務。","進入關卡","步數","已消除","合併期間會鎖定操作；只有頂層連續同色片能移動。","繼續","要離開這次整理嗎？","繼續會保留目前所有堆疊。","關卡地圖","任務完成！","下一關","再玩一次","請先選擇一組堆疊。","請選擇空的可用六角格。","這個六角格已封鎖。","冰凍堆疊必須由相鄰放置解凍。","相同頂層已集中。","消除了 {n} 片同色籌碼！","已沒有空六角格。","已達步數上限。","{score} 分 · {cleared} 片 · {moves} 步","指定顏色","分數","消除次數","冰凍","寶石","混合"],
"zh-Hans":["六角堆叠","语言","六角堆叠益智","放置堆叠、集中相同顶层颜色并触发连锁消除。","开始游戏","所有者预览 · 规则检查版本","只有相同的顶层能移动。","玩法说明","先选择三组堆叠之一，再选择空六角格。","相邻的同色顶层会集中到最强的堆叠。","十片同色筹码消除并揭露下一层连锁。","固定合并优先顺序","同色数量最多者优先；平手时选新放位置，再按固定棋盘顺序。","选择关卡","选择已解锁的整理任务。","进入关卡","步数","已消除","合并期间会锁定操作；只有顶层连续同色片能移动。","继续","要离开这次整理吗？","继续会保留当前所有堆叠。","关卡地图","任务完成！","下一关","再玩一次","请先选择一组堆叠。","请选择空的可用六角格。","这个六角格已封锁。","冰冻堆叠必须由相邻放置解冻。","相同顶层已集中。","消除了 {n} 片同色筹码！","已没有空六角格。","已达步数上限。","{score} 分 · {cleared} 片 · {moves} 步","指定颜色","分数","消除次数","冰冻","宝石","混合"],
ja:["ヘキサソート","言語","六角スタックパズル","スタックを置き、同じ上面色を集めて連鎖消去しよう。","ゲーム開始","オーナープレビュー · ルール確認版","同じ色の上層だけが移動できます。","遊び方","3つのスタックから1つ選び、空の六角形を選びます。","隣接する同色上層は最も強いスタックに集まります。","同色10枚で消え、次の層の連鎖が始まります。","固定優先順位","同色枚数が最多のスタック、同数なら新配置、さらに同数なら盤面順です。","ステージ選択","解放済みの整理ミッションを選びます。","入る","手数","消去","合体中は操作できません。上部の連続した同色だけが移動します。","続ける","この整理を離れますか？","続けると現在のスタックを維持します。","ステージマップ","ミッション完了！","次のステージ","もう一度","先にスタックを選んでください。","空いている六角形を選んでください。","その六角形は封鎖されています。","凍ったスタックは隣接配置で解凍します。","同色上層が集まりました。","同色チップを{n}枚消去！","空き六角形がありません。","手数上限に達しました。","{score}点 · {cleared}枚 · {moves}手","色","スコア","消去","凍結","宝石","ミックス"],
ko:["헥사 정렬","언어","육각 스택 퍼즐","스택을 놓고 같은 윗면 색을 모아 연쇄 제거하세요.","게임 시작","소유자 미리보기 · 규칙 점검 빌드","같은 색의 맨 위 층만 이동합니다.","플레이 방법","세 스택 중 하나를 고른 뒤 빈 육각형을 선택하세요.","인접한 같은 색 윗층은 가장 강한 스택으로 모입니다.","같은 색 10개가 모이면 사라지고 다음 층 연쇄가 시작됩니다.","고정 우선순위","같은 색 수가 많은 스택, 동률이면 새 위치, 다시 동률이면 보드 순서입니다.","스테이지 선택","열린 정렬 미션을 선택하세요.","입장","이동","제거","합치는 동안 조작이 잠깁니다. 맨 위의 연속된 같은 색만 이동합니다.","계속","이번 정렬을 나갈까요?","계속하면 현재 스택을 유지합니다.","스테이지 맵","미션 완료!","다음 스테이지","다시 플레이","먼저 스택을 선택하세요.","비어 있고 열린 육각형을 선택하세요.","그 육각형은 막혀 있습니다.","얼어붙은 스택은 인접 배치로 녹여야 합니다.","같은 윗층이 모였습니다.","같은 색 칩 {n}개 제거!","빈 육각형이 없습니다.","이동 제한에 도달했습니다.","{score}점 · {cleared}개 · {moves}회","색상","점수","제거","빙결","보석","혼합"],
es:["Clasificación Hexa","Idioma","PUZLE DE PILAS HEXA","Coloca pilas, reúne colores superiores iguales y crea cadenas.","Jugar","VISTA DEL PROPIETARIO · REGLAS","Solo viajan las capas superiores iguales.","Cómo jugar","Elige una de tres pilas y después un hexágono vacío.","Las capas vecinas iguales se reúnen en la pila más fuerte.","Diez fichas iguales desaparecen y revelan la siguiente cadena.","Prioridad determinista","Gana la mayor cantidad; en empate, la nueva posición y luego el orden fijo.","Elegir nivel","Elige una misión desbloqueada.","Entrar","Movimientos","Eliminadas","Las operaciones se bloquean durante la unión. Solo se mueve la capa superior continua.","Continuar","¿Salir de esta partida?","Continuar conserva todas las pilas.","Mapa","¡Misión completa!","Siguiente","Jugar de nuevo","Elige una pila primero.","Elige un hexágono vacío.","Ese hexágono está bloqueado.","La pila congelada se descongela colocando al lado.","Las capas iguales se reunieron.","¡{n} fichas iguales eliminadas!","No quedan hexágonos vacíos.","Se alcanzó el límite de movimientos.","{score} puntos · {cleared} fichas · {moves} movimientos","COLOR","PUNTOS","LIMPIEZAS","HIELO","GEMAS","MIXTO"],
"pt-BR":["Hexa Sort","Idioma","QUEBRA-CABEÇA HEXA","Coloque pilhas, junte cores do topo e crie correntes.","Jogar","PRÉVIA DO PROPRIETÁRIO · REGRAS","Só as camadas superiores iguais viajam.","Como jogar","Escolha uma das três pilhas e depois um hexágono vazio.","Camadas vizinhas iguais se juntam na pilha mais forte.","Dez fichas iguais somem e revelam a próxima corrente.","Prioridade determinística","Ganha a maior quantidade; empate prefere a nova posição e depois a ordem fixa.","Escolher fase","Escolha uma missão liberada.","Entrar","Jogadas","Removidas","A operação trava durante a união. Só a sequência igual do topo se move.","Continuar","Sair desta partida?","Continuar mantém todas as pilhas.","Mapa","Missão concluída!","Próxima","Jogar novamente","Escolha uma pilha primeiro.","Escolha um hexágono vazio.","Esse hexágono está bloqueado.","A pilha congelada descongela com uma colocação vizinha.","As camadas iguais se juntaram.","{n} fichas iguais removidas!","Não há hexágono vazio.","O limite de jogadas foi atingido.","{score} pontos · {cleared} fichas · {moves} jogadas","COR","PONTOS","LIMPEZAS","GELO","GEMAS","MISTO"],
fr:["Hexa Sort","Langue","PUZZLE DE PILES HEXA","Placez des piles, réunissez les couleurs supérieures et créez des chaînes.","Jouer","APERÇU PROPRIÉTAIRE · RÈGLES","Seules les couches supérieures identiques voyagent.","Comment jouer","Choisissez une des trois piles puis un hexagone vide.","Les couches voisines identiques vont vers la pile la plus forte.","Dix jetons identiques disparaissent et révèlent la chaîne suivante.","Priorité déterministe","La plus grande quantité gagne ; égalité pour le nouveau placement puis l’ordre fixe.","Choisir un niveau","Choisissez une mission débloquée.","Entrer","Coups","Effacés","Les opérations sont verrouillées pendant la fusion. Seule la série supérieure identique bouge.","Continuer","Quitter ce tri ?","Continuer conserve toutes les piles.","Carte","Mission réussie !","Suivant","Rejouer","Choisissez d’abord une pile.","Choisissez un hexagone vide.","Cet hexagone est bloqué.","La pile gelée se dégèle par un placement voisin.","Les couches identiques sont réunies.","{n} jetons identiques effacés !","Aucun hexagone vide.","Limite de coups atteinte.","{score} points · {cleared} jetons · {moves} coups","COULEUR","SCORE","EFFACEMENTS","GEL","GEMMES","MIXTE"],
de:["Hexa-Sort","Sprache","HEXA-STAPELPUZZLE","Setze Stapel, sammle gleiche Deckfarben und löse Ketten aus.","Spiel starten","BESITZER-VORSCHAU · REGELTEST","Nur gleiche obere Schichten wandern.","Spielanleitung","Wähle einen von drei Stapeln und dann ein leeres Sechseck.","Benachbarte gleiche Deckschichten sammeln sich im stärksten Stapel.","Zehn gleiche Chips verschwinden und zeigen die nächste Kette.","Deterministische Priorität","Größte Menge gewinnt; bei Gleichstand neue Position, dann feste Brettreihenfolge.","Stufe wählen","Wähle eine offene Sortiermission.","Betreten","Züge","Gelöscht","Während der Fusion ist die Bedienung gesperrt. Nur die zusammenhängende Deckfarbe bewegt sich.","Fortsetzen","Sortierung verlassen?","Fortsetzen bewahrt alle Stapel.","Stufenkarte","Mission erfüllt!","Nächste Stufe","Noch einmal","Wähle zuerst einen Stapel.","Wähle ein leeres offenes Sechseck.","Dieses Sechseck ist blockiert.","Der gefrorene Stapel taut durch benachbartes Setzen.","Gleiche Deckschichten wurden gesammelt.","{n} gleiche Chips gelöscht!","Kein leeres Sechseck übrig.","Zuglimit erreicht.","{score} Punkte · {cleared} Chips · {moves} Züge","FARBE","PUNKTE","LÖSCHUNGEN","EIS","JUWELEN","GEMISCHT"],
it:["Hexa Sort","Lingua","PUZZLE DI PILE HEXA","Posiziona pile, unisci i colori superiori e crea catene.","Gioca","ANTEPRIMA PROPRIETARIO · REGOLE","Si muovono solo gli strati superiori uguali.","Come giocare","Scegli una delle tre pile e poi un esagono vuoto.","Gli strati vicini uguali si raccolgono nella pila più forte.","Dieci gettoni uguali spariscono e rivelano la catena seguente.","Priorità deterministica","Vince la quantità maggiore; parità alla nuova posizione, poi ordine fisso.","Scegli livello","Scegli una missione sbloccata.","Entra","Mosse","Eliminati","I comandi sono bloccati durante la fusione. Si muove solo la serie superiore uguale.","Continua","Lasciare questo schema?","Continua conserva tutte le pile.","Mappa","Missione completata!","Successivo","Gioca ancora","Scegli prima una pila.","Scegli un esagono vuoto.","Questo esagono è bloccato.","La pila congelata si scongela posizionando accanto.","Gli strati uguali si sono uniti.","Eliminati {n} gettoni uguali!","Non restano esagoni vuoti.","Limite di mosse raggiunto.","{score} punti · {cleared} gettoni · {moves} mosse","COLORE","PUNTI","ELIMINAZIONI","GELO","GEMME","MISTO"],
ru:["Гекса-сортировка","Язык","ГОЛОВОЛОМКА СО СТОПКАМИ","Ставьте стопки, собирайте одинаковые верхние цвета и запускайте цепочки.","Начать игру","ПРЕДПРОСМОТР ВЛАДЕЛЬЦА · ПРОВЕРКА ПРАВИЛ","Двигаются только одинаковые верхние слои.","Как играть","Выберите одну из трёх стопок, затем пустой шестиугольник.","Соседние одинаковые верхние слои собираются в самой сильной стопке.","Десять одинаковых фишек исчезают и открывают следующую цепочку.","Фиксированный приоритет","Побеждает большее число; при равенстве новая позиция, затем порядок поля.","Выбор этапа","Выберите открытую миссию.","Войти","Ходы","Убрано","Во время слияния управление заблокировано. Двигается только непрерывный верхний цвет.","Продолжить","Покинуть сортировку?","Продолжение сохраняет все стопки.","Карта","Миссия выполнена!","Следующий этап","Ещё раз","Сначала выберите стопку.","Выберите пустой шестиугольник.","Этот шестиугольник заблокирован.","Замороженная стопка тает от соседнего размещения.","Одинаковые верхние слои собраны.","Убрано одинаковых фишек: {n}!","Нет пустых шестиугольников.","Достигнут лимит ходов.","{score} очков · {cleared} фишек · {moves} ходов","ЦВЕТ","ОЧКИ","ОЧИСТКИ","ЛЁД","САМОЦВЕТЫ","СМЕШАННО"],
hi:["हेक्सा सॉर्ट","भाषा","हेक्स स्टैक पहेली","ढेर रखें, समान ऊपरी रंग मिलाएँ और श्रृंखला हटाएँ।","खेल शुरू करें","मालिक पूर्वावलोकन · नियम जाँच","केवल समान ऊपरी परतें चल सकती हैं।","कैसे खेलें","तीन ढेरों में से एक चुनें, फिर खाली षट्भुज चुनें।","पास की समान ऊपरी परतें सबसे मजबूत ढेर में जाती हैं।","दस समान चिप मिटकर अगली श्रृंखला खोलते हैं।","निश्चित प्राथमिकता","सबसे अधिक संख्या जीतती है; बराबरी में नया स्थान, फिर बोर्ड क्रम।","चरण चुनें","खुला छँटाई मिशन चुनें।","प्रवेश","चालें","हटाए","मिलाते समय नियंत्रण बंद रहता है। केवल लगातार समान ऊपरी चिप चलते हैं।","जारी रखें","यह छँटाई छोड़ें?","जारी रखने पर सभी ढेर बचते हैं।","चरण नक्शा","मिशन पूरा!","अगला चरण","फिर खेलें","पहले ढेर चुनें।","खाली खुला षट्भुज चुनें।","यह षट्भुज बंद है।","जमा ढेर पास में रखने से पिघलता है।","समान ऊपरी परतें मिल गईं।","{n} समान चिप हटे!","कोई खाली षट्भुज नहीं।","चाल सीमा पूरी हुई।","{score} अंक · {cleared} चिप · {moves} चाल","रंग","स्कोर","हटाना","बर्फ","रत्न","मिश्रित"],
ar:["ترتيب سداسي","اللغة","لغز الأكوام السداسية","ضع الأكوام واجمع ألوان القمة المتطابقة وشغّل السلاسل.","ابدأ اللعب","معاينة المالك · فحص القواعد","تتحرك الطبقات العليا المتطابقة فقط.","طريقة اللعب","اختر كومة من ثلاث ثم خلية سداسية فارغة.","تتجمع الطبقات العليا المتجاورة في أقوى كومة.","تُحذف عشر قطع متطابقة وتكشف السلسلة التالية.","أولوية ثابتة","تفوز الكمية الأكبر؛ التعادل للموقع الجديد ثم لترتيب اللوحة الثابت.","اختر مرحلة","اختر مهمة ترتيب مفتوحة.","دخول","الحركات","المحذوف","يُقفل التحكم أثناء الدمج. تتحرك السلسلة العليا المتطابقة فقط.","متابعة","مغادرة هذا الترتيب؟","المتابعة تحفظ كل الأكوام.","خريطة المراحل","اكتملت المهمة!","المرحلة التالية","العب مجدداً","اختر كومة أولاً.","اختر خلية فارغة ومفتوحة.","هذه الخلية محظورة.","تذوب الكومة المجمدة بوضع كومة مجاورة.","تجمعت الطبقات العليا المتطابقة.","تم حذف {n} قطعة متطابقة!","لا توجد خلية فارغة.","تم بلوغ حد الحركات.","{score} نقطة · {cleared} قطعة · {moves} حركة","اللون","النقاط","الحذف","الجليد","الجواهر","مختلط"]};
const N={en:"English","zh-Hant":"繁體中文","zh-Hans":"简体中文",ja:"日本語",ko:"한국어",es:"Español","pt-BR":"Português",fr:"Français",de:"Deutsch",it:"Italiano",ru:"Русский",hi:"हिन्दी",ar:"العربية"},I=Object.fromEntries(Object.entries(P).map(([l,v])=>[l,Object.fromEntries(K.map((k,i)=>[k,v[i]]))])),COLORS=["red","blue","green","gold","violet"],HEX={red:"#ff6685",blue:"#4c8cff",green:"#2ccbb4",gold:"#ffbd45",violet:"#a567e7",bomb:"#3d455c",rainbow:"#fff"},DIRECTIONS=[[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]],COORDS=[];for(let r=-2;r<=2;r++)for(let q=-2;q<=2;q++)if(Math.max(Math.abs(q),Math.abs(r),Math.abs(-q-r))<=2)COORDS.push({q,r});const indexByCoord=new Map(COORDS.map((c,i)=>[`${c.q},${c.r}`,i])),neighbors=i=>DIRECTIONS.map(([dq,dr])=>indexByCoord.get(`${COORDS[i].q+dq},${COORDS[i].r+dr}`)).filter(Number.isInteger);
const ANCHORED_RULES={
en:["Adjacent matching top runs move into the newly placed stack.","Anchored merge order","The newly placed stack stays put; only directly adjacent matching top runs move into it."],
"zh-Hant":["相鄰的同色頂層會移入新放置的堆疊。","定點合併順序","新放置的堆疊固定不動；只有直接相鄰的同色頂層會移入。"],
"zh-Hans":["相邻的同色顶层会移入新放置的堆叠。","定点合并顺序","新放置的堆叠固定不动；只有直接相邻的同色顶层会移入。"],
ja:["隣接する同色の上層は新しく置いたスタックへ移動します。","固定位置の合体順","新しく置いたスタックは動かず、直接隣接する同色の上層だけが移動します。"],
ko:["인접한 같은 색 윗층은 새로 놓은 스택으로 이동합니다.","고정 합치기 순서","새로 놓은 스택은 움직이지 않으며 바로 인접한 같은 색 윗층만 이동합니다."],
es:["Las capas superiores iguales adyacentes van a la pila recién colocada.","Fusión anclada","La pila nueva no se mueve; solo recibe capas iguales directamente adyacentes."],
"pt-BR":["Camadas superiores iguais adjacentes vão para a pilha recém-colocada.","Fusão ancorada","A pilha nova não se move; só recebe camadas iguais diretamente adjacentes."],
fr:["Les couches supérieures identiques voisines vont dans la pile nouvellement posée.","Fusion ancrée","La nouvelle pile reste en place et ne reçoit que ses voisines directes identiques."],
de:["Direkt benachbarte gleiche Deckschichten wandern in den neu gesetzten Stapel.","Verankerte Zusammenführung","Der neue Stapel bleibt stehen und nimmt nur direkt benachbarte gleiche Deckschichten auf."],
it:["Gli strati superiori uguali adiacenti vanno nella pila appena posizionata.","Unione ancorata","La nuova pila resta ferma e riceve solo strati uguali direttamente adiacenti."],
ru:["Соседние одинаковые верхние слои переходят в только что поставленную стопку.","Закреплённое слияние","Новая стопка остаётся на месте и принимает только непосредственно соседние одинаковые слои."],
hi:["पास की समान ऊपरी परतें नई रखी गई ढेरी में जाती हैं।","स्थिर विलय क्रम","नई ढेरी अपनी जगह रहती है; केवल सीधे पास की समान ऊपरी परतें उसमें जाती हैं।"],
ar:["تنتقل الطبقات العليا المتطابقة المجاورة إلى الكومة الموضوعة حديثاً.","دمج ثابت الموقع","تبقى الكومة الجديدة في مكانها ولا تستقبل إلا الطبقات المتطابقة المجاورة مباشرة."]
};
for(const [language,[how2,priorityTitle,priority]] of Object.entries(ANCHORED_RULES))Object.assign(I[language],{how2,priorityTitle,priority});
const MECHANIC_COPY={
en:["THAW ICE","COLLECT GEMS","Place the same top color beside a frozen stack to thaw it.","Clear 10 chips on or beside a ◆ gem cell to collect that gem.","Complete every shown goal before the move limit."],
"zh-Hant":["解凍冰塊","收集寶石","把同色頂層放在冰凍堆旁邊，才能解凍。","在 ◆ 寶石格或相鄰格消除 10 片，才能收集寶石。","在步數限制內完成畫面上的全部條件。"],
"zh-Hans":["解冻冰块","收集宝石","把同色顶层放在冰冻堆旁边，才能解冻。","在 ◆ 宝石格或相邻格消除 10 片，才能收集宝石。","在步数限制内完成画面上的全部条件。"],
ja:["氷を解かす","宝石を集める","凍結スタックの隣に同じ上面色を置くと解凍できます。","◆ 宝石マスまたは隣接マスで10枚消すと宝石を回収できます。","手数制限内に表示された全条件を達成してください。"],
ko:["얼음 녹이기","보석 모으기","얼어붙은 스택 옆에 같은 윗면 색을 놓아야 녹습니다.","◆ 보석 칸 또는 인접 칸에서 10개를 제거하면 보석을 획득합니다.","이동 제한 안에 표시된 모든 목표를 완료하세요."],
es:["DESCONGELAR","RECOGER GEMAS","Coloca el mismo color superior junto a una pila congelada para descongelarla.","Elimina 10 fichas en una casilla ◆ o adyacente para recoger la gema.","Completa todos los objetivos antes del límite de movimientos."],
"pt-BR":["DESCONGELAR","COLETAR GEMAS","Coloque a mesma cor superior ao lado de uma pilha congelada para descongelá-la.","Elimine 10 peças numa casa ◆ ou adjacente para coletar a gema.","Conclua todos os objetivos antes do limite de jogadas."],
fr:["DÉGELER","RAMASSER LES GEMMES","Placez la même couleur supérieure près d'une pile gelée pour la dégeler.","Effacez 10 jetons sur une case ◆ ou voisine pour récupérer la gemme.","Terminez tous les objectifs avant la limite de coups."],
de:["EIS TAUEN","JUWELEN SAMMELN","Setze dieselbe Deckfarbe neben einen gefrorenen Stapel, um ihn aufzutauen.","Lösche 10 Chips auf einem ◆-Feld oder daneben, um das Juwel zu sammeln.","Erfülle alle Ziele vor dem Zuglimit."],
it:["SCIOGLIERE IL GHIACCIO","RACCOGLIERE GEMME","Metti lo stesso colore superiore accanto a una pila gelata per scongelarla.","Elimina 10 gettoni su una casella ◆ o adiacente per raccogliere la gemma.","Completa tutti gli obiettivi entro il limite di mosse."],
ru:["РАСТОПИТЬ ЛЁД","СОБРАТЬ САМОЦВЕТЫ","Поставьте такой же верхний цвет рядом с замороженной стопкой, чтобы разморозить её.","Уберите 10 фишек на клетке ◆ или рядом с ней, чтобы получить самоцвет.","Выполните все цели до окончания лимита ходов."],
hi:["बर्फ पिघलाएँ","रत्न इकट्ठा करें","जमी हुई ढेरी के पास उसी ऊपरी रंग को रखकर उसे पिघलाएँ।","◆ रत्न खाने पर या उसके पास 10 चिप हटाकर रत्न पाएँ।","चाल सीमा से पहले दिखाए गए सभी लक्ष्य पूरे करें।"],
ar:["إذابة الجليد","جمع الجواهر","ضع اللون العلوي نفسه بجانب الكومة المتجمدة لإذابتها.","امسح 10 قطع على خانة ◆ أو بجانبها لجمع الجوهرة.","أكمل كل الأهداف الظاهرة قبل حد الحركات."]
};
for(const [language,[frozenGoal,gemGoal,freezeHint,gemHint,mixedHint]] of Object.entries(MECHANIC_COPY))Object.assign(I[language],{frozenGoal,gemGoal,freezeHint,gemHint,mixedHint});
const emptyCell=()=>({stack:[],blocked:false,stone:false,frozen:false,chained:false,gem:false}),cloneCells=cells=>cells.map(cell=>({...cell,stack:[...cell.stack]}));
// Explicit stage goals keep every mission reviewable and prevent generic completion shortcuts.
const STAGES=[
  {"number":1,"band":1,"colors":3,"objective":{"kind":"color","color":"red","target":10},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":2,"band":1,"colors":3,"objective":{"kind":"color","color":"blue","target":10},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":3,"band":1,"colors":3,"objective":{"kind":"color","color":"green","target":10},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":4,"band":1,"colors":3,"objective":{"kind":"color","color":"red","target":10},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":5,"band":1,"colors":3,"objective":{"kind":"color","color":"blue","target":10},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":6,"band":2,"colors":3,"objective":{"kind":"score","target":180},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":7,"band":2,"colors":3,"objective":{"kind":"score","target":220},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":8,"band":2,"colors":3,"objective":{"kind":"score","target":260},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":9,"band":2,"colors":4,"objective":{"kind":"score","target":300},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":10,"band":2,"colors":4,"objective":{"kind":"score","target":340},"features":{"blocked":0,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":11,"band":3,"colors":4,"objective":{"kind":"clears","target":1},"features":{"blocked":1,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":12,"band":3,"colors":4,"objective":{"kind":"clears","target":1},"features":{"blocked":2,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":13,"band":3,"colors":4,"objective":{"kind":"clears","target":2},"features":{"blocked":1,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":14,"band":3,"colors":4,"objective":{"kind":"clears","target":2},"features":{"blocked":2,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":15,"band":3,"colors":4,"objective":{"kind":"clears","target":3},"features":{"blocked":1,"frozen":0,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":16,"band":4,"colors":4,"objective":{"kind":"frozen","target":1},"features":{"blocked":2,"frozen":1,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":17,"band":4,"colors":4,"objective":{"kind":"frozen","target":2},"features":{"blocked":2,"frozen":2,"gems":0,"chains":0,"stone":0,"rainbow":false,"bomb":false}},
  {"number":18,"band":4,"colors":5,"objective":{"kind":"frozen","target":2},"features":{"blocked":3,"frozen":2,"gems":0,"chains":1,"stone":0,"rainbow":false,"bomb":false}},
  {"number":19,"band":4,"colors":5,"objective":{"kind":"frozen","target":3},"features":{"blocked":2,"frozen":3,"gems":0,"chains":1,"stone":1,"rainbow":false,"bomb":false}},
  {"number":20,"band":4,"colors":5,"objective":{"kind":"frozen","target":3},"features":{"blocked":3,"frozen":3,"gems":0,"chains":2,"stone":1,"rainbow":false,"bomb":false}},
  {"number":21,"band":5,"colors":5,"objective":{"kind":"gems","target":1},"features":{"blocked":2,"frozen":1,"gems":1,"chains":1,"stone":1,"rainbow":false,"bomb":false}},
  {"number":22,"band":5,"colors":5,"objective":{"kind":"gems","target":2},"features":{"blocked":2,"frozen":1,"gems":2,"chains":2,"stone":1,"rainbow":false,"bomb":false}},
  {"number":23,"band":5,"colors":5,"objective":{"kind":"gems","target":2},"features":{"blocked":3,"frozen":2,"gems":2,"chains":2,"stone":1,"rainbow":false,"bomb":false}},
  {"number":24,"band":5,"colors":5,"objective":{"kind":"gems","target":2},"features":{"blocked":2,"frozen":2,"gems":3,"chains":2,"stone":2,"rainbow":false,"bomb":false}},
  {"number":25,"band":5,"colors":5,"objective":{"kind":"gems","target":3},"features":{"blocked":3,"frozen":2,"gems":3,"chains":3,"stone":2,"rainbow":false,"bomb":false}},
  {"number":26,"band":6,"colors":5,"objective":{"kind":"mixed","clearsTarget":2,"gemsTarget":1,"thawTarget":1,"movesLimit":18},"features":{"blocked":2,"frozen":1,"gems":1,"chains":1,"stone":1,"rainbow":true,"bomb":true}},
  {"number":27,"band":6,"colors":5,"objective":{"kind":"mixed","clearsTarget":2,"gemsTarget":1,"thawTarget":2,"movesLimit":17},"features":{"blocked":2,"frozen":2,"gems":2,"chains":2,"stone":1,"rainbow":true,"bomb":true}},
  {"number":28,"band":6,"colors":5,"objective":{"kind":"mixed","clearsTarget":3,"gemsTarget":2,"thawTarget":1,"movesLimit":16},"features":{"blocked":3,"frozen":2,"gems":2,"chains":2,"stone":2,"rainbow":true,"bomb":true}},
  {"number":29,"band":6,"colors":5,"objective":{"kind":"mixed","clearsTarget":3,"gemsTarget":2,"thawTarget":2,"movesLimit":15},"features":{"blocked":3,"frozen":3,"gems":3,"chains":3,"stone":2,"rainbow":true,"bomb":true}},
  {"number":30,"band":6,"colors":5,"objective":{"kind":"mixed","clearsTarget":4,"gemsTarget":2,"thawTarget":2,"movesLimit":14},"features":{"blocked":3,"frozen":3,"gems":3,"chains":3,"stone":2,"rainbow":true,"bomb":true}}
];
function topRun(stack,color=null){if(!stack.length)return{color:null,count:0};let resolved=color||stack[stack.length-1];if(resolved==="rainbow")return{color:"rainbow",count:1};if(resolved==="bomb")return{color:"bomb",count:1};let count=0;for(let i=stack.length-1;i>=0;i--){if(stack[i]===resolved||stack[i]==="rainbow")count++;else break;}return{color:resolved,count};}
function effectiveColor(cell,fallback=null){const top=cell?.stack.at(-1);return top==="rainbow"?fallback||"rainbow":top||null;}
function normalizeRainbow(cells,index,objectiveColor){if(cells[index]?.stack.at(-1)!=="rainbow")return;const counts=new Map();for(const n of neighbors(index)){const color=effectiveColor(cells[n]);if(color&&color!=="rainbow"&&color!=="bomb")counts.set(color,(counts.get(color)||0)+topRun(cells[n].stack,color).count);}const color=[...counts].sort((a,b)=>b[1]-a[1]||COLORS.indexOf(a[0])-COLORS.indexOf(b[0]))[0]?.[0]||objectiveColor||COLORS[0];for(let i=cells[index].stack.length-1;i>=0&&cells[index].stack[i]==="rainbow";i--)cells[index].stack[i]=color;}
function component(cells,start,color){const found=[],queue=[start],seen=new Set();while(queue.length){const index=queue.shift();if(seen.has(index))continue;seen.add(index);const cell=cells[index],current=effectiveColor(cell);if(!cell||cell.frozen||cell.chained||(current!==color&&current!=="rainbow"))continue;if(current==="rainbow")for(let layer=cell.stack.length-1;layer>=0&&cell.stack[layer]==="rainbow";layer--)cell.stack[layer]=color;found.push(index);queue.push(...neighbors(index));}return found;}
function resolveModel(input,placedIndex,objectiveColor=null,threshold=10){const cells=cloneCells(input),trace=[],queue=[placedIndex],queued=new Set([placedIndex]),stats={cleared:0,clears:0,gems:0,thawed:0,score:0},placedColor=effectiveColor(cells[placedIndex]);for(const n of neighbors(placedIndex)){if(!cells[n])continue;const frozenColor=effectiveColor(cells[n],placedColor),matchesFrozen=placedColor==="rainbow"||placedColor===frozenColor;if(cells[n].frozen&&matchesFrozen){stats.thawed++;cells[n].frozen=false;trace.push({type:"thaw",target:n,sources:[placedIndex],color:frozenColor,count:1});}if(cells[n].chained)cells[n].chained=false;}const enqueue=index=>{if(Number.isInteger(index)&&!queued.has(index)){queued.add(index);queue.push(index);}};let guard=0;while(queue.length&&guard++<120){const index=queue.shift();queued.delete(index);const cell=cells[index];if(!cell?.stack.length||cell.frozen||cell.chained)continue;normalizeRainbow(cells,index,objectiveColor);const color=effectiveColor(cell);if(color==="bomb"){cell.stack.pop();const affected=[];for(const n of neighbors(index)){const run=topRun(cells[n].stack);if(run.count){cells[n].stack.splice(-run.count);stats.cleared+=run.count;stats.score+=run.count*12;affected.push(n);}}trace.push({type:"bomb",target:index,sources:affected,color:"bomb",count:affected.length});enqueue(index);affected.forEach(enqueue);continue;}if(!color)continue;const sources=neighbors(index).filter(source=>{const sourceCell=cells[source],sourceColor=effectiveColor(sourceCell,color);return sourceCell?.stack.length&&!sourceCell.frozen&&!sourceCell.chained&&(sourceColor===color||sourceColor==="rainbow");}).sort((a,b)=>a-b);if(!sources.length)continue;const target=index,transfers=[];let moved=0;for(const source of sources){const run=topRun(cells[source].stack,color);if(!run.count)continue;const chips=cells[source].stack.splice(-run.count).map(chip=>chip==="rainbow"?color:chip);cells[target].stack.push(...chips);moved+=chips.length;transfers.push({source,count:chips.length});}if(!moved)continue;trace.push({type:"merge",target,sources:transfers.map(item=>item.source),transfers,color,count:moved});stats.score+=moved*3;const targetRun=topRun(cells[target].stack,color);if(targetRun.count>=threshold){cells[target].stack.splice(-targetRun.count);stats.cleared+=targetRun.count;stats.clears++;stats.score+=targetRun.count*10;if(cells[target].gem){cells[target].gem=false;stats.gems++;}const blocked=cells.find(cell=>cell.blocked);if(blocked)blocked.blocked=false;trace.push({type:"clear",target,sources:[],color,count:targetRun.count});}enqueue(target);transfers.forEach(({source})=>enqueue(source));}
return{cells,trace,stats};}
const resolveWithoutAdjacentGemReward=resolveModel;
resolveModel=(input,placedIndex,objectiveColor=null,threshold=10)=>{
  const result=resolveWithoutAdjacentGemReward(input,placedIndex,objectiveColor,threshold),expanded=[],rewarded=new Set();
  for(const step of result.trace){
    expanded.push(step);
    if(step.type!=="clear")continue;
    let gemIndex=-1,alreadyCounted=false;
    if(input[step.target]?.gem&&!result.cells[step.target].gem&&!rewarded.has(step.target)){gemIndex=step.target;alreadyCounted=true;}
    else gemIndex=neighbors(step.target).find(index=>result.cells[index]?.gem&&!rewarded.has(index))??-1;
    if(gemIndex>=0){
      rewarded.add(gemIndex);
      result.cells[gemIndex].gem=false;
      if(!alreadyCounted)result.stats.gems++;
      expanded.push({type:"gem",target:gemIndex,sources:[step.target],color:"gem",count:1});
    }
  }
  result.trace=expanded;
  return result;
};
function validateMergeContracts(){const blank=()=>COORDS.map(emptyCell),center=indexByCoord.get("0,0"),ns=neighbors(center);let cells=blank();cells[center].stack=["red","red","red"];cells[ns[0]].stack=["red","red","red"];let result=resolveModel(cells,center,"red",10);if(result.cells[center].stack.length!==6||result.cells[ns[0]].stack.length)throw new Error("Hexa Sort placed anchor failed");cells=blank();cells[center].stack=["red"];cells[ns[0]].stack=["red","red","red"];cells[ns[1]].stack=["red","red","red"];result=resolveModel(cells,center,"red",10);if(result.cells[center].stack.length!==7||result.trace.some(step=>step.type==="merge"&&step.sources.some(source=>!neighbors(step.target).includes(source))))throw new Error("Hexa Sort direct-neighbor anchor failed");cells=blank();cells[center].stack=["rainbow"];cells[ns[0]].stack=["green","green","green"];result=resolveModel(cells,center,"red",10);if(result.cells[center].stack.length!==4||result.cells[center].stack.at(-1)!=="green")throw new Error("Hexa Sort rainbow resolution failed");cells=blank();cells[center].stack=["bomb"];cells[ns[0]].stack=["red","red"];cells[ns[1]].stack=["blue","blue","blue"];result=resolveModel(cells,center,"red",10);if(result.stats.cleared!==5||result.cells[ns[0]].stack.length||result.cells[ns[1]].stack.length)throw new Error("Hexa Sort bomb resolution failed");return true;}
const MERGE_CONTRACTS_VALID=validateMergeContracts();
let locale=localStorage.wpLang||"en",sound=localStorage.wpSound!=="off",unlocked=Math.max(1,Math.min(30,Number(localStorage.hexaSortUnlocked)||1)),selectedStage=unlocked,currentStage=1,cells=[],tray=[],selected=-1,moves=0,cleared=0,clears=0,gems=0,thawed=0,score=0,generation=0,busy=false,lastFocus=null,chipObjectSerial=0,clearedByColor=Object.fromEntries(COLORS.map(c=>[c,0])),animTarget=-1,animSources=[];
const t=(k,v={})=>String((I[locale]||I.en)[k]||k).replace(/\{(\w+)\}/g,(_,n)=>v[n]??"");
function setupBoard(def){
  cells=COORDS.map(emptyCell);
  const center=indexByCoord.get("0,0"),ring=neighbors(center),palette=COLORS.slice(0,def.colors);
  if(def.number<=15){
    const a=ring[0],b=ring[2],target=def.objective.color||COLORS[(def.number-1)%def.colors],lower=COLORS[(COLORS.indexOf(target)+1)%def.colors];
    cells[a].stack=[lower,target,target,target,target];
    cells[b].stack=[target,target,target];
    const extras=ring.filter(i=>i!==a&&i!==b);
    if(extras[0]!=null)cells[extras[0]].stack=[lower,lower];
    const obstacleCandidates=cells.map((cell,index)=>({cell,index})).filter(({index})=>index!==center&&!cells[index].stack.length).map(({index})=>index),takeObstacle=seed=>obstacleCandidates.splice(seed%obstacleCandidates.length,1)[0];
    for(let i=0;i<def.features.blocked&&obstacleCandidates.length;i++)cells[takeObstacle(def.number*3+i*5)].blocked=true;
    for(let i=0;i<def.features.stone&&obstacleCandidates.length;i++)cells[takeObstacle(def.number*7+i*4+2)].stone=true;
    return;
  }
  const rotatedRing=[...ring.slice(def.number%ring.length),...ring.slice(0,def.number%ring.length)],outer=COORDS.map((_,index)=>index).filter(index=>index!==center&&!ring.includes(index)),rotatedOuter=[...outer.slice(def.number%outer.length),...outer.slice(0,def.number%outer.length)],stackCount=def.number<=20?6:def.number<=25?7:8,stackPositions=[...rotatedRing,...rotatedOuter].slice(0,stackCount);
  stackPositions.forEach((index,i)=>{
    const top=palette[(def.number+i*2)%palette.length],middle=palette[(def.number+i*2+1)%palette.length],bottom=palette[(def.number+i*3+2)%palette.length],run=2+((def.number+i)%3);
    cells[index].stack=[bottom,middle,...Array(run).fill(top)];
  });
  const frozenCandidates=[...rotatedRing,...rotatedOuter].filter(index=>cells[index].stack.length);
  for(let i=0;i<def.features.frozen&&i<frozenCandidates.length;i++)cells[frozenCandidates[i]].frozen=true;
  const chainCandidates=[...rotatedRing,...rotatedOuter].filter(index=>cells[index].stack.length&&!cells[index].frozen);
  for(let i=0;i<def.features.chains&&i<chainCandidates.length;i++)cells[chainCandidates[i]].chained=true;
  const open=cells.map((cell,index)=>({cell,index})).filter(({index})=>index!==center&&!cells[index].stack.length).map(({index})=>index),takeOpen=seed=>open.splice(seed%open.length,1)[0];
  for(let i=0;i<def.features.blocked&&open.length;i++)cells[takeOpen(def.number*3+i*5)].blocked=true;
  for(let i=0;i<def.features.stone&&open.length;i++)cells[takeOpen(def.number*7+i*4+2)].stone=true;
  const gemCandidates=[center,...open].filter(index=>!cells[index].blocked&&!cells[index].stone&&!cells[index].stack.length);
  for(let i=0;i<def.features.gems&&i<gemCandidates.length;i++)cells[gemCandidates[i]].gem=true;
}
function boardTopWeights(def){const values=[];for(const cell of cells){const color=effectiveColor(cell);if(COLORS.includes(color))values.push(color);}return values.length?values:[def.objective.color||COLORS[(def.number-1)%def.colors]];}
function makeTray(){
  generation++;
  const def=STAGES[currentStage-1],weights=boardTopWeights(def),target=def.objective.color||weights[0],palette=COLORS.slice(0,def.colors);
  if(def.number<=15){
    const color=i=>weights[(generation+i)%weights.length]||COLORS[(generation+i)%def.colors];
    tray=[[color(1),target,target,target],[color(2),color(2),target],[color(3),target,color(3)]];
  }else{
    const frozenColors=cells.filter(cell=>cell.frozen).map(cell=>effectiveColor(cell)).filter(color=>palette.includes(color)),topChoices=[frozenColors[0],frozenColors[1],weights[generation%weights.length]].map((color,i)=>color||palette[(def.number+generation+i)%palette.length]);
    tray=topChoices.map((top,i)=>{
      const bottom=palette[(def.number+generation+i*2+1)%palette.length],middle=palette[(def.number+generation+i*3+2)%palette.length],middleRun=1+((def.number+generation+i)%2),topRunCount=2+((def.number+i)%2);
      return[bottom,...Array(middleRun).fill(middle),...Array(topRunCount).fill(top)];
    });
  }
  if(def.features.rainbow)tray[1][tray[1].length-1]="rainbow";
  if(def.features.bomb&&generation%2===0)tray[2][tray[2].length-1]="bomb";
  selected=-1;
}
function objectiveKey(def){return{color:"colorGoal",score:"scoreGoal",clears:"clearGoal",frozen:"frozenGoal",gems:"gemGoal",mixed:"mixedGoal"}[def.objective.kind];}
function objectiveRule(def){const text=def.objective.kind==="frozen"?t("freezeHint"):def.objective.kind==="gems"?t("gemHint"):def.objective.kind==="mixed"?t("mixedHint"):t("how3");$("helpObjectiveRule")?.replaceChildren(text);return text;}
function stageObjectiveValue(def){const o=def.objective;return o.target??`≤${o.movesLimit}`;}
function progress(def){const o=def.objective;if(o.kind==="color")return`${clearedByColor[o.color]||0} / ${o.target}`;if(o.kind==="score")return`${score} / ${o.target}`;if(o.kind==="clears")return`${clears} / ${o.target}`;if(o.kind==="frozen")return`${thawed} / ${o.target}`;if(o.kind==="gems")return`${gems} / ${o.target}`;return`${clears}/${o.clearsTarget} · ${gems}/${o.gemsTarget} · ${thawed}/${o.thawTarget} · ${moves}/${o.movesLimit}`;}
function objectiveMet(def,stats){const o=def.objective;if(o.kind==="color")return(stats.clearedByColor[o.color]||0)>=o.target;if(o.kind==="score")return stats.score>=o.target;if(o.kind==="clears")return stats.clears>=o.target;if(o.kind==="frozen")return stats.thawed>=o.target;if(o.kind==="gems")return stats.gems>=o.target;return stats.clears>=o.clearsTarget&&stats.gems>=o.gemsTarget&&stats.thawed>=o.thawTarget;}
function won(def){return objectiveMet(def,{clearedByColor,score,clears,gems,thawed});}
function setScreen(s){document.body.dataset.screen=s;$("mainGroup").hidden=s!=="main";$("stageScreen").hidden=s!=="stage";$("battleScreen").hidden=s!=="battle";document.body.classList.toggle("is-game-playing",s==="battle");if(s==="stage")$("stageScreen").querySelector(".wp-stage-physical-reserve")?.setAttribute("data-wp-stage-reserve-active","");window.dispatchEvent(new Event("weightplay:stage-sync"));window.dispatchEvent(new Event("weightplay:shell-sync"));}
function applyLocale(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(n=>n.textContent=t(n.dataset.i18n));$("localeSelect").value=locale;$("localeSelect").setAttribute("aria-label",t("language"));$("stageBack").setAttribute("aria-label",t("chooseStage"));$("battleBack").setAttribute("aria-label",t("stageMap"));$("battleHelp").setAttribute("aria-label",t("howTitle"));$("stageRail").setAttribute("aria-label",t("chooseStage"));$("hexBoard").setAttribute("aria-label",t("title"));$("stackTray").setAttribute("aria-label",t("guideTitle"));document.querySelector(".guide")?.setAttribute("aria-label",t("howTitle"));document.querySelectorAll(".poster,.result-layout img").forEach(n=>n.setAttribute("alt",t("title")));$("mainProgress").textContent=`${unlocked} / 30`;renderStages();if(cells.length)render();window.dispatchEvent(new Event("wonder:locale-change"));}function syncSound(){for(const id of["soundToggle","stageSound"]){$(id).textContent=sound?"🔊":"🔇";$(id).setAttribute("aria-pressed",String(sound));}}
function renderStages(){if(!$("stageRail"))return;$("stageSummary").textContent=`${unlocked} / 30`;$("stageRail").innerHTML=STAGES.map(s=>`<button class="stage-card" data-stage="${s.number}" data-stage-index="${s.number-1}" ${s.number>unlocked?"disabled":""} aria-current="${s.number===selectedStage}"><span class="stage-number">${String(s.number).padStart(2,"0")}</span><small>${t(objectiveKey(s))}</small><strong>${stageObjectiveValue(s)}</strong></button>`).join("");$("enterStage").disabled=selectedStage>unlocked;}
function chipMarkup(stack){return`<span class="chip-stack" style="--layers:${stack.length}">${stack.map((chip,i)=>`<i class="chip ${i===stack.length-1?"top-chip":""} ${chip==="bomb"||chip==="rainbow"?"special":""}" data-chip="${chip}" data-object-id="chip-${++chipObjectSerial}" style="--layer:${i};--chip:${HEX[chip]||HEX.red}">${chip==="bomb"?"✹":chip==="rainbow"?"★":""}</i>`).join("")}</span><b class="stack-count">${stack.length?`×${stack.length}`:""}</b>`;}
function mergePreviewCount(index,stack,def){if(!stack?.length)return 0;let color=stack.at(-1);if(color==="rainbow")color=def.objective.color||boardTopWeights(def)[0];if(!COLORS.includes(color))return 0;return neighbors(index).reduce((sum,n)=>{const cell=cells[n];if(!cell||cell.frozen||cell.chained)return sum;const neighborColor=effectiveColor(cell,color);return neighborColor===color||neighborColor==="rainbow"?sum+topRun(cell.stack,color).count:sum;},0);}
function render(){const def=STAGES[currentStage-1],tutorial=currentStage===1&&moves===0,chosen=tray[selected],center=indexByCoord.get("0,0"),coachKey=moves?"how3":selected<0?"how1":"how2",coachStep=moves?3:selected<0?1:2;$("hexaCoach").className=`hexa-coach step-${coachStep}`;$("hexaCoach").innerHTML=`<b>${coachStep}</b><span>${t(coachKey)}</span>`;$("hexBoard").innerHTML=cells.map((cell,i)=>{const legal=!cell.stack.length&&!cell.blocked&&!cell.stone,mergeCount=selected>=0&&legal?mergePreviewCount(i,chosen,def):0,coachTarget=tutorial&&selected===0&&i===center,depth=Math.round((COORDS[i].r+COORDS[i].q*.5+3)*10),mechanicLabel=`${cell.frozen?`, ${t("frozenGoal")}`:""}${cell.gem?`, ${t("gemGoal")}`:""}`;return`<button type="button" class="hex-cell ${legal?"selectable":""} ${selected>=0&&legal?"drop-target":""} ${mergeCount?"merge-ready":""} ${coachTarget?"coach-target":""} ${cell.blocked?"blocked":""} ${cell.stone?"stone":""} ${cell.frozen?"frozen":""} ${cell.chained?"chained":""} ${cell.gem?"gem":""} ${animTarget===i?"merge-target":""} ${animSources.includes(i)?"merge-source":""}" data-hex="${i}" data-merge="${mergeCount}" style="--q:${COORDS[i].q};--r:${COORDS[i].r};--depth:${depth}" aria-label="hex ${i+1}${cell.stack.length?`, ×${cell.stack.length}`:""}${mechanicLabel}${mergeCount?`, ${t("how2")} +${mergeCount}`:""}" ${cell.blocked||cell.stone?"disabled":""}>${cell.stone?"◆":cell.blocked?"×":cell.stack.length?chipMarkup(cell.stack):""}</button>`;}).join("");$("stackTray").innerHTML=tray.map((stack,i)=>`<button type="button" class="tray-stack ${i===selected?"selected":""} ${tutorial&&selected<0&&i===0?"coach-choice":""}" data-stack="${i}" aria-label="${t("how1")} ${i+1}, ×${stack.length}">${chipMarkup(stack)}</button>`).join("");$("movesValue").textContent=moves;$("clearedValue").textContent=cleared;$("stageLabel").textContent=`STAGE ${currentStage}`;$("objectiveKind").textContent=t(objectiveKey(def));$("objectiveKind").classList.toggle("has-goal-color",!!def.objective.color);$("objectiveKind").style.setProperty("--goal-color",HEX[def.objective.color]||"transparent");$("objectiveText").textContent=progress(def);$("objectiveRule").textContent=objectiveRule(def);}
function renderSettled(){const def=STAGES[currentStage-1];$("hexBoard").querySelectorAll("[data-hex]").forEach((node,index)=>{const cell=cells[index],legal=!cell.stack.length&&!cell.blocked&&!cell.stone;node.classList.toggle("selectable",legal);node.classList.toggle("blocked",cell.blocked);node.classList.toggle("stone",cell.stone);node.classList.toggle("frozen",cell.frozen);node.classList.toggle("chained",cell.chained);node.classList.toggle("gem",cell.gem);node.classList.remove("drop-target","merge-ready","coach-target","merge-target","merge-source","active-flight-source");node.dataset.merge="0";node.disabled=cell.blocked||cell.stone;node.setAttribute("aria-label",`hex ${index+1}${cell.stack.length?`, ×${cell.stack.length}`:""}`);if(!cell.stack.length&&!cell.stone&&!cell.blocked)node.querySelector(".chip-stack")?.remove();if(!cell.stack.length&&!cell.stone&&!cell.blocked&&node.textContent.trim()==="×")node.textContent="";});$("hexaCoach").className="hexa-coach step-3";$("hexaCoach").innerHTML=`<b>3</b><span>${t("how3")}</span>`;$("stackTray").innerHTML=tray.map((stack,i)=>`<button type="button" class="tray-stack" data-stack="${i}" aria-label="${t("how1")} ${i+1}, ×${stack.length}">${chipMarkup(stack)}</button>`).join("");$("movesValue").textContent=moves;$("clearedValue").textContent=cleared;$("stageLabel").textContent=`STAGE ${currentStage}`;$("objectiveKind").textContent=t(objectiveKey(def));$("objectiveKind").classList.toggle("has-goal-color",!!def.objective.color);$("objectiveKind").style.setProperty("--goal-color",HEX[def.objective.color]||"transparent");$("objectiveText").textContent=progress(def);}
function startStage(n){currentStage=selectedStage=n;moves=cleared=clears=gems=thawed=score=generation=0;clearedByColor=Object.fromEntries(COLORS.map(c=>[c,0]));busy=false;setupBoard(STAGES[n-1]);makeTray();setScreen("battle");$("feedback").textContent="";hide("resultModal");render();}
function show(id,focus){lastFocus=document.activeElement;$(id).hidden=false;$(focus).focus();}function hide(id){$(id).hidden=true;lastFocus?.focus?.();}
async function animateTrace(trace){
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flightDuration=reduced?250:470;
  const settleDuration=reduced?45:90;
  const landingBeat=reduced?110:190;
  const clearDuration=reduced?260:520;
  const revealBeat=reduced?140:280;
  const board=$("hexBoard");
  board.dataset.departures="0";
  board.dataset.arrivals="0";
  board.dataset.maxLandingError="0";
  board.dataset.maxConcurrent="0";
  board.dataset.activeFlights="0";
  board.dataset.movedObjects="";
  board.dataset.objectSteps="[]";
  board.dataset.effectTimeline="[]";
  board.dataset.nonTopDepartures="0";
  const flightLayer=document.createElement("div");
  flightLayer.className="chip-flight-layer";
  board.append(flightLayer);
  const markEffect=(type,details={})=>{
    const timeline=JSON.parse(board.dataset.effectTimeline||"[]");
    timeline.push({type,at:performance.now(),...details});
    board.dataset.effectTimeline=JSON.stringify(timeline);
  };
  const syncStack=stack=>{
    if(!stack)return;
    const chips=[...stack.querySelectorAll(":scope > .chip")];
    chips.forEach((chip,index)=>{
      chip.style.setProperty("--layer",index);
      chip.classList.toggle("top-chip",index===chips.length-1);
    });
    stack.style.setProperty("--layers",chips.length);
  };
  const recordStep=(source,target,chip)=>{
    const steps=JSON.parse(board.dataset.objectSteps||"[]");
    steps.push({source,target,objectId:chip.dataset.objectId,color:chip.dataset.chip,sourceCount:source.querySelectorAll(":scope > .chip").length,targetCount:target.querySelectorAll(":scope > .chip").length});
    board.dataset.objectSteps=JSON.stringify(steps);
  };
  const moveObject=async(sourceCell,targetCell,chip,color)=>{
    const sourceStack=sourceCell.querySelector(".chip-stack"),targetStack=targetCell.querySelector(".chip-stack");
    if(!sourceStack||!targetStack||!chip)return;
    if(!chip.classList.contains("top-chip"))board.dataset.nonTopDepartures=String(Number(board.dataset.nonTopDepartures)+1);
    const from=chip.getBoundingClientRect();
    if(chip.dataset.chip==="rainbow"&&color){chip.dataset.chip=color;chip.style.setProperty("--chip",HEX[color]);chip.textContent="";chip.classList.remove("special");}
    targetStack.append(chip);
    syncStack(sourceStack);
    syncStack(targetStack);
    const to=chip.getBoundingClientRect();
    const boardRect=board.getBoundingClientRect();
    flightLayer.append(chip);
    syncStack(sourceStack);
    syncStack(targetStack);
    Object.assign(chip.style,{left:`${from.left-boardRect.left}px`,top:`${from.top-boardRect.top}px`,bottom:"auto",width:`${from.width}px`,height:`${from.height}px`});
    const dx=to.left-from.left;
    const dy=to.top-from.top;
    const arc=reduced?12:32;
    const active=Number(board.dataset.activeFlights)+1;
    board.dataset.activeFlights=String(active);
    board.dataset.maxConcurrent=String(Math.max(Number(board.dataset.maxConcurrent),active));
    board.dataset.departures=String(Number(board.dataset.departures)+1);
    markEffect("departure",{color:chip.dataset.chip});
    board.dataset.movedObjects=[board.dataset.movedObjects,chip.dataset.objectId].filter(Boolean).join(",");
    sourceCell.classList.add("active-flight-source");
    chip.classList.add("chip-in-transit");
    const motion=chip.animate([
      {transform:"translate(0,0) scale(.98)"},
      {transform:`translate(${dx*.52}px,${dy*.52-arc}px) scale(1.08)`,offset:.52},
      {transform:`translate(${dx}px,${dy}px) scale(1)`}
    ],{duration:flightDuration,easing:"cubic-bezier(.22,.66,.2,1)",fill:"both"});
    try{await motion.finished;}catch{}
    motion.cancel();
    targetStack.append(chip);
    for(const property of["left","top","bottom","width","height"])chip.style.removeProperty(property);
    syncStack(targetStack);
    chip.classList.remove("chip-in-transit");
    sourceCell.classList.remove("active-flight-source");
    board.dataset.activeFlights=String(Math.max(0,Number(board.dataset.activeFlights)-1));
    const landed=chip.getBoundingClientRect();
    const landingError=Math.hypot(landed.left+landed.width/2-(to.left+to.width/2),landed.top+landed.height/2-(to.top+to.height/2));
    board.dataset.maxLandingError=String(Math.max(Number(board.dataset.maxLandingError),landingError));
    board.dataset.arrivals=String(Number(board.dataset.arrivals)+1);
    recordStep(sourceStack,targetStack,chip);
    chip.classList.add("chip-settled");
    await new Promise(resolve=>setTimeout(resolve,settleDuration));
    chip.classList.remove("chip-settled");
  };
  for(const step of trace){
    if(step.type==="thaw"){
      const thawCell=board.querySelector(`[data-hex="${step.target}"]`);
      thawCell?.classList.add("thawing");
      await new Promise(resolve=>setTimeout(resolve,reduced?220:460));
      thawCell?.classList.remove("frozen","thawing");
    }
    if(step.type==="gem"){
      const gemCell=board.querySelector(`[data-hex="${step.target}"]`);
      gemCell?.classList.add("gem-collected");
      await new Promise(resolve=>setTimeout(resolve,reduced?220:460));
      gemCell?.classList.remove("gem","gem-collected");
    }
    if(step.type==="merge"){
      animTarget=step.target;
      animSources=[...step.sources];
      const targetCell=board.querySelector(`[data-hex="${step.target}"]`);
      const targetStack=targetCell?.querySelector(".chip-stack");
      if(!targetCell||!targetStack)continue;
      targetCell.classList.add("merge-target");
      for(const {source,count} of (step.transfers||step.sources.map(source=>({source,count:1})))){
        const sourceCell=board.querySelector(`[data-hex="${source}"]`);
        if(!sourceCell)continue;
        sourceCell.classList.add("merge-source");
        for(let layer=0;layer<count;layer++){
          const sourceChip=sourceCell.querySelector(".chip-stack > .chip:last-child");
          await moveObject(sourceCell,targetCell,sourceChip,step.color);
        }
        sourceCell.classList.remove("merge-source");
      }
      await new Promise(r=>setTimeout(r,landingBeat));
      targetCell.classList.remove("merge-target");
      animTarget=-1;
      animSources=[];
    }
    if(step.type==="clear"){
      const clearCell=$("hexBoard").querySelector(`[data-hex="${step.target}"]`);
      const clearStack=clearCell?.querySelector(".chip-stack");
      const clearing=[...(clearStack?.querySelectorAll(":scope > .chip")||[])].slice(-step.count);
      clearCell?.classList.add("clear-burst");
      clearing.forEach(chip=>chip.classList.add("chip-clearing"));
      markEffect("clear-start",{color:step.color,count:clearing.length});
      await new Promise(r=>setTimeout(r,clearDuration));
      clearing.forEach(chip=>chip.remove());
      syncStack(clearStack);
      markEffect("clear-removed",{color:step.color,count:clearing.length});
      const revealed=clearStack?.querySelector(":scope > .chip:last-child");
      revealed?.classList.add("chip-revealed");
      await new Promise(r=>setTimeout(r,revealBeat));
      markEffect("reveal-beat",{color:revealed?.dataset.chip||"none"});
      revealed?.classList.remove("chip-revealed");
      clearCell?.classList.remove("clear-burst");
    }
  }
  animTarget=-1;
  animSources=[];
  flightLayer.remove();
}
async function place(index){if(busy)return;if(selected<0){$("feedback").textContent=t("selectStack");return;}const cell=cells[index];if(cell.blocked||cell.stone){$("feedback").textContent=t("blocked");return;}if(cell.stack.length){$("feedback").textContent=t("invalid");return;}busy=true;cell.stack=[...tray[selected]];tray.splice(selected,1);selected=-1;moves++;render();const def=STAGES[currentStage-1],result=resolveModel(cells,index,def.objective.color);await animateTrace(result.trace);cells=result.cells;cleared+=result.stats.cleared;clears+=result.stats.clears;gems+=result.stats.gems;thawed+=result.stats.thawed;score+=result.stats.score+20;for(const step of result.trace)if(step.type==="clear"&&COLORS.includes(step.color))clearedByColor[step.color]=(clearedByColor[step.color]||0)+step.count;$("feedback").textContent=result.stats.cleared?t("clearedMsg",{n:result.stats.cleared}):result.trace.some(s=>s.type==="merge")?t("merged"):"";if(!tray.length)makeTray();result.trace.some(step=>step.type==="bomb")?render():renderSettled();busy=false;if(won(def)){unlocked=Math.max(unlocked,Math.min(30,currentStage+1));localStorage.hexaSortUnlocked=unlocked;$("resultTitle").textContent=t("clear");$("resultStage").textContent=`STAGE ${currentStage}`;$("resultText").textContent=t("result",{score,cleared,moves});$("nextBtn").disabled=currentStage===30;show("resultModal",currentStage===30?"retryBtn":"nextBtn");return;}if(def.objective.movesLimit&&moves>=def.objective.movesLimit){$("resultTitle").textContent=t("limitFail");$("resultText").textContent=t("result",{score,cleared,moves});$("nextBtn").disabled=true;show("resultModal","retryBtn");return;}if(!cells.some(cell=>!cell.stack.length&&!cell.blocked&&!cell.stone)){$("resultTitle").textContent=t("gameOver");$("resultText").textContent=t("result",{score,cleared,moves});$("nextBtn").disabled=true;show("resultModal","retryBtn");}}
$("localeSelect").innerHTML=Object.entries(N).map(([v,n])=>`<option value="${v}">${n}</option>`).join("");$("localeSelect").onchange=e=>{locale=e.target.value;localStorage.wpLang=locale;applyLocale();};for(const id of["soundToggle","stageSound"])$(id).onclick=()=>{sound=!sound;localStorage.wpSound=sound?"on":"off";syncSound();};$("startBtn").onclick=()=>{setScreen("stage");renderStages();};$("stageBack").onclick=()=>setScreen("main");$("stageRail").onclick=e=>{const card=e.target.closest(".stage-card:not(:disabled)");if(card){selectedStage=+card.dataset.stage;renderStages();}};$("stageRail").addEventListener("wonder:stage-snap",e=>{const n=Number(e.detail?.index)+1;if(n>=1&&n<=30){selectedStage=n;renderStages();}});$("enterStage").onclick=()=>{if(selectedStage<=unlocked)startStage(selectedStage);};$("stackTray").onclick=e=>{if(busy)return;const stack=e.target.closest("[data-stack]");if(stack){selected=+stack.dataset.stack;render();}};$("hexBoard").onclick=e=>{const hex=e.target.closest("[data-hex]");if(hex)place(+hex.dataset.hex);};$("battleBack").onclick=()=>show("leaveModal","leaveContinue");$("leaveContinue").onclick=()=>hide("leaveModal");$("leaveStage").onclick=()=>{hide("leaveModal");setScreen("stage");renderStages();};$("battleHelp").onclick=()=>show("helpModal","helpClose");$("helpClose").onclick=()=>hide("helpModal");$("resultStageBtn").onclick=()=>{hide("resultModal");setScreen("stage");renderStages();};$("retryBtn").onclick=()=>startStage(currentStage);$("nextBtn").onclick=()=>startStage(Math.min(30,currentStage+1));
window.__HEXA_SORT__={coords:COORDS,neighbors,stages:STAGES,resolveModel,topRun,objectiveMet,startStage,animateTrace,mergeContractsValid:MERGE_CONTRACTS_VALID,getState:()=>({currentStage,cells:cloneCells(cells),tray:tray.map(s=>[...s]),moves,cleared,clears,gems,thawed,score,clearedByColor:{...clearedByColor},unlocked,busy}),loadFixture:(fixture,placed=0)=>{cells=cloneCells(fixture);tray=[];selected=-1;moves=cleared=clears=gems=thawed=score=0;render();return resolveModel(cells,placed,STAGES[currentStage-1].objective.color);}};applyLocale();syncSound();setScreen("main");setTimeout(()=>document.documentElement.dataset.gameReady="true",0);})();
