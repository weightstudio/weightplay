(() => {
  const select = document.querySelector("#locale, #localeSelect");
  let scheduled = false;
  const dictionaries = {
    "zh-Hant": {
      documentTitle: "動物英雄試煉 - 內部測試",
      title: "動物英雄試煉",
      pitch: "帶領爆鬃雷歐通過三個森林房間，每關選擇一項祝福。",
      marks: "試煉印記",
      mastery: "生命精通",
      start: "開始遊戲",
      choose: "選擇試煉",
      blessing: "選擇祝福",
      menu: "主選單",
      language: "語言",
      marksSuffix: " 枚印記",
      stage: (index) => `試煉 ${index + 1}`,
      locked: "先完成前一個試煉",
      stageCopy: (index) => `3 個房間 · +${4 + index} 枚印記`,
      room: (number) => `房間 ${number}/3`,
      roar: "怒吼",
      objective: (count) => `擊敗 ${count} 隻暗影斥候`,
      blessings: [["怒吼威力", "怒吼傷害 +7"], ["彗星節奏", "冷卻時間 -0.5 秒"], ["月光復甦", "恢復 24 點生命"]],
      resultClear: "試煉完成！",
      resultFail: "試煉失敗",
      leoRetry: "雷歐需要重新調整路線。",
      trialMarksSuffix: "枚試煉印記",
      retry: "再試一次",
      nextTrial: "下一個試煉",
    },
    "zh-Hans": {
      documentTitle: "动物英雄试炼 - 内部测试",
      title: "动物英雄试炼",
      pitch: "带领爆鬃雷欧通过三个森林房间，每关选择一项祝福。",
      marks: "试炼印记",
      mastery: "生命精通",
      start: "开始游戏",
      choose: "选择试炼",
      blessing: "选择祝福",
      menu: "主菜单",
      language: "语言",
      marksSuffix: " 枚印记",
      stage: (index) => `试炼 ${index + 1}`,
      locked: "先完成前一个试炼",
      stageCopy: (index) => `3 个房间 · +${4 + index} 枚印记`,
      room: (number) => `房间 ${number}/3`,
      roar: "怒吼",
      objective: (count) => `击败 ${count} 只暗影斥候`,
      blessings: [["怒吼威力", "怒吼伤害 +7"], ["彗星节奏", "冷却时间 -0.5 秒"], ["月光复苏", "恢复 24 点生命"]],
      resultClear: "试炼完成！",
      resultFail: "试炼失败",
      leoRetry: "雷欧需要重新调整路线。",
      trialMarksSuffix: "枚试炼印记",
      retry: "再试一次",
      nextTrial: "下一个试炼",
    },
  };
  const dictionary = () => dictionaries[select?.value] || null;
  const set = (selector, value) => {
    const node = document.querySelector(selector);
    if (node && value != null) node.textContent = value;
  };
  function translateDynamic(activeDictionary) {
    const cooldown = document.querySelector("#cooldownText");
    if (cooldown?.textContent === "ROAR") cooldown.textContent = activeDictionary.roar;
    const room = document.querySelector("#roomText");
    const roomMatch = room?.textContent.match(/^Room\s+(\d+)\/3$/i);
    if (roomMatch) room.textContent = activeDictionary.room(roomMatch[1]);
    const objective = document.querySelector("#objective");
    const objectiveMatch = objective?.textContent.match(/^Defeat\s+(\d+)\s+Shadow Scouts$/i);
    if (objectiveMatch) objective.textContent = activeDictionary.objective(objectiveMatch[1]);
  }
  function translate() {
    scheduled = false;
    if (!select) return;
    document.documentElement.lang = select.value || "en";
    const activeDictionary = dictionary();
    document.title = activeDictionary?.documentTitle || "Animal Hero Trials - Internal Test";
    if (!activeDictionary) return;
    set('[data-t="title"]', activeDictionary.title);
    set('[data-t="pitch"]', activeDictionary.pitch);
    set('[data-t="marks"]', activeDictionary.marks);
    set('[data-t="mastery"]', activeDictionary.mastery);
    set('[data-t="start"]', activeDictionary.start);
    set('[data-t="choose"]', activeDictionary.choose);
    set('[data-t="blessing"]', activeDictionary.blessing);
    set('[data-t="menu"]', activeDictionary.menu);
    set(".locale span", activeDictionary.language);
    const cost = document.querySelector("#masteryCost");
    if (cost) cost.textContent = cost.textContent.replace(/\s*marks$/i, activeDictionary.marksSuffix);
    document.querySelectorAll(".stage-card").forEach((card, index) => {
      const strong = card.querySelector("strong");
      const copy = card.querySelector("span");
      if (strong) strong.textContent = activeDictionary.stage(index);
      if (copy) copy.textContent = card.classList.contains("locked") ? activeDictionary.locked : activeDictionary.stageCopy(index);
    });
    translateDynamic(activeDictionary);
    document.querySelectorAll("#choices .choice").forEach((choice, index) => {
      if (choice.dataset.nativeLocalized === "true") return;
      const [name, copy] = activeDictionary.blessings[index] || [];
      if (!name) return;
      const bold = choice.querySelector("b");
      const small = choice.querySelector("small");
      if (bold) bold.textContent = name;
      if (small) small.textContent = copy;
    });
    const resultTitle = document.querySelector("#resultTitle");
    if (resultTitle?.textContent === "Trial Cleared!") resultTitle.textContent = activeDictionary.resultClear;
    if (resultTitle?.textContent === "Trial Failed") resultTitle.textContent = activeDictionary.resultFail;
    const resultCopy = document.querySelector("#resultCopy");
    if (resultCopy?.textContent === "Leo needs another route.") resultCopy.textContent = activeDictionary.leoRetry;
    if (resultCopy) resultCopy.textContent = resultCopy.textContent.replace(/Trial Marks$/i, activeDictionary.trialMarksSuffix);
    const next = document.querySelector("#resultNext");
    if (next?.textContent === "Try Again") next.textContent = activeDictionary.retry;
    if (next?.textContent === "Next Trial") next.textContent = activeDictionary.nextTrial;
    if (next?.textContent === "Main Menu") next.textContent = activeDictionary.menu;
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(translate);
  }
  select?.addEventListener("change", schedule);
  document.querySelector("#app")?.addEventListener("click", () => setTimeout(schedule, 0));
  const dynamicObserver = new MutationObserver(() => {
    const activeDictionary = dictionary();
    if (activeDictionary) translateDynamic(activeDictionary);
  });
  ["#cooldownText", "#roomText", "#objective", "#resultModal", "#choiceModal"].forEach((selector) => {
    const node = document.querySelector(selector);
    if (node) dynamicObserver.observe(node, { childList: true, subtree: true, characterData: true });
  });
  window.setInterval(schedule, 250);
  schedule();
})();
