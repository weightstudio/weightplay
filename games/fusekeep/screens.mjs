var p=Object.defineProperty;var s=(a,d)=>p(a,"name",{value:d,configurable:!0});import{DICT as l}from"./locales.mjs";import{COPY as c}from"./copy.mjs";import{BUTTONS as b}from"./compact-copy.mjs";export function mountPlayScreens(){if(document.getElementById("stageScreen"))return;const a=document.getElementById("app");if(!a)throw Error("FUSEKEEP_MAIN_REQUIRED");const d=Object.hasOwn(l,document.documentElement.lang)?document.documentElement.lang:"en",o=l[d],i=c[d],r=b[d],n=document.createElement("template");n.innerHTML=`
 <section id="stageScreen" data-wp-stage-workspace hidden>
 <div id="stageCanvas">
   <header id="stageHeader"><button type="button" data-wp-return="stage" data-t-aria="back"></button><h2 data-wp-frame-title hidden></h2></header>
   <div id="stageContent">
    <div id="stageHud" data-wp-frame-info><div><span data-t="campaign"></span><strong id="stageProgress"></strong></div><div><span data-t="deck"></span><strong id="stageDeckCount"></strong></div></div>
    <section id="missionPane" role="tabpanel" aria-labelledby="missionTab"><div id="stageRail" data-wp-stage-rail></div></section>
    <section id="deckPane" role="tabpanel" aria-labelledby="deckTab" hidden inert><p data-t="deckHint"></p><p data-t="collectionHint"></p><p id="deckCount"></p><div id="deckGrid"></div><p id="deckMessage" class="bounded-message" role="status" aria-live="polite"></p></section>
   </div>
   <nav id="stageNav" data-wp-frame-nav data-wp-frame-stage-nav role="tablist"></nav>
   <div id="stageTabSeeds" hidden><button id="deckTab" type="button" role="tab" aria-controls="deckPane" aria-selected="false" tabindex="-1" data-wp-frame-stage-slot="team" data-wp-frame-action="tab" data-t="deck"></button><button id="missionTab" type="button" role="tab" aria-controls="missionPane" aria-selected="true" data-wp-frame-stage-slot="stages" data-wp-frame-action="tab" data-t="campaign"></button></div>
  </div>
 </section>
 <section id="battleScreen" hidden>
  <div id="battleCanvas" class="battle-shell" data-wp-battle-canvas-root data-wp-logical-battle-canvas data-wp-canvas-max-width="920" data-wp-battle-min-width="390" data-wp-battle-min-height="700" data-wp-battle-landscape-width="760" data-wp-battle-landscape-height="334">
   <header id="battleHeader"><button type="button" data-wp-return="battle" data-t-aria="back"></button><h2 data-wp-frame-title hidden></h2></header>
   <div id="battleContent">
    <div id="battleHud" data-wp-frame-info><div><span data-t="campaign"></span><strong id="battleLevel"></strong></div><div><span data-wave-label></span><strong id="battleWave"></strong></div><div><span data-t="goldLabel"></span><strong id="battleGold"></strong></div></div>
    <div class="utility-row battle-utilities">
     <button id="speed" type="button" data-wp-frame-action="secondary" data-t-aria="speed"><span id="speedValue">×1</span></button>
     <button id="help" type="button" data-wp-frame-action="secondary" data-t-aria="help"><span aria-hidden="true">?</span></button>
    </div>
    <div id="arenaFrame" data-t-aria="formation" role="group"><div id="arenaHost"></div><div id="padLayer"></div><div id="damageLayer" aria-hidden="true"></div><p id="battleCue" role="status" aria-live="polite" hidden></p></div>
    <div id="commands">
     <p id="selectionHint" class="bounded-message"></p>
     <div class="action-row">
      <button id="summon" type="button" data-wp-frame-action="secondary"><span data-t="shortSummon"></span><b id="summonCost"></b></button>
      <button id="upgrade" type="button" data-wp-frame-action="secondary"><span data-t="shortUpgrade"></span><b id="upgradeCost"></b></button>
      <button id="spell" type="button" data-wp-frame-action="secondary"><span data-t="shortSpell"></span><b id="spellCost"></b></button>
     </div><p id="feedback" class="bounded-message" role="status" aria-live="polite"></p>
    </div>
    <div class="health-line"><label for="wallMeter" data-t="wall"></label><progress id="wallMeter" max="5000" value="5000"></progress><strong id="wallText">5000/5000</strong></div>
   </div>
   <section id="battleDialog" hidden role="dialog" aria-modal="true" aria-labelledby="dialogTitle" aria-describedby="dialogBody">
    <div class="dialog-card"><h2 id="dialogTitle"></h2><p id="dialogBody"></p><div id="dialogDetails" data-wp-scroll-owner></div><p id="dialogStats"></p><div class="dialog-actions"><button id="modalLeft" type="button" data-wp-frame-action="secondary"></button><button id="modalMiddle" type="button" data-wp-frame-action="primary"></button><button id="modalRight" type="button" data-wp-frame-action="secondary"></button></div></div>
   </section>
  </div>
 </section>
 <dialog id="troopDialog" class="game-dialog" aria-labelledby="troopDialogTitle">
  <div class="game-dialog-card"><h2 id="troopDialogTitle"></h2><p id="troopDialogBody"></p><progress id="troopDialogProgress" max="12" value="0"></progress><p id="troopDialogRequirements"></p><p id="troopDialogStatus" role="status" aria-live="polite"></p><div class="game-dialog-actions"><button id="troopClose" type="button" data-wp-frame-action="secondary"></button><button id="troopAdvance" type="button" data-wp-frame-action="primary"></button><button id="troopSquad" type="button" data-wp-frame-action="secondary"></button></div></div>
 </dialog>
 <dialog id="gachaDialog" class="game-dialog" aria-labelledby="gachaTitle">
  <div class="game-dialog-card"><h2 id="gachaTitle"></h2><p id="gachaExplain"></p><p id="gachaBalance"></p><p id="gachaResult" role="status" aria-live="polite"></p><div class="game-dialog-actions"><button id="gachaClose" type="button" data-wp-frame-action="secondary"></button><button id="goldDraw" type="button" data-wp-frame-action="primary"></button><button id="diamondDraw" type="button" data-wp-frame-action="primary"></button></div></div>
 </dialog>`,a.append(n.content);const e=document.createElement("button");e.id="openGacha",e.type="button",e.dataset.wpFrameAction="secondary",e.dataset.t="gachaOpen",e.textContent=i.gachaOpen,document.querySelector("#mainContent [data-wp-frame-copy]")?.append(e),a.querySelector("[data-wave-label]").textContent=r.waveLabel;for(const t of a.querySelectorAll("[data-t]"))t.textContent=i[t.dataset.t]??o[t.dataset.t]??"";for(const t of a.querySelectorAll("[data-t-aria]"))t.setAttribute("aria-label",i[t.dataset.tAria]??o[t.dataset.tAria]??"")}s(mountPlayScreens,"mountPlayScreens");
