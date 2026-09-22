import {DICT} from './locales.mjs';
import {COPY} from './copy.mjs';
import {BUTTONS} from './compact-copy.mjs';
/** Persistent gameplay roots. Shared frame owns all chrome and its three tracks. */
export function mountPlayScreens(){
 if(document.getElementById('stageScreen'))return;
 const app=document.getElementById('app');if(!app)throw Error('FUSEKEEP_MAIN_REQUIRED');
 const locale=Object.hasOwn(DICT,document.documentElement.lang)?document.documentElement.lang:'en';
 const d=DICT[locale],copy=COPY[locale],buttons=BUTTONS[locale];
 const fragment=document.createElement('template');
 fragment.innerHTML=`
 <section id="stageScreen" data-wp-stage-workspace hidden>
  <div id="stageCanvas" data-wp-standard-stage-screen data-wp-logical-stage-canvas data-wp-canvas-max-width="920" data-wp-stage-landscape-width="760" data-wp-stage-landscape-height="334" data-wp-stage-art="/games/fusekeep/assets/poster.webp" style="--wp-stage-art:url('/games/fusekeep/assets/poster.webp')">
   <header id="stageHeader"><button type="button" data-wp-return="stage" data-t-aria="back"></button><h2 data-wp-frame-title hidden></h2></header>
   <div id="stageContent">
    <div id="stageHud" data-wp-frame-info><div><span data-t="campaign"></span><strong id="stageProgress"></strong></div><div><span data-t="deck"></span><strong id="stageDeckCount"></strong></div></div>
    <section id="missionPane" role="tabpanel" aria-labelledby="missionTab"><div id="stageRail" class="stage-rail" data-wp-stage-rail data-wp-stage-settle-duration="340"></div></section>
    <section id="deckPane" role="tabpanel" aria-labelledby="deckTab" hidden inert><p data-t="deckHint"></p><p id="deckCount"></p><div id="deckGrid"></div><p id="deckMessage" class="bounded-message" role="status" aria-live="polite"></p></section>
   </div>
   <nav id="stageNav" data-wp-frame-stage-nav role="tablist"><button id="deckTab" type="button" role="tab" aria-controls="deckPane" aria-selected="false" tabindex="-1" data-wp-frame-stage-slot="team" data-wp-frame-action="tab" data-t="deck"></button><button id="missionTab" type="button" role="tab" aria-controls="missionPane" aria-selected="true" data-wp-frame-stage-slot="stages" data-wp-frame-action="tab" data-t="campaign"></button></nav>
  </div>
 </section>
 <section id="battleScreen" hidden>
  <div id="battleCanvas" class="battle-shell" data-wp-battle-canvas-root data-wp-logical-battle-canvas data-wp-canvas-max-width="920" data-wp-battle-min-width="390" data-wp-battle-min-height="700" data-wp-battle-landscape-width="760" data-wp-battle-landscape-height="334">
   <header id="battleHeader"><button type="button" data-wp-return="battle" data-t-aria="back"></button><h2 data-wp-frame-title hidden></h2></header>
   <div id="battleContent">
    <div id="battleHud" data-wp-frame-info><div><span data-t="campaign"></span><strong id="battleLevel"></strong></div><div><span data-wave-label></span><strong id="battleWave"></strong></div><div><span data-t="goldLabel"></span><strong id="battleGold"></strong></div></div>
    <div class="health-line"><label for="wallMeter" data-t="wall"></label><progress id="wallMeter" max="5000" value="5000"></progress><strong id="wallText">5000/5000</strong></div>
    <div id="arenaFrame" data-t-aria="formation" role="group"><div id="arenaHost"></div><div id="padLayer"></div><div id="damageLayer" aria-hidden="true"></div><p id="battleCue" role="status" aria-live="polite" hidden></p></div>
    <div id="commands">
     <div class="utility-row">
      <button id="pause" type="button" data-wp-frame-action="secondary" data-t-aria="pause"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg></button>
      <button id="speed" type="button" data-wp-frame-action="secondary" data-t-aria="speed"><span id="speedValue">×1</span></button>
      <button id="priority" type="button" data-wp-frame-action="secondary" data-t-aria="target" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M11 1h2v3a8 8 0 0 1 7 7h3v2h-3a8 8 0 0 1-7 7v3h-2v-3a8 8 0 0 1-7-7H1v-2h3a8 8 0 0 1 7-7V1zm1 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg></button>
      <button id="help" type="button" data-wp-frame-action="secondary" data-t-aria="help"><span aria-hidden="true">?</span></button>
     </div>
     <p id="selectionHint" class="bounded-message"></p>
     <div class="action-row">
      <button id="summon" type="button" data-wp-frame-action="secondary"><span data-t="shortSummon"></span><b id="summonCost"></b></button>
      <button id="upgrade" type="button" data-wp-frame-action="secondary"><span data-t="shortUpgrade"></span><b id="upgradeCost"></b></button>
      <button id="spell" type="button" data-wp-frame-action="secondary"><span data-t="shortSpell"></span><b id="spellCost"></b></button>
     </div><p id="feedback" class="bounded-message" role="status" aria-live="polite"></p>
    </div>
   </div>
   <section id="battleDialog" hidden role="dialog" aria-modal="true" aria-labelledby="dialogTitle" aria-describedby="dialogBody">
    <div class="dialog-card"><h2 id="dialogTitle"></h2><p id="dialogBody"></p><div id="dialogDetails" data-wp-scroll-owner></div><p id="dialogStats"></p><div class="dialog-actions"><button id="modalLeft" type="button" data-wp-frame-action="secondary"></button><button id="modalMiddle" type="button" data-wp-frame-action="primary"></button><button id="modalRight" type="button" data-wp-frame-action="secondary"></button></div></div>
   </section>
  </div>
 </section>`;
 app.append(fragment.content);
 app.querySelector('[data-wave-label]').textContent=buttons.waveLabel;
 for(const node of app.querySelectorAll('[data-t]'))node.textContent=copy[node.dataset.t]??d[node.dataset.t]??'';
 for(const node of app.querySelectorAll('[data-t-aria]'))node.setAttribute('aria-label',copy[node.dataset.tAria]??d[node.dataset.tAria]??'');
}
