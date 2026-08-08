# Klondike 參考研究與落地建議（2026-08-05）

> 目標：不複製素材與程式碼下，將參考作品的可玩優勢轉為可驗證規格。

## 1) 研究結論（優先順序）

### 參考站：Microsoft Solitaire Collection（首要）
- 手感優勢：完整桌機/行動一致、可預測回饋、清楚的牌局導向。
- 視覺優勢：克制的漸層、卡牌堆疊層次、節奏適中的移動。
- 借鏡策略：
  - 保持「主要可點擊與主要可拖曳」元素在視覺與動作上最容易識別。
  - 以短促但有存在感的動畫保留手感連續性。
  - 不以遮罩與提示覆蓋牌局。

### 參考站：World of Solitaire
- 手感優勢：規則語意清楚，初學者上手快。
- 視覺優勢：牌面可讀性優先、色彩與卡框層次分明。
- 借鏡策略：
  - 維持經典 7 欄 + 4 手牌欄位配置。
  - 控制文字、提示與操作鈕的訊息層級，避免干擾。

### 參考站：Solitaire Bliss
- 手感優勢：入口簡潔，資訊密度低，減少操作決策負擔。
- 借鏡策略：
  - 將進階動作（Hint/Auto）集中在少量控件。
  - 保留核心牌局內容優先於修飾。

### 參考站：Solitaired
- 手感優勢：Draw 1/3 + Undo + Hint 流程清楚。
- 借鏡策略：
  - Auto Finish 僅在策略空間降到僅基礎收尾時啟用。
  - 允許多設備下穩定拖曳並給出明確錯誤回饋。

### 參考站：Google Solitaire
- 手感優勢：手機介面行動化很直接，牌面與控件可觸性高。
- 借鏡策略：
  - 手機版使用更大可點區與更短操作路徑。
  - 主畫面資訊不壓過核心牌局。

## 1.1 參考作品對照（實作映射）

- 一鍵移牌策略：只有唯一目標時直接執行，避免多步推測（已落地）。
- Drag / Tap 同路徑：減少觸控與滑鼠行為差異（已落地）。
- 發牌節奏：每張 40~60ms，並保留可見翻牌動畫（已落地，約 42ms）。
- Auto Finish：只在無策略移動空間後啟動，且逐步動畫收斂（已落地）。
- 手機可及性：縮放卡距/牌寬，保證手指可操作性（已落地，仍需持續實機驗證）。
- 視覺目標：卡牌有厚度、圓角、柔和陰影與高對比字體（已落地）。

## 2) 逐項需求對照（已落地 / 持續驗證）

| 需求 | 落地狀態 | 驗證要點 |
| --- | --- | --- |
| UI 配置（Stock/Waste/Foundation/Tableau） | 已落地 | `index.html` 分層使用 `battle-header`、`stock-row`、`tableau-row` |
| 卡牌大小 | 已落地 | `style.css` 使用 `clamp` 控制、桌機/行動版分支 |
| 動畫速度（每 40~60ms） | 已落地 | 發牌節點間隔 `DEAL_STEP_MS = 42` |
| 發牌動畫 + 翻牌 | 已落地 | 發牌 `card-deal`，翻牌 `card-flip` |
| 拖曳/點擊（單張與多張） | 已落地 | 可拖曳 group；唯一目標時單點直接移牌 |
| Hint | 已落地 | 高亮目的地，不直接代替玩家操作 |
| Auto Finish | 已落地 | 僅 strategy-free 路徑時逐步完成 |
| 勝利動畫 | 已落地 | Foundation 卡片級聯 `kl-victory` |
| Undo | 已落地 | `snapshot`/`restore` 全量還原（位子、翻面、Stock/Waste/Foundation） |
| Draw 1 / Draw 3 | 已落地 | `DRAW_MODES=[1,3]`、`drawModeBtn` 切換 |
| New Game / Restart | 已落地 | 新局與重啟初始牌局快照回復 |
| 音效（發牌/放牌/翻牌/勝利） | 已落地 | SoundEngine beep 分類 + 可關閉 |
| 手機/平板/桌機支援 | 已落地（待實機） | 版面斷點 + 間距縮放 |
| 統計資料 | 已落地 | 勝/敗/勝率/最快時間/最少步數持久化 |

## 3) 實作參數映射（本作設定）

- 發牌節奏：`DEAL_STEP_MS = 42`
- 自動完成節奏：`AUTO_FINISH_STEP_MS = 56`
- 每幀更新：`time` 更新間隔 500ms（時間顯示），非動畫主幀。
- 拖曳/點擊判斷：`CLICK_MOVED_THRESHOLD = 8`
- 動畫關鍵：`card-deal`、`card-flip`、`kl-victory`

## 4) 近期建議與下一步驗證（必須完成）

1. 行動版 10 分鐘連續操作，驗證：
   - 長按/輕點區分是否自然。
   - 目標指向與 drop 命中率。
   - 拖曳途中是否有明顯掉幀。
2. 低階機實測 60 FPS 長局與記憶體抖動：
   - 不要每幀重建整個牌面。
   - 確認僅有位移與必要節點重繪。
3. 統計/Hint/Auto Finish 邏輯巡檢：
   - 無可行動時 `No moves available.` 顯示一致。
   - Auto Finish 不會吞掉還可選擇的策略性移動。
 4. 視覺調整：
    - 若手機太小，微調 `--card-width` 與 `--card-step` 以維持可讀性。
    - 保持動畫自然，不要加重誇張縮放。

## 4.1 參考作品可落地拆解（避免照搬）

- Microsoft Solitaire Collection
  - 核心借鏡：  
    - 桌機/行動一致的欄位辨識（左側牌庫/回收、右側 waste、上方 4 個 foundation、中央 7 欄）。  
    - 目標可達時的即時可預期回饋，不做過度遮罩。  
    - 移動節奏偏快但不急促（在 100~160ms 可辨識）。  
  - 本作對應：  
    - `game.js` 保持 Stock/Waste/Foundation/Tableau 的固定流程。  
    - `click` 唯一目標自動移動 + `audio.reject`（錯誤回饋）。  
    - `card` transition 與 `card-flip/card-deal` 提供一致節奏。

- World of Solitaire
  - 核心借鏡：  
    - 初學者可讀性優先，先懂規則後玩速。  
    - 提示不打斷主牌局。  
  - 本作對應：  
    - `hint` 僅亮起推薦目的地，不直接代替操作。  
    - `hintOverlay` 短時間顯示且不擋牌面長時間。

- Solitaire Bliss
  - 核心借鏡：  
    - 控件收斂，主視野保留在牌局。  
    - 新局入口簡潔。  
  - 本作對應：  
    - 主畫面只保留 New Game / Restart / Start Game。  
    - 戰鬥中僅保留 Undo / Hint / Auto Finish。

- Solitaired
  - 核心借鏡：  
    - Draw 1/3 與 Undo/Hint 行為一致。  
    - 版面提示清楚，玩家可預測後續結果。  
  - 本作對應：  
    - `DRAW_MODES=[1,3]`、`drawModeBtn` 切換。  
    - `onHint()` 一步步驟只建議，不自動執行。

- Google Solitaire
  - 核心借鏡：  
    - 行動版單手路徑短、控件可點範圍大。  
    - 響應式縮放不犧牲可讀性。  
  - 本作對應：  
    - `@media (max-width: 740px)` / `@media (max-width: 390px)`。  
    - 可點控件最小高度 44~46px，卡牌寬高隨視窗 clamp。

## 5) 參考作品具體參數對照

- Microsoft Solitaire Collection（參考方向）  
  - 目標回饋時間：約 100~160ms 一次可識別移動。  
  - 手機與桌機按鈕層級分離：核心目標（Stock/Waste、牌槽）先於統計與設定。  
  - 對應實作：`click` 唯一目的地自動移牌 + `pointer` 拖曳偏移改為卡牌寬度比例計算。

- World of Solitaire（參考方向）  
  - 重點在單手可辨識牌面與目標提示。  
  - 對應實作：`hintOverlay` + `hint-source/hint-target` 視覺、`no moves` 提示文案一致化。  

- Solitaire Bliss（參考方向）  
  - 主介面精簡、控制項不壓過牌局。  
  - 對應實作：主畫面保留 `New Game / Restart / Start Game`、遊戲內操作集中於 `Undo / Hint / Auto Finish`。  

- Solitaired（參考方向）  
  - Draw 1/3、Undo、Hint 流程清楚。  
  - 對應實作：`DRAW_MODES`、`hint` 高亮、不直接執行。  

- Google Solitaire（參考方向）  
  - 行動版以短路徑為主，單手可回饋。  
  - 對應實作：`@media (max-width: 740px)` 與 `@media (max-width: 390px)` 雙層尺寸策略。  
