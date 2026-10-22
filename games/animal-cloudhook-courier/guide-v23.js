/* Native Chinese guide is supplied before the shared Guide renderer. */
(() => {
  const copy={title:'雲鉤快遞',age:'9 歲以上',difficulty:'入門到進階',time:'每次飛行約 10–30 秒',gameplay:'繫繩擺盪與包裹配送',genre:['動作','擺盪','動物冒險'],skills:['時機','反應','路線規劃'],guideKicker:'WeightPlay 原創遊戲指南',guideTitleSuffix:'遊戲指南',noteTitle:'玩家與存檔資訊',hideScoreBands:true,hideSkillsFact:true,
    intro:'化身戴著護目鏡的方塊快遞員，抓住金色光環，在雲海航線中向上擺盪。每次放手都是一段新飛行；收齊包裹，再把它們送進發亮的燈籠站。',
    story:['雲海配送站有三十條航線，分成初升航線、逆風航線、移動光環、包裹順序、燈籠天氣與完全掌握六個篇章。你從安穩的出發點起飛，逐步學會在風勢和移動目標之間接力。'],
    systems:['按住繫繩或空白鍵會抓住目前航線的光環並開始擺盪。蓄力完成時，光環與按鈕會亮起，虛線顯示放手後的預計路線。放手飛出，再次按住可在範圍內接上下一個光環。','左右方向鍵或畫面兩側按鈕可微調飛行。遇到移動光環時先看位置；遇到陣風時用短按修正。紫色晶石是風暴障礙，碰撞或飛出航線就會結束本次嘗試。','每份包裹都必須實際碰到才能收集。有編號的包裹必須依序收取；每五關的檢查點要求至少完成一次蓄力擺盪。收齊包裹後抵達燈籠即可送達。'],
    how:['在關卡頁左右拖曳卡片，選擇已開放的關卡並閱讀航線目標。','進入飛行後角色會等待。按住繫繩，看到「蓄力完成」再放手。','飛行途中再次按住，接住下一個光環；需要時用左右按鈕微調。','收齊包裹並飛向燈籠。結算頁可返回關卡、前往下一關或重試。'],
    strategyTips:['不要急著連點；按住、蓄力、放手、再抓住，才是完整節奏。','虛線是放手時的起始軌跡；陣風仍會影響飛行，用短按微調即可。','先看清紫色晶石和下一份包裹。失敗後只調整一個放手時機，比同時大幅改變方向更容易找到穩定路線。'],
    progression:['三十關保留六個篇章的進度。通過新關卡會開放下一關，最佳時間保留在目前瀏覽器。通過五個不同關卡，可免費裝備晴空線軸。','金色線軸免費使用；極光線軸是可選的永久外觀，價格為十二顆共用鑽石，購買前會再次確認。三種線軸只改變繩索顏色，飛行能力完全相同。'],
    designNote:'手機使用完整直向空域，橫向畫面會轉換航線視角，角色和道具維持原本比例。觸控、滑鼠與鍵盤使用相同的飛行規則；設定、教學和離開確認都會暫停飛行。',
    parent:'這款一般遊戲不需要帳號，也沒有聊天功能。關卡進度、最佳時間與線軸外觀保存在目前瀏覽器，清除網站資料可能會移除存檔。基本線軸可完成全部關卡，選購外觀不影響能力。',
    faq:[['什麼時候放手？','看到蓄力完成提示與發亮光環時放手，再按住接上下一個光環。'],['為什麼沒有送達？','必須收齊所有包裹，依序關卡也要遵守編號。檢查點還需要完成一次蓄力擺盪。'],['進度會儲存嗎？','正常送達會儲存解鎖與最佳時間。失敗不會移除既有進度；本機練習不會寫入進度或獎勵。'],['裝備會變強嗎？','不會。線軸只改變繩索顏色，所有關卡都能使用免費的基本裝備完成。']],text140Tags:{gameplay:'繫繩擺盪與包裹配送',genre:['動作','擺盪','動物冒險']}};
  const simplify=value=>Array.isArray(value)?value.map(simplify):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,simplify(v)])):typeof value==='string'?(window.WonderI18n?.simplifyChineseText?.(value)||value):value;
  window.WeightPlayGeneralReviewedGuides ||= {};
  for(const code of ['zh-Hant','zh-Hans']){window.WeightPlayGeneralReviewedGuides[code]||={games:{}};window.WeightPlayGeneralReviewedGuides[code].games||={};window.WeightPlayGeneralReviewedGuides[code].games['animal-cloudhook-courier']=code==='zh-Hans'?simplify(copy):copy;}
})();
