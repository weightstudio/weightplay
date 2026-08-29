(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const screens = {main: $("mainScreen"), lab: $("labScreen"), result: $("resultScreen")};
  let locale = "en", index = 0, score = 0, selected = [], coolingTimer = 0;
  let hintKey = "choose", hintGood = false;
  const readBest = () => { try { return Number(localStorage.getItem("dinoColorLabBest") || 0); } catch { return 0; } };
  const saveBest = value => { try { localStorage.setItem("dinoColorLabBest", String(value)); } catch { /* restricted storage stays session-safe */ } };
  let best = readBest();
  const t = (key, vars = {}) => Object.entries(vars).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), (COPY[locale] || COPY.en)[key] || COPY.en[key] || key);
  const show = name => Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; });
  const applyCopy = () => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach(node => { node.textContent = t(node.dataset.copy); });
    $("localeSelect").value = locale;
    $("localeSelect").setAttribute("aria-label", t("language"));
    updateBest();
  };
  const updateBest = () => { $("bestLine").textContent = best ? t("menuBest", {n: best}) : ""; };
  const announce = (key, good = false, vars = {}) => {
    hintKey = key;
    hintGood = good;
    $("roundHint").textContent = t(key, vars);
    $("roundHint").classList.toggle("is-good", good);
  };
  const renderReagents = () => {
    const sample = SAMPLES[index];
    $("labTitle").textContent = sample.target[locale] || sample.target.en;
    $("targetChip").style.background = sample.colour;
    $("targetChip").setAttribute("aria-label", `${t("targetLabel")}: ${$("labTitle").textContent}`);
    $("roundLabel").textContent = t("round", {n: index + 1, total: SAMPLES.length});
    $("scoreLabel").textContent = t("score", {n: score});
    $("selectionLabel").textContent = selected.length ? t("selected", {n: selected.length}) : t("choose");
    $("mixBtn").textContent = t("mix");
    $("mixBtn").disabled = selected.length !== 2;
    announce(hintKey, hintGood);
    const grid = $("reagentGrid"); grid.innerHTML = "";
    REAGENTS.forEach(reagent => {
      const button = document.createElement("button"); button.type = "button"; button.className = "reagent";
      button.dataset.reagent = reagent.id; button.setAttribute("aria-pressed", String(selected.includes(reagent.id)));
      button.innerHTML = `<span class="reagent-dot" style="background:${reagent.colour}" aria-hidden="true"></span><span>${reagent.name[locale] || reagent.name.en}</span>`;
      button.addEventListener("click", () => {
        if (selected.includes(reagent.id)) selected = selected.filter(id => id !== reagent.id);
        else if (selected.length < 2) selected = [...selected, reagent.id];
        renderReagents();
      });
      grid.appendChild(button);
    });
  };
  const startCooling = () => {
    clearTimeout(coolingTimer); $("coolingBar").classList.remove("cooling"); void $("coolingBar").offsetWidth; $("coolingBar").classList.add("cooling");
    coolingTimer = window.setTimeout(() => announce("wrong"), 12000);
  };
  const startLab = () => { index = 0; score = 0; selected = []; hintKey = "choose"; hintGood = false; show("lab"); renderReagents(); startCooling(); $("reagentGrid").querySelector("button")?.focus(); };
  const finish = () => {
    clearTimeout(coolingTimer); best = Math.max(best, score); saveBest(best);
    $("resultTitle").textContent = t("completeTitle"); $("resultBody").textContent = t("completeBody", {n: score});
    $("resultScore").textContent = t("score", {n: score}); $("resultBest").textContent = t("best", {n: best}); show("result"); $("replayBtn").focus(); updateBest();
  };
  $("mixBtn").addEventListener("click", () => {
    const answer = [...SAMPLES[index].answer].sort().join(","), attempt = [...selected].sort().join(",");
    if (answer !== attempt) { announce("wrong"); selected = []; renderReagents(); startCooling(); $("reagentGrid").querySelector("button")?.focus(); return; }
    score += 1; announce("correct", true); $("scoreLabel").textContent = t("score", {n: score});
    window.setTimeout(() => { index += 1; if (index >= SAMPLES.length) finish(); else { selected = []; hintKey = "choose"; hintGood = false; renderReagents(); startCooling(); $("reagentGrid").querySelector("button")?.focus(); } }, 420);
  });
  $("startBtn").addEventListener("click", startLab); $("replayBtn").addEventListener("click", startLab);
  $("homeBtn").addEventListener("click", () => { show("main"); updateBest(); $("startBtn").focus(); });
  $("leaveBtn").addEventListener("click", () => { clearTimeout(coolingTimer); show("main"); updateBest(); $("startBtn").focus(); });
  $("localeSelect").addEventListener("change", event => { locale = event.target.value; applyCopy(); if (!screens.lab.hidden) renderReagents(); });
  const COPY = {
    en: {
      back: "Back", eyebrow: "WeightPlay prototype", title: "Dino Color Lab", language: "Language",
      guide: "Spark Paw Fia's lab", mainHeading: "Mix two fossil inks to match the dino sample.",
      mainBody: "Choose two reagents, predict the blend, then lock the colour before the timer bar cools.",
      start: "Open the lab", howTo: "How to play", howToBody: "Each sample has one exact two-ink recipe. Tap two different reagent cards, then mix. A correct blend opens the next sample; a wrong blend can be tried again.",
      targetLabel: "Target sample", leave: "Leave lab", complete: "Sample set complete", replay: "Run it again", home: "Back to menu",
      footer: "Internal prototype · no public lobby or sitemap entry", round: "Sample {n} / {total}", score: "Stable blends: {n}",
      choose: "Choose two inks", selected: "{n} / 2 selected", mix: "Mix colours", correct: "Stable blend! The fossil glows.", wrong: "That blend fizzed. Try a different pair.",
      sample: "Sample {n}", completeTitle: "The fossil palette is ready!", completeBody: "You solved every sample with {n} stable blends. Fia marked the recipe book for the next expedition.", best: "Best run: {n} stable blends", menuBest: "Best run: {n} stable blends"
    },
    "zh-Hant": {
      back: "返回", eyebrow: "WeightPlay 原型", title: "恐龍調色實驗室", language: "語言",
      guide: "Spark Paw Fia 的實驗室", mainHeading: "混合兩種化石墨水，配出恐龍樣本的顏色。",
      mainBody: "選兩張試劑卡，預測混色結果，在冷卻條結束前鎖定顏色。",
      start: "開啟實驗室", howTo: "玩法", howToBody: "每個樣本都有唯一的兩色配方。點選兩張不同試劑，再按混合。配對正確就能開啟下一個樣本，配錯可以再試。",
      targetLabel: "目標樣本", leave: "離開實驗室", complete: "樣本組完成", replay: "再跑一次", home: "返回選單",
      footer: "內部原型 · 尚未加入公開大廳或 Sitemap", round: "樣本 {n} / {total}", score: "穩定混合：{n}",
      choose: "選兩種墨水", selected: "已選 {n} / 2", mix: "混合顏色", correct: "混合穩定！化石亮起來了。", wrong: "這個配方冒泡了，換另一組試試。",
      sample: "樣本 {n}", completeTitle: "化石色票準備好了！", completeBody: "你用 {n} 次穩定混合完成全部樣本。Fia 已把配方簿標記好，準備下一次探險。", best: "最佳紀錄：{n} 次穩定混合", menuBest: "最佳紀錄：{n} 次穩定混合"
    },
    "zh-Hans": {
      back: "返回", eyebrow: "WeightPlay 原型", title: "恐龙调色实验室", language: "语言",
      guide: "Spark Paw Fia 的实验室", mainHeading: "混合两种化石墨水，配出恐龙样本的颜色。",
      mainBody: "选择两张试剂卡，预测混色结果，在冷却条结束前锁定颜色。",
      start: "开启实验室", howTo: "玩法", howToBody: "每个样本都有唯一的两色配方。选择两张不同试剂后混合。配对正确即可进入下一个样本，配错可以再试。",
      targetLabel: "目标样本", leave: "离开实验室", complete: "样本组完成", replay: "再玩一次", home: "返回菜单",
      footer: "内部原型 · 尚未加入公开大厅或 Sitemap", round: "样本 {n} / {total}", score: "稳定混合：{n}",
      choose: "选择两种墨水", selected: "已选 {n} / 2", mix: "混合颜色", correct: "混合稳定！化石亮起来了。", wrong: "这个配方冒泡了，换一组试试。",
      sample: "样本 {n}", completeTitle: "化石色卡准备好了！", completeBody: "你用 {n} 次稳定混合完成全部样本。Fia 已标记配方本，准备下一次探险。", best: "最佳记录：{n} 次稳定混合", menuBest: "最佳记录：{n} 次稳定混合"
    },
    ja: {
      back: "戻る", eyebrow: "WeightPlay プロトタイプ", title: "恐竜カラーラボ", language: "言語",
      guide: "スパーク・ポー・フィアのラボ", mainHeading: "2色の化石インクを混ぜて恐竜サンプルに合わせよう。",
      mainBody: "試薬を2つ選び、色を予想して、冷却バーが終わる前に混ぜよう。",
      start: "ラボを開く", howTo: "遊び方", howToBody: "各サンプルには正確な2色レシピがあります。異なる試薬カードを2枚選び、混ぜます。正解なら次へ進み、間違えても再挑戦できます。",
      targetLabel: "目標サンプル", leave: "ラボを出る", complete: "サンプル完了", replay: "もう一度遊ぶ", home: "メニューへ",
      footer: "内部プロトタイプ · 公開ロビーとサイトマップには未掲載", round: "サンプル {n} / {total}", score: "安定ブレンド: {n}",
      choose: "インクを2つ選ぶ", selected: "{n} / 2 選択", mix: "色を混ぜる", correct: "安定したブレンド！化石が光った。", wrong: "そのブレンドは泡立った。別の組み合わせを試そう。",
      sample: "サンプル {n}", completeTitle: "化石パレットの完成！", completeBody: "{n}回の安定ブレンドですべてのサンプルを解決。フィアが次の探検へレシピ帳を印した。", best: "ベスト: {n} 安定ブレンド", menuBest: "ベスト: {n} 安定ブレンド"
    },
    ko: {
      back: "뒤로", eyebrow: "WeightPlay 프로토타입", title: "공룡 컬러 연구실", language: "언어",
      guide: "스파크 포 피아의 연구실", mainHeading: "화석 잉크 두 가지를 섞어 공룡 샘플 색을 맞추세요.",
      mainBody: "시약 두 개를 고르고 색을 예상한 뒤 냉각 바가 끝나기 전에 섞어 보세요.",
      start: "연구실 열기", howTo: "플레이 방법", howToBody: "각 샘플에는 정확한 두 잉크 조합이 있습니다. 다른 시약 카드 두 장을 고르고 섞으세요. 맞으면 다음 샘플로, 틀려도 다시 시도할 수 있습니다.",
      targetLabel: "목표 샘플", leave: "연구실 나가기", complete: "샘플 세트 완료", replay: "다시 플레이", home: "메뉴로 돌아가기",
      footer: "내부 프로토타입 · 공개 로비와 사이트맵에 없음", round: "샘플 {n} / {total}", score: "안정 혼합: {n}",
      choose: "잉크 두 개 선택", selected: "{n} / 2 선택", mix: "색 섞기", correct: "혼합 안정! 화석이 빛납니다.", wrong: "그 조합은 거품이 났어요. 다른 쌍을 시도하세요.",
      sample: "샘플 {n}", completeTitle: "화석 팔레트 완성!", completeBody: "안정 혼합 {n}번으로 모든 샘플을 해결했습니다. 피아가 다음 탐험을 위해 레시피 책에 표시했어요.", best: "최고 기록: 안정 혼합 {n}", menuBest: "최고 기록: 안정 혼합 {n}"
    },
    es: {
      back: "Volver", eyebrow: "Prototipo de WeightPlay", title: "Laboratorio de Color Dino", language: "Idioma",
      guide: "Laboratorio de Spark Paw Fia", mainHeading: "Mezcla dos tintas fósiles para igualar la muestra dino.",
      mainBody: "Elige dos reactivos, predice la mezcla y fija el color antes de que termine la barra de enfriamiento.",
      start: "Abrir laboratorio", howTo: "Cómo jugar", howToBody: "Cada muestra tiene una receta exacta de dos tintas. Toca dos tarjetas distintas y mezcla. Una mezcla correcta abre la siguiente muestra; una incorrecta se puede intentar de nuevo.",
      targetLabel: "Muestra objetivo", leave: "Salir del laboratorio", complete: "Muestras completadas", replay: "Jugar otra vez", home: "Volver al menú",
      footer: "Prototipo interno · sin entrada pública ni sitemap", round: "Muestra {n} / {total}", score: "Mezclas estables: {n}",
      choose: "Elige dos tintas", selected: "{n} / 2 elegidas", mix: "Mezclar colores", correct: "¡Mezcla estable! El fósil brilla.", wrong: "La mezcla hizo burbujas. Prueba otra pareja.",
      sample: "Muestra {n}", completeTitle: "¡La paleta fósil está lista!", completeBody: "Resolviste todas las muestras con {n} mezclas estables. Fia marcó el recetario para la próxima expedición.", best: "Mejor ronda: {n} mezclas estables", menuBest: "Mejor ronda: {n} mezclas estables"
    },
    "pt-BR": {
      back: "Voltar", eyebrow: "Protótipo WeightPlay", title: "Laboratório de Cores Dino", language: "Idioma",
      guide: "Laboratório da Spark Paw Fia", mainHeading: "Misture duas tintas fósseis para combinar com a amostra dino.",
      mainBody: "Escolha dois reagentes, preveja a mistura e fixe a cor antes de a barra de resfriamento terminar.",
      start: "Abrir laboratório", howTo: "Como jogar", howToBody: "Cada amostra tem uma receita exata de duas tintas. Toque em dois cartões diferentes e misture. A combinação correta abre a próxima amostra; a errada pode ser tentada novamente.",
      targetLabel: "Amostra-alvo", leave: "Sair do laboratório", complete: "Conjunto concluído", replay: "Jogar de novo", home: "Voltar ao menu",
      footer: "Protótipo interno · sem lobby público ou sitemap", round: "Amostra {n} / {total}", score: "Misturas estáveis: {n}",
      choose: "Escolha duas tintas", selected: "{n} / 2 escolhidas", mix: "Misturar cores", correct: "Mistura estável! O fóssil brilhou.", wrong: "Essa mistura borbulhou. Tente outra dupla.",
      sample: "Amostra {n}", completeTitle: "A paleta fóssil está pronta!", completeBody: "Você resolveu todas as amostras com {n} misturas estáveis. Fia marcou o livro de receitas para a próxima expedição.", best: "Melhor rodada: {n} misturas estáveis", menuBest: "Melhor rodada: {n} misturas estáveis"
    },
    fr: {
      back: "Retour", eyebrow: "Prototype WeightPlay", title: "Laboratoire Couleur Dino", language: "Langue",
      guide: "Le labo de Spark Paw Fia", mainHeading: "Mélange deux encres fossiles pour égaler l'échantillon dino.",
      mainBody: "Choisis deux réactifs, prédis le mélange, puis fixe la couleur avant la fin de la barre de refroidissement.",
      start: "Ouvrir le labo", howTo: "Comment jouer", howToBody: "Chaque échantillon possède une recette exacte de deux encres. Touche deux cartes différentes puis mélange. Un bon mélange ouvre l'échantillon suivant ; tu peux réessayer après une erreur.",
      targetLabel: "Échantillon cible", leave: "Quitter le labo", complete: "Série terminée", replay: "Rejouer", home: "Retour au menu",
      footer: "Prototype interne · aucun lobby ni sitemap public", round: "Échantillon {n} / {total}", score: "Mélanges stables : {n}",
      choose: "Choisis deux encres", selected: "{n} / 2 choisies", mix: "Mélanger les couleurs", correct: "Mélange stable ! Le fossile brille.", wrong: "Ce mélange a moussé. Essaie une autre paire.",
      sample: "Échantillon {n}", completeTitle: "La palette fossile est prête !", completeBody: "Tu as résolu chaque échantillon avec {n} mélanges stables. Fia a marqué le carnet pour la prochaine expédition.", best: "Meilleur tour : {n} mélanges stables", menuBest: "Meilleur tour : {n} mélanges stables"
    },
    de: {
      back: "Zurück", eyebrow: "WeightPlay-Prototyp", title: "Dino-Farblabor", language: "Sprache",
      guide: "Das Labor von Spark Paw Fia", mainHeading: "Mische zwei Fossiltinten passend zur Dino-Probe.",
      mainBody: "Wähle zwei Reagenzien, schätze die Mischung und lege die Farbe fest, bevor der Kühlbalken endet.",
      start: "Labor öffnen", howTo: "So wird gespielt", howToBody: "Jede Probe hat ein genaues Rezept aus zwei Tinten. Wähle zwei verschiedene Reagenzkarten und mische. Eine richtige Mischung öffnet die nächste Probe; ein Fehler darf neu versucht werden.",
      targetLabel: "Zielprobe", leave: "Labor verlassen", complete: "Probensatz geschafft", replay: "Noch einmal spielen", home: "Zum Menü",
      footer: "Interner Prototyp · kein öffentliches Lobby- oder Sitemap-Ziel", round: "Probe {n} / {total}", score: "Stabile Mischungen: {n}",
      choose: "Wähle zwei Tinten", selected: "{n} / 2 gewählt", mix: "Farben mischen", correct: "Stabile Mischung! Das Fossil leuchtet.", wrong: "Diese Mischung schäumt. Versuche ein anderes Paar.",
      sample: "Probe {n}", completeTitle: "Die Fossilpalette ist fertig!", completeBody: "Du hast alle Proben mit {n} stabilen Mischungen gelöst. Fia markierte das Rezeptbuch für die nächste Expedition.", best: "Bester Lauf: {n} stabile Mischungen", menuBest: "Bester Lauf: {n} stabile Mischungen"
    },
    it: {
      back: "Indietro", eyebrow: "Prototipo WeightPlay", title: "Laboratorio Colori Dino", language: "Lingua",
      guide: "Il laboratorio di Spark Paw Fia", mainHeading: "Mescola due inchiostri fossili per abbinare il campione dino.",
      mainBody: "Scegli due reagenti, prevedi la miscela e fissa il colore prima che finisca la barra di raffreddamento.",
      start: "Apri il laboratorio", howTo: "Come si gioca", howToBody: "Ogni campione ha una ricetta esatta di due inchiostri. Tocca due schede diverse e mescola. La miscela corretta apre il campione seguente; puoi riprovare dopo un errore.",
      targetLabel: "Campione obiettivo", leave: "Esci dal laboratorio", complete: "Serie completata", replay: "Gioca ancora", home: "Torna al menu",
      footer: "Prototipo interno · nessun ingresso pubblico o sitemap", round: "Campione {n} / {total}", score: "Miscele stabili: {n}",
      choose: "Scegli due inchiostri", selected: "{n} / 2 scelti", mix: "Mescola i colori", correct: "Miscela stabile! Il fossile brilla.", wrong: "Questa miscela ha fatto schiuma. Prova un'altra coppia.",
      sample: "Campione {n}", completeTitle: "La tavolozza fossile è pronta!", completeBody: "Hai risolto tutti i campioni con {n} miscele stabili. Fia ha segnato il ricettario per la prossima spedizione.", best: "Miglior giro: {n} miscele stabili", menuBest: "Miglior giro: {n} miscele stabili"
    },
    ru: {
      back: "Назад", eyebrow: "Прототип WeightPlay", title: "Лаборатория цвета динозавров", language: "Язык",
      guide: "Лаборатория Спарк Пауз Фии", mainHeading: "Смешайте две ископаемые краски под образец динозавра.",
      mainBody: "Выберите два реагента, предскажите смесь и закрепите цвет до окончания охлаждения.",
      start: "Открыть лабораторию", howTo: "Как играть", howToBody: "У каждого образца есть точный рецепт из двух красок. Выберите две разные карты реагентов и смешайте их. Верная смесь открывает следующий образец, а после ошибки можно попробовать снова.",
      targetLabel: "Целевой образец", leave: "Выйти из лаборатории", complete: "Набор образцов завершён", replay: "Играть снова", home: "В меню",
      footer: "Внутренний прототип · нет публичного лобби или sitemap", round: "Образец {n} / {total}", score: "Стабильные смеси: {n}",
      choose: "Выберите две краски", selected: "Выбрано {n} / 2", mix: "Смешать цвета", correct: "Смесь стабильна! Окаменелость светится.", wrong: "Смесь запузырилась. Попробуйте другую пару.",
      sample: "Образец {n}", completeTitle: "Палитра окаменелостей готова!", completeBody: "Вы решили все образцы за {n} стабильных смесей. Фия отметила книгу рецептов для следующей экспедиции.", best: "Лучший забег: {n} стабильных смесей", menuBest: "Лучший забег: {n} стабильных смесей"
    },
    hi: {
      back: "वापस", eyebrow: "WeightPlay प्रोटोटाइप", title: "डाइनो रंग प्रयोगशाला", language: "भाषा",
      guide: "स्पार्क पॉ फिया की प्रयोगशाला", mainHeading: "डाइनो नमूने से मिलाने के लिए दो जीवाश्म स्याहियाँ मिलाएँ।",
      mainBody: "दो अभिकर्मक चुनें, मिश्रण का अनुमान लगाएँ और ठंडा होने की पट्टी खत्म होने से पहले रंग तय करें।",
      start: "प्रयोगशाला खोलें", howTo: "कैसे खेलें", howToBody: "हर नमूने का दो स्याहियों वाला एक सही नुस्खा है। दो अलग अभिकर्मक कार्ड चुनकर मिलाएँ। सही मिश्रण अगला नमूना खोलता है; गलत होने पर फिर कोशिश कर सकते हैं।",
      targetLabel: "लक्ष्य नमूना", leave: "प्रयोगशाला छोड़ें", complete: "नमूना सेट पूरा", replay: "फिर खेलें", home: "मेनू पर लौटें",
      footer: "आंतरिक प्रोटोटाइप · सार्वजनिक लॉबी या साइटमैप में नहीं", round: "नमूना {n} / {total}", score: "स्थिर मिश्रण: {n}",
      choose: "दो स्याहियाँ चुनें", selected: "{n} / 2 चुनी गईं", mix: "रंग मिलाएँ", correct: "मिश्रण स्थिर है! जीवाश्म चमकता है।", wrong: "यह मिश्रण झागदार हो गया। दूसरी जोड़ी आज़माएँ।",
      sample: "नमूना {n}", completeTitle: "जीवाश्म पैलेट तैयार है!", completeBody: "आपने {n} स्थिर मिश्रणों से सभी नमूने हल कर लिए। फिया ने अगली यात्रा के लिए नुस्खा-पुस्तक में निशान लगाया।", best: "सर्वश्रेष्ठ रन: {n} स्थिर मिश्रण", menuBest: "सर्वश्रेष्ठ रन: {n} स्थिर मिश्रण"
    },
    ar: {
      back: "رجوع", eyebrow: "نموذج أولي من WeightPlay", title: "مختبر ألوان الديناصور", language: "اللغة",
      guide: "مختبر سبارك باو فيا", mainHeading: "اخلط حبرين أحفوريين لمطابقة عينة الديناصور.",
      mainBody: "اختر مادتين، توقّع المزيج، وثبّت اللون قبل انتهاء شريط التبريد.",
      start: "افتح المختبر", howTo: "طريقة اللعب", howToBody: "لكل عينة وصفة دقيقة من حبرين. اختر بطاقتي مادتين مختلفتين ثم اخلطهما. يفتح المزيج الصحيح العينة التالية، ويمكنك إعادة المحاولة بعد الخطأ.",
      targetLabel: "العينة المستهدفة", leave: "مغادرة المختبر", complete: "اكتمل طقم العينات", replay: "العب مرة أخرى", home: "العودة إلى القائمة",
      footer: "نموذج أولي داخلي · بلا ردهة عامة أو خريطة موقع", round: "العينة {n} / {total}", score: "خلطات مستقرة: {n}",
      choose: "اختر حبرين", selected: "تم اختيار {n} / 2", mix: "اخلط اللونين", correct: "مزيج مستقر! الأحفورة تضيء.", wrong: "فَقِهَ هذا المزيج. جرّب زوجاً آخر.",
      sample: "العينة {n}", completeTitle: "لوحة الألوان الأحفورية جاهزة!", completeBody: "حللت كل العينات باستخدام {n} خلطات مستقرة. علّمت فيا دفتر الوصفات للرحلة التالية.", best: "أفضل جولة: {n} خلطات مستقرة", menuBest: "أفضل جولة: {n} خلطات مستقرة"
    }
  };
  const REAGENTS = [
    {id: "sun", name: {en: "Sun", "zh-Hant": "陽光", "zh-Hans": "阳光", ja: "太陽", ko: "태양", es: "Sol", "pt-BR": "Sol", fr: "Soleil", de: "Sonne", it: "Sole", ru: "Солнце", hi: "सूरज", ar: "شمس"}, colour: "#f6b64d"},
    {id: "leaf", name: {en: "Leaf", "zh-Hant": "葉綠", "zh-Hans": "叶绿", ja: "葉", ko: "잎", es: "Hoja", "pt-BR": "Folha", fr: "Feuille", de: "Blatt", it: "Foglia", ru: "Лист", hi: "पत्ता", ar: "ورقة"}, colour: "#5fc38a"},
    {id: "ocean", name: {en: "Ocean", "zh-Hant": "海藍", "zh-Hans": "海蓝", ja: "海", ko: "바다", es: "Océano", "pt-BR": "Oceano", fr: "Océan", de: "Ozean", it: "Oceano", ru: "Океан", hi: "समुद्र", ar: "محيط"}, colour: "#57b7d4"},
    {id: "berry", name: {en: "Berry", "zh-Hant": "莓果", "zh-Hans": "莓果", ja: "ベリー", ko: "베리", es: "Baya", "pt-BR": "Fruta", fr: "Baie", de: "Beere", it: "Bacca", ru: "Ягода", hi: "बेरी", ar: "توت"}, colour: "#b87ad5"},
    {id: "clay", name: {en: "Clay", "zh-Hant": "陶土", "zh-Hans": "陶土", ja: "粘土", ko: "점토", es: "Arcilla", "pt-BR": "Argila", fr: "Argile", de: "Ton", it: "Argilla", ru: "Глина", hi: "चिकनी मिट्टी", ar: "طين"}, colour: "#d67b5b"}
  ];
  const SAMPLES = [
    {target: {en: "Amber fossil", "zh-Hant": "琥珀化石", "zh-Hans": "琥珀化石", ja: "琥珀の化石", ko: "호박 화석", es: "Fósil ámbar", "pt-BR": "Fóssil âmbar", fr: "Fossile ambré", de: "Bernsteinfossil", it: "Fossile d'ambra", ru: "Янтарная окаменелость", hi: "अंबर जीवाश्म", ar: "أحفورة كهرمانية"}, colour: "#e69a4f", answer: ["clay", "sun"]},
    {target: {en: "Fern fossil", "zh-Hant": "蕨葉化石", "zh-Hans": "蕨叶化石", ja: "シダの化石", ko: "고사리 화석", es: "Fósil de helecho", "pt-BR": "Fóssil de samambaia", fr: "Fossile de fougère", de: "Farnfossil", it: "Fossile di felce", ru: "Окаменелый папоротник", hi: "फर्न जीवाश्म", ar: "أحفورة سرخس"}, colour: "#70ad75", answer: ["leaf", "ocean"]},
    {target: {en: "Violet fossil", "zh-Hant": "紫晶化石", "zh-Hans": "紫晶化石", ja: "紫水晶の化石", ko: "보랏빛 화석", es: "Fósil violeta", "pt-BR": "Fóssil violeta", fr: "Fossile violet", de: "Violettes Fossil", it: "Fossile viola", ru: "Фиолетовая окаменелость", hi: "बैंगनी जीवाश्म", ar: "أحفورة بنفسجية"}, colour: "#a67bc9", answer: ["berry", "sun"]}
  ];
  applyCopy(); show("main");
})();
