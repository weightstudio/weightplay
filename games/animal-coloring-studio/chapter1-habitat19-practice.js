// Unreviewed localhost-only page and optional contrast activity.
(() => {
  const points=[[116,512],[444,213],[413,251],[594,259],[374,445],[618,299],[213,785],[433,577],[599,632],[725,794],[545,717],[360,763],[665,884],[383,891],[538,1030]];
  const titles={en:'Acorn Squirrel','zh-Hant':'松鼠與橡實','zh-Hans':'松鼠与橡实',ja:'リスとどんぐり',ko:'다람쥐와 도토리',es:'Ardilla y bellota','pt-BR':'Esquilo e bolota',fr:'Écureuil et gland',de:'Eichhörnchen und Eichel',it:'Scoiattolo e ghianda',ru:'Белка и жёлудь',hi:'गिलहरी और बलूत',ar:'السنجاب والبلوط'};
  const areaNames={
    en:['Tail','Left ear edge','Left inner ear','Right ear edge','Face','Right inner ear','Arm and body','Chest','Acorn cap','Basket rim','Acorn shell','Tummy','Basket','Rear foot','Leaf'],
    'zh-Hant':['尾巴','左耳側面','左耳內側','右耳側面','臉','右耳內側','手臂與身體','胸口','橡實帽','籃口與提把','橡實殼','肚子','籃身','後腳','葉子'],
    'zh-Hans':['尾巴','左耳侧面','左耳内侧','右耳侧面','脸','右耳内侧','手臂与身体','胸口','橡实帽','篮口与提手','橡实壳','肚子','篮身','后脚','叶子'],
    ja:['しっぽ','左耳の側面','左耳の内側','右耳の側面','顔','右耳の内側','腕と体','胸','どんぐりの帽子','かごのふち','どんぐりの実','お腹','かご','後ろ足','葉'],
    ko:['꼬리','왼쪽 귀 옆','왼쪽 귀 안','오른쪽 귀 옆','얼굴','오른쪽 귀 안','팔과 몸','가슴','도토리 모자','바구니 테두리','도토리 열매','배','바구니','뒷발','잎'],
    es:['Cola','Borde de oreja izquierda','Interior de oreja izquierda','Borde de oreja derecha','Cara','Interior de oreja derecha','Brazo y cuerpo','Pecho','Cúpula de bellota','Borde de cesta','Bellota','Barriga','Cesta','Pata trasera','Hoja'],
    'pt-BR':['Cauda','Lado da orelha esquerda','Dentro da orelha esquerda','Lado da orelha direita','Rosto','Dentro da orelha direita','Braço e corpo','Peito','Chapéu da bolota','Borda da cesta','Bolota','Barriga','Cesta','Pata traseira','Folha'],
    fr:['Queue','Bord oreille gauche','Intérieur oreille gauche','Bord oreille droite','Visage','Intérieur oreille droite','Bras et corps','Poitrine','Chapeau du gland','Bord du panier','Gland','Ventre','Panier','Patte arrière','Feuille'],
    de:['Schwanz','Linker Ohrrand','Linkes Innenohr','Rechter Ohrrand','Gesicht','Rechtes Innenohr','Arm und Körper','Brust','Eichelhütchen','Korb und Henkelrand','Eichel','Bauch','Korb','Hinterfuß','Blatt'],
    it:['Coda','Bordo orecchio sinistro','Interno orecchio sinistro','Bordo orecchio destro','Muso','Interno orecchio destro','Braccio e corpo','Petto','Cappello della ghianda','Bordo del cesto','Ghianda','Pancia','Cesto','Piede posteriore','Foglia'],
    ru:['Хвост','Край левого уха','Внутри левого уха','Край правого уха','Мордочка','Внутри правого уха','Рука и тело','Грудка','Шапочка жёлудя','Край корзины','Жёлудь','Живот','Корзина','Задняя лапка','Лист'],
    hi:['पूँछ','बाएँ कान का किनारा','बाएँ कान के भीतर','दाएँ कान का किनारा','चेहरा','दाएँ कान के भीतर','बाँह और शरीर','छाती','बलूत की टोपी','टोकरी का किनारा','बलूत','पेट','टोकरी','पिछला पैर','पत्ता'],
    ar:['الذيل','جانب الأذن اليسرى','داخل الأذن اليسرى','جانب الأذن اليمنى','الوجه','داخل الأذن اليمنى','الذراع والجسم','الصدر','قبعة البلوط','حافة السلة','البلوط','البطن','السلة','القدم الخلفية','الورقة']
  };
  const goalCopy={
    en:['Pattern the acorn or leaf, and color the basket solid.','Challenge complete: pattern and solid together!'],
    'zh-Hant':['在橡實或葉子加圖案，籃身則用實色。','挑戰完成：圖案與實色搭配！'],
    'zh-Hans':['在橡实或叶子加图案，篮身则用纯色。','挑战完成：图案与纯色搭配！'],
    ja:['どんぐりか葉に模様、かごには単色をつけよう。','達成！模様と単色の組み合わせ！'],
    ko:['도토리나 잎에 무늬를 넣고 바구니는 단색으로 칠해요.','도전 완료! 무늬와 단색을 함께!'],
    es:['Pon un patrón en la bellota o la hoja y color liso en la cesta.','¡Reto completado: patrón y color liso!'],
    'pt-BR':['Use um padrão na bolota ou folha e uma cor lisa na cesta.','Desafio concluído: padrão e cor lisa!'],
    fr:['Ajoute un motif au gland ou à la feuille et une couleur unie au panier.','Défi réussi : motif et couleur unie !'],
    de:['Gib Eichel oder Blatt ein Muster und male den Korb einfarbig.','Geschafft: Muster und einfarbiger Korb!'],
    it:['Metti un motivo sulla ghianda o sulla foglia e un colore pieno sul cesto.','Sfida completata: motivo e colore pieno!'],
    ru:['Добавь узор на жёлудь или лист, а корзину закрась одним цветом.','Готово: узор и однотонная корзина!'],
    hi:['बलूत या पत्ते पर पैटर्न और टोकरी में सादा रंग भरें।','चुनौती पूरी: पैटर्न और सादा रंग!'],
    ar:['أضف نقشًا للبلوط أو الورقة ولونًا سادة للسلة.','اكتمل التحدي: نقش ولون سادة!']
  };
  function goalComplete(fills){const basket=fills.get('13,173,81');return typeof basket==='string'&&['11,173,81','15,173,81'].some(key=>{const item=fills.get(key);return item&&['dots','stripes'].includes(item.pattern)})}
  window.AnimalColoringHabitat19Practice=Object.freeze({ready:false,id:'acorn-squirrel-practice',titles,areaNames,goalCopy,goalComplete,
    art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage19-source-v1.png',mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage19-v1-mask.png',
    anchors:Object.freeze(points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})))
  });
})();
