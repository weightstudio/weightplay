var d=Object.defineProperty;var n=(i,r)=>d(i,"name",{value:r,configurable:!0});export const ROUTES=Object.freeze({en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"}),TITLE=Object.freeze({__localizedExact:!0,en:"Stamp Overprint","zh-Hant":"郵票套印","zh-Hans":"邮票套印",ja:"切手の重ね刷り",ko:"우표 겹인쇄",es:"Sellos a Dos Tintas","pt-BR":"Selos em Duas Cores",fr:"Timbres en Surimpression",de:"Briefmarken im Überdruck",it:"Francobolli a Due Inchiostri",ru:"Печать марок",hi:"डाक टिकट छपाई",ar:"طباعة الطوابع"}),DESCRIPTION=Object.freeze({__localizedExact:!0,en:"Align the plates, press each color, and keep wet ink from smearing.","zh-Hant":"對準印版、逐色壓印，避免未乾的油墨暈開。","zh-Hans":"对准印版、逐色压印，避免未干的油墨晕开。",ja:"版を合わせて色を重ね、乾く前のインクを守ろう。",ko:"판을 맞춰 색을 찍고 젖은 잉크가 번지지 않게 하세요.",es:"Alinea las planchas, estampa cada color y evita que se corra la tinta.","pt-BR":"Alinhe as chapas, imprima cada cor e evite borrar a tinta.",fr:"Alignez les plaques, imprimez chaque couleur et évitez les bavures.",de:"Richte die Platten aus, drucke jede Farbe und vermeide Schmieren.",it:"Allinea le lastre, stampa ogni colore ed evita le sbavature.",ru:"Совмещайте формы, печатайте каждый цвет и берегите свежую краску.",hi:"प्लेटें मिलाएँ, हर रंग छापें और गीली स्याही फैलने से बचाएँ।",ar:"حاذِ الألواح واطبع كل لون وتجنّب تلطّخ الحبر الرطب."}),GENRE=Object.freeze({__localizedExact:!0,en:"Simulation","zh-Hant":"模擬","zh-Hans":"模拟",ja:"シミュレーション",ko:"시뮬레이션",es:"Simulación","pt-BR":"Simulação",fr:"Simulation",de:"Simulation",it:"Simulazione",ru:"Симулятор",hi:"सिमुलेशन",ar:"محاكاة"});const t={start:"Start game",guide:"Game guide",timing:"Timing",shifts:"Shifts",gear:"Equipment",back:"Back",pause:"Pause",help:"Help",resume:"Resume",replay:"Replay first lesson",next:"Next shift",retry:"Retry",ready:"Ready",locked:"Locked",cleared:"Cleared",chapterOne:"First plates",chapterTwo:"Master press",stage:"Shift {n}",checkpoint:"Workshop test",goal:"Print {n} sound stamps",printedLabel:"Printed",paper:"Spare paper",noTimer:"Practice shift",press:"Press",light:"Light",heavy:"Heavy",either:"Either pressure",flip:"Turn plate",upright:"Upright",inverted:"Inverted",fan:"Fan",wet:"Wet ink",dry:"Dry ink",drying:"Fan dried the ink",emptyFan:"No fan charges",noWet:"Ink is already dry",layer:"Layer {a}/{b}",following:"Next",forward:"Forward pass",returning:"Wait for forward travel",aligned:"Aligned",early:"Too early",late:"Too late",moving:"Wait for the mark",wrongPlate:"Wrong plate direction",wrongPressure:"Wrong pressure",smear:"Wet ink smeared",firstInk:"First color printed",printed:"Stamp printed",timeout:"Shift ended",paperOut:"Out of spare paper",win:"Order complete",loss:"Try this shift again",practice:"Practice results are not saved.",saved:"Progress saved",unsaved:"Progress could not be saved. Retry when storage is available.",lessonTitle:"Print your first stamp",lesson:"The paper is lined up. Press once to print the first stamp.",standard:"Standard press",standardNote:"A balanced press with the original guide width.",rail:"Wide guide",railNote:"A wider alignment window.",railLock:"Clear shift 5 to unlock.",rack:"Drying rack",rackNote:"One more fan use on shifts with wet ink.",rackLock:"Clear shift 25 to unlock.",foil:"Honey-gold border",foilNote:"A gold border for your original stamps.",equip:"Equip",equipped:"Equipped",paint:"Apply",applied:"Applied",buy:"Unlock · {n} diamonds",walletError:"The wallet is unavailable.",notEnough:"Not enough diamonds.",renderer:"The workshop could not load. Retry or go back to shifts.",goalHead:"Goal",howHead:"How to play",rulesHead:"Controls and rules",finishHead:"Finishing and feedback",newsHead:"Story behind the game",related:"Related games",guideGoal:"Fill the order with correctly printed stamps before the shift ends.",guideHow:"Press as the moving mark enters the alignment window. Match the pressure and plate direction shown on the order.",guideRules:"Tap the controls or use Space to press, 1 to change pressure, 2 to turn the plate and 3 to fan. Heavy pressure smears wet ink. Wait for the ink to dry or use one of the available fan charges.",guideFinish:"Printed stamps go to the stack. A bad impression uses spare paper. Your stars depend on wasted paper and time.",news:"The Taipei world stamp exhibition opened on November 20, 2026, and featured a rare stamp with an upside-down image. That printing error inspired the plate direction and color alignment in the game.",faq1:"How do I avoid smearing the ink?",answer1:"Wait for the first color to dry, use a fan charge or use light pressure when the order allows it.",faq2:"What does the wide guide do?",answer2:"After shift 5, equip it to widen the alignment window."},c={start:"開始遊戲",guide:"遊戲指南",timing:"時機",shifts:"輪班",gear:"機具",back:"返回",pause:"暫停",help:"說明",resume:"繼續",replay:"重玩首關教學",next:"下一班",retry:"重試",ready:"可遊玩",locked:"未解鎖",cleared:"已完成",chapterOne:"初版工坊",chapterTwo:"套印大師",stage:"第 {n} 班",checkpoint:"工坊考核",goal:"印好 {n} 張郵票",printedLabel:"已印",paper:"備紙",noTimer:"練習班",press:"壓印",light:"輕壓",heavy:"重壓",either:"輕重皆可",flip:"轉版",upright:"正版",inverted:"反版",fan:"風乾",wet:"墨未乾",dry:"墨已乾",drying:"油墨已風乾",emptyFan:"風乾次數用完",noWet:"油墨已乾",layer:"第 {a}/{b} 色",following:"下一色",forward:"去程限定",returning:"等去程再印",aligned:"已對準",early:"壓得太早",late:"壓得太晚",moving:"等待對準",wrongPlate:"印版方向不符",wrongPressure:"壓力不符",smear:"濕墨暈開了",firstInk:"首色已印",printed:"郵票印好了",timeout:"輪班結束",paperOut:"備紙用完",win:"訂單完成",loss:"再試一次",practice:"練習結果不儲存。",saved:"進度已儲存",unsaved:"無法儲存進度。等儲存空間恢復後重試。",lessonTitle:"印出第一張郵票",lesson:"紙台已對準。按一下壓印，印出第一張郵票。",standard:"標準印機",standardNote:"使用原本的定位窗。",rail:"寬導板",railNote:"放寬壓印定位窗。",railLock:"完成第 5 班解鎖。",rack:"快乾架",rackNote:"有濕墨的班次多一次風乾。",rackLock:"完成第 25 班解鎖。",foil:"蜂蜜金印框",foilNote:"為原創郵票加上金邊。",equip:"裝備",equipped:"已裝備",paint:"套用",applied:"已套用",buy:"解鎖 · {n} 鑽石",walletError:"錢包暫時無法使用。",notEnough:"鑽石不足。",renderer:"工坊載入失敗。可以重試或返回輪班。",goalHead:"目標",howHead:"玩法",rulesHead:"操作和規則",finishHead:"完工與回饋",newsHead:"遊戲題材",related:"相關遊戲",guideGoal:"在輪班結束前，印出訂單要求數量的合格郵票。",guideHow:"滑動標記進入定位窗時壓印。依訂單選擇壓力和印版方向。",guideRules:"點按按鈕或按空白鍵壓印，以 1 改壓力、2 轉版、3 風乾。墨未乾時重壓會暈開，可等墨乾或用有限的風乾次數。",guideFinish:"合格成品會疊入收納區。誤印消耗備紙，廢紙和餘時影響星等。",news:"臺北世界郵展在 2026 年 11 月 20 日開幕，展出一枚圖樣倒印的珍郵。遊戲由此發展出印版方向、定位窗和逐色套印玩法。",faq1:"怎樣避免油墨暈開？",answer1:"等第一色乾透、用一次風乾，或在訂單允許時採用輕壓。",faq2:"寬導板有什麼作用？",answer2:"完成第 5 班後可裝備寬導板，放寬定位窗。"},l={en:t,"zh-Hant":c};export function word(i,r,o={}){const a=l[i]?.[r]??t[r];if(typeof a!="string")throw new Error("Missing stamp copy: "+r);return a.replace(/\{(\w+)\}/g,(s,u)=>String(o[u]??""))}n(word,"word");const p=Object.keys(t);function e(i,r){const o=r.trim().split("|").map(a=>a.trim());if(o.length!==p.length||o.some(a=>!a))throw new Error("Incomplete stamp locale: "+i);l[i]=Object.fromEntries(p.map((a,s)=>[a,o[s]]))}n(e,"install"),e("zh-Hans",`
开始游戏|游戏指南|时机|轮班|机具|返回|暂停|帮助|继续|重玩首关教学|下一班|重试|可游玩|未解锁|已完成|
初版工坊|套印大师|第 {n} 班|工坊考核|印好 {n} 张邮票|已印|备纸|练习班|压印|轻压|重压|轻重皆可|转版|正版|反版|
风干|墨未干|墨已干|油墨已风干|风干次数用完|油墨已干|第 {a}/{b} 色|下一色|限去程|等去程再印|已对准|压得太早|压得太晚|等待对准|
印版方向不符|压力不符|湿墨晕开了|首色已印|邮票印好了|轮班结束|备纸用完|订单完成|再试一次|练习结果不保存。|
进度已保存|无法保存进度。等存储空间恢复后重试。|印出第一张邮票|纸台已对准。按一下压印，印出第一张邮票。|
标准印机|使用原本的定位窗。|宽导板|放宽压印定位窗。|完成第 5 班解锁。|快干架|有湿墨的班次多一次风干。|完成第 25 班解锁。|
蜂蜜金印框|为原创邮票加上金边。|装备|已装备|应用|已应用|解锁 · {n} 钻石|钱包暂时无法使用。|钻石不足。|工坊加载失败。可以重试或返回轮班。|
目标|玩法|操作和规则|完工与反馈|游戏题材|相关游戏|
在轮班结束前，印出订单要求数量的合格邮票。|滑动标记进入定位窗时压印。按订单选择压力和印版方向。|
点击按钮或按空格键压印，以 1 改压力、2 转版、3 风干。墨未干时重压会晕开，可等墨干或用有限的风干次数。|
合格成品会叠入收纳区。误印消耗备纸，废纸和剩余时间影响星等。|
台北世界邮展在 2026 年 11 月 20 日开幕，展出一枚图样倒印的珍邮。游戏由此发展出印版方向、定位窗和逐色套印玩法。|
怎样避免油墨晕开？|等第一色干透、用一次风干，或在订单允许时采用轻压。|宽导板有什么作用？|完成第 5 班后可装备宽导板，放宽定位窗。
`),e("ja",`
ゲーム開始|遊び方|タイミング|シフト|道具|戻る|一時停止|ヘルプ|続ける|最初の練習をやり直す|次のシフト|再挑戦|開始可能|未解放|クリア済み|
初めての版|名人の印刷機|シフト {n}|工房の試験|切手を {n} 枚仕上げる|印刷済み|予備紙|練習シフト|刷る|弱い圧力|強い圧力|どちらの圧力でも可|版を回す|正位置|逆位置|
送風|乾燥中|乾燥済み|インクを乾かした|送風を使い切った|インクは乾いている|色 {a}/{b}|次の色|往路のみ|往路まで待つ|位置が合った|早すぎる|遅すぎる|位置が合うまで待つ|
版の向きが違う|圧力が違う|インクがにじんだ|最初の色を刷った|切手が完成した|シフト終了|予備紙がなくなった|注文完了|もう一度挑戦|練習結果は保存されません。|
保存しました|保存できませんでした。保存領域を確認して再試行してください。|最初の切手を刷る|紙の位置が合っています。「刷る」を押して切手を作りましょう。|
標準印刷機|標準の見当幅で印刷します。|ワイドガイド|位置合わせの範囲が広がります。|シフト 5 のクリアで解放。|乾燥ラック|乾燥が必要なシフトで送風が 1 回増えます。|シフト 25 のクリアで解放。|
はちみつ色の金枠|オリジナル切手に金色の枠を付けます。|装備する|装備済み|適用する|適用済み|解放 · ダイヤ {n} 個|ウォレットを利用できません。|ダイヤが足りません。|工房を読み込めません。再挑戦するか、シフト一覧へ戻ってください。|
目標|遊び方|操作とルール|完成と評価|ゲームの題材|関連ゲーム|
シフト終了までに、注文どおりの切手を必要な枚数だけ刷ります。|動く印が見当枠に入ったら刷ります。注文票に合わせて圧力と版の向きを変えます。|
ボタンを押すか、スペースで印刷、1 で圧力変更、2 で版を回転、3 で送風します。乾く前に強く押すとインクがにじむので、乾燥を待つか、回数制限のある送風を使います。|
完成した切手は右側に積まれ、失敗すると予備紙を消費します。星は使った予備紙と残り時間で決まります。|
2026 年 11 月 20 日に開幕した台北の世界切手展では、絵柄が逆さに刷られた珍しい切手が展示されました。版の向きや色の重ね刷りは、この印刷ミスがヒントです。|
インクのにじみを防ぐには？|最初の色が乾くのを待つか、送風します。注文で許されていれば弱い圧力でも刷れます。|ワイドガイドの効果は？|シフト 5 のクリア後に装備すると、見当枠が広がります。
`),e("ko",`
게임 시작|게임 안내|타이밍|작업 시간|장비|뒤로|일시 정지|도움말|계속|첫 연습 다시 하기|다음 작업|재시도|준비|잠김|완료|
첫 인쇄판|인쇄 장인|작업 {n}|공방 시험|우표 {n}장 인쇄|인쇄 완료|여분 종이|연습 작업|인쇄|약한 압력|강한 압력|아무 압력이나|판 돌리기|정방향|역방향|
바람 건조|젖은 잉크|마른 잉크|바람으로 말렸습니다|건조 횟수 소진|이미 말랐습니다|색 {a}/{b}|다음 색|전진할 때만|전진할 때까지 기다리세요|정렬 완료|너무 빨랐습니다|너무 늦었습니다|정렬을 기다리세요|
판 방향이 다릅니다|압력이 다릅니다|잉크가 번졌습니다|첫 색을 찍었습니다|우표를 인쇄했습니다|작업 시간 종료|여분 종이 소진|주문 완료|다시 시도하세요|연습 결과는 저장되지 않습니다.|
진행 상황을 저장했습니다|저장하지 못했습니다. 저장 공간이 생기면 다시 시도하세요.|첫 우표 인쇄|종이가 맞춰졌습니다. 인쇄 버튼을 한 번 눌러 첫 우표를 만드세요.|
기본 인쇄기|기본 정렬 범위를 사용합니다.|넓은 가이드|정렬 범위가 넓어집니다.|작업 5 완료 후 해제.|건조대|잉크를 말리는 작업에서 건조 횟수가 1회 늘어납니다.|작업 25 완료 후 해제.|
꿀빛 금테|제작한 우표에 금빛 테두리를 더합니다.|장착|장착됨|적용|적용됨|해제 · 다이아몬드 {n}개|지갑을 사용할 수 없습니다.|다이아몬드가 부족합니다.|공방을 불러오지 못했습니다. 다시 시도하거나 작업 목록으로 돌아가세요.|
목표|게임 방법|조작과 규칙|완료와 피드백|게임의 배경|관련 게임|
작업 시간이 끝나기 전에 주문에 필요한 우표를 정확히 인쇄하세요.|표시가 정렬 구간에 들어오면 인쇄하세요. 주문표에 맞게 압력과 판 방향을 바꿉니다.|
버튼을 누르거나 스페이스바로 인쇄하세요. 1은 압력 전환, 2는 판 돌리기, 3은 건조입니다. 젖은 잉크는 강한 압력에 번지니 마를 때까지 기다리거나 제한된 건조 횟수를 사용하세요.|
완성된 우표는 쌓이고, 잘못 찍으면 여분 종이를 씁니다. 버린 종이와 남은 시간으로 별을 받습니다.|
2026년 11월 20일 타이베이 세계 우표 전시회가 열려 그림이 거꾸로 인쇄된 희귀 우표가 전시되었습니다. 이 인쇄 오류에서 판 방향과 색 맞추기 아이디어를 얻었습니다.|
잉크가 번지지 않으려면? |첫 색이 마를 때까지 기다리거나 건조를 사용하세요. 주문에서 허용하면 약한 압력으로 찍어도 됩니다.|넓은 가이드는 어떤 효과가 있나요?|작업 5를 완료하고 장착하면 정렬 범위가 넓어집니다.
`),e("es",`
Jugar|Guía del juego|Ritmo|Turnos|Equipo|Volver|Pausa|Ayuda|Continuar|Repetir primera práctica|Siguiente turno|Reintentar|Disponible|Bloqueado|Completado|
Primeras planchas|Imprenta maestra|Turno {n}|Prueba de taller|Imprime {n} sellos correctos|Impresos|Papel de reserva|Turno de práctica|Estampar|Suave|Fuerte|Cualquier presión|Girar plancha|Derecha|Invertida|
Ventilar|Tinta húmeda|Tinta seca|Tinta secada con el ventilador|Sin cargas de ventilación|La tinta ya está seca|Capa {a}/{b}|Siguiente|Solo de ida|Espera a que avance|Alineado|Demasiado pronto|Demasiado tarde|Espera a alinear|
Orientación incorrecta|Presión incorrecta|La tinta se corrió|Primer color impreso|Sello impreso|Turno terminado|Sin papel de reserva|Pedido completo|Reintenta el turno|La práctica no se guarda.|
Progreso guardado|No se guardó el progreso. Reintenta cuando haya espacio.|Imprime tu primer sello|El papel está alineado. Pulsa Estampar para imprimir el primer sello.|
Prensa estándar|Usa el ancho de alineación original.|Guía ancha|Amplía la ventana de alineación.|Completa el turno 5 para desbloquearla.|Estante de secado|Una carga más en turnos con tinta húmeda.|Completa el turno 25 para desbloquearlo.|
Marco oro miel|Añade un borde dorado a tus sellos.|Equipar|Equipado|Aplicar|Aplicado|Desbloquear · {n} diamantes|La cartera no está disponible.|No tienes suficientes diamantes.|No se pudo cargar el taller. Reintenta o vuelve a los turnos.|
Objetivo|Cómo jugar|Controles y reglas|Resultados y puntuación|La historia del juego|Juegos relacionados|
Completa el pedido de sellos correctos antes de que termine el turno.|Estampa al entrar la marca en la ventana. Ajusta presión y orientación según el pedido.|
Toca los botones o usa Espacio para estampar, 1 para cambiar presión, 2 para girar y 3 para ventilar. La presión fuerte corre la tinta húmeda. Espera o usa una carga de ventilación.|
Los sellos correctos se apilan. Una mala impresión consume papel de reserva. Las estrellas dependen del papel desperdiciado y el tiempo.|
La exposición mundial de sellos de Taipéi abrió el 20 de noviembre de 2026 y mostró un sello raro con la imagen invertida. Ese error inspiró la orientación de las planchas y la alineación de los colores.|
¿Cómo evito las manchas?|Espera a que se seque el primer color, usa el ventilador o elige presión suave si lo permite el pedido.|¿Qué hace la guía ancha?|Tras el turno 5 puedes equiparla para ampliar la ventana de alineación.
`),e("pt-BR",`
Jogar|Guia do jogo|Tempo de ação|Turnos|Equipamento|Voltar|Pausa|Ajuda|Continuar|Repetir a primeira lição|Próximo turno|Tentar de novo|Disponível|Bloqueado|Concluído|
Primeiras chapas|Prensa mestra|Turno {n}|Teste da oficina|Imprima {n} selos corretos|Impressos|Papel reserva|Turno de treino|Imprimir|Leve|Forte|Qualquer pressão|Girar chapa|Normal|Invertida|
Ventilar|Tinta molhada|Tinta seca|Tinta seca pelo ventilador|Sem cargas de ventilação|A tinta já está seca|Camada {a}/{b}|Próxima|Só na ida|Espere o avanço|Alinhado|Cedo demais|Tarde demais|Espere o alinhamento|
Orientação incorreta|Pressão incorreta|A tinta borrou|Primeira cor impressa|Selo impresso|Turno encerrado|Acabou o papel reserva|Pedido completo|Tente o turno de novo|O treino não é salvo.|
Progresso salvo|Não foi possível salvar. Tente de novo quando houver espaço.|Imprima seu primeiro selo|O papel está alinhado. Toque em Imprimir para fazer seu primeiro selo.|
Prensa padrão|Usa a largura de alinhamento original.|Guia larga|Amplia a janela de alinhamento.|Conclua o turno 5 para liberar.|Estante de secagem|Uma carga a mais em turnos com tinta molhada.|Conclua o turno 25 para liberar.|
Moldura ouro-mel|Dá uma borda dourada aos seus selos.|Equipar|Equipado|Aplicar|Aplicado|Desbloquear · {n} diamantes|A carteira está indisponível.|Diamantes insuficientes.|A oficina não carregou. Tente novamente ou volte aos turnos.|
Objetivo|Como jogar|Controles e regras|Resultado e pontuação|História do jogo|Jogos relacionados|
Imprima todos os selos corretos do pedido antes do fim do turno.|Imprima quando a marca entrar na janela de alinhamento. Ajuste a pressão e a direção da chapa conforme o pedido.|
Toque nos botões ou use Espaço para imprimir, 1 para mudar a pressão, 2 para girar e 3 para ventilar. Pressão forte borra a tinta molhada. Espere secar ou use uma carga de ventilação.|
Os selos prontos são empilhados. Uma impressão errada gasta papel reserva. As estrelas dependem do desperdício e do tempo.|
A exposição mundial de selos de Taipé abriu em 20 de novembro de 2026 e exibiu um selo raro com a imagem de cabeça para baixo. O erro inspirou a orientação das chapas e o alinhamento das cores.|
Como evito borrões?|Espere a primeira cor secar, use o ventilador ou aplique pressão leve se o pedido permitir.|Para que serve a guia larga?|Equipe-a após o turno 5 para ampliar a janela de alinhamento.
`),e("fr",`
Jouer|Guide du jeu|Synchronisation|Services|Équipement|Retour|Pause|Aide|Reprendre|Rejouer la première leçon|Service suivant|Réessayer|Disponible|Verrouillé|Terminé|
Premières plaques|Presse de maître|Service {n}|Épreuve d’atelier|Imprimez {n} timbres conformes|Imprimés|Papier de réserve|Service d’entraînement|Imprimer|Légère|Forte|Pression au choix|Tourner la plaque|À l’endroit|À l’envers|
Ventiler|Encre humide|Encre sèche|Encre séchée au ventilateur|Plus de charges de ventilation|L’encre est déjà sèche|Couche {a}/{b}|Suivante|Aller seulement|Attendez l’aller|Aligné|Trop tôt|Trop tard|Attendez l’alignement|
Plaque mal orientée|Pression incorrecte|L’encre a bavé|Première couleur imprimée|Timbre imprimé|Service terminé|Réserve de papier épuisée|Commande complète|Réessayez ce service|L’entraînement n’est pas sauvegardé.|
Progression sauvegardée|Sauvegarde impossible. Réessayez lorsque l’espace de stockage sera disponible.|Imprimez votre premier timbre|Le papier est aligné. Appuyez sur Imprimer pour créer le premier timbre.|
Presse standard|Utilise la largeur de repérage normale.|Guide large|Élargit la fenêtre de repérage.|Terminez le service 5 pour le débloquer.|Claie de séchage|Une ventilation de plus durant les services avec encre humide.|Terminez le service 25 pour la débloquer.|
Cadre or miel|Ajoute une bordure dorée à vos timbres.|Équiper|Équipé|Appliquer|Appliqué|Débloquer · {n} diamants|Le portefeuille est indisponible.|Diamants insuffisants.|Chargement de l’atelier impossible. Réessayez ou revenez aux services.|
Objectif|Comment jouer|Commandes et règles|Résultat et score|L’histoire du jeu|Jeux associés|
Imprimez tous les timbres conformes de la commande avant la fin du service.|Imprimez quand le repère mobile entre dans la fenêtre. Réglez la pression et le sens de la plaque selon la commande.|
Touchez les boutons ou utilisez Espace pour imprimer, 1 pour la pression, 2 pour tourner, 3 pour ventiler. Une pression forte fait baver l’encre humide. Attendez ou utilisez une charge de ventilation.|
Les timbres conformes s’empilent. Une erreur coûte du papier de réserve. Les étoiles dépendent des pertes et du temps.|
L’exposition mondiale de philatélie de Taipei a ouvert le 20 novembre 2026 avec un timbre rare imprimé à l’envers. Ce défaut a inspiré le sens des plaques et le repérage des couleurs.|
Comment éviter les bavures ?|Attendez le séchage de la première couleur, ventilez ou choisissez une pression légère si la commande le permet.|À quoi sert le guide large ?|Équipez-le après le service 5 pour élargir la fenêtre de repérage.
`),e("de",`
Spiel starten|Spielanleitung|Timing|Schichten|Ausrüstung|Zurück|Pause|Hilfe|Fortsetzen|Erste Übung wiederholen|Nächste Schicht|Erneut versuchen|Bereit|Gesperrt|Abgeschlossen|
Erste Druckplatten|Meisterpresse|Schicht {n}|Werkstattprüfung|Drucke {n} saubere Marken|Gedruckt|Reservepapier|Übungsschicht|Drucken|Leicht|Stark|Beliebiger Druck|Platte drehen|Aufrecht|Kopfüber|
Lüften|Nasse Farbe|Trockene Farbe|Farbe trocken geblasen|Keine Lüfterladungen mehr|Die Farbe ist schon trocken|Schicht {a}/{b}|Danach|Nur auf dem Hinweg|Warte auf den Hinweg|Ausgerichtet|Zu früh|Zu spät|Warte auf die Ausrichtung|
Platte falsch herum|Falscher Druck|Farbe verschmiert|Erste Farbe gedruckt|Marke gedruckt|Schicht beendet|Kein Reservepapier mehr|Auftrag erfüllt|Versuch es erneut|Übungsergebnisse werden nicht gespeichert.|
Fortschritt gespeichert|Speichern fehlgeschlagen. Versuche es erneut, wenn Speicher frei ist.|Drucke deine erste Briefmarke|Das Papier ist ausgerichtet. Drücke einmal auf Drucken.|
Standardpresse|Das ursprüngliche Ausrichtungsfenster.|Breite Führung|Ein größeres Fenster zum Ausrichten.|Schließe Schicht 5 ab, um sie freizuschalten.|Trockengestell|Ein zusätzlicher Lüftereinsatz bei nasser Farbe.|Schließe Schicht 25 ab, um es freizuschalten.|
Honiggoldrahmen|Verpasst deinen Briefmarken einen goldenen Rand.|Anlegen|Angelegt|Anwenden|Angewendet|Freischalten · {n} Diamanten|Die Geldbörse ist nicht verfügbar.|Nicht genug Diamanten.|Die Werkstatt konnte nicht laden. Versuche es erneut oder gehe zu den Schichten.|
Ziel|Spielablauf|Steuerung und Regeln|Ergebnis und Rückmeldung|Die Geschichte zum Spiel|Ähnliche Spiele|
Drucke vor Schichtende alle fehlerfreien Marken des Auftrags.|Drucke, wenn die Markierung ins Fenster läuft. Stelle Druck und Plattenrichtung nach Auftrag ein.|
Tippe auf die Tasten oder verwende Leertaste zum Drucken, 1 für Druckstärke, 2 zum Drehen, 3 zum Lüften. Starker Druck verschmiert nasse Farbe. Warte oder nutze eine Lüfterladung.|
Gelungene Marken landen auf dem Stapel. Fehldrucke kosten Reservepapier. Sterne hängen vom Ausschuss und von der Zeit ab.|
Die Briefmarken-Weltausstellung in Taipeh wurde am 20. November 2026 eröffnet und zeigte eine seltene Marke mit einem kopfstehenden Bild. Der Fehldruck inspirierte Plattenrichtung und Farbausrichtung im Spiel.|
Wie vermeide ich verschmierte Farbe?|Lass die erste Farbe trocknen, lüfte oder drucke leicht, wenn es der Auftrag zulässt.|Was bringt die breite Führung?|Rüste sie nach Schicht 5 aus, um das Ausrichtungsfenster zu vergrößern.
`),e("it",`
Gioca|Guida al gioco|Tempismo|Turni|Attrezzatura|Indietro|Pausa|Aiuto|Riprendi|Ripeti la prima lezione|Turno successivo|Riprova|Disponibile|Bloccato|Completato|
Prime lastre|Pressa da maestro|Turno {n}|Prova di bottega|Stampa {n} francobolli corretti|Stampati|Carta di riserva|Turno di prova|Stampa|Leggera|Forte|Pressione a scelta|Gira la lastra|Dritta|Capovolta|
Ventola|Inchiostro bagnato|Inchiostro asciutto|Inchiostro asciugato|Ventola esaurita|L’inchiostro è già asciutto|Strato {a}/{b}|Poi|Solo all’andata|Attendi l’andata|Allineato|Troppo presto|Troppo tardi|Attendi l’allineamento|
Lastra orientata male|Pressione errata|Inchiostro sbavato|Primo colore stampato|Francobollo stampato|Turno concluso|Carta di riserva esaurita|Ordine completato|Riprova il turno|La prova non viene salvata.|
Progresso salvato|Salvataggio fallito. Riprova quando c’è spazio.|Stampa il tuo primo francobollo|La carta è allineata. Premi Stampa per fare il primo francobollo.|
Pressa standard|Usa la larghezza di allineamento originale.|Guida larga|Allarga la finestra di allineamento.|Completa il turno 5 per sbloccarla.|Rastrelliera di asciugatura|Una carica in più nei turni con inchiostro bagnato.|Completa il turno 25 per sbloccarla.|
Bordo oro miele|Aggiunge un bordo dorato ai francobolli.|Equipaggia|Equipaggiato|Applica|Applicato|Sblocca · {n} diamanti|Il portafoglio non è disponibile.|Diamanti insufficienti.|Impossibile caricare la bottega. Riprova o torna ai turni.|
Obiettivo|Come giocare|Comandi e regole|Risultato e punteggio|La storia del gioco|Giochi simili|
Stampa tutti i francobolli corretti dell’ordine prima che termini il turno.|Stampa quando il segno entra nella finestra. Regola pressione e verso della lastra in base all’ordine.|
Tocca i pulsanti o usa Spazio per stampare, 1 per cambiare pressione, 2 per girare e 3 per asciugare. La pressione forte fa sbavare l’inchiostro bagnato. Aspetta o usa una carica della ventola.|
I francobolli riusciti si impilano. Gli errori consumano carta di riserva. Le stelle dipendono dagli scarti e dal tempo.|
L’esposizione mondiale di francobolli di Taipei ha aperto il 20 novembre 2026 e ha mostrato un esemplare raro con l’immagine capovolta. L’errore ha ispirato l’orientamento delle lastre e l’allineamento dei colori.|
Come evito le sbavature?|Aspetta che il primo colore asciughi, usa la ventola o stampa con pressione leggera se l’ordine lo consente.|Che cosa fa la guida larga?|Equipaggiala dopo il turno 5 per allargare la finestra di allineamento.
`),e("ru",`
Начать игру|Руководство|Точный момент|Смены|Оснащение|Назад|Пауза|Помощь|Продолжить|Повторить первый урок|Следующая смена|Повторить|Доступно|Закрыто|Пройдено|
Первые формы|Мастерская печать|Смена {n}|Испытание мастерской|Напечатайте марки: {n}|Напечатано|Запас бумаги|Учебная смена|Печатать|Лёгкий нажим|Сильный нажим|Любой нажим|Повернуть форму|Прямо|Перевёрнуто|
Обдув|Мокрая краска|Сухая краска|Краска высушена|Обдув исчерпан|Краска уже высохла|Слой {a}/{b}|Далее|Только вперёд|Дождитесь движения вперёд|Совмещено|Слишком рано|Слишком поздно|Дождитесь совмещения|
Неверный поворот формы|Неверный нажим|Краска размазалась|Первый цвет нанесён|Марка напечатана|Смена окончена|Запас бумаги исчерпан|Заказ готов|Повторите смену|Учебный результат не сохраняется.|
Прогресс сохранён|Не удалось сохранить. Освободите место и повторите.|Первая марка|Бумага совмещена. Нажмите «Печатать», чтобы сделать первую марку.|
Обычный станок|Обычная ширина окна совмещения.|Широкая направляющая|Расширяет окно совмещения.|Откроется после смены 5.|Сушильная стойка|Один дополнительный обдув в сменах с мокрой краской.|Откроется после смены 25.|
Медово-золотая рамка|Печатает золотую кайму на ваших марках.|Установить|Установлено|Применить|Применено|Открыть · алмазов: {n}|Кошелёк недоступен.|Недостаточно алмазов.|Мастерская не загрузилась. Повторите или вернитесь к сменам.|
Цель|Как играть|Управление и правила|Результат и оценка|История игры|Похожие игры|
Напечатайте необходимое число марок без брака до конца смены.|Печатайте, когда метка войдёт в окно. Выбирайте нажим и положение формы по заказу.|
Нажимайте кнопки или используйте пробел для печати, 1 для нажима, 2 для поворота, 3 для обдува. Сильный нажим размазывает мокрую краску. Подождите или включите обдув.|
Готовые марки складываются в стопку. Ошибка расходует бумагу. Звёзды зависят от брака и времени.|
Всемирная выставка марок в Тайбэе открылась 20 ноября 2026 года. На ней показали редкую марку с перевёрнутым рисунком. Этот дефект подсказал идею поворота форм и совмещения цветов.|
Как избежать пятен?|Подождите, пока первый цвет высохнет, включите обдув или используйте лёгкий нажим, если он разрешён.|Что даёт широкая направляющая?|После смены 5 установите её, чтобы расширить окно совмещения.
`),e("hi",`
खेल शुरू करें|खेल की जानकारी|सही समय|पालियाँ|उपकरण|वापस|विराम|मदद|जारी रखें|पहला अभ्यास दोहराएँ|अगली पाली|फिर कोशिश करें|तैयार|बंद|पूरा|
पहली प्लेटें|कुशल छपाई|पाली {n}|कार्यशाला परीक्षा|सही टिकट छापें: {n}|छपे टिकट|अतिरिक्त कागज़|अभ्यास पाली|छापें|हल्का दबाव|भारी दबाव|कोई भी दबाव|प्लेट घुमाएँ|सीधी|उलटी|
पंखा|गीली स्याही|सूखी स्याही|पंखे ने स्याही सुखाई|पंखे का इस्तेमाल बाकी नहीं|स्याही पहले से सूखी है|परत {a}/{b}|अगली|सिर्फ आगे जाते समय|आगे बढ़ने का इंतज़ार करें|सही जगह|बहुत जल्दी|बहुत देर|सही जगह का इंतज़ार करें|
प्लेट की दिशा गलत है|दबाव गलत है|गीली स्याही फैल गई|पहला रंग छपा|टिकट छप गया|पाली खत्म|अतिरिक्त कागज़ खत्म|ऑर्डर पूरा|पाली फिर खेलें|अभ्यास का नतीजा सहेजा नहीं जाता।|
प्रगति सहेज ली गई|सहेज नहीं सके। जगह खाली होने पर फिर कोशिश करें।|पहला टिकट छापें|कागज़ सही जगह पर है। अपना पहला टिकट बनाने के लिए छापें दबाएँ।|
मानक प्रेस|मूल संरेखण सीमा का उपयोग करता है।|चौड़ा गाइड|सही जगह की सीमा बढ़ाता है।|खोलने के लिए पाली 5 पूरी करें।|सुखाने का रैक|गीली स्याही वाली पालियों में पंखे का एक अतिरिक्त उपयोग।|खोलने के लिए पाली 25 पूरी करें।|
सुनहरी किनारी|आपके टिकटों पर सुनहरी किनारी लगती है।|लगाएँ|लगा हुआ|अपनाएँ|लागू है|खोलें · {n} हीरे|बटुआ उपलब्ध नहीं है।|हीरे कम हैं।|कार्यशाला नहीं खुली। फिर कोशिश करें या पालियों पर लौटें।|
लक्ष्य|कैसे खेलें|नियंत्रण और नियम|समापन और नतीजे|खेल के पीछे की कहानी|मिलते-जुलते खेल|
पाली के खत्म होने से पहले ऑर्डर के सभी टिकट सही ढंग से छापें।|चलता निशान सही खिड़की के अंदर आए तो छापें। ऑर्डर के अनुसार दबाव और प्लेट की दिशा मिलाएँ।|
बटन दबाएँ या स्पेस से छापें, 1 से दबाव बदलें, 2 से प्लेट घुमाएँ और 3 से पंखा चलाएँ। भारी दबाव से गीली स्याही फैलती है। सूखने दें या सीमित पंखे का इस्तेमाल करें।|
ठीक छपे टिकट जमा होते हैं। गलत छपाई में अतिरिक्त कागज़ लगता है। बचे समय और बेकार कागज़ से सितारे तय होते हैं।|
ताइपे विश्व डाक टिकट प्रदर्शनी 20 नवंबर 2026 को शुरू हुई। वहाँ उलटी छपी तस्वीर वाला दुर्लभ टिकट दिखाया गया। इसी भूल से खेल की प्लेट दिशा और रंगों को मिलाने का विचार मिला।|
स्याही फैलने से कैसे रोकें?|पहले रंग को सूखने दें, पंखा चलाएँ या अनुमति होने पर हल्का दबाव रखें।|चौड़ा गाइड क्या करता है?|पाली 5 के बाद इसे लगाएँ ताकि संरेखण की सीमा बढ़ जाए।
`),e("ar",`
ابدأ اللعب|دليل اللعبة|التوقيت|الورديات|المعدات|رجوع|إيقاف مؤقت|مساعدة|متابعة|إعادة الدرس الأول|الوردية التالية|أعد المحاولة|جاهز|مقفل|مكتمل|
الألواح الأولى|المطبعة المتقنة|الوردية {n}|اختبار الورشة|اطبع طوابع سليمة: {n}|المطبوع|ورق احتياطي|وردية تدريب|اطبع|ضغط خفيف|ضغط قوي|أي ضغط|أدر اللوح|مستقيم|مقلوب|
تهوية|حبر رطب|حبر جاف|جفّ الحبر بالمروحة|نفدت مرات التهوية|الحبر جاف بالفعل|الطبقة {a}/{b}|التالي|في الذهاب فقط|انتظر حركة الذهاب|محاذاة صحيحة|مبكر جدًا|متأخر جدًا|انتظر المحاذاة|
اتجاه اللوح خطأ|ضغط غير صحيح|تلطّخ الحبر|طُبع اللون الأول|طُبع الطابع|انتهت الوردية|نفد الورق الاحتياطي|اكتمل الطلب|جرّب الوردية مجددًا|لا تُحفظ نتيجة التدريب.|
حُفظ التقدم|تعذّر الحفظ. أعد المحاولة عند توفر مساحة.|اطبع طابعك الأول|الورقة في موضعها. اضغط زر الطباعة لطباعة أول طابع.|
مطبعة قياسية|تستخدم عرض المحاذاة الأصلي.|دليل عريض|يوسّع نافذة المحاذاة.|أكمل الوردية 5 لفتحه.|رف التجفيف|تهوية إضافية في ورديات الحبر الرطب.|أكمل الوردية 25 لفتحه.|
إطار ذهبي عسلي|يضيف إطارًا ذهبيًا لطوابعك.|جهّز|مجهّز|طبّق|مطبّق|افتح · ماسات: {n}|المحفظة غير متاحة.|الماسات غير كافية.|تعذّر فتح الورشة. أعد المحاولة أو عد إلى الورديات.|
الهدف|طريقة اللعب|التحكم والقواعد|النتيجة والتقييم|القصة وراء اللعبة|ألعاب ذات صلة|
أكمل الطلب بطوابع مطبوعة جيدًا قبل انتهاء الوردية.|اطبع عندما تدخل العلامة المتحركة نافذة المحاذاة. طابق الضغط واتجاه اللوح مع الطلب.|
انقر الأزرار أو اضغط المسافة للطباعة، و1 لتغيير الضغط و2 لتدوير اللوح و3 للتهوية. الضغط القوي يلطّخ الحبر المبلل. انتظر جفافه أو استخدم المروحة المتاحة.|
تتراكم الطوابع السليمة. الطباعة الخاطئة تستهلك ورقًا احتياطيًا. يعتمد عدد النجوم على الهدر والوقت.|
افتتح معرض الطوابع العالمي في تايبيه يوم 20 نوفمبر 2026 وعرض طابعًا نادرًا بصورته المقلوبة. ألهم هذا الخطأ اتجاه الألواح ومحاذاة الألوان في اللعبة.|
كيف أمنع تلطّخ الحبر؟|انتظر جفاف اللون الأول، أو استخدم المروحة، أو خفّف الضغط إذا سمح الطلب.|ما فائدة الدليل العريض؟|جهّزه بعد الوردية 5 لتوسيع نافذة المحاذاة.
`);
