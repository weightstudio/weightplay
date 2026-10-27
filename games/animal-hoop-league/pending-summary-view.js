/* Isolated Hoop pending-summary candidate, adapted for classic script loading. */
(() => {
'use strict';
// Isolated view candidate. The host supplies the existing Hoop copy and pending IDs.
// This module does not read or write game progress, receipts, or analytics.
const COPY={
 en:['Awaiting confirmation: {n}.','View all courts','Hide courts','Courts awaiting confirmation'],
 'zh-Hant':['共 {n} 關待確認。','查看全部關卡','收起關卡','待確認的關卡'],
 'zh-Hans':['共 {n} 关待确认。','查看全部关卡','收起关卡','待确认的关卡'],
 ja:['確認待ちのコート: {n}。','すべてのコートを表示','コートを閉じる','確認待ちのコート'],
 ko:['확인되지 않은 코트: {n}개.','모든 코트 보기','코트 접기','확인되지 않은 코트'],
 es:['Canchas sin confirmar: {n}.','Ver todas las canchas','Ocultar canchas','Canchas pendientes de confirmación'],
 'pt-BR':['Quadras aguardando confirmação: {n}.','Ver todas as quadras','Ocultar quadras','Quadras aguardando confirmação'],
 fr:['Terrains en attente de confirmation : {n}.','Voir tous les terrains','Masquer les terrains','Terrains en attente de confirmation'],
 de:['Noch zu bestätigende Plätze: {n}.','Alle Plätze anzeigen','Plätze ausblenden','Plätze ohne Bestätigung'],
 it:['Campi da confermare: {n}.','Mostra tutti i campi','Nascondi campi','Campi in attesa di conferma'],
 ru:['Площадок без подтверждения: {n}.','Показать все площадки','Скрыть площадки','Площадки без подтверждения'],
 hi:['पुष्टि की प्रतीक्षा में कोर्ट: {n}।','सभी कोर्ट देखें','कोर्ट छिपाएँ','पुष्टि की प्रतीक्षा में कोर्ट'],
 ar:['الملاعب بانتظار التأكيد: {n}.','عرض كل الملاعب','إخفاء الملاعب','الملاعب التي تنتظر التأكيد']
};
const HOOP_SUMMARY_LOCALES=Object.freeze(Object.keys(COPY));
function createHoopPendingSummary({document,host,detailsId,statusId,focusFallback,campaignCopy}){
 if(!document||!host||!detailsId||!statusId||detailsId===statusId||typeof focusFallback!=='function'||!campaignCopy)throw TypeError('INVALID_VIEW_HOST');
 const wrap=document.createElement('section'),status=document.createElement('p'),toggle=document.createElement('button'),details=document.createElement('section'),list=document.createElement('ol');
 wrap.className='hoop-pending-summary';wrap.hidden=true;status.id=statusId;status.className='hoop-pending-summary__status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 toggle.type='button';toggle.className='hoop-pending-summary__toggle';toggle.setAttribute('aria-controls',detailsId);
 details.id=detailsId;details.className='hoop-pending-summary__details';details.tabIndex=0;details.hidden=true;list.setAttribute('role','list');details.append(list);wrap.append(status,toggle,details);host.append(wrap);
 let stages=[],language='en',visible=false,expanded=false,revision=0,destroyed=false;
 function leave(region,target){if(region.contains(document.activeElement))target()?.focus?.({preventScroll:true});}
 function render(){
  const epoch=revision;
  if(!visible||!stages.length){leave(wrap,focusFallback);if(epoch!==revision)return;wrap.hidden=true;status.textContent='';toggle.hidden=true;details.hidden=true;expanded=false;return;}
  wrap.hidden=false;
  const [count,open,close,label]=COPY[language],format=new Intl.NumberFormat(language),hasDetails=stages.length>4;
  const sample=stages.slice(0,4).map(n=>format.format(n)).join(', ')+(hasDetails?', …':'');
  const warning=campaignCopy[language].savePending.replace('{stages}',`\u2068${sample}\u2069`);
  const text=`${count.replace('{n}',`\u2068${format.format(stages.length)}\u2069`)} ${warning}`;
  if(status.textContent!==text)status.textContent=text;
  if(!hasDetails){leave(details,focusFallback);if(epoch!==revision)return;leave(toggle,focusFallback);if(epoch!==revision)return;expanded=false;}
  toggle.hidden=!hasDetails;toggle.textContent=expanded?close:open;toggle.setAttribute('aria-expanded',String(expanded));
  details.hidden=!hasDetails||!expanded;details.setAttribute('aria-label',label);list.replaceChildren();
  for(const n of stages){const li=document.createElement('li'),bdi=document.createElement('bdi');li.setAttribute('role','listitem');bdi.textContent=format.format(n);li.append(bdi);list.append(li);}
 }
 toggle.addEventListener('click',()=>{if(destroyed)return;const epoch=revision;if(expanded)leave(details,()=>toggle);if(epoch!==revision)return;expanded=!expanded;revision++;render();});
 return Object.freeze({
  update({pending,locale,active}){
   if(destroyed)return;
   if(!Array.isArray(pending)||pending.some(n=>!Number.isSafeInteger(n)||n<1||n>60))throw TypeError('INVALID_PENDING');
   const lang=Object.hasOwn(COPY,locale)?locale:'en';if(typeof campaignCopy[lang]?.savePending!=='string'||!campaignCopy[lang].savePending.includes('{stages}'))throw TypeError('INVALID_COPY');
   stages=[...new Set(pending)].sort((a,b)=>a-b);language=lang;visible=Boolean(active);revision++;render();
  },
  destroy(){if(destroyed)return;destroyed=true;revision++;leave(wrap,focusFallback);wrap.remove();}
 });
}
globalThis.WeightPlayHoopPendingSummary=Object.freeze({createHoopPendingSummary,HOOP_SUMMARY_LOCALES});
})();
