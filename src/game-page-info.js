(function () {
  const sharedAssetBase = new URL(".", document.currentScript?.src || location.href);
  if (!document.querySelector('link[href*="stage-selector-standard.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("stage-selector-standard.css?v=20260716-kids-stage-swipe3", sharedAssetBase).href;
    link.dataset.wpStageStandard = "true";
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[src*="stage-selector-standard.js"]')) {
    const script = document.createElement("script");
    script.src = new URL("stage-selector-standard.js?v=20260716-kids-stage-swipe3", sharedAssetBase).href;
    script.dataset.wpStageStandard = "true";
    document.head.appendChild(script);
  }
  if (!document.querySelector('link[data-wp-battle-standard], link[href*="battle-canvas-standard.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("battle-canvas-standard.css", sharedAssetBase).href;
    link.dataset.wpBattleStandard = "true";
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[data-wp-battle-standard], script[src*="battle-canvas-standard.js"]')) {
    const script = document.createElement("script");
    script.src = new URL("battle-canvas-standard.js", sharedAssetBase).href;
    script.dataset.wpBattleStandard = "true";
    document.head.appendChild(script);
  }
  const games = {
    "wonder-crash": {
      title: "Fantasy Lion Defense",
      age: "5+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      intro:
        "Fantasy Lion Defense is a 30-stage animal defense game starring Boom Mane Leo. The lion moves along a fantasy wall while equipped erasers, pencils, and rulers fire on separate cooldowns. Eight beast roles attack in authored lane, alternating, edge, and center formations, and every fifth stage ends with a different Boss pattern. Between waves, the player chooses temporary Battle upgrades; after settlement, saved coins improve Leo, equipment, or the wall. Kids can retry without a timer, and the game remains permanently ad-free.",
      story: [
        "Boom Mane Leo guards the wall outside WeightPlay's enchanted school-supply vault. Wild boars, trickster hyenas, armored rhinos, charging buffalo, hawks, bears, tigers, and crocodiles are drawn toward the magic stored inside its pencils, rulers, and erasers. Leo cannot leave the wall unprotected, so the player patrols its width, keeps the automatic weapons aligned with incoming lanes, and repairs damage between expeditions.",
        "The campaign crosses six five-stage defense routes. Each route ends when a named beast commander is defeated at Stages 5, 10, 15, 20, 25, or 30. A first clear opens the next stage; a Boss first clear also grants the recorded diamond bonus. Clearing Bear Starfall at Stage 30 means the full beast roster has been driven away and the vault can reopen safely."
      ],
      systems: [
        "Leo moves horizontally by dragging or tapping the battlefield; a focused keyboard can also use Left and Right Arrow. Equipped weapons fire automatically, but each slot owns its cooldown, so duplicate weapons still produce separate shots. Pencil, ruler, and eraser builds differ in speed, damage, size, and firing rhythm.",
        "Every stage contains three to seven waves. Defeated beasts award coins, and the wall must retain at least one HP until the last enemy is gone. Between waves, three temporary choices can improve damage, cooldown, projectile count, side shots, bursts, size, piercing, splash, defeat healing, coin gain, slowing, or immediate wall repair.",
        "The eight enemies are mechanical roles rather than cosmetic swaps: boars and tigers rush, hyenas and bears curve sideways, rhinos reduce an opening hit with armor, buffalo and crocodiles punish the wall, and hawks dash. Authored type pools and formation positions make later stages emphasize different target priorities instead of drawing every beast randomly.",
        "Bosses keep their beast identity and add a unique projectile rule. The Boar Captain fires quick pursuit shots; the Hyena creates paired crossfire; the Rhino begins behind six shield hits and throws a heavy orb; the Buffalo aims a large siege orb at wall center; the Hawk combines repeated dashes with twin fast shots; and the Bear casts three-orb starfall.",
        "Stage unlocks, permanent upgrades, equipped weapons, coins, and claimed Boss diamond bonuses are stored in this browser. Result shows remaining wall HP, defeated beasts, upgrade choices, rewards, and either the next stage or a replay/menu route."
      ],
      how: ["Open Battle and swipe the horizontal rail to an unlocked stage.", "Read the stage name, enemy portraits, formation clue, wave count, and Boss badge before starting.", "Move Leo beneath the lane that most needs weapon coverage; firing is automatic.", "Choose one upgrade after each completed wave and adapt it to the next enemy mix.", "Keep the wall above zero HP until every normal beast and Boss is defeated.", "Use settlement rewards for permanent hero, equipment, or wall upgrades, then continue or replay."],
      strategyTips: [
        "Piercing and splash are strongest against fixed lanes or center-heavy formations; side shots cover alternating and edge attacks.",
        "Do not chase every fast beast. Hold a useful firing lane and move early when a hawk or tiger begins a dash.",
        "Against the Rhino Bulwark, rapid multi-shot attacks remove six shield hits efficiently before heavier damage matters.",
        "Save wall repair and defeat-healing choices for breaker-heavy stages such as Buffalo Siege and Crocodile Siege.",
        "The final Bear Starfall spreads three weaker orbs. Broad damage can control its mixed escort while movement keeps Leo aligned with dangerous lanes."
      ],
      progression: [
        "Stages 1-5 teach straight lanes, alternating entrances, and zigzag hyenas. Boar Pursuit closes the route with quick aimed shots behind a mixed escort.",
        "Stages 6-10 introduce armored center screens, wall breakers, curving casters, and sky rushes. Hyena Crossfire adds paired projectiles while mixed enemies enter from both edges.",
        "Stages 11-15 isolate enemy roles so the player can compare piercing against a Rhino Column, speed coverage against Twin Sprinters, and repair against a Breaker Line. Rhino Bulwark requires six shield hits before full Boss damage.",
        "Stages 16-20 combine diving hawks with armor and curved routes. Buffalo Siege focuses heavy enemies in the center and adds a large, slow, high-damage siege orb aimed at the wall.",
        "Stages 21-25 mix guarded runners, zigzag sprinters, heavy gates, and flank attacks. Hawk Dive Squadron repeatedly accelerates and fires two fast projectiles, rewarding early repositioning.",
        "Stages 26-30 review all eight roles through lane, alternating, center, and edge formations. Bear Starfall finishes the campaign with the complete roster and a three-projectile casting pattern rather than another numeric copy of an earlier Boss."
      ],
      designNote:
        "We use automatic weapon fire so the player's continuous decision is where Leo should stand, not whether a small fire button registered on a phone. Separate slot cooldowns preserve equipment-building value, while between-wave upgrades create short tactical pauses. The 30-stage revision replaces the old late-game all-beast randomness with authored compositions and four readable spawn formations. Six Boss projectile patterns provide checkpoints without adding hostile imagery beyond the existing fantasy animal defense tone. Phone drag, tap movement, and desktop Arrow keys all control the same bounded logical battlefield. Unlike Animal Color Lunchbox, this game asks for reaction and build choices, but it keeps the Kids contract: no ads, no countdown pressure, supportive retry, and no claim that the Skill Report is a formal assessment.",
      parent:
        "Fantasy Lion Defense uses cartoon animal combat, automatic school-supply weapons, wall HP, and upgrade decisions. It may support reaction, focus, planning, and hand-eye coordination during short sessions, but the Skill Report and stars are playful summaries rather than a developmental, medical, or school assessment. The Kids page is ad-free, sign-in is not required, and progress stays in the current browser unless its storage is cleared.",
      faq: [
        ["How many stages are in Fantasy Lion Defense?", "There are 30 authored stages in six five-stage routes, with Boss battles at Stages 5, 10, 15, 20, 25, and 30."],
        ["Do the weapons fire by themselves?", "Yes. Every equipped slot fires on its own cooldown while the player moves Leo and chooses between-wave upgrades."],
        ["Why do later stages feel different?", "They use specified beast compositions and lane, alternating, edge, or center formations. Later Bosses also use different projectile patterns."],
        ["What happens if the wall reaches zero HP?", "The run ends with a retry and stage-select choice. Permanent progress already saved in the browser remains available."],
        ["How are Boss diamonds earned?", "Each Boss stage grants its recorded diamond bonus only on the first clear; replaying still provides normal stage rewards."],
        ["Can the game be played without a mouse?", "Yes. Touch supports tapping and dragging, and a focused desktop Battle supports Left and Right Arrow keys."],
        ["Does this Kids game show ads or require an account?", "No. It requests no advertising and does not require sign-in; progress is stored locally in the browser."],
        ["Does the Skill Report measure ability?", "No. Wall HP, defeated beasts, choices, stars, and scores are game feedback only, not a test or diagnosis."],
      ],
    },
    "color-lunchbox": {
      title: "Animal Color Lunchbox",
      age: "3+",
      difficulty: "Easy",
      time: "1-3 minutes",
      skills: ["Color Recognition", "Focus", "Hand-Eye Coordination"],
      intro:
        "Animal Color Lunchbox is a gentle picture-led sorting game with 30 five-food levels. Children help six animal Guardians prepare picnic, breakfast, garden, and festival lunchboxes by matching each food to its real color. Later levels add close color choices, harmless empty boxes, picture-only clues, and boxes that settle into new positions only after a correct match. There is no timer, advertising, or losing screen: an incorrect choice simply invites another try.",
      story: [
        "The Rainbow Pantry supplies meals for animal friends across six neighborhood routes. Its labels have blown loose, so strawberries, rice, fish, vegetables, drinks, and treats must be placed in the right colored lunchboxes before each delivery leaves. The player is the pantry helper. Completing five matches packs one delivery and opens the next stop.",
        "Mimi, Orla, Nori, Pogo, Taro, and Fia wait at Levels 5, 10, 15, 20, 25, and 30. These Guardians do not fight or punish mistakes. Each introduces a friendly check: a one-time box move, repeated safe shuffles, picture-first matching, extra unused boxes, a halfway mirror, or a final combination. Finishing Fia's festival check means every route has received a correctly sorted lunchbox."
      ],
      systems: [
        "Every level contains exactly five food prompts. The current food appears as a large picture, and the available lunchboxes show color swatches. Players may tap a box or drag the food onto it; both inputs use the same answer rule.",
        "Correct matches fill one fifth of the progress bar and award a food sticker for the result parade. A wrong box stays available and gives supportive feedback, so the child can look again without losing a life or restarting the level.",
        "Picture-only levels visually remove printed food and color names while keeping accessible labels for screen readers. Decoy levels add one or two unused boxes, but the correct color is always present. Moving-box levels rearrange choices only after a correct answer and never while a drag is active.",
        "The highest unlocked level is stored locally in the browser. A returning player can replay any unlocked card; clearing a level unlocks the next one, and Level 30 remains replayable after the festival is complete."
      ],
      how: ["Choose an unlocked level from the horizontal level path.", "Look at the large food picture and compare it with the lunchbox colors.", "Tap the matching lunchbox, or drag the food onto it.", "If a box moves after a match, wait for it to settle before choosing again.", "Pack all five foods to see the sticker parade and unlock the next level."],
      strategyTips: [
        "Name the food first, then check its visible color; this helps when two warm or cool colors appear together.",
        "In picture-only levels, use the food itself and the large color swatches rather than searching for text.",
        "When an extra box has no matching food, treat it as a looking clue rather than guessing quickly.",
        "After boxes settle into new places, pause and scan the full row again. Their colors do not change."
      ],
      progression: [
        "Levels 1-5 establish fixed-box matching with familiar fruit, vegetables, and pantry foods. Mimi closes the first route by moving the boxes once after the third correct food.",
        "Levels 6-10 compare warm, cool, light, and dark colors. A picture-only picnic removes visible words, and Orla's check rearranges boxes after every successful match.",
        "Levels 11-15 introduce close pairs such as red and pink or blue and cyan, plus one harmless unused box. Nori combines picture-first clues with a decoy choice.",
        "Levels 16-20 group foods by vegetable, fruit, breakfast, and snack themes. Pogo's buffet presents seven boxes for five foods, requiring careful elimination without extending the session.",
        "Levels 21-25 revisit moving boxes and picture matching in stronger combinations. Taro mirrors the box order once halfway through the garden check.",
        "Levels 26-30 use six-box rainbows, warm-and-cool alternation, two decoys, and repeated safe movement. Fia's festival combines picture-only clues, one unused box, and a shuffle after each correct answer."
      ],
      designNote:
        "We kept every level to five foods so a young player can finish a complete task in a short sitting. The game supports both tapping and dragging because either movement may be more comfortable on a particular phone, tablet, mouse, or accessibility setup. Difficulty comes from observation rather than speed: close colors, unused boxes, and position changes are introduced one idea at a time, with visible settling animations and locked input during motion. The Guardian checkpoints give the 30-level path memorable landmarks without turning a preschool sorting game into combat. Unlike WeightPlay's action games, Animal Color Lunchbox has no timer, lives, ads, or failure state; its purpose is calm repeated practice and a clear sense of completion.",
      parent:
        "This game may help children practice color recognition, visual comparison, focus, and hand-eye coordination. Adults can ask the child to name the food or explain why two colors look different, but reading is not required. Progress and scores stay in the local browser and are for play only; they are not a developmental test, diagnosis, or school assessment.",
      faq: [
        ["Can young children play without reading?", "Yes. Food pictures and color swatches carry the core instructions, and picture-only levels deliberately avoid visible answer words."],
        ["How many levels are included?", "There are 30 levels, each containing exactly five food matches, with Guardian checkpoints every five levels."],
        ["Why do some lunchboxes move?", "Selected later levels rearrange boxes after a correct match. Input is paused during the short settling animation, and boxes never move during a drag."],
        ["Can an extra box make a level impossible?", "No. Decoy boxes are unused colors; the correct lunchbox for every food is always present."],
        ["Is the game timed or can a child lose?", "There is no timer, life limit, or losing screen. A wrong choice gives supportive feedback and another try."],
        ["Does progress carry over?", "The highest unlocked level is saved in this browser. Clearing browser storage may remove that local progress."],
        ["Does Animal Color Lunchbox show ads?", "No. This Kids game does not request ads or reserve advertising space."],
        ["Are scores formal assessments?", "No. Scores and progress are playful feedback, not a measure of development or ability."],
      ],
    },
    "bubble-bakery": {
      title: "Animal Bubble Bakery",
      age: "6+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Animal Bubble Bakery is a 30-stage, move-limited matching puzzle led by Panko the Bakery Coach. Players tap connected groups of bunny, whale, chick, frog, or fox bubbles to fill recipe trays. The 7-by-10 board collapses after every clear and drops new bubbles from above. Later stages add minimum batch sizes, ordered queues, two- and three-tray service, large-group goals, and bonus batches. Every fifth stage is a friendly Panko Check, and the Kids version remains permanently ad-free.",
      story: [
        "Panko runs a small bakery where each animal customer uses a picture stamp instead of a written ingredient list. Bunny bubbles mark berry treats, whales mark ocean cupcakes, chicks mark sunny pastries, frogs mark garden rolls, and foxes mark berry cakes. A delivery cart arrives after a limited number of moves, so the player helps Panko combine connected stamps and finish each visible tray before the cart leaves.",
        "The 30 orders form six bakery lessons. Panko reviews the counter at Stages 5, 10, 15, 20, 25, and 30, but these checkpoints are friendly recipe tests rather than battles. Completing Panko's Master Bakery serves three queued trays, proves a six-bubble batch can be prepared, and opens every tray for replay and star mastery."
      ],
      systems: [
        "The board always contains 70 native bubble buttons in seven columns and ten rows. A group clears only when matching bubbles touch vertically or horizontally; diagonal contact does not connect them. Cleared bubbles shrink in their original cells, bubbles above fall, and new bubbles enter from the masked top edge.",
        "Each valid clear spends one move. Only active order animals reduce the tray counters, while non-order groups can still reshape the board. Consecutive order hits build an order streak and score bonus. Result stars depend on moves left, and the Skill Report records order-hit moves, largest cleared group, and best streak.",
        "Minimum-batch stages require groups of three or four before a tap can clear. Sequence stages highlight one order animal at a time; clearing a later animal reshapes the board but does not advance its counter. Bonus stages let a group of four, five, or six count extra toward the active order.",
        "Multi-tray stages keep the same board and remaining moves when the next recipe appears. Group-goal stages require one clear large enough to reach the displayed target as well as completing the order counters. Stage 30 combines three recipes, four-bubble minimums, sequence order, a six-bubble bonus threshold, and a largest-group goal of six.",
        "Unlocked stages, best stars, stage score evidence, customer stamps, sticker count, play count, and best reached stage are stored locally in this browser. Sign-in is not required; clearing browser site data may remove those records."
      ],
      how: ["Choose an unlocked tray from the horizontal Stage rail.", "Read the animal order chips and compact rule symbols before tapping.", "Tap two or more vertically or horizontally connected matching bubbles; later trays may require three or four.", "Use non-order clears only when they create a better route to the highlighted target.", "Complete every recipe phase and any displayed largest-group goal before moves reach zero.", "Use Result to continue, retry, return to Stages, or replay earlier trays for more stars."],
      strategyTips: [
        "Scan from the bottom upward. Clearing a low group moves more bubbles and creates more possible connections.",
        "In a sequence order, protect groups for later animals until their chip receives the bright active outline.",
        "On minimum-batch stages, do not spend moves on pairs; combine them through a nearby clear until the required size exists.",
        "Large-batch bonuses can finish an order with fewer moves, but a group-goal stage still needs the displayed largest clear at least once.",
        "Multi-tray service does not reset the board, so leave useful clusters for animals that appear in the next recipe."
      ],
      progression: [
        "Stages 1-5 establish normal connected clears, two-target choices, the first group-size goal, and a four-bubble bonus. Panko's First Check accepts only groups of three or more and also asks for one group of four.",
        "Stages 6-10 focus on large batches. The minimum rises from three to four, bonus thresholds reward deliberate clustering, and Panko's Big-Batch Check requires every order clear to use a group of four plus one group of five.",
        "Stages 11-15 introduce ordered queues. Only the highlighted animal advances, and Panko's Queue Check carries that rule across two recipes without resetting the board.",
        "Stages 16-20 introduce two- and three-course service. The board and move count continue between trays, so preparation for a later recipe matters before the first is finished.",
        "Stages 21-25 combine queues, minimum groups, bonuses, multiple recipes, and group goals. Panko's Festival Check asks for two ordered trays using groups of at least three.",
        "Stages 26-30 are mastery orders. They require larger clusters and three-tray planning rather than just higher counters; the final checkpoint visibly combines a four-bubble minimum, ordered targets, bonus batches, three recipes, and a six-bubble mastery goal."
      ],
      designNote:
        "We kept the board at 7 by 10 because it fills a portrait phone while preserving round bubble proportions and enough space for real group planning. A tap is the only Battle action, but each clear changes gravity, future connections, order streaks, and remaining moves. The 30-stage revision adds rules that change which group is useful instead of merely increasing targets. Panko checkpoints provide memorable difficulty landmarks without introducing combat to a bakery puzzle. Keyboard and screen-reader players receive native buttons with animal, row, column, connected-group size, active-order status, and current minimum. Unlike Animal Color Lunchbox's direct one-item sorting, Bubble Bakery asks players to reshape a persistent board and plan several moves ahead.",
      parent:
        "Animal Bubble Bakery may support visual grouping, counting, planning, focus, and simple problem solving. Adults can ask why a low clear changes the board or which cluster should be saved for the next tray. There is no timer, advertising, account requirement, or ranking pressure. Stars, scores, stamps, stickers, and the Skill Report are playful local feedback, not an intelligence test, diagnosis, or formal school assessment.",
      faq: [
        ["How many stages are in Animal Bubble Bakery?", "There are 30 named stages in six five-stage lessons, with friendly Panko Checks every fifth stage."],
        ["Which bubbles form a connected group?", "Matching bubbles connect vertically and horizontally. Diagonal bubbles are not part of the same group."],
        ["Why did a matching group not fill the order?", "The stage may require a larger minimum group or a specific highlighted animal in an ordered queue."],
        ["What happens between recipe trays?", "The next recipe replaces the order counters, but the board and remaining moves continue, so saved clusters still matter."],
        ["How do bonus batches work?", "On marked stages, reaching the shown group threshold counts extra bubbles toward the active order."],
        ["What happens when moves reach zero?", "An unfinished order opens a supportive retry Result. Saved unlocks and earlier stars remain available."],
        ["Does the game require login or show ads?", "No. This Kids game is ad-free and uses local browser storage without requiring an account."],
        ["Is the Skill Report an ability test?", "No. It summarizes this run's order hits, largest group, streak, score, and remaining moves for game feedback only."],
      ],
    },
    "animal-rope-rescue": {
      title: "Animal Vine Rescue",
      age: "6+",
      difficulty: "Easy to Medium",
      time: "2-6 minutes",
      skills: ["Hand-Eye Coordination", "Problem Solving", "Focus"],
      intro:
        "Animal Vine Rescue is a 30-stage animal physics puzzle about cutting a hanging fruit free, steering a leaf trampoline, and landing the fruit in a waiting animal's basket. The campaign is divided into six five-stage rescue lessons. Later routes add moving baskets, upper and lower wind layers, wind that reverses after a bounce, two-bounce deliveries, narrower catch zones, and two- or three-fruit picnic orders. Every fifth stage is a friendly Panko Check that combines the current lesson without adding combat or time pressure.",
      story: [
        "The orchard delivery vines have grown across a forest clearing, leaving apples, bananas, and berries hanging far from the animals who requested them. Panko organizes the rescue map while rabbits, lions, pandas, foxes, and koalas wait beside their baskets. The player is the leaf guide: they choose where the trampoline waits, decide when to cut, and keep steering while the fruit is airborne.",
        "Clearing all 30 routes restores six delivery paths through the orchard. The final Panko Grand Rescue serves three animals in one Battle and combines layered wind, a moving basket, and a two-bounce route. Victory represents a complete picnic delivery rather than defeating an enemy."
      ],
      systems: [
        "Every route begins with a fruit attached to a visible vine, a movable leaf trampoline, and a basket target. The leaf can move before and after Cut. A falling fruit must contact the leaf at least once before the basket accepts it, so simply releasing a fruit directly above the animal is not enough.",
        "Fruit acceleration uses the route's gravity and active wind. The leaf adds upward velocity and horizontal direction based on where the fruit hits its surface. A centered contact creates a straighter bounce; an edge contact sends the fruit farther sideways. Missing the basket or leaving the playfield opens a supportive Retry Result without removing saved progress.",
        "Moving-basket routes update the catch position continuously after Cut. Layered-wind routes apply different force above and below the displayed height split. Reverse-wind routes switch direction after the first leaf contact. Two-bounce routes keep the basket locked until the required second bounce, and soft-leaf routes reduce bounce height so the player must stay closer to the falling fruit.",
        "Multi-delivery routes keep the player inside the same Battle. The next fruit, animal, and route appear after a successful catch, while the delivery counter advances from 1/2 or 1/3. Result appears only after every listed fruit reaches its basket.",
        "The highest unlocked stage, best stars per stage, best score, and play count are saved locally in the current browser. No sign-in is required; clearing browser site data may remove that local progress."
      ],
      how: ["Choose an unlocked rescue card from the horizontal Stage rail.", "Read the stage name, fruit-to-animal route, and visible rule clue.", "Move the leaf with touch, pointer, or Left/Right keys, then press Cut.", "Keep steering while the fruit falls and use the leaf contact point to change its direction.", "Complete the required bounce count and follow a moving basket or changing wind when shown.", "Deliver every fruit in the route to unlock the next Stage."],
      strategyTips: [
        "Place the leaf under the first falling path before pressing Cut, then make smaller corrections while the fruit is moving.",
        "Hit near the middle of the leaf for height. Use the left or right edge only when the basket is far across the clearing.",
        "For a moving basket, aim for where it will be after the bounce rather than where it was at Cut.",
        "On layered-wind routes, compare the fruit's direction before and after it crosses the middle of the clearing.",
        "A two-bounce route needs control after the first contact; do not send the fruit so far sideways that the second leaf catch becomes impossible.",
        "During picnic orders, read the next delivery instead of assuming the second fruit uses the same wind or bounce rule."
      ],
      progression: [
        "Stages 1-5 teach calm, rightward, leftward, and long-crossing bounces. Panko's Balance Check adds the first gently moving basket.",
        "Stages 6-10 focus on moving targets. Basket speed, direction, and opening size change, and Panko's Moving-Basket Check requires two leaf contacts before the catch.",
        "Stages 11-15 introduce wind that changes by height or reverses after a bounce. Panko's Wind Check combines layered force with a moving basket.",
        "Stages 16-20 require two bounces and introduce a softer leaf that produces a lower arc. Panko's Twin-Bounce Check also reverses the wind and moves the basket.",
        "Stages 21-25 introduce two-fruit picnic deliveries without leaving Battle. The two routes may use opposite winds, different bounce counts, or one shared moving basket.",
        "Stages 26-30 combine narrow catches, moving targets, layered and reversing winds, two-bounce control, and two- or three-fruit service. Panko's Grand Rescue uses three different deliveries rather than a numeric-only finale."
      ],
      designNote:
        "The game uses one cut action plus continuous leaf steering so the player remains responsible after the fruit is released. The 30-stage structure changes the information a player must read—target motion, altitude-based wind, bounce count, leaf power, catch width, and delivery sequence—rather than relying only on faster gravity. The portrait playfield gives a falling fruit enough travel time for visible correction on phones, while the same logical Canvas scales uniformly on tablets and landscape screens. Panko checkpoints create memorable Kids-friendly milestones without turning a fruit-delivery puzzle into combat.",
      parent:
        "Animal Vine Rescue may support timing, visual prediction, hand-eye coordination, focus, and simple problem solving. Adults can ask where the basket will move or why the second bounce needs a different leaf position. There is no timer, advertising, account requirement, ranking pressure, or hostile combat. Stars and saved progress are playful local feedback, not a formal ability test, diagnosis, or school assessment.",
      faq: [
        ["How many stages are in Animal Vine Rescue?", "There are 30 named stages in six five-stage lessons, with friendly Panko Checks every fifth stage."],
        ["Can I move the leaf after cutting the vine?", "Yes. Continuous steering during the fall and after each bounce is the main player action."],
        ["Why did the fruit pass the basket?", "Every delivery requires at least one leaf bounce, and marked routes may require two bounces or use a narrower opening."],
        ["How do moving baskets and wind layers work?", "Moving baskets change horizontal position after Cut. Wind-layer routes apply different force in the upper and lower parts of the clearing."],
        ["What happens in a picnic delivery?", "Two or three fruit routes continue inside the same Battle. Result waits until every delivery is complete."],
        ["What happens when a fruit misses?", "A supportive Result offers Try Again, Stages, or Lobby without deleting unlocked progress."],
        ["Does the game require login or show ads?", "No. This Kids game is ad-free and stores basic progress locally without requiring an account."],
        ["Are stars a formal ability score?", "No. Stars are only game progress feedback and are not a diagnosis or assessment."],
      ],
    },
    "animal-zoo-idle": {
      title: "Animal Zoo Idle",
      age: "6+",
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
        ["What age is it for?", "It is recommended for age 6+ and family play."],
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
        ["Why is Safari Dash 9+?", "It has faster reactions and score pressure than games designed for younger children."],
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
    "animal-bubble-safari": {
      title: "Animal Bubble Safari",
      age: "6+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Focus", "Hand-Eye Coordination", "Problem Solving"],
      intro:
        "Animal Bubble Safari is a picture-led bubble shooter where players aim direct and bank shots, match animal bubbles, and rescue safari friends across 12 compact stages. Special bubbles add new ways to solve blocked routes without adding harsh time pressure.",
      how: ["Drag to aim, then release to shoot.", "Connect three or more matching animal bubbles.", "Use wall bounces and special bubbles to reach blocked targets.", "Complete the goal before your bubbles run out."],
      parent:
        "This ad-free Kids game supports focus, planning, and hand-eye coordination through short sessions. Stars and progress stay on this device and are not a formal assessment.",
      faq: [
        ["How many stages are included?", "There are 12 stages with direct shots, bank shots, rescues, and special bubbles."],
        ["Is reading required?", "The core play is picture-led, with short labels and an optional guide."],
        ["Is Animal Bubble Safari ad-free?", "Yes. WeightPlay Kids games are permanently ad-free."],
      ],
    },
    "animal-habitat-mahjong": {
      title: "Animal Habitat Mahjong",
      age: "9+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Logic", "Focus", "Problem Solving"],
      intro:
        "Animal Habitat Mahjong is a calm mahjong solitaire puzzle with 15 layered animal-tile boards. Players match free tiles, plan around covered pieces, and unlock forest, safari, ocean, and arctic habitat pages.",
      how: ["Find two identical animal tiles.", "Choose tiles with nothing above them and at least one open side.", "Use Hint, Undo, or Shuffle when you need help.", "Clear every pair to unlock the next habitat board."],
      parent:
        "This ad-free Kids puzzle supports focus, logic, planning, and problem solving without a timer limit. Best scores and progress stay on this device.",
      faq: [
        ["How many boards are included?", "There are 15 layered habitat boards."],
        ["What makes a tile free?", "A free tile has nothing covering it and has an open left or right side."],
        ["Is there a timer limit?", "No. Time is recorded only for your local best result."],
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
      difficulty: "Medium",
      time: "8-15 minutes per mission",
      gameplay: "Turn-Based Roguelike Deckbuilder",
      genre: ["Card Strategy", "Roguelike", "Animal Adventure"],
      skills: ["Logic", "Problem Solving", "Focus"],
      guideKicker: "WeightPlay Original Game Guide",
      guideTitleSuffix: "Game Guide",
      noteTitle: "Player and Save Information",
      hideScoreBands: true,
      intro: "Beast Deck: The Mist Forest is a 30-mission turn-based deckbuilding campaign built around visible enemy intent and animal-power card combos. Each mission contains three battles and two temporary drafts. Six five-mission regions introduce armor, riposte, Exhaust, marks, regeneration, cleanse, Weak, seals, curses and triad wards. Missions 5, 10, 15, 20, 25 and 30 end with different phase-changing Bosses.",
      story: [
        "The Mist Forest was once divided into six routes used by animal wardens: Mist Trail, Ironroot Works, Amber Hunt, Mirecoil Basin, Moon Archive and Mist Crown. When crown mist began moving against the wind, ordinary animals became corrupted and the routes stopped communicating. Shadow Boars and Vipers occupied the first trail, Ironroot creatures built countering armor, Amber hunters marked anything that crossed their territory, and Mirecoil beasts learned to regenerate through poison. The Moon Archive sealed away whole classes of animal powers, while the final court filled clean draws with Mist Curses.",
        "The player keeps the Beast Deck, a field book that calls on friendly animal strengths. Wolf Pack attacks, Guard Bear and Iron Tortoise create Block, Sky Hawk combines damage with a draw, Cheetah Sprint supplies cards and Energy, Viper Venom builds Poison, and Owl Wisdom searches the deck. Clearing a mission reconnects its route; defeating the Mist Crown Monarch in Mission 30 breaks the source ward and reopens all six."
      ],
      systems: [
        "Turn structure: a player turn restores Energy, clears temporary Block and draws three cards. Played or leftover cards enter the discard pile; when the draw pile empties, the discard pile is shuffled back. Visible intent identifies the enemy's next action unless fog is active.",
        "Card interactions: Wolf Pack deals 6 damage, or 12 after another Attack. Sky Hawk deals 14 and draws one. Guard Bear grants 6 Block, Iron Tortoise 15, Cheetah Sprint draws two and refunds one Energy, Viper Venom applies three Poison, and Owl Wisdom draws one for free. Poison triggers after the enemy action; enemy Block absorbs a fixed amount.",
        "Regional mechanics: armor reduces each direct hit; riposte counters the next Attack; Exhaust raises one card's next cost; marks punish ending with a named card; Weak reduces the next Attack. Regeneration heals, cleanse removes Poison, haste skips through intent order, fog hides an intent, and seals disable one card type for a turn.",
        "Mist Crown rules: temporary curses cost one Energy to remove; holding one at turn end deals damage before it cycles through discard. The triad ward blocks direct damage until Attack, Defense and Utility cards have all been used. Progress crosses turns, but the final Boss can rebuild the ward.",
        "Mission building: after Battles 1 and 2, choose one temporary card from three; it enters the next opening hand. Permanent Beast Packs cost 80 earned Coins and award a card or equipment, with duplicates raising rank. Up to six owned cards and one equipment item can be prepared before a mission.",
        "Persistent growth: XP raises level and Max HP. Mist Cloak adds HP, Hunter Charm adds Energy and Forest Banner adds opening Block. Missions, collection, loadout, equipment, level, XP and Coins save locally. The optional 15-Diamond Mist Amulet adds HP, requires confirmation and does not gate the campaign."
      ],
      how: [
        "Swipe the Mission Preparation rail and choose any unlocked mission; all 30 route cards remain visible.",
        "Use Deck to equip six permanent cards and one equipment item. Upgrade contains earned-Coin packs and the optional Mist Amulet.",
        "Read enemy intent, then tap a card whose Energy can be paid. Disabled cards explain Energy, turn or seal restrictions.",
        "Order cards carefully: enable Wolf Pack's combo, draw before spending the last Energy, and Block before a large attack.",
        "After Battles 1 and 2, draft one temporary card for the next opening hand.",
        "Defeat the third elite or checkpoint Boss before HP reaches zero.",
        "On victory, continue, retry or return to preparation. Failed missions keep permanent progress."
      ],
      strategyTips: [
        "Haste can skip an expected intent; fog removes intent information for one turn.",
        "Against armor, prefer one large hit over several small ones. Poison ignores armor and wards.",
        "Do not attack into riposte. Block, draw or apply Poison until the stance changes.",
        "Play a marked card before ending the turn; drawing more can make it harder to locate.",
        "Burst through regeneration, and wait until after cleanse before stacking Poison.",
        "Break a triad ward with Utility and Defense before the Attack meant to deal damage.",
        "Level and equipment improve safety, but reading the current mechanic matters more than repeated grinding."
      ],
      progression: [
        "Missions 1-5 teach intent, Block, Poison and armor. Stoneback Behemoth thickens armor at two Boss thresholds.",
        "Missions 6-10 add riposte and Exhaust. Ironroot Warden raises counter damage at each phase.",
        "Missions 11-15 add haste, marks and Weak. Amber Huntmaster accelerates as health falls.",
        "Missions 16-20 combine regeneration, Poison and cleanse. Mirecoil Hydra gains stronger passive healing by phase.",
        "Missions 21-25 rotate Attack, Defense and Utility seals. Moon Archive Keeper changes the forbidden type by phase.",
        "Missions 26-30 add curses, fog and triad wards. Mist Crown Monarch reforms its ward in the final phase; Mission 30 ends the authored campaign rather than starting a numeric endless loop."
      ],
      designNote: "Three encounters give two draft choices enough time to matter without creating an endurance run. Intent stays visible unless fog is the rule, tying losses to readable decisions. Mission 30's numerical ceiling remains close to the former eight-mission version; difficulty now comes from overlapping mechanics. Phone and desktop use the same card order and tap/click actions. Unlike Animal Auto Squad's pre-battle planning, Beast Deck resolves every turn; unlike Animal Rune Tactics, it replaces grid position with draw order, Energy and discard timing.",
      parent: "This browser locally stores missions, level, XP, Beast Coins, collection, loadout, equipment ranks and Mist Amulet ownership. No login is required; clearing site storage may remove progress. Earned-Coin packs and all six Bosses require no Diamonds. The optional Mist Amulet confirms the resulting balance before spending. Skill labels are not a formal assessment.",
      faq: [
        ["Is Beast Deck free?", "Yes. All 30 missions, drafts, earned-Coin packs and six Bosses run free in the browser."],
        ["How many Bosses are there?", "Six. Missions 5, 10, 15, 20, 25 and 30 each have a different phase mechanic."],
        ["What is saved?", "Missions, level, XP, Coins, collection, loadout, equipment ranks and Mist Amulet ownership."],
        ["Are drafts permanent?", "No. Battle drafts last for one mission; permanent cards come from earned-Coin packs."],
        ["How do curses work?", "Spend one Energy to remove one. Holding it at turn end deals two damage and cycles it through discard."],
        ["How is the ward broken?", "Use Attack, Defense and Utility cards. Progress crosses turns, but the final Boss can reform it."],
        ["Are Diamonds required?", "No. They only unlock the optional confirmed Mist Amulet and never gate missions or Bosses."],
        ["Does it work on phones?", "Yes. Swipe missions, tap large cards and use the fixed End Turn action."]
      ],
    },
    "animal-relic-hunters": {
      title: "Animal Relic Hunters",
      difficulty: "Hard",
      time: "6-12 minutes per expedition",
      gameplay: "Room Action Roguelite",
      genre: ["Action", "Roguelite", "Animal Adventure"],
      skills: ["Logic", "Problem Solving", "Focus", "Reaction"],
      guideKicker: "WeightPlay Original Game Guide",
      guideTitleSuffix: "Game Guide",
      noteTitle: "Player and Save Information",
      hideScoreBands: true,
      intro: "Animal Relic Hunters is a 30-expedition room-action campaign. Guide the lion explorer through three connected chambers, let the equipped relic weapon fire automatically, and steer around enemies whose behavior changes by ruin region. Relic Orbs create temporary level-up choices during a run, while Gold, training, equipment and mission progress remain on this browser. Six five-mission regions end with six different Guardians rather than one repeated enlarged enemy.",
      story: [
        "The Relic Road once connected Moss Gate, Echo Gallery, Crystal Vault, Sunken Shrine, Moon Archive and Crown Court. When the Crown seal failed, its energy did not simply make local beasts stronger. Moss creatures began dividing and charging, gallery sentries attacked from beyond weapon range, crystal keepers formed impact wards, shrine beasts repaired themselves, and archive hunters interrupted relic fire with silence bolts.",
        "The player guides Boom Mane Lion, a field explorer carrying an automatic relic focus. Every expedition recovers one stretch of the road. Elites in the first two rooms guard Golden Keys; the key opens a chest whose Weapon, Armor or Boots can be kept in the permanent backpack. The third room decides whether the route is safe. Expeditions 5, 10, 15, 20, 25 and 30 lead to the Moss Guardian, Echo Warden, Prism Colossus, Mirecoil Hydra, Archive Keeper and Relic Crown Monarch. Defeating the Monarch means all six archives can exchange relics again instead of remaining isolated behind corrupted chambers."
      ],
      systems: [
        "Expedition flow: choose one unlocked card from the 30-mission rail. Begin Room 1 with full run HP and current equipment. Clear the group and delayed key-carrying Elite, collect its key, open the chest and enter the portal. Room 2 uses a harder mix. Room 3 ends with an Elite guardian or, every fifth mission, a named regional Guardian.",
        "Movement and attacks: use WASD, arrow keys, a held primary mouse button in the arena, or the phone joystick. The weapon automatically aims at the nearest enemy. A Crystal Sword adds direct damage, a Relic Dagger shortens the firing interval, Armor adds Max HP and Boots add movement speed. Position remains the player's main action: circling a chaser, crossing behind a shooter and leaving an orbiter's preferred ring require different routes.",
        "Threat rules: rushers alternate a slow stalk with a fast charge; shooters hold range and fire relic bolts; pulsers launch radial rings; splitters release two rushers when defeated; wards cancel a fixed number of projectile hits; regenerators heal after avoiding damage; slowing beasts reduce movement on contact; orbiters travel around the explorer; silencers temporarily stop automatic fire. Region 6 combines these rules instead of introducing a larger copy of a basic animal.",
        "Guardian phases: each regional Boss changes at 70 and 35 percent HP. Moss calls more rushers. Echo releases larger radial barrages. Crystal restores a hit-count ward. Mire heals and summons slowing beasts. Moon combines orbit movement with silence volleys. Crown adds wards, barrages, summons and recovery. The final mission therefore tests reading several effects, not only surviving a longer health bar.",
        "Run growth: defeated enemies drop green Relic Orbs. Filling the EXP bar pauses the room and offers three relic upgrades, such as damage, attack rate, Max HP, movement or pickup range. One optional three-Diamond reroll is available per draft. Run relic counts reset when a new expedition starts, so the next build may solve the same threat mix differently.",
        "Permanent growth: Gold pickups and duplicate gear conversion feed equipment upgrades. Saved character levels grant training points for damage, HP, speed or magnet range. The backpack records collected gear and which item is equipped in each of three slots. The optional Mist Amulet is a confirmed one-time Diamond purchase that changes starting HP from 30 to 40; it is not required for any mission, chest or Guardian."
      ],
      how: [
        "Swipe the Stage rail and choose an unlocked expedition; Guardian cards appear at missions 5, 10, 15, 20, 25 and 30.",
        "Move with WASD, arrow keys, held mouse input or the virtual joystick. Aim is automatic, so steer to control distance and the nearest target.",
        "Defeat ordinary threats while watching for charges, ranged bolts, shields, regeneration, slow and silence effects.",
        "Collect Relic Orbs. At level-up, choose one of three temporary upgrades or use the single optional reroll.",
        "Defeat the delayed Elite in Rooms 1 and 2, collect its Golden Key, open the chest and decide whether to equip the named drop or keep the current loadout.",
        "Enter Room 3 with the HP and run upgrades that survived the earlier rooms, then defeat its Elite or regional Guardian.",
        "Use Next Mission after a victory or return to Missions to train, upgrade gear and choose another unlocked route."
      ],
      strategyTips: [
        "Do not circle every room in the same direction. Reverse when ranged bolts fill the outside lane, and cut across an orbiter after it commits to its arc.",
        "A blue ring means a ward is still canceling hits. Keep firing only if the lane is safe; movement and survival do not require breaking it immediately.",
        "Touch a regenerator often enough to interrupt its recovery window. A slower, high-damage weapon may be better than scattered low damage there.",
        "Silence bolts stop automatic fire briefly. Use that pause to reposition instead of standing beside a target waiting for the weapon to resume.",
        "Run HP carries into the next room, with only a small heal at the portal. A defensive relic before Room 3 can be more valuable than another damage choice.",
        "Chest gear is claimed before the equip decision. Keeping the current loadout does not discard a new item; it remains in the backpack for later comparison.",
        "Permanent training reduces repetition, but Guardian phases still demand movement. Use the first attempt to learn its pattern rather than spending Diamonds automatically."
      ],
      progression: [
        "Expeditions 1-5 establish nearest-target aiming, ordinary chasers, timed charges and splitting enemies. The Moss Guardian summons rushers at both phase thresholds.",
        "Expeditions 6-10 turn space into a crossfire problem with shooters and radial pulsers. The Echo Warden's expanding volleys make the room edge dangerous.",
        "Expeditions 11-15 introduce hit-count wards and shielded mixed groups. The Prism Colossus rebuilds its protection twice, so burst timing matters.",
        "Expeditions 16-20 combine regeneration, slowing contact and ranged pressure. The Mirecoil Hydra heals and calls slow-field beasts during its phases.",
        "Expeditions 21-25 add orbit routes and temporary attack silence. The Archive Keeper fires multi-angle silence volleys while circling the explorer.",
        "Expeditions 26-30 remix all prior threats. Six-Seal Court is the full regular-enemy exam; the Relic Crown Monarch then combines ward, barrage, summons and recovery."
      ],
      designNote: "Three rooms let relic drafts and chest gear affect a final test without turning one mission into a long survival session. Auto-fire keeps phone input focused on movement, while mouse hold and keyboard preserve precise desktop control. Expedition 30 Room 3 stays below a 2.3 base scale; difficulty comes from range control, phases and mixed behaviors. Unlike Animal Crystal Survivor's open timed arena or Animal Auto Squad's pre-battle formation, room order, carried HP, gear decisions and live navigation form one connected expedition.",
      parent: "Mission progress, character level, EXP, Gold, training, owned gear, gear levels, equipped slots and Mist Amulet ownership are stored locally in this browser. No login is required for basic play, and clearing site storage may remove that progress. The game does not award platform Diamonds from battle. Diamonds are optional spending choices for the confirmed Mist Amulet or one relic-draft reroll; all 30 expeditions and six Guardians can be played without them.",
      faq: [
        ["Is Animal Relic Hunters free?", "Yes. All 30 expeditions, three-room routes, gear drops and six Guardians are playable in the browser without payment."],
        ["How many missions and Bosses are there?", "There are 30 expeditions. Missions 5, 10, 15, 20, 25 and 30 end with six mechanically different regional Guardians."],
        ["What is permanent and what resets?", "Mission unlocks, level, EXP, Gold, training and gear are permanent local progress. Relic choices made during a run reset when a new expedition starts."],
        ["How do wards, slow and silence work?", "Wards cancel a fixed number of projectile hits, slow reduces movement briefly, and silence pauses automatic attacks. None removes steering control."],
        ["Do I lose a new item if I keep my current gear?", "No. A new chest item is added to the backpack first. The decision only chooses whether to equip it now."],
        ["What are Diamonds used for?", "They can confirm the permanent Mist Amulet or reroll one relic draft for three Diamonds. They do not unlock missions, gear or Guardians."],
        ["Does progress require an account?", "No. Progress is stored in this browser. Clearing its site data or switching devices may start a separate save."],
        ["Does it support phones and desktop?", "Yes. Phones use a virtual joystick and large decisions; desktop supports keyboard, arrows and held mouse movement in the arena."]
      ],
    },
    "animal-rune-tactics": {
      title: "Animal Rune Tactics",
      difficulty: "Hard",
      time: "8-15 minutes per mission",
      gameplay: "Turn-Based Squad Tactics",
      genre: ["Strategy", "Tactics", "Animal Adventure"],
      skills: ["Logic", "Problem Solving", "Focus", "Planning"],
      guideKicker: "WeightPlay Original Game Guide",
      guideTitleSuffix: "Game Guide",
      noteTitle: "Player and Save Information",
      hideScoreBands: true,
      intro:
        "Animal Rune Tactics is a 30-mission turn-based campaign played on a three-by-four rune board. The Lion Guardian, Owl Mage and Turtle Shield each take one action before the enemy turn: move, attack, guard or spend Energy on a distinct Skill. Six five-mission chapters introduce blocked routes, snares, currents, fire, rotating runes and seals, together with enemies that counter, push, silence, mark, drain Energy or create clones. Missions 5, 10, 15, 20, 25 and 30 end with six different phased Bosses. Mission unlocks, hero training and Rune Rewards are saved in this browser.",
      story: [
        "The Rune Roads connect six animal territories to the Crown Archive. Each road carries a different kind of stabilizing script: woodland paths hold living roots in place, forge marks bind ironwood, tide glyphs regulate flooded chambers, ember circles vent heat, moon runes preserve memory, and the Crown seals keep all five systems synchronized. When the central crown fractured, those scripts began acting without their keepers. Bridges hardened into rubble, roots closed around travelers, currents moved occupied stones, and archive seals protected the very creatures that had damaged them.",
        "The player commands three keepers sent to restore the roads. Lion Guardian is the close-range front fighter, Owl Mage attacks from two cells away, and Turtle Shield guards and heals the group. Clearing a mission means its script is stable enough for the squad to advance. The Stone Stag, Ironroot Rhino, Mirecoil Serpent, Embermane Lion and Eclipse Griffin each control one damaged chapter. Rune Crown Chimera has absorbed parts of every system; defeating it in Mission 30 reconnects the archive without pretending there is an endless Mission 31."
      ],
      systems: [
        "Turn flow: select a living hero, then choose one action. Moving uses an adjacent legal cell. Attack requires the hero's range. Guard reduces the next enemy hit by one. A Skill spends one Energy: Lion strikes harder, Owl reaches a distant target, and Turtle guards every living hero while healing one HP. A hero is marked Done after acting. When every living hero has acted, or End Turn is pressed, all living enemies resolve their behavior and Energy returns by one up to three.",
        "Enemy rules are positional, not just statistical. Wolves gain Pack Fang while adjacent to another Wolf. Ravens target the hero with the lowest health ratio. Stone Stag restores first-hit armor. Thorn Boar returns one damage after a surviving adjacent melee hit. Rune Fox teleports behind the weakest hero. Tide Turtle gives the nearest ally a one-hit guard, while Relic Heron pushes the hero it strikes. Cinder Ram charges a visible straight line instead of walking normally.",
        "Later enemies change action planning. Ember Salamander leaves a temporary burn tile when it moves. Moon Moth silences one hero's Skill for the next player turn without removing Move, Attack or Guard. Archive Owl marks a hero so the next ranged hit gains damage. Mirror Wolf creates one adjacent one-HP clone when space permits. Seal Raven drains one Energy but never below zero. These traits remain active when Mission 29 combines one threat from five earlier chapters.",
        "Board states are part of each authored mission. Rubble cannot be occupied. Root Snare prevents the affected hero's next movement choice. Tide moves a unit one legal cell after the enemy turn. Burn damages a hero standing on it, while a one-use Cooling Rune restores Energy and clears active burn tiles. Orbit Runes rotate units around the outer ring. In Six-Rune Locks, three heroes must occupy linked Seal cells to remove the enemy ward; attacking through the ward loses one damage.",
        "Boss phases trigger cumulatively at 70 and 35 percent health, so one large hit cannot skip a phase. Stone Stag refreshes armor and charges its lane. Ironroot Rhino braces, strikes a row and leaves rubble. Mirecoil Serpent adds currents, pulls heroes and regenerates unless two heroes hit it during that player turn. Embermane Lion places fire and gains a wounded extra action. Eclipse Griffin alternates flying ranged immunity with a grounded sweep. Rune Crown Chimera combines tide, burn, rubble, flight and a Mirror Wolf summon.",
        "Permanent growth has three layers. Mission victory grants XP and Runes; XP raises Squad Level in 100-point steps. Runes upgrade Lion, Owl or Turtle up to Level 6, raising their starting health and attack. The post-mission Rune Reward is also saved: Power adds attack, Guardian Medal adds max health, Rune Shard adds 35 XP, Focus adds starting Energy, and Revive Token can automatically return one fallen hero at half health. An optional three-Diamond reward reroll and optional 18-Diamond Training Slot add choice or starting Energy, but neither unlocks a mission or Boss."
      ],
      how: [
        "Swipe the complete 30-card mission rail and select an unlocked mission. Every fifth card is a named Boss checkpoint.",
        "Read the mission name, enemy list, trait list, terrain and tactical plan before entering Battle.",
        "Select Lion, Owl or Turtle on the board or in the Squad Action roster. Choose an adjacent highlighted cell to move, a highlighted enemy to attack, Guard, or Skill.",
        "Watch Done markers and the selected hero panel. End Turn early only when preserving position is safer than using every action.",
        "During the enemy turn, read trait badges and the battle log for counters, guards, pushes, charges, silence, marks, drains, clones and Boss phases.",
        "Defeat every enemy, choose one permanent Rune Reward, and review the exact saved XP, Runes, best mission and next upgrade gap.",
        "Use Next Mission when another mission exists, Retry to replay the current board, or return to Missions to train heroes and revisit any unlocked card."
      ],
      strategyTips: [
        "Break Wolf adjacency before trading damage. Moving one hero can remove Pack Fang from two attacks at once.",
        "Do not spend Owl's range on Thorn Boar from an adjacent cell. A two-cell hit avoids the melee counter and keeps the back line useful.",
        "A silenced hero still has three useful actions. Move out of a charge lane, make a normal attack or Guard instead of waiting for Skill to return.",
        "Against Mirecoil Serpent, two separate heroes must connect during the same player turn. One hero's high-damage Skill alone does not stop regeneration.",
        "Flying Griffin blocks Owl's ranged damage. Use Lion while it flies, then spread heroes before the grounded row sweep.",
        "Leave one legal adjacent cell when Mirror Wolf is present, then remove the one-HP clone before it changes movement and targeting lanes.",
        "Permanent bonuses improve tolerance but do not solve board rules. A lower-level squad using Cooling, Seal and Orbit cells correctly can outperform a stronger squad standing in the wrong lane."
      ],
      progression: [
        "Missions 1-5 teach movement, focus fire, Wolf adjacency, Raven targeting and blocked bridge lanes. Stonehorn Trial refreshes first-hit armor at both thresholds and punishes heroes left in its row.",
        "Missions 6-10 add melee counters, back-line teleporting, Root Snare and pincer formations. Ironroot Rhino turns safe cells into rubble, so the available route changes during the fight.",
        "Missions 11-15 make position move after decisions through Tide and Heron push. Mirecoil Serpent adds column pull and a two-attacker regeneration check.",
        "Missions 16-20 combine temporary burn, straight-line charges and one-use Cooling Runes. Embermane Lion alternates board fire, group pressure and a wounded extra action.",
        "Missions 21-25 restrict Skill timing with silence and ranged marks, then rotate the outer ring. Eclipse Griffin changes which hero can damage it and when a row becomes unsafe.",
        "Missions 26-30 add clones, Energy drain and linked seals before the Crown Gauntlet remixes five earlier rules. Rune Crown Chimera changes terrain at both visible thresholds and summons a clone for the final target-order test."
      ],
      designNote:
        "The board stays three cells wide and four cells tall so every phone decision remains visible without panning. Depth comes from one-action turns: moving to solve a current hazard means giving up that hero's attack, while guarding can be stronger than chasing damage. Six five-mission chapters introduce one vocabulary at a time and then ask the chapter Boss to recombine it. HP rises only once every eight missions and Attack only once every twelve; later pressure therefore comes mainly from terrain, target order, action denial and phase changes. Pointer, touch and a roving arrow-key grid all operate the same logical cells. Unlike Animal Auto Squad's pre-battle formation or Animal Relic Hunters' live movement, Rune Tactics pauses after every decision so the board state itself is the puzzle.",
      parent:
        "Squad Level, XP, Runes, best mission, unlocked mission, hero levels, Training Slot, saved attack, health and Energy bonuses, and Revive Tokens are stored locally in this browser. No login is required for basic play. Clearing site storage or using another browser may create a separate save. Diamonds are optional platform currency used only for a reward reroll or the confirmed Training Slot; all 30 missions, seven terrain systems, special enemies and six Bosses remain playable without them. Skill Reports describe the completed play session and are not a formal ability test.",
      faq: [
        ["Is Animal Rune Tactics free?", "Yes. All 30 missions, special enemies, terrain rules, permanent Rune growth and six Bosses are playable in the browser without payment."],
        ["How many missions and Bosses are there?", "There are 30 authored missions. Missions 5, 10, 15, 20, 25 and 30 use six different Bosses with separate artwork, behavior and two health phases."],
        ["Does it require fast reactions?", "No. It is turn-based. Nothing moves while the player is choosing a hero, cell, attack, Guard or Skill."],
        ["Why can I not use a Skill?", "The hero may have no Energy, may already be Done, or may be silenced by Moon Moth. Silence lasts for one player turn and does not block movement, normal attacks or Guard."],
        ["What resets after a mission?", "The Battle board resets. Mission unlocks, Squad Level, XP, Runes, hero levels, chosen Rune Rewards, Training and Revive Tokens remain in local progress."],
        ["What can Diamonds do?", "Three Diamonds reroll one reward set, and 18 Diamonds confirm the permanent Training Slot. Diamonds do not unlock campaign missions, heroes or Bosses."],
        ["Can I replay earlier missions?", "Yes. Every unlocked mission remains selectable, including all 30 after the final victory. Mission 30 does not create a false Mission 31."],
        ["Does progress require an account?", "No. Progress is stored in this browser. Clearing its site data or changing devices may begin a separate local profile."]
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
      difficulty: "Hard",
      time: "5-8 minutes per route",
      gameplay: "Ricochet Fortress Roguelite",
      genre: ["Ricochet", "Action Strategy", "Roguelite", "Animal"],
      skills: ["Logic", "Problem Solving", "Focus"],
      guideKicker: "WeightPlay Original Game Guide",
      guideTitleSuffix: "Game Guide",
      noteTitle: "Player and Save Information",
      hideScoreBands: true,
      intro:
        "Animal Orb Fortress is a 30-route ricochet defense campaign about reading an arena before releasing a spirit orb. Each route has three continuous waves. The player drags from the lion keeper to preview a wall-bounce path, releases a volley, and protects the crystal core while shadow beasts advance. Six five-route regions add armor, protective anchors, phasing enemies, splitters, moving mirror pylons, telegraphed chargers, and six mechanically different regional Bosses. Between waves, one fortress blessing changes the current raid; between routes, Star Stones improve four permanent fortress rooms.",
      story: [
        "The Crystal Fortress was built where six guardian roads meet: the Crystal Woodland, Thornworks, Moon Ruins, Mirror Vault, Storm Bastion, and Eclipse Heart. When the fortress core began broadcasting an unstable pulse, shadow animals followed those roads inward. The lion orb keeper cannot leave the core unguarded, so every defense is fought from the launcher chamber by redirecting spirit orbs through the surrounding walls and mirrors.",
        "Clearing a route means its road is stable enough for repair crews to reopen it. Rootbound Golem tests the woodland gate, Brambleback Colossus occupies the thorn forge, Lunar Wisp Matriarch phases through the moon road, Prism Shell Regent controls the mirror vault, Tempest Horn Guardian marks storm lanes, and Voidcore Emperor seals the final chamber with three core phases. Completing Route 30 reconnects all six roads and stops the corrupted pulse from drawing more enemies to the fortress."
      ],
      systems: [
        "Aim and ricochet: drag from the launcher to see the initial path, then release. The main orb and one weaker echo orb travel at related angles. Wall banks can cross multiple lanes or reach a target hidden behind another formation. Split Orb can add a third projectile, while Piercing Shine shortens the delay before one orb can hit the same target again.",
        "Three-wave route: Waves 1 and 2 establish the route's enemy rule. Wave 3 uses an authored elite formation, except Routes 5, 10, 15, 20, 25, and 30, which end with a named regional Boss. A cleared wave pauses inside Battle for one blessing choice, then resumes the same route with surviving core HP and current upgrades.",
        "Special enemies: armored beasts absorb a fixed number of hits before losing HP. Stationary thorn anchors periodically give nearby allies a shield. Moon wisps visibly phase out and cannot be damaged until they return. Crystal splitters create two faster shards when defeated. Chargers mark a line, rush, then leave a recovery opening.",
        "Mirror pylons: later routes place one or two solid hexagonal pylons inside the arena. Orbs physically reflect from them, creating bank paths that do not exist in the early regions. Some pylons move horizontally, so a previously safe angle may stop working during the same wave.",
        "Boss rules: Rootbound rebuilds a breakable guard; Brambleback summons anchors and armored support at health thresholds; Lunar Wisp alternates visible and phased periods; Prism Shell can only be damaged while its gold shield segment is open; Tempest Horn is vulnerable after a marked charge; Voidcore changes phase twice, adds escorts, rebuilds protection, and activates two mirror pylons.",
        "Run and permanent growth: each wave offers Bigger Orb, Split Orb, Piercing Shine, Faster Recharge, Core Shield, or Scout Magnet according to the current choice cycle. Star Stones earned at Result improve Orb Forge damage, starting Core Shield HP, Companion Den support strikes, and Scout Tower rewards. A three-Diamond blessing reroll is optional, confirmed in two steps, and never required to unlock routes."
      ],
      how: [
        "Choose an unlocked route from the horizontal fortress map. Read its name, rule tag, and route-specific warning before entering.",
        "Drag from the lion keeper toward the desired angle. Use the preview to decide whether a direct shot, one-wall bank, cross-arena bank, or pylon reflection reaches the priority target.",
        "Release to fire the spirit-orb volley. Watch armor rings, phase outlines, charge marks, anchor protection, and Boss cues before choosing the next shot.",
        "After Waves 1 and 2, select one blessing. A reroll costs three Diamonds and requires a second confirmation; selecting a blessing immediately continues to the next wave.",
        "Keep core HP above zero through Wave 3. Victory saves the next route and Star Stones; failure still saves the earned Star Stones and leaves the best unlocked route intact.",
        "Return to the map to spend Star Stones on fortress rooms, replay cleared routes, or continue with Next Stage from Result."
      ],
      strategyTips: [
        "Do not always aim at the closest enemy. Anchors, splitters, and backline wisps can create more pressure than a slow front target, so use a bank route to reach the correct priority.",
        "A phase outline means damage is blocked. Keep the next angle prepared and release when the enemy becomes solid instead of wasting the volley during its closed state.",
        "Moving pylons are useful surfaces, not only obstacles. Aim slightly ahead of their travel so the orb meets the pylon where it will be, then crosses a lane that wall-only shots cannot reach.",
        "Against chargers and Tempest Horn Guardian, read the marked line and wait for recovery. Faster Recharge helps only if the shots are released during a useful window.",
        "Core Shield and Faster Recharge stabilize a route under pressure; Bigger Orb and Piercing Shine shorten dangerous Boss phases. Scout Magnet helps long-term growth but does not stop an immediate breach.",
        "Save the optional Diamond reroll for a blessing set that genuinely misses the route's rule. Normal route unlocking and all six Bosses remain playable without spending Diamonds."
      ],
      progression: [
        "Routes 1-5 teach direct fire, one-wall banks, separated lanes, and target order. Rootbound Crown is the first checkpoint: the Golem rebuilds guard after an exposed interval, so the player must break protection and use the opening rather than fire without timing.",
        "Routes 6-10 introduce hit-count armor and stationary thorn anchors. Routes 11-15 replace constant firing with phase timing and then add the first moving reflection gate. Brambleback Colossus summons protection during the fight, while Lunar Wisp Matriarch alternates invulnerability with a recovery window.",
        "Routes 16-20 add physical mirror pylons and splitters whose defeat creates faster shards. Routes 21-25 mark charge lanes and add storm timing. Prism Shell Regent rotates a damage window; Tempest Horn Guardian must complete its rush before it can be hurt.",
        "Routes 26-30 combine armor, anchors, phase timing, splitters, chargers, and moving pylons in authored formations. Route 29 uses the full ordinary-enemy vocabulary. Route 30 adds two Voidcore phase changes, four support summons, rebuilt shielding, and two active pylons, testing aim planning, target priority, timing, upgrades, and permanent fortress growth together."
      ],
      designNote:
        "The game uses three short waves because a route should feel like one focused aiming problem rather than a long endurance session. Wave breaks preserve core damage and the current build, but provide one compact blessing decision before the next formation. The first regions rely on walls so players can learn predictable geometry; later mirror pylons create new surfaces and invalidate memorized angles. Special enemies communicate their counterplay with rings, shield marks, lane lines, or distinct Boss artwork instead of requiring a long rules panel during Battle. Pointer drag is the primary phone control, while Left and Right adjust the same aim on a keyboard and Space or Enter fires. Compared with Beast Guardian's defender placement or Animal Auto Squad's formation planning, Animal Orb Fortress makes the shot path itself the main strategic resource.",
      parent:
        "The browser saves the best unlocked route, Star Stones, play count, and four fortress-room levels on this device. Basic play does not require an account. Clearing this site's browser storage may remove that progress. Diamond blessing rerolls are optional, show the current and resulting balance, and are not required for the 30-route campaign. Scores and Skill Reports describe play only and are not formal ability measurements.",
      faq: [
        ["What is the goal of a route?", "Protect the crystal core through three waves. Clearing Wave 3 saves the route, awards Star Stones, and unlocks the next route."],
        ["Does every route use the same Boss?", "No. Only every fifth route is a regional Boss checkpoint. The other routes end with authored elite formations, and all six Bosses have different artwork, cues, and counterplay."],
        ["Why did my orb pass through a moon enemy?", "A dashed phase outline means that enemy is temporarily intangible. Wait for it to become solid, then release the prepared shot."],
        ["What do mirror pylons do?", "They are real reflection surfaces inside the arena. Later pylons move, changing the available ricochet path during a wave."],
        ["Do I need Diamonds to finish the campaign?", "No. Diamonds only reroll the three blessing choices once during a wave after a two-step confirmation."],
        ["What happens after a failed route?", "The run ends, but earned Star Stones are saved and the best unlocked route is retained. Upgrade a room, change the aim plan, or retry."],
        ["What progress is stored?", "Best unlocked route, Star Stones, play count, and Orb Forge, Core Shield, Companion Den, and Scout Tower levels are stored locally in this browser."]
      ],
    },

    "animal-auto-squad": {
      title: "Animal Auto Squad",
      age: "13+",
      difficulty: "Medium",
      time: "5-10 minutes",
      gameplay: "Tactical Auto-Battler",
      genre: ["Strategy", "Formation", "Animal"],
      skills: ["Logic", "Problem Solving", "Strategic Planning"],
      guideKicker: "WeightPlay Original Game Guide",
      guideTitleSuffix: "Game Guide",
      noteTitle: "Player and Save Information",
      hideScoreBands: true,
      intro:
        "Animal Auto Squad is a formation strategy game built around decisions made before combat. You unlock and train ten animal heroes, place up to six of them in a two-row squad, choose one expedition relic, and then watch the lineup resolve each clash automatically. The campaign contains 30 stages across Thornwood, Crystal Caverns, Sunken Ruins, Ember Peak, Moonlit Citadel, and Void Crown. Every stage has five authored waves, while stages 5, 10, 15, 20, 25, and 30 end with a different regional Boss.",
      story: [
        "The expedition follows a chain of routes occupied by shadow animals, crystal creatures, armored guardians, rune beasts, and eclipse hunters. The squad begins on Thornwood's Mossy Trail, then pushes through the Prism Heart, Sunken Crown, Caldera King, Midnight Court, and the broken approaches to Void Crown. Each region introduces a different enemy mix and final encounter; clearing all six means breaking the complete chain of regional blockades.",
        "You act as the squad commander rather than a fighter on the field. Spark Paw Fox, Bubble Fin Otter, Drum Belly Panda, Moon Cap Owl, Moss Shell Turtle, and the other unlockable heroes each bring a specific targeting or support rule. Your job is to decide which six travel together and whether they belong in the front or back row before the automated clash begins.",
      ],
      systems: [
        "Formation: the upper three slots are the front row and the lower three are the back row. Targeting matters because some units attack the lead enemy, Moon Cap Owl hunts the back row, and Boom Mane Lion sweeps a full row.",
        "Animal roles: attackers, healers, shields, team buffers, and faint effects resolve automatically. Bubble Fin Otter and Rainbow Hop Rabbit protect weakened allies, while Drum Belly Panda and Moss Shell Turtle build team durability.",
        "Expedition relics: choose Maple Shield, Oak Seed, Shadow Claw, or Clover Leaf for a run-wide rule. A relic choice is free; spending 3 optional Diamonds only rerolls the offered choices.",
        "Temporary Supplies: each expedition starts with 12 Supplies. Select an owned animal during preparation to buy a temporary level that adds Attack and Health for that expedition. Supplies earned during battle remain part of the current run.",
        "Permanent growth: cleared waves award Team XP and Training Gold. Team Levels add shared Attack and Health bonuses, while Training Gold unlocks and upgrades normal heroes up to level 20. Two premium heroes use optional Diamonds instead of Training Gold."
      ],
      how: [
        "Choose an unlocked stage from the horizontal campaign rail; every fifth stage is marked as a Boss stage.",
        "Open Training when you want to spend saved Training Gold, unlock another normal hero, or inspect the permanent Team Level bonus.",
        "At deployment, tap an owned animal in the vertical backpack and then tap one of the six formation slots. Tap a placed animal to move or replace it.",
        "Choose one expedition relic, then spend the run's Supplies on temporary upgrades for the animals you intend to field.",
        "Press Start Battle. Attacks, healing, shields, row targeting, and faint abilities resolve automatically according to the chosen formation.",
        "A winning squad immediately meets the next wave. A loss costs one Heart and reopens preparation; reaching zero Hearts ends the run unless the optional revive is accepted.",
        "Clear the fifth wave to save the stage, Team XP, Training Gold, and the next unlocked stage. Use Next Stage, Retry, or Back to Stages from the Result panel."
      ],
      strategyTips: [
        "Plan for all five waves before pressing Start Battle: victories continue directly into the next enemy formation, so a balanced opening lineup is safer than a one-wave counter.",
        "Use the front row for heroes that can absorb pressure or shield the team. Moss Shell Turtle, Drum Belly Panda, and Gear Horn Rhino can buy time for back-row attackers and healers.",
        "Read target rules instead of comparing Attack alone. Moon Cap Owl can reach fragile back-row enemies, while Boom Mane Lion is strongest when several enemies share a row.",
        "Boss skills are different. Thornwood Alpha attacks a row and shields itself, Abyss Shell Leviathan protects and heals its side, and Void Crown Emperor damages the whole squad while restoring its own health."
      ],
      progression: [
        "Stages 1-5 teach lead targeting, back-row threats, guards, and the two-row formation with small Thornwood groups. Thornwood Throne is the first Boss checkpoint. Stages 6-15 add Crystal Cavern and Sunken Ruin enemies that attack the back row, drain health, sweep rows, or hide behind durable guards.",
        "Stages 16-25 raise both formation size and ability overlap. Ember Peak combines charging boars, Obsidian Tanks, Rift Runners, and Rune Wolves; Moonlit Citadel adds Night Panthers, Eclipse Bats, Rune Ravens, and Shadow Jaguars. Boss waves are accompanied by other enemies, so defeating the centerpiece is not the only requirement.",
        "Stages 26-30 use the full Void Crown roster. Stage 29 can field six enemies at once, matching the player's maximum squad size. The final wave of Stage 30 places the Void Crown Emperor beside rune, eclipse, and shadow escorts, testing row coverage, recovery, damage, and permanent training earned across the campaign."
      ],
      designNote:
        "The automated battle is intentional: execution is short so the important work happens in formation, role coverage, target order, relic selection, and long-term training. A successful wave flows directly into the next one to make the five-wave stage feel like one expedition rather than five disconnected menu visits. Losses reopen preparation so the player can respond instead of watching the same failed setup repeatedly. Tap-select and tap-place support phone play, while the same cards remain usable with mouse input on desktop. Compared with WeightPlay's turn-based Animal Rune Tactics or real-time Animal Crystal Survivor, Animal Auto Squad asks the player to build a plan and then evaluate how that plan performs without issuing attacks during combat.",
      parent:
        "Later stages combine six-unit formations, specialized targeting, permanent upgrades, combat failure pressure, Boss abilities, and optional Diamond decisions. Campaign progress, the last deployed formation and slot positions, Training Gold, Team Level, unlocked animals, permanent animal levels, completed stages, and cosmetic choice are stored locally in this browser; no login is required for basic play. Clearing this site's browser storage may remove that local progress.",
      faq: [
        ["Is Animal Auto Squad free to play?", "Yes. The 30-stage campaign runs in the browser on WeightPlay without a required purchase or login."],
        ["What is the goal of each stage?", "Build a squad that survives five continuous waves. Clearing wave five saves the stage and unlocks the next one; every fifth stage ends with a regional Boss."],
        ["Do I control attacks during battle?", "No. You control the roster, two-row positions, relic, and temporary upgrades before combat. The animals then attack, heal, shield, and trigger abilities automatically."],
        ["Can I rearrange the squad between every wave?", "Winning moves directly to the next wave. Preparation reopens after a loss or draw while the run still has Hearts, so the initial formation should be able to handle more than one enemy pattern."],
        ["What happens when I lose a wave?", "The run loses one Heart. With Hearts remaining, you can adjust the squad and try that wave again. At zero Hearts, you may end the run or use the optional five-Diamond revive."],
        ["What do Diamonds do?", "Diamonds are optional. They can reroll relic choices, revive a failed expedition, unlock two premium heroes, or unlock the golden cosmetic skin; normal stage progression does not require them."],
        ["What progress is saved?", "The browser stores unlocked and completed stages, the last deployed formation and slot positions, Team Level and XP, Training Gold, unlocked animals, permanent animal levels, run records, and cosmetic selection on this device."]
      ],
    },
    "beast-tactician": {
      title: "Beast Guardian",
      difficulty: "Hard",
      time: "8-15 minutes per stage",
      gameplay: "Hero Tower Defense",
      genre: ["Tower Defense", "Strategy", "Animal"],
      skills: ["Logic", "Problem Solving", "Focus"],
      guideKicker: "WeightPlay Original Game Guide",
      guideTitleSuffix: "Game Guide",
      noteTitle: "Player and Save Information",
      hideScoreBands: true,
      intro:
        "Beast Guardian is a 30-stage hero tower-defense campaign built around route construction rather than fixed tower pads. Place four ordinary animal soldier roles and seven WeightPlay heroes on a forest grid, keep at least one route open, and protect the crystal core through six five-stage regions. Wolves, armored boars, flying bats, regenerating packs, wounded sprinters, and eclipse formations ask for different defenses. Stages 5, 10, 15, 20, 25, and 30 end with rule-changing Bosses instead of ordinary enemies with larger health bars.",
      story: [
        "The crystal routes connect six parts of the Guardian Forest: the first root paths, crystal air lanes, Ironbark works, the regrowing mistwood, storm ramparts, and the eclipse road to the Voidroot throne. Enemy packs are trying to reach the core at the far side of each battlefield. A cleared stage means the route is secure long enough for the guardians to advance to the next sector.",
        "You command the defense before and during every wave. Acorn Guards and Moss Shell Taro hold bends, Scout Archers and Moon Cap Orla cover long angles, Rune Sappers slow clustered attackers, Medic Cubs repair injured blockers, and heroes such as Spark Paw Fia provide focused damage. The board is not a decoration: every placed defender changes the route unless the unit is serving as ranged support away from the path."
      ],
      systems: [
        "Route building: defenders occupy normal ground cells. Enemies recalculate a path around them, but a completely sealed route makes ground enemies attack the nearest blocker until a route opens again. Flying bats ignore the ground maze, so a long route alone cannot solve every wave.",
        "Combat roles: blockers buy time, Archers and Orla cover distance, Sappers apply splash damage and slowing, Medics heal damaged defenders, Fia focuses Boss pressure, and Gear Horn Rux strengthens nearby allies. Selecting a placed unit shows its upgrade cost and sell refund.",
        "Wave information: before each wave, the HUD names the incoming wolves, boars, bats, escorts, or Boss. Non-final waves continue after a five-second countdown, so the player can read the next composition and use earned coins before pressure resumes.",
        "Special enemies: Ironbark stages give enemies breakable guard armor; mistwood enemies recover health while moving; storm enemies accelerate after falling below half health; eclipse stages combine armor, recovery, surge behavior, flying routes, and reduced slow effectiveness.",
        "Permanent progress: victories award stars, upgrade points, and Diamonds. Upgrade points improve hero power, defender health, or starting economy. Diamonds are optional and can confirm a core revive, reroll a result reward, or unlock a cosmetic golden defender frame; normal stage unlocks do not require them."
      ],
      how: [
        "Choose a stage from the swipe stage rail and read the threat, plan, and reward notes.",
        "Spend stage coins to place soldiers or WeightPlay heroes on normal ground tiles. Use the visible range preview before confirming a position.",
        "Keep at least one path open, or blocked enemies will attack the nearest defender until the route reopens.",
        "Read Wave Intel, start the wave, then upgrade or sell placed units as the enemy mix changes. Non-final cleared waves resume automatically after five seconds.",
        "Protect the crystal through every wave. Result awards one to three stars according to remaining core health and offers Next Stage, Retry, or Back to Stages.",
        "Spend saved upgrade points from Stage when permanent power, bulwark health, or starting economy needs improvement. Optional Diamond actions always show their cost and require confirmation."
      ],
      strategyTips: [
        "Use Acorn Guards to make two or three firing bends before investing in expensive heroes. A longer route increases every ranged unit's useful attack time.",
        "Do not close every cell. A sealed route turns the maze into a direct fight against the nearest blocker and can remove the timing advantage you were trying to create.",
        "Keep ranged coverage near the crystal during Bat Crossing and later flying stages because bats bypass ground blockers. Slow boars before their armor breaks on storm stages so their wounded speed surge is less dangerous.",
        "Against regenerating enemies, concentrate fire inside one kill zone instead of spreading damage. Against armor, sustained or splash damage should remove the guard before hero burst is committed.",
        "Save role coverage for Boss stages. The final Voidroot Emperor changes phase at two health thresholds, summoning bats first and then armored ground support while rebuilding guard."
      ],
      progression: [
        "Stages 1-5 teach route bends, split lanes, early ranged coverage, boar pressure, and the consequence of sealing the path. Shadow Brute attacks blockers faster than ordinary Bosses, so the first finale tests whether the route has a durable anchor instead of only damage units.",
        "Stages 6-10 introduce bats that fly across the grid and mixed air-ground waves. Forest Behemoth summons wolf and bat support after losing part of its health. Stages 11-15 add breakable Ironbark armor and finish with Ironbark Colossus, which rebuilds a large guard layer midway through the fight.",
        "Stages 16-20 make unfinished enemies regenerate while moving; Verdant Ancient restores a portion of its own health and calls support. Stages 21-25 add wounded speed surges, ending with Tempest Ravager accelerating its escorts. Stages 26-30 combine every previous rule with reduced slow effectiveness. Voidroot Emperor has two phase changes, so stage 30 requires ground routing, air coverage, armor breaking, finishing damage, healing, and saved Boss focus in one defense."
      ],
      designNote:
        "Beast Guardian uses free placement because the central decision is not simply which tower to buy; it is how each body changes travel time, firing angles, and blocker risk. The five-second transition between waves preserves the feeling of one continuous defense while leaving a short planning window. Thirty stages are organized as six mechanical arcs so difficulty grows through new counters and combinations before raw statistics. Touch players use the same large build cards and grid cells as mouse players, while keyboard controls can move a tile cursor, build, select, upgrade, sell, cycle units, and start waves. This distinguishes the game from Animal Auto Squad: both reward preparation, but Beast Guardian lets the player reshape the battlefield and react during live waves.",
      parent:
        "The browser stores the highest unlocked stage, stage clears, best star ratings, permanent technology levels, upgrade points, Diamond balance, and cosmetic ownership on this device. No login is required for basic play, and clearing this site's browser storage may remove that progress. Diamond actions are optional and are not required to unlock the 30 campaign stages.",
      faq: [
        ["Is Beast Guardian free to play?", "Yes. The complete 30-stage campaign runs in the browser without a required purchase or login."],
        ["How do I start a stage?", "Choose an unlocked stage from the swipe rail, then begin the defense. Cleared non-final waves start automatically after a five-second countdown."],
        ["Why do enemies sometimes attack a defender?", "Ground enemies attack a nearby blocker when every legal route to the core is sealed. Sell or reposition a unit on the next attempt, or design a route with one open lane."],
        ["How are the six Bosses different?", "Shadow Brute attacks blockers quickly, Forest Behemoth summons escorts, Ironbark Colossus rebuilds armor, Verdant Ancient heals, Tempest Ravager hastens allies, and Voidroot Emperor changes phase twice."],
        ["What do stars measure?", "Stars reflect the crystal core health remaining after victory. A close clear still unlocks the next stage, while replaying with a stronger route can improve the saved rating."],
        ["Does Beast Guardian save progress?", "Yes. Unlocks, clears, stars, upgrade points, permanent technology, Diamonds, and cosmetic ownership are saved locally in this browser."],
        ["What can Diamonds do?", "Diamonds optionally confirm a core revive, reroll a result reward, or unlock the golden frame. They are not required for normal campaign progress."]
      ],
    },
    "shadow-wolf": {
      title: "Shadow Wolf Legend",
      difficulty: "Hard",
      time: "3-8 minutes per stage",
      gameplay: "Side-Scrolling Action Platformer RPG",
      genre: ["Action", "Platformer", "Animal", "RPG"],
      skills: ["Logic", "Problem Solving", "Focus"],
      guideKicker: "WeightPlay Original Game Guide",
      guideTitleSuffix: "Game Guide",
      noteTitle: "Player and Save Information",
      hideScoreBands: true,
      intro:
        "Shadow Wolf Legend is a 30-stage side-scrolling action-platform campaign. Guide the explorer wolf across ruined ledges, read visible hazard warnings, fight shadow creatures, collect EXP, and spend two exact attribute points whenever a level is gained. Every fifth stage ends with a regional Boss whose defense or attack pattern requires a different response.",
      story: [
        "Six seals once kept the Moonshade route open between the forest frontier and the Behemoth Crown. Their fracture changed each region: crystals fall in the caverns, roots close paths in the Rootwild, furnace vents ignite the Ember Vault, rift winds distort the Eclipse Bridge, and the Crown Road combines threats carried forward from every region.",
        "You play the rune-marked Shadow Wolf explorer. A stage is restored only after every assigned creature is defeated. A clear saves that route section and unlocks the next card; Stage 30 represents breaking the final Behemoth seal, while every completed stage remains available for replay."
      ],
      systems: [
        "Movement and combat: run, double-jump, slash in the facing direction, and dash through danger for a brief protected moment. Enemy contact, projectiles, spikes, and active terrain reduce Wolf HP. Falling returns the wolf to stable ground with a five-HP penalty.",
        "EXP and attributes: ordinary and special enemies release EXP orbs. Level-up pauses Battle and grants two mandatory points. Strength raises Damage, Agility raises Speed, Constitution raises Max HP, and Luck raises Critical chance; every choice shows exact current-to-next values.",
        "Special enemies: Crystal Bats fire spreads, Armored Boars open after a missed patrol turn, Charger Boars burst across lanes, Ember Wolves leave fire, Dive Bats pursue vertically, Rift Bats blink between perches, and Mirror Wolves split once into two fragile echoes.",
        "Terrain: crystal fall, venom, roots, fire, shockwaves, and rift gusts use a warning period before becoming active. Moving ledges change the jump route, while permanent spikes remain dangerous whenever touched.",
        "Optional permanent support: the Mist Amulet costs 15 Diamonds and changes starting Max HP from 30 to 40. Its two-step confirmation shows the exact balance. Normal stage unlocks do not require Diamonds."
      ],
      how: [
        "Choose an unlocked card from the horizontal 30-stage rail; every fifth card is a Boss checkpoint.",
        "Use A/D or Left/Right Arrow to move. Press W, Up Arrow, or Space to jump, then press once more before landing for the second jump.",
        "Press J to slash and K or Shift to dash. Touch players use the visible direction, Jump, and Attack controls.",
        "Read dashed terrain warnings before they become active, and treat a visible armor or shield ring as a counter prompt rather than a request to trade damage.",
        "Collect EXP and spend both exact-value attribute points whenever growth pauses the same Battle screen.",
        "Defeat the complete encounter. Victory saves the stage and unlocks the next one; defeat offers retry without deleting prior clears."
      ],
      strategyTips: [
        "Keep the second jump until a moving ledge, spread shot, or hazard cycle confirms the safe landing.",
        "Use dash through the last part of a projectile fan or charge, then turn and slash during recovery instead of using dash only for travel.",
        "Remove ranged threats before committing to a slow Armored Boar punish window.",
        "Strength shortens fights, Constitution forgives mistakes, Agility improves positioning, and Luck creates variable burst; choose for the current stage rule.",
        "Leave space before defeating a Mirror Wolf because two echoes appear around the split point."
      ],
      progression: [
        "Stages 1-5 teach patrols, ledges, aimed shots, moving platforms, and spikes. Basilisk Hollow adds venom zones and a widening projectile fan.",
        "Stages 6-10 add falling-crystal warnings, Crystal Bat spreads, and Armored Boars. Stone Guardian blocks frontal claws and exposes itself after a ground slam with two jumpable shockwaves.",
        "Stages 11-15 combine bramble lanes, charges, armor, and ranged priority. Thorn Colossus protects its core until a missed root smash opens a short damage window.",
        "Stages 16-20 cycle fire lanes, add Ember Wolf trails and Dive Bats, then end with Cinder Wyvern: survive its protected aerial fan and punish the vulnerable landing.",
        "Stages 21-25 add gusts, blinking Rift Bats, and splitting Mirror Wolves. Eclipse Stag reflects most damage until its dash hits an arena edge and breaks the shield.",
        "Stages 26-30 mix earlier counter rules with visible warnings. Behemoth Crown changes at two health thresholds, adding crystal fall and then root pressure plus a denser fan without creating a hidden Stage 31."
      ],
      designNote:
        "The campaign uses six five-stage teaching arcs because platform-action difficulty should grow through recognition and counterplay, not only larger health bars. Four stages introduce or combine a regional rule; the fifth asks for that rule against a Boss with a visible defense state and punishable opening. A warning-to-active terrain rhythm supports deliberate touch play while retaining pressure. One fixed logical Battle canvas keeps ledges, HUD, controls, growth Draft, and Result in the same geometry across phone and desktop. Unlike WeightPlay auto-battlers, every dodge, jump, target priority choice, and attack time remains under direct player control.",
      parent:
        "This browser stores the highest unlocked stage, selected stage, completed-stage list, attempts, best clear, final Crown clears, and Mist Amulet ownership locally. A legacy eight-room save migrates forward without relocking earned progress. No login is required for basic play; clearing site storage or changing browsers may remove this record. Diamonds are optional support currency.",
      faq: [
        ["Is Shadow Wolf Legend free to play?", "Yes. The full 30-stage campaign runs in the browser without a required purchase or login."],
        ["How do stages unlock?", "A new save begins with Stage 1. Clearing the complete encounter saves that stage and unlocks the next card; cleared stages remain replayable."],
        ["What happens if the wolf falls?", "The wolf returns to stable ground and loses five HP. The attempt ends only if that penalty reduces HP to zero."],
        ["Why does an armored enemy take very little damage?", "Its defense state is active. Trigger the visible counter window after a missed charge, slam, root smash, landing, or wall impact."],
        ["Do I have to spend both attribute points?", "Yes. Battle resumes only after both points have been assigned to Strength, Agility, Constitution, or Luck."],
        ["Are Diamonds required?", "No. They only provide the optional Mist Amulet; normal progress through all 30 stages does not require it."],
        ["What progress is saved?", "Stage unlocks and clears, selected stage, attempts, best clear, Crown clears, and Mist Amulet ownership are saved locally in this browser."],
        ["How are the six Bosses different?", "Basilisk controls ground with venom, Guardian drops its guard after slams, Colossus exposes a core, Wyvern alternates flight and landing, Stag breaks its shield on a failed dash, and Behemoth combines phase-based crystal and root pressure."]
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
      worldAndMission: "World and Mission",
      gameSystems: "How the Systems Work",
      progressionAndDifficulty: "Campaign and Difficulty Growth",
      developerNote: "Developer Design Note",
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
      worldAndMission: "世界與任務",
      gameSystems: "遊戲系統",
      progressionAndDifficulty: "關卡與難度成長",
      developerNote: "開發設計理念",
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
    "animal-bubble-safari": { gameplay: "Bubble Shooter Puzzle", genre: ["Puzzle", "Bubble Shooter", "Animal"] },
    "animal-habitat-mahjong": { gameplay: "Mahjong Solitaire", genre: ["Puzzle", "Logic", "Animal"] },
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
    "animal-hero-trials": "animal-hero-trials-cover.webp",
    "animal-gearpack-expedition": "animal-gearpack-expedition-cover.webp",
    "animal-moonlight-heist": "animal-moonlight-heist-cover.webp",
    "animal-rope-rescue": "animal-vine-rescue-cover.webp",
    "star-memory": "memory-cover.webp",
    "campus-dash": "campus-dash-cover.webp",
    "snack-blocks": "snack-blocks-cover.webp",
    "fruit-merge": "fruit-merge-cover.webp",
    "garden-tiles": "garden-tiles-cover.webp",
    "animal-rescue": "animal-rescue-cover.webp",
    "animal-bubble-safari": "animal-bubble-safari-cover.webp",
    "animal-habitat-mahjong": "animal-habitat-mahjong-cover.webp",
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
      "animal-bubble-safari": { gameplay: "泡泡射擊解謎", genre: ["益智", "泡泡射擊", "動物"] },
      "animal-habitat-mahjong": { gameplay: "麻將牌配對", genre: ["益智", "邏輯", "動物"] },
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
      "animal-bubble-safari": zhGuide("動物泡泡探險", "泡泡射擊解謎", ["拖曳瞄準後放開發射。", "連接三顆以上相同的動物泡泡。", "利用牆面反彈與特殊泡泡完成救援目標。"]),
      "animal-habitat-mahjong": zhGuide("動物棲地麻將消消", "麻將牌配對", ["找出兩張相同的動物牌。", "選擇上方沒有覆蓋牌、且左右至少一側開放的牌。", "清除所有配對，解鎖下一個棲地牌局。"]),
      "animal-hidden-safari": zhGuide("動物探險找找看", "找找看", ["觀察自然場景。", "找出藏在畫面中的動物。", "完成目標後進入下一個地區。"]),
      "animal-guard-yard": zhGuide("動物守衛庭院", "路線防守", ["購買並放置動物守衛。", "讓動物攻擊入侵者並守住庭院。", "升級隊伍並解鎖更強動物。"]),
      "animal-quiz": zhGuide("動物小博士", "動物問答", ["閱讀題目並觀察圖片。", "選出正確答案。", "透過關卡認識更多動物。"]),
      "zoo-helper-day": zhGuide("動物園幫忙日", "動物照顧", ["觀察動物需要什麼幫助。", "選擇正確道具。", "完成照顧任務讓動物開心。"]),
      "shape-train": zhGuide("動物形狀小火車", "形狀分類", ["觀察車廂上的形狀。", "把正確物品放到相同形狀的位置。", "完成火車任務。"]),
      "tiny-weather-rescue": zhGuide("動物幫幫隊", "道具選擇", ["觀察動物遇到的情境。", "選擇或拖曳正確道具幫忙。", "答對後完成關卡。"]),
      "beast-deck": {
        title: "獸王牌組：迷霧森林",
        difficulty: "中等",
        time: "每個任務 8-15 分鐘",
        gameplay: "回合制 Roguelike 牌組構築",
        genre: ["卡牌策略", "Roguelike", "動物冒險"],
        skills: ["邏輯", "問題解決", "專注"],
        guideKicker: "WeightPlay 原創遊戲指南",
        guideTitleSuffix: "遊戲指南",
        noteTitle: "玩家與存檔說明",
        hideScoreBands: true,
        intro: "《獸王牌組：迷霧森林》是一套以判讀敵人意圖、安排出牌順序為核心的 30 任務回合制牌組戰役。每個任務有三場連續戰鬥；通過前兩場後各選一張本次任務限定卡並恢復部分生命，擊敗第三場才會保存經驗、獸王金幣與下一個任務。六個五關區域依序加入護甲、反擊、疲勞、標記、再生、淨化、虛弱、牌型封印、詛咒與三相結界。第 5、10、15、20、25、30 任務各有一隻不同首領，生命降到門檻時還會進入新階段。",
        story: [
          "迷霧森林原本由動物守望者使用六條道路連結：迷霧小徑、鐵根工坊、琥珀大獵、盤沼深潭、月影典藏與霧冠王座。冠霧開始逆風流動後，普通動物受到腐化，道路也彼此中斷。暗影野豬與毒蛇占據入口；鐵根生物發展出護甲與反擊；琥珀獵手會標記穿越者；盤沼生物能從毒素中再生；月影典藏封印整類動物能力；最後的王庭則用迷霧詛咒污染乾淨的抽牌。",
          "玩家扮演獸王牌組的保管者。這本行動牌冊會借用友善動物的特長，不需要讓牠們親自承受危險。狼群突襲提供快速攻擊，守衛熊與鐵甲龜建立格擋，天鷹把傷害與抽牌結合，獵豹把速度轉成手牌與能量，毒蛇累積中毒，貓頭鷹則深入搜尋牌庫。通過任務代表該段路線已穩定到能重新接通；在第 30 任務擊敗霧冠獸王，代表迷霧源頭的結界被解除，六條道路全部恢復。"
        ],
        systems: [
          "回合流程：玩家回合會恢復能量、清除暫時格擋並抽三張牌。打出的牌進入棄牌堆；回合結束時，剩餘手牌也會棄掉。抽牌堆用盡後，棄牌堆重新洗回。除非濃霧正在遮蔽，敵人下一個攻擊、防禦、中毒或特殊行動都會顯示在頭頂，所以結束回合是一個可判斷的風險決策。",
          "卡牌連動：狼群突襲基本造成 6 點傷害，同回合先打過其他攻擊牌後改為 12；天鷹造成 14 點並抽一張；守衛熊取得 6 點格擋，鐵甲龜取得 15 點；獵豹疾跑抽兩張並補回一點能量；毒蛇之牙施加三層中毒；貓頭鷹智慧不耗能抽一張。中毒在敵方行動後造成傷害並減少一層，敵人格擋則先吸收固定傷害。",
          "區域規則：護甲會削減每一次直接命中；反擊會回敬下一張攻擊牌；疲勞提高一張指定牌在下個玩家回合的能量；標記要求回合結束前打出指定牌；虛弱降低下一次攻擊。再生會在敵方行動後治療，淨化移除中毒，加速會跳過更多意圖位置，濃霧隱藏下一個顯示意圖，封印則在一個玩家回合停用攻擊、防禦或功能牌。",
          "霧冠規則：詛咒行動會把臨時的迷霧詛咒放入戰鬥牌庫。花一點能量打出可永久清除該張詛咒；回合結束仍握在手中則先受傷，再隨棄牌循環回來。最終三相結界會阻擋直接傷害，直到玩家分別使用過攻擊、防禦與功能牌。結界進度可以跨回合，但最終首領在後期階段會重建結界。",
          "任務構築：基礎牌組由多張狼群突襲、守衛熊，以及天鷹、獵豹組成。通過第一、第二場後，從三張候選卡選一張加入本次任務；新卡保證出現在下一場開手牌。選單中的永久卡冊是另一套系統：金色獸王卡包花費 80 枚獸王金幣，會給永久卡牌或裝備；重複取得可提高階級，出戰前最多裝備六張額外卡。",
          "永久成長：經驗提高本機玩家等級與生命上限，獸王金幣用於抽卡包。迷霧披風提高最大生命、獵手護符增加每場起始能量、森林戰旗增加開場格擋，裝備階級會強化效果。任務、卡冊、裝備、等級、經驗、金幣與可選迷霧護符都保存在目前瀏覽器。迷霧護符花 15 顆平台鑽石、需要二次確認，也不是通過 30 任務的必要條件。"
        ],
        how: [
          "進入任務準備後，左右滑動完整的 30 任務軌道，點選任何已解鎖任務；鎖定卡仍會顯示，方便看清整條戰役。",
          "在牌組分頁裝備最多六張永久卡與一件裝備；升級分頁可用獸王金幣抽卡包，也會顯示可選迷霧護符。",
          "戰鬥中先閱讀敵人頭上的意圖，再點擊能支付能量的卡牌。不能打出的牌會說明是能量不足、等待回合或受到牌型封印。",
          "安排同一回合的順序：先用其他攻擊啟動狼群連擊，在花完能量前先抽牌，遇到大攻擊則在結束回合前建立格擋。",
          "擊敗第一個敵人後選一張臨時卡，它會放進下一場開手牌；第二場結束後再選一次。",
          "在生命歸零前擊敗第三場。普通任務最後是特製菁英；每五關則由具名區域首領取代。",
          "勝利後可直接進入下一任務、重試目前任務或返回準備；失敗不會刪除已保存的永久進度。"
        ],
        strategyTips: [
          "把意圖順序當成資源。琥珀敵人的加速會跳過原本預期的下一個行動，濃霧則會刻意讓一個回合失去這項資訊。",
          "面對護甲前先算每次命中。一次天鷹通常比兩次小攻擊有效；中毒不受護甲與三相結界阻擋。",
          "不要把所有攻擊牌丟進反擊架勢。反擊存在時可先防禦、抽牌或施毒，等敵人換成下一個行動再進攻。",
          "牌被標記後，不要盲目抽太多牌。打出指定牌即可解除；回合結束仍握著它，才會承受顯示的傷害。",
          "面對再生時應保留能量集中爆發，避免零碎傷害立刻被補回；面對淨化則應等淨化行動結束後再疊中毒。",
          "三相結界是出牌順序題：先用便宜功能牌與防禦牌，再讓應該造成傷害的攻擊牌成為第三種。重複同類型不會增加進度。",
          "永久等級與裝備能降低容錯壓力，但每區規則仍有戰術答案。重玩舊任務適合取得金幣與經驗，不能取代閱讀目前敵人。"
        ],
        progression: [
          "第 1-5 任務是迷霧小徑。前段教攻擊、格擋與中毒，棘甲雄鹿首次加入護甲。磐背巨獸是第一隻首領，兩次生命門檻都會增厚護甲，因此要把較大攻擊與中毒搭配，而不是反覆使用相同小攻擊。",
          "第 6-10 任務穿越鐵根工坊。鐵根胡狼帶來反擊與疲勞，後續再把它們與護甲、重擊組合。鐵根守衛每進入一個首領階段都會提高反擊傷害，防禦與功能回合也會成為輸出計畫的一部分。",
          "第 11-15 任務進入琥珀大獵。琥珀山貓以加速跳躍意圖，並標記必須打出的牌；虛弱則壓低下一次攻擊。琥珀獵主會同時使用標記、虛弱與加速，生命降低後追獵速度再提升。",
          "第 16-20 任務來到盤沼深潭。盤沼蟾蜍在行動後再生，中毒必須與治療競速，淨化也能清掉準備好的毒蛇戰術。泥沼盤蛇在生命門檻增加被動再生，更鼓勵保留一個完整爆發回合。",
          "第 21-25 任務探索月影典藏。典藏夜梟輪流封印攻擊、防禦與功能牌，迫使牌組在少一種類型時仍能運作。月典守藏者每個階段都會改變禁用牌型，單一類型無法包辦整場戰鬥。",
          "第 26-30 任務逼近霧冠王座。冠霧狼放入詛咒並啟動濃霧；第 28 任務預演三種牌型結界；第 29 任務混合先前規則。霧冠獸王以三相結界開場，加入詛咒、輪替封印，並在最後階段重建結界。通過第 30 任務即完成設計好的戰役，不會轉成只增加數字的無限路線。"
        ],
        designNote: "每個任務採三場戰鬥，是因為牌組選擇需要足夠時間產生差異，又不應把一次瀏覽器遊玩拖成過長耐久戰。兩次臨時選牌形成明確弧線：用準備牌組解開第一題，調整一次，再於菁英或首領前精煉一次。除非濃霧是當前規則，敵人意圖始終可見，讓失敗能回到一個可理解的決策。數值曲線刻意維持接近舊八任務的上限；第 30 任務的困難來自規則交疊，不是無限制膨脹。手機以大張橫向卡牌與點擊操作為主，桌面沿用相同牌序與資訊層級。相較《動物自走小隊》把決策集中在自動戰鬥前，本作要求逐回合親自解牌；相較《動物符文戰棋》使用格子站位，本作把抽牌順序、能量與棄牌時機當成主要空間。",
        parent: "目前瀏覽器會在本機保存已解鎖、最佳與選中任務、玩家等級、經驗、獸王金幣、卡牌收藏、裝備卡、裝備與階級，以及迷霧護符。基本遊玩不需要登入；清除本站瀏覽器資料可能移除進度。一般任務、臨時選牌、使用遊戲內獸王金幣的卡包與六場首領戰都不需要鑽石；永久迷霧護符完全可選，扣除前會顯示持有與剩餘鑽石。能力標籤只描述遊玩活動，不是正式評量。",
        faq: [
          ["獸王牌組可以免費玩嗎？", "可以。完整 30 任務、臨時選牌、獸王金幣卡包與六場首領戰都能直接在瀏覽器免費遊玩。"],
          ["總共有多少任務與首領？", "共有六區、30 個設計任務；第 5、10、15、20、25、30 任務各有一隻不同具名首領與階段機制。"],
          ["哪些進度會保存？", "瀏覽器會保存任務、等級、經驗、獸王金幣、卡冊、裝備卡、裝備階級與迷霧護符。"],
          ["戰鬥後選的卡會永久保留嗎？", "不會。第一、第二場後選的卡只存在本次任務；永久卡牌來自使用獸王金幣購買的卡包。"],
          ["迷霧詛咒怎麼處理？", "詛咒會占用抽牌。花一點能量打出即可從目前戰鬥清除；留在手中結束回合會造成兩點傷害並進入棄牌循環。"],
          ["最終結界怎麼破解？", "分別使用至少一張攻擊、防禦與功能牌。三種牌可以跨回合完成，但最終首領在後期階段會重建結界。"],
          ["鑽石是必要的嗎？", "不是。鑽石只用於可選迷霧護符，會要求二次確認，也不會阻擋任務、遊玩取得的卡牌或首領。"],
          ["手機可以玩嗎？", "可以。任務使用水平滑動軌道，戰鬥使用大張點擊卡與固定結束回合按鈕，不需要鍵盤或滑鼠。"]
        ],
      },
      "animal-orb-fortress": {
        title: "動物星珠要塞",
        difficulty: "困難",
        time: "每關 5-8 分鐘",
        gameplay: "反彈射擊要塞 Roguelite",
        genre: ["反彈射擊", "動作策略", "Roguelite", "動物"],
        skills: ["邏輯", "問題解決", "專注"],
        guideKicker: "WeightPlay 原創遊戲指南",
        guideTitleSuffix: "遊戲指南",
        noteTitle: "玩家與存檔說明",
        hideScoreBands: true,
        intro: "《動物星珠要塞》是一套以閱讀戰場與規劃反彈路線為核心的 30 關防守戰役。每關包含三個連續波次，玩家從獅子守衛旁拖曳瞄準，預覽牆面反彈後放開星珠，在影獸接近水晶核心前擊退牠們。六個五關區域依序加入護甲、荊棘錨點、相位敵人、水晶分裂獸、移動鏡面柱、衝鋒路線，以及六場規則不同的區域 Boss 戰。波次之間選擇本局祝福，關卡之間則用星石升級四個永久要塞房間。",
        story: [
          "水晶要塞位在六條守護道路交會的位置：水晶森林、荊棘工坊、月光遺跡、鏡面寶庫、風暴壁壘與蝕影核心。核心開始發出不穩定脈衝後，暗影動物沿著道路靠近。獅子星珠守衛不能離開核心，因此每次防守都必須從發射室把星珠導向牆面、鏡門與敵方路線。",
          "通過一關代表該段道路已穩定到足以讓修復隊重新開放。盤根魔像守在森林入口，荊背巨獸佔領工坊，月靈女王能穿過月光道路，稜晶甲攝政王控制鏡庫，暴風角守衛標記衝鋒路線，虛空核心皇則以三階段封鎖最後房間。完成第 30 關代表六條道路重新連結，核心也不再吸引新的影獸。"
        ],
        systems: [
          "瞄準與反彈：從發射器拖曳可預覽第一段路線，放開後會射出主星珠與一顆角度相關的弱化回音珠。牆面反彈可以跨越多條路線，或打到被前排遮住的優先目標。分裂星珠能增加第三顆彈體，穿透星芒則縮短同一顆星珠再次命中相同敵人的間隔。",
          "三波關卡：前兩波先讓玩家理解本關規則。第三波通常是特製菁英陣形；第 5、10、15、20、25、30 關則改為具名區域 Boss。通過一波後仍保留核心損傷與本局升級，只暫停讓玩家選一個祝福，再繼續同一關。",
          "特殊敵人：裝甲獸要先消耗固定次數的護甲；不移動的荊棘錨點會定期替鄰近隊友加盾；月光幽靈會用虛線提示進入相位，顯形前無法受傷；水晶分裂獸倒下後會產生兩枚更快碎片；衝鋒獸先標記路線，突進後才留下可攻擊空檔。",
          "鏡面柱：中後期會在競技場內放置一到兩座六角鏡面柱，星珠會真的從柱面反射，形成早期關卡不存在的新路線。有些鏡面柱會左右移動，同一波中原本有效的角度也可能失效。",
          "Boss 規則：盤根魔像會重建防護；荊背巨獸在生命門檻召喚錨點與裝甲護衛；月靈女王交替顯形與相位；稜晶甲攝政王只在金色盾片打開時受傷；暴風角守衛完成標記衝刺後才會外露；虛空核心皇會兩次換階段、補盾、召喚四名護衛並啟動兩座鏡面柱。",
          "本局與永久成長：每波可從巨大星珠、分裂星珠、穿透星芒、快速充能、核心護盾、偵查磁力中選擇祝福。結算取得的星石可提升星珠鍛造室傷害、核心護盾室起始生命、夥伴巢穴支援攻擊與偵查高塔獎勵。花三顆鑽石重抽祝福完全可選，需二次確認，也不是解鎖關卡的必要條件。"
        ],
        how: [
          "從水平滑動的要塞地圖選擇已解鎖關卡，先閱讀關卡名稱、規則標籤與專屬警告。",
          "從獅子守衛旁拖向想要的角度，利用預覽判斷直接射擊、單牆反彈、跨場反彈或鏡柱反射能否命中優先目標。",
          "放開後射出星珠，觀察護甲圈、相位虛線、衝鋒標記、錨點保護與 Boss 提示，再決定下一次射擊。",
          "通過前兩波後各選一個祝福。重抽花三顆鑽石並需要再按一次確認；選好祝福就立刻繼續下一波。",
          "第三波結束前保持核心生命大於零。勝利會保存下一關與星石；失敗仍保存已取得星石，且不會失去最佳已解鎖關卡。",
          "回到地圖使用星石升級房間、重玩舊關，或從結算畫面直接進入下一關。"
        ],
        strategyTips: [
          "不要永遠攻擊最近的敵人。錨點、分裂獸與後排幽靈可能比慢速前排更危險，應用反彈路線處理真正優先目標。",
          "看到相位虛線代表傷害會被擋住。先保留角度，等敵人重新顯形再放開，不要浪費整組星珠。",
          "移動鏡面柱也是工具，不只是障礙。稍微預判柱子移動位置，讓星珠撞上後穿越牆面無法到達的路線。",
          "面對衝鋒獸與暴風角守衛，要先看標記路線並等待恢復空檔；快速充能只有在射擊時機正確時才有價值。",
          "核心護盾與快速充能適合穩住壓力，巨大星珠與穿透星芒能縮短危險 Boss 階段；偵查磁力偏向長期成長，無法立即阻止核心被撞。",
          "只有三個祝福都不符合本關規則時才考慮可選鑽石重抽。正常解鎖 30 關與六名 Boss 都不要求花鑽石。"
        ],
        progression: [
          "第 1-5 關教直接射擊、單牆反彈、分離路線與目標順序。盤根王冠是第一個檢查點；魔像會在外露一段時間後重建防護，所以玩家要先破防，再利用空檔攻擊。",
          "第 6-10 關加入固定次數護甲與不移動的荊棘錨點。第 11-15 關把持續射擊改成相位時機，再加入第一座移動反射門。荊背巨獸會在戰鬥中召援，月靈女王則在無敵相位與恢復空檔間切換。",
          "第 16-20 關加入可實際反射星珠的鏡面柱，以及倒下後產生快速碎片的分裂獸。第 21-25 關加入路線標記、衝鋒與風暴時機。稜晶甲攝政王有旋轉傷害窗口，暴風角守衛必須完成衝刺後才能受傷。",
          "第 26-30 關把護甲、錨點、相位、分裂、衝鋒與移動鏡柱組成特製陣形。第 29 關使用完整普通敵人語彙；第 30 關加入兩次虛空核心換階段、四名支援、補盾與兩座鏡面柱，同時測試瞄準、目標順序、時機、本局祝福與永久房間成長。"
        ],
        designNote: "本作採三個短波次，是為了讓每關像一個集中的反彈問題，而不是過長的耐久戰。波次間保留核心損傷與本局配置，只加入一次簡短祝福決策。前期只使用牆面，讓玩家先理解可預測幾何；後期鏡面柱增加新反射面，也會使背熟的角度失效。特殊敵人用護甲圈、相位虛線、路線標記與獨立 Boss 圖直接傳達反制方式，不要求玩家在戰鬥中閱讀長篇規則。手機以拖曳為主；鍵盤左右鍵調整同一套角度，空白鍵或 Enter 發射。相較《獸王守衛》的配置守衛與《動物自走小隊》的戰前編成，《動物星珠要塞》把射擊路徑本身當作主要策略資源。",
        parent: "瀏覽器會在本機保存最佳已解鎖關卡、星石、遊玩次數，以及星珠鍛造室、核心護盾室、夥伴巢穴、偵查高塔的等級；基本遊玩不需要登入。清除本站瀏覽器儲存資料可能移除進度。鑽石祝福重抽完全可選，會顯示目前與扣除後餘額，不是完成 30 關的必要條件。分數與能力回饋只描述遊玩表現，不是正式能力測量。",
        faq: [
          ["每關的目標是什麼？", "守住水晶核心並通過三個波次。完成第三波會保存關卡、取得星石並解鎖下一關。"],
          ["每關都會出現同一隻 Boss 嗎？", "不會。只有每五關是區域 Boss 檢查點；其他關以特製菁英陣形收尾，六名 Boss 的圖像、提示與反制規則都不同。"],
          ["為什麼星珠穿過月光敵人？", "相位虛線代表敵人暫時沒有實體。等牠重新顯形，再放開已準備好的射擊。"],
          ["鏡面柱有什麼作用？", "它是競技場內真正的反射面；後期鏡柱會移動，讓同一波中的可用反彈路線改變。"],
          ["需要鑽石才能完成戰役嗎？", "不需要。鑽石只在二次確認後重抽一次當波的三個祝福。"],
          ["關卡失敗會怎樣？", "本局會結束，但已取得星石仍會保存，最佳已解鎖關卡不會倒退。可以升級房間、換一條射擊計畫或直接重試。"],
          ["哪些進度會保存？", "最佳已解鎖關卡、星石、遊玩次數與四個要塞房間等級會保存在目前瀏覽器本機。"]
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
        difficulty: "困難",
        time: "每次遠征 6-12 分鐘",
        gameplay: "房間動作 Roguelite",
        genre: ["動作", "Roguelite", "動物冒險"],
        skills: ["邏輯", "問題解決", "專注", "反應"],
        guideKicker: "WeightPlay 原創遊戲指南",
        guideTitleSuffix: "遊戲指南",
        noteTitle: "玩家與存檔資訊",
        hideScoreBands: true,
        intro: "《動物遺跡獵人》是一款擁有 30 個遠征的房間動作遊戲。玩家帶領獅子探險家穿越三個連續房間，裝備中的遺物武器會自動射擊，玩家則要依照不同遺跡區域的敵人行為調整走位。遺跡能量球會在本輪帶來升級選擇；金幣、訓練、裝備與任務進度則保存在本機。六個五關區域各有一位真正不同的守護者，不是把同一隻敵人放大重複使用。",
        story: [
          "遺物之路曾連接六座檔案遺跡：苔痕之門、回聲長廊、水晶地庫、沉沒神殿、月影書庫與王冠宮廷。每座遺跡都負責穩定一種古代動物遺物。王冠封印破裂後，能量沒有只是讓野獸的數字變大；苔原生物開始分裂與衝刺，長廊守衛會在武器射程外攻擊，水晶看守形成擋住固定次數攻擊的護罩，神殿野獸會再生，書庫獵手則用沉默彈暫停遺物射擊。",
          "玩家操作的爆鬃獅是一名攜帶自動遺物核心的野外探險家。每完成一次遠征，就能重新打通一段道路。前兩房的菁英守著金鑰匙，鑰匙可開啟寶箱，把武器、護甲或靴子收入永久背包。第三房決定這條道路是否安全；遠征 5、10、15、20、25、30 分別由苔原守護者、回聲監守、水晶巨像、澤環多頭獸、書庫守密者與遺物冠冕王鎮守。擊敗最後的冠冕王，代表六座遺跡終於能再次交換遺物，不再被腐化房間隔離。"
        ],
        systems: [
          "遠征流程：在橫向 30 關滑軌選擇已解鎖任務。每次從滿血與目前永久裝備開始。清除基本敵群與稍後出現的持鑰菁英，撿起鑰匙、開寶箱並進入傳送門。第二房加入更複雜的混合敵人，第三房則由任務守衛或每五關一次的區域守護者收尾。",
          "移動與攻擊：電腦可用 WASD、方向鍵或在場地按住滑鼠；手機使用虛擬搖桿。武器自動瞄準最近敵人。水晶長劍增加直接傷害，遺跡短刃縮短射擊間隔，護甲增加生命上限，靴子提升移動速度。玩家真正控制的是距離與最近目標：繞開追擊者、從射手背後穿越、切入環繞敵人的圓周，需要不同路線。",
          "特殊敵人：衝刺者會在慢速跟隨後突然加速；射手保持距離並發射遺物彈；脈衝敵人向四周放射；分裂者死亡後產生兩隻衝刺獸；護盾會抵銷固定次數射擊；再生者未受傷一段時間就恢復生命；減速敵人接觸後降低移速；環繞者繞著玩家移動；沉默者暫停自動攻擊。第六區會組合這些規則。",
          "守護者階段：每隻區域 Boss 在生命 70% 與 35% 時改變戰局。苔原召喚衝刺者，回聲釋放更密集的環形彈幕，水晶重建計次護盾，澤環恢復生命並召喚減速獸，月影一邊環繞一邊發射沉默彈，冠冕則同時使用護盾、彈幕、召喚與恢復。最後一關考的是讀懂多種效果，不只是磨掉更長血條。",
          "本輪成長：擊敗敵人會掉落綠色遺跡能量球。經驗條填滿時房間暫停，玩家從三個遺物能力選一個，例如傷害、攻速、生命、移速或吸取範圍。每次選擇可自願花 3 顆鑽石重抽一次。本輪遺物在新遠征開始時重置，因此同一關也能用不同配置解題。",
          "永久成長：金幣掉落與重複裝備轉換可升級背包裝備。角色保存等級提供訓練點，可投入傷害、生命、速度或吸取範圍。背包記錄已取得裝備與三個欄位目前穿戴的物品。可選的迷霧護符會先確認再一次性花費鑽石，把起始生命從 30 改為 40；任何任務、寶箱或守護者都不要求購買。"
        ],
        how: [
          "滑動關卡軌道並選擇已解鎖遠征；第 5、10、15、20、25、30 關會明確標示守護者。",
          "用 WASD、方向鍵、按住滑鼠或手機搖桿移動。瞄準會自動完成，走位決定距離與最近攻擊目標。",
          "清除普通威脅，同時辨識衝刺、遠射、護盾、再生、減速與沉默效果。",
          "收集遺跡能量球；升級時選擇三個本輪能力之一，或使用一次可選重抽。",
          "擊敗第一、二房稍後出現的菁英，撿起金鑰匙開寶箱，再決定立即穿戴或保留目前配裝。",
          "帶著前兩房剩餘生命與本輪能力進入第三房，擊敗任務守衛或區域守護者。",
          "勝利後前往下一任務，或返回關卡進行永久訓練、裝備升級與路線選擇。"
        ],
        strategyTips: [
          "不要每個房間都固定同方向繞圈。外圈被遠射填滿時要反向，環繞敵人確定弧線後則可切過內側。",
          "藍色光圈代表護盾仍在抵銷攻擊。若路線不安全，不必站著硬拆；先保持距離再找射擊窗口。",
          "持續命中再生者可以打斷恢復空窗。面對它時，穩定高傷害通常比四處分散的低傷害更有效。",
          "沉默彈只會暫停自動射擊，不會奪走移動控制。利用這段時間換位，不要貼著敵人等待武器恢復。",
          "生命會帶進下一房，傳送門只提供少量恢復。第三房前選一個防禦遺物，有時比再加傷害更重要。",
          "新裝備在選擇穿戴前就會加入背包。保留目前裝備不會丟掉新物品，之後仍可比較與更換。",
          "永久訓練能降低重試壓力，但守護者階段仍需要走位。第一次挑戰應先學攻擊規律，不必自動花鑽石。"
        ],
        progression: [
          "遠征 1-5 教會最近目標、自動攻擊、普通追擊、計時衝刺與分裂。苔原守護者會在兩個階段召喚更多衝刺獸。",
          "遠征 6-10 加入射手與環形脈衝，空間變成彈道問題。回聲監守的彈幕會讓房間外圈不再永遠安全。",
          "遠征 11-15 加入計次護盾與混合護衛。水晶巨像會兩次重建保護，要求玩家安排爆發時機。",
          "遠征 16-20 組合再生、接觸減速與遠射壓力。澤環多頭獸會恢復生命並呼叫減速敵人。",
          "遠征 21-25 加入環繞路線與暫時沉默。書庫守密者會一邊繞行一邊射出多角度沉默彈。",
          "遠征 26-30 重組之前所有威脅。六印庭院是普通敵人的總驗收，遺物冠冕王則結合護盾、彈幕、召喚與恢復。"
        ],
        designNote: "每次遠征設計成三個房間，是因為前兩房的遺物選擇與寶箱裝備必須有機會影響最後考驗，同時不把單一任務拖成過長的生存戰。自動射擊讓手機操作集中在清楚的走位，鍵盤與按住滑鼠則保留桌面精準控制。第 30 關第三房的基礎倍率刻意維持在 2.3 以下，難度主要來自射程控制、敵人混合與 Boss 階段。這和《動物水晶生存者》的開放式三分鐘競分不同，也不同於《動物自走小隊》的戰前擺陣；本作由房間順序、保留生命、裝備決定與即時導航串成完整遠征。",
        parent: "任務進度、角色等級、經驗、金幣、訓練、已擁有裝備、裝備等級、穿戴欄位與迷霧護符狀態都保存在此瀏覽器。基本遊玩不需要登入；清除網站資料可能移除本機進度。戰鬥不會產生平台鑽石。鑽石只用於可選的迷霧護符確認購買或一次遺物重抽；30 個遠征與六位守護者都不要求鑽石。",
        faq: [
          ["《動物遺跡獵人》可以免費玩嗎？", "可以。30 個遠征、三房路線、裝備掉落與六位守護者都能直接在瀏覽器遊玩。"],
          ["共有多少關與多少 Boss？", "共有 30 個遠征；第 5、10、15、20、25、30 關各有一位機制不同的區域守護者。"],
          ["哪些成長永久保存？", "任務解鎖、等級、經驗、金幣、訓練與裝備會保存在本機；本輪選到的遺物會在新遠征開始時重置。"],
          ["護盾、減速與沉默怎麼運作？", "護盾抵銷固定次數射擊，減速短暫降低移動速度，沉默則暫停自動攻擊；三者都不會拿走走位控制。"],
          ["保留目前裝備會失去新物品嗎？", "不會。新寶箱物品會先加入背包，選擇只決定是否立刻穿戴。"],
          ["鑽石可以做什麼？", "鑽石可確認購買永久迷霧護符，或花 3 顆鑽石重抽一次本輪遺物。任務、裝備與守護者不需要鑽石。"],
          ["需要帳號才能保存嗎？", "不需要。進度保存在目前瀏覽器；清除網站資料或換裝置可能會開始另一份存檔。"],
          ["手機與電腦都能玩嗎？", "可以。手機使用虛擬搖桿與大型選項，電腦支援鍵盤、方向鍵與按住滑鼠移動。"]
        ],
      },
      "animal-rune-tactics": {
        title: "動物符文戰棋",
        difficulty: "困難",
        time: "每個任務 8-15 分鐘",
        gameplay: "回合制小隊戰棋",
        genre: ["策略", "戰棋", "動物冒險"],
        skills: ["邏輯", "問題解決", "專注", "規劃"],
        guideKicker: "WeightPlay 原創遊戲指南",
        guideTitleSuffix: "遊戲指南",
        noteTitle: "玩家與存檔說明",
        hideScoreBands: true,
        intro: "《動物符文戰棋》是在 3×4 符文棋盤進行的 30 任務回合制戰役。獅王守護者、貓頭鷹法師與烏龜盾衛在敵方回合前各能行動一次：移動、攻擊、防守，或花能量使用不同技能。六個五關章節依序加入碎石、束縛、潮汐、燃燒、環月轉動與封印，敵人也會反擊、推移、沉默、標記、吸能或製造分身。第 5、10、15、20、25、30 任務各有一位不同的階段首領，任務與永久成長會保存在目前瀏覽器。",
        story: [
          "六條符文道路把動物領地連接到王冠典藏庫。林地符文固定活根，鍛林符文束縛鐵木，潮汐符文調節淹水石室，餘燼符文排出地熱，月影符文保存記憶，王冠封印則讓前五套系統維持同步。中央符冠破裂後，這些符文開始在沒有守衛的情況下自行運作：橋面凝固成碎石，樹根纏住旅行者，水流推動站在格上的單位，典藏封印反而保護破壞道路的野獸。",
          "玩家指揮三位符文守衛修復道路。獅王負責近戰前線，貓頭鷹能隔兩格攻擊，烏龜則保護並治療全隊。通過任務代表該段符文已穩定，可以繼續前進。石角巨鹿、鐵根犀王、澤環巨蛇、燼鬃獅王與蝕月獅鷲各占據一章；符冠奇美拉吸收了所有系統。第 30 任務擊敗牠，代表典藏庫重新連線，而不是再冒出不存在的第 31 任務。"
        ],
        systems: [
          "回合流程：選擇一名存活英雄後執行一個動作。移動只能走到相鄰合法格；攻擊受英雄射程限制；防守使下一次敵方命中少 1 點傷害。技能花 1 點能量：獅王造成重擊，貓頭鷹攻擊遠距目標，烏龜讓所有存活英雄防守並恢復 1 點生命。行動後英雄會標示完成；全員完成或玩家按下結束回合後，敵人依序行動，英雄能量最多恢復到 3。",
          "敵人差異來自站位規則。暗影狼相鄰時取得狼群加傷；水晶渡鴉瞄準生命比例最低英雄；石角巨鹿會恢復第一次命中的石甲。荊棘野豬在近戰命中後反擊 1 點；符步狐狸行動後繞到最弱英雄後方；潮汐烏龜給最近友軍一次守護；遺物蒼鷺命中後推動英雄；燼角山羊看到同一直線英雄時改用衝鋒。",
          "後期敵人會改變行動順序。餘燼蠑螈移動後留下暫時燃燒格；月塵飛蛾封鎖一名英雄下一個玩家回合的技能，但不封鎖移動、攻擊與防守；典藏貓頭鷹留下標記，使下一次遠程命中加傷；鏡影狼在有相鄰空格時製造一隻 1 生命分身；封印渡鴉吸收 1 點能量但不會降到零以下。第 29 任務會同時組合五章威脅。",
          "棋盤狀態屬於任務設計。碎石不能站立；根鬚束縛會取消受影響英雄下一次移動；潮汐在敵方回合後把單位推一格；燃燒傷害停在上面的英雄；一次性冷卻符文恢復能量並清除燃燒；環月符文讓外圈單位順時針轉動。六符封鎖要求三位英雄占據相連封印格，否則敵方護罩會讓每次傷害少 1。",
          "首領在 70% 與 35% 生命進入累積階段，一次大傷害也不能跳過。石鹿刷新護甲並衝擊同列；犀王架勢防守、打擊整列並留下碎石；巨蛇增加潮汐、拉動英雄，而且同回合未被兩名英雄命中就再生；燼鬃獅放置火焰並在重傷後多行動一次；獅鷲在遠程免疫的飛行與落地橫掃間切換；最終奇美拉組合潮汐、燃燒、碎石、飛行與鏡影召喚。",
          "永久成長有三層。勝利獲得經驗與符文；經驗每滿 100 提高小隊等級。符文可把獅王、貓頭鷹或烏龜升到 6 級，提高起始生命與攻擊。戰後符文獎勵也會保存：力量增加攻擊，守護增加最大生命，碎片增加 35 經驗，專注增加起始能量，復活代幣則在未來自動讓一位倒下英雄以半血回歸。花 3 顆鑽石重抽獎勵與花 18 顆鑽石解鎖訓練格都是選擇性功能，不會解鎖任務或首領。"
        ],
        how: [
          "左右滑動完整的 30 任務軌道，選擇一張已解鎖卡；每五關會顯示具名首領。",
          "進場前閱讀任務名稱、敵人、特性、地形與戰術提示。",
          "在棋盤或小隊行動列選擇獅王、貓頭鷹或烏龜，再點相鄰亮格移動、點可攻擊敵人，或使用防守與技能。",
          "查看完成標記與英雄資訊。只有在保留站位比多做一個動作更安全時，才提早結束回合。",
          "敵方回合注意特性徽章與戰鬥訊息，判讀反擊、守護、推移、衝鋒、沉默、標記、吸能、分身與首領階段。",
          "擊敗所有敵人後選擇一項永久符文獎勵，確認保存的經驗、符文、最佳任務與下一次升級差額。",
          "仍有下一關時可直接前進，也可重玩目前任務，或返回任務頁升級英雄並選擇任何已解鎖關卡。"
        ],
        strategyTips: [
          "先拆開暗影狼的相鄰關係；移動一位英雄有時能同時移除兩次狼群加傷。",
          "不要讓貓頭鷹貼著荊棘野豬攻擊。隔兩格射擊能避開近戰反擊。",
          "被沉默的英雄仍可移動、普通攻擊或防守，可先離開衝鋒線，不必原地等待技能。",
          "對澤環巨蛇時，同一玩家回合必須有兩名不同英雄命中；單一英雄的大技能無法阻止再生。",
          "蝕月獅鷲飛行時會擋住貓頭鷹遠攻，改用獅王；落地前則應分散，避開整列橫掃。",
          "鏡影狼存在時保留一個可控相鄰格，分身出現後立刻清掉 1 生命目標，避免路線被改變。",
          "永久加成只提高容錯。正確使用冷卻、封印與環月格的低等隊伍，仍可能勝過站錯位置的高等隊伍。"
        ],
        progression: [
          "任務 1-5 教導移動、集火、狼群相鄰、渡鴉瞄準與斷橋路線；石角試煉會兩次刷新護甲並處罰留在同列的英雄。",
          "任務 6-10 加入近戰反擊、繞後、根鬚束縛與夾擊；鐵根犀王把安全格變成碎石，使路線在戰鬥中改變。",
          "任務 11-15 用潮汐與蒼鷺推移讓站位在決策後繼續變化；澤環巨蛇再加入欄位拉動與雙英雄止血條件。",
          "任務 16-20 組合暫時燃燒、直線衝鋒與一次性冷卻符文；燼鬃獅王交替使用棋盤火焰、群體壓力與重傷後額外行動。",
          "任務 21-25 用沉默與遠程標記限制技能時機，再讓外圈旋轉；蝕月獅鷲改變能傷害牠的英雄與危險列。",
          "任務 26-30 加入分身、吸能與相連封印，王冠連戰重組五章規則；符冠奇美拉在兩個可見門檻改變地形並召喚鏡影，形成最終目標順序考驗。"
        ],
        designNote: "棋盤固定為三格寬、四格高，讓手機不需平移就能看清每個決策。深度來自每名英雄每回合只有一個動作：為了離開危險而移動，就代表放棄該英雄這次攻擊；有時防守也比追求傷害更好。六個五關章節一次教一套規則，再由章末首領重新組合。敵方生命只每八關增加一次、攻擊只每十二關增加一次，後期壓力主要來自地形、目標順序、行動限制與階段變化。觸控、滑鼠與方向鍵焦點都操作相同邏輯格；它與《自走小隊》的戰前配置或《動物遺物獵人》的即時移動不同，每一步都停下來讓棋盤本身成為題目。",
        parent: "小隊等級、經驗、符文、最佳與已解鎖任務、英雄等級、訓練格、永久攻擊／生命／能量加成與復活代幣都保存在目前瀏覽器。基本遊玩不需要登入；清除網站資料或換瀏覽器可能會建立另一份存檔。鑽石只用於選擇性獎勵重抽或確認訓練格，30 任務、七種地形、特殊敵人與六位首領都不需要鑽石。技能報告只描述本次遊玩，不是正式能力測驗。",
        faq: [
          ["動物符文戰棋可以免費玩嗎？", "可以。30 個任務、特殊敵人、地形、永久符文成長與六位首領都能直接在瀏覽器遊玩。"],
          ["共有多少任務與首領？", "共有 30 個設計任務；第 5、10、15、20、25、30 任務有六位不同圖像、行為與兩階段機制的首領。"],
          ["需要快速反應嗎？", "不需要。這是回合制遊戲，玩家選擇英雄、格子、攻擊、防守或技能時，棋盤不會自行移動。"],
          ["為什麼不能使用技能？", "英雄可能沒有能量、已完成行動，或被月塵沉默。沉默只維持一個玩家回合，不會封鎖移動、普通攻擊與防守。"],
          ["任務結束後哪些會重置？", "戰鬥棋盤會重置；任務解鎖、小隊等級、經驗、符文、英雄等級、符文獎勵、訓練與復活代幣會保存在本機。"],
          ["鑽石能做什麼？", "3 顆鑽石可重抽一次獎勵，18 顆鑽石可確認永久訓練格。鑽石不會解鎖戰役任務、英雄或首領。"],
          ["可以重玩前面的任務嗎？", "可以。所有已解鎖任務都能重玩；完成最終任務後 30 關全部保留，也不會出現假的第 31 關。"],
          ["需要帳號才能保存嗎？", "不需要。進度保存在目前瀏覽器；清除網站資料或更換裝置可能會開始另一份存檔。"]
        ],
      },
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
  localizedGames["zh-Hant"]["animal-auto-squad"] = {
    title: "動物自走小隊",
    age: "13+",
    difficulty: "中等",
    time: "5-10 分鐘",
    gameplay: "自走小隊編成策略",
    genre: ["自走戰鬥", "編成策略", "角色成長", "動物"],
    skills: ["邏輯", "問題解決", "策略規劃"],
    guideKicker: "WeightPlay 原創遊戲指南",
    guideTitleSuffix: "遊戲指南",
    noteTitle: "玩家與存檔說明",
    hideScoreBands: true,
    intro:
      "《動物自走小隊》是一款以戰前決策為核心的編成策略遊戲。玩家可以解鎖並訓練十名動物英雄，把最多六名角色配置在前後兩排，選擇一件遠征聖物，再觀看小隊依照站位與能力自動交戰。戰役共有 30 關，依序穿越荊棘林、水晶洞窟、沉沒遺跡、燼火峰、月光城塞與虛空王冠。每關包含五波固定設計的敵人，第 5、10、15、20、25、30 關則各有一名專屬區域 Boss。",
    story: [
      "遠征路線被影之獸、水晶生物、重甲守衛、符文獸與月蝕獵手分段占據。小隊從荊棘林的苔蘚小徑出發，接著深入棱晶之心、沉沒王冠、火山口之王、子夜王庭，最後沿著破碎天路抵達虛空王冠。每區都有不同的敵人組合與最終首領；完成六區代表解除整條遠征路線的封鎖。",
      "玩家扮演的是小隊指揮者，不是在戰鬥中直接操作某一名角色。星爪狐、泡泡鰭水獺、鼓肚熊貓、月帽貓頭鷹、苔殼烏龜與其他可解鎖英雄，都有明確的攻擊、治療、護盾或倒下效果。真正的任務是在交戰前決定由哪六名角色同行，以及誰應站在前排或後排。",
    ],
    systems: [
      "陣形：上方三格是前排，下方三格是後排。攻擊目標會受到站位影響；部分角色攻擊最前方敵人，月帽貓頭鷹會追擊後排，爆鬃獅則能橫掃整排。",
      "角色定位：攻擊、治療、護盾、全隊增益與倒下效果都會自動觸發。泡泡鰭水獺和彩虹跳兔會照顧受傷隊友，鼓肚熊貓與苔殼烏龜則能提高全隊承受傷害的能力。",
      "遠征聖物：楓葉盾、橡樹種子、影爪與幸運草會改變整場遠征的規則。正常選擇免費；花費 3 顆鑽石只會重新抽選目前提供的聖物。",
      "臨時物資：每場遠征以 12 點物資開始。在準備階段選取已擁有角色，可以購買只在本場有效的等級，增加攻擊與生命；戰鬥中取得的物資會保留在這場遠征內。",
      "永久成長：通過波次可獲得團隊經驗與訓練金幣。團隊等級會提供全員攻擊與生命加成；一般英雄使用訓練金幣解鎖與升級，最高 20 級，另有兩名進階英雄使用可選鑽石解鎖。"
    ],
    how: [
      "在橫向滑動的關卡列選擇已解鎖關卡；每五關會標示一場 Boss 戰。",
      "需要永久強化時，進入訓練分頁使用訓練金幣、解鎖一般英雄，並查看團隊等級提供的全隊加成。",
      "出征後，先點角色背包中的動物，再點六個上場格之一完成配置；也可以點已上場角色重新移動或替換。",
      "選擇一件遠征聖物，並把本場物資用在準備上場的角色，購買臨時攻擊與生命提升。",
      "按下開始戰鬥後，攻擊、治療、護盾、整排攻擊與倒下能力會依照陣形自動結算。",
      "勝利後會直接出現下一波；失敗會扣一點生命並重新開放準備。生命歸零且不復活時，本場遠征結束。",
      "通過第五波後，系統會保存關卡、團隊經驗、訓練金幣與下一個解鎖關卡；結果畫面可選下一關、再試一次或回到關卡。"
    ],
    strategyTips: [
      "按下開始戰鬥前要替完整五波做準備。每波勝利會直接接續下一組敵人，因此能處理多種目標的平衡陣容，比只克制第一波更安全。",
      "前排適合放能承受壓力或提供護盾的英雄。苔殼烏龜、鼓肚熊貓與齒輪角犀牛，可以替後排攻擊手和治療角色爭取時間。",
      "不要只比較攻擊數字，也要看目標規則。月帽貓頭鷹能碰到脆弱後排；敵人集中同一排時，爆鬃獅的整排攻擊更有價值。",
      "六名 Boss 的規則不同：荊棘狼王攻擊整排並替自己加盾，深淵殼海皇會保護與治療敵軍，虛空王冠獅皇則會傷害全隊並恢復自身生命。"
    ],
    progression: [
      "第 1-5 關以較小的荊棘林敵群教導最前目標、後排威脅、守衛與兩排陣形，第 5 關荊棘王座是第一個 Boss 檢查點。第 6-15 關加入水晶洞窟與沉沒遺跡敵人，開始出現後排攻擊、吸血、整排橫掃與高耐久守衛。",
      "第 16-25 關增加同時上場的敵人數與能力組合。燼火峰會混合衝鋒野豬、黑曜重獸、裂隙迅獸與符文狼；月光城塞則加入夜影黑豹、月蝕蝙蝠、符文烏鴉與暗影美洲豹。Boss 波還帶有護衛，因此不能只處理中央首領。",
      "第 26-30 關會使用完整的虛空王冠敵人陣容。第 29 關最多同時出現六名敵人，與玩家的最大編隊相同；第 30 關最後一波讓虛空王冠獅皇與符文、月蝕及暗影護衛同場，檢驗整排輸出、恢復、傷害與整段戰役累積的永久訓練。"
    ],
    designNote:
      "自動戰鬥是刻意的設計選擇：戰鬥執行保持精簡，讓主要思考集中在陣形、定位互補、攻擊目標、聖物選擇與永久訓練。勝利後直接銜接下一波，是為了讓五波像一場完整遠征，而不是五次反覆進出選單；失敗後重新開放準備，則讓玩家能回應問題，不必一直觀看同一套失敗配置。手機採點選角色再點格子的方式，桌面也能使用相同卡片操作。相較於回合制的《動物符文戰棋》或需要即時移動的《動物水晶生存者》，本作要求玩家先完成計畫，再從自動戰鬥結果判斷計畫是否有效。",
    parent:
      "後期關卡會同時組合六人陣形、特殊攻擊目標、永久升級、戰鬥失敗壓力、Boss 能力與可選鑽石決策。關卡進度、上次出場陣容與位置、訓練金幣、團隊等級、已解鎖角色、角色永久等級、已完成關卡與外觀選擇，都會儲存在目前瀏覽器本機；基本遊玩不需要登入。清除本站的瀏覽器儲存資料可能會移除這些本機進度。",
    faq: [
      ["動物自走小隊可以免費玩嗎？", "可以。30 關戰役能直接在 WeightPlay 瀏覽器頁面遊玩，不要求購買或登入。"],
      ["每一關的目標是什麼？", "配置能撐過五波連續敵人的小隊。通過第五波便會保存關卡並解鎖下一關；每五關的最後一波都有區域 Boss。"],
      ["戰鬥時需要手動攻擊嗎？", "不用。玩家在戰前決定角色、前後排、聖物與臨時升級，之後動物會依照能力自動攻擊、治療、加盾與觸發效果。"],
      ["每波之間都能重新排隊嗎？", "勝利會直接進入下一波。只有失敗或平手且仍有生命時，才會回到準備畫面，因此初始陣容要能面對不只一種敵人排列。"],
      ["輸掉一波會怎樣？", "本場會失去一點生命。生命尚未歸零時，可以調整陣容後再挑戰同一波；生命歸零時可結束遠征，或使用可選的 5 顆鑽石復活。"],
      ["鑽石可以做什麼？", "鑽石只提供可選功能，包括重抽聖物、遠征復活、解鎖兩名進階英雄與黃金外觀；一般關卡進度不需要鑽石。"],
      ["哪些進度會保存？", "瀏覽器會在本機保存已解鎖與完成關卡、上次出場陣容與位置、團隊等級與經驗、訓練金幣、已解鎖角色、角色永久等級、遠征紀錄與外觀選擇。"]
    ]
  };
  Object.assign(localizedGames["zh-Hant"]["shadow-wolf"], {
    intro: "影狼傳說是一款 13+ 橫向動作 RPG。玩家在遺跡中跳躍、衝刺、攻擊影獸，收集鑰匙與遺物，逐步挑戰古獸首領。",
    how: [
      "使用 A/D 或方向鍵左右移動。",
      "按 W、上方向鍵或空白鍵跳躍；在空中再按一次可二段跳。",
      "按 J 或滑鼠左鍵揮爪攻擊；按 K 或 Shift 衝刺。",
      "擊敗影獸、收集經驗，升級後選擇遺物能力。",
      "菁英敵人會掉落鑰匙，可開啟寶箱取得裝備。"
    ],
    strategyTips: [
      "二段跳要保留給尖刺與高台落點，避免連續踩到陷阱。",
      "跌落時會回到最近的安全地面並扣除少量生命，先觀察下一個平台再衝刺。",
      "衝刺有短暫無敵時間，可用來穿過蝙蝠的投射物。",
      "迷霧護符是可選的鑽石永久升級；一般關卡進度不需要花鑽石。"
    ],
    parent: "這款遊戲適合青少年練習空間判斷、即時反應、手眼協調與裝備選擇。所有進度只保存在本機，僅供娛樂與自我練習，不是診斷、排名或正式評量。",
    faq: [
      ["影狼傳說可以免費玩嗎？", "可以。WeightPlay 遊戲可直接在瀏覽器免費遊玩。"],
      ["掉進陷阱會怎樣？", "角色會回到最近的安全地面，並受到少量生命懲罰。"],
      ["怎麼挑戰首領？", "保持移動、利用高台躲避衝撞，並在安全空檔從側後方攻擊。"]
    ]
  });
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
  localizedGames["zh-Hant"]["campus-dash"] = zhGuide("\u8349\u539f\u9583\u96fb\u8dd1", "\u8def\u7dda\u9583\u907f\u8dd1\u9177", [
    "\u5de6\u53f3\u79fb\u52d5\u5207\u63db\u8dd1\u9053\u3002",
    "\u907f\u958b\u969c\u7919\u4e26\u6536\u96c6\u661f\u661f\u3002",
    "\u4fdd\u6301\u53cd\u61c9\u901f\u5ea6\u5b8c\u6210\u6311\u6230\u3002",
  ]);
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

  localizedGames["zh-Hant"]["shadow-wolf"] = {
    title: "影狼傳說",
    difficulty: "困難",
    time: "每關 3–8 分鐘",
    gameplay: "橫向動作平台 RPG",
    genre: ["動作", "平台", "動物", "RPG"],
    skills: ["邏輯", "問題解決", "專注"],
    guideKicker: "WeightPlay 原創遊戲指南",
    guideTitleSuffix: "遊戲指南",
    noteTitle: "玩家與存檔說明",
    hideScoreBands: true,
    intro:
      "《影狼傳說》是一款 30 關橫向動作平台戰役。玩家帶領探險影狼穿越遺跡岩台、判讀地形警示、迎戰影獸、收集經驗，並在升級時精確分配兩點屬性。每五關會遇到一名區域首領；牠們的防禦狀態與攻擊規則各不相同。",
    story: [
      "六道封印原本維持月影邊境到巨獸王冠之間的道路。封印破裂後，水晶洞窟會落下碎晶，根野會長出封路荊棘，燼火寶庫週期燃燒，蝕月裂隙會吹動角色，而王冠之路會重新組合前五區學過的威脅。",
      "玩家扮演刻有月光符文的探險影狼。必須擊敗目前關卡安排的全部敵人，才算修復這一段道路。勝利會保存通關並解鎖下一張卡；第 30 關代表解除最後的巨獸封印，所有已完成關卡仍可重玩。"
    ],
    systems: [
      "移動與戰鬥：左右奔跑、地面跳躍後再二段跳、朝面向方向揮爪，並用衝刺短暫穿越危險。接觸敵人、投射物、尖刺與啟動地形會扣除影狼生命；掉落路線會回到穩定地面並損失 5 點生命。",
      "經驗與屬性：普通與特殊敵人會掉落經驗光珠。升級會暫停同一個戰鬥畫面並給予兩點必須分配的屬性。力量提高傷害、敏捷提高速度、體質提高生命上限、幸運提高爆擊率，每個按鈕都顯示目前值與下一個值。",
      "特殊敵人：水晶蝙蝠使用三向散射，裝甲野豬在巡邏撞牆後開放防禦，衝鋒野豬快速穿越路線，燼狼留下火徑，俯衝蝙蝠追蹤高度，裂隙蝙蝠在棲台間閃現，鏡狼倒下後只會分裂一次並產生兩個脆弱殘影。",
      "地形：落晶、毒池、根刺、火焰、震波與裂風都先出現警示再進入危險期。移動岩台會改變跳躍路線，固定尖刺則在任何時候都不能碰觸。",
      "可選永久支援：霧影護符需要 15 顆鑽石，會把每次挑戰的初始生命上限從 30 提高到 40。第一次點擊只顯示扣除前後餘額，第二次才確認；正常關卡解鎖不需要鑽石。"
    ],
    how: [
      "從橫向 30 關卡列選擇已解鎖關卡；每第五張卡是首領檢查點。",
      "用 A/D 或左右方向鍵移動，W、上方向鍵或空白鍵跳躍；落地前再按一次即可二段跳。",
      "按 J 揮爪、K 或 Shift 衝刺。手機使用可見的左右、跳躍與攻擊按鈕。",
      "看到虛線地形時先決定退路；看到敵人外圍的護甲或護盾圈時，先觸發牠的反制空檔再攻擊。",
      "收集經驗並在升級畫面分配完兩點屬性，戰鬥才會繼續。",
      "擊敗完整敵人組合即可通關。勝利會保存進度並解鎖下一關；失敗可直接重試，不會刪除舊通關。"
    ],
    strategyTips: [
      "先保留第二段跳，等移動岩台、散射彈或地形循環確認安全落點後再使用。",
      "衝刺適合穿過投射物扇形或衝鋒尾端，之後立即轉身利用敵人的恢復時間揮爪。",
      "準備處理裝甲野豬前，先清除會干擾反擊空檔的遠程敵人。",
      "力量縮短戰鬥、體質容許更多失誤、敏捷改善走位、幸運提供不固定爆發；依關卡規則選擇，不存在唯一升級順序。",
      "擊敗鏡狼前先離開分裂點，避免兩個殘影同時在角色身旁出現。"
    ],
    progression: [
      "第 1–5 關教學巡邏、上下岩台、蝙蝠瞄準、移動平台與尖刺；蛇王幽谷加入毒池與逐漸擴大的投射扇形。",
      "第 6–10 關加入落晶警示、水晶蝙蝠散射與裝甲野豬；石衛會擋住正面揮爪，地震後放出兩道可跳過的震波並暫時解除防禦。",
      "第 11–15 關混合荊棘路線、衝鋒、裝甲與遠程優先順序；棘根巨像平時保護核心，根拳重擊落空後才出現短暫傷害窗口。",
      "第 16–20 關循環火焰地帶，加入燼狼火徑與俯衝蝙蝠；燼翼飛龍在空中受到保護並發射火扇，落地震波之後才可有效反擊。",
      "第 21–25 關加入裂風、閃現蝙蝠與分裂鏡狼；蝕月靈鹿會反射大部分傷害，必須誘導衝鋒撞上競技場邊緣才能破盾。",
      "第 26–30 關把前面的反制規則組成清楚的混合挑戰；巨獸王冠在兩個生命門檻加入落晶、根刺與更密集射擊，但完成後不會產生不存在的第 31 關。"
    ],
    designNote:
      "戰役採六組五關教學弧線，因為動作平台遊戲應透過辨識與反制增加難度，而不是只提高生命與速度。每區前四關介紹或組合一條規則，第五關則用有清楚防禦狀態與攻擊空檔的首領驗收。地形先警示再啟動，讓觸控玩家能作出有意識的按鍵選擇，同時保留壓力。手機與桌面共用固定邏輯畫布，因此岩台、HUD、操作、升級與結果的相對位置一致。與 WeightPlay 自走戰鬥不同，本作的閃避、跳躍、目標優先與攻擊時機都由玩家直接控制。",
    parent:
      "目前瀏覽器會在本機保存最高解鎖關卡、選定關卡、通關清單、挑戰次數、最佳通關、王冠通關次數與霧影護符。舊八區存檔會向前遷移，不會重新鎖住已取得進度。基本遊玩不需要登入；清除網站資料或更換瀏覽器可能移除紀錄。鑽石只是可選支援資源。",
    faq: [
      ["《影狼傳說》可以免費玩嗎？", "可以。完整 30 關戰役可直接在瀏覽器遊玩，不需要購買或登入。"],
      ["關卡如何解鎖？", "新存檔從第 1 關開始。擊敗完整敵人組合後會保存該關並解鎖下一張卡；已通關關卡仍可重玩。"],
      ["影狼掉下去會怎樣？", "影狼會回到穩定地面並損失 5 點生命；只有這次損失讓生命歸零時才會結束挑戰。"],
      ["為什麼裝甲敵人只受到很少傷害？", "目前防禦狀態仍在。要利用衝鋒落空、地震、根拳、落地或撞牆等可見事件打開反擊窗口。"],
      ["一定要分配完兩點屬性嗎？", "是。兩點都分配到力量、敏捷、體質或幸運之後，戰鬥才會繼續。"],
      ["完成 30 關需要鑽石嗎？", "不需要。鑽石只用於可選霧影護符，正常戰役進度不需要它。"],
      ["哪些進度會保存？", "關卡解鎖與通關、選定關卡、挑戰次數、最佳通關、王冠通關與護符會保存在目前瀏覽器。"],
      ["六名首領有什麼不同？", "蛇王控制毒池、石衛震地後開盾、巨像暴露核心、飛龍交替飛行與落地、靈鹿撞牆破盾、巨獸則依生命階段加入落晶與根刺。"]
    ],
  };

  gameplayProfiles["beast-tactician"] = { gameplay: "Hero Tower Defense", genre: ["Tower Defense", "Strategy", "Animal"] };
  localizedGameplayProfiles["zh-Hant"]["beast-tactician"] = { gameplay: "英雄塔防", genre: ["塔防", "策略", "動物"] };
  localizedGameplayProfiles["zh-Hant"]["animal-hero-trials"] = { gameplay: "英雄動作試煉", genre: ["動作", "Roguelite", "動物"] };
  localizedGameplayProfiles["zh-Hant"]["animal-gearpack-expedition"] = { gameplay: "空間行囊策略遠征", genre: ["策略", "Roguelite", "動物"] };
  localizedGameplayProfiles["zh-Hant"]["animal-moonlight-heist"] = { gameplay: "潛行撤離冒險", genre: ["潛行", "策略", "冒險", "動物"] };
  localizedGames["zh-Hant"]["beast-tactician"] = {};

  Object.assign(localizedGames["zh-Hant"]["beast-tactician"], {
    title: "獸王守衛",
    difficulty: "困難",
    time: "每關 8-15 分鐘",
    gameplay: "英雄塔防",
    genre: ["塔防", "策略", "動物"],
    skills: ["邏輯", "問題解決", "專注"],
    guideKicker: "WeightPlay 原創遊戲指南",
    guideTitleSuffix: "遊戲指南",
    noteTitle: "玩家與存檔說明",
    hideScoreBands: true,
    intro:
      "《獸王守衛》是一套以自由改造路線為核心的 30 關英雄塔防戰役。玩家在森林格子上配置四種動物士兵與七名 WeightPlay 英雄，保留至少一條可通行路線，穿越六個五關區域並守住水晶核心。暗狼、重甲野豬、飛行影蝠、再生敵群、受傷加速者與月蝕混合編隊，都需要不同的防線。第 5、10、15、20、25、30 關各有改變規則的 Boss，不是只把普通敵人的生命放大。",
    story: [
      "水晶路線連接守護森林的六個區域：最初的樹根小徑、水晶空中通道、鐵皮木工坊、會再生的霧林、暴風壁壘，以及通往虛根王座的月蝕道路。敵群會從入口穿越玩家安排的防線前往另一端核心；通關代表該段路線已安全到足以讓守衛隊前進。",
      "玩家是整條防線的指揮者。栗果守衛與苔甲太郎負責撐住轉角，偵查弓手與月帽歐菈覆蓋長距離，符文工兵緩速群體，醫護幼獸修復受傷阻擋者，火花菲雅則負責集中攻擊 Boss。每個角色站的位置都會改變敵人行走距離、射擊角度或阻擋風險。"
    ],
    systems: [
      "路線建置：守衛可以放在一般地格，地面敵人會重新尋找路徑。若完全封死所有道路，敵人不會消失，而是攻擊最近的阻擋者直到路線恢復。飛行影蝠不受地面迷宮影響。",
      "角色定位：阻擋者爭取時間，弓手與歐菈負責遠程，工兵提供濺射與緩速，醫護修復前線，菲雅專門處理 Boss 壓力，齒角魯克斯則強化附近隊友。點選已部署角色可查看升級費用與出售返還。",
      "波次情報：每波開始前會列出暗狼、野豬、影蝠、護衛與 Boss 組成。非最終波通過後有五秒倒數，玩家可以讀取下一波、花費剛取得的金幣並調整升級。",
      "特殊敵人：鐵皮木區的敵人有可擊破護甲；霧林敵人移動時恢復生命；暴風敵人在生命低於一半後加速；月蝕區會同時混合護甲、再生、加速、飛行與較高緩速抗性。",
      "永久進度：勝利會取得星等、升級點與鑽石。升級點可提高英雄力量、守衛生命或開場經濟；鑽石只用於可選的核心復活、結果獎勵重抽與黃金守衛框，正常解鎖 30 關不需要鑽石。"
    ],
    how: [
      "從可滑動關卡列選擇已解鎖關卡，先閱讀敵情、建議與獎勵。",
      "花費本關金幣，在一般地格配置動物士兵或 WeightPlay 英雄；確認前可查看攻擊範圍。",
      "保留至少一條通路。完全封路時，地面敵人會直接攻擊最近守衛。",
      "閱讀波次情報後開始戰鬥，依照敵人組成升級或出售角色；非最終波會在五秒後自動接續。",
      "守住全部波次後，系統依剩餘核心生命給予一至三星，結果畫面可以前往下一關、重試或回到關卡。",
      "需要永久成長時，在關卡頁使用升級點強化英雄力量、守衛生命或開場經濟；鑽石操作會顯示成本並要求確認。"
    ],
    strategyTips: [
      "先用栗果守衛做出兩到三個射擊轉角，再投資昂貴英雄；路線越長，遠程角色就有越多攻擊時間。",
      "不要封死所有格子。完全封路會讓敵人直接打阻擋者，反而失去拉長路線的優勢。",
      "影蝠渡口與後續飛行關要在核心附近保留遠程火力；暴風關則應先緩速野豬，再擊破護甲，降低受傷加速的威脅。",
      "面對再生敵人，要把輸出集中在同一火力區快速收掉；面對護甲敵人，先用持續或濺射火力破防，再投入英雄爆發。",
      "最終的虛根皇帝會在兩個生命門檻轉換階段：先召喚影蝠，再帶著重甲地面護衛並重建防護。"
    ],
    progression: [
      "第 1-5 關教路線轉角、分線、早期遠程、野豬壓力與封路後果。暗影巨漢的攻城節奏比普通 Boss 更快，第一區最後要測試防線是否有真正能撐住的主坦。",
      "第 6-10 關加入無視地面路線的影蝠與空地混合波；森林巨獸損失部分生命後會召喚暗狼與影蝠。第 11-15 關加入可擊破的鐵皮護甲，鐵皮巨像則會在戰鬥中重新建立一層大型防護。",
      "第 16-20 關讓未被擊倒的敵人在移動時再生，翠綠古木會回血並呼叫支援。第 21-25 關加入受傷加速，暴風掠奪者還會提高護衛速度。第 26-30 關把先前規則全部組合並降低緩速效果；虛根皇帝進行兩次階段轉換，要求地面路線、空中覆蓋、破甲、收尾火力、治療與 Boss 集火同時成立。"
    ],
    designNote:
      "本作採自由配置，是因為核心決策不只是買哪座塔，而是每個角色如何改變移動時間、射擊角度與阻擋風險。波次之間保留五秒倒數，讓五波仍像同一場連續防衛，同時給玩家短暫調整時間。30 關分成六個機制區域，難度會先透過新反制與規則組合成長，再增加數值。手機與桌面共用大型建置卡與格子操作，鍵盤也能移動游標、建置、選取、升級、出售、切換角色與開始波次。相較於以戰前編隊為主的《動物自走小隊》，《獸王守衛》允許玩家即時重塑戰場並在波次中回應。",
    parent:
      "瀏覽器會在本機保存最高解鎖關卡、已通關關卡、最佳星等、永久科技、升級點、鑽石餘額與外觀所有權；基本遊玩不需要登入。清除本站瀏覽器儲存資料可能會移除這些進度。鑽石操作完全可選，不是解鎖 30 關的必要條件。",
    faq: [
      ["獸王守衛可以免費玩嗎？", "可以。完整 30 關戰役能直接在瀏覽器遊玩，不要求購買或登入。"],
      ["要怎麼開始關卡？", "在滑動關卡列選擇已解鎖關卡後開始防衛；非最終波通過後會在五秒倒數結束時自動接續。"],
      ["為什麼敵人有時會直接打守衛？", "當所有通往核心的合法路線都被封死時，地面敵人會攻擊附近阻擋者。下一次可出售或換位置，保留一條開放道路。"],
      ["六個 Boss 有什麼不同？", "暗影巨漢快速攻城、森林巨獸召援、鐵皮巨像重建護甲、翠綠古木回血、暴風掠奪者加速護衛、虛根皇帝則有兩次階段轉換。"],
      ["星等代表什麼？", "星等依勝利時剩餘核心生命計算。驚險通關仍可解鎖下一關，之後能重玩改進路線與最佳星等。"],
      ["哪些進度會保存？", "解鎖、通關、星等、升級點、永久科技、鑽石與外觀所有權都會保存在目前瀏覽器本機。"],
      ["鑽石可以做什麼？", "鑽石可選擇性用於核心復活、結果獎勵重抽或黃金守衛框，不影響正常戰役解鎖。"]
    ],
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
      "13+": scoreAttack ? [0, 220, 221, 400, 401] : [0, 110, 111, 190, 191],
      Family: [0, 50, 51, 100, 101],
    };
    const ages = /^(12|13)\+$/.test(game.age) ? [game.age] : [game.age, "5+", "7+"];
    return ages
      .filter((age, index, list) => age && list.indexOf(age) === index)
      .slice(0, 3)
      .map((age) => {
        const [b0, b1, g0, g1, e0] = baseByAge[age] || baseByAge["5+"];
        return { age, beginner: `${b0}-${b1}`, good: `${g0}-${g1}`, excellent: `${e0}+` };
      });
  }

  localizedGames["zh-Hant"]["animal-rope-rescue"] = {
    title: "動物藤蔓救援",
    age: "6+",
    difficulty: "簡單到中等",
    time: "2～6 分鐘",
    gameplay: "藤蔓物理解謎",
    genre: ["物理", "益智", "動物"],
    skills: ["手眼協調", "問題解決", "專注"],
    intro: "《動物藤蔓救援》是一款 30 關動物物理解謎遊戲。玩家要切斷掛著水果的藤蔓、持續移動葉子彈墊，最後把水果送進等待動物的籃子。六組五關課程會逐步加入移動籃子、上下分層風向、彈跳後反轉的風、雙重彈跳、較窄入口，以及兩份或三份連續野餐配送。每五關有一次友善 Panko 檢核，不加入戰鬥或計時壓力。",
    story: [
      "果園裡的配送藤蔓長過了森林空地，讓蘋果、香蕉和莓果掛在離訂購動物很遠的地方。Panko 負責整理救援地圖，兔子、獅子、熊貓、狐狸和無尾熊則在籃子旁等待。玩家扮演葉子引導員，決定彈墊放在哪裡、何時切斷藤蔓，並在水果飛行時持續修正位置。",
      "完成全部 30 關代表重新打通六條果園配送路線。最終 Panko 終極救援會在同一個遊玩畫面服務三隻動物，並結合分層風、移動籃與雙重彈跳。勝利代表完成整場野餐配送，而不是打敗敵人。"
    ],
    systems: [
      "每條路線開始時都有掛在藤蔓上的水果、可移動的葉子彈墊與籃子目標。切斷前後都能移動葉子。水果至少要碰到葉子一次，籃子才會接受它，因此只把水果直接落在動物上方並不能過關。",
      "水果會受到該關重力與目前風力影響。葉子依照接觸位置提供向上速度與水平推力：碰在中央會彈得較直，碰到左右邊緣則會飛得更遠。飛出場外或錯過籃子會進入友善重試結算，不會刪除已保存的進度。",
      "移動籃關卡會在切斷後持續改變接取位置。分層風關卡在空地上半部與下半部使用不同推力；反轉風會在第一次碰葉後改變方向。雙彈關卡會鎖住籃子直到完成第二次彈跳，柔葉關卡則降低彈跳高度，要求玩家更貼近水果。",
      "連續配送會把玩家留在同一個遊玩畫面。每次成功後會換成下一份水果、動物與路線，配送數從 1/2 或 1/3 前進；只有全部水果都進籃，才會顯示結算。",
      "最高解鎖關卡、各關最佳星等、最佳分數與遊玩次數保存在目前瀏覽器。不需登入；清除網站資料可能移除這些本機紀錄。"
    ],
    how: ["從橫向關卡軌道選擇已解鎖的救援卡。", "先閱讀關卡名稱、水果到動物的路線，以及規則提示。", "用觸控、滑鼠或左右方向鍵移動葉子，再按切斷。", "水果落下時持續移動葉子，利用接觸位置改變飛行方向。", "依提示完成彈跳次數，並追蹤移動籃或變化風向。", "完成路線中的每份水果配送，解鎖下一關。"],
    strategyTips: ["切斷前先把葉子放到第一次掉落路線下方，水果移動後再做小幅修正。", "碰葉子中央可以取得高度；只有籃子在遠方時，才使用葉子左右邊緣增加水平距離。", "面對移動籃時，要瞄準水果彈回來時籃子將到達的位置。", "分層風關卡可比較水果越過空地中段前後的方向變化。", "雙彈關卡第一次接觸後仍需保持控制，不要把水果送得太遠而接不到第二次。", "野餐配送要閱讀下一份規則，不要假設第二顆水果使用相同風向或彈跳次數。"],
    progression: [
      "第 1～5 關教導平靜、右風、左風與長距離彈跳；Panko 平衡檢核首次加入緩慢移動籃。",
      "第 6～10 關專注移動目標，改變籃子速度、方向與入口大小；Panko 移動籃檢核還要求兩次葉子接觸。",
      "第 11～15 關加入依高度變化或彈跳後反轉的風；Panko 風向檢核把分層風與移動籃結合。",
      "第 16～20 關要求雙重彈跳，並加入會產生較低弧線的柔葉；Panko 雙彈檢核同時使用反向風與移動籃。",
      "第 21～25 關加入不離開遊玩畫面的雙水果野餐配送。兩條路線可能使用相反風、不同彈跳次數，或共用一個移動籃。",
      "第 26～30 關結合窄入口、移動目標、分層與反轉風、雙彈控制，以及兩份或三份配送；Panko 終極救援使用三種不同路線，不是只增加數字。"
    ],
    designNote: "遊戲採用一次切斷加上持續葉子控制，讓玩家在水果釋放後仍然負責。30 關會改變玩家必須判讀的資訊，包括目標移動、不同高度風向、彈跳次數、葉子彈力、入口寬度與配送順序，而不只是讓重力越來越快。直向遊玩區讓手機上的水果有足夠飛行時間可修正，同一邏輯畫布也會在平板與橫向畫面等比例縮放。Panko 檢核提供適合 Kids 的難度里程碑，不會把水果配送益智變成戰鬥。",
    parent: "《動物藤蔓救援》可陪伴孩子練習時機、視覺預測、手眼協調、專注與簡單問題解決。成人可以詢問籃子接下來會移到哪裡，或第二次彈跳為何需要不同葉子位置。遊戲沒有計時、廣告、帳號要求、排名壓力或敵對戰鬥；星等與進度只是本機遊戲回饋，不是正式能力測驗、診斷或學校評量。",
    faq: [
      ["一共有多少關？", "共有 30 個具名關卡，分成六組五關課程，每五關有一次友善 Panko 檢核。"],
      ["切斷藤蔓後還能移動葉子嗎？", "可以。水果下落與每次彈跳後持續控制葉子，是遊戲的主要操作。"],
      ["為什麼水果穿過籃子？", "每份配送至少需要一次葉子彈跳；標記關卡可能要求兩次彈跳或使用較窄入口。"],
      ["移動籃與分層風怎麼運作？", "移動籃會在切斷後改變水平位置；分層風會在空地上半部與下半部施加不同推力。"],
      ["野餐配送會發生什麼？", "兩顆或三顆水果會留在同一個遊玩畫面連續配送，全部完成後才顯示結算。"],
      ["水果沒接到會怎樣？", "友善結算會提供再玩一次、選關或大廳，不會刪除已解鎖進度。"],
      ["需要登入或會顯示廣告嗎？", "不需要登入；這款 Kids 遊戲沒有廣告，基本進度只存在目前瀏覽器。"],
      ["星等是正式能力分數嗎？", "不是。星等只是遊戲進度回饋，不是診斷或評量。"]
    ]
  };

  localizedGames["zh-Hant"]["bubble-bakery"] = {
    title: "動物泡泡烘焙坊",
    difficulty: "簡單到中等",
    time: "3～5 分鐘",
    gameplay: "泡泡連線訂單益智",
    genre: ["益智", "烘焙", "動物"],
    skills: ["邏輯", "問題解決", "專注"],
    intro: "《動物泡泡烘焙坊》是由 Panko 烘焙教練帶領的 30 關步數制配對益智遊戲。玩家點擊相連的兔兔、鯨魚、小雞、青蛙或狐狸泡泡，完成不同烘焙盤的訂單。7×10 棋盤會在每次消除後向下掉落並從上方補入新泡泡。後段加入群組門檻、依序訂單、雙盤與三盤配送、最大群組目標和大批量加成；每五關還有一次友善 Panko 檢查。Kids 版本永久無廣告。",
    story: [
      "Panko 經營一間用動物圖片印章代替文字食材單的小烘焙坊。兔兔代表莓果點心、鯨魚代表海洋杯子蛋糕、小雞代表陽光糕點、青蛙代表花園捲、狐狸代表莓果蛋糕。配送車會在有限步數後抵達，因此玩家要替 Panko 組合相連印章，在車子離開前完成畫面上的烘焙盤。",
      "30 張訂單分成六堂烘焙課。Panko 會在第 5、10、15、20、25、30 關檢查工作台，但這些是友善食譜測驗，不是戰鬥。完成第 30 關 Panko 大師烘焙坊，代表能依序服務三盤、做出六個泡泡的大批次，並開放所有烘焙盤供玩家重玩與補滿星星。"
    ],
    systems: [
      "棋盤始終有 70 個原生泡泡按鈕，排列為七欄十列。相同泡泡只有上下或左右接觸才算連線，斜角不相連。被選中的泡泡會在原格縮小消失，上方泡泡再掉落，新的泡泡從遮罩上緣進入。",
      "每次有效消除使用一步。只有目前有效的訂單動物會減少烘焙盤計數，非目標群組仍可用來改變棋盤。連續命中訂單會累積連擊和分數；結算星等依剩餘步數計算，能力報告則記錄訂單命中、最大群組與最高連擊。",
      "群組門檻關卡要求至少三個或四個泡泡才能消除。依序訂單會一次亮起一種動物；提早消除後面的動物只會改變棋盤，不會推進其數量。加成關卡讓四、五或六個以上的大群組額外計入目前訂單。",
      "多盤關卡在下一張食譜出現時保留同一棋盤與剩餘步數。最大群組關卡除了完成訂單，還要至少一次達到顯示的群組大小。第 30 關會同時使用三張食譜、四個群組門檻、依序目標、六個加成門檻與最大群組六的要求。",
      "已解鎖關卡、最佳星等、關卡分數證據、常客印章、貼紙數、遊玩次數與最高到達關卡都存在目前瀏覽器。遊玩不需要登入；清除網站資料可能會移除這些紀錄。"
    ],
    how: ["從橫向關卡軌道選擇已解鎖的烘焙盤。", "點擊前先看動物訂單方塊與精簡規則符號。", "點擊兩個以上上下或左右相連的相同泡泡；後段可能要求三個或四個。", "只有需要整理棋盤時，才使用不屬於目前訂單的消除。", "在步數歸零前完成每張食譜，以及畫面顯示的最大群組目標。", "從結算繼續、重試、回關卡，或重玩舊訂單取得更多星星。"],
    strategyTips: ["先從棋盤底部觀察；消除較低群組會移動更多泡泡，也更容易產生新連線。", "依序訂單中，先保留尚未亮起的動物群組，等輪到它時再使用。", "群組門檻關卡不要浪費步數點小群組；先消除附近泡泡把它們合在一起。", "大批量加成可節省步數，但最大群組關卡仍需至少一次達到指定大小。", "多盤配送不會重置棋盤，因此第一盤結束前就要替下一張食譜保留有用群組。"],
    progression: [
      "第 1～5 關建立基本連線、雙目標選擇、第一次群組大小目標與四個泡泡加成；Panko 初次檢查只接受三個以上群組，並要求一次四個群組。",
      "第 6～10 關專注大型批次，門檻從三個提高到四個；Panko 大批次檢查要求所有訂單都用四個以上群組完成，並做出一次五個群組。",
      "第 11～15 關加入依序隊列，只有亮框動物會推進；Panko 隊列檢查把相同規則帶進兩張連續食譜。",
      "第 16～20 關加入雙道與三道服務。棋盤與步數會跨盤延續，因此第一盤完成前就要替下一盤準備。",
      "第 21～25 關把隊列、群組門檻、加成、多張食譜與群組目標交叉組合；Panko 慶典檢查要求以三個以上群組完成兩張依序烘焙盤。",
      "第 26～30 關是大師訂單，重點是大型群組與三盤規劃，不只是提高數量；最終關明確結合四個門檻、依序目標、大批量加成、三張食譜與六個群組目標。"
    ],
    designNote: "我們把棋盤固定為 7×10，因為它能填滿直向手機，同時保留圓形泡泡比例和真正規劃群組的空間。戰鬥頁只有點擊動作，但每次消除都會改變重力、後續連線、訂單連擊與剩餘步數。本次 30 關改造加入會改變『哪一組值得點』的規則，而不是只提高訂單數。Panko 檢查提供容易記住的難度里程碑，也不會把烘焙益智遊戲變成戰鬥。鍵盤與螢幕閱讀器玩家會取得動物、列、欄、群組大小、有效訂單與目前門檻等完整資訊。與直接單件分類的《動物顏色便當盒》不同，本作要求玩家持續重塑同一棋盤並提前規劃數步。",
    parent: "《動物泡泡烘焙坊》可陪伴孩子練習視覺分組、計數、規劃、專注與簡單問題解決。成人可以詢問為什麼底部消除會改變棋盤，或哪一組應保留給下一盤。遊戲沒有計時、廣告、帳號要求或排名壓力；星等、分數、印章、貼紙與能力報告只是保存在本機的遊戲回饋，不是智力測驗、診斷或正式學校評量。",
    faq: [
      ["一共有多少關？", "共有 30 個具名關卡，分成六堂五關課程，每五關有一次友善 Panko 檢查。"],
      ["哪些泡泡算相連？", "相同泡泡必須上下或左右接觸；只碰到斜角不算同一群組。"],
      ["為什麼相同群組沒有填入訂單？", "關卡可能要求更大的最低群組，或正在依序等待另一種有亮框的動物。"],
      ["切換到下一張食譜會發生什麼？", "訂單計數會換成新食譜，但棋盤與剩餘步數繼續保留。"],
      ["大批量加成怎麼計算？", "在標記關卡達到顯示門檻時，該群組會替目前有效訂單多計入泡泡。"],
      ["步數歸零會怎樣？", "未完成訂單會顯示支持性重試結算，已保存的解鎖與舊星等不會消失。"],
      ["需要登入或會顯示廣告嗎？", "不需要登入；這款 Kids 遊戲沒有廣告，進度只存在目前瀏覽器。"],
      ["能力報告是正式測驗嗎？", "不是。它只整理本場訂單命中、最大群組、連擊、分數與剩餘步數。"]
    ]
  };

  localizedGames["zh-Hant"]["wonder-crash"] = {
    title: "奇幻獅子防衛",
    difficulty: "中等",
    time: "5～8 分鐘",
    gameplay: "橫向移動自動射擊防衛",
    genre: ["動作", "守城", "動物"],
    skills: ["反應", "專注", "手眼協調"],
    intro: "《奇幻獅子防衛》是由爆鬃獅雷歐擔任主角的 30 關動物守城遊戲。玩家沿著奇幻城牆左右移動，裝備的橡皮擦、鉛筆與尺會依各自冷卻時間自動攻擊。八種野獸依直線、左右交替、外側與中央四種編隊進攻，每五關還有一種不同攻擊規則的王。波次之間可選本場強化，結算後再用保存的金幣提升雷歐、裝備或城牆。Kids 版本沒有計時壓力，也永久無廣告。",
    story: [
      "爆鬃獅雷歐守護 WeightPlay 魔法文具庫外的城牆。野豬、鬣狗、犀牛、水牛、猛鷹、黑熊、老虎與鱷魚受到鉛筆、尺和橡皮擦中的魔力吸引而來。雷歐不能離開城牆，因此玩家要在牆前巡守，讓自動武器對準危險路線，並在一場防衛結束後修補長期傷害。",
      "戰役分成六條、每條五關的防衛路線。第 5、10、15、20、25、30 關各有一位野獸指揮者；首次通關會開啟下一關，王關首次通過還會取得已記錄的鑽石獎勵。擊退第 30 關黑熊星落王與完整獸群，代表文具庫可以重新安全開放。"
    ],
    systems: [
      "玩家可在戰場點擊或拖曳，讓雷歐水平移動；桌面鍵盤聚焦後也能用左右方向鍵。每個裝備欄有獨立冷卻，即使裝備重複武器也會分別射擊。鉛筆、尺與橡皮擦在速度、傷害、大小與節奏上各有差異。",
      "每關有三到七波。擊敗野獸可取得金幣，城牆必須在最後一隻敵人倒下前保留至少一點生命。波次之間可從三個選項挑一項，強化傷害、冷卻、數量、側射、連射、大小、穿透、濺射、擊敗回復、金幣、減速或立即修牆。",
      "八種敵人不是只換圖片：野豬與老虎高速前進，鬣狗與黑熊左右走曲線，犀牛用護甲降低第一次傷害，水牛與鱷魚擅長破牆，猛鷹會突然俯衝。每關指定敵人編成與進場位置，後段不再只是所有野獸隨機出現。",
      "六位王各有獨立規則：野豬王快速追擊；鬣狗王發射成對交叉彈；犀牛王先用六層護盾吸收攻擊並投出重彈；水牛王向城牆中央發射大型攻城彈；猛鷹王俯衝並連射兩發高速彈；黑熊王施放三連星落。",
      "最高關卡、永久強化、裝備、金幣與已領取的王關鑽石都存在目前瀏覽器。結算會顯示剩餘牆血、擊敗數、強化選擇與獎勵，再提供下一關、重玩或回選單。"
    ],
    how: ["開啟戰鬥頁，左右滑動關卡軌道並選擇已解鎖關卡。", "開戰前查看關卡名稱、敵人圖片、編隊提示、波數與王關標記。", "把雷歐移到最需要火力的路線下方；武器會自動射擊。", "每波結束選一個強化，依下一波敵人編成調整打法。", "在所有普通野獸與王被擊敗前，讓城牆生命保持在零以上。", "用結算獎勵永久提升角色、裝備或城牆，再繼續或重玩。"],
    strategyTips: ["穿透與濺射適合固定直線或中央重兵；側射適合左右交替與外側進攻。", "不用追逐每一隻快獸；守住有效射線，看到猛鷹或老虎加速時提早移動。", "對抗犀牛護盾王時，先用快速多發攻擊拆掉六層護盾，再讓高傷害武器發揮。", "水牛攻城與鱷魚攻城等破牆關卡，修牆與擊敗回復的價值更高。", "最終黑熊星落王會分散三發較弱投射物；廣域傷害可控制混合護衛，移動則用來維持危險路線的火力。"],
    progression: [
      "第 1～5 關教直線、左右入口與鬣狗曲線；野豬追擊王在混合護衛後方快速瞄準射擊。",
      "第 6～10 關加入中央重甲、破牆獸、曲線施法獸與天空急襲；鬣狗交叉火網王會在雙側獸群間發射成對投射物。",
      "第 11～15 關刻意分離敵人角色，讓玩家比較穿透、速度覆蓋與修牆。犀牛護盾王必須先承受六次破盾攻擊。",
      "第 16～20 關把俯衝猛鷹與重甲、曲線路線混合；水牛攻城王用大型慢速重彈直接威脅城牆中央。",
      "第 21～25 關組合護甲快攻、曲線衝刺、重獸城門與側翼破牆；猛鷹王會反覆加速並射出兩發高速彈。",
      "第 26～30 關用四種編隊複習八種角色；黑熊星落王以三發投射物和完整獸群收尾，不是前一位王的數值放大版本。"
    ],
    designNote: "我們採用自動射擊，讓玩家持續思考雷歐該站在哪裡，而不是在手機上反覆確認小型射擊按鈕是否按到。每個裝備欄的獨立冷卻保留配裝價值，波次強化則提供短暫的策略停頓。本次 30 關改造以指定敵人編成與四種清楚的進場陣形取代舊後段的全種類隨機，再用六種王的投射物規則建立里程碑。手機點擊、拖曳與桌面方向鍵都控制同一個有邊界的邏輯戰場。本作比《動物顏色便當盒》更要求反應與配裝，但仍遵守 Kids 規則：無廣告、無倒數壓力、可支持性重試，能力報告也不是正式評量。",
    parent: "本作包含卡通動物攻城、自動文具武器、城牆生命與強化選擇，可陪伴孩子練習反應、專注、規劃與手眼協調。能力報告與星等只是依本場牆血、擊敗數與選擇整理的遊戲回饋，不是發展、醫療或學校測驗。Kids 頁面沒有廣告，也不需要登入；進度保存在目前瀏覽器，清除網站資料可能會移除紀錄。",
    faq: [
      ["一共有多少關？", "共有 30 個具名關卡，分成六條五關路線，王關位於第 5、10、15、20、25、30 關。"],
      ["武器會自動攻擊嗎？", "會。每個裝備欄依自己的冷卻時間射擊，玩家負責移動雷歐與選擇波次強化。"],
      ["後段關卡為什麼不同？", "各關指定敵人編成與直線、交替、外側或中央陣形，六位王也有不同投射物規則。"],
      ["城牆生命歸零會怎樣？", "本次防衛結束，可選擇重試或回關卡；已保存的永久進度不會因此消失。"],
      ["王關鑽石怎麼取得？", "每個王關只有首次通關會取得記錄中的鑽石獎勵，重玩仍會有一般關卡收益。"],
      ["不用滑鼠也能玩嗎？", "可以。觸控支援點擊與拖曳，桌面戰鬥聚焦後可用左右方向鍵。"],
      ["Kids 版本有廣告或需要帳號嗎？", "沒有廣告請求，也不需要登入；進度只存在目前瀏覽器。"],
      ["能力報告是正式測驗嗎？", "不是。牆血、擊敗數、選擇、星等與分數只代表這一場遊戲。"]
    ]
  };

  localizedGames["zh-Hant"]["color-lunchbox"] = {
    title: "動物顏色便當盒",
    difficulty: "簡單",
    time: "1～3 分鐘",
    gameplay: "圖片顏色分類",
    genre: ["幼兒", "教育", "動物"],
    skills: ["顏色辨識", "專注力", "手眼協調"],
    intro: "《動物顏色便當盒》是一款以圖片為主的溫和分類遊戲，共有 30 個、每關固定五份食物的短關卡。孩子要協助六位動物守護員準備野餐、早餐、花園與慶典便當，把食物放進符合實際顏色的盒子。後段會加入相近顏色、無害的空盒、只看圖片的提示，以及答對後才安全換位的便當盒。遊戲沒有計時、廣告或失敗畫面，選錯只會得到友善提示並再次嘗試。",
    story: [
      "彩虹食材庫負責替六條社區路線的動物朋友準備餐點。食材標籤被風吹散後，草莓、米飯、魚、蔬菜、飲料和點心都需要依顏色放回正確便當盒。玩家扮演食材庫小幫手；完成五次配對，就能裝好一份配送便當並開啟下一站。",
      "咪咪、歐拉、諾里、波哥、塔羅與菲亞分別在第 5、10、15、20、25、30 關等候。他們不會戰鬥，也不會因錯誤處罰玩家，而是帶來一次換位、每題安全換位、圖片優先、額外空盒、中途鏡像與綜合規則。完成菲亞的彩虹慶典檢查，代表六條路線都收到分類正確的便當。"
    ],
    systems: [
      "每關固定出現五份食物。畫面中央顯示大型食物圖片，便當盒以清楚色塊呈現；玩家可以點盒子，也可以把食物拖到盒子上，兩種操作使用完全相同的判定。",
      "答對會推進五分之一進度，並把食物貼紙加入結算遊行。答錯不扣生命、不重置關卡，盒子仍可繼續選擇。",
      "圖片模式只在視覺上隱藏食物與顏色名稱，螢幕閱讀器仍保留完整標籤。干擾盒只是本關沒有食物使用的顏色，正確答案一定存在。會移動的盒子只在答對後換位，拖曳進行中絕不移動。",
      "最高解鎖關卡只儲存在目前瀏覽器。玩家可重玩任何已解鎖關卡；完成第 30 關後不會產生不存在的第 31 關，彩虹慶典仍可再次挑戰。"
    ],
    how: ["在橫向關卡路徑選擇已解鎖的關卡。", "觀察大型食物圖片，對照各便當盒的顏色色塊。", "點選正確盒子，或把食物拖到盒子上。", "若盒子在答對後換位，先等動畫停穩再選下一題。", "完成五份食物即可觀看貼紙遊行並解鎖下一關。"],
    strategyTips: ["先說出食物名稱，再觀察它的實際顏色；遇到相近暖色或冷色時會更容易比較。", "圖片關卡不必尋找文字，直接看食物外形與大型色塊。", "看到額外空盒時先逐一排除，不需要快速猜測。", "盒子換位後重新掃視整排；位置改變，但顏色不會改變。"],
    progression: [
      "第 1～5 關以固定盒位與熟悉食物建立基本配對；咪咪會在第三次答對後進行一次換位。",
      "第 6～10 關比較暖色、冷色、明色與暗色，並加入圖片野餐；歐拉會在每次答對後重新排列盒子。",
      "第 11～15 關加入紅與粉紅、藍與青等相近顏色，以及一個無害空盒；諾里把圖片提示與干擾盒結合。",
      "第 16～20 關依蔬菜、水果、早餐與點心分組；波哥的自助餐用七個盒子搭配五份食物，增加觀察而不延長局數。",
      "第 21～25 關進一步組合換位與圖片配對；塔羅會在花園檢查中途把盒位鏡像交換一次。",
      "第 26～30 關加入六盒彩虹、暖冷交替、兩個空盒與連續安全換位；菲亞的最終慶典同時使用圖片提示、一個空盒和每題換位。"
    ],
    designNote: "我們把每關固定為五份食物，讓幼兒能在短時間內完成一個有開始與結束的任務。點擊與拖曳並存，是為了兼顧手機、平板、滑鼠與不同操作習慣。難度來自觀察而不是速度：相近顏色、額外空盒與位置變化會逐項加入，盒子移動時也會鎖定輸入並顯示清楚動畫。六位守護員替 30 關提供容易記住的里程碑，但不把幼兒分類遊戲變成戰鬥。與 WeightPlay 的動作遊戲不同，本作沒有計時、生命、廣告或失敗狀態，重點是安靜重複練習與清楚的完成感。",
    parent: "本遊戲可陪伴孩子練習顏色辨識、視覺比較、專注與手眼協調。成人可以請孩子說出食物名稱，或比較兩種相近顏色，但遊玩不需要閱讀。進度與分數只保存在目前瀏覽器，僅供遊戲回饋，不是發展測驗、診斷或學校評量。",
    faq: [
      ["不識字也可以玩嗎？", "可以。食物圖片與顏色色塊就是主要指示，圖片模式還會刻意隱藏可見答案文字。"],
      ["一共有多少關？", "共有 30 關，每關固定五份食物，並在每五關安排一次動物守護員檢查。"],
      ["為什麼有些便當盒會移動？", "部分後段關卡會在答對後換位。動畫期間會暫停輸入，拖曳途中也絕不移動。"],
      ["額外盒子會讓關卡無解嗎？", "不會。干擾盒只是沒有食物使用的顏色，每一題的正確盒子一定存在。"],
      ["遊戲有計時或失敗嗎？", "沒有計時、生命限制或失敗畫面；答錯會得到友善提示並再次嘗試。"],
      ["關卡進度會保留嗎？", "最高解鎖關卡會存在目前瀏覽器；清除網站儲存資料可能會移除進度。"],
      ["這款 Kids 遊戲有廣告嗎？", "沒有。本作不發出廣告請求，也不保留廣告空間。"],
      ["分數是能力評量嗎？", "不是。分數與進度只是遊戲回饋，不代表孩子的發展或能力。"]
    ]
  };

  games["animal-moonlight-heist"] = {
    title: "Animal Moonlight Heist",
    difficulty: "Medium to Hard",
    time: "3-8 minutes per mission",
    gameplay: "Stealth Route Adventure",
    genre: ["Stealth", "Route Planning", "Adventure", "Animal"],
    skills: ["Planning", "Focus", "Risk Assessment"],
    guideKicker: "WeightPlay Original Game Guide",
    guideTitleSuffix: "Game Guide",
    intro:
      "Animal Moonlight Heist is a 30-mission stealth route adventure starring Spark Paw Fia and Moon Cap Orla. Every mission asks the player to read moving patrols, preview one deliberate route at a time, recover a real archive object, and reach extraction before Alert fills. Optional treasure offers a third medal and more Moon Coins, but later missions turn that choice into a route-planning problem through shadow shelters, ordered seals, shifting markers, clockwork patrol rhythms, warning bells, and six named archive guardians.",
    story: [
      "The Moon Archive is not one room. It is a chain of galleries, vaults, observatories, courier halls, and sealed collections that preserve the navigation records of the WeightPlay animal world. A broken eclipse mechanism has placed its security system into permanent lockdown. Ordinary patrols now treat every moving shape as an intruder, archive markers slide between mirrored pedestals, and the extraction gates obey old seal routines instead of Orla's safehouse clearance.",
      "Moon Cap Orla plans each entry while Spark Paw Fia enters the archive. Fia is not fighting the guards: the job is to recover the misplaced seals, courier tokens, star maps, clockwork lenses, and district relics without escalating the lockdown. Clearing a mission restores one route to the archive map. Passing the Lantern Auditor, Bell Warden, Mirror Keeper, Clockwork Marshal, Vault Sealkeeper, and Eclipse Curator proves that an entire five-mission wing is safe. Mission 30 ends the lockdown by completing the Curator's full eclipse route; it does not invent a false Mission 31."
    ],
    systems: [
      "Route movement is committed in short decisions. Hold or drag inside the archive to preview a dashed line, then release to send Fia to that point. On desktop, WASD or the arrow keys move in bounded steps. Patrols continue to travel while the player plans, and their visible sight circles show the detection distance. Remaining near a patrol raises Alert; reaching open space or a shadow shelter lets it fall. A full Alert meter ends the attempt, but Retry is free.",
      "Each route contains a mission object, an extraction gate, and optional treasure. The object must be secured before extraction becomes active. Treasure is a deliberate detour that supplies the third medal and extra Moon Coins. In nine sealed-vault missions, treasure becomes the first seal and must be collected before the object. Triple Lock and Eclipse Curator then move extraction to a new location after the object is recovered, so memorizing the opening route is not enough.",
      "The three gadgets support different approaches. Lightning Dash shortens committed movement time, useful when crossing a patrol line. Star Decoy pauses patrol movement for a level-based duration. Smoke Leaf resets Alert and grants a short cover window. Gadget strengths are rolled from Level 1 to Level 3 before a mission. A confirmed three-Diamond reroll changes those strengths, while confirmed five-Diamond insurance preserves optional treasure through one capture. Neither purchase unlocks a mission or replaces free Retry.",
      "The campaign has six nonnumeric rule families. Shadow circles temporarily hide Fia from sight. Bell pulses add Alert outside shadow after a visible warning. Mirror shimmer swaps the live object and treasure markers. Clockwork wings alternate a blue slow phase with an amber pursuit surge. Ordered seals change which marker is valid first. Spotlight guardians expand and contract their sight radius. The final missions combine these rules rather than relying on patrol speed alone.",
      "A victory awards one medal for extraction, one for avoiding capture, and one for optional treasure. The best medal count for every mission, the highest unlocked mission, Moon Coins, and Safehouse level are stored locally. Safehouse level rises as groups of five different missions are cleared. Cleared cards remain replayable, and the next mission unlocks permanently. Result stays inside the Battle screen and offers Retry, Missions, or Next Mission when another stage exists."
    ],
    how: [
      "Open the 30-card Moon Archive rail and select any unlocked mission. Guardian checkpoints appear at Missions 5, 10, 15, 20, 25, and 30.",
      "Read the mission-specific rule and inspect the guardian portrait before choosing Lightning Dash, Star Decoy, or Smoke Leaf.",
      "Hold and drag in the archive to preview a route. Release to move Fia, or use WASD and arrow keys for shorter desktop steps.",
      "Watch patrol sight circles and the Alert meter. Enter a cyan shadow circle when a bell, spotlight, or crossing patrol makes open movement unsafe.",
      "Collect the mission object and then reach the active extraction marker. When a rule says treasure is the first seal, the object cannot be collected until that seal is open.",
      "Decide whether the optional treasure is worth its longer route. It supplies the third medal and extra Moon Coins, but ordinary progress never requires it."
    ],
    strategyTips: [
      "Preview from the position where Fia actually stands. A safe destination can still be a poor choice if the movement line remains exposed for too long.",
      "Use Lightning Dash for crossings, Star Decoy when several patrol paths overlap, and Smoke Leaf when Alert is already high. Their purposes differ even when their levels are equal.",
      "Bell warnings are decisions, not decoration. If a pulse is near, enter a shadow circle before taking the next long route; the pulse raises Alert only outside cover.",
      "During mirror missions, watch the shimmer instead of chasing the old marker. Waiting one second can turn a long dangerous route into a short one.",
      "Clockwork patrols are easiest to cross during the blue slow phase. The amber border and guardian glow warn that the faster sweep has begun.",
      "In sealed missions, plan three legs before moving: treasure seal, mission object, then extraction. Missions 29 and 30 relocate the last leg after pickup, so keep Alert capacity for the changed exit."
    ],
    progression: [
      "Missions 1-5 teach direct routes, crossing patrols, optional treasure, and extraction. Lantern Auditor ends the wing with a searchlight whose sight radius visibly expands and contracts.",
      "Missions 6-10 introduce cyan shadow shelters. Routes begin to connect cover points, and Bell Warden ends the wing with a telegraphed pulse that raises Alert whenever Fia remains outside shadow.",
      "Missions 11-15 make information unstable. Object and treasure markers exchange positions after a shimmer; False North also requires treasure first. Mirror Keeper shortens the swap interval at the checkpoint.",
      "Missions 16-20 add clockwork rhythm. Patrols alternate between a readable slow watch and a fast amber surge. Clockwork Marshal combines that timing with central cover and announces every pursuit phase.",
      "Missions 21-25 turn treasure into the first of two archive seals. Crossed routes, shadow shelters, and changing speed make collection order matter. Vault Sealkeeper physically guards the center while both seals are opened.",
      "Missions 26-30 recombine the full vocabulary. Spotlight, bell, mirror, clockwork, shadow, and seal rules overlap. Eclipse Curator uses all of them, reverses patrol direction after the relic, and relocates extraction for the final route."
    ],
    designNote:
      "We designed Moonlight Heist around repeated small commitments instead of continuous joystick movement. A route preview gives touch players time to read the board, but patrol motion means waiting still has consequences. The same field accepts pointer routes, touch routes, and keyboard steps without changing its logical geometry. Six five-mission wings introduce one decision language at a time, and each guardian uses unique art, a visible warning, and a counter that reuses something already learned. Difficulty therefore grows through information, timing, order, and route shape before raw speed. Unlike Animal Hero Trials, there is no attack loop, and unlike Animal Auto Squad, there is no prebuilt combat formation: mastery comes from observing when a path is safe and deciding how much optional risk to accept.",
    parent:
      "Animal Moonlight Heist runs in the browser without requiring an account for basic play. Mission unlocks, best medals, Moon Coins, and Safehouse level are stored in this browser; clearing site data or moving to another browser may start a separate profile. Normal progression, every guardian, Retry, and all 30 missions are free. Diamonds are optional platform currency used only for a clearly confirmed gadget-strength reroll or one-capture treasure insurance. The game does not present its planning or focus feedback as a formal ability test.",
    faq: [
      ["How many missions and guardians are included?", "There are 30 authored missions in six wings. Missions 5, 10, 15, 20, 25, and 30 use six separately illustrated guardians with different rules and counters."],
      ["Why can I not collect the mission object?", "In treasure-first seal missions, the treasure marker is the first seal. Collect it before returning to the mission object."],
      ["What do the cyan circles do?", "They are shadow shelters. Fia is hidden from patrol sight and protected from bell pulses while inside one."],
      ["Why did the object and treasure move?", "Mirror missions warn with a shimmer and then exchange the two live markers. Their new positions are real, not a visual decoy."],
      ["What changes in clockwork missions?", "Patrols alternate between a blue slow phase and an amber surge. The field border and guardian glow provide the warning."],
      ["Are Diamonds required?", "No. Diamonds only reroll gadget strengths or insure optional treasure after explicit confirmation. They do not unlock missions, guardians, medals, or Retry."],
      ["Does progress save without an account?", "Yes. Unlocks, best medals, Moon Coins, and Safehouse level are stored locally in this browser. Clearing local site data may remove them."],
      ["Can Mission 30 be replayed?", "Yes. Every unlocked mission remains replayable. Finishing Eclipse Curator ends the current 30-mission campaign and does not display a nonexistent next mission."]
    ]
  };
  localizedGames["zh-Hant"]["animal-moonlight-heist"] = {
    title: "動物月影潛行隊",
    difficulty: "中等至困難",
    time: "每個任務約 3 至 8 分鐘",
    gameplay: "潛行路線冒險",
    genre: ["潛行", "路線規劃", "冒險", "動物"],
    skills: ["規劃", "專注", "風險判斷"],
    guideKicker: "WeightPlay 原創遊戲指南",
    guideTitleSuffix: "遊戲指南",
    intro: "《動物月影潛行隊》是由閃爪菲亞與月帽歐拉主演的 30 任務潛行路線遊戲。每個任務都要觀察移動巡邏、預覽一次移動路線、回收真正的檔案物件，並在警報填滿前抵達撤離點。額外寶藏可帶來第三枚獎章與更多月光幣；後期則加入陰影掩護、封印順序、鏡面換位、發條節奏、月鐘警報與六位檔案守衛。",
    story: [
      "月光檔案庫由畫廊、寶庫、天文室、信使大廳與封印收藏區組成，保存 WeightPlay 動物世界的導航紀錄。故障的日蝕機關讓保全系統永久封鎖：巡邏員把任何移動身影視為入侵者，鏡面基座會交換標記，撤離門也只遵循古老封印程序。",
      "月帽歐拉負責規劃，閃爪菲亞進入檔案庫。任務不是攻擊守衛，而是在不升高封鎖的情況下回收月之封印、信使徽記、星圖、發條透鏡與區域遺物。每通過一位守衛，就代表一整個五任務區域恢復安全；第 30 關通過日蝕館長的完整路線後，封鎖正式結束，不會假裝還有第 31 關。"
    ],
    systems: [
      "按住或拖曳可預覽虛線路線，放開後菲亞才會前往該點；桌面也可用 WASD 或方向鍵短距離移動。巡邏不會因玩家思考而停止，視野圈會顯示偵測距離。靠近巡邏會提高警報，離開視線或進入陰影則會降低；警報全滿會被發現，但可免費重試。",
      "每關都有任務物、撤離門與選擇性的寶藏。先取得任務物，撤離門才會啟動；寶藏會提供第三枚獎章與更多月光幣。九個封印任務會把寶藏改為第一道封印，必須先取寶藏再取任務物。第 29、30 關取得任務物後，撤離門還會移到新位置。",
      "閃電衝刺會縮短移動時間，適合穿越巡邏線；星光誘餌會暫停巡邏；煙霧葉會清空警報並短暫掩護。任務前會出現 1 至 3 級強度。花費 3 顆鑽石可在確認後重抽強度，5 顆鑽石保險可在一次被發現後保留額外寶藏；兩者都不會解鎖關卡，也不會取代免費重試。",
      "六種非數值規則會真正改變路線：陰影圈可隱藏菲亞；月鐘預告後會提高陰影外的警報；鏡光會交換任務物與寶藏；發條區會在藍色慢速與琥珀加速間交替；封印關改變收集順序；探照守衛的視野會擴張與收縮。最終任務把這些規則組合起來。",
      "成功撤離獲得一枚獎章、未被發現再得一枚、帶回寶藏得到第三枚。每關最佳獎章、最高解鎖任務、月光幣與安全屋等級都保存在本機。每完成五個不同任務，安全屋會成長；已解鎖任務可重玩，Result 會提供重試、任務列表，以及存在時的下一任務。"
    ],
    how: ["在 30 張任務卡中選擇已解鎖關卡；第 5、10、15、20、25、30 關是守衛檢查點。", "先閱讀關卡規則與守衛圖像，再選擇閃電衝刺、星光誘餌或煙霧葉。", "在檔案庫內按住拖曳預覽路線，放開移動；桌面可用 WASD 或方向鍵。", "觀察視野圈與警報；月鐘、探照光或交叉巡邏造成壓力時，可先進入青色陰影圈。", "取得任務物後前往亮起的撤離門；若規則寫著寶藏是第一道封印，就必須先取寶藏。", "自行判斷是否繞路取得額外寶藏；它提供第三枚獎章與更多月光幣，但不是普通進度的必要條件。"],
    strategyTips: ["路線安全不只看終點，還要看菲亞在移動途中會暴露多久。", "閃電衝刺適合穿越，星光誘餌適合多條巡邏交會，煙霧葉適合警報已高時使用。", "月鐘預告出現時先進陰影，脈衝只會傷害掩護外的路線。", "鏡面關要看閃光，不要追著舊標記；等待一秒可能讓長路線變短。", "發條關在藍色慢速階段穿越，琥珀邊框與守衛發光代表加速已開始。", "封印關先規劃寶藏、任務物、撤離三段路；第 29、30 關還要保留警報空間應付移動出口。"],
    progression: ["任務 1 至 5 教導基本路線、交叉巡邏、寶藏與撤離；提燈審查官以擴張探照光收尾。", "任務 6 至 10 加入陰影掩護；月鐘守衛會預告脈衝，陰影外的菲亞將增加警報。", "任務 11 至 15 讓資訊改變，任務物與寶藏會換位；星鏡看守會縮短換位間隔。", "任務 16 至 20 加入藍色慢速與琥珀加速；發條巡察長會預告每次全速追蹤。", "任務 21 至 25 把寶藏變成第一道封印；寶庫封印官守住中央，必須依序解除兩道封印。", "任務 26 至 30 組合探照、月鐘、鏡面、發條、陰影與封印。日蝕館長在取物後反轉巡邏並移動撤離門。"],
    designNote: "本作採用一次次短路線承諾，而不是持續搖桿移動。預覽讓觸控玩家有時間讀圖，但巡邏持續移動，因此等待也有代價。觸控、滑鼠與鍵盤共用同一個固定邏輯畫面。六個五任務區域逐步引入決策語言，每位守衛都有專屬完成品角色圖、可見預告與已教過的反制方式。難度優先來自資訊、時機、順序與路線形狀，不只是速度。它沒有《動物英雄試煉》的攻擊循環，也沒有《自走小隊》的戰前陣型；核心是觀察安全時機與選擇額外風險。",
    parent: "《動物月影潛行隊》可直接在瀏覽器遊玩，基本進度不需要帳號。任務解鎖、最佳獎章、月光幣與安全屋等級保存在目前瀏覽器；清除網站資料或更換瀏覽器可能建立另一份進度。全部 30 關、六位守衛、普通進度與重試皆免費。鑽石只用於明確確認的裝置強度重抽或一次寶藏保險。遊戲不把規劃與專注回饋當成正式能力測驗。",
    faq: [["共有多少任務與守衛？", "共有 30 個原創任務；第 5、10、15、20、25、30 關各有一位不同圖像、規則與反制方式的守衛。"], ["為什麼無法取得任務物？", "在寶藏優先的封印關，寶藏是第一道封印；先取得它，再回到任務物。"], ["青色圓圈有什麼作用？", "它們是陰影掩護。菲亞位於其中時不會被巡邏視野或月鐘脈衝偵測。"], ["為什麼任務物和寶藏移動了？", "鏡面關會先出現閃光預告，再交換兩個仍存在的標記；新位置就是實際目標。"], ["發條關有什麼不同？", "巡邏會在藍色慢速與琥珀加速間交替，畫面邊框與守衛光芒會提示階段。"], ["一定要使用鑽石嗎？", "不用。鑽石只在確認後重抽裝置強度或替選擇性寶藏投保，不會解鎖任務、守衛、獎章或重試。"], ["不登入也會保存嗎？", "會。解鎖、最佳獎章、月光幣與安全屋保存在目前瀏覽器；清除本機網站資料可能移除它們。"], ["第 30 關可以重玩嗎？", "可以。所有已解鎖任務都能重玩；通過日蝕館長後不會顯示不存在的下一任務。"]]
  };

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
        score: (game.skills || []).filter((skill) => (activeBaseGame.skills || []).includes(skill)).length + (activeBaseGame.age && game.age === activeBaseGame.age ? 1 : 0),
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
        ids: activeBaseGame.age
          ? relatedGameEntries(activeId, activeBaseGame, (game) => game.age === activeBaseGame.age).slice(0, 4)
          : [],
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
      ".stage-grid, .stage-rail, .mission-grid, .mission-rail, .region-rail, .route-rail, .level-grid"
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
      "#mapPanel",
      "#levelSelect",
      "#menuPanel",
      ".stage-panel",
      ".stage-screen",
      ".stage-shell",
      ".stage-select",
      ".world-map-panel",
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
    const showRecommendedAge = Boolean(baseGame.age) && !/^(12|13)\+$/.test(baseGame.age);

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
          <span class="game-info-kicker">${escapeHtml(game.guideKicker || uiLabel("kicker"))}</span>
          <h2>${escapeHtml(game.title)} - ${escapeHtml(game.guideTitleSuffix || uiLabel("titleSuffix"))}</h2>
          <p>${escapeHtml(game.intro)}</p>
        </div>
        <div class="game-info-facts">
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("gameplay"))}</span><strong>${escapeHtml(game.gameplay || game.title)}</strong></div>
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("genre"))}</span><div class="game-info-tags">${(game.genre || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
          ${showRecommendedAge ? `<div class="game-info-fact"><span>${escapeHtml(uiLabel("recommendedAge"))}</span><strong>${escapeHtml(localizeAge(game.age))}</strong></div>` : ""}
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("difficulty"))}</span><strong>${escapeHtml(localizeDifficulty(game.difficulty))}</strong></div>
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("estimatedTime"))}</span><strong>${escapeHtml(localizePlayTime(game.time))}</strong></div>
          <div class="game-info-fact"><span>${escapeHtml(uiLabel("skills"))}</span><div class="game-info-skills">${gameSkills.map((skill) => `<span>${escapeHtml(localizeSkill(skill))}</span>`).join("")}</div></div>
        </div>
      </div>
      <div class="game-info-sections">
        ${
          game.story?.length
            ? `
              <div class="game-info-section game-info-story">
                <h3>${escapeHtml(uiLabel("worldAndMission"))}</h3>
                ${game.story.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
              </div>
            `
            : ""
        }
        ${
          game.systems?.length
            ? `
              <div class="game-info-section game-info-systems">
                <h3>${escapeHtml(uiLabel("gameSystems"))}</h3>
                <ul>${game.systems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
              </div>
            `
            : ""
        }
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
        ${
          game.progression?.length
            ? `
              <div class="game-info-section game-info-campaign">
                <h3>${escapeHtml(uiLabel("progressionAndDifficulty"))}</h3>
                ${game.progression.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
              </div>
            `
            : ""
        }
        ${
          game.designNote
            ? `
              <div class="game-info-section game-info-design">
                <h3>${escapeHtml(uiLabel("developerNote"))}</h3>
                <p>${escapeHtml(game.designNote)}</p>
              </div>
            `
            : ""
        }
        <div class="game-info-section game-info-parent">
          <h3>${escapeHtml(game.noteTitle || uiLabel("parentNote"))}</h3>
          <p>${escapeHtml(game.parent)}</p>
        </div>
        ${
          game.hideScoreBands
            ? ""
            : `
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
            `
        }
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
