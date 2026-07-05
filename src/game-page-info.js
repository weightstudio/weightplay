(function () {
  const games = {
    "wonder-crash": {
      title: "Fantasy Lion Defense",
      age: "5+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      intro:
        "Fantasy Lion Defense is a mobile-friendly animal defense game where players move a brave lion hero, launch playful magic-supply weapons, and protect a fantasy wall from fierce wild beasts. The game uses short stages, weapon cooldowns, upgrades, boss beasts, and clear win or retry moments so players can practice timing and attention in a playful fantasy setting. It is designed as a fun action game first, with progress tracking and upgrades that make each session feel meaningful without creating pressure.",
      how: ["Move the lion hero left and right.", "Weapons fire automatically when their cooldowns finish.", "Defeat each wave of wild beasts before the wall is destroyed.", "Use coins and diamonds to improve long-term power."],
      parent:
        "This game is designed for short action practice sessions. It may help children practice reaction, focus, and hand-eye coordination through simple movement and timing. Scores and progress are for fun and local progress tracking only.",
      faq: [
        ["Is Fantasy Lion Defense free to play?", "Yes. Fantasy Lion Defense runs in the browser on WeightPlay."],
        ["What age is Fantasy Lion Defense for?", "It is recommended for age 5+ because it uses timing, upgrades, and simple action choices."],
        ["Does this game measure ability?", "No. It is a game for fun practice and local progress tracking, not a test or diagnosis."],
      ],
    },
    "color-lunchbox": {
      title: "Animal Color Lunchbox",
      age: "3+",
      difficulty: "Easy",
      time: "1-3 minutes",
      skills: ["Color Recognition", "Focus", "Hand-Eye Coordination"],
      intro:
        "Animal Color Lunchbox is a gentle preschool matching game where children place foods into lunchboxes by color. Each stage uses a small set of clear objects and a simple drag or tap interaction. The goal is to make color practice feel like play, with short rounds that parents can understand quickly and children can retry without pressure.",
      how: ["Look at the food item.", "Find the lunchbox with the matching color.", "Drag or tap the item into the correct lunchbox.", "Finish the stage to unlock the next theme."],
      parent:
        "This game may help children practice color recognition, focus, and hand-eye coordination. It is meant for short, relaxed sessions and does not evaluate a child's development.",
      faq: [
        ["Can young children play without reading?", "Yes. The first stages rely mostly on colors and pictures."],
        ["What does this game practice?", "It practices color recognition, attention, and simple matching."],
        ["Are scores formal assessments?", "No. Scores are only for fun and progress tracking."],
      ],
    },
    "bubble-bakery": {
      title: "Bubble Bakery",
      age: "5+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Bubble Bakery is a cozy puzzle game about tapping matching bubbles to complete bakery orders. Players look for useful groups, manage limited moves, and clear stage goals. The game is simple to start but encourages children and families to think ahead before tapping.",
      how: ["Check the bakery order goal.", "Tap groups of matching bubbles.", "Use each move carefully.", "Clear the order before moves run out."],
      parent:
        "This game may help children practice logic, planning, and focus through short puzzle goals. It is for fun practice and not a formal learning assessment.",
      faq: [
        ["Is Bubble Bakery timed?", "No. The challenge comes from move planning, not speed."],
        ["What skills does it practice?", "It can practice logic, problem solving, and focus."],
        ["Can families play together?", "Yes. It is designed to be easy to discuss and replay."],
      ],
    },
    "animal-rope-rescue": {
      title: "Animal Vine Rescue",
      age: "5+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Hand-Eye Coordination", "Problem Solving", "Focus"],
      intro:
        "Animal Vine Rescue is a short animal physics puzzle where players cut vines, move a leaf trampoline, and bounce fruit into the animal basket. The game is designed to be understandable quickly while still giving players real control through timing and position. Each stage changes the fruit start, target animal, wind, and gravity so it feels more like a playable rescue challenge than a one-click animation.",
      how: ["Drag the leaf trampoline left and right.", "Tap Cut to release the fruit from the vine.", "Bounce the fruit toward the animal basket.", "Clear stages to unlock harder rescue routes."],
      parent:
        "This game may help children practice timing, focus, hand-eye coordination, and simple problem solving. Scores and stars are for fun progress tracking only, not a formal test or diagnosis.",
      faq: [
        ["Is Animal Vine Rescue free?", "Yes. It runs in the browser on WeightPlay."],
        ["What does this game practice?", "It can practice timing, focus, hand-eye coordination, and problem solving through playful physics."],
        ["Does it copy another game?", "No. It uses an original animal rescue theme, custom stage goals, and WeightPlay art direction."],
      ],
    },
    "animal-zoo-idle": {
      title: "Animal Zoo Idle",
      age: "5+",
      difficulty: "Easy",
      time: "3-8 minutes",
      skills: ["Logic", "Focus", "Animal Knowledge"],
      intro:
        "Animal Zoo Idle is a gentle zoo growth game where visitors walk in, buy tickets, and leave coins in the ticket box while animals play around the park. Players care for animals, collect ticket income, upgrade the zoo gate, and recruit more animals such as giraffes, elephants, pandas, and penguins. As the gate improves and more animals join, the park becomes livelier and earns more coins. It is designed as a return-friendly idle game with visible growth instead of an instant button-click reward loop.",
      how: ["Open the animal park from the menu.", "Wait for visitors to buy tickets and fill the ticket box.", "Care for animals to raise happiness and keep income stable.", "Use coins to upgrade the gate and recruit more animals."],
      parent:
        "This game may help children practice focus, simple planning, responsibility, and animal knowledge through a gentle zoo-care loop. Progress is stored locally in the browser and is for fun only, not a formal assessment.",
      faq: [
        ["Is Animal Zoo Idle free?", "Yes. It runs in the browser on WeightPlay."],
        ["Does it require login?", "No. Basic play uses local browser progress only."],
        ["What age is it for?", "It is recommended for age 5+ and family play."],
        ["What skills does it practice?", "It can practice focus, logic, planning, and animal knowledge."],
      ],
    },
    "star-memory": {
      title: "Animal Star Memory",
      age: "5+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Memory", "Focus", "Problem Solving"],
      intro:
        "Animal Star Memory is a card matching game where players remember animal and star card positions and find pairs. Stages gradually add more cards and different themes, making it a calm way to practice attention and recall. The short stage format makes it suitable for quick play sessions on phones or tablets.",
      how: ["Flip a card to reveal its symbol.", "Remember where each symbol appears.", "Find the matching card pair.", "Clear every pair to finish the stage."],
      parent:
        "This game may help children practice memory and focus through simple matching. Progress feedback is for encouragement and local tracking only.",
      faq: [
        ["What age is Animal Star Memory for?", "It is recommended for age 5+ and family play."],
        ["Does it require fast reactions?", "No. It focuses on remembering positions."],
        ["Can children replay stages?", "Yes. Replaying can help practice memory in a low-pressure way."],
      ],
    },
    "campus-dash": {
      title: "Safari Dash",
      age: "12+",
      difficulty: "Hard",
      time: "1-3 minutes",
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      intro:
        "Safari Dash is a fast animal lane runner where players move left and right to dodge safari trail obstacles and collect points. It is a score-attack game for older players who enjoy quick reactions and replaying to improve. The short timer makes each attempt fast, while local records give players a reason to try again.",
      how: ["Move between lanes.", "Avoid obstacles.", "Collect score items when it is safe.", "Try to improve your local best score."],
      parent:
        "This game is designed for older children and casual players who enjoy fast reaction challenges. It can practice focus and hand-eye coordination, but scores are only for fun.",
      faq: [
        ["Why is Safari Dash 12+?", "It has faster reactions and score pressure than younger-child games."],
        ["Is there a leaderboard?", "The MVP uses local records for replay value."],
        ["Is it an educational test?", "No. It is a reaction game for entertainment and practice."],
      ],
    },
    "snack-blocks": {
      title: "Snack Blocks",
      age: "12+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Snack Blocks is a stage-based match puzzle game where players use every move to reach score and collection goals. Later stages add new targets and require better planning. It is built for players who enjoy thoughtful puzzle choices and local best-score improvement.",
      how: ["Swap neighboring snacks.", "Make matches of three or more.", "Use all moves to reach the stage goal.", "Replay stages to improve your score."],
      parent:
        "This game may help practice planning, focus, and problem solving. It is more challenging than preschool games and is not a formal education measurement.",
      faq: [
        ["Why should players finish all moves?", "The final score matters, so using the full move count makes records fairer."],
        ["What does Snack Blocks practice?", "It practices planning, pattern recognition, and focus."],
        ["Are scores compared with other children?", "No. Scores are local and supportive."],
      ],
    },
    "fruit-merge": {
      title: "Animal Merge Tower",
      age: "5+",
      difficulty: "Medium",
      time: "3-5 minutes",
      skills: ["Logic", "Problem Solving", "Hand-Eye Coordination"],
      intro:
        "Animal Merge Tower is a physics puzzle where matching animal balls combine into larger animal balls. Players choose where to drop each animal, watch the pile shift, and try to keep space open. It is easy to understand and gives families a calm score challenge.",
      how: ["Move the animal ball above the box.", "Drop it into a good spot.", "Merge matching animals into the next animal.", "Keep the pile below the danger line."],
      parent:
        "This game may help children practice planning, spatial reasoning, and hand-eye coordination. It is a casual game and does not measure intelligence.",
      faq: [
        ["What is the goal?", "Merge animal balls and score as high as possible before the box fills."],
        ["Is it timed?", "No. Players can think before dropping."],
        ["Can adults enjoy it too?", "Yes. It is family-friendly and replayable."],
      ],
    },
    "garden-tiles": {
      title: "Pet Garden Tiles",
      age: "Family",
      difficulty: "Relaxed",
      time: "3-5 minutes",
      skills: ["Memory", "Focus", "Problem Solving"],
      intro:
        "Pet Garden Tiles is a calm matching game with large tiles and no timer. It is designed for relaxed daily play, including older players or families who prefer a quieter pace. The game focuses on simple visual matching, cozy animal-garden imagery, and a comfortable interface.",
      how: ["Look for matching garden tiles.", "Tap tiles to select and match.", "Clear the stage at your own pace.", "Move to the next calm puzzle."],
      parent:
        "This game supports relaxed focus and memory practice. It avoids time pressure and is meant for comfort, not performance comparison.",
      faq: [
        ["Is Pet Garden Tiles timed?", "No. It is designed for calm play."],
        ["Who is it for?", "It is good for family and relaxed casual players."],
        ["Does it rank players?", "No. It focuses on local progress and comfort."],
      ],
    },
    "animal-rescue": {
      title: "Animal Rescue Trail",
      age: "Family",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Logic", "Problem Solving", "Animal Knowledge"],
      intro:
        "Animal Rescue Trail is a gentle path puzzle where players guide animals home. Each stage asks the player to choose safe routes and think through simple choices. It is designed as a flagship animal game for family-friendly play and channel promotion.",
      how: ["Look at the animal and the route choices.", "Choose a safe path.", "Help the animal reach home.", "Earn stars by making careful choices."],
      parent:
        "This game may help children practice simple logic, animal familiarity, and problem solving. It is gentle and designed for short family sessions.",
      faq: [
        ["What age is Animal Rescue Trail for?", "It supports 3+, 5+, and family play."],
        ["Is reading required?", "The game is designed to rely heavily on pictures and choices."],
        ["What skills does it practice?", "It practices simple route planning and animal knowledge."],
      ],
    },
    "animal-hidden-safari": {
      title: "Animal Hidden Safari",
      age: "3+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Focus", "Animal Knowledge", "Problem Solving"],
      intro:
        "Animal Hidden Safari is a calm seek-and-find game where players search playful animal habitats for animals, tracks, fruit, feathers, and other safari clues that may be partly tucked behind grass, leaves, water, or trees. Each stage gives a short picture-friendly target list and a bright scene to inspect. Players can use limited hints, replay for better stars, and unlock new habitats without harsh failure pressure. It is designed to help young children and families practice careful looking, focus, and animal recognition through relaxed browser play.",
      how: ["Choose a safari habitat.", "Look at the target list below the scene.", "Tap each hidden animal or object when you find it.", "Use hints if needed and clear the scene to unlock the next habitat."],
      parent:
        "This game may help children practice focus, visual scanning, animal knowledge, and simple problem solving. It is designed for short family-friendly sessions. Stars and best times are for fun and local progress only, not a formal assessment.",
      faq: [
        ["What kind of game is Animal Hidden Safari?", "It is a hidden-object and seek-and-find animal game for browser play."],
        ["Is there a time limit?", "No. The timer is only used for local best-time progress, not harsh failure."],
        ["What age is it for?", "It is recommended for age 3+ and family play."],
        ["What skills does it practice?", "It practices focus, animal knowledge, careful observation, and problem solving."],
      ],
    },
    "animal-guard-yard": {
      title: "Animal Guard Yard",
      age: "5+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Logic", "Focus", "Problem Solving"],
      intro:
        "Animal Guard Yard is one of WeightPlay's main animal games. Players place full-body animal guards on lanes, collect sun energy, earn coins, upgrade the team, and stop cartoon wild beasts across 8 balanced stages. Cats provide steady ranged shots, dogs hold the front as tank melee guards, owls attack quickly with lighter damage, and the diamond fox supports nearby lanes. Recent combat polish adds clearer pacing, warning moments when beasts get close, placement effects, hit sparks, and boss battles so the yard feels active instead of static.",
      how: ["Choose a stage from the game menu.", "Place ranged, melee, and tank animal guards in the best lanes.", "Collect sun energy and react when the warning appears.", "Earn coins, upgrade animals, and unlock the cross-lane fox with diamonds."],
      parent:
        "This game may help children practice planning, focus, and problem solving through friendly lane-defense play. The pacing is designed to feel exciting without being overwhelming, and the cartoon fantasy enemies are not realistic horror. Scores and upgrades are for fun and local progress only.",
      faq: [
        ["Can players upgrade animals?", "Yes. Coins upgrade animal guards, and shared WeightPlay diamonds can unlock the cross-lane fox."],
        ["How many stages are included?", "Animal Guard Yard currently has 8 stages with mixed waves, shield enemies, warning moments, and boss battles."],
        ["Is it scary?", "The wild beasts are cartoon-style game enemies, not realistic horror."],
        ["What does it practice?", "It practices planning, attention, and simple strategy through ranged, melee, tank, and cross-lane choices."],
        ["Why is it a Hero Game?", "It has animal upgrades, diamonds, stage progression, and a clear series direction for future guards, enemies, and boss abilities."],
      ],
    },
    "animal-quiz": {
      title: "Animal Quiz",
      age: "Family",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Animal Knowledge", "Memory", "Reading"],
      intro:
        "Animal Quiz is a family-friendly animal knowledge game built around short themed stages. Players answer picture-supported questions about animal names, habitats, body features, and simple behavior clues. The game is designed for parents and children to play together: older children can read the questions themselves, while younger players can listen, look at the images, and discuss the answer before choosing. Each stage stays short so the focus remains on curiosity, memory, and friendly learning rather than test pressure.",
      how: ["Choose an animal stage or region.", "Look at the picture and read the short question together.", "Discuss the animal clue, then pick the best answer.", "Complete the stage to unlock the next animal topic."],
      strategyTips: ["Use the picture first, then read the question.", "If a child is unsure, talk about where the animal lives or what body feature stands out.", "Treat wrong answers as a chance to learn a new animal fact."],
      parent:
        "This game may help children practice animal knowledge, memory, and early reading through short question-and-answer play. It is meant for family conversation and local progress tracking only, not a school test, IQ test, or formal learning assessment.",
      faq: [
        ["Is Animal Quiz good for young children?", "Yes with parent support, especially when a child needs help reading the question."],
        ["What does it practice?", "It practices animal knowledge, memory, picture observation, and simple reading."],
        ["Are wrong answers punished?", "No. Feedback should stay encouraging and help the child learn a new fact."],
        ["Is this a formal learning test?", "No. It is a family-friendly animal quiz for fun practice and local progress only."],
      ],
    },
    "zoo-helper-day": {
      title: "Zoo Helper Day",
      age: "3+",
      difficulty: "Easy",
      time: "1-3 minutes",
      skills: ["Animal Knowledge", "Focus", "Hand-Eye Coordination"],
      intro:
        "Zoo Helper Day is a gentle zoo workday game where children help different animal zones earn tickets and keep visitors happy. Each stage is framed like a small zoo shift, with simple picture-based care actions, large touch targets, and friendly feedback so young players can understand the goal without heavy reading. It is designed to feel more like running a tiny zoo than only picking a helper item.",
      how: ["Choose a zoo shift from the stage list.", "Look at the animal zone, ticket goal, and happiness meter.", "Choose or drag the helper item that matches the current zoo task.", "Finish the shift to earn tickets, stars, and the next zoo moment."],
      strategyTips: ["Name the animal zone before choosing an item.", "Talk about how tickets and visitor happiness grow when animals are cared for.", "If the first choice is wrong, look at the station name and picture clue again."],
      parent:
        "This game may help children practice animal recognition, simple care concepts, focus, and hand-eye coordination through picture-first play. It works best as a short guided moment where parents can describe the animal and the care action out loud. Progress and stars are only for encouragement and local play tracking, not for diagnosis, ranking, or formal learning assessment.",
      faq: [
        ["Can a 3-year-old play?", "Yes. The game is designed for picture-based preschool play with large buttons, though parent help can make it easier and more meaningful."],
        ["What does it practice?", "It can practice animal recognition, focus, hand-eye coordination, and simple care ideas such as food, water, cleaning, and play."],
        ["Does it require reading?", "No. The core choices are visual, so young children can play by looking at the animal and item pictures."],
        ["Does it collect child data?", "No personal child data is needed to play."],
      ],
    },
    "shape-train": {
      title: "Animal Shape Train",
      age: "3+",
      difficulty: "Easy",
      time: "1-3 minutes",
      skills: ["Color Recognition", "Logic", "Hand-Eye Coordination"],
      intro:
        "Animal Shape Train is a preschool animal train game where children help colorful shape passengers board the correct train cars. Each short stage focuses on a small set of visual choices, so young players can practice matching circles, triangles, squares, colors, and animal-themed cargo without needing to read long instructions. The game is built for quick mobile sessions with large targets, gentle feedback, and stage goals that parents can understand at a glance. It supports early classification practice through play while staying relaxed and pressure-free.",
      how: ["Look at the animal shape passenger or cargo.", "Find the train car with the matching shape or color.", "Tap or drag the piece into the correct car.", "Fill every train car to finish the stage and unlock the next route."],
      strategyTips: ["Say the shape name out loud before placing it.", "Look at both the outline and the color when a stage has similar pieces.", "If a child misses, encourage another look instead of rushing."],
      parent:
        "This game may help young children practice color recognition, shape sorting, simple logic, and hand-eye coordination through picture-based play. Scores and progress are for encouragement only, not a formal learning test or developmental assessment.",
      faq: [
        ["Does Animal Shape Train require reading?", "No. The main gameplay uses shapes and colors."],
        ["What age is it for?", "It is recommended for age 3+ because the goals are visual, simple, and short."],
        ["What skills does it practice?", "It practices color recognition, shape sorting, early logic, and hand-eye coordination."],
        ["Can parents play along?", "Yes. Parents can name each shape and color out loud to turn the stage into a short shared practice moment."],
      ],
    },
    "tiny-weather-rescue": {
      title: "Animal Helper Quest",
      age: "5+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Problem Solving", "Animal Knowledge", "Focus"],
      intro:
        "Animal Helper Quest is a simple care puzzle where players choose the right item to help an animal in different situations. The game supports future mission packs about weather, hunger, mud, darkness, and other small daily-life problems.",
      how: ["Look at the animal's problem.", "Choose or drag the helpful item.", "Try another item if it is not right.", "Finish the stage when the animal is happy."],
      parent:
        "This game may help children practice problem solving and animal-care thinking. It keeps feedback gentle and avoids shame when players choose the wrong item.",
      faq: [
        ["What happened to Tiny Weather Rescue?", "It became Animal Helper Quest so the game can include more than weather problems."],
        ["What skills does it practice?", "It practices problem solving, animal knowledge, and focus."],
        ["Is it stressful?", "No. Wrong choices should use gentle feedback and let players try again."],
      ],
    },
  };

  const labels = {
    en: {
      kicker: "WeightPlay Kids Game Guide",
      titleSuffix: "Free Kids Game",
      gameplay: "Gameplay",
      genre: "Genre",
      recommendedAge: "Recommended Age",
      difficulty: "Difficulty",
      estimatedTime: "Estimated Play Time",
      skills: "Skills Trained",
      howToPlay: "How to Play",
      strategyTips: "Strategy Tips",
      parentNote: "Parent Note",
      progressGuide: "Progress Guide",
      progressNote: "Scores are for fun and local progress tracking only. They are not an IQ test, medical diagnosis, psychological test, or formal school assessment.",
      beginner: "Beginner",
      good: "Good",
      excellent: "Excellent",
      faq: "FAQ",
      relatedGames: "Related Games",
      relatedIntro: "Because this game practices {skill}, try these next:",
      relatedBySkill: "More {skill} Games",
      relatedByAge: "More Games for Age {age}",
      relatedAnimal: "More Animal Games",
      guideLabel: "{title} game information",
    },
    "zh-Hant": {
      kicker: "WeightPlay 兒童遊戲指南",
      titleSuffix: "免費兒童遊戲",
      gameplay: "玩法",
      genre: "類型",
      recommendedAge: "建議年齡",
      difficulty: "難度",
      estimatedTime: "預估遊玩時間",
      skills: "訓練能力",
      howToPlay: "玩法說明",
      strategyTips: "小技巧",
      parentNote: "家長說明",
      progressGuide: "進步參考",
      progressNote: "分數只用於遊戲樂趣與本機進步紀錄，不是智力測驗、醫療診斷、心理測驗或正式教育評量。",
      beginner: "入門",
      good: "良好",
      excellent: "優秀",
      faq: "常見問題",
      relatedGames: "相關遊戲",
      relatedIntro: "因為這款遊戲會練習 {skill}，也可以試試這些遊戲：",
      relatedBySkill: "更多 {skill} 遊戲",
      relatedByAge: "更多 {age} 遊戲",
      relatedAnimal: "更多動物遊戲",
      guideLabel: "{title} 遊戲資訊",
    },
  };

  const skillLabels = {
    en: {},
    "zh-Hant": {
      Memory: "記憶力",
      Logic: "邏輯",
      Reaction: "反應力",
      Focus: "專注力",
      Math: "數學",
      Reading: "閱讀",
      "Color Recognition": "顏色辨識",
      "Hand-Eye Coordination": "手眼協調",
      "Problem Solving": "問題解決",
      "Animal Knowledge": "動物知識",
    },
  };

  const gameplayProfiles = {
    "wonder-crash": { gameplay: "Bullet Heaven Defense", genre: ["Action", "Defense", "Animal"] },
    "color-lunchbox": { gameplay: "Color Sorting", genre: ["Preschool", "Education", "Animal"] },
    "bubble-bakery": { gameplay: "Bubble Match Puzzle", genre: ["Puzzle", "Logic", "Animal"] },
    "animal-zoo-idle": { gameplay: "Idle Zoo Care", genre: ["Idle", "Simulation", "Animal"] },
    "animal-rope-rescue": { gameplay: "Vine Physics Puzzle", genre: ["Physics", "Puzzle", "Animal"] },
    "star-memory": { gameplay: "Memory Match", genre: ["Memory", "Puzzle", "Animal"] },
    "campus-dash": { gameplay: "Lane Runner", genre: ["Runner", "Reaction", "Animal"] },
    "snack-blocks": { gameplay: "Match 3 Puzzle", genre: ["Puzzle", "Logic", "Animal"] },
    "fruit-merge": { gameplay: "Physics Merge", genre: ["Merge", "Physics", "Animal"] },
    "garden-tiles": { gameplay: "Tile Match", genre: ["Puzzle", "Relaxed", "Animal"] },
    "animal-rescue": { gameplay: "Path Choice", genre: ["Puzzle", "Adventure", "Animal"] },
    "animal-hidden-safari": { gameplay: "Hidden Object", genre: ["Puzzle", "Safari", "Animal"] },
    "animal-guard-yard": { gameplay: "Lane Defense", genre: ["Strategy", "Tower Defense", "Animal"] },
    "animal-quiz": { gameplay: "Animal Quiz", genre: ["Quiz", "Education", "Animal"] },
    "zoo-helper-day": { gameplay: "Zoo Workday", genre: ["Preschool", "Simulation", "Animal"] },
    "shape-train": { gameplay: "Shape Sorting", genre: ["Preschool", "Education", "Animal"] },
    "tiny-weather-rescue": { gameplay: "Helper Choice", genre: ["Puzzle", "Care", "Animal"] },
  };

  const coverImages = {
    "wonder-crash": "wonder-crash-cover.webp",
    "color-lunchbox": "lunchbox-cover.webp",
    "bubble-bakery": "bubble-bakery-cover.webp",
    "animal-zoo-idle": "animal-zoo-idle-cover.webp",
    "animal-rope-rescue": "animal-vine-rescue-cover.webp",
    "star-memory": "memory-cover.webp",
    "campus-dash": "campus-dash-cover.webp",
    "snack-blocks": "snack-blocks-cover.webp",
    "fruit-merge": "fruit-merge-cover.webp",
    "garden-tiles": "garden-tiles-cover.webp",
    "animal-rescue": "animal-rescue-cover.webp",
    "animal-hidden-safari": "animal-hidden-safari-cover.webp",
    "animal-guard-yard": "animal-guard-yard-poster.webp",
    "animal-quiz": "quiz-cover.webp",
    "zoo-helper-day": "zoo-helper-day-cover.webp",
    "shape-train": "shape-train-cover.webp",
    "tiny-weather-rescue": "tiny-weather-rescue-cover.webp",
  };

  const localizedGameplayProfiles = {
    "zh-Hant": {
      "wonder-crash": { gameplay: "彈幕守城防禦", genre: ["動作", "防禦", "動物"] },
      "color-lunchbox": { gameplay: "顏色分類", genre: ["學齡前", "教育", "動物"] },
      "bubble-bakery": { gameplay: "泡泡連線益智", genre: ["益智", "邏輯", "動物"] },
      "animal-zoo-idle": { gameplay: "放置動物園經營", genre: ["放置", "模擬", "動物"] },
      "animal-rope-rescue": { gameplay: "藤蔓物理解謎", genre: ["物理", "益智", "動物"] },
      "star-memory": { gameplay: "記憶翻牌", genre: ["記憶", "益智", "動物"] },
      "campus-dash": { gameplay: "路線閃避跑酷", genre: ["跑酷", "反應", "動物"] },
      "snack-blocks": { gameplay: "三消方塊", genre: ["益智", "邏輯", "動物"] },
      "fruit-merge": { gameplay: "物理合成", genre: ["合成", "物理", "動物"] },
      "garden-tiles": { gameplay: "花園方塊配對", genre: ["益智", "放鬆", "動物"] },
      "animal-rescue": { gameplay: "路線選擇", genre: ["益智", "冒險", "動物"] },
      "animal-hidden-safari": { gameplay: "找找看", genre: ["益智", "自然", "動物"] },
      "animal-guard-yard": { gameplay: "路線防禦", genre: ["策略", "防禦", "動物"] },
      "animal-quiz": { gameplay: "動物問答", genre: ["問答", "教育", "動物"] },
      "zoo-helper-day": { gameplay: "動物園工作日", genre: ["學齡前", "模擬", "動物"] },
      "shape-train": { gameplay: "形狀分類", genre: ["學齡前", "教育", "動物"] },
      "tiny-weather-rescue": { gameplay: "道具選擇", genre: ["益智", "照顧", "動物"] },
    },
  };

  function zhGuide(title, gameplay, how) {
    return {
      title,
      intro: `${title} 是 WeightPlay 的動物主題免費兒童遊戲，透過 ${gameplay} 的方式，讓孩子在短時間內練習觀察、反應、專注與問題解決。遊戲設計以輕鬆、正向和手機友善為主，適合家長陪同或孩子短時間遊玩。`,
      how,
      parent: "這款遊戲適合短時間、輕鬆的練習。分數只用於遊戲樂趣與本機進步紀錄，不代表智力、心理或醫療評量。",
      faq: [
        [`${title} 適合小朋友玩嗎？`, "適合。遊戲以動物主題、清楚操作與短回合體驗為主，家長也可以一起陪玩。"],
        ["需要登入或付費嗎？", "不用登入就可以遊玩，目前主要以本機紀錄保存進度。"],
        ["這款遊戲可以訓練什麼？", "遊戲會依玩法練習專注力、反應力、記憶力或問題解決等能力，分數僅供趣味參考。"],
      ],
    };
  }

  const localizedGames = {
    "zh-Hant": {
      "wonder-crash": zhGuide("奇幻獅子守城", "彈幕守城防禦", ["拖曳角色左右移動。", "武器冷卻完成後會自動攻擊敵人。", "守住城牆並完成所有波次即可過關。"]),
      "color-lunchbox": zhGuide("動物顏色便當盒", "顏色分類", ["觀察食物或動物圖案的顏色。", "把物品拖到相同顏色的便當盒。", "完成每關指定題目即可進入下一關。"]),
      "bubble-bakery": zhGuide("動物泡泡烘焙坊", "泡泡連線益智", ["點擊兩顆以上相連的同色泡泡。", "消除泡泡後，上方泡泡會落下補位。", "在步數內完成關卡目標。"]),
      "animal-zoo-idle": zhGuide("動物小小樂園", "放置動物園經營", ["收取遊客門票收入。", "照顧動物並升級設施。", "解鎖更多動物，讓樂園越來越熱鬧。"]),
      "animal-rope-rescue": zhGuide("動物藤蔓救援", "藤蔓物理解謎", ["觀察藤蔓與目標位置。", "切斷正確藤蔓讓道具落下。", "幫助動物取得需要的物品。"]),
      "star-memory": zhGuide("動物星星翻牌", "記憶翻牌", ["翻開卡片記住動物圖案。", "找出相同的配對。", "用更少步數完成關卡。"]),
      "campus-dash": zhGuide("動物閃電跑", "路線閃避跑酷", ["左右移動切換路線。", "避開障礙並收集獎勵。", "保持反應速度完成挑戰。"]),
      "snack-blocks": zhGuide("動物零食方塊", "三消方塊", ["交換相鄰方塊。", "湊出三個以上相同圖案。", "在限定步數內完成目標。"]),
      "fruit-merge": zhGuide("動物合成塔", "物理合成", ["左右移動決定落點。", "讓相同動物球碰撞合成更高等級。", "避免堆疊超過警戒線。"]),
      "garden-tiles": zhGuide("寵物花園方塊", "花園方塊配對", ["選擇相同圖案的方塊。", "清除指定數量目標。", "規劃順序完成關卡。"]),
      "animal-rescue": zhGuide("動物回家路", "路線選擇", ["觀察每條路的風險。", "選擇安全路線幫動物回家。", "收集星星並完成關卡。"]),
      "animal-hidden-safari": zhGuide("動物探險找找看", "找找看", ["觀察自然場景。", "找出藏在畫面中的動物。", "完成目標後進入下一個地區。"]),
      "animal-guard-yard": zhGuide("動物守衛庭院", "路線防禦", ["購買並放置動物守衛。", "讓動物攻擊入侵者並守住庭院。", "升級隊伍並解鎖更強動物。"]),
      "animal-quiz": zhGuide("動物小博士", "動物問答", ["閱讀題目並觀察圖片。", "選出正確答案。", "透過關卡認識更多動物。"]),
      "zoo-helper-day": zhGuide("動物園幫忙日", "動物照顧", ["觀察動物需要什麼幫助。", "選擇正確道具。", "完成照顧任務讓動物開心。"]),
      "shape-train": zhGuide("動物火車", "形狀分類", ["觀察車廂上的形狀。", "把正確物品放到相同形狀的位置。", "完成火車任務。"]),
      "tiny-weather-rescue": zhGuide("動物幫幫隊", "道具選擇", ["觀察動物遇到的情境。", "選擇或拖曳正確道具幫忙。", "答對後完成關卡。"]),
    },
  };
  function currentGameId() {
    const parts = location.pathname.split("/").filter(Boolean);
    const gameIndex = parts.lastIndexOf("games");
    return gameIndex >= 0 ? parts[gameIndex + 1] : "";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  function locale() {
    return window.WonderI18n?.locale?.() || document.documentElement.lang || "en";
  }

  function uiLabel(key, params = {}) {
    const table = labels[locale()] || labels.en;
    const raw = table[key] || labels.en[key] || key;
    return Object.entries(params).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), raw);
  }

  function localizeSkill(skill) {
    const table = skillLabels[locale()] || skillLabels.en;
    return table[skill] || skill;
  }

  function localizeAge(age) {
    return locale() === "zh-Hant" && age === "Family" ? "親子" : age;
  }

  function localizeDifficulty(difficulty) {
    if (locale() !== "zh-Hant") return difficulty;
    const map = {
      Easy: "\u7c21\u55ae",
      Medium: "\u4e2d\u7b49",
      Hard: "\u56f0\u96e3",
      Relaxed: "\u8f15\u9b06",
    };
    return map[difficulty] || difficulty;
  }

  function localizePlayTime(time) {
    if (locale() !== "zh-Hant") return time;
    return String(time)
      .replace("1-3 minutes", "1-3 \u5206\u9418")
      .replace("3-5 minutes", "3-5 \u5206\u9418")
      .replace("5-8 minutes", "5-8 \u5206\u9418");
  }

  function scoreBandsFor(game) {
    const compact = game.time.includes("1-3");
    const scoreAttack = game.title.includes("Dash") || game.title.includes("Merge") || game.title.includes("Blocks");
    const baseByAge = {
      "3+": compact ? [0, 20, 21, 40, 41] : [0, 30, 31, 55, 56],
      "5+": scoreAttack ? [0, 80, 81, 150, 151] : [0, 40, 41, 70, 71],
      "7+": scoreAttack ? [0, 110, 111, 210, 211] : [0, 55, 56, 95, 96],
      "9+": scoreAttack ? [0, 140, 141, 260, 261] : [0, 70, 71, 120, 121],
      "12+": scoreAttack ? [0, 180, 181, 340, 341] : [0, 90, 91, 150, 151],
      Family: [0, 50, 51, 100, 101],
    };
    return [game.age, "5+", "7+"]
      .filter((age, index, list) => age && list.indexOf(age) === index)
      .slice(0, 3)
      .map((age) => {
        const [b0, b1, g0, g1, e0] = baseByAge[age] || baseByAge["5+"];
        return { age, beginner: `${b0}-${b1}`, good: `${g0}-${g1}`, excellent: `${e0}+` };
      });
  }

  function localizedGame(id) {
    const base = games[id];
    if (!base) return null;
    const override = localizedGames[locale()]?.[id] || {};
    const profile = gameplayProfiles[id] || {};
    const localizedProfile = localizedGameplayProfiles[locale()]?.[id] || {};
    const skills = override.skills || localizedProfile.skills || profile.skills || base.skills || [];
    return {
      ...base,
      ...profile,
      ...localizedProfile,
      ...override,
      skills,
      genre: override.genre || localizedProfile.genre || profile.genre || [],
    };
  }

  function relatedGames(activeId, activeBaseGame) {
    const activeSkills = activeBaseGame.skills || [];
    return relatedGameEntries(activeId, activeBaseGame, (game) => (game.skills || []).some((skill) => activeSkills.includes(skill))).slice(0, 3);
  }

  function relatedGameEntries(activeId, activeBaseGame, predicate) {
    return Object.entries(games)
      .filter(([id]) => id !== activeId)
      .filter(([, game]) => predicate(game))
      .map(([id, game]) => ({
        id,
        game,
        score: (game.skills || []).filter((skill) => (activeBaseGame.skills || []).includes(skill)).length + (game.age === activeBaseGame.age ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score || (localizedGame(a.id)?.title || a.id).localeCompare(localizedGame(b.id)?.title || b.id))
      .map(({ id }) => id);
  }

  function isAnimalGame(game) {
    return /\b(Animal|Zoo|Safari|Pet|Guard Yard|Helper)\b/i.test(game.title);
  }

  function relatedGroups(activeId, activeBaseGame) {
    const activeSkills = activeBaseGame.skills || [];
    const primarySkill = activeSkills[0] || "Focus";
    return [
      {
        title: uiLabel("relatedBySkill", { skill: localizeSkill(primarySkill) }),
        ids: relatedGameEntries(activeId, activeBaseGame, (game) => (game.skills || []).includes(primarySkill)).slice(0, 4),
      },
      {
        title: uiLabel("relatedByAge", { age: localizeAge(activeBaseGame.age) }),
        ids: relatedGameEntries(activeId, activeBaseGame, (game) => game.age === activeBaseGame.age).slice(0, 4),
      },
      {
        title: uiLabel("relatedAnimal"),
        ids: relatedGameEntries(activeId, activeBaseGame, isAnimalGame).slice(0, 4),
      },
    ].filter((group) => group.ids.length > 0);
  }

  function gameHref(gameId) {
    const base = location.pathname.includes("/weightplay/") ? "/weightplay/games/" : "/games/";
    return `${base}${gameId}/`;
  }

  function assetHref(fileName) {
    const base = location.pathname.includes("/weightplay/") ? "/weightplay/assets/" : "/assets/";
    return `${base}${fileName}`;
  }

  function shortDescription(game) {
    const sentenceSplit = new RegExp("(?<=[.!?\\u3002\\uff01\\uff1f])\\s*", "u");
    const firstSentence = String(game.intro || "").split(sentenceSplit)[0] || game.gameplay || game.title;
    return firstSentence.length > 88 ? `${firstSentence.slice(0, 86)}...` : firstSentence;
  }

  function relatedCard(gameId) {
    const game = localizedGame(gameId);
    if (!game) return "";
    const imageName = coverImages[gameId] || "weightplay-og.png";
    const fallbackName = imageName.endsWith(".webp") ? imageName.replace(/\.webp$/u, ".png") : "";
    const fallbackAttrs = ` data-final-src="${escapeHtml(assetHref("weightplay-logo.png"))}"${
      fallbackName ? ` data-fallback-src="${escapeHtml(assetHref(fallbackName))}"` : ""
    }`;
    return `
      <a class="game-info-related-card" href="${escapeHtml(gameHref(gameId))}">
        <img src="${escapeHtml(assetHref(imageName))}"${fallbackAttrs} alt="" width="320" height="320" loading="lazy" decoding="async" />
        <span class="game-info-related-copy">
          <strong>${escapeHtml(game.title)}</strong>
          <span>${escapeHtml(shortDescription(game))}</span>
        </span>
      </a>
    `;
  }

  function repairRelatedImages(section) {
    section.querySelectorAll(".game-info-related-card img").forEach((image) => {
      const fallback = image.dataset.fallbackSrc;
      const finalFallback = image.dataset.finalSrc;
      let attempts = 0;
      const useFallback = () => {
        attempts += 1;
        if (attempts === 1 && fallback && image.src !== fallback) {
          image.src = fallback;
          return;
        }
        if (finalFallback && image.src !== finalFallback) image.src = finalFallback;
      };
      image.addEventListener("error", useFallback);
      if (image.complete && image.naturalWidth === 0) useFallback();
    });
  }

  function render() {
    const id = currentGameId();
    const baseGame = games[id];
    const main = document.querySelector("main");
    if (!baseGame || !main) return;
    const game = localizedGame(id);
    if (!game) return;
    const gameSkills = game.skills || [];

    document.querySelector(".game-page-info")?.remove();
    document.querySelectorAll("script[data-game-page-info-jsonld]").forEach((node) => node.remove());

    document.documentElement.classList.add("has-game-page-info");
    document.body.classList.add("has-game-page-info");
    const related = relatedGames(id, baseGame);
    const scoreBands = scoreBandsFor(baseGame);
    const section = document.createElement("section");
    section.className = "game-page-info";
    section.setAttribute("aria-label", uiLabel("guideLabel", { title: game.title }));
    section.innerHTML = `
      <div class="game-info-hero">
        <div class="game-info-title">
          <span class="game-info-kicker">${escapeHtml(uiLabel("kicker"))}</span>
          <h2>${escapeHtml(game.title)} - ${escapeHtml(uiLabel("titleSuffix"))}</h2>
          <p>${escapeHtml(game.intro)}</p>
        </div>
        <div class="game-info-facts">
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("gameplay"))}</span><strong>${escapeHtml(game.gameplay || game.title)}</strong></div>
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("genre"))}</span><div class="game-info-tags">${(game.genre || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("recommendedAge"))}</span><strong>${escapeHtml(localizeAge(game.age))}</strong></div>
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("difficulty"))}</span><strong>${escapeHtml(localizeDifficulty(game.difficulty))}</strong></div>
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("estimatedTime"))}</span><strong>${escapeHtml(localizePlayTime(game.time))}</strong></div>
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("skills"))}</span><div class="game-info-skills">${gameSkills.map((skill) => `<span>${escapeHtml(localizeSkill(skill))}</span>`).join("")}</div></div>
        </div>
      </div>
      <div class="game-info-sections">
        <div class="game-info-section">
          <h3>${escapeHtml(uiLabel("howToPlay"))}</h3>
          <ol>${game.how.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        </div>
        ${
          game.strategyTips?.length
            ? `
              <div class="game-info-section game-info-strategy">
                <h3>${escapeHtml(uiLabel("strategyTips"))}</h3>
                <ul>${game.strategyTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul>
              </div>
            `
            : ""
        }
        <div class="game-info-section game-info-parent">
          <h3>${escapeHtml(uiLabel("parentNote"))}</h3>
          <p>${escapeHtml(game.parent)}</p>
        </div>
        <div class="game-info-section game-info-progress">
          <h3>${escapeHtml(uiLabel("progressGuide"))}</h3>
          <div class="game-info-bands">
            ${scoreBands
              .map(
                (band) => `
                  <div class="game-info-band">
                    <strong>${escapeHtml(localizeAge(band.age))}</strong>
                    <span>${escapeHtml(uiLabel("beginner"))}: ${escapeHtml(band.beginner)}</span>
                    <span>${escapeHtml(uiLabel("good"))}: ${escapeHtml(band.good)}</span>
                    <span>${escapeHtml(uiLabel("excellent"))}: ${escapeHtml(band.excellent)}</span>
                  </div>
                `
              )
              .join("")}
          </div>
          <p>${escapeHtml(uiLabel("progressNote"))}</p>
        </div>
        <div class="game-info-section">
          <h3>${escapeHtml(uiLabel("faq"))}</h3>
          <dl>${game.faq.map(([q, a]) => `<div><dt>${escapeHtml(q)}</dt><dd>${escapeHtml(a)}</dd></div>`).join("")}</dl>
        </div>
        <div class="game-info-section">
          <h3>${escapeHtml(uiLabel("relatedGames"))}</h3>
          <p>${escapeHtml(uiLabel("relatedIntro", { skill: localizeSkill(gameSkills[0] || "Focus") }))}</p>
          <div class="game-info-related">${related.map(relatedCard).join("")}</div>
        </div>
      </div>
    `;
    main.insertAdjacentElement("afterend", section);
    repairRelatedImages(section);

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: game.faq.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    };
    const origin = location.origin || "https://weightplay.com";
    const homeUrl = new URL(location.pathname.includes("/weightplay/") ? "/weightplay/" : "/", origin).href;
    const gameUrl = new URL(gameHref(id), origin).href;
    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "WeightPlay", item: homeUrl },
        { "@type": "ListItem", position: 2, name: game.title, item: gameUrl },
      ],
    };
    [faqJsonLd, breadcrumbJsonLd].forEach((jsonLd) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.gamePageInfoJsonld = "true";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    });
  }

  window.WeightPlayGameInfo = {
    get(gameId) {
      const game = games[gameId];
      if (!game) return null;
      const localized = localizedGame(gameId);
      return {
        age: localized.age,
        difficulty: localized.difficulty,
        time: localized.time,
        gameplay: localized.gameplay,
        genre: localized.genre,
        skills: localized.skills,
      };
    },
    label(key) {
      return uiLabel(key);
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }

  window.addEventListener("wonder:locale-change", render);
  document.addEventListener("change", (event) => {
    if (event.target?.id === "localeSelect") {
      window.WonderI18n?.setLocale?.(event.target.value);
    }
  });
  document.addEventListener("input", (event) => {
    if (event.target?.id === "localeSelect") {
      window.WonderI18n?.setLocale?.(event.target.value);
    }
  });
})();
