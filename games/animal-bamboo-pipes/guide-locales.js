/* Authored Bamboo Guide; the same renderer owns initial HTML and locale changes. */
(() => {
  "use strict";
  const copy = {
  "en": {
    "summary": "Rotate bamboo pipes to carry spring water to the flower basin.",
    "guideRulesTitle": "How to play",
    "guideRule1": "Choose an unlocked waterway. Tap a pipe to turn it clockwise; matching openings carry water between neighboring tiles.",
    "guideRule2": "Trace the route from the spring to the flower basin. A gap stops the flow. Complete the connection to unlock the next waterway.",
    "guideRecovery": "Undo reverses your last turn. Hint marks a pipe and its next connection; you still rotate it yourself. Restart restores this puzzle. Replay cleared waterways to improve your turn count. Progress stays in this browser.",
    "faqTitle": "Frequently Asked Questions",
    "faqQuestion": "How do I complete a waterway?",
    "faqAnswer": "Make a continuous connection from the spring to the flower basin. Matching openings must meet along that route; unused pipes elsewhere do not have to connect.",
    "guideOverviewTitle": "Restore the flower basin",
    "guideOverview": "The spring and the flower basin mark the two ends of each 5×5 bamboo puzzle. Rotate pipes in place to open a continuous waterway between them; the basin itself does not rotate. Watch which pipes fill with water, then inspect the next dry connection. Water crosses a tile boundary only when both pipe openings face each other. A nearby pipe is not necessarily part of the route you need.",
    "guideProgressTitle": "Thirty waterways, one route at a time",
    "guideProgress": "The campaign contains 30 fixed puzzles in six groups of five. Early layouts introduce readable straight sections and bends; later layouts mix branches and distracting side routes. Clearing a waterway unlocks the next one, while cleared puzzles remain available. The result records your turns and offers replay or the next waterway. Replaying the same layout lets you compare your plan with your saved best turn count rather than race a changing board.",
    "guideDesignTitle": "Design note: follow the water, not every pipe",
    "guideDesign": "The board stays still while the pipe openings change. This keeps the decision about connections rather than dragging precision. Follow the wet route from the spring and work backward from the basin when a branch is confusing. Undo and the visible hint let you reconsider a turn without replacing the puzzle. Filling all 25 squares is not the objective: a working route to the basin is enough.",
    "guideSaveTitle": "Player and save information",
    "guideSave": "Use touch or a mouse to rotate pipes; keyboard focus and activation are also supported. No account or purchase is required. Cleared waterways, the furthest unlock and best turn counts are stored in this browser when local storage is available. They are not a cloud save. Clearing site data or moving to another browser can lose these records. An unfinished pipe arrangement is not saved for a page reload.",
    "faqUnusedQuestion": "Must every pipe fill with water?",
    "faqUnusedAnswer": "No. Completion is checked when water reaches the basin, not when every tile is wet. Leave unrelated branches alone unless changing them helps your route.",
    "faqHintQuestion": "Does a hint rotate a pipe for me?",
    "faqHintAnswer": "No. It marks a pipe and a useful next connection on the intended route. You still choose the turns yourself; Undo reverses your last turn and Restart restores this puzzle.",
    "faqTimerQuestion": "Can I lose by taking too long?",
    "faqTimerAnswer": "There is no countdown failure. Take time to inspect the openings. The replay target is fewer turns, and using a hint does not prevent you from unlocking the next waterway.",
    "relatedTitle": "Related games",
    "relatedIntro": "Try another kind of route planning in these WeightPlay games.",
    "relatedOneDescription": "Trace a continuous path while avoiding walls and moving obstacles.",
    "relatedCrateDescription": "Plan box pushes and keep the paths to their destinations open.",
    "tagRotation": "Pipe rotation",
    "tagPuzzle": "Puzzle",
    "tagRoutes": "Route planning"
  },
  "zh-Hant": {
    "summary": "旋轉竹管，將泉水引到花圃。",
    "guideRulesTitle": "玩法",
    "guideRule1": "選擇已解鎖的水道，點竹管順時針旋轉；相鄰格子的管口對上，水才能流過。",
    "guideRule2": "從水源追蹤到花圃，找出中斷的接頭。接通水路即可解鎖下一條水道。",
    "guideRecovery": "復原會撤回上次旋轉。提示標出一根竹管與下一個接點，仍需自己轉動。重新開始會還原本題。重玩已通關水道，挑戰更少旋轉次數。進度儲存在此瀏覽器。",
    "faqTitle": "常見問題",
    "faqQuestion": "如何完成水道？",
    "faqAnswer": "接出從泉源通往花圃的連續水路，讓這條路上的相鄰管口對齊即可；其他未使用的竹管不必全部接通。",
    "guideOverviewTitle": "讓泉水流進花圃",
    "guideOverview": "每個 5×5 竹管盤面都以泉源和花圃作為起點與終點。原地旋轉竹管，接出連續水路；花圃本身不會旋轉。先觀察哪些竹管已經進水，再檢查下一個乾燥的接頭。只有兩側管口互相對準，水才能流過格子邊界。看起來很近的竹管，不一定是你需要的路線。",
    "guideProgressTitle": "逐步完成三十條水道",
    "guideProgress": "流程包含 30 個固定盤面，分成六組，每組五關。前面的配置讓你熟悉直管與轉角，後面的配置則混入分岔與容易誤判的支線。接通水道即可解鎖下一關，已完成的關卡仍可重玩。結算會記錄旋轉次數，讓你選擇重玩或前往下一條水道。同一盤面可以反覆挑戰，目標是改善本機保存的最佳次數，而不是追趕不斷變化的棋盤。",
    "guideDesignTitle": "設計說明：沿著水流思考",
    "guideDesign": "盤面位置不變，改變的是竹管開口，因此重點在接頭判斷，而不是精準拖曳。從泉源沿著已進水的竹管找斷點；遇到難判斷的分岔，也可以從花圃往回看。復原和可見提示讓你重新考慮一次旋轉，不必換一道題目。目標不是灌滿 25 格：只要接出通往花圃的水路即可。",
    "guideSaveTitle": "玩家與存檔資訊",
    "guideSave": "可用觸控或滑鼠旋轉竹管，也支援鍵盤選取與操作。不需要帳號或付費。在瀏覽器允許本機儲存時，已完成水道、最高解鎖關卡與最佳旋轉次數會保存在此瀏覽器，並非雲端存檔。清除網站資料或更換瀏覽器可能失去紀錄。尚未完成的竹管排列不會在重新載入頁面後保留。",
    "faqUnusedQuestion": "每根竹管都必須進水嗎？",
    "faqUnusedAnswer": "不用。水流抵達花圃就算完成，不要求每格都有水。與目標無關的支線可以先不動，除非調整它有助於接通水路。",
    "faqHintQuestion": "提示會自動幫我旋轉嗎？",
    "faqHintAnswer": "不會。提示會標出設計路線上的一根竹管與下一個接點，仍須自己選擇旋轉。復原可撤回上次旋轉，重新開始則還原目前題目。",
    "faqTimerQuestion": "想太久會失敗嗎？",
    "faqTimerAnswer": "沒有倒數失敗，可以慢慢檢查管口。重玩的挑戰是用更少次旋轉完成；使用提示不會阻止解鎖下一條水道。",
    "relatedTitle": "相關遊戲",
    "relatedIntro": "也可以在這些 WeightPlay 遊戲中體驗不同的路線規劃。",
    "relatedOneDescription": "畫出不中斷的路線，避開牆壁與移動障礙。",
    "relatedCrateDescription": "安排推箱順序，保留通往目的地的空間。",
    "tagRotation": "竹管旋轉",
    "tagPuzzle": "益智解謎",
    "tagRoutes": "路線規劃"
  },
  "zh-Hans": {
    "summary": "旋转竹管，将泉水引到花圃。",
    "guideRulesTitle": "玩法",
    "guideRule1": "选择已解锁的水道，点竹管顺时针旋转；相邻格子的管口对上，水才能流过。",
    "guideRule2": "从水源追踪到花圃，找出中断的接头。接通水路即可解锁下一条水道。",
    "guideRecovery": "撤销会撤回上次旋转。提示标出一根竹管与下一个接点，仍需自己转动。重新开始会还原本题。重玩已通关水道，挑战更少旋转次数。进度保存在此浏览器。",
    "faqTitle": "常见问题",
    "faqQuestion": "如何完成水道？",
    "faqAnswer": "接出从泉源通往花圃的连续水路，让这条路上的相邻管口对齐即可；其他未使用的竹管不必全部接通。",
    "guideOverviewTitle": "让泉水流进花圃",
    "guideOverview": "每个 5×5 竹管棋盘都以泉源和花圃作为起点与终点。原地旋转竹管，接出连续水路；花圃本身不会旋转。先观察哪些竹管已经进水，再检查下一个干燥的接头。只有两侧管口互相对准，水才能流过格子边界。看起来很近的竹管，不一定是你需要的路线。",
    "guideProgressTitle": "逐步完成三十条水道",
    "guideProgress": "流程包含 30 个固定棋盘，分成六组，每组五关。前面的布局让你熟悉直管与转角，后面的布局则混入分岔与容易误判的支线。接通水道即可解锁下一关，已完成的关卡仍可重玩。结算会记录旋转次数，让你选择重玩或前往下一条水道。同一棋盘可以反复挑战，目标是改善本地保存的最佳次数，而不是追赶不断变化的棋盘。",
    "guideDesignTitle": "设计说明：沿着水流思考",
    "guideDesign": "棋盘位置不变，改变的是竹管开口，因此重点在接头判断，而不是精准拖动。从泉源沿着已进水的竹管找断点；遇到难判断的分岔，也可以从花圃往回看。撤销和可见提示让你重新考虑一次旋转，不必换一道题目。目标不是灌满 25 格：只要接出通往花圃的水路即可。",
    "guideSaveTitle": "玩家与存档信息",
    "guideSave": "可用触控或鼠标旋转竹管，也支持键盘选择与操作。不需要账号或付费。在浏览器允许本地存储时，已完成水道、最高解锁关卡与最佳旋转次数会保存在此浏览器，并非云存档。清除网站数据或更换浏览器可能失去记录。尚未完成的竹管排列不会在重新加载页面后保留。",
    "faqUnusedQuestion": "每根竹管都必须进水吗？",
    "faqUnusedAnswer": "不用。水流抵达花圃就算完成，不要求每格都有水。与目标无关的支线可以先不动，除非调整它有助于接通水路。",
    "faqHintQuestion": "提示会自动帮我旋转吗？",
    "faqHintAnswer": "不会。提示会标出设计路线上的一根竹管与下一个接点，仍须自己选择旋转。撤销可退回上次旋转，重新开始则还原当前题目。",
    "faqTimerQuestion": "想太久会失败吗？",
    "faqTimerAnswer": "没有倒计时失败，可以慢慢检查管口。重玩的挑战是用更少次旋转完成；使用提示不会阻止解锁下一条水道。",
    "relatedTitle": "相关游戏",
    "relatedIntro": "也可以在这些 WeightPlay 游戏中体验不同的路线规划。",
    "relatedOneDescription": "画出不中断的路线，避开墙壁与移动障碍。",
    "relatedCrateDescription": "安排推箱顺序，保留通往目的地的空间。",
    "tagRotation": "竹管旋转",
    "tagPuzzle": "益智解谜",
    "tagRoutes": "路线规划"
  },
  "ja": {
    "summary": "竹の管を回し、泉の水を花壇へ届けましょう。",
    "guideRulesTitle": "遊び方",
    "guideRule1": "開いている水路を選び、管をタップして時計回りに回します。隣り合う管の口が合うと水が流れます。",
    "guideRule2": "泉から花壇までたどり、途切れた接続を探しましょう。水路をつなぐと次の水路が開きます。",
    "guideRecovery": "元に戻すと最後の回転を取り消します。ヒントは管と次の接続先を示しますが、回転は自分で行います。やり直すと問題が初期状態に戻ります。クリアした水路で回転数の短縮に挑戦できます。進行はこのブラウザーに保存されます。",
    "faqTitle": "よくある質問",
    "faqQuestion": "水路はどう完成させますか？",
    "faqAnswer": "泉から花壇まで途切れない水路を作ります。その道で隣の管の口が合っていればよく、使わない管まで全部つなぐ必要はありません。",
    "guideOverviewTitle": "泉の水を花壇へ",
    "guideOverview": "5×5の竹管パズルでは、泉が出発点、花壇が到着点です。管をその場で回し、水が通る道をつなぎます。花壇自体は回りません。水が入った管を見て、その先の乾いた接続を調べましょう。隣り合う管の口が向かい合うと、水が次のマスへ流れます。近くにある管が必ず必要な道とは限りません。",
    "guideProgressTitle": "30の水路を順に進める",
    "guideProgress": "固定の30問が、5問ずつの6章に分かれています。序盤は直線と曲がり角を読み取り、後半は分岐や紛らわしい脇道を見分けます。水路を完成させると次の問題が開き、クリア済みの問題も遊び直せます。結果画面には回転数が表示され、再挑戦か次の水路を選べます。同じ配置で保存済みの最少回転数を更新する楽しみがあります。",
    "guideDesignTitle": "設計メモ：すべての管より水の道",
    "guideDesign": "マスの位置は変わらず、管の向きだけが変わります。細かなドラッグ操作より、接続の判断が大切です。泉から水の入った管をたどり、分岐で迷ったら花壇側から逆に考えてみましょう。取り消しと目に見えるヒントで、同じ問題のまま一手を考え直せます。25マスすべてを満たす必要はなく、花壇まで水が届けば完成です。",
    "guideSaveTitle": "操作と保存について",
    "guideSave": "タッチやマウスで管を回せるほか、キーボードでの選択と操作にも対応します。アカウントや購入は不要です。クリア状況、解放済みの水路、最少回転数は、ローカル保存が使える場合にこのブラウザーへ保存されます。クラウド保存ではありません。サイトデータの削除やブラウザーの変更で記録を失うことがあります。途中の管の配置はページ再読み込み後には残りません。",
    "faqUnusedQuestion": "すべての管に水を通す必要はありますか？",
    "faqUnusedAnswer": "いいえ。花壇に水が届くと完成します。すべてのマスに水を入れる条件はありません。関係のない脇道は、必要になるまで動かさなくても大丈夫です。",
    "faqHintQuestion": "ヒントは管を自動で回しますか？",
    "faqHintAnswer": "いいえ。想定された道にある管と次の接続先を示します。回転は自分で行います。取り消しは直前の回転を戻し、やり直しは現在の問題を初期状態へ戻します。",
    "faqTimerQuestion": "考える時間が長いと失敗しますか？",
    "faqTimerAnswer": "時間切れによる失敗はありません。落ち着いて管の口を確認できます。再挑戦では少ない回転数を目指します。ヒントを使っても次の水路は解放できます。",
    "relatedTitle": "関連ゲーム",
    "relatedIntro": "別の道づくりを楽しめるWeightPlayのゲームです。",
    "relatedOneDescription": "壁や動く障害物を避けながら、途切れない線を描きます。",
    "relatedCrateDescription": "箱を押す順番を考え、目的地までの道を確保します。",
    "tagRotation": "管の回転",
    "tagPuzzle": "パズル",
    "tagRoutes": "ルート作り"
  },
  "ko": {
    "summary": "대나무 관을 돌려 샘물을 화단까지 보내세요.",
    "guideRulesTitle": "게임 방법",
    "guideRule1": "열린 수로를 고르고 관을 눌러 시계 방향으로 돌리세요. 이웃한 관의 입구가 맞아야 물이 흐릅니다.",
    "guideRule2": "샘에서 화단까지 따라가며 끊어진 연결을 찾으세요. 물길을 연결하면 다음 수로가 열립니다.",
    "guideRecovery": "실행 취소는 마지막 회전을 되돌립니다. 힌트는 관과 다음 연결 지점을 표시하며 회전은 직접 해야 합니다. 다시 시작은 퍼즐을 초기화합니다. 완료한 수로에서 더 적은 회전에 도전하세요. 진행은 이 브라우저에 저장됩니다.",
    "faqTitle": "자주 묻는 질문",
    "faqQuestion": "수로를 어떻게 완성하나요?",
    "faqAnswer": "샘에서 화단까지 끊김 없는 물길을 만드세요. 그 경로의 이웃한 입구끼리 맞으면 되며, 사용하지 않는 관을 모두 연결할 필요는 없습니다.",
    "guideOverviewTitle": "샘물을 화단으로 보내기",
    "guideOverview": "5×5 대나무 퍼즐에서 샘은 출발점이고 화단은 도착점입니다. 관을 제자리에서 돌려 끊김 없는 물길을 만드세요. 화단 자체는 돌아가지 않습니다. 물이 찬 관을 살펴보고 그다음 마른 연결부를 확인하세요. 서로 마주 보는 두 입구가 맞아야 물이 다음 칸으로 흐릅니다. 가까이 있는 관이라고 모두 필요한 경로는 아닙니다.",
    "guideProgressTitle": "서른 개의 수로를 차례대로",
    "guideProgress": "고정된 퍼즐 30개가 다섯 개씩 여섯 장으로 구성됩니다. 초반에는 직선과 모서리를 익히고, 뒤로 갈수록 갈림길과 헷갈리는 샛길을 구별합니다. 수로를 완성하면 다음 문제가 열리며, 완료한 문제도 다시 즐길 수 있습니다. 결과 화면에서 회전 횟수를 확인하고 재도전하거나 다음 수로로 이동하세요. 같은 배치에서 저장된 최소 회전 기록을 개선할 수 있습니다.",
    "guideDesignTitle": "설계 이야기: 모든 관보다 물길",
    "guideDesign": "칸의 위치는 그대로이고 관의 방향만 바뀝니다. 정교하게 끌기보다 연결을 판단하는 것이 핵심입니다. 샘에서 물이 찬 관을 따라가고, 갈림길이 헷갈리면 화단 쪽에서 거꾸로 생각해 보세요. 실행 취소와 눈에 보이는 힌트로 같은 문제에서 한 번의 회전을 다시 생각할 수 있습니다. 25칸을 모두 채울 필요 없이 화단까지 물이 닿으면 됩니다.",
    "guideSaveTitle": "조작과 저장 정보",
    "guideSave": "터치나 마우스로 관을 돌릴 수 있으며 키보드 선택과 조작도 지원합니다. 계정이나 구매는 필요하지 않습니다. 로컬 저장소를 사용할 수 있으면 완료한 수로, 가장 멀리 열린 단계와 최소 회전 기록이 이 브라우저에 저장됩니다. 클라우드 저장이 아니므로 사이트 데이터를 지우거나 다른 브라우저를 쓰면 기록을 잃을 수 있습니다. 미완성 관 배치는 페이지를 새로고침하면 유지되지 않습니다.",
    "faqUnusedQuestion": "모든 관에 물이 차야 하나요?",
    "faqUnusedAnswer": "아니요. 물이 화단에 도착하면 완료됩니다. 모든 칸이 젖을 필요는 없습니다. 물길에 도움이 되지 않는 샛길은 그대로 두어도 됩니다.",
    "faqHintQuestion": "힌트가 관을 자동으로 돌려 주나요?",
    "faqHintAnswer": "아니요. 의도된 경로의 관과 다음 연결 지점을 알려 줍니다. 회전은 직접 해야 합니다. 실행 취소는 마지막 회전을 되돌리고 다시 시작은 현재 퍼즐을 초기화합니다.",
    "faqTimerQuestion": "오래 생각하면 실패하나요?",
    "faqTimerAnswer": "시간 초과로 실패하지 않습니다. 천천히 입구를 살펴보세요. 재도전의 목표는 더 적은 회전 횟수이며, 힌트를 써도 다음 수로를 열 수 있습니다.",
    "relatedTitle": "관련 게임",
    "relatedIntro": "다른 방식으로 경로를 계획하는 WeightPlay 게임도 즐겨 보세요.",
    "relatedOneDescription": "벽과 움직이는 장애물을 피하며 끊김 없는 선을 그리세요.",
    "relatedCrateDescription": "상자를 미는 순서를 계획하고 목적지로 가는 길을 확보하세요.",
    "tagRotation": "관 회전",
    "tagPuzzle": "퍼즐",
    "tagRoutes": "경로 계획"
  },
  "es": {
    "summary": "Gira los tubos de bambú para llevar agua del manantial al jardín.",
    "guideRulesTitle": "Cómo jugar",
    "guideRule1": "Elige un canal desbloqueado. Toca un tubo para girarlo en sentido horario; las aberturas vecinas deben coincidir para dejar pasar el agua.",
    "guideRule2": "Sigue el recorrido del manantial al jardín y busca conexiones rotas. Completa el recorrido para desbloquear el siguiente canal.",
    "guideRecovery": "Deshacer revierte el último giro. Pista señala un tubo y su siguiente conexión: debes girarlo tú. Reiniciar restaura el puzle. Repite canales completados para usar menos giros. El progreso se guarda en este navegador.",
    "faqTitle": "Preguntas frecuentes",
    "faqQuestion": "¿Cómo completo un canal?",
    "faqAnswer": "Crea un recorrido continuo del manantial al jardín. Las aberturas vecinas deben coincidir en ese recorrido; no necesitas conectar todos los tubos que quedan fuera de él.",
    "guideOverviewTitle": "Lleva agua al jardín",
    "guideOverview": "El manantial y el jardín son los extremos de cada puzle de bambú de 5×5. Gira los tubos sin moverlos de casilla para crear un recorrido continuo; el recipiente del jardín no gira. Observa los tubos que ya tienen agua y revisa la siguiente unión seca. El agua pasa de una casilla a otra solo si ambas aberturas se enfrentan. Un tubo cercano no tiene por qué formar parte del recorrido necesario.",
    "guideProgressTitle": "Treinta canales paso a paso",
    "guideProgress": "Hay 30 puzles fijos repartidos en seis grupos de cinco. Las primeras disposiciones presentan tramos rectos y curvas; las posteriores combinan bifurcaciones y ramales que pueden despistar. Completar un canal desbloquea el siguiente, y los resueltos siguen disponibles. El resultado muestra los giros y permite repetir o continuar. Rejugar la misma disposición sirve para mejorar tu mejor registro guardado, no para perseguir un tablero cambiante.",
    "guideDesignTitle": "Diseño: sigue el agua, no todos los tubos",
    "guideDesign": "Las casillas permanecen fijas y solo cambia la orientación de las aberturas. Importa decidir las conexiones, no arrastrar con precisión. Sigue el agua desde el manantial y, ante una bifurcación confusa, piensa también desde el jardín hacia atrás. Deshacer y las pistas visibles permiten reconsiderar un giro sin cambiar de puzle. No necesitas llenar las 25 casillas: basta con que el agua llegue al jardín.",
    "guideSaveTitle": "Controles y guardado",
    "guideSave": "Gira los tubos con la pantalla táctil o el ratón; también hay selección y activación mediante teclado. No se necesita cuenta ni compra. Los canales resueltos, el último desbloqueo y los mejores registros de giros se guardan en este navegador si admite almacenamiento local. No hay guardado en la nube. Borrar los datos del sitio o cambiar de navegador puede hacerte perder esos registros. Una disposición sin terminar no se conserva al recargar la página.",
    "faqUnusedQuestion": "¿Todos los tubos deben tener agua?",
    "faqUnusedAnswer": "No. Se comprueba si el agua llega al jardín, no si todas las casillas están mojadas. Deja los ramales ajenos al objetivo sin tocar salvo que cambiarlos ayude al recorrido.",
    "faqHintQuestion": "¿Una pista gira el tubo por mí?",
    "faqHintAnswer": "No. Marca un tubo y una conexión útil del recorrido previsto. Tú decides los giros. Deshacer revierte el último giro y Reiniciar restaura el puzle actual.",
    "faqTimerQuestion": "¿Puedo perder por tardar demasiado?",
    "faqTimerAnswer": "No hay derrota por cuenta atrás. Puedes revisar las aberturas con calma. Al repetir, intenta usar menos giros; una pista no impide desbloquear el siguiente canal.",
    "relatedTitle": "Juegos relacionados",
    "relatedIntro": "Prueba otra forma de planificar recorridos en estos juegos de WeightPlay.",
    "relatedOneDescription": "Traza un camino continuo evitando paredes y obstáculos móviles.",
    "relatedCrateDescription": "Planifica cómo empujar cajas y mantén libres los caminos a sus destinos.",
    "tagRotation": "Rotación de tubos",
    "tagPuzzle": "Puzles",
    "tagRoutes": "Planificación de rutas"
  },
  "pt-BR": {
    "summary": "Gire os tubos de bambu para levar água da nascente ao canteiro.",
    "guideRulesTitle": "Como jogar",
    "guideRule1": "Escolha um canal desbloqueado. Toque num tubo para girá-lo no sentido horário; as aberturas vizinhas precisam coincidir para a água passar.",
    "guideRule2": "Siga da nascente até o canteiro e encontre as ligações interrompidas. Complete o caminho para liberar o próximo canal.",
    "guideRecovery": "Desfazer reverte o último giro. Dica marca um tubo e a próxima ligação, mas você precisa girá-lo. Reiniciar restaura o quebra-cabeça. Repita canais concluídos para usar menos giros. O progresso fica neste navegador.",
    "faqTitle": "Perguntas frequentes",
    "faqQuestion": "Como completo um canal?",
    "faqAnswer": "Crie uma ligação contínua entre a nascente e o canteiro. As aberturas vizinhas devem se encaixar nesse caminho; os tubos fora dele não precisam estar todos conectados.",
    "guideOverviewTitle": "Leve água ao canteiro",
    "guideOverview": "A nascente e o canteiro são as pontas de cada quebra-cabeça de bambu de 5×5. Gire os tubos sem tirá-los de suas casas para criar um caminho contínuo; o recipiente do canteiro não gira. Observe quais tubos já receberam água e confira a próxima ligação seca. A água só atravessa a borda entre duas casas quando as aberturas ficam voltadas uma para a outra. Nem todo tubo próximo faz parte do caminho necessário.",
    "guideProgressTitle": "Trinta canais, um de cada vez",
    "guideProgress": "A campanha tem 30 quebra-cabeças fixos em seis grupos de cinco. Os primeiros apresentam trechos retos e curvas; os seguintes misturam bifurcações e ramificações que podem confundir. Completar um canal libera o próximo, e os resolvidos continuam disponíveis. O resultado mostra os giros e permite repetir ou avançar. Rejogar a mesma disposição ajuda a melhorar seu menor número de giros salvo, sem um tabuleiro que muda a cada tentativa.",
    "guideDesignTitle": "Design: siga a água, não todos os tubos",
    "guideDesign": "As casas ficam no lugar e apenas a direção das aberturas muda. O importante é decidir as conexões, não arrastar com precisão. Siga a água desde a nascente e, diante de uma bifurcação confusa, pense também do canteiro para trás. Desfazer e as dicas visíveis permitem reconsiderar um giro sem trocar de quebra-cabeça. Não é preciso encher as 25 casas: basta a água chegar ao canteiro.",
    "guideSaveTitle": "Controles e salvamento",
    "guideSave": "Use toque ou mouse para girar os tubos; a seleção e a ativação pelo teclado também são aceitas. Não é preciso conta nem compra. Canais concluídos, o ponto mais avançado liberado e os melhores números de giros ficam neste navegador quando o armazenamento local está disponível. Não é um salvamento em nuvem. Apagar dados do site ou trocar de navegador pode remover os registros. Uma disposição inacabada não é mantida ao recarregar a página.",
    "faqUnusedQuestion": "Todos os tubos precisam receber água?",
    "faqUnusedAnswer": "Não. A conclusão depende de a água chegar ao canteiro, não de molhar todas as casas. Deixe ramificações desnecessárias como estão, a menos que alterá-las ajude o caminho.",
    "faqHintQuestion": "A dica gira o tubo por mim?",
    "faqHintAnswer": "Não. Ela marca um tubo e a próxima ligação útil no caminho previsto. Você ainda decide os giros. Desfazer reverte o último giro e Reiniciar restaura o quebra-cabeça atual.",
    "faqTimerQuestion": "Posso perder por demorar demais?",
    "faqTimerAnswer": "Não há derrota por contagem regressiva. Examine as aberturas com calma. Ao repetir, tente usar menos giros; pedir uma dica não impede a liberação do próximo canal.",
    "relatedTitle": "Jogos relacionados",
    "relatedIntro": "Experimente outras formas de planejar caminhos nestes jogos do WeightPlay.",
    "relatedOneDescription": "Trace um caminho contínuo, evitando paredes e obstáculos móveis.",
    "relatedCrateDescription": "Planeje como empurrar caixas e mantenha livres os caminhos até os destinos.",
    "tagRotation": "Rotação de tubos",
    "tagPuzzle": "Quebra-cabeça",
    "tagRoutes": "Planejamento de rotas"
  },
  "fr": {
    "summary": "Tournez les tuyaux de bambou pour amener l’eau de la source au parterre.",
    "guideRulesTitle": "Comment jouer",
    "guideRule1": "Choisissez un canal débloqué. Touchez un tuyau pour le tourner dans le sens horaire ; les ouvertures voisines doivent se rejoindre.",
    "guideRule2": "Suivez le trajet de la source au parterre et repérez les raccords interrompus. Reliez le trajet pour débloquer le canal suivant.",
    "guideRecovery": "Annuler revient sur la dernière rotation. Indice désigne un tuyau et son prochain raccord ; vous devez le tourner vous-même. Recommencer rétablit le puzzle. Rejouez pour réduire les rotations. La progression reste dans ce navigateur.",
    "faqTitle": "Questions fréquentes",
    "faqQuestion": "Comment terminer un canal ?",
    "faqAnswer": "Établissez un trajet continu entre la source et le parterre. Les ouvertures voisines doivent se rejoindre sur ce trajet ; les tuyaux inutilisés ailleurs n’ont pas tous besoin d’être raccordés.",
    "guideOverviewTitle": "Amener l’eau jusqu’au parterre",
    "guideOverview": "La source et le parterre sont les deux extrémités de chaque puzzle de bambou de 5×5. Faites tourner les tuyaux sur place pour établir un trajet continu ; le bassin du parterre ne tourne pas. Observez les tuyaux déjà remplis, puis examinez le raccord sec suivant. L’eau passe entre deux cases uniquement lorsque leurs ouvertures se font face. Un tuyau proche n’appartient pas forcément au trajet utile.",
    "guideProgressTitle": "Trente canaux à parcourir",
    "guideProgress": "Les 30 puzzles fixes sont répartis en six groupes de cinq. Les premiers présentent des sections droites et des coudes lisibles ; les suivants mêlent embranchements et voies secondaires trompeuses. Terminer un canal débloque le suivant, et les puzzles résolus restent accessibles. Le résultat indique les rotations et propose de rejouer ou de continuer. Reprendre la même disposition permet d’améliorer le meilleur nombre de rotations enregistré.",
    "guideDesignTitle": "Conception : suivre l’eau plutôt que tous les tuyaux",
    "guideDesign": "Les cases restent fixes ; seule l’orientation des ouvertures change. La décision porte sur les raccords, pas sur la précision d’un glisser-déposer. Suivez l’eau depuis la source et raisonnez aussi à rebours depuis le parterre si un embranchement vous égare. L’annulation et l’indice visible permettent de revoir une rotation sans changer de puzzle. Il n’est pas nécessaire de remplir les 25 cases : l’eau doit simplement atteindre le bassin.",
    "guideSaveTitle": "Commandes et sauvegarde",
    "guideSave": "Tournez les tuyaux au toucher ou à la souris ; la sélection et l’activation au clavier sont aussi prises en charge. Aucun compte ni achat n’est requis. Les canaux terminés, le dernier déblocage et les meilleurs nombres de rotations sont conservés dans ce navigateur si le stockage local est disponible. Il ne s’agit pas d’une sauvegarde en ligne. Effacer les données du site ou changer de navigateur peut supprimer ces records. Une disposition inachevée n’est pas conservée après le rechargement de la page.",
    "faqUnusedQuestion": "Tous les tuyaux doivent-ils contenir de l’eau ?",
    "faqUnusedAnswer": "Non. Le jeu vérifie que l’eau atteint le bassin, pas que toutes les cases sont mouillées. Laissez les branches inutiles telles quelles, sauf si les modifier aide votre trajet.",
    "faqHintQuestion": "L’indice tourne-t-il un tuyau à ma place ?",
    "faqHintAnswer": "Non. Il désigne un tuyau et un prochain raccord utile du trajet prévu. Vous choisissez encore les rotations. Annuler revient sur la dernière rotation ; Recommencer restaure le puzzle actuel.",
    "faqTimerQuestion": "Puis-je perdre en prenant trop de temps ?",
    "faqTimerAnswer": "Il n’y a pas d’échec par compte à rebours. Examinez les ouvertures tranquillement. En rejouant, visez moins de rotations ; un indice n’empêche pas de débloquer le canal suivant.",
    "relatedTitle": "Jeux associés",
    "relatedIntro": "Découvrez d’autres façons de préparer un trajet dans ces jeux WeightPlay.",
    "relatedOneDescription": "Tracez un chemin continu en évitant les murs et les obstacles mobiles.",
    "relatedCrateDescription": "Prévoyez les poussées de caisses et gardez les chemins vers leurs destinations libres.",
    "tagRotation": "Rotation de tuyaux",
    "tagPuzzle": "Puzzle",
    "tagRoutes": "Planification de trajets"
  },
  "de": {
    "summary": "Drehe Bambusrohre und leite Quellwasser zum Blumenbeet.",
    "guideRulesTitle": "So spielst du",
    "guideRule1": "Wähle einen freigeschalteten Wasserweg. Tippe ein Rohr an, um es im Uhrzeigersinn zu drehen. Benachbarte Öffnungen müssen zusammenpassen.",
    "guideRule2": "Verfolge den Weg von der Quelle zum Beet und finde unterbrochene Verbindungen. Verbinde den Wasserweg, um den nächsten freizuschalten.",
    "guideRecovery": "Rückgängig nimmt die letzte Drehung zurück. Hinweis markiert ein Rohr und den nächsten Anschluss; drehen musst du selbst. Neustart setzt das Rätsel zurück. Wiederhole gelöste Wege mit weniger Drehungen. Fortschritt wird in diesem Browser gespeichert.",
    "faqTitle": "Häufige Fragen",
    "faqQuestion": "Wie schließe ich einen Wasserweg ab?",
    "faqAnswer": "Verbinde Quelle und Blumenbeet durchgehend. Entlang dieses Wegs müssen benachbarte Öffnungen zusammenpassen; unbenutzte Rohre außerhalb des Wegs müssen nicht alle verbunden sein.",
    "guideOverviewTitle": "Wasser zum Blumenbeet leiten",
    "guideOverview": "Quelle und Blumenbeet bilden die Endpunkte jedes 5×5-Bambusrätsels. Drehe die Rohre auf ihren Feldern, um einen durchgehenden Wasserweg zu öffnen; das Becken selbst lässt sich nicht drehen. Sieh dir die bereits gefüllten Rohre an und prüfe den nächsten trockenen Anschluss. Wasser fließt nur über eine Feldgrenze, wenn sich beide Öffnungen gegenüberliegen. Ein nahes Rohr gehört nicht unbedingt zum benötigten Weg.",
    "guideProgressTitle": "Dreißig Wasserwege nacheinander",
    "guideProgress": "Die Kampagne umfasst 30 feste Rätsel in sechs Gruppen zu je fünf. Frühe Anordnungen zeigen übersichtliche Geraden und Kurven; spätere kombinieren Abzweigungen und irreführende Nebenwege. Ein gelöster Wasserweg schaltet den nächsten frei, abgeschlossene Rätsel bleiben spielbar. Das Ergebnis zeigt deine Drehungen und bietet Wiederholen oder Weiter. Auf derselben Anordnung kannst du deine gespeicherte Bestleistung verbessern, statt ständig ein neues Brett zu erhalten.",
    "guideDesignTitle": "Designnotiz: dem Wasser folgen",
    "guideDesign": "Die Felder bleiben an ihrem Platz, nur die Rohröffnungen wechseln die Richtung. Verbindungen zu beurteilen ist wichtiger als präzises Ziehen. Folge dem Wasser von der Quelle aus und denke bei unklaren Abzweigungen auch vom Becken rückwärts. Rückgängig und der sichtbare Hinweis lassen dich eine Drehung überdenken, ohne das Rätsel auszutauschen. Nicht alle 25 Felder müssen gefüllt sein: Ein Wasserweg bis zum Becken genügt.",
    "guideSaveTitle": "Bedienung und Spielstand",
    "guideSave": "Drehe Rohre per Touch oder Maus; Auswahl und Aktivierung über die Tastatur werden ebenfalls unterstützt. Konto oder Kauf sind nicht erforderlich. Gelöste Wasserwege, die höchste Freischaltung und die besten Drehungszahlen werden in diesem Browser gespeichert, sofern lokaler Speicher verfügbar ist. Es gibt keinen Cloud-Spielstand. Das Löschen von Websitedaten oder ein anderer Browser kann diese Aufzeichnungen entfernen. Eine unfertige Rohranordnung bleibt beim Neuladen der Seite nicht erhalten.",
    "faqUnusedQuestion": "Muss jedes Rohr Wasser enthalten?",
    "faqUnusedAnswer": "Nein. Entscheidend ist, ob das Wasser das Becken erreicht, nicht ob jedes Feld nass ist. Unnötige Nebenwege kannst du unverändert lassen, solange sie deinem Weg nicht helfen.",
    "faqHintQuestion": "Dreht der Hinweis ein Rohr für mich?",
    "faqHintAnswer": "Nein. Er markiert ein Rohr und einen hilfreichen nächsten Anschluss auf dem vorgesehenen Weg. Du entscheidest weiterhin über die Drehungen. Rückgängig nimmt die letzte Drehung zurück; Neustart setzt das aktuelle Rätsel zurück.",
    "faqTimerQuestion": "Verliere ich, wenn ich zu lange nachdenke?",
    "faqTimerAnswer": "Es gibt keine Niederlage durch Zeitablauf. Prüfe die Öffnungen in Ruhe. Beim Wiederholen zählen weniger Drehungen; ein Hinweis verhindert nicht die Freischaltung des nächsten Wasserwegs.",
    "relatedTitle": "Ähnliche Spiele",
    "relatedIntro": "Probiere weitere Formen der Wegplanung in diesen WeightPlay-Spielen.",
    "relatedOneDescription": "Zeichne einen durchgehenden Weg an Wänden und beweglichen Hindernissen vorbei.",
    "relatedCrateDescription": "Plane das Schieben von Kisten und halte die Wege zu ihren Zielen frei.",
    "tagRotation": "Rohre drehen",
    "tagPuzzle": "Rätsel",
    "tagRoutes": "Wegplanung"
  },
  "it": {
    "summary": "Ruota i tubi di bambù per portare l’acqua dalla sorgente all’aiuola.",
    "guideRulesTitle": "Come giocare",
    "guideRule1": "Scegli un canale sbloccato. Tocca un tubo per ruotarlo in senso orario; le aperture vicine devono combaciare per far passare l’acqua.",
    "guideRule2": "Segui il percorso dalla sorgente all’aiuola e cerca i raccordi interrotti. Completa il collegamento per sbloccare il canale successivo.",
    "guideRecovery": "Annulla ripristina l’ultima rotazione. Suggerimento indica un tubo e il raccordo seguente: devi ruotarlo tu. Ricomincia ripristina il puzzle. Rigioca i canali per ridurre le rotazioni. I progressi restano in questo browser.",
    "faqTitle": "Domande frequenti",
    "faqQuestion": "Come completo un canale?",
    "faqAnswer": "Crea un percorso continuo dalla sorgente all’aiuola. Lungo quel percorso le aperture vicine devono combaciare; non è necessario collegare anche tutti i tubi inutilizzati.",
    "guideOverviewTitle": "Porta l’acqua all’aiuola",
    "guideOverview": "La sorgente e l’aiuola sono gli estremi di ogni rompicapo di bambù di 5×5. Ruota i tubi senza spostarli dalle caselle per creare un percorso continuo; il bacino dell’aiuola non ruota. Osserva i tubi già pieni d’acqua e controlla il raccordo asciutto successivo. L’acqua attraversa il bordo tra due caselle solo quando le aperture si fronteggiano. Un tubo vicino non fa necessariamente parte del percorso utile.",
    "guideProgressTitle": "Trenta canali, uno alla volta",
    "guideProgress": "La campagna comprende 30 rompicapi fissi in sei gruppi di cinque. I primi mostrano tratti rettilinei e curve leggibili; i successivi mescolano biforcazioni e diramazioni ingannevoli. Completare un canale sblocca il seguente, mentre quelli risolti restano disponibili. Il risultato mostra le rotazioni e permette di riprovare o proseguire. Rigiocare la stessa disposizione aiuta a migliorare il numero minimo di rotazioni salvato.",
    "guideDesignTitle": "Nota di design: segui l’acqua",
    "guideDesign": "Le caselle restano ferme e cambia soltanto la direzione delle aperture. Conta valutare i raccordi, non trascinare con precisione. Segui l’acqua dalla sorgente e, se una biforcazione confonde, ragiona anche a ritroso dall’aiuola. Annulla e il suggerimento visibile consentono di ripensare una rotazione senza cambiare rompicapo. Non devi riempire tutte le 25 caselle: basta far arrivare l’acqua al bacino.",
    "guideSaveTitle": "Comandi e salvataggio",
    "guideSave": "Puoi ruotare i tubi con il tocco o il mouse; sono supportate anche selezione e attivazione da tastiera. Non servono account o acquisti. Canali completati, ultimo sblocco e migliori numeri di rotazioni rimangono in questo browser quando l’archiviazione locale è disponibile. Non è un salvataggio nel cloud. Cancellare i dati del sito o cambiare browser può eliminare questi record. Una disposizione incompleta non viene conservata ricaricando la pagina.",
    "faqUnusedQuestion": "Ogni tubo deve contenere acqua?",
    "faqUnusedAnswer": "No. Il gioco controlla se l’acqua raggiunge il bacino, non se tutte le caselle sono bagnate. Lascia stare le diramazioni inutili, a meno che modificarle aiuti il percorso.",
    "faqHintQuestion": "Il suggerimento ruota il tubo per me?",
    "faqHintAnswer": "No. Evidenzia un tubo e un raccordo successivo utile del percorso previsto. Devi scegliere tu le rotazioni. Annulla ripristina la rotazione precedente e Ricomincia riporta il rompicapo attuale all’inizio.",
    "faqTimerQuestion": "Posso perdere se impiego troppo tempo?",
    "faqTimerAnswer": "Non si perde per un conto alla rovescia. Controlla le aperture con calma. Rigiocando puoi cercare di usare meno rotazioni; il suggerimento non impedisce di sbloccare il canale successivo.",
    "relatedTitle": "Giochi correlati",
    "relatedIntro": "Prova altri modi di pianificare percorsi in questi giochi WeightPlay.",
    "relatedOneDescription": "Traccia un percorso continuo evitando pareti e ostacoli mobili.",
    "relatedCrateDescription": "Pianifica le spinte delle casse e mantieni libere le vie verso le destinazioni.",
    "tagRotation": "Rotazione dei tubi",
    "tagPuzzle": "Rompicapo",
    "tagRoutes": "Pianificazione dei percorsi"
  },
  "ru": {
    "summary": "Поворачивайте бамбуковые трубы и проведите воду от источника к клумбе.",
    "guideRulesTitle": "Как играть",
    "guideRule1": "Выберите открытый канал. Нажмите на трубу, чтобы повернуть её по часовой стрелке. Отверстия соседних труб должны совпадать.",
    "guideRule2": "Проследите путь от источника к клумбе и найдите разрывы. Соедините путь, чтобы открыть следующий канал.",
    "guideRecovery": "Отмена возвращает последний поворот. Подсказка отмечает трубу и следующий стык, но повернуть её нужно самостоятельно. Перезапуск восстанавливает головоломку. Повторяйте пройденное, сокращая число поворотов. Прогресс хранится в этом браузере.",
    "faqTitle": "Частые вопросы",
    "faqQuestion": "Как завершить водный путь?",
    "faqAnswer": "Создайте непрерывный путь от источника к клумбе. Соседние отверстия должны совпадать вдоль этого пути; соединять все неиспользуемые трубы не требуется.",
    "guideOverviewTitle": "Проведите воду к клумбе",
    "guideOverview": "Источник и клумба — два конца каждой бамбуковой головоломки 5×5. Поворачивайте трубы на месте, чтобы создать непрерывный водный путь; сама чаша клумбы не поворачивается. Посмотрите, какие трубы уже наполнены, и проверьте следующий сухой стык. Вода проходит между клетками, только когда их отверстия обращены друг к другу. Ближайшая труба не обязательно нужна для вашего пути.",
    "guideProgressTitle": "Тридцать каналов по порядку",
    "guideProgress": "Кампания состоит из 30 фиксированных головоломок: шесть групп по пять. Первые схемы знакомят с прямыми участками и поворотами; затем появляются сочетания развилок и отвлекающих ответвлений. Завершённый канал открывает следующий, а пройденные задачи доступны повторно. На экране результата показано число поворотов; можно повторить задачу или продолжить. Та же схема позволяет улучшать сохранённый минимум поворотов, а не привыкать к новому полю при каждой попытке.",
    "guideDesignTitle": "О замысле: следите за водой",
    "guideDesign": "Клетки не перемещаются — меняется только направление отверстий. Важен выбор соединений, а не точность перетаскивания. Следуйте по мокрым трубам от источника, а у сложной развилки попробуйте рассуждать от клумбы назад. Отмена и видимая подсказка позволяют пересмотреть один поворот без замены головоломки. Заполнять все 25 клеток не нужно: достаточно довести воду до чаши.",
    "guideSaveTitle": "Управление и сохранение",
    "guideSave": "Поворачивайте трубы касанием или мышью; также поддерживаются выбор и активация с клавиатуры. Аккаунт и покупки не нужны. Пройденные каналы, последняя открытая задача и лучшие числа поворотов хранятся в этом браузере, если доступно локальное хранилище. Облачного сохранения нет. Очистка данных сайта или смена браузера может удалить записи. Незавершённая расстановка труб не сохраняется при перезагрузке страницы.",
    "faqUnusedQuestion": "Должна ли вода попасть в каждую трубу?",
    "faqUnusedAnswer": "Нет. Проверяется достижение чаши, а не заполнение всех клеток. Не трогайте ненужные ответвления, если это не помогает вашему пути.",
    "faqHintQuestion": "Подсказка поворачивает трубу за меня?",
    "faqHintAnswer": "Нет. Она отмечает трубу и следующий полезный стык на задуманном пути. Повороты выбираете вы. Отмена возвращает предыдущий поворот, а перезапуск восстанавливает текущую головоломку.",
    "faqTimerQuestion": "Можно ли проиграть, если долго думать?",
    "faqTimerAnswer": "Поражения по таймеру нет. Спокойно проверяйте отверстия. При повторе старайтесь сократить число поворотов; подсказка не мешает открыть следующий канал.",
    "relatedTitle": "Похожие игры",
    "relatedIntro": "Попробуйте другие способы планировать пути в этих играх WeightPlay.",
    "relatedOneDescription": "Проводите непрерывную линию, обходя стены и движущиеся препятствия.",
    "relatedCrateDescription": "Планируйте толкание ящиков и оставляйте свободные пути к их целям.",
    "tagRotation": "Поворот труб",
    "tagPuzzle": "Головоломка",
    "tagRoutes": "Планирование пути"
  },
  "hi": {
    "summary": "बाँस की नलियाँ घुमाकर झरने का पानी फूलों की क्यारी तक पहुँचाएँ।",
    "guideRulesTitle": "कैसे खेलें",
    "guideRule1": "खुला जलमार्ग चुनें। नली को छूकर घड़ी की दिशा में घुमाएँ। पानी तभी बहता है जब पास की नलियों के मुहाने मिलते हैं।",
    "guideRule2": "झरने से क्यारी तक रास्ता देखें और टूटे जोड़ खोजें। रास्ता जोड़कर अगला जलमार्ग खोलें।",
    "guideRecovery": "वापस आखिरी घुमाव को उलटता है। संकेत एक नली और अगला जोड़ दिखाता है; नली आपको घुमानी है। फिर शुरू से पहेली की शुरुआती स्थिति लौटती है। कम घुमाव के लिए पूरे जलमार्ग दोबारा खेलें। प्रगति इसी ब्राउज़र में सहेजी जाती है।",
    "faqTitle": "अक्सर पूछे गए प्रश्न",
    "faqQuestion": "जलमार्ग कैसे पूरा करें?",
    "faqAnswer": "झरने से क्यारी तक लगातार रास्ता बनाएँ। उस रास्ते की पास-पास वाली नलियों के मुहाने मिलने चाहिए; बाकी सभी नलियाँ जोड़ना ज़रूरी नहीं है।",
    "guideOverviewTitle": "झरने का पानी क्यारी तक पहुँचाएँ",
    "guideOverview": "हर 5×5 बाँस पहेली में झरना शुरुआत और फूलों की क्यारी मंज़िल है। नलियों को उनकी जगह पर घुमाकर लगातार जलमार्ग बनाएँ; क्यारी का पात्र नहीं घूमता। देखें कि किन नलियों में पानी आ चुका है और अगला सूखा जोड़ जाँचें। पानी एक खाने से दूसरे में तभी जाता है जब दोनों मुहाने आमने-सामने हों। पास दिखाई देने वाली हर नली आपके रास्ते के लिए ज़रूरी नहीं है।",
    "guideProgressTitle": "एक-एक करके तीस जलमार्ग",
    "guideProgress": "अभियान में 30 निश्चित पहेलियाँ हैं, जो पाँच-पाँच के छह समूहों में बँटी हैं। शुरुआती बनावट में सीधे हिस्से और मोड़ समझ में आते हैं; आगे शाखाएँ और भटकाने वाले रास्ते मिलते हैं। जलमार्ग पूरा करने पर अगली पहेली खुलती है और पूरी की गई पहेलियाँ दोबारा खेल सकते हैं। परिणाम में घुमावों की संख्या दिखती है और दोबारा खेलने या आगे जाने का विकल्प मिलता है। उसी बनावट पर खेलकर अपने सहेजे गए सबसे कम घुमावों के रिकॉर्ड को बेहतर बनाएँ।",
    "guideDesignTitle": "डिज़ाइन की बात: पानी का रास्ता देखें",
    "guideDesign": "खाने अपनी जगह रहते हैं, केवल नलियों के मुहानों की दिशा बदलती है। इसलिए सटीक खींचने से अधिक सही जोड़ चुनना अहम है। झरने से भरी हुई नलियों के साथ आगे बढ़ें और उलझी शाखा पर क्यारी से पीछे की ओर भी सोचें। वापस करने और दिखाई देने वाले संकेत से उसी पहेली में एक घुमाव पर दोबारा विचार कर सकते हैं। सभी 25 खाने भरना लक्ष्य नहीं है; पानी का पात्र तक पहुँचना पर्याप्त है।",
    "guideSaveTitle": "नियंत्रण और सेव की जानकारी",
    "guideSave": "नली घुमाने के लिए टच या माउस इस्तेमाल करें; कीबोर्ड से चयन और सक्रिय करना भी समर्थित है। खाते या खरीद की ज़रूरत नहीं है। स्थानीय स्टोरेज उपलब्ध होने पर पूरे जलमार्ग, सबसे आगे खुली पहेली और न्यूनतम घुमावों के रिकॉर्ड इसी ब्राउज़र में सहेजे जाते हैं। यह क्लाउड सेव नहीं है। साइट का डेटा साफ़ करने या ब्राउज़र बदलने से रिकॉर्ड मिट सकते हैं। पेज दोबारा लोड करने पर अधूरी नलियों की व्यवस्था नहीं रहती।",
    "faqUnusedQuestion": "क्या हर नली में पानी पहुँचना चाहिए?",
    "faqUnusedAnswer": "नहीं। पानी का क्यारी तक पहुँचना जाँचा जाता है, हर खाने का भरना नहीं। गैरज़रूरी शाखाएँ तब तक न बदलें जब तक उनसे रास्ता बनाने में मदद न मिले।",
    "faqHintQuestion": "क्या संकेत नली अपने आप घुमाता है?",
    "faqHintAnswer": "नहीं। वह नियोजित रास्ते की एक नली और अगला उपयोगी जोड़ दिखाता है। घुमाव आपको चुनने हैं। वापस करने से आखिरी घुमाव उलटता है और फिर शुरू करने से मौजूदा पहेली शुरुआती स्थिति में आती है।",
    "faqTimerQuestion": "ज़्यादा समय लेने से हार सकते हैं?",
    "faqTimerAnswer": "उलटी गिनती के कारण हार नहीं होती। मुहाने आराम से जाँचें। दोबारा खेलते समय कम घुमावों का लक्ष्य रखें; संकेत लेने से अगला जलमार्ग खुलना नहीं रुकता।",
    "relatedTitle": "संबंधित गेम",
    "relatedIntro": "इन WeightPlay खेलों में रास्ते की योजना बनाने के दूसरे तरीके आज़माएँ।",
    "relatedOneDescription": "दीवारों और चलती बाधाओं से बचते हुए लगातार रास्ता खींचें।",
    "relatedCrateDescription": "डिब्बों को धकेलने का क्रम तय करें और उनकी मंज़िल तक रास्ता खुला रखें।",
    "tagRotation": "नली घुमाना",
    "tagPuzzle": "पहेली",
    "tagRoutes": "रास्ते की योजना"
  },
  "ar": {
    "summary": "أدر أنابيب الخيزران لإيصال ماء النبع إلى حوض الزهور.",
    "guideRulesTitle": "طريقة اللعب",
    "guideRule1": "اختر مجرى مفتوحًا. المس الأنبوب لتدويره مع عقارب الساعة؛ يجب أن تتطابق فتحات الأنابيب المتجاورة ليمر الماء.",
    "guideRule2": "تتبّع الطريق من النبع إلى الزهور وابحث عن الوصلات المقطوعة. أكمل الاتصال لفتح المجرى التالي.",
    "guideRecovery": "التراجع يلغي آخر تدوير. التلميح يحدد أنبوبًا ووصلته التالية، لكن عليك تدويره بنفسك. إعادة البدء تعيد اللغز إلى بدايته. أعد المجاري المكتملة لتقليل عدد الدورات. يُحفظ التقدم في هذا المتصفح.",
    "faqTitle": "الأسئلة الشائعة",
    "faqQuestion": "كيف أكمل المجرى؟",
    "faqAnswer": "أنشئ طريقًا متصلًا من النبع إلى حوض الزهور. يجب أن تتقابل الفتحات المتجاورة على هذا الطريق؛ ولا يلزم توصيل جميع الأنابيب غير المستخدمة خارجه.",
    "guideOverviewTitle": "أوصل ماء النبع إلى الزهور",
    "guideOverview": "يمثل النبع وحوض الزهور طرفي كل لغز خيزران بحجم 5×5. أدر الأنابيب في أماكنها لتكوين مجرى متصل؛ الحوض نفسه لا يدور. راقب الأنابيب التي وصلها الماء ثم افحص الوصلة الجافة التالية. لا يعبر الماء بين خانتين إلا عندما تتقابل فتحتاهما. ليس كل أنبوب قريب جزءًا من الطريق الذي تحتاجه.",
    "guideProgressTitle": "ثلاثون مجرى خطوة بخطوة",
    "guideProgress": "تضم الحملة 30 لغزًا ثابتًا موزعة على ست مجموعات من خمسة. تعرّفك الترتيبات الأولى بالمقاطع المستقيمة والمنعطفات، ثم تجمع الترتيبات اللاحقة تفرعات ومسارات جانبية مضللة. إكمال مجرى يفتح التالي، وتبقى الألغاز المكتملة متاحة للإعادة. تعرض النتيجة عدد مرات التدوير وتتيح الإعادة أو المتابعة. إعادة الترتيب نفسه تسمح بتحسين أقل عدد محفوظ بدل التكيف مع لوحة جديدة في كل محاولة.",
    "guideDesignTitle": "عن التصميم: اتبع الماء",
    "guideDesign": "تبقى الخانات ثابتة وتتغير اتجاهات فتحات الأنابيب فقط. لذلك يعتمد القرار على الوصلات لا على دقة السحب. تتبّع الأنابيب المبتلة من النبع، وفكّر من الحوض إلى الخلف عند التفرع المربك. يتيح التراجع والتلميح المرئي إعادة التفكير في تدوير واحد دون تبديل اللغز. لا يلزم ملء الخانات الخمس والعشرين كلها؛ يكفي وصول الماء إلى الحوض.",
    "guideSaveTitle": "التحكم والحفظ",
    "guideSave": "استخدم اللمس أو الماوس لتدوير الأنابيب؛ ويمكن أيضًا الاختيار والتفعيل بلوحة المفاتيح. لا يلزم حساب أو شراء. تُحفظ المجاري المكتملة وآخر مرحلة مفتوحة وأفضل أعداد التدوير في هذا المتصفح عندما يتوفر التخزين المحلي. هذا ليس حفظًا سحابيًا. قد يؤدي مسح بيانات الموقع أو تغيير المتصفح إلى فقدان السجلات. لا يبقى ترتيب الأنابيب غير المكتمل بعد إعادة تحميل الصفحة.",
    "faqUnusedQuestion": "هل يجب أن يصل الماء إلى كل أنبوب؟",
    "faqUnusedAnswer": "لا. يُفحص وصول الماء إلى الحوض، لا ابتلال كل خانة. اترك التفرعات غير اللازمة كما هي ما لم يساعد تغييرها على تكوين طريقك.",
    "faqHintQuestion": "هل يدير التلميح الأنبوب بدلًا مني؟",
    "faqHintAnswer": "لا. يحدد أنبوبًا والوصلة المفيدة التالية على الطريق المقصود. تظل أنت من يختار التدوير. يلغي التراجع آخر تدوير، وتعيد إعادة البدء اللغز الحالي إلى بدايته.",
    "faqTimerQuestion": "هل أخسر إذا استغرقت وقتًا طويلًا؟",
    "faqTimerAnswer": "لا توجد خسارة بسبب عد تنازلي. افحص الفتحات بهدوء. حاول استخدام تدويرات أقل عند الإعادة؛ واستعمال التلميح لا يمنع فتح المجرى التالي.",
    "relatedTitle": "ألعاب ذات صلة",
    "relatedIntro": "جرّب طرقًا أخرى لتخطيط المسارات في ألعاب WeightPlay هذه.",
    "relatedOneDescription": "ارسم طريقًا متصلًا مع تجنب الجدران والعوائق المتحركة.",
    "relatedCrateDescription": "خطط لدفع الصناديق وأبقِ الطرق إلى وجهاتها مفتوحة.",
    "tagRotation": "تدوير الأنابيب",
    "tagPuzzle": "ألغاز",
    "tagRoutes": "تخطيط المسارات"
  }
};
  const cards = [
  {
    "id": "animal-one-line",
    "cover": "/assets/animal-one-line-cover.webp",
    "description": "relatedOneDescription"
  },
  {
    "id": "animal-cratebound",
    "cover": "/assets/animal-cratebound/cover.webp",
    "description": "relatedCrateDescription"
  }
];

  for (const [code, values] of Object.entries(copy)) Object.assign(window.BAMBOO_LOCALES[code], values);
  const routes = { en:'en', 'zh-Hant':'zh-tw', 'zh-Hans':'zh-cn', ja:'ja', ko:'ko', es:'es', 'pt-BR':'pt-br', fr:'fr', de:'de', it:'it', ru:'ru', hi:'hi', ar:'ar' };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function inner(code) {
    const c = copy[code];
    if (!c || !routes[code]) return '';
    const title = gameId => {
      const value = window.WEIGHTPLAY_GAME_TITLES?.[gameId]?.[code];
      if (!value) throw new Error('Missing official localized title: ' + gameId + '/' + code);
      return escape(value);
    };
    const paragraph = key => '<p>' + escape(c[key]) + '</p>';
    const section = (heading, body) => '<div class="game-info-section"><h3>' + escape(c[heading]) + '</h3>' + body + '</div>';
    const faq = [['faqQuestion','faqAnswer'],['faqUnusedQuestion','faqUnusedAnswer'],['faqHintQuestion','faqHintAnswer'],['faqTimerQuestion','faqTimerAnswer']]
      .map(([q,a]) => '<div><dt>' + escape(c[q]) + '</dt><dd>' + escape(c[a]) + '</dd></div>').join('');
    const related = cards.map(card => '<a class="game-info-related-card" data-wp-related-id="' + card.id + '" href="/' + routes[code] + '/games/' + card.id + '/"><img src="' + card.cover + '" alt="" width="320" height="320" loading="lazy" decoding="async"><span class="game-info-related-copy"><strong>' + title(card.id) + '</strong><span>' + escape(c[card.description]) + '</span></span></a>').join('');
    const tags = ['tagRotation','tagPuzzle','tagRoutes'].map(key => '<span>' + escape(c[key]) + '</span>').join('');
    const core = '<ol><li>' + escape(c.guideRule1) + '</li><li>' + escape(c.guideRule2) + '</li></ol>' + paragraph('guideRecovery');
    return '<div class="game-info-hero"><div class="game-info-title"><h2>' + title('animal-bamboo-pipes') + '</h2>' + paragraph('summary') + '<div class="game-info-tags" data-bamboo-gameplay-tags>' + tags + '</div></div></div><div class="game-info-sections">'
      + section('guideOverviewTitle', paragraph('guideOverview')) + section('guideRulesTitle', core)
      + section('guideProgressTitle', paragraph('guideProgress')) + section('guideDesignTitle', paragraph('guideDesign'))
      + section('guideSaveTitle', paragraph('guideSave')) + section('faqTitle', '<dl>' + faq + '</dl>')
      + section('relatedTitle', paragraph('relatedIntro') + '<div class="game-info-related">' + related + '</div>') + '</div>'
      + (window.WeightPlayGameInfo?.marketComparisonHtml?.('animal-bamboo-pipes', code) || '');
  }
  function html(code) {
    if (!copy[code]) return '';
    const label = window.BAMBOO_LOCALES[code].guideTitle;
    return '<section id="publicGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-wp-guide-complete="true" data-wp-guide-depth="true" data-runtime-localize="off" lang="' + code + '" dir="' + (code === 'ar' ? 'rtl' : 'ltr') + '" aria-label="' + escape(label) + '">' + inner(code) + '</section>';
  }

  // Initial accessibility labels and native locale changes share this catalog.
  function localizeShell(markup, code) {
    const c = window.BAMBOO_LOCALES[code];
    if (!c || !routes[code]) throw new Error('Unsupported Bamboo locale: ' + code);
    const attribute = (tag, name, value) => {
      const pattern = new RegExp('\\s' + name + '=(?:"[^"]*"|\'[^\']*\')', 'i');
      const replacement = ' ' + name + '="' + escape(value) + '"';
      return pattern.test(tag) ? tag.replace(pattern, replacement) : tag.replace(/\s*\/?>(?=$)/, replacement + '>');
    };
    markup = markup.replace(/<(?:a|button|div|nav|select|img|span)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi, tag => {
      const id = tag.match(/\bid=["']([^"']+)["']/i)?.[1];
      let key = {rail:'stageSelector',board:'boardLabel',battleUtilityBtn:'settings',battleSettingsPanel:'settings',locale:'language',battleLocale:'language'}[id];
      if (/\bdata-wp-return=["']main["']/i.test(tag)) key = 'returnLobby';
      if (/\bdata-back(?:\s|=|>)/i.test(tag)) key = 'back';
      if (/^<nav\b/i.test(tag) && /\bclass=["'][^"']*\bstage-tabs\b/.test(tag)) key = 'waterways';
      if (key) {
        if (!c[key]) throw new Error('Missing Bamboo label: ' + code + '/' + key);
        tag = attribute(attribute(tag, 'data-bamboo-aria', key), 'aria-label', c[key]);
      }
      if (id === 'battleLanguageLabel') tag = attribute(tag, 'data-bamboo-t', 'language');
      if (/^<img\b/i.test(tag) && /\bsrc=["'][^"']*\/animal-bamboo-pipes\.webp["']/i.test(tag)) {
        tag = attribute(attribute(tag, 'data-bamboo-alt', 'coverAlt'), 'alt', c.coverAlt);
      }
      return tag;
    });
    return markup.replace(/(<([a-z][\w-]*)\b[^>]*\bdata-bamboo-t=["']([^"']+)["'][^>]*>)([^<]*)(<\/\2>)/gi, (whole, open, tag, key, text, close) => {
      if (typeof c[key] !== 'string') throw new Error('Missing Bamboo text: ' + code + '/' + key);
      return open + escape(c[key]) + close;
    });
  }

  window.BAMBOO_GUIDE = Object.freeze({ html, inner, escape, localizeShell, apply(code) {
    if (!copy[code]) return;
    const active = window.BAMBOO_LOCALES[code];
    for (const [selector, field, attr] of [['[data-bamboo-aria]','bambooAria','aria-label'],['[data-bamboo-alt]','bambooAlt','alt']]) {
      document.querySelectorAll(selector).forEach(element => {
        const key = element.dataset[field];
        if (typeof active[key] !== 'string') throw new Error('Missing Bamboo attribute: ' + code + '/' + key);
        element.setAttribute(attr, active[key]);
      });
    }
    const node = document.getElementById('publicGuide');
    if (!node) return;
    const content = inner(code);
    if (node.innerHTML !== content) node.innerHTML = content;
    node.dataset.runtimeLocalize = 'off';
    node.setAttribute('lang', code); node.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr');
    node.setAttribute('aria-label', window.BAMBOO_LOCALES[code].guideTitle);
  }});
})();
