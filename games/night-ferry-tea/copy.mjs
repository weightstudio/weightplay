var h=Object.defineProperty;var i=(t,a)=>h(t,"name",{value:a,configurable:!0});export const routes={en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};const n=`start stages workshop back pause resume retry next guide goal how rules finish related faq
cleared locked available saved unsaved success failure chapter1 chapter2 checkpoint
shift beat served clean dirty rack income budget A B W C E warm flower chilled brewFlower chill wash hold wait
open closing onway delivered missed nextFerry installed sent ready washed returned sold stale
siteFirst siteBlocked busy cupShort rackFull needFlower needWarm needDirty tooLate needCup closed
lessonSite lessonBrew lessonWait lessonSend resetLesson
standard twin filter caddy theme equipped equip buy confirm cancel unlock permanent
balance bought insufficient unavailable restored departure eta`.split(/\s+/),o=`goalText howText rulesText finishText
q1 a1 q2 a2 standardInfo twinInfo filterInfo caddyInfo themeInfo webgl`.split(/\s+/);function l(t,a){const r=t.trim().split("|").map(e=>e.trim()),s=a.trim().split(`
`).map(e=>e.trim());if(r.length!==n.length||s.length!==o.length)throw new Error("Incomplete teahouse strings: "+r.length+"/"+n.length+" labels, "+s.length+"/"+o.length+" paragraphs");return Object.fromEntries([...n,...o].map((e,d)=>[e,[...r,...s][d]]))}i(l,"pack");export const words={en:l(`Start shift|Shifts|Equipment|Back|Pause|Resume|Retry|Next shift|Game guide|Goal|How to play|Controls and rules|Results|Related games|Questions|
Cleared|Locked|Ready|Progress saved|Could not save|Shift complete|Ferries departed|Westbank tea stand|Fogbound boardwalk|Checkpoint|
Shift|Beat|Orders|Clean cups|Returns|Tea rack|Takings|Budget|West Pier A|East Pier B|West stand|Central stand|East stand|Warm tea|Flower tea|Iced tea|Brew flowers|Chill tea|Wash cups|Insulate|Wait one beat|
Opens|Departs|On the way|Delivered|Missed|Next ferry|Stand installed|Runner dispatched|Tea ready|Cups washed|Cups returned|Order paid|Cup cooled too far|
Set up a stand first|Stand unavailable|Station occupied|Wash a cup first|Tea rack full|Brew flower tea first|Brew warm tea first|No used cups here yet|Arrival too late|Matching cup needed|Unavailable|
Tap the lit site to open your tea stand.|Tap Warm tea to start brewing.|Tap Wait to let the tea finish.|Tap the waiting ferry order to send the cup.|Replay first-shift tutorial|
Standard tray|Double tray|Wide strainer|Insulated caddy|Moon enamel|Equipped|Equip|Buy|Confirm|Cancel|Clear shift|Permanent|
Balance|Added to collection|Too few diamonds|Currently unavailable|Tea stand restored|Travel|Arrival`,`Deliver the required cups before the ferries depart.
Pick a stand site, brew the right tea, then tap the ferry order to send Nori. Wash returned cups to replenish the rack.
Tap or use Tab and Enter. Each service action advances one beat and every busy station works in parallel. Check the ferry windows, travel time and cup freshness.
On-time orders earn two coins. Meet the shift goal to unlock the next shift, or replay with a different layout for three stars.
Why can't I send tea?
Check the tea type, freshness, runner and arrival time shown on the order.
Can I play without spending diamonds?
All shifts have a three-star solution with standard equipment. Diamonds unlock a permanent appearance.
Holds two prepared cups.
Holds three prepared cups and carries two matching orders to the same pier when their ferry windows align.
Washes up to three cups at once.
Keeps one warm cup fresh for eleven beats.
A pearl enamel finish for the teapot, cups and dock lamps. Owned permanently after purchase.
The 3D scene could not start. Retry the shift or return to the map.`),"zh-Hant":l(`開始營業|班次|裝備|返回|暫停|繼續|重試|下一班|遊戲說明|目標|玩法|操作與規則|結算|相關遊戲|常見問題|
已完成|未解鎖|可開始|進度已保存|未能保存|本班達標|渡船已離岸|西岸茶站|霧潮浮橋|檢查點|
班次|拍數|訂單|空杯|待洗|茶杯架|收入|預算|西岸 A|東岸 B|西側站|中央站|東側站|沖暖茶|花茶|冰茶|沖花茶|冷卻|洗杯|保溫|等一拍|
開窗|離岸|送杯中|已送達|已錯過|下一班船|茶站已架好|茶杯已送出|茶已備好|杯子洗好|空杯已回|收到茶款|茶已不新鮮|
先布置茶站|此站位無法使用|工位忙碌|先洗一個杯子|茶架已滿|先沖好花茶|先沖好暖茶|回杯尚未到|抵達會太晚|需相符的茶杯|目前無法操作|
點亮起的站位，架起你的茶站。|點沖暖茶，開始泡第一杯。|點等一拍，讓第一杯茶泡好。|點等候的渡船訂單，送出茶杯。|重玩首班教學|
基本托盤|雙杯盤|寬濾架|保溫茶匣|月白琺瑯|已裝備|裝備|購買|確認|取消|完成班次|永久|
餘額|已加入收藏|鑽石不足|暫時無法使用|已恢復茶站|路程|送達`,`在渡船離岸前交付指定茶杯，達成本班的訂單目標。
選好茶站位置、準備相符的茶，再點渡船訂單請水獺送杯。把回收杯洗乾淨就能繼續泡茶。
點畫面，或以 Tab 和 Enter 操作。每個營業動作前進一拍，忙碌的工位會同時工作。留意兩岸航窗、送杯路程和茶的新鮮時間。
準時送杯每單賺兩枚金幣。達標開下一班，也能重玩並用其他布局挑戰三星。
為何不能送茶？
核對單上茶種、新鮮時間、跑腿是否空閒及預計送達時間。
一定要花鑽石嗎？
基本裝備能在全部班次取得三星。鑽石可購買永久外觀。
可先放兩杯已沖好的茶。
備三杯，同岸同茶且航窗相交時同時送兩杯。
一次最多洗乾淨三個杯子。
讓一杯暖茶保溫十一拍。
茶壺、茶杯和碼頭燈換上月白琺瑯。購買後永久收藏。
無法啟動 3D 場景。請重試班次或回選關。`)};
