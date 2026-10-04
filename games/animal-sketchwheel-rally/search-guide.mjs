const COPY = {
  en: {
    intro: "Draw a wheel for the next terrain, read how its measured shape changes the race, and redraw when the route changes. Sketchwheel Rally turns wheel geometry into a choice between momentum and control.",
    tagsLabel: "Gameplay tags:", tags: ["Drawn-Wheel Racing", "Wheel Physics", "Terrain Strategy"],
    faq: [
      ["How many races are in Sketchwheel Rally?", "There are 30 authored races across six chapters, with five races in each chapter."],
      ["What wheel works on ice?", "Use a grippy profile: the game checks grip for ice. A smooth round wheel is not automatically the best match."],
      ["Where is my progress saved?", "Race clears, bolts, upgrades, lens state, and best times are saved in this browser. They do not sync to another browser or device."],
    ],
    terrain: "A round wheel clears flat road; stairs need height; mud and ice need grip; tunnels and gaps check width; extra speed improves performance only after a gap is cleared; wind checks for a narrow wheel.",
    terrainPattern: /gaps?/i,
    speedPattern: /speed/i,
    description: "Draw and test wheels in 30 races. Match roundness to flat roads, height to stairs, grip to mud and ice, and width to tunnels and gaps. Speed improves performance after a gap is cleared.",
    genre: ["Drawn-Wheel Racing", "Wheel Physics", "Terrain Strategy"],
  },
  "zh-Hant": { intro: "為前方地形畫出車輪，觀察形狀測量值如何影響競速，並在路線改變時重新繪製。繪輪競速把輪型幾何變成速度與操控的取捨。", tagsLabel: "玩法標籤：", tags: ["繪輪競速", "車輪物理", "地形策略"], terrain: "平路檢查圓度；階梯需要高度；泥地與冰面需要抓地力；隧道與缺口會檢查寬度；通過缺口後，速度才會影響表現；側風則檢查車輪是否夠窄。", terrainPattern: /缺口/, speedPattern: /速度/, faq: [["繪輪競速共有幾場？", "共有六章、每章五場，合計三十場預先設計的競速。"], ["冰面適合什麼車輪？", "選擇抓地力較高的輪型；遊戲會檢查冰面所需的抓地力，平滑圓輪不一定適合。"], ["進度存在哪裡？", "過關紀錄、螺栓、升級、鏡片狀態與最佳時間保存在目前瀏覽器，不會同步到其他瀏覽器或裝置。"]], description: "畫出車輪並挑戰三十場競速：平路看圓度、階梯看高度、泥地與冰面看抓地力，隧道與缺口會檢查寬度；通過缺口後，速度才影響表現。", genre: ["繪輪競速", "車輪物理", "地形策略"] },
  "zh-Hans": { intro: "为前方地形画出车轮，观察形状测量值如何影响竞速，并在路线改变时重新绘制。绘轮竞速把轮型几何变成速度与操控的取舍。", tagsLabel: "玩法标签：", tags: ["绘轮竞速", "车轮物理", "地形策略"], terrain: "平路检查圆度；阶梯需要高度；泥地和冰面需要抓地力；隧道和缺口会检查宽度；通过缺口后，速度才会影响表现；侧风则检查车轮是否够窄。", terrainPattern: /缺口/, speedPattern: /速度/, faq: [["绘轮竞速共有几场？", "共有六章、每章五场，合计三十场预先设计的竞速。"], ["冰面适合什么车轮？", "选择抓地力较高的轮型；游戏会检查冰面所需的抓地力，平滑圆轮不一定适合。"], ["进度保存在哪里？", "通关记录、螺栓、升级、镜片状态与最佳时间保存在当前浏览器，不会同步到其他浏览器或设备。"]], description: "画出车轮并挑战三十场竞速：平路看圆度、阶梯看高度、泥地与冰面看抓地力，隧道与缺口会检查宽度；通过缺口后，速度才影响表现。", genre: ["绘轮竞速", "车轮物理", "地形策略"] },
  ja: { intro: "次の地形に合わせて車輪を描き、測定された形がレースに与える影響を見て、コースが変わったら描き直します。車輪の形を速度と安定性の選択につなげるラリーです。", tagsLabel: "ゲームプレイタグ：", tags: ["描画ホイールレース", "車輪の物理", "地形戦略"], terrain: "平地では丸さ、階段では高さ、泥と氷ではグリップを確認します。トンネルと隙間では幅が条件になり、隙間を越えた後は速度が走行評価に影響します。横風には細い車輪が向いています。", terrainPattern: /隙間|すき間|段差/, speedPattern: /速度/, faq: [["レースはいくつありますか？", "全6章、各章5レースの合計30コースです。"], ["氷ではどんな車輪が向いていますか？", "グリップを重視した形です。氷ではグリップが判定されるため、滑らかな円形が常に最適とは限りません。"], ["進行状況はどこに保存されますか？", "クリア、ボルト、アップグレード、レンズ状態、ベストタイムはこのブラウザーに保存され、別の端末とは同期しません。"]], description: "車輪を描いて30レースに挑戦。平地では丸さ、階段では高さ、泥と氷ではグリップ、トンネルや隙間では幅を調整。隙間を越えた後は速度が走行評価に影響します。", genre: ["描画ホイールレース", "車輪の物理", "地形戦略"] },
  ko: { intro: "다음 지형에 맞춰 바퀴를 그리고, 측정된 모양이 경주에 주는 영향을 살핀 뒤 코스가 바뀌면 다시 그려 보세요. 바퀴 형태를 속도와 안정성의 선택으로 연결하는 랠리입니다.", tagsLabel: "게임플레이 태그:", tags: ["그린 바퀴 레이싱", "바퀴 물리", "지형 전략"], faq: [["경주는 몇 개 있나요?", "6개 챕터에 각 5개씩, 총 30개의 직접 구성된 경주가 있습니다."], ["얼음 지형에는 어떤 바퀴가 맞나요?", "접지력을 높인 형태를 사용하세요. 얼음은 접지력을 검사하므로 매끈한 원형이 항상 최선은 아닙니다."], ["진행 상황은 어디에 저장되나요?", "클리어, 볼트, 업그레이드, 렌즈 상태와 최고 기록은 현재 브라우저에 저장되며 다른 기기와 동기화되지 않습니다."]], description: "바퀴를 그려 30개 경주에 도전하세요. 계단, 진흙, 터널, 틈, 얼음, 바람에 맞춰 높이·폭·접지력을 조절해 상대보다 먼저 결승선에 도달하세요.", genre: ["그린 바퀴 레이싱", "바퀴 물리", "지형 전략"] },
  es: { intro: "Dibuja una rueda para el siguiente terreno, observa cómo sus medidas cambian la carrera y vuelve a dibujar cuando cambie la ruta. Aquí la geometría de la rueda decide entre impulso y control.", tagsLabel: "Etiquetas de juego:", tags: ["Carreras con ruedas dibujadas", "Física de ruedas", "Estrategia de terreno"], faq: [["¿Cuántas carreras hay?", "Hay 30 carreras diseñadas, repartidas en seis capítulos de cinco carreras."], ["¿Qué rueda conviene para el hielo?", "Elige un perfil con agarre: el juego comprueba el agarre en el hielo. Una rueda lisa y redonda no siempre es la mejor opción."], ["¿Dónde se guarda mi progreso?", "Las victorias, los pernos, las mejoras, el estado de la lente y los mejores tiempos se guardan en este navegador; no se sincronizan con otros dispositivos."]], description: "Dibuja ruedas y pruébalas en 30 carreras. Ajusta altura, anchura y agarre para escaleras, barro, túneles, huecos, hielo y viento antes de que llegue tu rival.", genre: ["Carreras con ruedas dibujadas", "Física de ruedas", "Estrategia de terreno"] },
  "pt-BR": { intro: "Desenhe uma roda para o próximo terreno, observe como as medidas mudam a corrida e redesenhe quando a rota mudar. Aqui, o formato da roda cria escolhas entre impulso e controle.", tagsLabel: "Tags de gameplay:", tags: ["Corrida com rodas desenhadas", "Física das rodas", "Estratégia de terreno"], faq: [["Quantas corridas existem?", "São 30 corridas criadas para o jogo, em seis capítulos com cinco corridas cada."], ["Que roda funciona no gelo?", "Use um perfil com boa aderência: o jogo verifica a aderência no gelo. Uma roda lisa e redonda não é sempre a melhor escolha."], ["Onde meu progresso fica salvo?", "Vitórias, parafusos, melhorias, estado da lente e melhores tempos ficam salvos neste navegador e não são sincronizados com outros dispositivos."]], description: "Desenhe rodas e teste-as em 30 corridas. Ajuste altura, largura e aderência para escadas, lama, túneis, vãos, gelo e vento antes que o rival chegue à linha de chegada.", genre: ["Corrida com rodas desenhadas", "Física das rodas", "Estratégia de terreno"] },
  fr: { intro: "Dessinez une roue pour le prochain terrain, observez l’effet de ses mesures sur la course, puis recommencez lorsque le parcours change. La forme de la roue impose un choix entre élan et contrôle.", tagsLabel: "Tags de jeu :", tags: ["Course de roues dessinées", "Physique des roues", "Stratégie de terrain"], faq: [["Combien de courses sont proposées ?", "Il y a 30 courses conçues pour le jeu, réparties en six chapitres de cinq courses."], ["Quelle roue choisir sur la glace ?", "Privilégiez l’adhérence : le jeu la vérifie sur la glace. Une roue lisse et ronde n’est pas toujours le bon choix."], ["Où ma progression est-elle enregistrée ?", "Les victoires, boulons, améliorations, état de la lentille et meilleurs temps sont enregistrés dans ce navigateur, sans synchronisation entre appareils."]], description: "Dessinez des roues et testez-les sur 30 courses. Ajustez hauteur, largeur et adhérence pour les escaliers, la boue, les tunnels, les fossés, la glace et le vent avant votre rival.", genre: ["Course de roues dessinées", "Physique des roues", "Stratégie de terrain"] },
  de: { intro: "Zeichne ein Rad für den nächsten Untergrund, beobachte, wie seine Messwerte das Rennen verändern, und zeichne bei einem Streckenwechsel neu. Die Radform entscheidet zwischen Schwung und Kontrolle.", tagsLabel: "Gameplay-Tags:", tags: ["Rennen mit gezeichneten Rädern", "Radphysik", "Geländestrategie"], faq: [["Wie viele Rennen gibt es?", "Es gibt 30 gestaltete Rennen in sechs Kapiteln mit je fünf Rennen."], ["Welches Rad eignet sich für Eis?", "Wähle ein Profil mit viel Grip: Auf Eis prüft das Spiel die Haftung. Ein glattes rundes Rad passt nicht automatisch am besten."], ["Wo wird mein Fortschritt gespeichert?", "Siege, Bolzen, Verbesserungen, Linsenstatus und Bestzeiten werden in diesem Browser gespeichert und nicht mit anderen Geräten synchronisiert."]], description: "Zeichne Räder und teste sie in 30 Rennen. Passe Höhe, Breite und Grip an Treppen, Matsch, Tunnel, Lücken, Eis und Wind an, bevor dein Rivale das Ziel erreicht.", genre: ["Rennen mit gezeichneten Rädern", "Radphysik", "Geländestrategie"] },
  it: { intro: "Disegna una ruota per il terreno successivo, osserva come le sue misure cambiano la gara e ridisegnala quando cambia il percorso. La forma della ruota crea un equilibrio tra slancio e controllo.", tagsLabel: "Tag di gioco:", tags: ["Gare con ruote disegnate", "Fisica delle ruote", "Strategia del terreno"], faq: [["Quante gare ci sono?", "Ci sono 30 gare progettate, divise in sei capitoli da cinque gare ciascuno."], ["Quale ruota usare sul ghiaccio?", "Scegli un profilo con buona aderenza: sul ghiaccio il gioco controlla la presa. Una ruota liscia e rotonda non è sempre la scelta migliore."], ["Dove viene salvato il mio progresso?", "Vittorie, bulloni, potenziamenti, stato della lente e tempi migliori restano in questo browser e non si sincronizzano con altri dispositivi."]], description: "Disegna ruote e provale in 30 gare. Regola altezza, larghezza e aderenza per scale, fango, tunnel, varchi, ghiaccio e vento prima del rivale.", genre: ["Gare con ruote disegnate", "Fisica delle ruote", "Strategia del terreno"] },
  ru: { intro: "Нарисуйте колесо для следующего участка, посмотрите, как его параметры меняют гонку, и перерисуйте его при смене трассы. Форма колеса помогает выбрать между скоростью и контролем.", tagsLabel: "Теги игрового процесса:", tags: ["Гонки на рисованных колёсах", "Физика колёс", "Тактика рельефа"], faq: [["Сколько гонок доступно?", "В игре 30 созданных трасс: шесть глав по пять гонок."], ["Какое колесо подходит для льда?", "Выберите профиль с хорошим сцеплением: на льду игра проверяет именно его. Гладкое круглое колесо подходит не всегда."], ["Где сохраняется прогресс?", "Победы, болты, улучшения, состояние линзы и лучшие времена сохраняются в этом браузере и не синхронизируются с другими устройствами."]], description: "Рисуйте колёса и проверяйте их на 30 трассах. Меняйте высоту, ширину и сцепление для лестниц, грязи, туннелей, разрывов, льда и ветра, чтобы опередить соперника.", genre: ["Гонки на рисованных колёсах", "Физика колёс", "Тактика рельефа"] },
  hi: { intro: "अगले भूभाग के लिए पहिया बनाएं, देखें कि उसके माप रेस को कैसे बदलते हैं, और रास्ता बदलने पर फिर बनाएं। पहिए का आकार गति और नियंत्रण के बीच चुनाव बनाता है।", tagsLabel: "गेमप्ले टैग:", tags: ["बनाए पहियों की रेस", "पहिया भौतिकी", "भूभाग रणनीति"], faq: [["कितनी रेस हैं?", "छह अध्यायों में पाँच-पाँच, कुल 30 बनाई गई रेस हैं।"], ["बर्फ पर कौन-सा पहिया सही है?", "अच्छी पकड़ वाला आकार चुनें: बर्फ पर खेल पकड़ की जाँच करता है। चिकना गोल पहिया हमेशा सही नहीं होता।"], ["मेरी प्रगति कहाँ सहेजी जाती है?", "जीत, बोल्ट, अपग्रेड, लेंस स्थिति और सर्वश्रेष्ठ समय इसी ब्राउज़र में रहते हैं; दूसरे उपकरणों से सिंक नहीं होते।"]], description: "पहिए बनाएं और 30 रेस में परखें। सीढ़ियों, कीचड़, सुरंग, दरार, बर्फ और हवा के लिए ऊंचाई, चौड़ाई और पकड़ बदलें और प्रतिद्वंद्वी से पहले पहुंचें।", genre: ["बनाए पहियों की रेस", "पहिया भौतिकी", "भूभाग रणनीति"] },
  ar: { intro: "ارسم عجلة للتضاريس التالية، وراقب كيف تغيّر قياساتها السباق، ثم أعد رسمها عند تغيّر المسار. يضع شكل العجلة السرعة والتحكم في ميزان الاختيار.", tagsLabel: "وسوم أسلوب اللعب:", tags: ["سباق العجلات المرسومة", "فيزياء العجلات", "استراتيجية التضاريس"], faq: [["كم عدد السباقات؟", "هناك 30 سباقًا مصممًا ضمن ستة فصول، خمسة سباقات في كل فصل."], ["ما العجلة المناسبة للجليد؟", "اختر شكلًا ذا تماسك جيد؛ فاللعبة تفحص التماسك على الجليد. العجلة الدائرية الملساء ليست الخيار الأفضل دائمًا."], ["أين يُحفظ تقدمي؟", "تُحفظ مرات الفوز والبراغي والترقيات وحالة العدسة وأفضل الأوقات في هذا المتصفح، ولا تتم مزامنتها مع أجهزة أخرى."]], description: "ارسم العجلات واختبرها في 30 سباقًا. اضبط الارتفاع والعرض والتماسك للسلالم والطين والأنفاق والفجوات والجليد والرياح لتصل قبل المنافس.", genre: ["سباق العجلات المرسومة", "فيزياء العجلات", "استراتيجية التضاريس"] },
};

const SAVE_HEADINGS = {
  en: "Player and Save Information",
  "zh-Hant": "玩家與儲存資訊",
  "zh-Hans": "玩家与保存信息",
  ja: "プレイヤーとセーブデータ",
  ko: "플레이어와 저장 정보",
  es: "Información del jugador y guardado",
  "pt-BR": "Informações do jogador e salvamento",
  fr: "Informations sur le joueur et la sauvegarde",
  de: "Spielerinformationen und Speicherstand",
  it: "Informazioni sul giocatore e sui salvataggi",
  ru: "Данные игрока и сохранение",
  hi: "खिलाड़ी और सेव जानकारी",
  ar: "معلومات اللاعب والحفظ",
};

const FAQ_EXTRA = {
  en: [["Can I redraw during a rally?", "Yes. Redraw before the next terrain section when its needs change."], ["Does the rival use my wheel?", "No. The rival sets race pressure; your result depends on the shape you draw."]],
  "zh-Hant": [["競速中可以重新繪製車輪嗎？", "可以。前方地形需求改變時，重新繪製下一個車輪是主要玩法。"], ["對手會使用我畫的車輪嗎？", "不會。對手帶來競速壓力，你的表現取決於自己畫出的輪型。"]],
  "zh-Hans": [["竞速中可以重新绘制车轮吗？", "可以。前方地形需求改变时，重新绘制下一个车轮是主要玩法。"], ["对手会使用我画的车轮吗？", "不会。对手带来竞速压力，你的表现取决于自己画出的轮型。"]],
  ja: [["ラリー中に車輪を描き直せますか？", "できます。次の地形に合わせて描き直すのが基本の遊び方です。"], ["ライバルは自分の車輪を使いますか？", "いいえ。ライバルは競争相手で、結果は自分で描いた形によって変わります。"]],
  ko: [["경주 중에 바퀴를 다시 그릴 수 있나요?", "네. 다음 지형의 조건이 바뀌기 전에 다시 그리는 것이 기본 진행 방식입니다."], ["상대도 내가 그린 바퀴를 사용하나요?", "아니요. 상대는 경쟁 압박을 제공하며 결과는 내가 그린 모양에 따라 달라집니다."]],
  es: [["¿Puedo volver a dibujar durante una carrera?", "Sí. Redibuja antes del siguiente tramo cuando cambien las necesidades del terreno."], ["¿El rival usa mi rueda?", "No. El rival marca el ritmo de la competición; tu resultado depende de la forma que dibujes."]],
  "pt-BR": [["Posso redesenhar a roda durante a corrida?", "Sim. Redesenhe antes do próximo trecho quando as exigências do terreno mudarem."], ["O rival usa a roda que eu desenhei?", "Não. O rival cria a disputa; seu resultado depende do formato que você desenhar."]],
  fr: [["Puis-je redessiner la roue pendant une course ?", "Oui. Redessinez-la avant le prochain terrain lorsque ses exigences changent."], ["Le rival utilise-t-il ma roue ?", "Non. Le rival met la course sous pression ; votre résultat dépend de la forme que vous dessinez."]],
  de: [["Kann ich während eines Rennens neu zeichnen?", "Ja. Zeichne vor dem nächsten Abschnitt neu, wenn sich die Anforderungen des Geländes ändern."], ["Benutzt der Rivale mein Rad?", "Nein. Der Rivale sorgt für den Wettbewerb; dein Ergebnis hängt von deiner gezeichneten Form ab."]],
  it: [["Posso ridisegnare la ruota durante una gara?", "Sì. Ridisegnala prima del tratto successivo quando cambiano le esigenze del terreno."], ["Il rivale usa la ruota che ho disegnato?", "No. Il rivale crea la sfida; il risultato dipende dalla forma che disegni."]],
  ru: [["Можно ли перерисовать колесо во время гонки?", "Да. Меняйте форму перед следующим участком, когда требования трассы меняются."], ["Соперник использует моё колесо?", "Нет. Соперник создаёт соревновательное давление, а результат зависит от нарисованной вами формы."]],
  hi: [["क्या रेस के दौरान पहिया फिर से बना सकते हैं?", "हाँ। अगले हिस्से की ज़रूरत बदलने पर वहाँ पहुँचने से पहले पहिया फिर से बनाएं।"], ["क्या प्रतिद्वंद्वी मेरा बनाया पहिया इस्तेमाल करता है?", "नहीं। प्रतिद्वंद्वी रेस की चुनौती देता है; आपका परिणाम आपके बनाए आकार पर निर्भर करता है।"]],
  ar: [["هل يمكنني إعادة رسم العجلة أثناء السباق؟", "نعم. أعد رسمها قبل المقطع التالي عندما تتغير متطلبات التضاريس."], ["هل يستخدم المنافس عجلتي؟", "لا. يضيف المنافس ضغط السباق، وتعتمد نتيجتك على الشكل الذي ترسمه."]],
};

const ACCURATE = {
  en: { terrain: "A round wheel clears flat road; stairs need height; mud and ice need grip; tunnels and gaps check width. Gap clearance requires width; wheel speed affects performance during the crossing, and a strong pass in later chapters can grant a brief boost. Wind checks for a narrow wheel.", terrainPattern: /gaps?/i, speedPattern: /speed/i, description: "Draw and test wheels in 30 races. Match roundness to flat roads, height to stairs, grip to mud and ice, and width to tunnels and gaps. Speed affects performance during gap crossings; a strong pass in later chapters can grant a brief boost." },
  "zh-Hant": { terrain: "平路檢查圓度；階梯需要高度；泥地與冰面需要抓地力；隧道與缺口會檢查寬度。缺口通過由寬度判定；速度會影響跨越表現，後續章節的高表現通過可能帶來短暫加速。側風則檢查車輪是否夠窄。", terrainPattern: /缺口/, speedPattern: /速度/, description: "畫出車輪並挑戰三十場競速：平路看圓度、階梯看高度、泥地與冰面看抓地力，隧道與缺口看寬度。速度會影響跨越表現，後續章節的高表現通過可能帶來短暫加速。" },
  "zh-Hans": { terrain: "平路检查圆度；阶梯需要高度；泥地和冰面需要抓地力；隧道和缺口会检查宽度。缺口通行由宽度判定；速度会影响跨越表现，后续章节的高表现通过可能带来短暂加速。侧风则检查车轮是否够窄。", terrainPattern: /缺口/, speedPattern: /速度/, description: "画出车轮并挑战三十场竞速：平路看圆度、阶梯看高度、泥地和冰面看抓地力，隧道和缺口看宽度。速度会影响跨越表现，后续章节的高表现通过可能带来短暂加速。" },
  ja: { terrain: "平地では丸さ、階段では高さ、泥と氷ではグリップを確認します。トンネルと隙間では幅が条件です。隙間の通過は幅で判定され、走行速度は渡る間の評価に反映されます。後半の章では高い評価で短いブーストが発生することがあります。横風には細い車輪が向いています。", terrainPattern: /隙間|すき間|段差/, speedPattern: /速度/, description: "車輪を描いて30レースに挑戦。平地では丸さ、階段では高さ、泥と氷ではグリップ、トンネルや隙間では幅を調整。速度は渡る間の評価に反映され、後半の章では高い評価で短いブーストが発生することがあります。" },
  ko: { terrain: "평지는 둥근 정도를, 계단은 높이를, 진흙과 얼음은 접지력을 확인합니다. 터널과 틈에서는 폭이 조건입니다. 틈 통과 여부는 폭으로 결정되고, 바퀴 속도는 건너는 동안 성능에 반영됩니다. 후반 챕터에서 높은 성능으로 통과하면 짧은 부스트가 주어질 수 있습니다. 측풍에서는 폭이 좁은 바퀴가 유리합니다.", terrainPattern: /틈|간격/, speedPattern: /속도/, description: "바퀴를 그려 30개 경주에 도전하세요. 평지는 둥근 정도, 계단은 높이, 진흙과 얼음은 접지력, 터널과 틈은 폭을 확인합니다. 속도는 틈을 건너는 동안 성능에 반영되며, 후반 챕터의 좋은 통과는 짧은 부스트를 줄 수 있습니다." },
  es: { terrain: "La carretera plana comprueba la redondez; las escaleras requieren altura; el barro y el hielo, agarre; los túneles y huecos, anchura. El ancho determina si superas el hueco; la velocidad influye en el rendimiento durante el cruce y una buena pasada en capítulos posteriores puede dar un impulso breve. El viento favorece una rueda estrecha.", terrainPattern: /huecos?/i, speedPattern: /velocidad/i, description: "Dibuja ruedas y pruébalas en 30 carreras. Ajusta redondez para el llano, altura para escaleras, agarre para barro y hielo, y anchura para túneles y huecos. La velocidad influye durante el cruce; una buena pasada posterior puede dar un impulso breve." },
  "pt-BR": { terrain: "A estrada plana verifica a circularidade; escadas exigem altura; lama e gelo, aderência; túneis e vãos, largura. A largura determina se você atravessa o vão; a velocidade afeta o desempenho durante a travessia, e uma boa passagem nos capítulos posteriores pode dar um impulso breve. No vento, uma roda estreita ajuda.", terrainPattern: /vãos?/i, speedPattern: /velocidade/i, description: "Desenhe rodas e teste-as em 30 corridas. Ajuste a circularidade para pistas planas, altura para escadas, aderência para lama e gelo e largura para túneis e vãos. A velocidade afeta a travessia; uma boa passagem nos capítulos posteriores pode dar um impulso breve." },
  fr: { terrain: "La route plate vérifie la rondeur ; les escaliers demandent de la hauteur ; la boue et la glace, de l’adhérence ; les tunnels et les brèches, de la largeur. La largeur détermine le passage d’une brèche ; la vitesse influence la performance pendant la traversée, et un bon passage dans les chapitres suivants peut donner une brève accélération. Le vent favorise une roue étroite.", terrainPattern: /brèches?/i, speedPattern: /vitesse/i, description: "Dessinez des roues et testez-les sur 30 courses. Ajustez la rondeur sur le plat, la hauteur dans les escaliers, l’adhérence dans la boue et la glace, et la largeur dans les tunnels et les brèches. La vitesse agit pendant le passage ; une bonne traversée peut donner une brève accélération." },
  de: { terrain: "Auf ebener Straße zählt Rundheit; Treppen brauchen Höhe; Matsch und Eis Grip; Tunnel und Lücken prüfen die Breite. Die Breite entscheidet, ob du eine Lücke passierst; Tempo beeinflusst die Leistung während der Überquerung. Eine starke Passage kann in späteren Kapiteln einen kurzen Schub geben. Bei Seitenwind hilft ein schmales Rad.", terrainPattern: /Lücken?/i, speedPattern: /Tempo|Geschwindigkeit/i, description: "Zeichne Räder und teste sie in 30 Rennen. Runde Räder helfen auf ebener Straße, Höhe auf Treppen, Grip in Matsch und Eis sowie Breite in Tunneln und Lücken. Tempo wirkt während der Überquerung; eine starke Passage kann später einen kurzen Schub geben." },
  it: { terrain: "La strada piana controlla la rotondità; le scale richiedono altezza; fango e ghiaccio aderenza; tunnel e vuoti larghezza. La larghezza determina il superamento del vuoto; la velocità influisce sulla prestazione durante l’attraversamento, e una buona prova nei capitoli successivi può dare una breve spinta. Con il vento aiuta una ruota stretta.", terrainPattern: /vuoti?/i, speedPattern: /velocità/i, description: "Disegna ruote e provale in 30 gare. Regola rotondità sul piano, altezza sulle scale, aderenza su fango e ghiaccio e larghezza in tunnel e vuoti. La velocità influisce durante l’attraversamento; una buona prova successiva può dare una breve spinta." },
  ru: { terrain: "На ровной дороге важна округлость; лестницам нужна высота; грязи и льду — сцепление; туннелям и разрывам — ширина. Ширина определяет, получится ли преодолеть разрыв; скорость влияет на результат во время пересечения. В поздних главах успешный проход может дать краткое ускорение. При боковом ветре помогает узкое колесо.", terrainPattern: /разрыв/i, speedPattern: /скорость/i, description: "Рисуйте колёса и проверяйте их в 30 гонках. Учитывайте округлость на ровной дороге, высоту на лестницах, сцепление в грязи и на льду, ширину в туннелях и разрывах. Скорость влияет во время пересечения; успешный проход позже может дать краткое ускорение." },
  hi: { terrain: "खुली सड़क पर गोलाई, सीढ़ियों पर ऊंचाई, कीचड़ और बर्फ पर पकड़, तथा सुरंग और दरार में चौड़ाई जाँची जाती है। दरार पार करने की जाँच चौड़ाई से होती है; पार करते समय गति प्रदर्शन में योगदान देती है। बाद के अध्यायों में अच्छा पार करना थोड़ी देर का बूस्ट दे सकता है। हवा में पतला पहिया मदद करता है।", terrainPattern: /दरार/i, speedPattern: /गति/, description: "पहिए बनाकर 30 रेस में परखें। खुली सड़क पर गोलाई, सीढ़ियों पर ऊंचाई, कीचड़ और बर्फ पर पकड़, तथा सुरंग और दरार में चौड़ाई मिलाएँ। पार करते समय गति प्रदर्शन में योगदान देती है; बाद के अध्यायों में अच्छा पार करना थोड़ी देर का बूस्ट दे सकता है।" },
  ar: { terrain: "يفحص الطريق المستوي استدارة العجلة، وتحتاج السلالم إلى الارتفاع، والطين والجليد إلى التماسك، والأنفاق والفجوات إلى العرض. يحدد العرض إمكانية اجتياز الفجوة؛ وتؤثر السرعة في الأداء أثناء العبور، وقد يمنح الاجتياز القوي في الفصول اللاحقة دفعة قصيرة. وتناسب الرياح عجلة ضيقة.", terrainPattern: /فجوات?|فجوة/, speedPattern: /السرعة/, description: "ارسم العجلات واختبرها في 30 سباقًا. اضبط الاستدارة للطريق المستوي، والارتفاع للسلالم، والتماسك للطين والجليد، والعرض للأنفاق والفجوات. تؤثر السرعة أثناء العبور، وقد يمنح الاجتياز القوي لاحقًا دفعة قصيرة." },
};

const SHORT_DESCRIPTIONS = {
  en: "Draw wheels for 30 races. Match roundness, height, grip, and width to each terrain. Speed affects gap crossings, and strong later passes can grant a brief boost.",
  "zh-Hant": "畫出車輪挑戰三十場競速：平路看圓度、階梯看高度、泥冰看抓地力，隧道與缺口看寬度；速度影響跨越表現，後續強勢通過可帶來短暫加速。",
  "zh-Hans": "画出车轮挑战三十场竞速：平路看圆度、阶梯看高度、泥冰看抓地力，隧道和缺口看宽度；速度影响跨越表现，后续强势通过可带来短暂加速。",
  ja: "車輪を描いて30レースに挑戦。平地は丸さ、階段は高さ、泥や氷はグリップ、トンネルや隙間は幅が重要です。速度は渡る間の評価に影響し、後半は好成績で短いブーストも。",
  ko: "바퀴를 그려 30개 경주에 도전하세요. 평지는 둥근 정도, 계단은 높이, 진흙과 얼음은 접지력, 터널과 틈은 폭이 중요합니다. 속도는 틈을 건너는 성능에 반영됩니다.",
  es: "Dibuja ruedas para 30 carreras. Ajusta redondez, altura, agarre y anchura al terreno; la velocidad influye al cruzar huecos y las buenas pasadas posteriores pueden dar un impulso breve.",
  "pt-BR": "Desenhe rodas para 30 corridas. Ajuste circularidade, altura, aderência e largura ao terreno; a velocidade afeta a travessia, e boas passagens posteriores podem dar um impulso breve.",
  fr: "Dessinez des roues pour 30 courses. Ajustez rondeur, hauteur, adhérence et largeur au terrain ; la vitesse agit pendant les brèches et une bonne traversée peut donner une brève accélération.",
  de: "Zeichne Räder für 30 Rennen. Passe Rundheit, Höhe, Grip und Breite ans Gelände an; Tempo wirkt bei Lücken, und starke spätere Passagen können einen kurzen Schub geben.",
  it: "Disegna ruote per 30 gare. Adatta rotondità, altezza, aderenza e larghezza al terreno; la velocità influisce sui vuoti e le buone prove successive possono dare una breve spinta.",
  ru: "Рисуйте колёса для 30 гонок. Подбирайте округлость, высоту, сцепление и ширину под трассу; скорость влияет при пересечении разрывов, а сильный проход позже может дать ускорение.",
  hi: "30 रेस के लिए पहिए बनाएं। भूभाग के अनुसार गोलाई, ऊंचाई, पकड़ और चौड़ाई चुनें; दरार पार करते समय गति प्रदर्शन में योगदान देती है, और बाद में अच्छा पार करना छोटा बूस्ट दे सकता है।",
  ar: "ارسم عجلات لـ30 سباقًا. اضبط الاستدارة والارتفاع والتماسك والعرض حسب التضاريس؛ تؤثر السرعة أثناء عبور الفجوات، وقد يمنح الاجتياز القوي لاحقًا دفعة قصيرة."
};

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const localeKey = (locale) => COPY[locale] ? locale : locale === "zh-tw" ? "zh-Hant" : locale === "zh-cn" ? "zh-Hans" : locale.toLowerCase() === "pt-br" ? "pt-BR" : "en";

export function applySketchwheelTextGrowth(input, locale) {
  const key = localeKey(locale);
  const copy = { ...COPY[key], ...ACCURATE[key], description: SHORT_DESCRIPTIONS[key], saveHeading: SAVE_HEADINGS[key], faq: [...COPY[key].faq, ...FAQ_EXTRA[key]] };
  let html = String(input);
  // The old source carried a stale generic Guide beside a newer game-owned Guide.
  // Keep the explicitly owned Guide so each route has one complete visible copy.
  const sections = [...html.matchAll(/<section\b[^>]*class="[^"]*\bgame-page-info-static\b[^"]*"[^>]*>[\s\S]*?<\/section>/gi)];
  const marked = sections.find((match) => /\bdata-wp-game-guide\b/i.test(match[0]));
  if (marked) {
    // The canonical source carried an older full static Guide before the owned
    // 1.3 Guide. Drop that duplicate; generated locale routes already contain one.
    for (const match of sections) {
      if (match.index < marked.index && !/\bdata-wp-game-guide\b/i.test(match[0])) {
        html = html.slice(0, match.index) + html.slice(match.index + match[0].length);
        break;
      }
    }
    html = html.replace(/<!--[\s]*adsense-static-guide:start[\s]*-->\s*<!--[\s]*adsense-static-guide:end[\s]*-->/i, "");
  }
  const activeSections = [...html.matchAll(/<section\b[^>]*class="[^"]*\bgame-page-info-static\b[^"]*"[^>]*>[\s\S]*?<\/section>/gi)];
  const active = activeSections.find((match) => /\bdata-wp-game-guide\b/i.test(match[0])) || activeSections[0];
  if (active) {
    const guideAt = active.index;
    const endAt = guideAt + active[0].length;
    let guide = active[0];
    guide = guide.replace(/(<div class="game-info-title">[\s\S]*?<p>)[\s\S]*?(<\/p>)/i, `$1${esc(copy.intro)}$2`);
    guide = guide.replace(/(<div class="game-info-section game-info-parent">\s*<h3>)[^<]*(<\/h3>)/i, `$1${esc(copy.saveHeading)}$2`);
    guide = guide.replace(/<p>([\s\S]*?)<\/p>/gi, (paragraph) => {
      const plain = paragraph.replace(/<[^>]*>/g, " ");
      return copy.terrainPattern.test(plain) && copy.speedPattern.test(plain) ? `<p>${esc(copy.terrain)}</p>` : paragraph;
    });
    const tags = `<div class="game-info-section" data-wp-gameplay-tag-section="1.4.0"><p><strong data-wp-gameplay-tags-label>${esc(copy.tagsLabel)}</strong></p><div class="game-info-tags" data-wp-gameplay-tags="1.4.0">${copy.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div></div>`;
    if (!guide.includes('data-wp-gameplay-tags="1.4.0"')) {
      guide = guide.replace(/(<div class="game-info-sections">)/i, `$1${tags}`);
    }
    const faqRows = copy.faq.map(([q, a]) => `<div><dt>${esc(q)}</dt><dd>${esc(a)}</dd></div>`).join("");
    guide = guide.replace(/(<div class="game-info-section"><h3>[^<]*<\/h3>\s*<dl>)[\s\S]*?(<\/dl>)/i, `$1${faqRows}$2`);
    html = html.slice(0, guideAt) + guide + html.slice(endAt);
  }
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?\s*>)/i, `$1${esc(copy.description)}$2`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?\s*>)/i, `$1${esc(copy.description)}$2`);
  html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*("\s*\/?\s*>)/i, `$1${esc(copy.description)}$2`);
  html = html.replace(/("genre"\s*:\s*)\[[^\]]*\](?=,"playMode")/i, `$1${JSON.stringify(copy.genre)}`);
  html = html.replace(/("description"\s*:\s*)"(?:\\.|[^"\\])*"(?=,"publisher")/i, `$1${JSON.stringify(copy.description)}`);
  html = html.replace(/(game-page-info\.js\?v=)[^"'\s]+/gi, (_whole, prefix) => `${prefix}20261003-sketchwheel-text140-v2`);
  html = html.replace(/\n[\t ]+\n/g, "\n\n");
  return html;
}

export const SKETCHWHEEL_TEXT_LOCALES = Object.keys(COPY);
