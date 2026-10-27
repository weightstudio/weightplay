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
const FIFTH_NAMES={en:'The returning guardian','zh-Hant':'再臨的守衛','zh-Hans':'再临的守卫',ja:'再び現れる守護者',ko:'다시 돌아온 수호자',es:'El guardián que regresa','pt-BR':'O guardião que retorna',fr:'Le gardien de retour',de:'Der zurückkehrende Wächter',it:'Il guardiano che ritorna',ru:'Возвращение стража',hi:'लौटता रक्षक',ar:'الحارس العائد'};
for(const [locale,value] of Object.entries(FIFTH_NAMES))LATCH_NAMES[locale].push(value);
const SIXTH_NAMES={en:'The timed multiplier','zh-Hant':'倍率時機','zh-Hans':'倍率时机',ja:'倍率のタイミング',ko:'배율 타이밍',es:'El multiplicador oportuno','pt-BR':'O multiplicador na hora certa',fr:'Le bon moment pour multiplier',de:'Der richtige Zeitpunkt',it:'Il momento del moltiplicatore',ru:'Время умножать',hi:'गुणा का सही समय',ar:'وقت المضاعفة'};
for(const [locale,value] of Object.entries(SIXTH_NAMES))LATCH_NAMES[locale].push(value);
const SEVENTH_NAMES={en:'Two paths to multiplication','zh-Hant':'雙路倍率','zh-Hans':'双路倍率',ja:'倍率への二つの道',ko:'배율로 가는 두 길',es:'Dos caminos al multiplicador','pt-BR':'Dois caminhos ao multiplicador',fr:'Deux chemins vers le multiplicateur',de:'Zwei Wege zum Multiplikator',it:'Due vie al moltiplicatore',ru:'Два пути к множителю',hi:'गुणक के दो रास्ते',ar:'طريقان إلى المضاعِف'};
for(const [locale,value] of Object.entries(SEVENTH_NAMES))LATCH_NAMES[locale].push(value);
const EIGHTH_NAMES={en:'The shielded multiplier','zh-Hant':'護盾與倍率','zh-Hans':'护盾与倍率',ja:'盾と倍率',ko:'방패와 배율',es:'El multiplicador protegido','pt-BR':'O multiplicador protegido',fr:'Le multiplicateur protégé',de:'Der geschützte Multiplikator',it:'Il moltiplicatore protetto',ru:'Множитель и щит',hi:'ढाल और गुणक',ar:'المضاعِف والدرع'};
for(const [locale,value] of Object.entries(EIGHTH_NAMES))LATCH_NAMES[locale].push(value);
const NINTH_NAMES={en:'Two locks and the shield','zh-Hant':'雙鎖與護盾','zh-Hans':'双锁与护盾',ja:'二つの錠と盾',ko:'두 잠금과 방패',es:'Dos candados y el escudo','pt-BR':'Duas travas e o escudo',fr:'Deux verrous et le bouclier',de:'Zwei Sperren und der Schild',it:'Due blocchi e lo scudo',ru:'Два замка и щит',hi:'दो ताले और ढाल',ar:'قفلان ودرع'};
for(const [locale,value] of Object.entries(NINTH_NAMES))LATCH_NAMES[locale].push(value);
const TENTH_NAMES={en:'The shielded return','zh-Hant':'護盾守衛再臨','zh-Hans':'护盾守卫再临',ja:'盾の守護者、再び',ko:'다시 돌아온 방패 수호자',es:'El regreso del guardián','pt-BR':'O retorno do guardião',fr:'Le retour du gardien',de:'Die Rückkehr des Wächters',it:'Il ritorno del guardiano',ru:'Возвращение защитника',hi:'ढाल वाले रक्षक की वापसी',ar:'عودة الحارس المدرع'};
for(const [locale,value] of Object.entries(TENTH_NAMES))LATCH_NAMES[locale].push(value);
const ELEVENTH_NAMES={en:'The ordered seals','zh-Hant':'印記的順序','zh-Hans':'印记的顺序',ja:'印の順番',ko:'순서가 있는 인장',es:'El orden de los sellos','pt-BR':'A ordem dos selos',fr:'L’ordre des sceaux',de:'Die Reihenfolge der Siegel',it:'L’ordine dei sigilli',ru:'Порядок печатей',hi:'मुहरों का क्रम',ar:'ترتيب الأختام'};
for(const [locale,value] of Object.entries(ELEVENTH_NAMES))LATCH_NAMES[locale].push(value);
const TWELFTH_NAMES={en:'Pairs and ordered seals','zh-Hant':'配對與印記順序','zh-Hans':'配对与印记顺序',ja:'対の鍵と印の順番',ko:'짝과 인장 순서',es:'Pares y orden de sellos','pt-BR':'Pares e ordem dos selos',fr:'Paires et ordre des sceaux',de:'Paare und Siegelreihenfolge',it:'Coppie e ordine dei sigilli',ru:'Пары и порядок печатей',hi:'जोड़े और मुहरों का क्रम',ar:'الأزواج وترتيب الأختام'};
for(const [locale,value] of Object.entries(TWELFTH_NAMES))LATCH_NAMES[locale].push(value);
const THIRTEENTH_NAMES={en:'The shielded seals','zh-Hant':'護盾印記','zh-Hans':'护盾印记',ja:'盾と印',ko:'방패와 인장',es:'Los sellos protegidos','pt-BR':'Os selos protegidos',fr:'Les sceaux protégés',de:'Die geschützten Siegel',it:'I sigilli protetti',ru:'Печати и щит',hi:'ढाल वाली मुहरें',ar:'الأختام والدرع'};
for(const [locale,value] of Object.entries(THIRTEENTH_NAMES))LATCH_NAMES[locale].push(value);
const FOURTEENTH_NAMES={en:'Pairs, seals and shield','zh-Hant':'配對、印記與護盾','zh-Hans':'配对、印记与护盾',ja:'対の鍵、印と盾',ko:'열쇠 쌍, 인장과 방패',es:'Pares, sellos y escudo','pt-BR':'Pares, selos e escudo',fr:'Paires, sceaux et bouclier',de:'Paare, Siegel und Schild',it:'Coppie, sigilli e scudo',ru:'Пары, печати и щит',hi:'जोड़े, मुहरें और ढाल',ar:'الأزواج والأختام والدرع'};
for(const [locale,value] of Object.entries(FOURTEENTH_NAMES))LATCH_NAMES[locale].push(value);
const FIFTEENTH_NAMES={en:'The two-rune guardian','zh-Hant':'雙符文守衛','zh-Hans':'双符文守卫',ja:'二つのルーンの守護者',ko:'두 룬의 수호자',es:'El guardián de dos runas','pt-BR':'O guardião das duas runas',fr:'Le gardien aux deux runes',de:'Der Wächter der zwei Runen',it:'Il guardiano delle due rune',ru:'Страж двух рун',hi:'दो रून वाला रक्षक',ar:'حارس الرونين'};
for(const [locale,value] of Object.entries(FIFTEENTH_NAMES))LATCH_NAMES[locale].push(value);
const SIXTEENTH_NAMES={en:'Three seals in order','zh-Hant':'三枚印記的順序','zh-Hans':'三枚印记的顺序',ja:'三つの印の順番',ko:'세 인장의 순서',es:'Tres sellos en orden','pt-BR':'Três selos em ordem',fr:'Trois sceaux en ordre',de:'Drei Siegel in Reihenfolge',it:'Tre sigilli in ordine',ru:'Три печати по порядку',hi:'तीन मुहरों का क्रम',ar:'ترتيب الأختام الثلاثة'};
for(const [locale,value] of Object.entries(SIXTEENTH_NAMES))LATCH_NAMES[locale].push(value);
const SEVENTEENTH_NAMES={en:'Three seals, two pairs','zh-Hant':'三印記、兩組配對','zh-Hans':'三印记、两组配对',ja:'三つの印と二組の鍵',ko:'세 인장과 두 쌍',es:'Tres sellos, dos pares','pt-BR':'Três selos, dois pares',fr:'Trois sceaux, deux paires',de:'Drei Siegel, zwei Paare',it:'Tre sigilli, due coppie',ru:'Три печати, две пары',hi:'तीन मुहरें, दो जोड़े',ar:'ثلاثة أختام وزوجان'};
for(const [locale,value] of Object.entries(SEVENTEENTH_NAMES))LATCH_NAMES[locale].push(value);
export const LATCH_DUAL_THREE_SEALS_RULE={
 en:'Match numbered keys and locks. Collect seals 1, 2 and 3 in order; use arrows to find items.',
 'zh-Hant':'依編號配對鑰匙與鎖，印記依序收集1、2、3；用箭頭找物件。','zh-Hans':'按编号配对钥匙与锁，印记依序收集1、2、3；用箭头找物件。',
 ja:'同番号の鍵と錠を合わせ、印を1、2、3の順に取る。矢印で探そう。',ko:'같은 번호의 열쇠와 잠금을 맞추고 인장 1, 2, 3을 차례로 모으세요. 화살표로 찾으세요.',
 es:'Empareja llaves y candados. Recoge los sellos 1, 2 y 3 en orden; usa las flechas para buscar.',
 'pt-BR':'Combine chaves e travas. Pegue os selos 1, 2 e 3 em ordem; use as setas para procurar.',
 fr:'Associez clés et verrous. Prenez les sceaux 1, 2 puis 3 ; cherchez avec les flèches.',
 de:'Ordne Schlüssel und Sperren zu. Sammle Siegel 1, 2 und 3 in Reihenfolge; suche mit Pfeilen.',
 it:'Abbina chiavi e blocchi. Raccogli i sigilli 1, 2 e 3 in ordine; cerca con le frecce.',
 ru:'Сопоставьте ключи и замки. Соберите печати 1, 2 и 3 по порядку; ищите стрелками.',
 hi:'समान चाबी और ताला मिलाएँ। मुहरें 1, 2, 3 क्रम से लें; तीरों से खोजें।',
 ar:'طابق المفاتيح والأقفال المرقمة. اجمع الأختام 1 و2 و3 بالترتيب واستخدم الأسهم للبحث.'
};
export const LATCH_THREE_SEALS_RULE={
 en:'Use arrows to find items. Remove the key before the lock; collect seals 1, 2 and 3 in order.',
 'zh-Hant':'用箭頭找物件，先移鑰匙再移鎖，印記依序收集1、2、3。','zh-Hans':'用箭头找物件，先移钥匙再移锁，印记依序收集1、2、3。',
 ja:'矢印で探そう。鍵を錠より先に消し、印を1、2、3の順に取る。',ko:'화살표로 찾으세요. 열쇠를 잠금보다 먼저 없애고 인장 1, 2, 3을 차례로 모으세요.',
 es:'Busca con las flechas. Quita la llave antes del candado y recoge los sellos 1, 2 y 3 en orden.',
 'pt-BR':'Use as setas. Remova a chave antes da trava e pegue os selos 1, 2 e 3 em ordem.',
 fr:'Cherchez avec les flèches. Retirez la clé avant le verrou et prenez les sceaux 1, 2 puis 3.',
 de:'Suche mit Pfeilen. Entferne den Schlüssel vor der Sperre und sammle Siegel 1, 2 und 3 in Reihenfolge.',
 it:'Cerca con le frecce. Togli la chiave prima del blocco e raccogli i sigilli 1, 2 e 3 in ordine.',
 ru:'Ищите стрелками. Уберите ключ до замка и соберите печати 1, 2 и 3 по порядку.',
 hi:'तीरों से खोजें। ताले से पहले चाबी हटाएँ और मुहरें 1, 2, 3 क्रम से लें।',
 ar:'ابحث بالأسهم. أزل المفتاح قبل القفل واجمع الأختام 1 و2 و3 بالترتيب.'
};
export const LATCH_TWO_RUNES_RULE={
 en:'Match keys; seals 1 then 2. Use ☀ for the first shield and ☾ for the second.',
 'zh-Hant':'配對鑰匙，印記先1後2；第一盾用☀符文，第二盾用☾符文。','zh-Hans':'配对钥匙，印记先1后2；第一盾用☀符文，第二盾用☾符文。',
 ja:'鍵を合わせ、印は1から2。最初の盾に☀、次の盾に☾のルーン。',ko:'열쇠를 맞추고 인장은 1, 2 순서. 첫 방패에는 ☀ 룬, 두 번째에는 ☾ 룬을 쓰세요.',
 es:'Empareja llaves; sello 1 antes del 2. Usa ☀ para el primer escudo y ☾ para el segundo.',
 'pt-BR':'Combine chaves; selo 1 antes do 2. Use ☀ no primeiro escudo e ☾ no segundo.',
 fr:'Associez les clés ; sceau 1 puis 2. Utilisez ☀ pour le premier bouclier et ☾ pour le second.',
 de:'Ordne Schlüssel zu; Siegel 1 vor 2. Nutze ☀ für den ersten Schild und ☾ für den zweiten.',
 it:'Abbina le chiavi; sigillo 1 poi 2. Usa ☀ per il primo scudo e ☾ per il secondo.',
 ru:'Сопоставьте ключи; печать 1 до 2. ☀ для первого щита, ☾ для второго.',
 hi:'चाबियाँ मिलाएँ; मुहर 1 फिर 2। पहली ढाल के लिए ☀ और दूसरी के लिए ☾ लें।',
 ar:'طابق المفاتيح؛ الختم 1 ثم 2. استخدم ☀ للدرع الأول و☾ للثاني.'
};
export const LATCH_RUNE_ACCESS={
 en:['Sun rune','Moon rune','Sun shield','Moon shield'],
 'zh-Hant':['太陽符文','月亮符文','太陽護盾','月亮護盾'],'zh-Hans':['太阳符文','月亮符文','太阳护盾','月亮护盾'],
 ja:['太陽のルーン','月のルーン','太陽の盾','月の盾'],ko:['태양 룬','달 룬','태양 방패','달 방패'],
 es:['Runa del sol','Runa de la luna','Escudo del sol','Escudo de la luna'],
 'pt-BR':['Runa do sol','Runa da lua','Escudo do sol','Escudo da lua'],fr:['Rune du soleil','Rune de la lune','Bouclier du soleil','Bouclier de la lune'],
 de:['Sonnenrune','Mondrune','Sonnenschild','Mondschild'],it:['Runa del sole','Runa della luna','Scudo del sole','Scudo della luna'],
 ru:['Руна солнца','Руна луны','Щит солнца','Щит луны'],hi:['सूर्य रून','चंद्र रून','सूर्य ढाल','चंद्र ढाल'],ar:['رون الشمس','رون القمر','درع الشمس','درع القمر']
};
export const LATCH_DUAL_SEAL_SHIELD_RULE={
 en:'Match numbered keys and locks; take seal 1 before 2 and the rune for the shield.',
 'zh-Hant':'依編號配對鑰匙與鎖；印記先1後2，符文可破盾。','zh-Hans':'按编号配对钥匙与锁；印记先1后2，符文可破盾。',
 ja:'同番号の鍵と錠を組み合わせ、印は1、2の順。ルーンで盾を解除。',ko:'같은 번호의 열쇠와 잠금을 맞추고 인장 1, 2 순서로 모아 룬으로 방패를 푸세요.',
 es:'Empareja llaves y candados; sello 1 antes del 2 y runa para el escudo.',
 'pt-BR':'Combine chaves e travas; selo 1 antes do 2 e runa para o escudo.',
 fr:'Associez clés et verrous ; sceau 1 avant 2 et rune pour le bouclier.',
 de:'Ordne Schlüssel den Sperren zu; Siegel 1 vor 2 und Rune für den Schild.',
 it:'Abbina chiavi e blocchi; sigillo 1 prima del 2 e runa per lo scudo.',
 ru:'Сопоставьте ключи и замки; печать 1 до 2 и руна против щита.',
 hi:'समान चाबी और ताला मिलाएँ; मुहर 2 से पहले 1 और ढाल के लिए रून लें।',
 ar:'طابق المفاتيح والأقفال المرقمة؛ الختم 1 قبل 2 والرون للدرع.'
};
export const LATCH_SEAL_SHIELD_RULE={
 en:'Use arrows to find items. Key before lock, seal 1 before 2, and rune for the shield.',
 'zh-Hant':'用箭頭找物件：鑰匙先於鎖，印記依序1、2，符文可破盾。','zh-Hans':'用箭头找物件：钥匙先于锁，印记依序1、2，符文可破盾。',
 ja:'矢印で探そう。鍵は錠より先、印は1、2の順。ルーンで盾を解除。',ko:'화살표로 찾으세요. 열쇠는 잠금보다 먼저, 인장은 1, 2 순서. 룬으로 방패를 푸세요.',
 es:'Busca con las flechas. Llave antes del candado, sello 1 antes del 2 y runa para el escudo.',
 'pt-BR':'Use as setas. Chave antes da trava, selo 1 antes do 2 e runa para o escudo.',
 fr:'Cherchez avec les flèches. Clé avant verrou, sceau 1 avant 2 et rune pour le bouclier.',
 de:'Suche mit Pfeilen. Schlüssel vor Sperre, Siegel 1 vor 2 und Rune für den Schild.',
 it:'Cerca con le frecce. Chiave prima del blocco, sigillo 1 prima del 2 e runa per lo scudo.',
 ru:'Ищите стрелками: ключ до замка, печать 1 до 2 и руна против щита.',
 hi:'तीरों से खोजें। ताले से पहले चाबी, मुहर 2 से पहले 1 और ढाल के लिए रून लें।',
 ar:'ابحث بالأسهم. المفتاح قبل القفل، والختم 1 قبل 2، والرون للدرع.'
};
export const LATCH_DUAL_SEALS_RULE={
 en:'Match numbered keys and locks. Collect seal 1 before seal 2; use arrows to find items.',
 'zh-Hant':'依編號配對鑰匙與鎖，先收印記1再收2；用箭頭找物件。','zh-Hans':'按编号配对钥匙与锁，先收印记1再收2；用箭头找物件。',
 ja:'同番号の鍵と錠を組み合わせ、印を1、2の順に取る。矢印で探そう。',ko:'같은 번호의 열쇠와 잠금을 맞추고 인장 1, 2를 차례로 모으세요. 화살표로 찾으세요.',
 es:'Empareja llaves y candados. Recoge el sello 1 antes del 2; usa las flechas para buscar.',
 'pt-BR':'Combine chaves e travas. Pegue o selo 1 antes do 2; use as setas para procurar.',
 fr:'Associez clés et verrous. Prenez le sceau 1 avant le 2 ; cherchez avec les flèches.',
 de:'Ordne Schlüssel und Sperren zu. Sammle Siegel 1 vor 2; suche mit Pfeilen.',
 it:'Abbina chiavi e blocchi. Raccogli il sigillo 1 prima del 2; cerca con le frecce.',
 ru:'Сопоставьте ключи и замки. Соберите печать 1 до 2; ищите стрелками.',
 hi:'समान चाबी और ताला मिलाएँ। मुहर 2 से पहले 1 लें; तीरों से खोजें।',
 ar:'طابق المفاتيح والأقفال المرقمة. اجمع الختم 1 قبل 2 واستخدم الأسهم للبحث.'
};
export const LATCH_SEALS_RULE={
 en:'Use arrows to find items. Remove the key before its lock and collect seal 1 before seal 2.',
 'zh-Hant':'用箭頭找物件，先移鑰匙再移鎖，並依序收集印記 1、2。','zh-Hans':'用箭头找物件，先移钥匙再移锁，并依序收集印记 1、2。',
 ja:'矢印で探そう。鍵を錠より先に消し、印を1、2の順に取る。',ko:'화살표로 찾으세요. 열쇠를 잠금보다 먼저 없애고 인장 1, 2를 차례로 모으세요.',
 es:'Busca con las flechas. Quita la llave antes del candado y recoge los sellos 1 y 2 en orden.',
 'pt-BR':'Use as setas. Remova a chave antes da trava e pegue os selos 1 e 2 em ordem.',
 fr:'Cherchez avec les flèches. Retirez la clé avant le verrou et prenez les sceaux 1 puis 2.',
 de:'Suche mit Pfeilen. Entferne den Schlüssel vor der Sperre und sammle Siegel 1 vor 2.',
 it:'Cerca con le frecce. Togli la chiave prima del blocco e raccogli i sigilli 1 e 2 in ordine.',
 ru:'Ищите стрелками. Уберите ключ до замка и соберите печати 1 и 2 по порядку.',
 hi:'तीरों से खोजें। ताले से पहले चाबी हटाएँ और मुहरें 1, 2 क्रम से लें।',
 ar:'ابحث بالأسهم. أزل المفتاح قبل القفل واجمع الختم 1 قبل الختم 2.'
};
export const LATCH_DUAL_BOSS_RULE={
 en:'Match numbered keys and locks. Get the rune and supplies for the guardian’s second form.',
 'zh-Hant':'依編號先移鑰匙再移鎖；取得符文與補給，迎戰守衛第二階段。','zh-Hans':'按编号先移钥匙再移锁；取得符文与补给，迎战守卫第二阶段。',
 ja:'同番号の鍵を錠より先に消し、ルーンと補給で守護者の第二形態に挑もう。',ko:'같은 번호의 열쇠를 잠금보다 먼저 없애고 룬과 보급품으로 수호자 2단계를 준비하세요.',
 es:'Empareja llaves y candados. Reúne la runa y los suministros para la segunda forma.',
 'pt-BR':'Combine chaves e travas. Pegue a runa e os suprimentos para a segunda forma.',
 fr:'Associez clés et verrous. Prenez la rune et les réserves pour la seconde forme.',
 de:'Ordne Schlüssel und Sperren zu. Sammle Rune und Vorräte für die zweite Form.',
 it:'Abbina chiavi e blocchi. Raccogli runa e scorte per la seconda forma.',
 ru:'Сопоставьте ключи и замки. Возьмите руну и припасы для второй формы стража.',
 hi:'समान चाबी और ताला मिलाएँ। रक्षक के दूसरे रूप के लिए रून और सामग्री लें।',
 ar:'طابق المفاتيح والأقفال المرقمة. اجمع الرون والإمدادات لمرحلة الحارس الثانية.'
};
export const LATCH_DUAL_SHIELD_RULE={
 en:'Use arrows to find items. Match numbered keys and locks; take the addition before the multiplier and the rune for the shield.',
 'zh-Hant':'用箭頭找物件，依編號先移鑰匙再移鎖；加值先於倍率，符文可破盾。','zh-Hans':'用箭头找物件，按编号先移钥匙再移锁；加值先于倍率，符文可破盾。',
 ja:'矢印で探し、同番号の鍵を錠より先に消す。加算は倍率より先、ルーンで盾を解除。',ko:'화살표로 찾고 같은 번호의 열쇠를 잠금보다 먼저 없애세요. 더한 뒤 배율을 얻고 룬으로 방패를 푸세요.',
 es:'Busca con las flechas. Empareja llaves y candados; toma la suma antes del multiplicador y la runa para el escudo.',
 'pt-BR':'Use as setas. Combine chaves e travas; pegue a adição antes do multiplicador e a runa para o escudo.',
 fr:'Cherchez avec les flèches. Associez clés et verrous ; prenez le bonus avant le multiplicateur et la rune pour le bouclier.',
 de:'Suche mit Pfeilen. Ordne Schlüssel den Sperren zu; hole den Bonus vor dem Multiplikator und die Rune für den Schild.',
 it:'Cerca con le frecce. Abbina chiavi e blocchi; prendi il bonus prima del moltiplicatore e la runa per lo scudo.',
 ru:'Ищите стрелками. Сопоставьте ключи и замки; возьмите прибавку до множителя и руну против щита.',
 hi:'तीरों से खोजें। समान चाबी और ताला मिलाएँ; गुणक से पहले जोड़ और ढाल के लिए रून लें।',
 ar:'ابحث بالأسهم وطابق المفاتيح والأقفال المرقمة؛ اجمع الزيادة قبل المضاعِف والرون للدرع.'
};
export const LATCH_SHIELD_ARITHMETIC_RULE={
 en:'Use arrows to find items. Key before lock, addition before multiplier, rune for the shield.',
 'zh-Hant':'用箭頭找物件：鑰匙先於鎖、加值先於倍率，符文可破盾。','zh-Hans':'用箭头找物件：钥匙先于锁、加值先于倍率，符文可破盾。',
 ja:'矢印で探そう。鍵は錠より先、加算は倍率より先。ルーンで盾を解除。',ko:'화살표로 찾으세요. 열쇠는 잠금보다, 더하기는 배율보다 먼저. 룬으로 방패를 푸세요.',
 es:'Busca con las flechas. Llave antes del candado, suma antes del multiplicador y runa para el escudo.',
 'pt-BR':'Use as setas. Chave antes da trava, adição antes do multiplicador e runa para o escudo.',
 fr:'Cherchez avec les flèches. Clé avant verrou, bonus avant multiplicateur et rune pour le bouclier.',
 de:'Suche mit Pfeilen. Schlüssel vor Sperre, Bonus vor Multiplikator, Rune für den Schild.',
 it:'Cerca con le frecce. Chiave prima del blocco, bonus prima del moltiplicatore e runa per lo scudo.',
 ru:'Ищите стрелками: ключ до замка, прибавка до множителя, руна против щита.',
 hi:'तीरों से खोजें। ताले से पहले चाबी, गुणक से पहले जोड़ और ढाल के लिए रून लें।',
 ar:'ابحث بالأسهم. المفتاح قبل القفل، والزيادة قبل المضاعِف، والرون للدرع.'
};
export const LATCH_DUAL_ARITHMETIC_RULE={
 en:'Find items with arrows. Match numbered keys and locks; take the addition before the multiplier.',
 'zh-Hant':'用箭頭找物件，依編號先移鑰匙再移鎖；先取得加值再取倍率。','zh-Hans':'用箭头找物件，按编号先移钥匙再移锁；先取得加值再取倍率。',
 ja:'矢印で探し、同番号の鍵を錠より先に消す。加算を取ってから倍率を取ろう。',ko:'화살표로 찾고 같은 번호의 열쇠를 잠금보다 먼저 없애세요. 더한 뒤 배율을 얻으세요.',
 es:'Busca con las flechas. Empareja llaves y candados; toma la suma antes del multiplicador.',
 'pt-BR':'Use as setas. Combine chaves e travas; pegue a adição antes do multiplicador.',
 fr:'Cherchez avec les flèches. Associez clés et verrous ; prenez le bonus avant le multiplicateur.',
 de:'Suche mit Pfeilen. Ordne Schlüssel den Sperren zu; hole den Bonus vor dem Multiplikator.',
 it:'Cerca con le frecce. Abbina chiavi e blocchi; raccogli il bonus prima del moltiplicatore.',
 ru:'Ищите стрелками. Сопоставьте ключи и замки; возьмите прибавку до множителя.',
 hi:'तीरों से खोजें। समान संख्या के ताले से पहले चाबी हटाएँ; गुणक से पहले जोड़ लें।',
 ar:'ابحث بالأسهم وطابق المفاتيح والأقفال المرقمة؛ اجمع الزيادة قبل المضاعِف.'
};
export const LATCH_ARITHMETIC_RULE={
 en:'Use arrows to find items. Remove the key before its lock; collect the addition before the multiplier.',
 'zh-Hant':'用箭頭找物件。先移鑰匙再移鎖；先取得加值再取得倍率。','zh-Hans':'用箭头找物件。先移钥匙再移锁；先取得加值再取得倍率。',
 ja:'矢印で探し、鍵を錠より先に消す。加算を取ってから倍率を取ろう。',ko:'화살표로 찾고 열쇠를 잠금보다 먼저 없애세요. 더하기를 얻은 뒤 배율을 얻으세요.',
 es:'Busca objetos con las flechas. Quita la llave antes del candado y recoge la suma antes del multiplicador.',
 'pt-BR':'Use as setas para achar itens. Remova a chave antes da trava e pegue a adição antes do multiplicador.',
 fr:'Cherchez avec les flèches. Retirez la clé avant le verrou et prenez le bonus avant le multiplicateur.',
 de:'Suche mit Pfeilen. Entferne den Schlüssel vor der Sperre und hole den Bonus vor dem Multiplikator.',
 it:'Cerca con le frecce. Togli la chiave prima del blocco e raccogli il bonus prima del moltiplicatore.',
 ru:'Ищите предметы стрелками. Уберите ключ до замка и возьмите прибавку до множителя.',
 hi:'वस्तुएँ खोजने के लिए तीर दबाएँ। ताले से पहले चाबी हटाएँ और गुणक से पहले जोड़ लें।',
 ar:'استخدم الأسهم لإيجاد العناصر. أزل المفتاح قبل القفل واجمع الزيادة قبل المضاعِف.'
};
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
 en:'Use arrows to find keys. Match numbers: remove each key before its lock. The rune breaks the shield.',
 'zh-Hant':'用箭頭找鑰匙；數字相同的先移鑰匙再移鎖。收集符文破盾。','zh-Hans':'用箭头找钥匙；数字相同的先移钥匙再移锁。收集符文破盾。',
 ja:'矢印で鍵を探し、同じ番号の鍵を錠より先に消し、ルーンで盾を解除。',ko:'화살표로 열쇠를 찾고 같은 번호의 열쇠를 잠금보다 먼저 없애고 룬으로 방패를 푸세요.',
 es:'Busca llaves con las flechas. Empareja números y quita cada llave antes de su candado; usa la runa para el escudo.',
 'pt-BR':'Use as setas para achar as chaves. Combine os números e remova cada chave antes da trava; use a runa no escudo.',
 fr:'Cherchez les clés avec les flèches. Associez les numéros et retirez chaque clé avant son verrou ; prenez la rune.',
 de:'Suche Schlüssel mit Pfeilen. Gleiche Zahlen gehören zusammen: Schlüssel vor Sperre entfernen, Rune für Schild holen.',
 it:'Cerca le chiavi con le frecce. Abbina i numeri e togli ogni chiave prima del blocco; usa la runa per lo scudo.',
 ru:'Найдите ключи стрелками. Совместите номера и уберите каждый ключ до замка; возьмите руну от щита.',
 hi:'तीरों से चाबियाँ खोजें। समान संख्या मिलाएँ और ताले से पहले चाबी हटाएँ; ढाल के लिए रून लें।',
 ar:'استخدم الأسهم لإيجاد المفاتيح. طابق الأرقام وأزل كل مفتاح قبل قفله، واجمع الرون للدرع.'
};
export const LATCH_BOSS_RULE={
 en:'Remove each numbered key before its lock. Collect the rune and supply for the guardian’s second form.',
 'zh-Hant':'依編號先移鑰匙再移鎖；收集符文與補給，迎戰守衛第二階段。','zh-Hans':'按编号先移钥匙再移锁；收集符文和补给，迎战守卫第二阶段。',
 ja:'同番号の鍵を錠より先に消し、ルーンと補給で守護者の第二形態に挑もう。',ko:'같은 번호의 열쇠를 잠금보다 먼저 없애고 룬과 보급품으로 수호자 2단계를 준비하세요.',
 es:'Empareja llaves y candados por número. Reúne la runa y el suministro para la segunda forma.',
 'pt-BR':'Combine chaves e travas pelo número. Pegue a runa e o suprimento para a segunda forma.',
 fr:'Associez clés et verrous par numéro. Prenez la rune et la réserve pour la seconde forme.',
 de:'Ordne Schlüssel und Sperren nach Nummer. Sammle Rune und Vorrat für die zweite Form.',
 it:'Abbina chiavi e blocchi per numero. Raccogli runa e scorta per la seconda forma.',
 ru:'Сопоставьте ключи и замки по номерам. Возьмите руну и припас для второй формы стража.',
 hi:'संख्या से चाबी और ताला मिलाएँ। रक्षक के दूसरे रूप के लिए रून और सामग्री लें।',
 ar:'طابق المفاتيح والأقفال بالأرقام. اجمع الرون والإمداد لمرحلة الحارس الثانية.'
};
