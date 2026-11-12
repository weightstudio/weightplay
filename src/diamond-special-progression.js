(function (root) {
  "use strict";
  if (root.WeightPlayDiamondSpecial) return;
  // Opt-in pilot only. Stable per-level ownership is committed in the same
  // existing wallet envelope as the debit; no second game-save grant exists.
  const MAX_LEVEL = 20;
  const configs = Object.freeze({
    "deep-drill": Object.freeze({ skill: "resonance", base: 8, step: 2, band: 2 }),
    pawaxe: Object.freeze({ skill: "echo-cleave", base: 10, step: 3, band: 3,
      icon: "/games/pawaxe/art/objects/breaker-axe.webp?wp-media=07958c61dd7d18a0" }),
    "animal-prism-battalion": Object.freeze({ skill: "refraction", base: 9, step: 2, band: 3 }),
    "block-apex": Object.freeze({ skill: "slipstream-guard", base: 8, step: 2, band: 2,
      icon: "/assets/animal-rune-tactics-fx-guard-shield.webp?wp-media=07958c61dd7d18a0" }),
    "animal-rootvault-pins": Object.freeze({ skill: "time-rewind", base: 5, step: 2, band: 2 }),
  });
  const prefix = "diamond-special-v1", preferenceKey = "weightplayDiamondSpecialPrefsV1";
  const cache = new Map(), pending = new Map(), listeners = new Map(), mounts = new Map(), preferences = new Map();
  const keys = ["special", "permanent", "level", "current", "next", "cost", "balance", "buy", "busy", "max", "insufficient", "unavailable", "changed", "error", "success", "enabled", "off", "earn", "none", "confirm", "cancel", "cancelled", "unsupported", "infoError", "nextRun"];
  const rows = {
    en: ["Special ability", "Permanent upgrade", "Level {level}/{max}", "Current", "Next level", "Upgrade cost", "Diamonds", "Upgrade", "Upgrading…", "Maximum level reached", "Need {need} more diamonds", "Wallet unavailable; try again later", "Level changed. Check the new price", "Upgrade could not finish. Please retry", "Permanent upgrade saved", "Enable for the next run", "Off keeps the original gameplay", "Get free diamonds in the lobby", "Not unlocked; no special effect", "Confirm upgrade", "Cancel", "Cancelled; no diamonds spent", "This browser cannot upgrade right now", "Ability details are unavailable", "Changes apply on the next run"],
    "zh-tw": ["特殊能力", "永久升級", "等級 {level}/{max}", "目前", "下一級", "升級費用", "鑽石餘額", "升級", "升級中…", "已達等級上限", "還需 {need} 顆鑽石", "暫時無法讀取錢包，請稍後重試", "等級已更新，請核對新費用", "未能完成升級，請重試", "永久升級已保存", "下次開始啟用", "關閉時保留原本玩法", "前往大廳免費領鑽", "尚未解鎖，沒有特殊效果", "確認升級", "取消", "已取消，沒有扣鑽", "此瀏覽器目前無法升級", "暫時無法顯示能力資訊", "變更於下次開始生效"],
    "zh-cn": ["特殊能力", "永久升级", "等级 {level}/{max}", "当前", "下一级", "升级费用", "钻石余额", "升级", "升级中…", "已达等级上限", "还需 {need} 颗钻石", "暂时无法读取钱包，请稍后重试", "等级已更新，请核对新费用", "未能完成升级，请重试", "永久升级已保存", "下次开始启用", "关闭时保留原本玩法", "前往大厅免费领钻", "尚未解锁，没有特殊效果", "确认升级", "取消", "已取消，没有扣钻", "此浏览器目前无法升级", "暂时无法显示能力信息", "变更于下次开始生效"],
    ja: ["特殊能力", "永続アップグレード", "レベル {level}/{max}", "現在", "次のレベル", "必要ダイヤ", "ダイヤ残高", "強化", "強化中…", "最大レベルです", "ダイヤがあと{need}個必要です", "ウォレットを読み込めません。後でもう一度", "レベルが変わりました。価格を確認", "強化できませんでした。再試行してください", "永続強化を保存しました", "次のプレイで有効", "無効なら元の遊び方を維持", "ロビーで無料ダイヤを受け取る", "未解放：特殊効果なし", "強化を確定", "キャンセル", "キャンセル済み：消費なし", "このブラウザでは現在強化できません", "能力の詳細を表示できません", "変更は次のプレイから有効"],
    ko: ["특수 능력", "영구 강화", "레벨 {level}/{max}", "현재", "다음 레벨", "강화 비용", "다이아몬드", "강화", "강화 중…", "최대 레벨입니다", "다이아몬드 {need}개가 더 필요합니다", "지갑을 읽을 수 없습니다. 나중에 다시 시도하세요", "레벨이 바뀌었습니다. 새 비용을 확인하세요", "강화하지 못했습니다. 다시 시도하세요", "영구 강화를 저장했습니다", "다음 플레이에 사용", "끄면 기존 방식으로 플레이합니다", "로비에서 무료 다이아몬드 받기", "미해금: 특수 효과 없음", "강화 확인", "취소", "취소됨: 다이아몬드 미사용", "이 브라우저에서는 지금 강화할 수 없습니다", "능력 정보를 표시할 수 없습니다", "변경은 다음 플레이부터 적용됩니다"],
    es: ["Habilidad especial", "Mejora permanente", "Nivel {level}/{max}", "Actual", "Siguiente nivel", "Coste de mejora", "Diamantes", "Mejorar", "Mejorando…", "Nivel máximo alcanzado", "Faltan {need} diamantes", "Monedero no disponible. Inténtalo más tarde", "El nivel cambió. Revisa el nuevo coste", "No se pudo mejorar. Inténtalo de nuevo", "Mejora permanente guardada", "Activar en la próxima partida", "Desactivada conserva el juego original", "Consigue diamantes gratis en el vestíbulo", "Sin desbloquear: sin efecto especial", "Confirmar mejora", "Cancelar", "Cancelado: sin gastar diamantes", "Este navegador no puede mejorar ahora", "No se pueden mostrar los detalles", "Los cambios se aplican en la próxima partida"],
    "pt-br": ["Habilidade especial", "Melhoria permanente", "Nível {level}/{max}", "Atual", "Próximo nível", "Custo da melhoria", "Diamantes", "Melhorar", "Melhorando…", "Nível máximo atingido", "Faltam {need} diamantes", "Carteira indisponível. Tente mais tarde", "O nível mudou. Confira o novo custo", "Não foi possível melhorar. Tente novamente", "Melhoria permanente salva", "Ativar na próxima partida", "Desativada mantém o jogo original", "Receba diamantes grátis no saguão", "Não desbloqueada: sem efeito especial", "Confirmar melhoria", "Cancelar", "Cancelado: nenhum diamante gasto", "Este navegador não pode melhorar agora", "Detalhes da habilidade indisponíveis", "Mudanças valem na próxima partida"],
    fr: ["Capacité spéciale", "Amélioration permanente", "Niveau {level}/{max}", "Actuel", "Niveau suivant", "Coût", "Diamants", "Améliorer", "Amélioration…", "Niveau maximal atteint", "Il manque {need} diamants", "Portefeuille indisponible. Réessayez plus tard", "Le niveau a changé. Vérifiez le nouveau coût", "Amélioration impossible. Réessayez", "Amélioration permanente enregistrée", "Activer à la prochaine partie", "Désactivée : règles d'origine", "Obtenir des diamants gratuits dans le hall", "Non débloquée : aucun effet spécial", "Confirmer l'amélioration", "Annuler", "Annulé : aucun diamant dépensé", "Ce navigateur ne peut pas améliorer maintenant", "Détails de la capacité indisponibles", "Changements appliqués à la prochaine partie"],
    de: ["Spezialfähigkeit", "Dauerhafte Verbesserung", "Stufe {level}/{max}", "Aktuell", "Nächste Stufe", "Kosten", "Diamanten", "Verbessern", "Wird verbessert…", "Höchststufe erreicht", "Noch {need} Diamanten nötig", "Geldbörse nicht verfügbar. Später erneut versuchen", "Stufe geändert. Neue Kosten prüfen", "Verbesserung fehlgeschlagen. Erneut versuchen", "Dauerhafte Verbesserung gespeichert", "Im nächsten Spiel aktivieren", "Aus behält das ursprüngliche Spiel bei", "Kostenlose Diamanten in der Lobby holen", "Nicht freigeschaltet: kein Spezialeffekt", "Verbesserung bestätigen", "Abbrechen", "Abgebrochen: keine Diamanten verbraucht", "Dieser Browser kann derzeit nicht verbessern", "Fähigkeitsdetails nicht verfügbar", "Änderungen gelten ab dem nächsten Spiel"],
    it: ["Abilità speciale", "Potenziamento permanente", "Livello {level}/{max}", "Attuale", "Livello successivo", "Costo", "Diamanti", "Potenzia", "Potenziamento…", "Livello massimo raggiunto", "Servono altri {need} diamanti", "Portafoglio non disponibile. Riprova più tardi", "Livello cambiato. Controlla il nuovo costo", "Potenziamento non riuscito. Riprova", "Potenziamento permanente salvato", "Attiva nella prossima partita", "Disattivata mantiene il gioco originale", "Ottieni diamanti gratuiti nella sala", "Non sbloccata: nessun effetto speciale", "Conferma potenziamento", "Annulla", "Annullato: nessun diamante speso", "Questo browser non può potenziare ora", "Dettagli abilità non disponibili", "Le modifiche valgono dalla prossima partita"],
    ru: ["Особая способность", "Постоянное улучшение", "Уровень {level}/{max}", "Сейчас", "Следующий уровень", "Цена", "Алмазы", "Улучшить", "Улучшение…", "Достигнут максимум", "Нужно ещё {need} алмазов", "Кошелёк недоступен. Повторите позже", "Уровень изменился. Проверьте цену", "Не удалось улучшить. Повторите", "Постоянное улучшение сохранено", "Включить в следующей игре", "Без способности сохраняются исходные правила", "Получить бесплатные алмазы в лобби", "Не открыто: особого эффекта нет", "Подтвердить улучшение", "Отмена", "Отменено: алмазы не потрачены", "Этот браузер сейчас не может улучшать", "Описание способности недоступно", "Изменения действуют со следующей игры"],
    hi: ["विशेष क्षमता", "स्थायी उन्नयन", "स्तर {level}/{max}", "अभी", "अगला स्तर", "उन्नयन लागत", "हीरे", "उन्नत करें", "उन्नयन जारी…", "अधिकतम स्तर", "{need} और हीरे चाहिए", "वॉलेट उपलब्ध नहीं है। बाद में फिर कोशिश करें", "स्तर बदला है। नई कीमत जाँचें", "उन्नयन पूरा नहीं हुआ। फिर कोशिश करें", "स्थायी उन्नयन सहेजा गया", "अगले खेल में चालू करें", "बंद रखने पर मूल खेल बना रहता है", "लॉबी में मुफ़्त हीरे लें", "अनलॉक नहीं: विशेष प्रभाव नहीं", "उन्नयन की पुष्टि", "रद्द करें", "रद्द: कोई हीरा खर्च नहीं हुआ", "यह ब्राउज़र अभी उन्नयन नहीं कर सकता", "क्षमता का विवरण उपलब्ध नहीं है", "बदलाव अगले खेल से लागू होंगे"],
    ar: ["قدرة خاصة", "ترقية دائمة", "المستوى {level}/{max}", "الحالي", "المستوى التالي", "تكلفة الترقية", "الماس", "ترقية", "جارٍ الترقية…", "تم بلوغ المستوى الأقصى", "تحتاج إلى {need} ماس إضافي", "المحفظة غير متاحة، حاول لاحقًا", "تغير المستوى، راجع التكلفة الجديدة", "تعذرت الترقية، حاول مجددًا", "تم حفظ الترقية الدائمة", "تفعيل في الجولة التالية", "عند الإيقاف تبقى قواعد اللعب الأصلية", "احصل على ماس مجاني في الردهة", "لم تُفتح: لا تأثير خاص", "تأكيد الترقية", "إلغاء", "تم الإلغاء دون إنفاق ماس", "لا يمكن لهذا المتصفح الترقية الآن", "تفاصيل القدرة غير متاحة", "تسري التغييرات في الجولة التالية"],
  };
  const strings = Object.fromEntries(Object.entries(rows).map(([locale, values]) =>
    [locale, Object.freeze(Object.fromEntries(keys.map((key, i) => [key, values[i]])))]));
  function locale() {
    let value;
    try { value = root.WonderI18n?.actualLocale?.(); } catch { /* document owns the fallback */ }
    value = String(value || root.document?.documentElement?.lang || "en").toLowerCase();
    if (value.startsWith("zh-hant") || value === "zh-tw") return "zh-tw";
    if (value.startsWith("zh-hans") || value === "zh-cn" || value === "zh") return "zh-cn";
    if (value === "pt" || value.startsWith("pt-br")) return "pt-br";
    return strings[value] ? value : strings[value.split("-")[0]] ? value.split("-")[0] : "en";
  }
  function number(value) { try { return new Intl.NumberFormat(locale()).format(value); } catch { return String(value); } }
  function t(key, values = {}) {
    return (strings[locale()]?.[key] || strings.en[key] || key).replace(/\{(\w+)\}/g, (_, name) => number(values[name] ?? 0));
  }
  function inScope(gameId) {
    if (!Object.hasOwn(configs, gameId)) return false;
    const location = root.location || {};
    const route = String(location.pathname || "").match(/(?:^|\/)games\/([a-z0-9-]+)(?:\/(?:index\.html)?)?\/?$/i);
    const query = new URLSearchParams(location.search || "");
    return route?.[1] === gameId && !["preview", "trial", "qa", "test", "practice", "lobbyPreview"].some(key => query.has(key));
  }
  const sku = (gameId, level) => `${prefix}:${gameId}:${configs[gameId].skill}:${level}`;
  function quote(gameId, level) {
    const c = Object.hasOwn(configs, gameId) ? configs[gameId] : null;
    if (!c || !Number.isInteger(level) || level < 0 || level >= MAX_LEVEL) return null;
    return c.base + c.step * level + c.band * Math.floor(level / 5);
  }
  function preference(gameId) {
    if (preferences.has(gameId)) return preferences.get(gameId);
    try {
      const saved = JSON.parse(root.localStorage.getItem(preferenceKey) || "{}");
      return typeof saved?.[gameId] === "boolean" ? saved[gameId] : true;
    } catch { return true; }
  }
  function refresh(gameId) {
    let value = { level: 0, maxLevel: MAX_LEVEL, enabled: false, balance: 0, nextCost: quote(gameId, 0), available: false, canBuy: false, reason: "unavailable" };
    if (!inScope(gameId)) value.reason = "out_of_scope";
    else {
      try {
        const api = root.WeightPlayWallet, wallet = api?.read?.();
        if (wallet?.available !== false && Number.isSafeInteger(wallet?.diamonds) && wallet.diamonds >= 0 && wallet.purchases && typeof api.purchasePermanent === "function") {
          let level = 0, gap = false, invalid = false;
          for (let rank = 1; rank <= MAX_LEVEL; rank++) {
            const receipt = wallet.purchases[sku(gameId, rank)];
            if (receipt) { if (gap || receipt.cost !== quote(gameId, rank - 1)) invalid = true; else level = rank; }
            else gap = true;
          }
          if (!invalid) {
            const canBuy = typeof root.navigator?.locks?.request === "function";
            value = { level, maxLevel: MAX_LEVEL, enabled: level > 0 && preference(gameId), balance: wallet.diamonds,
              nextCost: quote(gameId, level), available: true, canBuy, reason: canBuy ? null : "unsupported" };
          }
        }
      } catch { /* A damaged/missing wallet cannot erase or create entitlement. */ }
    }
    const state = Object.freeze(value); cache.set(gameId, state); return state;
  }
  function read(gameId) { return !inScope(gameId) ? refresh(gameId) : cache.get(gameId) || refresh(gameId); }
  function notify(gameId) {
    const state = refresh(gameId);
    for (const fn of [...(listeners.get(gameId) || [])]) { try { fn(state); } catch { /* one view cannot interrupt delivery */ } }
    return state;
  }
  function refreshAll() { for (const gameId of Object.keys(configs)) if (inScope(gameId)) notify(gameId); }
  function subscribe(gameId, fn) {
    if (!Object.hasOwn(configs, gameId) || typeof fn !== "function") return () => {};
    if (!listeners.has(gameId)) listeners.set(gameId, new Set());
    listeners.get(gameId).add(fn); return () => listeners.get(gameId)?.delete(fn);
  }
  function setEnabled(gameId, enabled) {
    if (!inScope(gameId) || typeof enabled !== "boolean") return false;
    preferences.set(gameId, enabled);
    try {
      const raw = JSON.parse(root.localStorage.getItem(preferenceKey) || "{}");
      const saved = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
      root.localStorage.setItem(preferenceKey, JSON.stringify({ ...saved, [gameId]: enabled }));
    } catch { /* Keep a usable in-memory preference; never touch paid ownership. */ }
    notify(gameId); return true;
  }
  function buy(gameId, options = {}) {
    if (pending.has(gameId)) return pending.get(gameId);
    const expected = Number.isInteger(options.expectedLevel) ? options.expectedLevel : read(gameId).level;
    const run = Promise.resolve().then(async () => {
      const before = refresh(gameId);
      if (!inScope(gameId)) return { ok: false, reason: "out_of_scope", ...before };
      if (!before.available || !before.canBuy) return { ok: false, reason: before.reason || "unavailable", ...before };
      if (before.level !== expected) return { ...before, ok: false, reason: "changed" };
      if (before.level >= MAX_LEVEL) return { ...before, ok: false, reason: "max" };
      if (before.balance < before.nextCost) return { ...before, ok: false, reason: "insufficient" };
      try {
        const result = await root.WeightPlayWallet.purchasePermanent(sku(gameId, before.level + 1), before.nextCost);
        const after = notify(gameId);
        if (!result?.ok) return { ...after, ok: false, reason: result?.reason === "insufficient" ? "insufficient" : "unavailable" };
        if (!after.available || after.level < before.level + 1) return { ...after, ok: false, reason: "unavailable" };
        return { ...after, ok: true, reason: null, alreadyOwned: result.alreadyOwned === true };
      } catch { return { ...notify(gameId), ok: false, reason: "unavailable" }; }
    }).finally(() => pending.delete(gameId));
    pending.set(gameId, run); return run;
  }
  const iconPaths = {
    "deep-drill": '<path d="M10 3h12v8H10zM13 11v10l3 4 3-4V11M4 8H1m30 0h-3M4 16H1m30 0h-3M8 26l-3 3m19-3 3 3"/>',
    pawaxe: '<path d="m9 28 12-20M15 5l8-2 5 8-10 3zM5 15a10 10 0 0 0 8 10"/>',
    "animal-prism-battalion": '<path d="m16 4 11 21H5zM1 16h10m10 0 10-7m-10 7 10 10"/>',
    "block-apex": '<path d="M16 3 27 7v9c0 6-6 10-11 13C11 26 5 22 5 16V7zM10 16h12m-6-6 6 6-6 6"/>',
    "animal-rootvault-pins": '<path d="M5 10a12 12 0 1 1-1 11M5 3v8h8M16 9v8l6 3"/>',
  };
  function iconUrl(gameId) { return configs[gameId]?.icon || null; }
  function titleFor(title) {
    const code = locale(), alias = code === "zh-tw" ? "zh-Hant" : code === "zh-cn" ? "zh-Hans" : code === "pt-br" ? "pt-BR" : code;
    return typeof title === "string" ? title : title?.[code] || title?.[alias] || title?.en || t("special");
  }
  function mount({ gameId, container, title, describe, onChange } = {}) {
    if (!inScope(gameId) || !container?.append || typeof describe !== "function") return null;
    // If the optional skin failed, ordinary play remains available and an
    // unstyled purchase surface is never offered.
    const skin = root.document?.querySelector('link[href*="/src/diamond-special-progression.css?wp-media=07958c61dd7d18a0"]');
    if (!skin?.sheet) return null;
    mounts.get(gameId)?.destroy();
    const document = root.document, abort = new AbortController();
    let destroyed = false, busy = false, message = "", intent = null;
    const card = document.createElement("section"); card.className = "wp-diamond-special"; card.dataset.wpDiamondSpecial = gameId;
    // Game themes may force transparent Stage sections. Keep the purchase
    // surface opaque without changing the surrounding shared frame.
    card.style.setProperty("background", "#15353a", "important");
    const header = document.createElement("div"); header.className = "wpds-header";
    const picture = document.createElement("span"); picture.className = "wpds-icon"; picture.setAttribute("aria-hidden", "true");
    if (iconUrl(gameId)) { const img = document.createElement("img"); img.src = iconUrl(gameId); img.alt = ""; picture.append(img); }
    else picture.innerHTML = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPaths[gameId]}</svg>`;
    const heading = document.createElement("div"), name = document.createElement("h4"), kind = document.createElement("small"); heading.append(name, kind);
    const level = document.createElement("strong"); level.className = "wpds-level"; header.append(picture, heading, level);
    const meter = document.createElement("progress"); meter.max = MAX_LEVEL; meter.className = "wpds-progress";
    const effects = document.createElement("dl"); effects.className = "wpds-effects";
    const currentLabel = document.createElement("dt"), current = document.createElement("dd"), nextLabel = document.createElement("dt"), next = document.createElement("dd"); effects.append(currentLabel, current, nextLabel, next);
    const economy = document.createElement("div"); economy.className = "wpds-economy";
    const balance = document.createElement("span"), cost = document.createElement("span");
    function gemLine(node, label, value) { node.replaceChildren(); const img = document.createElement("img"); img.src = "/assets/weightplay-diamond.svg"; img.alt = ""; img.width = 18; img.height = 18; const text = document.createElement("span"); text.textContent = `${label} ${value}`; node.append(img, text); }
    economy.append(balance, cost);
    const options = document.createElement("label"); options.className = "wpds-toggle";
    const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.dataset.wpDiamondEnabled = "";
    const optionText = document.createElement("span"); options.append(checkbox, optionText);
    const button = document.createElement("button"); button.type = "button"; button.className = "wpds-buy"; button.dataset.wpDiamondBuy = "";
    const status = document.createElement("p"); status.className = "wpds-status"; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    const note = document.createElement("small"); note.className = "wpds-note";
    const earn = document.createElement("a"); earn.className = "wpds-earn";
    card.append(header, meter, effects, economy, options, button, status, note, earn); container.append(card);
    const dialog = document.createElement("dialog"); dialog.className = "wpds-dialog";
    const dialogTitle = document.createElement("h3"), dialogEffect = document.createElement("p"), dialogPrice = document.createElement("p"), dialogStatus = document.createElement("p"), actions = document.createElement("div"); actions.className = "wpds-dialog-actions";
    dialogStatus.setAttribute("role", "status");
    const cancel = document.createElement("button"), confirm = document.createElement("button"); cancel.type = confirm.type = "button"; cancel.dataset.wpDiamondCancel = ""; confirm.dataset.wpDiamondConfirm = ""; actions.append(cancel, confirm); dialog.append(dialogTitle, dialogEffect, dialogPrice, dialogStatus, actions); document.body.append(dialog);
    function description(rank) { if (rank === 0) return t("none"); try { return String(describe(rank, locale()) || ""); } catch { return ""; } }
    function render() {
      if (destroyed) return;
      const state = read(gameId), maximum = state.level >= MAX_LEVEL, nextText = maximum ? t("max") : description(state.level + 1);
      name.textContent = titleFor(title); kind.textContent = `${t("special")} · ${t("permanent")}`; level.textContent = t("level", { level: state.level, max: MAX_LEVEL });
      meter.value = state.level; meter.setAttribute("aria-label", level.textContent);
      currentLabel.textContent = t("current"); current.textContent = description(state.level) || t("infoError"); nextLabel.textContent = t("next"); next.textContent = nextText || t("infoError");
      gemLine(balance, t("balance"), state.available ? number(state.balance) : "—"); gemLine(cost, t("cost"), maximum ? "—" : number(state.nextCost));
      checkbox.checked = state.enabled; checkbox.disabled = busy || state.level === 0; optionText.textContent = t("enabled");
      button.textContent = busy ? t("busy") : maximum ? t("max") : t("buy");
      button.disabled = busy || maximum || !state.available || !state.canBuy || state.balance < state.nextCost || !nextText;
      const need = Math.max(0, (state.nextCost || 0) - state.balance);
      const requirement = !state.available ? t("unavailable") : !state.canBuy ? t("unsupported") : !nextText ? t("infoError") : !maximum && need ? t("insufficient", { need }) : maximum ? t("max") : "";
      status.textContent = busy ? t("busy") : [...new Set([message ? t(message, { need }) : "", requirement].filter(Boolean))].join(" · ");
      note.textContent = `${t("nextRun")} · ${t("off")}`; earn.textContent = t("earn"); earn.href = `/${locale() === "zh-cn" ? "zh-cn" : locale()}/#weightplayCastle`;
      card.dir = locale() === "ar" ? "rtl" : "ltr"; dialog.dir = card.dir;
    }
    function close(cancelled = false) { if (busy) return; if (dialog.open) dialog.close(); intent = null; if (cancelled) message = "cancelled"; render(); if (button.isConnected) button.focus({ preventScroll: true }); }
    button.addEventListener("click", () => {
      if (busy) return; const state = refresh(gameId); message = ""; render();
      if (!state.available || !state.canBuy || state.nextCost === null || state.balance < state.nextCost) return;
      intent = { level: state.level, cost: state.nextCost };
      dialogTitle.textContent = `${titleFor(title)} · ${t("permanent")}`;
      dialogEffect.textContent = `${t("next")} — ${description(state.level + 1)}`; dialogPrice.textContent = `${t("cost")} ${number(intent.cost)} · ${t("balance")} ${number(state.balance)}`;
      dialogStatus.textContent = ""; cancel.textContent = t("cancel"); confirm.textContent = t("confirm"); cancel.disabled = confirm.disabled = false;
      if (typeof dialog.showModal === "function") { dialog.showModal(); cancel.focus(); } else { intent = null; message = "unsupported"; render(); }
    }, { signal: abort.signal });
    cancel.addEventListener("click", () => close(true), { signal: abort.signal });
    dialog.addEventListener("cancel", event => { event.preventDefault(); close(true); }, { signal: abort.signal });
    confirm.addEventListener("click", async () => {
      if (busy || !intent) return; busy = true; cancel.disabled = confirm.disabled = true; confirm.textContent = t("busy"); dialogStatus.textContent = t("busy"); render();
      const result = await buy(gameId, { expectedLevel: intent.level });
      busy = false; if (destroyed) return;
      if (dialog.open) dialog.close(); intent = null; message = result.ok ? "success" : ["changed", "insufficient", "max"].includes(result.reason) ? result.reason : "unavailable";
      render();
      if (result.ok) { root.WeightPlayAudio?.play?.("reward.upgrade"); card.animate?.([{ boxShadow: "0 0 0 3px #f1d780" }, { boxShadow: "0 0 0 0 transparent" }], { duration: root.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 80 : 180 }); }
      if (button.isConnected) button.focus({ preventScroll: true });
    }, { signal: abort.signal });
    checkbox.addEventListener("change", () => { setEnabled(gameId, checkbox.checked); message = ""; render(); }, { signal: abort.signal });
    const unsubscribe = subscribe(gameId, state => { render(); try { onChange?.(state); } catch { /* presentation is optional */ } });
    const controller = Object.freeze({ refresh: render, destroy() { if (destroyed) return; destroyed = true; unsubscribe(); abort.abort(); card.getAnimations?.().forEach(animation => animation.cancel()); if (dialog.open) dialog.close(); dialog.remove(); card.remove(); if (mounts.get(gameId) === controller) mounts.delete(gameId); } });
    mounts.set(gameId, controller); render(); return controller;
  }
  root.addEventListener?.("weightplay:wallet-change", refreshAll);
  root.addEventListener?.("storage", event => { if (event.key === "weightplayWallet" || event.key === preferenceKey || event.key === null) { if (event.key !== "weightplayWallet") preferences.clear(); refreshAll(); } });
  root.addEventListener?.("pageshow", refreshAll);
  root.addEventListener?.("wonder:locale-change", () => { for (const controller of mounts.values()) controller.refresh(); });
  root.WeightPlayDiamondSpecial = Object.freeze({ maxLevel: MAX_LEVEL, gameIds: Object.freeze(Object.keys(configs)), read, buy, quote, setEnabled, subscribe, mount, iconUrl });
})(window);
