window.WONDER_DATA = {
  assets: {
    images: {
      bg: "assets/battle-bg.webp",
      hero: "assets/weightplay-character-boom-mane-lion-cutout.webp",
      wall: "assets/wall.webp",
      eraser: "assets/eraser-v2.webp",
      pencil: "assets/weapon-pencil-v2.webp",
      ruler: "assets/weapon-ruler-v2.webp"
    },
    enemies: [
"assets/wonder-beast-boar.png",
"assets/wonder-beast-hyena.png",
"assets/wonder-beast-rhino.png",
"assets/wonder-beast-buffalo.png",
"assets/wonder-beast-hawk.png",
"assets/wonder-beast-bear.png",
"assets/wonder-beast-tiger.png",
"assets/wonder-beast-crocodile.png"
    ]
  },
  enemyTypes: [
{
      id: "boar",
      name: "Wild Boar",
      imageIndex: 0,
      role: "runner",
      hpScale: 0.75,
      speedScale: 1.35,
      damageScale: 0.75,
      sizeScale: 0.92,
      coinScale: 1,
      ability: "runner"
    },
{
      id: "hyena",
      name: "Hyena Trickster",
      imageIndex: 1,
      role: "wobbler",
      hpScale: 1,
      speedScale: 1.02,
      damageScale: 1,
      sizeScale: 1,
      coinScale: 1.1,
      ability: "zigzag"
    },
{
      id: "rhino",
      name: "Armored Rhino",
      imageIndex: 2,
      role: "tank",
      hpScale: 1.85,
      speedScale: 0.68,
      damageScale: 1.15,
      sizeScale: 1.16,
      coinScale: 1.35,
      ability: "armor"
    },
{
      id: "buffalo",
      name: "Charging Buffalo",
      imageIndex: 3,
      role: "breaker",
      hpScale: 1.25,
      speedScale: 0.82,
      damageScale: 1.75,
      sizeScale: 1.08,
      coinScale: 1.25,
      ability: "breaker"
    },
{
      id: "hawk",
      name: "Sky Hawk",
      imageIndex: 4,
      role: "dasher",
      hpScale: 0.9,
      speedScale: 1.12,
      damageScale: 1.05,
      sizeScale: 0.96,
      coinScale: 1.25,
      ability: "dash"
    },
{
      id: "bear",
      name: "Black Bear",
      imageIndex: 5,
      role: "caster",
      hpScale: 1.35,
      speedScale: 0.78,
      damageScale: 1.25,
      sizeScale: 1.04,
      coinScale: 1.45,
      ability: "zigzag"
    },
{
      id: "tiger",
      name: "Swift Tiger",
      imageIndex: 6,
      role: "sprinter",
      hpScale: 0.82,
      speedScale: 1.42,
      damageScale: 0.9,
      sizeScale: 0.9,
      coinScale: 1.25,
      ability: "dash"
    },
{
      id: "crocodile",
      name: "Crocodile King",
      imageIndex: 7,
      role: "bruiser",
      hpScale: 1.55,
      speedScale: 0.92,
      damageScale: 1.45,
      sizeScale: 1.1,
      coinScale: 1.55,
      ability: "breaker"
    }
  ],
  weapons: [
{
      id: "eraser",
      name: "橡皮擦",
      icon: "assets/eraser-v2.webp",
      projectile: "eraser",
      cooldown: 1.35,
      damageScale: 1,
      size: 76,
      speed: 1040
    },
{
      id: "pencil",
      name: "鉛筆",
      icon: "assets/weapon-pencil-v2.webp",
      projectile: "pencil",
      cooldown: 1.05,
      damageScale: 0.78,
      size: 70,
      speed: 1180
    },
{
      id: "ruler",
      name: "尺",
      icon: "assets/weapon-ruler-v2.webp",
      projectile: "ruler",
      cooldown: 1.75,
      damageScale: 1.65,
      size: 92,
      speed: 930
    }
  ],
  upgrades: [
{
      id: "damage",
      name: "銳利橡皮擦",
      desc: "武器傷害 +1",
      icon: "assets/upgrade-damage.png",
      effect: {
        projectileDamage: 1
      }
    },
{
      id: "cooldown",
      name: "快速出手",
      desc: "武器冷卻 -15%",
      icon: "assets/upgrade-cooldown.png",
      effect: {
        cooldownMultiplier: 0.85,
        minCooldownMultiplier: 0.55
      }
    },
{
      id: "double",
      name: "雙重投擲",
      desc: "每次多丟 1 個",
      icon: "assets/upgrade-double.png",
      effect: {
        projectileCount: 1
      }
    },
{
      id: "sideShot",
      name: "左右斜射",
      desc: "正面攻擊時額外往左右各丟 1 個",
      icon: "assets/upgrade-double.png",
      effect: {
        sideShots: 1
      }
    },
{
      id: "burst",
      name: "連續投擲",
      desc: "每次出手追加 1 波連射",
      icon: "assets/upgrade-cooldown.png",
      effect: {
        burstCount: 1
      }
    },
{
      id: "size",
      name: "大型文具",
      desc: "武器變大 20%",
      icon: "assets/upgrade-size.png",
      effect: {
        projectileSizeMultiplier: 0.2,
        maxProjectileSizeMultiplier: 1.8
      }
    },
{
      id: "wallHp",
      name: "修補城牆",
      desc: "立即回復 25 點城牆血量",
      icon: "assets/upgrade-repair.png",
      effect: {
        wallHp: 25,
        maxWallHp: 100
      }
    },
{
      id: "coinMultiplier",
      name: "金幣磁鐵",
      desc: "之後擊敗野獸金幣 +30%",
      icon: "assets/upgrade-coin.png",
      effect: {
        coinMultiplier: 0.3
      }
    },
{
      id: "pierce",
      name: "穿透投擲",
      desc: "武器可多穿透 1 隻敵人",
      icon: "assets/upgrade-double.png",
      effect: {
        pierceCount: 1
      }
    },
{
      id: "explode",
      name: "爆裂文具",
      desc: "命中時對附近敵人造成濺射傷害",
      icon: "assets/upgrade-size.png",
      effect: {
        splashDamage: 0.35,
        splashRadius: 145
      }
    },
{
      id: "lifeSteal",
      name: "守城回復",
      desc: "擊敗敵人時回復 3 點牆血量",
      icon: "assets/upgrade-repair.png",
      effect: {
        killHeal: 3
      }
    }
  ],
  levels: [
{
      id: 1,
      waves: [
{
          count: 8,
          hp: 1,
          speedMin: 110,
          speedMax: 149,
          damage: 7,
          coinReward: 1,
          spawnInterval: 0.77,
          sizeMin: 90,
          sizeMax: 115,
          maxEnemyType: 0
        },
{
          count: 10,
          hp: 1,
          speedMin: 118,
          speedMax: 159,
          damage: 8,
          coinReward: 2,
          spawnInterval: 0.75,
          sizeMin: 90,
          sizeMax: 115,
          maxEnemyType: 0
        },
{
          count: 12,
          hp: 2,
          speedMin: 126,
          speedMax: 169,
          damage: 9,
          coinReward: 2,
          spawnInterval: 0.73,
          sizeMin: 90,
          sizeMax: 115,
          maxEnemyType: 0
        }
      ]
    },
{
      id: 2,
      waves: [
{
          count: 10,
          hp: 1,
          speedMin: 117,
          speedMax: 158,
          damage: 8,
          coinReward: 2,
          spawnInterval: 0.73,
          sizeMin: 92,
          sizeMax: 118,
          maxEnemyType: 0
        },
{
          count: 12,
          hp: 1,
          speedMin: 125,
          speedMax: 168,
          damage: 9,
          coinReward: 3,
          spawnInterval: 0.71,
          sizeMin: 92,
          sizeMax: 118,
          maxEnemyType: 0
        },
{
          count: 14,
          hp: 2,
          speedMin: 133,
          speedMax: 178,
          damage: 10,
          coinReward: 3,
          spawnInterval: 0.69,
          sizeMin: 92,
          sizeMax: 118,
          maxEnemyType: 0
        }
      ]
    },
{
      id: 3,
      waves: [
{
          count: 12,
          hp: 2,
          speedMin: 124,
          speedMax: 167,
          damage: 9,
          coinReward: 2,
          spawnInterval: 0.7,
          sizeMin: 94,
          sizeMax: 121,
          maxEnemyType: 1
        },
{
          count: 14,
          hp: 2,
          speedMin: 132,
          speedMax: 177,
          damage: 10,
          coinReward: 3,
          spawnInterval: 0.68,
          sizeMin: 94,
          sizeMax: 121,
          maxEnemyType: 1
        },
{
          count: 16,
          hp: 3,
          speedMin: 140,
          speedMax: 187,
          damage: 11,
          coinReward: 3,
          spawnInterval: 0.66,
          sizeMin: 94,
          sizeMax: 121,
          maxEnemyType: 1
        },
{
          count: 18,
          hp: 3,
          speedMin: 148,
          speedMax: 197,
          damage: 12,
          coinReward: 4,
          spawnInterval: 0.64,
          sizeMin: 94,
          sizeMax: 121,
          maxEnemyType: 1
        }
      ]
    },
{
      id: 4,
      waves: [
{
          count: 14,
          hp: 2,
          speedMin: 131,
          speedMax: 176,
          damage: 10,
          coinReward: 3,
          spawnInterval: 0.66,
          sizeMin: 96,
          sizeMax: 124,
          maxEnemyType: 1
        },
{
          count: 16,
          hp: 2,
          speedMin: 139,
          speedMax: 186,
          damage: 11,
          coinReward: 4,
          spawnInterval: 0.64,
          sizeMin: 96,
          sizeMax: 124,
          maxEnemyType: 1
        },
{
          count: 18,
          hp: 3,
          speedMin: 147,
          speedMax: 196,
          damage: 12,
          coinReward: 4,
          spawnInterval: 0.62,
          sizeMin: 96,
          sizeMax: 124,
          maxEnemyType: 1
        },
{
          count: 20,
          hp: 3,
          speedMin: 155,
          speedMax: 206,
          damage: 13,
          coinReward: 5,
          spawnInterval: 0.6,
          sizeMin: 96,
          sizeMax: 124,
          maxEnemyType: 1
        }
      ]
    },
{
      id: 5,
      waves: [
{
          count: 16,
          hp: 3,
          speedMin: 138,
          speedMax: 185,
          damage: 11,
          coinReward: 3,
          spawnInterval: 0.62,
          sizeMin: 98,
          sizeMax: 127,
          maxEnemyType: 2
        },
{
          count: 18,
          hp: 3,
          speedMin: 146,
          speedMax: 195,
          damage: 12,
          coinReward: 4,
          spawnInterval: 0.6,
          sizeMin: 98,
          sizeMax: 127,
          maxEnemyType: 2
        },
{
          count: 20,
          hp: 4,
          speedMin: 154,
          speedMax: 205,
          damage: 13,
          coinReward: 4,
          spawnInterval: 0.58,
          sizeMin: 98,
          sizeMax: 127,
          maxEnemyType: 2
        },
{
          count: 22,
          hp: 4,
          speedMin: 162,
          speedMax: 215,
          damage: 14,
          coinReward: 5,
          spawnInterval: 0.56,
          sizeMin: 98,
          sizeMax: 127,
          maxEnemyType: 2
        },
{
          count: 13,
          hp: 5,
          speedMin: 170,
          speedMax: 225,
          damage: 15,
          coinReward: 5,
          spawnInterval: 0.62,
          sizeMin: 98,
          sizeMax: 127,
          maxEnemyType: 2,
          boss: true,
          bossType: 0
        }
      ]
    },
{
      id: 6,
      waves: [
{
          count: 18,
          hp: 3,
          speedMin: 145,
          speedMax: 194,
          damage: 12,
          coinReward: 4,
          spawnInterval: 0.59,
          sizeMin: 100,
          sizeMax: 130,
          maxEnemyType: 2
        },
{
          count: 20,
          hp: 3,
          speedMin: 153,
          speedMax: 204,
          damage: 13,
          coinReward: 5,
          spawnInterval: 0.57,
          sizeMin: 100,
          sizeMax: 130,
          maxEnemyType: 2
        },
{
          count: 22,
          hp: 4,
          speedMin: 161,
          speedMax: 214,
          damage: 14,
          coinReward: 5,
          spawnInterval: 0.55,
          sizeMin: 100,
          sizeMax: 130,
          maxEnemyType: 2
        },
{
          count: 24,
          hp: 4,
          speedMin: 169,
          speedMax: 224,
          damage: 15,
          coinReward: 6,
          spawnInterval: 0.53,
          sizeMin: 100,
          sizeMax: 130,
          maxEnemyType: 2
        },
{
          count: 26,
          hp: 5,
          speedMin: 177,
          speedMax: 234,
          damage: 16,
          coinReward: 6,
          spawnInterval: 0.51,
          sizeMin: 100,
          sizeMax: 130,
          maxEnemyType: 2
        }
      ]
    },
{
      id: 7,
      waves: [
{
          count: 20,
          hp: 4,
          speedMin: 152,
          speedMax: 203,
          damage: 13,
          coinReward: 4,
          spawnInterval: 0.56,
          sizeMin: 102,
          sizeMax: 133,
          maxEnemyType: 3
        },
{
          count: 22,
          hp: 4,
          speedMin: 160,
          speedMax: 213,
          damage: 14,
          coinReward: 5,
          spawnInterval: 0.54,
          sizeMin: 102,
          sizeMax: 133,
          maxEnemyType: 3
        },
{
          count: 24,
          hp: 5,
          speedMin: 168,
          speedMax: 223,
          damage: 15,
          coinReward: 5,
          spawnInterval: 0.52,
          sizeMin: 102,
          sizeMax: 133,
          maxEnemyType: 3
        },
{
          count: 26,
          hp: 5,
          speedMin: 176,
          speedMax: 233,
          damage: 16,
          coinReward: 6,
          spawnInterval: 0.5,
          sizeMin: 102,
          sizeMax: 133,
          maxEnemyType: 3
        },
{
          count: 28,
          hp: 6,
          speedMin: 184,
          speedMax: 243,
          damage: 17,
          coinReward: 6,
          spawnInterval: 0.48,
          sizeMin: 102,
          sizeMax: 133,
          maxEnemyType: 3
        },
{
          count: 30,
          hp: 6,
          speedMin: 192,
          speedMax: 253,
          damage: 18,
          coinReward: 7,
          spawnInterval: 0.46,
          sizeMin: 102,
          sizeMax: 133,
          maxEnemyType: 3
        }
      ]
    },
{
      id: 8,
      waves: [
{
          count: 22,
          hp: 4,
          speedMin: 159,
          speedMax: 212,
          damage: 14,
          coinReward: 5,
          spawnInterval: 0.52,
          sizeMin: 104,
          sizeMax: 136,
          maxEnemyType: 5
        },
{
          count: 24,
          hp: 4,
          speedMin: 167,
          speedMax: 222,
          damage: 15,
          coinReward: 6,
          spawnInterval: 0.5,
          sizeMin: 104,
          sizeMax: 136,
          maxEnemyType: 5
        },
{
          count: 26,
          hp: 5,
          speedMin: 175,
          speedMax: 232,
          damage: 16,
          coinReward: 6,
          spawnInterval: 0.48,
          sizeMin: 104,
          sizeMax: 136,
          maxEnemyType: 5
        },
{
          count: 28,
          hp: 5,
          speedMin: 183,
          speedMax: 242,
          damage: 17,
          coinReward: 7,
          spawnInterval: 0.46,
          sizeMin: 104,
          sizeMax: 136,
          maxEnemyType: 5
        },
{
          count: 30,
          hp: 6,
          speedMin: 191,
          speedMax: 252,
          damage: 18,
          coinReward: 7,
          spawnInterval: 0.44,
          sizeMin: 104,
          sizeMax: 136,
          maxEnemyType: 5
        },
{
          count: 32,
          hp: 6,
          speedMin: 199,
          speedMax: 262,
          damage: 19,
          coinReward: 8,
          spawnInterval: 0.42,
          sizeMin: 104,
          sizeMax: 136,
          maxEnemyType: 5
        }
      ]
    },
{
      id: 9,
      waves: [
{
          count: 24,
          hp: 5,
          speedMin: 166,
          speedMax: 221,
          damage: 15,
          coinReward: 5,
          spawnInterval: 0.49,
          sizeMin: 106,
          sizeMax: 139,
          maxEnemyType: 6
        },
{
          count: 26,
          hp: 5,
          speedMin: 174,
          speedMax: 231,
          damage: 16,
          coinReward: 6,
          spawnInterval: 0.47,
          sizeMin: 106,
          sizeMax: 139,
          maxEnemyType: 6
        },
{
          count: 28,
          hp: 6,
          speedMin: 182,
          speedMax: 241,
          damage: 17,
          coinReward: 6,
          spawnInterval: 0.45,
          sizeMin: 106,
          sizeMax: 139,
          maxEnemyType: 6
        },
{
          count: 30,
          hp: 6,
          speedMin: 190,
          speedMax: 251,
          damage: 18,
          coinReward: 7,
          spawnInterval: 0.43,
          sizeMin: 106,
          sizeMax: 139,
          maxEnemyType: 6
        },
{
          count: 32,
          hp: 7,
          speedMin: 198,
          speedMax: 261,
          damage: 19,
          coinReward: 7,
          spawnInterval: 0.41,
          sizeMin: 106,
          sizeMax: 139,
          maxEnemyType: 6
        },
{
          count: 34,
          hp: 7,
          speedMin: 206,
          speedMax: 271,
          damage: 20,
          coinReward: 8,
          spawnInterval: 0.39,
          sizeMin: 106,
          sizeMax: 139,
          maxEnemyType: 6
        }
      ]
    },
{
      id: 10,
      waves: [
{
          count: 26,
          hp: 5,
          speedMin: 173,
          speedMax: 230,
          damage: 16,
          coinReward: 6,
          spawnInterval: 0.45,
          sizeMin: 108,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 28,
          hp: 5,
          speedMin: 181,
          speedMax: 240,
          damage: 17,
          coinReward: 7,
          spawnInterval: 0.43,
          sizeMin: 108,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 30,
          hp: 6,
          speedMin: 189,
          speedMax: 250,
          damage: 18,
          coinReward: 7,
          spawnInterval: 0.41,
          sizeMin: 108,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 32,
          hp: 6,
          speedMin: 197,
          speedMax: 260,
          damage: 19,
          coinReward: 8,
          spawnInterval: 0.39,
          sizeMin: 108,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 34,
          hp: 7,
          speedMin: 205,
          speedMax: 270,
          damage: 20,
          coinReward: 8,
          spawnInterval: 0.37,
          sizeMin: 108,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 20,
          hp: 7,
          speedMin: 213,
          speedMax: 280,
          damage: 21,
          coinReward: 9,
          spawnInterval: 0.45,
          sizeMin: 108,
          sizeMax: 142,
          maxEnemyType: 7,
          boss: true,
          bossType: 1
        }
      ]
    },
{
      id: 11,
      waves: [
{
          count: 32,
          hp: 6,
          speedMin: 164,
          speedMax: 222,
          damage: 15,
          coinReward: 5,
          spawnInterval: 0.69,
          sizeMin: 102,
          sizeMax: 131,
          maxEnemyType: 7
        },
{
          count: 35,
          hp: 6,
          speedMin: 172,
          speedMax: 230,
          damage: 16,
          coinReward: 6,
          spawnInterval: 0.67,
          sizeMin: 102,
          sizeMax: 131,
          maxEnemyType: 7
        },
{
          count: 38,
          hp: 7,
          speedMin: 179,
          speedMax: 237,
          damage: 17,
          coinReward: 6,
          spawnInterval: 0.65,
          sizeMin: 102,
          sizeMax: 131,
          maxEnemyType: 7
        },
{
          count: 41,
          hp: 8,
          speedMin: 187,
          speedMax: 245,
          damage: 18,
          coinReward: 6,
          spawnInterval: 0.63,
          sizeMin: 102,
          sizeMax: 131,
          maxEnemyType: 7
        },
{
          count: 44,
          hp: 8,
          speedMin: 194,
          speedMax: 252,
          damage: 19,
          coinReward: 7,
          spawnInterval: 0.62,
          sizeMin: 102,
          sizeMax: 131,
          maxEnemyType: 7
        },
{
          count: 47,
          hp: 9,
          speedMin: 202,
          speedMax: 260,
          damage: 20,
          coinReward: 7,
          spawnInterval: 0.6,
          sizeMin: 102,
          sizeMax: 131,
          maxEnemyType: 7
        },
{
          count: 50,
          hp: 9,
          speedMin: 209,
          speedMax: 267,
          damage: 21,
          coinReward: 7,
          spawnInterval: 0.58,
          sizeMin: 102,
          sizeMax: 131,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 12,
      waves: [
{
          count: 34,
          hp: 6,
          speedMin: 170,
          speedMax: 230,
          damage: 16,
          coinReward: 6,
          spawnInterval: 0.68,
          sizeMin: 104,
          sizeMax: 133,
          maxEnemyType: 7
        },
{
          count: 37,
          hp: 7,
          speedMin: 178,
          speedMax: 238,
          damage: 17,
          coinReward: 6,
          spawnInterval: 0.66,
          sizeMin: 104,
          sizeMax: 133,
          maxEnemyType: 7
        },
{
          count: 40,
          hp: 7,
          speedMin: 185,
          speedMax: 245,
          damage: 18,
          coinReward: 7,
          spawnInterval: 0.64,
          sizeMin: 104,
          sizeMax: 133,
          maxEnemyType: 7
        },
{
          count: 43,
          hp: 8,
          speedMin: 193,
          speedMax: 253,
          damage: 19,
          coinReward: 7,
          spawnInterval: 0.62,
          sizeMin: 104,
          sizeMax: 133,
          maxEnemyType: 7
        },
{
          count: 46,
          hp: 9,
          speedMin: 200,
          speedMax: 260,
          damage: 20,
          coinReward: 7,
          spawnInterval: 0.6,
          sizeMin: 104,
          sizeMax: 133,
          maxEnemyType: 7
        },
{
          count: 49,
          hp: 9,
          speedMin: 208,
          speedMax: 268,
          damage: 21,
          coinReward: 8,
          spawnInterval: 0.59,
          sizeMin: 104,
          sizeMax: 133,
          maxEnemyType: 7
        },
{
          count: 52,
          hp: 10,
          speedMin: 215,
          speedMax: 275,
          damage: 22,
          coinReward: 8,
          spawnInterval: 0.57,
          sizeMin: 104,
          sizeMax: 133,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 13,
      waves: [
{
          count: 36,
          hp: 7,
          speedMin: 177,
          speedMax: 240,
          damage: 17,
          coinReward: 6,
          spawnInterval: 0.66,
          sizeMin: 105,
          sizeMax: 134,
          maxEnemyType: 7
        },
{
          count: 39,
          hp: 7,
          speedMin: 184,
          speedMax: 247,
          damage: 18,
          coinReward: 7,
          spawnInterval: 0.65,
          sizeMin: 105,
          sizeMax: 134,
          maxEnemyType: 7
        },
{
          count: 42,
          hp: 8,
          speedMin: 192,
          speedMax: 255,
          damage: 19,
          coinReward: 7,
          spawnInterval: 0.63,
          sizeMin: 105,
          sizeMax: 134,
          maxEnemyType: 7
        },
{
          count: 45,
          hp: 8,
          speedMin: 199,
          speedMax: 262,
          damage: 20,
          coinReward: 7,
          spawnInterval: 0.61,
          sizeMin: 105,
          sizeMax: 134,
          maxEnemyType: 7
        },
{
          count: 48,
          hp: 9,
          speedMin: 207,
          speedMax: 270,
          damage: 21,
          coinReward: 8,
          spawnInterval: 0.59,
          sizeMin: 105,
          sizeMax: 134,
          maxEnemyType: 7
        },
{
          count: 51,
          hp: 10,
          speedMin: 214,
          speedMax: 277,
          damage: 22,
          coinReward: 8,
          spawnInterval: 0.57,
          sizeMin: 105,
          sizeMax: 134,
          maxEnemyType: 7
        },
{
          count: 54,
          hp: 10,
          speedMin: 222,
          speedMax: 285,
          damage: 23,
          coinReward: 8,
          spawnInterval: 0.56,
          sizeMin: 105,
          sizeMax: 134,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 14,
      waves: [
{
          count: 38,
          hp: 7,
          speedMin: 183,
          speedMax: 248,
          damage: 18,
          coinReward: 7,
          spawnInterval: 0.65,
          sizeMin: 106,
          sizeMax: 135,
          maxEnemyType: 7
        },
{
          count: 41,
          hp: 8,
          speedMin: 190,
          speedMax: 255,
          damage: 19,
          coinReward: 7,
          spawnInterval: 0.63,
          sizeMin: 106,
          sizeMax: 135,
          maxEnemyType: 7
        },
{
          count: 44,
          hp: 8,
          speedMin: 198,
          speedMax: 263,
          damage: 20,
          coinReward: 7,
          spawnInterval: 0.62,
          sizeMin: 106,
          sizeMax: 135,
          maxEnemyType: 7
        },
{
          count: 47,
          hp: 9,
          speedMin: 205,
          speedMax: 270,
          damage: 21,
          coinReward: 8,
          spawnInterval: 0.6,
          sizeMin: 106,
          sizeMax: 135,
          maxEnemyType: 7
        },
{
          count: 50,
          hp: 10,
          speedMin: 213,
          speedMax: 278,
          damage: 22,
          coinReward: 8,
          spawnInterval: 0.58,
          sizeMin: 106,
          sizeMax: 135,
          maxEnemyType: 7
        },
{
          count: 53,
          hp: 10,
          speedMin: 220,
          speedMax: 285,
          damage: 23,
          coinReward: 8,
          spawnInterval: 0.56,
          sizeMin: 106,
          sizeMax: 135,
          maxEnemyType: 7
        },
{
          count: 56,
          hp: 11,
          speedMin: 228,
          speedMax: 293,
          damage: 24,
          coinReward: 9,
          spawnInterval: 0.54,
          sizeMin: 106,
          sizeMax: 135,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 15,
      waves: [
{
          count: 40,
          hp: 8,
          speedMin: 189,
          speedMax: 256,
          damage: 19,
          coinReward: 7,
          spawnInterval: 0.64,
          sizeMin: 108,
          sizeMax: 137,
          maxEnemyType: 7
        },
{
          count: 43,
          hp: 8,
          speedMin: 197,
          speedMax: 264,
          damage: 20,
          coinReward: 8,
          spawnInterval: 0.62,
          sizeMin: 108,
          sizeMax: 137,
          maxEnemyType: 7
        },
{
          count: 46,
          hp: 9,
          speedMin: 204,
          speedMax: 271,
          damage: 21,
          coinReward: 8,
          spawnInterval: 0.6,
          sizeMin: 108,
          sizeMax: 137,
          maxEnemyType: 7
        },
{
          count: 49,
          hp: 9,
          speedMin: 212,
          speedMax: 279,
          damage: 22,
          coinReward: 8,
          spawnInterval: 0.59,
          sizeMin: 108,
          sizeMax: 137,
          maxEnemyType: 7
        },
{
          count: 52,
          hp: 10,
          speedMin: 219,
          speedMax: 286,
          damage: 23,
          coinReward: 9,
          spawnInterval: 0.57,
          sizeMin: 108,
          sizeMax: 137,
          maxEnemyType: 7
        },
{
          count: 55,
          hp: 11,
          speedMin: 227,
          speedMax: 294,
          damage: 24,
          coinReward: 9,
          spawnInterval: 0.55,
          sizeMin: 108,
          sizeMax: 137,
          maxEnemyType: 7
        },
{
          count: 33,
          hp: 11,
          speedMin: 234,
          speedMax: 301,
          damage: 25,
          coinReward: 9,
          spawnInterval: 0.61,
          sizeMin: 108,
          sizeMax: 137,
          maxEnemyType: 7,
          boss: true,
          bossType: 2
        }
      ]
    },
{
      id: 16,
      waves: [
{
          count: 43,
          hp: 8,
          speedMin: 195,
          speedMax: 264,
          damage: 19,
          coinReward: 8,
          spawnInterval: 0.63,
          sizeMin: 109,
          sizeMax: 140,
          maxEnemyType: 7
        },
{
          count: 46,
          hp: 9,
          speedMin: 203,
          speedMax: 272,
          damage: 20,
          coinReward: 8,
          spawnInterval: 0.61,
          sizeMin: 109,
          sizeMax: 140,
          maxEnemyType: 7
        },
{
          count: 49,
          hp: 9,
          speedMin: 210,
          speedMax: 279,
          damage: 22,
          coinReward: 8,
          spawnInterval: 0.59,
          sizeMin: 109,
          sizeMax: 140,
          maxEnemyType: 7
        },
{
          count: 52,
          hp: 10,
          speedMin: 218,
          speedMax: 287,
          damage: 23,
          coinReward: 9,
          spawnInterval: 0.57,
          sizeMin: 109,
          sizeMax: 140,
          maxEnemyType: 7
        },
{
          count: 55,
          hp: 11,
          speedMin: 225,
          speedMax: 294,
          damage: 24,
          coinReward: 9,
          spawnInterval: 0.56,
          sizeMin: 109,
          sizeMax: 140,
          maxEnemyType: 7
        },
{
          count: 58,
          hp: 11,
          speedMin: 233,
          speedMax: 302,
          damage: 25,
          coinReward: 9,
          spawnInterval: 0.54,
          sizeMin: 109,
          sizeMax: 140,
          maxEnemyType: 7
        },
{
          count: 61,
          hp: 12,
          speedMin: 240,
          speedMax: 309,
          damage: 26,
          coinReward: 10,
          spawnInterval: 0.52,
          sizeMin: 109,
          sizeMax: 140,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 17,
      waves: [
{
          count: 45,
          hp: 9,
          speedMin: 201,
          speedMax: 272,
          damage: 20,
          coinReward: 8,
          spawnInterval: 0.62,
          sizeMin: 110,
          sizeMax: 141,
          maxEnemyType: 7
        },
{
          count: 48,
          hp: 9,
          speedMin: 209,
          speedMax: 280,
          damage: 21,
          coinReward: 8,
          spawnInterval: 0.6,
          sizeMin: 110,
          sizeMax: 141,
          maxEnemyType: 7
        },
{
          count: 51,
          hp: 10,
          speedMin: 216,
          speedMax: 287,
          damage: 22,
          coinReward: 9,
          spawnInterval: 0.58,
          sizeMin: 110,
          sizeMax: 141,
          maxEnemyType: 7
        },
{
          count: 54,
          hp: 10,
          speedMin: 224,
          speedMax: 295,
          damage: 23,
          coinReward: 9,
          spawnInterval: 0.56,
          sizeMin: 110,
          sizeMax: 141,
          maxEnemyType: 7
        },
{
          count: 57,
          hp: 11,
          speedMin: 231,
          speedMax: 302,
          damage: 25,
          coinReward: 9,
          spawnInterval: 0.54,
          sizeMin: 110,
          sizeMax: 141,
          maxEnemyType: 7
        },
{
          count: 60,
          hp: 12,
          speedMin: 239,
          speedMax: 310,
          damage: 26,
          coinReward: 10,
          spawnInterval: 0.53,
          sizeMin: 110,
          sizeMax: 141,
          maxEnemyType: 7
        },
{
          count: 63,
          hp: 12,
          speedMin: 246,
          speedMax: 317,
          damage: 27,
          coinReward: 10,
          spawnInterval: 0.51,
          sizeMin: 110,
          sizeMax: 141,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 18,
      waves: [
{
          count: 47,
          hp: 9,
          speedMin: 208,
          speedMax: 282,
          damage: 21,
          coinReward: 9,
          spawnInterval: 0.6,
          sizeMin: 111,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 50,
          hp: 10,
          speedMin: 215,
          speedMax: 289,
          damage: 22,
          coinReward: 9,
          spawnInterval: 0.59,
          sizeMin: 111,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 53,
          hp: 10,
          speedMin: 223,
          speedMax: 297,
          damage: 23,
          coinReward: 9,
          spawnInterval: 0.57,
          sizeMin: 111,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 56,
          hp: 11,
          speedMin: 230,
          speedMax: 304,
          damage: 24,
          coinReward: 10,
          spawnInterval: 0.55,
          sizeMin: 111,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 59,
          hp: 11,
          speedMin: 238,
          speedMax: 312,
          damage: 25,
          coinReward: 10,
          spawnInterval: 0.53,
          sizeMin: 111,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 62,
          hp: 12,
          speedMin: 245,
          speedMax: 319,
          damage: 26,
          coinReward: 10,
          spawnInterval: 0.51,
          sizeMin: 111,
          sizeMax: 142,
          maxEnemyType: 7
        },
{
          count: 65,
          hp: 13,
          speedMin: 253,
          speedMax: 327,
          damage: 28,
          coinReward: 11,
          spawnInterval: 0.5,
          sizeMin: 111,
          sizeMax: 142,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 19,
      waves: [
{
          count: 49,
          hp: 10,
          speedMin: 214,
          speedMax: 290,
          damage: 22,
          coinReward: 9,
          spawnInterval: 0.59,
          sizeMin: 113,
          sizeMax: 144,
          maxEnemyType: 7
        },
{
          count: 52,
          hp: 10,
          speedMin: 221,
          speedMax: 297,
          damage: 23,
          coinReward: 9,
          spawnInterval: 0.57,
          sizeMin: 113,
          sizeMax: 144,
          maxEnemyType: 7
        },
{
          count: 55,
          hp: 11,
          speedMin: 229,
          speedMax: 305,
          damage: 24,
          coinReward: 10,
          spawnInterval: 0.56,
          sizeMin: 113,
          sizeMax: 144,
          maxEnemyType: 7
        },
{
          count: 58,
          hp: 11,
          speedMin: 236,
          speedMax: 312,
          damage: 25,
          coinReward: 10,
          spawnInterval: 0.54,
          sizeMin: 113,
          sizeMax: 144,
          maxEnemyType: 7
        },
{
          count: 61,
          hp: 12,
          speedMin: 244,
          speedMax: 320,
          damage: 26,
          coinReward: 10,
          spawnInterval: 0.52,
          sizeMin: 113,
          sizeMax: 144,
          maxEnemyType: 7
        },
{
          count: 64,
          hp: 13,
          speedMin: 251,
          speedMax: 327,
          damage: 27,
          coinReward: 11,
          spawnInterval: 0.5,
          sizeMin: 113,
          sizeMax: 144,
          maxEnemyType: 7
        },
{
          count: 67,
          hp: 13,
          speedMin: 259,
          speedMax: 335,
          damage: 28,
          coinReward: 11,
          spawnInterval: 0.48,
          sizeMin: 113,
          sizeMax: 144,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 20,
      waves: [
{
          count: 51,
          hp: 10,
          speedMin: 220,
          speedMax: 298,
          damage: 23,
          coinReward: 10,
          spawnInterval: 0.58,
          sizeMin: 114,
          sizeMax: 145,
          maxEnemyType: 7
        },
{
          count: 54,
          hp: 11,
          speedMin: 228,
          speedMax: 306,
          damage: 24,
          coinReward: 10,
          spawnInterval: 0.56,
          sizeMin: 114,
          sizeMax: 145,
          maxEnemyType: 7
        },
{
          count: 57,
          hp: 11,
          speedMin: 235,
          speedMax: 313,
          damage: 25,
          coinReward: 10,
          spawnInterval: 0.54,
          sizeMin: 114,
          sizeMax: 145,
          maxEnemyType: 7
        },
{
          count: 60,
          hp: 12,
          speedMin: 243,
          speedMax: 321,
          damage: 26,
          coinReward: 10,
          spawnInterval: 0.53,
          sizeMin: 114,
          sizeMax: 145,
          maxEnemyType: 7
        },
{
          count: 63,
          hp: 12,
          speedMin: 250,
          speedMax: 328,
          damage: 27,
          coinReward: 11,
          spawnInterval: 0.51,
          sizeMin: 114,
          sizeMax: 145,
          maxEnemyType: 7
        },
{
          count: 66,
          hp: 13,
          speedMin: 258,
          speedMax: 336,
          damage: 28,
          coinReward: 11,
          spawnInterval: 0.49,
          sizeMin: 114,
          sizeMax: 145,
          maxEnemyType: 7
        },
{
          count: 40,
          hp: 14,
          speedMin: 265,
          speedMax: 343,
          damage: 29,
          coinReward: 11,
          spawnInterval: 0.55,
          sizeMin: 114,
          sizeMax: 145,
          maxEnemyType: 7,
          boss: true,
          bossType: 3
        }
      ]
    },
{
      id: 21,
      waves: [
{
          count: 55,
          hp: 11,
          speedMin: 226,
          speedMax: 306,
          damage: 24,
          coinReward: 10,
          spawnInterval: 0.57,
          sizeMin: 115,
          sizeMax: 148,
          maxEnemyType: 7
        },
{
          count: 58,
          hp: 11,
          speedMin: 234,
          speedMax: 314,
          damage: 25,
          coinReward: 10,
          spawnInterval: 0.55,
          sizeMin: 115,
          sizeMax: 148,
          maxEnemyType: 7
        },
{
          count: 61,
          hp: 12,
          speedMin: 241,
          speedMax: 321,
          damage: 26,
          coinReward: 11,
          spawnInterval: 0.53,
          sizeMin: 115,
          sizeMax: 148,
          maxEnemyType: 7
        },
{
          count: 64,
          hp: 12,
          speedMin: 249,
          speedMax: 329,
          damage: 27,
          coinReward: 11,
          spawnInterval: 0.51,
          sizeMin: 115,
          sizeMax: 148,
          maxEnemyType: 7
        },
{
          count: 67,
          hp: 13,
          speedMin: 256,
          speedMax: 336,
          damage: 28,
          coinReward: 11,
          spawnInterval: 0.5,
          sizeMin: 115,
          sizeMax: 148,
          maxEnemyType: 7
        },
{
          count: 70,
          hp: 13,
          speedMin: 264,
          speedMax: 344,
          damage: 29,
          coinReward: 12,
          spawnInterval: 0.48,
          sizeMin: 115,
          sizeMax: 148,
          maxEnemyType: 7
        },
{
          count: 73,
          hp: 14,
          speedMin: 271,
          speedMax: 351,
          damage: 30,
          coinReward: 12,
          spawnInterval: 0.46,
          sizeMin: 115,
          sizeMax: 148,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 22,
      waves: [
{
          count: 57,
          hp: 11,
          speedMin: 232,
          speedMax: 314,
          damage: 25,
          coinReward: 10,
          spawnInterval: 0.56,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 60,
          hp: 12,
          speedMin: 240,
          speedMax: 322,
          damage: 26,
          coinReward: 11,
          spawnInterval: 0.54,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 63,
          hp: 12,
          speedMin: 247,
          speedMax: 329,
          damage: 27,
          coinReward: 11,
          spawnInterval: 0.52,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 66,
          hp: 13,
          speedMin: 255,
          speedMax: 337,
          damage: 28,
          coinReward: 11,
          spawnInterval: 0.5,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 69,
          hp: 13,
          speedMin: 262,
          speedMax: 344,
          damage: 29,
          coinReward: 12,
          spawnInterval: 0.48,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 72,
          hp: 14,
          speedMin: 270,
          speedMax: 352,
          damage: 30,
          coinReward: 12,
          spawnInterval: 0.47,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 75,
          hp: 15,
          speedMin: 277,
          speedMax: 359,
          damage: 31,
          coinReward: 12,
          spawnInterval: 0.45,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 23,
      waves: [
{
          count: 59,
          hp: 12,
          speedMin: 239,
          speedMax: 324,
          damage: 26,
          coinReward: 11,
          spawnInterval: 0.54,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 62,
          hp: 12,
          speedMin: 246,
          speedMax: 331,
          damage: 27,
          coinReward: 11,
          spawnInterval: 0.53,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 65,
          hp: 13,
          speedMin: 254,
          speedMax: 339,
          damage: 28,
          coinReward: 11,
          spawnInterval: 0.51,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 68,
          hp: 13,
          speedMin: 261,
          speedMax: 346,
          damage: 29,
          coinReward: 12,
          spawnInterval: 0.49,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 71,
          hp: 14,
          speedMin: 269,
          speedMax: 354,
          damage: 30,
          coinReward: 12,
          spawnInterval: 0.47,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 74,
          hp: 14,
          speedMin: 276,
          speedMax: 361,
          damage: 31,
          coinReward: 12,
          spawnInterval: 0.45,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 77,
          hp: 15,
          speedMin: 284,
          speedMax: 369,
          damage: 32,
          coinReward: 13,
          spawnInterval: 0.44,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 24,
      waves: [
{
          count: 61,
          hp: 12,
          speedMin: 245,
          speedMax: 332,
          damage: 27,
          coinReward: 11,
          spawnInterval: 0.53,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 64,
          hp: 13,
          speedMin: 252,
          speedMax: 339,
          damage: 28,
          coinReward: 12,
          spawnInterval: 0.51,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 67,
          hp: 13,
          speedMin: 260,
          speedMax: 347,
          damage: 29,
          coinReward: 12,
          spawnInterval: 0.5,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 70,
          hp: 14,
          speedMin: 267,
          speedMax: 354,
          damage: 30,
          coinReward: 12,
          spawnInterval: 0.48,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 73,
          hp: 14,
          speedMin: 275,
          speedMax: 362,
          damage: 31,
          coinReward: 13,
          spawnInterval: 0.46,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 76,
          hp: 15,
          speedMin: 282,
          speedMax: 369,
          damage: 32,
          coinReward: 13,
          spawnInterval: 0.44,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 79,
          hp: 16,
          speedMin: 290,
          speedMax: 377,
          damage: 33,
          coinReward: 13,
          spawnInterval: 0.42,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 25,
      waves: [
{
          count: 63,
          hp: 13,
          speedMin: 251,
          speedMax: 340,
          damage: 28,
          coinReward: 12,
          spawnInterval: 0.52,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 66,
          hp: 13,
          speedMin: 259,
          speedMax: 348,
          damage: 29,
          coinReward: 12,
          spawnInterval: 0.5,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 69,
          hp: 14,
          speedMin: 266,
          speedMax: 355,
          damage: 30,
          coinReward: 12,
          spawnInterval: 0.48,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 72,
          hp: 14,
          speedMin: 274,
          speedMax: 363,
          damage: 31,
          coinReward: 13,
          spawnInterval: 0.47,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 75,
          hp: 15,
          speedMin: 281,
          speedMax: 370,
          damage: 32,
          coinReward: 13,
          spawnInterval: 0.45,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 78,
          hp: 15,
          speedMin: 289,
          speedMax: 378,
          damage: 33,
          coinReward: 13,
          spawnInterval: 0.43,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7
        },
{
          count: 46,
          hp: 16,
          speedMin: 296,
          speedMax: 385,
          damage: 34,
          coinReward: 14,
          spawnInterval: 0.49,
          sizeMin: 116,
          sizeMax: 149,
          maxEnemyType: 7,
          boss: true,
          bossType: 4
        }
      ]
    },
{
      id: 26,
      waves: [
{
          count: 66,
          hp: 13,
          speedMin: 257,
          speedMax: 348,
          damage: 28,
          coinReward: 12,
          spawnInterval: 0.51,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 69,
          hp: 14,
          speedMin: 265,
          speedMax: 356,
          damage: 29,
          coinReward: 13,
          spawnInterval: 0.49,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 72,
          hp: 14,
          speedMin: 272,
          speedMax: 363,
          damage: 31,
          coinReward: 13,
          spawnInterval: 0.47,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 75,
          hp: 15,
          speedMin: 280,
          speedMax: 371,
          damage: 32,
          coinReward: 13,
          spawnInterval: 0.45,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 78,
          hp: 15,
          speedMin: 287,
          speedMax: 378,
          damage: 33,
          coinReward: 13,
          spawnInterval: 0.44,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 81,
          hp: 16,
          speedMin: 295,
          speedMax: 386,
          damage: 34,
          coinReward: 14,
          spawnInterval: 0.42,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 84,
          hp: 16,
          speedMin: 302,
          speedMax: 393,
          damage: 35,
          coinReward: 14,
          spawnInterval: 0.4,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 27,
      waves: [
{
          count: 68,
          hp: 13,
          speedMin: 263,
          speedMax: 356,
          damage: 29,
          coinReward: 13,
          spawnInterval: 0.5,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 71,
          hp: 14,
          speedMin: 271,
          speedMax: 364,
          damage: 30,
          coinReward: 13,
          spawnInterval: 0.48,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 74,
          hp: 15,
          speedMin: 278,
          speedMax: 371,
          damage: 31,
          coinReward: 13,
          spawnInterval: 0.46,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 77,
          hp: 15,
          speedMin: 286,
          speedMax: 379,
          damage: 32,
          coinReward: 14,
          spawnInterval: 0.44,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 80,
          hp: 16,
          speedMin: 293,
          speedMax: 386,
          damage: 34,
          coinReward: 14,
          spawnInterval: 0.42,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 83,
          hp: 16,
          speedMin: 301,
          speedMax: 394,
          damage: 35,
          coinReward: 14,
          spawnInterval: 0.41,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 86,
          hp: 17,
          speedMin: 308,
          speedMax: 401,
          damage: 36,
          coinReward: 15,
          spawnInterval: 0.39,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 28,
      waves: [
{
          count: 70,
          hp: 14,
          speedMin: 270,
          speedMax: 366,
          damage: 30,
          coinReward: 13,
          spawnInterval: 0.48,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 73,
          hp: 15,
          speedMin: 277,
          speedMax: 373,
          damage: 31,
          coinReward: 13,
          spawnInterval: 0.47,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 76,
          hp: 15,
          speedMin: 285,
          speedMax: 381,
          damage: 32,
          coinReward: 14,
          spawnInterval: 0.45,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 79,
          hp: 16,
          speedMin: 292,
          speedMax: 388,
          damage: 33,
          coinReward: 14,
          spawnInterval: 0.43,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 82,
          hp: 16,
          speedMin: 300,
          speedMax: 396,
          damage: 34,
          coinReward: 14,
          spawnInterval: 0.41,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 85,
          hp: 17,
          speedMin: 307,
          speedMax: 403,
          damage: 35,
          coinReward: 15,
          spawnInterval: 0.39,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 88,
          hp: 17,
          speedMin: 315,
          speedMax: 411,
          damage: 37,
          coinReward: 15,
          spawnInterval: 0.38,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 29,
      waves: [
{
          count: 72,
          hp: 14,
          speedMin: 276,
          speedMax: 374,
          damage: 31,
          coinReward: 14,
          spawnInterval: 0.47,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 75,
          hp: 15,
          speedMin: 283,
          speedMax: 381,
          damage: 32,
          coinReward: 14,
          spawnInterval: 0.45,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 78,
          hp: 16,
          speedMin: 291,
          speedMax: 389,
          damage: 33,
          coinReward: 14,
          spawnInterval: 0.44,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 81,
          hp: 16,
          speedMin: 298,
          speedMax: 396,
          damage: 34,
          coinReward: 15,
          spawnInterval: 0.42,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 84,
          hp: 17,
          speedMin: 306,
          speedMax: 404,
          damage: 35,
          coinReward: 15,
          spawnInterval: 0.4,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 87,
          hp: 17,
          speedMin: 313,
          speedMax: 411,
          damage: 36,
          coinReward: 15,
          spawnInterval: 0.38,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 90,
          hp: 18,
          speedMin: 321,
          speedMax: 419,
          damage: 37,
          coinReward: 15,
          spawnInterval: 0.36,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        }
      ]
    },
{
      id: 30,
      waves: [
{
          count: 74,
          hp: 15,
          speedMin: 282,
          speedMax: 382,
          damage: 32,
          coinReward: 14,
          spawnInterval: 0.46,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 77,
          hp: 15,
          speedMin: 290,
          speedMax: 390,
          damage: 33,
          coinReward: 14,
          spawnInterval: 0.44,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 80,
          hp: 16,
          speedMin: 297,
          speedMax: 397,
          damage: 34,
          coinReward: 15,
          spawnInterval: 0.42,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 83,
          hp: 17,
          speedMin: 305,
          speedMax: 405,
          damage: 35,
          coinReward: 15,
          spawnInterval: 0.41,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 86,
          hp: 17,
          speedMin: 312,
          speedMax: 412,
          damage: 36,
          coinReward: 15,
          spawnInterval: 0.39,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 89,
          hp: 18,
          speedMin: 320,
          speedMax: 420,
          damage: 37,
          coinReward: 16,
          spawnInterval: 0.37,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7
        },
{
          count: 53,
          hp: 18,
          speedMin: 327,
          speedMax: 427,
          damage: 38,
          coinReward: 16,
          spawnInterval: 0.45,
          sizeMin: 116,
          sizeMax: 151,
          maxEnemyType: 7,
          boss: true,
          bossType: 5
        }
      ]
    }
  ]
};

(() => {
  const authoredStages = [
    ["Boar Gate", "野豬城門", "Learn the center lanes with fast boars.", "從中央路線認識快速野豬。", [0], "lanes"],
    ["Split Hooves", "分岔蹄印", "Boars alternate between the left and right approach.", "野豬會在左右路線交替進攻。", [0], "alternating"],
    ["Trickster Trail", "鬣狗詭徑", "Zigzag hyenas enter from the outer paths.", "左右擺動的鬣狗從外側出現。", [0, 1], "edges"],
    ["Crossing Pack", "交錯獸群", "Boars hold lanes while hyenas weave across them.", "野豬守住直線，鬣狗在其間穿梭。", [0, 1], "lanes"],
    ["Boar Pursuit", "野豬追擊王", "A fast Boss fires quick pursuit shots behind mixed escorts.", "高速王在混合護衛後方連續發射追擊彈。", [0, 1, 2], "alternating", "pursuit", "Quick aimed shots", "快速瞄準彈"],
    ["Rhino Screen", "犀牛屏障", "Armored rhinos occupy the center while boars slip around them.", "重甲犀牛守中央，野豬從周圍穿過。", [0, 2], "center"],
    ["Breaker Escort", "破牆護衛", "Buffalo wall breakers advance between armored escorts.", "水牛破牆者在重甲護衛間推進。", [0, 2, 3], "alternating"],
    ["Caster Maze", "黑熊迷陣", "Zigzag bears and hyenas pull aim toward both edges.", "黑熊與鬣狗左右擺動，迫使玩家兼顧兩側。", [1, 2, 5], "edges"],
    ["Sky Rush", "天空急襲", "Hawks and tigers dash through fixed ground lanes.", "猛鷹與老虎穿越固定地面路線衝刺。", [0, 4, 6], "lanes"],
    ["Hyena Crossfire", "鬣狗交叉火網", "The Boss sends paired crossfire while a mixed pack changes lanes.", "王會發射成對交叉彈，混合獸群同時換線。", [1, 3, 5, 7], "edges", "crossfire", "Paired crossfire", "成對交叉彈"],
    ["Rhino Column", "犀牛縱隊", "A pure armored column rewards piercing and sustained damage.", "純重甲縱隊考驗穿透與持續傷害。", [2], "center"],
    ["Twin Sprinters", "雙側快攻", "Boars and tigers race down opposite sides.", "野豬與老虎沿兩側高速前進。", [0, 6], "edges"],
    ["Breaker Line", "破牆戰線", "Buffalo and crocodile breakers fill three committed lanes.", "水牛與鱷魚破牆者佔據三條固定路線。", [3, 7], "lanes"],
    ["Trickster Weave", "詭徑編隊", "Hyenas and bears alternate unpredictable curves.", "鬣狗與黑熊輪流走出難預測的曲線。", [1, 5], "alternating"],
    ["Rhino Bulwark", "犀牛護盾王", "Six shield hits must be broken before the armored Boss takes full damage.", "必須先打破六層護盾，才能有效傷害重甲王。", [0, 2, 3], "center", "bulwark", "Six-hit shield and heavy orb", "六層護盾與重型彈"],
    ["Hawk Dive", "猛鷹俯衝", "Hawks dash from alternating outer launch points.", "猛鷹從左右外側起點交替俯衝。", [0, 4], "edges"],
    ["Tiger Relay", "老虎接力", "Tigers, boars, and hawks hand off repeated speed pressure.", "老虎、野豬與猛鷹輪流施加高速壓力。", [0, 4, 6], "alternating"],
    ["Sky over Armor", "空地夾擊", "Armored rhinos anchor lanes beneath diving hawks.", "重甲犀牛穩住路線，猛鷹從上方俯衝。", [2, 4], "lanes"],
    ["Crosswind Pack", "側風獸群", "Zigzag casters and hawks attack from shifting edges.", "擺動施法獸與猛鷹從變換的外側進攻。", [1, 4, 5], "edges"],
    ["Buffalo Siege", "水牛攻城王", "A heavy siege orb targets the wall center while breakers advance.", "重型攻城彈直擊城牆中央，破牆獸同時推進。", [2, 3, 7], "center", "siege", "Heavy center siege orb", "中央重型攻城彈"],
    ["Guarded Rush", "護甲快攻", "Runners hide behind alternating rhino and buffalo lanes.", "跑者躲在交替出現的犀牛與水牛路線後方。", [0, 2, 3], "lanes"],
    ["Zigzag Sprint", "曲線衝刺", "Curving casters and straight sprinters demand rapid retargeting.", "曲線施法獸與直線快攻獸要求快速換目標。", [1, 5, 6], "alternating"],
    ["Heavy Gate", "重獸城門", "Only armored and breaker beasts press the center.", "只有重甲與破牆獸從中央施壓。", [2, 3, 7], "center"],
    ["Flank and Break", "側翼破牆", "Dashers pull aim outward while crocodiles threaten the wall.", "衝刺獸把瞄準拉向外側，鱷魚則威脅城牆。", [4, 6, 7], "edges"],
    ["Hawk Dive Squadron", "猛鷹俯衝王", "The Boss dives repeatedly and releases a fast two-shot spread.", "王會反覆俯衝並發射高速雙彈。", [1, 4, 6], "alternating", "dive", "Dash and twin fast shots", "俯衝與高速雙彈"],
    ["Eight-Beast Review", "八獸總複習", "All roles return in readable three-lane waves.", "八種角色在清楚的三路波次中再次登場。", [0, 1, 2, 3, 4, 5, 6, 7], "lanes"],
    ["Caster Screen", "施法獸屏障", "Casters curve behind alternating armor and dive escorts.", "施法獸在交替的重甲與俯衝護衛後方走曲線。", [1, 2, 4, 5], "alternating"],
    ["Crocodile Siege", "鱷魚攻城", "A center-heavy breaker formation tests splash and wall repair.", "中央重型破牆陣考驗濺射與城牆修補。", [0, 2, 3, 7], "center"],
    ["Festival Gauntlet", "慶典試煉", "Every beast role rotates through the two outer gates.", "所有野獸角色輪流通過左右外門。", [0, 1, 2, 3, 4, 5, 6, 7], "edges"],
    ["Bear Starfall", "黑熊星落王", "The final Boss casts a three-orb starfall over the complete roster.", "最終王在完整獸群上方施放三連星落彈。", [0, 1, 2, 3, 4, 5, 6, 7], "alternating", "starfall", "Three-orb starfall", "三連星落彈"]
  ];

  const spanishAuthoredStages = [
    ["Puerta del Jabalí", "Aprende los carriles centrales con jabalíes rápidos."],
    ["Pezuñas Divididas", "Los jabalíes alternan entre los accesos izquierdo y derecho."],
    ["Sendero del Embaucador", "Hienas en zigzag entran por los caminos exteriores."],
    ["Manada Cruzada", "Los jabalíes ocupan carriles mientras las hienas los cruzan."],
    ["Persecución del Jabalí", "Un jefe rápido dispara proyectiles de persecución tras escoltas mixtos.", "Disparos rápidos dirigidos"],
    ["Pantalla de Rinocerontes", "Rinocerontes acorazados ocupan el centro mientras pasan jabalíes."],
    ["Escolta Rompemuros", "Búfalos rompemuros avanzan entre escoltas acorazados."],
    ["Laberinto de Lanzadores", "Osos e hienas en zigzag desvían la puntería hacia ambos lados."],
    ["Asalto Celeste", "Halcones y tigres atraviesan carriles fijos."],
    ["Fuego Cruzado de Hienas", "El jefe lanza fuego cruzado doble mientras la manada cambia de carril.", "Fuego cruzado doble"],
    ["Columna de Rinocerontes", "Una columna acorazada premia la penetración y el daño continuo."],
    ["Velocistas Gemelos", "Jabalíes y tigres corren por lados opuestos."],
    ["Línea Rompemuros", "Búfalos y cocodrilos llenan tres carriles fijos."],
    ["Tejido Embaucador", "Hienas y osos alternan curvas impredecibles."],
    ["Baluarte Rinoceronte", "Rompe seis impactos de escudo antes de dañar por completo al jefe acorazado.", "Escudo de seis impactos y orbe pesado"],
    ["Picado del Halcón", "Halcones atacan desde puntos exteriores alternos."],
    ["Relevo de Tigres", "Tigres, jabalíes y halcones alternan una presión veloz."],
    ["Cielo sobre Armadura", "Rinocerontes acorazados fijan carriles bajo halcones en picado."],
    ["Manada de Viento Cruzado", "Lanzadores en zigzag y halcones atacan desde bordes móviles."],
    ["Asedio del Búfalo", "Un orbe pesado apunta al centro del muro mientras avanzan los rompemuros.", "Orbe pesado de asedio central"],
    ["Asalto Protegido", "Corredores se ocultan tras carriles alternos de rinocerontes y búfalos."],
    ["Carrera en Zigzag", "Lanzadores curvos y velocistas rectos exigen cambiar rápido de objetivo."],
    ["Puerta de Bestias Pesadas", "Solo bestias acorazadas y rompemuros presionan el centro."],
    ["Flanco y Ruptura", "Los atacantes desvían la mira mientras los cocodrilos amenazan el muro."],
    ["Escuadrón de Halcones", "El jefe pica repetidamente y lanza dos disparos rápidos.", "Picado y dos disparos rápidos"],
    ["Repaso de Ocho Bestias", "Todos los roles regresan en oleadas claras de tres carriles."],
    ["Pantalla de Lanzadores", "Lanzadores curvos avanzan tras escoltas acorazados y en picado."],
    ["Asedio del Cocodrilo", "Una formación pesada central pone a prueba el daño de área y la reparación."],
    ["Desafío del Festival", "Todos los roles rotan por las dos puertas exteriores."],
    ["Lluvia Estelar del Oso", "El jefe final lanza tres orbes sobre toda la formación.", "Lluvia estelar de tres orbes"]
  ];

  window.WONDER_DATA.levels.forEach((level, index) => {
    const [titleEn, titleZh, ruleEn, ruleZh, typePool, spawnPattern, bossPattern, bossRuleEn, bossRuleZh] = authoredStages[index];
    const [titleEs, ruleEs, bossRuleEs] = spanishAuthoredStages[index];
    Object.assign(level, { titleEn, titleZh, titleEs, ruleEn, ruleZh, ruleEs, typePool, spawnPattern });
    level.waves.forEach((wave) => {
      wave.typePool = typePool.slice();
      wave.spawnPattern = spawnPattern;
      if (wave.boss) Object.assign(wave, { bossPattern, bossRuleEn, bossRuleZh, bossRuleEs });
    });
  });
})();
