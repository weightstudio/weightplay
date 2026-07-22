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
      "animal-starlight-trails",
      "animal-one-line",
      "animal-2048",
      "animal-frontier-dominion",
      "animal-sanctuary-loop",
      "animal-prism-battalion",
      "animal-skybridge-rivals",
      "animal-skyspire-drop",
      "animal-cloudrail-roll",
      "animal-rift-salvage",
      "animal-spectrum-pulse",
      "animal-rootvault-pins",
      "animal-sketchwheel-rally",
      "animal-rune-reels",
      "animal-cratebound",
      "animal-mosaic-clues",
      "animal-prism-breakers",
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
      id: "animal-2048",
      previewVideo: "assets/previews/animal-2048-battle.webm",
      title: { en: "Animal 2048: Forest Evolution", "zh-Hant": "動物 2048：森林進化" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "立即遊玩" },
      href: "games/animal-2048/",
      type: { en: "Grid Merge Strategy", "zh-Hant": "格子合併策略" },
      categories: ["Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Problem Solving", "Focus"],
      description: {
        en: "Slide a 4×4 forest grid, merge matching animals, and clear 30 saved evolution missions with stones, score goals, and move limits.",
        "zh-Hant": "滑動 4×4 森林棋盤、合併相同動物，挑戰石塊、分數與步數限制組成的 30 個進化任務。",
      },
      meta: { en: ["30 Missions", "Grid Strategy", "Forest Evolution"], "zh-Hant": ["30 個任務", "格子策略", "森林進化"] },
      art: { kind: "image", background: "assets/animal-2048-cover.webp", hero: "assets/weightplay-character-moon-cap-owl-cutout.webp" },
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
      previewVideo: "assets/previews/animal-crystal-survivor-battle.webm",
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
      previewVideo: "assets/previews/beast-deck-battle.webm",
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
      previewVideo: "assets/previews/animal-relic-hunters-battle.webm",
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
      previewVideo: "assets/previews/animal-rune-tactics-battle.webm",
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
      previewVideo: "assets/previews/animal-orb-fortress-battle.webm",
      title: { en: "Animal Orb Fortress", "zh-Hant": "\u52d5\u7269\u661f\u73e0\u8981\u585e" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "\u53ef\u904a\u73a9" },
      type: { en: "Ricochet Roguelite", "zh-Hant": "\u53cd\u5f48 Roguelite" },
      categories: ["Featured", "Animal Games", "Arcade"],
      skills: ["Logic", "Problem Solving", "Focus"],
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
      previewVideo: "assets/previews/animal-auto-squad-battle.webm",
      title: { en: "Animal Auto Squad", "zh-Hant": "動物自走小隊" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Auto-Battler", "zh-Hant": "自走棋策略" },
      categories: ["Featured", "Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Problem Solving", "Focus"],
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
      previewVideo: "assets/previews/beast-tactician-battle.webm",
      title: { en: "Beast Guardian", "zh-Hant": "獸王守衛" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Hero Tower Defense", "zh-Hant": "英雄塔防" },
      categories: ["Featured", "Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Problem Solving", "Focus"],
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
      previewVideo: "assets/previews/shadow-wolf-battle.webm",
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
      id: "animal-block-grove",
      title: {
        en: "Animal Block Grove",
        "zh-Hant": "動物方塊森林",
        "zh-Hans": "动物方块森林",
        es: "Bosque de Bloques Animales",
        ja: "どうぶつブロックの森",
        ko: "동물 블록 숲",
        "pt-BR": "Bosque de Blocos Animais",
        de: "Tierischer Blöcke-Wald",
      },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "立即遊玩", "zh-Hans": "立即游玩", es: "Jugar", ja: "今すぐ遊ぶ", ko: "지금 플레이", "pt-BR": "Jogar", de: "Jetzt spielen" },
      type: {
        en: "Block Placement Puzzle", "zh-Hant": "方塊配置益智", "zh-Hans": "方块放置益智",
        es: "Puzle de colocación de bloques", ja: "ブロック配置パズル", ko: "블록 배치 퍼즐",
        "pt-BR": "Quebra-cabeça de blocos", de: "Blocklege-Puzzle",
      },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Logic", "Problem Solving", "Focus"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+", "zh-Hans": "9+", es: "9+", ja: "9+", ko: "9+", "pt-BR": "9+", de: "9+" },
      href: "games/animal-block-grove/",
      description: {
        en: "Place three animal block groups, clear complete rows and columns, and restore 30 forest habitats or continue in Infinite Grove.",
        "zh-Hant": "配置三組動物方塊、消除完整橫列與直行，修復 30 座森林棲地，或挑戰無限森林。",
        "zh-Hans": "放置三组动物方块、消除完整横排与直列，修复 30 座森林栖息地，或挑战无限森林。",
        es: "Coloca tres grupos de bloques animales, completa filas y columnas y restaura 30 hábitats o juega en el Bosque Infinito.",
        ja: "3組のどうぶつブロックを置き、行と列をそろえて、30の森の生息地を修復。無限モードにも挑戦できます。",
        ko: "동물 블록 세 묶음을 배치해 행과 열을 완성하고 30개의 숲 서식지를 복원하거나 무한 숲에 도전하세요.",
        "pt-BR": "Posicione três grupos de blocos animais, complete linhas e colunas e restaure 30 habitats ou jogue no Bosque Infinito.",
        de: "Platziere drei Tierblock-Gruppen, vervollständige Reihen und Spalten und stelle 30 Waldlebensräume wieder her oder spiele im Endloswald.",
      },
      meta: {
        en: ["30 Missions", "8×8 Board", "Infinite Grove"], "zh-Hant": ["30 個任務", "8×8 棋盤", "無限森林"],
        "zh-Hans": ["30 个任务", "8×8 棋盘", "无限森林"], es: ["30 misiones", "Tablero 8×8", "Bosque infinito"],
        ja: ["30ミッション", "8×8ボード", "無限の森"], ko: ["30개 임무", "8×8 보드", "무한 숲"],
        "pt-BR": ["30 missões", "Tabuleiro 8×8", "Bosque infinito"], de: ["30 Missionen", "8×8-Brett", "Endloswald"],
      },
      art: { kind: "image", background: "assets/animal-block-grove-cover.webp", hideHero: true },
    },
    {
      id: "animal-color-springs",
      title: {
        en: "Animal Color Springs", "zh-Hant": "動物彩泉分類", "zh-Hans": "动物彩泉分类",
        es: "Manantiales de Colores Animales", ja: "どうぶつ彩りの泉", ko: "동물 색깔 샘",
        "pt-BR": "Fontes Coloridas dos Animais", de: "Tierische Farbenquellen",
      },
      status: "playable",
      statusText: {
        en: "Playable", "zh-Hant": "可遊玩", "zh-Hans": "可游玩", es: "Jugable",
        ja: "プレイ可能", ko: "플레이 가능", "pt-BR": "Jogável", de: "Spielbar",
      },
      type: {
        en: "Color Sorting Puzzle", "zh-Hant": "彩珠分類益智", "zh-Hans": "彩珠分类益智",
        es: "Puzle de clasificación por colores", ja: "色分けパズル", ko: "색상 분류 퍼즐",
        "pt-BR": "Quebra-cabeça de separar cores", de: "Farbsortier-Puzzle",
      },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Logic", "Problem Solving", "Focus"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+", "zh-Hans": "9+", es: "9+", ja: "9+", ko: "9+", "pt-BR": "9+", de: "9+" },
      href: "games/animal-color-springs/",
      description: {
        en: "Move matching spring orbs between ornate vessels and restore 30 forest fountains with seals, changing capacities, and tighter routes.",
        "zh-Hant": "在泉器間移動同色彩珠，破解封印、容量變化與緊湊路線，修復 30 座森林彩泉。",
        "zh-Hans": "在泉器之间移动同色彩珠，破解封印、容量变化与紧凑路线，修复 30 座森林彩泉。",
        es: "Mueve orbes del mismo color entre recipientes y restaura 30 fuentes con sellos, capacidades variables y rutas más ajustadas.",
        ja: "同じ色の泉珠を器の間で移し、封印や容量の変化を解きながら30の森の泉を修復します。",
        ko: "같은 색 샘 구슬을 용기 사이로 옮기고 봉인과 용량 변화, 까다로운 경로를 풀어 30개의 숲 샘을 복원하세요.",
        "pt-BR": "Mova orbes da mesma cor entre recipientes e restaure 30 fontes com selos, capacidades variáveis e rotas mais apertadas.",
        de: "Verschiebe gleichfarbige Quellkugeln zwischen Gefäßen und repariere 30 Waldquellen mit Siegeln, wechselnden Kapazitäten und knappen Zugfolgen.",
      },
      meta: {
        en: ["30 Stages", "Sealed Vessels", "Variable Capacity"], "zh-Hant": ["30 關", "封印泉器", "容量變化"],
        "zh-Hans": ["30 关", "封印泉器", "容量变化"], es: ["30 niveles", "Recipientes sellados", "Capacidad variable"],
        ja: ["30ステージ", "封印された器", "容量変化"], ko: ["30개 스테이지", "봉인된 용기", "용량 변화"],
        "pt-BR": ["30 fases", "Recipientes selados", "Capacidade variável"], de: ["30 Stufen", "Versiegelte Gefäße", "Variable Kapazität"],
      },
      art: { kind: "image", background: "games/animal-color-springs/assets/animal-color-springs-cover.webp", hideHero: true },
    },
    {
      id: "animal-rune-reels",
      title: {
        en: "Animal Rune Reels", "zh-Hant": "動物符文轉輪", "zh-Hans": "动物符文转轮",
        ja: "アニマル・ルーンリール", ko: "애니멀 룬 릴", es: "Rodillos Rúnicos Animales",
        "pt-BR": "Carretéis Rúnicos Animais", fr: "Rouleaux Runiques Animaux",
        de: "Tierische Runenwalzen", it: "Rulli Runici Animali", ru: "Звериные рунические барабаны",
        hi: "एनिमल रून रील्स", ar: "بكرات الرون الحيوانية",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정",
        es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt disponible", de: "Demnächst",
        it: "Prossimamente", ru: "Скоро", hi: "जल्द आ रहा है", ar: "قريبًا",
      },
      type: {
        en: "Tactical Reel Combat", "zh-Hant": "戰術轉輪戰鬥", "zh-Hans": "战术转轮战斗", ja: "戦術リールバトル",
        ko: "전술 릴 전투", es: "Combate táctico de rodillos", "pt-BR": "Combate tático de carretéis",
        fr: "Combat tactique à rouleaux", de: "Taktischer Walzenkampf", it: "Combattimento tattico a rulli",
        ru: "Тактический бой на барабанах", hi: "रणनीतिक रील युद्ध", ar: "قتال بكرات تكتيكي",
      },
      categories: ["Animal Games", "Strategy", "Arcade"],
      skills: ["Planning", "Focus", "Risk Assessment"],
      ages: ["13"],
      ageLabel: "13+",
      href: "games/animal-rune-reels/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Watch three reel strips stop in sequence: lions multiply attack, turtles multiply defense, rabbit gems heal, and dormant stones are blank while one to three monsters fight back across 30 battles.",
        "zh-Hant": "觀看三條轉輪依序停下：獅子提升攻擊、烏龜提升防禦、兔子寶石補血、沉睡符文石空轉，並在 30 場戰鬥中迎戰一至三隻怪物。",
        "zh-Hans": "观看三条转轮依次停下：狮子提升攻击、乌龟提升防御、兔子宝石回血、沉睡符文石空转，并在 30 场战斗中迎战一至三只怪物。",
        ja: "3本のリールが順に停止。ライオンは攻撃、カメは防御、ウサギ宝石は回復、眠り石は空白となり、30戦で1～3体の敵と戦います。",
        ko: "세 릴이 차례로 멈춥니다. 사자는 공격, 거북은 방어, 토끼 보석은 치유, 룬석은 빈 결과가 되며 30개 전투에서 적 1~3마리와 싸웁니다.",
        es: "Mira tres rodillos detenerse en secuencia: leones multiplican el ataque, tortugas la defensa, gemas de conejo curan y piedras son neutras ante uno a tres monstruos en 30 batallas.",
        "pt-BR": "Veja três carretéis pararem em sequência: leões multiplicam ataque, tartarugas a defesa, gemas de coelho curam e pedras são neutras contra um a três monstros em 30 batalhas.",
        fr: "Regardez trois rouleaux s’arrêter en séquence : lions pour l’attaque, tortues pour la défense, gemmes lapin pour le soin et pierres neutres face à un à trois monstres dans 30 combats.",
        de: "Drei Walzen stoppen nacheinander: Löwen verstärken Angriff, Schildkröten Verteidigung, Hasenjuwelen heilen und Steine bleiben leer – gegen ein bis drei Monster in 30 Kämpfen.",
        it: "Guarda tre rulli fermarsi in sequenza: leoni potenziano l’attacco, tartarughe la difesa, gemme coniglio curano e pietre restano vuote contro uno-tre mostri in 30 battaglie.",
        ru: "Три барабана останавливаются по очереди: львы усиливают атаку, черепахи защиту, самоцветы кролика лечат, а камни пусты — против одного-трёх монстров в 30 боях.",
        hi: "तीन रील क्रम से रुकती हैं: शेर आक्रमण, कछुआ रक्षा, खरगोश रत्न उपचार बढ़ाते हैं और पत्थर खाली रहता है—30 युद्धों में एक से तीन राक्षसों के विरुद्ध।",
        ar: "شاهد ثلاث بكرات تتوقف بالتتابع: الأسد يضاعف الهجوم والسلحفاة الدفاع وجوهرة الأرنب تشفي والحجر خامل، أمام وحش إلى ثلاثة في 30 معركة.",
      },
      meta: {
        en: ["30 Battles", "Sequential Reel Stops", "1–3 Monsters"], "zh-Hant": ["30 場戰鬥", "轉輪依序停下", "1–3 隻怪物"],
        "zh-Hans": ["30 场战斗", "转轮依次停下", "1–3 只怪物"], ja: ["30戦", "順番に停止", "1～3体の敵"],
        ko: ["30개 전투", "순차 정지", "적 1~3마리"], es: ["30 batallas", "Parada secuencial", "1–3 monstruos"],
        "pt-BR": ["30 batalhas", "Parada em sequência", "1–3 monstros"], fr: ["30 combats", "Arrêt séquentiel", "1–3 monstres"],
        de: ["30 Kämpfe", "Stopps in Folge", "1–3 Monster"], it: ["30 battaglie", "Arresto in sequenza", "1–3 mostri"],
        ru: ["30 боёв", "Остановка по очереди", "1–3 монстра"], hi: ["30 युद्ध", "क्रमिक रुकना", "1–3 राक्षस"],
        ar: ["30 معركة", "توقف متتابع", "1–3 وحوش"],
      },
      art: { kind: "image", background: "assets/animal-rune-reels/cover.webp", hideHero: true },
    },
    {
      id: "animal-spectrum-pulse",
      title: {
        en: "Animal Spectrum Pulse", "zh-Hant": "動物光譜脈衝", "zh-Hans": "动物光谱脉冲",
        ja: "アニマル・スペクトラムパルス", ko: "동물 스펙트럼 펄스", es: "Pulso Espectral Animal",
        "pt-BR": "Pulso Espectral Animal", fr: "Pulsion Spectrale Animale",
        de: "Tierischer Spektrumpuls", it: "Impulso Spettrale Animale", ru: "Звери: Спектральный импульс",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정",
        es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt disponible", de: "Demnächst", it: "Prossimamente", ru: "Скоро",
      },
      type: {
        en: "One-Touch Precision Arcade", "zh-Hant": "單鍵精準動作", "zh-Hans": "单键精准动作",
        ja: "ワンタッチ精密アクション", ko: "원터치 정밀 액션", es: "Arcade de precisión con un toque",
        "pt-BR": "Arcade de precisão com um toque", fr: "Arcade de précision à une touche",
        de: "Ein-Tasten-Präzisionsspiel", it: "Arcade di precisione a un tocco", ru: "Аркада на точность в одно касание",
      },
      categories: ["Animal Games", "Arcade", "Featured"],
      skills: ["Timing", "Pattern Recognition", "Focus"],
      ages: ["13"],
      href: "games/animal-spectrum-pulse/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Pulse Panko's spectrum spirit through rotating emblem gates and restore 30 deterministic aurora towers.",
        "zh-Hant": "用脈衝引導 Panko 的光譜精靈穿越旋轉紋章星門，修復 30 座固定設計的極光塔。",
        "zh-Hans": "用脉冲引导 Panko 的光谱精灵穿越旋转纹章星门，修复 30 座固定设计的极光塔。",
        ja: "パンクの精霊をパルスで回転紋章ゲートへ導き、設計された30のオーロラ塔を修復しよう。",
        ko: "판코의 스펙트럼 정령을 회전 문양 관문 사이로 펄스해 설계된 오로라 탑 30개를 복원하세요.",
        es: "Impulsa al espíritu espectral de Panko por puertas giratorias con emblemas y restaura 30 torres de aurora diseñadas.",
        "pt-BR": "Impulsione o espírito espectral de Panko por portões giratórios com emblemas e restaure 30 torres de aurora projetadas.",
        fr: "Propulsez l'esprit spectral de Panko à travers des portes rotatives à emblèmes et restaurez 30 tours d'aurore conçues à la main.",
        de: "Pulse Pankos Spektralgeist durch rotierende Emblemtore und stelle 30 entworfene Auroratürme wieder her.",
        it: "Spingi lo spirito spettrale di Panko tra portali rotanti con emblemi e ripristina 30 torri dell'aurora progettate.",
        ru: "Проведи спектрального духа Панко импульсами через вращающиеся врата и восстанови 30 созданных вручную башен сияния.",
      },
      meta: {
        en: ["30 Towers", "Four Emblems", "One-Touch Pulse"], "zh-Hant": ["30 座塔", "四種紋章", "單鍵脈衝"],
        "zh-Hans": ["30 座塔", "四种纹章", "单键脉冲"], ja: ["30の塔", "4つの紋章", "ワンタッチパルス"],
        ko: ["30개 탑", "4가지 문양", "원터치 펄스"], es: ["30 torres", "Cuatro emblemas", "Pulso de un toque"],
        "pt-BR": ["30 torres", "Quatro emblemas", "Pulso de um toque"], fr: ["30 tours", "Quatre emblèmes", "Pulsion à une touche"],
        de: ["30 Türme", "Vier Embleme", "Ein-Tasten-Puls"], it: ["30 torri", "Quattro emblemi", "Impulso a un tocco"],
        ru: ["30 башен", "Четыре знака", "Импульс в одно касание"],
      },
      art: { kind: "image", background: "assets/animal-spectrum-pulse/cover.webp", hideHero: true },
    },
    {
      id: "animal-rootvault-pins",
      title: {
        en: "Animal Rootvault Pins", "zh-Hant": "動物根脈機關", "zh-Hans": "动物根脉机关",
        ja: "どうぶつルートヴォルト・ピン", ko: "동물 뿌리금고 핀", es: "Clavijas de la Cámara Animal",
        "pt-BR": "Pinos do Cofre Animal", fr: "Goupilles du Caveau Animal",
        de: "Tierische Wurzelgewölbe-Stifte", it: "Perni della Cripta Animale", ru: "Звери: Штифты корневого хранилища",
      },
      status: "playable",
      statusText: {
        en: "Play Now", "zh-Hant": "立即遊玩", "zh-Hans": "立即游玩", ja: "今すぐプレイ", ko: "지금 플레이",
        es: "Jugar ahora", "pt-BR": "Jogar agora", fr: "Jouer maintenant", de: "Jetzt spielen", it: "Gioca ora", ru: "Играть",
      },
      type: {
        en: "Order-Based Chamber Puzzle", "zh-Hant": "順序式房間機關", "zh-Hans": "顺序式房间机关",
        ja: "順序型チャンバーパズル", ko: "순서형 방 장치 퍼즐", es: "Puzle de cámaras por orden",
        "pt-BR": "Quebra-cabeça de câmaras em ordem", fr: "Énigme de chambres ordonnée",
        de: "Reihenfolge-Kammerpuzzle", it: "Enigma di camere in sequenza", ru: "Камерная головоломка на порядок",
      },
      categories: ["Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Planning", "Problem Solving"],
      ages: ["13"],
      href: "games/animal-rootvault-pins/",
      description: {
        en: "Pull complete golden pins to route Taro, Moonwater, Emberlight, wards, keys, shadows, and a Star Core through 30 authored Rootvault chambers.",
        "zh-Hant": "拉出完整金色機關針，引導 Taro、月水、燼光、護盾、鑰匙、暗影與星核通過 30 個根脈房間。",
        "zh-Hans": "拉出完整金色机关针，引导 Taro、月水、烬光、护盾、钥匙、暗影与星核通过 30 个根脉房间。",
        ja: "完全な金色ピンを抜き、タロ、月水、残り火、守り、鍵、影、スターコアを30の根の部屋へ導こう。",
        ko: "완전한 황금 핀을 뽑아 타로, 달물, 잿불, 보호막, 열쇠, 그림자, 별핵을 30개 뿌리 방으로 안내하세요.",
        es: "Saca clavijas doradas para guiar a Taro, agua, brasas, escudos, llaves, sombras y un Núcleo por 30 cámaras diseñadas.",
        "pt-BR": "Puxe pinos dourados para guiar Taro, água, brasa, escudos, chaves, sombras e um Núcleo por 30 câmaras criadas.",
        fr: "Retirez des goupilles dorées pour guider Taro, eau, braises, boucliers, clés, ombres et Cœur dans 30 salles conçues.",
        de: "Ziehe goldene Stifte und führe Taro, Wasser, Glut, Panzer, Schlüssel, Schatten und Sternenkern durch 30 Kammern.",
        it: "Estrai perni dorati per guidare Taro, acqua, braci, scudi, chiavi, ombre e Nucleo in 30 camere progettate.",
        ru: "Вытягивай золотые штифты и проводи Таро, воду, жар, щиты, ключи, тени и Ядро через 30 созданных камер.",
      },
      meta: {
        en: ["30 Chambers", "Material Reactions", "Rune Locks"], "zh-Hant": ["30 個房間", "物質交互", "符文鎖"],
        "zh-Hans": ["30 个房间", "物质交互", "符文锁"], ja: ["30の部屋", "素材反応", "ルーン錠"],
        ko: ["30개 방", "재료 반응", "룬 자물쇠"], es: ["30 cámaras", "Reacciones", "Cierres rúnicos"],
        "pt-BR": ["30 câmaras", "Reações", "Fechaduras rúnicas"], fr: ["30 salles", "Réactions", "Verrous runiques"],
        de: ["30 Kammern", "Stoffreaktionen", "Runenschlösser"], it: ["30 camere", "Reazioni", "Serrature runiche"],
        ru: ["30 камер", "Реакции веществ", "Рунные замки"],
      },
      art: { kind: "image", background: "assets/animal-rootvault-pins/animal-rootvault-pins-cover.webp", hideHero: true },
    },
    {
      id: "animal-sketchwheel-rally",
      title: {
        en: "Animal Sketchwheel Rally", "zh-Hant": "動物繪輪競速", "zh-Hans": "动物绘轮竞速",
        ja: "アニマル・スケッチホイール・ラリー", ko: "동물 스케치휠 랠리", es: "Rally Animal de Ruedas Dibujadas",
        "pt-BR": "Rali Animal de Rodas Desenhadas", fr: "Rally Animal des Roues Dessinées",
        de: "Tierisches Skizzenrad-Rennen", it: "Rally Animale delle Ruote Disegnate", ru: "Звериное ралли рисованных колёс",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정",
        es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt disponible", de: "Demnächst", it: "Prossimamente", ru: "Скоро",
      },
      type: {
        en: "Draw-to-Drive Rally", "zh-Hant": "繪輪競速", "zh-Hans": "绘轮竞速", ja: "描いて走るラリー", ko: "그려서 달리는 랠리",
        es: "Rally de dibujo", "pt-BR": "Rali de desenho", fr: "Rallye dessiné", de: "Zeichen-Rallye", it: "Rally disegnato", ru: "Ралли с рисованием",
      },
      categories: ["Animal Games", "Racing", "Arcade", "Strategy"],
      skills: ["Problem Solving", "Reaction", "Hand-Eye Coordination"],
      ages: ["13"],
      href: "games/animal-sketchwheel-rally/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Draw live wheel profiles for Rux's rune cart, then redraw through stairs, mud, tunnels, gaps, ice, and wind across 30 authored rallies.",
        "zh-Hant": "為魯克的符文車即時畫出輪型，並在 30 場競速中重畫應對階梯、泥地、隧道、缺口、冰面與側風。",
        "zh-Hans": "为鲁克的符文车即时画出轮型，并在 30 场竞速中重画应对阶梯、泥地、隧道、缺口、冰面与侧风。",
        ja: "ルクスのルーン車輪を描き、30のラリーで階段、泥、トンネル、谷、氷、風に合わせて描き直そう。",
        ko: "룩스의 룬 카트 바퀴를 그리고 30개 랠리에서 계단, 진흙, 터널, 틈, 얼음, 바람에 맞춰 다시 그리세요.",
        es: "Dibuja ruedas para el carro rúnico de Rux y adáptalas a escalones, barro, túneles, brechas, hielo y viento en 30 rallies.",
        "pt-BR": "Desenhe rodas para o carro rúnico de Rux e adapte-as a degraus, lama, túneis, vãos, gelo e vento em 30 ralis.",
        fr: "Dessinez les roues du chariot runique de Rux et adaptez-les aux marches, à la boue, aux tunnels, aux fossés, à la glace et au vent dans 30 rallyes.",
        de: "Zeichne Räder für Rux' Runenwagen und passe sie in 30 Rennen an Stufen, Schlamm, Tunnel, Lücken, Eis und Wind an.",
        it: "Disegna le ruote del carro runico di Rux e adattale a gradini, fango, tunnel, varchi, ghiaccio e vento in 30 rally.",
        ru: "Рисуйте колёса для рунной телеги Рукса и меняйте их перед ступенями, грязью, туннелями, разрывами, льдом и ветром в 30 гонках.",
      },
      meta: {
        en: ["30 Rallies", "Freehand Wheels", "Live Redraw"], "zh-Hant": ["30 場競速", "自由繪輪", "行進中重畫"],
        "zh-Hans": ["30 场竞速", "自由绘轮", "行进中重画"], ja: ["30レース", "自由描画", "走行中に描き直し"],
        ko: ["30개 랠리", "자유 바퀴", "주행 중 다시 그리기"], es: ["30 rallies", "Ruedas libres", "Redibujo en vivo"],
        "pt-BR": ["30 ralis", "Rodas livres", "Redesenho ao vivo"], fr: ["30 rallyes", "Roues libres", "Redessin en direct"],
        de: ["30 Rennen", "Freihandräder", "Live neu zeichnen"], it: ["30 rally", "Ruote libere", "Ridisegno dal vivo"],
        ru: ["30 гонок", "Свободный рисунок", "Смена на ходу"],
      },
      art: { kind: "image", background: "assets/animal-sketchwheel-rally/animal-sketchwheel-rally-cover.webp", hideHero: true },
    },
    {
      id: "animal-frontier-dominion",
      title: {
        en: "Animal Frontier Dominion",
        "zh-Hant": "\u52d5\u7269\u908a\u5883\u9818\u4e3b",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon",
        "zh-Hant": "\u656c\u8acb\u671f\u5f85",
      },
      type: {
        en: "4X-Lite Territory Strategy",
        "zh-Hant": "4X-Lite \u9818\u5730\u7b56\u7565",
      },
      categories: ["Animal Games", "Strategy", "Featured"],
      skills: ["Strategic Planning", "Problem Solving", "Focus"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-frontier-dominion/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Scout hidden frontier rules, counter rival formations, and connect captured territories to the Crystal Citadel across 30 handcrafted regions.",
        "zh-Hant": "\u5075\u5bdf\u908a\u5883\u7684\u96b1\u85cf\u898f\u5247\uff0c\u7528\u9663\u578b\u524b\u5236\u5c0d\u624b\uff0c\u5728 30 \u500b\u624b\u5de5\u5340\u57df\u4e2d\u5efa\u7acb\u901a\u5f80\u6c34\u6676\u8981\u585e\u7684\u9818\u5730\u93c8\u3002",
      },
      meta: {
        en: ["30 Regions", "Scout & Expand", "Formation Counters"],
        "zh-Hant": ["30 \u500b\u5340\u57df", "\u5075\u5bdf\u8207\u64f4\u5f35", "\u9663\u578b\u524b\u5236"],
      },
      art: { kind: "image", background: "assets/animal-frontier-dominion/cover.webp", hideHero: true },
    },
    {
      id: "animal-sanctuary-loop",
      title: {
        en: "Animal Sanctuary Loop", "zh-Hant": "動物聖域光環", "zh-Hans": "动物圣域光环",
        ja: "アニマル・サンクチュアリ・ループ", ko: "동물 성역 루프", es: "Bucle del Santuario Animal",
        "pt-BR": "Laço do Santuário Animal", fr: "Boucle du Sanctuaire Animal",
        de: "Tierische Zufluchtsschleife", it: "Anello del Santuario Animale", ru: "Кольцо звериного святилища",
      },
      status: "playable",
      statusText: {
        en: "Play Now", "zh-Hant": "立即遊玩", "zh-Hans": "立即游玩", ja: "今すぐプレイ", ko: "지금 플레이",
        es: "Jugar ahora", "pt-BR": "Jogar agora", fr: "Jouer maintenant", de: "Jetzt spielen", it: "Gioca ora", ru: "Играть",
      },
      type: {
        en: "Territory Capture Arcade", "zh-Hant": "即時圈地冒險", "zh-Hans": "即时圈地冒险", ja: "リアルタイム陣取りアーケード",
        ko: "실시간 영역 점령 아케이드", es: "Arcade de conquista territorial", "pt-BR": "Arcade de conquista de território",
        fr: "Arcade de conquête territoriale", de: "Gebietseroberungs-Arcade", it: "Arcade di conquista territoriale", ru: "Аркада с захватом территории",
      },
      categories: ["Animal Games", "Arcade", "Strategy", "Featured"],
      skills: ["Spatial Planning", "Risk Assessment", "Focus"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-sanctuary-loop/",
      description: {
        en: "Guide Fia beyond safe land, close glowing loops before shadows cut the trail, and restore 30 rule-changing sanctuary missions.",
        "zh-Hant": "引導星爪狐離開安全領地，在暗影切斷光軌前完成封環，修復 30 個規則持續變化的聖域任務。",
        "zh-Hans": "引导星爪狐离开安全领地，在暗影切断光轨前完成封环，修复 30 个规则持续变化的圣域任务。",
        ja: "安全地帯の外へフィアを導き、影に光跡を断たれる前に輪を閉じ、ルールが変化する30の聖域ミッションを再生しよう。",
        ko: "피아를 안전지대 밖으로 이끌고 그림자가 빛의 궤적을 끊기 전에 고리를 닫아, 규칙이 달라지는 30개 성역 임무를 복원하세요.",
        es: "Guía a Fia fuera de la zona segura, cierra bucles antes de que las sombras corten el rastro y restaura 30 misiones con reglas cambiantes.",
        "pt-BR": "Guie Fia além da área segura, feche laços antes que as sombras cortem o rastro e restaure 30 missões com regras variáveis.",
        fr: "Guidez Fia hors de la zone sûre, fermez des boucles avant que les ombres ne coupent la trace et restaurez 30 missions aux règles changeantes.",
        de: "Führe Fia aus dem sicheren Gebiet, schließe Schleifen vor dem Angriff der Schatten und stelle 30 Missionen mit wechselnden Regeln wieder her.",
        it: "Guida Fia fuori dalla zona sicura, chiudi gli anelli prima che le ombre spezzino la scia e ripristina 30 missioni dalle regole variabili.",
        ru: "Выводите Фию из безопасной зоны, замыкайте световые петли до удара теней и восстановите 30 миссий с меняющимися правилами.",
      },
      meta: {
        en: ["30 Missions", "Close the Loop", "Shadow Hunters"], "zh-Hant": ["30 個任務", "封閉光環", "暗影獵手"],
        "zh-Hans": ["30 个任务", "封闭光环", "暗影猎手"], ja: ["30ミッション", "光輪を閉じる", "影のハンター"],
        ko: ["30개 임무", "빛의 고리 완성", "그림자 사냥꾼"], es: ["30 misiones", "Cierra el bucle", "Cazadores de sombras"],
        "pt-BR": ["30 missões", "Feche o laço", "Caçadores sombrios"], fr: ["30 missions", "Fermez la boucle", "Chasseurs d'ombre"],
        de: ["30 Missionen", "Schließe die Schleife", "Schattenjäger"], it: ["30 missioni", "Chiudi l'anello", "Cacciatori d'ombra"],
        ru: ["30 миссий", "Замкните петлю", "Теневые охотники"],
      },
      art: { kind: "image", background: "assets/animal-sanctuary-loop/cover.webp", hideHero: true },
    },
    {
      id: "animal-prism-battalion",
      title: {
        en: "Animal Prism Battalion", "zh-Hant": "動物稜光軍團", "zh-Hans": "动物棱光军团",
        ja: "アニマル・プリズム大隊", ko: "동물 프리즘 대대", es: "Batallón Prisma Animal",
        "pt-BR": "Batalhão Prisma Animal", fr: "Bataillon Prisme Animal", de: "Tierisches Prismenbataillon",
        it: "Battaglione Prisma Animale", ru: "Звериный призменный батальон",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정",
        es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt disponible", de: "Demnächst", it: "Prossimamente", ru: "Скоро",
      },
      type: {
        en: "Multiplier-Gate Arcade Strategy", "zh-Hant": "倍率門街機策略", "zh-Hans": "倍率门街机策略",
        ja: "倍率ゲート・アーケード戦略", ko: "배율 관문 아케이드 전략", es: "Estrategia arcade de multiplicadores",
        "pt-BR": "Estratégia arcade de multiplicadores", fr: "Stratégie arcade à multiplicateurs",
        de: "Arcade-Strategie mit Multiplikatoren", it: "Strategia arcade con moltiplicatori", ru: "Аркадная стратегия с множителями",
      },
      categories: ["Animal Games", "Arcade", "Strategy", "Featured"],
      skills: ["Quick Decisions", "Risk Assessment", "Aim"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-prism-battalion/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Aim Fia's prism stream through multiplier gates, grow a spirit battalion, and break 30 evolving shadow fortresses.",
        "zh-Hant": "瞄準菲亞的稜光軍流，穿越倍率門增殖光靈軍團，擊破 30 座規則持續進化的暗影要塞。",
        "zh-Hans": "瞄准菲亚的棱光军流，穿越倍率门增殖光灵军团，击破 30 座规则持续进化的暗影要塞。",
        ja: "フィアの精霊流を倍率ゲートへ導き、大隊を増やして進化する30の影要塞を破壊しよう。",
        ko: "피아의 정령 흐름을 배율 관문으로 조준해 대대를 키우고 진화하는 30개 그림자 요새를 격파하세요.",
        es: "Apunta el flujo de Fia por puertas multiplicadoras, aumenta el batallón y rompe 30 fortalezas cambiantes.",
        "pt-BR": "Mire o fluxo de Fia pelos portões multiplicadores, amplie o batalhão e destrua 30 fortalezas variáveis.",
        fr: "Visez les portes multiplicatrices, agrandissez le bataillon de Fia et brisez 30 forteresses évolutives.",
        de: "Lenke Fias Geisterstrom durch Multiplikatortore, vergrößere das Bataillon und zerstöre 30 Festungen.",
        it: "Guida il flusso di Fia attraverso i moltiplicatori, amplia il battaglione e distruggi 30 fortezze.",
        ru: "Направляйте поток Фии через множители, увеличивайте батальон и разрушьте 30 меняющихся крепостей.",
      },
      meta: {
        en: ["30 Assaults", "Multiplier Gates", "Prism Overdrive"], "zh-Hant": ["30 場突擊", "倍率光門", "稜光超載"],
        "zh-Hans": ["30 场突击", "倍率光门", "棱光超载"], ja: ["30突撃", "倍率ゲート", "プリズム加速"],
        ko: ["30개 돌격", "배율 관문", "프리즘 과부하"], es: ["30 asaltos", "Puertas multiplicadoras", "Sobrecarga prisma"],
        "pt-BR": ["30 ataques", "Portões multiplicadores", "Sobrecarga prisma"], fr: ["30 assauts", "Portes multiplicatrices", "Surcharge prisme"],
        de: ["30 Angriffe", "Multiplikatortore", "Prismen-Übertrieb"], it: ["30 assalti", "Porte moltiplicatrici", "Sovraccarico prisma"],
        ru: ["30 штурмов", "Ворота-множители", "Призменная перегрузка"],
      },
      art: { kind: "image", background: "assets/animal-prism-battalion/cover.webp", hideHero: true },
    },
    {
      id: "animal-skybridge-rivals",
      title: {
        en: "Animal Skybridge Rivals", "zh-Hant": "動物天橋爭霸", "zh-Hans": "动物天桥争霸",
        ja: "アニマル・スカイブリッジ", ko: "동물 스카이브리지 라이벌", es: "Rivales del Puente Celeste",
        "pt-BR": "Rivais da Ponte Celeste", fr: "Rivaux des Ponts Célestes", de: "Tierische Himmelsbrücken",
        it: "Rivali dei Ponti Celesti", ru: "Звери: Небесные мосты",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정",
        es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt", de: "Demnächst", it: "Prossimamente", ru: "Скоро",
      },
      type: {
        en: "Real-Time Stack-and-Build Racing", "zh-Hant": "即時堆疊築橋競速", "zh-Hans": "即时堆叠筑桥竞速",
        ja: "リアルタイム収集・建設レース", ko: "실시간 수집·건설 레이스", es: "Carrera de apilar y construir",
        "pt-BR": "Corrida de coletar e construir", fr: "Course de collecte et construction", de: "Sammel- und Baurennen",
        it: "Corsa raccogli e costruisci", ru: "Гонка со сбором и строительством",
      },
      categories: ["Animal Games", "Racing", "Arcade", "Strategy", "Featured"],
      skills: ["Quick Decisions", "Route Choice", "Timing"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-skybridge-rivals/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Guide Fia through 30 cloud races, collect cyan aurora tiles, stack them, and build a bridge before three animal rivals.",
        "zh-Hant": "引導菲亞挑戰 30 場雲端競賽，收集青色極光磚、堆疊運送並搶在三名動物對手前完成橋梁。",
        "zh-Hans": "引导菲亚挑战 30 场云端竞赛，收集青色极光砖、堆叠运送并抢在三名动物对手前完成桥梁。",
        ja: "フィアを導き、30の雲上レースでシアンのタイルを集め、3人のライバルより先に橋を完成させよう。",
        ko: "피아를 움직여 30개 하늘 경주에서 청록 타일을 모으고 세 라이벌보다 먼저 다리를 완성하세요.",
        es: "Guía a Fia en 30 carreras, recoge losetas cian y construye un puente antes que tres rivales.",
        "pt-BR": "Guie Fia em 30 corridas, colete peças ciano e construa uma ponte antes dos três rivais.",
        fr: "Guidez Fia dans 30 courses, ramassez les dalles cyan et construisez un pont avant trois rivaux.",
        de: "Führe Fia durch 30 Wolkenrennen, sammle türkise Platten und baue vor drei Rivalen eine Brücke.",
        it: "Guida Fia in 30 gare, raccogli tessere ciano e costruisci un ponte prima di tre rivali.",
        ru: "Проведи Фию через 30 гонок, собери бирюзовые плитки и построй мост раньше трёх соперников.",
      },
      meta: {
        en: ["30 Sky Races", "Collect and Stack", "Build Any Lane"], "zh-Hant": ["30 場雲端競賽", "收集與堆疊", "自由選擇橋道"],
        "zh-Hans": ["30 场云端竞赛", "收集与堆叠", "自由选择桥道"], ja: ["30レース", "収集と積載", "自由な橋選び"],
        ko: ["30개 경주", "수집과 적재", "자유로운 길 선택"], es: ["30 carreras", "Recoge y apila", "Elige cualquier vía"],
        "pt-BR": ["30 corridas", "Colete e empilhe", "Escolha qualquer pista"], fr: ["30 courses", "Collectez et empilez", "Choisissez une voie"],
        de: ["30 Rennen", "Sammeln und stapeln", "Freie Spurwahl"], it: ["30 gare", "Raccogli e impila", "Scegli la corsia"],
        ru: ["30 гонок", "Собирай и складывай", "Выбирай любой путь"],
      },
      art: { kind: "image", background: "assets/animal-skybridge-rivals/cover.webp", hideHero: true },
    },
    {
      id: "animal-skyspire-drop",
      title: {
        en: "Animal Skyspire Drop", "zh-Hant": "動物天塔墜擊", "zh-Hans": "动物天塔坠击",
        ja: "アニマル・スカイスパイア・ドロップ", ko: "동물 하늘첨탑 드롭", es: "Caída por la Torre Animal",
        "pt-BR": "Queda na Torre Animal", fr: "Chute de la Tour Animale", de: "Tierischer Himmelsturm-Sturz",
        it: "Caduta dalla Torre Animale", ru: "Звери: Падение с небесной башни",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정",
        es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt", de: "Demnächst", it: "Prossimamente", ru: "Скоро",
      },
      type: {
        en: "Rotating Tower Drop Arcade", "zh-Hant": "旋轉尖塔墜落街機", "zh-Hans": "旋转尖塔坠落街机",
        ja: "回転タワー落下アーケード", ko: "회전 탑 낙하 아케이드", es: "Arcade de caída y torre giratoria",
        "pt-BR": "Arcade de queda em torre giratória", fr: "Arcade de chute dans une tour", de: "Drehturm-Fall-Arcade",
        it: "Arcade di caduta nella torre", ru: "Аркада с падением по башне",
      },
      categories: ["Animal Games", "Arcade", "Action", "Featured"],
      skills: ["Reaction", "Timing", "Focus"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-skyspire-drop/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Rotate thirty crystal skyspires, guide Fia through shifting gaps, and charge Comet Break before cursed rings end the descent.",
        "zh-Hant": "旋轉 30 座水晶天空尖塔，引導菲亞穿越移動缺口，蓄滿彗星破擊並避開詛咒塔環。",
        "zh-Hans": "旋转 30 座水晶天空尖塔，引导菲亚穿越移动缺口，蓄满彗星破击并避开诅咒塔环。",
        ja: "30のクリスタル天空塔を回し、フィアを動く隙間へ導き、呪いのリングを彗星ブレイクで突破しよう。",
        ko: "30개의 수정 하늘 첨탑을 돌려 피아를 움직이는 틈으로 안내하고 혜성 파괴로 저주 고리를 돌파하세요.",
        es: "Gira treinta torres de cristal, guía a Fia por huecos móviles y carga Ruptura Cometa contra los anillos malditos.",
        "pt-BR": "Gire trinta torres de cristal, guie Fia por aberturas móveis e carregue a Ruptura Cometa contra anéis amaldiçoados.",
        fr: "Faites tourner trente tours de cristal, guidez Fia dans les ouvertures et chargez la Rupture Comète.",
        de: "Drehe dreißig Kristalltürme, führe Fia durch wandernde Lücken und lade den Kometenbruch gegen Fluchringe.",
        it: "Ruota trenta torri di cristallo, guida Fia nei varchi mobili e carica Spacca Cometa contro gli anelli maledetti.",
        ru: "Вращай тридцать кристальных башен, веди Фию через движущиеся проёмы и заряжай Кометный пробой.",
      },
      meta: {
        en: ["30 Skyspires", "Rotate and Drop", "Comet Break"], "zh-Hant": ["30 座天空尖塔", "旋轉與墜落", "彗星破擊"],
        "zh-Hans": ["30 座天空尖塔", "旋转与坠落", "彗星破击"], ja: ["30の天空塔", "回転と落下", "彗星ブレイク"],
        ko: ["30개 첨탑", "회전과 낙하", "혜성 파괴"], es: ["30 torres", "Gira y cae", "Ruptura Cometa"],
        "pt-BR": ["30 torres", "Gire e caia", "Ruptura Cometa"], fr: ["30 tours", "Tourner et chuter", "Rupture Comète"],
        de: ["30 Türme", "Drehen und fallen", "Kometenbruch"], it: ["30 torri", "Ruota e cadi", "Spacca Cometa"],
        ru: ["30 башен", "Вращение и падение", "Кометный пробой"],
      },
      art: { kind: "image", background: "assets/animal-skyspire-drop/cover.webp", hideHero: true },
    },
    {
      id: "animal-cloudrail-roll",
      title: {
        en: "Animal Cloudrail Roll", "zh-Hant": "動物雲軌疾滾", "zh-Hans": "动物云轨疾滚",
        ja: "アニマル・クラウドレール・ロール", ko: "동물 구름궤도 롤", es: "Rodar por los Rieles Animales",
        "pt-BR": "Rolagem nos Trilhos Animais", fr: "Course sur les Rails Animaux", de: "Tierische Wolkenschienen-Rolle",
        it: "Rotolamento sui Binari Animali", ru: "Звери: Гонка по облачным рельсам",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정",
        es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt", de: "Demnächst", it: "Prossimamente", ru: "Скоро",
      },
      type: {
        en: "Rolling Obstacle-Course Arcade", "zh-Hant": "滾球障礙街機", "zh-Hans": "滚球障碍街机",
        ja: "ローリング障害物アーケード", ko: "롤링 장애물 아케이드", es: "Arcade de obstáculos rodantes",
        "pt-BR": "Arcade de obstáculos rolantes", fr: "Arcade d'obstacles roulants", de: "Rollender Hindernis-Arcade",
        it: "Arcade a ostacoli rotolanti", ru: "Аркада с катящимися препятствиями",
      },
      categories: ["Animal Games", "Arcade", "Action", "Featured"],
      skills: ["Reaction", "Timing", "Spatial Control"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-cloudrail-roll/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Steer Rux's Gearglobe through thirty elevated cloudrail courses, control speed, survive moving obstacles, and restore every foundry beacon.",
        "zh-Hant": "操控魯克斯的齒輪球挑戰 30 條高空雲軌，調整速度、穿越移動障礙並恢復所有鑄造信標。",
        "zh-Hans": "操控鲁克斯的齿轮球挑战 30 条高空云轨，调整速度、穿越移动障碍并恢复所有铸造信标。",
        ja: "ラックスのギアグローブを操り、30の高架コースで速度を選び、障害物を越えて工房ビーコンを復旧しよう。",
        ko: "룩스의 기어글로브를 조종해 30개의 공중 궤도에서 속도를 조절하고 장애물을 넘어 주조 신호기를 복구하세요.",
        es: "Guía la Gearglobe de Rux por treinta rieles elevados, controla la velocidad, supera obstáculos y restaura cada faro.",
        "pt-BR": "Conduza a Gearglobe de Rux por trinta trilhos elevados, controle a velocidade, supere obstáculos e restaure cada farol.",
        fr: "Dirigez la Gearglobe de Rux sur trente rails suspendus, maîtrisez la vitesse et restaurez chaque balise.",
        de: "Lenke Rux' Gearglobe über dreißig Wolkenschienen, kontrolliere das Tempo und erneuere jedes Schmiedefeuer.",
        it: "Guida la Gearglobe di Rux su trenta binari sospesi, controlla la velocità e ripristina ogni faro.",
        ru: "Проведи Гироглоб Рукса по тридцати облачным трассам, управляй скоростью и восстанови все маяки.",
      },
      meta: {
        en: ["30 Cloudrails", "Analog Steering", "Gear Workshop"], "zh-Hant": ["30 條雲軌", "連續轉向", "齒輪工坊"],
        "zh-Hans": ["30 条云轨", "连续转向", "齿轮工坊"], ja: ["30のコース", "連続操舵", "ギア工房"],
        ko: ["30개 궤도", "연속 조종", "기어 공방"], es: ["30 rieles", "Dirección continua", "Taller"],
        "pt-BR": ["30 trilhos", "Direção contínua", "Oficina"], fr: ["30 rails", "Conduite continue", "Atelier"],
        de: ["30 Schienen", "Stufenlose Lenkung", "Werkstatt"], it: ["30 binari", "Sterzo continuo", "Officina"],
        ru: ["30 трасс", "Плавное руление", "Мастерская"],
      },
      art: { kind: "image", background: "assets/animal-cloudrail-roll/cover.webp", hideHero: true },
    },
    {
      id: "animal-rift-salvage",
      title: {
        en: "Animal Rift Salvage", "zh-Hant": "動物裂隙回收隊", "zh-Hans": "动物裂隙回收队",
        ja: "アニマル・リフトサルベージ", ko: "동물 균열 회수대", es: "Rescate en la Grieta Animal",
        "pt-BR": "Resgate na Fenda Animal", fr: "Récupération dans la Faille Animale", de: "Tierische Rissbergung",
        it: "Recupero nella Faglia Animale", ru: "Звери: Сбор в разломе",
      },
      status: "planned",
      statusText: {
        en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정",
        es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt", de: "Demnächst", it: "Prossimamente", ru: "Скоро",
      },
      type: {
        en: "Growing Salvage Arena", "zh-Hant": "成長回收競技", "zh-Hans": "成长回收竞技",
        ja: "成長型サルベージアリーナ", ko: "성장형 회수 아레나", es: "Arena de rescate y crecimiento",
        "pt-BR": "Arena de resgate e crescimento", fr: "Arène de récupération évolutive", de: "Wachsende Bergungsarena",
        it: "Arena di recupero crescente", ru: "Арена растущего сборщика",
      },
      categories: ["Animal Games", "Arcade", "Action", "Featured"],
      skills: ["Spatial Planning", "Risk Management", "Reaction"],
      ages: ["13"],
      ageLabel: { en: "13+", "zh-Hant": "13+" },
      href: "games/animal-rift-salvage/",
      internalTrial: "index.html?trial=1",
      description: {
        en: "Guide Orla's lunar recovery ring through thirty astral zones, collect small debris to grow, rescue cores, outpace rivals, and reclaim crown wreckage.",
        "zh-Hant": "引導奧拉的月輪挑戰 30 個星界區域，先回收小型殘骸成長，再救援核心、超越對手並收回王冠遺物。",
        "zh-Hans": "引导奥拉的月轮挑战 30 个星界区域，先回收小型残骸成长，再救援核心、超越对手并收回王冠遗物。",
        ja: "オーラの月輪を導き、30の星界区域で小さな残骸から成長し、救助コアを回収してライバルを追い越そう。",
        ko: "오를라의 달 회수 고리를 이끌어 30개 성계 구역에서 작은 잔해부터 흡수하고 구조 코어를 구해 경쟁자를 앞지르세요.",
        es: "Guía el anillo lunar de Orla por treinta zonas, recoge restos pequeños para crecer, rescata núcleos y supera a los rivales.",
        "pt-BR": "Guie o anel lunar de Orla por trinta zonas, recolha destroços pequenos para crescer, resgate núcleos e supere rivais.",
        fr: "Guidez l'anneau lunaire d'Orla dans trente zones, récupérez de petits débris, sauvez les noyaux et dépassez vos rivaux.",
        de: "Lenke Orlas Mondring durch dreißig Zonen, sammle kleine Trümmer zum Wachsen, rette Kerne und überhole Rivalen.",
        it: "Guida l'anello lunare di Orla in trenta zone, recupera piccoli detriti per crescere, salva i nuclei e supera i rivali.",
        ru: "Веди лунное кольцо Орлы через тридцать зон, собирай мелкие обломки, расти, спасай ядра и обгоняй соперников.",
      },
      meta: {
        en: ["30 Rift Zones", "Grow by Salvaging", "Rivals and Rescues"], "zh-Hant": ["30 個裂隙區域", "回收成長", "對手與救援"],
        "zh-Hans": ["30 个裂隙区域", "回收成长", "对手与救援"], ja: ["30の裂隙区域", "回収して成長", "ライバルと救助"],
        ko: ["30개 균열 구역", "회수하며 성장", "경쟁과 구조"], es: ["30 zonas", "Crece al rescatar", "Rivales y rescates"],
        "pt-BR": ["30 zonas", "Cresça ao resgatar", "Rivais e resgates"], fr: ["30 zones", "Grandir en récupérant", "Rivaux et sauvetages"],
        de: ["30 Zonen", "Wachsen durch Bergen", "Rivalen und Rettungen"], it: ["30 zone", "Cresci recuperando", "Rivali e salvataggi"],
        ru: ["30 зон", "Рост через сбор", "Соперники и спасение"],
      },
      art: { kind: "image", background: "assets/animal-rift-salvage/cover.webp", hideHero: true },
    },
    {
      id: "animal-skyport-dispatch",
      title: { en: "Animal Skyport Dispatch", "zh-Hant": "\u52d5\u7269\u5929\u7a7a\u6e2f\u8abf\u5ea6\u968a" },
      status: "planned",
      statusText: { en: "Coming Soon", "zh-Hant": "\u656c\u8acb\u671f\u5f85" },
      type: { en: "Route Management Strategy", "zh-Hant": "\u822a\u7dda\u8abf\u5ea6\u7b56\u7565" },
      categories: ["Animal Games", "Strategy"],
      skills: ["Logic", "Focus", "Problem Solving"],
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
      id: "animal-starlight-trails",
      previewVideo: "assets/previews/animal-starlight-trails-battle.webm",
      title: { en: "Starlink", "zh-Hant": "Starlink 星鏈", "zh-Hans": "Starlink 星链" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩", "zh-Hans": "可游玩" },
      type: { en: "Single-Stroke Logic Puzzle", "zh-Hant": "一筆畫邏輯益智" },
      categories: ["Animal Games", "Puzzle", "Strategy"],
      skills: ["Logic", "Focus", "Problem Solving"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+" },
      href: "games/animal-starlight-trails/",
      description: {
        en: "Trace every constellation trail exactly once across 30 original puzzles with start seals, comet arrows, numbered stars, keys, and gates.",
        "zh-Hant": "在 30 個原創星座謎題中，運用起點星印、彗星箭路、編號星星、鑰匙與星門，一筆走完每條星路。"
      },
      meta: { en: ["30 Stages", "One-Stroke Routes", "Six Rule Families"], "zh-Hant": ["30 關", "一筆星路", "六種規則"] },
      art: { kind: "image", background: "assets/animal-starlight-trails-cover.webp", hero: "assets/weightplay-character-moon-cap-owl-cutout.webp" },
    },
    {
      id: "animal-one-line",
      previewVideo: "assets/previews/animal-one-line-battle.webm",
      title: { en: "One Line", "zh-Hant": "One Line 一筆到底", "zh-Hans": "One Line 一笔到底" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩", "zh-Hans": "可游玩" },
      type: { en: "Continuous Trail Tracing", "zh-Hant": "連續路線描繪", "zh-Hans": "连续路线描绘" },
      categories: ["Animal Games", "Puzzle", "Skill"],
      skills: ["Hand-Eye Coordination", "Focus", "Reaction"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+", "zh-Hans": "9+" },
      href: "games/animal-one-line/",
      description: {
        en: "Hold one continuous line through 30 original trails, avoid walls and moving shadows, and guide Mimi to the paw portal.",
        "zh-Hant": "按住一筆通過 30 條原創路線，避開牆壁與移動影子，帶領米米抵達腳印門。",
        "zh-Hans": "按住一笔通过 30 条原创路线，避开墙壁与移动影子，带领米米抵达脚印门。"
      },
      meta: { en: ["30 Trails", "One Continuous Hold", "Moving Shadows"], "zh-Hant": ["30 條路線", "全程按住", "移動影子"], "zh-Hans": ["30 条路线", "全程按住", "移动影子"] },
      art: { kind: "image", background: "assets/animal-one-line-cover.webp", hero: "assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp" },
    },
    {
      id: "animal-abyss-diver",
      previewVideo: "assets/previews/animal-abyss-diver-battle.webm",
      title: { en: "Animal Abyss Diver", "zh-Hant": "動物深淵潛航員" },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "立即遊玩" },
      type: { en: "Route Risk Adventure", "zh-Hant": "深海路線冒險" },
      categories: ["Animal Games", "Strategy", "Adventure"],
      skills: ["Logic", "Focus", "Problem Solving"],
      href: "games/animal-abyss-diver/",
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
      title: {
        en: "Animal Coloring Studio", "zh-Hant": "動物塗色工作室", "zh-Hans": "动物涂色工作室",
        es: "Estudio de Colorear Animales", ja: "どうぶつぬりえスタジオ", ko: "동물 색칠 스튜디오",
        "pt-BR": "Ateliê de Colorir Animais", de: "Tier-Malstudio",
      },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "立即遊玩", "zh-Hans": "立即游玩", es: "Jugar", ja: "今すぐ遊ぶ", ko: "지금 플레이", "pt-BR": "Jogar", de: "Jetzt spielen" },
      type: {
        en: "Creative Coloring", "zh-Hant": "創意動物塗色", "zh-Hans": "创意动物涂色",
        es: "Colorear animales", ja: "どうぶつぬりえ", ko: "동물 색칠 놀이",
        "pt-BR": "Colorir animais", de: "Tierisches Ausmalen",
      },
      categories: ["Animal Games", "Education", "Family"],
      skills: ["Color Recognition", "Focus", "Hand-Eye Coordination"],
      ages: ["3", "family"],
      ageLabel: { en: "3+", "zh-Hant": "3+", "zh-Hans": "3+", es: "3+", ja: "3+", ko: "3+", "pt-BR": "3+", de: "3+" },
      href: "games/animal-coloring-studio/",
      description: {
        en: "Choose an animal page, fill or brush bounded regions, and save finished art to a local gallery.",
        "zh-Hant": "挑選動物圖畫，用填色或畫筆完成每個區域，並把作品保存在本機畫廊。",
        "zh-Hans": "挑选动物图画，用填色或画笔完成每个区域，并把作品保存在本机画廊。",
        es: "Elige un dibujo de animal, colorea sus zonas con relleno o pincel y guarda la obra en la galería local.",
        ja: "どうぶつの絵を選び、塗りつぶしやブラシで色を付け、完成作品を端末内のギャラリーに保存します。",
        ko: "동물 그림을 골라 채우기나 브러시로 색칠하고 완성한 작품을 기기의 갤러리에 저장하세요.",
        "pt-BR": "Escolha um desenho de animal, pinte as áreas com preenchimento ou pincel e salve a obra na galeria local.",
        de: "Wähle ein Tierbild, male abgegrenzte Flächen mit Füller oder Pinsel aus und speichere das Werk lokal.",
      },
      meta: {
        en: ["12 Animal Pages", "Fill & Brush", "Local Gallery"], "zh-Hant": ["12 張動物圖畫", "填色與畫筆", "本機畫廊"],
        "zh-Hans": ["12 张动物图画", "填色与画笔", "本机画廊"], es: ["12 dibujos", "Relleno y pincel", "Galería local"],
        ja: ["12 枚のどうぶつ", "塗りつぶしとブラシ", "端末内ギャラリー"], ko: ["동물 그림 12장", "채우기와 브러시", "기기 갤러리"],
        "pt-BR": ["12 desenhos", "Preencher e pincel", "Galeria local"], de: ["12 Tierbilder", "Füller und Pinsel", "Lokale Galerie"],
      },
      art: { kind: "image", background: "assets/animal-coloring-studio-cover.webp", hideHero: true },
    },
    {
      id: "animal-screw-workshop",
      title: {
        en: "Animal Screw Workshop", "zh-Hant": "動物螺絲工坊", "zh-Hans": "动物螺丝工坊",
        es: "Taller de Tornillos Animales", ja: "どうぶつネジ工房", ko: "동물 나사 공방",
        "pt-BR": "Oficina de Parafusos Animais", de: "Tierische Schraubenwerkstatt",
      },
      status: "playable",
      statusText: {
        en: "Playable", "zh-Hant": "可遊玩", "zh-Hans": "可游玩", es: "Jugable",
        ja: "プレイ可能", ko: "플레이 가능", "pt-BR": "Jogável", de: "Spielbar",
      },
      type: {
        en: "Screw Logic Puzzle", "zh-Hant": "螺絲邏輯解謎", "zh-Hans": "螺丝逻辑解谜",
        es: "Lógica de tornillos", ja: "ネジ論理パズル", ko: "나사 논리 퍼즐",
        "pt-BR": "Lógica de parafusos", de: "Schrauben-Logikrätsel",
      },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Logic", "Problem Solving", "Focus"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+", "zh-Hans": "9+", es: "9+", ja: "9+", ko: "9+", "pt-BR": "9+", de: "9+" },
      href: "games/animal-screw-workshop/",
      description: {
        en: "Move brass screws into open holes, release layered wooden animal plates, and restore 30 original forest-workshop puzzles.",
        "zh-Hant": "把黃銅螺絲移到空孔，拆解重疊的動物木板，完成 30 個原創森林工坊謎題。",
        "zh-Hans": "把黄铜螺丝移到空孔，拆解重叠的动物木板，完成 30 个原创森林工坊谜题。",
        es: "Mueve tornillos de latón, libera placas animales superpuestas y repara 30 rompecabezas originales.",
        ja: "真鍮のネジを空き穴へ移し、重なるどうぶつ木板を外して30の工房パズルを修復します。",
        ko: "황동 나사를 빈 구멍으로 옮기고 겹친 동물 나무판을 풀어 30개 공방 퍼즐을 복원하세요.",
        "pt-BR": "Mova parafusos de latão, solte placas animais sobrepostas e restaure 30 quebra-cabeças originais.",
        de: "Versetze Messingschrauben, löse überlappende Tierplatten und repariere 30 originale Werkstatträtsel.",
      },
      meta: {
        en: ["30 Puzzles", "Layered Plates", "Locked Screws"], "zh-Hant": ["30 關", "重疊木板", "鎖定螺絲"],
        "zh-Hans": ["30 关", "重叠木板", "锁定螺丝"], es: ["30 niveles", "Placas superpuestas", "Tornillos bloqueados"],
        ja: ["30 パズル", "重なる木板", "ロックネジ"], ko: ["퍼즐 30개", "겹친 나무판", "잠긴 나사"],
        "pt-BR": ["30 fases", "Placas sobrepostas", "Parafusos travados"], de: ["30 Rätsel", "Überlappende Platten", "Gesperrte Schrauben"],
      },
      art: { kind: "image", background: "assets/animal-screw-workshop-cover.webp", hideHero: true },
    },
    {
      id: "animal-parking-patrol",
      title: {
        en: "Animal Parking Patrol", "zh-Hant": "森林停車疏導隊", "zh-Hans": "森林停车疏导队",
        es: "Patrulla de Estacionamiento Animal", ja: "どうぶつ駐車パトロール", ko: "동물 주차 순찰대",
        "pt-BR": "Patrulha do Estacionamento Animal", de: "Tierische Parkplatz-Patrouille",
      },
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "立即遊玩", "zh-Hans": "立即游玩", es: "Jugar", ja: "今すぐ遊ぶ", ko: "지금 플레이", "pt-BR": "Jogar", de: "Jetzt spielen" },
      type: {
        en: "Traffic Order Puzzle", "zh-Hant": "交通順序解謎", "zh-Hans": "交通顺序解谜",
        es: "Lógica de tráfico", ja: "交通順序パズル", ko: "교통 순서 퍼즐",
        "pt-BR": "Lógica de trânsito", de: "Verkehrsreihenfolge-Rätsel",
      },
      categories: ["Animal Games", "Puzzle", "Family"],
      skills: ["Visual Planning", "Logic", "Focus"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+", "zh-Hans": "9+", es: "9+", ja: "9+", ko: "9+", "pt-BR": "9+", de: "9+" },
      href: "games/animal-parking-patrol/",
      description: {
        en: "Read four-way animal cart traffic, clear signals and convoys, and solve 30 original forest-plaza patrol routes.",
        "zh-Hant": "觀察四向動物木車，依序解除號誌與車隊阻擋，完成 30 條原創森林廣場巡邏路線。",
        "zh-Hans": "观察四向动物木车，依序解除信号与车队阻挡，完成 30 条原创森林广场巡逻路线。",
        es: "Lee el tráfico de carros animales, despeja señales y convoyes, y resuelve 30 rutas originales.",
        ja: "四方向のどうぶつ車を読み、信号と車列を解いて30の森のルートをクリアします。",
        ko: "사방 동물 자동차를 살피고 신호와 대열을 풀어 30개 숲 광장 경로를 해결하세요.",
        "pt-BR": "Leia o trânsito dos carrinhos, libere sinais e comboios e resolva 30 rotas originais.",
        de: "Lies den Tierwagenverkehr, löse Signale und Konvois und meistere 30 originale Waldplatz-Routen.",
      },
      meta: {
        en: ["30 Routes", "Four-Way Traffic", "Signal Convoys"], "zh-Hant": ["30 條路線", "四向車流", "號誌車隊"],
        "zh-Hans": ["30 条路线", "四向车流", "信号车队"], es: ["30 rutas", "Tráfico en 4 vías", "Señales y convoyes"],
        ja: ["30ルート", "四方向の交通", "信号と車列"], ko: ["30개 경로", "사방 교통", "신호와 대열"],
        "pt-BR": ["30 rotas", "Trânsito em 4 vias", "Sinais e comboios"], de: ["30 Routen", "Vier-Wege-Verkehr", "Signale und Konvois"],
      },
      art: { kind: "image", background: "assets/animal-parking-patrol-cover.webp", hideHero: true },
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
      status: "playable",
      statusText: { en: "Playable", "zh-Hant": "可遊玩" },
      type: { en: "Reading Word-Path Puzzle", "zh-Hant": "閱讀字詞路徑" },
      categories: ["Animal Games", "Education", "Puzzle"],
      skills: ["Reading", "Focus", "Logic"],
      ages: ["9", "family"],
      ageLabel: { en: "9+", "zh-Hant": "9+" },
      href: "games/animal-word-trails/",
      description: {
        en: "Follow animal clues, connect adjacent letters or characters, and complete bilingual word trails.",
        "zh-Hant": "跟著動物線索連接相鄰字母或文字，完成英語與繁體中文的字詞小徑。",
      },
      meta: { en: ["Bilingual Words", "Path Logic", "Animal Clues"], "zh-Hant": ["雙語字詞", "路徑邏輯", "動物線索"] },
      art: { kind: "image", background: "assets/animal-word-trails-cover.webp", hideHero: true },
    },
    {
      id: "animal-cratebound",
      title: { en: "Animal Cratebound", "zh-Hant": "動物方舟搬運隊", "zh-Hans": "动物方舟搬运队", ja: "アニマル・クレートバウンド", ko: "동물 상자 원정대", es: "Carga Animal", "pt-BR": "Carga Animal", fr: "Cargaison Animale", de: "Tierische Frachtwege", it: "Carico Animale", ru: "Звери: Грузовой ковчег", hi: "पशु संदूक यात्रा", ar: "رحلة صناديق الحيوانات" },
      status: "planned",
      statusText: { en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정", es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt", de: "Demnächst", it: "Prossimamente", ru: "Скоро", hi: "जल्द आ रहा है", ar: "قريبًا" },
      type: { en: "Push-Box Logistics Puzzle", "zh-Hant": "推箱物流解謎", "zh-Hans": "推箱物流解谜", ja: "倉庫物流パズル", ko: "상자 물류 퍼즐", es: "Puzle de logística", "pt-BR": "Quebra-cabeça logístico", fr: "Puzzle logistique", de: "Logistik-Schiebepuzzle", it: "Puzzle logistico", ru: "Логическая перевозка грузов", hi: "संदूक मार्ग पहेली", ar: "لغز نقل الصناديق" },
      categories: ["Animal Games", "Puzzle", "Strategy", "Featured"],
      skills: ["Logic", "Planning", "Problem Solving"],
      ages: ["13"],
      href: "games/animal-cratebound/",
      internalTrial: "index.html?trial=1",
      description: { en: "Walk, push, pull and route rune cargo through 30 authored sky-ark warehouses with ice rails, signals, magnets and linked crates.", "zh-Hant": "在 30 座手工設計的天空方舟倉庫中行走、推拉並運送符文貨箱，破解冰軌、號誌、磁力與連動貨箱。", "zh-Hans": "在 30 座手工设计的天空方舟仓库中行走、推拉并运送符文货箱，破解冰轨、信号、磁力与联动货箱。", ja: "30の手作り天空倉庫でルーン貨物を押し引きし、氷のレール、信号、磁石、連結箱を攻略します。", ko: "30개의 수제 하늘 창고에서 룬 화물을 밀고 당기며 얼음 레일, 신호, 자석, 연결 상자를 해결하세요.", es: "Empuja, atrae y guía cargamentos rúnicos por 30 almacenes celestes con hielo, señales, imanes y cajas enlazadas.", "pt-BR": "Empurre, puxe e conduza cargas rúnicas por 30 armazéns celestes com gelo, sinais, ímãs e caixas ligadas.", fr: "Poussez, tirez et acheminez des cargaisons runiques dans 30 entrepôts célestes avec glace, signaux, aimants et caisses liées.", de: "Schiebe, ziehe und leite Runenfracht durch 30 handgebaute Himmelslager mit Eisbahnen, Signalen, Magneten und Koppelkisten.", it: "Spingi, attira e instrada carichi runici in 30 magazzini celesti con ghiaccio, segnali, magneti e casse collegate.", ru: "Толкайте, тяните и направляйте рунические грузы через 30 небесных складов с ледяными рельсами, сигналами, магнитами и связанными ящиками.", hi: "30 हस्तनिर्मित आकाश-गोदामों में चलें, संदूक धकेलें और खींचें, तथा बर्फीली पटरियों, संकेतों और चुंबकों को सुलझाएँ।", ar: "تحرّك وادفع واسحب صناديق الرون عبر 30 مستودعًا سماويًا مصممًا يدويًا مع سكك جليدية وإشارات ومغناطيسات." },
      meta: { en: ["30 Warehouses", "Push and Pull", "Six Rule Chapters"], "zh-Hant": ["30 座倉庫", "推拉規劃", "六章機關"], "zh-Hans": ["30 座仓库", "推拉规划", "六章机关"], ja: ["30の倉庫", "押す・引く", "6章の仕掛け"], ko: ["30개 창고", "밀기와 당기기", "6개 규칙 장"], es: ["30 almacenes", "Empujar y atraer", "Seis capítulos"], "pt-BR": ["30 armazéns", "Empurrar e puxar", "Seis capítulos"], fr: ["30 entrepôts", "Pousser et tirer", "Six chapitres"], de: ["30 Lager", "Schieben und Ziehen", "Sechs Regelkapitel"], it: ["30 magazzini", "Spingi e attira", "Sei capitoli"], ru: ["30 складов", "Толкать и тянуть", "Шесть глав"], hi: ["30 गोदाम", "धकेलें और खींचें", "छह नियम अध्याय"], ar: ["30 مستودعًا", "دفع وسحب", "ستة فصول قواعد"] },
      art: { kind: "image", background: "assets/animal-cratebound/cover.webp", hideHero: true },
    },
    {
      id: "animal-mosaic-clues",
      title: { en: "Animal Mosaic Clues", "zh-Hant": "動物像素謎圖", "zh-Hans": "动物像素谜图", ja: "アニマル・モザイクロジック", ko: "동물 모자이크 단서", es: "Mosaicos Animales", "pt-BR": "Mosaicos Animais", fr: "Mosaïques Animales", de: "Tierische Mosaikrätsel", it: "Mosaici Animali", ru: "Звериные мозаики", hi: "पशु मोज़ेक संकेत", ar: "ألغاز فسيفساء الحيوانات" },
      status: "planned",
      statusText: { en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정", es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt", de: "Demnächst", it: "Prossimamente", ru: "Скоро", hi: "जल्द आ रहा है", ar: "قريبًا" },
      type: { en: "Nonogram Mosaic Logic", "zh-Hant": "數字像素邏輯", "zh-Hans": "数字像素逻辑", ja: "ノノグラム・モザイク", ko: "노노그램 모자이크", es: "Lógica de mosaicos", "pt-BR": "Lógica de mosaicos", fr: "Logique de mosaïque", de: "Nonogramm-Mosaik", it: "Logica a mosaico", ru: "Логическая мозаика", hi: "नोनोग्राम मोज़ेक", ar: "منطق الفسيفساء الرقمية" },
      categories: ["Animal Games", "Puzzle", "Strategy", "Featured"],
      skills: ["Logic", "Focus", "Deduction"],
      ages: ["13"],
      href: "games/animal-mosaic-clues/",
      internalTrial: "index.html?trial=1",
      description: { en: "Read row and column runs to reveal 30 unique animal mosaics, from guided 5×5 signs to deduction-rich 12×12 portraits.", "zh-Hant": "解讀橫列與直行數字，在 30 幅唯一解謎圖中，從 5×5 引導圖案進階到 12×12 動物肖像。", "zh-Hans": "解读横列与直行数字，在 30 幅唯一解谜图中，从 5×5 引导图案进阶到 12×12 动物肖像。", ja: "行と列の数字を読み、5×5の入門図から12×12の動物肖像まで、唯一解の30枚を完成させます。", ko: "행과 열 단서를 읽고 5×5 안내 퍼즐부터 12×12 동물 초상까지 유일해 30개를 완성하세요.", es: "Lee las pistas de filas y columnas y revela 30 mosaicos únicos, desde cuadrículas 5×5 hasta retratos 12×12.", "pt-BR": "Leia as pistas de linhas e colunas e revele 30 mosaicos únicos, de grades 5×5 a retratos 12×12.", fr: "Lisez les indices des lignes et colonnes pour révéler 30 mosaïques uniques, des grilles 5×5 aux portraits 12×12.", de: "Lies Zeilen- und Spaltenhinweise und enthülle 30 eindeutig lösbare Tiermosaike von 5×5 bis 12×12.", it: "Leggi gli indizi di righe e colonne e svela 30 mosaici unici, dalle griglie 5×5 ai ritratti 12×12.", ru: "Читайте подсказки строк и столбцов и открывайте 30 мозаик с единственным решением — от 5×5 до 12×12.", hi: "पंक्ति और स्तंभ संकेत पढ़कर 30 अनोखे पशु मोज़ेक खोलें—5×5 अभ्यास से 12×12 चित्रों तक।", ar: "اقرأ إشارات الصفوف والأعمدة لكشف 30 فسيفساء حيوانية فريدة، من شبكات 5×5 إلى صور 12×12." },
      meta: { en: ["30 Unique Puzzles", "No Guessing", "5×5 to 12×12"], "zh-Hant": ["30 幅唯一解", "無需猜測", "5×5 至 12×12"], "zh-Hans": ["30 幅唯一解", "无需猜测", "5×5 至 12×12"], ja: ["唯一解30問", "推測不要", "5×5から12×12"], ko: ["유일해 30개", "추측 불필요", "5×5에서 12×12"], es: ["30 puzles únicos", "Sin adivinar", "De 5×5 a 12×12"], "pt-BR": ["30 puzzles únicos", "Sem adivinhação", "De 5×5 a 12×12"], fr: ["30 grilles uniques", "Sans deviner", "De 5×5 à 12×12"], de: ["30 eindeutige Rätsel", "Ohne Raten", "5×5 bis 12×12"], it: ["30 puzzle unici", "Senza tentativi", "Da 5×5 a 12×12"], ru: ["30 уникальных задач", "Без угадывания", "От 5×5 до 12×12"], hi: ["30 अनोखी पहेलियाँ", "बिना अनुमान", "5×5 से 12×12"], ar: ["30 لغزًا فريدًا", "من دون تخمين", "من 5×5 إلى 12×12"] },
      art: { kind: "image", background: "assets/animal-mosaic-clues/cover.webp", hideHero: true },
    },
    {
      id: "animal-prism-breakers",
      title: { en: "Animal Prism Breakers", "zh-Hant": "動物稜光破磚隊", "zh-Hans": "动物棱光破砖队", ja: "アニマル・プリズムブレイカーズ", ko: "동물 프리즘 브레이커", es: "Rompeprismas Animales", "pt-BR": "Quebra-Prismas Animais", fr: "Brise-Prismes Animaux", de: "Tierische Prismabrecher", it: "Spaccaprismi Animali", ru: "Звери: Разрушители призм", hi: "पशु प्रिज़्म ब्रेकर", ar: "محطمو موشور الحيوانات" },
      status: "planned",
      statusText: { en: "Coming Soon", "zh-Hant": "敬請期待", "zh-Hans": "敬请期待", ja: "近日公開", ko: "출시 예정", es: "Próximamente", "pt-BR": "Em breve", fr: "Bientôt", de: "Demnächst", it: "Prossimamente", ru: "Скоро", hi: "जल्द आ रहा है", ar: "قريبًا" },
      type: { en: "Prism Brick-Breaker Arcade", "zh-Hant": "稜光反彈破磚", "zh-Hans": "棱光反弹破砖", ja: "プリズム・ブロック崩し", ko: "프리즘 벽돌깨기", es: "Arcade rompebloques", "pt-BR": "Arcade quebra-blocos", fr: "Casse-briques prismatique", de: "Prisma-Breakout", it: "Rompiblocchi prismatico", ru: "Призматический арканоид", hi: "प्रिज़्म ईंट-तोड़ आर्केड", ar: "آركيد تحطيم الطوب الموشوري" },
      categories: ["Animal Games", "Arcade", "Action", "Featured"],
      skills: ["Timing", "Spatial Control", "Reaction"],
      ages: ["13"],
      href: "games/animal-prism-breakers/",
      internalTrial: "index.html?trial=1",
      description: { en: "Control the return angle, catch prism powers and shatter 30 authored crystal formations with moving bands, mirrors and gravity wells.", "zh-Hant": "掌握反彈角度、接住稜光能力，擊破 30 組手工設計的水晶陣形，挑戰移動磚帶、反射鏡與重力井。", "zh-Hans": "掌握反弹角度、接住棱光能力，击破 30 组手工设计的水晶阵形，挑战移动砖带、反射镜与重力井。", ja: "反射角を操り、プリズム能力を拾い、移動列、鏡、重力井を備えた30の水晶陣形を砕きます。", ko: "반사 각도를 조절하고 프리즘 능력을 받아 이동 띠, 거울, 중력 우물이 있는 30개 수정 진형을 깨뜨리세요.", es: "Controla el ángulo, recoge poderes prismáticos y rompe 30 formaciones con bandas móviles, espejos y pozos gravitatorios.", "pt-BR": "Controle o ângulo, pegue poderes prismáticos e quebre 30 formações com faixas móveis, espelhos e poços gravitacionais.", fr: "Maîtrisez l'angle, récupérez les pouvoirs prismatiques et brisez 30 formations avec rangées mobiles, miroirs et puits gravitationnels.", de: "Steuere den Rückprallwinkel, fange Prismakräfte und zerbrich 30 Formationen mit beweglichen Reihen, Spiegeln und Gravitationsfeldern.", it: "Controlla l'angolo, raccogli i poteri prismatici e infrangi 30 formazioni con file mobili, specchi e pozzi gravitazionali.", ru: "Управляйте углом отскока, ловите силы призм и разбивайте 30 построений с движущимися рядами, зеркалами и гравитационными колодцами.", hi: "वापसी कोण नियंत्रित करें, प्रिज़्म शक्तियाँ पकड़ें और गतिशील पट्टियों, दर्पणों व गुरुत्व कुओं वाली 30 संरचनाएँ तोड़ें।", ar: "تحكم بزاوية الارتداد والتقط قوى الموشور وحطم 30 تشكيلًا بلوريًا مع صفوف متحركة ومرايا وآبار جاذبية." },
      meta: { en: ["30 Formations", "Angle Control", "Six Arcade Chapters"], "zh-Hant": ["30 組陣形", "角度操控", "六章街機變化"], "zh-Hans": ["30 组阵形", "角度操控", "六章街机变化"], ja: ["30の陣形", "角度操作", "6章のアーケード"], ko: ["30개 진형", "각도 조절", "6개 아케이드 장"], es: ["30 formaciones", "Control de ángulo", "Seis capítulos"], "pt-BR": ["30 formações", "Controle de ângulo", "Seis capítulos"], fr: ["30 formations", "Contrôle de l'angle", "Six chapitres"], de: ["30 Formationen", "Winkelkontrolle", "Sechs Arcade-Kapitel"], it: ["30 formazioni", "Controllo dell'angolo", "Sei capitoli"], ru: ["30 построений", "Контроль угла", "Шесть глав"], hi: ["30 संरचनाएँ", "कोण नियंत्रण", "छह आर्केड अध्याय"], ar: ["30 تشكيلًا", "تحكم بالزاوية", "ستة فصول آركيد"] },
      art: { kind: "image", background: "assets/animal-prism-breakers/cover.webp", hideHero: true },
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
  previewVideo: "assets/previews/animal-reef-fisher-battle.webm",
  title: { en: "Animal Reef Fisher", "zh-Hant": "動物珊瑚釣手" },
  status: "playable",
  statusText: { en: "Playable", "zh-Hant": "可遊玩" },
  type: { en: "Fishing Collection Sim", "zh-Hant": "釣魚收集模擬" },
  categories: ["Featured", "Animal Games", "Arcade"],
  skills: ["Focus", "Reaction", "Problem Solving"],
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
  previewVideo: "assets/previews/animal-hero-trials-battle.webm",
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
  previewVideo: "assets/previews/animal-gearpack-expedition-battle.webm",
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
  previewVideo: "assets/previews/animal-moonlight-heist-battle.webm",
  title: { en: "Animal Moonlight Heist", "zh-Hant": "動物月影潛行隊" },
  status: "playable",
  statusText: { en: "Playable", "zh-Hant": "可遊玩" },
  type: { en: "Stealth Extraction Adventure", "zh-Hant": "潛行撤離冒險" },
  categories: ["Featured", "Animal Games", "Arcade"],
  skills: ["Logic", "Focus", "Problem Solving"],
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

// Animal Rune Reels V3 internal-trial copy. The card remains planned.
const animalRuneReelsV3 = window.WONDER_LOBBY.games.find((game) => game.id === "animal-rune-reels");
if (animalRuneReelsV3) {
  animalRuneReelsV3.description = {
    en: "Build a summoned animal team, spin ten kinds of downward-moving runes, complete doubled lines, and unleash separate pet attacks while shared defense and healing protect the summoner.",
    "zh-Hant": "組成召喚動物隊伍，轉動十種向下滾動的符石；完成連線讓效果加倍，寵物各自攻擊，全隊防禦與治療共同保護召喚師。",
    "zh-Hans": "组成召唤动物队伍，转动十种向下滚动的符石；完成连线让效果加倍，宠物各自攻击，全队防御与治疗共同保护召唤师。",
    ja: "召喚した動物チームを編成し、下へ回る10種類のルーンでラインを完成。各ペットが個別に攻撃し、合計防御と回復で召喚師を守ります。",
    ko: "소환 동물 팀을 꾸리고 아래로 도는 10종 룬의 라인을 완성하세요. 각 펫은 따로 공격하고, 팀 방어와 치유 합계가 소환사를 지킵니다.",
    es: "Forma un equipo animal invocado, gira diez runas hacia abajo, duplica líneas y lanza ataques separados mientras la defensa y curación totales protegen al invocador.",
    "pt-BR": "Monte uma equipe animal invocada, gire dez runas para baixo, dobre linhas e ataque com cada mascote enquanto defesa e cura totais protegem o invocador.",
    fr: "Formez une équipe animale invoquée, faites défiler dix runes vers le bas, doublez les lignes et attaquez avec chaque familier tandis que défense et soin protègent l'invocateur.",
    de: "Stelle ein beschworenes Tierteam zusammen, drehe zehn Runen nach unten, verdopple Linien und greife mit jedem Begleiter an, während Gesamtverteidigung und Heilung den Beschwörer schützen.",
    it: "Crea una squadra animale evocata, gira dieci rune verso il basso, raddoppia le linee e attacca con ogni compagno mentre difesa e cura totali proteggono l'evocatore.",
    ru: "Соберите отряд призванных зверей, вращайте вниз десять видов рун, удваивайте линии и атакуйте каждым питомцем, пока общая защита и лечение берегут призывателя.",
    hi: "बुलाए गए पशु दल को बनाएँ, नीचे घूमने वाले दस रून मिलाएँ और लाइन का प्रभाव दुगुना करें। हर साथी अलग वार करता है, जबकि कुल रक्षा और उपचार आह्वानकर्ता को बचाते हैं।",
    ar: "كوّن فريق حيوانات مستدعى وأدر عشرة أنواع من الرون إلى الأسفل. تضاعف الخطوط المكتملة التأثير، ويهاجم كل رفيق منفردًا بينما تحمي الدفاعات والشفاء المجمعة المستدعي.",
  };
  animalRuneReelsV3.meta = {
    en: ["10 Rune Types", "Collectible Team", "Downward Auto Reels"], "zh-Hant": ["10 種符石", "角色召喚隊伍", "向下自動轉輪"], "zh-Hans": ["10 种符石", "角色召唤队伍", "向下自动转轮"],
    ja: ["10種類のルーン", "収集チーム", "下向きオートリール"], ko: ["룬 10종", "수집형 팀", "하향 자동 릴"], es: ["10 tipos de runa", "Equipo coleccionable", "Rodillos automáticos"],
    "pt-BR": ["10 tipos de runa", "Equipe colecionável", "Carretéis automáticos"], fr: ["10 types de rune", "Équipe à collectionner", "Rouleaux automatiques"], de: ["10 Runenarten", "Sammelteam", "Automatische Walzen"],
    it: ["10 tipi di runa", "Squadra collezionabile", "Rulli automatici"], ru: ["10 видов рун", "Коллекционный отряд", "Автовращение вниз"], hi: ["10 रून प्रकार", "संग्रह योग्य दल", "नीचे ऑटो रील"], ar: ["10 أنواع رون", "فريق قابل للجمع", "بكرات تلقائية للأسفل"],
  };
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

for (const id of ["animal-color-springs", "animal-word-trails"]) {
  const game = window.WONDER_LOBBY.games.find((entry) => entry.id === id);
  if (!game) continue;
  game.status = "playable";
  game.statusText = {
    en: "Playable", "zh-Hant": "立即遊玩", "zh-Hans": "立即游玩", ja: "プレイ可能", ko: "플레이 가능",
    es: "Jugable", "pt-BR": "Jogável", fr: "Jouable", de: "Spielbar", it: "Giocabile", ru: "Доступно",
  };
  delete game.internalTrial;
}

window.WONDER_LOBBY.platform.tagline["zh-Hans"] = "畅玩适合各年龄层的原创动物游戏。";
window.WONDER_LOBBY.platform.subtitle["zh-Hans"] = "一个持续成长的动物网页游戏世界，适合儿童、家庭与休闲玩家。";

const verifiedSimplifiedLobbyCopy = {
  "wonder-crash": ["幻想狮王防线", "动物防守", "操控爆鬃雷欧完成 30 场精心设计的防守，面对四种阵型、八类野兽与六种不同的 Boss 攻击。", ["四种阵型", "六个 Boss", "30 关"]],
  "color-lunchbox": ["动物彩色便当", "颜色配对", "在 30 个图像引导的便当挑战中，每关分类五种食物，并完成六次友善的守护者检查。", ["图像配对", "30 关", "六位守护者"]],
  "bubble-bakery": ["动物泡泡烘焙坊", "泡泡益智", "规划相连的动物泡泡消除，完成 30 个配方谜题、多托盘订单与友善的 Panko 检查点。", ["30 关", "配方规则", "Panko 检查"]],
  "animal-rope-rescue": ["动物藤蔓救援", "物理益智", "引导水果通过 30 场物理救援，处理移动篮子、多层风向、双重反弹与 Panko 检查点。", ["30 关", "物理路线", "Panko 检查"]],
  "animal-zoo-idle": ["动物园经营", "动物园经营", "通过 30 个保存进度的挑战建立友善动物园，安排照护选择、栖地、设施与六次园区评审。", ["30 个挑战", "园区照护", "六次评审"]],
  "star-memory": ["动物星光记忆", "记忆益智", "在 30 个保存进度的关卡中修复动物星图，掌握预览、月光洗牌、顺序配对与星座旋转。", ["30 关", "记忆规则", "六次守护者检查"]],
  "campus-dash": ["动物草原冲刺", "反应跑酷", "完成 30 条草原路线，挑战星光路径、双车道门、黏性泥地、五种目标与六次守护者检查。", ["30 条路线", "五类规则", "六次守护者检查"]],
  "snack-blocks": ["动物零食方块", "消除益智", "规划 30 个保存进度的关卡，完成得分、收集、配对、连锁、大型消除与双重检查点目标。", ["30 关", "六类目标", "六个检查点"]],
  "fruit-merge": ["动物合成塔", "得分益智", "完成 30 个物理合成挑战，处理狭窄瞄准、河风、重力、固定队列与六个庆典检查点。", ["30 个挑战", "五种物理规则", "六个检查点"]],
  "garden-tiles": ["宠物花园方块", "轻松配对", "完成 30 个无计时记忆挑战，面对预览、薄雾、移动卡片与六个花园检查点。", ["30 个挑战", "四种记忆规则", "无计时"]],
  "animal-rescue": ["动物回家路", "动物益智", "引导动物走过 30 条路线，收集水果并处理泥地、钥匙、闸门、脆弱路径与六个救援检查点。", ["30 条路线", "四种路线规则", "无计时"]],
  "animal-hidden-safari": ["动物寻踪之旅", "寻找物品", "搜索 30 个栖地，处理顺序目标、动物配对、伪装、访客、移动巡逻与六个检查点。", ["30 个栖地", "六种搜索规则", "无计时失败"]],
  "animal-guard-yard": ["动物守护庭院", "路线防守", "用动物守卫保卫 30 个花园关卡，识别特殊野兽、保存训练进度，并迎战六个不同的 Boss。", ["英雄防守", "动物升级", "Boss 战"]],
  "animal-crystal-survivor": ["动物水晶生存者", "动作生存", "巡逻 30 条三分钟水晶林路线，收集每关钥匙、选择升级、判断变化中的危险，并击败六个原创动物 Boss。", ["30 关", "6 个 Boss", "自动战斗"]],
  "animal-quiz": ["动物问答", "动物知识问答", "通过图片、栖地、特征、行为、食物、神秘图像与剪影线索，完成 30 场动物调查。", ["30 关", "6 个章节", "动物知识"]],
  "zoo-helper-day": ["动物园帮手日", "动物园工作模拟", "完成 30 个温和的动物园班次，使用图像工具、照护分类、记忆请求与有顺序的工作流程。", ["30 个班次", "6 次饲养员检查", "图像照护"]],
  "shape-train": ["动物形状列车", "形状益智", "帮助六位形状朋友登车，完成 30 条含轮廓、移动、记忆与登车证规则的路线。", ["30 条路线", "6 次检查", "形状记忆"]],
  "tiny-weather-rescue": ["动物帮手任务", "工具选择益智", "使用图像工具、成对线索、记忆需求与变化托盘，解决 30 个动物求助任务。", ["30 个任务", "6 次帮手检查", "场景线索"]],
  "beast-deck": ["兽王牌组：迷雾森林", "Roguelike 牌组构筑", "在 30 个任务中构筑动物力量牌组，破解十种区域机制并击败六个会改变阶段的森林 Boss。", ["30 个任务", "卡牌组合", "六个 Boss"]],
  "animal-relic-hunters": ["动物遗物猎人", "房间动作 Roguelite", "完成 30 次三房间远征，掌握十种特殊威胁行为，收集遗物装备并击败六位会改变阶段的守护者。", ["30 次远征", "十种威胁规则", "六位守护者"]],
  "animal-rune-tactics": ["动物符文战术", "回合制小队战术", "指挥三位动物英雄完成 30 个符文格任务，处理七种地形、特殊敌人、永久成长与六个多阶段 Boss。", ["30 个任务", "七种地形规则", "六个 Boss"]],
  "animal-orb-fortress": ["动物星珠要塞", "弹射 Roguelite", "在 30 条路线中规划墙面与镜像柱的反弹射击，破解五种特殊敌人规则并击败六个独特要塞 Boss。", ["30 条路线", "镜像柱", "六个 Boss"]],
  "animal-auto-squad": ["动物自走小队", "自动战斗", "训练并布置十位动物英雄，完成六个区域的 30 个五波关卡与六场独特 Boss 战。", ["阵型策略", "30 关", "六个 Boss"]],
  "beast-tactician": ["野兽守护者", "英雄塔防", "改变敌人路线并指挥动物士兵与 WeightPlay 英雄，完成 30 关、六个区域与六场不同的 Boss 战。", ["塔防", "30 关", "六个 Boss"]],
  "shadow-wolf": ["影狼传说", "2D 动作平台 RPG", "掌握 30 个平台动作关卡，破解特殊暗影兽，培养四项属性并击败六个不同区域 Boss。", ["30 关", "特殊敌人", "六个 Boss"]],
  "animal-bubble-safari": ["动物泡泡探险", "瞄准射击泡泡益智", "瞄准通过 30 个救援关卡，处理会反应的障碍、风、移动行与四种能力泡泡。", ["30 关", "6 次探险检查", "反弹与能力射击"]],
  "animal-habitat-mahjong": ["动物栖地麻将消消", "麻将接龙益智", "清除 30 个分层动物牌面，处理路线封印、家族救援、交替巡逻路线与六次栖地终章。", ["30 个牌面", "路线封印", "家族救援"]],
  "animal-reef-fisher": ["动物珊瑚礁钓手", "钓鱼张力任务", "完成 30 个珊瑚礁任务，适应六种海况，记录 12 个物种，升级六种工具并钓起六条守护者鱼。", ["30 个任务", "六种海况规则", "六位守护者"]],
  "animal-cafe-rush": ["动物咖啡馆冲刺", "动物咖啡馆时间管理", "经营 30 个咖啡馆营业日，处理图像订单、编号配方、VIP 优先级、交替桌位与六次咖啡馆评审。", ["30 个营业日", "六个规则章节", "保存升级"]],
  "animal-hero-trials": ["动物英雄试炼", "英雄动作 Roguelite", "从四位英雄中选择一位，完成 30 个三房间试炼，面对五类敌人、保存精通成长并击败六个不同 Boss。", ["30 个试炼", "六种 Boss 对策", "保存精通"]],
  "animal-gearpack-expedition": ["动物行囊远征", "空间行囊 Roguelite", "整理鲁克斯的 11×7 装备背包，破解特殊敌人并完成 30 关与六位不同守护者。", ["30 次远征", "背包联动", "六位守护者"]],
  "animal-moonlight-heist": ["动物月光盗宝", "潜行撤离冒险", "规划 30 个月光档案馆任务的路线，掌握阴影、镜像、发条、铃声、封印与聚光灯规则，并智胜六位守护者。", ["30 个任务", "六种潜行规则", "六位守护者"]],
};

for (const game of window.WONDER_LOBBY.games) {
  const simplified = verifiedSimplifiedLobbyCopy[game.id];
  if (!simplified) continue;
  const [title, type, description, meta] = simplified;
  game.title["zh-Hans"] = title;
  game.statusText["zh-Hans"] = "可玩";
  game.type["zh-Hans"] = type;
  game.description["zh-Hans"] = description;
  game.meta["zh-Hans"] = meta;
}

const animalFrontierDominion = window.WONDER_LOBBY.games.find((game) => game.id === "animal-frontier-dominion");
if (animalFrontierDominion) {
  Object.assign(animalFrontierDominion.title, {
    "zh-Hans": "\u52a8\u7269\u8fb9\u5883\u9886\u4e3b", ja: "\u30a2\u30cb\u30de\u30eb\u30fb\u30d5\u30ed\u30f3\u30c6\u30a3\u30a2\u30fb\u30c9\u30df\u30cb\u30aa\u30f3", ko: "\ub3d9\ubb3c \ud504\ub860\ud2f0\uc5b4 \ub3c4\ubbf8\ub2c8\uc5b8",
    es: "Dominio de la Frontera Animal", "pt-BR": "Dom\u00ednio da Fronteira Animal", fr: "Dominion de la Fronti\u00e8re Animale", de: "Tierisches Grenzland", it: "Dominio della Frontiera Animale", ru: "\u0417\u0432\u0435\u0440\u0438\u043d\u044b\u0435 \u0432\u043b\u0430\u0434\u0435\u043d\u0438\u044f",
  });
  Object.assign(animalFrontierDominion.statusText, {
    "zh-Hans": "\u656c\u8bf7\u671f\u5f85", ja: "\u8fd1\u65e5\u516c\u958b", ko: "\uacf5\uac1c \uc608\uc815", es: "Pr\u00f3ximamente", "pt-BR": "Em breve", fr: "Bient\u00f4t disponible", de: "Demn\u00e4chst", it: "Prossimamente", ru: "\u0421\u043a\u043e\u0440\u043e",
  });
  Object.assign(animalFrontierDominion.type, {
    "zh-Hans": "4X-Lite \u9886\u5730\u7b56\u7565", ja: "4X\u30e9\u30a4\u30c8\u9818\u5730\u6226\u7565", ko: "4X \ub77c\uc774\ud2b8 \uc601\ud1a0 \uc804\ub7b5", es: "Estrategia territorial 4X ligera", "pt-BR": "Estrat\u00e9gia territorial 4X leve", fr: "Strat\u00e9gie territoriale 4X l\u00e9g\u00e8re", de: "Leichte 4X-Gebietsstrategie", it: "Strategia territoriale 4X leggera", ru: "\u041e\u0431\u043b\u0435\u0433\u0447\u0451\u043d\u043d\u0430\u044f 4X-\u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044f",
  });
  Object.assign(animalFrontierDominion.description, {
    "zh-Hans": "\u4fa6\u5bdf\u8fb9\u5883\u7684\u9690\u85cf\u89c4\u5219\uff0c\u7528\u9635\u578b\u514b\u5236\u5bf9\u624b\uff0c\u5728 30 \u4e2a\u624b\u5de5\u533a\u57df\u4e2d\u5efa\u7acb\u901a\u5f80\u6c34\u6676\u8981\u585e\u7684\u9886\u5730\u94fe\u3002",
    ja: "\u8fba\u5883\u306e\u96a0\u3055\u308c\u305f\u30eb\u30fc\u30eb\u3092\u5075\u5bdf\u3057\u3001\u9663\u5f62\u3067\u5b88\u5099\u968a\u3092\u514b\u5236\u3057\u300130\u306e\u624b\u4f5c\u308a\u5730\u57df\u3067\u30af\u30ea\u30b9\u30bf\u30eb\u8981\u585e\u3078\u306e\u9818\u5730\u7dda\u3092\u7bc9\u304d\u307e\u3059\u3002",
    ko: "\uc228\uaca8\uc9c4 \ubcc0\uacbd \uaddc\uce59\uc744 \uc815\ucc30\ud558\uace0 \uc9c4\ud615\uc73c\ub85c \uc218\ube44\ub300\ub97c \uc0c1\ub300\ud558\uba70, 30\uac1c \uc218\uc81c \uc9c0\uc5ed\uc5d0\uc11c \uc218\uc815 \uc694\uc0c8\uae4c\uc9c0 \uc601\ud1a0\ub97c \uc5f0\uacb0\ud558\uc138\uc694.",
    es: "Explora reglas ocultas, contrarresta formaciones rivales y conecta territorios con la Ciudadela de Cristal en 30 regiones dise\u00f1adas a mano.",
    "pt-BR": "Revele regras ocultas, neutralize forma\u00e7\u00f5es rivais e conecte territ\u00f3rios \u00e0 Cidadela de Cristal em 30 regi\u00f5es criadas \u00e0 m\u00e3o.",
    fr: "Rep\u00e9rez les r\u00e8gles cach\u00e9es, contrecarrez les formations adverses et reliez vos territoires \u00e0 la Citadelle de cristal dans 30 r\u00e9gions con\u00e7ues \u00e0 la main.",
    de: "Erkunde verborgene Grenzregeln, kontere gegnerische Formationen und verbinde in 30 handgefertigten Regionen deine Gebiete mit der Kristallzitadelle.",
    it: "Scopri le regole nascoste, contrasta le formazioni rivali e collega i territori alla Cittadella di Cristallo in 30 regioni create a mano.",
    ru: "\u0420\u0430\u0437\u0432\u0435\u0434\u044b\u0432\u0430\u0439\u0442\u0435 \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u044f, \u043f\u043e\u0434\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u0441\u0442\u0440\u043e\u0439 \u043f\u0440\u043e\u0442\u0438\u0432 \u0432\u0440\u0430\u0433\u0430 \u0438 \u0441\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u0435 \u0437\u0435\u043c\u043b\u0438 \u0441 \u041a\u0440\u0438\u0441\u0442\u0430\u043b\u044c\u043d\u043e\u0439 \u0446\u0438\u0442\u0430\u0434\u0435\u043b\u044c\u044e \u0432 30 \u0440\u0435\u0433\u0438\u043e\u043d\u0430\u0445.",
  });
  Object.assign(animalFrontierDominion.meta, {
    "zh-Hans": ["30 \u4e2a\u533a\u57df", "\u4fa6\u5bdf\u4e0e\u6269\u5f20", "\u9635\u578b\u514b\u5236"], ja: ["30\u5730\u57df", "\u5075\u5bdf\u3068\u62e1\u5f35", "\u9663\u5f62\u30ab\u30a6\u30f3\u30bf\u30fc"], ko: ["30\uac1c \uc9c0\uc5ed", "\uc815\ucc30\uacfc \ud655\uc7a5", "\uc9c4\ud615 \uc0c1\uc131"],
    es: ["30 regiones", "Explorar y expandir", "Contraformaciones"], "pt-BR": ["30 regi\u00f5es", "Explorar e expandir", "Contraform\u00e7\u00f5es"], fr: ["30 r\u00e9gions", "Explorer et s'\u00e9tendre", "Contre-formations"], de: ["30 Regionen", "Erkunden und erweitern", "Formationen kontern"], it: ["30 regioni", "Esplora ed espandi", "Contro-formazioni"], ru: ["30 \u0440\u0435\u0433\u0438\u043e\u043d\u043e\u0432", "\u0420\u0430\u0437\u0432\u0435\u0434\u043a\u0430 \u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435", "\u041a\u043e\u043d\u0442\u0440\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438"],
  });
}

const animalHeroTrialsPublicCopy = window.WONDER_LOBBY.games.find((game) => game.id === "animal-hero-trials");
if (animalHeroTrialsPublicCopy) {
  animalHeroTrialsPublicCopy.title = { en:"Animal Hero Trials", "zh-Hant":"動物英雄試煉", "zh-Hans":"动物英雄试炼" };
  animalHeroTrialsPublicCopy.statusText = { en:"Play Now", "zh-Hant":"立即遊玩", "zh-Hans":"立即游玩" };
  animalHeroTrialsPublicCopy.type = { en:"Hero Action Roguelite", "zh-Hant":"英雄動作 Roguelite", "zh-Hans":"英雄动作 Roguelite" };
  animalHeroTrialsPublicCopy.description = { en:"Choose one of four heroes for 30 three-room trials with five enemy families, saved mastery, and six distinct Bosses.", "zh-Hant":"選擇四位英雄之一，挑戰 30 個三房間試煉、五種敵人、永久精通與六個不同 Boss。", "zh-Hans":"从四位英雄中选择一位，完成 30 个三房间试炼，面对五类敌人、保存精通成长并击败六个不同 Boss。" };
  animalHeroTrialsPublicCopy.meta = { en:["30 Trials","Six Boss Counters","Saved Mastery"], "zh-Hant":["30 個試煉","六種 Boss 反制","存檔精通"], "zh-Hans":["30 个试炼","六种 Boss 对策","保存精通"] };
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
