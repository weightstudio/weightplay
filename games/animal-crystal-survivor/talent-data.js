/* Game-owned progression copy; no shared wallet or remote persistence. */
(() => {
  const keys = ['workshop','dust','hint','equip','unequip','learn','rankup','max','slots','reset','reward','choose','build','synergy','fresh','saveError','refund'];
  const rows = {
    en: ['Rune workshop','Rune dust','Equip two talents. All effects trigger automatically. Earn dust by finishing runs; leaving early gives none.','Equip','Unequip','Unlock','Evolve','Mastered','Equipped','Reset talents','Rune dust earned','Shape your spellbook','Current build','Combo','New spell','Could not save. Please try again.','Free reset: all spent dust is returned.'],
    'zh-Hant': ['符文工坊','符塵','最多裝備兩項天賦，效果全自動。完成一局可獲得符塵；中途離開不計獎勵。','裝備','卸下','解鎖','進化','已精通','已裝備','重配天賦','獲得符塵','選擇你的魔法流派','本局魔法','連動組合','新魔法','儲存失敗，請再試一次。','免費重配：退還全部已花費符塵。'],
    'zh-Hans': ['符文工坊','符尘','最多装备两项天赋，效果全自动。完成一局可获得符尘；中途离开不计奖励。','装备','卸下','解锁','进化','已精通','已装备','重配天赋','获得符尘','选择你的魔法流派','本局魔法','联动组合','新魔法','保存失败，请再试一次。','免费重配：退还全部已花费符尘。'],
    ja: ['ルーン工房','ルーンの粉','天賦は2つまで装備。すべて自動発動。結果画面で粉を獲得し、途中退出では獲得しません。','装備','外す','解放','進化','習得済み','装備中','振り直す','獲得した粉','魔法の組み合わせを選択','今回の魔法','連携','新しい魔法','保存できません。再試行してください。','振り直し無料：消費した粉をすべて返却。'],
    ko: ['룬 공방','룬 가루','특성 두 개를 장착하세요. 모두 자동 발동합니다. 결과 화면에서 가루를 받으며 중도 종료 시 보상은 없습니다.','장착','해제','해금','진화','완성','장착 중','특성 초기화','획득한 룬 가루','마법 조합 선택','현재 마법','연계','새 마법','저장 실패. 다시 시도하세요.','무료 초기화: 사용한 가루를 모두 돌려받습니다.'],
    es: ['Taller de runas','Polvo rúnico','Equipa dos talentos automáticos. Gana polvo al terminar; abandonar no da premios.','Equipar','Quitar','Desbloquear','Evolucionar','Dominado','Equipados','Reiniciar talentos','Polvo obtenido','Elige tus hechizos','Magia actual','Combinación','Hechizo nuevo','No se pudo guardar. Reinténtalo.','Reinicio gratis: recuperas todo el polvo gastado.'],
    'pt-BR': ['Oficina de runas','Pó rúnico','Equipe dois talentos automáticos. Ganhe pó ao terminar; sair antes não dá prêmio.','Equipar','Remover','Desbloquear','Evoluir','Dominado','Equipados','Redefinir talentos','Pó recebido','Escolha sua magia','Magia atual','Combinação','Nova magia','Falha ao salvar. Tente de novo.','Redefinição grátis: devolve todo o pó gasto.'],
    fr: ['Atelier des runes','Poussière runique','Équipez deux talents automatiques. La fin de partie rapporte de la poussière ; abandonner ne rapporte rien.','Équiper','Retirer','Débloquer','Évoluer','Maîtrisé','Équipés','Réinitialiser','Poussière gagnée','Composez vos sorts','Magie actuelle','Synergie','Nouveau sort','Échec de sauvegarde. Réessayez.','Réinitialisation gratuite : toute la poussière dépensée est rendue.'],
    de: ['Runenwerkstatt','Runenstaub','Rüste zwei automatische Talente aus. Staub gibt es am Rundenende, nicht beim Abbruch.','Ausrüsten','Ablegen','Freischalten','Entwickeln','Gemeistert','Ausgerüstet','Talente zurücksetzen','Staub erhalten','Wähle deine Zauber','Aktuelle Magie','Kombination','Neuer Zauber','Speichern fehlgeschlagen. Bitte erneut versuchen.','Kostenlos zurücksetzen: verbrauchter Staub wird erstattet.'],
    it: ['Officina delle rune','Polvere runica','Equipaggia due talenti automatici. Ottieni polvere a fine partita; abbandonare non dà premi.','Equipaggia','Rimuovi','Sblocca','Evolvi','Completo','Equipaggiati','Azzera talenti','Polvere ottenuta','Componi i tuoi incantesimi','Magia attuale','Sinergia','Nuova magia','Salvataggio fallito. Riprova.','Ripristino gratuito: tutta la polvere spesa viene restituita.'],
    ru: ['Мастерская рун','Рунная пыль','Выберите два автоматических таланта. Пыль выдаётся в конце попытки, но не при выходе.','Надеть','Снять','Открыть','Развить','Освоено','Надето','Сбросить таланты','Получено пыли','Выберите заклинания','Текущая магия','Сочетание','Новое заклинание','Не удалось сохранить. Повторите.','Бесплатный сброс возвращает всю потраченную пыль.'],
    hi: ['रून कार्यशाला','रून धूल','दो स्वचालित प्रतिभाएँ चुनें। प्रयास पूरा होने पर धूल मिलती है; बीच में छोड़ने पर नहीं।','लगाएँ','हटाएँ','खोलें','विकसित करें','पूर्ण','लगी हुई','प्रतिभाएँ रीसेट करें','मिली रून धूल','अपने जादू चुनें','वर्तमान जादू','तालमेल','नया जादू','सहेजा नहीं जा सका। फिर कोशिश करें।','मुफ्त रीसेट: खर्च की गई सारी धूल वापस मिलती है।'],
    ar: ['ورشة الرون','غبار الرون','جهّز موهبتين تلقائيتين. تحصل على الغبار عند نهاية الجولة، وليس عند المغادرة المبكرة.','تجهيز','إزالة','فتح','تطوير','مكتمل','مجهّز','إعادة المواهب','الغبار المكتسب','اختر تعاويذك','السحر الحالي','تآزر','تعويذة جديدة','تعذر الحفظ. حاول مجددًا.','إعادة مجانية: تستعيد كل الغبار المصروف.'],
  };
  const names = {
    en:['Dragon echo','Crystal harvest','Frost footsteps','Key alchemy','Ricochet','Orbit pulse','Critical rhythm'],
    'zh-Hant':['龍魂回響','碎晶收割','霜行者','金鑰鍊金','魔法彈射','環形脈衝','爆擊節奏'],
    'zh-Hans':['龙魂回响','碎晶收割','霜行者','金钥炼金','魔法弹射','环形脉冲','暴击节奏'],
    ja:['竜の残響','結晶の収穫','氷の足跡','鍵の錬金術','跳弾魔法','環状パルス','会心の律動'],
    ko:['용의 메아리','수정 수확','서리 발걸음','열쇠 연금술','마법 도탄','고리 파동','치명타 리듬'],
    es:['Eco del dragón','Cosecha de cristal','Pasos helados','Alquimia de llaves','Rebote','Pulso orbital','Ritmo crítico'],
    'pt-BR':['Eco do dragão','Colheita de cristal','Passos gelados','Alquimia de chaves','Ricochete','Pulso orbital','Ritmo crítico'],
    fr:['Écho du dragon','Moisson de cristaux','Pas de givre','Alchimie des clés','Ricochet','Onde orbitale','Rythme critique'],
    de:['Drachenecho','Kristallernte','Frostschritte','Schlüsselalchemie','Abpraller','Ringimpuls','Kritischer Rhythmus'],
    it:['Eco del drago','Raccolta di cristalli','Passi gelidi','Alchimia delle chiavi','Rimbalzo','Impulso orbitale','Ritmo critico'],
    ru:['Эхо дракона','Сбор кристаллов','Морозные шаги','Алхимия ключей','Рикошет','Кольцевой импульс','Ритм критов'],
    hi:['ड्रैगन की गूँज','क्रिस्टल कटाई','बर्फीले कदम','चाबी रसायन','उछलता जादू','वृत्ताकार लहर','क्रिटिकल लय'],
    ar:['صدى التنين','حصاد البلور','خطوات الصقيع','خيمياء المفاتيح','ارتداد سحري','نبضة دائرية','إيقاع الضربة الحرجة'],
  };
  const desc = {
    en:['Critical hits strike 1 → 2 nearby enemies again.','Every 6 → 4 defeats pulls nearby XP crystals to you.','Moving 650 → 450 distance releases a slowing frost ring.','Collecting a key triggers a blast with radius 150 → 210.','Primary hits bounce to 1 / 2 / 3 other targets for 35% damage.','Every 4 seconds, pulse around you; ranks expand radius and damage.','Critical cadence improves from 5 to 4 to 3 successful hits.'],
    'zh-Hant':['爆擊時追加追擊附近 1 → 2 個敵人。','每擊敗 6 → 4 隻敵人，吸回附近經驗水晶。','移動累積 650 → 450 距離，自動釋放減速冰環。','撿起金鑰觸發魔法爆破，半徑 150 → 210。','主攻擊彈射至其他 1 / 2 / 3 個敵人，造成 35% 傷害。','每 4 秒自動釋放環形脈衝；升級擴大範圍與威力。','爆擊週期由每 5 次命中縮短為 4 次，再縮短為 3 次。'],
    'zh-Hans':['暴击时追加追击附近 1 → 2 个敌人。','每击败 6 → 4 只敌人，吸回附近经验水晶。','移动累积 650 → 450 距离，自动释放减速冰环。','拾起金钥触发魔法爆破，半径 150 → 210。','主攻击弹射至其他 1 / 2 / 3 个敌人，造成 35% 伤害。','每 4 秒自动释放环形脉冲；升级扩大范围与威力。','暴击周期由每 5 次命中缩短为 4 次，再缩短为 3 次。'],
    ja:['会心時、近くの敵1 → 2体に追撃。','6 → 4体倒すごとに近くの経験結晶を吸収。','650 → 450移動で減速する氷の輪を放つ。','鍵を拾うと半径150 → 210の爆発。','通常弾が他の敵1 / 2 / 3体に35%の威力で跳ねる。','4秒ごとに環状波。強化で範囲と威力が増す。','会心の間隔が命中5回から4回、3回へ短縮。'],
    ko:['치명타가 주변 적 1 → 2명을 추가 공격합니다.','적 6 → 4명 처치마다 주변 경험 수정을 끌어옵니다.','650 → 450 거리 이동 시 둔화 서리 고리를 발동합니다.','열쇠 획득 시 반경 150 → 210의 폭발을 일으킵니다.','주 공격이 다른 적 1 / 2 / 3명에게 35% 피해로 튕깁니다.','4초마다 고리 파동. 강화하면 범위와 피해가 커집니다.','치명타 주기가 5회 명중에서 4회, 3회로 줄어듭니다.'],
    es:['Los críticos golpean de nuevo a 1 → 2 enemigos cercanos.','Cada 6 → 4 bajas atraen cristales de XP cercanos.','Moverte 650 → 450 libera un anillo de hielo ralentizador.','Una llave provoca una explosión de radio 150 → 210.','Los golpes rebotan a 1 / 2 / 3 objetivos con 35% de daño.','Pulso cada 4 segundos; los rangos amplían radio y daño.','Los críticos pasan de cada 5 golpes a cada 4 y luego 3.'],
    'pt-BR':['Críticos atingem mais 1 → 2 inimigos próximos.','A cada 6 → 4 derrotas, atraia cristais de XP próximos.','Mover 650 → 450 libera um anel de gelo que desacelera.','Uma chave provoca explosão de raio 150 → 210.','Ataques ricocheteiam em 1 / 2 / 3 alvos com 35% de dano.','Pulso a cada 4 segundos; níveis ampliam raio e dano.','Críticos passam de cada 5 acertos para 4 e depois 3.'],
    fr:['Les critiques frappent encore 1 → 2 ennemis proches.','Toutes les 6 → 4 éliminations attirent les cristaux proches.','Parcourir 650 → 450 libère un anneau de givre ralentissant.','Une clé déclenche une explosion de rayon 150 → 210.','Les tirs rebondissent sur 1 / 2 / 3 cibles à 35% de dégâts.','Une onde toutes les 4 secondes ; les rangs augmentent portée et dégâts.','Les critiques passent de 5 touches à 4, puis 3.'],
    de:['Kritische Treffer treffen 1 → 2 nahe Gegner zusätzlich.','Alle 6 → 4 besiegten Gegner ziehen nahe EP-Kristalle an.','Nach 650 → 450 Bewegung entsteht ein verlangsamender Frostring.','Ein Schlüssel löst eine Explosion mit Radius 150 → 210 aus.','Treffer springen auf 1 / 2 / 3 Ziele mit 35% Schaden über.','Alle 4 Sekunden ein Ringimpuls; Ränge erhöhen Radius und Schaden.','Kritische Treffer erfolgen nach 5, dann 4, dann 3 Treffern.'],
    it:['I critici colpiscono ancora 1 → 2 nemici vicini.','Ogni 6 → 4 sconfitte attirano i cristalli XP vicini.','Muoversi per 650 → 450 libera un anello di gelo rallentante.','Una chiave provoca un’esplosione di raggio 150 → 210.','I colpi rimbalzano su 1 / 2 / 3 bersagli al 35% del danno.','Impulso ogni 4 secondi; i ranghi ampliano raggio e danno.','I critici passano da ogni 5 colpi a 4, poi 3.'],
    ru:['Крит дополнительно поражает 1 → 2 ближайших врагов.','Каждые 6 → 4 победы притягивают ближние кристаллы опыта.','Движение на 650 → 450 выпускает замедляющее ледяное кольцо.','Ключ вызывает взрыв радиусом 150 → 210.','Удары рикошетят в 1 / 2 / 3 цели с уроном 35%.','Импульс каждые 4 секунды; ранги увеличивают радиус и урон.','Крит происходит каждые 5, затем 4, затем 3 попадания.'],
    hi:['क्रिटिकल प्रहार पास के 1 → 2 दुश्मनों को फिर मारता है।','हर 6 → 4 हार पर पास के XP क्रिस्टल खिंच आते हैं।','650 → 450 दूरी चलने पर धीमा करने वाला बर्फ घेरा निकलता है।','चाबी लेने पर 150 → 210 त्रिज्या का विस्फोट होता है।','प्रहार 1 / 2 / 3 अन्य लक्ष्यों पर 35% क्षति से उछलते हैं।','हर 4 सेकंड वृत्ताकार लहर; स्तर से क्षेत्र और क्षति बढ़ते हैं।','क्रिटिकल अंतराल 5 प्रहार से 4 और फिर 3 होता है।'],
    ar:['الضربات الحرجة تهاجم 1 → 2 من الأعداء القريبين مجددًا.','كل 6 → 4 هزائم تجذب بلورات الخبرة القريبة.','التحرك مسافة 650 → 450 يطلق حلقة صقيع مبطئة.','التقاط مفتاح يسبب انفجارًا بنصف قطر 150 → 210.','ترتد الضربات نحو 1 / 2 / 3 أهداف بضرر 35%.','نبضة كل 4 ثوان؛ الرتب تزيد المدى والضرر.','تصبح الضربة الحرجة كل 4 ثم 3 إصابات بدلًا من 5.'],
  };
  const rerolls = {en:'Redraw', 'zh-Hant':'重抽選項', 'zh-Hans':'重抽选项', ja:'引き直す', ko:'다시 뽑기', es:'Volver a elegir', 'pt-BR':'Sortear de novo', fr:'Nouveau tirage', de:'Neu ziehen', it:'Pesca di nuovo', ru:'Новый выбор', hi:'फिर से चुनें', ar:'إعادة السحب'};
  const ids = ['echo','harvest','stride','alchemy','ricochet','orbit','rhythm'];
  const icons = ['✦','◆','❄','◆','↗','◎','✧'];
  const combatRows = {
  "en": [
    "Defeats",
    "Survive, clear waves or defeat the boss. Collect XP crystals; magic fires automatically.",
    "Best {keys} defeats · Level {level} · {runs} runs",
    "{keys} defeats · Level {level} · {time}s · Best {best}",
    "Crystal overcharge",
    "Every 5 XP collected triggers a blast: radius 150 → 210.",
    [
      "Root prison: leave the three green circles.",
      "Prism fan: sidestep the five aimed bolts; attack after the shield fades.",
      "Briar charge: leave the fixed charge line before the rush.",
      "Meteor barrage: dodge three staggered fire impacts.",
      "Thunder cross: move diagonally out of both blue lanes.",
      "Eclipse wave: escape the expanding purple ring."
    ]
  ],
  "zh-Hant": [
    "擊敗",
    "挑戰生存、波次或首領。收集經驗水晶升級，魔法自動施放。",
    "最佳擊敗 {keys} 隻 · 最高等級 {level} · {runs} 局",
    "擊敗 {keys} 隻 · 等級 {level} · {time} 秒 · 最佳 {best}",
    "水晶超載",
    "每收集 5 點經驗觸發爆破，半徑 150 → 210。",
    [
      "根牢：離開三個綠色根圈。",
      "稜鏡扇射：閃開五發定向魔彈，護盾消失後反擊。",
      "荊棘衝鋒：看準固定衝刺線，向左右閃開。",
      "隕火連轟：閃避三次錯開時間的落火。",
      "雷霆十字：斜向離開兩條藍色雷擊線。",
      "日蝕震波：避開向外擴散的紫色環形震波。"
    ]
  ],
  "zh-Hans": [
    "击败",
    "挑战生存、波次或首领。收集经验水晶升级，魔法自动施放。",
    "最佳击败 {keys} 只 · 最高等级 {level} · {runs} 局",
    "击败 {keys} 只 · 等级 {level} · {time} 秒 · 最佳 {best}",
    "水晶超载",
    "每收集 5 点经验触发爆破，半径 150 → 210。",
    [
      "根牢：离开三个绿色根圈。",
      "棱镜扇射：闪开五发定向魔弹，护盾消失后反击。",
      "荆棘冲锋：看准固定冲刺线，向左右闪开。",
      "陨火连轰：闪避三次错开时间的落火。",
      "雷霆十字：斜向离开两条蓝色雷击线。",
      "日蚀震波：避开向外扩散的紫色环形震波。"
    ]
  ],
  "ja": [
    "撃破",
    "生存、ウェーブ、ボスに挑戦。経験結晶で強化し、魔法は自動発射。",
    "最多 {keys} 体 · レベル {level} · {runs} 回",
    "撃破 {keys} 体 · レベル {level} · {time}秒 · 最多 {best}",
    "結晶オーバーロード",
    "経験値を5集めるごとに爆発。半径150 → 210。",
    [
      "根の牢：3つの緑の円から離れる。",
      "プリズム扇射：5発を横に回避し、盾が消えたら攻撃。",
      "茨の突進：固定された突進線から横に回避。",
      "流星連撃：時間差で落ちる3つの炎を回避。",
      "雷の十字：2本の青い線から斜めに離れる。",
      "日食波：広がる紫の輪を避ける。"
    ]
  ],
  "ko": [
    "처치",
    "생존, 웨이브, 보스에 도전하세요. 경험 수정으로 강화하며 마법은 자동 발사됩니다.",
    "최고 {keys} 처치 · 레벨 {level} · {runs}회",
    "{keys} 처치 · 레벨 {level} · {time}초 · 최고 {best}",
    "수정 과부하",
    "경험치 5마다 반경 150 → 210의 폭발을 일으킵니다.",
    [
      "뿌리 감옥: 초록 원 세 개에서 벗어나세요.",
      "프리즘 부채탄: 다섯 발을 옆으로 피하고 방패가 사라지면 공격하세요.",
      "가시 돌진: 고정된 돌진선에서 옆으로 피하세요.",
      "유성 연사: 시간차로 떨어지는 불 세 개를 피하세요.",
      "십자 번개: 파란 선 두 개에서 대각선으로 벗어나세요.",
      "일식 파동: 퍼지는 보라색 고리를 피하세요."
    ]
  ],
  "es": [
    "Bajas",
    "Sobrevive, supera oleadas o vence al jefe. Recoge cristales de XP; la magia es automática.",
    "Récord {keys} bajas · Nivel {level} · {runs} partidas",
    "{keys} bajas · Nivel {level} · {time}s · Récord {best}",
    "Sobrecarga de cristal",
    "Cada 5 XP recogidos provocan una explosión de radio 150 → 210.",
    [
      "Prisión de raíces: sal de los tres círculos verdes.",
      "Abanico prisma: esquiva cinco proyectiles y ataca cuando caiga el escudo.",
      "Carga espinosa: esquiva de lado la línea fija.",
      "Lluvia de meteoros: evita tres impactos escalonados.",
      "Cruz de rayos: sal en diagonal de ambas líneas azules.",
      "Onda eclipse: evita el anillo morado que se expande."
    ]
  ],
  "pt-BR": [
    "Derrotas",
    "Sobreviva, vença ondas ou derrote o chefe. Colete cristais de XP; a magia é automática.",
    "Recorde {keys} derrotas · Nível {level} · {runs} partidas",
    "{keys} derrotas · Nível {level} · {time}s · Recorde {best}",
    "Sobrecarga de cristal",
    "A cada 5 XP coletados, explosão de raio 150 → 210.",
    [
      "Prisão de raízes: saia dos três círculos verdes.",
      "Leque prisma: desvie dos cinco tiros e ataque sem o escudo.",
      "Investida espinhosa: desvie de lado da linha fixa.",
      "Chuva de meteoros: evite três impactos em sequência.",
      "Cruz de raios: saia na diagonal das duas linhas azuis.",
      "Onda eclipse: evite o anel roxo em expansão."
    ]
  ],
  "fr": [
    "Éliminations",
    "Survivez, terminez les vagues ou battez le boss. Ramassez les cristaux XP ; la magie est automatique.",
    "Record {keys} éliminations · Niveau {level} · {runs} parties",
    "{keys} éliminations · Niveau {level} · {time}s · Record {best}",
    "Surcharge cristalline",
    "Chaque 5 XP ramassés déclenchent une explosion de rayon 150 → 210.",
    [
      "Prison de racines : sortez des trois cercles verts.",
      "Éventail prisme : esquivez cinq tirs, puis attaquez sans bouclier.",
      "Charge épineuse : esquivez latéralement la ligne fixe.",
      "Pluie de météores : évitez trois impacts décalés.",
      "Croix de foudre : quittez les deux lignes bleues en diagonale.",
      "Onde éclipse : évitez l’anneau violet en expansion."
    ]
  ],
  "de": [
    "Besiegt",
    "Überlebe, schaffe Wellen oder besiege den Boss. Sammle EP-Kristalle; Magie feuert automatisch.",
    "Rekord {keys} besiegt · Stufe {level} · {runs} Runden",
    "{keys} besiegt · Stufe {level} · {time}s · Rekord {best}",
    "Kristallüberladung",
    "Je 5 gesammelte EP lösen eine Explosion mit Radius 150 → 210 aus.",
    [
      "Wurzelgefängnis: Verlasse die drei grünen Kreise.",
      "Prismafächer: Weiche fünf Schüssen aus; greife ohne Schild an.",
      "Dornenansturm: Weiche der festen Linie seitlich aus.",
      "Meteorhagel: Meide drei versetzte Einschläge.",
      "Blitzkreuz: Verlasse beide blauen Linien diagonal.",
      "Finsterniswelle: Meide den wachsenden violetten Ring."
    ]
  ],
  "it": [
    "Sconfitti",
    "Sopravvivi, supera ondate o sconfiggi il boss. Raccogli cristalli XP; la magia è automatica.",
    "Record {keys} sconfitti · Livello {level} · {runs} partite",
    "{keys} sconfitti · Livello {level} · {time}s · Record {best}",
    "Sovraccarico cristallino",
    "Ogni 5 XP raccolti, esplosione di raggio 150 → 210.",
    [
      "Prigione di radici: esci dai tre cerchi verdi.",
      "Ventaglio prisma: schiva cinque colpi e attacca senza scudo.",
      "Carica spinosa: schiva lateralmente la linea fissa.",
      "Pioggia di meteore: evita tre impatti sfalsati.",
      "Croce di fulmini: esci in diagonale dalle due linee blu.",
      "Onda eclisse: evita l’anello viola in espansione."
    ]
  ],
  "ru": [
    "Победы",
    "Выживите, пройдите волны или победите босса. Собирайте кристаллы опыта; магия автоматическая.",
    "Рекорд {keys} побед · Уровень {level} · {runs} игр",
    "{keys} побед · Уровень {level} · {time}с · Рекорд {best}",
    "Перегрузка кристалла",
    "Каждые 5 единиц опыта вызывают взрыв радиусом 150 → 210.",
    [
      "Корневая тюрьма: выйдите из трёх зелёных кругов.",
      "Призма: уклонитесь от пяти снарядов и атакуйте после щита.",
      "Колючий рывок: уйдите вбок с фиксированной линии.",
      "Метеорный залп: избегайте трёх последовательных ударов.",
      "Крест молний: выйдите по диагонали с двух синих линий.",
      "Волна затмения: избегайте расширяющегося фиолетового кольца."
    ]
  ],
  "hi": [
    "हराए",
    "जीवित रहें, लहरें पार करें या बॉस हराएँ। XP क्रिस्टल लें; जादू अपने आप चलता है।",
    "श्रेष्ठ {keys} हराए · स्तर {level} · {runs} खेल",
    "{keys} हराए · स्तर {level} · {time} सेकंड · श्रेष्ठ {best}",
    "क्रिस्टल अधिभार",
    "हर 5 XP लेने पर 150 → 210 त्रिज्या का विस्फोट।",
    [
      "जड़ कैद: तीन हरे घेरों से निकलें।",
      "प्रिज्म पंखा: पाँच गोलों से बचें, ढाल हटने पर प्रहार करें।",
      "काँटेदार धावा: तय रेखा से बगल में हटें।",
      "उल्का वर्षा: अलग समय पर गिरती तीन आगों से बचें।",
      "बिजली क्रॉस: दोनों नीली रेखाओं से तिरछे निकलें।",
      "ग्रहण लहर: फैलते बैंगनी घेरे से बचें।"
    ]
  ],
  "ar": [
    "هزائم",
    "اصمد أو أكمل الموجات أو اهزم الزعيم. اجمع بلورات الخبرة؛ السحر تلقائي.",
    "الأفضل {keys} هزائم · المستوى {level} · {runs} جولات",
    "{keys} هزائم · المستوى {level} · {time}ث · الأفضل {best}",
    "فرط شحن البلور",
    "كل 5 نقاط خبرة تطلق انفجارًا بنصف قطر 150 → 210.",
    [
      "سجن الجذور: اخرج من الدوائر الخضراء الثلاث.",
      "مروحة المنشور: تفادَ خمس قذائف وهاجم بعد زوال الدرع.",
      "اندفاع الأشواك: تفادَ الخط الثابت جانبًا.",
      "وابل النيازك: تفادَ ثلاث ضربات نارية متعاقبة.",
      "صليب الرعد: اخرج قطريًا من الخطين الأزرقين.",
      "موجة الكسوف: تفادَ الحلقة البنفسجية المتسعة."
    ]
  ]
};
  const combat = locale => { const r = combatRows[locale] || combatRows.en; return {defeats:r[0],intro:r[1],record:r[2],result:r[3],alchemy:r[4],alchemyDesc:r[5],bosses:r[6]}; };
  window.CrystalTalents = { combat, ids, icons, costs: [4,6,8,10], cap: id => id === 'rhythm' ? 2 : 3,
    copy(locale) { const language = rows[locale] ? locale : 'en'; return { reroll: rerolls[language], ...Object.fromEntries(keys.map((key,i) => [key,rows[language][i]])), names: {...Object.fromEntries(ids.map((id,i) => [id,names[language][i]])), alchemy:combat(language).alchemy}, descriptions: {...Object.fromEntries(ids.map((id,i) => [id,desc[language][i]])), alchemy:combat(language).alchemyDesc} }; }
  };
})();
