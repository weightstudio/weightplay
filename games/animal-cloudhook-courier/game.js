(function(){
  "use strict";

  const COPY = window.WPCloudhookLocales.locales;
  const LOCALE_ORDER = window.WPCloudhookLocales.order;
  const GAME_ID = "animal-cloudhook-courier";
  const GAME_VERSION = "v15";
  const INTERFACE_VERSION = 6;
  const LEAVE_COPY = {
    en: { title: "Keep this flight?", body: "Continue keeps the current flight. Returning to Stages ends this attempt.", continue: "Continue flight", leave: "Stages" },
    "zh-Hant": { title: "要保留這次飛行嗎？", body: "繼續會保留目前飛行；返回關卡會結束這次嘗試。", continue: "繼續飛行", leave: "返回關卡" },
    "zh-Hans": { title: "要保留这次飞行吗？", body: "继续会保留当前飞行；返回关卡会结束这次尝试。", continue: "继续飞行", leave: "返回关卡" },
    ja: { title: "このフライトを続けますか？", body: "続けると現在のフライトを保ちます。ステージへ戻ると今回の挑戦を終了します。", continue: "フライトを続ける", leave: "ステージへ" },
    ko: { title: "이 비행을 유지할까요?", body: "계속하면 현재 비행을 유지합니다. 스테이지로 돌아가면 이번 도전을 끝냅니다.", continue: "비행 계속하기", leave: "스테이지로" },
    es: { title: "¿Mantener este vuelo?", body: "Continuar conserva el vuelo actual. Volver a fases termina este intento.", continue: "Continuar vuelo", leave: "Fases" },
    "pt-BR": { title: "Manter este voo?", body: "Continuar mantém o voo atual. Voltar às fases encerra esta tentativa.", continue: "Continuar voo", leave: "Fases" },
    fr: { title: "Garder ce vol ?", body: "Continuer conserve le vol actuel. Retourner aux étapes termine cet essai.", continue: "Continuer le vol", leave: "Étapes" },
    de: { title: "Diesen Flug behalten?", body: "Weiter hält den aktuellen Flug. Zurück zu den Stufen beendet diesen Versuch.", continue: "Flug fortsetzen", leave: "Stufen" },
    it: { title: "Mantenere questo volo?", body: "Continuare conserva il volo attuale. Tornare alle fasi termina questo tentativo.", continue: "Continua il volo", leave: "Fasi" },
    ru: { title: "Сохранить этот полёт?", body: "Продолжение сохраняет текущий полёт. Возврат к этапам завершит попытку.", continue: "Продолжить полёт", leave: "Этапы" },
    hi: { title: "इस उड़ान को रखें?", body: "जारी रखने पर वर्तमान उड़ान बनी रहेगी। चरणों पर लौटने से यह प्रयास समाप्त होगा।", continue: "उड़ान जारी रखें", leave: "चरण" },
    ar: { title: "هل تحتفظ بهذه الرحلة؟", body: "المتابعة تُبقي الرحلة الحالية. العودة إلى المراحل تنهي هذه المحاولة.", continue: "متابعة الرحلة", leave: "المراحل" },
  };
  const $ = (selector) => document.querySelector(selector);
  const canvas = $("#gameCanvas");
  const battleScreen = $("#battleScreen");
  const resultScreen = $("#resultScreen");
  if (resultScreen.parentElement !== battleScreen) battleScreen.append(resultScreen);
  resultScreen.setAttribute("role", "dialog");
  resultScreen.setAttribute("aria-modal", "true");
  resultScreen.setAttribute("aria-labelledby", "resultTitle");
  resultScreen.setAttribute("aria-describedby", "resultCopy");
  const leaveOverlay = document.createElement("section");
  leaveOverlay.id = "leaveOverlay";
  leaveOverlay.className = "leave-overlay";
  leaveOverlay.setAttribute("role", "dialog");
  leaveOverlay.setAttribute("aria-modal", "true");
  leaveOverlay.setAttribute("aria-labelledby", "leaveTitle");
  leaveOverlay.setAttribute("aria-describedby", "leaveCopy");
  leaveOverlay.hidden = true;
  leaveOverlay.innerHTML = '<div class="leave-card"><p class="eyebrow" id="leaveEyebrow"></p><h2 id="leaveTitle"></h2><p class="leave-copy" id="leaveCopy"></p><div class="leave-actions"><button id="continueBattle" class="primary" type="button"></button><button id="leaveBattle" class="secondary" type="button"></button></div></div>';
  battleScreen.append(leaveOverlay);
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const battleBackground = new Image();
  battleBackground.decoding = "async";
  battleBackground.src = "battle-bg-v2.webp";
  const courierSprites = new Image();
  courierSprites.decoding = "async";
  courierSprites.src = "courier-sprites-v2.webp";
  const cloudhookProps = new Image();
  cloudhookProps.decoding = "async";
  cloudhookProps.src = "cloudhook-props-v2.webp";
  const authoredStages = [
    { arc: 0, wind: 0, anchors: [[210,300],[370,230],[530,330],[690,210]], parcels: [[300,410],[600,360]], spikes: [] },
    { arc: 0, wind: 8, anchors: [[205,290],[360,190],[500,315],[665,180],[790,300]], parcels: [[300,150],[575,190],[735,130]], spikes: [] },
    { arc: 0, wind: -12, anchors: [[210,300],[360,170],[510,300],[650,150],[805,260]], parcels: [[300,125],[560,110],[745,175]], spikes: [[390,425,72,22]] },
    { arc: 0, wind: 16, anchors: [[210,300],[350,210],[490,130],[630,285],[770,150],[850,285]], parcels: [[300,155],[540,90],[740,100]], spikes: [[300,430,72,22],[600,430,86,22]] },
    { arc: 0, wind: -18, anchors: [[210,280],[355,165],[500,300],[640,140],[775,275],[865,180]], parcels: [[285,125],[545,105],[720,155],[835,110]], spikes: [[440,430,90,22],[700,430,70,22]], swingGate: true },
    { arc: 1, wind: 12, gust: 16, anchors: [[210,300],[355,185],[510,315],[665,175],[805,290]], parcels: [[280,130],[520,180],[735,115]], spikes: [[430,430,70,22]] },
    { arc: 1, wind: -14, gust: 22, gustRate: 1.6, anchors: [[205,280],[345,160],[500,300],[650,175],[800,260]], parcels: [[280,105],[540,115],[745,155]], spikes: [[350,430,62,22],[650,430,80,22]] },
    { arc: 1, wind: 18, gust: 20, anchors: [[210,315],[350,210],[490,125],[635,270],[780,140],[860,275]], parcels: [[290,110],[520,75],[745,115],[830,185]], spikes: [[280,430,72,22],[585,430,86,22]] },
    { arc: 1, wind: -20, gust: 28, gustRate: 1.35, lantern: [850,240], anchors: [[205,295],[340,150],[480,300],[620,145],[760,275],[865,165]], parcels: [[270,130],[500,105],[705,95],[815,170]], spikes: [[400,430,78,22],[690,430,84,22]] },
    { arc: 1, wind: 22, gust: 32, gustRate: 1.25, lantern: [840,270], anchors: [[205,295],[340,160],[475,305],[610,130],[745,280],[865,175]], parcels: [[260,110],[490,90],[680,125],[805,105]], spikes: [[270,430,76,22],[510,430,80,22],[755,430,78,22]], swingGate: true },
    { arc: 2, wind: 6, anchors: [[210,300],[350,180,1],[500,315],[650,160,1],[805,270]], parcels: [[285,125],[540,105],[745,145]], spikes: [[430,430,70,22]] },
    { arc: 2, wind: -10, anchors: [[205,285],[340,160,1],[480,305,1],[620,145],[760,280,1],[860,175]], parcels: [[270,120],[505,90],[730,130]], spikes: [[345,430,62,22],[680,430,82,22]] },
    { arc: 2, wind: 14, anchors: [[210,310],[340,185,1],[470,125],[600,295,1],[730,155,1],[860,275]], parcels: [[280,105],[490,78],[700,100],[820,150]], spikes: [[285,430,70,22],[535,430,85,22]] },
    { arc: 2, wind: -16, gust: 10, anchors: [[205,290],[335,150,1],[465,300],[595,135,1],[725,275,1],[860,165]], parcels: [[270,115],[480,105],[680,85],[815,135]], spikes: [[390,430,72,22],[690,430,82,22]] },
    { arc: 2, wind: 20, gust: 16, anchors: [[205,300],[330,150,1],[455,305,1],[580,125],[705,285,1],[825,145,1],[870,260]], parcels: [[260,105],[470,80],[660,115],[805,95]], spikes: [[250,430,72,22],[500,430,76,22],[735,430,82,22]], swingGate: true },
    { arc: 3, wind: 4, anchors: [[210,300],[360,185],[510,315],[660,170],[810,285]], parcels: [[290,125],[540,105],[750,145]], spikes: [[435,430,70,22]], parcelSequence: true },
    { arc: 3, wind: -10, anchors: [[205,285],[350,155],[495,305],[640,140],[785,275],[865,175]], parcels: [[285,110],[515,180],[735,95],[825,165]], spikes: [[350,430,64,22],[675,430,84,22]], parcelSequence: true },
    { arc: 3, wind: 14, gust: 13, anchors: [[210,310],[345,175],[480,120],[615,295],[750,145],[865,270]], parcels: [[270,105],[475,85],[680,125],[815,95]], spikes: [[285,430,74,22],[525,430,76,22]], parcelSequence: true },
    { arc: 3, wind: -18, gust: 18, anchors: [[205,295],[340,145],[475,300],[610,130],[745,275],[860,160]], parcels: [[265,115],[480,95],[675,150],[815,105]], spikes: [[365,430,86,22],[660,430,88,22]], parcelSequence: true },
    { arc: 3, wind: 21, gust: 22, anchors: [[205,300],[335,150],[465,305],[595,125],[725,280],[850,145],[875,260]], parcels: [[255,100],[465,80],[650,115],[800,95],[850,185]], spikes: [[245,430,72,22],[480,430,80,22],[710,430,84,22]], parcelSequence: true, swingGate: true },
    { arc: 4, wind: 8, lantern: [850,250], lanternDrift: [14,24], anchors: [[210,300],[360,180],[510,315],[660,170],[810,280]], parcels: [[290,125],[535,105],[750,145]], spikes: [[435,430,70,22]] },
    { arc: 4, wind: -12, gust: 14, lantern: [835,275], lanternDrift: [18,36], anchors: [[205,285],[345,155,1],[490,305],[635,140,1],[780,275],[865,175]], parcels: [[275,110],[505,80],[730,135],[820,185]], spikes: [[340,430,66,22],[680,430,82,22]] },
    { arc: 4, wind: 16, gust: 25, gustRate: 1.45, lantern: [850,235], lanternDrift: [25,42], anchors: [[210,310],[345,175,1],[480,120],[615,295,1],[750,145,1],[865,270]], parcels: [[270,105],[480,85],[690,115],[820,95]], spikes: [[285,430,74,22],[535,430,80,22]], parcelSequence: true },
    { arc: 4, wind: -20, gust: 30, gustRate: 1.3, lantern: [830,285], lanternDrift: [28,50], anchors: [[205,295],[340,145,1],[475,300],[610,130,1],[745,275,1],[860,160]], parcels: [[265,115],[475,95],[675,150],[815,105]], spikes: [[365,430,86,22],[660,430,88,22]], parcelSequence: true },
    { arc: 4, wind: 23, gust: 34, gustRate: 1.2, lantern: [845,250], lanternDrift: [32,58], anchors: [[205,300],[335,150,1],[465,305,1],[595,125],[725,280,1],[850,145,1],[875,260]], parcels: [[255,100],[465,80],[650,115],[800,95],[850,185]], spikes: [[245,430,72,22],[480,430,80,22],[710,430,84,22]], parcelSequence: true, swingGate: true },
    { arc: 5, wind: 10, gust: 18, lantern: [845,250], lanternDrift: [18,30], anchors: [[210,300],[350,175],[490,315,1],[630,150],[770,280,1],[865,170]], parcels: [[275,110],[500,85],[730,130],[820,190]], spikes: [[335,430,70,22],[650,430,84,22]], parcelSequence: true },
    { arc: 5, wind: -16, gust: 24, lantern: [835,275], lanternDrift: [24,44], anchors: [[205,285],[340,150,1],[475,305],[610,130,1],[745,275,1],[865,160]], parcels: [[260,105],[475,90],[675,140],[815,105]], spikes: [[350,430,82,22],[665,430,88,22]], parcelSequence: true },
    { arc: 5, wind: 20, gust: 30, gustRate: 1.3, lantern: [850,235], lanternDrift: [28,52], anchors: [[205,300],[330,145,1],[455,305,1],[580,120],[705,285,1],[830,145,1],[875,260]], parcels: [[250,95],[450,75],[640,110],[790,90],[845,175]], spikes: [[240,430,72,22],[470,430,80,22],[700,430,86,22]], parcelSequence: true, swingGate: true },
    { arc: 5, wind: -24, gust: 36, gustRate: 1.2, lantern: [830,285], lanternDrift: [32,60], anchors: [[205,295],[330,140,1],[455,300],[580,120,1],[705,280,1],[830,140,1],[875,255]], parcels: [[250,105],[450,80],[635,120],[785,95],[845,180]], spikes: [[235,430,74,22],[465,430,82,22],[700,430,88,22]], parcelSequence: true, swingGate: true },
    { arc: 5, wind: 26, gust: 40, gustRate: 1.15, lantern: [845,250], lanternDrift: [35,68], anchors: [[205,300],[325,145,1],[445,305,1],[565,115],[685,285,1],[805,140,1],[875,255]], parcels: [[245,95],[445,75],[625,110],[775,85],[845,175]], spikes: [[225,430,76,22],[450,430,84,22],[680,430,90,22],[810,430,50,22]], parcelSequence: true, swingGate: true },
  ];
  const stageConfigs = authoredStages.map((stage) => ({
    ...stage,
    anchors: stage.anchors.map(([x, y, move = 0]) => ({ x, y, move })),
    parcels: stage.parcels.map(([x, y]) => ({ x, y })),
    spikes: stage.spikes.map(([x, y, w, h]) => ({ x, y, w, h })),
    wind: Number(stage.wind) || 0,
    gust: Number(stage.gust) || 0,
    gustRate: Number(stage.gustRate) || 1.7,
    lantern: stage.lantern ? { x: stage.lantern[0], y: stage.lantern[1] } : { x: 875, y: 255 },
    lanternDrift: stage.lanternDrift ? { x: stage.lanternDrift[0], y: stage.lanternDrift[1] } : { x: 0, y: 0 },
  }));
  const STAGE_META_EN = [
    ["First Lift","Lantern Lesson","Collect both parcels and aim for the lantern.","Hold one ring, build a swing, then release toward the next ring.","The first delivery teaches a clean tether line."],
    ["First Lift","Low Cloud Turn","Carry the upper parcel before the low turn.","Wind is mild; carry the upper parcel, then settle into the next ring.","A guided parcel line teaches the upper route."],
    ["First Lift","Starboard Gap","Use the middle ring to cross the wide gap.","The safe line sits above the lower cloud.","A wider route rewards patience."],
    ["First Lift","Split Current","Choose a high or low ring before the spike pair.","Keep momentum while changing altitude.","The route now asks for a lane choice."],
    ["First Lift","First Checkpoint","Collect all parcels, then prove a full swing before delivery.","Checkpoint: tether for a complete swing before the lantern.","First checkpoint mastered: control is now part of delivery."],
    ["Crosswind","Westward Gust","Counter the crosswind before the first release.","Gusts change the line while you fly.","Crosswind begins the weather arc."],
    ["Crosswind","Two-Wave Air","Time two releases between alternating gusts.","Do not chase the lantern; read the rings.","Rhythm beats raw speed."],
    ["Crosswind","High Parcel","Climb for the high parcel, then cut back.","The high parcel is safer than the floor spikes.","Vertical planning pays off."],
    ["Crosswind","Lantern Drift","Gather the wide parcel spread while the lantern shifts.","The destination drifts; keep your approach flexible.","A moving goal changes the final decision."],
    ["Crosswind","Weather Checkpoint","Tether through a gust cycle and deliver on the moving lantern.","Checkpoint: wait for a stable gust before release.","You can read the sky, not just the rings."],
    ["Moving Rings","First Motion","Catch the first moving ring after its sweep.","Moving rings reward a shorter hold.","The rings have their own rhythm."],
    ["Moving Rings","Pendulum Pair","Switch between two moving rings.","Watch the anchor before committing.","Motion is now a route choice."],
    ["Moving Rings","Sliding Shelf","Collect parcels across the moving shelf.","Keep a reserve line for the last ring.","Save momentum for the exit."],
    ["Moving Rings","Ring Relay","Chain moving anchors without touching the spikes.","Release when the next ring crosses your flight line.","A clean relay keeps the courier airborne."],
    ["Moving Rings","Motion Checkpoint","Complete a swing before the final moving-ring approach.","Checkpoint: one mastered swing opens the safe finish.","Movement mastery turns chaos into timing."],
    ["Parcel Order","Marked Parcel","Collect the parcels in the marked order.","The next parcel will not count early; plan your line.","The route now has a delivery manifest."],
    ["Parcel Order","Forked Manifest","Follow the upper-then-lower parcel order.","Do not grab the tempting parcel first.","Order changes the best route."],
    ["Parcel Order","Three-Step Sort","Sort three parcels while wind pushes sideways.","Keep the manifest sequence visible in your plan.","Precision protects the score."],
    ["Parcel Order","Late Stamp","Reach the late parcel after the spike gate.","Save one release for the final stamp.","The last parcel changes your exit."],
    ["Parcel Order","Manifest Checkpoint","Complete the full manifest, then swing before delivery.","Checkpoint: order and swing both matter.","The manifest is ready for a real courier."],
    ["Lantern Weather","Tide Lantern","Approach a lantern that drifts with the tide.","Aim for the lantern's current position, not its starting point.","The destination itself is alive."],
    ["Lantern Weather","Narrow Glow","Thread moving rings toward a narrow moving lantern.","Use the upper lane when the glow climbs.","Route and destination now interact."],
    ["Lantern Weather","Storm Pocket","Cross gust pulses and collect every parcel.","Storm pulses punish early release.","Patience creates a safe window."],
    ["Lantern Weather","Long Approach","Carry a long line of parcels to the far lantern.","Keep height through the final approach.","Endurance is another form of control."],
    ["Lantern Weather","Weather Checkpoint","Read the lantern drift, then prove a complete swing.","Checkpoint: release only when the lantern returns to your lane.","The courier can now forecast the finish."],
    ["Mastery","Full Toolkit","Combine gusts, moving rings, and ordered parcels.","Every mechanic from earlier arcs is active.","Mastery begins with a complete plan."],
    ["Mastery","Reserve Current","Keep one safe release in reserve for the final parcel.","The shortest line is not always the fastest line.","Good couriers protect their options."],
    ["Mastery","Storm Relay","Chain moving anchors through a storm pulse.","Watch both the ring rhythm and the wind rhythm.","Two rhythms become one route."],
    ["Mastery","Final Manifest","Complete the ordered manifest and approach the drifting lantern.","Use a mastered swing to set the final angle.","The final run is earned, not given."],
    ["Mastery","Cloudhook Finale","Deliver every parcel after one complete swing through the full course.","Final checkpoint: all systems are live.","Cloudhook Courier is complete; replay for mastery."],
  ];
  const STAGE_META_ZH = [
    ["初升航線","燈籠課","收集兩個包裹並瞄準燈籠。","抓住一個光環、累積擺盪，再朝下一個光環放手。","第一趟送達會教你乾淨的繫繩路線。"],
    ["初升航線","低雲轉彎","先帶走高處包裹，再通過低雲轉彎。","風勢溫和；先帶走高處包裹，再穩住下一個光環。","引導式包裹路線會教你掌握高線。"],
    ["初升航線","右舷缺口","利用中間光環越過寬闊缺口。","安全路線在低雲之上。","更寬的路線獎勵耐心。"],
    ["初升航線","分流","在尖刺群前選擇高線或低線。","改變高度時保持速度。","路線現在要求你選擇航道。"],
    ["初升航線","第一個檢查點","收集所有包裹，再完成一次完整擺盪後送達。","檢查點：在燈籠前按住繫繩完成擺盪。","第一個檢查點完成：控制也成了送達的一部分。"],
    ["逆風航線","西向陣風","在第一次放手前抵銷側風。","飛行中陣風會改變路線。","逆風開始了天氣篇章。"],
    ["逆風航線","雙波氣流","在交替陣風間掌握兩次放手。","別追著燈籠跑；先讀光環。","節奏勝過蠻力。"],
    ["逆風航線","高處包裹","爬升收集高處包裹，再切回航線。","高處包裹比地面尖刺安全。","垂直規劃能帶來回報。"],
    ["逆風航線","漂移燈籠","在燈籠移動時收集分散的包裹。","目的地會漂移；接近時保持彈性。","移動目標改變了最後決定。"],
    ["逆風航線","天氣檢查點","穿過陣風週期，抵達移動中的燈籠。","檢查點：等穩定的陣風再放手。","你開始讀天空，而不只是光環。"],
    ["移動光環","初次移動","等第一個移動光環掃過後抓住它。","移動光環適合短暫按住。","光環也有自己的節奏。"],
    ["移動光環","雙擺盪","在兩個移動光環之間切換。","確認光環位置再投入。","移動本身成了路線選擇。"],
    ["移動光環","滑動平台","穿過移動平台收集包裹。","為最後一個光環保留路線。","把速度留給出口。"],
    ["移動光環","光環接力","串起移動光環並避開尖刺。","下一個光環切入飛行線時放手。","乾淨接力能讓快遞員留在空中。"],
    ["移動光環","移動檢查點","在最後的移動光環前完成一次擺盪。","檢查點：完成一次擺盪才能安全收尾。","掌握移動，就能把混亂變成時機。"],
    ["包裹順序","標記包裹","依照標記順序收集包裹。","提早碰到下一個包裹不會計算；先規劃路線。","路線現在有一份配送清單。"],
    ["包裹順序","分岔清單","依序處理高處、再處理低處包裹。","不要先拿眼前最誘人的包裹。","順序改變最佳路線。"],
    ["包裹順序","三步分類","在側風中整理三個包裹。","把清單順序放在計畫裡。","精準能保護分數。"],
    ["包裹順序","最後印章","通過尖刺門後抵達最後包裹。","為最後印章保留一次放手。","最後一個包裹改變了出口。"],
    ["包裹順序","清單檢查點","完成整份清單，再擺盪後送達。","檢查點：順序與擺盪都重要。","清單已準備好交給真正的快遞員。"],
    ["燈籠天氣","潮汐燈籠","接近隨潮汐漂移的燈籠。","瞄準燈籠目前的位置，不是起點。","目的地本身也活了起來。"],
    ["燈籠天氣","窄光","穿過移動光環，前往狹窄的移動燈籠。","燈光升高時使用上層航線。","路線與目的地開始互相影響。"],
    ["燈籠天氣","風暴口袋","穿過陣風脈衝並收集所有包裹。","風暴脈衝會懲罰太早放手。","耐心會創造安全窗口。"],
    ["燈籠天氣","長距離接近","帶著長串包裹前往遠方燈籠。","最後接近時保持高度。","耐力也是一種控制。"],
    ["燈籠天氣","天氣檢查點","讀懂燈籠漂移，再完成一次完整擺盪。","檢查點：燈籠回到航線時才放手。","快遞員現在能預判終點。"],
    ["完全掌握","全套工具","結合陣風、移動光環與有序包裹。","先前篇章的所有機制都啟用。","掌握從完整計畫開始。"],
    ["完全掌握","保留氣流","為最後包裹保留一次安全放手。","最短路線不一定最快。","好的快遞員會保留選項。"],
    ["完全掌握","風暴接力","在風暴脈衝中串起移動光環。","同時觀察光環節奏與風節奏。","兩種節奏合成一條路線。"],
    ["完全掌握","最後清單","完成有序清單並接近漂移燈籠。","用完成的擺盪設定最後角度。","最後一趟是贏來的，不是送的。"],
    ["完全掌握","雲鉤終章","完成一次完整擺盪後送達所有包裹。","最終檢查點：所有系統都已啟用。","雲鉤快遞完成；再次挑戰掌握速度。"],
  ];
  let locale = "en";
  let soundEnabled = true;
  if (!window.WonderSound) {
    let muted = false;
    window.WonderSound = {
      isMuted: () => muted,
      setMuted: (next) => { muted = Boolean(next); soundEnabled = !muted; refreshShell(); window.dispatchEvent(new CustomEvent("wonder:audio-volume-change")); },
    };
  }
  let currentStage = 0;
  let state = null;
  let frame = 0;
  let lastTime = 0;
  let inputAxis = 0;
  let hidden = false;
  let resultOpen = false;
  let leaveOpen = false;
  let lastInputType = "system";

  const text = (key) => (COPY[locale] && COPY[locale][key]) || COPY.en[key] || key;
  const parcelObjectiveCopy = { en: "Parcels {collected}/{total} · Reach the lantern", "zh-Hant": "包裹 {collected}/{total} · 抵達燈籠", "zh-Hans": "包裹 {collected}/{total} · 抵达灯笼", ja: "荷物 {collected}/{total} · ランタンへ", ko: "소포 {collected}/{total} · 랜턴에 도착", es: "Paquetes {collected}/{total} · Llega al farol", "pt-BR": "Pacotes {collected}/{total} · Chegue à lanterna", fr: "Colis {collected}/{total} · Atteignez la lanterne", de: "Pakete {collected}/{total} · Erreiche die Laterne", it: "Pacchi {collected}/{total} · Raggiungi la lanterna", ru: "Посылки {collected}/{total} · Долетите до фонаря", hi: "पैकेट {collected}/{total} · लालटेन तक पहुँचें", ar: "الطرود {collected}/{total} · أصل إلى الفانوس" };
  const parcelObjectiveText = () => (parcelObjectiveCopy[locale] || parcelObjectiveCopy.en).replace("{collected}", String(state?.parcels || 0)).replace("{total}", String(config().parcels.length));
  const stageKey = (index) => `weightplay_cloudhook_stage_${index}`;
  const bestKey = (index) => `weightplay_cloudhook_best_${index}`;
  const safeGet = (key, fallback = "") => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, String(value)); } catch {} };
  const unlocked = () => Math.min(stageConfigs.length, Math.max(1, Number(safeGet(stageKey("unlocked"), 1)) || 1));
  const viewportBucket = () => {
    const width = Math.max(1, Number(window.innerWidth) || 1);
    const height = Math.max(1, Number(window.innerHeight) || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone-portrait";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return "desktop";
  };
  const noteInput = (event) => {
    if (event?.detail === 0 || event?.type === "keydown" || event?.type === "keyup") lastInputType = "keyboard";
    else if (event?.pointerType === "touch") lastInputType = "touch";
    else if (event?.pointerType === "mouse") lastInputType = "mouse";
    else if (event?.pointerType) lastInputType = "pointer";
  };
  const track = (eventName, details = {}) => {
    try {
      if (!window.WonderAnalytics?.track) return;
      const stage = Math.max(1, Math.min(stageConfigs.length, Math.trunc(Number(details.stage) || currentStage + 1)));
      const payload = { game_id: GAME_ID, game_version: GAME_VERSION, interface_version: INTERFACE_VERSION, locale, viewport_bucket: viewportBucket(), input_class: lastInputType, stage };
      const bounded = (value, allowed) => allowed.includes(value) ? value : undefined;
      const source = bounded(details.source, ["main_start", "stage_card", "retry", "next", "result"]);
      const outcome = bounded(details.outcome, ["success", "failure"]);
      const holdBucket = bounded(details.hold_bucket, ["under_1s", "1_to_3s", "over_3s"]);
      const direction = bounded(details.direction, ["left", "right"]);
      const action = bounded(details.action, ["retry", "next", "stages"]);
      if (source) payload.source = source;
      if (outcome) payload.outcome = outcome;
      if (holdBucket) payload.hold_bucket = holdBucket;
      if (direction) payload.direction = direction;
      if (action) payload.action = action;
      if (details.parcels !== undefined) payload.parcels = Math.max(0, Math.min(8, Math.trunc(Number(details.parcels) || 0)));
      window.WonderAnalytics.track(eventName, payload);
    } catch {
      // Anonymous funnel measurement must never interrupt play.
    }
  };
  const holdBucket = (seconds) => seconds < 1 ? "under_1s" : seconds < 3 ? "1_to_3s" : "over_3s";
  const setScreen = (screen) => {
    ["main", "stage", "battle"].forEach((name) => { $(`#${name}Screen`).hidden = screen !== name; });
    if (screen !== "battle") {
      resultOpen = false;
      leaveOpen = false;
      resultScreen.hidden = true;
      leaveOverlay.hidden = true;
      battleScreen.classList.remove("result-open", "leave-open");
    }
    document.body.dataset.screen = screen;
  };
  const isBattleActive = () => document.body.dataset.screen === "battle" && !resultOpen && !leaveOpen;
  const formatTime = (value) => `${Math.max(0, value).toFixed(1)}s`;
  const formatStage = (index) => `${text("stage")} ${index + 1}`;
  const stageMeta = (index = currentStage) => {
    const rows = locale === "zh-Hant" ? STAGE_META_ZH : STAGE_META_EN;
    const row = rows[index] || STAGE_META_EN[index] || STAGE_META_EN[0];
    return { arc: row[0], title: row[1], objective: row[2], warning: row[3], result: row[4] };
  };
  const messageText = (key) => key === "swingRequired" ? stageMeta().warning : text(key);
  const beep = (frequency = 440, duration = 0.06) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audio = window.__cloudhookAudio || (window.__cloudhookAudio = new AudioContext());
      if (audio.state === "suspended") audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(0.035, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(); oscillator.stop(audio.currentTime + duration);
    } catch {}
  };
  const anchorPosition = (anchor, time) => ({ x: anchor.x, y: anchor.y + (anchor.move ? Math.sin(time * 1.8 + anchor.x) * 34 : 0) });
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const config = () => stageConfigs[currentStage];
  const stage2GuidePoints = [{ x: 300, y: 150 }, { x: 575, y: 190 }, { x: 735, y: 130 }];
  const targetPosition = (time = state?.time || 0) => {
    const cfg = config();
    const drift = cfg.lanternDrift || { x: 0, y: 0 };
    return {
      x: cfg.lantern.x + Math.sin(time * 0.72 + currentStage * 0.4) * drift.x,
      y: cfg.lantern.y + Math.sin(time * 0.93 + currentStage * 0.25) * drift.y,
    };
  };
  const resetState = () => {
    state = { x:105, y:410, vx:180, vy:-20, attached:false, anchor:-1, lastAnchor:-1, targetAnchor:-1, rope:0, time:0, score:0, parcels:0, collected:[], messageKey:"ready", done:false, success:false, flash:0, firstAttach:false, swingReady:false, masteredSwing:false, gateWarned:false, attachedAt:0 };
    inputAxis = 0;
  };
  const nearestAnchor = () => {
    if (!state) return -1;
    if (currentStage <= 1 && state.targetAnchor >= 0) {
      const target = anchorPosition(config().anchors[state.targetAnchor], state.time);
      if (distance(state, target) < 238) return state.targetAnchor;
    }
    let best = -1; let bestDistance = 204;
    config().anchors.forEach((anchor, index) => {
      if (index === state.lastAnchor) return;
      const d = distance(state, anchorPosition(anchor, state.time));
      if (d < bestDistance) { best = index; bestDistance = d; }
    });
    return best;
  };
  const refreshStaticA11y = () => { [[".brand-back","backLobby"],[".wonder-main-cover","cover"],[".locale select","language"],[".touch-controls","ariaControls"]].forEach(([selector,key]) => { const node = $(selector); const value = text(key); if (node && node.getAttribute("aria-label") !== value) node.setAttribute("aria-label", value); }); };
  const updateTetherLabel = () => { $("#tetherBtn").textContent = state?.attached ? text("release") : text("hold"); $("#tetherBtn").setAttribute("aria-pressed", String(Boolean(state?.attached))); $("#tetherState").textContent = state?.attached ? (state.swingReady ? text("swinging") : text("attached")) : messageText(state?.messageKey || "ready"); $("#tetherState").dataset.attached = String(Boolean(state?.attached)); refreshStaticA11y(); };
  const announce = (key) => { if (!state) return; state.messageKey = key; $("#battleStatus").textContent = messageText(key); };
  const attach = () => {
    if (!state || state.done || hidden || state.attached) return;
    const index = nearestAnchor();
    if (index < 0) { announce("noAnchor"); beep(180); return; }
    const anchor = anchorPosition(config().anchors[index], state.time);
    state.attached = true; state.anchor = index; state.lastAnchor = -1; state.targetAnchor = currentStage <= 1 && index + 1 < config().anchors.length ? index + 1 : -1; state.rope = Math.max(72, Math.min(190, distance(state, anchor))); state.attachedAt = state.time; state.swingReady = false;
    if (!state.firstAttach) { state.firstAttach = true; track("attach"); }
    announce("attached"); beep(620, 0.08); updateTetherLabel();
  };
  const release = () => {
    if (!state || state.done || !state.attached) return;
    const heldFor = Math.max(0, state.time - state.attachedAt);
    const releasedAnchor = state.anchor;
    const routeAssistEnabled = currentStage <= 1;
    const nextAnchor = routeAssistEnabled && releasedAnchor + 1 < config().anchors.length ? releasedAnchor + 1 : -1;
    const guideTarget = currentStage === 1 && releasedAnchor < stage2GuidePoints.length
      ? stage2GuidePoints[releasedAnchor]
      : null;
    const target = routeAssistEnabled
      ? (guideTarget || (nextAnchor >= 0 ? anchorPosition(config().anchors[nextAnchor], state.time + 0.15) : targetPosition(state.time + 0.15)))
      : state;
    const targetDistance = Math.max(1, distance(state, target));
    const releaseBoost = routeAssistEnabled
      ? (nextAnchor >= 0
        ? (currentStage === 1 ? (state.swingReady ? 360 : 520) : (state.swingReady ? 240 : 360))
        : (state.swingReady ? 420 : 360))
      : 0;
    state.attached = false; state.lastAnchor = releasedAnchor; state.targetAnchor = routeAssistEnabled ? nextAnchor : -1; state.anchor = -1; state.vx += inputAxis * 42 + (target.x - state.x) / targetDistance * releaseBoost; state.vy += (target.y - state.y) / targetDistance * releaseBoost - 16;
    state.attachedAt = 0; track("release", { hold_bucket: holdBucket(heldFor) });
    announce("released"); beep(840, 0.08); updateTetherLabel();
  };
  const setTether = (pressed) => { if (pressed) attach(); else release(); };
  const setInputAxis = (next) => {
    if (next !== 0 && next !== inputAxis && isBattleActive()) track("nudge", { direction: next < 0 ? "left" : "right" });
    inputAxis = next;
  };
  const rectHit = (x, y, rect) => x > rect.x - 16 && x < rect.x + rect.w + 16 && y > rect.y - 16 && y < rect.y + rect.h + 16;
  const finish = (success) => {
    if (!state || state.done || !isBattleActive()) return;
    state.done = true; state.success = success; state.attached = false; updateTetherLabel();
    track(success ? "stage_success" : "flight_failure", { outcome: success ? "success" : "failure", parcels: state.parcels });
    const best = Number(safeGet(bestKey(currentStage), 0)) || 0;
    if (success && (!best || state.time < best)) safeSet(bestKey(currentStage), state.time.toFixed(2));
    if (success && currentStage + 1 < stageConfigs.length) safeSet(stageKey("unlocked"), Math.max(unlocked(), currentStage + 2));
    beep(success ? 980 : 140, 0.16); renderResult(); setScreen("battle"); setResultOpen(true);
  };
  const update = (dt) => {
    if (!state || state.done || hidden || !isBattleActive()) return;
    state.time += dt;
    if (state.attached && !state.swingReady && state.time - state.attachedAt >= 0.45) { state.swingReady = true; state.masteredSwing = true; announce("swinging"); beep(700, 0.05); }
    const cfg = config();
    const gust = cfg.gust ? Math.sin(state.time * cfg.gustRate + currentStage * 0.6) * cfg.gust : 0;
    const wind = (cfg.wind + gust) * (state.attached ? 0.45 : 1);
    state.vx += (inputAxis * 170 + wind) * dt;
    state.vy += 360 * dt;
    state.x += state.vx * dt; state.y += state.vy * dt;
    if (state.attached) {
      const anchor = anchorPosition(cfg.anchors[state.anchor], state.time);
      let dx = state.x - anchor.x; let dy = state.y - anchor.y; const d = Math.max(1, Math.hypot(dx, dy));
      if (d > state.rope) { const nx = dx / d; const ny = dy / d; state.x = anchor.x + nx * state.rope; state.y = anchor.y + ny * state.rope; const tangentX = -ny; const tangentY = nx; const tangentSpeed = state.vx * tangentX + state.vy * tangentY; state.vx = tangentX * tangentSpeed; state.vy = tangentY * tangentSpeed; }
    }
    config().parcels.forEach((parcel, index) => { const sequenceReady = !cfg.parcelSequence || index === state.collected.length; if (sequenceReady && !state.collected.includes(index) && distance(state, parcel) < 30) { state.collected.push(index); state.parcels += 1; state.score += 100; state.flash = 0.25; track("parcel_collect", { parcels: state.parcels }); announce("parcel"); beep(720); } });
    if (config().spikes.some((spike) => rectHit(state.x, state.y, spike))) { finish(false); return; }
    const target = targetPosition();
    if (state.x > target.x - 30 && state.y > target.y - 85 && state.y < target.y + 115) {
      if (state.parcels < cfg.parcels.length) { state.x = target.x - 32; state.vx = -100; state.vy -= 60; state.flash = 0.18; $("#battleStatus").textContent = parcelObjectiveText(); return; }
      if (cfg.swingGate && !state.masteredSwing) { state.gateWarned = true; state.x = target.x - 48; state.vx = -120; state.vy -= 80; state.flash = 0.18; announce("swingRequired"); return; }
      state.score += Math.max(0, 600 - Math.floor(state.time * 22)); finish(true); return;
    }
    if (state.y > H + 35 || state.x < -45 || state.x > W + 45) finish(false);
  };
  const drawBackground = () => {
    if (battleBackground.complete && battleBackground.naturalWidth > 0) {
      ctx.drawImage(battleBackground, 0, 0, W, H);
      ctx.fillStyle = "#06132230";
      ctx.fillRect(0, 0, W, H);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, H); gradient.addColorStop(0, "#123f5b"); gradient.addColorStop(1, "#061322"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
    }
    ctx.fillStyle = "#ffffff12"; for (let i = 0; i < 34; i += 1) { const x = (i * 173) % W; const y = 26 + ((i * 71) % 255); ctx.fillRect(x, y, 2, 2); }
    ctx.fillStyle = "#9edce51a"; for (let i = 0; i < 5; i += 1) { ctx.beginPath(); ctx.ellipse(90 + i * 215, 485 - (i % 2) * 22, 150, 27, 0, 0, Math.PI * 2); ctx.fill(); }
  };
  const drawSheetProp = (image, sx, sy, sw, sh, dx, dy, dw, dh) => {
    if (!(image.complete && image.naturalWidth > 0)) return false;
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    return true;
  };
  const draw = () => {
    drawBackground(); const cfg = config();
    cfg.spikes.forEach((spike) => { if (!drawSheetProp(cloudhookProps, 512, 512, 512, 512, spike.x - 8, spike.y - 24, spike.w + 16, 64)) { ctx.fillStyle = "#ff788e"; ctx.beginPath(); for (let x = spike.x; x <= spike.x + spike.w; x += 14) { ctx.lineTo(x, spike.y + spike.h); ctx.lineTo(x + 7, spike.y); } ctx.lineTo(spike.x + spike.w, spike.y + spike.h); ctx.closePath(); ctx.fill(); } });
    cfg.anchors.forEach((anchor, index) => { const p = anchorPosition(anchor, state?.time || 0); if (!drawSheetProp(cloudhookProps, 0, 0, 512, 512, p.x - 31, p.y - 31, 62, 62)) { ctx.strokeStyle = index === state?.anchor ? "#fff0a6" : "#78e2dc"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(p.x, p.y, 19, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = "#ffffff55"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 29, 0, Math.PI * 2); ctx.stroke(); } });
    if (state?.attached && currentStage <= 1 && state.anchor >= 0) {
      const next = currentStage === 1 && state.anchor < stage2GuidePoints.length
        ? stage2GuidePoints[state.anchor]
        : (state.anchor + 1 < cfg.anchors.length ? anchorPosition(cfg.anchors[state.anchor + 1], state.time) : targetPosition(state.time));
      const dx = next.x - state.x; const dy = next.y - state.y; const length = Math.max(1, Math.hypot(dx, dy));
      ctx.save(); ctx.strokeStyle = "#fff0a699"; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(state.x, state.y); ctx.lineTo(next.x, next.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "#fff0a6"; ctx.beginPath(); ctx.moveTo(next.x, next.y); ctx.lineTo(next.x - dx / length * 18 - dy / length * 7, next.y - dy / length * 18 + dx / length * 7); ctx.lineTo(next.x - dx / length * 18 + dy / length * 7, next.y - dy / length * 18 - dx / length * 7); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    cfg.parcels.forEach((parcel, index) => { if (state?.collected.includes(index)) return; if (!drawSheetProp(cloudhookProps, 512, 0, 512, 512, parcel.x - 24, parcel.y - 24, 48, 48)) { ctx.fillStyle = "#ffd277"; ctx.beginPath(); ctx.arc(parcel.x, parcel.y, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff3b6"; ctx.fillRect(parcel.x - 2, parcel.y - 16, 4, 32); ctx.fillRect(parcel.x - 16, parcel.y - 2, 32, 4); } });
    const target = targetPosition();
    if (!drawSheetProp(cloudhookProps, 1024, 0, 512, 512, target.x - 40, target.y - 40, 80, 80)) { ctx.fillStyle = "#ffd277"; ctx.shadowColor = "#ffd277"; ctx.shadowBlur = 22; ctx.beginPath(); ctx.arc(target.x, target.y, 25, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = "#143650"; ctx.beginPath(); ctx.arc(target.x, target.y, 12, 0, Math.PI * 2); ctx.fill(); }
    if (state?.attached && state.anchor >= 0) { const anchor = anchorPosition(cfg.anchors[state.anchor], state.time); ctx.strokeStyle = "#ffd277"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y); ctx.lineTo(state.x, state.y); ctx.stroke(); }
    if (state) { ctx.save(); ctx.translate(state.x, state.y); ctx.rotate(Math.atan2(state.vy, Math.max(1, state.vx))); const pose = state.done && state.success ? 2 : state.attached ? 1 : 0; if (!drawSheetProp(courierSprites, pose * 512, 0, 512, 1024, -34, -55, 68, 110)) { ctx.fillStyle = "#d87872"; ctx.beginPath(); ctx.ellipse(0, 0, 21, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#f8b66d"; ctx.beginPath(); ctx.arc(13, -8, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#071627"; ctx.beginPath(); ctx.arc(17, -10, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#ffd277"; ctx.beginPath(); ctx.moveTo(-16, -8); ctx.lineTo(-31, -19); ctx.lineTo(-22, 2); ctx.closePath(); ctx.fill(); } ctx.restore(); }
    if (state?.flash > 0) { ctx.fillStyle = `rgba(255,235,157,${Math.min(0.35, state.flash)})`; ctx.fillRect(0, 0, W, H); }
  };
  const tick = (now) => { const dt = Math.min(0.032, Math.max(0, (now - lastTime) / 1000 || 0)); lastTime = now; if (!hidden) { if (isBattleActive()) update(dt); draw(); updateHud(); } frame = window.requestAnimationFrame(tick); };
  const updateHud = () => { if (!state) return; $("#scoreLabel").textContent = `${text("score")}: ${state.score}`; $("#timeLabel").textContent = `${text("time")}: ${formatTime(state.time)}`; $("#parcelObjective").textContent = `${stageMeta().objective} · ${parcelObjectiveText()}`; $("#controlHint").textContent = `${text("hint")} ${stageMeta().warning}`; canvas.dataset.attached = String(state.attached); canvas.dataset.swingReady = String(state.swingReady); canvas.dataset.time = String(state.time); canvas.dataset.x = String(state.x); canvas.dataset.y = String(state.y); updateTetherLabel(); };
  const renderResult = () => { const best = Number(safeGet(bestKey(currentStage), 0)) || 0; const meta = stageMeta(); $("#resultEyebrow").textContent = `${text("stage")} ${currentStage + 1} · ${meta.title}`; $("#resultTitle").textContent = text(state.success ? "success" : "failure"); $("#resultCopy").textContent = state.success ? `${text(currentStage === stageConfigs.length - 1 ? "final" : "successCopy")} ${meta.result}` : `${text("failureCopy")} ${meta.warning} ${text("retryCue")}`; $("#resultScore").innerHTML = `<span>${text("scoreStat")}</span><strong>${state.score}</strong>`; $("#resultTime").innerHTML = `<span>${text("timeStat")}</span><strong>${best ? formatTime(best) : "—"}</strong>`; $("#nextBtn").textContent = text("next"); $("#nextBtn").disabled = !state.success || currentStage >= stageConfigs.length - 1; $("#retryBtn").textContent = text("retry"); $("#resultStagesBtn").textContent = text("stageMap"); };
  const liveBattleNodes = () => [...battleScreen.children].filter((node) => node !== resultScreen && node !== leaveOverlay);
  const syncBattleOverlayState = () => { liveBattleNodes().forEach((node) => { const inert = resultOpen || leaveOpen; node.inert = inert; if (inert) node.setAttribute("aria-hidden", "true"); else node.removeAttribute("aria-hidden"); }); };
  const applyLeaveCopy = () => { const copy = LEAVE_COPY[locale] || LEAVE_COPY.en; $("#leaveEyebrow").textContent = text("battle"); $("#leaveTitle").textContent = copy.title; $("#leaveCopy").textContent = copy.body; $("#continueBattle").textContent = copy.continue; $("#leaveBattle").textContent = copy.leave; };
  const setResultOpen = (open) => { resultOpen = Boolean(open); if (resultOpen) { leaveOpen = false; leaveOverlay.hidden = true; } resultScreen.hidden = !resultOpen; battleScreen.classList.toggle("result-open", resultOpen); battleScreen.classList.remove("leave-open"); syncBattleOverlayState(); if (resultOpen) { resultScreen.scrollTop = 0; const focusTarget = $("#nextBtn").disabled ? $("#retryBtn") : $("#nextBtn"); focusTarget?.focus(); } };
  const setLeaveOpen = (open, restoreFocus = true) => { if (open && resultOpen) return; leaveOpen = Boolean(open); leaveOverlay.hidden = !leaveOpen; battleScreen.classList.toggle("leave-open", leaveOpen); syncBattleOverlayState(); if (leaveOpen) $("#continueBattle").focus(); else if (restoreFocus && !battleScreen.hidden) $("#battleBack")?.focus(); };
  const renderStages = () => { const count = unlocked(); $("#stageGrid").innerHTML = stageConfigs.map((_, index) => { const open = index < count; const best = Number(safeGet(bestKey(index), 0)); const meta = stageMeta(index); const status = open ? (best ? `${text("stageDone")}: ${formatTime(best)}` : text("choose")) : text("stageLocked"); return `<button type="button" class="stage-card${open ? "" : " locked"}" data-stage="${index}" data-arc="${meta.arc}" aria-posinset="${index + 1}" aria-setsize="${stageConfigs.length}" aria-label="${formatStage(index)} · ${meta.title}" ${open ? "" : "disabled"}><strong>${formatStage(index)} · ${meta.title}</strong><small>${meta.arc} · ${meta.objective} · ${status}</small><span aria-hidden="true">${open ? "✦" : "◌"}</span></button>`; }).join(""); $("#stageGrid").dataset.wpStageTotal = String(stageConfigs.length); $("#stageTitle").textContent = text("stages"); $("#stageTab").textContent = text("stages"); $("#stageEyebrow").textContent = text("eyebrow"); $("#stageHelp").textContent = text("stageHelp"); $("#stageGrid").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", (event) => { noteInput(event); startStage(Number(button.dataset.stage), "stage_card"); })); };
  const startStage = (index, source = "stage_card") => { setResultOpen(false); setLeaveOpen(false, false); currentStage = Math.max(0, Math.min(stageConfigs.length - 1, index)); resetState(); track("stage_start", { source, stage: currentStage + 1 }); $("#battleEyebrow").textContent = text("battle"); $("#battleTitle").textContent = `${formatStage(currentStage)} · ${stageMeta().title}`; $("#battleStatus").textContent = stageMeta().objective; canvas.setAttribute("aria-label", text("ariaCanvas")); $("#nudgeLeft").setAttribute("aria-label", text("ariaLeft")); $("#nudgeRight").setAttribute("aria-label", text("ariaRight")); setScreen("battle"); window.dispatchEvent(new Event("weightplay:battle-open")); window.WeightPlayBattleCanvas?.sync?.(); window.setTimeout(() => window.WeightPlayBattleCanvas?.sync?.(), 0); beep(440); };
  const refreshShell = () => { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.title = `Cloudhook Courier | WeightPlay`; $("#eyebrow").textContent = text("eyebrow"); $("#coming").textContent = text("coming"); $("#languageLabel").textContent = text("language"); $("#tagline").textContent = text("objective"); $("#objective").textContent = text("objective"); $("#guideTitle").textContent = text("guideTitle"); $("#guideBody").textContent = text("guideBody"); $("#guideControls").textContent = text("guideControls"); $("#startBtn").textContent = text("start"); $("#soundBtn").textContent = soundEnabled ? text("soundOn") : text("soundOff"); $("#soundBtn").setAttribute("aria-pressed", String(soundEnabled)); $("#stageSoundBtn").textContent = soundEnabled ? text("soundOn") : text("soundOff"); $("#stageSoundBtn").setAttribute("aria-pressed", String(soundEnabled)); $("#battleSoundBtn").textContent = soundEnabled ? text("soundOn") : text("soundOff"); $("#battleSoundBtn").setAttribute("aria-label", soundEnabled ? text("soundOn") : text("soundOff")); $("#battleSoundBtn").setAttribute("aria-pressed", String(soundEnabled)); $("#stageBack").setAttribute("aria-label", text("backMain")); $("#battleBack").setAttribute("aria-label", text("backStages")); $("#battleBack").setAttribute("data-wp-return", "battle"); $("#restartBtn").textContent = text("restart"); $("#stageTitle").textContent = text("stages"); $("#stageEyebrow").textContent = text("eyebrow"); $("#stageHelp").textContent = text("stageHelp"); applyLeaveCopy(); renderStages(); if (state && document.body.dataset.screen === "battle") { $("#battleEyebrow").textContent = text("battle"); $("#battleTitle").textContent = formatStage(currentStage); $("#battleStatus").textContent = text(state.messageKey || "ready"); updateHud(); } if (state && resultOpen) renderResult(); updateTetherLabel(); };
  const toggleSound = () => { soundEnabled = !soundEnabled; safeSet("weightplay_sound", soundEnabled ? "on" : "off"); refreshShell(); if (soundEnabled) beep(660); };
  const goStage = () => { if (document.body.dataset.screen === "main") track("game_start", { stage: 1, source: "main_start" }); setResultOpen(false); setLeaveOpen(false, false); renderStages(); setScreen("stage"); };
  $("#startBtn").addEventListener("click", (event) => { noteInput(event); goStage(); }); $("#stageBack").addEventListener("click", () => setScreen("main")); $("#soundBtn").addEventListener("click", toggleSound); $("#stageSoundBtn").addEventListener("click", toggleSound); $("#battleSoundBtn").addEventListener("click", toggleSound); $("#restartBtn").addEventListener("click", (event) => { noteInput(event); startStage(currentStage, "stage_card"); }); $("#retryBtn").addEventListener("click", (event) => { noteInput(event); track("result_retry", { action: "retry", source: "result" }); startStage(currentStage, "retry"); }); $("#nextBtn").addEventListener("click", (event) => { if (!$("#nextBtn").disabled) { noteInput(event); track("result_next", { action: "next", source: "result" }); startStage(currentStage + 1, "next"); } }); $("#resultStagesBtn").addEventListener("click", (event) => { noteInput(event); track("result_stages", { action: "stages", source: "result" }); goStage(); });
  document.addEventListener("click", (event) => { const control = event.target?.closest?.('#battleScreen [data-wp-return="battle"]'); if (!control || battleScreen.hidden || resultOpen) return; event.preventDefault(); event.stopImmediatePropagation(); setLeaveOpen(true); }, true);
  $("#continueBattle").addEventListener("click", () => setLeaveOpen(false));
  $("#leaveBattle").addEventListener("click", () => goStage());
  document.addEventListener("keydown", (event) => {
    if (!leaveOpen) return;
    if (event.key === "Escape") { event.preventDefault(); setLeaveOpen(false); return; }
    if (event.key !== "Tab") return;
    const actions = [$("#continueBattle"), $("#leaveBattle")];
    const index = actions.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); actions[actions.length - 1].focus(); }
    else if (!event.shiftKey && index === actions.length - 1) { event.preventDefault(); actions[0].focus(); }
  });
  const pressButton = (button, down, up) => { button.addEventListener("pointerdown", (event) => { event.preventDefault(); noteInput(event); button.setPointerCapture?.(event.pointerId); down(); }); ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => button.addEventListener(eventName, (event) => { event.preventDefault(); noteInput(event); up(); })); };
  pressButton($("#tetherBtn"), () => setTether(true), () => setTether(false)); pressButton(canvas, () => setTether(true), () => setTether(false)); pressButton($("#nudgeLeft"), () => setInputAxis(-1), () => { if (inputAxis < 0) setInputAxis(0); }); pressButton($("#nudgeRight"), () => setInputAxis(1), () => { if (inputAxis > 0) setInputAxis(0); });
  document.addEventListener("keydown", (event) => { if (document.body.dataset.screen !== "battle") return; noteInput(event); if (["ArrowLeft","ArrowRight"," ","Spacebar","r","R"].includes(event.key)) event.preventDefault(); if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setInputAxis(-1); if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setInputAxis(1); if (event.key === " " || event.key === "Spacebar") setTether(true); if (event.key.toLowerCase() === "r") startStage(currentStage, "stage_card"); });
  document.addEventListener("keyup", (event) => { noteInput(event); if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") { if (inputAxis < 0) setInputAxis(0); } if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") { if (inputAxis > 0) setInputAxis(0); } if (event.key === " " || event.key === "Spacebar") setTether(false); });
  document.addEventListener("visibilitychange", () => { hidden = document.hidden; lastTime = performance.now(); if (hidden && state?.attached) release(); });
  const initialLocale = (() => { const routeLocale = document.documentElement.lang; const saved = safeGet("weightPlayLocale", "en"); return COPY[routeLocale] ? routeLocale : COPY[saved] ? saved : "en"; })(); locale = initialLocale; $("#localeSelect").innerHTML = LOCALE_ORDER.map((code) => `<option value="${code}">${code}</option>`).join(""); $("#localeSelect").value = locale; $("#localeSelect").addEventListener("change", (event) => { locale = event.target.value; safeSet("weightPlayLocale", locale); refreshShell(); }); soundEnabled = safeGet("weightplay_sound", "on") !== "off"; resetState(); refreshShell(); setScreen("main"); lastTime = performance.now(); frame = window.requestAnimationFrame(tick);
  $("#stageBack").setAttribute("data-wp-return", "stage");
  $("#stageScreen").setAttribute("data-wp-standard-stage-screen", "");
  $("#stageGrid").setAttribute("data-wp-stage-rail", "");
  $("#battleScreen").setAttribute("data-wp-logical-battle-canvas", "");
  $("#stageScreen .section-head")?.classList.add("stage-header");
  $("#battleScreen .section-head")?.classList.add("battle-header");
  const inlineGuide = document.querySelector(".guide[data-wp-game-guide]");
  inlineGuide?.classList.add("main-howto");
})();
