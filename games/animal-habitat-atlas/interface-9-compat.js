(() => {
  "use strict";

  if (document.body?.dataset.wpMarketGame !== "animal-habitat-atlas") return;

  const battle = document.getElementById("battle-screen");
  const battleBack = document.getElementById("battle-back");
  const result = document.getElementById("result-screen");
  const resultToStages = document.getElementById("to-stages");
  const stageLabel = document.getElementById("stage-label");
  if (!battle || !battleBack || !result || !resultToStages) return;

  // Result belongs to the permanent Battle canvas. It is a Battle substate,
  // never a fourth top-level screen in the shared I9 Frame flow.
  result.classList.remove("screen");
  result.removeAttribute("data-screen");
  result.dataset.wpBattleSubstate = "result";

  const COPY = Object.freeze({
    en: [
      "Leave {stage}?",
      "Your current rescue route and unsaved actions in {stage} will be discarded. Completed expeditions stay saved.",
      "Continue exploring",
      "Return to Stages",
    ],
    "zh-Hant": [
      "離開 {stage}？",
      "目前在 {stage} 的救援路線與未結算行動會被放棄，已完成的探險仍會保留。",
      "繼續探索",
      "返回關卡",
    ],
    "zh-Hans": [
      "离开 {stage}？",
      "当前在 {stage} 的救援路线与未结算行动会被放弃，已完成的探险仍会保留。",
      "继续探索",
      "返回关卡",
    ],
    ja: [
      "{stage} を離れますか？",
      "{stage} の救助ルートと未確定の行動は破棄されます。完了済みの探検は保存されます。",
      "探索を続ける",
      "ステージへ戻る",
    ],
    ko: [
      "{stage}에서 나갈까요?",
      "{stage}의 구조 경로와 저장되지 않은 행동은 사라집니다. 완료한 탐험은 저장됩니다.",
      "계속 탐험하기",
      "스테이지로 돌아가기",
    ],
    es: [
      "¿Salir de {stage}?",
      "Se perderán la ruta de rescate y las acciones sin guardar en {stage}. Las expediciones completadas seguirán guardadas.",
      "Seguir explorando",
      "Volver a etapas",
    ],
    "pt-BR": [
      "Sair de {stage}?",
      "A rota de resgate e ações não salvas em {stage} serão descartadas. Expedições concluídas continuam salvas.",
      "Continuar explorando",
      "Voltar às fases",
    ],
    fr: [
      "Quitter {stage} ?",
      "Le trajet de sauvetage et les actions non enregistrées de {stage} seront perdus. Les expéditions terminées restent enregistrées.",
      "Continuer l’exploration",
      "Retour aux niveaux",
    ],
    de: [
      "{stage} verlassen?",
      "Rettungsroute und ungespeicherte Aktionen in {stage} gehen verloren. Abgeschlossene Expeditionen bleiben gespeichert.",
      "Weiter erkunden",
      "Zurück zu Stufen",
    ],
    it: [
      "Lasciare {stage}?",
      "Il percorso di salvataggio e le azioni non salvate in {stage} andranno persi. Le spedizioni completate restano salvate.",
      "Continua a esplorare",
      "Torna ai livelli",
    ],
    ru: [
      "Покинуть {stage}?",
      "Маршрут спасения и несохранённые действия в {stage} будут сброшены. Завершённые экспедиции останутся сохранены.",
      "Продолжить исследование",
      "К этапам",
    ],
    hi: [
      "{stage} से बाहर जाएँ?",
      "{stage} का बचाव मार्ग और अधूरी कार्रवाइयाँ हट जाएँगी। पूरी की गई यात्राएँ सुरक्षित रहेंगी।",
      "खोज जारी रखें",
      "स्टेज पर लौटें",
    ],
    ar: [
      "مغادرة {stage}؟",
      "سيتم تجاهل مسار الإنقاذ والإجراءات غير المحفوظة في {stage}، وستبقى الرحلات المكتملة محفوظة.",
      "متابعة الاستكشاف",
      "العودة إلى المراحل",
    ],
  });

  const locale = () => {
    const raw =
      document.documentElement.lang ||
      localStorage.getItem("weightPlayLocale") ||
      "en";
    if (/^zh-(tw|hant)/i.test(raw)) return "zh-Hant";
    if (/^zh-(cn|hans)/i.test(raw)) return "zh-Hans";
    if (/^pt/i.test(raw)) return "pt-BR";
    const simple = raw.split("-")[0];
    return Object.prototype.hasOwnProperty.call(COPY, raw)
      ? raw
      : COPY[simple]
        ? simple
        : "en";
  };

  const dialog = document.createElement("section");
  dialog.id = "habitatAtlasLeaveDialog";
  dialog.className = "atlas-leave-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "habitatAtlasLeaveTitle");
  dialog.setAttribute("aria-describedby", "habitatAtlasLeaveCopy");
  dialog.hidden = true;
  dialog.inert = true;
  dialog.innerHTML = `
    <div class="atlas-leave-card">
      <h2 id="habitatAtlasLeaveTitle"></h2>
      <p id="habitatAtlasLeaveCopy"></p>
      <div class="atlas-leave-actions">
        <button id="habitatAtlasContinue" class="primary" type="button"></button>
        <button id="habitatAtlasReturn" type="button"></button>
      </div>
    </div>`;
  battle.append(dialog);

  const continueBtn = dialog.querySelector("#habitatAtlasContinue");
  const returnBtn = dialog.querySelector("#habitatAtlasReturn");
  const title = dialog.querySelector("#habitatAtlasLeaveTitle");
  const copy = dialog.querySelector("#habitatAtlasLeaveCopy");
  const focusables = [continueBtn, returnBtn];
  let open = false;

  // Turn-based deduction has no running clock; inert coverage owns modal suspension.

  function stageName() {
    return (
      stageLabel?.textContent?.trim() ||
      {
        en: "this expedition",
        "zh-Hant": "這次探險",
        "zh-Hans": "这次探险",
        ja: "この探検",
        ko: "이 탐험",
        es: "esta expedición",
        "pt-BR": "esta expedição",
        fr: "cette expédition",
        de: "diese Expedition",
        it: "questa spedizione",
        ru: "эту экспедицию",
        hi: "इस अभियान",
        ar: "هذه الرحلة",
      }[locale()] ||
      "this expedition"
    );
  }

  function applyCopy() {
    const values = COPY[locale()] || COPY.en;
    const currentStage = stageName();
    title.textContent = values[0].replaceAll("{stage}", currentStage);
    copy.textContent = values[1].replaceAll("{stage}", currentStage);
    continueBtn.textContent = values[2];
    returnBtn.textContent = values[3];
  }

  function coveredNodes() {
    return [...battle.children].filter((node) => node !== dialog);
  }

  function setCoveredInert(value) {
    coveredNodes().forEach((node) => {
      node.inert = value;
      if (value) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
  }

  // Result covers gameplay inside the same Battle canvas. Keep the live layer
  // inert while the three Result decisions stay operable.
  function syncResultCoverage() {
    const covered = !result.hidden;
    battle.dataset.wpBattleSubstate = covered ? "result" : "play";
    [
      battle.querySelector('[data-wp-return="battle"]')?.closest("header") ||
        battle.querySelector(".m5-battle-header"),
      document.getElementById("battle-status"),
      document.getElementById("arena"),
      document.getElementById("battle-controls"),
      battle.querySelector(".m5-hint"),
    ]
      .filter(Boolean)
      .forEach((node) => {
        node.inert = covered;
        if (covered) node.setAttribute("aria-hidden", "true");
        else node.removeAttribute("aria-hidden");
      });
  }

  function closeDialog({ restoreFocus = true, resume = true } = {}) {
    if (!open) return;
    open = false;
    dialog.hidden = true;
    dialog.inert = true;
    battle.removeAttribute("data-wp-exit-open");
    setCoveredInert(false);
    syncResultCoverage();
    if (
      restoreFocus &&
      document.body.dataset.screen === "battle" &&
      result.hidden
    ) {
      battleBack.focus({ preventScroll: true });
    }
  }

  function openDialog() {
    if (open || !result.hidden || document.body.dataset.screen !== "battle")
      return;
    applyCopy();
    setCoveredInert(true);
    battle.dataset.wpExitOpen = "true";
    open = true;
    dialog.hidden = false;
    dialog.inert = false;
    continueBtn.focus({ preventScroll: true });
  }

  new MutationObserver(syncResultCoverage).observe(result, {
    attributes: true,
    attributeFilter: ["hidden"],
  });

  battleBack.addEventListener(
    "click",
    (event) => {
      if (document.body.dataset.screen !== "battle" || !result.hidden) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDialog();
    },
    true,
  );

  continueBtn.addEventListener("click", () => closeDialog());

  returnBtn.addEventListener("click", () => {
    if (!open) return;
    closeDialog({ restoreFocus: false, resume: false });
    // Reuse the existing Market Five Stage-return transaction. It owns Stage
    // rendering, analytics, persistence and locale behavior; the capture
    // listener above prevents the old browser-native confirm from running.
    resultToStages.click();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeDialog();
      return;
    }
    if (event.key !== "Tab") return;
    const current = focusables.indexOf(document.activeElement);
    const next = event.shiftKey
      ? current <= 0
        ? focusables.length - 1
        : current - 1
      : current >= focusables.length - 1
        ? 0
        : current + 1;
    event.preventDefault();
    focusables[next].focus({ preventScroll: true });
  });

  window.addEventListener("weightplay:market-locale-change", applyCopy);
  applyCopy();
  syncResultCoverage();
})();
