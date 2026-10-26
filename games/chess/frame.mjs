// Game content is supplied to the shared frame; no local shell/card geometry.
export function mountChessFrame({onStageBack}) {
 const $=id=>document.getElementById(id);
 const requiredStyles=['/src/game-ui-theme.css','/src/game-page-info.css','/games/chess/full-game.css','/games/chess/interface-i9.css',
  '/src/game-screen-frame.css','/src/game-play-ui.css','/src/interface9-shared-screens.css','/src/battle-canvas-standard.css'];
 const stylesReady=requiredStyles.every(path=>[...document.styleSheets].some(sheet=>{
  if(!sheet.href||new URL(sheet.href).pathname!==path)return false;
  try{return sheet.cssRules.length>0;}catch{return false;}
 }));
 if(!window.WonderI18n||!window.WeightPlayStageRailI9?.attachLogical||!stylesReady||!window.WeightPlayScreenFrame?.mount||!window.WeightPlayPlayUI?.mountStage||!window.WeightPlayBattleCanvas){window.WeightPlayGameEntryLoader?.fail(undefined,()=>location.reload());return;}
 const main=$('mainScene'),stage=$('chessStages'),battle=$('battle');
 const app=$('chessFrame');
 main.className='chess-main-scene';
 const header=main.querySelector('header'),hero=$('main'),poster=hero.querySelector('img');
 const parkedActions=document.createElement('div');parkedActions.hidden=true;app.append(parkedActions);
 $('title').dataset.wpFrameTitle='';$('title').dataset.wpGameTitle='';
 const copy=document.createElement('div');copy.dataset.wpFrameCopy='';
 for(const node of [...hero.children])if(node!==poster)copy.append(node);
 hero.append(copy);poster.dataset.wpFramePoster='';$('intro').dataset.wpFrameSummary='';
 $('campaignProgress').dataset.wpFrameProgress='';$('challenges').dataset.wpFrameAction='primary';
 const stageHeader=stage.querySelector('header');
 const stageTitle=document.createElement('h1');stageTitle.dataset.wpFrameTitle='';stageTitle.hidden=true;stageHeader.append(stageTitle);
 stageHeader.querySelector('[data-wp-return]').onclick=onStageBack;
 const oldBattleHeader=battle.querySelector('.topbar'),info=$('status'),back=$('back');
 const battleHeader=document.createElement('header');oldBattleHeader.replaceWith(battleHeader);
 const battleTitle=document.createElement('h1');battleTitle.dataset.wpFrameTitle='';battleTitle.hidden=true;
 battleHeader.replaceChildren(back,battleTitle);
 const workspace=document.createElement('div');workspace.id='chessBattleContent';
 workspace.append($('arena'),$('controls'),$('saved'));battleHeader.after(workspace);
 for(const button of $('controls').querySelectorAll('button'))button.dataset.wpFrameAction='secondary';
 const frame=window.WeightPlayScreenFrame.mount({root:app,playUI:true,scenes:{
  main:{root:main,header,content:hero},
  stage:{root:stage,header:stageHeader,content:$('chessStagePage')},
  battle:{root:battle,header:battleHeader,content:workspace},
 }});
 const group=window.WeightPlayScreenFrame.createGroup();group.add(info);frame.battleTopUI.add(group);
 const fullMatch=$('start'),resume=$('resume');
 fullMatch.dataset.wpFrameAction='tab';resume.dataset.wpFrameAction='tab';
 frame.commonDownButton.clear().add(fullMatch);parkedActions.append(resume);
 const result=$('result');result.setAttribute('role','dialog');result.setAttribute('aria-modal','true');
 for(const button of result.querySelectorAll('button'))button.dataset.wpFrameAction='secondary';
 result.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const controls=[...result.querySelectorAll('button:not([disabled])')].filter(node=>!node.hidden&&node.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&(document.activeElement===first||!controls.includes(document.activeElement))){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 });
 let previous='main';
 const sync=()=>{
  const nav=frame.commonDownButton.element;
  if(resume.hidden&&resume.parentElement===nav){frame.commonDownButton.remove(resume);parkedActions.append(resume);}
  else if(!resume.hidden&&resume.parentElement!==nav)frame.commonDownButton.add(resume);
  const scene=document.body.dataset.screen||'main',covered=scene==='battle'&&!$('result').hidden;
  frame.activate(scene,{covered});window.WeightPlayBattleCanvas.sync();
  if(previous==='stage'&&scene==='main')requestAnimationFrame(()=>$('challenges').focus({preventScroll:true}));
  previous=scene;
 };
 window.addEventListener('weightplay:shell-sync',sync);sync();
 workspace.addEventListener('focusin',()=>{if(battle.querySelector('.wp-frame-popover:not([hidden])'))frame.close();});
 const loader=window.WeightPlayGameEntryLoader;loader.begin(1);
 let settled=false;const timer=setTimeout(fail,20000);
 function fail(){if(settled)return;settled=true;clearTimeout(timer);loader.fail(undefined,()=>location.reload());}
 const image=new Image();image.onload=()=>{if(settled)return;settled=true;clearTimeout(timer);loader.assetProgress(1,1);$('challenges').disabled=false;loader.ready();};image.onerror=fail;image.src=poster.src;
 window.addEventListener('pagehide',event=>{clearTimeout(timer);image.onload=image.onerror=null;if(!event.persisted)frame.destroy();});
 window.addEventListener('pageshow',event=>{if(event.persisted){if(!settled)location.reload();else sync();}});
 return frame;
}
