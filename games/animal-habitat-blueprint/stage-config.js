/* Habitat content only; WeightPlayPlayUI owns Stage cards, pooling, layout and gestures. */
(() => {
  'use strict';
  const statusCopy = {
    en: { ready: 'Ready', cleared: 'Cleared', locked: 'Complete earlier plans to unlock' },
    'zh-Hant': { ready: '可開始', cleared: '已完成', locked: '完成前面的規劃後解鎖' },
    'zh-Hans': { ready: '可开始', cleared: '已完成', locked: '完成前面的规划后解锁' },
    ja: { ready: '開始できます', cleared: 'クリア済み', locked: '前のプランを完了すると解除' },
    ko: { ready: '시작 가능', cleared: '완료', locked: '이전 계획을 완료하면 잠금 해제' },
    es: { ready: 'Disponible', cleared: 'Completado', locked: 'Completa los planes anteriores para desbloquear' },
    'pt-BR': { ready: 'Disponível', cleared: 'Concluído', locked: 'Conclua os planos anteriores para desbloquear' },
    fr: { ready: 'Disponible', cleared: 'Terminé', locked: 'Terminez les plans précédents pour débloquer' },
    de: { ready: 'Bereit', cleared: 'Abgeschlossen', locked: 'Schließe frühere Pläne zum Freischalten ab' },
    it: { ready: 'Disponibile', cleared: 'Completato', locked: 'Completa i piani precedenti per sbloccare' },
    ru: { ready: 'Доступно', cleared: 'Пройдено', locked: 'Завершите предыдущие планы, чтобы открыть' },
    hi: { ready: 'तैयार', cleared: 'पूरा', locked: 'अनलॉक करने के लिए पिछले प्लान पूरे करें' },
    ar: { ready: 'جاهز', cleared: 'مكتمل', locked: 'أكمل الخطط السابقة لفتحها' },
  };
  window.HabitatBlueprintStageConfig = ({ plans, solved, highestUnlockedIndex, copy, tileName, getLocale }) => ({
    count: plans.length,
    poster: '/assets/interface7-redrawn/animal-habitat-blueprint.webp',
    background: '/assets/lobby-block-atmosphere.svg',
    stage(index) {
      const plan = plans[index];
      const cleared = solved.has(index);
      const locked = index > highestUnlockedIndex();
      const details = plan.rules.map((rule) => copy(rule.key, { a: tileName(rule.a), b: tileName(rule.b) }));
      const labels = statusCopy[getLocale()] || statusCopy.en;
      return {
        id: plan.id,
        kicker: `${copy('chapter')} ${plan.chapter}/6`,
        title: String(plan.id),
        subtitle: copy(plan.name),
        status: locked ? labels.locked : cleared ? labels.cleared : labels.ready,
        summary: copy(plan.hint),
        details,
        locked,
        cleared,
        posterPosition: `50% ${[48, 60, 42, 56, 66, 45][plan.chapter - 1]}%`,
      };
    },
  });
})();
