(function () {
  "use strict";

  const locales=window.SIGNAL_VEIL_LOCALES;
  if(!locales)return;

  const en={
    summary:"Complete 45 story missions across five connected regions, reveal hidden threats with Neural Vision, recover equipment, and decide how Ashfall's evidence reaches Earth.",
    guideTitle:"Signal Veil Field Guide",
    guideLead:"A complete guide to Fia's 45-mission investigation, real-time combat, Neural Vision, equipment, and local progress.",
    guideOverviewTitle:"Overview and mission",
    guideOverviewA:"In 2042, Spark Paw Fia follows a dismissed Lizard Person recording to Signal Town. Ten witnesses, a hidden laboratory, and the stolen Neural Vision project point toward a larger cover-up. The campaign contains 45 authored missions across Signal Town, Veilwood Forest, the neural laboratory, Moonfall Relay, and Ashfall Observatory.",
    guideOverviewB:"The investigation is one connected action-RPG journey rather than a stage list. Talk to witnesses, follow visible and hidden trails, defeat patrols, recover equipment, decode records, and decide how Ashfall evidence should be handled. Success means completing the current objective and returning key evidence to Orla; the final Ashfall decision completes the current story while leaving every unlocked region open for exploration.",
    guideHowTitle:"How to play and complete the loop",
    guideStep1:"Move through the current region and read the objective shown above the world.",
    guideStep2:"Tap the nearby interaction prompt, or press E, to talk, open chests, activate records, and use gates.",
    guideStep3:"Face a threat, then use Attack for a fast sword wave or Skill for a ranged signal bolt.",
    guideStep4:"Switch to True Vision when cyan traces suggest a disguised person, cloaked enemy, treasure, or hidden route.",
    guideStep5:"Finish the objective, follow the next mission, and return evidence to Orla when the story asks.",
    guideLoop:"Desktop players move with WASD or the arrow keys, attack with Space or J, fire Skill with K, switch Vision with V, interact with E, and open the menu with Escape. On phones, use the joystick and the three action buttons; every visible world-interaction prompt is also a touch target. Enemies patrol and chase, while the Commander adds volleys, a line charge, and a punishable stun window. Losing all health returns Fia to a safe checkpoint instead of deleting permanent progress.",
    guideProgressTitle:"Progression and difficulty",
    guideProgression:"The opening investigation teaches conversation, melee spacing, and hidden trails before Veilwood and the laboratory combine groups of patrols with vision-dependent targets. Defeating enemies grants EXP; each level automatically improves maximum health, attack, and defense. Three chests unlock the Pulse Blade, Ranger Armor, and Signal Charm, whose abilities can be inspected, equipped, or removed in the Equipment menu. Moonfall then asks you to clear eight sentries and decode three records in order. Ashfall adds six defenders, four evidence interactions, two linked maps, and a final choice between broadcasting the proof and protecting the witness.",
    guideTipsTitle:"Practical field tips",
    guideTip1:"Watch the objective and Quest FloatBar; mission counters show the complete encounter total even when the story advances through smaller milestones.",
    guideTip2:"Pull one patrol away from a group. The melee wave is faster, but the ranged Skill is safer against brutes and neural casters.",
    guideTip3:"True Vision costs no energy. Toggle it around cyan sparks, suspicious walls, changed NPC dialogue, and apparently empty paths.",
    guideTip4:"Inspect every recovered item. A defensive loadout helps while learning a Boss pattern, and equipment can be removed without losing ownership.",
    guideTip5:"During the Commander fight, keep moving through volleys, step away from the charge line, then attack during the short stun.",
    guideDesignTitle:"Developer design note",
    guideDesign:"Signal Veil uses one continuous world because investigation clues are easier to remember when places remain connected. Neural Vision changes what can be seen and targeted without adding an energy meter, so the decision is about observation rather than conserving a consumable. Keyboard shortcuts support quick action on desktop, while the same combat and interaction transactions have visible touch controls on phones. The 45-mission catalog records meaningful discoveries, combat thresholds, equipment, decoded evidence, and returns to Orla; it is not a set of repeated levels with larger numbers.",
    guideSaveTitle:"Player, device, and save information",
    guideSave:"Signal Veil is free to start and requires no account. Important changes—quests, EXP, levels, health, equipment, opened chests, defeated targets, map checkpoints, and story choices—save automatically in this browser; ordinary movement does not write every frame. The optional five-Diamond Signal Anchor permanently adds maximum health but is never required. Clearing site data or changing browser or device can remove or separate local progress.",
    guideFaqTitle:"Frequently asked questions",
    guideFaqQ1:"How many missions and regions are playable?",guideFaqA1:"The current story has 45 missions across Signal Town, Veilwood Forest, the neural laboratory, Moonfall Relay, and Ashfall Observatory. Gates connect the regions as the investigation advances.",
    guideFaqQ2:"Does True Vision consume energy?",guideFaqA2:"No. It can be switched freely after the prototype lens is unlocked. Use it to reveal cloaked threats, disguised characters, hidden routes, secret doors, and treasure.",
    guideFaqQ3:"Can equipment be removed or lost?",guideFaqA3:"Owned equipment can be equipped or removed from the menu, and its exact stat effect is shown there. Removing an item does not delete it from the save.",
    guideFaqQ4:"What happens when Fia is defeated?",guideFaqA4:"Fia returns to the latest safe checkpoint with permanent progression intact. Partial combat health and meaningful state changes are also saved automatically.",
    guideFaqQ5:"How long does the investigation take?",guideFaqA5:"Play time depends on exploration and combat, but the three-chapter, 45-mission route is designed for a longer RPG session. You can leave and continue from the locally saved checkpoint.",
    guideRelatedTitle:"Related WeightPlay games",
    guideRelated1Title:"Animal Relic Hunters",guideRelated1Text:"A room-based action expedition with collectible relics and changing Guardian phases.",
    guideRelated2Title:"Animal Crystal Survivor",guideRelated2Text:"Build a combat loadout while surviving thirty crystal routes and six distinct Bosses.",
    guideRelated3Title:"Shadow Wolf Legend",guideRelated3Text:"Explore a darker action campaign with saved stages, enemy counters, and phase-changing Bosses."
  };

  const zhHant={
    summary:"完成橫跨五個相連地區的 45 項劇情任務，以神經視界揭露威脅、取得裝備，並決定灰燼證據如何傳向地球。",
    guideTitle:"《訊號帷幕》完整調查指南",
    guideLead:"從菲雅的 45 項任務、即時戰鬥與神經視界，到裝備和本機進度的完整說明。",
    guideOverviewTitle:"世界與調查目標",
    guideOverviewA:"2042 年，火花狐菲雅循著一段被判定為造假的蜥蜴人影片來到訊號鎮。十名目擊者、藏在森林後方的神經實驗室，以及遭竊用的神經視界計畫，逐步指向 Helix 理事會掩蓋的真相。目前劇情共有 45 項實際任務，範圍包括訊號鎮、帷幕森林、神經實驗室、月墜中繼站與灰燼天文台。",
    guideOverviewB:"本作不是選關式 RPG，而是一段連續的調查旅程。你要訪談目擊者、追蹤普通與隱藏路線、清除巡邏、取得裝備、依序解讀紀錄，最後決定如何處理灰燼天文台的證據。每次完成畫面上的當前目標，任務就會向前推進；重要證據還要帶回給奧拉。完成灰燼篇最後的選擇後，現有劇情告一段落，已開啟的地區仍可自由探索。",
    guideHowTitle:"操作方式與完整遊戲循環",
    guideStep1:"在目前地區移動，先閱讀世界畫面上方的任務目標。",
    guideStep2:"點擊靠近物件時出現的互動提示，或按 E 交談、開寶箱、啟動紀錄與使用傳送門。",
    guideStep3:"面向敵人後使用「攻擊」揮出快速劍氣，或使用「技能」發射遠程訊號彈。",
    guideStep4:"看到青色線索時切換真實視界，尋找偽裝人物、隱形敵人、寶藏或隱藏道路。",
    guideStep5:"完成目前目標後繼續下一項任務；劇情要求時，把取得的證據帶回給奧拉。",
    guideLoop:"桌面可用 WASD 或方向鍵移動，Space／J 攻擊、K 使用技能、V 切換視界、E 互動、Escape 開啟選單。手機使用左側搖桿與攻擊、技能、真視界三個按鈕，世界中所有可見的互動提示也都能直接點擊。普通敵人會巡邏與追擊；指揮官則會使用環形彈幕、直線衝鋒與短暫暈眩窗口。生命歸零只會讓菲雅回到安全檢查點，不會刪除永久進度。",
    guideProgressTitle:"成長、裝備與難度變化",
    guideProgression:"前段調查先教你交談、近戰距離與隱藏路線；進入帷幕森林和實驗室後，敵群、遠程威脅與必須用真實視界揭露的目標會開始混合。擊敗敵人可取得經驗，升級會自動提高最大生命、攻擊與防禦。三個寶箱分別解鎖脈衝刃、遊俠護甲與訊號護符，能力可在裝備選單查看，也能自由裝備或卸除。月墜篇要求清除八名哨兵並依序解碼三份紀錄；灰燼篇再加入六名守衛、四個證據互動、兩張相連地圖，以及「公開證據」或「保護目擊者」的最終選擇。",
    guideTipsTitle:"實用調查技巧",
    guideTip1:"留意任務列與任務 FloatBar；即使劇情內部會分段推進，討伐計數仍會顯示完整目標總數。",
    guideTip2:"先把單一巡邏引離敵群。近戰劍氣出手較快，對重裝兵與神經術士則用遠程技能更安全。",
    guideTip3:"真實視界不消耗能量。青色火花、可疑牆面、NPC 對話改變或看似空白的道路都值得切換確認。",
    guideTip4:"取得裝備後記得查看能力。學習頭目招式時可偏重防禦，卸除裝備也不會失去所有權。",
    guideTip5:"指揮官施放彈幕時持續移動，離開衝鋒直線，等牠短暫暈眩再集中攻擊。",
    guideDesignTitle:"開發設計說明",
    guideDesign:"《訊號帷幕》採用連續世界，是因為調查線索與地點維持連結時更容易被記住。神經視界會改變可以看見與攻擊的對象，但不設能量條；這個選擇考驗的是觀察，而不是節省消耗品。桌面提供快速鍵，手機則把相同的戰鬥與互動行為做成可見的觸控操作。45 項任務分別記錄重要發現、戰鬥里程碑、裝備、解碼證據與回報奧拉的劇情，而不是把相同關卡只換成更大的數字。",
    guideSaveTitle:"玩家、裝置與存檔資訊",
    guideSave:"遊戲可免費開始，不需要帳號。任務、經驗、等級、生命、裝備、寶箱、擊破目標、地圖檢查點與劇情選擇等重要變動會自動存入此瀏覽器；普通移動不會每幀寫入。可選購的五鑽石「訊號錨點」會永久增加最大生命，但絕非通關必要。清除網站資料或更換瀏覽器、裝置，可能使本機進度消失或分開保存。",
    guideFaqTitle:"常見問題",
    guideFaqQ1:"目前可以玩多少任務與地區？",guideFaqA1:"現有故事共有 45 項任務，涵蓋訊號鎮、帷幕森林、神經實驗室、月墜中繼站與灰燼天文台；劇情推進後會開啟連接各地的傳送門。",
    guideFaqQ2:"真實視界會消耗能量嗎？",guideFaqA2:"不會。取得原型鏡片後即可自由切換，用來揭露隱形威脅、偽裝人物、隱藏路線、秘密入口與寶藏。",
    guideFaqQ3:"裝備可以卸除嗎？會不會消失？",guideFaqA3:"已取得的裝備能在選單中查看能力、裝備或卸除。卸除只會暫時取消能力，不會把物品從存檔刪除。",
    guideFaqQ4:"菲雅被擊敗後會失去什麼？",guideFaqA4:"菲雅會回到最近的安全檢查點，永久進度仍會保留。局部戰鬥生命與其他重要狀態也會在變動時自動保存。",
    guideFaqQ5:"完整調查大約要玩多久？",guideFaqA5:"時間會依探索與戰鬥速度而異；三章、45 任務的內容適合分段完成。離開遊戲後，可從儲存在本機的檢查點繼續。",
    guideRelatedTitle:"推薦的 WeightPlay 遊戲",
    guideRelated1Title:"動物遺物獵人",guideRelated1Text:"進入三房間遠征，收集遺物並對付會改變階段的守護者。",
    guideRelated2Title:"動物水晶生存者",guideRelated2Text:"在三十條水晶路線中建立戰鬥配置，迎戰六名不同頭目。",
    guideRelated3Title:"暗影狼傳說",guideRelated3Text:"探索較黑暗的動作戰役，掌握敵人剋制與頭目階段變化。"
  };

  const regional={
    "zh-Hans":{
      title:"《信号帷幕》完整调查指南",lead:"菲雅的 45 项任务、即时战斗、神经视界、装备与本地进度说明。",
      section:["世界与调查目标","操作与完整循环","成长、装备与难度","实用调查技巧","开发设计说明","玩家、设备与存档信息","常见问题","推荐的 WeightPlay 游戏"],
      overview:"当前故事包含 45 项任务，连接信号镇、帷幕森林、神经实验室、月坠中继站和灰烬天文台。调查证人、追踪隐藏路线、击败巡逻、取得装备、解读记录，并决定如何处理灰烬证据。",
      steps:["阅读世界上方的当前目标并探索区域。","点击可见互动提示或按 E 来交谈、开箱、读记录和使用传送门。","面向敌人，用攻击释放快速剑气，或用技能发射远程信号弹。","在青色线索附近切换真实视界，寻找伪装、隐形目标和密道。","完成目标并在剧情要求时把证据交给奥拉。"],
      design:"连续地图让地点与线索保持联系。真实视界不消耗能量，重点是观察而不是节省资源。桌面快捷键和手机触控执行相同的战斗与互动；45 项任务记录真实发现、装备、战斗里程碑和剧情回报，而不是重复关卡。",
      save:"无需账号。任务、经验、等级、生命、装备、宝箱、击破、检查点和选择会自动保存在本浏览器。普通移动不会每帧写入。五钻石信号锚点是可选永久生命升级，并非通关必要。",
      q:["目前有多少任务和地区？","真实视界消耗能量吗？","装备可以卸下吗？","菲雅被击败后会怎样？","调查需要多久？"],
      a:["共有 45 项任务和五个主要地区，剧情会逐步开启相连传送门。","不会。解锁镜片后可自由切换，以发现隐形敌人、伪装人物、密道和宝藏。","可以。菜单会显示能力，卸下不会删除已经拥有的装备。","她会回到安全检查点，永久进度与重要状态仍会保留。","依探索与战斗速度而异；三章内容可分段游玩并从本地检查点继续。"],
      related:["动物遗物猎人","房间式动作远征，收集遗物并迎战多阶段守护者。","动物水晶生存者","在三十条路线中建立配置并迎战六名头目。","暗影狼传说","有存档关卡、敌人克制和多阶段头目的黑暗动作战役。"]
    },
    ja:{
      title:"『シグナル・ヴェール』完全調査ガイド",lead:"フィアの45ミッション、リアルタイム戦闘、ニューラルビジョン、装備、ローカル進行を解説します。",
      section:["世界と任務","操作とゲームループ","成長・装備・難易度","実用的な調査のコツ","開発デザインノート","プレイヤー・端末・セーブ情報","よくある質問","関連するWeightPlayゲーム"],
      overview:"現在の物語は45ミッションで、シグナルタウン、ヴェイルウッド、神経研究所、ムーンフォール中継所、アッシュフォール天文台を結びます。証人への聞き込み、隠し道の追跡、巡回兵との戦闘、装備回収、記録解読、最後の証拠選択までが一つの連続した調査です。",
      steps:["画面上部の目的を読み、現在の地域を探索する。","見える操作表示をタップ、またはEで会話・宝箱・記録・ゲートを使う。","敵の方向を向き、攻撃で剣気、スキルで遠距離弾を放つ。","シアンの手掛かりでは真実視界を使い、偽装や透明な対象を探す。","目的を完了し、必要な証拠をオーラへ持ち帰る。"],
      design:"連続世界は場所と手掛かりを覚えやすくします。真実視界にはエネルギー消費がなく、資源管理ではなく観察が判断になります。PCのキーとスマホの表示ボタンは同じ行動を実行し、45ミッションは発見、戦闘、装備、解読、報告をそれぞれ記録します。",
      save:"アカウント不要。任務、EXP、レベル、体力、装備、宝箱、撃破、チェックポイント、選択はブラウザへ自動保存されます。移動だけでは毎フレーム保存しません。5ダイヤのシグナルアンカーは任意の永続HP強化です。",
      q:["ミッションと地域はいくつ？","真実視界はエネルギーを使う？","装備は外せる？","倒されるとどうなる？","所要時間は？"],
      a:["45ミッションと5つの主要地域があり、物語でゲートが順に開きます。","使いません。レンズ入手後は自由に切り替え、透明な敵、偽装、隠し道、宝を発見できます。","外せます。能力はメニューに表示され、外しても所有権は失いません。","安全なチェックポイントへ戻り、永続進行と重要な状態は残ります。","探索と戦闘で変わります。3章は分けて遊べ、ローカル地点から再開できます。"],
      related:["アニマル・レリックハンターズ","遺物を集め、多段階ガーディアンと戦う部屋制アクション。","アニマル・クリスタルサバイバー","30ルートで構成を作り、6体のボスへ挑むサバイバル。","シャドウウルフ・レジェンド","敵対策と段階変化ボスを持つダークなアクション戦役。"]
    },
    ko:{
      title:"《시그널 베일》 완전 조사 가이드",lead:"피아의 45개 임무, 실시간 전투, 뉴럴 비전, 장비와 로컬 진행을 설명합니다.",
      section:["세계와 조사 목표","조작과 전체 게임 루프","성장·장비·난이도","실전 조사 팁","개발 디자인 노트","플레이어·기기·저장 정보","자주 묻는 질문","관련 WeightPlay 게임"],
      overview:"현재 이야기는 시그널 타운, 베일우드 숲, 신경 연구소, 문폴 중계소, 애쉬폴 천문대를 잇는 45개 임무입니다. 목격자를 조사하고 숨은 길을 찾으며 순찰대를 물리치고 장비와 기록을 회수한 뒤 애쉬폴 증거를 어떻게 다룰지 선택합니다.",
      steps:["화면 위 현재 목표를 읽고 지역을 탐색합니다.","보이는 상호작용 표시를 누르거나 E로 대화, 상자, 기록, 게이트를 사용합니다.","적을 바라보고 공격으로 검기, 스킬로 원거리 신호탄을 사용합니다.","청록 단서에서 진실 시야를 켜 위장, 투명 적, 숨은 길을 찾습니다.","목표를 끝내고 이야기에서 요구하면 증거를 오를라에게 가져갑니다."],
      design:"연결된 세계는 장소와 단서를 함께 기억하게 합니다. 진실 시야는 에너지를 쓰지 않아 자원 절약보다 관찰이 중요합니다. PC 단축키와 모바일 버튼은 같은 행동을 수행하며 45개 임무는 발견, 전투, 장비, 해독과 보고를 실제로 기록합니다.",
      save:"계정은 필요 없습니다. 임무, EXP, 레벨, 체력, 장비, 상자, 처치, 체크포인트와 선택은 브라우저에 자동 저장됩니다. 이동은 매 프레임 저장하지 않습니다. 5다이아 시그널 앵커는 선택형 영구 최대 체력 강화입니다.",
      q:["임무와 지역은 몇 개인가요?","진실 시야는 에너지를 쓰나요?","장비를 해제할 수 있나요?","피아가 쓰러지면 어떻게 되나요?","플레이 시간은 얼마나 되나요?"],
      a:["45개 임무와 5개 주요 지역이 있으며 이야기 진행에 따라 연결 게이트가 열립니다.","아니요. 렌즈 해제 후 자유롭게 전환해 투명 적, 위장 인물, 숨은 길과 보물을 찾습니다.","가능합니다. 메뉴에서 능력을 보고 해제해도 소유한 장비는 사라지지 않습니다.","안전 체크포인트로 돌아가며 영구 진행과 중요한 상태는 유지됩니다.","탐색과 전투 속도에 따라 다릅니다. 3개 장을 나누어 플레이하고 로컬 지점에서 이어갈 수 있습니다."],
      related:["동물 유물 사냥꾼","유물을 모으고 단계가 바뀌는 수호자와 싸우는 방 기반 원정.","동물 크리스털 서바이버","30개 루트에서 빌드를 만들고 6종 보스에 도전합니다.","섀도 울프 레전드","적 대응과 다단계 보스가 있는 어두운 액션 캠페인."]
    },
    es:{
      title:"Guía completa de Velo de Señal",lead:"Las 45 misiones de Fia, el combate, la Visión Neural, el equipo y el progreso local.",
      section:["Mundo y misión","Controles y ciclo completo","Progreso, equipo y dificultad","Consejos de investigación","Nota de diseño","Jugador, dispositivo y guardado","Preguntas frecuentes","Juegos relacionados de WeightPlay"],
      overview:"La historia actual reúne 45 misiones conectadas entre Pueblo Señal, el Bosque del Velo, el laboratorio neural, Repetidor Moonfall y el Observatorio Ashfall. Interroga testigos, sigue rutas ocultas, combate patrullas, recupera equipo, descifra registros y decide cómo tratar las pruebas de Ashfall.",
      steps:["Lee el objetivo superior y explora la región actual.","Toca el aviso visible o pulsa E para hablar, abrir cofres, activar registros y usar portales.","Mira al enemigo y usa Ataque para la onda de espada o Habilidad para un disparo lejano.","Activa Visión real junto a pistas cian para descubrir disfraces, enemigos invisibles y rutas.","Completa el objetivo y lleva las pruebas a Orla cuando lo pida la historia."],
      design:"El mundo continuo mantiene unidos lugares y pistas. La Visión real no gasta energía: la decisión consiste en observar, no en ahorrar un recurso. Los atajos de PC y los botones móviles ejecutan las mismas acciones, y las 45 misiones registran descubrimientos, combates, equipo, pruebas y regresos reales.",
      save:"No requiere cuenta. Misiones, EXP, nivel, salud, equipo, cofres, derrotas, puntos seguros y decisiones se guardan automáticamente en este navegador. Caminar no escribe cada fotograma. El Ancla de Señal de cinco diamantes es una mejora permanente opcional de salud.",
      q:["¿Cuántas misiones y regiones hay?","¿La Visión real consume energía?","¿Puedo quitar equipo?","¿Qué ocurre si Fia cae?","¿Cuánto dura la investigación?"],
      a:["Hay 45 misiones y cinco regiones principales; la historia abre portales entre ellas.","No. Tras obtener la lente puedes alternarla libremente para revelar amenazas, disfraces, rutas y tesoros.","Sí. El menú muestra sus atributos y quitar una pieza no elimina su propiedad.","Fia vuelve al último punto seguro y conserva el progreso permanente y los estados importantes.","Depende de la exploración y el combate. Los tres capítulos pueden jugarse por partes desde el guardado local."],
      related:["Cazadores de Reliquias Animales","Expediciones por salas con reliquias y Guardianes de varias fases.","Superviviente de Cristal Animal","Crea una configuración en treinta rutas y vence a seis jefes distintos.","Leyenda del Lobo Sombrío","Campaña de acción oscura con contramedidas y jefes por fases."]
    },
    "pt-BR":{
      title:"Guia completo de Véu do Sinal",lead:"As 45 missões de Fia, combate, Visão Neural, equipamentos e progresso local.",
      section:["Mundo e missão","Controles e ciclo completo","Progresso, equipamento e dificuldade","Dicas de investigação","Nota de design","Jogador, dispositivo e salvamento","Perguntas frequentes","Jogos relacionados da WeightPlay"],
      overview:"A história atual reúne 45 missões ligadas entre Cidade Sinal, Floresta do Véu, laboratório neural, Retransmissor Moonfall e Observatório Ashfall. Entreviste testemunhas, encontre rotas ocultas, derrote patrulhas, recupere equipamentos, decodifique registros e escolha o destino das provas.",
      steps:["Leia o objetivo no topo e explore a região atual.","Toque no aviso visível ou use E para conversar, abrir baús, ativar registros e atravessar portais.","Olhe para o inimigo e use Ataque para a onda de espada ou Habilidade para o tiro distante.","Ative a Visão real perto de pistas ciano para revelar disfarces, inimigos e caminhos ocultos.","Conclua o objetivo e leve as provas a Orla quando a história pedir."],
      design:"O mundo contínuo mantém locais e pistas conectados. A Visão real não consome energia: a escolha é observar, não economizar recurso. Atalhos no computador e botões no celular executam as mesmas ações; as 45 missões registram descobertas, combates, equipamentos, provas e retornos reais.",
      save:"Não exige conta. Missões, EXP, nível, vida, equipamentos, baús, derrotas, pontos seguros e escolhas são salvos automaticamente neste navegador. Caminhar não grava a cada quadro. A Âncora de Sinal de cinco Diamantes é um aumento permanente e opcional de vida.",
      q:["Quantas missões e regiões existem?","A Visão real gasta energia?","Posso remover equipamentos?","O que acontece se Fia cair?","Quanto dura a investigação?"],
      a:["São 45 missões e cinco regiões principais, com portais liberados pela história.","Não. Após liberar a lente, alterne livremente para revelar ameaças, disfarces, rotas e tesouros.","Sim. O menu mostra os atributos; remover uma peça não apaga sua propriedade.","Fia retorna ao ponto seguro e mantém progresso permanente e estados importantes.","Depende da exploração e do combate. Os três capítulos podem ser jogados em partes usando o save local."],
      related:["Caçadores de Relíquias Animais","Expedições por salas com relíquias e Guardiões de várias fases.","Sobrevivente de Cristal Animal","Monte uma configuração em trinta rotas e enfrente seis chefes.","Lenda do Lobo Sombrio","Campanha sombria com contra-ataques e chefes de várias fases."]
    },
    fr:{
      title:"Guide complet de Voile du Signal",lead:"Les 45 missions de Fia, le combat, la Vision Neurale, l'équipement et la progression locale.",
      section:["Monde et mission","Commandes et boucle complète","Progression, équipement et difficulté","Conseils d'enquête","Note de conception","Joueur, appareil et sauvegarde","Questions fréquentes","Jeux WeightPlay associés"],
      overview:"L'histoire actuelle compte 45 missions reliant Signalbourg, la forêt du Voile, le laboratoire neural, le Relais Moonfall et l'Observatoire Ashfall. Interrogez les témoins, suivez les voies cachées, combattez les patrouilles, récupérez l'équipement, décodez les archives et choisissez le sort des preuves.",
      steps:["Lisez l'objectif en haut puis explorez la région actuelle.","Touchez l'invite visible ou appuyez sur E pour parler, ouvrir, activer et franchir les portails.","Faites face à l'ennemi puis utilisez Attaque pour l'onde d'épée ou Compétence à distance.","Activez la Vision réelle près des indices cyan pour révéler déguisements, ennemis et chemins cachés.","Terminez l'objectif et rapportez les preuves à Orla lorsque l'histoire le demande."],
      design:"Le monde continu maintient les lieux et les indices reliés. La Vision réelle ne consomme pas d'énergie : la décision porte sur l'observation. Les raccourcis PC et boutons mobiles exécutent les mêmes actions, et les 45 missions consignent de vraies découvertes, batailles, pièces d'équipement et preuves.",
      save:"Aucun compte requis. Missions, EXP, niveau, santé, équipement, coffres, victoires, points sûrs et choix sont sauvegardés automatiquement dans ce navigateur. Le déplacement seul n'écrit pas à chaque image. L'Ancre de Signal à cinq Diamants est une amélioration de santé permanente facultative.",
      q:["Combien de missions et de régions ?","La Vision réelle consomme-t-elle de l'énergie ?","Peut-on retirer l'équipement ?","Que se passe-t-il si Fia tombe ?","Combien de temps dure l'enquête ?"],
      a:["Il existe 45 missions et cinq régions principales reliées par des portails ouverts par l'histoire.","Non. Après avoir obtenu la lentille, changez librement pour révéler menaces, déguisements, passages et trésors.","Oui. Le menu affiche les effets et retirer une pièce ne supprime pas sa propriété.","Fia revient au point sûr en conservant sa progression permanente et les états importants.","Cela dépend de l'exploration et du combat. Les trois chapitres se jouent en plusieurs sessions grâce à la sauvegarde locale."],
      related:["Chasseurs de Reliques Animaux","Expéditions en salles, reliques à collectionner et Gardiens en plusieurs phases.","Survivant de Cristal Animal","Créez une configuration sur trente routes et affrontez six Boss distincts.","Légende du Loup d'Ombre","Campagne d'action sombre avec contres ennemis et Boss à phases."]
    },
    de:{
      title:"Vollständiger Signal Veil-Ermittlungsleitfaden",lead:"Fias 45 Missionen, Echtzeitkampf, Neural Vision, Ausrüstung und lokaler Fortschritt.",
      section:["Welt und Auftrag","Steuerung und Spielschleife","Fortschritt, Ausrüstung und Schwierigkeit","Praktische Ermittlungstipps","Designnotiz","Spieler-, Geräte- und Speicherinfos","Häufige Fragen","Verwandte WeightPlay-Spiele"],
      overview:"Die aktuelle Geschichte umfasst 45 verbundene Missionen in Signalstadt, Schleierwald, Neurallabor, Moonfall-Relais und Ashfall-Observatorium. Befrage Zeugen, folge verborgenen Wegen, besiege Patrouillen, berge Ausrüstung, entschlüssele Aufzeichnungen und entscheide über die Ashfall-Beweise.",
      steps:["Lies das Ziel oben und erkunde das aktuelle Gebiet.","Tippe auf den sichtbaren Hinweis oder drücke E für Gespräche, Truhen, Aufzeichnungen und Tore.","Blicke zum Gegner und nutze Angriff für die Schwertwelle oder Fähigkeit für den Fernschuss.","Aktiviere Wahre Sicht bei cyanfarbenen Spuren, um Tarnungen, unsichtbare Gegner und Wege zu finden.","Erfülle das Ziel und bringe Beweise zu Orla, wenn die Geschichte es verlangt."],
      design:"Die zusammenhängende Welt hält Orte und Hinweise in Beziehung. Wahre Sicht kostet keine Energie; Beobachtung ist wichtiger als Sparen. PC-Tasten und sichtbare Mobilbuttons führen dieselben Aktionen aus. Die 45 Missionen erfassen echte Entdeckungen, Kämpfe, Ausrüstung, Beweise und Berichte.",
      save:"Kein Konto nötig. Missionen, EP, Level, Gesundheit, Ausrüstung, Truhen, Siege, Kontrollpunkte und Entscheidungen werden automatisch in diesem Browser gespeichert. Bewegung schreibt nicht jedes Bild. Der Signalanker für fünf Diamanten ist eine optionale permanente Lebensverbesserung.",
      q:["Wie viele Missionen und Gebiete gibt es?","Verbraucht Wahre Sicht Energie?","Kann Ausrüstung abgelegt werden?","Was passiert bei einer Niederlage?","Wie lange dauert die Ermittlung?"],
      a:["Es gibt 45 Missionen und fünf Hauptgebiete; die Geschichte öffnet verbindende Tore.","Nein. Nach Freischaltung der Linse kannst du frei wechseln und Tarnungen, Gegner, Wege und Schätze enthüllen.","Ja. Das Menü zeigt Werte; Ablegen löscht den Besitz nicht.","Fia kehrt zum sicheren Kontrollpunkt zurück und behält dauerhaften Fortschritt sowie wichtige Zustände.","Das hängt von Erkundung und Kampf ab. Die drei Kapitel lassen sich mit dem lokalen Spielstand aufteilen."],
      related:["Tierische Reliktjäger","Raum-Expeditionen mit Relikten und mehrphasigen Wächtern.","Tierischer Kristallüberlebender","Baue auf dreißig Routen eine Ausrüstung und besiege sechs Bosse.","Legende des Schattenwolfs","Dunkle Actionkampagne mit Kontern und mehrphasigen Bossen."]
    },
    it:{
      title:"Guida completa di Velo del Segnale",lead:"Le 45 missioni di Fia, il combattimento, la Visione Neurale, l'equipaggiamento e i progressi locali.",
      section:["Mondo e missione","Comandi e ciclo completo","Progressione, equipaggiamento e difficoltà","Consigli d'indagine","Nota di design","Giocatore, dispositivo e salvataggio","Domande frequenti","Giochi WeightPlay correlati"],
      overview:"La storia attuale comprende 45 missioni collegate tra Città Segnale, Foresta del Velo, laboratorio neurale, Ripetitore Moonfall e Osservatorio Ashfall. Interroga testimoni, segui percorsi nascosti, sconfiggi pattuglie, recupera equipaggiamento, decodifica registri e scegli come gestire le prove.",
      steps:["Leggi l'obiettivo in alto ed esplora la regione attuale.","Tocca l'indicatore visibile o premi E per parlare, aprire bauli, attivare registri e usare portali.","Guarda il nemico e usa Attacco per l'onda di spada o Abilità per il colpo a distanza.","Attiva la Visione reale vicino agli indizi ciano per scoprire travestimenti, nemici e passaggi nascosti.","Completa l'obiettivo e riporta le prove a Orla quando lo richiede la storia."],
      design:"Il mondo continuo tiene uniti luoghi e indizi. La Visione reale non consuma energia: la scelta riguarda l'osservazione. Scorciatoie desktop e pulsanti mobili eseguono le stesse azioni, mentre le 45 missioni registrano vere scoperte, battaglie, equipaggiamento, prove e rapporti.",
      save:"Non serve un account. Missioni, EXP, livello, salute, equipaggiamento, bauli, sconfitte, checkpoint e scelte vengono salvati automaticamente nel browser. Il movimento non scrive ogni fotogramma. L'Ancora del Segnale da cinque Diamanti è un aumento permanente opzionale della salute.",
      q:["Quante missioni e regioni ci sono?","La Visione reale consuma energia?","Posso rimuovere l'equipaggiamento?","Cosa succede se Fia cade?","Quanto dura l'indagine?"],
      a:["Ci sono 45 missioni e cinque regioni principali; la storia apre i portali di collegamento.","No. Dopo aver sbloccato la lente puoi alternarla liberamente per rivelare minacce, travestimenti, vie e tesori.","Sì. Il menu mostra gli effetti e rimuovere un oggetto non ne cancella il possesso.","Fia torna al checkpoint sicuro conservando progressi permanenti e stati importanti.","Dipende da esplorazione e combattimento. I tre capitoli possono essere giocati in più sessioni dal salvataggio locale."],
      related:["Cacciatori di Reliquie Animali","Spedizioni a stanze con reliquie e Guardiani in più fasi.","Sopravvissuto di Cristallo Animale","Crea una configurazione in trenta percorsi e affronta sei Boss.","Leggenda del Lupo Ombra","Campagna d'azione oscura con contromosse e Boss a fasi."]
    },
    ru:{
      title:"Полное руководство по Signal Veil",lead:"45 заданий Фии, бой, нейрозрение, снаряжение и локальный прогресс.",
      section:["Мир и расследование","Управление и игровой цикл","Развитие, снаряжение и сложность","Практические советы","Заметка разработчика","Игрок, устройство и сохранение","Частые вопросы","Похожие игры WeightPlay"],
      overview:"Текущая история состоит из 45 связанных заданий в Сигнал-Сити, Лесу Завесы, нейролаборатории, ретрансляторе Moonfall и обсерватории Ashfall. Опроси свидетелей, найди скрытые пути, победи патрули, собери снаряжение, расшифруй записи и реши судьбу доказательств.",
      steps:["Прочитай текущую цель сверху и исследуй регион.","Нажми видимую подсказку или E, чтобы говорить, открывать сундуки, читать записи и проходить через врата.","Повернись к врагу и используй Атаку для волны меча или Навык для дальнего выстрела.","Включай Истинное зрение у голубых следов, чтобы видеть маскировку, невидимых врагов и пути.","Заверши цель и отнеси доказательства Орле, когда потребует сюжет."],
      design:"Связный мир помогает помнить места и улики. Истинное зрение не расходует энергию: важна наблюдательность, а не запас ресурса. Клавиши ПК и кнопки телефона выполняют одинаковые действия, а 45 заданий фиксируют реальные открытия, бои, предметы, доказательства и отчёты.",
      save:"Аккаунт не нужен. Задания, опыт, уровень, здоровье, снаряжение, сундуки, победы, контрольные точки и решения автоматически сохраняются в браузере. Движение не записывается каждый кадр. Сигнальный якорь за пять алмазов — необязательное постоянное усиление здоровья.",
      q:["Сколько заданий и регионов?","Истинное зрение расходует энергию?","Можно снять снаряжение?","Что будет при поражении Фии?","Сколько длится расследование?"],
      a:["Доступны 45 заданий и пять основных регионов; сюжет постепенно открывает врата между ними.","Нет. После получения линзы можно свободно переключаться и раскрывать врагов, маскировку, пути и сокровища.","Да. Меню показывает параметры, а снятие не удаляет уже найденный предмет.","Фиа возвращается к безопасной точке, сохраняя постоянный прогресс и важные состояния.","Зависит от исследования и боя. Три главы можно проходить частями благодаря локальному сохранению."],
      related:["Охотники за реликвиями","Комнатные экспедиции с реликвиями и многофазными Стражами.","Хрустальный выживший","Создай сборку на тридцати маршрутах и победи шесть боссов.","Легенда Теневого Волка","Мрачная экшен-кампания с контрмерами и фазовыми боссами."]
    },
    hi:{
      title:"सिग्नल वेल की पूरी जाँच गाइड",lead:"फिया के 45 मिशन, युद्ध, न्यूरल विज़न, उपकरण और स्थानीय प्रगति की पूरी जानकारी।",
      section:["दुनिया और मिशन","नियंत्रण और पूरा खेल चक्र","प्रगति, उपकरण और कठिनाई","जाँच के उपयोगी सुझाव","डेवलपर डिज़ाइन नोट","खिलाड़ी, डिवाइस और सेव जानकारी","सामान्य प्रश्न","संबंधित WeightPlay गेम"],
      overview:"वर्तमान कहानी में सिग्नल टाउन, वेलवुड जंगल, न्यूरल प्रयोगशाला, मूनफॉल रिले और ऐशफॉल वेधशाला से जुड़े 45 मिशन हैं। गवाहों से पूछें, छिपे रास्ते खोजें, गश्त हराएँ, उपकरण पाएँ, रिकॉर्ड पढ़ें और सबूत का भविष्य चुनें।",
      steps:["ऊपर दिख रहे लक्ष्य को पढ़ें और वर्तमान क्षेत्र खोजें।","दिखने वाले संकेत को टैप करें या E से बात, संदूक, रिकॉर्ड और द्वार उपयोग करें।","दुश्मन की ओर देखकर हमला से तलवार तरंग या कौशल से दूर का संकेत चलाएँ।","नीले संकेत पर सच्ची दृष्टि चालू करके भेष, अदृश्य शत्रु और छिपे रास्ते देखें।","लक्ष्य पूरा करें और कहानी माँगे तो सबूत ऑर्ला को दें।"],
      design:"जुड़ी दुनिया स्थानों और सुरागों को याद रखना आसान बनाती है। सच्ची दृष्टि ऊर्जा नहीं खर्च करती, इसलिए फैसला संसाधन बचाने का नहीं बल्कि ध्यान से देखने का है। PC कुंजियाँ और मोबाइल बटन वही काम करते हैं; 45 मिशन असली खोज, युद्ध, उपकरण, सबूत और रिपोर्ट दर्ज करते हैं।",
      save:"खाता जरूरी नहीं। मिशन, EXP, स्तर, स्वास्थ्य, उपकरण, संदूक, जीत, चेकपॉइंट और फैसले ब्राउज़र में अपने आप सेव होते हैं। चलना हर फ्रेम नहीं लिखता। पाँच डायमंड का सिग्नल एंकर वैकल्पिक स्थायी अधिकतम स्वास्थ्य बढ़ोतरी है।",
      q:["कितने मिशन और क्षेत्र हैं?","क्या सच्ची दृष्टि ऊर्जा खर्च करती है?","क्या उपकरण हटा सकते हैं?","फिया हार जाए तो क्या होता है?","जाँच कितनी लंबी है?"],
      a:["45 मिशन और पाँच मुख्य क्षेत्र हैं; कहानी उनके बीच द्वार खोलती है।","नहीं। लेंस मिलने के बाद इसे कभी भी बदलकर छिपे शत्रु, भेष, रास्ते और खजाने देखें।","हाँ। मेनू प्रभाव दिखाता है और हटाने से पाया हुआ उपकरण मिटता नहीं।","फिया सुरक्षित चेकपॉइंट पर लौटती है और स्थायी प्रगति व जरूरी स्थिति बची रहती है।","यह खोज और युद्ध पर निर्भर है। तीन अध्याय स्थानीय सेव से अलग-अलग सत्रों में पूरे किए जा सकते हैं।"],
      related:["एनिमल रेलिक हंटर्स","अवशेष और कई चरण वाले संरक्षकों की कमरा-आधारित यात्रा।","एनिमल क्रिस्टल सर्वाइवर","तीस मार्गों पर बिल्ड बनाएँ और छह अलग बॉस हराएँ।","शैडो वुल्फ लेजेंड","दुश्मन जवाब और चरण बदलते बॉस वाला गहरा एक्शन अभियान।"]
    },
    ar:{
      title:"الدليل الكامل لحجاب الإشارة",lead:"شرح 45 مهمة لفيا والقتال والرؤية العصبية والمعدات والحفظ المحلي.",
      section:["العالم ومهمة التحقيق","التحكم ودورة اللعب","التقدم والمعدات والصعوبة","نصائح عملية","ملاحظة التصميم","معلومات اللاعب والجهاز والحفظ","الأسئلة الشائعة","ألعاب WeightPlay مرتبطة"],
      overview:"تضم القصة الحالية 45 مهمة مترابطة في بلدة الإشارة وغابة الحجاب والمختبر العصبي ومرحل Moonfall ومرصد Ashfall. استجوب الشهود واتبع الطرق المخفية واهزم الدوريات واجمع المعدات وفك السجلات واختر مصير الأدلة.",
      steps:["اقرأ الهدف أعلى العالم واستكشف المنطقة الحالية.","المس تنبيه التفاعل الظاهر أو اضغط E للحديث وفتح الصناديق وتفعيل السجلات واستخدام البوابات.","واجه العدو واستخدم الهجوم لموجة السيف أو المهارة للقذيفة البعيدة.","فعّل الرؤية الحقيقية قرب الآثار السماوية لكشف التنكر والأعداء والطرق المخفية.","أكمل الهدف وأعد الأدلة إلى أورلا عندما تطلب القصة."],
      design:"يبقي العالم المتصل الأماكن والقرائن مرتبطة. لا تستهلك الرؤية الحقيقية طاقة، لذلك يعتمد القرار على الملاحظة لا توفير مورد. تنفذ مفاتيح الكمبيوتر وأزرار الهاتف الأفعال نفسها، وتسجل المهام الخمس والأربعون اكتشافات ومعارك ومعدات وأدلة وتقارير فعلية.",
      save:"لا يلزم حساب. تحفظ المهمات والخبرة والمستوى والصحة والمعدات والصناديق والانتصارات ونقاط الأمان والاختيارات تلقائيا في المتصفح. لا تسجل الحركة كل إطار. مرساة الإشارة مقابل خمسة ألماسات زيادة دائمة اختيارية للصحة.",
      q:["كم مهمة ومنطقة متاحة؟","هل تستهلك الرؤية الحقيقية طاقة؟","هل يمكن نزع المعدات؟","ماذا يحدث عند هزيمة فيا؟","كم يستغرق التحقيق؟"],
      a:["هناك 45 مهمة وخمس مناطق رئيسية، وتفتح القصة البوابات التي تصل بينها.","لا. بعد فتح العدسة بدّل بحرية لكشف الأخطار والتنكر والطرق والكنوز.","نعم. تعرض القائمة التأثيرات، ولا يؤدي النزع إلى حذف ملكية القطعة.","تعود فيا إلى نقطة آمنة مع بقاء التقدم الدائم والحالات المهمة.","يعتمد على الاستكشاف والقتال. يمكن لعب الفصول الثلاثة على جلسات باستخدام الحفظ المحلي."],
      related:["صيادو الآثار الحيوانية","رحلات بين الغرف مع آثار وحراس متعددي المراحل.","الناجي البلوري الحيواني","كوّن تجهيزك عبر ثلاثين مسارا وواجه ستة زعماء.","أسطورة ذئب الظلال","حملة حركة داكنة مع مواجهات مضادة وزعماء متعددي المراحل."]
    }
  };

  const routeNames={
    es:["Cazadores de Reliquias Animales","Superviviente de Cristal Animal","Leyenda del Lobo Sombrío"],
    "pt-BR":["Caçadores de Relíquias Animais","Sobrevivente de Cristal Animal","Lenda do Lobo Sombrio"]
  };
  const sentences=value=>String(value||"").split(/(?<=[.!?。！？])\s*/).filter(Boolean);
  const fillRegional=(code,text)=>{
    const base=locales[code],tips=sentences(base.guideTips);
    Object.assign(base,{
      summary:text.lead,
      guideTitle:text.title,guideLead:text.lead,
      guideOverviewTitle:text.section[0],guideOverviewA:base.guideOverview,guideOverviewB:text.overview,
      guideHowTitle:text.section[1],
      guideStep1:text.steps[0],guideStep2:text.steps[1],guideStep3:text.steps[2],guideStep4:text.steps[3],guideStep5:text.steps[4],
      guideLoop:`${base.guideControls} ${base.guideVision}`,
      guideProgressTitle:text.section[2],guideProgression:`${base.guideProgress} ${base.guideChapterTwo} ${base.guideChapterThree}`,
      guideTipsTitle:text.section[3],
      guideTip1:tips[0]||base.guideTips,guideTip2:tips[1]||text.steps[2],guideTip3:tips[2]||text.steps[3],guideTip4:tips[3]||text.overview,guideTip5:tips[4]||tips.at(-1)||base.guideTips,
      guideDesignTitle:text.section[4],guideDesign:text.design,
      guideSaveTitle:text.section[5],guideSave:`${base.guideWin} ${text.save}`,
      guideFaqTitle:text.section[6],
      guideFaqQ1:text.q[0],guideFaqA1:text.a[0],guideFaqQ2:text.q[1],guideFaqA2:text.a[1],
      guideFaqQ3:text.q[2],guideFaqA3:text.a[2],guideFaqQ4:text.q[3],guideFaqA4:text.a[3],
      guideFaqQ5:text.q[4],guideFaqA5:text.a[4],
      guideRelatedTitle:text.section[7],
      guideRelated1Title:text.related[0],guideRelated1Text:text.related[1],
      guideRelated2Title:text.related[2],guideRelated2Text:text.related[3],
      guideRelated3Title:text.related[4],guideRelated3Text:text.related[5]
    });
  };

  Object.assign(locales.en,en);
  Object.assign(locales["zh-Hant"],zhHant);
  for(const [code,text] of Object.entries(regional))fillRegional(code,text);
  void routeNames;
})();
