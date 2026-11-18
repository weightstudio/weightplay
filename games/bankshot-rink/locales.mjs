var c=Object.defineProperty;var t=(r,a)=>c(r,"name",{value:a,configurable:!0});export const ROUTES=Object.freeze({en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"}),TITLES=Object.freeze({en:"Bankshot Rink","zh-Hant":"折角冰球","zh-Hans":"折角冰球",ja:"バンクショット・ホッケー",ko:"뱅크샷 하키",es:"Hockey de Rebote","pt-BR":"Hóquei de Tabela",fr:"Hockey à Rebond",de:"Bandenhockey",it:"Hockey di Sponda",ru:"Хоккей от борта",hi:"बैंकशॉट हॉकी",ar:"هوكي الارتداد"}),TYPE=Object.freeze({en:"Ice hockey","zh-Hant":"冰球","zh-Hans":"冰球",ja:"アイスホッケー",ko:"아이스하키",es:"Hockey sobre hielo","pt-BR":"Hóquei no gelo",fr:"Hockey sur glace",de:"Eishockey",it:"Hockey su ghiaccio",ru:"Хоккей на льду",hi:"आइस हॉकी",ar:"هوكي الجليد"}),DESCRIPTION=Object.freeze({en:"Skate for the puck, bank it off the boards, and open timed goals before the defender closes in.","zh-Hant":"滑向冰球、借邊板折射，在守門員逼近前打開限時球門。","zh-Hans":"滑向冰球、借边板折射，在守门员逼近前打开限时球门。",ja:"パックに滑り寄り、フェンスの反射で、守備が迫る前に時間制のゴールを開こう。",ko:"퍽을 향해 스케이트를 타고, 벽에 튕겨 수비가 다가오기 전에 시간제 골문을 여세요.",es:"Patina hacia el disco y hazlo rebotar en la valla para abrir la meta antes de que llegue la defensa.","pt-BR":"Patine até o disco e use a tabela para abrir o gol antes que o defensor chegue.",fr:"Patinez vers le palet et utilisez la bande pour ouvrir le but avant que le défenseur arrive.",de:"Lauf zum Puck und nutze die Bande, um das Tor vor dem herannahenden Verteidiger zu öffnen.",it:"Pattina verso il disco e usa la sponda per aprire la porta prima che arrivi il difensore.",ru:"Подбери шайбу и отрази её от борта, чтобы открыть ворота раньше защитника.",hi:"पक तक स्केट करें और उसे बोर्ड से टकराकर रक्षक के आने से पहले गोल खोलें।",ar:"تزلج نحو القرص واعكسه عن الحاجز لفتح المرمى قبل وصول المدافع."});const n={start:"Start game",guide:"Game guide",stages:"Rinks",gear:"Sticks",next:"Next",retry:"Retry",help:"Help",back:"Back",rink:"Ice rink",pause:"Paused",resume:"Resume",replay:"Practice the opening",goals:"Goals",time:"Time",left:"Bank left",direct:"Shoot",right:"Bank right",tutorial:"Take your first shot",lesson:"Press Shoot and watch the puck enter the lit goal.",goal:"Goal!",lessonGoal:"Nice shot!",bank:"Board lit",clear:"Puck cleared",closed:"Gate blocked the puck",pickup:"Puck recovered",warning:"Intercept line!",loose:"Tap the ice to recover the puck.",open:"The goal is open.",both:"Bank off either board.",leftLive:"Bank off the lit left board.",rightLive:"Bank off the lit right board.",ready:"Skate into space and shoot.",wait:"Wait for the puck.",chapterOne:"Pine Bay",chapterTwo:"Aurora Rink",checkpoint:"Cup match",stage:"Rink {n}",goalCount:"Score {n}",locked:"Locked",readyStage:"Ready",cleared:"Cleared",won:"Match cleared",lost:"Time is up",saved:"Progress saved",unsaved:"Could not save. Try again.",practice:"Practice · Progress is kept.",restore:"Restore view",renderLost:"The ice view was interrupted.",balance:"Diamonds {n}",basic:"Classic stick",basicInfo:"Balanced pace and pickup range.",reach:"Long stick",reachInfo:"Picks up from farther away. Slower shots.",edge:"Stable blade",edgeInfo:"Resists ice drift. Slower skating.",latch:"Gate brush",latchInfo:"Holds the gate open longer. Shorter pickup range.",amber:"Amber finish",amberInfo:"Permanent amber color for your stick and skates.",stock:"Original finish",stockInfo:"Return to the original colors.",equip:"Equip",equipped:"Equipped",buy:"Buy · {n}",cancel:"Cancel",confirm:"Unlock this finish permanently?",notEnough:"You need more diamonds.",walletError:"The purchase could not be saved.",lockedAt:"Clear rink {n}",purchased:"Amber finish unlocked.",mechanic:"Bank shots",goalHead:"Goal",howHead:"How to play",ruleHead:"Controls and rules",finishHead:"Finish and rewards",related:"Related games",goalGuide:"Put the puck through the lit goal before time runs out.",howGuide:"Tap the ice to skate. When you have the puck, shoot straight or bank off either board.",controls:"Recover loose pucks by skating to them. A locked goal opens when the puck hits a lit board. On a keyboard, move with the arrow keys and shoot with 1, 2 or 3.",finishGuide:"Reach the target to unlock the next rink. Finish quickly with fewer turnovers for more stars.",faq1:"When should I bank a shot?",ans1:"Aim at a lit board when the gate is shut or a defender is in the direct line.",faq2:"How do I get the puck back?",ans2:"Tap ahead of the loose puck to meet it as it slows."},d={start:"開始遊戲",guide:"遊戲指南",stages:"冰場",gear:"球桿",next:"下一場",retry:"重試",help:"說明",back:"返回",rink:"冰球場",pause:"暫停",resume:"繼續",replay:"練習開局",goals:"進球",time:"時間",left:"左碰板",direct:"直射",right:"右碰板",tutorial:"打進第一球",lesson:"按「直射」，看冰球滑進亮起的球門。",goal:"進球！",lessonGoal:"漂亮！",bank:"邊板亮起",clear:"對手清球",closed:"冰球撞上門板",pickup:"搶回冰球",warning:"對手要攔球！",loose:"點冰面滑去追回冰球。",open:"球門開著。",both:"射向任一側亮板。",leftLive:"射向左側亮板。",rightLive:"射向右側亮板。",ready:"滑到空位再射。",wait:"等冰球回到可控範圍。",chapterOne:"松灣冰棚",chapterTwo:"極光冰棚",checkpoint:"盃賽",stage:"冰場 {n}",goalCount:"攻進 {n} 球",locked:"尚未解鎖",readyStage:"可上場",cleared:"已通過",won:"成功過關",lost:"時間到",saved:"進度已保存",unsaved:"無法儲存，請重試。",practice:"練習中，保留原進度。",restore:"恢復畫面",renderLost:"冰場畫面暫時中斷。",balance:"鑽石 {n}",basic:"標準球桿",basicInfo:"射速與撿球範圍均衡。",reach:"長桿",reachInfo:"可在較遠處撿球，射速較慢。",edge:"穩刃",edgeInfo:"抵消冰面偏轉，滑行稍慢。",latch:"開閘刷",latchInfo:"球門開更久，撿球範圍較短。",amber:"琥珀刀紋",amberInfo:"永久更換球桿與滑刃的琥珀色。",stock:"原色",stockInfo:"換回原有配色。",equip:"裝備",equipped:"已裝備",buy:"購買 · {n}",cancel:"取消",confirm:"要永久解鎖這款外觀嗎？",notEnough:"鑽石不足。",walletError:"購買結果無法儲存。",lockedAt:"通過第 {n} 場",purchased:"已解鎖琥珀刀紋。",mechanic:"反彈射門",goalHead:"目標",howHead:"怎麼玩",ruleHead:"操作與規則",finishHead:"結算與獎勵",related:"相關遊戲",goalGuide:"時間結束前，把冰球送進亮起的球門。",howGuide:"點冰面滑行。持球後直射，或借左、右邊板反彈。",controls:"滑向自由球可追回。球撞亮板會打開閉門。用鍵盤方向鍵移動，按 1、2、3 出手。",finishGuide:"達成進球目標可解鎖下一場。用時短、失球少可多拿星。",faq1:"什麼時候要借板？",ans1:"球門關閉或對手擋在正面時，射往亮起的邊板。",faq2:"冰球怎麼追回來？",ans2:"點在冰球滑行路線前方，等它減速時接回。"},s=Object.keys(n);function e(r){const a=r.trim().split(/[|\n]/).map(i=>i.trim());if(a.length!==s.length)throw new Error("Rink translation has "+a.length+" fields; expected "+s.length);return Object.fromEntries(s.map((i,o)=>[i,a[o]]))}t(e,"translations");const u={en:n,"zh-Hant":d,"zh-Hans":e(`
开始游戏|游戏指南|冰场|球杆|下一场|重试
帮助|返回|冰球场|暂停|继续|练习开局
进球|时间|左碰板|直射|右碰板
打进第一球|按“直射”，看冰球滑进亮起的球门。
进球！|漂亮！|边板亮起|对手清球|冰球撞上门板
抢回冰球|对手要拦球！|点冰面滑去追回冰球。
球门开着。|射向任一侧亮板。|射向左侧亮板。
射向右侧亮板。|滑到空位再射。|等冰球回到可控范围。
松湾冰棚|极光冰棚|杯赛|冰场 {n}
攻进 {n} 球|尚未解锁|可上场|已通过|成功过关
时间到|进度已保存|无法保存，请重试。
练习中，保留原进度。|恢复画面|冰场画面暂时中断。
钻石 {n}|标准球杆|射速与捡球范围均衡。
长杆|可在较远处捡球，射速较慢。
稳刃|抵消冰面偏转，滑行稍慢。
开闸刷|球门开得更久，捡球范围较小。
琥珀刀纹|永久更换球杆与滑刃的琥珀色。
原色|换回原有配色。
装备|已装备|购买 · {n}|取消|要永久解锁这款外观吗？
钻石不足。|购买结果无法保存。
通过第 {n} 场|已解锁琥珀刀纹。
反弹射门|目标|怎么玩|操作与规则
结算与奖励|相关游戏
时间结束前，把冰球送进亮起的球门。
点冰面滑行。持球后直射，或借左、右边板反弹。
滑向自由球可追回。冰球撞亮板会打开闭门。用键盘方向键移动，按 1、2、3 出手。
达成进球目标可解锁下一场。用时短、失球少可多拿星。
什么时候要借板？|球门关闭或对手挡在正面时，射往亮起的边板。
冰球怎么追回来？|点在冰球滑行路线前方，等它减速时接回。`),ja:e(`
ゲーム開始|プレイガイド|リンク|スティック|次へ|もう一度
ヘルプ|戻る|アイスリンク|一時停止|再開|最初の練習
ゴール|時間|左に反射|シュート|右に反射
最初のシュート|シュートを押して、光るゴールに入れよう。
ゴール！|ナイス！|ボード点灯|パックをはじかれた|ゲートに止められた
パック回収|相手がパックを狙う！|氷をタップしてパックを拾おう。
ゴールが開いています。|左右どちらかのボードに当てよう。|左の光るボードに当てよう。
右の光るボードに当てよう。|空いている位置からシュート。|パックが近づくまで待とう。
松の入り江|オーロラリンク|カップ戦|リンク {n}
{n} ゴール決める|未解放|挑戦可能|クリア済み|クリア
時間切れ|進行を保存しました|保存できません。もう一度試してください。
練習中です。進行はそのままです。|画面を復旧|リンクの描画が中断されました。
ダイヤ {n}|標準スティック|速さと回収範囲のバランス型。
ロングスティック|遠くのパックを拾えるが、シュートは遅い。
安定ブレード|氷の偏りを抑えるが、滑る速さは低い。
ゲートブラシ|開門が長く続くが、回収範囲が狭い。
琥珀の仕上げ|スティックとスケートを琥珀色にできる外観。
標準カラー|元の色に戻す。
装備|装備中|購入 · {n}|キャンセル|この外観を永久に解放しますか？
ダイヤが足りません。|購入を保存できませんでした。
リンク {n} をクリア|琥珀の仕上げを解放しました。
反射シュート|目標|遊び方|操作とルール
結果と報酬|関連ゲーム
時間内に、光るゴールへパックを入れよう。
氷をタップして滑ろう。パックを持ったら、直射か左右のボードを使った反射で狙う。
パックを失ったら滑って拾う。閉じたゲートは光るボードにパックを当てると開く。矢印キーで移動、1・2・3 でシュート。
目標数を決めると次のリンクが解放される。短時間でパックを失わずに決めると星が増える。
反射させるのはいつ？|ゲートが閉じているときや、正面を守られているときは光るボードを狙う。
パックを取り戻すには？|滑るパックの少し先をタップし、減速したところを拾う。`),ko:e(`
게임 시작|게임 안내|링크|스틱|다음|다시 시도
도움말|뒤로|아이스링크|일시 정지|계속|첫 슛 연습
골|시간|왼쪽 반사|슛|오른쪽 반사
첫 슛을 쏘세요|슛을 눌러 퍽이 빛나는 골문에 들어가는 걸 보세요.
골!|좋은 슛!|보드 점등|퍽을 빼앗겼어요|골문에 막혔어요
퍽을 되찾았어요|수비수가 퍽을 노려요!|얼음을 눌러 퍽을 되찾으세요.
골문이 열려 있어요.|양쪽 중 한 보드에 퍽을 튕기세요.|빛나는 왼쪽 보드에 튕기세요.
빛나는 오른쪽 보드에 튕기세요.|빈 곳으로 스케이트를 타고 슛하세요.|퍽이 돌아올 때까지 기다리세요.
소나무 만|오로라 링크|컵 경기|링크 {n}
{n}골 넣기|잠김|도전 가능|완료|경기 완료
시간 초과|진행 상황을 저장했어요|저장하지 못했어요. 다시 시도하세요.
연습 중에도 진행 상황은 유지돼요.|화면 복구|링크 화면이 중단됐어요.
다이아몬드 {n}|기본 스틱|슛 속도와 퍽 회수 범위가 균형을 이뤄요.
긴 스틱|멀리서 퍽을 줍지만 슛이 느려요.
안정 블레이드|빙판 쏠림을 막지만 스케이트가 느려요.
골문 브러시|골문을 더 오래 열지만 퍽을 가까이서만 주워요.
호박색 마감|스틱과 스케이트에 입히는 영구 호박색 외형이에요.
기본 색상|처음 색상으로 되돌려요.
장착|장착됨|구매 · {n}|취소|이 외형을 영구적으로 해금할까요?
다이아몬드가 부족해요.|구매를 저장하지 못했어요.
링크 {n} 완료|호박색 마감을 해금했어요.
반사 슛|목표|게임 방법|조작과 규칙
결과와 보상|관련 게임
시간이 다 되기 전에 빛나는 골문에 퍽을 넣으세요.
얼음을 눌러 스케이트를 타세요. 퍽을 잡으면 직진 슛이나 좌우 보드 반사 슛을 쏘세요.
퍽을 놓치면 미끄러져 가서 주우세요. 빛나는 보드에 맞히면 닫힌 골문이 열려요. 방향키로 이동하고 1, 2, 3으로 슛하세요.
목표 득점을 달성하면 다음 링크가 열려요. 빠르게 끝내고 퍽을 덜 빼앗기면 별을 더 받아요.
언제 반사 슛을 해야 하나요?|골문이 닫혔거나 정면에 수비수가 있으면 빛나는 보드를 겨냥하세요.
퍽을 어떻게 되찾나요?|미끄러지는 퍽 앞쪽을 눌러 속도가 줄 때 받아내세요.`),es:e(`
Jugar|Guía del juego|Pistas|Palos|Siguiente|Reintentar
Ayuda|Volver|Pista de hielo|Pausa|Continuar|Practicar el inicio
Goles|Tiempo|Rebote izq.|Disparar|Rebote der.
Haz tu primer tiro|Pulsa Disparar y mira cómo entra el disco en la meta iluminada.
¡Gol!|¡Buen tiro!|Valla activada|Disco despejado|La compuerta bloqueó el disco
Disco recuperado|¡Van a interceptar!|Toca el hielo para recuperar el disco.
La meta está abierta.|Rebota el disco en cualquiera de las dos vallas.|Usa la valla iluminada de la izquierda.
Usa la valla iluminada de la derecha.|Busca un hueco y dispara.|Espera a recuperar el disco.
Bahía de Pinos|Pista Aurora|Partido de copa|Pista {n}
Marca {n} goles|Bloqueada|Lista|Superada|Partido superado
Se acabó el tiempo|Progreso guardado|No se pudo guardar. Inténtalo de nuevo.
Práctica. Tu progreso se conserva.|Restaurar vista|Se interrumpió la vista de la pista.
Diamantes {n}|Palo clásico|Equilibrio entre velocidad y alcance.
Palo largo|Alcanza el disco desde más lejos, pero dispara más despacio.
Cuchilla estable|Resiste el desvío del hielo, pero patina más despacio.
Cepillo de compuerta|Mantiene la meta abierta más tiempo. Menos alcance.
Acabado ámbar|Color ámbar permanente para el palo y los patines.
Acabado original|Recupera los colores originales.
Equipar|Equipado|Comprar · {n}|Cancelar|¿Desbloquear este acabado de forma permanente?
Necesitas más diamantes.|No se pudo guardar la compra.
Supera la pista {n}|Acabado ámbar desbloqueado.
Tiros de rebote|Objetivo|Cómo jugar|Controles y reglas
Resultados y recompensas|Juegos relacionados
Mete el disco en la meta iluminada antes de que acabe el tiempo.
Toca el hielo para patinar. Con el disco, dispara recto o hazlo rebotar a izquierda o derecha.
Patina hacia el disco suelto para recuperarlo. Una meta cerrada se abre al tocar una valla iluminada. Usa las flechas y dispara con 1, 2 o 3.
Alcanza la meta de goles para abrir la siguiente pista. Acaba rápido y pierde menos discos para ganar más estrellas.
¿Cuándo uso un tiro de rebote?|Apunta a una valla iluminada si la compuerta está cerrada o si alguien te tapa el tiro.
¿Cómo recupero el disco?|Toca un punto delante del disco suelto para alcanzarlo cuando pierda velocidad.`),"pt-BR":e(`
Jogar|Guia do jogo|Pistas|Tacos|Próxima|Tentar de novo
Ajuda|Voltar|Pista de gelo|Pausa|Continuar|Treinar o início
Gols|Tempo|Tabela esq.|Chutar|Tabela dir.
Dê o primeiro chute|Toque em Chutar e veja o disco entrar no gol iluminado.
Gol!|Belo chute!|Tabela ativada|Disco afastado|A comporta bloqueou o disco
Disco recuperado|Vão interceptar!|Toque no gelo para recuperar o disco.
O gol está aberto.|Use a tabela de qualquer lado.|Use a tabela iluminada da esquerda.
Use a tabela iluminada da direita.|Patine para um espaço livre e chute.|Espere o disco voltar.
Baía dos Pinheiros|Pista Aurora|Jogo da copa|Pista {n}
Marque {n} gols|Bloqueada|Pronta|Concluída|Partida vencida
O tempo acabou|Progresso salvo|Não foi possível salvar. Tente de novo.
Treino. Seu progresso está protegido.|Restaurar imagem|A imagem da pista foi interrompida.
Diamantes {n}|Taco clássico|Velocidade e alcance equilibrados.
Taco longo|Recupera o disco de mais longe, mas chuta mais devagar.
Lâmina firme|Resiste ao desvio do gelo, mas patina mais devagar.
Escova de comporta|Deixa o gol aberto por mais tempo. Menor alcance.
Acabamento âmbar|Cor âmbar permanente para o taco e os patins.
Acabamento original|Volte às cores de fábrica.
Equipar|Equipado|Comprar · {n}|Cancelar|Desbloquear este acabamento permanentemente?
Você precisa de mais diamantes.|Não foi possível salvar a compra.
Conclua a pista {n}|Acabamento âmbar desbloqueado.
Chutes de tabela|Objetivo|Como jogar|Controles e regras
Resultado e recompensas|Jogos relacionados
Mande o disco para o gol iluminado antes que o tempo acabe.
Toque no gelo para patinar. Com o disco, chute reto ou use a tabela de um dos lados.
Patine até o disco solto para recuperá-lo. A comporta fechada abre quando o disco bate na tabela acesa. Use as setas para mover e 1, 2 ou 3 para chutar.
Cumpra a meta para liberar a próxima pista. Termine rápido e perca menos discos para ganhar mais estrelas.
Quando devo chutar de tabela?|Mire na tabela acesa se a comporta estiver fechada ou se um defensor bloquear o caminho.
Como recupero o disco?|Toque à frente do disco solto para encontrá-lo quando desacelerar.`),fr:e(`
Jouer|Guide du jeu|Patinoires|Crosses|Suivant|Réessayer
Aide|Retour|Patinoire|Pause|Reprendre|Rejouer l’entraînement
Buts|Temps|Rebond gauche|Tirer|Rebond droite
Premier tir|Appuyez sur Tirer et regardez le palet entrer dans le but éclairé.
But !|Beau tir !|Bande activée|Palet dégagé|Palet bloqué par la porte
Palet récupéré|Interception imminente !|Touchez la glace pour récupérer le palet.
Le but est ouvert.|Faites rebondir le palet sur l’une des bandes.|Visez la bande éclairée à gauche.
Visez la bande éclairée à droite.|Patinez dans un espace libre et tirez.|Attendez de récupérer le palet.
Baie des Pins|Patinoire Aurore|Match de coupe|Patinoire {n}
Marquer {n} buts|Verrouillée|Prête|Terminée|Match réussi
Temps écoulé|Progression enregistrée|Échec de la sauvegarde. Réessayez.
Entraînement. Votre progression est conservée.|Rétablir l’image|L’affichage de la patinoire a été interrompu.
Diamants {n}|Crosse classique|Vitesse et portée bien équilibrées.
Crosse longue|Récupère le palet de plus loin, mais tire moins vite.
Lame stable|Résiste à la dérive, mais patine plus lentement.
Brosse de porte|Garde le but ouvert plus longtemps. Portée plus courte.
Finition ambrée|Teinte ambrée permanente pour la crosse et les patins.
Finition d’origine|Rétablit les couleurs initiales.
Équiper|Équipé|Acheter · {n}|Annuler|Débloquer cette finition définitivement ?
Il vous faut plus de diamants.|Impossible d’enregistrer cet achat.
Terminer la patinoire {n}|Finition ambrée débloquée.
Tirs en rebond|Objectif|Comment jouer|Commandes et règles
Résultat et récompenses|Jeux similaires
Envoyez le palet dans le but éclairé avant la fin du chrono.
Touchez la glace pour patiner. En possession du palet, tirez droit ou faites-le rebondir sur une bande.
Patinez vers le palet libre pour le récupérer. Un but fermé s’ouvre quand le palet touche une bande éclairée. Déplacez-vous avec les flèches et tirez avec 1, 2 ou 3.
Atteignez le nombre de buts demandé pour ouvrir la patinoire suivante. Un match rapide avec peu de pertes de palet rapporte plus d’étoiles.
Quand tirer en rebond ?|Visez une bande éclairée quand la porte est fermée ou qu’un défenseur bloque le tir direct.
Comment récupérer le palet ?|Touchez la glace un peu devant le palet pour le rejoindre quand il ralentit.`),de:e(`
Spiel starten|Spielanleitung|Eisbahnen|Schläger|Weiter|Erneut
Hilfe|Zurück|Eisbahn|Pause|Fortsetzen|Eröffnung üben
Tore|Zeit|Linke Bande|Schießen|Rechte Bande
Dein erster Schuss|Drück auf Schießen und sieh zu, wie der Puck ins leuchtende Tor gleitet.
Tor!|Guter Schuss!|Bande leuchtet|Puck weggeschlagen|Schuss am Tor blockiert
Puck zurückgeholt|Der Gegner fängt ab!|Tippe aufs Eis, um den Puck zu holen.
Das Tor ist offen.|Nutze eine der beiden Banden.|Spiele über die linke leuchtende Bande.
Spiele über die rechte leuchtende Bande.|Lauf dich frei und schieß.|Warte, bis du den Puck wieder hast.
Kiefernbucht|Aurora-Eisbahn|Pokalspiel|Eisbahn {n}
Schieße {n} Tore|Gesperrt|Bereit|Geschafft|Spiel gewonnen
Zeit abgelaufen|Fortschritt gespeichert|Speichern fehlgeschlagen. Versuch es erneut.
Training. Dein Fortschritt bleibt erhalten.|Ansicht wiederherstellen|Die Ansicht wurde unterbrochen.
Diamanten {n}|Klassischer Schläger|Ausgewogenes Tempo und gute Reichweite.
Langer Schläger|Holt den Puck aus größerer Distanz. Langsamere Schüsse.
Stabile Kufe|Schützt vor Abrutschen. Langsameres Laufen.
Torbesen|Hält das Tor länger offen. Kürzere Reichweite.
Bernsteinoptik|Dauerhafte Bernsteinfarbe für Schläger und Kufen.
Originalfarben|Stellt die ursprünglichen Farben wieder her.
Ausrüsten|Ausgerüstet|Kaufen · {n}|Abbrechen|Diese Optik dauerhaft freischalten?
Du brauchst mehr Diamanten.|Der Kauf konnte nicht gespeichert werden.
Schaffe Eisbahn {n}|Bernsteinoptik freigeschaltet.
Bandenschüsse|Ziel|Spielablauf|Steuerung und Regeln
Ergebnis und Belohnungen|Ähnliche Spiele
Schieß den Puck ins beleuchtete Tor, bevor die Zeit abläuft.
Tippe auf das Eis, um zu laufen. Mit dem Puck kannst du geradeaus oder über eine Bande schießen.
Lauf zu einem freien Puck, um ihn aufzunehmen. Trifft er eine leuchtende Bande, öffnet sich das geschlossene Tor. Die Pfeiltasten bewegen dich, 1, 2 oder 3 lösen einen Schuss aus.
Mit genug Toren schaltest du die nächste Bahn frei. Je schneller du bist und je seltener du den Puck verlierst, desto mehr Sterne bekommst du.
Wann ist ein Bandenschuss sinnvoll?|Ziel auf eine leuchtende Bande, wenn das Tor zu ist oder ein Gegner die direkte Linie blockiert.
Wie hole ich den Puck zurück?|Tippe etwas vor den freien Puck, damit du ihn erreichst, wenn er langsamer wird.`),it:e(`
Gioca|Guida al gioco|Piste|Mazze|Avanti|Riprova
Aiuto|Indietro|Pista di ghiaccio|Pausa|Riprendi|Allenati all’inizio
Gol|Tempo|Sponda sinistra|Tira|Sponda destra
Fai il primo tiro|Premi Tira e guarda il disco entrare nella porta illuminata.
Gol!|Bel tiro!|Sponda attivata|Disco respinto|La barriera ha fermato il disco
Disco recuperato|Intercetto in arrivo!|Tocca il ghiaccio per riprendere il disco.
La porta è aperta.|Fai rimbalzare il disco su una delle due sponde.|Usa la sponda illuminata a sinistra.
Usa la sponda illuminata a destra.|Pattina in uno spazio libero e tira.|Aspetta di riprendere il disco.
Baia dei Pini|Pista Aurora|Partita di coppa|Pista {n}
Segna {n} gol|Bloccata|Disponibile|Completata|Partita superata
Tempo scaduto|Progressi salvati|Salvataggio non riuscito. Riprova.
Allenamento. I progressi sono al sicuro.|Ripristina la vista|La vista della pista è stata interrotta.
Diamanti {n}|Mazza classica|Velocità e raggio di recupero bilanciati.
Mazza lunga|Recupera il disco da più lontano, ma tira più piano.
Lama stabile|Resiste alla deriva, ma riduce la velocità di pattinaggio.
Spazzola apriporta|Mantiene la porta aperta più a lungo. Raggio più corto.
Finitura ambra|Colore ambra permanente per mazza e pattini.
Finitura originale|Ripristina i colori iniziali.
Equipaggia|Equipaggiato|Compra · {n}|Annulla|Sbloccare questa finitura per sempre?
Ti servono altri diamanti.|Non è stato possibile salvare l’acquisto.
Completa la pista {n}|Finitura ambra sbloccata.
Tiri di sponda|Obiettivo|Come si gioca|Comandi e regole
Risultato e ricompense|Giochi simili
Manda il disco nella porta illuminata prima che scada il tempo.
Tocca il ghiaccio per pattinare. Quando hai il disco, tira dritto o di sponda a destra o sinistra.
Pattina verso il disco libero per riprenderlo. Se il disco colpisce una sponda accesa apre la porta. Usa le frecce per muoverti e 1, 2 o 3 per tirare.
Raggiungi il numero di gol richiesto per sbloccare la pista successiva. Se sei veloce e perdi pochi dischi, ottieni più stelle.
Quando conviene tirare di sponda?|Mira alla sponda accesa se la porta è chiusa o il difensore blocca il tiro diretto.
Come riprendo il disco?|Tocca un punto oltre il disco libero per raggiungerlo mentre rallenta.`),ru:e(`
Начать игру|Руководство|Катки|Клюшки|Далее|Повторить
Помощь|Назад|Ледовый каток|Пауза|Продолжить|Тренировать начало
Голы|Время|Левый борт|Бросок|Правый борт
Первый бросок|Нажмите «Бросок», чтобы отправить шайбу в подсвеченные ворота.
Гол!|Отличный бросок!|Борт активирован|Шайбу отбили|Заслонка остановила шайбу
Шайба возвращена|Соперник перехватывает!|Нажмите на лёд, чтобы подобрать шайбу.
Ворота открыты.|Пустите шайбу от любого борта.|Бросьте в подсвеченный левый борт.
Бросьте в подсвеченный правый борт.|Выкатитесь на свободное место и бросайте.|Дождитесь шайбы.
Сосновая бухта|Каток «Аврора»|Матч на кубок|Каток {n}
Забейте {n}|Закрыто|Готово|Пройдено|Матч пройден
Время вышло|Прогресс сохранён|Не удалось сохранить. Повторите попытку.
Тренировка. Прогресс не изменится.|Восстановить вид|Изображение катка прервано.
Алмазы {n}|Классическая клюшка|Обычная скорость и дальность подбора.
Длинная клюшка|Позволяет подобрать шайбу издалека. Бросок медленнее.
Устойчивое лезвие|Защищает от смещения на льду, но замедляет бег.
Воротная щётка|Дольше держит ворота открытыми. Меньшая дальность.
Янтарное покрытие|Постоянный янтарный цвет клюшки и коньков.
Исходный цвет|Возвращает исходные цвета.
Выбрать|Выбрано|Купить · {n}|Отмена|Открыть это покрытие навсегда?
Не хватает алмазов.|Не удалось сохранить покупку.
Пройдите каток {n}|Янтарное покрытие открыто.
Броски от борта|Цель|Как играть|Управление и правила
Итоги и награды|Похожие игры
Отправьте шайбу в подсвеченные ворота до конца времени.
Нажмите на лёд, чтобы поехать. С шайбой можно бросить прямо или пустить её от любого борта.
Подъедьте к свободной шайбе, чтобы подобрать её. Ворота откроются, если шайба попадёт в подсвеченный борт. Двигайтесь стрелками и бросайте клавишами 1, 2 или 3.
Забейте нужное число голов, чтобы открыть следующий каток. Быстрая игра без потерь приносит больше звёзд.
Когда бросать от борта?|Цельтесь в подсвеченный борт, когда ворота закрыты или соперник перекрывает прямой путь.
Как вернуть шайбу?|Нажмите чуть впереди шайбы, чтобы встретить её, когда она замедлится.`),hi:e(`
खेल शुरू करें|खेल मार्गदर्शिका|रिंक|स्टिक|अगला|फिर खेलें
मदद|वापस|बर्फ का रिंक|रुका हुआ|जारी रखें|शुरुआत का अभ्यास
गोल|समय|बायाँ बोर्ड|शॉट|दायाँ बोर्ड
पहला शॉट लगाएँ|शॉट दबाएँ और पक को रोशन गोल में जाते देखें।
गोल!|बढ़िया शॉट!|बोर्ड जगमगा उठा|पक दूर कर दिया गया|फाटक ने पक रोक दिया
पक वापस मिला|रक्षक रोकने आ रहा है!|पक वापस पाने के लिए बर्फ को छुएँ।
गोल खुला है।|पक किसी भी तरफ़ के बोर्ड से उछालें।|बाएँ रोशन बोर्ड पर शॉट लगाएँ।
दाएँ रोशन बोर्ड पर शॉट लगाएँ।|खाली जगह में स्केट करके शॉट लगाएँ।|पक वापस मिलने की प्रतीक्षा करें।
चीड़ की खाड़ी|ऑरोरा रिंक|कप मैच|रिंक {n}
{n} गोल करें|बंद|तैयार|पूरा|मैच पूरा
समय समाप्त|प्रगति सहेज ली गई|सहेज नहीं सके। दोबारा कोशिश करें।
अभ्यास में प्रगति सुरक्षित है।|दृश्य बहाल करें|रिंक का दृश्य बाधित हुआ।
हीरे {n}|क्लासिक स्टिक|गति और पक उठाने की दूरी संतुलित।
लंबी स्टिक|पक दूर से उठाती है, मगर शॉट धीमा है।
स्थिर ब्लेड|बर्फ की तरफ़ मुड़ने से बचाता है, मगर स्केटिंग धीमी है।
फाटक ब्रश|गोल को ज़्यादा देर खुला रखता है। पकड़ की दूरी कम है।
अंबर रंग|स्टिक और स्केट्स का स्थायी अंबर रंग।
मूल रंग|मूल रंग फिर लगाएँ।
लगाएँ|लगा हुआ|खरीदें · {n}|रद्द करें|यह रंग हमेशा के लिए खोलें?
कुछ और हीरे चाहिए।|खरीद सहेजी नहीं जा सकी।
रिंक {n} पूरा करें|अंबर रंग खुल गया।
बोर्ड से शॉट|लक्ष्य|कैसे खेलें|नियंत्रण और नियम
नतीजा और पुरस्कार|मिलते-जुलते खेल
समय से पहले पक को रोशन गोल में पहुँचाएँ।
स्केट करने के लिए बर्फ छुएँ। पक मिलने पर सीधा शॉट लगाएँ या किसी भी बोर्ड से उछालें।
छूटे पक की ओर स्केट करके उसे वापस लें। पक रोशन बोर्ड से टकराए तो बंद गोल खुलता है। तीर कुंजियों से चलें और 1, 2 या 3 से शॉट लगाएँ।
अगला रिंक खोलने के लिए लक्ष्य पूरा करें। जल्दी मैच पूरा करने और कम बार पक खोने से अधिक तारे मिलते हैं।
बोर्ड से शॉट कब लगाऊँ?|गोल बंद हो या रक्षक सामने हो तो रोशन बोर्ड की तरफ़ निशाना लगाएँ।
पक वापस कैसे मिलेगी?|पक के आगे बर्फ छुएँ और धीमी पड़ने पर उसे पकड़ें।`),ar:e(`
ابدأ اللعب|دليل اللعبة|الحلبات|العصي|التالي|أعد المحاولة
مساعدة|رجوع|حلبة الجليد|إيقاف مؤقت|استئناف|تدرّب على البداية
الأهداف|الوقت|ارتداد يسارًا|سدّد|ارتداد يمينًا
التسديدة الأولى|اضغط «سدّد» وشاهد القرص يدخل المرمى المضاء.
هدف!|تسديدة جميلة!|أضاء الحاجز|أُبعد القرص|أوقف الحاجز القرص
استعدت القرص|المدافع يتهيّأ للاعتراض!|المس الجليد لاستعادة القرص.
المرمى مفتوح.|اعكس القرص عن أي من الحاجزين.|استخدم الحاجز الأيسر المضاء.
استخدم الحاجز الأيمن المضاء.|تزلّج إلى فراغ ثم سدّد.|انتظر عودة القرص.
خليج الصنوبر|حلبة الشفق|مباراة كأس|الحلبة {n}
سجّل {n} أهداف|مغلقة|جاهزة|مكتملة|اكتملت المباراة
انتهى الوقت|حُفظ التقدّم|تعذّر الحفظ. حاول مجددًا.
وضع التدريب. تقدّمك محفوظ.|استعد المشهد|توقّف عرض الحلبة.
ألماس {n}|العصا الكلاسيكية|سرعة ومدى التقاط متوازنان.
العصا الطويلة|تلتقط القرص من مسافة أبعد وتسدد أبطأ.
نصل ثابت|يقاوم انحراف الجليد ويبطئ التزلج.
فرشاة البوابة|تبقي المرمى مفتوحًا مدة أطول. مدى الالتقاط أقصر.
لمسة كهرمانية|لون كهرماني دائم للعصا والزلاجات.
الألوان الأصلية|يعيد الألوان الأصلية.
جهّز|مجهّز|اشترِ · {n}|إلغاء|هل تريد فتح هذا المظهر بشكل دائم؟
تحتاج إلى مزيد من الألماس.|تعذّر حفظ عملية الشراء.
أكمل الحلبة {n}|فُتح المظهر الكهرماني.
تسديدات مرتدة|الهدف|طريقة اللعب|التحكم والقواعد
النتيجة والمكافآت|ألعاب مشابهة
أرسل القرص إلى المرمى المضاء قبل انتهاء الوقت.
المس الجليد للتزلج. عند امتلاك القرص سدّد مباشرة أو اعكسه عن أحد الحاجزين.
تزلج نحو القرص الحر لاستعادته. ينفتح المرمى المغلق عندما يصطدم القرص بالحاجز المضاء. تحرك بالأسهم وسدّد بالمفاتيح 1 أو 2 أو 3.
حقق العدد المطلوب من الأهداف لفتح الحلبة التالية. أنهِ بسرعة مع خسارة أقل للقرص لتحصل على نجوم أكثر.
متى أستخدم التسديدة المرتدة؟|صوّب نحو حاجز مضاء عندما يكون المرمى مغلقًا أو يصد المدافع المسار المباشر.
كيف أستعيد القرص؟|المس الجليد أمام القرص الحر لتلتقي به عندما يتباطأ.`)};export const word=t((r,a,i={})=>(u[r]?.[a]??n[a]??a).replace(/\{(\w+)\}/g,(o,l)=>i[l]??o),"word");
