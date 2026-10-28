import { SalvageSlice } from './model.mjs';
import { SalvageView, finishPreviews } from './render.mjs';
import { OPENING } from './campaign.mjs';
import { LocalPractice } from '/src/game-local-practice.mjs';
import { LOCALES, ROUTES, text, title, stageTitle, stageChapter, renderStaticGuide } from './copy.mjs';

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
const stars=(shots,limit)=>shots<=Math.max(1,Math.floor(limit/2))?3:shots<=Math.floor(limit*3/4)?2:1;
if (new URLSearchParams(location.search).get('preview') !== '1') {
  $('gameFrame').hidden=true; $('guide').hidden=true; $('comingSoon').hidden=false;
} else {
  const audio=window.WeightPlayAudio?.createScope();
  const sound=id=>audio?.play(id);
  const zoomButton=document.createElement('button');zoomButton.type='button';zoomButton.id='zoomView';zoomButton.textContent='+';zoomButton.setAttribute('aria-label',t('zoomIn'));zoomButton.setAttribute('aria-pressed','false');$('controls').insertBefore(zoomButton,$('help'));
  const recoveryNotice=document.createElement('div');recoveryNotice.id='recoveryNotice';recoveryNotice.hidden=true;recoveryNotice.setAttribute('role','status');recoveryNotice.setAttribute('aria-live','polite');$('arena').append(recoveryNotice);let recoveryTime=0;
  const resetZoom=()=>{zoomButton.textContent='+';zoomButton.setAttribute('aria-label',t('zoomIn'));zoomButton.setAttribute('aria-pressed','false');};
  const FINISHES=[{id:'workshop',color:0x187e79,unlock:0},{id:'moss',color:0x659657,unlock:5},{id:'ocean',color:0x428eb8,unlock:15},{id:'brass',color:0xd79c37,unlock:30},{id:'dusk',color:0x926ab0,unlock:45},{id:'moon-enamel',color:0xdce9f5,unlock:5,cost:12},{id:'copper-dawn',color:0xc66947,unlock:60}].map((item,i)=>({...item,name:t(`item${i}`)}));
  const STORE='weightplay-rux-salvage-yard-v1';
  let progress={version:1,highestUnlocked:1,cleared:{},selectedFinish:'workshop'},saveWarning=false;
  try{const raw=localStorage.getItem(STORE);if(raw){const saved=JSON.parse(raw);if(saved.version!==1||!Number.isInteger(saved.highestUnlocked)||saved.highestUnlocked<1||saved.highestUnlocked>60||!saved.cleared||typeof saved.cleared!=='object'||Array.isArray(saved.cleared))throw Error('invalid save');const cleared={};for(const [key,value] of Object.entries(saved.cleared)){const id=Number(key),stage=OPENING[id-1];if(!/^[1-9]\d*$/.test(key)||!stage||!Number.isSafeInteger(value)||value<1){saveWarning=true;continue;}cleared[key]=value;}progress={...progress,...saved,cleared};if(typeof progress.selectedFinish!=='string'||!FINISHES.some(item=>item.id===progress.selectedFinish)){progress.selectedFinish='workshop';saveWarning=true;}for(const flag of ['tutorialDone','clampIntroDone'])if(progress[flag]!==undefined&&typeof progress[flag]!=='boolean'){progress[flag]=false;saveWarning=true;}}}catch{saveWarning=true;}
  const save=()=>{if(practice)return false;try{localStorage.setItem(STORE,JSON.stringify(progress));$('saveWarning').hidden=true;return true;}catch{$('saveWarning').hidden=false;return false;}};
  let screen='main',stageTab='stages',model=null,view=null,frame,selector,tutorial,tutorialFull=false,dialogMode='',dialogReturn=null,raf=0,last=0,accum=0,angle=.05,paused=false,fastForward=false,slice=0,selected=progress.highestUnlocked-1,practice=false,previews=null,purchasePending=false,startPending=false,pageClosed=false,clampChoice=null;
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
  const refreshClampCount=()=>{const seconds=Math.ceil(Math.max(0,...model.clamped.map(item=>item.remaining)));const message=`${model.clampsRemaining} ${t('remaining')}${seconds?` · ${seconds} s`:''}`;if($('clampCount').textContent!==message)$('clampCount').textContent=message;};
  const refreshClampOptions=()=>{
    const select=$('clampTarget'),previous=clampChoice??select.value;select.replaceChildren();
    for(const body of model.bodies.filter(b=>!b.isStatic&&b!==model.ball&&!model.recoveredTargets.has(b))){
      const option=document.createElement('option'),side=t(body.position.x<580?'left':body.position.x<740?'center':'right');
      const markers=[body.plugin.first?'X':'',body.plugin.last?'T':'',body.plugin.linked?'↔':''].filter(Boolean).join(' ');
      option.value=String(body.id);option.textContent=body.plugin.salvageKind==='target'?`${side} ${t('part')}${markers?` (${markers})`:''}${body.plugin.clampRequired?` (${t('required')})`:''}`:`${side} ${t(body.plugin.salvageKind)} ${t('support')} ${body.plugin.level+1}`;select.append(option);
    }
    if([...select.options].some(option=>option.value===previous))select.value=previous;
    else {const required=model.targets.find(body=>body.plugin.clampRequired&&!body.plugin.wasClamped&&!body.isStatic&&model.bodies.includes(body));const last=model.targets.find(body=>body.plugin.last&&!body.isStatic&&model.bodies.includes(body));if(required||last)select.value=String((required||last).id);}
    refreshClampCount();$('clamp').disabled=!model.clampsRemaining||!select.options.length;
  };
  const dialog=(title,text,buttons,mode='result')=>{
    dialogReturn=document.activeElement;dialogMode=mode;paused=true;$('battleLive').inert=true;$('dialog').dataset.mode=mode;$('dialogTitle').textContent=title;$('dialogText').textContent=text;$('dialogText').tabIndex=mode==='help'?0:-1;
    const actions=$('dialogActions');actions.replaceChildren();
    for(const [label,fn,disabled=false] of buttons){const b=document.createElement('button');b.textContent=label;b.disabled=disabled;b.addEventListener('click',fn,{once:true});actions.append(b);}
    $('dialog').hidden=false;frame.activate('battle',{covered:true});actions.querySelector('button:not(:disabled)')?.focus();
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
    $('dialog').hidden=true;$('battleLive').inert=false;paused=false;fastForward=false;frame.activate('battle');model=new SalvageSlice(window.Matter,slice===AVAILABLE ? {twoTargets:true} : {stage:OPENING[slice]});angle=.05;accum=0;$('power').value='60';$('powerValue').textContent='60%';
    // Match the checked initial rest state before accepting a player's first shot.
    for(let i=0;i<120;i++)model.step();
    clampChoice=null;recoveryTime=0;recoveryNotice.hidden=true;$('arena').classList.toggle('chapter-two',slice>=30);$('clampTools').hidden=!model.stage?.clamps;$('battleLive').classList.toggle('has-clamp',Boolean(model.stage?.clamps));if(model.stage?.clamps)refreshClampOptions();
    try {view=new SalvageView($('arena'),a=>{if(!paused&&(model.state==='ready'||model.state==='flight'))angle=a;},()=>{if(screen==='battle'){audio?.stop();dialog(t('graphics'),t('reload'),[[t('reload'),()=>start()],[t('stages'),()=>{closeDialog();setScreen('stage');}]],'error');}});view.setFinish(equippedFinish().color);resetZoom();}
    catch(e){console.error('RUX_GRAPHICS',e);dialog(t('graphics'),t('reload'),[[t('stages'),()=>setScreen('stage')]],'error');return;}
    view.renderer.domElement.focus({preventScroll:true});sound('game.start');last=performance.now();raf=requestAnimationFrame(tick);if(slice===0){tutorialFull=false;tutorial.show();}else if(slice===30&&!progress.clampIntroDone){dialog(t('target'),`${t('clampIntro')} ${t('clampAdvice')}`,[[t('continue'),()=>{if(!practice){progress.clampIntroDone=true;save();}closeDialog();}]],'help');}
    } finally {startPending=false;}
  };
  const showResult=(won,reason)=>{
    let note='';
    if(won&&!practice){const key=String(slice+1),best=progress.cleared[key];progress.cleared[key]=best?Math.min(best,model.shots):model.shots;progress.highestUnlocked=Math.max(progress.highestUnlocked,Math.min(60,slice+2));const persisted=save();note=persisted?t('saved'):t('saveError');if(persisted)window.WonderAnalytics?.completeStage?.(slice+1);}
    if(won&&practice)note=t('practice');
    const buttons=[[t('stages'),()=>{closeDialog();setScreen('stage');}],[t('next'),()=>start(slice+1),!won||slice>=59],[t('replay'),()=>start()]];
    const rating=won?`${t('mastery')}: ${'★'.repeat(stars(model.shots,model.limit))} (${model.shots}/${model.limit} ${t('ball')}). `:'';
    dialog(won?t('won'):reason?t('wrong'):t('lost'),won?`${t('winBody')} ${rating}${note}`:reason==='wrongOrder'?t('first'):reason==='wrongLast'?t('last'):reason==='wrongLink'?t('linked'):reason==='missingClamp'?t('clampRule'):t('lossText'),buttons);
  };
  const tick=now=>{
    if(screen!=='battle'||!model)return;
    const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
    const settingsOpen=Boolean(document.querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])'));
    if(!paused&&!document.hidden&&!settingsOpen){accum+=dt*(fastForward&&model.state==='flight'?2:1);while(accum>=1/60){model.step();accum-=1/60;}
      const events=model.drain(),reason=events.find(event=>['wrongOrder','wrongLink','wrongLast','missingClamp'].includes(event.type))?.type;
      const collected=events.filter(event=>event.type==='recovered').length;if(collected){recoveryNotice.textContent=`✦ +${collected}`;recoveryNotice.setAttribute('aria-label',`${t('part')} ${model.recovered}/${model.targets.length}`);recoveryNotice.hidden=false;recoveryTime=1;}
      for(const event of events){
        view.effect(event);
        if(event.type==='impact')sound(event.material==='wood'||event.material==='beam'?'impact.wood':event.material==='target'||event.material==='metal'?'impact.metal':'impact.soft');
        if(event.type==='recovered')sound('reward.collect');
        if(event.type==='clamp')sound('mechanism.screw');if(event.type==='release')sound('mechanism.unlock');
        if(model.stage?.clamps&&['break','release','recovered','ready'].includes(event.type))refreshClampOptions();
        if(event.type==='win'){sound('result.win');showResult(true);}if(event.type==='lose'){sound('result.lose');showResult(false,reason);}
        if(event.type==='stalled')dialog(t('stalled'),t('stalledBody'),[[t('replay'),()=>start()],[t('stages'),()=>{closeDialog();setScreen('stage');}]],'error');
      }
    }
    // The physics stays stopped under every dialog, while a final recovery
    // burst may finish behind a result instead of freezing on its first frame.
    const visualDt=document.hidden||settingsOpen||(paused&&dialogMode!=='result')?0:dt;
    if(recoveryTime>0){recoveryTime=Math.max(0,recoveryTime-visualDt);if(!recoveryTime)recoveryNotice.hidden=true;}
    if(!view.contextLost)view.sync(model,angle,visualDt,Number($('power').value)/100);if(model.stage?.clamps)refreshClampCount();if(model.state!=='flight')fastForward=false;const settling=model.state==='flight',canSpeed=settling&&model.elapsed>=.6,fireLabel=settling?(fastForward?'1×':'2×'):t('fire'),fireAria=settling?t(fastForward?'speedNormal':'speedUp'):t('fire');$('fire').disabled=paused||settingsOpen||(!canSpeed&&model.state!=='ready');if($('fire').textContent!==fireLabel)$('fire').textContent=fireLabel;if($('fire').getAttribute('aria-label')!==fireAria){$('fire').setAttribute('aria-label',fireAria);$('fire').title=fireAria;}const fireAction=settling?'speed':'fire';if($('fire').dataset.action!==fireAction)$('fire').dataset.action=fireAction;$('stageStat').textContent=String(slice+1);$('ballStat').textContent=String(model.limit-model.shots);$('partStat').textContent=`${model.recovered}/${model.targets.length}`;const objectives=[];if(model.stage?.firstColumn!==undefined&&model.recovered===0)objectives.push(t('first'));if(model.stage?.lastColumn!==undefined&&model.targets.some(body=>body.plugin.last&&!model.recoveredTargets.has(body)))objectives.push(t('last'));if(model.stage?.sameShot&&model.targets.some(body=>body.plugin.linked&&!model.recoveredTargets.has(body)))objectives.push(t('linked'));if(model.stage?.clampColumn!==undefined&&model.targets.some(body=>body.plugin.clampRequired&&!body.plugin.wasClamped&&!model.recoveredTargets.has(body)))objectives.push(t('clampRule'));const status=settling?`${t('settling')} · ${fastForward?'2×':'1×'}`:[`${(angle*180/Math.PI).toFixed(1)}°`,...objectives].join(' · ');if($('status').textContent!==status)$('status').textContent=status;
    raf=requestAnimationFrame(tick);
  };
  const fire=()=>{if(paused||document.querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])')||!model)return;if(model.state==='flight'){if(model.elapsed>=.6)fastForward=!fastForward;return;}if(model.shoot(angle,Number($('power').value)/100))sound('projectile.launch');};
  frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('localeSource'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:$('mainScreen').querySelector('.main-hero')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageWorkspace')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleLive')}}});
  const openHelp=()=>{dialog(t('howHeading'),'',[[t('continue'),()=>{tutorial.complete();closeDialog();}]],'help');const steps=tutorialFull?[`${t('goal')} ${t('how')}`,`${t('rules')} ${t('fineAim')}`,`${t('trajectory')} ${t('clampTime')} ${t('clampAdvice')} ${t('zoomHint')} ${t('speedHint')} ${t('medalHint')}`]:[t('goal'),`${t('aim')} · ${t('how')}`,`${t('contactMark')} ${t('zoomHint')}`];tutorial.render($('dialogText'),steps,tutorialFull?[t('first'),t('last'),t('linked'),t('clampRule')].join(' '):'');};
  tutorial=window.WeightPlayTutorial.createEmbedded({gameId:'rux-salvage-yard',open:openHelp,isSeen:()=>Boolean(progress.tutorialDone),onComplete(){if(!practice){progress.tutorialDone=true;save();}},canPersist:()=>!practice});
  const stat=(id,label)=>{const node=document.createElement('div'),caption=document.createElement('span'),value=document.createElement('strong');caption.textContent=label;value.id=id;value.textContent='0';node.append(caption,value);return node;};
  frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stat('stageStat',t('stage'))).add(stat('ballStat',t('ball'))).add(stat('partStat',t('part'))));
  selector=window.WeightPlayPlayUI.mountStage({page:$('stagePage'),rail:$('stageRail'),selected,config:{gameId:'rux-salvage-yard',count:AVAILABLE,poster:'/games/rux-salvage-yard/art/poster.webp',background:'/games/rux-salvage-yard/art/background.webp',stage(i){const d=OPENING[i],cleared=Boolean(progress.cleared[d.id]),locked=!practice&&d.id>progress.highestUnlocked,objectives=[];if(d.firstColumn!==undefined)objectives.push(t('first'));if(d.lastColumn!==undefined)objectives.push(t('last'));if(d.sameShot)objectives.push(t('linked'));if(d.clampColumn!==undefined)objectives.push(t('clampRule'));const hint=d.reflector?t('reboundTip'):'',clampHint=d.clamps?t('clampAdvice'):'',bridgeHint=d.bridge?t('bridgeTip'):'';return{id:i+1,kicker:`${t('stage')} ${d.id}`,title:stageTitle(locale,d),subtitle:stageChapter(locale,d.id),summary:objectives.join(' ')||bridgeHint||hint||clampHint||t('goal'),details:[...(objectives.length?objectives:[t('goal')]),...(hint?[hint]:[]),...(clampHint?[clampHint]:[]),...(bridgeHint?[bridgeHint]:[]),`${d.shots} ${t('ball')}`,cleared?`${t('best',{n:progress.cleared[d.id]})} · ${t('mastery')}: ${'★'.repeat(stars(progress.cleared[d.id],d.shots))}`:t('firstClear')],status:locked?t('locked'):cleared?t('cleared'):t('ready'),locked,cleared};}},isActive:()=>screen==='stage'&&stageTab==='stages',onSelect(i){selected=i;},onStart:start});
  $('startBtn').addEventListener('click',()=>setScreen('stage'));$('stageBack').addEventListener('click',()=>setScreen('main'));
  $('stagesTab').addEventListener('click',()=>showStageTab('stages'));$('collectionTab').addEventListener('click',()=>showStageTab('collection'));$('purchaseCancel').addEventListener('click',closePurchase);
  $('purchaseConfirm').addEventListener('click',async()=>{
    if(purchasePending||!purchaseItem||practice)return;const item=purchaseItem;purchasePending=true;$('purchaseConfirm').disabled=true;$('purchaseCancel').disabled=true;$('purchaseMessage').textContent=t('pending');
    try{const result=await window.WeightPlayWallet.purchasePermanent(`rux-salvage-yard:${item.id}`,item.cost);if(result.ok&&window.WeightPlayWallet.owns(`rux-salvage-yard:${item.id}`)){progress.selectedFinish=item.id;save();sound('shop.purchase');purchasePending=false;closePurchase();renderCollection();}else{$('purchaseMessage').textContent=t(result.reason==='insufficient'?'insufficient':'purchaseError');sound('feedback.error');}}
    catch{$('purchaseMessage').textContent=t('purchaseError');sound('feedback.error');}finally{purchasePending=false;$('purchaseConfirm').disabled=false;$('purchaseCancel').disabled=false;}
  });
  $('battleBack').addEventListener('click',()=>dialog(t('pause'),t('leaveDetails',{n:slice+1}), [[t('continue'),closeDialog],[t('stages'),()=>{closeDialog();setScreen('stage');}]],'pause'));
  $('help').addEventListener('click',()=>{tutorialFull=true;tutorial.show(true);});
  zoomButton.addEventListener('click',()=>{if(!view||paused)return;const focused=zoomButton.getAttribute('aria-pressed')!=='true';view.setFocused(focused);zoomButton.setAttribute('aria-pressed',String(focused));zoomButton.setAttribute('aria-label',t(focused?'zoomOut':'zoomIn'));zoomButton.textContent=focused?'−':'+';});
  $('fire').addEventListener('click',fire);$('power').addEventListener('input',()=>{$('powerValue').textContent=$('power').value+'%';});
  $('clampTarget').addEventListener('change',()=>{clampChoice=$('clampTarget').value;});
  $('clampTarget').addEventListener('keydown',event=>{const select=event.currentTarget;if(!select.options.length||!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;const next=event.key==='Home'?0:event.key==='End'?select.options.length-1:Math.max(0,Math.min(select.options.length-1,select.selectedIndex+(event.key==='ArrowUp'?-1:1)));event.preventDefault();if(next!==select.selectedIndex){select.selectedIndex=next;select.dispatchEvent(new Event('change',{bubbles:true}));}});
  $('clamp').addEventListener('click',()=>{const body=model?.bodies.find(item=>String(item.id)===$('clampTarget').value);if(!paused&&model?.clampBody(body)){clampChoice=String(body.id);refreshClampOptions();}else sound('feedback.error');});
  document.addEventListener('keydown',e=>{const modal=!$('stageDialog').hidden?$('stageDialog'):!$('dialog').hidden?$('dialog'):null;if(modal){if(e.key==='Escape'){if(modal===$('stageDialog')&&!purchasePending)closePurchase();else if(dialogMode==='help'){tutorial.complete();closeDialog();}else if(dialogMode==='pause')closeDialog();e.preventDefault();}if(e.key==='Tab'){const focus=[...modal.querySelectorAll('button,select,input,a,[tabindex="0"]')].filter(node=>!node.disabled&&node.getClientRects().length);if(focus.length){const first=focus[0],last=focus.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}return;}if(screen!=='battle'||paused||document.querySelector('[data-wp-preferences] .wp-frame-popover:not([hidden])'))return;if(e.key==='Escape'){e.preventDefault();$('battleBack').click();return;}if(e.target.matches('input,select'))return;const increment=e.shiftKey ? .005 : .03;if(e.key==='ArrowUp'){angle=Math.min(1.1,angle+increment);e.preventDefault();}if(e.key==='ArrowDown'){angle=Math.max(-.1,angle-increment);e.preventDefault();}if(e.code==='Space'&&!e.target.matches('button')){e.preventDefault();fire();}});
  document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden&&screen==='battle'&&!paused)dialog(t('pause'),t('leaveDetails',{n:slice+1}),[[t('continue'),closeDialog],[t('stages'),()=>{closeDialog();setScreen('stage');}]],'pause');});
  window.addEventListener('pagehide',()=>{pageClosed=true;cancelAnimationFrame(raf);view?.dispose();model?.dispose();selector.destroy();frame.destroy();audio?.dispose();tutorial.destroy();},{once:true});
  LocalPractice.register({gameId:'rux-salvage-yard',stageIds:OPENING.map(d=>d.id),enable(value){practice=value;selector.refresh(selected);},startStage:id=>start(Number(id)-1)});
  const poster=document.querySelector('[data-wp-frame-poster]');
  window.WeightPlayAudio?.preload?.(['feedback.error','game.start','impact.metal','impact.soft','impact.wood','mechanism.screw','mechanism.unlock','projectile.launch','result.lose','result.win','reward.collect','shop.purchase']);
  const ready=()=>{if(poster.naturalWidth){$('startBtn').disabled=false;window.WeightPlayGameEntryLoader?.ready();}else window.WeightPlayGameEntryLoader?.fail();};
  if(poster.complete)ready();else{poster.addEventListener('load',ready,{once:true});poster.addEventListener('error',ready,{once:true});}
  $('localeSource').addEventListener('change',()=>window.WonderI18n?.setLocale?.($('localeSource').value));
  if(saveWarning)$('saveWarning').hidden=false;$('mainProgress').textContent=`${t('stage')} ${progress.highestUnlocked} / 60`;frame.activate('main');
}
