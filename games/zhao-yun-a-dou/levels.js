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

  const lanePatterns = [
    [0, 1, 2, 1, 0, 2],
    [2, 1, 0, 1, 2, 0],
    [0, 2, 0, 1, 2, 1],
    [1, 0, 2, 2, 1, 0],
  ];

  const levels = Array.from({ length: 30 }, function (_, index) {
    const chapter = Math.floor(index / 5);
    const within = index % 5;
    const pattern = lanePatterns[(chapter + within) % lanePatterns.length];
    const isOpening = index === 0;
    return {
      id: index + 1,
      chapter: chapter + 1,
      chapterName: chapterNames[chapter][0],
      chapterEnglish: chapterNames[chapter][1],
      name: "第 " + (index + 1) + " 關",
      nameEnglish: "Mission " + (index + 1),
      objective: within === 4 ? "守住阿斗，擊破敵將" : "合成部隊，守住三路",
      objectiveEnglish: within === 4 ? "Protect A Dou and defeat the commander" : "Merge your force and hold all three lanes",
      waveCount: 3 + chapter + (within === 4 ? 1 : 0),
      enemyCount: (isOpening ? 9 : 7) + chapter * 2 + within,
      enemyHp: isOpening ? 11 : 5 + chapter * 3 + within,
      enemySpeed: (isOpening ? 0.012 : 0.006) + chapter * 0.001 + within * 0.00035,
      enemyDamage: (isOpening ? 2 : 1) + Math.floor(chapter / 2),
      commandHp: (isOpening ? 8 : 14) + chapter * 4 + within * 2,
      adouHp: (isOpening ? 6 : 12) - Math.floor(chapter / 3),
      spawnGap: Math.max(12, (isOpening ? 18 : 54) - chapter * 4 - within * 2),
      startingBuns: 7 + Math.floor(within / 2),
      startingUnits: [
        { type: "spear", level: 1, slot: 0 },
        { type: within % 2 ? "blade" : "bow", level: 1, slot: 1 },
        { type: "horse", level: 1, slot: 2 },
      ],
      lanePattern: pattern,
      boss: within === 4 || chapter === 5,
      starTime: 62 - chapter * 4 - within * 2,
      hint: chapter === 0
        ? "先徵召，再把相同文字合成；不要讓任何一路空著。"
        : chapter === 1
          ? "槍守中路、弓守後排，合成前先看下一波從哪一路來。"
          : "保留一個低階兵補洞，再用高階兵處理壓力最大的路線。",
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
