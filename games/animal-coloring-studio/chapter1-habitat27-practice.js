// Unreviewed localhost-only creative page; not a campaign page.
(() => {
  const points=[[379,156],[365,322],[614,325],[381,338],[596,340],[485,474],[490,514],[516,780],[456,853],[377,1052],[307,999],[218,1019],[545,1020],[427,1044]];
  const titles={en:'Alpaca Scarf','zh-Hant':'羊駝的圍巾','zh-Hans':'羊驼的围巾',ja:'アルパカのマフラー',ko:'알파카의 목도리',es:'Bufanda de alpaca','pt-BR':'Cachecol da alpaca',fr:'Écharpe de l’alpaga',de:'Alpakas Schal',it:'Sciarpa dell’alpaca',ru:'Шарф альпаки',hi:'अल्पाका का मफलर',ar:'وشاح الألبكة'};
  const areaNames={
    en:['Cloud','Left outer ear','Right outer ear','Left inner ear','Right inner ear','Head','Muzzle','Scarf','Fleece','Ground','Rear left hoof','Front left hoof','Rear right hoof','Front right hoof'],
    'zh-Hant':['雲','左外耳','右外耳','左耳內','右耳內','頭','口鼻','圍巾','羊毛','地面','左後蹄','左前蹄','右後蹄','右前蹄'],
    'zh-Hans':['云','左外耳','右外耳','左耳内','右耳内','头','口鼻','围巾','羊毛','地面','左后蹄','左前蹄','右后蹄','右前蹄'],
    ja:['雲','左の外耳','右の外耳','左の耳の中','右の耳の中','頭','口元','マフラー','羊毛','地面','左後ろのひづめ','左前のひづめ','右後ろのひづめ','右前のひづめ'],
    ko:['구름','왼쪽 귀 바깥','오른쪽 귀 바깥','왼쪽 귀 안','오른쪽 귀 안','머리','입','목도리','털','땅','왼쪽 뒷발굽','왼쪽 앞발굽','오른쪽 뒷발굽','오른쪽 앞발굽'],
    es:['Nube','Exterior oreja izquierda','Exterior oreja derecha','Interior oreja izquierda','Interior oreja derecha','Cabeza','Hocico','Bufanda','Lana','Suelo','Pezuña trasera izquierda','Pezuña delantera izquierda','Pezuña trasera derecha','Pezuña delantera derecha'],
    'pt-BR':['Nuvem','Orelha esquerda externa','Orelha direita externa','Orelha esquerda interna','Orelha direita interna','Cabeça','Focinho','Cachecol','Lã','Chão','Casco traseiro esquerdo','Casco dianteiro esquerdo','Casco traseiro direito','Casco dianteiro direito'],
    fr:['Nuage','Oreille gauche externe','Oreille droite externe','Oreille gauche interne','Oreille droite interne','Tête','Museau','Écharpe','Laine','Sol','Sabot arrière gauche','Sabot avant gauche','Sabot arrière droit','Sabot avant droit'],
    de:['Wolke','Linkes Außenohr','Rechtes Außenohr','Linkes Innenohr','Rechtes Innenohr','Kopf','Schnauze','Schal','Wolle','Boden','Huf hinten links','Huf vorne links','Huf hinten rechts','Huf vorne rechts'],
    it:['Nuvola','Orecchio sinistro esterno','Orecchio destro esterno','Orecchio sinistro interno','Orecchio destro interno','Testa','Muso','Sciarpa','Lana','Terra','Zoccolo posteriore sinistro','Zoccolo anteriore sinistro','Zoccolo posteriore destro','Zoccolo anteriore destro'],
    ru:['Облако','Левое ухо снаружи','Правое ухо снаружи','Левое ухо внутри','Правое ухо внутри','Голова','Мордочка','Шарф','Шерсть','Земля','Заднее левое копытце','Переднее левое копытце','Заднее правое копытце','Переднее правое копытце'],
    hi:['बादल','बायाँ बाहरी कान','दायाँ बाहरी कान','बायाँ अंदरूनी कान','दायाँ अंदरूनी कान','सिर','थूथन','मफलर','ऊन','ज़मीन','पिछला बायाँ खुर','अगला बायाँ खुर','पिछला दायाँ खुर','अगला दायाँ खुर'],
    ar:['السحابة','الأذن اليسرى الخارجية','الأذن اليمنى الخارجية','داخل الأذن اليسرى','داخل الأذن اليمنى','الرأس','الخطم','الوشاح','الصوف','الأرض','الحافر الخلفي الأيسر','الحافر الأمامي الأيسر','الحافر الخلفي الأيمن','الحافر الأمامي الأيمن']
  };
  const prompts={en:'Choose which way the scarf stripes slant.','zh-Hant':'選擇圍巾條紋的傾斜方向。','zh-Hans':'选择围巾条纹的倾斜方向。',ja:'マフラーのしまの向きを選ぼう。',ko:'목도리 줄무늬 방향을 골라요.',es:'Elige la dirección de las rayas de la bufanda.','pt-BR':'Escolha a direção das listras do cachecol.',fr:'Choisis le sens des rayures de l’écharpe.',de:'Wähle die Richtung der Schalstreifen.',it:'Scegli la direzione delle righe della sciarpa.',ru:'Выбери направление полосок на шарфе.',hi:'मफलर की धारियों की दिशा चुनें।',ar:'اختر اتجاه خطوط الوشاح.'};
  window.AnimalColoringHabitat27Practice=Object.freeze({ready:false,art:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/stage27-source-v4.png',mask:'/docs/game-build-handoffs/animal-coloring-studio-habitat-art/UNREVIEWED-stage27-v4-mask.png',anchors:points.map(([x,y],index)=>Object.freeze({x,y,key:`${index+1},173,81`})),titles,areaNames,prompts});
})();
