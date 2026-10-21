export const REGIONS=[
 {name:'銅光前哨',en:'Copperlight Outpost',color:0xc99a61,dark:0x20333d,seal:'三鍵岩門',relic:'啟程之鑰',intro:'地底傳來一段失落的求救訊號。菲亞決定駕駛小鑽機，尋找三千公尺深處的古老能源站。',discovery:'三枚機械鎖片依序鬆開。訊號不是求救，而是一座仍在等待啟動的地心燈塔。',hint:'依照發亮的順序鑽開三枚鎖片。'},
 {name:'冰泉迴廊',en:'Glacial Aqueduct',color:0x68d4d0,dark:0x153e4c,seal:'恆溫泉眼',relic:'潮汐泵芯',intro:'曾經供應地表的冷卻水道已經凍結。找到冷泉，在冰與能量之間恢復流動。',discovery:'泉眼恢復循環，地層開始呼吸。地心燈塔還需要熔心、水晶和高壓站的三條供能線。',hint:'對準發亮的泵芯鑽擊；每啟動一座泵，鬆開讓閥門回彈，再啟動下一座。'},
 {name:'赤焰斷層',en:'Emberfault',color:0xf27b4e,dark:0x412934,seal:'熔心閘爐',relic:'餘燼渦輪',intro:'熔岩流正在橫越礦脈。高價礦石藏在危險邊緣；黑色玄武岩會磨損機殼。',discovery:'熔心的護罩在冷卻窗裡碎裂，第一條供能線重新點亮。更深處的水晶正在回應。',hint:'爐心每五秒開啟一次冷卻窗。對準亮起的弱點，等待護罩消失後完成鑽擊。'},
 {name:'稜鏡聖窟',en:'Prism Sanctuary',color:0xa690f1,dark:0x252c50,seal:'折光晶環',relic:'共鳴稜鏡',intro:'水晶記錄著地底文明的片段。鑽機會用短促脈衝保持晶體完整；強化鑽力能更快穿過晶層。',discovery:'完整的水晶重建了一張地圖。燈塔曾維持地底與森林的季節循環，如今只剩最後的閘門。',hint:'對準亮點，每次下鑽少於一秒，分段鑽開三層共鳴環。'},
 {name:'深壓機城',en:'Pressure Citadel',color:0x78c595,dark:0x213d3d,seal:'三閥氣閘',relic:'深層調壓器',intro:'廢棄機城的瓦斯仍在礦層裡流動。鑽機會自動停下洩壓；升級與修補破損機殼後再前進。',discovery:'三道氣閘依次排空，最後一條供能線安全接通。菲亞終於聽見燈塔真正的聲音。',hint:'累積至少 20% 壓力，鬆開完成一次洩壓，再鑽擊亮起的閥門。每一層都要重新洩壓。'},
 {name:'地心星海',en:'Heartlight Abyss',color:0xe9c56b,dark:0x193344,seal:'地心燈塔',relic:'星海之心',intro:'三條供能線已經接通。穿越最後的裂隙，穩住反應爐，將地心燈塔的光帶回森林。',discovery:'燈塔重新點亮。暖流沿著泉脈回到地表，森林迎來新的春天。菲亞和夥伴帶回了地心的第一縷晨光。',hint:'三階段：對準弱點鑽開外殼 → 短按保護晶芯 → 洩壓後接通最後的供能閥。'},
];
export const MODULES={
 exchanger:{name:'動力交換器',min:3,cost:160,copper:12,crystal:0,icon:'W',desc:'鑽掘傷害 +20%，持續運作。'},
 prism:{name:'稜鏡穩定架',min:8,cost:350,copper:12,crystal:4,icon:'X',desc:'完整水晶的單次按住容許時間由 1.5 秒延長為 2.4 秒；封印仍依其規則。'},
 compressor:{name:'空間壓縮艙',min:6,cost:260,copper:20,crystal:0,icon:'B',desc:'額外增加 24 格礦艙。'},
 beacon:{name:'救援信標',min:11,cost:450,copper:20,crystal:6,icon:'E',desc:'緊急救援時保留 90% 礦物與材料。'},
 coil:{name:'儲能線圈',min:16,cost:650,copper:25,crystal:12,icon:'E',desc:'能量礦脈加速效果延長至 12 秒，強化持續挖掘效益。'},
 scanner:{name:'地質回收儀',min:21,cost:850,copper:35,crystal:16,icon:'C',desc:'每塊普通岩石回收一枚零件，岩石收益翻倍。'},
};
const portrait=id=>`/assets/weightplay-character-${id}-block-v1.webp`;
export const CREW={
 orla:{name:'月帽奧拉',role:'礦物學家',min:3,cost:240,portrait:portrait('moon-cap-owl'),desc:'金礦與水晶收益增加 20%；幫你讀懂稀有礦脈。'},
 moss:{name:'苔殼莫斯',role:'水道工程師',min:8,cost:480,portrait:portrait('moss-shell-turtle'),desc:'採到冷泉可洩壓，並修復 6 點機殼。'},
 bubble:{name:'泡鰭波波',role:'運輸專家',min:13,cost:780,portrait:portrait('bubble-fin-otter'),desc:'額外增加 10 格礦艙；緊急救援保留 90% 礦物。'},
};
export const TOOLS={
 beam:{name:'穿岩光束',price:50,min:1,icon:'E',desc:'啟用備用工具後，自動擊破耐久較高的普通地磚；冷卻 8 秒，不碰封印或水晶。'},
 coolant:{name:'洩壓膠囊',price:35,min:1,icon:'W',desc:'啟用備用工具後，緊急高壓時降低 20 壓力；平常免費自動洩壓。'},
 blast:{name:'震波鑽彈',price:60,min:6,icon:'B',desc:'啟用備用工具後，自動破壞玄武岩；冷卻 20 秒，不能破壞封印。'},
 repair:{name:'機殼修補包',price:40,min:11,icon:'E',desc:'啟用備用工具後，機殼低於 35 時修復 40；冷卻 10 秒。'},
};
export const ACHIEVEMENTS=[
 {id:'first',name:'第一次返航',desc:'安全完成一次探勘結算',reward:40,metric:'trips',target:1},
 {id:'miner',name:'礦脈收藏家',desc:'累計挖出 100 塊礦物',reward:120,metric:'ore',target:100},
 {id:'earn',name:'鑽機創業家',desc:'累計採礦收入 1500 金幣',reward:180,metric:'earned',target:1500},
 {id:'heads',name:'換裝專家',desc:'擁有全部四種鑽頭',reward:350,metric:'heads',target:4},
 {id:'seal',name:'失落文明',desc:'取得三枚封印遺物',reward:300,metric:'relics',target:3},
 {id:'craft',name:'改裝大師',desc:'製作四件不同的模組',reward:300,metric:'modules',target:4},
 {id:'deep',name:'深層勘探者',desc:'遠征進度抵達第 20 區',reward:400,metric:'depth',target:2000},
 {id:'end',name:'點亮地心',desc:'完成三十區主線',reward:1200,metric:'clears',target:30},
];
export const EXPEDITION_EVENTS={
 3:{row:7,kind:'cache',text:'發現舊礦工的補給箱：洩壓膠囊 +1。'},
 7:{row:8,kind:'spring',text:'地下泉湧！壓力下降。'},
 12:{row:10,kind:'gas',text:'瓦斯裂隙開啟：先洩壓，再繼續。'},
 17:{row:9,kind:'cache',text:'水晶工坊遺留了洩壓補給。'},
 22:{row:6,kind:'quake',text:'機城震動：修補裝備或選冷泉路線。'},
 28:{row:11,kind:'energy',text:'燈塔的能量流過鑽機：短時間鑽速提升。'},
};
