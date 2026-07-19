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
  if (!document.querySelector('link[href*="battle-canvas-standard.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("battle-canvas-standard.css", sharedAssetBase).href;
    link.dataset.wpBattleStandard = "true";
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[src*="battle-canvas-standard.js"]')) {
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
      difficulty: "Easy to Medium",
      time: "4-12 minutes per challenge",
      skills: ["Planning", "Focus", "Sequencing", "Animal Care"],
      intro:
        "Animal Zoo Idle is a gentle park-management game built around 30 saved challenges. Visitors enter the meadow, buy tickets, and fill a ticket box while the player cares for animals, improves the Snack Stand, View Deck, and Keeper Post, expands the gate, and arranges habitats. Twelve animals can eventually live in the park. Every fifth challenge is a friendly review, giving the continuing economy a clear six-part journey from the first ticket collection to the Grand Safari Festival.",
      story: [
        "The meadow begins as a small animal park with a simple gate, a few residents, and room to grow. The player is its young park keeper. A lasting park needs more than a busy entrance: animals need regular care, habitat spaces must be thoughtfully arranged, and guest facilities must keep pace with the growing crowd.",
        "Mimi, Panko, an otter inspector, a rhino keeper, and the penguin parade team visit at five-stage checkpoints. Passing a review means the park has demonstrated basic care, picnic service, viewing space, keeper support, parade capacity, or the balanced planning needed for the final festival.",
      ],
      how: ["Choose an unlocked challenge from the horizontal Stage rail.", "Read every goal before collecting or spending tickets.", "Use Tidy Habitat for happiness or Enrichment Time for ticket income.", "Improve the gate, recruit animals, upgrade facilities, or drag animals to new habitat positions as requested.", "Claim the reward after every goal is complete, then continue to the next challenge."],
      systems: [
        "Visitors continuously contribute tickets to the collection box. Each uniquely cleared challenge also adds a small permanent income bonus.",
        "Tidy Habitat raises happiness, while Enrichment Time awards tickets. Both share a short care cooldown, so the current goal should guide the choice.",
        "The gate has eight levels. Recruited animals and the three four-level facilities remain in this browser save.",
        "Habitat arrangement goals count real animal movement in the meadow rather than a simple button press.",
        "The Growth Report summarizes the park, while challenge Result unlocks the next Stage and offers Next Challenge or Challenges.",
      ],
      progression: [
        "Challenges 1-5 teach tickets, care, and habitat movement before Mimi's first review. Challenges 6-10 compare care choices, ask the player to hold a ready ticket box, and introduce the Snack Stand before Panko's picnic.",
        "Challenges 11-15 introduce the View Deck, larger arrangements, and happiness targets. Challenges 16-20 add the Keeper Post and combine care, animal count, and facility planning for the rhino keeper audit.",
        "Challenges 21-25 grow the gate and animal roster for a penguin parade. Challenges 26-30 combine careful spending, all three facilities, happiness, arrangement, and income in the Grand Safari Festival finale.",
      ],
      strategyTips: ["Read all goals before spending because animal and facility goals may compete for the same tickets.", "Choose Tidy Habitat when happiness is required, but Enrichment Time when income is the bottleneck.", "Do not collect a full ticket box when the current challenge asks you to keep it ready.", "Move an animal far enough for the rearrangement to count.", "Permanent upgrades carry forward, while the unique-clear income bonus is awarded only once per challenge."],
      designNote:
        "The continuing economy lets children observe cause and effect without a harsh timer or combat. Waiting alone is not the main activity: each challenge asks for a factual combination of collecting, choosing care, arranging animals, recruiting, and upgrading. The Stage rail makes the park a visible 30-step journey, and local saving avoids rebuilding the same review each visit. Large buttons and direct dragging support touch and mouse play. Friendly checkpoint reviews replace boss fights because the central fantasy is improving a shared animal space.",
      parent:
        "This game may support simple planning, attention, sequencing, and discussion about animal care. Adults can ask why the player saved tickets, selected one care activity, or moved an animal. There is no combat, ranking pressure, account requirement, or advertising request on this Kids page. Challenge progress, upgrades, and reports are playful local feedback, not a school, health, or developmental assessment.",
      faq: [
        ["How many challenges are there?", "There are 30 saved challenges in six arcs, with friendly reviews at Stages 5, 10, 15, 20, 25, and 30."],
        ["Why should I leave the ticket box full?", "Some challenges ask the park to prepare a ready box. Collect only after that goal is satisfied."],
        ["What is the difference between the care actions?", "Tidy Habitat raises happiness. Enrichment Time awards tickets. Both share a short cooldown."],
        ["How does habitat arranging count?", "Drag an animal to a noticeably different meadow position; tiny accidental movement does not count."],
        ["Does clearing a challenge reset my park?", "No. Animals, gate levels, facilities, coins, and unlocked challenges remain in the local save."],
        ["Can I replay an earlier challenge?", "Yes. Any unlocked Stage can be replayed, although its unique-clear income bonus is awarded once."],
        ["Does the game require login or show ads?", "No. This Kids game requires no account and makes no advertising request."],
        ["Where is progress stored?", "It is stored in this browser. Clearing site data or switching devices may remove or separate the save."],
        ["Is the Growth Report an ability test?", "No. It is only an in-game summary, not a formal assessment."],
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
      difficulty: "Medium to Hard",
      time: "3-8 minutes per mission",
      skills: ["Planning", "Focus", "Risk Assessment"],
      intro:
        "Animal Moonlight Heist is a 30-mission stealth route adventure starring Spark Paw Fia and Moon Cap Orla. Preview deliberate routes, read patrol sight and mission-specific rules, recover each archive object, and decide whether optional treasure is worth the extra risk before extraction.",
      how: ["Choose an unlocked mission from the 30-card Moon Archive rail and read its rule.", "Hold and drag through the scene to preview Fia's route, then release to move.", "Use shadows and visible warnings to counter patrols, bells, mirrors, clockwork phases, seals, and Guardian sight.", "Recover the valid mission object and reach extraction; optional treasure earns an extra medal and Moon Coins."],
      parent:
        "Mission unlocks, best medals, Moon Coins, and Safehouse growth stay in local browser storage. Normal progress, every Guardian, all 30 missions, and Retry are free; optional Diamond reroll and insurance always require confirmation. This planning feedback is not a formal ability test.",
      faq: [
        ["How many missions are included?", "There are 30 authored missions and six distinct Guardian checkpoints at Missions 5, 10, 15, 20, 25, and 30."],
        ["What carries between missions?", "Unlocked missions, best medals, Moon Coins, and Safehouse progress are saved locally."],
        ["Is combat required?", "No. Players read patrol movement and use routes or gadgets to avoid detection."],
        ["Why can an archive object be unavailable?", "Some sealed missions require optional treasure as the first seal before the mission object becomes valid."],
        ["Are diamonds required?", "No. Diamonds only provide optional confirmed gadget reroll and treasure insurance choices."],
      ],
    },
    "star-memory": {
      title: "Animal Star Memory",
      age: "6+",
      difficulty: "Easy to Challenging",
      time: "2-8 minutes per stage",
      skills: ["Memory", "Focus", "Problem Solving"],
      intro:
        "Animal Star Memory is a 30-stage picture-matching journey through the night sky. Players help six friendly Star Keepers reconnect animal constellations by finding matching cards. The campaign begins with classic pairs, then changes how memory works through opening previews, moon shuffles after mistakes, required animal order, and constellation shifts after successful matches. Every fifth stage is a Keeper Check, and Stage 30 combines all four advanced rules on a full twelve-pair board.",
      story: [
        "The Animal Star Map once helped forest, river, meadow, and polar animals find their way home after sunset. A gentle meteor shower did not destroy the map, but separated every animal light into two hidden cards. The player becomes the Keepers' young map reader, reconnecting each pair so its constellation can shine again.",
        "Cat, Bear, Owl, Lion, Penguin, and Koala each guard one five-stage lesson. Passing a Keeper Check repairs that part of the sky. Completing the final Koala Grand Star Check means all twelve animal constellations have returned to their proper routes.",
      ],
      how: ["Choose an unlocked stage from the horizontal rail.", "Flip two cards and remember both positions.", "A matching pair stays cleared; a mismatch hides again after a short visible pause.", "Read the rule badge because later stages may preview, shuffle, require a named pair next, or move hidden symbols after a match.", "Clear every pair within the move limit to unlock the next stage."],
      systems: [
        "Classic stages keep every hidden symbol in place, making position recall the only rule.",
        "Preview stages reveal the complete board briefly, then hide every card before input begins.",
        "Moon Shuffle stages move the same unmatched symbols after a wrong guess, so old locations must be updated rather than blindly repeated.",
        "Ordered stages name the animal pair that must be cleared next. A correct pair found out of order is shown, then hidden without advancing.",
        "Constellation Shift stages rotate all remaining hidden symbols after a successful pair, changing the map while preserving every required pair.",
        "Moves, pairs, best streak, score, stars, stage unlocks, and best scores provide local progress feedback. No leaderboard is used.",
      ],
      progression: [
        "Stages 1-5 teach classic position matching and end with Cat's opening-preview check. Stages 6-10 shorten the preview and finish with Bear's one-time opening shuffle.",
        "Stages 11-15 introduce moon shuffles after mistakes. Stages 16-20 require the shown animal order, eventually combining order with shuffling in Lion's check.",
        "Stages 21-25 rotate the remaining constellation after each success. Stages 26-30 mix preview, order, shuffling, and rotation, culminating in a twelve-pair finale with every rule active.",
      ],
      strategyTips: ["During a preview, scan in rows or small groups instead of trying to name the whole board at once.", "After a moon shuffle, discard old positions and rebuild the map from new reveals.", "In ordered stages, locate the requested animal before spending moves on other known pairs.", "After a constellation shift, remember which symbols were still hidden, but do not trust their previous positions.", "Use the visible mismatch pause to compare both cards before they turn over."],
      designNote:
        "The game begins with a familiar matching rule so the controls are immediately readable, but its depth comes from changing what information remains reliable. Preview tests first impressions, shuffling tests memory updating, order changes target priority, and rotation makes a successful move alter the next decision. These mechanics use the same large picture cards on touch screens and keyboards, avoiding extra control complexity. Friendly Keeper Checks replace combat because the story is about repairing a shared star map. Move limits create a clear finish while retries remain immediate and supportive.",
      parent:
        "Animal Star Memory may support visual recall, attention, flexible updating, and following a short sequence. Adults can ask which locations are still reliable after a shuffle or why an ordered pair should be found first. The game has no combat, account requirement, public ranking, or advertising request on this Kids page. Stars and the Skill Report are encouraging local game feedback, not an intelligence, school, health, or developmental assessment.",
      faq: [
        ["How many stages are there?", "There are 30 named stages in six lessons, with Keeper Checks at 5, 10, 15, 20, 25, and 30."],
        ["What happens in a Moon Shuffle stage?", "After a mismatch, the same unmatched symbols move to different hidden positions."],
        ["Why did a matching pair hide again?", "In an ordered stage, the feedback names which animal pair must be cleared next."],
        ["What does Constellation Shift do?", "After a successful pair, all remaining hidden symbols rotate one position."],
        ["Does a preview use up moves?", "No. Input is locked while the opening board is visible, and play begins after it hides."],
        ["Can stages be replayed?", "Yes. Any unlocked stage can be replayed to improve its local score or star result."],
        ["Is progress saved?", "Unlocked stages, stars, and best scores are stored in this browser without requiring login."],
        ["Does the Kids page show ads?", "No. This game makes no advertising request and has no ad reserve."],
        ["Is the Skill Report a formal memory test?", "No. It only summarizes pairs, moves, and streaks from the current game."],
      ],
    },
    "campus-dash": {
      title: "Safari Dash",
      age: "9+",
      difficulty: "Progressive",
      time: "1-4 minutes",
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      intro:
        "Safari Dash is a three-lane animal runner with 30 saved routes across six regions. Spark Paw Fox restores guide stars while route cards announce five objective types and the active rules. Star trails, two-lane gates, sticky mud, and authored Guardian patterns make later routes require different reading and recovery decisions instead of only increasing speed.",
      story: [
        "Sunrise Savanna, Acacia Crossing, Marshlight Bend, Red Canyon Run, Moonwater Reserve, and Crown Safari share a marked trail network. Scattered trail gear and flooded markers have broken its guide-star chain.",
        "Spark Paw Fox carries replacement stars through every route. Zebra Pathfinder, Rhino Trailkeeper, Hippo Waterwarden, Eagle Skykeeper, Lion Pridekeeper, and Elephant Crownkeeper each test one five-route region before reopening it. Clearing Route 30 reconnects all six regions.",
      ],
      how: [
        "Choose an unlocked route from the horizontal Stage rail and read its objective and rules.",
        "Tap left or right, swipe, or use A, D, and the arrow keys to move exactly one lane.",
        "Collect stars for score and combo while avoiding cones, satchels, book stacks, and puddles.",
        "Reach zero time and satisfy the route's finish, star, combo, clean-run, or score objective.",
        "A successful route saves its clear and unlocks the next route; Run Again retries the current route.",
      ],
      systems: [
        "Open Trail spaces ordinary hazards so players can learn lane timing. Star Trail increases collectible lines. Two-Lane Gates leave one readable escape lane. Sticky Mud briefly slows lane transitions after a puddle collision. Guardian Pattern uses a deliberate safe-lane sequence.",
        "Stars score 50 times the current multiplier. Consecutive collections raise the multiplier; any hazard collision removes 80 points and resets the next-star multiplier to x1.",
        "Objectives change success conditions: finish the route, collect a target number of stars, reach a best combo, stay under a collision limit, or reach a target score.",
        "Campaign progress and the local Top 5 are stored separately in this browser. No account is required.",
      ],
      progression: [
        "Routes 1-5 teach ordinary hazards, star trails, gates, and combo timing before Zebra Pathfinder.",
        "Routes 6-10 alternate collection and clean gate decisions at Acacia Crossing before Rhino Trailkeeper.",
        "Routes 11-15 introduce sticky mud and combine slow recovery with stars and gates before Hippo Waterwarden.",
        "Routes 16-20 combine score, combo, repeated gates, and safe-lane star cues before Eagle Skykeeper.",
        "Routes 21-25 mix mud, gates, and night star chains before Lion Pridekeeper's low-collision check.",
        "Routes 26-30 review every rule. Elephant Crownkeeper combines mud, trails, gates, and Guardian sequencing while requiring 15 stars.",
      ],
      strategyTips: [
        "Read the empty lane between two gate hazards; the gap is the instruction.",
        "On clean-run routes, skip optional stars when collecting one would spend the collision allowance.",
        "Move earlier after touching mud because the lane transition is temporarily slower.",
        "Use the first Guardian gates to identify the authored safe-lane rhythm.",
        "A collision resets the next multiplier but does not erase the best combo already achieved.",
      ],
      designNote:
        "Three lanes keep choices readable on phones, and every input moves exactly one lane. Captured swipes remain reliable across the Canvas edge, while held keyboard input cannot skip lanes. Route timers range from 28 to 45 seconds for quick retries. Depth comes from information changes: gates alter spatial reading, star trails alter risk and reward, mud alters recovery timing, objectives alter success, and Guardians use authored sequences. The Kids build is ad-free and creates no ad reserve.",
      parent:
        "Safari Dash is intended for ages 9+ because later routes combine quick lane reading, objectives, and score pressure. The Skill Report uses only current-run evidence: lane changes, stars, bumps, and best combo. It is not a diagnosis, developmental assessment, or comparison with other children.",
      faq: [
        ["How many routes are there?", "There are 30 saved routes in six regions, with Guardian Checks at 5, 10, 15, 20, 25, and 30."],
        ["Do all routes use the same goal?", "No. Routes use finish, star collection, combo, clean-run, or score objectives."],
        ["What does sticky mud do?", "A puddle collision costs points and resets the multiplier; on mud routes it also slows the next lane transition briefly."],
        ["How do two-lane gates work?", "Two hazards arrive together and leave one escape lane. Some later routes mark the safe opening with a star."],
        ["What progress is saved?", "Unlocked and completed routes, the selected route, and the local Top 5 are stored in this browser."],
        ["Does it work on phones and computers?", "Yes. Phones support taps and swipes; desktop play supports A, D, and arrow keys."],
        ["Is Safari Dash free and account-free?", "Yes. It is free in the browser and does not require login."],
        ["Why is it 9+?", "Later routes combine faster visual decisions, route objectives, and score pressure."],
        ["Is the Skill Report a formal test?", "No. It only summarizes events from the current run."],
      ],
    },
    "snack-blocks": {
      title: "Snack Blocks",
      age: "9+",
      difficulty: "Progressive",
      time: "3-8 minutes",
      skills: ["Logic", "Problem Solving", "Focus"],
      intro:
        "Plan every swap across 30 saved stages. Rotating snack pools and six goal families turn the 7-by-10 board into a different puzzle in each chapter.",
      story: [
        "The animals of Snack World are carrying one shared picnic table from the berry fields to the Crown Feast. Matches prepare batches of food while each chapter contributes a different part of the final meal.",
        "Picnic Bell, Bakery Gate, Garden Drum, Workshop Clock, Bridge Banquet, and Crown Table are checkpoint orders. Clearing Stage 30 means the complete feast has reached the crown table.",
      ],
      how: [
        "Choose an unlocked card on the horizontal Stage rail.",
        "Tap or drag one snack toward an adjacent snack. A legal swap must create a match of three or more.",
        "Watch cleared snacks disappear together, then use the falling refill to prepare cascades.",
        "Use the full move budget and satisfy the stage goal to unlock the next card.",
      ],
      systems: [
        "Basic clears score 12 points per tile, multiplied by the current cascade depth.",
        "Score, collection, pair, cascade, big-match, and dual checkpoint goals ask for different plans.",
        "Each stage declares its own four-, five-, or six-snack pool instead of always using the same board mix.",
        "Invalid swaps roll back and do not spend a move. Local records keep unlocked stages and personal best scores.",
      ],
      progression: [
        "Stages 1-5 teach score, collection, and four-tile clears on Picnic Path.",
        "Stages 6-10 add cascades, five-tile clears, and pair collection at Cookie Crossing.",
        "Stages 11-15 rotate reduced snack pools through Grape Garden.",
        "Stages 16-20 introduce three-step cascades in Cheese Workshop.",
        "Stages 21-25 combine larger pair orders with all-six boards on Pretzel Bridge.",
        "Stages 26-30 combine the full rule set for the Crown Feast.",
      ],
      tips: [
        "Clear low rows to move more tiles and create cascade chances.",
        "Build nearly complete matches above the row you intend to clear.",
        "On checkpoints, watch both collection and score progress so one half does not fall behind.",
      ],
      designNote:
        "The tall board keeps animal-snack art readable on phones while leaving enough vertical space for chain planning. Thirty stages create depth through changing snack pools and objective families, not just larger numbers. Touch, drag, and keyboard input share the same native tile buttons. The Kids build has no timer and makes no advertising request.",
      parent:
        "Snack Blocks is intended for ages 9+ and family play because later stages combine two goals, changing snack pools, and cascade planning. Its local Skill Report is supportive run feedback, not a diagnosis, school assessment, or comparison with other children.",
      faq: [
        ["How many stages are included?", "There are 30 stages in six chapters, with checkpoints at 5, 10, 15, 20, 25, and 30."],
        ["Why does an invalid swap move back?", "A legal swap must immediately make a match. Invalid swaps return without spending a move."],
        ["What is a cascade?", "It is an automatic match made after cleared snacks fall and the board refills."],
        ["How do pair goals work?", "Either named snack counts toward one combined target."],
        ["What is a checkpoint?", "It requires both a named snack quantity and a score target."],
        ["Is progress saved?", "Unlocked stages and personal best records stay in this browser."],
        ["Does it work on phones and computers?", "Yes. It supports touch, pointer drag, and keyboard tile buttons."],
        ["Is it free and account-free?", "Yes. It needs no login and the Kids build makes no advertising request."],
        ["Is the Skill Report a formal test?", "No. It only summarizes the current run."],
      ],
    },
    "fruit-merge": {
      title: "Animal Merge Tower",
      age: "6+",
      difficulty: "Progressive",
      time: "3-8 minutes",
      skills: ["Logic", "Problem Solving", "Hand-Eye Coordination"],
      intro:
        "Animal Merge Tower combines an original Free Play score mode with 30 saved physics challenges. Six chapters change aim space, wind, gravity, generation order, and success conditions while preserving the same animal-ball merge simulation.",
      story: [
        "The Animal Festival is rebuilding its Crown Tower after the parade scattered animal lanterns across six districts. Matching lanterns reunite into the next animal tier, from Mouse Ball to Lion King Ball.",
        "Meadow Steps, Forest Window, River Current, Mountain Weight, Moon Parade, and Crown Festival each teach a different physical rule. Clearing Challenge 30 stabilizes the Lion Crown Table for the final parade.",
      ],
      how: [
        "Choose Start Game for the challenge rail or Free Play for an unlimited score run.",
        "Aim with touch, pointer movement, or Left and Right, then drop with touch, Space, or Enter.",
        "Bring two matching animal balls together to create the next tier and score points.",
        "Keep the pile below the red line and complete the current goal before the drop budget ends.",
      ],
      systems: [
        "Eleven animal tiers form the merge chain. Quick consecutive merges raise a multiplier up to x5.",
        "Goals use score, animal tier, merge count, combo, or a dual tier-plus-score checkpoint.",
        "Narrow Window reduces aim space, River Wind applies alternating sideways force, Heavy Gravity changes Matter.js gravity, and Fixed Queue uses an authored generation rhythm.",
        "Challenge unlocks, completion, selection, and best scores remain in this browser. Free Play keeps its separate local album and best-run list.",
      ],
      progression: [
        "Challenges 1-5 teach the open box and finish at Meadow Drum.",
        "Challenges 6-10 use the reduced Forest Window aim range.",
        "Challenges 11-15 add alternating River Current force.",
        "Challenges 16-20 use faster Mountain Weight gravity.",
        "Challenges 21-25 use the predictable Moon Parade queue.",
        "Challenges 26-30 combine advanced rules, with all four active at the Lion Crown Table finale.",
      ],
      tips: [
        "Keep large animals low and near the center while preserving an open lane for unmatched small balls.",
        "Watch wind direction before committing to a narrow landing.",
        "Use the known Fixed Queue to prepare landing space several drops ahead.",
      ],
      designNote:
        "One 720-by-1040 Matter.js board stays inside a uniformly scaled Kids Canvas, so phone and desktop use the same physics. The campaign adds structure without removing Free Play. Its depth comes from executable aim, force, gravity, and queue changes plus five goal families. The Kids build is ad-free and stores progress only in the browser.",
      parent:
        "Animal Merge Tower is intended for ages 6+ and family play. Later challenges ask for motion prediction, fixed-queue memory, and adjustment to changing physical conditions. Its Skill Report is supportive run feedback, not an intelligence test, diagnosis, developmental assessment, or school grade.",
      faq: [
        ["How many challenges are there?", "There are 30 in six chapters, with Festival Checkpoints at 5, 10, 15, 20, 25, and 30."],
        ["What is different from Free Play?", "Challenges add goals, drop budgets, saved unlocks, and authored rules; Free Play remains unlimited."],
        ["How does River Wind work?", "It applies alternating sideways force to moving balls inside the box."],
        ["What changes under Heavy Gravity?", "Balls land faster because the Matter.js gravity value increases."],
        ["What is a Fixed Queue?", "Animals follow a known Mouse-Rabbit-Fox rhythm for multi-drop planning."],
        ["Is challenge progress saved?", "Yes. Unlocks, completion, selection, and best scores stay in this browser."],
        ["Does it work on phones and computers?", "Yes. It supports touch, pointer, and keyboard controls."],
        ["Is it free and account-free?", "Yes. The Kids build requires no login and makes no advertising request."],
        ["Is the Skill Report a formal test?", "No. It only summarizes the current run."],
      ],
    },
    "garden-tiles": {
      title: "Pet Garden Tiles",
      age: "6+ / Family",
      difficulty: "Easy to Challenging",
      time: "3-8 minutes",
      skills: ["Memory", "Focus", "Problem Solving"],
      intro:
        "Restore the Pet Garden Conservatory's paired picture catalogue across 30 saved, no-timer memory challenges. Six chapters introduce opening previews, short-lived first picks, moving unmatched cards, and combined Garden Checkpoints.",
      story: [
        "The conservatory keeps picture cards for every animal, keeper, fruit, and garden object that passes its gates. A night breeze scattered the cards face down just before the lantern walk. As junior card keeper, you rebuild the paired catalogue so the six garden rooms can reopen and the animal parade can find its route.",
        "Each completed pair returns one picture to the record. Clearing five challenges lights a chapter lantern; stages 5, 10, 15, 20, 25, and 30 are checkpoints that combine the memory habits learned in that room.",
      ],
      how: ["Choose an unlocked challenge on the horizontal rail.", "Turn over two cards and match identical garden pictures.", "Use the chapter rule label to prepare for previews, mist, gusts, or parade movement.", "Clear every pair to earn stars, save progress, and unlock the next challenge."],
      systems: [
        "Moves and stars: Moves count complete two-card attempts. Efficient recall earns more stars, but any cleared board progresses and never removes an older best.",
        "Morning Preview: All pictures appear briefly before the board closes, rewarding a deliberate opening scan.",
        "Garden Mist: A first-picked card closes after a gentle window if no second card is chosen; the level itself has no countdown.",
        "Playful Gust: A mismatch shuffles only the remaining unmatched cards after the visible feedback pause.",
        "Garden Parade: A successful match rotates the remaining cards through their open spaces, so the mental map must follow movement.",
      ],
      progression: [
        "1-5 Seedling Walk: Four to eight pairs teach true face-down matching and end with a preview checkpoint.",
        "6-10 Morning Greenhouse: Opening previews support larger boards and row-by-row scanning.",
        "11-15 Misty Pond: First picks close after a short window, training fresh visual recall without a level timer.",
        "16-20 Breezy Orchard: Mismatches move unmatched cards, so outdated locations must be discarded.",
        "21-25 Animal Parade: Successful pairs rotate the survivors and reward attention to motion.",
        "26-30 Moonlit Conservatory: Rules combine, ending with a 14-pair four-rule Garden Checkpoint.",
      ],
      strategyTips: ["Scan previews by corners or rows.", "Treat a mismatch as useful location information on classic boards.", "After Gust or Parade movement, rebuild a small mental map instead of trusting every old position.", "Replay finished challenges for stars without risking saved unlocks."],
      designNote:
        "The game grows through changing memory demands rather than a stressful countdown. A fixed 390 by 788 canvas keeps the board stable across devices, native buttons support touch and keyboard play, mismatches remain visible long enough to learn from, and hidden-page time pauses feedback. Preview, Mist, Gust, and Parade each ask for a different kind of recall while preserving calm Kids play.",
      parent:
        "Pet Garden Tiles is intended for ages 6+ and family play. Stars and the Skill Report summarize only the current local run; they are not an intelligence test, diagnosis, developmental assessment, or comparison with other children. The Kids build has no ads, login, chat, or purchase request.",
      faq: [
        ["How many challenges are there?", "There are 30 in six chapters, with checkpoints at 5, 10, 15, 20, 25, and 30."],
        ["Is Pet Garden Tiles timed?", "No. Garden Mist closes one first-picked card after a short window, but no level has a countdown."],
        ["Why do cards move?", "Playful Gust moves unmatched cards after a miss; Garden Parade rotates them after a match."],
        ["How are stars calculated?", "Stars use complete two-card attempts. Every cleared board progresses."],
        ["Is progress saved?", "Yes. Unlocks and best stars remain in this browser."],
        ["Does it support phones and keyboards?", "Yes. Native card buttons work with touch, pointer, and keyboard controls."],
        ["Is it free and ad-free?", "Yes. It needs no account or purchase and the Kids build makes no advertising request."],
        ["Is the Skill Report a formal test?", "No. It only reports pairs, moves, retries, and stars from the completed challenge."],
      ],
    },
    "animal-rescue": {
      title: "Animal Rescue Trail",
      age: "6+ / Family",
      difficulty: "Easy to Challenging",
      time: "3-8 minutes",
      skills: ["Logic", "Problem Solving", "Animal Knowledge"],
      intro:
        "Guide twelve animal friends through 30 saved, no-timer route puzzles. Six regions add required fruit, weighted mud, trail keys, locked gates, fragile one-use paths, and Rescue Checkpoints.",
      story: ["Homecoming Valley once used painted fruit signs to guide animals from the forest, meadow, river, ridge, farms, and festival grounds. Wind and rain scattered the signs, covered shortcuts with mud, washed away stepping stones, and locked garden gates. As junior route keeper, the player rebuilds each safe trip.", "Every fifth trail is a Rescue Checkpoint. Clearing Trail 30 brings Penguin through the final mixed route and restores the Homecoming Festival path for all twelve animal friends."],
      how: ["Choose an unlocked trail on the horizontal Stage rail.", "Move one neighboring square with touch, pointer, or one arrow-key press.", "Collect fruit and keys while avoiding rocks, water, closed gates, and crumbled fragile paths.", "Reach home after satisfying the trail objective, then use Next Trail, Play Again, or Trails."],
      systems: ["Moves and stars: Normal ground costs one move; Sticky Mud costs two. Authored move goals and fruit collection determine one to three stars.", "All Fruit: Marked trails keep home closed until every fruit is collected.", "Trail Key and Gate: A golden key must be collected before its gate accepts a move.", "Fragile Path: A fragile square can be entered once and cannot be revisited unless Undo or Reset removes that visit.", "Undo and Reset: Undo recomputes fruit, keys, gates, fragile visits, and weighted moves from the retained path; Reset rebuilds the whole trail."],
      progression: ["1-5 Forest Steps teaches neighboring movement, barriers, fruit detours, and the first all-fruit checkpoint.", "6-10 Meadow Detours adds Sticky Mud and weighted route comparison.", "11-15 River Keys introduces route keys and locked gates around water corridors.", "16-20 Fragile Ridge adds one-use squares and a key-gate checkpoint.", "21-25 Harvest Routes makes fruit mandatory while mixing mud, gates, and fragile choices.", "26-30 Homecoming Festival combines the learned rules; Trail 30 uses all fruit, mud, a key gate, and fragile squares."],
      strategyTips: ["Trace a complete fruit-to-home route before moving.", "Count mud as two when comparing routes.", "Locate a key before committing to the gate corridor.", "Decide how to leave a fragile square before entering it.", "Use Undo for one wrong turn and Reset for a new plan."],
      designNote: "A fixed 5 by 5 board keeps every square large on phones while the full route remains visible. Discrete movement gives touch, pointer, and keyboard the same decision. Difficulty grows through cost, order, reversibility, and completion rules rather than speed. The 390 by 788 Kids canvas has no timer, combat, leaderboard, account, purchase, ad request, or reserve.",
      parent:
        "Animal Rescue Trail is intended for ages 6+ and family play. Stars summarize only local game performance; they are not an intelligence test, school grade, diagnosis, developmental assessment, or comparison with other children. Progress stays in this browser, and the Kids build has no ads, login, chat, or purchase request.",
      faq: [
        ["How many trails are included?", "There are 30 in six regions, with checkpoints at 5, 10, 15, 20, 25, and 30."],
        ["Do I always need every fruit?", "Only marked All Fruit trails require every fruit before home opens; fruit still improves stars elsewhere."],
        ["Why does mud add two moves?", "Sticky Mud has weighted cost, making a direct route potentially less efficient."],
        ["How do keys and gates work?", "Collect the golden key before entering its gate; a rejected gate tap costs no move."],
        ["Can I cross a fragile tile twice?", "No, but Undo or Reset can restore it by removing the visit."],
        ["Is progress saved?", "Yes. Unlocks and best stars stay in this browser."],
        ["Does it support phones and keyboards?", "Yes. Touch, pointer, and arrow keys use the same rules."],
        ["Is it free and ad-free?", "Yes. No account or purchase is required and the Kids build makes no advertising request."],
      ],
    },
    "animal-bubble-safari": {
      title: "Animal Bubble Safari",
      age: "6+",
      difficulty: "Easy to Medium",
      time: "3-6 minutes per level",
      skills: ["Focus", "Hand-Eye Coordination", "Problem Solving"],
      intro: "Animal Bubble Safari is a free bilingual Kids aiming puzzle with 30 saved levels and six Safari Checks. Players launch animal bubbles, connect groups of three, bank shots from walls, and rescue five kinds of safari friends. Later regions add stone, leaf, two-hit honey and row-clearing cloud barriers, east or west wind, moving rows, and Rainbow, Line Clear, Burst and Swap powers. Level 30 combines all four blockers, three rescues, wind, shifting rows and every power without a countdown, account, purchase or advertising request.",
      story: ["A chain of watering holes links six safari regions. Young animals became surrounded by floating clusters, so the player travels with the lion guide and opens safe routes with the bubble launcher. A clear means the matching or rescue goal is complete before prepared bubbles run out.", "Barriers belong to the route rather than an enemy army. Every fifth level is a Safari Check that recombines the region’s skills. Grand Safari Reunion frees the final three animals and ends the authored campaign."],
      systems: ["Current and next previews allow two-color planning. Drag or hold to aim; arrow keys adjust the same logical point and Enter or Space fires.", "Continuous flight checks the visible collision in small steps. A shot attaches beside the bubble it actually touched instead of jumping to a distant hidden cell.", "Three or more connected colors clear. Bank goals count only a group made after touching a wall; rescue goals require one to three marked animal bubbles.", "Leaves fall beside a match, honey needs two direct hits, clouds clear a row, wind bends flight and shifting levels move alternating rows after a shot.", "Rainbow adopts a hit color, Line Clear removes a row, Burst clears an area and blockers, and Swap exchanges colors.", "Stars depend on shots remaining. Unlocks, best stars, scores, album rescues and sound choice stay only in this browser. Kids screens have no ads or reserve."],
      how: ["Swipe the Stage rail to an unlocked level and read its goal and rule hint.", "Check current and next bubbles before choosing an angle.", "Drag toward a matching group and use a wall when the direct path is blocked.", "Release, watch the exact collision and attachment, then plan the changed board.", "Complete required matches or rescues before prepared bubbles run out."],
      strategyTips: ["Plan with the next bubble before opening a narrow lane.", "Bank early enough that the reflected path approaches from the side.", "Clear leaves with an adjacent match and count both honey hits.", "Check a cloud’s whole row before striking it.", "Aim against wind drift and re-read moving rows after every shot.", "Save Burst for dense barriers and Line Clear for valuable rows."],
      progression: ["Levels 1–5 teach direct shots, bank shots, rescue targets, mixed colors and stones.", "Levels 6–10 expand rescue chains and introduce Rainbow and Line Clear.", "Levels 11–15 introduce Burst, Swap, leaf, honey and cloud rules.", "Levels 16–20 add east/west wind and alternating moving rows.", "Levels 21–25 pair each power with barriers and finish with three rescues plus all four powers.", "Levels 26–30 combine leaf-and-stone lanes, honey headwind, moving cloud rows and three-animal rescue. Level 30 uses every major rule."],
      designNote: "The design promise is that visible collision produces believable attachment. Continuous movement and local open-position selection preserve aiming trust. Difficulty grows through angles, barrier reactions, rescue placement, wind, row motion, next-bubble planning and power timing instead of faster animation or smaller targets. One logical Canvas scales uniformly across phone, tablet, desktop and short landscape; touch, mouse and keyboard share one aim state, and lifecycle cancellation prevents stale releases. Unlike Bubble Bakery’s tap groups, this game is built around trajectory and reflection. Kids play has no advertising, account, purchase, ranking or diagnosis.",
      parent: "Animal Bubble Safari may support visual prediction, planning, color grouping, focus and hand-eye coordination. Adults can discuss reflection, wind drift and whether the current bubble should prepare the next shot. Stars and Skill Report are local play feedback, not a grade, intelligence score, diagnosis or child comparison. Progress stays in this browser. No child profile is required, and the Kids route requests no advertising.",
      faq: [
        ["How many levels are included?", "There are 30 saved levels with Safari Checks at 5, 10, 15, 20, 25 and 30."],
        ["Why did my bubble attach beside the target?", "It uses the nearest open position around the bubble physically touched."],
        ["How do bank goals work?", "The matching shot must touch a side wall before clearing."],
        ["What do leaf, honey and cloud barriers do?", "Leaves drop beside matches, honey needs two hits and clouds clear a row."],
        ["What are the four powers?", "Rainbow changes color, Line Clear removes a row, Burst clears an area and Swap exchanges colors."],
        ["Is there a timer?", "No. The limit is the visible bubble supply."],
        ["Is progress saved?", "Unlocks, stars, scores, album rescues and sound choice stay only in this browser."],
        ["Can it use touch or keyboard?", "Yes. Touch, mouse, arrow keys, Enter and Space share the same aim rules."],
        ["Does the Kids page show ads?", "No. It creates no advertising request or reserve."],
      ],
    },
    "animal-habitat-mahjong": {
      title: "Animal Habitat Mahjong",
      age: "9+",
      difficulty: "Gentle to Expert",
      time: "4-10 minutes per board",
      skills: ["Logic", "Focus", "Problem Solving"],
      intro:
        "Animal Habitat Mahjong is a free bilingual Kids mahjong-solitaire puzzle with 30 saved boards, ten layered structures, six rule chapters, and Habitat Finales at Boards 5, 10, 15, 20, 25, and 30. Players match identical free animal and habitat tiles, open diamond-key seals, rescue starred families, and follow alternating A/B patrol trails without a countdown failure.",
      story: [
        "The Forest Ranger Archive keeps illustrated tile albums for Forest Canopy, Safari Trail, Coral Shelf, and Arctic Glow. A seasonal storm has folded the pages into layered stacks, leaving animal portraits, shells, coral, leaves, and snow marks covering one another. The junior tile ranger restores each page by returning every matching pair to the album.",
        "Diamond-marked animals carry keys for blue trail seals, while starred pictures represent separated families. Patrol Trail boards alternate the available route between groups A and B after each match, asking the ranger to inspect a different part of the layered board. Clearing Board 30 restores the final Coral Shelf page and completes all six Habitat Finales.",
      ],
      how: ["Choose an unlocked card on the horizontal 30-board Stage rail and read its rule.", "Find two identical tiles with no tile directly above and at least one horizontal side open.", "On seal boards, match the diamond key; on rescue boards, uncover both starred families.", "Use Hint for a legal pair, Undo for exactly one prior match, or Shuffle only when no pair is available.", "Clear every tile to save the result and unlock exactly the next board."],
      systems: [
        "Boards contain eight to twelve true pairs over one, two, or three layers. Pictures remain visible, so the challenge is access planning rather than memory.",
        "A normal tile is free when no active tile covers its coordinate and either its left or right side is open on the same row and layer. Patrol Trail additionally limits matching to the A or B route displayed in the objective, normally switching after a success.",
        "Trail Seal boards hold marked inner tiles until the glowing diamond pair clears. Family Rescue boards track two starred matching families. Ranger Trial combines seal and rescue; Grand Reserve adds the alternating patrol route.",
        "Hint highlights one legal pair. Undo restores both tiles plus the exact prior key and rescue state. Shuffle is disabled while a move exists; during a dead end it preserves special tokens and guarantees a playable pair.",
        "Moves count matches and Shuffles. Visible time pauses with the page hidden. Each board stores best score, fewest moves, fastest visible time, and progression in this browser.",
      ],
      strategyTips: ["Prefer a top-layer pair that reveals several covered tiles.", "Keep both edges active instead of emptying only one side.", "Clear the diamond key before planning around sealed tiles.", "Trace the covering stack above each starred rescue family.", "On Patrol Trail, check whether the objective shows A or B before choosing; a success normally switches the route.", "Undo immediately when a match closes several useful paths; route state is restored too."],
      progression: ["Boards 1-5 teach standard access through grid, diamond, terrace, bridge, and stacked layouts.", "Boards 6-10 introduce diamond keys and sealed inner pairs.", "Boards 11-15 add two starred family rescues; Board 15 begins with a deliberate no-move Shuffle lesson.", "Boards 16-20 alternate available A/B patrol routes through Arctic pyramid and sanctuary layouts.", "Boards 21-25 combine trail seals and family rescues.", "Boards 26-30 combine seals, rescues, and alternating patrol routes; Board 30 uses twelve pairs over three layers."],
      designNote: "Difficulty grows by changing access decisions rather than simply adding tiles, shrinking pictures, or imposing a fast clock. Seals add dependency, rescues add visible subgoals, and Patrol Trail changes which set is currently available after each match. One fixed logical layout scales uniformly on phones, tablets, desktop, and short landscape. Touch, mouse, and keyboard share one validator; Result stays inside Battle; the Kids route creates no advertising request or reserve. Unlike a memory game, every picture remains visible, and unlike a flat matching board, removal order changes which tiles can be reached.",
      parent:
        "Animal Habitat Mahjong may support visual scanning, spatial planning, focus, cause and effect, and revising a decision. Scores and Skill Report describe only local play, not an intelligence test, grade, diagnosis, or child comparison. Progress stays in this browser and may reset if storage is cleared. No child profile is required, and the Kids route requests no advertising.",
      faq: [
        ["How many boards are included?", "There are 30 saved boards and six Habitat Finales."],
        ["What makes a tile free?", "Nothing may cover it and at least one horizontal side must be open; Patrol Trail also checks the A or B route shown in the objective."],
        ["What do diamond, star, and blue marks mean?", "Diamonds open seals, stars mark rescue families, and blue sealed tiles wait for their key."],
        ["Why is Shuffle disabled?", "It becomes available only when no legal matching pair remains."],
        ["Does Undo restore special rules?", "Yes. It restores the pair and exact key and rescue state."],
        ["Is there a time limit?", "No. Visible time is saved only for a personal record."],
        ["Is progress saved?", "Unlocks and board records stay only in this browser; no account is required."],
        ["Can I use touch or keyboard?", "Yes. Touch, mouse, Tab, Enter, and Space share the same matching rules."],
        ["Does the Kids page show ads?", "No. It creates no advertising request or reserve."],
      ],
    },
    "animal-hidden-safari": {
      title: "Animal Hidden Safari",
      age: "3+ / Family",
      difficulty: "Easy to Challenging",
      time: "2-6 minutes per habitat",
      skills: ["Focus", "Animal Knowledge", "Problem Solving"],
      intro:
        "Animal Hidden Safari is a calm 30-habitat seek-and-find campaign. Six five-stage regions move from open searches to printed search order, animal pairs, deeper camouflage, off-list habitat visitors, and gently moving patrols. Every habitat contains six real picture targets, two limited hints, saved stars, and a local best search time without a countdown failure.",
      story: [
        "The Junior Ranger Lodge keeps a picture census of animals using Sunny Grassland, River Crossing, Sunset Trees, Pond Watch, Jungle Edge, and Lookout Hill. Seasonal paths have opened at once, so familiar lions, elephants, giraffes, pandas, penguins, koalas, rabbits, foxes, frogs, and owls are sharing places where they are not usually counted. The player becomes the lodge's junior observer and checks each printed list against the visible habitat.",
        "Finishing a habitat confirms all six requested sightings. Every fifth challenge is a Habitat Checkpoint that reviews the search habit learned in that region. Completing Checkpoint 30 returns a verified picture census to the lodge: paired animals have been counted separately, harmless visitors have not been confused with the list, and the moving lookout patrol has been observed in the required order.",
      ],
      how: [
        "Choose any unlocked card on the horizontal 30-habitat Stage rail and read its rule label.",
        "Compare the six picture chips below the scene with the partly covered animals in the habitat.",
        "Tap, click, or focus and press Enter on a requested animal. In Ranger Order, follow the highlighted list from first to last.",
        "Use either of the two compass hints when needed; each points to a different unfound target when possible.",
        "Find all six animals to save stars and best visible search time, unlock the next habitat, or replay the current one.",
      ],
      systems: [
        "Visible search time has no failure limit. It records only time when the habitat is active; switching apps or hiding the page pauses the measurement. A completed result compares the run with the same habitat's local best.",
        "Stars reward careful independent observation. A run with no empty taps and no hints earns three stars; a small number of empty taps with at least one hint remaining earns two; every completed scene earns at least one and unlocks progress.",
        "Open Search lets the player find the six pictures in any order. Ranger Order highlights one requested animal at a time; choosing another pictured target gives a friendly correction and does not remove it.",
        "Animal Pairs places two separate copies of several species in one scene. Each picture must be found at its own location, so recognizing one fox, owl, lion, panda, penguin, or koala does not finish its partner.",
        "Deep Camouflage reduces the animal's contrast and enlarges its foreground grass, leaf, water, or dust cover. Keyboard focus and compass hints restore a strong readable cue, keeping the rule discoverable without making the target disappear.",
        "Habitat Visitors are real animal pictures that are not printed on the six-item list. Tapping one counts as an empty choice and dismisses it, teaching list comparison without blocking completion. Moving Patrol gives targets a slow, small drift; reduced-motion settings stop that movement.",
        "Hints, empty taps, found targets, unaided finds, stars, unlocks, and best times feed the supportive Result and Skill Report. They stay in this browser and are not uploaded as a test score or public leaderboard.",
      ],
      progression: [
        "Habitats 1-5, Sunny Grassland: six freely selectable animals teach scene scanning and finish with the first Habitat Checkpoint.",
        "Habitats 6-10, River Crossing: Ranger Order changes priority from any visible animal to the next highlighted picture.",
        "Habitats 11-15, Sunset Trees: Animal Pairs repeat three species at separate positions; Checkpoint 15 also asks for a fixed order.",
        "Habitats 16-20, Pond Watch: deeper foreground camouflage rewards slower edge-to-center scanning; later stages combine order and pairs.",
        "Habitats 21-25, Jungle Edge: harmless off-list visitors require comparison with the six printed chips. The checkpoint adds order and camouflage.",
        "Habitats 26-30, Lookout Hill: gentle target movement changes where the eye must return. The final checkpoint combines moving paired targets, Ranger Order, Deep Camouflage, and three habitat visitors.",
      ],
      strategyTips: [
        "Scan one strip of the scene at a time instead of jumping between distant bright shapes.",
        "In Ranger Order, follow the glowing target and matching highlighted chip before touching another animal.",
        "When a species appears twice, remember which side still has its unfinished partner.",
        "Compare every tempting jungle animal with the six picture chips; a visible animal can be a harmless visitor.",
        "Use a hint after completing a careful scan so the compass teaches which area was overlooked.",
      ],
      designNote:
        "The game keeps one square search scene and six large picture chips inside a uniformly scaled 390-by-693 Kids Battle Canvas, so phone, desktop, touch, pointer, and keyboard players solve the same layout. Difficulty grows by changing what counts as reliable information rather than shrinking hit areas or imposing a harsh countdown. Order changes priority, pairs change counting, camouflage changes visual separation, visitors change list comparison, and movement changes tracking. Checkpoints combine learned rules without combat. Targets retain forgiving hit perimeters, hints name and ring one target, held keys cannot spend both hints or skip Result, and reduced-motion preferences stop patrol movement. The Kids build remains ad-free, account-free, and purchase-free.",
      parent:
        "Animal Hidden Safari is intended for ages 3+ with family help available for later mixed checkpoints. It may support picture matching, visual scanning, list comparison, flexible attention, and animal naming. Adults can ask which parts of the list are complete or why a visible animal is a visitor. Stars, time, and the Skill Report describe only this local play session; they are not an intelligence test, diagnosis, developmental assessment, school grade, or comparison with other children. The Kids page makes no advertising request and has no login, chat, or purchase prompt.",
      faq: [
        ["How many habitats are included?", "There are 30 challenges in six regions, with Habitat Checkpoints at 5, 10, 15, 20, 25, and 30."],
        ["Is there a time limit?", "No. Time records a local best but never causes failure, and hidden app time is excluded."],
        ["What does Ranger Order change?", "Only the highlighted next animal advances the list; another requested animal remains available for later."],
        ["Why are two animals identical?", "Animal Pairs deliberately asks the player to find two separate members of the same species."],
        ["What is a habitat visitor?", "It is a visible animal not printed on the current list. It can be dismissed but does not count as a find."],
        ["How does a hint work?", "A compass ring and short name point to an unfound animal; two hints are available per habitat."],
        ["Is progress saved?", "Yes. Unlocks, stars, and best times stay in this browser without an account."],
        ["Can it be played with touch and keyboard?", "Yes. Targets are native buttons with forgiving touch areas and continuous keyboard focus."],
        ["Is the Kids game ad-free?", "Yes. It makes no advertising request and contains no ad reserve."],
        ["Is the Skill Report a formal assessment?", "No. It only summarizes finds, empty taps, hints, and time from the local game."],
      ],
    },
    "animal-crystal-survivor": {
      title: "Animal Crystal Survivor",
      difficulty: "Medium",
      time: "3 minutes per stage",
      skills: ["Reaction", "Focus", "Problem Solving"],
      guideKicker: "WeightPlay Original Game Guide",
      guideTitleSuffix: "30-Stage Campaign Guide",
      noteTitle: "Player and Save Information",
      hideScoreBands: true,
      intro:
        "Animal Crystal Survivor is a 30-stage real-time patrol campaign built around movement, automatic attacks, temporary upgrades, readable hazards, and six original animal Bosses. Every route lasts up to three minutes and has a named rule, key target, and saved unlock.",
      story: [
        "Six crystal beacons keep the Crystal Grove's paths open. An Eclipse pulse has scattered their golden tuning keys and changed familiar animals into shadow beasts. The Crystal Ranger carries the keys, calms affected animals, and reconnects one route at a time.",
        "Stages 5, 10, 15, 20, 25, and 30 are guardian checkpoints. Defeating Root Stalker, Prism Moth Queen, Briar Boar King, Cinder Panther, Tempest Roc, and Eclipse Colossus reconnects the six regions and ends the feedback loop beneath the grove."
      ],
      systems: [
        "Move with touch, pointer, WASD, or arrow keys. The Ranger automatically targets the nearest enemy inside the visible range circle, leaving the player responsible for spacing, collection routes, and hazard timing.",
        "Golden keys satisfy the current stage objective and add to lifetime Patrol Rank. Calmed enemies drop temporary XP crystals; each level pauses play and offers three choices from damage, range, speed, max HP, attack interval, and pickup radius.",
        "Shadow foxes apply steady pressure, panthers close quickly, and crystal boars absorb more attacks. Later stages add breakable shields, announced charges, scorch ground, drifting drops, mirrored strikes, and a moving Eclipse safe ring.",
        "A stage clears at 3:00 only when its printed key target is complete. Boss stages also require the guardian to be calmed. Missing an objective records local statistics but does not unlock the next route."
      ],
      how: [
        "Choose an unlocked card from the horizontal 30-stage rail and read its rule.",
        "Move the Ranger while auto-attack handles the nearest target inside range.",
        "Collect the displayed number of keys and XP crystals before the timer ends.",
        "Leave dashed warning shapes before they become solid roots, flame, lightning, or lanes.",
        "At every fifth stage, defeat the named Boss as well as completing the key target.",
        "Use Result to retry, continue, or return to the Stage rail."
      ],
      strategyTips: [
        "Collect early XP so the first upgrade changes more of the patrol.",
        "Treat the pale attack ring as a spacing guide and stay near its outer edge.",
        "Move across a charge path, not directly away from the charging beast.",
        "Wait out Prism Moth Queen's visible shield and attack during the opening.",
        "Follow the Eclipse safe ring before chasing a key outside it."
      ],
      parent:
        "Stage unlocks, clears, best key counts, lifetime keys, Patrol Rank, and optional Crystal Charm ownership stay in this browser. Clearing site storage or switching devices may remove them. The confirmed Crystal Charm purchase is optional and no stage requires it. Result feedback is entertainment and local progress information, not a test or diagnosis.",
      faq: [
        ["How many stages are included?", "There are 30 named stages across six regions, with Boss checkpoints every fifth stage."],
        ["What clears a stage?", "Survive three minutes and meet the printed key target; a checkpoint also requires its Boss to be defeated."],
        ["Does the player aim manually?", "No. The ranger attacks automatically. The player focuses on movement, collecting, and upgrade choices."],
        ["Why did Prism Moth Queen take no damage?", "Her visible shield blocks attacks during one phase. Damage resumes when it disappears."],
        ["Is progress saved?", "Yes. Unlocks, clears, best keys, lifetime rank, and Charm ownership are saved locally."],
        ["Is Crystal Charm required?", "No. It is an optional confirmed boost from seven to eight HP and pickup radius 54 to 68."],
        ["Does it work on mobile and desktop?", "Yes. Touch dragging and keyboard movement use the same campaign rules."],
        ["Is the Skill Report a test?", "No. It is supportive game feedback for this local run only."],
      ],
    },
    "animal-guard-yard": {
      title: "Animal Guard Yard",
      age: "6+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Logic", "Focus", "Problem Solving"],
      intro:
        "Clover Yard connects six garden regions that share sunlight, seeds, and water. When wild beasts crowd the paths, the player becomes the yard keeper and places Cat, Dog, Owl, and the optional Fox across five lanes. The 30-stage campaign introduces a readable rule in each region: healers restore a beast ahead, burrowers warn before changing lanes, and sun thieves remove 12 unspent sun. Every fifth stage has a separate guardian and counterplay, from Moss Horn Rhino's roar and Prism Shell Tortoise's protected phase to Burrow Badger Chief's lane changes, Ember Mane Boar's announced rush, Gale Wing Eagle's attack delay, and Moon Crown Elk's restoring pulse. Clears, scores, Garden Medals, coins, and training stay in this browser.",
      how: ["Choose an unlocked stage and read its enemy icons and plan.", "Place a blocker and ranged support in highlighted incoming lanes.", "Collect sun, react to special enemy cues, and stop every beast before cottage hearts reach zero.", "Earn saved coins for training and replay stages for Garden Medals at 5, 15, and 30 medals."],
      strategyTips: ["Focus a healer before repeatedly attacking the shield it restores.", "Cover neighboring lanes when a burrower appears.", "Spend important sun before a thief's pouch activates.", "Wait for Prism Shell Tortoise's barrier to open before committing burst damage.", "Use Dog to absorb Ember Mane Boar's announced rush while ranged guards fire."],
      parent:
        "This friendly fantasy defense game may support planning, attention, and flexible problem solving. Enemy actions use pictures or short cues, and there is no realistic violence. Progress is stored locally and may disappear if browser storage is cleared. The Skill Report is play feedback, not a learning or health assessment. The Kids page requests no advertising and asks for no child profile.",
      faq: [
        ["How many stages are included?", "There are 30 named stages across six regions, with a mechanically distinct Boss every fifth stage."],
        ["Why did Prism Shell Tortoise take little damage?", "Its bright barrier reduces damage while closed. Attack strongly after it opens."],
        ["Can burrowers change lanes?", "Yes. They visibly warn before moving to a neighboring lane."],
        ["What does a sun thief do?", "It removes 12 unspent sun once, but it never removes an already placed guard."],
        ["Can players upgrade animals?", "Yes. Local coins train guards; the Fox is an optional shared-diamond unlock and is not required."],
        ["Is progress saved?", "Stage unlocks, clears, scores, medals, coins, and training are saved in this browser."],
        ["Does it work on phones?", "Yes. Stage selection uses horizontal swiping and battle uses large tap targets."],
        ["Does the Kids page show ads?", "No. This Kids game does not request advertising."],
      ],
    },
    "animal-quiz": {
      title: "Animal Quiz",
      age: "6+",
      difficulty: "Easy",
      time: "5-8 minutes",
      skills: ["Animal Knowledge", "Memory", "Reading"],
      intro:
        "Animal Quiz is a free bilingual Kids knowledge game with 30 saved stages and ten different animals in every stage. Its 20-animal library ranges from lions, elephants, giraffes and zebras to penguins, whales, pandas, koalas, owls, frogs, pets and farm animals. Early questions pair a clear portrait with one body-feature clue. Later investigations blur the portrait, turn it into a silhouette, add a fourth choice, or combine facts about habitat, behavior, diet and appearance. Every fifth stage is a Junior Expert Check that recombines ideas already introduced. There is no countdown, and a wrong choice never ends the stage.",
      story: [
        "The campaign is an animal investigation trail rather than a rescue or battle. The player is an observer building a field notebook one correct identification at a time. Every portrait, name and written clue describes the same target animal. Completing ten identifications closes the current notebook chapter, saves the clear and unlocks the next investigation.",
        "The facts provide the reason for each choice. A lion can be connected through its mane, African grassland home and pride behavior; a penguin through cold coasts, fish and huddling; an elephant through its trunk, plant diet and water-spraying behavior. Clearing Stage 30 means the player has completed six lesson groups and the final mixed-evidence check.",
      ],
      systems: [
        "Each stage contains ten unique target animals. Introductory stages show three answer names; later mixed, food and expert checks show four without shrinking the controls.",
        "Standard portraits support recognition. Mystery stages deliberately soften detail, while silhouette stages remove color so outline and written clues matter more. The image keeps an accessible animal name.",
        "Feature clues describe visible traits, habitat clues explain where an animal lives, action clues describe behavior, and diet clues identify food. Expert stages combine two or three clue families.",
        "A wrong answer gives gentle feedback and leaves the question open. A correct answer locks the choices for a short visible-time learning pause, shows an animal note, and advances.",
        "Clearing all ten questions saves the stage, best result and next unlock in local browser storage. Result can replay the investigation or return to the exact completed card.",
        "There is no account, leaderboard, purchase, timer, life meter or formal grade. Clearing all 30 stages is the campaign success condition; replay supports review and a new ten-out-of-ten attempt.",
      ],
      how: ["Press Start Game and swipe the horizontal Stage rail to an unlocked investigation.", "Study the portrait, mystery image or silhouette and read every clue below it.", "Compare the evidence with the three or four animal names, then choose one.", "After a wrong answer, use the feedback and try again; after a correct answer, read the animal note.", "Identify all ten animals to save the clear and unlock exactly the next stage."],
      strategyTips: ["Name one visible feature before reading the choices on clear-picture stages.", "On mystery stages, trust the habitat clue more than the softened colors.", "For silhouettes, compare the outline of trunks, necks, shells, ears and bodies.", "Read every clue in an expert check; the combination should identify one animal.", "With four choices, remove animals that cannot live in the stated habitat or eat the named food.", "Pause on the correct-answer animal note instead of rushing past it."],
      progression: [
        "Stages 1–5, Picture Introductions, establish the animal library with clear portraits and feature clues. Stage 5 adds a second clue and four choices.",
        "Stages 6–10, Habitat Homes, use softened mystery images and make location evidence important. Stage 10 combines habitat and feature facts.",
        "Stages 11–15, Feature Detectives, use silhouettes to test outline recognition. Stage 15 ends the chapter with mixed clues and four choices.",
        "Stages 16–20, Animal Actions, focus on movement and social behavior. Stage 20 combines behavior with habitat.",
        "Stages 21–25, Food and Families, use four choices and diet clues. Stage 25 adds appearance evidence to the food question.",
        "Stages 26–30, Junior Expert Mix, combine two clues with mystery images or silhouettes. Stage 30 uses four choices, a silhouette and three connected feature, habitat and behavior clues.",
      ],
      designNote:
        "Ten questions revisit one lesson without making a Kids session feel like a long test. Difficulty grows by changing which evidence remains useful, not by shrinking targets or adding time pressure. Blur and silhouette are teaching modes rather than hidden hitboxes; large native answer buttons remain available to touch, mouse and keyboard. The fixed logical layout scales uniformly across phones, tablets, short landscape and desktop. The learning pause counts only visible play time, so an app switch cannot silently skip the fact. Unlike WeightPlay matching or action games, factual evidence is the entire decision. The Kids route creates no advertising request, reserve, account, purchase, ranking or diagnostic claim.",
      parent:
        "Animal Quiz can support conversations about animal names, habitats, diets, body features and behavior. Children who are still learning to read can play with an adult who reads each clue aloud. Saved stars and the Skill Report describe only this play session; they are not a school grade, IQ result, developmental diagnosis or comparison with other children. Progress stays in the current browser and may disappear if local storage is cleared. No child profile is required, and the Kids route requests no advertising.",
      faq: [
        ["How many stages and questions are included?", "There are 30 saved stages with ten different animal questions in each stage."],
        ["Why is the animal picture sometimes blurry or dark?", "Habitat stages use a mystery image, while Feature Detective and expert stages use silhouettes so facts and outlines matter."],
        ["What happens after a wrong answer?", "The question remains open and the player can try another choice without losing progress."],
        ["Why do some stages have four choices?", "Later food, mixed and expert stages add a fourth name after the animal library has been introduced."],
        ["Is progress saved?", "Unlocked stages, completed cards and best results are stored only in this browser."],
        ["Can it be played on a phone or with a keyboard?", "Yes. The same fixed layout supports touch, mouse and keyboard controls."],
        ["Does it require an account?", "No login or child profile is required. Clearing browser storage can remove local progress."],
        ["Does the Kids page show ads?", "No. Animal Quiz creates no advertising request or ad reserve."],
        ["Is the Skill Report a formal assessment?", "No. It is supportive play feedback, not a school, IQ, health or developmental test."],
      ],
    },
    "zoo-helper-day": {
      title: "Zoo Helper Day",
      age: "3+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Animal Knowledge", "Focus", "Hand-Eye Coordination"],
      intro: "Zoo Helper Day is a free bilingual Kids care game with 30 saved shifts across six animal zones. Children help a lion, panda, elephant, penguin, giraffe and koala with fruit, leaves, fish, water, brushes, showers, toys and balls. Early shifts name one exact item. Later chapters remove visible labels, accept a matching care category, briefly hide a request that can be shown again, or require two steps in order. Every fifth shift is a Keeper Check. There is no countdown, and a wrong item keeps the request open.",
      story: ["The small zoo workday moves among Savanna Feeding, Bamboo Grove, Elephant Bath, Penguin Pool, Giraffe Lookout and Koala Nursery. The player is the helper preparing the next care item. Tickets mark a completed station shift, while happiness reflects retries. A wrong picture never harms the animal or ends the game.", "The simplified tool set supports play decisions rather than professional care instruction. Completing Shift 30 means the helper has practiced all six rule families and finished the Koala Nursery Keeper Mix."],
      systems: ["Exact requests accept one named item from four large choices.", "Picture Tools visually remove item words but retain large art and accessible names.", "Care Categories ask for food, drink, cleaning or play; more than one listed tool can be valid.", "Remember & Help shows the request first, then offers a recall prompt. Tapping the animal restores the same request without penalty.", "Two-Step Routine labels steps 1/2 and 2/2; a later tool chosen early counts as a retry.", "Keeper Mix shifts combine picture, category, memory or ordered rules already taught.", "A clear saves one to three stars and exactly the next unlock in local browser storage. There is no account, purchase, leaderboard, ad request or ad reserve."],
      how: ["Swipe the horizontal Stage rail to an unlocked shift.", "Read the station rule and animal request.", "Tap a tool picture or drag it onto the animal card; keyboard uses the same buttons.", "Use the animal to reveal a hidden memory request when needed.", "Finish every decision to save stars and unlock the next shift."],
      strategyTips: ["Say the item or care category aloud before choosing.", "In Picture Tools shifts, compare object shape and color.", "Tap the animal to review a remembered request instead of guessing.", "For category play, decide whether each picture means food, drink, cleaning or play.", "Read the 1/2 and 2/2 marker before acting in a routine.", "Treat a retry as a calm chance to compare the four pictures again."],
      progression: ["Shifts 1-5 teach exact Care Match requests and end with the first Keeper Check.", "Shifts 6-10 remove visible item labels in Picture Tools play.", "Shifts 11-15 introduce Care Categories with one or more valid tools.", "Shifts 16-20 briefly hide requests, which can always be restored by tapping the animal.", "Shifts 21-25 require ordered two-step routines; Shift 25 contains three complete pairs.", "Shifts 26-30 recombine earlier rules. Shift 30 uses picture-only category choices, memory recall and six decisions. Checkpoints are exactly 5/10/15/20/25/30."],
      designNote: "Short shifts and large care pictures give preschool players a clear ending without a timer. Difficulty changes the kind of observation—recognition, classification, memory or order—instead of shrinking hit areas. Touch, drag, mouse and keyboard share one transaction, and the logical layout scales uniformly across phone, tablet, desktop and short landscape. Unlike Animal Quiz, this game asks which care tool fits the moment rather than which animal matches a fact. Kids play has no advertising, account, purchase, ranking or failure screen.",
      parent: "Zoo Helper Day may support picture recognition, broad care categories, short working memory, sequencing, focus and hand-eye coordination. Adults can explain that real animals need trained keepers, suitable diets, habitats, enrichment and veterinary support beyond this simplified game. Stars and Skill Report are play feedback, not a grade, diagnosis or child comparison. Progress stays in this browser. No child profile is required, and the Kids route requests no advertising.",
      faq: [
        ["Can a 3-year-old play?", "Yes. Early shifts use large pictures; an adult can read later category and routine prompts."],
        ["How many shifts are included?", "There are 30 saved shifts and six Keeper Checks."],
        ["Why did the item words disappear?", "Picture Tools shifts intentionally use the eight tool images; accessible names remain."],
        ["What if the request disappears?", "Tap the animal to show the same request again without a penalty."],
        ["Can two pictures both be correct?", "Yes in Care Category shifts when both belong to the requested kind of care."],
        ["How are stars awarded?", "Zero retries earns three stars, one or two earns two, and more retries earns one."],
        ["Is progress saved?", "Stars and the highest unlocked shift stay only in this browser."],
        ["Does it support touch, drag, mouse and keyboard?", "Yes. Every input method uses the same care rules."],
        ["Does it show ads or collect a child profile?", "No. The Kids game requests no advertising and needs no child account."],
      ],
    },
    "shape-train": {
      title: "Animal Shape Train",
      age: "3+",
      difficulty: "Easy",
      time: "2-5 minutes per route",
      skills: ["Color Recognition", "Logic", "Hand-Eye Coordination"],
      intro: "Animal Shape Train is a free bilingual Kids matching game with 30 saved routes and six Conductor Checks. Shape friends wait at a cheerful station while the player finds the train car with the same circle, square, triangle, star, diamond, or heart symbol. The opening routes are direct picture matches. Later chapters reduce color, move the car order after each boarding, briefly hide the passenger, or require the passenger to be selected before a car can accept the ticket. Route 30 combines all of those rules with all six cars. There is no countdown, life limit, purchase, account, advertising request, or penalty that ends a route.",
      story: ["The Shape Line links six small stations where animal friends deliver bright shape parcels. Every parcel carries one clear symbol, and every orange train car has a matching window. The player is the junior conductor responsible for checking the symbol and sending each passenger to the correct car. A completed route means every waiting friend is safely aboard and the train can leave the platform.", "The route rules represent busier parts of the railway. Outline Cars travel through fog that removes most color. Switching Cars arrive on moving platforms. Remember Passenger routes briefly lower the station card, while Boarding Pass routes require a passenger check before a car is chosen. Clearing Route 30 completes the final mixed Conductor Check."],
      systems: ["Each route contains four to eight passengers selected from six real shapes. Only one visible car matches the current passenger.", "A correct choice shows a short visible-time celebration, advances progress and presents the next passenger. A wrong car gives gentle feedback and leaves the same passenger available.", "Outline Cars reduce color so geometry matters. Switching Cars reorder after every correct match. Remember Passenger hides the symbol but allows a no-penalty reveal. Boarding Pass requires the passenger to be selected first.", "Zero retries awards three stars, a small number awards two, and additional retries award one. The Result Skill Report uses actual matches, first tries, retries and boarded passengers.", "Stars and the highest unlock stay only in this browser. There is no account, leaderboard, purchase, advertising request, life meter or countdown.", "Every fifth route is a Conductor Check. Route 30 saves the final result and exposes no Route 31."],
      how: ["Press Start Game and swipe the horizontal route rail to an unlocked card.", "Read the route rule and look at the passenger shape in the lower station card.", "Tap the passenger, then choose the train car with the same symbol; drag, mouse and keyboard are also supported.", "On memory routes, recall the hidden symbol or tap the passenger to reveal it again.", "Board every listed passenger to save stars and unlock exactly the next route."],
      strategyTips: ["Say the shape name before choosing a car.", "Compare points and curved edges when outline cars remove color.", "Scan the whole track again after every match on a moving route.", "For memory play, name the symbol aloud or trace its outline in the air.", "On Boarding Pass routes, select the passenger before touching a car.", "A wrong choice keeps the route open, so pause and compare instead of guessing quickly."],
      progression: ["Routes 1–5 teach Direct Match with two to four bright cars and end at the first Conductor Check.", "Routes 6–10 use Outline Cars, making curves, corners and points more important than color.", "Routes 11–15 use Switching Cars that reorder after a successful boarding.", "Routes 16–20 briefly hide the passenger; tapping it restores the same shape without a penalty.", "Routes 21–25 add the ordered Boarding Pass action before the shape match.", "Routes 26–30 combine prior rules. Route 30 uses six cars and eight passengers with outline, movement, memory and Boarding Pass rules."],
      designNote: "Difficulty grows by changing what the player observes instead of shrinking controls, adding a timer or hiding the correct hit area. Direct matching establishes the vocabulary; outline, movement, memory and ordered selection each add one understandable decision. The fixed logical layout scales uniformly on phone, tablet, desktop and short landscape. Image-backed cars and tokens keep play visual, while localized text explains only the current rule. Match and memory delays count visible play time, so an app switch cannot silently advance the route. Unlike Animal Quiz, no factual reading is required; unlike Zoo Helper Day, the decision is visual equivalence rather than care purpose. Kids play has no advertising, purchase, account, ranking or diagnostic claim.",
      parent: "Animal Shape Train may support conversations about circles, corners, points, visual matching, short recall, action order, focus and hand-eye coordination. An adult can name each shape aloud or ask how two outlines differ. Stars and the Skill Report describe only this play session; they are not a school grade, IQ score, developmental diagnosis or comparison with another child. Progress stays in the current browser and may disappear if local storage is cleared. No child profile is required, and the Kids route requests no advertising.",
      faq: [
        ["How many routes are included?", "There are 30 saved routes in six chapters, with Conductor Checks at 5, 10, 15, 20, 25 and 30."],
        ["Which shapes appear?", "The game uses circles, squares, triangles, stars, diamonds and hearts."],
        ["Why did the passenger disappear?", "Remember Passenger routes briefly hide it. Tap the passenger to reveal the same shape again without a penalty."],
        ["Why did the train cars move?", "Switching Cars routes reorder them after a correct match so the player scans again."],
        ["Why will a car not accept my choice?", "Boarding Pass routes require the passenger to be selected before choosing a car."],
        ["What happens after a wrong match?", "The same passenger remains available with gentle feedback."],
        ["Is progress saved?", "Stars and the highest unlocked route are stored only in this browser; no login is required."],
        ["Does it support phones and keyboards?", "Yes. Touch, drag, mouse and keyboard use the same matching rules."],
        ["Does the Kids page contain ads?", "No. Animal Shape Train creates no advertising request or ad reserve."],
      ],
    },
    "tiny-weather-rescue": {
      title: "Animal Helper Quest",
      age: "6+",
      difficulty: "Easy",
      time: "3-6 minutes per mission",
      skills: ["Problem Solving", "Animal Knowledge", "Focus"],
      intro: "Animal Helper Quest is a free bilingual Kids picture puzzle with 30 saved missions and six Helper Checks. A rabbit, fox, panda, penguin, lion, or koala appears in one of six neighborhoods. Players connect nine weather or everyday situations to an umbrella, towel, fan, lamp, shelter, apple, boots, or blanket. Later missions remove visible tool words, combine two clues, briefly hide the need, or move the tray after an error. Mission 30 combines every advanced rule without a countdown, purchase, account, life limit, or advertising request.",
      story: ["Six animal neighborhoods share a small helper cart. Sudden rain, puddles, heat, darkness, thunder, hunger, mud, cold, and wind interrupt its route. The player reads the scene and sends the useful item so the cart can continue.", "These are simplified play situations, not professional wildlife-care instructions. Paired clues introduce an immediate priority: rain plus strong wind calls for shelter, while an animal already wet after rain needs the towel. Mission 30 closes the final mixed Helper Check."],
      systems: ["Every mission contains four to six situations and a visible target. Tap a tool or drag it onto the animal; touch, mouse and keyboard use the same decision.", "Correct care adds one help. A wrong choice gives a gentle retry; three wrong choices move on without scoring that situation so play cannot soft-lock.", "Picture Tools hide visible words but retain accessible names. Paired Clues show two icons and one priority answer. Remember the Need allows a no-penalty reveal. Changing Tray reorders tools after an error.", "A clear saves stars, best score, play count, mistakes and exactly the next unlock in local browser storage. The Skill Report uses this run’s real outcomes.", "There is no account, purchase, timer, leaderboard, ad request, ad reserve or formal assessment."],
      how: ["Press Start Game and swipe the horizontal mission rail to an unlocked card.", "Study the animal, large situation icons, and short need line.", "Compare the pictures, then tap one tool or drag it onto the animal.", "Tap the animal to review a hidden memory need without a penalty.", "Reach the mission target to save stars and unlock exactly the next mission."],
      strategyTips: ["Name the situation before checking the tools.", "Use object shape and color when Picture Tools removes visible words.", "With two clues, decide which need has immediate priority.", "Review a hidden need instead of guessing.", "Rescan the whole tray after a wrong choice in Changing Tray missions.", "Use gentle feedback to remove unlikely choices."],
      progression: ["Missions 1–5 teach one clear need and end with the first Helper Check.", "Missions 6–10 remove visible tool words while preserving accessible names.", "Missions 11–15 combine two situation clues into one priority choice.", "Missions 16–20 briefly hide the need, which can always be restored by tapping the animal.", "Missions 21–25 reorder the tool tray after an incorrect choice.", "Missions 26–30 combine picture, paired-clue, memory and changing-tray rules; Mission 30 contains six situations."],
      designNote: "Difficulty grows by changing useful evidence instead of shrinking targets or adding a clock. Direct needs establish meanings; picture recognition, priority, recall and changing positions each add one understandable demand. The fixed logical Canvas scales uniformly across phone, tablet, desktop and short landscape. Situation effects never display the answer item, and visible-time feedback cannot finish while the page is backgrounded. Unlike Zoo Helper Day’s care categories and ordered routines, this game connects environmental situations to immediate item decisions. Kids play has no advertising, account, purchase, ranking or diagnosis.",
      parent: "Animal Helper Quest may support picture recognition, cause-and-effect discussion, simple prioritization, short recall, focus and hand-eye coordination. Real animals need suitable habitats, diets, trained carers and veterinary support beyond these simplified scenes. Stars and Skill Report are play feedback only, not a grade, IQ score, health claim or developmental assessment. Progress stays in this browser. No child profile is required, and the Kids route requests no advertising.",
      faq: [
        ["How many missions are included?", "There are 30 saved missions with Helper Checks at 5, 10, 15, 20, 25 and 30."],
        ["Which situations and tools appear?", "Nine situations use eight pictured helper items."],
        ["Why are tool words missing?", "Picture Tool and mixed missions rely on artwork while accessible names remain."],
        ["What do two icons mean?", "Choose the item that handles the immediate priority described by both clues."],
        ["What if the need disappears?", "Tap the animal to show it again without a penalty."],
        ["Why did the tools move?", "Changing Tray missions reorder them after a wrong choice."],
        ["Can a mission get stuck?", "No. Three wrong choices move gently to the next situation."],
        ["Is progress saved?", "Stars, scores and unlocks stay only in this browser."],
        ["Does the Kids page show ads?", "No. The game creates no advertising request or reserve."],
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
    "garden-tiles": { gameplay: "30-Challenge Memory Match", genre: ["Memory", "Puzzle", "Animal"] },
    "animal-rescue": { gameplay: "30-Trail Route Puzzle", genre: ["Route Planning", "Puzzle", "Animal"] },
    "animal-bubble-safari": { gameplay: "Bubble Shooter Puzzle", genre: ["Puzzle", "Bubble Shooter", "Animal"] },
    "animal-habitat-mahjong": { gameplay: "Mahjong Solitaire", genre: ["Puzzle", "Logic", "Animal"] },
    "animal-hidden-safari": { gameplay: "30-Habitat Seek and Find", genre: ["Puzzle", "Safari", "Animal", "Family"] },
    "animal-crystal-survivor": { gameplay: "30-Stage Action Survival Campaign", genre: ["Action", "Survival", "Campaign", "Boss Battle", "Animal"] },
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
      "garden-tiles": { gameplay: "30 關花園記憶配對", genre: ["記憶", "益智", "動物"] },
      "animal-rescue": { gameplay: "30 關路線規劃", genre: ["路線規劃", "益智", "動物"] },
      "animal-bubble-safari": { gameplay: "泡泡射擊解謎", genre: ["益智", "泡泡射擊", "動物"] },
      "animal-habitat-mahjong": { gameplay: "麻將牌配對", genre: ["益智", "邏輯", "動物"] },
      "animal-hidden-safari": { gameplay: "30 關棲地找找看", genre: ["益智", "自然探索", "動物", "親子"] },
      "animal-crystal-survivor": { gameplay: "30 關動作生存戰役", genre: ["動作", "生存", "戰役", "首領戰", "動物"] },
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
      "animal-zoo-idle": {
        title: "動物小小樂園", age: "6+", difficulty: "簡單至中等", time: "每個挑戰約 4 至 12 分鐘", skills: ["規劃", "專注", "順序思考", "動物照顧"],
        intro: "動物小小樂園是一款有 30 個存檔挑戰的溫和樂園經營遊戲。遊客走進草原、購買門票並慢慢裝滿售票箱；玩家則照顧動物、升級點心攤、觀景台與保育員站、擴建入口，並重新安排棲地。最後可讓獅子、長頸鹿、大象、貓熊、企鵝等十二種動物加入。每五關都有一次友善的樂園審查，讓持續成長有明確目標，而不是只等待數字增加。",
        story: ["草原起初只有簡單入口、少數動物與大片可運用空間。玩家擔任年輕的樂園管理員。真正長久的樂園不只需要遊客：動物要定期照顧，棲地位置要妥善安排，服務設施也必須跟上人潮。", "Mimi、Panko、水獺觀察員、犀牛保育員與企鵝遊行隊會在每五關前來檢查。通過審查代表樂園已學會基礎照顧、野餐服務、觀景規劃、保育支援、遊行接待，最後完成盛大草原節所需的整體平衡。"],
        how: ["從橫向關卡列選擇已解鎖的挑戰。", "進入樂園前先讀完所有目標，再決定是否收票或花費。", "整理棲地可提高快樂值，豐富活動則可取得門票收入。", "依目標升級入口、招募動物、改善設施，或拖曳動物改變棲地位置。", "所有目標完成後領取獎勵，再前往下一個挑戰。"],
        systems: ["遊客會持續把門票放入售票箱；每個首次完成的挑戰還會提供少量永久收入加成。", "整理棲地與豐富活動共用短暫冷卻時間，因此要依當前目標選擇。", "入口共有八級；招募的動物與三種各四級的設施會保留在這個瀏覽器存檔。", "棲地排列目標會計算草原中真正的位置變化，不是只按一下按鈕。", "成長報告整理目前樂園狀況；挑戰結果會解鎖下一關，並提供下一個挑戰或返回關卡。"],
        progression: ["第 1 至 5 關教授收票、照顧與移動棲地，最後接受 Mimi 審查。第 6 至 10 關比較兩種照顧方式、要求保留裝滿的售票箱，並在 Panko 野餐前加入點心攤。", "第 11 至 15 關加入觀景台、更大的排列任務與快樂值目標。第 16 至 20 關加入保育員站，並在犀牛保育審查中混合照顧、動物數量與設施規劃。", "第 21 至 25 關擴大入口與動物陣容，準備企鵝遊行。第 26 至 30 關把預算、三種設施、快樂值、棲地排列與收入整合成盛大草原節。"],
        strategyTips: ["花費前先讀全部目標，招募動物與升級設施可能會爭用同一筆門票。", "需要快樂值時選整理棲地；收入不足時選豐富活動。", "若目標要求售票箱已滿，不要太早把票收走。", "拖曳動物時要移動明顯距離，才會算一次重新排列。", "永久升級會帶到後續關卡，但每關的首次完成收入加成只會發放一次。"],
        designNote: "遊戲使用持續運作的經濟，讓孩子在沒有嚴格倒數或戰鬥的情況下觀察因果。等待不是唯一活動；每關都要求收集、照顧選擇、棲地排列、招募與升級的真實組合。30 關橫向關卡列讓成長旅程清楚可見，本機存檔則避免每次回來都重建同一個樂園。大按鈕與直接拖曳同時照顧手機觸控和滑鼠操作。檢查點採友善樂園審查，而不是首領戰，因為核心想像是一起改善動物生活空間。",
        parent: "本作可用來練習簡單規劃、注意、順序思考，並和孩子討論動物照顧。大人可詢問為何要保留門票、選擇某種照顧方式，或把動物移到另一個位置。遊戲沒有戰鬥、排名壓力、帳號要求，也不會在 Kids 頁面發出廣告請求。挑戰進度、升級與報告只是在本機保存的遊戲回饋，不是學校、健康或發展評量。",
        faq: [["共有幾個挑戰？", "共有六段 30 關，並在第 5、10、15、20、25、30 關進行友善樂園審查。"], ["為什麼有時不能立刻收售票箱？", "部分挑戰要求先準備一個裝滿的售票箱；完成該目標後再收取。"], ["兩種照顧行動有什麼差別？", "整理棲地提高快樂值，豐富活動提供門票，兩者共用短暫冷卻。"], ["怎樣才算重新安排棲地？", "把動物拖到明顯不同的位置；很小的誤觸移動不會計算。"], ["過關後樂園會重置嗎？", "不會。動物、入口、設施、金幣與已解鎖關卡都會留在本機存檔。"], ["可以重玩以前的關卡嗎？", "可以重玩任何已解鎖關卡，但首次通關的永久收入加成只會取得一次。"], ["需要登入或會顯示廣告嗎？", "不需要帳號；這款 Kids 遊戲也不會發出廣告請求。"], ["進度存在哪裡？", "進度存在目前瀏覽器；清除網站資料或更換裝置可能會失去或分開存檔。"], ["成長報告是能力測驗嗎？", "不是，它只是遊戲內摘要，不是正式評量。"]],
      },
      "animal-rope-rescue": zhGuide("動物藤蔓救援", "藤蔓物理解謎", ["觀察藤蔓與目標位置。", "切斷正確藤蔓讓道具落下。", "幫助動物取得需要的物品。"]),
      "star-memory": {
        title: "動物星星翻牌", age: "6+", difficulty: "簡單至具挑戰性", time: "每關約 2 至 8 分鐘", skills: ["記憶", "專注", "問題解決"],
        intro: "《動物星星翻牌》是一段有 30 關的夜空圖片配對旅程。玩家幫助六位友善的星光守護者重新連起動物星座。前期從經典配對開始，之後透過開場預覽、答錯後月光洗牌、指定動物順序，以及答對後星座移位，改變每一關需要使用的記憶方法。每五關都有一次守護者檢查，第 30 關會在完整十二組牌面同時使用四種進階規則。",
        story: ["動物星圖原本會在日落後引導森林、河流、草原與極地動物回家。一場溫和流星雨沒有破壞星圖，卻把每一顆動物星光分成兩張隱藏卡牌。玩家成為守護者的年輕讀圖員，把每組圖案重新連起來，讓星座再次發亮。", "貓咪、熊熊、貓頭鷹、獅子、企鵝與無尾熊各自守護一段五關課程。通過守護者檢查，就代表那一區夜空已修復；完成最後的無尾熊終極星光檢查，表示十二種動物星座都回到正確路線。"],
        how: ["從橫向關卡列選擇已解鎖關卡。", "翻開兩張卡牌並記住兩個位置。", "圖案相同會保留為已完成配對；不同時會先停留片刻再蓋回去。", "先讀規則標籤，後期可能預覽、洗牌、要求指定順序，或在答對後移動隱藏圖案。", "在步數內清除全部配對，即可解鎖下一關。"],
        systems: ["經典關卡不會移動隱藏圖案，重點只有位置記憶。", "預覽關卡會先短暫翻開完整牌面，輸入會鎖定，全部蓋回後才開始計步。", "月光洗牌會在猜錯後移動尚未配對的相同圖案，玩家必須更新記憶，不能重複舊位置。", "順序關會指定下一組動物；找到其他正確配對仍會蓋回，且不會推進進度。", "星座移位會在成功配對後，把所有剩餘隱藏圖案輪轉一格。", "步數、配對、最佳連續、分數、星星、關卡解鎖與最佳成績只提供本機進度回饋，沒有公開排行榜。"],
        progression: ["第 1 至 5 關教授經典位置配對，最後進行貓咪的開場預覽檢查。第 6 至 10 關逐漸縮短預覽時間，並在熊熊檢查加入一次開場洗牌。", "第 11 至 15 關加入答錯洗牌。第 16 至 20 關要求依提示動物順序完成，最後在獅子檢查把順序與洗牌結合。", "第 21 至 25 關會在答對後旋轉剩餘星座。第 26 至 30 關混合預覽、順序、洗牌與旋轉，最後以十二組全規則牌面收尾。"],
        strategyTips: ["預覽時分列或分小區觀察，不要一次勉強記住整個牌面。", "月光洗牌後放下舊位置，從新翻開的卡牌重新建立地圖。", "順序關先找出指定動物，再處理已知道位置的其他配對。", "星座移位後可記住哪些圖案仍存在，但不能再相信原本位置。", "利用猜錯後的短暫停留，同時比較兩張牌再更新記憶。"],
        designNote: "遊戲先用熟悉的配對規則讓操作立即可懂，再藉由改變『哪些資訊仍然可靠』建立深度。預覽測試第一印象，洗牌練習更新記憶，順序改變目標優先，旋轉則讓一次成功選擇改變下一個決定。所有機制沿用同一組大型圖片卡牌，不增加手機或鍵盤操作負擔。守護者檢查採友善修復星圖的方式，不使用戰鬥；步數限制提供明確結束點，重試仍然快速且正向。",
        parent: "本作可用來練習視覺回憶、注意、彈性更新與遵循短順序。大人可以詢問洗牌後哪些位置仍可信，或為什麼要先找到指定動物。遊戲沒有戰鬥、帳號要求、公開排名，也不會在 Kids 頁面發出廣告請求。星星與技能報告只是本機遊戲鼓勵，不是智力、學校、健康或發展評量。",
        faq: [["共有幾關？", "共有六段 30 關，守護者檢查位於第 5、10、15、20、25、30 關。"], ["月光洗牌會做什麼？", "猜錯後，相同的一組未配對圖案會移到不同的隱藏位置。"], ["為什麼找到相同圖案卻又蓋回去？", "順序關會在提示列指定下一組必須完成的動物。"], ["星座移位是什麼？", "成功配對後，所有剩餘隱藏圖案會輪轉一格。"], ["開場預覽會消耗步數嗎？", "不會。預覽期間無法操作，全部蓋回後才開始遊玩。"], ["可以重玩關卡嗎？", "可以重玩任何已解鎖關卡，改善本機分數或星星。"], ["進度會保存嗎？", "已解鎖關卡、星星與最佳分數存在這個瀏覽器，不需要登入。"], ["Kids 頁面有廣告嗎？", "沒有，這款遊戲不會發出廣告請求，也沒有廣告保留區。"], ["技能報告是正式記憶測驗嗎？", "不是，它只整理本局的配對、步數與連續成功。"]],
      },
      "campus-dash": zhGuide("動物閃電跑", "路線閃避跑酷", ["左右移動切換路線。", "避開障礙並收集獎勵。", "保持反應速度完成挑戰。"]),
      "snack-blocks": zhGuide("動物零食方塊", "三消方塊", ["交換相鄰方塊。", "湊出三個以上相同圖案。", "在限定步數內完成目標。"]),
      "fruit-merge": zhGuide("動物合成塔", "物理合成", ["左右移動決定落點。", "讓相同動物球碰撞合成更高等級。", "避免堆疊超過警戒線。"]),
      "garden-tiles": {
        title: "寵物花園方塊", age: "6+／親子", difficulty: "簡單至具挑戰性", time: "每關約 3 至 8 分鐘", skills: ["記憶", "專注", "問題解決"],
        intro: "《寵物花園方塊》是一款有 30 個存檔挑戰、沒有關卡倒數的記憶配對遊戲。六個花園篇章會依序加入晨光預覽、短暫翻牌、失誤後移動，以及成功配對後的遊行輪轉；每五關都有一個花園檢查點。",
        story: ["寵物花園溫室收藏每位動物朋友、管理員、水果與花園物件的圖卡。一陣夜風在燈籠散步活動前把圖卡吹散並翻到背面。玩家擔任年輕圖卡管理員，重新整理配對，讓六座花園房間恢復開放。", "每完成一組配對，就把一筆圖像紀錄送回花園名冊。完成每段五關會點亮一盞篇章燈籠；第 5、10、15、20、25、30 關會整合該段學到的記憶方法。"],
        how: ["在水平關卡列選擇已解鎖的挑戰。", "翻開兩張牌，找出相同的動物或花園圖案。", "開始前閱讀規則標籤，準備應對預覽、薄霧、微風或遊行移動。", "清除所有配對可取得星星、保存進度並解鎖下一關。"],
        systems: ["步數與星星：步數計算完整的兩張牌嘗試。較少嘗試可取得更多星星，但任何完成的牌面都能前進，也不會降低舊有最佳成績。", "晨光預覽：開始時短暫顯示全部圖片，適合練習依照角落或列數掃描。", "花園薄霧：若沒有選第二張牌，第一張會在溫和的時間窗後蓋回；整關仍然沒有倒數。", "調皮微風：失誤的可見提示結束後，只會洗動尚未完成的牌。", "花園遊行：成功配對後，其餘牌會沿空位輪轉，需要跟著移動更新記憶位置。"],
        progression: ["1-5 嫩芽小徑：四至八組配對教真正的蓋牌記憶，最後以預覽檢查點收尾。", "6-10 晨光溫室：開場預覽搭配較大牌面，鼓勵規律掃描。", "11-15 薄霧池塘：第一張牌只短暫保持翻開，練習保存最新圖像。", "16-20 微風果園：失誤會移動未配對牌，舊位置不能一直沿用。", "21-25 動物遊行：成功後牌面輪轉，需要追蹤移動。", "26-30 月光花房：多種規則組合，最後是 14 組配對、四規則同時出現的檢查點。"],
        strategyTips: ["預覽時依角落或橫列分組記憶。", "經典關卡的失誤仍是有用的位置資訊。", "微風或遊行移動後，先重建一小區記憶地圖。", "重玩舊關可改善星星，不會失去已解鎖進度。"],
        designNote: "本作用不同記憶要求增加難度，而不是加入緊張倒數。固定 390×788 畫布讓手機與電腦的牌面位置穩定；原生按鈕支援觸控和鍵盤，失誤圖案保留足夠時間，切到背景時也會暫停提示時間。預覽、薄霧、微風與遊行分別練習不同的觀察方式，同時維持 Kids 遊戲的平靜節奏。",
        parent: "本作適合 6+ 與親子遊玩。星星與技能報告只整理本次本機遊戲的配對、步數、重試和星星，不是智力測驗、診斷、發展評估，也不會和其他孩子比較。Kids 版本沒有廣告、登入、聊天或購買要求。",
        faq: [["共有多少挑戰？", "共有六篇 30 關，檢查點位於第 5、10、15、20、25、30 關。"], ["遊戲有倒數嗎？", "沒有。花園薄霧只會讓單次第一張牌在短暫時間後蓋回。"], ["為什麼後期卡牌會移動？", "調皮微風會在失誤後移動未完成牌；花園遊行則在成功後輪轉。"], ["星星怎麼計算？", "依完整兩張牌嘗試次數計算；只要清完牌面就能繼續。"], ["進度會保存嗎？", "已解鎖關卡與最佳星星會保存在目前瀏覽器。"], ["手機和鍵盤都能玩嗎？", "可以，牌卡使用支援觸控、滑鼠與鍵盤的原生按鈕。"], ["需要付費或會顯示廣告嗎？", "不需要帳號或購買；Kids 版本也不會發出廣告請求。"], ["技能報告是正式測驗嗎？", "不是，只是本次完成關卡的遊戲摘要。"]],
      },
      "animal-rescue": {
        title: "動物回家路", age: "6+／親子", difficulty: "簡單至具挑戰性", time: "每關約 3 至 8 分鐘", skills: ["邏輯", "問題解決", "動物認識"],
        intro: "引導十二位動物朋友完成 30 條無倒數、可存檔的回家路線。六個區域會加入必收水果、加重步數的黏泥、路線鑰匙、上鎖大門、一次性脆弱小路與救援檢查點。",
        story: ["回家谷原本用彩繪水果標誌，引導動物穿過森林、草地、河畔、山脊、農場與慶典場地。風雨吹散標誌、讓捷徑覆上黏泥、沖走踏腳石，也鎖住幾扇花園大門。玩家擔任年輕路線管理員，重新找出每一條安全旅程。", "每五關是一個救援檢查點。完成第 30 關代表企鵝走過最後的混合路線，十二位動物朋友都能參加回家慶典。"],
        how: ["在水平關卡列選擇已解鎖路線。", "用觸控、滑鼠或單次方向鍵移動到相鄰格。", "收集水果與鑰匙，避開岩石、水域、關閉大門與已塌下的脆弱小路。", "完成目前目標後進入家門，再選下一關、重玩或回到路線。"],
        systems: ["步數與星星：一般地面算一步，黏泥算兩步；關卡步數目標和水果數量決定一至三星。", "全部水果：標示此規則的路線會在水果收齊前關閉家門。", "路線鑰匙與大門：先取得金色鑰匙，該大門才會接受移動。", "脆弱小路：每格只能進入一次；除非使用上一步或重置移除該次造訪，否則不能回頭。", "上一步與重置：上一步會依保留路徑重新計算水果、鑰匙、大門、脆弱格與加權步數；重置會重建整條路線。"],
        progression: ["第 1-5 關森林起步教授相鄰移動、障礙、水果繞路與第一個全水果檢查點。", "第 6-10 關草地繞路加入黏泥與加權路線比較。", "第 11-15 關河畔鑰匙在水域走廊加入鑰匙和大門。", "第 16-20 關脆弱山脊加入一次性格子與鑰匙門檢查點。", "第 21-25 關豐收路線要求水果，並混合黏泥、大門與脆弱選擇。", "第 26-30 關回家慶典整合規則；第 30 關同時使用全部水果、黏泥、鑰匙門和脆弱小路。"],
        strategyTips: ["移動前先規劃完整的水果到家路線。", "比較路線時把黏泥算兩步。", "進入大門走廊前先找到鑰匙。", "踏上脆弱格前先決定要從哪一側離開。", "近期走錯用上一步，整體計畫錯誤則用重置。"],
        designNote: "固定 5×5 棋盤能讓手機上的每一格維持大型尺寸，同時看見完整路線。離散移動讓觸控、滑鼠與鍵盤做出相同決策。難度來自成本、順序、可否回頭與完成條件，而不是速度。固定 390×788 Kids 畫布沒有倒數、戰鬥、排行榜、帳號、購買、廣告請求或廣告保留區。",
        parent: "本作適合 6+ 與親子遊玩。星星只整理本機遊戲表現，不是智力測驗、學校成績、診斷、發展評估，也不會與其他孩子比較。進度保存在目前瀏覽器；Kids 版本沒有廣告、登入、聊天或購買要求。",
        faq: [["共有多少路線？", "共有六區 30 關，檢查點位於第 5、10、15、20、25、30 關。"], ["每關都要收齊水果嗎？", "只有標示全部水果的路線會在收齊前關閉家門；其他關的水果仍會影響星星。"], ["為什麼黏泥算兩步？", "黏泥使用加權成本，讓最直接的路線不一定最有效率。"], ["鑰匙和大門怎麼運作？", "先取得金色鑰匙再進入大門；被拒絕的移動不會增加步數。"], ["脆弱小路可以走兩次嗎？", "不行，但上一步或重置可透過移除該次造訪來恢復它。"], ["進度會保存嗎？", "會，解鎖與最佳星星保存在目前瀏覽器。"], ["手機和鍵盤都能玩嗎？", "可以，觸控、滑鼠和方向鍵使用相同規則。"], ["需要付費或會顯示廣告嗎？", "不需要帳號或購買；Kids 版本也不會發出廣告請求。"]],
      },
      "animal-bubble-safari": {
        title: "動物泡泡探險", age: "6+", difficulty: "簡單到中等", time: "每關 3–6 分鐘", skills: ["專注", "手眼協調", "問題解決"],
        intro: "《動物泡泡探險》是一款免費雙語 Kids 瞄準益智遊戲，共有 30 個可保存關卡與六次草原檢查。玩家發射動物泡泡、連接三顆同色泡泡、利用牆面反彈，並救出五種草原朋友。後段加入石頭、葉球、需要兩次碰撞的蜂蜜、整排清除的雲、東西風、移動列，以及彩虹、橫掃、爆破、交換四種力量泡泡。第 30 關結合四種障礙、三隻救援動物、風、移動列與所有力量，沒有倒數、帳號、購買或廣告請求。",
        story: ["六個草原地區由水源路線相連，小動物被漂浮泡泡群包圍。玩家跟著獅子嚮導，用泡泡發射器打開安全道路；在預備泡泡用完前完成配對或救援目標，即代表該區恢復通行。", "障礙是路線的一部分，不是敵軍。每五關會用草原檢查重組該區技巧；完成第 30 關大草原重聚會救出最後三隻動物，結束設計好的旅程。"],
        systems: ["目前與下一顆泡泡可用來提前規劃。拖曳瞄準；方向鍵調整同一邏輯瞄準點，Enter 或空白鍵發射。", "泡泡以連續飛行的小步驟檢查可見碰撞，並附著在實際碰到泡泡附近的空位，不會瞬移到遠方隱藏格。", "三顆以上同色相連會消除；反彈目標要求先碰牆；救援目標要清除一到三顆標記動物泡泡。", "葉球由相鄰配對帶走，蜂蜜需兩次直擊，雲被碰會清除整排；風會改變飛行，移動關會在發射後平移交錯列。", "彩虹變成碰到的顏色，橫掃清一排，爆破清附近區域與障礙，交換則互換顏色。", "星星依剩餘泡泡計算；解鎖、最佳星星、分數、救援圖鑑與音效選擇只保存在目前瀏覽器。Kids 畫面沒有廣告。"],
        how: ["在水平關卡軌道滑到已解鎖關卡，閱讀目標與提示。", "瞄準前先看目前與下一顆泡泡。", "拖向同色泡泡；直線被擋時利用牆面。", "放開發射，觀察精確碰撞與附著後再規劃。", "在泡泡用完前完成指定配對或救援。"],
        strategyTips: ["先用下一顆泡泡規劃狹窄通道。", "反彈要提早碰牆，讓回彈路線從側面接近。", "用相鄰配對清葉球，並記得蜂蜜要碰兩次。", "打雲前先查看整排內容。", "逆著風偏移瞄準，移動列每次發射後都重新判讀。", "把爆破留給密集障礙，橫掃留給重要列。"],
        progression: ["第 1–5 關教直射、反彈、救援、混色與石頭。", "第 6–10 關擴大救援鏈並加入彩虹與橫掃。", "第 11–15 關加入爆破、交換、葉球、蜂蜜與雲。", "第 16–20 關加入東西風與交錯移動列。", "第 21–25 關把四種力量分別搭配適合障礙，最後同時救三隻動物。", "第 26–30 關混合葉石通道、蜂蜜逆風、移動雲列與三獸救援；第 30 關使用所有主要規則。"],
        designNote: "本作的核心承諾是可見碰撞要產生可信附著。連續移動與局部空位選擇維持瞄準公平；難度來自角度、障礙反應、救援位置、風、列移動、下一顆規劃與力量時機，而不是加速或縮小目標。單一邏輯 Canvas 會在手機、平板、桌面與短橫向螢幕等比縮放；觸控、滑鼠與鍵盤共享瞄準狀態，切換 App 也不會讓舊放手事件偷偷發射。它不同於《動物泡泡烘焙坊》的點擊群組，本作核心是軌跡與反彈。Kids 遊玩沒有廣告、帳號、購買、排名或診斷。",
        parent: "《動物泡泡探險》可用來談視覺預測、規劃、顏色分類、專注與手眼協調。大人可以一起討論反射路線、風向偏移，或目前泡泡是否應替下一顆開路。星星與技能報告只是本機遊玩回饋，不是成績、智力分數、診斷或兒童比較。進度只留在目前瀏覽器；不需要兒童帳號，Kids 路線也不會請求廣告。",
        faq: [["共有多少關？", "共有 30 個可保存關卡，草原檢查位於第 5、10、15、20、25、30 關。"], ["泡泡為什麼附著在目標旁邊？", "它會使用實際碰到泡泡附近最近的空位。"], ["反彈目標怎麼算？", "完成配對的發射泡泡必須先碰過側牆。"], ["葉、蜂蜜與雲怎麼處理？", "葉球由相鄰配對帶走，蜂蜜需兩次碰撞，雲會清除整排。"], ["四種力量泡泡是什麼？", "彩虹變色、橫掃清列、爆破清區域、交換互換顏色。"], ["有倒數嗎？", "沒有，限制是畫面顯示的預備泡泡數。"], ["進度會保存嗎？", "解鎖、星星、分數、圖鑑與音效選擇只留在目前瀏覽器。"], ["觸控與鍵盤都能玩嗎？", "可以，觸控、滑鼠、方向鍵、Enter 與空白鍵使用相同瞄準規則。"], ["Kids 頁面有廣告嗎？", "沒有，本作不會建立廣告請求或保留區。"]],
      },
      "animal-habitat-mahjong": {
        title: "動物棲地麻將消消", age: "9+", difficulty: "入門到進階", time: "每關約 4～10 分鐘", skills: ["邏輯", "專注", "問題解決"],
        intro: "《動物棲地麻將消消》是免費的雙語 Kids 麻將牌配對遊戲，包含 30 個可儲存牌局、十種立體牌形、六個規則章節，以及位於第 5、10、15、20、25、30 關的棲地終局。玩家要配對相同的可用動物牌與棲地牌、解開菱形鑰匙封印、救援星號家族，並跟隨交替的 A／B 巡守路徑；遊戲沒有倒數失敗。",
        story: ["森林巡守檔案館替森林樹冠、草原足跡、珊瑚棚與極地極光保存圖像牌冊。季節風暴把牌冊折成多層堆疊，讓動物肖像、貝殼、珊瑚、樹葉與雪地標記互相遮蓋。玩家是見習牌冊巡守員，要把每一對圖像送回正確頁面。", "菱形標記的動物帶著藍色路徑封印的鑰匙，星號圖像則是走散的動物家族。巡守小徑會在每次成功後把可用路線由 A 切換到 B，要求重新觀察不同牌層。完成第 30 關代表最後一頁珊瑚棚紀錄已復原，六個棲地終局全部完成。"],
        how: ["在 30 關水平滑動軌道上選擇已解鎖牌局，先閱讀該關規則。", "尋找兩張相同的牌；上方不能有牌覆蓋，左右至少一側必須開放。", "封印關要先配對菱形鑰匙，救援關則要找出兩組星號家族。", "提示會指出合法配對；復原只退回上一組；沒有可配對牌時才能洗牌。", "清空所有牌即可保存成績，並且只解鎖下一關。"],
        systems: ["每關有八到十二組真正配對，分布在一到三層牌面上。所有圖像保持可見，重點是判斷取牌路徑，不是記憶翻牌。", "標準可用牌的同一座標上方不能有活動牌，而且同列同層的左側或右側至少一邊沒有鄰牌。巡守小徑還會限制只能配對目標列顯示的 A 或 B 路線，成功後通常切換。", "路徑封印會鎖住標記內層牌，直到發光菱形配對清除。家族救援追蹤兩組星號配對；巡守試煉結合封印與救援；大棲地再加入交替巡守路徑。", "提示只標出目前合法的一對。復原會連同鑰匙、救援與巡守路徑狀態一起還原。仍有走法時洗牌會停用；死局洗牌會保留特殊標記並保證產生可用配對。", "步數計算配對與洗牌。頁面隱藏時不計遊玩時間。每關的最高分、最少步數、最快可見時間與解鎖進度都只存在目前瀏覽器。"],
        strategyTips: ["優先清除能揭露多張底牌的上層配對。", "左右兩側都保留路徑，不要只清空單邊。", "規劃封印牌以前先處理菱形鑰匙。", "沿著覆蓋牌層追蹤每組星號家族的位置。", "巡守小徑要先確認目標列顯示 A 或 B，成功後通常會切換。", "若一組配對封住多條路徑，立刻使用復原重新判斷。"],
        progression: ["第 1～5 關以方格、菱形、階梯、橋梁與堆疊牌形教學標準規則。", "第 6～10 關加入菱形鑰匙與兩組封印內層牌。", "第 11～15 關加入兩組星號家族；第 15 關刻意以無配對開場教學洗牌復原。", "第 16～20 關在極地金字塔與聖所牌形中交替 A／B 巡守路徑。", "第 21～25 關同時使用路徑封印與家族救援。", "第 26～30 關綜合封印、救援與交替巡守路徑；第 30 關有三層共十二組牌。"],
        designNote: "難度來自取牌條件的改變，不是單純增加牌量、縮小圖像或加快倒數。封印建立先後依賴，救援提供可見子目標，巡守小徑則在每次成功後改變目前可用牌組。固定邏輯畫面會等比例縮放到手機、平板、桌面與短橫向螢幕；觸控、滑鼠與鍵盤共用同一套判定，結果留在 Battle 內，Kids 路徑不建立任何廣告請求或保留區。與記憶翻牌不同，所有圖像都保持可見；與平面消除不同，移除順序會改變可接近的牌。",
        parent: "《動物棲地麻將消消》可以用來陪伴練習視覺掃描、空間規劃、專注、因果關係與重新修正決定。分數與能力報告只描述本次本機遊玩，不是智力測驗、學校成績、診斷或兒童比較。進度只存在目前瀏覽器，清除網站資料後可能重設。不需要建立兒童資料，Kids 路徑不會請求廣告。",
        faq: [["遊戲共有幾關？", "共有 30 個可儲存牌局與六個棲地終局。"], ["什麼是可用牌？", "牌面上方不能被覆蓋，左右至少一側必須開放；巡守小徑還會限制目標列顯示的 A 或 B 路線。"], ["菱形、星號與藍色標記代表什麼？", "菱形會打開封印，星號標記救援家族，藍色封印牌要等待鑰匙。"], ["為什麼洗牌按鈕不能使用？", "只有目前沒有任何合法配對時，洗牌才會開啟。"], ["復原會還原特殊規則嗎？", "會，上一組牌、鑰匙、救援與巡守路徑狀態都會一起還原。"], ["遊戲有時間限制嗎？", "沒有；可見時間只用來保存個人紀錄。"], ["不用帳號也會保存嗎？", "會，解鎖與各關紀錄只存在目前瀏覽器。"], ["可以使用觸控或鍵盤嗎？", "可以，觸控、滑鼠、Tab、Enter 與空白鍵使用相同規則。"], ["Kids 頁面會顯示廣告嗎？", "不會，遊戲不會建立廣告請求或保留區。"]],
      },
      "animal-hidden-safari": {
        title: "動物探險找找看", age: "3+／親子", difficulty: "簡單至具挑戰性", time: "每個棲地約 2 至 6 分鐘", skills: ["專注", "動物認識", "問題解決"],
        intro: "《動物探險找找看》是一段平靜的 30 棲地搜尋旅程。六區各有五關，從自由搜尋逐步加入指定順序、動物雙雙、深層偽裝、清單外訪客與緩慢移動的巡遊目標。每關都有六張真實圖片目標、兩次提示、星星與本機最佳搜尋時間，但沒有倒數失敗。",
        story: ["小小巡護員中心會替陽光草原、河邊棲地、夕陽樹林、池塘觀察、叢林邊緣與遠眺山丘建立動物圖片名冊。季節小徑同時開放後，獅子、大象、長頸鹿、貓熊、企鵝、無尾熊、兔子、狐狸、青蛙和貓頭鷹出現在不同區域。玩家擔任年輕觀察員，把畫面和本次六張圖片清單逐一核對。", "找到六個指定目標，代表完成一次可靠的棲地紀錄。每第五關是棲地檢查點，會複習該區學到的搜尋方法。完成第 30 關，代表雙胞胎動物都有分開記錄、無害訪客沒有被誤算，遠眺山丘的移動巡遊也依指定順序完成。"],
        how: ["在水平 30 關關卡列選擇已解鎖棲地，先閱讀規則標籤。", "比較場景下方六張圖片清單與被草、樹葉、水面或塵土遮住的動物。", "點擊、觸碰，或用鍵盤聚焦後按 Enter 找到目標；巡護順序關要依亮起的清單前進。", "需要時使用兩次羅盤提示；可能的情況下，兩次會指出不同的未找到動物。", "找到全部六隻後保存星星與可見搜尋時間，解鎖下一關或重玩目前棲地。"],
        systems: ["可見搜尋時間沒有失敗上限，只在棲地實際顯示並可操作時記錄；切換 App 或隱藏分頁會暫停。完成後只會和同一棲地的本機最佳時間比較。", "星星鼓勵仔細自主觀察。沒有空白誤點且沒使用提示可得三星；少量誤點並至少保留一次提示可得二星；任何完成場景都至少一星並能前進。", "自由搜尋可用任意順序找六張圖片。巡護順序一次亮起一個指定目標；先點其他清單動物只會得到友善提醒，不會讓牠消失。", "動物雙雙會在同一場景放入同種動物的兩個不同位置。找到一隻狐狸、貓頭鷹、獅子、貓熊、企鵝或無尾熊，不代表牠的伙伴也完成。", "深層偽裝會降低動物和背景的分離度，並加大前景草葉、水面或塵土遮擋。鍵盤焦點與羅盤提示仍會提供清楚線索，不會讓目標完全消失。", "棲地訪客是有出現在畫面、但不在六張清單上的動物。點到訪客會算一次空白選擇並將牠移開，不會阻止過關。移動巡遊讓目標在小範圍緩慢移動；系統偏好減少動態時會停止。", "提示、誤點、已找到目標、自主找到數、星星、解鎖與最佳時間只用於本機結果與技能報告，不會上傳成測驗分數，也沒有公開排行榜。"],
        progression: ["第 1-5 關陽光草原：六個目標可自由選擇，建立規律掃描方式，最後完成第一個棲地檢查點。", "第 6-10 關河邊棲地：巡護順序把目標從『看見就點』改成依亮起圖片前進。", "第 11-15 關夕陽樹林：三種動物各出現兩次；第 15 關再加入指定順序。", "第 16-20 關池塘觀察：較深的前景偽裝鼓勵由邊緣到中央慢慢掃描，後段混合順序和雙胞胎。", "第 21-25 關叢林邊緣：清單外訪客要求玩家真正比較六張圖片，檢查點再加入順序與偽裝。", "第 26-30 關遠眺山丘：緩慢巡遊改變眼睛回看的位置；最後一關同時使用移動雙胞胎、巡護順序、深層偽裝與三隻訪客。"],
        strategyTips: ["一次掃描畫面的一條橫帶，不要只追著遠處最亮的圖案跳動。", "巡護順序先看發亮目標和清單，再點其他動物。", "同種動物出現兩次時，記住尚未完成的伙伴在左側或右側。", "叢林中每隻吸引注意的動物都先和六張圖片比較，牠可能只是訪客。", "完整掃描一次後再使用提示，羅盤就能幫助發現原本忽略的區域。"],
        designNote: "遊戲把一個正方形搜尋場景與六張大型圖片清單固定在等比例 390×693 Kids 戰鬥畫布，讓手機、電腦、觸控、滑鼠和鍵盤面對同一個版面。難度不是靠縮小點擊區或嚴格倒數，而是改變哪些資訊可靠：順序改變優先目標，雙雙改變計數，偽裝改變視覺分離，訪客改變清單判斷，移動則改變追蹤。檢查點用規則組合取代戰鬥。目標仍保留寬容點擊範圍；提示會命名並圈出一隻動物；長按按鍵不會一次花掉兩次提示或跳過結果；減少動態設定也會停止巡遊。Kids 版本沒有廣告、帳號或購買。",
        parent: "本作適合 3+，後期混合檢查點可由家人陪同。遊戲可能幫助圖片配對、視覺掃描、清單比較、彈性注意與動物命名。大人可以詢問清單還缺哪一隻，或某隻可見動物為什麼是訪客。星星、時間和技能報告只描述這次本機遊戲，不是智力測驗、診斷、發展評估、學校成績，也不會與其他孩子比較。Kids 頁面沒有廣告請求、登入、聊天或購買提示。",
        faq: [["共有多少棲地？", "共有六區 30 關，棲地檢查點位於第 5、10、15、20、25、30 關。"], ["有時間限制嗎？", "沒有。時間只記錄本機最佳成績，不會造成失敗，切到背景的時間也不計入。"], ["巡護順序會改變什麼？", "只有目前亮起的下一隻動物會推進清單，其他指定動物仍會留在畫面稍後再找。"], ["為什麼有兩隻一樣的動物？", "動物雙雙會要求分別找到同種動物的兩位伙伴。"], ["棲地訪客是什麼？", "牠是畫面中可見、但沒有印在這次清單上的動物，不會算成找到目標。"], ["提示怎麼運作？", "羅盤圈與短名稱會指出一隻未完成動物，每關可用兩次。"], ["進度會保存嗎？", "會，解鎖、星星與最佳時間保存在目前瀏覽器，不需要帳號。"], ["手機和鍵盤都能玩嗎？", "可以，目標是原生按鈕，支援寬容觸控範圍與連續鍵盤焦點。"], ["Kids 遊戲有廣告嗎？", "沒有，遊戲不會發出廣告請求，也沒有廣告保留區。"], ["技能報告是正式評估嗎？", "不是，只整理這次本機遊戲的找到數、誤點、提示和時間。"]],
      },
      "animal-guard-yard": {
        title: "動物守衛庭院", age: "6+", difficulty: "中等", time: "每關約 5 至 8 分鐘", skills: ["邏輯", "專注", "問題解決"],
        intro: "苜蓿庭院連接六個共享陽光、種子與水源的花園區域。野獸擠進小徑後，玩家成為庭院管理員，把貓騎士、狗戰士、貓頭鷹法師與可選的狐狸遊俠配置在五條路線。30 關會逐區加入可判斷的規則：療癒獸回復前方同路野獸、鑽地獸預警後換到相鄰路線、陽光盜偷走 12 點尚未使用的陽光。每五關都有獨立首領與解法，包括苔角犀牛的咆哮、晶殼陸龜的防護階段、獾王換線、燼鬃野豬衝刺、疾翼鷹延後攻擊與月冠鹿的回復脈衝。通關、分數、庭院勳章、金幣與訓練都保存在本機瀏覽器。",
        how: ["選擇已解鎖關卡，先讀敵人圖示與短提示。", "在預告路線配置擋路與遠程守衛。", "收集陽光、回應特殊敵人提示，別讓家園愛心歸零。", "用金幣訓練守衛，重玩關卡收集 5、15、30 枚勳章里程碑。"],
        strategyTips: ["先集火療癒獸，避免盾獸一直回血。", "看到鑽地獸時，同時照顧相鄰路線。", "陽光盜袋子發亮前先花掉重要陽光或擊倒它。", "晶殼陸龜打開防護後再集中輸出。", "用狗戰士承受燼鬃野豬的預告衝刺。"],
        parent: "本作以友善幻想方式練習規劃、注意與彈性解題，敵人行動都有圖片或短提示，沒有寫實暴力。進度只存在本機，清除瀏覽器資料後可能消失；能力小報告不是學習或健康評估。Kids 頁面不請求廣告，也不要求建立兒童個人資料。",
        faq: [["共有幾關？", "共有六區 30 個具名關卡，每五關有一個機制不同的首領。"], ["晶殼陸龜為何幾乎不受傷？", "晶殼關閉時會大幅減傷，打開後才是集中攻擊時機。"], ["鑽地獸會換路嗎？", "會。它會先閃爍預警，再移到相鄰路線。"], ["陽光盜會做什麼？", "它只會一次偷走 12 點未使用陽光，不會移除已放置守衛。"], ["可以升級守衛嗎？", "可以用本機金幣訓練；狐狸是可選鑽石解鎖，並非過關必要角色。"], ["進度會保存嗎？", "關卡、最佳分數、勳章、金幣與訓練會保存在這個瀏覽器。"], ["手機可以玩嗎？", "可以。選關使用左右滑動，戰鬥使用大型點按區。"], ["Kids 頁面有廣告嗎？", "沒有，這款 Kids 遊戲不會發出廣告請求。"]],
      },
      "animal-quiz": zhGuide("動物小博士", "動物問答", ["閱讀題目並觀察圖片。", "選出正確答案。", "透過關卡認識更多動物。"]),
      "zoo-helper-day": {
        title: "動物園幫忙日", age: "3+", difficulty: "簡單", time: "3-5 分鐘", skills: ["動物知識", "專注", "手眼協調"],
        intro: "《動物園幫忙日》是一款免費雙語 Kids 照顧遊戲，共有 30 個可存檔班次與六個動物區。孩子會用水果、葉子、魚、水、刷子、蓮蓬頭、玩具與球，幫助獅子、貓熊、大象、企鵝、長頸鹿和無尾熊。前期會直接說出需要的道具；後期會移除可見文字、要求照顧分類、暫時收起可以重看的需求，或要求依正確順序完成兩個步驟。每五關是保育員檢核。遊戲沒有倒數，選錯也能繼續嘗試。",
        story: ["小動物園的工作日會巡迴草原餵食區、竹林休息區、大象沖澡區、企鵝水池、長頸鹿觀景台與無尾熊育幼區。玩家是準備下一件照顧道具的小幫手。票券代表完成班次，開心度則反映重試次數；選錯圖片不會傷害動物或結束遊戲。", "這套簡化道具是遊戲決策，不是專業照養教學。完成第 30 關代表玩家練習六種規則並完成無尾熊育幼區的最後綜合檢核。"],
        systems: ["照顧配對會從四張大型圖片中接受一個指定道具。", "圖片道具會隱藏可見名稱，但保留大型圖像與無障礙名稱。", "照顧分類會要求食物、飲水、清潔或玩耍；同一題可能有一個以上合理答案。", "記住需求會先顯示完整句子，再改成回想提示；點動物就能無懲罰重看。", "兩步驟照顧標示 1/2 與 2/2；太早選第二個道具會算一次重試。", "保育員綜合只組合已教過的圖片、分類、記憶與順序規則。", "通關會把一到三星與下一關解鎖存在目前瀏覽器；沒有帳號、購買、排行榜、廣告請求或廣告保留區。"],
        how: ["在橫向關卡列滑到已解鎖班次。", "閱讀動物區規則與目前需求。", "點道具圖片或拖到動物卡；鍵盤使用相同按鈕。", "需要時點動物重看記憶需求。", "完成全部選擇即可儲存星星並解鎖下一關。"],
        strategyTips: ["選擇前先說出道具或照顧分類。", "圖片道具關要比較物件形狀與顏色。", "忘記需求時點動物重看，不必猜。", "分類關先判斷圖片屬於食物、飲水、清潔或玩耍。", "兩步驟關要先看 1/2 或 2/2。", "選錯時平靜地重新比較四張圖片。"],
        progression: ["第 1-5 關練習指定道具的照顧配對。", "第 6-10 關隱藏道具可見名稱。", "第 11-15 關加入可能有多個合理答案的照顧分類。", "第 16-20 關暫時收起需求，但隨時可點動物重看。", "第 21-25 關要求依序完成兩步驟照顧。", "第 26-30 關重新組合前述規則；第 30 關含圖片分類、記憶與六次選擇。檢核固定在 5/10/15/20/25/30。"],
        designNote: "短班次和大型圖片讓幼兒不必面對倒數也能完成明確目標。難度改變的是觀察方式，包括辨識、分類、記憶與順序，不會縮小點擊區。觸控、拖曳、滑鼠和鍵盤共用同一套照顧規則，固定邏輯版面也會在手機、平板、電腦與短橫向等比例縮放。Kids 遊玩沒有廣告、帳號、購買、排名或失敗畫面。",
        parent: "本作可陪孩子練習圖片辨識、基本照顧分類、短期記憶、簡單順序、專注與手眼協調。大人也可以說明真實動物需要專業保育員、適合的飲食、棲地、豐富化活動與獸醫照護，遠比遊戲完整。星星與技能報告只是遊玩回饋，不是成績、診斷或兒童比較。進度只在目前瀏覽器；不需要兒童個人資料，也不會請求廣告。",
        faq: [["3 歲孩子可以玩嗎？", "可以。前期使用大型圖片，後期文字可由大人朗讀。"], ["共有幾個班次？", "共有 30 關與六次保育員檢核。"], ["道具文字為什麼消失？", "圖片道具關刻意使用八張道具圖，但仍保留無障礙名稱。"], ["需求消失怎麼辦？", "點動物即可重看相同需求，不會受罰。"], ["同一題會有兩個正確圖片嗎？", "照顧分類關可能接受兩個都符合分類的道具。"], ["星星如何計算？", "零次重試三星，一到兩次兩星，更多重試一星。"], ["進度會保存嗎？", "星星與最高解鎖關只存在目前瀏覽器。"], ["支援觸控、拖曳、滑鼠和鍵盤嗎？", "支援，而且全部使用相同照顧規則。"], ["會有廣告或兒童帳號嗎？", "不會；Kids 遊戲不請求廣告，也不需要兒童帳號。"]],
      },
      "shape-train": {
        title: "動物形狀小火車", age: "3+", difficulty: "簡單", time: "每條路線 2–5 分鐘", skills: ["形狀辨識", "邏輯", "手眼協調"],
        intro: "《動物形狀小火車》是一款免費的雙語 Kids 配對遊戲，共有 30 條可保存路線與六次車長檢查。形狀朋友在明亮車站等候，玩家要從圓形、正方形、三角形、星形、菱形與愛心車廂中找出相同符號。前段是直接看圖配對；後續會淡化顏色、在每次上車後改變車廂順序、暫時藏起乘客，或要求先驗票再選車廂。第 30 路線會把所有規則與六種車廂合在一起。遊戲沒有倒數、生命限制、購買、帳號、廣告請求，也不會因一次選錯就結束路線。",
        story: ["形狀線連接六座小車站，動物朋友會帶著有清楚符號的彩色包裹來搭車，每節橘色車廂的窗戶都有對應形狀。玩家扮演小車長，負責檢查符號並把乘客送到正確車廂。完成一條路線，代表所有等候朋友都安全上車，列車可以出發。", "不同規則代表鐵路較忙碌的區段。輪廓車廂行經薄霧，移動車廂停在會切換位置的月台；記憶乘客會暫時收起車站卡；驗票路線則要求先確認乘客。通過第 30 路線，代表完成最後一次混合車長檢查。"],
        systems: ["每條路線有四到八名乘客，取自六種真實形狀；畫面上只會有一節車廂符合目前乘客。", "答對會顯示短暫的上車動畫、增加進度並換下一名乘客；選錯只會溫和提醒，同一名乘客仍可繼續嘗試。", "輪廓車廂降低顏色提示；移動車廂在答對後重新排序；記憶乘客會藏起符號但可免費再看；驗票規則要求先點乘客。", "零次重試可得三星，少量重試得二星，更多重試得一星。技能報告只使用本次真實配對、首次答對、重試與上車人數。", "星星與最高解鎖路線只保存在目前瀏覽器。沒有帳號、排行榜、購買、廣告、生命值或倒數。", "每五條路線是一個車長檢查；第 30 路線會保存最終結果，不會出現不存在的第 31 路線。"],
        how: ["按下開始遊戲，在水平路線軌道上滑到已解鎖卡片。", "閱讀路線規則，觀察下方車站卡中的乘客形狀。", "先點乘客，再點相同符號的車廂；拖曳、滑鼠與鍵盤也能操作。", "記憶路線可回想藏起的符號，或再點乘客把它顯示出來。", "讓所有乘客上車即可保存星星，並只解鎖下一條路線。"],
        strategyTips: ["選車廂前先說出形狀名稱。", "輪廓車廂沒有明顯顏色時，比較尖角、邊與曲線。", "移動路線每次答對後都重新掃視整條軌道。", "記憶遊玩可把符號說出來，或用手在空中描出輪廓。", "驗票路線要先選乘客，再碰車廂。", "選錯不會關閉路線，停一下重新比較即可。"],
        progression: ["第 1–5 路線是直接配對，以二到四節明亮車廂介紹六種形狀，第 5 路線是首次車長檢查。", "第 6–10 路線使用輪廓車廂，曲線、角與尖端會比顏色更重要。", "第 11–15 路線加入移動車廂，每次成功上車後都會重新排序。", "第 16–20 路線會暫時藏起乘客；再點乘客即可無懲罰顯示同一形狀。", "第 21–25 路線加入先驗票、再配對的動作順序。", "第 26–30 路線混合舊規則；第 30 路線有六節車廂、八名乘客，並結合輪廓、移動、記憶與驗票。"],
        designNote: "難度成長來自改變玩家要觀察的線索，而不是縮小按鈕、增加壓力倒數或藏起正確點擊區。直接配對先建立形狀詞彙，輪廓、移動、記憶與順序再各加入一個能理解的判斷。固定邏輯畫面會在手機、平板、桌面與短橫向螢幕等比縮放；圖片車廂與形狀圖塊保留圖像為主的操作，文字只說明目前規則。配對與記憶等待只計算實際可見時間，切到其他 App 不會讓路線偷偷前進。它不像《動物知識小測》需要閱讀動物事實，也不像《動物園小幫手日》要依用途選照護工具；本作的核心始終是視覺等同。Kids 遊玩沒有廣告、購買、帳號、排名或診斷宣稱。",
        parent: "《動物形狀小火車》可用來談圓形、角、尖端、視覺配對、短期記憶、動作順序、專注與手眼協調。大人可以一起說出形狀名稱，或問孩子兩個輪廓哪裡不同。星星與技能報告只描述這次遊玩，不是學校成績、智力分數、發展診斷，也不會與其他孩子比較。進度只留在目前瀏覽器，清除網站資料可能使它消失；不需要兒童帳號，Kids 路線也不會請求廣告。",
        faq: [["共有多少條路線？", "共有 30 條可保存路線與六個章節，車長檢查位於第 5、10、15、20、25、30 路線。"], ["有哪些形狀？", "遊戲實際使用圓形、正方形、三角形、星形、菱形與愛心。"], ["乘客為什麼消失？", "記憶乘客路線會暫時藏起它；再點乘客即可無懲罰顯示同一形狀。"], ["車廂為什麼移動？", "移動車廂會在答對後重新排序，讓玩家再次觀察。"], ["車廂為什麼不接受選擇？", "驗票路線要求先點乘客，再選車廂。"], ["選錯會怎樣？", "同一名乘客會留在畫面，玩家可在溫和提示後再試。"], ["進度會保存嗎？", "星星與最高解鎖路線只保存在目前瀏覽器，不需要登入。"], ["手機與鍵盤都能玩嗎？", "可以，觸控、拖曳、滑鼠與鍵盤使用相同配對規則。"], ["Kids 頁面有廣告嗎？", "沒有，《動物形狀小火車》不會建立廣告請求或廣告保留區。"]],
      },
      "tiny-weather-rescue": {
        title: "動物幫幫隊", age: "6+", difficulty: "簡單", time: "每個任務 3–6 分鐘", skills: ["問題解決", "情境判斷", "專注力"],
        intro: "《動物幫幫隊》是一款免費雙語 Kids 看圖益智遊戲，共有 30 個可保存任務與六次幫手檢查。兔子、狐狸、貓熊、企鵝、獅子或無尾熊會在六個地點遇到下雨、淋濕、炎熱、黑暗、雷聲、飢餓、泥濘、寒冷或強風。玩家要從雨傘、毛巾、風扇、小燈、小屋、蘋果、雨靴與毯子中選擇。後段會移除可見道具文字、合併兩個線索、暫時藏起需求，或在答錯後改變道具位置。第 30 任務結合所有規則，沒有倒數、購買、帳號、生命限制或廣告請求。",
        story: ["六個動物社區共用一台裝著八種工具的小幫手車。天氣與日常需求會打斷路線，玩家要看懂情境並送出有用道具，讓小幫手車繼續前往下一站。", "這些是簡化的遊玩情境，不是專業野生動物照護教學。雙線索會要求判斷眼前優先需求：下雨又強風要先進小屋，已經淋濕則需要毛巾。完成第 30 任務代表通過最後一次綜合幫手檢查。"],
        systems: ["每個任務有四到六個情境與清楚目標；點道具或拖到動物身上都使用同一判定。", "答對增加一次幫忙；答錯會溫和提示，同一題三次答錯後自動前往下一個情境，避免卡住。", "圖片工具隱藏可見文字但保留無障礙名稱；雙線索需要一個優先答案；記憶需求可免費再看；換位工具會在答錯後重排。", "過關會在目前瀏覽器保存星星、最佳分數、遊玩次數、錯誤與下一個解鎖。技能報告只使用本次真實結果。", "沒有帳號、購買、倒數、排行榜、廣告請求、廣告保留區或正式能力評量。"],
        how: ["按開始遊戲，在水平任務軌道滑到已解鎖卡片。", "觀察動物、大型情境圖示與簡短需求。", "比較道具圖片，再點選或拖到動物身上。", "記憶需求消失時，可點動物無懲罰再看。", "達成目標即可保存星星，並只解鎖下一個任務。"],
        strategyTips: ["先說出情境，再看道具。", "圖片工具要比較物件形狀與顏色。", "出現兩個線索時，先判斷哪個需求最急。", "忘記需求就再看，不必猜。", "換位任務答錯後要重新掃視整個道具盤。", "把溫和提示當成排除不適合道具的資訊。"],
        progression: ["第 1–5 任務教一個清楚需求，第 5 任務是首次幫手檢查。", "第 6–10 任務移除可見道具文字，但保留無障礙名稱。", "第 11–15 任務把兩個情境線索合成一個優先選擇。", "第 16–20 任務短暫藏起需求，點動物即可恢復。", "第 21–25 任務會在錯誤後重新排列道具。", "第 26–30 任務結合圖片、雙線索、記憶與換位；第 30 任務有六個情境。"],
        designNote: "難度來自改變有用線索，而不是縮小按鈕或加入壓力倒數。直接需求先建立道具意義，再分別加入看圖、優先判斷、短期記憶與位置變化。固定邏輯畫面會在手機、平板、桌面與短橫向螢幕等比縮放；情境特效不會直接顯示答案，切到背景也不會讓回饋偷偷結束。它不同於《動物園小幫手日》的照護分類與順序流程，本作把環境情境連接到立即道具選擇。Kids 遊玩沒有廣告、帳號、購買、排名或診斷宣稱。",
        parent: "《動物幫幫隊》可用來談看圖辨識、因果、簡單優先順序、短期記憶、專注與手眼協調。真實動物需要合適棲地、飲食、專業照護與獸醫支援，遠比遊戲情境完整。星星與技能報告只是遊玩回饋，不是成績、智力分數、健康宣稱或發展評量。進度只在目前瀏覽器保存；不需要兒童帳號，Kids 路線也不會請求廣告。",
        faq: [["共有多少任務？", "共有 30 個可保存任務，幫手檢查位於第 5、10、15、20、25、30 任務。"], ["有哪些情境與道具？", "九種情境使用八種圖片道具。"], ["道具文字為什麼不見？", "圖片工具與綜合任務刻意依靠圖片，但無障礙名稱仍保留。"], ["兩個圖示代表什麼？", "要選出能處理兩個線索所描述之眼前優先需求的道具。"], ["需求消失怎麼辦？", "點動物即可無懲罰再次顯示。"], ["道具為什麼移動？", "換位任務會在答錯後重排。"], ["任務會卡住嗎？", "不會，同一情境三次答錯後會溫和前往下一題。"], ["進度會保存嗎？", "星星、分數與解鎖只保存在目前瀏覽器。"], ["Kids 頁面有廣告嗎？", "沒有，本作不會建立廣告請求或保留區。"]],
      },
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
        difficulty: "中等",
        time: "每關 3 分鐘",
        gameplay: "30 關動作生存戰役",
        genre: ["動作", "生存", "戰役", "動物"],
        skills: ["反應", "專注", "問題解決"],
        guideKicker: "WeightPlay 原創遊戲指南",
        guideTitleSuffix: "30 關戰役指南",
        noteTitle: "玩家與存檔說明",
        hideScoreBands: true,
        intro:
          "《動物水晶生存戰》是一款以移動、自動攻擊、臨時升級與可讀危險為核心的 30 關實時巡邏戰役。每關最多三分鐘，都有專屬名稱、金鑰目標與區域規則。每第五關會出現一隻擁有獨立角色圖、警示與反制方式的首領，不是把普通敵人放大。",
        story: [
          "水晶林地原本依靠六座水晶燈塔維持通道，金鑰則是調律燈塔的工具。日蝕核心從地底送出暗影脈衝後，金鑰散落在各條路線，熟悉的動物也變成影獸。水晶巡守員必須收回金鑰、安撫影獸，並讓每條通道在三分鐘內穩定下來。",
          "第 5、10、15、20、25、30 關是六個守衛檢查點。依序安撫根系追獵者、棱鏡飛蛾女王、荊棘野豬王、燼火黑豹、暴風巨鵬與日蝕巨像，才能重新連結六個區域。完成第 30 關代表六座燈塔重新同步，林地不再把暗影能量送回自己的根系。"
        ],
        systems: [
          "巡邏流程：先在橫向關卡列選擇已解鎖路線，關卡卡片會列出區域規則、金鑰目標與首領標記。點擊、拖曳、WASD 或方向鍵都可移動巡守員。角色會自動攻擊淡色範圍內最近的敵人，玩家主要負責間距、收集路線與閃避時機。",
          "金鑰與經驗：本關金鑰數是通關目標，同時會累積到主選單的巡守階級。影獸被安撫後會掉落本局經驗水晶；升級時遊戲會暫停，並從傷害、射程、速度、生命上限、攻擊間隔與拾取範圍中提供三個選項。",
          "敵人定位：影狐提供穩定壓力，黑豹追得較快，水晶野豬需要更多次攻擊。後期規則會讓特定敵人帶著可打破護盾、先預告再衝鋒、在倒下點留下熱區，或讓掉落水晶被風推移。",
          "成功與失敗：普通關必須在 3:00 結束時仍有生命，並收集卡片顯示的金鑰數。首領關還必須安撫該區守衛。生命歸零或漏掉目標都不會解鎖下一關，但本機紀錄與先前進度不會被刪除。"
        ],
        how: [
          "在 30 張橫向卡片中選擇已解鎖關卡，先讀取規則。",
          "用觸控、滑鼠、WASD 或方向鍵移動；攻擊會自動鎖定範圍內目標。",
          "收集本關要求的金鑰，並撿取經驗水晶選擇升級。",
          "虛線警示變成實心危險前，離開根系、火焰、閃電或走廊。",
          "每第五關除了金鑰目標，還要擊敗專屬首領。",
          "結果可以重試、繼續或回到關卡列。"
        ],
        strategyTips: [
          "先收集附近經驗，讓第一個升級影響更長的巡邏時間。",
          "把淡色攻擊環當成間距工具，讓目標保持在邊緣，不要站在影獸旁邊。",
          "面對衝鋒要橫向穿過它的路徑，不要沿直線往後逃。",
          "棱鏡飛蛾女王發亮時護盾會擋住攻擊，先存活再等待護盾消失。",
          "日蝕核心以跟隨移動安全環為優先，環外金鑰可等下一次脈衝再取。"
        ],
        progression: [
          "第 1-5 關建立金鑰路線、黑豹衝入與野豬夾擊。根系追獵者會在玩家位置放下綠色根系圈，留在裡面會減速並反覆受傷。",
          "第 6-10 關加入鏡像圈、旋轉碎片與可打破護盾。棱鏡飛蛾女王會在護盾與可受傷階段間輪替，並使用成對棱光警示。",
          "第 11-15 關以荊棘走廊、根系斑塊與有預告的野豬衝鋒改變移動。荊棘野豬王結合長距離衝鋒與根系圈。",
          "第 16-20 關使用橙色燃燒預告、高溫邊緣與倒下留火。燼火黑豹會跨場閃現，並燃燒每個落點。",
          "第 21-25 關以藍色圈預告閃電，強風還會推動掉落物。暴風巨鵬同時使用三個雷區與高速俯衝。",
          "第 26-30 關要跟隨移動光環，並輪流處理根系、火焰與閃電。日蝕巨像把三種警示放在安全環周圍，是全部移動與傷害時機的最終檢查。"
        ],
        designNote:
          "三分鐘足以讓一局出現數次升級選擇，又不會讓失敗後的重試代價過高。自動鎖定是為了移除手機上細小的瞄準控制，但玩家仍要持續決定距離、收集順序、逃生方向與首領可攻擊窗口。六個五關區域會依序導入、組合、再由首領檢查新規則。難度雖然提高，但主要變化來自護盾、衝鋒時機、警示圈、走廊、飄移資源與安全環，而不是只把敵人生命變大。",
        parent:
          "本機會保存已解鎖關卡、已通關關卡、各關最佳金鑰、累積金鑰、巡守階級與可選水晶護符。清除網站儲存或更換裝置可能會移除進度。水晶護符需二次確認，只會把起始生命從 7 提高到 8，並把拾取範圍從 54 提高到 68；它不是任何關卡的必要條件。結果回饋只是娛樂與本機進度資訊，不是能力測驗或診斷。",
        faq: [
          ["動物水晶生存戰有幾關？", "共有 30 個命名關卡與六個區域，每第五關都是首領檢查點。"],
          ["如何才算通關？", "生存到三分鐘結束並完成卡片的金鑰目標；首領關還要擊敗該區守衛。"],
          ["玩家需要手動瞄準嗎？", "不用。巡守員會自動攻擊，玩家主要負責移動、收集與升級選擇。"],
          ["為什麼攻擊沒有傷害棱鏡飛蛾女王？", "她發亮時有可見護盾，會擋住攻擊。護盾消失後才會扣除生命。"],
          ["漏掉金鑰目標會怎樣？", "這局金鑰與累積資料仍會記錄，但不會解鎖下一關，可立即重試。"],
          ["進度會保存嗎？", "會。關卡、金鑰、巡守階級與護符會保存在目前瀏覽器。"],
          ["水晶護符是必要的嗎？", "不是。它只是需要確認的可選起始屬性加成，30 關都可不使用。"],
          ["手機與電腦都能玩嗎？", "可以。手機使用點擊或拖曳，電腦還可使用 WASD 與方向鍵，關卡規則完全相同。"],
          ["這是正式能力測驗嗎？", "不是。能力回饋只是本機遊戲回饋，僅供娛樂參考。"],
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
  localizedGames["zh-Hant"]["campus-dash"] = {
    title: "\u8349\u539f\u9583\u96fb\u8dd1",
    age: "9+",
    difficulty: "\u6f38\u9032\u6311\u6230",
    time: "1-4 \u5206\u9418",
    gameplay: "\u8def\u7dda\u9583\u907f\u8dd1\u9177",
    genre: ["\u8dd1\u9177", "\u53cd\u61c9", "\u52d5\u7269"],
    skills: ["\u53cd\u61c9", "\u5c08\u6ce8", "\u624b\u773c\u5354\u8abf"],
    intro:
      "\u8349\u539f\u9583\u96fb\u8dd1\u662f\u4e00\u6b3e\u64c1\u6709 30 \u689d\u53ef\u5b58\u6a94\u8def\u7dda\u3001\u516d\u5927\u5340\u57df\u7684\u4e09\u7dda\u52d5\u7269\u8dd1\u9177\u3002\u661f\u722a\u72d0\u8981\u6062\u5fa9\u8349\u539f\u5c0e\u822a\u661f\uff0c\u73a9\u5bb6\u5fc5\u9808\u6839\u64da\u661f\u661f\u8ecc\u8de1\u3001\u96d9\u8def\u969c\u7919\u9580\u3001\u9ecf\u6ed1\u6ce5\u6f25\u8207\u5b88\u8b77\u8005\u9663\u578b\u6539\u8b8a\u8dd1\u6cd5\uff0c\u4e0d\u662f\u53ea\u6709\u901f\u5ea6\u4e0a\u5347\u3002",
    story: [
      "\u6668\u66e6\u8349\u539f\u3001\u91d1\u5408\u6b61\u8def\u53e3\u3001\u6fa4\u5149\u5f4e\u9053\u3001\u8d64\u5cfd\u8dd1\u9053\u3001\u6708\u6c34\u4fdd\u8b77\u5340\u8207\u738b\u51a0\u8349\u539f\u5171\u7528\u4e00\u689d\u5c0e\u822a\u661f\u8def\u7db2\u3002",
      "\u661f\u722a\u72d0\u5e36\u8457\u65b0\u661f\u661f\u901a\u904e\u6bcf\u689d\u8def\u7dda\uff0c\u4e26\u63a5\u53d7\u6591\u99ac\u3001\u72a7\u725b\u3001\u6cb3\u99ac\u3001\u98db\u9df9\u3001\u7345\u7fa4\u8207\u8c61\u738b\u51a0\u5b88\u8b77\u8005\u7684\u6aa2\u67e5\u3002\u901a\u904e\u7b2c 30 \u95dc\u4ee3\u8868\u516d\u5927\u5340\u57df\u91cd\u65b0\u9023\u7dda\u3002",
    ],
    how: [
      "\u5728\u6c34\u5e73 Stage \u8def\u7dda\u4e0a\u9078\u64c7\u5df2\u89e3\u9396\u95dc\u5361\uff0c\u5148\u95b1\u8b80\u76ee\u6a19\u8207\u8def\u7dda\u898f\u5247\u3002",
      "\u9ede\u64ca\u756b\u9762\u5de6\u53f3\u5074\u3001\u6ed1\u52d5\uff0c\u6216\u4f7f\u7528 A\u3001D \u8207\u65b9\u5411\u9375\uff0c\u6bcf\u6b21\u79fb\u52d5\u4e00\u689d\u8dd1\u9053\u3002",
      "\u6536\u96c6\u661f\u661f\u7d2f\u7a4d\u5206\u6578\u8207\u9023\u64ca\uff0c\u907f\u958b\u8def\u9310\u3001\u884c\u56ca\u3001\u66f8\u5806\u8207\u6c34\u6f25\u3002",
      "\u8a08\u6642\u7d50\u675f\u5f8c\uff0c\u9054\u6210\u5230\u9054\u7d42\u9ede\u3001\u6536\u96c6\u661f\u661f\u3001\u9023\u64ca\u3001\u4f4e\u78b0\u649e\u6216\u76ee\u6a19\u5206\u6578\u4e4b\u4e00\u3002",
      "\u6210\u529f\u6703\u5b58\u6a94\u4e26\u89e3\u9396\u4e0b\u4e00\u95dc\uff1b\u518d\u8dd1\u4e00\u6b21\u6703\u91cd\u8a66\u76ee\u524d\u95dc\u5361\u3002",
    ],
    systems: [
      "\u958b\u653e\u8349\u5f91\u7528\u55ae\u500b\u969c\u7919\u6559\u5b78\uff1b\u661f\u661f\u8ecc\u8de1\u589e\u52a0\u6536\u96c6\u7dda\uff1b\u96d9\u8def\u969c\u7919\u9580\u53ea\u7559\u4e00\u689d\u5b89\u5168\u8def\uff1b\u9ecf\u6ed1\u6ce5\u6f25\u6703\u77ed\u66ab\u653e\u6162\u63db\u9053\uff1b\u5b88\u8b77\u8005\u9663\u578b\u6709\u53ef\u89c0\u5bdf\u7684\u56fa\u5b9a\u5b89\u5168\u7bc0\u594f\u3002",
      "\u661f\u661f\u57fa\u790e\u5206\u6578\u70ba 50 \u4e58\u4ee5\u76ee\u524d\u500d\u7387\u3002\u9023\u7e8c\u6536\u96c6\u6703\u63d0\u9ad8\u4e0b\u4e00\u9846\u661f\u7684\u500d\u7387\uff1b\u78b0\u5230\u969c\u7919\u6703\u6263 80 \u5206\u4e26\u91cd\u7f6e\u70ba x1\u3002",
      "\u95dc\u5361\u76ee\u6a19\u5305\u542b\u5230\u9054\u7d42\u9ede\u3001\u661f\u661f\u6578\u91cf\u3001\u6700\u4f73\u9023\u64ca\u3001\u78b0\u649e\u4e0a\u9650\u8207\u76ee\u6a19\u5206\u6578\u4e94\u7a2e\u3002",
      "\u95dc\u5361\u9032\u5ea6\u8207\u672c\u6a5f\u524d 5 \u540d\u5206\u958b\u5132\u5b58\u5728\u9019\u500b\u700f\u89bd\u5668\uff0c\u4e0d\u9700\u8981\u767b\u5165\u3002",
    ],
    progression: [
      "\u7b2c 1-5 \u95dc\u6559\u5b78\u969c\u7919\u3001\u661f\u8ecc\u3001\u96d9\u9580\u8207\u9023\u64ca\uff0c\u6700\u5f8c\u662f\u6591\u99ac\u6aa2\u67e5\u3002",
      "\u7b2c 6-10 \u95dc\u4ea4\u66ff\u6536\u96c6\u8207\u4f4e\u78b0\u649e\u9580\u9663\uff0c\u6700\u5f8c\u662f\u72a7\u725b\u6aa2\u67e5\u3002",
      "\u7b2c 11-15 \u95dc\u52a0\u5165\u9ecf\u6ed1\u6ce5\u6f25\uff0c\u6700\u5f8c\u662f\u6cb3\u99ac\u6c34\u9053\u6aa2\u67e5\u3002",
      "\u7b2c 16-20 \u95dc\u7d50\u5408\u5206\u6578\u3001\u9023\u64ca\u3001\u91cd\u8907\u9580\u9663\u8207\u5b89\u5168\u661f\u63d0\u793a\uff0c\u6700\u5f8c\u662f\u98db\u9df9\u6aa2\u67e5\u3002",
      "\u7b2c 21-25 \u95dc\u6df7\u5408\u6ce5\u6f25\u3001\u9580\u9663\u8207\u591c\u9593\u661f\u93c8\uff0c\u6700\u5f8c\u662f\u7345\u7fa4\u6aa2\u67e5\u3002",
      "\u7b2c 26-30 \u95dc\u5fa9\u7fd2\u5168\u90e8\u898f\u5247\uff1b\u8c61\u738b\u51a0\u5b88\u8b77\u8005\u6703\u6df7\u5408\u56db\u7a2e\u9032\u968e\u898f\u5247\u4e26\u8981\u6c42\u6536\u96c6 15 \u9846\u661f\u661f\u3002",
    ],
    strategyTips: [
      "\u770b\u96d9\u9580\u4e2d\u9593\u7684\u7a7a\u8def\uff0c\u4e0d\u8981\u53ea\u76ef\u8457\u969c\u7919\u3002",
      "\u4f4e\u78b0\u649e\u95dc\u5361\u8981\u5148\u4fdd\u7559\u5bb9\u932f\uff0c\u4e0d\u5fc5\u70ba\u4e86\u975e\u5fc5\u8981\u661f\u661f\u5192\u96aa\u3002",
      "\u78b0\u5230\u6ce5\u6f25\u5f8c\u8981\u66f4\u65e9\u8f38\u5165\u63db\u9053\uff0c\u56e0\u70ba\u79fb\u52d5\u6703\u77ed\u66ab\u8b8a\u6162\u3002",
      "\u7528\u5b88\u8b77\u8005\u7684\u524d\u5169\u7d44\u9580\u9663\u627e\u51fa\u5b89\u5168\u8dd1\u9053\u7bc0\u594f\u3002",
      "\u78b0\u649e\u6703\u91cd\u7f6e\u4e0b\u4e00\u9846\u661f\u7684\u500d\u7387\uff0c\u4f46\u4e0d\u6703\u522a\u9664\u672c\u5c40\u5df2\u9054\u6210\u7684\u6700\u4f73\u9023\u64ca\u3002",
    ],
    designNote:
      "\u4e09\u689d\u8dd1\u9053\u8b93\u624b\u6a5f\u4e0a\u7684\u5b89\u5168\u8def\u5bb9\u6613\u8fa8\u8b58\uff0c\u6bcf\u6b21\u8f38\u5165\u53ea\u79fb\u4e00\u683c\u3002\u8def\u7dda\u6642\u9593\u70ba 28-45 \u79d2\uff0c\u65b9\u4fbf\u5feb\u901f\u91cd\u8a66\u3002\u6df1\u5ea6\u4f86\u81ea\u9580\u9663\u7684\u7a7a\u9593\u95b1\u8b80\u3001\u661f\u8ecc\u7684\u98a8\u96aa\u53d6\u6368\u3001\u6ce5\u6f25\u7684\u6062\u5fa9\u6642\u6a5f\u3001\u4e0d\u540c\u901a\u95dc\u76ee\u6a19\u8207\u5b88\u8b77\u8005\u7684\u7de8\u6392\u9663\u578b\u3002\u9019\u662f Kids \u7121\u5ee3\u544a\u904a\u6232\uff0c\u4e0d\u6703\u5efa\u7acb\u5ee3\u544a\u4fdd\u7559\u5340\u3002",
    parent:
      "\u9019\u6b3e\u904a\u6232\u5efa\u8b70 9+\uff0c\u56e0\u70ba\u5f8c\u671f\u6703\u7d50\u5408\u5feb\u901f\u8dd1\u9053\u5224\u65b7\u3001\u95dc\u5361\u76ee\u6a19\u8207\u5206\u6578\u58d3\u529b\u3002\u6280\u80fd\u5831\u544a\u53ea\u986f\u793a\u672c\u5c40\u771f\u5be6\u63db\u9053\u3001\u661f\u661f\u3001\u78b0\u649e\u8207\u6700\u4f73\u9023\u64ca\uff0c\u4e0d\u662f\u8a3a\u65b7\u3001\u767c\u5c55\u8a55\u91cf\u6216\u5152\u7ae5\u9593\u6bd4\u8f03\u3002",
    faq: [
      ["\u4e00\u5171\u6709\u5e7e\u95dc\uff1f", "\u5171\u6709 30 \u689d\u53ef\u5b58\u6a94\u8def\u7dda\uff0c\u7b2c 5\u300110\u300115\u300120\u300125\u300130 \u95dc\u662f\u5b88\u8b77\u8005\u6aa2\u67e5\u3002"],
      ["\u6bcf\u95dc\u76ee\u6a19\u90fd\u4e00\u6a23\u55ce\uff1f", "\u4e0d\u4e00\u6a23\u3002\u6709\u5230\u9054\u7d42\u9ede\u3001\u661f\u661f\u6578\u91cf\u3001\u9023\u64ca\u3001\u4f4e\u78b0\u649e\u8207\u76ee\u6a19\u5206\u6578\u4e94\u7a2e\u3002"],
      ["\u9ecf\u6ed1\u6ce5\u6f25\u6709\u4ec0\u9ebc\u5f71\u97ff\uff1f", "\u6703\u6263\u5206\u3001\u91cd\u7f6e\u500d\u7387\uff0c\u4e26\u5728\u6ce5\u6f25\u8def\u7dda\u4e0a\u77ed\u66ab\u653e\u6162\u63db\u9053\u3002"],
      ["\u96d9\u8def\u969c\u7919\u9580\u600e\u9ebc\u901a\u904e\uff1f", "\u5169\u500b\u969c\u7919\u6703\u540c\u6642\u51fa\u73fe\uff0c\u53ea\u7559\u4e00\u689d\u7a7a\u8def\uff1b\u5f8c\u671f\u6709\u4e9b\u8def\u7dda\u6703\u7528\u661f\u661f\u6a19\u793a\u5b89\u5168\u53e3\u3002"],
      ["\u6703\u5b58\u54ea\u4e9b\u9032\u5ea6\uff1f", "\u9019\u500b\u700f\u89bd\u5668\u6703\u5b58\u5df2\u89e3\u9396\u3001\u5df2\u5b8c\u6210\u8207\u76ee\u524d\u8def\u7dda\uff0c\u4ee5\u53ca\u672c\u6a5f\u524d 5 \u540d\u5206\u6578\u3002"],
      ["\u624b\u6a5f\u548c\u96fb\u8166\u90fd\u80fd\u73a9\u55ce\uff1f", "\u53ef\u4ee5\u3002\u624b\u6a5f\u652f\u63f4\u9ede\u64ca\u8207\u6ed1\u52d5\uff0c\u96fb\u8166\u652f\u63f4 A\u3001D \u8207\u65b9\u5411\u9375\u3002"],
      ["\u9700\u8981\u767b\u5165\u6216\u4ed8\u8cbb\u55ce\uff1f", "\u4e0d\u9700\u8981\u3002\u904a\u6232\u53ef\u514d\u8cbb\u5728\u700f\u89bd\u5668\u904a\u73a9\u3002"],
      ["\u70ba\u4ec0\u9ebc\u5efa\u8b70 9+\uff1f", "\u5f8c\u671f\u540c\u6642\u6709\u5feb\u901f\u5224\u65b7\u3001\u95dc\u5361\u76ee\u6a19\u8207\u5206\u6578\u58d3\u529b\uff1b\u5e74\u9f61\u53ea\u662f\u5efa\u8b70\uff0c\u4e0d\u662f\u80fd\u529b\u5206\u7d1a\u3002"],
      ["\u6280\u80fd\u5831\u544a\u662f\u6b63\u5f0f\u6e2c\u9a57\u55ce\uff1f", "\u4e0d\u662f\uff0c\u5b83\u53ea\u6574\u7406\u672c\u5c40\u771f\u5be6\u904a\u6232\u4e8b\u4ef6\u3002"],
    ],
  };
  localizedGames["zh-Hant"]["snack-blocks"] = {
    title: "動物零食方塊",
    age: "9+",
    difficulty: "漸進挑戰",
    time: "3-8 分鐘",
    gameplay: "三消關卡益智",
    genre: ["益智", "邏輯", "動物"],
    skills: ["邏輯", "問題解決", "專注"],
    intro: "動物零食方塊共有 30 個可存檔關卡。六個章節會改變棋盤可出現的零食組合與過關目標，玩家要在 7×10 棋盤上規劃每一次交換，而不是只追求越來越高的數字。",
    story: [
      "零食世界的動物要把同一張野餐桌從莓果田運到皇冠盛宴。每次三消代表整理好一批食物，六個地區則分別準備宴會所需的不同零食。",
      "第 5、10、15、20、25、30 關是野餐鈴、烘焙坊大門、花園鼓、工坊鐘、橋上宴會與皇冠餐桌檢查。通過第 30 關代表完整宴席送達終點。",
    ],
    how: [
      "在水平 Stage 軌道選擇已解鎖關卡，先閱讀目標與移動步數。",
      "點選一個零食再點相鄰零食，或向相鄰方向拖曳；有效交換必須立刻形成三個以上相同零食。",
      "消除後零食會下落並從上方補入；補位自動形成的消除會建立連鎖倍率。",
      "用完整步數完成目標，成功後才會存檔並解鎖下一關。",
    ],
    systems: [
      "基本消除每格 12 分，再乘上目前連鎖層數。無效交換會復原且不消耗步數。",
      "目標包含分數、單一零食、雙零食、連鎖、單次大消除，以及同時要求收集與分數的檢查關。",
      "每關指定四、五或六種零食池，部分關卡會移除兩種零食，讓連鎖規劃方式產生變化。",
      "已解鎖關卡與個人最佳成績只儲存在目前瀏覽器，不需要登入。",
    ],
    progression: [
      "第 1-5 關在野餐小徑教學分數、收集與四格消除。",
      "第 6-10 關在餅乾渡口加入二段連鎖、五格消除與雙零食收集。",
      "第 11-15 關在葡萄花園交替使用縮減與擴大的零食池。",
      "第 16-20 關在起司工坊要求三段連鎖與更精準的大消除。",
      "第 21-25 關在蝴蝶餅橋提高雙收集壓力，並更常使用全部六種零食。",
      "第 26-30 關的皇冠盛宴混合所有規則，最後一關同時要求糖果收集與分數。",
    ],
    tips: [
      "優先觀察棋盤下方；越低的消除會移動越多零食，也更容易形成連鎖。",
      "連鎖關可先在上方留下接近完成的排列，再消除下方支撐。",
      "檢查關要同時看收集與分數進度，避免只完成其中一半。",
    ],
    designNote: "直向棋盤讓手機上的動物零食圖案維持清楚，也保留足夠的垂直連鎖空間。30 關的深度來自零食池與目標類型改變，不是只有數值提高。觸控、拖曳與鍵盤都使用同一組原生方塊按鈕；Kids 版本沒有計時壓力，也不會發出廣告請求。",
    parent: "本遊戲建議 9+ 與家庭玩家，因為後期會同時處理雙目標、零食池變化與連鎖規劃。技能報告只是本局遊戲結果的友善整理，不是智力測驗、診斷、學校評量或兒童間比較。",
    faq: [
      ["一共有幾關？", "共有 30 關，並在第 5、10、15、20、25、30 關設置六個檢查關。"],
      ["為什麼交換後會移回去？", "有效交換必須立刻形成三消；無效交換會復原且不扣步數。"],
      ["什麼是連鎖？", "消除下落或補位後自動形成的新消除就是連鎖，連續層數會提高分數倍率。"],
      ["雙零食目標怎麼算？", "畫面指定的兩種零食都會計入同一個收集目標。"],
      ["檢查關有什麼不同？", "必須同時完成指定零食數量與分數目標。"],
      ["進度會保存嗎？", "已解鎖關卡與最佳成績會保存在目前瀏覽器。"],
      ["手機和電腦都能玩嗎？", "可以，支援觸控、指標拖曳與鍵盤方塊按鈕。"],
      ["需要登入或付費嗎？", "不需要；Kids 版本免費、免登入且不會發出廣告請求。"],
      ["技能報告是正式測驗嗎？", "不是，它只整理本局分數與目標結果。"],
    ],
  };
  localizedGames["zh-Hant"]["fruit-merge"] = {
    title: "動物合成塔",
    age: "6+",
    difficulty: "漸進挑戰",
    time: "3-8 分鐘",
    gameplay: "物理合成挑戰",
    genre: ["益智", "物理", "動物"],
    skills: ["邏輯", "問題解決", "手眼協調"],
    intro: "動物合成塔保留原本的自由模式，並新增 30 個可存檔物理挑戰。六個章節會改變瞄準範圍、側風、重力、生成順序與成功條件，但所有模式都使用同一套動物球物理合成。",
    story: [
      "動物祭典的遊行讓燈球散落在六個地區。兩顆相同動物球接觸後會合成下一階，玩家要重新堆起從老鼠球到獅王球的皇冠塔。",
      "草原起步、森林窄窗、河流氣流、山岳重力、月光隊列與皇冠祭典各自教一種物理規則。通過第 30 關代表獅王餐桌已經能安全加入最後遊行。",
    ],
    how: [
      "選擇開始遊戲進入水平挑戰軌道，或選擇自由模式進行無落球上限的最高分挑戰。",
      "用觸控、滑鼠或左右方向鍵瞄準，再用觸控放開、空白鍵或 Enter 落球。",
      "讓兩顆相同動物球接觸，合成下一階動物並取得分數。",
      "保持動物塔低於紅線，並在落球額度結束前完成分數、動物階級、合成次數、連擊或雙重目標。",
    ],
    systems: [
      "十一種動物構成完整合成鏈；短時間內連續合成會把倍率提高到 x5。",
      "森林窄窗縮小可用瞄準範圍；河流氣流對移動中的球施加來回側向力；山岳重力提高 Matter.js 重力；月光隊列採用固定生成節奏。",
      "每五關是祭典檢查關，必須同時達成指定動物階級與分數。第 30 關會混合全部四種進階規則。",
      "挑戰解鎖、完成狀態、目前選擇與最佳分數儲存在瀏覽器；自由模式的圖鑑與最佳紀錄分開保存。",
    ],
    progression: [
      "第 1-5 關使用開放箱，教學基本合成、動物階級、連擊與分數。",
      "第 6-10 關縮小森林窄窗的落點範圍。",
      "第 11-15 關加入方向會變化的河流氣流。",
      "第 16-20 關使用更快落地的山岳重力。",
      "第 21-25 關用固定隊列練習提前數步安排落點。",
      "第 26-30 關逐步混合規則，最後在獅王餐桌同時啟用窄窗、風、重力與固定隊列。",
    ],
    tips: [
      "讓大型動物保持在低處與中央，並替暫時無法配對的小球保留一條空路。",
      "有側風時先看移動方向，再決定是否投入狹窄落點。",
      "固定隊列可以讓你提前兩到三顆準備落點，不必只處理眼前一球。",
    ],
    designNote: "遊戲使用固定 720×1040 Matter.js 棋盤，放在等比縮放的 Kids Canvas 內，因此手機與電腦的物理條件相同。30 關透過可執行的瞄準、力、重力、隊列變化與五種成功條件建立深度，不是只提高分數。Kids 版本不發出廣告請求，進度只留在目前瀏覽器。",
    parent: "本遊戲建議 6+ 與家庭玩家。後期會要求預測移動、記住固定隊列並適應物理條件變化。技能報告只是本局遊戲的友善整理，不是智力測驗、診斷、發展評量或學校成績。",
    faq: [
      ["一共有幾個挑戰？", "共有 30 關，並在第 5、10、15、20、25、30 關設置祭典檢查關。"],
      ["挑戰模式和自由模式有什麼不同？", "挑戰模式有目標、落球額度、存檔解鎖與指定物理規則；自由模式沒有落球上限。"],
      ["河流氣流怎麼運作？", "它會對箱內移動中的球施加方向週期變化的側向力。"],
      ["山岳重力改變什麼？", "Matter.js 重力提高，球會更快落地，也更難依靠緩慢滾動修正。"],
      ["固定隊列是什麼？", "動物會依照已知的老鼠、兔兔與狐狸節奏出現，方便提前規劃。"],
      ["挑戰進度會保存嗎？", "會，解鎖、完成、選擇與最佳分數會留在目前瀏覽器。"],
      ["手機和電腦都能玩嗎？", "可以，支援觸控、滑鼠與鍵盤操作。"],
      ["需要登入或付費嗎？", "不需要；Kids 版本免費、免登入且不發出廣告請求。"],
      ["技能報告是正式測驗嗎？", "不是，它只整理本局遊戲結果。"],
    ],
  };
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
    return window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || document.documentElement.lang || "en";
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
    return ["zh-Hant", "zh-Hans"].includes(locale()) && age === "Family" ? (locale() === "zh-Hans" ? "亲子" : "親子") : age;
  }

  function localizeDifficulty(difficulty) {
    if (!["zh-Hant", "zh-Hans"].includes(locale())) return difficulty;
    const map = {
      Easy: "\u7c21\u55ae",
      Medium: "\u4e2d\u7b49",
      Hard: "\u56f0\u96e3",
      Relaxed: "\u8f15\u9b06",
    };
    const localized = map[difficulty] || difficulty;
    return locale() === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(localized) || localized : localized;
  }

  Object.assign(localizedGames["zh-Hant"]["animal-quiz"], {
    title: "動物小博士",
    age: "6+",
    difficulty: "簡單",
    time: "5-8 分鐘",
    skills: ["動物知識", "記憶", "閱讀"],
    intro: "《動物小博士》是一款免費雙語 Kids 知識遊戲，共有 30 個可存檔關卡，每關包含十種不重複的動物。20 種動物題庫從獅子、大象、長頸鹿、斑馬，到企鵝、鯨魚、熊貓、無尾熊、貓頭鷹、青蛙、寵物與農場動物。前期以清楚肖像搭配一則外觀線索；後期會模糊圖片、改成剪影、增加第四個選項，並組合棲地、行為、食物與外觀事實。每五關是一次小博士檢核，重新運用前面學過的線索。遊戲沒有倒數，答錯也不會結束關卡。",
    story: [
      "這段旅程是一系列動物觀察任務，不是救援或戰鬥。玩家扮演觀察員，每答對一題，就替野外筆記完成一筆辨識紀錄。畫面中的動物、名稱與文字線索永遠指向同一個答案。完成十次辨識會結束目前章節、儲存通關並解鎖下一個觀察任務。",
      "每個選擇都有真實事實可推理。獅子可以從鬃毛、非洲草原與群體生活判斷；企鵝可由寒冷海岸、魚類食物與群聚取暖判斷；大象則可由長鼻、植物性食物與噴水行為辨認。完成第 30 關，代表玩家走完六組學習內容並通過最後的混合線索檢核。",
    ],
    systems: [
      "每關有十種不重複的目標動物。入門關提供三個名稱；後期的食物、混合與小博士關提供四個選項，但不會縮小按鈕。",
      "一般肖像練習直接辨識；神祕圖片會刻意柔化細節；剪影會移除顏色，讓輪廓與文字線索變得更重要。圖片仍保留可理解的無障礙名稱。",
      "外觀線索描述看得見的特徵，棲地線索說明生活地點，行為線索描述動作或群體習性，食物線索則說明飲食。後期會同時提供兩到三類線索。",
      "答錯時會收到友善提示，題目仍可繼續作答。答對後，選項會在短暫且只計算前景時間的學習停頓中鎖定，顯示動物知識再進到下一題。",
      "完成十題後，通關、最佳結果與下一關解鎖都會儲存在目前瀏覽器。結果畫面可以重玩，也可以回到剛完成的關卡卡片。",
      "遊戲沒有帳號、排行榜、購買、倒數、生命或正式成績。完成 30 關就是完整目標；重玩可以複習並再次挑戰十題全對。",
    ],
    how: [
      "按下開始遊戲，在橫向關卡列滑到已解鎖的觀察任務。",
      "觀察清楚肖像、神祕圖片或剪影，並讀完圖片下方的每一則線索。",
      "把證據與三個或四個動物名稱比較，再選出一個答案。",
      "答錯可參考提示再試一次；答對後先閱讀短暫顯示的動物知識。",
      "辨識全部十種動物即可儲存通關，並且只解鎖下一關。",
    ],
    strategyTips: [
      "清楚圖片關可以先說出一項外觀特徵，再閱讀答案。",
      "神祕圖片關不要只猜柔化後的顏色，要優先相信棲地文字。",
      "遇到剪影時，比較長鼻、長頸、甲殼、耳朵與身體輪廓。",
      "小博士檢核要讀完所有線索；單一線索可能符合多種動物，組合後才會指向一個答案。",
      "四選一時，先排除不可能住在該棲地或不吃該食物的動物。",
      "答對後停一下閱讀動物知識，不要急著略過。",
    ],
    progression: [
      "第 1-5 關「圖片入門」以清楚肖像與外觀特徵建立動物題庫；第 5 關增加第二則線索與第四個選項。",
      "第 6-10 關「棲地家園」使用柔化的神祕圖片，要求重視生活地點；第 10 關組合棲地與外觀。",
      "第 11-15 關「特徵偵探」改用剪影練習輪廓辨識；第 15 關用混合線索與四個選項收尾。",
      "第 16-20 關「動物行動」聚焦移動與群體行為；第 20 關把行為與棲地放在同一題。",
      "第 21-25 關「食物與家族」固定使用四個選項和飲食線索；第 25 關再加入外觀證據。",
      "第 26-30 關「小博士綜合」以神祕圖片或剪影搭配兩則線索。第 30 關使用四個選項、剪影，以及外觀、棲地、行為三則相關線索。",
    ],
    designNote: "每關十題能讓同一學習主題重複出現，又不會讓 Kids 遊玩變成漫長考試。難度是藉由改變哪些證據仍然有用來成長，不會縮小目標或增加時間壓力。模糊與剪影是學習模式，不是隱藏點擊區；大型原生答案按鈕同時支援觸控、滑鼠與鍵盤。固定邏輯版面會在手機、平板、短橫向與電腦等比例縮放。學習停頓只計算看得到的遊玩時間，所以切換應用程式不會偷偷跳過知識。和 WeightPlay 的配對或動作遊戲不同，本作的核心決策完全來自事實證據。Kids 路線沒有廣告請求、廣告保留區、帳號、購買、競爭排名或診斷宣稱。",
    parent: "《動物小博士》可以協助親子討論動物名稱、棲地、食物、外觀與行為。仍在學習閱讀的孩子可以由大人朗讀線索，再問孩子是根據哪一項證據作答。星星與能力報告只描述這次遊玩，不是學校成績、智力測驗、發展診斷，也不會和其他孩子比較。進度只留在目前瀏覽器，清除本機儲存資料後可能消失。遊戲不需要兒童個人資料，Kids 路線也不會請求廣告。",
    faq: [
      ["遊戲共有幾關、每關幾題？", "共有 30 個可存檔關卡，每關有十種不重複的動物題目。"],
      ["為什麼動物圖片有時模糊或變黑？", "棲地章節使用神祕圖片；特徵偵探與後期檢核使用剪影，讓事實與輪廓更重要。"],
      ["答錯會發生什麼事？", "題目會保留，玩家可以再選另一個答案，不會失去進度或直接結束關卡。"],
      ["為什麼有些關卡有四個選項？", "食物、混合與小博士關會在玩家熟悉動物題庫後加入第四個名稱。"],
      ["遊戲會儲存進度嗎？", "已解鎖關卡、完成卡片與最佳結果只會儲存在目前瀏覽器。"],
      ["手機和鍵盤都能玩嗎？", "可以，同一套固定版面支援觸控、滑鼠與鍵盤操作。"],
      ["需要帳號或登入嗎？", "不需要；但清除瀏覽器儲存資料可能移除本機進度。"],
      ["Kids 頁面會顯示廣告嗎？", "不會，《動物小博士》不會建立廣告請求或廣告保留區。"],
      ["能力報告是正式測驗嗎？", "不是，它只是支持性的遊玩回饋，不是學校、智力、健康或發展評量。"],
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

  games["animal-gearpack-expedition"] = {
    title: "Animal Gearpack Expedition",
    difficulty: "Medium to Hard",
    time: "5-12 minutes per expedition",
    gameplay: "Spatial Inventory Expedition",
    genre: ["Strategy", "Spatial Inventory", "Roguelite", "Animal"],
    skills: ["Planning", "Spatial Reasoning", "Adaptation"],
    guideKicker: "WeightPlay Original Game Guide",
    guideTitleSuffix: "Game Guide",
    noteTitle: "Player and Save Information",
    hideScoreBands: true,
    intro: "Animal Gearpack Expedition is a 30-stage spatial-inventory strategy adventure starring Gear Horn Rux. Fit equipment into an eleven-column, seven-row pack, connect Forge, Nature, Crystal, and Moon materials, and survive five encounters per stage. Six regions introduce different packing pressures, and every fifth stage ends with a Guardian whose mechanic changes what a safe build looks like.",
    story: [
      "Gearwood's caravan road once linked six workshops. The route failed when its vaults reacted to the cargo: roots blocked the forest, crystals split the quarry, machines restarted in Clockwork Hollow, the foundry overheated, storm coils charged the observatory, and the Eclipse Vault sealed every recovered shipment behind a final mechanical army.",
      "Gear Horn Rux is the caravan packmaster, while Moon Cap Orla follows with a travelling shop. Clearing a stage reopens one section of road. Defeating the Root Guardian, Crystal Warden, Hollow Colossus, Furnace Leviathan, Tempest Archon, and Eclipse Hoardmaster restores all six regions and releases the stored cargo."
    ],
    systems: [
      "The gearpack has eleven columns and seven rows. Items use different cell shapes and may be rotated before placement. Attack deals damage, Armor reduces a counterattack, and Heal restores Health before incoming damage. Two different pieces create a material link when matching-tag cells touch horizontally or vertically; every active link adds two Attack and one Defense.",
      "Health persists through the five encounters in one expedition, but every item can be picked up and rearranged between fights. The tray and placed gear share a twelve-item limit. After a victory, take one of three loot items or continue without loot. Gold earned in that expedition buys Orla's stock or comes from selling unwanted gear.",
      "Special enemies change the layout problem. Shields absorb opening damage, Ambushers strike before the normal exchange, isolation adds damage for unlinked items, corrosion removes Defense over time, top-row heat punishes occupied ventilation cells, overload suppresses the pack's most common tag, and rotating seals cycle among all four materials.",
      "Workshop XP, discoveries, completed stages, and the next unlocked stage are stored locally. Workshop levels provide a modest Health benefit. Diamonds are optional shared currency used only for one separately confirmed replacement of Orla's three shop offers; free progression does not require them."
    ],
    how: [
      "Choose an unlocked card from the 30-stage horizontal expedition rail and read its route rule.",
      "Select equipment from the tray, rotate it when useful, and place it on a valid green cell in the 11 x 7 pack.",
      "Connect matching Forge, Nature, Crystal, or Moon pieces, then start the encounter when the current build is ready.",
      "After each victory, choose or skip loot and rebuild the pack before the next enemy. Visit Orla when the route reaches its shop stop.",
      "Defeat the fifth encounter to save the stage. Stages 5, 10, 15, 20, 25, and 30 are Guardian checkpoints."
    ],
    strategyTips: [
      "Read the route rule before building. One large same-tag cluster is weak when that material is suppressed or overloaded.",
      "Against isolation, make every important item touch a matching tag. Against top-row heat, keep the first row open and link lower in the pack.",
      "Corrosion rewards a shorter fight because Defense loses value each turn. Shields instead reward one large opening strike after the barrier is removed.",
      "Do not accept every loot item. Empty space can be more valuable than a weak object when Orla's shop or a Guardian is still ahead."
    ],
    progression: [
      "Stages 1-5 teach links, rotation, shields, opening strikes, and isolation. The Root Guardian regrows Health unless the pack contains an active Nature link.",
      "Stages 6-10 add Moon suppression and larger prism barriers. Crystal Warden begins behind an eighteen-point shield and reflects shards after its core is exposed.",
      "Stages 11-15 combine rage, isolation, and corrosion. Hollow Colossus alternates a braced phase that reduces Rux's strike with a rage phase that strengthens its counterattack.",
      "Stages 16-20 add top-row heat and stronger corrosion. Furnace Leviathan requires ventilation space, recovery, and enough damage to avoid a long degrading fight.",
      "Stages 21-25 combine opening strikes with overload of the most common material. Tempest Archon adds chain-lightning damage for every isolated item.",
      "Stages 26-30 rotate material seals and mix all previous pressures. Eclipse Hoardmaster combines seal rotation with isolation, so the final pack needs several useful link families and no loose equipment."
    ],
    designNote: "Five encounters give one pack enough time to evolve without making each attempt excessively long. Combat resolves automatically so touch, pointer, and keyboard players can focus on the distinctive decision: fitting shapes and links around the next enemy rule. Difficulty grows through six mechanical families rather than one numeric curve. Each Guardian tests a learned spatial habit—Nature links, shield breaking, phase timing, ventilation, compact linking, or seal adaptation—so later stages ask for new plans instead of only larger statistics.",
    parent: "Basic play does not require an account. Unlocked and completed stages, Workshop XP, discoveries, and best encounter progress are stored in this browser; clearing site storage or changing devices may remove that profile. Gold and the current loadout are temporary. Diamonds are optional and require confirmation at Orla's refresh.",
    faq: [
      ["How many stages are included?", "There are 30 authored stages across six regions, with Guardian checkpoints at Stages 5, 10, 15, 20, 25, and 30."],
      ["How do material links work?", "Matching-tag cells from two different pieces must touch horizontally or vertically. Active links add Attack and Defense."],
      ["Why did a link stop working?", "Moon suppression, overload, and rotating seals can disable one material. The active rule appears above the Battle."],
      ["Can I repack between enemies?", "Yes. Loot is followed by a free preparation phase before the next encounter."],
      ["What happens when the pack is full?", "Continue without loot or sell a tray item. A full pack never blocks progress."],
      ["Are Diamonds required?", "No. They only replace Orla's current stock after a separate confirmation."],
      ["What progress is saved?", "Unlocked and completed stages, Workshop XP, discoveries, and best progress are stored locally."],
      ["Does it support keyboard play?", "Yes. The pack exposes a labelled 7-row by 11-column grid with arrow-key navigation."]
    ]
  };
  localizedGames["zh-Hant"]["animal-gearpack-expedition"] = {
    title: "動物裝備行囊遠征",
    difficulty: "中等至困難",
    time: "每次遠征約 5 至 12 分鐘",
    gameplay: "空間行囊策略遠征",
    genre: ["策略", "空間行囊", "Roguelite", "動物"],
    skills: ["規劃", "空間推理", "應變"],
    guideKicker: "WeightPlay 原創遊戲指南",
    guideTitleSuffix: "遊戲指南",
    noteTitle: "玩家與存檔說明",
    hideScoreBands: true,
    intro: "《動物裝備行囊遠征》是由齒輪角魯克斯主演的 30 關空間行囊策略遊戲。玩家要把裝備排入 11 欄、7 排的旅行行囊，連結鍛造、自然、水晶與月光材質，並在每關通過五場固定遭遇。六個區域各自加入不同的配裝壓力，每五關則由一位會真正改變安全排法的守關首領收尾。",
    story: [
      "齒輪森林的商隊道路原本連接六座工坊。儲藏庫開始對貨物產生異常反應後，樹根封住森林、水晶裂開礦場、發條空谷重新啟動、熔爐外洩高熱、風暴線圈充滿觀測站，日蝕寶庫則把回收貨物與最後一批機械軍一同封鎖。",
      "齒輪角魯克斯負責整理行囊，月帽歐拉則帶著商店跟隨路線。通過一關代表重新打開一段道路；擊敗樹根守衛、水晶守衛、發條巨像、熔爐巨獸、風暴統領與日蝕藏主，才算恢復六區運輸並取回全部貨物。"
    ],
    systems: [
      "行囊共有 11 欄、7 排。裝備形狀各不相同，可在放置前旋轉。攻擊決定魯克斯造成的傷害，防禦會降低反擊，治療則在承受傷害前恢復生命。兩件不同裝備只要同材質格子上下或左右相鄰，就會形成連結；每個有效連結增加 2 攻擊與 1 防禦。",
      "生命會延續整個五場遭遇，但每次勝利後都能把裝備拿回、旋轉並重新排列。待放區與已放裝備合計最多十二件；戰利品可以選一件，也可保留空間直接繼續。遠征金幣用於歐拉商店或來自出售裝備，只在目前遠征有效。",
      "特殊敵人會改變排法：護盾吸收開場傷害，伏擊手會先攻，孤立懲罰依沒有連結的裝備增加傷害，腐蝕會逐回合削弱防禦，頂排熱浪會依第一排占用格數加傷，過載會關閉最常見材質，輪替封印則會在四種材質間切換。",
      "工坊經驗、圖鑑、已完成關卡與下一個解鎖關卡會保存在本機。工坊等級提供少量生命成長。鑽石只用於確認後更換一次歐拉的三件商品，不是免費關卡進度的必要條件。"
    ],
    how: [
      "在 30 張橫向滑動關卡卡片中選擇已解鎖遠征，先讀取路線規則。",
      "選擇待放裝備，需要時旋轉，再點擊 11×7 行囊中的有效綠色格。",
      "讓鍛造、自然、水晶或月光裝備互相連結，準備好後開始遭遇。",
      "每次勝利後選擇或略過戰利品，再重新配裝；抵達商店停靠點時可向歐拉購買或出售。",
      "擊敗第五場遭遇即可保存通關；第 5、10、15、20、25、30 關都是首領檢查點。"
    ],
    strategyTips: [
      "先讀關卡規則。材質被封印或過載時，只堆一種連結會立刻失去優勢。",
      "面對孤立懲罰時，讓每件重要裝備至少接上一件同材質；面對頂排熱浪時，把連結往下排。",
      "腐蝕會讓長期防禦逐漸失效，應提高輸出縮短戰鬥；護盾敵人則需要先準備足夠破盾傷害。",
      "不要自動拿走每件戰利品。商店或首領還在前方時，空間本身就是資源。"
    ],
    progression: [
      "第 1～5 關教導連結、旋轉、護盾、先攻與孤立；樹根守衛會持續再生，除非行囊保有自然連結。",
      "第 6～10 關加入月光封鎖與稜鏡護盾；水晶守衛帶有 18 點護盾，核心受傷後還會反射碎片。",
      "第 11～15 關組合狂怒、孤立與腐蝕；發條巨像會在減傷的防守階段與強化反擊的狂怒階段間交替。",
      "第 16～20 關加入頂排熱浪；熔爐巨獸同時使用熱浪與腐蝕，需要保留散熱空間並縮短戰鬥。",
      "第 21～25 關把開場突襲與材質過載組合；風暴統領會依孤立裝備數量追加連鎖傷害。",
      "第 26～30 關輪替材質封印並重組前面學過的壓力；日蝕藏主要求多種可用連結，而且不能留下鬆散裝備。"
    ],
    designNote: "每關固定五場遭遇，讓同一個行囊有足夠時間變化，又不讓一次挑戰過長。戰鬥採自動結算，是為了讓手機、滑鼠與鍵盤玩家都把注意力放在本作最獨特的決策：裝備形狀、材質連結、空白格與下一隻敵人的規則。30 關依六套機制成長，而不是只提高數字；六位首領分別檢查自然連結、破盾、階段判讀、散熱、消除孤立與適應輪替封印。",
    parent: "基本遊玩不需要帳號。解鎖與完成關卡、工坊經驗、圖鑑與最佳遭遇進度保存在目前瀏覽器；清除網站資料或更換裝置可能移除本機進度。金幣與當次行囊是臨時資源；鑽石只用於歐拉商店的確認式刷新。",
    faq: [
      ["一共有多少關？", "共有 30 關、六個區域；第 5、10、15、20、25、30 關是守關首領。"],
      ["材質連結怎麼計算？", "兩件不同裝備的同材質格子必須上下或左右相鄰；有效連結會增加攻擊與防禦。"],
      ["為什麼連結突然失效？", "月光封鎖、過載與輪替封印會關閉一種材質；目前規則會顯示在戰鬥上方。"],
      ["每隻敵人之間可以重排嗎？", "可以。選擇或略過戰利品後，會回到可自由拿回、旋轉與放置裝備的準備階段。"],
      ["行囊滿了怎麼辦？", "可以不拿戰利品直接繼續，或出售待放裝備；行囊滿不會卡住流程。"],
      ["一定要使用鑽石嗎？", "不用。鑽石只會在再次確認後更換歐拉目前的商品。"],
      ["哪些進度會保存？", "解鎖與完成關卡、工坊經驗、圖鑑與最佳進度會保存在本機。"],
      ["支援鍵盤嗎？", "支援。行囊提供有標籤的 7 排、11 欄鍵盤格，可用方向鍵移動。"]
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
    noteTitle: "Player and Save Information",
    hideScoreBands: true,
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
    noteTitle: "玩家與存檔資訊",
    hideScoreBands: true,
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

  games["animal-reef-fisher"] = {
    title: "Animal Reef Fisher",
    difficulty: "Progressive",
    time: "2-4 minutes per mission",
    gameplay: "Fishing Tension Campaign",
    genre: ["Fishing", "Collection", "Timing", "Animal"],
    skills: ["Focus", "Reaction", "Problem Solving"],
    guideKicker: "WeightPlay Original Game Guide",
    guideTitleSuffix: "Game Guide",
    noteTitle: "Player and Save Information",
    hideScoreBands: true,
    intro: "Animal Reef Fisher is a 30-mission fishing and collection campaign. Bubble Fin the otter charges casts, follows a live line-tension lane, records 12 sea creatures, and spends Reef Notes on six saved gear upgrades. Six five-mission regions change the safe-zone rule, while Missions 5, 10, 15, 20, 25, and 30 guarantee named Guardian fish with distinct pull, armor, or current behavior.",
    story: [
      "The Reef Archive maintains current charts for Sunny Shore, Kelp Garden, Coral Gate, Moon Tide, the Storm Shelf, and the Abyssal Blue. Unusual seasonal tides have moved fish away from their recorded lanes. Bubble Fin takes the survey boat through each route, using catches to confirm which species still travel there and how the water now pulls against a fishing line.",
      "Reef Notes are field credits used to improve the survey gear. Each fifth mission reaches a habitat marker guarded by Sun Crown Guardian, Kelp Leviathan, Coral Ram Ray, Eclipse Manta, Storm Lantern Warden, or Crystal Crown Sovereign. Landing the Guardian validates that region's chart. Mission 30 files the sixth chart and ends the campaign without creating Mission 31."
    ],
    systems: [
      "Mission flow: select any unlocked card from the horizontal rail. Most goals require two or three catches. A win saves progress and unlocks exactly the next mission; earlier missions remain replayable.",
      "Cast and clock: an expedition begins with 90 seconds, plus five seconds for each Boat Range level above Level 1. Hold the water or Space to charge and release to cast. More power shortens bite delay; it does not select a rarer fish.",
      "Line control: after a bite, drag the red knob, slide on the sea, or use Left and Right. SAFE control removes fish power. Remaining outside the band too long breaks the line, returns to casting, and leaves the mission clock running.",
      "Fish identities: normal species pull in steady, darting, or heavy patterns. The current identity appears in the hook instruction and Sonar result. New species award an album bonus in addition to points and Reef Notes.",
      "Sea conditions: Open Water is stable; Kelp Drift moves the band; Coral Snags changes its width; Moon Tide switches sides; Storm Gust applies a timed line push; Abyss Trial combines drift, pressure, and gusts.",
      "Gear and optional tools: Rod, Reel, Line, Bait, Boat, and Scanner have five local levels. Scanner expands earlier species pools. A three-Diamond Rare Lure guarantees one rare eligible cast, while a two-Diamond Sonar reveals and locks one next fish. Both require confirmation and neither is needed for progression."
    ],
    how: [
      "Press Start Game, swipe the 30-card mission rail, and choose an unlocked card after reading its sea condition and catch goal.",
      "Optionally prepare one Rare Lure or Sonar, then use Reef Notes on gear that addresses the current problem.",
      "Hold the water or Space and release the cast. A strong cast reduces time spent waiting for a bite.",
      "When the fish appears, follow the green band with the red marker instead of forcing every fight back to the center.",
      "Recover quickly after a broken line. On Guardian missions, read the named boss rule and any armor cue before making a large correction.",
      "Reach the catch goal, review score, Notes and album discoveries at Result, then return to the Reef Map for the next mission."
    ],
    strategyTips: [
      "Choose Rod Strength or Bait Quality when safe fights take too long; choose Reel Control or Line Durability when the marker repeatedly escapes SAFE.",
      "Kelp, Moon, and Abyss missions deliberately move the safe center. Track the green area, not the 50 mark.",
      "Coral Ram Ray and Crystal Crown Sovereign cannot lose power while guarded. Use that phase to stabilize so the next opening begins safely.",
      "Storm gusts follow a three-second rhythm. Hold near the middle of the current band before the flash, then correct after the push.",
      "A full cast shortens waiting but does not affect rarity. Save the one-cast Rare Lure for a missing rare album entry.",
      "Use Sonar when knowing steady, darting, heavy, or Guardian behavior is worth more than the lure's guaranteed rare catch."
    ],
    progression: [
      "Missions 1-5 use a stable Open Water band. The first four teach casting, line recovery, and normal pull identities; Sun Crown Guardian ends the chapter with smooth crown pulses.",
      "Missions 6-10 move the entire band through Kelp Drift. Kelp Leviathan combines the moving target with a sustained heavy pull.",
      "Missions 11-15 make the band breathe wider and narrower around Coral Snags. Coral Ram Ray adds two-second guarded and open phases.",
      "Missions 16-20 switch the safe band between sides every four seconds. Eclipse Manta feints before reversing its pull.",
      "Missions 21-25 narrow the band and strike the line with a three-second Storm Gust. Storm Lantern Warden keeps a heavy pull active between gusts.",
      "Missions 26-30 combine moving pressure and gusts in the Abyss Trial. Crystal Crown Sovereign adds armor windows for the final rule-combination test."
    ],
    designNote: "The original two-step input remains consistent across all 30 missions: charge a cast, then manage tension. Difficulty moves into readable water rules rather than only faster fish. A drifting or narrowing band changes where to aim, a gust changes when to hold position, and Guardian armor changes when safe control creates progress. Five-mission chapters let one condition become familiar before a named Guardian combines it with a separate pull profile. Phone, desktop, tablet, and short landscape use the same logical Battle composition. Pointer and keyboard share one state, hidden-page time is suspended, and Result stays inside Battle above the same physical reserve. Album progress therefore comes from repeated real control decisions, while saved mission and gear choices give a return visit a clear purpose.",
    parent: "No account is required. This browser stores unlocked and selected missions, Reef Notes, best catches, 12 album entries, six gear levels, and prepared Lure or Sonar state. Clearing site storage or changing browsers may begin a separate save. The shared Diamond balance is optional and is used only for the confirmed Lure and Sonar preparations. All 30 missions, six Guardians, gear levels, and ordinary album progress remain available without those tools. Skill Reports summarize the current run for entertainment and are not a diagnosis, ranking, or formal ability assessment.",
    faq: [
      ["How many missions and Guardians are included?", "There are 30 missions. Missions 5, 10, 15, 20, 25, and 30 guarantee six different Guardian encounters."],
      ["Why does the green safe band move or change size?", "That is the mission's sea condition. Kelp drifts, Coral changes width, Moon switches sides, Storm adds gusts, and Abyss combines several rules."],
      ["What happens when the line breaks?", "The current fish escapes and casting resumes. The expedition continues, but its clock does not reset."],
      ["Does cast power choose a better fish?", "No. Power shortens bite delay. Species come from the mission pool, Scanner level, a prepared lure, or a locked Sonar result."],
      ["Can guarded Guardians lose power?", "Coral Ram Ray and Crystal Crown Sovereign lose power only while their guard is open and the marker is SAFE."],
      ["Are Diamonds required?", "No. Diamonds only prepare one optional rare catch or one next-fish Sonar lock. They do not unlock missions, Guardians, or gear."],
      ["Which progress is saved?", "The browser stores mission unlocks, Notes, album discoveries, gear levels, best catches, selected mission, and prepared optional tools."],
      ["Can I play with a keyboard?", "Yes. Hold and release Space to cast, then use Left and Right on the fishing area or tension slider."]
    ]
  };
  gameplayProfiles["animal-reef-fisher"] = { gameplay:"Fishing Tension Campaign", genre:["Fishing", "Collection", "Timing", "Animal"], skills:["Focus", "Reaction", "Problem Solving"] };
  localizedGameplayProfiles["zh-Hant"]["animal-reef-fisher"] = { gameplay:"釣魚張力任務", genre:["釣魚", "收集", "時機", "動物"], skills:["專注", "反應", "解決問題"] };
  localizedGames["zh-Hant"]["animal-reef-fisher"] = {
    title:"動物珊瑚釣手",
    difficulty:"漸進挑戰",
    time:"每關約 2～4 分鐘",
    gameplay:"釣魚張力任務",
    genre:["釣魚", "收集", "時機", "動物"],
    skills:["專注", "反應", "解決問題"],
    guideKicker:"WeightPlay 原創遊戲指南",
    guideTitleSuffix:"遊戲指南",
    noteTitle:"玩家與存檔資訊",
    hideScoreBands:true,
    intro:"《動物珊瑚釣手》是包含 30 個任務的釣魚收集遊戲。水獺泡泡鰭要掌握拋竿蓄力、追蹤即時魚線安全區、記錄 12 種海洋生物，並用礁石筆記升級六種裝備。六個五關區域會真正改變安全區規則；第 5、10、15、20、25、30 關則保證遇到拉力、護甲或海流邏輯不同的守護魚。",
    story:[
      "礁區檔案館替陽光淺灘、海藻花園、珊瑚門、月潮礁、風暴礁棚與深淵藍海保存海流圖。異常季節潮汐讓魚群離開原本記錄的水道。泡泡鰭駕著調查小船逐段航行，用漁獲確認目前有哪些生物經過，也記下每片海域會如何拉扯魚線。",
      "礁石筆記是檔案館提供的調查點數，可用來改良遠征裝備。每個第五關由日冠守護錦魚、海藻巨笛鯛、珊瑚角魟、蝕月鬼蝠魟、風暴礁燈守衛或水晶冠魚王守住區域標記。釣起守護魚代表該區五關海圖已確認；完成第 30 關會歸檔第六張海圖，不會產生不存在的第 31 關。"
    ],
    systems:[
      "任務流程：在水平任務列選擇已解鎖關卡，多數目標需要釣起兩或三尾魚。勝利會保存並只解鎖下一關，先前關卡仍可重玩。",
      "拋竿與時間：遠征基礎時間為 90 秒，小船航程每高於等級 1 一級就增加五秒。按住海面或空白鍵蓄力後放開；較高蓄力只會縮短咬餌等待，不會直接選到稀有魚。",
      "魚線控制：咬餌後可拖紅色鈕、在海面滑動或使用左右方向鍵。留在綠色安全區會降低魚的力量；離開太久會斷線、回到拋竿，而且任務時間不會重置。",
      "魚種拉力：一般生物分為穩定、突進與重拉三種。上鉤提示與聲納會顯示目前類型；第一次記錄的新魚除了分數與礁石筆記，還會得到圖鑑加成。",
      "海況規則：開放海面固定安全區；海藻漂流移動整段安全區；珊瑚纏線改變寬度；月潮換向左右切換；風暴突流定時推動魚線；深淵試煉把漂移、壓力與突流放在同一關。",
      "裝備與選用工具：釣竿、捲線器、魚線、魚餌、小船與掃描器各有五個本機等級，掃描器能擴張前期區域的魚種池。三鑽稀有魚餌保證一次合格稀有漁獲，兩鑽聲納會揭示並鎖定下一尾魚；兩者都需再次確認，也都不是通關條件。"
    ],
    how:[
      "按開始遊戲，左右滑動完整 30 關任務列，先閱讀海況與目標再選擇已解鎖關卡。",
      "需要時準備一次稀有魚餌或聲納，再把礁石筆記投入目前真正需要的裝備。",
      "按住海面或空白鍵並放開拋竿；較高蓄力可以少等一點咬餌時間。",
      "魚出現後，讓紅色標記跟著綠色安全區移動，不要把每場拉線都硬拉回中央。",
      "斷線後立刻重新拋竿；守護魚關卡要先讀取名稱、護甲與海流提示再大幅修正。",
      "在時間內完成漁獲目標，於結果查看分數、筆記與新圖鑑，再回礁區地圖挑戰下一關。"
    ],
    strategyTips:[
      "若能穩定留在安全區但收線太慢，升級釣竿強度或魚餌品質；若標記常跑出安全區，優先捲線控制或魚線耐久。",
      "海藻、月潮與深淵會刻意移動安全中心。要追蹤綠色區域，而不是固定盯著 50。",
      "珊瑚角魟與水晶冠魚王在護甲關閉時不會失去力量。利用這段時間穩線，讓下一個破綻從安全狀態開始。",
      "風暴突流每三秒一次。閃光前先靠近目前安全區中心，受到推動後再修正。",
      "滿蓄力不會提高稀有率，只會縮短等待。缺少稀有圖鑑時，再使用只能觸發一次的稀有魚餌。",
      "需要先知道穩定、突進、重拉或守護魚類型時用聲納；想直接補稀有圖鑑時再選魚餌。"
    ],
    progression:[
      "第 1～5 關使用固定的開放海面安全區，前四關教學拋竿、斷線復原與一般拉力；日冠守護錦魚以三段平順冠潮結束本章。",
      "第 6～10 關讓海藻漂流移動整段安全區；海藻巨笛鯛會在移動目標中維持長時間重拉。",
      "第 11～15 關讓珊瑚安全區週期變寬或收窄；珊瑚角魟再加入每兩秒切換的護甲與破綻。",
      "第 16～20 關每四秒把月潮安全區換到另一側；蝕月鬼蝠魟會在反向以前做出假動作。",
      "第 21～25 關縮窄安全區並每三秒衝擊魚線；風暴礁燈守衛在突流之間仍維持重拉。",
      "第 26～30 關於深淵同時使用漂移壓力與突流；水晶冠魚王再加入護甲破綻，成為最後的規則綜合測試。"
    ],
    designNote:"30 關都保留同一個兩階段輸入：先蓄力拋竿，再管理張力。難度來自可讀的海況，不是只把魚加速。漂移或收窄改變玩家要守的位置，突流改變穩線時機，守護魚護甲則改變安全控制何時能轉成進度。每五關先熟悉一種條件，再由守護魚把它與獨立拉力結合。手機、桌面、平板與短橫向使用同一個 Battle 邏輯畫面；指標與鍵盤共用狀態，頁面隱藏時會暫停時間，Result 仍屬於 Battle 並沿用同一個實體保留區。圖鑑因此來自反覆做出的真實張力判斷，而保存的關卡與裝備也讓再次遊玩有明確規劃。",
    parent:"不需要帳號。已解鎖與目前任務、礁石筆記、最佳漁獲、12 種圖鑑、六種裝備等級，以及已準備的魚餌或聲納都保存在目前瀏覽器。清除網站資料或更換瀏覽器可能建立另一份存檔。共用鑽石餘額只用於經過確認的魚餌與聲納；不使用它們也能完成 30 關、六隻守護魚、裝備升級與一般圖鑑進度。能力報告只整理本次遊玩，不是診斷、排名或正式能力測驗。",
    faq:[
      ["遊戲有幾關與幾隻守護魚？","共有 30 關；第 5、10、15、20、25、30 關會保證遇到六隻不同守護魚。"],
      ["綠色安全區為什麼會移動或變窄？","那是關卡海況。海藻會漂移、珊瑚改變寬度、月潮左右換向、風暴加入突流，深淵則結合多種規則。"],
      ["魚線斷掉會怎樣？","目前魚會逃走並回到拋竿階段；遠征仍繼續，但計時不會重置。"],
      ["蓄力較高會釣到更好的魚嗎？","不會。蓄力只縮短咬餌等待；魚種由任務池、掃描器等級、一次魚餌或聲納鎖定決定。"],
      ["守護魚護甲關閉時能降低力量嗎？","珊瑚角魟與水晶冠魚王只有在護甲開啟且標記位於安全區時才會失去力量。"],
      ["通關一定要鑽石嗎？","不用。鑽石只準備一次稀有漁獲或一次聲納鎖定，不會解鎖關卡、守護魚或裝備。"],
      ["哪些進度會保存？","目前瀏覽器會保存關卡、筆記、圖鑑、裝備、最佳漁獲、選擇關卡與已準備工具。"],
      ["可以只用鍵盤嗎？","可以。按住並放開空白鍵拋竿，再於遊戲區或張力軌道使用左右方向鍵。"]
    ]
  };

  Object.assign(games["animal-cafe-rush"], {
    title: "Animal Cafe Rush",
    age: "6+",
    difficulty: "Easy to Medium",
    time: "3-8 minutes per day",
    gameplay: "Picture-Order Cafe Campaign",
    genre: ["Time Management", "Matching", "Animal", "Kids"],
    skills: ["Focus", "Sequencing", "Problem Solving"],
    hideScoreBands: true,
    intro: "Animal Cafe Rush is a 30-day picture-order and cafe-planning campaign. Lion, giraffe, panda, and rabbit guests request smoothies, sandwiches, fruit bowls, and bakery treats. Direct matching develops into numbered recipes, VIP priority, alternating tables, and animal-variety rules. Every fifth day is a Cafe Review, and the Grand Cafe Festival combines all advanced rules without adding a hidden Day 31.",
    story: [
      "The cafe stands beside a busy animal market, where four kinds of guests stop between errands. A young lion host is learning to run the counter without losing the friendly pace that made the shop popular. Each cleared day means the cafe served its promised number of guests while keeping enough business rating to remain open. Correct service earns coins that return to the same cafe as practical upgrades.",
      "The campaign is organized as six work weeks rather than 30 copies of one round. Early guests communicate with food pictures. Later, recipes become ordered steps, invited VIPs need priority, Table A and Table B share one kitchen, and regular animal friends expect a varied queue. Completing the Grand Cafe Festival means the host can coordinate every learned rule during the busiest service."
    ],
    systems: [
      "Food board and tray: Eight large food tiles are available. Tap the pictured foods to build a tray, then tap the matching customer. Clear the tray before delivery if the selection is wrong.",
      "Orders and patience: Three guests begin each day and more may join. Order bubbles show required food; cards show patience. A guest who waits too long leaves and reduces business rating. The day pauses only when rating reaches zero.",
      "Numbered recipes: Days 6-10 require the exact visible 1-2-3 order. The right ingredients in a different order are rejected, so recipe numbers are a real rule rather than decoration.",
      "Queue decisions: Days 11-15 require a waiting VIP first. Days 16-20 alternate Table A and Table B. Days 21-25 require a different animal next whenever another eligible species is waiting.",
      "Festival combinations: Days 26-29 pair earlier rules in different ways. Day 30 activates recipe order, VIP priority, table alternation, and animal variety together.",
      "Progress and upgrades: Correct orders award coins, with later-chapter and VIP bonuses. Quick Stations, Extra Tray, and Cozy Cafe each have three saved levels. Unlocks, coins, best service count, and upgrades stay in this browser."
    ],
    how: [
      "Choose an unlocked day from the horizontal Stage rail and read its title, target, and rule.",
      "Check food bubbles, VIP marks, table marks, and patience before preparing a tray.",
      "Tap food tiles to build one order. On numbered days, select them in the displayed order.",
      "Tap the eligible customer. A specific message explains an incorrect recipe or queue decision.",
      "Serve the target number before business rating falls to zero.",
      "Spend coins on one of three permanent upgrades, replay an unlocked day, or continue to the next day."
    ],
    strategyTips: [
      "Read all three starting orders before selecting food; one may be easier with the visible board.",
      "Say the numbered recipe aloud before tapping it.",
      "Check for a VIP before preparing a normal guest's tray.",
      "On table days, find the required table first and compare only eligible guests.",
      "For variety, remember the last animal served and look for another species.",
      "Clear a mixed tray instead of forcing it onto an unrelated order."
    ],
    progression: [
      "Days 1-5 teach direct Picture Orders, single and repeated ingredients, and the growing queue. Day 5 is the first Cafe Review.",
      "Days 6-10 add Recipe Steps. Two-step orders lead to three-step practice and the Recipe Review.",
      "Days 11-15 add VIP Service. A gold tag changes which otherwise-correct order may be delivered first.",
      "Days 16-20 add Twin Tables. The required service alternates between Table A and Table B.",
      "Days 21-25 add Animal Variety. Service must change species when another eligible friend is waiting.",
      "Days 26-30 form Festival Week. Four days combine two rules; Day 30 uses all four and ends the campaign."
    ],
    designNote: "The game begins with picture matching so the counter is understandable before pressure matters. Each chapter changes why a delivery is correct: ingredient order, social priority, table rhythm, or queue variety. Difficulty therefore grows through visible decisions instead of smaller targets or an unfair timer. Three starting guests keep the scene readable, while goals rise from three to eight so later rules have time to interact. One fixed logical canvas scales uniformly across phone, tablet, desktop, and short landscape. Touch, mouse, and keyboard share the same food and customer buttons. Unlike a cooking game with hidden recipes, every required ingredient and special status is visible before the player acts.",
    parent: "This Kids game has no advertising request, account requirement, purchase, leaderboard, combat, or formal assessment. It may support visual matching, sequencing, attention shifting, and simple planning. Adults can ask a child to name the numbered recipe, find the next table, or explain why one guest has priority. Progress and upgrades are stored only in the current browser; clearing site data or changing devices may begin a separate save.",
    faq: [
      ["How many days are included?", "There are 30 authored days and Cafe Reviews at Days 5, 10, 15, 20, 25, and 30."],
      ["How do I serve a customer?", "Choose every pictured food, in numbered order when required, then tap an eligible customer."],
      ["Why was a matching order rejected?", "The current day may require recipe order, VIP priority, the highlighted table, or a different animal next. The message identifies the rule."],
      ["What happens when patience reaches zero?", "The guest leaves and business rating drops. The attempt pauses if rating reaches zero and can be retried."],
      ["What do cafe upgrades change?", "Quick Stations, Extra Tray, and Cozy Cafe provide permanent saved support and each has three levels."],
      ["Can I replay an earlier day?", "Yes. Every unlocked day remains available on the Stage rail."],
      ["Does the game require an account or show ads?", "No. This Kids game requires no login and creates no advertising request."],
      ["Where is progress stored?", "Days, coins, best result, and upgrades are stored locally in this browser."],
      ["Is the result a formal ability test?", "No. It is only playful feedback from the current cafe session."]
    ]
  });
  gameplayProfiles["animal-cafe-rush"] = { gameplay:"Picture-Order Cafe Campaign", genre:["Time Management", "Matching", "Animal", "Kids"], skills:["Focus", "Sequencing", "Problem Solving"] };
  localizedGameplayProfiles["zh-Hant"]["animal-cafe-rush"] = { gameplay:"圖像訂單咖啡館闖關", genre:["時間管理", "配對", "動物", "兒童"], skills:["專注", "順序理解", "問題解決"] };
  localizedGames["zh-Hant"]["animal-cafe-rush"] = {
    title:"動物咖啡快手", age:"6+", difficulty:"簡單至中等", time:"每個營業日約 3～8 分鐘", gameplay:"圖像訂單咖啡館闖關", genre:["時間管理", "配對", "動物", "兒童"], skills:["專注", "順序理解", "問題解決"], hideScoreBands:true,
    intro:"《動物咖啡快手》是共有 30 個營業日的圖像訂單與咖啡館規劃遊戲。獅子、長頸鹿、熊貓與兔子會用圖片點果昔、三明治、水果盤或烘焙點心。前期是直接配對，之後依序加入數字食譜、VIP 優先、A/B 桌輪流與動物輪替。每五天有一次咖啡館審查，第 30 天的大慶典會同時使用所有進階規則，沒有隱藏的第 31 天。",
    story:["咖啡館位在熱鬧的動物市集旁，四種動物會在辦事途中來休息。年輕獅子店長正在學習管理櫃檯，同時維持這家店原本親切的步調。完成一天代表在營業評分歸零前服務指定人數；正確出餐得到的金幣會回到同一間店，用來改善之後的營業。","30 天分成六個工作週，不是把同一回合複製 30 次。最初客人只用餐點圖片溝通，後來食譜出現順序、受邀 VIP 需要優先、A 桌與 B 桌共用廚房，熟客也希望隊伍不只服務同一種動物。完成大慶典，代表店長能在最忙的時段同時協調所有規則。"],
    systems:["餐點板與托盤：畫面提供八個大餐點方塊。依照氣泡點選餐點組成托盤，再點正確客人；若選錯，可在出餐前清空托盤。","訂單與耐心：每天一開始有三位客人，之後還會加入。氣泡顯示餐點，客人卡顯示耐心；等待過久會離開並降低營業評分，評分歸零才會暫停本日。","數字食譜：第 6～10 天必須完全按照畫面上的 1、2、3 順序。材料相同但順序不同不算完成，因此數字不是裝飾。","隊伍規則：第 11～15 天要先服務等待中的 VIP；第 16～20 天要讓 A 桌與 B 桌輪流；第 21～25 天在有其他動物可選時，下一位不可和上一位相同。","慶典組合：第 26～29 天用不同方式組合兩種舊規則；第 30 天同時啟用食譜順序、VIP、桌次與動物輪替。","進度與升級：正確訂單會獲得金幣，後期章節與 VIP 有額外價值。快速工作站、加大托盤與舒適咖啡館各有三級；關卡、金幣、最佳服務數與升級保存在此瀏覽器。"],
    how:["從水平滑動的關卡列選擇已解鎖營業日，先讀標題、目標與規則。","查看餐點氣泡、VIP 標記、桌次標記與耐心條。","點餐點方塊組成一份訂單；數字關卡要按顯示順序選取。","點符合目前隊伍規則的客人；若錯誤，訊息會指出食譜或服務次序問題。","在營業評分歸零前完成指定服務人數。","使用金幣升級三種永久設備、重玩舊關卡，或前往下一個營業日。"],
    strategyTips:["先讀完最初三張訂單，再看目前餐點板最容易完成哪一份。","數字食譜可先照順序念一次再點。","準備一般客人的托盤前，先確認是否有 VIP。","桌次關卡先找目前指定的 A 或 B 桌，再比較該桌客人。","動物輪替時記住上一位動物，優先找另一種可服務的動物。","若托盤混入不同訂單的材料，直接清空比硬送更安全。"],
    progression:["第 1～5 天教圖像訂單、單一與重複材料、逐漸增加的隊伍；第 5 天是第一次審查。","第 6～10 天加入食譜步驟，從兩步走到三步，最後是食譜審查。","第 11～15 天加入 VIP 服務；金色標記會改變哪一份正確訂單可以先送。","第 16～20 天加入雙桌輪替，出餐必須在 A 桌與 B 桌之間切換。","第 21～25 天加入動物輪替；只要有其他合格動物等待，就不能連續服務同一種。","第 26～30 天是慶典週，前四天各組合兩種規則，第 30 天同時使用四種並結束完整活動。"],
    designNote:"設計先用圖像配對建立櫃檯規則，再逐章改變一份出餐為何正確：材料順序、社交優先、桌次節奏與隊伍多樣性。難度因此來自看得見的判斷，而不是縮小按鈕或使用不公平的高速倒數。三位起始客人讓畫面仍可閱讀，目標則從三人增至八人，讓後期規則有時間互相影響。固定邏輯畫布會在手機、平板、桌機與短橫向畫面等比縮放；觸控、滑鼠與鍵盤共用相同餐點與客人按鈕。所有必要材料與特殊身分都會在操作前顯示。",
    parent:"這是 Kids 遊戲，不發出廣告請求，不需要帳號、購買、排行榜或戰鬥，也不是正式能力測驗。遊戲可用來討論圖像配對、順序、注意力切換與簡單規劃。大人可請孩子念出數字食譜、找下一桌，或說明為何某位客人要優先。進度與升級只存在目前瀏覽器；清除網站資料或更換裝置可能會得到另一份存檔。",
    faq:[["共有幾個營業日？","共有 30 個營業日，並在第 5、10、15、20、25、30 天安排咖啡館審查。"],["要怎麼替客人出餐？","點齊氣泡裡的餐點；有數字時依順序選取，再點符合目前規則的客人。"],["材料明明相同，為何被拒絕？","本日可能要求食譜順序、VIP 優先、指定桌次或不同動物；提示訊息會指出原因。"],["耐心歸零會怎樣？","客人會離開並降低營業評分；評分歸零時本日暫停，可以重新挑戰。"],["三種升級有什麼用？","快速工作站、加大托盤與舒適咖啡館會永久支援之後的嘗試，各有三級。"],["可以重玩舊關卡嗎？","可以，所有已解鎖營業日都會留在關卡列。"],["需要登入或會顯示廣告嗎？","不需要；這個 Kids 遊戲不要求登入，也不發出廣告請求。"],["進度存在何處？","營業日、金幣、最佳結果與升級存在目前瀏覽器。"],["結果是正式能力測驗嗎？","不是，只是本次咖啡館遊玩的趣味回饋。"]]
  };

  Object.assign(games["animal-hero-trials"], {
    title:"Animal Hero Trials", age:undefined, difficulty:"Medium to Hard", time:"4-9 minutes per trial", gameplay:"Three-Room Hero Action Trials", genre:["Action","Roguelite","Animal"], skills:["Reaction","Focus","Problem Solving"], guideKicker:"WeightPlay Original Game Guide", guideTitleSuffix:"Game Guide", noteTitle:"Player and Save Information", hideScoreBands:true,
    intro:"Animal Hero Trials is a 30-trial action campaign starring four WeightPlay heroes with different health, speed, attack range, and active skills. Each trial has three connected rooms, two free blessing choices, and an elite captain or regional Boss finale. Five enemy families introduce flight, charges, ranged fire, and armor. Six checkpoint Bosses require different counters, while saved Trial Marks purchase permanent Heart Mastery.",
    story:["Six shadow gates opened between Rootwood and the Void Crown. Rootwood sends chasing packs, Prism Ravine grants flight and shields, Ember Forge drives warned charges, Moon Range arms distant attackers, Abyss Shell reinforces guards, and the final Crown mixes every surviving rule. A victory stabilizes one road segment and unlocks the next trial.","Boom Mane Leo, Spark Paw Fia, Moon Cap Orla, and Moss Shell Taro enter as a rotating hero team. Every fifth trial is a regional checkpoint. Defeating Void Crown Emperor in Trial 30 closes the final gate; the campaign creates no hidden Trial 31."],
    systems:["Four heroes: Leo is balanced and uses an area roar. Fia is fast and performs an invulnerable damaging dash. Orla attacks from range and marks one target for bonus damage. Taro has the most health and creates a timed damage-reducing guard.","Movement and automatic attack: Move with the joystick, Arrow keys, or WASD. The hero automatically attacks the nearest target inside individual range. The skill button or Space uses the active skill when its cooldown is ready.","Three-room runs: Rooms 1 and 2 contain authored enemy combinations. Clearing each opens a mandatory free choice of Power, Cooldown, or Recovery. Room 3 is an elite captain on ordinary trials and a named Boss on checkpoint trials.","Enemy identities: Scouts chase, Ravens curve through the arena, Boars warn before charging, Hunters keep distance and fire, and Abyss Guards reduce ordinary damage until skills break guard.","Progression: Victories award four to nine Trial Marks and unlock one next trial. Heart Mastery begins at five Marks, costs four more per later level, and gives every hero 12 additional maximum health per level.","Optional reroll: Three free blessings are always available. Three Diamonds replace all choices with stronger versions once per run. The exact balance change appears before a second confirmation; normal progression never requires it."],
    how:["Choose an unlocked card from the 30-trial Stage rail and read its region rule, checkpoint Boss, and suggested hero.","Select Leo, Fia, Orla, or Taro; the choice stays saved for later visits.","Move to control distance while automatic attacks target the nearest enemy in range.","Time the active skill to clear a group, cross a warning, mark a priority target, or absorb a heavy pattern.","After Rooms 1 and 2, take one free blessing. The Diamond reroll is optional.","Clear Room 3 for Trial Marks and the next unlock. Defeat offers Retry without deleting permanent progress."],
    strategyTips:["Group Scouts inside Leo's roar.","Dash with Fia after a yellow charge warning so invulnerable movement crosses danger.","Use Orla's range and mark on armored or high-health targets.","Use Taro's guard against Archowl volleys and the Emperor's late pressure.","Skills remove guard faster than automatic attacks.","Choose Power to shorten fights, Cooldown for skill access, or Recovery when carried health is low."],
    progression:["Trials 1-5 teach direct Scout pursuit and end with Shadow Prowler's warned shockwave.","Trials 6-10 add curved Ravens and armor. Prism Basilisk alternates protected and open windows.","Trials 11-15 add warned Boar charges. Magma Tusk Colossus resists damage until a charge creates an opening.","Trials 16-20 add distance-keeping Hunters and mixed approach angles. Eclipse Archowl fires timed volleys.","Trials 21-25 overlap armor, charges, and range. Abyss Shell Leviathan summons two reinforcements below roughly half health.","Trials 26-30 combine all five families. Void Crown Emperor gains a guarded middle phase and calls Raven plus armored support in its final phase."],
    designNote:"A consistent three-room rhythm lets one hero build two blessings without turning a trial into an endurance run. The third room tests whether the selected hero and build answer a visible rule. Difficulty grows through movement shapes, range, warnings, armor, reinforcements, and Boss phases instead of only larger health totals. One fixed logical Battle canvas scales uniformly across phone, tablet, desktop, and short landscape. Touch and keyboard share movement and skill state, hidden pages suspend simulation, and Result remains inside Battle above the separate physical reserve. Unlike Animal Auto Squad, live movement and skill timing stay under direct player control.",
    parent:"The browser stores highest unlocked trial, Trial Marks, Heart Mastery, and selected hero locally. Clearing site data or changing browsers may start a separate save. Diamonds are optional platform currency used only for one confirmed blessing reroll per run. All 30 trials, five enemy families, six Bosses, free blessings, and permanent mastery remain playable without it. Skill feedback is entertainment, not a ranking or formal ability assessment.",
    faq:[["How many trials and Bosses are included?","There are 30 three-room trials and six different checkpoint Bosses at Trials 5, 10, 15, 20, 25, and 30."],["Do all heroes play the same way?","No. They differ in health, speed, attack range, base attack, and active skill."],["Why is an enemy taking little damage?","An Abyss Guard, Prism Basilisk, or Emperor guard may be active. Skills remove guard faster than automatic attacks."],["What happens after each room?","After Rooms 1 and 2, choose Power, Cooldown, or Recovery. Room 3 ends the trial."],["What carries between runs?","Trial unlocks, Marks, Heart Mastery, and selected hero are saved locally; temporary blessings reset."],["Are Diamonds required?","No. Three Diamonds only replace blessing choices once; a free blessing is always available."],["Can I replay an earlier trial?","Yes. Every unlocked card remains available on the Stage rail."],["What happens after defeat?","Retry restarts the same trial without deleting permanent progress."],["Does it support touch and keyboard?","Yes. Use the joystick and skill button, or WASD/Arrow keys and Space."]]
  });
  gameplayProfiles["animal-hero-trials"]={gameplay:"Three-Room Hero Action Trials",genre:["Action","Roguelite","Animal"],skills:["Reaction","Focus","Problem Solving"]};
  localizedGameplayProfiles["zh-Hant"]["animal-hero-trials"]={gameplay:"三房間英雄動作試煉",genre:["動作","Roguelite","動物"],skills:["反應","專注","問題解決"]};
  localizedGames["zh-Hant"]["animal-hero-trials"]={
    title:"動物英雄試煉",age:undefined,difficulty:"中等至困難",time:"每個試煉約 4～9 分鐘",gameplay:"三房間英雄動作試煉",genre:["動作","Roguelite","動物"],skills:["反應","專注","問題解決"],guideKicker:"WeightPlay 原創遊戲指南",guideTitleSuffix:"遊戲指南",noteTitle:"玩家與存檔資訊",hideScoreBands:true,
    intro:"《動物英雄試煉》是共有 30 關的動作闖關。四位 WeightPlay 英雄擁有不同生命、速度、射程與主動技能。每個試煉包含三個相連房間、兩次免費祝福選擇，以及一名菁英隊長或區域 Boss。五種敵人逐步加入飛行、衝鋒、遠程與護甲，六個檢查點 Boss 各有不同反制方式；勝利取得的試煉印記可升級永久生命精通。",
    story:["六道暗影門從根木林一路開到虛空王冠。根木林放出追逐獸群，稜晶峽谷賦予飛行與護盾，餘燼熔爐驅動有預警的衝鋒，月影長廊武裝遠程敵人，深淵甲殼強化護衛，最後的王冠則混合所有規則。每次勝利會穩定一段道路並解鎖下一個試煉。","爆鬃獅 Leo、星爪狐 Fia、月帽貓頭鷹 Orla 與苔殼龜 Taro 組成輪替英雄隊。每五關是一個區域檢查點；在第 30 關擊敗虛空王冠帝就會關閉最後一道門，遊戲不會產生隱藏的第 31 關。"],
    systems:["四位英雄：Leo 均衡並使用範圍怒吼；Fia 高速且能無敵衝刺造成傷害；Orla 從遠處攻擊並標記目標，讓下一次自動攻擊增傷；Taro 生命最高，可開啟限時減傷守護。","移動與自動攻擊：使用搖桿、方向鍵或 WASD 移動。英雄會自動攻擊個人射程內最近的目標；技能冷卻完成後，按技能鍵或空白鍵施放。","三房間流程：前兩房使用設計好的敵人組合，每次清除後必須免費選擇攻擊、冷卻或恢復祝福。一般關第三房是菁英隊長，檢查點則是命名 Boss。","敵人身分：暗影斥候直接追逐，稜晶渡鴉以曲線接近，餘燼野豬先警告再衝鋒，月影獵手保持距離射擊，深淵護衛則降低普通攻擊傷害，直到技能破除護甲。","永久進度：勝利取得四至九枚印記並只解鎖下一關。生命精通第一級需要五枚，之後每級多四枚，每級讓所有英雄增加 12 最大生命。","選擇性重抽：每次都有三個免費祝福。花三顆鑽石可在該次挑戰中把三項全部換成強化版一次；畫面會先顯示精確餘額變化，第二次確認才扣除。"],
    how:["從 30 關水平關卡列選擇已解鎖試煉，閱讀區域規則、檢查點 Boss 與建議英雄。","選擇 Leo、Fia、Orla 或 Taro；選擇會保存在本機。","移動控制距離，讓自動攻擊鎖定射程內最近的敵人。","在適當時機用技能清群、穿過警告、標記優先目標或承受重擊。","清除前兩房後各選一項免費祝福；鑽石重抽不是必要流程。","清除第三房取得印記並解鎖下一關；失敗可重試，不會刪除永久進度。"],
    strategyTips:["把斥候聚在 Leo 的怒吼範圍內。","看到黃色衝鋒警告後再用 Fia 衝刺，以無敵移動穿過危險。","Orla 可保持距離並標記護甲或高生命目標。","Archowl 齊射與 Emperor 後期壓力適合用 Taro 守護。","技能破除護甲的速度比普通攻擊快。","攻擊祝福縮短戰鬥，冷卻提高技能頻率，恢復則保護已受傷的挑戰。"],
    progression:["第 1～5 關教直接追逐，暗影潛行者以有預警的近距離震波收尾。","第 6～10 關加入曲線渡鴉與護甲；稜晶蛇王在保護與開放階段間切換。","第 11～15 關加入野豬衝鋒；熔岩巨牙獸在衝鋒前抗性較高，衝鋒後短暫開放。","第 16～20 關加入保持距離的獵手與混合角度；蝕月大梟會定時齊射。","第 21～25 關重疊護甲、衝鋒與遠程；深淵甲殼巨獸低於約半血時召喚兩名增援。","第 26～30 關混合五種敵人；虛空王冠帝中段獲得護盾，最後階段召喚渡鴉與裝甲支援。"],
    designNote:"固定三房間節奏讓玩家能用兩次祝福建立方向，又不把單關拉成耐力賽。第三房會檢查目前英雄與祝福是否能回答畫面可讀的規則。難度來自移動軌跡、射程、預警、護甲、增援與 Boss 階段，而不是只提高生命。固定邏輯 Battle 畫布會在手機、平板、桌機與短橫向畫面等比縮放；觸控與鍵盤共用移動和技能狀態，頁面隱藏時會暫停模擬，Result 留在 Battle 與獨立實體保留區上方。和《自走小隊》不同，本作的走位與技能時機由玩家直接控制。",
    parent:"本瀏覽器會在本機保存最高解鎖試煉、試煉印記、生命精通與選定英雄。清除網站資料或更換瀏覽器可能得到另一份存檔。鑽石只是選擇性平台貨幣，每次挑戰最多用於一次經確認的祝福重抽；不使用重抽仍可遊玩全部 30 關、五種敵人、六個 Boss、免費祝福與永久精通。技能回饋只供娛樂，不是排名或正式能力測驗。",
    faq:[["共有幾關與幾個 Boss？","共有 30 個三房間試煉，第 5、10、15、20、25、30 關各有一個不同 Boss。"],["四位英雄玩法一樣嗎？","不一樣；生命、速度、攻擊射程、基礎攻擊與主動技能都不同。"],["為何敵人只受到很少傷害？","深淵護衛、稜晶蛇王或王冠帝可能正在守護狀態，技能比自動攻擊更快破除護甲。"],["每個房間結束後會怎樣？","前兩房可選攻擊、冷卻或恢復；第三房結束整個試煉。"],["哪些進度會保留？","關卡解鎖、印記、生命精通與選定英雄保存在本機，臨時祝福會重置。"],["一定要使用鑽石嗎？","不用；三顆鑽石只會重抽一次祝福，畫面永遠有免費選項。"],["可以重玩舊關卡嗎？","可以，所有已解鎖卡片都會保留在關卡列。"],["失敗會失去什麼？","重試只會重開同一關，不會刪除永久進度。"],["支援觸控與鍵盤嗎？","支援；可使用搖桿與技能鍵，或 WASD／方向鍵與空白鍵。"]]
  };

  labels["zh-Hans"] = {
    "kicker": "WeightPlay 儿童游戏指南",
    "titleSuffix": "免费儿童游戏",
    "gameplay": "玩法",
    "genre": "类型",
    "recommendedAge": "建议年龄",
    "difficulty": "难度",
    "estimatedTime": "预估游玩时间",
    "skills": "练习能力",
    "worldAndMission": "世界与任务",
    "gameSystems": "游戏系统",
    "progressionAndDifficulty": "关卡与难度成长",
    "developerNote": "开发设计理念",
    "howToPlay": "玩法说明",
    "strategyTips": "策略提示",
    "parentNote": "家长说明",
    "progressGuide": "进度指南",
    "progressNote": "分数只用于游戏娱乐与本地进度纪录，不是智力测验、医疗诊断、心理测验或正式学校评量。",
    "beginner": "入门",
    "good": "良好",
    "excellent": "优秀",
    "faq": "常见问题",
    "relatedGames": "相关游戏",
    "relatedIntro": "因为这款游戏会练习 {skill}，也可以试试这些游戏：",
    "relatedBySkill": "更多 {skill} 游戏",
    "relatedByAge": "更多 {age} 游戏",
    "relatedAnimal": "更多动物游戏",
    "guideLabel": "{title} 游戏资讯"
  };
  skillLabels["zh-Hans"] = {
    "Memory": "记忆",
    "Logic": "逻辑",
    "Reaction": "反应",
    "Focus": "专注",
    "Math": "数学",
    "Reading": "阅读",
    "Color Recognition": "颜色辨识",
    "Hand-Eye Coordination": "手眼协调",
    "Problem Solving": "问题解决",
    "Animal Knowledge": "动物知识"
  };
  localizedGameplayProfiles["zh-Hans"] = {
    "wonder-crash": {
      "gameplay": "弹幕守城防御",
      "genre": [
        "动作",
        "防守",
        "动物"
      ]
    },
    "color-lunchbox": {
      "gameplay": "颜色分类",
      "genre": [
        "幼儿",
        "教育",
        "动物"
      ]
    },
    "bubble-bakery": {
      "gameplay": "泡泡连线益智",
      "genre": [
        "益智",
        "逻辑",
        "动物"
      ]
    },
    "animal-zoo-idle": {
      "gameplay": "放置动物园经营",
      "genre": [
        "放置",
        "经营",
        "动物"
      ]
    },
    "animal-rope-rescue": {
      "gameplay": "藤蔓物理解谜",
      "genre": [
        "物理",
        "益智",
        "动物"
      ]
    },
    "star-memory": {
      "gameplay": "记忆翻牌",
      "genre": [
        "记忆",
        "益智",
        "动物"
      ]
    },
    "campus-dash": {
      "gameplay": "路线闪避跑酷",
      "genre": [
        "跑酷",
        "反应",
        "动物"
      ]
    },
    "snack-blocks": {
      "gameplay": "三消方块",
      "genre": [
        "益智",
        "逻辑",
        "动物"
      ]
    },
    "fruit-merge": {
      "gameplay": "物理合成",
      "genre": [
        "合成",
        "物理",
        "动物"
      ]
    },
    "garden-tiles": {
      "gameplay": "30 关花园记忆配对",
      "genre": [
        "记忆",
        "益智",
        "动物"
      ]
    },
    "animal-rescue": {
      "gameplay": "30 关路线规划",
      "genre": [
        "路线规划",
        "益智",
        "动物"
      ]
    },
    "animal-bubble-safari": {
      "gameplay": "泡泡射击解谜",
      "genre": [
        "益智",
        "泡泡射击",
        "动物"
      ]
    },
    "animal-habitat-mahjong": {
      "gameplay": "麻将牌配对",
      "genre": [
        "益智",
        "逻辑",
        "动物"
      ]
    },
    "animal-hidden-safari": {
      "gameplay": "30 关栖地找找看",
      "genre": [
        "益智",
        "自然探索",
        "动物",
        "亲子"
      ]
    },
    "animal-crystal-survivor": {
      "gameplay": "30 关动作生存战役",
      "genre": [
        "动作",
        "生存",
        "战役",
        "首领战",
        "动物"
      ]
    },
    "animal-guard-yard": {
      "gameplay": "路线防守",
      "genre": [
        "策略",
        "防守",
        "动物"
      ]
    },
    "animal-quiz": {
      "gameplay": "动物问答",
      "genre": [
        "问答",
        "教育",
        "动物"
      ]
    },
    "zoo-helper-day": {
      "gameplay": "动物园工作日",
      "genre": [
        "幼儿",
        "经营",
        "动物"
      ]
    },
    "shape-train": {
      "gameplay": "形状分类",
      "genre": [
        "幼儿",
        "教育",
        "动物"
      ]
    },
    "tiny-weather-rescue": {
      "gameplay": "道具选择",
      "genre": [
        "益智",
        "照顾",
        "动物"
      ]
    },
    "beast-deck": {
      "gameplay": "牌组 Roguelike",
      "genre": [
        "卡牌",
        "Roguelike",
        "动物"
      ]
    },
    "animal-relic-hunters": {
      "gameplay": "房间动作 Roguelite",
      "genre": [
        "动作",
        "Roguelite",
        "动物"
      ]
    },
    "animal-rune-tactics": {
      "gameplay": "回合制小队战棋",
      "genre": [
        "策略",
        "战棋",
        "动物"
      ]
    },
    "beast-tactician": {
      "gameplay": "英雄塔防",
      "genre": [
        "塔防",
        "策略",
        "动物"
      ]
    },
    "animal-auto-squad": {
      "gameplay": "自走棋策略益智",
      "genre": [
        "自走棋",
        "策略",
        "益智",
        "动物"
      ]
    },
    "shadow-wolf": {
      "gameplay": "横向动作 RPG",
      "genre": [
        "动作",
        "平台",
        "动物"
      ]
    },
    "animal-reef-fisher": {
      "gameplay": "钓鱼张力任务",
      "genre": [
        "钓鱼",
        "收集",
        "时机",
        "动物"
      ],
      "skills": [
        "专注",
        "反应",
        "解决问题"
      ]
    },
    "animal-hero-trials": {
      "gameplay": "三房间英雄动作试炼",
      "genre": [
        "动作",
        "Roguelite",
        "动物"
      ],
      "skills": [
        "反应",
        "专注",
        "问题解决"
      ]
    },
    "animal-gearpack-expedition": {
      "gameplay": "空间行囊策略远征",
      "genre": [
        "策略",
        "Roguelite",
        "动物"
      ]
    },
    "animal-moonlight-heist": {
      "gameplay": "潜行撤离冒险",
      "genre": [
        "潜行",
        "策略",
        "冒险",
        "动物"
      ]
    },
    "animal-cafe-rush": {
      "gameplay": "图像订单咖啡馆闯关",
      "genre": [
        "时间管理",
        "配对",
        "动物",
        "儿童"
      ],
      "skills": [
        "专注",
        "顺序理解",
        "问题解决"
      ]
    }
  };
  localizedGames["zh-Hans"] = {};
  localizedGames["zh-Hans"]["wonder-crash"] = {
    "title": "奇幻狮子防卫",
    "difficulty": "中等",
    "time": "5～8 分钟",
    "gameplay": "横向移动自动射击防卫",
    "genre": [
      "动作",
      "守城",
      "动物"
    ],
    "skills": [
      "反应",
      "专注",
      "手眼协调"
    ],
    "intro": "《奇幻狮子防卫》是由爆鬃狮雷欧担任主角的 30 关动物守城游戏。玩家沿著奇幻城墙左右移动，装备的橡皮擦、铅笔与尺会依各自冷却时间自动攻击。八种野兽依直线、左右交替、外侧与中央四种编队进攻，每五关还有一种不同攻击规则的王。波次之间可选本场强化，结算后再用保存的金币提升雷欧、装备或城墙。Kids 版本没有计时压力，也永久无广告。",
    "story": [
      "爆鬃狮雷欧守护 WeightPlay 魔法文具库外的城墙。野猪、鬣狗、犀牛、水牛、猛鹰、黑熊、老虎与鳄鱼受到铅笔、尺和橡皮擦中的魔力吸引而来。雷欧不能离开城墙，因此玩家要在墙前巡守，让自动武器对准危险路线，并在一场防卫结束后修补长期伤害。",
      "战役分成六条、每条五关的防卫路线。第 5、10、15、20、25、30 关各有一位野兽指挥者；首次通关会开启下一关，王关首次通过还会取得已记录的钻石奖励。击退第 30 关黑熊星落王与完整兽群，代表文具库可以重新安全开放。"
    ],
    "systems": [
      "玩家可在战场点击或拖曳，让雷欧水平移动；桌面键盘聚焦后也能用左右方向键。每个装备栏有独立冷却，即使装备重复武器也会分别射击。铅笔、尺与橡皮擦在速度、伤害、大小与节奏上各有差异。",
      "每关有三到七波。击败野兽可取得金币，城墙必须在最后一只敌人倒下前保留至少一点生命。波次之间可从三个选项挑一项，强化伤害、冷却、数量、侧射、连射、大小、穿透、溅射、击败回复、金币、减速或立即修墙。",
      "八种敌人不是只换图片：野猪与老虎高速前进，鬣狗与黑熊左右走曲线，犀牛用护甲降低第一次伤害，水牛与鳄鱼擅长破墙，猛鹰会突然俯冲。每关指定敌人编成与进场位置，后段不再只是所有野兽随机出现。",
      "六位王各有独立规则：野猪王快速追击；鬣狗王发射成对交叉弹；犀牛王先用六层护盾吸收攻击并投出重弹；水牛王向城墙中央发射大型攻城弹；猛鹰王俯冲并连射两发高速弹；黑熊王施放三连星落。",
      "最高关卡、永久强化、装备、金币与已领取的王关钻石都存在目前浏览器。结算会显示剩余墙血、击败数、强化选择与奖励，再提供下一关、重玩或回选单。"
    ],
    "how": [
      "开启战斗页，左右滑动关卡轨道并选择已解锁关卡。",
      "开战前查看关卡名称、敌人图片、编队提示、波数与王关标记。",
      "把雷欧移到最需要火力的路线下方；武器会自动射击。",
      "每波结束选一个强化，依下一波敌人编成调整打法。",
      "在所有普通野兽与王被击败前，让城墙生命保持在零以上。",
      "用结算奖励永久提升角色、装备或城墙，再继续或重玩。"
    ],
    "strategyTips": [
      "穿透与溅射适合固定直线或中央重兵；侧射适合左右交替与外侧进攻。",
      "不用追逐每一只快兽；守住有效射线，看到猛鹰或老虎加速时提早移动。",
      "对抗犀牛护盾王时，先用快速多发攻击拆掉六层护盾，再让高伤害武器发挥。",
      "水牛攻城与鳄鱼攻城等破墙关卡，修墙与击败回复的价值更高。",
      "最终黑熊星落王会分散三发较弱投射物；广域伤害可控制混合护卫，移动则用来维持危险路线的火力。"
    ],
    "progression": [
      "第 1～5 关教直线、左右入口与鬣狗曲线；野猪追击王在混合护卫后方快速瞄准射击。",
      "第 6～10 关加入中央重甲、破墙兽、曲线施法兽与天空急袭；鬣狗交叉火网王会在双侧兽群间发射成对投射物。",
      "第 11～15 关刻意分离敌人角色，让玩家比较穿透、速度覆盖与修墙。犀牛护盾王必须先承受六次破盾攻击。",
      "第 16～20 关把俯冲猛鹰与重甲、曲线路线混合；水牛攻城王用大型慢速重弹直接威胁城墙中央。",
      "第 21～25 关组合护甲快攻、曲线冲刺、重兽城门与侧翼破墙；猛鹰王会反复加速并射出两发高速弹。",
      "第 26～30 关用四种编队复习八种角色；黑熊星落王以三发投射物和完整兽群收尾，不是前一位王的数值放大版本。"
    ],
    "designNote": "我们采用自动射击，让玩家持续思考雷欧该站在哪里，而不是在手机上反复确认小型射击按钮是否按到。每个装备栏的独立冷却保留配装价值，波次强化则提供短暂的策略停顿。本次 30 关改造以指定敌人编成与四种清楚的进场阵形取代旧后段的全种类随机，再用六种王的投射物规则建立里程碑。手机点击、拖曳与桌面方向键都控制同一个有边界的逻辑战场。本作比《动物颜色便当盒》更要求反应与配装，但仍遵守 Kids 规则：无广告、无倒数压力、可支持性重试，能力报告也不是正式评量。",
    "parent": "本作包含卡通动物攻城、自动文具武器、城墙生命与强化选择，可陪伴孩子练习反应、专注、规划与手眼协调。能力报告与星等只是依本场墙血、击败数与选择整理的游戏回馈，不是发展、医疗或学校测验。Kids 页面没有广告，也不需要登入；进度保存在目前浏览器，清除网站资料可能会移除纪录。",
    "faq": [
      [
        "一共有多少关？",
        "共有 30 个具名关卡，分成六条五关路线，王关位于第 5、10、15、20、25、30 关。"
      ],
      [
        "武器会自动攻击吗？",
        "会。每个装备栏依自己的冷却时间射击，玩家负责移动雷欧与选择波次强化。"
      ],
      [
        "后段关卡为什么不同？",
        "各关指定敌人编成与直线、交替、外侧或中央阵形，六位王也有不同投射物规则。"
      ],
      [
        "城墙生命归零会怎样？",
        "本次防卫结束，可选择重试或回关卡；已保存的永久进度不会因此消失。"
      ],
      [
        "王关钻石怎么取得？",
        "每个王关只有首次通关会取得记录中的钻石奖励，重玩仍会有一般关卡收益。"
      ],
      [
        "不用滑鼠也能玩吗？",
        "可以。触控支援点击与拖曳，桌面战斗聚焦后可用左右方向键。"
      ],
      [
        "Kids 版本有广告或需要帐号吗？",
        "没有广告请求，也不需要登入；进度只存在目前浏览器。"
      ],
      [
        "能力报告是正式测验吗？",
        "不是。墙血、击败数、选择、星等与分数只代表这一场游戏。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["color-lunchbox"] = {
    "title": "动物颜色便当盒",
    "difficulty": "简单",
    "time": "1～3 分钟",
    "gameplay": "图片颜色分类",
    "genre": [
      "幼儿",
      "教育",
      "动物"
    ],
    "skills": [
      "颜色辨识",
      "专注力",
      "手眼协调"
    ],
    "intro": "《动物颜色便当盒》是一款以图片为主的温和分类游戏，共有 30 个、每关固定五份食物的短关卡。孩子要协助六位动物守护员准备野餐、早餐、花园与庆典便当，把食物放进符合实际颜色的盒子。后段会加入相近颜色、无害的空盒、只看图片的提示，以及答对后才安全换位的便当盒。游戏没有计时、广告或失败画面，选错只会得到友善提示并再次尝试。",
    "story": [
      "彩虹食材库负责替六条社区路线的动物朋友准备餐点。食材标签被风吹散后，草莓、米饭、鱼、蔬菜、饮料和点心都需要依颜色放回正确便当盒。玩家扮演食材库小帮手；完成五次配对，就能装好一份配送便当并开启下一站。",
      "咪咪、欧拉、诺里、波哥、塔罗与菲亚分别在第 5、10、15、20、25、30 关等候。他们不会战斗，也不会因错误处罚玩家，而是带来一次换位、每题安全换位、图片优先、额外空盒、中途镜像与综合规则。完成菲亚的彩虹庆典检查，代表六条路线都收到分类正确的便当。"
    ],
    "systems": [
      "每关固定出现五份食物。画面中央显示大型食物图片，便当盒以清楚色块呈现；玩家可以点盒子，也可以把食物拖到盒子上，两种操作使用完全相同的判定。",
      "答对会推进五分之一进度，并把食物贴纸加入结算游行。答错不扣生命、不重置关卡，盒子仍可继续选择。",
      "图片模式只在视觉上隐藏食物与颜色名称，萤幕阅读器仍保留完整标签。干扰盒只是本关没有食物使用的颜色，正确答案一定存在。会移动的盒子只在答对后换位，拖曳进行中绝不移动。",
      "最高解锁关卡只储存在目前浏览器。玩家可重玩任何已解锁关卡；完成第 30 关后不会产生不存在的第 31 关，彩虹庆典仍可再次挑战。"
    ],
    "how": [
      "在横向关卡路径选择已解锁的关卡。",
      "观察大型食物图片，对照各便当盒的颜色色块。",
      "点选正确盒子，或把食物拖到盒子上。",
      "若盒子在答对后换位，先等动画停稳再选下一题。",
      "完成五份食物即可观看贴纸游行并解锁下一关。"
    ],
    "strategyTips": [
      "先说出食物名称，再观察它的实际颜色；遇到相近暖色或冷色时会更容易比较。",
      "图片关卡不必寻找文字，直接看食物外形与大型色块。",
      "看到额外空盒时先逐一排除，不需要快速猜测。",
      "盒子换位后重新扫视整排；位置改变，但颜色不会改变。"
    ],
    "progression": [
      "第 1～5 关以固定盒位与熟悉食物建立基本配对；咪咪会在第三次答对后进行一次换位。",
      "第 6～10 关比较暖色、冷色、明色与暗色，并加入图片野餐；欧拉会在每次答对后重新排列盒子。",
      "第 11～15 关加入红与粉红、蓝与青等相近颜色，以及一个无害空盒；诺里把图片提示与干扰盒结合。",
      "第 16～20 关依蔬菜、水果、早餐与点心分组；波哥的自助餐用七个盒子搭配五份食物，增加观察而不延长局数。",
      "第 21～25 关进一步组合换位与图片配对；塔罗会在花园检查中途把盒位镜像交换一次。",
      "第 26～30 关加入六盒彩虹、暖冷交替、两个空盒与连续安全换位；菲亚的最终庆典同时使用图片提示、一个空盒和每题换位。"
    ],
    "designNote": "我们把每关固定为五份食物，让幼儿能在短时间内完成一个有开始与结束的任务。点击与拖曳并存，是为了兼顾手机、平板、滑鼠与不同操作习惯。难度来自观察而不是速度：相近颜色、额外空盒与位置变化会逐项加入，盒子移动时也会锁定输入并显示清楚动画。六位守护员替 30 关提供容易记住的里程碑，但不把幼儿分类游戏变成战斗。与 WeightPlay 的动作游戏不同，本作没有计时、生命、广告或失败状态，重点是安静重复练习与清楚的完成感。",
    "parent": "本游戏可陪伴孩子练习颜色辨识、视觉比较、专注与手眼协调。成人可以请孩子说出食物名称，或比较两种相近颜色，但游玩不需要阅读。进度与分数只保存在目前浏览器，仅供游戏回馈，不是发展测验、诊断或学校评量。",
    "faq": [
      [
        "不识字也可以玩吗？",
        "可以。食物图片与颜色色块就是主要指示，图片模式还会刻意隐藏可见答案文字。"
      ],
      [
        "一共有多少关？",
        "共有 30 关，每关固定五份食物，并在每五关安排一次动物守护员检查。"
      ],
      [
        "为什么有些便当盒会移动？",
        "部分后段关卡会在答对后换位。动画期间会暂停输入，拖曳途中也绝不移动。"
      ],
      [
        "额外盒子会让关卡无解吗？",
        "不会。干扰盒只是没有食物使用的颜色，每一题的正确盒子一定存在。"
      ],
      [
        "游戏有计时或失败吗？",
        "没有计时、生命限制或失败画面；答错会得到友善提示并再次尝试。"
      ],
      [
        "关卡进度会保留吗？",
        "最高解锁关卡会存在目前浏览器；清除网站储存资料可能会移除进度。"
      ],
      [
        "这款 Kids 游戏有广告吗？",
        "没有。本作不发出广告请求，也不保留广告空间。"
      ],
      [
        "分数是能力评量吗？",
        "不是。分数与进度只是游戏回馈，不代表孩子的发展或能力。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["bubble-bakery"] = {
    "title": "动物泡泡烘焙坊",
    "difficulty": "简单到中等",
    "time": "3～5 分钟",
    "gameplay": "泡泡连线订单益智",
    "genre": [
      "益智",
      "烘焙",
      "动物"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "专注"
    ],
    "intro": "《动物泡泡烘焙坊》是由 Panko 烘焙教练带领的 30 关步数制配对益智游戏。玩家点击相连的兔兔、鲸鱼、小鸡、青蛙或狐狸泡泡，完成不同烘焙盘的订单。7×10 棋盘会在每次消除后向下掉落并从上方补入新泡泡。后段加入群组门槛、依序订单、双盘与三盘配送、最大群组目标和大批量加成；每五关还有一次友善 Panko 检查。Kids 版本永久无广告。",
    "story": [
      "Panko 经营一间用动物图片印章代替文字食材单的小烘焙坊。兔兔代表莓果点心、鲸鱼代表海洋杯子蛋糕、小鸡代表阳光糕点、青蛙代表花园卷、狐狸代表莓果蛋糕。配送车会在有限步数后抵达，因此玩家要替 Panko 组合相连印章，在车子离开前完成画面上的烘焙盘。",
      "30 张订单分成六堂烘焙课。Panko 会在第 5、10、15、20、25、30 关检查工作台，但这些是友善食谱测验，不是战斗。完成第 30 关 Panko 大师烘焙坊，代表能依序服务三盘、做出六个泡泡的大批次，并开放所有烘焙盘供玩家重玩与补满星星。"
    ],
    "systems": [
      "棋盘始终有 70 个原生泡泡按钮，排列为七栏十列。相同泡泡只有上下或左右接触才算连线，斜角不相连。被选中的泡泡会在原格缩小消失，上方泡泡再掉落，新的泡泡从遮罩上缘进入。",
      "每次有效消除使用一步。只有目前有效的订单动物会减少烘焙盘计数，非目标群组仍可用来改变棋盘。连续命中订单会累积连击和分数；结算星等依剩余步数计算，能力报告则记录订单命中、最大群组与最高连击。",
      "群组门槛关卡要求至少三个或四个泡泡才能消除。依序订单会一次亮起一种动物；提早消除后面的动物只会改变棋盘，不会推进其数量。加成关卡让四、五或六个以上的大群组额外计入目前订单。",
      "多盘关卡在下一张食谱出现时保留同一棋盘与剩余步数。最大群组关卡除了完成订单，还要至少一次达到显示的群组大小。第 30 关会同时使用三张食谱、四个群组门槛、依序目标、六个加成门槛与最大群组六的要求。",
      "已解锁关卡、最佳星等、关卡分数证据、常客印章、贴纸数、游玩次数与最高到达关卡都存在目前浏览器。游玩不需要登入；清除网站资料可能会移除这些纪录。"
    ],
    "how": [
      "从横向关卡轨道选择已解锁的烘焙盘。",
      "点击前先看动物订单方块与精简规则符号。",
      "点击两个以上上下或左右相连的相同泡泡；后段可能要求三个或四个。",
      "只有需要整理棋盘时，才使用不属于目前订单的消除。",
      "在步数归零前完成每张食谱，以及画面显示的最大群组目标。",
      "从结算继续、重试、回关卡，或重玩旧订单取得更多星星。"
    ],
    "strategyTips": [
      "先从棋盘底部观察；消除较低群组会移动更多泡泡，也更容易产生新连线。",
      "依序订单中，先保留尚未亮起的动物群组，等轮到它时再使用。",
      "群组门槛关卡不要浪费步数点小群组；先消除附近泡泡把它们合在一起。",
      "大批量加成可节省步数，但最大群组关卡仍需至少一次达到指定大小。",
      "多盘配送不会重置棋盘，因此第一盘结束前就要替下一张食谱保留有用群组。"
    ],
    "progression": [
      "第 1～5 关建立基本连线、双目标选择、第一次群组大小目标与四个泡泡加成；Panko 初次检查只接受三个以上群组，并要求一次四个群组。",
      "第 6～10 关专注大型批次，门槛从三个提高到四个；Panko 大批次检查要求所有订单都用四个以上群组完成，并做出一次五个群组。",
      "第 11～15 关加入依序队列，只有亮框动物会推进；Panko 队列检查把相同规则带进两张连续食谱。",
      "第 16～20 关加入双道与三道服务。棋盘与步数会跨盘延续，因此第一盘完成前就要替下一盘准备。",
      "第 21～25 关把队列、群组门槛、加成、多张食谱与群组目标交叉组合；Panko 庆典检查要求以三个以上群组完成两张依序烘焙盘。",
      "第 26～30 关是大师订单，重点是大型群组与三盘规划，不只是提高数量；最终关明确结合四个门槛、依序目标、大批量加成、三张食谱与六个群组目标。"
    ],
    "designNote": "我们把棋盘固定为 7×10，因为它能填满直向手机，同时保留圆形泡泡比例和真正规划群组的空间。战斗页只有点击动作，但每次消除都会改变重力、后续连线、订单连击与剩余步数。本次 30 关改造加入会改变『哪一组值得点』的规则，而不是只提高订单数。Panko 检查提供容易记住的难度里程碑，也不会把烘焙益智游戏变成战斗。键盘与萤幕阅读器玩家会取得动物、列、栏、群组大小、有效订单与目前门槛等完整资讯。与直接单件分类的《动物颜色便当盒》不同，本作要求玩家持续重塑同一棋盘并提前规划数步。",
    "parent": "《动物泡泡烘焙坊》可陪伴孩子练习视觉分组、计数、规划、专注与简单问题解决。成人可以询问为什么底部消除会改变棋盘，或哪一组应保留给下一盘。游戏没有计时、广告、帐号要求或排名压力；星等、分数、印章、贴纸与能力报告只是保存在本机的游戏回馈，不是智力测验、诊断或正式学校评量。",
    "faq": [
      [
        "一共有多少关？",
        "共有 30 个具名关卡，分成六堂五关课程，每五关有一次友善 Panko 检查。"
      ],
      [
        "哪些泡泡算相连？",
        "相同泡泡必须上下或左右接触；只碰到斜角不算同一群组。"
      ],
      [
        "为什么相同群组没有填入订单？",
        "关卡可能要求更大的最低群组，或正在依序等待另一种有亮框的动物。"
      ],
      [
        "切换到下一张食谱会发生什么？",
        "订单计数会换成新食谱，但棋盘与剩余步数继续保留。"
      ],
      [
        "大批量加成怎么计算？",
        "在标记关卡达到显示门槛时，该群组会替目前有效订单多计入泡泡。"
      ],
      [
        "步数归零会怎样？",
        "未完成订单会显示支持性重试结算，已保存的解锁与旧星等不会消失。"
      ],
      [
        "需要登入或会显示广告吗？",
        "不需要登入；这款 Kids 游戏没有广告，进度只存在目前浏览器。"
      ],
      [
        "能力报告是正式测验吗？",
        "不是。它只整理本场订单命中、最大群组、连击、分数与剩余步数。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-zoo-idle"] = {
    "title": "动物小小乐园",
    "age": "6+",
    "difficulty": "简单至中等",
    "time": "每个挑战约 4 至 12 分钟",
    "skills": [
      "规划",
      "专注",
      "顺序思考",
      "动物照顾"
    ],
    "intro": "动物小小乐园是一款有 30 个存档挑战的温和乐园经营游戏。游客走进草原、购买门票并慢慢装满售票箱；玩家则照顾动物、升级点心摊、观景台与保育员站、扩建入口，并重新安排栖地。最后可让狮子、长颈鹿、大象、猫熊、企鹅等十二种动物加入。每五关都有一次友善的乐园审查，让持续成长有明确目标，而不是只等待数字增加。",
    "story": [
      "草原起初只有简单入口、少数动物与大片可运用空间。玩家担任年轻的乐园管理员。真正长久的乐园不只需要游客：动物要定期照顾，栖地位置要妥善安排，服务设施也必须跟上人潮。",
      "Mimi、Panko、水獭观察员、犀牛保育员与企鹅游行队会在每五关前来检查。通过审查代表乐园已学会基础照顾、野餐服务、观景规划、保育支援、游行接待，最后完成盛大草原节所需的整体平衡。"
    ],
    "how": [
      "从横向关卡列选择已解锁的挑战。",
      "进入乐园前先读完所有目标，再决定是否收票或花费。",
      "整理栖地可提高快乐值，丰富活动则可取得门票收入。",
      "依目标升级入口、招募动物、改善设施，或拖曳动物改变栖地位置。",
      "所有目标完成后领取奖励，再前往下一个挑战。"
    ],
    "systems": [
      "游客会持续把门票放入售票箱；每个首次完成的挑战还会提供少量永久收入加成。",
      "整理栖地与丰富活动共用短暂冷却时间，因此要依当前目标选择。",
      "入口共有八级；招募的动物与三种各四级的设施会保留在这个浏览器存档。",
      "栖地排列目标会计算草原中真正的位置变化，不是只按一下按钮。",
      "成长报告整理目前乐园状况；挑战结果会解锁下一关，并提供下一个挑战或返回关卡。"
    ],
    "progression": [
      "第 1 至 5 关教授收票、照顾与移动栖地，最后接受 Mimi 审查。第 6 至 10 关比较两种照顾方式、要求保留装满的售票箱，并在 Panko 野餐前加入点心摊。",
      "第 11 至 15 关加入观景台、更大的排列任务与快乐值目标。第 16 至 20 关加入保育员站，并在犀牛保育审查中混合照顾、动物数量与设施规划。",
      "第 21 至 25 关扩大入口与动物阵容，准备企鹅游行。第 26 至 30 关把预算、三种设施、快乐值、栖地排列与收入整合成盛大草原节。"
    ],
    "strategyTips": [
      "花费前先读全部目标，招募动物与升级设施可能会争用同一笔门票。",
      "需要快乐值时选整理栖地；收入不足时选丰富活动。",
      "若目标要求售票箱已满，不要太早把票收走。",
      "拖曳动物时要移动明显距离，才会算一次重新排列。",
      "永久升级会带到后续关卡，但每关的首次完成收入加成只会发放一次。"
    ],
    "designNote": "游戏使用持续运作的经济，让孩子在没有严格倒数或战斗的情况下观察因果。等待不是唯一活动；每关都要求收集、照顾选择、栖地排列、招募与升级的真实组合。30 关横向关卡列让成长旅程清楚可见，本机存档则避免每次回来都重建同一个乐园。大按钮与直接拖曳同时照顾手机触控和滑鼠操作。检查点采友善乐园审查，而不是首领战，因为核心想像是一起改善动物生活空间。",
    "parent": "本作可用来练习简单规划、注意、顺序思考，并和孩子讨论动物照顾。大人可询问为何要保留门票、选择某种照顾方式，或把动物移到另一个位置。游戏没有战斗、排名压力、帐号要求，也不会在 Kids 页面发出广告请求。挑战进度、升级与报告只是在本机保存的游戏回馈，不是学校、健康或发展评量。",
    "faq": [
      [
        "共有几个挑战？",
        "共有六段 30 关，并在第 5、10、15、20、25、30 关进行友善乐园审查。"
      ],
      [
        "为什么有时不能立刻收售票箱？",
        "部分挑战要求先准备一个装满的售票箱；完成该目标后再收取。"
      ],
      [
        "两种照顾行动有什么差别？",
        "整理栖地提高快乐值，丰富活动提供门票，两者共用短暂冷却。"
      ],
      [
        "怎样才算重新安排栖地？",
        "把动物拖到明显不同的位置；很小的误触移动不会计算。"
      ],
      [
        "过关后乐园会重置吗？",
        "不会。动物、入口、设施、金币与已解锁关卡都会留在本机存档。"
      ],
      [
        "可以重玩以前的关卡吗？",
        "可以重玩任何已解锁关卡，但首次通关的永久收入加成只会取得一次。"
      ],
      [
        "需要登入或会显示广告吗？",
        "不需要帐号；这款 Kids 游戏也不会发出广告请求。"
      ],
      [
        "进度存在哪里？",
        "进度存在目前浏览器；清除网站资料或更换装置可能会失去或分开存档。"
      ],
      [
        "成长报告是能力测验吗？",
        "不是，它只是游戏内摘要，不是正式评量。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-rope-rescue"] = {
    "title": "动物藤蔓救援",
    "age": "6+",
    "difficulty": "简单到中等",
    "time": "2～6 分钟",
    "gameplay": "藤蔓物理解谜",
    "genre": [
      "物理",
      "益智",
      "动物"
    ],
    "skills": [
      "手眼协调",
      "问题解决",
      "专注"
    ],
    "intro": "《动物藤蔓救援》是一款 30 关动物物理解谜游戏。玩家要切断挂著水果的藤蔓、持续移动叶子弹垫，最后把水果送进等待动物的篮子。六组五关课程会逐步加入移动篮子、上下分层风向、弹跳后反转的风、双重弹跳、较窄入口，以及两份或三份连续野餐配送。每五关有一次友善 Panko 检核，不加入战斗或计时压力。",
    "story": [
      "果园里的配送藤蔓长过了森林空地，让苹果、香蕉和莓果挂在离订购动物很远的地方。Panko 负责整理救援地图，兔子、狮子、熊猫、狐狸和无尾熊则在篮子旁等待。玩家扮演叶子引导员，决定弹垫放在哪里、何时切断藤蔓，并在水果飞行时持续修正位置。",
      "完成全部 30 关代表重新打通六条果园配送路线。最终 Panko 终极救援会在同一个游玩画面服务三只动物，并结合分层风、移动篮与双重弹跳。胜利代表完成整场野餐配送，而不是打败敌人。"
    ],
    "systems": [
      "每条路线开始时都有挂在藤蔓上的水果、可移动的叶子弹垫与篮子目标。切断前后都能移动叶子。水果至少要碰到叶子一次，篮子才会接受它，因此只把水果直接落在动物上方并不能过关。",
      "水果会受到该关重力与目前风力影响。叶子依照接触位置提供向上速度与水平推力：碰在中央会弹得较直，碰到左右边缘则会飞得更远。飞出场外或错过篮子会进入友善重试结算，不会删除已保存的进度。",
      "移动篮关卡会在切断后持续改变接取位置。分层风关卡在空地上半部与下半部使用不同推力；反转风会在第一次碰叶后改变方向。双弹关卡会锁住篮子直到完成第二次弹跳，柔叶关卡则降低弹跳高度，要求玩家更贴近水果。",
      "连续配送会把玩家留在同一个游玩画面。每次成功后会换成下一份水果、动物与路线，配送数从 1/2 或 1/3 前进；只有全部水果都进篮，才会显示结算。",
      "最高解锁关卡、各关最佳星等、最佳分数与游玩次数保存在目前浏览器。不需登入；清除网站资料可能移除这些本机纪录。"
    ],
    "how": [
      "从横向关卡轨道选择已解锁的救援卡。",
      "先阅读关卡名称、水果到动物的路线，以及规则提示。",
      "用触控、滑鼠或左右方向键移动叶子，再按切断。",
      "水果落下时持续移动叶子，利用接触位置改变飞行方向。",
      "依提示完成弹跳次数，并追踪移动篮或变化风向。",
      "完成路线中的每份水果配送，解锁下一关。"
    ],
    "strategyTips": [
      "切断前先把叶子放到第一次掉落路线下方，水果移动后再做小幅修正。",
      "碰叶子中央可以取得高度；只有篮子在远方时，才使用叶子左右边缘增加水平距离。",
      "面对移动篮时，要瞄准水果弹回来时篮子将到达的位置。",
      "分层风关卡可比较水果越过空地中段前后的方向变化。",
      "双弹关卡第一次接触后仍需保持控制，不要把水果送得太远而接不到第二次。",
      "野餐配送要阅读下一份规则，不要假设第二颗水果使用相同风向或弹跳次数。"
    ],
    "progression": [
      "第 1～5 关教导平静、右风、左风与长距离弹跳；Panko 平衡检核首次加入缓慢移动篮。",
      "第 6～10 关专注移动目标，改变篮子速度、方向与入口大小；Panko 移动篮检核还要求两次叶子接触。",
      "第 11～15 关加入依高度变化或弹跳后反转的风；Panko 风向检核把分层风与移动篮结合。",
      "第 16～20 关要求双重弹跳，并加入会产生较低弧线的柔叶；Panko 双弹检核同时使用反向风与移动篮。",
      "第 21～25 关加入不离开游玩画面的双水果野餐配送。两条路线可能使用相反风、不同弹跳次数，或共用一个移动篮。",
      "第 26～30 关结合窄入口、移动目标、分层与反转风、双弹控制，以及两份或三份配送；Panko 终极救援使用三种不同路线，不是只增加数字。"
    ],
    "designNote": "游戏采用一次切断加上持续叶子控制，让玩家在水果释放后仍然负责。30 关会改变玩家必须判读的资讯，包括目标移动、不同高度风向、弹跳次数、叶子弹力、入口宽度与配送顺序，而不只是让重力越来越快。直向游玩区让手机上的水果有足够飞行时间可修正，同一逻辑画布也会在平板与横向画面等比例缩放。Panko 检核提供适合 Kids 的难度里程碑，不会把水果配送益智变成战斗。",
    "parent": "《动物藤蔓救援》可陪伴孩子练习时机、视觉预测、手眼协调、专注与简单问题解决。成人可以询问篮子接下来会移到哪里，或第二次弹跳为何需要不同叶子位置。游戏没有计时、广告、帐号要求、排名压力或敌对战斗；星等与进度只是本机游戏回馈，不是正式能力测验、诊断或学校评量。",
    "faq": [
      [
        "一共有多少关？",
        "共有 30 个具名关卡，分成六组五关课程，每五关有一次友善 Panko 检核。"
      ],
      [
        "切断藤蔓后还能移动叶子吗？",
        "可以。水果下落与每次弹跳后持续控制叶子，是游戏的主要操作。"
      ],
      [
        "为什么水果穿过篮子？",
        "每份配送至少需要一次叶子弹跳；标记关卡可能要求两次弹跳或使用较窄入口。"
      ],
      [
        "移动篮与分层风怎么运作？",
        "移动篮会在切断后改变水平位置；分层风会在空地上半部与下半部施加不同推力。"
      ],
      [
        "野餐配送会发生什么？",
        "两颗或三颗水果会留在同一个游玩画面连续配送，全部完成后才显示结算。"
      ],
      [
        "水果没接到会怎样？",
        "友善结算会提供再玩一次、选关或大厅，不会删除已解锁进度。"
      ],
      [
        "需要登入或会显示广告吗？",
        "不需要登入；这款 Kids 游戏没有广告，基本进度只存在目前浏览器。"
      ],
      [
        "星等是正式能力分数吗？",
        "不是。星等只是游戏进度回馈，不是诊断或评量。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["star-memory"] = {
    "title": "动物星星翻牌",
    "age": "6+",
    "difficulty": "简单至具挑战性",
    "time": "每关约 2 至 8 分钟",
    "skills": [
      "记忆",
      "专注",
      "问题解决"
    ],
    "intro": "《动物星星翻牌》是一段有 30 关的夜空图片配对旅程。玩家帮助六位友善的星光守护者重新连起动物星座。前期从经典配对开始，之后透过开场预览、答错后月光洗牌、指定动物顺序，以及答对后星座移位，改变每一关需要使用的记忆方法。每五关都有一次守护者检查，第 30 关会在完整十二组牌面同时使用四种进阶规则。",
    "story": [
      "动物星图原本会在日落后引导森林、河流、草原与极地动物回家。一场温和流星雨没有破坏星图，却把每一颗动物星光分成两张隐藏卡牌。玩家成为守护者的年轻读图员，把每组图案重新连起来，让星座再次发亮。",
      "猫咪、熊熊、猫头鹰、狮子、企鹅与无尾熊各自守护一段五关课程。通过守护者检查，就代表那一区夜空已修复；完成最后的无尾熊终极星光检查，表示十二种动物星座都回到正确路线。"
    ],
    "how": [
      "从横向关卡列选择已解锁关卡。",
      "翻开两张卡牌并记住两个位置。",
      "图案相同会保留为已完成配对；不同时会先停留片刻再盖回去。",
      "先读规则标签，后期可能预览、洗牌、要求指定顺序，或在答对后移动隐藏图案。",
      "在步数内清除全部配对，即可解锁下一关。"
    ],
    "systems": [
      "经典关卡不会移动隐藏图案，重点只有位置记忆。",
      "预览关卡会先短暂翻开完整牌面，输入会锁定，全部盖回后才开始计步。",
      "月光洗牌会在猜错后移动尚未配对的相同图案，玩家必须更新记忆，不能重复旧位置。",
      "顺序关会指定下一组动物；找到其他正确配对仍会盖回，且不会推进进度。",
      "星座移位会在成功配对后，把所有剩余隐藏图案轮转一格。",
      "步数、配对、最佳连续、分数、星星、关卡解锁与最佳成绩只提供本机进度回馈，没有公开排行榜。"
    ],
    "progression": [
      "第 1 至 5 关教授经典位置配对，最后进行猫咪的开场预览检查。第 6 至 10 关逐渐缩短预览时间，并在熊熊检查加入一次开场洗牌。",
      "第 11 至 15 关加入答错洗牌。第 16 至 20 关要求依提示动物顺序完成，最后在狮子检查把顺序与洗牌结合。",
      "第 21 至 25 关会在答对后旋转剩余星座。第 26 至 30 关混合预览、顺序、洗牌与旋转，最后以十二组全规则牌面收尾。"
    ],
    "strategyTips": [
      "预览时分列或分小区观察，不要一次勉强记住整个牌面。",
      "月光洗牌后放下旧位置，从新翻开的卡牌重新建立地图。",
      "顺序关先找出指定动物，再处理已知道位置的其他配对。",
      "星座移位后可记住哪些图案仍存在，但不能再相信原本位置。",
      "利用猜错后的短暂停留，同时比较两张牌再更新记忆。"
    ],
    "designNote": "游戏先用熟悉的配对规则让操作立即可懂，再借由改变『哪些资讯仍然可靠』建立深度。预览测试第一印象，洗牌练习更新记忆，顺序改变目标优先，旋转则让一次成功选择改变下一个决定。所有机制沿用同一组大型图片卡牌，不增加手机或键盘操作负担。守护者检查采友善修复星图的方式，不使用战斗；步数限制提供明确结束点，重试仍然快速且正向。",
    "parent": "本作可用来练习视觉回忆、注意、弹性更新与遵循短顺序。大人可以询问洗牌后哪些位置仍可信，或为什么要先找到指定动物。游戏没有战斗、帐号要求、公开排名，也不会在 Kids 页面发出广告请求。星星与技能报告只是本机游戏鼓励，不是智力、学校、健康或发展评量。",
    "faq": [
      [
        "共有几关？",
        "共有六段 30 关，守护者检查位于第 5、10、15、20、25、30 关。"
      ],
      [
        "月光洗牌会做什么？",
        "猜错后，相同的一组未配对图案会移到不同的隐藏位置。"
      ],
      [
        "为什么找到相同图案却又盖回去？",
        "顺序关会在提示列指定下一组必须完成的动物。"
      ],
      [
        "星座移位是什么？",
        "成功配对后，所有剩余隐藏图案会轮转一格。"
      ],
      [
        "开场预览会消耗步数吗？",
        "不会。预览期间无法操作，全部盖回后才开始游玩。"
      ],
      [
        "可以重玩关卡吗？",
        "可以重玩任何已解锁关卡，改善本机分数或星星。"
      ],
      [
        "进度会保存吗？",
        "已解锁关卡、星星与最佳分数存在这个浏览器，不需要登入。"
      ],
      [
        "Kids 页面有广告吗？",
        "没有，这款游戏不会发出广告请求，也没有广告保留区。"
      ],
      [
        "技能报告是正式记忆测验吗？",
        "不是，它只整理本局的配对、步数与连续成功。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["campus-dash"] = {
    "title": "草原闪电跑",
    "age": "9+",
    "difficulty": "渐进挑战",
    "time": "1-4 分钟",
    "gameplay": "路线闪避跑酷",
    "genre": [
      "跑酷",
      "反应",
      "动物"
    ],
    "skills": [
      "反应",
      "专注",
      "手眼协调"
    ],
    "intro": "草原闪电跑是一款拥有 30 条可存档路线、六大区域的三线动物跑酷。星爪狐要恢复草原导航星，玩家必须根据星星轨迹、双路障碍门、黏滑泥漥与守护者阵型改变跑法，不是只有速度上升。",
    "story": [
      "晨曦草原、金合欢路口、泽光弯道、赤峡跑道、月水保护区与王冠草原共用一条导航星路网。",
      "星爪狐带著新星星通过每条路线，并接受斑马、牺牛、河马、飞鹰、狮群与象王冠守护者的检查。通过第 30 关代表六大区域重新连线。"
    ],
    "how": [
      "在水平 Stage 路线上选择已解锁关卡，先阅读目标与路线规则。",
      "点击画面左右侧、滑动，或使用 A、D 与方向键，每次移动一条跑道。",
      "收集星星累积分数与连击，避开路锥、行囊、书堆与水漥。",
      "计时结束后，达成到达终点、收集星星、连击、低碰撞或目标分数之一。",
      "成功会存档并解锁下一关；再跑一次会重试目前关卡。"
    ],
    "systems": [
      "开放草径用单个障碍教学；星星轨迹增加收集线；双路障碍门只留一条安全路；黏滑泥漥会短暂放慢换道；守护者阵型有可观察的固定安全节奏。",
      "星星基础分数为 50 乘以目前倍率。连续收集会提高下一颗星的倍率；碰到障碍会扣 80 分并重置为 x1。",
      "关卡目标包含到达终点、星星数量、最佳连击、碰撞上限与目标分数五种。",
      "关卡进度与本机前 5 名分开储存在这个浏览器，不需要登入。"
    ],
    "progression": [
      "第 1-5 关教学障碍、星轨、双门与连击，最后是斑马检查。",
      "第 6-10 关交替收集与低碰撞门阵，最后是牺牛检查。",
      "第 11-15 关加入黏滑泥漥，最后是河马水道检查。",
      "第 16-20 关结合分数、连击、重复门阵与安全星提示，最后是飞鹰检查。",
      "第 21-25 关混合泥漥、门阵与夜间星链，最后是狮群检查。",
      "第 26-30 关复习全部规则；象王冠守护者会混合四种进阶规则并要求收集 15 颗星星。"
    ],
    "strategyTips": [
      "看双门中间的空路，不要只盯著障碍。",
      "低碰撞关卡要先保留容错，不必为了非必要星星冒险。",
      "碰到泥漥后要更早输入换道，因为移动会短暂变慢。",
      "用守护者的前两组门阵找出安全跑道节奏。",
      "碰撞会重置下一颗星的倍率，但不会删除本局已达成的最佳连击。"
    ],
    "designNote": "三条跑道让手机上的安全路容易辨识，每次输入只移一格。路线时间为 28-45 秒，方便快速重试。深度来自门阵的空间阅读、星轨的风险取舍、泥漥的恢复时机、不同通关目标与守护者的编排阵型。这是 Kids 无广告游戏，不会建立广告保留区。",
    "parent": "这款游戏建议 9+，因为后期会结合快速跑道判断、关卡目标与分数压力。技能报告只显示本局真实换道、星星、碰撞与最佳连击，不是诊断、发展评量或儿童间比较。",
    "faq": [
      [
        "一共有几关？",
        "共有 30 条可存档路线，第 5、10、15、20、25、30 关是守护者检查。"
      ],
      [
        "每关目标都一样吗？",
        "不一样。有到达终点、星星数量、连击、低碰撞与目标分数五种。"
      ],
      [
        "黏滑泥漥有什么影响？",
        "会扣分、重置倍率，并在泥漥路线上短暂放慢换道。"
      ],
      [
        "双路障碍门怎么通过？",
        "两个障碍会同时出现，只留一条空路；后期有些路线会用星星标示安全口。"
      ],
      [
        "会存哪些进度？",
        "这个浏览器会存已解锁、已完成与目前路线，以及本机前 5 名分数。"
      ],
      [
        "手机和电脑都能玩吗？",
        "可以。手机支援点击与滑动，电脑支援 A、D 与方向键。"
      ],
      [
        "需要登入或付费吗？",
        "不需要。游戏可免费在浏览器游玩。"
      ],
      [
        "为什么建议 9+？",
        "后期同时有快速判断、关卡目标与分数压力；年龄只是建议，不是能力分级。"
      ],
      [
        "技能报告是正式测验吗？",
        "不是，它只整理本局真实游戏事件。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["snack-blocks"] = {
    "title": "动物零食方块",
    "age": "9+",
    "difficulty": "渐进挑战",
    "time": "3-8 分钟",
    "gameplay": "三消关卡益智",
    "genre": [
      "益智",
      "逻辑",
      "动物"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "专注"
    ],
    "intro": "动物零食方块共有 30 个可存档关卡。六个章节会改变棋盘可出现的零食组合与过关目标，玩家要在 7×10 棋盘上规划每一次交换，而不是只追求越来越高的数字。",
    "story": [
      "零食世界的动物要把同一张野餐桌从莓果田运到皇冠盛宴。每次三消代表整理好一批食物，六个地区则分别准备宴会所需的不同零食。",
      "第 5、10、15、20、25、30 关是野餐铃、烘焙坊大门、花园鼓、工坊钟、桥上宴会与皇冠餐桌检查。通过第 30 关代表完整宴席送达终点。"
    ],
    "how": [
      "在水平 Stage 轨道选择已解锁关卡，先阅读目标与移动步数。",
      "点选一个零食再点相邻零食，或向相邻方向拖曳；有效交换必须立刻形成三个以上相同零食。",
      "消除后零食会下落并从上方补入；补位自动形成的消除会建立连锁倍率。",
      "用完整步数完成目标，成功后才会存档并解锁下一关。"
    ],
    "systems": [
      "基本消除每格 12 分，再乘上目前连锁层数。无效交换会复原且不消耗步数。",
      "目标包含分数、单一零食、双零食、连锁、单次大消除，以及同时要求收集与分数的检查关。",
      "每关指定四、五或六种零食池，部分关卡会移除两种零食，让连锁规划方式产生变化。",
      "已解锁关卡与个人最佳成绩只储存在目前浏览器，不需要登入。"
    ],
    "progression": [
      "第 1-5 关在野餐小径教学分数、收集与四格消除。",
      "第 6-10 关在饼干渡口加入二段连锁、五格消除与双零食收集。",
      "第 11-15 关在葡萄花园交替使用缩减与扩大的零食池。",
      "第 16-20 关在起司工坊要求三段连锁与更精准的大消除。",
      "第 21-25 关在蝴蝶饼桥提高双收集压力，并更常使用全部六种零食。",
      "第 26-30 关的皇冠盛宴混合所有规则，最后一关同时要求糖果收集与分数。"
    ],
    "tips": [
      "优先观察棋盘下方；越低的消除会移动越多零食，也更容易形成连锁。",
      "连锁关可先在上方留下接近完成的排列，再消除下方支撑。",
      "检查关要同时看收集与分数进度，避免只完成其中一半。"
    ],
    "designNote": "直向棋盘让手机上的动物零食图案维持清楚，也保留足够的垂直连锁空间。30 关的深度来自零食池与目标类型改变，不是只有数值提高。触控、拖曳与键盘都使用同一组原生方块按钮；Kids 版本没有计时压力，也不会发出广告请求。",
    "parent": "本游戏建议 9+ 与家庭玩家，因为后期会同时处理双目标、零食池变化与连锁规划。技能报告只是本局游戏结果的友善整理，不是智力测验、诊断、学校评量或儿童间比较。",
    "faq": [
      [
        "一共有几关？",
        "共有 30 关，并在第 5、10、15、20、25、30 关设置六个检查关。"
      ],
      [
        "为什么交换后会移回去？",
        "有效交换必须立刻形成三消；无效交换会复原且不扣步数。"
      ],
      [
        "什么是连锁？",
        "消除下落或补位后自动形成的新消除就是连锁，连续层数会提高分数倍率。"
      ],
      [
        "双零食目标怎么算？",
        "画面指定的两种零食都会计入同一个收集目标。"
      ],
      [
        "检查关有什么不同？",
        "必须同时完成指定零食数量与分数目标。"
      ],
      [
        "进度会保存吗？",
        "已解锁关卡与最佳成绩会保存在目前浏览器。"
      ],
      [
        "手机和电脑都能玩吗？",
        "可以，支援触控、指标拖曳与键盘方块按钮。"
      ],
      [
        "需要登入或付费吗？",
        "不需要；Kids 版本免费、免登入且不会发出广告请求。"
      ],
      [
        "技能报告是正式测验吗？",
        "不是，它只整理本局分数与目标结果。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["fruit-merge"] = {
    "title": "动物合成塔",
    "age": "6+",
    "difficulty": "渐进挑战",
    "time": "3-8 分钟",
    "gameplay": "物理合成挑战",
    "genre": [
      "益智",
      "物理",
      "动物"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "手眼协调"
    ],
    "intro": "动物合成塔保留原本的自由模式，并新增 30 个可存档物理挑战。六个章节会改变瞄准范围、侧风、重力、生成顺序与成功条件，但所有模式都使用同一套动物球物理合成。",
    "story": [
      "动物祭典的游行让灯球散落在六个地区。两颗相同动物球接触后会合成下一阶，玩家要重新堆起从老鼠球到狮王球的皇冠塔。",
      "草原起步、森林窄窗、河流气流、山岳重力、月光队列与皇冠祭典各自教一种物理规则。通过第 30 关代表狮王餐桌已经能安全加入最后游行。"
    ],
    "how": [
      "选择开始游戏进入水平挑战轨道，或选择自由模式进行无落球上限的最高分挑战。",
      "用触控、滑鼠或左右方向键瞄准，再用触控放开、空白键或 Enter 落球。",
      "让两颗相同动物球接触，合成下一阶动物并取得分数。",
      "保持动物塔低于红线，并在落球额度结束前完成分数、动物阶级、合成次数、连击或双重目标。"
    ],
    "systems": [
      "十一种动物构成完整合成链；短时间内连续合成会把倍率提高到 x5。",
      "森林窄窗缩小可用瞄准范围；河流气流对移动中的球施加来回侧向力；山岳重力提高 Matter.js 重力；月光队列采用固定生成节奏。",
      "每五关是祭典检查关，必须同时达成指定动物阶级与分数。第 30 关会混合全部四种进阶规则。",
      "挑战解锁、完成状态、目前选择与最佳分数储存在浏览器；自由模式的图鉴与最佳纪录分开保存。"
    ],
    "progression": [
      "第 1-5 关使用开放箱，教学基本合成、动物阶级、连击与分数。",
      "第 6-10 关缩小森林窄窗的落点范围。",
      "第 11-15 关加入方向会变化的河流气流。",
      "第 16-20 关使用更快落地的山岳重力。",
      "第 21-25 关用固定队列练习提前数步安排落点。",
      "第 26-30 关逐步混合规则，最后在狮王餐桌同时启用窄窗、风、重力与固定队列。"
    ],
    "tips": [
      "让大型动物保持在低处与中央，并替暂时无法配对的小球保留一条空路。",
      "有侧风时先看移动方向，再决定是否投入狭窄落点。",
      "固定队列可以让你提前两到三颗准备落点，不必只处理眼前一球。"
    ],
    "designNote": "游戏使用固定 720×1040 Matter.js 棋盘，放在等比缩放的 Kids Canvas 内，因此手机与电脑的物理条件相同。30 关透过可执行的瞄准、力、重力、队列变化与五种成功条件建立深度，不是只提高分数。Kids 版本不发出广告请求，进度只留在目前浏览器。",
    "parent": "本游戏建议 6+ 与家庭玩家。后期会要求预测移动、记住固定队列并适应物理条件变化。技能报告只是本局游戏的友善整理，不是智力测验、诊断、发展评量或学校成绩。",
    "faq": [
      [
        "一共有几个挑战？",
        "共有 30 关，并在第 5、10、15、20、25、30 关设置祭典检查关。"
      ],
      [
        "挑战模式和自由模式有什么不同？",
        "挑战模式有目标、落球额度、存档解锁与指定物理规则；自由模式没有落球上限。"
      ],
      [
        "河流气流怎么运作？",
        "它会对箱内移动中的球施加方向周期变化的侧向力。"
      ],
      [
        "山岳重力改变什么？",
        "Matter.js 重力提高，球会更快落地，也更难依靠缓慢滚动修正。"
      ],
      [
        "固定队列是什么？",
        "动物会依照已知的老鼠、兔兔与狐狸节奏出现，方便提前规划。"
      ],
      [
        "挑战进度会保存吗？",
        "会，解锁、完成、选择与最佳分数会留在目前浏览器。"
      ],
      [
        "手机和电脑都能玩吗？",
        "可以，支援触控、滑鼠与键盘操作。"
      ],
      [
        "需要登入或付费吗？",
        "不需要；Kids 版本免费、免登入且不发出广告请求。"
      ],
      [
        "技能报告是正式测验吗？",
        "不是，它只整理本局游戏结果。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["garden-tiles"] = {
    "title": "宠物花园方块",
    "age": "6+／亲子",
    "difficulty": "简单至具挑战性",
    "time": "每关约 3 至 8 分钟",
    "skills": [
      "记忆",
      "专注",
      "问题解决"
    ],
    "intro": "《宠物花园方块》是一款有 30 个存档挑战、没有关卡倒数的记忆配对游戏。六个花园篇章会依序加入晨光预览、短暂翻牌、失误后移动，以及成功配对后的游行轮转；每五关都有一个花园检查点。",
    "story": [
      "宠物花园温室收藏每位动物朋友、管理员、水果与花园物件的图卡。一阵夜风在灯笼散步活动前把图卡吹散并翻到背面。玩家担任年轻图卡管理员，重新整理配对，让六座花园房间恢复开放。",
      "每完成一组配对，就把一笔图像纪录送回花园名册。完成每段五关会点亮一盏篇章灯笼；第 5、10、15、20、25、30 关会整合该段学到的记忆方法。"
    ],
    "how": [
      "在水平关卡列选择已解锁的挑战。",
      "翻开两张牌，找出相同的动物或花园图案。",
      "开始前阅读规则标签，准备应对预览、薄雾、微风或游行移动。",
      "清除所有配对可取得星星、保存进度并解锁下一关。"
    ],
    "systems": [
      "步数与星星：步数计算完整的两张牌尝试。较少尝试可取得更多星星，但任何完成的牌面都能前进，也不会降低旧有最佳成绩。",
      "晨光预览：开始时短暂显示全部图片，适合练习依照角落或列数扫描。",
      "花园薄雾：若没有选第二张牌，第一张会在温和的时间窗后盖回；整关仍然没有倒数。",
      "调皮微风：失误的可见提示结束后，只会洗动尚未完成的牌。",
      "花园游行：成功配对后，其余牌会沿空位轮转，需要跟著移动更新记忆位置。"
    ],
    "progression": [
      "1-5 嫩芽小径：四至八组配对教真正的盖牌记忆，最后以预览检查点收尾。",
      "6-10 晨光温室：开场预览搭配较大牌面，鼓励规律扫描。",
      "11-15 薄雾池塘：第一张牌只短暂保持翻开，练习保存最新图像。",
      "16-20 微风果园：失误会移动未配对牌，旧位置不能一直沿用。",
      "21-25 动物游行：成功后牌面轮转，需要追踪移动。",
      "26-30 月光花房：多种规则组合，最后是 14 组配对、四规则同时出现的检查点。"
    ],
    "strategyTips": [
      "预览时依角落或横列分组记忆。",
      "经典关卡的失误仍是有用的位置资讯。",
      "微风或游行移动后，先重建一小区记忆地图。",
      "重玩旧关可改善星星，不会失去已解锁进度。"
    ],
    "designNote": "本作用不同记忆要求增加难度，而不是加入紧张倒数。固定 390×788 画布让手机与电脑的牌面位置稳定；原生按钮支援触控和键盘，失误图案保留足够时间，切到背景时也会暂停提示时间。预览、薄雾、微风与游行分别练习不同的观察方式，同时维持 Kids 游戏的平静节奏。",
    "parent": "本作适合 6+ 与亲子游玩。星星与技能报告只整理本次本机游戏的配对、步数、重试和星星，不是智力测验、诊断、发展评估，也不会和其他孩子比较。Kids 版本没有广告、登入、聊天或购买要求。",
    "faq": [
      [
        "共有多少挑战？",
        "共有六篇 30 关，检查点位于第 5、10、15、20、25、30 关。"
      ],
      [
        "游戏有倒数吗？",
        "没有。花园薄雾只会让单次第一张牌在短暂时间后盖回。"
      ],
      [
        "为什么后期卡牌会移动？",
        "调皮微风会在失误后移动未完成牌；花园游行则在成功后轮转。"
      ],
      [
        "星星怎么计算？",
        "依完整两张牌尝试次数计算；只要清完牌面就能继续。"
      ],
      [
        "进度会保存吗？",
        "已解锁关卡与最佳星星会保存在目前浏览器。"
      ],
      [
        "手机和键盘都能玩吗？",
        "可以，牌卡使用支援触控、滑鼠与键盘的原生按钮。"
      ],
      [
        "需要付费或会显示广告吗？",
        "不需要帐号或购买；Kids 版本也不会发出广告请求。"
      ],
      [
        "技能报告是正式测验吗？",
        "不是，只是本次完成关卡的游戏摘要。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-rescue"] = {
    "title": "动物回家路",
    "age": "6+／亲子",
    "difficulty": "简单至具挑战性",
    "time": "每关约 3 至 8 分钟",
    "skills": [
      "逻辑",
      "问题解决",
      "动物认识"
    ],
    "intro": "引导十二位动物朋友完成 30 条无倒数、可存档的回家路线。六个区域会加入必收水果、加重步数的黏泥、路线钥匙、上锁大门、一次性脆弱小路与救援检查点。",
    "story": [
      "回家谷原本用彩绘水果标志，引导动物穿过森林、草地、河畔、山脊、农场与庆典场地。风雨吹散标志、让捷径复上黏泥、冲走踏脚石，也锁住几扇花园大门。玩家担任年轻路线管理员，重新找出每一条安全旅程。",
      "每五关是一个救援检查点。完成第 30 关代表企鹅走过最后的混合路线，十二位动物朋友都能参加回家庆典。"
    ],
    "how": [
      "在水平关卡列选择已解锁路线。",
      "用触控、滑鼠或单次方向键移动到相邻格。",
      "收集水果与钥匙，避开岩石、水域、关闭大门与已塌下的脆弱小路。",
      "完成目前目标后进入家门，再选下一关、重玩或回到路线。"
    ],
    "systems": [
      "步数与星星：一般地面算一步，黏泥算两步；关卡步数目标和水果数量决定一至三星。",
      "全部水果：标示此规则的路线会在水果收齐前关闭家门。",
      "路线钥匙与大门：先取得金色钥匙，该大门才会接受移动。",
      "脆弱小路：每格只能进入一次；除非使用上一步或重置移除该次造访，否则不能回头。",
      "上一步与重置：上一步会依保留路径重新计算水果、钥匙、大门、脆弱格与加权步数；重置会重建整条路线。"
    ],
    "progression": [
      "第 1-5 关森林起步教授相邻移动、障碍、水果绕路与第一个全水果检查点。",
      "第 6-10 关草地绕路加入黏泥与加权路线比较。",
      "第 11-15 关河畔钥匙在水域走廊加入钥匙和大门。",
      "第 16-20 关脆弱山脊加入一次性格子与钥匙门检查点。",
      "第 21-25 关丰收路线要求水果，并混合黏泥、大门与脆弱选择。",
      "第 26-30 关回家庆典整合规则；第 30 关同时使用全部水果、黏泥、钥匙门和脆弱小路。"
    ],
    "strategyTips": [
      "移动前先规划完整的水果到家路线。",
      "比较路线时把黏泥算两步。",
      "进入大门走廊前先找到钥匙。",
      "踏上脆弱格前先决定要从哪一侧离开。",
      "近期走错用上一步，整体计划错误则用重置。"
    ],
    "designNote": "固定 5×5 棋盘能让手机上的每一格维持大型尺寸，同时看见完整路线。离散移动让触控、滑鼠与键盘做出相同决策。难度来自成本、顺序、可否回头与完成条件，而不是速度。固定 390×788 Kids 画布没有倒数、战斗、排行榜、帐号、购买、广告请求或广告保留区。",
    "parent": "本作适合 6+ 与亲子游玩。星星只整理本机游戏表现，不是智力测验、学校成绩、诊断、发展评估，也不会与其他孩子比较。进度保存在目前浏览器；Kids 版本没有广告、登入、聊天或购买要求。",
    "faq": [
      [
        "共有多少路线？",
        "共有六区 30 关，检查点位于第 5、10、15、20、25、30 关。"
      ],
      [
        "每关都要收齐水果吗？",
        "只有标示全部水果的路线会在收齐前关闭家门；其他关的水果仍会影响星星。"
      ],
      [
        "为什么黏泥算两步？",
        "黏泥使用加权成本，让最直接的路线不一定最有效率。"
      ],
      [
        "钥匙和大门怎么运作？",
        "先取得金色钥匙再进入大门；被拒绝的移动不会增加步数。"
      ],
      [
        "脆弱小路可以走两次吗？",
        "不行，但上一步或重置可透过移除该次造访来恢复它。"
      ],
      [
        "进度会保存吗？",
        "会，解锁与最佳星星保存在目前浏览器。"
      ],
      [
        "手机和键盘都能玩吗？",
        "可以，触控、滑鼠和方向键使用相同规则。"
      ],
      [
        "需要付费或会显示广告吗？",
        "不需要帐号或购买；Kids 版本也不会发出广告请求。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-bubble-safari"] = {
    "title": "动物泡泡探险",
    "age": "6+",
    "difficulty": "简单到中等",
    "time": "每关 3–6 分钟",
    "skills": [
      "专注",
      "手眼协调",
      "问题解决"
    ],
    "intro": "《动物泡泡探险》是一款免费双语 Kids 瞄准益智游戏，共有 30 个可保存关卡与六次草原检查。玩家发射动物泡泡、连接三颗同色泡泡、利用墙面反弹，并救出五种草原朋友。后段加入石头、叶球、需要两次碰撞的蜂蜜、整排清除的云、东西风、移动列，以及彩虹、横扫、爆破、交换四种力量泡泡。第 30 关结合四种障碍、三只救援动物、风、移动列与所有力量，没有倒数、帐号、购买或广告请求。",
    "story": [
      "六个草原地区由水源路线相连，小动物被漂浮泡泡群包围。玩家跟著狮子向导，用泡泡发射器打开安全道路；在预备泡泡用完前完成配对或救援目标，即代表该区恢复通行。",
      "障碍是路线的一部分，不是敌军。每五关会用草原检查重组该区技巧；完成第 30 关大草原重聚会救出最后三只动物，结束设计好的旅程。"
    ],
    "systems": [
      "目前与下一颗泡泡可用来提前规划。拖曳瞄准；方向键调整同一逻辑瞄准点，Enter 或空白键发射。",
      "泡泡以连续飞行的小步骤检查可见碰撞，并附著在实际碰到泡泡附近的空位，不会瞬移到远方隐藏格。",
      "三颗以上同色相连会消除；反弹目标要求先碰墙；救援目标要清除一到三颗标记动物泡泡。",
      "叶球由相邻配对带走，蜂蜜需两次直击，云被碰会清除整排；风会改变飞行，移动关会在发射后平移交错列。",
      "彩虹变成碰到的颜色，横扫清一排，爆破清附近区域与障碍，交换则互换颜色。",
      "星星依剩余泡泡计算；解锁、最佳星星、分数、救援图鉴与音效选择只保存在目前浏览器。Kids 画面没有广告。"
    ],
    "how": [
      "在水平关卡轨道滑到已解锁关卡，阅读目标与提示。",
      "瞄准前先看目前与下一颗泡泡。",
      "拖向同色泡泡；直线被挡时利用墙面。",
      "放开发射，观察精确碰撞与附著后再规划。",
      "在泡泡用完前完成指定配对或救援。"
    ],
    "strategyTips": [
      "先用下一颗泡泡规划狭窄通道。",
      "反弹要提早碰墙，让回弹路线从侧面接近。",
      "用相邻配对清叶球，并记得蜂蜜要碰两次。",
      "打云前先查看整排内容。",
      "逆著风偏移瞄准，移动列每次发射后都重新判读。",
      "把爆破留给密集障碍，横扫留给重要列。"
    ],
    "progression": [
      "第 1–5 关教直射、反弹、救援、混色与石头。",
      "第 6–10 关扩大救援链并加入彩虹与横扫。",
      "第 11–15 关加入爆破、交换、叶球、蜂蜜与云。",
      "第 16–20 关加入东西风与交错移动列。",
      "第 21–25 关把四种力量分别搭配适合障碍，最后同时救三只动物。",
      "第 26–30 关混合叶石通道、蜂蜜逆风、移动云列与三兽救援；第 30 关使用所有主要规则。"
    ],
    "designNote": "本作的核心承诺是可见碰撞要产生可信附著。连续移动与局部空位选择维持瞄准公平；难度来自角度、障碍反应、救援位置、风、列移动、下一颗规划与力量时机，而不是加速或缩小目标。单一逻辑 Canvas 会在手机、平板、桌面与短横向萤幕等比缩放；触控、滑鼠与键盘共享瞄准状态，切换 App 也不会让旧放手事件偷偷发射。它不同于《动物泡泡烘焙坊》的点击群组，本作核心是轨迹与反弹。Kids 游玩没有广告、帐号、购买、排名或诊断。",
    "parent": "《动物泡泡探险》可用来谈视觉预测、规划、颜色分类、专注与手眼协调。大人可以一起讨论反射路线、风向偏移，或目前泡泡是否应替下一颗开路。星星与技能报告只是本机游玩回馈，不是成绩、智力分数、诊断或儿童比较。进度只留在目前浏览器；不需要儿童帐号，Kids 路线也不会请求广告。",
    "faq": [
      [
        "共有多少关？",
        "共有 30 个可保存关卡，草原检查位于第 5、10、15、20、25、30 关。"
      ],
      [
        "泡泡为什么附著在目标旁边？",
        "它会使用实际碰到泡泡附近最近的空位。"
      ],
      [
        "反弹目标怎么算？",
        "完成配对的发射泡泡必须先碰过侧墙。"
      ],
      [
        "叶、蜂蜜与云怎么处理？",
        "叶球由相邻配对带走，蜂蜜需两次碰撞，云会清除整排。"
      ],
      [
        "四种力量泡泡是什么？",
        "彩虹变色、横扫清列、爆破清区域、交换互换颜色。"
      ],
      [
        "有倒数吗？",
        "没有，限制是画面显示的预备泡泡数。"
      ],
      [
        "进度会保存吗？",
        "解锁、星星、分数、图鉴与音效选择只留在目前浏览器。"
      ],
      [
        "触控与键盘都能玩吗？",
        "可以，触控、滑鼠、方向键、Enter 与空白键使用相同瞄准规则。"
      ],
      [
        "Kids 页面有广告吗？",
        "没有，本作不会建立广告请求或保留区。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-habitat-mahjong"] = {
    "title": "动物栖地麻将消消",
    "age": "9+",
    "difficulty": "入门到进阶",
    "time": "每关约 4～10 分钟",
    "skills": [
      "逻辑",
      "专注",
      "问题解决"
    ],
    "intro": "《动物栖地麻将消消》是免费的双语 Kids 麻将牌配对游戏，包含 30 个可储存牌局、十种立体牌形、六个规则章节，以及位于第 5、10、15、20、25、30 关的栖地终局。玩家要配对相同的可用动物牌与栖地牌、解开菱形钥匙封印、救援星号家族，并跟随交替的 A／B 巡守路径；游戏没有倒数失败。",
    "story": [
      "森林巡守档案馆替森林树冠、草原足迹、珊瑚棚与极地极光保存图像牌册。季节风暴把牌册折成多层堆叠，让动物肖像、贝壳、珊瑚、树叶与雪地标记互相遮盖。玩家是见习牌册巡守员，要把每一对图像送回正确页面。",
      "菱形标记的动物带著蓝色路径封印的钥匙，星号图像则是走散的动物家族。巡守小径会在每次成功后把可用路线由 A 切换到 B，要求重新观察不同牌层。完成第 30 关代表最后一页珊瑚棚纪录已复原，六个栖地终局全部完成。"
    ],
    "how": [
      "在 30 关水平滑动轨道上选择已解锁牌局，先阅读该关规则。",
      "寻找两张相同的牌；上方不能有牌覆盖，左右至少一侧必须开放。",
      "封印关要先配对菱形钥匙，救援关则要找出两组星号家族。",
      "提示会指出合法配对；复原只退回上一组；没有可配对牌时才能洗牌。",
      "清空所有牌即可保存成绩，并且只解锁下一关。"
    ],
    "systems": [
      "每关有八到十二组真正配对，分布在一到三层牌面上。所有图像保持可见，重点是判断取牌路径，不是记忆翻牌。",
      "标准可用牌的同一座标上方不能有活动牌，而且同列同层的左侧或右侧至少一边没有邻牌。巡守小径还会限制只能配对目标列显示的 A 或 B 路线，成功后通常切换。",
      "路径封印会锁住标记内层牌，直到发光菱形配对清除。家族救援追踪两组星号配对；巡守试炼结合封印与救援；大栖地再加入交替巡守路径。",
      "提示只标出目前合法的一对。复原会连同钥匙、救援与巡守路径状态一起还原。仍有走法时洗牌会停用；死局洗牌会保留特殊标记并保证产生可用配对。",
      "步数计算配对与洗牌。页面隐藏时不计游玩时间。每关的最高分、最少步数、最快可见时间与解锁进度都只存在目前浏览器。"
    ],
    "strategyTips": [
      "优先清除能揭露多张底牌的上层配对。",
      "左右两侧都保留路径，不要只清空单边。",
      "规划封印牌以前先处理菱形钥匙。",
      "沿著覆盖牌层追踪每组星号家族的位置。",
      "巡守小径要先确认目标列显示 A 或 B，成功后通常会切换。",
      "若一组配对封住多条路径，立刻使用复原重新判断。"
    ],
    "progression": [
      "第 1～5 关以方格、菱形、阶梯、桥梁与堆叠牌形教学标准规则。",
      "第 6～10 关加入菱形钥匙与两组封印内层牌。",
      "第 11～15 关加入两组星号家族；第 15 关刻意以无配对开场教学洗牌复原。",
      "第 16～20 关在极地金字塔与圣所牌形中交替 A／B 巡守路径。",
      "第 21～25 关同时使用路径封印与家族救援。",
      "第 26～30 关综合封印、救援与交替巡守路径；第 30 关有三层共十二组牌。"
    ],
    "designNote": "难度来自取牌条件的改变，不是单纯增加牌量、缩小图像或加快倒数。封印建立先后依赖，救援提供可见子目标，巡守小径则在每次成功后改变目前可用牌组。固定逻辑画面会等比例缩放到手机、平板、桌面与短横向萤幕；触控、滑鼠与键盘共用同一套判定，结果留在 Battle 内，Kids 路径不建立任何广告请求或保留区。与记忆翻牌不同，所有图像都保持可见；与平面消除不同，移除顺序会改变可接近的牌。",
    "parent": "《动物栖地麻将消消》可以用来陪伴练习视觉扫描、空间规划、专注、因果关系与重新修正决定。分数与能力报告只描述本次本机游玩，不是智力测验、学校成绩、诊断或儿童比较。进度只存在目前浏览器，清除网站资料后可能重设。不需要建立儿童资料，Kids 路径不会请求广告。",
    "faq": [
      [
        "游戏共有几关？",
        "共有 30 个可储存牌局与六个栖地终局。"
      ],
      [
        "什么是可用牌？",
        "牌面上方不能被覆盖，左右至少一侧必须开放；巡守小径还会限制目标列显示的 A 或 B 路线。"
      ],
      [
        "菱形、星号与蓝色标记代表什么？",
        "菱形会打开封印，星号标记救援家族，蓝色封印牌要等待钥匙。"
      ],
      [
        "为什么洗牌按钮不能使用？",
        "只有目前没有任何合法配对时，洗牌才会开启。"
      ],
      [
        "复原会还原特殊规则吗？",
        "会，上一组牌、钥匙、救援与巡守路径状态都会一起还原。"
      ],
      [
        "游戏有时间限制吗？",
        "没有；可见时间只用来保存个人纪录。"
      ],
      [
        "不用帐号也会保存吗？",
        "会，解锁与各关纪录只存在目前浏览器。"
      ],
      [
        "可以使用触控或键盘吗？",
        "可以，触控、滑鼠、Tab、Enter 与空白键使用相同规则。"
      ],
      [
        "Kids 页面会显示广告吗？",
        "不会，游戏不会建立广告请求或保留区。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-hidden-safari"] = {
    "title": "动物探险找找看",
    "age": "3+／亲子",
    "difficulty": "简单至具挑战性",
    "time": "每个栖地约 2 至 6 分钟",
    "skills": [
      "专注",
      "动物认识",
      "问题解决"
    ],
    "intro": "《动物探险找找看》是一段平静的 30 栖地搜寻旅程。六区各有五关，从自由搜寻逐步加入指定顺序、动物双双、深层伪装、清单外访客与缓慢移动的巡游目标。每关都有六张真实图片目标、两次提示、星星与本机最佳搜寻时间，但没有倒数失败。",
    "story": [
      "小小巡护员中心会替阳光草原、河边栖地、夕阳树林、池塘观察、丛林边缘与远眺山丘建立动物图片名册。季节小径同时开放后，狮子、大象、长颈鹿、猫熊、企鹅、无尾熊、兔子、狐狸、青蛙和猫头鹰出现在不同区域。玩家担任年轻观察员，把画面和本次六张图片清单逐一核对。",
      "找到六个指定目标，代表完成一次可靠的栖地纪录。每第五关是栖地检查点，会复习该区学到的搜寻方法。完成第 30 关，代表双胞胎动物都有分开记录、无害访客没有被误算，远眺山丘的移动巡游也依指定顺序完成。"
    ],
    "how": [
      "在水平 30 关关卡列选择已解锁栖地，先阅读规则标签。",
      "比较场景下方六张图片清单与被草、树叶、水面或尘土遮住的动物。",
      "点击、触碰，或用键盘聚焦后按 Enter 找到目标；巡护顺序关要依亮起的清单前进。",
      "需要时使用两次罗盘提示；可能的情况下，两次会指出不同的未找到动物。",
      "找到全部六只后保存星星与可见搜寻时间，解锁下一关或重玩目前栖地。"
    ],
    "systems": [
      "可见搜寻时间没有失败上限，只在栖地实际显示并可操作时记录；切换 App 或隐藏分页会暂停。完成后只会和同一栖地的本机最佳时间比较。",
      "星星鼓励仔细自主观察。没有空白误点且没使用提示可得三星；少量误点并至少保留一次提示可得二星；任何完成场景都至少一星并能前进。",
      "自由搜寻可用任意顺序找六张图片。巡护顺序一次亮起一个指定目标；先点其他清单动物只会得到友善提醒，不会让牠消失。",
      "动物双双会在同一场景放入同种动物的两个不同位置。找到一只狐狸、猫头鹰、狮子、猫熊、企鹅或无尾熊，不代表牠的伙伴也完成。",
      "深层伪装会降低动物和背景的分离度，并加大前景草叶、水面或尘土遮挡。键盘焦点与罗盘提示仍会提供清楚线索，不会让目标完全消失。",
      "栖地访客是有出现在画面、但不在六张清单上的动物。点到访客会算一次空白选择并将牠移开，不会阻止过关。移动巡游让目标在小范围缓慢移动；系统偏好减少动态时会停止。",
      "提示、误点、已找到目标、自主找到数、星星、解锁与最佳时间只用于本机结果与技能报告，不会上传成测验分数，也没有公开排行榜。"
    ],
    "progression": [
      "第 1-5 关阳光草原：六个目标可自由选择，建立规律扫描方式，最后完成第一个栖地检查点。",
      "第 6-10 关河边栖地：巡护顺序把目标从『看见就点』改成依亮起图片前进。",
      "第 11-15 关夕阳树林：三种动物各出现两次；第 15 关再加入指定顺序。",
      "第 16-20 关池塘观察：较深的前景伪装鼓励由边缘到中央慢慢扫描，后段混合顺序和双胞胎。",
      "第 21-25 关丛林边缘：清单外访客要求玩家真正比较六张图片，检查点再加入顺序与伪装。",
      "第 26-30 关远眺山丘：缓慢巡游改变眼睛回看的位置；最后一关同时使用移动双胞胎、巡护顺序、深层伪装与三只访客。"
    ],
    "strategyTips": [
      "一次扫描画面的一条横带，不要只追著远处最亮的图案跳动。",
      "巡护顺序先看发亮目标和清单，再点其他动物。",
      "同种动物出现两次时，记住尚未完成的伙伴在左侧或右侧。",
      "丛林中每只吸引注意的动物都先和六张图片比较，牠可能只是访客。",
      "完整扫描一次后再使用提示，罗盘就能帮助发现原本忽略的区域。"
    ],
    "designNote": "游戏把一个正方形搜寻场景与六张大型图片清单固定在等比例 390×693 Kids 战斗画布，让手机、电脑、触控、滑鼠和键盘面对同一个版面。难度不是靠缩小点击区或严格倒数，而是改变哪些资讯可靠：顺序改变优先目标，双双改变计数，伪装改变视觉分离，访客改变清单判断，移动则改变追踪。检查点用规则组合取代战斗。目标仍保留宽容点击范围；提示会命名并圈出一只动物；长按按键不会一次花掉两次提示或跳过结果；减少动态设定也会停止巡游。Kids 版本没有广告、帐号或购买。",
    "parent": "本作适合 3+，后期混合检查点可由家人陪同。游戏可能帮助图片配对、视觉扫描、清单比较、弹性注意与动物命名。大人可以询问清单还缺哪一只，或某只可见动物为什么是访客。星星、时间和技能报告只描述这次本机游戏，不是智力测验、诊断、发展评估、学校成绩，也不会与其他孩子比较。Kids 页面没有广告请求、登入、聊天或购买提示。",
    "faq": [
      [
        "共有多少栖地？",
        "共有六区 30 关，栖地检查点位于第 5、10、15、20、25、30 关。"
      ],
      [
        "有时间限制吗？",
        "没有。时间只记录本机最佳成绩，不会造成失败，切到背景的时间也不计入。"
      ],
      [
        "巡护顺序会改变什么？",
        "只有目前亮起的下一只动物会推进清单，其他指定动物仍会留在画面稍后再找。"
      ],
      [
        "为什么有两只一样的动物？",
        "动物双双会要求分别找到同种动物的两位伙伴。"
      ],
      [
        "栖地访客是什么？",
        "牠是画面中可见、但没有印在这次清单上的动物，不会算成找到目标。"
      ],
      [
        "提示怎么运作？",
        "罗盘圈与短名称会指出一只未完成动物，每关可用两次。"
      ],
      [
        "进度会保存吗？",
        "会，解锁、星星与最佳时间保存在目前浏览器，不需要帐号。"
      ],
      [
        "手机和键盘都能玩吗？",
        "可以，目标是原生按钮，支援宽容触控范围与连续键盘焦点。"
      ],
      [
        "Kids 游戏有广告吗？",
        "没有，游戏不会发出广告请求，也没有广告保留区。"
      ],
      [
        "技能报告是正式评估吗？",
        "不是，只整理这次本机游戏的找到数、误点、提示和时间。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-guard-yard"] = {
    "title": "动物守卫庭院",
    "age": "6+",
    "difficulty": "中等",
    "time": "每关约 5 至 8 分钟",
    "skills": [
      "逻辑",
      "专注",
      "问题解决"
    ],
    "intro": "苜蓿庭院连接六个共享阳光、种子与水源的花园区域。野兽挤进小径后，玩家成为庭院管理员，把猫骑士、狗战士、猫头鹰法师与可选的狐狸游侠配置在五条路线。30 关会逐区加入可判断的规则：疗愈兽回复前方同路野兽、钻地兽预警后换到相邻路线、阳光盗偷走 12 点尚未使用的阳光。每五关都有独立首领与解法，包括苔角犀牛的咆哮、晶壳陆龟的防护阶段、獾王换线、烬鬃野猪冲刺、疾翼鹰延后攻击与月冠鹿的回复脉冲。通关、分数、庭院勋章、金币与训练都保存在本机浏览器。",
    "how": [
      "选择已解锁关卡，先读敌人图示与短提示。",
      "在预告路线配置挡路与远程守卫。",
      "收集阳光、回应特殊敌人提示，别让家园爱心归零。",
      "用金币训练守卫，重玩关卡收集 5、15、30 枚勋章里程碑。"
    ],
    "strategyTips": [
      "先集火疗愈兽，避免盾兽一直回血。",
      "看到钻地兽时，同时照顾相邻路线。",
      "阳光盗袋子发亮前先花掉重要阳光或击倒它。",
      "晶壳陆龟打开防护后再集中输出。",
      "用狗战士承受烬鬃野猪的预告冲刺。"
    ],
    "parent": "本作以友善幻想方式练习规划、注意与弹性解题，敌人行动都有图片或短提示，没有写实暴力。进度只存在本机，清除浏览器资料后可能消失；能力小报告不是学习或健康评估。Kids 页面不请求广告，也不要求建立儿童个人资料。",
    "faq": [
      [
        "共有几关？",
        "共有六区 30 个具名关卡，每五关有一个机制不同的首领。"
      ],
      [
        "晶壳陆龟为何几乎不受伤？",
        "晶壳关闭时会大幅减伤，打开后才是集中攻击时机。"
      ],
      [
        "钻地兽会换路吗？",
        "会。它会先闪烁预警，再移到相邻路线。"
      ],
      [
        "阳光盗会做什么？",
        "它只会一次偷走 12 点未使用阳光，不会移除已放置守卫。"
      ],
      [
        "可以升级守卫吗？",
        "可以用本机金币训练；狐狸是可选钻石解锁，并非过关必要角色。"
      ],
      [
        "进度会保存吗？",
        "关卡、最佳分数、勋章、金币与训练会保存在这个浏览器。"
      ],
      [
        "手机可以玩吗？",
        "可以。选关使用左右滑动，战斗使用大型点按区。"
      ],
      [
        "Kids 页面有广告吗？",
        "没有，这款 Kids 游戏不会发出广告请求。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-quiz"] = {
    "title": "动物小博士",
    "intro": "《动物小博士》是一款免费双语 Kids 知识游戏，共有 30 个可存档关卡，每关包含十种不重复的动物。20 种动物题库从狮子、大象、长颈鹿、斑马，到企鹅、鲸鱼、熊猫、无尾熊、猫头鹰、青蛙、宠物与农场动物。前期以清楚肖像搭配一则外观线索；后期会模糊图片、改成剪影、增加第四个选项，并组合栖地、行为、食物与外观事实。每五关是一次小博士检核，重新运用前面学过的线索。游戏没有倒数，答错也不会结束关卡。",
    "how": [
      "按下开始游戏，在横向关卡列滑到已解锁的观察任务。",
      "观察清楚肖像、神秘图片或剪影，并读完图片下方的每一则线索。",
      "把证据与三个或四个动物名称比较，再选出一个答案。",
      "答错可参考提示再试一次；答对后先阅读短暂显示的动物知识。",
      "辨识全部十种动物即可储存通关，并且只解锁下一关。"
    ],
    "parent": "《动物小博士》可以协助亲子讨论动物名称、栖地、食物、外观与行为。仍在学习阅读的孩子可以由大人朗读线索，再问孩子是根据哪一项证据作答。星星与能力报告只描述这次游玩，不是学校成绩、智力测验、发展诊断，也不会和其他孩子比较。进度只留在目前浏览器，清除本机储存资料后可能消失。游戏不需要儿童个人资料，Kids 路线也不会请求广告。",
    "faq": [
      [
        "游戏共有几关、每关几题？",
        "共有 30 个可存档关卡，每关有十种不重复的动物题目。"
      ],
      [
        "为什么动物图片有时模糊或变黑？",
        "栖地章节使用神秘图片；特征侦探与后期检核使用剪影，让事实与轮廓更重要。"
      ],
      [
        "答错会发生什么事？",
        "题目会保留，玩家可以再选另一个答案，不会失去进度或直接结束关卡。"
      ],
      [
        "为什么有些关卡有四个选项？",
        "食物、混合与小博士关会在玩家熟悉动物题库后加入第四个名称。"
      ],
      [
        "游戏会储存进度吗？",
        "已解锁关卡、完成卡片与最佳结果只会储存在目前浏览器。"
      ],
      [
        "手机和键盘都能玩吗？",
        "可以，同一套固定版面支援触控、滑鼠与键盘操作。"
      ],
      [
        "需要帐号或登入吗？",
        "不需要；但清除浏览器储存资料可能移除本机进度。"
      ],
      [
        "Kids 页面会显示广告吗？",
        "不会，《动物小博士》不会建立广告请求或广告保留区。"
      ],
      [
        "能力报告是正式测验吗？",
        "不是，它只是支持性的游玩回馈，不是学校、智力、健康或发展评量。"
      ]
    ],
    "age": "6+",
    "difficulty": "简单",
    "time": "5-8 分钟",
    "skills": [
      "动物知识",
      "记忆",
      "阅读"
    ],
    "story": [
      "这段旅程是一系列动物观察任务，不是救援或战斗。玩家扮演观察员，每答对一题，就替野外笔记完成一笔辨识纪录。画面中的动物、名称与文字线索永远指向同一个答案。完成十次辨识会结束目前章节、储存通关并解锁下一个观察任务。",
      "每个选择都有真实事实可推理。狮子可以从鬃毛、非洲草原与群体生活判断；企鹅可由寒冷海岸、鱼类食物与群聚取暖判断；大象则可由长鼻、植物性食物与喷水行为辨认。完成第 30 关，代表玩家走完六组学习内容并通过最后的混合线索检核。"
    ],
    "systems": [
      "每关有十种不重复的目标动物。入门关提供三个名称；后期的食物、混合与小博士关提供四个选项，但不会缩小按钮。",
      "一般肖像练习直接辨识；神秘图片会刻意柔化细节；剪影会移除颜色，让轮廓与文字线索变得更重要。图片仍保留可理解的无障碍名称。",
      "外观线索描述看得见的特征，栖地线索说明生活地点，行为线索描述动作或群体习性，食物线索则说明饮食。后期会同时提供两到三类线索。",
      "答错时会收到友善提示，题目仍可继续作答。答对后，选项会在短暂且只计算前景时间的学习停顿中锁定，显示动物知识再进到下一题。",
      "完成十题后，通关、最佳结果与下一关解锁都会储存在目前浏览器。结果画面可以重玩，也可以回到刚完成的关卡卡片。",
      "游戏没有帐号、排行榜、购买、倒数、生命或正式成绩。完成 30 关就是完整目标；重玩可以复习并再次挑战十题全对。"
    ],
    "strategyTips": [
      "清楚图片关可以先说出一项外观特征，再阅读答案。",
      "神秘图片关不要只猜柔化后的颜色，要优先相信栖地文字。",
      "遇到剪影时，比较长鼻、长颈、甲壳、耳朵与身体轮廓。",
      "小博士检核要读完所有线索；单一线索可能符合多种动物，组合后才会指向一个答案。",
      "四选一时，先排除不可能住在该栖地或不吃该食物的动物。",
      "答对后停一下阅读动物知识，不要急著略过。"
    ],
    "progression": [
      "第 1-5 关「图片入门」以清楚肖像与外观特征建立动物题库；第 5 关增加第二则线索与第四个选项。",
      "第 6-10 关「栖地家园」使用柔化的神秘图片，要求重视生活地点；第 10 关组合栖地与外观。",
      "第 11-15 关「特征侦探」改用剪影练习轮廓辨识；第 15 关用混合线索与四个选项收尾。",
      "第 16-20 关「动物行动」聚焦移动与群体行为；第 20 关把行为与栖地放在同一题。",
      "第 21-25 关「食物与家族」固定使用四个选项和饮食线索；第 25 关再加入外观证据。",
      "第 26-30 关「小博士综合」以神秘图片或剪影搭配两则线索。第 30 关使用四个选项、剪影，以及外观、栖地、行为三则相关线索。"
    ],
    "designNote": "每关十题能让同一学习主题重复出现，又不会让 Kids 游玩变成漫长考试。难度是借由改变哪些证据仍然有用来成长，不会缩小目标或增加时间压力。模糊与剪影是学习模式，不是隐藏点击区；大型原生答案按钮同时支援触控、滑鼠与键盘。固定逻辑版面会在手机、平板、短横向与电脑等比例缩放。学习停顿只计算看得到的游玩时间，所以切换应用程式不会偷偷跳过知识。和 WeightPlay 的配对或动作游戏不同，本作的核心决策完全来自事实证据。Kids 路线没有广告请求、广告保留区、帐号、购买、竞争排名或诊断宣称。"
  };
  localizedGames["zh-Hans"]["zoo-helper-day"] = {
    "title": "动物园帮忙日",
    "age": "3+",
    "difficulty": "简单",
    "time": "3-5 分钟",
    "skills": [
      "动物知识",
      "专注",
      "手眼协调"
    ],
    "intro": "《动物园帮忙日》是一款免费双语 Kids 照顾游戏，共有 30 个可存档班次与六个动物区。孩子会用水果、叶子、鱼、水、刷子、莲蓬头、玩具与球，帮助狮子、猫熊、大象、企鹅、长颈鹿和无尾熊。前期会直接说出需要的道具；后期会移除可见文字、要求照顾分类、暂时收起可以重看的需求，或要求依正确顺序完成两个步骤。每五关是保育员检核。游戏没有倒数，选错也能继续尝试。",
    "story": [
      "小动物园的工作日会巡回草原喂食区、竹林休息区、大象冲澡区、企鹅水池、长颈鹿观景台与无尾熊育幼区。玩家是准备下一件照顾道具的小帮手。票券代表完成班次，开心度则反映重试次数；选错图片不会伤害动物或结束游戏。",
      "这套简化道具是游戏决策，不是专业照养教学。完成第 30 关代表玩家练习六种规则并完成无尾熊育幼区的最后综合检核。"
    ],
    "systems": [
      "照顾配对会从四张大型图片中接受一个指定道具。",
      "图片道具会隐藏可见名称，但保留大型图像与无障碍名称。",
      "照顾分类会要求食物、饮水、清洁或玩耍；同一题可能有一个以上合理答案。",
      "记住需求会先显示完整句子，再改成回想提示；点动物就能无惩罚重看。",
      "两步骤照顾标示 1/2 与 2/2；太早选第二个道具会算一次重试。",
      "保育员综合只组合已教过的图片、分类、记忆与顺序规则。",
      "通关会把一到三星与下一关解锁存在目前浏览器；没有帐号、购买、排行榜、广告请求或广告保留区。"
    ],
    "how": [
      "在横向关卡列滑到已解锁班次。",
      "阅读动物区规则与目前需求。",
      "点道具图片或拖到动物卡；键盘使用相同按钮。",
      "需要时点动物重看记忆需求。",
      "完成全部选择即可储存星星并解锁下一关。"
    ],
    "strategyTips": [
      "选择前先说出道具或照顾分类。",
      "图片道具关要比较物件形状与颜色。",
      "忘记需求时点动物重看，不必猜。",
      "分类关先判断图片属于食物、饮水、清洁或玩耍。",
      "两步骤关要先看 1/2 或 2/2。",
      "选错时平静地重新比较四张图片。"
    ],
    "progression": [
      "第 1-5 关练习指定道具的照顾配对。",
      "第 6-10 关隐藏道具可见名称。",
      "第 11-15 关加入可能有多个合理答案的照顾分类。",
      "第 16-20 关暂时收起需求，但随时可点动物重看。",
      "第 21-25 关要求依序完成两步骤照顾。",
      "第 26-30 关重新组合前述规则；第 30 关含图片分类、记忆与六次选择。检核固定在 5/10/15/20/25/30。"
    ],
    "designNote": "短班次和大型图片让幼儿不必面对倒数也能完成明确目标。难度改变的是观察方式，包括辨识、分类、记忆与顺序，不会缩小点击区。触控、拖曳、滑鼠和键盘共用同一套照顾规则，固定逻辑版面也会在手机、平板、电脑与短横向等比例缩放。Kids 游玩没有广告、帐号、购买、排名或失败画面。",
    "parent": "本作可陪孩子练习图片辨识、基本照顾分类、短期记忆、简单顺序、专注与手眼协调。大人也可以说明真实动物需要专业保育员、适合的饮食、栖地、丰富化活动与兽医照护，远比游戏完整。星星与技能报告只是游玩回馈，不是成绩、诊断或儿童比较。进度只在目前浏览器；不需要儿童个人资料，也不会请求广告。",
    "faq": [
      [
        "3 岁孩子可以玩吗？",
        "可以。前期使用大型图片，后期文字可由大人朗读。"
      ],
      [
        "共有几个班次？",
        "共有 30 关与六次保育员检核。"
      ],
      [
        "道具文字为什么消失？",
        "图片道具关刻意使用八张道具图，但仍保留无障碍名称。"
      ],
      [
        "需求消失怎么办？",
        "点动物即可重看相同需求，不会受罚。"
      ],
      [
        "同一题会有两个正确图片吗？",
        "照顾分类关可能接受两个都符合分类的道具。"
      ],
      [
        "星星如何计算？",
        "零次重试三星，一到两次两星，更多重试一星。"
      ],
      [
        "进度会保存吗？",
        "星星与最高解锁关只存在目前浏览器。"
      ],
      [
        "支援触控、拖曳、滑鼠和键盘吗？",
        "支援，而且全部使用相同照顾规则。"
      ],
      [
        "会有广告或儿童帐号吗？",
        "不会；Kids 游戏不请求广告，也不需要儿童帐号。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["shape-train"] = {
    "title": "动物形状小火车",
    "age": "3+",
    "difficulty": "简单",
    "time": "每条路线 2–5 分钟",
    "skills": [
      "形状辨识",
      "逻辑",
      "手眼协调"
    ],
    "intro": "《动物形状小火车》是一款免费的双语 Kids 配对游戏，共有 30 条可保存路线与六次车长检查。形状朋友在明亮车站等候，玩家要从圆形、正方形、三角形、星形、菱形与爱心车厢中找出相同符号。前段是直接看图配对；后续会淡化颜色、在每次上车后改变车厢顺序、暂时藏起乘客，或要求先验票再选车厢。第 30 路线会把所有规则与六种车厢合在一起。游戏没有倒数、生命限制、购买、帐号、广告请求，也不会因一次选错就结束路线。",
    "story": [
      "形状线连接六座小车站，动物朋友会带著有清楚符号的彩色包裹来搭车，每节橘色车厢的窗户都有对应形状。玩家扮演小车长，负责检查符号并把乘客送到正确车厢。完成一条路线，代表所有等候朋友都安全上车，列车可以出发。",
      "不同规则代表铁路较忙碌的区段。轮廓车厢行经薄雾，移动车厢停在会切换位置的月台；记忆乘客会暂时收起车站卡；验票路线则要求先确认乘客。通过第 30 路线，代表完成最后一次混合车长检查。"
    ],
    "systems": [
      "每条路线有四到八名乘客，取自六种真实形状；画面上只会有一节车厢符合目前乘客。",
      "答对会显示短暂的上车动画、增加进度并换下一名乘客；选错只会温和提醒，同一名乘客仍可继续尝试。",
      "轮廓车厢降低颜色提示；移动车厢在答对后重新排序；记忆乘客会藏起符号但可免费再看；验票规则要求先点乘客。",
      "零次重试可得三星，少量重试得二星，更多重试得一星。技能报告只使用本次真实配对、首次答对、重试与上车人数。",
      "星星与最高解锁路线只保存在目前浏览器。没有帐号、排行榜、购买、广告、生命值或倒数。",
      "每五条路线是一个车长检查；第 30 路线会保存最终结果，不会出现不存在的第 31 路线。"
    ],
    "how": [
      "按下开始游戏，在水平路线轨道上滑到已解锁卡片。",
      "阅读路线规则，观察下方车站卡中的乘客形状。",
      "先点乘客，再点相同符号的车厢；拖曳、滑鼠与键盘也能操作。",
      "记忆路线可回想藏起的符号，或再点乘客把它显示出来。",
      "让所有乘客上车即可保存星星，并只解锁下一条路线。"
    ],
    "strategyTips": [
      "选车厢前先说出形状名称。",
      "轮廓车厢没有明显颜色时，比较尖角、边与曲线。",
      "移动路线每次答对后都重新扫视整条轨道。",
      "记忆游玩可把符号说出来，或用手在空中描出轮廓。",
      "验票路线要先选乘客，再碰车厢。",
      "选错不会关闭路线，停一下重新比较即可。"
    ],
    "progression": [
      "第 1–5 路线是直接配对，以二到四节明亮车厢介绍六种形状，第 5 路线是首次车长检查。",
      "第 6–10 路线使用轮廓车厢，曲线、角与尖端会比颜色更重要。",
      "第 11–15 路线加入移动车厢，每次成功上车后都会重新排序。",
      "第 16–20 路线会暂时藏起乘客；再点乘客即可无惩罚显示同一形状。",
      "第 21–25 路线加入先验票、再配对的动作顺序。",
      "第 26–30 路线混合旧规则；第 30 路线有六节车厢、八名乘客，并结合轮廓、移动、记忆与验票。"
    ],
    "designNote": "难度成长来自改变玩家要观察的线索，而不是缩小按钮、增加压力倒数或藏起正确点击区。直接配对先建立形状词汇，轮廓、移动、记忆与顺序再各加入一个能理解的判断。固定逻辑画面会在手机、平板、桌面与短横向萤幕等比缩放；图片车厢与形状图块保留图像为主的操作，文字只说明目前规则。配对与记忆等待只计算实际可见时间，切到其他 App 不会让路线偷偷前进。它不像《动物知识小测》需要阅读动物事实，也不像《动物园小帮手日》要依用途选照护工具；本作的核心始终是视觉等同。Kids 游玩没有广告、购买、帐号、排名或诊断宣称。",
    "parent": "《动物形状小火车》可用来谈圆形、角、尖端、视觉配对、短期记忆、动作顺序、专注与手眼协调。大人可以一起说出形状名称，或问孩子两个轮廓哪里不同。星星与技能报告只描述这次游玩，不是学校成绩、智力分数、发展诊断，也不会与其他孩子比较。进度只留在目前浏览器，清除网站资料可能使它消失；不需要儿童帐号，Kids 路线也不会请求广告。",
    "faq": [
      [
        "共有多少条路线？",
        "共有 30 条可保存路线与六个章节，车长检查位于第 5、10、15、20、25、30 路线。"
      ],
      [
        "有哪些形状？",
        "游戏实际使用圆形、正方形、三角形、星形、菱形与爱心。"
      ],
      [
        "乘客为什么消失？",
        "记忆乘客路线会暂时藏起它；再点乘客即可无惩罚显示同一形状。"
      ],
      [
        "车厢为什么移动？",
        "移动车厢会在答对后重新排序，让玩家再次观察。"
      ],
      [
        "车厢为什么不接受选择？",
        "验票路线要求先点乘客，再选车厢。"
      ],
      [
        "选错会怎样？",
        "同一名乘客会留在画面，玩家可在温和提示后再试。"
      ],
      [
        "进度会保存吗？",
        "星星与最高解锁路线只保存在目前浏览器，不需要登入。"
      ],
      [
        "手机与键盘都能玩吗？",
        "可以，触控、拖曳、滑鼠与键盘使用相同配对规则。"
      ],
      [
        "Kids 页面有广告吗？",
        "没有，《动物形状小火车》不会建立广告请求或广告保留区。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["tiny-weather-rescue"] = {
    "title": "动物帮帮队",
    "age": "6+",
    "difficulty": "简单",
    "time": "每个任务 3–6 分钟",
    "skills": [
      "问题解决",
      "情境判断",
      "专注力"
    ],
    "intro": "《动物帮帮队》是一款免费双语 Kids 看图益智游戏，共有 30 个可保存任务与六次帮手检查。兔子、狐狸、猫熊、企鹅、狮子或无尾熊会在六个地点遇到下雨、淋湿、炎热、黑暗、雷声、饥饿、泥泞、寒冷或强风。玩家要从雨伞、毛巾、风扇、小灯、小屋、苹果、雨靴与毯子中选择。后段会移除可见道具文字、合并两个线索、暂时藏起需求，或在答错后改变道具位置。第 30 任务结合所有规则，没有倒数、购买、帐号、生命限制或广告请求。",
    "story": [
      "六个动物社区共用一台装著八种工具的小帮手车。天气与日常需求会打断路线，玩家要看懂情境并送出有用道具，让小帮手车继续前往下一站。",
      "这些是简化的游玩情境，不是专业野生动物照护教学。双线索会要求判断眼前优先需求：下雨又强风要先进小屋，已经淋湿则需要毛巾。完成第 30 任务代表通过最后一次综合帮手检查。"
    ],
    "systems": [
      "每个任务有四到六个情境与清楚目标；点道具或拖到动物身上都使用同一判定。",
      "答对增加一次帮忙；答错会温和提示，同一题三次答错后自动前往下一个情境，避免卡住。",
      "图片工具隐藏可见文字但保留无障碍名称；双线索需要一个优先答案；记忆需求可免费再看；换位工具会在答错后重排。",
      "过关会在目前浏览器保存星星、最佳分数、游玩次数、错误与下一个解锁。技能报告只使用本次真实结果。",
      "没有帐号、购买、倒数、排行榜、广告请求、广告保留区或正式能力评量。"
    ],
    "how": [
      "按开始游戏，在水平任务轨道滑到已解锁卡片。",
      "观察动物、大型情境图示与简短需求。",
      "比较道具图片，再点选或拖到动物身上。",
      "记忆需求消失时，可点动物无惩罚再看。",
      "达成目标即可保存星星，并只解锁下一个任务。"
    ],
    "strategyTips": [
      "先说出情境，再看道具。",
      "图片工具要比较物件形状与颜色。",
      "出现两个线索时，先判断哪个需求最急。",
      "忘记需求就再看，不必猜。",
      "换位任务答错后要重新扫视整个道具盘。",
      "把温和提示当成排除不适合道具的资讯。"
    ],
    "progression": [
      "第 1–5 任务教一个清楚需求，第 5 任务是首次帮手检查。",
      "第 6–10 任务移除可见道具文字，但保留无障碍名称。",
      "第 11–15 任务把两个情境线索合成一个优先选择。",
      "第 16–20 任务短暂藏起需求，点动物即可恢复。",
      "第 21–25 任务会在错误后重新排列道具。",
      "第 26–30 任务结合图片、双线索、记忆与换位；第 30 任务有六个情境。"
    ],
    "designNote": "难度来自改变有用线索，而不是缩小按钮或加入压力倒数。直接需求先建立道具意义，再分别加入看图、优先判断、短期记忆与位置变化。固定逻辑画面会在手机、平板、桌面与短横向萤幕等比缩放；情境特效不会直接显示答案，切到背景也不会让回馈偷偷结束。它不同于《动物园小帮手日》的照护分类与顺序流程，本作把环境情境连接到立即道具选择。Kids 游玩没有广告、帐号、购买、排名或诊断宣称。",
    "parent": "《动物帮帮队》可用来谈看图辨识、因果、简单优先顺序、短期记忆、专注与手眼协调。真实动物需要合适栖地、饮食、专业照护与兽医支援，远比游戏情境完整。星星与技能报告只是游玩回馈，不是成绩、智力分数、健康宣称或发展评量。进度只在目前浏览器保存；不需要儿童帐号，Kids 路线也不会请求广告。",
    "faq": [
      [
        "共有多少任务？",
        "共有 30 个可保存任务，帮手检查位于第 5、10、15、20、25、30 任务。"
      ],
      [
        "有哪些情境与道具？",
        "九种情境使用八种图片道具。"
      ],
      [
        "道具文字为什么不见？",
        "图片工具与综合任务刻意依靠图片，但无障碍名称仍保留。"
      ],
      [
        "两个图示代表什么？",
        "要选出能处理两个线索所描述之眼前优先需求的道具。"
      ],
      [
        "需求消失怎么办？",
        "点动物即可无惩罚再次显示。"
      ],
      [
        "道具为什么移动？",
        "换位任务会在答错后重排。"
      ],
      [
        "任务会卡住吗？",
        "不会，同一情境三次答错后会温和前往下一题。"
      ],
      [
        "进度会保存吗？",
        "星星、分数与解锁只保存在目前浏览器。"
      ],
      [
        "Kids 页面有广告吗？",
        "没有，本作不会建立广告请求或保留区。"
      ]
    ]
  };
  const helperQuestHansTerms = new Map([
    ["装著", "装有"],
    ["猫熊", "熊猫"],
    ["无尾熊", "考拉"],
    ["照护", "照料"],
    ["回馈", "反馈"],
    ["帐号", "账号"],
    ["目前浏览器", "当前浏览器"],
    ["萤幕", "屏幕"],
    ["资讯", "信息"],
    ["栖地", "栖息地"],
    ["评量", "评估"],
  ]);
  const normalizeHelperQuestHans = (value) => {
    if (typeof value === "string") {
      let normalized = value;
      helperQuestHansTerms.forEach((replacement, regionalTerm) => {
        normalized = normalized.replaceAll(regionalTerm, replacement);
      });
      return normalized;
    }
    if (Array.isArray(value)) return value.map(normalizeHelperQuestHans);
    if (value && typeof value === "object") {
      Object.keys(value).forEach((key) => {
        value[key] = normalizeHelperQuestHans(value[key]);
      });
    }
    return value;
  };
  normalizeHelperQuestHans(localizedGames["zh-Hans"]["tiny-weather-rescue"]);

  localizedGames["zh-Hans"]["beast-deck"] = {
    "title": "兽王牌组：迷雾森林",
    "difficulty": "中等",
    "time": "每个任务 8-15 分钟",
    "gameplay": "回合制 Roguelike 牌组构筑",
    "genre": [
      "卡牌策略",
      "Roguelike",
      "动物冒险"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "专注"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档说明",
    "hideScoreBands": true,
    "intro": "《兽王牌组：迷雾森林》是一套以判读敌人意图、安排出牌顺序为核心的 30 任务回合制牌组战役。每个任务有三场连续战斗；通过前两场后各选一张本次任务限定卡并恢复部分生命，击败第三场才会保存经验、兽王金币与下一个任务。六个五关区域依序加入护甲、反击、疲劳、标记、再生、净化、虚弱、牌型封印、诅咒与三相结界。第 5、10、15、20、25、30 任务各有一只不同首领，生命降到门槛时还会进入新阶段。",
    "story": [
      "迷雾森林原本由动物守望者使用六条道路连结：迷雾小径、铁根工坊、琥珀大猎、盘沼深潭、月影典藏与雾冠王座。冠雾开始逆风流动后，普通动物受到腐化，道路也彼此中断。暗影野猪与毒蛇占据入口；铁根生物发展出护甲与反击；琥珀猎手会标记穿越者；盘沼生物能从毒素中再生；月影典藏封印整类动物能力；最后的王庭则用迷雾诅咒污染干净的抽牌。",
      "玩家扮演兽王牌组的保管者。这本行动牌册会借用友善动物的特长，不需要让牠们亲自承受危险。狼群突袭提供快速攻击，守卫熊与铁甲龟建立格挡，天鹰把伤害与抽牌结合，猎豹把速度转成手牌与能量，毒蛇累积中毒，猫头鹰则深入搜寻牌库。通过任务代表该段路线已稳定到能重新接通；在第 30 任务击败雾冠兽王，代表迷雾源头的结界被解除，六条道路全部恢复。"
    ],
    "systems": [
      "回合流程：玩家回合会恢复能量、清除暂时格挡并抽三张牌。打出的牌进入弃牌堆；回合结束时，剩余手牌也会弃掉。抽牌堆用尽后，弃牌堆重新洗回。除非浓雾正在遮蔽，敌人下一个攻击、防御、中毒或特殊行动都会显示在头顶，所以结束回合是一个可判断的风险决策。",
      "卡牌连动：狼群突袭基本造成 6 点伤害，同回合先打过其他攻击牌后改为 12；天鹰造成 14 点并抽一张；守卫熊取得 6 点格挡，铁甲龟取得 15 点；猎豹疾跑抽两张并补回一点能量；毒蛇之牙施加三层中毒；猫头鹰智慧不耗能抽一张。中毒在敌方行动后造成伤害并减少一层，敌人格挡则先吸收固定伤害。",
      "区域规则：护甲会削减每一次直接命中；反击会回敬下一张攻击牌；疲劳提高一张指定牌在下个玩家回合的能量；标记要求回合结束前打出指定牌；虚弱降低下一次攻击。再生会在敌方行动后治疗，净化移除中毒，加速会跳过更多意图位置，浓雾隐藏下一个显示意图，封印则在一个玩家回合停用攻击、防御或功能牌。",
      "雾冠规则：诅咒行动会把临时的迷雾诅咒放入战斗牌库。花一点能量打出可永久清除该张诅咒；回合结束仍握在手中则先受伤，再随弃牌循环回来。最终三相结界会阻挡直接伤害，直到玩家分别使用过攻击、防御与功能牌。结界进度可以跨回合，但最终首领在后期阶段会重建结界。",
      "任务构筑：基础牌组由多张狼群突袭、守卫熊，以及天鹰、猎豹组成。通过第一、第二场后，从三张候选卡选一张加入本次任务；新卡保证出现在下一场开手牌。选单中的永久卡册是另一套系统：金色兽王卡包花费 80 枚兽王金币，会给永久卡牌或装备；重复取得可提高阶级，出战前最多装备六张额外卡。",
      "永久成长：经验提高本机玩家等级与生命上限，兽王金币用于抽卡包。迷雾披风提高最大生命、猎手护符增加每场起始能量、森林战旗增加开场格挡，装备阶级会强化效果。任务、卡册、装备、等级、经验、金币与可选迷雾护符都保存在目前浏览器。迷雾护符花 15 颗平台钻石、需要二次确认，也不是通过 30 任务的必要条件。"
    ],
    "how": [
      "进入任务准备后，左右滑动完整的 30 任务轨道，点选任何已解锁任务；锁定卡仍会显示，方便看清整条战役。",
      "在牌组分页装备最多六张永久卡与一件装备；升级分页可用兽王金币抽卡包，也会显示可选迷雾护符。",
      "战斗中先阅读敌人头上的意图，再点击能支付能量的卡牌。不能打出的牌会说明是能量不足、等待回合或受到牌型封印。",
      "安排同一回合的顺序：先用其他攻击启动狼群连击，在花完能量前先抽牌，遇到大攻击则在结束回合前建立格挡。",
      "击败第一个敌人后选一张临时卡，它会放进下一场开手牌；第二场结束后再选一次。",
      "在生命归零前击败第三场。普通任务最后是特制菁英；每五关则由具名区域首领取代。",
      "胜利后可直接进入下一任务、重试目前任务或返回准备；失败不会删除已保存的永久进度。"
    ],
    "strategyTips": [
      "把意图顺序当成资源。琥珀敌人的加速会跳过原本预期的下一个行动，浓雾则会刻意让一个回合失去这项资讯。",
      "面对护甲前先算每次命中。一次天鹰通常比两次小攻击有效；中毒不受护甲与三相结界阻挡。",
      "不要把所有攻击牌丢进反击架势。反击存在时可先防御、抽牌或施毒，等敌人换成下一个行动再进攻。",
      "牌被标记后，不要盲目抽太多牌。打出指定牌即可解除；回合结束仍握著它，才会承受显示的伤害。",
      "面对再生时应保留能量集中爆发，避免零碎伤害立刻被补回；面对净化则应等净化行动结束后再叠中毒。",
      "三相结界是出牌顺序题：先用便宜功能牌与防御牌，再让应该造成伤害的攻击牌成为第三种。重复同类型不会增加进度。",
      "永久等级与装备能降低容错压力，但每区规则仍有战术答案。重玩旧任务适合取得金币与经验，不能取代阅读目前敌人。"
    ],
    "progression": [
      "第 1-5 任务是迷雾小径。前段教攻击、格挡与中毒，棘甲雄鹿首次加入护甲。磐背巨兽是第一只首领，两次生命门槛都会增厚护甲，因此要把较大攻击与中毒搭配，而不是反复使用相同小攻击。",
      "第 6-10 任务穿越铁根工坊。铁根胡狼带来反击与疲劳，后续再把它们与护甲、重击组合。铁根守卫每进入一个首领阶段都会提高反击伤害，防御与功能回合也会成为输出计划的一部分。",
      "第 11-15 任务进入琥珀大猎。琥珀山猫以加速跳跃意图，并标记必须打出的牌；虚弱则压低下一次攻击。琥珀猎主会同时使用标记、虚弱与加速，生命降低后追猎速度再提升。",
      "第 16-20 任务来到盘沼深潭。盘沼蟾蜍在行动后再生，中毒必须与治疗竞速，净化也能清掉准备好的毒蛇战术。泥沼盘蛇在生命门槛增加被动再生，更鼓励保留一个完整爆发回合。",
      "第 21-25 任务探索月影典藏。典藏夜枭轮流封印攻击、防御与功能牌，迫使牌组在少一种类型时仍能运作。月典守藏者每个阶段都会改变禁用牌型，单一类型无法包办整场战斗。",
      "第 26-30 任务逼近雾冠王座。冠雾狼放入诅咒并启动浓雾；第 28 任务预演三种牌型结界；第 29 任务混合先前规则。雾冠兽王以三相结界开场，加入诅咒、轮替封印，并在最后阶段重建结界。通过第 30 任务即完成设计好的战役，不会转成只增加数字的无限路线。"
    ],
    "designNote": "每个任务采三场战斗，是因为牌组选择需要足够时间产生差异，又不应把一次浏览器游玩拖成过长耐久战。两次临时选牌形成明确弧线：用准备牌组解开第一题，调整一次，再于菁英或首领前精炼一次。除非浓雾是当前规则，敌人意图始终可见，让失败能回到一个可理解的决策。数值曲线刻意维持接近旧八任务的上限；第 30 任务的困难来自规则交叠，不是无限制膨胀。手机以大张横向卡牌与点击操作为主，桌面沿用相同牌序与资讯层级。相较《动物自走小队》把决策集中在自动战斗前，本作要求逐回合亲自解牌；相较《动物符文战棋》使用格子站位，本作把抽牌顺序、能量与弃牌时机当成主要空间。",
    "parent": "目前浏览器会在本机保存已解锁、最佳与选中任务、玩家等级、经验、兽王金币、卡牌收藏、装备卡、装备与阶级，以及迷雾护符。基本游玩不需要登入；清除本站浏览器资料可能移除进度。一般任务、临时选牌、使用游戏内兽王金币的卡包与六场首领战都不需要钻石；永久迷雾护符完全可选，扣除前会显示持有与剩余钻石。能力标签只描述游玩活动，不是正式评量。",
    "faq": [
      [
        "兽王牌组可以免费玩吗？",
        "可以。完整 30 任务、临时选牌、兽王金币卡包与六场首领战都能直接在浏览器免费游玩。"
      ],
      [
        "总共有多少任务与首领？",
        "共有六区、30 个设计任务；第 5、10、15、20、25、30 任务各有一只不同具名首领与阶段机制。"
      ],
      [
        "哪些进度会保存？",
        "浏览器会保存任务、等级、经验、兽王金币、卡册、装备卡、装备阶级与迷雾护符。"
      ],
      [
        "战斗后选的卡会永久保留吗？",
        "不会。第一、第二场后选的卡只存在本次任务；永久卡牌来自使用兽王金币购买的卡包。"
      ],
      [
        "迷雾诅咒怎么处理？",
        "诅咒会占用抽牌。花一点能量打出即可从目前战斗清除；留在手中结束回合会造成两点伤害并进入弃牌循环。"
      ],
      [
        "最终结界怎么破解？",
        "分别使用至少一张攻击、防御与功能牌。三种牌可以跨回合完成，但最终首领在后期阶段会重建结界。"
      ],
      [
        "钻石是必要的吗？",
        "不是。钻石只用于可选迷雾护符，会要求二次确认，也不会阻挡任务、游玩取得的卡牌或首领。"
      ],
      [
        "手机可以玩吗？",
        "可以。任务使用水平滑动轨道，战斗使用大张点击卡与固定结束回合按钮，不需要键盘或滑鼠。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-orb-fortress"] = {
    "title": "动物星珠要塞",
    "difficulty": "困难",
    "time": "每关 5-8 分钟",
    "gameplay": "反弹射击要塞 Roguelite",
    "genre": [
      "反弹射击",
      "动作策略",
      "Roguelite",
      "动物"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "专注"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档说明",
    "hideScoreBands": true,
    "intro": "《动物星珠要塞》是一套以阅读战场与规划反弹路线为核心的 30 关防守战役。每关包含三个连续波次，玩家从狮子守卫旁拖曳瞄准，预览墙面反弹后放开星珠，在影兽接近水晶核心前击退牠们。六个五关区域依序加入护甲、荆棘锚点、相位敌人、水晶分裂兽、移动镜面柱、冲锋路线，以及六场规则不同的区域 Boss 战。波次之间选择本局祝福，关卡之间则用星石升级四个永久要塞房间。",
    "story": [
      "水晶要塞位在六条守护道路交会的位置：水晶森林、荆棘工坊、月光遗迹、镜面宝库、风暴壁垒与蚀影核心。核心开始发出不稳定脉冲后，暗影动物沿著道路靠近。狮子星珠守卫不能离开核心，因此每次防守都必须从发射室把星珠导向墙面、镜门与敌方路线。",
      "通过一关代表该段道路已稳定到足以让修复队重新开放。盘根魔像守在森林入口，荆背巨兽占领工坊，月灵女王能穿过月光道路，棱晶甲摄政王控制镜库，暴风角守卫标记冲锋路线，虚空核心皇则以三阶段封锁最后房间。完成第 30 关代表六条道路重新连结，核心也不再吸引新的影兽。"
    ],
    "systems": [
      "瞄准与反弹：从发射器拖曳可预览第一段路线，放开后会射出主星珠与一颗角度相关的弱化回音珠。墙面反弹可以跨越多条路线，或打到被前排遮住的优先目标。分裂星珠能增加第三颗弹体，穿透星芒则缩短同一颗星珠再次命中相同敌人的间隔。",
      "三波关卡：前两波先让玩家理解本关规则。第三波通常是特制菁英阵形；第 5、10、15、20、25、30 关则改为具名区域 Boss。通过一波后仍保留核心损伤与本局升级，只暂停让玩家选一个祝福，再继续同一关。",
      "特殊敌人：装甲兽要先消耗固定次数的护甲；不移动的荆棘锚点会定期替邻近队友加盾；月光幽灵会用虚线提示进入相位，显形前无法受伤；水晶分裂兽倒下后会产生两枚更快碎片；冲锋兽先标记路线，突进后才留下可攻击空档。",
      "镜面柱：中后期会在竞技场内放置一到两座六角镜面柱，星珠会真的从柱面反射，形成早期关卡不存在的新路线。有些镜面柱会左右移动，同一波中原本有效的角度也可能失效。",
      "Boss 规则：盘根魔像会重建防护；荆背巨兽在生命门槛召唤锚点与装甲护卫；月灵女王交替显形与相位；棱晶甲摄政王只在金色盾片打开时受伤；暴风角守卫完成标记冲刺后才会外露；虚空核心皇会两次换阶段、补盾、召唤四名护卫并启动两座镜面柱。",
      "本局与永久成长：每波可从巨大星珠、分裂星珠、穿透星芒、快速充能、核心护盾、侦查磁力中选择祝福。结算取得的星石可提升星珠锻造室伤害、核心护盾室起始生命、伙伴巢穴支援攻击与侦查高塔奖励。花三颗钻石重抽祝福完全可选，需二次确认，也不是解锁关卡的必要条件。"
    ],
    "how": [
      "从水平滑动的要塞地图选择已解锁关卡，先阅读关卡名称、规则标签与专属警告。",
      "从狮子守卫旁拖向想要的角度，利用预览判断直接射击、单墙反弹、跨场反弹或镜柱反射能否命中优先目标。",
      "放开后射出星珠，观察护甲圈、相位虚线、冲锋标记、锚点保护与 Boss 提示，再决定下一次射击。",
      "通过前两波后各选一个祝福。重抽花三颗钻石并需要再按一次确认；选好祝福就立刻继续下一波。",
      "第三波结束前保持核心生命大于零。胜利会保存下一关与星石；失败仍保存已取得星石，且不会失去最佳已解锁关卡。",
      "回到地图使用星石升级房间、重玩旧关，或从结算画面直接进入下一关。"
    ],
    "strategyTips": [
      "不要永远攻击最近的敌人。锚点、分裂兽与后排幽灵可能比慢速前排更危险，应用反弹路线处理真正优先目标。",
      "看到相位虚线代表伤害会被挡住。先保留角度，等敌人重新显形再放开，不要浪费整组星珠。",
      "移动镜面柱也是工具，不只是障碍。稍微预判柱子移动位置，让星珠撞上后穿越墙面无法到达的路线。",
      "面对冲锋兽与暴风角守卫，要先看标记路线并等待恢复空档；快速充能只有在射击时机正确时才有价值。",
      "核心护盾与快速充能适合稳住压力，巨大星珠与穿透星芒能缩短危险 Boss 阶段；侦查磁力偏向长期成长，无法立即阻止核心被撞。",
      "只有三个祝福都不符合本关规则时才考虑可选钻石重抽。正常解锁 30 关与六名 Boss 都不要求花钻石。"
    ],
    "progression": [
      "第 1-5 关教直接射击、单墙反弹、分离路线与目标顺序。盘根王冠是第一个检查点；魔像会在外露一段时间后重建防护，所以玩家要先破防，再利用空档攻击。",
      "第 6-10 关加入固定次数护甲与不移动的荆棘锚点。第 11-15 关把持续射击改成相位时机，再加入第一座移动反射门。荆背巨兽会在战斗中召援，月灵女王则在无敌相位与恢复空档间切换。",
      "第 16-20 关加入可实际反射星珠的镜面柱，以及倒下后产生快速碎片的分裂兽。第 21-25 关加入路线标记、冲锋与风暴时机。棱晶甲摄政王有旋转伤害窗口，暴风角守卫必须完成冲刺后才能受伤。",
      "第 26-30 关把护甲、锚点、相位、分裂、冲锋与移动镜柱组成特制阵形。第 29 关使用完整普通敌人语汇；第 30 关加入两次虚空核心换阶段、四名支援、补盾与两座镜面柱，同时测试瞄准、目标顺序、时机、本局祝福与永久房间成长。"
    ],
    "designNote": "本作采三个短波次，是为了让每关像一个集中的反弹问题，而不是过长的耐久战。波次间保留核心损伤与本局配置，只加入一次简短祝福决策。前期只使用墙面，让玩家先理解可预测几何；后期镜面柱增加新反射面，也会使背熟的角度失效。特殊敌人用护甲圈、相位虚线、路线标记与独立 Boss 图直接传达反制方式，不要求玩家在战斗中阅读长篇规则。手机以拖曳为主；键盘左右键调整同一套角度，空白键或 Enter 发射。相较《兽王守卫》的配置守卫与《动物自走小队》的战前编成，《动物星珠要塞》把射击路径本身当作主要策略资源。",
    "parent": "浏览器会在本机保存最佳已解锁关卡、星石、游玩次数，以及星珠锻造室、核心护盾室、伙伴巢穴、侦查高塔的等级；基本游玩不需要登入。清除本站浏览器储存资料可能移除进度。钻石祝福重抽完全可选，会显示目前与扣除后余额，不是完成 30 关的必要条件。分数与能力回馈只描述游玩表现，不是正式能力测量。",
    "faq": [
      [
        "每关的目标是什么？",
        "守住水晶核心并通过三个波次。完成第三波会保存关卡、取得星石并解锁下一关。"
      ],
      [
        "每关都会出现同一只 Boss 吗？",
        "不会。只有每五关是区域 Boss 检查点；其他关以特制菁英阵形收尾，六名 Boss 的图像、提示与反制规则都不同。"
      ],
      [
        "为什么星珠穿过月光敌人？",
        "相位虚线代表敌人暂时没有实体。等牠重新显形，再放开已准备好的射击。"
      ],
      [
        "镜面柱有什么作用？",
        "它是竞技场内真正的反射面；后期镜柱会移动，让同一波中的可用反弹路线改变。"
      ],
      [
        "需要钻石才能完成战役吗？",
        "不需要。钻石只在二次确认后重抽一次当波的三个祝福。"
      ],
      [
        "关卡失败会怎样？",
        "本局会结束，但已取得星石仍会保存，最佳已解锁关卡不会倒退。可以升级房间、换一条射击计划或直接重试。"
      ],
      [
        "哪些进度会保存？",
        "最佳已解锁关卡、星石、游玩次数与四个要塞房间等级会保存在目前浏览器本机。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-auto-squad"] = {
    "title": "动物自走小队",
    "age": "13+",
    "difficulty": "中等",
    "time": "5-10 分钟",
    "gameplay": "自走小队编成策略",
    "genre": [
      "自走战斗",
      "编成策略",
      "角色成长",
      "动物"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "策略规划"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档说明",
    "hideScoreBands": true,
    "intro": "《动物自走小队》是一款以战前决策为核心的编成策略游戏。玩家可以解锁并训练十名动物英雄，把最多六名角色配置在前后两排，选择一件远征圣物，再观看小队依照站位与能力自动交战。战役共有 30 关，依序穿越荆棘林、水晶洞窟、沉没遗迹、烬火峰、月光城塞与虚空王冠。每关包含五波固定设计的敌人，第 5、10、15、20、25、30 关则各有一名专属区域 Boss。",
    "story": [
      "远征路线被影之兽、水晶生物、重甲守卫、符文兽与月蚀猎手分段占据。小队从荆棘林的苔藓小径出发，接著深入棱晶之心、沉没王冠、火山口之王、子夜王庭，最后沿著破碎天路抵达虚空王冠。每区都有不同的敌人组合与最终首领；完成六区代表解除整条远征路线的封锁。",
      "玩家扮演的是小队指挥者，不是在战斗中直接操作某一名角色。星爪狐、泡泡鳍水獭、鼓肚熊猫、月帽猫头鹰、苔壳乌龟与其他可解锁英雄，都有明确的攻击、治疗、护盾或倒下效果。真正的任务是在交战前决定由哪六名角色同行，以及谁应站在前排或后排。"
    ],
    "systems": [
      "阵形：上方三格是前排，下方三格是后排。攻击目标会受到站位影响；部分角色攻击最前方敌人，月帽猫头鹰会追击后排，爆鬃狮则能横扫整排。",
      "角色定位：攻击、治疗、护盾、全队增益与倒下效果都会自动触发。泡泡鳍水獭和彩虹跳兔会照顾受伤队友，鼓肚熊猫与苔壳乌龟则能提高全队承受伤害的能力。",
      "远征圣物：枫叶盾、橡树种子、影爪与幸运草会改变整场远征的规则。正常选择免费；花费 3 颗钻石只会重新抽选目前提供的圣物。",
      "临时物资：每场远征以 12 点物资开始。在准备阶段选取已拥有角色，可以购买只在本场有效的等级，增加攻击与生命；战斗中取得的物资会保留在这场远征内。",
      "永久成长：通过波次可获得团队经验与训练金币。团队等级会提供全员攻击与生命加成；一般英雄使用训练金币解锁与升级，最高 20 级，另有两名进阶英雄使用可选钻石解锁。"
    ],
    "how": [
      "在横向滑动的关卡列选择已解锁关卡；每五关会标示一场 Boss 战。",
      "需要永久强化时，进入训练分页使用训练金币、解锁一般英雄，并查看团队等级提供的全队加成。",
      "出征后，先点角色背包中的动物，再点六个上场格之一完成配置；也可以点已上场角色重新移动或替换。",
      "选择一件远征圣物，并把本场物资用在准备上场的角色，购买临时攻击与生命提升。",
      "按下开始战斗后，攻击、治疗、护盾、整排攻击与倒下能力会依照阵形自动结算。",
      "胜利后会直接出现下一波；失败会扣一点生命并重新开放准备。生命归零且不复活时，本场远征结束。",
      "通过第五波后，系统会保存关卡、团队经验、训练金币与下一个解锁关卡；结果画面可选下一关、再试一次或回到关卡。"
    ],
    "strategyTips": [
      "按下开始战斗前要替完整五波做准备。每波胜利会直接接续下一组敌人，因此能处理多种目标的平衡阵容，比只克制第一波更安全。",
      "前排适合放能承受压力或提供护盾的英雄。苔壳乌龟、鼓肚熊猫与齿轮角犀牛，可以替后排攻击手和治疗角色争取时间。",
      "不要只比较攻击数字，也要看目标规则。月帽猫头鹰能碰到脆弱后排；敌人集中同一排时，爆鬃狮的整排攻击更有价值。",
      "六名 Boss 的规则不同：荆棘狼王攻击整排并替自己加盾，深渊壳海皇会保护与治疗敌军，虚空王冠狮皇则会伤害全队并恢复自身生命。"
    ],
    "progression": [
      "第 1-5 关以较小的荆棘林敌群教导最前目标、后排威胁、守卫与两排阵形，第 5 关荆棘王座是第一个 Boss 检查点。第 6-15 关加入水晶洞窟与沉没遗迹敌人，开始出现后排攻击、吸血、整排横扫与高耐久守卫。",
      "第 16-25 关增加同时上场的敌人数与能力组合。烬火峰会混合冲锋野猪、黑曜重兽、裂隙迅兽与符文狼；月光城塞则加入夜影黑豹、月蚀蝙蝠、符文乌鸦与暗影美洲豹。Boss 波还带有护卫，因此不能只处理中央首领。",
      "第 26-30 关会使用完整的虚空王冠敌人阵容。第 29 关最多同时出现六名敌人，与玩家的最大编队相同；第 30 关最后一波让虚空王冠狮皇与符文、月蚀及暗影护卫同场，检验整排输出、恢复、伤害与整段战役累积的永久训练。"
    ],
    "designNote": "自动战斗是刻意的设计选择：战斗执行保持精简，让主要思考集中在阵形、定位互补、攻击目标、圣物选择与永久训练。胜利后直接衔接下一波，是为了让五波像一场完整远征，而不是五次反复进出选单；失败后重新开放准备，则让玩家能回应问题，不必一直观看同一套失败配置。手机采点选角色再点格子的方式，桌面也能使用相同卡片操作。相较于回合制的《动物符文战棋》或需要即时移动的《动物水晶生存者》，本作要求玩家先完成计划，再从自动战斗结果判断计划是否有效。",
    "parent": "后期关卡会同时组合六人阵形、特殊攻击目标、永久升级、战斗失败压力、Boss 能力与可选钻石决策。关卡进度、上次出场阵容与位置、训练金币、团队等级、已解锁角色、角色永久等级、已完成关卡与外观选择，都会储存在目前浏览器本机；基本游玩不需要登入。清除本站的浏览器储存资料可能会移除这些本机进度。",
    "faq": [
      [
        "动物自走小队可以免费玩吗？",
        "可以。30 关战役能直接在 WeightPlay 浏览器页面游玩，不要求购买或登入。"
      ],
      [
        "每一关的目标是什么？",
        "配置能撑过五波连续敌人的小队。通过第五波便会保存关卡并解锁下一关；每五关的最后一波都有区域 Boss。"
      ],
      [
        "战斗时需要手动攻击吗？",
        "不用。玩家在战前决定角色、前后排、圣物与临时升级，之后动物会依照能力自动攻击、治疗、加盾与触发效果。"
      ],
      [
        "每波之间都能重新排队吗？",
        "胜利会直接进入下一波。只有失败或平手且仍有生命时，才会回到准备画面，因此初始阵容要能面对不只一种敌人排列。"
      ],
      [
        "输掉一波会怎样？",
        "本场会失去一点生命。生命尚未归零时，可以调整阵容后再挑战同一波；生命归零时可结束远征，或使用可选的 5 颗钻石复活。"
      ],
      [
        "钻石可以做什么？",
        "钻石只提供可选功能，包括重抽圣物、远征复活、解锁两名进阶英雄与黄金外观；一般关卡进度不需要钻石。"
      ],
      [
        "哪些进度会保存？",
        "浏览器会在本机保存已解锁与完成关卡、上次出场阵容与位置、团队等级与经验、训练金币、已解锁角色、角色永久等级、远征纪录与外观选择。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["beast-tactician"] = {
    "title": "兽王守卫",
    "difficulty": "困难",
    "time": "每关 8-15 分钟",
    "gameplay": "英雄塔防",
    "genre": [
      "塔防",
      "策略",
      "动物"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "专注"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档说明",
    "hideScoreBands": true,
    "intro": "《兽王守卫》是一套以自由改造路线为核心的 30 关英雄塔防战役。玩家在森林格子上配置四种动物士兵与七名 WeightPlay 英雄，保留至少一条可通行路线，穿越六个五关区域并守住水晶核心。暗狼、重甲野猪、飞行影蝠、再生敌群、受伤加速者与月蚀混合编队，都需要不同的防线。第 5、10、15、20、25、30 关各有改变规则的 Boss，不是只把普通敌人的生命放大。",
    "story": [
      "水晶路线连接守护森林的六个区域：最初的树根小径、水晶空中通道、铁皮木工坊、会再生的雾林、暴风壁垒，以及通往虚根王座的月蚀道路。敌群会从入口穿越玩家安排的防线前往另一端核心；通关代表该段路线已安全到足以让守卫队前进。",
      "玩家是整条防线的指挥者。栗果守卫与苔甲太郎负责撑住转角，侦查弓手与月帽欧菈覆盖长距离，符文工兵缓速群体，医护幼兽修复受伤阻挡者，火花菲雅则负责集中攻击 Boss。每个角色站的位置都会改变敌人行走距离、射击角度或阻挡风险。"
    ],
    "systems": [
      "路线建置：守卫可以放在一般地格，地面敌人会重新寻找路径。若完全封死所有道路，敌人不会消失，而是攻击最近的阻挡者直到路线恢复。飞行影蝠不受地面迷宫影响。",
      "角色定位：阻挡者争取时间，弓手与欧菈负责远程，工兵提供溅射与缓速，医护修复前线，菲雅专门处理 Boss 压力，齿角鲁克斯则强化附近队友。点选已部署角色可查看升级费用与出售返还。",
      "波次情报：每波开始前会列出暗狼、野猪、影蝠、护卫与 Boss 组成。非最终波通过后有五秒倒数，玩家可以读取下一波、花费刚取得的金币并调整升级。",
      "特殊敌人：铁皮木区的敌人有可击破护甲；雾林敌人移动时恢复生命；暴风敌人在生命低于一半后加速；月蚀区会同时混合护甲、再生、加速、飞行与较高缓速抗性。",
      "永久进度：胜利会取得星等、升级点与钻石。升级点可提高英雄力量、守卫生命或开场经济；钻石只用于可选的核心复活、结果奖励重抽与黄金守卫框，正常解锁 30 关不需要钻石。"
    ],
    "how": [
      "从可滑动关卡列选择已解锁关卡，先阅读敌情、建议与奖励。",
      "花费本关金币，在一般地格配置动物士兵或 WeightPlay 英雄；确认前可查看攻击范围。",
      "保留至少一条通路。完全封路时，地面敌人会直接攻击最近守卫。",
      "阅读波次情报后开始战斗，依照敌人组成升级或出售角色；非最终波会在五秒后自动接续。",
      "守住全部波次后，系统依剩余核心生命给予一至三星，结果画面可以前往下一关、重试或回到关卡。",
      "需要永久成长时，在关卡页使用升级点强化英雄力量、守卫生命或开场经济；钻石操作会显示成本并要求确认。"
    ],
    "strategyTips": [
      "先用栗果守卫做出两到三个射击转角，再投资昂贵英雄；路线越长，远程角色就有越多攻击时间。",
      "不要封死所有格子。完全封路会让敌人直接打阻挡者，反而失去拉长路线的优势。",
      "影蝠渡口与后续飞行关要在核心附近保留远程火力；暴风关则应先缓速野猪，再击破护甲，降低受伤加速的威胁。",
      "面对再生敌人，要把输出集中在同一火力区快速收掉；面对护甲敌人，先用持续或溅射火力破防，再投入英雄爆发。",
      "最终的虚根皇帝会在两个生命门槛转换阶段：先召唤影蝠，再带著重甲地面护卫并重建防护。"
    ],
    "progression": [
      "第 1-5 关教路线转角、分线、早期远程、野猪压力与封路后果。暗影巨汉的攻城节奏比普通 Boss 更快，第一区最后要测试防线是否有真正能撑住的主坦。",
      "第 6-10 关加入无视地面路线的影蝠与空地混合波；森林巨兽损失部分生命后会召唤暗狼与影蝠。第 11-15 关加入可击破的铁皮护甲，铁皮巨像则会在战斗中重新建立一层大型防护。",
      "第 16-20 关让未被击倒的敌人在移动时再生，翠绿古木会回血并呼叫支援。第 21-25 关加入受伤加速，暴风掠夺者还会提高护卫速度。第 26-30 关把先前规则全部组合并降低缓速效果；虚根皇帝进行两次阶段转换，要求地面路线、空中覆盖、破甲、收尾火力、治疗与 Boss 集火同时成立。"
    ],
    "designNote": "本作采自由配置，是因为核心决策不只是买哪座塔，而是每个角色如何改变移动时间、射击角度与阻挡风险。波次之间保留五秒倒数，让五波仍像同一场连续防卫，同时给玩家短暂调整时间。30 关分成六个机制区域，难度会先透过新反制与规则组合成长，再增加数值。手机与桌面共用大型建置卡与格子操作，键盘也能移动游标、建置、选取、升级、出售、切换角色与开始波次。相较于以战前编队为主的《动物自走小队》，《兽王守卫》允许玩家即时重塑战场并在波次中回应。",
    "parent": "浏览器会在本机保存最高解锁关卡、已通关关卡、最佳星等、永久科技、升级点、钻石余额与外观所有权；基本游玩不需要登入。清除本站浏览器储存资料可能会移除这些进度。钻石操作完全可选，不是解锁 30 关的必要条件。",
    "faq": [
      [
        "兽王守卫可以免费玩吗？",
        "可以。完整 30 关战役能直接在浏览器游玩，不要求购买或登入。"
      ],
      [
        "要怎么开始关卡？",
        "在滑动关卡列选择已解锁关卡后开始防卫；非最终波通过后会在五秒倒数结束时自动接续。"
      ],
      [
        "为什么敌人有时会直接打守卫？",
        "当所有通往核心的合法路线都被封死时，地面敌人会攻击附近阻挡者。下一次可出售或换位置，保留一条开放道路。"
      ],
      [
        "六个 Boss 有什么不同？",
        "暗影巨汉快速攻城、森林巨兽召援、铁皮巨像重建护甲、翠绿古木回血、暴风掠夺者加速护卫、虚根皇帝则有两次阶段转换。"
      ],
      [
        "星等代表什么？",
        "星等依胜利时剩余核心生命计算。惊险通关仍可解锁下一关，之后能重玩改进路线与最佳星等。"
      ],
      [
        "哪些进度会保存？",
        "解锁、通关、星等、升级点、永久科技、钻石与外观所有权都会保存在目前浏览器本机。"
      ],
      [
        "钻石可以做什么？",
        "钻石可选择性用于核心复活、结果奖励重抽或黄金守卫框，不影响正常战役解锁。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-relic-hunters"] = {
    "title": "动物遗迹猎人",
    "difficulty": "困难",
    "time": "每次远征 6-12 分钟",
    "gameplay": "房间动作 Roguelite",
    "genre": [
      "动作",
      "Roguelite",
      "动物冒险"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "专注",
      "反应"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档资讯",
    "hideScoreBands": true,
    "intro": "《动物遗迹猎人》是一款拥有 30 个远征的房间动作游戏。玩家带领狮子探险家穿越三个连续房间，装备中的遗物武器会自动射击，玩家则要依照不同遗迹区域的敌人行为调整走位。遗迹能量球会在本轮带来升级选择；金币、训练、装备与任务进度则保存在本机。六个五关区域各有一位真正不同的守护者，不是把同一只敌人放大重复使用。",
    "story": [
      "遗物之路曾连接六座档案遗迹：苔痕之门、回声长廊、水晶地库、沉没神殿、月影书库与王冠宫廷。每座遗迹都负责稳定一种古代动物遗物。王冠封印破裂后，能量没有只是让野兽的数字变大；苔原生物开始分裂与冲刺，长廊守卫会在武器射程外攻击，水晶看守形成挡住固定次数攻击的护罩，神殿野兽会再生，书库猎手则用沉默弹暂停遗物射击。",
      "玩家操作的爆鬃狮是一名携带自动遗物核心的野外探险家。每完成一次远征，就能重新打通一段道路。前两房的菁英守著金钥匙，钥匙可开启宝箱，把武器、护甲或靴子收入永久背包。第三房决定这条道路是否安全；远征 5、10、15、20、25、30 分别由苔原守护者、回声监守、水晶巨像、泽环多头兽、书库守密者与遗物冠冕王镇守。击败最后的冠冕王，代表六座遗迹终于能再次交换遗物，不再被腐化房间隔离。"
    ],
    "systems": [
      "远征流程：在横向 30 关滑轨选择已解锁任务。每次从满血与目前永久装备开始。清除基本敌群与稍后出现的持钥菁英，捡起钥匙、开宝箱并进入传送门。第二房加入更复杂的混合敌人，第三房则由任务守卫或每五关一次的区域守护者收尾。",
      "移动与攻击：电脑可用 WASD、方向键或在场地按住滑鼠；手机使用虚拟摇杆。武器自动瞄准最近敌人。水晶长剑增加直接伤害，遗迹短刃缩短射击间隔，护甲增加生命上限，靴子提升移动速度。玩家真正控制的是距离与最近目标：绕开追击者、从射手背后穿越、切入环绕敌人的圆周，需要不同路线。",
      "特殊敌人：冲刺者会在慢速跟随后突然加速；射手保持距离并发射遗物弹；脉冲敌人向四周放射；分裂者死亡后产生两只冲刺兽；护盾会抵销固定次数射击；再生者未受伤一段时间就恢复生命；减速敌人接触后降低移速；环绕者绕著玩家移动；沉默者暂停自动攻击。第六区会组合这些规则。",
      "守护者阶段：每只区域 Boss 在生命 70% 与 35% 时改变战局。苔原召唤冲刺者，回声释放更密集的环形弹幕，水晶重建计次护盾，泽环恢复生命并召唤减速兽，月影一边环绕一边发射沉默弹，冠冕则同时使用护盾、弹幕、召唤与恢复。最后一关考的是读懂多种效果，不只是磨掉更长血条。",
      "本轮成长：击败敌人会掉落绿色遗迹能量球。经验条填满时房间暂停，玩家从三个遗物能力选一个，例如伤害、攻速、生命、移速或吸取范围。每次选择可自愿花 3 颗钻石重抽一次。本轮遗物在新远征开始时重置，因此同一关也能用不同配置解题。",
      "永久成长：金币掉落与重复装备转换可升级背包装备。角色保存等级提供训练点，可投入伤害、生命、速度或吸取范围。背包记录已取得装备与三个栏位目前穿戴的物品。可选的迷雾护符会先确认再一次性花费钻石，把起始生命从 30 改为 40；任何任务、宝箱或守护者都不要求购买。"
    ],
    "how": [
      "滑动关卡轨道并选择已解锁远征；第 5、10、15、20、25、30 关会明确标示守护者。",
      "用 WASD、方向键、按住滑鼠或手机摇杆移动。瞄准会自动完成，走位决定距离与最近攻击目标。",
      "清除普通威胁，同时辨识冲刺、远射、护盾、再生、减速与沉默效果。",
      "收集遗迹能量球；升级时选择三个本轮能力之一，或使用一次可选重抽。",
      "击败第一、二房稍后出现的菁英，捡起金钥匙开宝箱，再决定立即穿戴或保留目前配装。",
      "带著前两房剩余生命与本轮能力进入第三房，击败任务守卫或区域守护者。",
      "胜利后前往下一任务，或返回关卡进行永久训练、装备升级与路线选择。"
    ],
    "strategyTips": [
      "不要每个房间都固定同方向绕圈。外圈被远射填满时要反向，环绕敌人确定弧线后则可切过内侧。",
      "蓝色光圈代表护盾仍在抵销攻击。若路线不安全，不必站著硬拆；先保持距离再找射击窗口。",
      "持续命中再生者可以打断恢复空窗。面对它时，稳定高伤害通常比四处分散的低伤害更有效。",
      "沉默弹只会暂停自动射击，不会夺走移动控制。利用这段时间换位，不要贴著敌人等待武器恢复。",
      "生命会带进下一房，传送门只提供少量恢复。第三房前选一个防御遗物，有时比再加伤害更重要。",
      "新装备在选择穿戴前就会加入背包。保留目前装备不会丢掉新物品，之后仍可比较与更换。",
      "永久训练能降低重试压力，但守护者阶段仍需要走位。第一次挑战应先学攻击规律，不必自动花钻石。"
    ],
    "progression": [
      "远征 1-5 教会最近目标、自动攻击、普通追击、计时冲刺与分裂。苔原守护者会在两个阶段召唤更多冲刺兽。",
      "远征 6-10 加入射手与环形脉冲，空间变成弹道问题。回声监守的弹幕会让房间外圈不再永远安全。",
      "远征 11-15 加入计次护盾与混合护卫。水晶巨像会两次重建保护，要求玩家安排爆发时机。",
      "远征 16-20 组合再生、接触减速与远射压力。泽环多头兽会恢复生命并呼叫减速敌人。",
      "远征 21-25 加入环绕路线与暂时沉默。书库守密者会一边绕行一边射出多角度沉默弹。",
      "远征 26-30 重组之前所有威胁。六印庭院是普通敌人的总验收，遗物冠冕王则结合护盾、弹幕、召唤与恢复。"
    ],
    "designNote": "每次远征设计成三个房间，是因为前两房的遗物选择与宝箱装备必须有机会影响最后考验，同时不把单一任务拖成过长的生存战。自动射击让手机操作集中在清楚的走位，键盘与按住滑鼠则保留桌面精准控制。第 30 关第三房的基础倍率刻意维持在 2.3 以下，难度主要来自射程控制、敌人混合与 Boss 阶段。这和《动物水晶生存者》的开放式三分钟竞分不同，也不同于《动物自走小队》的战前摆阵；本作由房间顺序、保留生命、装备决定与即时导航串成完整远征。",
    "parent": "任务进度、角色等级、经验、金币、训练、已拥有装备、装备等级、穿戴栏位与迷雾护符状态都保存在此浏览器。基本游玩不需要登入；清除网站资料可能移除本机进度。战斗不会产生平台钻石。钻石只用于可选的迷雾护符确认购买或一次遗物重抽；30 个远征与六位守护者都不要求钻石。",
    "faq": [
      [
        "《动物遗迹猎人》可以免费玩吗？",
        "可以。30 个远征、三房路线、装备掉落与六位守护者都能直接在浏览器游玩。"
      ],
      [
        "共有多少关与多少 Boss？",
        "共有 30 个远征；第 5、10、15、20、25、30 关各有一位机制不同的区域守护者。"
      ],
      [
        "哪些成长永久保存？",
        "任务解锁、等级、经验、金币、训练与装备会保存在本机；本轮选到的遗物会在新远征开始时重置。"
      ],
      [
        "护盾、减速与沉默怎么运作？",
        "护盾抵销固定次数射击，减速短暂降低移动速度，沉默则暂停自动攻击；三者都不会拿走走位控制。"
      ],
      [
        "保留目前装备会失去新物品吗？",
        "不会。新宝箱物品会先加入背包，选择只决定是否立刻穿戴。"
      ],
      [
        "钻石可以做什么？",
        "钻石可确认购买永久迷雾护符，或花 3 颗钻石重抽一次本轮遗物。任务、装备与守护者不需要钻石。"
      ],
      [
        "需要帐号才能保存吗？",
        "不需要。进度保存在目前浏览器；清除网站资料或换装置可能会开始另一份存档。"
      ],
      [
        "手机与电脑都能玩吗？",
        "可以。手机使用虚拟摇杆与大型选项，电脑支援键盘、方向键与按住滑鼠移动。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-rune-tactics"] = {
    "title": "动物符文战棋",
    "difficulty": "困难",
    "time": "每个任务 8-15 分钟",
    "gameplay": "回合制小队战棋",
    "genre": [
      "策略",
      "战棋",
      "动物冒险"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "专注",
      "规划"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档说明",
    "hideScoreBands": true,
    "intro": "《动物符文战棋》是在 3×4 符文棋盘进行的 30 任务回合制战役。狮王守护者、猫头鹰法师与乌龟盾卫在敌方回合前各能行动一次：移动、攻击、防守，或花能量使用不同技能。六个五关章节依序加入碎石、束缚、潮汐、燃烧、环月转动与封印，敌人也会反击、推移、沉默、标记、吸能或制造分身。第 5、10、15、20、25、30 任务各有一位不同的阶段首领，任务与永久成长会保存在目前浏览器。",
    "story": [
      "六条符文道路把动物领地连接到王冠典藏库。林地符文固定活根，锻林符文束缚铁木，潮汐符文调节淹水石室，余烬符文排出地热，月影符文保存记忆，王冠封印则让前五套系统维持同步。中央符冠破裂后，这些符文开始在没有守卫的情况下自行运作：桥面凝固成碎石，树根缠住旅行者，水流推动站在格上的单位，典藏封印反而保护破坏道路的野兽。",
      "玩家指挥三位符文守卫修复道路。狮王负责近战前线，猫头鹰能隔两格攻击，乌龟则保护并治疗全队。通过任务代表该段符文已稳定，可以继续前进。石角巨鹿、铁根犀王、泽环巨蛇、烬鬃狮王与蚀月狮鹫各占据一章；符冠奇美拉吸收了所有系统。第 30 任务击败牠，代表典藏库重新连线，而不是再冒出不存在的第 31 任务。"
    ],
    "systems": [
      "回合流程：选择一名存活英雄后执行一个动作。移动只能走到相邻合法格；攻击受英雄射程限制；防守使下一次敌方命中少 1 点伤害。技能花 1 点能量：狮王造成重击，猫头鹰攻击远距目标，乌龟让所有存活英雄防守并恢复 1 点生命。行动后英雄会标示完成；全员完成或玩家按下结束回合后，敌人依序行动，英雄能量最多恢复到 3。",
      "敌人差异来自站位规则。暗影狼相邻时取得狼群加伤；水晶渡鸦瞄准生命比例最低英雄；石角巨鹿会恢复第一次命中的石甲。荆棘野猪在近战命中后反击 1 点；符步狐狸行动后绕到最弱英雄后方；潮汐乌龟给最近友军一次守护；遗物苍鹭命中后推动英雄；烬角山羊看到同一直线英雄时改用冲锋。",
      "后期敌人会改变行动顺序。余烬蝾螈移动后留下暂时燃烧格；月尘飞蛾封锁一名英雄下一个玩家回合的技能，但不封锁移动、攻击与防守；典藏猫头鹰留下标记，使下一次远程命中加伤；镜影狼在有相邻空格时制造一只 1 生命分身；封印渡鸦吸收 1 点能量但不会降到零以下。第 29 任务会同时组合五章威胁。",
      "棋盘状态属于任务设计。碎石不能站立；根须束缚会取消受影响英雄下一次移动；潮汐在敌方回合后把单位推一格；燃烧伤害停在上面的英雄；一次性冷却符文恢复能量并清除燃烧；环月符文让外圈单位顺时针转动。六符封锁要求三位英雄占据相连封印格，否则敌方护罩会让每次伤害少 1。",
      "首领在 70% 与 35% 生命进入累积阶段，一次大伤害也不能跳过。石鹿刷新护甲并冲击同列；犀王架势防守、打击整列并留下碎石；巨蛇增加潮汐、拉动英雄，而且同回合未被两名英雄命中就再生；烬鬃狮放置火焰并在重伤后多行动一次；狮鹫在远程免疫的飞行与落地横扫间切换；最终奇美拉组合潮汐、燃烧、碎石、飞行与镜影召唤。",
      "永久成长有三层。胜利获得经验与符文；经验每满 100 提高小队等级。符文可把狮王、猫头鹰或乌龟升到 6 级，提高起始生命与攻击。战后符文奖励也会保存：力量增加攻击，守护增加最大生命，碎片增加 35 经验，专注增加起始能量，复活代币则在未来自动让一位倒下英雄以半血回归。花 3 颗钻石重抽奖励与花 18 颗钻石解锁训练格都是选择性功能，不会解锁任务或首领。"
    ],
    "how": [
      "左右滑动完整的 30 任务轨道，选择一张已解锁卡；每五关会显示具名首领。",
      "进场前阅读任务名称、敌人、特性、地形与战术提示。",
      "在棋盘或小队行动列选择狮王、猫头鹰或乌龟，再点相邻亮格移动、点可攻击敌人，或使用防守与技能。",
      "查看完成标记与英雄资讯。只有在保留站位比多做一个动作更安全时，才提早结束回合。",
      "敌方回合注意特性徽章与战斗讯息，判读反击、守护、推移、冲锋、沉默、标记、吸能、分身与首领阶段。",
      "击败所有敌人后选择一项永久符文奖励，确认保存的经验、符文、最佳任务与下一次升级差额。",
      "仍有下一关时可直接前进，也可重玩目前任务，或返回任务页升级英雄并选择任何已解锁关卡。"
    ],
    "strategyTips": [
      "先拆开暗影狼的相邻关系；移动一位英雄有时能同时移除两次狼群加伤。",
      "不要让猫头鹰贴著荆棘野猪攻击。隔两格射击能避开近战反击。",
      "被沉默的英雄仍可移动、普通攻击或防守，可先离开冲锋线，不必原地等待技能。",
      "对泽环巨蛇时，同一玩家回合必须有两名不同英雄命中；单一英雄的大技能无法阻止再生。",
      "蚀月狮鹫飞行时会挡住猫头鹰远攻，改用狮王；落地前则应分散，避开整列横扫。",
      "镜影狼存在时保留一个可控相邻格，分身出现后立刻清掉 1 生命目标，避免路线被改变。",
      "永久加成只提高容错。正确使用冷却、封印与环月格的低等队伍，仍可能胜过站错位置的高等队伍。"
    ],
    "progression": [
      "任务 1-5 教导移动、集火、狼群相邻、渡鸦瞄准与断桥路线；石角试炼会两次刷新护甲并处罚留在同列的英雄。",
      "任务 6-10 加入近战反击、绕后、根须束缚与夹击；铁根犀王把安全格变成碎石，使路线在战斗中改变。",
      "任务 11-15 用潮汐与苍鹭推移让站位在决策后继续变化；泽环巨蛇再加入栏位拉动与双英雄止血条件。",
      "任务 16-20 组合暂时燃烧、直线冲锋与一次性冷却符文；烬鬃狮王交替使用棋盘火焰、群体压力与重伤后额外行动。",
      "任务 21-25 用沉默与远程标记限制技能时机，再让外圈旋转；蚀月狮鹫改变能伤害牠的英雄与危险列。",
      "任务 26-30 加入分身、吸能与相连封印，王冠连战重组五章规则；符冠奇美拉在两个可见门槛改变地形并召唤镜影，形成最终目标顺序考验。"
    ],
    "designNote": "棋盘固定为三格宽、四格高，让手机不需平移就能看清每个决策。深度来自每名英雄每回合只有一个动作：为了离开危险而移动，就代表放弃该英雄这次攻击；有时防守也比追求伤害更好。六个五关章节一次教一套规则，再由章末首领重新组合。敌方生命只每八关增加一次、攻击只每十二关增加一次，后期压力主要来自地形、目标顺序、行动限制与阶段变化。触控、滑鼠与方向键焦点都操作相同逻辑格；它与《自走小队》的战前配置或《动物遗物猎人》的即时移动不同，每一步都停下来让棋盘本身成为题目。",
    "parent": "小队等级、经验、符文、最佳与已解锁任务、英雄等级、训练格、永久攻击／生命／能量加成与复活代币都保存在目前浏览器。基本游玩不需要登入；清除网站资料或换浏览器可能会建立另一份存档。钻石只用于选择性奖励重抽或确认训练格，30 任务、七种地形、特殊敌人与六位首领都不需要钻石。技能报告只描述本次游玩，不是正式能力测验。",
    "faq": [
      [
        "动物符文战棋可以免费玩吗？",
        "可以。30 个任务、特殊敌人、地形、永久符文成长与六位首领都能直接在浏览器游玩。"
      ],
      [
        "共有多少任务与首领？",
        "共有 30 个设计任务；第 5、10、15、20、25、30 任务有六位不同图像、行为与两阶段机制的首领。"
      ],
      [
        "需要快速反应吗？",
        "不需要。这是回合制游戏，玩家选择英雄、格子、攻击、防守或技能时，棋盘不会自行移动。"
      ],
      [
        "为什么不能使用技能？",
        "英雄可能没有能量、已完成行动，或被月尘沉默。沉默只维持一个玩家回合，不会封锁移动、普通攻击与防守。"
      ],
      [
        "任务结束后哪些会重置？",
        "战斗棋盘会重置；任务解锁、小队等级、经验、符文、英雄等级、符文奖励、训练与复活代币会保存在本机。"
      ],
      [
        "钻石能做什么？",
        "3 颗钻石可重抽一次奖励，18 颗钻石可确认永久训练格。钻石不会解锁战役任务、英雄或首领。"
      ],
      [
        "可以重玩前面的任务吗？",
        "可以。所有已解锁任务都能重玩；完成最终任务后 30 关全部保留，也不会出现假的第 31 关。"
      ],
      [
        "需要帐号才能保存吗？",
        "不需要。进度保存在目前浏览器；清除网站资料或更换装置可能会开始另一份存档。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-reef-fisher"] = {
    "title": "动物珊瑚钓手",
    "difficulty": "渐进挑战",
    "time": "每关约 2～4 分钟",
    "gameplay": "钓鱼张力任务",
    "genre": [
      "钓鱼",
      "收集",
      "时机",
      "动物"
    ],
    "skills": [
      "专注",
      "反应",
      "解决问题"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档资讯",
    "hideScoreBands": true,
    "intro": "《动物珊瑚钓手》是包含 30 个任务的钓鱼收集游戏。水獭泡泡鳍要掌握抛竿蓄力、追踪即时鱼线安全区、记录 12 种海洋生物，并用礁石笔记升级六种装备。六个五关区域会真正改变安全区规则；第 5、10、15、20、25、30 关则保证遇到拉力、护甲或海流逻辑不同的守护鱼。",
    "story": [
      "礁区档案馆替阳光浅滩、海藻花园、珊瑚门、月潮礁、风暴礁棚与深渊蓝海保存海流图。异常季节潮汐让鱼群离开原本记录的水道。泡泡鳍驾著调查小船逐段航行，用渔获确认目前有哪些生物经过，也记下每片海域会如何拉扯鱼线。",
      "礁石笔记是档案馆提供的调查点数，可用来改良远征装备。每个第五关由日冠守护锦鱼、海藻巨笛鲷、珊瑚角𫚉、蚀月鬼蝠𫚉、风暴礁灯守卫或水晶冠鱼王守住区域标记。钓起守护鱼代表该区五关海图已确认；完成第 30 关会归档第六张海图，不会产生不存在的第 31 关。"
    ],
    "systems": [
      "任务流程：在水平任务列选择已解锁关卡，多数目标需要钓起两或三尾鱼。胜利会保存并只解锁下一关，先前关卡仍可重玩。",
      "抛竿与时间：远征基础时间为 90 秒，小船航程每高于等级 1 一级就增加五秒。按住海面或空白键蓄力后放开；较高蓄力只会缩短咬饵等待，不会直接选到稀有鱼。",
      "鱼线控制：咬饵后可拖红色钮、在海面滑动或使用左右方向键。留在绿色安全区会降低鱼的力量；离开太久会断线、回到抛竿，而且任务时间不会重置。",
      "鱼种拉力：一般生物分为稳定、突进与重拉三种。上钩提示与声纳会显示目前类型；第一次记录的新鱼除了分数与礁石笔记，还会得到图鉴加成。",
      "海况规则：开放海面固定安全区；海藻漂流移动整段安全区；珊瑚缠线改变宽度；月潮换向左右切换；风暴突流定时推动鱼线；深渊试炼把漂移、压力与突流放在同一关。",
      "装备与选用工具：钓竿、卷线器、鱼线、鱼饵、小船与扫描器各有五个本机等级，扫描器能扩张前期区域的鱼种池。三钻稀有鱼饵保证一次合格稀有渔获，两钻声纳会揭示并锁定下一尾鱼；两者都需再次确认，也都不是通关条件。"
    ],
    "how": [
      "按开始游戏，左右滑动完整 30 关任务列，先阅读海况与目标再选择已解锁关卡。",
      "需要时准备一次稀有鱼饵或声纳，再把礁石笔记投入目前真正需要的装备。",
      "按住海面或空白键并放开抛竿；较高蓄力可以少等一点咬饵时间。",
      "鱼出现后，让红色标记跟著绿色安全区移动，不要把每场拉线都硬拉回中央。",
      "断线后立刻重新抛竿；守护鱼关卡要先读取名称、护甲与海流提示再大幅修正。",
      "在时间内完成渔获目标，于结果查看分数、笔记与新图鉴，再回礁区地图挑战下一关。"
    ],
    "strategyTips": [
      "若能稳定留在安全区但收线太慢，升级钓竿强度或鱼饵品质；若标记常跑出安全区，优先卷线控制或鱼线耐久。",
      "海藻、月潮与深渊会刻意移动安全中心。要追踪绿色区域，而不是固定盯著 50。",
      "珊瑚角𫚉与水晶冠鱼王在护甲关闭时不会失去力量。利用这段时间稳线，让下一个破绽从安全状态开始。",
      "风暴突流每三秒一次。闪光前先靠近目前安全区中心，受到推动后再修正。",
      "满蓄力不会提高稀有率，只会缩短等待。缺少稀有图鉴时，再使用只能触发一次的稀有鱼饵。",
      "需要先知道稳定、突进、重拉或守护鱼类型时用声纳；想直接补稀有图鉴时再选鱼饵。"
    ],
    "progression": [
      "第 1～5 关使用固定的开放海面安全区，前四关教学抛竿、断线复原与一般拉力；日冠守护锦鱼以三段平顺冠潮结束本章。",
      "第 6～10 关让海藻漂流移动整段安全区；海藻巨笛鲷会在移动目标中维持长时间重拉。",
      "第 11～15 关让珊瑚安全区周期变宽或收窄；珊瑚角𫚉再加入每两秒切换的护甲与破绽。",
      "第 16～20 关每四秒把月潮安全区换到另一侧；蚀月鬼蝠𫚉会在反向以前做出假动作。",
      "第 21～25 关缩窄安全区并每三秒冲击鱼线；风暴礁灯守卫在突流之间仍维持重拉。",
      "第 26～30 关于深渊同时使用漂移压力与突流；水晶冠鱼王再加入护甲破绽，成为最后的规则综合测试。"
    ],
    "designNote": "30 关都保留同一个两阶段输入：先蓄力抛竿，再管理张力。难度来自可读的海况，不是只把鱼加速。漂移或收窄改变玩家要守的位置，突流改变稳线时机，守护鱼护甲则改变安全控制何时能转成进度。每五关先熟悉一种条件，再由守护鱼把它与独立拉力结合。手机、桌面、平板与短横向使用同一个 Battle 逻辑画面；指标与键盘共用状态，页面隐藏时会暂停时间，Result 仍属于 Battle 并沿用同一个实体保留区。图鉴因此来自反复做出的真实张力判断，而保存的关卡与装备也让再次游玩有明确规划。",
    "parent": "不需要帐号。已解锁与目前任务、礁石笔记、最佳渔获、12 种图鉴、六种装备等级，以及已准备的鱼饵或声纳都保存在目前浏览器。清除网站资料或更换浏览器可能建立另一份存档。共用钻石余额只用于经过确认的鱼饵与声纳；不使用它们也能完成 30 关、六只守护鱼、装备升级与一般图鉴进度。能力报告只整理本次游玩，不是诊断、排名或正式能力测验。",
    "faq": [
      [
        "游戏有几关与几只守护鱼？",
        "共有 30 关；第 5、10、15、20、25、30 关会保证遇到六只不同守护鱼。"
      ],
      [
        "绿色安全区为什么会移动或变窄？",
        "那是关卡海况。海藻会漂移、珊瑚改变宽度、月潮左右换向、风暴加入突流，深渊则结合多种规则。"
      ],
      [
        "鱼线断掉会怎样？",
        "目前鱼会逃走并回到抛竿阶段；远征仍继续，但计时不会重置。"
      ],
      [
        "蓄力较高会钓到更好的鱼吗？",
        "不会。蓄力只缩短咬饵等待；鱼种由任务池、扫描器等级、一次鱼饵或声纳锁定决定。"
      ],
      [
        "守护鱼护甲关闭时能降低力量吗？",
        "珊瑚角𫚉与水晶冠鱼王只有在护甲开启且标记位于安全区时才会失去力量。"
      ],
      [
        "通关一定要钻石吗？",
        "不用。钻石只准备一次稀有渔获或一次声纳锁定，不会解锁关卡、守护鱼或装备。"
      ],
      [
        "哪些进度会保存？",
        "目前浏览器会保存关卡、笔记、图鉴、装备、最佳渔获、选择关卡与已准备工具。"
      ],
      [
        "可以只用键盘吗？",
        "可以。按住并放开空白键抛竿，再于游戏区或张力轨道使用左右方向键。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-crystal-survivor"] = {
    "title": "动物水晶生存战",
    "difficulty": "中等",
    "time": "每关 3 分钟",
    "gameplay": "30 关动作生存战役",
    "genre": [
      "动作",
      "生存",
      "战役",
      "动物"
    ],
    "skills": [
      "反应",
      "专注",
      "问题解决"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "30 关战役指南",
    "noteTitle": "玩家与存档说明",
    "hideScoreBands": true,
    "intro": "《动物水晶生存战》是一款以移动、自动攻击、临时升级与可读危险为核心的 30 关实时巡逻战役。每关最多三分钟，都有专属名称、金钥目标与区域规则。每第五关会出现一只拥有独立角色图、警示与反制方式的首领，不是把普通敌人放大。",
    "story": [
      "水晶林地原本依靠六座水晶灯塔维持通道，金钥则是调律灯塔的工具。日蚀核心从地底送出暗影脉冲后，金钥散落在各条路线，熟悉的动物也变成影兽。水晶巡守员必须收回金钥、安抚影兽，并让每条通道在三分钟内稳定下来。",
      "第 5、10、15、20、25、30 关是六个守卫检查点。依序安抚根系追猎者、棱镜飞蛾女王、荆棘野猪王、烬火黑豹、暴风巨鹏与日蚀巨像，才能重新连结六个区域。完成第 30 关代表六座灯塔重新同步，林地不再把暗影能量送回自己的根系。"
    ],
    "systems": [
      "巡逻流程：先在横向关卡列选择已解锁路线，关卡卡片会列出区域规则、金钥目标与首领标记。点击、拖曳、WASD 或方向键都可移动巡守员。角色会自动攻击淡色范围内最近的敌人，玩家主要负责间距、收集路线与闪避时机。",
      "金钥与经验：本关金钥数是通关目标，同时会累积到主选单的巡守阶级。影兽被安抚后会掉落本局经验水晶；升级时游戏会暂停，并从伤害、射程、速度、生命上限、攻击间隔与拾取范围中提供三个选项。",
      "敌人定位：影狐提供稳定压力，黑豹追得较快，水晶野猪需要更多次攻击。后期规则会让特定敌人带著可打破护盾、先预告再冲锋、在倒下点留下热区，或让掉落水晶被风推移。",
      "成功与失败：普通关必须在 3:00 结束时仍有生命，并收集卡片显示的金钥数。首领关还必须安抚该区守卫。生命归零或漏掉目标都不会解锁下一关，但本机纪录与先前进度不会被删除。"
    ],
    "how": [
      "在 30 张横向卡片中选择已解锁关卡，先读取规则。",
      "用触控、滑鼠、WASD 或方向键移动；攻击会自动锁定范围内目标。",
      "收集本关要求的金钥，并捡取经验水晶选择升级。",
      "虚线警示变成实心危险前，离开根系、火焰、闪电或走廊。",
      "每第五关除了金钥目标，还要击败专属首领。",
      "结果可以重试、继续或回到关卡列。"
    ],
    "strategyTips": [
      "先收集附近经验，让第一个升级影响更长的巡逻时间。",
      "把淡色攻击环当成间距工具，让目标保持在边缘，不要站在影兽旁边。",
      "面对冲锋要横向穿过它的路径，不要沿直线往后逃。",
      "棱镜飞蛾女王发亮时护盾会挡住攻击，先存活再等待护盾消失。",
      "日蚀核心以跟随移动安全环为优先，环外金钥可等下一次脉冲再取。"
    ],
    "progression": [
      "第 1-5 关建立金钥路线、黑豹冲入与野猪夹击。根系追猎者会在玩家位置放下绿色根系圈，留在里面会减速并反复受伤。",
      "第 6-10 关加入镜像圈、旋转碎片与可打破护盾。棱镜飞蛾女王会在护盾与可受伤阶段间轮替，并使用成对棱光警示。",
      "第 11-15 关以荆棘走廊、根系斑块与有预告的野猪冲锋改变移动。荆棘野猪王结合长距离冲锋与根系圈。",
      "第 16-20 关使用橙色燃烧预告、高温边缘与倒下留火。烬火黑豹会跨场闪现，并燃烧每个落点。",
      "第 21-25 关以蓝色圈预告闪电，强风还会推动掉落物。暴风巨鹏同时使用三个雷区与高速俯冲。",
      "第 26-30 关要跟随移动光环，并轮流处理根系、火焰与闪电。日蚀巨像把三种警示放在安全环周围，是全部移动与伤害时机的最终检查。"
    ],
    "designNote": "三分钟足以让一局出现数次升级选择，又不会让失败后的重试代价过高。自动锁定是为了移除手机上细小的瞄准控制，但玩家仍要持续决定距离、收集顺序、逃生方向与首领可攻击窗口。六个五关区域会依序导入、组合、再由首领检查新规则。难度虽然提高，但主要变化来自护盾、冲锋时机、警示圈、走廊、飘移资源与安全环，而不是只把敌人生命变大。",
    "parent": "本机会保存已解锁关卡、已通关关卡、各关最佳金钥、累积金钥、巡守阶级与可选水晶护符。清除网站储存或更换装置可能会移除进度。水晶护符需二次确认，只会把起始生命从 7 提高到 8，并把拾取范围从 54 提高到 68；它不是任何关卡的必要条件。结果回馈只是娱乐与本机进度资讯，不是能力测验或诊断。",
    "faq": [
      [
        "动物水晶生存战有几关？",
        "共有 30 个命名关卡与六个区域，每第五关都是首领检查点。"
      ],
      [
        "如何才算通关？",
        "生存到三分钟结束并完成卡片的金钥目标；首领关还要击败该区守卫。"
      ],
      [
        "玩家需要手动瞄准吗？",
        "不用。巡守员会自动攻击，玩家主要负责移动、收集与升级选择。"
      ],
      [
        "为什么攻击没有伤害棱镜飞蛾女王？",
        "她发亮时有可见护盾，会挡住攻击。护盾消失后才会扣除生命。"
      ],
      [
        "漏掉金钥目标会怎样？",
        "这局金钥与累积资料仍会记录，但不会解锁下一关，可立即重试。"
      ],
      [
        "进度会保存吗？",
        "会。关卡、金钥、巡守阶级与护符会保存在目前浏览器。"
      ],
      [
        "水晶护符是必要的吗？",
        "不是。它只是需要确认的可选起始属性加成，30 关都可不使用。"
      ],
      [
        "手机与电脑都能玩吗？",
        "可以。手机使用点击或拖曳，电脑还可使用 WASD 与方向键，关卡规则完全相同。"
      ],
      [
        "这是正式能力测验吗？",
        "不是。能力回馈只是本机游戏回馈，仅供娱乐参考。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-gearpack-expedition"] = {
    "title": "动物装备行囊远征",
    "difficulty": "中等至困难",
    "time": "每次远征约 5 至 12 分钟",
    "gameplay": "空间行囊策略远征",
    "genre": [
      "策略",
      "空间行囊",
      "Roguelite",
      "动物"
    ],
    "skills": [
      "规划",
      "空间推理",
      "应变"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档说明",
    "hideScoreBands": true,
    "intro": "《动物装备行囊远征》是由齿轮角鲁克斯主演的 30 关空间行囊策略游戏。玩家要把装备排入 11 栏、7 排的旅行行囊，连结锻造、自然、水晶与月光材质，并在每关通过五场固定遭遇。六个区域各自加入不同的配装压力，每五关则由一位会真正改变安全排法的守关首领收尾。",
    "story": [
      "齿轮森林的商队道路原本连接六座工坊。储藏库开始对货物产生异常反应后，树根封住森林、水晶裂开矿场、发条空谷重新启动、熔炉外泄高热、风暴线圈充满观测站，日蚀宝库则把回收货物与最后一批机械军一同封锁。",
      "齿轮角鲁克斯负责整理行囊，月帽欧拉则带著商店跟随路线。通过一关代表重新打开一段道路；击败树根守卫、水晶守卫、发条巨像、熔炉巨兽、风暴统领与日蚀藏主，才算恢复六区运输并取回全部货物。"
    ],
    "systems": [
      "行囊共有 11 栏、7 排。装备形状各不相同，可在放置前旋转。攻击决定鲁克斯造成的伤害，防御会降低反击，治疗则在承受伤害前恢复生命。两件不同装备只要同材质格子上下或左右相邻，就会形成连结；每个有效连结增加 2 攻击与 1 防御。",
      "生命会延续整个五场遭遇，但每次胜利后都能把装备拿回、旋转并重新排列。待放区与已放装备合计最多十二件；战利品可以选一件，也可保留空间直接继续。远征金币用于欧拉商店或来自出售装备，只在目前远征有效。",
      "特殊敌人会改变排法：护盾吸收开场伤害，伏击手会先攻，孤立惩罚依没有连结的装备增加伤害，腐蚀会逐回合削弱防御，顶排热浪会依第一排占用格数加伤，过载会关闭最常见材质，轮替封印则会在四种材质间切换。",
      "工坊经验、图鉴、已完成关卡与下一个解锁关卡会保存在本机。工坊等级提供少量生命成长。钻石只用于确认后更换一次欧拉的三件商品，不是免费关卡进度的必要条件。"
    ],
    "how": [
      "在 30 张横向滑动关卡卡片中选择已解锁远征，先读取路线规则。",
      "选择待放装备，需要时旋转，再点击 11×7 行囊中的有效绿色格。",
      "让锻造、自然、水晶或月光装备互相连结，准备好后开始遭遇。",
      "每次胜利后选择或略过战利品，再重新配装；抵达商店停靠点时可向欧拉购买或出售。",
      "击败第五场遭遇即可保存通关；第 5、10、15、20、25、30 关都是首领检查点。"
    ],
    "strategyTips": [
      "先读关卡规则。材质被封印或过载时，只堆一种连结会立刻失去优势。",
      "面对孤立惩罚时，让每件重要装备至少接上一件同材质；面对顶排热浪时，把连结往下排。",
      "腐蚀会让长期防御逐渐失效，应提高输出缩短战斗；护盾敌人则需要先准备足够破盾伤害。",
      "不要自动拿走每件战利品。商店或首领还在前方时，空间本身就是资源。"
    ],
    "progression": [
      "第 1～5 关教导连结、旋转、护盾、先攻与孤立；树根守卫会持续再生，除非行囊保有自然连结。",
      "第 6～10 关加入月光封锁与棱镜护盾；水晶守卫带有 18 点护盾，核心受伤后还会反射碎片。",
      "第 11～15 关组合狂怒、孤立与腐蚀；发条巨像会在减伤的防守阶段与强化反击的狂怒阶段间交替。",
      "第 16～20 关加入顶排热浪；熔炉巨兽同时使用热浪与腐蚀，需要保留散热空间并缩短战斗。",
      "第 21～25 关把开场突袭与材质过载组合；风暴统领会依孤立装备数量追加连锁伤害。",
      "第 26～30 关轮替材质封印并重组前面学过的压力；日蚀藏主要求多种可用连结，而且不能留下松散装备。"
    ],
    "designNote": "每关固定五场遭遇，让同一个行囊有足够时间变化，又不让一次挑战过长。战斗采自动结算，是为了让手机、滑鼠与键盘玩家都把注意力放在本作最独特的决策：装备形状、材质连结、空白格与下一只敌人的规则。30 关依六套机制成长，而不是只提高数字；六位首领分别检查自然连结、破盾、阶段判读、散热、消除孤立与适应轮替封印。",
    "parent": "基本游玩不需要帐号。解锁与完成关卡、工坊经验、图鉴与最佳遭遇进度保存在目前浏览器；清除网站资料或更换装置可能移除本机进度。金币与当次行囊是临时资源；钻石只用于欧拉商店的确认式刷新。",
    "faq": [
      [
        "一共有多少关？",
        "共有 30 关、六个区域；第 5、10、15、20、25、30 关是守关首领。"
      ],
      [
        "材质连结怎么计算？",
        "两件不同装备的同材质格子必须上下或左右相邻；有效连结会增加攻击与防御。"
      ],
      [
        "为什么连结突然失效？",
        "月光封锁、过载与轮替封印会关闭一种材质；目前规则会显示在战斗上方。"
      ],
      [
        "每只敌人之间可以重排吗？",
        "可以。选择或略过战利品后，会回到可自由拿回、旋转与放置装备的准备阶段。"
      ],
      [
        "行囊满了怎么办？",
        "可以不拿战利品直接继续，或出售待放装备；行囊满不会卡住流程。"
      ],
      [
        "一定要使用钻石吗？",
        "不用。钻石只会在再次确认后更换欧拉目前的商品。"
      ],
      [
        "哪些进度会保存？",
        "解锁与完成关卡、工坊经验、图鉴与最佳进度会保存在本机。"
      ],
      [
        "支援键盘吗？",
        "支援。行囊提供有标签的 7 排、11 栏键盘格，可用方向键移动。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-moonlight-heist"] = {
    "title": "动物月影潜行队",
    "difficulty": "中等至困难",
    "time": "每个任务约 3 至 8 分钟",
    "gameplay": "潜行路线冒险",
    "genre": [
      "潜行",
      "路线规划",
      "冒险",
      "动物"
    ],
    "skills": [
      "规划",
      "专注",
      "风险判断"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档资讯",
    "hideScoreBands": true,
    "intro": "《动物月影潜行队》是由闪爪菲亚与月帽欧拉主演的 30 任务潜行路线游戏。每个任务都要观察移动巡逻、预览一次移动路线、回收真正的档案物件，并在警报填满前抵达撤离点。额外宝藏可带来第三枚奖章与更多月光币；后期则加入阴影掩护、封印顺序、镜面换位、发条节奏、月钟警报与六位档案守卫。",
    "story": [
      "月光档案库由画廊、宝库、天文室、信使大厅与封印收藏区组成，保存 WeightPlay 动物世界的导航纪录。故障的日蚀机关让保全系统永久封锁：巡逻员把任何移动身影视为入侵者，镜面基座会交换标记，撤离门也只遵循古老封印程序。",
      "月帽欧拉负责规划，闪爪菲亚进入档案库。任务不是攻击守卫，而是在不升高封锁的情况下回收月之封印、信使徽记、星图、发条透镜与区域遗物。每通过一位守卫，就代表一整个五任务区域恢复安全；第 30 关通过日蚀馆长的完整路线后，封锁正式结束，不会假装还有第 31 关。"
    ],
    "systems": [
      "按住或拖曳可预览虚线路线，放开后菲亚才会前往该点；桌面也可用 WASD 或方向键短距离移动。巡逻不会因玩家思考而停止，视野圈会显示侦测距离。靠近巡逻会提高警报，离开视线或进入阴影则会降低；警报全满会被发现，但可免费重试。",
      "每关都有任务物、撤离门与选择性的宝藏。先取得任务物，撤离门才会启动；宝藏会提供第三枚奖章与更多月光币。九个封印任务会把宝藏改为第一道封印，必须先取宝藏再取任务物。第 29、30 关取得任务物后，撤离门还会移到新位置。",
      "闪电冲刺会缩短移动时间，适合穿越巡逻线；星光诱饵会暂停巡逻；烟雾叶会清空警报并短暂掩护。任务前会出现 1 至 3 级强度。花费 3 颗钻石可在确认后重抽强度，5 颗钻石保险可在一次被发现后保留额外宝藏；两者都不会解锁关卡，也不会取代免费重试。",
      "六种非数值规则会真正改变路线：阴影圈可隐藏菲亚；月钟预告后会提高阴影外的警报；镜光会交换任务物与宝藏；发条区会在蓝色慢速与琥珀加速间交替；封印关改变收集顺序；探照守卫的视野会扩张与收缩。最终任务把这些规则组合起来。",
      "成功撤离获得一枚奖章、未被发现再得一枚、带回宝藏得到第三枚。每关最佳奖章、最高解锁任务、月光币与安全屋等级都保存在本机。每完成五个不同任务，安全屋会成长；已解锁任务可重玩，Result 会提供重试、任务列表，以及存在时的下一任务。"
    ],
    "how": [
      "在 30 张任务卡中选择已解锁关卡；第 5、10、15、20、25、30 关是守卫检查点。",
      "先阅读关卡规则与守卫图像，再选择闪电冲刺、星光诱饵或烟雾叶。",
      "在档案库内按住拖曳预览路线，放开移动；桌面可用 WASD 或方向键。",
      "观察视野圈与警报；月钟、探照光或交叉巡逻造成压力时，可先进入青色阴影圈。",
      "取得任务物后前往亮起的撤离门；若规则写著宝藏是第一道封印，就必须先取宝藏。",
      "自行判断是否绕路取得额外宝藏；它提供第三枚奖章与更多月光币，但不是普通进度的必要条件。"
    ],
    "strategyTips": [
      "路线安全不只看终点，还要看菲亚在移动途中会暴露多久。",
      "闪电冲刺适合穿越，星光诱饵适合多条巡逻交会，烟雾叶适合警报已高时使用。",
      "月钟预告出现时先进阴影，脉冲只会伤害掩护外的路线。",
      "镜面关要看闪光，不要追著旧标记；等待一秒可能让长路线变短。",
      "发条关在蓝色慢速阶段穿越，琥珀边框与守卫发光代表加速已开始。",
      "封印关先规划宝藏、任务物、撤离三段路；第 29、30 关还要保留警报空间应付移动出口。"
    ],
    "progression": [
      "任务 1 至 5 教导基本路线、交叉巡逻、宝藏与撤离；提灯审查官以扩张探照光收尾。",
      "任务 6 至 10 加入阴影掩护；月钟守卫会预告脉冲，阴影外的菲亚将增加警报。",
      "任务 11 至 15 让资讯改变，任务物与宝藏会换位；星镜看守会缩短换位间隔。",
      "任务 16 至 20 加入蓝色慢速与琥珀加速；发条巡察长会预告每次全速追踪。",
      "任务 21 至 25 把宝藏变成第一道封印；宝库封印官守住中央，必须依序解除两道封印。",
      "任务 26 至 30 组合探照、月钟、镜面、发条、阴影与封印。日蚀馆长在取物后反转巡逻并移动撤离门。"
    ],
    "designNote": "本作采用一次次短路线承诺，而不是持续摇杆移动。预览让触控玩家有时间读图，但巡逻持续移动，因此等待也有代价。触控、滑鼠与键盘共用同一个固定逻辑画面。六个五任务区域逐步引入决策语言，每位守卫都有专属完成品角色图、可见预告与已教过的反制方式。难度优先来自资讯、时机、顺序与路线形状，不只是速度。它没有《动物英雄试炼》的攻击循环，也没有《自走小队》的战前阵型；核心是观察安全时机与选择额外风险。",
    "parent": "《动物月影潜行队》可直接在浏览器游玩，基本进度不需要帐号。任务解锁、最佳奖章、月光币与安全屋等级保存在目前浏览器；清除网站资料或更换浏览器可能建立另一份进度。全部 30 关、六位守卫、普通进度与重试皆免费。钻石只用于明确确认的装置强度重抽或一次宝藏保险。游戏不把规划与专注回馈当成正式能力测验。",
    "faq": [
      [
        "共有多少任务与守卫？",
        "共有 30 个原创任务；第 5、10、15、20、25、30 关各有一位不同图像、规则与反制方式的守卫。"
      ],
      [
        "为什么无法取得任务物？",
        "在宝藏优先的封印关，宝藏是第一道封印；先取得它，再回到任务物。"
      ],
      [
        "青色圆圈有什么作用？",
        "它们是阴影掩护。菲亚位于其中时不会被巡逻视野或月钟脉冲侦测。"
      ],
      [
        "为什么任务物和宝藏移动了？",
        "镜面关会先出现闪光预告，再交换两个仍存在的标记；新位置就是实际目标。"
      ],
      [
        "发条关有什么不同？",
        "巡逻会在蓝色慢速与琥珀加速间交替，画面边框与守卫光芒会提示阶段。"
      ],
      [
        "一定要使用钻石吗？",
        "不用。钻石只在确认后重抽装置强度或替选择性宝藏投保，不会解锁任务、守卫、奖章或重试。"
      ],
      [
        "不登入也会保存吗？",
        "会。解锁、最佳奖章、月光币与安全屋保存在目前浏览器；清除本机网站资料可能移除它们。"
      ],
      [
        "第 30 关可以重玩吗？",
        "可以。所有已解锁任务都能重玩；通过日蚀馆长后不会显示不存在的下一任务。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["shadow-wolf"] = {
    "title": "影狼传说",
    "difficulty": "困难",
    "time": "每关 3–8 分钟",
    "gameplay": "横向动作平台 RPG",
    "genre": [
      "动作",
      "平台",
      "动物",
      "RPG"
    ],
    "skills": [
      "逻辑",
      "问题解决",
      "专注"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档说明",
    "hideScoreBands": true,
    "intro": "《影狼传说》是一款 30 关横向动作平台战役。玩家带领探险影狼穿越遗迹岩台、判读地形警示、迎战影兽、收集经验，并在升级时精确分配两点属性。每五关会遇到一名区域首领；牠们的防御状态与攻击规则各不相同。",
    "story": [
      "六道封印原本维持月影边境到巨兽王冠之间的道路。封印破裂后，水晶洞窟会落下碎晶，根野会长出封路荆棘，烬火宝库周期燃烧，蚀月裂隙会吹动角色，而王冠之路会重新组合前五区学过的威胁。",
      "玩家扮演刻有月光符文的探险影狼。必须击败目前关卡安排的全部敌人，才算修复这一段道路。胜利会保存通关并解锁下一张卡；第 30 关代表解除最后的巨兽封印，所有已完成关卡仍可重玩。"
    ],
    "systems": [
      "移动与战斗：左右奔跑、地面跳跃后再二段跳、朝面向方向挥爪，并用冲刺短暂穿越危险。接触敌人、投射物、尖刺与启动地形会扣除影狼生命；掉落路线会回到稳定地面并损失 5 点生命。",
      "经验与属性：普通与特殊敌人会掉落经验光珠。升级会暂停同一个战斗画面并给予两点必须分配的属性。力量提高伤害、敏捷提高速度、体质提高生命上限、幸运提高爆击率，每个按钮都显示目前值与下一个值。",
      "特殊敌人：水晶蝙蝠使用三向散射，装甲野猪在巡逻撞墙后开放防御，冲锋野猪快速穿越路线，烬狼留下火径，俯冲蝙蝠追踪高度，裂隙蝙蝠在栖台间闪现，镜狼倒下后只会分裂一次并产生两个脆弱残影。",
      "地形：落晶、毒池、根刺、火焰、震波与裂风都先出现警示再进入危险期。移动岩台会改变跳跃路线，固定尖刺则在任何时候都不能碰触。",
      "可选永久支援：雾影护符需要 15 颗钻石，会把每次挑战的初始生命上限从 30 提高到 40。第一次点击只显示扣除前后余额，第二次才确认；正常关卡解锁不需要钻石。"
    ],
    "how": [
      "从横向 30 关卡列选择已解锁关卡；每第五张卡是首领检查点。",
      "用 A/D 或左右方向键移动，W、上方向键或空白键跳跃；落地前再按一次即可二段跳。",
      "按 J 挥爪、K 或 Shift 冲刺。手机使用可见的左右、跳跃与攻击按钮。",
      "看到虚线地形时先决定退路；看到敌人外围的护甲或护盾圈时，先触发牠的反制空档再攻击。",
      "收集经验并在升级画面分配完两点属性，战斗才会继续。",
      "击败完整敌人组合即可通关。胜利会保存进度并解锁下一关；失败可直接重试，不会删除旧通关。"
    ],
    "strategyTips": [
      "先保留第二段跳，等移动岩台、散射弹或地形循环确认安全落点后再使用。",
      "冲刺适合穿过投射物扇形或冲锋尾端，之后立即转身利用敌人的恢复时间挥爪。",
      "准备处理装甲野猪前，先清除会干扰反击空档的远程敌人。",
      "力量缩短战斗、体质容许更多失误、敏捷改善走位、幸运提供不固定爆发；依关卡规则选择，不存在唯一升级顺序。",
      "击败镜狼前先离开分裂点，避免两个残影同时在角色身旁出现。"
    ],
    "progression": [
      "第 1–5 关教学巡逻、上下岩台、蝙蝠瞄准、移动平台与尖刺；蛇王幽谷加入毒池与逐渐扩大的投射扇形。",
      "第 6–10 关加入落晶警示、水晶蝙蝠散射与装甲野猪；石卫会挡住正面挥爪，地震后放出两道可跳过的震波并暂时解除防御。",
      "第 11–15 关混合荆棘路线、冲锋、装甲与远程优先顺序；棘根巨像平时保护核心，根拳重击落空后才出现短暂伤害窗口。",
      "第 16–20 关循环火焰地带，加入烬狼火径与俯冲蝙蝠；烬翼飞龙在空中受到保护并发射火扇，落地震波之后才可有效反击。",
      "第 21–25 关加入裂风、闪现蝙蝠与分裂镜狼；蚀月灵鹿会反射大部分伤害，必须诱导冲锋撞上竞技场边缘才能破盾。",
      "第 26–30 关把前面的反制规则组成清楚的混合挑战；巨兽王冠在两个生命门槛加入落晶、根刺与更密集射击，但完成后不会产生不存在的第 31 关。"
    ],
    "designNote": "战役采六组五关教学弧线，因为动作平台游戏应透过辨识与反制增加难度，而不是只提高生命与速度。每区前四关介绍或组合一条规则，第五关则用有清楚防御状态与攻击空档的首领验收。地形先警示再启动，让触控玩家能作出有意识的按键选择，同时保留压力。手机与桌面共用固定逻辑画布，因此岩台、HUD、操作、升级与结果的相对位置一致。与 WeightPlay 自走战斗不同，本作的闪避、跳跃、目标优先与攻击时机都由玩家直接控制。",
    "parent": "目前浏览器会在本机保存最高解锁关卡、选定关卡、通关清单、挑战次数、最佳通关、王冠通关次数与雾影护符。旧八区存档会向前迁移，不会重新锁住已取得进度。基本游玩不需要登入；清除网站资料或更换浏览器可能移除纪录。钻石只是可选支援资源。",
    "faq": [
      [
        "《影狼传说》可以免费玩吗？",
        "可以。完整 30 关战役可直接在浏览器游玩，不需要购买或登入。"
      ],
      [
        "关卡如何解锁？",
        "新存档从第 1 关开始。击败完整敌人组合后会保存该关并解锁下一张卡；已通关关卡仍可重玩。"
      ],
      [
        "影狼掉下去会怎样？",
        "影狼会回到稳定地面并损失 5 点生命；只有这次损失让生命归零时才会结束挑战。"
      ],
      [
        "为什么装甲敌人只受到很少伤害？",
        "目前防御状态仍在。要利用冲锋落空、地震、根拳、落地或撞墙等可见事件打开反击窗口。"
      ],
      [
        "一定要分配完两点属性吗？",
        "是。两点都分配到力量、敏捷、体质或幸运之后，战斗才会继续。"
      ],
      [
        "完成 30 关需要钻石吗？",
        "不需要。钻石只用于可选雾影护符，正常战役进度不需要它。"
      ],
      [
        "哪些进度会保存？",
        "关卡解锁与通关、选定关卡、挑战次数、最佳通关、王冠通关与护符会保存在目前浏览器。"
      ],
      [
        "六名首领有什么不同？",
        "蛇王控制毒池、石卫震地后开盾、巨像暴露核心、飞龙交替飞行与落地、灵鹿撞墙破盾、巨兽则依生命阶段加入落晶与根刺。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-hero-trials"] = {
    "title": "动物英雄试炼",
    "difficulty": "中等至困难",
    "time": "每个试炼约 4～9 分钟",
    "gameplay": "三房间英雄动作试炼",
    "genre": [
      "动作",
      "Roguelite",
      "动物"
    ],
    "skills": [
      "反应",
      "专注",
      "问题解决"
    ],
    "guideKicker": "WeightPlay 原创游戏指南",
    "guideTitleSuffix": "游戏指南",
    "noteTitle": "玩家与存档资讯",
    "hideScoreBands": true,
    "intro": "《动物英雄试炼》是共有 30 关的动作闯关。四位 WeightPlay 英雄拥有不同生命、速度、射程与主动技能。每个试炼包含三个相连房间、两次免费祝福选择，以及一名菁英队长或区域 Boss。五种敌人逐步加入飞行、冲锋、远程与护甲，六个检查点 Boss 各有不同反制方式；胜利取得的试炼印记可升级永久生命精通。",
    "story": [
      "六道暗影门从根木林一路开到虚空王冠。根木林放出追逐兽群，棱晶峡谷赋予飞行与护盾，余烬熔炉驱动有预警的冲锋，月影长廊武装远程敌人，深渊甲壳强化护卫，最后的王冠则混合所有规则。每次胜利会稳定一段道路并解锁下一个试炼。",
      "爆鬃狮 Leo、星爪狐 Fia、月帽猫头鹰 Orla 与苔壳龟 Taro 组成轮替英雄队。每五关是一个区域检查点；在第 30 关击败虚空王冠帝就会关闭最后一道门，游戏不会产生隐藏的第 31 关。"
    ],
    "systems": [
      "四位英雄：Leo 均衡并使用范围怒吼；Fia 高速且能无敌冲刺造成伤害；Orla 从远处攻击并标记目标，让下一次自动攻击增伤；Taro 生命最高，可开启限时减伤守护。",
      "移动与自动攻击：使用摇杆、方向键或 WASD 移动。英雄会自动攻击个人射程内最近的目标；技能冷却完成后，按技能键或空白键施放。",
      "三房间流程：前两房使用设计好的敌人组合，每次清除后必须免费选择攻击、冷却或恢复祝福。一般关第三房是菁英队长，检查点则是命名 Boss。",
      "敌人身分：暗影斥候直接追逐，棱晶渡鸦以曲线接近，余烬野猪先警告再冲锋，月影猎手保持距离射击，深渊护卫则降低普通攻击伤害，直到技能破除护甲。",
      "永久进度：胜利取得四至九枚印记并只解锁下一关。生命精通第一级需要五枚，之后每级多四枚，每级让所有英雄增加 12 最大生命。",
      "选择性重抽：每次都有三个免费祝福。花三颗钻石可在该次挑战中把三项全部换成强化版一次；画面会先显示精确余额变化，第二次确认才扣除。"
    ],
    "how": [
      "从 30 关水平关卡列选择已解锁试炼，阅读区域规则、检查点 Boss 与建议英雄。",
      "选择 Leo、Fia、Orla 或 Taro；选择会保存在本机。",
      "移动控制距离，让自动攻击锁定射程内最近的敌人。",
      "在适当时机用技能清群、穿过警告、标记优先目标或承受重击。",
      "清除前两房后各选一项免费祝福；钻石重抽不是必要流程。",
      "清除第三房取得印记并解锁下一关；失败可重试，不会删除永久进度。"
    ],
    "strategyTips": [
      "把斥候聚在 Leo 的怒吼范围内。",
      "看到黄色冲锋警告后再用 Fia 冲刺，以无敌移动穿过危险。",
      "Orla 可保持距离并标记护甲或高生命目标。",
      "Archowl 齐射与 Emperor 后期压力适合用 Taro 守护。",
      "技能破除护甲的速度比普通攻击快。",
      "攻击祝福缩短战斗，冷却提高技能频率，恢复则保护已受伤的挑战。"
    ],
    "progression": [
      "第 1～5 关教直接追逐，暗影潜行者以有预警的近距离震波收尾。",
      "第 6～10 关加入曲线渡鸦与护甲；棱晶蛇王在保护与开放阶段间切换。",
      "第 11～15 关加入野猪冲锋；熔岩巨牙兽在冲锋前抗性较高，冲锋后短暂开放。",
      "第 16～20 关加入保持距离的猎手与混合角度；蚀月大枭会定时齐射。",
      "第 21～25 关重叠护甲、冲锋与远程；深渊甲壳巨兽低于约半血时召唤两名增援。",
      "第 26～30 关混合五种敌人；虚空王冠帝中段获得护盾，最后阶段召唤渡鸦与装甲支援。"
    ],
    "designNote": "固定三房间节奏让玩家能用两次祝福建立方向，又不把单关拉成耐力赛。第三房会检查目前英雄与祝福是否能回答画面可读的规则。难度来自移动轨迹、射程、预警、护甲、增援与 Boss 阶段，而不是只提高生命。固定逻辑 Battle 画布会在手机、平板、桌机与短横向画面等比缩放；触控与键盘共用移动和技能状态，页面隐藏时会暂停模拟，Result 留在 Battle 与独立实体保留区上方。和《自走小队》不同，本作的走位与技能时机由玩家直接控制。",
    "parent": "本浏览器会在本机保存最高解锁试炼、试炼印记、生命精通与选定英雄。清除网站资料或更换浏览器可能得到另一份存档。钻石只是选择性平台货币，每次挑战最多用于一次经确认的祝福重抽；不使用重抽仍可游玩全部 30 关、五种敌人、六个 Boss、免费祝福与永久精通。技能回馈只供娱乐，不是排名或正式能力测验。",
    "faq": [
      [
        "共有几关与几个 Boss？",
        "共有 30 个三房间试炼，第 5、10、15、20、25、30 关各有一个不同 Boss。"
      ],
      [
        "四位英雄玩法一样吗？",
        "不一样；生命、速度、攻击射程、基础攻击与主动技能都不同。"
      ],
      [
        "为何敌人只受到很少伤害？",
        "深渊护卫、棱晶蛇王或王冠帝可能正在守护状态，技能比自动攻击更快破除护甲。"
      ],
      [
        "每个房间结束后会怎样？",
        "前两房可选攻击、冷却或恢复；第三房结束整个试炼。"
      ],
      [
        "哪些进度会保留？",
        "关卡解锁、印记、生命精通与选定英雄保存在本机，临时祝福会重置。"
      ],
      [
        "一定要使用钻石吗？",
        "不用；三颗钻石只会重抽一次祝福，画面永远有免费选项。"
      ],
      [
        "可以重玩旧关卡吗？",
        "可以，所有已解锁卡片都会保留在关卡列。"
      ],
      [
        "失败会失去什么？",
        "重试只会重开同一关，不会删除永久进度。"
      ],
      [
        "支援触控与键盘吗？",
        "支援；可使用摇杆与技能键，或 WASD／方向键与空白键。"
      ]
    ]
  };
  localizedGames["zh-Hans"]["animal-cafe-rush"] = {
    "title": "动物咖啡快手",
    "age": "6+",
    "difficulty": "简单至中等",
    "time": "每个营业日约 3～8 分钟",
    "gameplay": "图像订单咖啡馆闯关",
    "genre": [
      "时间管理",
      "配对",
      "动物",
      "儿童"
    ],
    "skills": [
      "专注",
      "顺序理解",
      "问题解决"
    ],
    "hideScoreBands": true,
    "intro": "《动物咖啡快手》是共有 30 个营业日的图像订单与咖啡馆规划游戏。狮子、长颈鹿、熊猫与兔子会用图片点果昔、三明治、水果盘或烘焙点心。前期是直接配对，之后依序加入数字食谱、VIP 优先、A/B 桌轮流与动物轮替。每五天有一次咖啡馆审查，第 30 天的大庆典会同时使用所有进阶规则，没有隐藏的第 31 天。",
    "story": [
      "咖啡馆位在热闹的动物市集旁，四种动物会在办事途中来休息。年轻狮子店长正在学习管理柜台，同时维持这家店原本亲切的步调。完成一天代表在营业评分归零前服务指定人数；正确出餐得到的金币会回到同一间店，用来改善之后的营业。",
      "30 天分成六个工作周，不是把同一回合复制 30 次。最初客人只用餐点图片沟通，后来食谱出现顺序、受邀 VIP 需要优先、A 桌与 B 桌共用厨房，熟客也希望队伍不只服务同一种动物。完成大庆典，代表店长能在最忙的时段同时协调所有规则。"
    ],
    "systems": [
      "餐点板与托盘：画面提供八个大餐点方块。依照气泡点选餐点组成托盘，再点正确客人；若选错，可在出餐前清空托盘。",
      "订单与耐心：每天一开始有三位客人，之后还会加入。气泡显示餐点，客人卡显示耐心；等待过久会离开并降低营业评分，评分归零才会暂停本日。",
      "数字食谱：第 6～10 天必须完全按照画面上的 1、2、3 顺序。材料相同但顺序不同不算完成，因此数字不是装饰。",
      "队伍规则：第 11～15 天要先服务等待中的 VIP；第 16～20 天要让 A 桌与 B 桌轮流；第 21～25 天在有其他动物可选时，下一位不可和上一位相同。",
      "庆典组合：第 26～29 天用不同方式组合两种旧规则；第 30 天同时启用食谱顺序、VIP、桌次与动物轮替。",
      "进度与升级：正确订单会获得金币，后期章节与 VIP 有额外价值。快速工作站、加大托盘与舒适咖啡馆各有三级；关卡、金币、最佳服务数与升级保存在此浏览器。"
    ],
    "how": [
      "从水平滑动的关卡列选择已解锁营业日，先读标题、目标与规则。",
      "查看餐点气泡、VIP 标记、桌次标记与耐心条。",
      "点餐点方块组成一份订单；数字关卡要按显示顺序选取。",
      "点符合目前队伍规则的客人；若错误，讯息会指出食谱或服务次序问题。",
      "在营业评分归零前完成指定服务人数。",
      "使用金币升级三种永久设备、重玩旧关卡，或前往下一个营业日。"
    ],
    "strategyTips": [
      "先读完最初三张订单，再看目前餐点板最容易完成哪一份。",
      "数字食谱可先照顺序念一次再点。",
      "准备一般客人的托盘前，先确认是否有 VIP。",
      "桌次关卡先找目前指定的 A 或 B 桌，再比较该桌客人。",
      "动物轮替时记住上一位动物，优先找另一种可服务的动物。",
      "若托盘混入不同订单的材料，直接清空比硬送更安全。"
    ],
    "progression": [
      "第 1～5 天教图像订单、单一与重复材料、逐渐增加的队伍；第 5 天是第一次审查。",
      "第 6～10 天加入食谱步骤，从两步走到三步，最后是食谱审查。",
      "第 11～15 天加入 VIP 服务；金色标记会改变哪一份正确订单可以先送。",
      "第 16～20 天加入双桌轮替，出餐必须在 A 桌与 B 桌之间切换。",
      "第 21～25 天加入动物轮替；只要有其他合格动物等待，就不能连续服务同一种。",
      "第 26～30 天是庆典周，前四天各组合两种规则，第 30 天同时使用四种并结束完整活动。"
    ],
    "designNote": "设计先用图像配对建立柜台规则，再逐章改变一份出餐为何正确：材料顺序、社交优先、桌次节奏与队伍多样性。难度因此来自看得见的判断，而不是缩小按钮或使用不公平的高速倒数。三位起始客人让画面仍可阅读，目标则从三人增至八人，让后期规则有时间互相影响。固定逻辑画布会在手机、平板、桌机与短横向画面等比缩放；触控、滑鼠与键盘共用相同餐点与客人按钮。所有必要材料与特殊身分都会在操作前显示。",
    "parent": "这是 Kids 游戏，不发出广告请求，不需要帐号、购买、排行榜或战斗，也不是正式能力测验。游戏可用来讨论图像配对、顺序、注意力切换与简单规划。大人可请孩子念出数字食谱、找下一桌，或说明为何某位客人要优先。进度与升级只存在目前浏览器；清除网站资料或更换装置可能会得到另一份存档。",
    "faq": [
      [
        "共有几个营业日？",
        "共有 30 个营业日，并在第 5、10、15、20、25、30 天安排咖啡馆审查。"
      ],
      [
        "要怎么替客人出餐？",
        "点齐气泡里的餐点；有数字时依顺序选取，再点符合目前规则的客人。"
      ],
      [
        "材料明明相同，为何被拒绝？",
        "本日可能要求食谱顺序、VIP 优先、指定桌次或不同动物；提示讯息会指出原因。"
      ],
      [
        "耐心归零会怎样？",
        "客人会离开并降低营业评分；评分归零时本日暂停，可以重新挑战。"
      ],
      [
        "三种升级有什么用？",
        "快速工作站、加大托盘与舒适咖啡馆会永久支援之后的尝试，各有三级。"
      ],
      [
        "可以重玩旧关卡吗？",
        "可以，所有已解锁营业日都会留在关卡列。"
      ],
      [
        "需要登入或会显示广告吗？",
        "不需要；这个 Kids 游戏不要求登入，也不发出广告请求。"
      ],
      [
        "进度存在何处？",
        "营业日、金币、最佳结果与升级存在目前浏览器。"
      ],
      [
        "结果是正式能力测验吗？",
        "不是，只是本次咖啡馆游玩的趣味回馈。"
      ]
    ]
  };

  let spanishResourcePromise = null;
  let spanishResourceFailed = false;
  let japaneseResourcePromise = null;
  let japaneseResourceFailed = false;

  function installSpanishResource() {
    const resource = window.WeightPlayGameInfoLocales?.es;
    if (!resource) return false;
    labels.es = resource.labels || {};
    skillLabels.es = resource.skillLabels || {};
    localizedGameplayProfiles.es = resource.gameplayProfiles || {};
    localizedGames.es = resource.games || {};
    return true;
  }

  function ensureSpanishResource() {
    if (installSpanishResource() || spanishResourceFailed) return Promise.resolve();
    if (spanishResourcePromise) return spanishResourcePromise;
    spanishResourcePromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = new URL("game-page-info-es.js?v=20260718-es1", sharedAssetBase).href;
      script.dataset.wpGamePageInfoLocale = "es";
      script.onload = () => {
        installSpanishResource();
        resolve();
      };
      script.onerror = () => {
        spanishResourceFailed = true;
        resolve();
      };
      document.head.appendChild(script);
    });
    return spanishResourcePromise;
  }

  function installJapaneseResource() {
    const resource = window.WeightPlayGameInfoLocales?.ja;
    if (!resource) return false;
    labels.ja = resource.labels || {};
    skillLabels.ja = resource.skillLabels || {};
    localizedGameplayProfiles.ja = resource.gameplayProfiles || {};
    localizedGames.ja = resource.games || {};
    return true;
  }

  function ensureJapaneseResource() {
    if (installJapaneseResource() || japaneseResourceFailed) return Promise.resolve();
    if (japaneseResourcePromise) return japaneseResourcePromise;
    japaneseResourcePromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = new URL("game-page-info-ja.js?v=20260719-ja1", sharedAssetBase).href;
      script.dataset.wpGamePageInfoLocale = "ja";
      script.onload = () => { installJapaneseResource(); resolve(); };
      script.onerror = () => { japaneseResourceFailed = true; resolve(); };
      document.head.appendChild(script);
    });
    return japaneseResourcePromise;
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
    const path = `${base}${gameId}/`;
    return window.WonderI18n?.localizedPath?.(locale(), path) || path;
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
      "[data-screen='stage']",
      "[data-wp-logical-stage-canvas]",
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
      if (!shell.classList.contains("wp-stage-art-shell")) shell.classList.add("wp-stage-art-shell");
    });
  }

  function installStageArtworkSync() {
    document.body.dataset.wpGameId = currentGameId();
    const metrics = window.__weightPlayLayoutMetrics ||= {};
    metrics.stageArtworkSyncs ||= 0;
    const artworkWatchSelector = [
      ".stage-grid", ".stage-rail", ".mission-grid", ".mission-rail",
      ".region-rail", ".route-rail", ".level-grid",
      "[data-screen='stage']", "[data-wp-logical-stage-canvas]",
      "[data-wp-standard-stage-screen]", "#stagePanel", "#stageScreen",
      "#stageSelectPanel", "#stageSelect", "#stageView", "#mapPanel",
      "#levelSelect", "#menuPanel", ".stage-panel", ".stage-screen",
      ".stage-shell", ".stage-select", ".world-map-panel", ".level-select",
      ".menu-shell", "#overlay", ".main-poster", ".main-cover",
      ".wonder-main-cover", "img.cover", "img[class*='poster']", "img[class*='cover']",
    ].join(",");
    let queued = false;
    const queueSync = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        metrics.stageArtworkSyncs += 1;
        syncStageArtwork();
      });
    };
    const onlyDragClassChanged = (record) => {
      if (record.attributeName !== "class") return false;
      const before = new Set(String(record.oldValue || "").split(/\s+/).filter(Boolean));
      const after = new Set(record.target.classList);
      const changed = new Set([...before, ...after].filter((name) => before.has(name) !== after.has(name)));
      return changed.size > 0 && [...changed].every((name) => name === "wp-stage-dragging");
    };
    const relevantMutation = (record) => {
      if (record.type === "attributes") {
        if (onlyDragClassChanged(record)) return false;
        return record.target.matches?.(artworkWatchSelector)
          || Boolean(record.target.querySelector?.(artworkWatchSelector));
      }
      return [...record.addedNodes, ...record.removedNodes].some((node) => node instanceof Element
        && (node.matches(artworkWatchSelector) || Boolean(node.querySelector(artworkWatchSelector))));
    };
    const observer = new MutationObserver((records) => {
      if (records.some(relevantMutation)) queueSync();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["class", "hidden", "src"],
      childList: true,
      subtree: true,
    });
    window.addEventListener("pageshow", queueSync);
    window.addEventListener("resize", queueSync);
    queueSync();
  }

  function compactMetaDescription(value, limit = 160) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (text.length <= limit) return text;
    const clipped = text.slice(0, limit - 1);
    const boundary = clipped.lastIndexOf(" ");
    return `${clipped.slice(0, boundary > 110 ? boundary : clipped.length).replace(/[,:;.!?\s]+$/u, "")}…`;
  }

  function syncLocalizedMetadata(game) {
    const activeLocale = locale();
    const title = `${game.title} - ${game.guideTitleSuffix || uiLabel("titleSuffix")} | WeightPlay`;
    const description = compactMetaDescription(game.intro);
    document.documentElement.lang = activeLocale;
    document.title = title;
    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach((meta) => {
      meta.setAttribute("content", description);
    });
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => {
      meta.setAttribute("content", title);
    });
    document.querySelectorAll('script[type="application/ld+json"]:not([data-game-page-info-jsonld])').forEach((script) => {
      try {
        const jsonLd = JSON.parse(script.textContent || "null");
        const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
        let changed = false;
        entries.forEach((entry) => {
          const types = Array.isArray(entry?.["@type"]) ? entry["@type"] : [entry?.["@type"]];
          if (!types.some((type) => ["VideoGame", "Game", "SoftwareApplication"].includes(type))) return;
          entry.name = game.title;
          entry.description = description;
          entry.inLanguage = activeLocale;
          if (game.genre?.length) entry.genre = game.genre;
          changed = true;
        });
        if (changed) script.textContent = JSON.stringify(Array.isArray(jsonLd) ? entries : entries[0]);
      } catch {
        // Invalid third-party JSON-LD is left untouched.
      }
    });
  }

  function render() {
    if (locale() === "es" && !installSpanishResource() && !spanishResourceFailed) {
      ensureSpanishResource().then(render);
      return;
    }
    if (locale() === "ja" && !installJapaneseResource() && !japaneseResourceFailed) {
      ensureJapaneseResource().then(render);
      return;
    }
    const id = currentGameId();
    const baseGame = games[id];
    const main = document.querySelector("main");
    if (!baseGame || !main) return;
    const game = localizedGame(id);
    if (!game) return;
    syncLocalizedMetadata(game);
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

  games["animal-starlight-trails"] = {
    title: "Starlink",
    difficulty: "Easy to Challenging",
    time: "2-6 minutes per stage",
    gameplay: "Single-Stroke Logic Puzzle",
    genre: ["Puzzle", "Strategy", "Logic", "Animal"],
    skills: ["Logic", "Focus", "Problem Solving"],
    guideKicker: "WeightPlay Original Game Guide",
    guideTitleSuffix: "Game Guide",
    noteTitle: "Player and Save Information",
    hideScoreBands: true,
    intro: "Starlink is an original 30-stage route puzzle starring Moon Cap Orla. Trace every constellation trail exactly once while start seals, comet arrows, numbered stars, keys, and gates gradually change which complete routes are valid.",
    story: [
      "The Animal Star Map has gone dark, leaving thirty constellations disconnected across six observatories. Orla restores each picture by drawing one continuous path through every visible trail. Completing five constellations relights an observatory and introduces the next navigation lesson.",
      "Each board is an original graph designed for the rules shown on screen. The campaign ends at Stage 30 with a mastery constellation that combines the learned constraints; it never displays a nonexistent Stage 31."
    ],
    systems: [
      "Choose a star and continue through connected stars. A star may be visited more than once, but every connecting trail may be crossed only once. The constellation is complete only after all trails are lit in one continuous route.",
      "Stages 6-10 require the glowing start seal. Stages 11-15 add visible comet arrows that allow a trail in one direction only. Stages 16-20 require numbered stars in order. Stages 21-25 add a key that opens a marked gate trail. Stages 26-30 combine these rules.",
      "Undo removes the most recent step, Restart clears the current attempt, and Hint highlights one legal next star that still permits a complete solution. None of these actions spends currency. Keyboard, mouse, and touch share the same puzzle state.",
      "Clearing a stage saves its best star rating and time in this browser and unlocks the next constellation. Earlier stages remain replayable, including Stage 30 after the campaign is complete."
    ],
    how: [
      "Choose an unlocked constellation from the horizontal Stage rail.",
      "Read the rule panel and start at any valid star, or at the glowing start seal when one is shown.",
      "Drag through adjacent stars or tap them one by one. Never reuse a trail.",
      "Follow comet arrows, numbered seals, and key-before-gate restrictions when present.",
      "Light every trail to finish the constellation and unlock the next stage."
    ],
    strategyTips: [
      "Stars with an odd number of unused trails often reveal where an open route should begin or end.",
      "Before entering a narrow branch, check whether another unused trail can bring the route back to the main constellation.",
      "Treat arrows, numbers, keys, and gates as route constraints rather than decoration.",
      "Use Undo for a short correction and Restart when the opening choice has trapped several later branches."
    ],
    progression: [
      "Stages 1-5 teach classic open trails. Stages 6-10 introduce required starts. Stages 11-15 teach one-way comet paths.",
      "Stages 16-20 add ordered stars, Stages 21-25 introduce key-and-gate routes, and Stages 26-30 combine the complete vocabulary in larger mastery constellations."
    ],
    designNote: "Starlink uses a responsive logical Canvas that fills the safe Stage and Battle area without stretching individual puzzle elements. Extra space is distributed through stable tracks and anchors, so phones and wide desktop browsers show the same route information and controls. The separate General ad reserve never overlays gameplay or Result actions.",
    parent: "Starlink runs free in the browser and requires no account. Unlocks, best ratings, and times are stored only in this browser; clearing site data or changing browsers may create a separate save. Skill feedback is supportive entertainment and not a formal ability assessment.",
    faq: [
      ["Can I pass through the same star twice?", "Yes. Stars may be revisited, but each connecting trail may be used only once."],
      ["Why can I not use a pink comet trail?", "The arrow on that trail shows its allowed direction. Entering from the opposite end is not legal."],
      ["What happens at a dead end?", "The attempt remains visible so you can Undo one or more steps or Restart for free."],
      ["Are hints required?", "No. Every stage can be solved without hints; Hint only marks one route-safe next star."],
      ["Does progress save?", "Yes. Unlocks, best star ratings, and best times are stored locally in this browser."],
      ["How many stages are included?", "There are 30 authored stages across six rule chapters. Stage 30 remains replayable after completion."]
    ]
  };
  gameplayProfiles["animal-starlight-trails"] = { gameplay: "Single-Stroke Logic Puzzle", genre: ["Puzzle", "Strategy", "Logic", "Animal"] };

  Object.assign(localizedGames["zh-Hant"], { "animal-starlight-trails": {
    ...games["animal-starlight-trails"], title: "Starlink 星鏈", guideTitleSuffix: "遊戲指南", difficulty: "簡單至具挑戰性", time: "每關約 2 至 6 分鐘", gameplay: "一筆畫邏輯益智", genre: ["益智", "策略", "邏輯", "動物"],
    intro: "Starlink 星鏈是月帽奧拉主演的原創 30 關路線益智遊戲。玩家要用一條連續路線走完每條星路一次，並逐步掌握起點星印、彗星箭路、編號星星、鑰匙與星門。",
    story: ["動物星圖的三十個星座分散在六座觀測站。奧拉必須為每個星座畫出不間斷的完整路線，每完成五關就會點亮一座觀測站並學到新的導航規則。", "每個盤面都是依照畫面規則設計的原創圖形。第 30 關是綜合所學限制的最終星座，完成後仍可重玩，不會出現不存在的第 31 關。"],
    systems: ["選擇一顆星並沿相連星點前進。星點可以重複經過，但同一條星路只能走一次；所有星路都亮起才算完成。", "第 6 至 10 關指定發光起點；第 11 至 15 關加入清楚可見的單向彗星箭；第 16 至 20 關要依序經過編號星星；第 21 至 25 關必須先拿鑰匙再通過星門；最後五關會混合規則。", "復原會退回上一步，重新開始會清除本次路線，提示只會標出仍能完成全圖的一個合法下一步，全部都不消耗貨幣。", "過關後會在此瀏覽器儲存最佳星等與時間並解鎖下一關，已解鎖關卡都能重玩。"],
    how: ["從橫向關卡軌道選擇已解鎖星座。", "先閱讀規則；若有發光起點星印，就必須從該處開始。", "拖曳經過相鄰星點，或逐一點擊相鄰星點，同一條路不可重複。", "遵守箭頭方向、編號順序及先鑰匙後星門的限制。", "點亮全部星路即可過關並解鎖下一關。"],
    strategyTips: ["未使用路線數量為奇數的星點，常能提示開放路線的起點或終點。", "進入狹窄分支前，先確認還有路能回到星座主體。", "箭頭、數字、鑰匙與星門都是路線限制，不是裝飾。", "短距離走錯可用復原；若開局已困住多個分支，重新開始會更快。"],
    progression: ["第 1 至 5 關教基本一筆路線，第 6 至 10 關加入指定起點，第 11 至 15 關加入單向箭路。", "第 16 至 20 關加入順序星點，第 21 至 25 關加入鑰匙與星門，第 26 至 30 關綜合全部規則。"],
    designNote: "Starlink 使用響應式邏輯 Canvas 填滿 Stage 與 Battle 的安全區域，不會分別拉伸子元素。手機與寬螢幕會保留相同路線資訊與操作，底部 56px 預留區也不會蓋住遊戲或結算按鈕。",
    parent: "Starlink 可免費在瀏覽器遊玩，不需帳號。解鎖進度、最佳星等與時間只儲存在目前瀏覽器；清除網站資料或更換瀏覽器可能建立另一份紀錄。技能回饋僅供遊戲鼓勵，不是正式能力評量。",
    faq: [["星點可以重複經過嗎？", "可以，但同一條連接星路只能使用一次。"], ["為什麼粉紅色彗星路不能走？", "路線上的箭頭代表允許方向，從另一端進入不合法。"], ["走到死路怎麼辦？", "目前路線會保留，可免費復原或重新開始。"], ["一定要使用提示嗎？", "不用，每一關都能不靠提示完成。"], ["進度會保存嗎？", "會，解鎖、最佳星等與時間會儲存在此瀏覽器。"], ["共有幾關？", "共有六個規則章節、30 個原創關卡。"]]
  } });
  localizedGameplayProfiles["zh-Hant"]["animal-starlight-trails"] = { gameplay: "一筆畫邏輯益智", genre: ["益智", "策略", "邏輯", "動物"] };
  localizedGames["zh-Hans"]["animal-starlight-trails"] = { ...localizedGames["zh-Hant"]["animal-starlight-trails"], title: "Starlink 星链", guideTitleSuffix: "游戏指南", gameplay: "一笔画逻辑益智" };
  localizedGameplayProfiles["zh-Hans"]["animal-starlight-trails"] = { gameplay: "一笔画逻辑益智", genre: ["益智", "策略", "逻辑", "动物"] };

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
})();
