(() => {
  "use strict";

  const root = document.getElementById("classicArcade");
  if (!root) return;
  const gameId = document.body.dataset.gameId === "space-rocks" ? "space" : "maze";
  const localeKeys = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];

  const UI = {
    en: { language: "Language", score: "Score", best: "Best", level: "Level", wave: "Wave", power: "Power", restart: "Restart", return: "←", soundOn: "Sound on", soundOff: "Sound off", stay: "Stay", leave: "Leave", confirm: "Leave this run? Your current score will be lost.", retry: "Play again", home: "Back to Main", win: "Route secured!", lose: "Run ended", winCopy: "You cleared the route and made the archive safe.", loseCopy: "The route got away from you. Try a new run and read the next opening.", footer: "Original WeightPlay prototype • Owner preview • Coming Soon", stage: "Stage", shield: "Shield", muted: "Sound muted", ready: "Choose a route and start moving.", hit: "Careful — reset and keep going.", clear: "Clear! Next challenge incoming.", powerReady: "Beacon active", powerEmpty: "Collect a Beacon", controlsMaze: "Keyboard: arrows / WASD · Touch: swipe or pad", controlsSpace: "Keyboard: ← → rotate · ↑ thrust · Space fire · Shift shield", scoreStat: "Final score", bestStat: "Best score", stageStat: "Stage reached", waveStat: "Wave reached", livesStat: "Lives left", shotsStat: "Shots fired", fragmentsStat: "Fragments cleared" },
    "zh-Hant": { language: "語言", score: "分數", best: "最佳", level: "關卡", wave: "波次", power: "能量", restart: "重新開始", return: "←", soundOn: "開啟音效", soundOff: "關閉音效", stay: "留下", leave: "離開", confirm: "要離開這次挑戰嗎？目前分數會消失。", retry: "再玩一次", home: "回到主畫面", win: "路線守住了！", lose: "本次挑戰結束", winCopy: "你清除了路線，讓檔案館重新安全。", loseCopy: "這次被追上了。重新開始，讀出下一個轉彎。", footer: "WeightPlay 原創原型・內部預覽・敬請期待", stage: "關卡", shield: "護盾", muted: "音效已關閉", ready: "選好路線，開始移動。", hit: "小心——重新整理路線再出發。", clear: "清除完成！下一個挑戰來了。", powerReady: "信標啟動", powerEmpty: "收集信標", controlsMaze: "鍵盤：方向鍵／WASD・觸控：滑動或方向鍵", controlsSpace: "鍵盤：← → 旋轉・↑ 推進・空白鍵射擊・Shift 護盾", scoreStat: "最終分數", bestStat: "最佳分數", stageStat: "到達關卡", waveStat: "到達波次", livesStat: "剩餘生命", shotsStat: "射擊次數", fragmentsStat: "清除碎片" },
    "zh-Hans": { language: "语言", score: "分数", best: "最佳", level: "关卡", wave: "波次", power: "能量", restart: "重新开始", return: "←", soundOn: "开启音效", soundOff: "关闭音效", stay: "留下", leave: "离开", confirm: "要离开这次挑战吗？当前分数会消失。", retry: "再玩一次", home: "回到主画面", win: "路线守住了！", lose: "本次挑战结束", winCopy: "你清除了路线，让档案馆重新安全。", loseCopy: "这次被追上了。重新开始，读出下一个转弯。", footer: "WeightPlay 原创原型・内部预览・敬请期待", stage: "关卡", shield: "护盾", muted: "音效已关闭", ready: "选好路线，开始移动。", hit: "小心——重新整理路线再出发。", clear: "清除完成！下一个挑战来了。", powerReady: "信标启动", powerEmpty: "收集信标", controlsMaze: "键盘：方向键／WASD・触控：滑动或方向键", controlsSpace: "键盘：← → 旋转・↑ 推进・空格射击・Shift 护盾", scoreStat: "最终分数", bestStat: "最佳分数", stageStat: "到达关卡", waveStat: "到达波次", livesStat: "剩余生命", shotsStat: "射击次数", fragmentsStat: "清除碎片" },
    ja: { language: "言語", score: "スコア", best: "ベスト", level: "レベル", wave: "ウェーブ", power: "パワー", restart: "リスタート", return: "←", soundOn: "サウンド ON", soundOff: "サウンド OFF", stay: "続ける", leave: "離れる", confirm: "このランを終了しますか？現在のスコアは失われます。", retry: "もう一度遊ぶ", home: "メインへ", win: "ルート確保！", lose: "ラン終了", winCopy: "ルートを片づけ、アーカイブを安全にしました。", loseCopy: "追いつかれてしまいました。新しいルートを読みましょう。", footer: "WeightPlay オリジナル試作・オーナープレビュー・近日公開", stage: "ステージ", shield: "シールド", muted: "サウンド OFF", ready: "ルートを選んで動き出そう。", hit: "注意 — ルートを組み直そう。", clear: "クリア！次の挑戦へ。", powerReady: "ビーコン作動", powerEmpty: "ビーコンを集める", controlsMaze: "キーボード：矢印 / WASD・タッチ：スワイプまたはパッド", controlsSpace: "← → 回転・↑ 推進・Space 射撃・Shift シールド", scoreStat: "最終スコア", bestStat: "ベストスコア", stageStat: "到達ステージ", waveStat: "到達ウェーブ", livesStat: "残りライフ", shotsStat: "発射数", fragmentsStat: "破片撃破" },
    ko: { language: "언어", score: "점수", best: "최고", level: "레벨", wave: "웨이브", power: "파워", restart: "다시 시작", return: "←", soundOn: "소리 켜기", soundOff: "소리 끄기", stay: "계속", leave: "나가기", confirm: "이 도전을 나갈까요? 현재 점수가 사라집니다.", retry: "다시 플레이", home: "메인으로", win: "경로 확보!", lose: "플레이 종료", winCopy: "경로를 정리하고 기록 보관소를 지켰습니다.", loseCopy: "따라잡혔습니다. 새 경로를 읽어 보세요.", footer: "WeightPlay 오리지널 프로토타입 · 오너 프리뷰 · 출시 예정", stage: "스테이지", shield: "실드", muted: "소리 끄기", ready: "경로를 고르고 움직이세요.", hit: "조심하세요 — 경로를 다시 읽어 보세요.", clear: "클리어! 다음 도전입니다.", powerReady: "비컨 작동", powerEmpty: "비컨 수집", controlsMaze: "키보드: 방향키 / WASD · 터치: 스와이프 또는 패드", controlsSpace: "← → 회전 · ↑ 추진 · Space 발사 · Shift 실드", scoreStat: "최종 점수", bestStat: "최고 점수", stageStat: "도달 스테이지", waveStat: "도달 웨이브", livesStat: "남은 목숨", shotsStat: "발사 수", fragmentsStat: "파편 제거" },
    es: { language: "Idioma", score: "Puntos", best: "Mejor", level: "Nivel", wave: "Oleada", power: "Poder", restart: "Reiniciar", return: "←", soundOn: "Sonido activo", soundOff: "Sonido apagado", stay: "Seguir", leave: "Salir", confirm: "¿Salir de esta partida? Perderás la puntuación actual.", retry: "Jugar otra vez", home: "Volver al inicio", win: "¡Ruta segura!", lose: "Partida terminada", winCopy: "Limpiaste la ruta y protegiste el archivo.", loseCopy: "Te alcanzaron. Lee una nueva ruta y vuelve a intentarlo.", footer: "Prototipo original de WeightPlay · Vista del propietario · Próximamente", stage: "Etapa", shield: "Escudo", muted: "Sonido apagado", ready: "Elige una ruta y empieza a moverte.", hit: "Cuidado: reordena la ruta y continúa.", clear: "¡Limpio! Llega el siguiente reto.", powerReady: "Baliza activa", powerEmpty: "Recoge una baliza", controlsMaze: "Teclado: flechas / WASD · Táctil: desliza o usa el panel", controlsSpace: "← → girar · ↑ acelerar · Space disparar · Shift escudo", scoreStat: "Puntuación final", bestStat: "Mejor puntuación", stageStat: "Etapa alcanzada", waveStat: "Oleada alcanzada", livesStat: "Vidas restantes", shotsStat: "Disparos", fragmentsStat: "Fragmentos eliminados" },
    "pt-BR": { language: "Idioma", score: "Pontos", best: "Melhor", level: "Nível", wave: "Onda", power: "Poder", restart: "Reiniciar", return: "←", soundOn: "Som ligado", soundOff: "Som desligado", stay: "Ficar", leave: "Sair", confirm: "Sair desta partida? A pontuação atual será perdida.", retry: "Jogar novamente", home: "Voltar ao início", win: "Rota protegida!", lose: "Partida encerrada", winCopy: "Você limpou a rota e protegeu o arquivo.", loseCopy: "Você foi alcançado. Leia uma nova rota e tente de novo.", footer: "Protótipo original WeightPlay · Prévia do proprietário · Em breve", stage: "Fase", shield: "Escudo", muted: "Som desligado", ready: "Escolha uma rota e comece a se mover.", hit: "Cuidado — reorganize a rota e continue.", clear: "Limpo! Próximo desafio chegando.", powerReady: "Baliza ativa", powerEmpty: "Colete uma baliza", controlsMaze: "Teclado: setas / WASD · Toque: deslize ou use o painel", controlsSpace: "← → girar · ↑ acelerar · Space atirar · Shift escudo", scoreStat: "Pontuação final", bestStat: "Melhor pontuação", stageStat: "Fase alcançada", waveStat: "Onda alcançada", livesStat: "Vidas restantes", shotsStat: "Disparos", fragmentsStat: "Fragmentos limpos" },
    fr: { language: "Langue", score: "Score", best: "Record", level: "Niveau", wave: "Vague", power: "Pouvoir", restart: "Recommencer", return: "←", soundOn: "Son activé", soundOff: "Son désactivé", stay: "Rester", leave: "Quitter", confirm: "Quitter cette partie ? Le score actuel sera perdu.", retry: "Rejouer", home: "Retour à l’accueil", win: "Route sécurisée !", lose: "Partie terminée", winCopy: "Vous avez nettoyé la route et protégé les archives.", loseCopy: "Vous avez été rattrapé. Lisez une nouvelle route et retentez.", footer: "Prototype original WeightPlay · Aperçu propriétaire · Bientôt disponible", stage: "Étape", shield: "Bouclier", muted: "Son désactivé", ready: "Choisissez une route et commencez.", hit: "Attention — relisez la route et continuez.", clear: "Nettoyé ! Le prochain défi arrive.", powerReady: "Balise active", powerEmpty: "Collectez une balise", controlsMaze: "Clavier : flèches / WASD · Tactile : glisser ou pavé", controlsSpace: "← → tourner · ↑ propulser · Espace tirer · Maj bouclier", scoreStat: "Score final", bestStat: "Meilleur score", stageStat: "Étape atteinte", waveStat: "Vague atteinte", livesStat: "Vies restantes", shotsStat: "Tirs", fragmentsStat: "Fragments détruits" },
    de: { language: "Sprache", score: "Punkte", best: "Bestwert", level: "Level", wave: "Welle", power: "Power", restart: "Neustart", return: "←", soundOn: "Ton an", soundOff: "Ton aus", stay: "Bleiben", leave: "Verlassen", confirm: "Diese Runde verlassen? Der aktuelle Punktestand geht verloren.", retry: "Noch einmal", home: "Zurück zum Start", win: "Route gesichert!", lose: "Runde beendet", winCopy: "Du hast die Route geräumt und das Archiv geschützt.", loseCopy: "Du wurdest eingeholt. Lies eine neue Route und versuche es erneut.", footer: "Originales WeightPlay-Prototyp · Besitzer-Vorschau · Demnächst", stage: "Stufe", shield: "Schild", muted: "Ton aus", ready: "Wähle eine Route und leg los.", hit: "Vorsicht — lies die Route neu.", clear: "Geräumt! Die nächste Herausforderung kommt.", powerReady: "Leuchtfeuer aktiv", powerEmpty: "Leuchtfeuer sammeln", controlsMaze: "Tastatur: Pfeile / WASD · Touch: wischen oder Pad", controlsSpace: "← → drehen · ↑ Schub · Leertaste feuern · Shift Schild", scoreStat: "Endpunktzahl", bestStat: "Bestpunktzahl", stageStat: "Erreichte Stufe", waveStat: "Erreichte Welle", livesStat: "Verbleibende Leben", shotsStat: "Schüsse", fragmentsStat: "Zerstörte Fragmente" },
    it: { language: "Lingua", score: "Punteggio", best: "Record", level: "Livello", wave: "Ondata", power: "Potere", restart: "Ricomincia", return: "←", soundOn: "Audio attivo", soundOff: "Audio spento", stay: "Resta", leave: "Esci", confirm: "Vuoi uscire? Il punteggio attuale andrà perso.", retry: "Gioca ancora", home: "Torna all’inizio", win: "Percorso sicuro!", lose: "Partita finita", winCopy: "Hai liberato il percorso e protetto l’archivio.", loseCopy: "Ti hanno raggiunto. Leggi un nuovo percorso e riprova.", footer: "Prototipo originale WeightPlay · Anteprima proprietario · Prossimamente", stage: "Fase", shield: "Scudo", muted: "Audio spento", ready: "Scegli un percorso e inizia a muoverti.", hit: "Attenzione — rileggi il percorso.", clear: "Pulito! Arriva la prossima sfida.", powerReady: "Faro attivo", powerEmpty: "Raccogli un faro", controlsMaze: "Tastiera: frecce / WASD · Touch: scorri o usa il pad", controlsSpace: "← → ruota · ↑ spinta · Spazio spara · Shift scudo", scoreStat: "Punteggio finale", bestStat: "Punteggio migliore", stageStat: "Fase raggiunta", waveStat: "Ondata raggiunta", livesStat: "Vite rimaste", shotsStat: "Colpi", fragmentsStat: "Frammenti distrutti" },
    ru: { language: "Язык", score: "Очки", best: "Рекорд", level: "Уровень", wave: "Волна", power: "Сила", restart: "Заново", return: "←", soundOn: "Звук включён", soundOff: "Звук выключен", stay: "Остаться", leave: "Выйти", confirm: "Выйти из забега? Текущий счёт будет потерян.", retry: "Играть снова", home: "На главный экран", win: "Маршрут защищён!", lose: "Забег завершён", winCopy: "Вы очистили маршрут и защитили архив.", loseCopy: "Вас догнали. Прочитайте новый маршрут и попробуйте снова.", footer: "Оригинальный прототип WeightPlay · Предпросмотр владельца · Скоро", stage: "Этап", shield: "Щит", muted: "Звук выключен", ready: "Выберите маршрут и начинайте движение.", hit: "Осторожно — перечитайте маршрут.", clear: "Очищено! Следующее испытание уже близко.", powerReady: "Маяк активен", powerEmpty: "Соберите маяк", controlsMaze: "Клавиатура: стрелки / WASD · Сенсор: свайп или панель", controlsSpace: "← → поворот · ↑ тяга · Пробел огонь · Shift щит", scoreStat: "Итоговый счёт", bestStat: "Лучший счёт", stageStat: "Достигнутый этап", waveStat: "Достигнутая волна", livesStat: "Жизни", shotsStat: "Выстрелы", fragmentsStat: "Осколки уничтожены" },
    hi: { language: "भाषा", score: "स्कोर", best: "सर्वश्रेष्ठ", level: "स्तर", wave: "लहर", power: "पावर", restart: "फिर शुरू करें", return: "←", soundOn: "ध्वनि चालू", soundOff: "ध्वनि बंद", stay: "रुकें", leave: "बाहर जाएँ", confirm: "इस रन से बाहर जाएँ? वर्तमान स्कोर खो जाएगा।", retry: "फिर खेलें", home: "मुख्य पर लौटें", win: "रास्ता सुरक्षित!", lose: "रन समाप्त", winCopy: "आपने रास्ता साफ़ किया और अभिलेखागार बचाया।", loseCopy: "आप पकड़े गए। नया रास्ता पढ़कर फिर कोशिश करें।", footer: "मौलिक WeightPlay प्रोटोटाइप · मालिक पूर्वावलोकन · जल्द आ रहा है", stage: "चरण", shield: "शील्ड", muted: "ध्वनि बंद", ready: "रास्ता चुनें और चलना शुरू करें।", hit: "सावधान — रास्ता फिर पढ़ें।", clear: "साफ़! अगली चुनौती आ रही है।", powerReady: "बीकन सक्रिय", powerEmpty: "बीकन लें", controlsMaze: "कीबोर्ड: तीर / WASD · टच: स्वाइप या पैड", controlsSpace: "← → घुमाएँ · ↑ आगे बढ़ें · Space फायर · Shift शील्ड", scoreStat: "अंतिम स्कोर", bestStat: "सर्वश्रेष्ठ स्कोर", stageStat: "पहुंचा चरण", waveStat: "पहुंची लहर", livesStat: "बची जान", shotsStat: "फायर", fragmentsStat: "साफ़ किए टुकड़े" },
    ar: { language: "اللغة", score: "النقاط", best: "الأفضل", level: "المستوى", wave: "الموجة", power: "الطاقة", restart: "إعادة البدء", return: "←", soundOn: "الصوت يعمل", soundOff: "الصوت متوقف", stay: "البقاء", leave: "الخروج", confirm: "هل تخرج من الجولة؟ ستفقد نقاطك الحالية.", retry: "العب مجدداً", home: "العودة للرئيسية", win: "تم تأمين المسار!", lose: "انتهت الجولة", winCopy: "نظفت المسار وحميت الأرشيف.", loseCopy: "تمت ملاحقتك. اقرأ مساراً جديداً وحاول مجدداً.", footer: "نموذج WeightPlay أصلي · معاينة المالك · قريباً", stage: "المرحلة", shield: "الدرع", muted: "الصوت متوقف", ready: "اختر مساراً وابدأ الحركة.", hit: "انتبه — أعد قراءة المسار.", clear: "تم التنظيف! التحدي التالي قادم.", powerReady: "المنارة مفعلة", powerEmpty: "اجمع منارة", controlsMaze: "لوحة المفاتيح: الأسهم / WASD · لمس: اسحب أو استخدم اللوحة", controlsSpace: "← → دوران · ↑ دفع · Space إطلاق · Shift درع", scoreStat: "النقاط النهائية", bestStat: "أفضل نقاط", stageStat: "المرحلة التي وصلت إليها", waveStat: "الموجة التي وصلت إليها", livesStat: "الحيوات المتبقية", shotsStat: "الطلقات", fragmentsStat: "الشظايا المدمرة" }
  };

  const GAME_TEXT = {
    maze: {
      title: { en: "Maze Chase", "zh-Hant": "星徑迷宮", "zh-Hans": "星径迷宫", ja: "スター・メイズ", ko: "스타 미로", es: "Laberinto Estelar", "pt-BR": "Labirinto Estelar", fr: "Labyrinthe Stellaire", de: "Sternenlabyrinth", it: "Labirinto Stellare", ru: "Звёздный лабиринт", hi: "तारों की भूलभुलैया", ar: "متاهة النجوم" },
      tagline: { en: "Read the corridors, gather every star mote, and turn the chase around with a Beacon.", "zh-Hant": "讀懂走廊、收集每顆星塵，再用信標反轉追逐。", "zh-Hans": "读懂走廊、收集每颗星尘，再用信标反转追逐。", ja: "通路を読み、星のかけらを集め、ビーコンで追跡を逆転させよう。", ko: "통로를 읽고 별가루를 모아 비컨으로 추격을 뒤집으세요.", es: "Lee los pasillos, reúne cada mota estelar y cambia la persecución con una baliza.", "pt-BR": "Leia os corredores, colete cada partícula estelar e vire a perseguição com uma baliza.", fr: "Lisez les couloirs, prenez chaque poussière d’étoile et inversez la poursuite avec une balise.", de: "Lies die Korridore, sammle jeden Sternenfunken und drehe die Jagd mit einem Leuchtfeuer um.", it: "Leggi i corridoi, raccogli ogni scintilla e ribalta l’inseguimento con un faro.", ru: "Читайте коридоры, собирайте все звёздные искры и меняйте погоню маяком.", hi: "गलियारों को पढ़ें, हर तारा-कण लें और बीकन से पीछा पलटें।", ar: "اقرأ الممرات، اجمع كل ذرة نجمية واقلب المطاردة بالمنارة." },
      objective: { en: "Clear the archive maze across three faster stages.", "zh-Hant": "在三個越來越快的關卡中清空檔案館迷宮。", "zh-Hans": "在三个越来越快的关卡中清空档案馆迷宫。", ja: "速くなる3ステージでアーカイブ迷路をクリア。", ko: "점점 빨라지는 3개 스테이지에서 미로를 비우세요.", es: "Limpia el archivo en tres etapas cada vez más rápidas.", "pt-BR": "Limpe o arquivo em três fases cada vez mais rápidas.", fr: "Nettoyez l’archive en trois étapes de plus en plus rapides.", de: "Räume das Archiv in drei immer schnelleren Stufen.", it: "Libera l’archivio in tre livelli sempre più veloci.", ru: "Очистите архив на трёх всё более быстрых этапах.", hi: "तीन तेज़ होते चरणों में अभिलेखागार साफ़ करें।", ar: "نظف الأرشيف عبر ثلاث مراحل تزداد سرعة." },
      guide: { en: "Orla moves tile by tile. Collect all star motes, avoid Wisps, and take a Beacon to make them vulnerable for a moment. Four Wisp minds use direct, predictive, ambush, and roaming logic.", "zh-Hant": "奧拉會逐格移動。收集全部星塵、避開光靈；吃到信標後，光靈會短暫變得可反擊。四種光靈分別採用直追、預測、包抄與巡邏邏輯。", "zh-Hans": "奥拉会逐格移动。收集全部星尘、避开光灵；吃到信标后，光灵会短暂变得可反击。四种光灵分别采用直追、预测、包抄与巡逻逻辑。", ja: "オーラは1マスずつ進みます。星を集め、ウィスプを避け、ビーコンで一時的に反撃。直進・予測・待ち伏せ・巡回の4種が追います。", ko: "오라는 타일 단위로 이동합니다. 별가루를 모두 모으고 위습을 피하세요. 비컨을 먹으면 잠시 반격할 수 있습니다. 직접 추적·예측·매복·순찰 AI가 등장합니다.", es: "Orla avanza casilla a casilla. Reúne todas las motas, evita a los Wisps y usa una baliza para volverlos vulnerables. Cuatro mentes usan persecución directa, predicción, emboscada y patrulla.", "pt-BR": "Orla anda por blocos. Colete todas as partículas, evite os Wisps e use uma baliza para deixá-los vulneráveis por um instante. Quatro mentes usam perseguição direta, previsão, emboscada e patrulha.", fr: "Orla avance case par case. Prenez toutes les poussières, évitez les Wisps et utilisez une balise pour les rendre vulnérables. Quatre esprits utilisent poursuite directe, prédiction, embuscade et patrouille.", de: "Orla bewegt sich Kachel für Kachel. Sammle alle Funken, meide Wisps und nutze ein Leuchtfeuer, um sie kurz verwundbar zu machen. Vier Verhaltensweisen: direkt, vorausschauend, Hinterhalt und Streife.", it: "Orla si muove a caselle. Raccogli tutte le scintille, evita i Wisp e usa un faro per renderli vulnerabili per poco. Quattro menti: inseguimento diretto, previsione, imboscata e pattuglia.", ru: "Орла движется по клеткам. Соберите все искры, избегайте виспов и берите маяк, чтобы ненадолго сделать их уязвимыми. Четыре типа: прямой, прогнозирующий, обходящий и патрульный.", hi: "ओरला एक-एक टाइल चलती है। सभी तारा-कण लें, विस्प से बचें और बीकन लेकर उन्हें थोड़ी देर कमजोर करें। चार AI: सीधा पीछा, अनुमान, घात और गश्त।", ar: "تتحرك أورلا بين المربعات. اجمع كل الذرات وتجنب الويبس واستخدم المنارة لجعلهم عرضة للهجوم مؤقتاً. أربعة أنماط: مطاردة مباشرة وتنبؤ وكمين ودورية." },
      hint: { en: "Press a direction; keep moving until a wall or a new turn", "zh-Hant": "按一下方向後會持續前進，直到撞牆或轉向", "zh-Hans": "按一下方向后会持续前进，直到撞墙或转向", ja: "方向を押すと、壁か新しい方向まで進み続けます", ko: "방향을 누르면 벽이나 새 방향까지 계속 이동합니다", es: "Pulsa una dirección y seguirás hasta un muro o un nuevo giro", "pt-BR": "Toque numa direção e avance até uma parede ou nova curva", fr: "Touchez une direction et avancez jusqu'au mur ou au prochain virage", de: "Drücke eine Richtung und laufe bis zur Wand oder zur nächsten Kurve", it: "Premi una direzione e continua fino al muro o alla nuova svolta", ru: "Нажмите направление и двигайтесь до стены или нового поворота", hi: "दिशा दबाएँ और दीवार या नए मोड़ तक चलते रहें", ar: "اضغط اتجاهًا واستمر حتى الجدار أو المنعطف الجديد" }
    },
    space: {
      title: { en: "Space Rocks", "zh-Hant": "星礦漂流", "zh-Hans": "星矿漂流", ja: "スペース・ロックス", ko: "스페이스 록스", es: "Rocas Espaciales", "pt-BR": "Rochas Espaciais", fr: "Roches Spatiales", de: "Weltraumfelsen", it: "Rocce Spaziali", ru: "Космические глыбы", hi: "अंतरिक्ष शिलाखंड", ar: "صخور الفضاء" },
      tagline: { en: "Drift, aim in every direction, and break the crystal field before it closes in.", "zh-Hant": "利用漂移、全方位瞄準，在晶礦帶收縮前擊碎它。", "zh-Hans": "利用漂移、全方位瞄准，在晶矿带收缩前击碎它。", ja: "慣性で漂い、全方向に狙い、結晶フィールドを崩そう。", ko: "관성으로 떠다니며 전 방향을 조준하고 수정 지대를 부수세요.", es: "Deslízate, apunta en cualquier dirección y rompe el campo cristalino antes de que se cierre.", "pt-BR": "Deslize, mire em qualquer direção e quebre o campo cristalino antes que ele se feche.", fr: "Dérivez, visez dans toutes les directions et brisez le champ cristallin avant qu’il ne se referme.", de: "Drifte, ziele in alle Richtungen und zerbrich das Kristallfeld, bevor es sich schließt.", it: "Deriva, mira in ogni direzione e frantuma il campo cristallino prima che si chiuda.", ru: "Дрейфуйте, целитесь во все стороны и разбейте кристаллическое поле.", hi: "जड़त्व से बहें, हर दिशा में निशाना लगाएँ और क्रिस्टल क्षेत्र तोड़ें।", ar: "انجرف، صوب في كل اتجاه وحطم الحقل البلوري قبل أن ينغلق." },
      objective: { en: "Clear three waves: split fields, collect Rapid Fire, and survive the guardian core.", "zh-Hant": "清除三波：擊碎分裂礦群、取得連射能量，並撐過守護核心。", "zh-Hans": "清除三波：击碎分裂矿群、取得连射能量，并撑过守护核心。", ja: "3ウェーブを突破。分裂する岩、連射パワー、守護コアを攻略。", ko: "3개 웨이브를 클리어하세요. 분열하는 바위, 연사 파워, 수호 코어가 기다립니다.", es: "Supera tres oleadas: campos que se dividen, Fuego Rápido y un núcleo guardián.", "pt-BR": "Supere três ondas: campos que se dividem, Fogo Rápido e um núcleo guardião.", fr: "Survivez à trois vagues : champs divisibles, Tir Rapide et noyau gardien.", de: "Schaffe drei Wellen: geteilte Felder, Schnellfeuer und einen Wächterkern.", it: "Supera tre ondate: campi che si dividono, Fuoco Rapido e un nucleo guardiano.", ru: "Пройдите три волны: распадающиеся поля, скорострельность и ядро-страж.", hi: "तीन लहरें साफ़ करें: टूटते क्षेत्र, रैपिड फायर और रक्षक कोर।", ar: "تجاوز ثلاث موجات: حقول تتشظى ونيران سريعة ونواة حارسة." },
      guide: { en: "Rux keeps drifting after thrust. Rotate, tap thrust to shape your orbit, and fire with Space. Large rocks split into medium, then small fragments. Save Shield for a close pass; Wave 3 adds a guardian core.", "zh-Hant": "魯克在推進後會持續漂移。旋轉、點按推進來塑造軌道，再用空白鍵射擊。大型礦石會分裂成中型，再分裂成小碎片。把護盾留給危險擦身，第三波會加入守護核心。", "zh-Hans": "鲁克在推进后会持续漂移。旋转、点按推进来塑造轨道，再用空格射击。大型矿石会分裂成中型，再分裂成小碎片。把护盾留给危险擦身，第三波会加入守护核心。", ja: "推進後もルクは漂い続けます。回転と推進で軌道を作り、Spaceで射撃。大きな岩は中・小へ分裂します。接近時はシールドを使い、3ウェーブには守護コアが登場。", ko: "추진 후에도 룩스는 계속 떠갑니다. 회전과 추진으로 궤도를 만들고 Space로 발사하세요. 큰 바위는 중형, 소형으로 분열됩니다. 위험할 때 실드를 쓰고 3웨이브 수호 코어에 대비하세요.", es: "Rux sigue a la deriva tras acelerar. Gira, pulsa el impulso para formar tu órbita y dispara con Space. Las rocas grandes se dividen en medianas y pequeñas. Guarda el escudo para un roce cercano; la oleada 3 añade un núcleo guardián.", "pt-BR": "Rux continua deslizando após acelerar. Gire, toque o impulso para formar sua órbita e atire com Space. Rochas grandes viram médias e pequenas. Guarde o escudo para uma passagem perigosa; a onda 3 traz um núcleo guardião.", fr: "Rux continue de dériver après une poussée. Tournez, donnez une impulsion pour former votre orbite et tirez avec Espace. Les gros rochers deviennent moyens puis petits. Gardez le bouclier pour les passages serrés ; la vague 3 ajoute un noyau gardien.", de: "Rux driftet nach dem Schub weiter. Drehe, forme mit kurzen Schüben deine Bahn und feuere mit der Leertaste. Große Felsen teilen sich in mittlere und kleine. Spare den Schild für enge Passagen; Welle 3 bringt einen Wächterkern.", it: "Rux continua a derivare dopo la spinta. Ruota, usa brevi spinte per creare l’orbita e spara con Spazio. Le rocce grandi si dividono in medie e piccole. Conserva lo scudo per i passaggi stretti; l’ondata 3 aggiunge un nucleo guardiano.", ru: "После тяги Рукс продолжает дрейфовать. Вращайтесь, короткой тягой задавайте орбиту и стреляйте пробелом. Большие глыбы делятся на средние и малые. Берегите щит для близкого прохода; в третьей волне появится ядро-страж.", hi: "थ्रस्ट के बाद रक्स बहता रहता है। घूमें, छोटी थ्रस्ट से कक्षा बनाएँ और Space से फायर करें। बड़े पत्थर मध्यम फिर छोटे टुकड़ों में टूटते हैं। पास आने पर शील्ड बचाएँ; लहर 3 में रक्षक कोर आएगा।", ar: "يستمر روكس في الانجراف بعد الدفع. أدر المركبة وشكل مدارك بدفعات قصيرة وأطلق بزر Space. تنقسم الصخور الكبيرة إلى متوسطة ثم صغيرة. احتفظ بالدرع للمرور القريب؛ تضيف الموجة الثالثة نواة حارسة." },
      hint: { en: "Rotate · thrust · fire · shield", "zh-Hant": "旋轉・推進・射擊・護盾", "zh-Hans": "旋转・推进・射击・护盾", ja: "回転・推進・射撃・シールド", ko: "회전 · 추진 · 발사 · 실드", es: "Gira · impulsa · dispara · escudo", "pt-BR": "Gire · acelere · atire · escudo", fr: "Tourner · pousser · tirer · bouclier", de: "Drehen · Schub · Feuer · Schild", it: "Ruota · spingi · spara · scudo", ru: "Поворот · тяга · огонь · щит", hi: "घुमाएँ · थ्रस्ट · फायर · शील्ड", ar: "دوران · دفع · إطلاق · درع" }
    }
  };

  const MAZE_MAP = [
    "###############",
    "#.............#",
    "#.###.###.###.#",
    "#o#...#...#...#",
    "#.#.#.#.#.#.#.#",
    "#...#.....#...#",
    "###.#.###.#.###",
    "#.....###.....#",
    "###.#.###.#.###",
    "#...#.....#...#",
    "#.#.#.#.#.#.#.#",
    "#...#...#...#o#",
    "#.###.###.###.#",
    "#.............#",
    "###############"
  ];
  const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  const DIR_LIST = Object.entries(DIRS);
  const ui = {
    main: document.getElementById("mainScreen"), battle: document.getElementById("battleScreen"), result: document.getElementById("resultScreen"),
    eyebrow: document.getElementById("eyebrow"), title: document.getElementById("gameTitle"), tagline: document.getElementById("gameTagline"), objective: document.getElementById("objective"), guide: document.getElementById("guideCopy"), wavePlan: document.getElementById("wavePlan"), wavePlanKicker: document.getElementById("wavePlanKicker"), wavePlanTitle: document.getElementById("wavePlanTitle"), wavePlanIntro: document.getElementById("wavePlanIntro"), wavePlanList: document.getElementById("wavePlanList"),
    language: document.getElementById("languageLabel"), locale: document.getElementById("localeSelect"), start: document.getElementById("startBtn"), cover: document.getElementById("coverArt"), footer: document.getElementById("footerText"),
    round: document.getElementById("roundLabel"), back: document.getElementById("backBtn"), sound: document.getElementById("soundBtn"), restart: document.getElementById("restartBtn"), scoreLabel: document.getElementById("scoreLabel"), score: document.getElementById("scoreValue"), bestLabel: document.getElementById("bestLabel"), best: document.getElementById("bestValue"), levelLabel: document.getElementById("levelLabel"), level: document.getElementById("levelValue"), powerLabel: document.getElementById("powerLabel"), power: document.getElementById("powerValue"), livesHud: document.getElementById("livesHud"), livesLabel: document.getElementById("livesLabel"), lives: document.getElementById("livesValue"), progressLabel: document.getElementById("progressLabel"), progress: document.getElementById("progressValue"),
    confirm: document.getElementById("backConfirm"), confirmCopy: document.getElementById("backConfirmCopy"), stay: document.getElementById("backStayBtn"), leave: document.getElementById("backLeaveBtn"), canvas: document.getElementById("gameCanvas"), message: document.getElementById("gameMessage"), controls: document.getElementById("touchControls"), controlHint: document.getElementById("controlHint"), resultTitle: document.getElementById("resultTitle"), resultCopy: document.getElementById("resultCopy"), stats: document.getElementById("resultStats"), retry: document.getElementById("retryBtn"), home: document.getElementById("homeBtn")
  };
  const ctx = ui.canvas.getContext("2d");
  const state = { running: false, confirming: false, score: 0, best: Number(localStorage.getItem(`weightplay-${gameId}-best`) || 0), level: 1, result: null, lastTime: 0, input: {}, maze: null, space: null };
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeLocale = routeLocaleMap[window.location.pathname.split("/").filter(Boolean)[0]];
  let locale = routeLocale || localStorage.getItem("weightplay-locale") || "en";
  if (!localeKeys.includes(locale)) locale = "en";
  let audioContext = null;
  const sharedSoundMuted = () => typeof window.WonderSound?.isMuted === "function"
    ? Boolean(window.WonderSound.isMuted())
    : null;
  let muted = sharedSoundMuted() ?? (localStorage.getItem("weightplay-sound") === "off");
  let swipeStart = null;
  let canvasSizing = { width: 0, height: 0, dpr: 0 };

  const EXTRA_UI = { rapid: { en: "Rapid Fire", "zh-Hant": "連射", "zh-Hans": "连射", ja: "連射", ko: "연사", es: "Fuego rápido", "pt-BR": "Fogo rápido", fr: "Tir rapide", de: "Schnellfeuer", it: "Fuoco rapido", ru: "Скорострельность", hi: "रैपिड फायर", ar: "نيران سريعة" } };
  const SPACE_HINTS = {
    shieldCue: { en: "Shield pulse ready — time it for a close pass.", "zh-Hant": "護盾脈衝已準備好——在危險擦身時使用。", "zh-Hans": "护盾脉冲已准备好——在危险擦身时使用。", ja: "シールドパルス準備完了。接近時に使おう。", ko: "실드 펄스 준비 완료 — 가까이 스칠 때 사용하세요.", es: "Pulso de escudo listo: úsalo al pasar cerca.", "pt-BR": "Pulso de escudo pronto: use-o ao passar perto.", fr: "Impulsion de bouclier prête : utilisez-la lors d’un passage proche.", de: "Schildimpuls bereit – nutze ihn beim engen Vorbeiflug.", it: "Impulso dello scudo pronto: usalo al passaggio ravvicinato.", ru: "Импульс щита готов — используйте его при близком проходе.", hi: "शील्ड पल्स तैयार है — पास से गुजरते समय उपयोग करें।", ar: "نبضة الدرع جاهزة — استخدمها عند المرور القريب." },
    shieldSpentCue: { en: "Shield spent — {count} charges remain.", "zh-Hant": "護盾已消耗——剩餘 {count} 次。", "zh-Hans": "护盾已消耗——剩余 {count} 次。", ja: "シールドを消費。残り {count} 回。", ko: "실드 사용 — {count}회 남았습니다.", es: "Escudo gastado: quedan {count} cargas.", "pt-BR": "Escudo gasto: restam {count} cargas.", fr: "Bouclier dépensé : il reste {count} charges.", de: "Schild verbraucht – {count} Ladungen übrig.", it: "Scudo consumato: restano {count} cariche.", ru: "Щит израсходован — осталось зарядов: {count}.", hi: "शील्ड खर्च हुआ — {count} चार्ज बाकी हैं।", ar: "استهلك الدرع — تبقت {count} شحنات." },
    driftCue: { en: "Tap thrust once, then watch the drift.", "zh-Hant": "輕按推進，觀察飛船漂移。", "zh-Hans": "轻按推进，观察飞船漂移。", ja: "推進を一度押して、漂い方を見よう。", ko: "추진을 한 번 누르고 비행선의 관성을 보세요.", es: "Pulsa impulso una vez y observa la deriva.", "pt-BR": "Toque no impulso uma vez e observe a deriva.", fr: "Touchez la poussée une fois et observez la dérive.", de: "Tippe einmal auf Schub und beobachte den Drift.", it: "Tocca la spinta una volta e osserva la deriva.", ru: "Нажмите тягу один раз и наблюдайте дрейф.", hi: "थ्रस्ट एक बार दबाएँ और बहाव देखें।", ar: "اضغط الدفع مرة واحدة ثم راقب الانجراف." },
    aimCue: { en: "The gold line shows your fire direction. Rotate to line up a remaining rock.", "zh-Hant": "金色線是射擊方向。旋轉飛船，讓它對準剩下的晶礦。", "zh-Hans": "金色线是射击方向。旋转飞船，让它对准剩下的晶矿。", ja: "金色の線が射撃方向。回転して残る岩に合わせよう。", ko: "금색 선이 발사 방향입니다. 회전해 남은 바위에 맞추세요.", es: "La línea dorada muestra tu dirección de disparo. Gira para alinear una roca restante.", "pt-BR": "A linha dourada mostra sua direção de tiro. Gire para alinhar uma rocha restante.", fr: "La ligne dorée indique votre direction de tir. Tournez pour aligner un rocher restant.", de: "Die goldene Linie zeigt deine Schussrichtung. Drehe, um einen verbleibenden Felsen auszurichten.", it: "La linea dorata mostra la direzione dei colpi. Ruota per allineare una roccia rimasta.", ru: "Золотая линия показывает направление огня. Повернитесь к оставшейся глыбе.", hi: "सुनहरी रेखा आपकी फायर दिशा दिखाती है। बची चट्टान पर इसे मिलाने के लिए घूमें।", ar: "الخط الذهبي يوضح اتجاه إطلاقك. أدر المركبة لمحاذاة صخرة متبقية." },
    reacquireCue: { en: "One fragment remains. Rotate until the gold line points at it.", "zh-Hant": "只剩一塊碎片。旋轉，直到金色線指向它。", "zh-Hans": "只剩一块碎片。旋转，直到金色线指向它。", ja: "残りは1つ。金色の線が向くまで回転しよう。", ko: "파편 하나만 남았습니다. 금색 선이 가리킬 때까지 회전하세요.", es: "Queda un fragmento. Gira hasta que la línea dorada lo señale.", "pt-BR": "Resta um fragmento. Gire até a linha dourada apontar para ele.", fr: "Il reste un fragment. Tournez jusqu’à ce que la ligne dorée le pointe.", de: "Ein Fragment bleibt. Drehe, bis die goldene Linie darauf zeigt.", it: "Resta un frammento. Ruota finché la linea dorata non lo indica.", ru: "Осколок остался один. Повернитесь так, чтобы золотая линия указывала на него.", hi: "एक टुकड़ा बचा है। सुनहरी रेखा उस पर आए तब तक घूमें।", ar: "تبقى جزء واحد. أدر المركبة حتى يشير الخط الذهبي إليه." },
    guardianCue: { en: "Guardian phase: find the orange core.", "zh-Hant": "守護階段：鎖定橘色核心。", "zh-Hans": "守护阶段：锁定橙色核心。", ja: "ガーディアン段階：橙色コアを狙おう。", ko: "수호 단계: 주황색 코어를 노리세요.", es: "Fase guardián: busca el núcleo naranja.", "pt-BR": "Fase guardiã: encontre o núcleo laranja.", fr: "Phase gardien : visez le noyau orange.", de: "Wächterphase: Ziele auf den orangefarbenen Kern.", it: "Fase guardiano: cerca il nucleo arancione.", ru: "Фаза стража: найдите оранжевое ядро.", hi: "गार्डियन चरण: नारंगी कोर खोजें।", ar: "مرحلة الحارس: ابحث عن النواة البرتقالية." },
    guardianHitCue: { en: "Guardian hit! Keep the orbit and finish the wave.", "zh-Hant": "命中守護核心！維持軌道完成這一波。", "zh-Hans": "命中守护核心！保持轨道完成这一波。", ja: "ガーディアンに命中！軌道を保ってウェーブを終えよう。", ko: "수호자 명중! 궤도를 유지하고 웨이브를 끝내세요.", es: "¡Impacto al guardián! Mantén la órbita y termina la oleada.", "pt-BR": "Guardião atingido! Mantenha a órbita e conclua a onda.", fr: "Gardien touché ! Gardez votre orbite et terminez la vague.", de: "Wächter getroffen! Halte die Umlaufbahn und beende die Welle.", it: "Guardiano colpito! Mantieni l'orbita e chiudi l'ondata.", ru: "Страж поражён! Держите орбиту и завершите волну.", hi: "गार्डियन पर प्रहार! कक्षा बनाए रखें और वेव पूरी करें।", ar: "أصبت الحارس! حافظ على المدار وأنهِ الموجة." }
  };
  const SPACE_WAVE_PLAN = {
    en: { kicker: "Preparation", title: "Three-wave flight plan", intro: "Know what is ahead before your first thrust.", waves: [["Wave 1", "Learn drift", "Rotate, thrust, and clear split rocks."], ["Wave 2", "Control pressure", "Track the UFO and grab Rapid Fire."], ["Wave 3", "Guard the core", "Save Shield for the orange guardian."]] },
    "zh-Hant": { kicker: "準備階段", title: "三波飛行計畫", intro: "第一次推進前，先看懂前方路線。", waves: [["第一波", "熟悉漂移", "旋轉、推進，清除分裂晶礦。"], ["第二波", "控制壓力", "留意 UFO，取得連射能量。"], ["第三波", "守住核心", "把護盾留給橘色守護核心。"]] },
    "zh-Hans": { kicker: "准备阶段", title: "三波飞行计划", intro: "第一次推进前，先看懂前方路线。", waves: [["第一波", "熟悉漂移", "旋转、推进，清除分裂晶矿。"], ["第二波", "控制压力", "留意 UFO，取得连射能量。"], ["第三波", "守住核心", "把护盾留给橙色守护核心。"]] },
    ja: { kicker: "準備", title: "3ウェーブ飛行プラン", intro: "最初の推進前に、先の流れを確認しよう。", waves: [["ウェーブ1", "漂いを学ぶ", "回転と推進で分裂する岩を壊す。"], ["ウェーブ2", "圧力を制御", "UFOを追い、連射を集める。"], ["ウェーブ3", "コアを守る", "シールドを守護コアに残す。"]] },
    ko: { kicker: "준비", title: "3웨이브 비행 계획", intro: "첫 추진 전에 앞으로의 흐름을 확인하세요.", waves: [["웨이브 1", "드리프트 익히기", "회전하고 추진해 분열 바위를 지우세요."], ["웨이브 2", "압박 제어", "UFO를 추적하고 연사 파워를 얻으세요."], ["웨이브 3", "코어 지키기", "주황색 수호 코어를 위해 실드를 아끼세요."]] },
    es: { kicker: "Preparación", title: "Plan de tres oleadas", intro: "Mira lo que viene antes de tu primer impulso.", waves: [["Oleada 1", "Aprende la deriva", "Gira, impulsa y limpia rocas divididas."], ["Oleada 2", "Controla la presión", "Sigue al OVNI y recoge Fuego rápido."], ["Oleada 3", "Protege el núcleo", "Guarda el escudo para el guardián naranja."]] },
    "pt-BR": { kicker: "Preparação", title: "Plano de três ondas", intro: "Veja o que vem antes do seu primeiro impulso.", waves: [["Onda 1", "Aprenda a deriva", "Gire, acelere e limpe rochas divididas."], ["Onda 2", "Controle a pressão", "Siga o UFO e pegue Fogo rápido."], ["Onda 3", "Proteja o núcleo", "Guarde o escudo para o guardião laranja."]] },
    fr: { kicker: "Préparation", title: "Plan en trois vagues", intro: "Voyez la suite avant votre première poussée.", waves: [["Vague 1", "Apprendre la dérive", "Tournez, poussez et détruisez les rochers divisés."], ["Vague 2", "Gérer la pression", "Suivez l’OVNI et prenez le tir rapide."], ["Vague 3", "Garder le noyau", "Gardez le bouclier pour le gardien orange."]] },
    de: { kicker: "Vorbereitung", title: "Flugplan für drei Wellen", intro: "Sieh voraus, bevor du erstmals Schub gibst.", waves: [["Welle 1", "Drift lernen", "Drehe, schiebe und räume geteilte Felsen."], ["Welle 2", "Druck steuern", "Verfolge das UFO und sammle Schnellfeuer."], ["Welle 3", "Kern schützen", "Spare den Schild für den orangen Wächter."]] },
    it: { kicker: "Preparazione", title: "Piano di volo in tre ondate", intro: "Guarda cosa ti aspetta prima della prima spinta.", waves: [["Ondata 1", "Impara la deriva", "Ruota, spingi e libera le rocce divise."], ["Ondata 2", "Controlla la pressione", "Segui l’UFO e raccogli il Fuoco rapido."], ["Ondata 3", "Proteggi il nucleo", "Conserva lo scudo per il guardiano arancione."]] },
    ru: { kicker: "Подготовка", title: "План полёта на три волны", intro: "Узнайте, что впереди, до первой тяги.", waves: [["Волна 1", "Освойте дрейф", "Поворачивайте, ускоряйтесь и разбивайте глыбы."], ["Волна 2", "Держите давление", "Следите за НЛО и соберите скорострельность."], ["Волна 3", "Защитите ядро", "Берегите щит для оранжевого стража."]] },
    hi: { kicker: "तैयारी", title: "तीन लहरों की उड़ान योजना", intro: "पहले थ्रस्ट से पहले आगे का रास्ता समझें।", waves: [["लहर 1", "बहाव सीखें", "घूमें, थ्रस्ट करें और टूटे पत्थर साफ़ करें।"], ["लहर 2", "दबाव संभालें", "UFO पर नज़र रखें और रैपिड फायर लें।"], ["लहर 3", "कोर बचाएँ", "नारंगी गार्डियन के लिए शील्ड बचाएँ।"]] },
    ar: { kicker: "التحضير", title: "خطة الطيران لثلاث موجات", intro: "اعرف ما ينتظرك قبل أول دفعة.", waves: [["الموجة 1", "تعلم الانجراف", "أدر المركبة وادفع وحطم الصخور المتشظية."], ["الموجة 2", "تحكم بالضغط", "راقب الـUFO واجمع النيران السريعة."], ["الموجة 3", "احمِ النواة", "احتفظ بالدرع للحارس البرتقالي."]] }
  };
  const SPACE_RESULT = {
    win: { en: "Sector cleared!", "zh-Hant": "星域清除！", "zh-Hans": "星域清除！", ja: "セクター制圧！", ko: "구역 클리어!", es: "¡Sector despejado!", "pt-BR": "Setor limpo!", fr: "Secteur nettoyé !", de: "Sektor geräumt!", it: "Settore ripulito!", ru: "Сектор очищен!", hi: "क्षेत्र साफ़!", ar: "تم تطهير القطاع!" },
    lose: { en: "Ship lost", "zh-Hant": "飛船失守", "zh-Hans": "飞船失守", ja: "船体を失った", ko: "함선 격파", es: "Nave perdida", "pt-BR": "Nave perdida", fr: "Vaisseau perdu", de: "Schiff verloren", it: "Nave perduta", ru: "Корабль потерян", hi: "जहाज़ नष्ट", ar: "السفينة تحطمت" },
    winCopy: { en: "You broke the crystal field and secured the sector.", "zh-Hant": "你擊破晶岩區，守住了星域。", "zh-Hans": "你击破晶岩区，守住了星域。", ja: "クリスタルフィールドを突破し、セクターを守った。", ko: "수정 지대를 돌파하고 구역을 지켰습니다.", es: "Rompiste el campo cristalino y aseguraste el sector.", "pt-BR": "Você rompeu o campo cristalino e protegeu o setor.", fr: "Vous avez brisé le champ cristallin et sécurisé le secteur.", de: "Du hast das Kristallfeld durchbrochen und den Sektor gesichert.", it: "Hai infranto il campo cristallino e protetto il settore.", ru: "Вы пробили кристаллическое поле и защитили сектор.", hi: "आपने क्रिस्टल क्षेत्र तोड़कर सेक्टर को सुरक्षित किया।", ar: "حطمت الحقل البلوري وأمّنت القطاع." },
    loseCopy: { en: "The crystal field closed in. Tune your drift and try again.", "zh-Hant": "晶岩區逼近了。調整漂移，再試一次。", "zh-Hans": "晶岩区逼近了。调整漂移，再试一次。", ja: "クリスタルフィールドに囲まれた。ドリフトを整えて再挑戦しよう。", ko: "수정 지대가 좁혀 왔습니다. 드리프트를 다듬고 다시 도전하세요.", es: "El campo cristalino se cerró. Ajusta tu deriva e inténtalo de nuevo.", "pt-BR": "O campo cristalino fechou. Ajuste a deriva e tente novamente.", fr: "Le champ cristallin s'est refermé. Ajustez votre dérive et réessayez.", de: "Das Kristallfeld schloss sich. Justiere deinen Drift und versuche es erneut.", it: "Il campo cristallino si è chiuso. Regola la deriva e riprova.", ru: "Кристаллическое поле сомкнулось. Настройте дрейф и попробуйте снова.", hi: "क्रिस्टल क्षेत्र बंद हो गया। अपनी ड्रिफ्ट सुधारें और फिर कोशिश करें।", ar: "انغلق الحقل البلوري. اضبط الانجراف وحاول مجددًا." }
  };
  const SPACE_UI_ZH_HANT = {
    language: "語言", score: "分數", best: "最佳", level: "等級", wave: "波次", power: "能量", restart: "重新開始", return: "←",
    soundOn: "開啟音效", soundOff: "關閉音效", stay: "繼續遊戲", leave: "離開", confirm: "要離開這一局嗎？目前分數會遺失。",
    retry: "再玩一次", home: "回到主畫面", footer: "WeightPlay 原創街機遊戲", stage: "階段", shield: "護盾", muted: "音效已關閉",
    ready: "選擇路線後開始移動。", hit: "小心！調整漂移，繼續前進。", clear: "清除完成！下一個挑戰即將開始。",
    powerReady: "信標啟動", powerEmpty: "收集信標", controlsSpace: "鍵盤：←→旋轉 · ↑推進 · 空白鍵射擊 · Shift 護盾",
    scoreStat: "最終分數", bestStat: "最佳分數", waveStat: "到達波次", shotsStat: "射擊次數", fragmentsStat: "清除碎片數",
  };
  const SPACE_GAME_TEXT_ZH_HANT = {
    title: "星礦漂流",
    tagline: "漂移、向各個方向瞄準，在晶礦區逼近前擊破它。",
    objective: "清除三波挑戰：擊碎礦群、取得連射，並撐過守護核心。",
    guide: "飛船在推進後仍會持續漂移。旋轉並短按推進來調整軌道，再用空白鍵射擊。大型晶礦會分裂成中型，再分裂成小碎片。把護盾留給近距離碰撞；第三波會出現守護核心。",
    hint: "旋轉 · 推進 · 射擊 · 護盾",
  };
  const spaceHint = (key, replacements = {}) => {
    let text = SPACE_HINTS[key]?.[locale] || SPACE_HINTS[key]?.en || "";
    Object.entries(replacements).forEach(([name, value]) => { text = text.replace(`{${name}}`, String(value)); });
    return text;
  };
  const GRACE_COPY = { en: "Recovery window", "zh-Hant": "保護時間", "zh-Hans": "保护时间", ja: "回復猶予", ko: "회복 보호 시간", es: "Ventana de recuperación", "pt-BR": "Janela de recuperação", fr: "Fenêtre de récupération", de: "Schutzzeit", it: "Finestra di recupero", ru: "Окно восстановления", hi: "सुरक्षा समय", ar: "نافذة التعافي" };
  const PROGRESS_COPY = { en: "To clear", "zh-Hant": "清關進度", "zh-Hans": "清关进度", ja: "クリア進捗", ko: "클리어 진행", es: "Progreso", "pt-BR": "Progresso", fr: "Progression", de: "Fortschritt", it: "Progresso", ru: "Прогресс", hi: "क्लियर प्रगति", ar: "تقدم التطهير" };
  const tr = (key) => (gameId === "space" && locale === "zh-Hant" && SPACE_UI_ZH_HANT[key])
    || (key === "grace" ? (GRACE_COPY[locale] || GRACE_COPY.en) : key === "progress" ? (PROGRESS_COPY[locale] || PROGRESS_COPY.en) : (EXTRA_UI[key] && (EXTRA_UI[key][locale] || EXTRA_UI[key].en)) || (UI[locale] && UI[locale][key]) || UI.en[key]);
  const resultText = (key) => gameId === "space" ? (SPACE_RESULT[key]?.[locale] || SPACE_RESULT[key]?.en || "") : tr(key);
  const gt = (key) => (gameId === "space" && locale === "zh-Hant" && SPACE_GAME_TEXT_ZH_HANT[key])
    || (GAME_TEXT[gameId][key] && (GAME_TEXT[gameId][key][locale] || GAME_TEXT[gameId][key].en)) || "";
  const label = (name, value) => `${name}: ${value}`;

  function ensureAudio() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
  }
  function tone(frequency, duration = 0.06, type = "sine", volume = 0.035) {
    if (muted) return;
    try {
      ensureAudio();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type; oscillator.frequency.value = frequency; gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
    } catch { /* Audio is an enhancement; gameplay remains available. */ }
  }

  function setMessage(text, toneName = "") { ui.message.textContent = text; ui.message.dataset.tone = toneName; }
  function setLocale(nextLocale) {
    locale = localeKeys.includes(nextLocale) ? nextLocale : "en";
    localStorage.setItem("weightplay-locale", locale);
    localStorage.setItem("weightPlayLocale", locale);
    window.WonderI18n?.setLocale?.(locale);
    document.documentElement.lang = locale === "zh-Hant" ? "zh-TW" : locale === "zh-Hans" ? "zh-CN" : locale;
    const gameTitle = gt("title");
    document.title = `${gameTitle} | WeightPlay`;
    ui.eyebrow.textContent = gameId === "space" && locale === "zh-Hant" ? "WEIGHTPLAY · 原創街機" : "WEIGHTPLAY · ORIGINAL ARCADE";
    ui.title.textContent = gameTitle;
    ui.tagline.textContent = gt("tagline");
    ui.objective.textContent = gt("objective");
    const pilotName = gameId === "space" && locale === "zh-Hant" ? "魯克" : gameId === "maze" ? "Orla" : "Rux";
    ui.guide.innerHTML = `<strong>${pilotName}</strong> · ${gt("guide")}`;
    if (ui.wavePlan) {
      const plan = SPACE_WAVE_PLAN[locale] || SPACE_WAVE_PLAN.en;
      ui.wavePlan.hidden = gameId !== "space";
      ui.wavePlanKicker.textContent = plan.kicker;
      ui.wavePlanTitle.textContent = plan.title;
      ui.wavePlanIntro.textContent = plan.intro;
      ui.wavePlanList.replaceChildren();
      plan.waves.forEach(([labelText, titleText, copyText]) => {
        const item = document.createElement("li");
        item.className = "wave-plan-step";
        const label = document.createElement("span");
        label.className = "wave-plan-label";
        label.textContent = labelText;
        const title = document.createElement("strong");
        title.textContent = titleText;
        const copy = document.createElement("p");
        copy.textContent = copyText;
        item.append(label, title, copy);
        ui.wavePlanList.append(item);
      });
    }
    ui.language.textContent = tr("language");
    ui.start.textContent = locale === "en" ? "Start Game" : locale === "zh-Hant" ? "開始遊戲" : locale === "zh-Hans" ? "开始游戏" : locale === "ja" ? "ゲーム開始" : locale === "ko" ? "게임 시작" : locale === "es" ? "Comenzar" : locale === "pt-BR" ? "Começar" : locale === "fr" ? "Commencer" : locale === "de" ? "Starten" : locale === "it" ? "Inizia" : locale === "ru" ? "Начать игру" : locale === "hi" ? "खेल शुरू करें" : "ابدأ اللعبة";
    ui.round.textContent = gameId === "maze" ? `${tr("stage")} ${state.level}` : `${tr("wave")} ${state.level}`;
    ui.back.textContent = tr("return"); ui.back.setAttribute("aria-label", tr("home"));
    ui.sound.textContent = muted ? "🔇" : "🔊"; ui.sound.setAttribute("aria-label", muted ? tr("soundOff") : tr("soundOn"));
    ui.restart.textContent = tr("restart"); ui.scoreLabel.textContent = tr("score"); ui.bestLabel.textContent = tr("best"); ui.levelLabel.textContent = gameId === "maze" ? tr("level") : tr("wave"); ui.powerLabel.textContent = gameId === "maze" ? tr("power") : tr("shield"); if (ui.livesLabel && ui.livesHud) { ui.livesLabel.textContent = tr("livesStat"); ui.livesHud.hidden = gameId !== "maze"; }
    ui.confirmCopy.textContent = tr("confirm"); ui.stay.textContent = tr("stay"); ui.leave.textContent = tr("leave"); ui.retry.textContent = tr("retry"); ui.home.textContent = tr("home"); ui.controlHint.textContent = gameId === "maze" ? `${gt("hint")} · ${tr("controlsMaze")}` : `${gt("hint")} · ${tr("controlsSpace")}`;
    ui.cover.src = gameId === "maze" ? "../../assets/maze-chase-cover.png" : "../../assets/space-rocks-cover.png";
    ui.cover.alt = `${gameTitle} original WeightPlay cover`;
    ui.footer.textContent = tr("footer");
    if (ui.result && !ui.result.hidden) renderResult();
    updateHud();
  }

  function setSoundMuted(nextMuted) {
    const desired = Boolean(nextMuted);
    if (typeof window.WonderSound?.setMuted === "function") {
      window.WonderSound.setMuted(desired);
      muted = Boolean(window.WonderSound.isMuted?.() ?? desired);
    } else {
      muted = desired;
      localStorage.setItem("weightplay-sound", muted ? "off" : "on");
    }
    setLocale(locale);
  }

  function populateLocales() {
    ui.locale.replaceChildren();
    const names = { en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어", es: "Español", "pt-BR": "Português", fr: "Français", de: "Deutsch", it: "Italiano", ru: "Русский", hi: "हिन्दी", ar: "العربية" };
    localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = names[key]; option.selected = key === locale; ui.locale.append(option); });
    ui.locale.addEventListener("change", (event) => setLocale(event.target.value));
  }

  function updateHud() {
    ui.score.textContent = String(state.score);
    ui.best.textContent = String(state.best);
    ui.level.textContent = String(state.level);
    if (ui.lives) ui.lives.textContent = String(state.maze?.lives ?? 5);
    if (ui.progressLabel && ui.progress) { const total = state.maze?.pelletTotal || 0; const cleared = total ? total - state.maze.pellets.size : 0; ui.progressLabel.textContent = tr("progress"); ui.progress.textContent = gameId === "maze" && total ? `${cleared}/${total}` : "—"; }
    if (gameId === "maze") ui.power.textContent = state.maze && state.maze.power > 0 ? `${Math.ceil(state.maze.power / 1000)}s` : tr("powerEmpty");
    else ui.power.textContent = state.space ? `${tr("shield")} ${Math.max(0, 5 - state.space.hits)} · ${state.space.rapid > 0 ? tr("rapid") : "—"}` : "—";
    ui.round.textContent = gameId === "maze" ? `${tr("stage")} ${state.level}` : `${tr("wave")} ${state.level}`;
  }

  function syncPlayViewport() {
    const viewport = window.visualViewport;
    const width = Math.round(viewport?.width || window.innerWidth);
    const height = Math.round(viewport?.height || window.innerHeight);
    document.documentElement.style.setProperty("--wp-mobile-vw", `${width}px`);
    document.documentElement.style.setProperty("--wp-mobile-vh", `${height}px`);
  }

  function setPlayMode(active) {
    document.documentElement.classList.toggle("wp-classic-battle-active", active);
    document.body.classList.toggle("is-game-playing", active);
    if (active) {
      syncPlayViewport();
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ left: 0, top: 0, behavior: "instant" });
      window.requestAnimationFrame(() => window.scrollTo({ left: 0, top: 0, behavior: "instant" }));
    }
  }

  function resizeCanvas(logicalWidth, logicalHeight) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvasSizing.width !== logicalWidth || canvasSizing.height !== logicalHeight || canvasSizing.dpr !== dpr) {
      ui.canvas.width = Math.round(logicalWidth * dpr); ui.canvas.height = Math.round(logicalHeight * dpr);
      canvasSizing = { width: logicalWidth, height: logicalHeight, dpr };
    }
    ui.canvas.style.aspectRatio = `${logicalWidth} / ${logicalHeight}`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function wrap(value, max) { return value < 0 ? value + max : value >= max ? value - max : value; }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  function mazeCanMove(x, y) { return MAZE_MAP[y] && MAZE_MAP[y][x] && MAZE_MAP[y][x] !== "#"; }
  function mazeResetStage() {
    const pellets = new Set(); const beacons = new Set();
    MAZE_MAP.forEach((row, y) => [...row].forEach((cell, x) => { if (cell !== "#" && !(x === 1 && y === 1)) pellets.add(`${x},${y}`); if (cell === "o") beacons.add(`${x},${y}`); }));
    const homeSets = [
      [[13, 1], [1, 13], [13, 13], [7, 5]],
      [[1, 13], [13, 1], [7, 5], [13, 13]],
      [[13, 13], [7, 5], [1, 13], [13, 1]],
    ];
    const homes = homeSets[(state.level - 1) % homeSets.length];
    state.maze = { player: { x: 1, y: 1, dir: "down", next: "down", grace: 6000 }, pellets, pelletTotal: pellets.size, beacons, power: 0, moveClock: 0, enemyClock: -4500, combo: 0, lives: 5, enemies: [
      { x: homes[0][0], y: homes[0][1], homeX: homes[0][0], homeY: homes[0][1], type: "direct", color: "#ff7d9f" }, { x: homes[1][0], y: homes[1][1], homeX: homes[1][0], homeY: homes[1][1], type: "predict", color: "#68e1ff" }, { x: homes[2][0], y: homes[2][1], homeX: homes[2][0], homeY: homes[2][1], type: "ambush", color: "#c48cff" }, { x: homes[3][0], y: homes[3][1], homeX: homes[3][0], homeY: homes[3][1], type: "wander", color: "#ffd66d" }
    ] };
    state.input = {};
    setMessage(tr("ready")); updateHud(); drawMaze();
  }
  function mazeSetDirection(direction) { if (gameId !== "maze" || !state.running) return; state.maze.player.next = direction; tone(280, 0.025, "triangle", 0.018); }
  function mazeResolvePlayerCollision() {
    const maze = state.maze; const player = maze.player;
    const enemy = maze.enemies.find((item) => item.x === player.x && item.y === player.y);
    if (!enemy) return;
    if (maze.power > 0) { state.score += 200 + maze.combo * 100; maze.combo += 1; enemy.x = enemy.homeX; enemy.y = enemy.homeY; tone(180 + maze.combo * 80, 0.11, "square", 0.04); return; }
    if (player.grace > 0) { setMessage(tr("grace"), "success"); tone(480, 0.06, "triangle", 0.025); return; }
    state.maze.player = { x: player.x, y: player.y, dir: player.dir, next: player.next, grace: 6000 };
    state.maze.enemies.forEach((item) => { item.x = item.homeX; item.y = item.homeY; }); state.maze.power = 0; state.maze.moveClock = 0; state.maze.enemyClock = -4500; state.maze.lives = (state.maze.lives || 5) - 1;
    setMessage(tr("hit"), "danger"); tone(120, 0.2, "sawtooth", 0.05); if (state.maze.lives <= 0) finish(false, { stage: state.level, lives: 0 });
  }
  function mazeStepPlayer() {
    const maze = state.maze; const player = maze.player; const next = DIRS[player.next];
    if (mazeCanMove(player.x + next.x, player.y + next.y)) player.dir = player.next;
    const current = DIRS[player.dir];
    if (mazeCanMove(player.x + current.x, player.y + current.y)) { player.x += current.x; player.y += current.y; }
    const key = `${player.x},${player.y}`;
    if (maze.pellets.delete(key)) { state.score += maze.power > 0 ? 20 : 10; tone(620, 0.04, "sine", 0.025); }
    if (maze.beacons.has(key)) { maze.beacons.delete(key); maze.power = 18000; maze.combo = 0; state.score += 50; tone(880, 0.16, "square", 0.035); setMessage(tr("powerReady"), "success"); }
    mazeResolvePlayerCollision();
    if (!state.running) return;
    if (!maze.pellets.size) {
      if (state.level >= 3) finish(true, { stage: state.level });
      else { state.level += 1; mazeResetStage(); setMessage(tr("clear"), "success"); tone(980, 0.2, "triangle", 0.035); }
    }
  }
  function mazeEnemyStep() {
    const maze = state.maze; const player = maze.player;
    maze.enemies.forEach((enemy) => {
      if (!state.running || state.maze.player !== player) return;
      const choices = DIR_LIST.filter(([, dir]) => mazeCanMove(enemy.x + dir.x, enemy.y + dir.y));
      const projected = enemy.type === "predict" ? { x: player.x + DIRS[player.dir].x * 3, y: player.y + DIRS[player.dir].y * 3 } : enemy.type === "ambush" ? { x: player.x + DIRS[player.dir].x * 5 + (player.y % 2 ? 2 : -2), y: player.y + DIRS[player.dir].y * 5 } : player;
      choices.sort((a, b) => {
        if (enemy.type === "wander") return Math.random() - 0.5;
        const da = Math.abs(enemy.x + a[1].x - projected.x) + Math.abs(enemy.y + a[1].y - projected.y);
        const db = Math.abs(enemy.x + b[1].x - projected.x) + Math.abs(enemy.y + b[1].y - projected.y);
        return maze.power > 0 ? db - da : da - db;
      });
      const choice = choices[0]; if (choice) { enemy.x += choice[1].x; enemy.y += choice[1].y; }
      mazeResolvePlayerCollision();
    });
  }
  function updateMaze(dt) {
    const maze = state.maze; maze.power = Math.max(0, maze.power - dt * 1000); maze.player.grace = Math.max(0, (maze.player.grace || 0) - dt * 1000); maze.moveClock += dt * 1000; maze.enemyClock += dt * 1000;
    const playerRate = Math.max(72, 126 - state.level * 10); const enemyRate = Math.max(1000, 2900 - state.level * 500);
    while (maze.moveClock >= playerRate) { maze.moveClock -= playerRate; mazeStepPlayer(); if (!state.running) return; }
    while (maze.enemyClock >= enemyRate) { maze.enemyClock -= enemyRate; mazeEnemyStep(); if (!state.running) return; }
    updateHud(); drawMaze();
  }
  function drawMaze() {
    const w = 630, h = 630; resizeCanvas(w, h); ctx.fillStyle = "#071333"; ctx.fillRect(0, 0, w, h);
    const tile = 42;
    MAZE_MAP.forEach((row, y) => [...row].forEach((cell, x) => { if (cell === "#") { ctx.fillStyle = "#152d61"; ctx.fillRect(x * tile, y * tile, tile, tile); ctx.strokeStyle = "#3f83bd"; ctx.lineWidth = 2; ctx.strokeRect(x * tile + 3, y * tile + 3, tile - 6, tile - 6); } }));
    if (!state.maze) return;
    state.maze.pellets.forEach((key) => { const [x, y] = key.split(",").map(Number); ctx.fillStyle = "#ffe59a"; ctx.beginPath(); ctx.arc(x * tile + tile / 2, y * tile + tile / 2, 4, 0, Math.PI * 2); ctx.fill(); });
    state.maze.beacons.forEach((key) => { const [x, y] = key.split(",").map(Number); const pulse = 7 + Math.sin(performance.now() / 180) * 2; ctx.fillStyle = "#ffc962"; ctx.shadowColor = "#ffd66d"; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x * tile + tile / 2, y * tile + tile / 2, pulse, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; });
    const p = state.maze.player; ctx.save(); ctx.translate(p.x * tile + tile / 2, p.y * tile + tile / 2); ctx.fillStyle = "#d9f6ff"; ctx.beginPath(); ctx.arc(0, 2, 15, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#29306f"; ctx.beginPath(); ctx.arc(-7, -11, 11, Math.PI, 0); ctx.fill(); ctx.fillStyle = "#ffd66d"; ctx.beginPath(); ctx.arc(7, -14, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#17234e"; ctx.beginPath(); ctx.arc(-5, 0, 2, 0, Math.PI * 2); ctx.arc(5, 0, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    state.maze.enemies.forEach((enemy) => { ctx.save(); ctx.translate(enemy.x * tile + tile / 2, enemy.y * tile + tile / 2); ctx.globalAlpha = state.maze.power > 0 ? 0.62 : 1; ctx.fillStyle = state.maze.power > 0 ? "#8bb7ff" : enemy.color; ctx.beginPath(); ctx.arc(0, 2, 14, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-5, -2, 4, 0, Math.PI * 2); ctx.arc(5, -2, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#1a234d"; ctx.beginPath(); ctx.arc(-5, -2, 2, 0, Math.PI * 2); ctx.arc(5, -2, 2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = state.maze.power > 0 ? "#d9f6ff" : enemy.color; ctx.lineWidth = 2; if (enemy.type === "direct") { ctx.fillRect(-4, -16, 8, 4); } else if (enemy.type === "predict") { ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(6, -10); ctx.lineTo(-6, -10); ctx.closePath(); ctx.fill(); } else if (enemy.type === "ambush") { ctx.beginPath(); ctx.moveTo(0, -19); ctx.lineTo(6, -13); ctx.lineTo(0, -7); ctx.lineTo(-6, -13); ctx.closePath(); ctx.fill(); } else { ctx.beginPath(); ctx.arc(0, -13, 5, 0, Math.PI * 2); ctx.stroke(); } ctx.restore(); });
  }

  function randomAngle(seed) { return (seed * 1.61803398875) % (Math.PI * 2); }
  function spawnRock(size, x, y, angle, speed, boss = false) { const radius = boss ? 60 : size === 2 ? 38 : size === 1 ? 23 : 13; state.space.rocks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size, radius, boss, hp: boss ? 8 : 1, spin: randomAngle(size + x + y) }); }
  function spawnSpaceWave() {
    const space = state.space; space.rocks = []; space.bullets = []; space.particles = []; space.transition = 0; space.ufo = null;
    const count = 2 + state.level;
    for (let i = 0; i < count; i++) { const side = i % 2 ? 0 : 960; spawnRock(2, side, 78 + i * 92, randomAngle(i + state.level), 28 + state.level * 6); }
    if (state.level === 3) spawnRock(2, 480, 92, 0.7, 20, true);
    if (state.level >= 2) space.ufo = { x: 90, y: 100, vx: 38, cooldown: 1.7 };
  }
  function resetSpace() { state.space = { ship: { x: 480, y: 270, vx: 0, vy: 0, angle: -Math.PI / 2 }, rocks: [], bullets: [], particles: [], rapid: 0, hits: 0, invincible: 3.2, fireClock: 0, combo: 0, comboClock: 0, transition: 0, tutorialClock: 6, aimCueClock: 0, aimCueSeen: false, guardianFlash: 0, ufo: null, shots: 0, fragments: 0 }; spawnSpaceWave(); state.input = {}; updateHud(); drawSpace(); setMessage(tr("ready")); }
  function spaceShoot() { if (!state.running || gameId !== "space") return; const space = state.space; if (space.fireClock > 0) return; const ship = space.ship; const speed = 410; space.bullets.push({ x: ship.x + Math.cos(ship.angle) * 18, y: ship.y + Math.sin(ship.angle) * 18, vx: ship.vx + Math.cos(ship.angle) * speed, vy: ship.vy + Math.sin(ship.angle) * speed, life: 1.45 }); space.fireClock = space.rapid > 0 ? 0.075 : 0.16; space.shots += 1; if (!space.aimCueSeen) { space.aimCueSeen = true; space.aimCueClock = 4; setMessage(spaceHint("aimCue"), "success"); } tone(710, 0.045, "square", 0.022); }
  function spaceShield() { if (!state.running || gameId !== "space" || state.space.hits >= 5) return; state.input.shield = true; setMessage(spaceHint("shieldCue"), "success"); }
  function updateSpace(dt) {
    const space = state.space, ship = space.ship, input = state.input; space.fireClock = Math.max(0, space.fireClock - dt); space.rapid = Math.max(0, space.rapid - dt); space.comboClock = Math.max(0, space.comboClock - dt); space.tutorialClock = Math.max(0, space.tutorialClock - dt); space.aimCueClock = Math.max(0, space.aimCueClock - dt); space.guardianFlash = Math.max(0, space.guardianFlash - dt); if (!space.comboClock) space.combo = 0;
    if (input.left) ship.angle -= 3.8 * dt; if (input.right) ship.angle += 3.8 * dt; if (input.thrust) { ship.vx += Math.cos(ship.angle) * 185 * dt; ship.vy += Math.sin(ship.angle) * 185 * dt; if (Math.random() < 0.35) space.particles.push({ x: ship.x - Math.cos(ship.angle) * 13, y: ship.y - Math.sin(ship.angle) * 13, life: 0.25, color: "#ffb15d" }); }
    if (input.fire) spaceShoot(); if (input.shield && space.hits < 5) { space.shielding = true; } else space.shielding = false; input.shield = false;
    ship.vx *= Math.pow(0.992, dt * 60); ship.vy *= Math.pow(0.992, dt * 60); ship.x = wrap(ship.x + ship.vx * dt, 960); ship.y = wrap(ship.y + ship.vy * dt, 540);
    space.bullets.forEach((bullet) => { bullet.x = wrap(bullet.x + bullet.vx * dt, 960); bullet.y = wrap(bullet.y + bullet.vy * dt, 540); bullet.life -= dt; }); space.bullets = space.bullets.filter((bullet) => bullet.life > 0);
    space.rocks.forEach((rock) => { rock.x = wrap(rock.x + rock.vx * dt, 960); rock.y = wrap(rock.y + rock.vy * dt, 540); rock.spin += dt * 0.8; });
    space.particles.forEach((particle) => { particle.life -= dt; }); space.particles = space.particles.filter((particle) => particle.life > 0);
    if (space.ufo) { space.ufo.x = wrap(space.ufo.x + space.ufo.vx * dt, 960); space.ufo.cooldown -= dt; if (space.ufo.cooldown <= 0) { space.ufo.cooldown = 1.8; const a = Math.atan2(ship.y - space.ufo.y, ship.x - space.ufo.x); space.bullets.push({ x: space.ufo.x, y: space.ufo.y, vx: Math.cos(a) * 170, vy: Math.sin(a) * 170, life: 2.6, enemy: true }); } }
    for (let b = space.bullets.length - 1; b >= 0; b--) { const bullet = space.bullets[b]; if (bullet.enemy) { if (distance(bullet, ship) < 15) { space.bullets.splice(b, 1); spaceHit(); } continue; } for (let r = space.rocks.length - 1; r >= 0; r--) { const rock = space.rocks[r]; if (distance(bullet, rock) < rock.radius) { space.bullets.splice(b, 1); hitRock(r); break; } } }
    space.rocks.forEach((rock) => { if (distance(rock, ship) < rock.radius + 7) spaceHit(); });
    if (space.transition > 0) { space.transition -= dt; if (space.transition <= 0) { if (state.level >= 3) finish(true, { wave: state.level, shots: space.shots, fragments: space.fragments }); else { state.level += 1; spawnSpaceWave(); if (state.level === 3) { space.guardianFlash = 3; setMessage(spaceHint("guardianCue"), "success"); tone(180, 0.28, "sawtooth", 0.05); } else tone(960, 0.16, "triangle", 0.035); } } }
    if (!space.rocks.length && space.transition <= 0) { space.transition = 1.2; setMessage(tr("clear"), "success"); }
    updateHud(); drawSpace();
  }
  function hitRock(index) { const space = state.space, rock = space.rocks[index]; space.rocks.splice(index, 1); state.score += rock.boss ? 1200 : rock.size === 2 ? 90 : rock.size === 1 ? 55 : 30; space.combo += 1; space.comboClock = 2.2; space.fragments += 1; if (rock.boss) { space.guardianFlash = 1.6; setMessage(spaceHint("guardianHitCue"), "success"); for (let i = 0; i < 14; i++) space.particles.push({ x: rock.x, y: rock.y, life: 0.8, color: i % 2 ? "#ffdc8a" : "#ff8b6e" }); } if (!rock.boss && rock.size > 0) { for (let i = 0; i < 2; i++) spawnRock(rock.size - 1, rock.x, rock.y, randomAngle(i + rock.x + state.score), 48 + (2 - rock.size) * 18 + state.level * 4); } if (Math.random() < 0.3) { space.rapid = 8; setMessage(tr("rapid"), "success"); } if (!rock.boss && state.level < 3 && space.rocks.length === 1) { space.aimCueClock = 3.2; setMessage(spaceHint("reacquireCue"), "success"); } tone(rock.boss ? 190 : 420 + rock.size * 80, 0.08, "sawtooth", 0.035); }
  function spaceHit() { const space = state.space; if (space.invincible > 0) return; if (space.shielding && space.hits < 5) { space.hits += 1; space.invincible = 1.8; setMessage(spaceHint("shieldSpentCue", { count: 5 - space.hits }), "success"); tone(300, 0.1, "triangle", 0.04); return; } space.hits += 1; space.invincible = 1.7; space.ship.x = 480; space.ship.y = 270; space.ship.vx = 0; space.ship.vy = 0; setMessage(tr("hit"), "danger"); tone(100, 0.2, "sawtooth", 0.05); if (space.hits >= 5) finish(false, { wave: state.level, shots: space.shots, fragments: space.fragments }); }
  function drawSpace() {
    const w = 960, h = 540; resizeCanvas(w, h); ctx.fillStyle = "#030817"; ctx.fillRect(0, 0, w, h); ctx.save(); for (let i = 0; i < 90; i++) { const x = (i * 137) % w, y = (i * 71) % h; ctx.fillStyle = i % 7 === 0 ? "#9ae9ff" : "rgba(255,255,255,.5)"; ctx.fillRect(x, y, i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1); } ctx.restore();
    if (!state.space) return; const space = state.space;
    if (space.tutorialClock > 0 && state.level === 1 && space.aimCueClock <= 0) { const ship = space.ship; const velocity = Math.hypot(ship.vx, ship.vy) > 8 ? Math.atan2(ship.vy, ship.vx) : ship.angle; const distance = Math.min(120, 34 + Math.hypot(ship.vx, ship.vy) * 0.35); ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(velocity); ctx.strokeStyle = "rgba(255,220,138,.82)"; ctx.fillStyle = "rgba(255,220,138,.82)"; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(distance, 0); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(distance, 0); ctx.lineTo(distance - 14, -8); ctx.lineTo(distance - 14, 8); ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (space.aimCueClock > 0) { const ship = space.ship; const distance = 190; ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle); ctx.strokeStyle = "rgba(255,220,138,.9)"; ctx.fillStyle = "rgba(255,220,138,.9)"; ctx.lineWidth = 3; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(distance, 0); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(distance, 0); ctx.lineTo(distance - 16, -9); ctx.lineTo(distance - 16, 9); ctx.closePath(); ctx.fill(); ctx.restore(); }
    space.particles.forEach((particle) => { ctx.globalAlpha = Math.max(0, particle.life * 4); ctx.fillStyle = particle.color; ctx.beginPath(); ctx.arc(particle.x, particle.y, 4 * particle.life, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
    space.rocks.forEach((rock) => { ctx.save(); ctx.translate(rock.x, rock.y); ctx.rotate(rock.spin); ctx.strokeStyle = rock.boss ? "#ffb15d" : rock.size === 2 ? "#6fe3ff" : rock.size === 1 ? "#a88aff" : "#ffd66d"; ctx.lineWidth = rock.boss ? 5 : 3; ctx.fillStyle = rock.boss ? "rgba(255,131,93,.16)" : "rgba(82,124,214,.14)"; ctx.beginPath(); const points = rock.boss ? 10 : 7; for (let i = 0; i < points; i++) { const angle = (i / points) * Math.PI * 2; const r = rock.radius * (0.78 + ((i * 17) % 23) / 100); const x = Math.cos(angle) * r, y = Math.sin(angle) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.fill(); ctx.stroke(); if (rock.boss) { ctx.fillStyle = "#ffdc8a"; ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill(); if (space.guardianFlash > 0) { ctx.strokeStyle = `rgba(255,240,167,${Math.min(0.9, space.guardianFlash / 2)})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, rock.radius + 16 + Math.sin(performance.now() / 90) * 5, 0, Math.PI * 2); ctx.stroke(); } } ctx.restore(); });
    space.bullets.forEach((bullet) => { ctx.fillStyle = bullet.enemy ? "#ff779d" : "#fff0a7"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.enemy ? 4 : 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; });
    if (space.ufo) { ctx.save(); ctx.translate(space.ufo.x, space.ufo.y); ctx.fillStyle = "#b38cff"; ctx.beginPath(); ctx.ellipse(0, 0, 23, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#d9f6ff"; ctx.beginPath(); ctx.arc(0, -5, 8, Math.PI, 0); ctx.fill(); ctx.restore(); }
    const ship = space.ship; ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle); if (space.shielding) { ctx.strokeStyle = "rgba(104,225,255,.85)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.stroke(); } ctx.fillStyle = "#d9f6ff"; ctx.strokeStyle = "#ffcc73"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(21, 0); ctx.lineTo(-14, -12); ctx.lineTo(-8, 0); ctx.lineTo(-14, 12); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#162856"; ctx.beginPath(); ctx.arc(3, 0, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (space.invincible > 0) space.invincible -= 1 / 60;
  }

  function createControlButton(text, action, mode = "tap") { const button = document.createElement("button"); button.type = "button"; button.className = "control-button"; button.textContent = text; button.dataset.action = action; button.addEventListener("pointerdown", (event) => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); if (mode === "hold") { state.input[action] = true; button.classList.add("is-held"); if (action === "fire") spaceShoot(); if (gameId === "space" && action === "left") state.space.ship.angle -= 0.24; if (gameId === "space" && action === "right") state.space.ship.angle += 0.24; if (gameId === "space" && action === "thrust") { state.space.ship.vx += Math.cos(state.space.ship.angle) * 18; state.space.ship.vy += Math.sin(state.space.ship.angle) * 18; } } else if (gameId === "maze") mazeSetDirection(action); else if (action === "shield") spaceShield(); else if (action === "fire") spaceShoot(); }); ["pointerup", "pointercancel", "lostpointercapture"].forEach((name) => button.addEventListener(name, () => { if (mode === "hold") { state.input[action] = false; button.classList.remove("is-held"); } })); ui.controls.append(button); return button; }
  function buildControls() { ui.controls.replaceChildren(); if (gameId === "maze") { createControlButton("▲", "up"); createControlButton("◀", "left"); createControlButton("▼", "down"); createControlButton("▶", "right"); } else { createControlButton("↺", "left", "hold"); createControlButton("↻", "right", "hold"); createControlButton("▲", "thrust", "hold"); createControlButton("✦", "fire", "hold"); createControlButton("◇", "shield"); } }

  function syncBattleGeometry() { window.WeightPlayBattleCanvas?.sync?.(); }
  function showMain() { state.running = false; state.confirming = false; setPlayMode(false); ui.main.hidden = false; ui.battle.hidden = true; ui.result.hidden = true; ui.battle.classList.remove("has-result"); ui.confirm.hidden = true; window.dispatchEvent(new Event("weightplay:shell-sync")); syncBattleGeometry(); setLocale(locale); ui.start.focus({ preventScroll: true }); }
  function startGame() { ensureAudio(); setPlayMode(true); state.running = true; state.confirming = false; state.score = 0; state.level = 1; state.result = null; ui.main.hidden = true; ui.battle.hidden = false; ui.result.hidden = true; ui.battle.classList.remove("has-result"); ui.confirm.hidden = true; window.dispatchEvent(new Event("weightplay:shell-sync")); window.dispatchEvent(new Event("weightplay:battle-open")); syncBattleGeometry(); if (gameId === "maze") mazeResetStage(); else resetSpace(); ui.canvas.focus(); setMessage(gameId === "space" ? spaceHint("driftCue") : tr("ready")); state.lastTime = performance.now(); requestAnimationFrame(loop); }
  function finish(won, details) { if (!state.running) return; state.running = false; state.result = { won, details }; if (state.score > state.best) { state.best = state.score; localStorage.setItem(`weightplay-${gameId}-best`, String(state.best)); } tone(won ? 880 : 110, won ? 0.25 : 0.3, won ? "triangle" : "sawtooth", 0.05); renderResult(); ui.result.hidden = false; ui.battle.classList.add("has-result"); }
  function renderResult() { if (!state.result) return; const won = state.result.won; ui.resultTitle.textContent = won ? resultText("win") : resultText("lose"); ui.resultCopy.textContent = won ? resultText("winCopy") : resultText("loseCopy"); const d = state.result.details || {}; const rows = gameId === "maze" ? [[tr("scoreStat"), state.score], [tr("bestStat"), state.best], [tr("stageStat"), d.stage || state.level], [tr("livesStat"), state.maze?.lives ?? 0]] : [[tr("scoreStat"), state.score], [tr("bestStat"), state.best], [tr("waveStat"), d.wave || state.level], [tr("shotsStat"), d.shots || state.space?.shots || 0], [tr("fragmentsStat"), d.fragments || state.space?.fragments || 0]]; ui.stats.replaceChildren(); rows.forEach(([name, value]) => { const item = document.createElement("div"); item.className = "stat"; item.innerHTML = `<span>${name}</span><strong>${value}</strong>`; ui.stats.append(item); }); }
  function loop(now) { if (!state.running) return; if (state.confirming) { requestAnimationFrame(loop); return; } const dt = Math.min(0.05, Math.max(0, (now - state.lastTime) / 1000)); state.lastTime = now; if (gameId === "maze") updateMaze(dt); else updateSpace(dt); if (state.running) requestAnimationFrame(loop); }

  ui.start.addEventListener("click", startGame); ui.retry.addEventListener("click", startGame); ui.home.addEventListener("click", showMain); ui.restart.addEventListener("click", startGame); ui.back.addEventListener("click", () => { if (!state.running) return showMain(); state.confirming = true; state.input = {}; ui.confirm.hidden = false; ui.stay.focus({ preventScroll: true }); }); ui.stay.addEventListener("click", () => { state.confirming = false; state.lastTime = performance.now(); ui.confirm.hidden = true; ui.canvas.focus(); }); ui.leave.addEventListener("click", showMain); ui.sound.addEventListener("click", () => { setSoundMuted(!muted); if (!muted) tone(720, 0.07); });
  window.addEventListener("wonder:audio-volume-change", () => { const sharedMuted = sharedSoundMuted(); if (sharedMuted === null || sharedMuted === muted) return; muted = sharedMuted; setLocale(locale); });
  window.addEventListener("keydown", (event) => { if (state.confirming) { if (event.key === "Escape") { state.confirming = false; ui.confirm.hidden = true; ui.canvas.focus(); } return; } const key = event.key.toLowerCase(); if (gameId === "maze") { const direction = key === "arrowup" || key === "w" ? "up" : key === "arrowdown" || key === "s" ? "down" : key === "arrowleft" || key === "a" ? "left" : key === "arrowright" || key === "d" ? "right" : null; if (direction) { event.preventDefault(); mazeSetDirection(direction); } } else { const action = key === "arrowleft" || key === "a" ? "left" : key === "arrowright" || key === "d" ? "right" : key === "arrowup" || key === "w" ? "thrust" : key === " " || key === "space" || key === "spacebar" ? "fire" : key === "shift" ? "shield" : null; if (action) { event.preventDefault(); if (action === "shield") spaceShield(); else state.input[action] = true; } } });
  window.addEventListener("keyup", (event) => { if (gameId !== "space") return; const key = event.key.toLowerCase(); const action = key === "arrowleft" || key === "a" ? "left" : key === "arrowright" || key === "d" ? "right" : key === "arrowup" || key === "w" ? "thrust" : key === " " || key === "space" || key === "spacebar" ? "fire" : null; if (action) state.input[action] = false; });
  ui.canvas.addEventListener("pointerdown", (event) => { swipeStart = { x: event.clientX, y: event.clientY }; ui.canvas.setPointerCapture?.(event.pointerId); }); ui.canvas.addEventListener("pointerup", (event) => { if (!swipeStart || gameId !== "maze") return; const dx = event.clientX - swipeStart.x, dy = event.clientY - swipeStart.y; swipeStart = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return; mazeSetDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up")); });
  window.addEventListener("resize", () => { if (state.running || state.result) syncPlayViewport(); });
  window.visualViewport?.addEventListener("resize", () => { if (state.running || state.result) syncPlayViewport(); });
  populateLocales(); buildControls(); setLocale(locale); resizeCanvas(gameId === "maze" ? 630 : 960, gameId === "maze" ? 630 : 540); if (gameId === "maze") mazeResetStage(); else resetSpace(); showMain();

  if (!ui.main.querySelector('[data-wp-return="main"]')) {
    const mainReturn = document.createElement("a");
    mainReturn.className = "main-return";
    mainReturn.href = "/";
    mainReturn.dataset.wpReturn = "main";
    mainReturn.setAttribute("aria-label", "Return to WeightPlay");
    mainReturn.innerHTML = '<span aria-hidden="true">←</span><img src="../../assets/weightplay-logo.png" alt="">';
    ui.main.prepend(mainReturn);
    window.dispatchEvent(new Event("weightplay:shell-sync"));
  }
  // v9 Director repair: the first Space Rocks wave must teach the target field
  // from the first frame. The old edge-spawn placed every large rock on the
  // wrap boundary, leaving a nearly empty centre on phone-sized Canvases.
  // Keep movement, splitting, scoring, and wave rules unchanged; only the
  // initial authored positions are redistributed into readable lanes.
  if (gameId === "space") {
    const v8SpawnSpaceWave = spawnSpaceWave;
    spawnSpaceWave = function spawnReadableSpaceWave() {
      v8SpawnSpaceWave();
      const anchors = state.level === 1
        ? [[220, 150], [740, 150], [330, 370], [630, 370], [480, 110]]
        : state.level === 2
          ? [[170, 125], [750, 125], [250, 365], [710, 365], [480, 200]]
          : [[180, 140], [780, 140], [245, 380], [715, 380], [480, 105]];
      let index = 0;
      for (const rock of state.space.rocks) {
        if (rock.boss) { rock.x = 480; rock.y = 105; continue; }
        const [x, y] = anchors[index % anchors.length];
        rock.x = x; rock.y = y; index += 1;
      }
    };
    // The initial reset ran before the repair wrapper was installed. Refresh
    // the hidden Main-state preview so the first Battle uses the same layout.
    resetSpace();
    const v8DrawSpace = drawSpace;
    drawSpace = function drawReadableSpaceField() {
      v8DrawSpace();
      if (!state.space) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = "rgba(116, 230, 238, .16)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 14]);
      for (const x of [240, 480, 720]) { ctx.beginPath(); ctx.moveTo(x, 28); ctx.lineTo(x, 512); ctx.stroke(); }
      for (const y of [135, 270, 405]) { ctx.beginPath(); ctx.moveTo(28, y); ctx.lineTo(932, y); ctx.stroke(); }
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255, 220, 138, .35)";
      ctx.strokeRect(20, 20, 920, 500);
      ctx.restore();
    };
    drawSpace();
  }
})();
