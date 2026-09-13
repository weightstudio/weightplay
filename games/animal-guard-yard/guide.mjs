import './talents.js?v=35';
// Authored gameplay guidance, shared by static routes and the live Main screen.
const copy = {
 en: ['Defend the garden','Stop the approaching enemies before they reach your home.','How to play','Choose a guard, then an empty grass tile. Place a guard before sending the wave.','Watch the incoming lanes. Use ranged guards behind blockers and collect energy to reinforce weak lanes.','Between waves, recall and reposition your guards before starting again.','Tactics','Keep energy in reserve. Use Rally on a threatened lane; stone tiles cannot hold guards.'],
 'zh-Hant':['守住庭院','攔截來襲敵人，別讓牠們抵達家園。','怎麼玩','先選守衛，再點空草地。放好守衛後按迎戰。','查看敵人來路，前排阻擋、後排遠攻，收集能量補強薄弱路線。','每波結束後，撤回並調整守衛，再開始下一波。','布防技巧','保留能量應急；危急時對一路使用集結。石塊格不能放守衛。'],
 'zh-Hans':['守住庭院','拦截来袭敌人，别让它们抵达家园。','怎么玩','先选守卫，再点空草地。放好守卫后按迎战。','查看敌人来路，前排阻挡、后排远攻，收集能量补强薄弱路线。','每波结束后，撤回并调整守卫，再开始下一波。','布防技巧','保留能量应急；危急时对一路使用集结。石块格不能放守卫。'],
 ja:['庭を守ろう','敵が家に着く前に食い止めよう。','遊び方','守衛を選び、空いた草地に配置してから迎撃を開始。','敵の進路を確認。盾役を前、遠距離役を後ろに置き、エネルギーを集めて弱い列を補強。','ウェーブの合間に守衛を撤退・再配置して次へ。','作戦のヒント','緊急用のエネルギーを残し、危険な列で号令を使用。岩には配置できません。'],
 ko:['정원을 지키세요','적이 집에 도착하기 전에 막으세요.','게임 방법','수호자를 고르고 빈 잔디 칸에 배치한 뒤 웨이브를 시작하세요.','적의 진입 경로를 보세요. 앞에는 방어형, 뒤에는 원거리 수호자를 두고 에너지로 약한 경로를 보강하세요.','웨이브 사이에 수호자를 회수하고 재배치한 뒤 다음 웨이브를 시작하세요.','방어 요령','비상 에너지를 남기고 위험한 경로에 집결을 사용하세요. 바위에는 배치할 수 없습니다.'],
 es:['Defiende el jardín','Detén a los enemigos antes de que lleguen a casa.','Cómo jugar','Elige un guardián y una casilla de césped libre. Despliega uno antes de enviar la oleada.','Observa las filas atacadas. Pon bloqueadores delante y atacantes a distancia detrás; recoge energía para reforzar la defensa.','Entre oleadas, retira y recoloca guardianes antes de continuar.','Tácticas','Reserva energía y usa Reagrupar en una fila amenazada. No puedes desplegar sobre rocas.'],
 'pt-BR':['Defenda o jardim','Impeça que os inimigos cheguem à casa.','Como jogar','Escolha um guarda e uma casa de grama vazia. Posicione um antes de iniciar a onda.','Observe as faixas atacadas. Coloque bloqueadores na frente e atiradores atrás; colete energia para reforçar a defesa.','Entre ondas, recolha e reposicione guardas antes de continuar.','Táticas','Guarde energia e use Reagrupar em uma faixa ameaçada. Pedras impedem o posicionamento.'],
 fr:['Défendez le jardin','Arrêtez les ennemis avant qu’ils atteignent la maison.','Comment jouer','Choisissez un gardien et une case d’herbe libre. Placez-en un avant de lancer la vague.','Repérez les lignes attaquées. Placez les bloqueurs devant et les tireurs derrière ; collectez de l’énergie pour renforcer la défense.','Entre les vagues, retirez et replacez les gardiens avant de continuer.','Tactiques','Gardez de l’énergie et utilisez Ralliement sur une ligne menacée. Les rochers interdisent le placement.'],
 de:['Verteidige den Garten','Halte die Gegner auf, bevor sie das Haus erreichen.','So spielst du','Wähle einen Wächter und ein freies Grasfeld. Stelle einen auf, bevor du die Welle startest.','Achte auf angegriffene Reihen. Blocker nach vorne, Fernkämpfer dahinter; sammle Energie für Verstärkung.','Rufe zwischen den Wellen Wächter zurück und stelle sie neu auf.','Taktik','Halte Energie bereit und nutze Sammeln in einer bedrohten Reihe. Auf Felsen können keine Wächter stehen.'],
 it:['Difendi il giardino','Ferma i nemici prima che raggiungano la casa.','Come giocare','Scegli una guardia e una casella erbosa libera. Schierane una prima di avviare l’ondata.','Osserva le corsie attaccate. Metti i difensori davanti e i tiratori dietro; raccogli energia per rinforzare la difesa.','Tra le ondate, ritira e riposiziona le guardie prima di continuare.','Tattiche','Conserva energia e usa Raduno su una corsia minacciata. Non puoi schierare sulle rocce.'],
 ru:['Защитите сад','Остановите врагов, пока они не добрались до дома.','Как играть','Выберите стража и свободную травяную клетку. Поставьте стража перед началом волны.','Следите за рядами атаки. Ставьте защитников впереди, стрелков позади; собирайте энергию для подкрепления.','Между волнами отзывайте и переставляйте стражей, затем продолжайте.','Тактика','Сохраняйте запас энергии и применяйте «Сбор» в опасном ряду. На камнях размещать нельзя.'],
 hi:['बगीचे की रक्षा करें','शत्रुओं को घर पहुँचने से पहले रोकें।','कैसे खेलें','रक्षक चुनें और खाली घास के खाने पर रखें। लहर शुरू करने से पहले एक रक्षक तैनात करें।','हमले की पंक्तियाँ देखें। आगे अवरोधक और पीछे दूर से वार करने वाले रखें; ऊर्जा लेकर कमजोर पंक्तियाँ मजबूत करें।','लहरों के बीच रक्षकों को वापस बुलाकर नई जगह रखें, फिर अगली लहर शुरू करें।','रणनीति','आपातकाल के लिए ऊर्जा बचाएँ और खतरे वाली पंक्ति में एकजुट का उपयोग करें। पत्थर पर रक्षक नहीं रख सकते।'],
 ar:['احمِ الحديقة','أوقف الأعداء قبل وصولهم إلى المنزل.','طريقة اللعب','اختر حارساً ثم خانة عشب فارغة. ضع حارساً قبل بدء الموجة.','راقب مسارات الهجوم. ضع المدافعين في الأمام والرماة خلفهم، واجمع الطاقة لتعزيز المسارات الضعيفة.','بين الموجات، استدعِ الحراس وأعد توزيعهم قبل المتابعة.','نصائح دفاعية','احتفظ بالطاقة للطوارئ واستخدم التجمّع في المسار المهدد. لا يمكن وضع الحراس على الصخور.']
};
const faq = {
 en: [['Is progress saved?', 'Stage unlocks, clears, scores, medals, coins, and training are saved in this browser.']],
 'zh-Hant': [['進度會保存嗎？', '關卡解鎖、通關、分數、勳章、金幣與訓練會保存在這個瀏覽器中。']],
 'zh-Hans': [['进度会保存吗？', '关卡解锁、通关、分数、勋章、金币与训练会保存在此浏览器中。']],
 ja: [['進行状況は保存されますか？', 'ステージの解放、クリア、スコア、メダル、コイン、トレーニングはこのブラウザに保存されます。']],
 ko: [['진행 상황이 저장되나요?', '스테이지 잠금 해제, 클리어, 점수, 메달, 코인과 훈련은 이 브라우저에 저장됩니다.']],
 es: [['¿Se guarda el progreso?', 'Los niveles desbloqueados, las victorias, las puntuaciones, las medallas, las monedas y el entrenamiento se guardan en este navegador.']],
 'pt-BR': [['O progresso é salvo?', 'Desbloqueios de fases, vitórias, pontuações, medalhas, moedas e treinamento ficam salvos neste navegador.']],
 fr: [['La progression est-elle sauvegardée ?', 'Les niveaux débloqués, les victoires, les scores, les médailles, les pièces et l’entraînement sont enregistrés dans ce navigateur.']],
 de: [['Wird der Fortschritt gespeichert?', 'Freigeschaltete Stufen, Abschlüsse, Punkte, Medaillen, Münzen und Training werden in diesem Browser gespeichert.']],
 it: [['I progressi vengono salvati?', 'Sblocchi, completamenti, punteggi, medaglie, monete e allenamento vengono salvati in questo browser.']],
 ru: [['Сохраняется ли прогресс?', 'Открытые этапы, прохождения, очки, медали, монеты и тренировки сохраняются в этом браузере.']],
 hi: [['क्या प्रगति सहेजी जाती है?', 'स्टेज अनलॉक, क्लियर, स्कोर, पदक, सिक्के और प्रशिक्षण इसी ब्राउज़र में सहेजे जाते हैं।']],
 ar: [
  ['كم عدد المراحل المضمنة؟', 'تتضمن اللعبة ثلاثين مرحلة مسمّاة عبر ست مناطق، مع زعيم مختلف ميكانيكيًا كل خمس مراحل.'],
  ['لماذا تعرضت سلحفاة الصدفة المنشورية لأضرار قليلة؟', 'تقلل حاجزها اللامع الضرر أثناء انغلاقه؛ هاجم بقوة بعد أن ينفتح.'],
  ['هل تستطيع الكائنات الحفّارة تغيير الممرات؟', 'نعم. تطلق تحذيرًا واضحًا قبل انتقالها إلى ممر مجاور.'],
  ['ماذا يفعل سارق الشمس؟', 'يسرق 12 وحدة من الشمس غير المستخدمة مرة واحدة، لكنه لا يزيل أي حارس موضوع مسبقًا.'],
  ['هل يمكن للاعبين ترقية الحيوانات؟', 'نعم. تدرّب العملات المحلية الحراس، أما الثعلب فهو فتح اختياري بالماس المشترك وليس ضروريًا.'],
  ['هل يُحفظ التقدم؟', 'تُحفظ المراحل المفتوحة وعمليات الإكمال والنتائج والميداليات والعملات والتدريب في هذا المتصفح.'],
  ['هل تعمل اللعبة على الهواتف؟', 'نعم. يستخدم اختيار المرحلة السحب الأفقي، وتستخدم المعركة مناطق نقر كبيرة.'],
 ],
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function guardYardGuide(locale) {
 const row=copy[locale];
 if (!row) throw new Error(`Missing Guard Yard guide locale: ${locale}`);
 const [title,summary,how,a,,c,tactics,tip]=row;
 const talent = key => globalThis.GuardYardTalents.text(locale,key);
 const b=talent('income');
 const entries = faq[locale] || faq.en;
 const faqSection = `<div class="game-info-section"><h3>${escape(locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ')}</h3><dl>${entries.map(([question, answer]) => `<div><dt>${escape(question)}</dt><dd>${escape(answer)}</dd></div>`).join('')}</dl></div>`;
 return `<section id="guardYardGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-runtime-localize="off"><h2>${escape(title)}</h2><p>${escape(summary)}</p><div class="game-info-sections"><div class="game-info-section"><h3>${escape(how)}</h3><ol>${[a,b,c].map(s=>`<li>${escape(s)}</li>`).join('')}</ol></div><div class="game-info-section"><h3>${escape(tactics)}</h3><p>${escape(tip)}</p></div><div class="game-info-section"><h3>${escape(talent("talents"))}</h3><p>${escape(talent("hint"))}</p></div>${faqSection}</div></section>`;
}
