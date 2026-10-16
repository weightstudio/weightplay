/* Shared Stage composition. Games supply records and callbacks, never card DOM,
   geometry, pooling, gestures, briefing markup, or button layout. */
(() => {
  'use strict';
  const mounted = new WeakMap();
  const clamp = (n, max) => Math.max(0, Math.min(max, n));
  function mountStage({page, rail, config, selected = 0, onSelect = () => {}, onStart, isActive = () => true}) {
    if (mounted.has(rail)) return mounted.get(rail);
    if (!page || !rail || !config?.count || typeof config.stage !== 'function' || typeof onStart !== 'function') throw new TypeError('PLAY_UI_STAGE_CONFIG_REQUIRED');
    const abort = new AbortController();
    const listen = (node, type, fn) => node.addEventListener(type, fn, {signal:abort.signal});
    const scene = page.closest('[data-wp-frame-scene="stage"]');
    const header = scene.querySelector('[data-wp-frame-header="stage"]');
    const frameRoot = scene.closest('[data-wp-frame]');
    if (frameRoot.dataset.wpPlayUi !== '1') throw new Error('PLAY_UI_SHARED_FRAME_REQUIRED');
    const assetUrl = path => {
      const url=new URL(path,location.origin);
      if (!['http:','https:'].includes(url.protocol) || url.origin!==location.origin) throw new Error('PLAY_UI_LOCAL_POSTER_REQUIRED');
      return `url(${JSON.stringify(url.href)})`;
    };
    scene.style.setProperty('--wp-play-background',assetUrl(config.background || config.poster));
    page.dataset.wpStageSelector = '1';
    header.dataset.wpStageI9Header = 'true';
    Object.assign(rail.dataset, {wpStageRail:'true', wpStageCenterObserver:'manual', wpStageVirtualized:'bounded-recycle', wpStageTotal:String(config.count)});
    // Permanent authored explanatory nodes may still be updated by game code.
    // Keep them inert outside the common presentation instead of observing them.
    const source = document.createElement('div'); source.hidden = true; source.dataset.wpStageSource = '';
    for (const node of [...page.children]) if (node !== rail) source.append(node);
    page.append(source);
    const briefing = document.createElement('section'); briefing.className = 'wp-stage-i9-briefing';
    const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'wp-stage-i9-briefing-toggle'; toggle.textContent = 'i'; toggle.setAttribute('aria-expanded','false');
    const copy = document.createElement('div'); copy.className = 'wp-stage-i9-briefing-copy';
    const title = document.createElement('strong'), summary = document.createElement('span');
    title.className = 'wp-stage-i9-briefing-title'; summary.className = 'wp-stage-i9-briefing-summary'; copy.append(title,summary);
    const details = document.createElement('div'); details.className = 'wp-stage-i9-briefing-details'; details.id = `${rail.id}-shared-details`; details.hidden = true; details.setAttribute('role','region');
    toggle.setAttribute('aria-controls',details.id); briefing.append(toggle,copy,details); page.append(briefing);
    listen(toggle,'click',() => { details.hidden = !details.hidden; toggle.setAttribute('aria-expanded',String(!details.hidden)); });
    let current = clamp(Math.round(selected),config.count-1), start = 0, closed = false, resizeFrame = 0;
    const poolSize = Math.min(9,config.count), cards = [];
    const desiredStart = index => clamp(Math.round(index)-Math.floor(poolSize/2),config.count-poolSize);
    function bind(card,index) {
      const item = config.stage(index);
      const active = index === current;
      card.dataset.stage = String(item.id ?? index+1); card.dataset.stageIndex = String(index);
      card.setAttribute('aria-posinset',String(index+1)); card.setAttribute('aria-setsize',String(config.count));
      card.setAttribute('aria-disabled',String(Boolean(item.locked))); card.tabIndex = active ? 0 : -1;
      card.classList.toggle('is-selected',active); card.classList.toggle('selected',active); card.classList.toggle('wp-stage-centered',active);
      card.classList.toggle('is-cleared',Boolean(item.cleared)); card.classList.toggle('locked',Boolean(item.locked));
      if (active) card.setAttribute('aria-current','true'); else card.removeAttribute('aria-current');
      const fields = card.querySelector('[data-wp-item-content]').children;
      [item.kicker,item.title,item.subtitle,item.status].forEach((value,i) => {fields[i].textContent = value || '';fields[i].hidden = !value;});
      const art = card.querySelector('.wp-stage-i9-card-art');
      art.style.backgroundImage = assetUrl(item.poster || config.poster); art.style.backgroundPosition = item.posterPosition || 'center';
      card.setAttribute('aria-label',[item.kicker,item.title,item.subtitle,item.status,item.summary].filter(Boolean).join('. '));
      if (config.gameId && item.rewardState) {
        Object.assign(card.dataset,{wpGetGameId:config.gameId,wpGetIndex:String(index),wpGetState:item.rewardState});
        window.WeightPlayScreenFrame.showGet(config.gameId,index);
      }
    }
    function updateBriefing() {
      const item = config.stage(current);
      title.textContent = [item.title,item.subtitle].filter(Boolean).join(' · '); summary.textContent = item.summary || '';
      toggle.setAttribute('aria-label',title.textContent); details.setAttribute('aria-label',title.textContent);
      const lines = (item.details || []).filter(Boolean);
      while (details.children.length > lines.length) details.lastElementChild.remove();
      lines.forEach((line,i) => {if (!details.children[i]) details.append(document.createElement('p'));details.children[i].textContent=line;});
    }
    function sync() { cards.forEach(card => bind(card,Number(card.dataset.stageIndex))); updateBriefing(); }
    function moveWindow(index) {
      const target = desiredStart(index); let recycled = 0;
      while (start < target) {const card=rail.firstElementChild;start++;rail.append(card);bind(card,start+poolSize-1);recycled++;}
      while (start > target) {const card=rail.lastElementChild;start--;rail.prepend(card);bind(card,start);recycled++;}
      rail.dataset.wpStageWindowStart=String(start); rail.dataset.wpStageWindowEnd=String(start+poolSize-1);
      if (recycled) rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);
    }
    function geometry() {
      const box=rail.getBoundingClientRect(), a=rail.children[0]?.getBoundingClientRect(), b=rail.children[1]?.getBoundingClientRect();
      const pitch=a&&b ? b.left+b.width/2-a.left-a.width/2 : 310;
      return {center:box.left+box.width/2,scale:box.width/Math.max(1,rail.offsetWidth),pitch:Math.abs(pitch),direction:Math.sign(pitch)||1};
    }
    function position(value) {
      const logical=clamp(value,config.count-1), index=Math.round(logical);
      moveWindow(index);
      const card=rail.querySelector(`[data-stage-index="${index}"]`), g=geometry(), box=card.getBoundingClientRect();
      rail.scrollLeft += (box.left+box.width/2-g.center+(logical-index)*g.pitch*g.direction)/g.scale;
      rail.dataset.wpStageDragLogical=logical.toFixed(4);
      return logical;
    }
    function readPosition() {
      const g=geometry(); let nearest=null,distance=Infinity;
      for (const card of cards) {const box=card.getBoundingClientRect(), delta=g.center-box.left-box.width/2;if(Math.abs(delta)<distance){distance=Math.abs(delta);nearest={index:Number(card.dataset.stageIndex),delta};}}
      return nearest ? clamp(nearest.index+nearest.delta/(g.pitch*g.direction),config.count-1) : current;
    }
    function select(index,{center=true,focus=false,notify=true}={}) {
      current=clamp(Math.round(index),config.count-1); moveWindow(current); sync();
      if(center)position(current);
      if(notify)onSelect(current);
      if(focus)rail.querySelector('[aria-current="true"]')?.focus({preventScroll:true});
    }
    function startStage(index) { if (!config.stage(index).locked) {select(index);onStart(index);} }
    rail.replaceChildren(); start=desiredStart(current);
    for(let i=0;i<poolSize;i++) {
      const card=document.createElement('button');card.type='button';card.className='stage-card';card.dataset.wpStagePoolNode=String(i+1);
      const art=document.createElement('i');art.className='wp-stage-i9-card-art';art.setAttribute('aria-hidden','true');
      const content=document.createElement('div');content.dataset.wpItemContent='';
      for(const tag of ['em','strong','span','small'])content.append(document.createElement(tag));card.append(art,content);
      bind(card,start+i);rail.append(card);cards.push(card);
      listen(card,'click',() => startStage(Number(card.dataset.stageIndex)));
    }
    rail.dataset.wpStagePoolSize=String(poolSize);
    const drag=window.WeightPlayStageRailI9.attachLogical(rail,{
      readPosition,writePosition:position,pitch:()=>geometry().pitch,direction:()=>geometry().direction,count:()=>config.count,
      onStart:()=>isActive(),commitIndex:index=>select(index,{center:false}),onSettled:index=>select(index,{focus:false}),
    });
    listen(rail,'keydown',event => {
      if(event.repeat && ['Enter',' '].includes(event.key)){event.preventDefault();return;}
      const next=window.WeightPlayStageRailI9.keyboardIndex(event.key,current+1,config.count,getComputedStyle(rail).direction==='rtl');
      if(next!==null){event.preventDefault();drag.cancel();select(next-1,{focus:true});}
    });
    function layout() {
      resizeFrame=0; if(closed || !page.getClientRects().length || !page.offsetWidth)return;
      const box=page.getBoundingClientRect(), scale=box.width/page.offsetWidth, inverse=1/Math.max(.01,scale);
      // One common physical composition, inverse-scaled into each owning Canvas.
      // Keep the poster's 292:372 ratio even in short landscape.
      const fit=Math.max(.15,Math.min(1,(box.width-64)/292,(box.height-116)/372));
      const values={'card-width':292*fit,'card-height':372*fit,'gap':18,'briefing-height':68};
      for(const [name,value] of Object.entries(values))scene.style.setProperty(`--wp-play-${name}`,`${value*inverse}px`);
      position(current);
    }
    function scheduleLayout(){if(!closed&&!resizeFrame)resizeFrame=requestAnimationFrame(layout);}
    const resize = new ResizeObserver(scheduleLayout);resize.observe(page);resize.observe(scene);
    listen(window,'resize',scheduleLayout);listen(window,'weightplay:stage-sync',scheduleLayout);
    listen(window,'weightplay:play-actions-change',scheduleLayout);
    const api=Object.freeze({
      select, refresh(index=current){drag.cancel();select(index,{notify:false});scheduleLayout();},cancel:drag.cancel,
      get selected(){return current;},get pool(){return cards;},
      destroy(){if(closed)return;closed=true;drag.dispose();resize.disconnect();abort.abort();cancelAnimationFrame(resizeFrame);mounted.delete(rail);},
    });
    listen(window,'pagehide',event=>{if(!event.persisted)api.destroy();});
    mounted.set(rail,api);sync();scheduleLayout();return api;
  }
  window.WeightPlayPlayUI=Object.freeze({version:1,mountStage});
})();
