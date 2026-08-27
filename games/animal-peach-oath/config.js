(function () {
  "use strict";

  window.PEACH_OATH_CONFIG = Object.freeze({
    gameId: "animal-peach-oath",
    gameVersion: "v4",
    interfaceVersion: 1,
    saveKey: "weightplay_animal_peach_oath_v1",
    maxOfflineSeconds: 28800,
    heroLevelCap: 80,
    chapterSize: 10,
    bossEvery: 5,
    heroes: [
      { id: "leo", name: "玄德獅", title: "仁德劍主", troop: "步兵", quality: "傳說", role: "前排均衡", skill: "桃園劍陣", passive: "仁心：全隊生命 +8%", atk: 24, hp: 240, speed: 1.0, color: "#f2c14e", sprite: 0 },
      { id: "tiger", name: "雲長虎", title: "赤膽騎將", troop: "騎兵", quality: "史詩", role: "突進爆發", skill: "青月斬", passive: "威震：暴擊率 +10%", atk: 34, hp: 185, speed: 1.2, color: "#ef5b5b", sprite: 1 },
      { id: "bear", name: "翼德熊", title: "鐵壁槍衛", troop: "槍兵", quality: "史詩", role: "前排守護", skill: "長坂怒吼", passive: "鐵壁：所受傷害 -8%", atk: 22, hp: 285, speed: 0.88, color: "#43b6a5", sprite: 2 },
      { id: "crane", name: "孔明鶴", title: "羽扇軍師", troop: "謀士", quality: "傳說", role: "群體法術", skill: "東風星火", passive: "奇謀：技能冷卻 -10%", atk: 31, hp: 165, speed: 0.94, color: "#74a8f5", sprite: 3 },
      { id: "fox", name: "子龍狐", title: "常勝弓將", troop: "弓兵", quality: "稀有", role: "遠程連射", skill: "七進箭雨", passive: "敏銳：攻速 +12%", atk: 28, hp: 175, speed: 1.28, color: "#72c96b", sprite: 4 }
    ],
    enemies: [
      { id: "wolf", name: "灰狼刀兵", troop: "步兵", atk: 10, hp: 82, speed: 0.95, sprite: 0 },
      { id: "boar", name: "野豬騎尉", troop: "騎兵", atk: 14, hp: 110, speed: 1.1, sprite: 1 },
      { id: "hyena", name: "鬣狗弩手", troop: "弓兵", atk: 17, hp: 78, speed: 1.15, sprite: 2 },
      { id: "cobra", name: "白蛇妖士", troop: "謀士", atk: 20, hp: 90, speed: 0.92, sprite: 3 },
      { id: "buffalo", name: "黑角魔將", troop: "槍兵", atk: 28, hp: 330, speed: 0.82, sprite: 4, boss: true }
    ],
    troopCounters: { "步兵": "弓兵", "騎兵": "步兵", "槍兵": "騎兵", "弓兵": "謀士", "謀士": "槍兵" },
    equipment: [
      { id: "bronze-sword", name: "百鍊青銅劍", slot: "武器", stat: "atk", value: 8, quality: "精良" },
      { id: "jade-armor", name: "桃紋明光甲", slot: "鎧甲", stat: "hp", value: 72, quality: "史詩" },
      { id: "swift-boots", name: "踏雲戰靴", slot: "戰靴", stat: "speed", value: 0.08, quality: "稀有" },
      { id: "war-seal", name: "盟誓兵符", slot: "寶物", stat: "atk", value: 13, quality: "傳說" }
    ],
    chapters: ["桃園起兵", "黃巾風雲", "虎牢雄關", "徐州月夜", "荊州長歌", "赤壁東風", "漢中爭鋒", "五丈星落"],
    missions: [
      { id: "battle10", label: "主線：擊敗 10 名敵軍", target: 10, field: "kills", reward: { coins: 1200 } },
      { id: "upgrade3", label: "每日：完成 3 次武將升級", target: 3, field: "upgrades", reward: { ingots: 30 } },
      { id: "summon1", label: "每日：在酒館招募 1 次", target: 1, field: "summons", reward: { coins: 1800 } },
      { id: "weekly-stage", label: "每週：推進至第 20 關", target: 20, field: "stage", reward: { ingots: 160 } },
      { id: "growth-power", label: "成長：隊伍戰力達 1,000", target: 1000, field: "power", reward: { materials: 40 } }
    ],
    achievements: [
      { id: "stage5", label: "初露鋒芒：通過第 5 關", target: 5, field: "stage", reward: { ingots: 50 } },
      { id: "power500", label: "義軍成形：戰力達 500", target: 500, field: "power", reward: { ingots: 80 } },
      { id: "boss3", label: "破陣名將：擊敗 3 名 Boss", target: 3, field: "bossKills", reward: { coins: 5000 } },
      { id: "collect5", label: "群英齊聚：收集 5 名武將", target: 5, field: "collection", reward: { ingots: 120 } }
    ]
  });
})();
