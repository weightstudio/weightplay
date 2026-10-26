/** Authored campaign data. x/width use local normalized river coordinates;
 * s, length, height and trackWidth() use metres. No runtime random level fill. */
export const PHYSICS = Object.freeze({
  step: 1 / 60, maxSubsteps: 4, riverWidth: 6, initialSpeed: 10,
  waterSpeed: 12, currentSpeed: 15, acceleration: 5.5,
  lateralSpeed: 3.8, lateralAcceleration: 14, airLateralSpeed: 2.2,
  jumpImpulse: 6.2, gravity: 12, jumpBuffer: 0.18, coyoteTime: 0.14,
  damageCooldown: 1.1, recoveryProtection: 1.3, recoveryPenalty: 3,
  maxEvents: 64, informationDistance: 42,
});

export const BOARDS = Object.freeze([
  Object.freeze({ id: 'brook', name: { en: 'Brook', 'zh-Hant': '溪流板' }, unlockStage: 0, waterMultiplier: 1, currentMultiplier: 1, lateralMultiplier: 1, airMultiplier: 1, crossCurrentMultiplier: 1 }),
  Object.freeze({ id: 'driftfin', name: { en: 'Driftfin', 'zh-Hant': '逐流板' }, unlockStage: 5, waterMultiplier: 1, currentMultiplier: 1.08, lateralMultiplier: 0.88, airMultiplier: 1, crossCurrentMultiplier: 1 }),
  Object.freeze({ id: 'reedguard', name: { en: 'Reedguard', 'zh-Hant': '蘆葦板' }, unlockStage: 15, waterMultiplier: 0.94, currentMultiplier: 1, lateralMultiplier: 1, airMultiplier: 1.15, crossCurrentMultiplier: 0.7 }),
]);
export function getBoard(id = 'brook') { return BOARDS.find(board => board.id === id) || BOARDS[0]; }

const flag = (s, x = 0, options = {}) => ({ kind: 'buoy', role: 'required', s, x, width: 0.82, shape: 'square', ...options });
const bonus = (s, x, options = {}) => ({ kind: 'buoy', role: 'bonus', s, x, width: 0.74, shape: 'diamond', ...options });
const flow = (s, length, x, direction = 0, options = {}) => ({ kind: 'current', s, length, x, width: 0.82, direction, speed: 15, ...options });
const cross = (s, length, direction, options = {}) => ({ kind: 'current', s, length, x: 0, width: 2, direction, speed: 12, strength: 0.42, ...options });
const rock = (s, x, options = {}) => ({ kind: 'obstacle', material: 'stone', s, x, width: 0.43, length: 1.8, height: 0.7, ...options });
const wood = (s, x, options = {}) => rock(s, x, { material: 'wood', ...options });
const wheel = (s, x = 0, options = {}) => ({ kind: 'wheel', material: 'wood', s, x, width: 0.46, length: 2, amplitude: 0.64, period: 4.2, phase: 0, height: 0.9, ...options });
const fork = (s, length = 75, options = {}) => ({ kind: 'fork', s, length, x: 0, width: 0.2, leftSpeed: 14.4, rightSpeed: 11.3, ...options });
const bridge = (s, length = 10, options = {}) => ({ kind: 'bridge', s, length, x: 0, width: 2, clearance: 0.9, ...options });
const bay = (s, x = 0, options = {}) => ({ kind: 'bay', s, x, width: 1.8, length: 12, ...options });
const gate = (s, options = {}) => ({ kind: 'gate', s, x: 0, width: 1.5, period: 6, openFor: 3, phase: 0, waitingDistance: 1.4, ...options });
const ramp = (s, x = 0, targetX = x, options = {}) => ({
  kind: 'ramp', s, x, width: 1.12, length: 4, launchStart: s - 1, launchEnd: s + 3,
  required: false, gap: false,
  target: { sStart: s + 7, sEnd: s + 21, minDistance: 8, maxDistance: 17.2, x: targetX, width: 1.45 },
  ...options,
});
const movingFlag = (s, x, options = {}) => flag(s, x, { amplitude: 0.36, period: 5, width: 1.02, moving: true, ...options });
const phaseFlag = (s, phase, x = 0) => flag(s, x, { tidePhase: phase, width: 1.16, shape: phase === 'early' ? 'bar' : 'cross' });
const route = (id, en, zh, length, timeLimit, aiCount, lessonKey, features, clearConditions = {}, goal = null, options = {}) => ({
  id, chapter: id <= 30 ? 1 : 2, name: { en, 'zh-Hant': zh }, length, timeLimit, aiCount, lessonKey, features, clearConditions,
  goal: goal || { en: 'Pass the marked buoys and reach the finish.', 'zh-Hant': '通過指定浮標並抵達終點。' },
  ...options,
});

const authored = [
  route(1, 'First Splash', '初次下水', 260, 65, 0, 'steer', [flag(65, -0.35), flag(175, 0.35), flow(105, 35, 0)]),
  route(2, 'Outside Current', '內彎水線', 300, 65, 0, 'currentChoice', [flow(40, 70, 0.55), flag(135, 0), flow(175, 70, -0.55), flag(270, 0)], { minCurrentZones: 1 }),
  route(3, 'Under the Timber Bridge', '木橋下', 320, 65, 1, 'alternatingPillars', [flag(70, 0.2), wood(120, -0.48), wood(190, 0.48), bridge(225), flag(280, -0.2)]),
  route(4, 'Two Banks', '兩岸分流', 350, 70, 1, 'forkChoice', [fork(100, 115), flag(65, 0), bonus(155, -0.65), bonus(180, 0.66), flag(270, 0)], {}, null, { curves: [0, -3, -5, 1, 5, 0] }),
  route(5, "Taro's Trial", '塔羅試航', 380, 75, 1, 'orderedFlags', [fork(85, 95), flag(145, -0.6), flag(255, 0.58), flow(290, 55, 0)], {}, { en: 'Take the left flag, then the right flag.', 'zh-Hant': '先通過左旗，再通過右旗。' }),
  route(6, 'First Ramp', '第一座跳台', 340, 70, 1, 'firstJump', [flag(55, 0), ramp(120, 0, 0, { required: true, gap: true }), flag(230, 0.25)], { minLandings: 1 }, { en: 'Make one marked ramp landing, then finish.', 'zh-Hant': '完成一次跳台落點後抵達終點。' }),
  route(7, 'Bend and Land', '弧線降落', 380, 75, 1, 'steeredLanding', [flag(65, 0.3), ramp(150, 0.25, -0.23, { required: true }), wood(250, 0.55), flag(315, -0.3)], { minLandings: 1 }),
  route(8, 'The Steady Line', '不跳更快', 360, 65, 2, 'optionalRamp', [ramp(100, -0.52, -0.52), flow(95, 90, 0.52), bonus(118, -0.6), flag(230, 0), flag(300, 0.3)], { maxFalls: 0 }),
  route(9, 'Ramp Relay', '雙台接力', 440, 80, 2, 'doubleLanding', [ramp(100, 0.38, 0.3), flag(175, 0), ramp(240, -0.3, -0.24, { required: true }), flag(345, -0.3)], { minLandings: 1 }),
  route(10, "Fia's Invitation", '菲雅的邀請', 460, 85, 2, 'raceLanding', [fork(70, 70), ramp(165, 0.45, 0.35, { required: true }), flag(270, 0), flow(305, 75, -0.45), flag(415, -0.25)], { minLandings: 1, maxRank: 2 }, { en: 'Land from the marked ramp and finish in the first two.', 'zh-Hant': '完成指定跳台落點，並以前二名抵達。' }),
  route(11, 'Against the Bend', '逆風岔口', 400, 75, 2, 'counterCurrent', [fork(90, 100, { leftSpeed: 10.2, rightSpeed: 13.8 }), cross(165, 35, -1), flag(235, 0), flow(275, 65, 0.5), flag(360, 0.2)]),
  route(12, 'Low Bridge Detour', '低橋繞行', 410, 80, 2, 'lowBridge', [ramp(130, 0.5, 0.4), bridge(136, 10, { x: 0.45, width: 1.05, clearance: 0.7 }), flag(220, -0.45), wood(295, 0), flag(360, -0.25)], { maxBridgeHits: 0 }),
  route(13, 'Crossing Wheel', '交會水車', 430, 80, 2, 'movingObstacle', [flag(80, 0), wheel(180), bonus(220, -0.65), flag(330, 0.25)]),
  route(14, 'Fork to Flight', '分流後起跳', 470, 85, 2, 'forkRamp', [fork(75, 90), flag(125, -0.55), ramp(210, -0.4, -0.25), bonus(228, -0.4), flag(355, 0.52)]),
  route(15, "Mimi's Two Lines", '咪咪的雙線賽', 520, 95, 2, 'sequentialForks', [fork(75, 95), flag(130, -0.57), fork(265, 100, { leftSpeed: 11.3, rightSpeed: 14.4 }), flag(325, 0.57), flag(455, 0)], {}, { en: 'Use the left bank at the first fork and the right bank at the second.', 'zh-Hant': '第一個分流走左岸，第二個分流走右岸。' }),
  route(16, 'Cross-current Lesson', '側流初見', 420, 80, 1, 'crossCurrent', [cross(90, 40, -1), flag(180, 0), cross(230, 40, 1), flag(340, 0)]),
  route(17, 'Timber Boundary', '浮木邊界', 430, 80, 2, 'currentHazards', [cross(95, 55, 1), wood(130, 0.7), wood(144, 0.7), flag(205, -0.35), flow(260, 70, -0.45), flag(375, 0.2)]),
  route(18, 'Slanting Take-off', '斜向起跳', 470, 85, 2, 'currentRamp', [cross(95, 35, 1), ramp(160, -0.15, -0.35, { required: true }), flag(265, 0.25), cross(320, 45, -1), flag(415, 0)], { minLandings: 1 }),
  route(19, 'Stable Passage', '穩流通行', 460, 90, 2, 'stabilityGoal', [flow(80, 100, -0.6, 0, { speed: 10.2 }), flow(80, 100, 0.6), rock(125, 0.6), rock(175, 0.6), flag(250, 0), flag(390, -0.3)], { minStability: 2 }),
  route(20, "Nori's Rescue Markers", '諾里的救援浮標', 560, 105, 2, 'shapeSequence', [cross(70, 35, -1), flag(155, -0.42, { shape: 'square' }), fork(205, 75), flag(250, 0.56, { shape: 'bar' }), ramp(335, 0, 0), flag(455, 0, { shape: 'cross' })], {}, { en: 'Pass square, double-bar, and cross markers in order.', 'zh-Hant': '依序通過方形、雙條與十字浮標。' }),
  route(21, 'Outer-bank Finds', '外岸收集', 480, 90, 2, 'bonusRoute', [flag(75, 0), bonus(145, -0.62), bonus(250, 0.6), flag(345, 0), flow(375, 65, -0.4)], { minBonus: 2 }),
  route(22, 'Landing Windows', '接岸窗口', 500, 90, 3, 'landingChoice', [ramp(150, 0, 0, { targets: [{ sStart: 157, sEnd: 171, minDistance: 8, maxDistance: 17.2, x: -0.4, width: 0.85 }, { sStart: 157, sEnd: 171, minDistance: 8, maxDistance: 17.2, x: 0.42, width: 0.85 }] }), flow(180, 95, 0.52), flag(310, 0.25), flag(430, -0.2)], { maxRank: 2 }),
  route(23, 'Behind the Wheel', '水車後方', 520, 95, 3, 'timedBonus', [flag(75, 0), wheel(205, 0.1, { period: 4.8 }), bonus(235, -0.55), flow(270, 70, 0.5), flag(435, 0)], { minBonus: 1 }),
  route(24, 'Shortcut Boundaries', '長跳的代價', 540, 95, 3, 'requiredAfterRamp', [ramp(100, -0.35, -0.2), fork(185, 85), flag(260, 0.5), cross(325, 40, 1), flag(445, -0.2)]),
  route(25, "Taro's Escort Windows", '塔羅的護航線', 580, 110, 2, 'movingMarkers', [movingFlag(160, -0.18, { phase: 0.4 }), cross(235, 40, 1), movingFlag(360, 0.18, { phase: 2.4 }), flag(505, 0)], {}, { en: 'Pass both moving escort windows, then finish.', 'zh-Hant': '通過兩個移動領航窗，再抵達終點。' }),
  route(26, 'Signs Before Mist', '霧前的標誌', 540, 100, 3, 'shapeFork', [fork(85, 95), flag(140, -0.55, { shape: 'bar' }), wood(245, 0), flag(335, 0.5, { shape: 'cross' }), flow(375, 85, -0.4)], {}, null, { atmosphere: 'mist' }),
  route(27, 'Linked Bend Flight', '連彎飛線', 560, 100, 3, 'bendRace', [flag(70, -0.3), cross(125, 30, 1), ramp(220, 0.25, -0.22), flow(285, 110, -0.4), flag(470, 0.25)], { maxRank: 2 }, null, { curves: [0, -5, 4, -5, 5, 0] }),
  route(28, 'The Clear Route', '清澈之路', 550, 110, 2, 'perfectStability', [fork(80, 95, { leftSpeed: 10.7, rightSpeed: 14.2 }), ramp(230, 0.42, 0.4), rock(236, 0.42), rock(290, 0.68), flag(370, -0.35), flag(470, 0)], { minStability: 3 }),
  route(29, 'Canyon Qualifier', '溪谷資格賽', 620, 115, 3, 'raceBonus', [fork(80, 75), bonus(135, -0.6), ramp(220, 0.35, 0.25), wheel(315, 0, { period: 5.4 }), bonus(385, 0.58), cross(435, 45, -1), flag(535, 0)], { minBonus: 2, maxRank: 2 }),
  route(30, 'Bramble Cruise Cup', '棘溪巡航杯', 680, 125, 3, 'chapterOneFinal', [fork(65, 85), flag(120, -0.55), ramp(230, 0.4, 0.35), bridge(237, 8, { x: -0.45, width: 0.9 }), flag(360, 0.4), cross(430, 50, 1), ramp(510, -0.25, -0.15), flag(595, 0)], { maxRank: 1 }, { en: 'Win the cup after passing all three flags.', 'zh-Hant': '依序通過三旗，並以第一名完成巡航杯。' }),
  route(31, 'Anchor Mooring', '潮錨泊位', 420, 95, 0, 'anchorIntro', [bay(100), gate(140, { width: 1.5, phase: 1.8 }), flag(235, 0), flag(355, 0)]),
  route(32, 'A Route Without Waiting', '沒有等候的路', 450, 95, 1, 'gateBypass', [gate(160, { width: 1.2, phase: 2.4 }), flow(130, 90, 0.82), flag(290, 0.25), flag(390, 0)]),
  route(33, 'Current Beyond the Gate', '閘後側流', 470, 100, 1, 'gateCurrent', [bay(90, -0.3), gate(130, { phase: 1.2 }), cross(170, 45, -1), flag(255, 0.5), flag(405, 0)]),
  route(34, 'Air over the Lock', '空中過閘', 490, 105, 2, 'jumpGateChoice', [ramp(170, 0.5, 0.35), gate(177, { width: 1.15, phase: 2.1, height: 0.6 }), gate(255, { phase: 4.3 }), flag(335, 0.55), flag(430, 0)]),
  route(35, "Keeper's Two Locks", '守渠人的開關', 540, 115, 2, 'saveAnchor', [gate(155, { width: 1.2, phase: 2.2 }), bay(290), gate(330, { width: 2, phase: 4.1 }), flag(415, 0.25), flag(490, 0)]),
  route(36, 'Reversing Tide', '雙向漲潮', 480, 105, 1, 'tideCurrent', [cross(100, 75, 1, { tidal: true, period: 6 }), flag(235, -0.25), cross(285, 65, -1, { tidal: true, period: 6, phase: 2 }), flag(415, 0.25)]),
  route(37, 'Before the Cross-current', '泊位外的流', 500, 110, 2, 'anchorCurrent', [bay(100), cross(125, 75, 1, { tidal: true, period: 6 }), wood(170, 0.68), flag(255, -0.4), gate(330, { width: 1.35, phase: 2 }), flag(445, 0)], { minStability: 2 }),
  route(38, 'Opposite Locks', '分流雙閘', 520, 110, 2, 'oppositeGateFork', [fork(100, 160), gate(170, { x: -0.6, width: 0.82, phase: 0 }), gate(220, { x: 0.6, width: 0.82, phase: 3 }), flag(330, 0), flag(465, 0.25)]),
  route(39, 'Tide-window Ramp', '潮窗跳台', 540, 115, 2, 'phaseLanding', [gate(130, { width: 1.45, phase: 1 }), ramp(205, 0, 0, { required: true }), cross(225, 60, 1, { tidal: true, period: 6 }), flag(360, -0.3), flag(475, 0)], { minLandings: 1 }),
  route(40, "Taro's Evening Tide", '塔羅的晚潮', 600, 130, 2, 'phaseSequence', [phaseFlag(165, 'early', -0.25), fork(230, 100), phaseFlag(410, 'late', 0.25), flag(540, 0)], {}, { en: 'Visit the early-tide flag, then the late-tide flag.', 'zh-Hant': '先通過早潮旗，再通過晚潮旗。' }),
  route(41, 'Turning Waterwheels', '輪轉水輪', 520, 115, 2, 'asynchronousWheel', [gate(135, { phase: 1.4 }), wheel(220, 0, { period: 4.4, phase: 0.6 }), flag(300, 0.4), gate(365, { phase: 4 }), flag(465, -0.2)]),
  route(42, 'Shallow-bank Shortcut', '淺岸捷徑', 540, 115, 3, 'tidalLandingChoice', [ramp(160, 0, 0, { targets: [{ sStart: 167, sEnd: 181, minDistance: 8, maxDistance: 17.2, x: -0.45, width: 0.85, tidePhase: 'late' }, { sStart: 167, sEnd: 181, minDistance: 8, maxDistance: 17.2, x: 0.4, width: 0.9 }] }), flow(205, 85, -0.55), gate(340, { width: 1.3, phase: 3 }), flag(450, 0)], { maxRank: 2 }),
  route(43, 'Rescue Order', '救援順序', 560, 120, 2, 'rescueGateSequence', [gate(125, { width: 2, phase: 1.2 }), flag(210, -0.45, { shape: 'bar' }), fork(275, 95), flag(335, 0.55, { shape: 'cross' }), flag(490, 0)]),
  route(44, 'Wind at the Merge', '回接風口', 580, 125, 2, 'mergeCurrent', [fork(85, 100), cross(190, 65, 1, { tidal: true, period: 6 }), flag(270, -0.45), bay(335), gate(375, { phase: 2.6 }), flag(515, 0.35)]),
  route(45, "Fia's Two Answers", '菲雅的兩種答案', 620, 135, 3, 'exclusiveJumpChoice', [ramp(165, -0.5, -0.45), gate(172, { x: 0.5, width: 0.85, phase: 1.5 }), ramp(340, 0.5, 0.45), gate(347, { x: -0.5, width: 0.85, phase: 4.5 }), flag(455, 0), flag(555, 0)], { minLandings: 1, maxLandings: 1, maxRank: 2 }, { en: 'Choose exactly one ramp line and finish in the first two.', 'zh-Hant': '只選一條跳線，以前二名抵達。' }),
  route(46, 'Rising Bridge', '漲潮木橋', 560, 125, 2, 'tidalBridge', [ramp(155, 0.35, 0.3), bridge(162, 9, { x: 0.35, width: 1.2, clearance: 1.5, tidal: true, lowClearance: 0.7 }), gate(295, { phase: 3.3 }), flag(380, -0.3), flag(495, 0)]),
  route(47, 'Waterline Switch', '雙水線翻轉', 580, 125, 3, 'twoTidalStreams', [flow(85, 115, -0.55, 1, { tidal: true, period: 6, strength: 0.2 }), flow(85, 115, 0.55, -1, { tidal: true, period: 6, phase: 3, strength: 0.2 }), ramp(260, 0, 0), flag(385, -0.35), flag(520, 0.3)], { minStability: 2 }),
  route(48, 'Keep the Last Anchor', '留錨過末閘', 610, 140, 3, 'lastGateResource', [bay(100), gate(145, { width: 1.3, phase: 2.3 }), cross(250, 65, 1, { tidal: true, period: 6 }), bay(410), gate(450, { width: 2, phase: 3.8 }), flag(550, 0)]),
  route(49, 'Two Landings', '接連兩次落點', 640, 140, 3, 'doubleRequiredLanding', [ramp(160, -0.15, -0.2, { required: true }), gate(230, { phase: 1.5 }), ramp(390, 0.2, 0.25, { required: true }), cross(460, 55, -1), flag(570, 0)], { minLandings: 2 }),
  route(50, "Nori's Tide Relay", '諾里的渡潮接力', 680, 150, 3, 'phaseStability', [phaseFlag(165, 'early', -0.25), gate(295, { width: 1.35, phase: 3.2 }), cross(365, 55, -1, { tidal: true, period: 6 }), phaseFlag(490, 'late', 0.3), flag(615, 0)], { minStability: 2 }),
  route(51, 'Glow Buoys', '幽光浮標', 600, 135, 3, 'nightShapeRoute', [gate(135, { phase: 2.4 }), fork(220, 95), flag(275, -0.52, { shape: 'bar' }), flag(410, 0.45, { shape: 'cross' }), gate(485, { width: 1.4, phase: 0.3 })], {}, null, { atmosphere: 'night' }),
  route(52, 'Race the Return Flow', '逆潮搶線', 630, 135, 3, 'raceTidalChoice', [fork(95, 140, { leftSpeed: 10.2, rightSpeed: 15 }), cross(250, 70, 1, { tidal: true, period: 6 }), ramp(375, 0, 0), flow(420, 110, -0.52), flag(565, 0)], { maxRank: 1 }),
  route(53, 'Steady Promise', '穩定之誓', 650, 155, 2, 'perfectGateRoute', [gate(145, { width: 1.3, phase: 3.4 }), ramp(270, 0.55, 0.45), rock(276, 0.55), gate(405, { width: 2, phase: 0.6 }), flag(515, -0.35), flag(595, 0)], { minStability: 3 }),
  route(54, 'Between Waterwheels', '水輪間的空隙', 670, 145, 3, 'wheelRampChain', [wheel(165, 0, { period: 4.6 }), ramp(260, -0.25, -0.2), wheel(325, 0.15, { period: 5.7, phase: 2.2 }), bonus(370, 0.55), flag(490, -0.25), gate(560, { width: 1.35, phase: 2.5 })], { minBonus: 1, maxRank: 2 }),
  route(55, "Keeper's Three Doors", '守渠人的三道門', 720, 165, 3, 'threeGateSequence', [gate(150, { width: 2, phase: 0.5 }), flag(205, -0.3), gate(340, { width: 2, phase: 2.5 }), flag(405, 0.3), gate(535, { width: 2, phase: 4.5 }), flag(610, 0)]),
  route(56, 'Two-bank Parade', '雙岸巡遊', 680, 155, 3, 'tideBankSequence', [fork(75, 100), flag(135, -0.55), ramp(260, 0.25, 0.3), bridge(267, 9, { x: 0.25, width: 1.1, clearance: 1.5, tidal: true, lowClearance: 0.7 }), fork(385, 110, { leftSpeed: 11, rightSpeed: 14.5 }), flag(445, 0.55), phaseFlag(585, 'late', 0)]),
  route(57, 'The Last Mooring', '最後的泊位', 700, 155, 3, 'lastMooringChoice', [gate(140, { width: 1.4, phase: 3.4 }), flag(230, -0.35), bay(340), ramp(385, 0.42, 0.4), cross(455, 70, 1, { tidal: true, period: 6 }), flag(585, 0)], { maxRank: 2, minStability: 2 }),
  route(58, 'Clean Navigation', '乾淨航線', 720, 160, 3, 'cleanDoubleLanding', [ramp(165, -0.2, -0.2, { required: true }), cross(260, 75, -1, { tidal: true, period: 6 }), ramp(425, 0.2, 0.2, { required: true }), gate(535, { phase: 1.8 }), flag(640, 0)], { maxFalls: 0, minLandings: 2 }),
  route(59, 'Tideway Qualifier', '潮渠資格賽', 750, 170, 3, 'racePhaseSequence', [flow(80, 105, -0.55), phaseFlag(245, 'early', -0.3), fork(325, 100), gate(445, { width: 1.4, phase: 3.5 }), phaseFlag(585, 'late', 0.3), flag(690, 0)], { maxRank: 2 }),
  route(60, 'A Promise to the Rapids', '棘溪與潮汐之約', 820, 185, 3, 'chapterTwoFinal', [fork(70, 100), flag(130, -0.55), ramp(255, 0.4, 0.3), bridge(262, 9, { x: -0.45, width: 0.9 }), phaseFlag(390, 'early', 0.3), gate(485, { width: 1.4, phase: 1.5 }), gate(590, { width: 2, phase: 3.5 }), phaseFlag(720, 'late', 0)], { maxRank: 1, minStability: 1 }, { en: 'Win the final after passing every river and tide flag.', 'zh-Hant': '通過全部水道與潮汐旗，贏得最後巡航。' }),
];

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

function buildStage(draft) {
  const features = draft.features.map((feature, index) => ({ ...feature, id: `${draft.id}:${feature.kind}:${index + 1}` }));
  const additions = [];
  for (const feature of features) {
    if (feature.kind === 'ramp' && feature.gap) additions.push({ kind: 'gap', id: `${feature.id}:gap`, s: feature.s + 4.5, length: 2, x: feature.x, width: feature.width, rampId: feature.id });
    if (feature.kind === 'gate' && !features.some(other => other.kind === 'bay' && Math.abs(other.s - (feature.s - 18)) < 15)) {
      additions.push({ kind: 'bay', id: `${feature.id}:bay`, s: feature.s - 18, length: 12, x: feature.x, width: Math.min(2, feature.width + 0.3), forGate: feature.id });
    }
    if (feature.kind === 'buoy' && feature.tidePhase) {
      additions.push({ kind: 'gate', id: `${feature.id}:tide-guide`, s: feature.s - 4, x: feature.x, width: 2, period: 6, openFor: 3, phase: 0, requiredPhase: feature.tidePhase, waitingDistance: 1.4, phaseGuide: true, forFlag: feature.id });
      additions.push({ kind: 'bay', id: `${feature.id}:bay`, s: feature.s - 23, length: 12, x: feature.x, width: 2, forGate: `${feature.id}:tide-guide` });
    }
  }
  features.push(...additions);
  features.sort((a, b) => a.s - b.s || a.id.localeCompare(b.id));
  const requiredFlags = features.filter(feature => feature.kind === 'buoy' && feature.role === 'required').map(feature => feature.id);
  const protectedRanges = features.filter(feature => (feature.kind === 'buoy' && feature.role === 'required') || (feature.kind === 'ramp' && feature.required)).map(feature => ({
    start: feature.s - 20, end: feature.kind === 'ramp' ? feature.target.sEnd + 4 : feature.s + 4,
  }));
  const positions = [0];
  for (let s = 65; s < draft.length - 35; s += 65) if (!protectedRanges.some(range => s > range.start && s < range.end)) positions.push(s);
  for (const range of protectedRanges) if (range.start > 12) positions.push(range.start);
  const checkpoints = [...new Set(positions.map(s => Math.max(0, Math.round(s))))].sort((a, b) => a - b).map((s, index) => ({ id: `${draft.id}:checkpoint:${index}`, s, x: 0 }));
  return deepFreeze({
    ...draft,
    chapterName: draft.chapter === 1 ? { en: 'Bramble Waterlines', 'zh-Hant': '棘溪的水線' } : { en: 'Tidal Aqueducts', 'zh-Hant': '潮汐水渠' },
    checkpointStage: draft.id % 5 === 0,
    curves: draft.curves || (draft.id <= 15 ? [0, 2.6, -2.8, 3.8, -2, 0] : draft.id <= 30 ? [0, -3.2, 4.2, -4, 2.2, 0] : [0, 3.4, -4.4, 2.8, -3, 0]),
    aiPace: Math.min(0.82, 0.64 + Math.floor((draft.id - 1) / 10) * 0.028),
    clearConditions: { flags: requiredFlags, ...draft.clearConditions },
    medalConditions: { maxHits: draft.id % 3 === 0 ? 0 : 1, minStability: draft.id % 3 === 1 ? 3 : 2 },
    optionalBonus: features.filter(feature => feature.kind === 'buoy' && feature.role === 'bonus').map(feature => feature.id),
    parTime: Math.ceil(draft.length / 10.8 + features.filter(feature => feature.kind === 'gate').length * 2.1 + 5),
    features,
    checkpoints,
    ramps: features.filter(feature => feature.kind === 'ramp'),
    anchorUnlocked: draft.chapter === 2,
    atmosphere: draft.atmosphere || (draft.chapter === 1 ? 'springwood' : 'tideworks'),
  });
}

export const STAGES = deepFreeze(authored.map(buildStage));
export function getStage(id) {
  const stage = STAGES[Number(id) - 1];
  if (!stage || stage.id !== Number(id)) throw new RangeError(`Unknown river stage: ${id}`);
  return stage;
}

/** Smooth authored centerline in world X; world forward is Z = -s. */
export function trackCenter(s, stageOrId = 1) {
  const stage = typeof stageOrId === 'object' ? stageOrId : getStage(stageOrId);
  const points = stage.curves;
  const t = Math.max(0, Math.min(1, s / stage.length)) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(t));
  const u = t - index;
  const eased = u * u * (3 - 2 * u);
  return points[index] + (points[index + 1] - points[index]) * eased;
}

export function trackWidth(_s, _stage) { return PHYSICS.riverWidth; }
export function trackHeight(_s, _stage) { return 0; }

export function tidePhase(time, period = 6, offset = 0) {
  return ((Number(time) + offset) % period + period) % period;
}
export function tideLabel(time) { return tidePhase(time) < 3 ? 'early' : 'late'; }
export function featureX(feature, time = 0) {
  if (!feature.amplitude) return feature.x || 0;
  return Math.max(-0.88, Math.min(0.88, (feature.x || 0) + Math.sin(time * Math.PI * 2 / feature.period + (feature.phase || 0)) * feature.amplitude));
}
export function gateIsOpen(feature, time) {
  // A phase marker's entry barrier closes early enough to let a stopped racer
  // reach the buoy before its advertised tide half ends. The flag itself still
  // uses the full three-second tide half; this is a visible safe-entry window.
  if (feature.requiredPhase) {
    const phase = tidePhase(time);
    return feature.requiredPhase === 'early' ? phase < 1.55 : phase >= 3 && phase < 4.55;
  }
  return tidePhase(time, feature.period || 6, feature.phase || 0) < (feature.openFor || 3);
}
export function gateSecondsToChange(feature, time) {
  const phase = tidePhase(time, feature.period || 6, feature.requiredPhase ? 0 : feature.phase || 0);
  if (feature.requiredPhase) {
    const start = feature.requiredPhase === 'early' ? 0 : 3;
    const end = start + 1.55;
    return phase >= start && phase < end ? end - phase : phase < start ? start - phase : 6 - phase + start;
  }
  const openFor = feature.openFor || 3;
  return phase < openFor ? openFor - phase : (feature.period || 6) - phase;
}
