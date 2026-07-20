(()=>{
  'use strict';
  const GAME_ID='animal-frontier-dominion',SAVE_KEY='animalFrontierDominionSave';
  const $=id=>document.getElementById(id),$$=selector=>[...document.querySelectorAll(selector)];
  const en={title:'Animal Frontier Dominion',loading:'Surveying the frontier…',backLobby:'Back to WeightPlay',back:'Back',language:'Language',posterAlt:'Rux and Orla survey the crystal frontier',kicker:'4X-LITE TERRITORY STRATEGY',pitch:'Scout adjacent regions, counter their defenders, and build a route to the crystal citadel.',start:'Start Game',guideLabel:'Game guide',guideKicker:'AN ORIGINAL WEIGHTPLAY STRATEGY GAME',guideTitle:'Explore. Expand. Secure the frontier.',guideIntro:'Choose each neighbouring territory carefully. Scouting reveals danger, formations counter enemy roles, and captured sites provide the supplies needed for the next march.',howTitle:'How to play',how1:'Choose an adjacent territory.',how2:'Scout its hidden modifier or save command points.',how3:'Choose the formation that counters its defender, then march.',progressTitle:'A thirty-region campaign',progressText:'Six frontier chapters add watchtowers, frozen supply routes, patrols, split paths, and crystal citadels. Permanent research remains in this browser.',saveTitle:'Save and privacy',saveText:'No account is required. Campaign and research progress stay on this device.',chooseRegion:'Choose a frontier region',management:'Frontier management',map:'Map',research:'Research',regionRail:'Region selector',stageHint:'Drag the frontier, then choose an unlocked region.',supply:'Supply',crystal:'Crystal',diamonds:'Diamonds',commandTent:'Command Tent',commandBenefit:'+1 starting command',moraleCamp:'Morale Camp',moraleBenefit:'+2 starting morale',scoutLens:"Orla's Scout Lens",lensBenefit:'Permanent: first scout each battle is free.',lensCost:'25 diamonds · permanent',turn:'Turn',morale:'Morale',battleMap:'Frontier territory map',selectedTerritory:'Selected territory',chooseTarget:'Choose an adjacent territory',formation:'Formation',vanguard:'Vanguard',ranger:'Rangers',guard:'Guard',scout:'Scout · 1 command',march:'March',retry:'Retry',returnMap:'Return to Map',nextRegion:'Next Region',leaveTitle:'Leave this expedition?',leaveText:'The current territory route, morale, supply, and turn progress will be lost. Permanent research stays saved.',continue:'Continue playing',region:'Region {n}',locked:'Locked',secured:'Secured',enemyPower:'Enemy power {n}',reward:'Reward {n} supply',objective:'Capture the crystal citadel',selectTarget:'Choose a glowing adjacent territory.',selectFormation:'Choose a formation before marching.',notEnoughCommand:'No command points remain.',scouted:'Scout report: {modifier}. Defender: {defender}.',alreadyScouted:'This territory is already fully scouted.',victory:'Frontier secured!',defeat:'Expedition halted',victoryText:'The crystal route is secure. Permanent frontier resources were added.',defeatText:'Morale or time ran out. Change the expansion order and try again.',captured:'{name} secured. +{reward} supply.',repelled:'The formation was repelled. Morale -{loss}.',advantage:'Counter advantage',even:'Even matchup',danger:'Unknown modifier',openGround:'Open ground -1 defense',storm:'Crystal storm +2 defense',watchtower:'Watchtower +1 defense',supplyCache:'Supply cache +2 reward',raiders:'Raiders',wardens:'Wardens',scouts:'Scouts',cost:'Cost: {n}',maxed:'Maximum level',purchased:'Permanent research upgraded.',needResources:'Not enough frontier resources.',lensOwned:'Scout Lens already owned.',lensPurchased:'Scout Lens permanently unlocked.',needDiamonds:'25 diamonds are required.',freeScout:'Free first scout ready',chapter1:'Green March',chapter2:'Amber Crossing',chapter3:'Watchtower Belt',chapter4:'Frozen Frontier',chapter5:'Split Kingdoms',chapter6:'Crystal Dominion'};
  const zhHant={title:'動物邊境領主',loading:'正在勘察邊境…',backLobby:'返回 WeightPlay',back:'返回',language:'語言',posterAlt:'魯克斯與歐拉眺望水晶邊境',kicker:'4X-LITE 領地策略',pitch:'偵察相鄰領地、克制守軍，開闢通往水晶要塞的路線。',start:'開始遊戲',guideLabel:'遊戲說明',guideKicker:'WEIGHTPLAY 原創策略遊戲',guideTitle:'探索、擴張、守住邊境。',guideIntro:'仔細選擇每個相鄰領地。偵察會揭露危險，陣型能克制守軍，佔領據點則提供下一次進軍所需補給。',howTitle:'遊玩方式',how1:'選擇一個相鄰領地。',how2:'花費指揮點偵察，或保留資源。',how3:'選擇克制守軍的陣型並進軍。',progressTitle:'三十區域戰役',progressText:'六個邊境章節依序加入瞭望塔、冰封補給線、巡邏隊、分岔路與水晶要塞。永久研究會保存在這台裝置。',saveTitle:'存檔與隱私',saveText:'不需要帳號。戰役與研究進度只保存在這台裝置。',chooseRegion:'選擇邊境區域',management:'邊境管理',map:'地圖',research:'研究',regionRail:'區域選擇',stageHint:'拖曳邊境地圖，再選擇已解鎖區域。',supply:'補給',crystal:'水晶',diamonds:'鑽石',commandTent:'指揮帳篷',commandBenefit:'初始指揮點 +1',moraleCamp:'士氣營地',moraleBenefit:'初始士氣 +2',scoutLens:'歐拉偵察鏡',lensBenefit:'永久：每場第一次偵察免費。',lensCost:'25 鑽石 · 永久',turn:'回合',morale:'士氣',battleMap:'邊境領土地圖',selectedTerritory:'目前領地',chooseTarget:'選擇相鄰領地',formation:'陣型',vanguard:'先鋒',ranger:'遊俠',guard:'守衛',scout:'偵察 · 1 指揮',march:'進軍',retry:'再試一次',returnMap:'返回地圖',nextRegion:'下一區域',leaveTitle:'離開這次遠征？',leaveText:'目前領地路線、士氣、補給與回合進度會消失；永久研究會保留。',continue:'繼續遊玩',region:'區域 {n}',locked:'未解鎖',secured:'已守住',enemyPower:'敵方戰力 {n}',reward:'獎勵 {n} 補給',objective:'佔領水晶要塞',selectTarget:'請選擇發光的相鄰領地。',selectFormation:'進軍前請選擇陣型。',notEnoughCommand:'指揮點已用完。',scouted:'偵察報告：{modifier}。守軍：{defender}。',alreadyScouted:'這個領地已完成偵察。',victory:'邊境已守住！',defeat:'遠征中止',victoryText:'水晶路線已安全，永久邊境資源已加入。',defeatText:'士氣或回合已耗盡，調整擴張順序再試一次。',captured:'已佔領 {name}，補給 +{reward}。',repelled:'陣型遭到擊退，士氣 -{loss}。',advantage:'克制優勢',even:'勢均力敵',danger:'未知修正',openGround:'開闊地形：防禦 -1',storm:'水晶風暴：防禦 +2',watchtower:'瞭望塔：防禦 +1',supplyCache:'補給藏點：獎勵 +2',raiders:'突擊隊',wardens:'守衛隊',scouts:'遊騎隊',cost:'花費：{n}',maxed:'已達最高等級',purchased:'永久研究已升級。',needResources:'邊境資源不足。',lensOwned:'偵察鏡已擁有。',lensPurchased:'已永久解鎖偵察鏡。',needDiamonds:'需要 25 顆鑽石。',freeScout:'第一次偵察免費',chapter1:'翠綠進軍',chapter2:'琥珀交會',chapter3:'瞭望塔帶',chapter4:'冰封邊境',chapter5:'分裂王國',chapter6:'水晶領地'};
  const locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang||'en',runtimeTranslate=value=>window.WeightPlayGameRuntimeLocalizer?.translate?.(String(value))||String(value),dict=({en,'zh-Hant':zhHant,...(window.ANIMAL_FRONTIER_DOMINION_LOCALES||{})})[locale]||en;
  const t=(key,vars={})=>String(dict[key]??(locale==='en'?en[key]:runtimeTranslate(en[key]??key))??key).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??'');
  const fallback={unlocked:1,completed:{},stars:{},best:{},supply:0,crystal:0,commandLevel:0,moraleLevel:0,lens:false},sessionStore=new Map;
  const boundedInteger=(value,min,max,fallbackValue=min)=>{const number=Number(value);return Number.isFinite(number)?Math.max(min,Math.min(max,Math.trunc(number))):fallbackValue};
  function indexedValues(value,normalize){const result={};if(!value||typeof value!=='object'||Array.isArray(value))return result;for(const [key,item] of Object.entries(value)){const index=Number(key);if(Number.isInteger(index)&&index>=0&&index<30){const normalized=normalize(item);if(normalized!==undefined)result[index]=normalized}}return result}
  function normalizeSave(value){
    const source=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    const completed=indexedValues(source.completed,item=>item===true?true:undefined);
    const highestCompleted=Math.max(-1,...Object.keys(completed).map(Number));
    return{unlocked:Math.max(boundedInteger(source.unlocked,1,30,1),Math.min(30,highestCompleted+2)),completed,stars:indexedValues(source.stars,item=>{const number=boundedInteger(item,0,3,-1);return number>=0?number:undefined}),best:indexedValues(source.best,item=>{const number=boundedInteger(item,0,999999,-1);return number>=0?number:undefined}),supply:boundedInteger(source.supply,0,999999),crystal:boundedInteger(source.crystal,0,999999),commandLevel:boundedInteger(source.commandLevel,0,3),moraleLevel:boundedInteger(source.moraleLevel,0,3),lens:source.lens===true}
  }
  function storageRead(){try{return localStorage.getItem(SAVE_KEY)}catch{return sessionStore.get(SAVE_KEY)||null}}
  function storageWrite(value){sessionStore.set(SAVE_KEY,value);try{localStorage.setItem(SAVE_KEY,value)}catch{}}
  function readSave(){try{return normalizeSave(JSON.parse(storageRead()||'{}'))}catch{return normalizeSave(fallback)}}
  let save=readSave(),stageIndex=Math.max(0,Math.min(29,save.unlocked-1)),run=null,selectedNode=-1,formation='',inputLocked=false,lastFocus=null,marchTimer=0,pendingLeave=false;
  const positions=[[18,78],[20,49],[43,69],[43,30],[61,51],[78,72],[82,24]],links=[[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[5,6]];
  const defenderKeys=['raiders','wardens','scouts'],modifierKeys=['openGround','supplyCache','watchtower','storm'];
  function stageData(index){const chapter=Math.floor(index/5),power=2+Math.floor(index/3),turns=8+(index%3),required=4+(index>19?1:0);return{index,chapter,power,turns,required,rewardSupply:7+chapter*2,rewardCrystal:2+(index%3),chapterName:t(`chapter${chapter+1}`)}}
  function nodeData(stage,node){return{id:node,name:`${stage.chapterName} ${node+1}`,defender:defenderKeys[(node+stage.index)%3],modifier:modifierKeys[(node*2+stage.chapter)%4],power:stage.power+(node===6?2+(stage.chapter===5?2:0):node%3),reward:1+((node+stage.index)%2)+(node===4?1:0)}}
  function persist(){save=normalizeSave(save);storageWrite(JSON.stringify(save))}
  function track(event,data={}){window.WonderAnalytics?.track?.(event,{gameId:GAME_ID,stage:stageIndex+1,release:'internal',...data})}
  function screen(name){document.body.dataset.screen=name;$('mainGroup').hidden=name!=='main';$('stage').hidden=name!=='stage';$('battle').hidden=name!=='battle'}
  function applyText(){document.documentElement.lang=locale;$$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));$$('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));$$('[data-i18n-alt]').forEach(el=>el.alt=t(el.dataset.i18nAlt));$('locale').value=locale;document.title=`${t('title')} | WeightPlay`}
  function renderMain(){const cleared=Object.keys(save.completed).length;$('mainProgress').textContent=`${cleared} / 30`}
  function setTab(name){$$('.stage-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.tab===name));$('mapTab').hidden=name!=='map';$('researchTab').hidden=name!=='research';if(name==='research')renderResearch()}
  function markCentered(index){
    $$('#stageRail .stage-card').forEach((card,i)=>card.classList.toggle('centered',i===index));
  }
  function renderStage(center=true){
    const rail=$('stageRail');rail.innerHTML='';
    for(let i=0;i<30;i++){
      const data=stageData(i),locked=i>=save.unlocked,card=document.createElement('button');
      card.type='button';
      card.className=`stage-card${locked?' locked':''}${i===stageIndex?' selected centered':''}`;
      card.dataset.index=i;card.setAttribute('aria-disabled',String(locked));
      card.innerHTML=`<small>${locked?t('locked'):save.completed[i]?t('secured'):data.chapterName}</small><strong>${t('region',{n:i+1})}</strong><span>${t('enemyPower',{n:data.power})}</span><span>${t('reward',{n:data.rewardSupply})}</span><span>${'★'.repeat(save.stars[i]||0)}${'☆'.repeat(3-(save.stars[i]||0))}</span>`;
      card.addEventListener('click',()=>{if(rail.dataset.dragging==='true')return;stageIndex=i;if(locked){markCentered(i);return}startBattle(i)});
      rail.append(card);
    }
    $('stageProgress').textContent=`${Object.keys(save.completed).length}/30`;
    if(center)requestAnimationFrame(()=>rail.children[stageIndex]?.scrollIntoView({inline:'center',block:'nearest'}));
  }
  function renderResearch(){const wallet=window.WeightPlayWallet?.read?.()||{diamonds:0};$('metaSupply').textContent=save.supply;$('metaCrystal').textContent=save.crystal;$('diamondBalance').textContent=wallet.diamonds;const commandCost=5+save.commandLevel*5,moraleCost=5+save.moraleLevel*5;$('commandCost').textContent=save.commandLevel>=3?t('maxed'):t('cost',{n:`${commandCost} ${t('supply')}`});$('moraleCost').textContent=save.moraleLevel>=3?t('maxed'):t('cost',{n:`${moraleCost} ${t('crystal')}`});$('lensUpgrade').disabled=save.lens;$('researchFeedback').textContent=save.lens?t('lensOwned'):''}
  function purchaseResourceUpgrade(type){const levelKey=`${type}Level`,resource=type==='command'?'supply':'crystal',cost=5+save[levelKey]*5;if(save[levelKey]>=3)return;if(save[resource]<cost){$('researchFeedback').textContent=t('needResources');return}save[resource]-=cost;save[levelKey]++;persist();renderResearch();$('researchFeedback').textContent=t('purchased');window.WonderSound?.play?.('success')}
  function purchaseLens(){if(save.lens)return;if(!window.WeightPlayWallet?.spendDiamonds?.(25)){$('researchFeedback').textContent=t('needDiamonds');return}save.lens=true;persist();renderResearch();$('researchFeedback').textContent=t('lensPurchased');window.WonderSound?.play?.('success')}
  function clearMarchTimer(){if(marchTimer){clearTimeout(marchTimer);marchTimer=0}}
  function startBattle(index){clearMarchTimer();pendingLeave=false;inputLocked=false;stageIndex=Math.max(0,Math.min(29,boundedInteger(index,0,29)));const data=stageData(stageIndex);run={data,turn:1,morale:10+save.moraleLevel*2,supply:4,command:2+save.commandLevel,owned:new Set([0]),scouted:new Set(),failed:new Set(),freeScout:save.lens,ended:false};selectedNode=-1;formation='';screen('battle');$('result').hidden=true;$('leave').hidden=true;$('battleLive').hidden=false;$('battleLive').inert=false;$('battleLive').setAttribute('aria-hidden','false');renderBattle();track('game_start')}
  function neighbours(node){return links.filter(pair=>pair.includes(node)).map(pair=>pair[0]===node?pair[1]:pair[0])}
  function availableNodes(){const available=new Set;run.owned.forEach(node=>neighbours(node).forEach(next=>{if(!run.owned.has(next))available.add(next)}));return available}
  function renderBattle(){const data=run.data,available=availableNodes();$('battleRegion').textContent=t('region',{n:data.index+1});$('battleObjective').textContent=t('objective');$('turnValue').textContent=`${run.turn}/${data.turns}`;$('moraleValue').textContent=run.morale;$('supplyValue').textContent=run.supply;const layer=$('territoryLayer');layer.innerHTML='';for(let i=0;i<7;i++){const node=nodeData(data,i),button=document.createElement('button');button.type='button';button.className=`territory${run.owned.has(i)?' owned':''}${available.has(i)?' available':''}${selectedNode===i?' selected':''}${i===6?' citadel':''}`;button.style.left=`${positions[i][0]}%`;button.style.top=`${positions[i][1]}%`;button.dataset.node=i;button.disabled=!available.has(i)||inputLocked;button.innerHTML=`<small>${run.owned.has(i)?t('secured'):t(node.defender)}</small><strong>${node.power}</strong>`;button.setAttribute('aria-label',`${node.name}. ${t('enemyPower',{n:node.power})}`);button.onclick=()=>selectNode(i);layer.append(button)}const token=document.createElement('img');token.className='march-token';token.src='../../assets/weightplay-character-gear-horn-rhino-cutout.webp';const anchor=[...run.owned].at(-1)||0;token.style.left=`${positions[anchor][0]}%`;token.style.top=`${positions[anchor][1]}%`;layer.append(token);$$('[data-formation]').forEach(button=>button.classList.toggle('selected',button.dataset.formation===formation));if(selectedNode>=0)renderTarget();else{$('targetName').textContent=t('chooseTarget');$('targetInfo').textContent=''}$('scout').disabled=selectedNode<0||inputLocked;$('march').disabled=selectedNode<0||!formation||inputLocked}
  function selectNode(index){selectedNode=index;renderBattle();window.WonderSound?.play?.('click')}
  function renderTarget(){const node=nodeData(run.data,selectedNode),known=run.scouted.has(selectedNode);$('targetName').textContent=node.name;$('targetInfo').textContent=`${t(node.defender)} · ${t('enemyPower',{n:node.power})} · ${known?t(node.modifier):t('danger')}`}
  function scout(){if(selectedNode<0)return;if(run.scouted.has(selectedNode)){$('feedback').textContent=t('alreadyScouted');return}if(run.freeScout)run.freeScout=false;else if(run.command<=0){$('feedback').textContent=t('notEnoughCommand');return}else run.command--;run.scouted.add(selectedNode);const node=nodeData(run.data,selectedNode);$('feedback').textContent=t('scouted',{modifier:t(node.modifier),defender:t(node.defender)});renderTarget();window.WonderSound?.play?.('click')}
  function formationBonus(defender){return(formation==='guard'&&defender==='raiders')||(formation==='vanguard'&&defender==='scouts')||(formation==='ranger'&&defender==='wardens')?2:0}
  function march(){
    if(selectedNode<0){$('feedback').textContent=t('selectTarget');return}
    if(!formation){$('feedback').textContent=t('selectFormation');return}
    const previewNode=nodeData(run.data,selectedNode);
    const marchCost=run.data.chapter===3&&previewNode.modifier==='storm'?2:1;
    if(run.supply<marchCost){run.morale=0;finish(false);return}
    const target=selectedNode,node=nodeData(run.data,target);
    const modifier=({openGround:-1,storm:2,watchtower:1,supplyCache:0}[node.modifier]||0);
    const playerPower=run.data.power+2+formationBonus(node.defender),enemyPower=node.power+modifier;
    run.supply-=marchCost;run.turn++;inputLocked=true;
    const token=document.querySelector('.march-token');
    if(token){token.style.left=`${positions[target][0]}%`;token.style.top=`${positions[target][1]}%`}
    if(playerPower>=enemyPower){
      run.owned.add(target);
      const reward=node.reward+(node.modifier==='supplyCache'?2:0);
      run.supply+=reward;
      $('feedback').textContent=t('captured',{name:node.name,reward});
      window.WonderSound?.play?.('success');
    }else{
      const loss=Math.max(1,enemyPower-playerPower+1);
      run.morale-=loss;run.failed.add(target);
      $('feedback').textContent=t('repelled',{loss});
      window.WonderSound?.play?.('wrong');
    }
    selectedNode=-1;formation='';
    const activeRun=run;
    marchTimer=setTimeout(()=>{
      marchTimer=0;
      if(run!==activeRun||run.ended)return;
      inputLocked=false;
      if(run.owned.has(6)&&run.owned.size>=run.data.required){finish(true);return}
      if(run.morale<=0||run.turn>run.data.turns){finish(false);return}
      renderBattle();
      if(pendingLeave){pendingLeave=false;openLeave()}
    },650)
  }
  function finish(won){clearMarchTimer();pendingLeave=false;inputLocked=false;run.ended=true;const data=run.data;$('battleLive').hidden=true;$('battleLive').inert=true;$('battleLive').setAttribute('aria-hidden','true');$('result').hidden=false;const stars=won?Math.max(1,3-Math.floor(run.failed.size/2)):0;$('resultKicker').textContent=won?t('secured'):t('defeat');$('resultTitle').textContent=won?t('victory'):t('defeat');$('resultText').textContent=won?t('victoryText'):t('defeatText');$('resultRewards').textContent=won?`★ ${stars} · +${data.rewardSupply} ${t('supply')} · +${data.rewardCrystal} ${t('crystal')}`:'';$('nextRegion').hidden=!won||stageIndex>=29;if(won){save.completed[stageIndex]=true;save.stars[stageIndex]=Math.max(save.stars[stageIndex]||0,stars);save.unlocked=Math.max(save.unlocked,Math.min(30,stageIndex+2));save.supply+=data.rewardSupply;save.crystal+=data.rewardCrystal;persist();track('game_complete',{stars})}else track('game_fail');requestAnimationFrame(()=>(won&&!$('nextRegion').hidden?$('nextRegion'):$('retry')).focus({preventScroll:true}))}
  function openLeave(){if(!run||run.ended){returnToStage();return}if(inputLocked){pendingLeave=true;return}lastFocus=document.activeElement;$('leave').hidden=false;$('battleLive').inert=true;$('battleLive').setAttribute('aria-hidden','true');requestAnimationFrame(()=>$('continueBattle').focus({preventScroll:true}))}
  function closeLeave(){$('leave').hidden=true;$('battleLive').inert=false;$('battleLive').setAttribute('aria-hidden','false');lastFocus?.focus?.({preventScroll:true})}
  function returnToStage(){clearMarchTimer();pendingLeave=false;inputLocked=false;$('leave').hidden=true;$('result').hidden=true;screen('stage');renderStage();requestAnimationFrame(()=>document.querySelector('.stage-card.selected')?.focus({preventScroll:true}))}
  function activeModal(){if(!$('leave').hidden)return $('leave');if(!$('result').hidden)return $('result');return null}
  function trapModalFocus(event){const modal=activeModal();if(event.key!=='Tab'||!modal)return;const controls=$$('button:not([disabled]):not([hidden]),a[href],[tabindex]:not([tabindex="-1"])').filter(control=>modal.contains(control)&&control.getClientRects().length);if(!controls.length){event.preventDefault();return}const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
  function bind(){
    applyText();renderMain();
    $('locale').onchange=()=>window.WonderI18n?.setLocale?.($('locale').value);
    $('start').onclick=()=>{screen('stage');renderStage();track('stage_view')};
    $('stageBack').onclick=()=>{screen('main');renderMain()};
    $('stageRail').addEventListener('wonder:stage-snap',event=>markCentered(Math.max(0,Number(event.detail?.index)||0)));
    $$('.stage-tabs button').forEach(button=>button.onclick=()=>setTab(button.dataset.tab));
    $$('[data-upgrade]').forEach(button=>button.onclick=()=>purchaseResourceUpgrade(button.dataset.upgrade));
    $('lensUpgrade').onclick=purchaseLens;$('battleBack').onclick=openLeave;
    $$('[data-formation]').forEach(button=>button.onclick=()=>{formation=button.dataset.formation;renderBattle()});
    $('scout').onclick=scout;$('march').onclick=march;$('continueBattle').onclick=closeLeave;$('leaveMap').onclick=returnToStage;
    $('retry').onclick=()=>startBattle(stageIndex);$('resultMap').onclick=returnToStage;$('nextRegion').onclick=()=>startBattle(Math.min(29,stageIndex+1));
    document.addEventListener('keydown',event=>{trapModalFocus(event);if(event.key==='Escape'&&!$('leave').hidden){event.preventDefault();closeLeave()}});
  }
  bind();const assets=['../../assets/animal-frontier-dominion/cover.webp','../../assets/animal-frontier-dominion/frontier-map.webp','../../assets/weightplay-character-gear-horn-rhino-cutout.webp','../../assets/weightplay-character-moon-cap-owl-cutout.webp'];let loaded=0;Promise.allSettled(assets.map(src=>new Promise(resolve=>{const image=new Image,done=()=>{loaded++;$('loadingFill').style.width=`${loaded/assets.length*100}%`;resolve()};image.onload=done;image.onerror=done;image.src=src}))).then(()=>setTimeout(()=>{$('loading').hidden=true;screen('main');track('game_view')},160));
  window.__animalFrontierDominionTest={stageData,nodeData,startBattle,selectNode,scout,march,finish,availableNodes,snapshot:()=>({save,stageIndex,run:run?{...run,owned:[...run.owned],scouted:[...run.scouted],failed:[...run.failed]}:null})};
})();
