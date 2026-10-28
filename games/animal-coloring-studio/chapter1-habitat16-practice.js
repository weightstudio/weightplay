// Unreviewed localhost-only candidate; not a formal campaign page.
(() => {
  const points=[[414,238],[192,363],[623,386],[579,946],[327,575],[358,576],[216,583],[365,631],[569,573],[577,614],[541,676],[136,713],[402,681],[252,723],[69,774],[497,757],[121,861],[450,796],[368,812],[330,899],[207,904],[378,926],[400,967],[337,984]];
  const areaNames={
    en:['Top crown','Left crown','Right crown','Trunk and branch','Right ear edge','Right inner ear','Left ear edge','Face','Hollow rim','Inside hollow','Leaf','Tail tip','Nose','Cheek edge','Tail side','Holding paw','Tail','Arm','Chest','Body side','Body and back leg','Front leg','Right foot','Left foot'],
    'zh-Hant':['上方樹冠','左方樹冠','右方樹冠','樹幹與樹枝','右耳側面','右耳內側','左耳側面','狐狸臉','樹洞外緣','樹洞內側','葉子','尾巴尖','鼻子','臉頰側面','尾巴側面','拿葉的手','尾巴','手臂','胸口','身體側面','身體與後腿','前腿','右腳','左腳'],
    'zh-Hans':['上方树冠','左方树冠','右方树冠','树干与树枝','右耳侧面','右耳内侧','左耳侧面','狐狸脸','树洞外缘','树洞内侧','叶子','尾巴尖','鼻子','脸颊侧面','尾巴侧面','拿叶的手','尾巴','手臂','胸口','身体侧面','身体与后腿','前腿','右脚','左脚'],
    ar:['أعلى الشجرة','يسار أوراق الشجرة','يمين أوراق الشجرة','الجذع والغصن','جانب الأذن اليمنى','داخل الأذن اليمنى','جانب الأذن اليسرى','وجه الثعلب','حافة التجويف','داخل التجويف','الورقة','طرف الذيل','الأنف','جانب الخد','جانب الذيل','الكف الممسك','الذيل','الذراع','الصدر','جانب الجسم','الجسم والساق الخلفية','الساق الأمامية','القدم اليمنى','القدم اليسرى']
  };
  Object.assign(areaNames,{
    ja:['上の葉','左の葉','右の葉','幹と枝','右耳の側面','右耳の内側','左耳の側面','顔','木の穴のふち','木の穴の中','葉','しっぽの先','鼻','ほほの側面','しっぽの側面','葉を持つ手','しっぽ','腕','胸','体の側面','体と後ろ足','前足','右足','左足'],
    ko:['위쪽 나뭇잎','왼쪽 나뭇잎','오른쪽 나뭇잎','나무줄기와 가지','오른쪽 귀 옆','오른쪽 귀 안','왼쪽 귀 옆','얼굴','나무 구멍 테두리','나무 구멍 안','잎','꼬리 끝','코','볼 옆','꼬리 옆','잎을 든 발','꼬리','팔','가슴','몸 옆','몸과 뒷다리','앞다리','오른발','왼발'],
    es:['Copa superior','Copa izquierda','Copa derecha','Tronco y rama','Borde de oreja derecha','Interior de oreja derecha','Borde de oreja izquierda','Cara','Borde del hueco','Interior del hueco','Hoja','Punta de cola','Nariz','Lado de la mejilla','Lado de la cola','Pata que sostiene','Cola','Brazo','Pecho','Lado del cuerpo','Cuerpo y pata trasera','Pata delantera','Pie derecho','Pie izquierdo'],
    'pt-BR':['Copa de cima','Copa esquerda','Copa direita','Tronco e galho','Lado da orelha direita','Dentro da orelha direita','Lado da orelha esquerda','Rosto','Borda do oco','Dentro do oco','Folha','Ponta da cauda','Nariz','Lado da bochecha','Lado da cauda','Pata que segura','Cauda','Braço','Peito','Lado do corpo','Corpo e perna traseira','Perna dianteira','Pé direito','Pé esquerdo'],
    fr:['Feuillage du haut','Feuillage gauche','Feuillage droit','Tronc et branche','Bord oreille droite','Intérieur oreille droite','Bord oreille gauche','Visage','Bord du creux','Intérieur du creux','Feuille','Pointe de la queue','Nez','Côté de la joue','Côté de la queue','Patte qui tient','Queue','Bras','Poitrine','Côté du corps','Corps et patte arrière','Patte avant','Pied droit','Pied gauche'],
    de:['Obere Baumkrone','Linke Baumkrone','Rechte Baumkrone','Stamm und Ast','Rechter Ohrrand','Rechtes Innenohr','Linker Ohrrand','Gesicht','Höhlenrand','In der Höhle','Blatt','Schwanzspitze','Nase','Wangenseite','Schwanzseite','Haltende Pfote','Schwanz','Arm','Brust','Körperseite','Körper und Hinterbein','Vorderbein','Rechter Fuß','Linker Fuß'],
    it:['Chioma in alto','Chioma a sinistra','Chioma a destra','Tronco e ramo','Bordo orecchio destro','Interno orecchio destro','Bordo orecchio sinistro','Muso','Bordo della cavità','Interno della cavità','Foglia','Punta della coda','Naso','Lato della guancia','Lato della coda','Zampa che tiene','Coda','Braccio','Petto','Lato del corpo','Corpo e zampa posteriore','Zampa anteriore','Piede destro','Piede sinistro'],
    ru:['Верх кроны','Левая крона','Правая крона','Ствол и ветка','Край правого уха','Внутри правого уха','Край левого уха','Мордочка','Край дупла','Внутри дупла','Лист','Кончик хвоста','Нос','Бок щёки','Бок хвоста','Лапа с листом','Хвост','Рука','Грудка','Бок тела','Тело и задняя лапа','Передняя лапа','Правая ступня','Левая ступня'],
    hi:['ऊपरी पत्ते','बाएँ पत्ते','दाएँ पत्ते','तना और डाली','दाएँ कान का किनारा','दाएँ कान के भीतर','बाएँ कान का किनारा','चेहरा','खोखले का किनारा','खोखले के भीतर','पत्ता','पूँछ की नोक','नाक','गाल का किनारा','पूँछ का किनारा','पत्ता पकड़े पंजा','पूँछ','बाँह','छाती','शरीर का किनारा','शरीर और पिछला पैर','अगला पैर','दायाँ पैर','बायाँ पैर']
  });
  const titles={en:'Fox and Tree','zh-Hant':'狐狸與大樹','zh-Hans':'狐狸与大树',ja:'キツネと木',ko:'여우와 나무',es:'Zorro y árbol','pt-BR':'Raposa e árvore',fr:'Renard et arbre',de:'Fuchs und Baum',it:'Volpe e albero',ru:'Лиса и дерево',hi:'लोमड़ी और पेड़',ar:'الثعلب والشجرة'};
  window.AnimalColoringHabitat16Practice=Object.freeze({ready:false,id:'fox-tree-practice',titles,
    art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage16-source-v5.png',
    mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage16-v5-mask.png',areaNames,
    anchors:Object.freeze(points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})))
  });
})();
