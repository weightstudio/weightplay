// Canonical first-response Guide and FAQ copy for all existing Kite Keeper
// locale routes. Keep the six-section campaign depth in sync across locales.
export const kiteKeeperGuideLocales = {
  en: {
    aria: "Kite Keeper game guide", character: "Moss Shell Taro holding a kite spool",
    title: "How to play", intro: "Choose one wind card at a time. Reach the lantern dock in exactly three gusts.",
    sections: [
      ["Read the flight plan", "Each of the thirty routes starts with a kite on a marked grid square and a lantern dock on another. The route card gives the three wind directions that reach the dock. Check the start, target, and directions before choosing. Each gust moves the kite one square: north goes up, east right, south down, and west left. The aim is to track both coordinates and land on the dock after the third move."],
      ["Choose one gust at a time", "Open Sky routes, pick a numbered route, then choose from the four Wind cards in Battle. The kite moves after each choice, and the position line shows its new coordinates. Compare them with the dock before continuing. The progress pill names the route, while the gust counter shows how many of the three moves you have used. You choose every direction; the game does not correct a move for you."],
      ["Recover from a drift", "A move off the board or a third gust that misses the dock locks the current attempt. Choose Reset route to return the kite to its starting square and clear that attempt's gust history. Previously completed routes stay marked when this browser can save them. There is no timer or lives counter. Use the last position to spot which coordinate changed the wrong way, then try again."],
      ["Progress through thirty routes", "The campaign has thirty selectable stages: ten flights in each of three visual route families. Routes vary in their starting squares, docks, and three-wind sequences, so read the coordinates before choosing. Every route has its own start, dock, and three-gust plan. After a route, Result offers Next route, Sky routes, and Back to General lobby. Completing all thirty updates the Result heading."],
      ["Use the board and controls", "The kite and lantern are the key markers; the coordinates remain visible as you move. Wind cards work with pointer, touch, and keyboard navigation. The Stage list uses tabs with arrow keys, Home, and End. Settings offers thirteen languages and a sound preference. Sound is optional feedback; the board, status, and Result also show what happened when audio is muted."],
      ["Strategy and saved progress", "Before a move, say how it changes the coordinates, then check the marker. East increases the first coordinate; north decreases the second. Completed-route progress is saved in this browser when storage is available. When all thirty routes are complete, the game saves the number of Wind-card choices made since you opened this page, including choices from attempts you reset. Choices from earlier visits are not included. Clearing browser storage can erase these records, and private browsing may keep them only for the visit. Kite Keeper is a calm spatial-planning puzzle built around thirty fixed three-gust routes."],
    ],
    faqTitle: "FAQ", faq: [
      ["How many routes are there?", "There are thirty selectable routes, grouped into three visual families of ten."],
      ["What happens after a wrong move?", "A move off the board or a third gust that misses the dock locks that attempt. Reset route returns the kite to the current route's start; it does not clear routes you already completed."],
      ["Is progress saved?", "Completed routes are saved in this browser when storage is available. When all thirty routes are complete, the game saves the number of Wind-card choices made since you opened this page, including choices from attempts you reset. Choices from earlier visits are not included. Clearing storage can erase these records; private browsing may keep them only for the visit."],
      ["Is there a timer or a lives limit?", "No. A mistaken route can be reset and tried again without a timer or lives counter."],
    ],
  },
  "zh-Hant": {
    aria: "風箏守護者遊戲指南", character: "抱著風箏線軸的苔殼塔羅",
    title: "玩法說明", intro: "每次選一張風卡，剛好用三陣風抵達燈塔碼頭。",
    sections: [
      ["先看飛行路線", "三十條路線都會標出風箏起點與另一格上的燈塔碼頭，路線卡則列出抵達碼頭所需的三個風向。選擇前先看起點、目標與方向。每陣風移動一格：北往上、東往右、南往下、西往左。目標是追蹤兩個座標，並在第三步停在碼頭。"],
      ["一次選一陣風", "開啟天空路線，選一條編號路線，再於對戰畫面選擇四張風卡之一。每次選擇後風箏都會移動，位置文字會顯示新座標。繼續前先和碼頭位置比對。進度標籤顯示路線，陣風計數器則顯示三步中已走幾步。每個方向都由你決定，遊戲不會自動修正。"],
      ["偏航後重新出發", "移出棋盤，或第三陣風後仍未抵達碼頭，當次嘗試就會鎖定。選擇「重設路線」可讓風箏回到本路線起點，並清除這次的移動紀錄。瀏覽器能儲存時，先前完成的路線仍會保留。遊戲沒有計時器或生命次數；看看最後位置是哪個座標走錯方向，再試一次。"],
      ["走過三十條路線", "活動共有三十個可選關卡，分成三組視覺路線，每組十條。每條路線的起點、碼頭和三個風向順序各不相同，選擇前先讀座標。每條路線都有自己的三陣風計畫。完成後可在結果畫面選「下一條路線」、「天空路線」或「返回一般大廳」。完成全部三十條後，結果標題會更新。"],
      ["看懂棋盤與操作", "風箏和燈塔是主要標記；移動時座標仍會顯示。風卡可用滑鼠、觸控或鍵盤操作。關卡清單採用分頁鍵盤操作，支援方向鍵、Home 與 End。設定中有十三種語言與音效偏好。音效只是提示；靜音時仍可從棋盤、狀態文字和結果了解發生了什麼。"],
      ["策略與進度保存", "出手前先想想座標會怎麼變，再確認標記位置。向東會增加第一個座標；向北會減少第二個。瀏覽器儲存功能可用時，已完成路線會保存在這個瀏覽器。完成全部三十條後，遊戲會記下本次開啟頁面後選擇風卡的次數，重設前的出手也會計入；先前造訪的出手不會計入。清除瀏覽器資料可能刪除紀錄，無痕瀏覽也可能只保留到本次使用結束。風箏守護者是一款以三十條固定三陣風路線為核心的空間規劃益智遊戲。"],
    ],
    faqTitle: "常見問題", faq: [
      ["共有幾條路線？", "共有三十條可選路線，分成三組視覺路線，每組十條。"],
      ["走錯方向會怎樣？", "風箏移出棋盤，或第三陣風後未抵達碼頭，當次嘗試會鎖定。「重設路線」會讓風箏回到本路線起點，不會清除已完成的路線。"],
      ["進度會保存嗎？", "瀏覽器儲存功能可用時，完成路線會保存在這個瀏覽器。完成全部三十條後，遊戲會記下本次開啟頁面後選擇風卡的次數，重設前的出手也會計入；先前造訪的出手不會計入。清除資料可能刪除紀錄；無痕瀏覽也可能只保留到本次使用結束。"],
      ["有計時或生命次數嗎？", "沒有。走錯的路線可以重設後再試，不受計時或生命次數限制。"],
    ],
  },
  "zh-Hans": {
    aria: "风筝守护者游戏指南", character: "抱着风筝线轴的苔壳塔罗",
    title: "玩法说明", intro: "每次选择一张风卡，恰好用三阵风到达灯塔码头。",
    sections: [
      ["先看飞行路线", "三十条路线都会标出风筝起点和另一格上的灯塔码头，路线卡则列出到达码头所需的三个风向。选择前先看起点、目标和方向。每阵风移动一格：北向上、东向右、南向下、西向左。目标是跟踪两个坐标，并在第三步停在码头。"],
      ["一次选择一阵风", "打开天空路线，选择一条编号路线，再在对战画面选择四张风卡之一。每次选择后风筝都会移动，位置文字会显示新坐标。继续前先和码头位置对照。进度标签显示路线，阵风计数器则显示三步中已走了几步。每个方向都由你决定，游戏不会自动修正。"],
      ["偏航后重新出发", "移出棋盘，或第三阵风后仍未到达码头，当次尝试就会锁定。选择“重置路线”可让风筝回到本路线起点，并清除这次的移动记录。浏览器能保存时，先前完成的路线仍会保留。游戏没有计时器或生命次数；看看最后位置是哪一个坐标走错方向，再试一次。"],
      ["走过三十条路线", "活动共有三十个可选关卡，分成三组视觉路线，每组十条。每条路线的起点、码头和三个风向顺序各不相同，选择前先读坐标。每条路线都有自己的三阵风计划。完成后可在结果画面选择“下一条路线”“天空路线”或“返回一般大厅”。完成全部三十条后，结果标题会更新。"],
      ["看懂棋盘与操作", "风筝和灯塔是主要标记；移动时坐标仍会显示。风卡可用鼠标、触控或键盘操作。关卡列表采用分页键盘操作，支持方向键、Home 和 End。设置中有十三种语言与音效偏好。音效只是提示；静音时仍可从棋盘、状态文字和结果了解发生了什么。"],
      ["策略与进度保存", "出手前先想想坐标会怎样变化，再确认标记位置。向东会增加第一个坐标；向北会减少第二个。浏览器存储功能可用时，已完成路线会保存在这个浏览器。完成全部三十条后，游戏会记下本次打开页面后选择风卡的次数，重置前的出手也会计入；之前访问时的出手不计入。清除浏览器数据可能删除记录，无痕浏览也可能只保留到本次使用结束。风筝守护者是一款以三十条固定三阵风路线为核心的空间规划益智游戏。"],
    ],
    faqTitle: "常见问题", faq: [
      ["一共有多少条路线？", "共有三十条可选路线，分成三组视觉路线，每组十条。"],
      ["走错方向会怎样？", "风筝移出棋盘，或第三阵风后未到达码头，当次尝试会锁定。“重置路线”会让风筝回到本路线起点，不会清除已完成的路线。"],
      ["进度会保存吗？", "浏览器存储功能可用时，完成路线会保存在这个浏览器。完成全部三十条后，游戏会记下本次打开页面后选择风卡的次数，重置前的出手也会计入；之前访问时的出手不计入。清除数据可能删除记录；无痕浏览也可能只保留到本次使用结束。"],
      ["有计时或生命次数吗？", "没有。走错的路线可以重置后再试，不受计时或生命次数限制。"],
    ],
  },
  ja: {
    aria: "カイトキーパーのゲームガイド", character: "凧糸のリールを持つモスシェル・タロ",
    title: "遊び方", intro: "風カードを1枚ずつ選び、ちょうど3回の風で灯台の桟橋に着きましょう。",
    sections: [
      ["飛行ルートを読む", "30本のルートには、マス目上の凧の出発地点と、別のマスにある灯台の桟橋が示されています。ルートカードには桟橋に着くための3つの風向きが書かれています。選ぶ前に出発地点、目標、風向きを確認しましょう。風が吹くたびに凧は1マス進みます。北は上、東は右、南は下、西は左です。座標の変化を追い、3手目で桟橋に着くのが目標です。"],
      ["風を1回ずつ選ぶ", "「空のルート」を開き、番号付きルートを選んで、バトル画面の4枚の風カードから1枚選びます。選ぶたびに凧が動き、位置欄に新しい座標が表示されます。続ける前に桟橋と見比べましょう。進捗表示にはルート番号、風のカウンターには3手のうち何手使ったかが表示されます。方向は毎回自分で選び、ゲームが自動で修正することはありません。"],
      ["風に流されたらやり直す", "盤面の外へ出るか、3回目の風でも桟橋に届かないと、その試行はロックされます。「ルートをリセット」を選ぶと凧がそのルートの出発地点に戻り、今回の風の履歴が消去されます。ブラウザーが保存できる場合、クリア済みルートの印は残ります。タイマーやライフはありません。最後の位置を見て、どちらの座標が逆に動いたかを確かめて再挑戦しましょう。"],
      ["30本のルートを進む", "キャンペーンには選択できるステージが30個あり、見た目の異なる3つのルート群に10個ずつ分かれています。出発地点、桟橋、3つの風向きの組み合わせはルートごとに異なるため、選ぶ前に座標を読みましょう。各ルートには3回の風の計画があります。クリア後の結果画面から「次のルート」「空のルート」「一般ロビーに戻る」を選べます。30本すべてを終えると結果の見出しが更新されます。"],
      ["盤面と操作を使う", "凧と灯台が主な目印で、移動中も座標を確認できます。風カードはマウス、タッチ、キーボードで操作できます。ステージ一覧はタブ形式で、矢印キー、Home、Endに対応します。設定では13言語とサウンド設定を選べます。音は補助的な反応です。消音中も盤面、状態表示、結果から状況を確認できます。"],
      ["考え方と保存される進捗", "動かす前に座標がどう変わるかを考え、移動後に印を確認しましょう。東へ進むと1つ目の座標が増え、北へ進むと2つ目の座標が減ります。ブラウザーの保存機能が使える場合、クリアしたルートはこのブラウザーに保存されます。全30ルートの完了時に、このページを開いてから選んだ風カードの数を記録します。リセット前の選択も含まれ、前回以前のプレイ分は含まれません。ブラウザーのデータを消すと記録も消えることがあり、プライベートブラウズではその利用中だけ残る場合があります。カイトキーパーは、固定された30本の3風ルートで空間計画を練習するパズルです。"],
    ],
    faqTitle: "よくある質問", faq: [
      ["ルートはいくつありますか？", "選べるルートは30本で、3つの見た目の異なるグループに10本ずつ分かれています。"],
      ["間違った方向を選ぶとどうなりますか？", "盤面の外へ出るか、3回目の風でも桟橋に届かないと、その試行はロックされます。「ルートをリセット」で現在の出発地点に戻せます。クリア済みルートは消えません。"],
      ["進捗は保存されますか？", "ブラウザーが保存できる場合、クリアしたルートはこのブラウザーに保存されます。全30ルートの完了時に、このページを開いてから選んだ風カードの数を記録します。リセット前の選択も含まれ、前回以前のプレイ分は含まれません。データ削除で記録が消えることがあり、プライベートブラウズでは利用中だけ残る場合があります。"],
      ["時間制限やライフはありますか？", "ありません。失敗したルートは、時間やライフを気にせずリセットして再挑戦できます。"],
    ],
  },
  ko: {
    aria: "연날리기 수호자 게임 안내", character: "연줄 얼레를 든 모스 셸 타로",
    title: "플레이 방법", intro: "바람 카드 하나씩 골라 세 번의 바람 만에 등대 부두에 도착하세요.",
    sections: [
      ["비행 경로 읽기", "서른 개 경로에는 격자 위 연의 출발 칸과 다른 칸의 등대 부두가 표시됩니다. 경로 카드에는 부두에 도착하는 세 가지 바람 방향이 적혀 있습니다. 선택하기 전에 출발점, 목표, 방향을 확인하세요. 바람이 한 번 불 때마다 연은 한 칸 이동합니다. 북쪽은 위, 동쪽은 오른쪽, 남쪽은 아래, 서쪽은 왼쪽입니다. 두 좌표의 변화를 따라 세 번째 이동에 부두에 도착하는 것이 목표입니다."],
      ["바람을 한 번씩 선택하기", "하늘 경로를 열고 번호가 있는 경로를 고른 다음, 대전 화면의 바람 카드 네 장 중 하나를 선택하세요. 선택할 때마다 연이 움직이고 위치 문구에 새 좌표가 표시됩니다. 계속하기 전에 부두와 비교하세요. 진행 표시에는 경로가, 바람 횟수에는 세 번 중 몇 번 움직였는지가 나타납니다. 모든 방향은 직접 고르며 게임이 자동으로 고쳐 주지 않습니다."],
      ["경로를 벗어나면 다시 시도하기", "보드 밖으로 나가거나 세 번째 바람 뒤에도 부두에 도착하지 못하면 현재 시도가 잠깁니다. 경로 재설정을 누르면 연이 해당 경로의 출발 칸으로 돌아가고 이번 이동 기록이 지워집니다. 브라우저 저장이 가능하면 완료한 경로 표시는 남습니다. 타이머나 생명 횟수는 없습니다. 마지막 위치를 보고 어느 좌표가 반대 방향으로 움직였는지 확인한 뒤 다시 해 보세요."],
      ["서른 개 경로 진행하기", "캠페인에는 선택 가능한 스테이지 서른 개가 있으며, 모양이 다른 경로 세 그룹에 열 개씩 배치되어 있습니다. 경로마다 출발점과 부두, 세 번의 바람 방향 순서가 다르니 움직이기 전에 좌표를 읽으세요. 완료 후 결과 화면에서 다음 경로, 하늘 경로, 일반 로비로 돌아가기를 선택할 수 있습니다. 서른 개를 모두 완료하면 결과 제목이 바뀝니다."],
      ["보드와 조작 살펴보기", "연과 등대가 주요 표식이며 이동 중에도 좌표를 볼 수 있습니다. 바람 카드는 마우스, 터치, 키보드로 사용할 수 있습니다. 스테이지 목록은 탭 방식이며 방향키, Home, End를 지원합니다. 설정에서 13개 언어와 사운드 설정을 선택할 수 있습니다. 사운드는 보조 피드백입니다. 음소거 중에도 보드, 상태 문구, 결과에서 상황을 알 수 있습니다."],
      ["전략과 진행 상황 저장", "이동 전에 좌표가 어떻게 달라질지 생각하고, 움직인 뒤 표식을 확인하세요. 동쪽으로 가면 첫 번째 좌표가 증가하고 북쪽으로 가면 두 번째 좌표가 감소합니다. 브라우저 저장 기능을 사용할 수 있으면 완료한 경로가 이 브라우저에 저장됩니다. 서른 개 경로를 모두 완료하면 이 페이지를 연 뒤 선택한 바람 카드 수가 저장됩니다. 재설정한 시도의 선택도 포함되며, 이전 방문에서 선택한 수는 포함되지 않습니다. 브라우저 데이터를 지우면 기록이 사라질 수 있고, 비공개 브라우징에서는 방문 중에만 남을 수 있습니다. 연날리기 수호자는 고정된 세 번의 바람 경로 서른 개로 공간 계획을 연습하는 퍼즐입니다."],
    ],
    faqTitle: "자주 묻는 질문", faq: [
      ["경로는 몇 개 있나요?", "선택 가능한 경로는 서른 개이며, 모양이 다른 세 그룹에 열 개씩 나뉩니다."],
      ["잘못된 방향을 고르면 어떻게 되나요?", "보드 밖으로 나가거나 세 번째 바람 뒤에도 부두에 도착하지 못하면 해당 시도가 잠깁니다. 경로 재설정을 누르면 현재 경로의 출발점으로 돌아갑니다. 완료한 경로는 지워지지 않습니다."],
      ["진행 상황이 저장되나요?", "브라우저 저장이 가능하면 완료한 경로가 이 브라우저에 저장됩니다. 서른 개 경로를 모두 완료하면 이 페이지를 연 뒤 선택한 바람 카드 수가 저장됩니다. 재설정한 시도의 선택도 포함되며, 이전 방문에서 선택한 수는 포함되지 않습니다. 데이터 삭제로 기록이 사라질 수 있고 비공개 브라우징에서는 방문 중에만 남을 수 있습니다."],
      ["시간 제한이나 생명 횟수가 있나요?", "없습니다. 실패한 경로는 시간이나 생명 횟수 걱정 없이 재설정해 다시 시도할 수 있습니다."],
    ],
  },
  es: {
    aria: "Guía de juego de Kite Keeper", character: "Moss Shell Taro con un carrete de cometa",
    title: "Cómo jugar", intro: "Elige una carta de viento cada vez y llega al muelle del farol en exactamente tres ráfagas.",
    sections: [
      ["Lee el plan de vuelo", "Las treinta rutas muestran la casilla inicial de la cometa y el muelle del farol en otra casilla. La tarjeta de ruta indica los tres vientos necesarios para llegar. Antes de elegir, comprueba el inicio, el destino y las direcciones. Cada ráfaga mueve la cometa una casilla: norte arriba, este a la derecha, sur abajo y oeste a la izquierda. Sigue las dos coordenadas y llega al muelle con el tercer movimiento."],
      ["Elige una ráfaga cada vez", "Abre Rutas del cielo, elige una ruta numerada y selecciona una de las cuatro cartas de Viento en la batalla. La cometa se mueve tras cada elección y la línea de posición muestra las nuevas coordenadas. Compáralas con el muelle antes de continuar. El indicador de progreso muestra la ruta y el contador de ráfagas indica cuántos de los tres movimientos llevas. Tú eliges cada dirección; el juego no la corrige automáticamente."],
      ["Recupérate de un desvío", "Si la cometa sale del tablero o la tercera ráfaga no llega al muelle, el intento actual queda bloqueado. Pulsa Reiniciar ruta para volver a la casilla inicial de esa ruta y borrar el historial de ráfagas del intento. Las rutas completadas siguen marcadas si el navegador puede guardarlas. No hay temporizador ni vidas. Mira la última posición para detectar qué coordenada cambió en la dirección equivocada y vuelve a intentarlo."],
      ["Avanza por treinta rutas", "La campaña tiene treinta etapas seleccionables, repartidas en tres familias visuales de diez vuelos. Cada ruta tiene un inicio, un muelle y una secuencia propia de tres vientos; lee las coordenadas antes de elegir. Al terminar, Resultado ofrece Siguiente ruta, Rutas del cielo y Volver al vestíbulo General. Al completar las treinta, cambia el título de Resultado."],
      ["Usa el tablero y los controles", "La cometa y el farol son las marcas principales; las coordenadas siguen visibles mientras te mueves. Las cartas de Viento funcionan con ratón, pantalla táctil y teclado. La lista de etapas usa pestañas y admite las flechas, Inicio y Fin. En Ajustes puedes elegir entre trece idiomas y configurar el sonido. El sonido solo aporta indicaciones: el tablero, el estado y Resultado muestran lo ocurrido aunque esté silenciado."],
      ["Estrategia y progreso guardado", "Antes de moverte, piensa cómo cambiarán las coordenadas y comprueba la marca después. Hacia el este aumenta la primera coordenada; hacia el norte disminuye la segunda. Las rutas completadas se guardan en este navegador cuando el almacenamiento está disponible. Al completar las treinta rutas, el juego guarda cuántas cartas de Viento elegiste desde que abriste esta página; también cuenta las de los intentos que reiniciaste. No incluye elecciones de visitas anteriores. Borrar los datos del navegador puede eliminar estos registros y la navegación privada quizá solo los conserve durante la visita. Kite Keeper es un rompecabezas tranquilo de planificación espacial con treinta rutas fijas de tres ráfagas."],
    ],
    faqTitle: "Preguntas frecuentes", faq: [
      ["¿Cuántas rutas hay?", "Hay treinta rutas seleccionables, agrupadas en tres familias visuales de diez."],
      ["¿Qué pasa si elijo una dirección equivocada?", "Si la cometa sale del tablero o la tercera ráfaga no llega al muelle, el intento queda bloqueado. Reiniciar ruta devuelve la cometa al inicio de la ruta actual; no borra las rutas completadas."],
      ["¿Se guarda el progreso?", "Las rutas completadas se guardan en este navegador si el almacenamiento está disponible. Al completar las treinta rutas, el juego guarda cuántas cartas de Viento elegiste desde que abriste esta página; también cuenta las de los intentos que reiniciaste. No incluye elecciones de visitas anteriores. Borrar los datos puede eliminar los registros; la navegación privada quizá solo los conserve durante la visita."],
      ["¿Hay límite de tiempo o de vidas?", "No. Puedes reiniciar una ruta fallida y probar otra vez sin temporizador ni contador de vidas."],
    ],
  },
  "pt-BR": {
    aria: "Guia do jogo Kite Keeper", character: "Moss Shell Taro segurando um carretel de pipa",
    title: "Como jogar", intro: "Escolha uma carta de vento por vez e chegue ao cais do farol em exatamente três rajadas.",
    sections: [
      ["Leia o plano de voo", "As trinta rotas mostram a casa inicial da pipa e o cais do farol em outra casa. A carta da rota indica os três ventos necessários para chegar lá. Antes de escolher, confira o início, o destino e as direções. Cada rajada move a pipa uma casa: norte para cima, leste para a direita, sul para baixo e oeste para a esquerda. Acompanhe as duas coordenadas e chegue ao cais no terceiro movimento."],
      ["Escolha uma rajada por vez", "Abra Rotas do céu, escolha uma rota numerada e selecione uma das quatro cartas de Vento na batalha. A pipa se move após cada escolha e a linha de posição mostra as novas coordenadas. Compare-as com o cais antes de continuar. O indicador de progresso mostra a rota e o contador de rajadas informa quantos dos três movimentos já foram usados. Você escolhe cada direção; o jogo não a corrige automaticamente."],
      ["Recupere-se de um desvio", "Se a pipa sair do tabuleiro ou a terceira rajada não alcançar o cais, a tentativa atual será bloqueada. Use Reiniciar rota para voltar à casa inicial dessa rota e limpar o histórico de rajadas da tentativa. Rotas concluídas continuam marcadas quando o navegador consegue salvá-las. Não há cronômetro nem vidas. Observe a última posição para descobrir qual coordenada mudou na direção errada e tente de novo."],
      ["Avance por trinta rotas", "A campanha tem trinta fases selecionáveis, divididas em três famílias visuais de dez voos. Cada rota tem um início, um cais e uma sequência própria de três ventos; confira as coordenadas antes de escolher. Ao terminar, Resultado oferece Próxima rota, Rotas do céu e Voltar ao lobby Geral. Ao concluir as trinta, o título de Resultado muda."],
      ["Use o tabuleiro e os controles", "A pipa e o farol são os marcadores principais; as coordenadas continuam visíveis durante o movimento. As cartas de Vento funcionam com mouse, toque e teclado. A lista de fases usa abas e aceita as setas, Home e End. Em Configurações, escolha entre treze idiomas e ajuste o som. O som é apenas um retorno auxiliar: o tabuleiro, o status e Resultado mostram o que aconteceu mesmo no mudo."],
      ["Estratégia e progresso salvo", "Antes de mover, pense em como as coordenadas vão mudar e confira o marcador depois. Ir para leste aumenta a primeira coordenada; ir para norte diminui a segunda. Rotas concluídas são salvas neste navegador quando o armazenamento está disponível. Ao completar as trinta rotas, o jogo salva quantas cartas de Vento você escolheu desde que abriu esta página; também conta as das tentativas que reiniciou. Escolhas de visitas anteriores não entram nessa contagem. Limpar os dados do navegador pode apagar os registros, e a navegação privada talvez os mantenha só durante a visita. Kite Keeper é um quebra-cabeça tranquilo de planejamento espacial com trinta rotas fixas de três rajadas."],
    ],
    faqTitle: "Perguntas frequentes", faq: [
      ["Quantas rotas existem?", "São trinta rotas selecionáveis, divididas em três famílias visuais de dez."],
      ["O que acontece se eu escolher a direção errada?", "Se a pipa sair do tabuleiro ou a terceira rajada não chegar ao cais, a tentativa será bloqueada. Reiniciar rota leva a pipa de volta ao início da rota atual; as rotas concluídas não são apagadas."],
      ["O progresso é salvo?", "As rotas concluídas são salvas neste navegador quando o armazenamento está disponível. Ao completar as trinta rotas, o jogo salva quantas cartas de Vento você escolheu desde que abriu esta página; também conta as das tentativas que reiniciou. Escolhas de visitas anteriores não entram nessa contagem. Limpar os dados pode apagar os registros; a navegação privada talvez os mantenha só durante a visita."],
      ["Há limite de tempo ou de vidas?", "Não. Você pode reiniciar uma rota com erro e tentar novamente sem cronômetro ou limite de vidas."],
    ],
  },
  fr: {
    aria: "Guide du jeu Kite Keeper", character: "Moss Shell Taro tenant un moulinet de cerf-volant",
    title: "Comment jouer", intro: "Choisissez une carte Vent à la fois et atteignez le quai du phare en exactement trois rafales.",
    sections: [
      ["Lire le plan de vol", "Les trente itinéraires indiquent la case de départ du cerf-volant et le quai du phare sur une autre case. La carte de l’itinéraire donne les trois directions de vent qui mènent au quai. Avant de choisir, repérez le départ, la cible et les directions. Chaque rafale déplace le cerf-volant d’une case : le nord monte, l’est va à droite, le sud descend et l’ouest va à gauche. Suivez les deux coordonnées pour atteindre le quai au troisième mouvement."],
      ["Choisir une rafale à la fois", "Ouvrez Itinéraires du ciel, choisissez un itinéraire numéroté, puis sélectionnez l’une des quatre cartes Vent dans le combat. Le cerf-volant bouge après chaque choix et la ligne de position affiche ses nouvelles coordonnées. Comparez-les au quai avant de continuer. L’indicateur de progression affiche l’itinéraire et le compteur de rafales indique combien des trois mouvements ont été utilisés. Vous choisissez chaque direction ; le jeu ne la corrige pas automatiquement."],
      ["Repartir après une dérive", "Si le cerf-volant sort du plateau ou si la troisième rafale manque le quai, la tentative en cours se verrouille. Choisissez Réinitialiser l’itinéraire pour revenir à sa case de départ et effacer l’historique des rafales de cette tentative. Les itinéraires terminés restent marqués si le navigateur peut les enregistrer. Il n’y a ni minuteur ni vies. Regardez la dernière position pour trouver la coordonnée partie dans le mauvais sens, puis réessayez."],
      ["Parcourir trente itinéraires", "La campagne compte trente étapes sélectionnables, réparties en trois familles visuelles de dix vols. Chaque itinéraire a un départ, un quai et sa propre suite de trois vents ; lisez les coordonnées avant de choisir. Après un vol, Résultat propose Itinéraire suivant, Itinéraires du ciel et Retour au lobby général. Le titre du résultat change après les trente itinéraires."],
      ["Utiliser le plateau et les commandes", "Le cerf-volant et le phare sont les repères principaux ; les coordonnées restent visibles pendant les déplacements. Les cartes Vent fonctionnent à la souris, au toucher et au clavier. La liste des étapes utilise des onglets et accepte les flèches, Début et Fin. Les réglages proposent treize langues et une préférence de son. Le son n’est qu’un retour facultatif : le plateau, l’état et le résultat indiquent aussi ce qui s’est passé sans audio."],
      ["Stratégie et progression enregistrée", "Avant de bouger, imaginez le changement des coordonnées, puis vérifiez le repère. Vers l’est, la première coordonnée augmente ; vers le nord, la deuxième diminue. Les itinéraires terminés sont enregistrés dans ce navigateur lorsque le stockage est disponible. Quand les trente itinéraires sont terminés, le jeu enregistre le nombre de cartes Vent choisies depuis l’ouverture de cette page, y compris celles des tentatives réinitialisées. Les choix des visites précédentes ne sont pas comptés. Effacer les données du navigateur peut supprimer ces traces, et la navigation privée peut ne les conserver que pendant la visite. Kite Keeper est un puzzle calme de planification spatiale fondé sur trente itinéraires fixes de trois rafales."],
    ],
    faqTitle: "Questions fréquentes", faq: [
      ["Combien y a-t-il d’itinéraires ?", "Il y a trente itinéraires sélectionnables, répartis en trois familles visuelles de dix."],
      ["Que se passe-t-il si je choisis la mauvaise direction ?", "Si le cerf-volant sort du plateau ou si la troisième rafale manque le quai, la tentative se verrouille. Réinitialiser l’itinéraire ramène le cerf-volant à son départ actuel sans effacer les itinéraires terminés."],
      ["La progression est-elle enregistrée ?", "Les itinéraires terminés sont enregistrés dans ce navigateur si le stockage est disponible. Quand les trente itinéraires sont terminés, le jeu enregistre le nombre de cartes Vent choisies depuis l’ouverture de cette page, y compris celles des tentatives réinitialisées. Les choix des visites précédentes ne sont pas comptés. Effacer les données peut supprimer ces traces ; la navigation privée peut ne les conserver que pendant la visite."],
      ["Y a-t-il une limite de temps ou de vies ?", "Non. Vous pouvez réinitialiser un itinéraire manqué et réessayer sans minuteur ni compteur de vies."],
    ],
  },
  de: {
    aria: "Kite Keeper Spielanleitung", character: "Moss Shell Taro mit einer Drachenschnurrolle",
    title: "So wird gespielt", intro: "Wähle jeweils eine Windkarte und erreiche den Leuchtturmsteg genau mit drei Böen.",
    sections: [
      ["Den Flugplan lesen", "Auf allen dreißig Routen sind das Startfeld des Drachens und der Leuchtturmsteg auf einem anderen Feld markiert. Die Routenkarte nennt die drei Windrichtungen, die zum Steg führen. Prüfe Start, Ziel und Richtungen, bevor du wählst. Jede Böe bewegt den Drachen um ein Feld: Norden geht nach oben, Osten nach rechts, Süden nach unten und Westen nach links. Verfolge beide Koordinaten und erreiche den Steg mit dem dritten Zug."],
      ["Böe für Böe wählen", "Öffne Himmelsrouten, wähle eine nummerierte Route und dann im Gefecht eine der vier Windkarten. Nach jeder Wahl bewegt sich der Drachen; die Positionszeile zeigt die neuen Koordinaten. Vergleiche sie mit dem Steg, bevor du weitermachst. Die Fortschrittsanzeige nennt die Route, der Böenzähler zeigt die Zahl der bereits genutzten Züge von drei. Du bestimmst jede Richtung selbst; das Spiel korrigiert sie nicht automatisch."],
      ["Nach einem Abdriften neu starten", "Verlässt der Drachen das Brett oder verfehlt die dritte Böe den Steg, wird der aktuelle Versuch gesperrt. Wähle Route zurücksetzen, damit der Drachen zum Startfeld dieser Route zurückkehrt und der Böenverlauf dieses Versuchs geleert wird. Abgeschlossene Routen bleiben markiert, wenn der Browser sie speichern kann. Es gibt weder Timer noch Leben. Prüfe die letzte Position, finde die falsch veränderte Koordinate und versuche es erneut."],
      ["Dreißig Routen spielen", "Die Kampagne umfasst dreißig auswählbare Stufen, je zehn Flüge in drei optisch unterschiedlichen Routenfamilien. Startfeld, Steg und die Folge der drei Windrichtungen unterscheiden sich je nach Route. Lies daher die Koordinaten, bevor du dich festlegst. Jede Route hat ihren eigenen Drei-Böen-Plan. Nach dem Flug bietet Ergebnis Nächste Route, Himmelsrouten und Zurück zur allgemeinen Lobby. Nach allen dreißig Routen ändert sich die Ergebnisüberschrift."],
      ["Brett und Steuerung nutzen", "Drachen und Leuchtturm sind die wichtigsten Markierungen; die Koordinaten bleiben beim Zug sichtbar. Windkarten lassen sich mit Maus, Touch und Tastatur bedienen. Die Stufenliste verwendet Tabs und unterstützt Pfeiltasten, Pos1 und Ende. In den Einstellungen gibt es dreizehn Sprachen und eine Tonoption. Ton ist nur zusätzliche Rückmeldung: Brett, Status und Ergebnis zeigen auch bei Stummschaltung, was passiert ist."],
      ["Strategie und gespeicherter Fortschritt", "Überlege vor jedem Zug, wie sich die Koordinaten ändern, und prüfe danach die Markierung. Nach Osten steigt die erste Koordinate, nach Norden sinkt die zweite. Abgeschlossene Routen werden in diesem Browser gespeichert, wenn der Speicher verfügbar ist. Sind alle dreißig Routen abgeschlossen, speichert das Spiel die Zahl der seit dem Öffnen dieser Seite gewählten Windkarten; Karten aus zurückgesetzten Versuchen zählen mit. Aus früheren Besuchen stammende Züge werden nicht mitgezählt. Beim Löschen der Browserdaten können diese Einträge verschwinden; im privaten Modus bleiben sie eventuell nur während des Besuchs erhalten. Kite Keeper ist ein ruhiges räumliches Planungsspiel mit dreißig festen Routen zu je drei Böen."],
    ],
    faqTitle: "Häufige Fragen", faq: [
      ["Wie viele Routen gibt es?", "Es gibt dreißig auswählbare Routen in drei optisch unterschiedlichen Gruppen mit je zehn Routen."],
      ["Was passiert bei einer falschen Richtung?", "Verlässt der Drachen das Brett oder verfehlt die dritte Böe den Steg, wird der Versuch gesperrt. Route zurücksetzen bringt den Drachen zum Start der aktuellen Route zurück; abgeschlossene Routen bleiben erhalten."],
      ["Wird der Fortschritt gespeichert?", "Abgeschlossene Routen werden in diesem Browser gespeichert, wenn der Speicher verfügbar ist. Sind alle dreißig Routen abgeschlossen, speichert das Spiel die Zahl der seit dem Öffnen dieser Seite gewählten Windkarten; Karten aus zurückgesetzten Versuchen zählen mit. Aus früheren Besuchen stammende Züge werden nicht mitgezählt. Browserdaten können gelöscht werden; im privaten Modus bleiben Einträge eventuell nur während des Besuchs erhalten."],
      ["Gibt es Zeit- oder Lebenslimits?", "Nein. Eine verfehlte Route kann ohne Timer oder Lebenszähler zurückgesetzt und erneut versucht werden."],
    ],
  },
  it: {
    aria: "Guida di gioco di Kite Keeper", character: "Moss Shell Taro con una bobina per aquilone",
    title: "Come si gioca", intro: "Scegli una carta Vento alla volta e raggiungi il molo del faro esattamente con tre raffiche.",
    sections: [
      ["Leggi il piano di volo", "Tutti i trenta percorsi mostrano la casella iniziale dell’aquilone e il molo del faro su un’altra casella. La carta del percorso indica i tre venti necessari per arrivare al molo. Prima di scegliere, controlla partenza, obiettivo e direzioni. Ogni raffica sposta l’aquilone di una casella: nord in alto, est a destra, sud in basso e ovest a sinistra. Segui entrambe le coordinate e raggiungi il molo al terzo movimento."],
      ["Scegli una raffica alla volta", "Apri Percorsi del cielo, scegli un percorso numerato e seleziona una delle quattro carte Vento nella battaglia. Dopo ogni scelta l’aquilone si sposta e la riga della posizione mostra le nuove coordinate. Confrontale con il molo prima di continuare. L’indicatore di avanzamento mostra il percorso; il contatore delle raffiche indica quanti dei tre movimenti hai usato. Ogni direzione la scegli tu: il gioco non la corregge automaticamente."],
      ["Riparti dopo una deviazione", "Se l’aquilone esce dalla griglia o la terza raffica non raggiunge il molo, il tentativo in corso si blocca. Seleziona Reimposta percorso per riportare l’aquilone alla partenza di quel percorso e cancellare la sequenza di raffiche del tentativo. I percorsi completati restano segnati quando il browser può salvarli. Non ci sono timer né vite. Guarda l’ultima posizione, individua la coordinata cambiata nel verso sbagliato e riprova."],
      ["Avanza nei trenta percorsi", "La campagna ha trenta livelli selezionabili, divisi in tre famiglie visive da dieci voli ciascuna. Ogni percorso ha una partenza, un molo e una sequenza di tre venti propria; leggi le coordinate prima di scegliere. Al termine, Risultato offre Percorso successivo, Percorsi del cielo e Torna alla lobby generale. Dopo tutti e trenta cambia il titolo del risultato."],
      ["Usa griglia e comandi", "L’aquilone e il faro sono i riferimenti principali; le coordinate restano visibili durante gli spostamenti. Le carte Vento funzionano con mouse, tocco e tastiera. L’elenco dei livelli usa schede e supporta le frecce, Home e End. Impostazioni offre tredici lingue e una preferenza audio. L’audio è solo un feedback aggiuntivo: griglia, stato e Risultato comunicano ciò che è successo anche senza suono."],
      ["Strategia e progressi salvati", "Prima di muoverti, pensa a come cambieranno le coordinate e poi controlla il segnalino. Andando a est aumenta la prima coordinata; andando a nord diminuisce la seconda. I percorsi completati vengono salvati in questo browser se la memoria è disponibile. Quando completi tutti e trenta i percorsi, il gioco salva quante carte Vento hai scelto da quando hai aperto questa pagina, comprese quelle dei tentativi reimpostati. Le scelte delle visite precedenti non vengono conteggiate. Cancellare i dati del browser può eliminare i progressi; in navigazione privata potrebbero restare solo durante la visita. Kite Keeper è un rompicapo tranquillo di pianificazione spaziale con trenta percorsi fissi di tre raffiche."],
    ],
    faqTitle: "Domande frequenti", faq: [
      ["Quanti percorsi ci sono?", "Ci sono trenta percorsi selezionabili, divisi in tre famiglie visive da dieci."],
      ["Cosa succede se scelgo una direzione sbagliata?", "Se l’aquilone esce dalla griglia o la terza raffica non raggiunge il molo, il tentativo si blocca. Reimposta percorso riporta l’aquilone alla partenza attuale senza cancellare i percorsi completati."],
      ["I progressi vengono salvati?", "I percorsi completati si salvano in questo browser se la memoria è disponibile. Quando completi tutti e trenta i percorsi, il gioco salva quante carte Vento hai scelto da quando hai aperto questa pagina, comprese quelle dei tentativi reimpostati. Le scelte delle visite precedenti non vengono conteggiate. Cancellare i dati può eliminare i progressi; in navigazione privata potrebbero restare solo durante la visita."],
      ["Ci sono limiti di tempo o vite?", "No. Puoi reimpostare un percorso sbagliato e riprovare senza timer né contatore di vite."],
    ],
  },
  ru: {
    aria: "Руководство по игре «Хранитель воздушного змея»", character: "Моховой панцирь Таро с катушкой для воздушного змея",
    title: "Как играть", intro: "Выбирайте по одной карте ветра и доберитесь до маячного причала ровно за три порыва.",
    sections: [
      ["Изучите план полёта", "На каждом из тридцати маршрутов отмечены стартовая клетка змея и маячный причал на другой клетке. На карточке маршрута указаны три направления ветра, ведущие к причалу. Перед ходом проверьте старт, цель и направления. Каждый порыв перемещает змея на одну клетку: север — вверх, восток — вправо, юг — вниз, запад — влево. Следите за обеими координатами и попадите на причал третьим ходом."],
      ["Выбирайте по одному порыву", "Откройте «Небесные маршруты», выберите маршрут с номером и в бою нажмите одну из четырёх карт ветра. После каждого выбора змей перемещается, а строка позиции показывает новые координаты. Сравните их с причалом, прежде чем продолжить. Индикатор прогресса показывает маршрут, а счётчик порывов — сколько из трёх ходов уже использовано. Направление выбираете вы; игра не исправляет ход автоматически."],
      ["Начните заново после сноса ветром", "Если змей покинет поле или третий порыв не приведёт к причалу, текущая попытка блокируется. Нажмите «Сбросить маршрут», чтобы вернуть змея на стартовую клетку маршрута и очистить историю порывов этой попытки. Пройденные маршруты остаются отмеченными, если браузер может их сохранить. Таймера и жизней нет. Посмотрите на последнюю позицию, выясните, какая координата изменилась не в ту сторону, и попробуйте ещё раз."],
      ["Пройдите тридцать маршрутов", "В кампании тридцать выбираемых этапов: три визуальные группы по десять полётов. У каждого маршрута свои стартовая клетка, причал и последовательность из трёх направлений ветра; сначала прочитайте координаты. После полёта экран результата предлагает следующий маршрут, небесные маршруты и возврат в главное меню. После всех тридцати меняется заголовок результата."],
      ["Используйте поле и управление", "Главные ориентиры — змей и маяк; координаты видны и во время перемещения. Картами ветра можно управлять мышью, касанием и клавиатурой. В списке этапов используются вкладки; доступны стрелки, Home и End. В настройках есть тринадцать языков и выбор звука. Звук лишь дополняет обратную связь: поле, статус и результат показывают, что произошло, и без него."],
      ["Стратегия и сохранение прогресса", "Перед ходом представьте, как изменятся координаты, а после проверьте маркер. При движении на восток первая координата растёт; на север — уменьшается вторая. Пройденные маршруты сохраняются в этом браузере, если хранилище доступно. Когда завершены все тридцать маршрутов, игра сохраняет число выбранных с момента открытия этой страницы карт ветра; карты из сброшенных попыток тоже учитываются. Выборы в предыдущие визиты не входят в число. Очистка данных браузера может удалить записи, а приватный режим может хранить их только в течение визита. «Хранитель воздушного змея» — спокойная пространственная головоломка с тридцатью фиксированными маршрутами по три порыва."],
    ],
    faqTitle: "Частые вопросы", faq: [
      ["Сколько всего маршрутов?", "Можно выбрать тридцать маршрутов, разделённых на три визуальные группы по десять."],
      ["Что будет, если выбрать неверное направление?", "Если змей покинет поле или третий порыв не приведёт к причалу, попытка блокируется. Сброс маршрута возвращает змея на текущий старт, не удаляя пройденные маршруты."],
      ["Сохраняется ли прогресс?", "Пройденные маршруты сохраняются в этом браузере, если хранилище доступно. Когда завершены все тридцать маршрутов, игра сохраняет число выбранных с момента открытия этой страницы карт ветра; карты из сброшенных попыток тоже учитываются. Выборы в предыдущие визиты не входят в число. Очистка данных может удалить записи; в приватном режиме они могут храниться только во время визита."],
      ["Есть ли ограничение по времени или числу жизней?", "Нет. Неудачный маршрут можно сбросить и пройти заново без таймера и счётчика жизней."],
    ],
  },
  hi: {
    aria: "पतंग रक्षक गेम गाइड", character: "पतंग की डोर का चरखा थामे मॉस शेल टारो",
    title: "खेलने का तरीका", intro: "हर बार एक हवा का कार्ड चुनें और तीन झोंकों में लालटेन घाट तक पहुँचें।",
    sections: [
      ["उड़ान योजना पढ़ें", "तीसों रास्तों में पतंग का शुरुआती खांचा और दूसरे खांचे पर लालटेन घाट दिखता है। रास्ते का कार्ड घाट तक पहुँचने के लिए तीन हवा दिशाएँ बताता है। चुनने से पहले शुरुआत, लक्ष्य और दिशाएँ देखें। हर झोंका पतंग को एक खांचे आगे बढ़ाता है: उत्तर ऊपर, पूर्व दाएँ, दक्षिण नीचे और पश्चिम बाएँ। दोनों निर्देशांकों पर नज़र रखें और तीसरी चाल में घाट पर पहुँचें।"],
      ["एक बार में एक झोंका चुनें", "आकाश मार्ग खोलें, नंबर वाला रास्ता चुनें और खेल स्क्रीन में चार हवा कार्डों में से एक चुनें। हर चुनाव के बाद पतंग चलती है और स्थिति पंक्ति नए निर्देशांक दिखाती है। आगे बढ़ने से पहले उनकी घाट से तुलना करें। प्रगति संकेतक रास्ता बताता है और हवा की गिनती दिखाती है कि तीन में से कितनी चालें चली हैं। हर दिशा आप चुनते हैं; गेम उसे अपने-आप ठीक नहीं करता।"],
      ["रास्ता भटकने पर फिर शुरू करें", "पतंग बोर्ड से बाहर जाए या तीसरे झोंके के बाद घाट तक न पहुँचे, तो मौजूदा कोशिश लॉक हो जाती है। रास्ता रीसेट चुनने पर पतंग उसी रास्ते के शुरुआती खांचे पर लौटती है और इस कोशिश का झोंका इतिहास मिट जाता है। ब्राउज़र सहेज सके तो पूरे किए रास्तों के निशान बने रहते हैं। टाइमर या जीवन गणना नहीं है। अंतिम स्थिति देखकर पहचानें कि कौन-सा निर्देशांक गलत दिशा में बदला, फिर कोशिश करें।"],
      ["तीस रास्तों में आगे बढ़ें", "अभियान में चुने जा सकने वाले तीस चरण हैं, तीन अलग दिखने वाले रास्ता समूहों में दस-दस उड़ानें। हर रास्ते की शुरुआत, घाट और तीन हवा-दिशाओं का क्रम अलग है, इसलिए चाल से पहले निर्देशांक पढ़ें। उड़ान के बाद परिणाम स्क्रीन में अगला रास्ता, आकाश रास्ते और सामान्य लॉबी पर लौटें विकल्प हैं। तीसों पूरा करने पर परिणाम शीर्षक बदलता है।"],
      ["बोर्ड और नियंत्रण इस्तेमाल करें", "पतंग और लालटेन मुख्य निशान हैं; चलते समय भी निर्देशांक दिखते रहते हैं। हवा कार्ड माउस, स्पर्श और कीबोर्ड से चलाए जा सकते हैं। चरण सूची टैब का उपयोग करती है और तीर कुंजियाँ, Home तथा End स्वीकार करती है। सेटिंग में तेरह भाषाएँ और ध्वनि विकल्प हैं। ध्वनि केवल अतिरिक्त प्रतिक्रिया है; म्यूट होने पर भी बोर्ड, स्थिति और परिणाम बताते हैं कि क्या हुआ।"],
      ["रणनीति और सहेजी गई प्रगति", "चाल से पहले सोचें कि निर्देशांक कैसे बदलेंगे और बाद में निशान जाँचें। पूर्व जाने पर पहला निर्देशांक बढ़ता है; उत्तर जाने पर दूसरा घटता है। सहेजने की सुविधा उपलब्ध हो तो पूरे किए रास्ते इसी ब्राउज़र में सहेजे जाते हैं। सभी तीस रास्ते पूरे होने पर गेम इस पेज को खोलने के बाद चुने गए हवा कार्डों की संख्या सहेजता है। रीसेट की गई कोशिशों के कार्ड भी गिने जाते हैं; पिछली यात्राओं के कार्ड शामिल नहीं होते। ब्राउज़र डेटा मिटाने से ये रिकॉर्ड हट सकते हैं; निजी ब्राउज़िंग में वे शायद केवल इस यात्रा तक रहें। पतंग रक्षक स्थानिक योजना की शांत पहेली है, जिसमें तीन झोंकों वाले तीस तय रास्ते हैं।"],
    ],
    faqTitle: "अक्सर पूछे जाने वाले सवाल", faq: [
      ["कितने रास्ते हैं?", "चुनने के लिए तीस रास्ते हैं, जो तीन अलग दिखने वाले समूहों में दस-दस बाँटे गए हैं।"],
      ["गलत दिशा चुनने पर क्या होता है?", "पतंग बोर्ड से बाहर जाए या तीसरे झोंके के बाद घाट तक न पहुँचे, तो कोशिश लॉक हो जाती है। रास्ता रीसेट मौजूदा रास्ते की शुरुआत पर लौटाता है; पूरे किए रास्ते नहीं मिटते।"],
      ["क्या प्रगति सहेजी जाती है?", "सहेजने की सुविधा उपलब्ध हो तो पूरे किए रास्ते इसी ब्राउज़र में सहेजे जाते हैं। सभी तीस रास्ते पूरे होने पर गेम इस पेज को खोलने के बाद चुने गए हवा कार्डों की संख्या सहेजता है। रीसेट की गई कोशिशों के कार्ड भी गिने जाते हैं; पिछली यात्राओं के कार्ड शामिल नहीं होते। डेटा मिटाने से रिकॉर्ड हट सकते हैं; निजी ब्राउज़िंग में वे शायद केवल इस यात्रा तक रहें।"],
      ["क्या समय या जीवन की सीमा है?", "नहीं। गलत रास्ते को बिना टाइमर या जीवन गणना के रीसेट करके फिर आज़माया जा सकता है।"],
    ],
  },
  ar: {
    aria: "دليل لعبة حارس الطائرة الورقية", character: "تارو ذو الصدفة الطحلبية يحمل بكرة خيط طائرة ورقية",
    title: "طريقة اللعب", intro: "اختر بطاقة رياح واحدة في كل مرة، ووجّه الطائرة إلى رصيف المنارة بثلاث هبّات بالضبط.",
    sections: [
      ["اقرأ خطة الطيران", "تُظهر المسارات الثلاثون مربع انطلاق الطائرة الورقية ورصيف المنارة في مربع آخر. وتحدد بطاقة المسار اتجاهات الرياح الثلاثة اللازمة للوصول إلى الرصيف. راجع نقطة البداية والهدف والاتجاهات قبل الاختيار. تحرك كل هبّة الطائرة مربعًا واحدًا: الشمال إلى الأعلى، والشرق إلى اليمين، والجنوب إلى الأسفل، والغرب إلى اليسار. تابع الإحداثيين لتصل إلى الرصيف في الحركة الثالثة."],
      ["اختر هبّة واحدة كل مرة", "افتح مسارات السماء، واختر مسارًا مرقمًا، ثم اختر إحدى بطاقات الرياح الأربع في شاشة اللعب. تتحرك الطائرة بعد كل اختيار، ويعرض سطر الموقع الإحداثيين الجديدين. قارنهما بالرصيف قبل المتابعة. يبيّن مؤشر التقدم رقم المسار، ويعرض عداد الهبّات عدد الحركات المستخدمة من أصل ثلاث. أنت تختار كل اتجاه؛ ولا تصحح اللعبة اختيارك تلقائيًا."],
      ["استعد بعد الانحراف", "إذا خرجت الطائرة من اللوحة أو لم تصل الهبّة الثالثة إلى الرصيف، تُقفل المحاولة الحالية. اختر إعادة ضبط المسار لإرجاع الطائرة إلى مربع البداية لذلك المسار ومسح سجل هبّات هذه المحاولة. تبقى المسارات المكتملة محددة عندما يتمكن المتصفح من حفظها. لا يوجد مؤقت أو عدد محاولات محدود. راجع آخر موقع لتعرف أي إحداثي تحرك في الاتجاه الخاطئ، ثم حاول مجددًا."],
      ["تقدّم عبر ثلاثين مسارًا", "تضم الحملة ثلاثين مرحلة قابلة للاختيار، موزعة على ثلاث مجموعات مرئية من عشرة مسارات. تختلف نقطة البداية والرصيف وتسلسلات الرياح الثلاثة من مسار إلى آخر، لذا اقرأ الإحداثيات قبل الاختيار. لكل مسار خطة من ثلاث هبّات. بعد الرحلة تعرض شاشة النتيجة المسار التالي ومسارات السماء والعودة إلى الردهة العامة. يتغير عنوان النتيجة بعد إكمال المسارات الثلاثين."],
      ["استخدم اللوحة وعناصر التحكم", "الطائرة والمنارة علامتا التوجيه الأساسيتان، وتبقى الإحداثيات ظاهرة أثناء الحركة. تعمل بطاقات الرياح بالفأرة واللمس ولوحة المفاتيح. تستخدم قائمة المراحل علامات تبويب وتدعم الأسهم وHome وEnd. تضم الإعدادات ثلاث عشرة لغة وخيارًا للصوت. الصوت تنبيه إضافي فقط؛ فاللوحة والحالة والنتيجة توضح ما حدث حتى عند كتمه."],
      ["الاستراتيجية وحفظ التقدم", "قبل الحركة، توقّع تغير الإحداثيات ثم تحقق من العلامة بعد انتقالها. يزيد التحرك شرقًا الإحداثي الأول، ويقلل التحرك شمالًا الإحداثي الثاني. تُحفظ المسارات المكتملة في هذا المتصفح عندما تكون مساحة التخزين متاحة. عند إكمال المسارات الثلاثين، تحفظ اللعبة عدد بطاقات الرياح التي اخترتها منذ فتح هذه الصفحة، بما فيها اختيارات المحاولات التي أُعيد ضبطها. ولا تشمل اختيارات الزيارات السابقة. قد يؤدي مسح بيانات المتصفح إلى حذف السجلات، وقد تحتفظ بها نافذة التصفح الخاص خلال الزيارة فقط. حارس الطائرة الورقية لغز هادئ للتخطيط المكاني يضم ثلاثين مسارًا ثابتًا، لكل منها ثلاث هبّات."],
    ],
    faqTitle: "الأسئلة الشائعة", faq: [
      ["كم عدد المسارات؟", "هناك ثلاثون مسارًا للاختيار، موزعة على ثلاث مجموعات مرئية من عشرة مسارات."],
      ["ماذا يحدث إذا اخترت اتجاهًا خاطئًا؟", "إذا خرجت الطائرة من اللوحة أو لم تصل الهبّة الثالثة إلى الرصيف، تُقفل المحاولة. تعيد إعادة ضبط المسار الطائرة إلى بداية المسار الحالي ولا تمحو المسارات المكتملة."],
      ["هل يُحفظ التقدم؟", "تُحفظ المسارات المكتملة في هذا المتصفح عندما تكون مساحة التخزين متاحة. عند إكمال المسارات الثلاثين، تحفظ اللعبة عدد بطاقات الرياح التي اخترتها منذ فتح هذه الصفحة، بما فيها اختيارات المحاولات التي أُعيد ضبطها. ولا تشمل اختيارات الزيارات السابقة. قد يحذف مسح البيانات السجلات، وقد تبقى في التصفح الخاص خلال الزيارة فقط."],
      ["هل هناك حد للوقت أو للمحاولات؟", "لا. يمكنك إعادة ضبط المسار الذي أخفقت فيه والمحاولة مجددًا من دون مؤقت أو عدد محاولات محدود."],
    ],
  },
};

export function renderKiteKeeperGuide(copy) {
  if (!copy || !Array.isArray(copy.sections) || copy.sections.length !== 6 || !Array.isArray(copy.faq) || copy.faq.length !== 4) {
    throw new Error("Kite Keeper Guide locale must contain six sections and four FAQ entries");
  }
  const esc = (value) => String(value).replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[c]);
  const sections = copy.sections.map(([heading, body]) => `<div class="game-info-section"><h3>${esc(heading)}</h3><p>${esc(body)}</p></div>`).join("\n        ");
  const faq = `<div class="game-info-section"><h3>${esc(copy.faqTitle)}</h3><dl>${copy.faq.map(([question, answer]) => `<dt>${esc(question)}</dt><dd>${esc(answer)}</dd>`).join("")}</dl></div>`;
  return `<section id="gameGuide" class="guide-card game-page-info game-page-info-static" data-wp-game-guide aria-label="${esc(copy.aria)}">\n      <div class="guide-layout"><img class="guide-character" src="assets/animal-kite-keeper-taro-block-v1.webp" alt="${esc(copy.character)}" width="1024" height="1536"><div><h2 data-i18n="guideTitle" data-runtime-localize="off">${esc(copy.title)}</h2><p data-i18n="guide" data-runtime-localize="off">${esc(copy.intro)}</p></div></div>\n      <div id="guideSections" class="game-info-sections">\n        ${sections}\n        ${faq}\n      </div>\n    </section>`;
}
