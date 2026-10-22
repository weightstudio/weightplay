(() => {
  'use strict';

  if (document.body?.dataset.gameId !== 'maze-chase') return;

  const battle = document.getElementById('battleScreen');
  const back = document.getElementById('backBtn');
  const confirm = document.getElementById('backConfirm');
  const stay = document.getElementById('backStayBtn');
  const leave = document.getElementById('backLeaveBtn');
  const result = document.getElementById('resultScreen');
  const resultMain = document.getElementById('homeBtn');
  const resultReplay = document.getElementById('retryBtn');
  const level = document.getElementById('levelValue');
  const confirmCopy = document.getElementById('backConfirmCopy');
  const localeSelect = document.getElementById('localeSelect');
  const privateSound = document.getElementById('soundBtn');

  if (!battle || !back || !confirm || !stay || !leave || !result || !confirmCopy) return;

  // The old fallback used a portrait reference even on landscape phones,
  // shrinking every touch target to half size. Declare both authored tracks.
  battle.dataset.wpBattleMinWidth = '390';
  battle.dataset.wpBattleMinHeight = '720';
  battle.dataset.wpBattleLandscapeWidth = '760';
  battle.dataset.wpBattleLandscapeHeight = '334';

  // Sound belongs only to shared Settings in Interface 9. classic-chase-rocks
  // keeps its disconnected reference for localization, but players no longer
  // get a second Battle audio control.
  if (privateSound) {
    privateSound.disabled = true;
    privateSound.removeAttribute('data-wp-battle-utility');
    privateSound.remove();
  }

  back.setAttribute('aria-haspopup', 'dialog');
  back.setAttribute('aria-controls', 'backConfirm');
  result.dataset.wpBattleSubstate = 'result';

  const consequence = {
    en: stage => `Leave Stage ${stage}? This run's maze progress and score will be discarded. Your saved Best score is kept.`,
    'zh-Hant': stage => `要離開第 ${stage} 關嗎？本次迷宮進度與分數會被捨棄；已儲存的最佳分數會保留。`,
    'zh-Hans': stage => `要离开第 ${stage} 关吗？本次迷宫进度与分数会被舍弃；已保存的最佳分数会保留。`,
    ja: stage => `ステージ ${stage} を離れますか？このランの迷路進行とスコアは破棄されます。保存済みベストスコアは残ります。`,
    ko: stage => `스테이지 ${stage}에서 나갈까요? 이번 런의 미로 진행과 점수는 사라지지만 저장된 최고 점수는 유지됩니다.`,
    es: stage => `¿Salir de la etapa ${stage}? Se descartarán el progreso del laberinto y la puntuación de esta partida. Tu mejor puntuación guardada se conserva.`,
    'pt-BR': stage => `Sair da fase ${stage}? O progresso do labirinto e a pontuação desta partida serão descartados. Seu melhor placar salvo será mantido.`,
    fr: stage => `Quitter l'étape ${stage} ? La progression du labyrinthe et le score de cette partie seront perdus. Votre meilleur score enregistré est conservé.`,
    de: stage => `Stufe ${stage} verlassen? Labyrinth-Fortschritt und Punktestand dieses Laufs werden verworfen. Der gespeicherte Bestwert bleibt erhalten.`,
    it: stage => `Uscire dalla fase ${stage}? I progressi nel labirinto e il punteggio di questa partita verranno scartati. Il record salvato resta invariato.`,
    ru: stage => `Покинуть этап ${stage}? Прогресс лабиринта и счёт этого забега будут сброшены. Сохранённый лучший результат останется.`,
    hi: stage => `स्टेज ${stage} छोड़ें? इस रन की भूलभुलैया प्रगति और स्कोर मिट जाएंगे। सहेजा गया सर्वश्रेष्ठ स्कोर बना रहेगा।`,
    ar: stage => `هل تريد مغادرة المرحلة ${stage}؟ سيتم تجاهل تقدم المتاهة ونتيجة هذه الجولة، بينما تبقى أفضل نتيجة محفوظة.`
  };

  const currentLocale = () => {
    const raw = localeSelect?.value || document.documentElement.lang || 'en';
    if (/^zh-(tw|hant)/i.test(raw)) return 'zh-Hant';
    if (/^zh-(cn|hans)/i.test(raw)) return 'zh-Hans';
    if (/^pt/i.test(raw)) return 'pt-BR';
    const base = raw.split('-')[0].toLowerCase();
    return ['en','ja','ko','es','fr','de','it','ru','hi','ar'].includes(base) ? base : 'en';
  };

  const updateConsequence = () => {
    const locale = currentLocale();
    const copy = consequence[locale] || consequence.en;
    confirmCopy.textContent = copy(level?.textContent?.trim() || '1');
  };

  const liveSelectors = [
    '.battle-topline',
    '.hud',
    '[data-wp-battle-actions]',
    '.canvas-wrap',
    '#gameMessage',
    '#touchControls',
    '#controlHint'
  ];

  const liveNodes = () => {
    const seen = new Set();
    return liveSelectors.flatMap(selector => [...battle.querySelectorAll(selector)])
      .filter(node => {
        if (seen.has(node) || confirm.contains(node) || result.contains(node)) return false;
        seen.add(node);
        return true;
      });
  };

  const setCovered = covered => {
    liveNodes().forEach(node => {
      node.inert = covered;
      if (covered) {
        node.dataset.wpInterfaceCovered = 'true';
        node.setAttribute('aria-hidden', 'true');
      } else {
        delete node.dataset.wpInterfaceCovered;
        node.removeAttribute('aria-hidden');
      }
    });
  };

  const dialogOpen = node => Boolean(node && !node.hidden && !battle.hidden);
  let wasConfirmOpen = false;
  let wasResultOpen = false;

  const sync = () => {
    const confirmOpen = dialogOpen(confirm);
    const resultOpen = dialogOpen(result);

    updateConsequence();
    setCovered(confirmOpen || resultOpen);

    confirm.inert = false;
    result.inert = false;

    if (confirmOpen && !wasConfirmOpen && !confirm.contains(document.activeElement)) {
      stay.focus({ preventScroll: true });
    } else if (!confirmOpen && wasConfirmOpen && !battle.hidden && !resultOpen) {
      back.focus({ preventScroll: true });
    }

    if (resultOpen && !wasResultOpen) {
      (resultMain || resultReplay)?.focus({ preventScroll: true });
    }

    wasConfirmOpen = confirmOpen;
    wasResultOpen = resultOpen;
  };

  document.addEventListener('keydown', event => {
    if (!dialogOpen(confirm)) return;

    if (event.key === 'Tab') {
      const actions = [stay, leave].filter(button => !button.disabled && !button.hidden);
      if (!actions.length) return;
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!confirm.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
      return;
    }

    // The game-owned key handler performs Continue on Escape. Prevent browser
    // side effects here without stopping propagation to that existing owner.
    if (event.key === 'Escape') event.preventDefault();
  }, true);

  localeSelect?.addEventListener('change', updateConsequence);
  window.addEventListener('wonder:locale-change', updateConsequence);
  window.addEventListener('weightplay:audio-volume-change', updateConsequence);
  const observer = new MutationObserver(() => {
    if (!battle.hidden) sync();
  });

  const observeBattle = () => {
    observer.disconnect();
    sync();
    if (!battle.hidden) {
      observer.observe(battle, {
        subtree: true,
        attributes: true,
        attributeFilter: ['hidden', 'class']
      });
    }
  };

  window.addEventListener('weightplay:shell-sync', observeBattle);

  updateConsequence();
  observeBattle();

  // Game-local input adapter: keep the original maze, scoring and buffered
  // turn rules, but forward touch intent as soon as the gesture is readable.
  // Never wait for pointerup, which made every phone turn arrive too late.
  const canvas = document.getElementById('gameCanvas');
  const controls = document.getElementById('touchControls');
  const hint = document.getElementById('controlHint');
  const restart = document.getElementById('restartBtn');
  const progress = document.getElementById('progressValue');
  const progressHud = document.getElementById('progressHud');
  const keys = { up: 'ArrowUp', left: 'ArrowLeft', down: 'ArrowDown', right: 'ArrowRight' };
  const labels = {
    en: ['Swipe and turn without lifting. Tap a direction to queue the next turn.', 'Next turn', 'Pause', 'Start a new run?', 'This run will restart. Your saved best stays.', 'Keep playing', 'New run', 'Up', 'Left', 'Down', 'Right'],
    'zh-Hant': ['滑動即轉向，不必放開手指。也可點方向鍵，預約下一個路口。', '預約轉向', '暫停', '重新開始這一局？', '本局進度將重設，已存最佳分數會保留。', '繼續遊玩', '重新開始', '上', '左', '下', '右'],
    'zh-Hans': ['滑动即转向，不必松开手指。也可点方向键，预约下一个路口。', '预约转向', '暂停', '重新开始这一局？', '本局进度将重置，已存最佳分数会保留。', '继续游玩', '重新开始', '上', '左', '下', '右'],
    ja: ['指を離さずスワイプで旋回。方向ボタンで次の曲がり角を予約。', '次の旋回', '一時停止', '最初からやり直す？', '今回の進行をリセットします。ベスト記録は残ります。', '続ける', 'やり直す', '上', '左', '下', '右'],
    ko: ['손을 떼지 않고 밀어서 회전하세요. 방향 버튼으로 다음 회전을 예약하세요.', '다음 회전', '일시정지', '새로 시작할까요?', '이번 진행은 초기화됩니다. 최고 기록은 유지됩니다.', '계속하기', '새로 시작', '위', '왼쪽', '아래', '오른쪽'],
    es: ['Desliza sin levantar el dedo. Toca una dirección para preparar el próximo giro.', 'Próximo giro', 'Pausa', '¿Empezar de nuevo?', 'Se reinicia esta partida. Tu récord se conserva.', 'Continuar', 'Nueva partida', 'Arriba', 'Izquierda', 'Abajo', 'Derecha'],
    'pt-BR': ['Deslize sem levantar o dedo. Toque numa direção para preparar a próxima curva.', 'Próxima curva', 'Pausar', 'Começar de novo?', 'Esta partida será reiniciada. Seu recorde permanece.', 'Continuar', 'Nova partida', 'Cima', 'Esquerda', 'Baixo', 'Direita'],
    fr: ['Glissez sans lever le doigt. Touchez une direction pour préparer le prochain virage.', 'Prochain virage', 'Pause', 'Recommencer ?', 'La partie sera réinitialisée. Votre record reste sauvegardé.', 'Continuer', 'Nouvelle partie', 'Haut', 'Gauche', 'Bas', 'Droite'],
    de: ['Wische ohne Absetzen. Tippe eine Richtung für die nächste Abzweigung.', 'Nächste Kurve', 'Pause', 'Neu anfangen?', 'Dieser Lauf wird zurückgesetzt. Dein Rekord bleibt.', 'Weiterspielen', 'Neuer Lauf', 'Oben', 'Links', 'Unten', 'Rechts'],
    it: ['Scorri senza alzare il dito. Tocca una direzione per preparare la prossima svolta.', 'Prossima svolta', 'Pausa', 'Ricominciare?', 'La partita verrà azzerata. Il record resta salvato.', 'Continua', 'Nuova partita', 'Su', 'Sinistra', 'Giù', 'Destra'],
    ru: ['Проводите, не отрывая палец. Нажмите направление, чтобы задать следующий поворот.', 'Следующий поворот', 'Пауза', 'Начать заново?', 'Текущий забег сбросится. Рекорд сохранится.', 'Продолжить', 'Новый забег', 'Вверх', 'Влево', 'Вниз', 'Вправо'],
    hi: ['उंगली उठाए बिना स्वाइप करें। अगला मोड़ तय करने के लिए दिशा दबाएँ।', 'अगला मोड़', 'विराम', 'फिर से शुरू करें?', 'यह रन रीसेट होगा। सर्वश्रेष्ठ स्कोर सुरक्षित रहेगा।', 'जारी रखें', 'नया रन', 'ऊपर', 'बाएँ', 'नीचे', 'दाएँ'],
    ar: ['اسحب دون رفع إصبعك. اضغط اتجاهًا لتجهيز الانعطاف التالي.', 'الانعطاف التالي', 'إيقاف مؤقت', 'بدء جولة جديدة؟', 'ستُعاد الجولة مع الاحتفاظ بأفضل نتيجة.', 'متابعة', 'جولة جديدة', 'أعلى', 'يسار', 'أسفل', 'يمين']
  };
  const copy = () => labels[currentLocale()] || labels.en;
  const cue = document.createElement('output');
  cue.className = 'maze-turn-cue';
  cue.setAttribute('aria-live', 'off');
  controls.append(cue);
  const meter = document.createElement('div');
  meter.className = 'maze-progress-meter';
  meter.setAttribute('aria-hidden', 'true');
  meter.append(document.createElement('span'));
  progressHud.append(meter);
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'secondary maze-pause';
  restart.parentElement.prepend(pause);
  pause.addEventListener('click', () => back.click());

  let gesture = null;
  let selected = null;
  const readyForInput = () => !battle.hidden && confirm.hidden && result.hidden && !restartDialog.open && !document.querySelector('[role="dialog"]:not([hidden]):not(#backConfirm):not(#resultScreen)');
  const showDirection = direction => {
    selected = direction;
    controls.querySelectorAll('[data-action]').forEach(button => {
      button.classList.toggle('is-selected', button.dataset.action === direction);
    });
    cue.textContent = `${copy()[1]} ${({up:'↑',left:'←',down:'↓',right:'→'})[direction]}`;
  };
  const sendDirection = direction => {
    if (!readyForInput()) return;
    // Reuse the game's one existing keyboard input owner; no second movement
    // clock, joystick, route state, scoring path or audio engine is introduced.
    canvas.dispatchEvent(new KeyboardEvent('keydown', { key: keys[direction], bubbles: true, cancelable: true }));
    showDirection(direction);
  };
  canvas.addEventListener('pointerdown', event => {
    if (!readyForInput() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (gesture) { event.stopImmediatePropagation(); return; }
    event.preventDefault();
    event.stopImmediatePropagation();
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  }, true);
  canvas.addEventListener('pointermove', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    event.preventDefault();
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return;
    sendDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    gesture.x = event.clientX;
    gesture.y = event.clientY;
  }, { passive: false });
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => canvas.addEventListener(type, event => {
    if (gesture?.id !== event.pointerId) return;
    gesture = null;
    event.stopImmediatePropagation();
  }, true));
  controls.addEventListener('pointerdown', event => {
    const button = event.target.closest('[data-action]');
    if (button && readyForInput()) showDirection(button.dataset.action);
  });
  // Native buttons must also activate with Enter/Space and assistive clicks.
  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (button && event.detail === 0) sendDirection(button.dataset.action);
  });
  window.addEventListener('keydown', event => {
    const direction = Object.keys(keys).find(key => keys[key] === event.key) || ({w:'up',a:'left',s:'down',d:'right'})[event.key.toLowerCase()];
    if (!direction) return;
    if (!readyForInput() || event.target.closest?.('input,select,textarea,[role="dialog"]')) {
      event.stopImmediatePropagation();
      return;
    }
    showDirection(direction);
  }, true);

  const restartDialog = document.createElement('dialog');
  restartDialog.className = 'maze-restart-dialog';
  restartDialog.innerHTML = '<h2 id="mazeRestartTitle"></h2><p></p><div><button type="button" class="secondary"></button><button type="button" class="primary"></button></div>';
  restartDialog.setAttribute('aria-labelledby', 'mazeRestartTitle');
  document.body.append(restartDialog);
  const [cancelRestart, acceptRestart] = restartDialog.querySelectorAll('button');
  let approvedRestart = false;
  restart.addEventListener('click', event => {
    if (approvedRestart) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    // Existing leave flow owns the simulation pause, including clock reset.
    back.click();
    confirm.hidden = true;
    restartDialog.showModal();
    cancelRestart.focus();
  }, true);
  cancelRestart.addEventListener('click', () => restartDialog.close());
  acceptRestart.addEventListener('click', () => {
    approvedRestart = true;
    restartDialog.close('restart');
    restart.click();
    approvedRestart = false;
  });
  restartDialog.addEventListener('close', () => {
    if (restartDialog.returnValue !== 'restart') stay.click();
    restartDialog.returnValue = '';
    canvas.focus({preventScroll:true});
  });
  const localizeControls = () => {
    const text = copy();
    hint.textContent = text[0];
    pause.textContent = `Ⅱ ${text[2]}`;
    restartDialog.querySelector('h2').textContent = text[3];
    restartDialog.querySelector('p').textContent = text[4];
    cancelRestart.textContent = text[5];
    acceptRestart.textContent = text[6];
    controls.querySelectorAll('[data-action]').forEach(button => {
      button.setAttribute('aria-label', text[7 + ['up','left','down','right'].indexOf(button.dataset.action)]);
      button.setAttribute('aria-keyshortcuts', keys[button.dataset.action]);
    });
    if (selected) showDirection(selected);
  };
  const updateMeter = () => {
    const [done, total] = progress.textContent.split('/').map(Number);
    meter.firstElementChild.style.transform = `scaleX(${total ? Math.max(0,Math.min(1,done/total)) : 0})`;
  };
  new MutationObserver(updateMeter).observe(progress, {childList:true,characterData:true,subtree:true});
  let observedLevel = level.textContent;
  new MutationObserver(() => {
    if (observedLevel === level.textContent) return;
    observedLevel = level.textContent;
    selected = null;
    controls.querySelectorAll('.is-selected').forEach(button => button.classList.remove('is-selected'));
    cue.textContent = '';
  }).observe(level, {childList:true,characterData:true,subtree:true});
  localeSelect?.addEventListener('change', localizeControls);
  window.addEventListener('wonder:locale-change', localizeControls);
  window.addEventListener('weightplay:audio-volume-change', localizeControls);
  window.addEventListener('weightplay:shell-sync', () => {
    gesture = null;
    selected = null;
    controls.querySelectorAll('.is-selected').forEach(button => button.classList.remove('is-selected'));
    cue.textContent = '';
    localizeControls();
  });
  window.addEventListener('blur', () => { gesture = null; });
  document.addEventListener('visibilitychange', () => {
    gesture = null;
    if (document.hidden && readyForInput()) back.click();
  });
  localizeControls();
  updateMeter();
})();
