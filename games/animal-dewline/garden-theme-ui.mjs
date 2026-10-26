import {COST, DIAMOND_ASSET, locales, format, createGardenThemeController} from './garden-theme.mjs?v=20261027-dewline-v19';

// host is the game's Stage action container; board is the live Battle puzzle.
// Mounting never spends currency. The modal's second, explicit confirmation is
// the only route to purchase(). The module does not change game progression.
export function mountGardenTheme({host, board, getLocale, wallet, storage}={}) {
  const doc=host?.ownerDocument || board?.ownerDocument || globalThis.document;
  if(!doc?.createElement || !doc.body || !board?.dataset)throw new Error('GARDEN_THEME_MOUNT_REQUIRED');
  const win=doc.defaultView || globalThis.window;
  const node=(tag,className,parent)=>{const result=doc.createElement(tag);if(className)result.className=className;parent?.append(result);return result;};
  const entry=node('button','dew-theme-entry');entry.type='button';entry.dataset.wpFrameAction='secondary';
  if(host)host.append(entry);
  const dialog=node('dialog','dew-theme-dialog',doc.body);
  dialog.tabIndex=-1;
  dialog.setAttribute('aria-labelledby','dew-theme-title');dialog.setAttribute('aria-describedby','dew-theme-description');
  const shell=node('div','dew-theme-shell',dialog), title=node('h2','dew-theme-title',shell);title.id='dew-theme-title';
  const description=node('p','dew-theme-description',shell);description.id='dew-theme-description';
  const product=node('img','dew-theme-product',shell);product.src='/games/animal-dewline/assets/moonlit-garden-v19.png';
  product.width=1254;product.height=1254;
  const previewLabel=node('p','dew-theme-preview-label',shell);
  const preview=node('div','dew-theme-preview',shell);preview.setAttribute('aria-hidden','true');
  const previewCards=node('div','dew-theme-preview-cards',preview);
  for(const [name,value] of [['A','1 / 3'],['B','2 / 4'],['C','3 / 5']]) {
    const card=node('div','dew-theme-preview-card',previewCards);
    node('strong','',card).textContent=name;node('span','',card).textContent=value;
  }
  const previewControls=node('div','dew-theme-choice',shell);
  const classic=node('button','',previewControls),moonlight=node('button','',previewControls);
  classic.type=moonlight.type='button';classic.dataset.dewThemeAction='preview-classic';moonlight.dataset.dewThemeAction='preview-moonlight';
  const balance=node('p','dew-theme-balance',shell), balanceIcon=node('img','dew-theme-diamond',balance),balanceText=node('span','',balance);
  balanceIcon.src=DIAMOND_ASSET;balanceIcon.alt='';balanceIcon.setAttribute('aria-hidden','true');
  const price=node('p','dew-theme-price',shell),priceIcon=node('img','dew-theme-diamond',price),priceText=node('span','',price);
  priceIcon.src=DIAMOND_ASSET;priceIcon.alt='';priceIcon.setAttribute('aria-hidden','true');
  const permanence=node('p','dew-theme-permanent',shell),ownership=node('p','dew-theme-owned',shell);
  const question=node('p','dew-theme-question',shell);
  const status=node('p','dew-theme-status',shell);status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const actions=node('div','dew-theme-actions',shell);
  const apply=node('button','secondary-btn',actions),buy=node('button','primary-btn',actions),confirm=node('button','primary-btn',actions),cancel=node('button','secondary-btn',actions);
  apply.type=buy.type=confirm.type=cancel.type='button';
  apply.dataset.dewThemeAction='apply';buy.dataset.dewThemeAction='buy';confirm.dataset.dewThemeAction='confirm';cancel.dataset.dewThemeAction='cancel';
  let destroyed=false, confirming=false, chosen='moonlight', message=null, priorFocus=null, controller;
  const locale=()=>{const value=typeof getLocale==='function'?getLocale():doc.documentElement.lang;return locales[value]?value:'en';};
  const tr=(key,vars={})=>format(locale(),key,vars);
  function render() {
    if(destroyed || !controller)return;
    const current=controller.read();
    entry.textContent=tr('open');entry.setAttribute('aria-haspopup','dialog');
    title.textContent=tr('title');description.textContent=tr('description');product.alt=tr('title');previewLabel.textContent=tr('preview');
    preview.dataset.dewTheme=chosen;board.dataset.dewTheme=current.selected;
    classic.textContent=tr('classic');moonlight.textContent=tr('moonlight');
    classic.setAttribute('aria-pressed',String(chosen==='classic'));moonlight.setAttribute('aria-pressed',String(chosen==='moonlight'));
    balanceText.textContent=current.available ? `${tr('balance',{balance:current.balance})} ${tr('currency')}` : tr('unavailable');
    priceText.textContent=`${tr('price',{cost:COST})} ${tr('currency')}`;
    permanence.textContent=tr('permanent');ownership.textContent=current.owned ? tr('owned') : '';
    question.textContent=confirming ? tr('confirmQuestion',{cost:COST}) : '';
    apply.textContent=tr('apply');buy.textContent=tr('buy');confirm.textContent=tr('confirm');cancel.textContent=tr('cancel');
    apply.hidden=confirming || (chosen==='moonlight' && !current.owned);
    buy.hidden=confirming || chosen!=='moonlight' || current.owned===true;
    confirm.hidden=!confirming;
    classic.disabled=moonlight.disabled=apply.disabled=cancel.disabled=current.pending;
    buy.disabled=current.pending || !current.available || current.balance<COST;
    confirm.disabled=current.pending || !current.available || current.balance<COST;
    if(current.pending) status.textContent=tr('busy');
    else if(message) status.textContent=tr(message);
    else if(!current.available && chosen==='moonlight') status.textContent=tr('unavailable');
    else if(!current.owned && chosen==='moonlight' && current.balance<COST) status.textContent=tr('insufficient');
    else status.textContent='';
  }
  controller=createGardenThemeController({wallet,storage,onChange:render});
  function open() {
    if(destroyed || dialog.open)return;
    if(typeof dialog.showModal!=='function')throw new Error('GARDEN_THEME_DIALOG_UNAVAILABLE');
    priorFocus=doc.activeElement;confirming=false;message=null;
    const current=controller.read();chosen=current.owned ? current.selected : 'moonlight';render();
    dialog.showModal();classic.focus();
  }
  function close() {
    if(destroyed || !dialog.open || controller.read().pending)return;
    confirming=false;message=null;dialog.close();
  }
  const choose=value=>{if(controller.read().pending)return;chosen=value;confirming=false;message=null;render();};
  classic.addEventListener('click',()=>choose('classic'));
  moonlight.addEventListener('click',()=>choose('moonlight'));
  entry.addEventListener('click',open);
  apply.addEventListener('click',()=>{
    const outcome=controller.select(chosen);
    message=outcome.ok ? (outcome.saved ? 'selected' : 'preferenceTemporary') : 'unavailable';render();
  });
  buy.addEventListener('click',()=>{if(controller.read().pending)return;confirming=true;message=null;render();confirm.focus();});
  confirm.addEventListener('click',async()=>{
    if(!confirming || controller.read().pending)return;
    const purchase=controller.purchase();dialog.focus();
    const outcome=await purchase;
    if(destroyed)return;
    confirming=false;
    message=outcome.ok ? (outcome.saved === false ? 'preferenceTemporary' : 'purchased')
      : outcome.reason==='insufficient' ? 'insufficient' : outcome.reason==='unavailable' ? 'unavailable'
      : outcome.reason==='unconfirmed' ? 'unconfirmed' : 'error';
    render();cancel.focus();
  });
  cancel.addEventListener('click',()=>{
    if(controller.read().pending)return;
    if(confirming){confirming=false;message=null;render();buy.focus();}else close();
  });
  dialog.addEventListener('cancel',event=>{
    event.preventDefault();if(controller.read().pending)return;
    if(confirming){confirming=false;message=null;render();buy.focus();}else close();
  });
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const buttons=[...dialog.querySelectorAll('button')].filter(button=>!button.hidden && !button.disabled);
    if(!buttons.length){event.preventDefault();return;}
    if(event.shiftKey && doc.activeElement===buttons[0]){event.preventDefault();buttons.at(-1).focus();}
    else if(!event.shiftKey && doc.activeElement===buttons.at(-1)){event.preventDefault();buttons[0].focus();}
  });
  dialog.addEventListener('close',()=>{
    const target=priorFocus?.isConnected ? priorFocus : entry;
    if(target?.isConnected && typeof target.focus==='function')target.focus();
    priorFocus=null;
  });
  const walletChanged=()=>controller.refresh();
  win?.addEventListener?.('weightplay:wallet-change',walletChanged);
  win?.addEventListener?.('storage',walletChanged);
  render();
  return Object.freeze({entry,dialog,open,close,refresh:()=>controller.refresh(),destroy(){
    if(destroyed)return;destroyed=true;
    win?.removeEventListener?.('weightplay:wallet-change',walletChanged);
    win?.removeEventListener?.('storage',walletChanged);
    if(dialog.open)dialog.close();dialog.remove();entry.remove();delete board.dataset.dewTheme;
  }});
}
