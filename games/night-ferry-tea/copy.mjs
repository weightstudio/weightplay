var d=Object.defineProperty;var l=(r,t)=>d(r,"name",{value:t,configurable:!0});export const routes={en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};const o=`start stages workshop back pause resume retry next guide goal how rules finish related faq
cleared locked available saved unsaved success failure chapter1 chapter2 checkpoint
shift beat served clean dirty rack income budget A B W C E warm flower chilled brewFlower chill wash hold wait
open closing onway delivered missed nextFerry installed sent ready washed returned sold stale
siteFirst siteBlocked busy cupShort rackFull needFlower needWarm needDirty tooLate needCup closed
lessonSite lessonBrew lessonWait lessonSend resetLesson
standard twin filter caddy theme equipped equip buy confirm cancel unlock permanent
balance bought insufficient unavailable restored departure eta`.split(/\s+/),i=`goalText howText rulesText finishText
q1 a1 q2 a2 standardInfo twinInfo filterInfo caddyInfo themeInfo webgl`.split(/\s+/);function e(r,t){const s=r.trim().split("|").map(a=>a.trim()),n=t.trim().split(`
`).map(a=>a.trim());if(s.length!==o.length||n.length!==i.length)throw new Error("Incomplete teahouse strings: "+s.length+"/"+o.length+" labels, "+n.length+"/"+i.length+" paragraphs");return Object.fromEntries([...o,...i].map((a,u)=>[a,[...s,...n][u]]))}l(e,"pack");export const words={en:e(`Start shift|Shifts|Equipment|Back|Pause|Resume|Retry|Next shift|Game guide|Goal|How to play|Controls and rules|Results|Related games|Questions|
Cleared|Locked|Ready|Progress saved|Could not save|Shift complete|Ferries departed|Westbank tea stand|Fogbound boardwalk|Checkpoint|
Shift|Beat|Orders|Clean cups|Returns|Tea rack|Takings|Budget|West Pier A|East Pier B|West stand|Central stand|East stand|Warm tea|Flower tea|Iced tea|Brew flowers|Chill tea|Wash cups|Insulate|Wait one beat|
Opens|Departs|On the way|Delivered|Missed|Next ferry|Stand installed|Runner dispatched|Tea ready|Cups washed|Cups returned|Order paid|Cup cooled too far|
Set up a stand first|Stand unavailable|Station occupied|Wash a cup first|Tea rack full|Brew flower tea first|Brew warm tea first|No used cups here yet|Arrival too late|Matching cup needed|Unavailable|
Tap the lit site to open your tea stand.|Tap Warm tea to start brewing.|Tap Wait to let the tea finish.|Tap the waiting ferry order to send the cup.|Replay first-shift tutorial|
Standard tray|Double tray|Wide strainer|Insulated caddy|Moon enamel|Equipped|Equip|Buy|Confirm|Cancel|Clear shift|Permanent|
Balance|Added to collection|Too few diamonds|Currently unavailable|Tea stand restored|Travel|Arrival`,`Deliver the required cups before the ferries depart.
Pick a stand site, brew the right tea, then tap the ferry order to send Nori. Wash returned cups to replenish the rack.
Tap or use Tab and Enter. Each service action advances one beat and every busy station works in parallel. Check the ferry windows, travel time and cup freshness.
On-time orders earn two coins. Meet the shift goal to unlock the next shift, or replay with a different layout for three stars.
Why can't I send tea?
Check the tea type, freshness, runner and arrival time shown on the order.
Can I play without spending diamonds?
All shifts have a three-star solution with standard equipment. Diamonds unlock a permanent appearance.
Holds two prepared cups.
Holds three prepared cups and carries two matching orders to the same pier when their ferry windows align.
Washes up to three cups at once.
Keeps one warm cup fresh for eleven beats.
A pearl enamel finish for the teapot, cups and dock lamps. Owned permanently after purchase.
The 3D scene could not start. Retry the shift or return to the map.`),"zh-Hant":e(`開始營業|班次|裝備|返回|暫停|繼續|重試|下一班|遊戲說明|目標|玩法|操作與規則|結算|相關遊戲|常見問題|
已完成|未解鎖|可開始|進度已保存|未能保存|本班達標|渡船已離岸|西岸茶站|霧潮浮橋|檢查點|
班次|拍數|訂單|空杯|待洗|茶杯架|收入|預算|西岸 A|東岸 B|西側站|中央站|東側站|沖暖茶|花茶|冰茶|沖花茶|冷卻|洗杯|保溫|等一拍|
開窗|離岸|送杯中|已送達|已錯過|下一班船|茶站已架好|茶杯已送出|茶已備好|杯子洗好|空杯已回|收到茶款|茶已不新鮮|
先布置茶站|此站位無法使用|工位忙碌|先洗一個杯子|茶架已滿|先沖好花茶|先沖好暖茶|回杯尚未到|抵達會太晚|需相符的茶杯|目前無法操作|
點亮起的站位，架起你的茶站。|點沖暖茶，開始泡第一杯。|點等一拍，讓第一杯茶泡好。|點等候的渡船訂單，送出茶杯。|重玩首班教學|
基本托盤|雙杯盤|寬濾架|保溫茶匣|月白琺瑯|已裝備|裝備|購買|確認|取消|完成班次|永久|
餘額|已加入收藏|鑽石不足|暫時無法使用|已恢復茶站|路程|送達`,`在渡船離岸前交付指定茶杯，達成本班的訂單目標。
選好茶站位置、準備相符的茶，再點渡船訂單請水獺送杯。把回收杯洗乾淨就能繼續泡茶。
點畫面，或以 Tab 和 Enter 操作。每個營業動作前進一拍，忙碌的工位會同時工作。留意兩岸航窗、送杯路程和茶的新鮮時間。
準時送杯每單賺兩枚金幣。達標開下一班，也能重玩並用其他布局挑戰三星。
為何不能送茶？
核對單上茶種、新鮮時間、跑腿是否空閒及預計送達時間。
一定要花鑽石嗎？
基本裝備能在全部班次取得三星。鑽石可購買永久外觀。
可先放兩杯已沖好的茶。
備三杯，同岸同茶且航窗相交時同時送兩杯。
一次最多洗乾淨三個杯子。
讓一杯暖茶保溫十一拍。
茶壺、茶杯和碼頭燈換上月白琺瑯。購買後永久收藏。
無法啟動 3D 場景。請重試班次或回選關。`)};words["zh-Hans"]=e(`开始营业|班次|装备|返回|暂停|继续|重试|下一班|游戏说明|目标|玩法|操作与规则|结算|相关游戏|常见问题|
已完成|未解锁|可开始|进度已保存|保存失败|本班达标|渡船已离岸|西岸茶站|雾潮浮桥|检查点|
班次|拍数|订单|空杯|待洗|茶杯架|收入|预算|西岸 A|东岸 B|西侧站|中央站|东侧站|泡暖茶|花茶|冰茶|泡花茶|冷却|洗杯|保温|等一拍|
开窗|离岸|送杯中|已送达|已错过|下一班船|茶站已搭好|茶杯已送出|茶已备好|杯子洗好|空杯已回|收到茶款|茶已不新鲜|
先布置茶站|此站位无法使用|工位忙碌|先洗一个杯子|茶架已满|先泡好花茶|先泡好暖茶|回杯还未到|抵达会太晚|需要相符的茶杯|当前无法操作|
点击亮起的站位，搭起茶站。|点泡暖茶，开始泡第一杯。|点等一拍，让第一杯茶泡好。|点等待中的渡船订单，送出茶杯。|重玩首班教学|
基本托盘|双杯盘|宽滤架|保温茶匣|月白珐琅|已装备|装备|购买|确认|取消|完成班次|永久|
余额|已加入收藏|钻石不足|暂时无法使用|已恢复茶站|路程|送达`,`在渡船离岸前交付指定茶杯，达成本班的订单目标。
选好茶站位置、准备相符的茶，再点击渡船订单请水獭送杯。洗干净回收杯就能继续泡茶。
点击屏幕，或用 Tab 和 Enter 操作。每个营业动作前进一拍，忙碌的工位同时工作。留意两岸航窗、送杯路程和茶的新鲜时间。
准时送杯每单赚两枚金币。达标开启下一班，也可试试别的布局来挑战三星。
为什么不能送茶？
核对订单茶种、新鲜时间、跑腿是否空闲以及预计送达时间。
一定要花钻石吗？
基本装备能在所有班次取得三星。钻石可以购买永久外观。
可先放两杯泡好的茶。
备三杯，同岸同茶且航窗相交时可以同时送两杯。
一次最多洗干净三个杯子。
让一杯暖茶保温十一拍。
茶壶、茶杯和码头灯换成月白珐琅。购买后永久收藏。
无法启动 3D 场景。请重试班次或返回选关。`),words.ja=e(`営業開始|便一覧|道具|戻る|一時停止|再開|やり直す|次の便|遊び方|目標|進め方|操作とルール|結果|関連ゲーム|よくある質問|
達成|未解放|開始可能|進み具合を保存しました|保存できませんでした|目標達成|渡し船は出航しました|西岸の茶屋|霧の浮き桟橋|節目|
便|手番|注文|空の茶器|洗い待ち|茶器棚|売上|予算|西桟橋 A|東桟橋 B|西の茶屋|中央の茶屋|東の茶屋|温茶|花茶|冷茶|花茶を淹れる|冷やす|洗う|保温する|一手待つ|
受付開始|出航|配達中|配達済み|締切終了|次の渡し船|茶屋を設置|茶を発送|お茶が完成|洗浄完了|茶器が戻った|代金を受取|お茶が冷めた|
先に茶屋を置く|ここには置けません|作業中|茶器を洗ってください|茶器棚が満杯|花茶を淹れてください|温茶を淹れてください|洗える茶器はまだありません|間に合いません|指定のお茶が必要です|現在は使えません|
光る場所を押して茶屋を設置します。|温茶を押して最初のお茶を淹れます。|一手待つを押すとお茶ができます。|待っている船の注文を押して届けます。|最初の便の練習をやり直す|
通常のお盆|二杯用のお盆|幅広の洗いかご|保温ケース|月白ほうろう|装備中|装備する|購入|確認|キャンセル|便を達成|永久|
残高|コレクションに追加|ダイヤが足りません|現在利用できません|茶屋を再開しました|所要手番|到着`,`渡し船が出る前に必要なお茶を届け、目標の注文数を満たします。
茶屋の場所を選んで指定のお茶を淹れ、船の注文を押してカワウソに配達を頼みます。戻った茶器は洗って再利用できます。
タップするか Tab と Enter で操作します。営業操作ごとに一手進み、作業中の設備は同時に動きます。船の受付時間や移動と鮮度に注意します。
間に合った注文ごとにコイン二枚を受け取ります。目標で次の便が解放され、配置を変えて星三つを狙えます。
お茶を届けられないのはなぜ？
お茶の種類と鮮度、担当が空いているか、到着予定を確認してください。
ダイヤを使わずに遊べますか？
通常のお盆で全ての便の星三つを達成できます。ダイヤでは永久外観を入手できます。
淹れたお茶を二杯置けます。
お茶を三杯置けます。同じ茶と桟橋の二件を同じ受付時間に運べます。
一度に茶器を三つまで洗えます。
温茶一杯の鮮度を十一手分保ちます。
やかん、茶器、桟橋の灯りを月白ほうろうに変更する永久外観です。
3D 場面を起動できませんでした。やり直すか便一覧に戻ってください。`),words.ko=e(`영업 시작|운항편|장비|뒤로|일시 정지|계속|재시도|다음 편|게임 안내|목표|플레이 방법|조작과 규칙|결과|관련 게임|자주 묻는 질문|
완료|잠김|준비됨|진행 저장됨|저장 실패|목표 달성|나룻배 출항|서쪽 찻집|안개 낀 부잔교|중간 점검|
운항편|턴|주문|빈 찻잔|세척 대기|찻잔 선반|수입|예산|서쪽 선착장 A|동쪽 선착장 B|서쪽 찻집|중앙 찻집|동쪽 찻집|따뜻한 차|꽃차|찬 차|꽃차 우리기|차 식히기|잔 씻기|보온하기|한 턴 기다리기|
접수 시작|출항|배달 중|도착|놓침|다음 나룻배|찻집 설치|배달 출발|차 준비됨|잔 세척 완료|빈 잔 돌아옴|차 값 받음|차가 식었어요|
먼저 찻집을 설치하세요|설치할 수 없어요|작업 중|잔을 먼저 씻으세요|선반이 꽉 찼어요|꽃차를 먼저 우리세요|따뜻한 차를 먼저 우리세요|아직 돌아온 잔이 없어요|늦게 도착해요|맞는 차가 필요해요|지금 할 수 없어요|
빛나는 자리를 눌러 찻집을 차리세요.|따뜻한 차를 눌러 첫 잔을 우리세요.|한 턴 기다리기를 누르면 차가 완성됩니다.|기다리는 나룻배 주문을 눌러 차를 보내세요.|첫 운항편 연습 다시 하기|
기본 쟁반|두 잔 쟁반|넓은 세척대|보온 상자|달빛 법랑|장착 중|장착|구매|확인|취소|운항편 완료|영구|
잔액|수집품에 추가됨|다이아몬드가 부족해요|지금 사용할 수 없어요|찻집이 복구되었어요|이동 턴|도착`,`나룻배가 출항하기 전에 필요한 차를 배달해 주문 목표를 달성하세요.
찻집 자리를 정하고 맞는 차를 우린 뒤 나룻배 주문을 눌러 수달을 보내세요. 돌아온 잔을 씻어 다시 쓸 수 있어요.
탭하거나 Tab과 Enter로 조작하세요. 영업 행동마다 한 턴이 지나며 여러 설비가 동시에 일합니다. 접수 시간과 이동 시간, 차의 신선도를 확인하세요.
제시간에 배달한 주문은 동전 두 개를 줍니다. 목표를 달성하면 다음 편이 열리고, 다른 배치로 별 세 개에 도전할 수 있어요.
왜 차를 보낼 수 없나요?
주문의 차 종류, 신선도, 배달원이 비었는지와 도착 예정 시간을 확인하세요.
다이아몬드 없이 할 수 있나요?
기본 장비로 모든 운항편에서 별 세 개를 얻을 수 있어요. 다이아몬드로는 영구 외관을 구입합니다.
준비된 차를 두 잔까지 둘 수 있어요.
차를 세 잔까지 두고, 같은 차의 접수 시간이 겹치면 같은 선착장에 두 잔을 함께 보내요.
한 번에 잔을 세 개까지 씻어요.
따뜻한 차 한 잔의 신선도를 열한 턴 동안 유지해요.
찻주전자, 잔과 선착장 등불을 달빛 법랑으로 꾸미는 영구 외관입니다.
3D 장면을 시작하지 못했습니다. 다시 시도하거나 운항편 목록으로 돌아가세요.`),words.es=e(`Abrir turno|Turnos|Equipo|Volver|Pausa|Continuar|Reintentar|Siguiente turno|Guía|Objetivo|Cómo jugar|Controles y reglas|Resultados|Juegos relacionados|Preguntas frecuentes|
Superado|Bloqueado|Listo|Progreso guardado|No se pudo guardar|Turno superado|Los ferris zarparon|Tetería del oeste|Pasarela entre niebla|Punto de control|
Turno|Paso|Pedidos|Tazas limpias|Por lavar|Bandeja de té|Ingresos|Presupuesto|Muelle oeste A|Muelle este B|Puesto oeste|Puesto central|Puesto este|Té caliente|Té de flores|Té helado|Preparar flores|Enfriar té|Lavar tazas|Conservar calor|Esperar un paso|
Abre|Zarpa|En camino|Entregado|Perdido|Próximo ferri|Puesto instalado|Reparto en marcha|Té listo|Tazas limpias|Volvieron las tazas|Pedido cobrado|El té perdió frescura|
Instala un puesto|Puesto no disponible|Estación ocupada|Lava una taza primero|Bandeja llena|Prepara té de flores|Prepara té caliente|Aún no han vuelto las tazas|Llegaría tarde|Falta el té adecuado|No disponible|
Pulsa el lugar iluminado para montar el puesto.|Pulsa Té caliente para preparar la primera taza.|Pulsa Esperar un paso para terminar el té.|Pulsa el pedido del ferri para enviar la taza.|Repetir el tutorial del primer turno|
Bandeja normal|Bandeja doble|Escurridor amplio|Caja térmica|Esmalte lunar|Equipado|Equipar|Comprar|Confirmar|Cancelar|Supera el turno|Permanente|
Saldo|Añadido a la colección|Faltan diamantes|No disponible ahora|Puesto recuperado|Trayecto|Llegada`,`Entrega las tazas necesarias antes de que zarpen los ferris.
Elige dónde montar el puesto, prepara el té y pulsa el pedido para que Nori lo lleve. Lava las tazas devueltas para volver a usarlas.
Toca los controles o usa Tab y Enter. Cada acción de servicio avanza un paso y los puestos ocupados trabajan a la vez. Vigila los horarios, el trayecto y la frescura.
Cada entrega a tiempo paga dos monedas. Cumple la meta para abrir el siguiente turno o cambia el puesto para conseguir tres estrellas.
¿Por qué no puedo enviar el té?
Comprueba el tipo de té, su frescura, si Nori está libre y la llegada prevista en el pedido.
¿Puedo jugar sin gastar diamantes?
Con el equipo normal puedes ganar tres estrellas en todos los turnos. Los diamantes desbloquean un aspecto permanente.
Permite tener dos tazas preparadas.
Permite tener tres tazas y entregar dos pedidos iguales al mismo muelle si sus horarios coinciden.
Lava hasta tres tazas a la vez.
Conserva una taza de té caliente durante once pasos.
Acabado de esmalte nacarado para tetera, tazas y luces. Se añade a la colección de forma permanente.
No se pudo abrir la escena 3D. Reintenta el turno o vuelve al mapa.`),words["pt-BR"]=e(`Abrir turno|Turnos|Equipamento|Voltar|Pausa|Continuar|Tentar de novo|Próximo turno|Guia do jogo|Objetivo|Como jogar|Controles e regras|Resultados|Jogos relacionados|Perguntas frequentes|
Concluído|Bloqueado|Pronto|Progresso salvo|Não foi possível salvar|Meta cumprida|As balsas partiram|Casa de chá do oeste|Passarela da neblina|Ponto de controle|
Turno|Passo|Pedidos|Xícaras limpas|Para lavar|Bandeja de chá|Receita|Orçamento|Cais oeste A|Cais leste B|Banca oeste|Banca central|Banca leste|Chá quente|Chá de flores|Chá gelado|Preparar chá floral|Resfriar chá|Lavar xícaras|Manter quente|Esperar um passo|
Abre|Parte|Em entrega|Entregue|Perdido|Próxima balsa|Banca montada|Entrega a caminho|Chá pronto|Xícaras lavadas|Xícaras devolvidas|Pedido pago|Chá perdeu o frescor|
Monte uma banca|Banca indisponível|Estação ocupada|Lave uma xícara antes|Bandeja cheia|Prepare chá de flores antes|Prepare chá quente antes|Ainda não há xícaras devolvidas|Chegaria tarde|Falta o chá pedido|Indisponível|
Toque no local iluminado para montar a banca.|Toque em Chá quente para preparar a primeira xícara.|Toque em Esperar um passo para terminar o chá.|Toque no pedido da balsa para enviar a xícara.|Repetir o tutorial do primeiro turno|
Bandeja normal|Bandeja dupla|Escorredor largo|Caixa térmica|Esmalte lunar|Equipado|Equipar|Comprar|Confirmar|Cancelar|Conclua o turno|Permanente|
Saldo|Adicionado à coleção|Diamantes insuficientes|Indisponível no momento|Banca restaurada|Trajeto|Chegada`,`Entregue as xícaras necessárias antes de as balsas partirem.
Escolha onde montar a banca, prepare o chá do pedido e toque na balsa para mandar Nori. Lave as xícaras devolvidas para reutilizá-las.
Toque nos controles ou use Tab e Enter. Cada ação de serviço avança um passo, e todas as estações ocupadas trabalham em paralelo. Confira horários, tempo de trajeto e frescor.
Cada pedido entregue a tempo rende duas moedas. Cumpra a meta para abrir o próximo turno ou teste outro local para buscar três estrelas.
Por que não consigo enviar o chá?
Confira o tipo de chá, o frescor, se Nori está livre e a chegada prevista no pedido.
Posso jogar sem gastar diamantes?
O equipamento básico permite ganhar três estrelas em todos os turnos. Use diamantes para adquirir um visual permanente.
Comporta duas xícaras prontas.
Comporta três xícaras e permite entregar dois pedidos iguais no mesmo cais se os horários coincidirem.
Lava até três xícaras de uma vez.
Mantém uma xícara de chá quente fresca por onze passos.
Acabamento de esmalte perolado para bule, xícaras e luminárias. Após a compra, fica na coleção permanentemente.
Não foi possível abrir a cena 3D. Repita o turno ou volte ao mapa.`),words.fr=e(`Ouvrir le service|Services|Équipement|Retour|Pause|Reprendre|Réessayer|Service suivant|Guide du jeu|Objectif|Comment jouer|Commandes et règles|Résultats|Jeux similaires|Questions fréquentes|
Terminé|Verrouillé|Prêt|Progression enregistrée|Échec de l’enregistrement|Service réussi|Les bacs sont partis|Salon de thé de l’ouest|Passerelle dans la brume|Étape clé|
Service|Tour|Commandes|Tasses propres|À laver|Plateau de thé|Recette|Budget|Quai ouest A|Quai est B|Étal ouest|Étal central|Étal est|Thé chaud|Thé fleuri|Thé glacé|Infuser des fleurs|Refroidir|Laver les tasses|Garder au chaud|Attendre un tour|
Ouvre|Départ|En route|Livré|Manqué|Prochain bac|Étal installé|Livreur en route|Thé prêt|Tasses lavées|Tasses rendues|Commande payée|Le thé a perdu sa fraîcheur|
Installez un étal|Emplacement indisponible|Poste occupé|Lavez d’abord une tasse|Plateau plein|Préparez un thé fleuri|Préparez un thé chaud|Pas encore de tasses à laver|Arrivée trop tardive|Il faut le bon thé|Indisponible|
Touchez l’emplacement éclairé pour installer l’étal.|Touchez Thé chaud pour préparer la première tasse.|Touchez Attendre un tour pour terminer l’infusion.|Touchez la commande en attente pour livrer la tasse.|Rejouer le tutoriel du premier service|
Plateau standard|Plateau double|Égouttoir large|Boîte isotherme|Émail lunaire|Équipé|Équiper|Acheter|Confirmer|Annuler|Terminez le service|Permanent|
Solde|Ajouté à la collection|Pas assez de diamants|Indisponible actuellement|Étal rétabli|Trajet|Arrivée`,`Livrez les tasses demandées avant le départ des bacs.
Choisissez un emplacement, préparez le bon thé et touchez la commande pour envoyer Nori. Lavez les tasses rendues pour les réutiliser.
Touchez les commandes ou utilisez Tab et Entrée. Chaque action de service passe un tour et les postes occupés travaillent en parallèle. Vérifiez les horaires, les trajets et la fraîcheur.
Une livraison à temps rapporte deux pièces. L’objectif ouvre le service suivant. Essayez un autre emplacement pour obtenir trois étoiles.
Pourquoi ne puis-je pas envoyer le thé ?
Vérifiez le type de thé, sa fraîcheur, la disponibilité de Nori et l’heure d’arrivée prévue.
Puis-je jouer sans dépenser de diamants ?
L’équipement standard permet les trois étoiles à tous les services. Les diamants ouvrent une apparence permanente.
Accueille deux tasses préparées.
Accueille trois tasses et livre deux commandes identiques au même quai si les horaires coïncident.
Lave jusqu’à trois tasses à la fois.
Garde une tasse de thé chaud fraîche onze tours.
Émail nacré pour la théière, les tasses et les lampes du quai. L’apparence demeure après l’achat.
Impossible d’ouvrir la scène 3D. Réessayez le service ou retournez à la carte.`),words.de=e(`Schicht beginnen|Schichten|Ausrüstung|Zurück|Pause|Fortsetzen|Erneut versuchen|Nächste Schicht|Spielanleitung|Ziel|Spielablauf|Steuerung und Regeln|Ergebnis|Ähnliche Spiele|Häufige Fragen|
Geschafft|Gesperrt|Bereit|Fortschritt gespeichert|Speichern fehlgeschlagen|Schicht geschafft|Die Fähren sind abgefahren|Teestand am Westufer|Steg im Nebel|Etappenziel|
Schicht|Takt|Bestellungen|Saubere Tassen|Zum Spülen|Teeregal|Einnahmen|Budget|Westanleger A|Ostanleger B|Stand im Westen|Stand in der Mitte|Stand im Osten|Warmer Tee|Blütentee|Eistee|Blütentee brühen|Tee kühlen|Tassen spülen|Warm halten|Einen Takt warten|
Öffnet|Abfahrt|Unterwegs|Geliefert|Verpasst|Nächste Fähre|Stand aufgebaut|Lieferung unterwegs|Tee fertig|Tassen gespült|Tassen zurück|Bestellung bezahlt|Tee nicht mehr frisch|
Baue erst einen Stand|Stand nicht verfügbar|Station belegt|Spüle zuerst eine Tasse|Teeregal voll|Brühe zuerst Blütentee|Brühe zuerst warmen Tee|Noch keine Tassen zurück|Ankunft zu spät|Passender Tee fehlt|Nicht verfügbar|
Tippe auf den leuchtenden Platz, um den Stand aufzubauen.|Tippe auf Warmen Tee, um die erste Tasse zu brühen.|Warte einen Takt, bis der Tee fertig ist.|Tippe auf die wartende Bestellung, um die Tasse zu liefern.|Anleitung der ersten Schicht wiederholen|
Standardtablett|Doppeltablett|Breites Spülgestell|Warmhaltebox|Mondemaille|Ausgerüstet|Auswählen|Kaufen|Bestätigen|Abbrechen|Schicht abschließen|Dauerhaft|
Guthaben|Zur Sammlung hinzugefügt|Zu wenige Diamanten|Derzeit nicht verfügbar|Stand wiederhergestellt|Wegzeit|Ankunft`,`Liefere die benötigten Tassen vor der Abfahrt der Fähren.
Wähle den Standplatz, brühe den richtigen Tee und tippe auf die Bestellung, damit Nori sie ausliefert. Spüle zurückgebrachte Tassen und verwende sie erneut.
Tippe oder nutze Tab und Enter. Jede Aktion rückt die Schicht um einen Takt vor. Belegte Stationen arbeiten gleichzeitig. Achte auf Fährzeiten, Wege und Frische.
Eine pünktliche Lieferung bringt zwei Münzen. Erreiche das Ziel oder probiere einen anderen Platz für drei Sterne.
Warum kann ich den Tee nicht liefern?
Prüfe Teesorte, Frische, Noris Verfügbarkeit und die angezeigte Ankunftszeit.
Kann ich ohne Diamanten spielen?
Mit der Standardausrüstung kannst du in allen Schichten drei Sterne erreichen. Diamanten schalten ein dauerhaftes Design frei.
Hält zwei fertige Tassen bereit.
Hält drei Tassen bereit und liefert zwei gleiche Bestellungen am selben Anleger, wenn sich die Zeitfenster überschneiden.
Spült bis zu drei Tassen gleichzeitig.
Hält eine Tasse warmen Tee elf Takte lang frisch.
Perlmuttfarbene Emaille für Teekanne, Tassen und Anlegerlampen. Bleibt nach dem Kauf dauerhaft in der Sammlung.
Die 3D-Szene konnte nicht starten. Versuche die Schicht erneut oder kehre zur Karte zurück.`),words.it=e(`Apri il turno|Turni|Attrezzatura|Indietro|Pausa|Riprendi|Riprova|Turno successivo|Guida|Obiettivo|Come giocare|Comandi e regole|Risultati|Giochi simili|Domande frequenti|
Completato|Bloccato|Pronto|Progresso salvato|Salvataggio fallito|Turno riuscito|I traghetti sono partiti|Sala da tè a ovest|Passerella nella nebbia|Tappa chiave|
Turno|Passo|Ordini|Tazze pulite|Da lavare|Vassoio del tè|Incasso|Budget|Molo ovest A|Molo est B|Banco a ovest|Banco al centro|Banco a est|Tè caldo|Tè ai fiori|Tè freddo|Prepara il tè ai fiori|Raffredda|Lava le tazze|Mantieni caldo|Aspetta un passo|
Apre|Parte|In consegna|Consegnato|Perso|Prossimo traghetto|Banco montato|Consegna avviata|Tè pronto|Tazze lavate|Tazze restituite|Ordine pagato|Il tè ha perso freschezza|
Monta prima il banco|Banco non disponibile|Postazione occupata|Lava prima una tazza|Vassoio pieno|Prepara prima il tè ai fiori|Prepara prima il tè caldo|Non ci sono ancora tazze da lavare|Arriverebbe tardi|Manca il tè richiesto|Non disponibile|
Tocca il posto illuminato per montare il banco.|Tocca Tè caldo per preparare la prima tazza.|Tocca Aspetta un passo perché il tè sia pronto.|Tocca l’ordine del traghetto per inviare la tazza.|Ripeti il tutorial del primo turno|
Vassoio standard|Vassoio doppio|Scolapiatti largo|Custodia termica|Smalto lunare|In uso|Equipaggia|Compra|Conferma|Annulla|Completa il turno|Permanente|
Saldo|Aggiunto alla collezione|Diamanti insufficienti|Al momento non disponibile|Banco ripristinato|Tragitto|Arrivo`,`Consegna le tazze richieste prima che partano i traghetti.
Scegli il posto per il banco, prepara il tè giusto e tocca l’ordine per mandare Nori. Lava le tazze restituite per riutilizzarle.
Tocca lo schermo o usa Tab e Invio. Ogni azione fa passare un passo e le postazioni occupate lavorano insieme. Controlla fermate, tragitti e freschezza.
Gli ordini puntuali fruttano due monete. Raggiungi l’obiettivo per aprire il turno successivo o prova un altro posto per ottenere tre stelle.
Perché non posso inviare il tè?
Controlla il tipo di tè, la freschezza, se Nori è libero e l’arrivo previsto.
Posso giocare senza spendere diamanti?
L’attrezzatura di base permette di ottenere tre stelle in ogni turno. I diamanti sbloccano un aspetto permanente.
Tiene due tazze pronte.
Tiene tre tazze pronte e consegna due ordini uguali allo stesso molo se gli orari coincidono.
Lava fino a tre tazze alla volta.
Mantiene fresca una tazza di tè caldo per undici passi.
Smalto perlato per teiera, tazze e lampade del molo. Dopo l’acquisto è tuo per sempre.
Impossibile avviare la scena 3D. Riprova il turno o torna alla mappa.`),words.ru=e(`Открыть смену|Смены|Снаряжение|Назад|Пауза|Продолжить|Повторить|Следующая смена|Справка|Цель|Как играть|Управление и правила|Результаты|Похожие игры|Частые вопросы|
Пройдено|Закрыто|Готово|Прогресс сохранён|Не удалось сохранить|Цель достигнута|Паромы ушли|Чайная на западном берегу|Туманный причал|Контрольная смена|
Смена|Ход|Заказы|Чистые чашки|На мойку|Полка для чая|Выручка|Бюджет|Западный причал A|Восточный причал B|Западная стойка|Средняя стойка|Восточная стойка|Горячий чай|Цветочный чай|Холодный чай|Заварить цветы|Охладить чай|Вымыть чашки|Сохранить тепло|Подождать ход|
Открытие|Отплытие|В пути|Доставлено|Пропущено|Следующий паром|Стойка установлена|Доставка началась|Чай готов|Чашки вымыты|Чашки вернулись|Заказ оплачен|Чай потерял свежесть|
Сначала установите стойку|Место недоступно|Станция занята|Сначала вымойте чашку|Полка заполнена|Сначала заварите цветочный чай|Сначала заварите горячий чай|Чашки ещё не вернулись|Доставка опоздает|Нужен подходящий чай|Недоступно|
Нажмите на подсвеченное место, чтобы поставить стойку.|Нажмите «Горячий чай», чтобы заварить первую чашку.|Подождите один ход, и чай будет готов.|Нажмите на заказ парома, чтобы отправить чашку.|Повторить обучение первой смены|
Обычный поднос|Двойной поднос|Широкая сушилка|Термобокс|Лунная эмаль|Выбрано|Выбрать|Купить|Подтвердить|Отмена|Завершите смену|Навсегда|
Баланс|Добавлено в коллекцию|Не хватает алмазов|Сейчас недоступно|Стойка восстановлена|Путь|Прибытие`,`Доставьте нужные чашки до отплытия паромов.
Выберите место для стойки, заварите нужный чай и нажмите на заказ, чтобы отправить Нори. Мойте вернувшиеся чашки и используйте их снова.
Нажимайте на экран или используйте Tab и Enter. Каждое действие продвигает смену на ход, занятые станции работают одновременно. Следите за расписанием, дорогой и свежестью.
За своевременную доставку дают две монеты. Выполните цель, чтобы открыть следующую смену, или смените место ради трёх звёзд.
Почему не получается отправить чай?
Проверьте вид чая, свежесть, свободен ли Нори и когда он прибудет.
Можно играть без алмазов?
Со стандартным снаряжением можно получить три звезды во всех сменах. Алмазы покупают постоянное оформление.
Вмещает две готовые чашки.
Вмещает три чашки и позволяет доставить два одинаковых заказа на один причал, если время совпадает.
Моет до трёх чашек сразу.
Сохраняет свежесть одной чашки горячего чая одиннадцать ходов.
Перламутровая эмаль для чайника, чашек и фонарей причала. Остаётся в коллекции после покупки.
Не удалось запустить трёхмерную сцену. Повторите смену или вернитесь к карте.`),words.hi=e(`पाली शुरू करें|पालियाँ|उपकरण|वापस|विराम|जारी रखें|फिर खेलें|अगली पाली|खेल की जानकारी|लक्ष्य|कैसे खेलें|नियंत्रण और नियम|नतीजे|संबंधित खेल|आम सवाल|
पूरा|बंद|तैयार|प्रगति सहेजी गई|सहेज नहीं सके|लक्ष्य पूरा|नावें जा चुकी हैं|पश्चिमी चायशाला|कोहरे का घाट|पड़ाव|
पाली|चाल|ऑर्डर|साफ प्याले|धोने के लिए|चाय की शेल्फ़|कमाई|बजट|पश्चिमी घाट A|पूर्वी घाट B|पश्चिमी दुकान|बीच की दुकान|पूर्वी दुकान|गर्म चाय|फूलों की चाय|ठंडी चाय|फूलों की चाय बनाएँ|चाय ठंडी करें|प्याले धोएँ|गर्म रखें|एक चाल रुकें|
खुलेगा|रवाना|रास्ते में|पहुँचा|छूटा|अगली नाव|दुकान लग गई|प्याला रवाना|चाय तैयार|प्याले धुल गए|प्याले वापस आए|पैसे मिले|चाय ताज़ी नहीं रही|
पहले दुकान लगाएँ|जगह उपलब्ध नहीं|यह काम चल रहा है|पहले प्याला धोएँ|शेल्फ़ भरी है|पहले फूलों की चाय बनाएँ|पहले गर्म चाय बनाएँ|कोई प्याला वापस नहीं आया|पहुँचने में देर होगी|सही चाय चाहिए|उपलब्ध नहीं|
दुकान लगाने के लिए चमकती जगह दबाएँ।|पहला प्याला बनाने के लिए गर्म चाय दबाएँ।|चाय तैयार करने के लिए एक चाल रुकें।|प्याला भेजने के लिए नाव का ऑर्डर दबाएँ।|पहली पाली का अभ्यास दोहराएँ|
साधारण ट्रे|दो प्यालों की ट्रे|चौड़ी धुलाई ट्रे|गरम रखने का डिब्बा|चाँदनी की चमक|लगा है|लगाएँ|खरीदें|पुष्टि करें|रद्द करें|पाली पूरी करें|स्थायी|
शेष|संग्रह में जुड़ा|हीरे कम हैं|अभी उपलब्ध नहीं|दुकान लौट आई|रास्ता|पहुँच`,`नाव निकलने से पहले ज़रूरी प्याले पहुँचाएँ।
दुकान की जगह चुनें, सही चाय बनाएँ और नोरी को भेजने के लिए ऑर्डर दबाएँ। वापस आए प्यालों को धोकर फिर इस्तेमाल करें।
नियंत्रण दबाएँ या Tab और Enter का उपयोग करें। हर काम से एक चाल बढ़ती है और व्यस्त जगहों पर काम साथ चलता है। नाव का समय, दूरी और चाय की ताज़गी देखें।
समय पर ऑर्डर पहुँचाने से दो सिक्के मिलते हैं। लक्ष्य पूरा करके अगली पाली खोलें या तीन तारों के लिए नई जगह आज़माएँ।
चाय क्यों नहीं भेज पा रहा हूँ?
चाय का प्रकार, ताज़गी, नोरी के खाली होने और पहुँचने का समय देखें।
क्या हीरे खर्च किए बिना खेल सकते हैं?
सामान्य उपकरण से सभी पालियों में तीन तारे मिल सकते हैं। हीरे स्थायी सजावट के लिए हैं।
दो तैयार प्याले रखता है।
तीन प्याले रखता है और एक ही समय पर एक घाट पर दो एक जैसे ऑर्डर पहुँचा सकता है।
एक बार में तीन प्याले धोता है।
एक प्याला गर्म चाय ग्यारह चालों तक ताज़ा रखता है।
केतली, प्याले और घाट की बत्तियों के लिए मोती जैसी चमक। खरीदने के बाद हमेशा संग्रह में रहती है।
3D दृश्य शुरू नहीं हुआ। पाली दोहराएँ या नक्शे पर लौटें।`),words.ar=e(`ابدأ الوردية|الورديات|المعدات|رجوع|إيقاف مؤقت|استئناف|إعادة المحاولة|الوردية التالية|دليل اللعبة|الهدف|طريقة اللعب|التحكم والقواعد|النتائج|ألعاب ذات صلة|أسئلة شائعة|
مكتملة|مقفلة|جاهزة|حُفظ التقدم|تعذر الحفظ|نجحت الوردية|غادرت العبّارات|كشك الضفة الغربية|الممشى الضبابي|محطة فاصلة|
وردية|دور|الطلبات|أكواب نظيفة|للغسل|صينية الشاي|الإيراد|الميزانية|الرصيف الغربي A|الرصيف الشرقي B|كشك الغرب|الكشك الأوسط|كشك الشرق|شاي ساخن|شاي الزهور|شاي مثلج|حضّر شاي الزهور|برّد الشاي|اغسل الأكواب|احتفظ بالحرارة|انتظر دوراً|
يفتح|يغادر|في الطريق|تم التسليم|فات الموعد|العبّارة التالية|تم تركيب الكشك|انطلق المندوب|الشاي جاهز|غُسلت الأكواب|عادت الأكواب|دُفع ثمن الطلب|فقد الشاي نضارته|
ركّب الكشك أولاً|الموقع غير متاح|المحطة مشغولة|اغسل كوباً أولاً|صينية الشاي ممتلئة|حضّر شاي الزهور أولاً|حضّر شاياً ساخناً أولاً|لم تعد أكواب للغسل بعد|سيصل متأخراً|يلزم الشاي المطلوب|غير متاح|
اضغط الموقع المضيء لتركيب الكشك.|اضغط شاي ساخن لتحضير الكوب الأول.|اضغط انتظر دوراً حتى يصبح الشاي جاهزاً.|اضغط طلب العبّارة المنتظر لإرسال الكوب.|أعد تدريب الوردية الأولى|
صينية عادية|صينية مزدوجة|رف غسل عريض|حافظة حرارية|طلاء قمري|مجهّز|جهّز|شراء|تأكيد|إلغاء|أكمل الوردية|دائم|
الرصيد|أضيف إلى المجموعة|لا يوجد ما يكفي من الألماس|غير متاح الآن|استُعيد الكشك|زمن الطريق|الوصول`,`سلّم الأكواب المطلوبة قبل مغادرة العبّارات.
اختر موقع الكشك وحضّر الشاي المناسب واضغط الطلب لإرسال نوري. اغسل الأكواب العائدة لتستخدمها من جديد.
اضغط الأزرار أو استخدم Tab وEnter. كل إجراء يقدّم دوراً واحداً وتعمل المحطات المشغولة معاً. راقب المواعيد والطريق ونضارة الشاي.
يربح كل طلب يصل في موعده قطعتين. حقق الهدف لفتح الوردية التالية أو جرّب موقعاً آخر لنيل ثلاث نجوم.
لماذا لا يمكنني إرسال الشاي؟
تحقق من نوع الشاي ونضارته وتفرغ نوري ووقت الوصول المعروض على الطلب.
هل أستطيع اللعب دون إنفاق الألماس؟
تتيح المعدات العادية ثلاث نجوم في كل الوردّيات. يشتري الألماس مظهراً دائماً.
تتسع لكوبين من الشاي الجاهز.
تتسع لثلاثة أكواب وتوصل طلبين متطابقين إلى الرصيف نفسه إذا توافقت المواعيد.
يغسل حتى ثلاثة أكواب في المرة.
يبقي كوباً ساخناً طازجاً لأحد عشر دوراً.
طلاء لؤلؤي للإبريق والأكواب ومصابيح الرصيف. يبقى في مجموعتك بعد الشراء.
تعذر تشغيل المشهد ثلاثي الأبعاد. أعد الوردية أو عد إلى الخريطة.`);
