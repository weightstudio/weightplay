// Unreviewed localhost-only creative page; not a campaign page.
(() => {
  const points=[[268,436],[204,351],[527,347],[655,522],[222,552],[382,540],[252,557],[397,582],[557,617],[210,691],[411,738],[511,819],[336,825]];
  const titles={en:'Monkey in the Tree','zh-Hant':'樹上的猴子','zh-Hans':'树上的猴子',ja:'木の上のサル',ko:'나무 위 원숭이',es:'Mono en el árbol','pt-BR':'Macaco na árvore',fr:'Singe dans l’arbre',de:'Affe im Baum',it:'Scimmia sull’albero',ru:'Обезьянка на дереве',hi:'पेड़ पर बंदर',ar:'قرد على الشجرة'};
  const areaNames={
    en:['Tree','Inner leaf','Outer leaf','Banana','Outer ears','Head','Inner ears','Muzzle','Raised arm','Tail','Body and legs','Right foot','Left foot'],
    'zh-Hant':['樹','樹冠內葉','樹冠外葉','香蕉','外耳','頭','耳內','口鼻','舉起的手','尾巴','身體與腿','右腳','左腳'],
    'zh-Hans':['树','树冠内叶','树冠外叶','香蕉','外耳','头','耳内','口鼻','举起的手','尾巴','身体与腿','右脚','左脚'],
    ja:['木','内側の葉','外側の葉','バナナ','外耳','頭','耳の中','口元','上げた腕','しっぽ','体と足','右足','左足'],
    ko:['나무','안쪽 잎','바깥쪽 잎','바나나','귀 바깥','머리','귀 안쪽','입','든 팔','꼬리','몸과 다리','오른발','왼발'],
    es:['Árbol','Hoja interior','Hoja exterior','Plátano','Orejas externas','Cabeza','Orejas internas','Hocico','Brazo alzado','Cola','Cuerpo y patas','Pie derecho','Pie izquierdo'],
    'pt-BR':['Árvore','Folha interna','Folha externa','Banana','Orelhas externas','Cabeça','Orelhas internas','Focinho','Braço erguido','Cauda','Corpo e pernas','Pé direito','Pé esquerdo'],
    fr:['Arbre','Feuille intérieure','Feuille extérieure','Banane','Oreilles externes','Tête','Oreilles internes','Museau','Bras levé','Queue','Corps et pattes','Pied droit','Pied gauche'],
    de:['Baum','Inneres Blatt','Äußeres Blatt','Banane','Außenohren','Kopf','Innenohren','Schnauze','Gehobener Arm','Schwanz','Körper und Beine','Rechter Fuß','Linker Fuß'],
    it:['Albero','Foglia interna','Foglia esterna','Banana','Orecchie esterne','Testa','Orecchie interne','Muso','Braccio alzato','Coda','Corpo e zampe','Piede destro','Piede sinistro'],
    ru:['Дерево','Внутренний лист','Внешний лист','Банан','Уши снаружи','Голова','Уши внутри','Мордочка','Поднятая лапа','Хвост','Тело и ноги','Правая лапа','Левая лапа'],
    hi:['पेड़','भीतरी पत्ता','बाहरी पत्ता','केला','बाहरी कान','सिर','अंदरूनी कान','थूथन','उठा हाथ','पूँछ','शरीर और पैर','दायाँ पैर','बायाँ पैर'],
    ar:['الشجرة','الورقة الداخلية','الورقة الخارجية','الموزة','خارج الأذنين','الرأس','داخل الأذنين','الخطم','الذراع المرفوعة','الذيل','الجسم والساقان','القدم اليمنى','القدم اليسرى']
  };
  const goalCopy={
    en:['Give the inner and outer leaves different patterns.','Challenge complete: different leaf patterns!'],
    'zh-Hant':['樹冠內外兩片葉子用不同圖案。','挑戰完成：兩片葉子圖案不同！'],
    'zh-Hans':['树冠内外两片叶子用不同图案。','挑战完成：两片叶子图案不同！'],
    ja:['内側と外側の葉を違う模様にしよう。','達成！葉の模様が違う！'],
    ko:['안쪽과 바깥쪽 잎에 다른 무늬를 넣어요.','완료! 서로 다른 잎 무늬!'],
    es:['Usa patrones distintos en la hoja interior y la exterior.','¡Reto completado: hojas con patrones distintos!'],
    'pt-BR':['Use padrões diferentes nas folhas interna e externa.','Desafio concluído: folhas com padrões diferentes!'],
    fr:['Mets des motifs différents sur les feuilles intérieure et extérieure.','Défi réussi : des feuilles aux motifs différents !'],
    de:['Gib innerem und äußerem Blatt unterschiedliche Muster.','Geschafft: unterschiedliche Blattmuster!'],
    it:['Usa motivi diversi per la foglia interna e quella esterna.','Sfida completata: foglie con motivi diversi!'],
    ru:['Укрась внутренний и внешний листья разными узорами.','Готово: разные узоры на листьях!'],
    hi:['भीतरी और बाहरी पत्ते पर अलग पैटर्न लगाएँ।','चुनौती पूरी: पत्तों पर अलग पैटर्न!'],
    ar:['استخدم نمطين مختلفين للورقة الداخلية والخارجية.','اكتمل التحدي: نمطان مختلفان للورقتين!']
  };
  function goalComplete(fills){const a=fills.get('2,173,81'),b=fills.get('3,173,81');return !!a&&!!b&&typeof a==='object'&&typeof b==='object'&&['dots','stripes'].includes(a.pattern)&&['dots','stripes'].includes(b.pattern)&&a.pattern!==b.pattern}
  window.AnimalColoringHabitat29Practice=Object.freeze({ready:false,art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage29-source-v7.png',mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage29-v7-mask.png',anchors:points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})),titles,areaNames,goalCopy,goalComplete});
})();
