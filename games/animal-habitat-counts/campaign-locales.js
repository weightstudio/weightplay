(function (root) {
  "use strict";
  const packs = {
    en: {
      arcs:["Sunlit Meadow","Pollen Pond","Stone Hollow","Migration Crossing","Lantern Marsh","Habitat Council"], stageWord:"Stage", stageName:"{arc} · {stageWord} {number}",
      progress:"{count}/{total} habitats complete", progressEmpty:"Explore the first of {total} habitats", mapIntro:"Build a habitat from row and column counts, then master six new rule combinations.", stageHint:"{arc} habitat · {size} × {size}", progressBadge:"Stage {number} of {total}", status:["Ready","Complete","Locked"],
      goalHelp:"Meet every row and column total, plus the habitat rules shown below.", zonesTitle:"Sanctuary counts", zoneCount:"Zone {number}: {count}", zoneHidden:"Zone {number}: misted", lensAvailable:"Crystal Lens · {count} charges", revealZone:"Reveal Zone {number}", lensNoCharge:"No Lens charge. Deduce the misted count or adjust and check.", revealed:"Zone {number} revealed: {count}.",
      rules:["Match every row and column count.","Stone cells must stay empty.","Connect every marked migration point through filled edge-touching cells.","Include either marked shelter in the connected route."], itemName:"Crystal Lens", stoneAlt:"Unfillable stone",
      route:["Migration start","Migration waypoint","Migration end","Optional shelter"], cell:["Row {row}, column {column}: {state}","filled","empty","stone; cannot be filled"],
      correct:"Habitat balanced! Your clear is saved.", wrong:"Not quite. Check the highlighted lines, zones, stones, and route.", resultTitle:"A balanced habitat", finaleTitle:"Taro’s Living Atlas", resultBody:"You solved this habitat. It stays open to replay.", finaleBody:"You completed all 30 habitats and Taro’s Living Atlas. Every stage remains replayable.", resultStats:"Stage {number} · {checks} checks · {count}/30 habitats complete", checkpointReward:"Checkpoint cleared · +{count} Lens charge(s) · {total} held"},
    "zh-Hant": {
      arcs:["晴光草原","花粉池塘","石影谷","遷徙渡口","燈籠濕地","棲地議會"], stageWord:"關卡", stageName:"{arc} · {stageWord} {number}",
      progress:"已完成 {count}/{total} 個棲地", progressEmpty:"從 {total} 個棲地中的第一個開始", mapIntro:"依行列數字拼出棲地，逐步掌握六種規則組合。", stageHint:"{arc}棲地 · {size} × {size}", progressBadge:"第 {number}/{total} 關", status:["可遊玩","已完成","未解鎖"],
      goalHelp:"符合每行、每列總數，並遵守下方棲地規則。", zonesTitle:"保護區數量", zoneCount:"區域 {number}：{count}", zoneHidden:"區域 {number}：迷霧遮住", lensAvailable:"水晶透鏡 · 剩餘 {count} 次", revealZone:"揭示區域 {number}", lensNoCharge:"透鏡次數不足。可推理迷霧數字，或調整後檢查。", revealed:"已揭示區域 {number}：{count}。",
      rules:["符合每行與每列數量。","石塊格必須留空。","以相鄰填滿格連接所有遷徙標記。","連通路徑需包含任一標記棲所。"], itemName:"水晶透鏡", stoneAlt:"不可填入的石塊",
      route:["遷徙起點","遷徙路標","遷徙終點","可選棲所"], cell:["第 {row} 行、第 {column} 列：{state}","已填","空白","石塊，不能填入"],
      correct:"棲地平衡！進度已儲存。", wrong:"還沒完成。檢查標示的行列、區域、石塊與路徑。", resultTitle:"棲地平衡了", finaleTitle:"塔羅的棲地圖鑑", resultBody:"你解開了這個棲地；之後仍可重玩。", finaleBody:"你完成全部 30 個棲地與塔羅的圖鑑。每一關都能重玩。", resultStats:"第 {number} 關 · 檢查 {checks} 次 · 已完成 {count}/30 關", checkpointReward:"檢查點完成 · 透鏡 +{count} 次 · 現有 {total} 次"},
    "zh-Hans": {
      arcs:["晴光草原","花粉池塘","石影谷","迁徙渡口","灯笼湿地","栖地议会"], stageWord:"关卡", stageName:"{arc} · {stageWord} {number}",
      progress:"已完成 {count}/{total} 个栖地", progressEmpty:"从 {total} 个栖地中的第一个开始", mapIntro:"按行列数字拼出栖地，逐步掌握六种规则组合。", stageHint:"{arc}栖地 · {size} × {size}", progressBadge:"第 {number}/{total} 关", status:["可游玩","已完成","未解锁"],
      goalHelp:"符合每行、每列总数，并遵守下方栖地规则。", zonesTitle:"保护区数量", zoneCount:"区域 {number}：{count}", zoneHidden:"区域 {number}：迷雾遮挡", lensAvailable:"水晶透镜 · 剩余 {count} 次", revealZone:"揭示区域 {number}", lensNoCharge:"透镜次数不足。可推理迷雾数字，或调整后检查。", revealed:"已揭示区域 {number}：{count}。",
      rules:["符合每行与每列数量。","石块格必须留空。","以相邻填满格连接所有迁徙标记。","连通路径需包含任一标记栖所。"], itemName:"水晶透镜", stoneAlt:"不可填入的石块",
      route:["迁徙起点","迁徙路标","迁徙终点","可选栖所"], cell:["第 {row} 行、第 {column} 列：{state}","已填","空白","石块，不能填入"],
      correct:"栖地平衡！进度已保存。", wrong:"还未完成。检查标示的行列、区域、石块与路径。", resultTitle:"栖地平衡了", finaleTitle:"塔罗的栖地图鉴", resultBody:"你解开了这个栖地；之后仍可重玩。", finaleBody:"你完成全部 30 个栖地与塔罗的图鉴。每一关都可重玩。", resultStats:"第 {number} 关 · 检查 {checks} 次 · 已完成 {count}/30 关", checkpointReward:"检查点完成 · 透镜 +{count} 次 · 当前 {total} 次"},
    ja: {
      arcs:["陽だまりの草原","花粉の池","石の洞","渡りの交差路","灯籠の湿地","生息地評議会"], stageWord:"ステージ", stageName:"{arc} · {stageWord}{number}",
      progress:"生息地 {count}/{total} 完了", progressEmpty:"全{total}か所の最初の生息地へ", mapIntro:"行と列の数から生息地を作り、6つのルールの組み合わせを習得します。", stageHint:"{arc} · {size} × {size}", progressBadge:"{number}/{total} ステージ", status:["プレイ可能","クリア","未解除"],
      goalHelp:"行・列の合計と、下記の生息地ルールを満たしてください。", zonesTitle:"保護区の数", zoneCount:"区域{number}：{count}", zoneHidden:"区域{number}：霧の中", lensAvailable:"水晶レンズ · 残り{count}回", revealZone:"区域{number}を調べる", lensNoCharge:"レンズがありません。推理するか、盤面を調整して確認しましょう。", revealed:"区域{number}：{count}。",
      rules:["各行・列の数を合わせます。","岩のマスは空けます。","隣接するマスをつなぎ、渡りの標識をすべて結びます。","つながった道に標識の避難所をどちらか含めます。"], itemName:"水晶レンズ", stoneAlt:"置けない岩",
      route:["渡りの始点","渡りの標識","渡りの終点","選べる避難所"], cell:["{row}行{column}列：{state}","配置済み","空き","岩：配置不可"],
      correct:"生息地が完成！進行状況を保存しました。", wrong:"まだです。行列・区域・岩・道を確認してください。", resultTitle:"生息地が整いました", finaleTitle:"タロの生息地図鑑", resultBody:"この生息地を解きました。いつでも再挑戦できます。", finaleBody:"全30の生息地とタロの図鑑を完成しました。全ステージを再プレイできます。", resultStats:"ステージ{number} · 確認{checks}回 · {count}/30完了", checkpointReward:"節目クリア · レンズ+{count}回 · 所持{total}回"},
    ko: {
      arcs:["햇살 초원","꽃가루 연못","돌 틈 골짜기","이동 길목","등불 습지","서식지 회의"], stageWord:"스테이지", stageName:"{arc} · {stageWord} {number}",
      progress:"서식지 {count}/{total} 완료", progressEmpty:"전체 {total}곳 중 첫 서식지 탐험", mapIntro:"행과 열의 수로 서식지를 만들고 여섯 가지 규칙 조합을 익혀요.", stageHint:"{arc} · {size} × {size}", progressBadge:"{number}/{total} 스테이지", status:["플레이 가능","완료","잠김"],
      goalHelp:"행과 열의 합계 및 아래 서식지 규칙을 모두 맞추세요.", zonesTitle:"보호 구역 수", zoneCount:"구역 {number}: {count}", zoneHidden:"구역 {number}: 안개에 가림", lensAvailable:"수정 렌즈 · {count}회 남음", revealZone:"구역 {number} 살펴보기", lensNoCharge:"렌즈가 없어요. 추리하거나 배치를 바꾸고 확인하세요.", revealed:"구역 {number}: {count}.",
      rules:["모든 행과 열의 수를 맞추세요.","돌 칸은 비워 두세요.","채운 칸을 이어 모든 이동 표식을 연결하세요.","이어진 길에 표시된 쉼터 중 하나를 포함하세요."], itemName:"수정 렌즈", stoneAlt:"채울 수 없는 돌",
      route:["이동 시작","이동 표식","이동 끝","선택 쉼터"], cell:["{row}행 {column}열: {state}","채움","비움","돌: 채울 수 없음"],
      correct:"서식지가 완성됐어요! 진행을 저장했어요.", wrong:"아직이에요. 행·열, 구역, 돌, 길을 확인하세요.", resultTitle:"균형 잡힌 서식지", finaleTitle:"타로의 살아있는 지도", resultBody:"이 서식지를 해결했어요. 언제든 다시 할 수 있어요.", finaleBody:"서식지 30곳과 타로의 지도를 완성했어요. 모든 스테이지를 다시 할 수 있어요.", resultStats:"스테이지 {number} · 확인 {checks}회 · {count}/30 완료", checkpointReward:"체크포인트 통과 · 렌즈 +{count}회 · 보유 {total}회"},
    es: {
      arcs:["Pradera soleada","Estanque de polen","Hondonada de piedra","Paso migratorio","Pantano de faroles","Consejo del hábitat"], stageWord:"Etapa", stageName:"{arc} · {stageWord} {number}",
      progress:"Hábitats completados: {count}/{total}", progressEmpty:"Explora el primero de {total} hábitats", mapIntro:"Forma hábitats con las pistas de filas y columnas y domina seis combinaciones de reglas.", stageHint:"Hábitat: {arc} · {size} × {size}", progressBadge:"Etapa {number} de {total}", status:["Disponible","Completada","Bloqueada"],
      goalHelp:"Cumple cada total de fila y columna y las reglas del hábitat indicadas abajo.", zonesTitle:"Conteos del refugio", zoneCount:"Zona {number}: {count}", zoneHidden:"Zona {number}: cubierta por la niebla", lensAvailable:"Lente de cristal · {count} usos", revealZone:"Revelar zona {number}", lensNoCharge:"Sin cargas de lente. Deduce el valor o ajusta y comprueba.", revealed:"Zona {number} revelada: {count}.",
      rules:["Respeta el total de cada fila y columna.","Las casillas de piedra deben quedar vacías.","Une todos los marcadores migratorios con casillas llenas contiguas.","Incluye uno de los refugios marcados en la ruta conectada."], itemName:"Lente de cristal", stoneAlt:"Piedra que no se puede llenar",
      route:["Inicio migratorio","Punto migratorio","Fin migratorio","Refugio opcional"], cell:["Fila {row}, columna {column}: {state}","llena","vacía","piedra; no se puede llenar"],
      correct:"¡Hábitat equilibrado! Se guardó tu avance.", wrong:"Aún no. Revisa filas, columnas, zonas, piedras y ruta resaltadas.", resultTitle:"Un hábitat equilibrado", finaleTitle:"Atlas viviente de Taro", resultBody:"Resolvistes este hábitat. Puedes repetirlo cuando quieras.", finaleBody:"Completaste los 30 hábitats y el atlas de Taro. Puedes repetir todas las etapas.", resultStats:"Etapa {number} · {checks} intentos · {count}/30 hábitats", checkpointReward:"Punto de control · +{count} carga(s) de lente · {total} disponibles"},
    "pt-BR": {
      arcs:["Prado ensolarado","Lago de pólen","Vale de pedra","Travessia migratória","Pântano das lanternas","Conselho do habitat"], stageWord:"Fase", stageName:"{arc} · {stageWord} {number}",
      progress:"Habitats concluídos: {count}/{total}", progressEmpty:"Explore o primeiro de {total} habitats", mapIntro:"Monte habitats pelas pistas de linhas e colunas e domine seis combinações de regras.", stageHint:"Habitat: {arc} · {size} × {size}", progressBadge:"Fase {number} de {total}", status:["Disponível","Concluída","Bloqueada"],
      goalHelp:"Acerte os totais de cada linha e coluna e as regras do habitat abaixo.", zonesTitle:"Contagem do santuário", zoneCount:"Zona {number}: {count}", zoneHidden:"Zona {number}: encoberta pela névoa", lensAvailable:"Lente de cristal · {count} usos", revealZone:"Revelar zona {number}", lensNoCharge:"Sem carga da lente. Deduzir o valor ou ajuste e confira.", revealed:"Zona {number} revelada: {count}.",
      rules:["Acerte a contagem de cada linha e coluna.","As casas de pedra devem ficar vazias.","Conecte todos os marcos migratórios por casas preenchidas vizinhas.","Inclua um dos abrigos marcados na rota conectada."], itemName:"Lente de cristal", stoneAlt:"Pedra que não pode ser preenchida",
      route:["Início da migração","Marco migratório","Fim da migração","Abrigo opcional"], cell:["Linha {row}, coluna {column}: {state}","preenchida","vazia","pedra; não pode preencher"],
      correct:"Habitat equilibrado! Seu progresso foi salvo.", wrong:"Ainda não. Confira linhas, colunas, zonas, pedras e rota destacadas.", resultTitle:"Um habitat equilibrado", finaleTitle:"Atlas vivo de Taro", resultBody:"Você resolveu este habitat. Pode jogá-lo de novo quando quiser.", finaleBody:"Você concluiu os 30 habitats e o atlas de Taro. Todas as fases podem ser jogadas novamente.", resultStats:"Fase {number} · {checks} tentativas · {count}/30 habitats", checkpointReward:"Marco concluído · +{count} carga(s) · {total} na lente"},
    fr: {
      arcs:["Prairie ensoleillée","Étang de pollen","Creux de pierre","Passage migratoire","Marais aux lanternes","Conseil de l’habitat"], stageWord:"Étape", stageName:"{arc} · {stageWord} {number}",
      progress:"Habitats terminés : {count}/{total}", progressEmpty:"Explorez le premier des {total} habitats", mapIntro:"Composez un habitat avec les indices de lignes et colonnes, puis maîtrisez six règles combinées.", stageHint:"Habitat {arc} · {size} × {size}", progressBadge:"Étape {number} sur {total}", status:["Disponible","Terminé","Verrouillé"],
      goalHelp:"Respectez le total de chaque ligne et colonne ainsi que les règles ci-dessous.", zonesTitle:"Comptes du sanctuaire", zoneCount:"Zone {number} : {count}", zoneHidden:"Zone {number} : dans la brume", lensAvailable:"Lentille de cristal · {count} charges", revealZone:"Révéler la zone {number}", lensNoCharge:"Aucune charge. Déduisez le nombre ou modifiez puis vérifiez.", revealed:"Zone {number} révélée : {count}.",
      rules:["Respectez le compte de chaque ligne et colonne.","Les cases de pierre restent vides.","Reliez chaque repère migratoire par des cases pleines voisines.","Incluez l’un des refuges marqués dans le chemin relié."], itemName:"Lentille de cristal", stoneAlt:"Pierre infranchissable",
      route:["Départ migratoire","Repère migratoire","Arrivée migratoire","Refuge facultatif"], cell:["Ligne {row}, colonne {column} : {state}","pleine","vide","pierre : impossible à remplir"],
      correct:"Habitat équilibré ! Votre progression est enregistrée.", wrong:"Pas encore. Vérifiez lignes, colonnes, zones, pierres et chemin signalés.", resultTitle:"Un habitat équilibré", finaleTitle:"L’atlas vivant de Taro", resultBody:"Habitat résolu. Vous pouvez le rejouer à tout moment.", finaleBody:"Vous avez terminé les 30 habitats et l’atlas de Taro. Chaque étape reste rejouable.", resultStats:"Étape {number} · {checks} vérifications · {count}/30 habitats", checkpointReward:"Étape clé réussie · +{count} charge(s) · {total} restantes"},
    de: {
      arcs:["Sonnige Wiese","Pollen-Teich","Steinhöhle","Zugvogel-Passage","Laternenmoor","Habitat-Rat"], stageWord:"Stufe", stageName:"{arc} · {stageWord} {number}",
      progress:"Lebensräume abgeschlossen: {count}/{total}", progressEmpty:"Erkunde den ersten von {total} Lebensräumen", mapIntro:"Erstelle Lebensräume anhand der Zeilen- und Spaltenzahlen und meistere sechs Regelkombinationen.", stageHint:"{arc} · {size} × {size}", progressBadge:"Stufe {number} von {total}", status:["Bereit","Abgeschlossen","Gesperrt"],
      goalHelp:"Erfülle alle Zeilen- und Spaltensummen sowie die Habitatregeln unten.", zonesTitle:"Schutzgebiet-Zahlen", zoneCount:"Zone {number}: {count}", zoneHidden:"Zone {number}: im Nebel", lensAvailable:"Kristalllinse · {count} Ladungen", revealZone:"Zone {number} enthüllen", lensNoCharge:"Keine Linsenladung. Leite die Zahl her oder ändere das Feld und prüfe.", revealed:"Zone {number}: {count}.",
      rules:["Erfülle jede Zeilen- und Spaltenzahl.","Steinfelder müssen leer bleiben.","Verbinde alle Zugvogelmarken über benachbarte gefüllte Felder.","Verbinde eines der markierten Schutzlager mit dem Weg."], itemName:"Kristalllinse", stoneAlt:"Nicht befüllbarer Stein",
      route:["Zugvogel-Start","Wegmarke","Zugvogel-Ziel","Wählbares Schutzlager"], cell:["Zeile {row}, Spalte {column}: {state}","gefüllt","leer","Stein; nicht befüllbar"],
      correct:"Lebensraum im Gleichgewicht! Dein Fortschritt ist gespeichert.", wrong:"Noch nicht. Prüfe markierte Zeilen, Zonen, Steine und den Weg.", resultTitle:"Ein ausgeglichener Lebensraum", finaleTitle:"Taros lebendiger Atlas", resultBody:"Diesen Lebensraum gelöst. Du kannst ihn jederzeit erneut spielen.", finaleBody:"Du hast alle 30 Lebensräume und Taros Atlas vervollständigt. Jede Stufe bleibt spielbar.", resultStats:"Stufe {number} · {checks} Prüfungen · {count}/30 Lebensräume", checkpointReward:"Meilenstein geschafft · +{count} Linsenladung(en) · {total} übrig"},
    it: {
      arcs:["Prato soleggiato","Stagno del polline","Conca di pietra","Passaggio migratorio","Palude delle lanterne","Consiglio dell’habitat"], stageWord:"Livello", stageName:"{arc} · {stageWord} {number}",
      progress:"Habitat completati: {count}/{total}", progressEmpty:"Esplora il primo dei {total} habitat", mapIntro:"Crea habitat con gli indizi di righe e colonne e padroneggia sei combinazioni di regole.", stageHint:"Habitat {arc} · {size} × {size}", progressBadge:"Livello {number} di {total}", status:["Disponibile","Completato","Bloccato"],
      goalHelp:"Rispetta i totali di ogni riga e colonna e le regole dell’habitat qui sotto.", zonesTitle:"Conteggi del rifugio", zoneCount:"Zona {number}: {count}", zoneHidden:"Zona {number}: coperta dalla nebbia", lensAvailable:"Lente di cristallo · {count} cariche", revealZone:"Rivela zona {number}", lensNoCharge:"Nessuna carica. Deduci il valore oppure modifica e controlla.", revealed:"Zona {number} rivelata: {count}.",
      rules:["Rispetta i conteggi di ogni riga e colonna.","Le caselle di pietra devono restare vuote.","Collega tutti i segnavia migratori con caselle piene adiacenti.","Includi uno dei rifugi segnati nel percorso collegato."], itemName:"Lente di cristallo", stoneAlt:"Pietra non riempibile",
      route:["Inizio migrazione","Segnavia migratorio","Fine migrazione","Rifugio facoltativo"], cell:["Riga {row}, colonna {column}: {state}","piena","vuota","pietra; non riempibile"],
      correct:"Habitat in equilibrio! Progressi salvati.", wrong:"Non ancora. Controlla righe, colonne, zone, pietre e percorso evidenziati.", resultTitle:"Un habitat equilibrato", finaleTitle:"Atlante vivente di Taro", resultBody:"Hai risolto questo habitat. Puoi rigiocarlo quando vuoi.", finaleBody:"Hai completato tutti i 30 habitat e l’atlante di Taro. Ogni livello è rigiocabile.", resultStats:"Livello {number} · {checks} controlli · {count}/30 habitat", checkpointReward:"Traguardo superato · +{count} carica/e · {total} nella lente"},
    ru: {
      arcs:["Солнечный луг","Пруд с пыльцой","Каменная лощина","Путь миграции","Болотные фонари","Совет по среде"], stageWord:"Этап", stageName:"{arc} · {stageWord} {number}",
      progress:"Сред обитания завершено: {count}/{total}", progressEmpty:"Исследуйте первую из {total} сред", mapIntro:"Создавайте среду по числам строк и столбцов и освойте шесть сочетаний правил.", stageHint:"{arc} · {size} × {size}", progressBadge:"Этап {number} из {total}", status:["Доступен","Пройден","Закрыт"],
      goalHelp:"Соблюдайте суммы строк и столбцов, а также правила среды ниже.", zonesTitle:"Числа заповедника", zoneCount:"Зона {number}: {count}", zoneHidden:"Зона {number}: в тумане", lensAvailable:"Хрустальная линза · зарядов: {count}", revealZone:"Открыть зону {number}", lensNoCharge:"Заряда нет. Выведите число логически или измените поле и проверьте.", revealed:"Зона {number}: {count}.",
      rules:["Соблюдайте числа каждой строки и столбца.","Каменные клетки должны быть пустыми.","Соедините все метки миграции соседними заполненными клетками.","Включите в связный маршрут хотя бы одно отмеченное укрытие."], itemName:"Хрустальная линза", stoneAlt:"Камень: заполнить нельзя",
      route:["Начало миграции","Метка пути","Конец миграции","Укрытие на выбор"], cell:["Строка {row}, столбец {column}: {state}","заполнена","пуста","камень; заполнить нельзя"],
      correct:"Среда сбалансирована! Прогресс сохранён.", wrong:"Пока нет. Проверьте отмеченные строки, зоны, камни и маршрут.", resultTitle:"Сбалансированная среда", finaleTitle:"Живой атлас Таро", resultBody:"Вы решили эту задачу. Её можно пройти снова.", finaleBody:"Вы завершили все 30 сред и атлас Таро. Любой этап можно повторить.", resultStats:"Этап {number} · проверок: {checks} · {count}/30 сред", checkpointReward:"Рубеж пройден · линза: +{count} · зарядов {total}"},
    hi: {
      arcs:["धूप वाला मैदान","पराग तालाब","पत्थर की घाटी","प्रवासी रास्ता","लालटेन दलदल","आवास परिषद"], stageWord:"चरण", stageName:"{arc} · {stageWord} {number}",
      progress:"आवास पूरे: {count}/{total}", progressEmpty:"{total} में से पहले आवास को खोजें", mapIntro:"पंक्ति और स्तंभ के संकेतों से आवास बनाएँ और छह नियम-संयोजनों में महारत पाएँ।", stageHint:"{arc} · {size} × {size}", progressBadge:"{number}/{total} चरण", status:["उपलब्ध","पूरा","बंद"],
      goalHelp:"हर पंक्ति और स्तंभ का कुल तथा नीचे दिए आवास नियम पूरे करें।", zonesTitle:"अभयारण्य की गिनती", zoneCount:"क्षेत्र {number}: {count}", zoneHidden:"क्षेत्र {number}: धुंध में", lensAvailable:"क्रिस्टल लेंस · {count} चार्ज", revealZone:"क्षेत्र {number} खोलें", lensNoCharge:"लेंस चार्ज नहीं। संख्या का अनुमान लगाएँ या बोर्ड बदलकर जाँचें।", revealed:"क्षेत्र {number}: {count}।",
      rules:["हर पंक्ति और स्तंभ की गिनती मिलाएँ।","पत्थर वाले खाने खाली रखें।","भरे हुए जुड़े खानों से सभी प्रवास चिह्न जोड़ें।","जुड़े रास्ते में किसी एक चिह्नित आश्रय को शामिल करें।"], itemName:"क्रिस्टल लेंस", stoneAlt:"पत्थर; भरा नहीं जा सकता",
      route:["प्रवास आरंभ","प्रवास चिह्न","प्रवास अंत","वैकल्पिक आश्रय"], cell:["पंक्ति {row}, स्तंभ {column}: {state}","भरा","खाली","पत्थर; नहीं भर सकते"],
      correct:"आवास संतुलित! प्रगति सहेजी गई।", wrong:"अभी नहीं। चिह्नित पंक्तियाँ, क्षेत्र, पत्थर और रास्ता देखें।", resultTitle:"संतुलित आवास", finaleTitle:"तारो का जीवंत एटलस", resultBody:"आपने यह आवास हल किया। इसे फिर से खेल सकते हैं।", finaleBody:"आपने सभी 30 आवास और तारो का एटलस पूरा किया। हर चरण फिर खेल सकते हैं।", resultStats:"चरण {number} · {checks} जाँच · {count}/30 आवास", checkpointReward:"पड़ाव पूरा · लेंस +{count} · कुल {total}"},
    ar: {
      arcs:["مرج مشمس","بركة الطلع","جوف الصخر","معبر الهجرة","مستنقع الفوانيس","مجلس الموائل"], stageWord:"مرحلة", stageName:"{arc} · {stageWord} {number}",
      progress:"الموائل المكتملة: {count}/{total}", progressEmpty:"استكشف أول موئل من أصل {total}", mapIntro:"كوّن الموائل من أعداد الصفوف والأعمدة، وأتقن ستة تركيبات من القواعد.", stageHint:"موئل {arc} · {size} × {size}", progressBadge:"المرحلة {number} من {total}", status:["متاحة","مكتملة","مقفلة"],
      goalHelp:"طابق مجموع كل صف وعمود، واتبع قواعد الموئل أدناه.", zonesTitle:"أعداد المحمية", zoneCount:"المنطقة {number}: {count}", zoneHidden:"المنطقة {number}: يحجبها الضباب", lensAvailable:"عدسة كريستالية · {count} شحنات", revealZone:"اكشف المنطقة {number}", lensNoCharge:"لا توجد شحنة. استنتج العدد أو عدّل اللوحة ثم افحصها.", revealed:"المنطقة {number}: {count}.",
      rules:["طابق عدد كل صف وعمود.","اترك الخانات الصخرية فارغة.","صِل علامات الهجرة بخانات ممتلئة ومتجاورة.","أدرج أحد الملاجئ المحددة في المسار المتصل."], itemName:"عدسة كريستالية", stoneAlt:"صخرة لا يمكن ملؤها",
      route:["بداية الهجرة","علامة مسار","نهاية الهجرة","ملجأ اختياري"], cell:["الصف {row}، العمود {column}: {state}","ممتلئة","فارغة","صخرة؛ لا يمكن ملؤها"],
      correct:"موئل متوازن! حُفظ تقدمك.", wrong:"ليس بعد. راجع الصفوف والأعمدة والمناطق والصخور والمسار المحددة.", resultTitle:"موئل متوازن", finaleTitle:"أطلس تارو الحي", resultBody:"حللت هذا الموئل. يمكنك لعبه مجدداً متى شئت.", finaleBody:"أكملت الموائل الثلاثين وأطلس تارو. يمكنك إعادة لعب كل المراحل.", resultStats:"المرحلة {number} · {checks} فحوص · {count}/30 موئلاً", checkpointReward:"اجتزت نقطة التقدم · +{count} شحنة · المجموع {total}"},
  };
  const guideResults = {
    en:"Campaign progress is saved in this browser; cleared habitats stay open to replay.",
    "zh-Hant":"棲地進度只保存在此瀏覽器；已完成的關卡仍可重玩。",
    "zh-Hans":"栖地进度只保存在此浏览器；已完成的关卡仍可重玩。",
    ja:"進行状況はこのブラウザーに保存され、クリアした生息地は再挑戦できます。",
    ko:"진행은 이 브라우저에 저장되며 완료한 서식지는 다시 플레이할 수 있어요.",
    es:"El progreso se guarda en este navegador; los hábitats completados se pueden repetir.",
    "pt-BR":"O progresso fica salvo neste navegador; habitats concluídos podem ser rejogados.",
    fr:"La progression est enregistrée dans ce navigateur ; les habitats terminés restent rejouables.",
    de:"Der Fortschritt wird in diesem Browser gespeichert; abgeschlossene Lebensräume bleiben wiederholbar.",
    it:"I progressi sono salvati in questo browser; gli habitat completati restano rigiocabili.",
    ru:"Прогресс сохранён в этом браузере; пройденные среды можно повторить.",
    hi:"प्रगति इसी ब्राउज़र में सहेजी जाती है; पूरे आवास फिर खेले जा सकते हैं।",
    ar:"يُحفظ التقدم في هذا المتصفح، ويمكن إعادة لعب الموائل المكتملة.",
  };
  Object.entries(guideResults).forEach(([locale, value]) => { packs[locale].guideResults = value; });
  const guideStagesTitle = {
    en:"Habitat stages", "zh-Hant":"棲地關卡", "zh-Hans":"栖地关卡", ja:"生息地ステージ", ko:"서식지 스테이지",
    es:"Etapas del hábitat", "pt-BR":"Fases do habitat", fr:"Étapes de l’habitat", de:"Lebensraum-Stufen",
    it:"Livelli dell’habitat", ru:"Этапы среды", hi:"आवास चरण", ar:"مراحل الموائل",
  };
  Object.entries(guideStagesTitle).forEach(([locale, value]) => { packs[locale].guideStagesTitle = value; });
  root.ANIMAL_HABITAT_COUNTS_CAMPAIGN_LOCALES = packs;
})(window);
