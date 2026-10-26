// Design-draft copy only. NOT INTEGRATED; native-speaker review is pending.
// Existing 1–12 names remain owned by the current game; this supplies 13–60 only.
(() => {
  'use strict';
  const nameKeys = ['clip','divert','clipDivert','sensorDivert','transfer','transferDivert','transferClip','combined','bottle','timedBottle','twoBottles','orderedBottles','bottleClip','reconnect','lockedReconnect'];
  // Index 0 represents stage 13; labels describe the tools actually available.
  const kinds = [
    'clip','clip','clip','divert','divert','clipDivert','sensorDivert','combined',
    'transfer','transfer','transferDivert','transferClip','combined','transfer','transfer','transferClip','combined','combined',
    'bottle','bottle','bottle','bottle','timedBottle','twoBottles','twoBottles','twoBottles','twoBottles','orderedBottles',
    'bottleClip','bottleClip','bottleClip','bottleClip','bottleClip','bottleClip','bottleClip','bottleClip','bottleClip','bottleClip',
    'reconnect','reconnect','reconnect','reconnect','reconnect','lockedReconnect','lockedReconnect','lockedReconnect','lockedReconnect','lockedReconnect'
  ];
  const fields = ['chapterOne','chapterOneDescription','chapterTwo','chapterTwoDescription','guideIntro','guideGoal','guideValves','guideClip','guideDiverter','guideTransfer','guideSensors','guideBottle','guideLate','guideUndoHint','guideStars','guideProgress','guideStorage','faqCountQuestion','faqValvesQuestion','faqWrongQuestion','faqSelectionQuestion','faqProgressQuestion','faqTotalExampleQuestion','faqCheckCountQuestion'];
  // The 15 short names precede the 24 structured chapter/guide strings.
  const rows = {
    en: [
      'Branch clip','Water direction','Clip and direction','Sensor and direction','Water transfer','Transfer and direction','Transfer and clip','Linked waterworks','Capture bottle','Capture timing','Two captures','Capture order','Capture and clip','Capture and reconnect','Capture and locked valve',
      'Chapter 1 · Linked flows','Stages 1–30: match the beds, then explore clips, directions, sensors and transfers.','Chapter 2 · Keep and reconnect','Stages 31–60: capture bed values, then combine bottles, clips and locked valves.',
      'Explore 60 water puzzles in two chapters. Follow the pipes and help every flower bed bloom.',
      'Match every bed’s displayed value to its target and satisfy any extra goals before Bloom. The total alone is not enough.',
      'Use + and − to adjust each valve from 0 to 6. One valve can feed more than one bed.',
      'Where offered, place one clip on a listed pipe to remove that contribution; move or remove it as needed. Each change costs one move.',
      'A diverter changes the water’s direction. Some stages require a sensor before one direction becomes available.',
      'A transfer moves one unit between the listed valves. The source needs water and the destination needs room; it can change a directly locked valve.',
      'Sensors record exact intermediate values in the shown order. One accepted action advances at most one sensor; signals remain until Undo or Reset.',
      'From stage 31, capture an eligible bed in a bottle slot to keep its current value while other beds change. A used slot cannot be overwritten.',
      'Some captures require another bed at a specified value. In stages 51–60 move the clip after capture; in 56–60 a listed valve also locks after capture.',
      'Undo restores the previous complete puzzle state and costs one move. Reset starts the attempt again. A hint suggests a legal next action; if no route remains, try Undo or Reset.',
      'Three stars require the shortest route without a hint. Up to six extra moves earns two; otherwise one. A hinted clear earns at most two.',
      'Stages 1–12 are selectable from the start. Complete 12 to open 13; each new clear opens the next, through stage 60.',
      'Best earned stars are kept in this browser when storage works; unfinished settings are not saved. If storage is unavailable, progress may not persist.',
      'How many stages are there?','How do the valves work?','What if a bed does not match?','How are stages unlocked?','Where is progress saved?','Is a matching total enough?','How are stars earned?'
    ],
    'zh-Hant': [
      '水管分支','水流轉向','夾管與轉向','感測與轉向','移水調配','移水與轉向','移水與夾管','連動水道','儲水瓶','儲存時機','雙重儲存','儲存順序','儲水與夾管','儲水與重接','儲水與鎖閥',
      '第一章・連動水流','第 1–30 關：先對準花圃，再探索夾管、轉向、感測和移水。','第二章・儲存與重接','第 31–60 關：儲存花圃數值，再結合瓶子、水管夾和鎖定閥門。',
      '在兩章中探索 60 道水流謎題。沿著水管，讓每個花圃綻放。',
      '先讓每個花圃顯示的數值等於目標，並達成額外條件，再按綻放。總和相同並不足夠。',
      '用 + 和 − 將各閥門調整到 0–6；一個閥門可能供應多個花圃。',
      '可使用時，將一個夾子放在列出的水管上，移除該路水流；也可移動或移除。每次變更算一步。',
      '分流器會改變水流方向。有些關卡須先達成感測目標，才能轉向特定方向。',
      '移水會在指定的兩個閥門之間移動一格水。來源須有水、目的閥門須有空間；直接鎖定的閥門仍可透過移水改變。',
      '感測器依顯示順序記錄精確的中途數值；每次有效操作最多推進一項，訊號會保留到復原或重設。',
      '從第 31 關起，可把符合條件的花圃目前數值存入瓶子空格，使其他花圃變化時該值保留。已用空格不能覆寫。',
      '有些儲存動作要求另一花圃達指定值。第 51–60 關儲存後須移動夾子；第 56–60 關還會鎖定指定閥門。',
      '復原會還原上一步的完整謎題狀態，並算一步；重設會重新開始本次挑戰。提示提供合法下一步；若無路可走，試試復原或重設。',
      '不使用提示且走最短路徑可得三星；多出最多六步得兩星，其餘一星。使用提示最多得兩星。',
      '第 1–12 關一開始即可選擇。完成第 12 關解鎖第 13 關；之後每通一關開啟下一關，直到第 60 關。',
      '瀏覽器儲存可用時會保留各關最佳星數，不保存未完成設定；儲存不可用時進度可能無法保留。',
      '共有多少關？','閥門如何運作？','花圃不符合目標時怎麼辦？','如何解鎖關卡？','進度保存在哪裡？','總和相同就算過關嗎？','如何獲得星星？'
    ],
    'zh-Hans': [
      '水管分支','水流转向','夹管与转向','感应与转向','移水调配','移水与转向','移水与夹管','联动水道','储水瓶','储存时机','双重储存','储存顺序','储水与夹管','储水与重接','储水与锁阀',
      '第一章・联动水流','第 1–30 关：先对准花圃，再探索夹管、转向、感应和移水。','第二章・储存与重接','第 31–60 关：储存花圃数值，再结合瓶子、水管夹和锁定阀门。',
      '在两章中探索 60 道水流谜题。沿着水管，让每个花圃绽放。',
      '先让每个花圃显示的数值等于目标，并达成额外条件，再按绽放。总和相同并不足够。',
      '用 + 和 − 将各阀门调整到 0–6；一个阀门可能供水给多个花圃。',
      '可以使用时，将一个夹子放在列出的水管上，移除该路水流；也可移动或移除。每次变更算一步。',
      '分流器会改变水流方向。有些关卡须先达成感应目标，才能转向特定方向。',
      '移水会在指定的两个阀门之间移动一格水。来源须有水、目标阀门须有空间；直接锁定的阀门仍可通过移水改变。',
      '感应器按显示顺序记录精确的中途数值；每次有效操作最多推进一项，信号会保留到撤销或重置。',
      '从第 31 关起，可把符合条件的花圃当前数值存入瓶子空格，使其他花圃变化时该值保留。已用空格不能覆盖。',
      '有些储存动作要求另一花圃达到指定值。第 51–60 关储存后须移动夹子；第 56–60 关还会锁定指定阀门。',
      '撤销会恢复上一步的完整谜题状态，并算一步；重置会重新开始本次挑战。提示提供合法下一步；若无路可走，试试撤销或重置。',
      '不使用提示且走最短路径可得三星；多出最多六步得两星，其余一星。使用提示最多得两星。',
      '第 1–12 关一开始即可选择。完成第 12 关解锁第 13 关；之后每通一关开启下一关，直到第 60 关。',
      '浏览器存储可用时会保留各关最佳星数，不保存未完成设置；存储不可用时进度可能无法保留。',
      '共有多少关？','阀门如何运作？','花圃不符合目标时怎么办？','如何解锁关卡？','进度保存在哪里？','总和相同就算过关吗？','如何获得星星？'
    ],
    ja: [
      '枝管クリップ','水の切り替え','クリップと切替','センサーと切替','水の移動','移動と切替','移動とクリップ','つながる水路','貯水ボトル','記録のタイミング','2つの記録','記録の順番','貯水とクリップ','貯水とつなぎ直し','貯水とバルブロック',
      '第1章・つながる水流','ステージ1〜30：花壇を合わせ、クリップや切替、センサー、水の移動を学びます。','第2章・記録とつなぎ直し','ステージ31〜60：花壇の値を記録し、ボトルとクリップ、ロックを組み合わせます。',
      '2章、全60問の水流パズル。配管をたどり、すべての花壇を咲かせましょう。',
      '各花壇の表示値を目標に合わせ、追加条件も満たしてから花を咲かせます。合計だけでは足りません。',
      '+ と − で各バルブを0〜6に調整します。1つのバルブが複数の花壇に水を送ることもあります。',
      '使用できるステージでは、指定された配管の1つにクリップを付けて水の一経路を止めます。移動や取り外しも各1手です。',
      '切替器で水の向きを変えます。特定の向きにする前にセンサーの達成が必要なステージもあります。',
      '指定された2つのバルブ間で水を1移します。移動元に水、移動先に空きが必要です。直接操作がロックされたバルブも移動で変えられます。',
      'センサーは表示順に途中の正確な値を記録します。有効な操作1回につき最大1つ進み、元に戻すかリセットするまで保持されます。',
      'ステージ31から、対象の花壇の現在値をボトルの枠に記録できます。ほかの花壇が変わっても記録値は保たれ、使用済み枠は上書きできません。',
      '別の花壇を指定値にすることが記録条件のステージもあります。51〜60では記録後にクリップを移動し、56〜60では指定バルブもロックされます。',
      '元に戻すと直前のパズル状態全体が復元され、1手かかります。リセットは最初からやり直します。ヒントは可能な次の手を示し、経路がない場合は戻すかリセットしてください。',
      'ヒントなしの最短手数で星3つ、6手超過まで星2つ、それ以上は星1つです。ヒント使用時は最大2つです。',
      'ステージ1〜12は最初から選べます。12をクリアすると13が開き、以降はクリアごとに次が開き、60が最後です。',
      '保存機能が使える場合、各ステージの最高星数をこのブラウザーに保存します。途中の設定は保存されず、保存不可の場合は進行も残らないことがあります。',
      'ステージはいくつありますか？','バルブはどう動きますか？','花壇が合わないときは？','ステージはどう開放されますか？','進行状況はどこに保存されますか？','合計が合えばクリアですか？','星はどう獲得しますか？'
    ],
    ko: [
      '가지 파이프 클립','물길 전환','클립과 전환','센서와 전환','물 옮기기','옮기기와 전환','옮기기와 클립','이어진 물길','물 저장병','저장 타이밍','두 번 저장','저장 순서','저장과 클립','저장과 다시 연결','저장과 밸브 잠금',
      '1장 · 이어진 물길','1–30단계: 화단을 맞추고 클립, 전환, 센서와 물 옮기기를 익혀요.','2장 · 저장과 다시 연결','31–60단계: 화단 값을 저장하고 병, 클립, 잠긴 밸브를 함께 사용해요.',
      '두 장에 걸친 60개의 물길 퍼즐을 풀어 보세요. 파이프를 따라 모든 화단을 꽃피워요.',
      '각 화단의 표시값을 목표에 맞추고 추가 조건도 충족한 뒤 꽃을 피우세요. 합계만 같아서는 안 돼요.',
      '+와 −로 각 밸브를 0–6으로 조절해요. 밸브 하나가 여러 화단에 물을 줄 수 있어요.',
      '사용 가능한 단계에서는 표시된 파이프 하나에 클립을 놓아 그 물길을 막아요. 놓기, 옮기기, 제거는 각각 한 수예요.',
      '전환기는 물의 방향을 바꿔요. 일부 단계에서는 특정 방향으로 바꾸기 전에 센서 목표를 달성해야 해요.',
      '지정된 두 밸브 사이에서 물 한 칸을 옮겨요. 출발 밸브에 물이 있고 도착 밸브에 여유가 있어야 해요. 직접 잠긴 밸브도 옮기기로 바꿀 수 있어요.',
      '센서는 표시된 순서대로 중간의 정확한 값을 기록해요. 유효한 행동 한 번에 최대 하나만 진행되며 되돌리거나 초기화할 때까지 유지돼요.',
      '31단계부터 가능한 화단의 현재 값을 병 칸에 저장할 수 있어요. 다른 화단이 변해도 저장값은 유지되며 사용한 칸은 덮어쓸 수 없어요.',
      '어떤 저장에는 다른 화단의 지정 값이 필요해요. 51–60단계에서는 저장 후 클립을 옮기고, 56–60단계에서는 지정 밸브도 잠겨요.',
      '되돌리기는 직전 퍼즐 상태 전체를 복원하며 한 수가 들어요. 초기화는 이번 도전을 다시 시작해요. 힌트는 가능한 다음 행동을 알려 주며 길이 없으면 되돌리거나 초기화하세요.',
      '힌트 없이 최단 경로로 풀면 별 셋, 여섯 수 초과까지는 별 둘, 그보다 많으면 별 하나예요. 힌트를 쓰면 최대 별 둘이에요.',
      '1–12단계는 처음부터 선택할 수 있어요. 12단계를 완료하면 13단계가 열리고, 이후에는 완료할 때마다 다음 단계가 열려 60단계에서 끝나요.',
      '브라우저 저장이 가능하면 각 단계의 최고 별 수가 보관돼요. 완료하지 않은 설정은 저장되지 않으며 저장이 불가능하면 진행 상황이 남지 않을 수 있어요.',
      '단계는 몇 개인가요?','밸브는 어떻게 작동하나요?','화단이 맞지 않으면 어떻게 하나요?','단계는 어떻게 열리나요?','진행 상황은 어디에 저장되나요?','합계만 같으면 되나요?','별은 어떻게 얻나요?'
    ],
    es: [
      'Pinza de ramal','Dirección del agua','Pinza y dirección','Sensor y dirección','Trasvase de agua','Trasvase y dirección','Trasvase y pinza','Canales conectados','Botella de captura','Momento de captura','Dos capturas','Orden de captura','Captura y pinza','Captura y reconexión','Captura y válvula bloqueada',
      'Capítulo 1 · Flujos conectados','Niveles 1–30: ajusta los canteros y explora pinzas, direcciones, sensores y trasvases.','Capítulo 2 · Guardar y reconectar','Niveles 31–60: guarda valores de canteros y combina botellas, pinzas y válvulas bloqueadas.',
      'Explora 60 puzles de agua en dos capítulos. Sigue los tubos y haz florecer cada cantero.',
      'Iguala el valor mostrado de cada cantero a su objetivo y cumple las condiciones adicionales antes de hacer florecer. No basta con igualar la suma.',
      'Usa + y − para ajustar cada válvula de 0 a 6. Una válvula puede alimentar varios canteros.',
      'Cuando esté disponible, coloca una pinza en un tubo indicado para cortar esa entrada; puedes moverla o quitarla. Cada cambio cuesta un movimiento.',
      'El desviador cambia la dirección del agua. En algunos niveles hay que activar un sensor antes de elegir cierta dirección.',
      'El trasvase mueve una unidad entre las válvulas indicadas. El origen necesita agua y el destino espacio; puede modificar una válvula bloqueada para ajuste directo.',
      'Los sensores registran valores intermedios exactos en el orden indicado. Cada acción válida avanza como máximo uno y las señales duran hasta Deshacer o Reiniciar.',
      'Desde el nivel 31, captura el valor actual de un cantero permitido en un espacio de la botella para conservarlo mientras cambian los demás. Un espacio usado no se puede sobrescribir.',
      'Algunas capturas exigen que otro cantero tenga un valor indicado. En los niveles 51–60 mueve la pinza después de capturar; en 56–60 también se bloquea una válvula indicada.',
      'Deshacer restaura todo el estado anterior y cuesta un movimiento. Reiniciar empieza de nuevo. La pista propone una acción válida; si no hay ruta, prueba Deshacer o Reiniciar.',
      'La ruta más corta sin pista da tres estrellas; hasta seis movimientos extra dan dos y, en otros casos, una. Con pista se obtienen como máximo dos.',
      'Los niveles 1–12 se pueden elegir desde el inicio. Completa el 12 para abrir el 13; después cada nivel completado abre el siguiente, hasta el 60.',
      'La mejor cantidad de estrellas de cada nivel se guarda en este navegador si el almacenamiento funciona; los ajustes incompletos no se guardan. Si falla, el progreso puede perderse.',
      '¿Cuántos niveles hay?','¿Cómo funcionan las válvulas?','¿Qué hago si un cantero no coincide?','¿Cómo se desbloquean los niveles?','¿Dónde se guarda el progreso?','¿Basta con que coincida la suma?','¿Cómo se ganan estrellas?'
    ],
    'pt-BR': [
      'Presilha no ramal','Direção da água','Presilha e direção','Sensor e direção','Transferência de água','Transferência e direção','Transferência e presilha','Canais conectados','Garrafa de captura','Momento da captura','Duas capturas','Ordem de captura','Captura e presilha','Captura e reconexão','Captura e válvula bloqueada',
      'Capítulo 1 · Fluxos conectados','Fases 1–30: ajuste os canteiros e explore presilhas, direção, sensores e transferências.','Capítulo 2 · Guardar e reconectar','Fases 31–60: guarde valores dos canteiros e combine garrafas, presilhas e válvulas bloqueadas.',
      'Explore 60 desafios de água em dois capítulos. Siga os canos e faça cada canteiro florescer.',
      'Iguale o valor exibido de cada canteiro à meta e cumpra condições extras antes de florescer. Igualar apenas a soma não basta.',
      'Use + e − para ajustar cada válvula de 0 a 6. Uma válvula pode abastecer vários canteiros.',
      'Quando disponível, coloque uma presilha em um cano indicado para interromper aquela entrada; você pode movê-la ou removê-la. Cada mudança custa uma jogada.',
      'O desviador muda a direção da água. Em algumas fases, um sensor precisa ser ativado antes de escolher uma direção.',
      'A transferência move uma unidade entre as válvulas indicadas. A origem precisa ter água e o destino, espaço; ela pode alterar uma válvula bloqueada para ajuste direto.',
      'Sensores registram valores intermediários exatos na ordem mostrada. Cada ação válida avança no máximo um, e os sinais duram até Desfazer ou Reiniciar.',
      'A partir da fase 31, capture o valor atual de um canteiro permitido em um espaço da garrafa para mantê-lo enquanto os outros mudam. Um espaço usado não pode ser sobrescrito.',
      'Algumas capturas exigem um valor específico em outro canteiro. Nas fases 51–60 mova a presilha após a captura; nas fases 56–60 uma válvula indicada também é bloqueada.',
      'Desfazer restaura todo o estado anterior e custa uma jogada. Reiniciar começa outra tentativa. A dica sugere uma ação válida; se não houver caminho, tente Desfazer ou Reiniciar.',
      'O caminho mais curto sem dica rende três estrelas; até seis jogadas extras rendem duas e, nos demais casos, uma. Com dica, o máximo é duas.',
      'As fases 1–12 podem ser escolhidas desde o início. Conclua a 12 para abrir a 13; depois cada fase concluída abre a seguinte, até a 60.',
      'O melhor número de estrelas de cada fase fica neste navegador quando o armazenamento funciona; ajustes incompletos não são salvos. Se falhar, o progresso pode não persistir.',
      'Quantas fases existem?','Como funcionam as válvulas?','E se um canteiro não corresponder à meta?','Como as fases são desbloqueadas?','Onde o progresso é salvo?','Basta acertar a soma?','Como ganhar estrelas?'
    ],
    fr: [
      'Pince de branche','Direction de l’eau','Pince et direction','Capteur et direction','Transfert d’eau','Transfert et direction','Transfert et pince','Canaux reliés','Bouteille de capture','Moment de capture','Deux captures','Ordre de capture','Capture et pince','Capture et reconnexion','Capture et vanne verrouillée',
      'Chapitre 1 · Flux reliés','Niveaux 1–30 : ajustez les parterres et découvrez pinces, directions, capteurs et transferts.','Chapitre 2 · Garder et reconnecter','Niveaux 31–60 : conservez les valeurs des parterres et combinez bouteilles, pinces et vannes verrouillées.',
      'Découvrez 60 énigmes d’eau en deux chapitres. Suivez les tuyaux et faites fleurir chaque parterre.',
      'Faites correspondre la valeur affichée de chaque parterre à son objectif et remplissez les conditions supplémentaires avant de faire fleurir. La somme seule ne suffit pas.',
      'Avec + et −, réglez chaque vanne de 0 à 6. Une vanne peut alimenter plusieurs parterres.',
      'Quand elle est disponible, placez une pince sur un tuyau indiqué pour couper cette arrivée ; vous pouvez la déplacer ou la retirer. Chaque changement coûte un coup.',
      'L’aiguillage change la direction de l’eau. Certains niveaux exigent l’activation d’un capteur avant une direction donnée.',
      'Le transfert déplace une unité entre les vannes indiquées. La source doit contenir de l’eau et la destination avoir de la place ; il peut modifier une vanne verrouillée en réglage direct.',
      'Les capteurs enregistrent des valeurs intermédiaires exactes dans l’ordre indiqué. Une action valide en fait avancer au plus un ; les signaux restent jusqu’à Annuler ou Recommencer.',
      'Dès le niveau 31, capturez la valeur actuelle d’un parterre autorisé dans une place de bouteille pour la conserver pendant que les autres changent. Une place occupée ne peut pas être écrasée.',
      'Certaines captures exigent une valeur précise dans un autre parterre. Aux niveaux 51–60, déplacez la pince après la capture ; aux niveaux 56–60, une vanne indiquée se verrouille aussi.',
      'Annuler restaure tout l’état précédent et coûte un coup. Recommencer lance une nouvelle tentative. L’indice propose une action valide ; sans chemin, essayez Annuler ou Recommencer.',
      'Le chemin le plus court sans indice donne trois étoiles ; jusqu’à six coups supplémentaires donnent deux étoiles, sinon une. Avec indice, le maximum est deux.',
      'Les niveaux 1–12 sont disponibles dès le départ. Terminez le 12 pour ouvrir le 13 ; chaque niveau terminé ouvre ensuite le suivant, jusqu’au 60.',
      'Le meilleur nombre d’étoiles de chaque niveau est conservé dans ce navigateur si le stockage fonctionne ; les réglages inachevés ne sont pas enregistrés. En cas d’échec, la progression peut ne pas persister.',
      'Combien y a-t-il de niveaux ?','Comment fonctionnent les vannes ?','Que faire si un parterre ne correspond pas ?','Comment débloquer les niveaux ?','Où la progression est-elle enregistrée ?','La somme suffit-elle ?','Comment gagner des étoiles ?'
    ],
    de: [
      'Abzweigklemme','Wasserrichtung','Klemme und Richtung','Sensor und Richtung','Wasser umfüllen','Umfüllen und Richtung','Umfüllen und Klemme','Verbundene Wasserwege','Auffangflasche','Zeitpunkt der Speicherung','Zwei Speicherungen','Reihenfolge','Speichern und Klemme','Speichern und Verbinden','Speichern und Ventilsperre',
      'Kapitel 1 · Verbundene Ströme','Level 1–30: Gleiche die Beete ab und entdecke Klemmen, Richtungen, Sensoren und Umfüllen.','Kapitel 2 · Speichern und Verbinden','Level 31–60: Halte Beetwerte fest und kombiniere Flaschen, Klemmen und gesperrte Ventile.',
      'Entdecke 60 Wasserrätsel in zwei Kapiteln. Folge den Rohren und lass jedes Beet blühen.',
      'Gleiche den angezeigten Wert jedes Beets mit seinem Ziel ab und erfülle Zusatzbedingungen, bevor du den Garten blühen lässt. Die Summe allein genügt nicht.',
      'Stelle jedes Ventil mit + und − auf 0 bis 6. Ein Ventil kann mehrere Beete versorgen.',
      'Wenn verfügbar, setze eine Klemme auf ein angegebenes Rohr und unterbrich diesen Zulauf. Du kannst sie verschieben oder entfernen; jede Änderung kostet einen Zug.',
      'Der Umlenker ändert die Wasserrichtung. In manchen Leveln muss erst ein Sensorziel erreicht werden, bevor eine Richtung verfügbar ist.',
      'Beim Umfüllen wandert eine Einheit zwischen den angegebenen Ventilen. Die Quelle braucht Wasser und das Ziel Platz; auch ein direkt gesperrtes Ventil kann so verändert werden.',
      'Sensoren erfassen exakte Zwischenwerte in der angezeigten Reihenfolge. Pro gültiger Aktion rückt höchstens einer vor; Signale bleiben bis Rückgängig oder Zurücksetzen erhalten.',
      'Ab Level 31 kannst du den aktuellen Wert eines erlaubten Beets in einem Flaschenplatz speichern. Er bleibt erhalten, während andere Beete sich ändern. Ein belegter Platz kann nicht überschrieben werden.',
      'Manche Speicherungen verlangen einen bestimmten Wert in einem anderen Beet. In Level 51–60 verschiebst du danach die Klemme; in 56–60 wird zusätzlich ein angegebenes Ventil gesperrt.',
      'Rückgängig stellt den gesamten vorherigen Zustand wieder her und kostet einen Zug. Zurücksetzen beginnt den Versuch neu. Ein Tipp zeigt eine gültige nächste Aktion; ohne Lösungsweg versuche Rückgängig oder Zurücksetzen.',
      'Der kürzeste Weg ohne Tipp gibt drei Sterne; bis zu sechs zusätzliche Züge geben zwei, sonst einen. Mit Tipp sind höchstens zwei Sterne möglich.',
      'Level 1–12 sind von Anfang an wählbar. Schließe 12 ab, um 13 zu öffnen; danach öffnet jeder Abschluss das nächste Level bis 60.',
      'Die besten Sterne je Level bleiben in diesem Browser, wenn Speicher verfügbar ist; unvollständige Einstellungen werden nicht gespeichert. Bei Speicherfehlern kann Fortschritt verloren gehen.',
      'Wie viele Level gibt es?','Wie funktionieren die Ventile?','Was tun, wenn ein Beet nicht passt?','Wie werden Level freigeschaltet?','Wo wird der Fortschritt gespeichert?','Genügt eine passende Summe?','Wie erhält man Sterne?'
    ],
    it: [
      'Morsetto sul ramo','Direzione dell’acqua','Morsetto e direzione','Sensore e direzione','Trasferimento d’acqua','Trasferimento e direzione','Trasferimento e morsetto','Canali collegati','Bottiglia di raccolta','Momento della raccolta','Due raccolte','Ordine di raccolta','Raccolta e morsetto','Raccolta e riconnessione','Raccolta e valvola bloccata',
      'Capitolo 1 · Flussi collegati','Livelli 1–30: regola le aiuole e scopri morsetti, direzioni, sensori e trasferimenti.','Capitolo 2 · Conserva e riconnetti','Livelli 31–60: conserva i valori delle aiuole e combina bottiglie, morsetti e valvole bloccate.',
      'Esplora 60 rompicapi d’acqua in due capitoli. Segui i tubi e fai fiorire ogni aiuola.',
      'Fai coincidere il valore mostrato di ogni aiuola con il suo obiettivo e soddisfa le condizioni aggiuntive prima di far fiorire. La somma da sola non basta.',
      'Usa + e − per regolare ogni valvola da 0 a 6. Una valvola può alimentare più aiuole.',
      'Quando disponibile, metti un morsetto su un tubo indicato per interrompere quell’apporto; puoi spostarlo o rimuoverlo. Ogni modifica costa una mossa.',
      'Il deviatore cambia la direzione dell’acqua. In alcuni livelli occorre attivare un sensore prima di scegliere una direzione.',
      'Il trasferimento sposta un’unità tra le valvole indicate. L’origine deve contenere acqua e la destinazione avere spazio; può modificare una valvola bloccata per la regolazione diretta.',
      'I sensori registrano valori intermedi esatti nell’ordine mostrato. Ogni azione valida ne fa avanzare al massimo uno; i segnali restano fino ad Annulla o Ricomincia.',
      'Dal livello 31 puoi conservare il valore attuale di un’aiuola consentita in uno spazio della bottiglia mentre le altre cambiano. Uno spazio occupato non può essere sovrascritto.',
      'Alcune raccolte richiedono un valore specifico in un’altra aiuola. Nei livelli 51–60 sposta il morsetto dopo la raccolta; nei livelli 56–60 si blocca anche una valvola indicata.',
      'Annulla ripristina tutto lo stato precedente e costa una mossa. Ricomincia avvia un nuovo tentativo. L’indizio suggerisce un’azione valida; se non c’è un percorso, prova Annulla o Ricomincia.',
      'Il percorso più breve senza indizio dà tre stelle; fino a sei mosse in più ne dà due, altrimenti una. Con un indizio il massimo è due.',
      'I livelli 1–12 sono selezionabili dall’inizio. Completa il 12 per aprire il 13; poi ogni livello completato apre il successivo, fino al 60.',
      'Il miglior numero di stelle per livello resta in questo browser se l’archiviazione funziona; le impostazioni incomplete non vengono salvate. In caso di errore i progressi potrebbero non restare.',
      'Quanti livelli ci sono?','Come funzionano le valvole?','Cosa fare se un’aiuola non coincide?','Come si sbloccano i livelli?','Dove si salvano i progressi?','Basta che la somma coincida?','Come si ottengono le stelle?'
    ],
    ru: [
      'Зажим ветви','Направление воды','Зажим и направление','Датчик и направление','Перелив воды','Перелив и направление','Перелив и зажим','Связанные каналы','Бутылка для сбора','Время сохранения','Два сохранения','Порядок сохранения','Сохранение и зажим','Сохранение и переподключение','Сохранение и блокировка',
      'Глава 1 · Связанные потоки','Уровни 1–30: настройте клумбы и изучите зажимы, направления, датчики и перелив.','Глава 2 · Сохранение и подключение','Уровни 31–60: сохраняйте значения клумб и сочетайте бутылки, зажимы и заблокированные клапаны.',
      'Решите 60 водных головоломок в двух главах. Следуйте трубам и помогите каждой клумбе расцвести.',
      'Сопоставьте значение каждой клумбы с её целью и выполните дополнительные условия перед цветением. Совпадения одной суммы недостаточно.',
      'Кнопками + и − устанавливайте каждый клапан от 0 до 6. Один клапан может питать несколько клумб.',
      'Если зажим доступен, установите его на указанную трубу, чтобы перекрыть этот поток; зажим можно перенести или снять. Каждое изменение стоит один ход.',
      'Переключатель меняет направление воды. На некоторых уровнях перед выбором направления нужно выполнить условие датчика.',
      'Перелив переносит одну единицу между указанными клапанами. В источнике нужна вода, а в получателе место; так можно изменить клапан, заблокированный для прямой настройки.',
      'Датчики записывают точные промежуточные значения в указанном порядке. За допустимое действие продвигается не более одного датчика; сигналы сохраняются до отмены или сброса.',
      'С уровня 31 сохраните текущее значение разрешённой клумбы в ячейке бутылки: оно останется прежним, пока другие клумбы меняются. Занятую ячейку нельзя перезаписать.',
      'Для некоторых сохранений другая клумба должна иметь указанное значение. На уровнях 51–60 затем перенесите зажим; на 56–60 также блокируется указанный клапан.',
      'Отмена восстанавливает всё предыдущее состояние и стоит один ход. Сброс начинает попытку заново. Подсказка предлагает допустимое действие; если пути нет, отмените ходы или начните заново.',
      'Кратчайший путь без подсказки даёт три звезды; до шести дополнительных ходов — две, иначе одну. С подсказкой можно получить не более двух.',
      'Уровни 1–12 доступны с начала. Пройдите 12, чтобы открыть 13; затем каждый пройденный уровень открывает следующий, до уровня 60.',
      'Лучшее число звёзд на каждом уровне сохраняется в этом браузере, когда хранилище доступно; незавершённые настройки не сохраняются. При ошибке хранилища прогресс может не сохраниться.',
      'Сколько уровней в игре?','Как работают клапаны?','Что делать, если клумба не совпадает с целью?','Как открываются уровни?','Где сохраняется прогресс?','Достаточно ли совпадения суммы?','Как получить звёзды?'
    ],
    hi: [
      'शाखा पर क्लिप','पानी की दिशा','क्लिप और दिशा','सेंसर और दिशा','पानी भेजना','पानी और दिशा','पानी और क्लिप','जुड़ी जलधाराएँ','पानी की बोतल','सँभालने का समय','दो मान सँभालें','सँभालने का क्रम','बोतल और क्लिप','सँभालें और फिर जोड़ें','सँभालें और वाल्व लॉक',
      'अध्याय 1 · जुड़ी जलधाराएँ','स्तर 1–30: क्यारियों को मिलाएँ और क्लिप, दिशा, सेंसर व पानी भेजना सीखें।','अध्याय 2 · सँभालें और फिर जोड़ें','स्तर 31–60: क्यारियों के मान सँभालें और बोतल, क्लिप व लॉक वाल्व मिलाकर प्रयोग करें।',
      'दो अध्यायों में 60 पानी की पहेलियाँ हल करें। पाइप देखें और हर क्यारी में फूल खिलाएँ।',
      'फूल खिलाने से पहले हर क्यारी का दिखता मान लक्ष्य से मिलाएँ और अतिरिक्त शर्तें पूरी करें। केवल कुल योग मिलना काफी नहीं है।',
      '+ और − से हर वाल्व को 0 से 6 तक बदलें। एक वाल्व कई क्यारियों को पानी दे सकता है।',
      'जहाँ उपलब्ध हो, बताए गए पाइप पर एक क्लिप लगाकर उसका पानी रोकें। क्लिप खिसका या हटा भी सकते हैं; हर बदलाव में एक चाल लगती है।',
      'दिशा बदलने वाला उपकरण पानी का रास्ता बदलता है। कुछ स्तरों में एक दिशा चुनने से पहले सेंसर का लक्ष्य पूरा करना होता है।',
      'दिए गए दो वाल्व के बीच एक इकाई पानी भेजें। स्रोत में पानी और दूसरे वाल्व में जगह होनी चाहिए; सीधे बदलाव के लिए लॉक वाल्व भी इससे बदल सकता है।',
      'सेंसर दिखाए क्रम में बीच के सही मान दर्ज करते हैं। एक मान्य कार्रवाई पर अधिकतम एक सेंसर आगे बढ़ता है; संकेत चाल हटाने या फिर शुरू करने तक बने रहते हैं।',
      'स्तर 31 से अनुमति वाली क्यारी का वर्तमान मान बोतल की जगह में सँभालें। बाकी क्यारियाँ बदलने पर भी वह मान रहेगा; भरी जगह पर नया मान नहीं रख सकते।',
      'कुछ मान सँभालने के लिए दूसरी क्यारी का तय मान चाहिए। स्तर 51–60 में उसके बाद क्लिप खिसकाएँ; स्तर 56–60 में दिया गया वाल्व भी लॉक हो जाता है।',
      'पिछली चाल हटाने से पहेली की पूरी पिछली स्थिति लौटती है और एक चाल लगती है। फिर शुरू करने से कोशिश रीसेट होती है। संकेत अगली मान्य कार्रवाई बताता है; रास्ता न हो तो चाल हटाएँ या फिर शुरू करें।',
      'बिना संकेत सबसे छोटे रास्ते पर तीन तारे, छह अतिरिक्त चालों तक दो, वरना एक मिलता है। संकेत लेने पर अधिकतम दो तारे मिलते हैं।',
      'स्तर 1–12 शुरू से चुन सकते हैं। 12 पूरा करने पर 13 खुलता है; फिर हर नया स्तर पूरा करने पर अगला खुलता है, अंतिम स्तर 60 है।',
      'संग्रहण उपलब्ध हो तो हर स्तर के सर्वश्रेष्ठ तारे इसी ब्राउज़र में रहते हैं; अधूरी सेटिंग नहीं सहेजी जाती। संग्रहण विफल हो तो प्रगति नहीं भी बच सकती।',
      'कुल कितने स्तर हैं?','वाल्व कैसे काम करते हैं?','क्यारी लक्ष्य से न मिले तो क्या करें?','स्तर कैसे खुलते हैं?','प्रगति कहाँ सहेजी जाती है?','क्या केवल कुल योग मिलना काफी है?','तारे कैसे मिलते हैं?'
    ],
    ar: [
      'مشبك الفرع','اتجاه الماء','المشبك والاتجاه','المستشعر والاتجاه','نقل الماء','النقل والاتجاه','النقل والمشبك','قنوات مترابطة','زجاجة الاحتفاظ','توقيت الاحتفاظ','قيمتان محفوظتان','ترتيب الاحتفاظ','الاحتفاظ والمشبك','الاحتفاظ وإعادة الوصل','الاحتفاظ وقفل الصمام',
      'الفصل الأول · تدفقات مترابطة','المراحل 1–30: طابق الأحواض وتعرّف إلى المشابك والاتجاهات والمستشعرات ونقل الماء.','الفصل الثاني · الاحتفاظ وإعادة الوصل','المراحل 31–60: احتفظ بقيم الأحواض واجمع بين الزجاجات والمشابك والصمامات المقفلة.',
      'استكشف 60 لغزاً مائياً في فصلين. اتبع الأنابيب وساعد كل حوض على الإزهار.',
      'طابق القيمة الظاهرة لكل حوض مع هدفه وحقّق الشروط الإضافية قبل الإزهار. تطابق المجموع وحده لا يكفي.',
      'استخدم + و− لضبط كل صمام بين 0 و6. قد يغذي صمام واحد عدة أحواض.',
      'عند توفر المشبك، ضعه على أحد الأنابيب المحددة لقطع ذلك المصدر. يمكنك نقله أو إزالته؛ كل تغيير يكلف حركة واحدة.',
      'يغيّر محوّل التدفق اتجاه الماء. تتطلب بعض المراحل تحقيق هدف مستشعر قبل إتاحة اتجاه معين.',
      'ينقل التحويل وحدة واحدة بين الصمامين المحددين. يحتاج المصدر إلى ماء والوجهة إلى مساحة؛ ويمكنه تغيير صمام مقفل أمام الضبط المباشر.',
      'تسجل المستشعرات قيماً وسيطة دقيقة بالترتيب الظاهر. يتقدم مستشعر واحد كحد أقصى لكل إجراء مقبول، وتبقى الإشارات حتى التراجع أو إعادة المحاولة.',
      'من المرحلة 31، احتفظ بالقيمة الحالية لحوض مسموح في خانة من الزجاجة لتبقى ثابتة بينما تتغير الأحواض الأخرى. لا يمكن الكتابة فوق خانة مستخدمة.',
      'تتطلب بعض عمليات الاحتفاظ بلوغ حوض آخر قيمة محددة. في المراحل 51–60 انقل المشبك بعد الاحتفاظ؛ وفي 56–60 يُقفل أيضاً صمام محدد.',
      'يعيد التراجع حالة اللغز السابقة كاملة ويكلف حركة واحدة. تبدأ إعادة الضبط المحاولة من جديد. يقترح التلميح إجراءً مسموحاً؛ وإن لم يوجد مسار فجرّب التراجع أو إعادة الضبط.',
      'يمنح أقصر مسار بلا تلميح ثلاث نجوم؛ وحتى ست حركات إضافية تمنح نجمتين، وإلا فنجمة واحدة. مع التلميح الحد الأقصى نجمتان.',
      'المراحل 1–12 متاحة من البداية. أكمل 12 لفتح 13؛ وبعدها يفتح إكمال كل مرحلة المرحلة التالية حتى 60.',
      'تُحفظ أفضل نجوم كل مرحلة في هذا المتصفح عند توفر التخزين؛ لا تُحفظ الإعدادات غير المكتملة. عند تعذر التخزين قد لا يبقى التقدم.',
      'كم عدد المراحل؟','كيف تعمل الصمامات؟','ماذا أفعل إن لم يطابق الحوض هدفه؟','كيف تُفتح المراحل؟','أين يُحفظ التقدم؟','هل يكفي تطابق المجموع؟','كيف أحصل على النجوم؟'
    ]
  };
  const makeNames = (locale, names) => Object.fromEntries(kinds.map((kind, index) => {
    const stage = String(index + 13);
    const isolated = locale === 'ar' ? `\u2068${stage}\u2069` : stage;
    return [stage, `${names[nameKeys.indexOf(kind)]} · ${isolated}`];
  }));
  const locales = Object.fromEntries(Object.entries(rows).map(([locale, row]) => {
    if (row.length !== nameKeys.length + fields.length) throw new Error(`BAD_STAGE60_GUIDE_LENGTH:${locale}`);
    const guide = Object.fromEntries(fields.map((key, i) => [key, row[nameKeys.length+i]]));
    // The existing static generator uses these exact FAQ answer keys. Its
    // obsolete long sections and titles still require an explicit integration.
    Object.assign(guide, {
      faqCountAnswer: guide.guideIntro,
      faqValvesAnswer: guide.guideValves,
      faqWrongAnswer: guide.guideGoal,
      faqSelectionAnswer: guide.guideProgress,
      faqProgressAnswer: guide.guideStorage,
      faqTotalExampleAnswer: guide.guideGoal,
      faqCheckCountAnswer: guide.guideStars,
    });
    return [locale, Object.freeze({stageNames:Object.freeze(makeNames(locale,row.slice(0,nameKeys.length))),guide:Object.freeze(guide)})];
  }));
  globalThis.AnimalDewlineStage60Guide = Object.freeze({ locales:Object.freeze(locales) });
})();
