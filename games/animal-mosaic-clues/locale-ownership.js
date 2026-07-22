(() => {
  "use strict";

  const loadingCopy={en:"Opening the mosaic archive…","zh-Hant":"正在開啟拼圖檔案館…","zh-Hans":"正在打开拼图档案馆…",ja:"モザイク資料館を開いています…",ko:"모자이크 기록관을 여는 중…",es:"Abriendo el archivo de mosaicos…","pt-BR":"Abrindo o arquivo de mosaicos…",fr:"Ouverture des archives de mosaïques…",de:"Mosaikarchiv wird geöffnet…",it:"Apertura dell’archivio dei mosaici…",ru:"Открываем архив мозаик…",hi:"मोज़ेक संग्रह खोला जा रहा है…",ar:"جارٍ فتح أرشيف الفسيفساء…"};
  const french={
    "Use Paint for confirmed cells and Mark for confirmed empty cells.":"Utilisez Peindre pour les cellules confirmées et Marquer pour les cellules vides confirmées.",
    "Utilisez Paint pour les cellules confirmées et Mark pour les cellules vides confirmées.":"Utilisez Peindre pour les cellules confirmées et Marquer pour les cellules vides confirmées.",
    "Woodland Signs":"Signes de la forêt","River Tracks":"Traces de rivière","Moon Garden":"Jardin lunaire","Coral Archive":"Archives de corail","Sky Atlas":"Atlas céleste","Grand Menagerie":"Grande ménagerie",
    Paint:"Peindre","Mark ×":"Marquer ×",Undo:"Annuler",Hint:"Indice",Restart:"Recommencer",Marks:"Marques",Errors:"Erreurs",Filled:"Remplies",Locked:"Verrouillée",Ready:"Prête","Cleared · Replay":"Terminée · Rejouer"
  };
  const chapters=["Signes de la forêt","Traces de rivière","Jardin lunaire","Archives de corail","Atlas céleste","Grande ménagerie"];
  const locale=()=>window.WonderI18n?.actualLocale?.()||document.documentElement.lang||"en";
  const showTransition=target=>{
    document.body.classList.add("locale-transitioning");
    const loading=document.getElementById("loading");if(!loading)return;
    loading.hidden=false;loading.style.position="fixed";loading.style.inset="0";loading.style.zIndex="9999";
    const label=loading.querySelector("strong");if(label)label.textContent=loadingCopy[target]||loadingCopy.en;
  };
  document.getElementById("localeSelect")?.addEventListener("change",event=>showTransition(event.currentTarget.value),{capture:true});
  const initial=locale(),loading=document.querySelector("#loading strong");if(loading)loading.textContent=loadingCopy[initial]||loadingCopy.en;
  document.body.dataset.mosaicLocaleOwnership="ready";
  if(initial!=="fr")return;

  const config=window.BlockTrilogyConfig;if(config){config.chapters=[...chapters];if(Array.isArray(config.how))config.how=config.how.map(value=>french[value]||value)}
  const translate=value=>{
    if(typeof value!=="string"||!value.trim())return value;
    const leading=value.match(/^\s*/u)?.[0]||"",trailing=value.match(/\s*$/u)?.[0]||"",core=value.slice(leading.length,value.length-trailing.length||undefined);
    let next=french[core],match;if(!next&&(match=core.match(/^Stage\s+(\d+)$/u)))next=`Étape ${match[1]}`;if(!next&&(match=core.match(/^(\d+)\s+marks$/u)))next=`${match[1]} marques`;if(!next&&(match=core.match(/^(\d+)\s+errors$/u)))next=`${match[1]} erreurs`;
    return `${leading}${next||core}${trailing}`;
  };
  const translateNode=node=>{
    if(node.nodeType===Node.TEXT_NODE){if(!["SCRIPT","STYLE","NOSCRIPT","OPTION"].includes(node.parentElement?.tagName||"")){const next=translate(node.data);if(next!==node.data)node.data=next}return}
    if(!(node instanceof Element))return;for(const name of ["aria-label","aria-description","title","placeholder","alt"]){if(!node.hasAttribute(name))continue;const value=node.getAttribute(name)||"",next=translate(value);if(next!==value)node.setAttribute(name,next)}
  };
  const translateTree=root=>{translateNode(root);const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode)};
  translateTree(document.body);new MutationObserver(records=>{for(const record of records){if(record.type==="characterData")translateNode(record.target);else for(const node of record.addedNodes)translateTree(node)}}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
