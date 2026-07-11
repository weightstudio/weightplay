(() => {
  const common = {
    en: {
      close: "Start Playing",
      closeAria: "Close tutorial",
      aria: "How to play",
      lobbyAria: "Back to lobby",
    },
    "zh-Hant": {
      close: "\u958b\u59cb\u904a\u73a9",
      closeAria: "\u95dc\u9589\u6559\u5b78",
      aria: "\u73a9\u6cd5\u8aaa\u660e",
      lobbyAria: "\u8fd4\u56de\u5927\u5ef3",
    },
  };

  const tutorials = {
    "animal-gearpack-expedition": {
      title: { en: "Build Rux's gearpack.", "zh-Hant": "配置魯克斯的裝備行囊。" },
      steps: [
        { icon: "1", en: ["Choose Gear", "Tap an item in the tray, then tap open backpack cells."], "zh-Hant": ["選擇裝備", "點待放區的裝備，再點行囊中的空格。"] },
        { icon: "2", en: ["Link Materials", "Place matching material tags next to each other for bonuses."], "zh-Hant": ["連結材質", "把相同材質標籤的裝備放在相鄰位置取得加成。"] },
        { icon: "3", en: ["Clear the Route", "Rotate or sell gear, then defeat five encounters."], "zh-Hant": ["完成路線", "旋轉或出售裝備，接著擊敗五場遭遇。"] },
      ],
    },
    "wonder-crash": {
      title: { en: "Protect the wall.", "zh-Hant": "\u5b88\u4f4f\u57ce\u7246\u3002" },
      steps: [
        { icon: "1", en: ["Move", "Tap or drag anywhere to move the hero left and right."], "zh-Hant": ["\u79fb\u52d5", "\u9ede\u6216\u62d6\u66f3\u756b\u9762\u4efb\u4f55\u4f4d\u7f6e\uff0c\u8b93\u4e3b\u89d2\u5de6\u53f3\u79fb\u52d5\u3002"] },
        { icon: "2", en: ["Auto Weapons", "Equipped weapons fire when cooldown is ready."], "zh-Hant": ["\u81ea\u52d5\u6b66\u5668", "\u88dd\u5099\u7684\u6b66\u5668\u51b7\u537b\u5b8c\u6210\u5f8c\u6703\u81ea\u52d5\u653b\u64ca\u3002"] },
        { icon: "3", en: ["Win", "Stop enemies before the wall breaks."], "zh-Hant": ["\u52dd\u5229", "\u5728\u57ce\u7246\u88ab\u7834\u58de\u524d\u64cb\u4f4f\u6575\u4eba\u3002"] },
      ],
    },
    "animal-rescue": {
      title: { en: "Guide animals home.", "zh-Hant": "\u5e36\u52d5\u7269\u56de\u5bb6\u3002" },
      steps: [
        { icon: "1", en: ["Choose Nearby", "Tap a nearby tile to move one step."], "zh-Hant": ["\u9078\u9644\u8fd1", "\u9ede\u9644\u8fd1\u7684\u683c\u5b50\u79fb\u52d5\u4e00\u6b65\u3002"] },
        { icon: "2", en: ["Collect", "Pick up fruit on the way for more stars."], "zh-Hant": ["\u6536\u96c6", "\u8def\u4e0a\u6536\u96c6\u6c34\u679c\uff0c\u53ef\u4ee5\u7372\u5f97\u66f4\u591a\u661f\u661f\u3002"] },
        { icon: "3", en: ["Goal", "Reach the home tile to clear the trail."], "zh-Hant": ["\u76ee\u6a19", "\u5230\u9054\u56de\u5bb6\u683c\u5b50\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "tiny-weather-rescue": {
      title: { en: "Help the animal.", "zh-Hant": "\u5e6b\u52a9\u5c0f\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Look", "See what the animal needs."], "zh-Hant": ["\u89c0\u5bdf", "\u770b\u770b\u5c0f\u52d5\u7269\u73fe\u5728\u9700\u8981\u4ec0\u9ebc\u5e6b\u5fd9\u3002"] },
        { icon: "2", en: ["Help", "Tap or drag the matching care item."], "zh-Hant": ["\u5e6b\u5fd9", "\u9ede\u4e00\u4e0b\u6216\u62d6\u66f3\u6b63\u78ba\u7684\u7167\u9867\u9053\u5177\u3002"] },
        { icon: "3", en: ["Clear", "A happy face means you helped correctly."], "zh-Hant": ["\u5b8c\u6210", "\u770b\u5230\u7b11\u81c9\u5c31\u8868\u793a\u4f60\u5e6b\u5c0d\u4e86\u3002"] },
      ],
    },
    "snack-blocks": {
      title: { en: "Match snacks.", "zh-Hant": "\u6d88\u9664\u52d5\u7269\u96f6\u98df\u3002" },
      steps: [
        { icon: "1", en: ["Swap", "Tap or drag a snack to swap with a neighbor."], "zh-Hant": ["\u4ea4\u63db", "\u9ede\u6216\u62d6\u66f3\u96f6\u98df\uff0c\u548c\u65c1\u908a\u7684\u683c\u5b50\u4ea4\u63db\u3002"] },
        { icon: "2", en: ["Match", "Line up 3 or more of the same snack to clear them."], "zh-Hant": ["\u9023\u7dda", "\u9023\u6210 3 \u500b\u4ee5\u4e0a\u76f8\u540c\u96f6\u98df\u5c31\u80fd\u6d88\u9664\u3002"] },
        { icon: "3", en: ["Goal", "Use your moves, then the stage checks your goal."], "zh-Hant": ["\u76ee\u6a19", "\u7528\u5b8c\u6b65\u6578\u5f8c\uff0c\u95dc\u5361\u6703\u6aa2\u67e5\u662f\u5426\u9054\u6210\u76ee\u6a19\u3002"] },
      ],
    },
    "fruit-merge": {
      title: { en: "Merge bigger animals.", "zh-Hant": "\u5408\u6210\u66f4\u5927\u7684\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Aim", "Move your finger or mouse to choose where the animal drops."], "zh-Hant": ["\u7784\u6e96", "\u79fb\u52d5\u624b\u6307\u6216\u6ed1\u9f20\uff0c\u9078\u64c7\u52d5\u7269\u843d\u4e0b\u7684\u4f4d\u7f6e\u3002"] },
        { icon: "2", en: ["Drop", "Release or tap Drop to let it fall."], "zh-Hant": ["\u843d\u4e0b", "\u653e\u958b\u6216\u9ede\u843d\u4e0b\u6309\u9215\uff0c\u8b93\u52d5\u7269\u6389\u4e0b\u53bb\u3002"] },
        { icon: "3", en: ["Merge", "Two matching animals merge into the next one. Do not pass the line."], "zh-Hant": ["\u5408\u6210", "\u5169\u500b\u76f8\u540c\u52d5\u7269\u6703\u5408\u6210\u4e0b\u4e00\u968e\uff0c\u4e0d\u8981\u8d85\u904e\u7d05\u7dda\u3002"] },
      ],
    },
    "garden-tiles": {
      title: { en: "Relax and match.", "zh-Hant": "\u8f15\u9b06\u914d\u5c0d\u3002" },
      steps: [
        { icon: "1", en: ["Look", "All tiles are open. Find two matching pictures."], "zh-Hant": ["\u89c0\u5bdf", "\u6240\u6709\u724c\u90fd\u662f\u6253\u958b\u7684\uff0c\u627e\u5230\u5169\u5f35\u76f8\u540c\u5716\u7247\u3002"] },
        { icon: "2", en: ["Match", "Tap two matching tiles to remove them."], "zh-Hant": ["\u914d\u5c0d", "\u9ede\u5169\u5f35\u76f8\u540c\u7684\u724c\u5c31\u80fd\u6d88\u9664\u3002"] },
        { icon: "3", en: ["Clear", "Clear every pair to finish. There is no timer."], "zh-Hant": ["\u5b8c\u6210", "\u628a\u6240\u6709\u914d\u5c0d\u6d88\u9664\u5c31\u904e\u95dc\uff0c\u6c92\u6709\u6642\u9593\u9650\u5236\u3002"] },
      ],
    },
    "campus-dash": {
      title: { en: "Dodge in three lanes.", "zh-Hant": "\u4e09\u689d\u8def\u7dda\u9583\u907f\u3002" },
      steps: [
        { icon: "1", en: ["Move", "Swipe or tap left and right lanes to move."], "zh-Hant": ["\u79fb\u52d5", "\u5de6\u53f3\u6ed1\u6216\u9ede\u8def\u7dda\uff0c\u8b93\u89d2\u8272\u79fb\u52d5\u3002"] },
        { icon: "2", en: ["Avoid", "Dodge obstacles and stay on the open lane."], "zh-Hant": ["\u9583\u907f", "\u907f\u958b\u969c\u7919\u7269\uff0c\u4fdd\u6301\u5728\u5b89\u5168\u8def\u7dda\u4e0a\u3002"] },
        { icon: "3", en: ["Score", "Survive longer to beat your best score."], "zh-Hant": ["\u5f97\u5206", "\u6490\u5f97\u8d8a\u4e45\uff0c\u5c31\u80fd\u6311\u6230\u81ea\u5df1\u7684\u6700\u4f73\u6210\u7e3e\u3002"] },
      ],
    },
    "animal-quiz": {
      title: { en: "Answer animal questions.", "zh-Hant": "\u56de\u7b54\u52d5\u7269\u554f\u984c\u3002" },
      steps: [
        { icon: "1", en: ["Question", "Look at the animal picture and question."], "zh-Hant": ["\u984c\u76ee", "\u770b\u52d5\u7269\u5716\u7247\u548c\u554f\u984c\u3002"] },
        { icon: "2", en: ["Answer", "Tap the answer you think is right."], "zh-Hant": ["\u56de\u7b54", "\u9ede\u9078\u4f60\u89ba\u5f97\u6b63\u78ba\u7684\u7b54\u6848\u3002"] },
        { icon: "3", en: ["Stage", "Finish 10 questions to clear a stage."], "zh-Hant": ["\u95dc\u5361", "\u5b8c\u6210 10 \u984c\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "color-lunchbox": {
      title: { en: "Sort food by color.", "zh-Hant": "\u4f9d\u7167\u984f\u8272\u5206\u985e\u98df\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Look", "Check each food color."], "zh-Hant": ["\u89c0\u5bdf", "\u770b\u6e05\u695a\u6bcf\u500b\u98df\u7269\u7684\u984f\u8272\u3002"] },
        { icon: "2", en: ["Drag", "Drag food into the matching lunchbox."], "zh-Hant": ["\u62d6\u66f3", "\u628a\u98df\u7269\u62d6\u5230\u76f8\u540c\u984f\u8272\u7684\u4fbf\u7576\u76d2\u3002"] },
        { icon: "3", en: ["Clear", "Sort everything correctly to finish."], "zh-Hant": ["\u5b8c\u6210", "\u5168\u90e8\u5206\u985e\u6b63\u78ba\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "star-memory": {
      title: { en: "Find matching cards.", "zh-Hant": "\u627e\u51fa\u76f8\u540c\u5361\u7247\u3002" },
      steps: [
        { icon: "1", en: ["Flip", "Tap a card to reveal it."], "zh-Hant": ["\u7ffb\u724c", "\u9ede\u4e00\u5f35\u5361\u7247\u628a\u5716\u7247\u7ffb\u51fa\u4f86\u3002"] },
        { icon: "2", en: ["Match", "Find two cards with the same picture."], "zh-Hant": ["\u914d\u5c0d", "\u627e\u5230\u5169\u5f35\u5716\u7247\u76f8\u540c\u7684\u5361\u7247\u3002"] },
        { icon: "3", en: ["Clear", "Match all pairs with fewer moves for more stars."], "zh-Hant": ["\u5b8c\u6210", "\u7528\u66f4\u5c11\u6b65\u6578\u914d\u5c0d\u6240\u6709\u5361\u7247\uff0c\u53ef\u4ee5\u62ff\u5230\u66f4\u591a\u661f\u661f\u3002"] },
      ],
    },
    "shape-train": {
      title: { en: "Load the shape train.", "zh-Hant": "\u88dd\u4e0a\u5f62\u72c0\u706b\u8eca\u3002" },
      steps: [
        { icon: "1", en: ["Look", "Check the shape the train needs."], "zh-Hant": ["\u89c0\u5bdf", "\u770b\u770b\u706b\u8eca\u9700\u8981\u54ea\u4e00\u500b\u5f62\u72c0\u3002"] },
        { icon: "2", en: ["Choose", "Tap or drag the matching shape."], "zh-Hant": ["\u9078\u64c7", "\u9ede\u6216\u62d6\u66f3\u76f8\u540c\u7684\u5f62\u72c0\u3002"] },
        { icon: "3", en: ["Help", "Finish all shape friends to clear."], "zh-Hant": ["\u5b8c\u6210", "\u5e6b\u6240\u6709\u5f62\u72c0\u670b\u53cb\u4e0a\u8eca\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "bubble-bakery": {
      title: { en: "Fill bakery orders.", "zh-Hant": "\u5b8c\u6210\u6ce1\u6ce1\u8a02\u55ae\u3002" },
      steps: [
        { icon: "1", en: ["Find Groups", "Tap 2 or more matching connected bubbles."], "zh-Hant": ["\u627e\u7fa4\u7d44", "\u9ede 2 \u9846\u4ee5\u4e0a\u76f8\u9023\u7684\u76f8\u540c\u6ce1\u6ce1\u3002"] },
        { icon: "2", en: ["Collect", "Clear the colors shown in the order bar."], "zh-Hant": ["\u6536\u96c6", "\u6d88\u9664\u8a02\u55ae\u5217\u986f\u793a\u7684\u6ce1\u6ce1\u984f\u8272\u3002"] },
        { icon: "3", en: ["Plan", "Use your moves carefully before they run out."], "zh-Hant": ["\u898f\u5283", "\u6b65\u6578\u7528\u5b8c\u524d\uff0c\u8acb\u4ed4\u7d30\u898f\u5283\u6d88\u9664\u9806\u5e8f\u3002"] },
      ],
    },
    "animal-rope-rescue": {
      title: { en: "Bounce fruit to animals.", "zh-Hant": "\u628a\u6c34\u679c\u5f48\u7d66\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Move Leaf", "Drag the leaf trampoline under the falling fruit."], "zh-Hant": ["\u79fb\u52d5\u8449\u5b50", "\u62d6\u66f3\u8449\u5b50\u5f48\u57ab\uff0c\u63a5\u4f4f\u6389\u4e0b\u4f86\u7684\u6c34\u679c\u3002"] },
        { icon: "2", en: ["Cut Vine", "Tap Cut when you are ready to release the fruit."], "zh-Hant": ["\u526a\u85e4\u8513", "\u6e96\u5099\u597d\u6642\u9ede\u526a\u65b7\uff0c\u8b93\u6c34\u679c\u843d\u4e0b\u3002"] },
        { icon: "3", en: ["Feed", "Bounce fruit into the animal basket to clear the stage."], "zh-Hant": ["\u9935\u98df", "\u628a\u6c34\u679c\u5f48\u9032\u52d5\u7269\u7c43\u5b50\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "animal-zoo-idle": {
      title: { en: "Open your safari park.", "zh-Hant": "\u958b\u653e\u4f60\u7684\u8349\u539f\u6a02\u5712\u3002" },
      steps: [
        { icon: "1", en: ["Visitors", "Visitors walk in and leave ticket money in the box."], "zh-Hant": ["\u53c3\u89c0\u8005", "\u53c3\u89c0\u8005\u6703\u8d70\u9032\u4f86\uff0c\u628a\u9580\u7968\u9322\u7559\u5728\u7968\u7bb1\u3002"] },
        { icon: "2", en: ["Care", "Care for animals to raise happiness and attract more visitors."], "zh-Hant": ["\u7167\u9867", "\u7167\u9867\u52d5\u7269\u63d0\u9ad8\u5feb\u6a02\u5ea6\uff0c\u5438\u5f15\u66f4\u591a\u53c3\u89c0\u8005\u3002"] },
        { icon: "3", en: ["Upgrade", "Use coins to upgrade the gate and invite more animals."], "zh-Hant": ["\u5347\u7d1a", "\u7528\u91d1\u5e63\u5347\u7d1a\u5927\u9580\uff0c\u4e26\u9080\u8acb\u66f4\u591a\u52d5\u7269\u3002"] },
      ],
    },
    "zoo-helper-day": {
      title: { en: "Help zoo animals.", "zh-Hant": "\u5e6b\u52a9\u52d5\u7269\u5712\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Need", "Look at what the animal needs."], "zh-Hant": ["\u9700\u8981", "\u770b\u770b\u52d5\u7269\u73fe\u5728\u9700\u8981\u4ec0\u9ebc\u3002"] },
        { icon: "2", en: ["Help", "Choose the matching care item."], "zh-Hant": ["\u5e6b\u5fd9", "\u9078\u64c7\u5c0d\u61c9\u7684\u7167\u9867\u9053\u5177\u3002"] },
        { icon: "3", en: ["Clear", "Help enough animals to finish the stage."], "zh-Hant": ["\u5b8c\u6210", "\u5e6b\u52a9\u8db3\u5920\u7684\u52d5\u7269\u5c31\u80fd\u904e\u95dc\u3002"] },
      ],
    },
    "animal-guard-yard": {
      title: { en: "Guard the yard.", "zh-Hant": "\u5b88\u8b77\u5ead\u9662\u3002" },
      steps: [
        { icon: "1", en: ["Collect Sun", "Tap sun drops to gain energy for animal guards."], "zh-Hant": ["\u6536\u96c6\u967d\u5149", "\u9ede\u967d\u5149\u9053\u5177\uff0c\u7372\u5f97\u653e\u7f6e\u52d5\u7269\u5b88\u885b\u7684\u80fd\u91cf\u3002"] },
        { icon: "2", en: ["Place Guards", "Choose an animal, then tap a grass tile to place it."], "zh-Hant": ["\u653e\u7f6e\u5b88\u885b", "\u9078\u64c7\u52d5\u7269\uff0c\u518d\u9ede\u8349\u5730\u683c\u5b50\u653e\u4e0b\u5b83\u3002"] },
        { icon: "3", en: ["Stop Enemies", "Animals attack enemies in their lanes. Do not let enemies enter the yard."], "zh-Hant": ["\u64cb\u4f4f\u6575\u4eba", "\u52d5\u7269\u6703\u653b\u64ca\u540c\u8def\u7dda\u7684\u6575\u4eba\uff0c\u5225\u8b93\u6575\u4eba\u9032\u5165\u5ead\u9662\u3002"] },
      ],
    },
    "animal-hidden-safari": {
      title: { en: "Find hidden animals.", "zh-Hant": "\u627e\u51fa\u8eb2\u85cf\u7684\u52d5\u7269\u3002" },
      steps: [
        { icon: "1", en: ["Look", "Check the target list below the scene."], "zh-Hant": ["\u89c0\u5bdf", "\u770b\u5834\u666f\u4e0b\u65b9\u7684\u76ee\u6a19\u6e05\u55ae\u3002"] },
        { icon: "2", en: ["Find", "Tap animals or safari clues when you spot them."], "zh-Hant": ["\u5c0b\u627e", "\u767c\u73fe\u52d5\u7269\u6216\u63a2\u96aa\u7dda\u7d22\u6642\u5c31\u9ede\u4e00\u4e0b\u3002"] },
        { icon: "?", en: ["Hint", "Use a hint if one target is hard to see."], "zh-Hant": ["\u63d0\u793a", "\u5982\u679c\u67d0\u500b\u76ee\u6a19\u5f88\u96e3\u627e\uff0c\u53ef\u4ee5\u4f7f\u7528\u63d0\u793a\u3002"] },
      ],
    },
    "animal-reef-fisher": {
      title: { en: "Cast and control tension.", "zh-Hant": "拋竿並控制張力。" },
      steps: [
        { icon: "1", en: ["Cast", "Hold in the reef play area to charge, then release to cast."], "zh-Hant": ["拋竿", "按住礁海畫面蓄力，放開即可拋竿。"] },
        { icon: "2", en: ["Tension", "When a fish is hooked, drag left or right and keep the red marker inside the green safe band."], "zh-Hant": ["張力", "魚上鉤後，左右拖曳紅色標記，讓它留在綠色安全區。"] },
        { icon: "3", en: ["Upgrade", "Use Reef Notes for gear upgrades. Diamonds are optional tools only."], "zh-Hant": ["升級", "用礁石筆記升級裝備；鑽石道具只是選用工具。"] },
      ],
    },
    "animal-auto-squad": {
      title: { en: "Draft and fight.", "zh-Hant": "招募與戰鬥。" },
      steps: [
        { icon: "1", en: ["Draft", "Buy an animal card from the shop using your starting Gold."], "zh-Hant": ["招募", "使用初始金幣從商店購買一隻動物戰士卡牌。"] },
        { icon: "2", en: ["Deploy", "Drag and drop the animal into slot 1 of your active squad."], "zh-Hant": ["派兵", "將動物拖曳並放置到作戰小隊的第一個欄位。"] },
        { icon: "3", en: ["Combine", "Combine three matching animals to level them up and increase stats."], "zh-Hant": ["合成", "收集三隻相同的動物以進行合成升級，大幅強化屬性。"] },
        { icon: "4", en: ["Battle", "Press Start Battle to watch your squad fight automated shadow beast rounds."], "zh-Hant": ["戰鬥", "點擊開始戰鬥，觀看你的小隊在自動戰鬥中擊退影獸。"] }
      ],
    },
  };

  function gameIdFromPath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const index = parts.indexOf("games");
    return index >= 0 ? parts[index + 1] : "";
  }

  function locale() {
    const value = window.WonderI18n?.locale?.() || localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale") || "en";
    return value === "zh-Hant" ? "zh-Hant" : "en";
  }

  function textFor(item) {
    return item[locale()] || item.en;
  }

  function seenKey(gameId) {
    return `weightplay_tutorial_seen_${gameId}_v1`;
  }

  function markSeen(gameId) {
    localStorage.setItem(seenKey(gameId), "1");
  }

  function hasSeen(gameId) {
    return localStorage.getItem(seenKey(gameId)) === "1";
  }

  function isAutomationRun() {
    const params = new URLSearchParams(window.location.search);
    return params.has("smoke") || params.has("qa") || params.has("test");
  }

  function renderTutorial(backdrop, gameId, fromButton = false) {
    const tutorial = tutorials[gameId];
    if (!tutorial || !backdrop) return;
    const lang = locale();
    const labels = common[lang] || common.en;
    backdrop.innerHTML = `
      <section class="wp-tutorial-card">
        <div class="wp-tutorial-head">
          <strong>${tutorial.title[lang] || tutorial.title.en}</strong>
          <button class="wp-tutorial-close" type="button" aria-label="${labels.closeAria}">×</button>
        </div>
        <div class="wp-tutorial-steps">
          ${tutorial.steps
            .map((step) => {
              const [title, body] = textFor(step);
              return `
              <div class="wp-tutorial-step">
                <div class="wp-tutorial-icon">${step.icon}</div>
                <div class="wp-tutorial-copy">
                  <b>${title}</b>
                  <span>${body}</span>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
        <button class="wp-tutorial-action" type="button">${labels.close}</button>
      </section>
    `;
    const close = (startRequested = false) => {
      markSeen(gameId);
      backdrop.remove();
      if (startRequested) {
        window.dispatchEvent(new CustomEvent("weightplay:tutorial-start", { detail: { gameId } }));
      }
      window.WonderAnalytics?.track?.("tutorial_close", { game_id: gameId, from_button: fromButton });
    };
    backdrop.querySelector(".wp-tutorial-close").addEventListener("click", () => close(false));
    backdrop.querySelector(".wp-tutorial-action").addEventListener("click", () => close(true));
  }

  function showTutorial(gameId, fromButton = false) {
    const tutorial = tutorials[gameId];
    if (!tutorial || document.querySelector(".wp-tutorial-backdrop")) return;
    const backdrop = document.createElement("div");
    backdrop.className = "wp-tutorial-backdrop";
    backdrop.dataset.gameId = gameId;
    backdrop.dataset.fromButton = String(fromButton);
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    renderTutorial(backdrop, gameId, fromButton);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) backdrop.querySelector(".wp-tutorial-close")?.click();
    });
    document.body.append(backdrop);
    window.WonderAnalytics?.track?.("tutorial_show", { game_id: gameId, from_button: fromButton });
  }

  function loadingIsDone(startTime) {
    const panel = document.getElementById("loadingPanel");
    if (!panel) return true;
    const style = window.getComputedStyle(panel);
    return panel.classList.contains("hidden") || style.display === "none" || Date.now() - startTime > 4200;
  }

  function scheduleFirstShow(gameId) {
    const startTime = Date.now();
    const id = window.setInterval(() => {
      if (!loadingIsDone(startTime)) return;
      window.clearInterval(id);
      showTutorial(gameId);
    }, 250);
  }

  function applyCommonLabels() {
    const lang = locale();
    const labels = common[lang] || common.en;
    document.querySelectorAll(".home-link").forEach((link) => {
      link.setAttribute("aria-label", labels.lobbyAria);
    });
    document.querySelector(".wp-tutorial-button")?.setAttribute("aria-label", labels.aria);
    const openTutorial = document.querySelector(".wp-tutorial-backdrop");
    if (openTutorial?.dataset.gameId) {
      renderTutorial(openTutorial, openTutorial.dataset.gameId, openTutorial.dataset.fromButton === "true");
    }
  }

  function install() {
    const gameId = gameIdFromPath();
    if (!tutorials[gameId]) return;
    applyCommonLabels();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wp-tutorial-button";
    button.textContent = "?";
    button.addEventListener("click", () => showTutorial(gameId, true));
    document.body.append(button);
    applyCommonLabels();
    window.addEventListener("wonder:locale-change", applyCommonLabels);
    const autoShowEnabled = document.body.dataset.tutorialAutoShow !== "false";
    if (autoShowEnabled && !hasSeen(gameId) && !isAutomationRun()) scheduleFirstShow(gameId);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
