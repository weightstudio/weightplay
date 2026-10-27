// Draft chapter copy; requires native-speaker and child/accessibility review.
export const LATCH_COPY={
 en:['Paired landing','Remove the key-marked support before its paired lock.','Remove the key support first.','Key support','Locked support'],
 'zh-Hant':['成對支撐','先移除鑰匙標記的支撐，再移除配對的鎖。','請先移除鑰匙支撐。','鑰匙支撐','鎖定支撐'],
 'zh-Hans':['成对支撑','先移除钥匙标记的支撑，再移除配对的锁。','请先移除钥匙支撑。','钥匙支撑','锁定支撑'],
 ja:['対の足場','鍵の印の足場を先に消すと、対の錠を消せます。','先に鍵の足場を消しましょう。','鍵の足場','錠の足場'],
 ko:['짝이 된 발판','열쇠 표시 발판을 먼저 없애야 짝인 잠금을 없앨 수 있어요.','열쇠 발판을 먼저 없애세요.','열쇠 발판','잠긴 발판'],
 es:['Apoyos emparejados','Quita primero el apoyo con la llave y luego su cerradura.','Quita primero el apoyo de la llave.','Apoyo de llave','Apoyo bloqueado'],
 'pt-BR':['Apoios pareados','Remova primeiro o apoio com a chave e depois a trava correspondente.','Remova primeiro o apoio da chave.','Apoio da chave','Apoio bloqueado'],
 fr:['Supports liés','Retirez le support marqué de la clé avant son verrou associé.','Retirez d’abord le support de la clé.','Support de clé','Support verrouillé'],
 de:['Gekoppelte Stützen','Entferne erst die Schlüsselstütze, dann die zugehörige Sperre.','Entferne zuerst die Schlüsselstütze.','Schlüsselstütze','Gesperrte Stütze'],
 it:['Supporti abbinati','Rimuovi prima il supporto con la chiave, poi il blocco abbinato.','Rimuovi prima il supporto della chiave.','Supporto chiave','Supporto bloccato'],
 ru:['Парные опоры','Сначала уберите опору с ключом, затем связанную с ней запертую опору.','Сначала уберите опору с ключом.','Опора с ключом','Запертая опора'],
 hi:['जुड़े सहारे','पहले चाबी वाला सहारा हटाएँ, फिर उससे जुड़ा ताला हटाएँ।','पहले चाबी वाला सहारा हटाएँ।','चाबी वाला सहारा','बंद सहारा'],
 ar:['دعامتان متصلتان','أزل دعامة المفتاح أولاً، ثم أزل القفل المرتبط بها.','أزل دعامة المفتاح أولاً.','دعامة المفتاح','دعامة مقفلة']
};
const UNLOCKED={en:'Unlocked support','zh-Hant':'已解鎖支撐','zh-Hans':'已解锁支撑',ja:'解錠された足場',ko:'잠금이 풀린 발판',es:'Apoyo desbloqueado','pt-BR':'Apoio desbloqueado',fr:'Support déverrouillé',de:'Entsperrte Stütze',it:'Supporto sbloccato',ru:'Открытая опора',hi:'खुला सहारा',ar:'دعامة مفتوحة'};
for(const [locale,value] of Object.entries(UNLOCKED))LATCH_COPY[locale].push(value);
export const LATCH_NAMES={
 en:['Paired landing','Two rival guards'],'zh-Hant':['成對支撐','兩名守衛'],'zh-Hans':['成对支撑','两名守卫'],ja:['対の足場','二人の守り手'],ko:['짝이 된 발판','두 수호병'],es:['Apoyos emparejados','Dos guardianes'],
 'pt-BR':['Apoios pareados','Dois guardas'],fr:['Supports liés','Deux gardes'],de:['Gekoppelte Stützen','Zwei Wachen'],it:['Supporti abbinati','Due guardie'],ru:['Парные опоры','Два стража'],hi:['जुड़े सहारे','दो पहरेदार'],ar:['دعامتان متصلتان','الحارسان']
};
const THIRD_NAMES={en:'Rune behind the latch','zh-Hant':'閂後的符文','zh-Hans':'闩后的符文',ja:'閂の先のルーン',ko:'빗장 뒤의 룬',es:'Runa tras el pestillo','pt-BR':'Runa atrás da trava',fr:'Rune derrière le verrou',de:'Rune hinter der Sperre',it:'Runa oltre il blocco',ru:'Руна за засовом',hi:'कुंडी के पार रून',ar:'الرون خلف المزلاج'};
for(const [locale,value] of Object.entries(THIRD_NAMES))LATCH_NAMES[locale].push(value);
const FOURTH_NAMES={en:'Two marked pairs','zh-Hant':'兩組記號','zh-Hans':'两组记号',ja:'二組の印',ko:'두 쌍의 표시',es:'Dos pares marcados','pt-BR':'Dois pares marcados',fr:'Deux paires marquées',de:'Zwei markierte Paare',it:'Due coppie segnate',ru:'Две отмеченные пары',hi:'दो चिह्नित जोड़े',ar:'زوجان بعلامات'};
for(const [locale,value] of Object.entries(FOURTH_NAMES))LATCH_NAMES[locale].push(value);
export const LATCH_FIND_KEY={
 en:'Drag the map or use arrows to find the key. Remove the key before the lock.',
 'zh-Hant':'拖曳地圖或用箭頭找鑰匙，先移除鑰匙再移除鎖。','zh-Hans':'拖动地图或用箭头找钥匙，先移除钥匙再移除锁。',
 ja:'地図をドラッグするか矢印で鍵を探し、鍵から消しましょう。',ko:'지도를 끌거나 화살표로 열쇠를 찾아 열쇠부터 없애세요.',
 es:'Arrastra el mapa o usa las flechas para buscar la llave. Quítala antes del candado.',
 'pt-BR':'Arraste o mapa ou use as setas para achar a chave. Remova-a antes da trava.',
 fr:'Faites glisser la carte ou utilisez les flèches pour trouver la clé. Retirez-la avant le verrou.',
 de:'Ziehe die Karte oder nutze Pfeile für den Schlüssel. Entferne ihn vor dem Schloss.',
 it:'Trascina la mappa o usa le frecce per trovare la chiave. Toglila prima del blocco.',
 ru:'Перетащите карту или используйте стрелки, чтобы найти ключ. Уберите его до замка.',
 hi:'चाबी खोजने के लिए नक्शा खींचें या तीर दबाएँ। ताले से पहले चाबी हटाएँ।',
 ar:'اسحب الخريطة أو استخدم الأسهم لإيجاد المفتاح. أزل المفتاح قبل القفل.'
};
export const LATCH_RUNE_RULE={
 en:'Drag or use arrows to find the key. Remove it before the lock; collect the rune for the shield.',
 'zh-Hant':'拖曳或用箭頭找鑰匙，先移除鑰匙再移除鎖；收集符文解除護盾。','zh-Hans':'拖动或用箭头找钥匙，先移除钥匙再移除锁；收集符文解除护盾。',
 ja:'ドラッグか矢印で鍵を探して錠より先に消し、ルーンで盾を解除します。',ko:'끌거나 화살표로 열쇠를 찾아 잠금보다 먼저 없애고 룬으로 방패를 푸세요.',
 es:'Arrastra o usa las flechas para hallar la llave. Quítala antes del candado y recoge la runa para el escudo.',
 'pt-BR':'Arraste ou use as setas para achar a chave. Remova-a antes da trava e pegue a runa para o escudo.',
 fr:'Glissez ou utilisez les flèches pour trouver la clé. Retirez-la avant le verrou et prenez la rune pour le bouclier.',
 de:'Suche den Schlüssel durch Ziehen oder Pfeile. Entferne ihn vor der Sperre und hole die Rune für den Schild.',
 it:'Trascina o usa le frecce per trovare la chiave. Toglila prima del blocco e raccogli la runa per lo scudo.',
 ru:'Перетащите карту или используйте стрелки, чтобы найти ключ. Уберите его до замка и возьмите руну от щита.',
 hi:'चाबी खोजने के लिए खींचें या तीर दबाएँ। ताले से पहले चाबी हटाएँ और ढाल के लिए रून लें।',
 ar:'اسحب أو استخدم الأسهم لإيجاد المفتاح. أزله قبل القفل واجمع الرون لإزالة الدرع.'
};
export const LATCH_PAIR_RULE={
 en:'Use arrows to find keys. Match dots: remove each key before its lock. The rune breaks the shield.',
 'zh-Hant':'用箭頭找鑰匙；點數相同的先移鑰匙再移鎖。收集符文破盾。','zh-Hans':'用箭头找钥匙；点数相同的先移钥匙再移锁。收集符文破盾。',
 ja:'矢印で鍵を探し、同じ点の鍵と錠を対応させ、ルーンで盾を解除。',ko:'화살표로 열쇠를 찾고 점이 같은 열쇠와 잠금을 짝지은 뒤 룬으로 방패를 푸세요.',
 es:'Busca las llaves con las flechas. Empareja los puntos de llave y candado; recoge la runa para el escudo.',
 'pt-BR':'Use as setas para achar as chaves. Combine os pontos de cada chave e trava; pegue a runa para o escudo.',
 fr:'Cherchez les clés avec les flèches. Associez les points des clés et verrous ; prenez la rune pour le bouclier.',
 de:'Suche Schlüssel mit den Pfeilen. Gleiche Punkte verbinden Schlüssel und Sperre; hole die Rune für den Schild.',
 it:'Cerca le chiavi con le frecce. Abbina i punti di chiave e blocco; prendi la runa per lo scudo.',
 ru:'Найдите ключи стрелками. Сопоставьте точки на ключах и замках; возьмите руну от щита.',
 hi:'तीरों से चाबियाँ खोजें। समान बिंदुओं वाली चाबी और ताला मिलाएँ; ढाल के लिए रून लें।',
 ar:'استخدم الأسهم للعثور على المفاتيح. طابق النقاط وأزل كل مفتاح قبل قفله، واجمع الرون للدرع.'
};
