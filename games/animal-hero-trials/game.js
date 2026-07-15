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
      bossObjective: "Defeat the Shadow Sovereign",
      reroll: "Reroll 3",
      rerollConfirm: "Spend 3 Diamonds to reroll these blessings?",
      rerollUsed: "Reroll already used this trial.",
      rerollNeed: "Not enough Diamonds. Choose a free blessing.",
      rerollDone: "New blessings revealed.",
      room: "Room {room}/3",
      bossRoom: "Room {room}/3 · BOSS",
      failCopy: "{hero} needs another route.",
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
      bossObjective: "擊敗暗影君王",
      reroll: "重抽 3",
      rerollConfirm: "確定花費 3 顆鑽石重抽祝福嗎？",
      rerollUsed: "本次試煉已使用過重抽。",
      rerollNeed: "鑽石不足，仍可免費選擇祝福。",
      rerollDone: "新的祝福已出現。",
    },
  };

  Object.assign(copy.en, {
    earnedMarks: "+{gain} Trial Marks · Total {total}.",
    trialUnlocked: "Trial {next} unlocked.",
    trialAvailable: "Trial {next} remains available.",
    allTrialsUnlocked: "All three trials are unlocked.",
    masteryReady: "Heart Mastery is ready on Main.",
    masteryNeed: "Heart Mastery needs {remaining} more Trial Marks.",
  });
  Object.assign(copy["zh-Hant"], {
    earnedMarks: "\u7372\u5f97 {gain} \u679a\u8a66\u7149\u5370\u8a18 \u00b7 \u7d2f\u7a4d {total} \u679a\u3002",
    trialUnlocked: "\u5df2\u89e3\u9396\u8a66\u7149 {next}\u3002",
    trialAvailable: "\u8a66\u7149 {next} \u4ecd\u53ef\u9032\u5165\u3002",
    allTrialsUnlocked: "\u4e09\u500b\u8a66\u7149\u5df2\u5168\u90e8\u89e3\u9396\u3002",
    masteryReady: "\u53ef\u56de\u4e3b\u756b\u9762\u5347\u7d1a\u52c7\u6c23\u7cbe\u901a\u3002",
    masteryNeed: "\u52c7\u6c23\u7cbe\u901a\u9084\u9700\u8981 {remaining} \u679a\u8a66\u7149\u5370\u8a18\u3002",
  });

  let locale = localStorage.getItem("weightPlayLocale") || "en";
  let selectedHero = localStorage.getItem("aht-selected-hero") || "leo";
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
    fia: load("animal-hero-trials-fia.webp"),
    orla: load("animal-hero-trials-orla.webp"),
    taro: load("animal-hero-trials-taro.webp"),
    enemy: load("animal-hero-trials-shadow-scout.png"),
    boss: load("animal-hero-trials-shadow-boss.webp"),
    roar: load("animal-hero-trials-fx-roar.webp"),
    hit: load("animal-hero-trials-fx-hit.webp"),
    shadow: load("animal-hero-trials-fx-shadow-hit.webp"),
  };
  const heroes = {
    leo: { image: "leo", asset: "animal-hero-trials-leo.png", hp: 100, speed: 125, attack: 10, range: 76, skill: { en: "ROAR", zh: "怒吼" } },
    fia: { image: "fia", asset: "animal-hero-trials-fia.webp", hp: 86, speed: 145, attack: 11, range: 72, skill: { en: "DASH", zh: "彗星衝刺" } },
    orla: { image: "orla", asset: "animal-hero-trials-orla.webp", hp: 82, speed: 112, attack: 8, range: 165, skill: { en: "MARK", zh: "月之印記" } },
    taro: { image: "taro", asset: "animal-hero-trials-taro.webp", hp: 126, speed: 92, attack: 8, range: 76, skill: { en: "GUARD", zh: "庭園守護" } },
  };

  function load(filename) {
    const image = new Image();
    image.src = ASSET_ROOT + filename;
    return image;
  }

  function t(key) {
    return copy[locale]?.[key] || copy.en[key] || key;
  }

  function roomLabel(room, boss = false) {
    if (locale === "zh-Hant") return `\u623f\u9593 ${room}/3${boss ? " \u00b7 \u9996\u9818" : ""}`;
    return interpolate(boss ? "bossRoom" : "room", { room });
  }

  function interpolate(key, values) {
    return t(key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  }

  function heroName(heroId) {
    return heroId.charAt(0).toUpperCase() + heroId.slice(1);
  }

  function show(name) {
    document.body.dataset.gameView = name;
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
    renderHeroPicker();
    renderStages();
  }

  function renderHeroPicker() {
    const picker = $("#heroPicker");
    if (!picker) return;
    const labels = {
      leo: ["Boom Mane Leo", locale === "zh-Hant" ? "均衡 · 100 生命" : "Balanced · 100 HP", locale === "zh-Hant" ? "近距離暈眩" : "Close-range stun"],
      fia: ["Spark Paw Fia", locale === "zh-Hant" ? "高速 · 86 生命" : "Fast · 86 HP", locale === "zh-Hant" ? "無敵衝刺" : "Invulnerable dash"],
      orla: ["Moon Cap Orla", locale === "zh-Hant" ? "遠程 · 82 生命" : "Ranged · 82 HP", locale === "zh-Hant" ? "標記增傷" : "Mark bonus damage"],
      taro: ["Moss Shell Taro", locale === "zh-Hant" ? "耐久 · 126 生命" : "Tank · 126 HP", locale === "zh-Hant" ? "守護減傷" : "Damage guard"],
    };
    picker.innerHTML = "";
    Object.entries(heroes).forEach(([id, hero]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.hero = id;
      button.setAttribute("aria-label", labels[id].join(" - "));
      button.setAttribute("aria-pressed", id === selectedHero ? "true" : "false");
      button.className = `hero-option${id === selectedHero ? " selected" : ""}`;
      button.innerHTML = `<img src="${ASSET_ROOT + hero.asset}" alt=""><b>${labels[id][0]}</b><small><span>${labels[id][1]}</span><span>${labels[id][2]}</span></small>`;
      button.onclick = () => {
        selectedHero = id;
        localStorage.setItem("aht-selected-hero", id);
        renderHeroPicker();
      };
      picker.append(button);
    });
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
    const hero = heroes[selectedHero] || heroes.leo;
    const maxHp = hero.hp + mastery * 12;
    run = {
      active: true,
      stage,
      room: 1,
      hp: maxHp,
      maxHp,
      leo: { x: 195, y: 430 },
      heroId: selectedHero,
      enemies: [],
      cool: 0,
      attackCool: 0,
      invulnerable: 0,
      guard: 0,
      rerollUsed: false,
      last: performance.now(),
      bless: { power: 0, speed: 0, heal: 0 },
      fx: [],
    };
    $("#skillBtn img").src = ASSET_ROOT + hero.asset;
    spawn();
    loop(performance.now());
  }

  function spawn() {
    if (run.room === 3) {
      const hp = 145 + run.stage * 25;
      run.enemies = [{ x: 195, y: 125, hp, max: hp, cd: 0, boss: true, special: 2.8, warning: 0 }];
      $("#roomText").textContent = roomLabel(run.room, true);
      $("#objective").textContent = t("bossObjective");
      updateHud();
      return;
    }
    run.enemies = Array.from({ length: 2 + run.room }, (_, index) => {
      const hp = 28 + run.stage * 7 + run.room * 5;
      return { x: 80 + index * 110, y: 105 + (index % 2) * 90, hp, max: hp, cd: 0 };
    });
    $("#roomText").textContent = roomLabel(run.room);
    $("#objective").textContent = `Defeat ${run.enemies.length} Shadow Scouts`;
    updateHud();
  }

  function updateHud() {
    $("#hpFill").style.width = `${Math.max(0, (run.hp / run.maxHp) * 100)}%`;
    const skillName = locale === "zh-Hant" ? heroes[run.heroId].skill.zh : heroes[run.heroId].skill.en;
    $("#cooldownText").textContent = run.cool > 0 ? run.cool.toFixed(1) : skillName;
  }

  function skill() {
    if (!run?.active || run.cool > 0) return;
    if (run.heroId === "leo") {
      run.cool = Math.max(2.5, 5 - run.bless.speed * 0.5);
      run.fx.push({ type: "roar", x: run.leo.x, y: run.leo.y, t: 0.45 });
      for (const enemy of run.enemies) {
        if (Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y) < 145) {
          enemy.hp -= 24 + run.bless.power * 7;
          run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.3 });
        }
      }
      return;
    }
    if (run.heroId === "fia") {
      run.cool = Math.max(2.2, 4.2 - run.bless.speed * 0.45);
      const skillTarget = [...run.enemies].sort((a, b) => Math.hypot(a.x - run.leo.x, a.y - run.leo.y) - Math.hypot(b.x - run.leo.x, b.y - run.leo.y))[0];
      let dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0) + stick.x;
      let dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0) + stick.y;
      if (skillTarget) {
        dx = skillTarget.x - run.leo.x;
        dy = skillTarget.y - run.leo.y;
      }
      const length = Math.hypot(dx, dy) || 1;
      if (!dx && !dy) dy = -1;
      const from = { ...run.leo };
      run.leo.x = Math.max(35, Math.min(355, run.leo.x + (dx / length) * 125));
      run.leo.y = Math.max(80, Math.min(520, run.leo.y + (dy / length) * 125));
      run.invulnerable = 0.55;
      run.fx.push({ type: "roar", x: (from.x + run.leo.x) / 2, y: (from.y + run.leo.y) / 2, t: 0.3 });
      let dashTarget = null;
      let dashDistance = Infinity;
      for (const enemy of run.enemies) {
        const distance = Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y);
        if (distance < dashDistance) {
          dashDistance = distance;
          dashTarget = enemy;
        }
        if (distance < 105) {
          enemy.hp -= 30 + run.bless.power * 6;
          run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.25 });
        }
      }
      if (dashTarget && dashDistance >= 105 && dashDistance < 190) {
        dashTarget.hp -= 22 + run.bless.power * 5;
        run.fx.push({ type: "hit", x: dashTarget.x, y: dashTarget.y, t: 0.25 });
      }
      return;
    }
    if (run.heroId === "orla") {
      run.cool = Math.max(2.5, 4.8 - run.bless.speed * 0.45);
      const target = [...run.enemies].sort((a, b) => Math.hypot(a.x - run.leo.x, a.y - run.leo.y) - Math.hypot(b.x - run.leo.x, b.y - run.leo.y))[0];
      if (target) {
        target.hp -= 24 + run.bless.power * 5;
        target.marked = true;
        run.fx.push({ type: "roar", x: target.x, y: target.y, t: 0.4 });
      }
      return;
    }
    run.cool = Math.max(3.2, 6 - run.bless.speed * 0.45);
    run.guard = 3.5;
    run.hp = Math.min(run.maxHp, run.hp + 8 + run.bless.heal * 2);
    run.fx.push({ type: "roar", x: run.leo.x, y: run.leo.y, t: 0.55 });
    for (const enemy of run.enemies) {
      if (Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y) < 220) {
        enemy.hp -= 20 + run.bless.power * 4;
        run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.3 });
      }
    }
  }

  function hurt(amount) {
    if (run.invulnerable > 0) return;
    run.hp -= run.guard > 0 ? Math.ceil(amount * 0.3) : amount;
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
    const hero = heroes[run.heroId];
    if (!target || distance > hero.range) return;
    let damage = hero.attack + run.bless.power * 2;
    if (target.marked) {
      damage += 18;
      target.marked = false;
    }
    target.hp -= damage;
    run.attackCool = 0.58;
    run.fx.push({ type: "hit", x: target.x, y: target.y, t: 0.22 });
  }

  function chooseBlessing() {
    run.active = false;
    renderBlessings(false);
    $("#choiceModal").classList.remove("hidden");
  }

  function blessingPool(rerolled) {
    if (rerolled) {
      return [
        { id: "power", amount: 2, img: "animal-hero-trials-icon-roaring-mane.webp", name: locale === "zh-Hant" ? "王者勇氣" : "Sovereign Courage", copy: locale === "zh-Hant" ? "攻擊威力 +2" : "Attack power +2" },
        { id: "speed", amount: 2, img: "animal-hero-trials-icon-comet-dash.webp", name: locale === "zh-Hant" ? "彗星節奏" : "Comet Tempo", copy: locale === "zh-Hant" ? "冷卻時間 -1.0 秒" : "Cooldown -1.0s" },
        { id: "heal", amount: 2, img: "animal-hero-trials-icon-moon-mark.webp", name: locale === "zh-Hant" ? "滿月復甦" : "Full Moon Recovery", copy: locale === "zh-Hant" ? "恢復 48 生命" : "Recover 48 HP" },
      ];
    }
    return [
      { id: "power", amount: 1, img: "animal-hero-trials-icon-roaring-mane.webp", name: locale === "zh-Hant" ? "怒吼之力" : "Roaring Power", copy: locale === "zh-Hant" ? "攻擊威力 +1" : "Attack power +1" },
      { id: "speed", amount: 1, img: "animal-hero-trials-icon-comet-dash.webp", name: locale === "zh-Hant" ? "彗星律動" : "Comet Rhythm", copy: locale === "zh-Hant" ? "冷卻時間 -0.5 秒" : "Cooldown -0.5s" },
      { id: "heal", amount: 1, img: "animal-hero-trials-icon-moon-mark.webp", name: locale === "zh-Hant" ? "月光恢復" : "Moon Recovery", copy: locale === "zh-Hant" ? "恢復 24 生命" : "Recover 24 HP" },
    ];
  }

  function renderBlessings(rerolled) {
    const options = blessingPool(rerolled);
    const box = $("#choices");
    box.innerHTML = "";
    for (const option of options) {
      const button = document.createElement("button");
      button.className = "choice";
      button.dataset.nativeLocalized = "true";
      button.innerHTML = `<img src="${ASSET_ROOT + option.img}" alt=""><span><b>${option.name}</b><br><small>${option.copy}</small></span>`;
      button.onclick = () => {
        run.bless[option.id] += option.amount;
        if (option.id === "heal") run.hp = Math.min(run.maxHp, run.hp + 24 * option.amount);
        $("#choiceModal").classList.add("hidden");
        run.room += 1;
        run.active = true;
        spawn();
        run.last = performance.now();
        loop(performance.now());
      };
      box.append(button);
    }
    updateRerollUi();
  }

  function updateRerollUi(message = "") {
    const balance = window.WeightPlayWallet?.read?.().diamonds || 0;
    $("#rerollLabel").textContent = `${t("reroll")} · ${balance}`;
    $("#rerollBtn").disabled = run.rerollUsed || balance < 3;
    $("#rerollStatus").textContent = message || (run.rerollUsed ? t("rerollUsed") : balance < 3 ? t("rerollNeed") : "");
  }

  function rerollBlessings() {
    if (run.rerollUsed) return updateRerollUi(t("rerollUsed"));
    const balance = window.WeightPlayWallet?.read?.().diamonds || 0;
    if (balance < 3) return updateRerollUi(t("rerollNeed"));
    if (!window.confirm(t("rerollConfirm"))) return;
    if (!window.WeightPlayWallet?.spendDiamonds?.(3)) return updateRerollUi(t("rerollNeed"));
    run.rerollUsed = true;
    renderBlessings(true);
    updateRerollUi(t("rerollDone"));
    window.WonderAnalytics?.track?.("diamond_spend", {
      game_id: "animal-hero-trials",
      item: "blessing_reroll",
      cost: 3,
      balance: window.WeightPlayWallet.read().diamonds,
    });
  }

  function finish(won) {
    run.active = false;
    cancelAnimationFrame(frame);
    if (won) {
      const gain = 3 + run.stage;
      const previousUnlocked = unlocked;
      marks += gain;
      unlocked = Math.max(unlocked, Math.min(3, run.stage + 1));
      save();
      const masteryCost = 5 + mastery * 4;
      const remaining = Math.max(0, masteryCost - marks);
      const unlockCopy = run.stage >= 3
        ? t("allTrialsUnlocked")
        : interpolate(unlocked > previousUnlocked ? "trialUnlocked" : "trialAvailable", { next: run.stage + 1 });
      const masteryCopy = remaining === 0
        ? t("masteryReady")
        : interpolate("masteryNeed", { remaining });
      $("#resultTitle").textContent = t("win");
      $("#resultCopy").textContent = `${interpolate("earnedMarks", { gain, total: marks })} ${unlockCopy} ${masteryCopy}`;
      $("#resultNext").textContent = run.stage < 3 ? t("next") : t("menu");
      $("#resultNext").onclick = () => run.stage < 3 ? startTrial(run.stage + 1) : (show("main"), localize());
    } else {
      $("#resultTitle").textContent = t("fail");
      $("#resultCopy").textContent = locale === "zh-Hant"
        ? `${heroName(run.heroId)}\u9700\u8981\u518d\u8a66\u4e00\u6b21\u3002`
        : interpolate("failCopy", { hero: heroName(run.heroId) });
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
    const heroSpeed = heroes[run.heroId].speed;
    run.leo.x = Math.max(35, Math.min(355, run.leo.x + (dx / length) * heroSpeed * dt));
    run.leo.y = Math.max(80, Math.min(520, run.leo.y + (dy / length) * heroSpeed * dt));
    run.cool = Math.max(0, run.cool - dt);
    run.attackCool = Math.max(0, run.attackCool - dt);
    run.invulnerable = Math.max(0, run.invulnerable - dt);
    run.guard = Math.max(0, run.guard - dt);

    for (const enemy of run.enemies) {
      const ex = run.leo.x - enemy.x;
      const ey = run.leo.y - enemy.y;
      const distance = Math.hypot(ex, ey) || 1;
      const moveSpeed = enemy.boss ? 24 : 32;
      enemy.x += (ex / distance) * moveSpeed * dt;
      enemy.y += (ey / distance) * moveSpeed * dt;
      enemy.cd -= dt;
      if (enemy.boss) {
        enemy.special -= dt;
        if (enemy.warning > 0) {
          enemy.warning -= dt;
          if (enemy.warning <= 0) {
            if (distance < 155) hurt(11);
            run.fx.push({ type: "shadow", x: run.leo.x, y: run.leo.y, t: 0.38 });
          }
        } else if (enemy.special <= 0) {
          enemy.warning = 0.7;
          enemy.special = 4.2;
          run.fx.push({ type: "roar", x: enemy.x, y: enemy.y, t: 0.7 });
        }
      }
      if (distance < 48 && enemy.cd <= 0) {
        hurt(enemy.boss ? 7 : 4);
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
      const enemyImage = enemy.boss ? images.boss : images.enemy;
      const size = enemy.boss ? 118 : 68;
      ctx.drawImage(enemyImage, enemy.x - size / 2, enemy.y - size / 2, size, size);
      ctx.fillStyle = "#17231f";
      const barWidth = enemy.boss ? 100 : 56;
      const barY = enemy.y - size / 2 - 9;
      ctx.fillRect(enemy.x - barWidth / 2, barY, barWidth, 6);
      ctx.fillStyle = "#7be0b1";
      ctx.fillRect(enemy.x - barWidth / 2, barY, (barWidth * enemy.hp) / enemy.max, 6);
      if (enemy.marked) {
        ctx.strokeStyle = "#7cecff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y - size / 2 - 18, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    const hero = heroes[run.heroId];
    const heroWidth = run.heroId === "taro" ? 94 : run.heroId === "orla" ? 82 : 78;
    const heroHeight = run.heroId === "taro" ? 78 : 90;
    ctx.globalAlpha = run.invulnerable > 0 ? 0.72 : 1;
    ctx.drawImage(images[hero.image], run.leo.x - heroWidth / 2, run.leo.y - heroHeight / 2, heroWidth, heroHeight);
    ctx.globalAlpha = 1;
    if (run.guard > 0) {
      ctx.strokeStyle = "#55e0b1";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(run.leo.x, run.leo.y, 56, 0, Math.PI * 2);
      ctx.stroke();
    }
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

  const localeSelect = $("#locale") || $("#localeSelect");
  localeSelect.value = locale;
  localeSelect.onchange = (event) => {
    locale = event.target.value;
    localStorage.setItem("weightPlayLocale", locale);
    localize();
  };
  $("#startBtn").onclick = () => show("stage");
  $("#stageBack").onclick = () => show("main");
  $("#battleBack").onclick = () => show("stage");
  $("#skillBtn").onclick = skill;
  $("#rerollBtn").onclick = rerollBlessings;
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
