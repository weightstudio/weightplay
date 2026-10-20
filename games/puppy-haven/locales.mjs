import {applyCultivationCopy} from './cultivation-copy.mjs';
import {applyV10Copy} from './v10-copy.mjs';
import {EXTRA} from './locale-packs.mjs';
import {MISSIONS} from './simulation.mjs';
import {applyObservationCopy} from './observation-copy.mjs';
import {applyHuntCopy} from './hunt-copy.mjs';
export const COPY={
 en:{title:'Puppy Haven',summary:'A little yard. A growing family. Feed, care for and raise your very own dogs.',preview:'Coming Soon · Internal preview',start:'Start game',missions:'Care missions',freeYard:'Free yard',hunger:'Fullness',happy:'Happiness',cleanliness:'Cleanliness',feed:'Feed',pet:'Pet',clean:'Clean',pantry:'Food',adopt:'Adopt',pair:'Family',help:'Help',webgl:'The 3D garden could not load. Your dogs are saved. Reload to try again.',reload:'Reload',wellDone:'A happy day in the yard',next:'Next mission',retry:'Replay mission',guide:'Select a dog in the yard or the list. Feed it, pet it and clear droppings. Buy three grades of food in the pantry. Adopt male or female dogs of six breeds. Healthy unrelated adults can have puppies; pregnancy takes 45 seconds of active play. Feed and care for puppies to help them grow. Progress saves on this device. Nothing decays while you are away.',adult:'Adult',puppy:'Puppy',male:'Male',female:'Female',parents:'Parents',pregnancy:'Puppy in {n}s',growth:'Growth {n}%',coins:'Coins {n}',dogs:'Dogs {n}/12',stage:'Mission {n}',ready:'Ready',locked:'Locked',cleared:'Cleared',reward:'+{n} coins',buy:'Buy 5 · {n} coins',use:'Feed · {n} left',nutrition:'Fullness +{n} · Growth +{g}',adoptPrice:'Adopt · {n} coins',father:'Father',mother:'Mother',choose:'Choose a dog',pairAction:'Welcome puppies',pairGuide:'Both parents: adult, unrelated, fullness / happiness / cleanliness ≥60. One puppy, 45 active seconds. Parents rest for 3 active minutes.',resting:'Resting {n}s',leaveTitle:'Pause and save',continue:'Continue caring',leave:'Save & return to missions',saved:'Your yard saves automatically. Dogs rest while you are away.',saveError:'Saving is unavailable. Keep this tab open to preserve your yard.',feedDone:'A delicious meal!',petDone:'A little love · +3 coins',cleanDone:'A cleaner yard · +5 coins',buyDone:'Pantry restocked',adoptDone:'Welcome home!',pairDone:'A new puppy is on the way!',birthDone:'A puppy is born!',growthDone:'Your puppy has grown up!',cleanCount:'Clean ({n})',restPet:'Pet ({n}s)',close:'Close',noParents:'First generation',newPuppy:'New puppy',helpTitle:'Welcome to your little yard',startCaring:'Let’s care for them',foodNames:['Basic kibble','Premium food','Gourmet fresh food'],breedNames:['Shiba','Corgi','Labrador','Husky','Dalmatian','Beagle'],errors:{invalid:'Choose a valid option.',full:'This dog is full. Try another dog.',noFood:'No food left. Buy a pack in Food.',rest:'Let this dog rest between cuddles.',alreadyClean:'The yard is clean. Droppings appear during play.',coins:'Not enough coins. Pet dogs and clean droppings to earn more.',stock:'The pantry is full.',capacity:'The yard is full. Pregnancies reserve a puppy place.',sex:'Choose one male and one female.',adult:'Both parents must be adults.',pregnant:'This dog is already expecting a puppy.',cooldown:'Let the parents finish their recovery.',related:'Choose dogs without shared ancestry.',needs:'Both parents need fullness, happiness and cleanliness of at least 60.'}},
 'zh-Hant':{title:'汪汪小院',summary:'一個小院，一家狗狗。餵食、清潔、陪伴，迎接新生小狗。',preview:'敬請期待 · 內部預覽',start:'開始遊戲',missions:'照顧任務',freeYard:'自由小院',hunger:'飽足',happy:'心情',cleanliness:'乾淨',feed:'餵食',pet:'摸摸',clean:'清便便',pantry:'食物',adopt:'領養',pair:'家庭',help:'說明',webgl:'3D 庭院無法載入，狗狗資料已保留。請重新載入再試。',reload:'重新載入',wellDone:'小院的美好一天',next:'下一個任務',retry:'重玩任務',guide:'點選庭院中的狗狗或下方名單。餵食、摸摸並清理便便；食物面板可購買三種等級的飼料。六種犬種都能選公母領養。健康、成年且無親緣的公母狗能迎接幼犬，懷孕需要45秒實際遊玩時間。餵食並照顧幼犬，陪牠長大。進度儲存在這台裝置，離開時需求不會下降。',adult:'成犬',puppy:'幼犬',male:'公',female:'母',parents:'父母',pregnancy:'再 {n} 秒出生',growth:'成長 {n}%',coins:'金幣 {n}',dogs:'狗狗 {n}/12',stage:'任務 {n}',ready:'可挑戰',locked:'尚未解鎖',cleared:'已完成',reward:'獲得 {n} 金幣',buy:'買5份 · {n}金幣',use:'餵食 · 剩{n}份',nutrition:'飽足 +{n} · 成長 +{g}',adoptPrice:'領養 · {n}金幣',father:'爸爸',mother:'媽媽',choose:'選擇狗狗',pairAction:'迎接小狗',pairGuide:'爸媽都須成年、無親緣，飽足／心情／乾淨達60。懷孕45秒後生一隻幼犬，爸媽休息3分鐘；只計實際遊玩時間。',resting:'休息 {n} 秒',leaveTitle:'暫停與存檔',continue:'繼續照顧',leave:'儲存並回任務',saved:'小院會自動存檔，離開時狗狗也會休息。',saveError:'目前無法儲存，請保留此分頁以免遺失小院。',feedDone:'吃得好滿足！',petDone:'愛的摸摸 · +3金幣',cleanDone:'小院更乾淨了 · +5金幣',buyDone:'食物補充好了',adoptDone:'歡迎回家！',pairDone:'小狗正在媽媽肚子裡成長！',birthDone:'小狗出生了！',growthDone:'幼犬長成大狗了！',cleanCount:'清便便（{n}）',restPet:'摸摸（{n}秒）',close:'關閉',noParents:'第一代',newPuppy:'新生小狗',helpTitle:'歡迎來到汪汪小院',startCaring:'開始照顧',foodNames:['基礎飼料','優質飼料','頂級鮮食'],breedNames:['柴犬','柯基','拉布拉多','哈士奇','大麥町','米格魯'],errors:{invalid:'請選擇有效的項目。',full:'這隻狗狗吃飽了，換一隻看看。',noFood:'食物用完了，請到食物面板補充。',rest:'狗狗想稍微休息，等一下再摸摸。',alreadyClean:'小院很乾淨，遊玩一段時間後才會出現便便。',coins:'金幣不夠，摸摸狗狗與清理便便可賺金幣。',stock:'餐櫃已經滿了。',capacity:'小院最多12隻狗，懷孕也會預留幼犬位置。',sex:'請選一隻公狗和一隻母狗。',adult:'兩隻狗都要成年才能配對。',pregnant:'這隻狗狗已經懷孕了。',cooldown:'爸媽還在休息，稍後再配對。',related:'請選沒有共同親緣的狗狗。',needs:'爸媽的飽足、心情與乾淨都要至少60。'}},
};
Object.assign(COPY.en,{
 restHouse:'Rest house',manageRooms:'Manage rooms · {n} resting',houseGuide:'Move a dog to the rest house for free, then bring it home whenever a yard place is available. Needs and growth are preserved; resting dogs do not get hungry or grow. Parents recover during active play. Expecting mothers stay in the yard.',roomCapacity:'Yard places, including reserved puppies: {n} / {max}',inYard:'In the yard ({n})',inHouse:'Resting ({n})',moveToHouse:'Let rest indoors',bringHome:'Bring home',restDone:'Settled into the rest house',recallDone:'Welcome back to the yard!',houseEmpty:'No dogs are resting here yet.',previousPage:'Previous',nextPage:'Next',backToFamily:'Back to family',
});
Object.assign(COPY.en.errors,{lastDog:'Keep at least one dog in the yard.',expectingRest:'Expecting mothers need their reserved nursery place in the yard.',restFull:'The rest house has reached its 500-dog collection limit.',capacity:'The 12 yard places are full, including reserved puppies. Move a dog to the rest house first.'});
COPY.en.guide+=' When the yard is full, open Family or Adopt → Manage rooms. Dogs can rest indoors and return without losing their needs, growth or family.';
Object.assign(COPY['zh-Hant'],{
 restHouse:'休息小屋',manageRooms:'管理房間 · {n}隻休息中',houseGuide:'可以免費讓狗狗到小屋休息，庭院有空位時隨時接回。需求與成長都會保留；休息時不會肚子餓或長大。爸媽的恢復時間仍隨實際遊玩進行。懷孕的媽媽會留在庭院育幼。',roomCapacity:'庭院位置（包含幼犬預留）：{n} / {max}',inYard:'庭院（{n}）',inHouse:'休息中（{n}）',moveToHouse:'到小屋休息',bringHome:'接回庭院',restDone:'狗狗到小屋休息了',recallDone:'歡迎回到庭院！',houseEmpty:'目前沒有狗狗在小屋休息。',previousPage:'上一頁',nextPage:'下一頁',backToFamily:'返回家庭',
});
Object.assign(COPY['zh-Hant'].errors,{lastDog:'請留至少一隻狗狗在庭院。',expectingRest:'懷孕的媽媽需要留在庭院，使用已預留的育幼位置。',restFull:'休息小屋已達500隻的收藏上限。',capacity:'庭院12個位置（含預留幼犬）已滿，先讓一隻狗狗到休息小屋吧。'});
COPY['zh-Hant'].guide+=' 庭院住滿時，可從「家庭」或「領養」進入「管理房間」。狗狗可以到小屋休息再接回，需求、成長與親緣都會保留。';
Object.assign(COPY,EXTRA);
COPY.en.missionPairs=MISSIONS.map(m=>[m.en,m.goalEn]);
COPY['zh-Hant'].missionPairs=MISSIONS.map(m=>[m.zh,m.goalZh]);
applyObservationCopy(COPY);
applyHuntCopy(COPY);
applyCultivationCopy(COPY);
applyV10Copy(COPY);
// The public route and runtime language switch share these FAQ labels.
const faqLabels={
 en:['FAQ','Can puppies go hunting?','How do I raise a different breed?'],
 'zh-Hant':['常見問題','幼犬可以出戰嗎？','怎麼培養出不同犬種？'],
 'zh-Hans':['常见问题','幼犬可以出战吗？','怎么培养出不同犬种？'],
 ja:['よくある質問','子犬は狩りに出られますか？','別の犬種に育てるには？'],
 ko:['자주 묻는 질문','강아지도 사냥에 나갈 수 있나요?','다른 견종으로 키우려면 어떻게 하나요?'],
 es:['Preguntas frecuentes','¿Pueden los cachorros ir de cacería?','¿Cómo crío una raza diferente?'],
 'pt-BR':['Perguntas frequentes','Filhotes podem caçar?','Como criar uma raça diferente?'],
 fr:['Questions fréquentes','Les chiots peuvent-ils chasser ?','Comment élever une autre race ?'],
 de:['Häufige Fragen','Können Welpen auf die Jagd gehen?','Wie ziehe ich eine andere Rasse auf?'],
 it:['Domande frequenti','I cuccioli possono andare a caccia?','Come allevo una razza diversa?'],
 ru:['Частые вопросы','Могут ли щенки охотиться?','Как вырастить собаку другой породы?'],
 hi:['अक्सर पूछे गए प्रश्न','क्या पिल्ले शिकार पर जा सकते हैं?','मैं दूसरी नस्ल कैसे पालूँ?'],
 ar:['الأسئلة الشائعة','هل تستطيع الجراء الذهاب للصيد؟','كيف أربي سلالة مختلفة؟'],
};
for(const [locale,[faqTitle,faqPuppy,faqBreeds]]of Object.entries(faqLabels))Object.assign(COPY[locale],{faqTitle,faqPuppy,faqBreeds});
export const SUPPORTED=['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
export const LANGUAGE_LABELS={en:'Language','zh-Hant':'語言','zh-Hans':'语言',ja:'言語',ko:'언어',es:'Idioma','pt-BR':'Idioma',fr:'Langue',de:'Sprache',it:'Lingua',ru:'Язык',hi:'भाषा',ar:'اللغة'};
