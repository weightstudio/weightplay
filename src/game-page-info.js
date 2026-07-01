(function () {
  const games = {
    "wonder-crash": {
      title: "Wonder Crash",
      age: "5+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      intro:
        "Wonder Crash is a mobile-friendly defense game where players move a hero, launch school-supply weapons, and protect a wall from incoming monsters. The game uses short stages, weapon cooldowns, upgrades, and clear win or retry moments so children can practice timing and attention in a playful fantasy setting. It is designed as a fun action game first, with progress tracking and upgrades that make each session feel meaningful without creating pressure.",
      how: ["Move the hero left and right.", "Weapons fire automatically when their cooldowns finish.", "Defeat each wave before the wall is destroyed.", "Use coins and diamonds to improve long-term power."],
      parent:
        "This game is designed for short action practice sessions. It may help children practice reaction, focus, and hand-eye coordination through simple movement and timing. Scores and progress are for fun and local progress tracking only.",
      faq: [
        ["Is Wonder Crash free to play?", "Yes. Wonder Crash runs in the browser on WeightPlay."],
        ["What age is Wonder Crash for?", "It is recommended for age 5+ because it uses timing, upgrades, and simple action choices."],
        ["Does this game measure ability?", "No. It is a game for fun practice and local progress tracking, not a test or diagnosis."],
      ],
    },
    "color-lunchbox": {
      title: "Color Lunchbox",
      age: "3+",
      difficulty: "Easy",
      time: "1-3 minutes",
      skills: ["Color Recognition", "Focus", "Hand-Eye Coordination"],
      intro:
        "Color Lunchbox is a gentle preschool matching game where children place foods into lunchboxes by color. Each stage uses a small set of clear objects and a simple drag or tap interaction. The goal is to make color practice feel like play, with short rounds that parents can understand quickly and children can retry without pressure.",
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
    "star-memory": {
      title: "Star Memory",
      age: "5+",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Memory", "Focus", "Problem Solving"],
      intro:
        "Star Memory is a card matching game where players remember positions and find pairs. Stages gradually add more cards and different themes, making it a calm way to practice attention and recall. The short stage format makes it suitable for quick play sessions on phones or tablets.",
      how: ["Flip a card to reveal its symbol.", "Remember where each symbol appears.", "Find the matching card pair.", "Clear every pair to finish the stage."],
      parent:
        "This game may help children practice memory and focus through simple matching. Progress feedback is for encouragement and local tracking only.",
      faq: [
        ["What age is Star Memory for?", "It is recommended for age 5+ and family play."],
        ["Does it require fast reactions?", "No. It focuses on remembering positions."],
        ["Can children replay stages?", "Yes. Replaying can help practice memory in a low-pressure way."],
      ],
    },
    "campus-dash": {
      title: "Campus Dash",
      age: "12+",
      difficulty: "Hard",
      time: "1-3 minutes",
      skills: ["Reaction", "Focus", "Hand-Eye Coordination"],
      intro:
        "Campus Dash is a fast lane runner where players move left and right to dodge obstacles and collect points. It is a score-attack game for older players who enjoy quick reactions and replaying to improve. The short timer makes each attempt fast, while local records give players a reason to try again.",
      how: ["Move between lanes.", "Avoid obstacles.", "Collect score items when it is safe.", "Try to improve your local best score."],
      parent:
        "This game is designed for older children and casual players who enjoy fast reaction challenges. It can practice focus and hand-eye coordination, but scores are only for fun.",
      faq: [
        ["Why is Campus Dash 12+?", "It has faster reactions and score pressure than younger-child games."],
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
      title: "Fruit Merge Tower",
      age: "5+",
      difficulty: "Medium",
      time: "3-5 minutes",
      skills: ["Logic", "Problem Solving", "Hand-Eye Coordination"],
      intro:
        "Fruit Merge Tower is a physics puzzle where matching fruits combine into larger fruits. Players choose where to drop each fruit, watch the pile shift, and try to keep space open. It is easy to understand and gives families a calm score challenge.",
      how: ["Move the fruit above the box.", "Drop it into a good spot.", "Merge matching fruits into the next fruit.", "Keep fruits below the danger line."],
      parent:
        "This game may help children practice planning, spatial reasoning, and hand-eye coordination. It is a casual game and does not measure intelligence.",
      faq: [
        ["What is the goal?", "Merge fruits and score as high as possible before the box fills."],
        ["Is it timed?", "No. Players can think before dropping."],
        ["Can adults enjoy it too?", "Yes. It is family-friendly and replayable."],
      ],
    },
    "garden-tiles": {
      title: "Garden Tile Match",
      age: "Family",
      difficulty: "Relaxed",
      time: "3-5 minutes",
      skills: ["Memory", "Focus", "Problem Solving"],
      intro:
        "Garden Tile Match is a calm matching game with large tiles and no timer. It is designed for relaxed daily play, including older players or families who prefer a quieter pace. The game focuses on simple visual matching and a comfortable interface.",
      how: ["Look for matching garden tiles.", "Tap tiles to select and match.", "Clear the stage at your own pace.", "Move to the next calm puzzle."],
      parent:
        "This game supports relaxed focus and memory practice. It avoids time pressure and is meant for comfort, not performance comparison.",
      faq: [
        ["Is Garden Tile Match timed?", "No. It is designed for calm play."],
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
    "animal-guard-yard": {
      title: "Animal Guard Yard",
      age: "5+",
      difficulty: "Medium",
      time: "5-8 minutes",
      skills: ["Logic", "Focus", "Problem Solving"],
      intro:
        "Animal Guard Yard is a lane defense game where players place animal guards, earn coins, upgrade animals, and stop cartoon zombies. It combines simple strategy with clear stage goals and boss fights. The game is more complete than a tiny demo and can grow into a long-term Animal Games series.",
      how: ["Choose a stage.", "Place animal guards in lanes.", "Collect energy and stop zombies.", "Upgrade animals and unlock stronger options."],
      parent:
        "This game may help children practice planning, focus, and problem solving through friendly lane-defense play. It uses cartoon fantasy enemies and avoids realistic violence.",
      faq: [
        ["Can players upgrade animals?", "Yes. Coins and diamonds can unlock or improve animal guards."],
        ["Is it scary?", "The zombies are cartoon-style game enemies, not realistic horror."],
        ["What does it practice?", "It practices planning, attention, and simple strategy."],
      ],
    },
    "animal-quiz": {
      title: "Animal Quiz",
      age: "Family",
      difficulty: "Easy",
      time: "3-5 minutes",
      skills: ["Animal Knowledge", "Memory", "Reading"],
      intro:
        "Animal Quiz is a family-friendly quiz game with themed animal stages. Players answer short questions and learn animal facts through pictures and simple choices. It works best as a parent-child activity, especially for children who enjoy animals.",
      how: ["Choose an animal stage.", "Read or listen with a parent if needed.", "Pick the best answer.", "Clear the questions to complete the stage."],
      parent:
        "This game may help children practice animal knowledge and memory. Younger children may benefit from parent help with reading.",
      faq: [
        ["Is Animal Quiz good for young children?", "Yes with parent support, especially for reading questions."],
        ["What does it practice?", "It practices animal knowledge, memory, and simple reading."],
        ["Are wrong answers punished?", "No. Feedback should stay encouraging."],
      ],
    },
    "zoo-helper-day": {
      title: "Zoo Helper Day",
      age: "3+",
      difficulty: "Easy",
      time: "1-3 minutes",
      skills: ["Animal Knowledge", "Focus", "Hand-Eye Coordination"],
      intro:
        "Zoo Helper Day is a gentle animal-care game where children help zoo animals with food, water, cleaning, and play tasks. Each stage uses simple picture-based actions so young players can understand what to do without heavy reading.",
      how: ["Look at what the animal needs.", "Choose the matching helper item.", "Give the item to the animal.", "Finish each gentle care task."],
      parent:
        "This game may help children practice animal care concepts, focus, and simple hand-eye coordination. It is designed for short and friendly sessions.",
      faq: [
        ["Can a 3-year-old play?", "The game is designed for picture-based preschool play, though parent help is always welcome."],
        ["What does it teach?", "It introduces simple care actions like food, water, and cleaning."],
        ["Does it collect child data?", "No personal child data is needed to play."],
      ],
    },
    "shape-train": {
      title: "Shape Train",
      age: "3+",
      difficulty: "Easy",
      time: "1-3 minutes",
      skills: ["Color Recognition", "Logic", "Hand-Eye Coordination"],
      intro:
        "Shape Train is a preschool matching game where children send colorful shape passengers to the correct train cars. The controls are simple, the goals are visual, and the stages are short enough for early learners.",
      how: ["Look at the shape passenger.", "Find the matching train car.", "Tap or drag the shape to the correct place.", "Complete the train to finish the stage."],
      parent:
        "This game may help young children practice shape matching, colors, and simple hand-eye coordination. It is for playful practice only.",
      faq: [
        ["Does Shape Train require reading?", "No. The main gameplay uses shapes and colors."],
        ["What age is it for?", "It is recommended for age 3+."],
        ["What skills does it practice?", "It practices matching, color recognition, and coordination."],
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

  function currentGameId() {
    const parts = location.pathname.split("/").filter(Boolean);
    const gameIndex = parts.lastIndexOf("games");
    return gameIndex >= 0 ? parts[gameIndex + 1] : "";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  function relatedGames(activeId, activeGame) {
    return Object.entries(games)
      .filter(([id]) => id !== activeId)
      .map(([id, game]) => ({
        id,
        game,
        score: game.skills.filter((skill) => activeGame.skills.includes(skill)).length + (game.age === activeGame.age ? 1 : 0),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.game.title.localeCompare(b.game.title))
      .slice(0, 4);
  }

  function gameHref(gameId) {
    const base = location.pathname.includes("/weightplay/") ? "/weightplay/games/" : "/games/";
    return `${base}${gameId}/`;
  }

  function render() {
    const id = currentGameId();
    const game = games[id];
    const main = document.querySelector("main");
    if (!game || !main || document.querySelector(".game-page-info")) return;

    document.body.classList.add("has-game-page-info");
    const related = relatedGames(id, game);
    const section = document.createElement("section");
    section.className = "game-page-info";
    section.setAttribute("aria-label", `${game.title} game information`);
    section.innerHTML = `
      <div class="game-info-hero">
        <div class="game-info-title">
          <span class="game-info-kicker">WeightPlay Kids Game Guide</span>
          <h2>${escapeHtml(game.title)} - Free Kids Game</h2>
          <p>${escapeHtml(game.intro)}</p>
        </div>
        <div class="game-info-facts">
          <div class="game-info-fact"><span>Recommended Age</span><strong>${escapeHtml(game.age)}</strong></div>
          <div class="game-info-fact"><span>Difficulty</span><strong>${escapeHtml(game.difficulty)}</strong></div>
          <div class="game-info-fact"><span>Estimated Play Time</span><strong>${escapeHtml(game.time)}</strong></div>
          <div class="game-info-fact"><span>Skills Trained</span><div class="game-info-skills">${game.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div></div>
        </div>
      </div>
      <div class="game-info-sections">
        <div class="game-info-section">
          <h3>How to Play</h3>
          <ol>${game.how.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        </div>
        <div class="game-info-section game-info-parent">
          <h3>Parent Note</h3>
          <p>${escapeHtml(game.parent)}</p>
        </div>
        <div class="game-info-section">
          <h3>FAQ</h3>
          <dl>${game.faq.map(([q, a]) => `<div><dt>${escapeHtml(q)}</dt><dd>${escapeHtml(a)}</dd></div>`).join("")}</dl>
        </div>
        <div class="game-info-section">
          <h3>Related Games</h3>
          <p>Because this game practices ${escapeHtml(game.skills[0])}, try these next:</p>
          <div class="game-info-related">${related.map(({ id: relatedId, game: relatedGame }) => `<a href="${escapeHtml(gameHref(relatedId))}">${escapeHtml(relatedGame.title)}</a>`).join("")}</div>
        </div>
      </div>
    `;
    main.insertAdjacentElement("afterend", section);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: game.faq.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
