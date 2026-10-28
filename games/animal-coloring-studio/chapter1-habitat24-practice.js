// Unreviewed localhost-only checkpoint; not a campaign page.
(() => {
  const points=[[435,222],[384,325],[534,467],[262,411],[427,507],[132,534],[605,608],[401,667],[412,626],[510,636],[396,880],[286,888]];
  const titles={en:'River Kingfisher','zh-Hant':'河邊翠鳥','zh-Hans':'河边翠鸟',ja:'川のカワセミ',ko:'강가의 물총새',es:'Martín pescador','pt-BR':'Martim-pescador',fr:'Martin-pêcheur',de:'Eisvogel',it:'Martin pescatore',ru:'Зимородок у реки',hi:'नदी का किंगफिशर',ar:'رفراف النهر'};
  const areaNames={
    en:['Crest','Head','Wing','Beak','Body','Leaf','Tail','Branch','Left foot','Right foot','Water','Stone'],
    'zh-Hant':['頭冠','頭','翅膀','鳥喙','身體','葉子','尾巴','樹枝','左腳','右腳','河水','石頭'],
    'zh-Hans':['头冠','头','翅膀','鸟喙','身体','叶子','尾巴','树枝','左脚','右脚','河水','石头'],
    ja:['かんむり','頭','翼','くちばし','体','葉','しっぽ','枝','左足','右足','水','石'],
    ko:['머리깃','머리','날개','부리','몸','잎','꼬리','나뭇가지','왼발','오른발','물','돌'],
    es:['Cresta','Cabeza','Ala','Pico','Cuerpo','Hoja','Cola','Rama','Pie izquierdo','Pie derecho','Agua','Piedra'],
    'pt-BR':['Crista','Cabeça','Asa','Bico','Corpo','Folha','Cauda','Galho','Pé esquerdo','Pé direito','Água','Pedra'],
    fr:['Huppe','Tête','Aile','Bec','Corps','Feuille','Queue','Branche','Pied gauche','Pied droit','Eau','Pierre'],
    de:['Haube','Kopf','Flügel','Schnabel','Körper','Blatt','Schwanz','Ast','Linker Fuß','Rechter Fuß','Wasser','Stein'],
    it:['Ciuffo','Testa','Ala','Becco','Corpo','Foglia','Coda','Ramo','Piede sinistro','Piede destro','Acqua','Pietra'],
    ru:['Хохолок','Голова','Крыло','Клюв','Тело','Лист','Хвост','Ветка','Левая лапа','Правая лапа','Вода','Камень'],
    hi:['कलगी','सिर','पंख','चोंच','शरीर','पत्ता','पूँछ','डाली','बायाँ पैर','दायाँ पैर','पानी','पत्थर'],
    ar:['العرف','الرأس','الجناح','المنقار','الجسم','الورقة','الذيل','الغصن','القدم اليسرى','القدم اليمنى','الماء','الحجر']
  };
  const goalCopy={
    en:['Give the wing and leaf the same color but different patterns.','Challenge complete: same color, different patterns!'],
    'zh-Hant':['翅膀和葉子用相同底色、不同圖案。','挑戰完成：相同底色，不同圖案！'],
    'zh-Hans':['翅膀和叶子用相同底色、不同图案。','挑战完成：相同底色，不同图案！'],
    ja:['翼と葉を同じ色で、違う模様にしよう。','達成！同じ色で違う模様！'],
    ko:['날개와 잎을 같은 색, 다른 무늬로 칠해요.','완료! 같은 색과 다른 무늬!'],
    es:['Usa el mismo color y distintos patrones en el ala y la hoja.','¡Reto completado: mismo color y patrones distintos!'],
    'pt-BR':['Use a mesma cor e padrões diferentes na asa e na folha.','Desafio concluído: mesma cor e padrões diferentes!'],
    fr:['Mets la même couleur et des motifs différents sur l’aile et la feuille.','Défi réussi : même couleur, motifs différents !'],
    de:['Gib Flügel und Blatt dieselbe Farbe, aber verschiedene Muster.','Geschafft: gleiche Farbe, verschiedene Muster!'],
    it:['Usa lo stesso colore e motivi diversi su ala e foglia.','Sfida completata: stesso colore, motivi diversi!'],
    ru:['Раскрась крыло и лист одним цветом, но разными узорами.','Готово: один цвет, разные узоры!'],
    hi:['पंख और पत्ते पर एक रंग, लेकिन अलग पैटर्न लगाएँ।','चुनौती पूरी: एक रंग, अलग पैटर्न!'],
    ar:['لوّن الجناح والورقة باللون نفسه ونمطين مختلفين.','اكتمل التحدي: لون واحد ونمطان مختلفان!']
  };
  function goalComplete(fills){const wing=fills.get('3,173,81'),leaf=fills.get('6,173,81');return !!wing&&!!leaf&&typeof wing==='object'&&typeof leaf==='object'&&['dots','stripes'].includes(wing.pattern)&&['dots','stripes'].includes(leaf.pattern)&&wing.color===leaf.color&&wing.pattern!==leaf.pattern}
  window.AnimalColoringHabitat24Practice=Object.freeze({ready:false,art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage24-source-v3.png',mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage24-v3-mask.png',anchors:points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})),titles,areaNames,goalCopy,goalComplete});
})();
