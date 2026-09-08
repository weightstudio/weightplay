/* Wordle-owned input and count-aware feedback; no other arcade game is changed. */
(() => {
  const COPY = {
    en: ["Guess a 5-letter English word in 6 tries.", "Tap letters, then Submit. Try CRANE first.", "Correct place", "Other place", "Not in word", "Submit", "Delete", "Guess", "Enter 5 English letters.", "Use the clues for your next guess."],
    "zh-tw": ["6 次機會，猜出 5 個字母的英文單字。", "點下方字母再提交，可先試 CRANE。", "位置正確", "位置不同", "沒有此字母", "提交", "刪除", "第幾次猜測", "請輸入 5 個英文字母。", "依照顏色線索，換一個單字再猜。"],
    "zh-cn": ["6 次机会，猜出 5 个字母的英文单词。", "点下方字母再提交，可先试 CRANE。", "位置正确", "位置不同", "没有此字母", "提交", "删除", "第几次猜测", "请输入 5 个英文字母。", "按照颜色线索，换一个单词再猜。"],
    ja: ["6 回以内に英語の 5 文字の単語を当てよう。", "下の文字を押して送信。まず CRANE を試そう。", "位置が正しい", "別の位置", "含まれない", "送信", "削除", "予想", "英字を 5 文字入力してください。", "色のヒントで次の単語を考えよう。"],
    ko: ["6번 안에 영어 5글자 단어를 맞히세요.", "아래 글자를 누르고 제출하세요. CRANE부터 시도해 보세요.", "정확한 위치", "다른 위치", "없는 글자", "제출", "삭제", "추측", "영문자 5개를 입력하세요.", "색상 단서를 보고 다음 단어를 추측하세요."],
    es: ["Adivina una palabra inglesa de 5 letras en 6 intentos.", "Toca letras y envía. Prueba CRANE primero.", "Lugar correcto", "Otro lugar", "No aparece", "Enviar", "Borrar", "Intento", "Introduce 5 letras inglesas.", "Usa los colores para tu próxima palabra."],
    "pt-br": ["Adivinhe uma palavra inglesa de 5 letras em 6 tentativas.", "Toque nas letras e envie. Tente CRANE primeiro.", "Lugar certo", "Outro lugar", "Não aparece", "Enviar", "Apagar", "Tentativa", "Digite 5 letras inglesas.", "Use as cores para escolher a próxima palavra."],
    fr: ["Devine un mot anglais de 5 lettres en 6 essais.", "Touche les lettres puis valide. Essaie CRANE.", "Bonne place", "Autre place", "Lettre absente", "Valider", "Effacer", "Essai", "Saisis 5 lettres anglaises.", "Utilise les couleurs pour choisir le prochain mot."],
    de: ["Errate ein englisches Wort mit 5 Buchstaben in 6 Versuchen.", "Tippe Buchstaben und sende. Probiere zuerst CRANE.", "Richtiger Platz", "Anderer Platz", "Nicht enthalten", "Senden", "Löschen", "Versuch", "Gib 5 englische Buchstaben ein.", "Nutze die Farben für dein nächstes Wort."],
    it: ["Indovina una parola inglese di 5 lettere in 6 tentativi.", "Tocca le lettere e invia. Prova prima CRANE.", "Posto giusto", "Altro posto", "Lettera assente", "Invia", "Cancella", "Tentativo", "Inserisci 5 lettere inglesi.", "Usa i colori per scegliere la prossima parola."],
    ru: ["Угадай английское слово из 5 букв за 6 попыток.", "Нажимай буквы и отправляй. Начни с CRANE.", "Верное место", "Другое место", "Нет в слове", "Отправить", "Удалить", "Попытка", "Введите 5 английских букв.", "Используй цвета для следующего слова."],
    hi: ["6 कोशिशों में 5 अक्षरों वाला अंग्रेज़ी शब्द बूझें।", "नीचे अक्षर दबाकर भेजें। पहले CRANE आज़माएँ।", "सही जगह", "दूसरी जगह", "शब्द में नहीं", "भेजें", "मिटाएँ", "कोशिश", "5 अंग्रेज़ी अक्षर लिखें।", "रंगों के संकेत से अगला शब्द चुनें।"],
    ar: ["خمّن كلمة إنجليزية من 5 أحرف خلال 6 محاولات.", "اضغط الأحرف ثم أرسل. جرّب CRANE أولًا.", "مكان صحيح", "مكان آخر", "غير موجود", "إرسال", "حذف", "محاولة", "أدخل 5 أحرف إنجليزية.", "استخدم إشارات الألوان لتخمين الكلمة التالية."]
  };
  const copy = (locale) => COPY[({"zh-Hant":"zh-tw","zh-Hans":"zh-cn","pt-BR":"pt-br"})[locale] || locale] || COPY.en;
  function feedback(guess, target) {
    const result = Array(5).fill("miss"), remaining = {};
    for (let i = 0; i < 5; i++) {
      if (guess[i] === target[i]) result[i] = "hit";
      else remaining[target[i]] = (remaining[target[i]] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) if (result[i] !== "hit" && remaining[guess[i]] > 0) {
      result[i] = "near"; remaining[guess[i]]--;
    }
    return result;
  }
  let active;
  function render(ctx) {
    active = ctx;
    const {state, locale, board, controls} = ctx, c = copy(locale);
    // This dictionary already owns all 13 locales. English puzzle letters and
    // revealed answers must not be translated into a different-language word.
    for (const node of [board, controls, document.querySelector('#resultCopy')]) {
      if (node) node.dataset.runtimeLocalize = 'off';
    }
    const tones = state.guesses.map(g => feedback(g, state.target));
    const keys = {}, rank = {miss:1, near:2, hit:3}, symbols = {hit:"✓",near:"↔",miss:"×"};
    state.guesses.forEach((g,r) => [...g].forEach((letter,i) => {
      if ((rank[keys[letter]] || 0) < rank[tones[r][i]]) keys[letter] = tones[r][i];
    }));
    board.innerHTML = `<div class="wordle-board" dir="ltr" role="table" aria-label="${c[0]}" data-word-key="${state.wordKey}">${Array.from({length:6},(_,r) => `<div class="wordle-row${r === state.guesses.length ? " active-guess" : ""}" role="row">${Array.from({length:5},(_,i) => {
      const letter = (state.guesses[r] || (r === state.guesses.length ? state.draft || "" : ""))[i] || "";
      const tone = tones[r]?.[i] || "";
      const label = tone ? c[2 + ["hit","near","miss"].indexOf(tone)] : "";
      return `<span class="word-cell ${tone}" role="cell" aria-label="${r+1}, ${i+1}: ${letter || "—"} ${label}">${letter}<small aria-hidden="true">${symbols[tone] || ""}</small></span>`;
    }).join("")}</div>`).join("")}</div>`;
    controls.innerHTML = `<div class="wordle-help"><strong>${c[0]}</strong><p>${c[1]}</p><div class="wordle-legend">${["hit","near","miss"].map((t,i) => `<span class="${t}">${symbols[t]} ${c[i+2]}</span>`).join("")}</div></div><div class="wordle-keyboard" dir="ltr" role="group" aria-label="${c[7]}">${["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"].map(row => `<div class="wordle-key-row">${[...row].map(k => `<button type="button" class="wordle-key ${keys[k] || ""}" data-word-key="${k}" aria-label="${k}${keys[k] ? `: ${c[2+["hit","near","miss"].indexOf(keys[k])]}` : ""}">${k}</button>`).join("")}</div>`).join("")}<div class="wordle-key-row wordle-command-row"><button type="button" data-word-key="BACKSPACE" aria-label="${c[6]}">⌫ ${c[6]}</button><button type="button" class="primary" data-word-key="ENTER">${c[5]} · ${Math.min(6,state.guesses.length+1)}/6</button></div></div>`;
    controls.onclick = e => { const key = e.target.closest("button[data-word-key]"); if (key) input(key.dataset.wordKey); };
  }
  function input(key) {
    if (!active || active.state.done || document.body.dataset.screen !== "battle") return;
    const {state} = active;
    if (key === "ENTER") { active.submit(); return; }
    state.draft = state.draft || "";
    if (key === "BACKSPACE") state.draft = state.draft.slice(0,-1);
    else if (/^[A-Z]$/.test(key) && state.draft.length < 5) state.draft += key;
    else return;
    const focusedKey = /^[A-Z]$/.test(key) ? key : document.activeElement?.dataset?.wordKey;
    render(active);
    if (focusedKey) active.controls.querySelector(`button[data-word-key="${focusedKey}"]`)?.focus({preventScroll:true});
  }
  document.addEventListener("keydown", e => {
    if (!active || document.body.dataset.screen !== "battle" || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    if (document.querySelector('dialog[open]') || e.target.closest?.('input,textarea,select,[contenteditable="true"]')) return;
    if (e.key === "Enter" && e.target.closest?.('button') && !active.controls.contains(e.target)) return;
    if (/^[a-z]$/i.test(e.key) || ["Enter","Backspace"].includes(e.key)) { e.preventDefault(); input(e.key.toUpperCase()); }
  });
  window.WPWordleUI = {render, feedback, copy};
})();
