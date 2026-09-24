/* Wordle v18. Game-owned, count-aware deduction and finite motion.
   The shared arcade remains the only round/scene/analytics owner. */
(() => {
  "use strict";
  const COPY = {
    en: ["Guess a 5-letter English word in 6 tries.", "Tap letters, then Submit. Try CRANE first.", "Correct place", "Other place", "No extra copy", "Submit", "Delete", "Guess", "Enter 5 English letters.", "Use the clues for your next guess."],
    "zh-tw": ["6 次機會，猜出 5 個字母的英文單字。", "點下方字母再提交，可先試 CRANE。", "位置正確", "位置不同", "無更多此字母", "提交", "刪除", "猜測", "請輸入 5 個英文字母。", "依照顏色線索，換一個單字再猜。"],
    "zh-cn": ["6 次机会，猜出 5 个字母的英文单词。", "点下方字母再提交，可先试 CRANE。", "位置正确", "位置不同", "无更多此字母", "提交", "删除", "猜测", "请输入 5 个英文字母。", "按照颜色线索，换一个单词再猜。"],
    ja: ["6 回以内に英語の 5 文字の単語を当てよう。", "下の文字を押して送信。まず CRANE を試そう。", "位置が正しい", "別の位置", "残りなし", "送信", "削除", "予想", "英字を 5 文字入力してください。", "色のヒントで次の単語を考えよう。"],
    ko: ["6번 안에 영어 5글자 단어를 맞히세요.", "아래 글자를 누르고 제출하세요. CRANE부터 시도해 보세요.", "정확한 위치", "다른 위치", "남은 글자 없음", "제출", "삭제", "추측", "영문자 5개를 입력하세요.", "색상 단서를 보고 다음 단어를 추측하세요."],
    es: ["Adivina una palabra inglesa de 5 letras en 6 intentos.", "Toca letras y envía. Prueba CRANE primero.", "Lugar correcto", "Otro lugar", "Sin más copias", "Enviar", "Borrar", "Intento", "Introduce 5 letras inglesas.", "Usa los colores para tu próxima palabra."],
    "pt-br": ["Adivinhe uma palavra inglesa de 5 letras em 6 tentativas.", "Toque nas letras e envie. Tente CRANE primeiro.", "Lugar certo", "Outro lugar", "Sem mais cópias", "Enviar", "Apagar", "Tentativa", "Digite 5 letras inglesas.", "Use as cores para escolher a próxima palavra."],
    fr: ["Devine un mot anglais de 5 lettres en 6 essais.", "Touche les lettres puis valide. Essaie CRANE.", "Bonne place", "Autre place", "Aucun exemplaire restant", "Valider", "Effacer", "Essai", "Saisis 5 lettres anglaises.", "Utilise les couleurs pour choisir le prochain mot."],
    de: ["Errate ein englisches Wort mit 5 Buchstaben in 6 Versuchen.", "Tippe Buchstaben und sende. Probiere zuerst CRANE.", "Richtiger Platz", "Anderer Platz", "Kein weiteres Exemplar", "Senden", "Löschen", "Versuch", "Gib 5 englische Buchstaben ein.", "Nutze die Farben für dein nächstes Wort."],
    it: ["Indovina una parola inglese di 5 lettere in 6 tentativi.", "Tocca le lettere e invia. Prova prima CRANE.", "Posto giusto", "Altro posto", "Nessun’altra copia", "Invia", "Cancella", "Tentativo", "Inserisci 5 lettere inglesi.", "Usa i colori per scegliere la prossima parola."],
    ru: ["Угадай английское слово из 5 букв за 6 попыток.", "Нажимай буквы и отправляй. Начни с CRANE.", "Верное место", "Другое место", "Больше таких нет", "Отправить", "Удалить", "Попытка", "Введите 5 английских букв.", "Используй цвета для следующего слова."],
    hi: ["6 कोशिशों में 5 अक्षरों वाला अंग्रेज़ी शब्द बूझें।", "नीचे अक्षर दबाकर भेजें। पहले CRANE आज़माएँ।", "सही जगह", "दूसरी जगह", "अतिरिक्त प्रति नहीं", "भेजें", "मिटाएँ", "कोशिश", "5 अंग्रेज़ी अक्षर लिखें।", "रंगों के संकेत से अगला शब्द चुनें।"],
    ar: ["خمّن كلمة إنجليزية من 5 أحرف خلال 6 محاولات.", "اضغط الأحرف ثم أرسل. جرّب CRANE أولًا.", "مكان صحيح", "مكان آخر", "لا نسخة إضافية", "إرسال", "حذف", "محاولة", "أدخل 5 أحرف إنجليزية.", "استخدم إشارات الألوان لتخمين الكلمة التالية."]
  };
  const TEXT = {
    en: {lock:"Clue lock", lockHelp:"Choose before your first guess or hint. Keep every earlier clue, including repeated-letter counts.", conflict:"That guess contradicts an earlier clue. No attempt used.", repeat:"You already tried that guess. No attempt used.", hint:"Hint {n}/2: position {p} is {letter}.", noHints:"Both hints have been used.", revealing:"Revealing your guess…", solved:"Word solved!", ended:"Puzzle complete", answer:"Answer: {word} · {stars}/3 stars", score:"Score", guesses:"Guesses", hints:"Hints", best:"Best", collection:"Star collection", progress:"{stars}/36 stars · Six puzzles, two ways to play.", again:"Play again", home:"Back to main", guideTitle:"Clue lock and star collection", guide:"The six English puzzles can be played freely or with Clue lock. Choose before your first guess or hint; locked guesses must match every previous clue, including duplicate-letter counts and revealed positions. Invalid or repeated guesses cost no attempt. Up to two hints each reveal one unresolved position without spending a guess. Earn three stars by solving within three guesses without hints, two within four guesses using at most one hint, otherwise one for a solve. Each puzzle stores its best stars separately for both modes: 36 stars in total, not repeat-play farming. A solve scores 500 plus 100 per unused guess, minus 50 per hint, plus 100 with Clue lock; an unsolved puzzle scores zero. Records stay in this browser; blocked storage keeps them only for this visit. Letter combinations are accepted without a full dictionary check."},
    "zh-tw": {lock:"線索鎖定", lockHelp:"首次猜測或提示前選擇；之後必須遵守所有舊線索，包含重複字母的數量。", conflict:"這次猜測與先前線索矛盾，不扣次數。", repeat:"已經猜過這組字母，不扣次數。", hint:"提示 {n}/2：第 {p} 格是 {letter}。", noHints:"兩次提示都已使用。", revealing:"正在逐格揭曉……", solved:"猜中了！", ended:"本題結束", answer:"答案：{word} · {stars}/3 顆星", score:"分數", guesses:"猜測次數", hints:"提示次數", best:"最佳分數", collection:"星級收集", progress:"{stars}/36 顆星 · 六題，兩種挑戰方式。", again:"再玩一次", home:"返回主頁", guideTitle:"線索鎖定與星級收集", guide:"六題英文猜詞可自由推理，也可在首次猜測或提示前開啟線索鎖定。鎖定後的猜測必須符合全部既有線索，包含重複字母的數量與已揭曉的位置。格式錯誤或重複猜測不扣次數。每題最多兩次提示，每次揭露一個尚未確定的位置，不消耗猜測次數。三次內猜中且未用提示可得三星；四次內猜中且最多用一次提示可得兩星；其他猜中情況得一星。每題兩種模式分別保存最佳星數，總共 36 星，重玩不會重複灌分。猜中得 500 分，每剩一次猜測加 100 分，每次提示扣 50 分，線索鎖定再加 100 分；未猜中為零分。紀錄只存於此瀏覽器；儲存空間遭封鎖時僅在本次瀏覽保留。遊戲接受五字母組合，並未套用完整英文字典驗證。"},
    "zh-cn": {lock:"线索锁定", lockHelp:"首次猜测或提示前选择；之后必须遵守所有旧线索，包括重复字母的数量。", conflict:"这次猜测与先前线索矛盾，不扣次数。", repeat:"已经猜过这组字母，不扣次数。", hint:"提示 {n}/2：第 {p} 格是 {letter}。", noHints:"两次提示都已使用。", revealing:"正在逐格揭晓……", solved:"猜中了！", ended:"本题结束", answer:"答案：{word} · {stars}/3 颗星", score:"分数", guesses:"猜测次数", hints:"提示次数", best:"最佳分数", collection:"星级收集", progress:"{stars}/36 颗星 · 六题，两种挑战方式。", again:"再玩一次", home:"返回主页", guideTitle:"线索锁定与星级收集", guide:"六题英文猜词可自由推理，也可在首次猜测或提示前开启线索锁定。锁定后的猜测必须符合全部已有线索，包括重复字母的数量和已揭晓的位置。格式错误或重复猜测不扣次数。每题最多两次提示，每次揭示一个尚未确定的位置，不消耗猜测次数。三次内猜中且未用提示可得三星；四次内猜中且最多用一次提示可得两星；其他猜中情况得一星。每题两种模式分别保存最佳星数，共 36 星，重玩不会重复加星。猜中得 500 分，每剩一次猜测加 100 分，每次提示扣 50 分，线索锁定再加 100 分；未猜中为零分。记录只存于此浏览器；存储被阻止时仅在本次访问保留。游戏接受五字母组合，未使用完整英语词典验证。"},
    ja: {lock:"ヒント固定", lockHelp:"最初の予想・ヒントの前に選択。重複文字の数を含む、すべての手がかりを守ります。", conflict:"以前の手がかりと矛盾しています。回数は減りません。", repeat:"すでに試した予想です。回数は減りません。", hint:"ヒント {n}/2：{p} 文字目は {letter}。", noHints:"ヒントは2回とも使用済みです。", revealing:"結果を1文字ずつ表示中…", solved:"正解！", ended:"この問題は終了", answer:"答え：{word} · 星 {stars}/3", score:"スコア", guesses:"予想回数", hints:"ヒント回数", best:"ベスト", collection:"星コレクション", progress:"星 {stars}/36 · 6問、2つの遊び方。", again:"もう一度", home:"メインへ", guideTitle:"ヒント固定と星コレクション", guide:"6問の英単語パズルを自由に解くか、最初の予想・ヒントの前にヒント固定を選べます。固定中は、重複文字の数や判明した位置を含む全手がかりに合う予想が必要です。不正な入力や同じ予想では回数を消費しません。ヒントは各問2回までで、未確定の位置を1つ示し、予想回数は減りません。ヒントなしで3回以内に正解すると星3つ、ヒント1回以内で4回以内なら星2つ、それ以外の正解は星1つ。各問題・各モードの最高記録を保存し、合計36個の星を集めます。同じ問題の繰り返しでは星を水増しできません。正解は500点、残りの予想1回につき100点加算、ヒント1回につき50点減点、固定モードは100点加算。不正解は0点。記録はこのブラウザーのみで、保存が禁止されている場合は今回の閲覧中のみ保持します。5文字の組み合わせを受け付けますが、完全な英語辞書による検証は行いません。"},
    ko: {lock:"단서 고정", lockHelp:"첫 추측이나 힌트 전에 선택하세요. 중복 글자 수를 포함한 모든 이전 단서를 지켜야 합니다.", conflict:"이전 단서와 맞지 않습니다. 시도 횟수는 줄지 않습니다.", repeat:"이미 시도한 조합입니다. 횟수는 줄지 않습니다.", hint:"힌트 {n}/2: {p}번째 글자는 {letter}입니다.", noHints:"힌트 두 번을 모두 사용했습니다.", revealing:"글자별 결과를 공개하는 중…", solved:"정답입니다!", ended:"문제 종료", answer:"정답: {word} · 별 {stars}/3", score:"점수", guesses:"추측 횟수", hints:"힌트 횟수", best:"최고 점수", collection:"별 수집", progress:"별 {stars}/36 · 6문제, 두 가지 방식.", again:"다시 플레이", home:"메인으로", guideTitle:"단서 고정과 별 수집", guide:"6개의 영어 단어 문제를 자유롭게 풀거나 첫 추측·힌트 전에 단서 고정을 선택할 수 있습니다. 고정 모드에서는 중복 글자 수와 공개된 위치를 포함한 모든 단서를 따라야 합니다. 잘못된 형식이나 반복 추측은 횟수를 소모하지 않습니다. 문제마다 최대 두 번의 힌트로 미확정 위치 하나를 공개하며 추측 횟수는 줄지 않습니다. 힌트 없이 3회 이내 정답이면 별 3개, 힌트 1회 이하로 4회 이내 정답이면 별 2개, 그 밖의 정답은 별 1개입니다. 각 문제와 모드의 최고 별 수를 저장하므로 총 36개이며 반복 플레이로 중복 획득할 수 없습니다. 정답은 500점에 남은 추측당 100점, 힌트당 −50점, 고정 모드 +100점입니다. 오답 종료는 0점입니다. 기록은 이 브라우저에만 저장하며 저장이 차단되면 이번 방문 동안만 유지됩니다. 5글자 조합을 허용하지만 완전한 영어 사전 검사는 하지 않습니다."},
    es: {lock:"Fijar pistas", lockHelp:"Elige antes del primer intento o pista. Respeta todas las pistas, incluidas las letras repetidas.", conflict:"El intento contradice una pista anterior. No consume intento.", repeat:"Ya probaste esa combinación. No consume intento.", hint:"Pista {n}/2: la posición {p} es {letter}.", noHints:"Ya usaste las dos pistas.", revealing:"Revelando tu intento…", solved:"¡Palabra resuelta!", ended:"Fin del acertijo", answer:"Respuesta: {word} · {stars}/3 estrellas", score:"Puntos", guesses:"Intentos", hints:"Pistas", best:"Récord", collection:"Colección de estrellas", progress:"{stars}/36 estrellas · Seis acertijos, dos modos.", again:"Jugar de nuevo", home:"Volver al inicio", guideTitle:"Pistas fijas y estrellas", guide:"Juega los seis acertijos ingleses libremente o activa Fijar pistas antes del primer intento o pista. Después debes respetar toda la información previa, incluidas las cantidades de letras repetidas y las posiciones reveladas. Las entradas inválidas o repetidas no consumen intentos. Cada acertijo permite dos pistas que revelan una posición desconocida sin gastar un intento. Consigue tres estrellas al resolver en tres intentos sin pistas, dos en cuatro intentos con como máximo una pista, y una en los demás aciertos. Se guarda el mejor resultado por acertijo y modo: 36 estrellas en total, sin sumar repeticiones. Resolver da 500 puntos, más 100 por intento restante, menos 50 por pista y 100 extra con pistas fijas; no resolver da cero. Los registros quedan en este navegador; si se bloquea el almacenamiento, solo duran esta visita. Se aceptan combinaciones de cinco letras sin comprobar un diccionario completo."},
    "pt-br": {lock:"Fixar pistas", lockHelp:"Escolha antes do primeiro palpite ou dica. Respeite todas as pistas, incluindo letras repetidas.", conflict:"O palpite contradiz uma pista anterior. Não gasta tentativa.", repeat:"Você já tentou essa combinação. Não gasta tentativa.", hint:"Dica {n}/2: a posição {p} é {letter}.", noHints:"As duas dicas já foram usadas.", revealing:"Revelando seu palpite…", solved:"Palavra resolvida!", ended:"Fim do desafio", answer:"Resposta: {word} · {stars}/3 estrelas", score:"Pontos", guesses:"Tentativas", hints:"Dicas", best:"Recorde", collection:"Coleção de estrelas", progress:"{stars}/36 estrelas · Seis desafios, dois modos.", again:"Jogar novamente", home:"Voltar ao início", guideTitle:"Pistas fixas e estrelas", guide:"Resolva os seis desafios em inglês livremente ou escolha Fixar pistas antes do primeiro palpite ou dica. Depois, cada palpite deve respeitar todas as pistas, inclusive quantidades de letras repetidas e posições reveladas. Entradas inválidas ou repetidas não gastam tentativas. Cada desafio oferece até duas dicas, cada uma revelando uma posição desconhecida sem gastar palpite. Ganhe três estrelas ao resolver em três tentativas sem dicas, duas em quatro tentativas com no máximo uma dica, e uma nos demais acertos. O melhor resultado é salvo por desafio e modo: 36 estrelas no total, sem somar repetições. Resolver vale 500 pontos, mais 100 por tentativa restante, menos 50 por dica e mais 100 com pistas fixas; falhar vale zero. Os registros ficam neste navegador; com armazenamento bloqueado, duram só esta visita. Combinações de cinco letras são aceitas sem validação por um dicionário completo."},
    fr: {lock:"Indices imposés", lockHelp:"À choisir avant le premier essai ou indice. Respectez tous les indices, y compris les lettres répétées.", conflict:"Cet essai contredit un indice précédent. Aucun essai utilisé.", repeat:"Vous avez déjà essayé cette combinaison. Aucun essai utilisé.", hint:"Indice {n}/2 : la position {p} est {letter}.", noHints:"Les deux indices ont été utilisés.", revealing:"Révélation de votre essai…", solved:"Mot trouvé !", ended:"Énigme terminée", answer:"Réponse : {word} · {stars}/3 étoiles", score:"Score", guesses:"Essais", hints:"Indices", best:"Record", collection:"Collection d’étoiles", progress:"{stars}/36 étoiles · Six énigmes, deux modes.", again:"Rejouer", home:"Retour à l’accueil", guideTitle:"Indices imposés et étoiles", guide:"Résolvez les six énigmes anglaises librement ou choisissez les indices imposés avant le premier essai ou indice. Chaque proposition doit alors respecter tous les indices précédents, y compris le nombre de lettres répétées et les positions révélées. Les entrées invalides ou répétées ne coûtent aucun essai. Deux indices par énigme révèlent chacun une position inconnue sans dépenser d’essai. Gagnez trois étoiles en trois essais sans indice, deux en quatre essais avec au plus un indice, sinon une pour un mot trouvé. Le meilleur résultat est conservé par énigme et par mode : 36 étoiles au total, sans cumuler les répétitions. Un succès rapporte 500 points, plus 100 par essai restant, moins 50 par indice et 100 de plus avec indices imposés ; un échec vaut zéro. Les données restent dans ce navigateur ; si le stockage est bloqué, elles ne durent que cette visite. Les combinaisons de cinq lettres sont acceptées sans vérification dans un dictionnaire complet."},
    de: {lock:"Hinweise binden", lockHelp:"Vor dem ersten Versuch oder Tipp wählen. Alle Hinweise beachten, auch die Anzahl gleicher Buchstaben.", conflict:"Dieser Versuch widerspricht einem früheren Hinweis. Kein Versuch verbraucht.", repeat:"Diese Kombination hast du schon versucht. Kein Versuch verbraucht.", hint:"Tipp {n}/2: An Position {p} steht {letter}.", noHints:"Beide Tipps wurden verwendet.", revealing:"Dein Versuch wird aufgedeckt…", solved:"Wort gelöst!", ended:"Rätsel beendet", answer:"Lösung: {word} · {stars}/3 Sterne", score:"Punkte", guesses:"Versuche", hints:"Tipps", best:"Bestwert", collection:"Sternesammlung", progress:"{stars}/36 Sterne · Sechs Rätsel, zwei Spielweisen.", again:"Erneut spielen", home:"Zurück zum Start", guideTitle:"Verbindliche Hinweise und Sterne", guide:"Spiele die sechs englischen Worträtsel frei oder aktiviere vor dem ersten Versuch oder Tipp verbindliche Hinweise. Jeder weitere Versuch muss alle bekannten Hinweise erfüllen, auch die Anzahl wiederholter Buchstaben und aufgedeckte Positionen. Ungültige oder wiederholte Eingaben kosten keinen Versuch. Bis zu zwei Tipps pro Rätsel zeigen je eine ungeklärte Position, ohne einen Versuch zu verbrauchen. Drei Sterne gibt es für eine Lösung in drei Versuchen ohne Tipp, zwei für vier Versuche mit höchstens einem Tipp, sonst einen für eine Lösung. Pro Rätsel und Modus wird der beste Sternestand gespeichert: insgesamt 36, ohne Wiederholungen zu addieren. Eine Lösung bringt 500 Punkte, plus 100 je verbleibendem Versuch, minus 50 je Tipp und 100 extra für verbindliche Hinweise; ein ungelöstes Rätsel bringt null. Daten bleiben in diesem Browser; bei blockiertem Speicher nur während dieses Besuchs. Fünf-Buchstaben-Kombinationen werden ohne vollständige Wörterbuchprüfung akzeptiert."},
    it: {lock:"Indizi vincolanti", lockHelp:"Scegli prima del primo tentativo o indizio. Rispetta tutti gli indizi, anche le lettere ripetute.", conflict:"Il tentativo contraddice un indizio precedente. Nessun tentativo consumato.", repeat:"Hai già provato questa combinazione. Nessun tentativo consumato.", hint:"Indizio {n}/2: la posizione {p} è {letter}.", noHints:"Hai usato entrambi gli indizi.", revealing:"Rivelazione del tentativo…", solved:"Parola trovata!", ended:"Enigma concluso", answer:"Risposta: {word} · {stars}/3 stelle", score:"Punti", guesses:"Tentativi", hints:"Indizi", best:"Record", collection:"Collezione di stelle", progress:"{stars}/36 stelle · Sei enigmi, due modalità.", again:"Gioca ancora", home:"Torna alla schermata principale", guideTitle:"Indizi vincolanti e stelle", guide:"Gioca liberamente ai sei enigmi inglesi oppure scegli gli indizi vincolanti prima del primo tentativo o indizio. Le proposte devono rispettare tutte le informazioni precedenti, incluse le quantità di lettere ripetute e le posizioni rivelate. Input non validi o ripetuti non consumano tentativi. Ogni enigma permette due indizi, ciascuno dei quali rivela una posizione sconosciuta senza spendere un tentativo. Ottieni tre stelle risolvendo in tre tentativi senza indizi, due in quattro tentativi con al massimo un indizio, altrimenti una per una soluzione. Viene salvato il miglior risultato per enigma e modalità: 36 stelle totali, senza accumulare ripetizioni. Una soluzione vale 500 punti, più 100 per tentativo rimasto, meno 50 per indizio e 100 extra con indizi vincolanti; un enigma non risolto vale zero. I dati restano in questo browser; con memoria bloccata durano solo questa visita. Le combinazioni di cinque lettere sono accettate senza verifica in un dizionario completo."},
    ru: {lock:"Строгие подсказки", lockHelp:"Выберите до первой попытки или подсказки. Соблюдайте все улики, включая число одинаковых букв.", conflict:"Попытка противоречит прежней улике. Попытка не потрачена.", repeat:"Вы уже пробовали эту комбинацию. Попытка не потрачена.", hint:"Подсказка {n}/2: на позиции {p} стоит {letter}.", noHints:"Обе подсказки уже использованы.", revealing:"Открываем результат по буквам…", solved:"Слово найдено!", ended:"Загадка завершена", answer:"Ответ: {word} · {stars}/3 звезды", score:"Очки", guesses:"Попытки", hints:"Подсказки", best:"Рекорд", collection:"Коллекция звёзд", progress:"{stars}/36 звёзд · Шесть загадок, два режима.", again:"Играть ещё", home:"На главную", guideTitle:"Строгие подсказки и звёзды", guide:"Шесть английских загадок доступны в свободном режиме или со строгими подсказками, выбранными до первой попытки или подсказки. В строгом режиме нужно учитывать все прежние улики, включая число повторяющихся букв и открытые позиции. Неверный формат и повторные варианты не тратят попытки. Две подсказки на загадку открывают по одной неизвестной позиции без расхода попытки. Три звезды даются за ответ за три попытки без подсказок, две — за четыре попытки с одной подсказкой или без неё, иначе одна за верный ответ. Сохраняется лучший результат каждой загадки в каждом режиме: всего 36 звёзд, без накопления за повторы. Верный ответ даёт 500 очков, по 100 за оставшуюся попытку, минус 50 за подсказку и ещё 100 в строгом режиме; неудача даёт ноль. Данные остаются в этом браузере; при запрете хранения — только на время посещения. Принимаются сочетания из пяти букв без проверки по полному словарю."},
    hi: {lock:"संकेतों का पालन", lockHelp:"पहली कोशिश या संकेत से पहले चुनें। दोहराए अक्षरों की संख्या समेत सभी पुराने संकेत मानें।", conflict:"यह अनुमान पुराने संकेत से मेल नहीं खाता। कोशिश नहीं घटी।", repeat:"यह अनुमान पहले दिया जा चुका है। कोशिश नहीं घटी।", hint:"संकेत {n}/2: स्थान {p} पर {letter} है।", noHints:"दोनों संकेत इस्तेमाल हो चुके हैं।", revealing:"अक्षरों का परिणाम दिखाया जा रहा है…", solved:"शब्द मिल गया!", ended:"पहेली समाप्त", answer:"उत्तर: {word} · {stars}/3 सितारे", score:"अंक", guesses:"कोशिशें", hints:"संकेत", best:"सर्वश्रेष्ठ", collection:"सितारों का संग्रह", progress:"{stars}/36 सितारे · छह पहेलियाँ, दो तरीके।", again:"फिर खेलें", home:"मुख्य पृष्ठ पर", guideTitle:"संकेतों का पालन और सितारे", guide:"छह अंग्रेज़ी पहेलियाँ स्वतंत्र रूप से खेलें या पहली कोशिश अथवा संकेत से पहले संकेतों का पालन चुनें। इस तरीके में दोहराए अक्षरों की संख्या और खुली जगहों समेत सभी पुराने संकेतों का पालन ज़रूरी है। गलत प्रारूप या दोहराए अनुमान से कोशिश नहीं घटती। हर पहेली में अधिकतम दो संकेत हैं; हर संकेत एक अनिश्चित स्थान खोलता है और कोशिश नहीं खर्च करता। बिना संकेत तीन कोशिशों में हल करने पर तीन सितारे, अधिकतम एक संकेत के साथ चार कोशिशों में दो सितारे, अन्य सही उत्तर पर एक सितारा मिलता है। हर पहेली और तरीके का सर्वश्रेष्ठ संग्रहित होता है: कुल 36 सितारे, दोहराने से अतिरिक्त सितारे नहीं जुड़ते। सही उत्तर पर 500 अंक, हर बची कोशिश पर 100 अतिरिक्त, हर संकेत पर 50 कम और संकेतों के पालन वाले तरीके में 100 अतिरिक्त मिलते हैं; असफलता पर शून्य। रिकॉर्ड इसी ब्राउज़र में रहते हैं; संग्रहण बंद हो तो केवल इस बार की यात्रा तक। पाँच अक्षरों के संयोजन स्वीकार होते हैं, पर पूरे अंग्रेज़ी शब्दकोश से जाँच नहीं होती।"},
    ar: {lock:"الالتزام بالأدلة", lockHelp:"اختر قبل أول تخمين أو تلميح. التزم بكل الأدلة، بما فيها عدد الأحرف المكررة.", conflict:"هذا التخمين يخالف دليلًا سابقًا. لم تُستهلك محاولة.", repeat:"جرّبت هذا التخمين من قبل. لم تُستهلك محاولة.", hint:"تلميح {n}/2: الحرف في الموضع {p} هو {letter}.", noHints:"استُخدم التلميحان.", revealing:"جارٍ كشف نتيجة التخمين…", solved:"وجدت الكلمة!", ended:"انتهى اللغز", answer:"الإجابة: {word} · {stars}/3 نجوم", score:"النقاط", guesses:"المحاولات", hints:"التلميحات", best:"الأفضل", collection:"مجموعة النجوم", progress:"{stars}/36 نجمة · ستة ألغاز بطريقتين.", again:"العب مجددًا", home:"العودة إلى الرئيسية", guideTitle:"الالتزام بالأدلة وجمع النجوم", guide:"العب الألغاز الإنجليزية الستة بحرية أو اختر الالتزام بالأدلة قبل أول تخمين أو تلميح. عند تفعيله يجب أن يطابق كل تخمين الأدلة السابقة، بما فيها عدد الأحرف المكررة والمواضع المكشوفة. الإدخال غير الصالح أو المكرر لا يستهلك محاولة. لكل لغز تلميحان يكشف كل منهما موضعًا غير مؤكد دون استهلاك تخمين. تحصل على ثلاث نجوم عند الحل خلال ثلاث محاولات دون تلميحات، ونجمتين خلال أربع محاولات مع تلميح واحد كحد أقصى، وإلا نجمة واحدة للحل. يُحفظ أفضل عدد لكل لغز وطريقة: 36 نجمة إجمالًا دون جمع إضافي بتكرار اللعب. الحل يمنح 500 نقطة، و100 لكل محاولة متبقية، ويخصم 50 لكل تلميح، ويضيف 100 عند الالتزام بالأدلة؛ عدم الحل يمنح صفرًا. تبقى السجلات في هذا المتصفح؛ إذا مُنع التخزين فتبقى لهذه الزيارة فقط. تُقبل تركيبات من خمسة أحرف دون فحص بقاموس إنجليزي كامل."}
  };
  const localeKey = locale => ({"zh-Hant":"zh-tw","zh-Hans":"zh-cn","pt-BR":"pt-br"})[locale] || locale;
  const copy = locale => COPY[localeKey(locale)] || COPY.en;
  const text = locale => TEXT[localeKey(locale)] || TEXT.en;
  const format = (template, data) => template.replace(/\{(\w+)\}/g, (_, key) => String(data[key] ?? ""));
  const escape = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  const symbols = {hit:"✓", near:"↔", miss:"×"};
  const rank = {miss:1, near:2, hit:3};
  function feedback(guess, target) {
    const result = Array(5).fill("miss"), remaining = Object.create(null);
    for (let i=0; i<5; i++) {
      if (guess[i] === target[i]) result[i] = "hit";
      else remaining[target[i]] = (remaining[target[i]] || 0) + 1;
    }
    for (let i=0; i<5; i++) if (result[i] !== "hit" && remaining[guess[i]] > 0) {
      result[i] = "near"; remaining[guess[i]]--;
    }
    return result;
  }
  // Re-evaluate only published feedback; this does not solve using hidden data.
  const respectsClues = (candidate, guesses, target, hints = []) =>
    hints.every(hint => candidate[hint.position] === hint.letter) &&
    guesses.every(guess => feedback(guess, candidate).join() === feedback(guess, target).join());
  const scoreFor = (success, guesses, hints, locked) => success ? 500 + (6-guesses)*100 - hints*50 + (locked ? 100 : 0) : 0;
  const starsFor = (success, guesses, hints) => !success ? 0 : guesses <= 3 && hints === 0 ? 3 : guesses <= 4 && hints <= 1 ? 2 : 1;
  const knownLetters = state => {
    const known = Array(5).fill("");
    state.guesses.forEach(guess => feedback(guess, state.target).forEach((tone, i) => { if (tone === "hit") known[i] = guess[i]; }));
    state.wordleV18.hints.forEach(hint => { known[hint.position] = hint.letter; });
    return known;
  };
  const STORE = "weightplay_wordle_v18_mastery";
  function readProfile() {
    const profile = {lock:false, best:0, stars:Object.create(null)};
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || "null");
      if (!raw || typeof raw !== "object") return profile;
      profile.lock = raw.lock === true;
      profile.best = Math.max(0, Math.min(1100, Number(raw.best) || 0));
      if (raw.stars && typeof raw.stars === "object") Object.entries(raw.stars).slice(0,12).forEach(([key,value]) => {
        if (/^[a-z\d_-]{1,40}:(free|lock)$/i.test(key) && Number.isInteger(value) && value >= 0 && value <= 3) profile.stars[key] = value;
      });
    } catch { /* Optional local storage never gates input. */ }
    return profile;
  }
  const profile = readProfile();
  const saveProfile = () => { try { localStorage.setItem(STORE, JSON.stringify(profile)); } catch { /* Session-only progress remains playable. */ } };
  const collectionTotal = () => Math.min(36, Object.values(profile.stars).reduce((sum, n) => sum+n, 0));
  let active = null, view = null, pending = null, generation = 0, resultPresented = null, lastScene = "";
  const animations = new Set(), pauseReasons = new Set();
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  function tween(node, frames, options = {}, gameplay = true) {
    if (!node?.animate || reduced?.matches) return Promise.resolve(true);
    const animation = node.animate(frames, {duration:160, easing:"cubic-bezier(.2,.8,.2,1)", ...options});
    const entry = {animation, gameplay};
    animations.add(entry);
    if (gameplay && pauseReasons.size) animation.pause();
    return animation.finished.then(() => true, () => false).finally(() => {
      animations.delete(entry); animation.cancel();
    });
  }
  function pause(reason) {
    pauseReasons.add(reason);
    animations.forEach(entry => { if (entry.gameplay) entry.animation.pause(); });
  }
  function resume(reason) {
    pauseReasons.delete(reason);
    if (!pauseReasons.size) animations.forEach(entry => { if (entry.gameplay && entry.animation.playState === "paused") (reduced?.matches ? entry.animation.finish() : entry.animation.play()); });
  }
  function cancelMotion() {
    generation++; pending = null;
    animations.forEach(entry => entry.animation.cancel());
    animations.clear();
    pauseReasons.delete("leave");
    if (active) {
      active.state.paused = false;
      if (active.state.wordleV18?.notice?.key === "revealing") active.state.wordleV18.notice = null;
    }
    setBusy(false);
  }
  function isCovered() {
    return document.hidden || pauseReasons.size > 0 || Boolean(document.querySelector('dialog[open], [role="dialog"]:not([hidden])')) || Boolean(active?.board.closest("[inert]"));
  }
  function canInput() {
    return active && !active.state.done && !pending && document.body.dataset.screen === "battle" && !isCovered();
  }
  function setBusy(busy) {
    if (!view) return;
    view.keyboard.setAttribute("aria-busy", String(busy));
    view.keyboard.querySelectorAll("button").forEach(button => button.setAttribute("aria-disabled", String(busy)));
    const state = active?.state;
    view.lock.disabled = Boolean(busy || state?.done || state?.guesses.length || state?.wordleV18.hints.length);
    for (const id of ["hintBtn", "restartBtn"]) {
      const button = document.getElementById(id);
      if (button) button.disabled = Boolean(busy || state?.done || (id === "hintBtn" && state?.wordleV18.hints.length >= 2));
    }
  }
  function status(key, values = {}, warning = false) {
    if (!active) return;
    const state = active.state, ui = text(active.locale), c = copy(active.locale);
    state.wordleV18.notice = {key, values, warning};
    const message = key === "length" ? c[8] : key === "next" ? c[9] : format(ui[key], values);
    state.message = message; state.messageKey = "wordleV18"; state.tone = warning ? "warn" : "";
    const node = document.getElementById("gameMessage");
    if (node) { node.dataset.runtimeLocalize = "off"; node.textContent = message; node.dataset.tone = state.tone; }
  }
  function invalid(key) {
    status(key, {}, true);
    void tween(view?.rows[Math.min(5, active.state.guesses.length)], [
      {transform:"translateX(0)"}, {transform:"translateX(-5px)"}, {transform:"translateX(5px)"}, {transform:"translateX(0)"}
    ], {duration:240});
  }
  function build(ctx) {
    ctx.board.innerHTML = '<div class="wordle-board" dir="ltr" role="table" aria-rowcount="6" aria-colcount="5" data-wordle-ui="18">' +
      Array.from({length:6}, () => '<div class="wordle-row" role="row">' + Array.from({length:5}, () => '<span class="word-cell" role="cell"><span class="wordle-letter"></span><small aria-hidden="true"></small></span>').join("") + '</div>').join("") + '</div>';
    ctx.controls.innerHTML = '<div class="wordle-help"><div class="wordle-tools"><label class="wordle-lock-label"><input type="checkbox" id="wordleClueLock" aria-describedby="wordleLockHelp"><span></span></label><output class="wordle-known" dir="ltr"></output></div><p id="wordleLockHelp" class="wordle-sr-only"></p><div class="wordle-legend">' +
      ["hit","near","miss"].map(tone => `<span class="${tone}"></span>`).join("") + '</div></div><div class="wordle-keyboard" dir="ltr" role="group">' +
      ["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"].map(row => '<div class="wordle-key-row">' + [...row].map(letter => `<button type="button" class="wordle-key" data-word-key="${letter}">${letter}</button>`).join("") + '</div>').join("") +
      '<div class="wordle-key-row wordle-command-row"><button type="button" data-word-key="BACKSPACE"></button><button type="button" class="primary" data-word-key="ENTER"></button></div></div>';
    view = {
      board:ctx.board.firstElementChild,
      rows:[...ctx.board.querySelectorAll(".wordle-row")],
      cells:[...ctx.board.querySelectorAll(".word-cell")],
      keyboard:ctx.controls.querySelector(".wordle-keyboard"),
      keys:[...ctx.controls.querySelectorAll("button[data-word-key]")],
      lock:ctx.controls.querySelector("#wordleClueLock"),
      known:ctx.controls.querySelector(".wordle-known"),
      legend:[...ctx.controls.querySelectorAll(".wordle-legend span")]
    };
    ctx.controls.onclick = event => {
      const button = event.target.closest?.("button[data-word-key]");
      if (button && ctx.controls.contains(button)) input(button.dataset.wordKey);
    };
    view.lock.addEventListener("change", () => {
      const state = active.state, meta = state.wordleV18;
      if (!canInput() || state.guesses.length || meta.hints.length) { view.lock.checked = meta.lock; return; }
      meta.lock = view.lock.checked; profile.lock = meta.lock; saveProfile();
      paint();
    });
  }
  function paintCell(node, letter, tone, row, column, locale) {
    const c = copy(locale), label = tone ? c[2+["hit","near","miss"].indexOf(tone)] : "";
    node.querySelector(".wordle-letter").textContent = letter;
    node.querySelector("small").textContent = symbols[tone] || "";
    node.className = `word-cell${tone ? ` ${tone}` : ""}`;
    node.setAttribute("aria-label", `${row+1}, ${column+1}: ${letter || "—"} ${label}`);
  }
  function paint() {
    if (!active || !view) return;
    const {state, locale} = active, c = copy(locale), ui = text(locale);
    const tones = state.guesses.map(guess => feedback(guess, state.target));
    const keys = Object.create(null);
    state.guesses.forEach((guess, row) => [...guess].forEach((letter, column) => {
      const tone = tones[row][column]; if ((rank[keys[letter]] || 0) < rank[tone]) keys[letter] = tone;
    }));
    view.board.setAttribute("aria-label", c[0]);
    view.board.dataset.wordKey = state.wordKey;
    view.rows.forEach((row, r) => {
      row.classList.toggle("active-guess", !state.done && r === state.guesses.length);
      for (let i=0; i<5; i++) {
        const letter = (state.guesses[r] || (!state.done && r === state.guesses.length ? state.draft || "" : ""))[i] || "";
        // A locale repaint must not reveal the next animation frame early.
        const tone = tones[r]?.[i] || (pending?.state === state && pending.row === r ? pending.shown[i] : "");
        paintCell(view.cells[r*5+i], letter, tone, r, i, locale);
      }
    });
    view.keys.forEach(button => {
      const key = button.dataset.wordKey, tone = keys[key];
      if (key === "ENTER") button.textContent = `${c[5]} · ${Math.min(6,state.guesses.length+1)}/6`;
      else if (key === "BACKSPACE") { button.textContent = `⌫ ${c[6]}`; button.setAttribute("aria-label", c[6]); }
      else { button.className = `wordle-key${tone ? ` ${tone}` : ""}`; button.setAttribute("aria-label", `${key}${tone ? `: ${c[2+["hit","near","miss"].indexOf(tone)]}` : ""}`); }
    });
    view.keyboard.setAttribute("aria-label", c[7]);
    view.legend.forEach((node, i) => { node.textContent = `${symbols[["hit","near","miss"][i]]} ${c[2+i]}`; });
    view.lock.checked = state.wordleV18.lock;
    view.lock.nextElementSibling.textContent = ui.lock;
    view.lock.closest("label").title = ui.lockHelp;
    document.getElementById("wordleLockHelp").textContent = ui.lockHelp;
    const known = knownLetters(state);
    view.known.textContent = known.map(letter => letter || "·").join(" ");
    view.known.setAttribute("aria-label", `${c[2]}: ${known.map(letter => letter || "—").join(" ")}`);
    setBusy(Boolean(pending));
    const notice = state.wordleV18.notice;
    if (notice && !state.done) status(notice.key, notice.values, notice.warning);
  }
  function paintMain() {
    if (!active) return;
    const ui = text(active.locale), c = copy(active.locale);
    const progress = document.querySelector("[data-wp-main-progress]");
    if (progress) {
      progress.dataset.runtimeLocalize = "off";
      const label = progress.querySelector("strong"), value = progress.querySelector("span");
      if (label) label.textContent = ui.collection;
      if (value) value.textContent = format(ui.progress, {stars:collectionTotal()});
    }
    const instruction = document.getElementById("mainInstruction");
    if (instruction) { instruction.dataset.runtimeLocalize = "off"; instruction.textContent = c[1]; }
    const guide = document.querySelector(".game-info-sections");
    if (guide) {
      let article = document.getElementById("wordleMasteryGuide");
      if (!article) { article = document.createElement("article"); article.id = "wordleMasteryGuide"; article.className = "game-info-section"; article.dataset.runtimeLocalize = "off"; article.innerHTML = "<h3></h3><p></p>"; guide.append(article); }
      article.querySelector("h3").textContent = ui.guideTitle;
      article.querySelector("p").textContent = ui.guide;
      article.lang = active.locale;
    }
  }
  function recordResult() {
    const state = active.state, meta = state.wordleV18;
    if (meta.recorded) return;
    meta.recorded = true;
    const stars = starsFor(state.success, state.guesses.length, meta.hints.length);
    const key = `${state.wordKey}:${meta.lock ? "lock" : "free"}`;
    if (/^[a-z\d_-]{1,40}:(free|lock)$/i.test(key)) profile.stars[key] = Math.max(profile.stars[key] || 0, stars);
    profile.best = Math.max(profile.best, scoreFor(state.success, state.guesses.length, meta.hints.length, meta.lock));
    saveProfile();
  }
  function presentResult(focus = false) {
    if (!active?.state.done) return;
    const result = document.getElementById("resultScreen");
    if (!result || result.hidden) return;
    const {state, locale} = active, meta = state.wordleV18, ui = text(locale);
    recordResult();
    const stars = starsFor(state.success, state.guesses.length, meta.hints.length);
    result.dataset.runtimeLocalize = "off";
    result.dataset.wordleStars = String(stars);
    document.getElementById("resultTitle").textContent = state.success ? ui.solved : ui.ended;
    document.getElementById("resultCopy").textContent = format(ui.answer, {word:state.target, stars});
    const stats = document.getElementById("resultStats");
    stats.innerHTML = [[ui.score,scoreFor(state.success,state.guesses.length,meta.hints.length,meta.lock)], [ui.guesses,`${state.guesses.length}/6`], [ui.hints,`${meta.hints.length}/2`], [ui.best,profile.best]].map(([label,value]) => `<span class="stat"><span>${escape(label)}</span><strong>${escape(value)}</strong></span>`).join("");
    const retry = document.getElementById("retryBtn"), home = document.getElementById("homeBtn");
    retry.textContent = ui.again; home.textContent = ui.home;
    if (focus && resultPresented !== state) {
      resultPresented = state;
      retry.focus({preventScroll:true});
      void tween(result.querySelector(".arcade-panel"), [{opacity:0, transform:"translateY(12px) scale(.98)"}, {opacity:1, transform:"translateY(0) scale(1)"}], {duration:260}, false);
    }
    paintMain();
  }
  function render(ctx) {
    if (!ctx?.state || !ctx.board || !ctx.controls) throw new Error("Wordle render context is incomplete.");
    if (active?.state !== ctx.state) { cancelMotion(); resultPresented = null; }
    active = ctx;
    if (!ctx.state.wordleV18) ctx.state.wordleV18 = {lock:profile.lock, hints:[], notice:null, recorded:false};
    for (const node of [ctx.board, ctx.controls]) node.dataset.runtimeLocalize = "off";
    if (!view || !ctx.board.contains(view.board) || !ctx.controls.contains(view.keyboard)) build(ctx);
    paint(); paintMain();
    if (ctx.state.done) presentResult();
  }
  function commit(ticket) {
    if (pending !== ticket || ticket.generation !== generation || active?.state !== ticket.state || ticket.state.done) return;
    pending = null;
    const state = ticket.state, meta = state.wordleV18;
    // Compensate for the legacy arcade's +100/+10 and success minimum.
    // v18 success scores are >=400, always above that minimum (<=160).
    state.score = ticket.guess === state.target ? scoreFor(true,state.guesses.length+1,meta.hints.length,meta.lock)-100 : -10;
    meta.notice = null;
    try { ticket.submit(); }
    catch (error) {
      // Legacy finish reads optional storage before showing Result. Recover
      // only that completed-round SecurityError, never swallow gameplay bugs.
      if (!state.done || error?.name !== "SecurityError") throw error;
      document.getElementById("resultScreen").hidden = false;
      document.body.dataset.screen = "result";
      window.dispatchEvent(new Event("weightplay:shell-sync"));
    } finally {
      setBusy(false);
    }
    if (active?.state === state) {
      if (!state.done) status("next");
      paint();
      if (state.done) presentResult();
      else view.keys.find(button => button.dataset.wordKey === "ENTER")?.focus({preventScroll:true});
    }
  }
  async function submit() {
    if (!canInput()) return;
    const state = active.state, guess = state.draft || "", meta = state.wordleV18;
    if (!/^[A-Z]{5}$/.test(guess)) { invalid("length"); return; }
    if (state.guesses.includes(guess)) { invalid("repeat"); return; }
    if (meta.lock && !respectsClues(guess,state.guesses,state.target,meta.hints)) { invalid("conflict"); return; }
    const ticket = {state, guess, row:state.guesses.length, submit:active.submit, generation, shown:Array(5).fill("")};
    pending = ticket; setBusy(true); status("revealing");
    const tones = feedback(guess,state.target);
    try {
      await Promise.all(tones.map(async (tone, i) => {
        const cell = view.cells[ticket.row*5+i];
        const ready = await tween(cell, [{transform:"rotateX(0deg)"},{transform:"rotateX(90deg)"}], {duration:110, delay:i*75, easing:"ease-in", fill:"backwards"});
        if (!ready || pending !== ticket || generation !== ticket.generation) return;
        ticket.shown[i] = tone;
        paintCell(cell, guess[i], tone, ticket.row, i, active.locale);
        await tween(cell, [{transform:"rotateX(-90deg)"},{transform:"rotateX(0deg)"}], {duration:160, easing:"ease-out"});
      }));
      if (guess === state.target && pending === ticket) await tween(view.rows[ticket.row], [{transform:"translateY(0)"},{transform:"translateY(-6px)"},{transform:"translateY(0)"}], {duration:220});
      commit(ticket);
    } catch (error) {
      // A rendering capability failure must not strand an accepted guess.
      if (pending === ticket) commit(ticket);
      else console.error("Wordle reveal failed", error);
    }
  }
  function input(key) {
    if (!canInput()) return;
    if (key === "ENTER") { void submit(); return; }
    const state = active.state, previous = state.draft || "";
    if (key === "BACKSPACE") state.draft = previous.slice(0,-1);
    else if (/^[A-Z]$/.test(key) && previous.length < 5) state.draft = previous+key;
    else return;
    if (state.draft === previous) return;
    state.wordleV18.notice = null;
    paint();
    const column = key === "BACKSPACE" ? state.draft.length : state.draft.length-1;
    void tween(view.cells[state.guesses.length*5+column], [{transform:"scale(.86)"},{transform:"scale(1.06)"},{transform:"scale(1)"}], {duration:120});
  }
  function hint() {
    if (!canInput()) return;
    const state = active.state, meta = state.wordleV18;
    if (meta.hints.length >= 2) { status("noHints", {}, true); return; }
    const position = knownLetters(state).findIndex(letter => !letter);
    if (position < 0) return;
    meta.hints.push({position, letter:state.target[position]});
    status("hint", {n:meta.hints.length, p:position+1, letter:state.target[position]});
    paint();
    void tween(view.known, [{opacity:.4,transform:"scale(.94)"},{opacity:1,transform:"scale(1)"}], {duration:240});
  }
  function onScene(scene) {
    if (scene === "main") { cancelMotion(); resultPresented = null; }
    if (scene === "result") { presentResult(true); }
    if (scene !== lastScene && scene === "main") void tween(document.querySelector("#mainScreen .main-panel"), [{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}], {duration:220}, false);
    if (scene !== lastScene && scene === "battle") void tween(document.querySelector("#battleScreen .board-wrap"), [{opacity:0,transform:"scale(.97)"},{opacity:1,transform:"scale(1)"}], {duration:220});
    lastScene = scene;
  }
  document.addEventListener("click", event => {
    const target = event.target.closest?.("button");
    if (!target) return;
    if (target.id === "hintBtn") { event.preventDefault(); event.stopImmediatePropagation(); hint(); }
    if (target.id === "battleBackBtn" && active && !active.state.done && document.body.dataset.screen === "battle") {
      pause("leave"); active.state.paused = true;
    }
    if (target.id === "leaveContinue") { if (active) active.state.paused = false; resume("leave"); }
    if (["leaveMain","restartBtn","retryBtn","homeBtn"].includes(target.id)) cancelMotion();
  }, true);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && pauseReasons.has("leave")) { if (active) active.state.paused = false; resume("leave"); return; }
    if (!active || event.ctrlKey || event.metaKey || event.altKey || event.isComposing || isCovered()) return;
    if (event.target.closest?.('input,textarea,select,[contenteditable="true"]')) return;
    // Enter activates the focused native button, including Delete, exactly once.
    if (event.key === "Enter" && event.target.closest?.("button")) return;
    if (document.body.dataset.screen === "battle" && (/^[a-z]$/i.test(event.key) || ["Enter","Backspace"].includes(event.key))) {
      event.preventDefault(); input(event.key.toUpperCase());
    }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause("hidden"); else resume("hidden"); });
  window.addEventListener("pagehide", () => { cancelMotion(); if (active && !active.state.done) paint(); });
  window.addEventListener("pageshow", () => { if (!document.hidden) resume("hidden"); });
  reduced?.addEventListener?.("change", () => {
    if (reduced.matches) animations.forEach(entry => { if (!entry.gameplay || !pauseReasons.size) entry.animation.finish(); });
  });
  window.WPWordleUI = {
    render, feedback, copy, onScene, presentResult,
    rules:Object.freeze({respectsClues, scoreFor, starsFor}),
    locales:Object.freeze({copy:COPY, text:TEXT})
  };
})();
