(() => {
  'use strict';

  const COPY = Object.freeze({
    en: {
      title: 'Similar tower-defense reference',
      body: 'Kingdom Rush Vengeance and Fantasy Lion Defense both ask players to survive enemy waves, adapt a defensive build, and prepare for boss encounters. Ironhide’s game builds its defense around an army and 16 switchable tower options across a campaign with supreme bosses. Fantasy Lion Defense instead keeps one movable lion on a single wall: three equipped school-supply weapons fire on separate cooldowns, the player repositions Leo, chooses temporary upgrades between waves, uses Roar, Pride Volley, and Wall Aegis, and works through 30 authored browser stages with local progress.',
      disclaimer: 'Fantasy Lion Defense is an independent WeightPlay original, not an official Kingdom Rush Vengeance version. WeightPlay is not affiliated with, endorsed by, licensed by, or jointly developing the game with Ironhide Game Studio.',
      source: 'Official source:'
    },
    'zh-Hant': {
      title: '相似塔防玩法參考',
      body: '《Kingdom Rush Vengeance》與《奇幻獅子防衛》都要求玩家撐過一波波敵人、調整防守配置，並為頭目戰做準備。Ironhide 的作品以軍隊與 16 種可切換塔台為防守核心，戰役中還會迎戰強力頭目；《奇幻獅子防衛》則把焦點放在單一道城牆上的可移動獅子雷歐：三件文具武器各自依冷卻自動射擊，玩家要移動雷歐、在波次間挑選臨時升級，並運用獅吼、榮耀齊射與城牆神盾，完成 30 個固定設計的瀏覽器關卡與本機進度。',
      disclaimer: '《奇幻獅子防衛》是 WeightPlay 的獨立原創作品，並非《Kingdom Rush Vengeance》官方版本。WeightPlay 與 Ironhide Game Studio 沒有隸屬、背書、授權或共同開發關係。',
      source: '官方來源：'
    },
    'zh-Hans': {
      title: '相似塔防玩法参考',
      body: '《Kingdom Rush Vengeance》与《奇幻狮子防卫》都要求玩家撑过一波波敌人、调整防守配置，并为头目战做准备。Ironhide 的作品以军队与 16 种可切换塔台为防守核心，战役中还会迎战强力头目；《奇幻狮子防卫》则把重点放在单一道城墙上的可移动狮子雷欧：三件文具武器各自按冷却自动射击，玩家要移动雷欧、在波次间挑选临时升级，并运用狮吼、荣耀齐射与城墙神盾，完成 30 个固定设计的浏览器关卡与本地进度。',
      disclaimer: '《奇幻狮子防卫》是 WeightPlay 的独立原创作品，并非《Kingdom Rush Vengeance》官方版本。WeightPlay 与 Ironhide Game Studio 没有隶属、背书、授权或共同开发关系。',
      source: '官方来源：'
    },
    ja: {
      title: '似たタワーディフェンス作品との比較',
      body: 'Kingdom Rush Vengeance と Fantasy Lion Defense は、どちらも敵のウェーブをしのぎ、防御構成を調整しながらボス戦に備えるゲームです。Ironhide の作品では、軍勢と切り替え可能な16種類のタワーを軸に防衛し、キャンペーンで強力なボスと戦います。Fantasy Lion Defense は代わりに、1本の城壁上を動くライオンのレオに集中します。3つの文房具武器が別々のクールダウンで自動射撃し、プレイヤーはレオの位置を変え、ウェーブ間で一時強化を選び、Roar、Pride Volley、Wall Aegis を使いながら、30個の手作りブラウザステージとローカル進行を攻略します。',
      disclaimer: 'Fantasy Lion Defense は WeightPlay の独立したオリジナル作品であり、Kingdom Rush Vengeance の公式版ではありません。WeightPlay は Ironhide Game Studio と提携、推薦、ライセンス、共同開発の関係にありません。',
      source: '公式情報：'
    },
    ko: {
      title: '비슷한 타워 디펜스 참고작',
      body: 'Kingdom Rush Vengeance와 Fantasy Lion Defense는 모두 적의 웨이브를 버티고 방어 구성을 조정하며 보스전을 준비하는 게임입니다. Ironhide의 작품은 군대와 교체 가능한 16종의 타워를 중심으로 방어하고 캠페인에서 강력한 보스와 맞섭니다. Fantasy Lion Defense는 대신 하나의 성벽 위를 움직이는 사자 레오에 집중합니다. 장착한 세 가지 문구 무기가 각자 쿨다운에 따라 자동 발사되고, 플레이어는 레오의 위치를 바꾸고 웨이브 사이에 임시 업그레이드를 선택하며 Roar, Pride Volley, Wall Aegis를 활용해 30개의 설계된 브라우저 스테이지와 로컬 진행을 완수합니다.',
      disclaimer: 'Fantasy Lion Defense는 WeightPlay의 독립 오리지널 작품이며 Kingdom Rush Vengeance의 공식 버전이 아닙니다. WeightPlay는 Ironhide Game Studio와 제휴, 보증, 라이선스 또는 공동 개발 관계가 없습니다.',
      source: '공식 출처:'
    },
    es: {
      title: 'Referencia de defensa de torres similar',
      body: 'Kingdom Rush Vengeance y Fantasy Lion Defense comparten la idea de resistir oleadas, ajustar la defensa y prepararse para encuentros con jefes. El juego de Ironhide basa la defensa en un ejército y 16 opciones de torres intercambiables a lo largo de una campaña con grandes jefes. Fantasy Lion Defense, en cambio, se centra en un solo león móvil sobre una muralla: tres armas de material escolar disparan automáticamente con enfriamientos separados, el jugador recoloca a Leo, elige mejoras temporales entre oleadas y usa Roar, Pride Volley y Wall Aegis a lo largo de 30 fases diseñadas para navegador con progreso local.',
      disclaimer: 'Fantasy Lion Defense es una obra original e independiente de WeightPlay, no una versión oficial de Kingdom Rush Vengeance. WeightPlay no está afiliado, respaldado, licenciado ni desarrolla conjuntamente el juego con Ironhide Game Studio.',
      source: 'Fuente oficial:'
    },
    'pt-BR': {
      title: 'Referência de tower defense semelhante',
      body: 'Kingdom Rush Vengeance e Fantasy Lion Defense compartilham a ideia de resistir a ondas de inimigos, ajustar a defesa e se preparar para confrontos com chefes. O jogo da Ironhide estrutura a defesa em torno de um exército e 16 opções de torres que podem ser alternadas durante uma campanha com grandes chefes. Fantasy Lion Defense, por outro lado, concentra tudo em um único leão móvel sobre uma muralha: três armas de material escolar disparam automaticamente com recargas separadas, o jogador reposiciona Leo, escolhe melhorias temporárias entre as ondas e usa Roar, Pride Volley e Wall Aegis ao longo de 30 fases autorais no navegador com progresso local.',
      disclaimer: 'Fantasy Lion Defense é uma obra original e independente da WeightPlay, não uma versão oficial de Kingdom Rush Vengeance. A WeightPlay não é afiliada, endossada, licenciada nem desenvolve o jogo em conjunto com a Ironhide Game Studio.',
      source: 'Fonte oficial:'
    },
    fr: {
      title: 'Référence de tower defense similaire',
      body: 'Kingdom Rush Vengeance et Fantasy Lion Defense demandent tous deux de résister à des vagues d’ennemis, d’adapter sa défense et de se préparer aux affrontements contre des boss. Le jeu d’Ironhide construit sa défense autour d’une armée et de 16 tours interchangeables au fil d’une campagne avec de puissants boss. Fantasy Lion Defense se concentre au contraire sur un seul lion mobile le long d’un rempart : trois armes de fournitures scolaires tirent automatiquement avec des temps de recharge séparés, le joueur replace Leo, choisit des améliorations temporaires entre les vagues et utilise Roar, Pride Volley et Wall Aegis dans 30 niveaux conçus pour le navigateur avec progression locale.',
      disclaimer: 'Fantasy Lion Defense est une création originale et indépendante de WeightPlay, et non une version officielle de Kingdom Rush Vengeance. WeightPlay n’est ni affilié à Ironhide Game Studio, ni approuvé ou licencié par celui-ci, et les deux sociétés ne développent pas le jeu ensemble.',
      source: 'Source officielle :'
    },
    de: {
      title: 'Vergleich mit einem ähnlichen Tower-Defense-Spiel',
      body: 'Kingdom Rush Vengeance und Fantasy Lion Defense verlangen beide, Gegnerwellen zu überstehen, die Verteidigung anzupassen und sich auf Bosskämpfe vorzubereiten. Ironhides Spiel baut die Verteidigung um eine Armee und 16 wechselbare Turmoptionen in einer Kampagne mit mächtigen Bossen auf. Fantasy Lion Defense konzentriert sich stattdessen auf einen einzigen beweglichen Löwen an einer Mauer: Drei ausgerüstete Schulmaterial-Waffen feuern mit getrennten Abklingzeiten automatisch, der Spieler positioniert Leo neu, wählt zwischen den Wellen temporäre Verbesserungen und setzt Roar, Pride Volley sowie Wall Aegis in 30 gestalteten Browser-Stufen mit lokalem Fortschritt ein.',
      disclaimer: 'Fantasy Lion Defense ist ein unabhängiges Original von WeightPlay und keine offizielle Version von Kingdom Rush Vengeance. WeightPlay ist nicht mit Ironhide Game Studio verbunden, wird nicht von ihm unterstützt oder lizenziert und entwickelt das Spiel nicht gemeinsam mit ihm.',
      source: 'Offizielle Quelle:'
    },
    it: {
      title: 'Riferimento a un tower defense simile',
      body: 'Kingdom Rush Vengeance e Fantasy Lion Defense chiedono entrambi di resistere a ondate di nemici, adattare la difesa e prepararsi agli scontri con i boss. Il gioco di Ironhide costruisce la difesa attorno a un esercito e a 16 opzioni di torri intercambiabili lungo una campagna con potenti boss. Fantasy Lion Defense si concentra invece su un solo leone mobile lungo un muro: tre armi scolastiche equipaggiate sparano automaticamente con tempi di recupero separati, il giocatore riposiziona Leo, sceglie potenziamenti temporanei tra le ondate e usa Roar, Pride Volley e Wall Aegis in 30 livelli progettati per browser con progressi locali.',
      disclaimer: 'Fantasy Lion Defense è un’opera originale e indipendente di WeightPlay, non una versione ufficiale di Kingdom Rush Vengeance. WeightPlay non è affiliata, approvata o autorizzata da Ironhide Game Studio e non sviluppa il gioco congiuntamente con essa.',
      source: 'Fonte ufficiale:'
    },
    ru: {
      title: 'Сравнение с похожей tower defense',
      body: 'Kingdom Rush Vengeance и Fantasy Lion Defense предлагают выдерживать волны врагов, менять оборонительную стратегию и готовиться к боям с боссами. В игре Ironhide защита строится вокруг армии и 16 сменяемых вариантов башен в кампании с сильными боссами. Fantasy Lion Defense вместо этого сосредоточена на одном подвижном льве у стены: три экипированных канцелярских оружия стреляют автоматически с отдельными перезарядками, игрок меняет позицию Лео, выбирает временные улучшения между волнами и применяет Roar, Pride Volley и Wall Aegis в 30 вручную спроектированных браузерных этапах с локальным прогрессом.',
      disclaimer: 'Fantasy Lion Defense — независимая оригинальная игра WeightPlay, а не официальная версия Kingdom Rush Vengeance. WeightPlay не связана с Ironhide Game Studio, не получила от неё одобрения или лицензии и не занимается совместной разработкой этой игры.',
      source: 'Официальный источник:'
    },
    hi: {
      title: 'मिलते-जुलते टावर डिफेंस खेल का संदर्भ',
      body: 'Kingdom Rush Vengeance और Fantasy Lion Defense दोनों में दुश्मनों की लहरों को रोकना, रक्षा रणनीति बदलना और बॉस मुकाबलों की तैयारी करना मुख्य निर्णय हैं। Ironhide के खेल में रक्षा सेना और 16 बदली जा सकने वाली टावर विकल्पों पर आधारित है और अभियान में शक्तिशाली बॉस आते हैं। Fantasy Lion Defense इसके बजाय एक ही दीवार पर चलने वाले सिंह Leo पर केंद्रित है: तीन सुसज्जित स्कूल-सप्लाई हथियार अलग-अलग कूलडाउन पर अपने आप गोली चलाते हैं, खिलाड़ी Leo की जगह बदलता है, लहरों के बीच अस्थायी अपग्रेड चुनता है और Roar, Pride Volley तथा Wall Aegis का उपयोग करते हुए 30 तैयार किए गए ब्राउज़र चरणों और स्थानीय प्रगति को पूरा करता है।',
      disclaimer: 'Fantasy Lion Defense WeightPlay की स्वतंत्र मूल रचना है, Kingdom Rush Vengeance का आधिकारिक संस्करण नहीं। WeightPlay का Ironhide Game Studio से कोई संबद्धता, समर्थन, लाइसेंस या संयुक्त विकास संबंध नहीं है।',
      source: 'आधिकारिक स्रोत:'
    },
    ar: {
      title: 'مرجع للعبة دفاع أبراج مشابهة',
      body: 'تشترك Kingdom Rush Vengeance وFantasy Lion Defense في صد موجات الأعداء وتعديل خطة الدفاع والاستعداد لمواجهات الزعماء. تعتمد لعبة Ironhide على جيش و16 خيارًا من الأبراج القابلة للتبديل ضمن حملة تضم زعماء أقوياء. أما Fantasy Lion Defense فتركز على أسد واحد متحرك على طول جدار: تطلق ثلاثة أسلحة مدرسية مجهزة تلقائيًا وفق فترات تبريد منفصلة، ويعيد اللاعب تموضع Leo ويختار ترقيات مؤقتة بين الموجات ويستخدم Roar وPride Volley وWall Aegis عبر 30 مرحلة مصممة للمتصفح مع تقدم محفوظ محليًا.',
      disclaimer: 'Fantasy Lion Defense عمل أصلي مستقل من WeightPlay وليست إصدارًا رسميًا من Kingdom Rush Vengeance. لا توجد علاقة تبعية أو تأييد أو ترخيص أو تطوير مشترك بين WeightPlay وIronhide Game Studio.',
      source: 'المصدر الرسمي:'
    }
  });

  const normalizeLocale = (value) => {
    const key = String(value || '').replace('_', '-');
    const lower = key.toLowerCase();
    if (lower === 'zh-tw' || lower === 'zh-hant') return 'zh-Hant';
    if (lower === 'zh-cn' || lower === 'zh-hans') return 'zh-Hans';
    if (lower === 'pt-br') return 'pt-BR';
    if (COPY[key]) return key;
    if (COPY[lower]) return lower;
    return 'en';
  };

  const apply = (locale) => {
    const root = document.querySelector('[data-wonder-market-comparison="1.3.0"]');
    if (!root) return;
    const activeLocale = normalizeLocale(locale || document.documentElement.lang);
    const value = COPY[activeLocale] || COPY.en;
    const titleCatalog = window.WEIGHTPLAY_GAME_TITLES?.['wonder-crash'];
    const ownTitle = titleCatalog?.[activeLocale] || titleCatalog?.en || 'Fantasy Lion Defense';
    const normalizeOwnTitle = (text) => ['Fantasy Lion Defense', '奇幻獅子防衛', '奇幻狮子防卫'].reduce((out, alias) => out.replaceAll(alias, ownTitle), String(text || ''));
    root.dataset.comparisonLocale = activeLocale;
    const title = root.querySelector('[data-wonder-compare="title"]');
    const body = root.querySelector('[data-wonder-compare="body"]');
    const disclaimer = root.querySelector('[data-wonder-compare="disclaimer"]');
    const source = root.querySelector('[data-wonder-compare="source"]');
    if (title) title.textContent = value.title;
    if (body) body.textContent = normalizeOwnTitle(value.body);
    if (disclaimer) disclaimer.textContent = normalizeOwnTitle(value.disclaimer);
    if (source) source.textContent = value.source;
  };

  const bind = () => {
    apply(document.documentElement.lang);
    document.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      if (!['wonderMainLocaleSelect', 'globalLocaleSelect', 'pauseLocaleSelect'].includes(target.id)) return;
      apply(target.value);
    });
  };

  window.WonderCrashMarketComparison = Object.freeze({ apply, copy: COPY });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
