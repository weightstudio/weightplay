(() => {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = (id) => document.getElementById(id);
  const KEYS = ["title","language","sound","genre","pitch","start","guideKicker","guideTitle","howTitle","how1","how2","how3","mechanicsTitle","mechanics","chooseStage","stageHint","enter","movesLabel","leftLabel","objective","hint","restart","helpText","continue","leaveTitle","leaveText","stageMap","clear","next","retry","blocked","locked","frozen","rotated","hinted","deadlock","keyFound","thawed","result","basics","interlock","walls","rotation","locksIce","mixed","tgProgressTitle","tgTipsTitle","tgDesignTitle","tgSaveTitle","tgFaqTitle","tgRelatedTitle","tgLoading","tgBackMain","tgBackLobby","tgSound","tgStage","tgTag1","tgTag2","tgTag3","tgProgress","tgTips","tgDesign","tgSave","tgRelatedWhy1","tgRelatedWhy2","tgRelatedName1","tgRelatedName2","tgFaqQ1","tgFaqA1","tgFaqQ2","tgFaqA2","tgFaqQ3","tgFaqA3","tgFaqQ4","tgFaqA4","tgFaqQ5","tgFaqA5","tgFaqQ6","tgFaqA6"];
  const PACKS = {
    "en":["Arrow Escape","Language","Sound","ORDER PUZZLE","Clear every arrow block.","Start Game","Stages and progression","Follow the arrow, but plan the order.","How to play","Tap a block to trace its full arrow path, including the route after a portal.","If the whole route is clear, the block escapes. If blocked, no move is spent and the first obstacle is shown.","Choose the next action from the obstruction shown. Remove a blocking arrow only if its route is free; walls cannot be removed. Use Hint when you need help finding a safe move.","Thirty stages","Walls, rotating arrows, keys, ice, portals and one-way gates arrive in six teaching bands.","Choose a Stage","Swipe or scroll. Select an unlocked stage, then enter.","Enter Stage","Moves","Left","Clear every arrow block.","Hint","Restart","Trace the complete route before tapping, especially beyond portals and one-way gates. A blocked test costs no move, so use the shown obstacle to decide what must clear first.","Continue","Leave this attempt?","Continue keeps the exact board. Stage Map restarts this attempt later.","Stage Map","Stage Cleared!","Next Stage","Play Again","Blocked by {target}. Remove it first.","This block is locked. Find its key.","This block is frozen. Remove an adjacent block.","Arrow rotated. Test its new path.","One safe action is highlighted.","No safe action remains. Restart this stage.","Key collected. Matching locks opened.","Adjacent ice thawed.","Cleared in {n} moves.","BASICS","INTERLOCK","WALLS","ROTATION","LOCKS + ICE","MIXED","Stages and progression","Planning your next move","How the puzzle works","Player and save information","Frequently asked questions","Related games","Preparing the game…","Back to Main","Back to WeightPlay","Sound","Stage","Logic puzzle","Directional block removal","Portal paths","Clear 30 stages across six chapters. Early boards introduce escape order; later boards add walls, turning arrows, keys, frozen blocks, paired portals and one-way gates. Clearing a stage unlocks the next, and completed stages can be replayed.","Check beyond the nearest gap: another block or a wall farther along the route can still stop an arrow. Remove a blocking arrow only when its own route is clear. Walls stay in place; a turning arrow must change direction before it can escape. Keys release matching locks, and removing a neighboring block thaws ice.","A portal does not end the route: the arrow continues in the same direction beyond its paired exit. A one-way gate admits only its marked direction. Read the full path rather than assuming that an empty neighboring cell means an arrow can leave.","Tap or click an arrow; keyboard users can focus buttons and activate them. No account is needed. Stage unlocks and preferences stay in this browser, but returning to the stage map does not save the unfinished board. Clearing browser data can erase progress; it does not automatically transfer to another device.","Slide blocks to open an exit.","Toggle lights and their neighbors to clear the board.","Unblock Trail","Lights Out","How many stages are included?","There are 30 handcrafted stages across six rule chapters, and Stage 30 remains replayable.","Does a blocked tap use a move?","No. It identifies the first blocker and leaves the board unchanged.","Does Hint solve the puzzle automatically?","No. Hint marks and focuses one safe next arrow, but you still choose whether to play it.","Can several arrows move at once?","Yes. You can tap another arrow with a clear route without waiting for the previous escape animation to finish.","How do portals work?","An arrow enters one portal and continues in the same direction immediately beyond the paired exit.","Is progress saved?","Stage unlocks and preferences are stored locally in this browser."],
    "zh-Hant":["箭頭大逃亡","語言","聲音","順序益智","清空所有箭頭方塊。","開始遊戲","關卡與進度","看清箭頭，更要安排順序。","玩法說明","點擊方塊，檢查箭頭的完整路徑；若經過傳送門，也要看出口後的路線。","整條路徑暢通就會滑出；若受阻，不會消耗步數，並會標出第一個阻擋物。","依標出的障礙判斷下一步。若阻擋物是路線暢通的箭頭，就先移除它；牆壁不能清除。找不到安全走法時，可使用提示。","三十個關卡","六個教學階段依序加入牆壁、旋轉箭頭、鑰匙、冰凍、傳送門與單向門。","選擇關卡","滑動或捲動，選擇已解鎖關卡後進入。","進入關卡","步數","剩餘","清空所有箭頭方塊。","提示","重新開始","點擊前先看完整路徑，尤其要檢查傳送門出口與單向門之後。受阻測試不會消耗步數，可依標出的障礙判斷先清哪一個。","繼續","要離開這次挑戰嗎？","繼續會保留目前棋盤；回關卡地圖後下次會重新開始。","關卡地圖","關卡完成！","下一關","再玩一次","路徑受阻：{target}擋住了路，請先移除它。","方塊已上鎖，請先找到鑰匙。","方塊被冰凍，請移除相鄰方塊。","箭頭已旋轉，請檢查新路徑。","已標示一個安全動作。","目前沒有安全動作，請重新開始。","取得鑰匙，對應的鎖已開啟。","相鄰冰塊已解凍。","使用 {n} 步完成。","基礎","互相阻擋","牆壁","旋轉","鎖與冰凍","混合機制","關卡與進度","下一步怎麼選","解謎方式","玩家與存檔資訊","常見問題","相關遊戲","正在準備遊戲…","返回主畫面","返回 WeightPlay","音效","關卡","邏輯益智","方向方塊消除","傳送門路徑","共有六章、30 關。前期先熟悉離場順序，後期加入牆壁、轉向箭頭、鑰匙、冰凍方塊、成對傳送門與單向門。完成本關會解鎖下一關，已完成的關卡也能重玩。","不要只看最近的空格，路徑更遠處的方塊或牆壁仍可能擋住箭頭。先確認阻擋箭頭自己的路線暢通，再將它移除。牆壁不會消失；轉向箭頭要先改變方向才能離場。鑰匙會解除對應的鎖，移除相鄰方塊則能讓冰凍方塊解凍。","傳送門不是終點：箭頭穿過後，會從另一端出口外繼續朝原方向前進。單向門只允許標示方向通過。判斷時要看完整路徑，不能只因為旁邊有空格，就認為箭頭能離場。","可用觸控或滑鼠點選箭頭，也可用鍵盤聚焦並啟動按鈕。不必登入帳號。解鎖進度與偏好保存在此瀏覽器，返回關卡地圖不會保存未完成的盤面。清除瀏覽器資料可能清掉進度，其他裝置也不會自動取得這份存檔。","滑動方塊，清出通往出口的路線。","切換燈光與相鄰燈格，讓盤面全部熄滅。","解鎖滑塊","熄燈遊戲","共有多少關？","共有 30 個手工設計關卡，分成六個規則章節；第 30 關完成後仍可重玩。","點到受阻箭頭會消耗步數嗎？","不會。遊戲只會標出第一個障礙，棋盤保持不變。","提示會自動解題嗎？","不會。提示只會標出並聚焦一個安全箭頭，是否執行仍由玩家決定。","可以連續快速點多個箭頭嗎？","可以。只要另一個箭頭的路線暢通，就能直接點選，不必等前一個箭頭的離場動畫播完。","傳送門怎麼運作？","箭頭會從其中一個傳送門進入，並從成對出口沿相同方向繼續。","進度會儲存嗎？","關卡解鎖與偏好會儲存在目前瀏覽器。"],
    "zh-Hans":["箭头大逃亡","语言","声音","顺序益智","清空所有箭头方块。","开始游戏","关卡与进度","看清箭头，更要安排顺序。","玩法说明","点击方块，检查箭头的完整路径；若经过传送门，也要看出口后的路线。","整条路径畅通就会滑出；若受阻，不会消耗步数，并会标出第一个阻挡物。","依标出的障碍判断下一步。若阻挡物是路线畅通的箭头，就先移除它；墙壁不能清除。找不到安全走法时，可使用提示。","三十个关卡","六个教学阶段依次加入墙壁、旋转箭头、钥匙、冰冻、传送门和单向门。","选择关卡","滑动或滚动，选择已解锁关卡后进入。","进入关卡","步数","剩余","清空所有箭头方块。","提示","重新开始","点击前先看完整路径，尤其要检查传送门出口与单向门之后。受阻测试不会消耗步数，可依标出的障碍判断先清哪一个。","继续","要离开这次挑战吗？","继续会保留当前棋盘；返回关卡地图后下次会重新开始。","关卡地图","关卡完成！","下一关","再玩一次","路径受阻：{target}挡住了路，请先移除它。","方块已上锁，请先找到钥匙。","方块被冻结，请移除相邻方块。","箭头已旋转，请检查新路径。","已标示一个安全动作。","当前没有安全动作，请重新开始。","取得钥匙，对应的锁已开启。","相邻冰块已解冻。","使用 {n} 步完成。","基础","互相阻挡","墙壁","旋转","锁与冰冻","混合机制","关卡与进度","下一步怎么选","解谜方式","玩家与存档信息","常见问题","相关游戏","正在准备游戏…","返回主画面","返回 WeightPlay","音效","关卡","逻辑益智","方向方块消除","传送门路径","共有六章、30 关。前期先熟悉离场顺序，后期加入墙壁、转向箭头、钥匙、冰冻方块、成对传送门与单向门。完成本关会解锁下一关，已完成的关卡也能重玩。","不要只看最近的空格，路径更远处的方块或墙壁仍可能挡住箭头。先确认阻挡箭头自己的路线畅通，再将它移除。墙壁不会消失；转向箭头要先改变方向才能离场。钥匙会解除对应的锁，移除相邻方块则能让冰冻方块解冻。","传送门不是终点：箭头穿过后，会从另一端出口外继续朝原方向前进。单向门只允许标示方向通过。判断时要看完整路径，不能只因为旁边有空格，就认为箭头能离场。","可用触控或鼠标点选箭头，也可用键盘聚焦并启动按钮。不必登录账号。解锁进度与偏好保存在此浏览器，返回关卡地图不会保存未完成的盘面。清除浏览器数据可能清掉进度，其他设备也不会自动取得这份存档。","滑动方块，清出通往出口的路线。","切换灯光与相邻灯格，让盘面全部熄灭。","解锁滑块","熄灯游戏","共有多少关？","共有 30 个手工设计关卡，分成六个规则章节；第 30 关完成后仍可重玩。","点到受阻箭头会消耗步数吗？","不会。游戏只会标出第一个障碍，棋盘保持不变。","提示会自动解题吗？","不会。提示只会标出并聚焦一个安全箭头，是否执行仍由玩家决定。","可以连续快速点多个箭头吗？","可以。只要另一个箭头的路线畅通，就能直接点选，不必等前一个箭头的离场动画播完。","传送门怎么运作？","箭头会从一个传送门进入，并从成对出口沿相同方向继续。","进度会保存吗？","关卡解锁与偏好会保存在当前浏览器。"],
    "ja":["アロー・エスケープ","言語","サウンド","順序パズル","すべての矢印ブロックを消す。","ゲーム開始","ステージと進行","矢印を見て、順番を考えよう。","遊び方","ブロックをタップし、ポータルの出口後も含めて矢印の全経路を確認します。","経路全体が空いていれば脱出します。塞がっていても手数は減らず、最初の障害物が表示されます。","表示された障害物から次の操作を考えましょう。邪魔な矢印は、その経路が空いている場合に取り除けます。壁は消せません。安全な一手が分からないときはヒントを使えます。","30ステージ","壁、回転、鍵、氷、ポータル、一方通行ゲートを6段階で学びます。","ステージ選択","スワイプして解放済みステージを選びます。","入る","手数","残り","すべての矢印ブロックを消す。","ヒント","やり直す","タップ前に全経路をたどり、特にポータルの出口後と一方通行ゲートの先を確認してください。塞がった確認では手数を使わないので、表示された障害物から先に消す対象を判断できます。","続ける","この挑戦を離れますか？","続けると盤面を維持します。マップへ戻ると次回は最初からです。","ステージマップ","ステージクリア！","次のステージ","もう一度","経路が塞がっています。{target}が先にあります。先に消してください。","ロック中です。鍵を探してください。","凍っています。隣接ブロックを消してください。","矢印が回転しました。新しい経路を確認してください。","安全な一手を表示しました。","安全な手がありません。やり直してください。","鍵を獲得し、対応するロックが開きました。","隣接する氷が溶けました。","{n}手でクリア。","基本","相互ブロック","壁","回転","鍵と氷","ミックス","ステージと進行","次の一手を考える","パズルの仕組み","プレイヤーと保存情報","よくある質問","関連ゲーム","ゲームを準備中…","メインに戻る","WeightPlayに戻る","サウンド","ステージ","ロジックパズル","方向ブロックの取り除き","ポータル経路","全6章、30ステージです。最初は取り除く順番を学び、後半では壁、方向転換する矢印、鍵、凍ったブロック、対のポータル、一方通行ゲートが加わります。クリアすると次が開き、クリア済みのステージも遊び直せます。","隣が空いていても、その先のブロックや壁に止められることがあります。邪魔な矢印を取り除く前に、その矢印の経路も確認しましょう。壁は消せません。方向転換する矢印は先に向きを変えます。鍵は対応するロックを解除し、隣のブロックを取り除くと氷が解けます。","ポータルは終点ではありません。矢印は対になる出口の先から同じ方向へ進みます。一方通行ゲートは表示された方向だけを通します。隣の空きマスだけでなく、最後まで経路を確かめましょう。","タップやクリックで矢印を選べます。キーボードではボタンにフォーカスして操作できます。アカウントは不要です。解放状況と設定はこのブラウザーに保存されますが、マップへ戻ると未完成の盤面は保存されません。ブラウザーデータの削除で進行状況が失われることがあり、別の端末には自動で引き継がれません。","ブロックをスライドさせて出口までの道を開きます。","ライトと隣のマスを切り替え、すべての明かりを消します。","アンブロック・トレイル","ライツアウト","ステージはいくつありますか？","6つのルール章に分かれた、手作りの30ステージがあります。ステージ30も繰り返し遊べます。","ふさがれた矢印を選ぶと手数を使いますか？","いいえ。最初の障害を示すだけで、盤面は変わりません。","ヒントはパズルを自動で解きますか？","いいえ。安全な次の矢印を示すだけで、実行するかどうかはプレイヤーが選びます。","複数の矢印を素早く動かせますか？","はい。別の矢印の経路が空いていれば、前の矢印の脱出アニメーションが終わる前にタップできます。","ポータルはどう動きますか？","矢印は一方のポータルに入り、対になった出口から同じ方向へ進みます。","進行状況は保存されますか？","ステージ解放と設定はこのブラウザにローカル保存されます。"],
    "ko":["화살표 탈출","언어","소리","순서 퍼즐","모든 화살표 블록을 제거하세요.","게임 시작","스테이지와 진행","화살표를 보고 순서를 계획하세요.","플레이 방법","블록을 눌러 포털 출구 뒤까지 포함한 화살표의 전체 경로를 확인하세요.","전체 경로가 비어 있으면 블록이 탈출합니다. 막혀도 이동 수는 쓰지 않으며 첫 번째 장애물이 표시됩니다.","표시된 장애물을 보고 다음 행동을 고르세요. 막고 있는 화살표는 자신의 경로가 비었을 때 제거할 수 있습니다. 벽은 지울 수 없습니다. 안전한 수가 보이지 않으면 힌트를 쓰세요.","30 스테이지","벽, 회전, 열쇠, 얼음, 포털, 일방통행 문을 여섯 단계로 배웁니다.","스테이지 선택","밀거나 스크롤해 열린 스테이지를 선택하세요.","입장","이동","남음","모든 화살표 블록을 제거하세요.","힌트","다시 시작","누르기 전에 전체 경로를 확인하고 특히 포털 출구와 일방통행 문 뒤를 살피세요. 막힌 확인은 이동 수를 쓰지 않으므로 표시된 장애물로 먼저 치울 대상을 판단할 수 있습니다.","계속","이번 도전을 나갈까요?","계속하면 현재 판을 유지합니다. 맵으로 가면 다음에는 다시 시작합니다.","스테이지 맵","스테이지 완료!","다음 스테이지","다시 플레이","경로가 {target}에 막혔습니다. 먼저 제거하세요.","잠겨 있습니다. 열쇠를 찾으세요.","얼어 있습니다. 인접 블록을 제거하세요.","화살표가 회전했습니다. 새 경로를 확인하세요.","안전한 행동 하나를 표시했습니다.","안전한 행동이 없습니다. 다시 시작하세요.","열쇠를 얻어 해당 잠금을 열었습니다.","인접 얼음이 녹았습니다.","{n}번 만에 완료.","기초","상호 차단","벽","회전","자물쇠와 얼음","혼합","스테이지와 진행","다음 수 고르기","퍼즐의 원리","플레이어 및 저장 정보","자주 묻는 질문","관련 게임","게임 준비 중…","메인으로 돌아가기","WeightPlay로 돌아가기","소리","스테이지","논리 퍼즐","방향 블록 제거","포털 경로","6개 챕터에 30개 스테이지가 있습니다. 초반에는 탈출 순서를 익히고, 이후 벽, 방향 전환 화살표, 열쇠, 얼어붙은 블록, 짝지어진 포털과 일방통행 문이 추가됩니다. 클리어하면 다음 스테이지가 열리며 완료한 스테이지도 다시 플레이할 수 있습니다.","옆 칸이 비어 있어도 경로 끝의 블록이나 벽이 화살표를 막을 수 있습니다. 막고 있는 화살표도 자신의 경로가 비었는지 먼저 확인하세요. 벽은 지울 수 없습니다. 방향 전환 화살표는 먼저 방향을 바꿔야 합니다. 열쇠는 해당 잠금을 풀고, 이웃 블록을 제거하면 얼음이 녹습니다.","포털은 경로의 끝이 아닙니다. 화살표는 짝이 되는 출구 너머에서 같은 방향으로 계속 갑니다. 일방통행 문은 표시된 방향으로만 통과할 수 있습니다. 바로 옆의 빈칸만 보지 말고 전체 경로를 확인하세요.","터치나 클릭으로 화살표를 고르거나 키보드로 버튼에 초점을 맞춰 실행할 수 있습니다. 계정은 필요하지 않습니다. 해금 상태와 설정은 이 브라우저에 저장되지만 스테이지 지도로 돌아가면 미완성 보드는 저장되지 않습니다. 브라우저 데이터를 지우면 진행 기록이 사라질 수 있으며 다른 기기로 자동 이전되지 않습니다.","블록을 밀어 출구로 가는 길을 여세요.","불빛과 이웃 칸을 전환해 모든 불을 끄세요.","언블록 트레일","라이트 아웃","스테이지는 몇 개입니까?","6개 규칙 장으로 나뉜 손수 만든 30개 스테이지가 있으며 30번도 다시 플레이할 수 있습니다.","막힌 화살표를 누르면 이동 수를 쓰나요?","아니요. 첫 장애물만 표시하고 보드는 바꾸지 않습니다.","힌트가 퍼즐을 자동으로 풀어 주나요?","아니요. 안전한 다음 화살표를 표시할 뿐이며 실행 여부는 플레이어가 선택합니다.","여러 화살표를 빠르게 움직일 수 있나요?","네. 다른 화살표의 길이 비어 있으면 앞선 화살표의 탈출 애니메이션이 끝나기 전에 바로 누를 수 있습니다.","포털은 어떻게 작동하나요?","화살표가 한 포털로 들어가 짝을 이루는 출구 너머에서 같은 방향으로 계속 갑니다.","진행 상황이 저장되나요?","스테이지 해제와 설정은 이 브라우저에 로컬로 저장됩니다."],
    "es":["Escape de Flechas","Idioma","Sonido","PUZLE DE ORDEN","Elimina todos los bloques.","Jugar","Niveles y progreso","Sigue la flecha y planea el orden.","Cómo jugar","Toca un bloque y revisa toda la ruta de la flecha, incluido el tramo después de un portal.","Si toda la ruta está libre, el bloque sale. Si está bloqueado, no gastas movimiento y se muestra el primer obstáculo.","Decide el siguiente paso según el obstáculo indicado. Retira una flecha que bloquea el paso solo si su ruta está libre; los muros no se eliminan. Usa Pista si necesitas encontrar un movimiento seguro.","Treinta niveles","Muros, giros, llaves, hielo, portales y puertas de un sentido llegan en seis bloques.","Elegir nivel","Desliza y elige un nivel desbloqueado.","Entrar","Movimientos","Restantes","Elimina todos los bloques.","Pista","Reiniciar","Revisa toda la ruta antes de tocar, sobre todo después de portales y puertas de un solo sentido. Probar una ruta bloqueada no gasta movimiento: usa el obstáculo marcado para decidir qué quitar primero.","Continuar","¿Salir del intento?","Continuar conserva el tablero; volver al mapa reinicia el intento después.","Mapa","¡Nivel superado!","Siguiente","Jugar de nuevo","Ruta bloqueada por {target}. Elimínalo primero.","Está bloqueado. Busca la llave.","Está congelado. Elimina un bloque adyacente.","La flecha giró. Comprueba la nueva ruta.","Se marcó una acción segura.","No quedan acciones seguras. Reinicia.","Llave recogida. Se abrieron los candados.","El hielo adyacente se derritió.","Completado en {n} movimientos.","BÁSICO","BLOQUEO","MUROS","GIRO","LLAVES + HIELO","MIXTO","Niveles y progreso","Planea el siguiente movimiento","Cómo funciona el puzle","Información del jugador y guardado","Preguntas frecuentes","Juegos relacionados","Preparando el juego…","Volver al inicio","Volver a WeightPlay","Sonido","Nivel","Puzle lógico","Retirar bloques direccionales","Rutas con portales","Supera 30 niveles en seis capítulos. Al principio aprendes el orden de salida; después aparecen muros, flechas que giran, llaves, bloques helados, portales emparejados y puertas de un solo sentido. Cada victoria abre el siguiente nivel y puedes repetir los completados.","No mires solo el hueco más cercano: un bloque o muro más lejano también puede detener la flecha. Retira una flecha que bloquea el paso solo si su propia ruta está libre. Los muros no se eliminan y las flechas giratorias deben cambiar de dirección primero. Las llaves abren sus cerraduras y retirar un bloque vecino descongela el hielo.","El portal no termina la ruta: la flecha continúa en la misma dirección más allá de la salida emparejada. Una puerta de un solo sentido solo permite la dirección marcada. Comprueba el recorrido completo, no solo la casilla contigua.","Toca o haz clic en una flecha; con teclado puedes enfocar y activar botones. No necesitas cuenta. Los niveles abiertos y las preferencias quedan en este navegador, pero volver al mapa no guarda el tablero sin terminar. Borrar los datos del navegador puede borrar el progreso, que no se transfiere automáticamente a otro dispositivo.","Desliza bloques para abrir el camino a la salida.","Alterna luces y sus vecinas para apagar todo el tablero.","Ruta de Desbloqueo","Apaga las luces","¿Cuántos niveles incluye?","Hay 30 niveles diseñados a mano en seis capítulos; el nivel 30 se puede repetir.","¿Una flecha bloqueada gasta un movimiento?","No. Señala el primer obstáculo y deja el tablero sin cambios.","¿Pista resuelve el puzle?","No. Solo marca una flecha segura; tú decides si la juegas.","¿Puedo tocar varias flechas rápidamente?","Sí. Puedes tocar otra flecha con la ruta libre sin esperar a que termine la animación de salida anterior.","¿Cómo funcionan los portales?","La flecha entra en un portal y continúa en la misma dirección desde la salida emparejada.","¿Se guarda el progreso?","Los niveles y las preferencias se guardan localmente en este navegador."],
    "pt-BR":["Fuga das Setas","Idioma","Som","QUEBRA-CABEÇA DE ORDEM","Remova todos os blocos.","Jogar","Fases e progresso","Siga a seta e planeje a ordem.","Como jogar","Toque em um bloco e confira todo o caminho da seta, inclusive depois de um portal.","Se o caminho inteiro estiver livre, o bloco sai. Se estiver bloqueado, nenhuma jogada é gasta e o primeiro obstáculo aparece.","Escolha a próxima ação pelo obstáculo indicado. Remova uma seta que bloqueia o caminho apenas se a rota dela estiver livre; paredes não podem ser removidas. Use a Dica para encontrar uma jogada segura.","Trinta fases","Paredes, giros, chaves, gelo, portais e portas de mão única chegam em seis blocos.","Escolher fase","Deslize e escolha uma fase liberada.","Entrar","Jogadas","Restam","Remova todos os blocos.","Dica","Reiniciar","Confira o caminho completo antes de tocar, principalmente depois de portais e portas de mão única. Testar um caminho bloqueado não gasta jogada; use o obstáculo marcado para decidir o que remover primeiro.","Continuar","Sair desta tentativa?","Continuar mantém o tabuleiro; voltar ao mapa reinicia depois.","Mapa de fases","Fase concluída!","Próxima fase","Jogar novamente","Caminho bloqueado por {target}. Remova-o primeiro.","Está trancado. Encontre a chave.","Está congelado. Remova um bloco vizinho.","A seta girou. Verifique o novo caminho.","Uma ação segura foi destacada.","Não há ação segura. Reinicie.","Chave coletada. As travas abriram.","O gelo vizinho derreteu.","Concluído em {n} jogadas.","BÁSICO","BLOQUEIO","PAREDES","GIRO","CHAVES + GELO","MISTO","Fases e progresso","Planeje a próxima jogada","Como funciona o quebra-cabeça","Informações do jogador e salvamento","Perguntas frequentes","Jogos relacionados","Preparando o jogo…","Voltar ao início","Voltar ao WeightPlay","Som","Fase","Quebra-cabeça lógico","Remoção de blocos direcionais","Caminhos com portais","Complete 30 fases em seis capítulos. No início, você aprende a ordem de saída; depois aparecem paredes, setas que giram, chaves, blocos congelados, portais em pares e portas de mão única. Cada vitória libera a fase seguinte, e as fases concluídas podem ser repetidas.","Não olhe só para o espaço mais próximo: um bloco ou uma parede adiante ainda pode impedir a saída. Remova uma seta que bloqueia o caminho apenas se a própria rota dela estiver livre. Paredes não desaparecem; setas giratórias precisam mudar de direção primeiro. Chaves abrem as fechaduras correspondentes, e remover um bloco vizinho descongela o gelo.","O portal não encerra o caminho: a seta continua na mesma direção após a saída do par. Uma porta de mão única só permite a direção indicada. Confira toda a rota, não apenas a casa ao lado.","Toque ou clique em uma seta; pelo teclado, você pode focar e ativar botões. Não é preciso ter conta. Fases liberadas e preferências ficam neste navegador, mas voltar ao mapa não salva o tabuleiro inacabado. Limpar os dados do navegador pode apagar o progresso, que não passa automaticamente para outro aparelho.","Deslize blocos para abrir o caminho até a saída.","Alterne luzes e suas vizinhas para apagar o tabuleiro.","Trilha Desbloqueio","Apague as Luzes","Quantas fases existem?","São 30 fases feitas à mão em seis capítulos de regras; a fase 30 continua disponível para rejogar.","Uma flecha bloqueada gasta uma jogada?","Não. Ela mostra o primeiro obstáculo e mantém o tabuleiro igual.","A Dica resolve o puzzle automaticamente?","Não. Ela marca e foca uma flecha segura, mas você decide se vai executá-la.","Posso mover várias flechas rapidamente?","Sim. Você pode tocar outra seta com caminho livre sem esperar a animação de saída anterior terminar.","Como funcionam os portais?","A flecha entra em um portal e continua na mesma direção além da saída correspondente.","O progresso é salvo?","As fases desbloqueadas e as preferências são salvas localmente neste navegador."],
    "fr":["Évasion des flèches","Langue","Son","PUZZLE D’ORDRE","Retirez tous les blocs.","Jouer","Niveaux et progression","Suivez la flèche et planifiez l’ordre.","Comment jouer","Touchez un bloc et vérifiez tout le trajet de la flèche, y compris après un portail.","Si tout le trajet est libre, le bloc sort. S'il est bloqué, aucun coup n'est dépensé et le premier obstacle est indiqué.","Choisissez l’action suivante selon l’obstacle indiqué. Retirez une flèche gênante seulement si son trajet est libre ; les murs ne se retirent pas. Utilisez l’indice pour trouver un coup sûr.","Trente niveaux","Murs, rotations, clés, glace, portails et portes à sens unique arrivent en six séries.","Choisir un niveau","Faites défiler et choisissez un niveau débloqué.","Entrer","Coups","Restants","Retirez tous les blocs.","Indice","Recommencer","Vérifiez tout le trajet avant de toucher, surtout après les portails et les portes à sens unique. Un essai bloqué ne coûte aucun coup : servez-vous de l'obstacle indiqué pour choisir quoi retirer d'abord.","Continuer","Quitter cette tentative ?","Continuer garde le plateau ; la carte relancera l’essai plus tard.","Carte","Niveau réussi !","Niveau suivant","Rejouer","Trajet bloqué par {target}. Retirez-le d’abord.","Ce bloc est verrouillé. Trouvez la clé.","Ce bloc est gelé. Retirez un voisin.","La flèche a tourné. Vérifiez le nouveau trajet.","Une action sûre est indiquée.","Aucune action sûre. Recommencez.","Clé récupérée. Les verrous sont ouverts.","La glace voisine a fondu.","Terminé en {n} mouvements.","BASE","BLOCAGE","MURS","ROTATION","CLÉS + GLACE","MIXTE","Niveaux et progression","Préparer le prochain coup","Le fonctionnement du puzzle","Informations du joueur et sauvegarde","Questions fréquentes","Jeux associés","Préparation du jeu…","Retour à l’accueil","Retour à WeightPlay","Son","Niveau","Puzzle logique","Retrait de blocs directionnels","Trajets avec portails","Terminez 30 niveaux répartis en six chapitres. Les premiers enseignent l’ordre de sortie ; les suivants ajoutent murs, flèches pivotantes, clés, blocs gelés, portails jumelés et portes à sens unique. Chaque réussite ouvre le niveau suivant, et les niveaux terminés restent rejouables.","Ne regardez pas seulement la case voisine : un bloc ou un mur plus loin peut encore arrêter la flèche. Retirez une flèche gênante seulement si son propre trajet est libre. Les murs ne disparaissent pas ; une flèche pivotante doit d’abord changer de direction. Les clés ouvrent les verrous correspondants et retirer un bloc voisin fait fondre la glace.","Le portail ne termine pas le trajet : la flèche poursuit dans la même direction au-delà de la sortie jumelée. Une porte à sens unique ne laisse passer que dans le sens indiqué. Vérifiez tout le parcours, pas uniquement la première case libre.","Touchez ou cliquez sur une flèche ; au clavier, vous pouvez sélectionner et activer les boutons. Aucun compte n’est nécessaire. Les niveaux ouverts et les préférences restent dans ce navigateur, mais revenir à la carte ne sauvegarde pas le plateau inachevé. Effacer les données du navigateur peut supprimer la progression ; elle ne passe pas automatiquement sur un autre appareil.","Faites glisser les blocs pour dégager la sortie.","Basculez les lumières et leurs voisines pour éteindre le plateau.","Piste Unblock","Extinction des lumières","Combien de niveaux sont inclus ?","Il y a 30 niveaux conçus à la main dans six chapitres de règles ; le niveau 30 reste rejouable.","Une flèche bloquée consomme-t-elle un coup ?","Non. Elle indique le premier obstacle et ne modifie pas le plateau.","L’Indice résout-il le puzzle automatiquement ?","Non. Il indique et cible une flèche sûre, mais vous choisissez de la jouer.","Puis-je déplacer plusieurs flèches rapidement ?","Oui. Vous pouvez toucher une autre flèche dont le trajet est libre sans attendre la fin de l’animation de sortie précédente.","Comment fonctionnent les portails ?","La flèche entre dans un portail et continue dans la même direction après la sortie associée.","La progression est-elle enregistrée ?","Les niveaux déverrouillés et les préférences sont enregistrés localement dans ce navigateur."],
    "de":["Pfeilflucht","Sprache","Ton","REIHENFOLGE-PUZZLE","Entferne alle Pfeilblöcke.","Spiel starten","Level und Fortschritt","Folge dem Pfeil und plane die Reihenfolge.","Spielanleitung","Tippe einen Block an und prüfe den gesamten Pfeilweg, auch hinter einem Portal.","Ist der ganze Weg frei, entkommt der Block. Bei einer Blockade wird kein Zug verbraucht und das erste Hindernis markiert.","Entscheide anhand des angezeigten Hindernisses. Entferne einen störenden Pfeil nur bei freiem Weg; Wände lassen sich nicht entfernen. Nutze den Tipp, wenn du einen sicheren Zug suchst.","Dreißig Stufen","Wände, Drehpfeile, Schlüssel, Eis, Portale und Einwegtore kommen in sechs Abschnitten.","Stufe wählen","Wischen oder scrollen und eine offene Stufe wählen.","Betreten","Züge","Übrig","Entferne alle Pfeilblöcke.","Tipp","Neustart","Prüfe vor dem Tippen den ganzen Weg, besonders hinter Portalen und Einwegtoren. Ein blockierter Test kostet keinen Zug; nutze das markierte Hindernis, um zu entscheiden, was zuerst weg muss.","Fortsetzen","Versuch verlassen?","Fortsetzen bewahrt das Brett; die Karte startet den Versuch später neu.","Stufenkarte","Stufe geschafft!","Nächste Stufe","Noch einmal","Weg durch {target} blockiert. Entferne es zuerst.","Dieser Block ist gesperrt. Finde den Schlüssel.","Dieser Block ist gefroren. Entferne einen Nachbarn.","Pfeil gedreht. Prüfe den neuen Weg.","Eine sichere Aktion ist markiert.","Keine sichere Aktion. Starte neu.","Schlüssel erhalten. Passende Schlösser sind offen.","Benachbartes Eis ist geschmolzen.","In {n} Zügen geschafft.","BASIS","SPERREN","WÄNDE","DREHUNG","SCHLÜSSEL + EIS","GEMISCHT","Level und Fortschritt","Den nächsten Zug planen","So funktioniert das Rätsel","Spieler- und Speicherhinweise","Häufige Fragen","Ähnliche Spiele","Spiel wird vorbereitet…","Zurück zum Hauptmenü","Zurück zu WeightPlay","Ton","Level","Logikrätsel","Richtungsblöcke entfernen","Portalwege","Löse 30 Level in sechs Kapiteln. Zuerst lernst du die Reihenfolge beim Entfernen; später kommen Wände, drehbare Pfeile, Schlüssel, gefrorene Blöcke, Portalpaare und Einwegtore hinzu. Ein Abschluss öffnet das nächste Level. Bereits gelöste Level bleiben spielbar.","Ein freies Nachbarfeld reicht nicht: Weiter hinten kann noch ein Block oder eine Wand stehen. Entferne einen störenden Pfeil erst, wenn auch sein eigener Weg frei ist. Wände bleiben stehen; drehbare Pfeile müssen zuerst ihre Richtung ändern. Schlüssel öffnen passende Schlösser, und das Entfernen eines Nachbarblocks taut Eis auf.","Ein Portal beendet den Weg nicht: Hinter dem anderen Ausgang läuft der Pfeil in derselben Richtung weiter. Ein Einwegtor lässt nur die angezeigte Richtung durch. Prüfe den gesamten Weg statt nur das nächste freie Feld.","Tippe oder klicke auf einen Pfeil; per Tastatur kannst du Schaltflächen fokussieren und auslösen. Ein Konto ist nicht nötig. Freigeschaltete Level und Einstellungen bleiben in diesem Browser, aber beim Wechsel zur Karte wird das unfertige Brett nicht gespeichert. Gelöschte Browserdaten können den Fortschritt entfernen; er wird nicht automatisch auf andere Geräte übertragen.","Verschiebe Blöcke, um den Ausgang freizumachen.","Schalte Lichter und ihre Nachbarn um, bis das Brett dunkel ist.","Unblock-Pfad","Licht aus","Wie viele Stufen gibt es?","Es gibt 30 handgefertigte Stufen in sechs Regelkapiteln; Stufe 30 bleibt wiederholbar.","Verbraucht ein blockierter Pfeil einen Zug?","Nein. Er zeigt das erste Hindernis und lässt das Brett unverändert.","Löst der Tipp das Rätsel automatisch?","Nein. Er markiert einen sicheren Pfeil, aber du entscheidest, ob du ihn spielst.","Kann ich mehrere Pfeile schnell bewegen?","Ja. Einen anderen Pfeil mit freiem Weg kannst du antippen, bevor die vorherige Ausfahrtanimation zu Ende ist.","Wie funktionieren Portale?","Der Pfeil betritt ein Portal und setzt seinen Weg nach dem passenden Ausgang in derselben Richtung fort.","Wird der Fortschritt gespeichert?","Freigeschaltete Stufen und Einstellungen werden lokal in diesem Browser gespeichert."],
    "it":["Fuga delle frecce","Lingua","Audio","PUZZLE D’ORDINE","Rimuovi tutti i blocchi.","Gioca","Livelli e progressi","Segui la freccia e pianifica l’ordine.","Come giocare","Tocca un blocco e controlla l'intero percorso della freccia, anche dopo un portale.","Se tutto il percorso è libero, il blocco esce. Se è bloccato, non consumi mosse e viene indicato il primo ostacolo.","Scegli la prossima azione in base all’ostacolo indicato. Rimuovi una freccia che blocca il passaggio solo se il suo percorso è libero; i muri non si eliminano. Usa il Suggerimento per trovare una mossa sicura.","Trenta livelli","Muri, rotazioni, chiavi, ghiaccio, portali e porte a senso unico arrivano in sei gruppi.","Scegli livello","Scorri e scegli un livello sbloccato.","Entra","Mosse","Rimasti","Rimuovi tutti i blocchi.","Suggerimento","Ricomincia","Controlla tutto il percorso prima di toccare, soprattutto dopo portali e porte a senso unico. Un tentativo bloccato non costa mosse: usa l'ostacolo indicato per decidere cosa rimuovere per primo.","Continua","Lasciare il tentativo?","Continua conserva la griglia; la mappa riavvia il tentativo più tardi.","Mappa","Livello completato!","Livello successivo","Gioca ancora","Percorso bloccato da {target}. Rimuovilo prima.","È bloccato. Trova la chiave.","È congelato. Rimuovi un blocco vicino.","La freccia ha ruotato. Controlla il nuovo percorso.","È evidenziata un’azione sicura.","Nessuna azione sicura. Ricomincia.","Chiave raccolta. I lucchetti si sono aperti.","Il ghiaccio vicino si è sciolto.","Completato in {n} mosse.","BASE","BLOCCHI","MURI","ROTAZIONE","CHIAVI + GHIACCIO","MISTO","Livelli e progressi","Pianifica la prossima mossa","Come funziona il rompicapo","Informazioni del giocatore e salvataggio","Domande frequenti","Giochi correlati","Preparazione del gioco…","Torna al menu principale","Torna a WeightPlay","Audio","Livello","Rompicapo logico","Rimozione di blocchi direzionali","Percorsi con portali","Completa 30 livelli in sei capitoli. All’inizio impari l’ordine di uscita; poi arrivano muri, frecce che girano, chiavi, blocchi congelati, portali abbinati e varchi a senso unico. Ogni vittoria apre il livello successivo e puoi rigiocare quelli completati.","Non guardare solo lo spazio vicino: un blocco o un muro più avanti può ancora fermare la freccia. Rimuovi una freccia che ostacola il passaggio solo se anche il suo percorso è libero. I muri non si eliminano; le frecce girevoli devono cambiare direzione prima. Le chiavi aprono i lucchetti corrispondenti e rimuovere un blocco vicino scioglie il ghiaccio.","Il portale non conclude il percorso: la freccia prosegue nella stessa direzione oltre l’uscita abbinata. Un varco a senso unico ammette solo la direzione indicata. Controlla tutto il tragitto, non soltanto la casella accanto.","Tocca o fai clic su una freccia; con la tastiera puoi selezionare e attivare i pulsanti. Non serve un account. Livelli sbloccati e preferenze restano in questo browser, ma tornare alla mappa non salva il tabellone incompleto. Cancellare i dati del browser può eliminare i progressi, che non passano automaticamente a un altro dispositivo.","Fai scorrere i blocchi per liberare l’uscita.","Alterna le luci e quelle vicine per spegnere il tabellone.","Sentiero Unblock","Spegni le luci","Quanti livelli sono inclusi?","Ci sono 30 livelli creati a mano in sei capitoli di regole; il livello 30 resta rigiocabile.","Una freccia bloccata consuma una mossa?","No. Mostra il primo ostacolo e lascia invariata la plancia.","Il Suggerimento risolve il puzzle automaticamente?","No. Indica e mette a fuoco una freccia sicura, ma decidi tu se giocarla.","Posso muovere più frecce rapidamente?","Sì. Puoi toccare un’altra freccia con il percorso libero senza aspettare che finisca l’animazione di uscita precedente.","Come funzionano i portali?","La freccia entra in un portale e continua nella stessa direzione oltre l’uscita abbinata.","I progressi vengono salvati?","I livelli sbloccati e le preferenze vengono salvati localmente in questo browser."],
    "ru":["Побег стрелок","Язык","Звук","ГОЛОВОЛОМКА НА ПОРЯДОК","Уберите все блоки.","Начать игру","Уровни и прогресс","Следуйте стрелке и планируйте порядок.","Как играть","Нажмите блок и проверьте весь путь стрелки, включая участок после портала.","Если весь путь свободен, блок уходит. При блокировке ход не тратится, а первое препятствие подсвечивается.","Выбирайте следующий шаг по отмеченному препятствию. Мешающую стрелку убирайте лишь при свободном пути; стены убрать нельзя. Если безопасный ход не виден, воспользуйтесь подсказкой.","Тридцать этапов","Стены, повороты, ключи, лёд, порталы и односторонние двери вводятся в шести частях.","Выбор этапа","Листайте и выберите открытый этап.","Войти","Ходы","Осталось","Уберите все блоки.","Подсказка","Заново","До нажатия проверьте весь путь, особенно после порталов и односторонних ворот. Заблокированная проверка не тратит ход, поэтому отмеченное препятствие подсказывает, что нужно убрать первым.","Продолжить","Покинуть попытку?","Продолжение сохранит доску; карта перезапустит попытку позже.","Карта этапов","Этап пройден!","Следующий этап","Ещё раз","Путь заблокирован: {target}. Сначала уберите его.","Блок заперт. Найдите ключ.","Блок заморожен. Уберите соседний блок.","Стрелка повернулась. Проверьте новый путь.","Отмечено одно безопасное действие.","Безопасных действий нет. Начните заново.","Ключ получен. Замки открыты.","Соседний лёд растаял.","Пройдено за {n} хода.","ОСНОВЫ","БЛОКИРОВКА","СТЕНЫ","ПОВОРОТ","КЛЮЧИ + ЛЁД","СМЕШАННО","Уровни и прогресс","Выбор следующего хода","Как устроена головоломка","Информация об игре и сохранении","Частые вопросы","Похожие игры","Подготовка игры…","В главное меню","Вернуться в WeightPlay","Звук","Уровень","Логическая головоломка","Удаление направленных блоков","Пути через порталы","Пройдите 30 уровней в шести главах. Сначала изучается порядок выхода, затем появляются стены, поворотные стрелки, ключи, замёрзшие блоки, парные порталы и односторонние ворота. Победа открывает следующий уровень; завершённые уровни можно повторять.","Свободной соседней клетки недостаточно: дальше по пути может стоять блок или стена. Убирайте мешающую стрелку только тогда, когда свободен и её собственный путь. Стены не исчезают, а поворотной стрелке сначала нужно изменить направление. Ключи снимают соответствующие замки, а удаление соседнего блока растапливает лёд.","Портал не завершает путь: за парным выходом стрелка продолжает двигаться в прежнем направлении. Односторонние ворота пропускают только в указанную сторону. Проверяйте весь маршрут, а не только ближайшую пустую клетку.","Нажимайте на стрелки касанием или мышью; с клавиатуры можно выбирать и активировать кнопки. Аккаунт не нужен. Открытые уровни и настройки сохраняются в этом браузере, но возврат на карту не сохраняет незавершённое поле. Очистка данных браузера может удалить прогресс; на другие устройства он автоматически не переносится.","Сдвигайте блоки, чтобы освободить выход.","Переключайте огни и соседние клетки, чтобы погасить всё поле.","Тропа Unblock","Погаси свет","Сколько уровней включено?","Есть 30 созданных вручную уровней в шести главах правил; уровень 30 можно проходить снова.","Заблокированная стрелка тратит ход?","Нет. Она показывает первое препятствие и оставляет поле без изменений.","Подсказка решает головоломку автоматически?","Нет. Она отмечает безопасную стрелку, но решение сделать ход остаётся за игроком.","Можно ли быстро двигать несколько стрелок?","Да. Можно нажать другую стрелку со свободным путём, не дожидаясь окончания предыдущей анимации выхода.","Как работают порталы?","Стрелка входит в один портал и продолжает движение в том же направлении за парным выходом.","Прогресс сохраняется?","Открытые уровни и настройки сохраняются локально в этом браузере."],
    "hi":["तीरों से बचाव","भाषा","ध्वनि","क्रम पहेली","सभी तीर ब्लॉक हटाएँ।","खेल शुरू करें","चरण और प्रगति","तीर देखें और क्रम की योजना बनाएँ।","कैसे खेलें","ब्लॉक दबाकर तीर का पूरा रास्ता जाँचें, पोर्टल के बाद का रास्ता भी।","पूरा रास्ता साफ़ हो तो ब्लॉक निकल जाता है। रास्ता रुका हो तो चाल खर्च नहीं होती और पहली बाधा दिखाई जाती है।","दिखाई गई बाधा देखकर अगला कदम चुनें। रास्ता रोकने वाला तीर तभी हटाएँ जब उसका अपना रास्ता खुला हो; दीवारें नहीं हटाई जा सकतीं। सुरक्षित चाल न मिले तो संकेत लें।","तीस चरण","दीवार, घूमते तीर, चाबी, बर्फ, पोर्टल और एकतरफा द्वार छह भागों में आते हैं।","चरण चुनें","स्क्रॉल करके खुला चरण चुनें।","प्रवेश","चालें","शेष","सभी तीर ब्लॉक हटाएँ।","संकेत","फिर शुरू","दबाने से पहले पूरा रास्ता देखें, खासकर पोर्टल और एकतरफ़ा द्वार के बाद। रुका हुआ परीक्षण चाल खर्च नहीं करता, इसलिए दिखाई गई बाधा से तय करें कि पहले क्या हटाना है।","जारी रखें","यह प्रयास छोड़ें?","जारी रखने पर बोर्ड बचा रहेगा; नक्शे पर लौटने से अगली बार प्रयास फिर शुरू होगा।","चरण नक्शा","चरण पूरा!","अगला चरण","फिर खेलें","रास्ता {target} से रुका है। पहले उसे हटाएँ।","ब्लॉक बंद है। चाबी खोजें।","ब्लॉक जमा है। पास का ब्लॉक हटाएँ।","तीर घूम गया। नया रास्ता जाँचें।","एक सुरक्षित चाल दिखाई गई।","कोई सुरक्षित चाल नहीं। फिर शुरू करें।","चाबी मिली। संबंधित ताले खुल गए।","पास की बर्फ पिघल गई।","{n} चालों में पूरा।","मूल","आपसी रोक","दीवारें","घुमाव","चाबी + बर्फ","मिश्रित","चरण और प्रगति","अगली चाल की योजना","पहेली कैसे काम करती है","खिलाड़ी और सेव की जानकारी","अक्सर पूछे जाने वाले प्रश्न","संबंधित गेम","गेम तैयार हो रहा है…","मुख्य स्क्रीन पर लौटें","WeightPlay पर लौटें","ध्वनि","चरण","तर्क पहेली","दिशा वाले ब्लॉक हटाना","पोर्टल वाले रास्ते","छह अध्यायों के 30 चरण पूरे करें। शुरुआत में बाहर निकलने का क्रम सीखते हैं; आगे दीवारें, घूमने वाले तीर, चाबियाँ, जमे हुए ब्लॉक, जोड़ीदार पोर्टल और एकतरफ़ा द्वार आते हैं। चरण पूरा करने पर अगला खुलता है और पूरे किए चरण फिर खेले जा सकते हैं।","केवल पास का खाली खाना न देखें: आगे कोई ब्लॉक या दीवार तीर को रोक सकती है। रास्ता रोकने वाले तीर को तभी हटाएँ जब उसका अपना रास्ता भी खुला हो। दीवारें नहीं हटतीं और घूमने वाला तीर पहले दिशा बदलता है। चाबी अपना संबंधित ताला खोलती है; पड़ोसी ब्लॉक हटाने से बर्फ पिघलती है।","पोर्टल रास्ते का अंत नहीं है: तीर दूसरे छोर के बाहर उसी दिशा में आगे बढ़ता है। एकतरफ़ा द्वार केवल दिखाई गई दिशा में जाने देता है। पास का खाना खाली देखकर निर्णय लेने के बजाय पूरा रास्ता जाँचें।","तीर पर टैप या क्लिक करें; कीबोर्ड से बटन पर फ़ोकस करके उसे चला सकते हैं। खाते की ज़रूरत नहीं है। खुले चरण और पसंद इसी ब्राउज़र में रहते हैं, लेकिन चरण-मानचित्र पर लौटने से अधूरा बोर्ड सेव नहीं होता। ब्राउज़र डेटा मिटाने पर प्रगति खो सकती है और वह दूसरे उपकरण पर अपने आप नहीं जाती।","ब्लॉक खिसकाकर बाहर जाने का रास्ता खोलें।","लाइट और उसकी पड़ोसी लाइट बदलकर पूरा बोर्ड बुझाएँ।","अनब्लॉक ट्रेल","लाइट्स आउट","कुल कितने चरण हैं?","छह नियम अध्यायों में हाथ से बनाए गए 30 चरण हैं; चरण 30 को फिर से खेला जा सकता है।","अटका हुआ तीर चाल खर्च करता है?","नहीं। वह पहला अवरोध दिखाता है और बोर्ड को नहीं बदलता।","संकेत क्या पहेली अपने आप हल करता है?","नहीं। वह एक सुरक्षित तीर दिखाता है; उसे चलाना है या नहीं, यह खिलाड़ी चुनता है।","क्या कई तीर जल्दी चलाए जा सकते हैं?","हाँ। दूसरे तीर का रास्ता खुला हो तो पिछले तीर के बाहर निकलने का एनीमेशन खत्म होने से पहले उसे दबा सकते हैं।","पोर्टल कैसे काम करते हैं?","तीर एक पोर्टल में जाता है और जोड़ी वाले निकास के आगे उसी दिशा में चलता है।","क्या प्रगति सहेजी जाती है?","खुले चरण और पसंद इसी ब्राउज़र में स्थानीय रूप से सहेजे जाते हैं।"],
    "ar":["هروب الأسهم","اللغة","الصوت","لغز الترتيب","أزل كل كتل الأسهم.","ابدأ اللعب","المراحل والتقدم","اتبع السهم وخطط للترتيب.","طريقة اللعب","اضغط كتلة وافحص مسار السهم كاملاً، بما في ذلك ما بعد البوابة.","إذا كان المسار كله خالياً تخرج الكتلة. وإذا كان محجوباً فلا تُستهلك حركة ويظهر أول عائق.","اختر الخطوة التالية وفق العائق الظاهر. أزل السهم الذي يسد الطريق فقط إذا كان مساره مفتوحًا؛ الجدران لا تُزال. استخدم التلميح إذا احتجت إلى حركة آمنة.","ثلاثون مرحلة","تظهر الجدران والدوران والمفاتيح والجليد والبوابات في ست مجموعات تعليمية.","اختر مرحلة","مرر واختر مرحلة مفتوحة.","دخول","الحركات","المتبقي","أزل كل كتل الأسهم.","تلميح","إعادة","تتبّع المسار كاملاً قبل الضغط، خصوصاً بعد البوابات والأبواب ذات الاتجاه الواحد. اختبار المسار المحجوب لا يستهلك حركة، لذا استخدم العائق الظاهر لتحديد ما يجب إزالته أولاً.","متابعة","مغادرة المحاولة؟","المتابعة تحفظ اللوحة؛ خريطة المراحل تعيد المحاولة لاحقاً.","خريطة المراحل","اكتملت المرحلة!","المرحلة التالية","العب مجدداً","المسار مسدود بسبب {target}. أزله أولاً.","الكتلة مقفلة. ابحث عن المفتاح.","الكتلة مجمدة. أزل كتلة مجاورة.","دار السهم. افحص المسار الجديد.","تم تحديد حركة آمنة واحدة.","لا توجد حركة آمنة. أعد المرحلة.","جُمِع المفتاح وفُتحت الأقفال المطابقة.","ذاب الجليد المجاور.","اكتملت المرحلة في {n} حركات.","الأساسيات","التعطيل","الجدران","الدوران","المفاتيح والجليد","مختلط","المراحل والتقدم","خطط للحركة التالية","كيف يعمل اللغز","معلومات اللاعب والحفظ","الأسئلة الشائعة","ألعاب ذات صلة","جارٍ تجهيز اللعبة…","العودة إلى القائمة الرئيسية","العودة إلى WeightPlay","الصوت","المرحلة","لغز منطقي","إزالة كتل باتجاه محدد","مسارات البوابات","أكمل 30 مرحلة في ستة فصول. تبدأ بتعلّم ترتيب الخروج، ثم تظهر الجدران والأسهم الدوّارة والمفاتيح والكتل المتجمدة وأزواج البوابات والممرات أحادية الاتجاه. إكمال مرحلة يفتح التالية، ويمكن إعادة المراحل المكتملة.","لا تكتفِ بالنظر إلى الخانة المجاورة: قد تعترض السهم كتلة أو جدار أبعد على المسار. أزل السهم الذي يسد الطريق فقط عندما يكون مساره هو أيضًا مفتوحًا. الجدران لا تُزال، والسهم الدوّار يحتاج إلى تغيير اتجاهه أولًا. المفاتيح تفتح الأقفال المطابقة، وإزالة كتلة مجاورة تذيب الجليد.","البوابة ليست نهاية المسار: يواصل السهم الاتجاه نفسه بعد الخروج من الطرف المقابل. الممر أحادي الاتجاه يسمح بالمرور في الاتجاه المرسوم فقط. افحص الطريق كاملًا بدل افتراض أن خلو الخانة المجاورة يكفي للخروج.","اضغط السهم باللمس أو الفأرة؛ ويمكن بلوحة المفاتيح تحديد الأزرار وتفعيلها. لا تحتاج إلى حساب. تُحفظ المراحل المفتوحة والتفضيلات في هذا المتصفح، لكن العودة إلى خريطة المراحل لا تحفظ اللوحة غير المكتملة. مسح بيانات المتصفح قد يمحو التقدم، ولا ينتقل تلقائيًا إلى جهاز آخر.","حرّك الكتل لفتح الطريق نحو المخرج.","بدّل الأضواء وجيرانها لإطفاء اللوحة كلها.","مسار فك الحجب","إطفاء الأنوار","كم عدد المراحل؟","هناك 30 مرحلة مصممة يدويًا ضمن ستة فصول للقواعد، ويمكن إعادة لعب المرحلة 30.","هل يستهلك السهم المحجوب حركة؟","لا. يحدد أول عائق ويترك اللوحة من دون تغيير.","هل يحل التلميح اللغز تلقائيًا؟","لا. يحدد سهمًا آمنًا ويضع التركيز عليه، لكنك تختار تنفيذ الحركة.","هل يمكن تحريك عدة أسهم بسرعة؟","نعم. يمكنك الضغط على سهم آخر ذي مسار مفتوح دون انتظار انتهاء حركة خروج السهم السابق.","كيف تعمل البوابات؟","يدخل السهم بوابة ويواصل الاتجاه نفسه بعد المخرج المقترن.","هل يُحفظ التقدم؟","تُحفظ المراحل المفتوحة والتفضيلات محليًا في هذا المتصفح."]
  };
  const NAMES={en:"English","zh-Hant":"繁體中文","zh-Hans":"简体中文",ja:"日本語",ko:"한국어",es:"Español","pt-BR":"Português",fr:"Français",de:"Deutsch",it:"Italiano",ru:"Русский",hi:"हिन्दी",ar:"العربية"};
  const PATH_LOCALES={en:"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  function routeLocale(){const match=location.pathname.match(/^\/([^/]+)\/games\/arrow-escape\//);return PATH_LOCALES[match?.[1]?.toLowerCase()]||localStorage.getItem("wpLang")||"en";}
  const I18N=Object.fromEntries(Object.entries(PACKS).map(([locale,values])=>[locale,Object.fromEntries(KEYS.map((key,index)=>[key,values[index]]))]));
  const A11Y_COPY={"en":{"stage":"Stage","wall":"wall","portal":"portal","gate":"one-way gate"},"zh-Hant":{"stage":"關卡","wall":"牆壁","portal":"傳送門","gate":"單向門"},"zh-Hans":{"stage":"关卡","wall":"墙壁","portal":"传送门","gate":"单向门"},"ja":{"stage":"ステージ","wall":"壁","portal":"ポータル","gate":"一方通行ゲート"},"ko":{"stage":"스테이지","wall":"벽","portal":"포털","gate":"일방통행 문"},"es":{"stage":"Nivel","wall":"muro","portal":"portal","gate":"puerta de un solo sentido"},"pt-BR":{"stage":"Fase","wall":"parede","portal":"portal","gate":"porta de mão única"},"fr":{"stage":"Niveau","wall":"mur","portal":"portail","gate":"porte à sens unique"},"de":{"stage":"Stufe","wall":"Wand","portal":"Portal","gate":"Einwegtor"},"it":{"stage":"Livello","wall":"muro","portal":"portale","gate":"porta a senso unico"},"ru":{"stage":"Этап","wall":"стена","portal":"портал","gate":"односторонние ворота"},"hi":{"stage":"चरण","wall":"दीवार","portal":"पोर्टल","gate":"एकतरफ़ा द्वार"},"ar":{"stage":"المرحلة","wall":"جدار","portal":"بوابة","gate":"بوابة باتجاه واحد"}};
  const a11y=()=>A11Y_COPY[locale]||A11Y_COPY.en;
  const resultPlural=(locale,n)=>{try{return new Intl.PluralRules(locale).select(n);}catch{return n===1?"one":"other";}};
  const resultForm=(locale,n,forms)=>forms[resultPlural(locale,n)]||forms.other||forms.one;
  const resultRussianMoves=n=>resultForm("ru",n,{one:`${n} ход`,few:`${n} хода`,many:`${n} ходов`,other:`${n} хода`});
  const resultRussianBlocked=n=>resultForm("ru",n,{one:`${n} заблокированное нажатие`,few:`${n} заблокированных нажатия`,many:`${n} заблокированных нажатий`,other:`${n} заблокированных нажатия`});
  const resultArabicMoves=n=>resultForm("ar",n,{zero:"لا حركات",one:"حركة واحدة",two:"حركتان",few:`${n} حركات`,many:`${n} حركة`,other:`${n} حركة`});
  const resultArabicBlocked=n=>resultForm("ar",n,{zero:"من دون ضغطات معطلة",one:"ضغطة معطلة واحدة",two:"ضغطتان معطلتان",few:`${n} ضغطات معطلة`,many:`${n} ضغطة معطلة`,other:`${n} ضغطة معطلة`});
  const RESULT_SUMMARY_COPY={
    en:n=>`Cleared in ${n} ${resultForm("en",n,{one:"move",other:"moves"})}.`,
    "zh-Hant":n=>`${n} 步完成。`,
    "zh-Hans":n=>`${n} 步完成。`,
    ja:n=>`${n}手でクリア。`,
    ko:n=>`${n}번 만에 완료.`,
    es:n=>`Completado en ${n} ${resultForm("es",n,{one:"movimiento",other:"movimientos"})}.`,
    "pt-BR":n=>`Concluído em ${n} ${resultForm("pt-BR",n,{one:"jogada",other:"jogadas"})}.`,
    fr:n=>`Terminé en ${n} ${resultForm("fr",n,{one:"mouvement",other:"mouvements"})}.`,
    de:n=>`In ${n} ${resultForm("de",n,{one:"Zug",other:"Zügen"})} geschafft.`,
    it:n=>`Completato in ${n} ${resultForm("it",n,{one:"mossa",other:"mosse"})}.`,
    ru:n=>`Пройдено за ${resultRussianMoves(n)}.`,
    hi:n=>`${n} ${resultForm("hi",n,{one:"चाल",other:"चालों"})} में पूरा।`,
    ar:n=>`اكتملت المرحلة في ${resultArabicMoves(n)}.`
  };
  const RESULT_CLEAN_COPY={
    en:{clean:n=>`Clean order: ${n} ${resultForm("en",n,{one:"move",other:"moves"})} with no blocked taps.`,messy:(n,b)=>`${n} ${resultForm("en",n,{one:"move",other:"moves"})}, ${b} ${resultForm("en",b,{one:"blocked tap",other:"blocked taps"})}. Replay for a cleaner order.`},
    "zh-Hant":{clean:n=>`俐落順序：${n} 步完成，沒有受阻點擊。`,messy:(n,b)=>`${n} 步完成，受阻點擊 ${b} 次。再玩一次，挑戰更俐落的順序。`},
    "zh-Hans":{clean:n=>`利落顺序：${n} 步完成，没有受阻点击。`,messy:(n,b)=>`${n} 步完成，受阻点击 ${b} 次。再玩一次，挑战更利落的顺序。`},
    ja:{clean:n=>`きれいな順序：${n}手、ブロックされたタップなし。`,messy:(n,b)=>`${n}手、ブロックされたタップ ${b} 回。もう一度、よりきれいな順序を試そう。`},
    ko:{clean:n=>`깔끔한 순서: 막힌 탭 없이 ${n}번 만에 완료.`,messy:(n,b)=>`${n}번 만에 완료, 막힌 탭 ${b}회. 다시 플레이해 더 깔끔한 순서를 찾아보세요.`},
    es:{clean:n=>`Orden limpio: ${n} ${resultForm("es",n,{one:"movimiento",other:"movimientos"})} sin toques bloqueados.`,messy:(n,b)=>`${n} ${resultForm("es",n,{one:"movimiento",other:"movimientos"})} y ${b} ${resultForm("es",b,{one:"toque bloqueado",other:"toques bloqueados"})}. Repite para encontrar un orden más limpio.`},
    "pt-BR":{clean:n=>`Ordem limpa: ${n} ${resultForm("pt-BR",n,{one:"jogada",other:"jogadas"})} sem toques bloqueados.`,messy:(n,b)=>`${n} ${resultForm("pt-BR",n,{one:"jogada",other:"jogadas"})} e ${b} ${resultForm("pt-BR",b,{one:"toque bloqueado",other:"toques bloqueados"})}. Jogue novamente para buscar uma ordem mais limpa.`},
    fr:{clean:n=>`Ordre nette : ${n} ${resultForm("fr",n,{one:"mouvement",other:"mouvements"})} sans touche bloquée.`,messy:(n,b)=>`${n} ${resultForm("fr",n,{one:"mouvement",other:"mouvements"})} et ${b} ${resultForm("fr",b,{one:"touche bloquée",other:"touches bloquées"})}. Rejouez pour trouver un ordre plus net.`},
    de:{clean:n=>`Saubere Reihenfolge: ${n} ${resultForm("de",n,{one:"Zug",other:"Züge"})} ohne blockierte Versuche.`,messy:(n,b)=>`${n} ${resultForm("de",n,{one:"Zug",other:"Züge"})}, ${b} ${resultForm("de",b,{one:"blockierter Versuch",other:"blockierte Versuche"})}. Spiele erneut für eine sauberere Reihenfolge.`},
    it:{clean:n=>`Ordine pulito: ${n} ${resultForm("it",n,{one:"mossa",other:"mosse"})} senza tocchi bloccati.`,messy:(n,b)=>`${n} ${resultForm("it",n,{one:"mossa",other:"mosse"})} e ${b} ${resultForm("it",b,{one:"tocco bloccato",other:"tocchi bloccati"})}. Rigioca per trovare un ordine più pulito.`},
    ru:{clean:n=>`Чистый порядок: ${resultRussianMoves(n)} без заблокированных нажатий.`,messy:(n,b)=>`${resultRussianMoves(n)}, ${resultRussianBlocked(b)}. Сыграйте ещё раз ради более чистого порядка.`},
    hi:{clean:n=>`साफ़ क्रम: ${n} ${resultForm("hi",n,{one:"चाल",other:"चालों"})} में पूरा, बिना बाधित टैप के.`,messy:(n,b)=>`${n} ${resultForm("hi",n,{one:"चाल",other:"चालें"})}, ${b} बाधित टैप। फिर खेलकर और साफ़ क्रम आज़माएँ।`},
    ar:{clean:n=>`ترتيب نظيف: اكتملت بـ${resultArabicMoves(n)}، من دون ضغطات معطلة.`,messy:(n,b)=>`اكتملت بـ${resultArabicMoves(n)}، مع ${resultArabicBlocked(b)}. أعد اللعب لتجربة ترتيب أنظف.`}
  };
  const PREVIEW_PACKS={
    en:["New mechanic preview","Got it","Basics: a block escapes only when its full arrow path is clear. Plan the order before you move.","Interlock: one arrow can hide behind another. Follow the full ray and remove the first blocker.","Walls: fixed cells stop a ray even when no arrow is there. Read beyond the nearest block.","Rotation: this arrow turns once clockwise when tapped. Check its new direction before the next move.","Locks + ice: keys open matching locks; removing a neighbor thaws frozen blocks.","Mixed: portals continue a ray and one-way gates allow only their shown direction. Read both before moving."],
    "zh-Hant":["新機制預覽","知道了","基礎：方塊只有在完整箭頭路徑暢通時才能逃出。移動前先規劃順序。","互相阻擋：一支箭頭可能藏在另一支後面。沿完整路徑檢查，先移除第一個阻擋物。","牆壁：固定格子即使沒有箭頭也會擋住路徑。不要只看最近的方塊。","旋轉：點擊後這支箭頭會順時針旋轉一次。選下一步前先檢查新方向。","鎖與冰凍：鑰匙會打開相同標記的鎖；移除相鄰方塊會解凍冰塊。","混合機制：傳送門會延續路徑，單向門只允許顯示的方向。移動前兩者都要確認。"],
    "zh-Hans":["新机制预览","知道了","基础：方块只有在完整箭头路径畅通时才能逃出。移动前先规划顺序。","互相阻挡：一支箭头可能藏在另一支后面。沿完整路径检查，先移除第一个阻挡物。","墙壁：固定格子即使没有箭头也会挡住路径。不要只看最近的方块。","旋转：点击后这支箭头会顺时针旋转一次。选择下一步前先检查新方向。","锁与冰冻：钥匙会打开相同标记的锁；移除相邻方块会解冻冰块。","混合机制：传送门会延续路径，单向门只允许显示的方向。移动前两者都要确认。"],
    ja:["新しいギミック","了解","基本：矢印の全経路が空いている時だけブロックは脱出します。動く前に順番を考えましょう。","相互ブロック：矢印の後ろに別の矢印が隠れることがあります。全経路を見て最初の障害を消しましょう。","壁：矢印がなくても固定マスは経路を止めます。手前のブロックだけで判断しないでください。","回転：この矢印はタップすると一度だけ時計回りに回ります。次の手の前に新しい向きを確認しましょう。","鍵と氷：鍵は同じ印のロックを開き、隣のブロックを消すと凍ったブロックが解けます。","ミックス：ポータルは経路を続け、一方通行ゲートは示された向きだけを通します。両方を確認して動きましょう。"],
    ko:["새 규칙 미리보기","알겠어요","기초: 화살표의 전체 경로가 비어 있어야 블록이 탈출합니다. 움직이기 전에 순서를 계획하세요.","상호 차단: 화살표 뒤에 다른 화살표가 숨을 수 있습니다. 전체 경로를 따라 첫 방해물을 제거하세요.","벽: 화살표가 없어도 고정 칸은 경로를 막습니다. 가장 가까운 블록 너머를 확인하세요.","회전: 이 화살표는 누르면 시계 방향으로 한 번만 돕니다. 다음 행동 전에 새 방향을 확인하세요.","자물쇠와 얼음: 열쇠는 같은 표시의 잠금을 열고, 이웃 블록을 제거하면 얼어붙은 블록이 녹습니다.","혼합: 포털은 경로를 이어 주고 일방통행 문은 표시된 방향만 허용합니다. 둘 다 확인하고 움직이세요."],
    es:["Vista previa de la nueva regla","Entendido","Básico: un bloque escapa solo cuando toda su ruta está libre. Planea el orden antes de moverlo.","Bloqueo: una flecha puede ocultarse detrás de otra. Sigue toda la ruta y quita el primer obstáculo.","Muros: una casilla fija detiene la ruta aunque no tenga una flecha. Mira más allá del bloque cercano.","Giro: esta flecha gira una vez en sentido horario al tocarla. Comprueba su nueva dirección antes del siguiente movimiento.","Llaves y hielo: las llaves abren cerraduras iguales; quitar un vecino descongela los bloques de hielo.","Mixto: los portales continúan la ruta y las puertas de un sentido solo dejan pasar en la dirección indicada. Comprueba ambos antes de mover."],
    "pt-BR":["Prévia da nova regra","Entendi","Básico: um bloco só escapa quando todo o caminho está livre. Planeje a ordem antes de mover.","Bloqueio: uma seta pode ficar escondida atrás de outra. Siga todo o caminho e remova o primeiro obstáculo.","Paredes: uma casa fixa interrompe o caminho mesmo sem uma seta. Olhe além do bloco mais próximo.","Giro: esta seta gira uma vez no sentido horário ao ser tocada. Confira a nova direção antes da próxima jogada.","Chaves e gelo: chaves abrem travas iguais; remover um vizinho descongela os blocos de gelo.","Misto: portais continuam o caminho e portas de mão única permitem apenas a direção mostrada. Confira os dois antes de mover."],
    fr:["Aperçu de la nouvelle règle","Compris","Base : un bloc ne sort que si tout son trajet est libre. Planifiez l’ordre avant de bouger.","Blocage : une flèche peut être cachée derrière une autre. Suivez tout le trajet et retirez le premier obstacle.","Murs : une case fixe arrête le trajet même sans flèche. Regardez au-delà du bloc proche.","Rotation : cette flèche tourne une fois dans le sens horaire quand vous la touchez. Vérifiez sa nouvelle direction avant le prochain coup.","Clés et glace : les clés ouvrent les verrous correspondants ; retirer un voisin dégèle les blocs de glace.","Mixte : les portails prolongent le trajet et les portes à sens unique n’acceptent que leur direction. Vérifiez les deux avant de bouger."],
    de:["Vorschau auf die neue Regel","Verstanden","Basis: Ein Block entkommt nur, wenn sein kompletter Pfeilweg frei ist. Plane die Reihenfolge vor dem Zug.","Sperren: Hinter einem Pfeil kann ein weiterer verborgen sein. Folge dem ganzen Weg und entferne das erste Hindernis.","Wände: Ein festes Feld stoppt den Weg auch ohne Pfeil. Sieh über den nächsten Block hinaus.","Drehung: Dieser Pfeil dreht sich beim Antippen einmal im Uhrzeigersinn. Prüfe die neue Richtung vor dem nächsten Zug.","Schlüssel und Eis: Schlüssel öffnen passende Schlösser; ein Nachbarzug taut gefrorene Blöcke auf.","Gemischt: Portale setzen den Weg fort, Einwegtore erlauben nur ihre angezeigte Richtung. Prüfe beides vor dem Zug."],
    it:["Anteprima della nuova regola","Capito","Base: un blocco esce solo quando tutto il suo percorso è libero. Pianifica l’ordine prima di muovere.","Blocco: una freccia può nascondersi dietro un’altra. Segui tutto il percorso e rimuovi il primo ostacolo.","Muri: una casella fissa ferma il percorso anche senza una freccia. Guarda oltre il blocco vicino.","Rotazione: questa freccia gira una volta in senso orario quando la tocchi. Controlla la nuova direzione prima della prossima mossa.","Chiavi e ghiaccio: le chiavi aprono i lucchetti corrispondenti; rimuovere un vicino scioglie i blocchi di ghiaccio.","Misto: i portali continuano il percorso e le porte a senso unico consentono solo la direzione mostrata. Controlla entrambi prima di muovere."],
    ru:["Предпросмотр нового правила","Понятно","Основы: блок выходит только при полностью свободном пути стрелки. Планируйте порядок до хода.","Блокировка: за одной стрелкой может скрываться другая. Проверьте весь путь и уберите первый блокирующий элемент.","Стены: неподвижная клетка останавливает путь даже без стрелки. Смотрите дальше ближайшего блока.","Поворот: при нажатии эта стрелка один раз повернётся по часовой стрелке. Проверьте новое направление перед следующим ходом.","Ключи и лёд: ключи открывают подходящие замки; удаление соседнего блока растапливает лёд.","Смешанное: порталы продолжают путь, а односторонние двери пропускают только в указанном направлении. Проверьте оба правила."],
    hi:["नए नियम का पूर्वावलोकन","समझ गया","मूल: ब्लॉक तभी निकलता है जब उसका पूरा तीर मार्ग साफ हो। चाल से पहले क्रम की योजना बनाएँ।","आपसी रोक: एक तीर दूसरे के पीछे छिप सकता है। पूरे मार्ग को देखें और पहली बाधा हटाएँ।","दीवारें: स्थिर खाना तीर के बिना भी मार्ग रोकता है। निकटतम ब्लॉक के आगे भी देखें।","घुमाव: दबाने पर यह तीर घड़ी की दिशा में केवल एक बार घूमता है। अगली चाल से पहले नई दिशा जाँचें।","चाबी और बर्फ: चाबी मिलते ताले खोलती है; पड़ोसी ब्लॉक हटाने से जमे ब्लॉक पिघलते हैं।","मिश्रित: पोर्टल मार्ग को आगे बढ़ाते हैं और एकतरफा द्वार केवल दिखी दिशा की अनुमति देते हैं। दोनों नियम देखकर चलें।"],
    ar:["معاينة القاعدة الجديدة","فهمت","الأساسيات: لا تخرج الكتلة إلا إذا كان مسار سهمها كاملاً خالياً. خطط للترتيب قبل الحركة.","التعطيل: قد يختبئ سهم خلف سهم آخر. اتبع المسار كاملاً وأزل أول عائق.","الجدران: الخلية الثابتة توقف المسار حتى من دون سهم. انظر إلى ما بعد الكتلة الأقرب.","الدوران: يدور هذا السهم مرة واحدة مع عقارب الساعة عند الضغط عليه. افحص اتجاهه الجديد قبل الحركة التالية.","المفاتيح والجليد: تفتح المفاتيح الأقفال المطابقة؛ إزالة كتلة مجاورة تذيب الكتل المجمدة.","مختلط: تواصل البوابات مسار السهم، ولا تسمح البوابات ذات الاتجاه الواحد إلا بالاتجاه الظاهر. افحص القاعدتين قبل الحركة."]
  };
  const DIRS={U:[-1,0],R:[0,1],D:[1,0],L:[0,-1]},GLYPH={U:"↑",R:"→",D:"↓",L:"←"},TURN={U:"R",R:"D",D:"L",L:"U"};
  const BLOCKER_TARGETS={en:{block:"arrow",wall:"wall",gate:"one-way gate"},"zh-Hant":{block:"箭頭",wall:"牆",gate:"單向門"},"zh-Hans":{block:"箭头",wall:"墙",gate:"单向门"},ja:{block:"矢印",wall:"壁",gate:"一方通行ゲート"},ko:{block:"화살표",wall:"벽",gate:"일방통행 문"},es:{block:"flecha",wall:"muro",gate:"puerta de un sentido"},"pt-BR":{block:"seta",wall:"parede",gate:"porta de mão única"},fr:{block:"flèche",wall:"mur",gate:"porte à sens unique"},de:{block:"Pfeil",wall:"Wand",gate:"Einwegtor"},it:{block:"freccia",wall:"muro",gate:"porta a senso unico"},ru:{block:"стрелка",wall:"стена",gate:"односторонняя дверь"},hi:{block:"तीर",wall:"दीवार",gate:"एकतरफा द्वार"},ar:{block:"سهم",wall:"جدار",gate:"بوابة باتجاه واحد"}};
  // Explicit, reviewable stage catalog. Every layout is solver-validated below.
  const STAGES=[
    {
      "number": 1,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R"
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 2,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D"
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 3,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 4,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U"
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-3",
          "r": 4,
          "c": 1,
          "d": "L"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 5,
      "band": 1,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-mirror-0",
          "r": 1,
          "c": 4,
          "d": "U"
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 6,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R"
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-0",
          "r": 1,
          "c": 1,
          "d": "U"
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 7,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D"
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-1",
          "r": 1,
          "c": 4,
          "d": "R"
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 8,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-2",
          "r": 4,
          "c": 4,
          "d": "D"
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 9,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U"
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-3",
          "r": 4,
          "c": 1,
          "d": "L"
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 10,
      "band": 2,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-mirror-0",
          "r": 1,
          "c": 4,
          "d": "U"
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [],
      "portals": [],
      "gates": []
    },
    {
      "number": 11,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R"
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-0",
          "r": 1,
          "c": 1,
          "d": "U"
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        }
      ],
      "walls": [
        [
          0,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 12,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D"
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-1",
          "r": 1,
          "c": 4,
          "d": "R"
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        }
      ],
      "walls": [
        [
          0,
          5
        ],
        [
          5,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 13,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-2",
          "r": 4,
          "c": 4,
          "d": "D"
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          5,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 14,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U"
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-3",
          "r": 4,
          "c": 1,
          "d": "L"
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        }
      ],
      "walls": [
        [
          5,
          0
        ],
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 15,
      "band": 3,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-mirror-0",
          "r": 1,
          "c": 4,
          "d": "U"
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 16,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R"
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-rot-0",
          "r": 1,
          "c": 1,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        }
      ],
      "walls": [
        [
          0,
          0
        ],
        [
          5,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 17,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D"
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-rot-1",
          "r": 1,
          "c": 4,
          "d": "U",
          "rotator": true
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        }
      ],
      "walls": [
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 18,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-2",
          "r": 4,
          "c": 4,
          "d": "R",
          "rotator": true
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          5,
          5
        ],
        [
          0,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 19,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U"
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-rot-3",
          "r": 4,
          "c": 1,
          "d": "D",
          "rotator": true
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        }
      ],
      "walls": [
        [
          5,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 20,
      "band": 4,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L"
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-mirror-0",
          "r": 1,
          "c": 4,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          0,
          5
        ],
        [
          5,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 21,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R",
          "key": "amber"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R",
          "frozen": true
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R",
          "lock": "amber"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-rot-0",
          "r": 1,
          "c": 1,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        }
      ],
      "walls": [
        [
          0,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 22,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D",
          "key": "amber"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D",
          "frozen": true
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D",
          "lock": "amber"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-rot-1",
          "r": 1,
          "c": 4,
          "d": "U",
          "rotator": true
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        }
      ],
      "walls": [
        [
          0,
          5
        ],
        [
          5,
          0
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 23,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L",
          "key": "amber"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L",
          "frozen": true
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L",
          "lock": "amber"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-2",
          "r": 4,
          "c": 4,
          "d": "R",
          "rotator": true
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          5,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 24,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U",
          "key": "amber"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U",
          "frozen": true
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U",
          "lock": "amber"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-rot-3",
          "r": 4,
          "c": 1,
          "d": "D",
          "rotator": true
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        }
      ],
      "walls": [
        [
          5,
          0
        ],
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 25,
      "band": 5,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L",
          "key": "amber"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L",
          "frozen": true
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L",
          "lock": "amber"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-mirror-0",
          "r": 1,
          "c": 4,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        }
      ],
      "walls": [
        [
          0,
          5
        ]
      ],
      "portals": [],
      "gates": []
    },
    {
      "number": 26,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-0",
          "r": 2,
          "c": 5,
          "d": "R",
          "key": "amber"
        },
        {
          "id": "24R-0",
          "r": 2,
          "c": 4,
          "d": "R",
          "frozen": true
        },
        {
          "id": "23R-0",
          "r": 2,
          "c": 3,
          "d": "R",
          "lock": "amber"
        },
        {
          "id": "03D-0",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "52U-0",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "20R-0",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "11U-rot-0",
          "r": 1,
          "c": 1,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-0",
          "r": 4,
          "c": 1,
          "d": "U"
        },
        {
          "id": "35L-0",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "32L-0",
          "r": 3,
          "c": 2,
          "d": "L"
        },
        {
          "id": "portal-26-0",
          "r": 1,
          "c": 5,
          "d": "L"
        }
      ],
      "walls": [
        [
          0,
          0
        ],
        [
          5,
          5
        ]
      ],
      "portals": [
        {
          "a": [
            1,
            4
          ],
          "b": [
            1,
            2
          ]
        }
      ],
      "gates": [
        {
          "r": 4,
          "c": 3,
          "d": "D"
        }
      ]
    },
    {
      "number": 27,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-1",
          "r": 5,
          "c": 3,
          "d": "D",
          "key": "amber"
        },
        {
          "id": "24R-1",
          "r": 4,
          "c": 3,
          "d": "D",
          "frozen": true
        },
        {
          "id": "23R-1",
          "r": 3,
          "c": 3,
          "d": "D",
          "lock": "amber"
        },
        {
          "id": "03D-1",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "52U-1",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "20R-1",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "11U-rot-1",
          "r": 1,
          "c": 4,
          "d": "U",
          "rotator": true
        },
        {
          "id": "41U-1",
          "r": 1,
          "c": 1,
          "d": "R"
        },
        {
          "id": "35L-1",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "32L-1",
          "r": 2,
          "c": 2,
          "d": "U"
        },
        {
          "id": "portal-27-1",
          "r": 5,
          "c": 4,
          "d": "U"
        }
      ],
      "walls": [
        [
          0,
          5
        ]
      ],
      "portals": [
        {
          "a": [
            4,
            4
          ],
          "b": [
            2,
            4
          ]
        }
      ],
      "gates": [
        {
          "r": 3,
          "c": 1,
          "d": "L"
        }
      ]
    },
    {
      "number": 28,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-2",
          "r": 3,
          "c": 0,
          "d": "L",
          "key": "amber"
        },
        {
          "id": "24R-2",
          "r": 3,
          "c": 1,
          "d": "L",
          "frozen": true
        },
        {
          "id": "23R-2",
          "r": 3,
          "c": 2,
          "d": "L",
          "lock": "amber"
        },
        {
          "id": "03D-2",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "52U-2",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "20R-2",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-2",
          "r": 4,
          "c": 4,
          "d": "R",
          "rotator": true
        },
        {
          "id": "41U-2",
          "r": 1,
          "c": 4,
          "d": "D"
        },
        {
          "id": "35L-2",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-2",
          "r": 2,
          "c": 3,
          "d": "R"
        },
        {
          "id": "portal-28-2",
          "r": 4,
          "c": 0,
          "d": "R"
        }
      ],
      "walls": [
        [
          5,
          5
        ],
        [
          0,
          0
        ]
      ],
      "portals": [
        {
          "a": [
            4,
            1
          ],
          "b": [
            4,
            3
          ]
        }
      ],
      "gates": [
        {
          "r": 1,
          "c": 2,
          "d": "U"
        }
      ]
    },
    {
      "number": 29,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-3",
          "r": 0,
          "c": 2,
          "d": "U",
          "key": "amber"
        },
        {
          "id": "24R-3",
          "r": 1,
          "c": 2,
          "d": "U",
          "frozen": true
        },
        {
          "id": "23R-3",
          "r": 2,
          "c": 2,
          "d": "U",
          "lock": "amber"
        },
        {
          "id": "03D-3",
          "r": 2,
          "c": 0,
          "d": "R"
        },
        {
          "id": "52U-3",
          "r": 3,
          "c": 5,
          "d": "L"
        },
        {
          "id": "20R-3",
          "r": 5,
          "c": 2,
          "d": "U"
        },
        {
          "id": "11U-rot-3",
          "r": 4,
          "c": 1,
          "d": "D",
          "rotator": true
        },
        {
          "id": "41U-3",
          "r": 4,
          "c": 4,
          "d": "L"
        },
        {
          "id": "35L-3",
          "r": 0,
          "c": 3,
          "d": "D"
        },
        {
          "id": "32L-3",
          "r": 3,
          "c": 3,
          "d": "D"
        },
        {
          "id": "portal-29-3",
          "r": 0,
          "c": 1,
          "d": "D"
        }
      ],
      "walls": [
        [
          5,
          0
        ]
      ],
      "portals": [
        {
          "a": [
            1,
            1
          ],
          "b": [
            3,
            1
          ]
        }
      ],
      "gates": [
        {
          "r": 2,
          "c": 4,
          "d": "R"
        }
      ]
    },
    {
      "number": 30,
      "band": 6,
      "size": 6,
      "blocks": [
        {
          "id": "25R-mirror-0",
          "r": 2,
          "c": 0,
          "d": "L",
          "key": "amber"
        },
        {
          "id": "24R-mirror-0",
          "r": 2,
          "c": 1,
          "d": "L",
          "frozen": true
        },
        {
          "id": "23R-mirror-0",
          "r": 2,
          "c": 2,
          "d": "L",
          "lock": "amber"
        },
        {
          "id": "03D-mirror-0",
          "r": 0,
          "c": 2,
          "d": "D"
        },
        {
          "id": "52U-mirror-0",
          "r": 5,
          "c": 3,
          "d": "U"
        },
        {
          "id": "20R-mirror-0",
          "r": 2,
          "c": 5,
          "d": "L"
        },
        {
          "id": "11U-rot-mirror-0",
          "r": 1,
          "c": 4,
          "d": "L",
          "rotator": true
        },
        {
          "id": "41U-mirror-0",
          "r": 4,
          "c": 4,
          "d": "U"
        },
        {
          "id": "35L-mirror-0",
          "r": 3,
          "c": 0,
          "d": "R"
        },
        {
          "id": "32L-mirror-0",
          "r": 3,
          "c": 3,
          "d": "R"
        },
        {
          "id": "portal-30-mirror-0",
          "r": 1,
          "c": 0,
          "d": "R"
        }
      ],
      "walls": [
        [
          0,
          5
        ],
        [
          5,
          0
        ]
      ],
      "portals": [
        {
          "a": [
            1,
            1
          ],
          "b": [
            1,
            3
          ]
        }
      ],
      "gates": [
        {
          "r": 4,
          "c": 2,
          "d": "D"
        }
      ]
    }
  ];
  const keyOf=(r,c)=>`${r},${c}`;
  function cloneStage(stage){return{...stage,blocks:stage.blocks.map(block=>({...block})),walls:stage.walls.map(cell=>[...cell]),portals:stage.portals.map(pair=>({a:[...pair.a],b:[...pair.b]})),gates:stage.gates.map(g=>({...g}))};}
  function portalMap(stage){const map=new Map();for(const pair of stage.portals){map.set(keyOf(...pair.a),pair.b);map.set(keyOf(...pair.b),pair.a);}return map;}
  function ray(state,block){const cells=[],portals=portalMap(state),visited=new Set();let [dr,dc]=DIRS[block.d],r=block.r+dr,c=block.c+dc;while(r>=0&&r<state.size&&c>=0&&c<state.size){const key=keyOf(r,c);if(portals.has(key)&&!visited.has(key)){visited.add(key);[r,c]=portals.get(key);r+=dr;c+=dc;continue;}cells.push([r,c]);r+=dr;c+=dc;}return cells;}
  function blocker(state,block){for(const [r,c] of ray(state,block)){if(state.walls.some(cell=>cell[0]===r&&cell[1]===c))return{r,c,type:"wall"};const other=state.blocks.find(item=>item.id!==block.id&&item.r===r&&item.c===c);if(other)return{...other,type:"block"};const gate=state.gates.find(item=>item.r===r&&item.c===c);if(gate&&gate.d!==block.d)return{...gate,type:"gate"};}return null;}
  const movable=(state,block)=>!block.lock&&!block.frozen&&!blocker(state,block);
  function actions(state){const list=[];for(const block of state.blocks){if(block.rotator)list.push({type:"rotate",id:block.id});else if(movable(state,block))list.push({type:"remove",id:block.id});}return list;}
  function applyAction(state,action){const next=cloneStage(state),block=next.blocks.find(item=>item.id===action.id);if(!block)return next;if(action.type==="rotate"){block.d=TURN[block.d];block.rotator=false;return next;}next.blocks=next.blocks.filter(item=>item.id!==block.id);if(block.key)next.blocks.forEach(item=>{if(item.lock===block.key)delete item.lock;});next.blocks.forEach(item=>{if(item.frozen&&Math.abs(item.r-block.r)+Math.abs(item.c-block.c)===1)delete item.frozen;});return next;}
  function solveStage(stage){const seen=new Set();function search(state,path){if(!state.blocks.length)return path;const signature=state.blocks.map(b=>`${b.id}:${b.d}:${!!b.rotator}:${!!b.lock}:${!!b.frozen}`).sort().join("|");if(seen.has(signature))return null;seen.add(signature);for(const action of actions(state)){const result=search(applyAction(state,action),[...path,action]);if(result)return result;}return null;}return search(cloneStage(stage),[]);}
  const SOLUTIONS=STAGES.map(solveStage);
  if(SOLUTIONS.some(solution=>!solution))throw new Error(`Arrow Escape stage validation failed: ${SOLUTIONS.map((solution,index)=>solution?null:index+1).filter(Boolean).join(",")}`);

  let locale=routeLocale(),sound=localStorage.getItem("wpSound")!=="off",unlocked=Math.max(1,Math.min(30,Number(localStorage.getItem("arrowEscapeUnlocked"))||1));
  const STAGE_CARD_POOL_SIZE=9;
  let selectedStage=unlocked,currentStage=unlocked,state=null,moves=0,blockedAttempts=0,busy=false,lastFocus=null,battleGeneration=0,pendingFeedback="",activeEscapes=new Set(),activePreviewBand=null;
  let stageWindowStart=1,stageCardPool=[],stageBrowseLogical=unlocked,stageSettleFrame=0,cancelStagePointer=()=>{};
  const PREVIEW_STORAGE_KEY="arrowEscapeMechanicPreviews-v1";
  const seenPreviewBands=new Set((localStorage.getItem(PREVIEW_STORAGE_KEY)||"").split(",").filter(Boolean));
  const DIRECT_STAGE_HINT={en:"Swipe or scroll. Tap an unlocked stage to play.","zh-Hant":"滑動選擇，點擊已解鎖關卡即可開始。","zh-Hans":"滑动选择，点击已解锁关卡即可开始。",ja:"スワイプして、解放済みのステージをタップすると開始します。",ko:"밀어서 선택한 뒤, 잠금 해제된 스테이지를 탭해 시작하세요.",es:"Desliza y toca un nivel desbloqueado para jugar.","pt-BR":"Deslize e toque em uma fase liberada para jogar.",fr:"Faites défiler puis touchez un niveau débloqué pour jouer.",de:"Wische und tippe auf eine offene Stufe, um zu spielen.",it:"Scorri e tocca un livello sbloccato per giocare.",ru:"Листайте и нажмите открытый этап, чтобы начать.",hi:"स्वाइप करें और खेलने के लिए अनलॉक चरण पर टैप करें।",ar:"اسحب ثم اضغط مرحلة مفتوحة لبدء اللعب."};
  const t=(key,vars={})=>String(key==="stageHint"?(DIRECT_STAGE_HINT[locale]||DIRECT_STAGE_HINT.en):((I18N[locale]||I18N.en)[key]||key)).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??"");
  const blockerTargetLabel=hit=>{const labels=BLOCKER_TARGETS[locale]||BLOCKER_TARGETS.en;if(hit.type==="block")return `${labels.block} ${GLYPH[hit.d]||""}`.trim();if(hit.type==="gate")return `${labels.gate} ${GLYPH[hit.d]||""}`.trim();return labels.wall;};
  function syncMainProgress(){const node=$("mainProgress");if(node)node.textContent=`${unlocked} / 30`;}
  function setScreen(screen){if(screen!=="stage")cancelStageMotion();document.body.dataset.screen=screen;$("mainGroup").hidden=screen!=="main";$("stageScreen").hidden=screen!=="stage";$("battleScreen").hidden=screen!=="battle";document.body.classList.toggle("is-game-playing",screen==="battle");if(screen==="main")syncMainProgress();if(screen==="stage")$("stageScreen").querySelector(".wp-stage-physical-reserve")?.setAttribute("data-wp-stage-reserve-active","");window.dispatchEvent(new Event("weightplay:stage-sync"));window.dispatchEvent(new Event("weightplay:shell-sync"));
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if (["result"].includes(screen) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function applyHelpCopy(){const copy=PREVIEW_PACKS[locale]||PREVIEW_PACKS.en;if(activePreviewBand){$("helpTitle").textContent=copy[0];$("helpText").textContent=copy[activePreviewBand+1]||copy[2];$("helpClose").textContent=copy[1];}else{$("helpTitle").textContent=t("howTitle");$("helpText").textContent=t("helpText");$("helpClose").textContent=t("continue");}}
  function applyTextGrowthLocale(){const d=I18N[locale],segment=({"zh-Hant":"zh-tw","zh-Hans":"zh-cn","pt-BR":"pt-br"}[locale]||locale);document.querySelectorAll('[data-wp-text-related]').forEach(n=>n.setAttribute('href','/'+segment+'/games/'+n.dataset.wpTextRelated+'/'));document.querySelectorAll('.hero-copy h1,.main-header > strong,.battle-title > strong,#loadingPanel strong').forEach(n=>n.textContent=d.title);const loading=document.querySelector('#loadingPanel .loading-card > span');if(loading)loading.textContent=d.tgLoading;document.querySelectorAll('.lobby-return').forEach(n=>n.setAttribute('aria-label',d.tgBackLobby));document.querySelectorAll('[data-i18n-aria]').forEach(n=>n.setAttribute('aria-label',d[n.dataset.i18nAria]||d.tgSound));document.querySelectorAll('[data-wp-text-aria]').forEach(n=>n.setAttribute('aria-label',d[n.dataset.wpTextAria]));}
function applyLocale(){applyTextGrowthLocale();document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=t(node.dataset.i18n));document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.i18nAria)));$("localeSelect").value=locale;$("localeSelect").setAttribute("aria-label",t("language"));$("stageBack").setAttribute("aria-label",t("chooseStage"));$("battleBack").setAttribute("aria-label",t("stageMap"));$("battleHelp").setAttribute("aria-label",t("howTitle"));$("stageRail").setAttribute("aria-label",t("chooseStage"));$("board").setAttribute("aria-label",t("title"));$("guide")?.setAttribute("aria-label",t("howTitle"));document.querySelectorAll(".poster,.result-layout img").forEach(node=>node.setAttribute("alt",t("title")));applyHelpCopy();syncMainProgress();renderStageRail();if(state)renderBattle();window.dispatchEvent(new Event("wonder:locale-change"));}
  function showMechanicPreview(band){if(new URLSearchParams(location.search).get("qa")==="interface-validator")return;const key=String(band);if(!PREVIEW_PACKS[locale]||seenPreviewBands.has(key))return;seenPreviewBands.add(key);try{localStorage.setItem(PREVIEW_STORAGE_KEY,[...seenPreviewBands].join(","));}catch{}activePreviewBand=band;applyHelpCopy();showModal("helpModal","helpClose");}
  function restoreHelpCopy(){activePreviewBand=null;applyHelpCopy();}
  function syncSound(){for(const id of["soundToggle","stageSound"]){const button=$(id);button.textContent=sound?"🔊":"🔇";button.setAttribute("aria-pressed",String(sound));button.setAttribute("aria-label",t("sound"));}}
  const stageWindowLimit=()=>Math.max(1,STAGES.length-STAGE_CARD_POOL_SIZE+1);
  const desiredStageWindow=number=>Math.max(1,Math.min(stageWindowLimit(),Math.round(number)-Math.floor(STAGE_CARD_POOL_SIZE/2)));
  function createStageCard(poolIndex){const card=document.createElement("button");card.type="button";card.dataset.wpStagePoolNode=String(poolIndex+1);return card;}
  function bindStageCard(card,number){const stage=STAGES[number-1],locked=number>unlocked;if(!stage)return;card.className=`stage-card${locked?" is-locked":""}`;card.style.opacity=locked?".45":"";card.dataset.stage=String(number);card.dataset.stageIndex=String(number-1);card.dataset.index=String(number-1);card.setAttribute("aria-disabled",String(locked));card.setAttribute("aria-posinset",String(number));card.setAttribute("aria-setsize",String(STAGES.length));card.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End Enter Space");card.innerHTML=`<span class="stage-number">${String(number).padStart(2,"0")}</span><small>${t(["basics","interlock","walls","rotation","locksIce","mixed"][stage.band-1])}</small><strong class="stage-mechanics">${stage.blocks.length} ◈</strong>`;}
  function setCenteredStage(number){selectedStage=number;stageBrowseLogical=number;$("stageRail").querySelectorAll(".stage-card").forEach(card=>{const current=Number(card.dataset.stage)===number;card.tabIndex=current?0:-1;card.setAttribute("aria-current",String(current));});}
  function buildStagePool(){const rail=$("stageRail");stageWindowStart=desiredStageWindow(selectedStage);stageCardPool=Array.from({length:Math.min(STAGE_CARD_POOL_SIZE,STAGES.length)},(_,index)=>createStageCard(index));rail.replaceChildren(...stageCardPool);stageCardPool.forEach((card,index)=>bindStageCard(card,stageWindowStart+index));Object.assign(rail.dataset,{wpStageVirtualized:"bounded-recycle",wpStagePoolSize:String(stageCardPool.length),wpStageTotal:String(STAGES.length),wpStageWindowStart:String(stageWindowStart),wpStageWindowEnd:String(stageWindowStart+stageCardPool.length-1),wpStageRecycleCount:"0",wpStageCenterObserver:"manual",wpStageVirtualDrag:"true"});}
  function moveStageWindow(targetStart){const rail=$("stageRail"),target=Math.max(1,Math.min(stageWindowLimit(),targetStart));let recycled=0;while(stageWindowStart<target){const card=rail.firstElementChild;stageWindowStart+=1;rail.append(card);bindStageCard(card,stageWindowStart+stageCardPool.length-1);recycled+=1;}while(stageWindowStart>target){const card=rail.lastElementChild;stageWindowStart-=1;rail.prepend(card);bindStageCard(card,stageWindowStart);recycled+=1;}stageCardPool=[...rail.children];rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+stageCardPool.length-1);if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);}
  function ensureStageWindow(number){if(!stageCardPool.length||stageCardPool.some(card=>!card.isConnected))buildStagePool();moveStageWindow(desiredStageWindow(number));stageCardPool.forEach(card=>bindStageCard(card,Number(card.dataset.stage)));setCenteredStage(Math.round(stageBrowseLogical));}
  function stageRailPitch(){const cards=[...$("stageRail").children],first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect();return first&&second?Math.abs((second.left+second.width/2)-(first.left+first.width/2)):166;}
  function positionStageRail(logical){const rail=$("stageRail"),value=Math.max(1,Math.min(STAGES.length,logical)),anchor=Math.round(value);moveStageWindow(desiredStageWindow(anchor));const card=rail.querySelector(`[data-stage="${anchor}"]`);card?.scrollIntoView({behavior:"auto",inline:"center",block:"nearest"});rail.scrollLeft+=(value-anchor)*stageRailPitch();rail.dataset.wpStageDragLogical=value.toFixed(4);return value;}
  function centerStage(number){ensureStageWindow(number);const rail=$("stageRail"),card=rail.querySelector(`[data-stage="${number}"]`);card?.scrollIntoView({behavior:"instant",inline:"center",block:"nearest"});setCenteredStage(number);}
  function cancelStageMotion(){if(stageSettleFrame)cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;cancelStagePointer();const rail=$("stageRail");rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type");rail.classList.remove("wp-stage-dragging");delete rail.dataset.wpStageSettling;}
  function renderStageRail(){if(!$("stageRail"))return;$("stageSummary").textContent=`${unlocked} / 30`;stageBrowseLogical=selectedStage;if(!stageCardPool.length||stageCardPool.some(card=>!card.isConnected))buildStagePool();ensureStageWindow(selectedStage);centerStage(selectedStage);requestAnimationFrame(()=>centerStage(selectedStage));}
  function moveStageFocus(event){const current=event.target.closest(".stage-card");if(!current||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;const rtl=getComputedStyle($("stageRail")).direction==="rtl",number=Number(current.dataset.stage);let next=number;if(event.key==="Home")next=1;else if(event.key==="End")next=STAGES.length;else if(event.key==="ArrowLeft")next=Math.max(1,Math.min(STAGES.length,number+(rtl?1:-1)));else next=Math.max(1,Math.min(STAGES.length,number+(rtl?-1:1)));event.preventDefault();stageBrowseLogical=next;ensureStageWindow(next);const target=$("stageRail").querySelector(`[data-stage="${next}"]`);setCenteredStage(next);target?.focus({preventScroll:true});target?.scrollIntoView({behavior:"auto",inline:"center",block:"nearest"});}
  function showStage(){if(document.body.dataset.screen==="battle"){battleGeneration++;activeEscapes.clear();busy=false;pendingFeedback="";}setScreen("stage");selectedStage=unlocked;stageBrowseLogical=unlocked;renderStageRail();$("stageBack").focus();}
  function renderBattle(highlight=null){if(!state)return;const blocksByCell=new Map(state.blocks.map(block=>[keyOf(block.r,block.c),block]));const wallSet=new Set(state.walls.map(cell=>keyOf(...cell)));const portalSet=new Set(state.portals.flatMap(pair=>[keyOf(...pair.a),keyOf(...pair.b)]));const gateMap=new Map(state.gates.map(g=>[keyOf(g.r,g.c),g]));let html="";for(let r=0;r<state.size;r++)for(let c=0;c<state.size;c++){const key=keyOf(r,c),block=blocksByCell.get(key),hit=highlight&&highlight.r===r&&highlight.c===c;if(block){const tone=(r*7+c*3+String(block.id).length)%4,classes=["arrow-block",`tone-${tone}`,block.lock&&"locked",block.frozen&&"frozen",block.key&&"key",block.rotator&&"rotator",hit&&"blocked-hit"].filter(Boolean).join(" ");html+=`<div class="board-cell"><button type="button" class="${classes}" data-block="${block.id}" aria-label="${GLYPH[block.d]}"><span class="arrow-glyph" aria-hidden="true">${GLYPH[block.d]}</span>${block.lock?"<span class='block-badge' aria-hidden='true'>🔒</span>":block.key?"<span class='block-badge' aria-hidden='true'>🔑</span>":""}</button></div>`;}else if(wallSet.has(key))html+=`<div class="board-cell"><span class="obstacle wall ${hit?"blocked-hit":""}" data-cell="${key}" aria-label="${a11y().wall}">▦</span></div>`;else if(portalSet.has(key))html+=`<div class="board-cell"><span class="obstacle portal" aria-label="${a11y().portal}">◎</span></div>`;else if(gateMap.has(key))html+=`<div class="board-cell"><span class="obstacle gate ${hit?"blocked-hit":""}" data-cell="${key}" aria-label="${a11y().gate}">${GLYPH[gateMap.get(key).d]}</span></div>`;else html+="<div class='board-cell'></div>";}$("board").innerHTML=html;$("movesValue").textContent=moves;$("leftValue").textContent=state.blocks.length;$("stageLabel").textContent=`${a11y().stage} ${currentStage}`;$("mechanicLabel").textContent=t(["basics","interlock","walls","rotation","locksIce","mixed"][state.band-1]);}
  function startStage(number){battleGeneration++;currentStage=number;selectedStage=number;state=cloneStage(STAGES[number-1]);moves=0;blockedAttempts=0;busy=false;pendingFeedback="";activeEscapes.clear();$("feedback").textContent="";hideModal("resultModal");hideModal("leaveModal");setScreen("battle");renderBattle();requestAnimationFrame(()=>{$("battleBack").focus();showMechanicPreview(state.band);});
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function showModal(id,focusId){lastFocus=document.activeElement;$(id).hidden=false;$(focusId).focus();}
  function hideModal(id){$(id).hidden=true;lastFocus?.focus?.();}
  function finish(){unlocked=Math.max(unlocked,Math.min(30,currentStage+1));localStorage.setItem("arrowEscapeUnlocked",String(unlocked));syncMainProgress();const summary=RESULT_SUMMARY_COPY[locale]||RESULT_SUMMARY_COPY.en,copy=RESULT_CLEAN_COPY[locale]||RESULT_CLEAN_COPY.en;$("resultStage").textContent=`${a11y().stage} ${currentStage}`;$("resultText").textContent=summary(moves);$("resultPayoff").textContent=blockedAttempts?copy.messy(moves,blockedAttempts):copy.clean(moves);$("nextBtn").disabled=currentStage===30;showModal("resultModal","nextBtn");
    __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function markBlocker(hit){const hitBlock=state.blocks.find(item=>item.r===hit.r&&item.c===hit.c),target=hitBlock?$("board").querySelector(`[data-block="${CSS.escape(hitBlock.id)}"]`):$("board").querySelector(`[data-cell="${CSS.escape(keyOf(hit.r,hit.c))}"]`);target?.classList.add("blocked-hit");}
  function settleEscapes(generation,id){if(generation!==battleGeneration)return;activeEscapes.delete(id);busy=activeEscapes.size>0;if(busy)return;renderBattle();$("feedback").textContent=pendingFeedback;pendingFeedback="";if(!state.blocks.length)finish();else if(!actions(state).length)$("feedback").textContent=t("deadlock");}
  function activateBlock(id){if(!state)return;const block=state.blocks.find(item=>item.id===id);if(!block)return;const element=$("board").querySelector(`[data-block="${CSS.escape(id)}"]`);if(block.rotator){block.d=TURN[block.d];delete block.rotator;moves++;$("feedback").textContent=t("rotated");if(activeEscapes.size){element?.classList.remove("rotator");element?.setAttribute("aria-label",GLYPH[block.d]);const glyph=element?.querySelector(".arrow-glyph");if(glyph)glyph.textContent=GLYPH[block.d];$("movesValue").textContent=moves;}else renderBattle();return;}if(block.lock){blockedAttempts++;$("feedback").textContent=t("locked");element?.classList.add("shake");return;}if(block.frozen){blockedAttempts++;$("feedback").textContent=t("frozen");element?.classList.add("shake");return;}const hit=blocker(state,block);if(hit){blockedAttempts++;$("feedback").textContent=t("blocked",{target:blockerTargetLabel(hit)});markBlocker(hit);element?.classList.add("shake");return;}moves++;const beforeFrozen=new Set(state.blocks.filter(item=>item.frozen).map(item=>item.id)),beforeLocked=new Set(state.blocks.filter(item=>item.lock).map(item=>item.id)),generation=battleGeneration,direction=block.d;element?.classList.add(`escape-${{U:"up",R:"right",D:"down",L:"left"}[direction]}`);if(element)element.style.pointerEvents="none";state=applyAction(state,{type:"remove",id});activeEscapes.add(id);busy=true;$("movesValue").textContent=moves;$("leftValue").textContent=state.blocks.length;if(block.key&&[...beforeLocked].some(lockId=>!state.blocks.find(item=>item.id===lockId)?.lock))pendingFeedback=t("keyFound");else if([...beforeFrozen].some(frozenId=>!state.blocks.find(item=>item.id===frozenId)?.frozen))pendingFeedback=t("thawed");setTimeout(()=>settleEscapes(generation,id),330);}
  function installVirtualStageDrag(){const rail=$("stageRail");let pointerId=null,startX=0,lastX=0,logical=1,moved=false,suppressClick=false;const restore=()=>{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type");rail.classList.remove("wp-stage-dragging");delete rail.dataset.wpStageSettling;};cancelStagePointer=()=>{pointerId=null;moved=false;restore();};rail.addEventListener("pointerdown",event=>{if(document.body.dataset.screen!=="stage"||event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;if(stageSettleFrame)cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;pointerId=event.pointerId;startX=lastX=event.clientX;logical=stageBrowseLogical;moved=false;rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");event.stopImmediatePropagation();},true);document.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4){moved=true;rail.classList.add("wp-stage-dragging");}if(moved){if(event.cancelable)event.preventDefault();logical=positionStageRail(logical-delta/stageRailPitch());stageBrowseLogical=logical;stageCardPool.forEach(card=>bindStageCard(card,Number(card.dataset.stage)));setCenteredStage(Math.round(logical));}event.stopImmediatePropagation();},true);const finish=event=>{if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;pointerId=null;if(!moved){restore();return;}if(event.cancelable)event.preventDefault();suppressClick=true;setTimeout(()=>{suppressClick=false;},0);const from=logical,target=Math.max(1,Math.min(STAGES.length,Math.round(from))),started=performance.now();rail.dataset.wpStageSettling="true";const settle=now=>{const progress=Math.min(1,(now-started)/340),eased=progress*progress*(3-2*progress);stageBrowseLogical=positionStageRail(from+(target-from)*eased);if(progress<1)stageSettleFrame=requestAnimationFrame(settle);else{stageSettleFrame=0;ensureStageWindow(target);centerStage(target);restore();}};stageSettleFrame=requestAnimationFrame(settle);moved=false;event.stopImmediatePropagation();};document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);rail.addEventListener("click",event=>{if(!suppressClick)return;suppressClick=false;event.preventDefault();event.stopImmediatePropagation();},true);}
  installVirtualStageDrag();
  $("localeSelect").innerHTML=Object.entries(NAMES).map(([code,name])=>`<option value="${code}">${name}</option>`).join("");
  $("localeSelect").addEventListener("change",event=>{locale=event.target.value;localStorage.setItem("wpLang",locale);applyLocale();syncSound();});
  for(const id of["soundToggle","stageSound"])$(id).addEventListener("click",()=>{sound=!sound;localStorage.setItem("wpSound",sound?"on":"off");syncSound();});
  $("startBtn").addEventListener("click",showStage);$("stageBack").addEventListener("click",()=>{setScreen("main");$("startBtn").focus();});
  $("stageRail").addEventListener("click",event=>{const card=event.target.closest(".stage-card");if(!card)return;const stageNumber=Number(card.dataset.stage);if(stageNumber>=1&&stageNumber<=unlocked)startStage(stageNumber);});
  $("stageRail").addEventListener("keydown",moveStageFocus);
  $("stageRail").addEventListener("focusin",event=>{const card=event.target.closest(".stage-card");if(card)setCenteredStage(Number(card.dataset.stage));});
  $("stageRail").addEventListener("wonder:stage-snap",event=>{const number=Number(event.detail?.index)+1;if(number>=1&&number<=30)centerStage(number);});
  // Resolve physical input on press so fast touch/mouse sequences do not wait
  // for the browser's synthesized click. Keyboard and assistive activation
  // still arrive as detail-zero clicks. State changes remain synchronous, so
  // a repeated press on the same escaping block is naturally ignored.
  $("board").addEventListener("pointerdown",event=>{if(event.button!==0||event.isPrimary===false)return;const block=event.target.closest("[data-block]");if(!block)return;event.preventDefault();activateBlock(block.dataset.block);});
  $("board").addEventListener("click",event=>{if(event.detail!==0)return;const block=event.target.closest("[data-block]");if(block)activateBlock(block.dataset.block);});
  $("hintBtn").addEventListener("click",()=>{const solution=solveStage(state);if(!solution?.length){$("feedback").textContent=t("deadlock");return;}renderBattle();const target=$("board").querySelector(`[data-block="${CSS.escape(solution[0].id)}"]`);target?.classList.add("hinted");$("feedback").textContent=t("hinted");target?.focus({preventScroll:true});});
  $("restartBtn").addEventListener("click",()=>__wpReplayStart(() => startStage(currentStage)));$("battleBack").addEventListener("click",()=>showModal("leaveModal","leaveContinue"));$("battleHelp").addEventListener("click",()=>{restoreHelpCopy();showModal("helpModal","helpClose")});
  $("helpClose").addEventListener("click",()=>{restoreHelpCopy();hideModal("helpModal")});$("leaveContinue").addEventListener("click",()=>hideModal("leaveModal"));$("leaveStage").addEventListener("click",()=>{hideModal("leaveModal");showStage();});
  $("resultStageBtn").addEventListener("click",()=>{hideModal("resultModal");showStage();});$("retryBtn").addEventListener("click",()=>__wpReplayStart(() => startStage(currentStage)));$("nextBtn").addEventListener("click",()=>startStage(Math.min(30,currentStage+1)));
  document.addEventListener("keydown",event=>{if(event.key!=="Escape")return;if(!$("helpModal").hidden)hideModal("helpModal");else if(!$("leaveModal").hidden)hideModal("leaveModal");else if(!$("resultModal").hidden)return;else if(document.body.dataset.screen==="battle")showModal("leaveModal","leaveContinue");});
  window.__ARROW_ESCAPE__={stages:STAGES,solutions:SOLUTIONS.map(solution=>solution.map(action=>({...action}))),solveStage,cloneStage,blocker,actions,applyAction,startStage,getState:()=>({currentStage,moves,unlocked,busy,activeEscapes:[...activeEscapes],state:state&&cloneStage(state)})};
  applyLocale();syncSound();setScreen("main");setTimeout(()=>document.documentElement.dataset.gameReady="true",0);
})();
