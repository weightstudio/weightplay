/* Original, optional route-mastery goals. No external service or new save dependency. */
(() => {
  const copy = {
    en: ["echoing ice", "homeward rescue", "Edits", "Steps", "Ice edits move the drifter.", "After the last berry, return to the starting tile.", "Best", "Campaign complete", "Clear: ★. Earn another ★ for each target met."],
    "zh-tw": ["回音冰原", "歸途救援", "改冰", "步數", "每次成功改冰，漂行者就會移動。", "收完莓果後，返回起點格。", "最佳", "全章完成", "通關得★，每達成一項目標再得★。"],
    "zh-cn": ["回音冰原", "归途救援", "改冰", "步数", "每次成功改冰，漂行者就会移动。", "收完浆果后，返回起点格。", "最佳", "全章完成", "通关得★，每达成一项目标再得★。"],
    ja: ["こだまの氷原", "帰還の救出", "氷の編集", "歩数", "氷を変えるたびに漂流者が動きます。", "最後のベリーを集めたら開始マスへ戻りましょう。", "ベスト", "全章クリア", "クリアで★。目標を達成するごとに★を追加。"],
    ko: ["메아리 얼음", "귀환 구조", "얼음 편집", "걸음", "얼음을 바꿀 때마다 방랑자가 움직입니다.", "마지막 베리를 모은 뒤 시작 칸으로 돌아가세요.", "최고", "모든 챕터 완료", "클리어하면 ★. 목표를 달성할 때마다 ★ 추가."],
    es: ["hielo resonante", "rescate de regreso", "Ediciones", "Pasos", "Cada cambio de hielo mueve al errante.", "Tras la última baya, vuelve a la casilla inicial.", "Mejor", "Campaña completada", "Completa: ★. Gana otra ★ por cada objetivo logrado."],
    "pt-br": ["gelo ecoante", "resgate de volta", "Edições", "Passos", "Cada alteração no gelo move o andarilho.", "Após a última fruta, volte à casa inicial.", "Melhor", "Campanha concluída", "Conclua: ★. Ganhe outra ★ por cada meta atingida."],
    fr: ["glace en écho", "sauvetage du retour", "Modifications", "Pas", "Chaque modification de glace fait avancer le rôdeur.", "Après la dernière baie, revenez à la case de départ.", "Record", "Campagne terminée", "Réussite : ★. Une ★ de plus par objectif atteint."],
    de: ["Eisecho", "Rettung auf dem Heimweg", "Eisänderungen", "Schritte", "Jede Eisänderung bewegt den Wanderer.", "Kehre nach der letzten Beere zum Startfeld zurück.", "Bestwert", "Kampagne geschafft", "Abschluss: ★. Ein weiterer ★ je erreichtem Ziel."],
    it: ["eco del ghiaccio", "salvataggio del ritorno", "Modifiche", "Passi", "Ogni modifica al ghiaccio muove il vagabondo.", "Dopo l'ultima bacca, torna alla casella iniziale.", "Record", "Campagna completata", "Completa: ★. Un'altra ★ per ogni obiettivo raggiunto."],
    ru: ["ледяное эхо", "спасение на обратном пути", "Правки льда", "Шаги", "Каждая правка льда двигает странника.", "После последней ягоды вернитесь на стартовую клетку.", "Рекорд", "Кампания завершена", "Прохождение: ★. Ещё ★ за каждую достигнутую цель."],
    hi: ["गूँजती बर्फ़", "घर वापसी बचाव", "बर्फ़ बदलाव", "कदम", "हर सफल बर्फ़ बदलाव पर भटकने वाला चलता है।", "आखिरी बेरी के बाद शुरुआती खाने पर लौटें।", "सर्वश्रेष्ठ", "अभियान पूरा", "पूरा करने पर ★। हर लक्ष्य पूरा करने पर एक और ★।"],
    ar: ["صدى الجليد", "إنقاذ العودة", "تعديلات", "خطوات", "كل تعديل ناجح للجليد يحرك المتجول.", "بعد آخر توتة، عد إلى خانة البداية.", "الأفضل", "اكتملت الحملة", "الإكمال: ★. نجمة ★ إضافية لكل هدف يتحقق."],
  };
  const targets = [38,40,42,38,40, 42,40,44,42,44, 44,46,44,46,48, 46,48,46,48,50, 46,48,46,48,50, 58,60,58,60,62];
  const rules = stage => ({ steps: targets[stage - 1], edits: stage >= 21 ? 2 : 4, echo: stage >= 21, home: stage >= 26 });
  const grade = (stage, edits, steps) => 1 + Number(edits <= rules(stage).edits) + Number(steps <= rules(stage).steps);
  const normalize = value => {
    const clean = {};
    if (!value || typeof value !== "object" || Array.isArray(value)) return clean;
    for (let stage = 1; stage <= 30; stage++) {
      const stars = value[stage];
      if (Number.isInteger(stars) && stars >= 1 && stars <= 3) clean[stage] = stars;
    }
    return clean;
  };
  const saved = {
    en:"Best cleared room and best stars per room stay in this browser. Clearing site data removes them.",
    "zh-tw":"最高通關房間與各房最佳星等只存在這個瀏覽器；清除網站資料會移除紀錄。",
    "zh-cn":"最高通关房间与各房最佳星等只存在这个浏览器；清除网站数据会移除记录。",
    ja:"最高クリアルームと各ルームの最高評価はこのブラウザーに保存されます。サイトデータを消すと失われます。",
    ko:"최고 클리어 방과 방별 최고 별점은 이 브라우저에 저장됩니다. 사이트 데이터를 지우면 기록이 사라집니다.",
    es:"La mejor sala completada y las mejores estrellas por sala se guardan en este navegador. Borrar los datos del sitio elimina los registros.",
    "pt-br":"A melhor sala concluída e as melhores estrelas por sala ficam neste navegador. Limpar os dados do site apaga os registros.",
    fr:"La meilleure salle réussie et les meilleures étoiles de chaque salle restent dans ce navigateur. Effacer les données du site les supprime.",
    de:"Der höchste geschaffte Raum und die besten Sterne je Raum bleiben in diesem Browser. Beim Löschen der Websitedaten gehen sie verloren.",
    it:"La migliore stanza completata e le migliori stelle per stanza restano in questo browser. Cancellando i dati del sito si perdono i record.",
    ru:"Лучшая пройденная комната и лучшие звёзды каждой комнаты хранятся в этом браузере. Очистка данных сайта удалит их.",
    hi:"सबसे आगे पूरा किया गया कमरा और हर कमरे के सर्वश्रेष्ठ सितारे इसी ब्राउज़र में सहेजे जाते हैं। साइट डेटा मिटाने पर रिकॉर्ड हट जाते हैं।",
    ar:"تُحفظ أفضل غرفة مكتملة وأفضل نجوم لكل غرفة في هذا المتصفح. يؤدي مسح بيانات الموقع إلى حذف السجلات.",
  };
  window.FrostMastery = { copy, saved, rules, grade, normalize };
})();
