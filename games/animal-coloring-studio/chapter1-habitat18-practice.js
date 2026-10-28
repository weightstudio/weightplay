// Unreviewed localhost-only page and wing comparison; not a campaign page.
(() => {
  const points=[[642,502],[253,321],[459,259],[626,368],[377,701],[239,507],[492,509],[361,593],[199,702],[533,706],[272,768],[281,857],[455,857],[606,954]];
  const titles={en:'Night Owl','zh-Hant':'夜晚貓頭鷹','zh-Hans':'夜晚猫头鹰',ja:'夜のフクロウ',ko:'밤의 부엉이',es:'Búho nocturno','pt-BR':'Coruja da noite',fr:'Hibou de nuit',de:'Nachteule',it:'Gufo nella notte',ru:'Ночная сова',hi:'रात का उल्लू',ar:'بومة الليل'};
  const areaNames={
    en:['Sky','Moon','Upper star','Right star','Head and chest','Left eye disc','Right eye disc','Beak','Left wing','Right wing','Body','Left foot','Right foot','Branch'],
    'zh-Hant':['天空','月亮','上方星星','右方星星','頭與胸','左眼盤','右眼盤','喙','左翅膀','右翅膀','身體','左腳','右腳','樹枝'],
    'zh-Hans':['天空','月亮','上方星星','右方星星','头与胸','左眼盘','右眼盘','喙','左翅膀','右翅膀','身体','左脚','右脚','树枝'],
    ja:['空','月','上の星','右の星','頭と胸','左の顔盤','右の顔盤','くちばし','左の翼','右の翼','体','左足','右足','枝'],
    ko:['하늘','달','위쪽 별','오른쪽 별','머리와 가슴','왼쪽 눈 둘레','오른쪽 눈 둘레','부리','왼쪽 날개','오른쪽 날개','몸','왼발','오른발','나뭇가지'],
    es:['Cielo','Luna','Estrella superior','Estrella derecha','Cabeza y pecho','Disco ocular izquierdo','Disco ocular derecho','Pico','Ala izquierda','Ala derecha','Cuerpo','Pie izquierdo','Pie derecho','Rama'],
    'pt-BR':['Céu','Lua','Estrela superior','Estrela direita','Cabeça e peito','Disco ocular esquerdo','Disco ocular direito','Bico','Asa esquerda','Asa direita','Corpo','Pé esquerdo','Pé direito','Galho'],
    fr:['Ciel','Lune','Étoile du haut','Étoile droite','Tête et poitrine','Disque gauche','Disque droit','Bec','Aile gauche','Aile droite','Corps','Pied gauche','Pied droit','Branche'],
    de:['Himmel','Mond','Oberer Stern','Rechter Stern','Kopf und Brust','Linker Augenkreis','Rechter Augenkreis','Schnabel','Linker Flügel','Rechter Flügel','Körper','Linker Fuß','Rechter Fuß','Ast'],
    it:['Cielo','Luna','Stella in alto','Stella a destra','Testa e petto','Disco oculare sinistro','Disco oculare destro','Becco','Ala sinistra','Ala destra','Corpo','Piede sinistro','Piede destro','Ramo'],
    ru:['Небо','Луна','Верхняя звезда','Правая звезда','Голова и грудка','Левый круг глаза','Правый круг глаза','Клюв','Левое крыло','Правое крыло','Тело','Левая лапа','Правая лапа','Ветка'],
    hi:['आसमान','चाँद','ऊपरी तारा','दायाँ तारा','सिर और छाती','बाएँ आँख का घेरा','दाएँ आँख का घेरा','चोंच','बायाँ पंख','दायाँ पंख','शरीर','बायाँ पैर','दायाँ पैर','डाली'],
    ar:['السماء','القمر','النجمة العليا','النجمة اليمنى','الرأس والصدر','دائرة العين اليسرى','دائرة العين اليمنى','المنقار','الجناح الأيسر','الجناح الأيمن','الجسم','القدم اليسرى','القدم اليمنى','الغصن']
  };
  const goalCopy={
    en:['Give both wings dots or stripes. Try matching or different patterns.','Complete: both wings have matching patterns!','Complete: the wings have different patterns!'],
    'zh-Hant':['在雙翼選圓點或條紋，試試相同或不同圖案。','挑戰完成：雙翼圖案相同！','挑戰完成：雙翼圖案不同！'],
    'zh-Hans':['在双翼选圆点或条纹，试试相同或不同图案。','挑战完成：双翼图案相同！','挑战完成：双翼图案不同！'],
    ja:['両翼に水玉かしまをつけ、同じか違う模様を試そう。','達成！両翼は同じ模様！','達成！両翼は違う模様！'],
    ko:['양쪽 날개에 점이나 줄무늬를 넣고 같게 또는 다르게 해요.','완료! 양쪽 날개 무늬가 같아요!','완료! 양쪽 날개 무늬가 달라요!'],
    es:['Pon puntos o rayas en ambas alas; prueba patrones iguales o distintos.','¡Listo: las alas tienen el mismo patrón!','¡Listo: las alas tienen patrones distintos!'],
    'pt-BR':['Use bolinhas ou listras nas duas asas; teste padrões iguais ou diferentes.','Concluído: as asas têm padrões iguais!','Concluído: as asas têm padrões diferentes!'],
    fr:['Ajoute des pois ou des rayures aux deux ailes, identiques ou différents.','Réussi : les ailes ont le même motif !','Réussi : les ailes ont des motifs différents !'],
    de:['Gib beiden Flügeln Punkte oder Streifen, gleich oder verschieden.','Geschafft: beide Flügel haben das gleiche Muster!','Geschafft: die Flügel haben verschiedene Muster!'],
    it:['Metti puntini o strisce sulle ali, uguali o diversi.','Completato: le ali hanno lo stesso motivo!','Completato: le ali hanno motivi diversi!'],
    ru:['Добавь точки или полоски на оба крыла: одинаковые или разные.','Готово: узоры на крыльях одинаковые!','Готово: узоры на крыльях разные!'],
    hi:['दोनों पंखों पर बिंदु या धारियाँ लगाएँ; एक जैसे या अलग चुनें।','पूरा हुआ: दोनों पंखों का पैटर्न एक जैसा है!','पूरा हुआ: दोनों पंखों के पैटर्न अलग हैं!'],
    ar:['أضف نقاطًا أو خطوطًا إلى الجناحين، متشابهة أو مختلفة.','اكتمل: للجناحين النمط نفسه!','اكتمل: للجناحين نمطان مختلفان!']
  };
  function goalState(fills){const left=fills.get('9,173,81'),right=fills.get('10,173,81');if(!left||!right||!['dots','stripes'].includes(left.pattern)||!['dots','stripes'].includes(right.pattern))return 0;return left.pattern===right.pattern?1:2}
  window.AnimalColoringHabitat18Practice=Object.freeze({ready:false,id:'night-owl-practice',titles,areaNames,goalCopy,goalState,
    art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage18-source-v2.png',mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage18-v2-mask.png',
    anchors:Object.freeze(points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})))
  });
})();
