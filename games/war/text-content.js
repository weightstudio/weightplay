/* Locale-owned War text and native Guide; rules remain in the shared engine. */
(function(root){
  "use strict";
  const copies = {
  "en": {
    "summary": "Play solo War: each side reveals one card; the higher rank takes the pile. Ties add three face-down cards per side.",
    "headings": [
      "How a round works",
      "Ties and short decks",
      "Reading the round and replaying",
      "Player and save information",
      "Frequently asked questions",
      "Related games"
    ],
    "rules": "A shuffled 52-card deck is divided equally: 26 cards for you and 26 for the computer. Flip reveals the top card of each deck. The higher rank takes the entire central pile, which is shuffled before being added to the winner’s deck. Suits do not affect the result. This implementation uses A = 1, J = 11, Q = 12 and K = 13, so A is the lowest card.",
    "ties": "Equal ranks leave the cards in the central pile. Press the tie action to add three face-down cards per side, then reveal one more card each. Another tie repeats this process. If you have fewer than four cards for this action, you lose; otherwise, if the computer has fewer than four, you win. If both sides are short, the current rule gives the computer the win. This ends the round immediately.",
    "replay": "Watch both deck counts and the growing central pile: a tied sequence can transfer many cards at once. You do not choose cards or gain an advantage by flipping faster. Both Restart and New Game shuffle a fresh deal; neither restores the previous order. The design makes rank comparisons and transfers visible, rather than presenting card selection as a strategy.",
    "save": "Completed-game totals, wins, losses and sound preferences can be saved in this browser when local storage is available. Unfinished decks and the central pile are not saved across a reload or language-route change. No account, cloud save or purchase is required. Clearing site data or changing browsers can remove or separate your records.",
    "faq": [
      [
        "Which card is higher?",
        "Compare the rank only: K > Q > J > 10 > … > 2 > A. Suits are ignored."
      ],
      [
        "What changes after a tie?",
        "Each side adds three cards face down and one face up when it can supply four cards. The next higher rank collects the accumulated pile."
      ],
      [
        "When does the round finish?",
        "A side with no cards loses. A tie also ends the round if either side cannot supply four more cards, using the short-deck rule above."
      ],
      [
        "Can I replay the identical deal?",
        "No. Both restart actions and a new game shuffle the cards again. The previous deal is not restored."
      ],
      [
        "Can I resume after closing the page?",
        "No unfinished deal is stored. Only completed-game records and preferences can remain in the browser."
      ],
      [
        "Do suits affect the result?",
        "No. Only rank is compared; suits do not change who wins or whether the cards tie."
      ]
    ],
    "tags": [
      "Rank comparison",
      "War ties",
      "Single-player card game"
    ],
    "relatedIntro": "Try these card games when you want to choose which card to play.",
    "related": [
      "Play one rank above or below a centre card before the computer does.",
      "Follow suit and avoid penalty cards in a four-player round."
    ],
    "factLabels": [
      "Deck",
      "Rank order",
      "Tie contribution"
    ],
    "ui": {
      "back": "Back",
      "settings": "Settings",
      "language": "Language",
      "start": "Start Game",
      "restart": "Restart",
      "newGame": "New Game",
      "hand": "Your hand",
      "roundOver": "Round complete",
      "close": "Close",
      "flip": "Flip",
      "war": "WAR!",
      "yourTurn": "Your turn",
      "score": "Score",
      "cards": "cards",
      "winner": "You win!",
      "soundOn": "Sound: on",
      "soundOff": "Sound: off",
      "computer": "Computer",
      "record": "Wins: {wins} · Losses: {losses}",
      "eyebrow": "Classic card game",
      "guideLabel": "Game guide",
      "posterAlt": "Game artwork: {title}",
      "summary": "Play solo War: each side reveals one card; the higher rank takes the pile. Ties add three face-down cards per side.",
      "loser": "Computer wins",
      "resultStats": "WAR {wars} · Biggest pot {largest} cards"
    },
    "description": "Play solo War: each side reveals one card; the higher rank takes the pile. Ties add three face-down cards per side."
  },
  "zh-Hant": {
    "summary": "和電腦玩單人比牌：雙方翻開牌堆頂牌比較點數，勝者收下中央牌堆；平手時各放三張蓋牌再翻一張。",
    "headings": [
      "一局如何進行",
      "平手與剩餘牌數不足",
      "觀察牌局與重新開始",
      "玩家與存檔資訊",
      "常見問題",
      "相關遊戲"
    ],
    "rules": "洗好的 52 張牌平均分配，你和電腦各拿 26 張。每次翻牌會揭開雙方牌堆頂端的一張牌，點數較高者收下全部中央牌堆；收下的牌會先打亂，再加到獲勝方的牌堆底部。花色不影響勝負。本作以 A＝1、J＝11、Q＝12、K＝13 比較，因此 A 最小。",
    "ties": "同點數的牌會留在中央。按下平手後的操作按鈕，雙方各放入三張蓋牌，再各翻一張；再次平手就重複。若你的剩餘牌不足四張，你會落敗；否則，若電腦不足四張，你會獲勝。雙方都不足四張時，目前規則判定電腦獲勝，並立即結束這一局。",
    "replay": "留意雙方剩餘牌數與中央累積的牌，連續平手可能一次轉移大量牌。你不能挑選要翻出的牌，翻得快也沒有優勢。「重新開始」與「新遊戲」都會重新洗牌，不會還原上一局的順序。這套設計讓點數比較與牌堆轉移更容易觀察，而不是讓玩家靠選牌制定策略。",
    "save": "瀏覽器允許本機儲存時，完成局數、勝場、敗場與音效偏好可保存在此瀏覽器。重新載入或切換語系路由後，未完成的雙方牌堆與中央牌堆不會保留。不需要帳號、雲端存檔或購買。清除網站資料或改用其他瀏覽器，可能移除紀錄或產生分開的紀錄。",
    "faq": [
      [
        "如何比較大小？",
        "只看點數：K＞Q＞J＞10＞…＞2＞A，不比較花色。"
      ],
      [
        "平手後會怎樣？",
        "能提供四張牌時，雙方各放三張蓋牌，再翻一張；下一次較大的點數收下累積牌堆。"
      ],
      [
        "什麼時候結束一局？",
        "沒有牌的一方落敗。平手時若任一方無法再提供四張牌，也會依上面的剩餘牌數規則結算。"
      ],
      [
        "可以重玩完全相同的發牌嗎？",
        "不行。重新開始與新遊戲都會重新洗牌，不還原上一局發牌。"
      ],
      [
        "關閉頁面後能繼續原本牌局嗎？",
        "未完成的牌局不會儲存；只有已完成牌局的紀錄與偏好可保留在瀏覽器中。"
      ],
      [
        "花色會影響結果嗎？",
        "不會。勝負只比較點數；花色不會改變勝者，也不會造成平手。"
      ]
    ],
    "tags": [
      "點數比較",
      "平手加牌",
      "單人紙牌遊戲"
    ],
    "relatedIntro": "想親自決定出哪張牌，可以接著玩這些紙牌遊戲。",
    "related": [
      "搶在電腦之前，打出比中央牌高一點或低一點的牌。",
      "在四人牌局中跟隨花色，避開罰分牌。"
    ],
    "factLabels": [
      "牌組",
      "點數順序",
      "平手加牌"
    ],
    "ui": {
      "back": "返回",
      "settings": "設定",
      "language": "語言",
      "start": "開始遊戲",
      "restart": "重新開始",
      "newGame": "新遊戲",
      "hand": "你的手牌",
      "roundOver": "本局完成",
      "close": "關閉",
      "flip": "翻牌",
      "war": "戰爭！",
      "yourTurn": "你的回合",
      "score": "得分",
      "cards": "張牌",
      "winner": "你贏了！",
      "soundOn": "音效：開啟",
      "soundOff": "音效：關閉",
      "computer": "電腦",
      "record": "{wins} 勝 · {losses} 敗",
      "eyebrow": "經典紙牌遊戲",
      "guideLabel": "遊戲指南",
      "posterAlt": "{title}遊戲圖片",
      "summary": "和電腦玩單人比牌：雙方翻開牌堆頂牌比較點數，勝者收下中央牌堆；平手時各放三張蓋牌再翻一張。",
      "loser": "電腦獲勝",
      "resultStats": "戰爭 {wars} 次 · 最大底池 {largest} 張"
    },
    "description": "和電腦玩單人比牌：雙方翻開牌堆頂牌比較點數，勝者收下中央牌堆；平手時各放三張蓋牌再翻一張。"
  },
  "zh-Hans": {
    "summary": "和电脑玩单人比牌：双方翻开牌堆顶牌比较点数，胜者收下中央牌堆；平局时各放三张暗牌再翻一张。",
    "headings": [
      "一局如何进行",
      "平局与剩余牌数不足",
      "观察牌局与重新开始",
      "玩家与存档信息",
      "常见问题",
      "相关游戏"
    ],
    "rules": "洗好的 52 张牌平均分配，你和电脑各拿 26 张。每次翻牌会揭开双方牌堆顶端的一张牌，点数较高者收下全部中央牌堆；收下的牌会先打乱，再加到获胜方牌堆的底部。花色不影响胜负。本作按 A＝1、J＝11、Q＝12、K＝13 比较，因此 A 最小。",
    "ties": "同点数的牌会留在中央。按下平局后的操作按钮，双方各放入三张暗牌，再各翻一张；再次平局就重复。若你的剩余牌不足四张，你会落败；否则，若电脑不足四张，你会获胜。双方都不足四张时，当前规则判定电脑获胜，并立即结束这一局。",
    "replay": "留意双方剩余牌数与中央累积的牌，连续平局可能一次转移大量牌。你不能挑选要翻出的牌，翻得快也没有优势。“重新开始”与“新游戏”都会重新洗牌，不会还原上一局的顺序。这套设计让点数比较与牌堆转移更容易观察，而不是让玩家靠选牌制定策略。",
    "save": "浏览器允许本地存储时，完成局数、胜场、败场与音效偏好可保存在此浏览器。重新加载或切换语言页面后，未完成的双方牌堆与中央牌堆不会保留。不需要账号、云端存档或购买。清除网站数据或改用其他浏览器，可能移除记录或产生分开的记录。",
    "faq": [
      [
        "如何比较大小？",
        "只看点数：K＞Q＞J＞10＞…＞2＞A，不比较花色。"
      ],
      [
        "平局后会怎样？",
        "能提供四张牌时，双方各放三张暗牌，再翻一张；下一次较大的点数收下累积牌堆。"
      ],
      [
        "什么时候结束一局？",
        "没有牌的一方落败。平局时若任一方无法再提供四张牌，也会依上面的剩余牌数规则结算。"
      ],
      [
        "可以重玩完全相同的发牌吗？",
        "不行。重新开始与新游戏都会重新洗牌，不还原上一局发牌。"
      ],
      [
        "关闭页面后能继续原本牌局吗？",
        "未完成的牌局不会保存；只有已完成牌局的记录与偏好可保留在浏览器中。"
      ],
      [
        "花色会影响结果吗？",
        "不会。胜负只比较点数；花色不会改变胜者，也不会造成平局。"
      ]
    ],
    "tags": [
      "点数比较",
      "平局加牌",
      "单人纸牌游戏"
    ],
    "relatedIntro": "想亲自决定出哪张牌，可以接着玩这些纸牌游戏。",
    "related": [
      "抢在电脑之前，打出比中央牌高一点或低一点的牌。",
      "在四人牌局中跟随花色，避开罚分牌。"
    ],
    "factLabels": [
      "牌组",
      "点数顺序",
      "平局加牌"
    ],
    "ui": {
      "back": "返回",
      "settings": "设置",
      "language": "语言",
      "start": "开始游戏",
      "restart": "重新开始",
      "newGame": "新游戏",
      "hand": "你的手牌",
      "roundOver": "本局完成",
      "close": "关闭",
      "flip": "翻牌",
      "war": "战争！",
      "yourTurn": "你的回合",
      "score": "得分",
      "cards": "张牌",
      "winner": "你赢了！",
      "soundOn": "音效：开启",
      "soundOff": "音效：关闭",
      "computer": "电脑",
      "record": "{wins} 胜 · {losses} 负",
      "eyebrow": "经典纸牌游戏",
      "guideLabel": "游戏指南",
      "posterAlt": "{title}游戏图片",
      "summary": "和电脑玩单人比牌：双方翻开牌堆顶牌比较点数，胜者收下中央牌堆；平局时各放三张暗牌再翻一张。",
      "loser": "电脑获胜",
      "resultStats": "战争 {wars} 次 · 最大底池 {largest} 张"
    },
    "description": "和电脑玩单人比牌：双方翻开牌堆顶牌比较点数，胜者收下中央牌堆；平局时各放三张暗牌再翻一张。"
  },
  "ja": {
    "summary": "コンピューターと遊ぶ一人用カードゲーム。山札の上を公開して数字を比べ、勝者が中央の札を獲得。同点では双方が伏せ札を3枚置いてもう1枚公開します。",
    "headings": [
      "ラウンドの流れ",
      "同点とカード不足",
      "盤面の見方とやり直し",
      "プレイヤーと保存情報",
      "よくある質問",
      "関連ゲーム"
    ],
    "rules": "52枚をシャッフルし、プレイヤーとコンピューターに26枚ずつ配ります。めくるたびに両者の山札の一番上を公開し、数字の大きい側が中央のカードをすべて獲得します。獲得したカードは順番を混ぜてから山札の下に加えます。スートは判定に影響しません。本作では A＝1、J＝11、Q＝12、K＝13 なので、A が最小です。",
    "ties": "同じ数字ならカードは中央に残ります。同点時のボタンを押すと、両者が3枚を裏向きに置き、もう1枚ずつ公開します。再び同点なら繰り返します。この操作に必要な4枚が自分になければ敗北し、自分に4枚以上あって相手が足りなければ勝利します。両者とも足りない場合、現在のルールではコンピューターの勝利となり、その場で終了します。",
    "replay": "両者の残り枚数と中央にたまる枚数を見ましょう。同点が続くと、多くのカードが一度に移ります。出すカードは選べず、速くめくっても有利にはなりません。「やり直し」と「新しいゲーム」はどちらも新しくシャッフルし、以前の並びを再現しません。カード選択の戦略ではなく、数字の比較とカードの移動を見やすくする設計です。",
    "save": "ローカル保存が許可されていれば、終了したゲーム数、勝敗数、音の設定をこのブラウザーに保存できます。再読み込みや言語ページの変更後は、途中の山札と中央のカードは残りません。アカウント、クラウド保存、購入は不要です。サイトデータの削除やブラウザーの変更により、記録が消えたり別々になったりします。",
    "faq": [
      [
        "カードの強さは？",
        "K＞Q＞J＞10＞…＞2＞A の順です。スートは関係ありません。"
      ],
      [
        "同点になると？",
        "4枚を出せる場合、各自3枚を裏向きに置き、1枚を公開します。次に数字が大きかった側が中央の全カードを取ります。"
      ],
      [
        "いつ終了しますか？",
        "山札がなくなった側が負けます。同点時にどちらかが4枚を用意できない場合も、上記のカード不足ルールで終了します。"
      ],
      [
        "同じ配り方で再挑戦できますか？",
        "できません。やり直しも新しいゲームも再シャッフルし、前の配り方は復元しません。"
      ],
      [
        "ページを閉じた後に再開できますか？",
        "途中の配り札は保存されません。終了済みの記録と設定だけがブラウザーに残ります。"
      ],
      [
        "スートは勝敗に影響しますか？",
        "いいえ。勝敗は数字だけで決まり、スートによって勝者が変わったり同点になったりすることはありません。"
      ]
    ],
    "tags": [
      "ランク比較",
      "同点時の追加札",
      "1人用カードゲーム"
    ],
    "relatedIntro": "出すカードを自分で選びたいときは、こちらもどうぞ。",
    "related": [
      "中央のカードと数字が1つ違うカードを、相手より先に出します。",
      "4人のラウンドでスートに従い、失点カードを避けます。"
    ],
    "factLabels": [
      "デッキ",
      "数字の順序",
      "同点時の追加"
    ],
    "ui": {
      "back": "戻る",
      "settings": "設定",
      "language": "言語",
      "start": "ゲーム開始",
      "restart": "再スタート",
      "newGame": "新しいゲーム",
      "hand": "手札",
      "roundOver": "ラウンド終了",
      "close": "閉じる",
      "flip": "めくる",
      "war": "戦争！",
      "yourTurn": "あなたの番",
      "score": "スコア",
      "cards": "枚",
      "winner": "あなたの勝ち！",
      "soundOn": "音：オン",
      "soundOff": "音：オフ",
      "computer": "コンピューター",
      "record": "{wins}勝 · {losses}敗",
      "eyebrow": "定番カードゲーム",
      "guideLabel": "ゲームガイド",
      "posterAlt": "{title}のゲーム画像",
      "summary": "コンピューターと遊ぶ一人用カードゲーム。山札の上を公開して数字を比べ、勝者が中央の札を獲得。同点では双方が伏せ札を3枚置いてもう1枚公開します。",
      "loser": "コンピューターの勝ち",
      "resultStats": "戦争 {wars}回 · 最大ポット {largest}枚"
    },
    "description": "コンピューターと遊ぶ一人用カードゲーム。山札の上を公開して数字を比べ、勝者が中央の札を獲得。同点では双方が伏せ札を3枚置いてもう1枚公開します。"
  },
  "ko": {
    "summary": "컴퓨터와 겨루는 1인 카드 게임입니다. 양쪽 덱의 맨 위 카드를 공개해 순위를 비교하고, 동점이면 양쪽이 뒷면 카드 세 장을 둔 뒤 한 장씩 더 공개합니다.",
    "headings": [
      "한 판의 진행",
      "동점과 카드 부족",
      "판을 살펴보고 다시 시작하기",
      "플레이어 및 저장 정보",
      "자주 묻는 질문",
      "관련 게임"
    ],
    "rules": "52장을 섞어 플레이어와 컴퓨터에게 26장씩 나눕니다. 뒤집을 때마다 양쪽 맨 위 카드가 공개되고, 숫자가 큰 쪽이 가운데 카드를 모두 가져갑니다. 가져간 카드는 순서를 섞은 뒤 자기 더미 맨 아래에 넣습니다. 무늬는 승패에 영향을 주지 않습니다. 이 게임은 A＝1, J＝11, Q＝12, K＝13으로 계산하므로 A가 가장 작습니다.",
    "ties": "숫자가 같으면 카드는 가운데 남습니다. 동점 상태의 버튼을 누르면 양쪽에서 세 장을 뒷면으로 놓고 한 장씩 더 공개합니다. 다시 같으면 반복합니다. 이때 플레이어에게 네 장이 없으면 패배하며, 플레이어는 네 장 이상인데 컴퓨터가 부족하면 승리합니다. 양쪽 모두 부족할 때는 현재 규칙상 컴퓨터가 이기고 즉시 한 판이 끝납니다.",
    "replay": "양쪽 남은 카드와 가운데 쌓이는 수를 보세요. 동점이 이어지면 한 번에 많은 카드가 이동합니다. 카드를 직접 고를 수 없으며 빨리 뒤집어도 유리하지 않습니다. 다시 시작과 새 게임 모두 새로 섞으며 이전 순서를 복원하지 않습니다. 카드 선택 전략보다는 숫자 비교와 카드 이동을 쉽게 관찰하도록 설계했습니다.",
    "save": "로컬 저장이 허용되면 완료한 게임 수, 승패 기록, 소리 설정을 이 브라우저에 저장합니다. 새로고침하거나 언어 페이지를 바꾸면 진행 중인 양쪽 카드와 가운데 더미는 남지 않습니다. 계정, 클라우드 저장, 구매는 필요하지 않습니다. 사이트 데이터를 지우거나 브라우저를 바꾸면 기록이 사라지거나 별개로 보관됩니다.",
    "faq": [
      [
        "어떤 카드가 더 큰가요?",
        "K＞Q＞J＞10＞…＞2＞A 순서입니다. 무늬는 비교하지 않습니다."
      ],
      [
        "동점이면 어떻게 되나요?",
        "네 장을 낼 수 있으면 각각 세 장을 뒷면으로 놓고 한 장을 공개합니다. 다음에 숫자가 큰 쪽이 누적된 더미를 가져갑니다."
      ],
      [
        "한 판은 언제 끝나나요?",
        "카드가 없는 쪽이 집니다. 동점에서 어느 쪽이든 네 장을 더 낼 수 없으면 위의 카드 부족 규칙으로 끝납니다."
      ],
      [
        "완전히 같은 패로 다시 할 수 있나요?",
        "아니요. 다시 시작과 새 게임 모두 다시 섞으며 이전 배분을 복원하지 않습니다."
      ],
      [
        "페이지를 닫았다가 이어 할 수 있나요?",
        "진행 중인 패는 저장하지 않습니다. 완료 기록과 설정만 브라우저에 남을 수 있습니다."
      ],
      [
        "무늬가 결과에 영향을 주나요?",
        "아니요. 승패는 숫자 순위만 비교하며, 무늬 때문에 승자가 바뀌거나 동점이 되지는 않습니다."
      ]
    ],
    "tags": [
      "순위 비교",
      "동점 추가 카드",
      "1인 카드 게임"
    ],
    "relatedIntro": "낼 카드를 직접 고르고 싶다면 다음 카드 게임을 해 보세요.",
    "related": [
      "중앙 카드보다 숫자가 하나 크거나 작은 카드를 컴퓨터보다 먼저 냅니다.",
      "네 명의 한 판에서 무늬를 따르며 벌점 카드를 피합니다."
    ],
    "factLabels": [
      "카드 구성",
      "숫자 순서",
      "동점 추가 카드"
    ],
    "ui": {
      "back": "돌아가기",
      "settings": "설정",
      "language": "언어",
      "start": "게임 시작",
      "restart": "다시 시작",
      "newGame": "새 게임",
      "hand": "내 패",
      "roundOver": "라운드 완료",
      "close": "닫기",
      "flip": "뒤집기",
      "war": "전쟁!",
      "yourTurn": "당신의 차례",
      "score": "점수",
      "cards": "장",
      "winner": "승리!",
      "soundOn": "소리: 켜짐",
      "soundOff": "소리: 꺼짐",
      "computer": "컴퓨터",
      "record": "{wins}승 · {losses}패",
      "eyebrow": "클래식 카드 게임",
      "guideLabel": "게임 안내",
      "posterAlt": "{title} 게임 그림",
      "summary": "컴퓨터와 겨루는 1인 카드 게임입니다. 양쪽 덱의 맨 위 카드를 공개해 순위를 비교하고, 동점이면 양쪽이 뒷면 카드 세 장을 둔 뒤 한 장씩 더 공개합니다.",
      "loser": "컴퓨터 승리",
      "resultStats": "전쟁 {wars}회 · 최대 더미 {largest}장"
    },
    "description": "컴퓨터와 겨루는 1인 카드 게임입니다. 양쪽 덱의 맨 위 카드를 공개해 순위를 비교하고, 동점이면 양쪽이 뒷면 카드 세 장을 둔 뒤 한 장씩 더 공개합니다."
  },
  "es": {
    "summary": "Juega solo contra el ordenador: compara las cartas reveladas, gana la pila central y resuelve los empates con tres cartas boca abajo por lado.",
    "headings": [
      "Cómo funciona una partida",
      "Empates y falta de cartas",
      "Observar y volver a jugar",
      "Información del jugador y del guardado",
      "Preguntas frecuentes",
      "Juegos relacionados"
    ],
    "rules": "Se barajan 52 cartas y se reparten 26 para ti y 26 para el ordenador. Cada volteo descubre la carta superior de ambos mazos. El valor más alto gana todo el montón central, que se mezcla antes de añadirse al fondo del mazo ganador. El palo no importa. Esta versión usa A＝1, J＝11, Q＝12 y K＝13, por lo que el as es la carta más baja.",
    "ties": "Si los valores coinciden, las cartas quedan en el centro. Pulsa la acción de desempate para colocar tres cartas boca abajo por lado y revelar otra. Un nuevo empate repite el proceso. Si te quedan menos de cuatro cartas, pierdes; si tienes cuatro o más y el ordenador no, ganas. Si ambos tienen menos de cuatro, la regla actual da la victoria al ordenador y termina la partida.",
    "replay": "Observa las cartas restantes y el montón central: varios empates pueden transferir muchas cartas de golpe. No eliges qué carta sale ni ganas ventaja volteando más rápido. Reiniciar y Nueva partida barajan de nuevo; ninguno recupera el orden anterior. El diseño hace legibles las comparaciones y transferencias, no plantea una estrategia de selección de cartas.",
    "save": "Si el navegador permite almacenamiento local, puede conservar partidas terminadas, victorias, derrotas y preferencias de sonido. Los mazos y el montón de una partida sin terminar no se guardan al recargar o cambiar de página de idioma. No se requieren cuenta, guardado en la nube ni compras. Borrar los datos del sitio o cambiar de navegador puede eliminar o separar los registros.",
    "faq": [
      [
        "¿Qué carta es más alta?",
        "El orden es K > Q > J > 10 > … > 2 > A. Los palos no cuentan."
      ],
      [
        "¿Qué ocurre tras un empate?",
        "Si cada lado dispone de cuatro cartas, coloca tres boca abajo y revela una. El siguiente valor más alto se lleva todo lo acumulado."
      ],
      [
        "¿Cuándo acaba la partida?",
        "Pierde quien se queda sin cartas. Si durante un empate alguien no puede aportar cuatro más, se aplica la regla de mazo corto explicada arriba."
      ],
      [
        "¿Puedo repetir exactamente el reparto?",
        "No. Reiniciar y Nueva partida vuelven a barajar; no restauran el reparto anterior."
      ],
      [
        "¿Puedo continuar después de cerrar la página?",
        "La partida en curso no se guarda. Solo pueden conservarse resultados de partidas terminadas y preferencias locales."
      ],
      [
        "¿El palo influye en el resultado?",
        "No. Solo se compara el rango; el palo no cambia quién gana ni provoca un empate."
      ]
    ],
    "tags": [
      "Comparación de rangos",
      "Desempate con cartas",
      "Cartas en solitario"
    ],
    "relatedIntro": "Prueba estos juegos cuando quieras elegir qué carta jugar.",
    "related": [
      "Juega un valor por encima o por debajo de una carta central antes que el ordenador.",
      "Sigue el palo y evita cartas de penalización en una partida de cuatro jugadores."
    ],
    "factLabels": [
      "Baraja",
      "Orden de valores",
      "Aporte al desempate"
    ],
    "ui": {
      "back": "Volver",
      "settings": "Ajustes",
      "language": "Idioma",
      "start": "Empezar",
      "restart": "Reiniciar",
      "newGame": "Nueva partida",
      "hand": "Tu mano",
      "roundOver": "Ronda completada",
      "close": "Cerrar",
      "flip": "Voltear",
      "war": "¡Guerra!",
      "yourTurn": "Tu turno",
      "score": "Puntuación",
      "cards": "cartas",
      "winner": "¡Has ganado!",
      "soundOn": "Sonido: activado",
      "soundOff": "Sonido: desactivado",
      "computer": "Ordenador",
      "record": "Victorias: {wins} · Derrotas: {losses}",
      "eyebrow": "Juego de cartas clásico",
      "guideLabel": "Guía del juego",
      "posterAlt": "Ilustración de {title}",
      "summary": "Juega solo contra el ordenador: compara las cartas reveladas, gana la pila central y resuelve los empates con tres cartas boca abajo por lado.",
      "loser": "Gana el ordenador",
      "resultStats": "Guerras: {wars} · Bote mayor: {largest} cartas"
    },
    "description": "Juega solo contra el ordenador: compara las cartas reveladas, gana la pila central y resuelve los empates con tres cartas boca abajo por lado."
  },
  "pt-BR": {
    "summary": "Jogue sozinho contra o computador: compare os valores revelados, ganhe a pilha central e resolva empates com três cartas viradas para baixo por lado.",
    "headings": [
      "Como a partida funciona",
      "Empates e falta de cartas",
      "Observar e jogar novamente",
      "Informações do jogador e do salvamento",
      "Perguntas frequentes",
      "Jogos relacionados"
    ],
    "rules": "As 52 cartas são embaralhadas e divididas: 26 para você e 26 para o computador. Cada virada revela a carta de cima dos dois montes. O maior valor ganha todo o monte central, que é misturado antes de ir para o fim do monte vencedor. O naipe não importa. Esta versão usa A＝1, J＝11, Q＝12 e K＝13; portanto, o ás é a carta mais baixa.",
    "ties": "Valores iguais deixam as cartas no centro. Use a ação de desempate para colocar três cartas viradas para baixo de cada lado e revelar mais uma. Outro empate repete o processo. Se você tiver menos de quatro cartas, perde; se tiver quatro ou mais e o computador não, ganha. Se ambos tiverem menos de quatro, a regra atual dá a vitória ao computador e encerra a partida.",
    "replay": "Observe as cartas restantes e o monte central: empates seguidos podem transferir muitas cartas de uma vez. Você não escolhe a carta nem obtém vantagem virando mais rápido. Reiniciar e Novo jogo embaralham novamente; nenhum restaura a ordem anterior. O objetivo do design é tornar a comparação e a transferência claras, não oferecer uma estratégia de escolha de cartas.",
    "save": "Quando o armazenamento local está disponível, este navegador pode guardar partidas concluídas, vitórias, derrotas e preferências de som. Os montes de uma partida em andamento não ficam salvos ao recarregar ou mudar a página de idioma. Não são necessários conta, salvamento na nuvem ou compras. Limpar os dados do site ou mudar de navegador pode apagar ou separar os registros.",
    "faq": [
      [
        "Qual carta é maior?",
        "A ordem é K > Q > J > 10 > … > 2 > A. Os naipes não contam."
      ],
      [
        "O que acontece após um empate?",
        "Com quatro cartas disponíveis, cada lado coloca três para baixo e revela uma. O próximo maior valor leva todo o monte acumulado."
      ],
      [
        "Quando a partida termina?",
        "Quem fica sem cartas perde. Se alguém não puder fornecer mais quatro no desempate, vale a regra de falta de cartas acima."
      ],
      [
        "Posso repetir exatamente a distribuição?",
        "Não. Reiniciar e Novo jogo embaralham de novo; a distribuição anterior não é restaurada."
      ],
      [
        "Posso continuar depois de fechar a página?",
        "A partida em andamento não é salva. Apenas registros de partidas concluídas e preferências podem ficar no navegador."
      ],
      [
        "O naipe muda o resultado?",
        "Não. Só o valor é comparado; o naipe não altera quem vence nem provoca empate."
      ]
    ],
    "tags": [
      "Comparação de valores",
      "Desempate com cartas",
      "Jogo de cartas solo"
    ],
    "relatedIntro": "Experimente estes jogos quando quiser escolher qual carta jogar.",
    "related": [
      "Jogue um valor acima ou abaixo de uma carta central antes do computador.",
      "Siga o naipe e evite cartas de penalidade em uma rodada com quatro jogadores."
    ],
    "factLabels": [
      "Baralho",
      "Ordem dos valores",
      "Cartas no desempate"
    ],
    "ui": {
      "back": "Voltar",
      "settings": "Configurações",
      "language": "Idioma",
      "start": "Começar jogo",
      "restart": "Reiniciar",
      "newGame": "Novo jogo",
      "hand": "Sua mão",
      "roundOver": "Rodada concluída",
      "close": "Fechar",
      "flip": "Virar",
      "war": "Guerra!",
      "yourTurn": "Sua vez",
      "score": "Pontuação",
      "cards": "cartas",
      "winner": "Você venceu!",
      "soundOn": "Som: ligado",
      "soundOff": "Som: desligado",
      "computer": "Computador",
      "record": "Vitórias: {wins} · Derrotas: {losses}",
      "eyebrow": "Jogo de cartas clássico",
      "guideLabel": "Guia do jogo",
      "posterAlt": "Ilustração de {title}",
      "summary": "Jogue sozinho contra o computador: compare os valores revelados, ganhe a pilha central e resolva empates com três cartas viradas para baixo por lado.",
      "loser": "O computador venceu",
      "resultStats": "Guerras: {wars} · Maior monte: {largest} cartas"
    },
    "description": "Jogue sozinho contra o computador: compare os valores revelados, ganhe a pilha central e resolva empates com três cartas viradas para baixo por lado."
  },
  "fr": {
    "summary": "Jouez seul contre l’ordinateur : comparez les cartes révélées, remportez la pile centrale et résolvez les égalités avec trois cartes face cachée de chaque côté.",
    "headings": [
      "Déroulement d’une partie",
      "Égalités et manque de cartes",
      "Observer et recommencer",
      "Informations de jeu et de sauvegarde",
      "Questions fréquentes",
      "Jeux associés"
    ],
    "rules": "Les 52 cartes sont mélangées et réparties en deux piles de 26, pour vous et l’ordinateur. Chaque retournement révèle la carte du dessus des deux piles. La valeur la plus haute gagne toute la pile centrale, mélangée avant d’être placée sous la pile du gagnant. La couleur n’intervient pas. Cette version utilise A＝1, J＝11, Q＝12 et K＝13 : l’as est donc le plus faible.",
    "ties": "À valeur égale, les cartes restent au centre. L’action de bataille pose trois cartes face cachée par joueur, puis en révèle une autre. Une nouvelle égalité répète le processus. Si vous avez moins de quatre cartes, vous perdez ; si vous en avez au moins quatre et l’ordinateur non, vous gagnez. Si les deux piles sont trop courtes, la règle actuelle donne la victoire à l’ordinateur et termine la partie.",
    "replay": "Surveillez les piles restantes et les cartes au centre : des égalités successives peuvent déplacer beaucoup de cartes d’un coup. Vous ne choisissez pas la carte et retourner plus vite ne donne aucun avantage. Recommencer et Nouvelle partie mélangent à nouveau les cartes, sans restaurer l’ordre précédent. La présentation clarifie les valeurs et les transferts, sans prétendre offrir une stratégie de sélection.",
    "save": "Si le stockage local est autorisé, le navigateur peut conserver les parties terminées, victoires, défaites et réglages sonores. Une partie en cours, ses piles et son pot central ne sont pas conservés après rechargement ou changement de page linguistique. Aucun compte, sauvegarde en ligne ou achat n’est requis. Effacer les données du site ou changer de navigateur peut supprimer ou séparer les records.",
    "faq": [
      [
        "Quelle carte est la plus forte ?",
        "L’ordre est K > Q > J > 10 > … > 2 > A. Les couleurs ne comptent pas."
      ],
      [
        "Que se passe-t-il à égalité ?",
        "Avec quatre cartes disponibles, chaque côté en pose trois face cachée et en révèle une. La prochaine valeur supérieure remporte toutes les cartes accumulées."
      ],
      [
        "Quand la partie finit-elle ?",
        "Une pile vide entraîne la défaite. Si une bataille exige quatre cartes qu’un côté ne possède pas, la règle de pile courte ci-dessus s’applique."
      ],
      [
        "Puis-je rejouer exactement la même donne ?",
        "Non. Recommencer et Nouvelle partie remélangent les cartes, sans restaurer la donne précédente."
      ],
      [
        "Puis-je reprendre après fermeture de la page ?",
        "La donne en cours n’est pas sauvegardée. Seuls les résultats des parties terminées et les préférences peuvent rester localement."
      ],
      [
        "La couleur change-t-elle le résultat ?",
        "Non. Seule la valeur compte ; la couleur ne change pas le gagnant et ne crée pas d’égalité."
      ]
    ],
    "tags": [
      "Comparaison des valeurs",
      "Bataille en cas d’égalité",
      "Jeu de cartes solo"
    ],
    "relatedIntro": "Essayez ces jeux pour choisir vous-même la carte à jouer.",
    "related": [
      "Jouez une valeur juste au-dessus ou en dessous d’une carte centrale avant l’ordinateur.",
      "Suivez la couleur et évitez les cartes de pénalité dans une manche à quatre."
    ],
    "factLabels": [
      "Jeu de cartes",
      "Ordre des valeurs",
      "Cartes de bataille"
    ],
    "ui": {
      "back": "Retour",
      "settings": "Réglages",
      "language": "Langue",
      "start": "Commencer",
      "restart": "Recommencer",
      "newGame": "Nouvelle partie",
      "hand": "Votre main",
      "roundOver": "Manche terminée",
      "close": "Fermer",
      "flip": "Retourner",
      "war": "Bataille !",
      "yourTurn": "À vous",
      "score": "Score",
      "cards": "cartes",
      "winner": "Vous gagnez !",
      "soundOn": "Son : activé",
      "soundOff": "Son : désactivé",
      "computer": "Ordinateur",
      "record": "Victoires : {wins} · Défaites : {losses}",
      "eyebrow": "Jeu de cartes classique",
      "guideLabel": "Guide du jeu",
      "posterAlt": "Illustration de {title}",
      "summary": "Jouez seul contre l’ordinateur : comparez les cartes révélées, remportez la pile centrale et résolvez les égalités avec trois cartes face cachée de chaque côté.",
      "loser": "L’ordinateur gagne",
      "resultStats": "Batailles : {wars} · Plus gros pot : {largest} cartes"
    },
    "description": "Jouez seul contre l’ordinateur : comparez les cartes révélées, remportez la pile centrale et résolvez les égalités avec trois cartes face cachée de chaque côté."
  },
  "de": {
    "summary": "Spiele allein gegen den Computer: Vergleiche die aufgedeckten Karten, gewinne den Stapel und löse Gleichstände mit je drei verdeckten Karten.",
    "headings": [
      "So läuft eine Partie",
      "Gleichstand und zu wenige Karten",
      "Beobachten und neu beginnen",
      "Spieler- und Speicherinformationen",
      "Häufige Fragen",
      "Ähnliche Spiele"
    ],
    "rules": "52 Karten werden gemischt und gleich verteilt: je 26 für dich und den Computer. Jedes Aufdecken zeigt die oberste Karte beider Stapel. Der höhere Wert gewinnt den gesamten Mittelstapel; die gewonnenen Karten werden gemischt und unten angefügt. Die Farbe spielt keine Rolle. Hier gilt A＝1, J＝11, Q＝12 und K＝13. Das Ass ist also die niedrigste Karte.",
    "ties": "Bei gleichem Wert bleiben die Karten in der Mitte. Die Gleichstandsaktion legt je drei Karten verdeckt ab und deckt je eine weitere auf. Bei erneutem Gleichstand wird dies wiederholt. Hast du weniger als vier Karten, verlierst du. Hast du mindestens vier und der Computer nicht, gewinnst du. Fehlen beiden Seiten vier Karten, gewinnt nach der aktuellen Regel der Computer; die Partie endet sofort.",
    "replay": "Achte auf beide Reststapel und die wachsende Mitte: mehrere Gleichstände können viele Karten auf einmal verschieben. Du wählst keine Karte aus und schnelleres Aufdecken bringt keinen Vorteil. Neustart und Neues Spiel mischen beide neu; sie stellen die vorige Reihenfolge nicht wieder her. Die Darstellung verdeutlicht Vergleiche und Stapelwechsel statt einer strategischen Kartenauswahl.",
    "save": "Wenn lokaler Speicher verfügbar ist, bleiben abgeschlossene Partien, Siege, Niederlagen und Toneinstellungen in diesem Browser. Laufende Kartenstapel werden nach Neuladen oder Wechsel der Sprachseite nicht fortgesetzt. Konto, Cloud-Speicher und Kauf sind nicht erforderlich. Das Löschen der Websitedaten oder ein Browserwechsel kann Aufzeichnungen entfernen oder trennen.",
    "faq": [
      [
        "Welche Karte ist höher?",
        "Die Reihenfolge ist K > Q > J > 10 > … > 2 > A. Farben zählen nicht."
      ],
      [
        "Was geschieht bei Gleichstand?",
        "Mit vier verfügbaren Karten legt jede Seite drei verdeckt und eine offen ab. Der nächste höhere Wert gewinnt alles in der Mitte."
      ],
      [
        "Wann endet die Partie?",
        "Eine Seite ohne Karten verliert. Kann bei Gleichstand eine Seite nicht vier weitere Karten liefern, greift die oben erklärte Reststapelregel."
      ],
      [
        "Kann ich dieselbe Verteilung wiederholen?",
        "Nein. Neustart und Neues Spiel mischen erneut; die vorige Verteilung wird nicht wiederhergestellt."
      ],
      [
        "Kann ich nach Schließen der Seite weiterspielen?",
        "Eine laufende Partie wird nicht gespeichert. Nur abgeschlossene Ergebnisse und Einstellungen können lokal erhalten bleiben."
      ],
      [
        "Beeinflusst die Kartenfarbe das Ergebnis?",
        "Nein. Es zählt nur der Kartenwert; die Farbe ändert weder den Gewinner noch führt sie zu Gleichstand."
      ]
    ],
    "tags": [
      "Werte vergleichen",
      "Zusatzkarten bei Gleichstand",
      "Kartenspiel für eine Person"
    ],
    "relatedIntro": "Probiere diese Kartenspiele, wenn du die ausgespielte Karte selbst wählen möchtest.",
    "related": [
      "Spiele vor dem Computer eine Karte, die einen Wert über oder unter einer Mittelkarte liegt.",
      "Bediene die Farbe und vermeide Strafkarten in einer Runde zu viert."
    ],
    "factLabels": [
      "Kartensatz",
      "Rangfolge",
      "Karten bei Gleichstand"
    ],
    "ui": {
      "back": "Zurück",
      "settings": "Einstellungen",
      "language": "Sprache",
      "start": "Spiel starten",
      "restart": "Neu starten",
      "newGame": "Neues Spiel",
      "hand": "Deine Hand",
      "roundOver": "Runde beendet",
      "close": "Schließen",
      "flip": "Aufdecken",
      "war": "KRIEG!",
      "yourTurn": "Du bist dran",
      "score": "Punktestand",
      "cards": "Karten",
      "winner": "Du gewinnst!",
      "soundOn": "Ton: an",
      "soundOff": "Ton: aus",
      "computer": "Computer",
      "record": "Siege: {wins} · Niederlagen: {losses}",
      "eyebrow": "Klassisches Kartenspiel",
      "guideLabel": "Spielanleitung",
      "posterAlt": "Spielgrafik: {title}",
      "summary": "Spiele allein gegen den Computer: Vergleiche die aufgedeckten Karten, gewinne den Stapel und löse Gleichstände mit je drei verdeckten Karten.",
      "loser": "Der Computer gewinnt",
      "resultStats": "Kriege: {wars} · Größter Stapel: {largest} Karten"
    },
    "description": "Spiele allein gegen den Computer: Vergleiche die aufgedeckten Karten, gewinne den Stapel und löse Gleichstände mit je drei verdeckten Karten."
  },
  "it": {
    "summary": "Gioca da solo contro il computer: confronta le carte scoperte, conquista il mazzo centrale e risolvi i pareggi con tre carte coperte per lato.",
    "headings": [
      "Come funziona una partita",
      "Pareggi e carte insufficienti",
      "Osservare e ricominciare",
      "Informazioni sul gioco e sui salvataggi",
      "Domande frequenti",
      "Giochi correlati"
    ],
    "rules": "Si mescolano 52 carte e se ne assegnano 26 a te e 26 al computer. Ogni rivelazione scopre la prima carta dei due mazzi. Il valore più alto vince tutto il mucchio centrale, che viene mescolato prima di finire sotto il mazzo vincente. Il seme non conta. Questa versione usa A＝1, J＝11, Q＝12 e K＝13: l’asso è quindi la carta più bassa.",
    "ties": "Valori uguali lasciano le carte al centro. L’azione di spareggio posa tre carte coperte per lato e ne scopre un’altra. Un nuovo pareggio ripete il processo. Se hai meno di quattro carte perdi; se ne hai almeno quattro e il computer no, vinci. Se entrambi ne hanno meno di quattro, la regola attuale assegna la vittoria al computer e conclude subito la partita.",
    "replay": "Osserva le carte rimaste e il mucchio centrale: più pareggi possono trasferire molte carte insieme. Non scegli quale carta esce e non ottieni vantaggi scoprendola più in fretta. Ricomincia e Nuova partita mescolano entrambi da capo, senza recuperare l’ordine precedente. La presentazione rende chiari confronti e trasferimenti, non introduce una strategia di scelta delle carte.",
    "save": "Se la memoria locale è consentita, il browser può conservare partite completate, vittorie, sconfitte e preferenze audio. I mazzi e il mucchio di una partita in corso non restano dopo un ricaricamento o un cambio di pagina linguistica. Non servono account, salvataggi cloud o acquisti. Cancellare i dati del sito o cambiare browser può eliminare o separare i registri.",
    "faq": [
      [
        "Quale carta è più alta?",
        "L’ordine è K > Q > J > 10 > … > 2 > A. I semi non contano."
      ],
      [
        "Cosa succede dopo un pareggio?",
        "Disponendo di quattro carte, ogni lato ne posa tre coperte e ne scopre una. Il successivo valore più alto prende tutto il mucchio."
      ],
      [
        "Quando finisce la partita?",
        "Chi resta senza carte perde. Se durante un pareggio qualcuno non può fornire altre quattro carte, si applica la regola spiegata sopra."
      ],
      [
        "Posso ripetere la stessa distribuzione?",
        "No. Ricomincia e Nuova partita mescolano di nuovo e non ripristinano la distribuzione precedente."
      ],
      [
        "Posso continuare dopo aver chiuso la pagina?",
        "La partita in corso non viene salvata. Possono restare solo i risultati delle partite completate e le preferenze locali."
      ],
      [
        "Il seme influisce sul risultato?",
        "No. Si confronta solo il valore: il seme non cambia il vincitore e non crea un pareggio."
      ]
    ],
    "tags": [
      "Confronto dei valori",
      "Carte aggiuntive in parità",
      "Gioco di carte in solitaria"
    ],
    "relatedIntro": "Prova questi giochi quando vuoi scegliere la carta da giocare.",
    "related": [
      "Gioca un valore sopra o sotto una carta centrale prima del computer.",
      "Segui il seme ed evita le carte di penalità in una mano a quattro."
    ],
    "factLabels": [
      "Mazzo",
      "Ordine dei valori",
      "Carte nello spareggio"
    ],
    "ui": {
      "back": "Indietro",
      "settings": "Impostazioni",
      "language": "Lingua",
      "start": "Inizia partita",
      "restart": "Ricomincia",
      "newGame": "Nuova partita",
      "hand": "La tua mano",
      "roundOver": "Mano completata",
      "close": "Chiudi",
      "flip": "Gira",
      "war": "Guerra!",
      "yourTurn": "Tocca a te",
      "score": "Punteggio",
      "cards": "carte",
      "winner": "Hai vinto!",
      "soundOn": "Audio: attivo",
      "soundOff": "Audio: disattivo",
      "computer": "Computer",
      "record": "Vittorie: {wins} · Sconfitte: {losses}",
      "eyebrow": "Gioco di carte classico",
      "guideLabel": "Guida al gioco",
      "posterAlt": "Illustrazione di {title}",
      "summary": "Gioca da solo contro il computer: confronta le carte scoperte, conquista il mazzo centrale e risolvi i pareggi con tre carte coperte per lato.",
      "loser": "Vince il computer",
      "resultStats": "Guerre: {wars} · Piatto massimo: {largest} carte"
    },
    "description": "Gioca da solo contro il computer: confronta le carte scoperte, conquista il mazzo centrale e risolvi i pareggi con tre carte coperte per lato."
  },
  "ru": {
    "summary": "Играйте в карты против компьютера: сравнивайте открытые значения, забирайте центральную стопку и разрешайте равенство тремя закрытыми картами с каждой стороны.",
    "headings": [
      "Ход партии",
      "Равенство и нехватка карт",
      "Наблюдение и новая партия",
      "Информация об игре и сохранении",
      "Частые вопросы",
      "Похожие игры"
    ],
    "rules": "52 карты перемешиваются и делятся поровну: по 26 вам и компьютеру. При открытии показывается верхняя карта каждой колоды. Старшая забирает всю центральную стопку; выигранные карты перемешиваются и добавляются вниз колоды победителя. Масть не влияет на результат. Здесь A＝1, J＝11, Q＝12 и K＝13, поэтому туз — самая младшая карта.",
    "ties": "При равенстве карты остаются в центре. Действие спора кладёт по три карты рубашкой вверх и открывает ещё по одной. Новое равенство повторяет процесс. Если у вас меньше четырёх карт, вы проигрываете; если у вас их достаточно, а у компьютера нет, вы выигрываете. Когда карт не хватает обоим, текущее правило отдаёт победу компьютеру и сразу завершает партию.",
    "replay": "Следите за остатком обеих колод и центральной стопкой: цепочка равенств может передать много карт за раз. Вы не выбираете карту, а быстрое открытие не даёт преимущества. Перезапуск и Новая игра заново перемешивают колоду, не восстанавливая прошлый порядок. Оформление показывает сравнение и движение стопок, а не стратегию выбора карт.",
    "save": "При доступном локальном хранилище браузер сохраняет число завершённых игр, побед, поражений и настройки звука. Незавершённые колоды и центральная стопка не сохраняются после перезагрузки или перехода на другую языковую страницу. Аккаунт, облачное сохранение и покупки не нужны. Очистка данных сайта или смена браузера может удалить либо разделить записи.",
    "faq": [
      [
        "Какая карта старше?",
        "Порядок: K > Q > J > 10 > … > 2 > A. Масти не учитываются."
      ],
      [
        "Что происходит при равенстве?",
        "Если есть четыре карты, каждый кладёт три закрытые и открывает одну. Следующая старшая карта забирает всё накопленное."
      ],
      [
        "Когда заканчивается партия?",
        "Сторона без карт проигрывает. При нехватке четырёх карт для спора действует описанное выше правило короткой колоды."
      ],
      [
        "Можно повторить тот же расклад?",
        "Нет. Перезапуск и Новая игра заново перемешивают карты и не возвращают прежнюю раздачу."
      ],
      [
        "Можно продолжить после закрытия страницы?",
        "Незавершённая раздача не сохраняется. В браузере могут остаться только итоговые записи и настройки."
      ],
      [
        "Влияет ли масть на результат?",
        "Нет. Сравниваются только значения; масть не меняет победителя и не вызывает равенство."
      ]
    ],
    "tags": [
      "Сравнение значений",
      "Карты при равенстве",
      "Карточная игра для одного"
    ],
    "relatedIntro": "Попробуйте эти игры, если хотите сами выбирать карту для хода.",
    "related": [
      "Раньше компьютера сыграйте карту на одно достоинство выше или ниже центральной.",
      "Следуйте масти и избегайте штрафных карт в раунде на четверых."
    ],
    "factLabels": [
      "Колода",
      "Порядок старшинства",
      "Карты для спора"
    ],
    "ui": {
      "back": "Назад",
      "settings": "Настройки",
      "language": "Язык",
      "start": "Начать игру",
      "restart": "Заново",
      "newGame": "Новая игра",
      "hand": "Ваша рука",
      "roundOver": "Раунд завершён",
      "close": "Закрыть",
      "flip": "Открыть",
      "war": "ВОЙНА!",
      "yourTurn": "Ваш ход",
      "score": "Счёт",
      "cards": "карт",
      "winner": "Вы победили!",
      "soundOn": "Звук: включён",
      "soundOff": "Звук: выключен",
      "computer": "Компьютер",
      "record": "Победы: {wins} · Поражения: {losses}",
      "eyebrow": "Классическая карточная игра",
      "guideLabel": "Руководство по игре",
      "posterAlt": "Иллюстрация игры «{title}»",
      "summary": "Играйте в карты против компьютера: сравнивайте открытые значения, забирайте центральную стопку и разрешайте равенство тремя закрытыми картами с каждой стороны.",
      "loser": "Компьютер выиграл",
      "resultStats": "Войн: {wars} · Крупнейший банк: {largest} карт"
    },
    "description": "Играйте в карты против компьютера: сравнивайте открытые значения, забирайте центральную стопку и разрешайте равенство тремя закрытыми картами с каждой стороны."
  },
  "hi": {
    "summary": "कंप्यूटर के विरुद्ध अकेले ताश खेलें: खुले पत्तों की रैंक मिलाएँ, बीच का ढेर जीतें और बराबरी पर दोनों ओर तीन उल्टे पत्ते रखकर एक और खोलें।",
    "headings": [
      "एक बाज़ी कैसे चलती है",
      "बराबरी और पत्तों की कमी",
      "बाज़ी समझना और फिर शुरू करना",
      "खिलाड़ी और सहेजने की जानकारी",
      "अक्सर पूछे गए प्रश्न",
      "संबंधित खेल"
    ],
    "rules": "52 पत्ते फेंटकर बराबर बाँटे जाते हैं: आपके और कंप्यूटर के पास 26-26। हर बार पलटने पर दोनों गड्डियों का ऊपर वाला पत्ता खुलता है। बड़ी रैंक बीच का पूरा ढेर जीतती है; जीते पत्तों को मिलाकर विजेता की गड्डी के नीचे लगाया जाता है। सूट का असर नहीं होता। यहाँ A＝1, J＝11, Q＝12 और K＝13 हैं, इसलिए इक्का सबसे छोटा है।",
    "ties": "रैंक बराबर हो तो पत्ते बीच में रहते हैं। बराबरी की कार्रवाई में दोनों ओर से तीन पत्ते उल्टे रखे जाते हैं और एक और पत्ता खोला जाता है। फिर बराबरी हो तो यही दोहराएँ। यदि आपके पास चार पत्ते नहीं हैं, आप हारते हैं; यदि आपके पास कम-से-कम चार हैं और कंप्यूटर के पास नहीं, आप जीतते हैं। दोनों के पास कम पत्ते हों तो मौजूदा नियम कंप्यूटर को विजेता बनाता है और बाज़ी तुरंत खत्म होती है।",
    "replay": "दोनों गड्डियों में बचे पत्ते और बीच का बढ़ता ढेर देखें: लगातार बराबरी से एक साथ कई पत्ते स्थान बदल सकते हैं। आप पत्ता चुन नहीं सकते और तेज़ पलटने से लाभ नहीं मिलता। फिर शुरू करें और नया खेल, दोनों दोबारा फेंटते हैं; पुराना क्रम वापस नहीं आता। यह प्रस्तुति रैंक और पत्तों के स्थानांतरण को स्पष्ट करती है, चयन की रणनीति नहीं देती।",
    "save": "स्थानीय भंडारण उपलब्ध हो तो पूरी हुई बाज़ियों की संख्या, जीत, हार और ध्वनि पसंद इसी ब्राउज़र में रह सकती हैं। पृष्ठ फिर लोड करने या भाषा पृष्ठ बदलने पर अधूरी गड्डियाँ और बीच का ढेर नहीं बचते। खाते, क्लाउड सेव या खरीदारी की ज़रूरत नहीं है। साइट डेटा मिटाने या ब्राउज़र बदलने से रिकॉर्ड हट या अलग हो सकते हैं।",
    "faq": [
      [
        "कौन-सा पत्ता बड़ा है?",
        "क्रम K > Q > J > 10 > … > 2 > A है। सूट नहीं गिना जाता।"
      ],
      [
        "बराबरी के बाद क्या होता है?",
        "चार पत्ते उपलब्ध हों तो हर पक्ष तीन उल्टे रखता है और एक खोलता है। अगली बड़ी रैंक जमा ढेर जीतती है।"
      ],
      [
        "बाज़ी कब खत्म होती है?",
        "पत्ते खत्म होने वाला पक्ष हारता है। बराबरी में चार और पत्ते न दे सकने पर ऊपर बताया कमी वाला नियम लागू होता है।"
      ],
      [
        "क्या वही बाँट फिर खेल सकते हैं?",
        "नहीं। फिर शुरू करें और नया खेल दोनों पत्ते दोबारा फेंटते हैं, पिछला बाँट वापस नहीं आता।"
      ],
      [
        "पृष्ठ बंद करके बाद में जारी रख सकते हैं?",
        "अधूरी बाज़ी नहीं सहेजी जाती। केवल पूरी बाज़ियों के रिकॉर्ड और पसंद ब्राउज़र में रह सकते हैं।"
      ],
      [
        "क्या सूट से नतीजा बदलता है?",
        "नहीं। तुलना केवल रैंक की होती है; सूट न विजेता बदलता है, न बराबरी कराता है।"
      ]
    ],
    "tags": [
      "रैंक की तुलना",
      "बराबरी पर अतिरिक्त पत्ते",
      "एक खिलाड़ी का ताश खेल"
    ],
    "relatedIntro": "अपना पत्ता खुद चुनना चाहते हों तो ये ताश के खेल आज़माएँ।",
    "related": [
      "कंप्यूटर से पहले बीच के पत्ते से एक रैंक ऊपर या नीचे का पत्ता चलें।",
      "चार खिलाड़ियों की बाज़ी में सूट का पालन करें और दंड वाले पत्तों से बचें।"
    ],
    "factLabels": [
      "गड्डी",
      "रैंक का क्रम",
      "बराबरी में पत्ते"
    ],
    "ui": {
      "back": "वापस",
      "settings": "सेटिंग्स",
      "language": "भाषा",
      "start": "खेल शुरू करें",
      "restart": "फिर शुरू करें",
      "newGame": "नया खेल",
      "hand": "आपके पत्ते",
      "roundOver": "राउंड पूरा",
      "close": "बंद करें",
      "flip": "पलटें",
      "war": "युद्ध!",
      "yourTurn": "आपकी चाल",
      "score": "स्कोर",
      "cards": "पत्ते",
      "winner": "आप जीत गए!",
      "soundOn": "ध्वनि: चालू",
      "soundOff": "ध्वनि: बंद",
      "computer": "कंप्यूटर",
      "record": "जीत: {wins} · हार: {losses}",
      "eyebrow": "क्लासिक ताश का खेल",
      "guideLabel": "खेल मार्गदर्शिका",
      "posterAlt": "{title} की खेल छवि",
      "summary": "कंप्यूटर के विरुद्ध अकेले ताश खेलें: खुले पत्तों की रैंक मिलाएँ, बीच का ढेर जीतें और बराबरी पर दोनों ओर तीन उल्टे पत्ते रखकर एक और खोलें।",
      "loser": "कंप्यूटर जीता",
      "resultStats": "युद्ध: {wars} · सबसे बड़ा ढेर: {largest} पत्ते"
    },
    "description": "कंप्यूटर के विरुद्ध अकेले ताश खेलें: खुले पत्तों की रैंक मिलाएँ, बीच का ढेर जीतें और बराबरी पर दोनों ओर तीन उल्टे पत्ते रखकर एक और खोलें।"
  },
  "ar": {
    "summary": "العب جولة فردية ضد الكمبيوتر: قارن القيم المكشوفة، واجمع الكومة الوسطى، واحسم التعادل بوضع ثلاث بطاقات مقلوبة من كل جانب ثم كشف بطاقة أخرى.",
    "headings": [
      "كيف تجري الجولة",
      "التعادل ونقص البطاقات",
      "قراءة الجولة والبدء مجددًا",
      "معلومات اللاعب والحفظ",
      "الأسئلة الشائعة",
      "ألعاب ذات صلة"
    ],
    "rules": "تُخلط 52 بطاقة وتُقسم بالتساوي: 26 لك و26 للكمبيوتر. يكشف كل قلب البطاقة العليا من كل كومة. تأخذ القيمة الأعلى جميع بطاقات الوسط، وتُخلط البطاقات المكتسبة قبل إضافتها أسفل كومة الفائز. لا تؤثر علامة البطاقة في النتيجة. تستخدم هذه النسخة A＝1 وJ＝11 وQ＝12 وK＝13، لذا فالآس هو الأصغر.",
    "ties": "تبقى البطاقات في الوسط عند تساوي القيم. يضع إجراء التعادل ثلاث بطاقات مقلوبة من كل جانب ثم يكشف بطاقة أخرى. يتكرر ذلك إذا استمر التعادل. إذا لم تكن لديك أربع بطاقات تخسر؛ وإذا كانت لديك أربع على الأقل ولا يملكها الكمبيوتر تفوز. وعند نقص البطاقات لدى الطرفين، تمنح القاعدة الحالية الفوز للكمبيوتر وتنهي الجولة فورًا.",
    "replay": "راقب البطاقات المتبقية والكومة المتزايدة في الوسط؛ فقد تنقل سلسلة تعادلات بطاقات كثيرة دفعة واحدة. لا تختار البطاقة، ولا يمنحك القلب الأسرع أفضلية. إعادة البدء ولعبة جديدة تخلطان توزيعًا جديدًا ولا تستعيدان الترتيب السابق. يوضح التصميم مقارنة القيم وانتقال البطاقات بدل تقديم اختيار البطاقات بوصفه استراتيجية.",
    "save": "عند توفر التخزين المحلي، يمكن لهذا المتصفح حفظ عدد الألعاب المكتملة والانتصارات والهزائم وتفضيلات الصوت. لا تُحفظ الأكوام غير المكتملة أو كومة الوسط بعد إعادة التحميل أو الانتقال إلى صفحة لغة أخرى. لا تحتاج إلى حساب أو حفظ سحابي أو شراء. قد يؤدي مسح بيانات الموقع أو تغيير المتصفح إلى حذف السجلات أو فصلها.",
    "faq": [
      [
        "ما ترتيب قوة البطاقات؟",
        "الترتيب هو K > Q > J > 10 > … > 2 > A. لا تُحسب علامات البطاقات."
      ],
      [
        "ماذا يحدث بعد التعادل؟",
        "عند توفر أربع بطاقات، يضع كل جانب ثلاثًا مقلوبة ويكشف واحدة. تأخذ القيمة الأعلى التالية جميع البطاقات المتراكمة."
      ],
      [
        "متى تنتهي الجولة؟",
        "يخسر الطرف الذي تنفد بطاقاته. ويُطبق حكم نقص البطاقات أعلاه إذا تعذر على أحد الطرفين توفير أربع بطاقات أخرى للتعادل."
      ],
      [
        "هل يمكن إعادة التوزيع نفسه؟",
        "لا. إعادة البدء ولعبة جديدة تعيدان الخلط ولا تستعيدان التوزيع السابق."
      ],
      [
        "هل يمكن المتابعة بعد إغلاق الصفحة؟",
        "لا يُحفظ توزيع غير مكتمل. يمكن أن تبقى فقط نتائج الألعاب المكتملة والتفضيلات محليًا."
      ],
      [
        "هل يؤثر رمز البطاقة في النتيجة؟",
        "لا. تُقارن القيمة فقط؛ ولا يغيّر الرمز الفائز أو يسبب التعادل."
      ]
    ],
    "tags": [
      "مقارنة القيم",
      "بطاقات عند التعادل",
      "لعبة بطاقات فردية"
    ],
    "relatedIntro": "جرّب هذه الألعاب عندما تريد اختيار البطاقة التي تلعبها.",
    "related": [
      "العب قيمة أعلى أو أقل بدرجة واحدة من بطاقة وسطى قبل الكمبيوتر.",
      "اتبع العلامة وتجنب بطاقات العقوبة في جولة لأربعة لاعبين."
    ],
    "factLabels": [
      "الرزمة",
      "ترتيب القيم",
      "بطاقات التعادل"
    ],
    "ui": {
      "back": "رجوع",
      "settings": "الإعدادات",
      "language": "اللغة",
      "start": "بدء اللعبة",
      "restart": "إعادة البدء",
      "newGame": "لعبة جديدة",
      "hand": "يدك",
      "roundOver": "انتهت الجولة",
      "close": "إغلاق",
      "flip": "اقلب",
      "war": "حرب!",
      "yourTurn": "دورك",
      "score": "النتيجة",
      "cards": "بطاقات",
      "winner": "لقد فزت!",
      "soundOn": "الصوت: مفعّل",
      "soundOff": "الصوت: متوقف",
      "computer": "الكمبيوتر",
      "record": "الانتصارات: {wins} · الهزائم: {losses}",
      "eyebrow": "لعبة بطاقات كلاسيكية",
      "guideLabel": "دليل اللعبة",
      "posterAlt": "صورة لعبة {title}",
      "summary": "العب جولة فردية ضد الكمبيوتر: قارن القيم المكشوفة، واجمع الكومة الوسطى، واحسم التعادل بوضع ثلاث بطاقات مقلوبة من كل جانب ثم كشف بطاقة أخرى.",
      "loser": "فاز الكمبيوتر",
      "resultStats": "الحروب: {wars} · أكبر كومة: {largest} بطاقة"
    },
    "description": "العب جولة فردية ضد الكمبيوتر: قارن القيم المكشوفة، واجمع الكومة الوسطى، واحسم التعادل بوضع ثلاث بطاقات مقلوبة من كل جانب ثم كشف بطاقة أخرى."
  }
};
  const locales = Object.freeze({en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'});
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = code => Object.keys(locales).find(key=>key.toLowerCase()===String(code).toLowerCase() || locales[key]===String(code).toLowerCase()) || 'en';
  const active = () => normalize(root.document?.documentElement.lang || root.WonderI18n?.actualLocale?.() || 'en');
  const get = (key, values={}, code=active()) => {
    let value = copies[normalize(code)].ui[key];
    if (typeof value !== 'string') return undefined;
    for (const [name,replacement] of Object.entries(values)) value=value.replaceAll(`{${name}}`,String(replacement));
    return value;
  };
  function official(id,code,titles=root.WEIGHTPLAY_GAME_TITLES) {
    const name=titles?.[id]?.[code];
    if (!name) throw new Error(`Missing approved War Guide title: ${id}/${code}`);
    return name;
  }
  function renderGuide(code,titles=root.WEIGHTPLAY_GAME_TITLES) {
    const c=copies[code];
    if (!c) throw new Error(`Missing War Guide: ${code}`);
    const section=(heading,body)=>`<div class="game-info-section"><h3>${escape(heading)}</h3>${body}</div>`;
    const p=text=>`<p>${escape(text)}</p>`;
    const facts=['52 (26 + 26)','K > Q > J > 10 > … > 2 > A','3 + 1'];
    const related=['speed','hearts'].map((id,i)=>`<a class="game-info-related-card" data-wp-related-id="${id}" href="/${locales[code]}/games/${id}/"><img src="/assets/card-games-${id}-cover.webp" alt="" width="320" height="320" loading="lazy" decoding="async"><span class="game-info-related-copy"><strong>${escape(official(id,code,titles))}</strong><span>${escape(c.related[i])}</span></span></a>`).join('');
    return `<section class="game-page-info game-page-info-static" data-wp-game-guide data-war-guide="1.4.0" data-wp-guide-depth="true" data-runtime-localize="off" lang="${code}" dir="${code==='ar'?'rtl':'ltr'}" aria-label="${escape(c.ui.guideLabel)}"><div class="game-info-hero"><div class="game-info-title"><span class="game-info-kicker">${escape(c.ui.guideLabel)}</span><h2 data-wp-game-title data-runtime-localize="off">${escape(official('war',code,titles))}</h2>${p(c.summary)}<div class="game-info-tags" data-wp-gameplay-tags="1.4.0">${c.tags.map(tag=>`<span>${escape(tag)}</span>`).join('')}</div></div><div class="game-info-facts">${facts.map((value,i)=>`<div class="game-info-fact"><span>${escape(c.factLabels[i])}</span><strong><bdi dir="ltr">${escape(value)}</bdi></strong></div>`).join('')}</div></div><div class="game-info-sections">${section(c.headings[0],p(c.rules))}${section(c.headings[1],p(c.ties))}${section(c.headings[2],p(c.replay))}${section(c.headings[3],p(c.save))}${section(c.headings[4],`<dl>${c.faq.map(([q,a])=>`<div><dt>${escape(q)}</dt><dd>${escape(a)}</dd></div>`).join('')}</dl>`)}${section(c.headings[5],p(c.relatedIntro)+`<div class="game-info-related">${related}</div>`)}</div></section>`;
  }
  function replaceGuide(html,code,titles=root.WEIGHTPLAY_GAME_TITLES) {
    const start=/<section\b[^>]*\bclass=["'][^"']*\bgame-page-info\b[^"']*["'][^>]*>/i.exec(html);
    if (!start) throw new Error('War native Guide is missing');
    const tokens=/<\/?section\b[^>]*>/gi; tokens.lastIndex=start.index;
    let depth=0, token;
    while ((token=tokens.exec(html))) {
      depth+=/^<\//.test(token[0])?-1:1;
      if(!depth) return html.slice(0,start.index)+renderGuide(code,titles)+html.slice(tokens.lastIndex);
    }
    throw new Error('War native Guide is unclosed');
  }
  function localizeEntry(html,code,titles=root.WEIGHTPLAY_GAME_TITLES) {
    if(!copies[code]) throw new Error(`Unsupported War locale: ${code}`);
    const ui=copies[code].ui;
    html=replaceGuide(html,code,titles);
    const metaValue=escape(copies[code].description);
    for(const [attribute,name] of [['name','description'],['property','og:description'],['name','twitter:description']]) {
      const pattern=new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=[\"']${name}[\"'])[^>]*>`,'gi');
      let seen=false;
      html=html.replace(pattern,tag=>{
        if(seen)return '';
        seen=true;
        return /\bcontent=[\"'][^\"']*[\"']/i.test(tag)
          ?tag.replace(/(\bcontent=[\"'])[^\"']*([\"'])/i,`$1${metaValue}$2`)
          :tag.replace(/\s*\/?>(?=$)/,` content=\"${metaValue}\">`);
      });
    }
    html=html.replace(/(<script\b(?=[^>]*\btype=[\"']application\/ld\+json[\"'])[^>]*>)([\s\S]*?)(<\/script>)/i,(whole,open,body,close)=>{
      let schema;
      try{schema=JSON.parse(body);}catch{throw new Error(`Invalid War VideoGame schema for ${code}`);}
      let found=false;
      const visit=value=>{
        if(!value||typeof value!=='object')return;
        if(value['@type']==='VideoGame'){value.description=copies[code].description;value.genre=copies[code].tags;found=true;}
        Object.values(value).forEach(visit);
      };
      visit(schema);
      if(!found)throw new Error(`Missing War VideoGame schema for ${code}`);
      return open+JSON.stringify(schema)+close;
    });
    function textNode(pattern,key,initialOnly=false) {
      let matched=0;
      html=html.replace(pattern,(_,open,prior,close)=>{
        matched++;
        open=open.replace(/\sdata-runtime-localize=["'][^"']*["']/gi,'').replace(/\sdata-war-text=["'][^"']*["']/gi,'').replace(/\sdata-war-initial-only(?:=["'][^"']*["'])?/gi,'');
        open=open.replace(/>$/,` data-war-text="${key}"${initialOnly?' data-war-initial-only':''} data-runtime-localize="off">`);
        return open+escape(ui[key])+close;
      });
      if(matched!==1) throw new Error(`War initial text node ${key}: ${matched}`);
    }
    for(const [id,key] of Object.entries({startBtn:'start',restartBtn:'restart',newGameBtn:'newGame',soundBtn:'soundOn',resultNewGame:'newGame',resultRestart:'restart',resultClose:'close',cardGamePhase:'flip',resultTitle:'roundOver'})) {
      textNode(new RegExp(`(<(?:button|small|h2)\\b[^>]*\\bid=["']${id}["'][^>]*>)([\\s\\S]*?)(<\\/(?:button|small|h2)>)`,'i'),key,['cardGamePhase','resultTitle'].includes(id));
    }
    textNode(/(<strong\b[^>]*class=["']settings-title["'][^>]*>)([\s\S]*?)(<\/strong>)/i,'settings');
    textNode(/(<label\b[^>]*class=["']settings-row["'][^>]*>\s*<span\b[^>]*>)([\s\S]*?)(<\/span>)/i,'language');
    textNode(/(<small\b[^>]*class=["']eyebrow["'][^>]*>)([\s\S]*?)(<\/small>)/i,'eyebrow');
    textNode(/(<p\b[^>]*\bdata-card-summary\b[^>]*>)([\s\S]*?)(<\/p>)/i,'summary');
    textNode(/(<div\b[^>]*class=["']card-game-player-header["'][^>]*>\s*<strong\b[^>]*>)([\s\S]*?)(<\/strong>)/i,'hand');
    const attr=(tag,name,value)=>tag.replace(new RegExp(`\\s${name}=["'][^"']*["']`,'gi'),'').replace(/\s*\/?>(?=$)/,` ${name}="${escape(value)}">`);
    html=html.replace(/<(?:a|button|select)\b[^>]*>/gi,tag=>{
      if(/id=["']audioMenuBtn["']/.test(tag)) return attr(tag,'aria-label',ui.settings);
      if(/id=["']localeSelect["']/.test(tag)) return attr(tag,'aria-label',ui.language);
      if(/id=["']battleBackBtn["']|class=["']main-return["']/.test(tag)) return attr(tag,'aria-label',ui.back);
      return tag;
    });
    html=html.replace(/<img\b[^>]*class=["']cover["'][^>]*>/i,tag=>attr(tag,'alt',ui.posterAlt.replace('{title}',official('war',code,titles))));
    html=html.replace(/<div\b[^>]*id=["']resultOverlay["'][^>]*>/i,tag=>attr(tag,'aria-labelledby','resultTitle'));
    html=html.replace(/<body\b[^>]*>/i,tag=>attr(tag,'data-runtime-localize','off'));
    html=html.replace(/<html\b[^>]*>/i,tag=>attr(tag,'dir',code==='ar'?'rtl':'ltr'));
    html=html.replace(/card-games-next\.js\?v=[^"']+/gi,'card-games-next.js?v=20261009-war-cache-normalization-v2');
    if(!/src=["']\/games\/war\/text-content\.js/.test(html)) {
      const tag='<script src="/games/war/text-content.js?v=20261009-war-cache-normalization-v2"></script>';
      const anchor=/<script\b[^>]*src=["'][^"']*card-games-next\.js[^"']*["'][^>]*>/i;
      if(!anchor.test(html)) throw new Error('War engine script is missing');
      html=html.replace(anchor,tag+'$&');
    }
    html=html.replace(/text-content\.js\?v=[^"']+/gi,'text-content.js?v=20261009-war-cache-normalization-v2');
    html=html.replace(/<[a-z][^>]*>/gi,tag=>{
      const count=(tag.match(/\sdata-runtime-localize=["']off["']/gi)||[]).length;
      return count>1?tag.replace(/\sdata-runtime-localize=["']off["']/gi,'').replace(/>$/,' data-runtime-localize="off">'):tag;
    });
    return html;
  }
  function syncSound() {
    if(!root.document) return;
    const muted=root.WeightPlayAudio?.isMuted?.()===true;
    const node=root.document.getElementById('soundBtn');
    if(node){node.textContent=get(muted?'soundOff':'soundOn');node.setAttribute('aria-pressed',String(!muted));}
    const utility=root.document.querySelector('[data-wp-battle-utility]');
    if(utility){utility.setAttribute('aria-label',get(muted?'soundOff':'soundOn'));utility.title=get(muted?'soundOff':'soundOn');}
  }
  function sync() {
    const doc=root.document;
    if(!doc || doc.body?.dataset.wpGameId!=='war') return;
    const code=active();
    doc.documentElement.dir=code==='ar'?'rtl':'ltr';
    doc.querySelectorAll('[data-war-text]:not([data-war-initial-only])').forEach(node=>{
      const value=get(node.dataset.warText,{},code);
      if(value!==undefined&&node.textContent!==value) node.textContent=value;
    });
    for(const [selector,key] of [['#audioMenuBtn','settings'],['#localeSelect','language'],['.main-return','back'],['#battleBackBtn','back']]) {
      doc.querySelector(selector)?.setAttribute('aria-label',get(key,{},code));
    }
    const guide=doc.querySelector('[data-war-guide]');
    if(guide&&guide.lang!==code) {
      const template=doc.createElement('template');template.innerHTML=renderGuide(code);
      guide.replaceWith(template.content.firstElementChild);
    }
    const poster=doc.querySelector('img.cover');
    if(poster) poster.alt=get('posterAlt',{title:official('war',code)},code);
    syncSound();
  }
root.WeightPlayWarText=Object.freeze({copies,locales,get,renderGuide,replaceGuide,localizeEntry,sync,syncSound});
})(typeof window==='undefined'?globalThis:window);
