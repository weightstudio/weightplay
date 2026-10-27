// Session-only warning; this does not certify rewards or durable storage.
(() => { 'use strict';
const COPY={
 en:['{count} stages awaiting save confirmation: {sample}. Clear a stage to retry; leaving or reloading may lose this progress.','View all stages','Hide stages','Stages awaiting confirmation'],
 'zh-Hant':['有 {count} 關尚未確認儲存：{sample}。通關任一關可重試；離開或重新載入可能失去進度。','查看全部關卡','收起關卡','待確認的關卡'],
 'zh-Hans':['有 {count} 关尚未确认保存：{sample}。通关任一关可重试；离开或重新加载可能失去进度。','查看全部关卡','收起关卡','待确认的关卡'],
 ja:['保存確認待ち {count} ステージ：{sample}。いずれかをクリアすると再試行します。終了や再読み込みで進行が失われる場合があります。','すべて表示','閉じる','保存確認待ちのステージ'],
 ko:['저장 확인 대기 {count}개: {sample}. 아무 스테이지나 완료하면 다시 저장합니다. 나가거나 새로고침하면 진행 상황을 잃을 수 있습니다.','모두 보기','접기','저장 확인 대기 스테이지'],
 es:['{count} niveles sin confirmar: {sample}. Completa un nivel para reintentar; salir o recargar puede perder el progreso.','Ver todos','Ocultar','Niveles sin confirmar'],
 'pt-BR':['{count} fases sem confirmação: {sample}. Conclua uma fase para tentar de novo; sair ou recarregar pode perder o progresso.','Ver todas','Ocultar','Fases sem confirmação'],
 fr:['{count} étapes en attente : {sample}. Terminez une étape pour réessayer ; quitter ou recharger peut faire perdre la progression.','Tout afficher','Masquer','Étapes en attente de confirmation'],
 de:['{count} Stufen nicht bestätigt: {sample}. Schließe eine Stufe ab, um erneut zu speichern; Verlassen oder Neuladen kann Fortschritt verlieren.','Alle anzeigen','Ausblenden','Stufen ohne Bestätigung'],
 it:['{count} livelli non confermati: {sample}. Completa un livello per riprovare; uscire o ricaricare può perdere i progressi.','Mostra tutti','Nascondi','Livelli da confermare'],
 ru:['Не подтверждено уровней: {count} ({sample}). Завершите уровень для повторного сохранения; выход или перезагрузка могут удалить прогресс.','Показать все','Скрыть','Уровни без подтверждения'],
 hi:['{count} स्तरों का सहेजना अपुष्ट है: {sample}। पुनः प्रयास के लिए कोई स्तर पूरा करें; बाहर जाने या पुनः लोड करने पर प्रगति खो सकती है।','सभी स्तर देखें','स्तर छिपाएँ','पुष्टि की प्रतीक्षा वाले स्तर'],
 ar:['لم يُؤكَّد حفظ {count} من المراحل: {sample}. أكمل مرحلة لإعادة المحاولة؛ قد تفقد التقدم عند المغادرة أو إعادة التحميل.','عرض كل المراحل','إخفاء المراحل','مراحل بانتظار تأكيد الحفظ']
};
const SINGLE={
 en:'{count} stage awaiting save confirmation: {sample}. Clear a stage to retry; leaving or reloading may lose this progress.',
 es:'{count} nivel sin confirmar: {sample}. Completa un nivel para reintentar; salir o recargar puede perder el progreso.',
 'pt-BR':'{count} fase sem confirmação: {sample}. Conclua uma fase para tentar de novo; sair ou recarregar pode perder o progresso.',
 fr:'{count} étape en attente : {sample}. Terminez une étape pour réessayer ; quitter ou recharger peut faire perdre la progression.',
 de:'{count} Stufe nicht bestätigt: {sample}. Schließe eine Stufe ab, um erneut zu speichern; Verlassen oder Neuladen kann Fortschritt verlieren.',
 it:'{count} livello non confermato: {sample}. Completa un livello per riprovare; uscire o ricaricare può perdere i progressi.'
};
function create({host,id,fallback}){
 const wrap=document.createElement('section'),status=document.createElement('p'),toggle=document.createElement('button'),details=document.createElement('section'),list=document.createElement('ol');
 wrap.className='balance-save-warning';wrap.hidden=true;status.id=`${id}-status`;status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 toggle.type='button';toggle.setAttribute('aria-controls',`${id}-list`);details.id=`${id}-list`;details.hidden=true;details.tabIndex=0;list.setAttribute('role','list');details.append(list);wrap.append(status,toggle,details);host.append(wrap);
 let expanded=false,revision=0,destroyed=false,ids=[],locale='en',active=false;
 const leave=(node,target)=>{if(node.contains(document.activeElement))target()?.focus?.({preventScroll:true});};
 function render(){const epoch=revision;if(!active||!ids.length){leave(wrap,fallback);if(epoch!==revision)return;wrap.hidden=true;status.textContent='';toggle.hidden=true;details.hidden=true;expanded=false;return;}
  wrap.hidden=false;const copy=COPY[locale]||COPY.en,hasDetails=ids.length>4,sample=ids.slice(0,4).join(', ')+(hasDetails?', …':'');
  status.textContent=(ids.length===1&&SINGLE[locale]||copy[0]).replace('{count}',String(ids.length)).replace('{sample}',`\u2066${sample}\u2069`);
  if(!hasDetails){leave(details,fallback);if(epoch!==revision)return;leave(toggle,fallback);if(epoch!==revision)return;expanded=false;}
  toggle.hidden=!hasDetails;toggle.textContent=expanded?copy[2]:copy[1];toggle.setAttribute('aria-expanded',String(expanded));details.hidden=!hasDetails||!expanded;details.setAttribute('aria-label',copy[3]);list.replaceChildren();
  for(const n of ids){const li=document.createElement('li'),bdi=document.createElement('bdi');li.setAttribute('role','listitem');bdi.setAttribute('dir','ltr');bdi.textContent=String(n);li.append(bdi);list.append(li);}
 }
 toggle.addEventListener('click',()=>{if(destroyed)return;const epoch=revision;if(expanded)leave(details,()=>toggle);if(epoch!==revision)return;expanded=!expanded;revision++;render();});
 return Object.freeze({update({pending,language,visible}){if(destroyed)return;if(!Array.isArray(pending)||pending.some(n=>!Number.isSafeInteger(n)||n<1||n>60))throw TypeError('invalid pending');ids=[...new Set(pending)].sort((a,b)=>a-b);locale=COPY[language]?language:'en';active=Boolean(visible);revision++;render();},destroy(){if(destroyed)return;destroyed=true;revision++;leave(wrap,fallback);wrap.remove();}});
}
globalThis.BalanceGroveSaveWarning=Object.freeze({create,locales:Object.freeze(Object.keys(COPY))});
})();
