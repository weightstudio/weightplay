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
  const HANGMAN_ALREADY_USED = { en: "Already used", "zh-Hant": "已經使用", "zh-Hans": "已经使用", ja: "使用済み", ko: "이미 사용함", es: "Ya usada", "pt-BR": "Já usada", fr: "Déjà utilisée", de: "Bereits verwendet", it: "Già usata", ru: "Уже использована", hi: "पहले ही उपयोग किया गया", ar: "مستخدم بالفعل" };
  const TETRIS_LINE_CLEAR_COPY = { en: "Line cleared! Keep going.", "zh-Hant": "消除一行！繼續挑戰。", "zh-Hans": "消除一行！继续挑战。", ja: "1行消去！そのまま続けましょう。", ko: "한 줄을 지웠습니다! 계속 도전하세요.", es: "¡Línea despejada! Sigue adelante.", "pt-BR": "Linha limpa! Continue.", fr: "Ligne effacée ! Continuez.", de: "Reihe gelöscht! Weiter geht's.", it: "Riga cancellata! Continua.", ru: "Линия очищена! Продолжайте.", hi: "एक पंक्ति साफ हुई! आगे बढ़ें।", ar: "تم مسح صف! واصل اللعب." };

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

  const TIC_CELL_COPY = {
    en: { row: "Row", column: "column", empty: "empty" },
    "zh-Hant": { row: "列", column: "欄", empty: "空白" },
    "zh-Hans": { row: "行", column: "列", empty: "空白" },
    ja: { row: "行", column: "列", empty: "空き" },
    ko: { row: "행", column: "열", empty: "비어 있음" },
    es: { row: "Fila", column: "columna", empty: "vacía" },
    "pt-BR": { row: "Linha", column: "coluna", empty: "vazia" },
    fr: { row: "Ligne", column: "colonne", empty: "vide" },
    de: { row: "Reihe", column: "Spalte", empty: "leer" },
    it: { row: "Riga", column: "colonna", empty: "vuota" },
    ru: { row: "Строка", column: "столбец", empty: "пусто" },
    hi: { row: "पंक्ति", column: "स्तंभ", empty: "खाली" },
    ar: { row: "الصف", column: "العمود", empty: "فارغة" },
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
    en: { run: (n) => `Run ${n}`, goal: (n) => `Milestone: ${n} food`, nextGoal: (n) => `Next milestone: ${n} food`, collected: (n) => `Food collected: ${n}`, milestone: (n) => `Milestone ${n} reached — +20 bonus. Keep going!` },
    "zh-Hant": { run: (n) => `第 ${n} 局`, goal: (n) => `里程碑：${n} 個食物`, nextGoal: (n) => `下一個里程碑：${n} 個食物`, collected: (n) => `已收集食物：${n}`, milestone: (n) => `達成 ${n} 個食物里程碑，獲得 20 分獎勵，繼續前進！` },
    "zh-Hans": { run: (n) => `第 ${n} 局`, goal: (n) => `里程碑：${n} 个食物`, nextGoal: (n) => `下一个里程碑：${n} 个食物`, collected: (n) => `已收集食物：${n}`, milestone: (n) => `达成 ${n} 个食物里程碑，获得 20 分奖励，继续前进！` },
    ja: { run: (n) => `ラン ${n}`, goal: (n) => `目標：食べ物 ${n} 個`, nextGoal: (n) => `次の目標：食べ物 ${n} 個`, collected: (n) => `食べ物：${n} 個`, milestone: (n) => `食べ物 ${n} 個を達成。ボーナス20点！続けましょう。` },
    ko: { run: (n) => `${n}번째 런`, goal: (n) => `목표: 먹이 ${n}개`, nextGoal: (n) => `다음 목표: 먹이 ${n}개`, collected: (n) => `먹이 수집: ${n}`, milestone: (n) => `먹이 ${n}개 목표 달성! 보너스 20점, 계속하세요.` },
    es: { run: (n) => `Partida ${n}`, goal: (n) => `Meta: ${n} alimentos`, nextGoal: (n) => `Siguiente meta: ${n} alimentos`, collected: (n) => `Alimentos: ${n}`, milestone: (n) => `Meta de ${n} alimentos alcanzada. ¡+20 de bonus!` },
    "pt-BR": { run: (n) => `Partida ${n}`, goal: (n) => `Meta: ${n} alimentos`, nextGoal: (n) => `Próxima meta: ${n} alimentos`, collected: (n) => `Alimentos: ${n}`, milestone: (n) => `Meta de ${n} alimentos alcançada. Bônus de 20! Continue!` },
    fr: { run: (n) => `Partie ${n}`, goal: (n) => `Objectif : ${n} nourritures`, nextGoal: (n) => `Prochain objectif : ${n} nourritures`, collected: (n) => `Nourritures : ${n}`, milestone: (n) => `Objectif de ${n} nourritures atteint. Bonus de 20 ! Continuez !` },
    de: { run: (n) => `Lauf ${n}`, goal: (n) => `Ziel: ${n} Futter`, nextGoal: (n) => `Nächstes Ziel: ${n} Futter`, collected: (n) => `Futter gesammelt: ${n}`, milestone: (n) => `Ziel von ${n} Futter erreicht. +20 Bonus! Weiter!` },
    it: { run: (n) => `Partita ${n}`, goal: (n) => `Traguardo: ${n} cibi`, nextGoal: (n) => `Prossimo traguardo: ${n} cibi`, collected: (n) => `Cibi raccolti: ${n}`, milestone: (n) => `Traguardo di ${n} cibi raggiunto. Bonus di 20! Continua!` },
    ru: { run: (n) => `Забег ${n}`, goal: (n) => `Цель: ${n} ед. еды`, nextGoal: (n) => `Следующая цель: ${n} ед. еды`, collected: (n) => `Еда собрана: ${n}`, milestone: (n) => `Цель ${n} достигнута. Бонус 20! Продолжайте!` },
    hi: { run: (n) => `रन ${n}`, goal: (n) => `लक्ष्य: ${n} भोजन`, nextGoal: (n) => `अगला लक्ष्य: ${n} भोजन`, collected: (n) => `भोजन एकत्र: ${n}`, milestone: (n) => `${n} भोजन का लक्ष्य पूरा। 20 बोनस! जारी रखें!` },
    ar: { run: (n) => `الجولة ${n}`, goal: (n) => `الهدف: ${n} طعام`, nextGoal: (n) => `الهدف التالي: ${n} طعام`, collected: (n) => `الطعام المجموع: ${n}`, milestone: (n) => `اكتمل هدف ${n} من الطعام. مكافأة 20! استمر!` },
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
  const wordleLengthError = (locale) => WORDLE_LENGTH_ERROR[locale] || WORDLE_LENGTH_ERROR.en;
  const hangmanAlreadyUsed = (locale) => HANGMAN_ALREADY_USED[locale] || HANGMAN_ALREADY_USED.en;
  const hangmanHint = (locale, length) => (HANGMAN_HINT_COPY[locale] || HANGMAN_HINT_COPY.en)(length);
  const hangmanMiss = (locale, letter, misses) => (HANGMAN_MISS_COPY[locale] || HANGMAN_MISS_COPY.en)(letter, misses);
  const checkersPromotionCopy = (locale, kind) => (CHECKERS_PROMOTION_COPY[locale] || CHECKERS_PROMOTION_COPY.en)[kind];
  const checkersMoveCoachCopy = (locale) => CHECKERS_MOVE_COACH_COPY[locale] || CHECKERS_MOVE_COACH_COPY.en;
  const title = (locale, gameId) => window.WEIGHTPLAY_GAME_TITLES?.[gameId]?.[locale]
    || (TITLES[locale] || TITLES.en)[gameId];
  const ticCellLabel = (locale, index, cell) => {
    const labels = TIC_CELL_COPY[locale] || TIC_CELL_COPY.en;
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    return `${labels.row} ${row}, ${labels.column} ${column}, ${cell || labels.empty}`;
  };
  const mahjongTileLabel = (locale, index, tile, selected) => {
    const labels = MAHJONG_TILE_COPY[locale] || MAHJONG_TILE_COPY.en;
    return `${labels.tile} ${tile}, ${labels.position} ${index + 1}, ${selected ? labels.selected : labels.open}`;
  };
  const makeState = (type) => {
    const state = { type, score: 0, moves: 0, done: false, success: false, message: "", tone: "", messageKey: "", mismatchTile: "" };
    if (type === "tetris") Object.assign(state, { pieces: 0, lines: 0, active: 3, blocks: [] });
    if (type === "snake") Object.assign(state, { started: false, food: 0, foodCell: 45, direction: "up", trail: snakeTrailForDirection("up"), runNumber: 1, goalFood: 3, modeKey: "open", obstacles: [], milestoneReached: false, foodFlashCell: -1 });
    if (type === "tic") Object.assign(state, { cells: Array(9).fill(""), playerMoves: 0, aiMoves: 0 });
    if (type === "chess") Object.assign(state, { step: 0 });
    if (type === "checkers") Object.assign(state, { step: 0 });
    if (type === "mahjong") Object.assign(state, { tiles: ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F"], selected: -1, matched: 0, focusTile: -1 });
    if (type === "wordle") Object.assign(state, { guesses: [], target: "BRAVE" });
    if (type === "hangman") Object.assign(state, { target: "PUZZLE", letters: [], misses: 0 });
    if (type === "breakout") Object.assign(state, { bricks: Array(12).fill(true), shots: 0, paddle: 2 });
    if (type === "pong") Object.assign(state, { rallies: 0, paddle: 2 });
    return state;
  };

  function mount(gameId) {
    const game = CATALOG[gameId];
    if (!game) throw new Error(`Unknown popular game: ${gameId}`);
    document.body.dataset.gameId = gameId;
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
      message: document.querySelector("#gameMessage"), objective: document.querySelector("#objective"), instruction: document.querySelector("#mainInstruction"), resultTitle: document.querySelector("#resultTitle"), resultCopy: document.querySelector("#resultCopy"), resultStats: document.querySelector("#resultStats"),
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
        else if (state.messageKey === "snakeRunning") state.message = snakeInstruction(locale);
        else if (state.messageKey === "snakeFood") state.message = snakeCopy(locale, "collected", state.food);
        else if (state.messageKey === "snakeMilestone") state.message = snakeCopy(locale, "milestone", state.food);
      }
      if (game.type === "hangman") {
        if (state.messageKey === "hangmanHint") state.message = hangmanHint(locale, state.target.length);
        else if (state.messageKey === "hangmanMiss") state.message = hangmanMiss(locale, state.lastLetter, state.misses);
        else if (state.messageKey === "hangmanUsed") state.message = `${state.lastLetter}: ${hangmanAlreadyUsed(locale)}`;
      }
      if (game.type === "mahjong" && state.messageKey === "mahjongMismatch") {
        state.message = (MAHJONG_MISMATCH_COPY[locale] || MAHJONG_MISMATCH_COPY.en)(state.mismatchTile);
      }
      if (game.type === "tetris" && state.messageKey === "tetrisLineClear") {
        state.message = TETRIS_LINE_CLEAR_COPY[locale] || TETRIS_LINE_CLEAR_COPY.en;
      }
      if (game.type === "checkers" && state.messageKey === "checkersPromotion") {
        state.message = checkersPromotionCopy(locale, "next");
      }
      renderShell();
      if (document.body.dataset.screen === "result") renderResult();
      render();
    };
    els.locale.addEventListener("change", persistLocale);
    const announce = (message, tone = "", messageKey = "") => { state.message = message; state.tone = tone; state.messageKey = messageKey; els.message.textContent = message; els.message.dataset.tone = tone; };
    const show = (screen) => { els.main.hidden = screen !== "main"; els.battle.hidden = screen !== "battle"; els.result.hidden = screen !== "result"; document.body.dataset.screen = screen; document.documentElement.classList.toggle("popular-checkers-active", game.type === "checkers" && screen !== "main"); window.dispatchEvent(new Event("weightplay:shell-sync")); if (game.type === "tetris" && screen !== "main") window.scrollTo({ top: 0, left: 0, behavior: "auto" }); };
    let snakeTimer = null;
    let snakeFlashTimer = null;
    const stopSnakeTimer = () => { if (snakeTimer) { window.clearTimeout(snakeTimer); snakeTimer = null; } if (snakeFlashTimer) { window.clearTimeout(snakeFlashTimer); snakeFlashTimer = null; } };
    const nextSnakeRunNumber = () => {
      const runKey = `${key(gameId)}_runs`;
      let runNumber = 0;
      try { runNumber = Number(localStorage.getItem(runKey) || 0) + 1; localStorage.setItem(runKey, String(runNumber)); } catch { runNumber = 1; }
      return Math.max(1, runNumber);
    };
    const snakeTickMs = () => Math.max(180, SNAKE_TICK_MS - state.food * 20);
    const snakeGoalLabel = () => state.milestoneReached ? snakeCopy(locale, "nextGoal", state.goalFood + 2) : snakeCopy(locale, "goal", state.goalFood);
    const start = (entry = "start") => { stopSnakeTimer(); state = makeState(game.type); checkersSeenTargets.clear(); checkersPromotionCueTracked = false; if (game.type === "snake") { state.runNumber = nextSnakeRunNumber(); state.goalFood = snakeGoalForRun(state.runNumber); state.modeKey = snakeModeForRun(state.runNumber); state.obstacles = snakeObstaclesForMode(state.modeKey); state.foodCell = chooseSnakeFood(state.trail, state.obstacles); } show("battle"); trackCheckers("game_start", { entry }); announce(game.type === "snake" ? (SNAKE_READY[locale] || SNAKE_READY.en) : game.type === "checkers" ? "" : copy(locale, "ready"), "", game.type === "snake" ? "snakeReady" : game.type === "checkers" ? "" : "ready"); render(); };
    const renderResult = () => { const best = Number(localStorage.getItem(key(gameId)) || 0); els.resultTitle.textContent = state.success ? copy(locale, "success") : copy(locale, "failure"); els.resultCopy.textContent = state.success ? (game.type === "checkers" ? checkersPromotionCopy(locale, "result") : copy(locale, "successCopy")) : copy(locale, "failureCopy"); els.resultStats.innerHTML = `<span class="stat">${copy(locale, "score")}<strong>${state.score}</strong></span><span class="stat">${copy(locale, "moves")}<strong>${state.moves}</strong></span><span class="stat">${copy(locale, "best")}<strong>${Math.max(best, state.score)}</strong></span>`; };
    const finish = (success) => { if (state.done) return; stopSnakeTimer(); state.done = true; state.success = success; state.score = success ? Math.max(state.score, state.moves * 10 + 100) : state.score; const best = Number(localStorage.getItem(key(gameId)) || 0); if ((game.type === "snake" || success) && state.score > best) { try { localStorage.setItem(key(gameId), String(state.score)); } catch {} } if (game.type === "checkers" && success) trackCheckers("promotion_result", { score: state.score }); renderResult(); show("result"); };
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
          announce(snakeCopy(locale, "milestone", state.food), "good", "snakeMilestone");
        } else {
          announce(snakeCopy(locale, "collected", state.food), "good", "snakeFood");
        }
        state.score = state.food * 10 + (state.milestoneReached ? 20 : 0);
        state.foodCell = chooseSnakeFood(state.trail, state.obstacles);
        if (snakeFlashTimer) window.clearTimeout(snakeFlashTimer);
        snakeFlashTimer = window.setTimeout(() => { state.foodFlashCell = -1; if (!state.done) render(); }, 520);
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
        state.direction = name;
        state.message = "";
        state.messageKey = "";
        state.tone = "";
        render();
        return;
      }
      state.moves += 1;
      if (game.type === "tetris") {
        if (name === "left") state.active = Math.max(0, state.active - 1); if (name === "right") state.active = Math.min(7, state.active + 1); if (name === "rotate") state.score += 5; if (name === "drop") { const previousLines = state.lines; state.pieces += 1; state.lines = Math.min(4, Math.floor(state.pieces / 2)); state.blocks.push({ x: state.active, y: 7 - (state.pieces % 7) }); if (state.lines > previousLines && state.lines < 4) announce(TETRIS_LINE_CLEAR_COPY[locale] || TETRIS_LINE_CLEAR_COPY.en, "good", "tetrisLineClear"); if (state.lines >= 4) finish(true); }
      } else if (game.type === "tic") { if (name === "cell" && state.cells[value] === "") { state.cells[value] = "X"; state.playerMoves += 1; state.score += 20; const empty = state.cells.findIndex((cell) => !cell); if (empty >= 0 && state.playerMoves < 3) { state.cells[empty] = "O"; state.aiMoves += 1; } if (state.playerMoves >= 3 || state.cells.every(Boolean)) finish(state.playerMoves >= 3); }
      } else if (game.type === "chess") { if (name === "move") { state.step += 1; state.score += 30; if (state.step >= 3) finish(true); }
       } else if (game.type === "checkers") { if (name === "move") { state.step += 1; state.score += 20; trackCheckers("move_selected", { step: state.step }); if (state.step >= 5) finish(true); else if (state.step === 4) { if (!checkersPromotionCueTracked) { checkersPromotionCueTracked = true; trackCheckers("promotion_cue_seen", { step: state.step }); } announce(checkersPromotionCopy(locale, "next"), "good", "checkersPromotion"); } }
      } else if (game.type === "mahjong") { if (name === "tile" && state.tiles[value]) { if (state.selected < 0) { state.selected = value; state.mismatchTile = ""; state.focusTile = value; announce(mahjongTileLabel(locale, value, state.tiles[value], true)); } else if (state.selected !== value && state.tiles[state.selected] === state.tiles[value]) { state.tiles[state.selected] = ""; state.tiles[value] = ""; state.matched += 1; state.score += 30; state.selected = -1; state.mismatchTile = ""; state.focusTile = state.tiles.findIndex(Boolean); announce(copy(locale, "matched"), "good"); if (state.matched >= 6) { state.focusTile = -1; finish(true); } } else { if (state.selected !== value) { state.moves -= 1; state.mismatchTile = state.tiles[value]; announce((MAHJONG_MISMATCH_COPY[locale] || MAHJONG_MISMATCH_COPY.en)(state.mismatchTile), "warn", "mahjongMismatch"); } state.selected = value; state.focusTile = value; } }
      } else if (game.type === "wordle") { if (name === "submit") { const inputNode = document.querySelector("#wordInput"); const input = String(inputNode?.value || "").trim().toUpperCase(); if (input.length !== 5) { state.moves -= 1; announce(wordleLengthError(locale), "warn"); inputNode?.focus(); return; } state.guesses.push(input); state.score += input === state.target ? 100 : 10; if (input === state.target) finish(true); else if (state.guesses.length >= 6) finish(false); else announce(copy(locale, "next"), ""); }
      } else if (game.type === "hangman") { if (name === "letter") { state.letters.push(value); state.focusLetter = value; state.lastLetter = value; if (!state.target.includes(value)) { state.misses += 1; if (state.misses < 6) announce(hangmanMiss(locale, value, state.misses), "warn", "hangmanMiss"); } else state.score += 15; if ([...state.target].every((letter) => state.letters.includes(letter))) finish(true); else if (state.misses >= 6) finish(false); }
      } else if (game.type === "breakout") { if (name === "left") state.paddle = Math.max(0, state.paddle - 1); if (name === "right") state.paddle = Math.min(5, state.paddle + 1); if (name === "fire") { state.shots += 1; const index = state.bricks.findIndex(Boolean); if (index >= 0) state.bricks[index] = false; state.score += 20; if (state.bricks.every((brick) => !brick)) finish(true); }
      } else if (game.type === "pong") { if (name === "left") state.paddle = Math.max(0, state.paddle - 1); if (name === "right") state.paddle = Math.min(5, state.paddle + 1); if (name === "serve") { state.rallies += 1; state.score += 25; if (state.rallies >= 5) finish(true); }
      }
      render();
    };
    const hint = () => { if (game.type === "wordle") announce(`${copy(locale, "hint")}: the target starts with B.`, "warn"); else if (game.type === "hangman") announce(hangmanHint(locale, state.target.length), "warn", "hangmanHint"); else if (game.type === "mahjong") announce(`${copy(locale, "hint")}: match identical symbols.`, "warn"); else announce(`${copy(locale, "hint")}: ${copy(locale, game.objective)}`, "warn", game.type === "snake" ? "hintObjective" : ""); render(); };
    const shell = () => { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.title = `${title(locale, gameId)} | WeightPlay`; if (game.type === "checkers") document.querySelector('meta[name="description"]')?.setAttribute("content", checkersMetaDescription(locale)); els.eyebrow.textContent = copy(locale, "eyebrow"); els.title.textContent = title(locale, gameId); els.tagline.textContent = copy(locale, "tagline"); els.objective.innerHTML = `<strong>${copy(locale, "objective")}:</strong> ${copy(locale, game.objective)}`; els.instruction.textContent = game.type === "snake" ? snakeInstruction(locale) : copy(locale, "ready"); document.querySelector("#languageLabel").textContent = copy(locale, "language"); document.querySelector("#footerText").textContent = `${title(locale, gameId)} · ${copy(locale, "eyebrow")}`; if (game.type === "snake") { const shellCopy = SNAKE_SHELL_COPY[locale] || SNAKE_SHELL_COPY.en; document.querySelector('[data-wp-return="battle"]')?.setAttribute("aria-label", shellCopy.battleBack); document.querySelector('[data-wp-return="main"]')?.setAttribute("aria-label", shellCopy.mainBack); } };
    const button = (label, name, extra = "") => `<button type="button" class="control ${extra}" data-action="${name}">${label}</button>`;
    const renderBoard = () => {
      if (game.type === "snake") { const foodCell = state.foodCell; const cells = Array.from({ length: SNAKE_GRID_SIZE * SNAKE_GRID_SIZE }, (_, i) => `<span class="grid-cell ${state.trail.includes(i) ? "filled" : ""} ${i === state.trail[0] ? "snake-head" : ""} ${i === foodCell ? "food" : ""} ${state.obstacles.includes(i) ? "obstacle" : ""} ${i === state.foodFlashCell ? "food-hit" : ""}" data-cell="${i}"${state.obstacles.includes(i) ? ` aria-label="${snakeModeLabel(locale, state.modeKey)}"` : ""}></span>`).join(""); els.board.innerHTML = `<div class="grid-board snake-grid ${state.milestoneReached ? "milestone-pulse" : ""}" role="grid" aria-label="${copy(locale, game.objective)}" data-grid-size="${SNAKE_GRID_SIZE}" data-tick-ms="${snakeTickMs()}" data-head-cell="${state.trail[0]}" data-food-cell="${foodCell}" data-food-count="${state.food}" data-score="${state.score}" data-run="${state.runNumber}" data-mode="${state.modeKey}" data-mode-label="${snakeModeLabel(locale, state.modeKey)}" data-obstacles="${state.obstacles.join(",")}" data-goal-food="${state.goalFood}" data-milestone-reached="${state.milestoneReached}" data-direction="${state.direction}" data-moves="${state.moves}" data-trail="${state.trail.join(",")}">${cells}</div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "up"), "up")}</div><div class="control-row">${button(copy(locale, "left"), "left")}${button(copy(locale, "down"), "down")}${button(copy(locale, "right"), "right")}</div>`; return; }
      if (game.type === "tetris") { const cells = Array.from({ length: 64 }, (_, i) => { const block = state.blocks.some((b) => b.x + b.y * 8 === i); const active = i === state.active; return `<span class="grid-cell ${block ? "filled" : ""} ${active ? "active" : ""}"></span>`; }).join(""); els.board.innerHTML = `<div class="grid-board tetris-grid">${cells}</div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "left"), "left")}${button(copy(locale, "rotate"), "rotate")}${button(copy(locale, "right"), "right")}${button(copy(locale, "drop"), "drop", "primary")}</div>`;
      } else if (game.type === "tic") { els.board.innerHTML = `<div class="tic-board">${state.cells.map((cell, i) => `<button class="tic-cell" data-action="cell" data-value="${i}" aria-label="${ticCellLabel(locale, i, cell)}"${cell ? " disabled" : ""}>${cell}</button>`).join("")}</div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "hint"), "hint")}</div>`;
      } else if (game.type === "chess") { els.board.innerHTML = `<div class="chess-board">${["♜", "♟", "", "♚", "", "♙", "", "", "", "", "♙", "", "", "", "", "♔"].map((piece, i) => `<button class="chess-cell ${i === 6 + state.step ? "target" : ""}" data-action="move">${piece}</button>`).join("")}</div>`; els.controls.innerHTML = `<div class="control-row">${button(`${copy(locale, "select")} ${state.step + 1}`, "move", "primary")}</div>`;
      } else if (game.type === "checkers") { const nextTarget = state.step < 5 ? 30 - (state.step + 1) * 5 : -1; els.board.innerHTML = `<div class="checkers-board">${Array.from({ length: 36 }, (_, i) => `<div class="checker-cell${i === nextTarget ? " target" : ""}" data-cell="${i}"${i === nextTarget ? ` aria-label="${checkersMoveCoachCopy(locale)}" data-target="true"` : ""}>${i === 30 - state.step * 5 ? "<span class=\"checker-piece\"></span>" : i === 5 ? "<span class=\"checker-piece enemy\"></span>" : ""}</div>`).join("")}</div>`; els.controls.innerHTML = `<div class="control-row">${button(`${copy(locale, "select")} ${state.step + 1}`, "move", "primary")}</div>`;
      } else if (game.type === "mahjong") { els.board.innerHTML = `<div class="tile-board">${state.tiles.map((tile, i) => tile ? `<button class="tile ${state.selected === i ? "selected" : ""}" data-action="tile" data-value="${i}" aria-label="${mahjongTileLabel(locale, i, tile, state.selected === i)}" aria-pressed="${state.selected === i}">${tile}</button>` : "").join("")}</div>`; els.controls.innerHTML = `<div class="control-row"><span class="round-label" role="status" aria-live="polite" aria-atomic="true">${copy(locale, "remaining")}: ${6 - state.matched}</span></div>`;
      } else if (game.type === "wordle") { els.board.innerHTML = `<div class="wordle-board">${Array.from({ length: 6 }, (_, row) => `<div class="wordle-row">${Array.from({ length: 5 }, (_, col) => { const guess = state.guesses[row] || ""; const letter = guess[col] || ""; const tone = letter && letter === state.target[col] ? "hit" : letter && state.target.includes(letter) ? "near" : letter ? "miss" : ""; return `<span class="word-cell ${tone}">${letter}</span>`; }).join("")}</div>`).join("")}</div>`; els.controls.innerHTML = `<div class="word-entry"><input id="wordInput" maxlength="5" aria-label="${copy(locale, "wordle")}" autocomplete="off" /><button class="primary" data-action="submit">${copy(locale, "submit")}</button></div>`;
      } else if (game.type === "hangman") { const word = [...state.target].map((letter) => state.letters.includes(letter) ? letter : "_ ").join(""); els.board.innerHTML = `<div class="hangman-word" style="font-size:clamp(2rem,8vw,4rem);letter-spacing:.2em;text-align:center">${word}</div><p class="round-label">${copy(locale, "misses")}: ${state.misses}/6</p>`; els.controls.innerHTML = `<div class="letters">${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => { const used = state.letters.includes(letter); return `<button class="letter ${used ? "used" : ""}" data-action="letter" data-value="${letter}" aria-pressed="${used}" aria-label="${used ? `${letter}, ${hangmanAlreadyUsed(locale)}` : letter}">${letter}</button>`; }).join("")}</div>`;
      } else if (game.type === "breakout") { els.board.innerHTML = `<div class="brick-board">${state.bricks.map((brick) => `<span class="brick ${brick ? "" : "cleared"}"></span>`).join("")}</div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "left"), "left")}${button(copy(locale, "right"), "right")}${button(copy(locale, "serve"), "fire", "primary")}</div>`;
      } else if (game.type === "pong") { els.board.innerHTML = `<div class="pong-board"><span class="pong-ball"></span><span class="pong-paddle" style="left:${state.paddle * 13 + 17}%"></span></div>`; els.controls.innerHTML = `<div class="control-row">${button(copy(locale, "left"), "left")}${button(copy(locale, "serve"), "serve", "primary")}${button(copy(locale, "right"), "right")}</div>`; }
    };
    let snakePointerActionUntil = 0;
    const runActionNode = (node) => { if (!node || node.disabled) return; if (node.dataset.action === "hint") { hint(); return; } const value = node.dataset.action === "letter" ? node.dataset.value : node.dataset.value === undefined ? undefined : Number(node.dataset.value); action(node.dataset.action, value); };
    const handleActionClick = (event) => { const node = event.target?.closest?.("[data-action]"); if (!node || (!els.controls.contains(node) && !els.board.contains(node)) || node.disabled) return; if (game.type === "snake" && performance.now() < snakePointerActionUntil) return; runActionNode(node); };
    const render = () => { els.round.textContent = game.type === "snake" ? `${snakeCopy(locale, "run", state.runNumber)} · ${snakeModeLabel(locale, state.modeKey)} · ${snakeGoalLabel()} · ${copy(locale, "score")}: ${state.score} · ${copy(locale, "moves")}: ${state.moves}` : `${copy(locale, "round")} · ${copy(locale, "score")}: ${state.score} · ${copy(locale, "moves")}: ${state.moves}`; renderBoard(); const defaultMessage = game.type === "checkers" ? checkersMoveCoachCopy(locale) : game.type === "snake" ? (state.started ? snakeInstruction(locale) : (SNAKE_READY[locale] || SNAKE_READY.en)) : copy(locale, "ready"); els.message.textContent = state.message || defaultMessage; els.message.dataset.tone = state.tone; if (game.type === "checkers" && document.body.dataset.screen === "battle" && !checkersSeenTargets.has(state.step)) { checkersSeenTargets.add(state.step); trackCheckers("move_target_seen", { step: state.step + 1 }); } if (game.type === "mahjong") { if (state.messageKey === "mahjongMismatch") els.message.dataset.mahjongMismatch = "true"; else delete els.message.dataset.mahjongMismatch; } if (game.type === "mahjong" && document.body.dataset.screen === "battle" && state.focusTile >= 0) { const focusTarget = els.board.querySelector(`[data-action="tile"][data-value="${state.focusTile}"]`); if (focusTarget) focusTarget.focus(); state.focusTile = -1; } if (game.type === "hangman" && document.body.dataset.screen === "battle" && state.focusLetter) { const focusTarget = els.controls.querySelector(`[data-action="letter"][data-value="${state.focusLetter}"]`); if (focusTarget) focusTarget.focus(); state.focusLetter = ""; } };
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
    els.start.addEventListener("click", () => start("start")); els.retry.addEventListener("click", () => { trackCheckers("replay", { from: "result" }); start("retry"); }); els.home.addEventListener("click", () => { trackCheckers("main_return", { from: "result" }); stopSnakeTimer(); show("main"); state = makeState(game.type); render(); }); els.hint.addEventListener("click", hint); els.restart.addEventListener("click", () => start("restart"));
    document.addEventListener("keydown", (event) => { if (document.body.dataset.screen !== "battle") return; if (game.type === "snake" && !state.started && [" ", "Enter"].includes(event.key)) { event.preventDefault(); beginSnake(); return; } const visibleTetrisControl = tetrisFocusedControl?.isConnected && tetrisFocusedControl.getClientRects().length ? tetrisFocusedControl : null; if (game.type === "tetris" && event.key === " " && visibleTetrisControl) { event.preventDefault(); visibleTetrisControl.click(); return; } const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", a: "left", A: "left", d: "right", D: "right", w: "up", W: "up", s: "down", S: "down", " ": "drop" }; if (map[event.key] && ["tetris", "snake", "breakout", "pong"].includes(game.type)) { event.preventDefault(); action(map[event.key]); } });
    const battleBack = document.querySelector('[data-wp-return="battle"]');
    battleBack?.addEventListener("click", () => { trackCheckers("main_return", { from: "battle" }); stopSnakeTimer(); show("main"); state = makeState(game.type); render(); });
    renderShell(); show("main"); render();
  }

  window.WPPopularArcade = { mount, catalog: CATALOG, locales: LOCALES };
})();
