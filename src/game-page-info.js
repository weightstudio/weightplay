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
    "animal-crystal-survivor": {
      title: "Animal Crystal Survivor",
      age: "13+",
      difficulty: "Medium",
      time: "3 minutes",
      skills: ["Reaction", "Focus", "Problem Solving"],
      intro:
        "Animal Crystal Survivor is a deeper 3-minute action score game set in WeightPlay's Crystal Grove. Players guide an animal ranger through a square arena, collect golden keys for score, pick up crystals for experience, and choose upgrades while shadow beasts move closer. The game is designed for older players who want an active survival loop with movement, risk, upgrades, and a clear final score.",
      how: [
        "Tap, drag, or use WASD / arrow keys to move the ranger.",
        "Collect golden keys before the 3:00 timer ends.",
        "Pick up crystals to level up and choose stronger abilities.",
        "Keep moving when shadow beasts get close and use upgrades to survive longer.",
      ],
      strategyTips: [
        "Collect early crystals so the first upgrade arrives quickly.",
        "Move toward keys when the path is safe, but avoid getting trapped by close enemies.",
        "Range and movement upgrades help new players stay alive, while attack upgrades help clear pressure faster.",
      ],
      parent:
        "This game is intended for older children and casual players who enjoy real-time action. It may practice reaction, focus, planning, and flexible decision-making through play. Results are for fun and local progress tracking only, not a test, diagnosis, ranking, or school assessment.",
      faq: [
        ["Why is Animal Crystal Survivor marked 13+?", "It uses real-time movement, enemies approaching from multiple directions, survival pressure, and upgrade choices, so it is more intense than WeightPlay's younger-child games."],
        ["What is the main goal?", "Collect as many golden keys as possible before the 3-minute run ends while surviving the shadow beasts."],
        ["Does the player aim manually?", "No. The ranger attacks automatically. The player focuses on movement, collecting, and upgrade choices."],
        ["Is this a formal skill test?", "No. Skill Report text is supportive local feedback for fun play only."],
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
    "beast-deck": {
      title: "Beast Deck: The Mist Forest",
      age: "13+",
      difficulty: "Medium",
      time: "6-10 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Beast Deck: The Mist Forest is a turn-based Roguelike deckbuilding card game with local progression. Players clear missions, earn XP, level up, unlock deeper forest routes, draft animal-power cards, and spend platform Diamonds on permanent upgrades.",
      how: [
        "Choose an unlocked mission from the menu. Your level and unlocked missions are saved on this device.",
        "Play cards from your hand by paying their Energy cost.",
        "Read the enemy intent before choosing attacks, block, poison, or draw cards.",
        "Defeat all 3 battles in a mission to earn XP and unlock the next route."
      ],
      strategyTips: [
        "Pay attention to enemy intent before deciding to attack or defend.",
        "Wolf Pack deals double damage when played after another attack card.",
        "Poison helps against enemies with block, while Guard Bear and Iron Tortoise protect difficult turns.",
        "Repeat earlier missions to gain XP before pushing into harder routes."
      ],
      parent:
        "This game is intended for teens and casual players. It practices strategy, logic, planning, and resource coordination. Progress is stored locally on the device and is for fun only.",
      faq: [
        ["Is Beast Deck free to play?", "Yes. Like all games on WeightPlay, it runs free in the browser."],
        ["Does progress continue between sessions?", "Yes. Player level, XP, best mission, selected mission, and permanent upgrades are saved locally on the device."],
        ["How do I earn Diamonds?", "Beast Deck does not drop Diamonds from battles. Use platform sources such as daily check-in rewards, then spend Diamonds on optional upgrades like the Mist Amulet."]
      ],
    },
    "animal-relic-hunters": {
      title: "Animal Relic Hunters",
      age: "13+",
      difficulty: "Hard",
      time: "5-8 minutes",
      skills: ["Logic", "Problem Solving", "Focus", "Reaction"],
      intro:
        "Animal Relic Hunters is a room-based action Roguelite survivor game. Explore ancient ruin chambers, defeat wave-based shadow beasts, level up to pick relic upgrades, collect golden keys, and unlock treasure chests to equip Weapons, Armor, and Boots to defeat the Boss.",
      how: [
        "Move your explorer using keyboard WASD or virtual joystick controls.",
        "Your explorer auto-attacks nearby enemies with magic energy bullets.",
        "Defeat shadow beasts to drop green Relic Orbs (EXP) to level up.",
        "Collect Golden Keys to unlock chests containing gear, then equip Weapons, Armor, and Boots in your side panel.",
        "When a level-up draft appears, choose one relic upgrade or spend 3 Diamonds once to reroll the choices.",
        "Enter Room 3 and defeat the Boss Behemoth to complete your expedition."
      ],
      strategyTips: [
        "Maneuver and kite enemies in circles to avoid taking melee damage.",
        "Choose relic upgrades like Magnet Range or Shield early on to boost survivability.",
        "Save Diamonds for meaningful choices: the Mist Amulet is permanent, while relic rerolls help rescue a difficult run.",
        "Keep upgrading and equipping better rarity gear to boost your basic attack power and max health.",
        "Chests contain rare equipment, so prioritize collecting keys from elite enemies."
      ],
      parent:
        "This game is designed for teens, offering practice in reflex reaction, focus, tactical item selection, and logic planning. Progression is stored locally and contains no clinical or diagnosis metrics.",
      faq: [
        ["Is Animal Relic Hunters free to play?", "Yes. All games on the WeightPlay platform run free of cost in the web browser."],
        ["How does the gear system work?", "Defeating elites drops keys to open chests containing Weapon, Armor, and Boots. Equipping gear increases your active stats."],
        ["What can Diamonds be used for?", "Diamonds can buy the permanent Mist Amulet and can optionally reroll one level-up relic draft for 3 Diamonds."],
        ["How do I defeat the Boss?", "Collect relics to increase your health and speed, and equip rare weapons to deal high damage before challenging the Boss Behemoth."]
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
    "animal-crystal-survivor": { gameplay: "Action Survival Score Run", genre: ["Action", "Survival", "Animal"] },
    "animal-guard-yard": { gameplay: "Lane Defense", genre: ["Strategy", "Tower Defense", "Animal"] },
    "animal-quiz": { gameplay: "Animal Quiz", genre: ["Quiz", "Education", "Animal"] },
    "zoo-helper-day": { gameplay: "Zoo Workday", genre: ["Preschool", "Simulation", "Animal"] },
    "shape-train": { gameplay: "Shape Sorting", genre: ["Preschool", "Education", "Animal"] },
    "tiny-weather-rescue": { gameplay: "Helper Choice", genre: ["Puzzle", "Care", "Animal"] },
    "beast-deck": { gameplay: "Card Roguelike", genre: ["Card", "Roguelike", "Animal"] },
    "animal-relic-hunters": { gameplay: "Room Action Roguelite", genre: ["Action", "Roguelite", "Animal"] },
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
    "animal-crystal-survivor": "animal-crystal-survivor-cover.webp",
    "animal-guard-yard": "animal-guard-yard-poster.webp",
    "animal-quiz": "quiz-cover.webp",
    "zoo-helper-day": "zoo-helper-day-cover.webp",
    "shape-train": "shape-train-cover.webp",
    "tiny-weather-rescue": "tiny-weather-rescue-cover.webp",
    "beast-deck": "beast-deck-cover.png",
    "animal-relic-hunters": "animal-relic-hunters-cover.png",
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
      "beast-deck": { gameplay: "卡牌構建 Roguelike", genre: ["卡牌", "策略", "動物"] },
      "animal-relic-hunters": { gameplay: "房間動作 Roguelite", genre: ["動作", "策略", "動物"] },
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

  localizedGames["zh-Hant"]["beast-deck"] = {
    title: "獸王牌組：迷霧森林",
    age: "13+",
    difficulty: "中等",
    time: "6-10 分鐘",
    gameplay: "Roguelike 牌組構築",
    genre: ["卡牌", "策略", "動物"],
    skills: ["邏輯", "解題", "專注"],
    intro: "獸王牌組：迷霧森林是一款有本機累積進度的回合制 Roguelike 牌組構築遊戲。玩家通過任務、獲得經驗、提升等級、解鎖更深的森林路線，並用動物能力卡對抗腐化野獸。",
    how: [
      "在選單選擇已解鎖任務，等級與任務進度會儲存在本機。",
      "支付能量打出手牌，造成傷害、格擋、抽牌或施加中毒。",
      "先觀察敵人的意圖，再決定要攻擊、防守或調整牌組節奏。",
      "通過任務中的 3 場戰鬥可獲得經驗並解鎖下一條路線。"
    ],
    strategyTips: [
      "敵人準備大攻擊時，優先使用守衛熊或鐵甲龜累積格擋。",
      "狼群突襲在本回合已打出攻擊卡後會造成雙倍傷害。",
      "中毒能穩定消耗高格擋敵人，抽牌卡則能提高組合成功率。",
      "如果後面任務太難，可以重複前面任務練等再挑戰。"
    ],
    parent: "本遊戲設計給青少年與休閒玩家，主要練習策略、邏輯、規劃與資源分配。進度只儲存在本機，僅供遊戲樂趣使用。",
    faq: [
      ["獸王牌組需要付費嗎？", "不需要。WeightPlay 的遊戲都可以直接在瀏覽器免費遊玩。"],
      ["進度會保留嗎？", "會。玩家等級、經驗、最高任務、選擇任務與永久升級會儲存在這台裝置。"],
      ["鑽石可以做什麼？", "獸王牌組不會從戰鬥掉落鑽石。鑽石目前以每日簽到等平台來源取得，可用來解鎖迷霧護符等永久升級。"]
    ]
  };

  localizedGames["zh-Hant"]["animal-relic-hunters"] = {
    title: "動物遺跡獵人",
    age: "13+",
    difficulty: "困難",
    time: "5-8 分鐘",
    gameplay: "房間動作 Roguelite",
    genre: ["動作", "冒險", "動物"],
    skills: ["Logic", "Problem Solving", "Focus", "Reaction"],
    intro: "動物遺跡獵人是一款房間制的動作生存冒險遊戲。探險家在遺跡中閃避並自動射擊腐化野獸，收集遺跡能量球升級挑選能力，並收集鑰匙解鎖寶箱，穿戴強力武器、防具與靴子，最終挑戰遺跡巨獸！",
    how: [
      "使用鍵盤 WASD 或畫面虛擬搖桿移動探險家。",
      "角色會自動射擊距離最近的敵方怪物。",
      "擊敗怪物掉落綠色遺跡能量球（EXP）即可累積經驗值升級。",
      "擊敗波次精英怪獲得金色鑰匙以開啟寶箱，並在側邊欄裝備獲得的武器、防具與鞋子。",
      "進入第 3 關並擊敗遺跡巨獸 Boss，完成冒險！"
    ],
    strategyTips: [
      "繞圈移動可以有效拉扯怪物，避免承受近戰接觸傷害。",
      "前期優先挑選『磁鐵範圍』與『防禦盾牌』以提高生存機率。",
      "優先收集鑰匙並開寶箱，穿上高品質的裝備能大幅提升基礎傷害與血量上限。",
      "在商店解鎖冒險特權，為冒險取得更大的起步優勢。"
    ],
    parent: "這款遊戲能鍛鍊玩家的敏捷反應力、戰略裝備選擇與資源規劃。所有遊戲數據均保存在本機中，不包含任何診斷指標。",
    faq: [
      ["遊戲內裝備有什麼效果？", "裝備分為武器、防具與鞋子，分別能提供不同的傷害、血量、盾牌與移速加成。"],
      ["如何解鎖更高難度的關卡？", "擊敗前一關的怪物波次，並在收集鑰匙後進入傳送門即可挑戰下一關的 Boss。"],
      ["這款遊戲完全免費嗎？", "是的，這是一款完全免費的瀏覽器動作射擊網頁遊戲。"]
    ]
  };

  Object.assign(localizedGames["zh-Hant"]["animal-relic-hunters"], {
    title: "動物遺跡獵人",
    age: "13+",
    difficulty: "困難",
    time: "5-8 分鐘",
    gameplay: "房間動作 Roguelite",
    genre: ["動作", "Roguelite", "動物"],
    skills: ["反應", "專注", "邏輯", "問題解決"],
    intro:
      "動物遺跡獵人是一款較深度的房間制動作 Roguelite。玩家操作獅子探險家探索古代遺跡，擊敗影獸、收集經驗水晶、取得金鑰、開寶箱換裝備，並在第 3 個房間挑戰 Boss。等級、背包與裝備會保存在本機，適合喜歡練功和角色成長的 13+ 玩家。",
    how: [
      "使用 WASD、方向鍵或虛擬搖桿移動獅子探險家。",
      "角色會自動攻擊附近敵人，玩家主要負責走位、收集和升級選擇。",
      "擊敗影獸會掉落經驗水晶，收集後可以升級並選擇一個遺跡能力。",
      "升級選項出現時，可以直接選一個能力，也可以花 3 顆鑽石重抽一次。",
      "收集金鑰開啟寶箱，取得武器、防具、靴子，並在背包裡替換裝備。",
      "進入第 3 個房間並擊敗 Boss，即可完成這次探險。"
    ],
    strategyTips: [
      "不要站著硬打，繞圈走位可以拉開影獸並減少近戰傷害。",
      "前期優先選擇磁力、生命或移動速度，能讓收集與生存更穩。",
      "鑽石要花在有感的地方：迷霧護符是永久強化，升級重抽適合用來拯救關鍵局。",
      "打 Boss 前盡量收集金鑰開寶箱，換上更好的武器、防具和靴子。",
      "如果打不過，先累積本機等級與裝備，再回來挑戰會更輕鬆。"
    ],
    parent:
      "這款遊戲設計給 13+ 玩家與喜歡動作挑戰的休閒玩家。遊戲會練習反應、專注、路線判斷、資源選擇和長期角色養成。等級、背包與裝備只保存在瀏覽器本機，結果僅供遊戲樂趣與進度追蹤，不是能力診斷或正式評量。",
    faq: [
      ["動物遺跡獵人是免費遊戲嗎？", "是。WeightPlay 的遊戲都可以直接在瀏覽器免費遊玩。"],
      ["為什麼建議 13+？", "因為它有即時走位、自動戰鬥、升級選擇、永久裝備與 Boss 挑戰，比低年齡層遊戲更刺激也更需要閱讀理解。"],
      ["裝備系統怎麼運作？", "收集金鑰後可以打開寶箱取得武器、防具和靴子。裝備會保存在本機背包，玩家可以替換成自己喜歡的配置。"],
      ["鑽石可以做什麼？", "鑽石可以購買永久迷霧護符，也可以在升級選項出現時花 3 顆鑽石重抽一次。"],
      ["打不過 Boss 怎麼辦？", "先提升本機等級、換上更好的裝備，並在關卡中選擇生命、移動速度或攻擊相關能力，下一輪會更容易。"]
    ]
  });

  Object.assign(localizedGames["zh-Hant"]["animal-relic-hunters"], {
    title: "動物遺跡獵人",
    age: "13+",
    difficulty: "困難",
    time: "5-8 分鐘",
    gameplay: "房間動作 Roguelite",
    genre: ["動作", "Roguelite", "動物"],
    skills: ["反應", "專注力", "邏輯力", "問題解決"],
    intro:
      "動物遺跡獵人是一款較深度的房間制動作 Roguelite。玩家操作獅子探險家探索古代遺跡，擊敗影獸、收集經驗水晶、取得金鑰、開寶箱換裝備，並在第 3 個房間挑戰 Boss。等級、背包與裝備會保存在本機，適合喜歡練功和角色成長的 13+ 玩家。",
    how: [
      "使用 WASD、方向鍵或手機虛擬搖桿移動獅子探險家。",
      "角色會自動攻擊附近敵人，玩家要靠走位、距離和升級選擇提高生存率。",
      "擊敗影獸會掉落遺跡能量球，收集後可以升級並選擇一個能力。",
      "升級選項出現時，可以直接選一個能力，也可以花 3 顆鑽石重抽一次。",
      "收集金鑰可以開寶箱，取得武器、防具和靴子，並永久保存在背包。",
      "進入第 3 個房間並擊敗 Boss，即可完成這次探險。"
    ],
    strategyTips: [
      "不要站著硬扛，繞圈拉開距離通常比直接衝進敵群更安全。",
      "前期可以優先選吸取範圍、移動速度或生命相關能力，讓收集和生存更穩。",
      "鑽石要花在有感的地方：永久護符和升級重抽是輔助選項，不是通關強制需求。",
      "打 Boss 前盡量收集金鑰開寶箱，換上更好的武器、防具和靴子。",
      "如果這輪失敗，保留的等級、背包和裝備會讓下一輪更有優勢。"
    ],
    parent:
      "這款遊戲適合 13+ 玩家，節奏比低年齡層遊戲更刺激，需要即時走位、資源判斷、升級選擇與裝備搭配。所有進度只保存在本機，能力報告僅供遊戲娛樂參考，不涉及診斷或正式評量。",
    faq: [
      ["動物遺跡獵人需要付費嗎？", "不需要。WeightPlay 的遊戲都可以直接在瀏覽器免費遊玩。"],
      ["為什麼建議 13+？", "因為它有即時走位、自動戰鬥、升級選擇、永久裝備與 Boss 挑戰，比低年齡層遊戲更刺激也更需要閱讀理解。"],
      ["裝備系統怎麼運作？", "金鑰可以開啟寶箱取得武器、防具和靴子。裝備會保存在本機背包，之後可以更換。"],
      ["鑽石可以做什麼？", "鑽石目前以每日簽到等平台來源取得，可用於永久護符，也可以在升級選項出現時花 3 顆鑽石重抽一次。戰鬥和結果畫面不會直接掉落鑽石。"],
      ["打不過 Boss 怎麼辦？", "先提升本機等級、換上更好的裝備，並在關卡中選擇生命、移動速度或攻擊相關能力，下一輪會更容易。"]
    ]
  });

  localizedGames["zh-Hant"]["animal-crystal-survivor"] = {
    title: "\u52d5\u7269\u6c34\u6676\u751f\u5b58\u6230",
    age: "13+",
    difficulty: "\u4e2d\u7b49",
    time: "3 \u5206\u9418",
    gameplay: "\u52d5\u4f5c\u751f\u5b58\u8a08\u5206",
    genre: ["\u52d5\u4f5c", "\u751f\u5b58", "\u52d5\u7269"],
    skills: ["Reaction", "Focus", "Problem Solving"],
    intro:
      "\u52d5\u7269\u6c34\u6676\u751f\u5b58\u6230\u662f\u4e00\u6b3e\u8f03\u6df1\u5ea6\u7684 3 \u5206\u9418\u52d5\u4f5c\u8a08\u5206\u904a\u6232\u3002\u73a9\u5bb6\u8981\u5728\u7d50\u6676\u68ee\u6797\u4e2d\u64cd\u4f5c\u52d5\u7269\u5de1\u5b88\u54e1\uff0c\u6536\u96c6\u91d1\u9470\u53d6\u5f97\u5206\u6578\uff0c\u62ff\u53d6\u6c34\u6676\u589e\u52a0\u7d93\u9a57\uff0c\u4e26\u5728\u9670\u5f71\u91ce\u7378\u9010\u6f38\u9760\u8fd1\u6642\u9078\u64c7\u5347\u7d1a\u80fd\u529b\u3002\u9019\u6b3e\u904a\u6232\u9069\u5408\u559c\u6b61\u79fb\u52d5\u3001\u98a8\u96aa\u5224\u65b7\u548c\u5347\u7d1a\u6210\u9577\u7684\u8f03\u5927\u73a9\u5bb6\u3002",
    how: [
      "\u9ede\u64ca\u3001\u62d6\u66f3\uff0c\u6216\u4f7f\u7528 WASD / \u65b9\u5411\u9375\u79fb\u52d5\u5de1\u5b88\u54e1\u3002",
      "\u5728 3:00 \u5012\u6578\u7d50\u675f\u524d\uff0c\u76e1\u91cf\u6536\u96c6\u91d1\u9470\u3002",
      "\u6536\u96c6\u6c34\u6676\u53ef\u4ee5\u5347\u7d1a\uff0c\u5347\u7d1a\u6642\u9078\u64c7\u4e00\u500b\u5f37\u5316\u80fd\u529b\u3002",
      "\u9670\u5f71\u91ce\u7378\u9760\u8fd1\u6642\u8981\u63d0\u65e9\u79fb\u52d5\uff0c\u5229\u7528\u5347\u7d1a\u8b93\u81ea\u5df1\u6490\u5f97\u66f4\u4e45\u3002",
    ],
    strategyTips: [
      "\u524d\u671f\u5148\u6536\u96c6\u6c34\u6676\uff0c\u8b93\u7b2c\u4e00\u6b21\u5347\u7d1a\u66f4\u65e9\u51fa\u73fe\u3002",
      "\u91d1\u9470\u9644\u8fd1\u5982\u679c\u6709\u7a7a\u6a94\u5c31\u53bb\u62ff\uff0c\u4f46\u4e0d\u8981\u8b93\u81ea\u5df1\u88ab\u6575\u4eba\u5305\u570d\u3002",
      "\u65b0\u624b\u53ef\u4ee5\u512a\u5148\u9078\u64c7\u5c04\u7a0b\u548c\u79fb\u52d5\u901f\u5ea6\uff1b\u60f3\u6253\u5f97\u66f4\u7a4d\u6975\u6642\uff0c\u518d\u9078\u64c7\u653b\u64ca\u985e\u5347\u7d1a\u3002",
    ],
    parent:
      "\u9019\u6b3e\u904a\u6232\u9069\u5408\u8f03\u5927\u5b69\u5b50\u8207\u559c\u6b61\u52d5\u4f5c\u6311\u6230\u7684\u4f11\u9592\u73a9\u5bb6\u3002\u904a\u6232\u904e\u7a0b\u53ef\u4ee5\u7df4\u7fd2\u53cd\u61c9\u3001\u5c08\u6ce8\u3001\u5224\u65b7\u548c\u81e8\u5834\u6c7a\u7b56\u3002\u7d50\u679c\u50c5\u4f9b\u904a\u6232\u6a02\u8da3\u8207\u672c\u6a5f\u9032\u6b65\u8ffd\u8e64\u53c3\u8003\uff0c\u4e0d\u662f\u6e2c\u9a57\u3001\u8a3a\u65b7\u3001\u6392\u540d\u6216\u5b78\u6821\u8a55\u91cf\u3002",
    faq: [
      ["\u70ba\u4ec0\u9ebc\u52d5\u7269\u6c34\u6676\u751f\u5b58\u6230\u6a19\u793a\u70ba 13+\uff1f", "\u56e0\u70ba\u904a\u6232\u6709\u5373\u6642\u79fb\u52d5\u3001\u591a\u65b9\u5411\u6575\u4eba\u9760\u8fd1\u3001\u751f\u5b58\u58d3\u529b\u548c\u5347\u7d1a\u9078\u64c7\uff0c\u6bd4\u5e74\u9f61\u8f03\u5c0f\u7684 WeightPlay \u904a\u6232\u66f4\u523a\u6fc0\u3002"],
      ["\u4e3b\u8981\u76ee\u6a19\u662f\u4ec0\u9ebc\uff1f", "\u5728 3 \u5206\u9418\u5167\u76e1\u91cf\u6536\u96c6\u91d1\u9470\uff0c\u540c\u6642\u8eb2\u958b\u9670\u5f71\u91ce\u7378\u4e26\u751f\u5b58\u5230\u6700\u5f8c\u3002"],
      ["\u73a9\u5bb6\u9700\u8981\u624b\u52d5\u7784\u6e96\u55ce\uff1f", "\u4e0d\u9700\u8981\u3002\u5de1\u5b88\u54e1\u6703\u81ea\u52d5\u653b\u64ca\uff0c\u73a9\u5bb6\u4e3b\u8981\u5c08\u6ce8\u5728\u79fb\u52d5\u3001\u6536\u96c6\u548c\u5347\u7d1a\u9078\u64c7\u3002"],
      ["\u9019\u662f\u6b63\u5f0f\u80fd\u529b\u6e2c\u9a57\u55ce\uff1f", "\u4e0d\u662f\u3002\u80fd\u529b\u56de\u994b\u53ea\u662f\u652f\u6301\u6027\u7684\u672c\u6a5f\u904a\u6232\u7d50\u679c\uff0c\u4e0d\u505a\u8a3a\u65b7\u6216\u6392\u540d\u3002"],
    ],
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
