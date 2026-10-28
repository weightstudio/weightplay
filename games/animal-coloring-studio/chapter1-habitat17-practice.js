// Unreviewed localhost-only page and optional challenge; not a campaign page.
(() => {
  const points=[[206,503],[513,431],[632,734],[417,747],[512,694],[164,942],[659,851],[481,860]];
  const titles={en:'Leaf Hedgehog','zh-Hant':'刺蝟與落葉','zh-Hans':'刺猬与落叶',ja:'ハリネズミと葉',ko:'고슴도치와 잎',es:'Erizo y hojas','pt-BR':'Ouriço e folhas',fr:'Hérisson et feuilles',de:'Igel und Blätter',it:'Riccio e foglie',ru:'Ёжик и листья',hi:'साही और पत्ते',ar:'القنفذ والأوراق'};
  const areaNames={
    en:['Spiky back','Face','Held leaf','Body','Holding paw','Fallen leaf','Right foot','Left foot'],
    'zh-Hant':['背刺','臉','手中的葉','身體','拿葉的手','落葉','右腳','左腳'],
    'zh-Hans':['背刺','脸','手中的叶','身体','拿叶的手','落叶','右脚','左脚'],
    ja:['背中の針','顔','持った葉','体','葉を持つ手','落ち葉','右足','左足'],
    ko:['등의 가시','얼굴','든 잎','몸','잎을 든 발','떨어진 잎','오른발','왼발'],
    es:['Púas','Cara','Hoja sostenida','Cuerpo','Pata que sostiene','Hoja caída','Pie derecho','Pie izquierdo'],
    'pt-BR':['Espinhos','Rosto','Folha segura','Corpo','Pata que segura','Folha caída','Pé direito','Pé esquerdo'],
    fr:['Piquants','Visage','Feuille tenue','Corps','Patte qui tient','Feuille tombée','Pied droit','Pied gauche'],
    de:['Stacheln','Gesicht','Gehaltenes Blatt','Körper','Haltende Pfote','Gefallenes Blatt','Rechter Fuß','Linker Fuß'],
    it:['Aculei','Muso','Foglia tenuta','Corpo','Zampa che tiene','Foglia caduta','Piede destro','Piede sinistro'],
    ru:['Иголки','Мордочка','Лист в лапе','Тело','Лапа с листом','Опавший лист','Правая ступня','Левая ступня'],
    hi:['पीठ के काँटे','चेहरा','पकड़ा हुआ पत्ता','शरीर','पकड़ने वाला पंजा','गिरा पत्ता','दायाँ पैर','बायाँ पैर'],
    ar:['أشواك الظهر','الوجه','الورقة المحمولة','الجسم','الكف الممسك','الورقة الساقطة','القدم اليمنى','القدم اليسرى']
  };
  const goalCopy={
    en:['Add dots to the body and a leaf in different colors.','Challenge complete: two colors, matching dots!'],
    'zh-Hant':['用不同顏色在身體和一片葉子上加圓點。','挑戰完成：不同底色，相同圓點！'],
    'zh-Hans':['用不同颜色在身体和一片叶子上加圆点。','挑战完成：不同底色，相同圆点！'],
    ja:['体と葉に違う色で水玉をつけよう。','チャレンジ達成！違う色でおそろいの水玉！'],
    ko:['몸과 잎 하나에 서로 다른 색의 점을 찍어요.','도전 완료! 다른 색에 같은 점무늬!'],
    es:['Pon puntos de distintos colores en el cuerpo y una hoja.','¡Reto completado: dos colores, puntos iguales!'],
    'pt-BR':['Coloque bolinhas de cores diferentes no corpo e em uma folha.','Desafio concluído: duas cores, bolinhas iguais!'],
    fr:['Ajoute des pois de couleurs différentes sur le corps et une feuille.','Défi réussi : deux couleurs, les mêmes pois !'],
    de:['Male Punkte in zwei Farben auf Körper und ein Blatt.','Aufgabe geschafft: zwei Farben, gleiche Punkte!'],
    it:['Metti puntini di colori diversi sul corpo e su una foglia.','Sfida completata: due colori, stessi puntini!'],
    ru:['Добавь точки разных цветов на тело и один лист.','Задание выполнено: два цвета, одинаковые точки!'],
    hi:['शरीर और एक पत्ते पर अलग-अलग रंग के बिंदु लगाएँ।','चुनौती पूरी: दो रंग, एक जैसे बिंदु!'],
    ar:['أضف نقاطًا بلونين مختلفين إلى الجسم وورقة.','اكتمل التحدي: لونان ونقاط متشابهة!']
  };
  function goalComplete(fills){
    const body=fills.get('4,173,81');
    if(!body||body.pattern!=='dots'||typeof body.color!=='string')return false;
    return ['3,173,81','6,173,81'].some(key=>{const leaf=fills.get(key);return leaf&&leaf.pattern==='dots'&&typeof leaf.color==='string'&&leaf.color!==body.color});
  }
  window.AnimalColoringHabitat17Practice=Object.freeze({ready:false,id:'leaf-hedgehog-practice',titles,areaNames,goalCopy,goalComplete,
    art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage17-source-v4.png',
    mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage17-v4-mask.png',
    anchors:Object.freeze(points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})))
  });
})();
