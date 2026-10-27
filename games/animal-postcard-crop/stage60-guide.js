// Postcard expansion guide data. Native-speaker and rendered review remain pending.
(() => {
  'use strict';
  const locales = {
  "en": {
    "intro": "Explore 60 postcard puzzles in two chapters. Move the frame to include the requested landmarks and leave unwanted ones outside.",
    "first": "Some cards ask for a landmark in a particular position. On cards 5, 10, 15 and 20, answer the composition question to complete the checkpoint.",
    "memory": "From card 31, take two pictures of the same scene. Capture the first two requested landmarks, choose a memory pin as instructed, then include that pin and the two new landmarks in the second picture. Follow any position and exclusion clues. On cards 31–34, keep the two new landmarks outside the first picture. A wrong pin can be undone or reset.",
    "lens": "From card 36, change between a 2×2 and a 3×2 frame at most once per attempt; the rectangular frame may also be rotated. Moves, rotations and lens changes each cost one move; captures and the pin are free.",
    "tips": "Hints help find a shortest valid route and may reduce stars. Your best stars and unlocked cards are saved in this browser when storage is available.",
    "waypoint": "On card 30, first pass the frame over the named landmark before completing the final crop.",
    "finale": "On card 60, after choosing the pin, move, rotate or change the lens so Rock enters the frame; the final picture must leave Rock outside."
  },
  "zh-Hant": {
    "intro": "探索兩個篇章共 60 道明信片謎題。移動取景框，把指定景物框入，並讓不需要的景物留在框外。",
    "first": "有些關卡要求景物位於特定位置。第 5、10、15、20 關需回答構圖問題，才能完成檢查點。",
    "memory": "從第 31 關起，同一場景要拍兩張。先框入第一組兩個指定景物，依提示選擇記憶針，再在第二張同時框入記憶針和另外兩個指定景物，並遵守位置與排除提示。第 31–34 關的第一張須避開第二張的兩個新目標。選錯針可復原或重設。",
    "lens": "從第 36 關起，每次挑戰最多可在 2×2 與 3×2 取景框之間切換一次；長方形取景框也可旋轉。移動、旋轉與切換鏡片各計一步，拍攝及選針不計步。",
    "tips": "提示協助找出最短合法路線，可能影響星數。瀏覽器儲存功能可用時，會保存最高星數及已解鎖關卡。",
    "waypoint": "第 30 關須先讓取景框經過指定景物，再完成最後構圖。",
    "finale": "第 60 關選好針後，須移動、旋轉或切換鏡片，讓岩石進入取景框；最後一張則須將岩石留在框外。"
  },
  "zh-Hans": {
    "intro": "探索两个篇章共 60 道明信片谜题。移动取景框，把指定景物框入，让不需要的景物留在框外。",
    "first": "有些关卡要求景物位于特定位置。第 5、10、15、20 关需要回答构图问题，才能完成检查点。",
    "memory": "从第 31 关起，同一场景要拍两张。先框入第一组两个指定景物，按提示选择记忆针，再在第二张同时框入记忆针和另外两个指定景物，并遵守位置与排除提示。第 31–34 关的第一张须避开第二张的两个新目标。选错针可以撤销或重置。",
    "lens": "从第 36 关起，每次挑战最多可在 2×2 与 3×2 取景框之间切换一次；长方形取景框也可旋转。移动、旋转与切换镜片各计一步，拍摄和选针不计步。",
    "tips": "提示帮助找出最短合法路线，可能影响星数。浏览器存储可用时，会保存最高星数和已解锁关卡。",
    "waypoint": "第 30 关须先让取景框经过指定景物，再完成最后构图。",
    "finale": "第 60 关选好针后，须移动、旋转或切换镜片，让岩石进入取景框；最后一张则须将岩石留在框外。"
  },
  "ja": {
    "intro": "2つの章にわたる60のポストカードパズルに挑戦。枠を動かして指定された景物を入れ、不要なものは外に出しましょう。",
    "first": "景物の位置も指定されることがあります。5・10・15・20面では構図の問題に答えてチェックポイントをクリアします。",
    "memory": "31面からは同じ場面を2枚撮ります。まず指定された2つを枠に入れ、指示に従って思い出ピンを選びます。2枚目にはピンと新しい2つの景物を入れ、位置や除外の指示も守りましょう。31〜34面では新しい2つを1枚目の枠外に置きます。ピンの選択は取り消すかリセットできます。",
    "lens": "36面からは1回の挑戦につき1度だけ、2×2と3×2の枠を切り替えられます。長方形の枠は回転も可能。移動・回転・レンズ切替は各1手、撮影とピン選択は手数に入りません。",
    "tips": "ヒントは最短の有効な経路を探す助けになりますが、星に影響することがあります。保存機能が使える場合、最高の星と開放した面はこのブラウザーに保存されます。",
    "waypoint": "30面では最後に撮る前に、指定された景物に枠を通します。",
    "finale": "60面ではピンを選んだ後、移動・回転・レンズ切替で岩を一度枠内に入れ、最後の写真では枠外に出します。"
  },
  "ko": {
    "intro": "두 개의 챕터로 구성된 60개의 엽서 퍼즐을 즐겨 보세요. 틀을 움직여 지정된 풍경은 안에, 제외할 풍경은 밖에 놓으세요.",
    "first": "어떤 단계에서는 풍경의 위치도 지정됩니다. 5, 10, 15, 20단계에서는 구도 질문에 답해 체크포인트를 완료하세요.",
    "memory": "31단계부터 같은 풍경을 두 번 찍습니다. 먼저 지정된 두 풍경을 담고 안내에 따라 기억 핀을 고른 뒤, 두 번째 사진에 그 핀과 새 목표 두 개를 함께 담으세요. 위치와 제외 조건도 지켜야 합니다. 31–34단계에서는 새 목표 두 개를 첫 사진 밖에 두세요. 잘못 고른 핀은 되돌리거나 초기화할 수 있습니다.",
    "lens": "36단계부터 한 번의 도전에서 2×2와 3×2 틀을 최대 한 번 전환할 수 있습니다. 직사각형 틀은 회전할 수도 있습니다. 이동·회전·렌즈 전환은 각각 한 수이며, 촬영과 핀 선택은 수에 들지 않습니다.",
    "tips": "힌트는 가장 짧은 유효 경로를 찾도록 돕고 별 개수에 영향을 줄 수 있습니다. 저장 기능을 사용할 수 있으면 최고 별과 열린 단계가 이 브라우저에 저장됩니다.",
    "waypoint": "30단계에서는 마지막 촬영 전에 지정된 풍경 위로 틀을 지나가게 하세요.",
    "finale": "60단계에서는 핀을 고른 뒤 이동·회전·렌즈 전환으로 바위를 틀 안에 한 번 넣고, 마지막 사진에서는 틀 밖에 두세요."
  },
  "es": {
    "intro": "Explora 60 puzles de postales en dos capítulos. Mueve el marco para incluir los elementos pedidos y dejar fuera los no deseados.",
    "first": "Algunas tarjetas piden colocar un elemento en una posición concreta. En las tarjetas 5, 10, 15 y 20 responde a la pregunta de composición para superar el punto de control.",
    "memory": "Desde la tarjeta 31, toma dos fotos de la misma escena. Encuadra los dos primeros elementos, elige una chincheta de recuerdo según las indicaciones y, en la segunda foto, incluye la chincheta y los dos elementos nuevos. Respeta las pistas de posición y exclusión. En las tarjetas 31–34, deja los dos elementos nuevos fuera de la primera foto. Puedes deshacer la elección de chincheta o reiniciar.",
    "lens": "Desde la tarjeta 36 puedes cambiar una vez por intento entre marcos de 2×2 y 3×2; el marco rectangular también gira. Mover, girar y cambiar de lente cuesta un movimiento cada uno; tomar fotos y elegir la chincheta no cuesta movimientos.",
    "tips": "La pista ayuda a encontrar una ruta válida más corta y puede afectar a las estrellas. Si el almacenamiento está disponible, tus mejores estrellas y tarjetas desbloqueadas se guardan en este navegador.",
    "waypoint": "En la tarjeta 30, pasa primero el marco por el elemento indicado antes de completar el encuadre final.",
    "finale": "En la tarjeta 60, después de elegir la chincheta, mueve, gira o cambia la lente para encuadrar la roca; en la foto final, déjala fuera."
  },
  "pt-BR": {
    "intro": "Explore 60 desafios de cartões-postais em dois capítulos. Mova a moldura para incluir os elementos pedidos e deixar os indesejados de fora.",
    "first": "Alguns cartões pedem um elemento em uma posição específica. Nos cartões 5, 10, 15 e 20, responda à pergunta de composição para concluir o ponto de controle.",
    "memory": "A partir do cartão 31, tire duas fotos da mesma cena. Enquadre os dois primeiros elementos, escolha um alfinete de lembrança conforme a indicação e inclua esse alfinete e os dois novos elementos na segunda foto. Siga também as pistas de posição e exclusão. Nos cartões 31–34, deixe os dois novos elementos fora da primeira foto. É possível desfazer a escolha do alfinete ou reiniciar.",
    "lens": "A partir do cartão 36, troque entre as molduras 2×2 e 3×2 no máximo uma vez por tentativa; a moldura retangular também pode girar. Mover, girar e trocar a lente custam um movimento cada; fotografar e escolher o alfinete não custam movimentos.",
    "tips": "A dica ajuda a encontrar um caminho válido mais curto e pode afetar as estrelas. Quando o armazenamento estiver disponível, as melhores estrelas e os cartões liberados serão salvos neste navegador.",
    "waypoint": "No cartão 30, passe primeiro a moldura pelo elemento indicado antes de concluir o enquadramento final.",
    "finale": "No cartão 60, depois de escolher o alfinete, mova, gire ou troque a lente para colocar a pedra na moldura; deixe-a fora da foto final."
  },
  "fr": {
    "intro": "Explorez 60 puzzles de cartes postales en deux chapitres. Déplacez le cadre pour inclure les éléments demandés et laisser les autres à l’extérieur.",
    "first": "Certaines cartes imposent aussi la position d’un élément. Aux cartes 5, 10, 15 et 20, répondez à la question de composition pour franchir le point de contrôle.",
    "memory": "Dès la carte 31, prenez deux photos de la même scène. Cadrez les deux premiers éléments, choisissez une épingle souvenir selon les indications, puis incluez cette épingle et les deux nouveaux éléments dans la seconde photo. Respectez les indices de position et d’exclusion. Aux cartes 31 à 34, les deux nouveaux éléments doivent rester hors de la première photo. Le choix de l’épingle peut être annulé ou réinitialisé.",
    "lens": "Dès la carte 36, changez au maximum une fois par essai entre les cadres 2×2 et 3×2 ; le cadre rectangulaire peut aussi tourner. Chaque déplacement, rotation ou changement de lentille coûte un mouvement ; la prise de vue et le choix de l’épingle sont gratuits.",
    "tips": "L’indice aide à trouver un plus court trajet valide et peut réduire les étoiles. Si le stockage est disponible, vos meilleures étoiles et cartes débloquées sont enregistrées dans ce navigateur.",
    "waypoint": "À la carte 30, faites d’abord passer le cadre sur l’élément indiqué avant de terminer le cadrage.",
    "finale": "À la carte 60, après avoir choisi l’épingle, déplacez ou tournez le cadre, ou changez de lentille, pour y faire entrer le rocher ; laissez-le hors de la photo finale."
  },
  "de": {
    "intro": "Entdecke 60 Postkartenrätsel in zwei Kapiteln. Verschiebe den Rahmen so, dass die gefragten Motive darin liegen und unerwünschte draußen bleiben.",
    "first": "Manche Karten verlangen eine bestimmte Position für ein Motiv. Beantworte auf Karte 5, 10, 15 und 20 die Bildaufbaufrage, um den Kontrollpunkt abzuschließen.",
    "memory": "Ab Karte 31 machst du zwei Bilder derselben Szene. Rahme zunächst die ersten beiden Motive ein, wähle nach Anleitung eine Erinnerungsnadel und nimm sie zusammen mit den zwei neuen Motiven ins zweite Bild auf. Beachte auch Positions- und Ausschlussregeln. Auf Karten 31–34 müssen die zwei neuen Motive außerhalb des ersten Bildes bleiben. Die Nadelwahl kannst du rückgängig machen oder zurücksetzen.",
    "lens": "Ab Karte 36 darfst du pro Versuch höchstens einmal zwischen 2×2- und 3×2-Rahmen wechseln; den rechteckigen Rahmen kannst du auch drehen. Verschieben, Drehen und Linsenwechsel kosten je einen Zug; Fotografieren und Nadelwahl kosten keinen Zug.",
    "tips": "Der Hinweis hilft beim Finden eines kürzesten gültigen Wegs und kann die Sterne beeinflussen. Wenn Speicher verfügbar ist, bleiben Beststerne und freigeschaltete Karten in diesem Browser erhalten.",
    "waypoint": "Führe auf Karte 30 den Rahmen zuerst über das angegebene Motiv, bevor du den endgültigen Ausschnitt abschließt.",
    "finale": "Bewege oder drehe auf Karte 60 nach der Nadelwahl den Rahmen oder wechsle die Linse, sodass der Felsen einmal im Rahmen liegt; auf dem letzten Bild bleibt er draußen."
  },
  "it": {
    "intro": "Esplora 60 rompicapi di cartoline in due capitoli. Sposta la cornice per includere gli elementi richiesti e lasciare fuori quelli indesiderati.",
    "first": "Alcune cartoline richiedono anche una posizione precisa. Nelle cartoline 5, 10, 15 e 20 rispondi alla domanda sulla composizione per superare il punto di controllo.",
    "memory": "Dalla cartolina 31 scatta due foto della stessa scena. Inquadra i primi due elementi, scegli una puntina ricordo seguendo le indicazioni e includi nella seconda foto la puntina e i due nuovi elementi. Rispetta anche gli indizi di posizione ed esclusione. Nelle cartoline 31–34 i due nuovi elementi devono restare fuori dalla prima foto. Puoi annullare la scelta della puntina o ricominciare.",
    "lens": "Dalla cartolina 36 puoi passare tra cornice 2×2 e 3×2 al massimo una volta per tentativo; la cornice rettangolare può anche ruotare. Spostamento, rotazione e cambio lente costano una mossa ciascuno; scatto e scelta della puntina non costano mosse.",
    "tips": "Il suggerimento aiuta a trovare un percorso valido più breve e può influire sulle stelle. Se l’archiviazione è disponibile, le stelle migliori e le cartoline sbloccate restano in questo browser.",
    "waypoint": "Nella cartolina 30 fai prima passare la cornice sull’elemento indicato, poi completa l’inquadratura finale.",
    "finale": "Nella cartolina 60, dopo aver scelto la puntina, sposta o ruota la cornice oppure cambia lente per includere la roccia; nella foto finale lasciala fuori."
  },
  "ru": {
    "intro": "Пройдите 60 задач с открытками в двух главах. Передвигайте рамку, чтобы нужные объекты попали внутрь, а лишние остались снаружи.",
    "first": "В некоторых открытках важно и положение объекта. На уровнях 5, 10, 15 и 20 ответьте на вопрос о композиции, чтобы пройти контрольную точку.",
    "memory": "Начиная с уровня 31 сделайте два снимка одной сцены. На первом разместите два указанных объекта, выберите памятную булавку по подсказке, а на втором снимке сохраните её в кадре вместе с двумя новыми объектами. Учитывайте требования к положению и исключениям. На уровнях 31–34 два новых объекта должны оставаться вне первого кадра. Выбор булавки можно отменить или сбросить.",
    "lens": "С уровня 36 можно не более одного раза за попытку сменить рамку 2×2 на 3×2 или обратно; прямоугольную рамку также можно повернуть. Перемещение, поворот и смена линзы стоят по одному ходу; снимок и выбор булавки ходов не стоят.",
    "tips": "Подсказка помогает найти кратчайший допустимый путь и может уменьшить число звёзд. Если хранилище доступно, лучшие звёзды и открытые уровни сохраняются в этом браузере.",
    "waypoint": "На уровне 30 сначала проведите рамку над указанным объектом, затем завершите итоговый кадр.",
    "finale": "На уровне 60 после выбора булавки переместите или поверните рамку либо смените линзу, чтобы камень попал в кадр; на последнем снимке он должен остаться снаружи."
  },
  "hi": {
    "intro": "दो अध्यायों में 60 पोस्टकार्ड पहेलियाँ खेलें। फ़्रेम खिसकाकर बताए गए दृश्यों को अंदर और अवांछित दृश्यों को बाहर रखें।",
    "first": "कुछ कार्डों में किसी दृश्य की जगह भी तय होती है। कार्ड 5, 10, 15 और 20 के जाँच पड़ाव पर चित्र की बनावट से जुड़ा सवाल हल करें।",
    "memory": "कार्ड 31 से एक ही दृश्य की दो तस्वीरें लें। पहले बताए गए दो दृश्य फ़्रेम में रखें और निर्देश के अनुसार यादगार पिन चुनें। दूसरी तस्वीर में उस पिन और दो नए दृश्यों को साथ रखें; जगह और बाहर रखने के निर्देश भी मानें। कार्ड 31–34 में दोनों नए दृश्य पहली तस्वीर से बाहर होने चाहिए। गलत पिन का चुनाव वापस लिया या रीसेट किया जा सकता है।",
    "lens": "कार्ड 36 से हर प्रयास में 2×2 और 3×2 फ़्रेम के बीच अधिकतम एक बार बदलाव कर सकते हैं; आयताकार फ़्रेम घुमाया भी जा सकता है। खिसकाने, घुमाने और लेंस बदलने पर एक-एक चाल लगती है; तस्वीर और पिन चुनने पर चाल नहीं लगती।",
    "tips": "संकेत सबसे छोटा वैध रास्ता खोजने में मदद करता है और सितारों पर असर डाल सकता है। स्टोरेज उपलब्ध होने पर सबसे अच्छे सितारे और खुले कार्ड इसी ब्राउज़र में सेव होते हैं।",
    "waypoint": "कार्ड 30 में अंतिम तस्वीर से पहले फ़्रेम को बताए गए दृश्य के ऊपर से ले जाएँ।",
    "finale": "कार्ड 60 में पिन चुनने के बाद फ़्रेम खिसकाकर, घुमाकर या लेंस बदलकर चट्टान को एक बार अंदर लाएँ; अंतिम तस्वीर में चट्टान बाहर रखें।"
  },
  "ar": {
    "intro": "اكتشف ٦٠ لغزًا من البطاقات البريدية في فصلين. حرّك الإطار ليضم العناصر المطلوبة ويترك العناصر غير المرغوبة خارجه.",
    "first": "تطلب بعض البطاقات وضع عنصر في موضع محدد. في البطاقات ٥ و١٠ و١٥ و٢٠، أجب عن سؤال التكوين لإتمام نقطة التحقق.",
    "memory": "من البطاقة ٣١ التقط صورتين للمشهد نفسه. ضع العنصرين المطلوبين أولًا داخل الإطار، واختر دبوس الذكرى حسب التعليمات، ثم ضم الدبوس والعنصرين الجديدين في الصورة الثانية. اتبع أيضًا شروط الموضع والاستبعاد. في البطاقات ٣١–٣٤ يجب أن يبقى العنصران الجديدان خارج الصورة الأولى. يمكنك التراجع عن اختيار الدبوس أو إعادة المحاولة.",
    "lens": "من البطاقة ٣٦ يمكنك التبديل بين إطار 2×2 وإطار 3×2 مرة واحدة كحد أقصى في المحاولة؛ ويمكن تدوير الإطار المستطيل أيضًا. كل تحريك أو تدوير أو تغيير للعدسة يكلّف حركة واحدة، أما التقاط الصورة واختيار الدبوس فلا يكلّفان حركة.",
    "tips": "تساعدك التلميحات على إيجاد أقصر مسار صالح وقد تؤثر في النجوم. عند توفر التخزين، تُحفظ أفضل النجوم والبطاقات المفتوحة في هذا المتصفح.",
    "waypoint": "في البطاقة ٣٠، مرّر الإطار أولًا فوق العنصر المحدد قبل إكمال الصورة النهائية.",
    "finale": "في البطاقة ٦٠، بعد اختيار الدبوس، حرّك الإطار أو دوّره أو غيّر العدسة حتى تدخل الصخرة فيه؛ وأبقِ الصخرة خارج الصورة النهائية."
  }
};
  for (const copy of Object.values(locales)) Object.freeze(copy);
  Object.freeze(locales);
  const format = (locale, key, vars = {}) => {
    const value = locales[locale]?.[key];
    if (typeof value !== 'string') throw new Error(`POSTCARD_GUIDE_MISSING:${locale}/${key}`);
    return value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
  };
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const render = (locale, original, officialTitle) => {
    const copy = locales[locale];
    if (!copy || !original || !officialTitle || !Array.isArray(original.sections) || !Array.isArray(original.faq)) throw new Error(`POSTCARD_GUIDE_MISSING:${locale}`);
    const facts = original.page.facts.map(([label, value]) => `<div class="game-info-fact"><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('');
    const tags = original.tags.map(tag => `<span>${escape(tag)}</span>`).join('');
    const oldSections = original.sections.map(([title, text]) => `<div class="game-info-section"><h3>${escape(title)}</h3><p>${escape(text)}</p></div>`).join('');
    const heading = original.sections[0][0];
    const newSections = ['first','waypoint','memory','lens','finale','tips'].map(key => `<p>${escape(copy[key])}</p>`).join('');
    const faq = original.faq.map(([question, answer]) => `<div><dt>${escape(question)}</dt><dd>${escape(answer)}</dd></div>`).join('');
    return `<section id="gameGuide" class="game-page-info" data-wp-game-guide data-wp-guide-complete="true" data-runtime-localize="off" aria-labelledby="postcardGuideTitle"><div class="game-info-hero"><div class="game-info-title"><span class="game-info-kicker">WeightPlay</span><h2 id="postcardGuideTitle" data-wp-game-title data-runtime-localize="off">${escape(officialTitle)}</h2><p data-postcard-guide-old>${escape(original.summary)}</p><p data-postcard-guide-new hidden>${escape(copy.intro)}</p></div><div class="game-info-facts">${facts}</div></div><div class="game-info-tags">${tags}</div><div class="game-info-sections"><div data-postcard-guide-old>${oldSections}</div><div data-postcard-guide-new hidden><div class="game-info-section"><h3>${escape(heading)}</h3>${newSections}</div></div><div class="game-info-section"><h3>${escape(original.page.faq)}</h3><dl>${faq}</dl></div></div></section>`;
  };
  globalThis.PostcardCropStage60Guide = Object.freeze({locales, format, render});
  if (typeof document === 'undefined') return;
  const update = () => {
    const count = document.body?.dataset.postcardStageCount;
    if (count !== '24' && count !== '60') return;
    for (const node of document.querySelectorAll('[data-postcard-guide-old]')) node.hidden = count === '60';
    for (const node of document.querySelectorAll('[data-postcard-guide-new]')) node.hidden = count !== '60';
  };
  document.addEventListener('weightplay:postcard-campaign-ready', update);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', update, {once:true});
  else update();
})();
