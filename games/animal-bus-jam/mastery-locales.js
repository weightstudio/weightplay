(() => {
  "use strict";
  // [live target, scoring explanation, result, saved best, unrecoverable Hint]
  const copy = {
    en: ["Holding trips {holds} · target {target}", "Three stars: clear, reach the holding target, and use no Hint or Undo.", "{stars}/3 stars · holding trips {holds}/{target} · assists {assists}", "Best: {stars}/3 stars", "No clear route remains. Undo a dispatch or restart."],
    "zh-Hant": ["候車 {holds} 次 · 目標 {target} 次", "三星挑戰：通關、達成最少候車次數、不用提示或復原。", "{stars}/3 星 · 候車 {holds}/{target} 次 · 輔助 {assists} 次", "最佳：{stars}/3 星", "目前已無法疏通，請復原調度或重新開始。"],
    "zh-Hans": ["候车 {holds} 次 · 目标 {target} 次", "三星挑战：通关、达到最少候车次数、不用提示或撤销。", "{stars}/3 星 · 候车 {holds}/{target} 次 · 辅助 {assists} 次", "最佳：{stars}/3 星", "目前已无法疏通，请撤销调度或重新开始。"],
    ja: ["待機 {holds} 回 · 目標 {target} 回", "三つ星：クリア、最少待機回数、ヒント・取り消しなし。", "{stars}/3 星 · 待機 {holds}/{target} 回 · 補助 {assists} 回", "最高：{stars}/3 星", "解けるルートがありません。元に戻すか、やり直してください。"],
    ko: ["대기 {holds}회 · 목표 {target}회", "별 세 개: 완료, 최소 대기 횟수, 힌트와 되돌리기 없이.", "별 {stars}/3 · 대기 {holds}/{target}회 · 도움 {assists}회", "최고: 별 {stars}/3", "해결 경로가 없습니다. 되돌리거나 다시 시작하세요."],
    es: ["Esperas {holds} · objetivo {target}", "Tres estrellas: completa, minimiza las esperas y no uses pista ni deshacer.", "{stars}/3 estrellas · esperas {holds}/{target} · ayudas {assists}", "Mejor: {stars}/3 estrellas", "Ya no hay solución. Deshaz un envío o reinicia."],
    "pt-BR": ["Esperas {holds} · meta {target}", "Três estrelas: conclua, minimize esperas e não use dica nem desfazer.", "{stars}/3 estrelas · esperas {holds}/{target} · ajudas {assists}", "Melhor: {stars}/3 estrelas", "Não há solução restante. Desfaça um envio ou reinicie."],
    fr: ["Attentes {holds} · objectif {target}", "Trois étoiles : terminer, minimiser les attentes, sans indice ni annulation.", "{stars}/3 étoiles · attentes {holds}/{target} · aides {assists}", "Record : {stars}/3 étoiles", "Il ne reste aucune solution. Annulez un envoi ou recommencez."],
    de: ["Wartegänge {holds} · Ziel {target}", "Drei Sterne: abschließen, Wartegänge minimieren, ohne Tipp oder Rückgängig.", "{stars}/3 Sterne · Wartegänge {holds}/{target} · Hilfen {assists}", "Bestwert: {stars}/3 Sterne", "Keine Lösung mehr möglich. Mache einen Zug rückgängig oder starte neu."],
    it: ["Attese {holds} · obiettivo {target}", "Tre stelle: completa, minimizza le attese, senza suggerimenti o annullamenti.", "{stars}/3 stelle · attese {holds}/{target} · aiuti {assists}", "Migliore: {stars}/3 stelle", "Non resta una soluzione. Annulla un invio o ricomincia."],
    ru: ["Ожидания {holds} · цель {target}", "Три звезды: завершить, минимум ожиданий, без подсказок и отмен.", "{stars}/3 звезды · ожидания {holds}/{target} · помощь {assists}", "Рекорд: {stars}/3 звезды", "Решения больше нет. Отмените отправку или начните заново."],
    hi: ["प्रतीक्षा {holds} · लक्ष्य {target}", "तीन सितारे: पूरा करें, न्यूनतम प्रतीक्षा रखें, संकेत या पूर्ववत न करें।", "{stars}/3 सितारे · प्रतीक्षा {holds}/{target} · सहायता {assists}", "सर्वश्रेष्ठ: {stars}/3 सितारे", "अब कोई समाधान नहीं है। पिछला कदम पूर्ववत करें या फिर शुरू करें।"],
    ar: ["مرات الانتظار {holds} · الهدف {target}", "ثلاث نجوم: أكمل، وقلّل الانتظار، دون تلميح أو تراجع.", "{stars}/3 نجوم · الانتظار {holds}/{target} · المساعدة {assists}", "الأفضل: {stars}/3 نجوم", "لم يعد هناك حل. تراجع عن إرسال أو أعد البدء."],
  };
  Object.entries(copy).forEach(([code, values]) => {
    Object.assign(window.BUS_JAM_LOCALES[code], Object.fromEntries(
      ["dispatchGoal", "masteryGuide", "masteryResult", "masteryBest", "hintRecover"].map((key, index) => [key, values[index]]),
    ));
  });
})();
