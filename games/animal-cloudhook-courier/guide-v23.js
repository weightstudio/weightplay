/* Native Chinese guide is supplied before the shared Guide renderer. */
(() => {
  const copy={title:'雲鉤快遞',age:'9 歲以上',difficulty:'入門到進階',time:'每次飛行約 5–30 秒',gameplay:'繫繩擺盪與包裹配送',genre:['動作','擺盪','動物冒險'],skills:['時機','反應','路線規劃'],guideKicker:'WeightPlay 原創遊戲指南',guideTitleSuffix:'遊戲指南',noteTitle:'玩家與存檔資訊',hideScoreBands:true,hideSkillsFact:true,
    intro:'化身戴著護目鏡的方塊快遞員，抓住金色光環，在雲海航線中向上擺盪。每次放手都是一段新飛行；收齊包裹，再把它們送進發亮的燈籠站。',
    story:['雲海配送站有三十條航線，分成初升航線、逆風航線、移動光環、包裹順序、燈籠天氣與完全掌握六個篇章。你從安穩的出發點起飛，逐步學會在風勢和移動目標之間接力。'],
    systems:['按住繫繩或空白鍵會抓住目前航線的光環並開始擺盪。蓄力完成時，光環與按鈕會亮起，虛線顯示放手後的預計路線。放手飛出，再次按住可在範圍內接上下一個光環。','左右方向鍵或畫面兩側按鈕可微調飛行。遇到移動光環時先看位置；遇到陣風時用短按修正。紫色晶石是風暴障礙，碰撞或飛出航線就會結束本次嘗試。','每份包裹都必須實際碰到才能收集。有編號的包裹必須依序收取；每五關的檢查點要求至少完成一次蓄力擺盪。收齊包裹後抵達燈籠即可送達。'],
    how:['在關卡頁左右拖曳卡片，選擇已開放的關卡並閱讀航線目標。','進入飛行後角色會等待。按住繫繩，看到「蓄力完成」再放手。','飛行途中再次按住，接住下一個光環；需要時用左右按鈕微調。','收齊包裹並飛向燈籠。結算頁可返回關卡、前往下一關或重試。'],
    strategyTips:['不要急著連點；按住、蓄力、放手、再抓住，才是完整節奏。','虛線是放手時的起始軌跡；陣風仍會影響飛行，用短按微調即可。','先看清紫色晶石和下一份包裹。失敗後只調整一個放手時機，比同時大幅改變方向更容易找到穩定路線。'],
    progression:['三十關保留六個篇章的進度。通過新關卡會開放下一關，最佳時間保留在目前瀏覽器。通過五個不同關卡，可免費裝備晴空線軸。','金色線軸免費使用；極光線軸是可選的永久外觀，價格為十二顆共用鑽石，購買前會再次確認。三種線軸只改變繩索顏色，飛行能力完全相同。'],
    designNote:'手機使用完整直向空域，橫向畫面會轉換航線視角，角色和道具維持原本比例。觸控、滑鼠與鍵盤使用相同的飛行規則；設定、教學和離開確認都會暫停飛行。',
    parent:'這款一般遊戲不需要帳號，也沒有聊天功能。關卡進度、最佳時間與線軸外觀保存在目前瀏覽器，清除網站資料可能會移除存檔。基本線軸可完成全部關卡，選購外觀不影響能力。',
    faq:[['什麼時候放手？','看到蓄力完成提示與發亮光環時放手，再按住接上下一個光環。'],['為什麼沒有送達？','必須收齊所有包裹，依序關卡也要遵守編號。檢查點還需要完成一次蓄力擺盪。'],['進度會儲存嗎？','正常送達會儲存解鎖與最佳時間。失敗不會移除既有進度；本機練習不會寫入進度或獎勵。'],['裝備會變強嗎？','不會。線軸只改變繩索顏色，所有關卡都能使用免費的基本裝備完成。']],text140Tags:{gameplay:'繫繩擺盪與包裹配送',genre:['動作','擺盪','動物冒險']}};
  copy.systems[1]=copy.systems[1].replace('左右方向鍵或畫面兩側按鈕','方向鍵或畫面上的方向按鈕');
  copy.how[2]=copy.how[2].replace('左右按鈕','方向按鈕');
  // Supplement characters absent from the shared converter, within this game.
  window.WPCloudhookSimplify=value=>(window.WonderI18n?.simplifyChineseText?.(value)||value).replace(/[遞繫盪著]/g,c=>({'遞':'递','繫':'系','盪':'荡','著':'着'})[c]);
  const simplify=value=>Array.isArray(value)?value.map(simplify):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,simplify(v)])):typeof value==='string'?window.WPCloudhookSimplify(value):value;
  window.WeightPlayGeneralReviewedGuides ||= {};
  for(const code of ['zh-Hant','zh-Hans']){window.WeightPlayGeneralReviewedGuides[code]||={games:{}};window.WeightPlayGeneralReviewedGuides[code].games||={};window.WeightPlayGeneralReviewedGuides[code].games['animal-cloudhook-courier']=code==='zh-Hans'?simplify(copy):copy;}
  const en={title:'Cloudhook Courier',time:'About 5–30 seconds per flight',gameplay:'Grapple, Swing and Deliver',genre:['Action','Swinging','Animal Adventure'],hideScoreBands:true,
    intro:'Become a block-built cloud courier. Catch gold rings, build your swing and release into the next flight. Collect every parcel, then reach the glowing delivery lantern.',
    systems:['Hold the rope or Space to catch the next ring in range. The ring and button light up when your swing is charged; the dotted arc previews your release. Release, then hold again to catch the next ring. Arrows make small course corrections.','Gusts, moving rings, ordered parcels and drifting lanterns enter across six arcs. Touch every parcel and reach the lantern. Storm crystals and falls end the attempt. Checkpoints also require a charged swing.'],
    how:['Choose an unlocked card on the shared Stage rail.','Hold to take off, wait for the ready cue, then release. Hold again while approaching the next ring.','Collect all parcels in the marked order when numbers appear, avoid storm crystals and reach the lantern.','Use Stages, Next or Retry on the result. Settings, Help and leave confirmation pause the flight.'],
    progression:['Thirty routes retain existing unlocks and best times. Five distinct cleared stages unlock a cyan rope spool.','The basic golden spool is free. The optional permanent Aurora spool costs 12 shared diamonds and requires purchase confirmation. All three spools have identical flight abilities.'],
    parent:'Progress, best times and equipment are stored in this browser. Clearing site data can remove them. The optional diamond purchase changes rope colour only; the free spool can finish every route.',
    faq:[['When should I release?','Release when the ring lights up, then hold again to catch the next ring.'],['Why did delivery fail?','Collect every parcel and complete a charged swing at checkpoints before reaching the lantern.'],['Does progress save?','Normal successful deliveries save locally. Local practice never saves campaign progress or rewards.'],['Does equipment improve flight?','No. The three spools change rope colour only.']]};
  window.WeightPlayGeneralReviewedGuides.en ||= {games:{}};
  window.WeightPlayGeneralReviewedGuides.en.games ||= {};
  window.WeightPlayGeneralReviewedGuides.en.games['animal-cloudhook-courier']=en;
  const purchaseNotes={
    ja:'進行状況、ベストタイム、装備はこのブラウザに保存されます。基本の糸巻きは無料で、全30ステージをクリアできます。オーロラの糸巻きは共通ダイヤ12個で永久に解放され、ロープの色だけが変わります。購入前に確認画面が表示されます。',
    ko:'진행 상황, 최고 기록, 장비는 이 브라우저에 저장됩니다. 무료 기본 실패로 30개 스테이지를 모두 완료할 수 있습니다. 오로라 실패는 공용 다이아몬드 12개로 영구 해제되며 밧줄 색상만 바꿉니다. 구매 전에 확인 창이 표시됩니다.',
    es:'El progreso, los mejores tiempos y el equipo se guardan en este navegador. El carrete básico gratuito permite completar las 30 etapas. El carrete Aurora cuesta 12 diamantes compartidos, se conserva y solo cambia el color de la cuerda. La compra requiere confirmación.',
    'pt-BR':'O progresso, os melhores tempos e o equipamento ficam neste navegador. O carretel básico gratuito permite concluir as 30 fases. O carretel Aurora custa 12 diamantes compartilhados, é permanente e só muda a cor da corda. A compra exige confirmação.',
    fr:'La progression, les meilleurs temps et l’équipement sont enregistrés dans ce navigateur. La bobine gratuite permet de terminer les 30 étapes. La bobine Aurore coûte 12 diamants partagés, reste acquise et change uniquement la couleur de la corde. Un écran confirme l’achat.',
    de:'Fortschritt, Bestzeiten und Ausrüstung werden in diesem Browser gespeichert. Mit der kostenlosen Grundspule lassen sich alle 30 Level abschließen. Die Aurora-Spule kostet 12 gemeinsame Diamanten, bleibt dauerhaft freigeschaltet und ändert nur die Seilfarbe. Der Kauf muss bestätigt werden.',
    it:'Progressi, tempi migliori ed equipaggiamento sono salvati in questo browser. Il rocchetto gratuito permette di completare tutte le 30 tappe. Il rocchetto Aurora costa 12 diamanti condivisi, resta sbloccato e cambia solo il colore della corda. L’acquisto richiede conferma.',
    ru:'Прогресс, лучшие результаты и снаряжение сохраняются в этом браузере. Бесплатной катушки достаточно для всех 30 уровней. Катушка «Аврора» навсегда открывается за 12 общих алмазов и меняет только цвет верёвки. Перед покупкой требуется подтверждение.',
    hi:'प्रगति, सर्वोत्तम समय और उपकरण इसी ब्राउज़र में सहेजे जाते हैं। मुफ्त मूल रील से सभी 30 चरण पूरे किए जा सकते हैं। ऑरोरा रील 12 साझा हीरों से स्थायी रूप से खुलती है और केवल रस्सी का रंग बदलती है। खरीदने से पहले पुष्टि मांगी जाती है।',
    ar:'يُحفظ التقدم وأفضل الأزمنة والمعدات في هذا المتصفح. تكفي البكرة المجانية لإكمال المراحل الثلاثين. تُفتح بكرة الشفق بشكل دائم مقابل 12 ماسة مشتركة، ولا تغيّر إلا لون الحبل. يتطلب الشراء تأكيدًا.'
  };
  for(const [locale,parent] of Object.entries(purchaseNotes)){
    const pack=window.WeightPlayGeneralReviewedGuides[locale] ||= {games:{}};pack.games ||= {};
    pack.games['animal-cloudhook-courier']={...pack.games['animal-cloudhook-courier'],parent};
  }
})();
