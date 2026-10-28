import { SalvageSlice } from './model.mjs';
import { SalvageView, finishPreviews } from './render.mjs';
import { OPENING } from './campaign.mjs';
import { LocalPractice } from '/src/game-local-practice.mjs';
import { LOCALES, ROUTES, text, title, stageTitle, renderStaticGuide } from './copy.mjs';

const $=id=>document.getElementById(id);
const routeIndex=ROUTES.indexOf(location.pathname.split('/')[1]);
let locale=routeIndex>=0?LOCALES[routeIndex]:(window.WonderI18n?.locale?.()||document.documentElement.lang);
if(!LOCALES.includes(locale))locale='en';
const t=(key,vars)=>text(locale,key,vars),label=key=>key==='title'?title(locale):t(key);
document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${title(locale)} | WeightPlay`;
for(const node of document.querySelectorAll('[data-copy]'))node.textContent=label(node.dataset.copy);
for(const node of document.querySelectorAll('[data-copy-aria]'))node.setAttribute('aria-label',label(node.dataset.copyAria));
for(const node of document.querySelectorAll('[data-copy-alt]'))node.setAttribute('alt',label(node.dataset.copyAlt));
for(const node of document.querySelectorAll('[data-lobby-link]'))node.href=`/${ROUTES[LOCALES.indexOf(locale)]}/`;
const guide=$('guide');if(guide)guide.outerHTML=renderStaticGuide(locale);
$('localeSource').value=locale;
const AVAILABLE=60;
if (new URLSearchParams(location.search).get('preview') !== '1') {
  $('gameFrame').hidden=true; $('guide').hidden=true; $('comingSoon').hidden=false;
} else {
  const audio=window.WeightPlayAudio?.createScope();
  const sound=id=>audio?.play(id);
  const FINISHES=[{id:'workshop',color:0x187e79,unlock:0},{id:'moss',color:0x659657,unlock:5},{id:'ocean',color:0x428eb8,unlock:15},{id:'brass',color:0xd79c37,unlock:30},{id:'dusk',color:0x926ab0,unlock:45},{id:'moon-enamel',color:0xdce9f5,unlock:5,cost:12}].map((item,i)=>({...item,name:t(`item${i}`)}));
  const STORE='weightplay-rux-salvage-yard-v1';
  let progress={version:1,highestUnlocked:1,cleared:{},selectedFinish:'workshop'},saveWarning=false;
  try{const raw=localStorage.getItem(STORE);if(raw){const saved=JSON.parse(raw);if(saved.version!==1||!Number.isInteger(saved.highestUnlocked)||saved.highestUnlocked<1||saved.highestUnlocked>60||!saved.cleared||typeof saved.cleared!=='object'||Array.isArray(saved.cleared))throw Error('invalid save');progress={...progress,...saved};}}catch{saveWarning=true;}
  const save=()=>{if(practice)return false;try{localStorage.setItem(STORE,JSON.stringify(progress));$('saveWarning').hidden=true;return true;}catch{$('saveWarning').hidden=false;return false;}};
  let screen='main',stageTab='stages',model=null,view=null,frame,selector,tutorial,tutorialFull=false,dialogMode='',dialogReturn=null,raf=0,last=0,accum=0,angle=.05,paused=false,slice=0,selected=progress.highestUnlocked-1,practice=false,previews=null,purchasePending=false,startPending=false,pageClosed=false;
  const ownsFinish=item=>item.id==='workshop'||(item.cost?Boolean(window.WeightPlayWallet?.owns(`rux-salvage-yard:${item.id}`)):Boolean(progress.cleared[item.unlock]));
  const equippedFinish=()=>FINISHES.find(item=>item.id===progress.selectedFinish&&ownsFinish(item))||FINISHES[0];
  const renderCollection=()=>{
    if(!previews){try{previews=finishPreviews(FINISHES);}catch(error){console.warn('RUX_FINISH_PREVIEW',error.message);previews={};}}
    const wallet=window.WeightPlayWallet?.read?.()||{available:false,diamonds:0};$('diamondBalance').textContent=wallet.available?`${t('balance')}: ${wallet.diamonds}`:t('purchaseError');
    const grid=$('collectionGrid');grid.replaceChildren();
    for(const item of FINISHES){
      const owned=ownsFinish(item),ready=item.unlock===0||Boolean(progress.cleared[item.unlock]),card=document.createElement('section');card.className='finish-card';
      const image=document.createElement('img');image.src=previews[item.id]||'/games/rux-salvage-yard/art/poster.webp';image.alt=`${item.name} · ${t('appearance')}`;const copy=document.createElement('div'),name=document.createElement('strong'),description=document.createElement('p');name.textContent=item.name;description.textContent=`${t('permanent')} · ${t('samePhysics')}`;copy.append(name,description);
      const button=document.createElement('button');button.type='button';button.textContent=owned?(equippedFinish().id===item.id?t('equipped'):t('equip')):!ready?t('unlock',{n:item.unlock}):item.cost?`${t('buy')} · ${t('price',{n:item.cost})}`:t('locked');button.disabled=purchasePending||(owned&&equippedFinish().id===item.id)||(!owned&&(!ready||!item.cost||!wallet.available||practice));
      button.addEventListener('click',()=>{if(owned){progress.selectedFinish=item.id;save();renderCollection();}else openPurchase(item);});card.append(image,copy,button);grid.append(card);
    }
    $('collectionMessage').textContent=practice?t('practiceNoPurchase'):'';
  };
  const showStageTab=next=>{stageTab=next;$('stagePage').hidden=next!=='stages';$('stagePage').classList.toggle('hidden',next!=='stages');$('collectionPage').hidden=next!=='collection';$('stagePage').inert=next!=='stages';$('collectionPage').inert=next!=='collection';$('stagesTab').setAttribute('aria-selected',String(next==='stages'));$('collectionTab').setAttribute('aria-selected',String(next==='collection'));if(next==='collection')renderCollection();else selector?.refresh(selected);};
  let purchaseItem=null,purchaseReturn=null;
  const openPurchase=item=>{if(purchasePending||practice)return;purchaseItem=item;purchaseReturn=document.activeElement;$('purchaseText').textContent=`${item.name} · ${t('permanent')} · ${t('samePhysics')} · ${t('price',{n:item.cost})} · ${t('balance')}: ${window.WeightPlayWallet.read().diamonds}`;$('purchaseMessage').textContent='';$('stageDialog').hidden=false;$('stageWorkspace').inert=true;$('stageScreen').querySelector('nav').inert=true;frame.activate('stage',{covered:true});$('purchaseCancel').focus();};
  const closePurchase=()=>{if(purchasePending)return;$('stageDialog').hidden=true;$('stageWorkspace').inert=false;$('stageScreen').querySelector('nav').inert=false;frame.activate('stage');purchaseItem=null;if(purchaseReturn?.isConnected)purchaseReturn.focus();};
  const setScreen=next=>{
    if(screen==='battle'&&next!=='battle'){cancelAnimationFrame(raf);view?.dispose();model?.dispose();view=model=null;audio?.stop();}
    screen=next;document.body.dataset.screen=next;
    for(const n of ['main','stage','battle']){$(n+'Screen').hidden=n!==next;$(n+'Screen').inert=n!==next;}
    $('guide').hidden=next!=='main';frame.activate(next);if(next==='stage')showStageTab('stages');
    $('mainProgress').textContent=`${t('stage')} ${progress.highestUnlocked} / 60`;
  };
  const closeDialog=()=>{$('dialog').hidden=true;$('battleLive').inert=false;paused=false;dialogMode='';last=performance.now();frame.activate('battle');if(dialogReturn?.isConnected&&dialogReturn.getClientRects().length&&!dialogReturn.disabled)dialogReturn.focus({preventScroll:true});};
  const refreshClampOptions=()=>{
    const select=$('clampTarget'),previous=select.value;select.replaceChildren();
    for(const body of model.bodies.filter(b=>!b.isStatic&&b!==model.ball&&!model.recoveredTargets.has(b))){
      const option=document.createElement('option'), side=t(['left','center','right'][body.plugin.column]);
      option.value=String(body.id);option.textContent=body.plugin.salvageKind==='target'?`${side} ${t('part')}${body.plugin.clampRequired?` (${t('required')})`:''}`:`${side} ${t(body.plugin.salvageKind)} ${t('support')} ${body.plugin.level+1}`;select.append(option);
    }
    if([...select.options].some(option=>option.value===previous))select.value=previous;
    $('clampCount').textContent=`${model.clampsRemaining} ${t('remaining')}`;$('clamp').disabled=!model.clampsRemaining||!select.options.length;
  };
  const dialog=(title,text,buttons,mode='result')=>{
    dialogReturn=document.activeElement;dialogMode=mode;paused=true;$('battleLive').inert=true;$('dialogTitle').textContent=title;$('dialogText').textContent=text;
    const actions=$('dialogActions');actions.replaceChildren();
    for(const [label,fn] of buttons){const b=document.createElement('button');b.textContent=label;b.addEventListener('click',fn,{once:true});actions.append(b);}
    $('dialog').hidden=false;frame.activate('battle',{covered:true});actions.querySelector('button')?.focus();
  };
  const start=async(index=slice)=>{
    if(startPending||pageClosed||index<0||index>=OPENING.length||(!practice&&index+1>progress.highestUnlocked))return;
    startPending=true;const originScreen=screen;
    try {
    if(practice&&!await LocalPractice.validate())return;
    if(pageClosed||screen!==originScreen)return;
    slice=index;
    selected=index;
    if(screen==='battle'){view?.dispose();model?.dispose();cancelAnimationFrame(raf);}
    else setScreen('battle');
    $('dialog').hidden=true;$('battleLive').inert=false;paused=false;frame.activate('battle');model=new SalvageSlice(window.Matter,slice===AVAILABLE ? {twoTargets:true} : {stage:OPENING[slice]});angle=.05;accum=0;$('power').value='60';$('powerValue').textContent='60%';
    // Match the checked initial rest state before accepting a player's first shot.
    for(let i=0;i<120;i++)model.step();
    $('clampTools').hidden=!model.stage?.clamps;$('battleLive').classList.toggle('has-clamp',Boolean(model.stage?.clamps));if(model.stage?.clamps)refreshClampOptions();
    try {view=new SalvageView($('arena'),a=>{if(!paused&&(model.state==='ready'||model.state==='flight'))angle=a;});view.setFinish(equippedFinish().color);}
    catch(e){console.error('RUX_GRAPHICS',e);dialog(t('graphics'),t('reload'),[[t('stages'),()=>setScreen('stage')]]);return;}
    sound('game.start');last=performance.now();raf=requestAnimationFrame(tick);if(slice===0){tutorialFull=false;tutorial.show();}
    } finally {startPending=false;}
  };
  const showResult=(won,reason)=>{
    let note='';
    if(won&&!practice){const key=String(slice+1),best=progress.cleared[key];progress.cleared[key]=best?Math.min(best,model.shots):model.shots;progress.highestUnlocked=Math.max(progress.highestUnlocked,Math.min(60,slice+2));const persisted=save();note=persisted?t('saved'):t('saveError');if(persisted)window.WonderAnalytics?.completeStage?.(slice+1);}
    if(won&&practice)note=t('practice');
    const buttons=[[t('replay'),()=>start()],[t('stages'),()=>{closeDialog();setScreen('stage');}]];
    if(won&&slice<59)buttons.unshift([t('next'),()=>start(slice+1)]);
    dialog(won?t('won'):reason?t('wrong'):t('lost'),won?`${t('winBody')} ${note}`:reason==='wrongOrder'?t('first'):reason==='wrongLast'?t('last'):reason==='wrongLink'?t('linked'):reason==='missingClamp'?t('clampRule'):t('lossText'),buttons);
  };
  const tick=now=>{
    if(screen!=='battle'||!model)return;
    const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
    const settingsOpen=Boolean(document.querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])'));
    if(!paused&&!document.hidden&&!settingsOpen){accum+=dt;while(accum>=1/60){model.step();accum-=1/60;}
      const events=model.drain(),reason=events.find(event=>['wrongOrder','wrongLink','wrongLast','missingClamp'].includes(event.type))?.type;
      for(const event of events){
        view.effect(event);
        if(event.type==='impact')sound(event.material==='wood'?'impact.wood':event.material==='target'||event.material==='metal'?'impact.metal':'impact.soft');
        if(event.type==='break')sound('impact.wood');
        if(event.type==='recovered')sound('reward.collect');
        if(event.type==='clamp')sound('mechanism.screw');if(event.type==='release')sound('mechanism.unlock');
        if(model.stage?.clamps&&['break','release','recovered'].includes(event.type))refreshClampOptions();
        if(event.type==='win'){sound('result.win');showResult(true);}if(event.type==='lose'){sound('result.lose');showResult(false,reason);}
        if(event.type==='stalled')dialog(t('stalled'),t('stalledBody'),[[t('replay'),()=>start()],[t('stages'),()=>{closeDialog();setScreen('stage');}]]);
      }
    }
    view.sync(model,angle,paused||document.hidden||settingsOpen?0:dt,Number($('power').value)/100);$('fire').disabled=paused||settingsOpen||model.state!=='ready';$('stageStat').textContent=String(slice+1);$('ballStat').textContent=String(model.limit-model.shots);$('partStat').textContent=`${model.recovered}/${model.targets.length}`;const objectives=[];if(model.stage?.firstColumn!==undefined)objectives.push(t('first'));if(model.stage?.lastColumn!==undefined)objectives.push(t('last'));if(model.stage?.sameShot)objectives.push(t('linked'));if(model.stage?.clampColumn!==undefined)objectives.push(t('clampRule'));$('status').textContent=[`${Math.round(angle*180/Math.PI)}°`,...objectives].join(' · ');
    raf=requestAnimationFrame(tick);
  };
  const fire=()=>{if(!paused&&!document.querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])')&&model?.shoot(angle,Number($('power').value)/100))sound('projectile.launch');};
  frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('localeSource'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:$('mainScreen').querySelector('.main-hero')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageWorkspace')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleLive')}}});
  const openHelp=()=>{dialog(t('howHeading'),'',[[t('continue'),()=>{tutorial.complete();closeDialog();}]],'help');const steps=tutorialFull?[t('goal'),t('how'),`${t('rules')} ${t('trajectory')} ${t('clampTime')}`]:[t('goal'),`${t('aim')} · ${t('how')}`,t('trajectory')];tutorial.render($('dialogText'),steps,tutorialFull?[t('first'),t('last'),t('linked'),t('clampRule')].join(' '):'');};
  tutorial=window.WeightPlayTutorial.createEmbedded({gameId:'rux-salvage-yard',open:openHelp,isSeen:()=>Boolean(progress.tutorialDone),onComplete(){if(!practice){progress.tutorialDone=true;save();}},canPersist:()=>!practice});
  const stat=(id,label)=>{const node=document.createElement('div'),caption=document.createElement('span'),value=document.createElement('strong');caption.textContent=label;value.id=id;value.textContent='0';node.append(caption,value);return node;};
  frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stat('stageStat',t('stage'))).add(stat('ballStat',t('ball'))).add(stat('partStat',t('part'))));
  selector=window.WeightPlayPlayUI.mountStage({page:$('stagePage'),rail:$('stageRail'),selected,config:{gameId:'rux-salvage-yard',count:AVAILABLE,poster:'/games/rux-salvage-yard/art/poster.webp',background:'/games/rux-salvage-yard/art/background.webp',stage(i){const d=OPENING[i],cleared=Boolean(progress.cleared[d.id]),locked=!practice&&d.id>progress.highestUnlocked,objectives=[];if(d.firstColumn!==undefined)objectives.push(t('first'));if(d.lastColumn!==undefined)objectives.push(t('last'));if(d.sameShot)objectives.push(t('linked'));if(d.clampColumn!==undefined)objectives.push(t('clampRule'));return{id:i+1,kicker:`${t('stage')} ${d.id}`,title:stageTitle(locale,d),subtitle:d.id<=30?t('chapter1'):t('chapter2'),summary:objectives.join(' ')||t('goal'),details:[`${d.shots} ${t('ball')}`,cleared?t('best',{n:progress.cleared[d.id]}):t('firstClear')],status:locked?t('locked'):cleared?t('cleared'):t('ready'),locked,cleared};}},isActive:()=>screen==='stage'&&stageTab==='stages',onSelect(i){selected=i;},onStart:start});
  $('startBtn').addEventListener('click',()=>setScreen('stage'));$('stageBack').addEventListener('click',()=>setScreen('main'));
  $('stagesTab').addEventListener('click',()=>showStageTab('stages'));$('collectionTab').addEventListener('click',()=>showStageTab('collection'));$('purchaseCancel').addEventListener('click',closePurchase);
  $('purchaseConfirm').addEventListener('click',async()=>{
    if(purchasePending||!purchaseItem||practice)return;const item=purchaseItem;purchasePending=true;$('purchaseConfirm').disabled=true;$('purchaseCancel').disabled=true;$('purchaseMessage').textContent=t('pending');
    try{const result=await window.WeightPlayWallet.purchasePermanent(`rux-salvage-yard:${item.id}`,item.cost);if(result.ok&&window.WeightPlayWallet.owns(`rux-salvage-yard:${item.id}`)){progress.selectedFinish=item.id;save();sound('shop.purchase');purchasePending=false;closePurchase();renderCollection();}else{$('purchaseMessage').textContent=t(result.reason==='insufficient'?'insufficient':'purchaseError');sound('feedback.error');}}
    catch{$('purchaseMessage').textContent=t('purchaseError');sound('feedback.error');}finally{purchasePending=false;$('purchaseConfirm').disabled=false;$('purchaseCancel').disabled=false;}
  });
  $('battleBack').addEventListener('click',()=>dialog(t('pause'),t('leaveQuestion'), [[t('continue'),closeDialog],[t('stages'),()=>{closeDialog();setScreen('stage');}]],'pause'));
  $('help').addEventListener('click',()=>{tutorialFull=true;tutorial.show(true);});
  $('fire').addEventListener('click',fire);$('power').addEventListener('input',()=>{$('powerValue').textContent=$('power').value+'%';});
  $('clamp').addEventListener('click',()=>{const body=model?.bodies.find(item=>String(item.id)===$('clampTarget').value);if(!paused&&model?.clampBody(body)){refreshClampOptions();}else sound('feedback.error');});
  document.addEventListener('keydown',e=>{const modal=!$('stageDialog').hidden?$('stageDialog'):!$('dialog').hidden?$('dialog'):null;if(modal){if(e.key==='Escape'){if(modal===$('stageDialog')&&!purchasePending)closePurchase();else if(dialogMode==='help'){tutorial.complete();closeDialog();}else if(dialogMode==='pause')closeDialog();e.preventDefault();}if(e.key==='Tab'){const focus=[...modal.querySelectorAll('button,select,input,a')].filter(node=>!node.disabled&&node.getClientRects().length);if(focus.length){const first=focus[0],last=focus.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}return;}if(screen!=='battle'||paused||e.target.matches('input,select,button'))return;if(e.key==='Escape'){e.preventDefault();$('battleBack').click();}if(e.key==='ArrowUp'){angle=Math.min(1.1,angle+.03);e.preventDefault();}if(e.key==='ArrowDown'){angle=Math.max(-.1,angle-.03);e.preventDefault();}if(e.code==='Space'){e.preventDefault();fire();}});
  document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden&&screen==='battle'&&!paused)dialog(t('pause'),t('leaveQuestion'),[[t('continue'),closeDialog],[t('stages'),()=>{closeDialog();setScreen('stage');}]],'pause');});
  window.addEventListener('pagehide',()=>{pageClosed=true;cancelAnimationFrame(raf);view?.dispose();model?.dispose();selector.destroy();frame.destroy();audio?.dispose();tutorial.destroy();},{once:true});
  LocalPractice.register({gameId:'rux-salvage-yard',stageIds:OPENING.map(d=>d.id),enable(value){practice=value;selector.refresh(selected);},startStage:id=>start(Number(id)-1)});
  const poster=document.querySelector('[data-wp-frame-poster]');
  window.WeightPlayAudio?.preload?.(['feedback.error','game.start','impact.metal','impact.soft','impact.wood','mechanism.screw','mechanism.unlock','projectile.launch','result.lose','result.win','reward.collect','shop.purchase']);
  const ready=()=>{if(poster.naturalWidth){$('startBtn').disabled=false;window.WeightPlayGameEntryLoader?.ready();}else window.WeightPlayGameEntryLoader?.fail();};
  if(poster.complete)ready();else{poster.addEventListener('load',ready,{once:true});poster.addEventListener('error',ready,{once:true});}
  $('localeSource').addEventListener('change',()=>window.WonderI18n?.setLocale?.($('localeSource').value));
  if(saveWarning)$('saveWarning').hidden=false;$('mainProgress').textContent=`${t('stage')} ${progress.highestUnlocked} / 60`;frame.activate('main');
}
