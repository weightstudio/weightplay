# Klondike Solitaire QA Checklist

## 1) 基本頁面與 SEO
- [x] `index.html` 的 `<title>` 已設定為 `Klondike Solitaire Online - Play Free Classic Solitaire`。
- [x] `description` 已包含：`Play the classic Klondike Solitaire online for free. Enjoy smooth gameplay on mobile and desktop with no download required.`。
- [x] `keywords` 至少包含：`Solitaire,Klondike,Classic Solitaire,Free Solitaire,Play Solitaire Online,Card Game,Patience`。
- [x] 主畫面可進入遊戲：`New Game`、`Start Game`、`Restart Current Game` 已存在。

## 2) 規則與牌局結構
- [x] 1 盒 52 張牌（標準 A~K、4 花色）已使用。
- [x] 開局會建立 7 個 Tableau。
- [x] 4 個 Foundation 欄位已存在。
- [x] Stock/Waste 互動（翻牌、回收）已可用。
- [x] 勝利條件為四個 Foundation 全部到 K。

## 3) 互動行為
- [x] 拖曳可拖動單張與可連動多張。
- [x] 點擊時若只有唯一合法目的地可直接移動（tableau 與 waste 皆已採同一套一鍵移牌路徑）。
- [x] `Hint` 僅高亮建議，不直接執行。
- [x] 無可用建議時提示 `No moves available.`。
- [x] 盤面會提示可繼續抽牌/回收 Waste。
- [x] `Auto Finish` 目前僅在非策略性移動（非 tableau→tableau / waste→tableau）後運作，並有逐步動畫速度。
- [x] `Undo` 不限次，使用歷史快照回復牌組位置、翻面、Stock、Waste、Foundation。

## 4) 洗牌與難度
- [x] `New Game` 可產生新局。
- [x] `Restart Current Game` 可回到初始快照。
- [x] Draw 1 / Draw 3 可切換；依模式抽牌。

## 5) 動畫與音效
- [x] 每張發牌都有動畫（`DEAL_STEP_MS` 約 42ms）。
- [x] 發牌有翻牌動畫。
- [x] 放牌/拖曳/勝利具動畫。
- [x] 有音效控制：發牌、放牌、翻牌、勝利、可關閉。

## 6) UI/卡牌設計
- [x] 現代化視覺語彙（陰影、圓角、漸層、字體）。
- [x] 支援手機、平板、桌機排版。
- [x] 觸控卡片、按鈕尺寸與間距有 mobile-first 調整。
- [x] 統計欄位可顯示勝場、敗場、勝率、最快時間、最少步數。

## 7) 效能（待實機驗證）
- [ ] 長時間連續操作 10 分鐘無明顯掉幀。
- [ ] 拖曳過程持續穩定 60 FPS。
- [ ] 每幀不重建全部牌面（已減少到每次移動 render 一次，但需實機驗證）。

## 8) 邊界與錯誤防護
- [x] 無效移動會被拒絕。
- [x] 勝利判定為 4 欄 Foundation 到 K。
- [x] 無法移動且無抽牌/回收來源時，提示 `No moves available.`。

---

## 補充驗證任務
- [ ] 低階裝置實機/模擬器：手機直立、手機橫向、平板、桌機互動穩定性
- [ ] 觸控單手可達性與卡牌尺寸實測（避免過小）
