// Game-owned campaign language contract. No English fallback for a supported
// locale, and no translated game alias: the shell uses the official registry.
export const CAMPAIGN_LOCALES=Object.freeze(['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar']);
const keys='stages|stage|start|undo|hint|replay|next|back|won|stalled|keys|order|hints|undos|stars|locked|cleared|available|close'.split('|');
const ruleKeys='ready|selected|mismatch|covered|sides|sealed|orderBlocked|matched|goal|rule|sealRule|orderRule|storage|searchUnknown'.split('|');
const labels={
 en:'Stages|Stage|Play|Undo|Hint|Replay|Next stage|Back|Board cleared|No available pair|Seal keys|Pair order|Hints|Undos|Stars|Locked|Cleared|Available|Close',
 'zh-Hant':'選擇關卡|關卡|開始|撤銷|提示|重玩|下一關|返回|清盤完成|目前沒有可用配對|封印鑰匙|配對順序|提示次數|撤銷次數|星級|尚未解鎖|已完成|可挑戰|關閉',
 'zh-Hans':'选择关卡|关卡|开始|撤销|提示|重玩|下一关|返回|清盘完成|目前没有可用配对|封印钥匙|配对顺序|提示次数|撤销次数|星级|尚未解锁|已完成|可挑战|关闭',
 ja:'ステージ選択|ステージ|開始|戻す|ヒント|再挑戦|次のステージ|戻る|盤面クリア|取れる組がありません|封印の鍵|組を取る順番|ヒント回数|戻した回数|星|未解放|クリア済み|挑戦可能|閉じる',
 ko:'단계 선택|단계|시작|되돌리기|힌트|다시 하기|다음 단계|뒤로|모두 제거했어요|가능한 짝이 없어요|봉인 열쇠|짝 제거 순서|힌트 횟수|되돌린 횟수|별|잠김|완료|도전 가능|닫기',
 es:'Niveles|Nivel|Jugar|Deshacer|Pista|Repetir|Siguiente nivel|Volver|Tablero vacío|No hay parejas disponibles|Llaves de sellos|Orden de parejas|Pistas|Deshacer|Estrellas|Bloqueado|Completado|Disponible|Cerrar',
 'pt-BR':'Fases|Fase|Jogar|Desfazer|Dica|Repetir|Próxima fase|Voltar|Tabuleiro limpo|Nenhum par disponível|Chaves dos selos|Ordem dos pares|Dicas|Ações desfeitas|Estrelas|Bloqueada|Concluída|Disponível|Fechar',
 fr:'Niveaux|Niveau|Jouer|Annuler|Indice|Rejouer|Niveau suivant|Retour|Plateau vidé|Aucune paire disponible|Clés des sceaux|Ordre des paires|Indices|Annulations|Étoiles|Verrouillé|Terminé|Disponible|Fermer',
 de:'Level|Level|Spielen|Zurücknehmen|Tipp|Wiederholen|Nächstes Level|Zurück|Brett geleert|Kein verfügbares Paar|Siegelschlüssel|Paarreihenfolge|Tipps|Rücknahmen|Sterne|Gesperrt|Geschafft|Verfügbar|Schließen',
 it:'Livelli|Livello|Gioca|Annulla|Indizio|Rigioca|Livello successivo|Indietro|Tavolo vuoto|Nessuna coppia disponibile|Chiavi dei sigilli|Ordine delle coppie|Indizi|Annullamenti|Stelle|Bloccato|Completato|Disponibile|Chiudi',
 ru:'Уровни|Уровень|Играть|Отменить|Подсказка|Повторить|Следующий уровень|Назад|Поле очищено|Нет доступных пар|Ключи печатей|Порядок пар|Подсказки|Отмены|Звёзды|Закрыт|Пройден|Доступен|Закрыть',
 hi:'स्तर चुनें|स्तर|खेलें|वापस लें|संकेत|फिर खेलें|अगला स्तर|वापस|बोर्ड साफ़ हुआ|कोई उपलब्ध जोड़ी नहीं|मुहर की चाबियाँ|जोड़ियों का क्रम|संकेत|वापस लिए कदम|सितारे|बंद|पूरा हुआ|उपलब्ध|बंद करें',
 ar:'المراحل|المرحلة|العب|تراجع|تلميح|إعادة اللعب|المرحلة التالية|رجوع|تم إخلاء اللوح|لا يوجد زوج متاح|مفاتيح الأختام|ترتيب الأزواج|التلميحات|مرات التراجع|النجوم|مقفلة|مكتملة|متاحة|إغلاق',
};
const rules={
 en:'Choose an available tile, then its matching partner.|Choose another available tile with the same symbol.|Different symbols. Try another partner.|Remove the tiles covering this one first.|Both sides are blocked. Open an edge first.|Match the key pair to open this seal.|Follow the numbered pair order.|Pair removed. Look for newly available tiles.|Match all identical available pairs to clear the board.|A tile is free when nothing covers it and at least one side is open.|Matching a key pair opens its linked seals. Undo closes them again.|Numbered pairs must be removed in the displayed order; other pairs remain free.|Saving is unavailable. Progress stays in this session only.|The search limit was reached. This does not mean the board is impossible.',
 'zh-Hant':'先選可用牌，再選相同的另一張。|再選一張相同圖案的可用牌。|圖案不同，請找另一張配對。|先消除壓在這張牌上方的牌。|左右兩側被擋住，先打開邊緣。|先配對鑰匙牌，才能解除這個封印。|請依照標示的編號順序配對。|配對消除了，看看哪些牌變得可用。|配對所有相同的可用牌，清空牌盤。|上方沒有牌覆蓋，且左右至少一側暢通，才是可用牌。|配對鑰匙牌會開啟相連的封印；撤銷時封印也會恢復。|帶編號的牌必須依序配對；其他牌仍可自由配對。|目前無法儲存，進度只保留在這次遊戲中。|搜尋已達運算上限，這不代表牌局無解。',
 'zh-Hans':'先选可用牌，再选相同的另一张。|再选一张相同图案的可用牌。|图案不同，请找另一张配对。|先消除压在这张牌上方的牌。|左右两侧被挡住，先打开边缘。|先配对钥匙牌，才能解除这个封印。|请依照标示的编号顺序配对。|配对消除了，看看哪些牌变得可用。|配对所有相同的可用牌，清空牌盘。|上方没有牌覆盖，且左右至少一侧畅通，才是可用牌。|配对钥匙牌会开启相连的封印；撤销时封印也会恢复。|带编号的牌必须依序配对；其他牌仍可自由配对。|目前无法储存，进度只保留在这次游戏中。|搜索已达运算上限，这不代表牌局无解。',
 ja:'取れる牌を選び、同じ絵柄の牌を選びます。|同じ絵柄の取れる牌をもう1枚選んでください。|絵柄が違います。別の相手を探しましょう。|この牌の上にある牌を先に取りましょう。|左右が塞がれています。端を先に開けましょう。|鍵の組を取ると、この封印が開きます。|番号で示された順番に組を取りましょう。|組を取りました。新しく取れる牌を探しましょう。|同じ絵柄の取れる牌をすべて組にして、盤面を空にします。|上に牌がなく、左右どちらか一方が空いていれば取れます。|鍵の組を取ると対応する封印が開きます。取り消すと封印も戻ります。|番号付きの組は表示順に取ります。他の組は自由に取れます。|保存できません。進行状況は今回のプレイ中だけ保持されます。|探索上限に達しました。解けないという意味ではありません。',
 ko:'열린 패를 고른 뒤 같은 그림의 패를 고르세요.|같은 그림의 열린 패를 하나 더 고르세요.|그림이 달라요. 다른 짝을 찾아보세요.|이 패 위를 덮은 패부터 없애세요.|양옆이 막혔어요. 가장자리를 먼저 여세요.|열쇠 짝을 없애면 이 봉인이 열려요.|표시된 번호 순서대로 짝을 없애세요.|짝을 없앴어요. 새로 열린 패를 찾아보세요.|같은 그림의 열린 패를 모두 짝지어 판을 비우세요.|위를 덮은 패가 없고 좌우 중 한쪽이 비어 있으면 열린 패예요.|열쇠 짝을 없애면 연결된 봉인이 열려요. 되돌리면 봉인도 복구돼요.|번호가 있는 짝은 표시 순서대로 없애세요. 나머지 짝은 자유롭게 없앨 수 있어요.|저장할 수 없어요. 진행 상황은 이번 플레이 중에만 유지돼요.|탐색 한도에 도달했어요. 풀 수 없는 판이라는 뜻은 아니에요.',
 es:'Elige una ficha libre y luego otra igual.|Elige otra ficha libre con el mismo símbolo.|Son símbolos distintos. Busca otra pareja.|Retira primero las fichas que cubren esta.|Ambos lados están bloqueados. Abre un borde.|Retira la pareja llave para abrir este sello.|Sigue el orden de las parejas numeradas.|Pareja retirada. Busca las fichas recién liberadas.|Retira todas las parejas libres iguales para vaciar el tablero.|Una ficha está libre si no tiene otra encima y al menos un lado está abierto.|Retirar una pareja llave abre sus sellos. Deshacer vuelve a cerrarlos.|Retira las parejas numeradas en el orden indicado; las demás son libres.|No se puede guardar. El progreso solo dura esta sesión.|La búsqueda alcanzó su límite. Eso no significa que el tablero sea imposible.',
 'pt-BR':'Escolha uma peça livre e depois outra igual.|Escolha outra peça livre com o mesmo símbolo.|Os símbolos são diferentes. Procure outro par.|Remova primeiro as peças que cobrem esta.|Os dois lados estão bloqueados. Abra uma borda.|Remova o par de chaves para abrir este selo.|Siga a ordem dos pares numerados.|Par removido. Procure as peças recém-liberadas.|Remova todos os pares livres iguais para limpar o tabuleiro.|Uma peça está livre quando não há outra sobre ela e pelo menos um lado está aberto.|Remover um par de chaves abre seus selos. Desfazer fecha os selos novamente.|Remova os pares numerados na ordem indicada; os demais são livres.|Não foi possível salvar. O progresso dura apenas esta sessão.|A busca atingiu o limite. Isso não significa que o tabuleiro seja impossível.',
 fr:'Choisissez une tuile libre, puis une tuile identique.|Choisissez une autre tuile libre avec le même symbole.|Les symboles diffèrent. Cherchez une autre paire.|Retirez d’abord les tuiles qui couvrent celle-ci.|Les deux côtés sont bloqués. Libérez un bord.|Retirez la paire-clé pour ouvrir ce sceau.|Suivez l’ordre des paires numérotées.|Paire retirée. Cherchez les tuiles libérées.|Retirez toutes les paires libres identiques pour vider le plateau.|Une tuile est libre si rien ne la couvre et si au moins un côté est dégagé.|Retirer une paire-clé ouvre ses sceaux. Annuler les referme.|Retirez les paires numérotées dans l’ordre indiqué ; les autres restent libres.|Sauvegarde indisponible. La progression ne dure que cette session.|La recherche a atteint sa limite. Cela ne signifie pas que le plateau est impossible.',
 de:'Wähle einen freien Stein und dann einen gleichen.|Wähle einen weiteren freien Stein mit demselben Symbol.|Die Symbole sind verschieden. Suche einen anderen Partner.|Entferne zuerst die Steine darüber.|Beide Seiten sind blockiert. Öffne zuerst einen Rand.|Entferne das Schlüsselpaar, um dieses Siegel zu öffnen.|Beachte die Reihenfolge der nummerierten Paare.|Paar entfernt. Suche neu freigelegte Steine.|Entferne alle gleichen freien Paare, um das Brett zu leeren.|Ein Stein ist frei, wenn nichts auf ihm liegt und mindestens eine Seite offen ist.|Ein Schlüsselpaar öffnet seine Siegel. Beim Zurücknehmen schließen sie sich wieder.|Nummerierte Paare folgen der angezeigten Reihenfolge; andere Paare sind frei wählbar.|Speichern ist nicht möglich. Der Fortschritt bleibt nur in dieser Sitzung.|Die Suchgrenze wurde erreicht. Das Brett ist deshalb nicht unbedingt unlösbar.',
 it:'Scegli una tessera libera e poi una uguale.|Scegli un’altra tessera libera con lo stesso simbolo.|I simboli sono diversi. Cerca un’altra coppia.|Rimuovi prima le tessere che coprono questa.|Entrambi i lati sono bloccati. Libera un bordo.|Rimuovi la coppia chiave per aprire questo sigillo.|Segui l’ordine delle coppie numerate.|Coppia rimossa. Cerca le tessere appena liberate.|Rimuovi tutte le coppie libere uguali per svuotare il tavolo.|Una tessera è libera se non è coperta e almeno un lato è aperto.|Rimuovere una coppia chiave apre i suoi sigilli. Annullare li richiude.|Rimuovi le coppie numerate nell’ordine indicato; le altre restano libere.|Impossibile salvare. I progressi durano solo per questa sessione.|La ricerca ha raggiunto il limite. Non significa che il tavolo sia impossibile.',
 ru:'Выберите свободную плитку, затем такую же.|Выберите ещё одну свободную плитку с тем же символом.|Символы разные. Найдите другую пару.|Сначала уберите плитки над этой.|Обе стороны закрыты. Сначала освободите край.|Уберите пару-ключ, чтобы открыть эту печать.|Соблюдайте порядок пронумерованных пар.|Пара убрана. Найдите освободившиеся плитки.|Уберите все одинаковые свободные пары, чтобы очистить поле.|Плитка свободна, если над ней ничего нет и хотя бы одна сторона открыта.|Пара-ключ открывает связанные печати. Отмена снова их закрывает.|Убирайте пронумерованные пары в указанном порядке; остальные можно выбирать свободно.|Сохранение недоступно. Прогресс останется только в этой сессии.|Достигнут предел поиска. Это не означает, что поле неразрешимо.',
 hi:'एक खुली टाइल चुनें, फिर उसी चिह्न वाली दूसरी टाइल चुनें।|उसी चिह्न वाली एक और खुली टाइल चुनें।|चिह्न अलग हैं। दूसरी जोड़ी ढूँढ़ें।|पहले इस टाइल को ढकने वाली टाइलें हटाएँ।|दोनों किनारे बंद हैं। पहले एक किनारा खोलें।|यह मुहर खोलने के लिए चाबी की जोड़ी हटाएँ।|नंबर वाली जोड़ियों का दिखाया गया क्रम मानें।|जोड़ी हट गई। नई खुली टाइलें ढूँढ़ें।|एक जैसे चिह्नों की सभी खुली जोड़ियाँ हटाकर बोर्ड साफ़ करें।|टाइल खुली है जब उसके ऊपर कोई टाइल नहीं है और कम से कम एक किनारा खुला है।|चाबी की जोड़ी हटाने से उससे जुड़ी मुहरें खुलती हैं। कदम वापस लेने पर वे फिर बंद होती हैं।|नंबर वाली जोड़ियाँ दिखाए गए क्रम में हटाएँ; बाकी जोड़ियाँ किसी भी क्रम में हटा सकते हैं।|सहेजना उपलब्ध नहीं है। प्रगति केवल इस सत्र में रहेगी।|खोज की सीमा आ गई। इसका मतलब यह नहीं कि बोर्ड हल नहीं हो सकता।',
 ar:'اختر قطعة متاحة ثم قطعة تحمل الرمز نفسه.|اختر قطعة متاحة أخرى تحمل الرمز نفسه.|الرمزان مختلفان. ابحث عن شريك آخر.|أزل أولًا القطع التي تغطي هذه القطعة.|الجانبان مسدودان. افتح أحد الطرفين أولًا.|أزل زوج المفتاح لفتح هذا الختم.|اتبع ترتيب الأزواج المرقمة.|أزيل الزوج. ابحث عن القطع التي أصبحت متاحة.|أزل كل الأزواج المتطابقة المتاحة لإخلاء اللوح.|تكون القطعة متاحة إذا لم تغطها قطعة أخرى وكان أحد جانبيها مفتوحًا.|إزالة زوج المفتاح تفتح أختامه المرتبطة. التراجع يغلقها مجددًا.|أزل الأزواج المرقمة بالترتيب المعروض؛ أما الأزواج الأخرى فاختيارها حر.|الحفظ غير متاح. سيبقى التقدم في هذه الجلسة فقط.|بلغ البحث حدّه. لا يعني ذلك أن اللوح غير قابل للحل.',
};
const faces={
 en:'Bamboo|Plum blossom|Moon|Lantern|Coin|Maple leaf|Koi|Lotus|Turtle|Ginkgo|Cloud|Fan|Mountain|Swallow|Sun|Knot',
 'zh-Hant':'竹|梅花|月亮|燈籠|銅錢|楓葉|錦鯉|蓮花|龜|銀杏|雲|扇子|山|燕子|太陽|結',
 'zh-Hans':'竹|梅花|月亮|灯笼|铜钱|枫叶|锦鲤|莲花|龟|银杏|云|扇子|山|燕子|太阳|结',
 ja:'竹|梅の花|月|提灯|硬貨|もみじ|鯉|蓮|亀|いちょう|雲|扇|山|燕|太陽|結び',
 ko:'대나무|매화|달|등불|동전|단풍잎|잉어|연꽃|거북|은행잎|구름|부채|산|제비|해|매듭',
 es:'Bambú|Flor de ciruelo|Luna|Farol|Moneda|Hoja de arce|Carpa koi|Loto|Tortuga|Ginkgo|Nube|Abanico|Montaña|Golondrina|Sol|Nudo',
 'pt-BR':'Bambu|Flor de ameixeira|Lua|Lanterna|Moeda|Folha de bordo|Carpa koi|Lótus|Tartaruga|Ginkgo|Nuvem|Leque|Montanha|Andorinha|Sol|Nó',
 fr:'Bambou|Fleur de prunier|Lune|Lanterne|Pièce|Feuille d’érable|Carpe koï|Lotus|Tortue|Ginkgo|Nuage|Éventail|Montagne|Hirondelle|Soleil|Nœud',
 de:'Bambus|Pflaumenblüte|Mond|Laterne|Münze|Ahornblatt|Koi|Lotus|Schildkröte|Ginkgo|Wolke|Fächer|Berg|Schwalbe|Sonne|Knoten',
 it:'Bambù|Fiore di pruno|Luna|Lanterna|Moneta|Foglia d’acero|Carpa koi|Loto|Tartaruga|Ginkgo|Nuvola|Ventaglio|Montagna|Rondine|Sole|Nodo',
 ru:'Бамбук|Цветок сливы|Луна|Фонарь|Монета|Кленовый лист|Карп кои|Лотос|Черепаха|Гинкго|Облако|Веер|Гора|Ласточка|Солнце|Узел',
 hi:'बाँस|आलूबुखारे का फूल|चाँद|लालटेन|सिक्का|मेपल का पत्ता|कोई मछली|कमल|कछुआ|जिन्कगो|बादल|पंखा|पहाड़|अबाबील|सूरज|गाँठ',
 ar:'خيزران|زهرة البرقوق|قمر|فانوس|عملة|ورقة قيقب|سمكة كوي|لوتس|سلحفاة|جنكة|سحابة|مروحة|جبل|سنونو|شمس|عقدة',
};
function split(value,count,locale,kind){const values=value?.split('|');if(values?.length!==count||values.some(v=>!v.trim()))throw new Error(`Incomplete campaign ${locale}/${kind}`);return values;}
const recovery={
 en:'This position cannot be cleared. Undo a pair or replay the stage.',
 'zh-Hant':'目前牌局無法清盤，請撤銷配對，或重新挑戰這一關。',
 'zh-Hans':'目前牌局无法清盘，请撤销配对，或重新挑战这一关。',
 ja:'この配置からはクリアできません。組を戻すか、ステージをやり直してください。',
 ko:'현재 배치에서는 모두 제거할 수 없어요. 짝 제거를 되돌리거나 단계를 다시 시작하세요.',
 es:'Esta posición no se puede resolver. Deshaz una pareja o repite el nivel.',
 'pt-BR':'Não é possível limpar esta posição. Desfaça um par ou reinicie a fase.',
 fr:'Cette position ne peut pas être résolue. Annulez une paire ou rejouez le niveau.',
 de:'Diese Stellung lässt sich nicht lösen. Nimm ein Paar zurück oder starte das Level neu.',
 it:'Questa posizione non può essere risolta. Annulla una coppia o ripeti il livello.',
 ru:'Эту позицию нельзя завершить. Отмените пару или начните уровень заново.',
 hi:'इस स्थिति से बोर्ड साफ़ नहीं हो सकता। एक जोड़ी वापस लें या स्तर फिर से खेलें।',
 ar:'لا يمكن إخلاء اللوح من هذا الوضع. تراجع عن زوج أو أعد لعب المرحلة.',
};
const leaveCopy={
 en:['Leave this board?','This unfinished board will restart. Completed stages and earned stars stay saved.','Continue playing'],
 'zh-Hant':['離開這局？','未完成的牌局會重新開始；已完成關卡與星級仍會保留。','繼續遊戲'],
 'zh-Hans':['离开这局？','未完成的牌局会重新开始；已完成关卡与星级仍会保留。','继续游戏'],
 ja:['この盤面を離れますか？','未完了の盤面は最初からになります。クリア済みのステージと星は保持されます。','プレイを続ける'],
 ko:['이 판을 나갈까요?','진행 중인 판은 처음부터 시작합니다. 완료한 단계와 별은 유지됩니다.','계속 플레이'],
 es:['¿Salir del tablero?','El tablero sin terminar se reiniciará. Los niveles completados y las estrellas se conservan.','Seguir jugando'],
 'pt-BR':['Sair deste tabuleiro?','O tabuleiro incompleto será reiniciado. As fases concluídas e estrelas serão mantidas.','Continuar jogando'],
 fr:['Quitter ce plateau ?','Ce plateau inachevé recommencera. Les niveaux terminés et les étoiles sont conservés.','Continuer à jouer'],
 de:['Dieses Brett verlassen?','Das unfertige Brett beginnt neu. Abgeschlossene Level und Sterne bleiben erhalten.','Weiterspielen'],
 it:['Lasciare questo tavolo?','Il tavolo incompleto ricomincerà. I livelli completati e le stelle resteranno salvati.','Continua a giocare'],
 ru:['Выйти из этой партии?','Незавершённая партия начнётся заново. Пройденные уровни и звёзды сохранятся.','Продолжить игру'],
 hi:['इस बोर्ड से बाहर जाएँ?','अधूरा बोर्ड फिर शुरू होगा। पूरे किए गए स्तर और सितारे बने रहेंगे।','खेलते रहें'],
 ar:['مغادرة هذا اللوح؟','سيبدأ اللوح غير المكتمل من جديد. تبقى المراحل المكتملة والنجوم محفوظة.','متابعة اللعب'],
};
export const CAMPAIGN_COPY=Object.freeze(Object.fromEntries(CAMPAIGN_LOCALES.map(locale=>{
 const values=split(labels[locale],keys.length,locale,'labels'),ruleValues=split(rules[locale],ruleKeys.length,locale,'rules');
 return [locale,Object.freeze({...Object.fromEntries(keys.map((key,i)=>[key,values[i]])),...Object.fromEntries(ruleKeys.map((key,i)=>[key,ruleValues[i]])),recoveryRequired:recovery[locale],leaveTitle:leaveCopy[locale][0],leaveConsequence:leaveCopy[locale][1],continuePlaying:leaveCopy[locale][2],faces:Object.freeze(split(faces[locale],16,locale,'faces'))})];
})));
export function campaignCopy(locale){const row=CAMPAIGN_COPY[locale];if(!row)throw new Error('Unsupported campaign locale');return row;}
export function campaignFaceLabel(locale,face){const index='ABCDEFGHIJKLMNOP'.indexOf(face);if(face.length!==1||index<0)throw new Error('Unknown campaign face');return campaignCopy(locale).faces[index];}
