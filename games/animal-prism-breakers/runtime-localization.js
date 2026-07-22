(()=>{
  "use strict";
  const copies={
    en:{loading:"Charging the prism arena…",stage:"Stage {n}",chapters:["Sunlit Quarry","Split Spectrum","Moving Gallery","Mirror Vault","Gravity Forge","Eclipse Prism"],launch:"Launch",lost:"Orb lost. Launch the next light orb.",split:"Split Spectrum created another light orb!",fail:"All three light orbs fell. Read the return angle and try again."},
    "zh-Hant":{loading:"稜光競技場充能中…",stage:"第 {n} 關",chapters:["日照採石場","分光光譜","移動畫廊","鏡面寶庫","重力熔爐","蝕光稜鏡"],launch:"發射",lost:"光球落下了。請發射下一顆光球。",split:"分光光譜產生了另一顆光球！",fail:"三顆光球都落下了。重新判讀回彈角度再試一次。"},
    "zh-Hans":{loading:"棱光竞技场充能中…",stage:"第 {n} 关",chapters:["日照采石场","分光光谱","移动画廊","镜面宝库","重力熔炉","蚀光棱镜"],launch:"发射",lost:"光球落下了。请发射下一颗光球。",split:"分光光谱产生了另一颗光球！",fail:"三颗光球都落下了。重新判断回弹角度再试一次。"},
    ja:{loading:"プリズムアリーナを起動中…",stage:"ステージ {n}",chapters:["日だまりの採石場","分光スペクトラム","移動回廊","鏡の宝物庫","重力炉","食のプリズム"],launch:"発射",lost:"光球を失いました。次の光球を発射してください。",split:"分光スペクトラムが新しい光球を生み出しました！",fail:"3つの光球がすべて落下しました。反射角を見直してもう一度挑戦してください。"},
    ko:{loading:"프리즘 경기장 충전 중…",stage:"스테이지 {n}",chapters:["햇빛 채석장","분할 스펙트럼","움직이는 회랑","거울 금고","중력 용광로","일식 프리즘"],launch:"발사",lost:"빛 구슬을 잃었습니다. 다음 빛 구슬을 발사하세요.",split:"분할 스펙트럼이 빛 구슬을 하나 더 만들었습니다!",fail:"빛 구슬 세 개가 모두 떨어졌습니다. 반사 각도를 다시 살펴보고 재도전하세요."},
    es:{loading:"Cargando la arena prismática…",stage:"Fase {n}",chapters:["Cantera soleada","Espectro dividido","Galería móvil","Bóveda de espejos","Forja gravitatoria","Prisma del eclipse"],launch:"Lanzar",lost:"Orbe perdido. Lanza el siguiente orbe de luz.",split:"¡El espectro dividido creó otro orbe de luz!",fail:"Los tres orbes de luz cayeron. Revisa el ángulo de rebote e inténtalo de nuevo."},
    "pt-BR":{loading:"Carregando a arena prismática…",stage:"Fase {n}",chapters:["Pedreira ensolarada","Espectro dividido","Galeria móvel","Cofre de espelhos","Forja gravitacional","Prisma do eclipse"],launch:"Lançar",lost:"Orbe perdido. Lance o próximo orbe de luz.",split:"O espectro dividido criou outro orbe de luz!",fail:"Os três orbes de luz caíram. Reveja o ângulo de retorno e tente novamente."},
    fr:{loading:"Chargement de l’arène prismatique…",stage:"Niveau {n}",chapters:["Carrière ensoleillée","Spectre divisé","Galerie mobile","Voûte des miroirs","Forge gravitationnelle","Prisme de l’éclipse"],launch:"Lancer",lost:"Orbe perdu. Lancez le prochain orbe de lumière.",split:"Le spectre divisé a créé un nouvel orbe de lumière !",fail:"Les trois orbes de lumière sont tombés. Revoyez l’angle de retour et réessayez."},
    de:{loading:"Prismenarena wird geladen…",stage:"Stufe {n}",chapters:["Sonnensteinbruch","Geteiltes Spektrum","Bewegliche Galerie","Spiegelgewölbe","Gravitationsschmiede","Finsternisprisma"],launch:"Starten",lost:"Lichtkugel verloren. Starte die nächste Lichtkugel.",split:"Das geteilte Spektrum hat eine weitere Lichtkugel erzeugt!",fail:"Alle drei Lichtkugeln sind gefallen. Prüfe den Rückprallwinkel und versuche es erneut."},
    it:{loading:"Caricamento dell'arena prismatica…",stage:"Fase {n}",chapters:["Cava soleggiata","Spettro diviso","Galleria mobile","Galleria specchiata","Forgia gravitazionale","Prisma dell'eclissi"],launch:"Lancia",lost:"Sfera persa. Lancia la prossima sfera di luce.",split:"Lo spettro diviso ha creato un'altra sfera di luce!",fail:"Tutte e tre le sfere di luce sono cadute. Controlla l'angolo di ritorno e riprova."},
    ru:{loading:"Загрузка призматической арены…",stage:"Этап {n}",chapters:["Солнечный карьер","Разделённый спектр","Движущаяся галерея","Зеркальное хранилище","Гравитационная кузница","Призма затмения"],launch:"Запустить",lost:"Световая сфера потеряна. Запустите следующую.",split:"Разделённый спектр создал ещё одну световую сферу!",fail:"Все три световые сферы упали. Проверьте угол отскока и попробуйте снова."},
    hi:{loading:"प्रिज़्म अखाड़ा तैयार हो रहा है…",stage:"चरण {n}",chapters:["धूप वाली खदान","विभाजित स्पेक्ट्रम","चलती दीर्घा","दर्पण तिजोरी","गुरुत्व भट्ठी","ग्रहण प्रिज़्म"],launch:"छोड़ें",lost:"प्रकाश गोला गिर गया। अगला प्रकाश गोला छोड़ें।",split:"विभाजित स्पेक्ट्रम ने एक और प्रकाश गोला बनाया!",fail:"तीनों प्रकाश गोले गिर गए। वापसी का कोण समझकर फिर प्रयास करें।"},
    ar:{loading:"جارٍ شحن ساحة المنشور…",stage:"المرحلة {n}",chapters:["المحجر المشمس","الطيف المنقسم","الرواق المتحرك","قبو المرايا","مسبك الجاذبية","منشور الكسوف"],launch:"إطلاق",lost:"فُقدت كرة الضوء. أطلق كرة الضوء التالية.",split:"أنشأ الطيف المنقسم كرة ضوء أخرى!",fail:"سقطت كرات الضوء الثلاث. راجع زاوية الارتداد وحاول مجددًا."}
  };
  const locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang||"en",copy=copies[locale]||copies.en;
  const shared=value=>window.WeightPlayGameRuntimeLocalizer?.translate?.(value)??value;
  const exact=new Map([["Charging the prism arena…",copy.loading],["Launch",copy.launch],["Orb lost. Launch the next light orb.",copy.lost],["Split Spectrum created another light orb!",copy.split],["All three light orbs fell. Read the return angle and try again.",copy.fail]]);
  const arabicGuide={
    "Prism brick-breaker arcade":"لعبة أركيد لتحطيم البلورات المنشورية",
    "Original WeightPlay block arcade":"لعبة تحطيم بلورات أصلية من WeightPlay",
    "Fox returning light orbs into crystal blocks":"ثعلب يعيد كرات الضوء نحو كتل البلورات",
    "Control every return angle and shatter the crystal formation before the last orb falls.":"تحكم في كل زاوية ارتداد وحطم تشكيل البلورات قبل سقوط آخر كرة ضوء.",
    "Where the orb meets the paddle controls its next angle.":"نقطة اصطدام كرة الضوء بالمضرب تحدد زاوية ارتدادها التالية.",
    "Track the returning light, move early, and strike with the paddle edge to reach protected lanes. Catch prism powers without abandoning the next return.":"راقب الضوء العائد وتحرك مبكرًا واضرب بحافة المضرب للوصول إلى الممرات المحمية. التقط قوى المنشور من دون إهمال الارتداد التالي.",
    "How to play":"طريقة اللعب",
    "Drag the paddle or use Left/Right and A/D.":"اسحب المضرب أو استخدم اليسار واليمين أو A وD.",
    "Return the orb with the paddle centre for control or edge for a sharper angle.":"أعد كرة الضوء بوسط المضرب للتحكم، أو بحافته للحصول على زاوية أشد.",
    "Clear every breakable crystal before losing all three orbs.":"حطم كل بلورة قابلة للكسر قبل فقدان كرات الضوء الثلاث.",
    "Thirty formations":"ثلاثون تشكيلاً",
    "Six arcade chapters add multi-orbs, moving bands, mirrors, gravity wells and rhythmic shields.":"تضيف ستة فصول كرات ضوء متعددة وأشرطة متحركة ومرايا وآبار جاذبية ودروعًا إيقاعية.",
    "Return the light orb and shatter every breakable crystal.":"أعد كرة الضوء وحطم كل بلورة قابلة للكسر.",
    "Drag anywhere across the arena to align the paddle with your finger. Contact near the paddle edge creates a sharper return angle.":"اسحب في أي مكان داخل الساحة لمحاذاة المضرب مع إصبعك. الاصطدام قرب حافة المضرب يصنع زاوية ارتداد أشد.",
    "The crystal formation has shattered.":"تحطم تشكيل البلورات."
  };
  if(locale==="ar")Object.entries(arabicGuide).forEach(([source,translated])=>exact.set(source,translated));
  const contextual={
    it:{Score:"Punteggio",Blocks:"Blocchi",Orbs:"Sfere",Combo:"Serie","Stage Map":"Elenco fasi"},
    ar:{Score:"النقاط",Blocks:"البلورات",Orbs:"كرات الضوء",Combo:"سلسلة","Stage Map":"خريطة المراحل"}
  }[locale];
  if(contextual)Object.entries(contextual).forEach(([source,translated])=>exact.set(source,translated));
  copies.en.chapters.forEach((chapter,index)=>{
    const translated=copy.chapters[index];
    exact.set(chapter,translated);
    exact.set(shared(chapter),translated);
  });
  const translate=value=>{if(typeof value!=="string"||!value)return value;if(exact.has(value))return exact.get(value);const stage=value.match(/^Stage (\d+)$/u);return stage?copy.stage.replace("{n}",stage[1]):shared(value)};
  const C=window.BlockTrilogyConfig;
  const genericKeys=["title","posterAlt","pitch","guideTitle","guideIntro","growth","objective","help","win"],originals={};
  if(C){genericKeys.forEach(key=>{originals[key]=C[key];C[key]=translate(C[key])});originals.how=[...C.how];C.how=C.how.map(translate);C.fail=copy.fail;C.chapters=[...copy.chapters]}
  const translateTree=root=>{if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);do{const node=walker.currentNode;if(node.nodeType===Node.TEXT_NODE&&node.parentElement&&!['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement.tagName)){const source=node.data.trim(),next=translate(source);if(next!==source)node.data=node.data.replace(source,next)}}while(walker.nextNode())};
  translateTree(document.documentElement);
  document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{translateTree(document.documentElement);if(C){genericKeys.forEach(key=>{C[key]=originals[key]});C.how=[...originals.how]}},0),{once:true});
  new MutationObserver(records=>records.forEach(record=>record.type==="characterData"?translateTree(record.target.parentElement):record.addedNodes.forEach(translateTree))).observe(document.documentElement,{childList:true,characterData:true,subtree:true});
  window.PrismBreakersLocale=Object.freeze({locale,translate,copy});
})();
