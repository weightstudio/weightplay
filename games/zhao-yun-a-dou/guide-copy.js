/* Game-specific concise copy, applied before runtime locale initialization. */
(() => {
  'use strict';
  const copy = {
    en: ['Recruit soldiers, merge matching units and defend all three lanes.', 'Select two soldiers of the same type and level to merge. Keep every lane defended and use general skills when enemies press forward.'],
    'zh-Hant': ['招募士兵、合成同類單位，守住三條路線。', '依序點選同兵種、同等級的兩名士兵即可合成。每條路線都要留兵防守，敵軍逼近時使用武將技能。'],
    'zh-Hans': ['招募士兵、合成同类单位，守住三条路线。', '依次点选同兵种、同等级的两名士兵即可合成。每条路线都要留兵防守，敌军逼近时使用武将技能。'],
    ja: ['兵士を募集・合成して、3本の進路を守ろう。', '同じ兵種・レベルの兵士を2体選ぶと合成できます。各進路に守備兵を残し、敵が迫ったら武将のスキルを使いましょう。'],
    ko: ['병사를 모집하고 합성해 세 경로를 지키세요.', '병종과 레벨이 같은 병사 둘을 차례로 선택해 합성하세요. 각 경로에 수비병을 남기고 적이 다가오면 장수 기술을 사용하세요.'],
    es: ['Recluta y fusiona soldados para defender las tres rutas.', 'Selecciona dos soldados del mismo tipo y nivel para fusionarlos. Mantén defensores en cada ruta y usa las habilidades de los generales cuando avance el enemigo.'],
    'pt-BR': ['Recrute e combine soldados para defender as três rotas.', 'Selecione dois soldados do mesmo tipo e nível para combiná-los. Mantenha defensores em cada rota e use as habilidades dos generais quando os inimigos avançarem.'],
    fr: ['Recrutez et fusionnez vos soldats pour défendre les trois voies.', 'Sélectionnez deux soldats de même type et de même niveau pour les fusionner. Gardez chaque voie défendue et utilisez les compétences des généraux face à la pression ennemie.'],
    de: ['Rekrutiere und vereine Soldaten, um alle drei Wege zu verteidigen.', 'Wähle zwei Soldaten gleichen Typs und gleicher Stufe zum Vereinen. Lass jeden Weg bewacht und nutze die Fähigkeiten der Generäle, wenn Gegner vorrücken.'],
    it: ['Recluta e unisci soldati per difendere tutte e tre le corsie.', 'Seleziona due soldati dello stesso tipo e livello per unirli. Lascia difensori in ogni corsia e usa le abilità dei generali quando i nemici avanzano.'],
    ru: ['Нанимайте и объединяйте солдат, защищая три линии.', 'Выберите двух солдат одного типа и уровня для объединения. Оставляйте защитников на каждой линии и используйте умения полководцев при наступлении врага.'],
    hi: ['सैनिक भर्ती और मिलान करके तीनों रास्तों की रक्षा करें।', 'एक ही प्रकार और स्तर के दो सैनिक चुनकर उन्हें मिलाएँ। हर रास्ते पर रक्षक रखें और दुश्मन पास आने पर सेनापतियों की क्षमताएँ इस्तेमाल करें।'],
    ar: ['جنّد الجنود وادمج الوحدات المتطابقة للدفاع عن المسارات الثلاثة.', 'اختر جنديين من النوع والمستوى نفسيهما لدمجهما. أبقِ مدافعين في كل مسار واستخدم مهارات القادة عندما يتقدم الأعداء.'],
  };
  for (const [locale, [summary, guideBody]] of Object.entries(copy)) {
    Object.assign(window.ZHAO_YUN_ADOU_LOCALES[locale], {summary, guideBody});
  }
})();
