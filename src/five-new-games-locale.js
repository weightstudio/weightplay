/*
 * Locale shell for the five Mode 2 prototype games.  It is deliberately
 * game-owned: these prototypes are not yet registered in the public title
 * catalog, but they still use the project's complete locale selector and
 * route-aware locale persistence before formal QA begins.
 */
(() => {
  const locales = [
    ["en", "English"], ["zh-Hant", "繁體中文"], ["zh-Hans", "简体中文"],
    ["ja", "日本語"], ["ko", "한국어"], ["es", "Español"], ["pt-BR", "Português"],
    ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"], ["ru", "Русский"],
    ["hi", "हिन्दी"], ["ar", "العربية"],
  ];
  const segments = Object.freeze({ en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" });
  const fromSegment = Object.fromEntries(Object.entries(segments).map(([locale, segment]) => [segment, locale]));
  const common = {
    en: { language: "Language", start: "Start Game", main: "Main", stages: "Stages", chapters: "Chapters", arenas: "Arenas", retry: "Retry", next: "Next", howTo: "How to Play", back: "Back" },
    "zh-Hant": { language: "語言", start: "開始遊戲", main: "主頁", stages: "關卡", chapters: "章節", arenas: "鬥場", retry: "重試", next: "下一個", howTo: "玩法說明", back: "返回" },
    "zh-Hans": { language: "语言", start: "开始游戏", main: "主页", stages: "关卡", chapters: "章节", arenas: "斗场", retry: "重试", next: "下一个", howTo: "玩法说明", back: "返回" },
    ja: { language: "言語", start: "ゲーム開始", main: "メイン", stages: "ステージ", chapters: "チャプター", arenas: "アリーナ", retry: "リトライ", next: "次へ", howTo: "遊び方", back: "戻る" },
    ko: { language: "언어", start: "게임 시작", main: "메인", stages: "스테이지", chapters: "챕터", arenas: "아레나", retry: "다시 하기", next: "다음", howTo: "게임 방법", back: "뒤로" },
    es: { language: "Idioma", start: "Empezar juego", main: "Inicio", stages: "Fases", chapters: "Capítulos", arenas: "Arenas", retry: "Reintentar", next: "Siguiente", howTo: "Cómo jugar", back: "Atrás" },
    "pt-BR": { language: "Idioma", start: "Iniciar jogo", main: "Início", stages: "Fases", chapters: "Capítulos", arenas: "Arenas", retry: "Tentar de novo", next: "Próximo", howTo: "Como jogar", back: "Voltar" },
    fr: { language: "Langue", start: "Commencer", main: "Accueil", stages: "Niveaux", chapters: "Chapitres", arenas: "Arènes", retry: "Réessayer", next: "Suivant", howTo: "Comment jouer", back: "Retour" },
    de: { language: "Sprache", start: "Spiel starten", main: "Start", stages: "Stufen", chapters: "Kapitel", arenas: "Arenen", retry: "Erneut", next: "Weiter", howTo: "Spielanleitung", back: "Zurück" },
    it: { language: "Lingua", start: "Inizia gioco", main: "Home", stages: "Livelli", chapters: "Capitoli", arenas: "Arene", retry: "Riprova", next: "Avanti", howTo: "Come si gioca", back: "Indietro" },
    ru: { language: "Язык", start: "Начать игру", main: "Главная", stages: "Уровни", chapters: "Главы", arenas: "Арены", retry: "Повторить", next: "Далее", howTo: "Как играть", back: "Назад" },
    hi: { language: "भाषा", start: "खेल शुरू करें", main: "मुख्य", stages: "स्तर", chapters: "अध्याय", arenas: "अखाड़े", retry: "फिर कोशिश", next: "अगला", howTo: "कैसे खेलें", back: "वापस" },
    ar: { language: "اللغة", start: "ابدأ اللعبة", main: "الرئيسية", stages: "المراحل", chapters: "الفصول", arenas: "الساحات", retry: "إعادة المحاولة", next: "التالي", howTo: "طريقة اللعب", back: "رجوع" },
  };
  const gameCopy = {
    "animal-trap-trail": {
      en: ["Moonlit Trap Trail", "Read the quiet path, test the next step, and reach the lantern without trusting every floor tile.", "A short trap-learning platform trail."],
      "zh-Hant": ["月影陷阱小徑", "讀懂寂靜的小徑，試探下一步，在不相信每塊地板的情況下抵達燈籠。", "短小的陷阱學習平台冒險。"],
      "zh-Hans": ["月影陷阱小径", "读懂安静的小径，试探下一步，不盲信每块地板并抵达灯笼。", "短小的陷阱学习平台冒险。"],
      ja: ["月影トラップトレイル", "静かな道を読み、次の一歩を試し、すべての床を信じずランタンへ進もう。", "短い罠学習プラットフォーム冒険。"],
      ko: ["달빛 함정 길", "조용한 길을 읽고 다음 발판을 시험하며 모든 바닥을 믿지 말고 랜턴에 도착하세요.", "짧게 배우는 함정 플랫폼 모험입니다."],
      es: ["Sendero de trampas lunares", "Lee el camino, prueba el siguiente paso y llega al farol sin confiar en cada baldosa.", "Una breve aventura de plataformas y trampas."],
      "pt-BR": ["Trilha das Armadilhas Lunares", "Leia o caminho, teste o próximo passo e chegue à lanterna sem confiar em cada piso.", "Uma curta aventura de plataformas e armadilhas."],
      fr: ["Sentier des pièges lunaires", "Lis le chemin, teste le prochain pas et rejoins la lanterne sans faire confiance à chaque dalle.", "Une courte aventure de plateformes et de pièges."],
      de: ["Mondlicht-Fallenpfad", "Lies den Weg, prüfe den nächsten Schritt und erreiche die Laterne, ohne jedem Boden zu vertrauen.", "Ein kurzes Plattform-Abenteuer mit Fallen."],
      it: ["Sentiero delle trappole lunari", "Leggi il percorso, prova il prossimo passo e raggiungi la lanterna senza fidarti di ogni piastrella.", "Una breve avventura tra piattaforme e trappole."],
      ru: ["Лунная тропа ловушек", "Изучи путь, проверь следующий шаг и доберись до фонаря, не доверяя каждой плите.", "Короткое платформенное приключение с ловушками."],
      hi: ["चांदनी जाल पथ", "रास्ता पढ़ें, अगला कदम आज़माएँ और हर फर्श पर भरोसा किए बिना लालटेन तक पहुँचें।", "जाल सीखने वाला छोटा प्लेटफ़ॉर्म रोमांच।"],
      ar: ["درب فخاخ ضوء القمر", "اقرأ الطريق واختبر خطوتك التالية واصل إلى المصباح دون الثقة بكل بلاطة.", "مغامرة منصات قصيرة لتعلّم الفخاخ."],
    },
    "animal-canopy-cut": {
      en: ["Canopy Cut", "Swipe through safe canopy fruit, build a chain, and avoid dark seed pods.", "A quick fruit-swipe reaction challenge."],
      "zh-Hant": ["樹冠快採", "劃過安全的樹冠果實建立連擊，避開深色種莢。", "快速的水果滑動反應挑戰。"],
      "zh-Hans": ["树冠快切", "划过安全的树冠果实建立连击，避开深色种荚。", "快速的水果滑动反应挑战。"],
      ja: ["キャノピーカット", "安全な木の実をスワイプして連鎖を作り、黒い種さやを避けよう。", "素早いフルーツスワイプ反応チャレンジ。"],
      ko: ["캐노피 컷", "안전한 열매를 스와이프해 연쇄를 만들고 어두운 씨앗 꼬투리를 피하세요.", "빠른 과일 스와이프 반응 도전입니다."],
      es: ["Corte del dosel", "Desliza frutas seguras, crea una cadena y evita las vainas oscuras.", "Un reto rápido de reacción con frutas."],
      "pt-BR": ["Corte na Copa", "Deslize pelas frutas seguras, crie uma sequência e evite as vagens escuras.", "Um desafio rápido de reação com frutas."],
      fr: ["Coupe de la canopée", "Glisse sur les fruits sûrs, crée une chaîne et évite les gousses sombres.", "Un défi rapide de réaction fruitée."],
      de: ["Kronen-Schnitt", "Wische durch sichere Früchte, bilde eine Kette und meide dunkle Samenhülsen.", "Eine schnelle Frucht-Reaktionsherausforderung."],
      it: ["Taglio nella chioma", "Scorri sulla frutta sicura, crea una catena ed evita i baccelli scuri.", "Una sfida rapida di reazione con la frutta."],
      ru: ["Срез в кронах", "Проводите по безопасным плодам, создавайте цепь и избегайте тёмных стручков.", "Быстрое испытание реакции с фруктами."],
      hi: ["पेड़ की छत कट", "सुरक्षित फलों पर स्वाइप करें, श्रृंखला बनाएँ और गहरे बीज-फलियों से बचें।", "तेज़ फल-स्वाइप प्रतिक्रिया चुनौती।"],
      ar: ["قطع مظلة الأشجار", "مرر على الثمار الآمنة وابنِ سلسلة وتجنب قرون البذور الداكنة.", "تحدٍّ سريع لرد الفعل مع الفاكهة."],
    },
    "animal-bounce-brawl": {
      en: ["Bounce Brawl", "A toy arena about timing, ricochets, and sending a foam challenger off balance.", "A soft physics arena with friendly knockback."],
      "zh-Hant": ["彈跳鬥場", "在玩具鬥場掌握時機與反彈，把泡棉對手撞到失去平衡。", "帶有友善擊退效果的柔軟物理鬥場。"],
      "zh-Hans": ["弹跳斗场", "在玩具斗场掌握时机与反弹，把泡棉对手撞得失去平衡。", "带有友善击退效果的柔软物理斗场。"],
      ja: ["バウンス乱闘", "タイミングと反射を使い、フォームの相手をバランス崩しに追い込む玩具アリーナ。", "やさしいノックバックの物理アリーナ。"],
      ko: ["바운스 난투", "타이밍과 튕김을 활용해 폼 상대를 균형 잃게 만드는 장난감 경기장입니다.", "친근한 밀치기가 있는 부드러운 물리 경기장입니다."],
      es: ["Duelo de rebotes", "Un campo de juguete de tiempos y rebotes para desequilibrar a un rival de espuma.", "Una arena de física amable con empujones."],
      "pt-BR": ["Briga de Rebotes", "Uma arena de brinquedo de tempo e ricochetes para desequilibrar um rival de espuma.", "Uma arena de física leve com empurrões amigáveis."],
      fr: ["Baston rebondissant", "Une arène jouet de timing et de rebonds pour déséquilibrer un rival en mousse.", "Une arène physique douce avec recul amusant."],
      de: ["Hüpfduell", "Eine Spielzeugarena für Timing und Abpraller, um einen Schaumgegner aus dem Gleichgewicht zu bringen.", "Eine sanfte Physikarena mit freundlichem Rückstoß."],
      it: ["Rissa rimbalzante", "Un'arena giocattolo di tempismo e rimbalzi per sbilanciare un rivale di gommapiuma.", "Un'arena fisica morbida con spinte amichevoli."],
      ru: ["Прыгучая схватка", "Игрушечная арена с таймингом и рикошетами, где нужно сбить пенного соперника.", "Мягкая физическая арена с дружеским отбрасыванием."],
      hi: ["उछलती भिड़ंत", "समय और टकराव से फोम प्रतिद्वंद्वी का संतुलन बिगाड़ने वाला खिलौना अखाड़ा।", "मज़ेदार नॉकबैक वाला नरम भौतिकी अखाड़ा।"],
      ar: ["نزال الارتداد", "ساحة ألعاب تعتمد على التوقيت والارتداد لإخلال توازن خصم إسفنجي.", "ساحة فيزياء لطيفة مع دفع مرح."],
    },
    "animal-frost-maze": {
      en: ["Frostline Rescue", "Open the frozen route, collect every berry, and keep one step ahead of the snow drifter.", "A route-changing ice maze rescue."],
      "zh-Hant": ["冰線救援", "打開冰封路線，收集所有莓果，並永遠比雪地漂行者快一步。", "能改變路線的冰迷宮救援。"],
      "zh-Hans": ["冰线救援", "打开冰封路线，收集所有莓果，始终领先雪地漂行者一步。", "可以改变路线的冰迷宫救援。"],
      ja: ["フロストライン救助", "凍った道を開き、すべてのベリーを集め、雪の漂流者より一歩先へ進もう。", "道を変えられる氷迷路レスキュー。"],
      ko: ["프로스트라인 구조", "얼어붙은 길을 열고 모든 베리를 모으며 눈의 방랑자보다 한발 앞서세요.", "경로를 바꾸는 얼음 미로 구조 게임입니다."],
      es: ["Rescate en la línea helada", "Abre la ruta congelada, recoge todas las bayas y adelántate al errante de nieve.", "Un rescate en un laberinto de hielo cambiante."],
      "pt-BR": ["Resgate na Linha de Gelo", "Abra a rota congelada, pegue todas as frutas e fique um passo à frente do andarilho da neve.", "Um resgate em labirinto de gelo mutável."],
      fr: ["Sauvetage de la ligne gelée", "Ouvre la route glacée, ramasse toutes les baies et garde une longueur d'avance sur le rôdeur des neiges.", "Un sauvetage dans un labyrinthe de glace modulable."],
      de: ["Rettung an der Frostlinie", "Öffne den gefrorenen Weg, sammle alle Beeren und bleibe dem Schneewanderer voraus.", "Eine Rettung im wandelbaren Eislabyrinth."],
      it: ["Soccorso sulla linea gelata", "Apri il percorso ghiacciato, raccogli tutte le bacche e resta un passo avanti al vagabondo della neve.", "Un soccorso in un labirinto di ghiaccio modificabile."],
      ru: ["Спасение на ледяной линии", "Откройте замёрзший путь, соберите все ягоды и опередите снежного странника.", "Спасение в меняющемся ледяном лабиринте."],
      hi: ["फ्रॉस्टलाइन बचाव", "जमी हुई राह खोलें, सभी बेरियाँ इकट्ठी करें और बर्फीले भटकने वाले से एक कदम आगे रहें।", "रास्ता बदलने वाला बर्फीला भूलभुलैया बचाव।"],
      ar: ["إنقاذ خط الصقيع", "افتح الطريق المتجمد واجمع كل التوت وابق متقدماً على المتجول الثلجي بخطوة.", "إنقاذ في متاهة جليدية قابلة للتغيير."],
    },
    "animal-flip-foundry": {
      en: ["Flip Foundry", "Swipe a crystal canister, rotate it in the air, and land upright on the next workshop surface.", "A precision swipe-and-land workshop challenge."],
      "zh-Hant": ["翻轉工坊", "滑動晶體罐讓它在空中旋轉，並直立落在下一個工坊表面。", "精準滑動與落地的工坊挑戰。"],
      "zh-Hans": ["翻转工坊", "滑动晶体罐让它在空中旋转，并直立落在下一个工坊表面。", "精准滑动与落地的工坊挑战。"],
      ja: ["フリップ工房", "クリスタル容器をスワイプし、空中で回転させ、次の工房面に立てて着地させよう。", "精密なスワイプ着地の工房チャレンジ。"],
      ko: ["플립 공방", "크리스털 용기를 스와이프해 공중에서 회전시키고 다음 작업대에 똑바로 착지하세요.", "정밀한 스와이프 착지 공방 도전입니다."],
      es: ["Taller de giros", "Desliza el recipiente de cristal, hazlo girar y aterrízalo de pie en la siguiente superficie.", "Un reto de precisión con deslizamiento y aterrizaje."],
      "pt-BR": ["Oficina do Giro", "Deslize o recipiente de cristal, gire-o no ar e pouse em pé na próxima superfície.", "Um desafio de precisão com deslize e pouso."],
      fr: ["Atelier du flip", "Fais glisser le réservoir de cristal, fais-le tourner et pose-le debout sur la prochaine surface.", "Un défi d'atelier de précision et d'atterrissage."],
      de: ["Flip-Werkstatt", "Wische den Kristallbehälter, drehe ihn in der Luft und lande aufrecht auf der nächsten Werkfläche.", "Eine Präzisionsherausforderung mit Wischen und Landen."],
      it: ["Officina del flip", "Scorri il contenitore di cristallo, fallo ruotare in aria e fallo atterrare in piedi sulla superficie successiva.", "Una sfida di precisione tra scorrimento e atterraggio."],
      ru: ["Мастерская переворотов", "Проведите по кристальному контейнеру, вращайте его в воздухе и посадите вертикально на следующую поверхность.", "Точное испытание свайпа и посадки."],
      hi: ["फ्लिप कार्यशाला", "क्रिस्टल कनस्तर पर स्वाइप करें, उसे हवा में घुमाएँ और अगली सतह पर सीधा उतारें।", "सटीक स्वाइप और लैंडिंग कार्यशाला चुनौती।"],
      ar: ["ورشة القلب", "مرر على الحاوية البلورية ودورها في الهواء وأنزلها واقفة على سطح الورشة التالي.", "تحدٍّ دقيق للتمرير والهبوط."],
    },
  };

  function pathLocale() {
    const segment = String(location.pathname).split("/").filter(Boolean)[0] || "";
    return fromSegment[segment] || "";
  }
  function readLocale() {
    let saved = "";
    try { saved = localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale") || localStorage.getItem("wp-locale") || ""; } catch {}
    const candidate = pathLocale() || saved || "en";
    return segments[candidate] ? candidate : "en";
  }
  const gameId = document.body?.dataset.wpFiveGame || document.querySelector("[data-wp-five-game]")?.dataset.wpFiveGame || "";
  let locale = readLocale();
  const sourceToTranslation = new Map();
  function currentCopy() { return gameCopy[gameId]?.[locale] || gameCopy[gameId]?.en || [gameId, "", ""]; }
  function rebuildMap() {
    sourceToTranslation.clear();
    const values = common[locale] || common.en;
    sourceToTranslation.set("Language", values.language); sourceToTranslation.set("Start Game", values.start);
    sourceToTranslation.set("Main", values.main); sourceToTranslation.set("Stages", values.stages);
    sourceToTranslation.set("Chapters", values.chapters); sourceToTranslation.set("Arenas", values.arenas);
    sourceToTranslation.set("Retry", values.retry); sourceToTranslation.set("Next", values.next);
    sourceToTranslation.set("How to Play", values.howTo); sourceToTranslation.set("Back", values.back);
    const [title, lede, guide] = currentCopy(); sourceToTranslation.set("WEIGHTPLAY · INTERNAL PROTOTYPE", locale === "en" ? "WEIGHTPLAY · INTERNAL PROTOTYPE" : "WEIGHTPLAY · " + (locale === "zh-Hant" ? "內部原型" : locale === "zh-Hans" ? "内部原型" : "INTERNAL PROTOTYPE"));
    sourceToTranslation.set(gameCopy[gameId]?.en?.[0] || title, title);
    sourceToTranslation.set(gameCopy[gameId]?.en?.[1] || lede, lede);
    sourceToTranslation.set(gameCopy[gameId]?.en?.[2] || guide, guide);
  }
  function translate(value) {
    if (typeof value !== "string") return value;
    const exact = sourceToTranslation.get(value.trim());
    return exact === undefined ? value : value.replace(value.trim(), exact);
  }
  function apply(root = document) {
    rebuildMap();
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const [title] = currentCopy();
    document.title = `${title} | WeightPlay`;
    root.querySelectorAll?.("[data-five-copy]").forEach((element) => {
      const key = element.dataset.fiveCopy;
      const values = common[locale] || common.en;
      const copy = currentCopy();
      const map = { title: copy[0], lede: copy[1], guideBody: copy[2], start: values.start, howTo: values.howTo, language: values.language };
      if (map[key] !== undefined) element.textContent = map[key];
    });
    root.querySelectorAll?.("[data-five-aria]").forEach((element) => { const values = common[locale] || common.en; if (element.dataset.fiveAria === "language") element.setAttribute("aria-label", values.language); });
    root.querySelectorAll?.("#localeSelect").forEach((select) => { select.value = locale; });
    if (root.querySelectorAll) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => { if (node.parentElement?.closest("script,style,select")) return; const next = translate(node.data); if (next !== node.data) node.data = next; });
    }
  }
  function setLocale(next) {
    if (!segments[next]) return;
    locale = next;
    try { localStorage.setItem("weightPlayLocale", locale); } catch {}
    apply(document);
  }
  function start() {
    rebuildMap();
    apply(document);
    document.querySelectorAll("#localeSelect").forEach((select) => select.addEventListener("change", () => setLocale(select.value)));
    const observer = new MutationObserver((records) => records.forEach((record) => {
      if (record.type === "characterData") {
        const next = translate(record.target.data);
        if (next !== record.target.data) record.target.data = next;
        return;
      }
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) apply(node);
        else if (node.nodeType === Node.TEXT_NODE) {
          const next = translate(node.data);
          if (next !== node.data) node.data = next;
        }
      });
    }));
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
  }
  window.WeightPlayFiveGameLocale = Object.freeze({ locales, get locale() { return locale; }, setLocale, translate, apply });
  window.wpFiveText = translate;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
})();
