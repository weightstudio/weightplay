export const VERSION = '1.4.0';
export const RELATED = [
  { id: 'animal-color-springs', image: '/assets/animal-color-springs/cover-block-v1.png' },
  { id: 'animal-color-link', image: '/assets/animal-color-link/cover-block-v1.png' },
];

export const ROUTES = {
  en: 'en', 'zh-Hant': 'zh-tw', 'zh-Hans': 'zh-cn', ja: 'ja', ko: 'ko', es: 'es',
  'pt-BR': 'pt-br', fr: 'fr', de: 'de', it: 'it', ru: 'ru', hi: 'hi', ar: 'ar',
};

export const COPY = {
  en: {
    tags: ['Color sorting', 'Hex stacking', 'Chain planning'],
    relatedTitle: 'Related Games',
    relatedIntro: 'Keep planning color and space with these WeightPlay puzzles:',
    related: {
      'animal-color-springs': 'Sort colored runs between vessels across 30 staged puzzles with changing capacities, seals, and move goals.',
      'animal-color-link': 'Connect matching colors without crossing and fill each garden, with Hint, Undo, and Reset across 30 puzzles.',
    },

    shell: { loading:'Preparing the stacks…', back:'Back to WeightPlay', language:'Language', endless:'Endless · Best 0', guideAria:'Hexa Sort game guide', stageNav:'Stage navigation', board:'Hex stack board', tray:'Stack tray' },
  },
  'zh-Hant': {
    tags: ['顏色分類', '六角堆疊', '連鎖規劃'], relatedTitle:'相關遊戲', relatedIntro:'想繼續練習顏色與空間規劃，可以試試這些 WeightPlay 益智遊戲：',
    related:{'animal-color-springs':'在 30 個關卡中整理泉器裡的彩珠，面對容量、封印與步數目標的變化。','animal-color-link':'連接相同顏色且不能交叉，填滿 30 座花園，並使用提示、復原與重設調整路線。'},

    shell:{loading:'正在準備堆疊…',back:'返回 WeightPlay',language:'語言',endless:'無盡模式 · 最佳 0',guideAria:'六角堆疊遊戲指南',stageNav:'關卡導覽',board:'六角堆疊盤面',tray:'堆疊托盤'},
  },
  'zh-Hans': {
    tags:['颜色分类','六角堆叠','连锁规划'],relatedTitle:'相关游戏',relatedIntro:'想继续练习颜色与空间规划，可以试试这些 WeightPlay 益智游戏：',related:{'animal-color-springs':'在 30 个关卡中整理容器里的彩珠，应对容量、封印与步数目标变化。','animal-color-link':'连接相同颜色且不能交叉，填满 30 座花园，并用提示、撤销与重置调整路线。'},shell:{loading:'正在准备堆叠…',back:'返回 WeightPlay',language:'语言',endless:'无尽模式 · 最佳 0',guideAria:'六角堆叠游戏指南',stageNav:'关卡导航',board:'六角堆叠棋盘',tray:'堆叠托盘'}},
  ja: {tags:['カラー分類','六角スタック','連鎖計画'],relatedTitle:'関連ゲーム',relatedIntro:'色と空間の計画を続けたいなら、次の WeightPlay パズルもどうぞ：',related:{'animal-color-springs':'容量・封印・手数目標が変化する30問で、器の色玉を整理します。','animal-color-link':'同じ色を交差させずにつなぎ、30の庭を埋めます。ヒント・元に戻す・リセットも使えます。'},shell:{loading:'スタックを準備中…',back:'WeightPlay に戻る',language:'言語',endless:'エンドレス · ベスト 0',guideAria:'ヘキサソート ゲームガイド',stageNav:'ステージナビゲーション',board:'六角スタック盤面',tray:'スタックトレイ'}},
  ko: {tags:['색상 분류','육각 스택','연쇄 계획'],relatedTitle:'관련 게임',relatedIntro:'색상과 공간 계획을 더 즐기고 싶다면 다음 WeightPlay 퍼즐을 해 보세요:',related:{'animal-color-springs':'용량, 봉인, 이동 목표가 달라지는 30개 퍼즐에서 용기 속 색 구슬을 정리하세요.','animal-color-link':'같은 색을 교차 없이 연결해 30개 정원을 채우고 힌트, 실행 취소, 초기화를 활용하세요.'},shell:{loading:'스택을 준비하는 중…',back:'WeightPlay로 돌아가기',language:'언어',endless:'엔들리스 · 최고 0',guideAria:'헥사 정렬 게임 가이드',stageNav:'스테이지 탐색',board:'육각 스택 보드',tray:'스택 트레이'}},
  es: {tags:['Clasificación por color','Pilas hexagonales','Planificación de cadenas'],relatedTitle:'Juegos relacionados',relatedIntro:'Sigue practicando color y espacio con estos puzles de WeightPlay:',related:{'animal-color-springs':'Ordena grupos de colores entre recipientes en 30 puzles con capacidades, sellos y objetivos de movimientos cambiantes.','animal-color-link':'Conecta colores iguales sin cruzar caminos y llena 30 jardines con Pista, Deshacer y Reiniciar.'},shell:{loading:'Preparando las pilas…',back:'Volver a WeightPlay',language:'Idioma',endless:'Sin fin · Récord 0',guideAria:'Guía de Hexa Sort',stageNav:'Navegación de niveles',board:'Tablero de pilas hexagonales',tray:'Bandeja de pilas'}},
  'pt-BR': {tags:['Classificação por cor','Pilhas hexagonais','Planejamento de cadeias'],relatedTitle:'Jogos relacionados',relatedIntro:'Continue planejando cores e espaço com estes quebra-cabeças da WeightPlay:',related:{'animal-color-springs':'Organize grupos de cores entre recipientes em 30 fases com capacidades, selos e metas de jogadas variáveis.','animal-color-link':'Ligue cores iguais sem cruzar caminhos e preencha 30 jardins com Dica, Desfazer e Reiniciar.'},shell:{loading:'Preparando as pilhas…',back:'Voltar à WeightPlay',language:'Idioma',endless:'Sem fim · Melhor 0',guideAria:'Guia do Hexa Sort',stageNav:'Navegação de fases',board:'Tabuleiro de pilhas hexagonais',tray:'Bandeja de pilhas'}},
  fr: {tags:['Tri par couleur','Piles hexagonales','Planification de chaînes'],relatedTitle:'Jeux associés',relatedIntro:'Continuez à planifier couleurs et espace avec ces puzzles WeightPlay :',related:{'animal-color-springs':'Triez des groupes colorés entre des récipients dans 30 puzzles aux capacités, sceaux et objectifs de coups variables.','animal-color-link':'Reliez les couleurs identiques sans croiser les chemins et remplissez 30 jardins avec Indice, Annuler et Réinitialiser.'},shell:{loading:'Préparation des piles…',back:'Retour à WeightPlay',language:'Langue',endless:'Sans fin · Meilleur 0',guideAria:'Guide de jeu Hexa Sort',stageNav:'Navigation des niveaux',board:'Plateau de piles hexagonales',tray:'Bac de piles'}},
  de: {tags:['Farbsortierung','Hex-Stapel','Kettenplanung'],relatedTitle:'Ähnliche Spiele',relatedIntro:'Plane Farben und Platz mit diesen WeightPlay-Rätseln weiter:',related:{'animal-color-springs':'Sortiere Farbreihen zwischen Gefäßen in 30 Rätseln mit wechselnden Kapazitäten, Siegeln und Zugzielen.','animal-color-link':'Verbinde gleiche Farben ohne Kreuzungen und fülle 30 Gärten mit Hinweis, Rückgängig und Neustart.'},shell:{loading:'Stapel werden vorbereitet…',back:'Zurück zu WeightPlay',language:'Sprache',endless:'Endlos · Bestwert 0',guideAria:'Hexa-Sort-Spielanleitung',stageNav:'Stufennavigation',board:'Hex-Stapel-Spielfeld',tray:'Stapelablage'}},
  it: {tags:['Ordinamento colori','Pile esagonali','Pianificazione catene'],relatedTitle:'Giochi correlati',relatedIntro:'Continua a pianificare colori e spazio con questi puzzle WeightPlay:',related:{'animal-color-springs':'Ordina gruppi di colore tra recipienti in 30 puzzle con capacità, sigilli e obiettivi di mosse variabili.','animal-color-link':'Collega i colori uguali senza incrociare i percorsi e riempi 30 giardini con Suggerimento, Annulla e Ripristina.'},shell:{loading:'Preparazione delle pile…',back:'Torna a WeightPlay',language:'Lingua',endless:'Senza fine · Migliore 0',guideAria:'Guida di Hexa Sort',stageNav:'Navigazione livelli',board:'Tabellone di pile esagonali',tray:'Vassoio delle pile'}},
  ru: {tags:['Сортировка цветов','Шестиугольные стопки','Планирование цепочек'],relatedTitle:'Похожие игры',relatedIntro:'Продолжайте планировать цвет и пространство в этих головоломках WeightPlay:',related:{'animal-color-springs':'Сортируйте цветные группы между сосудами в 30 задачах с меняющейся вместимостью, печатями и лимитами ходов.','animal-color-link':'Соединяйте одинаковые цвета без пересечений и заполняйте 30 садов, используя подсказку, отмену и сброс.'},shell:{loading:'Подготовка стопок…',back:'Вернуться в WeightPlay',language:'Язык',endless:'Бесконечно · Рекорд 0',guideAria:'Руководство по Hexa Sort',stageNav:'Навигация по этапам',board:'Поле шестиугольных стопок',tray:'Лоток стопок'}},
  hi: {tags:['रंग छँटाई','हेक्स स्टैक','श्रृंखला योजना'],relatedTitle:'संबंधित गेम',relatedIntro:'इन WeightPlay पहेलियों में रंग और जगह की योजना जारी रखें:',related:{'animal-color-springs':'बदलती क्षमता, सील और चाल लक्ष्यों वाली 30 पहेलियों में पात्रों के बीच रंगीन समूहों को छाँटें।','animal-color-link':'समान रंगों को बिना रास्ते काटे जोड़ें और संकेत, पूर्ववत व रीसेट के साथ 30 बगीचे भरें।'},shell:{loading:'स्टैक तैयार हो रहे हैं…',back:'WeightPlay पर वापस जाएँ',language:'भाषा',endless:'अनंत · सर्वश्रेष्ठ 0',guideAria:'Hexa Sort गेम गाइड',stageNav:'स्टेज नेविगेशन',board:'हेक्स स्टैक बोर्ड',tray:'स्टैक ट्रे'}},
  ar: {tags:['فرز الألوان','تكديس سداسي','تخطيط السلاسل'],relatedTitle:'ألعاب ذات صلة',relatedIntro:'واصل التخطيط للألوان والمساحة مع ألغاز WeightPlay التالية:',related:{'animal-color-springs':'افرز مجموعات الألوان بين الأوعية عبر 30 لغزًا تتغير فيها السعة والأختام وأهداف الحركات.','animal-color-link':'صل الألوان المتطابقة من دون تقاطع واملأ 30 حديقة مع التلميح والتراجع وإعادة الضبط.'},shell:{loading:'جارٍ تجهيز الأكوام…',back:'العودة إلى WeightPlay',language:'اللغة',endless:'بلا نهاية · الأفضل 0',guideAria:'دليل لعبة Hexa Sort',stageNav:'التنقل بين المراحل',board:'لوحة الأكوام السداسية',tray:'صينية الأكوام'}},
};
