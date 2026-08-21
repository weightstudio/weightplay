(() => {
  "use strict";

  const LOCALES = [
    ["en", "English"], ["zh-Hant", "繁體中文"], ["zh-Hans", "简体中文"], ["ja", "日本語"],
    ["ko", "한국어"], ["es", "Español"], ["pt-BR", "Português"], ["fr", "Français"],
    ["de", "Deutsch"], ["it", "Italiano"], ["ru", "Русский"], ["hi", "हिन्दी"], ["ar", "العربية"],
  ];

  const TITLES = {
    en: { tetris: "Tetris", snake: "Snake", "tic-tac-toe": "Tic-Tac-Toe", chess: "Chess", checkers: "Checkers", "mahjong-solitaire": "Mahjong Solitaire", wordle: "Wordle", hangman: "Hangman", breakout: "Breakout", pong: "Pong" },
    "zh-Hant": { tetris: "俄羅斯方塊", snake: "貪食蛇", "tic-tac-toe": "井字棋", chess: "西洋棋", checkers: "西洋跳棋", "mahjong-solitaire": "麻將接龍", wordle: "Wordle 猜字", hangman: "猜字吊人", breakout: "打磚塊", pong: "乒乓球" },
    "zh-Hans": { tetris: "俄罗斯方块", snake: "贪吃蛇", "tic-tac-toe": "井字棋", chess: "国际象棋", checkers: "西洋跳棋", "mahjong-solitaire": "麻将接龙", wordle: "Wordle 猜词", hangman: "猜词吊人", breakout: "打砖块", pong: "乒乓球" },
    ja: { tetris: "テトリス", snake: "スネーク", "tic-tac-toe": "三目並べ", chess: "チェス", checkers: "チェッカー", "mahjong-solitaire": "麻雀ソリティア", wordle: "Wordle", hangman: "ハングマン", breakout: "ブロック崩し", pong: "卓球" },
    ko: { tetris: "테트리스", snake: "스네이크", "tic-tac-toe": "틱택토", chess: "체스", checkers: "체커", "mahjong-solitaire": "마작 솔리테어", wordle: "Wordle", hangman: "행맨", breakout: "벽돌깨기", pong: "퐁" },
    es: { tetris: "Tetris", snake: "Serpiente", "tic-tac-toe": "Tres en raya", chess: "Ajedrez", checkers: "Damas", "mahjong-solitaire": "Mahjong solitario", wordle: "Wordle", hangman: "Ahorcado", breakout: "Rompe ladrillos", pong: "Pong" },
    "pt-BR": { tetris: "Tetris", snake: "Snake", "tic-tac-toe": "Jogo da velha", chess: "Xadrez", checkers: "Damas", "mahjong-solitaire": "Paciência Mahjong", wordle: "Wordle", hangman: "Forca", breakout: "Quebra-blocos", pong: "Pong" },
    fr: { tetris: "Tetris", snake: "Snake", "tic-tac-toe": "Morpion", chess: "Échecs", checkers: "Dames", "mahjong-solitaire": "Mahjong solitaire", wordle: "Wordle", hangman: "Pendu", breakout: "Casse-briques", pong: "Pong" },
    de: { tetris: "Tetris", snake: "Schlange", "tic-tac-toe": "Drei gewinnt", chess: "Schach", checkers: "Dame", "mahjong-solitaire": "Mahjong-Solitär", wordle: "Wordle", hangman: "Galgenmännchen", breakout: "Brick Breaker", pong: "Pong" },
    it: { tetris: "Tetris", snake: "Snake", "tic-tac-toe": "Tris", chess: "Scacchi", checkers: "Dama", "mahjong-solitaire": "Mahjong solitario", wordle: "Wordle", hangman: "Impiccato", breakout: "Arkanoid", pong: "Pong" },
    ru: { tetris: "Тетрис", snake: "Змейка", "tic-tac-toe": "Крестики-нолики", chess: "Шахматы", checkers: "Шашки", "mahjong-solitaire": "Маджонг-солitaire", wordle: "Wordle", hangman: "Виселица", breakout: "Арканоид", pong: "Понг" },
    hi: { tetris: "टेट्रिस", snake: "स्नेक", "tic-tac-toe": "टिक-टैक-टो", chess: "शतरंज", checkers: "चेकर्स", "mahjong-solitaire": "माहजोंग सॉलिटेयर", wordle: "Wordle", hangman: "हैंगमैन", breakout: "ब्रेकआउट", pong: "पोंग" },
    ar: { tetris: "تتريس", snake: "الثعبان", "tic-tac-toe": "إكس-أو", chess: "الشطرنج", checkers: "الداما", "mahjong-solitaire": "ماجونغ سوليتير", wordle: "Wordle", hangman: "الرجل المشنوق", breakout: "كسر الطوب", pong: "بونغ" },
  };

  const COPY = {
    en: { eyebrow: "Popular Games Collection", tagline: "A polished owner-preview arcade with ten distinct classics.", objective: "Objective", start: "Start Game", hint: "Hint", restart: "Restart", retry: "Play again", home: "Back to main", language: "Language", ready: "Ready when you are.", round: "Round", score: "Score", moves: "Moves", best: "Best", success: "You cleared it!", failure: "Round over", successCopy: "The complete player loop reached a natural Result.", failureCopy: "The challenge ended. Review the hint and try again.", left: "Left", right: "Right", up: "Up", down: "Down", rotate: "Rotate", drop: "Drop", submit: "Submit", serve: "Serve", select: "Select", clearLines: "Place pieces and clear 4 lines.", eatFood: "Guide the snake to 6 pieces of food.", tic: "Place three marks in a row before the rival.", chess: "Complete the three-move checkmate sprint.", checkers: "Make five legal diagonal moves and crown a piece.", mahjong: "Match every open pair of tiles.", wordle: "Find the five-letter word in six tries.", hangman: "Reveal the hidden word before six misses.", breakout: "Clear every brick with controlled shots.", pong: "Win five rallies with the paddle.", correct: "Correct!", matched: "Pair matched.", remaining: "Remaining", next: "Next", choose: "Choose a control", used: "Used", alreadyUsed: "Already used", misses: "Misses" },
    "zh-Hant": { eyebrow: "熱門遊戲合集", tagline: "十款玩法各異的經典遊戲，集中在一個精緻的試玩街機。", objective: "目標", start: "開始遊戲", hint: "提示", restart: "重新開始", retry: "再玩一次", home: "返回主頁", language: "語言", ready: "準備好了就開始。", round: "回合", score: "分數", moves: "步數", best: "最佳", success: "完成挑戰！", failure: "回合結束", successCopy: "完整玩家流程自然抵達結果畫面。", failureCopy: "挑戰結束了，查看提示後再試一次。", left: "左移", right: "右移", up: "上移", down: "下移", rotate: "旋轉", drop: "落下", submit: "提交", serve: "發球", select: "選擇", clearLines: "放置方塊並消除 4 行。", eatFood: "引導蛇吃到 6 個食物。", tic: "在對手前連成三格。", chess: "完成三步將殺挑戰。", checkers: "完成五次合法斜向移動並升變。", mahjong: "配對所有可用的牌。", wordle: "在六次內猜出五字母單字。", hangman: "在六次失誤前猜出隱藏單字。", breakout: "用控制好的發球清除所有磚塊。", pong: "用球拍贏下五個回合。", correct: "正確！", matched: "配對成功。", remaining: "剩餘", next: "下一個", choose: "選擇操作", used: "已用", misses: "失誤" },
    "zh-Hans": { eyebrow: "热门游戏合集", tagline: "十款玩法各异的经典游戏，集中在一个精致的试玩街机。", objective: "目标", start: "开始游戏", hint: "提示", restart: "重新开始", retry: "再玩一次", home: "返回主页", language: "语言", ready: "准备好了就开始。", round: "回合", score: "分数", moves: "步数", best: "最佳", success: "完成挑战！", failure: "回合结束", successCopy: "完整玩家流程自然抵达结果画面。", failureCopy: "挑战结束了，查看提示后再试一次。", left: "左移", right: "右移", up: "上移", down: "下移", rotate: "旋转", drop: "落下", submit: "提交", serve: "发球", select: "选择", clearLines: "放置方块并消除 4 行。", eatFood: "引导蛇吃到 6 个食物。", tic: "在对手前连成三格。", chess: "完成三步将杀挑战。", checkers: "完成五次合法斜向移动并升变。", mahjong: "配对所有可用的牌。", wordle: "在六次内猜出五字母单词。", hangman: "在六次失误前猜出隐藏单词。", breakout: "用控制好的发球清除所有砖块。", pong: "用球拍赢下五个回合。", correct: "正确！", matched: "配对成功。", remaining: "剩余", next: "下一个", choose: "选择操作", used: "已用", misses: "失误" },
    ja: { eyebrow: "人気ゲームコレクション", tagline: "異なる遊び方を持つ10本の名作を楽しめる試遊アーケードです。", objective: "目標", start: "ゲーム開始", hint: "ヒント", restart: "リスタート", retry: "もう一度", home: "メインへ", language: "言語", ready: "準備ができたら始めましょう。", round: "ラウンド", score: "スコア", moves: "手数", best: "ベスト", success: "クリア！", failure: "ラウンド終了", successCopy: "プレイヤーの一連の流れが結果画面まで到達しました。", failureCopy: "挑戦終了。ヒントを確認して再挑戦しましょう。", left: "左", right: "右", up: "上", down: "下", rotate: "回転", drop: "落とす", submit: "決定", serve: "サーブ", select: "選択", clearLines: "ブロックを置いて4行消します。", eatFood: "ヘビで食べ物を6個食べます。", tic: "相手より先に3つ並べます。", chess: "3手のメイトスプリントを完成させます。", checkers: "合法手を5回行い、駒を昇格させます。", mahjong: "すべての開いた牌をペアにします。", wordle: "6回以内に5文字の単語を当てます。", hangman: "6回間違える前に隠れた単語を当てます。", breakout: "ショットで全てのブロックを消します。", pong: "ラケットで5ラリー勝ちます。", correct: "正解！", matched: "ペア成立。", remaining: "残り", next: "次", choose: "操作を選択", used: "使用済み", misses: "ミス" },
    ko: { eyebrow: "인기 게임 컬렉션", tagline: "서로 다른 재미를 가진 클래식 10종을 즐기는 프리뷰 아케이드입니다.", objective: "목표", start: "게임 시작", hint: "힌트", restart: "다시 시작", retry: "다시 플레이", home: "메인으로", language: "언어", ready: "준비되면 시작하세요.", round: "라운드", score: "점수", moves: "이동", best: "최고", success: "클리어했습니다!", failure: "라운드 종료", successCopy: "전체 플레이 흐름이 자연스럽게 결과에 도달했습니다.", failureCopy: "도전이 끝났습니다. 힌트를 보고 다시 시도하세요.", left: "왼쪽", right: "오른쪽", up: "위", down: "아래", rotate: "회전", drop: "내리기", submit: "제출", serve: "서브", select: "선택", clearLines: "블록을 놓고 4줄을 지우세요.", eatFood: "뱀으로 먹이 6개를 먹으세요.", tic: "상대보다 먼저 세 칸을 잇습니다.", chess: "세 수 체크메이트 스프린트를 완료하세요.", checkers: "합법 대각선 이동 5회 후 승급하세요.", mahjong: "열린 타일의 모든 쌍을 맞추세요.", wordle: "6번 안에 다섯 글자 단어를 맞추세요.", hangman: "6번 틀리기 전에 단어를 맞추세요.", breakout: "조준한 샷으로 모든 벽돌을 깨세요.", pong: "패들로 5번의 랠리를 이기세요.", correct: "정답!", matched: "짝이 맞았습니다.", remaining: "남음", next: "다음", choose: "조작 선택", used: "사용됨", misses: "실수" },
    es: { eyebrow: "Colección de juegos populares", tagline: "Un arcade de prueba con diez clásicos y diez formas distintas de jugar.", objective: "Objetivo", start: "Empezar", hint: "Pista", restart: "Reiniciar", retry: "Jugar otra vez", home: "Volver al inicio", language: "Idioma", ready: "Cuando estés listo, empieza.", round: "Ronda", score: "Puntuación", moves: "Movimientos", best: "Mejor", success: "¡Desafío superado!", failure: "Ronda terminada", successCopy: "El recorrido completo llegó a un Resultado natural.", failureCopy: "El reto terminó. Mira la pista y vuelve a intentarlo.", left: "Izquierda", right: "Derecha", up: "Arriba", down: "Abajo", rotate: "Girar", drop: "Soltar", submit: "Enviar", serve: "Saque", select: "Elegir", clearLines: "Coloca piezas y elimina 4 líneas.", eatFood: "Guía la serpiente para comer 6 piezas.", tic: "Alinea tres marcas antes que el rival.", chess: "Completa el sprint de mate en tres jugadas.", checkers: "Haz cinco movimientos diagonales legales y corona.", mahjong: "Empareja todas las fichas abiertas.", wordle: "Encuentra la palabra de cinco letras en seis intentos.", hangman: "Revela la palabra antes de seis fallos.", breakout: "Rompe todos los ladrillos con tiros controlados.", pong: "Gana cinco rallies con la pala.", correct: "¡Correcto!", matched: "Pareja encontrada.", remaining: "Restantes", next: "Siguiente", choose: "Elige un control", used: "Usada", misses: "Fallos" },
    "pt-BR": { eyebrow: "Coleção de jogos populares", tagline: "Um arcade de teste com dez clássicos e dez formas diferentes de jogar.", objective: "Objetivo", start: "Começar", hint: "Dica", restart: "Reiniciar", retry: "Jogar novamente", home: "Voltar ao início", language: "Idioma", ready: "Quando estiver pronto, comece.", round: "Rodada", score: "Pontuação", moves: "Movimentos", best: "Melhor", success: "Desafio concluído!", failure: "Rodada encerrada", successCopy: "O fluxo completo chegou naturalmente ao Resultado.", failureCopy: "O desafio terminou. Veja a dica e tente de novo.", left: "Esquerda", right: "Direita", up: "Cima", down: "Baixo", rotate: "Girar", drop: "Soltar", submit: "Enviar", serve: "Saque", select: "Escolher", clearLines: "Coloque peças e limpe 4 linhas.", eatFood: "Guie a cobra para comer 6 alimentos.", tic: "Faça três marcas em linha antes do rival.", chess: "Complete o sprint de xeque-mate em três lances.", checkers: "Faça cinco movimentos diagonais legais e coroe uma peça.", mahjong: "Combine todos os pares de peças abertas.", wordle: "Descubra a palavra de cinco letras em seis tentativas.", hangman: "Revele a palavra antes de seis erros.", breakout: "Quebre todos os blocos com tiros controlados.", pong: "Vença cinco ralis com a raquete.", correct: "Correto!", matched: "Par encontrado.", remaining: "Restantes", next: "Próximo", choose: "Escolha um controle", used: "Usada", misses: "Erros" },
    fr: { eyebrow: "Collection de jeux populaires", tagline: "Un arcade de prévisualisation avec dix classiques aux règles différentes.", objective: "Objectif", start: "Commencer", hint: "Indice", restart: "Recommencer", retry: "Rejouer", home: "Retour à l'accueil", language: "Langue", ready: "Commencez quand vous êtes prêt.", round: "Manche", score: "Score", moves: "Coups", best: "Meilleur", success: "Défi réussi !", failure: "Manche terminée", successCopy: "Le parcours complet atteint naturellement le résultat.", failureCopy: "Le défi est terminé. Consultez l'indice et réessayez.", left: "Gauche", right: "Droite", up: "Haut", down: "Bas", rotate: "Tourner", drop: "Lâcher", submit: "Valider", serve: "Service", select: "Choisir", clearLines: "Placez les pièces et effacez 4 lignes.", eatFood: "Guidez le serpent vers 6 aliments.", tic: "Alignez trois marques avant l'adversaire.", chess: "Terminez le sprint de mat en trois coups.", checkers: "Faites cinq coups diagonaux légaux et promouvez un pion.", mahjong: "Associez toutes les tuiles ouvertes.", wordle: "Trouvez le mot de cinq lettres en six essais.", hangman: "Trouvez le mot avant six erreurs.", breakout: "Cassez toutes les briques avec des tirs précis.", pong: "Gagnez cinq échanges avec la raquette.", correct: "Correct !", matched: "Paire trouvée.", remaining: "Restant", next: "Suivant", choose: "Choisir une commande", used: "Utilisée", misses: "Erreurs" },
    de: { eyebrow: "Beliebte Spielesammlung", tagline: "Eine Vorschau-Spielhalle mit zehn Klassikern und unterschiedlichen Regeln.", objective: "Ziel", start: "Spiel starten", hint: "Tipp", restart: "Neustart", retry: "Nochmal spielen", home: "Zur Startseite", language: "Sprache", ready: "Wenn du bereit bist, geht es los.", round: "Runde", score: "Punkte", moves: "Züge", best: "Bestwert", success: "Geschafft!", failure: "Runde beendet", successCopy: "Der vollständige Spielablauf erreichte ein natürliches Ergebnis.", failureCopy: "Die Herausforderung ist vorbei. Nutze den Tipp und versuche es erneut.", left: "Links", right: "Rechts", up: "Oben", down: "Unten", rotate: "Drehen", drop: "Fallen lassen", submit: "Absenden", serve: "Aufschlag", select: "Auswählen", clearLines: "Lege Steine und lösche 4 Reihen.", eatFood: "Führe die Schlange zu 6 Futterstücken.", tic: "Lege drei Zeichen vor dem Gegner in eine Reihe.", chess: "Schließe den Drei-Züge-Matt-Sprint ab.", checkers: "Mache fünf legale Diagonalzüge und kröne einen Stein.", mahjong: "Finde Paare für alle offenen Steine.", wordle: "Finde das Wort aus fünf Buchstaben in sechs Versuchen.", hangman: "Löse das Wort vor sechs Fehlern.", breakout: "Zerstöre alle Steine mit kontrollierten Schüssen.", pong: "Gewinne fünf Ballwechsel mit dem Schläger.", correct: "Richtig!", matched: "Paar gefunden.", remaining: "Übrig", next: "Nächster", choose: "Steuerung wählen", used: "Benutzt", misses: "Fehler" },
    it: { eyebrow: "Raccolta di giochi popolari", tagline: "Un arcade in anteprima con dieci classici e regole diverse.", objective: "Obiettivo", start: "Inizia", hint: "Suggerimento", restart: "Ricomincia", retry: "Gioca ancora", home: "Torna alla home", language: "Lingua", ready: "Inizia quando sei pronto.", round: "Round", score: "Punteggio", moves: "Mosse", best: "Migliore", success: "Sfida completata!", failure: "Round terminato", successCopy: "Il percorso completo è arrivato naturalmente al risultato.", failureCopy: "La sfida è terminata. Guarda il suggerimento e riprova.", left: "Sinistra", right: "Destra", up: "Su", down: "Giù", rotate: "Ruota", drop: "Lascia", submit: "Invia", serve: "Servizio", select: "Scegli", clearLines: "Posiziona i pezzi e cancella 4 righe.", eatFood: "Guida il serpente a 6 cibi.", tic: "Allinea tre simboli prima dell'avversario.", chess: "Completa lo sprint di matto in tre mosse.", checkers: "Fai cinque mosse diagonali legali e promuovi una pedina.", mahjong: "Abbina tutte le tessere libere.", wordle: "Trova la parola di cinque lettere in sei tentativi.", hangman: "Scopri la parola prima di sei errori.", breakout: "Rompi tutti i mattoni con tiri controllati.", pong: "Vinci cinque scambi con la racchetta.", correct: "Corretto!", matched: "Coppia trovata.", remaining: "Rimanenti", next: "Successivo", choose: "Scegli un comando", used: "Usata", misses: "Errori" },
    ru: { eyebrow: "Коллекция популярных игр", tagline: "Аркада-предпросмотр с десятью классиками и разными правилами.", objective: "Цель", start: "Начать игру", hint: "Подсказка", restart: "Начать заново", retry: "Играть снова", home: "На главную", language: "Язык", ready: "Начинайте, когда готовы.", round: "Раунд", score: "Счёт", moves: "Ходы", best: "Рекорд", success: "Готово!", failure: "Раунд завершён", successCopy: "Полный игровой цикл естественно дошёл до результата.", failureCopy: "Испытание завершено. Посмотрите подсказку и попробуйте снова.", left: "Влево", right: "Вправо", up: "Вверх", down: "Вниз", rotate: "Повернуть", drop: "Уронить", submit: "Отправить", serve: "Подача", select: "Выбрать", clearLines: "Размещайте фигуры и очистите 4 линии.", eatFood: "Проведите змейку к 6 яблокам.", tic: "Соберите три знака в ряд раньше соперника.", chess: "Выполните матовый спринт за три хода.", checkers: "Сделайте пять легальных диагональных ходов и проведите шашку в дамки.", mahjong: "Сопоставьте все открытые пары плиток.", wordle: "Угадайте слово из пяти букв за шесть попыток.", hangman: "Откройте слово до шести ошибок.", breakout: "Разбейте все блоки точными ударами.", pong: "Выиграйте пять розыгрышей ракеткой.", correct: "Верно!", matched: "Пара найдена.", remaining: "Осталось", next: "Следующий", choose: "Выберите действие", used: "Использована", misses: "Ошибки" },
    hi: { eyebrow: "लोकप्रिय खेल संग्रह", tagline: "दस अलग नियमों वाले क्लासिक खेलों का प्रीव्यू आर्केड।", objective: "लक्ष्य", start: "खेल शुरू करें", hint: "संकेत", restart: "फिर शुरू करें", retry: "फिर खेलें", home: "मुख्य पृष्ठ", language: "भाषा", ready: "तैयार हों तो शुरू करें।", round: "राउंड", score: "स्कोर", moves: "चालें", best: "सर्वश्रेष्ठ", success: "चुनौती पूरी!", failure: "राउंड समाप्त", successCopy: "पूरा खेल स्वाभाविक रूप से परिणाम तक पहुँचा।", failureCopy: "चुनौती खत्म हुई। संकेत देखें और फिर कोशिश करें।", left: "बायाँ", right: "दायाँ", up: "ऊपर", down: "नीचे", rotate: "घुमाएँ", drop: "गिराएँ", submit: "जमा करें", serve: "सर्व", select: "चुनें", clearLines: "ब्लॉक रखकर 4 पंक्तियाँ साफ करें।", eatFood: "साँप को 6 भोजन तक पहुँचाएँ।", tic: "प्रतिद्वंद्वी से पहले तीन निशान मिलाएँ।", chess: "तीन चालों की मात चुनौती पूरी करें।", checkers: "पाँच वैध तिरछी चालें चलकर मोहरा बढ़ाएँ।", mahjong: "सभी खुले टाइल जोड़े मिलाएँ।", wordle: "छह प्रयासों में पाँच अक्षरों का शब्द खोजें।", hangman: "छह गलतियों से पहले छिपा शब्द खोलें।", breakout: "नियंत्रित शॉट से सभी ईंटें तोड़ें।", pong: "पैडल से पाँच रैलियाँ जीतें।", correct: "सही!", matched: "जोड़ी मिल गई।", remaining: "बाकी", next: "अगला", choose: "नियंत्रण चुनें", used: "उपयोग हुआ", misses: "गलतियाँ" },
    ar: { eyebrow: "مجموعة الألعاب الشائعة", tagline: "أركيد تجريبي يضم عشر ألعاب كلاسيكية بقواعد مختلفة.", objective: "الهدف", start: "ابدأ اللعبة", hint: "تلميح", restart: "إعادة البدء", retry: "العب مجدداً", home: "العودة للرئيسية", language: "اللغة", ready: "ابدأ عندما تكون مستعداً.", round: "الجولة", score: "النقاط", moves: "الحركات", best: "الأفضل", success: "اكتمل التحدي!", failure: "انتهت الجولة", successCopy: "وصلت دورة اللعب الكاملة إلى النتيجة بشكل طبيعي.", failureCopy: "انتهى التحدي. راجع التلميح وحاول مجدداً.", left: "يسار", right: "يمين", up: "أعلى", down: "أسفل", rotate: "تدوير", drop: "إسقاط", submit: "إرسال", serve: "إرسال الكرة", select: "اختيار", clearLines: "ضع القطع وامسح 4 صفوف.", eatFood: "وجّه الثعبان إلى 6 أطعمة.", tic: "كوّن ثلاثة رموز متتالية قبل الخصم.", chess: "أكمل تحدي كش مات في ثلاث نقلات.", checkers: "نفّذ خمس نقلات قطرية قانونية ورقِّ قطعة.", mahjong: "طابق كل أزواج البلاطات المفتوحة.", wordle: "اعثر على الكلمة ذات الخمسة أحرف خلال ست محاولات.", hangman: "اكشف الكلمة قبل ستة أخطاء.", breakout: "حطّم كل الطوب بتسديدات متحكم بها.", pong: "اربح خمس تبادلات بالمضرب.", correct: "صحيح!", matched: "تم العثور على زوج.", remaining: "المتبقي", next: "التالي", choose: "اختر تحكماً", used: "مستخدم", misses: "الأخطاء" },
  };
  const CHECKERS_META_DESCRIPTION = {
    en: "Play a five-move Checkers preview with clear diagonal choices and a promotion payoff.",
    "zh-Hant": "在五步西洋跳棋試玩中看清斜向選擇，將棋子升變為王。",
    "zh-Hans": "在五步西洋跳棋试玩中看清斜向选择，将棋子升变为王。",
    ja: "5手のチェッカー試遊で斜めの選択を見極め、駒をキングに昇格させます。",
    ko: "다섯 수 체커 프리뷰에서 대각선 선택을 확인하고 말을 킹으로 승격하세요.",
    es: "Juega cinco movimientos de damas, elige diagonales claras y corona tu ficha.",
    "pt-BR": "Jogue cinco movimentos de damas, escolha diagonais claras e promova sua peça.",
    fr: "Jouez cinq coups de dames, choisissez des diagonales claires et promouvez votre pion.",
    de: "Spiele fünf Damezüge, erkenne klare Diagonalziele und kröne deinen Stein.",
    it: "Gioca cinque mosse a dama, scegli diagonali chiare e promuovi la pedina.",
    ru: "Сделайте пять ходов в шашках, выберите понятные диагонали и превратите шашку в дамку.",
    hi: "चेकर्स के पाँच चालों में साफ़ तिरछे विकल्प चुनें और मोहरे को बादशाह बनाएँ।",
    ar: "العب خمس نقلات في الداما، واختر مسارات قطرية واضحة ورقِّ قطعتك إلى ملك.",
  };
  const checkersMetaDescription = (locale) => CHECKERS_META_DESCRIPTION[locale] || "";
  const BREAKOUT_META_DESCRIPTION = {
    en: "Owner preview: clear 12 Breakout bricks with controlled shots. Not released publicly.",
    "zh-Hant": "擁有者試玩：以受控發球清除 12 塊磚塊；目前尚未公開發行。",
    "zh-Hans": "所有者试玩：用受控发球清除 12 块砖块；目前尚未公开发布。",
    ja: "オーナープレビュー：操作したショットで12個のブロックを消します。一般公開はしていません。",
    ko: "소유자 프리뷰: 조준한 서브로 벽돌 12개를 깨세요. 아직 공개 출시되지 않았습니다.",
    es: "Vista previa para el propietario: rompe 12 ladrillos con tiros controlados. Aún no está publicado.",
    "pt-BR": "Prévia para o proprietário: quebre 12 blocos com tiros controlados. Ainda não foi publicado.",
    fr: "Aperçu propriétaire : cassez 12 briques avec des tirs maîtrisés. Le jeu n’est pas publié.",
    de: "Besitzer-Vorschau: Zerstöre 12 Steine mit kontrollierten Schüssen. Noch nicht öffentlich veröffentlicht.",
    it: "Anteprima per il proprietario: rompi 12 mattoni con tiri controllati. Non è ancora pubblicato.",
    ru: "Превью для владельца: разбейте 12 блоков управляемыми ударами. Игра ещё не опубликована.",
    hi: "मालिक का प्रीव्यू: नियंत्रित शॉट से 12 ईंटें तोड़ें। गेम अभी सार्वजनिक रूप से जारी नहीं हुआ है।",
    ar: "معاينة للمالك: حطّم 12 لبنة بتسديدات متحكم بها. لم تُنشر اللعبة للعامة بعد.",
  };
  const BREAKOUT_GAME_VERSION = "v6";
  const PONG_TARGET_LANES = [2, 4, 1, 5, 0];
  const pongTargetForRally = (rally) => PONG_TARGET_LANES[Math.max(0, Math.min(PONG_TARGET_LANES.length - 1, rally))];
  const pongLanePosition = (lane) => Math.max(17, Math.min(82, Number(lane) * 13 + 17));
  const breakoutMetaDescription = (locale) => BREAKOUT_META_DESCRIPTION[locale] || "";
  const CHECKERS_PROMOTION_COPY = {
    en: { next: "One more move reaches the far row and promotes your piece to a king.", result: "Your final move reached the far row and crowned your piece as a king." },
    "zh-Hant": { next: "再走一步就會抵達底線，讓棋子升變為王。", result: "最後一步抵達底線，你的棋子已升變為王。" },
    "zh-Hans": { next: "再走一步就会到达底线，让棋子升变为王。", result: "最后一步到达底线，你的棋子已升变为王。" },
    ja: { next: "あと1手で最奥の列に届き、駒がキングになります。", result: "最後の一手で最奥の列に到達し、駒がキングになりました。" },
    ko: { next: "한 수만 더 두면 끝줄에 도착해 말이 킹으로 승격됩니다.", result: "마지막 수로 끝줄에 도착해 말이 킹으로 승격되었습니다." },
    es: { next: "Un movimiento más llegará a la fila final y coronará tu ficha.", result: "Tu último movimiento llegó a la fila final y coronó tu ficha como dama." },
    "pt-BR": { next: "Mais uma jogada chega à última fila e promove sua peça.", result: "Sua jogada final chegou à última fila e promoveu sua peça a uma dama." },
    fr: { next: "Encore un coup et votre pion atteindra la dernière rangée pour devenir une dame.", result: "Votre dernier coup a atteint la dernière rangée et a promu votre pion en dame." },
    de: { next: "Noch ein Zug erreicht die letzte Reihe und krönt deinen Stein zur Dame.", result: "Dein letzter Zug erreichte die letzte Reihe und krönte deinen Stein zur Dame." },
    it: { next: "Un'altra mossa raggiunge l'ultima fila e promuove la pedina a dama.", result: "La tua ultima mossa ha raggiunto l'ultima fila e ha promosso la pedina a dama." },
    ru: { next: "Ещё один ход приведёт шашку в последний ряд и превратит её в дамку.", result: "Последний ход достиг последнего ряда и превратил шашку в дамку." },
    hi: { next: "एक और चाल आखिरी पंक्ति तक पहुँचेगी और मोहरे को बादशाह बनाएगी।", result: "आपकी आखिरी चाल आखिरी पंक्ति तक पहुँची और मोहरा बादशाह बन गया।" },
    ar: { next: "تبقى نقلة واحدة للوصول إلى الصف الأخير وترقية القطعة إلى ملك.", result: "وصلت نقلتك الأخيرة إلى الصف الأخير ورقّت قطعتك إلى ملك." },
  };
  const CHECKERS_MOVE_COACH_COPY = {
    en: "The highlighted square marks your next diagonal destination.",
    "zh-Hant": "高亮方格標示下一個斜向目的地。",
    "zh-Hans": "高亮方格标示下一个斜向目的地。",
    ja: "ハイライトされたマスが次の斜めの目的地です。",
    ko: "강조된 칸이 다음 대각선 목적지입니다.",
    es: "La casilla resaltada marca tu próximo destino diagonal.",
    "pt-BR": "A casa destacada marca seu próximo destino diagonal.",
    fr: "La case en surbrillance indique votre prochaine destination diagonale.",
    de: "Das hervorgehobene Feld zeigt dein nächstes diagonales Ziel.",
    it: "La casella evidenziata indica la tua prossima destinazione diagonale.",
    ru: "Подсвеченная клетка отмечает следующую диагональную цель.",
    hi: "हाइलाइट किया गया खाना आपका अगला तिरछा लक्ष्य दिखाता है।",
    ar: "المربع المميز يحدد وجهتك القطرية التالية.",
  };
  const WORDLE_LENGTH_ERROR = { en: "Enter 5 letters.", "zh-Hant": "請輸入 5 個字母。", "zh-Hans": "请输入 5 个字母。", ja: "5文字入力してください。", ko: "글자 5개를 입력하세요.", es: "Introduce 5 letras.", "pt-BR": "Digite 5 letras.", fr: "Saisissez 5 lettres.", de: "Gib 5 Buchstaben ein.", it: "Inserisci 5 lettere.", ru: "Введите 5 букв.", hi: "5 अक्षर दर्ज करें।", ar: "أدخل 5 أحرف." };
  const WORDLE_CELL_COPY = {
    en: { board: "Guess board", hit: "Correct position", near: "Present elsewhere", miss: "Not in word", format: (row, column, letter, state) => `Row ${row}, position ${column}: ${letter ? `letter ${letter}, ${state}` : "empty"}` },
    "zh-Hant": { board: "猜字盤", hit: "位置正確", near: "字母在其他位置", miss: "不在單字中", format: (row, column, letter, state) => `第${row}行第${column}格：${letter ? `字母${letter}，${state}` : "空白"}` },
    "zh-Hans": { board: "猜字盘", hit: "位置正确", near: "字母在其他位置", miss: "不在单词中", format: (row, column, letter, state) => `第${row}行第${column}格：${letter ? `字母${letter}，${state}` : "空白"}` },
    ja: { board: "推測ボード", hit: "位置が正しい", near: "別の位置にあります", miss: "単語にありません", format: (row, column, letter, state) => `${row}行${column}列：${letter ? `文字${letter}、${state}` : "空白"}` },
    ko: { board: "추측 보드", hit: "위치가 맞습니다", near: "다른 위치에 있습니다", miss: "단어에 없습니다", format: (row, column, letter, state) => `${row}행 ${column}번째 칸: ${letter ? `문자 ${letter}, ${state}` : "빈칸"}` },
    es: { board: "Tablero de intentos", hit: "Posición correcta", near: "Está en otra posición", miss: "No está en la palabra", format: (row, column, letter, state) => `Fila ${row}, posición ${column}: ${letter ? `letra ${letter}, ${state}` : "vacía"}` },
    "pt-BR": { board: "Tabuleiro de tentativas", hit: "Posição correta", near: "Está em outra posição", miss: "Não está na palavra", format: (row, column, letter, state) => `Linha ${row}, posição ${column}: ${letter ? `letra ${letter}, ${state}` : "vazia"}` },
    fr: { board: "Grille des essais", hit: "Bonne position", near: "Présente ailleurs", miss: "Absente du mot", format: (row, column, letter, state) => `Ligne ${row}, position ${column} : ${letter ? `lettre ${letter}, ${state}` : "vide"}` },
    de: { board: "Tippbrett", hit: "Richtige Position", near: "An anderer Stelle vorhanden", miss: "Nicht im Wort", format: (row, column, letter, state) => `Zeile ${row}, Position ${column}: ${letter ? `Buchstabe ${letter}, ${state}` : "leer"}` },
    it: { board: "Tabellone dei tentativi", hit: "Posizione corretta", near: "Presente in un'altra posizione", miss: "Non è nella parola", format: (row, column, letter, state) => `Riga ${row}, posizione ${column}: ${letter ? `lettera ${letter}, ${state}` : "vuota"}` },
    ru: { board: "Поле попыток", hit: "Буква на своём месте", near: "Буква есть в другом месте", miss: "Буквы нет в слове", format: (row, column, letter, state) => `Строка ${row}, позиция ${column}: ${letter ? `буква ${letter}, ${state}` : "пусто"}` },
    hi: { board: "अनुमान बोर्ड", hit: "सही स्थान", near: "दूसरे स्थान पर मौजूद", miss: "शब्द में नहीं", format: (row, column, letter, state) => `पंक्ति ${row}, स्थान ${column}: ${letter ? `अक्षर ${letter}, ${state}` : "खाली"}` },
    ar: { board: "لوحة التخمينات", hit: "الموضع صحيح", near: "موجود في موضع آخر", miss: "ليس في الكلمة", format: (row, column, letter, state) => `الصف ${row}، الموضع ${column}: ${letter ? `الحرف ${letter}، ${state}` : "فارغ"}` },
  };
  const wordleCellLabel = (locale, row, column, letter, tone) => {
    const labels = WORDLE_CELL_COPY[locale] || WORDLE_CELL_COPY.en;
    return labels.format(row, column, letter, tone ? labels[tone] : "");
  };
  const wordleEscape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const WORDLE_WORDS = [
    { target: "BRAVE", wordKey: "brave" }, { target: "OCEAN", wordKey: "ocean" },
    { target: "PLANT", wordKey: "plant" }, { target: "MUSIC", wordKey: "music" },
    { target: "TIGER", wordKey: "tiger" }, { target: "CLOUD", wordKey: "cloud" },
  ];
  const WORDLE_HINT_COPY = {
    en: (letter) => `Hint: The word starts with ${letter}.`, "zh-Hant": (letter) => `提示：這個單字以 ${letter} 開頭。`, "zh-Hans": (letter) => `提示：这个单词以 ${letter} 开头。`,
    ja: (letter) => `ヒント：単語は ${letter} で始まります。`, ko: (letter) => `힌트: 단어는 ${letter}(으)로 시작합니다.`, es: (letter) => `Pista: la palabra empieza por ${letter}.`,
    "pt-BR": (letter) => `Dica: a palavra começa com ${letter}.`, fr: (letter) => `Indice : le mot commence par ${letter}.`, de: (letter) => `Tipp: Das Wort beginnt mit ${letter}.`,
    it: (letter) => `Suggerimento: la parola inizia con ${letter}.`, ru: (letter) => `Подсказка: слово начинается с ${letter}.`, hi: (letter) => `संकेत: शब्द ${letter} से शुरू होता है।`, ar: (letter) => `تلميح: تبدأ الكلمة بالحرف ${letter}.`,
  };
  const WORDLE_RESULT_COPY = {
    en: (word) => `Word: ${word}. Play again gives you a new puzzle.`, "zh-Hant": (word) => `答案：${word}。再玩一次會換一個新謎題。`, "zh-Hans": (word) => `答案：${word}。再玩一次会换一个新谜题。`,
    ja: (word) => `答え：${word}。もう一度遊ぶと新しい問題になります。`, ko: (word) => `정답: ${word}. 다시 플레이하면 새 문제가 나옵니다.`, es: (word) => `Palabra: ${word}. Juega otra vez para recibir un nuevo acertijo.`,
    "pt-BR": (word) => `Palavra: ${word}. Jogue novamente para receber um novo desafio.`, fr: (word) => `Mot : ${word}. Rejouez pour obtenir une nouvelle énigme.`, de: (word) => `Wort: ${word}. Spiele erneut für ein neues Rätsel.`,
    it: (word) => `Parola: ${word}. Rigioca per ricevere un nuovo enigma.`, ru: (word) => `Слово: ${word}. Сыграйте снова, чтобы получить новую загадку.`, hi: (word) => `शब्द: ${word}। नई पहेली पाने के लिए फिर खेलें।`, ar: (word) => `الكلمة: ${word}. العب مجدداً لتحصل على لغز جديد.`,
  };
  const HANGMAN_ALREADY_USED = { en: "Already used", "zh-Hant": "已經使用", "zh-Hans": "已经使用", ja: "使用済み", ko: "이미 사용함", es: "Ya usada", "pt-BR": "Já usada", fr: "Déjà utilisée", de: "Bereits verwendet", it: "Già usata", ru: "Уже использована", hi: "पहले ही उपयोग किया गया", ar: "مستخدم بالفعل" };
  const TETRIS_LINE_CLEAR_COPY = { en: "Line cleared! Keep going.", "zh-Hant": "消除一行！繼續挑戰。", "zh-Hans": "消除一行！继续挑战。", ja: "1行消去！そのまま続けましょう。", ko: "한 줄을 지웠습니다! 계속 도전하세요.", es: "¡Línea despejada! Sigue adelante.", "pt-BR": "Linha limpa! Continue.", fr: "Ligne effacée ! Continuez.", de: "Reihe gelöscht! Weiter geht's.", it: "Riga cancellata! Continua.", ru: "Линия очищена! Продолжайте.", hi: "एक पंक्ति साफ हुई! आगे बढ़ें।", ar: "تم مسح صف! واصل اللعب." };
  const TETRIS_PROGRESS_COPY = {
    en: (lines, remaining) => `Sprint progress: ${lines}/4 lines cleared. ${remaining} to go.`,
    "zh-Hant": (lines, remaining) => `短局進度：已消除 ${lines}/4 行，還差 ${remaining} 行。`,
    "zh-Hans": (lines, remaining) => `短局进度：已消除 ${lines}/4 行，还差 ${remaining} 行。`,
    ja: (lines, remaining) => `スプリント進行：${lines}/4行消去。あと${remaining}行です。`,
    ko: (lines, remaining) => `스프린트 진행: ${lines}/4줄을 지웠습니다. ${remaining}줄 남았습니다.`,
    es: (lines, remaining) => `Progreso del sprint: ${lines}/4 líneas eliminadas. Faltan ${remaining}.`,
    "pt-BR": (lines, remaining) => `Progresso do sprint: ${lines}/4 linhas limpas. Faltam ${remaining}.`,
    fr: (lines, remaining) => `Progression du sprint : ${lines}/4 lignes effacées. Plus que ${remaining}.`,
    de: (lines, remaining) => `Sprintfortschritt: ${lines}/4 Reihen gelöscht. Noch ${remaining}.`,
    it: (lines, remaining) => `Progresso dello sprint: ${lines}/4 righe cancellate. Ne mancano ${remaining}.`,
    ru: (lines, remaining) => `Прогресс спринта: очищено ${lines} из 4 линий. Осталось: ${remaining}.`,
    hi: (lines, remaining) => `स्प्रिंट प्रगति: ${lines}/4 पंक्तियाँ साफ़ हुईं। ${remaining} बाकी।`,
    ar: (lines, remaining) => `تقدم الجولة: تم مسح ${lines} من 4 صفوف. المتبقي: ${remaining}.`,
  };
  const tetrisProgressCopy = (locale, lines = 0) => (TETRIS_PROGRESS_COPY[locale] || TETRIS_PROGRESS_COPY.en)(lines, Math.max(0, 4 - lines));
  const tetrisLineClearCopy = (locale, lines = 0) => `${TETRIS_LINE_CLEAR_COPY[locale] || TETRIS_LINE_CLEAR_COPY.en} ${tetrisProgressCopy(locale, lines)}`;
  const TETRIS_HINT_COPY = {
    en: (current, target, same) => same ? `Hint: Current block is in column ${current}, one of the lowest stacks. Consider dropping here if it keeps the next line open; rotate only when it helps your plan.` : `Hint: Current block is in column ${current}. Consider moving toward column ${target} before dropping; rotate only when it improves your next line plan.`,
    "zh-Hant": (current, target, same) => same ? `提示：目前方塊在第 ${current} 欄，是最低堆疊之一。若能保留下一行空間，可考慮在這裡落下；只有能改善計畫時才旋轉。` : `提示：目前方塊在第 ${current} 欄。可考慮先移向第 ${target} 欄再落下；只有能改善下一行計畫時才旋轉。`,
    "zh-Hans": (current, target, same) => same ? `提示：当前方块在第 ${current} 列，是最低堆叠之一。如果能保留下一行空间，可以考虑在这里落下；只有能改善计划时才旋转。` : `提示：当前方块在第 ${current} 列。可以考虑先移向第 ${target} 列再落下；只有能改善下一行计划时才旋转。`,
    ja: (current, target, same) => same ? `ヒント：現在のブロックは${current}列目にあり、最も低い積み上がりの一つです。次のラインを空けられるならここに落とし、計画に役立つときだけ回転しましょう。` : `ヒント：現在のブロックは${current}列目です。落とす前に${target}列目へ動かすことを考え、次のラインに役立つときだけ回転しましょう。`,
    ko: (current, target, same) => same ? `힌트: 현재 블록은 ${current}열에 있고 가장 낮은 더미 중 하나입니다. 다음 줄을 열어 둘 수 있다면 여기에 놓고, 계획에 도움이 될 때만 회전하세요.` : `힌트: 현재 블록은 ${current}열에 있습니다. 떨어뜨리기 전에 ${target}열 쪽으로 옮겨 보세요. 다음 줄 계획에 도움이 될 때만 회전하세요.`,
    es: (current, target, same) => same ? `Pista: el bloque actual está en la columna ${current}, una de las pilas más bajas. Déjalo aquí si mantiene abierta la próxima línea; gira solo si mejora tu plan.` : `Pista: el bloque actual está en la columna ${current}. Considera moverlo hacia la columna ${target} antes de soltarlo; gira solo si mejora tu próximo plan de línea.`,
    "pt-BR": (current, target, same) => same ? `Dica: o bloco atual está na coluna ${current}, uma das pilhas mais baixas. Considere soltá-lo aqui se mantiver a próxima linha aberta; gire apenas se ajudar seu plano.` : `Dica: o bloco atual está na coluna ${current}. Considere movê-lo para a coluna ${target} antes de soltá-lo; gire apenas se melhorar seu próximo plano de linha.`,
    fr: (current, target, same) => same ? `Indice : le bloc actuel est dans la colonne ${current}, l'une des piles les plus basses. Déposez-le ici si cela garde la prochaine ligne ouverte ; ne tournez que si cela aide votre plan.` : `Indice : le bloc actuel est dans la colonne ${current}. Envisagez de le déplacer vers la colonne ${target} avant de le déposer ; ne tournez que si cela aide votre prochaine ligne.`,
    de: (current, target, same) => same ? `Tipp: Der aktuelle Block liegt in Spalte ${current}, einem der niedrigsten Stapel. Lass ihn hier fallen, wenn die nächste Reihe offen bleibt; drehe nur, wenn es deinem Plan hilft.` : `Tipp: Der aktuelle Block liegt in Spalte ${current}. Bewege ihn vor dem Fallenlassen in Richtung Spalte ${target}; drehe nur, wenn es deinem nächsten Reihenplan hilft.`,
    it: (current, target, same) => same ? `Suggerimento: il blocco attuale è nella colonna ${current}, una delle pile più basse. Valuta di lasciarlo qui se mantiene aperta la prossima riga; ruota solo se aiuta il tuo piano.` : `Suggerimento: il blocco attuale è nella colonna ${current}. Valuta di spostarlo verso la colonna ${target} prima di lasciarlo cadere; ruota solo se aiuta la prossima riga.`,
    ru: (current, target, same) => same ? `Подсказка: текущий блок находится в столбце ${current}, одном из самых низких. Оставьте его здесь, если это сохранит следующую линию открытой; поворачивайте только ради плана.` : `Подсказка: текущий блок находится в столбце ${current}. Перед падением попробуйте переместить его к столбцу ${target}; поворачивайте только ради следующей линии.`,
    hi: (current, target, same) => same ? `संकेत: मौजूदा ब्लॉक कॉलम ${current} में है और सबसे कम ऊँचे ढेरों में से एक है। अगली पंक्ति खुली रहे तो इसे यहीं गिराने पर विचार करें; योजना में मदद हो तभी घुमाएँ।` : `संकेत: मौजूदा ब्लॉक कॉलम ${current} में है। गिराने से पहले इसे कॉलम ${target} की ओर ले जाने पर विचार करें; अगली पंक्ति की योजना सुधरे तभी घुमाएँ।`,
    ar: (current, target, same) => same ? `تلميح: الكتلة الحالية في العمود ${current}، وهو من أقل الأعمدة ارتفاعاً. فكّر في إسقاطها هنا إذا أبقيت الصف التالي مفتوحاً؛ دوّرها فقط عندما يفيد ذلك خطتك.` : `تلميح: الكتلة الحالية في العمود ${current}. فكّر في تحريكها نحو العمود ${target} قبل إسقاطها؛ دوّرها فقط عندما يحسّن ذلك خطتك للصف التالي.`,
  };
  const tetrisHintTargetColumn = (state) => {
    const heights = Array.from({ length: 8 }, (_, column) => (state.blocks || []).filter((block) => block.x === column).length);
    const minHeight = Math.min(...heights);
    return heights.map((height, column) => ({ column, height, distance: Math.abs(column - state.active) })).filter((entry) => entry.height === minHeight).sort((a, b) => a.distance - b.distance || a.column - b.column)[0]?.column ?? state.active;
  };
  const tetrisHintCopy = (locale, state) => {
    const current = Math.max(0, Math.min(7, Number(state.active) || 0));
    const target = tetrisHintTargetColumn({ ...state, active: current });
    return (TETRIS_HINT_COPY[locale] || TETRIS_HINT_COPY.en)(current + 1, target + 1, current === target);
  };

  const HANGMAN_HINT_COPY = {
    en: (length) => `Hint: The word has ${length} letters.`,
    "zh-Hant": (length) => `提示：這個單字有 ${length} 個字母。`,
    "zh-Hans": (length) => `提示：这个单词有 ${length} 个字母。`,
    ja: (length) => `ヒント：単語は${length}文字です。`,
    ko: (length) => `힌트: 단어는 ${length}글자입니다.`,
    es: (length) => `Pista: la palabra tiene ${length} letras.`,
    "pt-BR": (length) => `Dica: a palavra tem ${length} letras.`,
    fr: (length) => `Indice : le mot compte ${length} lettres.`,
    de: (length) => `Tipp: Das Wort hat ${length} Buchstaben.`,
    it: (length) => `Suggerimento: la parola ha ${length} lettere.`,
    ru: (length) => `Подсказка: в слове ${length} букв.`,
    hi: (length) => `संकेत: शब्द में ${length} अक्षर हैं।`,
    ar: (length) => `تلميح: الكلمة تتكون من ${length} أحرف.`,
  };
  const HANGMAN_WORDS = [
    { target: "PUZZLE", theme: "puzzle" },
    { target: "JUNGLE", theme: "habitat" },
    { target: "PLANET", theme: "space" },
    { target: "CASTLE", theme: "place" },
    { target: "ORANGE", theme: "food" },
    { target: "ROCKET", theme: "vehicle" },
  ];
  const HANGMAN_THEME_COPY = {
    en: { puzzle: "Theme: games and riddles.", habitat: "Theme: a wild habitat.", space: "Theme: outer space.", place: "Theme: a historic place.", food: "Theme: food.", vehicle: "Theme: a vehicle." },
    "zh-Hant": { puzzle: "主題：遊戲與謎題。", habitat: "主題：野生棲地。", space: "主題：外太空。", place: "主題：歷史場所。", food: "主題：食物。", vehicle: "主題：交通工具。" },
    "zh-Hans": { puzzle: "主题：游戏与谜题。", habitat: "主题：野生栖息地。", space: "主题：外太空。", place: "主题：历史场所。", food: "主题：食物。", vehicle: "主题：交通工具。" },
    ja: { puzzle: "テーマ：ゲームと謎。", habitat: "テーマ：野生の生息地。", space: "テーマ：宇宙。", place: "テーマ：歴史的な場所。", food: "テーマ：食べ物。", vehicle: "テーマ：乗り物。" },
    ko: { puzzle: "주제: 게임과 수수께끼.", habitat: "주제: 야생 서식지.", space: "주제: 우주.", place: "주제: 역사적인 장소.", food: "주제: 음식.", vehicle: "주제: 탈것." },
    es: { puzzle: "Tema: juegos y acertijos.", habitat: "Tema: un hábitat salvaje.", space: "Tema: el espacio exterior.", place: "Tema: un lugar histórico.", food: "Tema: comida.", vehicle: "Tema: un vehículo." },
    "pt-BR": { puzzle: "Tema: jogos e enigmas.", habitat: "Tema: um habitat selvagem.", space: "Tema: o espaço sideral.", place: "Tema: um lugar histórico.", food: "Tema: comida.", vehicle: "Tema: um veículo." },
    fr: { puzzle: "Thème : jeux et énigmes.", habitat: "Thème : un habitat sauvage.", space: "Thème : l’espace.", place: "Thème : un lieu historique.", food: "Thème : nourriture.", vehicle: "Thème : un véhicule." },
    de: { puzzle: "Thema: Spiele und Rätsel.", habitat: "Thema: ein wilder Lebensraum.", space: "Thema: Weltraum.", place: "Thema: ein historischer Ort.", food: "Thema: Essen.", vehicle: "Thema: ein Fahrzeug." },
    it: { puzzle: "Tema: giochi ed enigmi.", habitat: "Tema: un habitat selvatico.", space: "Tema: lo spazio.", place: "Tema: un luogo storico.", food: "Tema: cibo.", vehicle: "Tema: un veicolo." },
    ru: { puzzle: "Тема: игры и загадки.", habitat: "Тема: дикая среда обитания.", space: "Тема: космос.", place: "Тема: историческое место.", food: "Тема: еда.", vehicle: "Тема: транспорт." },
    hi: { puzzle: "विषय: खेल और पहेलियाँ।", habitat: "विषय: वन्य आवास।", space: "विषय: अंतरिक्ष।", place: "विषय: ऐतिहासिक स्थान।", food: "विषय: भोजन।", vehicle: "विषय: वाहन।" },
    ar: { puzzle: "الموضوع: الألعاب والألغاز.", habitat: "الموضوع: موطن بري.", space: "الموضوع: الفضاء الخارجي.", place: "الموضوع: مكان تاريخي.", food: "الموضوع: الطعام.", vehicle: "الموضوع: مركبة." },
  };
  const HANGMAN_RESULT_COPY = {
    en: (word) => `Word: ${word}. Play again gives you a new word.`,
    "zh-Hant": (word) => `答案：${word}。再玩一次會換一個新單字。`, "zh-Hans": (word) => `答案：${word}。再玩一次会换一个新单词。`,
    ja: (word) => `答え：${word}。もう一度遊ぶと新しい単語になります。`, ko: (word) => `정답: ${word}. 다시 플레이하면 새 단어가 나옵니다.`,
    es: (word) => `Palabra: ${word}. Juega otra vez para recibir una palabra nueva.`, "pt-BR": (word) => `Palavra: ${word}. Jogue novamente para receber uma palavra nova.`,
    fr: (word) => `Mot : ${word}. Rejouez pour obtenir un nouveau mot.`, de: (word) => `Wort: ${word}. Spiele erneut für ein neues Wort.`,
    it: (word) => `Parola: ${word}. Rigioca per ricevere una nuova parola.`, ru: (word) => `Слово: ${word}. Сыграйте снова, чтобы получить новое слово.`,
    hi: (word) => `शब्द: ${word}। नया शब्द पाने के लिए फिर खेलें।`, ar: (word) => `الكلمة: ${word}. العب مجدداً لتحصل على كلمة جديدة.`,
  };
  const MAHJONG_LAYOUTS = [
    { key: "crosswind", tiles: ["A", "D", "B", "E", "C", "F", "D", "A", "F", "C", "E", "B"] },
    { key: "spiral", tiles: ["C", "A", "E", "B", "F", "D", "B", "E", "D", "C", "A", "F"] },
    { key: "bridge", tiles: ["F", "C", "A", "D", "B", "E", "C", "F", "E", "B", "D", "A"] },
    { key: "orbit", tiles: ["B", "E", "D", "A", "F", "C", "A", "D", "C", "F", "E", "B"] },
    { key: "ribbon", tiles: ["E", "B", "F", "C", "A", "D", "C", "E", "D", "A", "B", "F"] },
    { key: "lantern", tiles: ["D", "F", "C", "E", "B", "A", "E", "B", "A", "D", "F", "C"] },
  ];
  const MAHJONG_RESULT_COPY = {
    en: "Board cleared. Play again reshuffles the tile positions.",
    "zh-Hant": "牌面已清空。再玩一次會重新排列牌的位置。", "zh-Hans": "牌面已清空。再玩一次会重新排列牌的位置。",
    ja: "牌面をクリアしました。もう一度遊ぶと牌の配置が変わります。", ko: "보드를 모두 비웠습니다. 다시 플레이하면 타일 위치가 바뀝니다.",
    es: "Tablero despejado. Juega otra vez para cambiar las posiciones de las fichas.", "pt-BR": "Tabuleiro limpo. Jogue novamente para mudar as posições das peças.",
    fr: "Plateau vidé. Rejouez pour changer la position des tuiles.", de: "Brett geräumt. Spiele erneut mit neu angeordneten Steinen.",
    it: "Tavola completata. Rigioca per cambiare la posizione delle tessere.", ru: "Поле очищено. Сыграйте снова с новым расположением плиток.",
    hi: "बोर्ड साफ़ हो गया। टाइलों की नई जगहों के लिए फिर खेलें।", ar: "تم إخلاء اللوحة. العب مجدداً لتغيير مواقع البلاطات.",
  };
  const HANGMAN_MISS_COPY = {
    en: (letter, misses) => `${letter}: Miss ${misses}/6. Try another unused letter.`,
    "zh-Hant": (letter, misses) => `${letter}：答錯 ${misses}/6 次，請換一個未使用的字母。`,
    "zh-Hans": (letter, misses) => `${letter}：答错 ${misses}/6 次，请换一个未使用的字母。`,
    ja: (letter, misses) => `${letter}：不正解 ${misses}/6 回。未使用の文字を選びます。`,
    ko: (letter, misses) => `${letter}: 오답 ${misses}/6회입니다. 사용하지 않은 글자를 선택하세요.`,
    es: (letter, misses) => `${letter}: fallo ${misses}/6. Elige otra letra sin usar.`,
    "pt-BR": (letter, misses) => `${letter}: erro ${misses}/6. Escolha outra letra não usada.`,
    fr: (letter, misses) => `${letter} : erreur ${misses}/6. Choisissez une lettre non utilisée.`,
    de: (letter, misses) => `${letter}: Fehler ${misses}/6. Wähle einen unbenutzten Buchstaben.`,
    it: (letter, misses) => `${letter}: errore ${misses}/6. Scegli un'altra lettera non usata.`,
    ru: (letter, misses) => `${letter}: ошибка ${misses}/6. Выберите другую неиспользованную букву.`,
    hi: (letter, misses) => `${letter}: ${misses}/6 गलतियाँ। कोई नया अक्षर चुनें।`,
    ar: (letter, misses) => `${letter}: الخطأ ${misses}/6. اختر حرفاً آخر غير مستخدم.`,
  };

  const BREAKOUT_PROMISE = {
    en: "Short owner preview: move the paddle, Serve 12 bricks, then chase your Best score and Play again.",
    "zh-Hant": "短篇擁有者試玩預覽：移動球拍，發球清除 12 塊磚，再挑戰最佳分數並再玩一次。",
    "zh-Hans": "短篇拥有者试玩预览：移动球拍，发球清除 12 块砖，再挑战最佳分数并再玩一次。",
    ja: "短いオーナープレビュー：パドルを動かし、12個のブロックにサーブして、ベストスコアを狙い、すぐにもう一度遊べます。",
    ko: "짧은 오너 프리뷰: 패들을 움직여 12개 벽돌에 서브하고, 최고 점수에 도전한 뒤 바로 다시 플레이하세요.",
    es: "Vista previa breve para el propietario: mueve la pala, sirve para romper 12 ladrillos, busca tu mejor puntuación y juega otra vez.",
    "pt-BR": "Prévia curta para o proprietário: mova a raquete, saque para limpar 12 blocos, busque sua melhor pontuação e jogue novamente.",
    fr: "Aperçu court pour le propriétaire : déplacez la raquette, servez pour casser 12 briques, visez votre meilleur score et rejouez.",
    de: "Kurze Vorschau für den Besitzer: Bewege das Paddle, räume 12 Steine per Aufschlag ab, jage deinen Bestwert und spiele erneut.",
    it: "Anteprima breve per il proprietario: muovi la racchetta, servi per rompere 12 mattoni, insegui il tuo record e rigioca.",
    ru: "Короткое превью для владельца: двигайте ракетку, подавайте по 12 блокам, улучшайте рекорд и играйте снова.",
    hi: "मालिक के लिए छोटा प्रीव्यू: पैडल चलाएँ, सर्व से 12 ईंटें तोड़ें, अपना सर्वश्रेष्ठ स्कोर चुनौती दें और फिर खेलें।",
    ar: "معاينة قصيرة للمالك: حرّك المضرب، أرسل الكرة لتحطيم 12 لبنة، طارد أفضل نتيجة والعب مجدداً.",
  };

  const BREAKOUT_AIM_COPY = {
    en: (column) => `Aim column ${column}: Serve will hit the highlighted brick.`,
    "zh-Hant": (column) => `瞄準第 ${column} 欄：發球會擊中標示的磚塊。`,
    "zh-Hans": (column) => `瞄准第 ${column} 列：发球会击中标记的砖块。`,
    ja: (column) => `第${column}列を狙う：サーブで強調されたブロックに当たります。`,
    ko: (column) => `${column}번 열 조준: 서브가 강조된 벽돌을 칩니다.`,
    es: (column) => `Apunta a la columna ${column}: el saque golpeará el ladrillo destacado.`,
    "pt-BR": (column) => `Mire a coluna ${column}: o saque atingirá o bloco destacado.`,
    fr: (column) => `Visez la colonne ${column} : le service touchera la brique mise en évidence.`,
    de: (column) => `Ziele auf Spalte ${column}: Der Aufschlag trifft den markierten Stein.`,
    it: (column) => `Mira la colonna ${column}: il servizio colpirà il mattone evidenziato.`,
    ru: (column) => `Цель — столбец ${column}: подача попадёт в выделенный блок.`,
    hi: (column) => `स्तंभ ${column} पर निशाना लगाएँ: सर्व हाइलाइट की गई ईंट पर लगेगा।`,
    ar: (column) => `صوّب نحو العمود ${column}: ستصيب الإرسالية اللبنة المميزة.`,
  };
  const BREAKOUT_EMPTY_COPY = {
    en: (column) => `Column ${column} is clear — move the paddle before serving.`,
    "zh-Hant": (column) => `第 ${column} 欄已清空——發球前先移動球拍。`,
    "zh-Hans": (column) => `第 ${column} 列已清空——发球前先移动球拍。`,
    ja: (column) => `第${column}列は空です。サーブの前にパドルを動かしましょう。`,
    ko: (column) => `${column}번 열은 비었습니다. 서브하기 전에 패들을 옮기세요.`,
    es: (column) => `La columna ${column} está vacía: mueve la pala antes de sacar.`,
    "pt-BR": (column) => `A coluna ${column} está vazia — mova a raquete antes de sacar.`,
    fr: (column) => `La colonne ${column} est vide : déplacez la raquette avant de servir.`,
    de: (column) => `Spalte ${column} ist frei – bewege das Paddle vor dem Aufschlag.`,
    it: (column) => `La colonna ${column} è vuota: sposta la racchetta prima del servizio.`,
    ru: (column) => `Столбец ${column} пуст — перед подачей переместите ракетку.`,
    hi: (column) => `स्तंभ ${column} खाली है—सर्व करने से पहले पैडल चलाएँ।`,
    ar: (column) => `العمود ${column} فارغ — حرّك المضرب قبل الإرسال.`,
  };
  const BREAKOUT_RESULT_GOAL_COPY = {
    en: (shots) => shots > 12 ? `You used ${shots} shots. Rematch goal: clear all 12 bricks in ${shots - 1} shots or fewer.` : "You used 12 shots. Rematch goal: match this clean clear.",
    "zh-Hant": (shots) => shots > 12 ? `本局用了 ${shots} 次射擊。再玩目標：用不超過 ${shots - 1} 次射擊清除 12 塊磚。` : "本局用了 12 次射擊。再玩目標：再次完成這次乾淨通關。",
    "zh-Hans": (shots) => shots > 12 ? `本局用了 ${shots} 次射击。重玩目标：用不超过 ${shots - 1} 次射击清除 12 块砖。` : "本局用了 12 次射击。重玩目标：再次完成这次干净通关。",
    ja: (shots) => shots > 12 ? `今回は${shots}ショットでした。リプレイ目標：${shots - 1}ショット以内で12個すべてを消しましょう。` : "今回は12ショットでした。リプレイ目標：このクリーンなクリアを再現しましょう。",
    ko: (shots) => shots > 12 ? `이번에는 ${shots}샷을 사용했습니다. 다시 플레이 목표: ${shots - 1}샷 이하로 벽돌 12개를 모두 깨세요.` : "이번에는 12샷을 사용했습니다. 다시 플레이 목표: 이 깔끔한 클리어를 재현하세요.",
    es: (shots) => shots > 12 ? `Usaste ${shots} tiros. Meta de revancha: rompe los 12 ladrillos en ${shots - 1} tiros o menos.` : "Usaste 12 tiros. Meta de revancha: repite esta limpieza perfecta.",
    "pt-BR": (shots) => shots > 12 ? `Você usou ${shots} tiros. Meta da revanche: quebre os 12 blocos com ${shots - 1} tiros ou menos.` : "Você usou 12 tiros. Meta da revanche: repita esta limpeza perfeita.",
    fr: (shots) => shots > 12 ? `Vous avez utilisé ${shots} tirs. Objectif de revanche : cassez les 12 briques en ${shots - 1} tirs ou moins.` : "Vous avez utilisé 12 tirs. Objectif de revanche : reproduisez ce parcours parfait.",
    de: (shots) => shots > 12 ? `Du hast ${shots} Schüsse gebraucht. Rematch-Ziel: Zerstöre alle 12 Steine mit höchstens ${shots - 1} Schüssen.` : "Du hast 12 Schüsse gebraucht. Rematch-Ziel: Wiederhole diesen sauberen Durchlauf.",
    it: (shots) => shots > 12 ? `Hai usato ${shots} tiri. Obiettivo rivincita: rompi i 12 mattoni in ${shots - 1} tiri o meno.` : "Hai usato 12 tiri. Obiettivo rivincita: ripeti questa pulizia perfetta.",
    ru: (shots) => shots > 12 ? `Вы использовали ${shots} выстрелов. Цель реванша: разбейте все 12 блоков за ${shots - 1} выстрелов или меньше.` : "Вы использовали 12 выстрелов. Цель реванша: повторите этот чистый результат.",
    hi: (shots) => shots > 12 ? `आपने ${shots} शॉट लगाए। दोबारा खेलने का लक्ष्य: 12 ईंटें ${shots - 1} या कम शॉट में तोड़ें।` : "आपने 12 शॉट लगाए। दोबारा खेलने का लक्ष्य: इस साफ़ जीत को दोहराएँ।",
    ar: (shots) => shots > 12 ? `استخدمت ${shots} تسديدة. هدف الإعادة: حطّم اللبنات الـ12 في ${shots - 1} تسديدة أو أقل.` : "استخدمت 12 تسديدة. هدف الإعادة: كرّر هذا الفوز النظيف.",
  };
  const breakoutResultGoalCopy = (locale, shots) => (BREAKOUT_RESULT_GOAL_COPY[locale] || BREAKOUT_RESULT_GOAL_COPY.en)(Math.max(12, Number(shots) || 12));

  const TIC_CELL_COPY = {
    en: { row: "Row", column: "column", empty: "empty", winning: "winning line" },
    "zh-Hant": { row: "列", column: "欄", empty: "空白", winning: "勝利連線" },
    "zh-Hans": { row: "行", column: "列", empty: "空白", winning: "获胜连线" },
    ja: { row: "行", column: "列", empty: "空き", winning: "勝利ライン" },
    ko: { row: "행", column: "열", empty: "비어 있음", winning: "승리 줄" },
    es: { row: "Fila", column: "columna", empty: "vacía", winning: "línea ganadora" },
    "pt-BR": { row: "Linha", column: "coluna", empty: "vazia", winning: "linha vencedora" },
    fr: { row: "Ligne", column: "colonne", empty: "vide", winning: "ligne gagnante" },
    de: { row: "Reihe", column: "Spalte", empty: "leer", winning: "Gewinnlinie" },
    it: { row: "Riga", column: "colonna", empty: "vuota", winning: "linea vincente" },
    ru: { row: "Строка", column: "столбец", empty: "пусто", winning: "победная линия" },
    hi: { row: "पंक्ति", column: "स्तंभ", empty: "खाली", winning: "विजयी पंक्ति" },
    ar: { row: "الصف", column: "العمود", empty: "فارغة", winning: "خط الفوز" },
  };

  const CHESS_CELL_COPY = {
    en: { row: "Row", column: "column", empty: "empty square", blackRook: "black rook", blackPawn: "black pawn", blackKing: "black king", whitePawn: "white pawn", whiteKing: "white king", target: "target square" },
    "zh-Hant": { row: "第", column: "欄", empty: "空白格", blackRook: "黑車", blackPawn: "黑兵", blackKing: "黑王", whitePawn: "白兵", whiteKing: "白王", target: "目前目標格" },
    "zh-Hans": { row: "第", column: "列", empty: "空白格", blackRook: "黑车", blackPawn: "黑兵", blackKing: "黑王", whitePawn: "白兵", whiteKing: "白王", target: "当前目标格" },
    ja: { row: "行", column: "列", empty: "空きマス", blackRook: "黒いルーク", blackPawn: "黒いポーン", blackKing: "黒いキング", whitePawn: "白いポーン", whiteKing: "白いキング", target: "現在の目標マス" },
    ko: { row: "행", column: "열", empty: "빈 칸", blackRook: "검은 룩", blackPawn: "검은 폰", blackKing: "검은 킹", whitePawn: "흰 폰", whiteKing: "흰 킹", target: "현재 목표 칸" },
    es: { row: "Fila", column: "columna", empty: "casilla vacía", blackRook: "torre negra", blackPawn: "peón negro", blackKing: "rey negro", whitePawn: "peón blanco", whiteKing: "rey blanco", target: "casilla objetivo" },
    "pt-BR": { row: "Linha", column: "coluna", empty: "casa vazia", blackRook: "torre preta", blackPawn: "peão preto", blackKing: "rei preto", whitePawn: "peão branco", whiteKing: "rei branco", target: "casa-alvo" },
    fr: { row: "Ligne", column: "colonne", empty: "case vide", blackRook: "tour noire", blackPawn: "pion noir", blackKing: "roi noir", whitePawn: "pion blanc", whiteKing: "roi blanc", target: "case cible" },
    de: { row: "Reihe", column: "Spalte", empty: "leeres Feld", blackRook: "schwarzer Turm", blackPawn: "schwarzer Bauer", blackKing: "schwarzer König", whitePawn: "weißer Bauer", whiteKing: "weißer König", target: "Zielfeld" },
    it: { row: "Riga", column: "colonna", empty: "casella vuota", blackRook: "torre nera", blackPawn: "pedone nero", blackKing: "re nero", whitePawn: "pedone bianco", whiteKing: "re bianco", target: "casella obiettivo" },
    ru: { row: "Строка", column: "столбец", empty: "пустая клетка", blackRook: "чёрная ладья", blackPawn: "чёрная пешка", blackKing: "чёрный король", whitePawn: "белая пешка", whiteKing: "белый король", target: "целевая клетка" },
    hi: { row: "पंक्ति", column: "स्तंभ", empty: "खाना खाली है", blackRook: "काला रुख", blackPawn: "काला प्यादा", blackKing: "काला राजा", whitePawn: "सफेद प्यादा", whiteKing: "सफेद राजा", target: "लक्षित खाना" },
    ar: { row: "الصف", column: "العمود", empty: "مربع فارغ", blackRook: "رخ أسود", blackPawn: "بيدق أسود", blackKing: "ملك أسود", whitePawn: "بيدق أبيض", whiteKing: "ملك أبيض", target: "مربع الهدف" },
  };

  const CHESS_PIECE_LABELS = { "♜": "blackRook", "♟": "blackPawn", "♚": "blackKing", "♙": "whitePawn", "♔": "whiteKing" };

  const TIC_RIVAL_REPLY_COPY = {
    en: (row, column) => `Rival O answered in row ${row}, column ${column}. Your turn.`,
    "zh-Hant": (row, column) => `對手 O 落在第 ${row} 列、第 ${column} 欄。輪到你了。`,
    "zh-Hans": (row, column) => `对手 O 落在第 ${row} 行、第 ${column} 列。轮到你了。`,
    ja: (row, column) => `相手のOが${row}行${column}列に入りました。あなたの番です。`,
    ko: (row, column) => `상대 O가 ${row}행 ${column}열에 놓였습니다. 이제 당신의 차례입니다.`,
    es: (row, column) => `El rival puso O en la fila ${row}, columna ${column}. Es tu turno.`,
    "pt-BR": (row, column) => `O rival colocou O na linha ${row}, coluna ${column}. É sua vez.`,
    fr: (row, column) => `L'adversaire a placé O à la ligne ${row}, colonne ${column}. À vous de jouer.`,
    de: (row, column) => `Der Gegner setzte O in Reihe ${row}, Spalte ${column}. Du bist dran.`,
    it: (row, column) => `L'avversario ha messo O nella riga ${row}, colonna ${column}. Tocca a te.`,
    ru: (row, column) => `Соперник поставил O в строку ${row}, столбец ${column}. Теперь ваш ход.`,
    hi: (row, column) => `प्रतिद्वंद्वी ने O को पंक्ति ${row}, स्तंभ ${column} में रखा। अब आपकी चाल है।`,
    ar: (row, column) => `وضع الخصم O في الصف ${row} والعمود ${column}. دورك الآن.`,
  };

  const TIC_OUTCOME_COPY = {
    en: { winTitle: "Three in a row!", winCopy: "You completed a line before the rival.", lossTitle: "Rival wins", lossCopy: "The rival completed a line first. Replay and block the threat.", drawTitle: "Draw", drawCopy: "The board is full with no winning line. Replay to try a new route." },
    "zh-Hant": { winTitle: "三格連線！", winCopy: "你在對手之前完成了連線。", lossTitle: "對手獲勝", lossCopy: "對手先完成連線。再玩一次並及早封鎖威脅。", drawTitle: "平手", drawCopy: "棋盤已滿，雙方都沒有連線。再玩一次嘗試新路線。" },
    "zh-Hans": { winTitle: "三格连线！", winCopy: "你在对手之前完成了连线。", lossTitle: "对手获胜", lossCopy: "对手先完成连线。再玩一次并及时封锁威胁。", drawTitle: "平局", drawCopy: "棋盘已满，双方都没有连线。再玩一次尝试新路线。" },
    ja: { winTitle: "3つ並びました！", winCopy: "相手より先にラインを完成させました。", lossTitle: "相手の勝ち", lossCopy: "相手が先にラインを完成させました。もう一度、脅威を早めに防ぎましょう。", drawTitle: "引き分け", drawCopy: "勝利ラインがないまま盤面が埋まりました。別の手順でもう一度挑戦しましょう。" },
    ko: { winTitle: "세 칸 완성!", winCopy: "상대보다 먼저 한 줄을 완성했습니다.", lossTitle: "상대 승리", lossCopy: "상대가 먼저 한 줄을 완성했습니다. 다시 플레이해 위협을 미리 막아 보세요.", drawTitle: "무승부", drawCopy: "승리 줄 없이 보드가 가득 찼습니다. 다른 수로 다시 도전하세요." },
    es: { winTitle: "¡Tres en raya!", winCopy: "Completaste una línea antes que el rival.", lossTitle: "Gana el rival", lossCopy: "El rival completó una línea primero. Repite y bloquea la amenaza.", drawTitle: "Empate", drawCopy: "El tablero está lleno y no hay línea ganadora. Repite con otra ruta." },
    "pt-BR": { winTitle: "Três em linha!", winCopy: "Você completou uma linha antes do rival.", lossTitle: "O rival venceu", lossCopy: "O rival completou uma linha primeiro. Jogue de novo e bloqueie a ameaça.", drawTitle: "Empate", drawCopy: "O tabuleiro está cheio e ninguém formou uma linha. Tente outra rota." },
    fr: { winTitle: "Trois alignés !", winCopy: "Vous avez complété une ligne avant l’adversaire.", lossTitle: "L’adversaire gagne", lossCopy: "L’adversaire a complété une ligne en premier. Rejouez et bloquez la menace.", drawTitle: "Match nul", drawCopy: "La grille est pleine sans ligne gagnante. Rejouez avec une autre approche." },
    de: { winTitle: "Drei in einer Reihe!", winCopy: "Du hast vor dem Gegner eine Reihe vervollständigt.", lossTitle: "Der Gegner gewinnt", lossCopy: "Der Gegner hatte zuerst eine Reihe. Spiele erneut und blockiere die Gefahr.", drawTitle: "Unentschieden", drawCopy: "Das Feld ist voll, ohne Gewinnreihe. Versuche beim nächsten Spiel einen anderen Weg." },
    it: { winTitle: "Tris!", winCopy: "Hai completato una linea prima dell’avversario.", lossTitle: "Vince l’avversario", lossCopy: "L’avversario ha completato per primo una linea. Riprova e blocca la minaccia.", drawTitle: "Pareggio", drawCopy: "Il tabellone è pieno senza una linea vincente. Riprova con una strategia diversa." },
    ru: { winTitle: "Три в ряд!", winCopy: "Вы собрали линию раньше соперника.", lossTitle: "Соперник победил", lossCopy: "Соперник первым собрал линию. Сыграйте снова и заблокируйте угрозу.", drawTitle: "Ничья", drawCopy: "Поле заполнено, но победной линии нет. Попробуйте другой путь." },
    hi: { winTitle: "तीन की पंक्ति!", winCopy: "आपने प्रतिद्वंद्वी से पहले एक पंक्ति पूरी की।", lossTitle: "प्रतिद्वंद्वी जीता", lossCopy: "प्रतिद्वंद्वी ने पहले पंक्ति पूरी की। फिर खेलें और खतरे को रोकें।", drawTitle: "बराबरी", drawCopy: "बोर्ड भर गया और कोई विजयी पंक्ति नहीं बनी। नई चालों के साथ फिर खेलें।" },
    ar: { winTitle: "ثلاثة على خط واحد!", winCopy: "أكملت خطاً قبل الخصم.", lossTitle: "فاز الخصم", lossCopy: "أكمل الخصم خطاً أولاً. أعد اللعب وامنع التهديد مبكراً.", drawTitle: "تعادل", drawCopy: "امتلأت اللوحة بلا خط فائز. أعد اللعب وجرّب مساراً جديداً." },
  };

  const TIC_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  const ticWinningLine = (cells, mark) => TIC_LINES.find((line) => line.every((index) => cells[index] === mark)) || [];
  const ticRivalMove = (cells) => {
    const empty = cells.map((cell, index) => cell ? -1 : index).filter((index) => index >= 0);
    const completesLine = (mark, index) => {
      const candidate = [...cells];
      candidate[index] = mark;
      return ticWinningLine(candidate, mark).length === 3;
    };
    return empty.find((index) => completesLine("O", index))
      ?? empty.find((index) => completesLine("X", index))
      ?? [4, 0, 8, 2, 6, 1, 3, 5, 7].find((index) => !cells[index])
      ?? -1;
  };

  const MAHJONG_TILE_COPY = {
    en: { tile: "Tile", position: "position", open: "open", selected: "selected" },
    "zh-Hant": { tile: "麻將牌", position: "位置", open: "可選", selected: "已選取" },
    "zh-Hans": { tile: "麻将牌", position: "位置", open: "可选", selected: "已选择" },
    ja: { tile: "牌", position: "位置", open: "選択可能", selected: "選択済み" },
    ko: { tile: "타일", position: "위치", open: "선택 가능", selected: "선택됨" },
    es: { tile: "Ficha", position: "posición", open: "libre", selected: "seleccionada" },
    "pt-BR": { tile: "Peça", position: "posição", open: "livre", selected: "selecionada" },
    fr: { tile: "Tuile", position: "position", open: "libre", selected: "sélectionnée" },
    de: { tile: "Stein", position: "Position", open: "frei", selected: "ausgewählt" },
    it: { tile: "Tessera", position: "posizione", open: "libera", selected: "selezionata" },
    ru: { tile: "Плитка", position: "позиция", open: "свободна", selected: "выбрана" },
    hi: { tile: "टाइल", position: "स्थान", open: "खुली", selected: "चुनी गई" },
    ar: { tile: "بلاطة", position: "الموضع", open: "مفتوحة", selected: "محددة" },
  };
  const MAHJONG_MISMATCH_COPY = {
    en: (tile) => `These tiles do not match. ${tile} stays selected; choose its matching ${tile}.`,
    "zh-Hant": (tile) => `這兩張牌不相同。已保留 ${tile} 牌，請選擇另一張 ${tile} 牌。`,
    "zh-Hans": (tile) => `这两张牌不相同。已保留 ${tile} 牌，请选择另一张 ${tile} 牌。`,
    ja: (tile) => `この2枚は一致しません。${tile}を選択したまま、もう1枚の${tile}を選びましょう。`,
    ko: (tile) => `두 타일이 일치하지 않습니다. ${tile}을(를) 선택한 채 같은 ${tile}을(를) 고르세요.`,
    es: (tile) => `Estas fichas no coinciden. ${tile} queda seleccionada; elige otra ${tile}.`,
    "pt-BR": (tile) => `Estas peças não combinam. ${tile} continua selecionada; escolha outra ${tile}.`,
    fr: (tile) => `Ces tuiles ne correspondent pas. ${tile} reste sélectionnée ; choisissez une autre ${tile}.`,
    de: (tile) => `Diese Steine passen nicht zusammen. ${tile} bleibt ausgewählt; wähle einen weiteren ${tile}.`,
    it: (tile) => `Queste tessere non corrispondono. ${tile} resta selezionata; scegli un’altra ${tile}.`,
    ru: (tile) => `Эти плитки не совпадают. Плитка ${tile} остаётся выбранной; выберите ещё одну ${tile}.`,
    hi: (tile) => `ये टाइलें मेल नहीं खातीं। ${tile} चुनी हुई है; दूसरी ${tile} चुनें।`,
    ar: (tile) => `هاتان البلاطتان غير متطابقتين. ستبقى ${tile} محددة؛ اختر ${tile} أخرى.`,
  };

  const CATALOG = {
    tetris: { icon: "▦", type: "tetris", objective: "clearLines" }, snake: { icon: "◉", type: "snake", objective: "eatFood" }, "tic-tac-toe": { icon: "✕◯", type: "tic", objective: "tic" },
    chess: { icon: "♞", type: "chess", objective: "chess" }, checkers: { icon: "●", type: "checkers", objective: "checkers" }, "mahjong-solitaire": { icon: "🀄", type: "mahjong", objective: "mahjong" },
    wordle: { icon: "W", type: "wordle", objective: "wordle" }, hangman: { icon: "A", type: "hangman", objective: "hangman" }, breakout: { icon: "▤", type: "breakout", objective: "breakout" }, pong: { icon: "⊙", type: "pong", objective: "pong" },
  };
  const SNAKE_GRID_SIZE = 10;
  const SNAKE_TICK_MS = 360;
  const SNAKE_COPY = {
    en: { run: (n) => `Run ${n}`, goal: (n) => `Milestone: ${n} food`, nextGoal: (n) => `Next milestone: ${n} food`, collected: (n) => `Food collected: ${n}`, milestone: (n) => `Mastery milestone: ${n} food reached — +20 bonus. Next: ${n + 2} food. Keep going!` },
    "zh-Hant": { run: (n) => `第 ${n} 局`, goal: (n) => `里程碑：${n} 個食物`, nextGoal: (n) => `下一個里程碑：${n} 個食物`, collected: (n) => `已收集食物：${n}`, milestone: (n) => `掌握里程碑：已達成 ${n} 個食物，獲得 20 分獎勵。下一個目標：${n + 2} 個，繼續前進！` },
    "zh-Hans": { run: (n) => `第 ${n} 局`, goal: (n) => `里程碑：${n} 个食物`, nextGoal: (n) => `下一个里程碑：${n} 个食物`, collected: (n) => `已收集食物：${n}`, milestone: (n) => `掌握里程碑：已达成 ${n} 个食物，获得 20 分奖励。下一个目标：${n + 2} 个，继续前进！` },
    ja: { run: (n) => `ラン ${n}`, goal: (n) => `目標：食べ物 ${n} 個`, nextGoal: (n) => `次の目標：食べ物 ${n} 個`, collected: (n) => `食べ物：${n} 個`, milestone: (n) => `マスタリー目標達成：食べ物${n}個、ボーナス20点！次は${n + 2}個です。続けましょう。` },
    ko: { run: (n) => `${n}번째 런`, goal: (n) => `목표: 먹이 ${n}개`, nextGoal: (n) => `다음 목표: 먹이 ${n}개`, collected: (n) => `먹이 수집: ${n}`, milestone: (n) => `숙련 마일스톤 달성: 먹이 ${n}개, 보너스 20점! 다음 목표는 ${n + 2}개입니다. 계속하세요.` },
    es: { run: (n) => `Partida ${n}`, goal: (n) => `Meta: ${n} alimentos`, nextGoal: (n) => `Siguiente meta: ${n} alimentos`, collected: (n) => `Alimentos: ${n}`, milestone: (n) => `Hito de dominio: ${n} alimentos alcanzados. ¡+20 de bonus! Siguiente: ${n + 2}.` },
    "pt-BR": { run: (n) => `Partida ${n}`, goal: (n) => `Meta: ${n} alimentos`, nextGoal: (n) => `Próxima meta: ${n} alimentos`, collected: (n) => `Alimentos: ${n}`, milestone: (n) => `Marco de domínio: ${n} alimentos alcançados. Bônus de 20! Próxima meta: ${n + 2}. Continue!` },
    fr: { run: (n) => `Partie ${n}`, goal: (n) => `Objectif : ${n} nourritures`, nextGoal: (n) => `Prochain objectif : ${n} nourritures`, collected: (n) => `Nourritures : ${n}`, milestone: (n) => `Palier de maîtrise : ${n} nourritures atteintes. Bonus de 20 ! Prochain objectif : ${n + 2}. Continuez !` },
    de: { run: (n) => `Lauf ${n}`, goal: (n) => `Ziel: ${n} Futter`, nextGoal: (n) => `Nächstes Ziel: ${n} Futter`, collected: (n) => `Futter gesammelt: ${n}`, milestone: (n) => `Meilenstein geschafft: ${n} Futter. +20 Bonus! Nächstes Ziel: ${n + 2}. Weiter!` },
    it: { run: (n) => `Partita ${n}`, goal: (n) => `Traguardo: ${n} cibi`, nextGoal: (n) => `Prossimo traguardo: ${n} cibi`, collected: (n) => `Cibi raccolti: ${n}`, milestone: (n) => `Traguardo di maestria: ${n} cibi raggiunti. Bonus di 20! Prossimo: ${n + 2}. Continua!` },
    ru: { run: (n) => `Забег ${n}`, goal: (n) => `Цель: ${n} ед. еды`, nextGoal: (n) => `Следующая цель: ${n} ед. еды`, collected: (n) => `Еда собрана: ${n}`, milestone: (n) => `Мастерство подтверждено: ${n} ед. еды. Бонус 20! Следующая цель: ${n + 2}. Продолжайте!` },
    hi: { run: (n) => `रन ${n}`, goal: (n) => `लक्ष्य: ${n} भोजन`, nextGoal: (n) => `अगला लक्ष्य: ${n} भोजन`, collected: (n) => `भोजन एकत्र: ${n}`, milestone: (n) => `${n} भोजन का महारत लक्ष्य पूरा। 20 बोनस! अगला लक्ष्य: ${n + 2}। जारी रखें!` },
    ar: { run: (n) => `الجولة ${n}`, goal: (n) => `الهدف: ${n} طعام`, nextGoal: (n) => `الهدف التالي: ${n} طعام`, collected: (n) => `الطعام المجموع: ${n}`, milestone: (n) => `إنجاز إتقان: اكتمل جمع ${n} من الطعام. مكافأة 20! الهدف التالي: ${n + 2}. استمر!` },
  };
  const SNAKE_MODE_COPY = {
    en: { open: "Open grid", gates: "Gate grid", orbit: "Orbit grid" }, "zh-Hant": { open: "開放棋盤", gates: "星門棋盤", orbit: "軌道棋盤" }, "zh-Hans": { open: "开放棋盘", gates: "星门棋盘", orbit: "轨道棋盘" }, ja: { open: "オープングリッド", gates: "ゲートグリッド", orbit: "軌道グリッド" }, ko: { open: "열린 격자", gates: "게이트 격자", orbit: "궤도 격자" }, es: { open: "Cuadrícula abierta", gates: "Cuadrícula de portales", orbit: "Cuadrícula orbital" }, "pt-BR": { open: "Grade aberta", gates: "Grade de portais", orbit: "Grade orbital" }, fr: { open: "Grille ouverte", gates: "Grille à portails", orbit: "Grille orbitale" }, de: { open: "Offenes Raster", gates: "Tor-Raster", orbit: "Orbit-Raster" }, it: { open: "Griglia aperta", gates: "Griglia di varchi", orbit: "Griglia orbitale" }, ru: { open: "Открытая сетка", gates: "Сетка с вратами", orbit: "Орбитальная сетка" }, hi: { open: "खुली ग्रिड", gates: "गेट ग्रिड", orbit: "कक्षा ग्रिड" }, ar: { open: "شبكة مفتوحة", gates: "شبكة البوابات", orbit: "شبكة المدار" },
  };
  const SNAKE_DELTAS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
  const SNAKE_OPPOSITE = { left: "right", right: "left", up: "down", down: "up" };
  const snakeTrailForDirection = (direction) => {
    const [dx, dy] = SNAKE_DELTAS[direction] || SNAKE_DELTAS.up;
    const head = Math.floor(SNAKE_GRID_SIZE / 2) * SNAKE_GRID_SIZE + Math.floor(SNAKE_GRID_SIZE / 2);
    return [0, 1, 2].map((step) => head - (dx * step) - (dy * SNAKE_GRID_SIZE * step));
  };
  const SNAKE_INSTRUCTION = {
    en: "Tap the board or choose a direction to start. Then steer to food, wrap across the edges, and avoid your tail and obstacle cells.",
    "zh-Hant": "點擊棋盤或選擇方向開始，再轉向吃食物，從邊界穿到對面並避開自己的身體與障礙格。",
    "zh-Hans": "点击棋盘或选择方向开始，再转向吃食物，从边界穿到对面并避开自己的身体与障碍格。",
    ja: "盤面をタップするか方向を選んで開始し、食べ物へ曲がり、端から反対側へ回って体と障害物を避けましょう。",
    ko: "보드를 탭하거나 방향을 선택해 시작한 뒤 먹이를 향해 틀고, 가장자리에서 반대편으로 넘어가며 몸과 장애물 칸을 피하세요.",
    es: "Toca el tablero o elige una dirección para empezar; luego ve hacia la comida, cruza los bordes y evita tu cola y las casillas de obstáculo.",
    "pt-BR": "Toque no tabuleiro ou escolha uma direção para começar; depois vá à comida, atravesse as bordas e evite sua cauda e as casas de obstáculo.",
    fr: "Touchez le plateau ou choisissez une direction pour commencer, puis visez la nourriture, traversez les bords et évitez votre queue et les cases obstacles.",
    de: "Tippe auf das Spielfeld oder wähle eine Richtung zum Start; lenke dann zum Futter, wechsle über den Rand auf die andere Seite und meide Schwanz und Hinderniszellen.",
    it: "Tocca la griglia o scegli una direzione per iniziare; poi guida il serpente al cibo, attraversa i bordi ed evita coda e celle ostacolo.",
    ru: "Нажмите на поле или выберите направление, чтобы начать; затем ведите змейку к еде, переходите через край на противоположную сторону и избегайте хвоста и препятствий.",
    hi: "शुरू करने के लिए बोर्ड पर टैप करें या दिशा चुनें; फिर भोजन की ओर मुड़ें, किनारे से दूसरी ओर निकलें और पूँछ व बाधा वाले खाने से बचें।",
    ar: "اضغط على اللوحة أو اختر اتجاهاً للبدء، ثم وجّه الثعبان إلى الطعام واعبر الحواف لتظهر في الجهة المقابلة وتجنب ذيله وخلايا العوائق.",
  };
  const SNAKE_READY = {
    en: "Tap the board or choose a direction to start.",
    "zh-Hant": "點擊棋盤或選擇方向開始。",
    "zh-Hans": "点击棋盘或选择方向开始。",
    ja: "盤面をタップするか方向を選んで開始します。",
    ko: "보드를 탭하거나 방향을 선택해 시작하세요.",
    es: "Toca el tablero o elige una dirección para empezar.",
    "pt-BR": "Toque no tabuleiro ou escolha uma direção para começar.",
    fr: "Touchez le plateau ou choisissez une direction pour commencer.",
    de: "Tippe auf das Spielfeld oder wähle eine Richtung zum Start.",
    it: "Tocca la griglia o scegli una direzione per iniziare.",
    ru: "Нажмите на поле или выберите направление, чтобы начать.",
    hi: "शुरू करने के लिए बोर्ड पर टैप करें या दिशा चुनें।",
    ar: "اضغط على اللوحة أو اختر اتجاهاً للبدء.",
  };
  const SNAKE_OBSTACLE_CUE = {
    en: "Obstacle cells mark the route boundary. Do not enter the glowing cells.",
    "zh-Hant": "障礙格是路線邊界，請勿進入發光格。",
    "zh-Hans": "障碍格是路线边界，请勿进入发光格。",
    ja: "障害物のマスはルートの境界です。光るマスには入らないでください。",
    ko: "장애물 칸은 경로의 경계입니다. 빛나는 칸에 들어가지 마세요.",
    es: "Las casillas de obstáculo marcan el límite de la ruta. No entres en las casillas brillantes.",
    "pt-BR": "As casas de obstáculo marcam o limite da rota. Não entre nas casas brilhantes.",
    fr: "Les cases obstacles marquent la limite du parcours. N’entrez pas dans les cases lumineuses.",
    de: "Hinderniszellen markieren die Routengrenze. Betritt die leuchtenden Zellen nicht.",
    it: "Le celle ostacolo segnano il confine del percorso. Non entrare nelle celle luminose.",
    ru: "Клетки-препятствия обозначают границу маршрута. Не заходите на светящиеся клетки.",
    hi: "बाधा वाले खाने मार्ग की सीमा बताते हैं। चमकते खानों में प्रवेश न करें।",
    ar: "تحدد خلايا العوائق حدود المسار. لا تدخل الخلايا المضيئة.",
  };
  const SNAKE_ROUTE_CUE = {
    en: { status: "New food appeared — plan your first turn.", cell: "New food target — plan your first turn." },
    "zh-Hant": { status: "新食物已出現：先規劃第一個轉向。", cell: "新食物目標：先規劃第一個轉向。" },
    "zh-Hans": { status: "新食物已出现：先规划第一个转向。", cell: "新食物目标：先规划第一个转向。" },
    ja: { status: "新しい食べ物が出ました。最初の曲がり方を考えましょう。", cell: "新しい食べ物です。最初の曲がり方を考えましょう。" },
    ko: { status: "새 먹이가 나타났습니다. 첫 번째 방향 전환을 계획하세요.", cell: "새 먹이 목표입니다. 첫 번째 방향 전환을 계획하세요." },
    es: { status: "Apareció comida nueva: planifica tu primer giro.", cell: "Nuevo objetivo de comida: planifica tu primer giro." },
    "pt-BR": { status: "Uma nova comida apareceu: planeje sua primeira curva.", cell: "Novo alvo de comida: planeje sua primeira curva." },
    fr: { status: "Une nouvelle nourriture apparaît : prévoyez votre premier virage.", cell: "Nouvelle cible : prévoyez votre premier virage." },
    de: { status: "Neues Futter ist da – plane deinen ersten Richtungswechsel.", cell: "Neues Futterziel – plane deinen ersten Richtungswechsel." },
    it: { status: "È comparso un nuovo cibo: pianifica la prima curva.", cell: "Nuovo obiettivo: pianifica la prima curva." },
    ru: { status: "Появилась новая еда — спланируйте первый поворот.", cell: "Новая цель — спланируйте первый поворот." },
    hi: { status: "नया भोजन दिखाई दिया है—पहली दिशा बदलने की योजना बनाएँ।", cell: "नया भोजन लक्ष्य—पहली दिशा बदलने की योजना बनाएँ।" },
    ar: { status: "ظهر طعام جديد — خطط لمنعطفك الأول.", cell: "هدف طعام جديد — خطط لمنعطفك الأول." },
  };
  const SNAKE_SHELL_COPY = {
    en: { battleBack: "Back to main", mainBack: "Back to WeightPlay" },
    "zh-Hant": { battleBack: "返回主頁", mainBack: "返回 WeightPlay" },
    "zh-Hans": { battleBack: "返回主页", mainBack: "返回 WeightPlay" },
    ja: { battleBack: "メインへ戻る", mainBack: "WeightPlayへ戻る" },
    ko: { battleBack: "메인으로", mainBack: "WeightPlay로 돌아가기" },
    es: { battleBack: "Volver al inicio", mainBack: "Volver a WeightPlay" },
    "pt-BR": { battleBack: "Voltar ao início", mainBack: "Voltar ao WeightPlay" },
    fr: { battleBack: "Retour à l’accueil", mainBack: "Retour à WeightPlay" },
    de: { battleBack: "Zur Startseite", mainBack: "Zurück zu WeightPlay" },
    it: { battleBack: "Torna alla home", mainBack: "Torna a WeightPlay" },
    ru: { battleBack: "На главную", mainBack: "Вернуться в WeightPlay" },
    hi: { battleBack: "मुख्य पृष्ठ", mainBack: "WeightPlay पर वापस जाएँ" },
    ar: { battleBack: "العودة إلى الرئيسية", mainBack: "العودة إلى WeightPlay" },
  };
  const SNAKE_OBJECTIVE = {
    en: "Guide the snake to food and keep moving.",
    "zh-Hant": "引導蛇吃食物並持續前進。",
    "zh-Hans": "引导蛇吃食物并持续前进。",
    ja: "ヘビを食べ物へ導き、進み続けます。",
    ko: "뱀을 먹이로 이끌고 계속 이동하세요.",
    es: "Guía la serpiente hacia la comida y sigue avanzando.",
    "pt-BR": "Guie a cobra até a comida e continue avançando.",
    fr: "Guidez le serpent vers la nourriture et continuez d’avancer.",
    de: "Führe die Schlange zum Futter und bleibe in Bewegung.",
    it: "Guida il serpente verso il cibo e continua a muoverti.",
    ru: "Ведите змейку к еде и продолжайте двигаться.",
    hi: "साँप को भोजन तक ले जाएँ और चलते रहें।",
    ar: "وجّه الثعبان نحو الطعام واستمر في الحركة.",
  };
  const chooseSnakeFood = (trail, obstacles = []) => {
    const occupied = new Set([...trail, ...obstacles]);
    const free = Array.from({ length: SNAKE_GRID_SIZE * SNAKE_GRID_SIZE }, (_, index) => index).filter((index) => !occupied.has(index));
    return free.length ? free[Math.floor(Math.random() * free.length)] : -1;
  };
  const snakeInstruction = (locale) => SNAKE_INSTRUCTION[locale] || SNAKE_INSTRUCTION.en;
  const snakeCopy = (locale, keyName, value) => {
    const localized = SNAKE_COPY[locale] || SNAKE_COPY.en;
    const fallback = SNAKE_COPY.en[keyName];
    const formatter = localized[keyName] || fallback;
    return typeof formatter === "function" ? formatter(value) : formatter;
  };
  const snakeModeLabel = (locale, mode) => (SNAKE_MODE_COPY[locale] || SNAKE_MODE_COPY.en)[mode] || SNAKE_MODE_COPY.en.open;
  const snakeModeForRun = (runNumber) => ["open", "gates", "orbit"][(Math.max(1, runNumber) - 1) % 3];
  const snakeObstaclesForMode = (mode) => mode === "gates" ? [10, 53] : mode === "orbit" ? [18, 45] : [];
  const snakeGoalForRun = (runNumber) => 3 + Math.min(2, Math.max(0, runNumber - 1));

  const randomLocale = () => {
    try { return localStorage.getItem("weightPlayLocale") || "en"; } catch { return "en"; }
  };
  const key = (gameId) => `weightplay_popular_${gameId}_best`;
  const copy = (locale, k) => { const localized = COPY[locale] || COPY.en; if (k === "ready" && document.body?.dataset.gameId === "breakout") return BREAKOUT_PROMISE[locale] || BREAKOUT_PROMISE.en; if (k === "eatFood" && document.body?.dataset.gameId === "snake") return SNAKE_OBJECTIVE[locale] || SNAKE_OBJECTIVE.en; return localized[k]; };
  const breakoutAimCopy = (locale, column) => (BREAKOUT_AIM_COPY[locale] || BREAKOUT_AIM_COPY.en)(column);
  const breakoutEmptyCopy = (locale, column) => (BREAKOUT_EMPTY_COPY[locale] || BREAKOUT_EMPTY_COPY.en)(column);
  const breakoutTargetIndex = (state) => {
    const desiredColumn = Math.max(0, Math.min(5, Number(state.paddle) || 0));
    return state.bricks.findIndex((brick, index) => brick && index % 6 === desiredColumn);
  };
  const wordleLengthError = (locale) => WORDLE_LENGTH_ERROR[locale] || WORDLE_LENGTH_ERROR.en;
  const wordleHint = (locale, letter) => (WORDLE_HINT_COPY[locale] || WORDLE_HINT_COPY.en)(letter);
  const hangmanAlreadyUsed = (locale) => HANGMAN_ALREADY_USED[locale] || HANGMAN_ALREADY_USED.en;
  const hangmanHint = (locale, length, theme = "puzzle") => `${(HANGMAN_HINT_COPY[locale] || HANGMAN_HINT_COPY.en)(length)} ${(HANGMAN_THEME_COPY[locale] || HANGMAN_THEME_COPY.en)[theme]}`;
  const hangmanMiss = (locale, letter, misses) => (HANGMAN_MISS_COPY[locale] || HANGMAN_MISS_COPY.en)(letter, misses);
  const checkersPromotionCopy = (locale, kind) => (CHECKERS_PROMOTION_COPY[locale] || CHECKERS_PROMOTION_COPY.en)[kind];
  const checkersMoveCoachCopy = (locale) => CHECKERS_MOVE_COACH_COPY[locale] || CHECKERS_MOVE_COACH_COPY.en;
  const title = (locale, gameId) => window.WEIGHTPLAY_GAME_TITLES?.[gameId]?.[locale]
    || (TITLES[locale] || TITLES.en)[gameId];
  const ticCellLabel = (locale, index, cell, winning = false) => {
    const labels = TIC_CELL_COPY[locale] || TIC_CELL_COPY.en;
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    const base = `${labels.row} ${row}, ${labels.column} ${column}, ${cell || labels.empty}`;
    return winning && labels.winning ? `${base}, ${labels.winning}` : base;
  };
  const chessCellLabel = (locale, index, piece, target = false) => {
    const labels = CHESS_CELL_COPY[locale] || CHESS_CELL_COPY.en;
    const row = Math.floor(index / 4) + 1;
    const column = (index % 4) + 1;
    const pieceLabel = labels[CHESS_PIECE_LABELS[piece]] || labels.empty;
    const base = `${labels.row} ${row}, ${labels.column} ${column}, ${pieceLabel}`;
    return target ? `${base}, ${labels.target}` : base;
  };
  const ticRivalReplyCopy = (locale, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    return (TIC_RIVAL_REPLY_COPY[locale] || TIC_RIVAL_REPLY_COPY.en)(row, column);
  };
  const mahjongTileLabel = (locale, index, tile, selected) => {
    const labels = MAHJONG_TILE_COPY[locale] || MAHJONG_TILE_COPY.en;
    return `${labels.tile} ${tile}, ${labels.position} ${index + 1}, ${selected ? labels.selected : labels.open}`;
  };
  const makeState = (type) => {
    const state = { type, score: 0, moves: 0, done: false, success: false, message: "", tone: "", messageKey: "", mismatchTile: "" };
    if (type === "tetris") Object.assign(state, { pieces: 0, lines: 0, active: 3, blocks: [] });
    if (type === "snake") Object.assign(state, { started: false, food: 0, foodCell: 45, direction: "up", trail: snakeTrailForDirection("up"), runNumber: 1, goalFood: 3, modeKey: "open", obstacles: [], milestoneReached: false, milestoneCueActive: false, foodFlashCell: -1, foodCueCell: -1 });
    if (type === "tic") Object.assign(state, { cells: Array(9).fill(""), playerMoves: 0, aiMoves: 0, winningCells: [], rivalCell: -1, outcome: "" });
    if (type === "chess") Object.assign(state, { step: 0 });
    if (type === "checkers") Object.assign(state, { step: 0 });
    if (type === "mahjong") Object.assign(state, { tiles: [...MAHJONG_LAYOUTS[0].tiles], layoutKey: MAHJONG_LAYOUTS[0].key, selected: -1, matched: 0, focusTile: -1 });
    if (type === "wordle") Object.assign(state, { guesses: [], target: WORDLE_WORDS[0].target, wordKey: WORDLE_WORDS[0].wordKey });
    if (type === "hangman") Object.assign(state, { target: "PUZZLE", theme: "puzzle", letters: [], misses: 0 });
    if (type === "breakout") Object.assign(state, { bricks: Array(12).fill(true), shots: 0, paddle: 2 });
    if (type === "pong") Object.assign(state, { rallies: 0, paddle: 2, pongTarget: pongTargetForRally(0) });
    return state;
  };

  function mount(gameId) {
    const game = CATALOG[gameId];
    if (!game) throw new Error(`Unknown popular game: ${gameId}`);
    document.body.dataset.gameId = gameId;
    if (game.type === "breakout") document.body.dataset.gameVersion = BREAKOUT_GAME_VERSION;
    if (game.type === "tic") document.body.dataset.gameVersion = "v8";
    if (game.type === "hangman") document.body.dataset.gameVersion = "v6";
    if (game.type === "mahjong") document.body.dataset.gameVersion = "v8";
    if (game.type === "wordle") document.body.dataset.gameVersion = "v6";
    const root = document.querySelector("#popularArcade");
    if (!root) throw new Error("Popular game root is missing.");
    // Snake owns a complete 13-locale shell and guide. Keep the generic
    // runtime translator from re-translating freshly rendered copy using the
    // previous locale during an in-place language switch.
    if (game.type === "snake") {
      root.dataset.runtimeLocalize = "off";
      document.body.dataset.runtimeLocalize = "off";
    }
    const routeLocale = document.documentElement.lang;
    let locale = game.type === "snake" && COPY[routeLocale] ? routeLocale : randomLocale();
    if (!COPY[locale]) locale = "en";
    let state = makeState(game.type);
    let hangmanRoundIndex = 0;
    let mahjongRoundIndex = 0;
    let wordleRoundIndex = 0;
    const CHECKERS_GAME_VERSION = "v7";
    const CHECKERS_INTERFACE_VERSION = "6";
    const checkersSeenTargets = new Set();
    let checkersPromotionCueTracked = false;
    let lastInputType = "unknown";
    const viewportBucket = () => {
      const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
      const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
      if (height <= 430) return "short-landscape";
      if (width <= 480) return "phone";
      if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
      return height > width ? "desktop-portrait" : "desktop-landscape";
    };
    const trackCheckers = (eventName, details = {}) => {
      if (game.type !== "checkers") return;
      try {
        window.WonderAnalytics?.track?.(eventName, {
          game_id: "checkers",
          game_version: CHECKERS_GAME_VERSION,
          interface_version: CHECKERS_INTERFACE_VERSION,
          locale,
          viewport_bucket: viewportBucket(),
          input_type: lastInputType,
          step: Number(state?.step || 0),
          ...details,
        });
      } catch {
        // Measurement must never interrupt the owner-preview game.
      }
    };
    const noteInput = (event) => {
      if (game.type !== "checkers") return;
      lastInputType = event?.detail === 0
        ? "keyboard"
        : event?.pointerType === "touch"
          ? "touch"
          : event?.pointerType === "mouse"
            ? "mouse"
            : "pointer";
    };
    document.addEventListener("pointerdown", noteInput, { capture: true });
    document.addEventListener("keydown", noteInput, { capture: true });
    const els = {
      title: document.querySelector("#gameTitle"), tagline: document.querySelector("#gameTagline"), eyebrow: document.querySelector("#eyebrow"), locale: document.querySelector("#localeSelect"),
      main: document.querySelector("#mainScreen"), battle: document.querySelector("#battleScreen"), result: document.querySelector("#resultScreen"), board: document.querySelector("#board"), controls: document.querySelector("#controls"),
      message: document.querySelector("#gameMessage"), objective: document.querySelector("#objective"), instruction: document.querySelector("#mainInstruction"), resultTitle: document.querySelector("#resultTitle"), resultCopy: document.querySelector("#resultCopy"), resultStats: document.querySelector("#resultStats"), resultGoal: document.querySelector("#resultGoal"),
      round: document.querySelector("#roundLabel"), start: document.querySelector("#startBtn"), retry: document.querySelector("#retryBtn"), home: document.querySelector("#homeBtn"), hint: document.querySelector("#hintBtn"), restart: document.querySelector("#restartBtn"),
    };
    let tetrisFocusedControl = null;
    const rememberTetrisFocus = (event) => {
      if (game.type !== "tetris") return;
      tetrisFocusedControl = event.target?.closest?.("button, input, select, textarea") || null;
    };
    document.addEventListener("focusin", rememberTetrisFocus, { capture: true });
    document.addEventListener("pointerdown", (event) => {
      if (game.type === "tetris" && !event.target?.closest?.("button, input, select, textarea")) tetrisFocusedControl = null;
    }, { capture: true });
    if (!els.instruction) {
      const legacyInstruction = [...document.querySelectorAll(".main-copy > p")].find((node) => !node.id);
      if (legacyInstruction) legacyInstruction.hidden = true;
      els.instruction = document.createElement("p");
      els.instruction.id = "mainInstruction";
      els.instruction.className = "tagline";
      els.objective.insertAdjacentElement("afterend", els.instruction);
    }

    els.locale.innerHTML = LOCALES.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    els.locale.value = locale;
    const persistLocale = () => {
      locale = els.locale.value;
      window.WonderI18n?.setLocale?.(locale, { navigate: false, dispatch: game.type === "snake" });
      if (game.type === "snake") {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
        window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
      }
      try { localStorage.setItem("weightPlayLocale", locale); } catch {}
      if (game.type === "snake") {
        if (state.messageKey === "hintObjective") state.message = `${copy(locale, "hint")}: ${copy(locale, game.objective)}`;
        else if (state.messageKey === "snakeReady") state.message = SNAKE_READY[locale] || SNAKE_READY.en;
        else if (state.messageKey === "snakeObstacleCue") state.message = SNAKE_OBSTACLE_CUE[locale] || SNAKE_OBSTACLE_CUE.en;
        else if (state.messageKey === "snakeFoodRoute") state.message = (SNAKE_ROUTE_CUE[locale] || SNAKE_ROUTE_CUE.en).status;
        else if (state.messageKey === "snakeRunning") state.message = snakeInstruction(locale);
        else if (state.messageKey === "snakeFood") state.message = snakeCopy(locale, "collected", state.food);
        else if (state.messageKey === "snakeMilestone") state.message = snakeCopy(locale, "milestone", state.food);
      }
      if (game.type === "wordle" && state.messageKey === "wordleHint") state.message = wordleHint(locale, state.target[0]);
      if (game.type === "hangman") {
        if (state.messageKey === "hangmanHint") state.message = hangmanHint(locale, state.target.length, state.theme);
        else if (state.messageKey === "hangmanMiss") state.message = hangmanMiss(locale, state.lastLetter, state.misses);
        else if (state.messageKey === "hangmanUsed") state.message = `${state.lastLetter}: ${hangmanAlreadyUsed(locale)}`;
      }
      if (game.type === "mahjong" && state.messageKey === "mahjongMismatch") {
        state.message = (MAHJONG_MISMATCH_COPY[locale] || MAHJONG_MISMATCH_COPY.en)(state.mismatchTile);
      }
      if (game.type === "tetris" && state.messageKey === "tetrisLineClear") {
        state.message = tetrisLineClearCopy(locale, state.lines);
      }
      if (game.type === "tetris" && state.messageKey === "tetrisProgress") {
        state.message = tetrisProgressCopy(locale, state.lines);
      }
      if (game.type === "tetris" && state.messageKey === "tetrisHint") {
        state.message = tetrisHintCopy(locale, state);
      }
      if (game.type === "checkers" && state.messageKey === "checkersPromotion") {
        state.message = checkersPromotionCopy(locale, "next");
      }
      if (game.type === "breakout" && state.messageKey === "breakoutAim") {
        const targetIndex = breakoutTargetIndex(state);
        state.message = targetIndex >= 0 ? breakoutAimCopy(locale, state.paddle + 1) : breakoutEmptyCopy(locale, state.paddle + 1);
      } else if (game.type === "breakout" && state.messageKey === "breakoutMiss") {
        state.message = breakoutEmptyCopy(locale, state.paddle + 1);
      }
      renderShell();
      if (document.body.dataset.screen === "result") renderResult();
      render();
    };
    els.locale.addEventListener("change", persistLocale);
    const announce = (message, tone = "", messageKey = "") => { state.message = message; state.tone = tone; state.messageKey = messageKey; els.message.textContent = message; els.message.dataset.tone = tone; };
    const show = (screen) => { els.main.hidden = screen !== "main"; els.battle.hidden = screen !== "battle"; els.result.hidden = screen !== "result"; document.body.dataset.screen = screen; document.documentElement.classList.toggle("popular-checkers-active", game.type === "checkers" && screen !== "main"); document.documentElement.classList.toggle("popular-tic-tac-toe-active", game.type === "tic" && screen !== "main"); document.documentElement.classList.toggle("popular-breakout-active", game.type === "breakout" && screen !== "main"); document.documentElement.classList.toggle("popular-chess-active", game.type === "chess" && screen !== "main"); window.dispatchEvent(new Event("weightplay:shell-sync")); if (game.type === "tetris" && screen !== "main") window.scrollTo({ top: 0, left: 0, behavior: "auto" }); if (game.type === "breakout" && screen !== "main") window.scrollTo({ top: 0, left: 0, behavior: "auto" }); };
    let snakeTimer = null;
    let ticResultTimer = null;
    let ticReplyTimer = null;
    const stopTicResultTimer = () => { if (ticResultTimer) { window.clearTimeout(ticResultTimer); ticResultTimer = null; } };
    const stopTicReplyTimer = () => { if (ticReplyTimer) { window.clearTimeout(ticReplyTimer); ticReplyTimer = null; } };
    let snakeFlashTimer = null;
    let snakeRouteCueTimer = null;
    let snakeMilestoneTimer = null;
    const stopSnakeTimer = () => { if (snakeTimer) { window.clearTimeout(snakeTimer); snakeTimer = null; } if (snakeFlashTimer) { window.clearTimeout(snakeFlashTimer); snakeFlashTimer = null; } if (snakeRouteCueTimer) { window.clearTimeout(snakeRouteCueTimer); snakeRouteCueTimer = null; } if (snakeMilestoneTimer) { window.clearTimeout(snakeMilestoneTimer); snakeMilestoneTimer = null; } };
    const nextSnakeRunNumber = () => {
      const runKey = `${key(gameId)}_runs`;
      let runNumber = 0;
      try { runNumber = Number(localStorage.getItem(runKey) || 0) + 1; localStorage.setItem(runKey, String(runNumber)); } catch { runNumber = 1; }
      return Math.max(1, runNumber);
    };
    const snakeTickMs = () => Math.max(180, SNAKE_TICK_MS - state.food * 20);
    const snakeGoalLabel = () => state.milestoneReached ? snakeCopy(locale, "nextGoal", state.goalFood + 2) : snakeCopy(locale, "goal", state.goalFood);
    const start = (entry = "start") => { stopSnakeTimer(); stopTicResultTimer(); stopTicReplyTimer(); const previousHangman = game.type === "hangman" ? { target: state.target, theme: state.theme } : null; const previousMahjongKey = game.type === "mahjong" ? state.layoutKey : ""; const previousWordle = game.type === "wordle" ? { target: state.target, wordKey: state.wordKey } : null; state = makeState(game.type); if (game.type === "hangman") { const round = entry === "restart" && previousHangman ? previousHangman : HANGMAN_WORDS[hangmanRoundIndex++ % HANGMAN_WORDS.length]; Object.assign(state, round); } if (game.type === "mahjong") { const layout = entry === "restart" && previousMahjongKey ? MAHJONG_LAYOUTS.find((candidate) => candidate.key === previousMahjongKey) || MAHJONG_LAYOUTS[0] : MAHJONG_LAYOUTS[mahjongRoundIndex++ % MAHJONG_LAYOUTS.length]; state.tiles = [...layout.tiles]; state.layoutKey = layout.key; } if (game.type === "wordle") { const word = entry === "restart" && previousWordle ? previousWordle : WORDLE_WORDS[wordleRoundIndex++ % WORDLE_WORDS.length]; Object.assign(state, word); } checkersSeenTargets.clear(); checkersPromotionCueTracked = false; if (game.type === "snake") { state.runNumber = nextSnakeRunNumber(); state.goalFood = snakeGoalForRun(state.runNumber); state.modeKey = snakeModeForRun(state.runNumber); state.obstacles = snakeObstaclesForMode(state.modeKey); state.foodCell = chooseSnakeFood(state.trail, state.obstacles); } show("battle"); trackCheckers("game_start", { entry }); const snakeReadyCue = game.type === "snake" && ["gates", "orbit"].includes(state.modeKey); const breakoutReadyCue = game.type === "breakout" ? breakoutAimCopy(locale, breakoutTargetIndex(state) % 6 + 1) : ""; const tetrisReadyCue = game.type === "tetris" ? tetrisProgressCopy(locale, state.lines) : ""; announce(game.type === "snake" ? (snakeReadyCue ? (SNAKE_OBSTACLE_CUE[locale] || SNAKE_OBSTACLE_CUE.en) : (SNAKE_READY[locale] || SNAKE_READY.en)) : game.type === "checkers" ? "" : game.type === "breakout" ? breakoutReadyCue : game.type === "tetris" ? tetrisReadyCue : copy(locale, "ready"), "", game.type === "snake" ? (snakeReadyCue ? "snakeObstacleCue" : "snakeReady") : game.type === "checkers" ? "" : game.type === "breakout" ? "breakoutAim" : game.type === "tetris" ? "tetrisProgress" : "ready"); render(); };
    const renderResult = () => { const best = Number(localStorage.getItem(key(gameId)) || 0); const ticOutcome = TIC_OUTCOME_COPY[locale] || TIC_OUTCOME_COPY.en; els.resultTitle.textContent = game.type === "tic" && state.outcome ? ticOutcome[`${state.outcome}Title`] : state.success ? copy(locale, "success") : copy(locale, "failure"); const baseCopy = game.type === "tic" && state.outcome ? ticOutcome[`${state.outcome}Copy`] : state.success ? (game.type === "checkers" ? checkersPromotionCopy(locale, "result") : copy(locale, "successCopy")) : copy(locale, "failureCopy"); els.resultCopy.textContent = game.type === "wordle" ? `${baseCopy} ${(WORDLE_RESULT_COPY[locale] || WORDLE_RESULT_COPY.en)(state.target)}` : game.type === "hangman" ? `${baseCopy} ${(HANGMAN_RESULT_COPY[locale] || HANGMAN_RESULT_COPY.en)(state.target)}` : game.type === "mahjong" ? `${baseCopy} ${MAHJONG_RESULT_COPY[locale] || MAHJONG_RESULT_COPY.en}` : baseCopy; els.result.dataset.outcome = game.type === "tic" ? state.outcome : state.success ? "win" : "loss"; els.resultStats.innerHTML = `<span class="stat">${copy(locale, "score")}<strong>${state.score}</strong></span><span class="stat">${copy(locale, "moves")}<strong>${state.moves}</strong></span><span class="stat">${copy(locale, "best")}<strong>${Math.max(best, state.score)}</strong></span>`; if (els.resultGoal) { els.resultGoal.hidden = game.type !== "breakout"; if (game.type === "breakout") els.resultGoal.textContent = breakoutResultGoalCopy(locale, state.shots); } };
    const finish = (success) => { if (state.done) return; stopSnakeTimer(); stopTicResultTimer(); stopTicReplyTimer(); state.done = true; state.success = success; state.score = success ? Math.max(state.score, state.moves * 10 + 100) : state.score; const best = Number(localStorage.getItem(key(gameId)) || 0); if ((game.type === "snake" || success) && state.score > best) { try { localStorage.setItem(key(gameId), String(state.score)); } catch {} } if (game.type === "checkers" && success) trackCheckers("promotion_result", { score: state.score }); if (game.type === "tic" && state.winningCells?.length === 3) { show("battle"); ticResultTimer = window.setTimeout(() => { ticResultTimer = null; if (!state.done) return; renderResult(); show("result"); }, 520); return; } renderResult(); show("result"); };
    const moveSnake = () => {
      if (game.type !== "snake" || state.done || !state.started) return;
      const [dx, dy] = SNAKE_DELTAS[state.direction];
      const head = state.trail[0];
      const headX = head % SNAKE_GRID_SIZE;
      const headY = Math.floor(head / SNAKE_GRID_SIZE);
      const nextX = (headX + dx + SNAKE_GRID_SIZE) % SNAKE_GRID_SIZE;
      const nextY = (headY + dy + SNAKE_GRID_SIZE) % SNAKE_GRID_SIZE;
      const next = nextY * SNAKE_GRID_SIZE + nextX;
      state.moves += 1;
      const eats = next === state.foodCell;
      const hitsBody = state.trail.includes(next) && !(next === state.trail[state.trail.length - 1] && !eats);
      const hitsObstacle = state.obstacles.includes(next);
      if (hitsBody || hitsObstacle) { state.trail = [next, ...state.trail]; finish(false); return; }
      state.trail = [next, ...state.trail];
      if (eats) {
        state.food += 1;
        state.foodFlashCell = next;
        if (!state.milestoneReached && state.food >= state.goalFood) {
          state.milestoneReached = true;
          state.milestoneCueActive = true;
          announce(snakeCopy(locale, "milestone", state.food), "good", "snakeMilestone");
          if (snakeMilestoneTimer) window.clearTimeout(snakeMilestoneTimer);
          snakeMilestoneTimer = window.setTimeout(() => {
            snakeMilestoneTimer = null;
            state.milestoneCueActive = false;
            if (state.messageKey === "snakeMilestone") {
              state.message = snakeInstruction(locale);
              state.messageKey = "snakeRunning";
              state.tone = "";
            }
            if (!state.done) render();
          }, 1800);
        } else {
          announce(snakeCopy(locale, "collected", state.food), "good", "snakeFood");
        }
        state.score = state.food * 10 + (state.milestoneReached ? 20 : 0);
        state.foodCell = chooseSnakeFood(state.trail, state.obstacles);
        state.foodCueCell = state.foodCell;
        if (state.messageKey !== "snakeMilestone") {
          announce((SNAKE_ROUTE_CUE[locale] || SNAKE_ROUTE_CUE.en).status, "", "snakeFoodRoute");
        }
        if (snakeFlashTimer) window.clearTimeout(snakeFlashTimer);
        snakeFlashTimer = window.setTimeout(() => { state.foodFlashCell = -1; if (!state.done) render(); }, 520);
        if (snakeRouteCueTimer) window.clearTimeout(snakeRouteCueTimer);
        snakeRouteCueTimer = window.setTimeout(() => {
          snakeRouteCueTimer = null;
          state.foodCueCell = -1;
          if (state.messageKey === "snakeFoodRoute") {
            state.message = snakeInstruction(locale);
            state.messageKey = "snakeRunning";
            state.tone = "";
          }
          if (!state.done) render();
        }, 1100);
      }
      else state.trail.pop();
      render();
    };
    const scheduleSnakeTick = () => { if (game.type === "snake" && state.started && !state.done) snakeTimer = window.setTimeout(() => { moveSnake(); scheduleSnakeTick(); }, snakeTickMs()); };
    const beginSnake = (direction = state.direction) => {
      if (game.type !== "snake" || state.done || state.started) return;
      state.direction = direction;
      // The ready screen lets the player choose any of the four directions.
      // Rotate the short starting trail to match that first choice so a
      // valid-looking Down tap cannot immediately drive into the body that
      // was rendered for the default Up direction.
      state.trail = snakeTrailForDirection(direction);
      if (state.trail.includes(state.foodCell)) state.foodCell = chooseSnakeFood(state.trail, state.obstacles);
      state.started = true;
      announce(snakeInstruction(locale), "", "snakeRunning");
      render();
      scheduleSnakeTick();
    };
    const action = (name, value) => {
      if (state.done) return;
      if (game.type === "tic" && (name !== "cell" || !Number.isInteger(value) || value < 0 || value >= state.cells.length || state.cells[value] !== "")) return;
      if (game.type === "hangman" && name === "letter" && state.letters.includes(value)) { state.focusLetter = value; state.lastLetter = value; announce(`${value}: ${hangmanAlreadyUsed(locale)}`, "warn", "hangmanUsed"); render(); return; }
      if (game.type === "snake") {
        if (!["left", "right", "up", "down"].includes(name)) return;
        if (!state.started) { beginSnake(name); return; }
        if (SNAKE_OPPOSITE[state.direction] === name) { announce(`${copy(locale, "hint")}: ${copy(locale, "choose")} ${copy(locale, name)}`, "warn", "hintObjective"); render(); return; }
        state.foodCueCell = -1;
        if (snakeRouteCueTimer) { window.clearTimeout(snakeRouteCueTimer); snakeRouteCueTimer = null; }
        state.direction = name;
        if (state.messageKey !== "snakeMilestone") {
          state.message = "";
          state.messageKey = "";
          state.tone = "";
        }
        render();
        return;
      }
      state.moves += 1;
      if (game.type === "tetris") {
        if (name === "left") state.active = Math.max(0, state.active - 1);
        if (name === "right") state.active = Math.min(7, state.active + 1);
        if (name === "rotate") state.score += 5;
        if (name === "drop") {
          const previousLines = state.lines;
          state.pieces += 1;
          state.lines = Math.min(4, Math.floor(state.pieces / 2));
          state.blocks.push({ x: state.active, y: 7 - (state.pieces % 7) });
          if (state.lines > previousLines && state.lines < 4) announce(tetrisLineClearCopy(locale, state.lines), "good", "tetrisLineClear");
          else if (state.lines < 4) announce(tetrisProgressCopy(locale, state.lines), "", "tetrisProgress");
          if (state.lines >= 4) finish(true);
        } else {
          announce(tetrisProgressCopy(locale, state.lines), "", "tetrisProgress");
        }
      } else if (game.type === "tic") {
        if (name === "cell" && state.cells[value] === "") {
          stopTicReplyTimer();
          state.rivalCell = -1;
          state.message = "";
          state.messageKey = "";
          state.tone = "";
          state.cells[value] = "X";
          state.playerMoves += 1;
          state.score += 20;
          const playerLine = ticWinningLine(state.cells, "X");
          if (playerLine.length === 3) {
            state.winningCells = playerLine;
            state.outcome = "win";
            finish(true);
          } else if (state.cells.every(Boolean)) {
            state.outcome = "draw";
            finish(false);
          } else {
            const rivalMove = ticRivalMove(state.cells);
            if (rivalMove >= 0) {
              state.cells[rivalMove] = "O";
              state.aiMoves += 1;
              const rivalLine = ticWinningLine(state.cells, "O");
              if (rivalLine.length === 3) {
                state.winningCells = rivalLine;
                state.outcome = "loss";
                finish(false);
              } else if (state.cells.every(Boolean)) {
                state.outcome = "draw";
                finish(false);
              } else {
                state.rivalCell = rivalMove;
                announce(ticRivalReplyCopy(locale, rivalMove), "good", "ticRivalReply");
                ticReplyTimer = window.setTimeout(() => {
                  ticReplyTimer = null;
                  if (state.done || state.rivalCell !== rivalMove) return;
                  state.rivalCell = -1;
                  if (state.messageKey === "ticRivalReply") {
                    state.message = "";
                    state.messageKey = "";
                    state.tone = "";
                  }
                  render();
                }, 760);
              }
            }
          }
        }
      } else if (game.type === "chess") { if (name === "move") { state.step += 1; state.score += 30; if (state.step >= 3) finish(true); }
       } else if (game.type === "checkers") { if (name === "move") { state.step += 1; state.score += 20; trackCheckers("move_selected", { step: state.step }); if (state.step >= 5) finish(true); else if (state.step === 4) { if (!checkersPromotionCueTracked) { checkersPromotionCueTracked = true; trackCheckers("promotion_cue_seen", { step: state.step }); } announce(checkersPromotionCopy(locale, "next"), "good", "checkersPromotion"); } }
      } else if (game.type === "mahjong") { if (name === "tile" && state.tiles[value]) { if (state.selected < 0) { state.selected = value; state.mismatchTile = ""; state.focusTile = value; announce(mahjongTileLabel(locale, value, state.tiles[value], true)); } else if (state.selected !== value && state.tiles[state.selected] === state.tiles[value]) { state.tiles[state.selected] = ""; state.tiles[value] = ""; state.matched += 1; state.score += 30; state.selected = -1; state.mismatchTile = ""; state.focusTile = state.tiles.findIndex(Boolean); announce(copy(locale, "matched"), "good"); if (state.matched >= 6) { state.focusTile = -1; finish(true); } } else { if (state.selected !== value) { state.moves -= 1; state.mismatchTile = state.tiles[value]; announce((MAHJONG_MISMATCH_COPY[locale] || MAHJONG_MISMATCH_COPY.en)(state.mismatchTile), "warn", "mahjongMismatch"); } state.selected = value; state.focusTile = value; } }
      } else if (game.type === "wordle") { if (name === "submit") { const inputNode = document.querySelector("#wordInput"); const input = String(inputNode?.value || "").trim().toUpperCase(); if (!/^[A-Z]{5}$/.test(input)) { state.moves -= 1; announce(wordleLengthError(locale), "warn"); inputNode?.focus(); return; } state.guesses.push(input); state.score += input === state.target ? 100 : 10; if (input === state.target) finish(true); else if (state.guesses.length >= 6) finish(false); else announce(copy(locale, "next"), ""); }
      } else if (game.type === "hangman") { if (name === "letter") { state.letters.push(value); state.focusLetter = value; state.lastLetter = value; if (!state.target.includes(value)) { state.misses += 1; if (state.misses < 6) announce(hangmanMiss(locale, value, state.misses), "warn", "hangmanMiss"); } else state.score += 15; if ([...state.target].every((letter) => state.letters.includes(letter))) finish(true); else if (state.misses >= 6) finish(false); }
      } else if (game.type === "breakout") { if (name === "left") state.paddle = Math.max(0, state.paddle - 1); if (name === "right") state.paddle = Math.min(5, state.paddle + 1); if (["left", "right"].includes(name)) { state.message = ""; state.messageKey = ""; state.tone = ""; } if (name === "fire") { state.shots += 1; const index = breakoutTargetIndex(state); if (index >= 0) { state.bricks[index] = false; state.score += 20; state.message = ""; state.messageKey = ""; state.tone = ""; if (state.bricks.every((brick) => !brick)) finish(true); } else announce(breakoutEmptyCopy(locale, state.paddle + 1), "warn", "breakoutMiss"); }
      } else if (game.type === "pong") {
        if (name === "left") state.paddle = Math.max(0, state.paddle - 1);
        if (name === "right") state.paddle = Math.min(5, state.paddle + 1);
        if (["left", "right"].includes(name)) { state.message = ""; state.messageKey = ""; state.tone = ""; }
        if (name === "serve") {
          const aligned = state.paddle === state.pongTarget;
          const settledRally = state.rallies + 1;
          state.rallies = settledRally;
          if (aligned) state.score += 25;
          state.message = "";
          state.messageKey = aligned ? "pongHit" : "pongMiss";
          state.tone = aligned ? "good" : "warn";
          if (settledRally >= 5) finish(aligned && state.score === 125);
          else state.pongTarget = pongTargetForRally(settledRally);
        }
      }
      render();
    };
    const hint = () => { if (game.type === "wordle") announce(wordleHint(locale, state.target[0]), "warn", "wordleHint"); else if (game.type === "hangman") announce(hangmanHint(locale, state.target.length, state.theme), "warn", "hangmanHint"); else if (game.type === "mahjong") announce(`${copy(locale, "hint")}: match identical symbols.`, "warn"); else if (game.type === "tetris") announce(tetrisHintCopy(locale, state), "warn", "tetrisHint"); else announce(`${copy(locale, "hint")}: ${copy(locale, game.objective)}`, "warn", game.type === "snake" ? "hintObjective" : ""); render(); };
    const shell = () => { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.title = `${title(locale, gameId)} | WeightPlay`; if (game.type === "checkers") document.querySelector('meta[name="description"]')?.setAttribute("content", checkersMetaDescription(locale)); if (game.type === "breakout") document.querySelector('meta[name="description"]')?.setAttribute("content", breakoutMetaDescription(locale)); els.eyebrow.textContent = copy(locale, "eyebrow"); els.title.textContent = title(locale, gameId); els.tagline.textContent = copy(locale, "tagline"); els.objective.innerHTML = `<strong>${copy(locale, "objective")}:</strong> ${copy(locale, game.objective)}`; els.instruction.textContent = game.type === "snake" ? snakeInstruction(locale) : copy(locale, "ready"); document.querySelector("#languageLabel").textContent = copy(locale, "language"); document.querySelector("#footerText").textContent = `${title(locale, gameId)} · ${copy(locale, "eyebrow")}`; if (game.type === "snake") { const shellCopy = SNAKE_SHELL_COPY[locale] || SNAKE_SHELL_COPY.en; document.querySelector('[data-wp-return="battle"]')?.setAttribute("aria-label", shellCopy.battleBack); document.querySelector('[data-wp-return="main"]')?.setAttribute("aria-label", shellCopy.mainBack); } };
    const button = (label, name, extra = "") => `<button type="button" class="control ${extra}" data-action="${name}">${label}</button>`;
    const renderBoard = () => {
      if (game.type === "snake") { const foodCell = state.foodCell; const routeCueCell = state.foodCueCell; const routeCueLabel = (SNAKE_ROUTE_CUE[locale] || SNAKE_ROUTE_CUE.en).cell; const cells = Array.from({ length: SNAKE_GRID_SIZE * SNAKE_GRID_SIZE }, (_, i) => `<span class="grid-cell ${state.trail.includes(i) ? "filled" : ""} ${i === state.trail[0] ? "snake-head" : ""} ${i === foodCell ? "food" : ""} ${i === routeCueCell ? "food-route-cue" : ""} ${state.obstacles.includes(i) ? "obstacle" : ""} ${i === state.foodFlashCell ? "food-hit" : ""}" data-cell="${i}"${state.obstacles.includes(i) ? ` aria-label="${snakeModeLabel(locale, state.modeKey)}"` : ""}${i === routeCueCell ? ` aria-label="${routeCueLabel}" data-food-route-cue="true"` : ""}></span>`).join(""); els.board.innerHTML = `<div class="grid-board snake-grid ${state.milestoneReached ? "milestone-pulse" : ""} ${state.milestoneCueActive ? "milestone-cue" : ""}" role="grid" aria-label="${copy(locale, game.objective)}" data-grid-size="${SNAKE_GRID_SIZE}" data-tick-ms="${snakeTickMs()}" data-head-cell="${state.trail[0]}" data-food-cell="${foodCell}" data-food-route-cue-cell="${routeCueCell}" data-food-count="${state.food}" data-score="${state.score}" data-run="${state.runNumber}" data-mode="${state.modeKey}" data-mode-label="${snakeModeLabel(locale, state.modeKey)}" data-obstacles="${state.obstacles.join(",")}" data-goal-food="${state.goalFood}" data-milestone-reached="${state.milestoneReached}" data-milestone-cue="${state.milestoneCueActive}" data-direction="${state.direction}" data-moves="${state.moves}" data-trail="${state.trail.join(",")}">${cells}</div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "up"), "up")}</div><div class="control-row">${button(copy(locale, "left"), "left")}${button(copy(locale, "down"), "down")}${button(copy(locale, "right"), "right")}</div>`; return; }
      if (game.type === "tetris") { const cells = Array.from({ length: 64 }, (_, i) => { const block = state.blocks.some((b) => b.x + b.y * 8 === i); const active = i === state.active; return `<span class="grid-cell ${block ? "filled" : ""} ${active ? "active" : ""}"></span>`; }).join(""); els.board.innerHTML = `<div class="grid-board tetris-grid">${cells}</div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "left"), "left")}${button(copy(locale, "rotate"), "rotate")}${button(copy(locale, "right"), "right")}${button(copy(locale, "drop"), "drop", "primary")}</div>`;
      } else if (game.type === "tic") { els.board.innerHTML = `<div class="tic-board" data-winning-count="${state.winningCells?.length || 0}" data-outcome="${state.outcome}">${state.cells.map((cell, i) => { const winning = state.winningCells?.includes(i); const rivalReply = state.rivalCell === i; return `<button class="tic-cell${winning ? " winning" : ""}${rivalReply ? " rival-reply" : ""}" data-action="cell" data-value="${i}"${winning ? " data-winning-cell=\"true\"" : ""}${rivalReply ? " data-rival-reply=\"true\"" : ""} aria-label="${ticCellLabel(locale, i, cell, winning)}"${cell || state.done ? " disabled" : ""}>${cell}</button>`; }).join("")}</div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "hint"), "hint")}</div>`;
      } else if (game.type === "chess") { const pieces = ["♜", "♟", "", "♚", "", "♙", "", "", "", "", "♙", "", "", "", "", "♔"]; els.board.innerHTML = `<div class="chess-board" role="group" aria-label="${copy(locale, "chess")}">${pieces.map((piece, i) => { const target = i === 6 + state.step; return `<button class="chess-cell ${target ? "target" : ""}" data-action="move" data-cell="${i}"${target ? " data-target=\"true\"" : ""} aria-label="${chessCellLabel(locale, i, piece, target)}">${piece}</button>`; }).join("")}</div>`; els.controls.innerHTML = `<div class="control-row">${button(`${copy(locale, "select")} ${state.step + 1}`, "move", "primary")}</div>`;
      } else if (game.type === "checkers") { const nextTarget = state.step < 5 ? 30 - (state.step + 1) * 5 : -1; els.board.innerHTML = `<div class="checkers-board">${Array.from({ length: 36 }, (_, i) => `<div class="checker-cell${i === nextTarget ? " target" : ""}" data-cell="${i}"${i === nextTarget ? ` aria-label="${checkersMoveCoachCopy(locale)}" data-target="true"` : ""}>${i === 30 - state.step * 5 ? "<span class=\"checker-piece\"></span>" : i === 5 ? "<span class=\"checker-piece enemy\"></span>" : ""}</div>`).join("")}</div>`; els.controls.innerHTML = `<div class="control-row">${button(`${copy(locale, "select")} ${state.step + 1}`, "move", "primary")}</div>`;
      } else if (game.type === "mahjong") { els.board.innerHTML = `<div class="tile-board" data-layout-key="${state.layoutKey}">${state.tiles.map((tile, i) => tile ? `<button class="tile ${state.selected === i ? "selected" : ""}" data-action="tile" data-value="${i}" data-symbol="${tile}" aria-label="${mahjongTileLabel(locale, i, tile, state.selected === i)}" aria-pressed="${state.selected === i}">${tile}</button>` : "").join("")}</div>`; els.controls.innerHTML = `<div class="control-row"><span class="round-label" role="status" aria-live="polite" aria-atomic="true">${copy(locale, "remaining")}: ${6 - state.matched}</span></div>`;
      } else if (game.type === "wordle") { const labels = WORDLE_CELL_COPY[locale] || WORDLE_CELL_COPY.en; els.board.innerHTML = `<div class="wordle-board" role="table" aria-label="${wordleEscape(labels.board)}" data-word-key="${state.wordKey}">${Array.from({ length: 6 }, (_, row) => `<div class="wordle-row" role="row" aria-rowindex="${row + 1}">${Array.from({ length: 5 }, (_, col) => { const guess = state.guesses[row] || ""; const letter = guess[col] || ""; const tone = letter && letter === state.target[col] ? "hit" : letter && state.target.includes(letter) ? "near" : letter ? "miss" : ""; const safeLetter = wordleEscape(letter); const ariaLabel = wordleEscape(wordleCellLabel(locale, row + 1, col + 1, letter, tone)); return `<span class="word-cell ${tone}" role="cell" aria-colindex="${col + 1}" aria-label="${ariaLabel}" data-word-state="${tone || "empty"}">${safeLetter}</span>`; }).join("")}</div>`).join("")}</div>`; els.controls.innerHTML = `<div class="word-entry"><input id="wordInput" maxlength="5" aria-label="${copy(locale, "wordle")}" autocomplete="off" /><button class="primary" data-action="submit">${copy(locale, "submit")}</button></div>`;
      } else if (game.type === "hangman") { const word = [...state.target].map((letter) => state.letters.includes(letter) ? letter : "_ ").join(""); els.board.innerHTML = `<div class="hangman-word" data-word-key="${state.theme}" style="font-size:clamp(2rem,8vw,4rem);letter-spacing:.2em;text-align:center">${word}</div><p class="round-label">${copy(locale, "misses")}: ${state.misses}/6</p>`; els.controls.innerHTML = `<div class="letters">${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => { const used = state.letters.includes(letter); return `<button class="letter ${used ? "used" : ""}" data-action="letter" data-value="${letter}" aria-pressed="${used}" aria-label="${used ? `${letter}, ${hangmanAlreadyUsed(locale)}` : letter}">${letter}</button>`; }).join("")}</div>`;
      } else if (game.type === "breakout") { const targetIndex = breakoutTargetIndex(state); const targetColumn = state.paddle; const aimCopy = targetIndex >= 0 ? breakoutAimCopy(locale, targetColumn + 1) : breakoutEmptyCopy(locale, targetColumn + 1); els.board.innerHTML = `<div class="brick-board" data-shot-column="${targetColumn + 1}" data-shot-count="${state.shots}" data-lane-state="${targetIndex >= 0 ? "armed" : "clear"}">${state.bricks.map((brick, index) => `<span class="brick ${brick ? "" : "cleared"} ${index === targetIndex ? "target" : ""}" data-index="${index}"${index === targetIndex ? ` data-shot-target="true" aria-label="${aimCopy}"` : ""}></span>`).join("")}</div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "left"), "left")}${button(copy(locale, "right"), "right")}${button(copy(locale, "serve"), "fire", "primary")}</div>`;
      } else if (game.type === "pong") { const targetPosition = pongLanePosition(state.pongTarget); const settledRally = ["pongHit", "pongMiss"].includes(state.messageKey); const visibleRally = settledRally ? state.rallies : Math.min(state.rallies + 1, 5); els.board.innerHTML = `<div class="pong-board" data-pong-rally="${visibleRally}" data-pong-target-lane="${state.pongTarget}" data-pong-paddle-lane="${state.paddle}"><span class="pong-ball" style="left:${targetPosition}%" aria-hidden="true"></span><span class="pong-paddle" style="left:${pongLanePosition(state.paddle)}%" aria-hidden="true"></span></div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "left"), "left")}${button(copy(locale, "serve"), "serve", "primary")}${button(copy(locale, "right"), "right")}</div>`; }
    };
    let snakePointerActionUntil = 0;
    const runActionNode = (node) => { if (!node || node.disabled) return; if (node.dataset.action === "hint") { hint(); return; } const value = node.dataset.action === "letter" ? node.dataset.value : node.dataset.value === undefined ? undefined : Number(node.dataset.value); action(node.dataset.action, value); };
    const handleActionClick = (event) => { const node = event.target?.closest?.("[data-action]"); if (!node || (!els.controls.contains(node) && !els.board.contains(node)) || node.disabled) return; if (game.type === "snake" && performance.now() < snakePointerActionUntil) return; runActionNode(node); };
    const render = () => { els.round.textContent = game.type === "snake" ? `${snakeCopy(locale, "run", state.runNumber)} · ${snakeModeLabel(locale, state.modeKey)} · ${snakeGoalLabel()} · ${copy(locale, "score")}: ${state.score} · ${copy(locale, "moves")}: ${state.moves}` : `${copy(locale, "round")} · ${copy(locale, "score")}: ${state.score} · ${copy(locale, "moves")}: ${state.moves}`; renderBoard(); const breakoutTarget = game.type === "breakout" ? breakoutTargetIndex(state) : -1; const defaultMessage = game.type === "checkers" ? checkersMoveCoachCopy(locale) : game.type === "snake" ? (state.started ? snakeInstruction(locale) : (SNAKE_READY[locale] || SNAKE_READY.en)) : game.type === "breakout" ? (breakoutTarget >= 0 ? breakoutAimCopy(locale, state.paddle + 1) : breakoutEmptyCopy(locale, state.paddle + 1)) : copy(locale, "ready"); const liveMessage = game.type === "tic" && state.messageKey === "ticRivalReply" && state.rivalCell >= 0 ? ticRivalReplyCopy(locale, state.rivalCell) : state.message; els.message.textContent = liveMessage || defaultMessage; els.message.dataset.tone = state.tone; els.message.dataset.messageKey = state.messageKey || ""; if (game.type === "checkers" && document.body.dataset.screen === "battle" && !checkersSeenTargets.has(state.step)) { checkersSeenTargets.add(state.step); trackCheckers("move_target_seen", { step: state.step + 1 }); } if (game.type === "mahjong") { if (state.messageKey === "mahjongMismatch") els.message.dataset.mahjongMismatch = "true"; else delete els.message.dataset.mahjongMismatch; } if (game.type === "mahjong" && document.body.dataset.screen === "battle" && state.focusTile >= 0) { const focusTarget = els.board.querySelector(`[data-action="tile"][data-value="${state.focusTile}"]`); if (focusTarget) focusTarget.focus(); state.focusTile = -1; } if (game.type === "hangman" && document.body.dataset.screen === "battle" && state.focusLetter) { const focusTarget = els.controls.querySelector(`[data-action="letter"][data-value="${state.focusLetter}"]`); if (focusTarget) focusTarget.focus(); state.focusLetter = ""; } };
    let snakePointerStart = null;
    els.board.addEventListener("pointerdown", (event) => { if (game.type === "snake" && document.body.dataset.screen === "battle") snakePointerStart = { x: event.clientX, y: event.clientY }; });
    els.board.addEventListener("pointerup", (event) => { if (game.type !== "snake" || document.body.dataset.screen !== "battle") return; const startPoint = snakePointerStart; snakePointerStart = null; if (!startPoint) return; const deltaX = event.clientX - startPoint.x; const deltaY = event.clientY - startPoint.y; if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 18) { beginSnake(); return; } action(Math.abs(deltaX) > Math.abs(deltaY) ? (deltaX > 0 ? "right" : "left") : (deltaY > 0 ? "down" : "up")); });
    els.board.addEventListener("pointercancel", () => { snakePointerStart = null; });
    els.controls.addEventListener("pointerdown", (event) => {
      if (game.type !== "snake" || event.button !== undefined && event.button !== 0) return;
      const node = event.target?.closest?.("[data-action]");
      if (!node || !els.controls.contains(node) || node.disabled) return;
      event.preventDefault();
      snakePointerActionUntil = performance.now() + (event.pointerType === "touch" ? 800 : 120);
      runActionNode(node);
    });
    els.controls.addEventListener("click", handleActionClick);
    els.board.addEventListener("click", handleActionClick);
    const renderShell = () => { shell(); els.start.textContent = copy(locale, "start"); els.hint.textContent = copy(locale, "hint"); els.restart.textContent = copy(locale, "restart"); els.retry.textContent = copy(locale, "retry"); els.home.textContent = copy(locale, "home"); };
    els.start.addEventListener("click", () => start("start")); els.retry.addEventListener("click", () => { trackCheckers("replay", { from: "result" }); start("retry"); }); els.home.addEventListener("click", () => { trackCheckers("main_return", { from: "result" }); stopSnakeTimer(); stopTicResultTimer(); show("main"); state = makeState(game.type); render(); }); els.hint.addEventListener("click", hint); els.restart.addEventListener("click", () => start("restart"));
    document.addEventListener("keydown", (event) => { if (document.body.dataset.screen !== "battle") return; if (game.type === "snake" && !state.started && [" ", "Enter"].includes(event.key)) { event.preventDefault(); beginSnake(); return; } const visibleTetrisControl = tetrisFocusedControl?.isConnected && tetrisFocusedControl.getClientRects().length ? tetrisFocusedControl : null; if (game.type === "tetris" && event.key === " " && visibleTetrisControl) { event.preventDefault(); visibleTetrisControl.click(); return; } const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", a: "left", A: "left", d: "right", D: "right", w: "up", W: "up", s: "down", S: "down", " ": "drop" }; if (map[event.key] && ["tetris", "snake", "breakout", "pong"].includes(game.type)) { event.preventDefault(); action(map[event.key]); } });
    const battleBack = document.querySelector('[data-wp-return="battle"]');
    battleBack?.addEventListener("click", () => { trackCheckers("main_return", { from: "battle" }); stopSnakeTimer(); stopTicResultTimer(); show("main"); state = makeState(game.type); render(); });
    renderShell(); show("main"); render();
  }

  window.WPPopularArcade = { mount, catalog: CATALOG, locales: LOCALES };
})();
