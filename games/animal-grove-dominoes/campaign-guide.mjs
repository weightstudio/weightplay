// Complete rule explanations shared by runtime and static route generation.
// Do not describe prototype-only three-chain/five-tile rules as this campaign.
import {campaignCopy} from './campaign-copy.mjs?v=20260909-grove-campaign-v6';
const rows={
 en:[
  'Plan a habitat route, use every required domino and reach the moon after completing the stage objectives.',
  'Match the first habitat on a domino to the open end. Required tiles must all be used; optional tiles may be left. Visit every named habitat before reaching the goal.',
  'A bridge-marked tile spends one bridge token. Flip mode reverses only tiles marked ↕ and spends one flip when placed. Follow the displayed delivery order; visiting a later destination early blocks the route.',
  'A matching move can still create a dead end. Undo restores the tile, bridge tokens, flips and delivery progress. Finish a stage to unlock the next; replay cleared stages to improve your pick count.',
  'Cleared stages and best pick counts are saved in this browser. If storage is unavailable, progress lasts only while this page stays open.'
 ],
 'zh-Hant':[
  '規劃棲地路線，用完必用骨牌，完成關卡目標後抵達月地。',
  '骨牌第一端須接上目前端點。必用牌要全部使用，可選牌可以留下；抵達終點前，須造訪所有指定棲地。',
  '標有橋樑的牌會消耗一枚通行證。翻轉模式只會反轉標有 ↕ 的牌，放置時消耗一次翻轉。送達順序須依畫面排列，提早造訪後面的送達點會使路線失敗。',
  '接得上不代表走得通。還原會取回骨牌、橋樑通行證、翻轉次數與送達進度。完成一關會解鎖下一關，也可重玩已完成關卡來減少選牌次數。',
  '通關與最佳選牌次數保存在此瀏覽器。若瀏覽器無法儲存，進度僅保留至此頁面關閉。'
 ],
 'zh-Hans':[
  '规划栖地路线，用完必用骨牌，完成关卡目标后抵达月地。',
  '骨牌第一端须接上当前端点。必用牌要全部使用，可选牌可以留下；抵达终点前，须造访所有指定栖地。',
  '标有桥梁的牌会消耗一枚通行证。翻转模式只会反转标有 ↕ 的牌，放置时消耗一次翻转。送达顺序须依画面排列，提前造访后面的送达点会使路线失败。',
  '接得上不代表走得通。还原会取回骨牌、桥梁通行证、翻转次数与送达进度。完成一关会解锁下一关，也可重玩已完成关卡来减少选牌次数。',
  '通关与最佳选牌次数保存在此浏览器。若浏览器无法保存，进度仅保留至此页面关闭。'
 ],
 ja:[
  '生息地をつなぐ道を考え、必須の牌をすべて使い、課題を達成してから月の地へ進みましょう。',
  '牌の最初の生息地を道の先端に合わせます。必須の牌はすべて使い、任意の牌は残せます。ゴール前に指定の生息地をすべて訪れてください。',
  '橋の印がある牌は通行券を1枚使います。反転モードは ↕ の牌だけを逆向きにし、置くと反転回数を1回使います。配達は表示順に行い、後の届け先へ先に進むと行き詰まります。',
  'つながる牌でも行き止まりになることがあります。元に戻すと牌、通行券、反転回数、配達状況が戻ります。クリアで次が解放され、クリア済みの面は手数更新のため再挑戦できます。',
  'クリア状況と最少手数はこのブラウザに保存されます。保存できない場合、ページを閉じると進行状況が失われます。'
 ],
 ko:[
  '서식지 경로를 계획하고 필수 패를 모두 사용한 뒤 목표를 달성하고 달 서식지에 도착하세요.',
  '패의 첫 서식지를 경로 끝에 맞추세요. 필수 패는 모두 사용해야 하며 선택 패는 남겨도 됩니다. 목표에 도착하기 전에 지정된 서식지를 모두 방문하세요.',
  '다리 표시가 있는 패는 통행권 하나를 씁니다. 뒤집기 모드는 ↕ 패만 반대로 바꾸며 놓을 때 뒤집기 횟수를 하나 씁니다. 표시된 배달 순서를 지키세요. 뒤 순서의 목적지를 먼저 방문하면 경로가 막힙니다.',
  '연결되는 패도 막다른 길을 만들 수 있습니다. 되돌리면 패, 통행권, 뒤집기 횟수와 배달 진행이 복구됩니다. 완료하면 다음 스테이지가 열리며 완료한 스테이지를 다시 플레이해 선택 횟수를 줄일 수 있습니다.',
  '완료 기록과 최소 선택 횟수는 이 브라우저에 저장됩니다. 저장할 수 없으면 페이지가 열려 있는 동안만 유지됩니다.'
 ],
 es:[
  'Planea una ruta de hábitats, usa todas las fichas obligatorias y llega a la luna tras cumplir los objetivos.',
  'Une el primer hábitat de la ficha al extremo abierto. Debes usar todas las fichas obligatorias; puedes dejar las opcionales. Visita todos los hábitats indicados antes de la meta.',
  'Una ficha con puente gasta un pase. El modo de giro solo invierte fichas ↕ y gasta un giro al colocarlas. Sigue el orden de entrega: llegar antes a un destino posterior bloquea la ruta.',
  'Una ficha compatible también puede llevar a un callejón sin salida. Deshacer recupera la ficha, los pases, los giros y el progreso de entrega. Completa un nivel para abrir el siguiente o repite uno superado para mejorar tus elecciones.',
  'Los niveles completados y las mejores marcas se guardan en este navegador. Sin almacenamiento, el progreso dura solo mientras la página permanezca abierta.'
 ],
 'pt-BR':[
  'Planeje uma rota de habitats, use todas as peças obrigatórias e alcance a lua após cumprir os objetivos.',
  'Combine o primeiro habitat da peça com a ponta aberta. Use todas as peças obrigatórias; as opcionais podem sobrar. Visite todos os habitats indicados antes do destino.',
  'Uma peça com ponte consome um passe. O modo de virar inverte apenas peças ↕ e gasta uma virada ao colocá-las. Siga a ordem de entrega: visitar antes um destino posterior bloqueia a rota.',
  'Uma combinação válida também pode criar um beco sem saída. Desfazer devolve a peça, os passes, as viradas e o progresso das entregas. Conclua uma fase para abrir a próxima ou repita uma concluída para reduzir as escolhas.',
  'As fases concluídas e melhores marcas ficam neste navegador. Sem armazenamento, o progresso dura apenas enquanto a página estiver aberta.'
 ],
 fr:[
  'Tracez un parcours, utilisez tous les dominos obligatoires et rejoignez la lune après avoir rempli les objectifs.',
  'Reliez le premier habitat de la tuile à l’extrémité ouverte. Utilisez toutes les tuiles obligatoires ; les facultatives peuvent rester. Visitez tous les habitats indiqués avant l’arrivée.',
  'Une tuile marquée d’un pont dépense un passage. Le mode retournement inverse seulement les tuiles ↕ et consomme un retournement à la pose. Respectez l’ordre des livraisons : visiter trop tôt une destination ultérieure bloque le parcours.',
  'Une tuile compatible peut mener à une impasse. Annuler restitue la tuile, les passages, les retournements et les livraisons. Terminez un niveau pour ouvrir le suivant ou rejouez un niveau terminé pour améliorer votre nombre de choix.',
  'Les niveaux terminés et les meilleurs résultats sont conservés dans ce navigateur. Sans stockage, la progression dure seulement tant que la page reste ouverte.'
 ],
 de:[
  'Plane einen Lebensraum-Pfad, nutze alle Pflichtsteine und erreiche nach allen Aufgaben den Mond.',
  'Verbinde den ersten Lebensraum des Steins mit dem offenen Ende. Alle Pflichtsteine müssen genutzt werden; optionale dürfen übrig bleiben. Besuche vor dem Ziel alle angegebenen Lebensräume.',
  'Ein Brückenstein verbraucht einen Pass. Der Drehmodus kehrt nur ↕-Steine um und verbraucht beim Legen eine Drehung. Halte die Lieferreihenfolge ein: Ein späteres Ziel zu früh zu besuchen blockiert den Weg.',
  'Auch ein passender Stein kann in eine Sackgasse führen. Rückgängig stellt Stein, Pässe, Drehungen und Lieferfortschritt wieder her. Ein Abschluss öffnet das nächste Level. Wiederhole abgeschlossene Level für weniger Auswahlversuche.',
  'Abgeschlossene Level und Bestwerte werden in diesem Browser gespeichert. Ist Speichern nicht möglich, bleibt der Fortschritt nur bis zum Schließen der Seite erhalten.'
 ],
 it:[
  'Progetta un percorso tra habitat, usa tutti i domino obbligatori e raggiungi la luna dopo gli obiettivi.',
  'Abbina il primo habitat della tessera all’estremità aperta. Usa tutte le tessere obbligatorie; puoi lasciare quelle facoltative. Visita tutti gli habitat indicati prima della meta.',
  'Una tessera ponte consuma un passaggio. La modalità gira inverte solo le tessere ↕ e consuma una rotazione quando le posi. Rispetta l’ordine di consegna: visitare in anticipo una destinazione successiva blocca il percorso.',
  'Una tessera compatibile può portare a un vicolo cieco. Annulla ripristina tessera, passaggi, rotazioni e consegne. Completa un livello per sbloccare il prossimo o rigioca quelli completati per ridurre le scelte.',
  'I livelli completati e i migliori risultati sono salvati in questo browser. Senza archiviazione, i progressi durano solo finché la pagina rimane aperta.'
 ],
 ru:[
  'Спланируйте путь, используйте все обязательные плитки и достигните луны после выполнения заданий.',
  'Соедините первое место обитания на плитке с открытым концом. Используйте все обязательные плитки; необязательные можно оставить. До финиша посетите все указанные места.',
  'Плитка с мостом расходует один пропуск. Режим переворота меняет направление только плиток ↕ и тратит переворот при размещении. Соблюдайте порядок доставки: ранний визит в более поздний пункт блокирует путь.',
  'Подходящая плитка тоже может завести в тупик. Отмена возвращает плитку, пропуски, перевороты и ход доставки. Завершение открывает следующий уровень. Пройденные уровни можно повторять ради лучшего результата.',
  'Пройденные уровни и лучшие результаты сохраняются в этом браузере. Если сохранение недоступно, прогресс остается только до закрытия страницы.'
 ],
 hi:[
  'आवासों का रास्ता बनाएँ, सभी अनिवार्य टाइलें लगाएँ और लक्ष्य पूरे करने के बाद चाँद तक पहुँचें।',
  'टाइल के पहले आवास को रास्ते के खुले सिरे से मिलाएँ। सभी अनिवार्य टाइलें लगानी हैं; वैकल्पिक टाइलें छोड़ी जा सकती हैं। लक्ष्य तक पहुँचने से पहले बताए गए सभी आवासों पर जाएँ।',
  'पुल वाली टाइल एक पास खर्च करती है। पलटने का मोड केवल ↕ वाली टाइलों की दिशा बदलता है और लगाने पर एक पलटाव खर्च होता है। डिलीवरी का क्रम मानें: बाद के स्थान पर पहले पहुँचने से रास्ता बंद हो जाता है।',
  'मिलती हुई टाइल भी बंद रास्ता बना सकती है। वापस करने पर टाइल, पास, पलटाव और डिलीवरी की प्रगति लौट आती है। स्तर पूरा करके अगला खोलें या पूरे स्तर को कम चुनावों में फिर खेलें।',
  'पूरे स्तर और सबसे कम चुनाव इसी ब्राउज़र में सहेजे जाते हैं। भंडारण उपलब्ध न हो तो प्रगति पेज खुला रहने तक ही रहती है।'
 ],
 ar:[
  'خطط لمسار المواطن، واستخدم كل القطع الإلزامية، ثم بلغ القمر بعد إتمام الأهداف.',
  'طابق الموطن الأول في القطعة مع الطرف المفتوح. استخدم كل القطع الإلزامية؛ يمكن ترك الاختيارية. زر جميع المواطن المحددة قبل الوصول إلى الهدف.',
  'تستهلك قطعة الجسر تصريحًا واحدًا. يعكس وضع القلب القطع ذات علامة ↕ فقط، ويستهلك قلبة عند وضعها. اتبع ترتيب التسليم: زيارة وجهة لاحقة مبكرًا تغلق المسار.',
  'قد تقود القطعة المتطابقة إلى طريق مسدود. التراجع يعيد القطعة والتصاريح والقلبات وتقدم التسليم. أكمل المرحلة لفتح التالية، أو أعد مرحلة مكتملة لتحسين عدد اختياراتك.',
  'تُحفظ المراحل المكتملة وأفضل النتائج في هذا المتصفح. إذا تعذر التخزين، يبقى التقدم فقط ما دامت الصفحة مفتوحة.'
 ]
};
const shortIntro={en:'Plan a route. Use the required dominoes and reach the moon.',
 'zh-Hant':'規劃路線，用完必用骨牌，抵達月地。','zh-Hans':'规划路线，用完必用骨牌，抵达月地。',
 ja:'道を考え、必須の牌を使って月の地へ進もう。',ko:'경로를 계획하고 필수 패를 사용해 달에 도착하세요.',
 es:'Planea la ruta y llega a la luna usando las fichas obligatorias.',
 'pt-BR':'Planeje a rota e chegue à lua usando as peças obrigatórias.',
 fr:'Tracez un chemin vers la lune avec les dominos obligatoires.',
 de:'Plane den Weg zum Mond und nutze alle Pflichtsteine.',
 it:'Trova la via per la luna usando tutti i domino obbligatori.',
 ru:'Проложите путь к луне, используя обязательные плитки.',
 hi:'रास्ता बनाएँ और अनिवार्य टाइलों से चाँद तक पहुँचें।',
 ar:'خطط للطريق إلى القمر باستخدام القطع الإلزامية.'};
export const campaignGuide=Object.freeze(Object.fromEntries(Object.entries(rows).map(([locale,[intro,rule,resource,recovery,save]])=>[locale,Object.freeze({intro:shortIntro[locale],guideIntro:intro,guideOne:rule,guideTwo:resource,guideThree:recovery,faqProgressAnswer:save,
 facts:campaignCopy[locale].summary,completeKicker:campaignCopy[locale].win,
 guideOneTitle:campaignCopy[locale].required,guideTwoTitle:campaignCopy[locale].bridges+' / '+campaignCopy[locale].flips,guideThreeTitle:campaignCopy[locale].stages})])));
