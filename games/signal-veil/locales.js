(function () {
  "use strict";

  const en = {
    label:"English",title:"Signal Veil",language:"Language",loading:"Calibrating neural vision…",
    posterAlt:"Spark Paw Fia reveals a Lizard Commander with a neural-vision device",
    kicker:"2042 · FIRST CONTACT",summary:"Explore a connected town, forest, and laboratory. Expose hidden threats and defeat the first Lizard Commander.",start:"Start Game",
    guideTitle:"Field Guide",guideOverviewTitle:"Mission",
    guideOverview:"In 2042, disappearances and attacks are spreading across Earth. Spark Paw Fia arrives in Signal Town after a video of a Lizard Person is dismissed as a fake. Explore the town, follow ten witnesses, cross the moonlit forest, and enter the abandoned neural laboratory. This release is one connected first chapter with no stage selection: your position, level, equipment, quests, opened chests, defeated monsters, and story checkpoints remain in this browser.",
    guideControlsTitle:"Controls and combat",guideControls:"On desktop, move with WASD or the arrow keys. Fia always faces the last movement direction. Press Space or J for a forward melee strike, K for a ranged signal bolt, V to switch Neural Vision after Orla lends the prototype lens, E to talk or open a nearby chest, and Escape for the menu. On mobile, drag the left joystick and use Attack, Skill, and Vision. Enemies patrol, chase when they notice Fia, and attack at close range. The Commander changes patterns as its health falls.",
    guideVisionTitle:"Neural Vision",guideVision:"Normal Vision shows the world as most people perceive it. True Vision reveals cyan hidden routes, disguised Lizard People, cloaked monsters, secret doors, and treasures. The prototype lens drains no resource, so switch whenever the trail seems blocked. Some threats exist in both views but only become targetable when revealed. The final Commander drops a stable device that explains why ordinary people can appear human even when their true form never changed.",
    guideProgressTitle:"Growth and equipment",guideProgress:"Defeat the fifteen field monsters to earn experience. Each level raises maximum health, attack, and defense automatically, keeping the role-playing system readable during real-time play. Three hidden chests contain the Pulse Blade, Ranger Armor, and Signal Charm. Equipment applies immediately and remains in the local save. The Skill bolt has a short cooldown and rewards spacing; the melee attack is faster and stronger when you can safely close the distance.",
    guideWinTitle:"Success, failure, and saves",guideWin:"The chapter succeeds when the first Lizard Commander is defeated and its device is recovered. If Fia loses all health, the investigation resumes from the last safe checkpoint with permanent level, equipment, quests, and defeated major targets preserved. Meaningful changes save automatically; ordinary movement does not write storage. No account is required. Progress stays on this device in browser storage; clearing site data or changing browsers or devices can remove or separate the save.",
    guideTipsTitle:"Field tips",guideTips:"Talk to every marked witness before forcing the forest gate. Watch enemy alert rings and pull one patrol away from a group. Use the ranged Skill on brutes and neural casters, then attack while they recover. Toggle True Vision near cyan sparks, suspicious walls, and NPCs whose dialogue changes. Search side clearings for chests before entering the laboratory. Against the Commander, keep moving during projectile volleys, dodge the line charge, and punish the short stunned window.",
    guideFaqTitle:"FAQ",guideFaq:"The first release contains one town, one forest, one laboratory, ten NPCs, fifteen monsters, one multi-pattern boss, three equipment pieces, leveling, local saving, touch controls, keyboard controls, and the Neural Vision mechanic. A normal first playthrough is designed for roughly 30–60 minutes, while experienced action players may finish sooner. Town, forest, and laboratory are continuous regions rather than stages. Future chapters can extend the same reusable world, quest, enemy, equipment, dialogue, save, and vision systems toward the mountain, military base, ruins, and Moon Base.",
    menu:"Menu",level:"LV",normalVision:"Normal",trueVision:"True Vision",skill:"Skill",attack:"Attack",continue:"Continue",paused:"Investigation paused",resume:"Resume",equipment:"Equipment",save:"Save",returnMain:"Return to Main",weapon:"Weapon",armor:"Armor",accessory:"Accessory",back:"Back",
    leaveTitle:"Leave the investigation?",leaveText:"Your last checkpoint and permanent progress are safe.",demoComplete:"CHAPTER COMPLETE",resultTitle:"The veil is broken.",bossQuote:"“We are not invading.”",resultText:"The Commander's device exposes hidden Lizard People among ordinary humans. The signal points beyond Earth.",ending:"Earth was only the beginning.",explore:"Continue Exploring",newGame:"New Investigation",
    zoneTown:"Signal Town",zoneForest:"Veilwood Forest",zoneLab:"Neural Laboratory",
    objectiveTalk:"Speak with Orla in the town square.",objectiveWitnesses:"Question the ten town witnesses ({n}/10).",objectiveForest:"Follow the cyan trail and defeat the forest patrols ({n}/8).",objectiveLab:"Enter the laboratory and clear its guards ({n}/15).",objectiveBoss:"Confront the Lizard Commander.",objectiveComplete:"Explore freely. The stable device now reveals every secret.",
    interact:"Press E to interact",visionUnlocked:"Prototype Neural Vision unlocked. Press V.",visionOn:"True Vision enabled.",visionOff:"Normal Vision restored.",skillReady:"Skill ready",skillCooldown:"Skill recharging",levelUp:"Level {n}! Health, attack, and defense increased.",defeated:"Fia recovered at the last safe checkpoint.",saved:"Investigation saved.",chest:"Equipment acquired: {item}",lockedForest:"The forest gate opens after every witness is questioned.",lockedLab:"A hidden laboratory door appears only in True Vision.",bossAppears:"COMMANDER: You followed a signal you do not understand.",weaponName:"Pulse Blade",armorName:"Ranger Armor",accessoryName:"Signal Charm",none:"Not found",statHp:"Health",statAtk:"Attack",statDef:"Defense",talk:"Talk",
    npcNames:["Moon Cap Orla","Mayor Vale","Dr. Imani","Captain Rook","Reporter Mina","Mechanic Sol","Nurse Aya","Archivist Chen","Ranger Tomás","Cadet Noor"],
    npcLines:[
      "The videos are real, Fia. Take my prototype lens. It reveals interference patterns the eye cannot.",
      "People vanish near the east forest, but panic would ruin this town. Please be discreet.",
      "Every witness remembers the same blue pulse. That is not a coincidence.",
      "My patrol found claw marks, yet the cameras recorded ordinary officers.",
      "I uploaded the footage. Every network called it synthetic within minutes.",
      "The signal burns out machines without touching their batteries.",
      "Some patients describe two faces occupying the same space.",
      "Old maps show a laboratory beneath the forest, erased from every new record.",
      "The cyan mushrooms point east only when your strange lens is active.",
      "I saw the mayor's shadow blink before he did. I have trusted no one since."
    ]
  };

  const zhHant = {...en,
    label:"繁體中文",title:"訊號帷幕",language:"語言",loading:"正在校準神經視界……",posterAlt:"火花狐菲雅以神經視界裝置揭露蜥蜴指揮官",
    kicker:"2042 · 第一次接觸",summary:"探索相連的城鎮、森林與實驗室，揭露隱藏威脅並擊敗第一名蜥蜴指揮官。",start:"開始遊戲",
    guideTitle:"調查指南",guideOverviewTitle:"任務",guideOverview:"2042 年，地球各地接連發生失蹤與襲擊事件。火花狐菲雅來到訊號鎮，一段蜥蜴人影片卻被所有人視為造假。調查十名目擊者、穿越月光森林並進入廢棄神經實驗室。本作首發章節是一個沒有選關畫面的相連世界；位置、等級、裝備、任務、寶箱、怪物與劇情進度都會儲存在此瀏覽器。",
    guideControlsTitle:"操作與戰鬥",guideControls:"桌面使用 WASD 或方向鍵移動，菲雅永遠朝向最後移動方向。Space 或 J 向前近戰，K 發射訊號彈，取得奧拉的原型鏡片後用 V 切換神經視界，E 交談或開啟鄰近寶箱，Escape 開啟選單。手機以左側虛擬搖桿移動，並使用攻擊、技能、視界按鈕。敵人會巡邏、追擊與近身攻擊；指揮官會隨生命下降改變攻擊模式。",
    guideVisionTitle:"神經視界",guideVision:"普通視界呈現大多數人所感知的世界；真實視界會揭露青色隱藏路徑、偽裝蜥蜴人、隱形怪物、秘密門與寶藏。原型鏡片不消耗資源，遇到阻路時可隨時切換。有些威脅存在於兩種視界，卻只有被揭露後才能成為目標。最終指揮官掉落的穩定裝置，證明對方並未改變外貌，而是干擾了人類視覺。",
    guideProgressTitle:"成長與裝備",guideProgress:"擊敗十五隻場景怪物獲得經驗值。升級會自動提高最大生命、攻擊與防禦，讓即時戰鬥中的角色扮演系統保持清楚。三個隱藏寶箱分別裝有脈衝刃、遊俠護甲與訊號護符，取得後立即生效並寫入本機存檔。技能彈有短冷卻，適合拉開距離；近戰則更快，安全貼近時傷害更高。",
    guideWinTitle:"完成、失敗與存檔",guideWin:"擊敗第一名蜥蜴指揮官並取得裝置即可完成章節。菲雅生命歸零時，會從最近的安全檢查點恢復；永久等級、裝備、任務與主要擊破紀錄仍會保留。重要資料變動會自動存檔，普通移動不會反覆寫入。本作不需要帳號，進度只存在此裝置的瀏覽器儲存空間；清除網站資料或改用其他瀏覽器、裝置可能失去或分開存檔。",
    guideTipsTitle:"調查訣竅",guideTips:"打開森林門前先和每位標記目擊者交談。觀察敵人的警戒範圍，一次引開一支巡邏。對重裝兵與神經術士先用遠程技能，再趁恢復空檔進攻。青色火花、可疑牆面或 NPC 對話改變時切換真實視界。進實驗室前搜尋支路寶箱。面對指揮官的彈幕要持續移動，閃過直線衝鋒，再把握短暫暈眩窗口反擊。",
    guideFaqTitle:"常見問題",guideFaq:"首發版本包含一座城鎮、一片森林、一間實驗室、十名 NPC、十五隻怪物、一名多模式頭目、三件裝備、升級、本機存檔、觸控、鍵盤操作與神經視界。一般首輪約需 30–60 分鐘，熟練動作玩家可能更快。三個地區是連續世界而非關卡。未來可沿用相同的世界、任務、敵人、裝備、對話、存檔與視界系統，擴展至山區、軍事基地、遺跡與月球基地。",
    menu:"選單",level:"等級",normalVision:"普通",trueVision:"真實視界",skill:"技能",attack:"攻擊",continue:"繼續",paused:"調查已暫停",resume:"繼續調查",equipment:"裝備",save:"儲存",returnMain:"返回主畫面",weapon:"武器",armor:"護甲",accessory:"飾品",back:"返回",
    leaveTitle:"離開調查？",leaveText:"最近檢查點與永久進度都已保留。",demoComplete:"章節完成",resultTitle:"帷幕已被揭開。",bossQuote:"「我們不是來入侵的。」",resultText:"指揮官的裝置讓藏在人類之中的蜥蜴人顯形，訊號則指向地球之外。",ending:"地球只是一個開始。",explore:"繼續探索",newGame:"重新調查",
    zoneTown:"訊號鎮",zoneForest:"帷幕森林",zoneLab:"神經實驗室",objectiveTalk:"前往城鎮廣場與奧拉交談。",objectiveWitnesses:"詢問十名城鎮目擊者（{n}/10）。",objectiveForest:"沿青色軌跡前進並擊敗森林巡邏（{n}/8）。",objectiveLab:"進入實驗室並清除守衛（{n}/15）。",objectiveBoss:"迎戰蜥蜴指揮官。",objectiveComplete:"自由探索；穩定裝置已能揭露所有秘密。",
    interact:"按 E 互動",visionUnlocked:"已解鎖原型神經視界，按 V 切換。",visionOn:"真實視界已啟用。",visionOff:"已恢復普通視界。",skillReady:"技能已就緒",skillCooldown:"技能冷卻中",levelUp:"升到 {n} 級！生命、攻擊與防禦提升。",defeated:"菲雅已在最近安全檢查點恢復。",saved:"調查進度已儲存。",chest:"獲得裝備：{item}",lockedForest:"詢問所有目擊者後，森林門才會開啟。",lockedLab:"只有真實視界能看見隱藏的實驗室入口。",bossAppears:"指揮官：你追逐著自己不了解的訊號。",weaponName:"脈衝刃",armorName:"遊俠護甲",accessoryName:"訊號護符",none:"尚未找到",statHp:"生命",statAtk:"攻擊",statDef:"防禦",talk:"交談",
    npcNames:["月帽貓頭鷹奧拉","維爾鎮長","伊曼尼博士","魯克上尉","記者米娜","技師索爾","護理師彩","檔案員陳","巡林員托馬斯","學員努爾"],
    npcLines:["影片是真的，菲雅。帶上我的原型鏡片，它能揭露肉眼看不見的干擾。","東側森林附近一直有人失蹤，但恐慌會摧毀這座鎮，請低調調查。","每位目擊者都記得同一道藍色脈衝，絕非巧合。","巡邏隊找到爪痕，攝影機卻只拍到普通軍官。","我上傳了影片，所有平台幾分鐘內都說它是合成的。","訊號會燒壞機器，電池卻完全沒事。","有些病患說，同一個位置同時存在兩張臉。","舊地圖顯示森林下方有實驗室，新紀錄卻全部刪除了它。","只有鏡片啟用時，青色菇群才會指向東方。","我看到鎮長的影子比本人早眨眼。從此我不再相信任何人。"]
  };

  const zhHans={...zhHant,label:"简体中文",title:"信号帷幕",language:"语言",loading:"正在校准神经视界……",posterAlt:"火花狐菲雅用神经视界装置揭露蜥蜴指挥官",summary:"探索相连的城镇、森林与实验室，揭露隐藏威胁并击败第一名蜥蜴指挥官。",start:"开始游戏",guideTitle:"调查指南",menu:"菜单",normalVision:"普通",trueVision:"真实视界",attack:"攻击",continue:"继续",paused:"调查已暂停",resume:"继续调查",equipment:"装备",save:"保存",returnMain:"返回主画面",weapon:"武器",armor:"护甲",accessory:"饰品",back:"返回",leaveTitle:"离开调查？",demoComplete:"章节完成",resultTitle:"帷幕已被揭开。",bossQuote:"“我们不是来入侵的。”",resultText:"指挥官的装置让藏在人类之中的蜥蜴人显形，信号则指向地球之外。",ending:"地球只是一个开始。",explore:"继续探索",newGame:"重新调查",zoneTown:"信号镇",zoneForest:"帷幕森林",zoneLab:"神经实验室",objectiveTalk:"前往城镇广场与奥拉交谈。",objectiveWitnesses:"询问十名城镇目击者（{n}/10）。",objectiveForest:"沿青色轨迹前进并击败森林巡逻（{n}/8）。",objectiveLab:"进入实验室并清除守卫（{n}/15）。",objectiveBoss:"迎战蜥蜴指挥官。",objectiveComplete:"自由探索；稳定装置已能揭露所有秘密。",interact:"按 E 互动",visionUnlocked:"已解锁原型神经视界，按 V 切换。",visionOn:"真实视界已启用。",visionOff:"已恢复普通视界。",levelUp:"升到 {n} 级！生命、攻击与防御提升。",defeated:"菲雅已在最近安全检查点恢复。",saved:"调查进度已保存。",chest:"获得装备：{item}",lockedForest:"询问所有目击者后，森林门才会开启。",lockedLab:"只有真实视界能看见隐藏的实验室入口。",bossAppears:"指挥官：你追逐着自己不了解的信号。",weaponName:"脉冲刃",armorName:"游侠护甲",accessoryName:"信号护符",none:"尚未找到",statHp:"生命",statAtk:"攻击",statDef:"防御",talk:"交谈"};

  const ja={...en,label:"日本語",title:"シグナル・ヴェール",language:"言語",loading:"ニューラルビジョンを調整中…",posterAlt:"装置でリザード司令官を暴くスパークポー・フィア",kicker:"2042・ファーストコンタクト",summary:"つながった町、森、研究所を探索し、隠れた脅威を暴いて最初のリザード司令官を倒そう。",start:"ゲーム開始",guideTitle:"調査ガイド",guideOverviewTitle:"任務",guideOverview:"2042年、失踪と襲撃が地球各地で続発する。スパークポー・フィアは偽物扱いされたリザード人の映像を追ってシグナルタウンへ来た。十人の証言を集め、月夜の森を抜け、放棄された神経研究所へ入ろう。本作はステージ選択のない連続世界で、位置、レベル、装備、任務、宝箱、敵、物語の進行をこのブラウザに保存する。",guideControlsTitle:"操作と戦闘",guideControls:"PCはWASDまたは矢印キーで移動。Space/Jで正面近接攻撃、Kで遠距離弾、Vでビジョン切替、Eで会話や宝箱、Escapeでメニュー。モバイルは左スティックと攻撃・スキル・ビジョンボタンを使う。敵は巡回、追跡、近接攻撃を行い、司令官は体力に応じて攻撃を変える。",guideVisionTitle:"ニューラルビジョン",guideVision:"通常視界は人々が認識する世界を映す。真実視界は隠し道、偽装したリザード人、透明な敵、秘密の扉、宝をシアンで示す。試作レンズは資源を消費しない。司令官の安定装置は、相手が変身したのではなく、人間の視覚が干渉されていた事実を示す。",guideProgressTitle:"成長と装備",guideProgress:"十五体の敵を倒して経験値を得る。レベルアップで最大体力、攻撃、防御が上がる。三つの隠し宝箱にはパルスブレード、レンジャーアーマー、シグナルチャームがあり、取得すると即座に装備され保存される。遠距離スキルには短いクールダウンがあり、近接は素早く強い。",guideWinTitle:"成功・失敗・保存",guideWin:"最初のリザード司令官を倒し装置を回収すると章クリア。体力がゼロでも安全なチェックポイントから復帰し、レベル、装備、任務、主要撃破は残る。アカウント不要で保存先はこの端末のブラウザ。サイトデータ削除や端末変更で失われる場合がある。",guideTipsTitle:"調査のコツ",guideTips:"森の門を開く前に全員と話そう。警戒範囲を見て一体ずつ誘い出す。重装兵や術士にはスキルを当てて隙を攻める。シアンの火花、怪しい壁、変化する会話では真実視界を使う。司令官の弾幕中は動き続け、突進を避け、気絶中に反撃しよう。",guideFaqTitle:"FAQ",guideFaq:"初回版には町一つ、森一つ、研究所一つ、NPC十人、敵十五体、複数パターンのボス一体、装備三種、レベル、ローカル保存、タッチとキーボード、ニューラルビジョンが含まれる。想定プレイ時間は30〜60分。三地域はステージではなく連続世界で、将来は同じ再利用可能な仕組みで山、軍事基地、遺跡、月面基地へ拡張できる。",menu:"メニュー",level:"LV",normalVision:"通常",trueVision:"真実視界",skill:"スキル",attack:"攻撃",continue:"続ける",paused:"調査を一時停止",resume:"再開",equipment:"装備",save:"保存",returnMain:"メインへ戻る",weapon:"武器",armor:"防具",accessory:"アクセサリー",back:"戻る",leaveTitle:"調査を離れますか？",leaveText:"チェックポイントと永続進行は保存されています。",demoComplete:"チャプタークリア",resultTitle:"幕は破られた。",bossQuote:"「我々は侵略者ではない。」",resultText:"司令官の装置が人間に紛れたリザード人を映し、信号は地球外を指した。",ending:"地球は始まりにすぎない。",explore:"探索を続ける",newGame:"新しい調査",zoneTown:"シグナルタウン",zoneForest:"ヴェールウッド",zoneLab:"神経研究所",objectiveTalk:"町の広場でオーラと話す。",objectiveWitnesses:"町の証人十人に聞く（{n}/10）。",objectiveForest:"シアンの道を追い森の敵を倒す（{n}/8）。",objectiveLab:"研究所に入り警備を倒す（{n}/15）。",objectiveBoss:"リザード司令官と対決する。",objectiveComplete:"自由探索。安定装置が全ての秘密を示す。",interact:"Eで調べる",visionUnlocked:"試作ニューラルビジョン解放。Vで切替。",visionOn:"真実視界オン。",visionOff:"通常視界に復帰。",skillReady:"スキル準備完了",skillCooldown:"スキル再充填中",levelUp:"レベル{n}！体力・攻撃・防御上昇。",defeated:"安全なチェックポイントで復帰した。",saved:"調査を保存した。",chest:"装備入手：{item}",lockedForest:"全ての証人から話を聞くと門が開く。",lockedLab:"研究所の入口は真実視界でのみ見える。",bossAppears:"司令官：理解できぬ信号を追って来たか。",weaponName:"パルスブレード",armorName:"レンジャーアーマー",accessoryName:"シグナルチャーム",none:"未発見",statHp:"体力",statAtk:"攻撃",statDef:"防御",talk:"話す"};

  const ko={...ja,label:"한국어",title:"시그널 베일",language:"언어",loading:"뉴럴 비전 보정 중…",posterAlt:"뉴럴 비전 장치로 리자드 지휘관을 드러내는 스파크 포 피아",kicker:"2042 · 첫 접촉",summary:"이어진 마을, 숲, 연구소를 탐험하고 숨은 위협을 밝혀 첫 리자드 지휘관을 쓰러뜨리세요.",start:"게임 시작",guideTitle:"조사 안내서",guideOverviewTitle:"임무",guideOverview:"2042년, 실종과 습격이 지구 곳곳에서 이어집니다. 조작 영상으로 치부된 리자드 피플 영상을 따라 스파크 포 피아가 시그널 타운에 도착합니다. 열 명의 증언을 모으고 달빛 숲을 지나 버려진 신경 연구소로 들어가세요. 이 첫 장은 스테이지 선택이 없는 연결 세계이며 위치, 레벨, 장비, 임무와 이야기 진행을 브라우저에 저장합니다.",guideControlsTitle:"조작과 전투",guideControls:"PC에서는 WASD나 방향키로 이동하고 Space/J로 근접 공격, K로 원거리 스킬, V로 비전 전환, E로 대화와 상자, Escape로 메뉴를 엽니다. 모바일은 왼쪽 조이스틱과 공격, 스킬, 비전 버튼을 사용합니다. 적은 순찰하고 추격하며 가까이서 공격하고, 지휘관은 체력에 따라 패턴을 바꿉니다.",guideVisionTitle:"뉴럴 비전",guideVision:"일반 시야는 사람들이 인식하는 세계를 보여 줍니다. 진실 시야는 숨은 길, 위장한 리자드 피플, 투명 괴물, 비밀 문과 보물을 청록빛으로 드러냅니다. 시제품 렌즈는 자원을 소모하지 않습니다. 최종 장치는 적이 변신한 것이 아니라 인간의 시각이 방해받았음을 증명합니다.",guideProgressTitle:"성장과 장비",guideProgress:"열다섯 몬스터를 처치해 경험치를 얻습니다. 레벨이 오르면 최대 체력, 공격, 방어가 함께 증가합니다. 숨은 상자 세 개에는 펄스 블레이드, 레인저 아머, 시그널 참이 있으며 즉시 적용되고 저장됩니다. 스킬에는 짧은 재사용 시간이 있고 근접 공격은 빠르고 강합니다.",guideWinTitle:"성공, 실패, 저장",guideWin:"첫 리자드 지휘관을 쓰러뜨리고 장치를 회수하면 장을 완료합니다. 체력이 0이 되면 안전 체크포인트에서 회복하며 영구 레벨, 장비, 임무와 주요 처치는 유지됩니다. 계정은 필요 없고 진행은 이 기기의 브라우저에만 저장됩니다.",guideTipsTitle:"현장 팁",guideTips:"숲 문을 열기 전에 표시된 모든 목격자와 대화하세요. 경계 범위를 보고 적을 하나씩 유인하세요. 중갑병과 술사에게 스킬을 사용하고 빈틈에 공격하세요. 청록 불꽃과 수상한 벽에서는 진실 시야를 켜세요. 지휘관의 탄막 때 계속 움직이고 돌진을 피한 뒤 기절 틈을 노리세요.",guideFaqTitle:"FAQ",guideFaq:"첫 출시에는 마을 하나, 숲 하나, 연구소 하나, NPC 열 명, 몬스터 열다섯, 다중 패턴 보스 하나, 장비 세 개, 레벨, 로컬 저장, 터치와 키보드, 뉴럴 비전이 포함됩니다. 첫 플레이는 약 30~60분입니다. 세 지역은 스테이지가 아닌 연속 세계이며 같은 재사용 시스템으로 산, 군사 기지, 유적, 달 기지까지 확장할 수 있습니다.",menu:"메뉴",normalVision:"일반",trueVision:"진실 시야",skill:"스킬",attack:"공격",continue:"계속",paused:"조사 일시 정지",resume:"재개",equipment:"장비",save:"저장",returnMain:"메인으로",weapon:"무기",armor:"방어구",accessory:"장신구",back:"뒤로",leaveTitle:"조사를 나갈까요?",leaveText:"체크포인트와 영구 진행은 안전합니다.",demoComplete:"챕터 완료",resultTitle:"장막이 깨졌다.",bossQuote:"“우리는 침략하러 온 것이 아니다.”",resultText:"지휘관의 장치가 인간 속 리자드 피플을 드러내고 신호는 지구 밖을 향합니다.",ending:"지구는 시작일 뿐이었다.",explore:"계속 탐험",newGame:"새 조사",zoneTown:"시그널 타운",zoneForest:"베일우드 숲",zoneLab:"신경 연구소",objectiveTalk:"광장에서 오를라와 대화하세요.",objectiveWitnesses:"목격자 열 명 조사 ({n}/10).",objectiveForest:"청록 흔적을 따라 숲 순찰 처치 ({n}/8).",objectiveLab:"연구소 경비 제거 ({n}/15).",objectiveBoss:"리자드 지휘관과 대결하세요.",objectiveComplete:"자유 탐험. 안정 장치가 모든 비밀을 드러냅니다.",interact:"E로 상호작용",visionUnlocked:"시제품 뉴럴 비전 해제. V로 전환.",visionOn:"진실 시야 활성화.",visionOff:"일반 시야 복구.",levelUp:"레벨 {n}! 체력, 공격, 방어 증가.",defeated:"안전 체크포인트에서 회복했습니다.",saved:"조사를 저장했습니다.",chest:"장비 획득: {item}",lockedForest:"모든 목격자와 대화하면 문이 열립니다.",lockedLab:"진실 시야에서만 연구소 입구가 보입니다.",bossAppears:"지휘관: 이해하지 못하는 신호를 쫓아왔군.",weaponName:"펄스 블레이드",armorName:"레인저 아머",accessoryName:"시그널 참",none:"미발견",statHp:"체력",statAtk:"공격",statDef:"방어",talk:"대화"};

  const es={...en,label:"Español",title:"Velo de Señal",language:"Idioma",loading:"Calibrando la visión neural…",posterAlt:"Spark Paw Fia revela a un comandante lagarto con visión neural",kicker:"2042 · PRIMER CONTACTO",summary:"Explora un pueblo, un bosque y un laboratorio conectados. Revela amenazas ocultas y derrota al primer comandante lagarto.",start:"Iniciar juego",guideTitle:"Guía de campo",guideOverviewTitle:"Misión",guideOverview:"En 2042, las desapariciones y los ataques se extienden por la Tierra. Spark Paw Fia llega a Pueblo Señal tras ver cómo un vídeo de una persona lagarto se descarta como falso. Interroga a diez testigos, cruza el bosque lunar y entra en el laboratorio neural abandonado. Este primer capítulo es un mundo conectado sin selección de fases; posición, nivel, equipo, misiones, cofres, enemigos y progreso se guardan en este navegador.",guideControlsTitle:"Controles y combate",guideControls:"En escritorio, muévete con WASD o las flechas. Space/J ataca cuerpo a cuerpo, K lanza un proyectil, V cambia la visión, E habla o abre cofres y Escape abre el menú. En móvil, usa el joystick izquierdo y los botones Ataque, Habilidad y Visión. Los enemigos patrullan, persiguen y atacan de cerca; el comandante cambia de patrón al perder salud.",guideVisionTitle:"Visión neural",guideVision:"La visión normal muestra el mundo que la mayoría percibe. La visión real revela rutas cian, personas lagarto disfrazadas, monstruos ocultos, puertas secretas y tesoros. La lente prototipo no consume recursos. El dispositivo estable del comandante demuestra que nunca cambiaron de aspecto: interfirieron con la percepción humana.",guideProgressTitle:"Progreso y equipo",guideProgress:"Derrota a quince monstruos para ganar EXP. Cada nivel aumenta salud máxima, ataque y defensa. Tres cofres esconden la Hoja de Pulso, la Armadura de Explorador y el Amuleto de Señal; se equipan y guardan al instante. El disparo tiene una recarga breve y el golpe cercano es más rápido y potente.",guideWinTitle:"Éxito, derrota y guardado",guideWin:"El capítulo termina al vencer al primer comandante lagarto y recuperar el dispositivo. Si Fia pierde toda la salud, vuelve al último punto seguro conservando nivel, equipo, misiones y objetivos principales. No se requiere cuenta. El progreso vive en el almacenamiento de este navegador y puede perderse al borrar datos o cambiar de dispositivo.",guideTipsTitle:"Consejos",guideTips:"Habla con cada testigo antes de forzar la puerta del bosque. Observa los radios de alerta y atrae una patrulla cada vez. Usa el disparo contra brutos y lanzadores, y ataca durante su recuperación. Activa la visión real cerca de chispas cian y muros sospechosos. Contra el comandante, muévete durante las salvas, esquiva la carga y castiga su breve aturdimiento.",guideFaqTitle:"Preguntas frecuentes",guideFaq:"La primera versión incluye un pueblo, un bosque, un laboratorio, diez PNJ, quince monstruos, un jefe con varios patrones, tres piezas de equipo, niveles, guardado local, controles táctiles y teclado, y visión neural. La primera partida dura unos 30–60 minutos. Las regiones son continuas, no fases. Los mismos sistemas reutilizables podrán ampliar el mundo hacia la montaña, la base militar, las ruinas y la base lunar.",menu:"Menú",level:"NV",normalVision:"Normal",trueVision:"Visión real",skill:"Habilidad",attack:"Ataque",continue:"Continuar",paused:"Investigación en pausa",resume:"Reanudar",equipment:"Equipo",save:"Guardar",returnMain:"Volver al inicio",weapon:"Arma",armor:"Armadura",accessory:"Accesorio",back:"Atrás",leaveTitle:"¿Salir de la investigación?",leaveText:"El punto seguro y el progreso permanente están guardados.",demoComplete:"CAPÍTULO COMPLETO",resultTitle:"El velo se ha roto.",bossQuote:"«No estamos invadiendo».",resultText:"El dispositivo revela personas lagarto entre humanos normales. La señal apunta más allá de la Tierra.",ending:"La Tierra era solo el principio.",explore:"Seguir explorando",newGame:"Nueva investigación",zoneTown:"Pueblo Señal",zoneForest:"Bosque del Velo",zoneLab:"Laboratorio neural",objectiveTalk:"Habla con Orla en la plaza.",objectiveWitnesses:"Interroga a diez testigos ({n}/10).",objectiveForest:"Sigue la ruta cian y derrota patrullas ({n}/8).",objectiveLab:"Entra al laboratorio y elimina guardias ({n}/15).",objectiveBoss:"Enfrenta al comandante lagarto.",objectiveComplete:"Explora libremente. El dispositivo revela todos los secretos.",interact:"Pulsa E para interactuar",visionUnlocked:"Visión neural prototipo desbloqueada. Pulsa V.",visionOn:"Visión real activada.",visionOff:"Visión normal restaurada.",levelUp:"¡Nivel {n}! Salud, ataque y defensa aumentaron.",defeated:"Fia volvió al último punto seguro.",saved:"Investigación guardada.",chest:"Equipo obtenido: {item}",lockedForest:"La puerta se abre tras interrogar a todos.",lockedLab:"La entrada solo aparece con visión real.",bossAppears:"COMANDANTE: Sigues una señal que no comprendes.",weaponName:"Hoja de Pulso",armorName:"Armadura de Explorador",accessoryName:"Amuleto de Señal",none:"No encontrado",statHp:"Salud",statAtk:"Ataque",statDef:"Defensa",talk:"Hablar"};

  const pt={...es,label:"Português (Brasil)",title:"Véu do Sinal",language:"Idioma",loading:"Calibrando a visão neural…",posterAlt:"Spark Paw Fia revela um comandante lagarto com visão neural",kicker:"2042 · PRIMEIRO CONTATO",summary:"Explore cidade, floresta e laboratório conectados. Revele ameaças ocultas e derrote o primeiro comandante lagarto.",start:"Iniciar jogo",guideTitle:"Guia de campo",guideOverviewTitle:"Missão",guideOverview:"Em 2042, desaparecimentos e ataques se espalham pela Terra. Spark Paw Fia chega à Cidade Sinal depois que um vídeo de um povo-lagarto é tratado como falso. Converse com dez testemunhas, atravesse a floresta lunar e entre no laboratório neural abandonado. Este primeiro capítulo é um mundo contínuo sem seleção de fases; posição, nível, equipamento, missões e história ficam salvos neste navegador.",guideControlsTitle:"Controles e combate",guideControls:"No computador, mova com WASD ou setas. Space/J ataca de perto, K dispara, V alterna a visão, E conversa ou abre baús e Escape abre o menu. No celular, use o joystick esquerdo e os botões Ataque, Habilidade e Visão. Inimigos patrulham, perseguem e atacam; o comandante muda de padrão ao perder vida.",guideVisionTitle:"Visão neural",guideVision:"A visão normal mostra o mundo percebido pela maioria. A visão real revela caminhos ciano, pessoas-lagarto disfarçadas, monstros ocultos, portas secretas e tesouros. A lente protótipo não gasta recurso. O aparelho estável prova que eles nunca mudaram de forma: interferiram na percepção humana.",guideProgressTitle:"Crescimento e equipamento",guideProgress:"Derrote quinze monstros para ganhar EXP. Cada nível aumenta vida máxima, ataque e defesa. Três baús guardam Lâmina de Pulso, Armadura de Patrulha e Amuleto do Sinal; o efeito é imediato e salvo. O projétil tem recarga curta, enquanto o ataque próximo é rápido e forte.",guideWinTitle:"Vitória, derrota e salvamento",guideWin:"O capítulo termina ao derrotar o primeiro comandante e recuperar o dispositivo. Se Fia perder toda a vida, volta ao ponto seguro mantendo nível, equipamento, missões e alvos principais. Não é preciso conta. O progresso fica no armazenamento deste navegador e pode sumir ao apagar dados ou mudar de aparelho.",guideTipsTitle:"Dicas de campo",guideTips:"Fale com todas as testemunhas antes do portão. Observe o alcance de alerta e atraia um inimigo por vez. Use o disparo em brutos e conjuradores. Ative a visão real perto de faíscas ciano e paredes suspeitas. Contra o comandante, mova-se nas rajadas, desvie da investida e ataque durante o atordoamento.",guideFaqTitle:"Perguntas frequentes",guideFaq:"A primeira versão inclui uma cidade, uma floresta, um laboratório, dez NPCs, quinze monstros, um chefe de vários padrões, três equipamentos, níveis, salvamento local, toque, teclado e visão neural. A jornada dura cerca de 30–60 minutos. As regiões são contínuas, não fases. Os sistemas podem ampliar o mundo para montanha, base militar, ruínas e base lunar.",menu:"Menu",level:"NV",normalVision:"Normal",trueVision:"Visão real",skill:"Habilidade",attack:"Ataque",continue:"Continuar",paused:"Investigação pausada",resume:"Retomar",equipment:"Equipamento",save:"Salvar",returnMain:"Voltar ao início",weapon:"Arma",armor:"Armadura",accessory:"Acessório",back:"Voltar",leaveTitle:"Sair da investigação?",leaveText:"O ponto seguro e o progresso permanente estão salvos.",demoComplete:"CAPÍTULO CONCLUÍDO",resultTitle:"O véu foi rompido.",bossQuote:"“Não estamos invadindo.”",resultText:"O dispositivo revela pessoas-lagarto entre humanos comuns. O sinal aponta além da Terra.",ending:"A Terra era apenas o começo.",explore:"Continuar explorando",newGame:"Nova investigação",zoneTown:"Cidade Sinal",zoneForest:"Floresta do Véu",zoneLab:"Laboratório neural",objectiveTalk:"Fale com Orla na praça.",objectiveWitnesses:"Questione dez testemunhas ({n}/10).",objectiveForest:"Siga a trilha ciano e derrote patrulhas ({n}/8).",objectiveLab:"Entre no laboratório e elimine guardas ({n}/15).",objectiveBoss:"Enfrente o comandante lagarto.",objectiveComplete:"Explore livremente. O dispositivo revela todos os segredos.",interact:"Pressione E para interagir",visionUnlocked:"Visão neural protótipo desbloqueada. Pressione V.",visionOn:"Visão real ativada.",visionOff:"Visão normal restaurada.",levelUp:"Nível {n}! Vida, ataque e defesa aumentaram.",defeated:"Fia voltou ao último ponto seguro.",saved:"Investigação salva.",chest:"Equipamento obtido: {item}",lockedForest:"O portão abre após todas as testemunhas.",lockedLab:"A entrada só aparece na visão real.",bossAppears:"COMANDANTE: Você segue um sinal que não entende.",weaponName:"Lâmina de Pulso",armorName:"Armadura de Patrulha",accessoryName:"Amuleto do Sinal",none:"Não encontrado",statHp:"Vida",statAtk:"Ataque",statDef:"Defesa",talk:"Falar"};

  const fr={...es,label:"Français",title:"Voile du Signal",language:"Langue",loading:"Calibrage de la vision neurale…",posterAlt:"Spark Paw Fia révèle un commandant lézard grâce à la vision neurale",kicker:"2042 · PREMIER CONTACT",summary:"Explorez une ville, une forêt et un laboratoire reliés. Révélez les menaces cachées et battez le premier commandant lézard.",start:"Commencer",guideTitle:"Guide de terrain",guideOverviewTitle:"Mission",guideOverview:"En 2042, disparitions et attaques se multiplient sur Terre. Spark Paw Fia arrive à Signalville après qu’une vidéo de Lézard a été qualifiée de faux. Interrogez dix témoins, traversez la forêt au clair de lune et entrez dans le laboratoire neural abandonné. Ce premier chapitre forme un monde continu sans sélection de niveaux ; position, niveau, équipement, quêtes et histoire sont enregistrés dans ce navigateur.",guideControlsTitle:"Commandes et combat",guideControls:"Sur ordinateur, déplacez-vous avec WASD ou les flèches. Space/J attaque au corps à corps, K tire, V change de vision, E parle ou ouvre un coffre, Échap ouvre le menu. Sur mobile, utilisez le joystick gauche et les boutons Attaque, Compétence et Vision. Les ennemis patrouillent, poursuivent et frappent ; le commandant change de tactique selon sa santé.",guideVisionTitle:"Vision neurale",guideVision:"La vision normale montre le monde perçu par la majorité. La vision réelle révèle chemins cyan, Lézards déguisés, monstres invisibles, portes secrètes et trésors. La lentille prototype ne consomme rien. L’appareil stable prouve qu’ils ne changeaient pas d’apparence : ils perturbaient la perception humaine.",guideProgressTitle:"Progression et équipement",guideProgress:"Battez quinze monstres pour gagner de l’EXP. Chaque niveau augmente santé maximale, attaque et défense. Trois coffres cachent la Lame à impulsion, l’Armure d’éclaireur et le Charme du signal ; ils s’équipent et se sauvegardent immédiatement. Le tir a un court délai, tandis que l’attaque rapprochée est rapide et puissante.",guideWinTitle:"Réussite, échec et sauvegarde",guideWin:"Le chapitre est terminé lorsque le premier commandant est vaincu et son appareil récupéré. Si Fia perd toute sa santé, elle revient au point sûr en conservant niveau, équipement, quêtes et cibles majeures. Aucun compte n’est requis. La progression reste dans ce navigateur et peut disparaître si ses données sont effacées.",guideTipsTitle:"Conseils",guideTips:"Parlez à chaque témoin avant d’ouvrir la forêt. Surveillez les zones d’alerte et attirez une patrouille à la fois. Tirez sur les brutes et mages, puis frappez pendant leur récupération. Activez la vision réelle près des lueurs cyan et des murs suspects. Face au commandant, bougez pendant les salves, esquivez la charge et profitez de son étourdissement.",guideFaqTitle:"FAQ",guideFaq:"Cette première version contient une ville, une forêt, un laboratoire, dix PNJ, quinze monstres, un boss à plusieurs attaques, trois équipements, des niveaux, une sauvegarde locale, des commandes tactiles et clavier, et la vision neurale. Une première partie dure environ 30 à 60 minutes. Les régions sont continues, pas des niveaux. Les systèmes pourront étendre le monde vers la montagne, la base militaire, les ruines et la base lunaire.",menu:"Menu",level:"NV",normalVision:"Normal",trueVision:"Vision réelle",skill:"Compétence",attack:"Attaque",continue:"Continuer",paused:"Enquête en pause",resume:"Reprendre",equipment:"Équipement",save:"Sauvegarder",returnMain:"Retour à l’accueil",weapon:"Arme",armor:"Armure",accessory:"Accessoire",back:"Retour",leaveTitle:"Quitter l’enquête ?",leaveText:"Le point sûr et la progression permanente sont sauvegardés.",demoComplete:"CHAPITRE TERMINÉ",resultTitle:"Le voile est brisé.",bossQuote:"« Nous n’envahissons pas. »",resultText:"L’appareil révèle les Lézards cachés parmi les humains. Le signal pointe au-delà de la Terre.",ending:"La Terre n’était que le début.",explore:"Continuer l’exploration",newGame:"Nouvelle enquête",zoneTown:"Signalville",zoneForest:"Forêt du Voile",zoneLab:"Laboratoire neural",objectiveTalk:"Parlez à Orla sur la place.",objectiveWitnesses:"Interrogez dix témoins ({n}/10).",objectiveForest:"Suivez la piste cyan et battez les patrouilles ({n}/8).",objectiveLab:"Entrez au laboratoire et éliminez les gardes ({n}/15).",objectiveBoss:"Affrontez le commandant lézard.",objectiveComplete:"Explorez librement. L’appareil révèle tous les secrets.",interact:"Appuyez sur E pour interagir",visionUnlocked:"Vision neurale prototype débloquée. Appuyez sur V.",visionOn:"Vision réelle activée.",visionOff:"Vision normale restaurée.",levelUp:"Niveau {n} ! Santé, attaque et défense augmentées.",defeated:"Fia revient au dernier point sûr.",saved:"Enquête sauvegardée.",chest:"Équipement obtenu : {item}",lockedForest:"La porte s’ouvre après tous les témoignages.",lockedLab:"L’entrée apparaît seulement en vision réelle.",bossAppears:"COMMANDANT : Vous suivez un signal incompris.",weaponName:"Lame à impulsion",armorName:"Armure d’éclaireur",accessoryName:"Charme du signal",none:"Introuvable",statHp:"Santé",statAtk:"Attaque",statDef:"Défense",talk:"Parler"};

  const de={...en,label:"Deutsch",title:"Signal-Schleier",language:"Sprache",loading:"Neuralsicht wird kalibriert…",posterAlt:"Spark Paw Fia enttarnt einen Echsenkommandanten mit Neuralsicht",kicker:"2042 · ERSTER KONTAKT",summary:"Erkunde verbundene Stadt-, Wald- und Laborgebiete. Enthülle versteckte Gefahren und besiege den ersten Echsenkommandanten.",start:"Spiel starten",guideTitle:"Feldhandbuch",guideOverviewTitle:"Mission",guideOverview:"Im Jahr 2042 breiten sich Verschwinden und Angriffe über die Erde aus. Spark Paw Fia kommt nach Signalstadt, nachdem ein Video eines Echsenmenschen als Fälschung abgetan wurde. Befrage zehn Zeugen, durchquere den mondhellen Wald und betrete das verlassene Neurallabor. Dieses erste Kapitel ist eine verbundene Welt ohne Levelauswahl; Position, Stufe, Ausrüstung, Aufträge und Geschichte werden in diesem Browser gespeichert.",guideControlsTitle:"Steuerung und Kampf",guideControls:"Am Desktop bewegst du dich mit WASD oder Pfeiltasten. Space/J führt einen Nahkampfangriff aus, K feuert, V wechselt die Sicht, E spricht oder öffnet Truhen und Escape öffnet das Menü. Mobil nutzt du Joystick, Angriff, Fähigkeit und Sicht. Gegner patrouillieren, verfolgen und greifen an; der Kommandant wechselt sein Muster mit sinkender Gesundheit.",guideVisionTitle:"Neuralsicht",guideVision:"Normale Sicht zeigt die Welt, wie die meisten Menschen sie wahrnehmen. Wahre Sicht enthüllt cyanfarbene Wege, getarnte Echsenmenschen, unsichtbare Monster, Geheimtüren und Schätze. Die Prototyplinse verbraucht nichts. Das stabile Gerät beweist, dass sie nie ihre Form änderten, sondern die menschliche Wahrnehmung störten.",guideProgressTitle:"Fortschritt und Ausrüstung",guideProgress:"Besiege fünfzehn Monster für EP. Jede Stufe erhöht maximale Gesundheit, Angriff und Verteidigung. Drei Truhen enthalten Impulsklinge, Ranger-Rüstung und Signal-Amulett; sie werden sofort angelegt und gespeichert. Der Fernschuss hat eine kurze Abklingzeit, der Nahkampf ist schneller und stärker.",guideWinTitle:"Erfolg, Scheitern und Speichern",guideWin:"Das Kapitel endet, wenn der erste Kommandant besiegt und sein Gerät geborgen ist. Verliert Fia alle Gesundheit, kehrt sie zum sicheren Kontrollpunkt zurück und behält Stufe, Ausrüstung, Aufträge und wichtige Siege. Kein Konto nötig. Der Fortschritt liegt nur im Browserspeicher dieses Geräts.",guideTipsTitle:"Feldtipps",guideTips:"Sprich vor dem Waldtor mit allen Zeugen. Beobachte Alarmbereiche und locke Gegner einzeln. Nutze den Schuss gegen schwere Gegner und Wirker. Aktiviere Wahre Sicht bei cyanfarbenen Funken und verdächtigen Wänden. Bleib während der Salven des Kommandanten in Bewegung, weiche dem Ansturm aus und greife im Betäubungsfenster an.",guideFaqTitle:"FAQ",guideFaq:"Die erste Version enthält eine Stadt, einen Wald, ein Labor, zehn NPCs, fünfzehn Monster, einen Boss mit mehreren Mustern, drei Ausrüstungsteile, Stufen, lokales Speichern, Touch- und Tastatursteuerung sowie Neuralsicht. Die erste Runde dauert etwa 30–60 Minuten. Die Regionen sind eine fortlaufende Welt. Dieselben Systeme können später Berg, Militärbasis, Ruinen und Mondbasis ergänzen.",menu:"Menü",level:"ST",normalVision:"Normal",trueVision:"Wahre Sicht",skill:"Fähigkeit",attack:"Angriff",continue:"Weiter",paused:"Ermittlung pausiert",resume:"Fortsetzen",equipment:"Ausrüstung",save:"Speichern",returnMain:"Zum Hauptmenü",weapon:"Waffe",armor:"Rüstung",accessory:"Zubehör",back:"Zurück",leaveTitle:"Ermittlung verlassen?",leaveText:"Kontrollpunkt und dauerhafter Fortschritt sind gespeichert.",demoComplete:"KAPITEL ABGESCHLOSSEN",resultTitle:"Der Schleier ist gebrochen.",bossQuote:"„Wir greifen nicht an.“",resultText:"Das Gerät zeigt Echsenmenschen unter normalen Menschen. Das Signal weist über die Erde hinaus.",ending:"Die Erde war nur der Anfang.",explore:"Weiter erkunden",newGame:"Neue Ermittlung",zoneTown:"Signalstadt",zoneForest:"Schleierwald",zoneLab:"Neurallabor",objectiveTalk:"Sprich auf dem Platz mit Orla.",objectiveWitnesses:"Befrage zehn Zeugen ({n}/10).",objectiveForest:"Folge der Cyan-Spur und besiege Patrouillen ({n}/8).",objectiveLab:"Betritt das Labor und besiege Wachen ({n}/15).",objectiveBoss:"Stelle dich dem Echsenkommandanten.",objectiveComplete:"Freie Erkundung. Das stabile Gerät zeigt alle Geheimnisse.",interact:"E zum Interagieren",visionUnlocked:"Prototyp-Neuralsicht freigeschaltet. V drücken.",visionOn:"Wahre Sicht aktiviert.",visionOff:"Normale Sicht wiederhergestellt.",levelUp:"Stufe {n}! Gesundheit, Angriff und Verteidigung erhöht.",defeated:"Fia erholt sich am letzten sicheren Punkt.",saved:"Ermittlung gespeichert.",chest:"Ausrüstung erhalten: {item}",lockedForest:"Das Tor öffnet nach allen Zeugenaussagen.",lockedLab:"Der Eingang erscheint nur in Wahrer Sicht.",bossAppears:"KOMMANDANT: Du folgst einem Signal, das du nicht verstehst.",weaponName:"Impulsklinge",armorName:"Ranger-Rüstung",accessoryName:"Signal-Amulett",none:"Nicht gefunden",statHp:"Gesundheit",statAtk:"Angriff",statDef:"Verteidigung",talk:"Reden"};

  const it={...es,label:"Italiano",title:"Velo del Segnale",language:"Lingua",loading:"Calibrazione della visione neurale…",posterAlt:"Spark Paw Fia rivela un comandante lucertola con la visione neurale",kicker:"2042 · PRIMO CONTATTO",summary:"Esplora città, foresta e laboratorio collegati. Rivela le minacce nascoste e sconfiggi il primo comandante lucertola.",start:"Inizia gioco",guideTitle:"Guida sul campo",guideOverviewTitle:"Missione",guideOverview:"Nel 2042 sparizioni e attacchi si diffondono sulla Terra. Spark Paw Fia arriva a Città Segnale dopo che il video di una Persona Lucertola viene liquidato come falso. Interroga dieci testimoni, attraversa la foresta al chiaro di luna ed entra nel laboratorio neurale abbandonato. Questo primo capitolo è un mondo continuo senza selezione livelli; posizione, livello, equipaggiamento, missioni e storia vengono salvati nel browser.",guideControlsTitle:"Comandi e combattimento",guideControls:"Su desktop muoviti con WASD o frecce. Space/J attacca in mischia, K spara, V cambia visione, E parla o apre bauli, Escape apre il menu. Su mobile usa joystick, Attacco, Abilità e Visione. I nemici pattugliano, inseguono e attaccano; il comandante cambia schema con la salute.",guideVisionTitle:"Visione neurale",guideVision:"La visione normale mostra il mondo percepito dalla maggioranza. La visione reale rivela percorsi ciano, Lucertole camuffate, mostri invisibili, porte segrete e tesori. La lente prototipo non consuma risorse. Il dispositivo stabile dimostra che non cambiavano forma: interferivano con la percezione umana.",guideProgressTitle:"Crescita ed equipaggiamento",guideProgress:"Sconfiggi quindici mostri per ottenere EXP. Ogni livello aumenta salute massima, attacco e difesa. Tre bauli contengono Lama a Impulsi, Armatura Ranger e Amuleto del Segnale; si equipaggiano e salvano subito. Il colpo a distanza ha una breve ricarica, quello ravvicinato è rapido e potente.",guideWinTitle:"Successo, sconfitta e salvataggi",guideWin:"Il capitolo termina sconfiggendo il primo comandante e recuperando il dispositivo. Se Fia perde tutta la salute, torna al punto sicuro mantenendo livello, equipaggiamento, missioni e bersagli principali. Non serve un account. I progressi restano nella memoria di questo browser.",guideTipsTitle:"Consigli",guideTips:"Parla con ogni testimone prima del cancello. Osserva le aree d’allerta e attira una pattuglia per volta. Usa il colpo sui bruti e sugli incantatori. Attiva la visione reale vicino a scintille ciano e pareti sospette. Contro il comandante, muoviti durante le raffiche, evita la carica e colpisci mentre è stordito.",guideFaqTitle:"FAQ",guideFaq:"La prima versione include una città, una foresta, un laboratorio, dieci PNG, quindici mostri, un boss con più schemi, tre equipaggiamenti, livelli, salvataggio locale, comandi touch e tastiera e visione neurale. La prima partita dura circa 30–60 minuti. Le regioni sono continue, non livelli. Gli stessi sistemi potranno estendere il mondo verso montagna, base militare, rovine e base lunare.",menu:"Menu",level:"LV",normalVision:"Normale",trueVision:"Visione reale",skill:"Abilità",attack:"Attacco",continue:"Continua",paused:"Indagine in pausa",resume:"Riprendi",equipment:"Equipaggiamento",save:"Salva",returnMain:"Torna all’inizio",weapon:"Arma",armor:"Armatura",accessory:"Accessorio",back:"Indietro",leaveTitle:"Lasciare l’indagine?",leaveText:"Il punto sicuro e i progressi permanenti sono salvi.",demoComplete:"CAPITOLO COMPLETATO",resultTitle:"Il velo è spezzato.",bossQuote:"«Non stiamo invadendo.»",resultText:"Il dispositivo rivela le Lucertole tra gli umani. Il segnale punta oltre la Terra.",ending:"La Terra era solo l’inizio.",explore:"Continua a esplorare",newGame:"Nuova indagine",zoneTown:"Città Segnale",zoneForest:"Foresta del Velo",zoneLab:"Laboratorio neurale",objectiveTalk:"Parla con Orla nella piazza.",objectiveWitnesses:"Interroga dieci testimoni ({n}/10).",objectiveForest:"Segui la pista ciano e sconfiggi le pattuglie ({n}/8).",objectiveLab:"Entra nel laboratorio ed elimina le guardie ({n}/15).",objectiveBoss:"Affronta il comandante lucertola.",objectiveComplete:"Esplora liberamente. Il dispositivo rivela ogni segreto.",interact:"Premi E per interagire",visionUnlocked:"Visione neurale prototipo sbloccata. Premi V.",visionOn:"Visione reale attiva.",visionOff:"Visione normale ripristinata.",levelUp:"Livello {n}! Salute, attacco e difesa aumentati.",defeated:"Fia è tornata al punto sicuro.",saved:"Indagine salvata.",chest:"Equipaggiamento ottenuto: {item}",lockedForest:"Il cancello si apre dopo tutti i testimoni.",lockedLab:"L’ingresso appare solo nella visione reale.",bossAppears:"COMANDANTE: Segui un segnale che non comprendi.",weaponName:"Lama a Impulsi",armorName:"Armatura Ranger",accessoryName:"Amuleto del Segnale",none:"Non trovato",statHp:"Salute",statAtk:"Attacco",statDef:"Difesa",talk:"Parla"};

  const ru={...en,label:"Русский",title:"Сигнальная Завеса",language:"Язык",loading:"Калибровка нейрозрения…",posterAlt:"Спарк Поу Фиа разоблачает командира-ящера с помощью нейрозрения",kicker:"2042 · ПЕРВЫЙ КОНТАКТ",summary:"Исследуйте связанные город, лес и лабораторию. Раскройте скрытые угрозы и победите первого командира-ящера.",start:"Начать игру",guideTitle:"Полевое руководство",guideOverviewTitle:"Задание",guideOverview:"В 2042 году по Земле распространяются исчезновения и нападения. Спарк Поу Фиа прибывает в Сигнал-Сити после того, как видео Человека-ящера объявили подделкой. Опросите десять свидетелей, пройдите лунный лес и войдите в заброшенную нейролабораторию. Первая глава — единый мир без выбора уровней; позиция, уровень, снаряжение, задания и сюжет сохраняются в браузере.",guideControlsTitle:"Управление и бой",guideControls:"На компьютере двигайтесь WASD или стрелками. Space/J — ближняя атака, K — выстрел, V — смена зрения, E — разговор или сундук, Escape — меню. На телефоне используйте джойстик и кнопки атаки, навыка и зрения. Враги патрулируют, преследуют и бьют, а командир меняет приёмы с потерей здоровья.",guideVisionTitle:"Нейрозрение",guideVision:"Обычное зрение показывает мир, каким его воспринимают люди. Истинное зрение открывает голубые пути, замаскированных ящеров, невидимых монстров, тайные двери и сокровища. Прототип не тратит ресурс. Стабильный прибор доказывает: они не меняли облик, а вмешивались в человеческое восприятие.",guideProgressTitle:"Рост и снаряжение",guideProgress:"Победите пятнадцать монстров ради опыта. Каждый уровень повышает здоровье, атаку и защиту. В трёх сундуках лежат Импульсный клинок, Броня следопыта и Сигнальный амулет; они сразу применяются и сохраняются. Выстрел перезаряжается, ближний удар быстрее и сильнее.",guideWinTitle:"Победа, поражение и сохранение",guideWin:"Глава завершится после победы над первым командиром и получения устройства. При нулевом здоровье Фиа вернётся к безопасной точке, сохранив уровень, экипировку, задания и ключевые победы. Учётная запись не нужна. Прогресс хранится только в этом браузере.",guideTipsTitle:"Советы",guideTips:"Поговорите со всеми свидетелями до ворот леса. Следите за зонами тревоги и выманивайте врагов по одному. Стреляйте в тяжёлых бойцов и заклинателей. Включайте истинное зрение возле голубых искр и подозрительных стен. В бою с командиром двигайтесь во время залпов, уходите от рывка и атакуйте в момент оглушения.",guideFaqTitle:"FAQ",guideFaq:"Первая версия содержит один город, лес и лабораторию, десять NPC, пятнадцать монстров, босса с несколькими схемами, три предмета, уровни, локальное сохранение, сенсорное и клавиатурное управление и нейрозрение. Прохождение занимает около 30–60 минут. Регионы образуют единый мир. Те же системы позволят добавить гору, военную базу, руины и лунную базу.",menu:"Меню",level:"УР",normalVision:"Обычное",trueVision:"Истинное",skill:"Навык",attack:"Атака",continue:"Продолжить",paused:"Расследование приостановлено",resume:"Возобновить",equipment:"Снаряжение",save:"Сохранить",returnMain:"В главное меню",weapon:"Оружие",armor:"Броня",accessory:"Аксессуар",back:"Назад",leaveTitle:"Покинуть расследование?",leaveText:"Контрольная точка и постоянный прогресс сохранены.",demoComplete:"ГЛАВА ЗАВЕРШЕНА",resultTitle:"Завеса разрушена.",bossQuote:"«Мы не вторгаемся.»",resultText:"Устройство показывает ящеров среди людей. Сигнал ведёт за пределы Земли.",ending:"Земля была лишь началом.",explore:"Продолжить исследование",newGame:"Новое расследование",zoneTown:"Сигнал-Сити",zoneForest:"Лес Завесы",zoneLab:"Нейролаборатория",objectiveTalk:"Поговорите с Орлой на площади.",objectiveWitnesses:"Опросите десять свидетелей ({n}/10).",objectiveForest:"Следуйте по голубому следу и победите патрули ({n}/8).",objectiveLab:"Войдите в лабораторию и победите охрану ({n}/15).",objectiveBoss:"Сразитесь с командиром-ящером.",objectiveComplete:"Свободное исследование. Устройство раскрывает все тайны.",interact:"Нажмите E для действия",visionUnlocked:"Прототип нейрозрения открыт. Нажмите V.",visionOn:"Истинное зрение включено.",visionOff:"Обычное зрение восстановлено.",levelUp:"Уровень {n}! Здоровье, атака и защита выросли.",defeated:"Фиа вернулась к безопасной точке.",saved:"Расследование сохранено.",chest:"Получено снаряжение: {item}",lockedForest:"Ворота откроются после опроса всех свидетелей.",lockedLab:"Вход виден только в истинном зрении.",bossAppears:"КОМАНДИР: Ты следуешь за непонятным сигналом.",weaponName:"Импульсный клинок",armorName:"Броня следопыта",accessoryName:"Сигнальный амулет",none:"Не найдено",statHp:"Здоровье",statAtk:"Атака",statDef:"Защита",talk:"Говорить"};

  const hi={...en,label:"हिन्दी",title:"सिग्नल वेल",language:"भाषा",loading:"न्यूरल विज़न कैलिब्रेट हो रहा है…",posterAlt:"स्पार्क पॉ फिया न्यूरल विज़न से छिपे लिज़र्ड कमांडर को दिखाती है",kicker:"2042 · पहला संपर्क",summary:"जुड़े हुए नगर, जंगल और प्रयोगशाला को खोजें। छिपे ख़तरों को देखें और पहले लिज़र्ड कमांडर को हराएँ।",start:"खेल शुरू करें",guideTitle:"फ़ील्ड गाइड",guideOverviewTitle:"मिशन",guideOverview:"2042 में पृथ्वी पर लोग ग़ायब हो रहे हैं और हमले बढ़ रहे हैं। लिज़र्ड पर्सन के वीडियो को नकली कहे जाने के बाद स्पार्क पॉ फिया सिग्नल टाउन आती है। दस गवाहों से बात करें, चाँदनी जंगल पार करें और छोड़ी हुई न्यूरल प्रयोगशाला में जाएँ। यह पहला अध्याय बिना स्टेज चयन की जुड़ी दुनिया है; स्थान, स्तर, उपकरण, खोज और कहानी इस ब्राउज़र में सहेजे जाते हैं।",guideControlsTitle:"नियंत्रण और युद्ध",guideControls:"डेस्कटॉप पर WASD या तीर कुंजियों से चलें। Space/J से पास का हमला, K से दूर का वार, V से विज़न बदलें, E से बात या संदूक खोलें और Escape से मेनू खोलें। मोबाइल पर बायाँ जॉयस्टिक और हमला, कौशल, विज़न बटन उपयोग करें। शत्रु गश्त, पीछा और हमला करते हैं; कमांडर स्वास्थ्य घटने पर तरीका बदलता है।",guideVisionTitle:"न्यूरल विज़न",guideVision:"सामान्य दृष्टि वही दुनिया दिखाती है जो अधिकतर लोग देखते हैं। सच्ची दृष्टि नीले छिपे रास्ते, भेष वाले लिज़र्ड लोग, अदृश्य राक्षस, गुप्त द्वार और ख़ज़ाना दिखाती है। प्रोटोटाइप कोई संसाधन नहीं खर्च करता। स्थिर यंत्र साबित करता है कि उन्होंने रूप नहीं बदला, मानव दृष्टि में हस्तक्षेप किया।",guideProgressTitle:"विकास और उपकरण",guideProgress:"अनुभव के लिए पंद्रह राक्षस हराएँ। हर स्तर अधिकतम स्वास्थ्य, हमला और रक्षा बढ़ाता है। तीन संदूकों में पल्स ब्लेड, रेंजर आर्मर और सिग्नल चार्म हैं; वे तुरंत लागू और सहेजे जाते हैं। दूर के कौशल में छोटा कूलडाउन है, पास का हमला तेज़ और शक्तिशाली है।",guideWinTitle:"सफलता, हार और सेव",guideWin:"पहले कमांडर को हराकर उसका यंत्र पाने पर अध्याय पूरा होता है। स्वास्थ्य शून्य होने पर फिया सुरक्षित चेकपॉइंट से लौटती है और स्तर, उपकरण, खोज व मुख्य जीत बची रहती हैं। खाता आवश्यक नहीं। प्रगति इसी डिवाइस के ब्राउज़र में रहती है।",guideTipsTitle:"मैदानी सुझाव",guideTips:"जंगल द्वार से पहले हर गवाह से बात करें। चेतावनी क्षेत्र देखें और एक समय में एक शत्रु को खींचें। भारी और जादुई शत्रुओं पर दूर का कौशल उपयोग करें। नीली चमक और संदिग्ध दीवार के पास सच्ची दृष्टि चालू करें। कमांडर की गोलियों में चलते रहें, दौड़ से बचें और चक्कर के समय वार करें।",guideFaqTitle:"सामान्य प्रश्न",guideFaq:"पहली रिलीज़ में एक नगर, जंगल, प्रयोगशाला, दस NPC, पंद्रह राक्षस, कई हमलों वाला एक बॉस, तीन उपकरण, स्तर, स्थानीय सेव, स्पर्श व कीबोर्ड और न्यूरल विज़न हैं। पहली यात्रा लगभग 30–60 मिनट है। क्षेत्र अलग स्टेज नहीं बल्कि एक दुनिया हैं। यही दोबारा उपयोग होने वाली प्रणालियाँ आगे पहाड़, सैन्य अड्डा, खंडहर और चंद्र अड्डा जोड़ सकती हैं।",menu:"मेनू",level:"स्तर",normalVision:"सामान्य",trueVision:"सच्ची दृष्टि",skill:"कौशल",attack:"हमला",continue:"जारी रखें",paused:"जाँच रुकी हुई है",resume:"फिर शुरू",equipment:"उपकरण",save:"सहेजें",returnMain:"मुख्य पृष्ठ",weapon:"हथियार",armor:"कवच",accessory:"सहायक",back:"वापस",leaveTitle:"जाँच छोड़ें?",leaveText:"चेकपॉइंट और स्थायी प्रगति सुरक्षित हैं।",demoComplete:"अध्याय पूर्ण",resultTitle:"पर्दा टूट गया।",bossQuote:"“हम आक्रमण नहीं कर रहे।”",resultText:"यंत्र सामान्य मनुष्यों में छिपे लिज़र्ड लोगों को दिखाता है। संकेत पृथ्वी से परे जाता है।",ending:"पृथ्वी केवल शुरुआत थी।",explore:"खोज जारी रखें",newGame:"नई जाँच",zoneTown:"सिग्नल टाउन",zoneForest:"वेलवुड जंगल",zoneLab:"न्यूरल प्रयोगशाला",objectiveTalk:"नगर चौक में ऑर्ला से बात करें।",objectiveWitnesses:"दस गवाहों से पूछें ({n}/10)।",objectiveForest:"नीले रास्ते पर चलें और गश्त हराएँ ({n}/8)।",objectiveLab:"प्रयोगशाला में जाकर रक्षक हराएँ ({n}/15)।",objectiveBoss:"लिज़र्ड कमांडर से लड़ें।",objectiveComplete:"स्वतंत्र खोज। स्थिर यंत्र सभी रहस्य दिखाता है।",interact:"बात करने के लिए E दबाएँ",visionUnlocked:"प्रोटोटाइप न्यूरल विज़न खुला। V दबाएँ।",visionOn:"सच्ची दृष्टि चालू।",visionOff:"सामान्य दृष्टि बहाल।",levelUp:"स्तर {n}! स्वास्थ्य, हमला और रक्षा बढ़े।",defeated:"फिया सुरक्षित चेकपॉइंट पर लौटी।",saved:"जाँच सहेजी गई।",chest:"उपकरण मिला: {item}",lockedForest:"सभी गवाहों के बाद द्वार खुलेगा।",lockedLab:"प्रयोगशाला का द्वार केवल सच्ची दृष्टि में दिखता है।",bossAppears:"कमांडर: तुम उस संकेत का पीछा करते हो जिसे समझते नहीं।",weaponName:"पल्स ब्लेड",armorName:"रेंजर आर्मर",accessoryName:"सिग्नल चार्म",none:"नहीं मिला",statHp:"स्वास्थ्य",statAtk:"हमला",statDef:"रक्षा",talk:"बात करें"};

  const ar={...en,label:"العربية",title:"حجاب الإشارة",language:"اللغة",loading:"تتم معايرة الرؤية العصبية…",posterAlt:"سبارك باو فيا تكشف قائد السحالي بجهاز الرؤية العصبية",kicker:"2042 · الاتصال الأول",summary:"استكشف بلدة وغابة ومختبرًا مترابطًا. اكشف الأخطار المخفية واهزم أول قائد للسحالي.",start:"ابدأ اللعبة",guideTitle:"دليل التحقيق",guideOverviewTitle:"المهمة",guideOverview:"في عام 2042 تنتشر حالات الاختفاء والهجمات على الأرض. تصل سبارك باو فيا إلى بلدة الإشارة بعد اعتبار فيديو لشخص سحلية مزيفًا. استجوب عشرة شهود، واعبر الغابة تحت ضوء القمر، وادخل المختبر العصبي المهجور. هذا الفصل الأول عالم متصل بلا اختيار مراحل؛ يُحفظ الموقع والمستوى والمعدات والمهام والقصة في هذا المتصفح.",guideControlsTitle:"التحكم والقتال",guideControls:"على الكمبيوتر تحرك بـ WASD أو الأسهم. Space أو J لهجوم قريب، K لقذيفة، V لتبديل الرؤية، E للحديث أو فتح الصندوق، وEscape للقائمة. على الهاتف استخدم عصا التحكم وأزرار الهجوم والمهارة والرؤية. يقوم الأعداء بالدورية والمطاردة والهجوم، ويغير القائد أنماطه مع انخفاض صحته.",guideVisionTitle:"الرؤية العصبية",guideVision:"تعرض الرؤية العادية العالم كما يدركه معظم الناس. تكشف الرؤية الحقيقية المسارات السماوية وأشخاص السحالي المتنكرين والوحوش المخفية والأبواب السرية والكنوز. لا تستهلك العدسة التجريبية موردًا. يثبت الجهاز المستقر أنهم لم يغيروا شكلهم، بل تلاعبوا بالإدراك البشري.",guideProgressTitle:"النمو والمعدات",guideProgress:"اهزم خمسة عشر وحشًا لكسب الخبرة. يزيد كل مستوى الصحة القصوى والهجوم والدفاع. تحتوي ثلاثة صناديق على نصل النبض ودرع الحارس وتميمة الإشارة؛ تُطبق فورًا وتُحفظ. للقذيفة وقت إعادة قصير، والهجوم القريب أسرع وأقوى.",guideWinTitle:"النجاح والفشل والحفظ",guideWin:"يكتمل الفصل عند هزيمة أول قائد واستعادة جهازه. إذا فقدت فيا كل الصحة تعود إلى نقطة آمنة مع بقاء المستوى والمعدات والمهام والانتصارات الأساسية. لا يلزم حساب. يبقى التقدم في تخزين هذا المتصفح وقد يضيع عند حذف بيانات الموقع أو تغيير الجهاز.",guideTipsTitle:"نصائح ميدانية",guideTips:"تحدث إلى كل شاهد قبل بوابة الغابة. راقب نطاقات التنبيه واجذب عدوًا واحدًا. استخدم القذيفة ضد المدرعين والسحرة. فعّل الرؤية الحقيقية قرب الشرر السماوي والجدران المريبة. أمام القائد تحرك أثناء القذائف، وتجنب الاندفاع، واضرب في فترة الذهول.",guideFaqTitle:"الأسئلة الشائعة",guideFaq:"يتضمن الإصدار الأول بلدة وغابة ومختبرًا، وعشرة شخصيات، وخمسة عشر وحشًا، وزعيمًا متعدد الأنماط، وثلاث معدات، ومستويات، وحفظًا محليًا، وتحكم اللمس ولوحة المفاتيح، والرؤية العصبية. تستغرق الجولة الأولى نحو 30–60 دقيقة. المناطق عالم متصل وليست مراحل. يمكن للأنظمة نفسها توسيع العالم إلى الجبل والقاعدة العسكرية والآثار وقاعدة القمر.",menu:"القائمة",level:"المستوى",normalVision:"عادية",trueVision:"رؤية حقيقية",skill:"مهارة",attack:"هجوم",continue:"متابعة",paused:"التحقيق متوقف",resume:"استئناف",equipment:"المعدات",save:"حفظ",returnMain:"العودة للرئيسية",weapon:"السلاح",armor:"الدرع",accessory:"الملحق",back:"رجوع",leaveTitle:"مغادرة التحقيق؟",leaveText:"نقطة الأمان والتقدم الدائم محفوظان.",demoComplete:"اكتمل الفصل",resultTitle:"انكسر الحجاب.",bossQuote:"«لسنا نغزوكم.»",resultText:"يكشف الجهاز أشخاص السحالي بين البشر. تشير الإشارة إلى ما وراء الأرض.",ending:"كانت الأرض مجرد البداية.",explore:"متابعة الاستكشاف",newGame:"تحقيق جديد",zoneTown:"بلدة الإشارة",zoneForest:"غابة الحجاب",zoneLab:"المختبر العصبي",objectiveTalk:"تحدث إلى أورلا في الساحة.",objectiveWitnesses:"استجوب عشرة شهود ({n}/10).",objectiveForest:"اتبع المسار السماوي واهزم الدوريات ({n}/8).",objectiveLab:"ادخل المختبر واقض على الحراس ({n}/15).",objectiveBoss:"واجه قائد السحالي.",objectiveComplete:"استكشف بحرية. يكشف الجهاز المستقر كل الأسرار.",interact:"اضغط E للتفاعل",visionUnlocked:"فُتحت الرؤية العصبية التجريبية. اضغط V.",visionOn:"فُعلت الرؤية الحقيقية.",visionOff:"عادت الرؤية العادية.",levelUp:"المستوى {n}! زادت الصحة والهجوم والدفاع.",defeated:"عادت فيا إلى آخر نقطة آمنة.",saved:"حُفظ التحقيق.",chest:"تم الحصول على: {item}",lockedForest:"تفتح البوابة بعد استجواب جميع الشهود.",lockedLab:"لا يظهر المدخل إلا في الرؤية الحقيقية.",bossAppears:"القائد: تتبع إشارة لا تفهمها.",weaponName:"نصل النبض",armorName:"درع الحارس",accessoryName:"تميمة الإشارة",none:"غير موجود",statHp:"الصحة",statAtk:"الهجوم",statDef:"الدفاع",talk:"تحدث"};

  zhHans.npcLines=["视频是真的，菲雅。带上我的原型镜片，它能揭露肉眼看不见的干扰。","东侧森林附近一直有人失踪，但恐慌会摧毁这座镇，请低调调查。","每位目击者都记得同一道蓝色脉冲，绝非巧合。","巡逻队找到爪痕，摄影机却只拍到普通军官。","我上传了视频，所有平台几分钟内都说它是合成的。","信号会烧坏机器，电池却完全没事。","有些病患说，同一个位置同时存在两张脸。","旧地图显示森林下方有实验室，新纪录却全部删除了它。","只有镜片启用时，青色菇群才会指向东方。","我看到镇长的影子比本人早眨眼。从此我不再相信任何人。"];
  ja.npcLines=["映像は本物よ、フィア。この試作レンズなら肉眼では見えない干渉を暴ける。","東の森で人が消えている。町を混乱させないよう、静かに調べてくれ。","目撃者は全員、同じ青いパルスを覚えている。偶然ではない。","爪痕は見つかったのに、カメラには普通の士官しか映っていなかった。","映像を投稿したら、数分で全サイトが偽物だと判定した。","信号は機械を焼くのに、電池だけは無傷なんだ。","患者は同じ場所に二つの顔が重なって見えると言う。","古い地図には森の下の研究所がある。新しい記録からは消されている。","レンズを起動した時だけ、シアンのキノコが東を指す。","町長の影が本人より先に瞬きした。それ以来、誰も信じていない。"];
  ko.npcLines=["영상은 진짜야, 피아. 이 시제품 렌즈는 눈에 보이지 않는 간섭을 드러내.","동쪽 숲 근처에서 사람들이 사라져. 마을이 혼란에 빠지지 않게 조용히 조사해 줘.","목격자 모두 같은 푸른 파동을 기억해. 우연이 아니야.","발톱 자국은 있었지만 카메라에는 평범한 장교만 찍혔어.","영상을 올리자 몇 분 만에 모든 사이트가 합성이라고 표시했어.","신호는 기계를 태우는데 배터리는 멀쩡해.","환자들은 같은 자리에 두 얼굴이 겹쳐 보인다고 말해.","옛 지도에는 숲 아래 연구소가 있어. 새 기록에서는 지워졌지.","렌즈를 켰을 때만 청록 버섯이 동쪽을 가리켜.","시장의 그림자가 본인보다 먼저 눈을 깜빡였어. 그날부터 아무도 믿지 않아."];
  es.npcLines=["Los vídeos son reales, Fia. Esta lente prototipo revela interferencias invisibles al ojo.","Hay desapariciones junto al bosque oriental. Investiga en secreto o el pánico destruirá el pueblo.","Todos los testigos recuerdan el mismo pulso azul. No es una coincidencia.","La patrulla halló arañazos, pero la cámara solo mostró a un oficial normal.","Subí el vídeo y en minutos todas las plataformas lo marcaron como falso.","La señal quema máquinas, pero deja intactas las baterías.","Algunos pacientes ven dos rostros ocupando el mismo lugar.","El mapa antiguo muestra un laboratorio bajo el bosque; los registros nuevos lo borraron.","Las setas cian solo señalan el este cuando activas la lente.","Vi parpadear la sombra del alcalde antes que él. Desde entonces no confío en nadie."];
  pt.npcLines=["Os vídeos são reais, Fia. Esta lente protótipo revela interferências invisíveis aos olhos.","Pessoas somem perto da floresta leste. Investigue em silêncio ou o pânico destruirá a cidade.","Todas as testemunhas lembram do mesmo pulso azul. Não é coincidência.","A patrulha achou marcas de garras, mas a câmera mostrou só um oficial comum.","Enviei o vídeo e, em minutos, todas as plataformas o chamaram de falso.","O sinal queima máquinas, mas deixa as baterias intactas.","Alguns pacientes veem dois rostos ocupando o mesmo lugar.","O mapa antigo mostra um laboratório sob a floresta; os registros novos o apagaram.","Os cogumelos ciano só apontam para leste com a lente ligada.","Vi a sombra do prefeito piscar antes dele. Desde então não confio em ninguém."];
  fr.npcLines=["Les vidéos sont vraies, Fia. Cette lentille prototype révèle les interférences invisibles.","Des gens disparaissent près de la forêt à l’est. Enquête discrètement pour éviter la panique.","Tous les témoins se souviennent de la même impulsion bleue. Ce n’est pas un hasard.","La patrouille a trouvé des griffures, mais la caméra n’a filmé qu’un officier ordinaire.","J’ai publié la vidéo et toutes les plateformes l’ont déclarée fausse en quelques minutes.","Le signal brûle les machines, mais laisse les batteries intactes.","Certains patients voient deux visages au même endroit.","L’ancienne carte montre un laboratoire sous la forêt, effacé des nouveaux registres.","Les champignons cyan ne pointent vers l’est que lorsque la lentille est active.","J’ai vu l’ombre du maire cligner des yeux avant lui. Depuis, je ne fais confiance à personne."];
  de.npcLines=["Die Videos sind echt, Fia. Diese Prototyp-Linse enthüllt unsichtbare Störmuster.","Am östlichen Wald verschwinden Menschen. Ermittle leise, sonst gerät die Stadt in Panik.","Alle Zeugen erinnern sich an denselben blauen Impuls. Das ist kein Zufall.","Die Patrouille fand Kratzspuren, doch die Kamera zeigte nur einen normalen Offizier.","Ich lud das Video hoch. Minuten später nannten es alle Plattformen eine Fälschung.","Das Signal verbrennt Maschinen, lässt aber die Batterien unversehrt.","Manche Patienten sehen zwei Gesichter am selben Ort.","Die alte Karte zeigt ein Labor unter dem Wald. In neuen Akten wurde es gelöscht.","Nur mit aktiver Linse zeigen die cyanfarbenen Pilze nach Osten.","Der Schatten des Bürgermeisters blinzelte vor ihm. Seitdem vertraue ich niemandem."];
  it.npcLines=["I video sono veri, Fia. Questa lente prototipo rivela le interferenze invisibili.","Vicino alla foresta orientale spariscono persone. Indaga in silenzio o la città cadrà nel panico.","Tutti i testimoni ricordano lo stesso impulso blu. Non è una coincidenza.","La pattuglia ha trovato graffi, ma la telecamera mostrava solo un normale ufficiale.","Ho caricato il video e in pochi minuti ogni piattaforma lo ha definito falso.","Il segnale brucia le macchine, ma lascia intatte le batterie.","Alcuni pazienti vedono due volti nello stesso punto.","La vecchia mappa mostra un laboratorio sotto la foresta, cancellato dai nuovi registri.","I funghi ciano indicano est solo quando la lente è attiva.","Ho visto l’ombra del sindaco battere le palpebre prima di lui. Da allora non mi fido di nessuno."];
  ru.npcLines=["Видео настоящее, Фиа. Эта опытная линза показывает невидимые глазу помехи.","У восточного леса пропадают люди. Расследуй тихо, иначе город охватит паника.","Все свидетели помнят один и тот же синий импульс. Это не совпадение.","Патруль нашёл следы когтей, но камера показала лишь обычного офицера.","Я загрузил видео, и через несколько минут все платформы назвали его подделкой.","Сигнал сжигает машины, но батареи остаются целыми.","Некоторые пациенты видят два лица в одном и том же месте.","На старой карте под лесом есть лаборатория. В новых записях её удалили.","Голубые грибы указывают на восток только при включённой линзе.","Тень мэра моргнула раньше него. С тех пор я никому не доверяю."];
  hi.npcLines=["वीडियो असली हैं, फिया। यह प्रोटोटाइप लेंस आँखों से छिपे व्यवधान को दिखाता है।","पूर्वी जंगल के पास लोग गायब हो रहे हैं। चुपचाप जाँच करो, वरना नगर में दहशत फैल जाएगी।","हर गवाह को वही नीली तरंग याद है। यह संयोग नहीं है।","गश्ती दल को पंजों के निशान मिले, लेकिन कैमरे में सिर्फ़ एक सामान्य अफ़सर था।","मैंने वीडियो डाला और कुछ ही मिनटों में हर मंच ने उसे नकली बता दिया।","संकेत मशीनें जला देता है, पर बैटरियाँ बिल्कुल सुरक्षित रहती हैं।","कुछ मरीज़ एक ही जगह दो चेहरे देखने की बात कहते हैं।","पुराने नक्शे में जंगल के नीचे प्रयोगशाला है; नए अभिलेखों से उसे मिटा दिया गया।","लेंस चालू होने पर ही नीले मशरूम पूर्व की ओर इशारा करते हैं।","मैंने मेयर की परछाईं को उससे पहले पलक झपकाते देखा। तब से किसी पर भरोसा नहीं।"];
  ar.npcLines=["مقاطع الفيديو حقيقية يا فيا. تكشف هذه العدسة التجريبية تشويشًا لا تراه العين.","يختفي الناس قرب الغابة الشرقية. تحققي بهدوء كي لا يدمر الذعر البلدة.","يتذكر جميع الشهود النبضة الزرقاء نفسها. ليست مصادفة.","وجدت الدورية آثار مخالب، لكن الكاميرا أظهرت ضابطًا عاديًا فقط.","رفعت الفيديو، وخلال دقائق وصفته كل المنصات بأنه مزيف.","تحرق الإشارة الآلات، لكنها تترك البطاريات سليمة.","يرى بعض المرضى وجهين في المكان نفسه.","تُظهر الخريطة القديمة مختبرًا تحت الغابة، وقد مُسح من السجلات الجديدة.","لا يشير الفطر السماوي شرقًا إلا عند تشغيل العدسة.","رأيت ظل العمدة يرمش قبله. ومنذ ذلك اليوم لا أثق بأحد."];

  const economyCopy={
    en:{diamonds:"Diamonds",anchorTitle:"Signal Anchor",anchorEffect:"Permanent: +12 maximum health for this and future investigations. Optional and never required.",anchorBuy:"Install · 5 Diamonds",anchorOwned:"Installed",anchorPermanent:"Permanent upgrade installed.",anchorBalance:"Current balance: {n}",anchorNeed:"Need 5 Diamonds. Current balance: {n}.",anchorInstalled:"Signal Anchor installed. Maximum health +12."},
    "zh-Hant":{diamonds:"鑽石",anchorTitle:"訊號錨",anchorEffect:"永久：本次與未來調查的最大生命 +12。完全選用，通關不需要。",anchorBuy:"安裝 · 5 鑽石",anchorOwned:"已安裝",anchorPermanent:"永久升級已安裝。",anchorBalance:"目前餘額：{n}",anchorNeed:"需要 5 鑽石。目前餘額：{n}。",anchorInstalled:"訊號錨已安裝。最大生命 +12。"},
    "zh-Hans":{diamonds:"钻石",anchorTitle:"信号锚",anchorEffect:"永久：本次与未来调查的最大生命 +12。完全选用，通关不需要。",anchorBuy:"安装 · 5 钻石",anchorOwned:"已安装",anchorPermanent:"永久升级已安装。",anchorBalance:"当前余额：{n}",anchorNeed:"需要 5 钻石。当前余额：{n}。",anchorInstalled:"信号锚已安装。最大生命 +12。"},
    ja:{diamonds:"ダイヤ",anchorTitle:"シグナルアンカー",anchorEffect:"永久：今回と今後の調査で最大体力+12。任意で、攻略には不要です。",anchorBuy:"設置・ダイヤ5個",anchorOwned:"設置済み",anchorPermanent:"永久アップグレード設置済み。",anchorBalance:"現在の残高：{n}",anchorNeed:"ダイヤが5個必要です。現在：{n}。",anchorInstalled:"シグナルアンカー設置。最大体力+12。"},
    ko:{diamonds:"다이아몬드",anchorTitle:"시그널 앵커",anchorEffect:"영구: 이번 및 이후 조사에서 최대 체력 +12. 선택 사항이며 필수가 아닙니다.",anchorBuy:"설치 · 다이아몬드 5개",anchorOwned:"설치됨",anchorPermanent:"영구 업그레이드가 설치되었습니다.",anchorBalance:"현재 잔액: {n}",anchorNeed:"다이아몬드 5개 필요. 현재: {n}.",anchorInstalled:"시그널 앵커 설치. 최대 체력 +12."},
    es:{diamonds:"Diamantes",anchorTitle:"Ancla de señal",anchorEffect:"Permanente: +12 de salud máxima en esta y futuras investigaciones. Es opcional.",anchorBuy:"Instalar · 5 diamantes",anchorOwned:"Instalada",anchorPermanent:"Mejora permanente instalada.",anchorBalance:"Saldo actual: {n}",anchorNeed:"Necesitas 5 diamantes. Saldo: {n}.",anchorInstalled:"Ancla instalada. Salud máxima +12."},
    "pt-BR":{diamonds:"Diamantes",anchorTitle:"Âncora de sinal",anchorEffect:"Permanente: +12 de vida máxima nesta e nas próximas investigações. É opcional.",anchorBuy:"Instalar · 5 diamantes",anchorOwned:"Instalada",anchorPermanent:"Melhoria permanente instalada.",anchorBalance:"Saldo atual: {n}",anchorNeed:"São necessários 5 diamantes. Saldo: {n}.",anchorInstalled:"Âncora instalada. Vida máxima +12."},
    fr:{diamonds:"Diamants",anchorTitle:"Ancre de signal",anchorEffect:"Permanent : +12 de santé maximale pour cette enquête et les suivantes. Entièrement facultatif.",anchorBuy:"Installer · 5 diamants",anchorOwned:"Installée",anchorPermanent:"Amélioration permanente installée.",anchorBalance:"Solde actuel : {n}",anchorNeed:"Il faut 5 diamants. Solde : {n}.",anchorInstalled:"Ancre installée. Santé maximale +12."},
    de:{diamonds:"Diamanten",anchorTitle:"Signalanker",anchorEffect:"Permanent: +12 maximale Gesundheit für diese und künftige Ermittlungen. Vollständig optional.",anchorBuy:"Installieren · 5 Diamanten",anchorOwned:"Installiert",anchorPermanent:"Permanente Verbesserung installiert.",anchorBalance:"Aktueller Stand: {n}",anchorNeed:"5 Diamanten benötigt. Stand: {n}.",anchorInstalled:"Signalanker installiert. Maximale Gesundheit +12."},
    it:{diamonds:"Diamanti",anchorTitle:"Ancora del segnale",anchorEffect:"Permanente: +12 salute massima in questa e nelle future indagini. È facoltativa.",anchorBuy:"Installa · 5 diamanti",anchorOwned:"Installata",anchorPermanent:"Potenziamento permanente installato.",anchorBalance:"Saldo attuale: {n}",anchorNeed:"Servono 5 diamanti. Saldo: {n}.",anchorInstalled:"Ancora installata. Salute massima +12."},
    ru:{diamonds:"Алмазы",anchorTitle:"Сигнальный якорь",anchorEffect:"Навсегда: +12 к максимуму здоровья в этом и будущих расследованиях. Необязательно.",anchorBuy:"Установить · 5 алмазов",anchorOwned:"Установлен",anchorPermanent:"Постоянное улучшение установлено.",anchorBalance:"Текущий баланс: {n}",anchorNeed:"Нужно 5 алмазов. Баланс: {n}.",anchorInstalled:"Якорь установлен. Максимум здоровья +12."},
    hi:{diamonds:"हीरे",anchorTitle:"सिग्नल एंकर",anchorEffect:"स्थायी: इस और भविष्य की जाँच में अधिकतम स्वास्थ्य +12। यह वैकल्पिक है।",anchorBuy:"लगाएँ · 5 हीरे",anchorOwned:"लगाया गया",anchorPermanent:"स्थायी उन्नयन लगाया गया।",anchorBalance:"वर्तमान शेष: {n}",anchorNeed:"5 हीरे चाहिए। वर्तमान शेष: {n}।",anchorInstalled:"सिग्नल एंकर लगा। अधिकतम स्वास्थ्य +12।"},
    ar:{diamonds:"الماس",anchorTitle:"مرساة الإشارة",anchorEffect:"دائم: +12 للصحة القصوى في هذا التحقيق والتحقيقات القادمة. اختياري تمامًا.",anchorBuy:"تثبيت · 5 ماسات",anchorOwned:"مثبتة",anchorPermanent:"تم تثبيت الترقية الدائمة.",anchorBalance:"الرصيد الحالي: {n}",anchorNeed:"تحتاج إلى 5 ماسات. الرصيد: {n}.",anchorInstalled:"تم تثبيت مرساة الإشارة. الصحة القصوى +12."}
  };
  for(const [code,data] of Object.entries(economyCopy)){
    Object.assign({en,"zh-Hant":zhHant,"zh-Hans":zhHans,ja,ko,es,"pt-BR":pt,fr,de,it,ru,hi,ar}[code],data);
  }
  const visionSkillCopy={
    en:"Vision","zh-Hant":"真視","zh-Hans":"真视",ja:"真視",ko:"진실 시야",
    es:"Visión","pt-BR":"Visão",fr:"Vision",de:"Sicht",it:"Visione",
    ru:"Зрение",hi:"दृष्टि",ar:"الرؤية",
  };
  const localeRegistry={en,"zh-Hant":zhHant,"zh-Hans":zhHans,ja,ko,es,"pt-BR":pt,fr,de,it,ru,hi,ar};
  const combatHitCopy={
    en:"Hit confirmed · target health reduced.","zh-Hant":"命中確認 · 目標生命值下降。","zh-Hans":"命中确认 · 目标生命值下降。",
    ja:"命中確認 · 敵の体力が減少。",ko:"명중 확인 · 적 체력이 감소했습니다.",es:"Impacto confirmado · la salud del objetivo bajó.",
    "pt-BR":"Acerto confirmado · a vida do alvo caiu.",fr:"Impact confirmé · la santé de la cible baisse.",de:"Treffer bestätigt · die Gegnergesundheit sinkt.",
    it:"Colpo confermato · la salute del bersaglio scende.",ru:"Попадание подтверждено · здоровье цели снижено.",hi:"प्रहार सफल · लक्ष्य का स्वास्थ्य घटा।",ar:"تم تأكيد الإصابة · انخفضت صحة الهدف."
  };
  for(const [code,value] of Object.entries(combatHitCopy)) localeRegistry[code].combatHit=value;
  const routeCueCopy={
    en:"Route cue: {direction} · {distance}m",
    "zh-Hant":"路線提示：{direction} · {distance} 公尺",
    "zh-Hans":"路线提示：{direction} · {distance} 米",
    ja:"ルート案内：{direction} · {distance}m",
    ko:"경로 안내: {direction} · {distance}m",
    es:"Guía de ruta: {direction} · {distance} m",
    "pt-BR":"Guia de rota: {direction} · {distance} m",
    fr:"Indication de route : {direction} · {distance} m",
    de:"Routenhinweis: {direction} · {distance} m",
    it:"Indicazione percorso: {direction} · {distance} m",
    ru:"Подсказка маршрута: {direction} · {distance} м",
    hi:"मार्ग संकेत: {direction} · {distance} मी",
    ar:"توجيه المسار: {direction} · {distance} م",
  };
  for(const [code,value] of Object.entries(routeCueCopy)) localeRegistry[code].routeCue=value;
  for(const [code,value] of Object.entries(visionSkillCopy)){
    localeRegistry[code].visionSkill=value;
  }
  const hudCopy={
    en:["Level","Health","EXP"],"zh-Hant":["等級","生命","經驗"],"zh-Hans":["等级","生命","经验"],
    ja:["レベル","体力","経験"],ko:["레벨","체력","경험"],es:["NIVEL","VIDA","EXP"],
    "pt-BR":["NÍVEL","VIDA","EXP"],fr:["NIV","VIE","EXP"],de:["STUFE","LP","EP"],
    it:["LIV","VITA","ESP"],ru:["УР","ЖИЗНЬ","ОПЫТ"],hi:["स्तर","जीवन","अनुभव"],ar:["مستوى","صحة","خبرة"],
  };
  for(const [code,[hudLevel,hudHealth,hudExperience]] of Object.entries(hudCopy)){
    Object.assign(localeRegistry[code],{hudLevel,hudHealth,hudExperience});
  }
  const menuKeys=["questButton","currentQuest","questsComingSoon","fieldStatus","location","equip","unequip","equipmentEquipped","equipmentRemoved"];
  const menuCopy={
    en:["Quest","Current Quest","All current quests are complete. More adventures coming soon.","Field Status","Location","Equip","Remove","{item} equipped.","{item} removed."],
    "zh-Hant":["任務","目前任務","目前任務已全部完成，後續故事敬請期待。","探索狀態","所在地","裝備","卸除","已裝備：{item}","已卸除：{item}"],
    "zh-Hans":["任务","当前任务","当前任务已全部完成，后续故事敬请期待。","探索状态","所在地","装备","卸下","已装备：{item}","已卸下：{item}"],
    ja:["任務","現在の任務","現在の任務はすべて完了しました。続きはお楽しみに。","探索状況","場所","装備","外す","{item}を装備しました。","{item}を外しました。"],
    ko:["임무","현재 임무","현재 임무를 모두 완료했습니다. 다음 이야기를 기대해 주세요.","탐사 상태","위치","장착","해제","{item} 장착.","{item} 해제."],
    es:["Misión","Misión actual","Has completado todas las misiones actuales. Próximamente habrá más.","Estado de campo","Lugar","Equipar","Quitar","{item} equipado.","{item} retirado."],
    "pt-BR":["Missão","Missão atual","Todas as missões atuais foram concluídas. Mais aventuras em breve.","Estado de campo","Local","Equipar","Remover","{item} equipado.","{item} removido."],
    fr:["Quête","Quête actuelle","Toutes les quêtes actuelles sont terminées. La suite arrive bientôt.","État de terrain","Lieu","Équiper","Retirer","{item} équipé.","{item} retiré."],
    de:["Auftrag","Aktueller Auftrag","Alle aktuellen Aufträge sind abgeschlossen. Fortsetzung folgt.","Feldstatus","Ort","Anlegen","Ablegen","{item} angelegt.","{item} abgelegt."],
    it:["Missione","Missione attuale","Tutte le missioni attuali sono complete. Nuove avventure in arrivo.","Stato sul campo","Luogo","Equipaggia","Rimuovi","{item} equipaggiato.","{item} rimosso."],
    ru:["Задание","Текущее задание","Все текущие задания выполнены. Продолжение скоро.","Полевой статус","Место","Надеть","Снять","Надето: {item}.","Снято: {item}."],
    hi:["मिशन","वर्तमान मिशन","सभी वर्तमान मिशन पूरे हुए। आगे की कहानी जल्द आएगी।","मैदान स्थिति","स्थान","लगाएँ","हटाएँ","{item} लगाया गया।","{item} हटाया गया।"],
    ar:["المهمة","المهمة الحالية","اكتملت كل المهام الحالية. مغامرات جديدة قريباً.","حالة الميدان","الموقع","تجهيز","إزالة","تم تجهيز {item}.","تمت إزالة {item}."]
  };
  for(const [code,values] of Object.entries(menuCopy)){
    Object.assign(localeRegistry[code],Object.fromEntries(menuKeys.map((key,index)=>[key,values[index]])));
  }
  const questSystemKeys=[
    "questProgress","questInterviewTitle","questWitnessReportTitle","questVisitTitle","questThreatTitle",
    "questRecoverTitle","questCommanderTitle","questVeilTitle","questAnswerTitle","questDecodeTitle","questProofTitle",
    "questTalkObjective","questWitnessReportObjective","questVisitObjective","questDefeatObjective",
    "questRecoverObjective","questFindCommanderObjective","questRelayObjective",
    "witnessDebrief","forestRouteUnlocked","relaySequenceLocked"
  ];
  const questSystemCopy={
    en:[
      "MISSIONS","Interview: {name}","Ten Witnesses, One Signal","Reach {place}","Secure {place}",
      "Recover {item}","The Commander Signal","Break the Veil","The Device Answers","Decode {record}","Proof for the World",
      "Speak with {name} and record their evidence.","Return to Orla and connect all ten witness accounts.","Find a safe route into {place}.",
      "Defeat the signal-corrupted threats in {place} ({n}/{target}).","Locate and recover {item}.","Follow the strongest signal and locate the Lizard Commander.",
      "Activate {record} in the required sequence.",
      "Every account shares the same blue pulse, but the times form coordinates. The forest signal is a relay, not a source. I have aligned the prototype lens and opened the eastern route—follow it before whoever erased the footage moves again.",
      "Witness evidence aligned. The eastern forest route is open.","The records are chained. Decode {record} first."
    ],
    "zh-Hant":[
      "任務","訪談：{name}","十名證人，同一道訊號","前往{place}","掃除{place}威脅",
      "回收{item}","指揮官訊號","揭開帷幕","裝置的回應","解讀{record}","向世界公開證據",
      "與{name}交談並記錄證詞。","回去找奧拉，將十份證詞拼成完整線索。","找出前往{place}的安全路線。",
      "擊敗{place}中受訊號侵蝕的威脅（{n}/{target}）。","找出並回收{item}。","追蹤最強訊號，找出蜥蜴指揮官。",
      "依照正確順序啟動{record}。",
      "十份證詞都有同一道藍色脈衝，而發生時間組合起來竟是座標。森林裡的訊號只是中繼，不是源頭。我已校準原型鏡片並開啟東側通路；在抹除影片的人再次行動前追上去。",
      "證詞已完成定位，東側森林通路開啟。","紀錄彼此相連，必須先解讀{record}。"
    ],
    "zh-Hans":[
      "任务","访谈：{name}","十名证人，同一道信号","前往{place}","清除{place}威胁",
      "回收{item}","指挥官信号","揭开帷幕","装置的回应","解读{record}","向世界公开证据",
      "与{name}交谈并记录证词。","回去找奥拉，把十份证词拼成完整线索。","找出前往{place}的安全路线。",
      "击败{place}中受信号侵蚀的威胁（{n}/{target}）。","找出并回收{item}。","追踪最强信号，找出蜥蜴指挥官。",
      "依照正确顺序启动{record}。",
      "十份证词都有同一道蓝色脉冲，而发生时间组合起来竟是坐标。森林里的信号只是中继，不是源头。我已校准原型镜片并开启东侧通路；在抹除视频的人再次行动前追上去。",
      "证词已完成定位，东侧森林通路开启。","记录彼此相连，必须先解读{record}。"
    ],
    ja:[
      "任務","聞き込み：{name}","十人の証言、一つの信号","{place}へ","{place}の脅威排除",
      "{item}を回収","司令官の信号","ヴェールを破る","装置の応答","{record}を解読","世界への証拠",
      "{name}と話し、証言を記録する。","オルラに戻り、十人の証言をつなぎ合わせる。","{place}への安全な経路を探す。",
      "{place}の信号汚染体を倒す（{n}/{target}）。","{item}を見つけて回収する。","最強の信号を追い、トカゲ司令官を探す。",
      "正しい順序で{record}を起動する。",
      "全証言に同じ青い脈動がある。時刻を並べると座標になった。森の信号は発信源ではなく中継だ。レンズを調整して東の道を開いた。映像を消した者が再び動く前に追って。",
      "証言の座標を特定。東の森への道が開いた。","記録は連結されている。先に{record}を解読しよう。"
    ],
    ko:[
      "임무","면담: {name}","열 명의 증인, 하나의 신호","{place} 진입","{place} 위협 제거",
      "{item} 회수","사령관 신호","장막을 깨다","장치의 응답","{record} 해독","세상을 위한 증거",
      "{name}와 대화하고 증언을 기록하세요.","오를라에게 돌아가 열 개의 증언을 연결하세요.","{place}로 가는 안전한 길을 찾으세요.",
      "{place}의 신호 오염체를 처치하세요 ({n}/{target}).","{item}을 찾아 회수하세요.","가장 강한 신호를 따라 도마뱀 사령관을 찾으세요.",
      "올바른 순서로 {record}을 작동하세요.",
      "모든 증언에 같은 푸른 파동이 있어. 발생 시간을 합치니 좌표가 됐어. 숲의 신호는 발신지가 아니라 중계점이야. 렌즈를 조정하고 동쪽 길을 열었어. 영상을 지운 자가 다시 움직이기 전에 따라가.",
      "증언 좌표 확인. 동쪽 숲길이 열렸습니다.","기록은 연결되어 있습니다. 먼저 {record}을 해독하세요."
    ],
    es:[
      "MISIONES","Entrevista: {name}","Diez testigos, una señal","Llegar a {place}","Asegurar {place}",
      "Recuperar {item}","La señal del comandante","Romper el velo","El dispositivo responde","Descifrar {record}","Pruebas para el mundo",
      "Habla con {name} y registra su testimonio.","Vuelve con Orla y conecta los diez testimonios.","Encuentra una ruta segura hacia {place}.",
      "Derrota las amenazas corrompidas de {place} ({n}/{target}).","Encuentra y recupera {item}.","Sigue la señal más fuerte y encuentra al comandante.",
      "Activa {record} en la secuencia correcta.",
      "Todos recuerdan el mismo pulso azul. Al ordenar las horas aparecen coordenadas. La señal del bosque es un repetidor, no el origen. Ajusté la lente y abrí la ruta oriental. Síguela antes de que vuelvan a borrar las pruebas.",
      "Testimonios alineados. La ruta oriental está abierta.","Los registros están encadenados. Descifra primero {record}."
    ],
    "pt-BR":[
      "MISSÕES","Entrevista: {name}","Dez testemunhas, um sinal","Chegar a {place}","Proteger {place}",
      "Recuperar {item}","O sinal do comandante","Romper o véu","O dispositivo responde","Decodificar {record}","Provas para o mundo",
      "Fale com {name} e registre o depoimento.","Volte a Orla e conecte os dez depoimentos.","Encontre uma rota segura para {place}.",
      "Derrote as ameaças corrompidas em {place} ({n}/{target}).","Encontre e recupere {item}.","Siga o sinal mais forte e encontre o comandante.",
      "Ative {record} na sequência correta.",
      "Todos lembram do mesmo pulso azul. Os horários formam coordenadas. O sinal da floresta é um retransmissor, não a origem. Ajustei a lente e abri a rota leste. Siga antes que apaguem as provas novamente.",
      "Depoimentos alinhados. A rota leste está aberta.","Os registros estão ligados. Decodifique primeiro {record}."
    ],
    fr:[
      "QUÊTES","Interroger : {name}","Dix témoins, un signal","Atteindre {place}","Sécuriser {place}",
      "Récupérer {item}","Le signal du commandant","Briser le voile","L'appareil répond","Décoder {record}","La preuve pour le monde",
      "Parlez à {name} et consignez son témoignage.","Retournez voir Orla et reliez les dix témoignages.","Trouvez un passage sûr vers {place}.",
      "Éliminez les menaces corrompues de {place} ({n}/{target}).","Trouvez et récupérez {item}.","Suivez le signal le plus fort et trouvez le commandant.",
      "Activez {record} dans le bon ordre.",
      "Tous décrivent la même impulsion bleue. Les heures forment des coordonnées. Le signal de la forêt est un relais, pas la source. J'ai réglé la lentille et ouvert la route est. Suis-la avant qu'ils n'effacent encore les preuves.",
      "Témoignages alignés. La route est ouverte.","Les archives sont enchaînées. Décodez d'abord {record}."
    ],
    de:[
      "AUFTRÄGE","Befragung: {name}","Zehn Zeugen, ein Signal","{place} erreichen","{place} sichern",
      "{item} bergen","Das Signal des Kommandanten","Den Schleier brechen","Das Gerät antwortet","{record} entschlüsseln","Beweise für die Welt",
      "Sprich mit {name} und sichere die Aussage.","Kehre zu Orla zurück und verbinde alle zehn Aussagen.","Finde einen sicheren Weg nach {place}.",
      "Besiege die signalverseuchten Gefahren in {place} ({n}/{target}).","Finde und berge {item}.","Folge dem stärksten Signal zum Kommandanten.",
      "Aktiviere {record} in der richtigen Reihenfolge.",
      "Alle Aussagen nennen denselben blauen Impuls. Die Zeiten ergeben Koordinaten. Das Waldsignal ist ein Relais, nicht die Quelle. Ich habe die Linse justiert und den Ostweg geöffnet. Folge ihm, bevor die Beweise wieder verschwinden.",
      "Aussagen abgeglichen. Der Ostweg ist offen.","Die Akten sind verkettet. Entschlüssle zuerst {record}."
    ],
    it:[
      "MISSIONI","Intervista: {name}","Dieci testimoni, un segnale","Raggiungi {place}","Metti in sicurezza {place}",
      "Recupera {item}","Il segnale del comandante","Spezza il velo","Il dispositivo risponde","Decodifica {record}","Prove per il mondo",
      "Parla con {name} e registra la testimonianza.","Torna da Orla e collega le dieci testimonianze.","Trova un percorso sicuro verso {place}.",
      "Sconfiggi le minacce corrotte di {place} ({n}/{target}).","Trova e recupera {item}.","Segui il segnale più forte e trova il comandante.",
      "Attiva {record} nella sequenza corretta.",
      "Tutti ricordano lo stesso impulso blu. Gli orari formano coordinate. Il segnale della foresta è un ripetitore, non la fonte. Ho regolato la lente e aperto la via est. Seguila prima che cancellino di nuovo le prove.",
      "Testimonianze allineate. La via est è aperta.","I registri sono concatenati. Decodifica prima {record}."
    ],
    ru:[
      "ЗАДАНИЯ","Опрос: {name}","Десять свидетелей, один сигнал","Достичь {place}","Зачистить {place}",
      "Найти {item}","Сигнал командира","Разорвать завесу","Ответ устройства","Расшифровать {record}","Доказательства для мира",
      "Поговорите с {name} и запишите показания.","Вернитесь к Орле и сопоставьте десять показаний.","Найдите безопасный путь в {place}.",
      "Уничтожьте заражённые угрозы в {place} ({n}/{target}).","Найдите и заберите {item}.","Следуйте сильнейшему сигналу и найдите командира.",
      "Активируйте {record} в правильном порядке.",
      "Все описывают один синий импульс. Время событий складывается в координаты. Лесной сигнал — ретранслятор, не источник. Я настроила линзу и открыла восточный путь. Иди, пока доказательства снова не стёрли.",
      "Показания сопоставлены. Восточный путь открыт.","Записи связаны. Сначала расшифруйте {record}."
    ],
    hi:[
      "मिशन","साक्षात्कार: {name}","दस गवाह, एक संकेत","{place} पहुँचें","{place} सुरक्षित करें",
      "{item} प्राप्त करें","कमांडर का संकेत","परदा तोड़ें","उपकरण का उत्तर","{record} पढ़ें","दुनिया के लिए प्रमाण",
      "{name} से बात कर उनका बयान दर्ज करें।","ऑर्ला के पास लौटकर दसों बयान जोड़ें।","{place} तक सुरक्षित रास्ता खोजें।",
      "{place} में सिग्नल से दूषित खतरों को हराएँ ({n}/{target})।","{item} खोजकर प्राप्त करें।","सबसे मजबूत संकेत का पीछा कर कमांडर को खोजें।",
      "{record} को सही क्रम में सक्रिय करें।",
      "हर बयान में वही नीला स्पंदन है। समय जोड़ने पर निर्देशांक बने। जंगल का संकेत स्रोत नहीं, रिले है। मैंने लेंस मिलाकर पूर्वी रास्ता खोल दिया है। प्रमाण फिर मिटने से पहले आगे बढ़ो।",
      "बयानों से स्थान मिला। पूर्वी रास्ता खुला।","अभिलेख जुड़े हैं। पहले {record} पढ़ें।"
    ],
    ar:[
      "المهام","استجواب: {name}","عشرة شهود، إشارة واحدة","الوصول إلى {place}","تأمين {place}",
      "استعادة {item}","إشارة القائد","كسر الحجاب","استجابة الجهاز","فك {record}","دليل للعالم",
      "تحدث مع {name} وسجل الشهادة.","عد إلى أورلا واربط شهادات الشهود العشرة.","اعثر على طريق آمن إلى {place}.",
      "اهزم التهديدات الملوثة في {place} ({n}/{target}).","اعثر على {item} واستعده.","اتبع أقوى إشارة واعثر على القائد.",
      "فعّل {record} بالترتيب الصحيح.",
      "كل الشهادات تذكر النبضة الزرقاء نفسها. أوقاتها ترسم إحداثيات. إشارة الغابة مرحل وليست المصدر. عايرت العدسة وفتحت الطريق الشرقي. اتبعه قبل أن يمحوا الأدلة من جديد.",
      "تم ربط الشهادات. الطريق الشرقي مفتوح.","السجلات مترابطة. فك أولاً {record}."
    ]
  };
  for(const [code,values] of Object.entries(questSystemCopy)){
    Object.assign(localeRegistry[code],Object.fromEntries(questSystemKeys.map((key,index)=>[key,values[index]])));
  }
  const chapterTwoKeys=[
    "zoneMoonfall","objectiveReturnOrla","objectiveEnterMoonfall","objectiveMoonfallEnemies",
    "objectiveRelays","objectiveReturnMoonfall","objectiveFinalReturn","objectiveStoryComplete",
    "chapter2Briefing","chapter2Debrief","chapter2After","moonfallUnlocked","moonfallArrival","townReturn",
    "relayLocked","relayActivated","relayOrigin","relayMemory","relayWarning",
    "relayMessage1","relayMessage2","relayMessage3","guideChapterTwoTitle","guideChapterTwo"
  ];
  const chapterTwoCopy={
    en:[
      "Moonfall Relay","Return to Orla with the Commander's device.","Use the laboratory gate to enter Moonfall Relay.",
      "Clear the signal-corrupted sentries ({n}/8).","Activate the three memory relays ({n}/3).","Return through the gate and bring the records to Orla.",
      "Return to Orla in Signal Town.","The records are safe. Travel freely between both maps.",
      "The device is answering a relay outside our mapped world. I opened the laboratory gate. Go to Moonfall, clear the corrupted sentries, and recover all three records.",
      "Now we know the truth. The Lizards sent an evacuation warning, not an invasion signal. Helix Directorate stole it and used Neural Vision to hide its experiments. We will expose them together.",
      "Moonfall is stable now. Both gates remain open whenever you need to investigate either side.",
      "Moonfall Relay route unlocked.","Moonfall Relay: the same signal, reflected through a broken network.","Returned to Signal Town.",
      "Signal interference is too strong. Clear all eight sentries first.","Memory relay activated ({n}/3).",
      "Origin Record","Memory Record","Warning Record",
      "Record one: the Lizard fleet fled a dying moon and requested sanctuary.",
      "Record two: Helix Directorate intercepted the plea and built disguises from its neural pattern.",
      "Record three: the Commander guarded the evidence so Helix could not erase it.",
      "Two-map investigation","After defeating the Commander, report to Orla to unlock Moonfall Relay. Clear eight corrupted sentries, activate three records, then return to Orla. The laboratory gate and Moonfall return gate remain open, so quests and exploration can continue across both maps."
    ],
    "zh-Hant":[
      "月落中繼站","帶著指揮官的裝置回去找奧拉。","從實驗室閘門前往月落中繼站。",
      "清除受到訊號侵蝕的哨兵（{n}/8）。","啟動三座記憶節點（{n}/3）。","穿過閘門，把紀錄帶回給奧拉。",
      "返回訊號鎮找奧拉。","紀錄已安全回收，可以自由往返兩張地圖。",
      "裝置正在回應一個不存在於地圖上的中繼站。我已開啟實驗室閘門。前往月落，清除被侵蝕的哨兵，帶回三份完整紀錄。",
      "真相終於完整了。蜥蜴族送來的是撤離警告，不是入侵訊號。赫利克斯局攔截訊息，還利用神經視覺掩蓋人體實驗。我們會一起公開證據。",
      "月落中繼站已穩定。兩邊閘門會保持開啟，隨時都能繼續調查。",
      "已解鎖月落中繼站路線。","月落中繼站：同一道訊號，在破碎網路中的倒影。","已返回訊號鎮。",
      "訊號干擾太強，先清除八名哨兵。","記憶節點已啟動（{n}/3）。",
      "起源紀錄","記憶紀錄","警告紀錄",
      "紀錄一：蜥蜴艦隊逃離一顆垂死的月球，向地球請求庇護。",
      "紀錄二：赫利克斯局攔截求救訊息，並用其中的神經模式製造偽裝。",
      "紀錄三：指揮官守護證據，是為了阻止赫利克斯將真相抹除。",
      "雙地圖調查","擊敗指揮官後回報奧拉，即可解鎖月落中繼站。清除八名受侵蝕的哨兵、啟動三份紀錄，再回到訊號鎮交付證據。實驗室與月落的閘門會持續開放，可以在兩張地圖間往返解任務。"
    ],
    "zh-Hans":[
      "月落中继站","带着指挥官的装置回去找奥拉。","从实验室闸门前往月落中继站。",
      "清除受到信号侵蚀的哨兵（{n}/8）。","启动三座记忆节点（{n}/3）。","穿过闸门，把记录带回给奥拉。",
      "返回信号镇找奥拉。","记录已安全回收，可以自由往返两张地图。",
      "装置正在回应一个不存在于地图上的中继站。我已开启实验室闸门。前往月落，清除被侵蚀的哨兵，带回三份完整记录。",
      "真相终于完整了。蜥蜴族送来的是撤离警告，不是入侵信号。赫利克斯局拦截信息，还利用神经视觉掩盖人体实验。我们会一起公开证据。",
      "月落中继站已稳定。两边闸门会保持开启，随时都能继续调查。",
      "已解锁月落中继站路线。","月落中继站：同一道信号，在破碎网络中的倒影。","已返回信号镇。",
      "信号干扰太强，先清除八名哨兵。","记忆节点已启动（{n}/3）。",
      "起源记录","记忆记录","警告记录",
      "记录一：蜥蜴舰队逃离一颗垂死的月球，向地球请求庇护。",
      "记录二：赫利克斯局拦截求救信息，并用其中的神经模式制造伪装。",
      "记录三：指挥官守护证据，是为了阻止赫利克斯将真相抹除。",
      "双地图调查","击败指挥官后向奥拉报告，即可解锁月落中继站。清除八名哨兵、启动三份记录，再回到信号镇交付证据。两边闸门会持续开放，可以往返完成任务。"
    ],
    ja:[
      "ムーンフォール中継局","司令官の装置をオルラに届ける。","研究所のゲートからムーンフォールへ向かう。",
      "信号に侵された番兵を倒す（{n}/8）。","3基の記憶リレーを起動する（{n}/3）。","ゲートを戻り、記録をオルラに届ける。",
      "シグナルタウンのオルラに戻る。","記録を回収した。2つのマップを自由に移動できる。",
      "装置が地図にない中継局へ応答している。研究所のゲートを開いた。ムーンフォールで番兵を排除し、3つの記録を回収して。",
      "真相が分かった。トカゲ族の信号は侵略ではなく避難警告だった。ヘリックス局が傍受し、神経パターンを人体実験の隠蔽に使った。証拠を公開しよう。",
      "ムーンフォールは安定した。両方のゲートは開いたままだ。",
      "ムーンフォールへの経路を解除。","ムーンフォール中継局。同じ信号が壊れた網に反射している。","シグナルタウンへ帰還。",
      "干渉が強すぎる。先に8体の番兵を倒そう。","記憶リレー起動（{n}/3）。",
      "起源記録","記憶記録","警告記録",
      "記録1：トカゲ艦隊は死にゆく月から逃れ、保護を求めていた。",
      "記録2：ヘリックス局は救難信号を奪い、神経パターンで偽装を作った。",
      "記録3：司令官は証拠を消されないよう守っていた。",
      "2マップ調査","司令官を倒したらオルラへ報告し、ムーンフォールを解放する。8体の番兵を倒し、3つの記録を起動して戻ろう。2つのゲートは開いたままなので、両マップを往復できる。"
    ],
    ko:[
      "문폴 중계소","사령관의 장치를 오를라에게 가져가세요.","연구소 관문으로 문폴 중계소에 들어가세요.",
      "신호에 오염된 보초를 처치하세요 ({n}/8).","기억 중계기 세 개를 작동하세요 ({n}/3).","관문을 돌아가 기록을 오를라에게 전하세요.",
      "시그널 타운의 오를라에게 돌아가세요.","기록을 확보했습니다. 두 지도를 자유롭게 오갈 수 있습니다.",
      "장치가 지도에 없는 중계소에 응답해. 연구소 관문을 열었어. 문폴의 오염된 보초를 없애고 세 기록을 회수해 줘.",
      "진실이 드러났어. 도마뱀 종족의 신호는 침공이 아니라 대피 경고였어. 헬릭스 국이 이를 가로채 신경 패턴으로 실험을 숨겼지. 함께 증거를 공개하자.",
      "문폴이 안정됐어. 두 관문은 계속 열려 있을 거야.",
      "문폴 중계소 경로가 열렸습니다.","문폴 중계소: 부서진 망에 비친 같은 신호.","시그널 타운으로 돌아왔습니다.",
      "간섭이 너무 강합니다. 먼저 보초 여덟을 처치하세요.","기억 중계기 작동 ({n}/3).",
      "기원 기록","기억 기록","경고 기록",
      "기록 1: 도마뱀 함대는 죽어 가는 달에서 탈출해 피난처를 요청했다.",
      "기록 2: 헬릭스 국은 구조 신호를 가로채 신경 패턴으로 위장을 만들었다.",
      "기록 3: 사령관은 헬릭스가 증거를 지우지 못하도록 지키고 있었다.",
      "두 지도 조사","사령관을 쓰러뜨린 뒤 오를라에게 보고해 문폴을 여세요. 보초 여덟을 처치하고 기록 세 개를 작동한 뒤 돌아오세요. 두 관문은 계속 열려 있어 양쪽 지도의 임무를 이어갈 수 있습니다."
    ],
    es:[
      "Repetidor Moonfall","Lleva el dispositivo del comandante a Orla.","Usa el portal del laboratorio para entrar en Moonfall.",
      "Elimina a los centinelas corruptos ({n}/8).","Activa los tres repetidores de memoria ({n}/3).","Vuelve por el portal y entrega los registros a Orla.",
      "Regresa con Orla en Pueblo Señal.","Los registros están a salvo. Puedes viajar entre ambos mapas.",
      "El dispositivo responde a un repetidor fuera del mapa. Abrí el portal del laboratorio. Ve a Moonfall, elimina a los centinelas y recupera los tres registros.",
      "Ya conocemos la verdad. Los Lagartos enviaron una alerta de evacuación, no una invasión. La Dirección Helix la robó y usó el patrón neural para ocultar sus experimentos. Publicaremos las pruebas.",
      "Moonfall está estable. Ambos portales seguirán abiertos.",
      "Ruta a Moonfall desbloqueada.","Moonfall: la misma señal reflejada en una red rota.","Has vuelto a Pueblo Señal.",
      "La interferencia es muy fuerte. Elimina primero a los ocho centinelas.","Repetidor de memoria activado ({n}/3).",
      "Registro de origen","Registro de memoria","Registro de alerta",
      "Registro uno: la flota Lagarto huyó de una luna moribunda y pidió refugio.",
      "Registro dos: Helix interceptó la petición y creó disfraces con su patrón neural.",
      "Registro tres: el comandante protegía las pruebas para impedir que Helix las borrara.",
      "Investigación en dos mapas","Tras vencer al comandante, informa a Orla para abrir Moonfall. Elimina ocho centinelas, activa tres registros y regresa. Los dos portales permanecen abiertos para completar misiones en ambos mapas."
    ],
    "pt-BR":[
      "Retransmissor Moonfall","Leve o dispositivo do comandante até Orla.","Use o portal do laboratório para entrar em Moonfall.",
      "Elimine as sentinelas corrompidas ({n}/8).","Ative os três retransmissores de memória ({n}/3).","Volte pelo portal e entregue os registros a Orla.",
      "Retorne a Orla na Cidade Sinal.","Os registros estão seguros. Viaje livremente entre os dois mapas.",
      "O dispositivo responde a um retransmissor fora do mapa. Abri o portal do laboratório. Vá a Moonfall, elimine as sentinelas e recupere os três registros.",
      "Agora sabemos a verdade. Os Lagartos enviaram um alerta de evacuação, não de invasão. A Diretoria Helix o roubou e usou o padrão neural para esconder seus experimentos. Vamos revelar as provas.",
      "Moonfall está estável. Os dois portais continuarão abertos.",
      "Rota para Moonfall desbloqueada.","Moonfall: o mesmo sinal refletido por uma rede quebrada.","Você voltou à Cidade Sinal.",
      "A interferência está forte demais. Elimine primeiro as oito sentinelas.","Retransmissor de memória ativado ({n}/3).",
      "Registro de origem","Registro de memória","Registro de alerta",
      "Registro um: a frota Lagarto fugiu de uma lua moribunda e pediu abrigo.",
      "Registro dois: a Diretoria Helix interceptou o pedido e criou disfarces com o padrão neural.",
      "Registro três: o comandante protegia as provas para impedir que Helix as apagasse.",
      "Investigação em dois mapas","Após derrotar o comandante, fale com Orla para abrir Moonfall. Elimine oito sentinelas, ative três registros e retorne. Os portais permanecem abertos para missões nos dois mapas."
    ],
    fr:[
      "Relais Moonfall","Rapportez l'appareil du commandant à Orla.","Empruntez le portail du laboratoire vers Moonfall.",
      "Éliminez les sentinelles corrompues ({n}/8).","Activez les trois relais de mémoire ({n}/3).","Revenez par le portail et remettez les archives à Orla.",
      "Retournez voir Orla à Signalville.","Les archives sont sûres. Voyagez librement entre les deux cartes.",
      "L'appareil répond à un relais absent de nos cartes. J'ai ouvert le portail du laboratoire. Va à Moonfall, élimine les sentinelles et récupère les trois archives.",
      "Nous connaissons la vérité. Les Lézards ont envoyé une alerte d'évacuation, pas un signal d'invasion. La Direction Helix l'a volée pour cacher ses expériences. Nous révélerons les preuves.",
      "Moonfall est stable. Les deux portails resteront ouverts.",
      "Route de Moonfall déverrouillée.","Moonfall : le même signal reflété par un réseau brisé.","Retour à Signalville.",
      "L'interférence est trop forte. Éliminez d'abord les huit sentinelles.","Relais de mémoire activé ({n}/3).",
      "Archive d'origine","Archive de mémoire","Archive d'alerte",
      "Archive un : la flotte Lézard fuyait une lune mourante et demandait refuge.",
      "Archive deux : Helix a intercepté l'appel et créé des déguisements avec son motif neural.",
      "Archive trois : le commandant protégeait les preuves pour empêcher Helix de les effacer.",
      "Enquête sur deux cartes","Après le commandant, parlez à Orla pour ouvrir Moonfall. Éliminez huit sentinelles, activez trois archives puis revenez. Les portails restent ouverts pour poursuivre les missions sur les deux cartes."
    ],
    de:[
      "Moonfall-Relais","Bringe Orla das Gerät des Kommandanten.","Nutze das Labortor zum Moonfall-Relais.",
      "Besiege die signalverseuchten Wächter ({n}/8).","Aktiviere die drei Erinnerungsrelais ({n}/3).","Kehre durchs Tor zurück und bringe Orla die Aufzeichnungen.",
      "Kehre zu Orla in Signalstadt zurück.","Die Aufzeichnungen sind sicher. Reise frei zwischen beiden Karten.",
      "Das Gerät antwortet einem Relais außerhalb unserer Karten. Ich habe das Labortor geöffnet. Geh nach Moonfall, besiege die Wächter und sichere alle drei Aufzeichnungen.",
      "Jetzt kennen wir die Wahrheit. Die Echsen sendeten eine Evakuierungswarnung, kein Invasionssignal. Die Helix-Direktion stahl sie und verbarg damit ihre Experimente. Wir veröffentlichen die Beweise.",
      "Moonfall ist stabil. Beide Tore bleiben geöffnet.",
      "Route nach Moonfall freigeschaltet.","Moonfall: dasselbe Signal, gespiegelt in einem zerbrochenen Netz.","Zurück in Signalstadt.",
      "Die Störung ist zu stark. Besiege zuerst alle acht Wächter.","Erinnerungsrelais aktiviert ({n}/3).",
      "Ursprungsakte","Erinnerungsakte","Warnakte",
      "Akte eins: Die Echsenflotte floh von einem sterbenden Mond und bat um Schutz.",
      "Akte zwei: Helix fing den Hilferuf ab und baute Tarnungen aus seinem Neuralmuster.",
      "Akte drei: Der Kommandant schützte die Beweise vor Helix.",
      "Ermittlung auf zwei Karten","Melde dich nach dem Kommandanten bei Orla und öffne Moonfall. Besiege acht Wächter, aktiviere drei Akten und kehre zurück. Beide Tore bleiben für Aufgaben auf beiden Karten offen."
    ],
    it:[
      "Ripetitore Moonfall","Porta a Orla il dispositivo del comandante.","Usa il portale del laboratorio per entrare a Moonfall.",
      "Elimina le sentinelle corrotte ({n}/8).","Attiva i tre ripetitori di memoria ({n}/3).","Torna dal portale e consegna i registri a Orla.",
      "Torna da Orla a Città Segnale.","I registri sono al sicuro. Viaggia liberamente fra le due mappe.",
      "Il dispositivo risponde a un ripetitore fuori dalle mappe. Ho aperto il portale del laboratorio. Vai a Moonfall, elimina le sentinelle e recupera i tre registri.",
      "Ora sappiamo la verità. I Rettili inviarono un allarme di evacuazione, non d'invasione. La Direzione Helix lo rubò e usò il modello neurale per nascondere gli esperimenti. Riveleremo le prove.",
      "Moonfall è stabile. Entrambi i portali resteranno aperti.",
      "Percorso per Moonfall sbloccato.","Moonfall: lo stesso segnale riflesso in una rete spezzata.","Ritorno a Città Segnale.",
      "L'interferenza è troppo forte. Elimina prima le otto sentinelle.","Ripetitore di memoria attivato ({n}/3).",
      "Registro d'origine","Registro di memoria","Registro d'allarme",
      "Registro uno: la flotta Rettiliana fuggì da una luna morente e chiese rifugio.",
      "Registro due: Helix intercettò la richiesta e creò camuffamenti dal modello neurale.",
      "Registro tre: il comandante proteggeva le prove perché Helix non le cancellasse.",
      "Indagine su due mappe","Dopo il comandante, parla con Orla per aprire Moonfall. Elimina otto sentinelle, attiva tre registri e torna. I portali restano aperti per le missioni su entrambe le mappe."
    ],
    ru:[
      "Ретранслятор Мунфолл","Отнесите устройство командира Орле.","Войдите в Мунфолл через врата лаборатории.",
      "Уничтожьте заражённых сигналом стражей ({n}/8).","Активируйте три ретранслятора памяти ({n}/3).","Вернитесь через врата и отдайте записи Орле.",
      "Вернитесь к Орле в Сигнал-Сити.","Записи спасены. Между двумя картами можно путешествовать свободно.",
      "Устройство отвечает ретранслятору вне наших карт. Я открыла врата лаборатории. Иди в Мунфолл, уничтожь стражей и забери три записи.",
      "Теперь правда ясна. Ящеры отправили предупреждение об эвакуации, а не сигнал вторжения. Дирекция «Геликс» перехватила его и скрыла свои опыты. Мы обнародуем доказательства.",
      "Мунфолл стабилен. Оба портала останутся открыты.",
      "Маршрут в Мунфолл открыт.","Мунфолл: тот же сигнал в отражении сломанной сети.","Возвращение в Сигнал-Сити.",
      "Помехи слишком сильны. Сначала уничтожьте восемь стражей.","Ретранслятор памяти активирован ({n}/3).",
      "Запись истока","Запись памяти","Запись предупреждения",
      "Запись первая: флот Ящеров покинул умирающую луну и попросил убежища.",
      "Запись вторая: «Геликс» перехватил просьбу и создал маскировку из нейронного узора.",
      "Запись третья: командир охранял доказательства от уничтожения.",
      "Расследование на двух картах","После победы над командиром доложите Орле и откройте Мунфолл. Уничтожьте восемь стражей, включите три записи и вернитесь. Оба портала остаются открыты для заданий на двух картах."
    ],
    hi:[
      "मूनफॉल रिले","कमांडर का उपकरण ऑर्ला को दें।","प्रयोगशाला द्वार से मूनफॉल रिले जाएँ।",
      "सिग्नल से दूषित प्रहरी हटाएँ ({n}/8)।","तीन स्मृति रिले चालू करें ({n}/3)।","द्वार से लौटकर अभिलेख ऑर्ला को दें।",
      "सिग्नल टाउन में ऑर्ला के पास लौटें।","अभिलेख सुरक्षित हैं। दोनों नक्शों के बीच स्वतंत्र यात्रा करें।",
      "उपकरण हमारे नक्शे से बाहर एक रिले को उत्तर दे रहा है। मैंने प्रयोगशाला द्वार खोल दिया है। मूनफॉल जाओ, दूषित प्रहरियों को हटाओ और तीनों अभिलेख लाओ।",
      "अब सच साफ है। छिपकली जाति ने आक्रमण नहीं, निकासी चेतावनी भेजी थी। हेलिक्स निदेशालय ने उसे चुराकर अपने प्रयोग छिपाए। हम प्रमाण सामने लाएँगे।",
      "मूनफॉल स्थिर है। दोनों द्वार खुले रहेंगे।",
      "मूनफॉल मार्ग खुल गया।","मूनफॉल: टूटी हुई जाल में उसी सिग्नल का प्रतिबिंब।","सिग्नल टाउन लौट आए।",
      "हस्तक्षेप बहुत तेज है। पहले आठों प्रहरी हटाएँ।","स्मृति रिले सक्रिय ({n}/3)।",
      "उद्गम अभिलेख","स्मृति अभिलेख","चेतावनी अभिलेख",
      "अभिलेख एक: छिपकली बेड़ा मरते चंद्रमा से भागकर शरण माँग रहा था।",
      "अभिलेख दो: हेलिक्स ने पुकार रोककर उसके तंत्रिका पैटर्न से छद्मावरण बनाया।",
      "अभिलेख तीन: कमांडर प्रमाण को हेलिक्स से बचा रहा था।",
      "दो नक्शों की जाँच","कमांडर को हराकर ऑर्ला को सूचना दें और मूनफॉल खोलें। आठ प्रहरी हटाएँ, तीन अभिलेख सक्रिय करें और लौटें। दोनों द्वार खुले रहते हैं, इसलिए दोनों नक्शों में मिशन पूरे किए जा सकते हैं।"
    ],
    ar:[
      "مرحل مونفول","أعد جهاز القائد إلى أورلا.","استخدم بوابة المختبر لدخول مونفول.",
      "اقضِ على الحراس الملوثين بالإشارة ({n}/8).","فعّل مرحلات الذاكرة الثلاثة ({n}/3).","عد عبر البوابة وسلم السجلات إلى أورلا.",
      "عد إلى أورلا في بلدة الإشارة.","السجلات آمنة. يمكنك التنقل بحرية بين الخريطتين.",
      "الجهاز يجيب مرحلاً خارج خرائطنا. فتحت بوابة المختبر. اذهب إلى مونفول، أزل الحراس الملوثين واستعد السجلات الثلاثة.",
      "عرفنا الحقيقة. أرسل السحالي تحذير إخلاء لا إشارة غزو. سرقت مديرية هيليكس الرسالة واستخدمت نمطها العصبي لإخفاء تجاربها. سنكشف الأدلة.",
      "استقر مونفول. ستظل البوابتان مفتوحتين.",
      "فُتح طريق مونفول.","مونفول: الإشارة نفسها منعكسة في شبكة محطمة.","عدت إلى بلدة الإشارة.",
      "التشويش شديد. اقضِ أولاً على الحراس الثمانية.","تم تفعيل مرحل الذاكرة ({n}/3).",
      "سجل الأصل","سجل الذاكرة","سجل التحذير",
      "السجل الأول: هرب أسطول السحالي من قمر يحتضر وطلب الملجأ.",
      "السجل الثاني: اعترضت هيليكس النداء وصنعت تمويهاً من نمطه العصبي.",
      "السجل الثالث: كان القائد يحمي الأدلة كي لا تمحوها هيليكس.",
      "تحقيق بخريطتين","بعد هزيمة القائد، أبلغ أورلا لفتح مونفول. اقضِ على ثمانية حراس وفعّل ثلاثة سجلات ثم عد. تبقى البوابتان مفتوحتين لمهام الخريطتين."
    ]
  };
  for(const [code,values] of Object.entries(chapterTwoCopy)){
    Object.assign(localeRegistry[code],Object.fromEntries(chapterTwoKeys.map((key,index)=>[key,values[index]])));
  }

  const chapterThreeKeys=[
    "zoneAshfall","ashfallUnlocked","ashfallArrival","ashfallReturn","chapter3Briefing","chapter3Reminder",
    "chapter3DebriefBroadcast","chapter3DebriefProtect","chapter3After",
    "ashfallSurvivorName","ashfallSurvivorMessage","ashfallManifestName","ashfallManifestMessage",
    "ashfallJammerName","ashfallJammerMessage","ashfallCoreName","ashfallCoreMessage",
    "ashfallBroadcast","ashfallProtect","ashfallBroadcastChosen","ashfallProtectChosen",
    "objectiveAshfallBriefing","questAshfallEvidenceObjective","objectiveAshfallChoice","objectiveAshfallReturn","objectiveAshfallFinal"
  ];
  const chapterThreeCopy={
    en:[
      "Ashfall Observatory","Ashfall Observatory route unlocked.","Ashfall Observatory: Helix burned the sky to bury a witness.","Returned from Ashfall.",
      "The Warning Record names Ashfall Observatory. Helix marked one technician alive, then ordered the site erased. Moonfall's eastern gate can still reach it. Find the survivor before Helix finishes the purge.",
      "Use Moonfall's eastern gate. A living witness is waiting at Ashfall.",
      "The evidence is already across the open network. Helix cannot call this a fake anymore—but they now know exactly where we are.",
      "Aster is safe and the black box is intact. We will release the proof through trusted stations, slowly enough to keep Helix from tracing her.",
      "Ashfall changed the investigation. The world knows Helix exists, and Aster chose to stay with us.",
      "Aster Vale","I maintained Helix's disguise array. When I learned it was rewriting human witnesses, I copied the launch manifest. They burned the observatory to erase me.",
      "Evacuation Manifest","The manifest lists civilian Lizard ships as refugees. Helix relabeled every passenger vessel as an invasion carrier.",
      "Perception Jammer","The jammer did not hide Lizard bodies. It edited human memory after every sighting—and the test population was Signal Town.",
      "Ashfall Black Box","The black box holds enough proof to expose Helix, but one live transmission will reveal Aster's location. Broadcast now, or protect the witness and carry the archive home.",
      "Broadcast the evidence","Protect Aster","The truth is live. Attack increased by 2.","Aster is protected. Maximum health +8 and defense +2.",
      "Return to Orla; the Warning Record contains a new location.","Investigate {evidence} at Ashfall Observatory.","Choose whether to broadcast now or protect Aster.","Bring Aster and the black box back through Moonfall.","Return to Orla and decide how the world will hear the truth."
    ],
    "zh-Hant":[
      "灰燼天文台","已解鎖灰燼天文台路線。","灰燼天文台：Helix 燒毀天空，只為埋葬一名證人。","已從灰燼天文台返回。",
      "警告紀錄提到灰燼天文台。Helix 標記了一名仍然生還的技術員，隨後下令抹除整座設施。月落中繼站的東側門仍能抵達那裡。在清除行動完成前找到生還者。",
      "使用月落中繼站的東側門。一名活著的證人正在灰燼天文台等待。",
      "證據已經傳遍公開網路。Helix 再也不能說它是偽造影片——但他們也知道我們的位置了。",
      "Aster 已安全，黑盒也完整保存。我們會透過可信任的站點逐步公開證據，讓 Helix 無法追蹤她。",
      "灰燼天文台改變了整起調查。世界已知道 Helix 的存在，而 Aster 選擇留下與我們並肩。",
      "Aster Vale","我負責維護 Helix 的偽裝陣列。發現它會重寫人類目擊者的記憶後，我複製了發射清單。他們燒掉天文台，就是為了抹除我。",
      "撤離船隊清單","清單證明蜥蜴人的民用船隊是難民。Helix 把每一艘載客船都重新標記成入侵艦。",
      "感知干擾器","干擾器不是隱藏蜥蜴人的身體，而是在每次目擊後改寫人類記憶；實驗人口正是訊號鎮。",
      "灰燼黑盒","黑盒足以揭露 Helix，但即時傳送會暴露 Aster 的位置。現在公開，或保護證人並把資料帶回去。",
      "立即公開證據","保護 Aster","真相已公開，攻擊力提升 2。","Aster 已受保護，最大生命提升 8、防禦提升 2。",
      "回去找 Orla；警告紀錄包含一個新地點。","在灰燼天文台調查「{evidence}」。","決定立即公開，或優先保護 Aster。","帶著 Aster 與黑盒穿過月落中繼站。","回去找 Orla，決定世界將如何聽見真相。"
    ],
    "zh-Hans":[
      "灰烬天文台","已解锁灰烬天文台路线。","灰烬天文台：Helix 焚烧天空，只为埋葬一名证人。","已从灰烬天文台返回。",
      "警告记录提到灰烬天文台。Helix 标记了一名幸存技术员，随后下令抹除设施。月落中继站的东门仍能抵达那里。请在清除行动完成前找到幸存者。",
      "使用月落中继站的东门。一名活着的证人正在灰烬天文台等待。",
      "证据已传遍公开网络。Helix 再也不能说它是伪造影片——但他们也知道我们的位置了。",
      "Aster 已安全，黑匣子也完整保存。我们会通过可信站点逐步公开证据，让 Helix 无法追踪她。",
      "灰烬天文台改变了调查。世界已知道 Helix 的存在，Aster 也选择与我们并肩。",
      "Aster Vale","我维护 Helix 的伪装阵列。发现它会改写目击者记忆后，我复制了发射清单。他们烧掉天文台，就是为了抹除我。",
      "撤离船队清单","清单证明蜥蜴人的民用船队是难民。Helix 把每艘客船都重新标记成入侵舰。",
      "感知干扰器","干扰器不是隐藏身体，而是在每次目击后改写人类记忆；实验人口正是信号镇。",
      "灰烬黑匣子","黑匣子足以揭露 Helix，但直播会暴露 Aster 的位置。现在公开，或保护证人并带走档案。",
      "立即公开证据","保护 Aster","真相已公开，攻击力提升 2。","Aster 已受保护，最大生命提升 8、防御提升 2。",
      "返回 Orla；警告记录包含一个新地点。","在灰烬天文台调查“{evidence}”。","决定立即公开，或优先保护 Aster。","带着 Aster 和黑匣子穿过月落中继站。","返回 Orla，决定世界将如何听见真相。"
    ],
    ja:[
      "アッシュフォール天文台","アッシュフォール天文台への経路を解放。","アッシュフォール天文台：Helixは証人を消すため空を焼いた。","アッシュフォールから帰還した。",
      "警告記録はアッシュフォール天文台を示している。Helixは生存中の技術者を一人確認し、施設抹消を命じた。ムーンフォール東門から向かい、粛清前に救出しよう。",
      "ムーンフォール東門を使おう。生きた証人が待っている。",
      "証拠は公開網へ流れた。Helixは偽物と言えないが、こちらの位置も知られた。",
      "アスターとブラックボックスは無事だ。追跡されないよう、信頼できる局から段階的に公開する。",
      "世界はHelixの存在を知った。アスターは私たちと共に残る。",
      "アスター・ヴェイル","私はHelixの偽装装置を保守していた。人間の記憶を書き換えると知り、発進記録を複製した。彼らは私を消すため天文台を焼いた。",
      "避難船団名簿","民間船は難民船だった。Helixは全てを侵略船に書き換えた。",
      "知覚ジャマー","身体を隠す装置ではない。目撃後の人間の記憶を編集し、実験対象はシグナルタウンだった。",
      "アッシュフォール・ブラックボックス","Helixを暴けるが、生中継はアスターの位置を明かす。今放送するか、証人を守り持ち帰ろう。",
      "証拠を放送","アスターを守る","真実を放送した。攻撃力+2。","アスターを保護した。最大体力+8、防御+2。",
      "オーラへ戻ろう。警告記録に新たな場所がある。","アッシュフォールで「{evidence}」を調べる。","今放送するかアスターを守るか選ぶ。","アスターとブラックボックスをムーンフォール経由で運ぶ。","オーラへ戻り、真実の伝え方を決める。"
    ],
    ko:[
      "애시폴 천문대","애시폴 천문대 경로가 열렸습니다.","애시폴 천문대: Helix는 증인을 묻으려 하늘을 불태웠습니다.","애시폴에서 돌아왔습니다.",
      "경고 기록은 애시폴 천문대를 가리킵니다. Helix는 생존 기술자 한 명을 확인한 뒤 시설 삭제를 명령했습니다. 문폴 동쪽 문으로 가서 숙청 전에 구조하세요.",
      "문폴 동쪽 문을 사용하세요. 살아 있는 증인이 기다립니다.",
      "증거가 공개망에 퍼졌습니다. Helix는 더는 가짜라 할 수 없지만 우리 위치도 알게 됐습니다.",
      "아스터와 블랙박스는 안전합니다. 추적을 막기 위해 신뢰할 수 있는 방송국에서 단계적으로 공개하겠습니다.",
      "세상은 Helix의 존재를 압니다. 아스터는 우리와 함께 남았습니다.",
      "아스터 베일","저는 Helix 위장 배열을 관리했습니다. 목격자의 기억을 다시 쓴다는 걸 알고 발사 명단을 복사했죠. 그들은 저를 지우려고 천문대를 불태웠습니다.",
      "대피 함대 명단","민간 함선은 난민선이었습니다. Helix는 모두 침공선으로 바꿔 적었습니다.",
      "지각 방해기","몸을 숨긴 게 아니라 목격 뒤 인간의 기억을 편집했습니다. 시험 대상은 시그널 타운이었습니다.",
      "애시폴 블랙박스","Helix를 폭로할 증거지만 생방송은 아스터의 위치를 드러냅니다. 지금 방송하거나 증인을 보호하세요.",
      "증거 방송","아스터 보호","진실을 방송했습니다. 공격력 +2.","아스터를 보호했습니다. 최대 체력 +8, 방어 +2.",
      "오를라에게 돌아가세요. 경고 기록에 새 장소가 있습니다.","애시폴에서 {evidence} 조사.","지금 방송할지 아스터를 보호할지 선택하세요.","아스터와 블랙박스를 문폴을 통해 데려오세요.","오를라에게 돌아가 진실을 알릴 방법을 정하세요."
    ],
    es:[
      "Observatorio Ashfall","Ruta al Observatorio Ashfall desbloqueada.","Observatorio Ashfall: Helix quemó el cielo para enterrar a una testigo.","Regreso desde Ashfall.",
      "El Registro de Advertencia nombra Ashfall. Helix marcó viva a una técnica y ordenó borrar el lugar. La puerta este de Moonfall aún llega allí. Encuéntrala antes de la purga.",
      "Usa la puerta este de Moonfall. Una testigo viva espera en Ashfall.",
      "La prueba ya está en la red abierta. Helix no puede llamarla falsa, pero ahora sabe dónde estamos.",
      "Aster y la caja negra están a salvo. Publicaremos la prueba por estaciones fiables sin revelar su ubicación.",
      "El mundo conoce a Helix y Aster ha decidido quedarse con nosotros.",
      "Aster Vale","Mantenía la red de disfraces de Helix. Al descubrir que reescribía recuerdos, copié el manifiesto. Quemaron el observatorio para borrarme.",
      "Manifiesto de evacuación","Las naves civiles eran refugiados. Helix las etiquetó como transportes de invasión.",
      "Inhibidor perceptivo","No ocultaba cuerpos: editaba la memoria tras cada avistamiento. La población de prueba era Pueblo Señal.",
      "Caja negra de Ashfall","Puede exponer a Helix, pero una transmisión revelará la ubicación de Aster. Emite ahora o protege a la testigo.",
      "Emitir la prueba","Proteger a Aster","La verdad está en directo. Ataque +2.","Aster está protegida. Salud máxima +8 y defensa +2.",
      "Vuelve con Orla; el registro contiene una ubicación nueva.","Investiga {evidence} en Ashfall.","Elige emitir ahora o proteger a Aster.","Lleva a Aster y la caja negra por Moonfall.","Vuelve con Orla y decide cómo oirá el mundo la verdad."
    ],
    "pt-BR":[
      "Observatório Ashfall","Rota para o Observatório Ashfall liberada.","Observatório Ashfall: a Helix queimou o céu para enterrar uma testemunha.","Retorno de Ashfall.",
      "O Registro de Alerta cita Ashfall. A Helix marcou uma técnica viva e ordenou apagar o local. O portão leste de Moonfall ainda chega lá. Encontre-a antes da limpeza.",
      "Use o portão leste de Moonfall. Uma testemunha viva espera em Ashfall.",
      "A prova está na rede aberta. A Helix não pode chamá-la de falsa, mas agora sabe onde estamos.",
      "Aster e a caixa-preta estão seguras. Vamos divulgar por estações confiáveis sem revelar sua localização.",
      "O mundo conhece a Helix, e Aster decidiu ficar conosco.",
      "Aster Vale","Eu mantinha a rede de disfarce da Helix. Ao descobrir que reescrevia memórias, copiei o manifesto. Queimaram o observatório para me apagar.",
      "Manifesto de evacuação","As naves civis eram de refugiados. A Helix marcou todas como transportes de invasão.",
      "Bloqueador perceptivo","Não escondia corpos; editava memórias após cada avistamento. A população de teste era Signal Town.",
      "Caixa-preta de Ashfall","Ela pode expor a Helix, mas uma transmissão revela Aster. Transmita agora ou proteja a testemunha.",
      "Transmitir a prova","Proteger Aster","A verdade está no ar. Ataque +2.","Aster está protegida. Vida máxima +8 e defesa +2.",
      "Volte a Orla; o registro contém um novo local.","Investigue {evidence} em Ashfall.","Escolha transmitir agora ou proteger Aster.","Leve Aster e a caixa-preta por Moonfall.","Volte a Orla e decida como o mundo ouvirá a verdade."
    ],
    fr:[
      "Observatoire Ashfall","Route vers l'observatoire Ashfall déverrouillée.","Observatoire Ashfall : Helix a brûlé le ciel pour ensevelir un témoin.","Retour d'Ashfall.",
      "Le Registre d'alerte nomme Ashfall. Helix a signalé une technicienne vivante puis ordonné l'effacement du site. La porte est de Moonfall y mène encore. Trouvez-la avant la purge.",
      "Utilisez la porte est de Moonfall. Un témoin vivant attend à Ashfall.",
      "La preuve circule sur le réseau public. Helix ne peut plus parler de faux, mais connaît notre position.",
      "Aster et la boîte noire sont en sécurité. Nous publierons par des stations fiables sans révéler sa position.",
      "Le monde connaît Helix et Aster a choisi de rester avec nous.",
      "Aster Vale","J'entretenais le réseau de camouflage d'Helix. Quand j'ai découvert qu'il réécrivait les souvenirs, j'ai copié le manifeste. Ils ont brûlé l'observatoire pour m'effacer.",
      "Manifeste d'évacuation","Les vaisseaux civils transportaient des réfugiés. Helix les a tous classés comme envahisseurs.",
      "Brouilleur perceptif","Il ne cachait pas les corps : il modifiait la mémoire après chaque observation. Signal Town servait de test.",
      "Boîte noire d'Ashfall","Elle peut exposer Helix, mais une diffusion révélera Aster. Diffusez maintenant ou protégez le témoin.",
      "Diffuser la preuve","Protéger Aster","La vérité est diffusée. Attaque +2.","Aster est protégée. Santé max +8 et défense +2.",
      "Retournez voir Orla ; le registre contient un nouveau lieu.","Enquêtez sur {evidence} à Ashfall.","Choisissez de diffuser ou de protéger Aster.","Ramenez Aster et la boîte noire via Moonfall.","Retournez voir Orla et décidez comment révéler la vérité."
    ],
    de:[
      "Ashfall-Observatorium","Route zum Ashfall-Observatorium freigeschaltet.","Ashfall-Observatorium: Helix verbrannte den Himmel, um eine Zeugin zu begraben.","Aus Ashfall zurückgekehrt.",
      "Der Warnbericht nennt Ashfall. Helix meldete eine lebende Technikerin und befahl die Tilgung des Standorts. Das Osttor von Moonfall führt dorthin. Finde sie vor der Säuberung.",
      "Nutze Moonfalls Osttor. Eine lebende Zeugin wartet in Ashfall.",
      "Die Beweise sind im offenen Netz. Helix kann sie nicht mehr fälschen nennen, kennt nun aber unseren Standort.",
      "Aster und die Blackbox sind sicher. Wir veröffentlichen über vertrauenswürdige Sender, ohne ihren Ort zu verraten.",
      "Die Welt kennt Helix, und Aster bleibt bei uns.",
      "Aster Vale","Ich wartete Helix' Tarnsystem. Als ich erfuhr, dass es Erinnerungen umschreibt, kopierte ich das Manifest. Sie verbrannten das Observatorium, um mich zu löschen.",
      "Evakuierungsmanifest","Die zivilen Schiffe waren Flüchtlinge. Helix erklärte jedes Passagierschiff zum Invasionstransporter.",
      "Wahrnehmungsstörer","Er verbarg keine Körper, sondern änderte Erinnerungen nach jeder Sichtung. Signal Town war das Testgebiet.",
      "Ashfall-Blackbox","Sie kann Helix entlarven, doch eine Live-Sendung verrät Aster. Jetzt senden oder die Zeugin schützen.",
      "Beweise senden","Aster schützen","Die Wahrheit ist live. Angriff +2.","Aster ist geschützt. Max. Gesundheit +8, Verteidigung +2.",
      "Kehre zu Orla zurück; der Bericht enthält einen neuen Ort.","Untersuche {evidence} in Ashfall.","Entscheide: senden oder Aster schützen.","Bringe Aster und die Blackbox durch Moonfall zurück.","Kehre zu Orla zurück und entscheide, wie die Welt die Wahrheit erfährt."
    ],
    it:[
      "Osservatorio Ashfall","Percorso per l'Osservatorio Ashfall sbloccato.","Osservatorio Ashfall: Helix ha bruciato il cielo per seppellire una testimone.","Ritorno da Ashfall.",
      "Il Registro d'allarme nomina Ashfall. Helix ha segnato viva una tecnica e ordinato di cancellare il sito. Il portale est di Moonfall conduce ancora lì. Trovala prima dell'epurazione.",
      "Usa il portale est di Moonfall. Una testimone viva attende ad Ashfall.",
      "Le prove sono sulla rete pubblica. Helix non può più definirle false, ma ora sa dove siamo.",
      "Aster e la scatola nera sono al sicuro. Pubblicheremo tramite stazioni fidate senza rivelarla.",
      "Il mondo conosce Helix e Aster ha scelto di restare con noi.",
      "Aster Vale","Mantenevo la rete di travestimento Helix. Scoperto che riscriveva i ricordi, ho copiato il manifesto. Hanno bruciato l'osservatorio per cancellarmi.",
      "Manifesto di evacuazione","Le navi civili portavano rifugiati. Helix le ha classificate come mezzi d'invasione.",
      "Disturbatore percettivo","Non nascondeva corpi: modificava i ricordi dopo ogni avvistamento. Signal Town era il test.",
      "Scatola nera di Ashfall","Può smascherare Helix, ma una diretta rivela Aster. Trasmetti ora o proteggi la testimone.",
      "Trasmetti le prove","Proteggi Aster","La verità è in diretta. Attacco +2.","Aster è protetta. Salute max +8 e difesa +2.",
      "Torna da Orla: il registro contiene un nuovo luogo.","Indaga su {evidence} ad Ashfall.","Scegli se trasmettere o proteggere Aster.","Riporta Aster e la scatola nera via Moonfall.","Torna da Orla e decidi come rivelare la verità."
    ],
    ru:[
      "Обсерватория Эшфолл","Маршрут к обсерватории Эшфолл открыт.","Обсерватория Эшфолл: Helix сжёг небо, чтобы похоронить свидетеля.","Возвращение из Эшфолла.",
      "В записи указана обсерватория Эшфолл. Helix отметил выжившую техницу и приказал стереть объект. Восточные врата Мунфолла ещё ведут туда. Найдите её до зачистки.",
      "Используйте восточные врата Мунфолла. В Эшфолле ждёт живой свидетель.",
      "Доказательства уже в открытой сети. Helix не сможет назвать их подделкой, но теперь знает, где мы.",
      "Астер и чёрный ящик в безопасности. Мы опубликуем данные через надёжные станции, не выдавая её.",
      "Мир узнал о Helix, а Астер решила остаться с нами.",
      "Астер Вейл","Я обслуживала маскировочную сеть Helix. Узнав, что она переписывает память, я скопировала манифест. Они сожгли обсерваторию, чтобы стереть меня.",
      "Манифест эвакуации","Гражданские корабли везли беженцев. Helix объявил каждый из них кораблём вторжения.",
      "Глушитель восприятия","Он не скрывал тела, а менял память после наблюдений. Испытательной зоной был Сигнал-Сити.",
      "Чёрный ящик Эшфолла","Он разоблачит Helix, но прямая передача выдаст Астер. Передать сейчас или защитить свидетеля.",
      "Передать доказательства","Защитить Астер","Правда вышла в эфир. Атака +2.","Астер защищена. Макс. здоровье +8, защита +2.",
      "Вернитесь к Орле: в записи есть новое место.","Исследуйте {evidence} в Эшфолле.","Выберите: передать данные или защитить Астер.","Проведите Астер и чёрный ящик через Мунфолл.","Вернитесь к Орле и решите, как открыть миру правду."
    ],
    hi:[
      "ऐशफॉल वेधशाला","ऐशफॉल वेधशाला का मार्ग खुला।","ऐशफॉल वेधशाला: Helix ने एक गवाह को मिटाने के लिए आकाश जला दिया।","ऐशफॉल से वापसी।",
      "चेतावनी रिकॉर्ड ऐशफॉल वेधशाला बताता है। Helix ने एक जीवित तकनीशियन को चिह्नित कर जगह मिटाने का आदेश दिया। मूनफॉल का पूर्वी द्वार अब भी वहाँ जाता है। सफ़ाए से पहले उसे खोजें।",
      "मूनफॉल का पूर्वी द्वार उपयोग करें। ऐशफॉल में एक जीवित गवाह प्रतीक्षा कर रही है।",
      "सबूत खुले नेटवर्क पर है। Helix इसे नकली नहीं कह सकता, पर अब हमारी जगह जानता है।",
      "ऐस्टर और ब्लैक बॉक्स सुरक्षित हैं। हम भरोसेमंद स्टेशनों से धीरे-धीरे प्रमाण जारी करेंगे।",
      "दुनिया Helix को जानती है और ऐस्टर हमारे साथ रहेगी।",
      "ऐस्टर वेल","मैं Helix की छद्म प्रणाली संभालती थी। पता चला कि वह यादें बदलती है, तो मैंने प्रस्थान सूची कॉपी की। मुझे मिटाने के लिए उन्होंने वेधशाला जला दी।",
      "निकासी सूची","नागरिक जहाज़ शरणार्थियों के थे। Helix ने हर यात्री जहाज़ को आक्रमण वाहक लिखा।",
      "अनुभूति जैमर","यह शरीर नहीं छिपाता था; हर दृश्य के बाद मानव स्मृति बदलता था। परीक्षण क्षेत्र सिग्नल टाउन था।",
      "ऐशफॉल ब्लैक बॉक्स","यह Helix को उजागर करेगा, पर सीधा प्रसारण ऐस्टर का स्थान बताएगा। अभी प्रसारित करें या गवाह बचाएँ।",
      "सबूत प्रसारित करें","ऐस्टर की रक्षा करें","सच प्रसारित हुआ। हमला +2।","ऐस्टर सुरक्षित है। अधिकतम स्वास्थ्य +8, रक्षा +2।",
      "ऑर्ला के पास लौटें; रिकॉर्ड में नया स्थान है।","ऐशफॉल में {evidence} की जाँच करें।","अभी प्रसारित करने या ऐस्टर को बचाने का चुनाव करें।","ऐस्टर और ब्लैक बॉक्स को मूनफॉल से वापस लाएँ।","ऑर्ला के पास लौटकर तय करें कि दुनिया सच कैसे सुनेगी।"
    ],
    ar:[
      "مرصد آشْفول","فُتح الطريق إلى مرصد آشْفول.","مرصد آشْفول: أحرقت Helix السماء لدفن شاهدة.","العودة من آشْفول.",
      "يسمّي سجل التحذير مرصد آشْفول. رصدت Helix تقنية ناجية ثم أمرت بمحو الموقع. ما زالت بوابة مونفول الشرقية تصل إليه. اعثر عليها قبل التطهير.",
      "استخدم بوابة مونفول الشرقية. شاهدة حية تنتظر في آشْفول.",
      "انتشر الدليل في الشبكة المفتوحة. لم تعد Helix قادرة على وصفه بالمزيف، لكنها تعرف موقعنا الآن.",
      "آستر والصندوق الأسود بأمان. سننشر الدليل عبر محطات موثوقة من دون كشف موقعها.",
      "يعرف العالم الآن بوجود Helix، واختارت آستر البقاء معنا.",
      "آستر ڤيل","كنت أصون شبكة تمويه Helix. حين عرفت أنها تعيد كتابة الذكريات نسخت قائمة الإطلاق. أحرقوا المرصد لمحي أثري.",
      "قائمة الإخلاء","كانت السفن المدنية تحمل لاجئين. أعادت Helix تصنيف كل سفينة ركاب كناقلة غزو.",
      "مشوش الإدراك","لم يخفِ الأجساد، بل عدّل ذاكرة البشر بعد كل مشاهدة. كانت بلدة الإشارة منطقة الاختبار.",
      "صندوق آشْفول الأسود","يكفي لفضح Helix، لكن البث المباشر سيكشف موقع آستر. ابث الآن أو احمِ الشاهدة.",
      "بث الدليل","حماية آستر","بُثت الحقيقة. الهجوم +2.","آستر محمية. الصحة القصوى +8 والدفاع +2.",
      "عد إلى أورلا؛ يحتوي السجل على موقع جديد.","حقق في {evidence} داخل آشْفول.","اختر البث الآن أو حماية آستر.","أعد آستر والصندوق الأسود عبر مونفول.","عد إلى أورلا وقرر كيف سيسمع العالم الحقيقة."
    ]
  };
  for(const [code,values] of Object.entries(chapterThreeCopy)){
    Object.assign(localeRegistry[code],Object.fromEntries(chapterThreeKeys.map((key,index)=>[key,values[index]])));
    localeRegistry[code].guideChapterThreeTitle=localeRegistry[code].zoneAshfall;
    localeRegistry[code].guideChapterThree=`${localeRegistry[code].chapter3Briefing} ${localeRegistry[code].ashfallCoreMessage}`;
  }

  const chapterFourKeys=[
    "zoneLunar","lunarUnlocked","lunarArrival","lunarReturn",
    "chapter4BriefingBroadcast","chapter4BriefingProtect","chapter4Reminder",
    "chapter4DebriefAnswer","chapter4DebriefShield","chapter4After",
    "lunarBeaconName","lunarBeaconMessage","lunarCipherName","lunarCipherMessage",
    "lunarNurseryName","lunarNurseryMessage","lunarCoreName","lunarCoreMessage","lunarChoiceMessage",
    "lunarAnswer","lunarShield","lunarAnswerChosen","lunarShieldChosen",
    "objectiveLunarBriefing","questLunarEvidenceObjective","objectiveLunarChoice","objectiveLunarReturn"
  ];
  const chapterFourCopy={
    en:[
      "Hollow Moon Archive","Route to the Hollow Moon Archive unlocked.","Hollow Moon Archive: a refugee sanctuary erased from every public chart.","Returned from the Hollow Moon Archive.",
      "Our open broadcast woke a reply hidden inside the Ashfall carrier wave. It is not Helix. Refugees built an archive on the moon's far side, and their pursuers heard it too. Cross Ashfall's eastern gate before Helix reaches the names inside.",
      "Aster decoded a route that the black box kept private: a refugee archive on the moon's far side. Helix has begun searching for it. Cross Ashfall's eastern gate and keep its people from becoming evidence.",
      "The eastern gate at Ashfall now reaches the Hollow Moon Archive. Its last signal is still waiting.",
      "You answered the sanctuary. Their pilots now have a living route to Signal Town, and we will defend every arrival together.",
      "You erased the approach keys. The sanctuary remains invisible, and its refugees can choose when to reveal themselves.",
      "The archive is safe for now. The next signal will have to find us.",
      "Arrival Beacon","The beacon lists forty-seven civilian craft, each renamed as debris by Helix. One pilot left a return phrase: We were never invaders.",
      "Cipher Well","The well contains a map written as family histories. Helix cannot follow it without knowing which memories are real.",
      "Lunar Nursery Record","Children here learned Signal Town's weather from stolen broadcasts. Their drawings call Fia's world the blue shelter.",
      "Hollow Archive Core","The core holds a two-way sanctuary route. Answering gives the fleet a path home; shielding it keeps every coordinate beyond Helix's reach.",
      "The pursuers are gone. Will you answer the sanctuary and guide its ships, or shield the route until the refugees choose their own hour?",
      "Answer the sanctuary","Shield the route","The sanctuary can hear us. Attack +1 and defense +1.","The route is hidden. Maximum health +12.",
      "Hear Orla's new briefing about the signal behind Ashfall.","Investigate {evidence} in the Hollow Moon Archive.","Return to the core and choose the sanctuary's future.","Carry your decision back through Ashfall and report to Orla."
    ],
    "zh-Hant":[
      "月背空心檔案庫","通往月背空心檔案庫的路線已開啟。","月背空心檔案庫：一座從所有公開星圖抹除的難民庇護所。","已從月背空心檔案庫返回。",
      "我們的公開廣播喚醒了藏在灰燼載波裡的回應。那不是 Helix。難民在月球背面建造了一座檔案庫，而追兵也聽見了。趕在 Helix 找到其中的名字前，穿越灰燼天文台的東門。",
      "艾絲特解出了黑盒刻意保密的路線：月球背面有一座難民檔案庫。Helix 已開始搜尋。穿越灰燼天文台的東門，別讓那裡的人再次變成證物。",
      "灰燼天文台的東門現在通往月背空心檔案庫，最後一道訊號仍在等待。",
      "你回應了庇護所。艦隊駕駛現在擁有前往訊號鎮的活路，我們會一起守護每一次抵達。",
      "你抹除了進入密鑰。庇護所仍保持隱形，難民能自行選擇何時現身。",
      "檔案庫暫時安全了。下一道訊號必須主動找到我們。",
      "抵達信標","信標列出四十七艘民用船，Helix 把每一艘都改名為殘骸。一名駕駛留下返航暗語：我們從來不是入侵者。",
      "密碼井","井中地圖以家族歷史寫成；不知道哪些記憶是真實的，Helix 就無法追蹤。",
      "月面育幼紀錄","這裡的孩子從竊取的廣播認識訊號鎮天氣，他們的畫把菲雅的世界叫作藍色庇護所。",
      "空心檔案核心","核心保存雙向庇護路線。回應能給艦隊一條回家之路；屏蔽則讓所有座標遠離 Helix。",
      "追兵已被清除。要回應庇護所並引導船隊，還是屏蔽路線，等待難民自己選擇時機？",
      "回應庇護所","屏蔽路線","庇護所聽見我們了。攻擊 +1、防禦 +1。","路線已隱藏。最大生命 +12。",
      "聽取歐拉關於灰燼訊號後方的新簡報。","在月背空心檔案庫調查「{evidence}」。","返回核心，決定庇護所的未來。","帶著決定穿越灰燼天文台，回去向歐拉報告。"
    ],
    "zh-Hans":[
      "月背空心档案库","通往月背空心档案库的路线已开启。","月背空心档案库：一座从所有公开星图抹除的难民庇护所。","已从月背空心档案库返回。",
      "我们的公开广播唤醒了藏在灰烬载波里的回应。那不是 Helix。难民在月球背面建造了档案库，追兵也听见了。请在 Helix 找到其中的名字前穿过灰烬天文台东门。",
      "艾丝特解出了黑盒保密的路线：月球背面有一座难民档案库。Helix 已开始搜索。穿过灰烬天文台东门，别让那里的人再次变成证物。",
      "灰烬天文台东门现已通往月背空心档案库，最后一道信号仍在等待。",
      "你回应了庇护所。舰队驾驶员现在拥有前往信号镇的活路，我们会一起守护每次抵达。",
      "你抹除了进入密钥。庇护所仍保持隐形，难民能自行选择何时现身。",
      "档案库暂时安全。下一道信号必须主动找到我们。",
      "抵达信标","信标列出四十七艘民用船，Helix 把每艘都改名为残骸。一名驾驶员留下返航暗语：我们从来不是入侵者。",
      "密码井","井中地图以家族历史写成；不知道哪些记忆是真实的，Helix 就无法追踪。",
      "月面育幼记录","这里的孩子从窃取的广播认识信号镇天气，他们的画把菲雅的世界叫作蓝色庇护所。",
      "空心档案核心","核心保存双向庇护路线。回应能给舰队回家之路；屏蔽则让所有坐标远离 Helix。",
      "追兵已清除。要回应庇护所并引导船队，还是屏蔽路线，等待难民自己选择时机？",
      "回应庇护所","屏蔽路线","庇护所听见我们了。攻击 +1、防御 +1。","路线已隐藏。最大生命 +12。",
      "听取欧拉关于灰烬信号后方的新简报。","在月背空心档案库调查“{evidence}”。","返回核心，决定庇护所的未来。","带着决定穿过灰烬天文台，返回向欧拉报告。"
    ],
    ja:[
      "月裏のホロウ・アーカイブ","月裏のアーカイブへの経路が開いた。","ホロウ・アーカイブ：公開星図から消された難民の避難所。","ホロウ・アーカイブから帰還した。",
      "公開放送がアッシュフォールの搬送波に隠れた返事を起こした。Helixではない。難民が月の裏に記録庫を築き、追手も信号を聞いた。東門から先に向かって。",
      "アスターがブラックボックスの秘匿経路を解いた。月の裏の難民記録庫をHelixが探している。東門を越え、人々を証拠に変えさせないで。",
      "アッシュフォール東門からホロウ・アーカイブへ。最後の信号が待っている。",
      "避難所に応答した。船団はシグナル・タウンへの生きた航路を得た。到着する全員を共に守ろう。",
      "進入鍵を消去した。避難所は見えないまま、難民自身が姿を現す時を選べる。",
      "記録庫は今は安全だ。次の信号は私たちを見つけるだろう。",
      "到着ビーコン","47隻の民間船がHelixによって残骸と改名されている。帰還句は「私たちは侵略者ではない」。",
      "暗号井戸","地図は家族史として書かれている。本物の記憶を知らなければHelixは追えない。",
      "月面保育記録","子供たちは盗まれた放送でシグナル・タウンの天気を学び、フィアの世界を青い避難所と描いた。",
      "ホロウ・コア","双方向の避難航路がある。応答すれば帰路を示し、遮蔽すれば座標をHelixから守れる。",
      "追手は消えた。避難所に応答して船団を導くか、難民が時を選ぶまで航路を遮蔽するか？",
      "避難所に応答","航路を遮蔽","避難所に声が届いた。攻撃 +1、防御 +1。","航路を隠した。最大HP +12。",
      "アッシュフォールの奥の信号についてオーラの説明を聞く。","ホロウ・アーカイブで「{evidence}」を調べる。","コアへ戻り、避難所の未来を選ぶ。","決断をアッシュフォール経由でオーラへ届ける。"
    ],
    ko:[
      "달 뒷면 공허 기록고","달 뒷면 기록고로 가는 길이 열렸습니다.","공허 기록고: 모든 공개 성도에서 지워진 난민 피난처.","공허 기록고에서 돌아왔습니다.",
      "공개 방송이 애시폴 반송파 속 답신을 깨웠어. Helix가 아니야. 난민들이 달 뒷면에 기록고를 세웠고 추격자도 들었어. 동쪽 관문으로 먼저 가.",
      "애스터가 블랙박스의 비밀 경로를 풀었어. 달 뒷면 난민 기록고를 Helix가 찾고 있어. 동쪽 관문을 건너 사람들을 증거로 만들지 마.",
      "애시폴 동쪽 관문이 공허 기록고로 이어집니다. 마지막 신호가 기다립니다.",
      "피난처에 응답했어. 함대는 시그널 타운으로 향하는 살아 있는 항로를 얻었고, 우리는 모든 도착을 함께 지킬 거야.",
      "접근 키를 지웠어. 피난처는 보이지 않은 채 난민들이 모습을 드러낼 때를 선택할 수 있어.",
      "기록고는 당분간 안전해. 다음 신호가 우리를 찾아오겠지.",
      "도착 신호기","민간선 47척이 Helix 기록에서 잔해로 바뀌었다. 귀환 문구는 ‘우리는 침략자가 아니었다.’",
      "암호 우물","지도는 가족의 역사로 쓰였다. 어떤 기억이 진짜인지 모르면 Helix는 추적할 수 없다.",
      "달 보육 기록","아이들은 훔친 방송으로 시그널 타운의 날씨를 배웠고 피아의 세계를 푸른 피난처라 그렸다.",
      "공허 기록 핵","양방향 피난 항로가 있다. 응답하면 귀로가 열리고, 차폐하면 좌표를 Helix에서 숨긴다.",
      "추격자는 사라졌다. 피난처에 응답해 함대를 이끌까, 난민들이 때를 고를 때까지 항로를 가릴까?",
      "피난처에 응답","항로 차폐","피난처가 우리를 들었습니다. 공격 +1, 방어 +1.","항로가 숨겨졌습니다. 최대 체력 +12.",
      "애시폴 너머 신호에 대한 올라의 설명을 듣습니다.","공허 기록고에서 {evidence} 조사.","핵으로 돌아가 피난처의 미래를 선택합니다.","결정을 가지고 애시폴을 지나 올라에게 보고합니다."
    ],
    es:[
      "Archivo de la Luna Hueca","Ruta al Archivo de la Luna Hueca desbloqueada.","Archivo de la Luna Hueca: un refugio borrado de todos los mapas.","Regreso del Archivo de la Luna Hueca.",
      "La emisión abierta despertó una respuesta oculta en Ashfall. No es Helix. Los refugiados crearon un archivo en la cara oculta y sus perseguidores también lo oyeron. Cruza la puerta este.",
      "Aster descifró una ruta privada hacia un archivo de refugiados en la cara oculta. Helix ya lo busca. Cruza la puerta este y protege a su gente.",
      "La puerta este de Ashfall conduce al Archivo. Su última señal espera.",
      "Respondiste al refugio. Sus pilotos tienen una ruta viva a Pueblo Señal y defenderemos cada llegada.",
      "Borraste las claves de acceso. El refugio sigue invisible y sus habitantes elegirán cuándo mostrarse.",
      "El archivo está a salvo por ahora. La próxima señal tendrá que encontrarnos.",
      "Baliza de llegada","La baliza enumera 47 naves civiles que Helix renombró como restos. Su frase: Nunca fuimos invasores.",
      "Pozo cifrado","El mapa está escrito como historias familiares. Helix no puede seguirlo sin saber qué recuerdos son reales.",
      "Registro de la guardería lunar","Los niños aprendieron el clima de Pueblo Señal por emisiones robadas y llaman al mundo de Fia el refugio azul.",
      "Núcleo del Archivo","Contiene una ruta de ida y vuelta. Responder guía a la flota; ocultarla protege las coordenadas.",
      "No quedan perseguidores. ¿Responderás al refugio o protegerás la ruta hasta que los refugiados decidan?",
      "Responder al refugio","Proteger la ruta","El refugio nos oye. Ataque +1 y defensa +1.","Ruta oculta. Salud máxima +12.",
      "Escucha el informe de Orla sobre la señal tras Ashfall.","Investiga {evidence} en el Archivo.","Vuelve al núcleo y elige el futuro del refugio.","Lleva tu decisión a Orla a través de Ashfall."
    ],
    "pt-BR":[
      "Arquivo da Lua Oca","Rota para o Arquivo da Lua Oca liberada.","Arquivo da Lua Oca: um refúgio apagado de todos os mapas.","Retorno do Arquivo da Lua Oca.",
      "A transmissão aberta despertou uma resposta escondida em Ashfall. Não é a Helix. Refugiados criaram um arquivo no lado oculto e os perseguidores ouviram. Atravesse o portão leste.",
      "Aster decifrou uma rota privada para um arquivo de refugiados no lado oculto. A Helix já procura por ele. Atravesse o portão leste e proteja seu povo.",
      "O portão leste de Ashfall leva ao Arquivo. O último sinal espera.",
      "Você respondeu ao refúgio. Os pilotos têm uma rota viva para Signal Town e defenderemos cada chegada.",
      "Você apagou as chaves. O refúgio continua invisível e os refugiados escolherão quando aparecer.",
      "O arquivo está seguro por enquanto. O próximo sinal terá de nos encontrar.",
      "Farol de chegada","O farol lista 47 naves civis renomeadas como destroços pela Helix. A frase: Nunca fomos invasores.",
      "Poço cifrado","O mapa foi escrito como histórias de família. A Helix não pode segui-lo sem saber quais memórias são reais.",
      "Registro do berçário lunar","As crianças aprenderam o clima de Signal Town por transmissões roubadas e chamam o mundo de Fia de refúgio azul.",
      "Núcleo do Arquivo","Guarda uma rota de ida e volta. Responder guia a frota; ocultar protege as coordenadas.",
      "Os perseguidores acabaram. Responder ao refúgio ou proteger a rota até os refugiados escolherem?",
      "Responder ao refúgio","Proteger a rota","O refúgio nos ouve. Ataque +1 e defesa +1.","Rota escondida. Vida máxima +12.",
      "Ouça Orla sobre o sinal além de Ashfall.","Investigue {evidence} no Arquivo.","Volte ao núcleo e escolha o futuro do refúgio.","Leve sua decisão a Orla por Ashfall."
    ],
    fr:[
      "Archives de la Lune creuse","Route vers les Archives de la Lune creuse ouverte.","Archives de la Lune creuse : un refuge effacé de toutes les cartes.","Retour des Archives de la Lune creuse.",
      "Notre diffusion a réveillé une réponse cachée dans Ashfall. Ce n'est pas Helix. Des réfugiés ont bâti des archives sur la face cachée et leurs poursuivants l'ont entendue. Prenez la porte est.",
      "Aster a décodé une route privée vers des archives de réfugiés. Helix les recherche. Franchissez la porte est et protégez leurs habitants.",
      "La porte est d'Ashfall mène aux Archives. Leur dernier signal attend.",
      "Vous avez répondu au refuge. Ses pilotes ont une route vers Signalbourg et nous défendrons chaque arrivée.",
      "Vous avez effacé les clés. Le refuge reste invisible et ses habitants choisiront quand se révéler.",
      "Les archives sont sûres pour l'instant. Le prochain signal devra nous trouver.",
      "Balise d'arrivée","La balise recense 47 vaisseaux civils renommés débris par Helix. Leur phrase : Nous n'étions pas des envahisseurs.",
      "Puits chiffré","La carte est écrite comme des histoires de famille. Helix ne peut la suivre sans connaître les vrais souvenirs.",
      "Registre de la nurserie lunaire","Les enfants ont appris la météo de Signalbourg par des émissions volées et nomment le monde de Fia le refuge bleu.",
      "Cœur des Archives","Il garde une route aller-retour. Répondre guide la flotte ; la masquer protège les coordonnées.",
      "Les poursuivants sont vaincus. Répondre au refuge ou masquer la route jusqu'au choix des réfugiés ?",
      "Répondre au refuge","Masquer la route","Le refuge nous entend. Attaque +1, défense +1.","Route masquée. Santé max +12.",
      "Écoutez Orla au sujet du signal derrière Ashfall.","Enquêtez sur {evidence} dans les Archives.","Retournez au cœur et choisissez l'avenir du refuge.","Rapportez votre décision à Orla via Ashfall."
    ],
    de:[
      "Hohlmond-Archiv","Route zum Hohlmond-Archiv freigeschaltet.","Hohlmond-Archiv: ein Flüchtlingsort, der aus allen Karten gelöscht wurde.","Aus dem Hohlmond-Archiv zurückgekehrt.",
      "Unsere Sendung weckte eine in Ashfall verborgene Antwort. Sie stammt nicht von Helix. Flüchtlinge bauten auf der Mondrückseite ein Archiv, doch ihre Verfolger hörten es auch. Nimm das Osttor.",
      "Aster entschlüsselte eine geheime Route zu einem Flüchtlingsarchiv. Helix sucht bereits danach. Durchquere das Osttor und schütze die Bewohner.",
      "Ashfalls Osttor führt zum Archiv. Sein letztes Signal wartet.",
      "Du hast dem Zufluchtsort geantwortet. Seine Piloten haben eine Route nach Signalstadt, und wir schützen jede Ankunft.",
      "Du hast die Schlüssel gelöscht. Der Ort bleibt unsichtbar und die Flüchtlinge wählen selbst ihren Zeitpunkt.",
      "Das Archiv ist vorerst sicher. Das nächste Signal muss uns finden.",
      "Ankunftsbake","Die Bake nennt 47 Zivilschiffe, die Helix in Trümmer umbenannte. Ihr Satz: Wir waren nie Eindringlinge.",
      "Chiffrebrunnen","Die Karte besteht aus Familiengeschichten. Ohne die wahren Erinnerungen kann Helix ihr nicht folgen.",
      "Mond-Kinderregister","Kinder lernten Signalstadts Wetter aus gestohlenen Sendungen und nennen Fias Welt den blauen Zufluchtsort.",
      "Archivkern","Er enthält eine Hin- und Rückroute. Antworten führt die Flotte; Abschirmen schützt alle Koordinaten.",
      "Die Verfolger sind besiegt. Dem Zufluchtsort antworten oder die Route verbergen, bis die Flüchtlinge wählen?",
      "Zufluchtsort antworten","Route abschirmen","Der Zufluchtsort hört uns. Angriff +1, Verteidigung +1.","Route verborgen. Max. Gesundheit +12.",
      "Höre Orlas Bericht über das Signal hinter Ashfall.","Untersuche {evidence} im Archiv.","Kehre zum Kern zurück und entscheide über den Zufluchtsort.","Bringe deine Entscheidung durch Ashfall zu Orla."
    ],
    it:[
      "Archivio della Luna Cava","Percorso per l'Archivio della Luna Cava sbloccato.","Archivio della Luna Cava: un rifugio cancellato da tutte le mappe.","Ritorno dall'Archivio della Luna Cava.",
      "La trasmissione ha risvegliato una risposta nascosta ad Ashfall. Non è Helix. I rifugiati hanno costruito un archivio sul lato oscuro e gli inseguitori l'hanno sentito. Attraversa il portale est.",
      "Aster ha decifrato una rotta privata verso un archivio di rifugiati. Helix lo cerca già. Attraversa il portale est e proteggi gli abitanti.",
      "Il portale est di Ashfall conduce all'Archivio. L'ultimo segnale attende.",
      "Hai risposto al rifugio. I piloti hanno una rotta per Città Segnale e difenderemo ogni arrivo.",
      "Hai cancellato le chiavi. Il rifugio resta invisibile e i rifugiati sceglieranno quando mostrarsi.",
      "L'archivio è al sicuro per ora. Il prossimo segnale dovrà trovarci.",
      "Faro d'arrivo","Il faro elenca 47 navi civili rinominate detriti da Helix. La frase: Non siamo mai stati invasori.",
      "Pozzo cifrato","La mappa è scritta come storie familiari. Helix non può seguirla senza sapere quali ricordi sono veri.",
      "Registro dell'asilo lunare","I bambini hanno imparato il clima di Città Segnale da trasmissioni rubate e chiamano il mondo di Fia rifugio blu.",
      "Nucleo dell'Archivio","Conserva una rotta di andata e ritorno. Rispondere guida la flotta; schermarla protegge le coordinate.",
      "Gli inseguitori sono sconfitti. Rispondere al rifugio o schermare la rotta finché i rifugiati scelgono?",
      "Rispondi al rifugio","Schermare la rotta","Il rifugio ci sente. Attacco +1, difesa +1.","Rotta nascosta. Salute massima +12.",
      "Ascolta Orla sul segnale oltre Ashfall.","Indaga su {evidence} nell'Archivio.","Torna al nucleo e scegli il futuro del rifugio.","Porta la decisione a Orla passando da Ashfall."
    ],
    ru:[
      "Архив Полой Луны","Путь к Архиву Полой Луны открыт.","Архив Полой Луны: убежище беженцев, стёртое со всех карт.","Возвращение из Архива Полой Луны.",
      "Наша передача разбудила ответ, спрятанный в сигнале Ashfall. Это не Helix. Беженцы создали архив на обратной стороне Луны, но преследователи тоже услышали его. Иди через восточные врата.",
      "Астер расшифровала тайный маршрут к архиву беженцев. Helix уже ищет его. Пройди через восточные врата и защити жителей.",
      "Восточные врата Ashfall ведут в Архив. Последний сигнал ждёт.",
      "Ты ответила убежищу. У пилотов появился путь к Сигнал-Сити, и мы защитим каждого прибывшего.",
      "Ты стёрла ключи доступа. Убежище осталось невидимым, и беженцы сами выберут время.",
      "Архив пока в безопасности. Следующий сигнал должен найти нас.",
      "Маяк прибытия","В маяке записаны 47 гражданских кораблей, которые Helix назвал обломками. Фраза: Мы никогда не были захватчиками.",
      "Шифровальный колодец","Карта записана как семейные истории. Helix не пройдёт по ней, не зная настоящих воспоминаний.",
      "Запись лунного приюта","Дети учили погоду Сигнал-Сити по украденным передачам и называли мир Фии синим убежищем.",
      "Ядро Архива","В нём двусторонний маршрут. Ответ проведёт флот; защита скроет координаты.",
      "Преследователи побеждены. Ответить убежищу или скрыть маршрут до решения беженцев?",
      "Ответить убежищу","Скрыть маршрут","Убежище слышит нас. Атака +1, защита +1.","Маршрут скрыт. Максимум здоровья +12.",
      "Выслушай Орлу о сигнале за Ashfall.","Исследуй {evidence} в Архиве.","Вернись к ядру и выбери будущее убежища.","Доставь решение Орле через Ashfall."
    ],
    hi:[
      "खोखला चंद्र अभिलेख","खोखले चंद्र अभिलेख का मार्ग खुल गया।","खोखला चंद्र अभिलेख: सभी नक्शों से मिटाया गया शरणार्थी आश्रय।","खोखले चंद्र अभिलेख से वापसी।",
      "हमारे प्रसारण ने Ashfall में छिपा उत्तर जगा दिया। यह Helix नहीं है। शरणार्थियों ने चंद्रमा के पीछे अभिलेख बनाया और पीछा करने वालों ने भी सुन लिया। पूर्वी द्वार पार करो।",
      "Aster ने शरणार्थी अभिलेख का गुप्त मार्ग पढ़ लिया। Helix उसे खोज रहा है। पूर्वी द्वार पार करके लोगों की रक्षा करो।",
      "Ashfall का पूर्वी द्वार अभिलेख तक जाता है। अंतिम संकेत प्रतीक्षा कर रहा है।",
      "तुमने आश्रय को उत्तर दिया। उसके पायलटों को Signal Town का जीवित मार्ग मिला और हम हर आगमन की रक्षा करेंगे।",
      "तुमने प्रवेश कुंजियाँ मिटा दीं। आश्रय अदृश्य है और शरणार्थी स्वयं समय चुनेंगे।",
      "अभिलेख अभी सुरक्षित है। अगला संकेत हमें खोजेगा।",
      "आगमन बीकन","बीकन में 47 नागरिक जहाज हैं जिन्हें Helix ने मलबा कहा। संदेश: हम कभी आक्रमणकारी नहीं थे।",
      "कूट कुआँ","नक्शा परिवारों की कहानियों में लिखा है। असली स्मृतियाँ जाने बिना Helix पीछा नहीं कर सकता।",
      "चंद्र बालगृह रिकॉर्ड","बच्चों ने चोरी के प्रसारण से Signal Town का मौसम सीखा और Fia की दुनिया को नीला आश्रय कहा।",
      "अभिलेख केंद्र","इसमें दोतरफा आश्रय मार्ग है। उत्तर बेड़े को घर ले जाएगा; ढाल निर्देशांक छिपाएगी।",
      "पीछा करने वाले हार गए। आश्रय को उत्तर दें या शरणार्थियों के निर्णय तक मार्ग छिपाएँ?",
      "आश्रय को उत्तर दें","मार्ग को ढाल दें","आश्रय हमें सुनता है। आक्रमण +1, रक्षा +1।","मार्ग छिपा है। अधिकतम स्वास्थ्य +12।",
      "Ashfall के पीछे के संकेत पर Orla की सूचना सुनें।","अभिलेख में {evidence} की जाँच करें।","केंद्र पर लौटकर आश्रय का भविष्य चुनें।","Ashfall से होकर निर्णय Orla तक पहुँचाएँ।"
    ],
    ar:[
      "أرشيف القمر الأجوف","فُتح الطريق إلى أرشيف القمر الأجوف.","أرشيف القمر الأجوف: ملجأ لاجئين مُسح من كل الخرائط.","العودة من أرشيف القمر الأجوف.",
      "أيقظ بثنا رداً مخفياً داخل إشارة Ashfall. ليس من Helix. بنى اللاجئون أرشيفاً خلف القمر وسمعه مطاردوهم أيضاً. اعبر البوابة الشرقية أولاً.",
      "فكّت Aster مساراً سرياً إلى أرشيف للاجئين. بدأت Helix البحث عنه. اعبر البوابة الشرقية واحمِ سكانه.",
      "تؤدي بوابة Ashfall الشرقية إلى الأرشيف. آخر إشارة تنتظر.",
      "أجبت الملجأ. أصبح لطياريه طريق حي إلى Signal Town وسندافع عن كل قادم.",
      "مسحت مفاتيح الدخول. بقي الملجأ مخفياً ويمكن للاجئين اختيار وقت ظهورهم.",
      "الأرشيف آمن الآن. على الإشارة التالية أن تجدنا.",
      "منارة الوصول","تسجل المنارة 47 سفينة مدنية سمّتها Helix حطاماً. العبارة: لم نكن غزاة قط.",
      "بئر الشيفرة","كُتبت الخريطة كتاريخ عائلات. لا تستطيع Helix تتبعها دون معرفة الذكريات الحقيقية.",
      "سجل حضانة القمر","تعلم الأطفال طقس Signal Town من بث مسروق وسمّوا عالم Fia الملجأ الأزرق.",
      "نواة الأرشيف","تحفظ مساراً ذهاباً وإياباً. الرد يرشد الأسطول؛ والحجب يخفي الإحداثيات.",
      "انتهى المطاردون. هل تجيب الملجأ أم تحجب الطريق حتى يختار اللاجئون وقتهم؟",
      "أجب الملجأ","احجب الطريق","الملجأ يسمعنا. الهجوم +1 والدفاع +1.","الطريق مخفي. الصحة القصوى +12.",
      "استمع إلى إحاطة Orla عن الإشارة خلف Ashfall.","حقق في {evidence} داخل الأرشيف.","عد إلى النواة واختر مستقبل الملجأ.","احمل قرارك عبر Ashfall وأبلغ Orla."
    ]
  };
  for(const [code,values] of Object.entries(chapterFourCopy)){
    Object.assign(localeRegistry[code],Object.fromEntries(chapterFourKeys.map((key,index)=>[key,values[index]])));
    localeRegistry[code].guideChapterFourTitle=localeRegistry[code].zoneLunar;
    localeRegistry[code].guideChapterFour=`${localeRegistry[code].chapter4Reminder} ${localeRegistry[code].lunarCoreMessage}`;
  }

  const interactAction={
    en:"Interact","zh-Hant":"互動","zh-Hans":"互动",ja:"調べる",ko:"상호작용",
    es:"Interactuar","pt-BR":"Interagir",fr:"Interagir",de:"Interagieren",
    it:"Interagisci",ru:"Взаимодействовать",hi:"इंटरैक्ट करें",ar:"تفاعل"
  };
  for(const [code,value] of Object.entries(interactAction))localeRegistry[code].interactAction=value;

  window.SIGNAL_VEIL_LOCALES=localeRegistry;
})();
