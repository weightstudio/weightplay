/* WeightPlay shared sample-based audio service. See docs/shared-audio-standard.md. */
(function () {
  "use strict";
  const removedLegacyName='Wonder'+'Sound';
  if (window.WeightPlayAudio) { try { delete window[removedLegacyName]; } catch {} return; }
  try { delete window[removedLegacyName]; } catch {}
  const muteKey = "wonderSoundMuted";
  const effectsVolumeKey = "weightPlayEffectsVolume";
  const musicVolumeKey = "weightPlayMusicVolume";
  const positionKey = "wonderSoundTogglePosition";
  const localeKey = "weightPlayLocale";
  let audioContext = null;
  let unlocked = false;
  let muted = false;
  let effectsVolume = 80;
  let musicVolume = 60;
  let lastAudibleEffectsVolume = 80;
  let dragState = null;
  const labels = {
    en: { sound: "Sound", enable: "Enable sound", disable: "Disable sound" },
    "zh-Hant": { sound: "音效", enable: "開啟音效", disable: "關閉音效" },
    "zh-Hans": { sound: "音效", enable: "开启音效", disable: "关闭音效" },
    ja: { sound: "サウンド", enable: "サウンドをオン", disable: "サウンドをオフ" },
    ko: { sound: "소리", enable: "소리 켜기", disable: "소리 끄기" },
    es: { sound: "Sonido", enable: "Activar sonido", disable: "Desactivar sonido" },
    "pt-BR": { sound: "Som", enable: "Ativar som", disable: "Desativar som" },
    fr: { sound: "Son", enable: "Activer le son", disable: "Désactiver le son" },
    de: { sound: "Ton", enable: "Ton einschalten", disable: "Ton ausschalten" },
    it: { sound: "Audio", enable: "Attiva audio", disable: "Disattiva audio" },
    ru: { sound: "Звук", enable: "Включить звук", disable: "Выключить звук" },
    hi: { sound: "ध्वनि", enable: "ध्वनि चालू करें", disable: "ध्वनि बंद करें" },
    ar: { sound: "الصوت", enable: "تشغيل الصوت", disable: "إيقاف الصوت" },
  };
  try {
    muted = localStorage.getItem(muteKey) === "1";
    const storedEffectsVolume = localStorage.getItem(effectsVolumeKey);
    const storedMusicVolume = localStorage.getItem(musicVolumeKey);
    const savedEffectsVolume = Number(storedEffectsVolume);
    const savedMusicVolume = Number(storedMusicVolume);
    if (storedEffectsVolume != null && Number.isFinite(savedEffectsVolume) && savedEffectsVolume >= 0 && savedEffectsVolume <= 100) effectsVolume = savedEffectsVolume;
    else if (muted) effectsVolume = 0;
    if (storedMusicVolume != null && Number.isFinite(savedMusicVolume) && savedMusicVolume >= 0 && savedMusicVolume <= 100) musicVolume = savedMusicVolume;
    muted = effectsVolume === 0;
    if (effectsVolume > 0) lastAudibleEffectsVolume = effectsVolume;
  } catch { muted = false; }

  /* AUDIO_CATALOG_BEGIN */
  const CATALOG = {"ui.click":{"file":"assets/audio/sfx/ui/click.mp3","duration":0.0071,"volume":0.55,"cooldownMs":55,"maxVoices":3,"priority":5},"ui.open":{"file":"assets/audio/sfx/ui/open.mp3","duration":0.28,"volume":0.7,"cooldownMs":70,"maxVoices":3,"priority":5},"ui.close":{"file":"assets/audio/sfx/ui/close.mp3","duration":0.25,"volume":0.7,"cooldownMs":70,"maxVoices":3,"priority":5},"ui.tick":{"file":"assets/audio/sfx/ui/tick.mp3","duration":0.0203,"volume":0.4,"cooldownMs":100,"maxVoices":3,"priority":5},"feedback.success":{"file":"assets/audio/sfx/feedback/success.mp3","duration":0.48,"volume":0.7,"cooldownMs":120,"maxVoices":3,"priority":5},"feedback.error":{"file":"assets/audio/sfx/feedback/error.mp3","duration":0.3368,"volume":0.7,"cooldownMs":180,"maxVoices":3,"priority":5},"feedback.hint":{"file":"assets/audio/sfx/feedback/hint.mp3","duration":0.3325,"volume":0.7,"cooldownMs":180,"maxVoices":3,"priority":5},"game.start":{"file":"assets/audio/sfx/game/start.mp3","duration":0.2563,"volume":0.7,"cooldownMs":200,"maxVoices":3,"priority":5},"game.checkpoint":{"file":"assets/audio/sfx/game/checkpoint.mp3","duration":0.49,"volume":0.7,"cooldownMs":250,"maxVoices":3,"priority":5},"result.win":{"file":"assets/audio/sfx/result/win.mp3","duration":0.7849,"volume":0.75,"cooldownMs":1200,"maxVoices":1,"priority":8},"result.lose":{"file":"assets/audio/sfx/result/lose.mp3","duration":0.4571,"volume":0.65,"cooldownMs":1200,"maxVoices":1,"priority":8},"reward.coin":{"file":"assets/audio/sfx/reward/coin.mp3","duration":0.55,"volume":0.55,"cooldownMs":100,"maxVoices":3,"priority":5},"reward.collect":{"file":"assets/audio/sfx/reward/collect.mp3","duration":0.2402,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":5},"reward.upgrade":{"file":"assets/audio/sfx/reward/upgrade.mp3","duration":0.2939,"volume":0.7,"cooldownMs":250,"maxVoices":3,"priority":5},"reward.unlock":{"file":"assets/audio/sfx/reward/unlock.mp3","duration":0.3784,"volume":0.7,"cooldownMs":250,"maxVoices":3,"priority":5},"shop.purchase":{"file":"assets/audio/sfx/shop/purchase.mp3","duration":0.2969,"volume":0.7,"cooldownMs":160,"maxVoices":3,"priority":2},"weapon.sword.swing":{"file":"assets/audio/sfx/weapon/sword-swing.mp3","duration":0.4,"volume":0.65,"cooldownMs":65,"maxVoices":3,"priority":2},"weapon.sword.hit":{"file":"assets/audio/sfx/weapon/sword-hit.mp3","duration":0.3558,"volume":0.7,"cooldownMs":65,"maxVoices":3,"priority":2},"weapon.axe.swing":{"file":"assets/audio/sfx/weapon/axe-swing.mp3","duration":0.52,"volume":0.7,"cooldownMs":90,"maxVoices":3,"priority":2},"weapon.axe.hit":{"file":"assets/audio/sfx/weapon/axe-hit.mp3","duration":0.2276,"volume":0.7,"cooldownMs":90,"maxVoices":3,"priority":2},"weapon.bow.release":{"file":"assets/audio/sfx/weapon/bow-release.mp3","duration":0.1602,"volume":0.7,"cooldownMs":75,"maxVoices":3,"priority":2},"weapon.arrow.hit":{"file":"assets/audio/sfx/weapon/arrow-hit.mp3","duration":0.0924,"volume":0.7,"cooldownMs":70,"maxVoices":3,"priority":2},"weapon.gun.fire":{"file":"assets/audio/sfx/weapon/gun-fire.mp3","duration":0.22,"volume":0.58,"cooldownMs":65,"maxVoices":3,"priority":2},"weapon.laser.fire":{"file":"assets/audio/sfx/weapon/laser-fire.mp3","duration":0.2444,"volume":0.6,"cooldownMs":65,"maxVoices":3,"priority":2},"projectile.launch":{"file":"assets/audio/sfx/projectile/launch.mp3","duration":0.0888,"volume":0.7,"cooldownMs":75,"maxVoices":3,"priority":2},"combat.strike":{"file":"assets/audio/sfx/combat/strike.mp3","duration":0.28,"volume":0.7,"cooldownMs":65,"maxVoices":3,"priority":2},"combat.critical":{"file":"assets/audio/sfx/combat/critical.mp3","duration":0.3702,"volume":0.75,"cooldownMs":90,"maxVoices":3,"priority":4},"combat.block":{"file":"assets/audio/sfx/combat/block.mp3","duration":0.1162,"volume":0.7,"cooldownMs":90,"maxVoices":3,"priority":2},"combat.shield.break":{"file":"assets/audio/sfx/combat/shield-break.mp3","duration":0.2463,"volume":0.7,"cooldownMs":140,"maxVoices":3,"priority":5},"player.hurt":{"file":"assets/audio/sfx/player/hurt.mp3","duration":0.4,"volume":0.7,"cooldownMs":180,"maxVoices":3,"priority":7},"enemy.defeat":{"file":"assets/audio/sfx/enemy/defeat.mp3","duration":0.5413,"volume":0.6,"cooldownMs":100,"maxVoices":3,"priority":4},"alert.boss":{"file":"assets/audio/sfx/alert/boss.mp3","duration":0.7141,"volume":0.7,"cooldownMs":1000,"maxVoices":1,"priority":8},"alert.warning":{"file":"assets/audio/sfx/alert/warning.mp3","duration":0.1393,"volume":0.7,"cooldownMs":900,"maxVoices":1,"priority":8},"magic.cast":{"file":"assets/audio/sfx/magic/cast.mp3","duration":0.65,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":2},"magic.hit":{"file":"assets/audio/sfx/magic/hit.mp3","duration":0.32,"volume":0.7,"cooldownMs":70,"maxVoices":3,"priority":2},"magic.fire":{"file":"assets/audio/sfx/magic/fire.mp3","duration":0.5,"volume":0.7,"cooldownMs":110,"maxVoices":3,"priority":2},"magic.ice":{"file":"assets/audio/sfx/magic/ice.mp3","duration":0.332,"volume":0.7,"cooldownMs":90,"maxVoices":3,"priority":2},"magic.heal":{"file":"assets/audio/sfx/magic/heal.mp3","duration":0.1935,"volume":0.7,"cooldownMs":180,"maxVoices":3,"priority":2},"magic.shield":{"file":"assets/audio/sfx/magic/shield.mp3","duration":0.7,"volume":0.7,"cooldownMs":180,"maxVoices":3,"priority":2},"explosion.small":{"file":"assets/audio/sfx/explosion/small.mp3","duration":0.7,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":2},"explosion.large":{"file":"assets/audio/sfx/explosion/large.mp3","duration":1.2,"volume":0.65,"cooldownMs":200,"maxVoices":3,"priority":5},"impact.soft":{"file":"assets/audio/sfx/impact/soft.mp3","duration":0.1804,"volume":0.7,"cooldownMs":65,"maxVoices":3,"priority":2},"impact.wood":{"file":"assets/audio/sfx/impact/wood.mp3","duration":0.2247,"volume":0.7,"cooldownMs":80,"maxVoices":3,"priority":2},"impact.metal":{"file":"assets/audio/sfx/impact/metal.mp3","duration":0.149,"volume":0.7,"cooldownMs":80,"maxVoices":3,"priority":2},"impact.glass":{"file":"assets/audio/sfx/impact/glass.mp3","duration":0.3326,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":2},"impact.stone":{"file":"assets/audio/sfx/impact/stone.mp3","duration":0.35,"volume":0.7,"cooldownMs":80,"maxVoices":3,"priority":2},"movement.step":{"file":"assets/audio/sfx/movement/step.mp3","duration":0.1459,"volume":0.4,"cooldownMs":100,"maxVoices":3,"priority":2},"movement.jump":{"file":"assets/audio/sfx/movement/jump.mp3","duration":0.1143,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":2},"movement.land":{"file":"assets/audio/sfx/movement/land.mp3","duration":0.1373,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":2},"movement.dash":{"file":"assets/audio/sfx/movement/dash.mp3","duration":0.3312,"volume":0.7,"cooldownMs":120,"maxVoices":3,"priority":2},"movement.hook":{"file":"assets/audio/sfx/movement/hook.mp3","duration":0.1736,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":2},"movement.release":{"file":"assets/audio/sfx/movement/release.mp3","duration":0.3,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":2},"board.move":{"file":"assets/audio/sfx/board/move.mp3","duration":0.1093,"volume":0.7,"cooldownMs":60,"maxVoices":3,"priority":2},"board.rotate":{"file":"assets/audio/sfx/board/rotate.mp3","duration":0.1515,"volume":0.7,"cooldownMs":70,"maxVoices":3,"priority":2},"board.undo":{"file":"assets/audio/sfx/board/undo.mp3","duration":0.061,"volume":0.7,"cooldownMs":100,"maxVoices":3,"priority":2},"puzzle.match":{"file":"assets/audio/sfx/puzzle/match.mp3","duration":0.1037,"volume":0.7,"cooldownMs":90,"maxVoices":3,"priority":2},"puzzle.merge":{"file":"assets/audio/sfx/puzzle/merge.mp3","duration":0.55,"volume":0.7,"cooldownMs":110,"maxVoices":3,"priority":2},"puzzle.pop":{"file":"assets/audio/sfx/puzzle/pop.mp3","duration":0.1199,"volume":0.7,"cooldownMs":65,"maxVoices":3,"priority":2},"puzzle.clear":{"file":"assets/audio/sfx/puzzle/clear.mp3","duration":0.322,"volume":0.7,"cooldownMs":180,"maxVoices":3,"priority":2},"card.place":{"file":"assets/audio/sfx/card/place.mp3","duration":0.2002,"volume":0.7,"cooldownMs":65,"maxVoices":3,"priority":2},"card.draw":{"file":"assets/audio/sfx/card/draw.mp3","duration":0.35,"volume":0.7,"cooldownMs":80,"maxVoices":3,"priority":2},"card.flip":{"file":"assets/audio/sfx/card/flip.mp3","duration":0.25,"volume":0.7,"cooldownMs":75,"maxVoices":3,"priority":2},"card.shuffle":{"file":"assets/audio/sfx/card/shuffle.mp3","duration":0.95,"volume":0.7,"cooldownMs":300,"maxVoices":3,"priority":2},"dice.roll":{"file":"assets/audio/sfx/dice/roll.mp3","duration":0.2623,"volume":0.7,"cooldownMs":220,"maxVoices":3,"priority":2},"reel.spin":{"file":"assets/audio/sfx/reel/spin.mp3","duration":0.6,"volume":0.7,"cooldownMs":220,"maxVoices":3,"priority":2},"reel.stop":{"file":"assets/audio/sfx/reel/stop.mp3","duration":0.1435,"volume":0.7,"cooldownMs":70,"maxVoices":3,"priority":2},"water.splash":{"file":"assets/audio/sfx/water/splash.mp3","duration":0.4974,"volume":0.55,"cooldownMs":140,"maxVoices":3,"priority":2},"sport.kick":{"file":"assets/audio/sfx/sport/kick.mp3","duration":0.25,"volume":0.7,"cooldownMs":90,"maxVoices":3,"priority":2},"sport.bounce":{"file":"assets/audio/sfx/sport/bounce.mp3","duration":0.1146,"volume":0.7,"cooldownMs":55,"maxVoices":3,"priority":2},"sport.goal":{"file":"assets/audio/sfx/sport/goal.mp3","duration":0.2898,"volume":0.7,"cooldownMs":300,"maxVoices":3,"priority":2},"mechanism.unlock":{"file":"assets/audio/sfx/mechanism/unlock.mp3","duration":0.1471,"volume":0.7,"cooldownMs":160,"maxVoices":3,"priority":2},"mechanism.screw":{"file":"assets/audio/sfx/mechanism/screw.mp3","duration":0.3,"volume":0.7,"cooldownMs":110,"maxVoices":3,"priority":2},"instrument.pluck":{"file":"assets/audio/sfx/instrument/pluck.mp3","duration":1.2,"volume":0.5,"cooldownMs":0,"maxVoices":12,"priority":2}};
  /* AUDIO_CATALOG_END */
  /* AUDIO_PROFILES_BEGIN */
  const PROFILES = {"alien-defender":["combat.block","enemy.defeat","game.checkpoint","game.start","player.hurt","result.lose","result.win","reward.upgrade","ui.click","weapon.laser.fire"],"animal-2048":["board.move","feedback.error","game.start","puzzle.merge","ui.click"],"animal-abyss-diver":["feedback.error","feedback.success","game.start","result.lose","result.win","reward.coin","ui.click"],"animal-acorn-auction":["game.start","ui.click"],"animal-auto-squad":["combat.strike","enemy.defeat","game.start","magic.heal","magic.shield","puzzle.merge","result.lose","result.win","reward.coin","shop.purchase","ui.click"],"animal-balance-grove":["board.move","feedback.error","feedback.success","game.start","ui.click"],"animal-bamboo-pipes":["game.start","ui.click"],"animal-block-grove":["game.start","ui.click"],"animal-bloom-mixer":["board.move","feedback.error","feedback.success","game.start","ui.click"],"animal-bounce-brawl":["game.start","ui.click"],"animal-bridge-workshop":["game.start","ui.click"],"animal-bubble-safari":["game.start","projectile.launch","puzzle.clear","puzzle.pop","ui.click"],"animal-burrow-builder":["board.move","feedback.error","game.start","ui.click"],"animal-bus-jam":["game.start","ui.click"],"animal-cafe-rush":["feedback.error","feedback.success","game.start","ui.click"],"animal-cairn-courier":["game.start","ui.click"],"animal-canopy-compass":["game.start","ui.click"],"animal-canopy-cut":["game.start","ui.click"],"animal-carnival-claw":["game.start","ui.click"],"animal-chameleon-blend":["game.start","ui.click"],"animal-cloudhook-courier":["feedback.error","game.start","movement.hook","movement.release","result.lose","result.win","reward.collect","ui.click"],"animal-color-link":["game.start","puzzle.clear","ui.click"],"animal-color-springs":["feedback.error","game.start","result.win","ui.click"],"animal-coloring-studio":["game.start","result.win","ui.click"],"animal-constellation-keeper":["board.move","feedback.error","feedback.success","game.start","ui.click"],"animal-costume-workshop":["game.start","ui.click"],"animal-cozy-camp":["feedback.error","feedback.success","game.start","ui.click"],"animal-cratebound":["game.start","ui.click"],"animal-crownfall":["alert.boss","combat.critical","combat.strike","feedback.error","game.start","puzzle.clear","result.lose","result.win","reward.collect","reward.upgrade","ui.click","weapon.sword.hit"],"animal-crystal-survivor":["combat.block","combat.critical","feedback.error","feedback.success","game.start","magic.cast","magic.hit","player.hurt","result.lose","result.win","reward.coin","reward.upgrade","ui.click","weapon.sword.hit","weapon.sword.swing"],"animal-cushion-stack":["board.move","feedback.error","feedback.success","game.start","ui.click"],"animal-dawn-shutters":["game.start","ui.click"],"animal-deep-sea-salvage":["game.start","ui.click"],"animal-dewline":["game.start","ui.click"],"animal-dice-bastion":["dice.roll","feedback.error","game.start","result.lose","result.win","reward.collect","reward.upgrade","ui.click"],"animal-echo-orchard":["game.start","ui.click"],"animal-field-dossier":["game.start","ui.click"],"animal-firefly-folio":["game.start","ui.click"],"animal-flip-foundry":["game.start","ui.click"],"animal-folded-field":["board.rotate","game.start","puzzle.clear","ui.click"],"animal-footprint-folio":["game.start","ui.click"],"animal-frost-maze":["game.start","ui.click"],"animal-gearpack-expedition":["feedback.error","game.start","result.lose","result.win","reward.coin","reward.upgrade","ui.click"],"animal-glyph-garden":["game.start","ui.click"],"animal-grove-dominoes":["board.move","feedback.error","game.start","ui.click"],"animal-guard-yard":["combat.block","combat.strike","enemy.defeat","feedback.error","game.start","impact.soft","magic.cast","magic.hit","movement.dash","player.hurt","projectile.launch","result.lose","result.win","reward.coin","ui.click","weapon.arrow.hit","weapon.bow.release"],"animal-gust-garden":["game.start","ui.click"],"animal-habitat-atlas":["game.start","ui.click"],"animal-habitat-blueprint":["game.start","ui.click"],"animal-habitat-builder":["game.start","ui.click"],"animal-habitat-counts":["game.start","ui.click"],"animal-habitat-mahjong":["game.start","ui.click"],"animal-hero-trials":["alert.boss","combat.block","enemy.defeat","feedback.success","game.start","magic.cast","magic.hit","movement.dash","result.lose","result.win","reward.coin","reward.upgrade","ui.click","weapon.sword.hit","weapon.sword.swing"],"animal-hidden-safari":["board.move","feedback.error","game.start","result.win","reward.collect","ui.click"],"animal-hollow-fit":["feedback.error","feedback.success","game.start","ui.click"],"animal-honey-shield":["game.start","ui.click"],"animal-hoop-league":["game.start","ui.click"],"animal-kite-keeper":["game.start","ui.click"],"animal-lantern-guides":["feedback.success","game.start","ui.click"],"animal-lantern-lattice":["game.start","ui.click"],"animal-layer-grove":["board.move","feedback.error","feedback.success","game.start","ui.click"],"animal-magnet-meadow":["game.start","ui.click"],"animal-meadow-difference":["feedback.error","feedback.success","game.start","ui.click"],"animal-moon-market":["game.start","ui.click"],"animal-moonlight-heist":["feedback.error","feedback.success","game.start","magic.cast","result.win","reward.coin","reward.upgrade","ui.click"],"animal-moonlight-workshop":["game.start","ui.click"],"animal-mosaic-clues":["game.start","ui.click"],"animal-nest-weigh":["game.start","ui.click"],"animal-number-match":["game.start","ui.click"],"animal-one-line":["game.start","ui.click"],"animal-orb-fortress":["combat.critical","feedback.error","feedback.success","game.start","impact.stone","magic.hit","projectile.launch","result.lose","result.win","ui.click"],"animal-orbit-orchard":["feedback.error","feedback.success","game.start","ui.click"],"animal-orchard-steward":["feedback.error","feedback.success","game.start","ui.click"],"animal-parade-builder":["feedback.error","feedback.success","game.start","ui.click"],"animal-parking-patrol":["game.start","ui.click"],"animal-patchwork-paws":["game.start","ui.click"],"animal-pattern-patch":["feedback.error","feedback.success","game.start","ui.click"],"animal-peach-oath":["game.start","magic.cast","result.lose","result.win","reward.upgrade","ui.click"],"animal-penalty-cup":["feedback.error","feedback.success","game.start","sport.bounce","sport.goal","ui.click"],"animal-pocket-post":["game.start","ui.click"],"animal-postcard-crop":["game.start","ui.click"],"animal-prism-battalion":["board.move","game.start","result.lose","result.win","ui.click"],"animal-prism-breakers":["game.start","ui.click"],"animal-prism-garden":["board.move","feedback.hint","game.start","puzzle.clear","ui.click"],"animal-putt-trails":["game.start","ui.click"],"animal-quiz":["feedback.error","feedback.success","game.start","result.win","ui.click"],"animal-rain-roost":["feedback.error","feedback.success","game.start","result.lose","ui.click"],"animal-reef-fisher":["alert.warning","feedback.error","feedback.success","game.start","movement.hook","movement.release","result.lose","result.win","reward.coin","reward.upgrade","ui.click"],"animal-relic-hunters":["alert.boss","enemy.defeat","feedback.success","game.start","magic.cast","player.hurt","result.lose","result.win","reward.coin","reward.upgrade","ui.click"],"animal-rescue":["feedback.error","game.start","result.win","reward.coin","ui.click"],"animal-rhythm-relay":["feedback.error","feedback.success","game.start","ui.click"],"animal-rift-salvage":["game.start","ui.click"],"animal-ring-garden":["game.start","ui.click"],"animal-river-gates":["game.start","ui.click"],"animal-rootvault-pins":["game.start","ui.click"],"animal-rope-rescue":["game.start","movement.release","result.lose","result.win","ui.click"],"animal-rune-reels":["alert.boss","feedback.error","feedback.success","game.start","magic.cast","magic.hit","player.hurt","result.win","reward.coin","reward.upgrade","ui.click"],"animal-rune-tactics":["alert.boss","enemy.defeat","feedback.error","feedback.success","game.start","magic.cast","magic.hit","result.win","reward.upgrade","ui.click"],"animal-sanctuary-loop":["feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"animal-screw-workshop":["feedback.error","game.start","mechanism.screw","puzzle.clear","ui.click"],"animal-signal-scout":["feedback.success","game.start","ui.click"],"animal-silhouette-scout":["game.start","ui.click"],"animal-sketchwheel-rally":["game.start","ui.click"],"animal-skybridge-rivals":["feedback.error","feedback.success","game.start","movement.dash","result.lose","result.win","reward.coin","reward.upgrade","ui.click"],"animal-skyport-dispatch":["game.start","result.lose","result.win","ui.click"],"animal-skyspire-drop":["game.start","impact.stone","impact.wood","movement.land","player.hurt","result.win","ui.click"],"animal-spectrum-pulse":["game.start","ui.click"],"animal-starlight-trails":["feedback.error","game.start","result.win","ui.click"],"animal-story-stitch":["game.start","ui.click"],"animal-sunbeam-garden":["game.start","ui.click"],"animal-tangle-rescue":["board.move","game.start","puzzle.clear","ui.click"],"animal-tangram":["game.start","ui.click"],"animal-tide-tally":["game.start","ui.click"],"animal-tideglass":["feedback.error","feedback.success","game.start","ui.click"],"animal-trap-trail":["game.start","ui.click"],"animal-triple-match":["board.move","board.undo","card.flip","card.shuffle","feedback.hint","game.start","impact.wood","puzzle.match","result.lose","result.win","ui.click"],"animal-twin-switchyard":["board.move","board.rotate","game.start","result.lose","result.win","ui.click"],"animal-unblock":["game.start","ui.click"],"animal-weather-watch":["game.start","ui.click"],"animal-wildwood-raid":["combat.block","enemy.defeat","game.start","movement.dash","player.hurt","result.lose","result.win","reward.collect","ui.click","weapon.axe.hit","weapon.axe.swing"],"animal-word-trails":["feedback.error","feedback.success","game.start","result.win","ui.click"],"animal-zoo-idle":["feedback.error","feedback.success","game.start","reward.coin","reward.upgrade","ui.click"],"arrow-escape":["game.start","ui.click"],"beast-deck":["alert.boss","combat.block","combat.strike","enemy.defeat","feedback.error","feedback.success","game.start","magic.cast","player.hurt","result.lose","result.win","reward.coin","reward.upgrade","ui.click"],"beast-tactician":["alert.boss","board.move","game.start","magic.heal","result.lose","result.win","reward.coin","reward.collect","reward.unlock","reward.upgrade","ui.click"],"block-blast":["game.start","ui.click"],"breakout":["game.start","ui.click"],"bubble-bakery":["feedback.error","game.start","puzzle.pop","result.lose","result.win","ui.click"],"campus-dash":["feedback.error","feedback.success","game.start","result.win","ui.click"],"casino":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"cat-color-sudoku":["board.move","feedback.error","feedback.hint","game.start","result.win","ui.click"],"checkers":["game.start","ui.click"],"chess":["board.move","feedback.error","game.start","result.win","ui.click"],"code-breaker":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"color-lunchbox":["feedback.error","feedback.success","game.start","result.win","ui.click"],"crazy-eights":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"cribbage":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"dino-color-lab":["game.start","ui.click"],"four-in-a-row":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"freecell-solitaire":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"fruit-merge":["board.move","game.start","puzzle.merge","ui.click"],"fusekeep":["alert.boss","alert.warning","combat.strike","enemy.defeat","explosion.small","feedback.error","feedback.success","game.start","impact.glass","impact.soft","magic.cast","magic.hit","magic.ice","player.hurt","projectile.launch","puzzle.merge","result.lose","result.win","reward.coin","reward.upgrade","ui.click","weapon.arrow.hit","weapon.bow.release","weapon.gun.fire"],"garden-tiles":["board.move","feedback.error","game.start","puzzle.match","ui.click"],"gin-rummy":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"go-fish":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"golf-solitaire":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"hangman":["game.start","ui.click"],"hearts":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"hexa-sort":["game.start","ui.click"],"klondike-solitaire":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"lights-out":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"mahjong-solitaire":["board.move","board.undo","card.shuffle","feedback.error","feedback.hint","game.start","puzzle.match","result.win","ui.click"],"maze-chase":["alert.boss","combat.block","enemy.defeat","explosion.large","explosion.small","game.checkpoint","game.start","magic.shield","movement.step","player.hurt","result.lose","result.win","reward.collect","ui.click","weapon.laser.fire"],"minefield-logic":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"naval-battle":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"old-maid":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"pawaxe":["combat.block","combat.critical","combat.shield.break","enemy.defeat","game.start","magic.cast","magic.heal","player.hurt","ui.click","weapon.axe.hit","weapon.axe.swing"],"peg-solitaire":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"pong":["game.start","sport.bounce","ui.click"],"pyramid-solitaire":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"reversi":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"road-crosser":["feedback.error","game.checkpoint","game.start","movement.step","result.lose","result.win","ui.click"],"shadow-wolf":["combat.critical","enemy.defeat","feedback.error","feedback.success","game.start","magic.cast","player.hurt","result.lose","result.win","reward.coin","reward.upgrade","ui.click","weapon.sword.hit","weapon.sword.swing"],"shape-train":["feedback.error","feedback.success","game.start","result.win","ui.click"],"signal-veil":["game.checkpoint","game.start","magic.cast","mechanism.unlock","player.hurt","reward.unlock","reward.upgrade","ui.click","weapon.sword.hit","weapon.sword.swing"],"sliding-15":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"snack-blocks":["feedback.error","game.start","puzzle.clear","puzzle.match","result.lose","result.win","ui.click"],"snake":["game.start","ui.click"],"space-rocks":["alert.boss","combat.block","enemy.defeat","explosion.large","explosion.small","game.checkpoint","game.start","magic.shield","movement.step","player.hurt","result.lose","result.win","reward.collect","ui.click","weapon.laser.fire"],"spades":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"speed":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"spider-solitaire":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"star-memory":["card.flip","feedback.error","game.start","puzzle.match","result.win","ui.click"],"sudoku":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"tetris":["game.start","ui.click"],"tic-tac-toe":["game.start","ui.click"],"tiny-weather-rescue":["feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"tower-of-hanoi":["board.move","feedback.error","feedback.success","game.start","result.lose","result.win","ui.click"],"tripeaks-solitaire":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"war":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"wonder-crash":["game.start","ui.click"],"wordle":["game.start","ui.click"],"yukon-solitaire":["card.draw","card.flip","card.place","feedback.error","feedback.success","game.start","result.win","ui.click"],"zhao-yun-a-dou":["combat.block","enemy.defeat","explosion.small","game.start","movement.dash","player.hurt","puzzle.merge","result.lose","result.win","ui.click","weapon.sword.hit"],"zoo-helper-day":["feedback.error","feedback.success","game.start","result.win","ui.click"]};
  /* AUDIO_PROFILES_END */
  const scriptURL = new URL(document.currentScript?.src || 'src/weightplay-audio.js', document.baseURI);
  const siteRoot = new URL('../', scriptURL);
  const cache = new Map();
  const requests = [];
  const active = new Set();
  const lastPlayed = new Map();
  const failures = new Map();
  const counters = { requested: 0, started: 0, dropped: 0, failed: 0, peakVoices: 0 };
  let effectsBus = null;
  let compressor = null;
  let resumePending = null;
  let preparedContext = null;
  let profileIDs = ["ui.click", "game.start"];
  let inflight = 0;
  let generation = 0;
  let combatGeneration = 0;
  let gestureSeen = false;
  let inputTarget = null;
  let currentClick = null;
  let lastInputSound = null;
  let currentScreen = null;
  const isCombat = id => /^(weapon|combat|projectile|impact|explosion|movement|enemy|player|magic)\./.test(id);
  const stamp = () => window.performance?.now?.() ?? Date.now();
  const bounded = (v, fallback = 1) => Number.isFinite(Number(v)) ? Math.max(0, Math.min(1, Number(v))) : fallback;
  function localDebug(message) {
    if (['localhost','127.0.0.1','[::1]'].includes(location.hostname)) console.warn('[WeightPlayAudio]', message);
  }
  function ensureContext() {
    if (audioContext?.state === 'closed') { audioContext = null; effectsBus = null; }
    if (!audioContext) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor || !gestureSeen) return null;
      try {
        audioContext = new Ctor({ latencyHint: 'interactive' });
        effectsBus = audioContext.createGain();
        effectsBus.gain.value = effectsVolume / 100;
        compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -9;
        compressor.knee.value = 12;
        compressor.ratio.value = 8;
        compressor.attack.value = .003;
        compressor.release.value = .12;
        effectsBus.connect(compressor);
        compressor.connect(audioContext.destination);
      } catch (error) {
        localDebug(`Audio unavailable: ${error.message}`);
        try { audioContext?.close()?.catch?.(() => {}); } catch (_) { /* optional output */ }
        audioContext = null; effectsBus = null; return null;
      }
    }
    return audioContext;
  }
  function unlock() {
    gestureSeen = true;
    const context = ensureContext();
    if (!context) return Promise.resolve(false);
    if (preparedContext !== context) { preparedContext = context; preload(profileIDs); }
    if (context.state === 'running') { unlocked = true; updateToggle(); return Promise.resolve(true); }
    if (!resumePending) {
      resumePending = Promise.resolve().then(() => context.resume()).then(() => {
        unlocked = context.state === 'running'; updateToggle(); return unlocked;
      }).catch(() => false).finally(() => { resumePending = null; });
    }
    return resumePending;
  }
  function assetURL(id) {
    const entry = CATALOG[id];
    return entry ? new URL(entry.file, siteRoot).href : null;
  }
  function pump() {
    while (inflight < 4 && requests.length) {
      const job = requests.shift(); inflight++;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      fetch(assetURL(job.id), { signal: controller.signal, credentials: 'same-origin' })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.arrayBuffer(); })
        .then(bytes => { job.entry.bytes = bytes; job.resolve(bytes); })
        .catch(error => { cache.delete(job.id); failures.set(job.id, stamp()); counters.failed++; localDebug(`${job.id}: ${error.message}`); job.resolve(null); })
        .finally(() => { clearTimeout(timeout); inflight--; pump(); });
    }
  }
  function load(id) {
    if (!Object.hasOwn(CATALOG, id)) return Promise.resolve(null);
    if (cache.has(id)) return cache.get(id).promise;
    if (failures.has(id) && stamp() - failures.get(id) < 10000) return Promise.resolve(null);
    const entry = { bytes: null, buffer: null, decoding: null, promise: null };
    entry.promise = new Promise(resolve => { requests.push({ id, entry, resolve }); });
    cache.set(id, entry); pump(); return entry.promise;
  }
  async function bufferFor(id, context) {
    const bytes = await load(id);
    if (!bytes || context.state === 'closed') return null;
    const entry = cache.get(id);
    if (!entry) return null;
    if (entry.buffer) return entry.buffer;
    if (!entry.decoding) {
      entry.decoding = context.decodeAudioData(bytes.slice(0)).then(buffer => {
        entry.buffer = buffer; return buffer;
      }).catch(error => {
        failures.set(id, stamp()); cache.delete(id); counters.failed++;
        localDebug(`Cannot decode ${id}: ${error.message}`); return null;
      });
    }
    return entry.decoding;
  }
  function preload(ids) {
    const valid = [...new Set(Array.isArray(ids) ? ids : [ids])].filter(id => Object.hasOwn(CATALOG,id));
    const context = audioContext;
    return Promise.all(valid.map(id => context ? bufferFor(id, context) : load(id))).then(items => items.every(Boolean));
  }
  function noteInput(id, automatic) {
    if (automatic) return;
    if (currentClick) currentClick.handled = true;
    if (inputTarget) lastInputSound = { target: inputTarget, at: stamp(), id };
  }
  function release(voice) {
    if (voice.done) return;
    voice.done = true; active.delete(voice);
    try { voice.source?.disconnect(); voice.gain?.disconnect(); } catch (_) { /* already disposed */ }
    voice.resolve();
  }
  function stopVoice(voice) {
    if (voice.done) return;
    try { voice.source?.stop(); } catch (_) { /* pending or already ended */ }
    release(voice);
  }
  function stopAll({ combatOnly = false } = {}) {
    if (combatOnly) combatGeneration++; else { generation++; combatGeneration++; }
    for (const voice of [...active]) if (!combatOnly || isCombat(voice.id)) stopVoice(voice);
    for (const id of [...lastPlayed.keys()]) if (!combatOnly || isCombat(id)) lastPlayed.delete(id);
  }
  function applyEngineVolumes() {
    if (effectsBus && audioContext) effectsBus.gain.setValueAtTime(effectsVolume / 100, audioContext.currentTime);
    if (muted || effectsVolume <= 0) stopAll();
  }
  function play(id, options = {}) {
    if (!options || typeof options !== 'object') options = {};
    noteInput(id, options.automatic);
    counters.requested++;
    if (typeof id !== 'string' || !Object.hasOwn(CATALOG, id)) {
      counters.dropped++; localDebug(`Unknown event: ${String(id)}; use docs/audio-catalog.md`); return null;
    }
    if (muted || effectsVolume <= 0 || document.hidden) { counters.dropped++; return null; }
    const context = ensureContext();
    if (!context) { counters.dropped++; return null; }
    const entry = CATALOG[id]; const at = stamp();
    const previous = lastPlayed.get(id);
    if (previous !== undefined && at - previous < entry.cooldownMs) { counters.dropped++; return null; }
    const same = [...active].filter(v => v.id === id);
    if (same.length >= entry.maxVoices) { counters.dropped++; return null; }
    if (active.size >= 16) {
      const victim = [...active].sort((a,b) => a.priority-b.priority || a.at-b.at)[0];
      if (!victim || victim.priority >= entry.priority) { counters.dropped++; return null; }
      stopVoice(victim);
    }
    const voice = { id, priority: entry.priority, at, generation, combatGeneration, done: false, source: null, gain: null, resolve: null };
    const ended = new Promise(resolve => { voice.resolve = resolve; });
    active.add(voice); lastPlayed.set(id,at);
    counters.peakVoices = Math.max(counters.peakVoices,active.size);
    const handle = Object.freeze({ id, ended, stop: () => stopVoice(voice) });
    // A slow download must never replay old combat after the scene has changed.
    const deadline = at + (isCombat(id) ? 140 : /^result\./.test(id) ? 700 : 350);
    const begin = buffer => {
      if (voice.done) return;
      if (!buffer || context.state !== 'running' || document.hidden || muted || voice.generation !== generation ||
          (isCombat(id) && voice.combatGeneration !== combatGeneration) || stamp() > deadline) {
        counters.dropped++; release(voice); return;
      }
      try {
        const source = context.createBufferSource(); const gain = context.createGain();
        voice.source=source; voice.gain=gain;
        source.buffer=buffer;
        // Only the explicitly musical instrument sample can change pitch.
        if (id === 'instrument.pluck' && Number.isFinite(options.noteHz)) source.playbackRate.value = Math.max(.25,Math.min(4,options.noteHz/261.625565));
        gain.gain.value=entry.volume*bounded(options.volume);
        source.connect(gain); gain.connect(effectsBus);
        source.onended=() => release(voice);
        source.start(); counters.started++;
      } catch(error) { counters.failed++; release(voice); localDebug(error.message); }
    };
    const cached = cache.get(id)?.buffer;
    if (cached && context.state === 'running') begin(cached);
    else Promise.all([bufferFor(id, context), context.state === 'running' ? true : unlock()])
      .then(([buffer]) => begin(buffer)).catch(() => { counters.failed++; release(voice); });
    return handle;
  }
  function createScope() {
    const handles = new Set(); let disposed = false;
    return Object.freeze({
      play(id, options) {
        if (disposed) return null;
        const handle=play(id,options);
        if (handle) { handles.add(handle); handle.ended.then(() => handles.delete(handle)); }
        return handle;
      },
      stop() { for (const handle of handles) handle.stop(); handles.clear(); },
      dispose() { disposed=true; for (const handle of handles) handle.stop(); handles.clear(); },
      stats: () => ({ disposed, voices: handles.size, contexts: 0 }),
    });
  }
  function installInputAudio() {
    const gesture = event => {
      inputTarget=event.target; unlock();
      setTimeout(() => { if (inputTarget===event.target) inputTarget=null; },0);
    };
    window.addEventListener('pointerdown',gesture,{ capture:true,passive:true });
    window.addEventListener('keydown',gesture,{ capture:true });
    document.addEventListener('click',event => {
      const target=event.target?.closest?.('button,a[href],[role="button"],input[type="button"],input[type="submit"]');
      if (!target || target.disabled || target.getAttribute('aria-disabled')==='true' || target.closest('[inert],[data-audio-click="off"]')) return;
      const sameRecent=lastInputSound && stamp()-lastInputSound.at<600 && (target.contains(lastInputSound.target) || lastInputSound.target?.contains?.(target));
      const click={ target, handled:Boolean(sameRecent) }; currentClick=click;
      setTimeout(() => {
        if (currentClick===click) currentClick=null;
        if (!click.handled && !event.defaultPrevented) play('ui.click',{automatic:true});
      },0);
    },true);
    document.addEventListener('visibilitychange',() => { if (document.hidden) stopAll(); });
    window.addEventListener('pagehide',() => { stopAll(); audioContext?.suspend()?.catch?.(() => {}); });
    window.addEventListener('weightplay:screen-change',event => {
      const next=event.detail?.screen;
      if (event.detail?.release || (currentScreen==='battle' && next!=='battle')) stopAll({combatOnly:true});
      currentScreen=next;
    });
    const pieces=location.pathname.split('/'); const index=pieces.lastIndexOf('games');
    const game=index>=0 ? pieces[index+1] : document.body?.dataset.gameId;
    profileIDs = [...new Set(['ui.click','game.start',...(PROFILES[game] || [])])];
    preload(profileIDs);
  }
  function clampVolume(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(100, Math.round(numeric)));
  }
  function applyMediaVolumes() {
    document.querySelectorAll('audio').forEach(audio => {
      const isMusic=audio.matches('[data-wp-music],[data-music],audio[loop]');
      try { audio.volume=(isMusic ? musicVolume : effectsVolume)/100; } catch (_) { /* optional browser media volume */ }
    });
  }
  function announceVolumeChange(channel, value) {
    window.dispatchEvent(new CustomEvent('weightplay:audio-volume-change', { detail: { channel, value, effectsVolume, musicVolume } }));
  }
  function setEffectsVolume(value, { track = true } = {}) {
    effectsVolume=clampVolume(value); muted=effectsVolume===0;
    if (effectsVolume>0) lastAudibleEffectsVolume=effectsVolume;
    try { localStorage.setItem(effectsVolumeKey,String(effectsVolume)); localStorage.setItem(muteKey,muted?'1':'0'); } catch (_) { /* optional preferences */ }
    applyEngineVolumes(); applyMediaVolumes(); updateToggle(); announceVolumeChange('effects',effectsVolume);
    if (track) window.WonderAnalytics?.track('sound_volume',{ volume:effectsVolume });
  }
  function setMusicVolume(value, { track = true } = {}) {
    musicVolume=clampVolume(value);
    try { localStorage.setItem(musicVolumeKey,String(musicVolume)); } catch (_) { /* optional preferences */ }
    applyMediaVolumes(); announceVolumeChange('music',musicVolume);
    if (track) window.WonderAnalytics?.track('music_volume',{ volume:musicVolume });
  }
  function setMuted(value) {
    setEffectsVolume(value ? 0 : lastAudibleEffectsVolume || 80);
    window.WonderAnalytics?.track('sound_toggle',{ muted });
  }
  function currentLocale() {
    const config=window.WONDER_SITE?.localization || {};
    const supported=config.phaseOneLocales || Object.keys(labels);
    const fallback=config.fallbackLocale || config.defaultLocale || 'en';
    const route=window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || document.documentElement.lang;
    if (route && supported.includes(route)) return route;
    try { const saved=localStorage.getItem(localeKey); if(saved && supported.includes(saved)) return saved; } catch (_) { /* optional locale storage */ }
    return fallback;
  }
  function soundLabels() { return labels[currentLocale()] || labels.en; }
  function updateToggle() {
    const toggle=document.querySelector('button[data-sound-toggle]');
    if (!toggle) return;
    const text=soundLabels();
    toggle.textContent=muted?'🔇':'🔊'; toggle.title=text.sound;
    toggle.setAttribute('aria-label',muted?text.enable:text.disable);
    toggle.classList.toggle('muted',muted); toggle.classList.toggle('locked',!unlocked);
  }
  function installStyles() {
    if (document.querySelector('[data-sound-style]')) return;
    const style=document.createElement('style'); style.dataset.soundStyle='true';
    style.textContent=`
      .sound-toggle {
        position:fixed !important; z-index:80 !important; left:auto !important; top:auto !important;
        right:max(12px,env(safe-area-inset-right)) !important; bottom:max(12px,env(safe-area-inset-bottom)) !important;
        display:grid !important; place-items:center !important; width:42px !important; height:42px !important;
        margin:0 !important; border:1px solid rgba(255,255,255,.28) !important; border-radius:50% !important;
        background:rgba(14,18,26,.66) !important; color:#fff !important; font:900 18px/1 system-ui,sans-serif !important;
        box-shadow:0 10px 24px rgba(0,0,0,.26) !important; opacity:.72 !important; backdrop-filter:blur(10px) !important;
        cursor:grab !important; touch-action:none !important; user-select:none !important; -webkit-user-select:none !important;
        transition:opacity .15s ease,transform .15s ease !important;
      }
      .sound-toggle:hover,.sound-toggle:focus-visible { opacity:1 !important; transform:scale(1.06) !important; }
      .sound-toggle.dragging { opacity:1 !important; cursor:grabbing !important; transition:none !important; }
      .sound-toggle.muted { opacity:.54 !important; }
      body.lobby-page :is(.lobby-hero,.kids-lobby-hero) .sound-toggle {
        position:absolute !important; z-index:4 !important; left:12px !important; top:auto !important;
        right:auto !important; bottom:12px !important; cursor:pointer !important;
      }`;
    document.head.append(style);
  }
  function clamp(value,min,max) { return Math.max(min,Math.min(max,value)); }
  function readPosition() {
    try {
      const saved=JSON.parse(localStorage.getItem(positionKey)||'null');
      return saved && Number.isFinite(saved.x) && Number.isFinite(saved.y) ? saved : null;
    } catch (_) { return null; }
  }
  function savePosition(x,y) {
    try { localStorage.setItem(positionKey,JSON.stringify({x:Math.round(x),y:Math.round(y)})); } catch (_) { /* optional position */ }
  }
  function placeToggle(button,x,y,persist=false) {
    const rect=button.getBoundingClientRect(), margin=8;
    const nextX=clamp(x,margin,window.innerWidth-(rect.width||42)-margin);
    const nextY=clamp(y,margin,window.innerHeight-(rect.height||42)-margin);
    button.style.setProperty('left',`${nextX}px`,'important'); button.style.setProperty('top',`${nextY}px`,'important');
    button.style.setProperty('right','auto','important'); button.style.setProperty('bottom','auto','important');
    if(persist) savePosition(nextX,nextY);
  }
  function overlapsControl(button,x,y) {
    const candidate={left:x,top:y,right:x+42,bottom:y+42};
    return [...document.querySelectorAll("button,a,select,input,[role='button']")].some(node => {
      if(node===button || node.contains(button) || button.contains(node)) return false;
      const style=getComputedStyle(node), box=node.getBoundingClientRect();
      if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)<=.02||box.width<=4||box.height<=4) return false;
      return Math.min(candidate.right,box.right)-Math.max(candidate.left,box.left)>4 && Math.min(candidate.bottom,box.bottom)-Math.max(candidate.top,box.top)>4;
    });
  }
  function findFreePosition(button) {
    const margin=8, right=Math.max(margin,window.innerWidth-54), candidates=[];
    for(let y=window.innerHeight-54;y>=margin;y-=50) candidates.push([right,y]);
    for(let y=window.innerHeight-54;y>=margin;y-=50) candidates.push([margin,y]);
    return candidates.find(([x,y])=>!overlapsControl(button,x,y)) || [right,Math.max(margin,window.innerHeight-54)];
  }
  function applySavedPosition(button) {
    const saved=readPosition();
    requestAnimationFrame(()=>{
      if(saved && !overlapsControl(button,saved.x,saved.y)){placeToggle(button,saved.x,saved.y,false);return;}
      const [x,y]=findFreePosition(button);placeToggle(button,x,y,false);
    });
  }
  function ensureFreePosition(button) {
    const box=button.getBoundingClientRect();
    if(!overlapsControl(button,box.left,box.top)) return;
    const [x,y]=findFreePosition(button);placeToggle(button,x,y,false);
  }
  function installDrag(button) {
    button.addEventListener('pointerdown',event=>{
      if(event.button!==undefined && event.button!==0) return;
      const rect=button.getBoundingClientRect();
      dragState={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,offsetX:event.clientX-rect.left,offsetY:event.clientY-rect.top,moved:false};
      button.setPointerCapture?.(event.pointerId);
    });
    button.addEventListener('pointermove',event=>{
      if(!dragState||dragState.pointerId!==event.pointerId) return;
      if(Math.hypot(event.clientX-dragState.startX,event.clientY-dragState.startY)>4){dragState.moved=true;button.classList.add('dragging');}
      if(!dragState.moved) return;
      event.preventDefault();placeToggle(button,event.clientX-dragState.offsetX,event.clientY-dragState.offsetY,false);
    });
    button.addEventListener('pointerup',event=>{
      if(!dragState||dragState.pointerId!==event.pointerId) return;
      if(dragState.moved){event.preventDefault();const rect=button.getBoundingClientRect();savePosition(rect.left,rect.top);}
      button.releasePointerCapture?.(event.pointerId);button.classList.remove('dragging');
      window.setTimeout(()=>{dragState=null;},0);
    });
    button.addEventListener('pointercancel',()=>{button.classList.remove('dragging');dragState=null;});
    window.addEventListener('resize',()=>{const rect=button.getBoundingClientRect();placeToggle(button,rect.left,rect.top,true);});
  }
  function installToggle() {
    if(document.querySelector('button[data-sound-toggle]')) return;
    installStyles();
    const button=document.createElement('button');button.type='button';button.className='sound-toggle';button.dataset.soundToggle='true';
    const lobbyHost=document.querySelector('.lobby-page :is(.lobby-hero,.kids-lobby-hero)');
    if(!lobbyHost) installDrag(button);
    button.addEventListener('click',event=>{
      if(dragState?.moved){event.preventDefault();return;}
      unlock();setMuted(!muted);if(!muted) play('ui.click');
    });
    (lobbyHost||document.body).append(button);
    if(!lobbyHost){
      applySavedPosition(button);window.setTimeout(()=>ensureFreePosition(button),250);window.setTimeout(()=>ensureFreePosition(button),900);
      new MutationObserver(()=>window.setTimeout(()=>ensureFreePosition(button),80)).observe(document.body,{attributes:true,attributeFilter:['class']});
    }
    updateToggle();
  }
  window.addEventListener('wonder:locale-change',updateToggle);
  window.WeightPlayAudio = Object.freeze({
    version:'1.0.0',preload,createScope,stopAll,assetURL,
    list:()=>Object.keys(CATALOG),
    describe:id=>CATALOG[id]?Object.freeze({...CATALOG[id]}):null,
    note:(frequency,options={})=>play('instrument.pluck',{...options,noteHz:frequency}),
    stats:()=>({...counters,activeVoices:active.size,cached:cache.size,contexts:audioContext?1:0,state:audioContext?.state||'locked'}),
    play,unlock,isMuted:()=>muted,setMuted,
    setEnabled:enabled=>{const wanted=Boolean(enabled);if(wanted===muted)setMuted(!wanted);return !muted;},
    getEffectsVolume:()=>effectsVolume,setEffectsVolume,getMusicVolume:()=>musicVolume,setMusicVolume,
  });
  function boot() {
    applyMediaVolumes();
    new MutationObserver(records=>{
      if(records.some(record=>[...record.addedNodes].some(node=>node.nodeType===Node.ELEMENT_NODE&&(node.matches?.('audio')||node.querySelector?.('audio'))))) applyMediaVolumes();
    }).observe(document.body,{childList:true,subtree:true});
    if(document.body.dataset.soundToggle!=='off') installToggle();
    installInputAudio();window.dispatchEvent(new CustomEvent('weightplay:audio-ready'));
  }
  if(document.body) boot();else document.addEventListener('DOMContentLoaded',boot,{once:true});
})();
