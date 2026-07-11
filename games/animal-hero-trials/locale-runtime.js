(() => {
  const select = document.querySelector("#locale");
  let scheduled = false;
  const zh = () => select?.value === "zh-Hant";
  const set = (selector, value) => {
    const node = document.querySelector(selector);
    if (node && value != null) node.textContent = value;
  };
  function translate() {
    scheduled = false;
    if (!select) return;
    document.documentElement.lang = zh() ? "zh-Hant" : "en";
    document.title = zh() ? "動物英雄試煉 - 內部測試" : "Animal Hero Trials - Internal Test";
    if (!zh()) return;
    set('[data-t="title"]', "動物英雄試煉");
    set('[data-t="pitch"]', "帶領爆鬃雷歐通過三個森林房間，每關選擇一項祝福。");
    set('[data-t="marks"]', "試煉印記");
    set('[data-t="mastery"]', "生命精通");
    set('[data-t="start"]', "開始試煉");
    set('[data-t="choose"]', "選擇試煉");
    set('[data-t="blessing"]', "選擇祝福");
    set('[data-t="menu"]', "主選單");
    set(".locale span", "語言");
    const cost = document.querySelector("#masteryCost");
    if (cost) cost.textContent = cost.textContent.replace(/\s*marks$/i, " 枚印記");
    document.querySelectorAll(".stage-card").forEach((card, index) => {
      const strong = card.querySelector("strong");
      const copy = card.querySelector("span");
      if (strong) strong.textContent = `試煉 ${index + 1}`;
      if (copy) {
        copy.textContent = card.classList.contains("locked")
          ? "先完成前一個試煉"
          : `3 個房間 · +${4 + index} 枚印記`;
      }
    });
    const room = document.querySelector("#roomText");
    if (room) room.textContent = room.textContent.replace(/^Room\s+(\d+)\/3$/i, "房間 $1/3");
    const cooldown = document.querySelector("#cooldownText");
    if (cooldown?.textContent === "ROAR") cooldown.textContent = "怒吼";
    const objective = document.querySelector("#objective");
    if (objective) objective.textContent = objective.textContent.replace(/^Defeat\s+(\d+)\s+Shadow Scouts$/i, "擊敗 $1 隻暗影斥候");
    const blessingCopy = [
      ["怒吼威力", "怒吼傷害 +7"],
      ["彗星節奏", "冷卻時間 -0.5 秒"],
      ["月光復甦", "恢復 24 點生命"],
    ];
    document.querySelectorAll("#choices .choice").forEach((choice, index) => {
      if (choice.dataset.nativeLocalized === "true") return;
      const [name, copy] = blessingCopy[index] || [];
      if (!name) return;
      const bold = choice.querySelector("b");
      const small = choice.querySelector("small");
      if (bold) bold.textContent = name;
      if (small) small.textContent = copy;
    });
    const resultTitle = document.querySelector("#resultTitle");
    if (resultTitle?.textContent === "Trial Cleared!") resultTitle.textContent = "試煉完成！";
    if (resultTitle?.textContent === "Trial Failed") resultTitle.textContent = "試煉失敗";
    const resultCopy = document.querySelector("#resultCopy");
    if (resultCopy?.textContent === "Leo needs another route.") resultCopy.textContent = "雷歐需要重新調整路線。";
    if (resultCopy) resultCopy.textContent = resultCopy.textContent.replace(/Trial Marks$/i, "枚試煉印記");
    const next = document.querySelector("#resultNext");
    if (next?.textContent === "Try Again") next.textContent = "再試一次";
    if (next?.textContent === "Next Trial") next.textContent = "下一個試煉";
    if (next?.textContent === "Main Menu") next.textContent = "主選單";
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(translate);
  }
  select?.addEventListener("change", schedule);
  document.querySelector("#app")?.addEventListener("click", () => setTimeout(schedule, 0));
  const dynamicObserver = new MutationObserver(() => {
    if (!zh()) return;
    const cooldown = document.querySelector("#cooldownText");
    if (cooldown?.textContent === "ROAR") cooldown.textContent = "怒吼";
    const room = document.querySelector("#roomText");
    if (room && /^Room\s+\d+\/3$/i.test(room.textContent)) room.textContent = room.textContent.replace(/^Room\s+(\d+)\/3$/i, "房間 $1/3");
    const objective = document.querySelector("#objective");
    if (objective && /^Defeat/i.test(objective.textContent)) objective.textContent = objective.textContent.replace(/^Defeat\s+(\d+)\s+Shadow Scouts$/i, "擊敗 $1 隻暗影斥候");
  });
  ["#cooldownText", "#roomText", "#objective", "#resultModal", "#choiceModal"].forEach((selector) => {
    const node = document.querySelector(selector);
    if (node) dynamicObserver.observe(node, { childList: true, subtree: true, characterData: true });
  });
  window.setInterval(schedule, 250);
  schedule();
})();
