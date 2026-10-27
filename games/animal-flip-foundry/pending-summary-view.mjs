// Session-only progress warning; does not write storage or issue rewards.
import {SAVE_UNCONFIRMED} from './save-warning.mjs?v=20261027-flip-summary-candidate';
const COPY={
 en:{count:'Awaiting confirmation: {n}.',open:'View all stages',close:'Hide stages',list:'Stages awaiting confirmation'},
 'zh-Hant':{count:'共 {n} 關待確認。',open:'查看全部關卡',close:'收起關卡',list:'待確認的關卡'},
 'zh-Hans':{count:'共 {n} 关待确认。',open:'查看全部关卡',close:'收起关卡',list:'待确认的关卡'},
 ja:{count:'確認待ちのステージ: {n}。',open:'すべてのステージを表示',close:'ステージを閉じる',list:'確認待ちのステージ'},
 ko:{count:'확인되지 않은 스테이지: {n}개.',open:'모든 스테이지 보기',close:'스테이지 접기',list:'확인되지 않은 스테이지'},
 es:{count:'Sin confirmar: {n}.',open:'Ver todas las etapas',close:'Ocultar etapas',list:'Etapas pendientes de confirmación'},
 'pt-BR':{count:'Aguardando confirmação: {n}.',open:'Ver todas as fases',close:'Ocultar fases',list:'Fases aguardando confirmação'},
 fr:{count:'En attente de confirmation : {n}.',open:'Voir toutes les étapes',close:'Masquer les étapes',list:'Étapes en attente de confirmation'},
 de:{count:'Noch zu bestätigen: {n}.',open:'Alle Stufen anzeigen',close:'Stufen ausblenden',list:'Stufen ohne Bestätigung'},
 it:{count:'Da confermare: {n}.',open:'Mostra tutti i livelli',close:'Nascondi livelli',list:'Livelli in attesa di conferma'},
 ru:{count:'Без подтверждения: {n}.',open:'Показать все этапы',close:'Скрыть этапы',list:'Этапы без подтверждения'},
 hi:{count:'पुष्टि की प्रतीक्षा में स्तर: {n}।',open:'सभी स्तर देखें',close:'स्तर छिपाएँ',list:'पुष्टि की प्रतीक्षा में स्तर'},
 ar:{count:'بانتظار التأكيد: {n}.',open:'عرض كل المراحل',close:'إخفاء المراحل',list:'المراحل التي تنتظر التأكيد'},
};
export const PENDING_SUMMARY_LOCALES=Object.freeze(Object.keys(COPY));
export function createPendingSummaryView({document,host,detailsId,focusFallback}){
  if(!document||!host||!detailsId||typeof focusFallback!=='function')throw new TypeError('invalid view host');
  const wrap=document.createElement('section'),status=document.createElement('p'),toggle=document.createElement('button'),details=document.createElement('section'),list=document.createElement('ol');
  wrap.className='flip-pending-summary';wrap.hidden=true;status.className='flip-pending-summary__status';status.id=`${detailsId}-status`;status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  toggle.type='button';toggle.className='flip-pending-summary__toggle';toggle.setAttribute('aria-controls',detailsId);
  details.id=detailsId;details.className='flip-pending-summary__details';details.tabIndex=0;details.hidden=true;list.setAttribute('role','list');details.append(list);wrap.append(status,toggle,details);host.append(wrap);
  let stages=[],locale='en',stageLabel='Stage',active=false,expanded=false,revision=0,destroyed=false;
  const words=()=>COPY[locale]||COPY.en;
  function focusOutOf(region,target){if(region.contains(document.activeElement)){const node=target();node?.focus?.({preventScroll:true});}}
  function render(){
    const epoch=revision;
    const present=active&&stages.length>0;
    if(!present){focusOutOf(wrap,focusFallback);if(epoch!==revision)return;wrap.hidden=true;status.textContent='';toggle.hidden=true;details.hidden=true;expanded=false;return;}
    wrap.hidden=false;
    const c=words(),sample=stages.slice(0,4).join(', ')+(stages.length>4?', …':'');
    const warning=(SAVE_UNCONFIRMED[locale]||SAVE_UNCONFIRMED.en).replace('{stages}',`\u2066${sample}\u2069`);
    const text=`${c.count.replace('{n}',String(stages.length))} ${warning}`;
    if(status.textContent!==text)status.textContent=text;
    const hasDetails=stages.length>4;
    if(!hasDetails){focusOutOf(details,focusFallback);if(epoch!==revision)return;focusOutOf(toggle,focusFallback);if(epoch!==revision)return;expanded=false;}
    toggle.hidden=!hasDetails;toggle.textContent=expanded?c.close:c.open;toggle.setAttribute('aria-expanded',String(expanded));
    details.hidden=!hasDetails||!expanded;details.setAttribute('aria-label',c.list);
    list.replaceChildren();
    for(const id of stages){const item=document.createElement('li'),number=document.createElement('bdi');item.setAttribute('role','listitem');number.setAttribute('dir','ltr');number.textContent=String(id);item.append(document.createTextNode(`${stageLabel} `),number);list.append(item);}
  }
  toggle.addEventListener('click',()=>{if(destroyed)return;const epoch=revision;if(expanded)focusOutOf(details,()=>toggle);if(epoch!==revision)return;expanded=!expanded;revision++;render();});
  return Object.freeze({
    update({pending,language,stage,visible}){
      if(destroyed)return;
      if(!Array.isArray(pending)||pending.some(n=>!Number.isSafeInteger(n)||n<1||n>60))throw new TypeError('invalid pending stages');
      stages=[...new Set(pending)].sort((a,b)=>a-b);locale=COPY[language]?language:'en';stageLabel=String(stage||'Stage');active=Boolean(visible);revision++;render();
    },
    destroy(){if(destroyed)return;destroyed=true;revision++;focusOutOf(wrap,focusFallback);wrap.remove();},
  });
}
