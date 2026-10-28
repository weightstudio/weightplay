// Unreviewed localhost-only checkpoint; not a campaign page.
(() => {
  const points=[[296,396],[192,507],[374,437],[552,536],[481,565],[619,566],[548,612],[464,622],[634,622],[543,682],[227,651],[296,713],[133,717],[315,741],[218,763],[393,580]];
  const titles={en:'Pond Gathering','zh-Hant':'池塘聚會','zh-Hans':'池塘聚会',ja:'池の集まり',ko:'연못 모임',es:'Reunión en el estanque','pt-BR':'Encontro no lago',fr:'Rencontre à l’étang',de:'Treffen am Teich',it:'Incontro allo stagno',ru:'Встреча у пруда',hi:'तालाब की मुलाकात',ar:'لقاء البركة'};
  const areaNames={
    en:['Duck','Duck wing','Duck bill','Top petal','Upper left petal','Upper right petal','Flower center','Lower left petal','Lower right petal','Lily pad','Top fin','Fish','Tail','Fish mouth','Side fin','Water'],
    'zh-Hant':['鴨子','鴨翅','鴨嘴','上花瓣','左上花瓣','右上花瓣','花心','左下花瓣','右下花瓣','荷葉','上魚鰭','魚','魚尾','魚嘴','側魚鰭','池水'],
    'zh-Hans':['鸭子','鸭翅','鸭嘴','上花瓣','左上花瓣','右上花瓣','花心','左下花瓣','右下花瓣','荷叶','上鱼鳍','鱼','鱼尾','鱼嘴','侧鱼鳍','池水'],
    ja:['アヒル','翼','くちばし','上の花びら','左上の花びら','右上の花びら','花の中心','左下の花びら','右下の花びら','ハスの葉','上のひれ','魚','尾','魚の口','横のひれ','水'],
    ko:['오리','오리 날개','오리 부리','위 꽃잎','왼쪽 위 꽃잎','오른쪽 위 꽃잎','꽃 가운데','왼쪽 아래 꽃잎','오른쪽 아래 꽃잎','연잎','위 지느러미','물고기','꼬리','물고기 입','옆 지느러미','물'],
    es:['Pato','Ala','Pico','Pétalo superior','Pétalo superior izquierdo','Pétalo superior derecho','Centro de flor','Pétalo inferior izquierdo','Pétalo inferior derecho','Hoja de nenúfar','Aleta superior','Pez','Cola','Boca del pez','Aleta lateral','Agua'],
    'pt-BR':['Pato','Asa','Bico','Pétala de cima','Pétala superior esquerda','Pétala superior direita','Centro da flor','Pétala inferior esquerda','Pétala inferior direita','Folha de vitória-régia','Barbatana superior','Peixe','Cauda','Boca do peixe','Barbatana lateral','Água'],
    fr:['Canard','Aile','Bec','Pétale du haut','Pétale haut gauche','Pétale haut droit','Cœur de fleur','Pétale bas gauche','Pétale bas droit','Nénuphar','Nageoire du haut','Poisson','Queue','Bouche du poisson','Nageoire latérale','Eau'],
    de:['Ente','Flügel','Schnabel','Oberes Blütenblatt','Blütenblatt oben links','Blütenblatt oben rechts','Blütenmitte','Blütenblatt unten links','Blütenblatt unten rechts','Seerosenblatt','Obere Flosse','Fisch','Schwanz','Fischmaul','Seitenflosse','Wasser'],
    it:['Anatra','Ala','Becco','Petalo superiore','Petalo in alto a sinistra','Petalo in alto a destra','Centro del fiore','Petalo in basso a sinistra','Petalo in basso a destra','Foglia di ninfea','Pinna superiore','Pesce','Coda','Bocca del pesce','Pinna laterale','Acqua'],
    ru:['Утка','Крыло','Клюв','Верхний лепесток','Верхний левый лепесток','Верхний правый лепесток','Середина цветка','Нижний левый лепесток','Нижний правый лепесток','Лист кувшинки','Верхний плавник','Рыба','Хвост','Рот рыбы','Боковой плавник','Вода'],
    hi:['बत्तख','पंख','चोंच','ऊपरी पंखुड़ी','ऊपरी बाईं पंखुड़ी','ऊपरी दाईं पंखुड़ी','फूल का केंद्र','निचली बाईं पंखुड़ी','निचली दाईं पंखुड़ी','कमल का पत्ता','ऊपरी पंख','मछली','पूँछ','मछली का मुँह','बगल का पंख','पानी'],
    ar:['البطة','الجناح','المنقار','البتلة العليا','البتلة العليا اليسرى','البتلة العليا اليمنى','وسط الزهرة','البتلة السفلى اليسرى','البتلة السفلى اليمنى','ورقة الزنبق','الزعنفة العليا','السمكة','الذيل','فم السمكة','الزعنفة الجانبية','الماء']
  };
  const goalCopy={
    en:['On the duck, fish and lily pad, use dots once, stripes once and one solid color.','Challenge complete: dots, stripes and a solid color!'],
    'zh-Hant':['鴨子、魚和荷葉各選一種：圓點、條紋及實色。','挑戰完成：圓點、條紋和實色！'],
    'zh-Hans':['鸭子、鱼和荷叶各选一种：圆点、条纹及纯色。','挑战完成：圆点、条纹和纯色！'],
    ja:['アヒル、魚、葉を水玉・しま・単色で一つずつ塗ろう。','達成！水玉、しま、単色！'],
    ko:['오리, 물고기, 연잎에 점, 줄무늬, 단색을 하나씩 써요.','완료! 점, 줄무늬, 단색!'],
    es:['Usa puntos, rayas y un color liso, uno en cada uno: pato, pez y hoja.','¡Reto completado: puntos, rayas y color liso!'],
    'pt-BR':['Use pontos, listras e cor lisa, um em cada: pato, peixe e folha.','Desafio concluído: pontos, listras e cor lisa!'],
    fr:['Sur le canard, le poisson et la feuille, utilise pois, rayures et couleur unie une fois chacun.','Défi réussi : pois, rayures et couleur unie !'],
    de:['Gib Ente, Fisch und Blatt je einmal Punkte, Streifen und eine einfarbige Fläche.','Geschafft: Punkte, Streifen und eine einfarbige Fläche!'],
    it:['Usa punti, righe e un colore uniforme, uno ciascuno su anatra, pesce e foglia.','Sfida completata: punti, righe e colore uniforme!'],
    ru:['Раскрась утку, рыбу и лист: один в горошек, другой в полоску, третий однотонно.','Готово: горошек, полоски и сплошной цвет!'],
    hi:['बत्तख, मछली और पत्ते पर बिंदु, धारियाँ और एक सादा रंग अलग-अलग लगाएँ।','चुनौती पूरी: बिंदु, धारियाँ और सादा रंग!'],
    ar:['استخدم النقاط والخطوط واللون السادة مرة لكل من البطة والسمكة والورقة.','اكتمل التحدي: نقاط وخطوط ولون سادة!']
  };
  function goalComplete(fills){const values=['1,173,81','10,173,81','12,173,81'].map(key=>fills.get(key));return values.filter(value=>typeof value==='string').length===1&&values.filter(value=>value&&typeof value==='object'&&value.pattern==='dots').length===1&&values.filter(value=>value&&typeof value==='object'&&value.pattern==='stripes').length===1}
  window.AnimalColoringHabitat25Practice=Object.freeze({ready:false,art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage25-source-v4.png',mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage25-v4-mask.png',anchors:points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})),titles,areaNames,goalCopy,goalComplete});
})();
