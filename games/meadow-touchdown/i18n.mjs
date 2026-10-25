const KEYS={
  ui:'start|stages|playbooks|locker|back|main|help|resume|leave|pause|next|replay|stage|down|yards|clock|snap|throw|stop|relay|ready|drag|aim|select|selected|cancel|confirm|controls|objective'.split('|'),
  event:'catch|incomplete|flag|firstDown|switch|feint|touchdown|intercept|timeout|sack|time|downs|pairMissing|wrongGate|relayMissing|win|lose|leg|relayCatch'.split('|'),
  growth:'saved|saveError|retrySave|unlocked|locked|completed|unlockAt|medals|pennants|kit|stands|classic|buy|equip|equipped|permanent|balance|insufficient|storage|purchaseConfirm|graphicsError'.split('|'),
};
const RAW={
en:{
ui:'Start Game|Stages|Playbooks|Clubhouse|Back|Main|How to play|Continue playing|Return to Stages|Paused|Next Stage|Replay|Stage {n}|Down|To first down|Time|Snap|Pass|Stop safely|Lateral|Choose a play|Drag, then release|Aim|Select|Selected|Cancel|Confirm|Controls|Objective',
event:'Caught!|Incomplete pass|Flag pulled|First down!|Coverage switching|Defenders swapping|Touchdown!|Intercepted|Throw clock expired|Quarterback flagged|Time expired|Four downs used|Catch with two teammates first|Use the open half of the end zone|Complete a lateral first|Drive complete|Try a new route|Second drive|Lateral complete!',
growth:'Progress saved|Progress could not be saved. Keep this result open and retry.|Retry save|Unlocked|Locked|Cleared|Clear Stage {n} to unlock|Medals|Pennants|Aurora kit|Twilight stands|Classic|Buy for {n}|Equip|Equipped|Permanent appearance only. No change to speed, catches or defense.|Diamonds|Not enough diamonds.|Storage is unavailable. No item was delivered.|Buy this permanent appearance for {n} diamonds?|3D graphics stopped. Reload the page to try again.',
summary:'Read the routes, pass into space, then dodge the defenders to reach the end zone.',
posterAlt:'Leo throws a football toward Fia on a sunlit meadow flag-football field.',
bookNames:['Spread','Cross','Hooks','Delay','Corners','Wheel'],
bookHints:['Three open lanes; look for the unmarked runner.','Crossing routes draw man coverage across the field.','Short catches offer a quick escape from pressure.','Delayed starts let coverage move before the catch.','Turn outside the zone before throwing deep.','A wide wheel route with a short middle outlet.'],
arcs:['Meadow','Riverside','Whistle ridge','Wind gardens','Signal grove','Championship'],
stages:['First throw','Lead the runner','Find the space','Flag chase','Two teammates','Zone edges','Short outlet','Sideline route','Three zones','Twin gates','First whistle','Quick release','Wrong-side bait','Keep an outlet','Change the play','Read the wind','Wait a beat','Into the wind','Sideline margin','Turning gust','Coverage signals','Corner window','Early or late','Wind and signals','Look-off duel','Wheel route','Cross pressure','Wind switch','Long drive','Meadow final'],
rules:['You have four downs to advance 10 yards. Reaching the yellow line earns a fresh set. Carry the ball over the far end line to score. An interception ends the drive.',
'Before the snap, choose any unlocked playbook and read the three routes. Tap Snap, drag the centre pad to aim ahead of a teammate, then release to pass. A tap without a drag cancels the throw.',
'On a keyboard, Space snaps and passes; arrows aim. After a catch, A/D or the left/right arrows change lane. Space stops safely at your current spot. The side buttons offer the same actions on touch screens.',
'A flag pull ends that down at the runner’s position. An incomplete pass, a late throw or a flagged quarterback spends a down without gaining yards. The clock freezes while choosing a play or opening a menu.',
'Five-stage cups introduce man marking, zones, quarterback pressure, wind and coverage switches. Read the red coverage cues; the white passing arc includes the wind, while the coloured paths show receiver routes.',
'Stage 5 needs catches by two different teammates. Stage 10 alternates the open half of the end zone. Stage 15 locks the last successful playbook for one down. Stage 20 reverses wind mid-flight; Stage 25 lets an aim across the centre lure defenders into swapping.',
'Stage 30 has two drives. Each needs one backward or sideways lateral before the touchdown. After the catch, use Lateral when its supporting teammate is in range. The highlighted line shows the target; a defender can intercept it.',
'Clear stages to save medals and unlock six free playbooks and six pennants. Three medals reward a clear, avoiding fourth down, and avoiding incomplete passes or quarterback failures. Replays improve records; each stage grants its shared Star Sand reward only once.',
'The Aurora kit costs 18 diamonds and Twilight stands cost 24. Both are permanent cosmetics. Inspect their preview and confirm before buying. Every stage and playbook can be completed or earned without diamonds.',
'Progress and appearance choices are saved in this browser. Clearing browser data may remove them. This single-player game has no account requirement or cloud-save feature. Leave confirmation discards only the current drive; completed stages stay saved.',
'We designed short drives around visible routes and predictable defenders. A short pass can protect a first down; waiting can open a longer route but gives the blitz time to reach Leo. The same field, timings and collisions apply to touch, mouse and keyboard.',
'Leaving now discards this drive in {stage}. Saved stages, medals, playbooks and owned cosmetics remain.',
'On the next down, choose a different playbook; the one that made the last catch is temporarily locked.'],
headings:['Game guide','Read the field','Controls','Downs and defense','Six cups','Permanent collection','Player and save information','Design note','Questions','More related games'],
faqQ:['Why did the pass miss?','Does a flag pull end the whole stage?','How do I unlock new plays?','Why is Stage 30 still asking for a lateral?','Do diamonds improve the team?'],
faqA:['Aim where the runner will arrive, not where they are now. The white arc shows the ball’s flight, including wind. A defender can reach a low pass first.','Usually it ends one down. You keep the gained ground, and crossing the yellow line resets the down count. Interceptions, expired time and a failed fourth down end the stage.','Clear Stages 5, 10, 15, 20 and 25. Each adds a free permanent playbook. Select it in Playbooks or before a snap.','Each of the two drives needs its own completed lateral. A forward pass does not count; use the Lateral action after catching, before crossing the end line.','No. Diamonds buy a jersey palette or stand decorations. Speed, catch ranges, routes and defense remain identical.'],
tags:['Flag football','Lead passing','Sports strategy']},
'zh-Hant':{
ui:'開始遊戲|關卡|戰術本|球隊小屋|返回|主畫面|玩法說明|繼續比賽|返回關卡|已暫停|下一關|重玩|第 {n} 關|檔數|距首攻|時間|開球|傳球|安全收球|側後接力|選擇戰術|拖曳後放開傳球|瞄準|選用|已選用|取消|確認|操作|目標',
event:'接到了！|傳球未完成|旗帶被拔|取得首攻！|即將換防|守衛交換盯人|達陣！|被攔截|出手時間到|四分衛被拔旗|比賽時間到|四檔用盡|先讓兩位隊友接球|請通過開放的半邊端區|先完成一次側後接力|推進成功|換條路線再試|第二段推進|接力成功！',
growth:'進度已儲存|進度未能儲存，請保留此結算並重試。|重試儲存|已解鎖|未解鎖|已通關|通過第 {n} 關解鎖|勳章|紀念旗|極光球衣|暮色看台|經典|花費 {n} 購買|裝備|已裝備|永久外觀。不影響速度、接球或防守。|鑽石|鑽石不足。|暫時無法儲存，未交付物品。|花費 {n} 顆鑽石購買這款永久外觀？|3D 畫面已停止，請重新載入頁面再試。',
summary:'看準跑位，把球傳進空檔，再閃過守衛衝向達陣區。',posterAlt:'Leo 在陽光下的草原腰旗球場把球傳向 Fia。',
bookNames:['展開','交叉','回鉤','延遲','折角','繞邊'],bookHints:['三路展開，找出無人盯防的隊友。','交叉跑位把盯人守衛帶向另一側。','短接提供快速擺脫施壓的出口。','晚一步起跑，等防守先露出空檔。','轉出區域邊緣，再投向深處。','邊線長路，搭配中央短傳退路。'],arcs:['草原','河岸','哨站山丘','風之庭園','旗語林地','冠軍盃'],
stages:['第一記傳球','傳到前方','左右空檔','旗帶追逐','雙星接棒','區域邊緣','短線先行','沿邊穿越','三區縫隙','雙門守望','第一聲哨','快傳出口','錯邊誘導','留住退路','換招哨站','看風旗','延後半拍','逆風短接','邊界餘裕','回旋風場','換防旗語','折角出縫','早投或等候','風中的旗語','誘投對決','繞邊航線','交叉壓力','風口換防','長場分段','草原決賽'],
rules:['每組有四檔推進機會，前進 10 碼、越過黃線就獲得新的四檔。帶球通過遠端底線即可達陣。傳球被攔截會結束本次推進。','開球前選擇已解鎖的戰術，查看三條跑位路線。按「開球」，在中央操作區拖曳，把落點移到隊友前方，放開傳球。只有點按、沒有拖曳會取消出手。','鍵盤用空白鍵開球與傳球，方向鍵瞄準。接球後用 A/D 或左右鍵換道，空白鍵在當前位置安全收球。觸控左右按鈕提供相同操作。','旗帶被拔時，該位置成為下一檔起點。傳球落空、出手超時或四分衛被拔旗會消耗一檔，沒有推進距離。選戰術與開啟選單時，時鐘暫停。','每五關一座盃賽，依序加入盯人、區域防守、四分衛施壓、橫風與換防。紅色提示顯示防守動向；白色傳球弧線已計入風偏，彩色線條則是隊友跑位。','第 5 關需要兩位不同隊友接球；第 10 關的開放端區逐檔換邊；第 15 關暫時禁用上次成功接球的戰術。第 20 關飛行途中轉風，第 25 關可用跨中線瞄準誘使守衛交換盯人。','第 30 關有兩段推進，每段都要先完成一次側後接力再達陣。接球後，支援隊友進入範圍時按「側後接力」。亮線會先標明目標，接力球也可能被攔截。','通關會保存勳章，並逐步解鎖六套免費戰術和六面紀念旗。三枚勳章分別獎勵通關、不使用第四檔，以及沒有傳球落空或四分衛失誤。重玩可刷新紀錄，每關的共用星砂獎勵只發一次。','極光球衣售價 18 顆鑽石，暮色看台售價 24 顆，皆為永久外觀。購買前可預覽並確認。所有關卡與戰術都能不花鑽石完成或取得。','進度與外觀選擇儲存在此瀏覽器。清除瀏覽器資料可能移除存檔。本作為單人遊戲，不要求帳號，也沒有雲端存檔。確認離開只會放棄當前推進，已通關進度會保留。','我們把比賽拆成短推進，讓跑位和防守反應保持可讀。短傳能先保住首攻，等待則可能打開長傳空檔，但也讓施壓守衛更接近 Leo。觸控、滑鼠與鍵盤使用相同球場、時序和碰撞規則。','現在離開會放棄「{stage}」的本次推進。已儲存關卡、勳章、戰術與外觀仍會保留。','下一檔請改用另一套戰術；上次成功接球的戰術會暫時鎖定。'],
headings:['遊戲指南','看懂球場','操作方式','檔數與防守','六座盃賽','永久收藏','玩家與存檔資訊','設計筆記','常見問題','更多相關遊戲'],faqQ:['為什麼隊友沒接到球？','旗帶被拔就整關失敗嗎？','怎麼取得新戰術？','第 30 關為什麼還要求接力？','鑽石能讓球隊變強嗎？'],faqA:['請瞄準隊友即將抵達的位置。白色弧線顯示包含風偏的飛行路徑；低球也可能先被守衛攔截。','通常只結束這一檔，已推進的距離保留，越過黃線還能重設檔數。被攔截、時間耗盡或第四檔未達標才會結束整關。','通過第 5、10、15、20、25 關，各永久解鎖一套免費戰術，可在戰術本或開球前選用。','兩段推進各需要一次成功的側後接力。向前傳球不算；接到球後、跨越底線前，使用側後接力按鈕。','不會。鑽石只購買球衣配色或看台裝飾，速度、接球範圍、跑位與防守規則完全相同。'],tags:['腰旗美式足球','提前量傳球','運動策略']},
};
export const COPY={};
for(const [locale,data] of Object.entries(RAW)){
  const copy={...data,stageNames:data.stages};
  for(const [group,keys] of Object.entries(KEYS)){const values=data[group].split('|');if(values.length!==keys.length)throw Error(`Locale group mismatch: ${locale}/${group}: ${values.length}/${keys.length}`);keys.forEach((key,i)=>copy[key]=values[i]);delete copy[group];}
  COPY[locale]=copy;
}
export const localeSegments={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
export function tr(locale,key,values={}){let text=COPY[locale]?.[key]??COPY.en[key];if(typeof text!=='string')throw Error(`Unknown copy: ${locale}/${key}`);return text.replace(/\{(\w+)\}/g,(_,k)=>String(values[k]??''));}
