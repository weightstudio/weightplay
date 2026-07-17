window.WONDER_LOBBY = {
  platform: {
    name: "WeightPlay",
    company: "WeightStudio",
    tagline: {
      en: "Play animal games made for every age.",
      "zh-Hant": "為每個年齡打造的動物遊戲世界。",
    },
    subtitle: {
      en: "A growing animal browser game world for kids, families, and casual players.",
      "zh-Hant": "持續成長的動物瀏覽器遊戲平台，適合孩子、親子與休閒玩家。",
    },
    defaultLocale: "en",
  },
  featuredGameId: "animal-guard-yard",
  heroGameIds: ["animal-guard-yard", "animal-zoo-idle", "bubble-bakery"],
  audiences: {
    generalGameIds: [
      "animal-crystal-survivor", "beast-deck", "animal-relic-hunters", "animal-rune-tactics",
      "animal-orb-fortress", "animal-auto-squad", "beast-tactician", "shadow-wolf",
      "animal-skyport-dispatch", "animal-abyss-diver", "animal-reef-fisher", "animal-hero-trials",
      "animal-gearpack-expedition", "animal-moonlight-heist",
    ],
  },
  games: [
    {
      id: "wonder-crash",
      title: { en: "Fantasy Lion Defense", "zh-Hant": "奇幻獅子防衛" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Animal Defense", "zh-Hant": "動物防守" },
      categories: ["Featured", "Animal Games", "Arcade"],
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      ages: ["5", "family"],
      ageLabel: "5+",
      href: "games/wonder-crash/",
      description: {
        en: "Move Boom Mane Leo across 30 authored defenses with four formations, eight beast roles, and six different Boss attacks.",
        "zh-Hant": "移動爆鬃獅雷歐，挑戰 30 個具名守城關卡、四種編隊、八種野獸角色與六種王攻擊。",
      },
      meta: { en: ["Four Formations", "Six Bosses", "30 Stages"], "zh-Hant": ["四種編隊", "六位王", "30 關"] },
      art: { kind: "image", background: "assets/wonder-crash-cover.webp", hero: "assets/weightplay-character-boom-mane-lion-cutout.webp" },
    },
    {
      id: "color-lunchbox",
      title: { en: "Animal Color Lunchbox", "zh-Hant": "動物顏色便當盒" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Color Match", "zh-Hant": "顏色配對" },
      categories: ["Animal Games", "Education", "Family"],
      skills: ["Color Recognition", "Focus", "Hand-Eye Coordination"],
      ages: ["3", "family"],
      ageLabel: "3+",
      href: "games/color-lunchbox/",
      description: {
        en: "Sort five foods per level across 30 picture-led lunchbox challenges and six friendly Guardian checks.",
        "zh-Hant": "在 30 個圖片便當盒關卡分類食物，並完成六位友善守護員的顏色檢查。",
      },
      meta: { en: ["Picture Match", "30 Levels", "Six Guardians"], "zh-Hant": ["圖片配對", "30 關", "六位守護員"] },
      art: { kind: "image", background: "assets/lunchbox-cover.webp", hero: "assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp" },
    },
    {
      id: "bubble-bakery",
      title: { en: "Animal Bubble Bakery", "zh-Hant": "動物泡泡烘焙坊" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      href: "games/bubble-bakery/",
      type: { en: "Bubble Puzzle", "zh-Hant": "泡泡益智" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Logic", "Problem Solving", "Focus"],
      ages: ["6", "family"],
      ageLabel: { en: "6+", "zh-Hant": "6+" },
      description: {
        en: "Plan connected animal-bubble clears across 30 recipe puzzles, multi-tray orders, and friendly Panko checkpoints.",
        "zh-Hant": "規劃相連動物泡泡的消除順序，完成 30 關食譜、多托盤訂單與友善的 Panko 檢核關。",
      },
      meta: { en: ["30 Stages", "Recipe Rules", "Panko Checks"], "zh-Hant": ["30 關", "食譜規則", "Panko 檢核"] },
      art: { kind: "image", background: "assets/bubble-bakery-cover.webp", hero: "assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp" },
    },
    {
      id: "animal-rope-rescue",
      title: { en: "Animal Vine Rescue", "zh-Hant": "動物藤蔓救援" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      href: "games/animal-rope-rescue/",
      type: { en: "Physics Puzzle", "zh-Hant": "物理益智" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Hand-Eye Coordination", "Problem Solving", "Focus"],
      ages: ["6", "family"],
      ageLabel: { en: "6+", "zh-Hant": "6+" },
      description: {
        en: "Guide fruit through 30 physics rescues with moving baskets, layered winds, double bounces, and Panko checkpoints.",
        "zh-Hant": "引導水果通過 30 關物理救援，挑戰移動籃、分層風、雙重彈跳與 Panko 檢核。",
      },
      meta: { en: ["30 Stages", "Physics Routes", "Panko Checks"], "zh-Hant": ["30 關", "物理路線", "Panko 檢核"] },
      art: { kind: "image", background: "assets/animal-vine-rescue-cover.webp", hero: "assets/weightplay-character-spark-paw-fox-cutout.webp" },
    },
    {
      id: "animal-zoo-idle",
      title: { en: "Animal Zoo Idle", "zh-Hant": "動物小小樂園" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      href: "games/animal-zoo-idle/",
      type: { en: "Idle Zoo", "zh-Hant": "放置動物園" },
      categories: ["Featured", "Animal Games", "Family"],
      skills: ["Logic", "Focus", "Animal Knowledge"],
      ages: ["6", "family"],
      ageLabel: { en: "6+", "zh-Hant": "6+" },
      description: {
        en: "Build a friendly animal park through 30 saved challenges with care choices, habitat arranging, facilities, and six park reviews.",
        "zh-Hant": "完成 30 個有存檔的樂園挑戰，選擇照顧方式、安排棲地、升級設施，並通過六次友善審查。",
      },
      meta: { en: ["30 Challenges", "Park Care", "Six Reviews"], "zh-Hant": ["30 個挑戰", "樂園照顧", "六次審查"] },
      art: { kind: "image", background: "assets/animal-zoo-idle-cover.webp", hero: "assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp" },
    },
    {
      id: "star-memory",
      title: { en: "Animal Star Memory", "zh-Hant": "動物星星翻牌" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      href: "games/star-memory/",
      type: { en: "Memory Puzzle", "zh-Hant": "記憶益智" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Memory", "Focus", "Problem Solving"],
      ages: ["6", "family"],
      ageLabel: "6+",
      description: {
        en: "Repair the Animal Star Map across 30 saved stages with previews, moon shuffles, ordered pairs, and rotating constellations.",
        "zh-Hant": "完成 30 個有存檔的動物星圖關卡，面對預覽、月光洗牌、順序配對與星座移位。",
      },
      meta: { en: ["30 Stages", "Memory Rules", "Six Keeper Checks"], "zh-Hant": ["30 關", "記憶規則", "六次守護者檢查"] },
      art: { kind: "image", background: "assets/memory-cover.webp", hero: "assets/weightplay-character-moon-cap-owl-cutout.webp" },
    },
    {
      id: "campus-dash",
      title: { en: "Safari Dash", "zh-Hant": "草原閃電跑" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      href: "games/campus-dash/",
      type: { en: "Reaction Runner", "zh-Hant": "反應跑酷" },
      categories: ["Animal Games", "Arcade"],
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      ages: ["9"],
      ageLabel: "9+",
      description: {
        en: "Clear 30 saved safari routes with star trails, two-lane gates, sticky mud, five objective types, and six Guardian Checks.",
        "zh-Hant": "左右切換跑道，閃避草原障礙並挑戰高分。",
      },
      meta: { en: ["Safari", "Score Attack", "60 Sec"], "zh-Hant": ["草原跑酷", "分數挑戰", "60 秒"] },
      art: { kind: "image", background: "assets/campus-dash-cover.webp", hero: "assets/weightplay-character-spark-paw-fox-cutout.webp" },
    },
    {
      id: "snack-blocks",
      title: { en: "Animal Snack Blocks", "zh-Hant": "動物零食方塊" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      href: "games/snack-blocks/",
      type: { en: "Match Puzzle", "zh-Hant": "消除益智" },
      categories: ["Featured", "Animal Games", "Puzzle", "Family"],
      skills: ["Logic", "Problem Solving", "Focus"],
      ages: ["9", "family"],
      ageLabel: "9+",
      description: {
        en: "Match animal snacks, use every move, clear collection goals, and chase your best score.",
        "zh-Hant": "消除動物零食方塊，用有限步數完成收集目標並挑戰最佳分數。",
      },
      meta: { en: ["30 Stages", "Six Goal Families", "Six Checkpoints"], "zh-Hant": ["30 關", "六種目標", "六個檢查關"] },
      art: { kind: "image", background: "assets/snack-blocks-cover.webp", hero: "assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp" },
    },
    {
      id: "fruit-merge",
      title: { en: "Animal Merge Tower", "zh-Hant": "動物合成塔" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      href: "games/fruit-merge/",
      type: { en: "Score Puzzle", "zh-Hant": "分數益智" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Logic", "Problem Solving", "Hand-Eye Coordination"],
      ages: ["6", "family"],
      ageLabel: { en: "6+", "zh-Hant": "6+" },
      description: {
        en: "Clear 30 saved physics challenges with narrow aim windows, river wind, heavy gravity, fixed queues, and six Festival Checkpoints.",
        "zh-Hant": "落下動物球並合成相同動物，一路挑戰到獅王球與最佳分數。",
      },
      meta: { en: ["30 Challenges", "Five Physics Rules", "Six Checkpoints"], "zh-Hant": ["30 個挑戰", "五種物理規則", "六個檢查關"] },
      art: { kind: "image", background: "assets/fruit-merge-cover.webp", hero: "assets/weightplay-character-moss-shell-turtle-cutout.webp" },
    },
    {
      id: "garden-tiles",
      title: { en: "Pet Garden Tiles", "zh-Hant": "寵物花園方塊" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      href: "games/garden-tiles/",
      type: { en: "Relaxing Match", "zh-Hant": "放鬆配對" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Memory", "Focus", "Problem Solving"],
      ages: ["6", "family"],
      ageLabel: { en: "Family", "zh-Hant": "親子" },
      description: {
        en: "Clear 30 no-timer memory challenges with previews, mist, moving cards, and six Garden Checkpoints.",
        "zh-Hant": "完成 30 個無倒數的記憶挑戰，應對預覽、薄霧、移動卡牌與 6 個花園檢查點。",
      },
      meta: { en: ["30 Challenges", "Four Memory Rules", "No Timer"], "zh-Hant": ["30 個挑戰", "4 種記憶規則", "無倒數"] },
      art: { kind: "image", background: "assets/garden-tiles-cover.webp", hero: "assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp" },
    },
    {
      id: "animal-rescue",
      title: { en: "Animal Rescue Trail", "zh-Hant": "動物回家路" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Animal Puzzle", "zh-Hant": "動物益智" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Logic", "Problem Solving", "Animal Knowledge"],
      ages: ["6", "family"],
      ageLabel: { en: "Family", "zh-Hant": "親子" },
      href: "games/animal-rescue/",
      description: {
        en: "Guide animals through 30 routes with fruit, mud, keys, gates, fragile paths, and six Rescue Checkpoints.",
        "zh-Hant": "引導動物完成 30 條路線，應對水果、黏泥、鑰匙門、脆弱小路與 6 個救援檢查點。",
      },
      meta: { en: ["30 Trails", "Four Route Rules", "No Timer"], "zh-Hant": ["30 條路線", "4 種路線規則", "無倒數"] },
      art: { kind: "image", background: "assets/animal-rescue-cover.webp", hero: "assets/weightplay-character-boom-mane-lion-cutout.webp" },
    },
    {
      id: "animal-hidden-safari",
      title: { en: "Animal Hidden Safari", "zh-Hant": "動物探險找找看" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Hidden Object", "zh-Hant": "找找看" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Focus", "Animal Knowledge", "Problem Solving"],
      ages: ["3", "family"],
      ageLabel: { en: "3+", "zh-Hant": "3+" },
      href: "games/animal-hidden-safari/",
      description: {
        en: "Search 30 habitats with ordered targets, animal pairs, camouflage, visitors, moving patrols, and six checkpoints.",
        "zh-Hant": "搜尋 30 個棲地，應對指定順序、動物雙雙、偽裝、訪客、移動巡遊與六個檢查點。",
      },
      meta: { en: ["30 Habitats", "Six Search Rules", "No Timer Failure"], "zh-Hant": ["30 個棲地", "6 種搜尋規則", "無倒數失敗"] },
      art: { kind: "image", background: "assets/animal-hidden-safari-cover.webp", hero: "assets/weightplay-character-moon-cap-owl-cutout.webp" },
    },
    {
      id: "animal-guard-yard",
      title: { en: "Animal Guard Yard", "zh-Hant": "動物守衛庭院" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Lane Defense", "zh-Hant": "路線防守" },
      categories: ["Featured", "Animal Games", "Arcade", "Family"],
      skills: ["Logic", "Focus", "Problem Solving"],
      ages: ["6", "family"],
      ageLabel: { en: "6+", "zh-Hant": "6+" },
      href: "games/animal-guard-yard/",
      description: {
        en: "Defend 30 garden stages with animal guards, readable special beasts, saved training, and six distinct Boss encounters.",
        "zh-Hant": "配置動物守衛，挑戰 30 個花園關卡、可判斷的特殊野獸與六場獨立首領戰。",
      },
      meta: { en: ["Hero Defense", "Animal Upgrades", "Boss Battles"], "zh-Hant": ["英雄防守", "動物升級", "Boss 戰"] },
      art: { kind: "image", background: "assets/animal-guard-yard-poster.webp", hero: "assets/weightplay-character-moss-shell-turtle-cutout.webp" },
    },
    {
      id: "animal-crystal-survivor",
      title: { en: "Animal Crystal Survivor", "zh-Hant": "動物水晶生存戰" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Action Survival", "zh-Hant": "動作生存" },
      categories: ["Featured", "Animal Games", "Arcade"],
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      href: "games/animal-crystal-survivor/",
      description: {
        en: "Patrol 30 three-minute Crystal Grove routes, collect each stage's keys, choose upgrades, read changing hazards, and defeat six original animal Bosses.",
        "zh-Hant": "巡邏 30 條三分鐘水晶林地路線，完成各關金鑰目標、選擇升級、判讀變化危險，並擊敗六隻原創動物首領。",
      },
      meta: {
        en: ["30 Stages", "6 Bosses", "Auto Combat"],
        "zh-Hant": ["30 關", "6 隻首領", "自動戰鬥"],
      },
      art: {
        kind: "image",
        background: "assets/animal-crystal-survivor-cover.webp",
        hero: "assets/weightplay-character-spark-paw-fox-cutout.webp",
      },
    },
    {
      id: "animal-quiz",
      title: { en: "Animal Quiz", "zh-Hant": "動物小博士" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Animal Knowledge Quiz", "zh-Hant": "動物知識問答" },
      categories: ["Animal Games", "Education", "Family"],
      skills: ["Animal Knowledge", "Memory", "Reading"],
      ages: ["3", "6", "family"],
      ageLabel: { en: "6+", "zh-Hant": "6+" },
      href: "games/animal-quiz/",
      description: {
        en: "Solve 30 animal investigations with picture, habitat, feature, behavior, food, mystery-image, and silhouette clues.",
        "zh-Hant": "完成 30 個動物觀察任務，從圖片、棲地、外觀、行為、食物、神祕圖片與剪影線索找出答案。",
      },
      meta: { en: ["30 Stages", "6 Chapters", "Animal Facts"], "zh-Hant": ["30 關", "6 章節", "動物知識"] },
      art: { kind: "image", background: "assets/quiz-cover.webp", hero: "assets/weightplay-character-moon-cap-owl-cutout.webp" },
    },
    {
      id: "zoo-helper-day",
      title: { en: "Zoo Helper Day", "zh-Hant": "動物園幫忙日" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Zoo Workday Sim", "zh-Hant": "動物園工作日" },
      categories: ["Animal Games", "Education", "Family"],
      skills: ["Animal Knowledge", "Focus", "Hand-Eye Coordination"],
      ages: ["3", "6", "family"],
      ageLabel: { en: "3+", "zh-Hant": "3+" },
      href: "games/zoo-helper-day/",
      description: {
        en: "Complete 30 gentle zoo shifts with picture tools, care categories, memory requests, and ordered routines.",
        "zh-Hant": "完成 30 個溫和動物園班次，練習圖片道具、照顧分類、記住需求與順序照顧。",
      },
      meta: { en: ["30 Shifts", "6 Keeper Checks", "Picture Care"], "zh-Hant": ["30 關", "6 次檢核", "圖片照顧"] },
      art: { kind: "image", background: "assets/zoo-helper-day-cover.webp", hero: "assets/weightplay-character-gear-horn-rhino-cutout.webp" },
    },
    {
      id: "shape-train",
      title: { en: "Animal Shape Train", "zh-Hant": "動物形狀小火車" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Shape Puzzle", "zh-Hant": "形狀益智" },
      categories: ["Animal Games", "Education", "Puzzle", "Family"],
      skills: ["Color Recognition", "Logic", "Hand-Eye Coordination"],
      ages: ["3", "family"],
      ageLabel: { en: "3+", "zh-Hant": "3+" },
      href: "games/shape-train/",
      description: {
        en: "Board six shape friends across 30 routes with outline, moving, memory, and Boarding Pass rules.",
        "zh-Hant": "讓六種形狀朋友完成 30 條路線，挑戰輪廓、移動、記憶與驗票規則。",
      },
      meta: { en: ["30 Routes", "6 Checks", "Shape Memory"], "zh-Hant": ["30 路線", "6 次檢查", "形狀記憶"] },
      art: { kind: "image", background: "assets/shape-train-cover.webp", hero: "assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp" },
    },
    {
      id: "tiny-weather-rescue",
      title: { en: "Animal Helper Quest", "zh-Hant": "動物幫幫隊" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Tool Choice Puzzle", "zh-Hant": "道具選擇解謎" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Problem Solving", "Animal Knowledge", "Focus"],
      ages: ["6", "family"],
      ageLabel: { en: "6+", "zh-Hant": "6+" },
      href: "games/tiny-weather-rescue/",
      description: {
        en: "Solve 30 animal-help missions with picture tools, paired clues, memory needs, and changing trays.",
        "zh-Hant": "完成 30 個動物幫忙任務，挑戰圖片道具、雙線索、記憶需求與換位工具。",
      },
      meta: { en: ["30 Missions", "6 Helper Checks", "Scene Clues"], "zh-Hant": ["30 任務", "6 次幫手檢查", "情境線索"] },
      art: { kind: "image", background: "assets/tiny-weather-rescue-cover.webp", hero: "assets/weightplay-character-gear-horn-rhino-cutout.webp" },
    },
    {
      id: "beast-deck",
      title: { en: "Beast Deck: The Mist Forest", "zh-Hant": "獸王牌組：迷霧森林" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Roguelike Deckbuilder", "zh-Hant": "Roguelike 牌組構築" },
      categories: ["Featured", "Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Problem Solving", "Focus"],
      href: "games/beast-deck/",
      description: {
        en: "Build animal-power decks across 30 missions, counter ten regional mechanics, and defeat six phase-changing forest Bosses.",
        "zh-Hant": "用動物能力牌挑戰 30 個任務、破解十種區域機制，並擊敗六隻會換階段的森林首領。"
      },
      meta: { en: ["30 Missions", "Card Combos", "Six Bosses"], "zh-Hant": ["30 個任務", "卡牌連動", "六隻首領"] },
      art: { kind: "image", background: "assets/beast-deck-cover.webp", hero: "assets/weightplay-character-moon-cap-owl-cutout.webp" },
    },
    {
      id: "animal-relic-hunters",
      title: { en: "Animal Relic Hunters", "zh-Hant": "動物遺跡獵人" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Room Action Roguelite", "zh-Hant": "房間動作 Roguelite" },
      categories: ["Featured", "Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Problem Solving", "Focus"],
      href: "games/animal-relic-hunters/",
      description: {
        en: "Clear 30 three-room expeditions, master ten special threat behaviors, collect relic gear, and defeat six phase-changing Guardians.",
        "zh-Hant": "完成 30 個三房遠征，掌握十種特殊威脅、收集遺物裝備，並擊敗六位會轉換階段的守護者。"
      },
      meta: { en: ["30 Expeditions", "Ten Threat Rules", "Six Guardians"], "zh-Hant": ["30 個遠征", "十種威脅規則", "六位守護者"] },
      art: { kind: "image", background: "assets/animal-relic-hunters-cover.png", hero: "assets/weightplay-character-boom-mane-lion-cutout.webp" },
    },
    {
      id: "animal-rune-tactics",
      title: { en: "Animal Rune Tactics", "zh-Hant": "動物符文戰棋" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Turn-Based Squad Tactics", "zh-Hant": "回合制小隊戰棋" },
      categories: ["Featured", "Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Problem Solving", "Focus"],
      href: "games/animal-rune-tactics/",
      description: {
        en: "Command three animal heroes through 30 rune-grid missions with seven terrain rules, special enemies, permanent growth, and six phased Bosses.",
        "zh-Hant": "指揮三名動物英雄完成 30 個符文戰棋任務，破解七種地形、特殊敵人、永久成長與六位階段首領。"
      },
      meta: { en: ["30 Missions", "Seven Terrain Rules", "Six Bosses"], "zh-Hant": ["30 個任務", "七種地形規則", "六位首領"] },
      art: { kind: "image", background: "assets/animal-rune-tactics-cover.webp", hero: "assets/weightplay-character-moon-cap-owl-cutout.webp" },
    },
    {
      id: "animal-orb-fortress",
      title: { en: "Animal Orb Fortress", "zh-Hant": "\u52d5\u7269\u661f\u73e0\u8981\u585e" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "\u53ef\u904a\u73a9" },
      type: { en: "Ricochet Roguelite", "zh-Hant": "\u53cd\u5f48 Roguelite" },
      categories: ["Featured", "Animal Games", "Arcade"],
      skills: ["Logic", "Problem Solving", "Focus"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-orb-fortress/",
      description: {
        en: "Aim animal orbs through crystal fortress rooms, plan bounce routes, grow your base, and prepare for boss waves.",
        "zh-Hant": "\u7784\u6e96\u52d5\u7269\u661f\u73e0\u7a7f\u8d8a\u6c34\u6676\u8981\u585e\u623f\u9593\uff0c\u898f\u5283\u53cd\u5f48\u8def\u7dda\uff0c\u5347\u7d1a\u57fa\u5730\uff0c\u4e26\u6e96\u5099\u8fce\u6230 Boss \u6ce2\u6b21\u3002",
      },
      meta: { en: ["Orb Bounces", "Fortress Growth", "Boss Waves"], "zh-Hant": ["\u661f\u73e0\u53cd\u5f48", "\u8981\u585e\u6210\u9577", "Boss \u6ce2\u6b21"] },
      art: { kind: "image", background: "assets/animal-orb-fortress-cover.webp", hero: "assets/weightplay-character-moss-shell-turtle-cutout.webp" },
    },
    {
      id: "animal-auto-squad",
      title: { en: "Animal Auto Squad", "zh-Hant": "動物自走小隊" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Auto-Battler", "zh-Hant": "自走棋策略" },
      categories: ["Featured", "Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Problem Solving", "Focus"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-auto-squad/",
      description: {
        en: "Train and position ten animal heroes across 30 five-wave stages, six regions, and six unique boss battles.",
        "zh-Hant": "訓練並配置十名動物英雄，穿越六個區域、30 個五波關卡與六場專屬 Boss 戰。"
      },
      meta: { en: ["Formation Strategy", "30 Stages", "Six Bosses"], "zh-Hant": ["編成策略", "30 關", "六名 Boss"] },
      art: { kind: "image", background: "assets/animal-auto-squad-cover.webp", hero: "assets/weightplay-character-gear-horn-rhino-cutout.webp" },
    },
    {
      id: "beast-tactician",
      title: { en: "Beast Guardian", "zh-Hant": "獸王守衛" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Hero Tower Defense", "zh-Hant": "英雄塔防" },
      categories: ["Featured", "Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Problem Solving", "Focus"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/beast-tactician/",
      description: {
        en: "Shape enemy routes and command animal soldiers and WeightPlay heroes through 30 stages, six regions, and six distinct Boss battles.",
        "zh-Hant": "改造敵人路線，指揮動物士兵與 WeightPlay 英雄，挑戰六區 30 關與六場不同規則的 Boss 戰。"
      },
      meta: { en: ["Tower Defense", "30 Stages", "Six Bosses"], "zh-Hant": ["塔防", "30 關", "六名 Boss"] },
      art: { kind: "image", background: "assets/beast-tactician-cover.webp", hero: "assets/weightplay-character-moss-shell-turtle-cutout.webp" },
    },
    {
      id: "shadow-wolf",
      title: { en: "Shadow Wolf Legend", "zh-Hant": "影狼傳說" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "2D Action Platformer RPG", "zh-Hant": "2D 動作平台 RPG" },
      categories: ["Featured", "Animal Games"],
      skills: ["Logic", "Problem Solving", "Focus"],
      href: "games/shadow-wolf/",
      description: {
        en: "Master 30 platform-action stages, counter special shadow beasts, shape four attributes, and defeat six distinct regional Bosses.",
        "zh-Hant": "挑戰 30 關平台動作戰役、反制特殊影獸、配置四種屬性，並擊敗六名不同區域首領。"
      },
      meta: { en: ["30 Stages", "Special Enemies", "Six Bosses"], "zh-Hant": ["30 關", "特殊敵人", "六名首領"] },
      art: { kind: "image", background: "assets/shadow-wolf-cover.webp", hero: "assets/weightplay-character-spark-paw-fox-cutout.webp" },
    },
    {
      id: "animal-skyport-dispatch",
      title: { en: "Animal Skyport Dispatch", "zh-Hant": "\u52d5\u7269\u5929\u7a7a\u6e2f\u8abf\u5ea6\u968a" },
      status: "planned",
      statusText: { en: "Coming Soon", "zh-Hant": "\u656c\u8acb\u671f\u5f85" },
      type: { en: "Route Management Strategy", "zh-Hant": "\u822a\u7dda\u8abf\u5ea6\u7b56\u7565" },
      categories: ["Animal Games", "Strategy"],
      skills: ["Logic", "Focus", "Problem Solving"],
      ages: ["13"],
      ageLabel: "13+",
      href: "games/animal-skyport-dispatch/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Route animal airships to the right docks, manage storms and crew, and keep Cloudline Skyport moving.",
        "zh-Hant": "\u8abf\u5ea6\u52d5\u7269\u98db\u8239\u9032\u5165\u6b63\u78ba\u78bc\u982d\uff0c\u8655\u7406\u66b4\u98a8\u3001\u7d44\u54e1\u8207\u58c5\u585e\u3002"
      },
      meta: { en: ["Route Planning", "Five Shifts", "Skyport Growth"], "zh-Hant": ["\u822a\u7dda\u898f\u5283", "\u4e94\u500b\u73ed\u6b21", "\u5929\u7a7a\u6e2f\u6210\u9577"] },
      art: { kind: "image", background: "assets/animal-skyport-dispatch-cover.webp", hero: "assets/animal-skyport-dispatch-orla.webp" },
    },
    {
      id: "animal-abyss-diver",
      title: { en: "Animal Abyss Diver", "zh-Hant": "動物深淵潛行隊" },
      status: "planned",
      statusText: { en: "Coming Soon", "zh-Hant": "敬請期待" },
      type: { en: "Route Risk Adventure", "zh-Hant": "深海路線冒險" },
      categories: ["Animal Games", "Strategy", "Adventure"],
      skills: ["Logic", "Focus", "Problem Solving"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-abyss-diver/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Choose a dive route, manage oxygen, recover deep-sea relics, and surface before the risk becomes too great.",
        "zh-Hant": "選擇潛水路線、管理氧氣、帶回深海遺物，並在風險過高前安全上浮。",
      },
      meta: { en: ["Route Choices", "Oxygen Risk", "Relic Recovery"], "zh-Hant": ["路線選擇", "氧氣風險", "遺物回收"] },
      art: { kind: "image", background: "assets/animal-abyss-diver-cover.webp", hideHero: true },
    },
    {
      id: "animal-bubble-safari",
      title: { en: "Animal Bubble Safari", "zh-Hant": "動物泡泡探險" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Aim-and-Shoot Bubble Puzzle", "zh-Hant": "瞄準泡泡解謎" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Focus", "Logic", "Hand-Eye Coordination"],
      ages: ["6", "family"],
      ageLabel: { en: "6+", "zh-Hant": "6+" },
      href: "games/animal-bubble-safari/",
      description: {
        en: "Aim through 30 rescue levels with reactive blockers, wind, moving rows, and four power bubbles.",
        "zh-Hant": "挑戰 30 個救援關卡，運用反應式障礙、風、移動列與四種力量泡泡。",
      },
      meta: { en: ["30 Levels", "6 Safari Checks", "Bank & Power Shots"], "zh-Hant": ["30 關", "6 次草原檢查", "反彈與力量泡泡"] },
      art: { kind: "image", background: "assets/animal-bubble-safari-cover.webp", hideHero: true },
    },
    {
      id: "animal-coloring-studio",
      title: { en: "Animal Coloring Studio", "zh-Hant": "動物著色工作室" },
      status: "planned",
      statusText: { en: "Coming Soon", "zh-Hant": "敬請期待" },
      type: { en: "Creative Coloring", "zh-Hant": "創意動物著色" },
      categories: ["Animal Games", "Education", "Family"],
      skills: ["Color Recognition", "Focus", "Hand-Eye Coordination"],
      ages: ["3", "family"],
      ageLabel: { en: "3+", "zh-Hant": "3+" },
      href: "games/animal-coloring-studio/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Choose an animal page, fill or brush bounded regions, and save finished art to a local gallery.",
        "zh-Hant": "挑選動物圖頁，用填色或畫筆完成清楚區域，並把作品保存在本機畫廊。",
      },
      meta: { en: ["Animal Pages", "Color Tools", "Local Gallery"], "zh-Hant": ["動物圖頁", "著色工具", "本機畫廊"] },
      art: { kind: "image", background: "assets/animal-coloring-studio-cover.webp", hideHero: true },
    },
    {
      id: "animal-habitat-mahjong",
      title: { en: "Animal Habitat Mahjong", "zh-Hant": "動物棲地麻將消消" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Mahjong Solitaire Puzzle", "zh-Hant": "麻將牌配對解謎" },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Logic", "Focus", "Problem Solving"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+" },
      href: "games/animal-habitat-mahjong/",
      description: {
        en: "Clear 30 layered animal-tile boards with trail seals, family rescues, alternating patrol routes, and six Habitat Finales.",
        "zh-Hant": "挑戰 30 個立體動物牌局，解開路徑封印、救援家族、跟隨交替巡守路徑並完成六個棲地終局。",
      },
      meta: { en: ["30 Boards", "Trail Seals", "Family Rescue"], "zh-Hant": ["30 關", "路徑封印", "家族救援"] },
      art: { kind: "image", background: "assets/animal-habitat-mahjong-cover.webp", hideHero: true },
    },
    {
      id: "animal-word-trails",
      title: { en: "Animal Word Trails", "zh-Hant": "動物字詞小徑" },
      status: "planned",
      statusText: { en: "Coming Soon", "zh-Hant": "敬請期待" },
      type: { en: "Reading Word-Path Puzzle", "zh-Hant": "閱讀字詞路徑" },
      categories: ["Animal Games", "Education", "Puzzle"],
      skills: ["Reading", "Focus", "Logic"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+" },
      href: "games/animal-word-trails/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Follow animal clues, connect adjacent letters or characters, and complete bilingual word trails.",
        "zh-Hant": "跟著動物線索連接相鄰字母或文字，完成英語與繁體中文的字詞小徑。",
      },
      meta: { en: ["Bilingual Words", "Path Logic", "Animal Clues"], "zh-Hant": ["雙語字詞", "路徑邏輯", "動物線索"] },
      art: { kind: "image", background: "assets/animal-word-trails-cover.webp", hideHero: true },
    },
  ],
};

for (const game of window.WONDER_LOBBY.games) {
  if (game.id === "beast-deck") {
    game.title["zh-Hant"] = "獸王牌組：迷霧森林";
    game.statusText["zh-Hant"] = "可遊玩";
    game.type["zh-Hant"] = "Roguelike 牌組構築";
    game.description["zh-Hant"] = "用動物能力牌挑戰 30 個任務、破解十種區域機制，並擊敗六隻會換階段的森林首領。";
    game.meta["zh-Hant"] = ["30 個任務", "卡牌連動", "六隻首領"];
  }

  if (game.id === "animal-relic-hunters") {
    game.title["zh-Hant"] = "動物遺跡獵人";
    game.statusText["zh-Hant"] = "可遊玩";
    game.type["zh-Hant"] = "房間動作 Roguelike";
    game.description["zh-Hant"] = "探索古代遺跡房間，收集遺跡能量球，開啟寶箱並穿戴強力裝備，最終擊敗 Boss。";
    game.meta["zh-Hant"] = ["動作 Roguelike", "3 個房間", "裝備欄位"];
    game.art.background = "assets/animal-relic-hunters-cover.webp";
  }
}

window.WONDER_LOBBY.games.push({
  id: "animal-reef-fisher",
  title: { en: "Animal Reef Fisher", "zh-Hant": "動物珊瑚釣手" },
  status: "playable",
  statusText: { en: "Playable", "zh-Hant": "可遊玩" },
  type: { en: "Fishing Collection Sim", "zh-Hant": "釣魚收集模擬" },
  categories: ["Featured", "Animal Games", "Arcade"],
  skills: ["Focus", "Reaction", "Problem Solving"],
  ages: ["13"],
  ageLabel: { en: "13+", "zh-Hant": "13+" },
  href: "games/animal-reef-fisher/",
  description: {
    en: "Run reef expeditions with an otter fishing team, time casts, manage line tension, fill a sea-creature album, and upgrade gear locally.",
    "zh-Hant": "帶領水獺釣魚隊進行礁區遠征，掌握拋竿時機與魚線張力，收集海洋生物圖鑑，並在本機升級裝備。",
  },
  meta: {
    en: ["Reef Fishing", "Album Progress", "Gear Upgrades"],
    "zh-Hant": ["珊瑚礁釣魚", "圖鑑進度", "裝備升級"],
  },
  art: {
    kind: "image",
    background: "assets/animal-reef-fisher-cover.webp",
    hero: "assets/weightplay-character-bubble-fin-otter-cutout.webp",
  },
});

window.WONDER_LOBBY.games.push({
  id: "animal-cafe-rush",
  title: { en: "Animal Cafe Rush", "zh-Hant": "\u52d5\u7269\u5496\u5561\u5feb\u624b" },
  status: "playable",
  statusText: { en: "Play Now", "zh-Hant": "\u7acb\u5373\u904a\u73a9" },
  type: { en: "Animal Cafe Time Management", "zh-Hant": "\u52d5\u7269\u5496\u5561\u6642\u9593\u7ba1\u7406" },
  categories: ["Animal Games", "Family"],
  skills: ["Focus", "Reaction", "Problem Solving"],
  ages: ["6", "family"],
  ageLabel: { en: "6+", "zh-Hant": "6+" },
  href: "games/animal-cafe-rush/",
  description: {
    en: "Run 30 cafe days with picture orders, numbered recipes, VIP priority, alternating tables, and six Cafe Reviews.",
    "zh-Hant": "\u7d93\u71df 30 \u500b\u5496\u5561\u9928\u71df\u696d\u65e5\uff0c\u6311\u6230\u5716\u50cf\u8a02\u55ae\u3001\u6578\u5b57\u98df\u8b5c\u3001VIP \u512a\u5148\u3001\u96d9\u684c\u8f2a\u66ff\u8207\u516d\u6b21\u5be9\u67e5\u3002",
  },
  meta: {
    en: ["30 Cafe Days", "Six Rule Chapters", "Saved Upgrades"],
    "zh-Hant": ["30 \u500b\u71df\u696d\u65e5", "\u516d\u7ae0\u898f\u5247", "\u5b58\u6a94\u5347\u7d1a"],
  },
  art: { kind: "image", background: "assets/animal-cafe-rush-cover.webp", hideHero: true },
});

window.WONDER_LOBBY.games.push({
  id: "animal-hero-trials",
  title: { en: "Animal Hero Trials", "zh-Hant": "動物英雄試煉" },
  status: "playable",
  statusText: { en: "Play Now", "zh-Hant": "立即遊玩" },
  type: { en: "Hero Action Roguelite", "zh-Hant": "英雄動作試煉" },
  categories: ["Featured", "Animal Games", "Arcade"],
  skills: ["Reaction", "Focus", "Problem Solving"],
  ages: ["13"],
  ageLabel: { en: "13+", "zh-Hant": "13+" },
  href: "games/animal-hero-trials/",
  description: {
    en: "Choose one of four WeightPlay heroes, clear three forest rooms, collect blessings, and defeat the Shadow Sovereign.",
    "zh-Hant": "選擇四位 WeightPlay 英雄之一，通過三個森林房間、收集祝福並擊敗暗影王者。",
  },
  meta: {
    en: ["Four Heroes", "Trial Blessings", "Saved Mastery"],
    "zh-Hant": ["四位英雄", "試煉祝福", "永久精通"],
  },
  art: { kind: "image", background: "assets/animal-hero-trials-cover.webp", hideHero: true },
});

window.WONDER_LOBBY.games.push({
  id: "animal-gearpack-expedition",
  title: { en: "Animal Gearpack Expedition", "zh-Hant": "動物裝備行囊遠征" },
  status: "playable",
  statusText: { en: "Playable", "zh-Hant": "可遊玩" },
  type: { en: "Spatial Inventory Roguelite", "zh-Hant": "空間行囊策略遠征" },
  categories: ["Featured", "Animal Games"],
  skills: ["Logic", "Problem Solving", "Focus"],
  href: "games/animal-gearpack-expedition/",
  description: {
    en: "Arrange Rux's 11 x 7 equipment pack, counter special enemies, and clear 30 stages with six distinct Guardians.",
    "zh-Hant": "替魯克斯排列 11×7 裝備行囊，反制特殊敵人，完成 30 關與六位不同首領。",
  },
  meta: { en: ["30 Expeditions", "Pack Synergies", "Six Guardians"], "zh-Hant": ["30 關遠征", "行囊連鎖", "六位首領"] },
  art: { kind: "image", background: "assets/animal-gearpack-expedition-cover.webp", hideHero: true },
});

window.WONDER_LOBBY.games.push({
  id: "animal-moonlight-heist",
  title: { en: "Animal Moonlight Heist", "zh-Hant": "動物月影潛行隊" },
  status: "playable",
  statusText: { en: "Playable", "zh-Hant": "可遊玩" },
  type: { en: "Stealth Extraction Adventure", "zh-Hant": "潛行撤離冒險" },
  categories: ["Featured", "Animal Games", "Arcade"],
  skills: ["Logic", "Focus", "Problem Solving"],
  ages: ["13"],
  ageLabel: { en: "13+", "zh-Hant": "13+" },
  href: "games/animal-moonlight-heist/",
  description: {
    en: "Guide Spark Paw Fia through moonlit patrol routes, recover lost relics, and decide whether to risk optional treasure before extraction.",
    "zh-Hant": "帶領星爪菲亞穿越月光巡邏路線、找回失落文物，並決定是否冒險取得額外寶藏再撤離。",
  },
  meta: { en: ["Five Missions", "Stealth Gadgets", "Safehouse Growth"], "zh-Hant": ["五個任務", "潛行技能", "安全屋成長"] },
  art: { kind: "image", background: "assets/animal-moonlight-heist-cover.webp", hideHero: true },
});

const cleanZhLobbyCopy = {
  "beast-deck": {
    title: "獸王牌組：迷霧森林",
    statusText: "可遊玩",
    type: "Roguelike 牌組戰鬥",
    description: "用動物能力牌挑戰 30 個任務、破解十種區域機制，並擊敗六隻會換階段的森林首領。",
    meta: ["30 個任務", "卡牌連動", "六隻首領"],
  },
  "animal-relic-hunters": {
    title: "動物遺跡獵人",
    statusText: "可遊玩",
    type: "房間制動作 Roguelike",
    description: "完成 30 個三房遠征，掌握十種特殊威脅、收集遺物裝備，並擊敗六位會轉換階段的守護者。",
    meta: ["30 個遠征", "十種威脅規則", "六位守護者"],
  },
  "animal-auto-squad": {
    title: "動物自走小隊",
    statusText: "可遊玩",
    type: "自走棋策略",
    description: "訓練並配置十名動物英雄，穿越六個區域、30 個五波關卡與六場專屬 Boss 戰。",
    meta: ["編成策略", "30 關", "六名 Boss"],
  },
  "beast-tactician": {
    title: "獸王守衛",
    statusText: "可遊玩",
    type: "英雄塔防",
    description: "改造敵人路線，指揮動物士兵與 WeightPlay 英雄，挑戰六區 30 關與六場不同規則的 Boss 戰。",
    meta: ["塔防", "30 關", "六名 Boss"],
  },
  "shadow-wolf": {
    title: "影狼傳說",
    statusText: "可遊玩",
    type: "2D 動作平台 RPG",
    description: "挑戰 30 關平台動作戰役、反制特殊影獸、配置四種屬性，並擊敗六名不同區域首領。",
    meta: ["30 關", "特殊敵人", "六名首領"],
  },
  "animal-reef-fisher": {
    title: "動物珊瑚釣手",
    statusText: "可遊玩",
    type: "釣魚收集模擬",
    description: "帶著海獺釣手前往珊瑚礁遠征，控制拋竿與魚線張力，收集海洋生物並升級裝備。",
    meta: ["珊瑚釣魚", "圖鑑收集", "裝備升級"],
  },
};

for (const game of window.WONDER_LOBBY.games) {
  const clean = cleanZhLobbyCopy[game.id];
  if (!clean) continue;
  game.title["zh-Hant"] = clean.title;
  game.statusText["zh-Hant"] = clean.statusText;
  game.type["zh-Hant"] = clean.type;
  game.description["zh-Hant"] = clean.description;
  game.meta["zh-Hant"] = clean.meta;
}

const beastGuardianPublicCopy = {
  title: "獸王守衛",
  statusText: "可遊玩",
  type: "英雄塔防",
  description: "改造敵人路線，指揮動物士兵與 WeightPlay 英雄，挑戰六區 30 關與六場不同規則的 Boss 戰。",
  meta: ["塔防", "30 關", "六名 Boss"],
};
const beastGuardian = window.WONDER_LOBBY.games.find((game) => game.id === "beast-tactician");
if (beastGuardian) {
  beastGuardian.status = "playable";
  beastGuardian.title["zh-Hant"] = beastGuardianPublicCopy.title;
  beastGuardian.statusText["zh-Hant"] = beastGuardianPublicCopy.statusText;
  beastGuardian.type["zh-Hant"] = beastGuardianPublicCopy.type;
  beastGuardian.description["zh-Hant"] = beastGuardianPublicCopy.description;
  beastGuardian.meta["zh-Hant"] = beastGuardianPublicCopy.meta;
  delete beastGuardian.internalTrial;
}

const verifiedPublicLobbyCopy = {
  "animal-gearpack-expedition": {
    title: "\u52d5\u7269\u88dd\u5099\u884c\u56ca\u9060\u5f81",
    statusText: "\u53ef\u904a\u73a9",
    type: "\u7a7a\u9593\u884c\u56ca\u7b56\u7565\u9060\u5f81",
    description: "\u66ff\u9b6f\u514b\u65af\u6392\u5217 11\u00d77 \u88dd\u5099\u884c\u56ca\uff0c\u53cd\u5236\u7279\u6b8a\u6575\u4eba\uff0c\u5b8c\u6210 30 \u95dc\u8207\u516d\u4f4d\u4e0d\u540c\u9996\u9818\u3002",
    meta: ["30 \u95dc\u9060\u5f81", "\u884c\u56ca\u9023\u9396", "\u516d\u4f4d\u9996\u9818"],
  },
  "shadow-wolf": {
    title: "\u5f71\u72fc\u50b3\u8aaa",
    statusText: "\u53ef\u904a\u73a9",
    type: "\u6a6b\u5411\u52d5\u4f5c RPG",
    description: "\u64cd\u4f5c\u5f71\u72fc\u5967\u5c3c\u8def\u904e\u77f3\u9053\u3001\u8e8d\u904e\u9677\u9631\u3001\u6536\u96c6\u88dd\u5099\uff0c\u4e26\u6311\u6230\u5de8\u7378\u738b\u95dc\u3002",
    meta: ["\u52d5\u4f5c RPG", "\u8df3\u8e8d\u885d\u523a", "\u88dd\u5099\u6210\u9577"],
  },
};

for (const game of window.WONDER_LOBBY.games) {
  const clean = verifiedPublicLobbyCopy[game.id];
  if (!clean) continue;
  game.status = "playable";
  game.title["zh-Hant"] = clean.title;
  game.statusText["zh-Hant"] = clean.statusText;
  game.type["zh-Hant"] = clean.type;
  game.description["zh-Hant"] = clean.description;
  game.meta["zh-Hant"] = clean.meta;
  delete game.internalTrial;
}

const animalHeroTrialsPublicCopy = window.WONDER_LOBBY.games.find((game) => game.id === "animal-hero-trials");
if (animalHeroTrialsPublicCopy) {
  animalHeroTrialsPublicCopy.title = { en:"Animal Hero Trials", "zh-Hant":"動物英雄試煉" };
  animalHeroTrialsPublicCopy.statusText = { en:"Play Now", "zh-Hant":"立即遊玩" };
  animalHeroTrialsPublicCopy.type = { en:"Hero Action Roguelite", "zh-Hant":"英雄動作 Roguelite" };
  animalHeroTrialsPublicCopy.description = { en:"Choose one of four heroes for 30 three-room trials with five enemy families, saved mastery, and six distinct Bosses.", "zh-Hant":"選擇四位英雄之一，挑戰 30 個三房間試煉、五種敵人、永久精通與六個不同 Boss。" };
  animalHeroTrialsPublicCopy.meta = { en:["30 Trials","Six Boss Counters","Saved Mastery"], "zh-Hant":["30 個試煉","六種 Boss 反制","存檔精通"] };
  delete animalHeroTrialsPublicCopy.ages;
  delete animalHeroTrialsPublicCopy.ageLabel;
}

const animalReefFisher = window.WONDER_LOBBY.games.find((game) => game.id === "animal-reef-fisher");
if (animalReefFisher) {
  delete animalReefFisher.ageLabel;
  animalReefFisher.title["zh-Hant"] = "\u52d5\u7269\u73ca\u745a\u91e3\u624b";
  animalReefFisher.statusText["zh-Hant"] = "\u7acb\u5373\u904a\u73a9";
  animalReefFisher.type.en = "Fishing Tension Campaign";
  animalReefFisher.type["zh-Hant"] = "\u91e3\u9b5a\u5f35\u529b\u4efb\u52d9";
  animalReefFisher.description.en = "Clear 30 reef missions with six changing sea conditions, document 12 species, upgrade six tools, and land six Guardian fish.";
  animalReefFisher.description["zh-Hant"] = "\u6311\u6230 30 \u500b\u7901\u5340\u4efb\u52d9\u8207\u516d\u7a2e\u6d77\u6cc1\uff0c\u8a18\u9304 12 \u7a2e\u751f\u7269\u3001\u5347\u7d1a\u516d\u7a2e\u88dd\u5099\uff0c\u4e26\u91e3\u8d77\u516d\u96bb\u5b88\u8b77\u9b5a\u3002";
  animalReefFisher.meta.en = ["30 Missions", "Six Sea Rules", "Six Guardians"];
  animalReefFisher.meta["zh-Hant"] = ["30 \u500b\u4efb\u52d9", "\u516d\u7a2e\u6d77\u6cc1", "\u516d\u96bb\u5b88\u8b77\u9b5a"];
}

const orbFortress = window.WONDER_LOBBY.games.find((game) => game.id === "animal-orb-fortress");
if (orbFortress) {
  delete orbFortress.ageLabel;
  orbFortress.description.en = "Plan wall and mirror-pylon bank shots through 30 routes, counter five special enemy rules, and defeat six unique fortress Bosses.";
  orbFortress.description["zh-Hant"] = "規劃牆面與鏡柱反彈，挑戰 30 關、五種特殊敵人規則與六名獨特要塞 Boss。";
  orbFortress.meta.en = ["30 Routes", "Mirror Pylons", "Six Bosses"];
  orbFortress.meta["zh-Hant"] = ["30 關", "鏡面柱", "六名 Boss"];
}

const shadowWolfPublicCopy = {
  title: "\u5f71\u72fc\u50b3\u8aaa",
  statusText: "\u53ef\u904a\u73a9",
  type: "\u6a6b\u5411\u52d5\u4f5c RPG",
  description: "\u64cd\u4f5c\u5f71\u72fc\u5967\u5c3c\u8def\u904e\u77f3\u9053\u3001\u8e8d\u904e\u9677\u9631\u3001\u6536\u96c6\u88dd\u5099\uff0c\u4e26\u6311\u6230\u5de8\u7378\u738b\u95dc\u3002",
  meta: ["\u52d5\u4f5c RPG", "\u8df3\u8e8d\u885d\u523a", "\u88dd\u5099\u6210\u9577"],
};
const shadowWolf = window.WONDER_LOBBY.games.find((game) => game.id === "shadow-wolf");
if (shadowWolf) {
  shadowWolf.status = "playable";
  shadowWolf.title["zh-Hant"] = shadowWolfPublicCopy.title;
  shadowWolf.statusText["zh-Hant"] = shadowWolfPublicCopy.statusText;
  shadowWolf.type["zh-Hant"] = shadowWolfPublicCopy.type;
  shadowWolf.description["zh-Hant"] = shadowWolfPublicCopy.description;
  shadowWolf.meta["zh-Hant"] = shadowWolfPublicCopy.meta;
  delete shadowWolf.internalTrial;
}

const verifiedCleanZhLobbyCopy = {
  "fruit-merge": {
    title: "動物合成塔",
    statusText: "可遊玩",
    type: "物理合成挑戰",
    description: "挑戰 30 個可存檔物理關卡，運用窄窗、河風、重力、固定隊列與六個祭典檢查關完成合成目標。",
    meta: ["30 個挑戰", "五種物理規則", "六個檢查關"],
  },
  "snack-blocks": {
    title: "動物零食方塊",
    statusText: "可遊玩",
    type: "三消關卡益智",
    description: "規劃 30 個可存檔關卡，挑戰分數、收集、雙零食、連鎖、大消除與六個雙目標檢查關。",
    meta: ["30 關", "六種目標", "六個檢查關"],
  },
  "campus-dash": {
    title: "\u8349\u539f\u9583\u96fb\u8dd1",
    statusText: "\u53ef\u904a\u73a9",
    type: "\u8def\u7dda\u9583\u907f\u8dd1\u9177",
    description: "\u6311\u6230 30 \u689d\u53ef\u5b58\u6a94\u8349\u539f\u8def\u7dda\uff0c\u904b\u7528\u661f\u661f\u8ecc\u8de1\u3001\u96d9\u8def\u969c\u7919\u9580\u3001\u9ecf\u6ed1\u6ce5\u6f25\u3001\u4e94\u7a2e\u76ee\u6a19\u8207\u516d\u5834\u5b88\u8b77\u8005\u6aa2\u67e5\u3002",
    meta: ["30 \u689d\u8def\u7dda", "\u4e94\u7a2e\u898f\u5247", "\u516d\u5834\u5b88\u8b77\u8005\u6aa2\u67e5"],
  },
  "beast-deck": {
    title: "獸王牌組：迷霧森林",
    statusText: "可遊玩",
    type: "Roguelike 牌組構築",
    description: "用動物能力牌挑戰 30 個任務、破解十種區域機制，並擊敗六隻會換階段的森林首領。",
    meta: ["30 個任務", "卡牌連動", "六隻首領"],
  },
  "animal-relic-hunters": {
    title: "動物遺跡獵人",
    statusText: "可遊玩",
    type: "房間動作 Roguelike",
    description: "探索古代遺跡房間，收集遺跡能量球，開啟寶箱並穿戴強力裝備，最終擊敗 Boss。",
    meta: ["動作 Roguelike", "3 個房間", "裝備系統"],
  },
  "animal-auto-squad": {
    title: "動物自走小隊",
    statusText: "可遊玩",
    type: "自走棋策略",
    description: "訓練並配置十名動物英雄，穿越六個區域、30 個五波關卡與六場專屬 Boss 戰。",
    meta: ["編成策略", "30 關", "六名 Boss"],
  },
  "beast-tactician": {
    title: "獸王守衛",
    statusText: "可遊玩",
    type: "英雄塔防",
    description: "改造敵人路線，指揮動物士兵與 WeightPlay 英雄，挑戰六區 30 關與六場不同規則的 Boss 戰。",
    meta: ["塔防", "30 關", "六名 Boss"],
  },
  "shadow-wolf": {
    title: "影狼傳說",
    statusText: "敬請期待",
    type: "2D 動作平台 RPG",
    description: "奔跑、跳躍、衝刺並斬擊影獸。累積經驗、開啟裝備寶箱，最後擊敗巨獸首領。",
    meta: ["2D 橫向卷軸", "跳躍操作", "裝備養成"],
  },
  "animal-reef-fisher": {
    title: "動物珊瑚釣手",
    statusText: "可遊玩",
    type: "釣魚收集模擬",
    description: "帶領水獺釣魚隊進行礁區遠征，掌握拋竿時機與魚線張力，收集海洋生物圖鑑，並在本機升級裝備。",
    meta: ["珊瑚礁釣魚", "圖鑑進度", "裝備升級"],
  },
};

for (const game of window.WONDER_LOBBY.games) {
  const clean = verifiedCleanZhLobbyCopy[game.id];
  if (!clean) continue;
  game.title["zh-Hant"] = clean.title;
  game.statusText["zh-Hant"] = clean.statusText;
  game.type["zh-Hant"] = clean.type;
  game.description["zh-Hant"] = clean.description;
  game.meta["zh-Hant"] = clean.meta;
}

const campusDash = window.WONDER_LOBBY.games.find((game) => game.id === "campus-dash");
if (campusDash) {
  campusDash.description.en = "Clear 30 saved safari routes with star trails, two-lane gates, sticky mud, five objective types, and six Guardian Checks.";
  campusDash.meta.en = ["30 Routes", "Five Rule Families", "Six Guardian Checks"];
}

const snackBlocks = window.WONDER_LOBBY.games.find((game) => game.id === "snack-blocks");
if (snackBlocks) {
  snackBlocks.description.en = "Plan 30 saved stages with score, collection, pair, cascade, big-match, and dual checkpoint goals.";
  snackBlocks.meta.en = ["30 Stages", "Six Goal Families", "Six Checkpoints"];
}

const moonlightHeist = window.WONDER_LOBBY.games.find((game) => game.id === "animal-moonlight-heist");
if (moonlightHeist) {
  delete moonlightHeist.ageLabel;
  moonlightHeist.title["zh-Hant"] = "動物月影潛行隊";
  moonlightHeist.statusText["zh-Hant"] = "可遊玩";
  moonlightHeist.type["zh-Hant"] = "潛行路線冒險";
  moonlightHeist.description.en = "Plan routes across 30 Moon Archive missions, master shadow, mirror, clockwork, bell, seal, and spotlight rules, then outwit six guardians.";
  moonlightHeist.description["zh-Hant"] = "規劃 30 個月光檔案任務，掌握陰影、鏡面、發條、月鐘、封印與探照規則，並通過六位守衛。";
  moonlightHeist.meta.en = ["30 Missions", "Six Stealth Rules", "Six Guardians"];
  moonlightHeist.meta["zh-Hant"] = ["30 個任務", "六種潛行規則", "六位守衛"];
}

if (beastGuardian) {
  beastGuardian.status = "playable";
  beastGuardian.title["zh-Hant"] = beastGuardianPublicCopy.title;
  beastGuardian.statusText["zh-Hant"] = beastGuardianPublicCopy.statusText;
  beastGuardian.type["zh-Hant"] = beastGuardianPublicCopy.type;
  beastGuardian.description["zh-Hant"] = beastGuardianPublicCopy.description;
  beastGuardian.meta["zh-Hant"] = beastGuardianPublicCopy.meta;
  delete beastGuardian.internalTrial;
}

for (const game of window.WONDER_LOBBY.games) {
  const clean = verifiedPublicLobbyCopy[game.id];
  if (!clean) continue;
  game.status = "playable";
  game.title["zh-Hant"] = clean.title;
  game.statusText["zh-Hant"] = clean.statusText;
  game.type["zh-Hant"] = clean.type;
  game.description["zh-Hant"] = clean.description;
  game.meta["zh-Hant"] = clean.meta;
  delete game.internalTrial;
}
