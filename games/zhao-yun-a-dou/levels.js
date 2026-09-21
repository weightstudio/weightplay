(function () {
  "use strict";

  const chapterNames = [
    ["墨門初陣", "Ink Gate", "1"],
    ["長坂追兵", "Changban Pursuit", "2"],
    ["漢水鏖戰", "Han River", "3"],
    ["虎牢奇陣", "Hulao Formation", "4"],
    ["赤壁火線", "Red Cliff", "5"],
    ["蜀漢曙光", "Shu Dawn", "6"],
  ];

  // Authored encounters: rule, ordered enemy vocabulary, lane route, boss,
  // starting supply. Primary axes change alongside the resource/composition axis.
  const missions = [
    ["coverage", "soldier soldier raider", [0,1,2,0,2,1], null, 9],
    ["merge", "soldier shield soldier", [1,1,0,2,1,2], null, 10],
    ["reach", "raider soldier raider", [2,0,2,1,0,1], null, 8],
    ["reserve", "soldier raider shield", [0,2,0,2,1,1], null, 7],
    ["shield", "soldier shield soldier", [1,0,2,1,0,2], "bulwark", 10],
    ["shield", "shield soldier shield", [0,0,1,2,2,1], null, 9],
    ["reach", "shield raider soldier", [2,1,2,0,1,0], null, 8],
    ["rally", "shield soldier raider", [1,1,2,0,1,2], null, 7],
    ["reserve", "shield raider shield", [0,2,1,2,0,1], null, 8],
    ["charge", "raider shield raider", [2,0,1,2,1,0], "charger", 10],
    ["bomb", "soldier bomber soldier", [0,1,0,2,1,2], null, 8],
    ["flank", "flanker soldier bomber", [2,0,1,0,2,1], null, 9],
    ["mud", "raider bomber shield", [1,2,1,0,2,0], null, 8],
    ["bomb", "shield bomber flanker", [0,2,2,1,0,1], null, 7],
    ["flank", "bomber flanker soldier", [1,0,2,0,1,2], "weaver", 10],
    ["medic", "soldier medic shield", [0,0,2,1,2,1], null, 9],
    ["reach", "shield medic bomber", [1,2,1,0,2,0], null, 8],
    ["flank", "medic flanker soldier", [2,0,2,1,0,1], null, 8],
    ["bomb", "bomber medic raider", [0,1,2,0,1,2], null, 7],
    ["medic", "shield medic bomber flanker", [1,0,1,2,0,2], "healer", 10],
    ["drum", "soldier drummer soldier", [2,2,0,1,0,1], null, 8],
    ["rally", "raider drummer shield", [1,2,0,1,0,2], null, 7],
    ["bomb", "bomber drummer shield", [0,1,0,2,2,1], null, 9],
    ["reserve", "medic drummer flanker", [2,0,1,2,0,1], null, 6],
    ["summon", "shield drummer bomber", [0,2,1,1,2,0], "summoner", 11],
    ["bolt", "soldier arbalest soldier", [2,1,0,2,0,1], null, 8],
    ["mud", "arbalest shield bomber", [0,2,1,0,1,2], null, 8],
    ["drum", "arbalest drummer raider", [1,0,2,2,0,1], null, 7],
    ["reserve", "bomber medic arbalest shield", [2,0,2,1,0,1], null, 7],
    ["finale", "shield drummer arbalest bomber medic raider", [0,1,2,2,1,0], "warlord", 12],
  ];
  const levels = missions.map(function (row, index) {
    const chapter = Math.floor(index / 5), checkpoint = index % 5 === 4;
    return {
      id:index+1, chapter:chapter+1, chapterName:chapterNames[chapter][0], chapterEnglish:chapterNames[chapter][1],
      name:"第 "+(index+1)+" 關", nameEnglish:"Mission "+(index+1),
      rule:row[0], roster:row[1].split(" "), lanePattern:row[2], bossKind:row[3],
      boss:checkpoint, objectiveKey:checkpoint?"commander":"lanes",
      objective:row[0], objectiveEnglish:row[0],
      waveCount:3, enemyCount:12+chapter*3+(checkpoint?1:0),
      enemyHp:18+chapter*3, enemySpeed:.0057+chapter*.0001,
      enemyDamage:2, commandHp:16+chapter*5, adouHp:chapter>=3?14:10,
      spawnGap:16, startingBuns:row[4], starTime:80+chapter*8,
      startingUnits:[{type:"spear",level:index===29?4:chapter>0?2:1,slot:0},{type:"bow",level:chapter>0?2:1,slot:1},{type:"horse",level:chapter>0?2:1,slot:2}],
      terrainLane:(index+1)%3,
      hint:row[0],
    };
  });

  window.ZHAO_YUN_ADOU_LEVELS = {
    levels: levels,
    chapterNames: chapterNames,
    unitTypes: {
      blade: { glyph: "刀", name: "刀兵", english: "Blade", color: "#b95f47", damage: 2, range: 0.36, speed: 1.05 },
      spear: { glyph: "槍", name: "槍兵", english: "Spear", color: "#2e7774", damage: 2, range: 0.48, speed: 0.9 },
      horse: { glyph: "騎", name: "騎兵", english: "Rider", color: "#bd8a3d", damage: 3, range: 0.3, speed: 1.25 },
      bow: { glyph: "弓", name: "弓兵", english: "Archer", color: "#6c598f", damage: 1, range: 0.7, speed: 1.35 },
    },
    generals: {
      blade: { glyph: "關", name: "關羽", english: "Guan Yu", skill: "青龍斬", skillEnglish: "Azure Cleave", color: "#a34e4b", damage: 9 },
      spear: { glyph: "張", name: "張飛", english: "Zhang Fei", skill: "怒吼", skillEnglish: "Roar", color: "#2c6666", damage: 7 },
      horse: { glyph: "趙", name: "趙雲", english: "Zhao Yun", skill: "龍騎突襲", skillEnglish: "Dragon Charge", color: "#ad7a31", damage: 10 },
      bow: { glyph: "黃", name: "黃忠", english: "Huang Zhong", skill: "穿雲箭", skillEnglish: "Sky Arrow", color: "#625080", damage: 8 },
    },
  };
}());
