(function () {
  "use strict";
  const PEAK_PROGRESS_COPY = Object.freeze({
    en: { label: "Peaks", aria: "Peaks cleared: {cleared} of 3" },
    "zh-Hant": { label: "峰頂", aria: "已清除峰頂：{cleared}/3" },
    "zh-Hans": { label: "峰顶", aria: "已清除峰顶：{cleared}/3" },
    ja: { label: "ピーク", aria: "クリアしたピーク：{cleared}/3" },
    ko: { label: "피크", aria: "클리어한 피크: {cleared}/3" },
    es: { label: "Cimas", aria: "Cimas despejadas: {cleared} de 3" },
    "pt-BR": { label: "Picos", aria: "Picos limpos: {cleared} de 3" },
    fr: { label: "Pics", aria: "Pics dégagés : {cleared} sur 3" },
    de: { label: "Gipfel", aria: "Geräumte Gipfel: {cleared} von 3" },
    it: { label: "Cime", aria: "Cime liberate: {cleared} su 3" },
    ru: { label: "Вершины", aria: "Очищено вершин: {cleared} из 3" },
    hi: { label: "चोटियाँ", aria: "साफ़ की गई चोटियाँ: {cleared} में से 3" },
    ar: { label: "القمم", aria: "القمم المُنظّفة: {cleared} من 3" },
  });
  const STOCK_RESERVE_COPY = Object.freeze({
    en: { half: "Stock reserve: {count} cards. Protect a useful chain before drawing.", low: "Only {count} Stock cards remain. Protect a useful chain before drawing.", last: "Last Stock card. Draw only when the chain has stopped.", empty: "Stock is empty. Only a visible chain can continue." },
    "zh-Hant": { half: "牌庫剩 {count} 張；翻牌前先保留有用的連鎖。", low: "牌庫只剩 {count} 張；翻牌前先保留有用的連鎖。", last: "牌庫只剩最後一張；連鎖停下時再翻牌。", empty: "牌庫已空；只能靠桌面上可接續的牌。" },
    "zh-Hans": { half: "牌库剩 {count} 张；翻牌前先保留有用的连锁。", low: "牌库只剩 {count} 张；翻牌前先保留有用的连锁。", last: "牌库只剩最后一张；连锁停下时再翻牌。", empty: "牌库已空；只能靠桌面上可接续的牌。" },
    ja: { half: "山札は残り{count}枚。引く前に有効な連鎖を残しましょう。", low: "山札は残り{count}枚。引く前に有効な連鎖を守りましょう。", last: "山札はあと1枚。連鎖が止まってから引きましょう。", empty: "山札は空です。場の連鎖だけが続けられます。" },
    ko: { half: "덱이 {count}장 남았습니다. 뽑기 전에 유효한 콤보를 지키세요.", low: "덱이 {count}장만 남았습니다. 뽑기 전에 유효한 콤보를 지키세요.", last: "덱이 마지막 1장입니다. 콤보가 끊겼을 때 뽑으세요.", empty: "덱이 비었습니다. 보이는 연속 수만 이어갈 수 있습니다." },
    es: { half: "Quedan {count} cartas en el mazo. Protege una cadena útil antes de robar.", low: "Solo quedan {count} cartas en el mazo. Protege una cadena útil antes de robar.", last: "Queda la última carta del mazo. Roba solo cuando se corte la cadena.", empty: "El mazo está vacío. Solo puede continuar una cadena visible." },
    "pt-BR": { half: "Restam {count} cartas no monte. Proteja uma sequência útil antes de comprar.", low: "Restam apenas {count} cartas no monte. Proteja uma sequência útil antes de comprar.", last: "Resta a última carta do monte. Compre só quando a sequência parar.", empty: "O monte está vazio. Só uma sequência visível pode continuar." },
    fr: { half: "Il reste {count} cartes dans la pioche. Préservez une chaîne utile avant de piocher.", low: "Il ne reste que {count} cartes dans la pioche. Préservez une chaîne utile avant de piocher.", last: "Dernière carte de la pioche. Piochez seulement quand la chaîne s’arrête.", empty: "La pioche est vide. Seule une chaîne visible peut continuer." },
    de: { half: "Noch {count} Karten im Stapel. Bewahre vor dem Ziehen eine gute Kette.", low: "Nur noch {count} Karten im Stapel. Bewahre vor dem Ziehen eine gute Kette.", last: "Letzte Stapelkarte. Ziehe erst, wenn die Kette endet.", empty: "Der Stapel ist leer. Nur eine sichtbare Kette kann weitergehen." },
    it: { half: "Restano {count} carte nel tallone. Prima di pescare, conserva una buona catena.", low: "Restano solo {count} carte nel tallone. Prima di pescare, conserva una buona catena.", last: "Ultima carta del tallone. Pesca solo quando la catena si ferma.", empty: "Il tallone è vuoto. Può continuare solo una catena visibile." },
    ru: { half: "В колоде осталось карт: {count}. Сохраните полезную цепочку перед добором.", low: "В колоде осталось всего карт: {count}. Сохраните полезную цепочку перед добором.", last: "Последняя карта колоды. Добирайте, только когда цепочка прервётся.", empty: "Колода пуста. Продолжить можно только видимой цепочкой." },
    hi: { half: "डेक में {count} पत्ते बचे हैं। लेने से पहले उपयोगी क्रम बचाएँ।", low: "डेक में केवल {count} पत्ते बचे हैं। लेने से पहले उपयोगी क्रम बचाएँ।", last: "डेक का आखिरी पत्ता है। क्रम रुकने पर ही लें।", empty: "डेक खाली है। केवल दिखता हुआ क्रम ही जारी रह सकता है।" },
    ar: { half: "تبقى {count} بطاقة في الرزمة. حافظ على سلسلة مفيدة قبل السحب.", low: "تبقى {count} بطاقات فقط في الرزمة. حافظ على سلسلة مفيدة قبل السحب.", last: "هذه آخر بطاقة في الرزمة. اسحب فقط بعد توقف السلسلة.", empty: "الرزمة فارغة. لا يمكن المتابعة إلا بسلسلة ظاهرة." },
  });

  const ensurePeakProgress = () => {
    const header = document.querySelector("#battleScreen .battle-header");
    if (!header) return null;
    const existing = document.getElementById("tripeaksPeakProgress");
    if (existing) return existing;
    const stat = document.createElement("div");
    stat.id = "tripeaksPeakProgress";
    stat.className = "header-stat tripeaks-progress-stat";
    stat.setAttribute("aria-live", "polite");
    stat.innerHTML = '<small id="tripeaksPeakProgressLabel">Peaks</small><strong id="tripeaksPeakProgressValue" aria-label="Peaks cleared: 0 of 3">0/3</strong>';
    header.append(stat);
    return stat;
  };

  const updatePeakProgress = (view) => {
    const stat = ensurePeakProgress();
    const label = document.getElementById("tripeaksPeakProgressLabel");
    const value = document.getElementById("tripeaksPeakProgressValue");
    if (!view?.game || !stat || !label || !value) return;
    const copy = PEAK_PROGRESS_COPY[view.locale] || PEAK_PROGRESS_COPY.en;
    const cleared = view.game.cards.filter((entry) => entry.row === 0 && entry.removed).length;
    label.textContent = copy.label;
    value.textContent = `${cleared}/3`;
    value.setAttribute("aria-label", copy.aria.replace("{cleared}", String(cleared)));
    stat.dataset.cleared = String(cleared);
    stat.dataset.complete = String(cleared === 3);
  };

  const stockReserveBand = (count) => {
    if (count <= 0) return "empty";
    if (count === 1) return "last";
    if (count <= 6) return "low";
    if (count <= 12) return "half";
    return "";
  };

  const updateStockReserveCue = (view) => {
    const status = view?.nodes?.boardStatus;
    if (!status || !view.game || view.game.won || view.game.lost) return;
    const count = view.game.stock.length;
    const band = stockReserveBand(count);
    if (!band) return;
    const copy = STOCK_RESERVE_COPY[view.locale] || STOCK_RESERVE_COPY.en;
    clearTimeout(view.statusTimer);
    view.statusTimer = null;
    status.setAttribute("data-runtime-localize", "off");
    status.dataset.state = "tripeaks-stock-reserve";
    status.textContent = copy[band].replace("{count}", String(count));
  };

  const mount = () => {
    const mainReturn = document.querySelector(".main-return");
    if (mainReturn && !mainReturn.querySelector("img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      mainReturn.append(logo);
    }
    document.getElementById("battleBackBtn")?.setAttribute("data-wp-return", "battle");
    const view = window.WPClassicSolitaire?.mount({ variant: "tripeaks", id: "tripeaks-solitaire" });
    if (!view) return;
    let reserveRestoreTimer = null;
    const scheduleReserveRestore = () => {
      clearTimeout(reserveRestoreTimer);
      reserveRestoreTimer = setTimeout(() => updateStockReserveCue(view), 1550);
    };
    const showTriPeaksCue = view.showTriPeaksCue?.bind(view);
    if (showTriPeaksCue) {
      view.showTriPeaksCue = (...args) => {
        const result = showTriPeaksCue(...args);
        scheduleReserveRestore();
        return result;
      };
    }
    const feedback = view.feedback?.bind(view);
    if (feedback) {
      view.feedback = (...args) => {
        const result = feedback(...args);
        scheduleReserveRestore();
        return result;
      };
    }
    const render = view.render.bind(view);
    view.render = (...args) => {
      const result = render(...args);
      updatePeakProgress(view);
      updateStockReserveCue(view);
      return result;
    };
    updatePeakProgress(view);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
