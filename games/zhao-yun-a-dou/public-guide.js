/* Game-specific corrections; shared guide renderer and styling stay canonical. */
(() => {
  'use strict';
  const details = {
    en: ['Defend A Dou by recruiting soldiers and balancing three lanes. Merge without leaving a route undefended.', 'Later missions increase enemy durability, speed and pressure across lanes, with more frequent bosses.', 'Block-style soldiers distinguish troop types visually; formation choices and timed general skills remain player decisions.'],
    'zh-Hant': ['招募士兵、調整三路陣形來保護阿斗。合成前先確認每條路線仍有人防守。', '後續任務會提高敵軍耐久、速度與分路壓力，首領也會更常出現。', '方塊人物讓兵種更容易辨認；陣形配置與武將技能的施放時機仍由玩家決定。'],
    'zh-Hans': ['招募士兵、调整三路阵形来保护阿斗。合成前先确认每条路线仍有人防守。', '后续任务会提高敌军耐久、速度与分路压力，首领也会更常出现。', '方块人物让兵种更容易辨认；阵形配置与武将技能的释放时机仍由玩家决定。'],
    ja: ['兵士を募集し、3本の進路に配置して阿斗を守ります。合成する前に守備のない進路ができないか確認しましょう。', '後の任務では敵の耐久力と速度、各進路への圧力が増し、ボスも頻繁に出現します。', 'ブロック風の兵士で兵種を見分けられます。配置と武将スキルのタイミングはプレイヤーが決めます。'],
    ko: ['병사를 모집하고 세 경로의 진형을 조정해 아두를 지키세요. 합성 전에 빈 수비 경로가 생기지 않는지 확인하세요.', '후반 임무에서는 적의 내구력과 속도, 여러 경로의 압박이 증가하고 우두머리가 더 자주 등장합니다.', '블록 스타일 병사로 병종을 구분합니다. 진형과 장수 기술 사용 시점은 플레이어가 결정합니다.'],
    es: ['Protege a A Dou reclutando soldados y equilibrando tres rutas. No dejes una ruta indefensa al fusionar.', 'Las misiones posteriores aumentan la resistencia, velocidad y presión enemiga, con jefes más frecuentes.', 'Los soldados de estilo cúbico distinguen los tipos de tropa. Tú decides la formación y cuándo usar las habilidades.'],
    'pt-BR': ['Proteja A Dou recrutando soldados e equilibrando três rotas. Não deixe uma rota sem defesa ao combinar unidades.', 'As missões seguintes aumentam a resistência, velocidade e pressão inimiga, com chefes mais frequentes.', 'Os soldados em blocos distinguem os tipos de tropa. Você escolhe a formação e quando usar as habilidades.'],
    fr: ['Protégez A Dou en recrutant des soldats et en équilibrant trois voies. Ne laissez aucune voie sans défense lors des fusions.', 'Les missions suivantes augmentent la résistance, la vitesse et la pression ennemies, avec des chefs plus fréquents.', 'Les soldats cubiques distinguent les types de troupes. Vous choisissez la formation et le moment des compétences.'],
    de: ['Schütze A Dou mit rekrutierten Soldaten auf drei Wegen. Lass beim Vereinen keinen Weg unbewacht.', 'Spätere Missionen erhöhen Ausdauer, Tempo und Druck der Gegner; Bosse treten häufiger auf.', 'Soldaten im Blockstil machen Truppentypen erkennbar. Formation und Einsatz der Fähigkeiten bestimmst du.'],
    it: ['Proteggi A Dou reclutando soldati e bilanciando tre corsie. Non lasciare una corsia indifesa quando unisci le unità.', 'Le missioni successive aumentano resistenza, velocità e pressione nemiche, con boss più frequenti.', 'I soldati a blocchi distinguono i tipi di truppa. Scegli tu la formazione e quando usare le abilità.'],
    ru: ['Защищайте А Доу, нанимая солдат и распределяя их по трём линиям. При объединении не оставляйте линию без защиты.', 'В следующих миссиях растут выносливость, скорость и давление врагов, а боссы появляются чаще.', 'Блочные персонажи помогают различать типы войск. Расстановку и момент применения умений выбирает игрок.'],
    hi: ['सैनिक भर्ती करके तीन रास्तों पर रक्षा संतुलित करें और आ दोउ को बचाएँ। मिलाते समय कोई रास्ता असुरक्षित न छोड़ें।', 'आगे के मिशनों में दुश्मनों की सहनशक्ति, गति और दबाव बढ़ता है तथा प्रमुख दुश्मन अधिक बार आते हैं।', 'ब्लॉक शैली के सैनिक अलग प्रकार पहचानने में मदद करते हैं। गठन और क्षमताओं का समय खिलाड़ी तय करता है।'],
    ar: ['احمِ آ دو بتجنيد الجنود وتوزيعهم على ثلاثة مسارات. لا تترك مسارًا بلا دفاع عند الدمج.', 'تزيد المهمات اللاحقة متانة الأعداء وسرعتهم والضغط عبر المسارات، وتظهر الزعماء بوتيرة أكبر.', 'تساعد الشخصيات المكعبة على تمييز أنواع الجنود. يختار اللاعب التشكيل وتوقيت استخدام المهارات.'],
  };
  const registry = window.WeightPlayGeneralReviewedGuides;
  registry.en ||= {games: {}};
  registry.en.games ||= {};
  registry.en.games['zhao-yun-a-dou'] ||= {
    title: 'Zhao Yun & A Dou', gameplay: 'Merge strategy defense',
    difficulty: 'Progressive challenge', time: 'Short missions',
    genre: ['Strategy', 'Defense', 'Merge'], skills: ['Planning', 'Timing'],
    systems: ['Recruiting costs three buns and fills the first empty slot. Buns regenerate during combat.', '', 'Each slot belongs to one of three lanes. Soldiers attack automatically.', 'Merge two matching level-three soldiers to promote a general. Activate ready skills yourself.'],
    how: ['Choose an unlocked mission.', 'Recruit soldiers, then select matching units to merge.', 'Move a unit into an empty slot to reinforce its lane.', 'Defeat the waves and enemy command while keeping A Dou alive. Retry if his health reaches zero.'],
    strategyTips: ['Keep all three lanes defended before merging.', 'Save ready general skills for an approaching threat.'],
    progression: ['', 'Completed missions and best stars are saved in this browser.'],
    parent: 'Progress is stored locally in this browser.',
    faq: [['How do I promote a general?', 'Merge two matching level-three soldiers.'], ['Why did I lose after merging?', 'Merging can leave a lane undefended. Check your formation first.'], ['Is progress saved?', 'Completed missions and best stars are saved in this browser.']],
    related: [], hideRelatedGames: true,
  };
  for (const [locale, [mission, progression, designNote]] of Object.entries(details)) {
    const guide = window.WeightPlayGeneralReviewedGuides?.[locale]?.games?.['zhao-yun-a-dou'];
    const runtime = window.ZHAO_YUN_ADOU_LOCALES?.[locale];
    if (!guide || !runtime) throw new Error('ZHAO_PUBLIC_GUIDE_LOCALE_MISSING:' + locale);
    guide.intro = runtime.summary;
    guide.story = [mission];
    guide.systems[1] = runtime.guideBody;
    guide.progression[0] = progression;
    guide.designNote = designNote;
    // The obsolete character-symbol quiz is not part of the illustrated game.
    if (locale !== 'en') guide.faq = guide.faq.slice(1);
  }
  const labels = {
    en: ['Mission','How to play','Progression','Tips','Design','Saved progress','Questions'],
    'zh-Hant': ['任務','玩法','成長挑戰','技巧','設計','進度保存','常見問題'],
    'zh-Hans': ['任务','玩法','成长挑战','技巧','设计','进度保存','常见问题'],
    ja: ['任務','遊び方','進行','ヒント','設計','セーブ','よくある質問'],
    ko: ['임무','게임 방법','진행','팁','설계','저장','질문'],
    es: ['Misión','Cómo jugar','Progresión','Consejos','Diseño','Guardado','Preguntas'],
    'pt-BR': ['Missão','Como jogar','Progressão','Dicas','Design','Progresso salvo','Perguntas'],
    fr: ['Mission','Comment jouer','Progression','Conseils','Conception','Sauvegarde','Questions'],
    de: ['Auftrag','Spielanleitung','Fortschritt','Tipps','Design','Speicherung','Fragen'],
    it: ['Missione','Come giocare','Progressione','Consigli','Design','Salvataggio','Domande'],
    ru: ['Задача','Как играть','Прогресс','Советы','Дизайн','Сохранение','Вопросы'],
    hi: ['मिशन','कैसे खेलें','प्रगति','सुझाव','डिज़ाइन','सहेजी गई प्रगति','प्रश्न'],
    ar: ['المهمة','طريقة اللعب','التقدم','نصائح','التصميم','الحفظ','أسئلة'],
  };
  // Localized generation supplies the shared static guide surface; hydrate
  // that existing surface instead of leaving duplicate guides on the page.
  const root = document.getElementById('mainGuide') || document.querySelector('.game-page-info');
  if (!root) throw new Error('ZHAO_GUIDE_SURFACE_MISSING');
  root.id = 'mainGuide';
  root.dataset.wpGameGuide = '';
  const localeSelect = document.getElementById('locale');
  const node = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  };
  const visibility = () => { root.hidden = document.body.dataset.screen !== 'main'; };
  function render() {
    const locale = localeSelect.value;
    const guide = registry[locale]?.games?.['zhao-yun-a-dou'];
    if (!guide || !labels[locale]) throw new Error('ZHAO_GUIDE_RENDER_LOCALE:' + locale);
    root.replaceChildren();
    root.lang = locale; root.dir = locale === 'ar' ? 'rtl' : 'ltr';
    root.append(node('h2', window.ZHAO_YUN_ADOU_LOCALES[locale].guideTitle));
    const sections = [guide.story, [...guide.systems, guide.how[2], guide.how.at(-1)], guide.progression, guide.strategyTips, [guide.designNote], [guide.parent]];
    const grid = node('div', '', 'game-info-sections');
    sections.forEach((lines, i) => {
      const article = node('article', '', 'game-info-section');
      article.append(node('h3', labels[locale][i]));
      lines.forEach(line => article.append(node('p', line)));
      grid.append(article);
    });
    const faq = node('article', '', 'game-info-section');
    faq.append(node('h3', labels[locale][6]));
    guide.faq.forEach(([question, answer]) => {
      const detail = node('details');
      detail.append(node('summary', question), node('p', answer));
      faq.append(detail);
    });
    grid.append(faq); root.append(grid); visibility();
  }
  const observer = new MutationObserver(visibility);
  observer.observe(document.body, {attributes: true, attributeFilter: ['data-screen']});
  localeSelect.addEventListener('change', render);
  window.addEventListener('pagehide', event => {
    if (!event.persisted) { observer.disconnect(); localeSelect.removeEventListener('change', render); }
  });
  render();
})();
