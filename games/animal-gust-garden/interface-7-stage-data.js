(function () {
  "use strict";
  if (document.body?.dataset.wpGameId !== "animal-gust-garden") return;

  const rail = document.getElementById("stageList");
  if (!rail) return;

  let capturing = false;
  let descriptors = [];
  let activators = [];
  let stageVirtual = null;
  const nativeCreateElement = Document.prototype.createElement;
  const nativeReplaceChildren = rail.replaceChildren.bind(rail);
  const nativeAppendChild = rail.appendChild.bind(rail);
  const nativeQuerySelector = rail.querySelector.bind(rail);

  function fakeButton() {
    const attrs = new Map();
    return {
      __wpGustStageFake: true,
      type: "button",
      className: "",
      dataset: {},
      disabled: false,
      innerHTML: "",
      setAttribute(name, value) { attrs.set(name, String(value)); },
      getAttribute(name) { return attrs.get(name) ?? null; },
      removeAttribute(name) { attrs.delete(name); },
      addEventListener(type, callback) { if (type === "click") this.__click = callback; },
      __attrs: attrs,
      __click: null,
    };
  }

  document.createElement = function (tagName, options) {
    if (capturing && String(tagName).toLowerCase() === "button") return fakeButton();
    return nativeCreateElement.call(this, tagName, options);
  };

  rail.replaceChildren = function (...nodes) {
    if (nodes.length) return nativeReplaceChildren(...nodes);
    capturing = true;
    descriptors = [];
    activators = [];
    if (!stageVirtual) nativeReplaceChildren();
  };

  rail.appendChild = function (node) {
    if (!capturing || !node?.__wpGustStageFake) return nativeAppendChild(node);
    const logicalIndex = Math.max(0, Number(node.dataset.stageIndex || descriptors.length + 1) - 1);
    descriptors[logicalIndex] = {
      className: node.className || "stage-card",
      disabled: Boolean(node.disabled),
      innerHTML: node.innerHTML || "",
      ariaDisabled: node.getAttribute("aria-disabled") || String(Boolean(node.disabled)),
      wpEnterBattle: node.dataset.wpEnterBattle || "true",
    };
    activators[logicalIndex] = node.__click;
    return node;
  };

  rail.querySelector = function (selector) {
    if (capturing && /^\[data-stage-index=/.test(String(selector))) {
      capturing = false;
      queueMicrotask(refreshVirtual);
      return null;
    }
    return nativeQuerySelector(selector);
  };

  function highestUnlocked() {
    let last = 0;
    descriptors.forEach((descriptor, index) => { if (descriptor && !descriptor.disabled) last = index; });
    return last;
  }

  function bindCard(card, index) {
    const source = descriptors[index];
    if (!source) {
      card.hidden = true;
      card.setAttribute("aria-disabled", "true");
      return;
    }
    card.hidden = false;
    card.type = "button";
    card.className = source.className || "stage-card";
    card.dataset.wpEnterBattle = source.wpEnterBattle;
    card.setAttribute("aria-disabled", source.ariaDisabled);
    card.innerHTML = source.innerHTML;
  }

  function activateStage(index, card = null) {
    const logicalIndex = Number(index);
    if (!Number.isInteger(logicalIndex) || logicalIndex < 0 || logicalIndex >= descriptors.length) return false;
    const source = descriptors[logicalIndex];
    if (!source || source.disabled || source.ariaDisabled === "true") return false;
    const target = card || nativeQuerySelector(`[data-wp-stage-virtual-index="${logicalIndex}"]`) || rail;
    activators[logicalIndex]?.call(target);
    return typeof activators[logicalIndex] === "function";
  }

  function installVirtual() {
    if (stageVirtual || !window.WeightPlayStageV6?.install || !descriptors.length) return;
    rail.removeAttribute("data-wp-stage-v6-auto");
    rail.removeAttribute("data-wp-stage-v6-total");
    rail.removeAttribute("data-wp-stage-v6-pool-size");
    stageVirtual = window.WeightPlayStageV6.install(rail, {
      total: () => descriptors.length,
      poolSize: 9,
      initialIndex: highestUnlocked,
      bind: bindCard,
      activate: (index, _source, card) => activateStage(index, card),
    });
  }

  function refreshVirtual() {
    installVirtual();
    if (!stageVirtual) return;
    rail.removeAttribute("data-wp-stage-v6-auto");
    rail.removeAttribute("data-wp-stage-v6-total");
    rail.removeAttribute("data-wp-stage-v6-pool-size");
    stageVirtual.refresh();
    stageVirtual.center(highestUnlocked());
  }

  window.addEventListener("weightplay:gust-stage-activate", (event) => {
    activateStage(Number(event.detail?.index));
  });

  const leaveCopy = {
    en: ["Leave this stage?", "Leaving {stage} ends this attempt and discards its current garden. Cleared stages stay saved.", "Continue", "Return to Stages"],
    "zh-Hant": ["離開這一關？", "離開「{stage}」會結束這次嘗試並捨棄目前花園；已完成的關卡仍會保留。", "繼續", "返回關卡"],
    "zh-Hans": ["离开这一关？", "离开“{stage}”会结束这次尝试并丢弃当前花园；已完成的关卡仍会保留。", "继续", "返回关卡"],
    ja: ["このステージを離れますか？", "「{stage}」を離れると現在の庭の状態は破棄されます。クリア済みステージは保存されます。", "続ける", "ステージへ戻る"],
    ko: ["이 스테이지를 나갈까요?", "{stage}에서 나가면 현재 정원 상태가 사라집니다. 완료한 스테이지는 저장됩니다.", "계속", "스테이지로 돌아가기"],
    es: ["¿Salir de este nivel?", "Salir de {stage} termina este intento y descarta el jardín actual. Los niveles completados siguen guardados.", "Continuar", "Volver a Niveles"],
    "pt-BR": ["Sair desta fase?", "Sair de {stage} encerra esta tentativa e descarta o jardim atual. As fases concluídas continuam salvas.", "Continuar", "Voltar às Fases"],
    fr: ["Quitter ce niveau ?", "Quitter {stage} termine cette tentative et abandonne le jardin actuel. Les niveaux terminés restent enregistrés.", "Continuer", "Retour aux Niveaux"],
    de: ["Diese Stufe verlassen?", "Wenn du {stage} verlässt, endet dieser Versuch und der aktuelle Garten wird verworfen. Abgeschlossene Stufen bleiben gespeichert.", "Fortfahren", "Zurück zu Stufen"],
    it: ["Uscire da questo livello?", "Uscire da {stage} termina questo tentativo e scarta il giardino attuale. I livelli completati restano salvati.", "Continua", "Torna ai Livelli"],
    ru: ["Выйти из уровня?", "Выход из {stage} завершит эту попытку и сбросит текущий сад. Пройденные уровни останутся сохранены.", "Продолжить", "К уровням"],
    hi: ["यह स्तर छोड़ें?", "{stage} छोड़ने पर यह प्रयास समाप्त होगा और मौजूदा बगीचा मिट जाएगा। पूरे किए गए स्तर सुरक्षित रहेंगे।", "जारी रखें", "स्तरों पर लौटें"],
    ar: ["مغادرة هذه المرحلة؟", "مغادرة {stage} تنهي هذه المحاولة وتتجاهل الحديقة الحالية، بينما تبقى المراحل المكتملة محفوظة.", "متابعة", "العودة إلى المراحل"],
  };

  function locale() {
    const value = document.documentElement.lang || "en";
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value.toLowerCase().startsWith("pt")) return "pt-BR";
    return leaveCopy[value] ? value : "en";
  }

  function localizeLeaveModal() {
    const modal = document.getElementById("gustGardenLeaveModal");
    if (!modal || modal.hidden) return;
    const [title, text, keep, stages] = leaveCopy[locale()] || leaveCopy.en;
    const stage = document.getElementById("stageTitle")?.textContent?.trim() || "this stage";
    const titleNode = document.getElementById("gustGardenLeaveTitle");
    const textNode = document.getElementById("gustGardenLeaveText");
    const keepNode = document.getElementById("gustGardenLeaveContinue");
    const stagesNode = document.getElementById("gustGardenLeaveStages");
    if (titleNode) titleNode.textContent = title;
    if (textNode) textNode.textContent = text.replaceAll("{stage}", stage);
    if (keepNode) keepNode.textContent = keep;
    if (stagesNode) stagesNode.textContent = stages;
  }

  function installPostBootFixes() {
    refreshVirtual();
    const style = document.createElement("style");
    style.id = "gustGardenStageDataInterface7";
    style.textContent = `
      html[data-wp-shared-interface="7"] body[data-wp-game-id="animal-gust-garden"] #stageScreen .stage-canvas > div:nth-child(2){position:relative!important;display:block!important;min-height:0!important;overflow:hidden!important}
      html[data-wp-shared-interface="7"] body[data-wp-game-id="animal-gust-garden"] #stageScreen .stage-rail{position:absolute!important;inset-inline:0!important;top:clamp(103px,38%,calc(100% - 103px))!important;transform:translateY(-50%)!important;width:100%!important;height:190px!important;min-height:190px!important;max-height:190px!important;margin:0!important;padding-inline:12px!important;overflow:hidden!important;touch-action:none!important;scroll-snap-type:none!important}
      html[data-wp-shared-interface="7"] body[data-wp-game-id="animal-gust-garden"] #stageScreen .stage-rail>.stage-card{flex:0 0 264px!important;width:264px!important;min-width:264px!important;max-width:264px!important;height:190px!important;min-height:190px!important;max-height:190px!important}
      html[data-wp-shared-interface="7"] body[data-wp-game-id="animal-gust-garden"] #stageScreen .stage-tabs{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;padding:6px!important;height:56px!important;min-height:56px!important;max-height:56px!important}
      html[data-wp-shared-interface="7"] body[data-wp-game-id="animal-gust-garden"] #stageScreen .stage-tabs>button{grid-column:2!important;height:44px!important;min-height:44px!important;max-height:44px!important;padding-inline:10px!important;font-size:14px!important;line-height:1.2!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important}
    `;
    document.head.appendChild(style);

    const bodyObserver = new MutationObserver(() => {
      const modal = document.getElementById("gustGardenLeaveModal");
      if (modal && !modal.dataset.wpLocalizedObserver) {
        modal.dataset.wpLocalizedObserver = "true";
        new MutationObserver(localizeLeaveModal).observe(modal, { attributes: true, attributeFilter: ["hidden"] });
      }
      localizeLeaveModal();
      rail.removeAttribute("data-wp-stage-v6-auto");
      rail.removeAttribute("data-wp-stage-v6-total");
      rail.removeAttribute("data-wp-stage-v6-pool-size");
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-wp-active-screen"] });
    localizeLeaveModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(installPostBootFixes, 0), { once: true });
  } else {
    setTimeout(installPostBootFixes, 0);
  }
}());
