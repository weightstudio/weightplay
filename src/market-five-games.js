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
  const storageKey = `weightplay-${slug}-best-stage`;
  const state = { screen: "main", stage: 1, best: Number(localStorage.getItem(storageKey) || 0), raf: 0, last: 0, resultWin: null, game: {} };
  const common = (index) => window.wpMarketCommon?.(index) || ["Language", "Start Game", "Stages", "Back", "Back", "Retry", "Next Stage", "How to Play", "Best", "Stage", "Goal reached", "Try again", "Choose a stage"][index];
  const locale = () => window.WeightPlayMarketFiveLocale?.locale || "en";
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
      return `<button class="m5-stage-card${n === unlocked ? " recommended" : ""}" data-stage="${n}" aria-disabled="${!available}" ${available ? "" : "disabled"}><span>${common(9)} ${n}</span><small>${available ? `${cfg.noun} ${n}` : "🔒"}</small></button>`;
    }).join("");
    $("stage-list").querySelectorAll("button:not(:disabled)").forEach((button) => button.addEventListener("click", () => start(Number(button.dataset.stage))));
    requestAnimationFrame(() => $("stage-list").querySelector(".recommended")?.scrollIntoView({ inline: "center", block: "nearest" }));
  }
  function start(stage) {
    state.stage = stage; state.resultWin = null; $("stage-label").textContent = `${common(9)} ${stage} / ${cfg.stages}`;
    initGame(); setStatus(window.WeightPlayMarketFiveLocale.game().guide); show("battle");
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
    if (gameId === "animal-hoop-league") state.game = { aim: .42, aimDir: 1, power: 0, charging: false, shots: 0, score: 0, rival: 0, ball: null };
    if (gameId === "animal-habitat-atlas") state.game = { question: 0, stars: 0, clues: 1, target: (state.stage * 3) % 4, feedback: 0 };
    if (gameId === "animal-moonlight-workshop") {
      const layouts = [[[2,1],[4,3]],[[1,3],[5,1]],[[2,3],[4,1],[6,3]],[[1,1],[3,3],[6,1]],[[2,1],[2,3],[5,2]],[[1,3],[3,1],[5,3],[6,1]]];
      state.game = { x: 0, y: 2, switches: layouts[state.stage - 1].map(([x,y]) => ({x,y,on:false})), key: {x:5,y:1,taken:false}, exit:{x:7,y:2}, steps:0, limit:34 + state.stage * 3 };
    }
    if (gameId === "animal-chameleon-blend") state.game = { round: 1, wins: 0, targetColor: state.stage % 3, targetPattern: (state.stage + 1) % 3, color: -1, pattern: -1, phase: "preview", timer: 2.8 };
    if (gameId === "animal-habitat-builder") {
      const need = [[2,2,1,1],[2,2,2,1],[3,2,2,1],[3,3,2,2],[3,3,3,2],[4,3,3,2]][state.stage - 1];
      state.game = { grid: Array(20).fill(-1), selected: 0, need, counts:[0,0,0,0], moves:0, limit: 9 + state.stage };
    }
    buildControls(); updateHud(); draw();
  }
  function control(label, action, className = "") { return `<button type="button" data-action="${action}" class="${className}">${label}</button>`; }
  function buildControls() {
    const host = $("battle-controls");
    if (gameId === "animal-hoop-league") host.innerHTML = control("◀", "aim-left") + control("SHOOT", "shoot", "primary-control") + control("▶", "aim-right");
    if (gameId === "animal-habitat-atlas") host.innerHTML = control("✦", "clue", "primary-control") + ["🌊", "❄️", "🏜️", "🌳"].map((x,i)=>control(x,`region-${i}`)).join("");
    if (gameId === "animal-moonlight-workshop") host.innerHTML = control("↑", "move-up") + control("←", "move-left") + control("↓", "move-down") + control("→", "move-right");
    if (gameId === "animal-chameleon-blend") host.innerHTML = ["●", "●", "●"].map((x,i)=>control(x,`color-${i}`)).join("") + ["🍃", "🌸", "🌊"].map((x,i)=>control(x,`pattern-${i}`)).join("") + control("LOCK", "lock", "primary-control");
    if (gameId === "animal-habitat-builder") host.innerHTML = ["💧", "🌿", "🌲", "🪨"].map((x,i)=>control(x,`tile-${i}`,i===0?"selected":"")).join("") + control("RESET", "reset");
    host.querySelectorAll("button").forEach((button) => {
      const action = button.dataset.action;
      if (action === "shoot") {
        button.addEventListener("pointerdown", (e) => { e.preventDefault(); state.game.charging = true; state.game.power = 0; button.setPointerCapture?.(e.pointerId); });
        ["pointerup","pointercancel","lostpointercapture"].forEach((type) => button.addEventListener(type, () => { if (state.game.charging) releaseShot(); }));
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
    const g=state.game; g.charging=false; if(g.ball) return; g.shots+=1;
    const target=.42 + Math.sin(state.stage*1.7+g.shots)*.08, accuracy=1-Math.min(1,Math.abs(g.aim-target)*2.8+Math.abs(g.power-.68)*1.8);
    const made=accuracy>.48, perfect=accuracy>.82; if(made)g.score+=perfect?2:1; if(g.shots%2===0)g.rival+=((state.stage+g.shots)%3)?1:2;
    g.ball={t:0,made,perfect}; setStatus(made?(perfect?"✦ PERFECT +2":"✓ +1"):"↺"); updateHud();
  }
  function atlasAct(action) {
    const g=state.game; if(g.feedback>0)return;
    if(action==="clue"){g.clues=Math.min(3,g.clues+1);return;}
    if(!action.startsWith("region-"))return; const pick=Number(action.slice(-1));
    if(pick===g.target)g.stars+=4-g.clues; g.feedback=1.1; g.lastCorrect=pick===g.target;
  }
  function workshopAct(action) {
    const g=state.game, delta={"move-up":[0,-1],"move-down":[0,1],"move-left":[-1,0],"move-right":[1,0]}[action]; if(!delta)return;
    g.x=Math.max(0,Math.min(7,g.x+delta[0]));g.y=Math.max(0,Math.min(4,g.y+delta[1]));g.steps++;
    g.switches.forEach(s=>{if(s.x===g.x&&s.y===g.y)s.on=true;}); const lit=g.switches.every(s=>s.on);
    if(lit&&g.x===g.key.x&&g.y===g.key.y)g.key.taken=true;
    if(g.key.taken&&g.x===g.exit.x&&g.y===g.exit.y)finish(true,`${g.steps} moves · ${g.switches.length} switches`);
    else if(g.steps>=g.limit)finish(false,`${g.steps} / ${g.limit}`);
  }
  function blendAct(action) {
    const g=state.game;if(g.phase!=="choose")return;
    if(action.startsWith("color-"))g.color=Number(action.slice(-1));
    if(action.startsWith("pattern-"))g.pattern=Number(action.slice(-1));
    if(action==="lock"&&g.color>=0&&g.pattern>=0){if(g.color===g.targetColor&&g.pattern===g.targetPattern)g.wins++;g.phase="scan";g.timer=1.25;}
    document.querySelectorAll("[data-action^='color-'],[data-action^='pattern-']").forEach(b=>{const i=Number(b.dataset.action.slice(-1));b.classList.toggle("selected",(b.dataset.action.startsWith("color-")?g.color:g.pattern)===i);});
  }
  function builderAct(action) {
    const g=state.game;
    if(action.startsWith("tile-")){g.selected=Number(action.slice(-1));document.querySelectorAll("[data-action^='tile-']").forEach(b=>b.classList.toggle("selected",Number(b.dataset.action.slice(-1))===g.selected));}
    if(action==="reset"){g.grid.fill(-1);g.counts.fill(0);g.moves=0;}
  }
  function placeBuilder(event) {
    if(gameId!=="animal-habitat-builder"||state.screen!=="battle")return;
    const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*960/rect.width,y=(event.clientY-rect.top)*540/rect.height;
    const col=Math.floor((x-250)/92),row=Math.floor((y-90)/92);if(col<0||col>4||row<0||row>3)return;
    const g=state.game,index=row*5+col;if(g.grid[index]>=0)g.counts[g.grid[index]]--;g.grid[index]=g.selected;g.counts[g.selected]++;g.moves++;updateHud();
    if(g.need.every((need,i)=>g.counts[i]>=need))finish(true,`${g.moves} placements · ✦ harmony`);else if(g.moves>=g.limit)finish(false,`${g.moves} / ${g.limit}`);else{updateHud();draw();}
  }
  function update(dt) {
    const g=state.game;
    if(gameId==="animal-hoop-league"){
      if(g.charging)g.power=(g.power+dt*.012)%1;if(g.ball){g.ball.t+=dt*.018;if(g.ball.t>=1){g.ball=null;if(g.shots>=8)finish(g.score>g.rival,`${g.score} — ${g.rival}`);}}
    }
    if(gameId==="animal-habitat-atlas"&&g.feedback>0){g.feedback-=dt/60;if(g.feedback<=0){g.question++;if(g.question>=5)finish(g.stars>=8,`${g.stars} / 15 ✦`);else{g.target=(state.stage*3+g.question*2)%4;g.clues=1;}}}
    if(gameId==="animal-chameleon-blend"){
      g.timer-=dt/60;
      if(g.timer<=0&&g.phase==="preview"){g.phase="choose";g.timer=Math.max(4.8,8-state.stage*.35);}
      else if(g.timer<=0&&g.phase==="choose"){g.phase="scan";g.timer=1.25;}
      else if(g.timer<=0&&g.phase==="scan"){g.round++;if(g.round>5)finish(g.wins>=4,`${g.wins} / 5`);else{g.targetColor=(state.stage+g.round)%3;g.targetPattern=(state.stage*2+g.round)%3;g.color=-1;g.pattern=-1;g.phase="preview";g.timer=2.4;}}
    }
  }
  function updateHud(){
    const g=state.game;
    if(gameId==="animal-hoop-league")$("score-label").textContent=`${g.score} — ${g.rival} · ${g.shots}/8`;
    if(gameId==="animal-habitat-atlas")$("score-label").textContent=`${g.question+1}/5 · ${g.stars} ✦`;
    if(gameId==="animal-moonlight-workshop")$("score-label").textContent=`${g.steps}/${g.limit} · ${g.switches.filter(s=>s.on).length}/${g.switches.length}`;
    if(gameId==="animal-chameleon-blend")$("score-label").textContent=`${g.round}/5 · ${g.wins} ✓`;
    if(gameId==="animal-habitat-builder")$("score-label").textContent=`${g.moves}/${g.limit} · ${g.counts.join("·")}`;
  }
  function draw(){
    if(state.screen!=="battle")return;
    ctx.clearRect(0,0,960,540);fitImage(background);ctx.fillStyle="#06152255";ctx.fillRect(0,0,960,540);
    ({"animal-hoop-league":drawHoop,"animal-habitat-atlas":drawAtlasGame,"animal-moonlight-workshop":drawWorkshop,"animal-chameleon-blend":drawBlend,"animal-habitat-builder":drawBuilder})[gameId]();
  }
  function drawHoop(){const g=state.game;drawHero(65,205,245,310);drawAtlas(0,650,235,78,78);ctx.strokeStyle="#ffe79a";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(278,330);ctx.quadraticCurveTo(460,70+g.aim*120,690,280);ctx.stroke();ctx.fillStyle="#11283de8";ctx.fillRect(300,470,360,26);ctx.fillStyle="#ffd166";ctx.fillRect(300+360*.58,470,360*.2,26);ctx.fillStyle="#6be2dc";ctx.fillRect(300,470,360*g.power,26);if(g.ball){const t=g.ball.t,x=278+(690-278)*t,y=330-310*Math.sin(Math.PI*t);drawAtlas(0,x-34,y-34,68,68);}}
  function drawAtlasGame(){const g=state.game;drawHero(32,280,180,220);const boxes=[[235,90],[595,90],[235,305],[595,305]];boxes.forEach(([x,y],i)=>{ctx.fillStyle=i===g.target&&g.feedback>0?"#ffd166cc":"#071b2dcc";ctx.fillRect(x,y,250,150);drawAtlas(i,x+80,y+16,90,90);ctx.strokeStyle="#8de7ee";ctx.lineWidth=3;ctx.strokeRect(x,y,250,150);});for(let i=0;i<g.clues;i++)drawAtlas(4+(g.target+i)%4,445+i*54,245,46,46);if(g.feedback>0){ctx.font="bold 74px system-ui";ctx.fillStyle=g.lastCorrect?"#8cf0b4":"#ff8580";ctx.fillText(g.lastCorrect?"✓":"×",455,300);}}
  function drawWorkshop(){const g=state.game;const ox=175,oy=72,cw=92,ch=86;ctx.fillStyle="#071b2dbb";ctx.fillRect(ox,oy,cw*8,ch*5);ctx.strokeStyle="#6694a877";for(let x=0;x<=8;x++){ctx.beginPath();ctx.moveTo(ox+x*cw,oy);ctx.lineTo(ox+x*cw,oy+ch*5);ctx.stroke()}for(let y=0;y<=5;y++){ctx.beginPath();ctx.moveTo(ox,oy+y*ch);ctx.lineTo(ox+cw*8,oy+y*ch);ctx.stroke()}g.switches.forEach((s,i)=>drawAtlas(1+(i%3),ox+s.x*cw+22,oy+s.y*ch+20,48,48,s.on?1:.45));if(g.switches.every(s=>s.on)&&!g.key.taken)drawAtlas(0,ox+g.key.x*cw+18,oy+g.key.y*ch+16,56,56);drawAtlas(g.key.taken?5:4,ox+g.exit.x*cw+15,oy+g.exit.y*ch+12,62,62);drawHero(ox+g.x*cw+9,oy+g.y*ch+4,74,78);}
  function drawBlend(){const g=state.game;ctx.fillStyle="#08192cb0";ctx.fillRect(60,65,840,405);for(let i=0;i<3;i++)drawAtlas(1+i,100+i*280,105,220,220,g.phase==="preview"&&i===g.targetPattern?1:.42);const visible=g.phase!=="preview";drawAtlas(0,405,250,150,150,visible?1:.25);if(visible&&g.color>=0){ctx.globalCompositeOperation="source-atop";ctx.fillStyle=["#55bd69aa","#ff746faa","#4daee9aa"][g.color];ctx.fillRect(405,250,150,150);ctx.globalCompositeOperation="source-over";}if(g.phase==="preview"){ctx.strokeStyle="#ffd166";ctx.lineWidth=8;ctx.strokeRect(100+g.targetPattern*280,105,220,220);}if(g.phase==="scan"){const x=60+840*(1-g.timer/1.25);const grad=ctx.createLinearGradient(x-120,0,x+120,0);grad.addColorStop(0,"transparent");grad.addColorStop(.5,"#ffe08a88");grad.addColorStop(1,"transparent");ctx.fillStyle=grad;ctx.fillRect(x-120,65,240,405);}}
  function drawBuilder(){const g=state.game,ox=250,oy=90,size=92;ctx.fillStyle="#102d3dbd";ctx.fillRect(60,80,150,360);for(let i=0;i<4;i++){drawAtlas(i,75,95+i*82,60,60);ctx.fillStyle="#f7fbff";ctx.font="bold 20px system-ui";ctx.fillText(`${g.counts[i]} / ${g.need[i]}`,140,132+i*82);}for(let row=0;row<4;row++)for(let col=0;col<5;col++){const i=row*5+col,x=ox+col*size,y=oy+row*size;ctx.fillStyle="#17384dbb";ctx.fillRect(x,y,size-5,size-5);ctx.strokeStyle="#8bdce466";ctx.strokeRect(x,y,size-5,size-5);if(g.grid[i]>=0)drawAtlas(g.grid[i],x+8,y+8,size-21,size-21);}drawHero(730,300,180,205);}
  function frame(now){if(state.screen!=="battle")return;const dt=Math.min(2,(now-state.last)/16.67);state.last=now;update(dt);if(state.screen==="battle"){updateHud();draw();state.raf=requestAnimationFrame(frame);}}
  canvas.addEventListener("pointerup",placeBuilder);
  window.addEventListener("keydown",(event)=>{const map={ArrowUp:"move-up",ArrowDown:"move-down",ArrowLeft:"move-left",ArrowRight:"move-right"};if(gameId==="animal-moonlight-workshop"&&map[event.key]){event.preventDefault();act(map[event.key]);}});
  window.addEventListener("resize",()=>requestAnimationFrame(syncCanvasFit),{passive:true});
  new ResizeObserver(()=>requestAnimationFrame(syncCanvasFit)).observe(canvas.parentElement);
  $("start-game").addEventListener("click",()=>{stageCards();show("stage");});
  $("stage-back").addEventListener("click",()=>show("main"));
  $("battle-back").addEventListener("click",()=>{if(window.confirm(common(4)+"?")){stageCards();show("stage");}});
  $("to-stages").addEventListener("click",()=>{stageCards();show("stage");});
  $("retry").addEventListener("click",()=>start(state.stage));
  $("next").addEventListener("click",()=>{if(state.resultWin&&state.stage<cfg.stages)start(state.stage+1);});
  window.addEventListener("weightplay:market-locale-change",()=>{updateProgress();stageCards();if(state.screen==="battle")setStatus(window.WeightPlayMarketFiveLocale.game().guide);});
  [background,atlas,hero].forEach(image=>image.addEventListener("load",draw));
  updateProgress();stageCards();show("main");draw();
  const hideLoading=()=>{$("loadingPanel")?.classList.add("hidden");$("loadingPanel")?.setAttribute("hidden","");};
  if(document.readyState==="complete")hideLoading();else window.addEventListener("load",hideLoading,{once:true});
})();
