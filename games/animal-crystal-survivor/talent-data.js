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

// Owner-authored mutually exclusive elemental routes.
(() => {
 const rows={"en": ["Fire Seed", "Frost Seed", "Storm Seed", "Lightning Arc", "Ember Drake", "Frost Drake", "Storm Drake", "Choose one path. Max each parent (2/2) to continue. All learned nodes activate automatically. Reset freely to switch.", "Every third hit explodes nearby. Rank increases blast radius.", "Hits slow enemies; periodic defeats attract XP crystals.", "Every third hit arcs to another enemy. Rank increases arc damage.", "Automatically follows and shoots; rank 2 fires faster.", "Splash fire", "Freezing bolts", "Chain lightning", "BOSS INCOMING", "The battle is settling…"], "zh-Hant": ["焰火種子", "寒晶種子", "雷鳴種子", "雷電傳導", "餘燼幼龍", "霜晶幼龍", "雷翼幼龍", "選定一條路線，前置升滿 2/2 才能往下走。已學能力自動生效；免費重置可換路線。", "每第三次命中引爆周圍；升階擴大爆炸範圍。", "命中緩速敵人；累積擊敗數會吸引經驗水晶。", "每第三次命中連鎖另一個敵人；升階提升電弧傷害。", "自動跟隨、發射魔法；升至二階攻擊更快。", "火焰範圍爆破", "冰箭緩速", "連鎖閃電", "警告・首領即將現身", "戰鬥結算中…"], "zh-Hans": ["焰火种子", "寒晶种子", "雷鸣种子", "雷电传导", "余烬幼龙", "霜晶幼龙", "雷翼幼龙", "选定一条路线，前置升满 2/2 才能继续。已学能力自动生效；免费重置可换路线。", "每第三次命中引爆周围；升阶扩大爆炸范围。", "命中减速敌人；累积击败数会吸引经验水晶。", "每第三次命中连锁另一敌人；升阶提升电弧伤害。", "自动跟随、发射魔法；二阶攻击更快。", "火焰范围爆破", "冰箭减速", "连锁闪电", "警告・首领即将现身", "战斗结算中…"], "ja": ["炎の種", "氷の種", "雷の種", "雷の連鎖", "炎の幼竜", "氷の幼竜", "雷の幼竜", "道は1つ。前提を2/2にすると先へ進めます。習得能力は自動発動。無料リセットで変更可能。", "3回命中ごとに周囲へ爆発。ランクで範囲拡大。", "命中で敵を減速。一定数の撃破で経験値を吸引。", "3回命中ごとに別の敵へ雷。ランクで威力増加。", "自動追従して魔法を発射。ランク2で連射が速くなります。", "炎の範囲攻撃", "氷弾で減速", "連鎖する雷", "警告・ボス接近", "戦闘結果を準備中…"], "ko": ["불꽃 씨앗", "서리 씨앗", "천둥 씨앗", "번개 전도", "불꽃 아기용", "서리 아기용", "천둥 아기용", "한 경로를 선택하세요. 이전 능력 2/2가 필요합니다. 배운 능력은 자동 발동하며 무료 초기화로 변경할 수 있습니다.", "세 번째 명중마다 주변 폭발. 등급이 오르면 범위 증가.", "명중 시 감속. 일정 처치마다 경험치 수정 흡수.", "세 번째 명중마다 다른 적에게 번개. 등급에 따라 피해 증가.", "자동으로 따라오며 마법 발사. 2등급은 더 빠르게 공격.", "화염 범위 폭발", "얼음 감속탄", "연쇄 번개", "경고・보스 접근", "전투 정산 중…"], "es": ["Semilla ígnea", "Semilla helada", "Semilla de trueno", "Arco eléctrico", "Dragón de brasas", "Dragón de hielo", "Dragón de tormenta", "Elige una ruta. Completa cada requisito a 2/2. Los talentos aprendidos se activan solos. Reinicia gratis para cambiar.", "Cada tercer impacto explota alrededor. El rango amplía el área.", "Los impactos ralentizan; las derrotas atraen cristales XP.", "Cada tercer impacto salta a otro enemigo. El rango aumenta el daño.", "Te sigue y dispara automáticamente. El rango 2 dispara más rápido.", "Explosión de fuego", "Proyectiles helados", "Rayos en cadena", "ALERTA: JEFE EN CAMINO", "Resolviendo la batalla…"], "pt-BR": ["Semente de fogo", "Semente de gelo", "Semente do trovão", "Arco elétrico", "Dragão de brasas", "Dragão de gelo", "Dragão da tempestade", "Escolha uma rota. Complete cada requisito em 2/2. Talentos aprendidos são automáticos. Redefina grátis para trocar.", "A cada terceiro acerto, explode ao redor. A patente amplia a área.", "Acertos desaceleram; derrotas atraem cristais XP.", "A cada terceiro acerto, salta para outro inimigo. A patente aumenta o dano.", "Segue e dispara automaticamente. Na patente 2, ataca mais rápido.", "Explosão de fogo", "Projéteis de gelo", "Raios em cadeia", "ALERTA: CHEFE CHEGANDO", "Concluindo a batalha…"], "fr": ["Graine de feu", "Graine de givre", "Graine de tonnerre", "Arc électrique", "Dragon des braises", "Dragon de givre", "Dragon de tempête", "Choisissez une voie. Chaque prérequis doit atteindre 2/2. Les talents appris sont automatiques. Réinitialisation gratuite.", "Chaque troisième impact explose autour. Le rang agrandit la zone.", "Les impacts ralentissent ; les victoires attirent les cristaux XP.", "Chaque troisième impact frappe un autre ennemi. Le rang augmente les dégâts.", "Suit et tire automatiquement. Le rang 2 tire plus vite.", "Explosion de feu", "Projectiles glacés", "Éclairs en chaîne", "ALERTE : BOSS EN APPROCHE", "Fin du combat en cours…"], "de": ["Feuersaat", "Frostsaat", "Donnersaat", "Blitzbogen", "Glutdrache", "Frostdrache", "Sturmdrache", "Wähle einen Pfad. Jede Voraussetzung braucht 2/2. Gelernte Talente wirken automatisch. Kostenlos zurücksetzen und wechseln.", "Jeder dritte Treffer explodiert. Höhere Ränge vergrößern den Radius.", "Treffer verlangsamen; besiegte Gegner ziehen EP-Kristalle an.", "Jeder dritte Treffer springt weiter. Höhere Ränge erhöhen den Schaden.", "Folgt und schießt automatisch. Rang 2 schießt schneller.", "Feuerexplosion", "Frostgeschosse", "Kettenblitze", "WARNUNG: BOSS NAHT", "Kampf wird abgeschlossen…"], "it": ["Seme di fuoco", "Seme di gelo", "Seme del tuono", "Arco elettrico", "Drago di brace", "Drago di gelo", "Drago di tempesta", "Scegli un percorso. Ogni requisito deve arrivare a 2/2. I talenti appresi sono automatici. Ripristino gratuito per cambiare.", "Ogni terzo colpo esplode intorno. Il grado amplia il raggio.", "I colpi rallentano; le sconfitte attirano cristalli XP.", "Ogni terzo colpo salta a un altro nemico. Il grado aumenta il danno.", "Segue e spara automaticamente. Il grado 2 attacca più in fretta.", "Esplosione di fuoco", "Proiettili gelidi", "Fulmini a catena", "ALLARME: BOSS IN ARRIVO", "Conclusione della battaglia…"], "ru": ["Семя огня", "Семя мороза", "Семя грома", "Электрическая дуга", "Угольный дракончик", "Морозный дракончик", "Грозовой дракончик", "Выберите один путь. Каждый предыдущий узел требует 2/2. Изученные таланты действуют автоматически. Сброс бесплатный.", "Каждое третье попадание взрывается. Ранг увеличивает радиус.", "Попадания замедляют; победы притягивают кристаллы опыта.", "Каждое третье попадание бьёт другого врага. Ранг повышает урон.", "Автоматически следует и стреляет. На ранге 2 стреляет быстрее.", "Огненный взрыв", "Морозные снаряды", "Цепная молния", "ВНИМАНИЕ: ПРИБЛИЖАЕТСЯ БОСС", "Завершение боя…"], "hi": ["अग्नि बीज", "हिम बीज", "वज्र बीज", "बिजली चाप", "अंगारा ड्रैगन", "हिम ड्रैगन", "तूफ़ान ड्रैगन", "एक मार्ग चुनें। हर पिछला कौशल 2/2 होना चाहिए। सीखे कौशल अपने आप चलते हैं। मुफ्त रीसेट से मार्ग बदलें।", "हर तीसरी चोट पर आसपास विस्फोट। स्तर से क्षेत्र बढ़ता है।", "चोट से दुश्मन धीमे होते हैं; हार से XP क्रिस्टल खिंचते हैं।", "हर तीसरी चोट दूसरे दुश्मन तक जाती है। स्तर से क्षति बढ़ती है।", "अपने आप साथ चलता और जादू चलाता है। स्तर 2 पर तेज हमला।", "अग्नि विस्फोट", "हिम प्रक्षेपास्त्र", "श्रृंखला बिजली", "चेतावनी: बॉस आ रहा है", "लड़ाई का परिणाम तैयार हो रहा है…"], "ar": ["بذرة النار", "بذرة الصقيع", "بذرة الرعد", "قوس البرق", "تنين الجمر", "تنين الصقيع", "تنين العاصفة", "اختر مسارًا واحدًا. يجب بلوغ 2/2 في كل متطلب سابق. المواهب المكتسبة تلقائية. أعد الضبط مجانًا لتغيير المسار.", "كل إصابة ثالثة تفجر المحيط. تزيد الرتبة نصف القطر.", "الإصابات تبطئ الأعداء؛ والهزائم تجذب بلورات الخبرة.", "كل إصابة ثالثة تصيب عدوًا آخر. تزيد الرتبة الضرر.", "يتبعك ويطلق السحر تلقائيًا. الرتبة 2 أسرع هجومًا.", "انفجار ناري", "مقذوفات جليدية", "برق متسلسل", "تحذير: الزعيم قادم", "جار إنهاء المعركة…"]};
 const base=window.CrystalTalents.copy;
 window.CrystalTalents.copy=locale=>{ const c=base(locale),r=rows[locale]||rows.en; return {...c,routeHint:r[7],bossWarning:r[15],settling:r[16],names:{...c.names,fire:r[0],harvest:r[1],echo:r[2],storm:r[3],petFire:r[4],petIce:r[5],petStorm:r[6]},descriptions:{...c.descriptions,fire:r[8],harvest:r[9],storm:r[10],petFire:r[11]+" "+r[12],petIce:r[11]+" "+r[13],petStorm:r[11]+" "+r[14]}}; };
})();

// Adventure-level expansion: gameplay-independent localized copy.
(()=>{
const ids=["emberTrail", "fireNova", "combust", "phoenix", "iceArmor", "iceNova", "shatter", "winter", "staticCharge", "stormOrbit", "conduct", "surge"];
const names={
  "en": [
    "Ember Footprints",
    "Fire Nova",
    "Kindling",
    "Phoenix Return",
    "Ice Armor",
    "Frost Nova",
    "Shatter",
    "Deep Winter",
    "Static Steps",
    "Storm Ring",
    "Conduction",
    "Overdrive"
  ],
  "zh-Hant": [
    "餘燼足跡",
    "烈焰新星",
    "燃燒烙印",
    "浴火重生",
    "冰晶護甲",
    "冰霜新星",
    "碎冰連爆",
    "凜冬領域",
    "蓄電步伐",
    "雷暴環流",
    "電流擴散",
    "雷霆加速"
  ],
  "zh-Hans": [
    "余烬足迹",
    "烈焰新星",
    "燃烧烙印",
    "浴火重生",
    "冰晶护甲",
    "冰霜新星",
    "碎冰连爆",
    "凛冬领域",
    "蓄电步伐",
    "雷暴环流",
    "电流扩散",
    "雷霆加速"
  ],
  "ja": [
    "残り火の足跡",
    "炎の新星",
    "火印",
    "不死鳥の帰還",
    "氷の鎧",
    "霜の新星",
    "砕氷",
    "厳冬の領域",
    "帯電歩行",
    "嵐の輪",
    "伝導",
    "雷の加速"
  ],
  "ko": [
    "불씨 발자국",
    "화염 신성",
    "불꽃 낙인",
    "불사조 귀환",
    "얼음 갑옷",
    "서리 신성",
    "얼음 파쇄",
    "혹한 영역",
    "충전 걸음",
    "폭풍 고리",
    "전류 확산",
    "번개 가속"
  ],
  "es": [
    "Huellas de brasas",
    "Nova ígnea",
    "Marca ardiente",
    "Renacer del fénix",
    "Armadura de hielo",
    "Nova helada",
    "Fragmentación",
    "Invierno profundo",
    "Pasos estáticos",
    "Anillo de tormenta",
    "Conducción",
    "Sobrecarga"
  ],
  "pt-BR": [
    "Pegadas de brasas",
    "Nova ígnea",
    "Marca ardente",
    "Retorno da fênix",
    "Armadura de gelo",
    "Nova de gelo",
    "Estilhaçar",
    "Inverno profundo",
    "Passos estáticos",
    "Anel da tempestade",
    "Condução",
    "Sobrecarga"
  ],
  "fr": [
    "Traces de braises",
    "Nova ardente",
    "Marque brûlante",
    "Retour du phénix",
    "Armure de glace",
    "Nova de givre",
    "Fracas de glace",
    "Hiver profond",
    "Pas statiques",
    "Anneau de tempête",
    "Conduction",
    "Survoltage"
  ],
  "de": [
    "Glutspuren",
    "Feuernova",
    "Brandmal",
    "Phönixkehr",
    "Eisrüstung",
    "Frostnova",
    "Eissplitter",
    "Tiefwinter",
    "Statische Schritte",
    "Sturmring",
    "Leitung",
    "Überladung"
  ],
  "it": [
    "Orme di brace",
    "Nova di fuoco",
    "Marchio ardente",
    "Ritorno della fenice",
    "Armatura di ghiaccio",
    "Nova gelida",
    "Frantumazione",
    "Inverno profondo",
    "Passi statici",
    "Anello di tempesta",
    "Conduzione",
    "Sovraccarico"
  ],
  "ru": [
    "Угольные следы",
    "Огненная вспышка",
    "Огненная метка",
    "Возрождение феникса",
    "Ледяная броня",
    "Морозная вспышка",
    "Раскол льда",
    "Глубокая зима",
    "Заряженные шаги",
    "Кольцо бури",
    "Проводимость",
    "Разгон"
  ],
  "hi": [
    "अंगारे के पदचिह्न",
    "अग्नि विस्फोट",
    "जलती छाप",
    "फीनिक्स वापसी",
    "हिम कवच",
    "हिम विस्फोट",
    "हिम विखंडन",
    "भीषण शीत",
    "आवेशित कदम",
    "तूफ़ान घेरा",
    "विद्युत प्रसार",
    "तीव्र वेग"
  ],
  "ar": [
    "آثار الجمر",
    "انفجار ناري",
    "وسم مشتعل",
    "عودة العنقاء",
    "درع الجليد",
    "انفجار الصقيع",
    "تحطيم الجليد",
    "شتاء عميق",
    "خطوات مشحونة",
    "حلقة العاصفة",
    "توصيل",
    "تسارع الرعد"
  ]
};
const descriptions={
  "en": [
    "Every 180 movement leaves a fire patch for 3s; higher rank widens it.",
    "Every sixth hit explodes in a larger area.",
    "Hits burn enemies for 3s; rank doubles burn damage.",
    "Once per run, a fatal hit restores 3 → 5 health and erupts.",
    "Absorb one hit, then recharge for 18 → 12s.",
    "Every sixth hit releases an area frost blast.",
    "Every third hit on a chilled target releases a shattering blast.",
    "Every 8s, slow enemies in a wider frost field.",
    "Move 500 → 350 distance to release a lightning strike.",
    "Every 6s, strike 3 → 4 nearby enemies.",
    "Your third-hit arc spreads to 1 → 2 more enemies.",
    "Critical hits accelerate automatic fire for 1.5s; rank increases speed."
  ],
  "zh-Hant": [
    "每移動 180 距離留下燃燒區 3 秒；升階擴大範圍。",
    "每第六次命中引爆大片範圍；升階擴大爆炸。",
    "命中讓敵人燃燒 3 秒；升階加倍灼燒傷害。",
    "每局一次，致命傷害後恢復 3 → 5 生命並爆破周圍。",
    "抵擋一次傷害，18 → 12 秒後重新生成冰盾。",
    "每第六次命中釋放範圍冰爆；升階擴大範圍。",
    "每第三次命中緩速敵人時引發碎冰範圍爆炸。",
    "每 8 秒展開冰霜領域緩速周圍；升階擴大範圍。",
    "移動累積 500 → 350 距離，自動釋放落雷。",
    "每 6 秒自動電擊附近 3 → 4 隻敵人。",
    "每第三次命中的電弧，再擴散至 1 → 2 隻敵人。",
    "爆擊後 1.5 秒內自動施法加速；升階提高速度。"
  ],
  "zh-Hans": [
    "每移动 180 距离留下燃烧区 3 秒；升阶扩大范围。",
    "每第六次命中引爆大片范围；升阶扩大爆炸。",
    "命中让敌人燃烧 3 秒；升阶加倍灼烧伤害。",
    "每局一次，致命伤害后恢复 3 → 5 生命并爆破周围。",
    "抵挡一次伤害，18 → 12 秒后重新生成冰盾。",
    "每第六次命中释放范围冰爆；升阶扩大范围。",
    "每第三次命中减速敌人时引发碎冰范围爆炸。",
    "每 8 秒展开冰霜领域减速周围；升阶扩大范围。",
    "移动累计 500 → 350 距离，自动释放落雷。",
    "每 6 秒自动电击附近 3 → 4 只敌人。",
    "每第三次命中的电弧，再扩散至 1 → 2 只敌人。",
    "暴击后 1.5 秒内自动施法加速；升阶提高速度。"
  ],
  "ja": [
    "180移動ごとに3秒の炎。ランクで範囲拡大。",
    "6回命中ごとに大爆発。ランクで範囲拡大。",
    "命中で3秒燃焼。ランクで燃焼ダメージ倍増。",
    "各戦闘1回、致命傷で体力3→5回復し爆発。",
    "1回防御し18→12秒で再生成。",
    "6回命中ごとに範囲氷爆。ランクで範囲拡大。",
    "減速した敵への3回目の命中で砕氷爆発。",
    "8秒ごとに周囲を減速。ランクで範囲拡大。",
    "500→350移動で自動落雷。",
    "6秒ごとに近くの3→4体へ雷。",
    "3回目の命中の雷がさらに1→2体に伝わる。",
    "クリティカル後1.5秒、連射加速。ランクで速度増加。"
  ],
  "ko": [
    "180 이동마다 3초 불길. 등급에 따라 범위 증가.",
    "여섯 번째 명중마다 광역 폭발. 등급에 따라 범위 증가.",
    "명중 시 3초 연소. 등급 상승 시 연소 피해 두 배.",
    "전투당 한 번, 치명상 시 체력 3→5 회복 및 폭발.",
    "공격 1회 방어, 18→12초 후 충전.",
    "여섯 번째 명중마다 광역 얼음 폭발. 등급에 따라 범위 증가.",
    "느려진 적에게 세 번째 명중 시 얼음 폭발.",
    "8초마다 주변 감속. 등급에 따라 범위 증가.",
    "500→350 이동마다 자동 낙뢰.",
    "6초마다 근처 적 3→4명 감전.",
    "세 번째 명중의 번개가 1→2명에게 더 확산.",
    "치명타 후 1.5초 자동 공격 가속. 등급에 따라 속도 증가."
  ],
  "es": [
    "Cada 180 de movimiento deja fuego durante 3s. El rango amplía el área.",
    "Cada sexto impacto causa una gran explosión. El rango amplía el área.",
    "Los impactos queman 3s. El rango duplica el daño de quemadura.",
    "Una vez por partida, un golpe mortal restaura 3→5 de salud y explota.",
    "Absorbe un golpe; recarga en 18→12s.",
    "Cada sexto impacto provoca una explosión helada más amplia.",
    "Cada tercer impacto en un enemigo ralentizado causa una explosión de hielo.",
    "Cada 8s ralentiza alrededor. El rango amplía el área.",
    "Moverse 500→350 provoca un rayo automático.",
    "Cada 6s golpea a 3→4 enemigos cercanos.",
    "El arco del tercer impacto alcanza 1→2 enemigos más.",
    "Los críticos aceleran el fuego automático durante 1,5s. El rango aumenta la velocidad."
  ],
  "pt-BR": [
    "A cada 180 de movimento, deixa fogo por 3s. A patente amplia a área.",
    "Cada sexto acerto causa uma grande explosão. A patente amplia a área.",
    "Acertos queimam por 3s. A patente dobra o dano de queimadura.",
    "Uma vez por partida, um golpe fatal restaura 3→5 de vida e explode.",
    "Absorve um golpe; recarga em 18→12s.",
    "Cada sexto acerto causa uma explosão de gelo mais ampla.",
    "Cada terceiro acerto num alvo lento causa uma explosão de gelo.",
    "A cada 8s desacelera ao redor. A patente amplia a área.",
    "Mover 500→350 causa um raio automático.",
    "A cada 6s atinge 3→4 inimigos próximos.",
    "O arco do terceiro acerto atinge mais 1→2 inimigos.",
    "Críticos aceleram o disparo automático por 1,5s. A patente aumenta a velocidade."
  ],
  "fr": [
    "Tous les 180 de déplacement, laisse du feu 3s. Le rang agrandit la zone.",
    "Chaque sixième impact provoque une grande explosion. Le rang agrandit la zone.",
    "Les impacts brûlent 3s. Le rang double les brûlures.",
    "Une fois par partie, un coup fatal rend 3→5 PV et provoque une explosion.",
    "Absorbe un coup ; recharge en 18→12s.",
    "Chaque sixième impact provoque une explosion de givre plus large.",
    "Chaque troisième impact sur une cible ralentie provoque un fracas de glace.",
    "Toutes les 8s, ralentit autour. Le rang agrandit la zone.",
    "Parcourir 500→350 déclenche un éclair.",
    "Toutes les 6s, frappe 3→4 ennemis proches.",
    "L’arc du troisième impact touche 1→2 ennemis supplémentaires.",
    "Les critiques accélèrent les tirs 1,5s. Le rang augmente la vitesse."
  ],
  "de": [
    "Je 180 Bewegung bleibt 3s Feuer. Ränge vergrößern die Fläche.",
    "Jeder sechste Treffer explodiert großflächig. Ränge vergrößern die Fläche.",
    "Treffer verbrennen 3s. Der Rang verdoppelt Brandschaden.",
    "Einmal pro Runde heilt ein tödlicher Treffer 3→5 Leben und löst eine Explosion aus.",
    "Blockiert einen Treffer; lädt in 18→12s nach.",
    "Jeder sechste Treffer löst eine größere Frostexplosion aus.",
    "Jeder dritte Treffer auf ein verlangsamtes Ziel erzeugt eine Eisexplosion.",
    "Alle 8s werden Gegner verlangsamt. Ränge vergrößern die Fläche.",
    "Nach 500→350 Bewegung schlägt ein Blitz ein.",
    "Alle 6s werden 3→4 nahe Gegner getroffen.",
    "Der dritte Treffer springt auf 1→2 weitere Gegner.",
    "Kritische Treffer beschleunigen das Feuer 1,5s. Ränge erhöhen das Tempo."
  ],
  "it": [
    "Ogni 180 di movimento lascia fuoco per 3s. Il grado amplia l’area.",
    "Ogni sesto colpo provoca una grande esplosione. Il grado amplia l’area.",
    "I colpi bruciano per 3s. Il grado raddoppia il danno da bruciatura.",
    "Una volta per partita, un colpo fatale ripristina 3→5 salute ed esplode.",
    "Assorbe un colpo; ricarica in 18→12s.",
    "Ogni sesto colpo scatena un’esplosione gelida più ampia.",
    "Ogni terzo colpo su un bersaglio rallentato causa un’esplosione di ghiaccio.",
    "Ogni 8s rallenta intorno. Il grado amplia l’area.",
    "Muoversi per 500→350 scatena un fulmine automatico.",
    "Ogni 6s colpisce 3→4 nemici vicini.",
    "L’arco del terzo colpo raggiunge altri 1→2 nemici.",
    "I critici accelerano il fuoco automatico per 1,5s. Il grado aumenta la velocità."
  ],
  "ru": [
    "Каждые 180 движения оставляют огонь на 3с. Ранг увеличивает радиус.",
    "Каждое шестое попадание вызывает большой взрыв. Ранг увеличивает радиус.",
    "Попадания поджигают на 3с. Ранг удваивает урон горения.",
    "Раз за бой смертельный удар восстанавливает 3→5 здоровья и вызывает взрыв.",
    "Поглощает удар; перезарядка 18→12с.",
    "Каждое шестое попадание вызывает широкий ледяной взрыв.",
    "Каждое третье попадание по замедленной цели раскалывает лёд вокруг.",
    "Каждые 8с замедляет врагов вокруг. Ранг увеличивает радиус.",
    "После 500→350 движения автоматически бьёт молния.",
    "Каждые 6с поражает 3→4 ближайших врагов.",
    "Дуга третьего попадания задевает ещё 1→2 врагов.",
    "Критические удары ускоряют стрельбу на 1,5с. Ранг увеличивает скорость."
  ],
  "hi": [
    "हर 180 दूरी पर 3 सेकंड आग। स्तर से क्षेत्र बढ़ता है।",
    "हर छठी चोट पर बड़ा विस्फोट। स्तर से क्षेत्र बढ़ता है।",
    "चोट 3 सेकंड जलाती है। स्तर से जलन क्षति दुगुनी।",
    "हर खेल में एक बार घातक चोट पर 3→5 जीवन लौटता और विस्फोट होता है।",
    "एक चोट रोकता है; 18→12 सेकंड में फिर तैयार।",
    "हर छठी चोट पर बड़ा हिम विस्फोट।",
    "धीमे दुश्मन पर हर तीसरी चोट हिम विस्फोट करती है।",
    "हर 8 सेकंड आसपास धीमा करता है। स्तर से क्षेत्र बढ़ता है।",
    "500→350 दूरी चलने पर अपने आप बिजली गिरती है।",
    "हर 6 सेकंड पास के 3→4 दुश्मनों को बिजली लगती है।",
    "तीसरी चोट की बिजली 1→2 और दुश्मनों तक जाती है।",
    "क्रिटिकल के बाद 1.5 सेकंड तेज स्वचालित हमला। स्तर से गति बढ़ती है।"
  ],
  "ar": [
    "كل 180 حركة تترك نارًا 3 ثوان. تزيد الرتبة المساحة.",
    "كل إصابة سادسة تسبب انفجارًا واسعًا. تزيد الرتبة المساحة.",
    "الإصابات تحرق 3 ثوان. تضاعف الرتبة ضرر الحرق.",
    "مرة في الجولة، تعيد الضربة القاتلة 3→5 صحة وتسبب انفجارًا.",
    "يمتص ضربة؛ يعاد شحنه خلال 18→12 ثانية.",
    "كل إصابة سادسة تسبب انفجار صقيع أوسع.",
    "كل إصابة ثالثة لهدف بطيء تسبب انفجار جليد.",
    "كل 8 ثوان يبطئ المحيط. تزيد الرتبة المساحة.",
    "بعد حركة 500→350 يطلق برقًا تلقائيًا.",
    "كل 6 ثوان يصيب 3→4 أعداء قريبين.",
    "قوس الإصابة الثالثة يمتد إلى 1→2 عدو إضافي.",
    "الضربات الحرجة تسرع الإطلاق 1.5 ثانية. تزيد الرتبة السرعة."
  ]
};
const ui={
  "en": [
    "Adventure level",
    "Talent points",
    "Close",
    "Companion equipped",
    "One point per adventure level. Max each parent to continue. New element paths open at levels 11 and 21. Equip one pet.",
    "Free reset returns all talent points."
  ],
  "zh-Hant": [
    "冒險等級",
    "天賦點",
    "關閉",
    "已攜帶寵物",
    "冒險每升一級獲得 1 點；前置升滿才能繼續。11、21 級開放更多元素路線，可混搭能力。最多攜帶一隻寵物。",
    "免費重置，全額退還天賦點。"
  ],
  "zh-Hans": [
    "冒险等级",
    "天赋点",
    "关闭",
    "已携带宠物",
    "冒险每升一级获得 1 点；前置升满才能继续。11、21 级开放更多元素路线，可混搭能力。最多携带一只宠物。",
    "免费重置，全额退还天赋点。"
  ],
  "ja": [
    "冒険レベル",
    "才能ポイント",
    "閉じる",
    "ペット装備中",
    "冒険レベルごとに1ポイント。前提を最大にして進みます。レベル11と21で別の属性を解放。ペットは1体。",
    "無料リセットで全ポイント返還。"
  ],
  "ko": [
    "모험 레벨",
    "특성 포인트",
    "닫기",
    "펫 장착됨",
    "모험 레벨마다 1포인트. 이전 능력을 최대로 올려 진행하세요. 11, 21레벨에 새 원소 경로가 열립니다. 펫은 1마리.",
    "무료 초기화로 모든 포인트 반환."
  ],
  "es": [
    "Nivel de aventura",
    "Puntos de talento",
    "Cerrar",
    "Mascota equipada",
    "Un punto por nivel de aventura. Completa cada requisito. Nuevas rutas elementales en los niveles 11 y 21. Una mascota equipada.",
    "Reinicio gratis: se devuelven todos los puntos."
  ],
  "pt-BR": [
    "Nível de aventura",
    "Pontos de talento",
    "Fechar",
    "Pet equipado",
    "Um ponto por nível de aventura. Maximize os requisitos. Novas rotas nos níveis 11 e 21. Equipe um pet.",
    "Redefinição grátis devolve todos os pontos."
  ],
  "fr": [
    "Niveau d’aventure",
    "Points de talent",
    "Fermer",
    "Compagnon équipé",
    "Un point par niveau d’aventure. Maximisez les prérequis. Nouvelles voies aux niveaux 11 et 21. Un seul compagnon équipé.",
    "La réinitialisation gratuite rend tous les points."
  ],
  "de": [
    "Abenteuerstufe",
    "Talentpunkte",
    "Schließen",
    "Begleiter ausgerüstet",
    "Ein Punkt je Abenteuerstufe. Voraussetzungen maximieren. Neue Elementpfade auf Stufe 11 und 21. Ein Begleiter ausrüstbar.",
    "Kostenloses Zurücksetzen erstattet alle Punkte."
  ],
  "it": [
    "Livello avventura",
    "Punti talento",
    "Chiudi",
    "Compagno equipaggiato",
    "Un punto per livello avventura. Massimizza i requisiti. Nuovi percorsi ai livelli 11 e 21. Un solo compagno equipaggiato.",
    "Il ripristino gratuito restituisce tutti i punti."
  ],
  "ru": [
    "Уровень приключения",
    "Очки талантов",
    "Закрыть",
    "Спутник выбран",
    "Одно очко за уровень приключения. Улучшайте предыдущий узел до предела. Новые пути на уровнях 11 и 21. Один спутник.",
    "Бесплатный сброс возвращает все очки."
  ],
  "hi": [
    "साहसिक स्तर",
    "प्रतिभा अंक",
    "बंद करें",
    "साथी सुसज्जित",
    "हर साहसिक स्तर पर एक अंक। पिछला कौशल पूरा बढ़ाएँ। स्तर 11 और 21 पर नए तत्व मार्ग। एक साथी रख सकते हैं।",
    "मुफ्त रीसेट से सभी अंक वापस मिलते हैं।"
  ],
  "ar": [
    "مستوى المغامرة",
    "نقاط المواهب",
    "إغلاق",
    "الرفيق مجهز",
    "نقطة لكل مستوى مغامرة. أكمل رتبة المتطلب السابق. مسارات جديدة في المستويين 11 و21. رفيق واحد فقط.",
    "إعادة الضبط المجانية تعيد كل النقاط."
  ]
};
const base=window.CrystalTalents.copy;window.CrystalTalents.copy=locale=>{const c=base(locale),code=ui[locale]?locale:"en",r=ui[code];return {...c,adventureLevel:r[0],points:r[1],treeClose:r[2],petActive:r[3],routeHint:r[4],pointRefund:r[5],names:{...c.names,...Object.fromEntries(ids.map((id,i)=>[id,names[code][i]]))},descriptions:{...c.descriptions,...Object.fromEntries(ids.map((id,i)=>[id,descriptions[code][i]]))}};};
})();

(()=>{const notes={"en": "Adventure XP is awarded after battle; this level persists between runs.", "zh-Hant": "冒險經驗於戰鬥結算時取得；冒險等級會永久保留，與局內升級分開。", "zh-Hans": "冒险经验在战斗结算时获得；冒险等级永久保留，与局内升级分开。", "ja": "冒険経験値は戦闘終了時に獲得し、レベルは次の戦闘にも引き継ぎます。", "ko": "모험 경험치는 전투 정산 때 받으며 모험 레벨은 다음 전투에도 유지됩니다.", "es": "La experiencia de aventura se obtiene al terminar y su nivel se conserva entre partidas.", "pt-BR": "A experiência de aventura é recebida ao concluir a batalha e seu nível persiste entre partidas.", "fr": "L’expérience d’aventure est gagnée en fin de combat ; ce niveau persiste entre les parties.", "de": "Abenteuer-EP gibt es am Kampfende. Diese Stufe bleibt zwischen Runden erhalten.", "it": "L’esperienza avventura si ottiene a fine battaglia; questo livello resta tra le partite.", "ru": "Опыт приключения начисляется после боя. Этот уровень сохраняется между боями.", "hi": "साहसिक अनुभव लड़ाई के अंत में मिलता है। यह स्तर अगले खेल में भी बना रहता है।", "ar": "تُمنح خبرة المغامرة بعد المعركة ويُحفظ هذا المستوى بين الجولات."};const base=window.CrystalTalents.copy;window.CrystalTalents.copy=locale=>{const c=base(locale);return {...c,routeHint:c.routeHint+" "+(notes[locale]||notes.en)}}})();
