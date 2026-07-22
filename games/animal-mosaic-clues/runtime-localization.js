(() => {
  "use strict";

  const locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang||"en";
  const rows={
    en:["Paint","Mark ×","Undo","Hint","Restart","That cell conflicts with the clues.","Hint: one certain cell was painted.","Every filled cell is already visible.","Nothing to undo."],
    "zh-Hant":["填色","標記 ×","復原","提示","重新開始","該格與線索衝突。","提示：已填上一個可確定的格子。","所有應填格都已顯示。","沒有可復原的步驟。"],
    "zh-Hans":["填色","标记 ×","撤销","提示","重新开始","该格与线索冲突。","提示：已填上一个可确定的格子。","所有应填格都已显示。","没有可撤销的步骤。"],
    ja:["塗る","印 ×","元に戻す","ヒント","やり直す","このマスは手掛かりと矛盾します。","ヒント：確定できるマスを1つ塗りました。","塗るべきマスはすべて表示済みです。","元に戻せる手順がありません。"],
    ko:["칠하기","표시 ×","실행 취소","힌트","다시 시작","이 칸은 단서와 맞지 않습니다.","힌트: 확실한 칸 하나를 칠했습니다.","채울 칸이 모두 표시되었습니다.","취소할 단계가 없습니다."],
    es:["Pintar","Marcar ×","Deshacer","Pista","Reiniciar","Esta casilla contradice las pistas.","Pista: se pintó una casilla segura.","Todas las casillas rellenas ya están visibles.","No hay nada que deshacer."],
    "pt-BR":["Pintar","Marcar ×","Desfazer","Dica","Reiniciar","Esta célula contradiz as pistas.","Dica: uma célula certa foi pintada.","Todas as células preenchidas já estão visíveis.","Não há nada para desfazer."],
    fr:["Peindre","Marquer ×","Annuler","Indice","Recommencer","Cette case contredit les indices.","Indice : une case certaine a été peinte.","Toutes les cases remplies sont déjà visibles.","Rien à annuler."],
    de:["Färben","Markieren ×","Rückgängig","Hinweis","Neustart","Dieses Feld widerspricht den Hinweisen.","Hinweis: Ein sicheres Feld wurde gefärbt.","Alle gefüllten Felder sind bereits sichtbar.","Nichts rückgängig zu machen."],
    it:["Colora","Segna ×","Annulla","Indizio","Ricomincia","Questa casella contraddice gli indizi.","Indizio: è stata colorata una casella certa.","Tutte le caselle piene sono già visibili.","Niente da annullare."],
    ru:["Закрасить","Отметить ×","Отменить","Подсказка","Начать заново","Эта клетка противоречит подсказкам.","Подсказка: закрашена одна однозначная клетка.","Все заполненные клетки уже видны.","Нечего отменять."],
    hi:["रंग भरें","चिह्न ×","पूर्ववत","संकेत","फिर शुरू करें","यह खाना संकेतों से मेल नहीं खाता।","संकेत: एक निश्चित खाने में रंग भरा गया।","सभी भरे हुए खाने पहले ही दिखाई दे रहे हैं।","पूर्ववत करने के लिए कुछ नहीं है।"],
    ar:["تلوين","علامة ×","تراجع","تلميح","إعادة البدء","هذه الخانة تتعارض مع التلميحات.","تلميح: تم تلوين خانة مؤكدة.","كل الخانات المملوءة ظاهرة بالفعل.","لا يوجد شيء للتراجع عنه."]
  };
  const source=rows.en,copy=rows[locale]||source,exact=new Map(source.map((value,index)=>[value,copy[index]]));
  if(locale==="en")return;
  const translateNode=node=>{
    if(node.nodeType!==Node.TEXT_NODE||["SCRIPT","STYLE","NOSCRIPT"].includes(node.parentElement?.tagName||""))return;
    const leading=node.data.match(/^\s*/u)?.[0]||"",trailing=node.data.match(/\s*$/u)?.[0]||"",core=node.data.slice(leading.length,node.data.length-trailing.length||undefined),next=exact.get(core);
    if(next&&next!==core)node.data=`${leading}${next}${trailing}`;
  };
  const translateTree=root=>{translateNode(root);const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode)};
  translateTree(document.body);
  new MutationObserver(records=>records.forEach(record=>record.type==="characterData"?translateNode(record.target):record.addedNodes.forEach(translateTree))).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
