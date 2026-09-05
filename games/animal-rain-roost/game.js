(() => {
  "use strict";

  const localeKeys = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const localeNames = {
    en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어",
    es: "Español", "pt-BR": "Português (Brasil)", fr: "Français", de: "Deutsch", it: "Italiano",
    ru: "Русский", hi: "हिन्दी", ar: "العربية"
  };
  const copy = {
    en: { language: "Language", prototype: "Internal prototype", world: "WeightPlay Animal World", title: "Rain Roost", intro: "Slide Nori's little nest to catch gentle rain while leaves drift past.", tagTiming: "Timing", tagFocus: "Focus", tagFamily: "Family", start: "Start a shower", coverBadge: "3 gentle showers", guideKicker: "Quick guide", guideTitle: "Catch rain, leave leaves", guideText: "Drag the nest left or right. Catch the blue drops before they reach the bottom, and let the leaves drift by. Each shower can be replayed calmly.", battleKicker: "Rain Roost", instruction: "Drag the nest to catch the blue drops.", caught: "Caught {current} / {target}", best: "Best {value}", hit: "Nice catch!", leaf: "A leaf drifted by.", miss: "The drop slipped past. Keep trying.", roundClear: "Shower clear!", showerFail: "Almost there — try this shower again.", reset: "Restart shower", leaveTitle: "Leave this shower?", leaveText: "Your current shower will reset, but your best stays saved on this browser.", continue: "Keep playing", leave: "Leave", resultKicker: "Roost ready", resultTitle: "A calm rain run", resultSummary: "You caught {value} drops across three gentle showers.", bestLabelText: "Best drops", showersLabel: "Showers", replay: "Replay", mainMenu: "Main menu", soundOn: "Sound on", soundOff: "Sound off", round: "Shower {current} / {total}"
    },
    "zh-Hant": { language: "語言", prototype: "內部原型", world: "WeightPlay 動物世界", title: "雨滴棲所", intro: "滑動諾里的小巢接住溫柔雨滴，避開飄過的葉片。", tagTiming: "時機", tagFocus: "專注", tagFamily: "家庭", start: "開始接雨", coverBadge: "3 場溫柔雨景", guideKicker: "快速指南", guideTitle: "接住雨滴，讓葉子飄過", guideText: "將小巢左右拖曳，接住落到底部前的藍色雨滴，讓葉片飄過。每場雨都能平靜重玩。", battleKicker: "雨滴棲所", instruction: "拖動小巢接住藍色雨滴。", caught: "接到 {current} / {target}", best: "最佳 {value}", hit: "接得好！", leaf: "葉子飄過去了。", miss: "雨滴滑過了，再試試看。", roundClear: "這場雨完成了！", showerFail: "差一點，再試一次這場雨。", reset: "重新接這場雨", leaveTitle: "要離開這場雨嗎？", leaveText: "目前雨景會重設，但最佳紀錄會保存在這個瀏覽器。", continue: "繼續遊玩", leave: "離開", resultKicker: "棲所準備好了", resultTitle: "平靜的接雨旅程", resultSummary: "你在三場溫柔雨景中接到 {value} 滴雨。", bestLabelText: "最佳雨滴", showersLabel: "雨景", replay: "再玩一次", mainMenu: "回到主選單", soundOn: "聲音開啟", soundOff: "聲音關閉", round: "第 {current} / {total} 場雨"
    },
    "zh-Hans": { language: "语言", prototype: "内部原型", world: "WeightPlay 动物世界", title: "雨滴栖所", intro: "滑动诺里的小巢接住温柔雨滴，避开飘过的叶片。", tagTiming: "时机", tagFocus: "专注", tagFamily: "家庭", start: "开始接雨", coverBadge: "3 场温柔雨景", guideKicker: "快速指南", guideTitle: "接住雨滴，让叶子飘过", guideText: "左右拖动小巢，接住落到底部前的蓝色雨滴，让叶片飘过。每场雨都能平静重玩。", battleKicker: "雨滴栖所", instruction: "拖动小巢接住蓝色雨滴。", caught: "接到 {current} / {target}", best: "最佳 {value}", hit: "接得好！", leaf: "叶子飘过去了。", miss: "雨滴滑过了，再试试看。", roundClear: "这场雨完成了！", showerFail: "差一点，再试一次这场雨。", reset: "重新接这场雨", leaveTitle: "要离开这场雨吗？", leaveText: "当前雨景会重置，但最佳记录会保存在此浏览器。", continue: "继续游玩", leave: "离开", resultKicker: "栖所准备好了", resultTitle: "平静的接雨旅程", resultSummary: "你在三场温柔雨景中接到 {value} 滴雨。", bestLabelText: "最佳雨滴", showersLabel: "雨景", replay: "再玩一次", mainMenu: "回到主菜单", soundOn: "声音开启", soundOff: "声音关闭", round: "第 {current} / {total} 场雨"
    },
    ja: { language: "言語", prototype: "内部プロトタイプ", world: "WeightPlay アニマルワールド", title: "レイン・ルースト", intro: "ノリの小さな巣を動かし、葉を避けながらやさしい雨を受け止めます。", tagTiming: "タイミング", tagFocus: "集中", tagFamily: "ファミリー", start: "雨を始める", coverBadge: "3つの雨", guideKicker: "かんたんガイド", guideTitle: "雨を受けて、葉を見送ろう", guideText: "巣を左右に動かします。青い雨つぶを受け、葉はそのまま通します。", battleKicker: "レイン・ルースト", instruction: "巣を動かして青い雨つぶを受けよう。", caught: "キャッチ {current} / {target}", best: "ベスト {value}", hit: "ナイスキャッチ！", leaf: "葉が通り過ぎました。", miss: "雨つぶが通り過ぎました。", roundClear: "雨をクリア！", showerFail: "もう少し。もう一度やってみよう。", reset: "雨をやり直す", leaveTitle: "雨をやめますか？", leaveText: "今の雨はリセットされますが、ベストは保存されます。", continue: "続ける", leave: "やめる", resultKicker: "巣の準備完了", resultTitle: "静かな雨の旅", resultSummary: "3つの雨で {value} 個の雨つぶを受けました。", bestLabelText: "ベスト", showersLabel: "雨", replay: "もう一度", mainMenu: "メインへ", soundOn: "音オン", soundOff: "音オフ", round: "雨 {current} / {total}"
    },
    ko: { language: "언어", prototype: "내부 프로토타입", world: "WeightPlay 동물 세계", title: "빗방울 둥지", intro: "노리의 작은 둥지를 움직여 잎을 피하고 부드러운 빗방울을 받아요.", tagTiming: "타이밍", tagFocus: "집중", tagFamily: "가족", start: "비 시작하기", coverBadge: "잔잔한 비 3개", guideKicker: "빠른 안내", guideTitle: "비는 받고 잎은 보내요", guideText: "둥지를 좌우로 드래그하세요. 파란 빗방울을 받고 잎은 지나가게 두세요.", battleKicker: "빗방울 둥지", instruction: "둥지를 움직여 파란 빗방울을 받으세요.", caught: "받음 {current} / {target}", best: "최고 {value}", hit: "잘 받았어요!", leaf: "잎이 지나갔어요.", miss: "빗방울이 지나갔어요.", roundClear: "비를 완료했어요!", showerFail: "조금만 더! 다시 해봐요.", reset: "비 다시 시작", leaveTitle: "비를 나갈까요?", leaveText: "현재 비는 초기화되지만 최고 기록은 저장돼요.", continue: "계속하기", leave: "나가기", resultKicker: "둥지 준비 완료", resultTitle: "차분한 비 여행", resultSummary: "세 번의 비에서 빗방울 {value}개를 받았어요.", bestLabelText: "최고 빗방울", showersLabel: "비", replay: "다시 하기", mainMenu: "메인 메뉴", soundOn: "소리 켜짐", soundOff: "소리 꺼짐", round: "비 {current} / {total}"
    },
    es: { language: "Idioma", prototype: "Prototipo interno", world: "Mundo Animal de WeightPlay", title: "Nido de Lluvia", intro: "Mueve el nido de Nori para atrapar la lluvia suave mientras pasan las hojas.", tagTiming: "Ritmo", tagFocus: "Atención", tagFamily: "Familia", start: "Empezar lluvia", coverBadge: "3 lluvias suaves", guideKicker: "Guía rápida", guideTitle: "Atrapa lluvia, deja pasar hojas", guideText: "Arrastra el nido a izquierda o derecha. Atrapa las gotas azules y deja pasar las hojas.", battleKicker: "Nido de Lluvia", instruction: "Mueve el nido para atrapar las gotas azules.", caught: "Atrapadas {current} / {target}", best: "Mejor {value}", hit: "¡Buena captura!", leaf: "Una hoja pasó.", miss: "La gota pasó. Sigue intentando.", roundClear: "¡Lluvia superada!", showerFail: "Casi. Repite esta lluvia.", reset: "Repetir lluvia", leaveTitle: "¿Salir de esta lluvia?", leaveText: "La lluvia actual se reinicia, pero tu mejor marca queda guardada.", continue: "Seguir", leave: "Salir", resultKicker: "Nido listo", resultTitle: "Un paseo bajo la lluvia", resultSummary: "Atrapaste {value} gotas en tres lluvias suaves.", bestLabelText: "Mejor gotas", showersLabel: "Lluvias", replay: "Repetir", mainMenu: "Menú principal", soundOn: "Sonido activado", soundOff: "Sonido desactivado", round: "Lluvia {current} / {total}"
    },
    "pt-BR": { language: "Idioma", prototype: "Protótipo interno", world: "Mundo Animal WeightPlay", title: "Ninho da Chuva", intro: "Mova o ninho da Nori para pegar a chuva suave enquanto as folhas passam.", tagTiming: "Ritmo", tagFocus: "Foco", tagFamily: "Família", start: "Começar chuva", coverBadge: "3 chuvas suaves", guideKicker: "Guia rápido", guideTitle: "Pegue a chuva, deixe as folhas", guideText: "Arraste o ninho para a esquerda ou direita. Pegue as gotas azuis e deixe as folhas passarem.", battleKicker: "Ninho da Chuva", instruction: "Mova o ninho para pegar as gotas azuis.", caught: "Pegas {current} / {target}", best: "Melhor {value}", hit: "Boa!", leaf: "Uma folha passou.", miss: "A gota passou. Continue tentando.", roundClear: "Chuva concluída!", showerFail: "Quase. Tente esta chuva de novo.", reset: "Recomeçar chuva", leaveTitle: "Sair desta chuva?", leaveText: "A chuva atual será reiniciada, mas seu melhor fica salvo.", continue: "Continuar", leave: "Sair", resultKicker: "Ninho pronto", resultTitle: "Uma viagem de chuva", resultSummary: "Você pegou {value} gotas em três chuvas suaves.", bestLabelText: "Melhores gotas", showersLabel: "Chuvas", replay: "Jogar de novo", mainMenu: "Menu principal", soundOn: "Som ligado", soundOff: "Som desligado", round: "Chuva {current} / {total}"
    },
    fr: { language: "Langue", prototype: "Prototype interne", world: "Monde animal WeightPlay", title: "Nid de Pluie", intro: "Déplace le nid de Nori pour attraper la pluie douce et laisser passer les feuilles.", tagTiming: "Rythme", tagFocus: "Attention", tagFamily: "Famille", start: "Commencer la pluie", coverBadge: "3 pluies douces", guideKicker: "Guide rapide", guideTitle: "Attrape la pluie, laisse les feuilles", guideText: "Fais glisser le nid à gauche ou à droite. Attrape les gouttes bleues et laisse passer les feuilles.", battleKicker: "Nid de Pluie", instruction: "Déplace le nid pour attraper les gouttes bleues.", caught: "Attrapées {current} / {target}", best: "Meilleur {value}", hit: "Bien attrapé !", leaf: "Une feuille est passée.", miss: "La goutte est passée. Continue.", roundClear: "Pluie réussie !", showerFail: "Presque. Recommence cette pluie.", reset: "Recommencer la pluie", leaveTitle: "Quitter cette pluie ?", leaveText: "La pluie actuelle sera réinitialisée, mais ton meilleur score reste enregistré.", continue: "Continuer", leave: "Quitter", resultKicker: "Nid prêt", resultTitle: "Un voyage sous la pluie", resultSummary: "Tu as attrapé {value} gouttes en trois pluies douces.", bestLabelText: "Meilleures gouttes", showersLabel: "Pluies", replay: "Rejouer", mainMenu: "Menu principal", soundOn: "Son activé", soundOff: "Son désactivé", round: "Pluie {current} / {total}"
    },
    de: { language: "Sprache", prototype: "Interner Prototyp", world: "WeightPlay Tierwelt", title: "Regennest", intro: "Bewege Noris kleines Nest, fange sanften Regen und lass Blätter vorbeifliegen.", tagTiming: "Timing", tagFocus: "Fokus", tagFamily: "Familie", start: "Regen starten", coverBadge: "3 sanfte Schauer", guideKicker: "Kurzanleitung", guideTitle: "Regen fangen, Blätter ziehen lassen", guideText: "Ziehe das Nest nach links oder rechts. Fange blaue Tropfen und lass Blätter vorbeiziehen.", battleKicker: "Regennest", instruction: "Bewege das Nest und fange die blauen Tropfen.", caught: "Gefangen {current} / {target}", best: "Bestwert {value}", hit: "Gut gefangen!", leaf: "Ein Blatt flog vorbei.", miss: "Der Tropfen ist vorbei. Weiter versuchen.", roundClear: "Schauer geschafft!", showerFail: "Fast. Versuche diesen Schauer erneut.", reset: "Schauer neu starten", leaveTitle: "Schauer verlassen?", leaveText: "Der aktuelle Schauer wird zurückgesetzt, dein Bestwert bleibt gespeichert.", continue: "Weiterspielen", leave: "Verlassen", resultKicker: "Nest bereit", resultTitle: "Eine ruhige Regenrunde", resultSummary: "Du hast {value} Tropfen in drei Schauern gefangen.", bestLabelText: "Beste Tropfen", showersLabel: "Schauer", replay: "Nochmal", mainMenu: "Hauptmenü", soundOn: "Ton an", soundOff: "Ton aus", round: "Schauer {current} / {total}"
    },
    it: { language: "Lingua", prototype: "Prototipo interno", world: "Mondo Animale WeightPlay", title: "Nido di Pioggia", intro: "Sposta il nido di Nori per raccogliere la pioggia dolce mentre passano le foglie.", tagTiming: "Tempo", tagFocus: "Attenzione", tagFamily: "Famiglia", start: "Inizia la pioggia", coverBadge: "3 piogge dolci", guideKicker: "Guida rapida", guideTitle: "Raccogli la pioggia, lascia passare le foglie", guideText: "Trascina il nido a sinistra o a destra. Raccogli le gocce blu e lascia passare le foglie.", battleKicker: "Nido di Pioggia", instruction: "Sposta il nido per raccogliere le gocce blu.", caught: "Prese {current} / {target}", best: "Migliore {value}", hit: "Ben presa!", leaf: "Una foglia è passata.", miss: "La goccia è passata. Riprova.", roundClear: "Pioggia completata!", showerFail: "Ci sei quasi. Ripeti questa pioggia.", reset: "Ripeti la pioggia", leaveTitle: "Uscire da questa pioggia?", leaveText: "La pioggia attuale si resetta, ma il tuo migliore resta salvato.", continue: "Continua", leave: "Esci", resultKicker: "Nido pronto", resultTitle: "Un viaggio sotto la pioggia", resultSummary: "Hai raccolto {value} gocce in tre piogge dolci.", bestLabelText: "Gocce migliori", showersLabel: "Piogge", replay: "Rigioca", mainMenu: "Menu principale", soundOn: "Audio attivo", soundOff: "Audio disattivo", round: "Pioggia {current} / {total}"
    },
    ru: { language: "Язык", prototype: "Внутренний прототип", world: "Мир животных WeightPlay", title: "Дождевое гнездо", intro: "Двигайте гнездо Нори, ловите мягкие капли и пропускайте листья.", tagTiming: "Ритм", tagFocus: "Внимание", tagFamily: "Семья", start: "Начать дождь", coverBadge: "3 тихих дождя", guideKicker: "Коротко о игре", guideTitle: "Ловите дождь, пропускайте листья", guideText: "Двигайте гнездо влево и вправо. Ловите синие капли, а листья пропускайте.", battleKicker: "Дождевое гнездо", instruction: "Двигайте гнездо и ловите синие капли.", caught: "Поймано {current} / {target}", best: "Рекорд {value}", hit: "Отлично!", leaf: "Лист пролетел мимо.", miss: "Капля прошла. Попробуйте ещё.", roundClear: "Дождь пройден!", showerFail: "Почти. Повторите этот дождь.", reset: "Начать дождь заново", leaveTitle: "Выйти из дождя?", leaveText: "Текущий дождь сбросится, но рекорд останется в браузере.", continue: "Продолжить", leave: "Выйти", resultKicker: "Гнездо готово", resultTitle: "Спокойная прогулка под дождём", resultSummary: "Вы поймали {value} капель за три тихих дождя.", bestLabelText: "Лучшие капли", showersLabel: "Дожди", replay: "Сыграть снова", mainMenu: "Главное меню", soundOn: "Звук включён", soundOff: "Звук выключен", round: "Дождь {current} / {total}"
    },
    hi: { language: "भाषा", prototype: "आंतरिक प्रोटोटाइप", world: "WeightPlay पशु दुनिया", title: "बारिश का घोंसला", intro: "नॉरी का छोटा घोंसला चलाकर कोमल बारिश पकड़ें और पत्तों को जाने दें।", tagTiming: "समय", tagFocus: "ध्यान", tagFamily: "परिवार", start: "बारिश शुरू करें", coverBadge: "3 शांत बारिश", guideKicker: "छोटी गाइड", guideTitle: "बारिश पकड़ें, पत्ते जाने दें", guideText: "घोंसले को बाएँ या दाएँ खींचें। नीली बूंदें पकड़ें और पत्तों को निकलने दें।", battleKicker: "बारिश का घोंसला", instruction: "घोंसला चलाकर नीली बूंदें पकड़ें।", caught: "पकड़ी {current} / {target}", best: "सर्वश्रेष्ठ {value}", hit: "बहुत अच्छा!", leaf: "एक पत्ता निकल गया।", miss: "बूंद निकल गई। फिर कोशिश करें।", roundClear: "बारिश पूरी!", showerFail: "बस थोड़ा और। इस बारिश को फिर खेलें।", reset: "बारिश फिर शुरू", leaveTitle: "इस बारिश से बाहर जाएँ?", leaveText: "यह बारिश रीसेट होगी, लेकिन आपका सर्वश्रेष्ठ रिकॉर्ड बचा रहेगा।", continue: "खेलते रहें", leave: "बाहर जाएँ", resultKicker: "घोंसला तैयार", resultTitle: "शांत बारिश की यात्रा", resultSummary: "तीन शांत बारिश में आपने {value} बूंदें पकड़ीं।", bestLabelText: "सर्वश्रेष्ठ बूंदें", showersLabel: "बारिश", replay: "फिर खेलें", mainMenu: "मुख्य मेनू", soundOn: "ध्वनि चालू", soundOff: "ध्वनि बंद", round: "बारिश {current} / {total}"
    },
    ar: { language: "اللغة", prototype: "نموذج داخلي", world: "عالم WeightPlay الحيواني", title: "عشّ المطر", intro: "حرّك عشّ نوري لالتقاط المطر اللطيف واترك الأوراق تمرّ.", tagTiming: "التوقيت", tagFocus: "التركيز", tagFamily: "العائلة", start: "ابدأ المطر", coverBadge: "3 زخّات هادئة", guideKicker: "دليل سريع", guideTitle: "التقط المطر ودع الأوراق تمرّ", guideText: "اسحب العش يميناً أو يساراً. التقط القطرات الزرقاء واترك الأوراق تمرّ.", battleKicker: "عشّ المطر", instruction: "حرّك العش لالتقاط القطرات الزرقاء.", caught: "تم الالتقاط {current} / {target}", best: "الأفضل {value}", hit: "التقاط رائع!", leaf: "مرّت ورقة.", miss: "مرّت القطرة. واصل المحاولة.", roundClear: "اكتملت الزخّة!", showerFail: "اقتربت. أعد هذه الزخّة.", reset: "إعادة الزخّة", leaveTitle: "هل تغادر هذه الزخّة؟", leaveText: "ستُعاد الزخّة الحالية، لكن أفضل نتيجة ستبقى محفوظة في هذا المتصفح.", continue: "متابعة اللعب", leave: "مغادرة", resultKicker: "العش جاهز", resultTitle: "رحلة مطر هادئة", resultSummary: "التقطت {value} قطرة خلال ثلاث زخّات هادئة.", bestLabelText: "أفضل القطرات", showersLabel: "الزخّات", replay: "العب مجدداً", mainMenu: "القائمة الرئيسية", soundOn: "الصوت مفعّل", soundOff: "الصوت متوقف", round: "الزخّة {current} / {total}"
    }
  };

  const rounds = [
    { target: 5, objects: [[.22, "rain", 0], [.64, "rain", .46], [.82, "leaf", .92], [.38, "rain", 1.38], [.73, "rain", 1.86], [.16, "leaf", 2.34], [.52, "rain", 2.7], [.9, "rain", 3.15]] },
    { target: 5, objects: [[.74, "rain", 0], [.3, "leaf", .42], [.47, "rain", .8], [.16, "rain", 1.22], [.87, "rain", 1.7], [.61, "leaf", 2.08], [.33, "rain", 2.5], [.68, "rain", 2.93]] },
    { target: 6, objects: [[.52, "rain", 0], [.2, "rain", .35], [.78, "leaf", .7], [.35, "rain", 1.04], [.88, "rain", 1.42], [.56, "leaf", 1.8], [.13, "rain", 2.16], [.69, "rain", 2.54], [.4, "leaf", 2.9], [.82, "rain", 3.27]] }
  ];
  const $ = (id) => document.getElementById(id);
  const state = { locale: "en", sound: true, round: 0, caught: 0, best: 0, basket: .5, objects: [], elapsed: 0, running: false, raf: 0, lastTime: 0 };
  const canvas = $("rainCanvas");
  const ctx = canvas.getContext("2d");
  const storage = { get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} } };
  const routeMap = { en: "en", "zh-tw": "zh-Hant", "zh-hant": "zh-Hant", "zh-cn": "zh-Hans", "zh-hans": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };

  function queryLocale() {
    const query = new URLSearchParams(location.search).get("lang");
    const route = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const saved = storage.get("weightplay-rain-roost-locale");
    return (query && copy[query]) ? query : routeMap[route] || (saved && copy[saved] ? saved : "en");
  }
  function t(key, vars = {}) {
    const value = (copy[state.locale] || copy.en)[key] || copy.en[key] || key;
    return value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function applyLocale() {
    const current = copy[state.locale] || copy.en;
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = current[node.dataset.copy] || copy.en[node.dataset.copy] || node.dataset.copy; });
    $("mainSettingsBtn").setAttribute("aria-label", t("language"));
    $("soundToggle").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("soundToggle").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundToggle").textContent = state.sound ? "♪" : "×";
    $("battleSoundToggle").setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff"));
    $("battleSoundToggle").setAttribute("aria-pressed", String(state.sound));
    updateScore();
  }
  function populateLocales() {
    const select = $("localeSelect");
    localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = localeNames[key]; select.append(option); });
    select.value = state.locale;
    select.addEventListener("change", () => { state.locale = select.value; storage.set("weightplay-rain-roost-locale", state.locale); applyLocale(); });
  }
  function tone(kind) {
    if (!state.sound || !(window.AudioContext || window.webkitAudioContext)) return;
    try { const Audio = window.AudioContext || window.webkitAudioContext; const audio = new Audio(); const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.frequency.value = kind === "good" ? 650 : 180; gain.gain.setValueAtTime(.0001, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.025, audio.currentTime + .01); gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + .1); oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + .11); oscillator.addEventListener("ended", () => audio.close(), { once: true }); } catch (_) {}
  }
  function showView(view) {
    $("mainView").hidden = view !== "main";
    $("battleView").hidden = view !== "battle";
    $("resultView").hidden = view !== "result";
    document.body.dataset.screen = view;
    window.scrollTo(0, 0);
  }
  function updateScore() {
    const round = rounds[state.round] || rounds[0];
    $("roundLabel").textContent = t("round", { current: state.round + 1, total: rounds.length });
    $("catchLabel").textContent = t("caught", { current: state.caught, target: round.target });
    $("bestLabel").textContent = t("best", { value: state.best });
  }
  function start() {
    state.round = 0; state.best = 0; state.caught = 0; state.basket = .5; state.running = false;
    showView("battle"); startRound();
  }
  function startRound() {
    const round = rounds[state.round];
    state.caught = 0; state.elapsed = 0; state.lastTime = performance.now(); state.objects = round.objects.map(([x, type, spawn]) => ({ x, type, spawn, visible: false, done: false, y: -20 })); state.running = true;
    $("feedback").textContent = ""; $("feedback").className = "feedback"; updateScore(); resizeCanvas(); cancelAnimationFrame(state.raf); state.raf = requestAnimationFrame(tick);
  }
  function finishRound() {
    state.running = false; const goal = rounds[state.round].target;
    if (state.caught < goal) { $("feedback").textContent = t("showerFail"); $("feedback").className = "feedback is-wrong"; tone("wrong"); return; }
    $("feedback").textContent = t("roundClear"); $("feedback").className = "feedback is-good"; tone("good");
    if (state.round < rounds.length - 1) window.setTimeout(() => { state.round += 1; startRound(); }, 760); else window.setTimeout(finish, 760);
  }
  function finish() {
    state.best = Math.max(state.best, state.caught);
    const overall = Number(storage.get("weightplay-rain-roost-best") || 0);
    if (state.best > overall) storage.set("weightplay-rain-roost-best", String(state.best));
    $("resultSummary").textContent = t("resultSummary", { value: state.best });
    $("resultBest").textContent = storage.get("weightplay-rain-roost-best") || String(state.best);
    showView("result");
  }
  function setBasket(clientX) {
    const rect = canvas.getBoundingClientRect();
    state.basket = Math.max(.09, Math.min(.91, (clientX - rect.left) / rect.width));
    draw();
  }
  function positionFromEvent(event) { const point = event.touches?.[0] || event; if (point) setBasket(point.clientX); }
  function markObject(object, width, height) {
    const basketX = state.basket * width; const basketWidth = Math.min(112, Math.max(74, width * .16)); const basketY = height - 50;
    const objectX = object.x * width; const inBasket = Math.abs(objectX - basketX) < basketWidth * .54;
    object.done = true;
    if (object.type === "rain" && inBasket) { state.caught += 1; state.best = Math.max(state.best, state.caught); $("feedback").textContent = t("hit"); $("feedback").className = "feedback is-good"; tone("good"); updateScore(); }
    else if (object.type === "leaf") { $("feedback").textContent = t("leaf"); $("feedback").className = "feedback"; }
    else { $("feedback").textContent = t("miss"); $("feedback").className = "feedback is-wrong"; tone("wrong"); }
    return { basketX, basketWidth, basketY };
  }
  function tick(now) {
    if (!state.running) { draw(); return; }
    const round = rounds[state.round]; const dt = Math.min(.05, (now - state.lastTime) / 1000); state.lastTime = now; state.elapsed += dt;
    const rect = canvas.getBoundingClientRect(); const width = rect.width; const height = rect.height; let pending = false;
    state.objects.forEach((object) => {
      if (!object.visible && state.elapsed >= object.spawn) object.visible = true;
      if (!object.visible || object.done) return;
      pending = true; const duration = object.type === "leaf" ? 2.25 : 1.95; object.y = Math.min(height - 42, ((state.elapsed - object.spawn) / duration) * (height - 46));
      if (object.y >= height - 44) markObject(object, width, height);
    });
    draw();
    if (pending || state.objects.some((object) => !object.done)) state.raf = requestAnimationFrame(tick); else finishRound();
  }
  function draw() {
    const rect = canvas.getBoundingClientRect(); const width = rect.width || 1; const height = rect.height || 1;
    ctx.clearRect(0, 0, width, height);
    const sky = ctx.createLinearGradient(0, 0, 0, height); sky.addColorStop(0, "#9ed5ee"); sky.addColorStop(.66, "#d9f2ec"); sky.addColorStop(1, "#8bc19c"); ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.arc(width * .2, height * .17, 34, 0, Math.PI * 2); ctx.arc(width * .25, height * .14, 45, 0, Math.PI * 2); ctx.arc(width * .31, height * .18, 32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(37,111,100,.32)"; ctx.fillRect(0, height - 30, width, 30);
    state.objects.forEach((object) => { if (!object.visible || object.done) return; const x = object.x * width; const y = object.y; if (object.type === "rain") { ctx.strokeStyle = "#1d8fba"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y - 13); ctx.lineTo(x - 3, y + 10); ctx.stroke(); ctx.fillStyle = "#d7f8ff"; ctx.beginPath(); ctx.arc(x - 3, y + 10, 4, 0, Math.PI * 2); ctx.fill(); } else { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(state.elapsed * 2 + x) * .3); ctx.fillStyle = "#d18a4e"; ctx.beginPath(); ctx.ellipse(0, 0, 18, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#a86439"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); } });
    const basketX = state.basket * width; const basketWidth = Math.min(112, Math.max(74, width * .16)); const basketY = height - 50;
    ctx.fillStyle = "#167f88"; ctx.beginPath(); ctx.roundRect(basketX - basketWidth / 2, basketY, basketWidth, 28, 13); ctx.fill(); ctx.strokeStyle = "#f0b64a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(basketX, basketY + 2, basketWidth * .36, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.72)"; ctx.font = "700 13px system-ui"; ctx.textAlign = "center"; ctx.fillText(state.locale === "ar" ? "نوري" : "Nori", basketX, basketY + 20);
  }
  function openLeave() { $("leaveDialog").hidden = false; $("continueButton").focus(); }
  function closeLeave() { $("leaveDialog").hidden = true; $("homeFromBattle").focus(); }
  function goHome() { state.running = false; cancelAnimationFrame(state.raf); $("leaveDialog").hidden = true; showView("main"); applyLocale(); }
  function toggleSound() { state.sound = !state.sound; applyLocale(); }
  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => {
    populateLocales(); applyLocale(); window.addEventListener("resize", resizeCanvas);
    $("startButton").addEventListener("click", start); $("replayButton").addEventListener("click", start); $("resetButton").addEventListener("click", startRound);
    $("homeFromBattle").addEventListener("click", openLeave); $("continueButton").addEventListener("click", closeLeave); $("confirmLeaveButton").addEventListener("click", goHome); $("homeFromResult").addEventListener("click", goHome);
    $("mainSettingsBtn").addEventListener("click", () => { const panel = $("settingsPanel"); const open = panel.hidden; panel.hidden = !open; $("mainSettingsBtn").setAttribute("aria-expanded", String(open)); });
    $("soundToggle").addEventListener("click", toggleSound); $("battleSoundToggle").addEventListener("click", toggleSound);
    canvas.addEventListener("pointerdown", (event) => { canvas.setPointerCapture?.(event.pointerId); positionFromEvent(event); }); canvas.addEventListener("pointermove", (event) => { if (event.buttons || event.pressure) positionFromEvent(event); }); canvas.addEventListener("keydown", (event) => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); state.basket = Math.max(.09, Math.min(.91, state.basket + (event.key === "ArrowLeft" ? -.08 : .08))); draw(); });
  });
  window.RAIN_ROOST_TEST = { rounds, state, start, startRound, setBasket, applyLocale };
})();
