(function () {
  "use strict";

  const STORE_KEY = "weightplayCastleV1";
  const REWARD_PER_CLEAR = 1;
  const LEGACY_STAR_SAND_PER_CLEAR = 5;
  const DAILY_REWARD_KEY = "weightplayDailyReward";
  const DAILY_DIAMONDS = [5, 8, 12, 18, 25, 35];
  const buildings = [
    { id: "gate", cost: 12 },
    { id: "bridge", cost: 24 },
    { id: "garden", cost: 42 },
    { id: "tower", cost: 72 },
    { id: "observatory", cost: 120 },
  ];
  const copy = {
    en: { title: "Starlight Castle", intro: "Clear stages. Earn Star Sand. Grow your castle.", balance: "Star Sand", progress: "Castle progress", badges: "Game badges", build: "Build", built: "Built", need: "Need {count} more", next: "Next structure", clear: "Stage reward! +{count} Star Sand", visit: "Open castle", hall: "Castle Hall", tower: "Sun Tower", garden: "Moon Garden", library: "Story Library", observatory: "Sky Observatory", gate: "Welcome Gate", empty: "Finish a game stage to earn your first Star Sand.", accessibility: "Your growing castle" },
    "zh-Hant": { title: "星光城堡", intro: "闖關拿星砂，升級城堡。", balance: "星砂", progress: "城堡進度", badges: "遊戲徽章", build: "建造", built: "已建造", need: "還差 {count}", next: "下一座建築", clear: "關卡獎勵！獲得 {count} 星砂", visit: "前往城堡", hall: "城堡大廳", tower: "日光塔", garden: "月光花園", library: "故事圖書館", observatory: "觀星台", gate: "迎賓城門", empty: "完成一個遊戲關卡，領取第一份星砂。", accessibility: "逐漸成長的城堡" },
    "zh-Hans": { title: "星光城堡", intro: "通关拿星砂，升级城堡。", balance: "星砂", progress: "城堡进度", badges: "游戏徽章", build: "建造", built: "已建造", need: "还差 {count}", next: "下一座建筑", clear: "关卡奖励！获得 {count} 星砂", visit: "前往城堡", hall: "城堡大厅", tower: "日光塔", garden: "月光花园", library: "故事图书馆", observatory: "观星台", gate: "迎宾城门", empty: "完成一个游戏关卡，领取第一份星砂。", accessibility: "逐渐成长的城堡" },
    ja: { title: "星明かりのお城", intro: "ステージをクリアして星の砂を集め、お城を育てよう。", balance: "星の砂", progress: "お城の進み具合", badges: "ゲームバッジ", build: "建てる", built: "完成", need: "あと {count}", next: "次の建物", clear: "ステージ報酬！星の砂 +{count}", visit: "お城を見る", hall: "城の広間", tower: "陽光の塔", garden: "月明かりの庭", library: "物語の図書館", observatory: "星見台", gate: "歓迎の門", empty: "ゲームのステージをクリアして、星の砂を集めましょう。", accessibility: "成長するお城" },
    ko: { title: "별빛 성", intro: "스테이지를 깨고 별모래를 모아 성을 키우세요.", balance: "별모래", progress: "성 진행도", badges: "게임 배지", build: "건설", built: "완성", need: "{count}개 더 필요", next: "다음 건물", clear: "스테이지 보상! 별모래 +{count}", visit: "성 보기", hall: "성의 홀", tower: "햇빛 탑", garden: "달빛 정원", library: "이야기 도서관", observatory: "별 관측대", gate: "환영의 문", empty: "게임 스테이지를 완료하고 첫 별모래를 모아 보세요.", accessibility: "점점 자라는 성" },
    es: { title: "Castillo Estelar", intro: "Supera fases, reúne arena estelar y mejora tu castillo.", balance: "Arena estelar", progress: "Progreso del castillo", badges: "Insignias de juego", build: "Construir", built: "Construido", need: "Faltan {count}", next: "Siguiente edificio", clear: "¡Recompensa de fase! +{count} de arena estelar", visit: "Ver castillo", hall: "Gran Salón", tower: "Torre del Sol", garden: "Jardín Lunar", library: "Biblioteca de Historias", observatory: "Observatorio", gate: "Puerta de Bienvenida", empty: "Completa una fase para conseguir tu primera arena estelar.", accessibility: "Tu castillo en crecimiento" },
    "pt-BR": { title: "Castelo Estelar", intro: "Vença fases, junte areia estelar e amplie seu castelo.", balance: "Areia estelar", progress: "Progresso do castelo", badges: "Emblemas de jogos", build: "Construir", built: "Construído", need: "Faltam {count}", next: "Próxima construção", clear: "Recompensa da fase! +{count} de areia estelar", visit: "Ver castelo", hall: "Salão do Castelo", tower: "Torre do Sol", garden: "Jardim Lunar", library: "Biblioteca de Histórias", observatory: "Observatório Celeste", gate: "Portão de Boas-vindas", empty: "Conclua uma fase para ganhar sua primeira areia estelar.", accessibility: "Seu castelo em crescimento" },
    fr: { title: "Château des Étoiles", intro: "Terminez des niveaux, récoltez le sable étoilé et agrandissez le château.", balance: "Sable étoilé", progress: "Progression du château", badges: "Badges de jeu", build: "Construire", built: "Construit", need: "Encore {count}", next: "Prochain bâtiment", clear: "Récompense du niveau ! +{count} sable étoilé", visit: "Voir le château", hall: "Grande salle", tower: "Tour du Soleil", garden: "Jardin lunaire", library: "Bibliothèque des récits", observatory: "Observatoire", gate: "Porte d’accueil", empty: "Terminez un niveau pour gagner votre premier sable étoilé.", accessibility: "Votre château grandit" },
    de: { title: "Sternenlichtschloss", intro: "Schließe Level ab, sammle Sternensand und baue dein Schloss aus.", balance: "Sternensand", progress: "Schlossfortschritt", badges: "Spielabzeichen", build: "Bauen", built: "Gebaut", need: "Es fehlen {count}", next: "Nächstes Gebäude", clear: "Levelbelohnung! +{count} Sternensand", visit: "Schloss ansehen", hall: "Schlosshalle", tower: "Sonnenturm", garden: "Mondgarten", library: "Geschichtenbibliothek", observatory: "Sternwarte", gate: "Willkommenstor", empty: "Schließe ein Level ab und verdiene deinen ersten Sternensand.", accessibility: "Dein wachsendes Schloss" },
    it: { title: "Castello Stellato", intro: "Completa i livelli, raccogli sabbia stellare e fai crescere il castello.", balance: "Sabbia stellare", progress: "Progresso del castello", badges: "Distintivi di gioco", build: "Costruisci", built: "Costruito", need: "Ne mancano {count}", next: "Prossimo edificio", clear: "Premio del livello! +{count} sabbia stellare", visit: "Visita il castello", hall: "Sala del Castello", tower: "Torre del Sole", garden: "Giardino Lunare", library: "Biblioteca delle Storie", observatory: "Osservatorio", gate: "Porta di Benvenuto", empty: "Completa un livello per ottenere la tua prima sabbia stellare.", accessibility: "Il tuo castello cresce" },
    ru: { title: "Звёздный замок", intro: "Проходи уровни, собирай звёздный песок и развивай замок.", balance: "Звёздный песок", progress: "Развитие замка", badges: "Игровые значки", build: "Построить", built: "Построено", need: "Не хватает {count}", next: "Следующая постройка", clear: "Награда за уровень! +{count} звёздного песка", visit: "Открыть замок", hall: "Большой зал", tower: "Солнечная башня", garden: "Лунный сад", library: "Библиотека историй", observatory: "Обсерватория", gate: "Приветственные ворота", empty: "Пройди уровень и получи первый звёздный песок.", accessibility: "Твой растущий замок" },
    hi: { title: "तारों का किला", intro: "स्तर पूरे करें, तारों की रेत पाएँ और किला बढ़ाएँ।", balance: "तारों की रेत", progress: "किले की प्रगति", badges: "खेल बैज", build: "बनाएँ", built: "बन गया", need: "{count} और चाहिए", next: "अगली इमारत", clear: "स्तर का इनाम! +{count} तारों की रेत", visit: "किला देखें", hall: "किले का सभागार", tower: "सूर्य मीनार", garden: "चाँद का बगीचा", library: "कहानी पुस्तकालय", observatory: "तारा वेधशाला", gate: "स्वागत द्वार", empty: "पहली तारों की रेत पाने के लिए कोई स्तर पूरा करें।", accessibility: "आपका बढ़ता हुआ किला" },
    ar: { title: "قلعة النجوم", intro: "أكمل المراحل، واجمع رمال النجوم، وطوّر قلعتك.", balance: "رمال النجوم", progress: "تقدم القلعة", badges: "شارات الألعاب", build: "ابنِ", built: "مبني", need: "ينقصك {count}", next: "المبنى التالي", clear: "مكافأة المرحلة! +{count} من رمال النجوم", visit: "افتح القلعة", hall: "قاعة القلعة", tower: "برج الشمس", garden: "حديقة القمر", library: "مكتبة الحكايات", observatory: "مرصد النجوم", gate: "بوابة الترحيب", empty: "أكمل مرحلة لتحصل على أول رمال النجوم.", accessibility: "قلعتك وهي تنمو" },
  };

  const extraCopy = {
    en: { bridge: "Starlight Bridge", dailyBonus: "Daily diamonds +{count}/day", dailyBonusChange: "Daily diamonds {current} → {next}" },
    "zh-Hant": { bridge: "星光石橋", dailyBonus: "每日鑽石 +{count}／日", dailyBonusChange: "每日鑽石 {current} → {next}" },
    "zh-Hans": { bridge: "星光石桥", dailyBonus: "每日钻石 +{count}/天", dailyBonusChange: "每日钻石 {current} → {next}" },
    ja: { bridge: "星明かりの橋", dailyBonus: "毎日のダイヤ +{count}個", dailyBonusChange: "毎日のダイヤ {current} → {next}" },
    ko: { bridge: "별빛 다리", dailyBonus: "매일 다이아 +{count}개", dailyBonusChange: "일일 다이아 {current} → {next}" },
    es: { bridge: "Puente Estelar", dailyBonus: "Diamantes al día: +{count}", dailyBonusChange: "Diamantes diarios {current} → {next}" },
    "pt-BR": { bridge: "Ponte Estelar", dailyBonus: "Diamantes por dia: +{count}", dailyBonusChange: "Diamantes por dia {current} → {next}" },
    fr: { bridge: "Pont des étoiles", dailyBonus: "Diamants par jour : +{count}", dailyBonusChange: "Diamants par jour {current} → {next}" },
    de: { bridge: "Sternenbrücke", dailyBonus: "Tägliche Diamanten: +{count}", dailyBonusChange: "Diamanten pro Tag {current} → {next}" },
    it: { bridge: "Ponte stellato", dailyBonus: "Diamanti al giorno: +{count}", dailyBonusChange: "Diamanti giornalieri {current} → {next}" },
    ru: { bridge: "Звёздный мост", dailyBonus: "Алмазы в день: +{count}", dailyBonusChange: "Алмазы в день: {current} → {next}" },
    hi: { bridge: "तारों का पुल", dailyBonus: "रोज़ के हीरे: +{count}", dailyBonusChange: "रोज़ हीरे {current} → {next}" },
    ar: { bridge: "جسر النجوم", dailyBonus: "الألماس اليومي: +{count}", dailyBonusChange: "الألماس اليومي {current} → {next}" },
  };

  const castleCopy = {
    en: { level: "Castle Lv.{level}", daily: "Daily diamonds", claim: "Claim {count} diamonds", claimed: "Claimed today", received: "+{count} diamonds received", unavailable: "Unable to save. Please try again.", diamonds: "Diamonds" },
    "zh-Hant": { level: "城堡 Lv.{level}", daily: "每日可領", claim: "領取 {count} 顆鑽石", claimed: "今日已領", received: "已獲得 {count} 顆鑽石", unavailable: "無法儲存，請稍後再試。", diamonds: "鑽石" },
    "zh-Hans": { level: "城堡 Lv.{level}", daily: "每日可领", claim: "领取 {count} 颗钻石", claimed: "今日已领", received: "已获得 {count} 颗钻石", unavailable: "无法保存，请稍后再试。", diamonds: "钻石" },
    ja: { level: "お城 Lv.{level}", daily: "毎日の報酬", claim: "ダイヤを{count}個受け取る", claimed: "今日は受取済み", received: "ダイヤを{count}個獲得", unavailable: "保存できません。もう一度お試しください。", diamonds: "ダイヤ" },
    ko: { level: "성 Lv.{level}", daily: "매일 받는 보상", claim: "다이아 {count}개 받기", claimed: "오늘 받음", received: "다이아 {count}개 획득", unavailable: "저장할 수 없습니다. 다시 시도해 주세요.", diamonds: "다이아" },
    es: { level: "Castillo Nv.{level}", daily: "Diamantes diarios", claim: "Recibir {count} diamantes", claimed: "Recibido hoy", received: "Has recibido {count} diamantes", unavailable: "No se pudo guardar. Inténtalo de nuevo.", diamonds: "Diamantes" },
    "pt-BR": { level: "Castelo Nv.{level}", daily: "Diamantes por dia", claim: "Receber {count} diamantes", claimed: "Recebido hoje", received: "Você recebeu {count} diamantes", unavailable: "Não foi possível salvar. Tente novamente.", diamonds: "Diamantes" },
    fr: { level: "Château Niv.{level}", daily: "Diamants par jour", claim: "Recevoir {count} diamants", claimed: "Reçu aujourd’hui", received: "Vous avez reçu {count} diamants", unavailable: "Enregistrement impossible. Réessayez.", diamonds: "Diamants" },
    de: { level: "Schloss Lv.{level}", daily: "Tägliche Diamanten", claim: "{count} Diamanten abholen", claimed: "Heute abgeholt", received: "{count} Diamanten erhalten", unavailable: "Speichern nicht möglich. Bitte erneut versuchen.", diamonds: "Diamanten" },
    it: { level: "Castello Lv.{level}", daily: "Diamanti al giorno", claim: "Ricevi {count} diamanti", claimed: "Già ricevuto oggi", received: "Hai ricevuto {count} diamanti", unavailable: "Impossibile salvare. Riprova.", diamonds: "Diamanti" },
    ru: { level: "Замок ур.{level}", daily: "Алмазы каждый день", claim: "Получить {count} алмазов", claimed: "Сегодня получено", received: "Получено {count} алмазов", unavailable: "Не удалось сохранить. Попробуйте снова.", diamonds: "Алмазы" },
    hi: { level: "किला स्तर {level}", daily: "रोज़ के हीरे", claim: "{count} हीरे लें", claimed: "आज ले लिए", received: "{count} हीरे मिले", unavailable: "सहेजा नहीं जा सका। फिर कोशिश करें।", diamonds: "हीरे" },
    ar: { level: "القلعة، المستوى {level}", daily: "ألماس يومي", claim: "استلم {count} ألماسة", claimed: "تم الاستلام اليوم", received: "حصلت على {count} ألماسة", unavailable: "تعذّر الحفظ. حاول مجددًا.", diamonds: "ألماس" },
  };

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("weightplay-castle.css?v=20260928-castle-v7", document.currentScript?.src || location.href).href;
  document.head.append(stylesheet);

  const localeSegments = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const localeRoutes = Object.fromEntries(Object.entries(localeSegments).map(([locale, route]) => [route, locale]));
  const locale = () => {
    const selected = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
    return copy[selected] ? selected : "en";
  };
  const t = (key, vars = {}) => (castleCopy[locale()]?.[key] || copy[locale()][key] || extraCopy[locale()]?.[key] || copy.en[key] || extraCopy.en[key] || key).replace(/\{(\w+)\}/g, (_match, name) => String(vars[name] ?? ""));
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const emptyStore = () => ({ version: 2, castleMaterials: 0, completions: {}, badges: [], buildings: ["hall"] });
  function normalizeBuildings(value, legacy = false) {
    const previous = Array.isArray(value) ? value : [];
    if (legacy) {
      const oldOrder = ["tower", "garden", "library", "observatory", "gate"];
      const oldLevel = Math.min(buildings.length, oldOrder.filter((id) => previous.includes(id)).length);
      return ["hall", ...buildings.slice(0, oldLevel).map((building) => building.id)];
    }
    const migrated = new Set(previous.map((id) => id === "library" ? "bridge" : id));
    return ["hall", ...buildings.map((building) => building.id).filter((id) => migrated.has(id))];
  }
  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (!saved || ![1, 2].includes(saved.version)) return emptyStore();
      const legacySand = Math.max(0, Math.floor(Number(saved.starSand) || 0));
      const castleMaterials = saved.castleMaterials == null
        ? Math.floor(legacySand / LEGACY_STAR_SAND_PER_CLEAR)
        : Math.max(0, Math.floor(Number(saved.castleMaterials) || 0));
      return {
        version: 2,
        castleMaterials,
        completions: saved.completions && typeof saved.completions === "object" && !Array.isArray(saved.completions) ? saved.completions : {},
        badges: Array.isArray(saved.badges) ? [...new Set(saved.badges.filter((id) => typeof id === "string"))] : [],
        buildings: normalizeBuildings(saved.buildings, saved.version === 1),
      };
    } catch { return emptyStore(); }
  }
  function save(store) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
      window.dispatchEvent(new Event("weightplay:castle-updated"));
      return true;
    } catch { return false; }
  }
  function creditFirstClear(gameId, completionId = "first-completion") {
    const game = String(gameId || "").trim();
    const stage = String(completionId || "first-completion").trim();
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/i.test(game) || !/^[a-z0-9][a-z0-9._-]{0,63}$/i.test(stage)) return { credited: false, reason: "invalid" };
    if (["stage-endless", "stage-infinite", "stage-survival", "endless", "infinite", "survival"].includes(stage.toLowerCase())) return { credited: false, reason: "non-stage-clear" };
    const store = read();
    const key = `${game}:${stage}`;
    if (store.completions[key]) return { credited: false, reason: "already-claimed", store };
    store.completions[key] = Date.now();
    if (!store.badges.includes(game)) store.badges.push(game);
    store.castleMaterials += REWARD_PER_CLEAR;
    if (!save(store)) return { credited: false, reason: "storage-unavailable" };
    window.WonderAnalytics?.track?.("castle_first_clear_reward", { game_id: game, completion_id: stage, reward_amount: REWARD_PER_CLEAR, reward_type: "castle_material" });
    window.dispatchEvent(new CustomEvent("weightplay:castle-reward", { detail: { gameId: game, completionId: stage, amount: REWARD_PER_CLEAR, currency: "castle-material" } }));
    return { credited: true, amount: REWARD_PER_CLEAR, currency: "castle-material", store };
  }
  function dailyDiamondBonus(store = read()) {
    return dailyDiamonds(store) - DAILY_DIAMONDS[0];
  }
  function dailyDiamonds(store = read()) {
    return DAILY_DIAMONDS[Math.max(0, Math.min(DAILY_DIAMONDS.length - 1, store.buildings.length - 1))];
  }
  function dailyRewardState() {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    try {
      const previous = localStorage.getItem(DAILY_REWARD_KEY);
      const saved = JSON.parse(previous || "{}");
      return { today, previous, saved, claimedToday: saved?.lastClaimDate === today, available: true, amount: dailyDiamonds() };
    } catch {
      return { today, claimedToday: false, available: false, amount: dailyDiamonds() };
    }
  }
  function claimDailyRewardUnlocked() {
    const reward = dailyRewardState();
    if (reward.claimedToday) return { claimed: false, reason: "already-claimed" };
    if (!reward.available || !window.WeightPlayWallet?.addDiamonds) return { claimed: false, reason: "storage-unavailable" };
    // Preserve the old daily claim key so switching systems cannot pay twice today.
    // Reserve today's claim before crediting; restore it if the wallet write fails.
    try {
      localStorage.setItem(DAILY_REWARD_KEY, JSON.stringify({ ...reward.saved, lastClaimDate: reward.today, totalClaims: Math.max(0, Number(reward.saved?.totalClaims) || 0) + 1 }));
      window.WeightPlayWallet.addDiamonds(reward.amount);
    } catch {
      try {
        if (reward.previous == null) localStorage.removeItem(DAILY_REWARD_KEY);
        else localStorage.setItem(DAILY_REWARD_KEY, reward.previous);
      } catch { /* Keep the claim reserved if storage cannot restore it. */ }
      return { claimed: false, reason: "storage-unavailable" };
    }
    window.WeightPlayAudio?.play?.("feedback.success");
    window.WonderAnalytics?.track?.("daily_reward_claim", { reward_type: "diamonds", reward_amount: reward.amount, castle_level: read().buildings.length, locale: locale() });
    render();
    return { claimed: true, amount: reward.amount };
  }
  async function claimDailyReward() {
    try {
      if (window.navigator?.locks?.request) return await window.navigator.locks.request("weightplay-daily-reward", claimDailyRewardUnlocked);
      return claimDailyRewardUnlocked();
    } catch {
      return { claimed: false, reason: "storage-unavailable" };
    }
  }
  function build(buildingId) {
    const building = buildings.find((entry) => entry.id === buildingId);
    if (!building) return { built: false, reason: "unknown-building" };
    const store = read();
    if (store.buildings.includes(building.id)) return { built: false, reason: "already-built", store };
    if (store.castleMaterials < building.cost) return { built: false, reason: "not-enough", store, cost: building.cost };
    store.castleMaterials -= building.cost;
    store.buildings.push(building.id);
    if (!save(store)) return { built: false, reason: "storage-unavailable" };
    window.WonderAnalytics?.track?.("castle_building_unlocked", {
      building_id: building.id,
      castle_level: store.buildings.length,
      daily_diamond_bonus: dailyDiamondBonus(store),
      remaining_materials: store.castleMaterials,
    });
    return { built: true, store };
  }

  const api = Object.freeze({ key: STORE_KEY, rewardPerClear: REWARD_PER_CLEAR, read, creditFirstClear, build, dailyDiamondBonus, dailyDiamonds, dailyRewardState, claimDailyReward, refresh: render });
  window.WeightPlayCastle = api;

  function render() {
    const mount = document.querySelector("#weightplayCastle");
    if (!mount) return;
    const store = read();
    const next = buildings.find((building) => !store.buildings.includes(building.id));
    const buildingName = (id) => t(id);
    const level = store.buildings.length;
    const currentReward = dailyDiamonds(store);
    const nextReward = DAILY_DIAMONDS[Math.min(level, DAILY_DIAMONDS.length - 1)];
    const reward = dailyRewardState();
    const wallet = window.WeightPlayWallet?.read?.() || { diamonds: 0 };
    const frameIndex = level - 1;
    const frameColumn = frameIndex % 3;
    const frameRow = Math.floor(frameIndex / 3);
    const frameShift = -((frameColumn + 0.5) / 3) * 100;
    mount.innerHTML = `
      <div class="wp-castle-heading">
        <div><span class="wp-castle-kicker">${t("level", { level })}</span><h2 id="wpCastleTitle">${t("title")}</h2><p>${t("intro")}</p></div>
        <div class="wp-castle-balance" aria-label="${t("balance")}: ${store.castleMaterials}"><span aria-hidden="true">✦</span><strong>${store.castleMaterials}</strong><small>${t("balance")}</small></div>
      </div>
      <div class="wp-castle-daily">
        <div class="wp-castle-wallet"><span class="wp-castle-gem" aria-hidden="true"></span><span>${t("diamonds")}</span><strong>${wallet.diamonds}</strong></div>
        <div class="wp-castle-income"><span>${t("daily")}</span><strong>+${currentReward}</strong></div>
        <button class="wp-castle-build wp-castle-claim" type="button" data-castle-claim ${reward.claimedToday || !reward.available || !window.WeightPlayWallet ? "disabled" : ""}>${reward.claimedToday ? t("claimed") : t("claim", { count: currentReward })}</button>
        <p class="wp-castle-claim-status" role="status" aria-live="polite">${!reward.available ? t("unavailable") : ""}</p>
      </div>
      <div class="wp-castle-layout">
        <div class="wp-castle-scene" role="img" aria-label="${t("accessibility")}" data-castle-level="${level}">
          <img class="wp-castle-art" src="/assets/weightplay-castle-estate-levels-block-v1.png" alt="" width="1152" height="768" decoding="async" style="--castle-shift:${frameShift}%;--castle-top:${frameRow ? "-120%" : "0%"};">
        </div>
        <div class="wp-castle-next">
          <span class="wp-castle-kicker">${next ? t("next") : t("progress")}</span>
          <h3>${next ? buildingName(next.id) : t("title")}</h3>
          <div class="wp-castle-daily-bonus">
            <span class="wp-castle-gem" aria-hidden="true"></span>
            <span>${next ? t("dailyBonusChange", { current: currentReward, next: nextReward }) : t("dailyBonus", { count: currentReward })}</span>
          </div>
          ${next ? `<div class="wp-castle-actions"><div class="wp-castle-price"><span aria-hidden="true">✦</span>${next.cost} ${t("balance")}</div><button class="wp-castle-build" type="button" data-castle-build="${next.id}" ${store.castleMaterials < next.cost ? "disabled" : ""}>${t("build")}</button>${store.castleMaterials < next.cost ? `<small class="wp-castle-need">${t("need", { count: next.cost - store.castleMaterials })}</small>` : ""}</div>` : `<p class="wp-castle-complete">${t("built")}</p>`}
        </div>
      </div>
      <div class="wp-castle-footer"><span>${t("badges")}</span><strong>${store.badges.length}</strong></div>
      <div class="wp-castle-collection"><h3>${t("badges")}</h3>${store.badges.length ? `<div class="wp-castle-badges">${store.badges.map((gameId) => {
        const game = window.WONDER_LOBBY?.games?.find((entry) => entry.id === gameId);
        const names = window.WEIGHTPLAY_GAME_TITLES?.[gameId] || game?.title;
        const localizedName = typeof names === "string" ? names : names?.[locale()] || window.WonderI18n?.getLocalized?.(names);
        const title = typeof localizedName === "string" && localizedName ? localizedName : gameId;
        const path = game?.href ? new URL(game.href, document.baseURI).pathname : "";
        const href = path ? (window.WonderI18n?.localizedPath?.(locale(), path) || path) : "#weightplayCastle";
        const art = game?.art?.background || game?.art?.hero || "";
        return `<a class="wp-castle-badge" href="${escapeHtml(href)}" title="${escapeHtml(title)}" data-runtime-localize="off">${art ? `<img src="${escapeHtml(art)}" alt="" loading="lazy" decoding="async">` : `<span aria-hidden="true">✦</span>`}<strong>${escapeHtml(title)}</strong></a>`;
      }).join("")}</div>` : `<p class="wp-castle-empty">${t("empty")}</p>`}</div>`;
    mount.querySelector("[data-castle-claim]")?.addEventListener("click", async (event) => {
      event.currentTarget.disabled = true;
      const result = await claimDailyReward();
      render();
      const status = mount.querySelector(".wp-castle-claim-status");
      if (status) status.textContent = result.claimed ? t("received", { count: result.amount }) : t(result.reason === "already-claimed" ? "claimed" : "unavailable");
    });
    const castleArt = mount.querySelector(".wp-castle-art");
    castleArt?.addEventListener("error", () => {
      if (castleArt.dataset.fallback === "true") {
        castleArt.hidden = true;
        castleArt.style.display = "none";
        return;
      }
      castleArt.dataset.fallback = "true";
      castleArt.classList.add("is-fallback");
      castleArt.src = "/assets/weightplay-castle-star-citadel-block-v1.webp";
    });
    mount.querySelector("[data-castle-build]")?.addEventListener("click", (event) => {
      const result = build(event.currentTarget.dataset.castleBuild);
      if (!result.built) return;
      window.WeightPlayAudio?.play?.("feedback.success");
      render();
      const scene = mount.querySelector(".wp-castle-scene");
      scene?.classList.add("is-upgrading");
      window.setTimeout(() => scene?.classList.remove("is-upgrading"), 900);
    });
    mount.querySelectorAll("[data-castle-level]").forEach((piece) => {
      piece.classList.toggle("is-unlocked", level >= Number(piece.dataset.castleLevel));
    });
  }

  let dailyRefreshTimer;
  function scheduleDailyRefresh() {
    window.clearTimeout(dailyRefreshTimer);
    if (!document.querySelector("#weightplayCastle")) return;
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    dailyRefreshTimer = window.setTimeout(() => { render(); scheduleDailyRefresh(); }, midnight.getTime() - now.getTime() + 100);
  }
  function mountLobby() {
    const existing = document.querySelector("#weightplayCastle");
    const daily = document.querySelector("#dailyReward");
    if (!existing && !daily) return;
    const section = existing || document.createElement("section");
    if (!existing) {
      section.id = "weightplayCastle";
      section.className = "wp-castle-panel";
      section.setAttribute("aria-labelledby", "wpCastleTitle");
      daily.after(section);
    }
    document.querySelector("#lobbyAccountStrip")?.remove();
    daily?.remove();
    render();
    scheduleDailyRefresh();
    window.WonderAnalytics?.track?.("castle_view", { locale: locale() });
    if (window.location.hash === "#castle") section.scrollIntoView({ block: "start" });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountLobby, { once: true });
  else mountLobby();
  window.addEventListener("weightplay:castle-updated", render);
  window.addEventListener("weightplay:game-completed", (event) => {
    const detail = event.detail || {};
    const outcome = String(detail.outcome || "").toLowerCase();
    if (detail.cleared === false || detail.success === false || detail.won === false || ["fail", "failed", "loss", "lose", "defeat"].includes(outcome)) return;
    const gameId = detail.gameId || location.pathname.match(/\/games\/([^/]+)/)?.[1];
    if (!gameId) return;
    const rawStage = detail.stageId ?? detail.stage_id ?? detail.levelId ?? detail.level_id ?? detail.roomId ?? detail.room_id ?? detail.floorId ?? detail.floor_id ?? detail.chapterId ?? detail.chapter_id ?? detail.stage ?? detail.level;
    const rawText = typeof rawStage === "string" || typeof rawStage === "number" ? String(rawStage).trim() : "";
    const normalizedStage = rawText ? (rawText.toLowerCase().startsWith("stage-") ? rawText : `stage-${rawText.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 54)}`) : "first-completion";
    const completionId = detail.completionId ?? normalizedStage;
    creditFirstClear(gameId, completionId);
  });
  window.addEventListener("weightplay:castle-reward", (event) => {
    if (document.querySelector("#weightplayCastle")) return;
    document.querySelectorAll(".wp-castle-reward-toast").forEach((toast) => toast.remove());
    const message = t("clear", { count: event.detail?.amount || REWARD_PER_CLEAR });
    const toast = document.createElement("div");
    toast.className = "wp-castle-reward-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML = `<span class="wp-castle-reward-item" aria-hidden="true"></span><span class="wp-castle-reward-copy">${escapeHtml(message)}</span><span class="wp-castle-reward-flight" aria-hidden="true"><i></i><i></i><i></i></span><a href="/${localeSegments[locale()]}/#castle">${escapeHtml(t("visit"))}</a>`;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 7000);
  });
  window.addEventListener("wonder:locale-change", render);
  window.addEventListener("focus", render);
  window.addEventListener("pagehide", () => window.clearTimeout(dailyRefreshTimer));
  window.addEventListener("pageshow", () => { render(); scheduleDailyRefresh(); });
  window.addEventListener("storage", (event) => {
    if ([STORE_KEY, DAILY_REWARD_KEY, "weightplayWallet"].includes(event.key) || event.key == null) render();
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
  window.addEventListener("weightplay:castle-ready", render);
  window.dispatchEvent(new Event("weightplay:castle-ready"));
})();
