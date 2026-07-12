(function () {
  const sharedAssetBase = new URL(".", document.currentScript?.src || location.href);
  if (!document.querySelector('link[data-wp-stage-standard], link[href*="stage-selector-standard.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("stage-selector-standard.css", sharedAssetBase).href;
    link.dataset.wpStageStandard = "true";
    document.head.appendChild(link);
  }
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
    "animal-cafe-rush": {
      title: "Animal Cafe Rush",
      age: "6+",
      difficulty: "Easy to Medium",
      time: "3-8 minutes",
      skills: ["Focus", "Reaction", "Problem Solving"],
      intro:
        "Animal Cafe Rush is a quick picture-matching cafe game where animal customers continuously join the queue. Players choose food tiles that match a customer's order bubble, then tap that customer to serve before patience runs out. Duplicate foods and longer queues gradually add challenge while cafe upgrades support repeat play.",
      how: ["Check the food pictures above each customer.", "Tap matching food tiles to build one complete order.", "Tap the customer whose bubble matches the selected food.", "Keep serving as the queue grows and use earned coins for cafe upgrades."],
      parent:
        "This game may help children practice visual matching, focus, reaction, and planning through short cafe rounds. Progress is stored locally and is for playful feedback only, not a formal assessment.",
      faq: [
        ["How do I serve a customer?", "Choose every food shown in one order bubble, then tap that customer."],
        ["What happens when a customer waits too long?", "The customer leaves and the business rating drops, but the day can be retried."],
        ["Does the game require an account?", "No. Basic progress and upgrades are stored only in the browser."],
      ],
    },
    "animal-hero-trials": {
      title: "Animal Hero Trials",
      age: "13+",
      difficulty: "Medium",
      time: "5-10 minutes",
      skills: ["Reaction", "Focus", "Problem Solving"],
      intro:
        "Animal Hero Trials is a mobile-first action game starring four recurring WeightPlay heroes. Each hero has different movement, range, durability, and an active skill. Clear three forest rooms, choose a blessing after each room, defeat the Shadow Sovereign, and spend earned Trial Marks on permanent mastery.",
      how: ["Choose a hero and an unlocked trial.", "Move with the joystick or keyboard while the hero attacks nearby enemies.", "Time the hero skill to escape danger or deal extra damage.", "Choose one free blessing after each room and defeat the Boss."],
      parent:
        "This 13+ game may practice reaction, focus, route planning, and adapting to different hero abilities. Progress and mastery are stored locally. The optional diamond blessing reroll is clearly confirmed and is never required for normal progression.",
      faq: [
        ["Is Animal Hero Trials free?", "Yes. Normal trials, blessings, and progression are free to play in the browser."],
        ["What carries between runs?", "Trial Marks, unlocked trials, selected hero, and permanent mastery are saved locally."],
        ["Are diamonds required?", "No. Diamonds only offer one optional blessing reroll per run."],
      ],
    },
    "animal-gearpack-expedition": {
      title: "Animal Gearpack Expedition",
      age: "13+",
      difficulty: "Medium",
      time: "6-12 minutes",
      skills: ["Planning", "Problem Solving", "Spatial Reasoning"],
      intro:
        "Animal Gearpack Expedition is a spatial-inventory strategy adventure starring Gear Horn Rux. Arrange equipment inside a five-by-seven pack, connect matching material tags, clear five encounters, and visit Moon Cap Orla's caravan shop before facing the Root Guardian.",
      how: ["Choose the Gearwood route.", "Tap an item, rotate it when useful, and place it in open pack cells.", "Put matching material tags beside each other to earn attack and defense links.", "Fight, choose loot, buy or sell gear, and defeat the fifth-room Boss."],
      parent:
        "This 13+ game may practice spatial reasoning, planning, trade-off decisions, and adapting a build between encounters. Workshop XP and discoveries are stored locally. The optional three-diamond merchant refresh is confirmed and is never required to clear the first route.",
      faq: [
        ["What carries between expeditions?", "Workshop XP, discovered items, and best-room progress are stored locally in the browser."],
        ["How do adjacency bonuses work?", "Equipment with the same material tag gains bonuses when their occupied cells touch."],
        ["Are diamonds required?", "No. Diamonds only provide an optional confirmed merchant-stock refresh."],
      ],
    },
    "animal-moonlight-heist": {
      title: "Animal Moonlight Heist",
      age: "13+",
      difficulty: "Medium",
      time: "4-8 minutes",
      skills: ["Planning", "Focus", "Risk Assessment"],
      intro:
        "Animal Moonlight Heist is a phone-first stealth extraction adventure starring Spark Paw Fia and Moon Cap Orla. Preview a route, read moving patrols, recover each archive object, and decide whether optional treasure is worth the extra risk before extraction.",
      how: ["Choose one of five archive missions and a stealth gadget.", "Hold and drag through the scene to preview Fia's route, then release to move.", "Avoid patrols or use Lightning Dash, Star Decoy, or Smoke Leaf when alert rises.", "Recover the mission object and reach extraction; optional treasure earns an extra medal and moon coins."],
      parent:
        "This 13+ game may practice route planning, attention, timing, and weighing optional risk. Mission progress, medals, moon coins, and safehouse growth stay in local browser storage. Normal progress and retry are free; optional diamond reroll and insurance always require confirmation.",
      faq: [
        ["What carries between missions?", "Unlocked missions, medals, moon coins, and safehouse progress are saved locally."],
        ["Is combat required?", "No. Players read patrol movement and use routes or gadgets to avoid detection."],
        ["Are diamonds required?", "No. Diamonds only provide optional confirmed gadget reroll and treasure insurance choices."],
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
    "animal-rune-tactics": {
      title: "Animal Rune Tactics",
      age: "13+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Animal Rune Tactics is a turn-based animal squad tactics game. Players lead a lion guardian, owl mage, and turtle shield hero across a rune grid, choose movement and skill actions, clear shadow beasts, and collect rune rewards that improve future missions. It is designed for older players who want thoughtful battles, local progression, and optional Diamond rerolls without real-time pressure.",
      how: [
        "Choose an unlocked mission from the menu.",
        "Select a hero on the rune grid, then move, attack, guard, or use a skill.",
        "Watch enemy turns and protect weaker heroes with smart positioning.",
        "Clear all enemies to choose a rune reward and unlock more mission progress.",
        "Optional Diamond spending can reroll reward choices or unlock a permanent training slot."
      ],
      strategyTips: [
        "Move the lion toward the front first so enemies focus on the tougher hero.",
        "Use the owl's ranged rune skill to finish enemies before they reach the back row.",
        "Guard with the turtle before dangerous enemy turns to keep the squad alive.",
        "Save Diamond rerolls for runs where all reward choices miss your current plan."
      ],
      parent:
        "This game is intended for teens and casual strategy players. It practices planning, step-by-step logic, focus, and resource choices through a fantasy animal battle. Progress is stored locally in the browser and is for entertainment only, not diagnosis, ranking, or formal learning assessment.",
      faq: [
        ["Is Animal Rune Tactics free to play?", "Yes. It runs in the browser on WeightPlay."],
        ["Why is it marked 13+?", "The game uses turn-based tactics, enemy pressure, reward choices, and optional Diamond spending, so it is deeper than younger-child games."],
        ["Does it require fast reactions?", "No. Battles are turn-based, so players can think before choosing movement, attacks, guards, or skills."],
        ["What can Diamonds be used for?", "Diamonds can optionally reroll rune reward choices or unlock a permanent training slot. The core mission is playable without spending Diamonds."]
      ],
    },
    "animal-reef-fisher": {
      title: "Animal Reef Fisher",
      age: "13+",
      difficulty: "Medium",
      time: "3-5 minutes",
      skills: ["Focus", "Reaction", "Problem Solving"],
      intro:
        "Animal Reef Fisher is an Ocean World fishing, collection, and gear-upgrade game. Players choose reef zones, charge casts, control line tension, discover sea creatures for a local album, and spend Reef Notes on better gear. It is built for older players who want a calm but active timing challenge with local progress and optional Diamond tools.",
      how: [
        "Choose an unlocked reef zone from the map.",
        "Hold in the reef play area to charge the cast, then release to cast.",
        "When a fish is hooked, drag in the tension lane and keep the red marker inside the safe band.",
        "Land enough catches to complete the expedition and unlock album progress.",
        "Use Reef Notes for gear upgrades. Optional Diamonds can prepare a rare lure or sonar ping.",
      ],
      strategyTips: [
        "Start in Sunny Shore until the tension lane feels natural.",
        "Upgrade reel control and line durability early if fish keep escaping.",
        "Use rare lures for zones where you still need album discoveries.",
        "Save sonar pings for harder zones or rare shimmer movement.",
      ],
      parent:
        "This game is intended for teens and casual players who enjoy timing and collection. It may practice focus, reaction, planning, and calm adjustment through play. Progress is stored locally in the browser and is for entertainment only, not diagnosis, ranking, or formal assessment.",
      faq: [
        ["Is Animal Reef Fisher free to play?", "Yes. It runs in the browser on WeightPlay."],
        ["Why is it marked 13+?", "It uses timing pressure, gear choices, collection progress, and optional Diamond spending, so it is deeper than younger-child games."],
        ["Do I need Diamonds to progress?", "No. Reef zones, gear upgrades, and the album can progress without Diamonds. Diamonds only prepare optional rare lure or sonar tools."],
        ["Does progress save?", "Yes. Unlocked zones, album entries, gear levels, and best results are saved locally on the device."],
      ],
    },
    "animal-orb-fortress": {
      title: "Animal Orb Fortress",
      age: "13+",
      difficulty: "Hard",
      time: "5-8 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Animal Orb Fortress is a ricochet roguelite defense game where players aim spirit orbs through a crystal fortress arena, bounce shots off walls, clear three enemy waves, choose run upgrades, and spend Star Stones on permanent fortress rooms. The game is built for older players who enjoy aim planning, boss pressure, and local progression without requiring Diamond spending.",
      how: [
        "Start a raid from the fortress map and drag from the launcher to aim the spirit orb.",
        "Use wall bounces to hit shadow beasts before they reach the core.",
        "Clear each wave to choose one fortress blessing, or optionally spend 3 Diamonds once to reroll the choices.",
        "Defeat the wave 3 boss while keeping core HP above zero.",
        "Spend earned Star Stones on fortress rooms such as Orb Forge, Core Shield, Companion Den, and Scout Tower."
      ],
      strategyTips: [
        "Aim for bank shots that cross the center of the arena instead of only shooting straight at the closest enemy.",
        "Choose shield or recharge upgrades when enemies are getting too close to the core.",
        "Save Diamond rerolls for runs where all three upgrade choices miss your current plan.",
        "Upgrade Core Shield and Orb Forge early to make later raid tiers more stable."
      ],
      parent:
        "This game is intended for teens and casual strategy-action players. It practices logic, focus, aiming plans, and upgrade decisions through fantasy animal combat. Progress is stored locally on the device and is for entertainment only, not diagnosis, ranking, or formal assessment.",
      faq: [
        ["Is Animal Orb Fortress free to play?", "Yes. It runs in the browser on WeightPlay."],
        ["Why is it marked 13+?", "It has real-time aiming, enemy pressure, boss waves, upgrade choices, and optional Diamond rerolls, so it is deeper than younger-child games."],
        ["Do I need Diamonds to win?", "No. The main raid and fortress upgrades are playable without Diamonds. Diamonds only provide optional rerolls for upgrade choices."],
        ["Does progress continue between sessions?", "Yes. Star Stones, best raid tier, play count, and fortress room levels are saved locally on the device."]
      ],
    },

    "animal-auto-squad": {
      title: "Animal Auto Squad",
      age: "13+",
      difficulty: "Medium",
      time: "5-10 minutes",
      skills: ["Logic", "Problem Solving", "Strategic Planning"],
      intro:
        "Animal Auto Squad is a tactical strategy auto-battler where players train, level up, and position chibi animal warriors to defeat shadow beasts in automated combat. Clear six locally saved forest stages, each with five balanced waves, while building squad synergies and choosing relic buffs. Optional Diamond purchases cover relic rerolls, expedition revives, and cosmetic skins.",
      how: [
        "Buy animal cards from the shop using your starting Gold.",
        "Drag and drop animals onto active squad slots or the storage bench.",
        "Combine three identical animals to level them up and increase stats.",
        "Tap Start Battle to run automated round resolution against shadow beasts.",
        "Losing a wave costs 1 Heart; clear all 5 waves to unlock the next forest stage."
      ],
      strategyTips: [
        "Combine matching animals early to build high-stat Level 2 units.",
        "Place tanky animals like Otter or Turtle in the front slots, and damage units like Fox or Bear in the back.",
        "Utilize Owl's gold generation or Otter's buff abilities to optimize shop drafting.",
        "Collect Melon food items to shield your key damage dealers from enemy boss strikes."
      ],
      parent:
        "This game is designed for teens and casual players who enjoy logic puzzles and planning. It may help players practice strategic positioning, resources management, and problem solving through automated combat scenarios. Progress and high scores are saved locally in the browser.",
      faq: [
        ["Is Animal Auto Squad free to play?", "Yes. It runs entirely in the browser on WeightPlay."],
        ["What is the goal of the expedition?", "Win 10 consecutive combat rounds to defeat the shadow boss and clear the Forest Stage."],
        ["What do Diamonds do?", "Diamonds are used to buy optional relic rerolls, revive after a run defeat, or unlock cosmetic golden warrior skins."],
        ["Does the game support saving?", "Yes. Completed runs, best rounds, and custom skins are saved locally in the browser."]
      ],
    },
    "beast-tactician": {
      title: "Beast Guardian",
      age: "13+",
      difficulty: "Hard",
      time: "8-12 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Beast Guardian is a 13+ hero tower-defense game. Build ordinary animal soldiers and elite WeightPlay heroes on a tactical forest grid, shape enemy routes, stop boss waves, and protect the crystal core across 10 forest stages.",
      how: [
        "Choose a stage from the swipe stage rail and read the threat, plan, and reward notes.",
        "Spend coins to place soldiers or elite heroes on normal ground tiles.",
        "Keep at least one path open, or blocked enemies will attack the nearest defender until the route reopens.",
        "Upgrade defenders, unlock permanent tech, and use optional diamonds only for safe support choices such as revive, reroll, or cosmetic frames.",
        "Win the wave, collect stars, then use the next-stage action to continue the campaign."
      ],
      strategyTips: [
        "Use cheap soldiers to shape the path before spending on elite heroes.",
        "Moss Shell Taro and Boom Mane Leo are strong blockers, but over-blocking can make enemies attack them directly.",
        "Moon Cap Orla and Spark Paw Fia help clear pressure before fast enemies reach the core.",
        "Save diamonds for optional revive, reward reroll, or cosmetics; normal stage progress does not require spending."
      ],
      parent:
        "This game is designed for teenagers who enjoy planning, route control, timing, and resource decisions. Progress is saved locally in the browser.",
      faq: [
        ["Is Beast Guardian free to play?", "Yes. WeightPlay games run in the browser for free."],
        ["How do I start a stage?", "Choose an unlocked stage from the swipe rail, then begin the defense. Cleared non-final waves start automatically after a five-second countdown."],
        ["Does Beast Guardian save progress?", "Yes. Stage progress, stars, permanent tech, and optional cosmetics are saved locally in the browser."],
        ["What can Diamonds do?", "Diamonds are optional and may support revive, reward reroll, or cosmetics. They are not required for normal play."]
      ],
    },
    "shadow-wolf": {
      title: "Shadow Wolf",
      age: "13+",
      difficulty: "Hard",
      time: "5-8 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Shadow Wolf is a 2D Action Platformer RPG. Navigate stone platforms, double jump over spike traps, dash past shadow monsters, level up your attributes, and collect keys to open gear chests. Stand strong in Room 3 and defeat the giant Boss Behemoth.",
      how: [
        "Use A/D or Arrow keys to run left and right.",
        "Press W, Up Arrow, or Space to jump. Press it again in mid-air to double jump.",
        "Press J or left click to execute a claw attack. Press K or Shift to dash.",
        "Defeat waves of shadow bat/wolf monsters, pick up green experience orbs, and level up to pick passive relics.",
        "Loot gold keys from elites, open chests, and equip Weapons, Armor, and Boots in the sidebar."
      ],
      strategyTips: [
        "Time your double jumps carefully to avoid landing on spike traps, which deal constant damage.",
        "If you fall off a platform, don't panic! You will respawn on the nearest stable ground with a minor penalty of -5 HP.",
        "Dash grants brief invincibility frames. Use it to dodge bats shooting red projectiles.",
        "Unlock the permanent Mist Amulet from the Diamond Shop to start the platform run with +10 Max HP."
      ],
      parent:
        "This game helps teenagers practice spatial calculations, real-time motor reflexes, hand-eye coordination, and inventory optimization. All progression metrics are saved locally and are non-clinical.",
      faq: [
        ["Is Shadow Wolf free to play?", "Yes. All games on the WeightPlay platform run free of cost in the web browser."],
        ["What happens if I fall into a pit?", "You respawn on the nearest edge with a minor health penalty of -5 HP."],
        ["How do I defeat the Boss?", "Stay active, dodge its charge attacks by jumping onto higher platforms, and attack from behind."]
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
      skills: "練習能力",
      howToPlay: "玩法說明",
      strategyTips: "策略提示",
      parentNote: "家長說明",
      progressGuide: "進度指南",
      progressNote: "分數只用於遊戲娛樂與本地進度紀錄，不是智力測驗、醫療診斷、心理測驗或正式學校評量。",
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
      Memory: "記憶",
      Logic: "邏輯",
      Reaction: "反應",
      Focus: "專注",
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
    "animal-cafe-rush": { gameplay: "Cafe Queue Matching", genre: ["Time Management", "Matching", "Animal"] },
    "animal-hero-trials": { gameplay: "Hero Action Trials", genre: ["Action", "Roguelite", "Animal"] },
    "animal-gearpack-expedition": { gameplay: "Spatial Inventory Expedition", genre: ["Strategy", "Roguelite", "Animal"] },
    "animal-moonlight-heist": { gameplay: "Stealth Extraction Adventure", genre: ["Stealth", "Strategy", "Adventure", "Animal"] },
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
    "animal-rune-tactics": { gameplay: "Turn-Based Squad Tactics", genre: ["Strategy", "Tactics", "Animal"] },
    "animal-orb-fortress": { gameplay: "Ricochet Roguelite", genre: ["Action", "Roguelite", "Animal"] },
    "animal-auto-squad": { gameplay: "Tactical Auto-Battler", genre: ["Auto-Battler", "Strategy", "Animal"] },
    "beast-tactician": { gameplay: "Hero Tower Defense", genre: ["Tower Defense", "Strategy", "Animal"] },
    "shadow-wolf": { gameplay: "2D Action Platformer RPG", genre: ["Action", "Platformer", "Animal"] },
  };

  const coverImages = {
    "wonder-crash": "wonder-crash-cover.webp",
    "color-lunchbox": "lunchbox-cover.webp",
    "bubble-bakery": "bubble-bakery-cover.webp",
    "animal-zoo-idle": "animal-zoo-idle-cover.webp",
    "animal-cafe-rush": "animal-cafe-rush-cover.webp",
    "animal-hero-trials": "animal-hero-trials-cover.png",
    "animal-gearpack-expedition": "animal-gearpack-expedition-cover.webp",
    "animal-moonlight-heist": "animal-moonlight-heist-cover.png",
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
    "beast-deck": "beast-deck-cover.webp",
    "animal-relic-hunters": "animal-relic-hunters-cover.webp",
    "animal-rune-tactics": "animal-rune-tactics-cover.webp",
    "animal-orb-fortress": "animal-orb-fortress-cover.webp",
    "animal-auto-squad": "animal-auto-squad-cover.webp",
    "beast-tactician": "beast-tactician-cover.webp",
    "shadow-wolf": "shadow-wolf-cover.webp",
  };

  const localizedGameplayProfiles = {
    "zh-Hant": {
      "wonder-crash": { gameplay: "彈幕守城防禦", genre: ["動作", "防守", "動物"] },
      "color-lunchbox": { gameplay: "顏色分類", genre: ["幼兒", "教育", "動物"] },
      "bubble-bakery": { gameplay: "泡泡連線益智", genre: ["益智", "邏輯", "動物"] },
      "animal-zoo-idle": { gameplay: "放置動物園經營", genre: ["放置", "經營", "動物"] },
      "animal-rope-rescue": { gameplay: "藤蔓物理解謎", genre: ["物理", "益智", "動物"] },
      "star-memory": { gameplay: "記憶翻牌", genre: ["記憶", "益智", "動物"] },
      "campus-dash": { gameplay: "路線閃避跑酷", genre: ["跑酷", "反應", "動物"] },
      "snack-blocks": { gameplay: "三消方塊", genre: ["益智", "邏輯", "動物"] },
      "fruit-merge": { gameplay: "物理合成", genre: ["合成", "物理", "動物"] },
      "garden-tiles": { gameplay: "花園方塊配對", genre: ["益智", "放鬆", "動物"] },
      "animal-rescue": { gameplay: "路線選擇", genre: ["益智", "冒險", "動物"] },
      "animal-hidden-safari": { gameplay: "找找看", genre: ["益智", "自然探索", "動物"] },
      "animal-crystal-survivor": { gameplay: "動作生存挑戰", genre: ["動作", "生存", "動物"] },
      "animal-guard-yard": { gameplay: "路線防守", genre: ["策略", "防守", "動物"] },
      "animal-quiz": { gameplay: "動物問答", genre: ["問答", "教育", "動物"] },
      "zoo-helper-day": { gameplay: "動物園工作日", genre: ["幼兒", "經營", "動物"] },
      "shape-train": { gameplay: "形狀分類", genre: ["幼兒", "教育", "動物"] },
      "tiny-weather-rescue": { gameplay: "道具選擇", genre: ["益智", "照顧", "動物"] },
      "beast-deck": { gameplay: "牌組 Roguelike", genre: ["卡牌", "Roguelike", "動物"] },
      "animal-relic-hunters": { gameplay: "房間動作 Roguelite", genre: ["動作", "Roguelite", "動物"] },
      "animal-rune-tactics": { gameplay: "回合制小隊戰棋", genre: ["策略", "戰棋", "動物"] },
      "beast-tactician": { gameplay: "回合制小隊戰術 RPG", genre: ["戰術", "RPG", "動物"] },
      "animal-auto-squad": { gameplay: "自走棋策略益智", genre: ["自走棋", "策略", "益智", "動物"] },
      "shadow-wolf": { gameplay: "橫向動作 RPG", genre: ["動作", "平台", "動物"] },
    },
  };

  function zhGuide(title, gameplay, how) {
    return {
      title,
      intro: `${title} 是 WeightPlay 的動物主題免費瀏覽器遊戲，透過 ${gameplay} 的方式，讓玩家在短時間內練習觀察、專注、邏輯與問題解決。`,
      how,
      parent: "本遊戲以短回合、清楚操作與正向回饋為主，分數只保存在本機做為遊戲進度參考，不是正式測驗或診斷。",
      faq: [
        [`${title} 是免費遊戲嗎？`, "是。WeightPlay 的遊戲都可以直接在瀏覽器免費遊玩。"],
        ["需要登入嗎？", "不需要。基本遊玩使用本機瀏覽器進度。"],
        ["這是正式能力測驗嗎？", "不是。這是娛樂與練習用的遊戲回饋。"],
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
      "animal-guard-yard": zhGuide("動物守衛庭院", "路線防守", ["購買並放置動物守衛。", "讓動物攻擊入侵者並守住庭院。", "升級隊伍並解鎖更強動物。"]),
      "animal-quiz": zhGuide("動物小博士", "動物問答", ["閱讀題目並觀察圖片。", "選出正確答案。", "透過關卡認識更多動物。"]),
      "zoo-helper-day": zhGuide("動物園幫忙日", "動物照顧", ["觀察動物需要什麼幫助。", "選擇正確道具。", "完成照顧任務讓動物開心。"]),
      "shape-train": zhGuide("動物形狀小火車", "形狀分類", ["觀察車廂上的形狀。", "把正確物品放到相同形狀的位置。", "完成火車任務。"]),
      "tiny-weather-rescue": zhGuide("動物幫幫隊", "道具選擇", ["觀察動物遇到的情境。", "選擇或拖曳正確道具幫忙。", "答對後完成關卡。"]),
      "beast-deck": {
        title: "獸王牌組：迷霧森林",
        age: "13+",
        difficulty: "中等",
        time: "6-10 分鐘",
        gameplay: "牌組 Roguelike",
        genre: ["卡牌", "Roguelike", "動物"],
        skills: ["邏輯", "問題解決", "專注"],
        intro: "獸王牌組：迷霧森林是一款有本機累積進度的回合制 Roguelike 牌組構築遊戲。玩家通過任務、獲得經驗、提升等級、解鎖更深的森林路線，並用動物能力卡對抗腐化野獸。",
        how: ["選擇任務進入戰鬥。", "每回合打出卡牌攻擊、防守或取得資源。", "打倒敵人後獲得經驗，逐步解鎖更深的任務。"],
        strategyTips: ["保留防守牌可以避免血量突然降低。", "升級後先確認新卡牌是否能配合既有牌組。", "鑽石升級是選用，不是通關必要條件。"],
        parent: "這款遊戲適合青少年練習回合規劃、資源管理與風險判斷。進度存在本機，不需要登入。",
        faq: [["獸王牌組需要付費嗎？", "不需要。WeightPlay 的遊戲都可以直接在瀏覽器免費遊玩。"], ["鑽石可以做什麼？", "鑽石目前以每日簽到等平台來源取得，可用來解鎖可選永久升級。"]],
      },
      "animal-orb-fortress": {
        title: "\u52d5\u7269\u661f\u73e0\u8981\u585e",
        age: "13+",
        difficulty: "\u56f0\u96e3",
        time: "5-8 \u5206\u9418",
        gameplay: "\u53cd\u5f48 Roguelite",
        genre: ["\u52d5\u4f5c", "Roguelite", "\u52d5\u7269"],
        skills: ["\u908f\u8f2f", "\u554f\u984c\u89e3\u6c7a", "\u5c08\u6ce8"],
        intro: "動物星珠要塞是一款 13+ 動物反彈 Roguelite 防守遊戲。玩家從發射器瞄準星珠，利用牆面反彈穿過水晶要塞競技場，擊退三波暗影野獸與首領，並用星石升級永久要塞房間。",
        how: [
          "從要塞地圖開始突襲，拖曳發射器預覽星珠反彈路線後放開。",
          "利用牆面反彈攻擊暗影野獸，避免牠們靠近核心。",
          "每清除一波敵人可選擇一個要塞祝福，也可以選擇花費 3 顆鑽石重抽一次。",
          "在核心生命歸零前擊敗第三波首領。",
          "用獲得的星石升級星珠工坊、核心護盾、夥伴巢穴與偵查塔。"
        ],
        strategyTips: [
          "優先規劃會穿過場中央的反彈路線，不要只直線攻擊最近的敵人。",
          "當敵人靠近核心時，護盾或加速回充升級通常比單純傷害更穩。",
          "鑽石重抽保留給三個祝福都不符合目前打法的時候。",
          "前期先升級核心護盾與星珠工坊，後面突襲會更穩定。"
        ],
        parent: "這款遊戲適合青少年與喜歡策略動作的休閒玩家。它透過瞄準規劃、反彈路線與升級選擇練習邏輯、專注與問題解決。進度只儲存在本機裝置，僅供娛樂與自我進步參考，不是診斷、排名或正式評量。",
        faq: [
          ["動物星珠要塞是免費遊戲嗎？", "是。玩家可以直接在 WeightPlay 的瀏覽器頁面遊玩。"],
          ["為什麼標示為 13+？", "遊戲包含即時瞄準、敵人壓力、首領波次、升級選擇與可選鑽石重抽，系統比低年齡遊戲更深入。"],
          ["需要鑽石才能獲勝嗎？", "不需要。主要突襲與要塞升級都能免費遊玩，鑽石只用於可選的祝福重抽。"],
          ["進度會保留嗎？", "會。星石、最佳突襲層級、遊玩次數與要塞房間等級會儲存在本機裝置。"]
        ],
      },

      "animal-auto-squad": {
        title: "動物自走小隊",
        age: "13+",
        difficulty: "中等",
        time: "5-10 分鐘",
        gameplay: "自走棋策略益智",
        genre: ["自走棋", "策略", "益智", "動物"],
        skills: ["邏輯", "問題解決", "策略規劃"],
        intro:
          "《動物自走小隊》是一款戰術自走棋策略網頁遊戲。玩家培養並調整動物戰士站位，在自動戰鬥中擊退影之獸。遊戲共有 6 個可永久解鎖的森林關卡，每關包含 5 波平衡戰鬥，並可透過隊伍搭配與聖物加成持續挑戰。",
        how: [
          "在商店使用初始金幣購買動物卡牌或食物道具。",
          "將動物放置到作戰插槽（最多 5 隻）或備戰欄位。",
          "收集 3 張相同卡牌將自動合成升級，大幅強化屬性與技能數值。",
          "點擊開始戰鬥，小隊將以自動對撞方式與影獸交戰。",
          "戰敗會扣除 1 點生命值；成功通過 5 波即可完成關卡並解鎖下一關。"
        ],
        strategyTips: [
          "優先收集相同卡牌進行合成，高等級動物的技能效果會成倍增長。",
          "將高血量或具防禦效果的動物（如水獺、陸龜）放在前線，將高輸出角色（如狐狸、大熊）放在後排。",
          "善用貓頭鷹的出售加金幣能力，或浣熊購買獲得免費刷新商店的機會來優化你的金幣經濟。",
          "購買甜瓜食物可以為你後排的輸出主力提供一次性護盾，防止被 Boss 的高傷害秒殺。"
        ],
        parent:
          "這款遊戲適合青少年與休閒玩家。玩家在遊戲中可以練習策略規劃、金幣資源分配及戰位編排邏輯。所有的遠征進度與解鎖外觀都儲存在本機瀏覽器中，不涉及任何付費競爭。",
        faq: [
          ["動物自走小隊可以免費遊玩嗎？", "可以。遊戲在 WeightPlay 平台上完全免費，且在瀏覽器中直接載入。"],
          ["如何算獲得遠征勝利？", "連續通過 10 個戰鬥回合，並在最後擊敗暗影巨獸首領，即算通關遠征。"],
          ["鑽石在遊戲中有什麼用處？", "鑽石可用於在聖物階段重新挑選聖物、在生命值歸零時購買復活次數，或解鎖獅子卡牌的黃金外觀。"],
          ["遊戲會自動存檔嗎？", "會。玩家的最佳遠征紀錄、通關次數以及黃金外觀解鎖狀態，都會妥善保存在本機裝置。"]
        ]
      },
      "beast-tactician": {
        title: "獸王守衛",
        age: "13+",
        difficulty: "困難",
        time: "5-8 分鐘",
        gameplay: "回合制小隊戰術 RPG",
        genre: ["戰術", "RPG", "動物"],
        skills: ["邏輯", "問題解決", "專注"],
        intro: "獸王守衛是一款 13+ 回合制動物小隊戰術 RPG。玩家帶領守護熊、烈焰虎與自然鹿進入古代遺跡房間，管理行動時間軸、施放職業技能、收集武器與護甲，最後挑戰巨獸首領。",
        how: ["從下方行動面板選擇目前英雄的技能卡。", "點擊友方英雄施放治療或增益，或點擊敵方野獸作為攻擊目標。", "擊敗每個房間的暗影野獸，獲得經驗值並提升小隊能力。", "開啟裝備寶箱，取得稀有武器與護甲，並在側邊背包替英雄穿戴。", "通過第 3 房並擊敗巨獸首領即可完成出征。"],
        strategyTips: ["善用守護熊的鐵壁防線吸引攻擊。", "烈焰虎適合在狂熱姿態後接高傷害技能。", "自然鹿的治療能維持隊伍續戰力。", "迷霧護符是可選的鑽石永久升級。"],
        parent: "這款遊戲適合青少年練習戰術規劃、隊伍分工、生命資源管理與逐步推理。所有進度都保存在本機，不會儲存個人資料。",
        faq: [["獸王守衛是免費遊戲嗎？", "是。WeightPlay 的遊戲都可以直接在瀏覽器免費遊玩。"], ["行動順序怎麼決定？", "角色會依速度排序，時間軸中較前面的角色會先行動。"], ["鑽石升級會強迫購買嗎？", "不會。迷霧護符只是可選的永久升級，遊戲本身仍可正常遊玩。"]],
      },
      "animal-relic-hunters": {
        title: "動物遺跡獵人",
        age: "13+",
        difficulty: "困難",
        time: "5-8 分鐘",
        gameplay: "房間動作 Roguelite",
        genre: ["動作", "Roguelite", "動物"],
        skills: ["邏輯", "問題解決", "專注", "反應"],
        intro: "動物遺跡獵人是一款房間制動作 Roguelite 生存遊戲。玩家探索古代遺跡房間，擊敗一波波暗影野獸，升級後選擇遺跡能力，收集金鑰匙，開啟寶箱並穿戴武器、護甲與靴子，最後挑戰遺跡巨獸。",
        how: [
          "用 WASD、方向鍵或手機搖桿移動角色。",
          "擊敗敵人並收集遺跡能量，升級後選擇一個能力。",
          "菁英敵人會掉落金鑰匙，可以用來打開寶箱取得裝備。",
          "等級提升時可以選擇能力，也可以花 3 顆鑽石重抽一次選項。",
          "進入第 3 房並擊敗遺跡巨獸即可完成探險。"
        ],
        strategyTips: [
          "繞圈移動並保持距離，可以降低被近戰敵人連續碰到的風險。",
          "前期優先選擇吸取範圍或護盾類能力，能提高生存率。",
          "鑽石適合用在有意義的選擇：迷霧護符是永久升級，能力重抽則用來拯救困難的一輪。",
          "持續升級並穿戴更高稀有度裝備，可以提高基本攻擊力與最大生命值。",
          "寶箱會給稀有裝備，所以看到菁英敵人掉落鑰匙時要優先收集。"
        ],
        parent:
          "這款遊戲適合青少年練習反應、專注、道具選擇與局勢規劃。進度保存在本機，能力報告只用於遊戲娛樂與自我進步，不是診斷、排名或正式學習評量。",
        faq: [
          ["動物遺跡獵人是免費遊戲嗎？", "是。WeightPlay 的遊戲都可以直接在瀏覽器免費遊玩。"],
          ["裝備系統怎麼運作？", "擊敗菁英敵人會取得鑰匙，開啟寶箱後可能獲得武器、護甲或靴子。穿戴裝備後會提高目前角色能力。"],
          ["鑽石可以做什麼？", "鑽石可以購買永久迷霧護符，也可以在升級能力選項不理想時花 3 顆鑽石重抽一次。"],
          ["要怎麼擊敗 Boss？", "先收集能力提高生命、移動與吸取範圍，並穿戴稀有武器提高傷害，再挑戰遺跡巨獸。"]
        ],
      },
      "animal-rune-tactics": zhGuide("動物符文戰棋", "回合制小隊戰棋", ["選擇英雄並移動到符文格。", "攻擊或防守來控制戰局。", "完成任務後領取獎勵並保存本機進度。"]),
      "animal-reef-fisher": {
        title: "動物珊瑚釣手",
        age: "13+",
        difficulty: "中等",
        time: "3-5 分鐘",
        gameplay: "釣魚收集模擬",
        genre: ["釣魚", "收集", "模擬", "動物"],
        skills: ["專注", "反應", "問題解決"],
        intro:
          "動物珊瑚釣手是海洋世界的釣魚、收集與裝備升級遊戲。玩家選擇礁區、蓄力拋竿、控制魚線張力，並把發現的海洋生物記錄到本機圖鑑。遊戲適合想要溫和但需要專注操作的 13+ 玩家。",
        how: [
          "從礁區地圖選擇已解鎖的遠征區域。",
          "按住礁海畫面蓄力，放開即可拋竿。",
          "魚上鉤時，拖曳張力條，讓紅色標記留在亮色安全區。",
          "完成足夠收獲後即可完成遠征並保存圖鑑進度。",
          "使用礁石筆記升級裝備；鑽石只用於選擇性的稀有魚餌或聲納脈衝。",
        ],
        strategyTips: [
          "先在陽光淺灘練習，熟悉張力條節奏。",
          "如果魚常逃走，優先升級捲線控制與魚線耐久。",
          "稀有魚餌適合用在還缺圖鑑發現的礁區。",
          "把聲納脈衝留給較難的礁區或稀有移動。",
        ],
        parent:
          "這款遊戲適合喜歡節奏操作與收集的青少年與休閒玩家。遊玩過程可練習專注、反應、規劃與穩定調整。進度只保存在本機瀏覽器，僅供娛樂，不作為診斷、排名或正式評量。",
        faq: [
          ["動物珊瑚釣手可以免費玩嗎？", "可以。它可在 WeightPlay 的瀏覽器頁面遊玩。"],
          ["為什麼標示為 13+？", "遊戲包含張力控制、裝備選擇、收集進度與選擇性鑽石消耗，比低年齡層遊戲更深入。"],
          ["一定要使用鑽石才能進度嗎？", "不用。礁區、裝備與圖鑑都能不花鑽石推進；鑽石只提供選擇性的魚餌或聲納工具。"],
          ["進度會保存嗎？", "會。解鎖礁區、圖鑑項目、裝備等級與最佳紀錄會保存在本機裝置。"],
        ],
      },
      "animal-crystal-survivor": {
        title: "動物水晶生存戰",
        age: "13+",
        difficulty: "中等",
        time: "3 minutes",
        gameplay: "動作生存挑戰",
        genre: ["動作", "生存", "動物"],
        skills: ["反應", "專注", "問題解決"],
        intro:
          "動物水晶生存戰是 WeightPlay 的 3 分鐘動作生存分數遊戲。玩家要操作動物巡守員在結晶森林中移動，收集金鑰提高分數，撿取水晶獲得經驗，並在升級時選擇能力來撐過逐漸靠近的影獸。這款遊戲適合喜歡移動、風險判斷、升級選擇與短局挑戰的 13+ 玩家。",
        how: [
          "點擊、拖曳，或使用 WASD / 方向鍵移動巡守員。",
          "在 3:00 倒數結束前盡量收集金鑰。",
          "撿取水晶累積經驗，升級後選擇更強的能力。",
          "影獸靠近時保持移動，善用升級讓自己存活更久。",
        ],
        strategyTips: [
          "先收集附近的水晶，讓第一個升級更快出現。",
          "路線安全時再靠近金鑰，避免被太近的影獸包圍。",
          "射程與移動速度升級能幫新玩家撐更久，攻擊升級則能更快清掉壓力。",
        ],
        parent:
          "這款遊戲是給較年長兒童與休閒玩家的即時動作挑戰。遊玩過程可能練習反應、專注、路線規劃與彈性決策。成績只作為遊戲樂趣與本機進度紀錄，不是測驗、診斷、排名或學校評量。",
        faq: [
          ["為什麼動物水晶生存戰標示 13+？", "它包含即時移動、多方向敵人靠近、生存壓力與升級選擇，比低年齡層遊戲更刺激。"],
          ["主要目標是什麼？", "在 3 分鐘內一邊躲避影獸，一邊收集越多金鑰越好。"],
          ["玩家需要手動瞄準嗎？", "不用。巡守員會自動攻擊，玩家主要負責移動、收集與升級選擇。"],
          ["這是正式能力測驗嗎？", "不是。能力回饋只是支援性的本機遊戲提示，僅供娛樂參考。"],
        ],
      },
      "animal-gearpack-expedition": zhGuide("動物裝備行囊遠征", "空間行囊策略遠征", ["選擇齒輪森林路線。", "選擇、旋轉並把裝備放入行囊空格。", "讓相同材質的裝備彼此相鄰取得連結加成。", "通過五場遭遇並擊敗樹根守衛。"]),
      "animal-moonlight-heist": zhGuide("動物月影潛行隊", "潛行撤離冒險", ["選擇檔案館任務與潛行技能。", "按住並拖曳畫面預覽路線，放開後讓菲亞移動。", "觀察巡邏隊並在警戒升高時使用技能。", "取得任務物件後前往撤離門；額外寶藏可以自由選擇。"]),
      "shadow-wolf": zhGuide("影狼傳說", "橫向動作 RPG", ["左右移動並跳過平台陷阱。", "攻擊影獸並收集經驗。", "開啟寶箱、穿戴裝備並挑戰巨獸。"]),
      "animal-hero-trials": zhGuide("動物英雄試煉", "英雄動作試煉", ["選擇一位英雄與已解鎖試煉。", "移動閃避敵人，並掌握英雄技能的使用時機。", "每個房間選擇一項免費祝福，最後擊敗暗影王者。"]),
    },
  };
  games["animal-reef-fisher"] = {
    title: "Animal Reef Fisher",
    age: "13+",
    difficulty: "Medium",
    time: "3-5 minutes",
    skills: ["Focus", "Reaction", "Problem Solving"],
    intro:
      "Animal Reef Fisher is an Ocean World fishing, collection, and gear-upgrade game. Players choose reef zones, charge casts, control line tension, discover sea creatures for a local album, and spend Reef Notes on better gear. It is built for older players who want a calm but active timing challenge with local progress and optional Diamond tools.",
    how: [
      "Choose an unlocked reef zone from the map.",
      "Hold in the reef play area to charge the cast, then release to cast.",
      "When a fish is hooked, drag in the tension lane and keep the red marker inside the safe band.",
      "Land enough catches to complete the expedition and unlock album progress.",
      "Use Reef Notes for gear upgrades. Optional Diamonds can prepare a rare lure or sonar ping.",
    ],
    strategyTips: [
      "Start in Sunny Shore until the tension lane feels natural.",
      "Upgrade reel control and line durability early if fish keep escaping.",
      "Use rare lures for zones where you still need album discoveries.",
      "Save sonar pings for harder zones or rare shimmer movement.",
    ],
    parent:
      "This game is intended for teens and casual players who enjoy timing and collection. It may practice focus, reaction, planning, and calm adjustment through play. Progress is stored locally in the browser and is for entertainment only, not diagnosis, ranking, or formal assessment.",
    faq: [
      ["Is Animal Reef Fisher free to play?", "Yes. It runs in the browser on WeightPlay."],
      ["Why is it marked 13+?", "It uses timing pressure, gear choices, collection progress, and optional Diamond spending, so it is deeper than younger-child games."],
      ["Do I need Diamonds to progress?", "No. Reef zones, gear upgrades, and the album can progress without Diamonds. Diamonds only prepare optional rare lure or sonar tools."],
      ["Does progress save?", "Yes. Unlocked zones, album entries, gear levels, and best results are saved locally on the device."],
    ],
  };
  gameplayProfiles["animal-reef-fisher"] = { gameplay: "Fishing Collection Sim", genre: ["Fishing", "Collection", "Simulation", "Animal"] };
  coverImages["animal-reef-fisher"] = "animal-reef-fisher-cover.webp";
  localizedGameplayProfiles["zh-Hant"]["animal-reef-fisher"] = { gameplay: "釣魚收集模擬", genre: ["釣魚", "收集", "模擬", "動物"] };
  localizedGames["zh-Hant"]["animal-reef-fisher"] = {
    title: "動物珊瑚釣手",
    age: "13+",
    difficulty: "中等",
    time: "3-5 分鐘",
    gameplay: "釣魚收集模擬",
    genre: ["釣魚", "收集", "模擬", "動物"],
    skills: ["專注", "反應", "問題解決"],
    intro:
      "動物珊瑚釣手是海洋世界的釣魚、收集與裝備升級遊戲。玩家選擇礁區、蓄力拋竿、控制魚線張力，並把發現的海洋生物記錄到本機圖鑑。遊戲適合想要溫和但需要專注操作的 13+ 玩家。",
    how: [
      "從礁區地圖選擇已解鎖的遠征區域。",
      "按住礁海畫面蓄力，放開即可拋竿。",
      "魚上鉤後，在張力條中拖曳並讓紅色標記留在安全區。",
      "完成足夠收獲即可結束遠征並推進圖鑑進度。",
      "使用礁石筆記升級裝備；鑽石只用於選擇性的稀有魚餌或聲納脈衝。",
    ],
    strategyTips: [
      "先在陽光淺灘練習張力控制。",
      "如果魚常逃走，優先升級捲線控制與魚線耐久。",
      "稀有魚餌適合用在還缺圖鑑發現的礁區。",
      "把聲納脈衝留給較難的礁區或稀有移動。",
    ],
    parent:
      "這款遊戲適合青少年與喜歡計時收集的休閒玩家。它可能透過遊玩練習專注、反應、規劃與穩定調整。進度只儲存在本機瀏覽器中，僅供娛樂，不是診斷、排名或正式評量。",
    faq: [
      ["動物珊瑚釣手可以免費玩嗎？", "可以。它可在 WeightPlay 的瀏覽器頁面遊玩。"],
      ["為什麼標示為 13+？", "它包含張力控制、裝備選擇、收集進度與選擇性鑽石工具，比低年齡遊戲更深入。"],
      ["一定要使用鑽石才能進度嗎？", "不用。礁區、裝備與圖鑑都能不花鑽石推進；鑽石只提供選擇性的魚餌或聲納工具。"],
      ["進度會保存嗎？", "會。解鎖礁區、圖鑑項目、裝備等級與最佳紀錄會保存在本機裝置。"],
    ],
  };

  localizedGameplayProfiles["zh-Hant"]["animal-reef-fisher"] = { gameplay: "釣魚收集模擬", genre: ["釣魚", "收集", "模擬", "動物"] };
  localizedGames["zh-Hant"]["animal-reef-fisher"] = {
    title: "動物珊瑚釣手",
    age: "13+",
    difficulty: "中等",
    time: "3-5 分鐘",
    gameplay: "釣魚收集模擬",
    genre: ["釣魚", "收集", "模擬", "動物"],
    skills: ["專注", "反應", "問題解決"],
    intro:
      "動物珊瑚釣手是海洋世界的釣魚、收集與裝備升級遊戲。玩家選擇礁區、蓄力拋竿、控制魚線張力，並把發現的海洋生物記錄到本機圖鑑。遊戲適合想要溫和但需要專注操作的 13+ 玩家。",
    how: [
      "從礁區地圖選擇已解鎖的遠征區域。",
      "按住礁海畫面蓄力，放開即可拋竿。",
      "魚上鉤時，拖曳張力條，讓紅色標記留在亮色安全區。",
      "完成足夠收獲後即可完成遠征並保存圖鑑進度。",
      "使用礁石筆記升級裝備；鑽石只用於選擇性的稀有魚餌或聲納脈衝。",
    ],
    strategyTips: [
      "先在陽光淺灘練習，熟悉張力條節奏。",
      "如果魚常逃走，優先升級捲線控制與魚線耐久。",
      "稀有魚餌適合用在還缺圖鑑發現的礁區。",
      "把聲納脈衝留給較難的礁區或稀有移動。",
    ],
    parent:
      "這款遊戲適合喜歡節奏操作與收集的青少年與休閒玩家。遊玩過程可練習專注、反應、規劃與穩定調整。進度只保存在本機瀏覽器，僅供娛樂，不作為診斷、排名或正式評量。",
    faq: [
      ["動物珊瑚釣手可以免費玩嗎？", "可以。它可在 WeightPlay 的瀏覽器頁面遊玩。"],
      ["為什麼標示為 13+？", "遊戲包含張力控制、裝備選擇、收集進度與選擇性鑽石消耗，比低年齡層遊戲更深入。"],
      ["一定要使用鑽石才能進度嗎？", "不用。礁區、裝備與圖鑑都能不花鑽石推進；鑽石只提供選擇性的魚餌或聲納工具。"],
      ["進度會保存嗎？", "會。解鎖礁區、圖鑑項目、裝備等級與最佳紀錄會保存在本機裝置。"],
    ],
  };

  gameplayProfiles["beast-tactician"] = { gameplay: "Hero Tower Defense", genre: ["Tower Defense", "Strategy", "Animal"] };
  localizedGameplayProfiles["zh-Hant"]["beast-tactician"] = { gameplay: "英雄塔防", genre: ["塔防", "策略", "動物"] };
  localizedGameplayProfiles["zh-Hant"]["animal-hero-trials"] = { gameplay: "英雄動作試煉", genre: ["動作", "Roguelite", "動物"] };
  localizedGameplayProfiles["zh-Hant"]["animal-gearpack-expedition"] = { gameplay: "空間行囊策略遠征", genre: ["策略", "Roguelite", "動物"] };
  localizedGameplayProfiles["zh-Hant"]["animal-moonlight-heist"] = { gameplay: "潛行撤離冒險", genre: ["潛行", "策略", "冒險", "動物"] };
  localizedGames["zh-Hant"]["beast-tactician"] = {
    title: "獸王守衛",
    age: "13+",
    difficulty: "困難",
    time: "8-12 分鐘",
    gameplay: "英雄塔防",
    genre: ["塔防", "策略", "動物"],
    skills: ["邏輯", "解決問題", "專注"],
    intro:
      "獸王守衛是一款製作中的 13+ 英雄塔防遊戲。玩家在森林遺跡格子上建造一般動物士兵與 WeightPlay 英雄，調整敵人路線、抵擋 Boss 波次並保護水晶核心。公開頁面仍維持敬請期待，內部試玩路線只用於發行品質測試。",
    how: [
      "從可滑動關卡列選擇關卡，先閱讀威脅、建議配置與獎勵。",
      "花費金幣在普通地格放置士兵或英雄。",
      "保持至少一條路線可通行；如果完全堵住路線，敵人會攻擊最近的守衛直到路線恢復。",
      "升級守衛、解鎖永久科技，鑽石只作為復活、獎勵重抽或外觀框等可選支援。",
      "守住波次後取得星星，並用下一關按鈕繼續推進。"
    ],
    strategyTips: [
      "先用便宜士兵調整路線，再投入高費英雄。",
      "苔殼塔羅與轟鬃里奧適合擋線，但過度封路會讓敵人直接攻擊他們。",
      "月帽歐拉與星爪菲亞適合在快速敵人靠近核心前清理壓力。",
      "鑽石留給可選復活、獎勵重抽或外觀；正常通關不需要強制花費。"
    ],
    parent:
      "這款遊戲設計給喜歡規劃、路線控制、時機與資源選擇的青少年玩家。進度只保存在本機瀏覽器中，正式發行門檻通過前，公開頁面會維持敬請期待。",
    faq: [
      ["獸王守衛是免費遊戲嗎？", "是。WeightPlay 的遊戲都可以直接在瀏覽器免費遊玩。"],
      ["為什麼公開頁面顯示敬請期待？", "獸王守衛目前先作為內部試玩版本驗證品質，通過發行門檻前不會加入公開可玩清單。"],
      ["可以進入內部試玩嗎？", "只有核准的隱藏試玩路線可以進入；一般公開卡片仍然是敬請期待預告。"],
      ["鑽石可以做什麼？", "鑽石是可選支援，可用於復活、獎勵重抽或外觀，不是正常遊玩的必要條件。"]
    ],
  };

  Object.assign(localizedGames["zh-Hant"]["beast-tactician"], {
    title: "\u7378\u738b\u5b88\u885b",
    gameplay: "\u82f1\u96c4\u5854\u9632",
    intro: "\u7378\u738b\u5b88\u885b\u662f 13+ \u82f1\u96c4\u5854\u9632\u904a\u6232\u3002\u5728\u68ee\u6797\u68cb\u76e4\u4f48\u7f6e\u52d5\u7269\u5b88\u885b\u8207 WeightPlay \u82f1\u96c4\uff0c\u8abf\u6574\u6575\u4eba\u8def\u7dda\u3001\u64ca\u9000\u738b\u95dc\u6ce2\u6b21\uff0c\u4fdd\u8b77\u6c34\u6676\u6838\u5fc3\u4e26\u6311\u6230 10 \u500b\u95dc\u5361\u3002",
    parent: "\u9019\u6b3e\u904a\u6232\u9069\u5408\u559c\u6b61\u898f\u5283\u3001\u8def\u7dda\u63a7\u5236\u3001\u6642\u6a5f\u8207\u8cc7\u6e90\u6c7a\u7b56\u7684\u9752\u5c11\u5e74\u3002\u9032\u5ea6\u6703\u5132\u5b58\u5728\u700f\u89bd\u5668\u672c\u6a5f\u3002",
  });

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

  Object.assign(localizedGames["zh-Hant"]["animal-quiz"], {
    strategyTips: [
      "\u5148\u89c0\u5bdf\u5716\u7247\u7dda\u7d22\uff0c\u518d\u95b1\u8b80\u984c\u76ee\u3002",
      "\u4e0d\u78ba\u5b9a\u6642\uff0c\u53ef\u4ee5\u60f3\u60f3\u52d5\u7269\u7684\u68f2\u606f\u5730\u6216\u5927\u5916\u5f62\u7279\u5fb5\u3002",
      "\u7b54\u932f\u4e5f\u6c92\u95dc\u4fc2\uff0c\u628a\u5b83\u7576\u6210\u8a8d\u8b58\u65b0\u52d5\u7269\u77e5\u8b58\u7684\u6a5f\u6703\u3002",
    ],
  });

  function localizePlayTime(time) {
    if (locale() !== "zh-Hant") return time;
    return String(time)
      .replace("1-3 minutes", "1-3 \u5206\u9418")
      .replace("3-8 minutes", "3-8 \u5206\u9418")
      .replace("3 minutes", "3 \u5206\u9418")
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
    const imageName = coverImages[gameId] || "weightplay-logo.png";
    const fallbackName = imageName.endsWith(".webp") ? imageName.replace(/\.webp$/u, ".png") : "";
    const fallbackAttrs = ` data-final-src="${escapeHtml(assetHref("weightplay-logo.png"))}"${
      fallbackName ? ` data-fallback-src="${escapeHtml(assetHref(fallbackName))}"` : ""
    }`;
    return `
      <a class="game-info-related-card" href="${escapeHtml(gameHref(gameId))}">
        <img src="${escapeHtml(assetHref(imageName))}"${fallbackAttrs} alt="" width="320" height="320" loading="eager" decoding="async" />
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
      window.setTimeout(() => {
        if (!image.complete || image.naturalWidth === 0) useFallback();
      }, 1200);
    });
  }

  function stageArtworkUrl() {
    const image = document.querySelector(
      ".main-poster, .main-cover, .wonder-main-cover, img.cover, img[class*='poster'], img[class*='cover']"
    );
    const imageUrl = image?.currentSrc || image?.src;
    if (imageUrl) return imageUrl;
    const metaUrl = document.querySelector('meta[property="og:image"]')?.content;
    return metaUrl ? new URL(metaUrl, location.href).href : "";
  }

  function syncStageArtwork() {
    const rails = document.querySelectorAll(
      ".stage-grid, .stage-rail, .mission-grid, .mission-rail, .region-rail, .level-grid"
    );
    const artUrl = stageArtworkUrl();
    if (!artUrl) return;
    const shellSelector = [
      "[data-wp-standard-stage-screen]",
      "#stagePanel",
      "#stageScreen",
      "#stageSelectPanel",
      "#stageSelect",
      "#stageView",
      "#levelSelect",
      "#menuPanel",
      ".stage-panel",
      ".stage-screen",
      ".stage-shell",
      ".stage-select",
      ".level-select",
      ".menu-shell",
      "#overlay",
    ].join(",");

    const activeShells = new Set([...rails]
      .filter((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden")
      .map((rail) => rail.closest(shellSelector))
      .filter(Boolean));

    document.querySelectorAll(".wp-stage-art-shell").forEach((shell) => {
      if (activeShells.has(shell)) return;
      shell.classList.remove("wp-stage-art-shell");
      shell.removeAttribute("data-wp-stage-art");
      shell.style.removeProperty("--wp-stage-art");
    });

    activeShells.forEach((shell) => {
      if (shell.dataset.wpStageArt !== artUrl) {
        shell.dataset.wpStageArt = artUrl;
        shell.style.setProperty("--wp-stage-art", `url("${artUrl.replaceAll('"', '\\"')}")`);
      }
      shell.classList.add("wp-stage-art-shell");
    });
  }

  function installStageArtworkSync() {
    document.body.dataset.wpGameId = currentGameId();
    let queued = false;
    const queueSync = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        syncStageArtwork();
      });
    };
    const observer = new MutationObserver(queueSync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "hidden", "style"],
      childList: true,
      subtree: true,
    });
    window.addEventListener("pageshow", queueSync);
    window.addEventListener("resize", queueSync);
    queueSync();
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
    document.addEventListener("DOMContentLoaded", () => {
      render();
      installStageArtworkSync();
    }, { once: true });
  } else {
    render();
    installStageArtworkSync();
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
