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

  document.documentElement.dataset.wpMazeChaseInterface = '7';

  // Sound belongs only to shared Settings in Interface 7. classic-chase-rocks
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
})();
