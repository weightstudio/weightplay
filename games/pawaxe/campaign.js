export const ENEMIES = {
  emberling:{name:'Ember Caster',zh:'燼火術士',hp:82,damage:15,period:3.8,warn:1.3},
  frostguard:{name:'Frost Sentinel',zh:'霜甲守衛',hp:105,damage:13,period:3.5,warn:1.2,shield:28},
  brute:{name:'Wildwood Brute',zh:'狂木巨兵',hp:135,damage:24,period:4.2,warn:1.5},
  siphon:{name:'Rune Siphon',zh:'汲能巫木',hp:94,damage:11,period:3.6,warn:1.3},
  "scout": {
    "name": "Wood Scout",
    "zh": "木甲斥候",
    "hp": 60,
    "damage": 10,
    "period": 2.8,
    "warn": 1.1
  },
  "shield": {
    "name": "Shell Guard",
    "zh": "殼盾衛",
    "hp": 85,
    "damage": 13,
    "period": 3,
    "warn": 1,
    "shield": 45
  },
  "charger": {
    "name": "Ram Golem",
    "zh": "衝撞傀儡",
    "hp": 75,
    "damage": 18,
    "period": 3.4,
    "warn": 1.35
  },
  "mender": {
    "name": "Mender",
    "zh": "修補者",
    "hp": 70,
    "damage": 0,
    "period": 3.5,
    "warn": 1.25
  },
  "thorn": {
    "name": "Thorn Claw",
    "zh": "荊棘爪",
    "hp": 90,
    "damage": 11,
    "period": 3,
    "warn": 1.1
  },
  "caller": {
    "name": "Rune Caller",
    "zh": "符木召喚者",
    "hp": 70,
    "damage": 0,
    "period": 4,
    "warn": 1.3
  },
  "mirror": {
    "name": "Mirror Guard",
    "zh": "鏡甲衛",
    "hp": 100,
    "damage": 12,
    "period": 3.3,
    "warn": 1.2
  },
  "anchor": {
    "name": "Root Anchor",
    "zh": "符根樁",
    "hp": 40,
    "damage": 0,
    "period": 4,
    "warn": 1.2
  },
  "boss-bell": {
    "name": "Hollow Bell",
    "zh": "空木鐘衛",
    "hp": 200,
    "damage": 18,
    "period": 3.8,
    "warn": 1.5
  },
  "boss-furnace": {
    "name": "Root Furnace",
    "zh": "根爐巨衛",
    "hp": 200,
    "damage": 18,
    "period": 3.8,
    "warn": 1.5
  },
  "boss-stag": {
    "name": "Mirror Stag",
    "zh": "鏡枝鹿衛",
    "hp": 200,
    "damage": 18,
    "period": 3.8,
    "warn": 1.5
  },
  "boss-loom": {
    "name": "Bramble Loom",
    "zh": "荊棘織衛",
    "hp": 200,
    "damage": 18,
    "period": 3.8,
    "warn": 1.5
  },
  "boss-conductor": {
    "name": "Rune Conductor",
    "zh": "符木指揮官",
    "hp": 200,
    "damage": 18,
    "period": 3.8,
    "warn": 1.5
  },
  "boss-heart": {
    "name": "Heart Engine",
    "zh": "森林心核機",
    "hp": 200,
    "damage": 18,
    "period": 3.8,
    "warn": 1.5
  },
  "mirror-left": {
    "name": "Left Mirror",
    "zh": "左鏡片",
    "hp": 45,
    "damage": 0,
    "period": 4,
    "warn": 1.2
  },
  "mirror-right": {
    "name": "Right Mirror",
    "zh": "右鏡片",
    "hp": 45,
    "damage": 0,
    "period": 4,
    "warn": 1.2
  },
  "root-drain": {
    "name": "Binding Root",
    "zh": "纏根符樁",
    "hp": 45,
    "damage": 0,
    "period": 4,
    "warn": 1.2
  },
  "root-crack": {
    "name": "Thorn Root",
    "zh": "裂痕符樁",
    "hp": 45,
    "damage": 3,
    "period": 4,
    "warn": 1.2
  }
};
export const stages = [
  {
    "id": 1,
    "name": "First Sparks",
    "zh": "初燃小徑",
    "encounters": [
      [
        "scout"
      ],
      [
        "scout"
      ],
      [
        "scout"
      ],
      [
        "scout"
      ]
    ],
    "enemies": [
      "scout"
    ],
    "rule": "分辨自動普攻與玩家防禦；看懂預警再完成路線",
    "checkpoint": false,
    "boss": null,
    "reward": 20
  },
  {
    "id": 2,
    "name": "Hold the Beat",
    "zh": "守住節拍",
    "encounters": [
      [
        "scout"
      ],
      [
        "charger"
      ],
      [
        "scout"
      ],
      [
        "charger"
      ]
    ],
    "enemies": [
      "scout"
    ],
    "rule": "同樣能擋的招式有不同前搖；別一直維持防禦耗乾耐力",
    "checkpoint": false,
    "boss": null,
    "reward": 20
  },
  {
    "id": 3,
    "name": "Open the Shell",
    "zh": "破殼一擊",
    "encounters": [
      [
        "shield"
      ],
      [
        "scout"
      ],
      [
        "shield"
      ],
      [
        "shield",
        "scout"
      ]
    ],
    "enemies": [
      "shield"
    ],
    "rule": "首次護盾，分辨生命傷害與削盾，決定重擊／夥伴先後",
    "checkpoint": false,
    "boss": null,
    "reward": 20
  },
  {
    "id": 4,
    "name": "Choose the Threat",
    "zh": "先解威脅",
    "encounters": [
      [
        "scout",
        "scout"
      ],
      [
        "mender",
        "scout"
      ],
      [
        "shield"
      ],
      [
        "mender",
        "shield"
      ]
    ],
    "enemies": [
      "scout",
      "scout"
    ],
    "rule": "首次優先目標：壓住治療者而非盲打盾",
    "checkpoint": false,
    "boss": null,
    "reward": 20
  },
  {
    "id": 5,
    "name": "Hollow Bell",
    "zh": "空木鐘衛",
    "encounters": [
      [
        "scout"
      ],
      [
        "shield"
      ],
      [
        "charger"
      ],
      [
        "boss-bell"
      ]
    ],
    "enemies": [
      "scout"
    ],
    "rule": "Boss 以假起手與真落槌區分反擊時機，不見光就重擊",
    "checkpoint": true,
    "boss": "boss-bell",
    "reward": 20
  },
  {
    "id": 6,
    "name": "Rootbound Armor",
    "zh": "根甲防線",
    "encounters": [
      [
        "shield"
      ],
      [
        "shield",
        "scout"
      ],
      [
        "mender"
      ],
      [
        "shield",
        "charger"
      ]
    ],
    "enemies": [
      "shield"
    ],
    "rule": "護盾回復由可視週期驅動，決定集中火力而非平均削盾",
    "checkpoint": false,
    "boss": null,
    "reward": 25
  },
  {
    "id": 7,
    "name": "Linked Roots",
    "zh": "根脈連線",
    "encounters": [
      [
        "anchor",
        "scout"
      ],
      [
        "anchor",
        "shield"
      ],
      [
        "charger"
      ],
      [
        "anchor",
        "shield"
      ]
    ],
    "enemies": [
      "anchor",
      "scout"
    ],
    "rule": "引入可攻擊供盾樁；先斷連線或用破盾快速越過",
    "checkpoint": false,
    "boss": null,
    "reward": 25
  },
  {
    "id": 8,
    "name": "Interrupted Repair",
    "zh": "截斷修補",
    "encounters": [
      [
        "mender"
      ],
      [
        "mender",
        "shield"
      ],
      [
        "anchor",
        "scout"
      ],
      [
        "mender",
        "charger"
      ]
    ],
    "enemies": [
      "mender"
    ],
    "rule": "治療與敵方攻擊交錯，重擊留給施法或反擊有取捨",
    "checkpoint": false,
    "boss": null,
    "reward": 25
  },
  {
    "id": 9,
    "name": "Two Fronts",
    "zh": "雙面夾擊",
    "encounters": [
      [
        "scout",
        "charger"
      ],
      [
        "shield",
        "charger"
      ],
      [
        "mender",
        "scout"
      ],
      [
        "shield",
        "charger"
      ]
    ],
    "enemies": [
      "scout",
      "charger"
    ],
    "rule": "兩個可見敵人的錯峰出手，判斷守勢解除時機",
    "checkpoint": false,
    "boss": null,
    "reward": 25
  },
  {
    "id": 10,
    "name": "Root Furnace",
    "zh": "根爐巨衛",
    "encounters": [
      [
        "anchor",
        "shield"
      ],
      [
        "mender",
        "scout"
      ],
      [
        "charger"
      ],
      [
        "boss-furnace"
      ]
    ],
    "enemies": [
      "anchor",
      "shield"
    ],
    "rule": "Boss 由兩個不同階段根樁供盾，先拆正在供能者",
    "checkpoint": true,
    "boss": "boss-furnace",
    "reward": 25
  },
  {
    "id": 11,
    "name": "Shining Warning",
    "zh": "亮面警告",
    "encounters": [
      [
        "mirror"
      ],
      [
        "scout"
      ],
      [
        "mirror"
      ],
      [
        "mirror",
        "scout"
      ]
    ],
    "enemies": [
      "mirror"
    ],
    "rule": "引入重擊反彈；學會普攻等待或用夥伴消亮面",
    "checkpoint": false,
    "boss": null,
    "reward": 30
  },
  {
    "id": 12,
    "name": "Patient Hands",
    "zh": "耐心護手",
    "encounters": [
      [
        "mirror",
        "shield"
      ],
      [
        "charger"
      ],
      [
        "mirror",
        "charger"
      ],
      [
        "shield"
      ]
    ],
    "enemies": [
      "mirror",
      "shield"
    ],
    "rule": "反彈姿態與可格擋突進交錯，先守後拆",
    "checkpoint": false,
    "boss": null,
    "reward": 30
  },
  {
    "id": 13,
    "name": "False Opening",
    "zh": "假隙真招",
    "encounters": [
      [
        "mirror"
      ],
      [
        "mender",
        "mirror"
      ],
      [
        "charger"
      ],
      [
        "mirror",
        "charger"
      ]
    ],
    "enemies": [
      "mirror"
    ],
    "rule": "敵人露出反擊窗口不等於亮面解除，兩種狀態須讀清楚",
    "checkpoint": false,
    "boss": null,
    "reward": 30
  },
  {
    "id": 14,
    "name": "Split the Pulse",
    "zh": "脈衝取捨",
    "encounters": [
      [
        "anchor",
        "mirror"
      ],
      [
        "mender",
        "shield"
      ],
      [
        "mirror",
        "scout"
      ],
      [
        "anchor",
        "mirror"
      ]
    ],
    "enemies": [
      "anchor",
      "mirror"
    ],
    "rule": "能量用在拆多盾還是解除亮面；補給生命／能量選擇改變下一段",
    "checkpoint": false,
    "boss": null,
    "reward": 30
  },
  {
    "id": 15,
    "name": "Mirror Stag",
    "zh": "鏡枝鹿衛",
    "encounters": [
      [
        "mirror"
      ],
      [
        "mender",
        "scout"
      ],
      [
        "shield",
        "charger"
      ],
      [
        "boss-stag"
      ]
    ],
    "enemies": [
      "mirror"
    ],
    "rule": "Boss 輪流保護兩片鏡甲，亮起的鏡片不能重擊；破兩片後才打核心",
    "checkpoint": true,
    "boss": "boss-stag",
    "reward": 30
  },
  {
    "id": 16,
    "name": "Thorn Marks",
    "zh": "荊棘裂痕",
    "encounters": [
      [
        "thorn"
      ],
      [
        "scout"
      ],
      [
        "thorn"
      ],
      [
        "thorn",
        "scout"
      ]
    ],
    "enemies": [
      "thorn"
    ],
    "rule": "引入可格擋的裂痕；選擇事前防禦或事後淨化",
    "checkpoint": false,
    "boss": null,
    "reward": 35
  },
  {
    "id": 17,
    "name": "Tangled Breath",
    "zh": "纏根喘息",
    "encounters": [
      [
        "thorn"
      ],
      [
        "anchor",
        "scout"
      ],
      [
        "charger"
      ],
      [
        "thorn",
        "charger"
      ]
    ],
    "enemies": [
      "thorn"
    ],
    "rule": "環境纏根降低耐力回復，不能照前段長時間守勢",
    "checkpoint": false,
    "boss": null,
    "reward": 35
  },
  {
    "id": 18,
    "name": "Repair or Relief",
    "zh": "修補或療癒",
    "encounters": [
      [
        "mender",
        "thorn"
      ],
      [
        "shield"
      ],
      [
        "thorn",
        "scout"
      ],
      [
        "mender",
        "thorn"
      ]
    ],
    "enemies": [
      "mender",
      "thorn"
    ],
    "rule": "優先停治療還是先解除自身裂痕，兩個時鐘同時可讀",
    "checkpoint": false,
    "boss": null,
    "reward": 35
  },
  {
    "id": 19,
    "name": "Carry the Charge",
    "zh": "留住能量",
    "encounters": [
      [
        "thorn",
        "charger"
      ],
      [
        "mirror"
      ],
      [
        "anchor",
        "shield"
      ],
      [
        "thorn",
        "mirror"
      ]
    ],
    "enemies": [
      "thorn",
      "charger"
    ],
    "rule": "先前使用夥伴的時機會影響下一個亮面／裂痕組合",
    "checkpoint": false,
    "boss": null,
    "reward": 35
  },
  {
    "id": 20,
    "name": "Bramble Loom",
    "zh": "荊棘織衛",
    "encounters": [
      [
        "thorn"
      ],
      [
        "anchor",
        "shield"
      ],
      [
        "charger"
      ],
      [
        "boss-loom"
      ]
    ],
    "enemies": [
      "thorn"
    ],
    "rule": "Boss 織出兩條不同符根：一條減回耐、一條施裂痕，玩家選拆除順序",
    "checkpoint": true,
    "boss": "boss-loom",
    "reward": 35
  },
  {
    "id": 21,
    "name": "Calling Timber",
    "zh": "召木之聲",
    "encounters": [
      [
        "caller"
      ],
      [
        "scout"
      ],
      [
        "caller",
        "shield"
      ],
      [
        "caller"
      ]
    ],
    "enemies": [
      "caller"
    ],
    "rule": "首次有限召喚；先殺／打斷召喚者減少後续處理",
    "checkpoint": false,
    "boss": null,
    "reward": 40
  },
  {
    "id": 22,
    "name": "The Protected Caller",
    "zh": "被守護的呼喚",
    "encounters": [
      [
        "caller",
        "shield"
      ],
      [
        "mender"
      ],
      [
        "caller",
        "anchor"
      ],
      [
        "caller",
        "shield"
      ]
    ],
    "enemies": [
      "caller",
      "shield"
    ],
    "rule": "保護來源不同，先斷供盾還是硬破前排後打斷",
    "checkpoint": false,
    "boss": null,
    "reward": 40
  },
  {
    "id": 23,
    "name": "Three Clear Choices",
    "zh": "三個明確選擇",
    "encounters": [
      [
        "scout",
        "shield"
      ],
      [
        "caller",
        "thorn"
      ],
      [
        "mender",
        "mirror"
      ],
      [
        "caller",
        "shield",
        "scout"
      ]
    ],
    "enemies": [
      "scout",
      "shield"
    ],
    "rule": "首次三目標，但資訊全部同屏；取捨中斷、減傷與集中擊敗",
    "checkpoint": false,
    "boss": null,
    "reward": 40
  },
  {
    "id": 24,
    "name": "Safe Supply",
    "zh": "留一口氣",
    "encounters": [
      [
        "mirror",
        "thorn"
      ],
      [
        "caller",
        "scout"
      ],
      [
        "anchor",
        "shield"
      ],
      [
        "caller",
        "thorn"
      ]
    ],
    "enemies": [
      "mirror",
      "thorn"
    ],
    "rule": "補給前後配置互補，回血與能量不是永遠同一個較優",
    "checkpoint": false,
    "boss": null,
    "reward": 40
  },
  {
    "id": 25,
    "name": "Rune Conductor",
    "zh": "符木指揮官",
    "encounters": [
      [
        "caller"
      ],
      [
        "mender",
        "shield"
      ],
      [
        "mirror",
        "scout"
      ],
      [
        "boss-conductor"
      ]
    ],
    "enemies": [
      "caller"
    ],
    "rule": "Boss 先亮起指令再召喚或群體供盾；斷指令、清支援或守反有不同收益",
    "checkpoint": true,
    "boss": "boss-conductor",
    "reward": 40
  },
  {
    "id": 26,
    "name": "Patient Breaker",
    "zh": "沉著破陣",
    "encounters": [
      [
        "mirror",
        "shield"
      ],
      [
        "caller",
        "scout"
      ],
      [
        "thorn",
        "charger"
      ],
      [
        "anchor",
        "mirror"
      ]
    ],
    "enemies": [
      "mirror",
      "shield"
    ],
    "rule": "檢核亮面、護盾與反擊先後；不再逐條停下教學",
    "checkpoint": false,
    "boss": null,
    "reward": 45
  },
  {
    "id": 27,
    "name": "Guardian's Route",
    "zh": "守護路線",
    "encounters": [
      [
        "thorn",
        "scout"
      ],
      [
        "mender",
        "charger"
      ],
      [
        "anchor",
        "thorn"
      ],
      [
        "mirror",
        "charger"
      ]
    ],
    "enemies": [
      "thorn",
      "scout"
    ],
    "rule": "以可防御裂痕與錯峰攻擊驗證守護／守反流，不排除破陣流",
    "checkpoint": false,
    "boss": null,
    "reward": 45
  },
  {
    "id": 28,
    "name": "Breaker's Route",
    "zh": "破陣路線",
    "encounters": [
      [
        "anchor",
        "shield"
      ],
      [
        "caller",
        "shield"
      ],
      [
        "mender",
        "mirror"
      ],
      [
        "caller",
        "shield",
        "scout"
      ]
    ],
    "enemies": [
      "anchor",
      "shield"
    ],
    "rule": "以可中斷支援鏈驗證快斧／破陣流，慢斧也能選時機過關",
    "checkpoint": false,
    "boss": null,
    "reward": 45
  },
  {
    "id": 29,
    "name": "Heartward Gate",
    "zh": "心核門前",
    "encounters": [
      [
        "charger",
        "thorn"
      ],
      [
        "anchor",
        "mirror"
      ],
      [
        "caller",
        "shield"
      ],
      [
        "mender",
        "mirror",
        "scout"
      ]
    ],
    "enemies": [
      "charger",
      "thorn"
    ],
    "rule": "使用全套已學規則，四次遭遇各選不同優先處理；預告終局三階段",
    "checkpoint": false,
    "boss": null,
    "reward": 45
  },
  {
    "id": 30,
    "name": "The Heart Engine",
    "zh": "森林心核機",
    "encounters": [
      [
        "shield",
        "charger"
      ],
      [
        "mender",
        "thorn"
      ],
      [
        "caller",
        "mirror"
      ],
      [
        "boss-heart"
      ]
    ],
    "enemies": [
      "shield",
      "charger"
    ],
    "rule": "終局依序拆供能、解除鏡甲、把守反與夥伴配合破心核",
    "checkpoint": true,
    "boss": "boss-heart",
    "reward": 45
  }
];
export const gear=[["trail-axe","Trail Axe","axe",0],["breaker-axe","Breaker Axe","axe",5],["quick-axe","Quick Axe","axe",10],["trail-hood","Trail Hood","head",0],["prism-visor","Prism Visor","head",8],["scout-vest","Scout Vest","body",0],["bark-vest","Bark Vest","body",6],["trail-gloves","Trail Gloves","hands",0],["iron-brace","Iron Brace","hands",12],["trail-boots","Trail Boots","feet",0],["marsh-boots","Marsh Boots","feet",16],["nut-charm","Nut Charm","charm",0],["lunar-charm","Lunar Charm","charm",15],["copper-ring","Copper Ring","ring",0],["rhythm-band","Rhythm Band","ring",25]].map(([id,name,slot,unlock])=>({id,name,slot,unlock}));
