// Authoring inventory from the owner GDD v1.0, 2026-10-27.
// A data record is not a playable map. Only W1-01 has an evolving M1 course;
// every other entry must remain planned until its real route is implemented.
export const WORLDS = Object.freeze([
  { id: 'W1', name: '苔芽工坊', theme: '草地、木板、陶瓷管線', mechanics: ['sphere', 'anchor', 'reassembly'], restoration: '綠化與主電源恢復', blueprintId: 'W1-blueprint' },
  { id: 'W2', name: '風帆空港', theme: '布帆、風輪、貨運平台', mechanics: ['wind', 'cargo', 'sail'], restoration: '起重機與帆翼恢復', blueprintId: 'W2-blueprint' },
  { id: 'W3', name: '棱晶礦帶', theme: '礦晶、軌道、黑岩', mechanics: ['dual-gravity', 'mirror'], restoration: '照明與晶體能源恢復', blueprintId: 'W3-blueprint' },
  { id: 'W4', name: '潮汐遺跡', theme: '水槽、石階、機械珊瑚', mechanics: ['water', 'float', 'drain'], restoration: '循環水道恢復', blueprintId: 'W4-blueprint' },
  { id: 'W5', name: '磁熔鍛場', theme: '冷熱金屬、熔爐、輸送軌', mechanics: ['magnetic-rail', 'heat', 'rotation'], restoration: '工作台與外殼修復', blueprintId: 'W5-blueprint' },
  { id: 'W6', name: '逆序核心', theme: '模組球殼、破碎連橋', mechanics: ['reassembly', 'combined-routes'], restoration: '六區接軌網完整亮起', blueprintId: 'W6-blueprint' },
]);

// id, title, mechanics, required flow, checkpoint names, archive placement hints,
// mastery description, integer/event rule. Null thresholds require a proven
// reference route; they are deliberately not invented during skeleton authoring.
const rows = [
  ['W1-01', '第一顆會轉的家', ['sphere', 'anchor', 'reassembly'], '繞到背面找供電端子，接回兩塊斷橋，修復出口', ['出發台', '錨點前', '出口前'], ['樹冠平台', '背面機房凹槽', '斷橋下可回返側台'], '不跌落完成主線', { counter: 'falls', equals: 0 }],
  ['W1-02', '斷橋接線員', ['reassembly', 'air-dash'], '觀察 A/B 配置，依序接通搬運路與高處出口，練習空中短衝', ['首個端子後', '高台前'], ['搬運箱頂', 'B 態側台', '短衝支線'], '以不超過三次配置切換通關', { counter: 'configurationSwitches', max: 3 }],
  ['W1-03', '地底朝上走', ['sphere', 'planar-gravity'], '從地表洞口切換至內壁步道，再從另一出口回到地表', ['洞口', '內壁中央', '外側出口'], ['倒懸工坊', '環壁側路', '出口上層'], '三個內壁檢查門依序通過且不跌落', { orderedGates: ['inner-1', 'inner-2', 'inner-3'], counter: 'falls', equals: 0 }],
  ['W1-04', '甦醒的苗圃', ['reassembly', 'pulse', 'valves'], '開啟三座水閥，讓植物橋依次長出，修好主幹路', ['第一水閥', '植物橋前', '終段'], ['閥門背面', '分枝頂端', '脈衝破殼側室'], '三段植物橋都不被敵人擊中', { counter: 'enemyHitsOnPlantBridges', equals: 0, requiredSegments: 3 }],
  ['W1-B', '過載園丁', ['bait-charge', 'root-power', 'pulse'], '誘導撞開外殼，切換根管供電，脈衝打斷三個過載節點', ['Boss 入口'], [], '未觸碰紅色衝撞軌跡而獲勝', { counter: 'chargeTrailContacts', equals: 0 }],
  ['W2-01', '風的方向牌', ['wind'], '閱讀風向布條，在有防護區段學習偏移，再越過敞開平台', ['練習區後', '第二風輪前'], ['風輪背台', '布帆下層', '逆風側路'], '三段風場都未撞上護欄警示帶', { counter: 'warningRailContacts', equals: 0, requiredSegments: 3 }],
  ['W2-02', '貨船不等人', ['cargo', 'platform-inheritance'], '搭貨板經過球面車站，落到不同方向的月台', ['第一車站', '轉運台'], ['貨架頂', '維修道', '末班支線貨板'], '單次循環接續搭乘三塊指定貨板', { orderedPlatforms: ['cargo-1', 'cargo-2', 'cargo-3'], cycleCount: 1, referenceDuration: null }],
  ['W2-03', '折帆穿雲', ['sail', 'wind', 'reassembly'], '拉起或收起帆面改變風道，讓貨板到達目標高度', ['第一帆桿', '第二風道'], ['收帆凹處', '側風台', '雙帆支線'], '只切換必要的兩座帆面完成主線', { allowedMechanisms: ['main-sail-1', 'main-sail-2'], forbiddenExtraSails: true }],
  ['W2-04', '風暴投遞線', ['wind', 'cargo', 'recoverable-module'], '將修復模組送到主桅；跌落時模組回最近安全座', ['收貨處', '中繼站', '主桅前'], ['中繼倉', '背風道', '主桅側翼'], '模組在本次主線中未觸發回收', { counter: 'moduleRecoveries', equals: 0 }],
  ['W2-B', '颶風織翼', ['sail-counter', 'anchor', 'wind'], '切帆將風導入進氣口，依序換位，接通最後風道', ['Boss 入口'], [], '三次風道反制都一次成功', { requiredCounters: 3, eachFirstAttempt: true }],
  ['W3-01', '礦坑的另一面', ['dual-gravity'], '在安全台切換互斥的地板與側壁重力，走到出口', ['第一切換台', '礦坑上層'], ['側壁礦袋', '反面棧道', '觀景管道'], '一次跳躍都未落入危險礦槽', { counter: 'hazardShaftLandings', equals: 0 }],
  ['W3-02', '晶光接力', ['mirror', 'pulse'], '以脈衝轉動有限角度鏡片，依序供電升降台與出口', ['首個接收器', '升降台後'], ['鏡片底座', '旁路接收室', '頂部橫梁'], '不啟動錯誤接收器完成主路', { counter: 'wrongReceiverActivations', equals: 0 }],
  ['W3-03', '兩顆月亮之間', ['anchor', 'dual-sphere'], '先在一側供電，再牽引到另一側，從不同重力方向開路', ['第一星體背面', '第二星體入口'], ['雙星相對面', '連橋下側', '遠端短衝台'], '所有必要牽引落點都無跌落', { counter: 'requiredTransitLandingFalls', equals: 0 }],
  ['W3-04', '折光升降井', ['dual-gravity', 'mirror'], '以兩種朝向將能量送上井頂，每段解完開出返回捷徑', ['井底', '中層', '井頂前'], ['底層暗室', '中層環梁', '頂層反向平台'], '三段機關均以規定最少切換次數解開', { counterBySegment: 'gravitySwitches', segmentCount: 3, exactMinimums: null, requiresSolvedReference: true }],
  ['W3-B', '棱鏡鑽王', ['drill-dodge', 'mirror', 'dual-gravity'], '閃避鑽擊、轉鏡照向側甲，再以另一重力面接續導能破壞三節點', ['Boss 入口'], [], '未被任一鑽擊命中', { counter: 'drillHits', equals: 0 }],
  ['W4-01', '潮來路不在', ['water-cycle', 'float'], '觀察水位標尺，沿浮台與高低兩路前進，深水安全回收', ['第一浮台後', '第二水槽'], ['低水位洞口', '高水位頂台', '側岸'], '沒有觸發深水回收', { counter: 'deepWaterRecoveries', equals: 0 }],
  ['W4-02', '水閘翻面', ['canal-reassembly', 'float'], '切換局部水渠，把水導向不同升降浮台', ['閥門房', '高位閘口'], ['乾渠側袋', '溢流台', '閘門頂'], '只開啟正確的兩條導水路', { allowedMechanisms: ['main-waterway-1', 'main-waterway-2'], forbiddenExtraWaterways: true }],
  ['W4-03', '漂流平台車站', ['float', 'anchor'], '搭有限軌道浮台，到達遺跡後方的錨點', ['首個車站', '第二停靠區'], ['站牌背面', '浮台下層檢修區', '側向月台'], '連續通過三個指定停靠檢查門', { orderedGates: ['dock-1', 'dock-2', 'dock-3'], consecutive: true }],
  ['W4-04', '退潮後的祕密', ['drain', 'timed-return'], '排空主槽，深入短支線，再沿已開捷徑回到高台', ['排水控制台', '底層安全屋', '回程出口'], ['底槽側室', '回程梯台', '高位殘柱'], '在一個排水週期內完成主要修復', { counter: 'drainCycles', max: 1, referenceDuration: null, requiresSolvedReference: true }],
  ['W4-B', '蓄潮巨螯', ['water-control', 'claw-dodge', 'float'], '排水露低位控制器，升水登高台，交替水位與夾擊窗口修復核心', ['Boss 入口'], [], '未被夾擊或衝浪擊中', { counters: ['clawHits', 'waveHits'], eachEquals: 0 }],
  ['W5-01', '磁鐵搬運課', ['magnetic-rail'], '用端子拉動受軌道約束的金屬塊組成橋樑', ['練習軌後', '跨爐橋前'], ['軌底凹槽', '橋側平台', '回程高台'], '金屬塊全程未觸發安全復位', { counter: 'magneticBlockResets', equals: 0 }],
  ['W5-02', '冷卻窗只有一下', ['heat-cycle'], '觀察倒數沿冷卻地面穿過鍛造段，安全島隨時可停留', ['入口冷卻台', '中央安全島'], ['散熱塔背面', '維修通道', '冷卻端子旁'], '每段熱區都在首次選定窗口通過', { everyHeatSegment: 'firstSelectedWindow', requiresSolvedReference: true }],
  ['W5-03', '巨輪的背面', ['rotation', 'planar-gravity'], '搭分段旋轉大輪，在明確標示的內外側重力路線切換', ['輪前月台', '內環', '外環出口'], ['輪軸', '內環側台', '外環維修梯'], '在一圈內通過三個指定檢查門', { orderedGates: ['wheel-1', 'wheel-2', 'wheel-3'], maxRevolutions: 1, referenceDuration: null, requiresSolvedReference: true }],
  ['W5-04', '熔爐接軌', ['magnetic-rail', 'heat-cycle'], '移動隔熱橋、供電冷卻，再跨過復甦的輸送軌', ['第一滑軌', '冷卻站', '末段'], ['隔熱板後', '冷卻機房', '終端高架'], '完成最後一段時未受熱傷害', { counter: 'finalSegmentHeatHits', equals: 0 }],
  ['W5-B', '磁熔壓鑄機', ['rail-plate-block', 'cooling', 'pulse'], '拉板擋衝擊、換側軌開冷卻，再於暴露窗口修復控制器', ['Boss 入口'], [], '三次擋擊板都放置正確', { requiredBlocks: 3, eachCorrectPlacement: true }],
  ['W6-01', '散架的航道', ['sphere', 'reassembly', 'anchor'], '重新組合三段航道，各段使用一種已學機制', ['第一段航道入口', '第二段航道入口', '第三段航道入口'], ['第一段背台', '第二段支軌', '第三段上層'], '所有主線牽引均不中斷且不跌落', { counters: ['mainTransitInterruptions', 'falls'], eachEquals: 0 }],
  ['W6-02', '沒有固定的上方', ['dual-gravity', 'cargo'], '由安全觀察台看清平台方向，再切重力登上指定載台', ['第一重力台', '轉乘室'], ['觀察窗後', '轉乘室底層', '終段側台'], '三次換面後都落上指定平台', { requiredFaceLandings: ['transfer-1', 'transfer-2', 'transfer-3'], eachCorrect: true }],
  ['W6-03', '把世界接回去', ['wind', 'mirror', 'cooling'], '修復風道、導能、冷卻三條短支線，每條完成即開穩定捷徑', ['中央台', '風道支線終點', '導能支線終點', '冷卻支線終點'], ['風道支線', '導能支線', '冷卻支線'], '三條支線各自一次通過終段挑戰', { branchFinalAttempts: { wind: 1, energy: 1, cooling: 1 } }],
  ['W6-04', '最後的維修員', ['combined-routes', 'timed-shell'], '穿越閉合外殼，個別區段倒數，失敗回該區入口', ['第一綜合區入口', '第二綜合區入口', '第三綜合區入口'], ['外殼背面', '緩衝室高台', '終點前支橋'], '三個綜合區段均未觸發救援回收', { counter: 'rescueRecoveries', equals: 0, requiredSegments: 3 }],
  ['W6-B', '零序中樞', ['energy-unlock', 'shell-reassembly', 'core-platform-repair'], '導能解封、接軌三塊球殼，進核心完成三短平台區與手動修復', ['Boss 入口'], [], '三階段各自的指定反制均一次成功', { phaseCounterAttempts: [1, 1, 1] }],
];

export const LEVELS = rows.map((row, index) => {
  const [id, name, mechanics, objective, checkpoints, archiveHints, mastery, eventRule] = row;
  const world = Number(id[1]);
  const isBoss = id.endsWith('-B');
  return {
    id, name, title: name, world, worldId: `W${world}`, ordinal: index + 1, version: 1,
    kind: isBoss ? 'boss' : 'adventure',
    planned: id !== 'W1-01',
    implementation: id === 'W1-01' ? 'M1 motor course; complete adventure pending' : 'planned; no authored playable map',
    mechanics, objective,
    requires: index === 0 ? null : rows[index - 1][0],
    assets: `world-${world}`,
    gravityFields: null, start: null, platforms: null, anchors: null,
    mechanismGraph: null, enemies: null, victory: null,
    checkpoints: checkpoints.map((checkpointName, checkpointIndex) => ({ id: `${id}-checkpoint-${checkpointIndex + 1}`, name: checkpointName, position: null, snapshotPolicy: 'mechanisms-and-safe-landing', authored: false })),
    archives: archiveHints.map((placementHint, archiveIndex) => ({
      id: `${id}-${['observation', 'mechanism', 'execution'][archiveIndex]}`,
      name: `${name}・${['觀察', '機關', '操作'][archiveIndex]}檔案`,
      placementHint, position: null, route: null, authored: false,
    })),
    blueprintId: isBoss ? `W${world}-blueprint` : null,
    mastery: { id: `${id}-mastery`, description: mastery, eventRule, referenceRoute: null, verified: false },
    resetPolicy: isBoss ? 'Reset all boss phases and required mechanisms on zero HP; entrance retry.' : 'Return to last safe checkpoint with matching mechanism state; required routes always recoverable.',
    tutorialKey: `${id}-tutorial`,
    tests: { mainline: 'pending real input', archiveRoutes: 'pending authored coordinates and real input', masteryReference: 'pending real input', reset: 'pending real input' },
  };
});
