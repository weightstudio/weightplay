(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const ASSET_ROOT = "../../assets/";
  const copy = {
    en: {
      title: "Animal Hero Trials",
      pitch: "Guide Leo through three forest trials and choose a blessing after every room.",
      marks: "Trial Marks",
      mastery: "Heart Mastery",
      start: "Start Trial",
      choose: "Choose Trial",
      blessing: "Choose a Blessing",
      menu: "Main Menu",
      locked: "Clear the previous trial",
      win: "Trial Cleared!",
      fail: "Trial Failed",
      next: "Next Trial",
      retry: "Try Again",
    },
    "zh-Hant": {
      title: "動物英雄試煉",
      pitch: "帶領獅子里歐通過三個森林試煉，每個房間結束後選擇一項祝福。",
      marks: "試煉印記",
      mastery: "勇氣精通",
      start: "開始試煉",
      choose: "選擇試煉",
      blessing: "選擇祝福",
      menu: "主選單",
      locked: "先完成上一個試煉",
      win: "試煉完成！",
      fail: "試煉失敗",
      next: "下一個試煉",
      retry: "再試一次",
    },
  };

  let locale = localStorage.getItem("weightPlayLocale") || "en";
  let unlocked = +(localStorage.getItem("aht-unlocked") || 1);
  let marks = +(localStorage.getItem("aht-marks") || 0);
  let mastery = +(localStorage.getItem("aht-mastery") || 0);
  let run = null;
  let frame = 0;
  let pointer = null;
  const keys = {};
  let stick = { x: 0, y: 0 };

  const views = {
    main: $("#mainView"),
    stage: $("#stageView"),
    battle: $("#battleView"),
  };
  const canvas = $("#game");
  const ctx = canvas.getContext("2d");
  const images = {
    bg: load("animal-hero-trials-arena.png"),
    leo: load("animal-hero-trials-leo.png"),
    enemy: load("animal-hero-trials-shadow-scout.png"),
    roar: load("animal-hero-trials-fx-roar.webp"),
    hit: load("animal-hero-trials-fx-hit.webp"),
    shadow: load("animal-hero-trials-fx-shadow-hit.webp"),
  };

  function load(filename) {
    const image = new Image();
    image.src = ASSET_ROOT + filename;
    return image;
  }

  function t(key) {
    return copy[locale]?.[key] || copy.en[key] || key;
  }

  function show(name) {
    Object.entries(views).forEach(([key, view]) => {
      view.classList.toggle("hidden", key !== name);
    });
    $("#choiceModal").classList.add("hidden");
    $("#resultModal").classList.add("hidden");
    if (name !== "battle") {
      cancelAnimationFrame(frame);
      if (run) run.active = false;
    }
  }

  function localize() {
    document.documentElement.lang = locale;
    $$('[data-t]').forEach((node) => {
      node.textContent = t(node.dataset.t);
    });
    $("#markCount").textContent = marks;
    $("#masteryLevel").textContent = `Lv.${mastery}`;
    $("#masteryCost").textContent = `${5 + mastery * 4} marks`;
    renderStages();
  }

  function renderStages() {
    const rail = $("#stageRail");
    rail.innerHTML = "";
    for (let stage = 1; stage <= 3; stage += 1) {
      const button = document.createElement("button");
      button.className = `stage-card${stage > unlocked ? " locked" : ""}`;
      const detail = stage > unlocked ? t("locked") : `3 rooms · +${3 + stage} marks`;
      button.innerHTML = `<img src="${ASSET_ROOT}animal-hero-trials-arena.png" alt=""><strong>Trial ${stage}</strong><span>${detail}</span>`;
      button.onclick = () => stage <= unlocked && startTrial(stage);
      rail.append(button);
    }
  }

  function save() {
    localStorage.setItem("aht-unlocked", unlocked);
    localStorage.setItem("aht-marks", marks);
    localStorage.setItem("aht-mastery", mastery);
  }

  function startTrial(stage) {
    show("battle");
    const maxHp = 100 + mastery * 12;
    run = {
      active: true,
      stage,
      room: 1,
      hp: maxHp,
      maxHp,
      leo: { x: 195, y: 430 },
      enemies: [],
      cool: 0,
      attackCool: 0,
      last: performance.now(),
      bless: { power: 0, speed: 0, heal: 0 },
      fx: [],
    };
    spawn();
    loop(performance.now());
  }

  function spawn() {
    run.enemies = Array.from({ length: 2 + run.room }, (_, index) => {
      const hp = 28 + run.stage * 7 + run.room * 5;
      return { x: 80 + index * 110, y: 105 + (index % 2) * 90, hp, max: hp, cd: 0 };
    });
    $("#roomText").textContent = `Room ${run.room}/3`;
    $("#objective").textContent = `Defeat ${run.enemies.length} Shadow Scouts`;
    updateHud();
  }

  function updateHud() {
    $("#hpFill").style.width = `${Math.max(0, (run.hp / run.maxHp) * 100)}%`;
    $("#cooldownText").textContent = run.cool > 0 ? run.cool.toFixed(1) : "ROAR";
  }

  function skill() {
    if (!run?.active || run.cool > 0) return;
    run.cool = Math.max(2.5, 5 - run.bless.speed * 0.5);
    run.fx.push({ type: "roar", x: run.leo.x, y: run.leo.y, t: 0.45 });
    for (const enemy of run.enemies) {
      if (Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y) < 145) {
        enemy.hp -= 24 + run.bless.power * 7;
        run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.3 });
      }
    }
  }

  function autoAttack() {
    if (run.attackCool > 0) return;
    let target = null;
    let distance = Infinity;
    for (const enemy of run.enemies) {
      const current = Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y);
      if (current < distance) {
        distance = current;
        target = enemy;
      }
    }
    if (!target || distance > 76) return;
    target.hp -= 10 + run.bless.power * 2;
    run.attackCool = 0.58;
    run.fx.push({ type: "hit", x: target.x, y: target.y, t: 0.22 });
  }

  function chooseBlessing() {
    run.active = false;
    const options = [
      { id: "power", img: "animal-hero-trials-icon-roaring-mane.webp", name: "Roaring Power", copy: "Roar damage +7" },
      { id: "speed", img: "animal-hero-trials-icon-comet-dash.webp", name: "Comet Rhythm", copy: "Cooldown -0.5s" },
      { id: "heal", img: "animal-hero-trials-icon-moon-mark.webp", name: "Moon Recovery", copy: "Recover 24 HP" },
    ];
    const box = $("#choices");
    box.innerHTML = "";
    for (const option of options) {
      const button = document.createElement("button");
      button.className = "choice";
      button.innerHTML = `<img src="${ASSET_ROOT + option.img}" alt=""><span><b>${option.name}</b><br><small>${option.copy}</small></span>`;
      button.onclick = () => {
        run.bless[option.id] += 1;
        if (option.id === "heal") run.hp = Math.min(run.maxHp, run.hp + 24);
        $("#choiceModal").classList.add("hidden");
        run.room += 1;
        run.active = true;
        spawn();
        run.last = performance.now();
        loop(performance.now());
      };
      box.append(button);
    }
    $("#choiceModal").classList.remove("hidden");
  }

  function finish(won) {
    run.active = false;
    cancelAnimationFrame(frame);
    if (won) {
      const gain = 3 + run.stage;
      marks += gain;
      unlocked = Math.max(unlocked, Math.min(3, run.stage + 1));
      save();
      $("#resultTitle").textContent = t("win");
      $("#resultCopy").textContent = `+${gain} ${t("marks")}`;
      $("#resultNext").textContent = run.stage < 3 ? t("next") : t("menu");
      $("#resultNext").onclick = () => run.stage < 3 ? startTrial(run.stage + 1) : (show("main"), localize());
    } else {
      $("#resultTitle").textContent = t("fail");
      $("#resultCopy").textContent = "Leo needs another route.";
      $("#resultNext").textContent = t("retry");
      $("#resultNext").onclick = () => startTrial(run.stage);
    }
    $("#resultModal").classList.remove("hidden");
  }

  function loop(now) {
    if (!run?.active) return;
    const dt = Math.min(0.033, (now - run.last) / 1000);
    run.last = now;
    const dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0) + stick.x;
    const dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0) + stick.y;
    const length = Math.hypot(dx, dy) || 1;
    run.leo.x = Math.max(35, Math.min(355, run.leo.x + (dx / length) * 125 * dt));
    run.leo.y = Math.max(80, Math.min(520, run.leo.y + (dy / length) * 125 * dt));
    run.cool = Math.max(0, run.cool - dt);
    run.attackCool = Math.max(0, run.attackCool - dt);

    for (const enemy of run.enemies) {
      const ex = run.leo.x - enemy.x;
      const ey = run.leo.y - enemy.y;
      const distance = Math.hypot(ex, ey) || 1;
      enemy.x += (ex / distance) * 32 * dt;
      enemy.y += (ey / distance) * 32 * dt;
      enemy.cd -= dt;
      if (distance < 48 && enemy.cd <= 0) {
        run.hp -= 4;
        enemy.cd = 1;
        run.fx.push({ type: "shadow", x: run.leo.x, y: run.leo.y, t: 0.3 });
      }
    }
    autoAttack();
    run.enemies = run.enemies.filter((enemy) => enemy.hp > 0);
    run.fx.forEach((effect) => { effect.t -= dt; });
    run.fx = run.fx.filter((effect) => effect.t > 0);
    if (run.hp <= 0) return finish(false);
    if (!run.enemies.length) return run.room >= 3 ? finish(true) : chooseBlessing();
    draw();
    updateHud();
    frame = requestAnimationFrame(loop);
  }

  function draw() {
    ctx.clearRect(0, 0, 390, 560);
    ctx.drawImage(images.bg, 0, 0, 390, 560);
    for (const enemy of run.enemies) {
      ctx.drawImage(images.enemy, enemy.x - 34, enemy.y - 34, 68, 68);
      ctx.fillStyle = "#17231f";
      ctx.fillRect(enemy.x - 28, enemy.y - 43, 56, 5);
      ctx.fillStyle = "#7be0b1";
      ctx.fillRect(enemy.x - 28, enemy.y - 43, (56 * enemy.hp) / enemy.max, 5);
    }
    ctx.drawImage(images.leo, run.leo.x - 39, run.leo.y - 45, 78, 90);
    for (const effect of run.fx) {
      const image = effect.type === "roar" ? images.roar : effect.type === "hit" ? images.hit : images.shadow;
      const size = effect.type === "roar" ? 180 : 74;
      ctx.globalAlpha = Math.min(1, effect.t * 4);
      ctx.drawImage(image, effect.x - size / 2, effect.y - size / 2, size, size);
      ctx.globalAlpha = 1;
    }
  }

  function bindStick() {
    const joystick = $("#joystick");
    const nub = joystick.querySelector("i");
    const move = (event) => {
      if (pointer !== event.pointerId) return;
      const rect = joystick.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      const magnitude = Math.min(30, Math.hypot(x, y));
      const angle = Math.atan2(y, x);
      stick = { x: (Math.cos(angle) * magnitude) / 30, y: (Math.sin(angle) * magnitude) / 30 };
      nub.style.transform = `translate(${stick.x * 25}px, ${stick.y * 25}px)`;
    };
    joystick.onpointerdown = (event) => {
      pointer = event.pointerId;
      joystick.setPointerCapture(pointer);
      move(event);
    };
    joystick.onpointermove = move;
    joystick.onpointerup = () => {
      pointer = null;
      stick = { x: 0, y: 0 };
      nub.style.transform = "";
    };
  }

  $("#locale").value = locale;
  $("#locale").onchange = (event) => {
    locale = event.target.value;
    localStorage.setItem("weightPlayLocale", locale);
    localize();
  };
  $("#startBtn").onclick = () => show("stage");
  $("#stageBack").onclick = () => show("main");
  $("#battleBack").onclick = () => show("stage");
  $("#skillBtn").onclick = skill;
  $("#resultHome").onclick = () => { show("main"); localize(); };
  $("#masteryBtn").onclick = () => {
    const cost = 5 + mastery * 4;
    if (marks >= cost) {
      marks -= cost;
      mastery += 1;
      save();
      localize();
    }
  };
  addEventListener("keydown", (event) => {
    keys[event.code] = true;
    if (event.code === "Space") skill();
  });
  addEventListener("keyup", (event) => { keys[event.code] = false; });
  bindStick();
  localize();
})();
