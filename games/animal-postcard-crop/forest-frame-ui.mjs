import {COST,DIAMOND_ASSET,PREFERENCE_KEY,locales,format,createFrameController} from './forest-postage-frame.mjs';

// Unwired candidate. Supply a Stage-owned host and dialogHost from the game.
// onSelection reports an owned selection; integrating it into the board is a
// separate task. Previewing or opening the dialog never purchases an item.
let nextId=0;
export function mountForestFrame({host,dialogHost,getLocale,wallet,storage,onSelection=()=>{}}={}) {
  const doc=host?.ownerDocument;
  if(!doc?.createElement || !host?.append || !dialogHost?.append || dialogHost.ownerDocument!==doc)
    throw Error('FRAME_SHOP_HOST_REQUIRED');
  const win=doc.defaultView || globalThis.window, id=++nextId;
  const node=(tag,className,parent)=>{const item=doc.createElement(tag);if(className)item.className=className;parent?.append(item);return item;};
  const entry=node('button','pc-frame-shop-entry',host);entry.type='button';entry.dataset.wpFrameAction='secondary';entry.setAttribute('aria-haspopup','dialog');
  const dialog=node('dialog','pc-frame-shop-dialog',dialogHost);dialog.tabIndex=-1;
  dialog.setAttribute('aria-labelledby',`pc-frame-shop-title-${id}`);dialog.setAttribute('aria-describedby',`pc-frame-shop-description-${id}`);
  const shell=node('div','pc-frame-shop-shell',dialog),title=node('h2','pc-frame-shop-title',shell),description=node('p','pc-frame-shop-description',shell);
  title.id=`pc-frame-shop-title-${id}`;description.id=`pc-frame-shop-description-${id}`;
  const previewLabel=node('p','pc-frame-shop-preview-label',shell);
  const preview=node('div','pc-frame-shop-preview',shell);preview.setAttribute('aria-hidden','true');
  const sample=node('div','pc-frame-shop-sample',preview);
  const art=node('img','pc-frame-shop-art',sample);art.src='/games/animal-postcard-crop/assets/stage60-forest-postage-frame-v9-draft.png';art.alt='';
  const choices=node('div','pc-frame-shop-choices',shell),original=node('button','',choices),forest=node('button','',choices);
  original.type=forest.type='button';original.dataset.pcFrameAction='preview-original';forest.dataset.pcFrameAction='preview-forest';
  const balance=node('p','pc-frame-shop-balance',shell),balanceIcon=node('img','pc-frame-shop-diamond',balance),balanceText=node('span','',balance);
  balanceIcon.src=DIAMOND_ASSET;balanceIcon.alt='';balanceIcon.setAttribute('aria-hidden','true');
  const price=node('p','pc-frame-shop-price',shell),priceIcon=node('img','pc-frame-shop-diamond',price),priceText=node('span','',price);
  priceIcon.src=DIAMOND_ASSET;priceIcon.alt='';priceIcon.setAttribute('aria-hidden','true');
  const permanent=node('p','pc-frame-shop-permanent',shell),ownership=node('p','pc-frame-shop-owned',shell),question=node('p','pc-frame-shop-question',shell);
  const status=node('p','pc-frame-shop-status',shell);status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const actions=node('div','pc-frame-shop-actions',shell),apply=node('button','',actions),buy=node('button','',actions),confirm=node('button','',actions),cancel=node('button','',actions);
  apply.type=buy.type=confirm.type=cancel.type='button';
  apply.dataset.pcFrameAction='apply';buy.dataset.pcFrameAction='buy';confirm.dataset.pcFrameAction='confirm';cancel.dataset.pcFrameAction='cancel';
  let destroyed=false,confirming=false,chosen='forest',message=null,priorFocus=null,controller,lastSelection=null;
  const locale=()=>{const value=typeof getLocale==='function'?getLocale():doc.documentElement.lang;return locales[value]?value:'en';};
  const tr=(key,vars={})=>format(locale(),key,vars);
  function render(){
    if(destroyed||!controller)return;
    const current=controller.read();
    // Another tab may buy this while the confirmation is open. Switch to the
    // owned-item action instead of offering a misleading second confirmation.
    const restoreApplyFocus=confirming&&current.owned&&!current.pending&&doc.activeElement===confirm;
    if(confirming&&current.owned&&!current.pending)confirming=false;
    if(lastSelection!==current.selected){try{onSelection(current.selected);lastSelection=current.selected;}catch{/* Consumer may retry on refresh. */}}
    entry.textContent=tr('entry');title.textContent=tr('title');description.textContent=tr('description');previewLabel.textContent=tr('preview');
    preview.dataset.pcFramePreview=chosen;original.textContent=tr('original');forest.textContent=tr('forest');
    original.setAttribute('aria-pressed',String(chosen==='original'));forest.setAttribute('aria-pressed',String(chosen==='forest'));
    balanceText.textContent=current.available?`${tr('balance',{balance:current.balance})} ${tr('currency')}`:tr('unavailable');
    priceText.textContent=`${tr('price',{cost:COST})} ${tr('currency')}`;permanent.textContent=tr('permanent');
    ownership.textContent=current.owned?tr('owned'):'';question.textContent=confirming?tr('confirmQuestion',{cost:COST}):'';
    apply.textContent=tr('apply');buy.textContent=tr('buy');confirm.textContent=tr('confirm');cancel.textContent=tr('cancel');
    apply.hidden=confirming||(chosen==='forest'&&!current.owned);buy.hidden=confirming||chosen!=='forest'||current.owned===true;confirm.hidden=!confirming;
    original.disabled=forest.disabled=apply.disabled=cancel.disabled=current.pending;
    buy.disabled=confirm.disabled=current.pending||!current.available||current.balance<COST;
    if(current.pending)status.textContent=tr('busy');else if(message)status.textContent=tr(message);
    else if(!current.available&&chosen==='forest')status.textContent=tr('unavailable');
    else if(!current.owned&&chosen==='forest'&&current.balance<COST)status.textContent=tr('insufficient');else status.textContent='';
    if(restoreApplyFocus)apply.focus();
  }
  controller=createFrameController({wallet,storage,onChange:render});
  function open(){
    if(destroyed||dialog.open)return;
    if(typeof dialog.showModal!=='function')throw Error('FRAME_SHOP_DIALOG_UNAVAILABLE');
    priorFocus=doc.activeElement;confirming=false;message=null;
    const current=controller.read();chosen=current.owned?current.selected:'forest';render();dialog.showModal();original.focus();
  }
  function close(){if(destroyed||!dialog.open||controller.read().pending)return;confirming=false;message=null;dialog.close();}
  const choose=value=>{if(controller.read().pending)return;chosen=value;confirming=false;message=null;render();};
  original.addEventListener('click',()=>choose('original'));forest.addEventListener('click',()=>choose('forest'));entry.addEventListener('click',open);
  apply.addEventListener('click',()=>{const result=controller.select(chosen);message=result.ok?(result.saved?'selected':'temporary'):'unavailable';render();});
  buy.addEventListener('click',()=>{if(controller.read().pending)return;confirming=true;message=null;render();confirm.focus();});
  confirm.addEventListener('click',async()=>{
    if(!confirming||controller.read().pending)return;
    const purchase=controller.purchase();dialog.focus();const result=await purchase;if(destroyed)return;
    confirming=false;message=result.ok?(result.saved===false?'temporary':'purchased'):
      result.reason==='insufficient'?'insufficient':result.reason==='unavailable'?'unavailable':result.reason==='unconfirmed'?'unconfirmed':'failed';
    render();cancel.focus();
  });
  function cancelOrBack(){
    if(controller.read().pending)return;
    if(confirming){confirming=false;message=null;render();(buy.hidden||buy.disabled?original:buy).focus();}else close();
  }
  cancel.addEventListener('click',cancelOrBack);
  dialog.addEventListener('cancel',event=>{event.preventDefault();cancelOrBack();});
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const buttons=[...dialog.querySelectorAll('button')].filter(button=>!button.hidden&&!button.disabled);
    if(!buttons.length){event.preventDefault();return;}
    if(event.shiftKey&&doc.activeElement===buttons[0]){event.preventDefault();buttons.at(-1).focus();}
    else if(!event.shiftKey&&doc.activeElement===buttons.at(-1)){event.preventDefault();buttons[0].focus();}
  });
  dialog.addEventListener('close',()=>{const target=priorFocus?.isConnected?priorFocus:entry;if(target?.isConnected)target.focus?.();priorFocus=null;});
  const walletChanged=()=>controller.refresh();
  const storageChanged=event=>{if(event.key==null||event.key==='weightplayWallet'||event.key===PREFERENCE_KEY)controller.refresh();};
  win?.addEventListener?.('weightplay:wallet-change',walletChanged);win?.addEventListener?.('storage',storageChanged);
  render();
  return Object.freeze({entry,dialog,open,close,refresh:()=>controller.refresh(),destroy(){
    if(destroyed)return;destroyed=true;win?.removeEventListener?.('weightplay:wallet-change',walletChanged);win?.removeEventListener?.('storage',storageChanged);
    if(dialog.open)dialog.close();dialog.remove();entry.remove();
  }});
}
