/* Shared V6 campaign runtime; each listed game owns a distinct playable loop. */
(() => {
  const $ = (id) => document.getElementById(id);
  const gameId = document.body.dataset.wpMarketGame;
  const slug = gameId.replace(/^animal-/, "");
  const canvas = $("arena");
  const ctx = canvas.getContext("2d");
  const background = new Image(); background.src = `assets/${gameId}-background.png`;
  const atlas = new Image(); atlas.src = `assets/${gameId}-atlas.png`;
  const hero = new Image();
  hero.src = ({
    "animal-hoop-league": "../../assets/weightplay-character-boom-mane-lion-cutout.webp",
    "animal-habitat-atlas": "../../assets/weightplay-character-moon-cap-owl-cutout.webp",
    "animal-moonlight-workshop": "../../assets/weightplay-character-gear-horn-rhino-cutout.webp",
    "animal-chameleon-blend": "../../assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp",
    "animal-habitat-builder": "../../assets/weightplay-character-moss-shell-turtle-cutout.webp",
  })[gameId];
  const configs = {
    "animal-hoop-league": { stages: 6, noun: "Court", hint: "Aim · hold · release", iconCols: 3, hero: [72, 255, 218, 250] },
    "animal-habitat-atlas": { stages: 6, noun: "Expedition", hint: "Reveal clues · choose a habitat", iconCols: 4, hero: [34, 285, 180, 210] },
    "animal-moonlight-workshop": { stages: 6, noun: "Room", hint: "Light switches · key · exit", iconCols: 4, hero: [36, 296, 150, 190] },
    "animal-chameleon-blend": { stages: 6, noun: "Garden", hint: "Remember · match · lock", iconCols: 4, hero: [50, 294, 160, 205] },
    "animal-habitat-builder": { stages: 6, noun: "Reserve", hint: "Place tiles · meet every need", iconCols: 4, hero: [35, 290, 170, 210] },
  };
  const cfg = configs[gameId];
  const hoopProfiles = [
    { badge:"◎", shots:8, rival:[2,1,1,2], charge:1, perfect:2 },
    { badge:"↔", shots:8, rival:[1,2,2,2], charge:1.05, perfect:2 },
    { badge:"◇", shots:7, rival:[2,2,3], charge:.94, perfect:3 },
    { badge:"⚡", shots:8, rival:[2,2,2,2], charge:1.28, perfect:2 },
    { badge:"🔥", shots:8, rival:[2,3,2,3], charge:1.12, perfect:2 },
    { badge:"★", shots:10, rival:[2,3,2,3,3], charge:1.2, perfect:3 },
  ];
  const atlasProfiles = [
    { badge:"💧", pairs:[[0,1]], targets:[0,1,2,3,0], pass:8 },
    { badge:"❄", pairs:[[1,2]], targets:[1,3,0,2,1], pass:9 },
    { badge:"↔", pairs:[[2,0]], targets:[2,0,3,1,2,0], pass:10 },
    { badge:"🧭", pairs:[[0,1],[1,2]], targets:[3,2,1,0,2,3], pass:11 },
    { badge:"🔍", pairs:[[1,2],[2,0],[0,1]], targets:[0,2,3,1,3,0,2], pass:12 },
    { badge:"★", pairs:[[2,0],[0,1],[1,2]], targets:[1,0,3,2,0,2,1,3], pass:14 },
  ];
  const workshopProfiles = [
    { badge:"◎", start:[0,2], switches:[[2,1],[4,3]], key:[5,1], exit:[7,2], limit:18, walls:[[1,0],[3,0],[3,2],[4,2],[4,4],[6,4]] },
    { badge:"⚙", start:[0,4], switches:[[1,3],[3,1],[5,3]], key:[6,3], exit:[7,4], limit:22, walls:[[1,2],[2,2],[4,2],[6,2],[2,1],[2,0],[4,0],[6,0],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]], gates:[{x:2,y:3,needs:1},{x:4,y:1,needs:2},{x:6,y:3,needs:3}] },
    { badge:"❄", start:[0,4], switches:[[2,4],[4,2],[6,0]], key:[7,2], exit:[7,4], limit:15, walls:[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[5,1],[6,1],[5,2],[6,2]], ice:[[1,4],[2,4],[4,3],[4,2],[4,1],[5,0],[6,0]] },
    { badge:"✦", start:[0,2], switches:[[1,1],[3,3],[6,1]], key:[6,3], exit:[7,2], limit:20, walls:[[1,2],[2,2],[3,2],[1,3],[2,3],[5,0],[6,0]], portals:[[[2,1],[5,3]]] },
    { badge:"①", start:[0,4], switches:[[2,3],[1,1],[4,3],[6,1]], key:[7,1], exit:[7,4], limit:24, ordered:true, walls:[[0,3],[0,2],[2,2],[3,2],[4,2],[6,2],[3,4],[4,4],[5,4],[6,4]] },
    { badge:"★", start:[0,4], switches:[[2,4],[3,1],[5,3],[6,1]], key:[7,0], exit:[7,4], limit:22, walls:[[0,0],[1,0],[2,0],[4,0],[5,0],[6,0],[1,3],[2,3],[4,3],[6,3],[1,2],[2,2],[4,2],[6,2]], gates:[{x:3,y:3,needs:1},{x:7,y:2,needs:4}], ice:[[1,4],[2,4]], portals:[[[4,1],[5,3]]] },
  ];
  const blendProfiles = [
    { badge:"◎", rounds:5, need:4, sequence:1, preview:2.8, choose:8, shuffle:false, reverse:false },
    { badge:"⚡", rounds:6, need:5, sequence:1, preview:2.1, choose:6.5, shuffle:false, reverse:false },
    { badge:"↻", rounds:6, need:5, sequence:1, preview:2.4, choose:6.5, shuffle:true, reverse:false },
    { badge:"1·2", rounds:5, need:4, sequence:2, preview:1.65, choose:9, shuffle:false, reverse:false },
    { badge:"2·1", rounds:5, need:4, sequence:2, preview:1.55, choose:9, shuffle:true, reverse:true },
    { badge:"★", rounds:4, need:3, sequence:3, preview:1.35, choose:10, shuffle:true, reverse:false },
  ];
  const builderProfiles = [
    { badge:"◎", need:[2,2,1,1], limit:8 },
    { badge:"≋", need:[3,2,2,1], limit:10, waterConnected:true },
    { badge:"◫", need:[2,2,3,2], limit:12, edgeForest:2, shelterForest:true },
    { badge:"↔", need:[2,3,2,2], limit:12, meadowWater:3, shelterForest:true },
    { badge:"⇆", need:[5,3,3,2], limit:16, waterSpan:true, forestConnected:true, blocked:[6,8,16,18] },
    { badge:"★", need:[4,4,4,3], limit:18, waterConnected:true, forestConnected:true, shelterForest:true, meadowWater:4, blocked:[0,5,10,15] },
  ];
  const blendPatternOrders=[[0,1,2],[1,2,0],[2,0,1],[2,1,0],[1,0,2],[0,2,1]];
  const blendPairCycle=[[1,2],[0,1],[2,0],[1,0],[2,2],[0,2],[1,1],[0,0],[2,1]];
  function makeBlendTargets(stage,round){const profile=blendProfiles[stage-1],offset=(stage-1)*2+(round-1)*profile.sequence;return Array.from({length:profile.sequence},(_,index)=>{const pair=blendPairCycle[(offset+index)%blendPairCycle.length];return{color:pair[0],pattern:pair[1]};});}
  const habitatTraits=[["💧","❄","↔"],["☀","❄","⌂"],["☀","🔆","↔"],["💧","🔆","⌂"]];
  function atlasCluePlan(){const g=state.game,profile=atlasProfiles[state.stage-1],pair=profile.pairs[g.question%profile.pairs.length];return[pair[0],pair[1],3];}
  function hoopChallenge(shot) {
    const stage=state.stage,index=Math.max(0,shot-1);let aim=.42,power=.68,aimTolerance=.115,powerTolerance=.12;
    if(stage===1)aim=.42+Math.sin(1.7+shot)*.08;
    if(stage===2){aim=.42+Math.sin(shot*1.85)*.15;power=shot%2?.72:.62;aimTolerance=.105;powerTolerance=.105;}
    if(stage===3){aim=shot%2?.29:.58;power=shot%2?.74:.57;aimTolerance=.095;powerTolerance=.1;}
    if(stage===4){aim=.43+Math.sin(shot*1.2)*.07;power=[.48,.82,.62][index%3];aimTolerance=.085;powerTolerance=.085;}
    if(stage===5){aim=.42+Math.sin(shot*2.1)*.14;power=.58+(index%3)*.1;aimTolerance=.085;powerTolerance=.085;}
    if(stage===6){aim=[.28,.48,.62,.36,.55][index%5];power=[.78,.54,.7,.84,.6][index%5];aimTolerance=.08;powerTolerance=.08;}
    return{aim,power,aimTolerance,powerTolerance};
  }
  const storageKey = `weightplay-${slug}-best-stage`;
  const state = { screen: "main", stage: 1, best: Number(localStorage.getItem(storageKey) || 0), raf: 0, last: 0, resultWin: null, game: {} };
  const common = (index) => window.wpMarketCommon?.(index) || ["Language", "Start Game", "Stages", "Back", "Back", "Retry", "Next Stage", "How to Play", "Best", "Stage", "Goal reached", "Try again", "Choose a stage", "Sound", "Shoot", "Reveal clue", "Up", "Left", "Down", "Right", "Lock blend", "Reset reserve"][index];
  const locale = () => window.WeightPlayMarketFiveLocale?.locale || "en";
  const formatCopy = (text, values = {}) => Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), text || "");
  function fitImage(image) {
    if (!image.complete || !image.naturalWidth) { ctx.fillStyle = "#0a2940"; ctx.fillRect(0, 0, 960, 540); return; }
    const scale = Math.max(960 / image.naturalWidth, 540 / image.naturalHeight);
    const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
    ctx.drawImage(image, (960 - w) / 2, (540 - h) / 2, w, h);
  }
  function drawAtlas(index, x, y, w, h, alpha = 1) {
    if (!atlas.complete || !atlas.naturalWidth) return;
    const cols = cfg.iconCols, rows = 2, col = index % cols, row = Math.floor(index / cols);
    const sw = atlas.naturalWidth / cols, sh = atlas.naturalHeight / rows;
    ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(atlas, col * sw, row * sh, sw, sh, x, y, w, h); ctx.restore();
  }
  function drawHero(x, y, w, h, alpha = 1) {
    if (!hero.complete || !hero.naturalWidth) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(hero, x, y, w, h); ctx.restore();
  }
  function setStatus(text) { $("battle-status").textContent = text; }
  function updateProgress() { $("main-progress").textContent = `${common(8)}: ${state.best} / ${cfg.stages}`; }
  function syncCanvasFit() {
    const host=canvas.parentElement;if(!host||state.screen!=="battle")return;
    const widthLimit=host.clientWidth,heightLimit=host.clientHeight;if(!widthLimit||!heightLimit)return;
    const ratio=16/9;let width=widthLimit,height=width/ratio;if(height>heightLimit){height=heightLimit;width=height*ratio;}
    canvas.style.setProperty("width",`${Math.floor(width*100)/100}px`,"important");canvas.style.setProperty("height",`${Math.floor(height*100)/100}px`,"important");
  }
  function show(name) {
    cancelAnimationFrame(state.raf); state.screen = name; document.body.dataset.screen = name === "result" ? "battle" : name;
    const result = $("result-screen");
    document.querySelectorAll(".screen").forEach((node) => {
      const on = node.id === "battle-screen" ? (name === "battle" || name === "result") : node.dataset.screen === name;
      node.hidden = !on; node.classList.toggle("active", on);
    });
    result.hidden = name !== "result";
    if (name === "battle") { state.last = performance.now(); requestAnimationFrame(syncCanvasFit); state.raf = requestAnimationFrame(frame); }
    window.dispatchEvent(new CustomEvent(name === "battle" ? "weightplay:battle-open" : "weightplay:shell-sync"));
  }
  function stageCards() {
    const unlocked = Math.min(cfg.stages, Math.max(1, state.best + 1));
    $("stage-list").innerHTML = Array.from({ length: cfg.stages }, (_, i) => {
      const n = i + 1, available = n <= unlocked;
      const detail=gameId==="animal-hoop-league"?`${hoopProfiles[i].badge} · ${window.WeightPlayMarketFiveLocale.game().courts[i]} · ${hoopProfiles[i].shots} 🏀`:gameId==="animal-habitat-atlas"?`${atlasProfiles[i].badge} · ${atlasProfiles[i].targets.length} 🧭`:gameId==="animal-moonlight-workshop"?`${workshopProfiles[i].badge} · ${workshopProfiles[i].switches.length} ✦ · ${workshopProfiles[i].limit} ↟`:gameId==="animal-chameleon-blend"?`${blendProfiles[i].badge} · ${blendProfiles[i].rounds} ◎ · ${blendProfiles[i].sequence}×`:gameId==="animal-habitat-builder"?`${builderProfiles[i].badge} · ${builderProfiles[i].need.reduce((sum,value)=>sum+value,0)} ◇ · ${builderProfiles[i].limit} ↟`:`${cfg.noun} ${n}`;
      return `<button class="m5-stage-card${n === unlocked ? " recommended" : ""}" data-stage="${n}" aria-disabled="${!available}" ${available ? "" : "disabled"}><span>${common(9)} ${n}</span><small>${available ? detail : "🔒"}</small></button>`;
    }).join("");
    $("stage-list").querySelectorAll("button:not(:disabled)").forEach((button) => button.addEventListener("click", () => start(Number(button.dataset.stage))));
    requestAnimationFrame(() => $("stage-list").querySelector(".recommended")?.scrollIntoView({ inline: "center", block: "nearest" }));
  }
  function start(stage) {
    state.stage = stage; state.resultWin = null; $("stage-label").textContent = `${common(9)} ${stage} / ${cfg.stages}${gameId==="animal-hoop-league"?` · ${window.WeightPlayMarketFiveLocale.game().courts[stage-1]}`:""}`;
    initGame(); if(gameId==="animal-hoop-league")setHoopBrief();else if(gameId==="animal-moonlight-workshop")setWorkshopBrief();else if(gameId==="animal-chameleon-blend")setBlendBrief();else if(gameId==="animal-habitat-builder")setBuilderBrief();else setStatus(window.WeightPlayMarketFiveLocale.game().guide); show("battle");
  }
  function finish(win, detail) {
    state.resultWin = win;
    if (win) { state.best = Math.max(state.best, state.stage); localStorage.setItem(storageKey, String(state.best)); }
    $("result-title").textContent = win ? common(10) : common(11);
    $("result-copy").textContent = detail;
    $("next").disabled = !win || state.stage >= cfg.stages;
    $("next").setAttribute("aria-disabled", String($("next").disabled));
    updateProgress(); show("result");
  }
  function initGame() {
    if (gameId === "animal-hoop-league") state.game = { aim: .42, power: 0, charging: false, shots: 0, score: 0, rival: 0, madeShots: 0, perfectShots: 0, lastTip: "", ball: null };
    if (gameId === "animal-habitat-atlas") state.game = { question: 0, stars: 0, clues: 1, target: atlasProfiles[state.stage-1].targets[0], feedback: 0 };
    if (gameId === "animal-moonlight-workshop") {
      const profile=workshopProfiles[state.stage-1];
      state.game = { x:profile.start[0], y:profile.start[1], switches:profile.switches.map(([x,y])=>({x,y,on:false})), key:{x:profile.key[0],y:profile.key[1],taken:false}, exit:{x:profile.exit[0],y:profile.exit[1]}, steps:0, limit:profile.limit, feedback:"" };
    }
    if (gameId === "animal-chameleon-blend") {const profile=blendProfiles[state.stage-1];state.game={round:1,wins:0,targets:makeBlendTargets(state.stage,1),previewIndex:0,entryIndex:0,color:-1,pattern:-1,phase:"preview",timer:profile.preview,lastCorrect:null};}
    if (gameId === "animal-habitat-builder") {
      const profile=builderProfiles[state.stage-1];state.game={grid:Array(20).fill(-1),selected:0,need:profile.need,counts:[0,0,0,0],moves:0,limit:profile.limit,feedback:""};
    }
    buildControls(); updateHud(); draw();
  }
  function escapeAttribute(value) { return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;"); }
  function control(label, action, className = "", ariaLabel = "") { return `<button type="button" data-action="${action}" class="${className}"${ariaLabel?` aria-label="${escapeAttribute(ariaLabel)}"`:""}>${label}</button>`; }
  function buildControls() {
    const host = $("battle-controls");
    if (gameId === "animal-hoop-league") host.innerHTML = control("◀", "aim-left", "", common(17)) + control(common(14), "shoot", "primary-control", common(14)) + control("▶", "aim-right", "", common(19));
    if (gameId === "animal-habitat-atlas") {const regions=window.WeightPlayMarketFiveLocale.game().regions;host.innerHTML = control("✦", "clue", "primary-control",common(15)) + ["🌊", "❄️", "🏜️", "🌳"].map((x,i)=>control(x,`region-${i}`,"",regions[i])).join("");}
    if (gameId === "animal-moonlight-workshop") host.innerHTML = control("↑", "move-up", "", common(16)) + control("←", "move-left", "", common(17)) + control("↓", "move-down", "", common(18)) + control("→", "move-right", "", common(19));
    if (gameId === "animal-chameleon-blend") {const text=window.WeightPlayMarketFiveLocale.game();host.innerHTML=["●","◆","▲"].map((x,i)=>control(x,`color-${i}`,`blend-color blend-color-${i}`,text.colors[i])).join("")+["🍃","🌸","🌊"].map((x,i)=>control(x,`pattern-${i}`,"",text.patterns[i])).join("")+control(common(20),"lock","primary-control");}
    if (gameId === "animal-habitat-builder") {const tiles=window.WeightPlayMarketFiveLocale.game().tiles;host.innerHTML=["💧","🌿","🌲","🪨"].map((x,i)=>control(x,`tile-${i}`,i===0?"selected":"",tiles[i])).join("")+control("↺","reset","",common(21));}
    host.querySelectorAll("button").forEach((button) => {
      const action = button.dataset.action;
      if (action === "shoot") {
        const beginCharge = () => { if (state.screen!=="battle"||state.game.ball||state.game.charging)return;state.game.charging=true;state.game.power=0; };
        button.addEventListener("pointerdown", (e) => { e.preventDefault(); beginCharge(); button.setPointerCapture?.(e.pointerId); });
        ["pointerup","pointercancel","lostpointercapture"].forEach((type) => button.addEventListener(type, () => { if (state.game.charging) releaseShot(); }));
        button.addEventListener("keydown", (event) => { if ((event.key===" "||event.key==="Enter")&&!event.repeat){event.preventDefault();beginCharge();} });
        button.addEventListener("keyup", (event) => { if ((event.key===" "||event.key==="Enter")&&state.game.charging){event.preventDefault();releaseShot();} });
        button.addEventListener("blur", () => { if(state.game.charging){state.game.charging=false;state.game.power=0;draw();} });
      } else button.addEventListener("click", () => act(action));
    });
  }
  function act(action) {
    if (state.screen !== "battle") return;
    if (gameId === "animal-hoop-league") { if (action === "aim-left") state.game.aim = Math.max(.12,state.game.aim-.06); if (action === "aim-right") state.game.aim = Math.min(.88,state.game.aim+.06); }
    if (gameId === "animal-habitat-atlas") atlasAct(action);
    if (gameId === "animal-moonlight-workshop") workshopAct(action);
    if (gameId === "animal-chameleon-blend") blendAct(action);
    if (gameId === "animal-habitat-builder") builderAct(action);
    updateHud(); draw();
  }
  function releaseShot() {
    const g=state.game; g.charging=false; if(g.ball) return;const profile=hoopProfiles[state.stage-1],shot=g.shots+1,challenge=hoopChallenge(shot),copy=window.WeightPlayMarketFiveLocale.game().hoop;g.shots=shot;
    const aimDelta=(g.aim-challenge.aim)/challenge.aimTolerance,powerDelta=(g.power-challenge.power)/challenge.powerTolerance,aimError=Math.abs(aimDelta),powerError=Math.abs(powerDelta);
    const made=aimError<=1&&powerError<=1,perfect=made&&aimError<=.34&&powerError<=.4,points=perfect?profile.perfect:made?1:0;if(made){g.score+=points;g.madeShots++;}if(perfect)g.perfectShots++;
    if(g.shots%2===0)g.rival+=profile.rival[Math.floor(g.shots/2)-1]||0;
    const aimTip=aimError<=.34?copy.aimSet:aimDelta<0?copy.aimRight:copy.aimLeft,powerTip=powerError<=.4?copy.powerSet:powerDelta<0?copy.holdLonger:copy.releaseEarlier;g.lastTip=`${aimTip} · ${powerTip}`;
    g.ball={t:0,made,perfect,aimDelta,powerDelta,releasePower:g.power};setStatus(`${perfect?copy.perfect:made?copy.made:copy.missed}${points?` · +${points}`:""} · ${g.lastTip}`);updateHud();
  }
  function setHoopBrief(){const g=state.game,profile=hoopProfiles[state.stage-1],text=window.WeightPlayMarketFiveLocale.game(),challenge=hoopChallenge(Math.min(profile.shots,g.shots+1)),brief=`${profile.badge} ${text.courts[state.stage-1]} · ${Math.min(profile.shots,g.shots+1)}/${profile.shots} · 🎯 ${Math.round(challenge.aim*100)} · ⚡ ${Math.round(challenge.power*100)}`;setStatus(brief);canvas.setAttribute("aria-label",`${text.title} · ${brief}`);}
  function hoopResult(){const g=state.game,profile=hoopProfiles[state.stage-1],copy=window.WeightPlayMarketFiveLocale.game().hoop,summary=`${g.score} — ${g.rival} · ${formatCopy(copy.madeCount,{made:g.madeShots,shots:profile.shots})} · ${formatCopy(copy.perfectCount,{perfect:g.perfectShots})}`;return g.score>g.rival||!g.lastTip?summary:`${summary} · ${copy.nextShot}: ${g.lastTip}`;}
  function atlasAct(action) {
    const g=state.game; if(g.feedback>0)return;
    if(action==="clue"){g.clues=Math.min(3,g.clues+1);return;}
    if(!action.startsWith("region-"))return; const pick=Number(action.slice(-1));
    if(pick===g.target)g.stars+=4-g.clues; g.feedback=1.1; g.lastCorrect=pick===g.target;
  }
  function workshopAct(action) {
    const g=state.game,profile=workshopProfiles[state.stage-1],delta={"move-up":[0,-1],"move-down":[0,1],"move-left":[-1,0],"move-right":[1,0]}[action]; if(!delta)return;
    g.feedback="";
    if(!workshopStep(delta[0],delta[1],profile)){g.feedback="⛔";setWorkshopBrief();return;}
    let coast=0;
    while(workshopHas(profile.ice,g.x,g.y)&&coast<8){if(!workshopStep(delta[0],delta[1],profile))break;coast++;}
    const lit=g.switches.filter(s=>s.on).length;
    if(lit===g.switches.length&&g.x===g.key.x&&g.y===g.key.y)g.key.taken=true;
    setWorkshopBrief();
    if(g.key.taken&&g.x===g.exit.x&&g.y===g.exit.y)finish(true,`${g.steps} ↟ · ${g.switches.length}/${g.switches.length} ✦`);
    else if(g.steps>=g.limit)finish(false,`${g.steps} / ${g.limit} ↟`);
  }
  function workshopHas(cells,x,y){return cells?.some(cell=>cell[0]===x&&cell[1]===y);}
  function workshopGate(profile,x,y){return profile.gates?.find(gate=>gate.x===x&&gate.y===y);}
  function workshopStep(dx,dy,profile){
    const g=state.game,nx=g.x+dx,ny=g.y+dy,lit=g.switches.filter(s=>s.on).length,gate=workshopGate(profile,nx,ny);
    if(nx<0||nx>7||ny<0||ny>4||workshopHas(profile.walls,nx,ny)||(gate&&lit<gate.needs))return false;
    g.x=nx;g.y=ny;g.steps++;workshopEnter(profile);
    return true;
  }
  function workshopEnter(profile){
    const g=state.game,switchIndex=g.switches.findIndex(s=>s.x===g.x&&s.y===g.y);
    if(switchIndex>=0&&!g.switches[switchIndex].on){
      const next=g.switches.findIndex(s=>!s.on);
      if(!profile.ordered||switchIndex===next)g.switches[switchIndex].on=true;else g.feedback=`${next+1} →`;
    }
    const portal=profile.portals?.find(pair=>workshopHas(pair,g.x,g.y));
    if(portal){const destination=portal.find(cell=>cell[0]!==g.x||cell[1]!==g.y);g.x=destination[0];g.y=destination[1];const landed=g.switches.findIndex(s=>s.x===g.x&&s.y===g.y);if(landed>=0&&!g.switches[landed].on)g.switches[landed].on=true;}
  }
  function setWorkshopBrief(){const g=state.game,profile=workshopProfiles[state.stage-1],lit=g.switches.filter(s=>s.on).length,brief=`${profile.badge} · ✦ ${lit}/${g.switches.length} · 🔑 ${g.key.taken?"✓":lit===g.switches.length?"!":"○"} · ↟ ${g.steps}/${g.limit}${g.feedback?` · ${g.feedback}`:""}`;setStatus(brief);canvas.setAttribute("aria-label",`${window.WeightPlayMarketFiveLocale.game().title} · ${brief}`);}
  function blendAct(action) {
    const g=state.game,profile=blendProfiles[state.stage-1];if(g.phase!=="choose")return;
    if(action.startsWith("color-"))g.color=Number(action.slice(-1));
    if(action.startsWith("pattern-"))g.pattern=Number(action.slice(-1));
    if(action==="lock"&&g.color>=0&&g.pattern>=0){
      const answers=profile.reverse?[...g.targets].reverse():g.targets,expected=answers[g.entryIndex],correct=g.color===expected.color&&g.pattern===expected.pattern;
      if(correct){g.entryIndex++;if(g.entryIndex>=answers.length){g.wins++;g.lastCorrect=true;g.phase="scan";g.timer=1.25;}else{g.color=-1;g.pattern=-1;}}
      else{g.lastCorrect=false;g.phase="scan";g.timer=1.25;}
    }
    document.querySelectorAll("[data-action^='color-'],[data-action^='pattern-']").forEach(b=>{const i=Number(b.dataset.action.slice(-1));b.classList.toggle("selected",(b.dataset.action.startsWith("color-")?g.color:g.pattern)===i);});
    setBlendBrief();
  }
  function setBlendBrief(){const g=state.game,profile=blendProfiles[state.stage-1],phase=g.phase==="preview"?`👁 ${g.previewIndex+1}/${profile.sequence}`:g.phase==="choose"?`🎨 ${g.entryIndex+1}/${profile.sequence}`:`🔦 ${g.lastCorrect?"✓":"×"}`,brief=`${profile.badge} · ${g.round}/${profile.rounds} ◎ · ${phase} · ${g.wins}/${profile.need} ✓`;setStatus(brief);canvas.setAttribute("aria-label",`${window.WeightPlayMarketFiveLocale.game().title} · ${brief}`);}
  function builderAct(action) {
    const g=state.game;
    if(action.startsWith("tile-")){g.selected=Number(action.slice(-1));g.feedback="";document.querySelectorAll("[data-action^='tile-']").forEach(b=>b.classList.toggle("selected",Number(b.dataset.action.slice(-1))===g.selected));}
    if(action==="reset"){g.grid.fill(-1);g.counts.fill(0);g.moves=0;g.feedback="↺";}
    setBuilderBrief();
  }
  function placeBuilder(event) {
    if(gameId!=="animal-habitat-builder"||state.screen!=="battle")return;
    const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*960/rect.width,y=(event.clientY-rect.top)*540/rect.height;
    const col=Math.floor((x-250)/92),row=Math.floor((y-90)/92);if(col<0||col>4||row<0||row>3)return;
    const g=state.game,profile=builderProfiles[state.stage-1],index=row*5+col;if(profile.blocked?.includes(index)){g.feedback="⛔";setBuilderBrief();draw();return;}if(g.grid[index]===g.selected){g.feedback="↺";setBuilderBrief();draw();return;}
    if(g.grid[index]>=0)g.counts[g.grid[index]]--;g.grid[index]=g.selected;g.counts[g.selected]++;g.moves++;g.feedback="";const checks=builderChecks(profile,g);setBuilderBrief();updateHud();
    if(checks.every(check=>check.pass))finish(true,`${g.moves} ◇ · ${checks.length}/${checks.length} ✓`);else if(g.moves>=g.limit)finish(false,`${g.moves}/${g.limit} ↟ · ${checks.filter(check=>check.pass).length}/${checks.length} ✓`);else draw();
  }
  function builderNeighbors(index){const x=index%5,y=Math.floor(index/5),neighbors=[];if(x>0)neighbors.push(index-1);if(x<4)neighbors.push(index+1);if(y>0)neighbors.push(index-5);if(y<3)neighbors.push(index+5);return neighbors;}
  function builderConnected(g,type,required){const cells=g.grid.map((value,index)=>value===type?index:-1).filter(index=>index>=0);if(cells.length<required)return false;const remaining=new Set(cells),queue=[cells[0]];remaining.delete(cells[0]);while(queue.length){for(const neighbor of builderNeighbors(queue.shift()))if(remaining.delete(neighbor))queue.push(neighbor);}return remaining.size===0;}
  function builderChecks(profile,g){
    const checks=[{icon:"Σ",pass:g.need.every((need,index)=>g.counts[index]>=need)}];
    if(profile.waterConnected)checks.push({icon:"💧⛓",pass:builderConnected(g,0,g.need[0])});
    if(profile.waterSpan){const water=g.grid.map((value,index)=>value===0?index:-1).filter(index=>index>=0);checks.push({icon:"⇆💧",pass:builderConnected(g,0,g.need[0])&&water.some(index=>index%5===0)&&water.some(index=>index%5===4)});}
    if(profile.edgeForest)checks.push({icon:"🌲◫",pass:g.grid.filter((value,index)=>value===2&&(index%5===0||index%5===4||index<5||index>=15)).length>=profile.edgeForest});
    if(profile.forestConnected)checks.push({icon:"🌲⛓",pass:builderConnected(g,2,g.need[2])});
    if(profile.shelterForest){const shelters=g.grid.map((value,index)=>value===3?index:-1).filter(index=>index>=0);checks.push({icon:"🪨↔🌲",pass:shelters.length>=g.need[3]&&shelters.every(index=>builderNeighbors(index).some(neighbor=>g.grid[neighbor]===2))});}
    if(profile.meadowWater){const meadows=g.grid.map((value,index)=>value===1?index:-1).filter(index=>index>=0);checks.push({icon:"🌿↔💧",pass:meadows.filter(index=>builderNeighbors(index).some(neighbor=>g.grid[neighbor]===0)).length>=profile.meadowWater});}
    return checks;
  }
  function setBuilderBrief(){const g=state.game,profile=builderProfiles[state.stage-1],checks=builderChecks(profile,g),brief=`${profile.badge} · ${checks.map(check=>`${check.icon}${check.pass?"✓":"○"}`).join(" · ")} · ◇ ${g.moves}/${g.limit}${g.feedback?` · ${g.feedback}`:""}`;setStatus(brief);canvas.setAttribute("aria-label",`${window.WeightPlayMarketFiveLocale.game().title} · ${brief}`);}
  function update(dt) {
    const g=state.game;
    if(gameId==="animal-hoop-league"){
      const profile=hoopProfiles[state.stage-1];if(g.charging)g.power=(g.power+dt*.012*profile.charge)%1;if(g.ball){g.ball.t+=dt*.018;if(g.ball.t>=1){g.ball=null;if(g.shots>=profile.shots)finish(g.score>g.rival,hoopResult());else setHoopBrief();}}
    }
    if(gameId==="animal-habitat-atlas"&&g.feedback>0){g.feedback-=dt/60;if(g.feedback<=0){const profile=atlasProfiles[state.stage-1];g.question++;if(g.question>=profile.targets.length)finish(g.stars>=profile.pass,`${g.stars} / ${profile.targets.length*3} ✦`);else{g.target=profile.targets[g.question];g.clues=1;}}}
    if(gameId==="animal-chameleon-blend"){
      const profile=blendProfiles[state.stage-1];g.timer-=dt/60;
      if(g.timer<=0&&g.phase==="preview"){if(g.previewIndex<g.targets.length-1){g.previewIndex++;g.timer=profile.preview;}else{g.phase="choose";g.entryIndex=0;g.timer=profile.choose;}setBlendBrief();}
      else if(g.timer<=0&&g.phase==="choose"){g.lastCorrect=false;g.phase="scan";g.timer=1.25;setBlendBrief();}
      else if(g.timer<=0&&g.phase==="scan"){g.round++;if(g.round>profile.rounds)finish(g.wins>=profile.need,`${g.wins} / ${profile.rounds} ✓`);else{g.targets=makeBlendTargets(state.stage,g.round);g.previewIndex=0;g.entryIndex=0;g.color=-1;g.pattern=-1;g.phase="preview";g.timer=profile.preview;g.lastCorrect=null;document.querySelectorAll("[data-action^='color-'],[data-action^='pattern-']").forEach(button=>button.classList.remove("selected"));setBlendBrief();}}
    }
  }
  function updateHud(){
    const g=state.game;
    if(gameId==="animal-hoop-league")$("score-label").textContent=`${g.score} — ${g.rival} · ${g.shots}/${hoopProfiles[state.stage-1].shots}`;
    if(gameId==="animal-habitat-atlas")$("score-label").textContent=`${g.question+1}/${atlasProfiles[state.stage-1].targets.length} · ${g.stars} ✦`;
    if(gameId==="animal-moonlight-workshop")$("score-label").textContent=`${g.steps}/${g.limit} · ${g.switches.filter(s=>s.on).length}/${g.switches.length}`;
    if(gameId==="animal-chameleon-blend")$("score-label").textContent=`${g.round}/${blendProfiles[state.stage-1].rounds} · ${g.wins}/${blendProfiles[state.stage-1].need} ✓`;
    if(gameId==="animal-habitat-builder"){const checks=builderChecks(builderProfiles[state.stage-1],g);$("score-label").textContent=`${g.moves}/${g.limit} · ${checks.filter(check=>check.pass).length}/${checks.length} ✓`;}
  }
  function draw(){
    if(state.screen!=="battle")return;
    ctx.clearRect(0,0,960,540);fitImage(background);ctx.fillStyle="#06152255";ctx.fillRect(0,0,960,540);
    ({"animal-hoop-league":drawHoop,"animal-habitat-atlas":drawAtlasGame,"animal-moonlight-workshop":drawWorkshop,"animal-chameleon-blend":drawBlend,"animal-habitat-builder":drawBuilder})[gameId]();
  }
  function drawHoop(){const g=state.game,challenge=hoopChallenge(Math.min(hoopProfiles[state.stage-1].shots,g.shots+1)),x=345,w=360;drawHero(65,205,245,310);ctx.strokeStyle="#ffe79a";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(278,330);ctx.quadraticCurveTo(460,70+g.aim*120,690,280);ctx.stroke();ctx.fillStyle="#10283ce8";ctx.fillRect(x,426,w,20);ctx.fillStyle="#ffd166";ctx.fillRect(x+w*(challenge.aim-challenge.aimTolerance),426,w*challenge.aimTolerance*2,20);ctx.fillStyle="#eafcff";ctx.fillRect(x+w*g.aim-3,421,6,30);ctx.fillStyle="#10283ce8";ctx.fillRect(x,470,w,24);ctx.fillStyle="#ffd166";ctx.fillRect(x+w*(challenge.power-challenge.powerTolerance),470,w*challenge.powerTolerance*2,24);ctx.fillStyle="#6be2dc";ctx.fillRect(x,470,w*g.power,24);ctx.font="bold 23px system-ui";ctx.fillStyle="#f5fbff";ctx.fillText("🎯",305,444);ctx.fillText("⚡",305,491);if(g.ball){const t=Math.min(1,g.ball.t),aimMiss=Math.max(-1.6,Math.min(1.6,g.ball.aimDelta)),powerMiss=Math.max(-1.6,Math.min(1.6,g.ball.powerDelta)),endX=g.ball.made?690:690+aimMiss*74,endY=g.ball.made?280:280-powerMiss*62+Math.abs(aimMiss)*12,arc=190+Math.min(1,g.ball.releasePower)*165,bx=278+(endX-278)*t,by=330+(endY-330)*t-arc*Math.sin(Math.PI*t);if(g.ball.perfect&&t>.62){ctx.strokeStyle=`rgba(255,231,154,${(t-.62)*2})`;ctx.lineWidth=9;ctx.beginPath();ctx.arc(690,280,42-(t-.62)*18,0,Math.PI*2);ctx.stroke();drawAtlas(1,642,232,96,96,Math.min(1,(t-.62)*2.6));}drawAtlas(0,bx-34,by-34,68,68);}}
  function drawAtlasGame(){const g=state.game,plan=atlasCluePlan();drawHero(32,280,180,220);const boxes=[[235,90],[595,90],[235,305],[595,305]];boxes.forEach(([x,y],i)=>{ctx.fillStyle=i===g.target&&g.feedback>0?"#ffd166cc":"#071b2dcc";ctx.fillRect(x,y,250,150);drawAtlas(i,x+82,y+8,86,86);ctx.font="bold 24px system-ui";ctx.fillStyle="#f7fbff";ctx.textAlign="center";ctx.fillText(habitatTraits[i].join("  "),x+125,y+128);ctx.strokeStyle="#8de7ee";ctx.lineWidth=3;ctx.strokeRect(x,y,250,150);});ctx.textAlign="start";for(let i=0;i<g.clues;i++){const type=plan[i],x=438+i*56;if(type===3)drawAtlas(4+g.target,x,242,50,50);else{ctx.fillStyle="#0b2438e8";ctx.fillRect(x,242,50,50);ctx.font="bold 30px system-ui";ctx.fillStyle="#ffe7a3";ctx.textAlign="center";ctx.fillText(habitatTraits[g.target][type],x+25,278);ctx.textAlign="start";}}if(g.feedback>0){ctx.font="bold 74px system-ui";ctx.fillStyle=g.lastCorrect?"#8cf0b4":"#ff8580";ctx.fillText(g.lastCorrect?"✓":"×",455,300);}}
  function drawWorkshop(){const g=state.game,profile=workshopProfiles[state.stage-1],ox=175,oy=72,cw=92,ch=86,lit=g.switches.filter(s=>s.on).length;ctx.fillStyle="#071b2dbb";ctx.fillRect(ox,oy,cw*8,ch*5);ctx.strokeStyle="#6694a877";for(let x=0;x<=8;x++){ctx.beginPath();ctx.moveTo(ox+x*cw,oy);ctx.lineTo(ox+x*cw,oy+ch*5);ctx.stroke()}for(let y=0;y<=5;y++){ctx.beginPath();ctx.moveTo(ox,oy+y*ch);ctx.lineTo(ox+cw*8,oy+y*ch);ctx.stroke()}profile.ice?.forEach(([x,y])=>{ctx.fillStyle="#8de7ee55";ctx.fillRect(ox+x*cw+4,oy+y*ch+4,cw-8,ch-8);ctx.font="bold 25px system-ui";ctx.fillStyle="#d7fbff";ctx.fillText("❄",ox+x*cw+32,oy+y*ch+52);});profile.portals?.forEach((pair,index)=>pair.forEach(([x,y])=>{ctx.strokeStyle="#d9a7ff";ctx.lineWidth=7;ctx.beginPath();ctx.arc(ox+x*cw+cw/2,oy+y*ch+ch/2,25,0,Math.PI*2);ctx.stroke();ctx.font="bold 22px system-ui";ctx.fillStyle="#f4ddff";ctx.fillText(String.fromCharCode(65+index),ox+x*cw+38,oy+y*ch+51);}));profile.walls?.forEach(([x,y])=>{ctx.fillStyle="#07121eee";ctx.fillRect(ox+x*cw+3,oy+y*ch+3,cw-6,ch-6);ctx.font="bold 28px system-ui";ctx.fillStyle="#607b8d";ctx.fillText("⚙",ox+x*cw+30,oy+y*ch+53);});profile.gates?.forEach(gate=>{const open=lit>=gate.needs;ctx.fillStyle=open?"#61dfa655":"#ffbd5955";ctx.fillRect(ox+gate.x*cw+9,oy+gate.y*ch+9,cw-18,ch-18);ctx.strokeStyle=open?"#7cf5b6":"#ffc766";ctx.lineWidth=5;ctx.strokeRect(ox+gate.x*cw+9,oy+gate.y*ch+9,cw-18,ch-18);ctx.font="bold 22px system-ui";ctx.fillStyle="#fff3cf";ctx.fillText(`${gate.needs}✦`,ox+gate.x*cw+26,oy+gate.y*ch+52);});g.switches.forEach((s,i)=>{drawAtlas(1+(i%3),ox+s.x*cw+22,oy+s.y*ch+20,48,48,s.on?1:.45);if(profile.ordered){ctx.fillStyle="#fff4bf";ctx.font="bold 19px system-ui";ctx.fillText(String(i+1),ox+s.x*cw+61,oy+s.y*ch+24);}});if(g.switches.every(s=>s.on)&&!g.key.taken)drawAtlas(0,ox+g.key.x*cw+18,oy+g.key.y*ch+16,56,56);drawAtlas(g.key.taken?5:4,ox+g.exit.x*cw+15,oy+g.exit.y*ch+12,62,62);drawHero(ox+g.x*cw+9,oy+g.y*ch+4,74,78);}
  function drawBlend(){const g=state.game,profile=blendProfiles[state.stage-1],colors=["#55bd69","#ff746f","#4daee9"],shapes=["●","◆","▲"],patternIcons=["🍃","🌸","🌊"],target=g.targets[g.previewIndex],order=profile.shuffle?blendPatternOrders[(state.stage+g.round)%blendPatternOrders.length]:[0,1,2];ctx.fillStyle="#08192cb0";ctx.fillRect(60,65,840,405);order.forEach((pattern,slot)=>{const x=100+slot*280,active=g.phase==="preview"&&pattern===target.pattern;drawAtlas(1+pattern,x,105,220,220,active?1:.42);if(active){ctx.strokeStyle=colors[target.color];ctx.lineWidth=10;ctx.strokeRect(x,105,220,220);ctx.font="bold 62px system-ui";ctx.fillStyle=colors[target.color];ctx.textAlign="center";ctx.fillText(shapes[target.color],x+110,365);ctx.font="bold 28px system-ui";ctx.fillStyle="#fff5c9";ctx.fillText(`${g.previewIndex+1} / ${profile.sequence}`,x+110,92);}});ctx.textAlign="start";const visible=g.phase!=="preview";drawAtlas(0,405,250,150,150,visible?1:.22);if(visible&&g.color>=0){ctx.globalCompositeOperation="source-atop";ctx.fillStyle=`${colors[g.color]}bb`;ctx.fillRect(405,250,150,150);ctx.globalCompositeOperation="source-over";ctx.font="bold 44px system-ui";ctx.fillStyle="#fff";ctx.fillText(shapes[g.color],520,286);}if(visible&&g.pattern>=0){drawAtlas(1+g.pattern,565,285,88,88);ctx.font="bold 28px system-ui";ctx.fillStyle="#fff";ctx.fillText(patternIcons[g.pattern],595,397);}if(g.phase==="choose"){ctx.font="bold 27px system-ui";ctx.fillStyle="#ffe7a3";ctx.textAlign="center";ctx.fillText(profile.reverse?`↤ ${g.entryIndex+1} / ${profile.sequence}`:`${g.entryIndex+1} / ${profile.sequence} ↦`,480,445);ctx.textAlign="start";}if(g.phase==="scan"){const x=60+840*(1-g.timer/1.25),grad=ctx.createLinearGradient(x-120,0,x+120,0);grad.addColorStop(0,"transparent");grad.addColorStop(.5,"#ffe08a88");grad.addColorStop(1,"transparent");ctx.fillStyle=grad;ctx.fillRect(x-120,65,240,405);ctx.font="bold 74px system-ui";ctx.fillStyle=g.lastCorrect?"#8cf0b4":"#ff8580";ctx.fillText(g.lastCorrect?"✓":"×",455,300);}}
  function drawBuilder(){
    const g=state.game,profile=builderProfiles[state.stage-1],checks=builderChecks(profile,g),ox=250,oy=90,size=92;
    ctx.fillStyle="#102d3dbd";ctx.fillRect(60,80,150,360);
    for(let i=0;i<4;i++){drawAtlas(i,75,95+i*82,60,60);ctx.fillStyle=g.counts[i]>=g.need[i]?"#8cf0b4":"#f7fbff";ctx.font="bold 20px system-ui";ctx.fillText(`${g.counts[i]} / ${g.need[i]}`,140,132+i*82);}
    for(let row=0;row<4;row++)for(let col=0;col<5;col++){
      const i=row*5+col,x=ox+col*size,y=oy+row*size;ctx.fillStyle="#17384dbb";ctx.fillRect(x,y,size-5,size-5);ctx.strokeStyle="#8bdce466";ctx.lineWidth=2;ctx.strokeRect(x,y,size-5,size-5);
      if(profile.blocked?.includes(i)){ctx.fillStyle="#07121eee";ctx.fillRect(x+4,y+4,size-13,size-13);ctx.font="bold 34px system-ui";ctx.fillStyle="#718899";ctx.fillText("✕",x+31,y+54);continue;}
      if(g.grid[i]>=0){
        drawAtlas(g.grid[i],x+8,y+8,size-21,size-21);let valid=true;
        if(profile.shelterForest&&g.grid[i]===3)valid=builderNeighbors(i).some(neighbor=>g.grid[neighbor]===2);
        if(profile.meadowWater&&g.grid[i]===1)valid=builderNeighbors(i).some(neighbor=>g.grid[neighbor]===0);
        if((profile.shelterForest&&g.grid[i]===3)||(profile.meadowWater&&g.grid[i]===1)){ctx.strokeStyle=valid?"#76edab":"#ff8b80";ctx.lineWidth=5;ctx.strokeRect(x+5,y+5,size-15,size-15);}
        if(profile.edgeForest&&g.grid[i]===2&&(col===0||col===4||row===0||row===3)){ctx.strokeStyle="#ffd166";ctx.lineWidth=5;ctx.strokeRect(x+5,y+5,size-15,size-15);}
      }
    }
    if(profile.waterSpan){ctx.font="bold 34px system-ui";ctx.fillStyle="#76e5f0";ctx.fillText("→",215,285);ctx.fillText("→",716,285);}
    ctx.font="bold 22px system-ui";checks.forEach((check,index)=>{const x=240+index*105;ctx.fillStyle=check.pass?"#8cf0b4":"#c6d9e8";ctx.fillText(`${check.icon} ${check.pass?"✓":"○"}`,x,500);});drawHero(730,300,180,205);
  }
  function frame(now){if(state.screen!=="battle")return;const dt=Math.min(2,(now-state.last)/16.67);state.last=now;update(dt);if(state.screen==="battle"){updateHud();draw();state.raf=requestAnimationFrame(frame);}}
  canvas.addEventListener("pointerup",placeBuilder);
  window.addEventListener("keydown",(event)=>{const map={ArrowUp:"move-up",ArrowDown:"move-down",ArrowLeft:"move-left",ArrowRight:"move-right",w:"move-up",W:"move-up",a:"move-left",A:"move-left",s:"move-down",S:"move-down",d:"move-right",D:"move-right"};if(gameId==="animal-moonlight-workshop"&&map[event.key]){event.preventDefault();act(map[event.key]);}});
  window.addEventListener("resize",()=>requestAnimationFrame(syncCanvasFit),{passive:true});
  new ResizeObserver(()=>requestAnimationFrame(syncCanvasFit)).observe(canvas.parentElement);
  $("start-game").addEventListener("click",()=>{stageCards();show("stage");});
  $("stage-back").addEventListener("click",()=>show("main"));
  $("battle-back").addEventListener("click",()=>{if(window.confirm(common(4)+"?")){stageCards();show("stage");}});
  $("to-stages").addEventListener("click",()=>{stageCards();show("stage");});
  $("retry").addEventListener("click",()=>start(state.stage));
  $("next").addEventListener("click",()=>{if(state.resultWin&&state.stage<cfg.stages)start(state.stage+1);});
  window.addEventListener("weightplay:market-locale-change",()=>{updateProgress();stageCards();if(state.screen==="battle"){if(gameId==="animal-hoop-league"){buildControls();setHoopBrief();}else if(gameId==="animal-moonlight-workshop"){buildControls();setWorkshopBrief();}else if(gameId==="animal-chameleon-blend"){buildControls();setBlendBrief();}else if(gameId==="animal-habitat-builder"){buildControls();setBuilderBrief();}else{if(gameId==="animal-habitat-atlas")buildControls();setStatus(window.WeightPlayMarketFiveLocale.game().guide);}}});
  [background,atlas,hero].forEach(image=>image.addEventListener("load",draw));
  updateProgress();stageCards();show("main");draw();
  const hideLoading=()=>{$("loadingPanel")?.classList.add("hidden");$("loadingPanel")?.setAttribute("hidden","");};
  if(document.readyState==="complete")hideLoading();else window.addEventListener("load",hideLoading,{once:true});
})();
