// Unreviewed localhost-only candidate; not a formal campaign page.
(() => {
  const points=[[414,238],[192,363],[623,386],[579,946],[327,575],[358,576],[216,583],[365,631],[569,573],[577,614],[541,676],[136,713],[402,681],[252,723],[69,774],[497,757],[121,861],[450,796],[368,812],[330,899],[207,904],[378,926],[400,967],[337,984]];
  const areaNames={
    en:['Top crown','Left crown','Right crown','Trunk and branch','Right ear edge','Right inner ear','Left ear edge','Face','Hollow rim','Inside hollow','Leaf','Tail tip','Nose','Cheek edge','Tail side','Holding paw','Tail','Arm','Chest','Body side','Body and back leg','Front leg','Right foot','Left foot'],
    'zh-Hant':['上方樹冠','左方樹冠','右方樹冠','樹幹與樹枝','右耳側面','右耳內側','左耳側面','狐狸臉','樹洞外緣','樹洞內側','葉子','尾巴尖','鼻子','臉頰側面','尾巴側面','拿葉的手','尾巴','手臂','胸口','身體側面','身體與後腿','前腿','右腳','左腳'],
    'zh-Hans':['上方树冠','左方树冠','右方树冠','树干与树枝','右耳侧面','右耳内侧','左耳侧面','狐狸脸','树洞外缘','树洞内侧','叶子','尾巴尖','鼻子','脸颊侧面','尾巴侧面','拿叶的手','尾巴','手臂','胸口','身体侧面','身体与后腿','前腿','右脚','左脚'],
    ar:['أعلى الشجرة','يسار أوراق الشجرة','يمين أوراق الشجرة','الجذع والغصن','جانب الأذن اليمنى','داخل الأذن اليمنى','جانب الأذن اليسرى','وجه الثعلب','حافة التجويف','داخل التجويف','الورقة','طرف الذيل','الأنف','جانب الخد','جانب الذيل','الكف الممسك','الذيل','الذراع','الصدر','جانب الجسم','الجسم والساق الخلفية','الساق الأمامية','القدم اليمنى','القدم اليسرى']
  };
  const titles={en:'Fox and Tree','zh-Hant':'狐狸與大樹','zh-Hans':'狐狸与大树',ja:'キツネと木',ko:'여우와 나무',es:'Zorro y árbol','pt-BR':'Raposa e árvore',fr:'Renard et arbre',de:'Fuchs und Baum',it:'Volpe e albero',ru:'Лиса и дерево',hi:'लोमड़ी और पेड़',ar:'الثعلب والشجرة'};
  window.AnimalColoringHabitat16Practice=Object.freeze({ready:false,id:'fox-tree-practice',titles,
    art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage16-source-v5.png',
    mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage16-v5-mask.png',areaNames,
    anchors:Object.freeze(points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})))
  });
})();
