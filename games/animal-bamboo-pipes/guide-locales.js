/* Authored Bamboo rules; presentation belongs to shared guide components. */
(() => {
  'use strict';
  const keys = ['summary', 'guideRulesTitle', 'guideRule1', 'guideRule2', 'guideRecovery', 'faqTitle', 'faqQuestion', 'faqAnswer'];
  const copy = {
    en: ['Rotate bamboo pipes to carry spring water to the flower basin.', 'How to play', 'Choose an unlocked waterway. Tap a pipe to turn it clockwise; matching openings carry water between neighboring tiles.', 'Trace the route from the spring to the flower basin. A gap stops the flow. Complete the connection to unlock the next waterway.', 'Undo reverses your last turn. Hint marks a pipe and its next connection; you still rotate it yourself. Restart restores this puzzle. Replay cleared waterways to improve your turn count. Progress stays in this browser.', 'Frequently Asked Questions', 'How do I complete a waterway?', 'Rotate the pipes until every neighboring opening matches and the spring connects to the flower basin.'],
    'zh-Hant': ['旋轉竹管，將泉水引到花圃。', '玩法', '選擇已解鎖的水道，點竹管順時針旋轉；相鄰格子的管口對上，水才能流過。', '從水源追蹤到花圃，找出中斷的接頭。接通水路即可解鎖下一條水道。', '復原會撤回上次旋轉。提示標出一根竹管與下一個接點，仍需自己轉動。重新開始會還原本題。重玩已通關水道，挑戰更少旋轉次數。進度儲存在此瀏覽器。', '常見問題', '如何完成水道？', '旋轉竹管，讓相鄰管口全部對上，將泉水接到花圃。'],
    'zh-Hans': ['旋转竹管，将泉水引到花圃。', '玩法', '选择已解锁的水道，点竹管顺时针旋转；相邻格子的管口对上，水才能流过。', '从水源追踪到花圃，找出中断的接头。接通水路即可解锁下一条水道。', '撤销会撤回上次旋转。提示标出一根竹管与下一个接点，仍需自己转动。重新开始会还原本题。重玩已通关水道，挑战更少旋转次数。进度保存在此浏览器。', '常见问题', '如何完成水道？', '旋转竹管，让相邻管口全部对上，将泉水接到花圃。'],
    ja: ['竹の管を回し、泉の水を花壇へ届けましょう。', '遊び方', '開いている水路を選び、管をタップして時計回りに回します。隣り合う管の口が合うと水が流れます。', '泉から花壇までたどり、途切れた接続を探しましょう。水路をつなぐと次の水路が開きます。', '元に戻すと最後の回転を取り消します。ヒントは管と次の接続先を示しますが、回転は自分で行います。やり直すと問題が初期状態に戻ります。クリアした水路で回転数の短縮に挑戦できます。進行はこのブラウザーに保存されます。', 'よくある質問', '水路はどう完成させますか？', '隣り合う管の口がすべて合うように回し、泉から花壇まで水をつなぎます。'],
    ko: ['대나무 관을 돌려 샘물을 화단까지 보내세요.', '게임 방법', '열린 수로를 고르고 관을 눌러 시계 방향으로 돌리세요. 이웃한 관의 입구가 맞아야 물이 흐릅니다.', '샘에서 화단까지 따라가며 끊어진 연결을 찾으세요. 물길을 연결하면 다음 수로가 열립니다.', '실행 취소는 마지막 회전을 되돌립니다. 힌트는 관과 다음 연결 지점을 표시하며 회전은 직접 해야 합니다. 다시 시작은 퍼즐을 초기화합니다. 완료한 수로에서 더 적은 회전에 도전하세요. 진행은 이 브라우저에 저장됩니다.', '자주 묻는 질문', '수로를 어떻게 완성하나요?', '이웃한 관의 입구가 모두 맞도록 돌려 샘물과 화단을 연결하세요.'],
    es: ['Gira los tubos de bambú para llevar agua del manantial al jardín.', 'Cómo jugar', 'Elige un canal desbloqueado. Toca un tubo para girarlo en sentido horario; las aberturas vecinas deben coincidir para dejar pasar el agua.', 'Sigue el recorrido del manantial al jardín y busca conexiones rotas. Completa el recorrido para desbloquear el siguiente canal.', 'Deshacer revierte el último giro. Pista señala un tubo y su siguiente conexión: debes girarlo tú. Reiniciar restaura el puzle. Repite canales completados para usar menos giros. El progreso se guarda en este navegador.', 'Preguntas frecuentes', '¿Cómo completo un canal?', 'Gira los tubos hasta que coincidan todas las aberturas vecinas y el manantial llegue al jardín.'],
    'pt-BR': ['Gire os tubos de bambu para levar água da nascente ao canteiro.', 'Como jogar', 'Escolha um canal desbloqueado. Toque num tubo para girá-lo no sentido horário; as aberturas vizinhas precisam coincidir para a água passar.', 'Siga da nascente até o canteiro e encontre as ligações interrompidas. Complete o caminho para liberar o próximo canal.', 'Desfazer reverte o último giro. Dica marca um tubo e a próxima ligação, mas você precisa girá-lo. Reiniciar restaura o quebra-cabeça. Repita canais concluídos para usar menos giros. O progresso fica neste navegador.', 'Perguntas frequentes', 'Como completo um canal?', 'Gire os tubos até todas as aberturas vizinhas coincidirem e a nascente chegar ao canteiro.'],
    fr: ['Tournez les tuyaux de bambou pour amener l’eau de la source au parterre.', 'Comment jouer', 'Choisissez un canal débloqué. Touchez un tuyau pour le tourner dans le sens horaire ; les ouvertures voisines doivent se rejoindre.', 'Suivez le trajet de la source au parterre et repérez les raccords interrompus. Reliez le trajet pour débloquer le canal suivant.', 'Annuler revient sur la dernière rotation. Indice désigne un tuyau et son prochain raccord ; vous devez le tourner vous-même. Recommencer rétablit le puzzle. Rejouez pour réduire les rotations. La progression reste dans ce navigateur.', 'Questions fréquentes', 'Comment terminer un canal ?', 'Tournez les tuyaux jusqu’à aligner toutes les ouvertures voisines et relier la source au parterre.'],
    de: ['Drehe Bambusrohre und leite Quellwasser zum Blumenbeet.', 'So spielst du', 'Wähle einen freigeschalteten Wasserweg. Tippe ein Rohr an, um es im Uhrzeigersinn zu drehen. Benachbarte Öffnungen müssen zusammenpassen.', 'Verfolge den Weg von der Quelle zum Beet und finde unterbrochene Verbindungen. Verbinde den Wasserweg, um den nächsten freizuschalten.', 'Rückgängig nimmt die letzte Drehung zurück. Hinweis markiert ein Rohr und den nächsten Anschluss; drehen musst du selbst. Neustart setzt das Rätsel zurück. Wiederhole gelöste Wege mit weniger Drehungen. Fortschritt wird in diesem Browser gespeichert.', 'Häufige Fragen', 'Wie schließe ich einen Wasserweg ab?', 'Drehe die Rohre, bis alle benachbarten Öffnungen passen und die Quelle das Blumenbeet erreicht.'],
    it: ['Ruota i tubi di bambù per portare l’acqua dalla sorgente all’aiuola.', 'Come giocare', 'Scegli un canale sbloccato. Tocca un tubo per ruotarlo in senso orario; le aperture vicine devono combaciare per far passare l’acqua.', 'Segui il percorso dalla sorgente all’aiuola e cerca i raccordi interrotti. Completa il collegamento per sbloccare il canale successivo.', 'Annulla ripristina l’ultima rotazione. Suggerimento indica un tubo e il raccordo seguente: devi ruotarlo tu. Ricomincia ripristina il puzzle. Rigioca i canali per ridurre le rotazioni. I progressi restano in questo browser.', 'Domande frequenti', 'Come completo un canale?', 'Ruota i tubi finché tutte le aperture vicine combaciano e la sorgente raggiunge l’aiuola.'],
    ru: ['Поворачивайте бамбуковые трубы и проведите воду от источника к клумбе.', 'Как играть', 'Выберите открытый канал. Нажмите на трубу, чтобы повернуть её по часовой стрелке. Отверстия соседних труб должны совпадать.', 'Проследите путь от источника к клумбе и найдите разрывы. Соедините путь, чтобы открыть следующий канал.', 'Отмена возвращает последний поворот. Подсказка отмечает трубу и следующий стык, но повернуть её нужно самостоятельно. Перезапуск восстанавливает головоломку. Повторяйте пройденное, сокращая число поворотов. Прогресс хранится в этом браузере.', 'Частые вопросы', 'Как завершить водный путь?', 'Поворачивайте трубы, пока все соседние отверстия не совпадут и вода не дойдёт от источника до клумбы.'],
    hi: ['बाँस की नलियाँ घुमाकर झरने का पानी फूलों की क्यारी तक पहुँचाएँ।', 'कैसे खेलें', 'खुला जलमार्ग चुनें। नली को छूकर घड़ी की दिशा में घुमाएँ। पानी तभी बहता है जब पास की नलियों के मुहाने मिलते हैं।', 'झरने से क्यारी तक रास्ता देखें और टूटे जोड़ खोजें। रास्ता जोड़कर अगला जलमार्ग खोलें।', 'वापस आखिरी घुमाव को उलटता है। संकेत एक नली और अगला जोड़ दिखाता है; नली आपको घुमानी है। फिर शुरू से पहेली की शुरुआती स्थिति लौटती है। कम घुमाव के लिए पूरे जलमार्ग दोबारा खेलें। प्रगति इसी ब्राउज़र में सहेजी जाती है।', 'अक्सर पूछे गए प्रश्न', 'जलमार्ग कैसे पूरा करें?', 'नलियों को तब तक घुमाएँ जब तक सभी पास के मुहाने मिलें और झरने का पानी क्यारी तक पहुँच जाए।'],
    ar: ['أدر أنابيب الخيزران لإيصال ماء النبع إلى حوض الزهور.', 'طريقة اللعب', 'اختر مجرى مفتوحًا. المس الأنبوب لتدويره مع عقارب الساعة؛ يجب أن تتطابق فتحات الأنابيب المتجاورة ليمر الماء.', 'تتبّع الطريق من النبع إلى الزهور وابحث عن الوصلات المقطوعة. أكمل الاتصال لفتح المجرى التالي.', 'التراجع يلغي آخر تدوير. التلميح يحدد أنبوبًا ووصلته التالية، لكن عليك تدويره بنفسك. إعادة البدء تعيد اللغز إلى بدايته. أعد المجاري المكتملة لتقليل عدد الدورات. يُحفظ التقدم في هذا المتصفح.', 'الأسئلة الشائعة', 'كيف أكمل المجرى؟', 'أدر الأنابيب حتى تتطابق كل الفتحات المتجاورة ويتصل النبع بحوض الزهور.']
  };
  for (const [locale, values] of Object.entries(copy)) {
    Object.assign(window.BAMBOO_LOCALES[locale], Object.fromEntries(keys.map((key, i) => [key, values[i]])));
  }

  function ensureFaq() {
    const guide = document.getElementById('publicGuide');
    const sections = guide?.querySelector('.game-info-sections');
    if (!guide || !sections) return null;
    let section = guide.querySelector('[data-bamboo-guide-faq]');
    if (!section) {
      const list = guide.querySelector('.game-info-section dl');
      section = list?.closest('.game-info-section') || null;
    }
    if (!section) {
      section = document.createElement('div');
      section.className = 'game-info-section';
    }
    section.dataset.bambooGuideFaq = '';
    section.dataset.runtimeLocalize = 'off';
    if (section.parentElement !== sections) sections.append(section);
    if (!section.querySelector('[data-bamboo-t="faqTitle"]')) {
      section.replaceChildren();
      const title = document.createElement('h3');
      title.dataset.bambooT = 'faqTitle';
      const list = document.createElement('dl');
      const item = document.createElement('div');
      const question = document.createElement('dt');
      question.dataset.bambooT = 'faqQuestion';
      const answer = document.createElement('dd');
      answer.dataset.bambooT = 'faqAnswer';
      item.append(question, answer);
      list.append(item);
      section.append(title, list);
    }
    return section;
  }

  window.BAMBOO_GUIDE = Object.freeze({
    apply(locale) {
      const section = ensureFaq();
      const active = window.BAMBOO_LOCALES[locale] || window.BAMBOO_LOCALES.en;
      if (!section || !active) return;
      section.querySelector('[data-bamboo-t="faqTitle"]').textContent = active.faqTitle;
      section.querySelector('[data-bamboo-t="faqQuestion"]').textContent = active.faqQuestion;
      section.querySelector('[data-bamboo-t="faqAnswer"]').textContent = active.faqAnswer;
    },
  });
})();
