const lobby = window.WONDER_LOBBY;
const filterButtons = document.querySelectorAll("[data-age-filter]");
const gameGrid = document.querySelector("#gameGrid");
const lobbyStats = document.querySelector("#lobbyStats");
const featuredGame = document.querySelector("#featuredGame");
const lobbyToast = document.querySelector("#lobbyToast");
let activeFilter = "all";
let toastTimer = null;

function createGameCard(game) {
  const isPlayable = game.status === "playable";
  const card = document.createElement(isPlayable ? "a" : "article");
  card.className = `game-card ${isPlayable ? "playable" : "coming-soon"}`;
  card.dataset.age = game.ages.join(" ");

  if (isPlayable) {
    card.href = game.href;
  } else {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.addEventListener("click", () => showToast(`${game.title} 還在準備中`));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showToast(`${game.title} 還在準備中`);
      }
    });
  }

  const meta = game.meta.map((item) => `<span>${item}</span>`).join("");
  const art =
    game.art.kind === "image"
      ? `<div class="game-card-art"><img src="${game.art.background}" alt="" /><img class="game-card-hero" src="${game.art.hero}" alt="" /></div>`
      : `<div class="game-card-art ${game.art.className}"><span>${game.ageLabel}</span></div>`;

  card.innerHTML = `
    ${art}
    <div class="game-card-body">
      <div class="game-card-topline">
        <span class="age-pill">${game.ageLabel}</span>
        <span>${game.statusText}</span>
      </div>
      <h2>${game.title}</h2>
      <p>${game.description}</p>
      <div class="game-card-meta">${meta}</div>
      <div class="game-card-actions">
        <span>${isPlayable ? "開始玩" : "即將推出"}</span>
        <span>${game.type}</span>
      </div>
    </div>
  `;

  return card;
}

function renderLobby() {
  const playableCount = lobby.games.filter((game) => game.status === "playable").length;
  const plannedCount = lobby.games.length - playableCount;
  const ageGroups = new Set(lobby.games.flatMap((game) => game.ages));
  lobbyStats.innerHTML = `
    <div><strong>${playableCount}</strong><span>可玩遊戲</span></div>
    <div><strong>${plannedCount}</strong><span>規劃中</span></div>
    <div><strong>${ageGroups.size}</strong><span>年齡分類</span></div>
  `;

  const featured = lobby.games.find((game) => game.id === lobby.featuredGameId);
  if (featured) {
    featuredGame.href = featured.href;
    featuredGame.querySelector("img").src = featured.art.hero || "assets/hero.png";
    featuredGame.querySelector("strong").textContent = featured.title;
  }

  gameGrid.replaceChildren(...lobby.games.map(createGameCard));
  applyFilter();
}

function applyFilter() {
  document.querySelectorAll("[data-age]").forEach((card) => {
    const ages = card.dataset.age.split(" ");
    card.classList.toggle("hidden", activeFilter !== "all" && !ages.includes(activeFilter));
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  lobbyToast.textContent = message;
  lobbyToast.classList.remove("hidden");
  toastTimer = setTimeout(() => lobbyToast.classList.add("hidden"), 1500);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.ageFilter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyFilter();
  });
});

renderLobby();
